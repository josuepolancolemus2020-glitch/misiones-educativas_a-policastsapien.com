-- Lo que SUPABASE-AULA.sql y SUPABASE-PAUTA.sql le pusieron a la nube y
-- metas_guardar necesita: el código de aula del maestro y el tipo
-- «pauta_vista».
alter table public.docentes add column if not exists codigo_aula text;
alter table public.resultados drop constraint if exists resultados_tipo_check;
alter table public.resultados add constraint resultados_tipo_check
  check (tipo in ('evaluacion','prueba_operativa','pauta_vista'));

-- Lo que SUPABASE-V2-CONGELAR.sql le hizo a docente_estado en la nube, sin
-- el esquema metas entero: un candado (aquí no frena nada, solo tiene que
-- EXISTIR para ver que el de topes convive con él), la función vieja
-- renombrada a _v1 con su envoltura, y una copia de metas.blob_guardar que
-- recibe el código en vez de sacarlo de la sesión.
create schema if not exists metas;
create or replace function public._metas_candado_blob()
returns trigger language plpgsql as $$ begin return new; end $$;
create or replace trigger docente_estado_candado before insert or update on public.docente_estado
  for each row execute function public._metas_candado_blob();

do $$
begin
  if to_regprocedure('public._metas_docente_estado_guardar_v1(text, text, jsonb, boolean)') is null then
    alter function public.metas_docente_estado_guardar(text, text, jsonb, boolean)
      rename to _metas_docente_estado_guardar_v1;
  end if;
end $$;
create or replace function public.metas_docente_estado_guardar(
  p_codigo text, p_clave text, p_entradas jsonb, p_forzar boolean default false
) returns integer language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  if not public._metas_docente_ok(p_codigo, p_clave) then return -1; end if;
  return public._metas_docente_estado_guardar_v1(p_codigo, p_clave, p_entradas, p_forzar);
end $$;

create or replace function metas.blob_guardar_prueba(v_cod text, p_entradas jsonb, p_forzar boolean default false)
returns integer language plpgsql security definer set search_path = metas, public, pg_temp as $$
declare e jsonb; n int := 0; filas int;
begin
  for e in select * from jsonb_array_elements(p_entradas) loop
    insert into public.docente_estado as d (codigo, k, valor, version, dispositivo, actualizado_en)
    values (v_cod, e ->> 'k', e -> 'valor', coalesce((e ->> 'version')::bigint, 0), 'prueba', now())
    on conflict (codigo, k) do update
      set valor = excluded.valor, version = excluded.version,
          dispositivo = excluded.dispositivo, actualizado_en = now()
      where p_forzar or excluded.version > d.version;
    get diagnostics filas = row_count; n := n + filas;
  end loop;
  return n;
end $$;
