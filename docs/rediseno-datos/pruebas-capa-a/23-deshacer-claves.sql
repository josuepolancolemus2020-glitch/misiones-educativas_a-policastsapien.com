-- ============================================================================
-- Capa A · DESHACER las claves viejas devuelve el paso 1.
-- Corre después de SUPABASE-V2-CLAVES-VIEJAS-VINCULADOS-DESHACER.sql.
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);

select prueba.ok(to_regprocedure('public._metas_consultar_plan_padre_v1(text)') is null,
                 'CD el plan vuelve a su función de antes, sin envoltura');
select prueba.ok(
  (select prosrc like '%tipo = ''economia''%'
     and prosrc not like '%not exists%'
     from pg_proc where oid = 'public.metas_consultar_admin_padre(text)'::regprocedure)
  and (select prosrc like '%AVR-%'
         and prosrc not like '%not exists%'
         from pg_proc where oid = 'public.metas_consultar_avisos_padre(text)'::regprocedure)
  and (select prosrc not like '%_archivo_de_vinculado%'
         from pg_proc where oid = 'public.metas_consultar_plan_padre(text)'::regprocedure),
  'CD admin y avisos son otra vez los del paso 1, y el plan ya no mira si está vinculado');

set role anon;
select prueba.ok(
  (select count(*) filter (where tipo = 'economia') = 0
      and count(*) filter (where tipo = 'asistencia') = 1
     from public.metas_consultar_admin_padre('1K7QM'))
  and (select count(*) filter (where subtipo = 'cuentas') = 0
          and count(*) filter (where evento_id = 'AVI-1-1K7QM') = 1
         from public.metas_consultar_avisos_padre('1K7QM'))
  and (select count(*) from public.metas_consultar_plan_padre('1K7QM') where evaluacion = 'Suma ficticia') = 1
  and (select count(*) from public.metas_consultar_plan_padre('8MINU') where evaluacion = 'Multiplicación ficticia') = 1,
  'CD la familia de A vuelve a ver asistencia, aviso y plan; el dinero sigue oculto');
select prueba.ok(
  (select count(*) from public.metas_consultar_admin_padre('7CCCC') where tipo = 'economia' and monto = 30) = 1
  and (select count(*) from public.metas_consultar_avisos_padre('7CCCC') where evento_id = 'AVR-C1-7CCCC') = 1
  and (select count(*) from public.metas_consultar_plan_padre('7CCCC') where evaluacion = 'Resta ficticia') = 1,
  'CD la familia de quien no está vinculado sigue viendo todo');
select prueba.ok(not exists (select 1 from public.metas_consultar_admin_padre('1K7QM') where tipo = 'economia'),
                 'CD y el dinero del archivo de A sigue sin verse, como en el paso 1');
reset role;

select prueba.ok(
  has_function_privilege('anon', 'public.metas_consultar_plan_padre(text)', 'execute')
  and has_function_privilege('service_role', 'public.metas_consultar_plan_padre(text)', 'execute')
  and has_function_privilege('anon', 'public.metas_cerrar_familias(text,text,jsonb)', 'execute'),
  'CD el plan y el cierre de año siguen abiertos');

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t
    from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas de DESHACER claves FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas de DESHACER claves en verde', t;
end $$;
