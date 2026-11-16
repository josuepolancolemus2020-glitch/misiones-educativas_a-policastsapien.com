-- ============================================================================
-- M.E.T.A.S · Vinculación de cuentas a Supabase Auth · PROPUESTA (rev. 3)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR en el proyecto real. FASE APARTE: necesita aprobación.
--    Es el PRIMER archivo: crea el esquema metas, el freno de intentos (que
--    metas-entrar usa desde el primer día) y la copia de claves.
--
-- Regla de cuentas: NO se borra, modifica ni recrea ninguna fila de
-- public.docentes. Este archivo solo crea objetos nuevos en `metas`. El
-- docente sigue entrando con su correo y su contraseña de siempre, que se
-- validan contra public.docentes.clave_hash con metas_entrar_docente_v2.
-- ============================================================================

create schema if not exists metas;
revoke all on schema metas from public, anon;
grant usage on schema metas to authenticated, service_role;   -- service_role: las funciones de borde
-- (Que ninguna función nueva quede abierta a PUBLIC se hace al FINAL del
--  archivo con «revoke execute on all functions in schema metas from public»:
--  «alter default privileges … in schema» no alcanza, ver el cierre.)

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Freno de intentos (lo usa metas-entrar ANTES de validar la contraseña)
-- ════════════════════════════════════════════════════════════════════════════
-- La IP la pasa la función de borde (la que añade la infraestructura de
-- Supabase, nunca una cabecera escrita por el cliente). Aquí solo se cuenta.
create table if not exists metas.frenos (
  llave    text        not null,
  ventana  timestamptz not null,
  n        integer     not null default 0,
  primary key (llave, ventana)
);
alter table metas.frenos enable row level security;   -- sin políticas: solo las funciones
revoke all on metas.frenos from public, anon, authenticated;

create or replace function metas.freno_ok(p_llave text, p_max int, p_ventana interval)
returns boolean language plpgsql volatile security definer set search_path = metas, pg_temp as $$
declare
  v_ini timestamptz := date_bin(p_ventana, now(), timestamptz '2000-01-01');
  v_n   int;
begin
  delete from metas.frenos where ventana < now() - interval '1 day';
  insert into metas.frenos as f (llave, ventana, n) values (left(p_llave, 200), v_ini, 1)
  on conflict (llave, ventana) do update set n = f.n + 1
  returning n into v_n;
  return v_n <= p_max;
end $$;
revoke all on function metas.freno_ok(text, int, interval) from public, anon, authenticated;
grant execute on function metas.freno_ok(text, int, interval) to service_role;

-- Devuelve el intento que freno_ok contó (rev. 8). Para el freno por correo
-- de metas-entrar: el intento se cuenta AL LLEGAR (así veinte intentos a la
-- vez no pasan todos antes de que alguno sume) y, si la contraseña era la
-- buena, se devuelve. Resultado: solo los fallos se quedan en la cuenta, y
-- quien sepa el correo de un docente no lo deja una hora fuera entrando bien
-- veinte veces. Nunca baja de cero ni crea filas.
create or replace function metas.freno_devolver(p_llave text, p_ventana interval)
returns void language sql volatile security definer set search_path = metas, pg_temp as $$
  update metas.frenos set n = greatest(n - 1, 0)
   where llave = left(p_llave, 200) and ventana = date_bin(p_ventana, now(), timestamptz '2000-01-01')
$$;
revoke all on function metas.freno_devolver(text, interval) from public, anon, authenticated;
grant execute on function metas.freno_devolver(text, interval) to service_role;

