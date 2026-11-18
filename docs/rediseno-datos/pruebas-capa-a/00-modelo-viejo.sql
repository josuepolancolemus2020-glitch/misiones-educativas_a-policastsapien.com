-- ============================================================================
-- Capa A · modelo VIEJO mínimo de public, con datos de fábrica
-- ----------------------------------------------------------------------------
-- Copia MÍNIMA del modelo viejo (docentes, docente_estado, registro_admin,
-- mensajes_docente…) con las funciones que congelamos o que usan las
-- funciones de borde, para probar la convivencia. Corre igual en el Postgres
-- suelto (después de 00-plataforma-simulada.sql) y en `supabase start`.
-- Nada de esto se pega en el proyecto real.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- Modelo VIEJO mínimo (public) para las pruebas de convivencia
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.docentes (
  codigo     text primary key,
  clave_hash text not null,
  nombre     text,
  correo     text,
  rol        text not null default 'docente'
);
create table if not exists public.docente_intentos (
  correo text primary key,
  fallos int not null default 0,
  ultimo timestamptz not null default now()
);
alter table public.docente_intentos enable row level security;

-- Copias fieles de la entrada y del cambio de contraseña de hoy
-- (_privado/SUPABASE-ROLES.sql:54 y _privado/SUPABASE-DOCENTES-V2.sql:308):
-- las usan las funciones de borde metas-entrar y metas-salir-todos.
create or replace function public.metas_entrar_docente_v2(p_correo text, p_clave text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_clave  text := trim(coalesce(p_clave,''));
  v_fallos int; v_ultimo timestamptz; d record; v_ok boolean := false;
begin
  if v_correo = '' or v_clave = '' then return jsonb_build_object('ok', false, 'motivo', 'datos'); end if;
  delete from public.docente_intentos where ultimo < now() - interval '1 day';
  select i.fallos, i.ultimo into v_fallos, v_ultimo from public.docente_intentos i where i.correo = v_correo;
  if coalesce(v_fallos, 0) >= 5 and v_ultimo > now() - interval '10 minutes' then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;
  select * into d from public.docentes t where lower(t.correo) = v_correo and t.correo is not null and t.correo <> '' limit 1;
  if found then
    v_ok := (d.clave_hash = encode(extensions.digest(v_clave, 'sha256'), 'hex'))
         or (d.clave_hash = 'v2:' || encode(extensions.digest(v_clave || d.codigo, 'sha256'), 'hex'));
  end if;
  if v_ok then
    delete from public.docente_intentos where correo = v_correo;
    return jsonb_build_object('ok', true, 'codigo', d.codigo, 'nombre', d.nombre, 'correo', d.correo,
                              'rol', coalesce(d.rol, 'docente'));
  end if;
  insert into public.docente_intentos as di (correo, fallos, ultimo) values (v_correo, 1, now())
  on conflict (correo) do update set
    fallos = case when di.ultimo < now() - interval '10 minutes' then 1 else di.fallos + 1 end, ultimo = now();
  return jsonb_build_object('ok', false, 'motivo', 'datos');
end $$;
revoke all on function public.metas_entrar_docente_v2(text, text) from public;
grant execute on function public.metas_entrar_docente_v2(text, text) to anon, authenticated;

create or replace function public.metas_cambiar_clave_docente(p_codigo text, p_actual text, p_nueva text)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_cod text := upper(trim(coalesce(p_codigo,'')));
  v_nueva text := trim(coalesce(p_nueva,''));
  v_actual text := trim(coalesce(p_actual,''));
begin
  if length(v_nueva) < 6 then return false; end if;
  update public.docentes d
     set clave_hash = 'v2:' || encode(extensions.digest(v_nueva || d.codigo, 'sha256'), 'hex')
   where d.codigo = v_cod
     and ( d.clave_hash = encode(extensions.digest(v_actual, 'sha256'), 'hex')
        or d.clave_hash = 'v2:' || encode(extensions.digest(v_actual || d.codigo, 'sha256'), 'hex') );
  return found;
end $$;
revoke all on function public.metas_cambiar_clave_docente(text, text, text) from public;
grant execute on function public.metas_cambiar_clave_docente(text, text, text) to anon, authenticated;
create or replace function public._metas_docente_ok(p_codigo text, p_clave text)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.docentes d
                  where d.codigo = upper(trim(coalesce(p_codigo, '')))
                    and d.clave_hash = 'v2:' || encode(extensions.digest(trim(coalesce(p_clave, '')) || d.codigo, 'sha256'), 'hex'))
$$;
-- Como en _privado/SUPABASE-DOCENTES-V2.sql:301 (si no, sería un oráculo de contraseñas).
revoke all on function public._metas_docente_ok(text, text) from public, anon, authenticated;

