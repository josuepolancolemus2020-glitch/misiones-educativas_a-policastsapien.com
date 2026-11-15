-- ============================================================================
-- M.E.T.A.S · Congelar el modelo viejo y convivir con él · PROPUESTA (rev. 4)
-- ----------------------------------------------------------------------------
-- ⚠️ NO EJECUTAR en el proyecto real. Nada se borra: lo viejo queda como
--    ARCHIVO. Va por pasos alineados con los cortes de 08-PLAN-POR-CORTES.md.
--    Se puede correr DOS veces sin error ni efecto nuevo (la capa A lo hace):
--    los disparadores son «create or replace», los renombres preguntan antes
--    y la copia de claves se toma una sola vez.
--    En public, Supabase da de fábrica GRANT ALL a anon, authenticated y
--    service_role sobre toda función nueva: por eso cada función interna de
--    este archivo se cierra a mano a los cuatro (public incluido).
--
-- PASO 1 · con el CORTE 1 (dinero, alumnos, notas, asistencia, controles,
--          avisos, conducta, preguntas frecuentes y bitácora)
--   a) copia inmutable de las claves de familia de todos (metas.claves_archivo);
--   b) CANDADO en public.docente_estado: para docentes con cuenta vinculada
--      se rechaza toda escritura de METAS_CODIGOS_V1, de METAS_AVISOS_V1 y de
--      METAS_ADMIN_V1 con secciones del corte 1 no vacías. Lo mismo impide
--      que lo de las tablas nuevas vuelva al blob;
--   c) metas_docente_estado_guardar y metas_guardar_avisos responden -2 (y
--      lo anotan) en vez de escribir, para que una app vieja NO marque nada
--      como subido. El docente se reconoce por el código con el que entró
--      (validado contra public.docentes y metas.cuentas), nunca por el texto
--      libre «docente» de una fila;
--   d) metas.blob_leer / metas.blob_guardar: el blob por SESIÓN, sin
--      contraseña, para las herramientas que todavía no pasan a filas;
--   e) mensajes_docente no acepta nada de docentes vinculados (sus avisos,
--      conducta, recibos y cuentas ya salen de la base nueva);
--   e2) las lecturas viejas del chatbot (metas_consultar_admin_padre y
--      metas_consultar_avisos_padre) dejan de devolver dinero (pagos,
--      cuentas claras, recibos) de docentes vinculados. El resto (notas,
--      asistencia, avisos) se sigue viendo hasta el paso 4;
--   f) registro_admin: no se escribe; SÍ se deja borrar (lo hace
--      metas_cerrar_familias en el cierre de año, que sigue abierta);
--   g) se cierran: metas_guardar_admin (todas sus firmas),
--      metas_recuperar_admin_docente, metas_docente_historial,
--      metas_docente_historial_listar, metas_docente_papelera,
--      metas_docente_reset, metas_docente_reset_deshacer,
--      metas_consultar_progreso(p_clave), metas_restaurar_codigos.
--      NO se cierra metas_cerrar_familias: hay cierre de año en curso.
-- PASO 2 · corte del plan de acción, acumulativos, lecturas y equipos
-- PASO 3 · último corte: ya nada vive en el blob
-- PASO 4 · todos los docentes migrados, o al terminar el primer parcial de
--          2027 con dos semanas de aviso: se cierra el archivo a las familias
--
-- NO se toca en ningún paso: public.docentes ni nada de cuentas;
-- metas_guardar y metas_guardar_progreso (lado del ALUMNO,
-- js/metas-supabase.js:129 y :267); convocatorias públicas; Campeonísimo en
-- vivo; lo que escriben los padres (metas_mensaje_padre, metas_aviso_visto).
-- ============================================================================

create or replace function public._metas_archivo_congelado()
returns trigger language plpgsql as $$
begin
  raise exception 'M.E.T.A.S: % es un archivo congelado (solo lectura) desde el cambio a la base v2',
    tg_table_name using errcode = 'MT010';
end $$;

create or replace function public._metas_cerrar_funciones(p_nombres text[])
returns void language plpgsql as $$
declare f record;
begin
  for f in   -- TODAS las firmas de cada nombre (también las viejas sin contraseña)
    select p.oid::regprocedure as firma
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = any (p_nombres)
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.firma);
    raise notice 'función cerrada: %', f.firma;
  end loop;
