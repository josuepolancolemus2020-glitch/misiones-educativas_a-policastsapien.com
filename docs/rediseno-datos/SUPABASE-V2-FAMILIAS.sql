-- ============================================================================
-- M.E.T.A.S · Vista de padres v2 · PROPUESTA (FASE 1: SOLO DISEÑO)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Va DESPUÉS de SUPABASE-V2-ESQUEMA.sql.
--
-- Qué resuelve: el portal y el asistente de padres leen las MISMAS filas que
-- escribe el docente (alumnos, colectas, pagos, notas, asistencia, avisos…),
-- por vistas de solo lectura, sin copias:
--   · nada de registro_admin ni mensajes_docente (copias que armaba el
--     aparato del docente a partir de su blob);
--   · nada de METAS_PADRE_CACHE_V1 en el teléfono del padre;
--   · un pago borrado o corregido se ve igual para el padre al instante.
--
-- Cómo sabe la base QUIÉN es el padre (para la RLS):
--   1. padres.html abre una sesión ANÓNIMA de Supabase Auth
--      (supabase.auth.signInAnonymously()). El padre no crea cuenta ni
--      contraseña: lo que ve es igual que hoy, escribe la clave de familia.
--   2. metas.familia_vincular(clave) une esa sesión con la familia
--      (metas.familia_accesos). Varios hijos = varias filas.
--   3. Las vistas metas.vf_* filtran por los alumnos vinculados a auth.uid().
--      El filtro es RLS de verdad: las vistas pertenecen al rol
--      metas_lector_familias, que NO salta la RLS, y las políticas de ese rol
--      sobre las tablas solo dejan pasar filas de alumnos vinculados.
--   4. El padre no tiene permiso de escritura sobre nada de metas: ni
--      INSERT/UPDATE/DELETE en tablas, ni las vistas son actualizables para él.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Vínculo sesión ↔ familia
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.familia_accesos (
  id           uuid        primary key default gen_random_uuid(),
  auth_uid     uuid        not null,                 -- sesión anónima del teléfono del padre
  familia_id   uuid        not null references metas.familias (id),
  -- La clave con la que se vinculó. Si el docente le cambia la clave a la
  -- familia (porque se perdió la tira), este vínculo deja de valer solo.
  clave_usada  text        not null,
  alias        text        check (length(alias) <= 40),   -- «Ana», para el selector de hijos
  created_at   timestamptz not null default now(),
  revocado_at  timestamptz
);
create unique index if not exists familia_accesos_unico on metas.familia_accesos (auth_uid, familia_id)
  where revocado_at is null;
alter table metas.familia_accesos enable row level security;
create policy familia_accesos_mios on metas.familia_accesos for select to authenticated
  using (auth_uid = auth.uid());
revoke all on metas.familia_accesos from public, anon, authenticated;
grant select on metas.familia_accesos to authenticated;
-- Solo las funciones de abajo escriben aquí.

-- Alumnos que la sesión actual puede ver. STABLE para que el planificador la
-- evalúe una vez por consulta. Comprueba, en cada lectura:
--   · que el vínculo no esté revocado,
--   · que la familia siga activa y con la MISMA clave,
--   · que el alumno siga activo.
create or replace function metas.familia_alumnos()
returns setof uuid language sql stable security definer set search_path = metas, pg_temp as $$
  select f.alumno_id
    from metas.familia_accesos fa
    join metas.familias f on f.id = fa.familia_id
                         and f.deleted_at is null
                         and upper(replace(f.clave, '-', '')) = upper(replace(fa.clave_usada, '-', ''))
    join metas.alumnos  a on a.id = f.alumno_id and a.deleted_at is null
   where fa.auth_uid = auth.uid()
     and fa.revocado_at is null
$$;
revoke all on function metas.familia_alumnos() from public, anon;
grant execute on function metas.familia_alumnos() to authenticated;

create or replace function metas.familia_aulas()
returns setof uuid language sql stable security definer set search_path = metas, pg_temp as $$
  select distinct a.aula_id from metas.alumnos a where a.id in (select metas.familia_alumnos())
