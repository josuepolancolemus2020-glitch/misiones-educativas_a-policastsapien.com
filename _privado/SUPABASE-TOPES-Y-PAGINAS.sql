-- ═══════════════════════════════════════════════════════════════════════
-- M.E.T.A.S · Topes de escritura y consultas por páginas
-- ═══════════════════════════════════════════════════════════════════════
-- SE PEGA ENTERO en el SQL Editor de Supabase, del proyecto de M.E.T.A.S
-- (el de los resultados, NO el de F.A.R.O). Es idempotente: correrlo dos
-- veces no rompe nada ni cuenta dos veces.
--
-- QUÉ ARREGLA
-- -----------
-- 1. Las cuatro tablas que se escriben con la clave publicable (que va en
--    el repositorio, como debe ser) no tenían ningún tope por día. El freno
--    por hora (metas_rate_ok, 300 por IP) frena ráfagas, pero no impide que
--    alguien llene la base en una noche: 300 × 24 = 7 200 llamadas de 200
--    filas cada una. Aquí se ponen topes por IP y por día, pensados para
--    que NINGÚN alumno ni maestro real llegue nunca a tocarlos.
--    ⚠️ En Honduras, Tigo y Claro sacan a internet a miles de teléfonos
--    por una misma IP, y el wifi de una escuela o de una capacitación
--    también es una sola IP para todos. Por eso los topes por IP son
--    anchos: muy por encima del día más cargado que ha tenido la nube
--    entera, no de lo que haría un aula. Lo que frenan es a alguien que
--    escribe en máquina, no a una ciudad compartiendo IP.
-- 2. El maestro con más de 1 000 resultados veía 1 000: la nube entrega
--    1 000 filas por vez y las consultas de hoy no sabían pedir la
--    siguiente página. Aquí van dos consultas nuevas que sí saben, con la
--    MISMA regla de qué filas son del maestro.
--
-- ⚠️ LO QUE ESTO **NO** HACE
-- --------------------------
-- · NO redefine ninguna función que ya existe: ni metas_guardar, ni
--   metas_guardar_progreso, ni metas_docente_alta_v2, ni
--   metas_docente_estado_guardar, ni metas.blob_guardar, ni las dos
--   consultas de hoy. Todo lo que hace es AGREGAR: una tabla de
--   contadores, cuatro disparadores y funciones nuevas.
-- · NO toca los disparadores de historial ni el candado de docente_estado.
-- · NO borra ni cambia ninguna fila que ya está guardada. Los topes solo
--   miran filas NUEVAS.
--
-- LOS TOPES Y POR QUÉ ESOS NÚMEROS
-- --------------------------------
-- (datos de la nube el 21 nov 2026: 6 491 resultados, 6 584 progresos,
--  26 docentes, resumen de progreso más grande 1 896 bytes, valor más
--  grande de docente_estado 143 KB. El día con más altas de maestros tuvo
--  9; el día con más resultados sin verificar, 554; el día con más
--  dispositivos activos, 1 376, en TODA la nube y de todas las IP juntas)
--
--  progreso       · actualizar (dispositivo, alumno) que ya existe: pasa
--                   siempre por los topes de cantidad.
--                 · alumno nuevo: máximo 60 alumnos por dispositivo (un
--                   teléfono compartido de un aula de 43 cabe de sobra) y
--                   500 dispositivos nuevos por IP y por día (más de un
--                   tercio de los 1 376 activos del día más cargado,
--                   todos detrás de una sola IP).
--                 · tamaño del resumen: máximo 61 440 bytes (60 KB). El
--                   resumen más grande que la app puede armar hoy (las 100
--                   carpetas de misiones hechas, las 16 rutas
--                   diagnosticadas y 40 insignias) mide 13 693 bytes;
--                   3 × 13 693 = 41 079. Con 94 carpetas cabía en 40 KB;
--                   al llegar a 100 (con El cuento, el 27 de noviembre de
--                   2026) el triple se pasó por 119 bytes y el tope se
--                   subió a 60 KB, que da holgura para unas 70 misiones
--                   más. Este tope sí mira también las
--                   actualizaciones: si solo mirara las filas nuevas, se
--                   saltaría creando la fila chica y engordándola después.
--                   Un resumen real nunca llega (la sonda
--                   _dev/verifica-topes-sql.js lo vuelve a medir con el
--                   catálogo de cada día y se pone roja si se acerca).
--                 · si salta, la fila se SALTA sin error (devuelve NULL):
--                   la app del alumno da el envío por hecho y no reintenta.
--  resultados     · las filas verificadas (con código de aula de un
--                   maestro real) no se frenan NUNCA.
--                 · sin verificar: máximo 10 000 por IP y por día (el día
--                   con más tuvo 554 en toda la nube). Si salta, la fila se
--                   salta sin error.
--  docentes       · máximo 30 altas por IP y por día (una capacitación
--                   entera con el mismo wifi; el día con más tuvo 9 en
--                   toda la nube) y 200 en total por día.
--                   Aquí SÍ da error (tope_altas_ip / tope_altas_dia): la
--                   pantalla le dice al maestro qué pasó y qué hacer.
--  docente_estado · valor de máximo 3 MB (valor_demasiado_grande). Un aula
--                   realista de 10 grupos de 45 alumnos, con el año entero
--                   de notas, asistencia, colectas, controles, bitácora,
--                   lecturas, acumulativos y dos logos por grupo, mide
--                   2,05 MB por el espejo viejo (entera) y 0,34 MB por el
--                   blob de la app de hoy (sin lo que ya pasó a filas).
--                 · claves nuevas: nombre ^[A-Za-z0-9_]{1,40}$
--                   (clave_no_valida) y máximo 16 claves por maestro
--                   (tope_claves). La app usa 8.
--
-- «Día» es el día de Honduras (America/Tegucigalpa): el contador vuelve a
-- cero a la medianoche del maestro, no a la de Londres.
-- La IP sale de cf-connecting-ip (la pone Cloudflare y el cliente no la
-- puede inventar) y, si no viene, del primer valor de x-forwarded-for.
-- Lo que se escribe desde el SQL Editor (sin cabeceras de la API) no pasa
-- por los topes por IP: así Josué puede dar de alta o corregir a mano.
--
-- EN QUÉ ORDEN
-- ------------
-- Este archivo va SOLO y de una vez, DESPUÉS de todos los demás (necesita
-- las tablas resultados, progreso, docentes y docente_estado, y las
-- funciones metas_norm y _metas_docente_ok, que ya están en la nube).
-- Si alguna vez se re-corre SUPABASE-PUERTA-ANONIMA.sql o
-- SUPABASE-DOCENTES-V2.sql, NO hace falta volver a correr este: aquellos
-- no tocan nada de lo que este crea.
-- ═══════════════════════════════════════════════════════════════════════


