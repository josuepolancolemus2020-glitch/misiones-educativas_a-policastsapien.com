-- ============================================================
-- M.E.T.A.S — Supabase: PAPELERA DEL AULA (recuperar tras «Empezar de nuevo»)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ Requiere haber corrido antes SUPABASE-DOCENTES-V2.sql y
--    SUPABASE-DOCENTE-ESTADO.sql (usa public.docentes, _metas_docente_ok
--    y public.docente_estado).
--
-- Qué resuelve:
--   El maestro puede tocar «🗑️ Empezar de nuevo» por accidente. Antes se
--   borraba sin vuelta atrás. Ahora, al borrar, el estado del aula NO se
--   destruye: se ARCHIVA en esta papelera (en la nube). Así se puede
--   recuperar incluso desde OTRO equipo o después de reinstalar la app.
--   Se guarda solo el ÚLTIMO borrado por maestro (papelera de una copia).
-- ============================================================

create table if not exists public.docente_estado_papelera (
  codigo text not null,                         -- PROF-XXXX (dueño)
  k text not null,                              -- clave de localStorage archivada
  valor jsonb,                                  -- { raw: "<texto>" }
  version bigint not null default 0,
  archivado_en timestamptz not null default now(),
  primary key (codigo, k)
);
alter table public.docente_estado_papelera enable row level security;
-- sin políticas anónimas: todo pasa por las funciones (validan clave)

-- ── EMPEZAR DE NUEVO (archiva + vacía) ──
-- Copia el estado vivo del maestro a la papelera (reemplaza la copia
-- anterior) y deja el estado vivo en vacío con versión nueva, para que
-- todos sus equipos bajen el aula vacía.
create or replace function public.metas_docente_reset(
  p_codigo text, p_clave text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
  ver bigint := (floor(extract(epoch from clock_timestamp()) * 1000))::bigint;
  n integer := 0;
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;

  -- solo guardamos el último borrado: limpia la papelera anterior
  delete from public.docente_estado_papelera where codigo = cod;

  -- archiva el estado actual que tenga contenido real
  insert into public.docente_estado_papelera (codigo, k, valor, version, archivado_en)
  select d.codigo, d.k, d.valor, d.version, now()
  from public.docente_estado d
  where d.codigo = cod
    and d.valor is not null
    and coalesce(d.valor->>'raw','') <> '';
  get diagnostics n = row_count;

  -- vacía el estado vivo (null con versión nueva → los equipos bajan vacío)
  update public.docente_estado
     set valor = jsonb_build_object('raw', null),
         version = ver,
         actualizado_en = now()
   where codigo = cod;

  return jsonb_build_object('ok', true, 'n', n, 'fecha', now(), 'version', ver);
end
$$;
revoke all on function public.metas_docente_reset(text,text) from public;
grant execute on function public.metas_docente_reset(text,text) to anon, authenticated;

-- ── ¿HAY ALGO EN LA PAPELERA? ──
-- Para que cualquier equipo (aunque no tenga copia local) sepa que puede
-- recuperar, y desde cuándo.
create or replace function public.metas_docente_papelera(
  p_codigo text, p_clave text
) returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
  f timestamptz;
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return jsonb_build_object('hay', false);
  end if;
  select max(p.archivado_en) into f
  from public.docente_estado_papelera p where p.codigo = cod;
  if f is null then
    return jsonb_build_object('hay', false);
  end if;
  return jsonb_build_object('hay', true, 'fecha', f);
end
$$;
revoke all on function public.metas_docente_papelera(text,text) from public;
grant execute on function public.metas_docente_papelera(text,text) to anon, authenticated;

-- ── RECUPERAR LO QUE BORRÉ (restaura desde la papelera) ──
-- Devuelve el estado vivo la papelera al estado vivo con versión nueva
-- (para que todos los equipos lo bajen) y consume la papelera. Devuelve
-- las filas restauradas para que el equipo que llama las aplique al toque.
create or replace function public.metas_docente_reset_deshacer(
  p_codigo text, p_clave text
) returns table (k text, valor jsonb, version bigint)
language plpgsql security definer set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
  ver bigint := (floor(extract(epoch from clock_timestamp()) * 1000))::bigint;
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return;                                       -- clave incorrecta → vacío
  end if;

  -- restaura cada clave archivada al estado vivo con versión nueva
  insert into public.docente_estado (codigo, k, valor, version, dispositivo, actualizado_en)
  select p.codigo, p.k, p.valor, ver, 'recuperado', now()
  from public.docente_estado_papelera p
  where p.codigo = cod
  on conflict (codigo, k) do update set
    valor = excluded.valor,
    version = excluded.version,
    dispositivo = excluded.dispositivo,
    actualizado_en = now();

  -- consume la papelera (ya se recuperó)
  delete from public.docente_estado_papelera where codigo = cod;

  -- devuelve lo restaurado (solo lo que tiene contenido real)
  return query
    select d.k, d.valor, d.version
    from public.docente_estado d
    where d.codigo = cod
      and d.valor is not null
      and coalesce(d.valor->>'raw','') <> ''
    order by d.k;
end
$$;
revoke all on function public.metas_docente_reset_deshacer(text,text) from public;
grant execute on function public.metas_docente_reset_deshacer(text,text) to anon, authenticated;
