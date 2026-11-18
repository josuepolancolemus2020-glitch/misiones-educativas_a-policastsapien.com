-- ============================================================================
-- M.E.T.A.S · Deshacer SUPABASE-V2-PERFIL-CENTRO.sql
-- ----------------------------------------------------------------------------
-- Quita metas.centros y el vínculo del aula. Las aulas, los alumnos y el
-- dinero siguen como estaban: solo se va el perfil del centro y la columna
-- centro_id.
--
-- Se puede pegar dos veces. Va en una transacción: o se quita todo, o no
-- se toca nada.
--
-- Si guardó public._respaldo_20261118_perfil_aula, esa foto sigue (no se
-- borra aquí). Las columnas viejas del aula nunca se modificaron.
-- ============================================================================
begin;

do $des$
begin
  if exists (
    select 1
      from pg_publication_rel pr
      join pg_class c on c.oid = pr.prrelid
      join pg_namespace n on n.oid = c.relnamespace
     where pr.prpubid = (select oid from pg_publication where pubname = 'supabase_realtime')
       and n.nspname = 'metas' and c.relname = 'centros'
  ) then
    alter publication supabase_realtime drop table metas.centros;
  end if;
end
$des$;

drop trigger if exists aulas_30_centro on metas.aulas;
alter table if exists metas.aulas drop constraint if exists aulas_centro_fk;
alter table if exists metas.aulas drop column if exists centro_id;
drop table if exists metas.centros;

do $revisa$
begin
  if to_regclass('metas.centros') is not null then
    raise exception 'M.E.T.A.S: metas.centros sigue; no se cambió nada.';
  end if;
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id'
  ) then
    raise exception 'M.E.T.A.S: el aula todavía tiene centro_id; no se cambió nada.';
  end if;
end
$revisa$;

commit;

-- ── Comprobaciones de solo lectura (cada fila debe decir sí) ───────────────
select 'sin tabla centros' as que,
       (to_regclass('metas.centros') is null) as si
union all
select 'el aula ya no tiene centro_id',
       not exists (select 1 from information_schema.columns
                    where table_schema = 'metas' and table_name = 'aulas' and column_name = 'centro_id')
union all
select 'las aulas siguen',
       to_regclass('metas.aulas') is not null
union all
select 'los alumnos siguen',
       to_regclass('metas.alumnos') is not null;