end $$;
revoke all on function public._metas_cerrar_funciones(text[]) from public, anon, authenticated, service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 1 · corte 1
-- ════════════════════════════════════════════════════════════════════════════

-- 1a) Copia inmutable de las claves (y marca el hito 'paso1'). Una sola vez:
-- si este archivo se vuelve a correr, la copia ya tomada no se amplía con lo
-- que haya cambiado después en el blob vivo.
select metas._claves_tomar_todas()
 where not exists (select 1 from metas.hitos where nombre = 'paso1');

-- 1b) Candado del blob ---------------------------------------------------------
-- ¿Tiene datos de verdad? (algún texto no vacío, número o sí/no en cualquier
-- nivel). Un texto vacío no cuenta: la app vieja deja «logo: ''» en todo aula.
create or replace function metas._tiene_datos(j jsonb)
returns boolean language sql immutable as $$
  select coalesce(jsonb_path_exists(j, 'lax $.** ? ((@.type() == "string" && @ != "") || @.type() == "number" || @.type() == "boolean")'), false)
$$;

-- El código de docente tal como lo guarda public.docentes (y como lo compara
-- _metas_docente_ok): sin espacios a los lados y en mayúsculas. Toda decisión
-- de «¿está vinculado?» pasa por aquí, nunca por el texto libre «docente».
create or replace function metas._codigo_docente(p text)
returns text language sql immutable as $$
  select upper(trim(coalesce(p, '')))
$$;

-- Devuelve por qué se rechaza esa escritura, o null si se puede.
create or replace function metas._blob_bloqueado(p_codigo text, p_k text, p_raw text)
returns text language plpgsql stable security definer set search_path = metas, pg_temp as $$
declare
  j jsonb;
  g jsonb;
  s text;
begin
  if not exists (select 1 from metas.cuentas c where c.docente_codigo = metas._codigo_docente(p_codigo)) then
    return null;                               -- docente sin vincular: todo como hoy
  end if;
  if p_k in ('METAS_CODIGOS_V1', 'METAS_AVISOS_V1') then
    return 'llave_migrada:' || p_k;            -- claves, avisos, conducta, preguntas: base nueva
  end if;
  if p_k <> 'METAS_ADMIN_V1' then
    return null;                               -- plan, Campeonísimo, gobierno escolar: siguen en el blob
  end if;
  j := metas._json_o_nulo(p_raw);
  if j is null then
    return 'raw_invalido';                     -- no se puede comprobar: no se acepta
  end if;
  if metas._tiene_datos(j -> 'gastos') then
    return 'seccion_corte1:gastos';
  end if;
  -- Cada aula de «grupos», y también la RAÍZ: el formato v1 (sin «v») tenía
  -- lista, notas, colectas y materias sueltas arriba, y una app muy vieja
  -- todavía podría mandarlo así.
  for g in select j
           union all
           select * from jsonb_array_elements(case when jsonb_typeof(j -> 'grupos') = 'array'
                                                   then j -> 'grupos' else '[]'::jsonb end) loop
    continue when jsonb_typeof(g) <> 'object';
    -- Todo lo que el corte 1 pasa a filas: alumnos, notas, asistencia,
    -- dinero, controles y bitácora, y el aula misma (encabezado de boleta,
    -- fechas de parcial, asignaturas, logos, fecha de corte de edad y
    -- observación del grado: columnas de metas.aulas, metas.periodos y
    -- metas.asignaturas).
    foreach s in array array['lista', 'notas', 'recuperacion', 'inasisOficial', 'asistencia',
                             'colectas', 'controles', 'bitacora',
                             'boleta', 'materias', 'logo', 'logoSec', 'edadCorte', 'obsGrado'] loop
      if metas._tiene_datos(g -> s) then
        return 'seccion_corte1:' || s;
      end if;
    end loop;
  end loop;
  return null;
end $$;
revoke all on function metas._tiene_datos(jsonb), metas._codigo_docente(text),
  metas._blob_bloqueado(text, text, text)
  from public, anon, authenticated;

-- Respaldo duro: sea quien sea quien escriba (la función vieja, la de
-- restaurar, un SQL a mano), la fila no entra.
create or replace function public._metas_candado_blob()
returns trigger language plpgsql security definer set search_path = public, metas, pg_temp as $$
declare v text;
begin
  v := metas._blob_bloqueado(new.codigo, new.k, new.valor ->> 'raw');
  if v is not null then
    raise exception 'M.E.T.A.S: actualiza la app. Estos datos ahora se guardan en la base nueva (%).', v
      using errcode = 'MT040';
  end if;
  return new;
