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
-- 5-bis) RESUMEN DE ALTAS — SOLO el admin: cuántas cuentas se
--    registraron por día (31 días), por mes (24 meses) y por año.
--    El conteo lo hace el servidor sobre TODA la tabla (no depende
--    del límite de la lista), así sirve aunque haya miles.
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_registros_resumen(p_codigo text, p_clave text)
returns jsonb
language plpgsql security definer stable set search_path = public
as $$
declare
  yo record;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if coalesce(yo.rol,'docente') <> 'admin' then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  return jsonb_build_object(
    'ok', true,
    'total', (select count(*) from public.docentes),
    'por_dia', (
      select coalesce(jsonb_agg(jsonb_build_object('f', f, 'n', n) order by f desc), '[]'::jsonb)
      from (select to_char(d.creado_en, 'YYYY-MM-DD') f, count(*) n
            from public.docentes d group by 1 order by 1 desc limit 31) t),
    'por_mes', (
      select coalesce(jsonb_agg(jsonb_build_object('f', f, 'n', n) order by f desc), '[]'::jsonb)
      from (select to_char(d.creado_en, 'YYYY-MM') f, count(*) n
            from public.docentes d group by 1 order by 1 desc limit 24) t),
    'por_anio', (
      select coalesce(jsonb_agg(jsonb_build_object('f', f, 'n', n) order by f desc), '[]'::jsonb)
      from (select to_char(d.creado_en, 'YYYY') f, count(*) n
            from public.docentes d group by 1 order by 1 desc limit 10) t)
  );
end
$$;
revoke all on function public.metas_registros_resumen(text,text) from public;
grant execute on function public.metas_registros_resumen(text,text) to anon, authenticated;


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
-- 6-bis) NUEVA CONTRASEÑA para un usuario — SOLO el admin.
--    Las contraseñas NUNCA se pueden VER (solo se guarda su hash
--    irreversible): auxiliar al usuario = ASIGNARLE una nueva.
--    Reglas duras del servidor:
--      • solo una cuenta con rol admin puede llamarla,
--      • no toca cuentas admin (ni la propia: usa «Cambiar mi
--        contraseña» normal),
--      • mínimo 6 caracteres, se guarda en formato v2 salado,
--      • desbloquea el freno de intentos de ese correo (si el usuario
--        se bloqueó probando, con la nueva entra de inmediato),
--      • pasa por el candado de velocidad por IP (metas_rate_ok).
-- ────────────────────────────────────────────────────────────
create or replace function public.metas_rol_clave_reset(
  p_codigo text, p_clave text, p_correo text, p_nueva text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
  v_correo text := lower(trim(coalesce(p_correo,'')));
  v_nueva  text := trim(coalesce(p_nueva,''));
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

  if length(v_nueva) < 6 then
    return jsonb_build_object('ok', false, 'motivo', 'clave_corta');
  end if;
  if v_correo = lower(coalesce(yo.correo,'')) then
    return jsonb_build_object('ok', false, 'motivo', 'propio');
  end if;

  update public.docentes d
     set clave_hash = 'v2:' || encode(extensions.digest(v_nueva || d.codigo, 'sha256'), 'hex')
   where lower(d.correo) = v_correo
     and d.correo is not null and d.correo <> ''
     and coalesce(d.rol,'docente') <> 'admin';   -- a otro admin nadie lo toca
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'no_existe');
  end if;

  -- desbloquear el freno anti fuerza bruta de ese correo
  delete from public.docente_intentos where correo = v_correo;

  return jsonb_build_object('ok', true);
