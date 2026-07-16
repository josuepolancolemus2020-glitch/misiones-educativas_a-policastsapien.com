-- ============================================================
-- M.E.T.A.S — Supabase: FECHA DE LA PRUEBA restaurada + SIN duplicados
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Por qué:
--   * El blindaje de seguridad (SUPABASE-SEGURIDAD.sql, 14 jul) recreó
--     metas_guardar_plan SIN las columnas `parcial` y `fecha_prueba`:
--     desde entonces cada subida pierde la fecha en que se hizo la
--     prueba (por eso el asistente de padres no la muestra).
--   * Si el maestro corrige un análisis (lo rehace, o cambia el nº de
--     lista de un alumno), la nube guarda una fila NUEVA además de la
--     vieja y el asistente mostraba la misma evaluación dos veces.
--
-- Qué hace:
--   1) Se asegura de que existan las columnas `parcial` y `fecha_prueba`.
--   2) metas_guardar_plan (exige cuenta docente, igual que el blindaje)
--      vuelve a guardarlas y actualizarlas.
--   3) metas_consultar_plan_padre devuelve SOLO la versión más reciente
--      de cada evaluación (evaluación + tipo + parcial): las correcciones
--      del maestro REEMPLAZAN a la fila vieja, nunca la duplican.
--
-- Requiere haber corrido antes SUPABASE-SEGURIDAD.sql (las funciones
-- _metas_docente_ok y metas_rate_ok ya viven en la nube).
-- Las filas viejas no se tocan — nada se pierde.
-- ============================================================

alter table public.plan_accion add column if not exists parcial text;
alter table public.plan_accion add column if not exists fecha_prueba date;

-- ────────────────────────────────────────────────────────────
-- Guardado desde el teléfono del maestro (cuenta docente
-- obligatoria) — ahora CON parcial y fecha_prueba.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_guardar_plan(jsonb);  -- firma vieja, por si quedó
create or replace function public.metas_guardar_plan(p_prof text, p_clave text, filas jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer := 0;
  f jsonb;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
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
revoke all on function public.metas_guardar_plan(text,text,jsonb) from public;
grant execute on function public.metas_guardar_plan(text,text,jsonb) to anon, authenticated;

-- ────────────────────────────────────────────────────────────
-- Consulta del padre: SIN duplicados.
-- De cada evaluación (misma evaluación + tipo + parcial) se devuelve
-- solo la fila más reciente (por fecha de análisis; a igual fecha, la
-- última que llegó). Así una corrección del maestro reemplaza a la
-- versión anterior en vez de aparecer dos veces.
-- ────────────────────────────────────────────────────────────
drop function if exists public.metas_consultar_plan_padre(text);
create function public.metas_consultar_plan_padre(p_codigo text)
returns table (
  evaluacion text, forma text, tipo text, parcial text, fecha_prueba date,
  nota numeric, base numeric, nsp boolean,
  categoria text, mensaje text,
  docente text, grado text, seccion text, fecha timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.metas_rate_ok() then return; end if;
  return query
  select q.evaluacion, q.forma, q.tipo, q.parcial, q.fecha_prueba, q.nota, q.base, q.nsp,
         q.categoria, q.mensaje, q.docente, q.grado, q.seccion, q.fecha
  from (
    select distinct on (coalesce(nullif(p.mision,''), p.evaluacion),
                        coalesce(p.tipo,''), coalesce(p.parcial,''))
           p.evaluacion, p.forma, p.tipo, p.parcial, p.fecha_prueba, p.nota, p.base, p.nsp,
           p.categoria, p.mensaje, p.docente, p.grado, p.seccion,
           coalesce(p.fecha_analisis, p.creado_en) as fecha
    from public.plan_accion p
    where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
      and p.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
    order by coalesce(nullif(p.mision,''), p.evaluacion),
             coalesce(p.tipo,''), coalesce(p.parcial,''),
             coalesce(p.fecha_analisis, p.creado_en) desc, p.id desc
  ) q
  order by q.fecha desc
  limit 40;
end
$$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;

-- ============================================================
-- PRUEBAS (después de Run) — con curl o en el mismo SQL Editor:
--
--   select public.metas_guardar_plan('PROF-NADA','malo','[]'::jsonb);
--     → espera -1 (cuenta docente sigue siendo obligatoria)
--
--   select * from public.metas_consultar_plan_padre('15K7QM');
--     → (con una clave real) cada evaluación aparece UNA sola vez
--       y trae fecha_prueba cuando el maestro la registró.
--
-- En la app: Plan de Acción → al abrir, el teléfono del maestro
-- re-publica solo (la firma ahora incluye parcial y fecha) y el
-- asistente de padres muestra «📅 Prueba: 26/05/2026».
-- ============================================================
