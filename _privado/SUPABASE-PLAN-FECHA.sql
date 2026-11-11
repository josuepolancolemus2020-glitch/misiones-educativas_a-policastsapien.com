-- ============================================================
-- M.E.T.A.S — Supabase: agregar la FECHA DE LA PRUEBA al Plan de Acción
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Qué hace:
--   1) Columna nueva `fecha_prueba` (la fecha que el alumno escribió
--      en su evaluación impresa; distinta de fecha_analisis, que es
--      cuando el maestro generó el análisis).
--   2) metas_guardar_plan la guarda y la actualiza.
--   3) metas_consultar_plan_padre la devuelve (el padre y el chatbot
--      ven cuándo se realizó cada prueba).
-- Las filas viejas quedan con fecha_prueba vacía — nada se pierde.
-- ============================================================

alter table public.plan_accion add column if not exists fecha_prueba date;

create or replace function public.metas_guardar_plan(filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
begin
  if jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 300 then
    return 0;
  end if;
  for f in select * from jsonb_array_elements(filas) loop
    begin
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = '' then
        continue;
      end if;
      insert into public.plan_accion
        (evento_id, codigo, num, alumno, grado, seccion, docente,
         evaluacion, mision, forma, tipo, parcial, fecha_prueba,
         nota, base, nsp, categoria, mensaje, fecha_analisis)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'num', f->>'alumno', f->>'grado', f->>'seccion', f->>'docente',
        f->>'evaluacion', f->>'mision', f->>'forma', f->>'tipo', f->>'parcial',
        nullif(f->>'fecha_prueba','')::date,
        nullif(f->>'nota','')::numeric,
        coalesce(nullif(f->>'base','')::numeric, 100),
        coalesce((f->>'nsp')::boolean, false),
        f->>'categoria', f->>'mensaje',
        nullif(f->>'fecha_analisis','')::timestamptz
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        alumno = excluded.alumno,
        grado = excluded.grado, seccion = excluded.seccion, docente = excluded.docente,
        evaluacion = excluded.evaluacion, mision = excluded.mision,
        forma = excluded.forma, tipo = excluded.tipo, parcial = excluded.parcial,
        fecha_prueba = excluded.fecha_prueba,
        nota = excluded.nota, base = excluded.base, nsp = excluded.nsp,
        categoria = excluded.categoria, mensaje = excluded.mensaje,
        fecha_analisis = excluded.fecha_analisis;
      n := n + 1;
    exception when others then
      null; -- una fila mala no tumba el lote
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_plan(jsonb) from public;
grant execute on function public.metas_guardar_plan(jsonb) to anon, authenticated;

-- El tipo de retorno cambia (columna nueva) → se recrea la función
drop function if exists public.metas_consultar_plan_padre(text);
create function public.metas_consultar_plan_padre(p_codigo text)
returns table (
  evaluacion text, forma text, tipo text, parcial text, fecha_prueba date,
  nota numeric, base numeric, nsp boolean,
  categoria text, mensaje text,
  docente text, grado text, seccion text, fecha timestamptz
)
language sql security definer stable set search_path = public
as $$
  select evaluacion, forma, tipo, parcial, fecha_prueba, nota, base, nsp, categoria, mensaje,
         docente, grado, seccion, coalesce(fecha_analisis, creado_en) as fecha
  from public.plan_accion
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
  order by coalesce(fecha_analisis, creado_en) desc
  limit 40
$$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;
