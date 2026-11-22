-- ============================================================================
-- Pruebas de _privado/SUPABASE-TOPES-Y-PAGINAS.sql (base local desechable).
-- Cada prueba escribe ✔ o revienta con ✘ y su nombre. Datos ficticios.
-- La «petición de la API» se simula poniendo request.headers, como hace
-- PostgREST; sin cabeceras es como escribir desde el SQL Editor.
-- ============================================================================
\set ON_ERROR_STOP 1
set client_min_messages = notice;

create schema if not exists prueba;
create or replace function prueba.ok(nombre text, cond boolean) returns void
language plpgsql as $$
begin
  if cond is true then raise notice '✔ %', nombre;
  else raise exception '✘ %', nombre; end if;
end $$;
-- Petición desde esta IP (cf-connecting-ip, como la pone Cloudflare).
create or replace function prueba.ip(v text) returns void language sql as $$
  select set_config('request.headers',
    json_build_object('cf-connecting-ip', v, 'x-forwarded-for', v || ', 172.16.0.1')::text, false);
$$;
create or replace function prueba.sin_api() returns void language sql as $$
  select set_config('request.headers', '', false);
$$;
create or replace function prueba.alta(nombre text, correo text) returns jsonb language sql as $$
  select public.metas_docente_alta_v2(nombre, correo, 'clave-prueba');
$$;
create or replace function prueba.contador(p_clase text, p_ip text) returns int language sql as $$
  select coalesce((select n from public.metas_topes_dia
                    where clase = p_clase and ip = p_ip
                      and dia = (now() at time zone 'America/Tegucigalpa')::date), 0);
$$;

-- ─────────────────────────────────────────────────────────────────────────
\echo '— docentes: 30 altas por IP y por día, 200 en total'
select prueba.ip('10.0.0.1');
do $$
declare i int; r jsonb;
begin
  for i in 1..30 loop
    r := prueba.alta('Maestra Ficticia Numero ' || i, 'ficticia' || i || '@prueba.invalid');
    perform prueba.ok('alta ' || i || ' de 30 desde la misma IP entra', (r ->> 'ok')::boolean);
  end loop;
end $$;
do $$
begin
  perform prueba.alta('Maestra Ficticia Treinta Y Una', 'ficticia31@prueba.invalid');
  raise exception 'no saltó';
exception when others then
  perform prueba.ok('la 31.ª alta desde esa IP da tope_altas_ip (error: ' || sqlerrm || ')', sqlerrm = 'tope_altas_ip');
end $$;
select prueba.ok('el intento rechazado no gasta cupo (siguen 30)', prueba.contador('alta_docente', '10.0.0.1') = 30);
select prueba.ok('la cuenta rechazada no quedó creada',
  not exists (select 1 from public.docentes where correo = 'ficticia31@prueba.invalid'));
-- Un correo repetido no crea nada y no gasta cupo de nadie.
select prueba.ip('10.0.0.2');
select prueba.ok('correo repetido: motivo correo',
  prueba.alta('Otra Maestra Distinta', 'ficticia1@prueba.invalid') ->> 'motivo' = 'correo');
select prueba.ok('y no gastó cupo', prueba.contador('alta_docente', '10.0.0.2') = 0);
-- 200 en total: se simula que ya van 199 hoy.
update public.metas_topes_dia set n = 199
 where clase = 'alta_docente' and ip = '*' and dia = (now() at time zone 'America/Tegucigalpa')::date;
select prueba.ip('10.0.0.3');
select prueba.ok('la alta 200 del día entra', (prueba.alta('Maestra Doscientos Justa', 'f200@prueba.invalid') ->> 'ok')::boolean);
select prueba.ip('10.0.0.4');
do $$
begin
  perform prueba.alta('Maestra Doscientos Una', 'f201@prueba.invalid');
  raise exception 'no saltó';
exception when others then
  perform prueba.ok('la 201 del día da tope_altas_dia (error: ' || sqlerrm || ')', sqlerrm = 'tope_altas_dia');
end $$;
select prueba.ok('y no le gastó cupo a su IP', prueba.contador('alta_docente', '10.0.0.4') = 0);
select prueba.sin_api();
select prueba.ok('desde el SQL Editor (sin API) el alta entra aunque el día esté lleno',
  (prueba.alta('Maestra Dada De Alta A Mano', 'amano@prueba.invalid') ->> 'ok')::boolean);
update public.metas_topes_dia set n = 0 where clase = 'alta_docente' and ip = '*';