end
$$;
revoke all on function public.metas_rol_clave_reset(text,text,text,text) from public;
grant execute on function public.metas_rol_clave_reset(text,text,text,text) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 6-ter) BUZÓN DE SUGERENCIAS — cualquier cuenta le escribe al
--    administrador del proyecto desde Ajustes; solo el admin lee.
--    Anti-spam: máximo 10 mensajes por cuenta por día + candado de
--    velocidad por IP. Snapshot de quién envía (nombre/correo/rol al
--    momento de enviar), para que el buzón se entienda solo.
-- ────────────────────────────────────────────────────────────
create table if not exists public.sugerencias (
  id bigint generated always as identity primary key,
  codigo text not null,              -- PROF del remitente
  nombre text,                       -- snapshot al enviar
  correo text,
  rol text,
  texto text not null,
  leido boolean not null default false,
  creado_en timestamptz not null default now()
);
alter table public.sugerencias enable row level security;
-- sin políticas: nadie la lee ni escribe directo, solo las funciones
create index if not exists idx_sugerencias_id on public.sugerencias (id desc);

create or replace function public.metas_sugerencia_enviar(
  p_codigo text, p_clave text, p_texto text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  d record;
  v_texto text := trim(coalesce(p_texto,''));
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
  if length(v_texto) < 5 then
    return jsonb_build_object('ok', false, 'motivo', 'texto_corto');
  end if;

  select * into d from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));

  -- anti-spam: 10 mensajes por cuenta por día
  if (select count(*) from public.sugerencias s
      where s.codigo = d.codigo and s.creado_en > now() - interval '1 day') >= 10 then
    return jsonb_build_object('ok', false, 'motivo', 'espera');
  end if;

  insert into public.sugerencias (codigo, nombre, correo, rol, texto)
  values (d.codigo, d.nombre, d.correo, coalesce(d.rol,'docente'), left(v_texto, 1000));
  return jsonb_build_object('ok', true);
end
$$;
revoke all on function public.metas_sugerencia_enviar(text,text,text) from public;
grant execute on function public.metas_sugerencia_enviar(text,text,text) to anon, authenticated;

create or replace function public.metas_sugerencias_listar(p_codigo text, p_clave text)
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
  if coalesce(yo.rol,'docente') <> 'admin' then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  select jsonb_agg(fila order by (fila->>'id')::bigint desc) into v_lista
  from (
    select jsonb_build_object(
      'id', s.id, 'nombre', s.nombre, 'correo', s.correo,
      'rol', coalesce(s.rol,'docente'), 'texto', s.texto,
      'leido', s.leido, 'creado', s.creado_en) as fila
    from public.sugerencias s
    order by s.id desc
    limit 200
  ) t;
  return jsonb_build_object('ok', true, 'sugerencias', coalesce(v_lista, '[]'::jsonb));
end
$$;
revoke all on function public.metas_sugerencias_listar(text,text) from public;
grant execute on function public.metas_sugerencias_listar(text,text) to anon, authenticated;

create or replace function public.metas_sugerencia_leida(
  p_codigo text, p_clave text, p_id bigint
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  yo record;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return jsonb_build_object('ok', false, 'motivo', 'clave');
  end if;
  select * into yo from public.docentes t
  where t.codigo = upper(trim(coalesce(p_codigo,'')));
  if coalesce(yo.rol,'docente') <> 'admin' then
    return jsonb_build_object('ok', false, 'motivo', 'rol');
  end if;
  update public.sugerencias set leido = true where id = p_id;
  return jsonb_build_object('ok', found);
end
$$;
revoke all on function public.metas_sugerencia_leida(text,text,bigint) from public;
grant execute on function public.metas_sugerencia_leida(text,text,bigint) to anon, authenticated;


-- ────────────────────────────────────────────────────────────
-- 7) HACERTE ADMIN (una sola vez, a mano — quita los guiones):
--    Reemplaza el correo por EL TUYO (el de tu cuenta docente V2)
--    y corre SOLO esa línea. Ningún RPC puede otorgar 'admin'.
-- ────────────────────────────────────────────────────────────
-- update public.docentes set rol = 'admin' where lower(correo) = 'tu-correo@ejemplo.com';

-- Verificación rápida:
-- select nombre, correo, rol, creado_en from public.docentes order by creado_en desc limit 20;
