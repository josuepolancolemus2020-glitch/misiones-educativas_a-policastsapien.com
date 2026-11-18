-- ============================================================================
-- Capa A · DESHACER el perfil del centro.
-- Corre después de SUPABASE-V2-PERFIL-CENTRO-DESHACER.sql (dos veces).
-- Las aulas y los alumnos ficticios siguen. El vínculo ya no está.
-- ============================================================================
\set QUIET on
\o /dev/null
select coalesce(max(n), 0) as desde from prueba.resultados \gset
select set_config('vuelta.desde', :'desde', false);

select prueba.ok(to_regclass('metas.centros') is null, 'PCD ya no está la tabla de centros');
select prueba.ok(
  not exists (select 1 from information_schema.columns
               where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id')
  and not exists (select 1 from pg_constraint where conname = 'aulas_centro_fk'),
  'PCD el aula ya no apunta a un centro');
select prueba.ok(
  exists (select 1 from metas.aulas where id = '00000000-0000-0000-0000-0000000a0001' and escuela = 'Escuela Ficticia Las Flores')
  and exists (select 1 from metas.alumnos where id = '00000000-0000-0000-0000-0000000b0001')
  and (select count(*) from metas.alumnos where aula_id = '00000000-0000-0000-0000-0000000a0001') >= 7,
  'PCD las aulas y los alumnos ficticios siguen igual');
select prueba.ok(
  not has_table_privilege('anon', 'metas.aulas', 'select'),
  'PCD anon sigue sin leer las aulas');

\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados where n > :desde order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t
    from prueba.resultados where n > current_setting('vuelta.desde')::int;
  if f > 0 then raise exception '% de % pruebas de deshacer el centro FALLARON', f, t; end if;
  raise notice '✅ Las % pruebas de deshacer el centro en verde', t;
end $$;
