-- ============================================================
-- M.E.T.A.S — ROLES V2: la Dirección ve la gestión del maestro
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- La estructura de roles queda así:
--   • docente     — administra SU grado: su aula, sus alumnos.
--   • director    — acompaña la gestión de los docentes de SU escuela:
--                   ve sus grupos y sus listas de alumnos, y con permiso
--                   concedido, los casos que el maestro le delegue
--                   (hoy: las convocatorias).
--   • asistencia  — NUEVO. Apoya a la Dirección con los MISMOS permisos
--                   que un director. Todo lo que aquí diga «director»
--                   vale igual para «asistencia».
--   • rector      — verifica lo que hacen todos: grupos, matrícula y
--                   último movimiento de TODAS las escuelas, sin nombres
--                   de alumnos y sin datos de contacto.
--   • admin       — igual que siempre; además ahora puede asignar el rol
--                   asistencia y corregir el nombre de escuela de una
--                   cuenta (para alinear una institución que arranca).
--
-- Lo que la Dirección NUNCA recibe por estas funciones, a propósito:
--   las claves de familia (METAS_CODIGOS_V1 y la columna codigo de
--   registro_admin), la identidad y los teléfonos de la ficha del
--   alumno (idn, tel, enc, encId, encTel), el candado del maestro,
--   los pagos de las familias y el PIN de las convocatorias. Los
--   alumnos viajan SOLO como número de lista + nombre + sexo, y los
--   de prueba (🧪) se quedan fuera, como en los informes.
--
-- El permiso de convocatorias funciona SIN entregar el PIN: el
-- servidor comprueba que el permiso esté concedido y devuelve él
-- mismo las respuestas. Por eso revocar el permiso revoca de verdad.
--
-- Requiere corridos antes (en este orden si el proyecto está nuevo):
--   1. SUPABASE-DOCENTES-V2.sql   (docentes, _metas_docente_ok, metas_norm)
--   2. SUPABASE-ROLES.sql         (columna rol, perfil, metas_rol_listar)
--   3. SUPABASE-DOCENTE-ESTADO.sql (docente_estado, el espejo del aula)
--   4. SUPABASE-CONVOCATORIA.sql  (convocatorias y sus respuestas)
--   5. SUPABASE-FASE3.sql         (metas_rate_ok; si falta, no frena)
--
-- ⚠️ La lista de permisos delegables vive DENTRO de las funciones
--    (_metas_permiso_valido). Si algún día se añade un permiso nuevo,
--    hay que volver a correr ESTE archivo entero, igual que pasa con
--    las clases del Buzón.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1) El rol nuevo: asistencia (mismos permisos que director)
-- ────────────────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'docentes_rol_valido') then
    alter table public.docentes drop constraint docentes_rol_valido;
  end if;
  alter table public.docentes add constraint docentes_rol_valido
    check (rol in ('docente','director','asistencia','rector','admin'));
end $$;

