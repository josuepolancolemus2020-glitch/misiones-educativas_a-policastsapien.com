-- ============================================================================
-- M.E.T.A.S · Archivar un centro con sus grupos y alumnos, y borrarlo de verdad
-- ----------------------------------------------------------------------------
-- NO está aplicado. Se pega en el SQL Editor DESPUÉS de
-- SUPABASE-V2-RECUPERAR-CENTRO.sql, cuando Josué ya dio el sí.
-- Se puede pegar otra vez: reemplaza estas funciones y no toca filas.
--
-- Hasta pegarlo, la aplicación llama a estas funciones, la base dice que
-- no existen y la pantalla avisa. No archiva ni borra nada en el aparato.
--
-- Qué hace:
--   · centro_archivar: pone deleted_at, en la misma hora, al centro, a sus
--     grupos vivos y a los alumnos vivos de esos grupos. Solo si son del
--     docente que está dentro (auth.uid()). El último centro vivo no se
--     archiva.
--   · centro_volver: les quita deleted_at a ese centro y a los grupos y
--     alumnos que se archivaron con él (la misma hora). Un grupo que ya
--     estaba archivado antes se queda archivado. Si el nombre choca con
--     otro centro vivo, no cambia nada (23505).
--   · centro_borrar: borra de verdad el centro y lo que cuelga de sus
--     grupos. Cada DELETE lleva owner = auth.uid(). Lo de otro maestro
--     no se toca. Si algo no se puede soltar, la transacción entera se
--     deshace y no queda un borrado a medias.
--
-- El docente, por la API, no puede saltarse el disparador: el permiso
-- extra solo vale dentro de estas funciones (corren como dueño de la
-- tabla, no como el rol authenticated).
--
-- Comprobar, después de pegarlo (no borra nada):
--   select proname from pg_proc p
--     join pg_namespace n on n.oid = p.pronamespace
--    where n.nspname = 'metas'
--      and proname in ('centro_archivar', 'centro_volver', 'centro_borrar');
--   Tiene que devolver 3 filas.
-- ============================================================================

-- Recuperar grupos y alumnos solo desde centro_volver.
-- Un PATCH directo del docente sigue sin poder revivirlos.
create or replace function metas.t_sellar()
returns trigger language plpgsql set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_ap  text := metas.aparato();
  c     text;
  v_revivir boolean;
begin
  if v_uid is null or not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    new.id           := coalesce(new.id, gen_random_uuid());
    new.owner        := v_uid;
    new.created_at   := now();
    new.updated_at   := now();
    new.updated_by   := v_uid;
    new.device_id    := coalesce(v_ap, nullif(new.device_id, ''), 'desconocido');
    new.version      := 1;
    new.deleted_at   := null;
    new.op_creacion  := coalesce(new.op_creacion, metas.op_actual());
    return new;
  end if;

  if old.deleted_at is not null then
    v_revivir := new.deleted_at is null
      and current_setting('metas.recuperar_centro', true) = 'si'
      and current_user not in ('authenticated', 'anon', 'authenticator')
      and tg_table_name in ('centros', 'aulas', 'alumnos');
    if not (v_revivir or (tg_table_name = 'centros' and new.deleted_at is null)) then
      raise exception 'metas: la fila % está borrada', old.id using errcode = 'MT001';
    end if;
  end if;
  if new.id is distinct from old.id
     or new.owner is distinct from old.owner
     or new.created_at is distinct from old.created_at
     or new.op_creacion is distinct from old.op_creacion then
    raise exception 'metas: id, dueño, creación y operación de creación no se cambian' using errcode = 'MT002';
  end if;
  if tg_nargs > 0 then
    foreach c in array tg_argv loop
      if (to_jsonb(new) -> c) is distinct from (to_jsonb(old) -> c) then
        raise exception 'metas: % no se cambia después de crear la fila', c using errcode = 'MT002';
      end if;
    end loop;
  end if;

  new.updated_at := now();
  new.updated_by := v_uid;
  new.device_id  := coalesce(v_ap, nullif(new.device_id, ''), old.device_id);
  new.version    := old.version + 1;
  if new.deleted_at is not null then
    new.deleted_at := now();
  end if;
  return new;
end $$;

-- El borrado de verdad solo entra por centro_borrar. La API del docente
-- no tiene GRANT de DELETE, y además el disparador lo niega.
create or replace function metas.t_sin_delete()
returns trigger language plpgsql as $$
begin
  if current_setting('metas.borrado_definitivo', true) = 'si'
     and current_user not in ('authenticated', 'anon', 'authenticator') then
    return old;
  end if;
  raise exception 'metas: no se borran filas; se marca deleted_at' using errcode = 'MT005';