-- ─────────────────────────────────────────────────────────────────────────
\echo '— resultados: lo verificado nunca se frena; sin verificar, 10 000 por IP y día'
update public.docentes set codigo_aula = 'AULA01' where correo = 'ficticia1@prueba.invalid';
select prueba.ip('10.0.1.1');
create or replace function prueba.lote(prefijo text, n int, aula text default '') returns jsonb language sql as $$
  select jsonb_agg(jsonb_build_object('evento_id', prefijo || '-' || g, 'tipo', 'evaluacion',
           'mision', 'prueba', 'nota', 80, 'base', 100, 'alumno', 'Alumno ficticio ' || g,
           'docente', 'Nadie En Particular', 'codigo_aula', aula,
           'fecha', '2026-11-21T10:00:00Z'))
    from generate_series(1, n) g;
$$;
do $$
declare i int; total int := 0;
begin
  for i in 1..50 loop
    total := total + public.metas_guardar(prueba.lote('SV' || i, 200));
  end loop;
  perform prueba.ok('10 000 sin verificar desde una IP entran (' || total || ')', total = 10000);
end $$;
select prueba.ok('la 10 001 sin verificar se salta sin error', public.metas_guardar(prueba.lote('SVX', 10)) = 0);
select prueba.ok('…y no queda en la tabla',
  not exists (select 1 from public.resultados where evento_id like 'SVX-%'));
select prueba.ok('las verificadas desde la misma IP entran igual',
  public.metas_guardar(prueba.lote('VER', 50, 'AULA01')) = 50);
select prueba.ok('…marcadas como verificadas',
  (select bool_and(verificado) from public.resultados where evento_id like 'VER-%'));
do $$
declare antes int := prueba.contador('resultado_sin_verificar', '10.0.1.1');
begin
  perform public.metas_guardar(prueba.lote('SV1', 200));
  perform prueba.ok('reenviar lo que ya llegó no gasta cupo',
    prueba.contador('resultado_sin_verificar', '10.0.1.1') = antes);
end $$;
select prueba.ip('10.0.1.2');
select prueba.ok('otra IP sigue pudiendo', public.metas_guardar(prueba.lote('OTRA', 20)) = 20);

-- ─────────────────────────────────────────────────────────────────────────
\echo '— progreso: 60 alumnos por dispositivo, 500 dispositivos nuevos por IP, 40 KB'
select prueba.ip('10.0.2.1');
create or replace function prueba.prog(disp text, alumno text, resumen jsonb default '{"xp_index":10}')
returns boolean language sql as $$
  select public.metas_guardar_progreso(jsonb_build_object('dispositivo', disp, 'alumno', alumno,
           'grado', '6º-1', 'docente', 'Nadie En Particular', 'resumen', resumen));
$$;
do $$ declare i int; begin
  for i in 1..60 loop perform prueba.prog('D-COMPARTIDO', 'Alumno ' || i); end loop;
end $$;
select prueba.ok('60 alumnos en un dispositivo entran',
  (select count(*) from public.progreso where dispositivo = 'D-COMPARTIDO') = 60);
select prueba.prog('D-COMPARTIDO', 'Alumno 61');
select prueba.ok('el alumno 61 de ese dispositivo se salta',
  (select count(*) from public.progreso where dispositivo = 'D-COMPARTIDO') = 60);
select prueba.prog('D-COMPARTIDO', 'Alumno 7', '{"xp_index":999}');
select prueba.ok('actualizar a un alumno que ya está pasa siempre',
  (select resumen ->> 'xp_index' from public.progreso where dispositivo = 'D-COMPARTIDO' and alumno = 'Alumno 7') = '999');
do $$ declare i int; begin
  for i in 2..500 loop perform prueba.prog('D-NUEVO-' || i, 'Alguien'); end loop;
end $$;
select prueba.ok('500 dispositivos nuevos desde una IP entran',
  (select count(distinct dispositivo) from public.progreso
    where dispositivo = 'D-COMPARTIDO' or dispositivo like 'D-NUEVO-%') = 500);
select prueba.prog('D-NUEVO-501', 'Alguien');
select prueba.ok('el 501 se salta', not exists (select 1 from public.progreso where dispositivo = 'D-NUEVO-501'));
select prueba.prog('D-NUEVO-5', 'Otro alumno');
select prueba.ok('un alumno nuevo en un dispositivo ya conocido no gasta cupo de dispositivos',
  exists (select 1 from public.progreso where dispositivo = 'D-NUEVO-5' and alumno = 'Otro alumno'));
