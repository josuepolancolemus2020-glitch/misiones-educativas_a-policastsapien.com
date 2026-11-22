-- Lo mínimo de Supabase que necesitan los .sql de _privado/: los roles de
-- la API, el esquema «extensions» y los permisos de fábrica sobre public
-- (Supabase le da todo a anon en cada tabla y función nueva; por eso los
-- revoke del archivo de topes importan y aquí se comprueban).
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin; end if;
end $$;
create schema if not exists extensions;
grant usage on schema public, extensions to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
-- SUPABASE-DOCENTES-V2.sql pone índices en estas dos; aquí no hace falta más.
create table if not exists public.plan_accion (codigo text, docente text);
create table if not exists public.registro_admin (codigo text, docente text);
