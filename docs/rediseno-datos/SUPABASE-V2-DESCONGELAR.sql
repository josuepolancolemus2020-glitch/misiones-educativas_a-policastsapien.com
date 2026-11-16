-- ============================================================================
-- M.E.T.A.S · DESHACER el paso 1 de SUPABASE-V2-CONGELAR.sql
-- ----------------------------------------------------------------------------
-- Para el día de publicar (10-PUBLICAR.md): si el corte 1 sale mal y hay que
-- volver a la app de main, este archivo devuelve el modelo viejo a como
-- estaba ANTES del paso 1, para que la app vieja vuelva a guardar el aula
-- entera en el blob con la contraseña, como siempre.
--
-- Qué hace (lo contrario de cada letra del paso 1):
--   b) quita el candado del blob (disparador docente_estado_candado);
--   c) devuelve su nombre a la función vieja de guardar el blob y a la de
--      avisos (los _v1), y borra las envolturas que respondían -2;
--   d) borra metas.blob_leer y metas.blob_guardar (la app vieja no los usa);
--   e) quita el candado de mensajes_docente;
--   e2) devuelve su nombre a las lecturas viejas del chatbot (_v1): las
--      familias vuelven a ver pagos y recibos del archivo;
--   f) registro_admin se vuelve a escribir (quita sus cuatro disparadores);
--   g) repone los permisos de las funciones cerradas que la app de main SÍ
--      llama, todas con contraseña del docente (ver «Lo que NO se repone»);
--   a) borra el hito «paso1», para que un CONGELAR posterior vuelva a tomar
--      la copia de claves con lo que cambie mientras tanto.
--
-- Lo que NO se toca, a propósito:
--   · metas.claves_archivo: es de solo inserción (no se puede borrar) y no
--     estorba a la app vieja. Si se vuelve a congelar, se le suman las
--     claves nuevas; las que ya tenía siguen.
--   · metas.blob_rechazos: es la lista de intentos de apps viejas; sirve
--     para saber a quién escribirle. No frena nada.
--   · La base nueva (metas.*), las cuentas vinculadas y lo que los docentes
--     anotaron en ella: no se borra nada. Si se vuelve a publicar el corte 1,
--     cada docente encuentra su aula nueva como la dejó.
--
-- Lo que NO se repone (se queda cerrado aunque antes estuviera abierto):
--   · las firmas SIN contraseña de las funciones que el paso 1 cerró
--     (metas_guardar_admin(jsonb), metas_guardar_avisos(jsonb)) y
--     metas_consultar_progreso(p_clave): la auditoría de 2026-09 las marcó
--     como abiertas a cualquiera, y la app de main no las llama;
--   · metas_restaurar_codigos se repone solo a «authenticated»: la llama el
--     panel con la sesión del administrador, nunca anon.
--
-- Solo deshace el PASO 1. Si ya se corrió el paso 2 o 3, se detiene sin
-- cambiar nada: esos pasos tienen su propia vuelta atrás, todavía sin escribir.
--
-- Se puede correr dos veces: la segunda no encuentra nada que deshacer y no
-- falla. Va entero en una transacción: o se deshace todo o no se toca nada.
-- Comprobarlo: al final se lee una tabla de «quedó así»; cada fila dice ✓.
-- ============================================================================
begin;

-- ── 0. Solo el paso 1 ──────────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from pg_trigger
              where not tgisinternal
                and tgname in ('plan_accion_congelada', 'docente_estado_congelada',
                               'docente_estado_hist_congelada', 'docente_estado_historial_congelada',
                               'docente_estado_papelera_congelada', 'mensajes_docente_congelada')) then
    raise exception 'M.E.T.A.S: ya se corrió el paso 2, 3 o 4 de CONGELAR. Este archivo solo deshace el paso 1; no se cambió nada.';
  end if;
end $$;

-- ── b, e, f) Los disparadores del paso 1 ───────────────────────────────────
drop trigger if exists docente_estado_candado on public.docente_estado;
drop trigger if exists mensajes_docente_candado on public.mensajes_docente;
drop trigger if exists registro_admin_congelada on public.registro_admin;
drop trigger if exists registro_admin_congelada_truncate on public.registro_admin;
drop trigger if exists registro_admin_historial_congelada on public.registro_admin_historial;
drop trigger if exists registro_admin_historial_congelada_truncate on public.registro_admin_historial;

-- ── c, e2) Las cuatro funciones envueltas vuelven a su nombre ──────────────
-- Solo si el _v1 todavía existe: en la segunda corrida ya no está, y borrar
-- la función con el nombre bueno sería borrar la ORIGINAL.
do $$
declare
  par record;
begin
  for par in select * from (values
      ('metas_docente_estado_guardar', '_metas_docente_estado_guardar_v1', '(text, text, jsonb, boolean)'),
      ('metas_guardar_avisos',         '_metas_guardar_avisos_v1',         '(text, text, jsonb)'),
      ('metas_consultar_admin_padre',  '_metas_consultar_admin_padre_v1',  '(text)'),
      ('metas_consultar_avisos_padre', '_metas_consultar_avisos_padre_v1', '(text)')
    ) as t(nombre, v1, args)
  loop
    if to_regprocedure('public.' || par.v1 || par.args) is not null then
      execute format('drop function if exists public.%I%s', par.nombre, par.args);
      execute format('alter function public.%I%s rename to %I', par.v1, par.args, par.nombre);
      raise notice 'vuelve a su nombre: public.%', par.nombre;
    end if;
    -- La app vieja las llama con la llave pública (anon) o con sesión.
    execute format('revoke all on function public.%I%s from public', par.nombre, par.args);
    execute format('grant execute on function public.%I%s to anon, authenticated, service_role', par.nombre, par.args);
  end loop;
