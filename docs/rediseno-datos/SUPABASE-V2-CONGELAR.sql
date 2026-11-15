-- ============================================================================
-- M.E.T.A.S · Congelar el modelo viejo como archivo de solo lectura · PROPUESTA
-- (rev. 2: por pasos alineados con los cortes de 08-PLAN-POR-CORTES.md, sin
--  quitar nada que todavía se use)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Nada se borra: las tablas viejas quedan como ARCHIVO.
--
-- PASO 1 · con el CORTE 1 (dinero, alumnos, notas, asistencia, controles)
--   · registro_admin y su historial: solo lectura (era la copia de pagos,
--     notas y asistencia para el chatbot; ya nadie la escribe);
--   · sin EXECUTE: metas_guardar_admin (TODAS sus firmas, incluida la de un
--     argumento sin contraseña), metas_recuperar_admin_docente (la que
--     «reponía» pagos), metas_cerrar_familias, y dos restos inseguros que nadie
--     llama (metas_consultar_progreso(p_clave), metas_restaurar_codigos).
--   · docente_estado SIGUE abierto: guarda todavía lo de las herramientas que
--     no han pasado a filas (avisos, plan de acción, equipos, lecturas…), sin
--     los datos del corte 1, que la app nueva ya no sube.
-- PASO 2 · con el corte de avisos y plan de acción
--   · mensajes_docente y plan_accion: solo lectura;
--   · sin EXECUTE: metas_guardar_avisos, metas_guardar_plan (todas sus firmas),
--     metas_recuperar_historial.
-- PASO 3 · con el ÚLTIMO corte (ya nada vive en el blob)
--   · docente_estado, sus dos historiales y su papelera: solo lectura;
--   · sin EXECUTE: metas_docente_estado_*, metas_docente_reset*,
--     metas_docente_papelera, metas_docente_historial*.
--   · OJO: metas._clave_era_mia sigue LEYENDO docente_estado (solo lectura)
--     para aceptar claves de familia conservadas. Congelar no le estorba.
-- PASO 4 · cuando la última aula esté cargada en la base nueva
--   · sin EXECUTE: lecturas de padres sobre el archivo
--     (metas_consultar_admin_padre, _avisos_padre, _plan_padre) y, si ya tienen
--     reemplazo publicado, metas_buzon_docente y metas_avisos_vistos.
--
-- NO se toca en ningún paso:
--   · public.docentes ni nada de cuentas (entrar, alta, cambio y recuperación
--     de contraseña);
--   · metas_guardar y metas_guardar_progreso: los usa el lado del ALUMNO
--     (js/metas-supabase.js:129 y :267);
--   · convocatorias públicas, Campeonísimo en vivo, mensajes de padres
--     (metas_mensaje_padre, metas_aviso_visto), sugerencias, videos.
--
-- Cómo deshacer un paso: volver a dar EXECUTE (grant) y borrar los
-- disparadores «*_congelada». Los datos no se tocaron.
-- ============================================================================

create or replace function public._metas_archivo_congelado()
returns trigger language plpgsql as $$
begin
  raise exception 'M.E.T.A.S: % es un archivo congelado (solo lectura) desde el cambio a la base v2',
    tg_table_name using errcode = 'MT010';
end $$;

-- Ayudantes (se borran al final del archivo; solo los usa quien corre esto).
create or replace function public._metas_congelar_tablas(p_tablas text[])
returns void language plpgsql as $$
declare t text;
begin
  foreach t in array p_tablas loop
    if to_regclass('public.' || t) is not null then
      execute format('create trigger %I before insert or update or delete on public.%I
                        for each row execute function public._metas_archivo_congelado()',
                     t || '_congelada', t);
      execute format('create trigger %I before truncate on public.%I
                        for each statement execute function public._metas_archivo_congelado()',
                     t || '_congelada_truncate', t);
      raise notice 'tabla congelada: %', t;
    end if;
  end loop;
end $$;