-- ¿Este rol es de Dirección? (director y asistencia son lo mismo aquí;
-- si algún día entra otro rol de dirección, se añade SOLO en esta lista)
create or replace function public._metas_es_direccion(p_rol text)
returns boolean language sql immutable
as $$ select coalesce(p_rol,'') in ('director','asistencia') $$;
revoke all on function public._metas_es_direccion(text) from public, anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 2) metas_rol_listar aprende el rol asistencia (misma vista que
--    el director: los docentes de su escuela, sin contacto).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_rol_listar(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  v_lista jsonb;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));

  if coalesce(yo.rol,'docente') = 'admin' then
    -- ADMIN: acceso completo — quién se registra, cuándo y todos sus datos
    select jsonb_agg(fila order by fila->>'creado' desc) into v_lista
    from (
      select jsonb_build_object(
        'nombre', d.nombre, 'correo', d.correo,
        'escuela', coalesce(d.escuela,''), 'tipo', coalesce(d.tipo,''),
        'telefono', coalesce(d.telefono,''), 'departamento', coalesce(d.departamento,''),
        'municipio', coalesce(d.municipio,''), 'lugar', coalesce(d.lugar,''),
        'rol', coalesce(d.rol,'docente'), 'creado', d.creado_en) as fila
      from public.docentes d
      order by d.creado_en desc
      limit 1000
    ) s;

  elsif yo.rol = 'rector' then
    -- RECTOR: todas las escuelas, SIN datos de contacto
    select jsonb_agg(fila order by fila->>'creado' desc) into v_lista
    from (
      select jsonb_build_object(
        'nombre', d.nombre, 'escuela', coalesce(d.escuela,''),
        'tipo', coalesce(d.tipo,''), 'departamento', coalesce(d.departamento,''),
        'municipio', coalesce(d.municipio,''),
        'rol', coalesce(d.rol,'docente'), 'creado', d.creado_en) as fila
      from public.docentes d
      order by d.creado_en desc
      limit 1000
    ) s;

  elsif public._metas_es_direccion(yo.rol) then
    -- DIRECCIÓN (director o asistencia): solo su misma escuela, sin contacto
    if length(public.metas_norm(coalesce(yo.escuela,''))) < 4 then
      return jsonb_build_object('ok', false, 'motivo', 'escuela');
    end if;
    select jsonb_agg(fila order by fila->>'creado' desc) into v_lista
    from (
      select jsonb_build_object(
        'nombre', d.nombre, 'escuela', coalesce(d.escuela,''),
        'municipio', coalesce(d.municipio,''),
        'rol', coalesce(d.rol,'docente'), 'creado', d.creado_en) as fila
      from public.docentes d
      where public.metas_norm(coalesce(d.escuela,'')) = public.metas_norm(yo.escuela)
      order by d.creado_en desc
      limit 500
    ) s;

  else
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;

  return jsonb_build_object('ok', true, 'rol', coalesce(yo.rol,'docente'),
                            'docentes', coalesce(v_lista, '[]'::jsonb));