$$;
revoke all on function metas.familia_aulas() from public, anon;
grant execute on function metas.familia_aulas() to authenticated;

-- ── Vincular: el padre escribe la clave de la tira ─────────────────────────
create or replace function metas.familia_vincular(p_clave text, p_alias text default null)
returns jsonb language plpgsql volatile security definer set search_path = metas, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_ip  text := metas.ip_cliente();
  v_cl  text := upper(replace(trim(coalesce(p_clave, '')), '-', ''));
  f     metas.familias;
  a     metas.alumnos;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'motivo', 'sesion');
  end if;
  -- Solo sesiones anónimas: una cuenta de docente no se vincula como padre.
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'motivo', 'sesion');
  end if;
  if not metas.freno_ok('famvinc:' || v_ip, 60, interval '1 hour')
     or not metas.freno_ok('famvinc-uid:' || v_uid, 20, interval '1 hour') then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;
  if v_cl !~ '^[0-9]{1,2}[A-Z0-9]{4,8}$' then
    perform metas.freno_ok('famfallo:' || v_ip, 20, interval '1 hour');
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into f from metas.familias
   where upper(replace(clave, '-', '')) = v_cl and deleted_at is null;
  if not found then
    if not metas.freno_ok('famfallo:' || v_ip, 20, interval '1 hour') then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into a from metas.alumnos where id = f.alumno_id and deleted_at is null;
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  if (select count(*) from metas.familia_accesos where auth_uid = v_uid and revocado_at is null) >= 10 then
    return jsonb_build_object('ok', false, 'motivo', 'muchos');
  end if;
  insert into metas.familia_accesos (auth_uid, familia_id, clave_usada, alias)
  values (v_uid, f.id, f.clave, left(coalesce(nullif(trim(p_alias), ''), split_part(a.nombre_completo, ' ', 1)), 40))
  on conflict do nothing;
  return jsonb_build_object('ok', true, 'familia_id', f.id,
                            'alias', split_part(a.nombre_completo, ' ', 1));
end $$;
revoke all on function metas.familia_vincular(text, text) from public, anon;
grant execute on function metas.familia_vincular(text, text) to authenticated;

-- ── Quitar un hijo de este teléfono ────────────────────────────────────────
create or replace function metas.familia_desvincular(p_familia uuid)
returns boolean language sql volatile security definer set search_path = metas, pg_temp as $$
  update metas.familia_accesos set revocado_at = now()
   where auth_uid = auth.uid() and familia_id = p_familia and revocado_at is null
  returning true
$$;
revoke all on function metas.familia_desvincular(uuid) from public, anon;
grant execute on function metas.familia_desvincular(uuid) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Rol lector de familias y RLS sobre las tablas del docente
-- ════════════════════════════════════════════════════════════════════════════
-- Rol sin entrada propia y SIN bypassrls. Es el dueño de las vistas vf_*;
-- como la vista corre con los permisos de su dueño, la RLS que se aplica es
-- la de ESTE rol, y su política pregunta por auth.uid() de quien consulta.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'metas_lector_familias') then
    create role metas_lector_familias nologin nobypassrls;
  end if;
end $$;
grant usage on schema metas to metas_lector_familias;
-- Para poder ser dueño de las vistas (ALTER VIEW … OWNER TO exige CREATE en el
-- esquema y poder asumir el rol). No le da permiso sobre ninguna tabla.
grant create on schema metas to metas_lector_familias;
grant metas_lector_familias to postgres;
grant execute on function metas.familia_alumnos(), metas.familia_aulas() to metas_lector_familias;

