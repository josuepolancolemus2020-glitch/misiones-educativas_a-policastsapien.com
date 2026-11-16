-- ============================================================================
-- Capa A · foto del catálogo, para probar DESCONGELAR de ida y vuelta
-- ----------------------------------------------------------------------------
-- Se toma una foto ANTES de CONGELAR («antes») y otra justo después
-- («congelado»). Después de DESCONGELAR la base tiene que verse como
-- «antes» (salvo lo que DESCONGELAR deja cerrado a propósito), y después de
-- CONGELAR otra vez, como «congelado». Así la vuelta atrás no depende de
-- acordarse de cada objeto: lo que se olvide sale en la comparación.
--
-- Qué entra en la foto (public y metas, sin lo que traen las extensiones):
--   · cada función: su firma, la huella de su código y quién la puede
--     ejecutar de verdad (anon, authenticated, service_role);
--   · cada disparador: su tabla, su nombre y la función que llama.
-- ============================================================================
create schema if not exists foto;
create table if not exists foto.catalogo (
  etapa   text not null,
  objeto  text not null,
  detalle text not null,
  primary key (etapa, objeto)
);

create or replace function foto.tomar(p_etapa text)
returns integer language plpgsql as $$
declare n int;
begin
  delete from foto.catalogo where etapa = p_etapa;
  insert into foto.catalogo (etapa, objeto, detalle)
  select p_etapa, 'función ' || n.nspname || '.' || p.oid::regprocedure::text,
         md5(coalesce(p.prosrc, '')) || ' ejecutan:'
         || case when has_function_privilege('anon', p.oid, 'execute') then ' anon' else '' end
         || case when has_function_privilege('authenticated', p.oid, 'execute') then ' authenticated' else '' end
         || case when has_function_privilege('service_role', p.oid, 'execute') then ' service_role' else '' end
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname in ('public', 'metas')
     and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
  union all
  select p_etapa, 'disparador ' || t.tgrelid::regclass::text || '.' || t.tgname,
         t.tgfoid::regproc::text
    from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace
   where not t.tgisinternal and n.nspname in ('public', 'metas');
  get diagnostics n = row_count;
  return n;
end $$;

-- Lo que cambió entre dos fotos (objeto, cómo estaba en a, cómo está en b).
create or replace function foto.diferencias(p_a text, p_b text)
returns table (objeto text, en_a text, en_b text) language sql stable as $$
  select coalesce(a.objeto, b.objeto), a.detalle, b.detalle
    from (select * from foto.catalogo where etapa = p_a) a
    full join (select * from foto.catalogo where etapa = p_b) b on a.objeto = b.objeto
   where a.detalle is distinct from b.detalle
   order by 1
$$;