end
$$;
revoke all on function public.metas_rol_listar(text,text) from public;
grant execute on function public.metas_rol_listar(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 3) metas_rol_cambiar acepta el rol asistencia (sigue siendo
--    SOLO el admin, nunca sobre sí mismo ni sobre otro admin).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_rol_cambiar(
  p_codigo text, p_clave text, p_correo text, p_rol text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_rol text := lower(trim(coalesce(p_rol,'')));
begin
  begin
    if not public.metas_rate_ok() then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
  exception when undefined_function then
    null;  -- si FASE3 no está corrido aún, la función no frena el resto
  end;

  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if coalesce(yo.rol,'docente') <> 'admin' then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;

  if v_rol not in ('docente','director','asistencia','rector') then
    return jsonb_build_object('ok', false, 'motivo', 'rol_malo');
  end if;
  if v_correo = lower(coalesce(yo.correo,'')) then
    return jsonb_build_object('ok', false, 'motivo', 'propio');
  end if;

  update public.docentes d set rol = v_rol
  where lower(d.correo) = v_correo
    and d.correo is not null and d.correo <> ''
    and coalesce(d.rol,'docente') <> 'admin';   -- a otro admin nadie lo toca
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  return jsonb_build_object('ok', true, 'rol', v_rol);
end
$$;
revoke all on function public.metas_rol_cambiar(text,text,text,text) from public;
grant execute on function public.metas_rol_cambiar(text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 4) CORREGIR LA ESCUELA de una cuenta — SOLO el admin.
--    La lista de un director se arma emparejando el nombre de escuela
--    del perfil; cuando una institución arranca (varios maestros
--    escribiendo «John A. Cook», «Esc. John Arnold Cook»…), alguien
--    tiene que poder alinear los nombres sin pedirle a cada maestro
--    que edite su perfil.
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_rol_escuela_corregir(
  p_codigo text, p_clave text, p_correo text, p_escuela text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_escuela text := left(trim(coalesce(p_escuela,'')), 120);
begin
  begin
    if not public.metas_rate_ok() then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
  exception when undefined_function then
    null;
  end;

  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if coalesce(yo.rol,'docente') <> 'admin' then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  if length(public.metas_norm(v_escuela)) < 4 then
    return jsonb_build_object('ok', false, 'motivo', 'escuela_corta');
  end if;

  update public.docentes d set escuela = v_escuela
  where lower(d.correo) = v_correo
    and d.correo is not null and d.correo <> '';
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  return jsonb_build_object('ok', true, 'escuela', v_escuela);
end
$$;
revoke all on function public.metas_rol_escuela_corregir(text,text,text,text) from public;
grant execute on function public.metas_rol_escuela_corregir(text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 5) PERMISOS DELEGABLES — la tabla y sus reglas.
--    El maestro es el dueño de su registro: la Dirección puede PEDIR
--    un permiso y el maestro concederlo, negarlo o revocarlo; o el
--    maestro darlo sin que nadie se lo pida. Una fila por
--    (maestro, cuenta de dirección, permiso): pedir dos veces o
--    conceder dos veces CORRIGE la fila, no la duplica.
-- ────────────────────────────────────────────────────────────
create table if not exists public.docente_permisos (
  id bigint generated always as identity primary key,
  docente_codigo   text not null,     -- PROF del maestro dueño de los datos
  direccion_codigo text not null,     -- PROF del director o asistencia
  permiso text not null,
  estado text not null default 'pedido'
    check (estado in ('pedido','concedido','denegado','revocado')),
  pedido_por text not null default 'direccion'
    check (pedido_por in ('docente','direccion')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (docente_codigo, direccion_codigo, permiso)
);
alter table public.docente_permisos enable row level security;
-- sin políticas: nadie la lee ni escribe directo, solo las funciones
create index if not exists idx_docente_permisos_direccion
  on public.docente_permisos (direccion_codigo);

-- La lista de permisos que existen HOY. Añadir uno nuevo = añadirlo
-- aquí y volver a correr este archivo entero.
create or replace function public._metas_permiso_valido(p_permiso text)
returns boolean language sql immutable
as $$ select coalesce(p_permiso,'') in ('convocatorias') $$;
revoke all on function public._metas_permiso_valido(text) from public, anon, authenticated;

-- ¿Tiene esta cuenta de dirección el permiso concedido por este maestro?
create or replace function public._metas_permiso_ok(
  p_docente_codigo text, p_direccion_codigo text, p_permiso text
) returns boolean language sql stable
as $$
  select exists (
    select 1 from public.docente_permisos pp
    where pp.docente_codigo = p_docente_codigo
      and pp.direccion_codigo = p_direccion_codigo
      and pp.permiso = p_permiso
      and pp.estado = 'concedido')
$$;
revoke all on function public._metas_permiso_ok(text,text,text) from public, anon, authenticated;

-- Buscar una cuenta por su NOMBRE (los no-admin no ven correos; el
-- nombre normalizado es único en docentes, así que alcanza y sobra).
create or replace function public._metas_docente_por_nombre(p_nombre text)
returns public.docentes language sql stable
as $$
  select t.* from public.docentes t
  where t.nombre is not null and t.nombre <> ''
    and public.metas_norm(t.nombre) = public.metas_norm(coalesce(p_nombre,''))
  limit 1
$$;
revoke all on function public._metas_docente_por_nombre(text) from public, anon, authenticated;

-- ¿Son de la misma escuela? (el mismo emparejamiento de metas_rol_listar)
create or replace function public._metas_misma_escuela(a text, b text)
returns boolean language sql immutable
as $$
  select length(public.metas_norm(coalesce(a,''))) >= 4
     and public.metas_norm(coalesce(a,'')) = public.metas_norm(coalesce(b,''))
$$;
revoke all on function public._metas_misma_escuela(text,text) from public, anon, authenticated;


-- ── 5a) La Dirección PIDE un permiso a un maestro de su escuela ──
create or replace function public.metas_permiso_pedir(
  p_codigo text, p_clave text, p_nombre_docente text, p_permiso text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  d public.docentes;
  v_permiso text := lower(trim(coalesce(p_permiso,'')));
begin
  begin
    if not public.metas_rate_ok() then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
  exception when undefined_function then
    null;
  end;

  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not public._metas_es_direccion(yo.rol) then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  if not public._metas_permiso_valido(v_permiso) then
    return jsonb_build_object('ok', false, 'motivo', 'permiso_malo');
  end if;

  d := public._metas_docente_por_nombre(p_nombre_docente);
  if d.codigo is null or d.codigo = yo.codigo then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  if not public._metas_misma_escuela(yo.escuela, d.escuela) then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;

  -- Pedir sobre un permiso YA concedido no lo degrada: se responde tal cual.
  insert into public.docente_permisos as pp
    (docente_codigo, direccion_codigo, permiso, estado, pedido_por)
  values (d.codigo, yo.codigo, v_permiso, 'pedido', 'direccion')
  on conflict (docente_codigo, direccion_codigo, permiso) do update set
    estado = case when pp.estado = 'concedido' then 'concedido' else 'pedido' end,
    pedido_por = 'direccion',
    actualizado_en = now();

  return jsonb_build_object('ok', true, 'estado', (
    select pp2.estado from public.docente_permisos pp2
    where pp2.docente_codigo = d.codigo and pp2.direccion_codigo = yo.codigo
      and pp2.permiso = v_permiso));
end
$$;
revoke all on function public.metas_permiso_pedir(text,text,text,text) from public;
grant execute on function public.metas_permiso_pedir(text,text,text,text) to anon, authenticated;


-- ── 5b) El MAESTRO da un permiso a una cuenta de Dirección de su
--        escuela, sin que nadie se lo pida ──
create or replace function public.metas_permiso_dar(
  p_codigo text, p_clave text, p_nombre_direccion text, p_permiso text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  dir public.docentes;
  v_permiso text := lower(trim(coalesce(p_permiso,'')));
begin
  begin
    if not public.metas_rate_ok() then
      return jsonb_build_object('ok', false, 'motivo', 'espera');
    end if;
  exception when undefined_function then
    null;
  end;

  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not public._metas_permiso_valido(v_permiso) then
    return jsonb_build_object('ok', false, 'motivo', 'permiso_malo');
  end if;

  dir := public._metas_docente_por_nombre(p_nombre_direccion);
  if dir.codigo is null or dir.codigo = yo.codigo then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  if not public._metas_es_direccion(dir.rol) then
    return jsonb_build_object('ok', false, 'motivo', 'no_direccion');
  end if;
  if not public._metas_misma_escuela(yo.escuela, dir.escuela) then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;

  insert into public.docente_permisos as pp
    (docente_codigo, direccion_codigo, permiso, estado, pedido_por)
  values (yo.codigo, dir.codigo, v_permiso, 'concedido', 'docente')
  on conflict (docente_codigo, direccion_codigo, permiso) do update set
    estado = 'concedido',
    pedido_por = 'docente',
    actualizado_en = now();

  return jsonb_build_object('ok', true, 'estado', 'concedido');
end
$$;
revoke all on function public.metas_permiso_dar(text,text,text,text) from public;
grant execute on function public.metas_permiso_dar(text,text,text,text) to anon, authenticated;


-- ── 5c) El MAESTRO responde: concede, niega o revoca. Solo el dueño
--        de la fila puede tocarla; la Dirección no se responde sola. ──
create or replace function public.metas_permiso_responder(
  p_codigo text, p_clave text, p_id bigint, p_estado text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  v_estado text := lower(trim(coalesce(p_estado,'')));
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));

  if v_estado not in ('concedido','denegado','revocado') then
    return jsonb_build_object('ok', false, 'motivo', 'estado_malo');
  end if;

  update public.docente_permisos pp
     set estado = v_estado, actualizado_en = now()
   where pp.id = p_id
     and pp.docente_codigo = yo.codigo;   -- SOLO el dueño de los datos
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  return jsonb_build_object('ok', true, 'estado', v_estado);
end
$$;
revoke all on function public.metas_permiso_responder(text,text,bigint,text) from public;
grant execute on function public.metas_permiso_responder(text,text,bigint,text) to anon, authenticated;


-- ── 5d) LISTAR permisos: cada quien ve su lado.
--        Al maestro: los permisos sobre SUS datos (quién pidió, qué
--        concedió) + las cuentas de Dirección de su escuela, para poder
--        dar un permiso sin esperar a que se lo pidan.
--        A la Dirección: sus pedidos y lo que le han concedido. ──
create or replace function public.metas_permisos_listar(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  v_mios jsonb;
  v_pedidos jsonb;
  v_direccion jsonb;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));

  -- permisos sobre MIS datos (yo como maestro)
  select jsonb_agg(fila order by (fila->>'id')::bigint desc) into v_mios
  from (
    select jsonb_build_object(
      'id', pp.id, 'permiso', pp.permiso, 'estado', pp.estado,
      'pedido_por', pp.pedido_por,
      'nombre', coalesce(dd.nombre,''), 'rol', coalesce(dd.rol,'docente'),
      'actualizado', pp.actualizado_en) as fila
    from public.docente_permisos pp
    left join public.docentes dd on dd.codigo = pp.direccion_codigo
    where pp.docente_codigo = yo.codigo
    limit 200
  ) s;

  -- mis pedidos y concesiones (yo como Dirección)
  if public._metas_es_direccion(yo.rol) then
    select jsonb_agg(fila order by (fila->>'id')::bigint desc) into v_pedidos
    from (
      select jsonb_build_object(
        'id', pp.id, 'permiso', pp.permiso, 'estado', pp.estado,
        'pedido_por', pp.pedido_por,
        'nombre', coalesce(dd.nombre,''),
        'actualizado', pp.actualizado_en) as fila
      from public.docente_permisos pp
      left join public.docentes dd on dd.codigo = pp.docente_codigo
      where pp.direccion_codigo = yo.codigo
      limit 200
    ) s;
  end if;

  -- las cuentas de Dirección de mi escuela (solo nombre y rol: sin
  -- contacto, que esa regla no se rompe ni aquí)
  if length(public.metas_norm(coalesce(yo.escuela,''))) >= 4 then
    select jsonb_agg(fila order by fila->>'nombre') into v_direccion
    from (
      select jsonb_build_object(
        'nombre', d.nombre, 'rol', coalesce(d.rol,'docente')) as fila
      from public.docentes d
      where public._metas_es_direccion(d.rol)
        and d.codigo <> yo.codigo
        and public.metas_norm(coalesce(d.escuela,'')) = public.metas_norm(yo.escuela)
      limit 50
    ) s;
  end if;

  return jsonb_build_object('ok', true, 'rol', coalesce(yo.rol,'docente'),
    'mios', coalesce(v_mios, '[]'::jsonb),
    'pedidos', coalesce(v_pedidos, '[]'::jsonb),
    'direccion', coalesce(v_direccion, '[]'::jsonb));
