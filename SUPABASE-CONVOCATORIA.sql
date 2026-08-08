-- ============================================================
-- M.E.T.A.S — Supabase: CONVOCATORIA (¿va o no va?)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run.
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- PARA QUÉ:
--   El maestro tiene que contratar buses para una salida y necesita
--   saber CUÁNTA GENTE VA antes de pagarlos. Hoy eso se hace pasando
--   un cuaderno o contando mensajes sueltos de WhatsApp, y el número
--   nunca cuadra. Aquí el padre toca un enlace, responde en veinte
--   segundos y el maestro ve el total en su pantalla.
--
--   El enlace se manda al grupo de WhatsApp de TODA LA ESCUELA, así
--   que quien responde NO necesita clave de familia ni cuenta: por eso
--   el padre dice a mano el nombre del alumno y su grado.
--
-- QUÉ CREA:
--   1) Tabla convocatorias — lo público del evento (título, fecha,
--      lugar, aporte…) bajo un código corto (ej. R4TP) y un PIN
--      secreto que solo tiene el maestro.
--   2) Tabla convocatoria_respuestas — una fila por alumno: si va,
--      cuántas personas de esa casa y el teléfono de contacto.
--   3) RPCs (única puerta de entrada, RLS cerrada):
--      - metas_conv_crear(codigo, pin, datos)     → el maestro abre
--      - metas_conv_publicar(codigo, pin, datos)  → el maestro edita/cierra
--      - metas_conv_ver(codigo)                   → cualquiera ve el evento
--      - metas_conv_responder(...)                → el padre contesta
--      - metas_conv_respuestas(codigo, pin)       → el maestro lee todo
--   4) Higiene: las convocatorias de más de 60 días se borran solas al
--      crear una nueva. Una salida es un evento del mes, no un archivo.
--
-- LO QUE NO SALE NUNCA SIN EL PIN: los nombres y los teléfonos.
--   metas_conv_ver devuelve el evento y CUÁNTOS van (el «ya somos 37»
--   que anima al que duda), pero jamás quién ni con qué número. El
--   enlace anda suelto en un grupo de WhatsApp de cientos de personas.
-- ============================================================

create table if not exists public.convocatorias (
  codigo text primary key,                  -- ej. R4TP (alfabeto sin 0/O/1/I/L)
  pin_hash text not null,                   -- sha256(pin || codigo)
  datos jsonb not null default '{}'::jsonb, -- título, fecha, lugar, aporte, cierre…
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);
alter table public.convocatorias enable row level security;

-- Una fila por ALUMNO. La `huella` es el nombre del alumno + su grado y
-- sección, normalizados; con ella, si la madre contesta dos veces (o
-- desde otro teléfono) se CORRIGE su respuesta en vez de contar doble.
-- Contar doble es justo el error que hace pagar un bus de más.
create table if not exists public.convocatoria_respuestas (
  id bigint generated always as identity primary key,
  codigo text not null references public.convocatorias(codigo) on delete cascade,
  huella text not null,
  va boolean not null,
  alumno text not null default '',
  grado text not null default '',
  seccion text not null default '',
  personas integer not null default 1 check (personas between 0 and 20),
  tel text not null default '',
  nota text not null default '',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (codigo, huella)
);
alter table public.convocatoria_respuestas enable row level security;
create index if not exists convocatoria_respuestas_codigo_idx
  on public.convocatoria_respuestas (codigo);

-- ── El maestro abre (o retoma) una convocatoria ──
create or replace function public.metas_conv_crear(p_codigo text, p_pin text, p_datos jsonb)
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
  if p_datos is null or length(p_datos::text) > 8000 then
    return false;
  end if;

  -- higiene: fuera lo de hace más de dos meses (las respuestas se van en cascada)
  delete from public.convocatorias where creada_en < now() - interval '60 days';

  h := encode(extensions.digest(convert_to(p_pin || cod, 'UTF8'), 'sha256'), 'hex');

  -- anti-secuestro: si el código ya existe con otro PIN, no se toca
  insert into public.convocatorias (codigo, pin_hash, datos)
  values (cod, h, p_datos)
  on conflict (codigo) do nothing;

  return exists (
    select 1 from public.convocatorias where codigo = cod and pin_hash = h
  );
end
$$;
revoke all on function public.metas_conv_crear(text, text, jsonb) from public;
grant execute on function public.metas_conv_crear(text, text, jsonb) to anon, authenticated;

