-- ============================================================
-- M.E.T.A.S — Supabase: FASE 3 del chatbot de padres
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- (un solo archivo: se puede correr las veces que haga falta)
--
-- Qué hace:
--   1) AÑO LECTIVO: columna anio_lectivo en registro_admin y
--      metas_guardar_admin la acepta — las notas de 2027 ya no
--      pisan las de 2026.
--   2) CANDADO DE VELOCIDAD (rate limit): máximo 300 consultas por
--      hora por dirección IP en TODAS las RPC del padre — frena a
--      quien intente adivinar claves con un programa, sin estorbar
--      a una escuela entera detrás de un mismo IP.
--   3) BUZÓN padre→maestro: metas_mensaje_padre (máx. 300 letras,
--      5 mensajes al día por familia) y metas_buzon_docente (el
--      maestro lee con las claves de su grupo desde Comunicados).
--   4) VISTO: metas_aviso_visto (el bot marca qué avisos mostró a
--      cada familia) y metas_avisos_vistos (el maestro ve «visto
--      por N familias» por aviso).
--   NOTA: metas_consultar_avisos_padre ahora devuelve también
--   evento_id (lo necesita el visto).
-- ============================================================

-- ── 1) AÑO LECTIVO ──────────────────────────────────────────
alter table public.registro_admin add column if not exists anio_lectivo text;

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
         concepto, monto, grado, seccion, docente, anio_lectivo)
      values (
        f->>'evento_id',
        upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'tipo',
        nullif(f->>'fecha','')::date,
        f->>'estado', f->>'parcial', f->>'materia',
        nullif(f->>'nota','')::numeric,
        f->>'concepto',
        nullif(f->>'monto','')::numeric,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo'
      )
      on conflict (evento_id) do update set
        codigo = excluded.codigo,
        fecha = excluded.fecha, estado = excluded.estado,
        parcial = excluded.parcial, materia = excluded.materia,
        nota = excluded.nota, concepto = excluded.concepto,
        monto = excluded.monto,
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
revoke all on function public.metas_guardar_admin(jsonb) from public;
grant execute on function public.metas_guardar_admin(jsonb) to anon, authenticated;

-- Cerrar el año: borra DE VERDAD lo de las claves entregadas (registros,
-- avisos, plan, buzón y vistos). Lo llama «Mi aula» con las claves viejas
-- del grupo justo antes de regenerarlas. Quien tenga una clave solo puede
-- borrar lo de esa familia, y el teléfono del maestro (fuente de la
-- verdad) lo re-publica todo si hiciera falta.
create or replace function public.metas_cerrar_familias(p_codigos jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  cods text[];
  total integer := 0;
  k integer;
begin
  if jsonb_typeof(p_codigos) <> 'array' or jsonb_array_length(p_codigos) > 100 then
    return 0;
  end if;
  select array_agg(distinct upper(regexp_replace(v, '\s', '', 'g')))
    into cods
  from jsonb_array_elements_text(p_codigos) v
  where length(regexp_replace(v, '\s', '', 'g')) >= 2;
  if cods is null or array_length(cods, 1) = 0 then return 0; end if;

  delete from public.plan_accion where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.registro_admin where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_docente where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_padre where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  delete from public.aviso_visto where codigo = any(cods);
  get diagnostics k = row_count; total := total + k;
  return total;
end
$$;
revoke all on function public.metas_cerrar_familias(jsonb) from public;
grant execute on function public.metas_cerrar_familias(jsonb) to anon, authenticated;

-- ── 2) CANDADO DE VELOCIDAD ─────────────────────────────────
create table if not exists public.metas_intentos (
  ip text not null,
  ventana timestamptz not null,
  n integer not null default 1,
  primary key (ip, ventana)
);
alter table public.metas_intentos enable row level security;

create or replace function public.metas_rate_ok()
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_ip text := 'desconocida';
  v_ventana timestamptz := date_trunc('hour', now());
  v_n integer;
begin
  begin
    v_ip := coalesce(nullif(trim(split_part(
      current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1)), ''), 'desconocida');
  exception when others then
    v_ip := 'desconocida';
  end;
  insert into public.metas_intentos as t (ip, ventana, n) values (v_ip, v_ventana, 1)
  on conflict (ip, ventana) do update set n = t.n + 1
  returning t.n into v_n;
  if v_n = 1 then   -- limpieza barata: una vez por IP y por hora
    delete from public.metas_intentos where ventana < now() - interval '3 hours';
  end if;
  return v_n <= 300;
end
$$;
revoke all on function public.metas_rate_ok() from public;
-- (solo la usan las demás funciones; no se expone a anon)

-- Las tres consultas del padre pasan por el candado.
-- Se recrean (drop) porque cambian de lenguaje/columnas.

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
  select p.evaluacion, p.forma, p.tipo, p.parcial, p.fecha_prueba, p.nota, p.base, p.nsp,
         p.categoria, p.mensaje, p.docente, p.grado, p.seccion,
         coalesce(p.fecha_analisis, p.creado_en) as fecha
  from public.plan_accion p
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and p.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
  order by coalesce(p.fecha_analisis, p.creado_en) desc
  limit 40;
end
$$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;

