-- ============================================================
-- M.E.T.A.S — SOPORTE: restablecer la contraseña de un maestro
-- (para el ADMINISTRADOR del proyecto, en supabase.com → SQL Editor)
--
-- Cuándo usarlo: un maestro olvidó su contraseña Y no tiene ningún
-- equipo con la sesión abierta (si tiene uno, que use ahí
-- «✏️ Cambiar mi contraseña»: no necesita la anterior).
--
-- Antes de resetear, VERIFICA que es él: pídele por WhatsApp su
-- nombre completo, escuela y teléfono, y compáralos con:
--
--   select nombre, correo, escuela, telefono, municipio, creado_en
--   from public.docentes
--   where lower(correo) = lower('CORREO.DEL.MAESTRO@ejemplo.com');
--
-- Luego cambia SOLO las dos líneas marcadas 👇 y corre todo:
-- ============================================================

update public.docentes d
   set clave_hash = 'v2:' || encode(extensions.digest(
         'TEMPORAL123'                                  -- 👈 contraseña temporal (dásela por WhatsApp)
         || d.codigo, 'sha256'), 'hex')
 where lower(d.correo) = lower('CORREO.DEL.MAESTRO@ejemplo.com');  -- 👈 correo del maestro

-- y desbloquea su freno de intentos fallidos:
delete from public.docente_intentos
 where correo = lower('CORREO.DEL.MAESTRO@ejemplo.com');           -- 👈 el mismo correo

-- ============================================================
-- Dile al maestro: «Entra con la contraseña temporal y de inmediato
-- toca ✏️ Cambiar mi contraseña para poner la tuya».
-- Si el UPDATE dice "0 rows": el correo no está registrado tal cual —
-- búscalo con:  select correo, nombre from public.docentes
--               where correo ilike '%parte-del-correo%';
-- ============================================================