create table if not exists public.docente_estado (
  codigo text not null, k text not null, valor jsonb, version bigint not null default 0,
  dispositivo text, actualizado_en timestamptz not null default now(),
  primary key (codigo, k)
);
alter table public.docente_estado enable row level security;

-- Copia simplificada de la función vieja: valida contraseña y escribe lo más nuevo.
create or replace function public.metas_docente_estado_guardar(
  p_codigo text, p_clave text, p_entradas jsonb, p_forzar boolean default false
) returns integer language plpgsql security definer set search_path = public as $$
declare e jsonb; n int := 0; filas int;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then return -1; end if;
  for e in select * from jsonb_array_elements(p_entradas) loop
    insert into public.docente_estado as d (codigo, k, valor, version, dispositivo)
    values (upper(p_codigo), e ->> 'k', e -> 'valor', (e ->> 'version')::bigint, e ->> 'dispositivo')
    on conflict (codigo, k) do update set valor = excluded.valor, version = excluded.version,
      dispositivo = excluded.dispositivo, actualizado_en = now()
      where p_forzar or excluded.version > d.version;
    get diagnostics filas = row_count; n := n + filas;
  end loop;
  return n;
end $$;
grant execute on function public.metas_docente_estado_guardar(text, text, jsonb, boolean) to anon, authenticated;

create or replace function public.metas_docente_estado_leer(p_codigo text, p_clave text)
returns setof public.docente_estado language sql security definer set search_path = public as $$
  select * from public.docente_estado where codigo = upper(p_codigo) and public._metas_docente_ok(p_codigo, p_clave)
$$;
grant execute on function public.metas_docente_estado_leer(text, text) to anon, authenticated;

-- «Restaurar» viejo: vuelve a escribir una versión guardada (aquí, la que se le pase).
create or replace function public.metas_docente_reset_deshacer(p_codigo text, p_clave text, p_k text, p_raw text)
returns integer language plpgsql security definer set search_path = public as $$
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then return -1; end if;
  insert into public.docente_estado (codigo, k, valor, version) values (upper(p_codigo), p_k, jsonb_build_object('raw', p_raw), 1)
  on conflict (codigo, k) do update set valor = excluded.valor, version = public.docente_estado.version + 1;
  return 1;
end $$;
grant execute on function public.metas_docente_reset_deshacer(text, text, text, text) to anon, authenticated;

-- Funciones viejas que el paso 1 cierra (cuerpos de relleno: lo que se prueba es el permiso).
create or replace function public.metas_guardar_admin(filas jsonb) returns integer language sql as $$ select 0 $$;
create or replace function public.metas_guardar_admin(p_prof text, p_clave text, filas jsonb) returns integer language sql as $$ select 0 $$;
create or replace function public.metas_recuperar_admin_docente(p_prof text, p_clave text) returns jsonb language sql as $$ select '[]'::jsonb $$;
create or replace function public.metas_docente_historial(p_codigo text, p_clave text, p_k text, p_limite int) returns jsonb language sql as $$ select '[]'::jsonb $$;
create or replace function public.metas_docente_historial_listar(p_codigo text, p_clave text) returns jsonb language sql as $$ select '[]'::jsonb $$;
create or replace function public.metas_docente_papelera(p_codigo text, p_clave text) returns jsonb language sql as $$ select '[]'::jsonb $$;
create or replace function public.metas_docente_reset(p_codigo text, p_clave text) returns integer language sql as $$ select 0 $$;
create or replace function public.metas_consultar_progreso(p_clave text) returns jsonb language sql as $$ select '[]'::jsonb $$;
create or replace function public.metas_restaurar_codigos(p jsonb) returns integer language sql as $$ select 0 $$;
-- Funciones viejas que deben SEGUIR abiertas.
create or replace function public.metas_guardar(filas jsonb) returns integer language sql as $$ select 1 $$;
create or replace function public.metas_guardar_progreso(filas jsonb) returns integer language sql as $$ select 1 $$;
create or replace function public.metas_buzon_docente(p_codigos jsonb) returns jsonb language sql as $$ select '[]'::jsonb $$;
grant execute on function public.metas_guardar_admin(jsonb), public.metas_guardar_admin(text, text, jsonb),
  public.metas_recuperar_admin_docente(text, text), public.metas_docente_historial(text, text, text, int),
  public.metas_docente_historial_listar(text, text), public.metas_docente_papelera(text, text),
  public.metas_docente_reset(text, text), public.metas_consultar_progreso(text), public.metas_restaurar_codigos(jsonb),
  public.metas_guardar(jsonb), public.metas_guardar_progreso(jsonb),
  public.metas_buzon_docente(jsonb)
  to anon, authenticated;

