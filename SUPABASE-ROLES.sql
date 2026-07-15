-- ============================================================
-- M.E.T.A.S — ROLES: docente · director · rector · admin
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
-- Es IDEMPOTENTE: se puede correr varias veces sin dañar nada.
--
-- Qué agrega:
--   • Columna docentes.rol ('docente' por defecto). El rol vive EN LA
--     NUBE y toda verificación la hace el servidor: el teléfono solo
--     pinta lo que el servidor le permite ver.
--   • metas_entrar_docente_v2 ahora devuelve también el rol (misma
--     firma: los clientes viejos siguen funcionando igual).
--   • metas_perfil_leer / metas_perfil_editar → la tarjeta «Mi perfil»
--     de Ajustes (editar escuela, teléfono, lugar… NUNCA el nombre ni
--     el correo: el nombre es la llave de emparejamiento con los
--     alumnos y el correo es la llave de entrada).
--   • metas_rol_listar → lo que cada rol puede VER:
--       admin    = TODOS los registros con todos los datos (quién se
--                  registra, cuándo, correo, escuela, teléfono…).
--       rector   = docentes de todas las escuelas (sin datos de
--                  contacto: ni correo ni teléfono).
--       director = docentes de SU MISMA escuela (sin contacto).
--       docente  = nada (solo su propio perfil).
--   • metas_rol_cambiar → SOLO el admin promueve o degrada
--     (docente ↔ director ↔ rector). El rol admin NO se puede dar ni
--     quitar por RPC: únicamente con el UPDATE manual del final.
--
-- Requiere corridos antes: SUPABASE-DOCENTES-V2.sql (docentes,
-- _metas_docente_ok, metas_norm) y SUPABASE-FASE3.sql (metas_rate_ok).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1) Columna rol + candado de valores válidos
-- ────────────────────────────────────────────────────────────
alter table public.docentes
  add column if not exists rol text not null default 'docente';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'docentes_rol_valido') then
    alter table public.docentes add constraint docentes_rol_valido
      check (rol in ('docente','director','rector','admin'));
  end if;
end $$;

-- índice pequeño: el panel del admin ordena por fecha de registro
create index if not exists idx_docentes_creado on public.docentes (creado_en desc);


-- ────────────────────────────────────────────────────────────
-- 2) ENTRAR V2 devuelve el rol (misma función y firma que en
--    SUPABASE-DOCENTES-V2.sql; solo se agrega 'rol' a la respuesta).
-- ────────────────────────────────────────────────────────────
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

  -- Limpieza oportunista de intentos viejos (idéntica a V2)
  delete from public.docente_intentos where ultimo < now() - interval '1 day';

  -- FRENO: 5 fallos → esperar 10 minutos
  select i.fallos, i.ultimo into v_fallos, v_ultimo
  from public.docente_intentos i where i.correo = v_correo;
  if coalesce(v_fallos, 0) >= 5 and v_ultimo > now() - interval '10 minutes' then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;

  select * into d from public.docentes t
  where lower(t.correo) = v_correo
    and t.correo is not null and t.correo <> ''
  limit 1;

  if found then
    v_ok := (d.clave_hash = encode(extensions.digest(v_clave, 'sha256'), 'hex'))
         or (d.clave_hash = 'v2:' || encode(extensions.digest(v_clave || d.codigo, 'sha256'), 'hex'));
  end if;

  if v_ok then
    delete from public.docente_intentos where correo = v_correo;
    return jsonb_build_object('ok', true, 'codigo', d.codigo,
                              'nombre', d.nombre, 'correo', d.correo,
                              'rol', coalesce(d.rol, 'docente'));
  end if;

  insert into public.docente_intentos as di (correo, fallos, ultimo)
  values (v_correo, 1, now())
  on conflict (correo) do update set
    fallos = case when di.ultimo < now() - interval '10 minutes'
                  then 1 else di.fallos + 1 end,
    ultimo = now();
  return jsonb_build_object('ok', false, 'motivo', 'datos');
