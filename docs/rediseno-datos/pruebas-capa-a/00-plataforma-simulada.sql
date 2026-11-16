-- ============================================================================
-- Capa A · PLATAFORMA Supabase simulada para un Postgres local suelto
-- ----------------------------------------------------------------------------
-- Solo para la base desechable que arma corre.sh. Imita lo que Supabase trae
-- de fábrica y usan nuestros archivos: roles, auth.uid(), auth.jwt(),
-- auth.users, realtime.send / realtime.topic / realtime.messages (con sus
-- columnas reales), la publicación supabase_realtime, el esquema extensions
-- con pgcrypto y los permisos de fábrica de public.
-- Contra `supabase start` este archivo NO se corre: todo esto ya está, y de
-- verdad (_dev/supabase-local/corre-supabase.sh). El modelo viejo va aparte,
-- en 00-modelo-viejo.sql, y ese sí corre en los dos.
-- ============================================================================

-- ── Roles de Supabase ───────────────────────────────────────────────────────
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon')          then create role anon nologin noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role')  then create role service_role nologin noinherit bypassrls; end if;
end $$;
grant usage on schema public to anon, authenticated, service_role;

-- Permisos de FÁBRICA de Supabase en public: todo lo que se cree aquí (tablas,
-- funciones, secuencias) nace con GRANT ALL para anon, authenticated y
-- service_role. Por eso cada función interna que nuestros archivos crean o
-- renombran en public tiene que quitarse esos permisos a mano: no basta con
-- quitárselos a PUBLIC. Va antes del modelo viejo para que sus tablas y
-- funciones nazcan con los mismos permisos que en el proyecto real.
alter default privileges for role postgres in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to anon, authenticated, service_role;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists dblink;
grant usage on schema extensions to anon, authenticated, service_role;

-- ── auth ────────────────────────────────────────────────────────────────────
create schema if not exists auth;
grant usage on schema auth to anon, authenticated, service_role;
create table if not exists auth.users (
  id    uuid primary key,
  email text unique,
  is_anonymous boolean not null default false
);
-- Igual que Supabase: el uid sale de los «claims» del JWT de la petición.
create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb)
$$;
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(auth.jwt() ->> 'sub', '')::uuid
$$;
grant execute on function auth.jwt(), auth.uid() to public;

-- ── realtime ────────────────────────────────────────────────────────────────
create schema if not exists realtime;
grant usage on schema realtime to anon, authenticated, service_role;
-- Mismas columnas que la tabla real (sin sus particiones por día): las
-- pruebas solo usan las que existen también en Supabase.
create table if not exists realtime.messages (
  id          bigint generated always as identity primary key,
  topic       text not null,
  extension   text not null default 'broadcast',
  event       text,
  payload     jsonb,
  private     boolean default false,
  updated_at  timestamptz not null default clock_timestamp(),
  inserted_at timestamptz not null default clock_timestamp()
);
alter table realtime.messages enable row level security;
grant select on realtime.messages to authenticated;
create or replace function realtime.topic() returns text language sql stable as $$
  select nullif(current_setting('realtime.topic', true), '')
$$;
grant execute on function realtime.topic() to public;
create or replace function realtime.send(payload jsonb, event text, topic text, private boolean default true)
returns void language sql security definer as $$
  insert into realtime.messages (topic, event, payload, private) values (topic, event, payload, private)
$$;
do $$ begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

