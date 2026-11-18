-- ============================================================================
-- M.E.T.A.S · Deshacer SUPABASE-V2-CLAVES-VIEJAS-VINCULADOS.sql
-- ----------------------------------------------------------------------------
-- Vuelve las tres lecturas del portal viejo a como quedaron en el PASO 1
-- (SUPABASE-V2-CONGELAR.sql): admin y avisos ocultan el dinero de un docente
-- vinculado y siguen mostrando el resto; el plan de acción vuelve a mostrar
-- todo, como antes de envolverlo.
--
-- No borra ni modifica filas. No deshace el paso 1 (para eso está
-- SUPABASE-V2-DESCONGELAR.sql, y solo si este archivo ya se corrió o no hace
-- falta: el paso 1 tiene que seguir aplicado, porque admin y avisos llaman
-- a sus _v1).
--
-- Se puede pegar dos veces. Va en una transacción.
--
-- Si guardó public._respaldo_20261118_funciones y quiere la definición EXACTA
-- que había en la nube (por si el paso 1 de allá no fuera este texto), en vez
-- de este archivo ejecute cada columna «definicion» y reponga los GRANT de
-- las columnas *_ejecuta. pg_get_functiondef no guarda los permisos.
-- ============================================================================
begin;

do $$
begin
  if to_regprocedure('public._metas_consultar_admin_padre_v1(text)') is null
     or to_regprocedure('public._metas_consultar_avisos_padre_v1(text)') is null
     or to_regprocedure('metas._archivo_de_vinculado(text,text)') is null then
    raise exception 'M.E.T.A.S: el paso 1 no está aplicado. Este archivo solo quita el silencio de las claves viejas; no se cambió nada.';
  end if;

  -- El plan solo se renombró si el otro archivo corrió. Si no, se deja.
  if to_regprocedure('public._metas_consultar_plan_padre_v1(text)') is not null then
    drop function if exists public.metas_consultar_plan_padre(text);
    alter function public._metas_consultar_plan_padre_v1(text) rename to metas_consultar_plan_padre;
    raise notice 'el plan de acción vuelve a su función de antes';
  end if;
end $$;

-- Permisos de antes: la llave pública y la sesión. service_role lo trae de
-- fábrica Supabase al crear la función en public; el paso 1 no se lo quita
-- a estas lecturas, así que aquí tampoco.
revoke all on function public.metas_consultar_plan_padre(text) from public;
grant execute on function public.metas_consultar_plan_padre(text)
  to anon, authenticated, service_role;

-- Admin y avisos: el texto del paso 1 (CONGELAR, apartado 1e2). Misma firma.
create or replace function public.metas_consultar_admin_padre(p_codigo text)
returns table (tipo text, fecha date, estado text, parcial text, materia text, nota numeric,
               concepto text, monto numeric, grado text, seccion text, docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  select v.* from public._metas_consultar_admin_padre_v1(p_codigo) v
   where not (v.tipo = 'economia' and metas._archivo_de_vinculado(p_codigo, v.docente));
end $$;
revoke all on function public.metas_consultar_admin_padre(text) from public;
grant execute on function public.metas_consultar_admin_padre(text) to anon, authenticated;

create or replace function public.metas_consultar_avisos_padre(p_codigo text)
returns table (evento_id text, subtipo text, prioridad text, titulo text, texto text,
               pregunta text, claves text, fecha_evento date, vigente_hasta date,
               docente text, actualizado_en timestamptz)
language plpgsql security definer set search_path = public, metas, pg_temp as $$
begin
  return query
  select v.* from public._metas_consultar_avisos_padre_v1(p_codigo) v
   where not ((v.subtipo = 'cuentas' or v.evento_id like 'AVR-%' or v.evento_id like 'AVC-%')
              and metas._archivo_de_vinculado(p_codigo, v.docente));
end $$;
revoke all on function public.metas_consultar_avisos_padre(text) from public;
grant execute on function public.metas_consultar_avisos_padre(text) to anon, authenticated;

commit;

-- Comprobación (solo lectura). Con el paso 1 otra vez:
--   vinculado: portal_admin puede ser mayor que 0 (asistencia, notas) pero
--   sin filas de tipo economia; portal_avisos sin subtipo cuentas.
--   sin vincular: portal_admin = archivo_admin.
--   el plan ya no tiene envoltura _v1.
select to_regprocedure('public._metas_consultar_plan_padre_v1(text)') is null as plan_sin_envoltura;

with muestra as (
  select a.clave
    from metas.claves_archivo a
    join metas.cuentas c on c.docente_codigo = a.docente_codigo
   where exists (select 1 from public.registro_admin r where r.codigo = a.clave)
   limit 1
)
select (select count(*) from public.metas_consultar_admin_padre(m.clave) where tipo = 'economia') as economia_de_vinculado,
       (select count(*) from public.metas_consultar_admin_padre(m.clave) where tipo <> 'economia') as resto_de_vinculado
  from muestra m;
