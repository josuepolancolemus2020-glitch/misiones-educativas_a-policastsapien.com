-- ============================================================================
-- M.E.T.A.S · Vista de padres v2 · PROPUESTA (FASE 1: SOLO DISEÑO, rev. 2)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Va DESPUÉS de SUPABASE-V2-ESQUEMA.sql.
--
-- El portal y el asistente de padres leen las MISMAS filas que escribe el
-- docente, por vistas de solo lectura, sin copias y sin caché en el teléfono.
--
-- Quién es el padre para la base:
--   1. padres.html abre una sesión ANÓNIMA de Supabase Auth, con CAPTCHA
--      (Turnstile) OBLIGATORIO. El padre no crea cuenta: escribe la clave.
--   2. La función de borde «familia-vincular» comprueba OTRO token Turnstile
--      en cada intento, toma la IP de la infraestructura (no de cabeceras que
--      escribe el cliente) y llama a metas.familia_vincular con la llave de
--      servicio. El padre no puede llamar a esa función directamente.
--   3. Las vistas metas.vf_* filtran por los alumnos vinculados a auth.uid():
--      son del rol metas_lector_familias, que NO salta la RLS, y sus
--      políticas solo dejan pasar filas de esos alumnos.
--
-- Lo que una sesión anónima NO puede hacer (además de lo de arriba):
--   · leer, crear o editar cualquier tabla del docente: cada tabla tiene una
--     política RESTRICTIVA que exige una cuenta de docente vinculada
--     (metas.es_docente(), SUPABASE-V2-ESQUEMA.sql). Esto también impide
--     averiguar si una clave existe intentando insertar una familia: el sello
--     la rechaza antes de llegar al índice único.
--   · escribir en vistas: solo tiene SELECT.
--   · Lo único que escribe, y solo por funciones del servidor: su propio
--     vínculo (por la función de borde) y el «visto» de un aviso.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Vínculo sesión ↔ familia
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.familia_accesos (
  id           uuid        primary key default gen_random_uuid(),
  auth_uid     uuid        not null,                 -- sesión anónima del teléfono del padre
  familia_id   uuid        not null references metas.familias (id),
  -- La clave con la que se vinculó. Las claves no cambian (se crea otra
  -- familia), pero si la familia se borra o se reemplaza, el vínculo muere.
  clave_usada  text        not null,
  alias        text        check (length(alias) <= 40),
  created_at   timestamptz not null default now(),
  revocado_at  timestamptz
);
create unique index if not exists familia_accesos_unico on metas.familia_accesos (auth_uid, familia_id)
  where revocado_at is null;
alter table metas.familia_accesos enable row level security;
create policy familia_accesos_mios on metas.familia_accesos for select to authenticated
  using (auth_uid = (select auth.uid()));
revoke all on metas.familia_accesos from public, anon, authenticated;
grant select on metas.familia_accesos to authenticated;

create or replace function metas.es_sesion_familia()
returns boolean language sql stable as $$
  select coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false)
$$;
grant execute on function metas.es_sesion_familia() to authenticated;

-- Alumnos que la sesión puede ver: vínculo vigente, familia activa con la
-- MISMA clave y alumno activo (no borrado; puede estar trasladado).
create or replace function metas.familia_alumnos()
returns setof uuid language sql stable security definer set search_path = metas, pg_temp as $$
  select f.alumno_id
    from metas.familia_accesos fa
    join metas.familias f on f.id = fa.familia_id
                         and f.deleted_at is null
                         and f.clave = fa.clave_usada
    join metas.alumnos  a on a.id = f.alumno_id and a.deleted_at is null
   where fa.auth_uid = (select auth.uid())
     and fa.revocado_at is null
     and metas.es_sesion_familia()
$$;
create or replace function metas.familia_aulas()
returns setof uuid language sql stable security definer set search_path = metas, pg_temp as $$
  select distinct a.aula_id from metas.alumnos a where a.id in (select metas.familia_alumnos())
