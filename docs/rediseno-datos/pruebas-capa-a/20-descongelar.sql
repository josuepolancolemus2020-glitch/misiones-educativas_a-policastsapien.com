-- ============================================================================
-- Capa A · DESCONGELAR (ida): después de SUPABASE-V2-DESCONGELAR.sql (dos
-- veces), la base vuelve a ser la de ANTES del paso 1 y la app vieja
-- (main) vuelve a guardar el aula entera con su contraseña.
-- Corre después de 10-pruebas.sql; usa sus ayudas (prueba.ok, prueba.falla).
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);
select foto.tomar('descongelado');

-- Las firmas que DESCONGELAR deja cerradas a propósito (sin contraseña, o
-- solo para el panel): ver la cabecera de SUPABASE-V2-DESCONGELAR.sql.
create temp table cerradas_a_proposito (objeto text);
insert into cerradas_a_proposito values
  ('función public.metas_guardar_admin(jsonb)'),
  ('función public.metas_guardar_avisos(jsonb)'),
  ('función public.metas_consultar_progreso(text)'),
  ('función public.metas_restaurar_codigos(jsonb)');

-- Que la comparación no pase en blanco: las fotos tienen de todo, y la
-- diferencia que SÍ se espera (la firma sin contraseña cerrada) aparece.
select prueba.ok((select count(*) from foto.catalogo where etapa = 'antes' and objeto like 'función %') > 50
                 and (select count(*) from foto.catalogo where etapa = 'congelado' and objeto like 'disparador %')
                     > (select count(*) from foto.catalogo where etapa = 'antes' and objeto like 'disparador %')
                 and exists (select 1 from foto.diferencias('antes', 'congelado') where objeto like '%docente_estado_candado')
                 and exists (select 1 from foto.diferencias('antes', 'descongelado')
                              where objeto = 'función public.metas_guardar_admin(jsonb)'),
                 'D0 las fotos tienen contenido y ven lo que cambia');
select prueba.ok(not exists (select 1 from foto.diferencias('antes', 'descongelado') d
                              where d.objeto not in (select objeto from cerradas_a_proposito)),
                 'D1 fuera de las firmas sin contraseña, el catálogo quedó como antes del paso 1',
                 (select string_agg(d.objeto || ' [' || coalesce(d.en_a, 'no estaba') || ' → ' || coalesce(d.en_b, 'no está') || ']', '; ')
                    from foto.diferencias('antes', 'descongelado') d
                   where d.objeto not in (select objeto from cerradas_a_proposito)));
select prueba.ok(not has_function_privilege('anon', 'public.metas_guardar_admin(jsonb)', 'execute')
                 and not has_function_privilege('anon', 'public.metas_consultar_progreso(text)', 'execute')
                 and not has_function_privilege('anon', 'public.metas_restaurar_codigos(jsonb)', 'execute')
                 and has_function_privilege('authenticated', 'public.metas_restaurar_codigos(jsonb)', 'execute'),
                 'D2 las firmas sin contraseña siguen cerradas; restaurar códigos, solo con sesión');

-- La app vieja de A (vinculada) vuelve a guardar TODO con su contraseña.
set role anon;
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
                   '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"grado\":\"6\",\"seccion\":\"1\",\"lista\":[{\"num\":1,\"nombre\":\"Alumna Ficticia Uno\",\"clave\":\"1K7QM\"}]}]}"},"version":900000},
                     {"k":"METAS_CODIGOS_V1","valor":{"raw":"{\"G:G1\":{\"1\":\"1K7QM\",\"4\":\"4NUEV\"}}"},"version":900000}]') = 2,
                 'D3 la app vieja de una docente vinculada vuelve a guardar la lista y las claves');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-mala', '[]') = -1,
                 'D3 y con la contraseña mala sigue diciendo que no (-1)');
select prueba.ok(public.metas_guardar_avisos('PROF-AAAA000001', 'clave-a',
                   '[{"evento_id":"AVR-D4-1K7QM","codigo":"1K7QM","subtipo":"cuentas","titulo":"Recibo","texto":"L 50.00","vigente_hasta":"2099-01-01","docente":"PROF-AAAA000001"}]') = 1,
                 'D4 los recibos y avisos de la app vieja vuelven a publicarse');
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('1K7QM') where tipo = 'economia') >= 1
                 and (select count(*) from public.metas_consultar_avisos_padre('1K7QM') where evento_id = 'AVR-D4-1K7QM') = 1,
                 'D5 la familia vuelve a ver pagos y recibos del archivo');
select prueba.ok(has_function_privilege('anon', 'public.metas_guardar_admin(text,text,jsonb)', 'execute')
                 and has_function_privilege('anon', 'public.metas_docente_reset_deshacer(text,text,text,text)', 'execute')
                 and has_function_privilege('anon', 'public.metas_recuperar_admin_docente(text,text)', 'execute'),
                 'D7 las funciones con contraseña que usa la app de main vuelven a abrir');
reset role;
select prueba.ok((select count(*) from public.mensajes_docente where evento_id = 'AVR-D4-1K7QM') = 1,
                 'D4 y el recibo quedó en mensajes_docente');
insert into public.registro_admin (evento_id, codigo, tipo, estado, monto, docente)
values ('ADE-D6-1K7QM', '1K7QM', 'economia', 'pago', 10, 'PROF-AAAA000001');
select prueba.ok((select count(*) from public.registro_admin where evento_id = 'ADE-D6-1K7QM') = 1,
                 'D6 registro_admin se vuelve a escribir');
select prueba.ok(to_regprocedure('metas.blob_guardar(jsonb,boolean)') is null
                 and to_regprocedure('metas.blob_leer()') is null,
                 'D8 sin blob por sesión');
select prueba.ok(not exists (select 1 from metas.hitos where nombre = 'paso1')
                 and (select count(*) from metas.claves_archivo) > 0,
                 'D9 sin hito paso1, y la copia de claves se queda');
select prueba.ok((select count(*) from metas.blob_rechazos) > 0, 'D9 la lista de intentos de apps viejas se queda');

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas de DESCONGELAR FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas de DESCONGELAR en verde', t;
end $$;