-- SOLO las columnas que una familia puede ver (nada de identidad, teléfono,
-- device_id, updated_by, ni notas privadas del pago).
grant select (id, aula_id, nombre_completo, deleted_at)                          on metas.alumnos     to metas_lector_familias;
grant select (id, escuela, grado, seccion, anio_lectivo, docente_nombre, deleted_at) on metas.aulas   to metas_lector_familias;
grant select (id, aula_id, nombre, orden, deleted_at)                            on metas.asignaturas to metas_lector_familias;
grant select (id, aula_id, periodo, desde, hasta, deleted_at)                    on metas.periodos    to metas_lector_familias;
grant select (id, aula_id, concepto, monto_sugerido, fecha, deleted_at)          on metas.colectas    to metas_lector_familias;
grant select (id, colecta_id, alumno_id, deleted_at)                             on metas.colecta_exenciones to metas_lector_familias;
grant select (id, aula_id, colecta_id, alumno_id, monto, fecha, recibo, recibo_anterior, created_at, updated_at, deleted_at) on metas.pagos to metas_lector_familias;
grant select (id, colecta_id, fecha, concepto, monto, deleted_at)                on metas.gastos      to metas_lector_familias;
grant select (id, alumno_id, asignatura_id, periodo, componente, valor, deleted_at) on metas.notas    to metas_lector_familias;
grant select (id, alumno_id, periodo, rasgo, letra, deleted_at)                  on metas.notas_personalidad to metas_lector_familias;
grant select (id, alumno_id, fecha, estado, deleted_at)                          on metas.asistencia  to metas_lector_familias;
grant select (id, alumno_id, periodo, dias, deleted_at)                          on metas.inasistencias_oficiales to metas_lector_familias;
grant select (id, aula_id, tipo, titulo, texto, fecha_evento, hasta, deleted_at) on metas.avisos      to metas_lector_familias;
grant select (id, aviso_id, alumno_id, deleted_at)                               on metas.aviso_destinatarios to metas_lector_familias;
grant select (id, alumno_id, tipo, texto, fecha, visible_hasta, para_familia, deleted_at) on metas.observaciones to metas_lector_familias;
grant select (id, aula_id, pregunta, claves, respuesta, activa, deleted_at)      on metas.preguntas_frecuentes to metas_lector_familias;
grant select (id, analisis_id, alumno_id, nota, no_se_presento, categoria, mensaje, enviado, deleted_at) on metas.analisis_alumnos to metas_lector_familias;
grant select (id, evaluacion, asignatura_id, periodo, fecha_prueba, deleted_at)  on metas.analisis    to metas_lector_familias;

-- Políticas: una por tabla, solo SELECT, solo filas activas de sus alumnos.
create policy familia_lee on metas.alumnos       for select to metas_lector_familias
  using (deleted_at is null and id in (select metas.familia_alumnos()));
create policy familia_lee on metas.aulas         for select to metas_lector_familias
  using (deleted_at is null and id in (select metas.familia_aulas()));