create or replace function public._metas_cerrar_funciones(p_nombres text[])
returns void language plpgsql as $$
declare f record;
begin
  -- TODAS las firmas de cada nombre (también las viejas sin contraseña)
  for f in
    select p.oid::regprocedure as firma
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = any (p_nombres)
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.firma);
    raise notice 'función cerrada: %', f.firma;
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 1 · corte 1
-- ════════════════════════════════════════════════════════════════════════════
select public._metas_congelar_tablas(array['registro_admin', 'registro_admin_historial']);
select public._metas_cerrar_funciones(array[
  'metas_guardar_admin', 'metas_recuperar_admin_docente', 'metas_cerrar_familias',
  'metas_consultar_progreso', 'metas_restaurar_codigos'
]);

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 2 · corte de avisos y plan de acción (se deja comentado hasta entonces)
-- ════════════════════════════════════════════════════════════════════════════
-- select public._metas_congelar_tablas(array['mensajes_docente', 'plan_accion']);
-- select public._metas_cerrar_funciones(array['metas_guardar_avisos', 'metas_guardar_plan',
--                                             'metas_recuperar_historial']);

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 3 · último corte
-- ════════════════════════════════════════════════════════════════════════════
-- select public._metas_congelar_tablas(array['docente_estado', 'docente_estado_hist',
--                                            'docente_estado_historial', 'docente_estado_papelera']);
-- select public._metas_cerrar_funciones(array[
--   'metas_docente_estado_guardar', 'metas_docente_estado_leer',
--   'metas_docente_reset', 'metas_docente_reset_deshacer', 'metas_docente_papelera',
--   'metas_docente_historial', 'metas_docente_historial_listar']);

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 4 · cuando la última aula esté en la base nueva
-- ════════════════════════════════════════════════════════════════════════════
-- Antes, comprobar cuántas claves del archivo siguen sin familia nueva:
--   select count(distinct r.codigo) as claves_sin_migrar
--     from public.registro_admin r
--    where not exists (select 1 from metas.familias f
--                       where f.clave = metas.norm_clave(r.codigo) and f.deleted_at is null);
-- Si da 0 (o tú decides cerrar igual):
-- select public._metas_cerrar_funciones(array['metas_consultar_admin_padre',
--   'metas_consultar_avisos_padre', 'metas_consultar_plan_padre']);
-- y, solo si su reemplazo ya está publicado:
-- select public._metas_cerrar_funciones(array['metas_buzon_docente', 'metas_avisos_vistos']);

-- Los ayudantes no quedan expuestos:
revoke all on function public._metas_congelar_tablas(text[]), public._metas_cerrar_funciones(text[])
  from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- Comprobaciones (después de cada paso)
-- ════════════════════════════════════════════════════════════════════════════
-- a) Tras el paso 1 siguen ejecutables por anon (y deben seguirlo):
--    select p.proname, has_function_privilege('anon', p.oid, 'execute')
--      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--     where n.nspname = 'public' and p.proname in ('metas_guardar', 'metas_guardar_progreso',
--           'metas_consultar_admin_padre', 'metas_buzon_docente',
--           'metas_docente_estado_guardar', 'metas_guardar_avisos');            → true en todas
-- b) Y estas no: metas_guardar_admin (todas sus firmas), metas_recuperar_admin_docente  → false
-- c) insert into public.registro_admin (evento_id, codigo, tipo) values ('X', 'X', 'asistencia');
--    → ERROR: M.E.T.A.S: registro_admin es un archivo congelado …
-- d) select count(*) from public.registro_admin;   → el mismo número que antes.
--
-- Archivos .sql viejos que resucitarían funciones sin contraseña: en la fase
-- de implementación se les antepone
--    do $$ begin raise exception 'Archivo congelado: ver docs/rediseno-datos'; end $$;
-- _privado/SUPABASE-FASE3.sql, SUPABASE-AVISOS.sql, SUPABASE-REGISTROS-ADMIN.sql,
-- SUPABASE-PLAN-ACCION.sql, SUPABASE-PLAN-PARCIAL.sql, SUPABASE-PLAN-FECHA.sql,
-- SUPABASE-HISTORIAL-RECUPERACION.sql, CONSULTA-PAGOS-PERDIDOS.sql (con el
-- corte 1), y SUPABASE-DOCENTE-ESTADO.sql, SUPABASE-DOCENTE-PAPELERA.sql,
-- SUPABASE-DOCENTE-HISTORIAL.sql, SUPABASE-HISTORIAL-MES.sql (con el último).
-- ============================================================================