end
$$;
revoke all on function public.metas_entrar_docente_v2(text,text) from public;
grant execute on function public.metas_entrar_docente_v2(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 3) MI PERFIL (leer): la tarjeta de Ajustes. Devuelve los datos de
--    la PROPIA cuenta (y de nadie más) + el rol vigente — así una
--    promoción hecha por el admin se ve sin cerrar sesión.
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_perfil_leer(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  d record;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into d from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  return jsonb_build_object('ok', true,
    'nombre', d.nombre, 'correo', d.correo,
    'escuela', coalesce(d.escuela,''), 'tipo', coalesce(d.tipo,''),
    'telefono', coalesce(d.telefono,''), 'departamento', coalesce(d.departamento,''),
    'municipio', coalesce(d.municipio,''), 'lugar', coalesce(d.lugar,''),
    'rol', coalesce(d.rol,'docente'), 'creado_en', d.creado_en);
end
$$;
revoke all on function public.metas_perfil_leer(text,text) from public;
grant execute on function public.metas_perfil_leer(text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 4) MI PERFIL (editar): solo la PROPIA fila y solo los campos de
--    contexto. El nombre y el correo NO se tocan aquí (llaves del
--    sistema); el rol JAMÁS se toca aquí (solo metas_rol_cambiar).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_perfil_editar(
  p_codigo text, p_clave text,
  p_escuela text default null, p_tipo text default null,
  p_telefono text default null, p_departamento text default null,
  p_municipio text default null, p_lugar text default null
) returns jsonb
language plpgsql security definer set search_path = public
as $$
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  update public.docentes d set
    escuela      = case when p_escuela      is null then d.escuela      else left(trim(p_escuela), 120)     end,
    tipo         = case when p_tipo         is null then d.tipo         else left(trim(p_tipo), 40)         end,
    telefono     = case when p_telefono     is null then d.telefono     else left(trim(p_telefono), 40)     end,
    departamento = case when p_departamento is null then d.departamento else left(trim(p_departamento), 60) end,
    municipio    = case when p_municipio    is null then d.municipio    else left(trim(p_municipio), 60)    end,
    lugar        = case when p_lugar        is null then d.lugar        else left(trim(p_lugar), 120)       end
  where d.codigo = upper(trim(coalesce(p_codigo,'')));
  return jsonb_build_object('ok', found);
end
$$;
revoke all on function public.metas_perfil_editar(text,text,text,text,text,text,text,text) from public;
grant execute on function public.metas_perfil_editar(text,text,text,text,text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 5) LISTAR según el rol — la base de verificaciones por rol.
--    El servidor decide QUÉ filas y QUÉ columnas según quién llama:
--    los datos de contacto (correo, teléfono) SOLO los ve el admin.
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

  elsif yo.rol = 'director' then
    -- DIRECTOR: solo su misma escuela (nombre normalizado), sin contacto
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
-- 6) CAMBIAR ROL — SOLO el admin. Reglas duras del servidor:
--    • solo asigna 'docente' | 'director' | 'rector' (admin JAMÁS
--      por RPC: únicamente con el UPDATE manual del final),
--    • no puede tocar su propia cuenta ni la de otro admin,
--    • pasa por el candado de velocidad por IP (metas_rate_ok).
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

  if v_rol not in ('docente','director','rector') then
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
-- 7) HACERTE ADMIN (una sola vez, a mano — quita los guiones):
--    Reemplaza el correo por EL TUYO (el de tu cuenta docente V2)
--    y corre SOLO esa línea. Ningún RPC puede otorgar 'admin'.
-- ────────────────────────────────────────────────────────────
-- update public.docentes set rol = 'admin' where lower(correo) = 'tu-correo@ejemplo.com';

-- Verificación rápida:
-- select nombre, correo, rol, creado_en from public.docentes order by creado_en desc limit 20;