$$;
grant execute on function metas.familia_alumnos(), metas.familia_aulas() to authenticated;

-- ── Vincular: SOLO la función de borde «familia-vincular» (llave de servicio)
-- Recibe el uid de la sesión anónima (ya verificado por la función de borde
-- con el JWT), la clave y la IP que puso la infraestructura.
create or replace function metas.familia_vincular(p_uid uuid, p_clave text, p_ip text, p_alias text default null)
returns jsonb language plpgsql volatile security definer set search_path = metas, pg_temp as $$
declare
  v_cl  text := metas.norm_clave(p_clave);
  f     metas.familias;
  a     metas.alumnos;
begin
  if p_uid is null then
    return jsonb_build_object('ok', false, 'motivo', 'sesion');
  end if;
  if exists (select 1 from metas.cuentas where auth_uid = p_uid) then
    return jsonb_build_object('ok', false, 'motivo', 'sesion');   -- una cuenta de docente no se vincula como padre
  end if;
  if not metas.freno_ok('famvinc-uid:' || p_uid, 20, interval '1 hour')
     or not metas.freno_ok('famvinc-ip:' || coalesce(p_ip, 'sin-ip'), 60, interval '1 hour') then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;
  if v_cl is null or v_cl !~ '^([A-HJ-NP-Z2-9]{10}|[0-9]{1,2}[A-Z0-9]{4})$' then
    perform metas.freno_ok('famfallo-ip:' || coalesce(p_ip, 'sin-ip'), 20, interval '1 hour');
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into f from metas.familias where clave = v_cl and deleted_at is null;
  if not found then
    -- Fallos: por IP y además un tope GLOBAL, para que repartir el ataque
    -- entre muchas IP no sirva para recorrer claves.
    if not metas.freno_ok('famfallo-ip:' || coalesce(p_ip, 'sin-ip'), 20, interval '1 hour') then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
    -- Tope GLOBAL: no bloquea a nadie (un ataque repartido no puede dejar a
    -- todas las familias sin entrar); deja UNA alerta por hora para quien
    -- administra cuando se pasan las 2 000 claves equivocadas en una hora.
    if not metas.freno_ok('famfallo-global', 2000, interval '1 hour')
       and metas.freno_ok('famfallo-global-alerta', 1, interval '1 hour') then
      insert into metas.alertas (tipo, detalle)
      values ('claves_familia_equivocadas', jsonb_build_object('umbral', 2000, 'ventana', '1 hour'));
    end if;
    -- 'clave' también cuando el aula todavía no se cargó en la base nueva: el
    -- portal entonces consulta el archivo congelado (07, transición).
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into a from metas.alumnos where id = f.alumno_id and deleted_at is null;
  if not found then return jsonb_build_object('ok', false, 'motivo', 'clave'); end if;
  if (select count(*) from metas.familia_accesos where auth_uid = p_uid and revocado_at is null) >= 10 then
    return jsonb_build_object('ok', false, 'motivo', 'muchos');
  end if;
  insert into metas.familia_accesos (auth_uid, familia_id, clave_usada, alias)
  values (p_uid, f.id, f.clave, left(coalesce(nullif(trim(p_alias), ''), split_part(a.nombre_completo, ' ', 1)), 40))
  on conflict do nothing;
  return jsonb_build_object('ok', true, 'familia_id', f.id, 'alias', split_part(a.nombre_completo, ' ', 1));
end $$;
revoke all on function metas.familia_vincular(uuid, text, text, text) from public, anon, authenticated;
grant execute on function metas.familia_vincular(uuid, text, text, text) to service_role;

create or replace function metas.familia_desvincular(p_familia uuid)
returns boolean language sql volatile security definer set search_path = metas, pg_temp as $$
  update metas.familia_accesos set revocado_at = now()
   where auth_uid = (select auth.uid()) and familia_id = p_familia and revocado_at is null
  returning true