select prueba.ip('10.0.2.2');
select prueba.prog('D-NUEVO-501', 'Alguien');
select prueba.ok('desde otra IP ese dispositivo sí entra', exists (select 1 from public.progreso where dispositivo = 'D-NUEVO-501'));
-- Tamaño: 39 000 bytes pasan (más que el resumen más grande posible), 41 000 no.
select prueba.prog('D-GRANDE', 'Grande', jsonb_build_object('relleno', repeat('a', 39000)));
select prueba.ok('un resumen de 39 KB entra', exists (select 1 from public.progreso where dispositivo = 'D-GRANDE'));
select prueba.prog('D-ENORME', 'Enorme', jsonb_build_object('relleno', repeat('a', 41000)));
select prueba.ok('uno de 41 KB se salta', not exists (select 1 from public.progreso where dispositivo = 'D-ENORME'));
select prueba.prog('D-GRANDE', 'Grande', jsonb_build_object('relleno', repeat('b', 41000)));
select prueba.ok('…y tampoco puede engordar una fila que ya existe',
  (select left(resumen ->> 'relleno', 1) from public.progreso where dispositivo = 'D-GRANDE') = 'a');

-- ─────────────────────────────────────────────────────────────────────────
\echo '— docente_estado: 3 MB, nombre de clave, 16 claves; historial y candado intactos'
select prueba.sin_api();
create temp table yo as
  select codigo from public.docentes where correo = 'ficticia2@prueba.invalid';
create or replace function prueba.guardar(entradas jsonb) returns int language sql as $$
  select public.metas_docente_estado_guardar((select codigo from yo), 'clave-prueba', entradas, false);
$$;
create or replace function prueba.e(k text, raw text, v bigint default 1) returns jsonb language sql as $$
  select jsonb_build_object('k', k, 'valor', jsonb_build_object('raw', raw), 'version', v, 'dispositivo', 'P');
$$;
select prueba.ok('las 8 claves de la app entran',
  prueba.guardar(jsonb_build_array(
    prueba.e('METAS_ADMIN_V1', '{}'), prueba.e('METAS_AVISOS_V1', '{}'), prueba.e('METAS_PLANACCION_V1', '{}'),
    prueba.e('METAS_CODIGOS_V1', '{}'), prueba.e('METAS_CAMP_V1', '{}'), prueba.e('METAS_CAMP_BANK_EXTRA_V1', '{}'),
    prueba.e('METAS_CAMP_USED_V1', '{}'), prueba.e('meta_ge_v2', '{}'))) = 8);
-- 2,1 MB: lo que mide un aula realista de 10 grupos por el espejo viejo.
select prueba.ok('un aula de 10 grupos (2,1 MB) se guarda',
  prueba.guardar(jsonb_build_array(prueba.e('METAS_ADMIN_V1', repeat('x', 2200000), 2))) = 1);
select prueba.ok('…y el historial guardó la versión anterior',
  exists (select 1 from public.docente_estado_hist h join yo using (codigo) where h.k = 'METAS_ADMIN_V1'));
create temp table hist_antes as select count(*) n from public.docente_estado_hist;
select prueba.ok('3,2 MB no se guarda: la función vieja devuelve 0, no revienta',
  prueba.guardar(jsonb_build_array(prueba.e('METAS_ADMIN_V1', repeat('y', 3300000), 3))) = 0);
select prueba.ok('…lo que había sigue intacto',
  (select left(valor ->> 'raw', 1) from public.docente_estado d join yo using (codigo) where d.k = 'METAS_ADMIN_V1') = 'x');
select prueba.ok('…y el historial no anotó una escritura que no ocurrió',
  (select count(*) from public.docente_estado_hist) = (select n from hist_antes));
select prueba.ok('en un lote, la entrada grande se cae y las demás entran (2 de 3)',
  prueba.guardar(jsonb_build_array(prueba.e('METAS_PLANACCION_V1', '{"a":1}', 5),
    prueba.e('METAS_ADMIN_V1', repeat('y', 3300000), 5), prueba.e('meta_ge_v2', '{"b":2}', 5))) = 2);
select prueba.ok('una clave con espacios no entra', prueba.guardar(jsonb_build_array(prueba.e('mala clave', '{}'))) = 0);
select prueba.ok('una clave de 41 letras no entra', prueba.guardar(jsonb_build_array(prueba.e(repeat('K', 41), '{}'))) = 0);
select prueba.ok('8 claves más (hasta 16) entran',
  prueba.guardar((select jsonb_agg(prueba.e('EXTRA_' || g, '{}')) from generate_series(1, 8) g)) = 8);
