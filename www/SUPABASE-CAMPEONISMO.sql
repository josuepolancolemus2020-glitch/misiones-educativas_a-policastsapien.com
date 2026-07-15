-- ============================================================
-- M.E.T.A.S — Supabase: CAMPEONÍSIMO EN VIVO
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Qué hace:
--   1) Tabla camp_partidas: el equipo del JURADO publica el estado
--      público del torneo (marcador, turno, pregunta SIN la respuesta
--      correcta) bajo un código corto (ej. QK7M) y un PIN secreto.
--   2) Tabla camp_acciones: los teléfonos de los GRUPOS mandan su
--      respuesta (o su intento de robo en el rebote); vale la primera.
--   3) RPCs (única puerta de entrada, RLS cerrada):
--      - metas_camp_crear(codigo, pin)      → el jurado abre la partida
--      - metas_camp_publicar(codigo, pin, estado) → el jurado actualiza
--      - metas_camp_ver(codigo)             → cualquiera ve el marcador
--      - metas_camp_responder(...)          → un grupo responde/roba
--      - metas_camp_acciones(codigo, pin, qn) → el jurado lee respuestas
--   4) Higiene: partidas de más de 24 h se borran solas al crear una
--      nueva (el torneo es un evento del día, no un archivo histórico).
--
-- Principio: el torneo SIEMPRE corre completo en el equipo del jurado
-- (offline-first); esto es solo la capa de transmisión y respuestas.
-- ============================================================

create table if not exists public.camp_partidas (
  codigo text primary key,                  -- ej. QK7M (alfabeto sin 0/O/1/I/L)
  pin_hash text not null,                   -- sha256(pin || codigo)
  estado jsonb not null default '{}'::jsonb,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);
alter table public.camp_partidas enable row level security;

create table if not exists public.camp_acciones (
  id bigint generated always as identity primary key,
  codigo text not null,
  gi integer not null check (gi between 0 and 7),   -- índice del grupo
  qn integer not null check (qn between 1 and 500), -- nº de pregunta del torneo
  tipo text not null check (tipo in ('respuesta','robo')),
  opcion integer check (opcion between 0 and 3),    -- null en 'robo'
  creado_en timestamptz not null default now(),
  unique (codigo, gi, qn, tipo)             -- vale la PRIMERA del grupo
);
alter table public.camp_acciones enable row level security;

-- ── El jurado abre (o retoma) una partida ──
create or replace function public.metas_camp_crear(p_codigo text, p_pin text)
returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
declare
  cod text := upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'));
  h text;
begin
  if length(cod) < 4 or length(cod) > 8 or length(coalesce(p_pin,'')) < 4 then
    return false;
  end if;
  -- higiene: fuera partidas viejas y sus acciones
  delete from public.camp_acciones a using public.camp_partidas p
    where a.codigo = p.codigo and p.creada_en < now() - interval '24 hours';
  delete from public.camp_partidas where creada_en < now() - interval '24 hours';

  h := encode(extensions.digest(convert_to(p_pin || cod, 'UTF8'), 'sha256'), 'hex');

  -- anti-secuestro: si el código existe con otro PIN, se rechaza
  insert into public.camp_partidas (codigo, pin_hash)
  values (cod, h)
  on conflict (codigo) do nothing;

  return exists (
    select 1 from public.camp_partidas
    where codigo = cod and pin_hash = h
  );
end
$$;
revoke all on function public.metas_camp_crear(text, text) from public;
grant execute on function public.metas_camp_crear(text, text) to anon, authenticated;

-- ── El jurado publica el estado público del torneo ──
create or replace function public.metas_camp_publicar(p_codigo text, p_pin text, p_estado jsonb)
returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
declare
  cod text := upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'));
  h text := encode(extensions.digest(convert_to(coalesce(p_pin,'') || upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')), 'UTF8'), 'sha256'), 'hex');
begin
  if p_estado is null or length(p_estado::text) > 30000 then
    return false;
  end if;
  update public.camp_partidas
     set estado = p_estado, actualizada_en = now()
   where codigo = cod and pin_hash = h;
  return found;
end
$$;
revoke all on function public.metas_camp_publicar(text, text, jsonb) from public;
grant execute on function public.metas_camp_publicar(text, text, jsonb) to anon, authenticated;

-- ── Cualquiera con el código ve el estado (marcador público) ──
create or replace function public.metas_camp_ver(p_codigo text)
returns table (estado jsonb, actualizada_en timestamptz)
language sql security definer stable set search_path = public
as $$
  select estado, actualizada_en
  from public.camp_partidas
  where length(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')) >= 4
    and codigo = upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'))
    and creada_en > now() - interval '24 hours'
  limit 1
$$;
revoke all on function public.metas_camp_ver(text) from public;
grant execute on function public.metas_camp_ver(text) to anon, authenticated;

-- ── Un grupo responde (o pide robar en el rebote) ──
-- Vale la PRIMERA acción de cada grupo por pregunta (unique + do nothing);
-- el jurado sigue siendo la autoridad que valida.
create or replace function public.metas_camp_responder(
  p_codigo text, p_gi integer, p_qn integer, p_tipo text, p_opcion integer
)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  cod text := upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'));
begin
  if not exists (
    select 1 from public.camp_partidas
    where codigo = cod and actualizada_en > now() - interval '2 hours'
  ) then
    return false;
  end if;
  insert into public.camp_acciones (codigo, gi, qn, tipo, opcion)
  values (cod, p_gi, p_qn, p_tipo, case when p_tipo = 'robo' then null else p_opcion end)
  on conflict (codigo, gi, qn, tipo) do nothing;
  return found;
exception when others then
  return false;  -- checks (gi/qn/tipo/opcion) inválidos no revientan al cliente
end
$$;
revoke all on function public.metas_camp_responder(text, integer, integer, text, integer) from public;
grant execute on function public.metas_camp_responder(text, integer, integer, text, integer) to anon, authenticated;

-- ── El jurado lee las acciones de la pregunta actual ──
create or replace function public.metas_camp_acciones(p_codigo text, p_pin text, p_qn integer)
returns table (gi integer, tipo text, opcion integer, creado_en timestamptz)
language sql security definer stable set search_path = public, extensions
as $$
  select a.gi, a.tipo, a.opcion, a.creado_en
  from public.camp_acciones a
  join public.camp_partidas p on p.codigo = a.codigo
  where a.codigo = upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'))
    and p.pin_hash = encode(extensions.digest(convert_to(coalesce(p_pin,'') || upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')), 'UTF8'), 'sha256'), 'hex')
    and a.qn = p_qn
  order by a.creado_en asc
  limit 32
$$;
revoke all on function public.metas_camp_acciones(text, text, integer) from public;
grant execute on function public.metas_camp_acciones(text, text, integer) to anon, authenticated;

-- ============================================================
-- Verificación rápida (opcional, pegar después del Run):
--   select public.metas_camp_crear('QK7M', '1234');          -- true
--   select public.metas_camp_crear('QK7M', '9999');          -- false (anti-secuestro)
--   select public.metas_camp_publicar('QK7M','1234','{"fase":"turno"}'::jsonb); -- true
--   select * from public.metas_camp_ver('QK7M');             -- 1 fila
--   select public.metas_camp_responder('QK7M', 0, 1, 'respuesta', 2); -- true
--   select * from public.metas_camp_acciones('QK7M','1234',1);        -- 1 fila
--   delete from public.camp_acciones where codigo = 'QK7M';
--   delete from public.camp_partidas where codigo = 'QK7M';
-- ============================================================
