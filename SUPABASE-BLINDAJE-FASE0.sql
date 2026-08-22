-- ============================================================
-- M.E.T.A.S — BLINDAJE FASE 0 (auditoría técnica, ago-2026)
-- Pegar COMPLETO en supabase.com → tu proyecto → SQL Editor → Run
--
-- ⚠️ ESTE ARCHIVO SE CORRE EL ÚLTIMO, y SIEMPRE que vuelvas a correr
--    SUPABASE-FASE3.sql, SUPABASE-SEGURIDAD.sql, SUPABASE-PLAN-PARCIAL.sql,
--    SUPABASE-PLAN-FECHA.sql, SUPABASE-REGISTROS-ADMIN.sql o SUPABASE-AVISOS.sql.
--    Esos archivos, al re-correrse, RECREAN las funciones de guardar en su
--    versión de 1 argumento SIN contraseña y se la conceden a `anon`. Este
--    archivo cierra esa puerta y le pone freno de velocidad a las consultas
--    que leen datos sensibles. Es idempotente: correrlo dos veces no rompe nada.
--
-- Por qué existe (auditoría, hallazgo #1):
--   metas_guardar_plan/admin/avisos y metas_cerrar_familias tienen DOS firmas:
--     · (jsonb)              → SIN contraseña, la vieja, peligrosa
--     · (text, text, jsonb) → CON cuenta docente, la que usa la app hoy
--   Postgres las trata como funciones distintas y PostgREST elige según las
--   claves del JSON. Mientras la (jsonb) exista y esté concedida a `anon`,
--   cualquiera con la clave pública puede escribir —o, con cerrar_familias,
--   BORRAR EN LOTE— datos de las familias. Este script borra la (jsonb).
--
-- Requisito previo: haber corrido SUPABASE-SEGURIDAD.sql (crea las versiones
--   de 3 argumentos con contraseña) y SUPABASE-FASE3.sql (crea metas_rate_ok).
--   Como salvaguarda, la (jsonb) SOLO se borra si ya existe la (text,text,jsonb):
--   así, si alguna vez corres esto por error antes del blindaje, no te quedas
--   sin función y sin poder guardar.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- PARTE A · Cerrar las escrituras anónimas (hallazgo #1)
--   Borra la sobrecarga (jsonb) SOLO si existe su gemela autenticada
--   (text,text,jsonb). Sin gemela, no toca nada y avisa.
-- ────────────────────────────────────────────────────────────
do $$
declare
  f record;
  tiene_auth boolean;
begin
  for f in
    select unnest(array[
      'metas_guardar_plan',
      'metas_guardar_admin',
      'metas_guardar_avisos',
      'metas_cerrar_familias'
    ]) as nom
  loop
    -- ¿existe la versión CON contraseña (text, text, jsonb)?
    select exists(
      select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = f.nom
        and pg_get_function_identity_arguments(p.oid) = 'text, text, jsonb'
    ) into tiene_auth;

    if tiene_auth then
      -- borrar la sobrecarga anónima de 1 argumento, si sigue viva
      if exists(
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = f.nom
          and pg_get_function_identity_arguments(p.oid) = 'jsonb'
      ) then
        execute format('drop function public.%I(jsonb)', f.nom);
        raise notice 'BORRADA la versión anónima: %(jsonb)', f.nom;
      else
        raise notice 'OK, ya no existía la anónima: %(jsonb)', f.nom;
      end if;
    else
      raise warning 'SALTADA %: falta la versión autenticada (text,text,jsonb). Corre antes SUPABASE-SEGURIDAD.sql.', f.nom;
    end if;
  end loop;
end $$;


-- ────────────────────────────────────────────────────────────
-- PARTE B · Freno de velocidad en las RPC que LEEN datos sensibles
--   sin más barrera que un código público (hallazgos #5 y #7 de la
--   auditoría). Reutiliza metas_rate_ok() (300 lecturas/hora por IP),
--   el mismo candado que ya protege las consultas del padre.
--
--   Nota: si metas_rate_ok aún no existiera (no corriste FASE3), el
--   bloque `exception when undefined_function` deja pasar la llamada en
--   vez de caerse — igual que ya hace metas_conv_responder.
--
--   metas_guardar (ingesta de resultados de alumnos) queda A PROPÓSITO
--   fuera: un aula entera comparte una sola IP y 300/hora tiraría en
--   silencio evaluaciones de niños de verdad. Se atiende en Fase 2 con
--   un presupuesto pensado para escritura.
-- ────────────────────────────────────────────────────────────

-- B1) Buzón de excusas de las familias: lo leía cualquiera con el código
--     de familia, sin freno. Ahora cuenta contra el límite por IP.
create or replace function public.metas_buzon_docente(p_codigos jsonb)
returns table (codigo text, texto text, creado_en timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  begin
    if not public.metas_rate_ok() then return; end if;
  exception when undefined_function then null;
  end;

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


-- B2) Consulta de resultados del docente (consulta-nube.html). Verifica
--     la contraseña, pero sin freno se podía adivinar la clave llamándola
--     en bucle, saltándose el bloqueo del login. Se le pone el candado
--     ANTES de comprobar la contraseña, para que cada intento cuente.
--     (Se quita 'stable': ahora tiene efecto —el conteo del freno—.)
create or replace function public.metas_consultar_docente(p_codigo text, p_clave text)
returns setof public.resultados
language plpgsql security definer set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
begin
  begin
    if not public.metas_rate_ok() then return; end if;
  exception when undefined_function then null;
  end;

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


-- B3) Igual, para el progreso (XP/logros) del docente.
create or replace function public.metas_consultar_progreso_docente(p_codigo text, p_clave text)
returns setof public.progreso
language plpgsql security definer set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
begin
  begin
    if not public.metas_rate_ok() then return; end if;
  exception when undefined_function then null;
  end;

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