$$;
grant execute on function metas.familia_desvincular(uuid) to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Rol lector de familias y RLS sobre las tablas del docente
-- ════════════════════════════════════════════════════════════════════════════
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'metas_lector_familias') then
    create role metas_lector_familias nologin nobypassrls;
  end if;
end $$;
grant usage on schema metas to metas_lector_familias;
grant execute on function metas.familia_alumnos(), metas.familia_aulas(), metas.es_sesion_familia()
  to metas_lector_familias;

-- SOLO las columnas que una familia puede ver: nada de identidad, teléfonos,
-- aparato, autor, nota interna del pago ni motivo de anulación.
grant select (id, aula_id, nombre_completo, estado, deleted_at)                  on metas.alumnos     to metas_lector_familias;
grant select (id, escuela, grado, seccion, anio_lectivo, docente_nombre, deleted_at) on metas.aulas   to metas_lector_familias;
grant select (id, aula_id, nombre, orden, deleted_at)                            on metas.asignaturas to metas_lector_familias;
grant select (id, aula_id, periodo, desde, hasta, deleted_at)                    on metas.periodos    to metas_lector_familias;
grant select (id, aula_id, concepto, monto_sugerido, fecha, estado, deleted_at)  on metas.colectas    to metas_lector_familias;
grant select (id, colecta_id, alumno_id, monto_aplicable, deleted_at)            on metas.colecta_exenciones to metas_lector_familias;
grant select (id, aula_id, colecta_id, alumno_id, monto, fecha, recibo, recibo_anterior,
              reemplaza_recibo, created_at, deleted_at)                          on metas.pagos       to metas_lector_familias;
grant select (id, aula_id, colecta_id, fecha, concepto, monto, deleted_at)       on metas.gastos      to metas_lector_familias;
grant select (id, alumno_id, asignatura_id, periodo, componente, valor, deleted_at) on metas.notas    to metas_lector_familias;
grant select (id, alumno_id, periodo, rasgo, letra, deleted_at)                  on metas.notas_personalidad to metas_lector_familias;
grant select (id, alumno_id, fecha, estado, deleted_at)                          on metas.asistencia  to metas_lector_familias;
grant select (id, alumno_id, periodo, dias, deleted_at)                          on metas.inasistencias_oficiales to metas_lector_familias;
grant select (id, aula_id, tipo, titulo, texto, fecha_evento, hasta, deleted_at) on metas.avisos      to metas_lector_familias;
grant select (id, aviso_id, alumno_id, deleted_at)                               on metas.aviso_destinatarios to metas_lector_familias;
grant select (id, alumno_id, tipo, texto, fecha, visible_hasta, para_familia, deleted_at) on metas.observaciones to metas_lector_familias;
grant select (id, aula_id, pregunta, claves, respuesta, activa, deleted_at)      on metas.preguntas_frecuentes to metas_lector_familias;
grant select (id, analisis_id, alumno_id, nota, no_se_presento, categoria, mensaje, enviado, deleted_at) on metas.analisis_alumnos to metas_lector_familias;
grant select (id, aula_id, evaluacion, asignatura_id, periodo, fecha_prueba, deleted_at) on metas.analisis to metas_lector_familias;
grant select (id, aula_id, nombre, icono, tipo, fecha, para_familia, deleted_at)  on metas.controles   to metas_lector_familias;
grant select (id, control_id, alumno_id, marcado, numero, texto, deleted_at)      on metas.control_valores to metas_lector_familias;
grant select (id, aula_id, fecha, texto, deleted_at)                             on metas.bitacora    to metas_lector_familias;

