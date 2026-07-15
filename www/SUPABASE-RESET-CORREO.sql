-- ============================================================
-- M.E.T.A.S — RESET DE CONTRASEÑA POR CORREO (automático, sin admin)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- ⚠️ Requiere haber corrido antes SUPABASE-DOCENTES-V2.sql.
--
-- Flujo completo:
--   1) El maestro toca «¿Olvidaste tu contraseña?» y escribe su correo.
--   2) La Edge Function reset-clave (ver GUIA-RESET-CORREO.md) genera un
--      código de 6 dígitos, guarda AQUÍ su huella (hash) con vencimiento
--      de 15 minutos y lo envía por correo con Resend.
--   3) El maestro escribe el código + su contraseña nueva; la función
--      metas_reset_confirmar (abajo) verifica y actualiza.
--
-- Seguridad:
--   • El código NUNCA se guarda en claro (solo su sha256).
--   • Vence a los 15 minutos y admite máximo 5 intentos.
--   • El servidor nunca revela si un correo existe o no.
--   • La tabla tiene RLS sin políticas: solo escriben la Edge Function
--     (service role) y la función security definer.
-- ============================================================

create table if not exists public.docente_reset (
  correo text primary key,
  codigo_hash text not null,
  expira timestamptz not null,
  intentos int not null default 0,
  enviados int not null default 1,       -- envíos del día (freno anti-spam)
  creado timestamptz not null default now()
);
alter table public.docente_reset enable row level security;
-- sin políticas: nadie la toca directo

-- Confirmar el código y poner la contraseña nueva
create or replace function public.metas_reset_confirmar(
  p_correo text, p_codigo text, p_nueva text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_codigo text := regexp_replace(coalesce(p_codigo,''), '\D', '', 'g');
  v_nueva  text := trim(coalesce(p_nueva,''));
  fila record;
begin
  if length(v_nueva) < 6 then
    return jsonb_build_object('ok', false, 'motivo', 'clave_corta');
  end if;

  select * into fila from public.docente_reset r where r.correo = v_correo;
  if not found or fila.expira < now() or fila.intentos >= 5 then
    delete from public.docente_reset where correo = v_correo and (expira < now() or intentos >= 5);
    return jsonb_build_object('ok', false, 'motivo', 'vencido');
  end if;

  if fila.codigo_hash <> encode(extensions.digest(v_codigo, 'sha256'), 'hex') then
    update public.docente_reset set intentos = intentos + 1 where correo = v_correo;
    return jsonb_build_object('ok', false, 'motivo', 'codigo');
  end if;

  -- Código correcto: contraseña nueva (formato v2 salado con el código interno)
  update public.docentes d
     set clave_hash = 'v2:' || encode(extensions.digest(v_nueva || d.codigo, 'sha256'), 'hex')
   where lower(d.correo) = v_correo;
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'vencido');
  end if;

  delete from public.docente_reset where correo = v_correo;
  delete from public.docente_intentos where correo = v_correo;  -- desbloquea el login
  return jsonb_build_object('ok', true);
end
$$;
revoke all on function public.metas_reset_confirmar(text,text,text) from public;
grant execute on function public.metas_reset_confirmar(text,text,text) to anon, authenticated;