end
$$;
revoke all on function public.metas_permisos_listar(text,text) from public;
grant execute on function public.metas_permisos_listar(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 6) EL AULA DEL MAESTRO, ABIERTA CON LISTA BLANCA.
--    El aula completa ya vive en la nube (docente_estado, llave
--    METAS_ADMIN_V1): estas funciones la abren SOLO en lo que la
--    Dirección tiene por qué ver, construyendo cada objeto campo a
--    campo (lista blanca). Nada de devolver el espejo crudo: ahí
--    dentro van el PIN de las convocatorias, los teléfonos de los
--    encargados y las claves de familia.
-- ────────────────────────────────────────────────────────────

-- El espejo del aula de un docente, ya abierto como jsonb (o NULL)
create or replace function public._metas_aula_de(p_codigo text)
returns jsonb language plpgsql stable
as $$
declare
  v jsonb;
begin
  begin
    select (de.valor->>'raw')::jsonb into v
    from public.docente_estado de
    where de.codigo = p_codigo and de.k = 'METAS_ADMIN_V1';
  exception when others then
    return null;   -- un espejo ilegible no tumba la lista entera
  end;
  return v;
end
$$;
revoke all on function public._metas_aula_de(text) from public, anon, authenticated;

-- Los grupos de ese espejo, garantizados como ARREGLO: si el espejo de
-- UN maestro viene torcido (grupos que no es lista), ese maestro sale
-- sin grupos y los demás siguen saliendo — jsonb_array_elements sobre un
-- no-arreglo revienta la consulta entera, y eso sería un maestro raro
-- dejando ciega a toda la Dirección.
create or replace function public._metas_grupos_de(p_codigo text)
returns jsonb language plpgsql stable
as $$
declare
  v jsonb := public._metas_aula_de(p_codigo)->'grupos';
