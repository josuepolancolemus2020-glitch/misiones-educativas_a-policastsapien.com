-- ============================================================================
-- M.E.T.A.S · Claves viejas de familia, solo si el docente ya está vinculado
-- ----------------------------------------------------------------------------
-- Se pega en el SQL Editor DESPUÉS de SUPABASE-V2-CONGELAR.sql (paso 1).
-- Se puede pegar dos veces: la segunda no cambia nada y no falla.
-- Va en una transacción: o se cambian las tres lecturas, o no se toca nada.
--
-- Por qué: el paso 4 de CONGELAR cierra el portal viejo para TODOS los
-- docentes. Hoy hay docentes con datos en el archivo que todavía no están
-- vinculados. Este archivo no es ese cierre. Solo deja de mostrar el archivo
-- viejo cuando la clave es de un docente que YA tiene cuenta en la base
-- nueva. El criterio es el mismo del paso 1 (e2), metas._archivo_de_vinculado:
-- la clave está en su copia inmutable (metas.claves_archivo) o el texto
-- «docente» de una fila trae su código PROF-. Ante la duda, no se muestra
-- nada. Quien no está vinculado sigue viendo exactamente lo de hoy, dinero
-- incluido.
--
-- Una clave de un docente vinculado devuelve cero filas. Lo mismo que una
-- clave que no existe: no se dice si existía. La familia del vinculado entra
-- con la tira nueva (familia_notas y las vistas vf_*); eso no se toca.
--
-- Qué reemplaza (create or replace, la misma firma, los mismos permisos):
--   public.metas_consultar_admin_padre(text)
--   public.metas_consultar_avisos_padre(text)
--   public.metas_consultar_plan_padre(text)
-- padres.html consulta el portal viejo solo con esas tres. buzon.html no lee
-- por clave de familia (faro_buzon_* pide folio y teléfono). metas_buzon_docente
-- y metas_avisos_vistos las usa el maestro, no la familia: siguen abiertas.
--
-- Qué NO hace: no borra ni modifica filas. No cierra metas_cerrar_familias
-- (el cierre de año sigue), ni metas_guardar, ni metas_guardar_progreso, ni
-- metas_mensaje_padre, ni metas_aviso_visto, ni nada de cuentas.
--
-- Orden, el día de pegarlo:
--   1) Respaldo (el bloque de abajo, solo, ANTES de este archivo).
--   2) Anotar los conteos del mismo bloque.
--   3) Pegar este archivo entero.
--   4) Leer las comprobaciones del final. Los conteos tienen que coincidir
--      con lo anotado. Si algo no cuadra, pegar
--      SUPABASE-V2-CLAVES-VIEJAS-VINCULADOS-DESHACER.sql (vuelve al paso 1,
--      sin tocar filas).
-- ============================================================================

-- ── 1. RESPALDO (no se ejecuta: está comentado a propósito) ────────────────
-- Descomente SOLO este bloque y córralo ANTES de pegar el resto del archivo.
-- Guarda la definición que hay AHORA (la del paso 1 en admin y avisos, y la
-- del plan tal como está en la nube). La tabla queda en public con RLS y sin
-- permiso para la llave pública: anon no puede leerla.
--
--   create table public._respaldo_20261118_funciones as
--   select n.nspname as esquema,
--          p.proname,
--          p.oid::regprocedure::text as firma,
--          pg_get_functiondef(p.oid) as definicion,
--          has_function_privilege('anon', p.oid, 'execute') as anon_ejecuta,
--          has_function_privilege('authenticated', p.oid, 'execute') as autenticado_ejecuta,
--          has_function_privilege('service_role', p.oid, 'execute') as service_role_ejecuta
--     from pg_proc p
--     join pg_namespace n on n.oid = p.pronamespace
--    where n.nspname = 'public'
--      and p.proname in ('metas_consultar_admin_padre',
--                        'metas_consultar_avisos_padre',
--                        'metas_consultar_plan_padre');
--   alter table public._respaldo_20261118_funciones enable row level security;
--   revoke all on public._respaldo_20261118_funciones from anon, authenticated;
--
--   -- Anote estos números. Después del archivo tienen que ser los mismos:
--   -- este cambio no borra ni reescribe filas.
--   select 'registro_admin' as tabla, count(*) from public.registro_admin
--   union all select 'mensajes_docente', count(*) from public.mensajes_docente
--   union all select 'plan_accion', count(*) from public.plan_accion
--   union all select 'mensajes_padre', count(*) from public.mensajes_padre
--   union all select 'aviso_visto', count(*) from public.aviso_visto;
--
-- Comprobar el respaldo: select proname, firma from public._respaldo_20261118_funciones;
-- Tienen que salir las tres. Para volver a ESA definición exacta (en vez del
-- archivo DESHACER, que restaura el paso 1 conocido) se ejecuta cada
-- «definicion» y se reponen los GRANT anotados en las tres columnas *_ejecuta.