-- ── 1) Contador por IP y por día ──────────────────────────────────────
-- Una fila por (día, clase de tope, IP). La clase separa lo que se cuenta:
-- 'alta_docente', 'dispositivo_nuevo', 'resultado_sin_verificar'. La IP
-- '*' lleva el total del día de las altas.
-- RLS encendida y SIN políticas: nadie la lee ni la escribe por la API;
-- solo las funciones de abajo, que son security definer.
create table if not exists public.metas_topes_dia (
  dia   date    not null,
  clase text    not null,
  ip    text    not null,
  n     integer not null default 0,
  primary key (dia, clase, ip)
);
alter table public.metas_topes_dia enable row level security;
-- Supabase da permisos de fábrica a anon sobre toda tabla nueva de public.
-- Con RLS y sin políticas ya no ve nada, pero se quitan igual: un contador
-- que se pudiera tocar desde fuera serviría para bloquearle el día a otro.
revoke all on table public.metas_topes_dia from public, anon, authenticated;


-- ── 2) De qué IP viene la petición ────────────────────────────────────
-- Devuelve NULL cuando no hay petición de la API (SQL Editor, tareas de
-- mantenimiento): entonces no se aplica ningún tope por IP.
create or replace function public._metas_ip_peticion()
returns text
language plpgsql stable security definer set search_path = public
as $$
declare
  h json;
  v text;
begin
  begin
    h := nullif(current_setting('request.headers', true), '')::json;
  exception when others then
    h := null;
  end;
  if h is null then
    return null;
  end if;
  v := nullif(trim(h ->> 'cf-connecting-ip'), '');
  if v is null then
    v := nullif(trim(split_part(coalesce(h ->> 'x-forwarded-for', ''), ',', 1)), '');
  end if;
  -- Con cabeceras pero sin IP: todos los que lleguen así comparten un
  -- solo contador. Es más estricto, nunca más flojo.
  return left(coalesce(v, 'desconocida'), 64);
end
$$;
revoke all on function public._metas_ip_peticion() from public, anon, authenticated;