end $$;

-- «Visto» de un aviso no se edita, salvo este borrado del propio centro.
create or replace function metas.t_auditoria_inmutable()
returns trigger language plpgsql as $$
begin
  if tg_table_name = 'avisos_vistos'
     and tg_op = 'DELETE'
     and current_setting('metas.borrado_definitivo', true) = 'si'
     and current_user not in ('authenticated', 'anon', 'authenticator') then
    return old;
  end if;
  raise exception 'metas: la auditoría es de solo inserción' using errcode = 'MT006';
end $$;

create or replace function metas.centro_archivar(p_centro uuid)
returns jsonb
language plpgsql
security definer
set search_path = metas, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_hora timestamptz;
  v_n int;
begin
  if v_uid is null or not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;

  if not exists (
    select 1 from metas.centros
     where id = p_centro and owner = v_uid and deleted_at is null
  ) then
    raise exception 'metas: ese centro no es tuyo' using errcode = '42501';
  end if;

  select count(*) into v_n
    from metas.centros
   where owner = v_uid and deleted_at is null;
  if v_n < 2 then
    raise exception 'metas: no se archiva el último centro' using errcode = 'MT040';
  end if;

  -- La misma now() de la transacción: recuperar reconoce lo que se fue junto.
  update metas.alumnos
     set deleted_at = now()
   where owner = v_uid
     and deleted_at is null
     and aula_id in (
       select id from metas.aulas
        where owner = v_uid and centro_id = p_centro and deleted_at is null
     );

  update metas.aulas
     set deleted_at = now()
   where owner = v_uid and centro_id = p_centro and deleted_at is null;

  update metas.centros
     set deleted_at = now()
   where id = p_centro and owner = v_uid and deleted_at is null;

  select deleted_at into v_hora
    from metas.centros
   where id = p_centro and owner = v_uid;

  return jsonb_build_object(
    'ok', true,
    'centro', (select to_jsonb(c) from metas.centros c where c.id = p_centro and c.owner = v_uid),
    'aulas', coalesce((
      select jsonb_agg(to_jsonb(a)) from metas.aulas a
       where a.owner = v_uid and a.centro_id = p_centro and a.deleted_at = v_hora
    ), '[]'::jsonb),
    'alumnos', coalesce((
      select jsonb_agg(to_jsonb(al)) from metas.alumnos al
       where al.owner = v_uid and al.deleted_at = v_hora
         and al.aula_id in (select id from metas.aulas where owner = v_uid and centro_id = p_centro)
    ), '[]'::jsonb)
  );
end $$;

create or replace function metas.centro_volver(p_centro uuid)
returns jsonb
language plpgsql
security definer
set search_path = metas, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_hora timestamptz;
  v_nombre text;
  v_anio smallint;
begin
  if v_uid is null or not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;

  select deleted_at, nombre, anio_lectivo
    into v_hora, v_nombre, v_anio
    from metas.centros
   where id = p_centro and owner = v_uid and deleted_at is not null;
  if not found then
    raise exception 'metas: ese centro no es tuyo' using errcode = '42501';
  end if;

  if exists (
    select 1 from metas.centros
     where owner = v_uid and deleted_at is null and id <> p_centro
       and anio_lectivo = v_anio
       and metas.norm_nombre(nombre) = metas.norm_nombre(v_nombre)
  ) then
    raise exception 'metas: ya tienes otro centro con ese nombre' using errcode = '23505';
  end if;

  perform set_config('metas.recuperar_centro', 'si', true);

  update metas.centros
     set deleted_at = null
   where id = p_centro and owner = v_uid and deleted_at = v_hora;

  update metas.aulas
     set deleted_at = null
   where owner = v_uid and centro_id = p_centro and deleted_at = v_hora;

  update metas.alumnos
     set deleted_at = null
   where owner = v_uid and deleted_at = v_hora
     and aula_id in (
       select id from metas.aulas where owner = v_uid and centro_id = p_centro
     );

  return jsonb_build_object(
    'ok', true,
    'centro', (select to_jsonb(c) from metas.centros c where c.id = p_centro and c.owner = v_uid),
    'aulas', coalesce((
      select jsonb_agg(to_jsonb(a)) from metas.aulas a
       where a.owner = v_uid and a.centro_id = p_centro and a.deleted_at is null
         and a.updated_at = (select updated_at from metas.centros where id = p_centro and owner = v_uid)
    ), '[]'::jsonb),
    'alumnos', coalesce((
      select jsonb_agg(to_jsonb(al)) from metas.alumnos al
       where al.owner = v_uid and al.deleted_at is null
         and al.aula_id in (select id from metas.aulas where owner = v_uid and centro_id = p_centro)
         and al.updated_at = (select updated_at from metas.centros where id = p_centro and owner = v_uid)
    ), '[]'::jsonb)
  );