select prueba.ok('la 17 no entra', prueba.guardar(jsonb_build_array(prueba.e('EXTRA_17', '{}'))) = 0);
select prueba.ok('con 16 claves, actualizar una que ya existe pasa',
  prueba.guardar(jsonb_build_array(prueba.e('METAS_CAMP_V1', '{"t":1}', 9))) = 1);
do $$
begin
  perform metas.blob_guardar_prueba((select codigo from yo),
    jsonb_build_array(prueba.e('METAS_PLANACCION_V1', repeat('z', 3300000), 20)));
  raise exception 'no saltó';
exception when others then
  perform prueba.ok('por metas.blob_guardar el lote falla con valor_demasiado_grande (' || sqlerrm || ')',
    sqlerrm = 'valor_demasiado_grande');
end $$;
select prueba.ok('el candado y el historial siguen puestos',
  (select count(*) from pg_trigger where tgrelid = 'public.docente_estado'::regclass
     and tgname in ('docente_estado_candado', 'docente_estado_hist_trg', 'docente_estado_topes')) = 3);

-- ─────────────────────────────────────────────────────────────────────────
\echo '— consultas por páginas: la misma regla, todas las filas'
select prueba.sin_api();
select prueba.alta('Maestra Paginas Larga', 'paginas@prueba.invalid');
select prueba.alta('Maestra Paginas Larga Segunda', 'rival@prueba.invalid');   -- «rival»: su nombre contiene el de la primera
create temp table pm as
  select codigo from public.docentes where correo = 'paginas@prueba.invalid';
-- 2 345 verificadas (con fechas repetidas de a cinco, para probar el
-- desempate por id), 50 por nombre sin código, 20 del rival y 30 ajenas.
insert into public.resultados (evento_id, tipo, mision, nota, base, alumno, docente, docente_codigo, verificado, creado_en)
select 'PAG-' || g, 'evaluacion', 'prueba', 80, 100, 'A' || g, 'Maestra Paginas Larga', (select codigo from pm), true,
       timestamptz '2026-11-01' + ((g / 5) || ' minutes')::interval
  from generate_series(1, 2345) g;
insert into public.resultados (evento_id, tipo, mision, nota, base, alumno, docente, creado_en)
select 'NOM-' || g, 'evaluacion', 'prueba', 80, 100, 'N' || g, 'maestra páginas larga', timestamptz '2026-10-01' + (g || ' minutes')::interval
  from generate_series(1, 50) g;
insert into public.resultados (evento_id, tipo, mision, nota, base, alumno, docente, creado_en)
select 'RIV-' || g, 'evaluacion', 'prueba', 80, 100, 'R' || g, 'Maestra Paginas Larga Segunda', timestamptz '2026-10-02' + (g || ' minutes')::interval
  from generate_series(1, 20) g;
insert into public.resultados (evento_id, tipo, mision, nota, base, alumno, docente, docente_codigo, verificado, creado_en)
select 'AJE-' || g, 'evaluacion', 'prueba', 80, 100, 'X' || g, 'Otra Persona', 'PROF-AJENO', true, timestamptz '2026-11-02'
  from generate_series(1, 30) g;

create temp table vistos (id bigint, pagina int);
do $$
declare
  f timestamptz := null; i bigint := null; pag int := 0; n int;
  r public.resultados;
begin
  loop
    pag := pag + 1;
    n := 0;
    for r in select * from public.metas_consultar_docente_pag((select codigo from pm), 'clave-prueba', f, i, 500) loop
      insert into vistos values (r.id, pag);
      f := r.creado_en; i := r.id; n := n + 1;
    end loop;
    exit when n < 500 or pag > 40;
  end loop;
  perform prueba.ok('páginas de 500 hasta la corta: ' || pag || ' páginas', pag = 5);
end $$;
select prueba.ok('llegan las 2 395 del maestro (2 345 verificadas + 50 por nombre)', (select count(*) from vistos) = 2395);
select prueba.ok('ninguna repetida', (select count(distinct id) from vistos) = 2395);
select prueba.ok('ninguna del rival ni ajena',
  not exists (select 1 from vistos v join public.resultados r using (id) where r.evento_id like 'RIV-%' or r.evento_id like 'AJE-%'));
select prueba.ok('la consulta vieja se queda corta (2 000) y todo lo suyo está en las páginas',
  (select count(*) from public.metas_consultar_docente((select codigo from pm), 'clave-prueba')) = 2000
  and not exists (select 1 from public.metas_consultar_docente((select codigo from pm), 'clave-prueba') o
                   where o.id not in (select id from vistos)));
