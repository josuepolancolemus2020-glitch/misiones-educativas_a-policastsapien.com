-- ============================================================
-- ⚠️⚠️ OBSOLETO — NO VOLVER A CORRER ESTE ARCHIVO ⚠️⚠️
-- Reemplazado por SUPABASE-DOCENTES-V2.sql (cuenta con correo +
-- contraseña y emparejamiento por NOMBRE del maestro).
-- Correr esto DESPUÉS de V2 ROMPE las cuentas nuevas: revierte
-- _metas_docente_ok, metas_consultar_docente, metas_consultar_
-- progreso_docente y metas_cambiar_clave_docente al modelo viejo.
-- Se conserva solo como referencia histórica.
-- ============================================================
-- M.E.T.A.S — Suscripción de docentes (autoservicio, sin correo)
-- (histórico) Pegar COMPLETO en supabase.com → SQL Editor → Run
--
-- Flujo: el maestro toca «Suscribirme» en la app → su teléfono
-- genera un CÓDIGO DOCENTE (PROF-XXXX, para que sus alumnos lo
-- escriban al identificarse) y una CLAVE SECRETA. Con esa pareja
-- consulta en la nube SOLO los resultados de sus alumnos.
-- Nadie puede secuestrar un código ya existente (llave primaria).
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.docentes (
  codigo text primary key,                  -- PROF-XXXX (único)
  clave_hash text not null,                 -- sha256 de la clave secreta
  nombre text,
  contacto text,                            -- correo o WhatsApp (opcional)
  creado_en timestamptz not null default now()
);
alter table public.docentes enable row level security;
-- sin políticas: todo pasa por las funciones de abajo

-- Alta instantánea. Devuelve true si el código quedó registrado;
-- false si ya existía (el teléfono genera otro y reintenta).
create or replace function public.metas_suscribir_docente(
  p_codigo text, p_clave text, p_nombre text, p_contacto text
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if length(trim(coalesce(p_codigo,''))) < 6 or length(trim(coalesce(p_clave,''))) < 4 then
    return false;
  end if;
  insert into public.docentes (codigo, clave_hash, nombre, contacto)
  values (
    upper(trim(p_codigo)),
    encode(extensions.digest(trim(p_clave), 'sha256'), 'hex'),
    left(coalesce(p_nombre,''), 80),
    left(coalesce(p_contacto,''), 120)
  );
  return true;
exception when unique_violation then
  return false;
end
$$;
revoke all on function public.metas_suscribir_docente(text,text,text,text) from public;
grant execute on function public.metas_suscribir_docente(text,text,text,text) to anon, authenticated;

-- ¿La pareja código+clave es válida?
create or replace function public._metas_docente_ok(p_codigo text, p_clave text)
returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.docentes d
    where d.codigo = upper(trim(coalesce(p_codigo,'')))
      and d.clave_hash = encode(extensions.digest(trim(coalesce(p_clave,'')), 'sha256'), 'hex')
  )
$$;
-- interna: la usan las funciones de abajo (security definer), NO se
-- expone a los clientes. En Supabase EXECUTE se concede por defecto a
-- public/anon/authenticated, así que hay que revocarlo explícitamente
-- para que nadie pueda probar claves por fuerza bruta contra ella.
revoke all on function public._metas_docente_ok(text,text) from public, anon, authenticated;

-- Resultados SOLO de los alumnos que llevan su código en el campo docente
create or replace function public.metas_consultar_docente(p_codigo text, p_clave text)
returns setof public.resultados
language sql security definer stable set search_path = public
as $$
  -- coincidencia tolerante: mayúsculas/minúsculas, guiones y espacios dan igual
  -- (el niño puede escribir «prof k7q2» y cuenta como PROF-K7Q2)
  select r.* from public.resultados r
  where public._metas_docente_ok(p_codigo, p_clave)
    and regexp_replace(upper(coalesce(r.docente,'')), '[^A-Z0-9]', '', 'g')
        like '%' || regexp_replace(upper(coalesce(p_codigo,'')), '[^A-Z0-9]', '', 'g') || '%'
  order by r.creado_en desc
  limit 2000
$$;
revoke all on function public.metas_consultar_docente(text,text) from public;
grant execute on function public.metas_consultar_docente(text,text) to anon, authenticated;

-- Progreso (XP, insignias) SOLO de sus alumnos
create or replace function public.metas_consultar_progreso_docente(p_codigo text, p_clave text)
returns setof public.progreso
language sql security definer stable set search_path = public
as $$
  select p.* from public.progreso p
  where public._metas_docente_ok(p_codigo, p_clave)
    and regexp_replace(upper(coalesce(p.docente,'')), '[^A-Z0-9]', '', 'g')
        like '%' || regexp_replace(upper(coalesce(p_codigo,'')), '[^A-Z0-9]', '', 'g') || '%'
  order by p.actualizado_en desc
  limit 1000
$$;
revoke all on function public.metas_consultar_progreso_docente(text,text) from public;
grant execute on function public.metas_consultar_progreso_docente(text,text) to anon, authenticated;

-- Cambiar la clave secreta (sabiendo la actual)
create or replace function public.metas_cambiar_clave_docente(
  p_codigo text, p_actual text, p_nueva text
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if length(trim(coalesce(p_nueva,''))) < 4 then return false; end if;
  update public.docentes
     set clave_hash = encode(extensions.digest(trim(p_nueva), 'sha256'), 'hex')
   where codigo = upper(trim(coalesce(p_codigo,'')))
     and clave_hash = encode(extensions.digest(trim(coalesce(p_actual,'')), 'sha256'), 'hex');
  return found;
end
$$;
revoke all on function public.metas_cambiar_clave_docente(text,text,text) from public;
grant execute on function public.metas_cambiar_clave_docente(text,text,text) to anon, authenticated;