-- ── 3) Sumar uno y devolver cuántos van hoy ───────────────────────────
create or replace function public._metas_tope_sumar(p_clase text, p_ip text)
returns integer
language plpgsql volatile security definer set search_path = public
as $$
declare
  v_dia date := (now() at time zone 'America/Tegucigalpa')::date;
  v_n   integer;
begin
  insert into public.metas_topes_dia as t (dia, clase, ip, n)
  values (v_dia, p_clase, p_ip, 1)
  on conflict (dia, clase, ip) do update set n = t.n + 1
  returning t.n into v_n;
  -- Limpieza barata: la primera vez que una IP aparece en el día se borran
  -- los días de hace más de una semana (la llave empieza por «dia», así
  -- que el borrado va por índice y no recorre la tabla).
  if v_n = 1 then
    delete from public.metas_topes_dia where dia < v_dia - 7;
  end if;
  return v_n;
end
$$;
revoke all on function public._metas_tope_sumar(text, text) from public, anon, authenticated;


-- ── 4) progreso: alumnos por dispositivo, dispositivos por IP, tamaño ─
create or replace function public._metas_topes_progreso()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_ip text;
begin
  -- Tamaño (ver la cabecera: 3 × el resumen más grande posible). Se mira
  -- también en las actualizaciones, porque metas_guardar_progreso actualiza
  -- con INSERT … ON CONFLICT y este disparador ve las dos.
  if new.resumen is not null and octet_length(new.resumen::text) > 61440 then
    return null;
  end if;

  -- (dispositivo, alumno) que ya existe: es una actualización y pasa.
  if exists (select 1 from public.progreso p
              where p.dispositivo = new.dispositivo and p.alumno = new.alumno) then
    return new;
  end if;

  -- Alumno nuevo en este dispositivo: máximo 60 por dispositivo. El
  -- «limit 60» corta la cuenta en cuanto llega al tope.
  if (select count(*) from (select 1 from public.progreso p
                             where p.dispositivo = new.dispositivo limit 60) x) >= 60 then
    return null;
  end if;

  -- Dispositivo que la nube nunca vio: máximo 500 nuevos por IP y por día
  -- (ancho a propósito: una IP de Tigo o Claro la comparten miles).
  v_ip := public._metas_ip_peticion();
  if v_ip is not null
     and not exists (select 1 from public.progreso p where p.dispositivo = new.dispositivo) then
    if public._metas_tope_sumar('dispositivo_nuevo', v_ip) > 500 then
      return null;
    end if;
  end if;
  return new;
end
$$;
revoke all on function public._metas_topes_progreso() from public, anon, authenticated;

drop trigger if exists progreso_topes on public.progreso;
create trigger progreso_topes
  before insert on public.progreso
  for each row execute function public._metas_topes_progreso();


-- ── 5) resultados: lo verificado nunca se frena ───────────────────────
create or replace function public._metas_topes_resultados()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_ip text;
begin
  -- Con código de aula de un maestro real: pasa siempre. Es la práctica
  -- de los alumnos de verdad y no se le pone ningún techo.
  if new.verificado is true then
    return new;
  end if;
  -- Un reintento de algo que ya llegó (la app reenvía si se le cortó la
  -- respuesta): metas_guardar lo descarta con su ON CONFLICT y no debe
  -- gastarle cupo a nadie.
  if exists (select 1 from public.resultados r where r.evento_id = new.evento_id) then
    return new;
  end if;
  v_ip := public._metas_ip_peticion();
  if v_ip is null then
    return new;
  end if;
  if public._metas_tope_sumar('resultado_sin_verificar', v_ip) > 10000 then
    return null;
  end if;
  return new;
end
$$;
revoke all on function public._metas_topes_resultados() from public, anon, authenticated;

drop trigger if exists resultados_topes on public.resultados;
create trigger resultados_topes
  before insert on public.resultados
  for each row execute function public._metas_topes_resultados();


-- ── 6) docentes: altas por IP y por día ───────────────────────────────
-- Aquí SÍ hay error, porque al otro lado hay una persona esperando a que
-- se cree su cuenta y tiene que saber qué pasó. La app reconoce los dos
-- mensajes y le dice qué hacer.
-- Si el alta falla por otra cosa (correo repetido, código que chocó), la
-- función de alta deshace su intento entero y el contador vuelve atrás
-- con él: solo cuentan las altas que de verdad se crearon.
create or replace function public._metas_topes_docentes()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_ip text;
begin
  v_ip := public._metas_ip_peticion();
  if v_ip is null then
    return new;                                  -- alta a mano desde el SQL Editor
  end if;
  if public._metas_tope_sumar('alta_docente', v_ip) > 30 then
    raise exception 'tope_altas_ip'
      using hint = 'Se crearon muchas cuentas desde esta conexión hoy.';
  end if;
  if public._metas_tope_sumar('alta_docente', '*') > 200 then
    raise exception 'tope_altas_dia'
      using hint = 'Se crearon muchas cuentas hoy en toda la plataforma.';
  end if;
  return new;
