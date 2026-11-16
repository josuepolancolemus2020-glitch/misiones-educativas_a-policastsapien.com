-- ============================================================================
-- Capa A · DESCONGELAR (vuelta): después de correr CONGELAR otra vez, la
-- base queda IGUAL que con el primer CONGELAR, con la copia de claves al día.
-- Corre después de 20-descongelar.sql.
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);
select foto.tomar('recongelado');

select prueba.ok(not exists (select 1 from foto.diferencias('congelado', 'recongelado')),
                 'R1 congelado otra vez, el catálogo es el mismo del primer CONGELAR',
                 (select string_agg(d.objeto || ' [' || coalesce(d.en_a, 'no estaba') || ' → ' || coalesce(d.en_b, 'no está') || ']', '; ')
                    from foto.diferencias('congelado', 'recongelado') d));
select prueba.ok((select count(*) from metas.hitos where nombre = 'paso1') = 1, 'R2 el hito paso1 vuelve');
select prueba.ok(exists (select 1 from metas.claves_archivo where docente_codigo = 'PROF-AAAA000001' and clave = '4NUEV')
                 and exists (select 1 from metas.claves_archivo where docente_codigo = 'PROF-AAAA000001' and clave = '1K7QM'),
                 'R2 la copia de claves suma la clave entregada mientras estuvo descongelado y conserva las de antes');

set role anon;
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
                   '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"lista\":[{\"num\":2,\"nombre\":\"Otra\"}]}]}"},"version":900001}]') = -2,
                 'R3 la app vieja vuelve a recibir -2 con la lista');
select prueba.ok(public.metas_guardar_avisos('PROF-AAAA000001', 'clave-a',
                   '[{"evento_id":"AVR-R3-1K7QM","codigo":"1K7QM","subtipo":"cuentas","titulo":"Recibo","texto":"L 5.00","vigente_hasta":"2099-01-01"}]') = -2,
                 'R3 y sus recibos vuelven a recibir -2');
select prueba.ok(not exists (select 1 from public.metas_consultar_admin_padre('1K7QM') where tipo = 'economia'),
                 'R3 la familia de una docente vinculada ya no ve dinero del archivo');
select prueba.ok(not has_function_privilege('anon', 'public.metas_guardar_admin(text,text,jsonb)', 'execute'),
                 'R3 las funciones viejas vuelven a cerrarse');
reset role;
select prueba.falla($$insert into public.registro_admin (evento_id, codigo, tipo) values ('ADA-R4', 'X', 'asistencia')$$,
                    'R4 registro_admin vuelve a ser de solo lectura', 'MT010');
select prueba.como('A');
set role authenticated;
select prueba.ok(metas.blob_guardar('[{"k":"METAS_PLANACCION_V1","valor":{"raw":"{\"analisis\":[2]}"},"version":900002}]') = 1,
                 'R5 el blob por sesión vuelve');
select prueba.falla($$select metas.blob_guardar('[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"gastos\":[{\"monto\":5}]}"},"version":900003}]')$$,
                    'R5 con su candado', 'MT040');
reset role;

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas de CONGELAR otra vez FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas de CONGELAR otra vez en verde', t;
end $$;
