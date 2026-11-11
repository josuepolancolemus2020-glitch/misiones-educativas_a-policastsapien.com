-- ============================================================
-- M.E.T.A.S — Supabase: AVISOS DEL MAESTRO (la ventana del aula)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ SOLO PARA INSTALACIONES DESDE CERO. Si ya corriste este archivo
-- y después SUPABASE-FASE3.sql, NO lo vuelvas a correr: FASE3
-- redefinió metas_consultar_avisos_padre (evento_id para el «visto»
-- + candado de velocidad) y este archivo la pisaría con la versión
-- vieja. El subtipo 'conducta' se agrega con SUPABASE-CONDUCTA.sql.
--
-- Qué hace:
--   1) Tabla mensajes_docente: avisos, eventos con fecha, listas de
--      materiales y la FICHA DEL AULA (preguntas frecuentes: horario,
--      uniforme, útiles, matrícula…), por CLAVE DE FAMILIA (la misma
--      15-K7QM del Plan de Acción). Tabla SEPARADA de registro_admin:
--      así los avisos no compiten con las faltas por el límite de filas.
--   2) metas_guardar_avisos(filas): la pestaña Comunicados de «Mi aula»
--      sube y ACTUALIZA (upsert por evento_id; corregir = reenviar).
--   3) metas_consultar_avisos_padre(codigo): el chatbot de padres
--      responde ¿cuándo es la reunión?, ¿qué lleva mañana?, ¿a qué
--      hora sale? — solo lo VIGENTE (vigente_hasta >= hoy).
--
-- Convenciones de las filas (las arma la app):
--   subtipo 'aviso'     : titulo + texto (+prioridad 'urgente'|'normal')
--   subtipo 'evento'    : titulo + texto + fecha_evento (reunión, acto…)
--   subtipo 'material'  : titulo + texto (qué traer)
--   subtipo 'individual': aviso solo para ciertas familias (mismo campo)
--   subtipo 'cuentas'   : rendición de una colecta (recaudado/gastos/saldo)
--   subtipo 'faq'       : pregunta + claves (palabras clave) + texto
--   Todos llevan vigente_hasta: al vencer, el bot deja de mostrarlos.
--   Anular un aviso = reenviarlo con vigente_hasta '2000-01-01'.
-- ============================================================

create table if not exists public.mensajes_docente (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
  codigo text not null,                 -- clave de familia (15K7QM)
  subtipo text not null check (subtipo in
    ('aviso','evento','material','individual','cuentas','faq','conducta')),
  prioridad text,                       -- 'urgente' | 'normal'
  titulo text,
  texto text,
  pregunta text,                        -- solo faq
  claves text,                          -- solo faq: palabras clave extra
  fecha_evento date,                    -- solo evento
  vigente_hasta date not null,
  grado text,
  seccion text,
  docente text,
  anio_lectivo text,
  actualizado_en timestamptz not null default now()
);
alter table public.mensajes_docente enable row level security;
-- sin políticas anónimas: todo pasa por las funciones

-- Guardado desde el teléfono del maestro (clave pública)
create or replace function public.metas_guardar_avisos(filas jsonb)
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
         or coalesce(f->>'subtipo','') = '' or coalesce(f->>'vigente_hasta','') = '' then
        continue;
      end if;
      insert into public.mensajes_docente
        (evento_id, codigo, subtipo, prioridad, titulo, texto, pregunta,
         claves, fecha_evento, vigente_hasta, grado, seccion, docente, anio_lectivo)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'subtipo',
        f->>'prioridad',
        left(coalesce(f->>'titulo',''), 120),
        left(coalesce(f->>'texto',''), 1200),
        left(coalesce(f->>'pregunta',''), 200),
        left(coalesce(f->>'claves',''), 200),
        nullif(f->>'fecha_evento','')::date,
        (f->>'vigente_hasta')::date,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        subtipo = excluded.subtipo, prioridad = excluded.prioridad,
        titulo = excluded.titulo, texto = excluded.texto,
        pregunta = excluded.pregunta, claves = excluded.claves,
        fecha_evento = excluded.fecha_evento,
        vigente_hasta = excluded.vigente_hasta,
        grado = excluded.grado, seccion = excluded.seccion,
        docente = excluded.docente, anio_lectivo = excluded.anio_lectivo,
        actualizado_en = now();
      n := n + 1;
    exception when others then
      null; -- una fila mala no tumba el lote
    end;
  end loop;
  return n;
end
$$;
revoke all on function public.metas_guardar_avisos(jsonb) from public;
grant execute on function public.metas_guardar_avisos(jsonb) to anon, authenticated;

-- Consulta del padre/chatbot por clave de familia: solo lo vigente,
-- urgente primero, luego lo que tiene fecha más próxima
create or replace function public.metas_consultar_avisos_padre(p_codigo text)
returns table (
  subtipo text, prioridad text, titulo text, texto text,
  pregunta text, claves text, fecha_evento date, vigente_hasta date,
  docente text, actualizado_en timestamptz
)
language sql security definer stable set search_path = public
as $$
  select subtipo, prioridad, titulo, texto, pregunta, claves,
         fecha_evento, vigente_hasta, docente, actualizado_en
  from public.mensajes_docente
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
    and vigente_hasta >= current_date
  order by (prioridad = 'urgente') desc,
           fecha_evento asc nulls last,
           actualizado_en desc
  limit 100
$$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

-- Maestros con cuenta (panel-docente) leen según su alcance
drop policy if exists avisos_maestros_leen on public.mensajes_docente;
create policy avisos_maestros_leen on public.mensajes_docente
  for select to authenticated
  using (
    exists (
      select 1 from public.maestros m
      where m.id = auth.uid()
        and (m.docente is null or public.mensajes_docente.docente ilike '%' || m.docente || '%')
    )
  );