-- ── El maestro corrige los datos del evento, o lo cierra ──
create or replace function public.metas_conv_publicar(p_codigo text, p_pin text, p_datos jsonb)
returns boolean
language plpgsql security definer set search_path = public, extensions
as $$
declare
  cod text := upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'));
  h text := encode(extensions.digest(
    convert_to(coalesce(p_pin,'') || upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')), 'UTF8'),
    'sha256'), 'hex');
begin
  if p_datos is null or length(p_datos::text) > 8000 then
    return false;
  end if;
  update public.convocatorias
     set datos = p_datos, actualizada_en = now()
   where codigo = cod and pin_hash = h;
  return found;
end
$$;
revoke all on function public.metas_conv_publicar(text, text, jsonb) from public;
grant execute on function public.metas_conv_publicar(text, text, jsonb) to anon, authenticated;

-- ── Cualquiera con el enlace ve el evento ──
-- Devuelve el conteo, NUNCA los nombres ni los teléfonos.
create or replace function public.metas_conv_ver(p_codigo text)
returns table (datos jsonb, familias integer, personas integer, actualizada_en timestamptz)
language sql security definer stable set search_path = public
as $$
  select c.datos,
         coalesce((select count(*)::integer from public.convocatoria_respuestas r
                    where r.codigo = c.codigo and r.va), 0),
         coalesce((select sum(r.personas)::integer from public.convocatoria_respuestas r
                    where r.codigo = c.codigo and r.va), 0),
         c.actualizada_en
  from public.convocatorias c
  where length(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')) >= 4
    and c.codigo = upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'))
  limit 1
$$;
revoke all on function public.metas_conv_ver(text) from public;
grant execute on function public.metas_conv_ver(text) to anon, authenticated;

-- ── El padre contesta (y puede corregirse) ──
-- Vale la ÚLTIMA respuesta de cada alumno: la madre que se equivocó de
-- número vuelve a entrar y lo arregla ella misma, sin escribirle a nadie.
create or replace function public.metas_conv_responder(
  p_codigo text, p_huella text, p_va boolean, p_alumno text,
  p_grado text, p_seccion text, p_personas integer, p_tel text, p_nota text
)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  cod text := upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'));
  hue text := left(trim(coalesce(p_huella,'')), 120);
  n integer := least(greatest(coalesce(p_personas, 1), 0), 20);
begin
  -- candado de velocidad (SUPABASE-FASE3/SEGURIDAD). Si aún no está
  -- creado, la convocatoria igual funciona: no se cae por eso.
  begin
    if not public.metas_rate_ok() then return false; end if;
  exception when undefined_function then null;
  end;

  if hue = '' then return false; end if;
  if not exists (
    select 1 from public.convocatorias
    where codigo = cod and coalesce(datos->>'cerrada','') <> '1'
  ) then
    return false;
  end if;

  insert into public.convocatoria_respuestas
    (codigo, huella, va, alumno, grado, seccion, personas, tel, nota)
  values (
    cod, hue, coalesce(p_va, false),
    left(trim(coalesce(p_alumno,'')), 80),
    left(trim(coalesce(p_grado,'')), 20),
    left(trim(coalesce(p_seccion,'')), 10),
    case when coalesce(p_va, false) then greatest(n, 1) else 0 end,
    left(trim(coalesce(p_tel,'')), 30),
    left(trim(coalesce(p_nota,'')), 200)
  )
  on conflict (codigo, huella) do update set
    va = excluded.va, alumno = excluded.alumno,
    grado = excluded.grado, seccion = excluded.seccion,
    personas = excluded.personas, tel = excluded.tel, nota = excluded.nota,
    actualizado_en = now();
  return true;
exception when others then
  return false;   -- un dato raro no revienta la pantalla del padre
end
$$;
revoke all on function public.metas_conv_responder(text, text, boolean, text, text, text, integer, text, text) from public;
grant execute on function public.metas_conv_responder(text, text, boolean, text, text, text, integer, text, text) to anon, authenticated;

-- ── El maestro lee TODAS las respuestas (exige el PIN) ──
create or replace function public.metas_conv_respuestas(p_codigo text, p_pin text)
returns table (va boolean, alumno text, grado text, seccion text,
               personas integer, tel text, nota text, actualizado_en timestamptz)
language sql security definer stable set search_path = public, extensions
as $$
  select r.va, r.alumno, r.grado, r.seccion, r.personas, r.tel, r.nota, r.actualizado_en
  from public.convocatoria_respuestas r
  join public.convocatorias c on c.codigo = r.codigo
  where r.codigo = upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'))
    and c.pin_hash = encode(extensions.digest(
      convert_to(coalesce(p_pin,'') || upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')), 'UTF8'),
      'sha256'), 'hex')
  order by r.va desc, r.grado asc, r.alumno asc
  limit 1000
$$;
revoke all on function public.metas_conv_respuestas(text, text) from public;
grant execute on function public.metas_conv_respuestas(text, text) to anon, authenticated;

-- ============================================================
-- Verificación rápida (opcional, pegar después del Run):
--   select public.metas_conv_crear('R4TP','123456','{"t":"Excursión"}'::jsonb);  -- true
--   select public.metas_conv_crear('R4TP','999999','{}'::jsonb);                 -- false (anti-secuestro)
--   select public.metas_conv_responder('R4TP','ana lopez|6|1',true,'Ana López','6','1',3,'99887766','');  -- true
--   select public.metas_conv_responder('R4TP','ana lopez|6|1',true,'Ana López','6','1',2,'99887766','');  -- true (corrige, no duplica)
--   select * from public.metas_conv_ver('R4TP');            -- familias 1, personas 2
--   select * from public.metas_conv_respuestas('R4TP','123456');  -- 1 fila
--   delete from public.convocatorias where codigo = 'R4TP';       -- se lleva las respuestas
-- ============================================================