-- Políticas: solo SELECT, solo filas activas, solo sus alumnos (o su aula
-- para lo que es de toda el aula: colectas, avisos, preguntas, gastos).
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
create policy familia_lee on metas.gastos        for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));   -- solo gastos de colecta (los del docente están en otra tabla)
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
-- Observaciones: solo llamados, faltas leves y felicitaciones que el docente
-- dejó marcadas para la familia y que no han vencido. El expediente, nunca.
create policy familia_lee on metas.observaciones for select to metas_lector_familias
  using (deleted_at is null and para_familia and tipo in ('llamado', 'leve', 'felicitacion')
         and (visible_hasta is null or visible_hasta >= current_date)
         and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.preguntas_frecuentes for select to metas_lector_familias
  using (deleted_at is null and activa and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.analisis_alumnos for select to metas_lector_familias
  using (deleted_at is null and enviado and alumno_id in (select metas.familia_alumnos()));
create policy familia_lee on metas.analisis      for select to metas_lector_familias
  using (deleted_at is null and aula_id in (select metas.familia_aulas()));
-- Controles marcados «para la familia» (antes iban como mensaje AVB) y lo
-- anotado de SU hijo en ellos.
create policy familia_lee on metas.controles     for select to metas_lector_familias
  using (deleted_at is null and para_familia and aula_id in (select metas.familia_aulas()));
create policy familia_lee on metas.control_valores for select to metas_lector_familias
  using (deleted_at is null and alumno_id in (select metas.familia_alumnos()));
-- Bitácora del aula (antes mensaje AVN «Novedad de la clase»): los últimos 60 días.
create policy familia_lee on metas.bitacora      for select to metas_lector_familias
  using (deleted_at is null and fecha >= current_date - 60 and aula_id in (select metas.familia_aulas()));

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Vistas de solo lectura para padres
-- ════════════════════════════════════════════════════════════════════════════
-- Corren como su dueño (metas_lector_familias) → les aplica la RLS de arriba
-- con el auth.uid() de quien consulta. Un docente que las consulte recibe 0
-- filas. Nadie puede escribir en ellas.

create or replace view metas.vf_hijos as
select a.id as alumno_id, split_part(a.nombre_completo, ' ', 1) as nombre,
       au.grado, au.seccion, au.escuela, au.anio_lectivo, au.docente_nombre as docente
  from metas.alumnos a join metas.aulas au on au.id = a.aula_id;

-- Lo de SU hijo en cada colecta, con la misma regla que v_colecta_alumnos:
-- exento → le corresponde 0 y no le falta nada; exento parcial → le
-- corresponde monto_aplicable; varios abonos se suman.
create or replace view metas.vf_colectas as
select a.id as alumno_id, c.id as colecta_id, c.concepto, c.fecha, c.estado, c.monto_sugerido,
       x.aplicable, x.pagado,
       greatest(x.aplicable - x.pagado, 0)                              as falta,
       case when a.estado in ('activo', 'ingreso') then greatest(x.pagado - x.aplicable, 0) else 0 end as pago_de_mas,
       case when a.estado not in ('activo', 'ingreso') then 'ya_no_esta'
            when x.aplicable = 0 and x.pagado = 0 then 'no_corresponde'
            when x.pagado = 0 then 'debe'
            when x.pagado < x.aplicable then 'abono'
            when x.pagado = x.aplicable then 'pagado'
            else 'pago_de_mas' end                                       as situacion
  from metas.alumnos a
  join metas.colectas c on c.aula_id = a.aula_id
  left join metas.colecta_exenciones e on e.colecta_id = c.id and e.alumno_id = a.id
  cross join lateral (
    -- misma regla que v_colecta_alumnos: si ya no está (retirado, trasladado,
    -- desertor) no le corresponde nada; si está exento, 0 o lo parcial
    select case when a.estado not in ('activo', 'ingreso') then 0
                when e.id is null then c.monto_sugerido
                else coalesce(e.monto_aplicable, 0) end                                         as aplicable,
           coalesce((select sum(p.monto) from metas.pagos p
                      where p.colecta_id = c.id and p.alumno_id = a.id), 0)                    as pagado
  ) x;

-- Cada pago (abono) de su hijo, con su recibo. Si el docente corrige un
-- monto, el recibo viejo desaparece (anulado) y aparece el nuevo con
-- «corrige al recibo …»; si lo anula, desaparece.
create or replace view metas.vf_pagos as
select p.alumno_id, p.colecta_id, c.concepto, p.monto, p.fecha, p.recibo, p.recibo_anterior,
       p.reemplaza_recibo as corrige_al_recibo, p.created_at as registrado_at
  from metas.pagos p join metas.colectas c on c.id = p.colecta_id;

-- Gastos de cada colecta del aula (cuentas claras), sin datos de nadie.
create or replace view metas.vf_cuentas_claras as
select g.colecta_id, c.concepto as colecta, g.fecha, g.concepto, g.monto
  from metas.gastos g join metas.colectas c on c.id = g.colecta_id;

create or replace view metas.vf_notas as
select n.alumno_id, s.nombre as asignatura, n.periodo, n.componente, n.valor
  from metas.notas n join metas.asignaturas s on s.id = n.asignatura_id;

create or replace view metas.vf_personalidad as
select alumno_id, periodo, rasgo, letra from metas.notas_personalidad;

create or replace view metas.vf_asistencia as
select alumno_id, fecha, estado from metas.asistencia;

-- Avisos: los de toda el aula (tipo distinto de 'individual') y los
-- 'individual' que tienen a SU hijo como destinatario. No se decide por la
-- ausencia de destinatarios (la RLS esconde los de otros alumnos).
create or replace view metas.vf_avisos as
select a.id as alumno_id, av.id as aviso_id, av.tipo, av.titulo, av.texto, av.fecha_evento, av.hasta
  from metas.alumnos a
  join metas.avisos av on av.aula_id = a.aula_id
 where (av.hasta is null or av.hasta >= current_date)
   and ( av.tipo <> 'individual'
         or exists (select 1 from metas.aviso_destinatarios d where d.aviso_id = av.id and d.alumno_id = a.id));

create or replace view metas.vf_observaciones as
select alumno_id, tipo, texto, fecha from metas.observaciones;

create or replace view metas.vf_plan_accion as
select aa.alumno_id, an.evaluacion, an.periodo, an.fecha_prueba,
       aa.nota, aa.no_se_presento, aa.categoria, aa.mensaje
  from metas.analisis_alumnos aa join metas.analisis an on an.id = aa.analisis_id;

create or replace view metas.vf_preguntas as
select aula_id, pregunta, claves, respuesta from metas.preguntas_frecuentes;

-- Fechas de los parciales (antes mensaje AVP).
create or replace view metas.vf_periodos as
select aula_id, periodo, desde, hasta from metas.periodos;

-- Controles para la familia con lo de SU hijo (antes mensaje AVB).
create or replace view metas.vf_controles as
select v.alumno_id, k.nombre, k.icono, k.tipo, k.fecha, v.marcado, v.numero, v.texto
  from metas.control_valores v join metas.controles k on k.id = v.control_id;

-- Novedades de la clase (antes mensaje AVN).
create or replace view metas.vf_bitacora as
select aula_id, fecha, texto from metas.bitacora;

-- Para poder ser dueño de las vistas, el rol necesita CREATE en el esquema
-- un momento; se le quita al terminar.
grant create on schema metas to metas_lector_familias;
grant metas_lector_familias to postgres;
do $$
declare v text;
begin
  foreach v in array array['vf_hijos','vf_colectas','vf_pagos','vf_cuentas_claras','vf_notas','vf_personalidad',
                           'vf_asistencia','vf_avisos','vf_observaciones','vf_plan_accion','vf_preguntas',
                           'vf_periodos','vf_controles','vf_bitacora'] loop
    execute format('alter view metas.%I owner to metas_lector_familias', v);
    execute format('revoke all on metas.%I from public, anon, authenticated', v);
    execute format('grant select on metas.%I to authenticated', v);
  end loop;
end $$;
revoke create on schema metas from metas_lector_familias;

-- ── Total recaudado de cada colecta (sin los pagos de otros alumnos) ───────
-- La política de pagos solo deja ver los del hijo; el total del aula se da
-- con esta función, que devuelve SOLO sumas por colecta.
create or replace function metas.familia_totales_colectas()
returns table (colecta_id uuid, concepto text, recaudado text, gastado text, saldo text)
language sql stable security definer set search_path = metas, pg_temp as $$
  select c.id, c.concepto,
         coalesce(r.s, 0)::text, coalesce(g.s, 0)::text, (coalesce(r.s, 0) - coalesce(g.s, 0))::text
    from metas.colectas c
    left join lateral (select sum(p.monto) s from metas.pagos p
                        where p.colecta_id = c.id and p.deleted_at is null) r on true
    left join lateral (select sum(x.monto) s from metas.gastos x
                        where x.colecta_id = c.id and x.deleted_at is null) g on true
   where c.deleted_at is null
     and c.aula_id in (select metas.familia_aulas())
$$;
grant execute on function metas.familia_totales_colectas() to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. «Visto» de los avisos (lo escribe la familia, solo por función)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.avisos_vistos (
  id          uuid        primary key default gen_random_uuid(),
  owner       uuid        not null,                 -- el DOCENTE dueño del aviso (para su RLS)
  aviso_id    uuid        not null references metas.avisos (id),
  familia_id  uuid        not null references metas.familias (id),
  visto_at    timestamptz not null default now(),
  unique (aviso_id, familia_id)
);
alter table metas.avisos_vistos enable row level security;
create policy avisos_vistos_docente on metas.avisos_vistos for select to authenticated
  using (owner = (select auth.uid()));
create policy avisos_vistos_solo_docentes on metas.avisos_vistos as restrictive
  for all to authenticated using ((select metas.es_docente())) with check ((select metas.es_docente()));
revoke all on metas.avisos_vistos from public, anon, authenticated;
grant select on metas.avisos_vistos to authenticated;
create trigger avisos_vistos_sin_cambios before update or delete on metas.avisos_vistos
  for each row execute function metas.t_auditoria_inmutable();

create or replace function metas.familia_marcar_visto(p_aviso uuid)
returns boolean language plpgsql volatile security definer set search_path = metas, pg_temp as $$
declare
  v_av metas.avisos;
  v_fam uuid;
begin
  if not metas.es_sesion_familia() then return false; end if;
  if not metas.freno_ok('visto:' || (select auth.uid()), 300, interval '1 hour') then return false; end if;
  select * into v_av from metas.avisos where id = p_aviso and deleted_at is null;
  if not found then return false; end if;
  -- la familia de esta sesión que tiene a un hijo en esa aula y a quien el
  -- aviso le llega (de toda el aula, o individual con su hijo)
  select f.id into v_fam
    from metas.familia_accesos fa
    join metas.familias f on f.id = fa.familia_id and f.deleted_at is null and f.clave = fa.clave_usada
    join metas.alumnos a on a.id = f.alumno_id and a.deleted_at is null and a.aula_id = v_av.aula_id
   where fa.auth_uid = (select auth.uid()) and fa.revocado_at is null
     and (v_av.tipo <> 'individual'
          or exists (select 1 from metas.aviso_destinatarios d
                      where d.aviso_id = v_av.id and d.alumno_id = a.id and d.deleted_at is null))
   limit 1;
  if v_fam is null then return false; end if;
  insert into metas.avisos_vistos (owner, aviso_id, familia_id) values (v_av.owner, v_av.id, v_fam)
  on conflict (aviso_id, familia_id) do nothing;
  return true;
end $$;
grant execute on function metas.familia_marcar_visto(uuid) to authenticated;

-- Para el docente: quién vio cada aviso (calculado).
create or replace view metas.v_avisos_vistos with (security_invoker = true) as
select av.id as aviso_id, av.aula_id, av.titulo,
       count(v.id) as familias_que_vieron,
       array_agg(f.alumno_id) filter (where v.id is not null) as alumnos_cuya_familia_vio
  from metas.avisos av
  left join metas.avisos_vistos v on v.aviso_id = av.id
  left join metas.familias f on f.id = v.familia_id
 where av.deleted_at is null
 group by av.id, av.aula_id, av.titulo;
grant select on metas.v_avisos_vistos to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. «De inmediato»: aviso por Realtime al teléfono del padre
-- ════════════════════════════════════════════════════════════════════════════
-- Los padres NO se suscriben a las tablas. Se suscriben a un canal PRIVADO
-- por familia y la base les manda un toque SIN DATOS: «algo cambió». El
-- teléfono vuelve a leer las vistas vf_*.
create or replace function metas.t_tocar_familias()
returns trigger language plpgsql security definer set search_path = metas, pg_temp as $$
declare
  v_alumno uuid := (to_jsonb(new) ->> 'alumno_id')::uuid;
  v_aula   uuid := (to_jsonb(new) ->> 'aula_id')::uuid;
  r record;
begin
  if tg_table_name = 'alumnos' then
    v_alumno := new.id;               -- un alumno solo le importa a SU familia
  end if;
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

do $$
declare t text;
begin
  foreach t in array array['alumnos','colectas','colecta_exenciones','pagos','gastos','notas',
                           'notas_personalidad','asistencia','inasistencias_oficiales','avisos',
                           'aviso_destinatarios','observaciones','preguntas_frecuentes',
                           'analisis_alumnos','familias','periodos','controles','control_valores','bitacora'] loop
    execute format('create trigger %I after insert or update on metas.%I for each row execute function metas.t_tocar_familias()',
                   t || '_tocar_familias', t);
  end loop;
end $$;

create policy familias_escuchan_su_canal on realtime.messages
  for select to authenticated
  using (
    realtime.topic() like 'familia:%'
    and metas.es_sesion_familia()
    and exists (select 1 from metas.familia_accesos fa
                 where fa.auth_uid = (select auth.uid()) and fa.revocado_at is null
                   and 'familia:' || fa.familia_id::text = realtime.topic())
  );

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Comprobaciones (fase de implementación, datos ficticios)
-- ════════════════════════════════════════════════════════════════════════════
-- Con una sesión ANÓNIMA vinculada a la familia de «Alumna Ficticia 01»:
-- a) select count(*) from metas.pagos;                 → 0 (restrictiva + sin política)
-- b) insert into metas.aulas (escuela, grado, seccion, anio_lectivo) values ('X', 6, '1', 2027);
--    insert into metas.familias (aula_id, alumno_id, clave) values (…, …, '15K7QM');
--    select metas.pago_crear(…);  select metas.alumno_crear(…);
--                                                     → TODOS rechazados con 42501, el mismo error
--                                                       exista o no la clave (no se puede averiguar)
-- c) select * from metas.vf_colectas;                 → solo filas de su hijo
-- d) select * from metas.familia_totales_colectas();  → sumas por colecta, sin nombres
-- e) select metas.familia_vincular(…);                → permiso denegado (solo service_role)
-- f) El docente anula o corrige un pago → en < 1 s llega «cambio» a familia:<id>
--    y vf_pagos ya no trae el recibo anulado (sí el nuevo, con corrige_al_recibo).
-- g) El docente reemplaza la familia (tira perdida) → la sesión vieja ya no ve nada.
-- ── Cierre de permisos ──────────────────────────────────────────────────────
-- «alter default privileges … in schema metas revoke … from public» NO quita
-- el EXECUTE que PostgreSQL da a PUBLIC (un permiso global no se quita por
-- esquema; lo comprobó la capa A). Por eso, al final de cada archivo, se
-- quita a mano de TODAS las funciones de metas. Las que la app necesita ya
-- tienen su GRANT explícito a authenticated, service_role o al rol lector,
-- que no depende de PUBLIC.
revoke execute on all functions in schema metas from public;

-- ============================================================================