end
$$;
revoke all on function public._metas_topes_docentes() from public, anon, authenticated;

drop trigger if exists docentes_topes on public.docentes;
create trigger docentes_topes
  before insert on public.docentes
  for each row execute function public._metas_topes_docentes();


-- ── 7) docente_estado: tamaño, nombre de clave y cuántas claves ───────
-- metas_docente_estado_guardar (la vieja) atrapa el error de cada entrada
-- y devuelve cuántas escribió: la que se pasa del tope simplemente no
-- cuenta. metas.blob_guardar (la de hoy) no lo atrapa: el lote entero
-- falla con el mensaje del tope y la app lo reconoce (js/metas-blob-sesion.js).
-- Este disparador va APARTE del candado y del historial: no los toca, y
-- si salta, el historial de esa escritura se deshace con ella.
create or replace function public._metas_topes_docente_estado()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.valor is not null and octet_length(new.valor::text) > 3145728 then
    raise exception 'valor_demasiado_grande'
      using hint = 'El valor pasa de 3 MB.';
  end if;
  -- Solo las claves NUEVAS. INSERT … ON CONFLICT pasa por aquí también
  -- cuando la clave ya existe y en realidad va a actualizar: eso no es
  -- clave nueva y no se le pide nada más.
  if tg_op = 'INSERT'
     and not exists (select 1 from public.docente_estado d
                      where d.codigo = new.codigo and d.k = new.k) then
    if new.k is null or new.k !~ '^[A-Za-z0-9_]{1,40}$' then
      raise exception 'clave_no_valida'
        using hint = 'La clave solo lleva letras, números y _ (hasta 40).';
    end if;
    if (select count(*) from (select 1 from public.docente_estado d
                               where d.codigo = new.codigo limit 16) x) >= 16 then
      raise exception 'tope_claves'
        using hint = 'Este maestro ya tiene 16 claves guardadas.';
    end if;
  end if;
  return new;
end
$$;
revoke all on function public._metas_topes_docente_estado() from public, anon, authenticated;

drop trigger if exists docente_estado_topes on public.docente_estado;
create trigger docente_estado_topes
  before insert or update on public.docente_estado
  for each row execute function public._metas_topes_docente_estado();


-- ── 8) Consultas por páginas ──────────────────────────────────────────
-- Copia EXACTA de la regla de metas_consultar_docente tal como la dejó
-- SUPABASE-PUERTA-ANONIMA.sql (la última que la define, corrida el 7 de
-- septiembre de 2026), y de metas_consultar_progreso_docente tal como la
-- dejó SUPABASE-DOCENTES-V2.sql (la única que la redefine después de la
-- primera). Lo único que cambia:
--   · en vez de «limit 2000/1000» de una vez, páginas de hasta 1 000;
--   · en vez de saltar N filas (offset), un cursor (fecha, id): la página
--     siguiente empieza justo después de la última fila que llegó. Con
--     offset, una fila nueva que entra mientras el maestro pagina corre
--     todo un lugar y una fila sale repetida o se pierde.
-- p_antes_fecha / p_antes_id: los de la última fila de la página anterior
-- (NULL en la primera). p_limite: cuántas filas (1 a 1 000; 500 si no se dice).

create or replace function public.metas_consultar_docente_pag(
  p_codigo text, p_clave text,
  p_antes_fecha timestamptz default null,
  p_antes_id bigint default null,
  p_limite integer default 500)
returns setof public.resultados
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
  v_lim     integer := least(greatest(coalesce(p_limite, 500), 1), 1000);
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
    where (
      -- lo verificado: exacto, del servidor
      r.docente_codigo = v_cod
      -- o lo de siempre, solo para lo que NO trae código
      or ( r.docente_codigo is null
           and public.metas_norm(r.docente) like '%' || v_n || '%'
           and not exists (select 1 from unnest(v_rivales) rv
                           where public.metas_norm(r.docente) like '%' || rv || '%') )
    )
      and ( p_antes_fecha is null
            or (r.creado_en, r.id) < (p_antes_fecha, coalesce(p_antes_id, 9223372036854775807)) )
    order by r.creado_en desc, r.id desc
    limit v_lim;
