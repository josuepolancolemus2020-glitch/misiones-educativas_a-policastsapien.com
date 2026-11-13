-- ============================================================
-- M.E.T.A.S — Supabase: «Buscar datos perdidos» mira el MES entero
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- (sin nada sombreado con el ratón). Se puede correr más de una vez.
--
-- ⚠️ Requiere SUPABASE-DOCENTE-HISTORIAL.sql (la tabla
--    public.docente_estado_hist y su disparador).
--
-- Por qué (13 de noviembre de 2026): el pago de una alumna en la colecta
-- de pupitres desapareció y «🔎 Buscar datos perdidos» no lo encontraba.
-- La nube SÍ tenía la copia: guarda hasta una cada 10 minutos de las
-- últimas 72 horas y una por día hasta 30 días. Pero la función devolvía
-- solo las 15 MÁS NUEVAS, que en un día de trabajo son las de las
-- últimas horas: lo de hace dos semanas nunca llegaba al teléfono.
--
-- Qué hace: devuelve las 12 copias más nuevas MÁS la última de cada día
-- de los últimos 30 días (hasta 50). Solo LEE: no cambia ni borra nada
-- del aula. La app (v511) la pide con límite 50.
-- ============================================================

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
    with todas as (
      select h.valor, h.version, h.dispositivo, h.guardado_en,
             row_number() over (order by h.guardado_en desc, h.id desc) as rn,
             row_number() over (partition by date_trunc('day', h.guardado_en)
                                order by h.guardado_en desc, h.id desc) as rdia
      from public.docente_estado_hist h
      where h.codigo = cod and h.k = p_k
    )
    select t.valor, t.version, t.dispositivo, t.guardado_en
    from todas t
    where t.rn <= 12 or t.rdia = 1
    order by t.guardado_en desc
    limit least(greatest(coalesce(p_limite, 15), 1), 50);
end
$$;
revoke all on function public.metas_docente_historial(text,text,text,integer) from public;
grant execute on function public.metas_docente_historial(text,text,text,integer) to anon, authenticated;

-- ── Comprobar ──
-- Cuántas copias tiene la nube de cada maestro y desde cuándo:
--   select codigo, count(*) copias, min(guardado_en) desde, max(guardado_en) hasta
--   from public.docente_estado_hist where k = 'METAS_ADMIN_V1'
--   group by codigo order by hasta desc;