begin
  if v is null or jsonb_typeof(v) <> 'array' then return '[]'::jsonb; end if;
  return v;
end
$$;
revoke all on function public._metas_grupos_de(text) from public, anon, authenticated;

-- Un campo de un grupo garantizado como ARREGLO (lista, convocatorias…)
create or replace function public._metas_arreglo(v jsonb)
returns jsonb language sql immutable
as $$ select case when v is not null and jsonb_typeof(v) = 'array' then v else '[]'::jsonb end $$;
revoke all on function public._metas_arreglo(jsonb) from public, anon, authenticated;

-- ── 6a) LOS GRUPOS por docente — la vista de conjunto.
--    director/asistencia: los docentes de SU escuela, con el estado del
--    permiso de cada uno (para pintar el botón de pedir sin otra vuelta).
--    rector: TODAS las escuelas, solo conteos (verifica, no administra).
--    Devuelve por docente sus grupos con matrícula contada como en los
--    informes: alumnos reales, los 🧪 de prueba fuera. ──
create or replace function public.metas_rol_grupos(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  v_lista jsonb;
  v_es_dir boolean;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));

  v_es_dir := public._metas_es_direccion(yo.rol);
  if not v_es_dir and coalesce(yo.rol,'docente') not in ('rector','admin') then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  if v_es_dir and length(public.metas_norm(coalesce(yo.escuela,''))) < 4 then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;

  select jsonb_agg(fila order by fila->>'creado' desc) into v_lista
  from (
    select jsonb_build_object(
      'nombre', d.nombre,
      'escuela', coalesce(d.escuela,''),
      'municipio', coalesce(d.municipio,''),
      'rol', coalesce(d.rol,'docente'),
      'creado', d.creado_en,
      -- el último movimiento de su espejo: lo que el rector VERIFICA
      'movido', (select max(de.actualizado_en) from public.docente_estado de
                 where de.codigo = d.codigo),
      'grupos', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', g->>'id',
          'grado', coalesce(g->>'grado',''),
          'seccion', coalesce(g->>'seccion',''),
          'escuela', coalesce(g->>'escuela',''),
          -- el alumno de prueba (🧪) se compara como TEXTO, no con un
          -- cast: un valor raro en ese campo no puede tumbar la consulta
          'matricula', (select count(*)
            from jsonb_array_elements(public._metas_arreglo(g->'lista')) a
            where coalesce(a->>'prueba','') <> 'true'),
          'ninas', (select count(*)
            from jsonb_array_elements(public._metas_arreglo(g->'lista')) a
            where coalesce(a->>'prueba','') <> 'true'
              and upper(coalesce(a->>'sexo','')) = 'F'),
          'varones', (select count(*)
            from jsonb_array_elements(public._metas_arreglo(g->'lista')) a
            where coalesce(a->>'prueba','') <> 'true'
              and upper(coalesce(a->>'sexo','')) = 'M')))
        from jsonb_array_elements(public._metas_grupos_de(d.codigo)) g
      ), '[]'::jsonb),
      -- el estado de MIS permisos con este docente (solo Dirección)
      'permisos', case when v_es_dir then coalesce((
        select jsonb_object_agg(pp.permiso, pp.estado)
        from public.docente_permisos pp
        where pp.docente_codigo = d.codigo
          and pp.direccion_codigo = yo.codigo), '{}'::jsonb)
        else '{}'::jsonb end
      ) as fila
    from public.docentes d
    where case
      when v_es_dir then public.metas_norm(coalesce(d.escuela,'')) = public.metas_norm(yo.escuela)
      else true end
    order by d.creado_en desc
    limit case when v_es_dir then 200 else 500 end
  ) s;

  return jsonb_build_object('ok', true, 'rol', coalesce(yo.rol,'docente'),
                            'docentes', coalesce(v_lista, '[]'::jsonb));