end $$;
revoke all on function public._metas_candado_blob() from public, anon, authenticated, service_role;
create or replace trigger docente_estado_candado before insert or update on public.docente_estado
  for each row execute function public._metas_candado_blob();

-- 1c) La función vieja de guardar: misma firma, pero antes revisa el candado.
-- Si algo está bloqueado no escribe NADA y devuelve -2: la app vieja trata
-- cualquier número negativo como «rechazado» (js/metas-docente-sync.js:281)
-- y deja sus cambios pendientes, sin marcarlos como subidos. Se anota cada
-- intento (para saber quién sigue con una app vieja), con tope por docente.
create table if not exists metas.blob_rechazos (
  id          bigint      generated always as identity primary key,
  ocurrido_at timestamptz not null default now(),
  codigo      text        not null,
  k           text,
  dispositivo text,
  motivo      text
);
alter table metas.blob_rechazos enable row level security;
revoke all on metas.blob_rechazos from public, anon, authenticated;

-- Renombres de las funciones viejas que se envuelven. Solo la PRIMERA vez:
-- si el archivo se corre de nuevo, el nombre viejo ya es nuestra envoltura, y
-- renombrarla dejaría a la envoltura llamándose a sí misma.
do $$
begin
  if to_regprocedure('public._metas_docente_estado_guardar_v1(text, text, jsonb, boolean)') is null then
    alter function public.metas_docente_estado_guardar(text, text, jsonb, boolean)
      rename to _metas_docente_estado_guardar_v1;
  end if;
  if to_regprocedure('public._metas_guardar_avisos_v1(text, text, jsonb)') is null then
    alter function public.metas_guardar_avisos(text, text, jsonb) rename to _metas_guardar_avisos_v1;
  end if;
  if to_regprocedure('public._metas_consultar_admin_padre_v1(text)') is null then
    alter function public.metas_consultar_admin_padre(text) rename to _metas_consultar_admin_padre_v1;
  end if;
  if to_regprocedure('public._metas_consultar_avisos_padre_v1(text)') is null then
    alter function public.metas_consultar_avisos_padre(text) rename to _metas_consultar_avisos_padre_v1;
  end if;
end $$;
-- Las originales llevaban GRANT a anon: ahora solo las llama su envoltura.
revoke all on function public._metas_docente_estado_guardar_v1(text, text, jsonb, boolean),
                       public._metas_guardar_avisos_v1(text, text, jsonb),
                       public._metas_consultar_admin_padre_v1(text),
                       public._metas_consultar_avisos_padre_v1(text)
  from public, anon, authenticated, service_role;

create or replace function public.metas_docente_estado_guardar(
  p_codigo text, p_clave text, p_entradas jsonb, p_forzar boolean default false
) returns integer language plpgsql security definer set search_path = public, metas, pg_temp as $$
declare
  e jsonb;
  v text;
  bloqueado boolean := false;
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then
    return -1;                                 -- como siempre: cuenta o contraseña mal
  end if;
  for e in select * from jsonb_array_elements(case when jsonb_typeof(p_entradas) = 'array'
                                                   then p_entradas else '[]'::jsonb end) loop
    v := metas._blob_bloqueado(p_codigo, e ->> 'k', e -> 'valor' ->> 'raw');
    if v is not null then
      bloqueado := true;
      if metas.freno_ok('blobrech:' || metas._codigo_docente(p_codigo), 100, interval '1 hour') then
        insert into metas.blob_rechazos (codigo, k, dispositivo, motivo)
        values (metas._codigo_docente(p_codigo), left(e ->> 'k', 60), left(e ->> 'dispositivo', 64), v);
      end if;
    end if;
  end loop;
  if bloqueado then
    return -2;                                 -- «actualiza la app»: no se escribe nada
  end if;
  return public._metas_docente_estado_guardar_v1(p_codigo, p_clave, p_entradas, p_forzar);
end $$;
revoke all on function public.metas_docente_estado_guardar(text, text, jsonb, boolean) from public;
grant execute on function public.metas_docente_estado_guardar(text, text, jsonb, boolean) to anon, authenticated;

