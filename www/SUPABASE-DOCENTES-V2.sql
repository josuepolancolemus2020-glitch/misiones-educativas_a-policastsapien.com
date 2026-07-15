-- ============================================================
-- M.E.T.A.S — DOCENTES V2: cuenta con correo + contraseña
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- Qué cambia con V2:
--   • El maestro se registra con su NOMBRE COMPLETO, CORREO y una
--     CONTRASEÑA que él elige (mínimo 6). Entra con correo + contraseña.
--   • El código PROF-XXXXXXXXXX sigue existiendo por dentro (es la
--     llave técnica del espejo multi-dispositivo y demás tablas), pero
--     ahora lo genera EL SERVIDOR y nunca se muestra en la pantalla.
--   • El alumno escribe el NOMBRE del maestro en el campo «Docente» de
--     las misiones. La nube empareja por nombre NORMALIZADO (mayúsculas,
--     sin acentos, solo letras y números) con la función metas_norm.
--   • El nombre normalizado es ÚNICO entre maestros: si ya existe, el
--     registro se rechaza y la app pide agregar el segundo apellido.
--
-- Por qué esto ESCALA a miles de maestros a la vez:
--   • ESCRITURAS: cada maestro escribe solo SUS filas (partición natural
--     por su código interno). Miles escribiendo a la vez tocan filas
--     distintas: sin fila caliente global ni bloqueos entre ellos.
--   • LECTURAS: cada consulta «Mis alumnos en la nube» usa índices
--     TRIGRAMA (pg_trgm) sobre el nombre normalizado del docente, y el
--     chatbot de padres usa índices btree por clave de familia. Nada
--     escanea la tabla completa.
--   • El freno anti fuerza bruta del login es UNA fila por correo
--     (upsert): miles de logins simultáneos de correos distintos no
--     compiten entre sí.
--
-- Compatibilidad: _metas_docente_ok acepta las contraseñas viejas y las
-- nuevas, así que docente_estado_guardar/leer y el espejo multi-equipo
-- siguen igual. OJO: el emparejamiento pasa de código a NOMBRE, así que
-- las filas históricas donde el alumno escribió un código PROF-XXXX en
-- el campo «Docente» dejan de aparecer en «Mis alumnos en la nube»
-- (en este despliegue son solo datos de prueba, ya limpiados).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1) LIMPIEZA: cuenta de prueba del autor (pedida explícitamente).
--    PROF-4GM8 fue la cuenta usada para probar durante el desarrollo.
--    (Con guard: si alguna tabla no existe aún, no aborta el script.)
-- ────────────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.docente_estado') is not null then
    delete from public.docente_estado where codigo = 'PROF-4GM8';
  end if;
  if to_regclass('public.docentes') is not null then
    delete from public.docentes where codigo = 'PROF-4GM8';
  end if;
end $$;


-- ────────────────────────────────────────────────────────────
-- 2) Extensiones necesarias
-- ────────────────────────────────────────────────────────────
create extension if not exists pg_trgm;                          -- índices para LIKE '%…%'
create extension if not exists pgcrypto with schema extensions;  -- sha256 y bytes aleatorios


