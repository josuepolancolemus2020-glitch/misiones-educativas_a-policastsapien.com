-- ============================================================
-- M.E.T.A.S — ESCALABILIDAD: índices para miles de maestros a la vez
-- Pegar COMPLETO en supabase.com → SQL Editor → Run. Es ADITIVO e
-- IDEMPOTENTE (usa IF NOT EXISTS): no borra ni cambia datos, solo crea
-- índices. Se puede correr varias veces sin problema.
--
-- Por qué:
--   Las ESCRITURAS ya escalan bien — cada maestro escribe solo sus
--   propias filas (partición natural por su código PROF-XXXX / clave de
--   familia), así que miles de maestros escribiendo a la vez tocan filas
--   distintas: sin fila caliente global ni bloqueos entre ellos.
--   El riesgo estaba en las LECTURAS sin índice, que hacían un ESCANEO
--   COMPLETO de tabla en cada consulta. Con millones de filas eso colapsa.
--
--   1) resultados / progreso: la pantalla «Mis alumnos en la nube» filtra
--      por  ...docente... LIKE '%código%'  (comodín inicial = no usa
--      índice normal). Un índice TRIGRAMA (pg_trgm) sobre el docente
--      normalizado sí acelera ese LIKE.
--   2) plan_accion / registro_admin: el chatbot de padres filtra por
--      codigo (clave de familia). Índice btree por codigo.
--
-- Notas ya verificadas en el esquema:
--   • docente_estado: PK (codigo,k) → las lecturas por codigo YA usan índice.
--   • docentes / camp_partidas: codigo es PK → YA indexado.
--   • camp_acciones: unique (codigo,gi,qn,tipo) → filtro por codigo YA cubierto.
-- ============================================================

-- pg_trgm: habilita índices para LIKE con comodines.
create extension if not exists pg_trgm;

-- 1) «Mis alumnos en la nube» — que NO escanee toda la tabla.
--    El índice replica EXACTAMENTE la expresión que usa la consulta del
--    docente, para que el planner pueda usarlo.
create index if not exists idx_resultados_docente_trgm
  on public.resultados using gin
  ((regexp_replace(upper(coalesce(docente,'')), '[^A-Z0-9]', '', 'g')) gin_trgm_ops);

create index if not exists idx_progreso_docente_trgm
  on public.progreso using gin
  ((regexp_replace(upper(coalesce(docente,'')), '[^A-Z0-9]', '', 'g')) gin_trgm_ops);

-- 2) Chatbot de padres — filtro por clave de familia.
create index if not exists idx_plan_accion_codigo   on public.plan_accion   (codigo);
create index if not exists idx_registro_admin_codigo on public.registro_admin (codigo);

-- (Opcional) Panel del administrador del proyecto, que lee por docente:
--    índice trigrama para el  docente ILIKE '%...%'  de las políticas RLS.
create index if not exists idx_plan_accion_docente_trgm
  on public.plan_accion using gin (upper(coalesce(docente,'')) gin_trgm_ops);
create index if not exists idx_registro_admin_docente_trgm
  on public.registro_admin using gin (upper(coalesce(docente,'')) gin_trgm_ops);

-- ── Verificación rápida (opcional): que el docente use el índice ──
-- explain analyze
--   select 1 from public.resultados
--   where regexp_replace(upper(coalesce(docente,'')), '[^A-Z0-9]', '', 'g')
--         like '%PROFXXXX%';
-- Debe decir «Bitmap Index Scan on idx_resultados_docente_trgm»,
-- NO «Seq Scan on resultados».
--
-- Nota: si algún CREATE INDEX falla por el operador gin_trgm_ops, es que
-- pg_trgm quedó en el esquema «extensions»; en ese caso cambia
-- «gin_trgm_ops» por «extensions.gin_trgm_ops» en las líneas de arriba.