-- 1d) El blob por SESIÓN, para la app nueva (sin contraseña guardada), solo
-- para las llaves que todavía no pasan a filas. Desaparece en el paso 3.
create or replace function metas.blob_leer()
returns table (k text, valor jsonb, version bigint, actualizado_en timestamptz)
language sql stable security definer set search_path = metas, public, pg_temp as $$
  select d.k, d.valor, d.version, d.actualizado_en
    from public.docente_estado d
    join metas.cuentas c on c.docente_codigo = d.codigo
   where c.auth_uid = (select auth.uid())
     and metas.es_docente()
     and d.k in ('METAS_ADMIN_V1', 'METAS_PLANACCION_V1', 'METAS_CAMP_V1',
                 'METAS_CAMP_BANK_EXTRA_V1', 'METAS_CAMP_USED_V1', 'meta_ge_v2')
$$;

create or replace function metas.blob_guardar(p_entradas jsonb, p_forzar boolean default false)
returns integer language plpgsql security definer set search_path = metas, public, pg_temp as $$
declare
  v_cod text;
  e jsonb;
  n int := 0;
  filas int;                                   -- no «k»: chocaría con la columna k
begin
  if not metas.es_docente() then
    raise exception 'metas: se necesita una cuenta de docente' using errcode = '42501';
  end if;
  select docente_codigo into v_cod from metas.cuentas where auth_uid = (select auth.uid());
  for e in select * from jsonb_array_elements(case when jsonb_typeof(p_entradas) = 'array'
                                                   then p_entradas else '[]'::jsonb end) loop
    if (e ->> 'k') not in ('METAS_ADMIN_V1', 'METAS_PLANACCION_V1', 'METAS_CAMP_V1',
                           'METAS_CAMP_BANK_EXTRA_V1', 'METAS_CAMP_USED_V1', 'meta_ge_v2') then
      continue;
    end if;
    -- el candado (1b) corre también aquí: si la app nueva mandara una sección
    -- del corte 1, la escritura falla entera
    insert into public.docente_estado as d (codigo, k, valor, version, dispositivo, actualizado_en)
    values (v_cod, e ->> 'k', e -> 'valor', coalesce((e ->> 'version')::bigint, 0),
            left(coalesce(e ->> 'dispositivo', metas.aparato()), 64), now())
    on conflict (codigo, k) do update
      set valor = excluded.valor, version = excluded.version,
          dispositivo = excluded.dispositivo, actualizado_en = now()
      where p_forzar or excluded.version > d.version;
    get diagnostics filas = row_count; n := n + filas;
  end loop;
  return n;
end $$;
grant execute on function metas.blob_leer(), metas.blob_guardar(jsonb, boolean) to authenticated;

-- 1e) Avisos y conducta: nada de docentes vinculados por el camino viejo.
-- Sus avisos, conducta, preguntas, bitácora, controles, fechas de parcial,
-- cuentas claras y recibos ahora salen de la base nueva.
--
-- Primero la FUNCIÓN (metas_guardar_avisos, la única puerta de la app vieja):
-- reconoce al docente por el código y la contraseña con que llama, no por el
-- texto «docente» de cada fila, que la app arma a su gusto («Ana López»,
-- minúsculas…). Para un docente vinculado no escribe nada, lo anota y
-- responde -2: la app vieja trata todo número negativo como rechazo
-- (js/tools/registros-admin.js:12393) y no marca el comunicado como
-- publicado. El orden importa: primero la contraseña (-1 como siempre), así
-- nadie averigua quién está vinculado probando códigos.
create or replace function public.metas_guardar_avisos(p_prof text, p_clave text, filas jsonb)
returns integer language plpgsql security definer set search_path = public, metas, pg_temp as $$
declare v_cod text := metas._codigo_docente(p_prof);
begin
  if not public._metas_docente_ok(p_prof, p_clave) then
    return -1;
  end if;
  if exists (select 1 from metas.cuentas c where c.docente_codigo = v_cod) then
    if metas.freno_ok('avisrech:' || v_cod, 100, interval '1 hour') then
      insert into metas.blob_rechazos (codigo, k, motivo)
      values (v_cod, 'metas_guardar_avisos', 'avisos_migrados');
    end if;
    return -2;
  end if;
  return public._metas_guardar_avisos_v1(p_prof, p_clave, filas);