end
$$;
revoke all on function public.metas_rol_grupos(text,text) from public;
grant execute on function public.metas_rol_grupos(text,text) to anon, authenticated;


-- ── 6b) LA LISTA DE UN GRUPO — solo director/asistencia de la misma
--    escuela. El alumno viaja como número de lista + nombre + sexo,
--    NADA MÁS: ni identidad, ni teléfonos, ni encargados, ni claves
--    de familia. Los de prueba (🧪) no salen: no existen para la
--    Dirección, igual que en los informes. ──
create or replace function public.metas_rol_alumnos(
  p_codigo text, p_clave text, p_nombre_docente text, p_grupo_id text
) returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  d public.docentes;
  v_grupo jsonb;
  v_alumnos jsonb;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not public._metas_es_direccion(yo.rol) then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;

  d := public._metas_docente_por_nombre(p_nombre_docente);
  if d.codigo is null then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  if not public._metas_misma_escuela(yo.escuela, d.escuela) then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;

  select g into v_grupo
  from jsonb_array_elements(public._metas_grupos_de(d.codigo)) g
  where g->>'id' = trim(coalesce(p_grupo_id,''))
  limit 1;
  if v_grupo is null then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;

  select jsonb_agg(jsonb_build_object(
           'num', coalesce(a->>'num',''),
           'nombre', coalesce(a->>'nombre',''),
           'sexo', upper(coalesce(a->>'sexo','')))
         order by coalesce(nullif(left(regexp_replace(coalesce(a->>'num',''), '\D', '', 'g'), 6), '')::int, 999999))
    into v_alumnos
  from jsonb_array_elements(public._metas_arreglo(v_grupo->'lista')) a
  where coalesce(a->>'prueba','') <> 'true';

  return jsonb_build_object('ok', true,
    'grado', coalesce(v_grupo->>'grado',''),
    'seccion', coalesce(v_grupo->>'seccion',''),
    'escuela', coalesce(v_grupo->>'escuela',''),
    'alumnos', coalesce(v_alumnos, '[]'::jsonb));
