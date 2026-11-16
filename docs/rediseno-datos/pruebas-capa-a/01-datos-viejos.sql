-- ============================================================================
-- Capa A · datos FICTICIOS del archivo viejo (antes de vincular y del paso 1)
-- ============================================================================
-- Contraseñas: 'clave-a', 'clave-b', 'clave-c' (huella 'v2:' como la real).
insert into public.docentes (codigo, clave_hash, nombre, correo) values
  ('PROF-AAAA000001', 'v2:' || encode(extensions.digest('clave-a' || 'PROF-AAAA000001', 'sha256'), 'hex'), 'Docente Ficticia A', 'a@ejemplo.invalid'),
  ('PROF-BBBB000002', 'v2:' || encode(extensions.digest('clave-b' || 'PROF-BBBB000002', 'sha256'), 'hex'), 'Docente Ficticio B', 'b@ejemplo.invalid'),
  ('PROF-CCCC000003', 'v2:' || encode(extensions.digest('clave-c' || 'PROF-CCCC000003', 'sha256'), 'hex'), 'Docente Ficticia C', 'c@ejemplo.invalid'),
-- D solo la usa la capa A+ para el freno por correo (sus 20 entradas por
-- hora quedan gastadas: ninguna otra capa entra con ella).
  ('PROF-DDDD000004', 'v2:' || encode(extensions.digest('clave-d' || 'PROF-DDDD000004', 'sha256'), 'hex'), 'Docente Ficticio D', 'd@ejemplo.invalid');

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
  ('ADA-2026-9VIEJ', '9VIEJ', 'asistencia', 'ausente', null, 'Docente Ficticia A · PROF-AAAA000001'),
-- Copias para N2: dinero de A con el texto «docente» escrito de tres formas.
-- La columna es texto libre: no basta para saber de quién es el dato.
  ('ADE-C1-1K7QM', '1K7QM', 'economia',   'pago',     50, 'Ana López'),                          -- sin código
  ('ADE-C1-8MINU', '8MINU', 'economia',   'pago',     25, 'docente ficticia a · prof-aaaa000001'), -- en minúsculas
  ('ADA-2026-1K7QM', '1K7QM', 'asistencia', 'ausente', null, 'Ana López'),                         -- no es dinero
-- C no se vincula: sus familias siguen viendo todo, dinero incluido.
  ('ADE-C1-7CCCC', '7CCCC', 'economia',   'pago',     30, 'Docente Ficticia C · PROF-CCCC000003'),
-- B se vincula DESPUÉS del paso 1 (en las pruebas): su dinero deja de verse entonces.
  ('ADE-C1-5NUEVA', '5NUEVA', 'economia', 'pago',     40, 'Profe Beto');

-- Avisos y recibos viejos del chatbot (mensajes_docente), mismos casos.
insert into public.mensajes_docente (evento_id, codigo, subtipo, titulo, texto, vigente_hasta, docente) values
  ('AVR-C1-1K7QM', '1K7QM', 'cuentas', '🧾 Recibo RC-0001-1 — Excursión', 'Recibido: L 50.00', current_date + 200, 'Ana López'),
  ('AVC-C1-1K7QM', '1K7QM', 'cuentas', 'Cuentas claras — Excursión', 'Recaudado: L 50.00', current_date + 200, 'Ana López'),
  ('AVI-1-1K7QM',  '1K7QM', 'aviso',   'Reunión de padres', 'El viernes a las 8', current_date + 10, 'Ana López'),
  ('AVR-C1-8MINU', '8MINU', 'cuentas', '🧾 Recibo RC-0001-8 — Excursión', 'Recibido: L 25.00', current_date + 200,
   'docente ficticia a · prof-aaaa000001'),
  ('AVR-C1-7CCCC', '7CCCC', 'cuentas', '🧾 Recibo RC-0009-7 — Excursión', 'Recibido: L 30.00', current_date + 200,
   'Docente Ficticia C · PROF-CCCC000003');
