-- ============================================================================
-- Capa A · claves viejas de un docente ya vinculado no muestran nada.
-- Corre después de SUPABASE-V2-CLAVES-VIEJAS-VINCULADOS.sql (dos veces).
-- Datos ficticios. No es el paso 4: quien no está vinculado sigue igual,
-- la clave nueva sigue por familia_notas / vf_*, y el cierre de año abre.
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);

-- Conteos de antes de las lecturas y del cierre, para ver que las lecturas
-- no borran y que el cierre solo toca la clave que se le pide.
select count(*) as reg_1k from public.registro_admin where codigo = '1K7QM' \gset
select count(*) as avi_1k from public.mensajes_docente where codigo = '1K7QM' \gset
select count(*) as reg_antes from public.registro_admin \gset
select count(*) as avi_antes from public.mensajes_docente \gset

-- Plan ficticio. La tabla no está congelada en el paso 1: se puede anotar
-- aquí. 1K7QM está en la copia de A (vinculada) y el texto no trae código.
-- 8MINU no está en la copia: el código va en el texto, en minúsculas.
-- 7CCCC es de C, que no se vincula.
insert into public.plan_accion (evento_id, codigo, evaluacion, tipo, parcial, nota, base, docente, grado, seccion, fecha_analisis)
values
  ('PASB-CV-1K7QM', '1K7QM', 'Suma ficticia', 'formativa', 'I', 80, 100, 'Ana López', '6', '1', now()),
  ('PASB-CV-8MINU', '8MINU', 'Multiplicación ficticia', 'formativa', 'I', 60, 100, 'docente ficticia a · prof-aaaa000001', '6', '1', now()),
  ('PASB-CV-7CCCC', '7CCCC', 'Resta ficticia', 'formativa', 'I', 70, 100, 'Docente Ficticia C · PROF-CCCC000003', '6', '1', now()),
  ('PASB-CV-6CIER', '6CIER', 'Cierre ficticio', 'formativa', 'I', 50, 100, 'Docente Ficticia A · PROF-AAAA000001', '6', '1', now());

