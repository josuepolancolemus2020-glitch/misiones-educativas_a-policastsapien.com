-- ============================================================
-- M.E.T.A.S — Supabase: subtipo 'conducta' en los comunicados
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Reportes de conducta por alumno (llamado de atención, falta leve,
-- felicitación): viajan por el MISMO canal de mensajes_docente, solo
-- a la clave de la familia de ese alumno. Este archivo únicamente
-- amplía la lista de subtipos permitidos; las funciones de guardar y
-- consultar ya los aceptan sin cambios.
-- ============================================================

alter table public.mensajes_docente
  drop constraint if exists mensajes_docente_subtipo_check;
alter table public.mensajes_docente
  add constraint mensajes_docente_subtipo_check
  check (subtipo in ('aviso','evento','material','individual','cuentas','faq','conducta'));
