-- ============================================================================
-- Capa A · perfil del centro (datos FICTICIOS).
-- Corre después de SUPABASE-V2-PERFIL-CENTRO.sql (dos veces).
-- El docente A tiene dos aulas en el mismo centro y puede tener otra en
-- otro. B no ve lo de A. anon no entra. No se tocan alumnos ni dinero.
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);

select count(*) as alumnos_antes from metas.alumnos \gset
select count(*) as aulas_antes from metas.aulas \gset

select prueba.ok(
  to_regclass('metas.centros') is not null
  and exists (select 1 from information_schema.columns
               where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id')
  and exists (select 1 from pg_constraint where conname = 'aulas_centro_fk'),
  'PC la tabla y el vínculo aula → centro quedaron, y pegarlo dos veces no lo duplica');

select prueba.ok(
  not has_table_privilege('anon', 'metas.centros', 'select')
  and not has_table_privilege('anon', 'metas.centros', 'insert')
  and not has_table_privilege('anon', 'metas.centros', 'update')
  and not has_table_privilege('anon', 'metas.centros', 'delete')
  and not has_schema_privilege('anon', 'metas', 'usage')
  and has_table_privilege('authenticated', 'metas.centros', 'select')
  and has_table_privilege('authenticated', 'metas.centros', 'insert')
  and has_table_privilege('authenticated', 'metas.centros', 'update')
  and not has_table_privilege('authenticated', 'metas.centros', 'delete'),
  'PC anon no tiene acceso; el docente lee y escribe, y no puede borrar');

select prueba.como('A');
set role authenticated;

insert into metas.centros (id, nombre, direccion, aldea, municipio, departamento, codigo_sace,
                           director, anio_lectivo, modalidad, jornada, logo)
values ('00000000-0000-0000-0000-0000000e0001', 'Centro Ficticio Las Flores', 'Colonia Ficticia',
        'Aldea Ficticia', 'Villanueva', 'Cortés', '000000000000',
        'Directora Ficticia', 2027, 'No aplica', 'Matutina',
        'data:image/jpeg;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=');

-- El aula vacía de la preparación ya está borrada al terminar la capa A.
-- Se crea otra, viva, para ver que dos aulas del mismo centro comparten la fila.
insert into metas.aulas (id, escuela, grado, seccion, anio_lectivo, centro_id)
values ('00000000-0000-0000-0000-0000000a0003', 'Escuela Ficticia Las Flores', 4, '1', 2027,
        '00000000-0000-0000-0000-0000000e0001');
update metas.aulas set centro_id = '00000000-0000-0000-0000-0000000e0001'
 where id = '00000000-0000-0000-0000-0000000a0001';

select prueba.ok(
  (select count(*) from metas.aulas
    where centro_id = '00000000-0000-0000-0000-0000000e0001' and deleted_at is null) = 2
  and (select logo like 'data:image/jpeg;base64,%' from metas.centros
        where id = '00000000-0000-0000-0000-0000000e0001'),
  'PC dos aulas del mismo centro apuntan a una sola fila, y el logo es JPEG');
update metas.aulas set deleted_at = now() where id = '00000000-0000-0000-0000-0000000a0003';

select prueba.falla(
  $$update metas.centros set logo = 'data:image/png;base64,QUJDRA==' where id = '00000000-0000-0000-0000-0000000e0001'$$,
  'PC no se guarda un logo que no sea el JPEG', '23514');

insert into metas.centros (id, nombre, anio_lectivo, municipio)
values ('00000000-0000-0000-0000-0000000e0002', 'Centro Ficticio Los Pinos', 2027, 'San Pedro Sula');

select prueba.ok((select count(*) from metas.centros where deleted_at is null) = 2,
                 'PC el mismo docente puede tener dos centros');

select prueba.falla(
  $$delete from metas.centros where id = '00000000-0000-0000-0000-0000000e0002'$$,
  'PC no hay DELETE físico del centro', '42501');

select prueba.ok((select count(*) from metas.alumnos) = :alumnos_antes,
                 'PC anotar el centro no toca a los alumnos');
reset role;

select prueba.como('B');
set role authenticated;
select prueba.ok((select count(*) from metas.centros) = 0, 'PC B no lee los centros de A');
update metas.centros set nombre = 'Ajeno' where id = '00000000-0000-0000-0000-0000000e0001';
reset role;
select prueba.ok(
  (select nombre from metas.centros where id = '00000000-0000-0000-0000-0000000e0001') = 'Centro Ficticio Las Flores',
  'PC B no escribe el centro de A');
select prueba.como('B');
set role authenticated;
insert into metas.aulas (id, escuela, grado, seccion, anio_lectivo)
values ('00000000-0000-0000-0000-0000000a0099', 'Escuela Ficticia De B', 2, '1', 2027);
select prueba.falla(
  $$update metas.aulas set centro_id = '00000000-0000-0000-0000-0000000e0001' where id = '00000000-0000-0000-0000-0000000a0099'$$,
  'PC el aula de B no puede apuntar al centro de A', 'MT003');
update metas.aulas set deleted_at = now() where id = '00000000-0000-0000-0000-0000000a0099';
reset role;

select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(*) from metas.centros) = 0, 'PC una sesión de familia no lee centros');
reset role;

select prueba.como('nadie');
set role anon;
select prueba.falla($$select * from metas.centros$$, 'PC anon no entra al esquema', '42501');
reset role;

select prueba.ok((select count(*) from metas.alumnos) = :alumnos_antes, 'PC al final los alumnos siguen igual');

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t
    from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas del perfil del centro FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas del perfil del centro en verde', t;
end $$;