select prueba.ok(
  (select count(*) = 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_metas_consultar_plan_padre_v1')
  and (select prosrc like '%_archivo_de_vinculado%'
         from pg_proc where oid = 'public.metas_consultar_admin_padre(text)'::regprocedure)
  and (select prosrc like '%_archivo_de_vinculado%'
         from pg_proc where oid = 'public.metas_consultar_avisos_padre(text)'::regprocedure)
  and (select prosrc like '%_archivo_de_vinculado%'
         from pg_proc where oid = 'public.metas_consultar_plan_padre(text)'::regprocedure),
  'CV el archivo se puede pegar dos veces: una sola envoltura, y las tres callan al vinculado');

-- (a) Vinculado: nada, y el mismo silencio que una clave que no existe.
set role anon;
select prueba.ok(
  (select count(*) from public.metas_consultar_admin_padre('1K7QM')) = 0
  and (select count(*) from public.metas_consultar_admin_padre('1k7 qm')) = 0
  and (select count(*) from public.metas_consultar_avisos_padre('1K7QM')) = 0
  and (select count(*) from public.metas_consultar_plan_padre('1K7QM')) = 0
  and (select count(*) from public.metas_consultar_admin_padre('NOHAY')) = 0
  and (select count(*) from public.metas_consultar_avisos_padre('NOHAY')) = 0
  and (select count(*) from public.metas_consultar_plan_padre('NOHAY')) = 0,
  'CV a clave vieja de A: cero filas en las tres lecturas, igual que una clave que no existe');
select prueba.ok(
  (select count(*) from public.metas_consultar_admin_padre('5NUEVA')) = 0
  and (select count(*) from public.metas_consultar_avisos_padre('5NUEVA')) = 0
  and (select count(*) from public.metas_consultar_plan_padre('5NUEVA')) = 0,
  'CV a quien se vinculó después del paso 1 tampoco muestra nada');
select prueba.ok(
  (select count(*) from public.metas_consultar_admin_padre('8MINU')) = 0
  and (select count(*) from public.metas_consultar_avisos_padre('8MINU')) = 0
  and (select count(*) from public.metas_consultar_plan_padre('8MINU')) = 0,
  'CV a el texto «docente» con el código de A, aunque la clave no esté en la copia, también calla');

-- (b) Sin vincular: lo mismo que la lectura de antes (dinero incluido).
select prueba.ok(
  (select count(*) from public.metas_consultar_admin_padre('7CCCC') where tipo = 'economia' and monto = 30) = 1
  and (select count(*) from public.metas_consultar_avisos_padre('7CCCC') where evento_id = 'AVR-C1-7CCCC') = 1
  and (select count(*) from public.metas_consultar_plan_padre('7CCCC') where evaluacion = 'Resta ficticia') = 1
  and (select count(*) from public.metas_consultar_plan_padre('7c ccc') where evaluacion = 'Resta ficticia') = 1,
  'CV b docente sin vincular: su familia sigue viendo pagos, recibos y el plan');
reset role;

select prueba.ok(
  (select count(*) from public._metas_consultar_admin_padre_v1('1K7QM')) = :reg_1k
  and (select count(*) from public._metas_consultar_avisos_padre_v1('1K7QM')) = :avi_1k
  and (select count(*) from public._metas_consultar_plan_padre_v1('1K7QM')) = 1
  and (select count(*) from public._metas_consultar_admin_padre_v1('8MINU') where tipo = 'economia') = 1
  and (select count(*) from public._metas_consultar_admin_padre_v1('5NUEVA')) = 1,
  'CV a las filas siguen en el archivo: solo dejó de mostrarlas');
set role anon;
select prueba.falla($$select * from public._metas_consultar_admin_padre_v1('1K7QM')$$,
                    'CV la lectura interna de admin no se llama directo', '42501');
select prueba.falla($$select * from public._metas_consultar_avisos_padre_v1('1K7QM')$$,
                    'CV la lectura interna de avisos no se llama directo', '42501');
select prueba.falla($$select * from public._metas_consultar_plan_padre_v1('1K7QM')$$,
                    'CV la lectura interna del plan no se llama directo', '42501');
reset role;
set role service_role;
select prueba.falla($$select * from public._metas_consultar_plan_padre_v1('1K7QM')$$,
                    'CV service_role tampoco lee el plan viejo directo', '42501');
reset role;

-- (c) La clave nueva sigue por la base nueva. padre1 volvió a entrar con la
-- tira nueva (la vieja, en estas pruebas, ya venció por el hito del paso 4).
select prueba.como('padre1');
set role authenticated;
select prueba.ok(
  (select clave_usada ~ '^[A-HJ-NP-Z2-9]{10}$' and clave_usada <> '1K7QM'
     from metas.familia_accesos
    where auth_uid = '00000000-0000-0000-0000-0000000000f1' and revocado_at is null
    limit 1),
  'CV c el teléfono de prueba está con la tira nueva, no con 1K7QM');
select prueba.ok(
  (select count(*) = 2
      and bool_and(valor in ('85.00', '91.50'))
      and bool_and(asignatura in ('Matemáticas', 'Español'))
     from metas.familia_notas((
       select clave_usada from metas.familia_accesos
        where auth_uid = '00000000-0000-0000-0000-0000000000f1' and revocado_at is null
        limit 1))),
  'CV c familia_notas sigue mostrando las notas de esa tira');
select prueba.ok(
  (select count(*) >= 1 from metas.vf_hijos)
  and (select count(*) filter (where componente = 'final' and valor in (85, 91.50)) = 2 from metas.vf_notas)
  and (select count(*) >= 0 from metas.vf_pagos)
  and (select count(*) >= 0 from metas.vf_avisos),
  'CV c las vistas vf_* de la familia siguen abriendo');
reset role;

-- (d) El cierre de año sigue. Primero la contraseña mala no borra nada.
set role anon;
select prueba.ok(public.metas_cerrar_familias('PROF-AAAA000001', 'clave-mala', '["6CIER"]') = -1,
                 'CV d contraseña mala: -1, como siempre');
reset role;
select prueba.ok((select count(*) from public.registro_admin where codigo = '6CIER') = 2,
                 'CV d y con la contraseña mala no se borró nada');
set role anon;
select prueba.ok(public.metas_cerrar_familias('PROF-AAAA000001', 'clave-a', '["6CIER"]') >= 3,
                 'CV d el cierre de año sigue borrando la clave que se le pide');
reset role;
select prueba.ok(
  not exists (select 1 from public.registro_admin where codigo = '6CIER')
  and not exists (select 1 from public.mensajes_docente where codigo = '6CIER')
  and not exists (select 1 from public.plan_accion where codigo = '6CIER')
  and (select count(*) >= 2 from public.registro_admin_historial where codigo = '6CIER'),
  'CV d esa clave salió del archivo y el borrado quedó en el historial');
select prueba.ok(
  (select count(*) from public.registro_admin where codigo = '1K7QM') = :reg_1k
  and (select count(*) from public.mensajes_docente where codigo = '1K7QM') = :avi_1k
  and (select count(*) from public.registro_admin) = :reg_antes - 2
  and (select count(*) from public.mensajes_docente) = :avi_antes - 1,
  'CV las lecturas no borraron filas; el cierre solo quitó las de 6CIER');

select prueba.ok(
  has_function_privilege('anon', 'public.metas_consultar_admin_padre(text)', 'execute')
  and has_function_privilege('anon', 'public.metas_consultar_avisos_padre(text)', 'execute')
  and has_function_privilege('anon', 'public.metas_consultar_plan_padre(text)', 'execute')
  and has_function_privilege('authenticated', 'public.metas_consultar_plan_padre(text)', 'execute')
  and has_function_privilege('anon', 'public.metas_cerrar_familias(text,text,jsonb)', 'execute')
  and has_function_privilege('anon', 'public.metas_guardar(jsonb)', 'execute')
  and has_function_privilege('anon', 'public.metas_guardar_progreso(jsonb)', 'execute')
  and has_function_privilege('anon', 'public.metas_buzon_docente(jsonb)', 'execute')
  and not has_function_privilege('anon', 'public._metas_consultar_plan_padre_v1(text)', 'execute')
  and not has_function_privilege('service_role', 'public._metas_consultar_plan_padre_v1(text)', 'execute'),
  'CV siguen abiertos el portal, el cierre de año, el lado del alumno y el buzón del maestro');

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t
    from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas de claves viejas FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas de claves viejas en verde', t;
end $$;