drop function if exists public.metas_consultar_admin_padre(text);
create function public.metas_consultar_admin_padre(p_codigo text)
returns table (
  tipo text, fecha date, estado text,
  parcial text, materia text, nota numeric,
  concepto text, monto numeric,
  grado text, seccion text, docente text, actualizado_en timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.metas_rate_ok() then return; end if;
  return query
  select r.tipo, r.fecha, r.estado, r.parcial, r.materia, r.nota, r.concepto, r.monto,
         r.grado, r.seccion, r.docente, r.actualizado_en
  from public.registro_admin r
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and r.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
  order by r.actualizado_en desc
  limit 400;
end
$$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

-- Ahora devuelve evento_id (para poder marcar el «visto»)
drop function if exists public.metas_consultar_avisos_padre(text);
create function public.metas_consultar_avisos_padre(p_codigo text)
returns table (
  evento_id text, subtipo text, prioridad text, titulo text, texto text,
  pregunta text, claves text, fecha_evento date, vigente_hasta date,
  docente text, actualizado_en timestamptz
)
language plpgsql security definer set search_path = public
as $$
begin
  if not public.metas_rate_ok() then return; end if;
  return query
  select m.evento_id, m.subtipo, m.prioridad, m.titulo, m.texto, m.pregunta, m.claves,
         m.fecha_evento, m.vigente_hasta, m.docente, m.actualizado_en
  from public.mensajes_docente m
  where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
    and m.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
    and m.vigente_hasta >= current_date
  order by (m.prioridad = 'urgente') desc,
           m.fecha_evento asc nulls last,
           m.actualizado_en desc
  limit 100;
end
$$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

-- ── 3) BUZÓN padre → maestro ────────────────────────────────
create table if not exists public.mensajes_padre (
  id bigint generated always as identity primary key,
  codigo text not null,
  texto text not null,
  creado_en timestamptz not null default now()
);
alter table public.mensajes_padre enable row level security;
-- sin políticas anónimas: todo pasa por las funciones

create or replace function public.metas_mensaje_padre(p_codigo text, p_texto text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_cod text := upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'));
  v_txt text := trim(coalesce(p_texto,''));
  v_hoy integer;
begin
  if not public.metas_rate_ok() then return 'tope'; end if;
  if length(v_cod) < 2 or length(v_txt) < 3 then return 'error'; end if;
  select count(*) into v_hoy from public.mensajes_padre
   where codigo = v_cod and creado_en > now() - interval '24 hours';
  if v_hoy >= 5 then return 'tope'; end if;   -- 5 mensajes al día por familia
  insert into public.mensajes_padre (codigo, texto) values (v_cod, left(v_txt, 300));
  return 'ok';
end
$$;
revoke all on function public.metas_mensaje_padre(text, text) from public;
grant execute on function public.metas_mensaje_padre(text, text) to anon, authenticated;

-- El maestro lee la bandeja con las claves de familia de SU grupo
create or replace function public.metas_buzon_docente(p_codigos jsonb)
returns table (codigo text, texto text, creado_en timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if jsonb_typeof(p_codigos) <> 'array' or jsonb_array_length(p_codigos) > 100 then
    return;
  end if;
  return query
  select m.codigo, m.texto, m.creado_en
  from public.mensajes_padre m
  where m.codigo in (
    select upper(regexp_replace(v, '\s', '', 'g'))
    from jsonb_array_elements_text(p_codigos) v)
    and m.creado_en > now() - interval '60 days'
  order by m.creado_en desc
  limit 200;
end
$$;
revoke all on function public.metas_buzon_docente(jsonb) from public;
grant execute on function public.metas_buzon_docente(jsonb) to anon, authenticated;

-- ── 4) VISTO por familia ────────────────────────────────────
create table if not exists public.aviso_visto (
  base text not null,       -- evento_id sin la clave (AVI-<id>)
  codigo text not null,
  visto_en timestamptz not null default now(),
  primary key (base, codigo)
);
alter table public.aviso_visto enable row level security;

-- El bot marca (fire-and-forget) los avisos que mostró a la familia.
-- Solo cuenta si el evento_id realmente pertenece a esa clave.
create or replace function public.metas_aviso_visto(p_codigo text, p_evento_id text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_cod text := upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'));
  v_base text;
begin
  if not public.metas_rate_ok() then return; end if;
  if length(v_cod) < 2 or coalesce(p_evento_id,'') = '' then return; end if;
  if not exists (select 1 from public.mensajes_docente d
                 where d.evento_id = p_evento_id and d.codigo = v_cod) then
    return;
  end if;
  v_base := regexp_replace(p_evento_id, '-' || v_cod || '$', '');
  insert into public.aviso_visto (base, codigo) values (v_base, v_cod)
  on conflict (base, codigo) do nothing;
end
$$;
revoke all on function public.metas_aviso_visto(text, text) from public;
grant execute on function public.metas_aviso_visto(text, text) to anon, authenticated;

-- El maestro consulta cuántas familias vieron cada aviso
create or replace function public.metas_avisos_vistos(p_bases jsonb)
returns table (base text, n bigint)
language plpgsql security definer set search_path = public
as $$
begin
  if jsonb_typeof(p_bases) <> 'array' or jsonb_array_length(p_bases) > 60 then
    return;
  end if;
  return query
  select v.base, count(distinct v.codigo)
  from public.aviso_visto v
  where v.base in (select value from jsonb_array_elements_text(p_bases) value)
  group by v.base;
end
$$;
revoke all on function public.metas_avisos_vistos(jsonb) from public;
grant execute on function public.metas_avisos_vistos(jsonb) to anon, authenticated;