create policy familia_lee on metas.asignaturas   for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.periodos      for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.colectas      for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.colecta_exenciones for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.pagos         for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
-- Los gastos de una colecta son «cuentas claras» del grado: los ve toda
-- familia del aula, sin datos de nadie.
create policy familia_lee on metas.gastos        for select to metas_lector_familias
  using (deleted_at is null and tipo = 'colecta' and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.notas         for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.notas_personalidad for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.asistencia    for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.inasistencias_oficiales for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.avisos        for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.aviso_destinatarios for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.observaciones for select to metas_lector_familias
  using (deleted_at is null and para_familia and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.preguntas_frecuentes for select to metas_lector_familias
  using (deleted_at is null and activa and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.analisis_alumnos for select to metas_lector_familias
  using (deleted_at is null and enviado and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.analisis      for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Vistas de solo lectura para padres (lo único que lee padres.html)
-- ════════════════════════════════════════════════════════════════════════════
-- security_invoker = false (por defecto): corren como su dueño,
-- metas_lector_familias, y por eso les aplica la RLS de arriba con el
-- auth.uid() de quien consulta. Un docente que las consulte recibe 0 filas.
-- No son actualizables para nadie: authenticated solo tiene SELECT.

create or replace view metas.vf_hijos as
select a.id as alumno_id, split_part(a.nombre_completo, ' ', 1) as nombre,
       au.grado, au.seccion, au.escuela, au.anio_lectivo, au.docente_nombre as docente
  from metas.alumnos a join metas.aulas au on au.id = a.aula_id;

-- Lo que debe y lo que dio, por colecta. Calculado en cada lectura desde
-- metas.pagos: si el docente borra o corrige un pago, la próxima lectura ya
-- lo trae así. No hay otra copia de la que pudiera salir un pago viejo.
create or replace view metas.vf_colectas as
select a.id as alumno_id, c.id as colecta_id, c.concepto, c.fecha, c.monto_sugerido,
       (e.id is not null)                         as no_le_corresponde,
       coalesce(p.monto, 0)                       as pagado,
       p.fecha                                    as fecha_pago,
       case when e.id is not null then 'no_corresponde'
            when p.id is null then 'debe'
            when p.monto < c.monto_sugerido then 'abono'
            else 'pagado' end                     as situacion,
       greatest(c.monto_sugerido - coalesce(p.monto, 0), 0) as falta,
       -- el número de recibo ES el del pago (único e inmutable): si el docente
       -- corrige el monto, el recibo conserva su número y muestra el monto
       -- nuevo y la fecha de la corrección; si lo borra, el recibo desaparece
       p.recibo                                   as recibo,
       p.recibo_anterior                          as recibo_anterior,
       case when p.id is not null and p.updated_at > p.created_at + interval '1 minute'
            then p.updated_at end                 as corregido_at
  from metas.alumnos a
  join metas.colectas c on c.aula_id = a.aula_id
  left join metas.colecta_exenciones e on e.colecta_id = c.id and e.alumno_id = a.id
  left join metas.pagos p on p.colecta_id = c.id and p.alumno_id = a.id;

-- Cuentas claras del grado (antes un comunicado AVC armado en el aparato).
create or replace view metas.vf_cuentas_claras as
select c.id as colecta_id, c.aula_id, c.concepto,
       (select coalesce(sum(g.monto), 0) from metas.gastos g where g.colecta_id = c.id) as gastado,
       (select coalesce(jsonb_agg(jsonb_build_object('fecha', g.fecha, 'concepto', g.concepto, 'monto', g.monto)
                                  order by g.fecha), '[]'::jsonb)
          from metas.gastos g where g.colecta_id = c.id)                                as gastos
  from metas.colectas c;
-- (Lo recaudado del grado NO se le muestra a la familia porque la política de
--  pagos solo le deja ver los de su hijo. Si se quiere mostrar, se hace con
--  una función que devuelva solo la suma: decisión pendiente, ver 07-VISTA-DE-PADRES.md.)

create or replace view metas.vf_notas as
select n.alumno_id, s.nombre as asignatura, n.periodo, n.componente, n.valor
  from metas.notas n join metas.asignaturas s on s.id = n.asignatura_id;

create or replace view metas.vf_personalidad as
select alumno_id, periodo, rasgo, letra from metas.notas_personalidad;

create or replace view metas.vf_asistencia as
select alumno_id, fecha, estado from metas.asistencia;

create or replace view metas.vf_avisos as
select a.id as alumno_id, av.id as aviso_id, av.tipo, av.titulo, av.texto, av.fecha_evento, av.hasta
  from metas.alumnos a
  join metas.avisos av on av.aula_id = a.aula_id
 where (av.hasta is null or av.hasta >= current_date)
   and ( not exists (select 1 from metas.aviso_destinatarios d where d.aviso_id = av.id)
         or exists (select 1 from metas.aviso_destinatarios d where d.aviso_id = av.id and d.alumno_id = a.id));
-- Nota: el «not exists» ve solo los destinatarios de SUS hijos (RLS). Por eso
-- la implementación debe marcar el aviso individual con tipo = 'individual'
-- y filtrar por tipo, no por la ausencia de destinatarios. Se deja escrito
-- así para revisarlo en la fase de implementación.

create or replace view metas.vf_observaciones as
select alumno_id, tipo, texto, fecha from metas.observaciones
 where visible_hasta is null or visible_hasta >= current_date;

create or replace view metas.vf_plan_accion as
select aa.alumno_id, an.evaluacion, an.periodo, an.fecha_prueba,
       aa.nota, aa.no_se_presento, aa.categoria, aa.mensaje
  from metas.analisis_alumnos aa join metas.analisis an on an.id = aa.analisis_id;

create or replace view metas.vf_preguntas as
select aula_id, pregunta, claves, respuesta from metas.preguntas_frecuentes;

do $$
declare v text;
begin
  foreach v in array array['vf_hijos','vf_colectas','vf_cuentas_claras','vf_notas','vf_personalidad',
                           'vf_asistencia','vf_avisos','vf_observaciones','vf_plan_accion','vf_preguntas'] loop
    execute format('alter view metas.%I owner to metas_lector_familias', v);
    execute format('revoke all on metas.%I from public, anon, authenticated', v);
    execute format('grant select on metas.%I to authenticated', v);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. «De inmediato»: aviso por Realtime al teléfono del padre
-- ════════════════════════════════════════════════════════════════════════════
-- Los padres NO se suscriben a las tablas (recibirían filas completas). Se
-- suscriben a un canal PRIVADO por familia, y la base les manda solo un
-- toque sin datos: «algo cambió». El teléfono vuelve a leer las vistas vf_*.
-- Así, un pago borrado o corregido se ve igual en el padre en menos de un
-- segundo después de que el cambio del docente llega a Supabase.
create or replace function metas.t_tocar_familias()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_alumno uuid := (to_jsonb(new) ->> 'alumno_id')::uuid;
  v_aula   uuid := (to_jsonb(new) ->> 'aula_id')::uuid;
  r record;
begin
  for r in
    select f.id from metas.familias f
     where f.deleted_at is null
       and ( (v_alumno is not null and f.alumno_id = v_alumno)
          or (v_alumno is null and v_aula is not null and f.aula_id = v_aula) )
  loop
    perform realtime.send(jsonb_build_object('tabla', tg_table_name), 'cambio',
                          'familia:' || r.id::text, true);
  end loop;
  return null;
end $$;
revoke all on function metas.t_tocar_familias() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['alumnos','colectas','colecta_exenciones','pagos','gastos','notas',
                           'notas_personalidad','asistencia','inasistencias_oficiales','avisos',
                           'aviso_destinatarios','observaciones','preguntas_frecuentes',
                           'analisis_alumnos','familias'] loop
    execute format('create trigger %I after insert or update on metas.%I for each row execute function metas.t_tocar_familias()',
                   t || '_tocar_familias', t);
  end loop;
end $$;
-- (alumnos no tiene alumno_id: el disparador usa aula_id y toca a todas las
--  familias del aula; en implementación se afina para tocar solo la suya.)

-- Quién puede escuchar qué canal privado:
create policy familias_escuchan_su_canal on realtime.messages
  for select to authenticated
  using (
    realtime.topic() like 'familia:%'
    and exists (select 1 from metas.familia_accesos fa
                 where fa.auth_uid = auth.uid() and fa.revocado_at is null
                   and 'familia:' || fa.familia_id::text = realtime.topic())
  );

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Comprobaciones (fase de implementación)
-- ════════════════════════════════════════════════════════════════════════════
-- a) Con una sesión anónima vinculada a la familia de Ana (datos ficticios):
--      select count(*) from metas.pagos;            → 0  (sin permiso directo)
--      select * from metas.vf_colectas;             → solo filas de Ana
-- b) Con la misma sesión, intentar escribir:
--      update metas.pagos set monto = 1;            → permiso denegado
--      insert into metas.vf_colectas ...            → permiso denegado
-- c) El docente borra el pago de Ana → en < 1 s llega «cambio» al canal
--    familia:<id> y vf_colectas ya no lo trae (situacion = 'debe').
-- d) El docente cambia la clave de la familia → la sesión vieja ya no ve
--    nada (familia_alumnos compara la clave actual con clave_usada).
-- ============================================================================