-- registro_admin + su historial (el disparador archiva lo que se borra).
-- Columnas como en _privado/SUPABASE-REGISTROS-ADMIN.sql.
create table if not exists public.registro_admin (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
  codigo text not null,
  tipo text not null check (tipo in ('asistencia', 'nota_final', 'economia')),
  fecha date, estado text, parcial text, materia text, nota numeric,
  concepto text, monto numeric, grado text, seccion text, docente text,
  actualizado_en timestamptz not null default now()
);
create table if not exists public.registro_admin_historial (
  id bigint generated always as identity primary key, evento_id text, codigo text,
  fila jsonb, archivado_en timestamptz not null default now()
);
create or replace function public._metas_archivar_registro_admin() returns trigger language plpgsql as $$
begin
  insert into public.registro_admin_historial (evento_id, codigo, fila) values (old.evento_id, old.codigo, to_jsonb(old));
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
create trigger trg_registro_admin_historial before update or delete on public.registro_admin
  for each row execute function public._metas_archivar_registro_admin();

-- Columnas como en _privado/SUPABASE-AVISOS.sql.
create table if not exists public.mensajes_docente (
  id bigint generated always as identity primary key,
  evento_id text not null unique,
  codigo text not null,
  subtipo text not null check (subtipo in ('aviso','evento','material','individual','cuentas','faq','conducta')),
  prioridad text, titulo text, texto text, pregunta text, claves text,
  fecha_evento date, vigente_hasta date not null default current_date + 30,
  grado text, seccion text, docente text, anio_lectivo text,
  actualizado_en timestamptz not null default now()
);
-- Columnas que lee metas_consultar_plan_padre (firma de
-- _privado/SUPABASE-PLAN-FECHA-DEDUP.sql, la que usa padres.html).
-- En la nube la tabla ya existe; aquí hace falta para envolver esa lectura.
create table if not exists public.plan_accion (
  id bigint generated always as identity primary key,
  evento_id text unique,
  codigo text,
  num text,
  alumno text,
  grado text,
  seccion text,
  docente text,
  evaluacion text,
  mision text,
  forma text,
  tipo text,
  parcial text,
  nota numeric,
  base numeric default 100,
  nsp boolean not null default false,
  categoria text,
  mensaje text,
  fecha_analisis timestamptz,
  fecha_prueba date,
  creado_en timestamptz not null default now()
);
create table if not exists public.mensajes_padre (id bigint generated always as identity primary key, codigo text);
create table if not exists public.aviso_visto (base text, codigo text, primary key (base, codigo));
-- Como en el proyecto real: RLS activa y SIN políticas en todo el modelo viejo
-- (todo pasa por funciones). Con el GRANT ALL de fábrica, es la RLS la que
-- impide que anon escriba directo.
alter table public.docentes enable row level security;
alter table public.registro_admin enable row level security;
alter table public.registro_admin_historial enable row level security;
alter table public.mensajes_docente enable row level security;
alter table public.plan_accion enable row level security;
alter table public.mensajes_padre enable row level security;
alter table public.aviso_visto enable row level security;

-- Freno por IP del chatbot (_privado/SUPABASE-FASE3.sql): aquí siempre deja pasar.
create or replace function public.metas_rate_ok() returns boolean language sql as $$ select true $$;