-- B4) Respuestas de la convocatoria (nombres y teléfonos de las familias
--     de toda la escuela), protegidas solo por el PIN. Sin freno, el PIN
--     corto se podía adivinar en bucle. Se pasa de `language sql` a
--     plpgsql para poder anteponer el candado; la consulta es idéntica.
create or replace function public.metas_conv_respuestas(p_codigo text, p_pin text)
returns table (va boolean, alumno text, grado text, seccion text,
               personas integer, tel text, nota text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, extensions
as $$
begin
  begin
    if not public.metas_rate_ok() then return; end if;
  exception when undefined_function then null;
  end;

  return query
  select r.va, r.alumno, r.grado, r.seccion, r.personas, r.tel, r.nota, r.actualizado_en
  from public.convocatoria_respuestas r
  join public.convocatorias c on c.codigo = r.codigo
  where r.codigo = upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g'))
    and c.pin_hash = encode(extensions.digest(
      convert_to(coalesce(p_pin,'') || upper(regexp_replace(coalesce(p_codigo,''), '[^A-Za-z0-9]', '', 'g')), 'UTF8'),
      'sha256'), 'hex')
  order by r.va desc, r.grado asc, r.alumno asc
  limit 1000;
end
$$;
revoke all on function public.metas_conv_respuestas(text, text) from public;
grant execute on function public.metas_conv_respuestas(text, text) to anon, authenticated;


-- ============================================================
-- COMPROBACIÓN (corre estas tres consultas y mira el resultado)
-- ============================================================

-- 1) NINGUNA de las cuatro funciones de escritura debe tener ya una firma
--    que sea SOLO (jsonb). Deben salir únicamente filas «text, text, jsonb».
select proname, pg_get_function_identity_arguments(oid) as args
from pg_proc
where proname in ('metas_guardar_plan','metas_guardar_admin','metas_guardar_avisos','metas_cerrar_familias')
order by proname, args;

-- 2) Las cuatro RPC de lectura sensible deben llevar el freno. Debe salir 4.
select count(*) as con_freno
from pg_proc
where prosrc like '%metas_rate_ok%'
  and proname in ('metas_buzon_docente','metas_consultar_docente',
                  'metas_consultar_progreso_docente','metas_conv_respuestas');

-- 3) Prueba de humo: la escritura con cuenta docente FALSA debe devolver -1
--    (rechazada). Si diera 0 o error de «función no existe con esos args»,
--    revisa el paso 1. -1 = la única versión viva es la autenticada. ✔
select public.metas_guardar_plan('PROF-NO-EXISTE','clave-mala','[]'::jsonb) as debe_ser_menos_1;