select prueba.ok('pedir 5 000 de una vez entrega 1 000',
  (select count(*) from public.metas_consultar_docente_pag((select codigo from pm), 'clave-prueba', null, null, 5000)) = 1000);
select prueba.ok('con la contraseña mal no entrega nada',
  (select count(*) from public.metas_consultar_docente_pag((select codigo from pm), 'otra', null, null, 500)) = 0);

-- Progreso: 1 234 fotos del maestro, 10 del rival.
insert into public.progreso (dispositivo, alumno, docente, resumen, actualizado_en)
select 'PD-' || g, 'Alumno ' || g, 'Maestra Paginas Larga', '{}', timestamptz '2026-11-01' + ((g / 3) || ' seconds')::interval
  from generate_series(1, 1234) g;
insert into public.progreso (dispositivo, alumno, docente, resumen)
select 'PR-' || g, 'Alumno ' || g, 'Maestra Paginas Larga Segunda', '{}' from generate_series(1, 10) g;
create temp table vistos_p (id bigint);
do $$
declare f timestamptz := null; i bigint := null; pag int := 0; n int; p public.progreso;
begin
  loop
    pag := pag + 1; n := 0;
    for p in select * from public.metas_consultar_progreso_docente_pag((select codigo from pm), 'clave-prueba', f, i, 500) loop
      insert into vistos_p values (p.id);
      f := p.actualizado_en; i := p.id; n := n + 1;
    end loop;
    exit when n < 500 or pag > 40;
  end loop;
end $$;
select prueba.ok('progreso: llegan las 1 234, sin repetir y sin las del rival',
  (select count(*) from vistos_p) = 1234 and (select count(distinct id) from vistos_p) = 1234
  and not exists (select 1 from vistos_p v join public.progreso p using (id) where p.dispositivo like 'PR-%'));
select prueba.ok('progreso: la consulta vieja se queda en 1 000',
  (select count(*) from public.metas_consultar_progreso_docente((select codigo from pm), 'clave-prueba')) = 1000);

-- ─────────────────────────────────────────────────────────────────────────
\echo '— permisos'
select prueba.ok('anon NO puede llamar los ayudantes ni los disparadores',
  not has_function_privilege('anon', 'public._metas_tope_sumar(text,text)', 'execute')
  and not has_function_privilege('anon', 'public._metas_ip_peticion()', 'execute')
  and not has_function_privilege('anon', 'public._metas_topes_progreso()', 'execute'));
select prueba.ok('anon SÍ puede llamar las dos consultas por páginas',
  has_function_privilege('anon', 'public.metas_consultar_docente_pag(text,text,timestamptz,bigint,integer)', 'execute')
  and has_function_privilege('anon', 'public.metas_consultar_progreso_docente_pag(text,text,timestamptz,bigint,integer)', 'execute'));
select prueba.ok('anon no toca la tabla de contadores',
  not has_table_privilege('anon', 'public.metas_topes_dia', 'select')
  and not has_table_privilege('anon', 'public.metas_topes_dia', 'insert'));
select prueba.ok('todas las funciones nuevas: security definer y search_path',
  (select bool_and(prosecdef and proconfig @> array['search_path=public']) and count(*) = 8
     from pg_proc where pronamespace = 'public'::regnamespace
      and proname in ('_metas_ip_peticion','_metas_tope_sumar','_metas_topes_progreso','_metas_topes_resultados',
                      '_metas_topes_docentes','_metas_topes_docente_estado',
                      'metas_consultar_docente_pag','metas_consultar_progreso_docente_pag')));

-- ─────────────────────────────────────────────────────────────────────────
\echo '— deshacer: quitar los disparadores no borra nada'
create temp table cuentas_antes as
  select (select count(*) from public.resultados) r, (select count(*) from public.progreso) p,
         (select count(*) from public.docentes) d, (select count(*) from public.docente_estado) e;
drop trigger if exists progreso_topes       on public.progreso;
drop trigger if exists resultados_topes     on public.resultados;
drop trigger if exists docentes_topes       on public.docentes;
drop trigger if exists docente_estado_topes on public.docente_estado;
select prueba.ok('las cuatro tablas tienen las mismas filas que antes',
  (select (select count(*) from public.resultados) = r and (select count(*) from public.progreso) = p
      and (select count(*) from public.docentes) = d and (select count(*) from public.docente_estado) = e
     from cuentas_antes));
select prueba.ip('10.0.1.1');
select prueba.ok('sin disparadores, esa IP vuelve a poder escribir sin verificar',
  public.metas_guardar(prueba.lote('DESPUES', 5)) = 5);