end $$;

create or replace function metas.centro_borrar(p_centro uuid)
returns jsonb
language plpgsql
security definer
set search_path = metas, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_aulas uuid[];
begin
  if v_uid is null or not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;

  if not exists (
    select 1 from metas.centros where id = p_centro and owner = v_uid
  ) then
    raise exception 'metas: ese centro no es tuyo' using errcode = '42501';
  end if;

  select coalesce(array_agg(id), '{}') into v_aulas
    from metas.aulas
   where owner = v_uid and centro_id = p_centro;

  perform set_config('metas.borrado_definitivo', 'si', true);

  delete from metas.eleccion_votos
   where owner = v_uid
     and eleccion_id in (
       select id from metas.elecciones where owner = v_uid and aula_id = any(v_aulas)
     );
  delete from metas.elecciones
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.campeonatos
   where owner = v_uid and aula_id = any(v_aulas);

  delete from metas.avisos_vistos
   where owner = v_uid
     and aviso_id in (
       select id from metas.avisos where owner = v_uid and aula_id = any(v_aulas)
     );
  delete from metas.familia_accesos
   where familia_id in (
       select id from metas.familias where owner = v_uid and aula_id = any(v_aulas)
     );

  delete from metas.aviso_destinatarios
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.avisos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.preguntas_frecuentes
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.observaciones
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.control_valores
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.controles
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.evaluacion_puntos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.evaluaciones
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.notas
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.notas_personalidad
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.inasistencias_oficiales
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.asistencia
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.asistencia_dias
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.lecturas
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.bitacora
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.analisis_alumnos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.analisis
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.reparto_miembros
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.repartos
   where owner = v_uid and aula_id = any(v_aulas);

  delete from metas.convocatoria_pagos
   where owner = v_uid
     and convocatoria_id in (
       select id from metas.convocatorias where owner = v_uid and aula_id = any(v_aulas)
     )
     and not exists (
       select 1 from metas.convocatoria_pagos h where h.reemplaza_a = convocatoria_pagos.id
     );
  delete from metas.convocatoria_pagos
   where owner = v_uid
     and convocatoria_id in (
       select id from metas.convocatorias where owner = v_uid and aula_id = any(v_aulas)
     );
  delete from metas.convocatoria_inscritos
   where owner = v_uid
     and convocatoria_id in (
       select id from metas.convocatorias where owner = v_uid and aula_id = any(v_aulas)
     );
  delete from metas.convocatorias
   where owner = v_uid and aula_id = any(v_aulas);

  delete from metas.bienes
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.reembolsos
   where owner = v_uid
     and gasto_id in (
       select id from metas.gastos_docente where owner = v_uid and aula_id = any(v_aulas)
     )
     and not exists (
       select 1 from metas.reembolsos h where h.reemplaza_a = reembolsos.id
     );
  delete from metas.reembolsos
   where owner = v_uid
     and gasto_id in (
       select id from metas.gastos_docente where owner = v_uid and aula_id = any(v_aulas)
     );
  delete from metas.gastos_docente
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.gastos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.pagos
   where owner = v_uid and aula_id = any(v_aulas)
     and not exists (
       select 1 from metas.pagos h where h.reemplaza_a = pagos.id
     );
  delete from metas.pagos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.colecta_exenciones
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.colectas
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.familias
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.periodos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.asignaturas
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.alumnos
   where owner = v_uid and aula_id = any(v_aulas);
  delete from metas.aulas
   where owner = v_uid and id = any(v_aulas);
  delete from metas.centros
   where owner = v_uid and id = p_centro;

  return jsonb_build_object('ok', true, 'centro', p_centro);
end $$;

revoke all on function metas.centro_archivar(uuid) from public, anon;
revoke all on function metas.centro_volver(uuid) from public, anon;
revoke all on function metas.centro_borrar(uuid) from public, anon;
grant execute on function metas.centro_archivar(uuid) to authenticated;
grant execute on function metas.centro_volver(uuid) to authenticated;
grant execute on function metas.centro_borrar(uuid) to authenticated;

revoke execute on all functions in schema metas from public;
