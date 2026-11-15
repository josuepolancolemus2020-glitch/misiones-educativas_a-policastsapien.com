-- ============================================================================
-- M.E.T.A.S · Vinculación de cuentas a Supabase Auth · PROPUESTA
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR. FASE APARTE: necesita aprobación explícita.
--    Va ANTES de SUPABASE-V2-ESQUEMA.sql (sin sesión de Auth no se puede
--    escribir en la base nueva).
--
-- Regla de cuentas: NO se borra, modifica ni recrea ninguna fila de
-- public.docentes ni de ninguna tabla de cuentas. Este archivo SOLO crea una
-- tabla nueva (metas.cuentas) y una función que la llena. El docente sigue
-- entrando con su correo y su contraseña de siempre, que siguen validándose
-- contra public.docentes.clave_hash con metas_entrar_docente_v2.
--
-- El flujo completo (función de borde «metas-entrar») está en
-- 02-CUENTAS-Y-SEGURIDAD.md.
-- ============================================================================

create schema if not exists metas;

-- Un usuario de Auth por docente, creado la primera vez que entra.
create table if not exists metas.cuentas (
  auth_uid        uuid        primary key references auth.users (id),
  docente_codigo  text        not null unique,     -- PROF-XXXXXXXXXX, tal cual está en public.docentes
  correo_interno  text        not null unique,     -- prof-xxxxxxxxxx@cuentas.metas.policastsapien.com
  vinculada_at    timestamptz not null default now()
);
alter table metas.cuentas enable row level security;
-- El docente puede ver su propio vínculo (para mostrar «tu cuenta»). Nada más.
create policy cuentas_mia on metas.cuentas for select to authenticated using (auth_uid = auth.uid());
revoke all on metas.cuentas from public, anon, authenticated;
grant select on metas.cuentas to authenticated;

-- Solo la función de borde (llave de servicio) la llama.
-- Se llama DESPUÉS de que metas_entrar_docente_v2 dijo ok y DESPUÉS de crear
-- el usuario con admin.createUser. Si dos aparatos llegan a la vez, el
-- `unique` de docente_codigo deja pasar a uno y el otro recibe el vínculo ya
-- hecho.
create or replace function metas.cuenta_registrar(p_auth uuid, p_codigo text, p_correo_interno text)
returns uuid language plpgsql security definer set search_path = metas, public, pg_temp as $$
declare v uuid;
begin
  if not exists (select 1 from public.docentes d where d.codigo = p_codigo) then
    raise exception 'metas: el código no existe';
  end if;
  insert into metas.cuentas (auth_uid, docente_codigo, correo_interno)
  values (p_auth, p_codigo, p_correo_interno)
  on conflict (docente_codigo) do nothing;
  select auth_uid into v from metas.cuentas where docente_codigo = p_codigo;
  return v;   -- si otro aparato ganó, devuelve SU auth_uid; la función de borde borra el usuario sobrante
end $$;
revoke all on function metas.cuenta_registrar(uuid, text, text) from public, anon, authenticated;
grant execute on function metas.cuenta_registrar(uuid, text, text) to service_role;

-- Consulta de la función de borde: ¿ya está vinculado este código?
create or replace function metas.cuenta_de(p_codigo text)
returns table (auth_uid uuid, correo_interno text)
language sql stable security definer set search_path = metas, pg_temp as $$
  select auth_uid, correo_interno from metas.cuentas where docente_codigo = p_codigo
$$;
revoke all on function metas.cuenta_de(text) from public, anon, authenticated;
grant execute on function metas.cuenta_de(text) to service_role;

-- Freno extra por IP para metas-entrar (el de 5 fallos por correo ya existe en
-- metas_entrar_docente_v2 y no se toca). Usa metas.freno_ok del esquema v2;
-- si la vinculación se corre antes, se crea aquí una copia idéntica.

-- ── Configuración en el panel (no es SQL) ───────────────────────────────────
-- 1. Auth → Sign In / Providers → Email: «Allow new users to sign up» APAGADO.
-- 2. Auth → Sign In / Providers: «Allow anonymous sign-ins» ENCENDIDO (para
--    padres.html; ver SUPABASE-V2-FAMILIAS.sql). Recomendado: CAPTCHA Turnstile.
-- 3. Auth → Rate Limits: dejar los de fábrica para entradas y verificaciones.
-- 4. Edge Functions: desplegar metas-entrar (boceto en 02-CUENTAS-Y-SEGURIDAD.md).
-- 5. API → Exposed schemas: añadir «metas».
--
-- ── Cómo deshacerlo sin tocar a nadie ───────────────────────────────────────
-- Borrar las filas de metas.cuentas y los usuarios de Auth con correo
-- @cuentas.metas.policastsapien.com. public.docentes queda como estaba, y el
-- docente sigue entrando a la app vieja igual.
--
-- ── Comprobación ────────────────────────────────────────────────────────────
-- Tras la primera entrada de un docente de prueba (cuenta ficticia):
--   select count(*) from metas.cuentas where docente_codigo = 'PROF-PRUEBA00';  → 1
--   select clave_hash from public.docentes where codigo = 'PROF-PRUEBA00';      → el MISMO valor que antes
-- ============================================================================
