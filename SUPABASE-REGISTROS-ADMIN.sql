-- ============================================================
-- M.E.T.A.S — Supabase: REGISTROS ADMINISTRATIVOS en la nube
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- Qué hace:
--   1) Tabla registro_admin: asistencia (solo excepciones), notas
--      finales por parcial y estado de colaboraciones, por CLAVE DE
--      FAMILIA (la misma 15-K7QM del Plan de Acción).
--   2) metas_guardar_admin(filas): el teléfono del maestro sube y
--      ACTUALIZA (upsert por evento_id; corregir = reenviar).
--   3) metas_consultar_admin_padre(codigo): el chatbot de padres
--      responde ¿faltó?, ¿qué sacó en el parcial?, ¿debo colaboración?
--   4) Los maestros con cuenta (panel-docente) leen según su alcance.
--
-- Convenciones de las filas (las arma la app):
--   tipo 'asistencia': fecha + estado 'ausente'|'excusa'
--                      (estado 'presente' = corrección de un error)
--   tipo 'nota_final': parcial I-IV + materia + nota (null = borrada)
--   tipo 'economia'  : concepto + monto + estado 'pago'|'pendiente'
--                      (estado 'eliminada' = colecta borrada)
-- ============================================================

create table if not exists public.registro_admin (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
  codigo text not null,                 -- clave de familia (15K7QM)
  tipo text not null check (tipo in ('asistencia','nota_final','economia')),
  fecha date,
  estado text,
  parcial text,
  materia text,
  nota numeric,
  concepto text,
  monto numeric,
  grado text,
  seccion text,
  docente text,
  actualizado_en timestamptz not null default now()
);
alter table public.registro_admin enable row level security;
-- sin políticas anónimas: todo pasa por las funciones

-- Guardado desde el teléfono del maestro (clave pública)
create or replace function public.metas_guardar_admin(filas jsonb)
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
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = ''
         or coalesce(f->>'tipo','') = '' then
        continue;
      end if;
      insert into public.registro_admin
        (evento_id, codigo, tipo, fecha, estado, parcial, materia, nota,
         concepto, monto, grado, seccion, docente)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'tipo',
        nullif(f->>'fecha','')::date,
        f->>'estado', f->>'parcial', f->>'materia',
        nullif(f->>'nota','')::numeric,
        f->>'concepto',
        nullif(f->>'monto','')::numeric,
        f->>'grado', f->>'seccion', f->>'docente'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        fecha = excluded.fecha, estado = excluded.estado,
        parcial = excluded.parcial, materia = excluded.materia,
        nota = excluded.nota, concepto = excluded.concepto,
        monto = excluded.monto,
        grado = excluded.grado, seccion = excluded.seccion,
        docente = excluded.docente,
        actualizado_en = now();
      n := n + 1;
    exception when others then
      null; -- una fila mala no tumba el lote
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_admin(jsonb) from public;
grant execute on function public.metas_guardar_admin(jsonb) to anon, authenticated;

-- Consulta del padre/chatbot por clave de familia
-- (14 jul 2026: limit 150 → 400 para que las faltas de fin de año no
--  se trunquen; si ya lo habías corrido, vuelve a correr este archivo)
create or replace function public.metas_consultar_admin_padre(p_codigo text)
returns table (
  tipo text, fecha date, estado text,
  parcial text, materia text, nota numeric,
  concepto text, monto numeric,
  grado text, seccion text, docente text, actualizado_en timestamptz
)
language sql security definer stable set search_path = public
as $$
  select tipo, fecha, estado, parcial, materia, nota, concepto, monto,
         grado, seccion, docente, actualizado_en
  from public.registro_admin
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
  order by actualizado_en desc
  limit 400
$$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

-- Maestros con cuenta (panel-docente) leen según su alcance
drop policy if exists admin_maestros_leen on public.registro_admin;
create policy admin_maestros_leen on public.registro_admin
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and (m.docente is null or public.registro_admin.docente ilike '%' || m.docente || '%')
    )
  );