end
$$;
revoke all on function public.metas_consultar_docente_pag(text, text, timestamptz, bigint, integer) from public;
grant execute on function public.metas_consultar_docente_pag(text, text, timestamptz, bigint, integer) to anon, authenticated;

create or replace function public.metas_consultar_progreso_docente_pag(
  p_codigo text, p_clave text,
  p_antes_fecha timestamptz default null,
  p_antes_id bigint default null,
  p_limite integer default 500)
returns setof public.progreso
language plpgsql security definer stable set search_path = public
as $$
declare
  v_cod     text := upper(trim(coalesce(p_codigo,'')));
  v_nombre  text;
  v_n       text;
  v_rivales text[];
  v_lim     integer := least(greatest(coalesce(p_limite, 500), 1), 1000);
begin
  if not public._metas_docente_ok(v_cod, p_clave) then
    return;
  end if;
  select d.nombre into v_nombre from public.docentes d where d.codigo = v_cod;
  v_n := public.metas_norm(v_nombre);
  if v_n = '' then return; end if;
  if length(v_n) >= 8 then
    v_rivales := array(
      select public.metas_norm(d.nombre) from public.docentes d
      where d.codigo <> v_cod
        and d.nombre is not null and d.nombre <> ''
        and public.metas_norm(d.nombre) like '%' || v_n || '%');
    return query
      select p.* from public.progreso p
      where public.metas_norm(p.docente) like '%' || v_n || '%'
        and not exists (select 1 from unnest(v_rivales) rv
                        where public.metas_norm(p.docente) like '%' || rv || '%')
        and ( p_antes_fecha is null
              or (p.actualizado_en, p.id) < (p_antes_fecha, coalesce(p_antes_id, 9223372036854775807)) )
      order by p.actualizado_en desc, p.id desc
      limit v_lim;
  else
    return query
      select p.* from public.progreso p
      where public.metas_norm(p.docente) = v_n
        and ( p_antes_fecha is null
              or (p.actualizado_en, p.id) < (p_antes_fecha, coalesce(p_antes_id, 9223372036854775807)) )
      order by p.actualizado_en desc, p.id desc
      limit v_lim;
  end if;
end
$$;
revoke all on function public.metas_consultar_progreso_docente_pag(text, text, timestamptz, bigint, integer) from public;
grant execute on function public.metas_consultar_progreso_docente_pag(text, text, timestamptz, bigint, integer) to anon, authenticated;


-- ── 9) Índices que sostienen el cursor ────────────────────────────────
-- El orden de las páginas es (fecha desc, id desc). Para lo verificado,
-- (docente_codigo, creado_en, id) entrega la página ya en orden sin
-- ordenar nada; para lo que se empareja por nombre, el índice trigrama de
-- SUPABASE-DOCENTES-V2.sql encuentra las filas y el de (creado_en, id)
-- sirve al ordenar y al cortar en el cursor.
create index if not exists resultados_docente_cursor_idx
  on public.resultados (docente_codigo, creado_en desc, id desc);
create index if not exists resultados_cursor_idx
  on public.resultados (creado_en desc, id desc);
create index if not exists progreso_cursor_idx
  on public.progreso (actualizado_en desc, id desc);


-- Que la API vea las dos funciones nuevas sin esperar (Supabase lo hace
-- solo con cada cambio de esquema, pero no cuesta nada pedirlo).
notify pgrst, 'reload schema';