end $$;
revoke all on function public.metas_guardar_avisos(text, text, jsonb) from public;
grant execute on function public.metas_guardar_avisos(text, text, jsonb) to anon, authenticated;
-- La firma de antes de SUPABASE-SEGURIDAD.sql (sin contraseña), si quedara.
do $$
begin
  if to_regprocedure('public.metas_guardar_avisos(jsonb)') is not null then
    revoke execute on function public.metas_guardar_avisos(jsonb) from public, anon, authenticated;
  end if;
end $$;

-- Después, el disparador, como RESPALDO para lo que no pase por la función
-- (un SQL a mano). Solo tiene la fila: busca el código PROF- en el texto sin
-- importar mayúsculas. No es la defensa principal; la función de arriba sí.
create or replace function public._metas_candado_mensajes()
returns trigger language plpgsql security definer set search_path = public, metas, pg_temp as $$
declare v_cod text := substring(upper(coalesce(new.docente, '')) from 'PROF-[A-Z0-9]+');
begin
  if v_cod is not null and exists (select 1 from metas.cuentas c where c.docente_codigo = v_cod) then
    raise exception 'M.E.T.A.S: actualiza la app. Los avisos y recibos ahora salen de la base nueva.'
      using errcode = 'MT041';
  end if;
  return new;
end $$;
revoke all on function public._metas_candado_mensajes() from public, anon, authenticated, service_role;
create or replace trigger mensajes_docente_candado before insert or update on public.mensajes_docente
  for each row execute function public._metas_candado_mensajes();

-- 1e2) Lecturas viejas del chatbot: sin dinero de docentes vinculados.
-- Desde el paso 1 los recibos y las cuentas de esos docentes salen solo de la
-- base nueva (vf_*). En el archivo quedan copias que ya no se corrigen (un
-- pago anulado en la app nueva seguiría «pagado» aquí), así que no se
-- devuelven. Un dato es de un docente vinculado si la CLAVE de la familia
-- está en su copia inmutable (metas.claves_archivo) o si el texto «docente»
-- trae su código; basta una de las dos. Ante la duda, se oculta el dinero:
-- es mejor que una familia no vea un recibo viejo a que vea uno falso.
create or replace function metas._archivo_de_vinculado(p_clave text, p_docente text)
returns boolean language sql stable security definer set search_path = metas, pg_temp as $$
  select exists (select 1 from metas.claves_archivo a
                   join metas.cuentas c on c.docente_codigo = a.docente_codigo
                  where a.clave = metas.norm_clave(p_clave))
      or exists (select 1 from metas.cuentas c
                  where c.docente_codigo = substring(upper(coalesce(p_docente, '')) from 'PROF-[A-Z0-9]+'))
$$;
revoke all on function metas._archivo_de_vinculado(text, text) from public, anon, authenticated;

