-- ============================================================================
-- Capa A · usuarios de Auth FICTICIOS, solo para el Postgres suelto
-- ----------------------------------------------------------------------------
-- Contra `supabase start` no se insertan en auth.users: los crea la API de
-- administración de Auth (_dev/supabase-local/corre-supabase.sh) con los
-- MISMOS ids. Los padres no necesitan fila aquí para la capa A (la sesión
-- anónima se imita con los «claims»); en la capa A+ son sesiones anónimas
-- de verdad.
-- ============================================================================
-- Usuarios de Auth (ficticios): A, B, uno de panel SIN vínculo, y padres anónimos.
insert into auth.users (id, email, is_anonymous) values
  ('00000000-0000-0000-0000-00000000000a', 'prof-aaaa000001@cuentas.metas.policastsapien.com', false),
  ('00000000-0000-0000-0000-00000000000b', 'prof-bbbb000002@cuentas.metas.policastsapien.com', false),
  ('00000000-0000-0000-0000-0000000000c0', 'panel@ejemplo.invalid', false),
  ('00000000-0000-0000-0000-0000000000f1', null, true),
  ('00000000-0000-0000-0000-0000000000f2', null, true),
  ('00000000-0000-0000-0000-0000000000f3', null, true);