end $$;

-- ── d) El blob por sesión: la app vieja no lo usa ──────────────────────────
drop function if exists metas.blob_leer();
drop function if exists metas.blob_guardar(jsonb, boolean);

-- ── Las funciones que solo existían para los candados ──────────────────────
drop function if exists public._metas_candado_blob();
drop function if exists public._metas_candado_mensajes();
drop function if exists public._metas_registro_congelado();
drop function if exists public._metas_archivo_congelado();
drop function if exists metas._blob_bloqueado(text, text, text);
drop function if exists metas._archivo_de_vinculado(text, text);
drop function if exists metas._tiene_datos(jsonb);
drop function if exists metas._codigo_docente(text);

-- ── g) Permisos de las funciones cerradas ──────────────────────────────────
-- Se reabre cada firma que pide la contraseña del docente (un argumento
-- p_clave junto a p_codigo o p_prof): son las que llama la app de main.
-- Las firmas sin contraseña se quedan cerradas (ver arriba).
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as firma
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in ('metas_guardar_admin', 'metas_recuperar_admin_docente',
                         'metas_docente_historial', 'metas_docente_historial_listar',
                         'metas_docente_papelera', 'metas_docente_reset', 'metas_docente_reset_deshacer')
       and 'p_clave' = any (coalesce(p.proargnames, '{}'))
       and coalesce(p.proargnames, '{}') && array['p_codigo', 'p_prof']
  loop
    execute format('grant execute on function %s to anon, authenticated, service_role', f.firma);
    raise notice 'función abierta otra vez: %', f.firma;
  end loop;
  for f in
    select p.oid::regprocedure as firma
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'metas_restaurar_codigos'
  loop
    execute format('grant execute on function %s to authenticated, service_role', f.firma);
    raise notice 'función abierta otra vez (solo con sesión): %', f.firma;
  end loop;
end $$;

drop function if exists public._metas_cerrar_funciones(text[]);

-- ── a) El hito del paso 1 ──────────────────────────────────────────────────
delete from metas.hitos where nombre = 'paso1';

-- ── Comprobación: si algo quedó a medias, no se confirma nada ──────────────
do $$
declare
  malos text;
begin
  select string_agg(x, ', ') into malos from (
    select tgrelid::regclass || '.' || tgname as x from pg_trigger
     where not tgisinternal
       and tgname in ('docente_estado_candado', 'mensajes_docente_candado', 'registro_admin_congelada',
                      'registro_admin_congelada_truncate', 'registro_admin_historial_congelada',
                      'registro_admin_historial_congelada_truncate')
    union all
    select p.oid::regprocedure::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where (n.nspname = 'public' and p.proname in ('_metas_docente_estado_guardar_v1', '_metas_guardar_avisos_v1',
                                                   '_metas_consultar_admin_padre_v1', '_metas_consultar_avisos_padre_v1',
                                                   '_metas_candado_blob', '_metas_candado_mensajes',
                                                   '_metas_registro_congelado', '_metas_archivo_congelado',
                                                   '_metas_cerrar_funciones'))
        or (n.nspname = 'metas' and p.proname in ('blob_leer', 'blob_guardar', '_blob_bloqueado',
                                                  '_archivo_de_vinculado', '_tiene_datos', '_codigo_docente'))
    union all
    select 'falta public.' || x from unnest(array['metas_docente_estado_guardar(text,text,jsonb,boolean)',
                                                  'metas_guardar_avisos(text,text,jsonb)',
                                                  'metas_consultar_admin_padre(text)',
                                                  'metas_consultar_avisos_padre(text)']) x
     where to_regprocedure('public.' || x) is null
        or not has_function_privilege('anon', to_regprocedure('public.' || x), 'execute')
  ) t;
  if malos is not null then
    raise exception 'M.E.T.A.S: DESCONGELAR quedó a medias (%); no se cambió nada.', malos;
  end if;
end $$;

commit;

-- ── Quedó así (se lee; cada fila debe decir ✓) ─────────────────────────────
select '✓ el blob vuelve a aceptar el aula entera' as comprobacion
 where not exists (select 1 from pg_trigger where tgname = 'docente_estado_candado')
union all
select '✓ la app vieja guarda con su contraseña (metas_docente_estado_guardar, anon)'
 where has_function_privilege('anon', 'public.metas_docente_estado_guardar(text,text,jsonb,boolean)', 'execute')
union all
select '✓ los avisos y recibos vuelven a publicarse (metas_guardar_avisos, anon)'
 where has_function_privilege('anon', 'public.metas_guardar_avisos(text,text,jsonb)', 'execute')
   and not exists (select 1 from pg_trigger where tgname = 'mensajes_docente_candado')
union all
select '✓ registro_admin se vuelve a escribir'
 where not exists (select 1 from pg_trigger where tgname like 'registro_admin%congelada%')
union all
select '✓ sin blob por sesión (metas.blob_leer / blob_guardar)'
 where to_regprocedure('metas.blob_guardar(jsonb,boolean)') is null
union all
select '✓ sin hito paso1 (un CONGELAR posterior vuelve a tomar la copia de claves)'
 where not exists (select 1 from metas.hitos where nombre = 'paso1');