-- Misma firma y mismas columnas que la vieja (padres.html:544 no cambia).
create or replace function public.metas_consultar_admin_padre(p_codigo text)
returns table (tipo text, fecha date, estado text, parcial text, materia text, nota numeric,
               concepto text, monto numeric, grado text, seccion text, docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  select v.* from public._metas_consultar_admin_padre_v1(p_codigo) v
   where not (v.tipo = 'economia' and metas._archivo_de_vinculado(p_codigo, v.docente));
end $$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

-- «cuentas» = cuentas claras (AVC-) y recibos (AVR-); se mira también el
-- prefijo por si una fila vieja tuviera otro subtipo.
create or replace function public.metas_consultar_avisos_padre(p_codigo text)
returns table (evento_id text, subtipo text, prioridad text, titulo text, texto text,
               pregunta text, claves text, fecha_evento date, vigente_hasta date,
               docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  select v.* from public._metas_consultar_avisos_padre_v1(p_codigo) v
   where not ((v.subtipo = 'cuentas' or v.evento_id like 'AVR-%' or v.evento_id like 'AVC-%')
              and metas._archivo_de_vinculado(p_codigo, v.docente));
end $$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

-- 1f) registro_admin: no se escribe. Se deja BORRAR (y archivar el borrado en
-- su historial) porque metas_cerrar_familias lo hace en el cierre de año:
-- borra los datos de las claves viejas para que una tira del año pasado no
-- muestre nada de un niño de este año.
create or replace function public._metas_registro_congelado()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then return old; end if;
  raise exception 'M.E.T.A.S: % es un archivo congelado (solo se borra en el cierre de año)', tg_table_name
    using errcode = 'MT010';
end $$;
revoke all on function public._metas_registro_congelado(), public._metas_archivo_congelado()
  from public, anon, authenticated, service_role;
create or replace trigger registro_admin_congelada before insert or update or delete on public.registro_admin
  for each row execute function public._metas_registro_congelado();
create or replace trigger registro_admin_congelada_truncate before truncate on public.registro_admin
  for each statement execute function public._metas_archivo_congelado();
-- El historial solo recibe lo que archiva el borrado; no se edita ni se borra.
create or replace trigger registro_admin_historial_congelada before update or delete on public.registro_admin_historial
  for each row execute function public._metas_archivo_congelado();
create or replace trigger registro_admin_historial_congelada_truncate before truncate on public.registro_admin_historial
  for each statement execute function public._metas_archivo_congelado();

-- 1g) Funciones que se cierran.
select public._metas_cerrar_funciones(array[
  'metas_guardar_admin', 'metas_recuperar_admin_docente',
  'metas_docente_historial', 'metas_docente_historial_listar',
  'metas_docente_papelera', 'metas_docente_reset', 'metas_docente_reset_deshacer',
  'metas_consultar_progreso', 'metas_restaurar_codigos'
]);
-- metas_cerrar_familias: SIGUE ABIERTA hasta que «Cerrar el año escolar»
-- (js/tools/registros-admin.js:11235-11338) esté reescrito para la base
-- nueva y haya terminado el cierre de año (paso 4).

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 2 · corte del plan de acción, acumulativos, lecturas y equipos
-- ════════════════════════════════════════════════════════════════════════════
-- create trigger plan_accion_congelada before insert or update or delete on public.plan_accion
--   for each row execute function public._metas_archivo_congelado();
-- select public._metas_cerrar_funciones(array['metas_guardar_plan', 'metas_recuperar_historial']);
-- y se añade 'METAS_PLANACCION_V1' a las llaves bloqueadas de metas._blob_bloqueado.

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 3 · último corte (ya nada vive en el blob)
-- ════════════════════════════════════════════════════════════════════════════
-- create trigger docente_estado_congelada before insert or update or delete on public.docente_estado
--   for each row execute function public._metas_archivo_congelado();
--   (igual para docente_estado_hist, docente_estado_historial, docente_estado_papelera)
-- select public._metas_cerrar_funciones(array['metas_docente_estado_guardar',
--   '_metas_docente_estado_guardar_v1', 'metas_docente_estado_leer']);
-- revoke execute on function metas.blob_leer(), metas.blob_guardar(jsonb, boolean) from authenticated;
-- (metas.claves_archivo ya tiene su copia: congelar el blob no le estorba.)

-- ════════════════════════════════════════════════════════════════════════════
-- PASO 4 · cerrar el archivo a las familias
-- ════════════════════════════════════════════════════════════════════════════
-- Cuándo: cuando todos los docentes estén migrados, o al terminar el primer
-- parcial de 2027, avisando a docentes y familias con DOS SEMANAS de
-- anticipación. Antes, contar quién falta (se corre a mano y se lee):
--
--   -- docentes con datos en el archivo: sin vincular, vinculados sin aula,
--   -- y aulas del archivo que todavía no tienen aula nueva
--   with archivo as (
--     select d.codigo, g ->> 'grado' as grado, g ->> 'seccion' as seccion
--       from public.docente_estado d,
--            jsonb_array_elements(coalesce(metas._json_o_nulo(d.valor ->> 'raw') -> 'grupos', '[]'::jsonb)) g
--      where d.k = 'METAS_ADMIN_V1'
--        and metas._tiene_datos(g -> 'lista')
--   )
--   select count(distinct a.codigo) filter (where c.auth_uid is null)                  as docentes_sin_vincular,
--          count(distinct a.codigo) filter (where c.auth_uid is not null
--             and not exists (select 1 from metas.aulas x where x.owner = c.auth_uid and x.deleted_at is null))
--                                                                                       as docentes_vinculados_sin_aula,
--          count(*) filter (where not exists (
--             select 1 from metas.aulas x
--              where x.owner = c.auth_uid and x.deleted_at is null
--                and x.grado::text = regexp_replace(coalesce(a.grado, ''), '\D', '', 'g')
--                and upper(x.seccion) = upper(regexp_replace(coalesce(a.seccion, ''), '.*?([0-9A-Za-z])\s*$', '\1'))))
--                                                                                       as aulas_sin_migrar
--     from archivo a left join metas.cuentas c on c.docente_codigo = a.codigo;
--
-- Las claves viejas de familia VENCEN en esa misma fecha (decisión de Josué,
-- rev. 4). Al dar el aviso de dos semanas se fija la fecha; desde ese momento
-- «Mi aula» le muestra al docente las tiras nuevas por imprimir
-- (metas.familias_preparar_claves_nuevas) y la tira nueva ya sirve:
--
--   insert into metas.hitos (nombre, at)
--   values ('claves_viejas_vencen', '2027-04-30 00:00:00-06')   -- la fecha avisada
--   on conflict (nombre) do nothing;
--
--   -- cuántas familias tienen todavía solo la clave vieja (se lee antes de la fecha)
--   select count(*) from metas.familias
--    where deleted_at is null and clave_origen = 'conservada' and clave_siguiente is null;
--
-- Y entonces:
-- select public._metas_cerrar_funciones(array['metas_consultar_admin_padre',
--   'metas_consultar_avisos_padre', 'metas_consultar_plan_padre',
--   'metas_guardar_avisos', 'metas_cerrar_familias']);
--   (las _v1 que envuelven ya están cerradas desde el paso 1)
-- create trigger mensajes_docente_congelada before insert or update on public.mensajes_docente
--   for each row execute function public._metas_archivo_congelado();
-- y, si ya tienen reemplazo publicado:
-- select public._metas_cerrar_funciones(array['metas_buzon_docente', 'metas_avisos_vistos']);

