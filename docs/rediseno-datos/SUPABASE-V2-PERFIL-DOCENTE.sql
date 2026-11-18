-- ============================================================================
-- M.E.T.A.S · Nombre del maestro en el perfil del centro
-- ----------------------------------------------------------------------------
-- Se pega en el SQL Editor DESPUÉS de SUPABASE-V2-PERFIL-CENTRO.sql.
-- Se puede pegar dos veces: la segunda no cambia nada y no falla.
-- Va en una transacción: o queda la columna, o no se toca nada.
--
-- No borra filas ni reescribe centros. La columna nace vacía. El nombre
-- que el grupo ya tenía en metas.aulas.docente_nombre sigue ahí.
--
-- Orden, el día de pegarlo:
--   1) Pegar este archivo entero.
--   2) Leer la comprobación del final. Tiene que decir sí.
-- ============================================================================

begin;

alter table metas.centros add column if not exists docente text;

do $docente$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'centros_docente_largo' and conrelid = 'metas.centros'::regclass
  ) then
    alter table metas.centros
      add constraint centros_docente_largo
      check (docente is null or length(btrim(docente)) between 1 and 120);
  end if;
end
$docente$;

notify pgrst, 'reload schema';

commit;

select 'columna docente' as que,
       exists (
         select 1 from information_schema.columns
          where table_schema = 'metas' and table_name = 'centros' and column_name = 'docente'
       ) as si;
