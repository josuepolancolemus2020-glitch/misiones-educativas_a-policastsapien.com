-- ═══════════════════════════════════════════════════════════════════════
-- M.E.T.A.S · Cerrar la puerta de escritura anónima a la nube
-- ═══════════════════════════════════════════════════════════════════════
-- SE PEGA ENTERO en el SQL Editor de Supabase, del proyecto de M.E.T.A.S
-- (el de los resultados, NO el de F.A.R.O). Es idempotente: correrlo dos
-- veces no rompe nada.
--
-- QUÉ ARREGLA
-- -----------
-- `metas_guardar` aceptaba hasta 500 filas de cualquiera, con la clave
-- publicable que va escrita en este repositorio —como debe ser—, sin freno
-- y sin cuenta. Y decidía de quién era cada fila por el TEXTO del nombre
-- del maestro. O sea: cualquiera podía escribir 500 notas falsas a nombre
-- de un maestro cuyo nombre adivinara, y no existía forma de borrarlas.
-- Esas filas salen en «Mis alumnos en la nube», en Estadísticas y de ahí
-- en el informe que firma la madre.
--
-- ⚠️ LO QUE ESTO **NO** HACE, Y HAY QUE SABERLO
-- ---------------------------------------------
-- No cierra la puerta del todo: sigue aceptando filas sin código de aula,
-- porque hay alumnos ya trabajando con la aplicación guardada en su
-- teléfono y cortarles la subida sería perder su práctica sin que nadie se
-- entere. Lo que hace es quitarle el disfraz: esas filas quedan marcadas
-- como **sin verificar**, el maestro las ve marcadas y ahora **puede
-- borrarlas**. Cerrarla del todo pide un permiso por aparato, que es la
-- parte de semanas.
--
-- EN QUÉ ORDEN
-- ------------
-- Este archivo va SOLO y de una vez. No hace falta re-correr ningún otro.
-- (Si alguna vez se re-corre SUPABASE-AULA.sql o SUPABASE-DOCENTES-V2.sql,
--  hay que volver a correr ESTE DESPUÉS: aquellos redefinen metas_guardar
--  y metas_consultar_docente con la versión vieja.)
-- ═══════════════════════════════════════════════════════════════════════


-- ── 1) Dos columnas nuevas ────────────────────────────────────────────
-- `verificado`: la fila llegó con un código de aula que resolvió a un
--    maestro de verdad. Las de antes se quedan en null = «no se sabe», que
--    no es lo mismo que false = «se sabe que no».
-- `docente_codigo`: el código del maestro RESUELTO EN EL SERVIDOR. Es lo
--    que sustituye a fiarse del nombre que venga escrito en la fila.
alter table public.resultados add column if not exists verificado boolean;
alter table public.resultados add column if not exists docente_codigo text;
create index if not exists resultados_docente_codigo_idx
  on public.resultados (docente_codigo);


-- ── 2) Fuera la política heredada ─────────────────────────────────────
-- La dejó SUPABASE-FASE1 y ningún archivo posterior la quitó: permitía
-- insertar directamente en la tabla a cualquiera con la clave publicable,
-- saltándose la función entera. No hace falta para nada: metas_guardar es
-- `security definer` y escribe con permisos propios.
drop policy if exists resultados_insertar on public.resultados;