-- ════════════════════════════════════════════════════════════════════════════
-- Comprobaciones del paso 1 (las automatiza la capa A: pruebas-capa-a/)
-- ════════════════════════════════════════════════════════════════════════════
-- a) Siguen ejecutables por anon: metas_guardar, metas_guardar_progreso,
--    metas_consultar_admin_padre, metas_buzon_docente, metas_cerrar_familias,
--    metas_docente_estado_guardar.
-- b) Cerradas: metas_guardar_admin (todas sus firmas), metas_docente_reset_deshacer…
-- c) Docente vinculado: METAS_ADMIN_V1 con «lista», «boleta», «materias»,
--    «logo», «edadCorte» u «obsGrado» → -2 y una fila en metas.blob_rechazos;
--    METAS_PLANACCION_V1 → se guarda. metas_guardar_avisos con su código (en
--    minúsculas o con espacios) → -2 y anotado, sin escribir nada.
-- c2) Familia de un docente vinculado: metas_consultar_admin_padre y
--    metas_consultar_avisos_padre no traen pagos, cuentas ni recibos.
-- d) Docente sin vincular: todo como hoy.
-- e) metas_cerrar_familias sigue borrando de registro_admin y archiva el borrado.
--
-- Archivos .sql viejos que resucitarían lo cerrado: se les antepone
--    do $$ begin raise exception 'Archivo congelado: ver docs/rediseno-datos'; end $$;
-- con el paso 1: SUPABASE-FASE3.sql, SUPABASE-AVISOS.sql, SUPABASE-REGISTROS-ADMIN.sql,
-- SUPABASE-HISTORIAL-RECUPERACION.sql, SUPABASE-DOCENTE-PAPELERA.sql,
-- SUPABASE-DOCENTE-HISTORIAL.sql, SUPABASE-HISTORIAL-MES.sql, CONSULTA-PAGOS-PERDIDOS.sql,
-- SUPABASE-DOCENTE-ESTADO.sql (re-crearía metas_docente_estado_guardar sin candado);
-- con el paso 2: SUPABASE-PLAN-ACCION.sql, SUPABASE-PLAN-PARCIAL.sql, SUPABASE-PLAN-FECHA.sql.
-- ── Cierre de permisos ──────────────────────────────────────────────────────
-- «alter default privileges … in schema metas revoke … from public» NO quita
-- el EXECUTE que PostgreSQL da a PUBLIC (un permiso global no se quita por
-- esquema; lo comprobó la capa A). Por eso, al final de cada archivo, se
-- quita a mano de TODAS las funciones de metas. Las que la app necesita ya
-- tienen su GRANT explícito a authenticated, service_role o al rol lector,
-- que no depende de PUBLIC.
revoke execute on all functions in schema metas from public;

-- ============================================================================
