-- ============================================================================
-- Capa A · datos FICTICIOS del archivo viejo (antes de vincular y del paso 1)
-- ============================================================================
-- Contraseñas: 'clave-a', 'clave-b', 'clave-c' (huella 'v2:' como la real).
insert into public.docentes (codigo, clave_hash, nombre, correo) values
  ('PROF-AAAA000001', 'v2:' || encode(extensions.digest('clave-a' || 'PROF-AAAA000001', 'sha256'), 'hex'), 'Docente Ficticia A', 'a@ejemplo.invalid'),
  ('PROF-BBBB000002', 'v2:' || encode(extensions.digest('clave-b' || 'PROF-BBBB000002', 'sha256'), 'hex'), 'Docente Ficticio B', 'b@ejemplo.invalid'),
  ('PROF-CCCC000003', 'v2:' || encode(extensions.digest('clave-c' || 'PROF-CCCC000003', 'sha256'), 'hex'), 'Docente Ficticia C', 'c@ejemplo.invalid');

-- Blob de A: claves en METAS_CODIGOS_V1 y pegadas a la lista.
insert into public.docente_estado (codigo, k, valor, version) values
  ('PROF-AAAA000001', 'METAS_CODIGOS_V1',
   jsonb_build_object('raw', '{"G:G1":{"1":"1K7QM","2":"2PRBA"},"6|A":{"9":"9VIEJ"}}'), 1),
  ('PROF-AAAA000001', 'METAS_ADMIN_V1',
   jsonb_build_object('raw', '{"v":2,"grupos":[{"id":"G1","grado":"6","seccion":"1","lista":[{"num":1,"nombre":"Alumna Ficticia Uno","clave":"1K7QM"},{"num":3,"nombre":"Alumno Ficticio Tres","clave":"3TRES"}]}]}'), 1),
-- Blob de B: una clave que A NO puede «conservar».
  ('PROF-BBBB000002', 'METAS_CODIGOS_V1', jsonb_build_object('raw', '{"G:X":{"2":"2ZZZZ"}}'), 1),
-- Blob de C: raw INVÁLIDO (la copia de claves tiene que tolerarlo).
  ('PROF-CCCC000003', 'METAS_CODIGOS_V1', jsonb_build_object('raw', '{esto no es json'), 1);

-- Copias viejas para el chatbot (registro_admin) que el cierre de año borra.
insert into public.registro_admin (evento_id, codigo, tipo, estado, monto, docente) values
  ('ADE-C1-9VIEJ', '9VIEJ', 'economia', 'pago', 50, 'Docente Ficticia A · PROF-AAAA000001'),
  ('ADA-2026-9VIEJ', '9VIEJ', 'asistencia', 'ausente', null, 'Docente Ficticia A · PROF-AAAA000001');

-- Usuarios de Auth (ficticios): A, B, uno de panel SIN vínculo, y padres anónimos.
insert into auth.users (id, email, is_anonymous) values
  ('00000000-0000-0000-0000-00000000000a', 'prof-aaaa000001@cuentas.metas.policastsapien.com', false),
  ('00000000-0000-0000-0000-00000000000b', 'prof-bbbb000002@cuentas.metas.policastsapien.com', false),
  ('00000000-0000-0000-0000-0000000000c0', 'panel@ejemplo.invalid', false),
  ('00000000-0000-0000-0000-0000000000f1', null, true),
  ('00000000-0000-0000-0000-0000000000f2', null, true),
  ('00000000-0000-0000-0000-0000000000f3', null, true);