-- ── 3) metas_guardar, con freno, con topes y sin fiarse del nombre ────
create or replace function public.metas_guardar(filas jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  if filas is null or jsonb_typeof(filas) <> 'array' then
    return 0;
  end if;
  -- El lote baja de 500 a 200: 200 sigue siendo más de lo que manda un
  -- aula entera de golpe, y 500 servía para llenar la cuota gratuita.
  if jsonb_array_length(filas) > 200 then
    return 0;
  end if;
  -- El mismo freno por IP y hora que ya usan las demás funciones. No
  -- estaba puesto aquí, que era justo la que escribe.
  if not public.metas_rate_ok() then
    return 0;
  end if;

  insert into public.resultados
    (evento_id, tipo, mision, forma, nota, base, alumno, codigo_lista,
     grado, docente, docente_codigo, escuela, dispositivo, xp, fecha, verificado)
  select
    left(f.evento_id, 40),
    f.tipo,
    left(f.mision, 120),
    f.forma,
    -- La nota se acota a [0, base]: no había ningún check y entraba
    -- cualquier número, incluso negativo o de seis cifras.
    greatest(0, least(f.nota, coalesce(nullif(f.base,0), 100))),
    coalesce(nullif(f.base, 0), 100),
    left(f.alumno, 60),
    left(f.codigo_lista, 10),
    left(f.grado, 30),
    -- El nombre del maestro: si el código de aula resuelve, MANDA EL
    -- SERVIDOR; si no, se guarda lo que venga, pero marcado.
    coalesce(d.nombre, left(f.docente, 60)),
    d.codigo,
    left(f.escuela, 80),
    left(f.dispositivo, 20),
    f.xp,
    f.fecha,
    (d.codigo is not null)
  from jsonb_to_recordset(filas) as f(
    evento_id text, tipo text, mision text, forma int, nota int, base int,
    alumno text, codigo_lista text, grado text, docente text, escuela text,
    dispositivo text, xp int, fecha timestamptz, codigo_aula text)
  left join public.docentes d
    on d.codigo_aula = upper(nullif(trim(f.codigo_aula), ''))
  where f.evento_id is not null
    and f.tipo in ('evaluacion','prueba_operativa','pauta_vista')
    and coalesce(nullif(f.base, 0), 100) between 1 and 1000
  on conflict (evento_id) do nothing;
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.metas_guardar(jsonb) from public;
grant execute on function public.metas_guardar(jsonb) to anon, authenticated;


-- ── 4) El maestro ve lo suyo: por CÓDIGO primero, por nombre después ──
-- Las filas verificadas se emparejan por el código del maestro, que el
-- servidor resolvió y nadie puede escribir desde fuera. Las de antes —y
-- las que lleguen sin código de aula— se siguen emparejando por el nombre
-- como hasta hoy, para no hacerle desaparecer nada de lo que ya tiene.
create or replace function public.metas_consultar_docente(p_codigo text, p_clave text)
returns setof public.resultados
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;
  end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo = v_cod;
  v_n := public.metas_norm(v_nombre);
  if v_n = '' then return; end if;

  v_rivales := case when length(v_n) >= 8 then array(
      select public.metas_norm(d.nombre) from public.docentes d
      where d.codigo <> v_cod
        and d.nombre is not null and d.nombre <> ''
        and public.metas_norm(d.nombre) like '%' || v_n || '%')
    else array[]::text[] end;

  return query
    select r.* from public.resultados r
    where
      -- lo verificado: exacto, del servidor
      r.docente_codigo = v_cod
      -- o lo de siempre, solo para lo que NO trae código
      or ( r.docente_codigo is null
           and public.metas_norm(r.docente) like '%' || v_n || '%'
           and not exists (select 1 from unnest(v_rivales) rv
                           where public.metas_norm(r.docente) like '%' || rv || '%') )
    order by r.creado_en desc
    limit 2000;
end
$$;
revoke all on function public.metas_consultar_docente(text,text) from public;
grant execute on function public.metas_consultar_docente(text,text) to anon, authenticated;


-- ── 5) El maestro puede BORRAR lo que no es suyo ──────────────────────
-- No existía ningún borrado en toda la base: una fila falsa era eterna.
-- Además de defensa, es el derecho de supresión que pide el aviso de
-- privacidad. Solo borra filas que ESA consulta le devolvería a él.
create or replace function public.metas_resultados_borrar(
  p_codigo text, p_clave text, p_ids bigint[])
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_cod text := upper(trim(coalesce(p_codigo,'')));
  v_n   text;
  n int;
