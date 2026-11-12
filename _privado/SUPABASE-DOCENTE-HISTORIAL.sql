-- ============================================================
-- M.E.T.A.S — Supabase: HISTORIAL DEL ESTADO DEL MAESTRO
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ Requiere haber corrido antes SUPABASE-DOCENTES.sql y
--    SUPABASE-DOCENTE-ESTADO.sql (usa public.docente_estado y
--    public._metas_docente_ok). Se puede correr más de una vez.
--
-- Por qué existe (noviembre de 2026): un maestro perdió el pago de un
-- alumno, un gasto de L 1,090 y el IV parcial entero por choques entre
-- su teléfono y su tablet. La nube guardaba UNA sola copia por clave:
-- cuando un equipo subía una copia vieja, la buena dejaba de existir.
--
-- Qué hace: cada vez que el aula de la nube CAMBIA, guarda la copia de
-- antes en public.docente_estado_hist. «🔎 Buscar datos perdidos» (Mi
-- aula) la lee para encontrar lo que faltó. Solo lectura para la app:
-- nada se restaura solo.
--
-- Cuánto guarda, para no llenar la base:
--   · a lo más una copia cada 10 minutos por clave (una sesión de notas
--     sube decenas de veces; con una cada 10 min basta para encontrar
--     lo que existió más de 10 minutos);
--   · las de las últimas 72 horas, hasta 150;
--   · de ahí para atrás, una por día, hasta 30 días.
-- ============================================================

create table if not exists public.docente_estado_hist (
  id bigserial primary key,
  codigo text not null,
  k text not null,
  valor jsonb,
  version bigint,
  dispositivo text,
  guardado_en timestamptz not null default now()
);
create index if not exists docente_estado_hist_ck
  on public.docente_estado_hist (codigo, k, guardado_en desc);
alter table public.docente_estado_hist enable row level security;
-- sin políticas anónimas: solo se lee con la función de abajo (valida la clave)

create or replace function public._metas_docente_hist_guardar()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  begin
    if tg_op = 'UPDATE' and old.valor is not distinct from new.valor then
      return new;
    end if;
    -- a lo más una copia cada 10 minutos por clave
    if not exists (
      select 1 from public.docente_estado_hist h
      where h.codigo = old.codigo and h.k = old.k
        and h.guardado_en > now() - interval '10 minutes'
    ) then
      insert into public.docente_estado_hist (codigo, k, valor, version, dispositivo)
      values (old.codigo, old.k, old.valor, old.version, old.dispositivo);
    end if;
    -- más de 30 días: fuera
    delete from public.docente_estado_hist h
      where h.codigo = old.codigo and h.k = old.k and h.guardado_en < now() - interval '30 days';
    -- antes de 72 horas: una por día (la última de cada día)
    delete from public.docente_estado_hist h
      where h.codigo = old.codigo and h.k = old.k and h.guardado_en < now() - interval '72 hours'
        and exists (
          select 1 from public.docente_estado_hist h2
          where h2.codigo = h.codigo and h2.k = h.k
            and date_trunc('day', h2.guardado_en) = date_trunc('day', h.guardado_en)
            and h2.guardado_en > h.guardado_en);
    -- últimas 72 horas: hasta 150
    delete from public.docente_estado_hist h
      where h.id in (
        select id from public.docente_estado_hist
        where codigo = old.codigo and k = old.k and guardado_en >= now() - interval '72 hours'
        order by guardado_en desc offset 150);
  exception when others then
    null;   -- el historial nunca puede impedir que el maestro guarde
  end;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$$;

drop trigger if exists docente_estado_hist_trg on public.docente_estado;
create trigger docente_estado_hist_trg
  before update or delete on public.docente_estado
  for each row execute function public._metas_docente_hist_guardar();

-- ── Leer el historial de una clave (la más nueva primero) ──
create or replace function public.metas_docente_historial(
  p_codigo text, p_clave text, p_k text, p_limite integer default 15
) returns table (valor jsonb, version bigint, dispositivo text, guardado_en timestamptz)
language plpgsql security definer stable set search_path = public
as $$
declare
  cod text := upper(trim(coalesce(p_codigo,'')));
begin
  if not public._metas_docente_ok(cod, p_clave) then
    return;                                     -- clave incorrecta → vacío
  end if;
  return query
    select h.valor, h.version, h.dispositivo, h.guardado_en
    from public.docente_estado_hist h
    where h.codigo = cod and h.k = p_k
    order by h.guardado_en desc
    limit least(greatest(coalesce(p_limite, 15), 1), 40);
end
$$;
revoke all on function public.metas_docente_historial(text,text,text,integer) from public;
grant execute on function public.metas_docente_historial(text,text,text,integer) to anon, authenticated;

-- ── Comprobar ──
-- 1) Debe salir el disparador:
--    select tgname from pg_trigger where tgname = 'docente_estado_hist_trg';
-- 2) Después de guardar algo en Mi aula (espera unos segundos), debe
--    haber al menos una fila:
--    select codigo, k, guardado_en from public.docente_estado_hist order by guardado_en desc limit 5;