-- Copia fiel de metas_guardar_avisos (_privado/SUPABASE-SEGURIDAD.sql:139):
-- valida PROF + contraseña y traga el error de cada fila (por eso un
-- disparador que rechaza una fila NO llega a la app vieja como rechazo).
create or replace function public.metas_guardar_avisos(p_prof text, p_clave text, filas jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare n integer := 0; f jsonb;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  if jsonb_typeof(filas) <> 'array' or jsonb_array_length(filas) > 300 then return 0; end if;
  for f in select * from jsonb_array_elements(filas) loop
    begin
      if coalesce(f->>'evento_id','') = '' or coalesce(f->>'codigo','') = ''
         or coalesce(f->>'subtipo','') = '' or coalesce(f->>'vigente_hasta','') = '' then
        continue;
      end if;
      insert into public.mensajes_docente
        (evento_id, codigo, subtipo, prioridad, titulo, texto, pregunta,
         claves, fecha_evento, vigente_hasta, grado, seccion, docente, anio_lectivo)
      values (f->>'evento_id', upper(regexp_replace(coalesce(f->>'codigo',''), '\s', '', 'g')),
        f->>'subtipo', f->>'prioridad', left(coalesce(f->>'titulo',''), 120), left(coalesce(f->>'texto',''), 1200),
        left(coalesce(f->>'pregunta',''), 200), left(coalesce(f->>'claves',''), 200),
        nullif(f->>'fecha_evento','')::date, (f->>'vigente_hasta')::date,
        f->>'grado', f->>'seccion', f->>'docente', f->>'anio_lectivo')
      on conflict (evento_id) do update set
        codigo = excluded.codigo, subtipo = excluded.subtipo, prioridad = excluded.prioridad,
        titulo = excluded.titulo, texto = excluded.texto, pregunta = excluded.pregunta,
        claves = excluded.claves, fecha_evento = excluded.fecha_evento,
        vigente_hasta = excluded.vigente_hasta, grado = excluded.grado, seccion = excluded.seccion,
        docente = excluded.docente, anio_lectivo = excluded.anio_lectivo, actualizado_en = now();
      n := n + 1;
    exception when others then
      null;
    end;
  end loop;
  return n;
end $$;
revoke all on function public.metas_guardar_avisos(text, text, jsonb) from public;
grant execute on function public.metas_guardar_avisos(text, text, jsonb) to anon, authenticated;

-- Copias fieles de las lecturas del chatbot (_privado/SUPABASE-FASE3.sql:183 y :209).
create or replace function public.metas_consultar_admin_padre(p_codigo text)
returns table (tipo text, fecha date, estado text, parcial text, materia text, nota numeric,
               concepto text, monto numeric, grado text, seccion text, docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public as $$
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
end $$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

create or replace function public.metas_consultar_avisos_padre(p_codigo text)
returns table (evento_id text, subtipo text, prioridad text, titulo text, texto text,
               pregunta text, claves text, fecha_evento date, vigente_hasta date,
               docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if not public.metas_rate_ok() then return; end if;
  return query
  select m.evento_id, m.subtipo, m.prioridad, m.titulo, m.texto, m.pregunta, m.claves,
         m.fecha_evento, m.vigente_hasta, m.docente, m.actualizado_en
    from public.mensajes_docente m
   where length(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g')) >= 2
     and m.codigo = upper(regexp_replace(coalesce(p_codigo,''), '\s', '', 'g'))
     and m.vigente_hasta >= current_date
   order by (m.prioridad = 'urgente') desc, m.fecha_evento asc nulls last, m.actualizado_en desc
   limit 100;
end $$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

-- Copia fiel de metas_consultar_plan_padre (_privado/SUPABASE-PLAN-FECHA-DEDUP.sql).
-- En la nube ya está (padres.html lee parcial y fecha_prueba). Aquí no se
-- había creado: el archivo de claves viejas la envuelve y hay que probarla.
create or replace function public.metas_consultar_plan_padre(p_codigo text)
returns table (
  evaluacion text, forma text, tipo text, parcial text, fecha_prueba date,
  nota numeric, base numeric, nsp boolean,
  categoria text, mensaje text,
  docente text, grado text, seccion text, fecha timestamptz
)
language plpgsql security definer set search_path = public as $$
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
      and not (coalesce(p.parcial,'') = '' and exists (
            select 1 from public.plan_accion p2
            where p2.codigo = p.codigo
              and coalesce(nullif(p2.mision,''), p2.evaluacion)
                  = coalesce(nullif(p.mision,''), p.evaluacion)
              and coalesce(p2.tipo,'') = coalesce(p.tipo,'')
              and coalesce(p2.parcial,'') <> ''))
    order by coalesce(nullif(p.mision,''), p.evaluacion),
             coalesce(p.tipo,''), coalesce(p.parcial,''),
             coalesce(p.fecha_analisis, p.creado_en) desc, p.id desc
  ) q
  order by q.fecha desc
  limit 40;
end $$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;

-- Copia fiel de la lógica de metas_cerrar_familias (_privado/SUPABASE-SEGURIDAD.sql).
create or replace function public.metas_cerrar_familias(p_prof text, p_clave text, p_codigos jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare cods text[]; total integer := 0; k integer;
begin
  if not public._metas_docente_ok(p_prof, p_clave) then return -1; end if;
  select array_agg(distinct upper(regexp_replace(v, '\s', '', 'g'))) into cods
    from jsonb_array_elements_text(p_codigos) v where length(regexp_replace(v, '\s', '', 'g')) >= 2;
  if cods is null then return 0; end if;
  delete from public.plan_accion where codigo = any(cods);      get diagnostics k = row_count; total := total + k;
  delete from public.registro_admin where codigo = any(cods);   get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_docente where codigo = any(cods); get diagnostics k = row_count; total := total + k;
  delete from public.mensajes_padre where codigo = any(cods);   get diagnostics k = row_count; total := total + k;
  delete from public.aviso_visto where codigo = any(cods);      get diagnostics k = row_count; total := total + k;
  return total;
end $$;
grant execute on function public.metas_cerrar_familias(text, text, jsonb) to anon, authenticated;