end
$$;
revoke all on function public.metas_rol_alumnos(text,text,text,text) from public;
grant execute on function public.metas_rol_alumnos(text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 7) LAS CONVOCATORIAS DE UN MAESTRO, CON SU PERMISO.
--    El caso delegable que estrena el sistema. El PIN no viaja NUNCA:
--    el servidor comprueba el permiso concedido y responde él mismo.
--    Por eso revocar el permiso corta el acceso de verdad, cosa que
--    compartir el PIN por WhatsApp jamás podría deshacer.
--    Lo apuntado a mano y los pagos NO salen: viven en el equipo del
--    maestro y son suyos (los pagos, además, son plata de las
--    familias y no viajan a la nube ni para él).
-- ────────────────────────────────────────────────────────────

-- Los códigos de convocatoria que hay en el aula de un docente
create or replace function public._metas_convs_de(p_codigo text)
returns text[] language sql stable
as $$
  select coalesce(array_agg(distinct cv->>'codigo'), '{}')
  from jsonb_array_elements(public._metas_grupos_de(p_codigo)) g,
       jsonb_array_elements(public._metas_arreglo(g->'convocatorias')) cv
  where coalesce(cv->>'codigo','') <> ''
$$;
revoke all on function public._metas_convs_de(text) from public, anon, authenticated;

-- ── 7a) Listar las convocatorias del maestro (evento + conteos) ──
create or replace function public.metas_rol_conv_listar(
  p_codigo text, p_clave text, p_nombre_docente text
) returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  d public.docentes;
  v_lista jsonb;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not public._metas_es_direccion(yo.rol) then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;

  d := public._metas_docente_por_nombre(p_nombre_docente);
  if d.codigo is null then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  if not public._metas_misma_escuela(yo.escuela, d.escuela) then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;
  if not public._metas_permiso_ok(d.codigo, yo.codigo, 'convocatorias') then
    return jsonb_build_object('ok', false, 'motivo', 'permiso');
  end if;

  select jsonb_agg(fila order by fila->>'actualizada' desc) into v_lista
  from (
    select jsonb_build_object(
      'codigo', c.codigo,
      'titulo', coalesce(c.datos->>'titulo',''),
      'fecha', coalesce(c.datos->>'fecha',''),
      'lugar', coalesce(c.datos->>'lugar',''),
      'aporte', coalesce(c.datos->>'aporte',''),
      'cerrada', coalesce(c.datos->>'cerrada','') = '1',
      'familias', (select count(*) from public.convocatoria_respuestas r
                   where r.codigo = c.codigo and r.va),
      'personas', (select coalesce(sum(r.personas),0) from public.convocatoria_respuestas r
                   where r.codigo = c.codigo and r.va),
      'actualizada', c.actualizada_en) as fila
    from public.convocatorias c
    where c.codigo = any (public._metas_convs_de(d.codigo))
    limit 100
  ) s;

  return jsonb_build_object('ok', true, 'convocatorias', coalesce(v_lista, '[]'::jsonb));