-- ────────────────────────────────────────────────────────────
-- 3) metas_norm: LA única normalización de nombres.
--    Se usa IDÉNTICA en los índices y en las consultas, para que el
--    planificador de Postgres pueda usar los índices.
--    «José Ángel Pérez-Núñez» → 'JOSEANGELPEREZNUNEZ'
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_norm(t text)
returns text
language sql immutable
as $$
  select regexp_replace(
           upper(translate(coalesce(t,''), 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNAEIOUUN')),
           '[^A-Z0-9]', '', 'g')
$$;


-- ────────────────────────────────────────────────────────────
-- 4) Columnas nuevas en docentes (DEFENSIVO: la base viva puede
--    tenerlas ya; «if not exists» no daña nada) + índices ÚNICOS.
-- ────────────────────────────────────────────────────────────
alter table public.docentes add column if not exists correo text;
alter table public.docentes add column if not exists escuela text;
alter table public.docentes add column if not exists tipo text;
alter table public.docentes add column if not exists telefono text;
alter table public.docentes add column if not exists departamento text;
alter table public.docentes add column if not exists municipio text;
alter table public.docentes add column if not exists lugar text;

-- Correo único y nombre normalizado único. Si la tabla ya trae
-- duplicados viejos, el índice no se puede crear: avisamos con NOTICE
-- y el resto del script sigue corriendo (las funciones de alta hacen
-- su propio chequeo, así que el sistema funciona igual).
do $$
begin
  begin
    create unique index if not exists docentes_correo_unico
      on public.docentes (lower(correo))
      where correo is not null and correo <> '';
  exception when unique_violation then
    raise notice 'AVISO: hay correos duplicados en public.docentes y no se pudo crear docentes_correo_unico. Encuéntralos con:  select lower(correo), count(*) from public.docentes where coalesce(correo,'''')<>'''' group by 1 having count(*)>1;  Borra o corrige los repetidos y vuelve a correr este script.';
  end;
  begin
    create unique index if not exists docentes_nombre_unico
      on public.docentes (public.metas_norm(nombre))
      where nombre is not null and nombre <> '';
  exception when unique_violation then
    raise notice 'AVISO: hay nombres duplicados en public.docentes y no se pudo crear docentes_nombre_unico. Encuéntralos con:  select public.metas_norm(nombre), count(*) from public.docentes where coalesce(nombre,'''')<>'''' group by 1 having count(*)>1;  Corrige los repetidos (agrega segundo apellido) y vuelve a correr este script.';
  end;
end $$;


-- ────────────────────────────────────────────────────────────
-- 5) ALTA V2: el servidor valida, genera el código interno y guarda
--    la contraseña con sal ('v2:' + sha256(contraseña + codigo)).
--    Respuestas: {"ok":true,"codigo":"PROF-…"} o
--    {"ok":false,"motivo":"nombre_corto|correo_malo|clave_corta|correo|nombre|reintentar"}
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_docente_alta_v2(
  p_nombre text, p_correo text, p_clave text,
  p_escuela text default '', p_tipo text default '', p_telefono text default '',
  p_departamento text default '', p_municipio text default '', p_lugar text default ''
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_nombre text := trim(coalesce(p_nombre,''));
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_clave  text := trim(coalesce(p_clave,''));
  v_alfa   text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- sin I,L,O,0,1 (se confunden)
  v_cod    text;
  v_bytes  bytea;
  v_i      integer;
  v_intento integer;
  v_constraint text;
begin
  -- Validaciones (mismos motivos que espera la app)
  if coalesce(array_length(regexp_split_to_array(v_nombre, '\s+'), 1), 0) < 2
     or length(public.metas_norm(v_nombre)) < 8 then
    return jsonb_build_object('ok', false, 'motivo', 'nombre_corto');
  end if;
  if position('@' in v_correo) = 0 then
    return jsonb_build_object('ok', false, 'motivo', 'correo_malo');
  end if;
  if length(v_clave) < 6 then
    return jsonb_build_object('ok', false, 'motivo', 'clave_corta');
  end if;

  -- Chequeo amable antes de insertar (la carrera exacta la cubre la
  -- captura de unique_violation de abajo). Las condiciones «is not null
  -- and <> ''» repiten el predicado de los índices únicos PARCIALES
  -- para que el planificador pueda usarlos (sin ellas haría seq scan).
  if exists (select 1 from public.docentes d
             where lower(d.correo) = v_correo
               and d.correo is not null and d.correo <> '') then
    return jsonb_build_object('ok', false, 'motivo', 'correo');
  end if;
  if exists (select 1 from public.docentes d
             where public.metas_norm(d.nombre) = public.metas_norm(v_nombre)
               and d.nombre is not null and d.nombre <> '') then
    return jsonb_build_object('ok', false, 'motivo', 'nombre');
  end if;

  -- Código interno generado EN EL SERVIDOR (nunca se muestra en la UI)
  for v_intento in 1..5 loop
    v_bytes := extensions.gen_random_bytes(10);
    v_cod := 'PROF-';
    for v_i in 0..9 loop
      v_cod := v_cod || substr(v_alfa, 1 + (get_byte(v_bytes, v_i) % length(v_alfa)), 1);
    end loop;
    begin
      insert into public.docentes
        (codigo, clave_hash, nombre, correo, escuela, tipo, telefono,
         departamento, municipio, lugar)
      values (
        v_cod,
        'v2:' || encode(extensions.digest(v_clave || v_cod, 'sha256'), 'hex'),
        left(v_nombre, 80),
        left(v_correo, 120),
        left(coalesce(p_escuela,''), 120),
        left(coalesce(p_tipo,''), 40),
        left(coalesce(p_telefono,''), 40),
        left(coalesce(p_departamento,''), 60),
        left(coalesce(p_municipio,''), 60),
        left(coalesce(p_lugar,''), 120)
      );
      return jsonb_build_object('ok', true, 'codigo', v_cod);
    exception when unique_violation then
      get stacked diagnostics v_constraint = CONSTRAINT_NAME;
      if v_constraint = 'docentes_correo_unico' or SQLERRM like '%correo%' then
        return jsonb_build_object('ok', false, 'motivo', 'correo');
      elsif v_constraint = 'docentes_nombre_unico' or SQLERRM like '%nombre%' then
        return jsonb_build_object('ok', false, 'motivo', 'nombre');
      end if;
      -- si chocó el código (llave primaria), el bucle genera otro
    end;
  end loop;
  return jsonb_build_object('ok', false, 'motivo', 'reintentar');
end
$$;
revoke all on function public.metas_docente_alta_v2(text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.metas_docente_alta_v2(text,text,text,text,text,text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 6) ENTRAR V2: correo + contraseña, con freno anti fuerza bruta.
--    ESCALA: el freno es UNA fila por correo (upsert). Miles de logins
--    simultáneos de correos distintos tocan filas distintas y no
--    compiten entre sí; solo el atacante que martilla UN correo choca
--    con su propia fila.
-- ────────────────────────────────────────────────────────────
create table if not exists public.docente_intentos (
  correo text primary key,
  fallos int not null default 0,
  ultimo timestamptz not null default now()
);
alter table public.docente_intentos enable row level security;
-- sin políticas: nadie la lee ni escribe directo, solo la función
-- índice para la limpieza oportunista por fecha (dentro del login)
create index if not exists idx_docente_intentos_ultimo on public.docente_intentos (ultimo);

create or replace function public.metas_entrar_docente_v2(p_correo text, p_clave text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_clave  text := trim(coalesce(p_clave,''));
  v_fallos int;
  v_ultimo timestamptz;
  d record;
  v_ok boolean := false;
begin
  if v_correo = '' or v_clave = '' then
    return jsonb_build_object('ok', false, 'motivo', 'datos');
  end if;

  -- Limpieza oportunista: las filas de intentos viejas (más de un día)
  -- se borran aquí mismo, para que un bot no pueda sembrar millones de
  -- filas basura llamando con correos inventados.
  delete from public.docente_intentos where ultimo < now() - interval '1 day';

  -- FRENO: 5 fallos → esperar 10 minutos
  select i.fallos, i.ultimo into v_fallos, v_ultimo
  from public.docente_intentos i where i.correo = v_correo;
  if coalesce(v_fallos, 0) >= 5 and v_ultimo > now() - interval '10 minutes' then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;

  -- (el «is not null and <> ''» repite el predicado del índice parcial
  --  docentes_correo_unico para que el login lo use y no escanee)
  select * into d from public.docentes t
  where lower(t.correo) = v_correo
    and t.correo is not null and t.correo <> ''
  limit 1;

  if found then
    -- acepta el formato viejo (sha256 sin sal) y el nuevo v2 (salado con el código)
    v_ok := (d.clave_hash = encode(extensions.digest(v_clave, 'sha256'), 'hex'))
         or (d.clave_hash = 'v2:' || encode(extensions.digest(v_clave || d.codigo, 'sha256'), 'hex'));
  end if;

  if v_ok then
    delete from public.docente_intentos where correo = v_correo;
    return jsonb_build_object('ok', true, 'codigo', d.codigo,
                              'nombre', d.nombre, 'correo', d.correo);
  end if;

  insert into public.docente_intentos as di (correo, fallos, ultimo)
  values (v_correo, 1, now())
  on conflict (correo) do update set
    fallos = case when di.ultimo < now() - interval '10 minutes'
                  then 1 else di.fallos + 1 end,  -- si la espera ya pasó, cuenta de nuevo
    ultimo = now();
  return jsonb_build_object('ok', false, 'motivo', 'datos');
end
$$;
revoke all on function public.metas_entrar_docente_v2(text,text) from public;
grant execute on function public.metas_entrar_docente_v2(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 7) _metas_docente_ok: ahora acepta AMBOS formatos de contraseña
--    (viejo sin sal y nuevo 'v2:' salado con el código). Con esto,
--    docente_estado_guardar/leer y todo lo existente sigue funcionando
--    SIN tocar esas funciones.
-- ────────────────────────────────────────────────────────────
create or replace function public._metas_docente_ok(p_codigo text, p_clave text)
returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.docentes d
    where d.codigo = upper(trim(coalesce(p_codigo,'')))
      and ( d.clave_hash = encode(extensions.digest(trim(coalesce(p_clave,'')), 'sha256'), 'hex')
         or d.clave_hash = 'v2:' || encode(extensions.digest(trim(coalesce(p_clave,'')) || d.codigo, 'sha256'), 'hex') )
  )
$$;
-- interna: SOLO la usan las funciones security definer. Se revoca a
-- todos para que nadie pueda probar contraseñas por fuerza bruta.
revoke all on function public._metas_docente_ok(text,text) from public, anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 8) Cambiar contraseña: verifica la actual en ambos formatos y guarda
--    la nueva SIEMPRE en formato v2 salado (mínimo 6 caracteres).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_cambiar_clave_docente(
  p_codigo text, p_actual text, p_nueva text
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_cod   text := upper(trim(coalesce(p_codigo,'')));
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
end
$$;
revoke all on function public.metas_cambiar_clave_docente(text,text,text) from public;
grant execute on function public.metas_cambiar_clave_docente(text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 9) «Mis alumnos en la nube»: ahora empareja POR NOMBRE.
--    El alumno escribe el nombre del maestro en el campo «Docente» de
--    la misión; aquí se compara con metas_norm (la MISMA expresión de
--    los índices del punto 10, carácter por carácter).
--    Guard 1: si el nombre normalizado tiene menos de 8 caracteres, se
--    exige igualdad exacta (un nombre muy corto con LIKE '%…%'
--    arrastraría alumnos de otros maestros).
--    Guard 2 (anti-fuga entre maestros): si existe OTRO maestro cuyo
--    nombre CONTIENE el mío («Carlos Mejía» ⊂ «Juan Carlos Mejía»),
--    las filas que nombran al maestro largo se EXCLUYEN de mi vista.
--    Los «rivales» se calculan UNA vez por consulta (casi siempre 0).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_consultar_docente(p_codigo text, p_clave text)
returns setof public.resultados
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;                                   -- clave incorrecta → vacío
  end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo = v_cod;
  v_n := public.metas_norm(v_nombre);
  if v_n = '' then return; end if;
  if length(v_n) >= 8 then
    -- otros maestros cuyo nombre normalizado contiene el mío
    v_rivales := array(
      select public.metas_norm(d.nombre) from public.docentes d
      where d.codigo <> v_cod
        and d.nombre is not null and d.nombre <> ''
        and public.metas_norm(d.nombre) like '%' || v_n || '%');
    return query
      select r.* from public.resultados r
      where public.metas_norm(r.docente) like '%' || v_n || '%'
        and not exists (select 1 from unnest(v_rivales) rv
                        where public.metas_norm(r.docente) like '%' || rv || '%')
      order by r.creado_en desc
      limit 2000;
  else
    return query
      select r.* from public.resultados r
      where public.metas_norm(r.docente) = v_n
      order by r.creado_en desc
      limit 2000;
  end if;
end
$$;
revoke all on function public.metas_consultar_docente(text,text) from public;
grant execute on function public.metas_consultar_docente(text,text) to anon, authenticated;

create or replace function public.metas_consultar_progreso_docente(p_codigo text, p_clave text)
returns setof public.progreso
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;
  end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo = v_cod;
  v_n := public.metas_norm(v_nombre);
  if v_n = '' then return; end if;
  if length(v_n) >= 8 then
    v_rivales := array(
      select public.metas_norm(d.nombre) from public.docentes d
      where d.codigo <> v_cod
        and d.nombre is not null and d.nombre <> ''
        and public.metas_norm(d.nombre) like '%' || v_n || '%');
    return query
      select p.* from public.progreso p
      where public.metas_norm(p.docente) like '%' || v_n || '%'
        and not exists (select 1 from unnest(v_rivales) rv
                        where public.metas_norm(p.docente) like '%' || rv || '%')
      order by p.actualizado_en desc
      limit 1000;
  else
    return query
      select p.* from public.progreso p
      where public.metas_norm(p.docente) = v_n
      order by p.actualizado_en desc
      limit 1000;
  end if;
end
$$;
revoke all on function public.metas_consultar_progreso_docente(text,text) from public;
grant execute on function public.metas_consultar_progreso_docente(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 10) ÍNDICES DE ESCALA (sustituyen a SUPABASE-ESCALA.sql, adaptados
--     al emparejamiento por nombre).
--     • resultados/progreso: índice TRIGRAMA sobre metas_norm(docente),
--       la MISMA expresión de las consultas del punto 9 → el LIKE
--       '%…%' usa el índice y no escanea la tabla.
--     • plan_accion/registro_admin: btree por codigo (chatbot de
--       padres) y trigrama por docente (políticas RLS del panel admin).
--     Si el operador gin_trgm_ops vive en el esquema «extensions»,
--     el bloque lo intenta automáticamente con ese prefijo.
-- ────────────────────────────────────────────────────────────
do $$
declare
  v record;
begin
  for v in
    select * from (values
      -- resultados/progreso: misma expresión que las consultas del punto 9
      ('idx_resultados_docente_norm_trgm', 'public.resultados',     'public.metas_norm(docente)'),
      ('idx_progreso_docente_norm_trgm',   'public.progreso',       'public.metas_norm(docente)'),
      -- plan_accion/registro_admin: columna CRUDA, porque las políticas
      -- RLS del panel admin filtran con  docente ilike '%…%'  directo
      -- (pg_trgm soporta ILIKE nativamente: guarda trigramas en minúscula)
      ('idx_plan_accion_docente_trgm',     'public.plan_accion',    'docente'),
      ('idx_registro_admin_docente_trgm',  'public.registro_admin', 'docente')
    ) as t(nombre, tabla, expresion)
  loop
    begin
      execute format('create index if not exists %I on %s using gin ((%s) gin_trgm_ops)',
                     v.nombre, v.tabla, v.expresion);
    exception when undefined_object then
      -- pg_trgm quedó en el esquema «extensions»: usar el prefijo
      execute format('create index if not exists %I on %s using gin ((%s) extensions.gin_trgm_ops)',
                     v.nombre, v.tabla, v.expresion);
    end;
  end loop;
end $$;

-- Índices de la versión anterior (emparejamiento por código) que ya no
-- usa ninguna consulta: se retiran si existieran.
drop index if exists public.idx_resultados_docente_trgm;
drop index if exists public.idx_progreso_docente_trgm;

-- Chatbot de padres: filtro por clave de familia (btree simple)
create index if not exists idx_plan_accion_codigo    on public.plan_accion    (codigo);
create index if not exists idx_registro_admin_codigo on public.registro_admin (codigo);

-- ── Verificación rápida (opcional): que la consulta use el índice ──
-- explain analyze
--   select 1 from public.resultados
--   where public.metas_norm(docente) like '%JOSEANGELPEREZ%';
-- Debe decir «Bitmap Index Scan on idx_resultados_docente_norm_trgm»,
-- NO «Seq Scan on resultados».
--
-- Nota: si algún CREATE INDEX manual fallara por gin_trgm_ops, cambia
-- «gin_trgm_ops» por «extensions.gin_trgm_ops» (el bloque DO de arriba
-- ya lo hace solo).
