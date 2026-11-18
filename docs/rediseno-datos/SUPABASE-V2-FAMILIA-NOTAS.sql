-- ============================================================================
-- M.E.T.A.S · Notas que ve la familia (una clave, un niño)
-- ----------------------------------------------------------------------------
-- Se pega en el SQL Editor DESPUÉS de que SUPABASE-V2-FAMILIAS.sql ya esté
-- aplicado. No borra filas, no toca pagos ni recibos, y se puede correr otra
-- vez: solo reemplaza la función.
--
-- Por qué una función y no solo la vista vf_notas: la vista deja ver a todos
-- los niños vinculados a ESE teléfono. Un teléfono con dos claves vería las
-- notas de los dos en la misma respuesta. Aquí la familia manda la clave que
-- acaba de escribir y la base devuelve solo al niño de ESA clave, si la
-- sesión anónima se vinculó con ella y la clave sigue valiendo. Otra clave,
-- la vacía o una sesión sin vínculo devuelven cero filas: el mismo silencio,
-- para no decir si la clave existe.
--
-- La sesión del padre no puede leer metas.notas (la política restrictiva pide
-- una cuenta de docente). Por eso la función es security definer y el filtro
-- va en el WHERE: es la única puerta, no la RLS de quien llama.
--
-- Comprobar, con datos ficticios y una sesión anónima ya vinculada:
--   select asignatura, periodo, valor from metas.familia_notas('CLAVE-DE-PRUEBA');
--   -- solo las notas finales de ese niño, valor como texto («85.00»)
--   select count(*) from metas.familia_notas('OTRA-CLAVE');  -- 0
--   select count(*) from metas.familia_notas('');            -- 0
-- ============================================================================

create or replace function metas.familia_notas(p_clave text)
returns table (nombre text, asignatura text, periodo text, valor text)
language sql
stable
security definer
set search_path = metas, pg_temp
as $$
  select split_part(a.nombre_completo, ' ', 1),
         s.nombre,
         n.periodo,
         n.valor::text
    from metas.familia_accesos fa
    join metas.familias f
      on f.id = fa.familia_id
     and f.deleted_at is null
     and metas._clave_vale(fa.clave_usada, f.clave, f.clave_origen, f.clave_siguiente)
    join metas.alumnos a
      on a.id = f.alumno_id
     and a.deleted_at is null
    join metas.notas n
      on n.alumno_id = a.id
     and n.aula_id = a.aula_id
     and n.deleted_at is null
     and n.componente = 'final'
    join metas.asignaturas s
      on s.id = n.asignatura_id
     and s.aula_id = a.aula_id
     and s.deleted_at is null
   where metas.es_sesion_familia()
     and fa.auth_uid = (select auth.uid())
     and fa.revocado_at is null
     and metas.norm_clave(p_clave) is not null
     and fa.clave_usada = metas.norm_clave(p_clave)
   order by
     case n.periodo
       when 'I' then 1 when 'II' then 2 when 'III' then 3
       when 'IV' then 4 when 'REC' then 5 else 9 end,
     s.orden, s.nombre
   limit 80
$$;

revoke all on function metas.familia_notas(text) from public, anon, authenticated;
grant execute on function metas.familia_notas(text) to authenticated;

-- El EXECUTE que PostgreSQL da a PUBLIC no se quita solo. Las funciones que
-- la app ya usa tienen su GRANT a authenticated, que este revoke no toca.
revoke execute on all functions in schema metas from public;