end
$$;
revoke all on function public.metas_rol_conv_listar(text,text,text) from public;
grant execute on function public.metas_rol_conv_listar(text,text,text) to anon, authenticated;


-- ── 7b) Las respuestas de UNA convocatoria — el manejo delegado.
--    Devuelve lo mismo que ve el maestro con su PIN (incluido el
--    teléfono que la familia escribió para que la contacten: avisar a
--    las familias ES el manejo que el maestro está delegando). ──
create or replace function public.metas_rol_conv_respuestas(
  p_codigo text, p_clave text, p_nombre_docente text, p_conv text
) returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
  d public.docentes;
  v_conv text := upper(trim(coalesce(p_conv,'')));
  v_lista jsonb;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not public._metas_es_direccion(yo.rol) then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;

  d := public._metas_docente_por_nombre(p_nombre_docente);
  if d.codigo is null then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;
  if not public._metas_misma_escuela(yo.escuela, d.escuela) then
    return jsonb_build_object('ok', false, 'motivo', 'escuela');
  end if;
  if not public._metas_permiso_ok(d.codigo, yo.codigo, 'convocatorias') then
    return jsonb_build_object('ok', false, 'motivo', 'permiso');
  end if;
  -- la convocatoria tiene que ser DE ESE maestro: el permiso no abre
  -- las de nadie más
  if not (v_conv = any (public._metas_convs_de(d.codigo))) then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;

  select jsonb_agg(fila order by fila->>'actualizado' desc) into v_lista
  from (
    select jsonb_build_object(
      'va', r.va, 'alumno', r.alumno, 'grado', r.grado, 'seccion', r.seccion,
      'personas', r.personas, 'tel', coalesce(r.tel,''), 'nota', coalesce(r.nota,''),
      'actualizado', r.actualizado_en) as fila
    from public.convocatoria_respuestas r
    where r.codigo = v_conv
    limit 1000
  ) s;

  return jsonb_build_object('ok', true, 'codigo', v_conv,
                            'respuestas', coalesce(v_lista, '[]'::jsonb));
end
$$;
revoke all on function public.metas_rol_conv_respuestas(text,text,text,text) from public;
grant execute on function public.metas_rol_conv_respuestas(text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- Verificación rápida (correr aparte, mirando el resultado):
--
-- 1) El rol asistencia ya es válido:
-- select conname, pg_get_constraintdef(oid) from pg_constraint
--   where conname = 'docentes_rol_valido';
--    → debe incluir 'asistencia'.
--
-- 2) Las funciones nuevas existen (deben salir 8 filas):
-- select proname from pg_proc
--   where proname in ('metas_rol_grupos','metas_rol_alumnos',
--     'metas_permiso_pedir','metas_permiso_dar','metas_permiso_responder',
--     'metas_permisos_listar','metas_rol_conv_listar','metas_rol_conv_respuestas');
--
-- 3) La tabla de permisos existe y está cerrada (rowsecurity = true):
-- select relname, relrowsecurity from pg_class where relname = 'docente_permisos';
--
-- 4) Con una cuenta director o asistencia de prueba (desde la app o con
--    curl): metas_rol_grupos debe devolver los docentes de SU escuela y
--    cada uno con sus grupos; metas_rol_alumnos de un grupo debe traer
--    num, nombre y sexo Y NADA MÁS (ni idn, ni tel, ni enc);
--    metas_rol_conv_respuestas sin permiso concedido debe devolver
--    {ok:false, motivo:'permiso'}.
-- ────────────────────────────────────────────────────────────