-- Alertas para quien administra (no para el docente): por ejemplo, demasiadas
-- claves de familia equivocadas en una hora en todo el sistema.
create table if not exists metas.alertas (
  id         bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default now(),
  tipo       text        not null,
  detalle    jsonb
);
alter table metas.alertas enable row level security;
revoke all on metas.alertas from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Vínculo docente ↔ usuario de Auth
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists metas.cuentas (
  auth_uid        uuid        primary key references auth.users (id),
  docente_codigo  text        not null unique,     -- PROF-XXXXXXXXXX, tal cual está en public.docentes
  correo_interno  text        not null unique,     -- prof-xxxxxxxxxx@cuentas.metas.policastsapien.com
  vinculada_at    timestamptz not null default now()
);
alter table metas.cuentas enable row level security;
create policy cuentas_mia on metas.cuentas for select to authenticated using (auth_uid = (select auth.uid()));
revoke all on metas.cuentas from public, anon, authenticated;
grant select on metas.cuentas to authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Copia INMUTABLE de las claves de familia del archivo viejo
-- ════════════════════════════════════════════════════════════════════════════
-- Para aceptar una clave «conservada» solo si era de ESE docente sin leer el
-- blob vivo (que un aparato viejo podría seguir cambiando). Se llena:
--   · para TODOS, en el paso 1 del congelado (metas._claves_tomar_todas);
--   · para quien se vincule DESPUÉS del paso 1, en el momento de vincularse
--     (desde ahí el candado del paso 1 ya no le deja cambiar sus claves).
-- Antes del paso 1 NO se toma al vincularse: el cierre de año todavía puede
-- regenerar claves, y una clave del año pasado no debe poder «conservarse»
-- para un niño de este año.
create table if not exists metas.claves_archivo (
  docente_codigo  text        not null,
  clave           text        not null,              -- normalizada (sin guiones, mayúsculas)
  nombre_alumno   text,                              -- si la lista vieja lo tenía, para avisar si se le asigna a otro niño
  origen          text        not null,              -- 'METAS_CODIGOS_V1' | 'METAS_ADMIN_V1'
  tomada_at       timestamptz not null default now(),
  primary key (docente_codigo, clave)
);
alter table metas.claves_archivo enable row level security;
-- El docente ve SUS claves viejas (la carga rápida le avisa «esta clave era
-- de Ana López»). Nadie escribe salvo las funciones de abajo.
create policy claves_archivo_mias on metas.claves_archivo for select to authenticated
  using (docente_codigo = (select c.docente_codigo from metas.cuentas c where c.auth_uid = (select auth.uid())));
revoke all on metas.claves_archivo from public, anon, authenticated;
grant select on metas.claves_archivo to authenticated;

create or replace function metas._inmutable()
returns trigger language plpgsql as $$
begin
  raise exception 'metas: % es de solo inserción', tg_table_name using errcode = 'MT006';
end $$;
create trigger claves_archivo_inmutable before update or delete on metas.claves_archivo
  for each row execute function metas._inmutable();
create trigger claves_archivo_sin_truncate before truncate on metas.claves_archivo
  for each statement execute function metas._inmutable();

-- Hitos de la transición (cuándo corrió cada paso).
create table if not exists metas.hitos (
  nombre  text        primary key,
  at      timestamptz not null default now()
);
alter table metas.hitos enable row level security;
revoke all on metas.hitos from public, anon, authenticated;

-- JSON a prueba de basura: un raw inválido no rompe nada, solo no aporta.
create or replace function metas._json_o_nulo(t text)
returns jsonb language plpgsql immutable as $$
begin
  return t::jsonb;
exception when others then
  return null;
end $$;

create or replace function metas.norm_clave(t text)
returns text language sql immutable parallel safe as $$
  select nullif(regexp_replace(upper(coalesce(t, '')), '[^0-9A-Z]', '', 'g'), '')
$$;

-- Toma las claves de UN docente del archivo, tolerando raw inválido.
create or replace function metas._claves_tomar(p_codigo text)
returns integer language plpgsql security definer set search_path = metas, public, pg_temp as $$
declare
  e record; j jsonb; n int := 0; k int;
