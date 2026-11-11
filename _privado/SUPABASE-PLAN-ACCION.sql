-- ============================================================
-- M.E.T.A.S — Supabase: Plan de Acción en la nube
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Qué hace:
--   1) Tabla plan_accion: las notas que el maestro registra en el
--      Plan de Acción (evaluación exacta + Forma + código de lista).
--   2) metas_guardar_plan(filas): el teléfono del maestro sube y
--      ACTUALIZA (si corrige una nota, la nube se corrige) — con la
--      clave pública solo se puede escribir vía esta función.
--   3) metas_consultar_plan_padre(codigo): el padre escribe el
--      código de lista de su hijo (grado+sección+número, ej. 6A12)
--      y recibe SOLO las filas de ese código.
--   4) Los maestros con cuenta (panel-docente) pueden leer según
--      su alcance, igual que resultados/progreso.
-- ============================================================

create table if not exists public.plan_accion (
  id bigint generated always as identity primary key,
  evento_id text not null unique,          -- PASB-<analisis>-<num> (upsert al corregir)
  codigo text not null,                    -- 6A12 = grado + sección + nº de lista
  num text,
  alumno text,
  grado text,
  seccion text,
  docente text,
  evaluacion text,
  mision text,                             -- carpeta canónica de la misión (si aplica)
  forma text,
  tipo text,
  nota numeric,
  base numeric default 100,
  nsp boolean not null default false,
  categoria text,
  mensaje text,                            -- el mensaje del maestro para el padre
  fecha_analisis timestamptz,
  creado_en timestamptz not null default now()
);
alter table public.plan_accion enable row level security;
-- sin políticas de escritura/lectura anónima: todo pasa por las funciones

-- Guardado desde el teléfono del maestro (clave pública)
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
         evaluacion, mision, forma, tipo, nota, base, nsp,
         categoria, mensaje, fecha_analisis)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'num', f->>'alumno', f->>'grado', f->>'seccion', f->>'docente',
        f->>'evaluacion', f->>'mision', f->>'forma', f->>'tipo',
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
        forma = excluded.forma, tipo = excluded.tipo,
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

-- Consulta del padre por código de lista (devuelve SOLO ese código)
create or replace function public.metas_consultar_plan_padre(p_codigo text)
returns table (
  evaluacion text, forma text, tipo text,
  nota numeric, base numeric, nsp boolean,
  categoria text, mensaje text,
  docente text, grado text, seccion text, fecha timestamptz
)
language sql security definer stable set search_path = public
as $$
  select evaluacion, forma, tipo, nota, base, nsp, categoria, mensaje,
         docente, grado, seccion, coalesce(fecha_analisis, creado_en) as fecha
  from public.plan_accion
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
  order by coalesce(fecha_analisis, creado_en) desc
  limit 40
$$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;

-- Maestros con cuenta (panel-docente) leen según su alcance
drop policy if exists plan_maestros_leen on public.plan_accion;
create policy plan_maestros_leen on public.plan_accion
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and (m.docente is null or public.plan_accion.docente ilike '%' || m.docente || '%')
    )
  );