-- ═══════════════════════════════════════════════════════════════════════
-- CÓMO SE COMPRUEBA QUE QUEDÓ PUESTO (solo lecturas)
-- (sin fiarse del «Success» del editor: se pega y se miran los resultados)
-- ═══════════════════════════════════════════════════════════════════════
--
-- a) Los cuatro disparadores nuevos, encendidos:
--    select tgname, tgrelid::regclass as tabla, tgenabled
--      from pg_trigger
--     where tgname in ('progreso_topes','resultados_topes','docentes_topes','docente_estado_topes');
--    → CUATRO filas, tgenabled = 'O'.
--
-- b) Los de antes siguen ahí (historial y candado), sin cambios:
--    select tgname, tgrelid::regclass from pg_trigger
--     where tgrelid = 'public.docente_estado'::regclass and not tgisinternal;
--    → los mismos de antes MÁS docente_estado_topes.
--
-- c) Todas las funciones nuevas con security definer y search_path:
--    select proname, prosecdef, proconfig from pg_proc
--     where pronamespace = 'public'::regnamespace
--       and proname in ('_metas_ip_peticion','_metas_tope_sumar','_metas_topes_progreso',
--                       '_metas_topes_resultados','_metas_topes_docentes',
--                       '_metas_topes_docente_estado','metas_consultar_docente_pag',
--                       'metas_consultar_progreso_docente_pag');
--    → OCHO filas, prosecdef = true, proconfig = {search_path=public}.
--
-- d) Las funciones de guardar NO se tocaron (la fecha de cambio no existe
--    en Postgres, pero sí el texto): metas_guardar sigue con su lote de 200
--    y su freno, y la consulta vieja sigue siendo la de PUERTA-ANONIMA,
--    que es la que se copió:
--    select position('jsonb_array_length(filas) > 200' in pg_get_functiondef('public.metas_guardar(jsonb)'::regprocedure)) > 0 as guardar_igual,
--           position('r.docente_codigo = v_cod' in pg_get_functiondef('public.metas_consultar_docente(text,text)'::regprocedure)) > 0 as consulta_es_la_copiada,
--           position('order by p.actualizado_en desc' in pg_get_functiondef('public.metas_consultar_progreso_docente(text,text)'::regprocedure)) > 0 as progreso_es_la_copiada;
--    → las TRES en true. Si consulta_es_la_copiada sale false, la nube
--      tiene otra versión de la consulta: avisar antes de seguir.
--
-- e) La tabla de contadores, cerrada:
--    select relrowsecurity from pg_class where oid = 'public.metas_topes_dia'::regclass;
--    → true.
--    select count(*) from pg_policies where tablename = 'metas_topes_dia';
--    → 0.
--
-- f) Los índices:
--    select indexname from pg_indexes
--     where indexname in ('resultados_docente_cursor_idx','resultados_cursor_idx','progreso_cursor_idx');
--    → TRES filas.
--
-- g) Que las páginas traen lo mismo que la consulta vieja, sin contraseña
--    (cuenta las filas verificadas de un maestro; las de nombre se suman en
--    la app): abrir «Resultados de mis alumnos» con la cuenta de un maestro
--    con más de 1 000 resultados y ver que el número pasa de 1 000.
--
-- h) Al día siguiente: ¿alguien tocó un tope?
--    select dia, clase, count(*) as ips, max(n) as mayor
--      from public.metas_topes_dia group by dia, clase order by dia desc, clase;
--    → «mayor» por debajo de 500 (dispositivo_nuevo), 10 000
--      (resultado_sin_verificar) y 30 (alta_docente; la fila con ip '*'
--      es el total del día, tope 200). Si alguna pasa, mirar qué IP fue
--      antes de pensar en subir el tope:
--    select * from public.metas_topes_dia
--     where (clase = 'dispositivo_nuevo' and n > 500)
--        or (clase = 'resultado_sin_verificar' and n > 10000)
--        or (clase = 'alta_docente' and ip <> '*' and n > 30)
--        or (clase = 'alta_docente' and ip = '*' and n > 200);
--
-- ═══════════════════════════════════════════════════════════════════════
-- CÓMO SE DESHACE (sin borrar ningún dato)
-- ═══════════════════════════════════════════════════════════════════════
-- Quitar los topes es quitar los cuatro disparadores. Nada más: las filas
-- que entraron se quedan como están.
--
--    drop trigger if exists progreso_topes       on public.progreso;
--    drop trigger if exists resultados_topes     on public.resultados;
--    drop trigger if exists docentes_topes       on public.docentes;
--    drop trigger if exists docente_estado_topes on public.docente_estado;
--
-- Las consultas por páginas se pueden dejar: no escriben nada. Si de todos
-- modos se quieren quitar, la app vuelve sola a las consultas de antes
-- (las busca primero y, si no están, usa las viejas):
--
--    drop function if exists public.metas_consultar_docente_pag(text, text, timestamptz, bigint, integer);
--    drop function if exists public.metas_consultar_progreso_docente_pag(text, text, timestamptz, bigint, integer);
--
-- La tabla metas_topes_dia solo guarda contadores (ningún dato de alumno
-- ni de maestro) y se limpia sola a la semana. Se puede dejar.
-- ═══════════════════════════════════════════════════════════════════════