begin;

-- ── 2. El paso 1 tiene que estar, y las firmas tienen que ser las de hoy ──
-- Si algo no coincide, se detiene antes de renombrar: la transacción no
-- deja una envoltura a medias.
do $$
declare
  par record;
  v_cols text;
begin
  if to_regprocedure('public._metas_consultar_admin_padre_v1(text)') is null
     or to_regprocedure('public._metas_consultar_avisos_padre_v1(text)') is null
     or to_regprocedure('metas._archivo_de_vinculado(text,text)') is null then
    raise exception 'M.E.T.A.S: falta el paso 1 (SUPABASE-V2-CONGELAR.sql). Este archivo se pega después; no se cambió nada.';
  end if;
  if to_regprocedure('public.metas_consultar_plan_padre(text)') is null then
    raise exception 'M.E.T.A.S: no está public.metas_consultar_plan_padre(text). No se cambió nada.';
  end if;

  for par in
    select * from (values
      ('public.metas_consultar_admin_padre(text)',
       'text,date,text,text,text,numeric,text,numeric,text,text,text,timestamp with time zone'),
      ('public.metas_consultar_avisos_padre(text)',
       'text,text,text,text,text,text,text,date,date,text,timestamp with time zone'),
      ('public.metas_consultar_plan_padre(text)',
       'text,text,text,text,date,numeric,numeric,boolean,text,text,text,text,text,timestamp with time zone')
    ) as t(firma, columnas)
  loop
    -- proallargtypes (oid) y proargmodes ("char") no se pueden unnest
    -- juntos: PostgreSQL pide el mismo tipo en unnest de varios arreglos.
    select string_agg(format_type(p.proallargtypes[i], null), ',' order by i)
      into v_cols
      from pg_proc p
      cross join lateral generate_series(1, array_length(p.proallargtypes, 1)) as i
     where p.oid = to_regprocedure(par.firma)
       and p.proargmodes[i] = 't';
    if v_cols is distinct from par.columnas then
      raise exception 'M.E.T.A.S: % devuelve «%» y este archivo espera «%». No se cambió nada.',
        par.firma, coalesce(v_cols, '(sin columnas)'), par.columnas;
    end if;
  end loop;

  -- El plan no lo envolvió el paso 1. La primera vez se guarda la función
  -- actual con otro nombre; si este archivo se pega otra vez, ese nombre ya
  -- existe y la que está en público es nuestra envoltura: renombrarla la
  -- haría llamarse a sí misma.
  if to_regprocedure('public._metas_consultar_plan_padre_v1(text)') is null then
    alter function public.metas_consultar_plan_padre(text) rename to _metas_consultar_plan_padre_v1;
    raise notice 'plan de acción viejo guardado como _metas_consultar_plan_padre_v1';
  end if;
end $$;

-- La original solo la llama la envoltura. Igual que el paso 1 con admin y avisos.
revoke all on function public._metas_consultar_plan_padre_v1(text)
  from public, anon, authenticated, service_role;

-- ── 3. Las tres lecturas ───────────────────────────────────────────────────
-- Cero filas si la clave es de un docente vinculado (el mismo criterio del
-- paso 1). Si no, se devuelve lo que ya devolvía la lectura anterior.
-- Se lee una sola vez: el candado de velocidad (metas_rate_ok, dentro de la
-- función vieja) cuenta un intento, igual que con una clave que no existe.
-- Si alguna fila es de un vinculado, no se devuelve ninguna: silencio total,
-- no una lista a la que le faltan pedazos.

