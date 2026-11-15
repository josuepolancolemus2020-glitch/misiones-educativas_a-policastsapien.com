-- ============================================================================
-- M.E.T.A.S · Congelar el modelo viejo como archivo de solo lectura · PROPUESTA
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. Se corre EL DÍA DEL CAMBIO, después de publicar la app
--    nueva, nunca antes: mientras tanto la app vieja sigue funcionando.
--
-- Qué hace: nada se borra. Las tablas viejas del aula quedan como ARCHIVO:
-- nadie puede escribir en ellas (un disparador lo impide) y las funciones que
-- las leían o escribían dejan de poder llamarse desde la app (se les quita
-- EXECUTE a anon y authenticated). La app nueva NO las lee ni las escribe.
--
-- Qué NO toca: public.docentes ni nada de cuentas (entrar, alta, cambio y
-- recuperación de contraseña siguen igual), resultados y progreso de los
-- alumnos, convocatorias públicas, Campeonísimo, buzón de padres, sugerencias.
--
-- Cómo deshacerlo: volver a dar EXECUTE (grant) y borrar los disparadores
-- «*_congelada». Los datos no se tocaron.
-- ============================================================================

create or replace function public._metas_archivo_congelado()
returns trigger language plpgsql as $$
begin
  raise exception 'M.E.T.A.S: % es un archivo congelado (solo lectura) desde el cambio a la base v2',
    tg_table_name using errcode = 'MT010';
end $$;

-- ── 1. Tablas: solo lectura ─────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'docente_estado', 'docente_estado_hist', 'docente_estado_historial',
    'docente_estado_papelera', 'registro_admin', 'registro_admin_historial',
    'mensajes_docente', 'plan_accion'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('create trigger %I before insert or update or delete on public.%I
                        for each row execute function public._metas_archivo_congelado()',
                     t || '_congelada', t);
      execute format('create trigger %I before truncate on public.%I
                        for each statement execute function public._metas_archivo_congelado()',
                     t || '_congelada_truncate', t);
    end if;
  end loop;
end $$;
-- Ojo: los disparadores de historial (docente_estado_hist_trg,
-- trg_docente_estado_historial, el de registro_admin_historial) ya no se
-- disparan porque ya no hay escrituras. No se borran.

-- ── 2. Funciones: sin EXECUTE para la app ───────────────────────────────────
-- Se recorren TODAS las firmas de cada nombre (incluidas las viejas de un
-- argumento SIN contraseña, como metas_guardar_admin(jsonb)).
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as firma
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         -- espejo del blob, papelera, historial y recuperación
         'metas_docente_estado_guardar', 'metas_docente_estado_leer',
         'metas_docente_reset', 'metas_docente_reset_deshacer', 'metas_docente_papelera',
         'metas_docente_historial', 'metas_docente_historial_listar',
         'metas_recuperar_admin_docente', 'metas_recuperar_historial',
         -- copias para el chatbot de padres (escritura)
         'metas_guardar_admin', 'metas_guardar_avisos', 'metas_guardar_plan',
         'metas_cerrar_familias',
         -- lecturas de padres sobre las copias (las reemplazan las vistas vf_*)
         'metas_consultar_admin_padre', 'metas_consultar_avisos_padre',
         'metas_consultar_plan_padre', 'metas_buzon_docente', 'metas_avisos_vistos',
         -- restos inseguros de la Fase 1
         'metas_consultar_progreso', 'metas_guardar_progreso', 'metas_restaurar_codigos'
       )
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.firma);
    raise notice 'congelada: %', f.firma;
  end loop;
end $$;

-- ── 3. Comprobaciones ───────────────────────────────────────────────────────
-- a) Ninguna de esas funciones se puede llamar desde la app:
--    select p.oid::regprocedure, has_function_privilege('anon', p.oid, 'execute') as anon,
--           has_function_privilege('authenticated', p.oid, 'execute') as auth
--      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--     where n.nspname = 'public' and p.proname like 'metas_%'
--       and p.proname in ('metas_guardar_admin','metas_docente_estado_guardar' /* … */);
--    → anon = false, auth = false en todas.
-- b) Escribir falla:
--    insert into public.docente_estado (codigo, k) values ('PROF-PRUEBA00', 'x');
--    → ERROR: M.E.T.A.S: docente_estado es un archivo congelado …
-- c) Los datos siguen ahí:
--    select count(*) from public.docente_estado;   → el mismo número que antes de correrlo.
--
-- ── 4. Archivos .sql viejos que resucitarían funciones sin contraseña ───────
-- En la fase de implementación se añade al PRINCIPIO de cada uno:
--    do $$ begin raise exception 'Archivo congelado: ver docs/rediseno-datos'; end $$;
-- _privado/SUPABASE-FASE3.sql, SUPABASE-AVISOS.sql, SUPABASE-REGISTROS-ADMIN.sql,
-- SUPABASE-PLAN-ACCION.sql, SUPABASE-PLAN-PARCIAL.sql, SUPABASE-PLAN-FECHA.sql,
-- SUPABASE-DOCENTE-ESTADO.sql, SUPABASE-DOCENTE-PAPELERA.sql,
-- SUPABASE-DOCENTE-HISTORIAL.sql, SUPABASE-HISTORIAL-MES.sql,
-- SUPABASE-HISTORIAL-RECUPERACION.sql, CONSULTA-PAGOS-PERDIDOS.sql.
-- ============================================================================