begin
  if not public._metas_docente_ok(v_cod, p_clave) then return 0; end if;
  if p_ids is null or array_length(p_ids, 1) is null then return 0; end if;
  if array_length(p_ids, 1) > 500 then return 0; end if;
  select public.metas_norm(d.nombre) into v_n from public.docentes d where d.codigo = v_cod;
  if coalesce(v_n,'') = '' then return 0; end if;

  delete from public.resultados r
   where r.id = any(p_ids)
     and ( r.docente_codigo = v_cod
        or ( r.docente_codigo is null
             and public.metas_norm(r.docente) like '%' || v_n || '%' ) );
  get diagnostics n = row_count;
  return n;
end
$$;
revoke all on function public.metas_resultados_borrar(text,text,bigint[]) from public;
grant execute on function public.metas_resultados_borrar(text,text,bigint[]) to anon, authenticated;


-- ── 6) Fuera las funciones heredadas que nadie retiró ─────────────────
-- `metas_consultar(p_clave)` devolvía TODOS los resultados del proyecto a
-- quien conociera una clave única que el script traía por defecto como
-- 'CAMBIA-ESTA-CLAVE'. `metas_suscribir_docente` creaba cuentas con el
-- código que eligiera el cliente y sin correo: como el nombre normalizado
-- es único, servía para BLOQUEARLE EL REGISTRO al maestro real con ese
-- nombre. Ninguna de las dos la usa la aplicación de hoy (la de hoy llama a
-- metas_consultar_docente, que es otra).
--
-- ⚠️ Se buscan POR NOMBRE y se quitan TODAS sus versiones, existan o no.
-- La primera versión de este archivo hacía `revoke` y después `drop … if
-- exists`, y eso reventó al pegarlo: `revoke` sobre una función que ya no
-- existe da ERROR 42883, y como el editor de Supabase corre todo en una
-- transacción, se deshizo el script ENTERO sin aplicar nada. El `drop` se
-- lleva los permisos con la función, así que el `revoke` sobraba.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as firma
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in ('metas_consultar', 'metas_suscribir_docente')
  loop
    execute 'drop function ' || r.firma;
  end loop;
end
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- CÓMO SE COMPRUEBA QUE QUEDÓ PUESTO
-- (sin fiarse del «Success» del editor: se pega y se miran los resultados)
-- ═══════════════════════════════════════════════════════════════════════
--
-- a) Las dos columnas y el índice:
--    select column_name from information_schema.columns
--     where table_name='resultados' and column_name in ('verificado','docente_codigo');
--    → tienen que salir las DOS.
--
-- b) La política heredada ya no está:
--    select policyname from pg_policies
--     where tablename='resultados' and policyname='resultados_insertar';
--    → CERO filas.
--
-- c) Las heredadas ya no existen:
--    select proname from pg_proc
--     where proname in ('metas_consultar','metas_suscribir_docente');
--    → CERO filas.
--
-- d) El borrado existe:
--    select proname from pg_proc where proname='metas_resultados_borrar';
--    → UNA fila.
--
-- e) Y la prueba de verdad, la que importa: que una fila inventada entre
--    marcada como NO verificada. Se pega esto y se mira:
--
--    select public.metas_guardar('[{"evento_id":"PRUEBA-BORRAME",
--      "tipo":"evaluacion","mision":"prueba","nota":100,"base":100,
--      "alumno":"Prueba","docente":"Nombre Inventado"}]'::jsonb);
--    select evento_id, verificado, docente_codigo from public.resultados
--     where evento_id='PRUEBA-BORRAME';
--    → verificado = false y docente_codigo = null.
--
--    Y se limpia:
--    delete from public.resultados where evento_id='PRUEBA-BORRAME';
--
-- f) Que la nota se acota (esto antes entraba tal cual):
--    select public.metas_guardar('[{"evento_id":"PRUEBA-TOPE",
--      "tipo":"evaluacion","nota":9999,"base":100}]'::jsonb);
--    select nota from public.resultados where evento_id='PRUEBA-TOPE';
--    → 100, no 9999.
--    delete from public.resultados where evento_id='PRUEBA-TOPE';
-- ═══════════════════════════════════════════════════════════════════════