create or replace function public.metas_consultar_admin_padre(p_codigo text)
returns table (tipo text, fecha date, estado text, parcial text, materia text, nota numeric,
               concepto text, monto numeric, grado text, seccion text, docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  with filas as (
    select * from public._metas_consultar_admin_padre_v1(p_codigo)
  )
  select filas.* from filas
   where not exists (
     select 1 from filas f
      where metas._archivo_de_vinculado(p_codigo, f.docente)
   );
end $$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

create or replace function public.metas_consultar_avisos_padre(p_codigo text)
returns table (evento_id text, subtipo text, prioridad text, titulo text, texto text,
               pregunta text, claves text, fecha_evento date, vigente_hasta date,
               docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  with filas as (
    select * from public._metas_consultar_avisos_padre_v1(p_codigo)
  )
  select filas.* from filas
   where not exists (
     select 1 from filas f
      where metas._archivo_de_vinculado(p_codigo, f.docente)
   );
end $$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

create or replace function public.metas_consultar_plan_padre(p_codigo text)
returns table (
  evaluacion text, forma text, tipo text, parcial text, fecha_prueba date,
  nota numeric, base numeric, nsp boolean,
  categoria text, mensaje text,
  docente text, grado text, seccion text, fecha timestamptz
)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  with filas as (
    select * from public._metas_consultar_plan_padre_v1(p_codigo)
  )
  select filas.* from filas
   where not exists (
     select 1 from filas f
      where metas._archivo_de_vinculado(p_codigo, f.docente)
   );
end $$;
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text) to anon, authenticated;

commit;

-- ── 4. Comprobación (solo lectura) ─────────────────────────────────────────
-- No imprime claves ni nombres. Si una consulta no trae fila, es que no había
-- un ejemplo de ese caso (no es un error). Lo que tiene que verse:
--
--   a) Vinculado con filas en el archivo: portal_admin, portal_avisos y
--      portal_plan en 0. archivo_admin puede ser mayor que 0 (las filas siguen).
--   b) Sin vincular: portal_admin = archivo_admin, y los dos mayores que 0
--      si esa clave tiene registros.
--   c) anon sigue pudiendo llamar las tres lecturas y el cierre de año.
--      Las funciones internas (_v1) no.
--   d) Los conteos de tablas son los que anotó en el respaldo.

-- a) Una clave de la copia de un docente ya vinculado.
with muestra as (
  select a.clave
    from metas.claves_archivo a
    join metas.cuentas c on c.docente_codigo = a.docente_codigo
   where exists (select 1 from public.registro_admin r where r.codigo = a.clave)
   limit 1
)
select (select count(*) from public.metas_consultar_admin_padre(m.clave))  as portal_admin,
       (select count(*) from public.metas_consultar_avisos_padre(m.clave)) as portal_avisos,
       (select count(*) from public.metas_consultar_plan_padre(m.clave))   as portal_plan,
       (select count(*) from public._metas_consultar_admin_padre_v1(m.clave)) as archivo_admin
  from muestra m;

-- b) Una clave de la copia de un docente que todavía no se vincula.
with muestra as (
  select a.clave
    from metas.claves_archivo a
   where not exists (
           select 1 from metas.cuentas c where c.docente_codigo = a.docente_codigo)
     and exists (select 1 from public.registro_admin r where r.codigo = a.clave)
   limit 1
)
select (select count(*) from public.metas_consultar_admin_padre(m.clave)) as portal_admin,
       (select count(*) from public._metas_consultar_admin_padre_v1(m.clave)) as archivo_admin
  from muestra m;

-- c) Siguen abiertas para la familia y para el cierre de año. Las internas, no.
select p.proname,
       has_function_privilege('anon', p.oid, 'execute') as anon_puede
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public'
   and p.proname in ('metas_consultar_admin_padre', 'metas_consultar_avisos_padre',
                     'metas_consultar_plan_padre', 'metas_cerrar_familias',
                     'metas_guardar', 'metas_guardar_progreso',
                     'metas_mensaje_padre', 'metas_aviso_visto',
                     'metas_buzon_docente')
 order by p.proname;

select p.proname as interna_cerrada,
       has_function_privilege('anon', p.oid, 'execute') as anon_puede
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public'
   and p.proname in ('_metas_consultar_admin_padre_v1',
                     '_metas_consultar_avisos_padre_v1',
                     '_metas_consultar_plan_padre_v1')
 order by p.proname;

-- d) Conteos. Compárelos con los del respaldo: tienen que ser iguales.
select 'registro_admin' as tabla, count(*) from public.registro_admin
union all select 'mensajes_docente', count(*) from public.mensajes_docente
union all select 'plan_accion', count(*) from public.plan_accion
union all select 'mensajes_padre', count(*) from public.mensajes_padre
union all select 'aviso_visto', count(*) from public.aviso_visto
order by 1;
