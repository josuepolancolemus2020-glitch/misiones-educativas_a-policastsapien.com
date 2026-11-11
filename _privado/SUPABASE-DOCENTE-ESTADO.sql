-- ============================================================
-- M.E.T.A.S — Supabase: ESPEJO DEL ESTADO DEL MAESTRO (multi-dispositivo)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ Requiere haber corrido antes SUPABASE-DOCENTES.sql
--    (usa la tabla public.docentes y la función public._metas_docente_ok).
--
-- Qué resuelve:
--   Las herramientas de la Zona Docente (Registros Admin, Plan de
--   Acción, claves de familia, Campeonísimo, Gobierno Escolar, candado
--   del maestro) se guardan en localStorage de CADA equipo. Por eso el
--   mismo maestro veía datos distintos en el teléfono y en la PC.
--   Esta tabla es un ESPEJO por CÓDIGO DOCENTE (PROF-XXXX): cada equipo
--   sube lo que cambió y baja lo más nuevo, así todos convergen.
--
-- Modelo:
--   Una fila por (codigo, k) donde k es la clave de localStorage.
--   'version' es la marca de tiempo (ms) del último cambio en el equipo
--   que la escribió → conflicto = gana la más nueva (last-write-wins).
--   El valor viaja envuelto: { "raw": "<texto exacto de localStorage>" }.
-- ============================================================

create table if not exists public.docente_estado (
  codigo text not null,                         -- PROF-XXXX (dueño)
  k text not null,                              -- clave de localStorage
  valor jsonb,                                  -- { raw: "<texto>" }
  version bigint not null default 0,            -- marca de tiempo (ms) del cambio
  dispositivo text,                             -- pista de qué equipo escribió
  actualizado_en timestamptz not null default now(),
  primary key (codigo, k)
);
alter table public.docente_estado enable row level security;
-- sin políticas anónimas: todo pasa por las funciones (validan clave)

-- ── Guardar/actualizar desde el equipo del maestro ──
-- p_entradas: [{ k, valor, version, dispositivo }, ...]
-- p_forzar : false = automático → conflicto gana la versión más nueva
--            (no pisa un cambio posterior hecho en otro equipo).
--            true  = reconciliación manual («⬆️ Subir lo de este equipo»)
--            → este equipo es la copia buena y pisa la nube sin importar
--              versiones (a prueba de relojes desajustados entre equipos).
-- Solo escribe si la clave es correcta.
drop function if exists public.metas_docente_estado_guardar(text,text,jsonb);
create or replace function public.metas_docente_estado_guardar(
  p_codigo text, p_clave text, p_entradas jsonb, p_forzar boolean default false
) returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  e jsonb;
  cod text := upper(trim(coalesce(p_codigo,'')));
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return -1;                                  -- clave incorrecta
  end if;
  if jsonb_typeof(p_entradas) <> 'array' or jsonb_array_length(p_entradas) > 60 then
    return 0;
  end if;
  for e in select * from jsonb_array_elements(p_entradas) loop
    begin
      if coalesce(e->>'k','') = '' then continue; end if;
      insert into public.docente_estado (codigo, k, valor, version, dispositivo)
      values (
        cod,
        left(e->>'k', 80),
        e->'valor',
        coalesce((e->>'version')::bigint, 0),
        left(coalesce(e->>'dispositivo',''), 60)
      )
      on conflict (codigo, k) do update set
        valor = excluded.valor,
        version = excluded.version,
        dispositivo = excluded.dispositivo,
        actualizado_en = now()
      where p_forzar or excluded.version >= public.docente_estado.version;  -- LWW, salvo forzado
      n := n + 1;
    exception when others then
      null;                                     -- una fila mala no tumba el lote
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_docente_estado_guardar(text,text,jsonb,boolean) from public;
grant execute on function public.metas_docente_estado_guardar(text,text,jsonb,boolean) to anon, authenticated;

-- ── Leer todo el estado del maestro (para bajar al equipo) ──
create or replace function public.metas_docente_estado_leer(
  p_codigo text, p_clave text
) returns table (k text, valor jsonb, version bigint, dispositivo text, actualizado_en timestamptz)
language plpgsql security definer stable set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return;                                     -- clave incorrecta → vacío
  end if;
  return query
    select d.k, d.valor, d.version, d.dispositivo, d.actualizado_en
    from public.docente_estado d
    where d.codigo = cod
    order by d.k;
end
$$;
revoke all on function public.metas_docente_estado_leer(text,text) from public;
grant execute on function public.metas_docente_estado_leer(text,text) to anon, authenticated;