begin
  for e in select d.k, d.valor from public.docente_estado d
            where d.codigo = p_codigo and d.k in ('METAS_CODIGOS_V1', 'METAS_ADMIN_V1') loop
    j := metas._json_o_nulo(e.valor ->> 'raw');
    continue when j is null or jsonb_typeof(j) <> 'object';
    if e.k = 'METAS_CODIGOS_V1' then
      insert into metas.claves_archivo (docente_codigo, clave, origen)
      select p_codigo, metas.norm_clave(v #>> '{}'), e.k
        from jsonb_path_query(j, 'lax $.*.*') v
       where jsonb_typeof(v) = 'string' and metas.norm_clave(v #>> '{}') is not null
      on conflict do nothing;
    else
      insert into metas.claves_archivo (docente_codigo, clave, nombre_alumno, origen)
      select p_codigo, metas.norm_clave(a ->> 'clave'), left(a ->> 'nombre', 120), e.k
        from jsonb_path_query(j, 'lax $.grupos[*].lista[*]') a
       where jsonb_typeof(a) = 'object' and metas.norm_clave(a ->> 'clave') is not null
      on conflict (docente_codigo, clave) do nothing;
    end if;
    get diagnostics k = row_count; n := n + k;
  end loop;
  return n;
end $$;

create or replace function metas._claves_tomar_todas()
returns integer language plpgsql security definer set search_path = metas, public, pg_temp as $$
declare c text; n int := 0;
begin
  for c in select distinct codigo from public.docente_estado
            where k in ('METAS_CODIGOS_V1', 'METAS_ADMIN_V1') loop
    n := n + metas._claves_tomar(c);
  end loop;
  insert into metas.hitos (nombre) values ('paso1') on conflict do nothing;
  return n;
end $$;
revoke all on function metas._claves_tomar(text), metas._claves_tomar_todas() from public, anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. Registrar el vínculo (solo la función de borde, con la llave de servicio)
-- ════════════════════════════════════════════════════════════════════════════
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
  -- Quien se vincula después del paso 1: su copia de claves se toma ahora.
  if exists (select 1 from metas.hitos where nombre = 'paso1') then
    perform metas._claves_tomar(p_codigo);
  end if;
  return v;   -- si otro aparato ganó, devuelve SU auth_uid; la función de borde borra el usuario sobrante
end $$;
revoke all on function metas.cuenta_registrar(uuid, text, text) from public, anon, authenticated;
grant execute on function metas.cuenta_registrar(uuid, text, text) to service_role;

create or replace function metas.cuenta_de(p_codigo text)
returns table (auth_uid uuid, correo_interno text)
language sql stable security definer set search_path = metas, pg_temp as $$
  select auth_uid, correo_interno from metas.cuentas where docente_codigo = p_codigo
$$;
revoke all on function metas.cuenta_de(text) from public, anon, authenticated;
grant execute on function metas.cuenta_de(text) to service_role;

-- ── Configuración en el panel (no es SQL) ───────────────────────────────────
-- 1. Auth → Sign In / Providers → Email: «Allow new users to sign up» APAGADO.
-- 2. Auth → Sign In / Providers: «Allow anonymous sign-ins» ENCENDIDO (padres).
-- 3. Auth → Bot and Abuse Protection: CAPTCHA Turnstile OBLIGATORIO. Sin
--    token válido no se abre ninguna sesión anónima. No es opcional.
-- 4. Auth → Rate Limits: los de fábrica para entradas y verificaciones.
-- 5. Edge Functions: metas-entrar (con el freno por IP de la sección 1),
--    metas-salir-todos y familia-vincular (con el secreto de Turnstile).
-- 6. API → Exposed schemas: añadir «metas».
--
-- ── Cómo deshacerlo ─────────────────────────────────────────────────────────
-- ⚠️ SOLO es seguro ANTES de que ese docente cree datos en la base nueva.
-- Toda fila de metas guarda owner = auth_uid de su usuario de Auth. Si se
-- borra el usuario y luego se vuelve a vincular, nace OTRO auth_uid y el
-- docente deja de ver sus filas. Antes de crear datos: borrar la fila de
-- metas.cuentas y el usuario de Auth con correo @cuentas.metas.policastsapien.com.
-- public.docentes queda como estaba. Después de crear datos: NO se deshace.
--
-- ── Cerrar las otras sesiones al cambiar la contraseña ─────────────────────
-- «metas-salir-todos»: signOut(uid, 'others') después de
-- metas_cambiar_clave_docente (la llama la app); signOut(uid, 'global')
-- después de metas_reset_confirmar (la llama la función reset-clave).
--
-- ── Comprobación ────────────────────────────────────────────────────────────
-- Tras la primera entrada de un docente de prueba (cuenta ficticia):
--   select count(*) from metas.cuentas where docente_codigo = 'PROF-PRUEBA00';  → 1
--   select clave_hash from public.docentes where codigo = 'PROF-PRUEBA00';      → el MISMO valor que antes
-- ── Cierre de permisos ──────────────────────────────────────────────────────
-- «alter default privileges … in schema metas revoke … from public» NO quita
-- el EXECUTE que PostgreSQL da a PUBLIC (un permiso global no se quita por
-- esquema; lo comprobó la capa A). Por eso, al final de cada archivo, se
-- quita a mano de TODAS las funciones de metas. Las que la app necesita ya
-- tienen su GRANT explícito a authenticated, service_role o al rol lector,
-- que no depende de PUBLIC.
revoke execute on all functions in schema metas from public;

-- ============================================================================
