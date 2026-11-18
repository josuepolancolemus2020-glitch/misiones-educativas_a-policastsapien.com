-- ============================================================================
-- Capa A · pruebas de la base (datos FICTICIOS, Postgres local desechable)
-- ----------------------------------------------------------------------------
-- Cada prueba deja una fila en prueba.resultados. Al final, si alguna falló,
-- el archivo termina con error (y corre.sh también).
--   prueba.como('A' | 'B' | 'panel' | 'padre1' | 'padre2' | 'nadie')
--     fija los «claims» del JWT como lo hace Supabase en cada petición; después
--     se cambia de rol con SET ROLE authenticated / anon / service_role.
-- ============================================================================
\set QUIET on
\o /dev/null
select set_config('prueba.conninfo', :'conninfo', false);

create schema prueba;
grant usage on schema prueba to public;
create table prueba.resultados (n serial primary key, nombre text, ok boolean, detalle text);
grant insert, select on prueba.resultados to public;
grant usage on sequence prueba.resultados_n_seq to public;

create function prueba.ok(p_cond boolean, p_nombre text, p_detalle text default null)
returns boolean language plpgsql as $$
begin
  insert into prueba.resultados (nombre, ok, detalle) values (p_nombre, coalesce(p_cond, false), p_detalle);
  return coalesce(p_cond, false);
end $$;

-- Ejecuta p_sql y espera que FALLE (con ese SQLSTATE si se da).
create function prueba.falla(p_sql text, p_nombre text, p_estado text default null)
returns boolean language plpgsql as $$
begin
  execute p_sql;
  return prueba.ok(false, p_nombre, 'no falló: ' || left(p_sql, 120));
exception when others then
  return prueba.ok(p_estado is null or sqlstate = p_estado, p_nombre, sqlstate || ' ' || sqlerrm);
end $$;

-- Devuelve el SQLSTATE y el mensaje de un error (para comparar dos errores).
create function prueba.error_de(p_sql text) returns text language plpgsql as $$
begin
  execute p_sql;
  return 'sin error';
exception when others then
  return sqlstate || '|' || sqlerrm;
end $$;

create function prueba.como(p_quien text, p_aparato text default 'telefono') returns void language plpgsql as $$
declare v_claims jsonb;
begin
  v_claims := case p_quien
    when 'A'      then '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated","is_anonymous":false}'
    when 'B'      then '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated","is_anonymous":false}'
    when 'panel'  then '{"sub":"00000000-0000-0000-0000-0000000000c0","role":"authenticated","is_anonymous":false}'
    when 'padre1' then '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated","is_anonymous":true}'
    when 'padre2' then '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated","is_anonymous":true}'
    when 'padre3' then '{"sub":"00000000-0000-0000-0000-0000000000f3","role":"authenticated","is_anonymous":true}'
    else '{}' end::jsonb;
  perform set_config('request.jwt.claims', v_claims::text, false);
  perform set_config('request.headers', jsonb_build_object('x-metas-aparato', p_aparato)::text, false);
end $$;
grant execute on all functions in schema prueba to public;

-- Ids fijos para leer las pruebas con calma.
\set aula      '''00000000-0000-0000-0000-0000000a0001'''
\set aula_vac  '''00000000-0000-0000-0000-0000000a0002'''
\set ana       '''00000000-0000-0000-0000-0000000b0001'''
\set beto      '''00000000-0000-0000-0000-0000000b0002'''
\set carla     '''00000000-0000-0000-0000-0000000b0003'''
\set dani      '''00000000-0000-0000-0000-0000000b0004'''
\set eva       '''00000000-0000-0000-0000-0000000b0005'''
\set fito      '''00000000-0000-0000-0000-0000000b0006'''
\set gabi      '''00000000-0000-0000-0000-0000000b0007'''
\set c1        '''00000000-0000-0000-0000-0000000c0001'''
\set c2        '''00000000-0000-0000-0000-0000000c0002'''
\set c3        '''00000000-0000-0000-0000-0000000c0003'''
\set mate      '''00000000-0000-0000-0000-0000000d0001'''

-- ════════════════════════════════════════════════════════════════════════════
-- Preparación: la docente A arma su aula (como lo haría la app nueva)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
insert into metas.aulas (id, escuela, grado, seccion, anio_lectivo, docente_nombre)
values (:aula, 'Escuela Ficticia Las Flores', 6, '1', 2027, 'Docente Ficticia A'),
       (:aula_vac, 'Escuela Ficticia Las Flores', 5, '2', 2027, 'Docente Ficticia A');
insert into metas.asignaturas (id, aula_id, nombre) values (:mate, :aula, 'Matemáticas');
select metas.alumno_crear(:ana,   gen_random_uuid(), :aula, '{"nombre_completo":"Alumna Ficticia Uno","identidad":"0000-2015-00001","num_lista":1}');
select metas.alumno_crear(:beto,  gen_random_uuid(), :aula, '{"nombre_completo":"Alumno Ficticio Dos","identidad":"0000201500002","num_lista":2}');
select metas.alumno_crear(:carla, gen_random_uuid(), :aula, '{"nombre_completo":"Alumna Ficticia Tres","num_lista":3}');
select metas.alumno_crear(:dani,  gen_random_uuid(), :aula, '{"nombre_completo":"Alumno Ficticio Cuatro","num_lista":4}');
select metas.alumno_crear(:eva,   gen_random_uuid(), :aula, '{"nombre_completo":"Alumna Ficticia Cinco","num_lista":5}');
select metas.alumno_crear(:fito,  gen_random_uuid(), :aula, '{"nombre_completo":"Alumno Ficticio Seis","num_lista":6}');
select metas.alumno_crear(:gabi,  gen_random_uuid(), :aula, '{"nombre_completo":"Alumna Ficticia Siete","num_lista":7}');
-- Colectas solo por funciones (rev. 5)
select metas.colecta_crear(:c1, gen_random_uuid(), :aula, 'Excursión (ficticia)', '50', '2027-02-01');
select metas.colecta_crear(:c2, gen_random_uuid(), :aula, 'Refrigerio (ficticio)', '100', '2027-02-01');
select metas.colecta_crear(:c3, gen_random_uuid(), :aula, 'Monedas (ficticio)', '0', '2027-02-01');
reset role;

select prueba.ok((select count(*) from metas.alumnos) = 7, 'preparación: 7 alumnos creados');
select prueba.ok((select owner from metas.aulas where id = :aula) = '00000000-0000-0000-0000-00000000000a',
                 'sello: el dueño lo pone la base (auth.uid)');
select prueba.ok((select device_id from metas.aulas where id = :aula) = 'telefono',
                 'sello: device_id sale de la cabecera x-metas-aparato');
select prueba.ok((select identidad from metas.alumnos where id = :ana) = '0000201500001',
                 'identidad normalizada sin guiones');

-- ════════════════════════════════════════════════════════════════════════════
-- S · Seguridad de las sesiones
-- ════════════════════════════════════════════════════════════════════════════
-- S1: una sesión ANÓNIMA (padre) intenta crear de todo
select prueba.como('padre1');
set role authenticated;
select prueba.falla($$insert into metas.aulas (escuela, grado, seccion, anio_lectivo) values ('X', 6, '1', 2027)$$,
                    'S1 padre anónimo no crea aulas', '42501');
select prueba.falla($$select metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000a0001', '{"nombre_completo":"Intruso Ficticio"}')$$,
                    'S1 padre anónimo no crea alumnos (función)', '42501');
select prueba.falla($$insert into metas.familias (aula_id, alumno_id) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0001')$$,
                    'S1 padre anónimo no crea familias', '42501');
select prueba.falla($$select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000c0001', '00000000-0000-0000-0000-0000000b0001', '50.00', '2027-02-02')$$,
                    'S1 padre anónimo no crea pagos', '42501');
-- S4: lee directo las tablas → 0 filas
select prueba.ok((select count(*) from metas.pagos) = 0 and (select count(*) from metas.alumnos) = 0
             and (select count(*) from metas.auditoria) = 0 and (select count(*) from metas.rechazos) = 0
             and (select count(*) from metas.recibo_series) = 0 and (select count(*) from metas.claves_archivo) = 0,
                 'S4 padre anónimo: 0 filas en tablas del docente');
reset role;

-- S2: no se averigua una clave insertando: mismo error exista o no
select prueba.como('padre1');
set role authenticated;
select prueba.ok(
  prueba.error_de($$insert into metas.familias (aula_id, alumno_id, clave) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0001', '1K7QM')$$)
  = prueba.error_de($$insert into metas.familias (aula_id, alumno_id, clave) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0001', '8NOEXISTE')$$),
  'S2 mismo error con clave existente y con clave inventada');
reset role;

-- S3: usuario de Auth SIN vínculo (cuenta del panel) = como un extraño
select prueba.como('panel');
set role authenticated;
select prueba.falla($$insert into metas.aulas (escuela, grado, seccion, anio_lectivo) values ('X', 6, '1', 2027)$$,
                    'S3 usuario sin vínculo no crea', '42501');
select prueba.ok((select count(*) from metas.aulas) = 0, 'S3 usuario sin vínculo no lee');
reset role;

-- S3b: el rol anon ni siquiera ve el esquema
select prueba.como('nadie');
set role anon;
select prueba.falla($$select * from metas.pagos$$, 'S3b anon sin permiso sobre metas', '42501');
reset role;

-- S6/S7: sin DELETE físico; auditoría intocable
select prueba.como('A');
set role authenticated;
select prueba.falla($$delete from metas.alumnos where id = '00000000-0000-0000-0000-0000000b0001'$$, 'S6 sin DELETE físico (authenticated)', '42501');
select prueba.falla($$update metas.auditoria set accion = 'crear'$$, 'S7 auditoría no se edita', '42501');
reset role;
set role service_role;
select prueba.falla($$delete from metas.alumnos where id = '00000000-0000-0000-0000-0000000b0001'$$, 'S6 sin DELETE físico (service_role)');
select prueba.falla($$delete from metas.auditoria$$, 'S7 auditoría no se borra (service_role)');
reset role;
select prueba.falla($$truncate metas.auditoria$$, 'S7 auditoría no se vacía ni como dueño', 'MT006');

-- S8: tope de rechazos (16 KB)
select prueba.como('A');
set role authenticated;
select prueba.falla($$insert into metas.rechazos (operacion) values (jsonb_build_object('x', repeat('a', 20000)))$$,
                    'S8 rechazo de más de 16 KB no entra', '23514');
reset role;

-- S9: ninguna función de metas ejecutable por PUBLIC
select prueba.ok((select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                   where n.nspname = 'metas' and has_function_privilege('public', p.oid, 'execute')) = 0,
                 'S9 ninguna función de metas abierta a PUBLIC');

-- ════════════════════════════════════════════════════════════════════════════
-- F · Lo que falta por recaudar (colecta C1, sugerido 50)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c1, :carla, null);
select metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c1, :dani, '25');
select metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c1, :gabi, null);
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :ana,  '50.00', '2027-02-02');
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :dani, '10.00', '2027-02-02');
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :fito, '70.00', '2027-02-02');
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :eva,  '30.00', '2027-02-02');
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :gabi, '20.00', '2027-02-02');
update metas.alumnos set estado = 'trasladado' where id = :eva;
select prueba.ok((select aplicable = '0.00' and falta = '0.00' and situacion = 'no_corresponde' from metas.v_colecta_alumnos
                   where colecta_id = :c1 and alumno_id = :carla), 'F1 exento total: no le falta nada');
select prueba.ok((select aplicable = '25.00' and pagado = '10.00' and falta = '15.00' from metas.v_colecta_alumnos
                   where colecta_id = :c1 and alumno_id = :dani), 'F2 exento parcial: falta 15');
select prueba.ok((select falta = '0.00' and pago_de_mas = '20.00' and situacion = 'pago_de_mas' from metas.v_colecta_alumnos
                   where colecta_id = :c1 and alumno_id = :fito), 'F3 pagó de más: falta 0, pago de más 20');
select prueba.ok((select falta = '0.00' and situacion = 'ya_no_esta' from metas.v_colecta_alumnos
                   where colecta_id = :c1 and alumno_id = :eva), 'F4 trasladado: no le falta, ya no está');
select prueba.ok((select falta = '0.00' and pago_de_mas = '20.00' from metas.v_colecta_alumnos
                   where colecta_id = :c1 and alumno_id = :gabi), 'F5 exento que igual pagó: pago de más 20');
select prueba.ok((select esperados = 4 and meta = '175.00' and recaudado = '180.00' and falta_total = '65.00'
                          and pago_de_mas_total = '40.00' and pagaron = 5
                    from metas.v_colectas_resumen where colecta_id = :c1),
                 'F resumen: esperados 4, meta 175, recaudado 180 (incluye al trasladado), falta 65');
reset role;

-- ════════════════════════════════════════════════════════════════════════════
-- K · Claves de familia (copia inmutable del paso 1)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.ok((select count(*) from metas.claves_archivo where docente_codigo = 'PROF-AAAA000001') = 4,
                 'K0 copia del paso 1: las 4 claves de A (sin repetir)');
select prueba.ok(not exists (select 1 from metas.claves_archivo where docente_codigo = 'PROF-CCCC000003'),
                 'K0 un raw inválido no rompe la copia');
select prueba.falla($$update metas.claves_archivo set clave = 'X'$$, 'K0 la copia de claves es inmutable', 'MT006');
-- Cambiar el blob vivo DESPUÉS del paso 1 no cambia lo que se puede conservar
update public.docente_estado set valor = jsonb_build_object('raw', '{"G:G1":{"5":"5NUEVA"}}')
 where codigo = 'PROF-BBBB000002' and k = 'METAS_CODIGOS_V1';       -- B no está vinculado: se deja

select prueba.como('A');
set role authenticated;
insert into metas.familias (aula_id, alumno_id) values (:aula, :beto);
select prueba.ok((select clave ~ '^[A-HJ-NP-Z2-9]{10}$' and clave_origen = 'nueva' from metas.familias where alumno_id = :beto),
                 'K1 clave nueva de 10 símbolos sin I, O, 0 ni 1');
insert into metas.familias (aula_id, alumno_id, clave) values (:aula, :ana, '1-K7QM');
select prueba.ok((select clave = '1K7QM' and clave_origen = 'conservada' from metas.familias where alumno_id = :ana),
                 'K2 clave conservada que estaba en la copia de A');
select prueba.falla($$insert into metas.familias (aula_id, alumno_id, clave) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0003', '2ZZZZ')$$,
                    'K3 la clave de otro docente no se conserva', 'MT020');
select prueba.falla($$update metas.familias set clave = '2PRBA' where alumno_id = '00000000-0000-0000-0000-0000000b0001'$$,
                    'K4 la clave no se cambia', 'MT002');
select prueba.falla($$insert into metas.familias (aula_id, alumno_id, clave) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0003', '1K7QM')$$,
                    'K5 clave conservada ya ocupada → 23505 (la carga rápida ofrece una nueva)', '23505');
insert into metas.familias (aula_id, alumno_id) values (:aula, :dani), (:aula, :eva);
reset role;

-- N2 antes de que B se vincule: su familia todavía ve el dinero del archivo
set role anon;
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('5NUEVA') where tipo = 'economia') = 1,
                 'N2 docente aún sin vincular: su familia ve sus pagos del archivo');
reset role;
-- B se vincula DESPUÉS del paso 1: su copia se toma en ese momento
set role service_role;
select metas.cuenta_registrar('00000000-0000-0000-0000-00000000000b', 'PROF-BBBB000002',
                              'prof-bbbb000002@cuentas.metas.policastsapien.com');
reset role;
select prueba.ok(exists (select 1 from metas.claves_archivo where docente_codigo = 'PROF-BBBB000002' and clave = '5NUEVA'),
                 'K6 quien se vincula después del paso 1 tiene su copia al vincularse');
set role anon;
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('5NUEVA') where tipo = 'economia') = 0,
                 'N2 en cuanto B se vincula, el archivo deja de mostrar su dinero');
reset role;

-- S5: B no ve ni toca lo de A aunque conozca los uuid
select prueba.como('B');
set role authenticated;
select prueba.ok((select count(*) from metas.alumnos) = 0, 'S5 B no ve alumnos de A');
select prueba.ok((metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c1, :ana, '50.00', '2027-02-02') ->> 'motivo') = 'colecta',
                 'S5 B recibe «colecta» (no existe para él)');
reset role;


-- ════════════════════════════════════════════════════════════════════════════
-- M · Dinero (colecta C2, sugerido 100)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
-- M1: no hay upsert ni escritura directa de pagos
select prueba.falla($$insert into metas.pagos (aula_id, colecta_id, alumno_id, monto, fecha) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000c0002', '00000000-0000-0000-0000-0000000b0002', 1, '2027-02-02') on conflict (id) do update set monto = 2$$,
                    'M1 upsert de pagos denegado', '42501');
select prueba.falla($$insert into metas.convocatoria_pagos (convocatoria_id, huella, monto, fecha) values (gen_random_uuid(), 'x', 1, '2027-02-02') on conflict (id) do nothing$$,
                    'M1 upsert de pagos de convocatoria denegado', '42501');
-- M2: el monto y la fecha no se editan
select prueba.falla($$update metas.pagos set monto = 1$$, 'M2 update directo del monto denegado', '42501');
select prueba.ok((metas.pago_editar((select id from metas.pagos where alumno_id = '00000000-0000-0000-0000-0000000b0001' limit 1),
                                    '{"monto":"1.00"}', gen_random_uuid()) ->> 'motivo') = 'campo_no_editable',
                 'M2 pago_editar no cambia el monto');
select prueba.ok((metas.pago_editar((select id from metas.pagos where alumno_id = '00000000-0000-0000-0000-0000000b0001' limit 1),
                                    '{"fecha":"2027-02-09"}', gen_random_uuid()) ->> 'motivo') = 'campo_no_editable',
                 'M2 la fecha de un pago numerado tampoco se edita');
reset role;

-- M3: corregir 50 → 60 = anular + nuevo con otro recibo
create temp table t (k text primary key, v jsonb);
grant all on t to public;
select prueba.como('A');
set role authenticated;
insert into t values ('p1', metas.pago_crear('00000000-0000-0000-0000-00000000e001', '00000000-0000-0000-0000-0000000f0001',
                                             :c2, :ana, '50.00', '2027-03-03'));
insert into t values ('p1c', metas.pago_corregir('00000000-0000-0000-0000-00000000e001', '{"monto":"50.00","fecha":"2027-03-03"}',
                                                 '00000000-0000-0000-0000-00000000e002', '00000000-0000-0000-0000-0000000f0002',
                                                 '60.00', '2027-03-03', 'se anotó mal'));
select prueba.ok((select (v ->> 'ok')::boolean and v -> 'pago' ->> 'monto' = '60.00'
                          and v -> 'pago' ->> 'reemplaza_a' = '00000000-0000-0000-0000-00000000e001'
                          and v -> 'pago' ->> 'recibo' <> (select v -> 'pago' ->> 'recibo' from t where k = 'p1')
                   from t where k = 'p1c'), 'M3 corregir crea otro pago con otro recibo que reemplaza al viejo');
select prueba.ok((select deleted_at is not null and anulado_motivo = 'se anotó mal' from metas.pagos
                   where id = '00000000-0000-0000-0000-00000000e001'), 'M3 el viejo queda anulado con su motivo');
-- M15: el dinero sale como texto
select prueba.ok((select jsonb_typeof(v -> 'pago' -> 'monto') = 'string' from t where k = 'p1c'), 'M15 montos salen como texto');
-- M13: reenviar lo mismo no repite nada
select prueba.ok((metas.pago_crear('00000000-0000-0000-0000-00000000e001', '00000000-0000-0000-0000-0000000f0001',
                                   :c2, :ana, '50.00', '2027-03-03') ->> 'ya_estaba')::boolean,
                 'M13 reenviar pago_crear → ya estaba');
select prueba.ok((metas.pago_corregir('00000000-0000-0000-0000-00000000e001', '{"monto":"50.00","fecha":"2027-03-03"}',
                                      '00000000-0000-0000-0000-00000000e002', '00000000-0000-0000-0000-0000000f0002',
                                      '60.00', '2027-03-03') ->> 'ya_estaba')::boolean,
                 'M13 reenviar pago_corregir → ya estaba');
select prueba.ok((select count(*) from metas.pagos where colecta_id = :c2 and alumno_id = :ana) = 2,
                 'M13 sigue habiendo exactamente un pago anulado y uno vivo');
select prueba.ok((metas.pago_crear('00000000-0000-0000-0000-00000000e001', gen_random_uuid(),
                                   :c2, :ana, '50.00', '2027-03-03') ->> 'motivo') = 'id_ocupado',
                 'I4 mismo id con otra operación → id ocupado, no pisa');
-- M16: una colecta cerrada no se corrige (pago_corregir respeta el cierre)
\set c4 '''00000000-0000-0000-0000-0000000c0004'''
select metas.colecta_crear(:c4, gen_random_uuid(), :aula, 'Rifa (ficticia)', '20', '2027-02-01');
select metas.pago_crear('00000000-0000-0000-0000-00000000e401', gen_random_uuid(), :c4, :fito, '20.00', '2027-03-04');
select metas.gasto_crear('00000000-0000-0000-0000-00000000e402', gen_random_uuid(), :c4, '2027-03-05', 'Premio', '15.00');
select metas.exencion_poner('00000000-0000-0000-0000-00000000e403', gen_random_uuid(), :c4, :gabi, null);
select prueba.ok((metas.colecta_cerrar(:c4, gen_random_uuid()) ->> 'ok')::boolean, 'CC0 la docente cierra la colecta');
select prueba.ok((metas.colecta_cerrar(:c4, gen_random_uuid()) ->> 'ya_estaba')::boolean, 'CC0 cerrarla otra vez: ya estaba');
select prueba.ok((metas.pago_corregir('00000000-0000-0000-0000-00000000e401', '{"monto":"20.00","fecha":"2027-03-04"}',
                                      gen_random_uuid(), gen_random_uuid(), '25.00', '2027-03-04') ->> 'motivo') = 'colecta_cerrada',
                 'M16 corregir un pago de una colecta cerrada → «esa colecta ya está cerrada»');
select prueba.ok((select count(*) = 1 and bool_and(deleted_at is null and monto = '20.00') from metas.vd_pagos
                   where colecta_id = '00000000-0000-0000-0000-0000000c0004'),
                 'M16 el pago sigue igual: ni anulado ni reemplazado');

-- CC · Una colecta cerrada queda cerrada de verdad (regla de Josué, rev. 5)
select prueba.falla($$update metas.colectas set monto_sugerido = 30 where id = '00000000-0000-0000-0000-0000000c0004'$$,
                    'CC1 colectas ya no se editan directo', '42501');
select prueba.falla($$insert into metas.colectas (aula_id, concepto, monto_sugerido, fecha) values ('00000000-0000-0000-0000-0000000a0001', 'x', 1, '2027-01-01')$$,
                    'CC1 ni se crean directo', '42501');
select prueba.falla($$insert into metas.colecta_exenciones (aula_id, colecta_id, alumno_id) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000c0002', '00000000-0000-0000-0000-0000000b0002')$$,
                    'CC1 exenciones tampoco directo', '42501');
select prueba.ok((metas.pago_anular('00000000-0000-0000-0000-00000000e401', 'devuelto', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC2 pago_anular en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c4, :beto, '20.00', '2027-03-06') ->> 'motivo') = 'colecta_cerrada',
                 'CC2 pago_crear en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.pago_editar('00000000-0000-0000-0000-00000000e401', '{"nota":"en sobre"}', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC2 ni la nota de un pago cambia');
select prueba.ok((metas.gasto_crear(gen_random_uuid(), gen_random_uuid(), :c4, '2027-03-06', 'Bolsas', '5.00') ->> 'motivo') = 'colecta_cerrada',
                 'CC3 gasto_crear en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.gasto_editar('00000000-0000-0000-0000-00000000e402', '{"monto":"15.00"}', '{"monto":"12.00"}', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC3 gasto_editar en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.gasto_anular('00000000-0000-0000-0000-00000000e402', 'x', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC3 gasto_anular en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.colecta_editar(:c4, '{"monto_sugerido":"20.00"}', '{"monto_sugerido":"25.00"}', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC4 cambiar el monto sugerido de una colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.colecta_editar(:c4, '{}', '{"concepto":"Rifa grande"}', gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC4 ni el concepto');
select prueba.ok((metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c4, :beto, '10') ->> 'motivo') = 'colecta_cerrada',
                 'CC5 exención nueva en colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c4, :gabi, '5', null, '{"monto_aplicable":null}') ->> 'motivo') = 'colecta_cerrada',
                 'CC5 cambiar una exención de colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.exencion_quitar(:c4, :gabi, gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC5 quitar una exención de colecta cerrada → «colecta_cerrada»');
select prueba.ok((metas.colecta_borrar(:c4, gen_random_uuid()) ->> 'motivo') = 'colecta_cerrada',
                 'CC6 una colecta cerrada no se borra');
select prueba.ok((metas.gasto_editar('00000000-0000-0000-0000-00000000e402', '{}', '{"monto":"15.00"}', gen_random_uuid()) ->> 'ya_estaba')::boolean
                 and (metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c4, :gabi, null) ->> 'ya_estaba')::boolean,
                 'CC7 pedir lo que ya está (reenvío de la cola) no dice «cerrada»: ya estaba');
reset role;
select prueba.ok((select count(*) filter (where p.deleted_at is null and p.monto = 20 and p.nota is null) = 1 and count(*) = 1 from metas.pagos p where p.colecta_id = :c4)
                 and (select count(*) = 1 and bool_and(deleted_at is null and monto = 15) from metas.gastos where colecta_id = :c4)
                 and (select count(*) = 1 and bool_and(deleted_at is null and monto_aplicable is null) from metas.colecta_exenciones where colecta_id = :c4)
                 and (select monto_sugerido = 20 and concepto = 'Rifa (ficticia)' and deleted_at is null from metas.colectas where id = :c4),
                 'CC8 después de todos los intentos, la colecta cerrada está exactamente como se cerró');
-- Respaldo: ni un SQL a mano del dueño del esquema
select prueba.falla($$update metas.colectas set monto_sugerido = 30 where id = '00000000-0000-0000-0000-0000000c0004'$$,
                    'CC9 respaldo: una colecta cerrada no cambia ni a mano', 'MT050');
select prueba.falla($$update metas.pagos set nota = 'x' where id = '00000000-0000-0000-0000-00000000e401'$$,
                    'CC9 respaldo: ni un pago de una colecta cerrada', 'MT050');
select prueba.falla($$insert into metas.colecta_exenciones (aula_id, colecta_id, alumno_id) values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000c0004', '00000000-0000-0000-0000-0000000b0002')$$,
                    'CC9 respaldo: ni una exención', 'MT050');
-- Reabrir: deja registro (quién, cuándo, motivo opcional) y vuelve a dejar anotar
set role authenticated;
select prueba.ok((metas.colecta_reabrir(:c4, 'faltó anotar una devolución', gen_random_uuid()) ->> 'ok')::boolean,
                 'CC10 colecta_reabrir la abre');
select prueba.ok((metas.colecta_reabrir(:c4, null, gen_random_uuid()) ->> 'ya_estaba')::boolean, 'CC10 reabrir una abierta: ya estaba');
select prueba.ok((metas.pago_anular('00000000-0000-0000-0000-00000000e401', 'devuelto', gen_random_uuid()) ->> 'ok')::boolean,
                 'CC10 reabierta, el pago se anula');
select metas.colecta_cerrar(:c4, gen_random_uuid());
select prueba.ok((metas.pago_anular('00000000-0000-0000-0000-00000000e401', 'devuelto', gen_random_uuid()) ->> 'ya_estaba')::boolean,
                 'CC10 cerrada otra vez, el reenvío de esa anulación responde «ya estaba», no «cerrada»');
select prueba.ok((metas.colecta_reabrir(:c4) ->> 'ok')::boolean, 'CC10 reabrir sin motivo también se puede');
reset role;
select prueba.ok((select count(*) = 2
                         and bool_and(actor = '00000000-0000-0000-0000-00000000000a' and ocurrido_at is not null
                                      and antes ->> 'estado' = 'cerrada' and despues ->> 'estado' = 'abierta')
                         and bool_or(despues ->> 'motivo_reapertura' = 'faltó anotar una devolución')
                         and bool_or(despues ->> 'motivo_reapertura' is null)
                    from metas.auditoria where tabla = 'colectas' and fila_id = :c4 and campos @> array['estado']
                     and antes ->> 'estado' = 'cerrada'),
                 'CC11 cada reapertura queda en la auditoría: quién, cuándo y su motivo (o sin motivo)');
set role authenticated;
-- Lo de siempre sigue con colecta abierta: monto sugerido con pregunta
select prueba.ok((metas.colecta_editar(:c2, '{"monto_sugerido":"90.00"}', '{"monto_sugerido":"120.00"}', gen_random_uuid()) ->> 'pregunta')
                 = 'colecta_cambiada_en_otro_aparato', 'CC12 monto sugerido cambiado en otro aparato → pregunta');
select prueba.ok((metas.colecta_editar(:c2, '{}', '{"monto_sugerido":"120.00"}', gen_random_uuid()) ->> 'pregunta')
                 = 'colecta_sin_base', 'CC12 sin base → pregunta, no error');
select prueba.ok((metas.exencion_poner(gen_random_uuid(), gen_random_uuid(), :c1, :dani, '30') ->> 'pregunta')
                 = 'exencion_cambiada_en_otro_aparato', 'CC12 cambiar una exención sin saber que existía → pregunta');
-- M7: otro aparato ya lo corrigió (base vieja) → pregunta con los dos montos
insert into t values ('m7', metas.pago_corregir('00000000-0000-0000-0000-00000000e002', '{"monto":"55.00","fecha":"2027-03-03"}',
                                                gen_random_uuid(), gen_random_uuid(), '70.00', '2027-03-03'));
select prueba.ok((select v ->> 'pregunta' = 'pago_cambiado_en_otro_aparato' and v -> 'actual' ->> 'monto' = '60.00'
                          and v -> 'este' ->> 'monto' = '70.00' from t where k = 'm7'),
                 'M7 corregir sobre un monto que otro aparato cambió → pregunta «¿L 60 o L 70?»');
-- Punto 9: cambiar solo la nota NO hace preguntar al corregir
select metas.pago_editar('00000000-0000-0000-0000-00000000e002', '{"nota":"la mamá pagó en dos partes"}', gen_random_uuid());
insert into t values ('n9', metas.pago_corregir('00000000-0000-0000-0000-00000000e002', '{"monto":"60.00","fecha":"2027-03-03"}',
                                                '00000000-0000-0000-0000-00000000e003', gen_random_uuid(), '65.00', '2027-03-03'));
select prueba.ok((select (v ->> 'ok')::boolean from t where k = 'n9'),
                 'P9 una nota cambiada en otro aparato no es motivo para preguntar');
-- M8: la fecha cambiada en otro aparato SÍ pregunta
insert into t values ('m8', metas.pago_corregir('00000000-0000-0000-0000-00000000e003', '{"monto":"65.00","fecha":"2027-03-01"}',
                                                gen_random_uuid(), gen_random_uuid(), '65.00', '2027-03-05'));
select prueba.ok((select v ->> 'pregunta' = 'pago_cambiado_en_otro_aparato' from t where k = 'm8'),
                 'M8 fecha cambiada en otro aparato → pregunta');
-- M9: anular algo que otro aparato ya corrigió → pregunta
select prueba.ok((metas.pago_anular('00000000-0000-0000-0000-00000000e002', 'devuelto', gen_random_uuid()) ->> 'pregunta')
                 = 'pago_corregido_en_otro_aparato', 'M9 anular un pago ya corregido → pregunta');
-- M4: abonos
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '20.00', '2027-03-01');
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '20.00', '2027-03-02',
                        p_conocidos => array(select id from metas.pagos where colecta_id = :c2 and alumno_id = :beto and deleted_at is null));
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '20.00', '2027-03-03',
                        p_conocidos => array(select id from metas.pagos where colecta_id = :c2 and alumno_id = :beto and deleted_at is null));
select prueba.ok((select pagado = '60.00' and pagos = 3 from metas.v_colecta_alumnos where colecta_id = :c2 and alumno_id = :beto),
                 'M4 tres abonos de 20: pagado 60, tres pagos');
select prueba.ok((select count(distinct recibo) = 3 from metas.pagos where colecta_id = :c2 and alumno_id = :beto),
                 'M4 cada abono con su recibo');
-- M5/M6: un pago que este aparato no conocía → pregunta, con montos distintos o iguales
select prueba.ok((metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '60.00', '2027-03-04') ->> 'pregunta')
                 = 'otro_pago_sin_ver', 'M5 pago que no conocía (montos distintos) → pregunta');
select prueba.ok((metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '20.00', '2027-03-04') ->> 'pregunta')
                 = 'otro_pago_sin_ver', 'M6 con montos iguales también pregunta');
select prueba.ok((metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :beto, '15.00', '2027-03-04',
                                   p_son_distintos => true) ->> 'ok')::boolean, 'M5 «son dos pagos» → se guarda');
reset role;

-- M10-M12: gastos de colecta
select prueba.como('A');
set role authenticated;
insert into t values ('g1', metas.gasto_crear('00000000-0000-0000-0000-0000000e0101', gen_random_uuid(), :c1, '2027-02-05', 'Entradas', '40.00'));
select metas.gasto_editar('00000000-0000-0000-0000-0000000e0101', '{"monto":"40.00"}', '{"monto":"45.00"}', gen_random_uuid());
select prueba.ok((metas.gasto_editar('00000000-0000-0000-0000-0000000e0101', '{"monto":"40.00"}', '{"monto":"48.00"}', gen_random_uuid())
                  ->> 'pregunta') = 'gasto_cambiado_en_otro_aparato', 'M10 monto de gasto cambiado en otro aparato → pregunta');
select prueba.ok((metas.gasto_editar('00000000-0000-0000-0000-0000000e0101', '{}', '{"concepto":"Entradas al museo"}', gen_random_uuid())
                  ->> 'ok')::boolean, 'M10 el concepto se aplica sin preguntar');
select prueba.ok((metas.gasto_crear(gen_random_uuid(), gen_random_uuid(), :c1, '2027-02-05', 'Entradas', '45.00') ->> 'pregunta')
                 = 'otro_gasto_sin_ver', 'M11 mismo gasto anotado en otro aparato → pregunta');
select metas.gasto_anular('00000000-0000-0000-0000-0000000e0101', 'era de otra colecta', gen_random_uuid());
select prueba.ok((metas.gasto_editar('00000000-0000-0000-0000-0000000e0101', '{}', '{"concepto":"x"}', gen_random_uuid()) ->> 'motivo')
                 = 'anulado', 'M12 editar un gasto anulado → no se revive');
-- M14: 1 000 pagos de L 0.10 suman 100.00 exactos, con recibos seguidos
do $$
declare i int;
begin
  for i in 1..1000 loop
    perform metas.pago_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000c0003',
                             '00000000-0000-0000-0000-0000000b0006', '0.10', '2027-02-10', p_son_distintos => true);
  end loop;
end $$;
select prueba.ok((select recaudado = '100.00' from metas.v_colectas_resumen where colecta_id = :c3), 'M14 1 000 × 0.10 = 100.00 exacto');
reset role;
select prueba.ok((select count(distinct recibo) = count(*) and max(split_part(recibo, '-', 4)::int) - min(split_part(recibo, '-', 4)::int) + 1 = count(*)
                    from metas.pagos where owner = '00000000-0000-0000-0000-00000000000a'),
                 'R1 recibos únicos y correlativos sin huecos');
select prueba.ok((select bool_and(recibo ~ '^RC-[0-9]{2}-[A-HJ-NP-Z2-9]{4}-[0-9]{4}$') from metas.pagos), 'R1 formato RC-AA-SSSS-NNNN');
-- R7 (R5-3): el año del recibo sale de la FECHA del pago, no del reloj
select prueba.como('A');
set role authenticated;
select metas.pago_crear('00000000-0000-0000-0000-00000000e701', gen_random_uuid(), :c2, :gabi, '5.00', '2026-12-20');
select metas.pago_crear('00000000-0000-0000-0000-00000000e702', gen_random_uuid(), :c2, :gabi, '5.00', '2028-01-05', p_son_distintos => true);
reset role;
select prueba.ok((select recibo ~ '^RC-26-[A-HJ-NP-Z2-9]{4}-0001$' from metas.pagos where id = '00000000-0000-0000-0000-00000000e701'),
                 'R7 un pago del 20 de diciembre de 2026 lleva RC-26, y abre el correlativo de ese año');
select prueba.ok((select recibo ~ '^RC-28-[A-HJ-NP-Z2-9]{4}-0001$' from metas.pagos where id = '00000000-0000-0000-0000-00000000e702'),
                 'R7 uno de 2028 lleva RC-28, aunque el servidor esté en otro año');
select prueba.ok((select count(*) = 0 from metas.pagos where fecha between '2027-01-01' and '2027-12-31' and recibo not like 'RC-27-%'),
                 'R7 los de 2027 siguen en RC-27');

-- ════════════════════════════════════════════════════════════════════════════
-- B · Borrado protegido (incluida la carrera con dos sesiones de verdad)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select prueba.falla($$update metas.alumnos set deleted_at = now() where id = '00000000-0000-0000-0000-0000000b0001'$$,
                    'B1 no se borra un alumno con pagos', 'MT007');
select prueba.ok((metas.colecta_borrar('00000000-0000-0000-0000-0000000c0001', gen_random_uuid()) ->> 'motivo') = 'tiene_pagos_o_gastos',
                 'B2 no se borra una colecta con pagos');
reset role;
select prueba.falla($$update metas.colectas set deleted_at = now() where id = '00000000-0000-0000-0000-0000000c0001'$$,
                    'B2 ni con un SQL a mano (respaldo del disparador)', 'MT007');
set role authenticated;
select prueba.falla($$update metas.aulas set deleted_at = now() where id = '00000000-0000-0000-0000-0000000a0001'$$,
                    'B2 no se borra un aula con alumnos', 'MT007');
update metas.aulas set deleted_at = now() where id = :aula_vac;
select prueba.ok((select deleted_at is not null from metas.aulas where id = :aula_vac), 'B3 un aula vacía sí se borra');
select prueba.falla($$update metas.aulas set deleted_at = null where id = '00000000-0000-0000-0000-0000000a0002'$$,
                    'B3 lo borrado no se revive', 'MT001');
-- Un alumno sin pagos ni notas para la carrera
select metas.alumno_crear('00000000-0000-0000-0000-0000000b0099', gen_random_uuid(), :aula, '{"nombre_completo":"Alumno Ficticio Carrera"}');
reset role;

-- B4: la tablet anota una nota (transacción abierta) mientras la PC borra al alumno
do $$
declare
  c text := current_setting('prueba.conninfo');
  ini text := $i$select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated","is_anonymous":false}', false); set role authenticated;$i$;
  r text;
begin
  perform dblink_connect('tablet', c);
  perform dblink_connect('pc', c);
  perform dblink_exec('tablet', ini);
  perform dblink_exec('pc', ini);
  perform dblink_exec('tablet', 'begin');
  perform dblink_exec('tablet', $n$insert into metas.notas (aula_id, alumno_id, asignatura_id, periodo, valor)
                                  values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0099',
                                          '00000000-0000-0000-0000-0000000d0001', 'I', 85)$n$);
  perform dblink_send_query('pc', $d$update metas.alumnos set deleted_at = now() where id = '00000000-0000-0000-0000-0000000b0099'$d$);
  perform pg_sleep(0.5);
  perform prueba.ok(dblink_is_busy('pc') = 1, 'B4 el borrado ESPERA a la nota que se está guardando');
  perform dblink_exec('tablet', 'commit');
  begin
    perform * from dblink_get_result('pc') as x(r text);
    r := 'sin error';
  exception when others then
    r := sqlerrm;
  end;
  perform prueba.ok(r like '%tiene pagos o notas%', 'B4 y después lo rechaza: la nota quedó y el alumno no se borró', r);
  perform dblink_disconnect('tablet');
  perform dblink_disconnect('pc');
end $$;
select prueba.ok((select deleted_at is null from metas.alumnos where id = '00000000-0000-0000-0000-0000000b0099')
             and (select count(*) = 1 from metas.notas where alumno_id = '00000000-0000-0000-0000-0000000b0099'),
                 'B4 resultado: alumno vivo con su nota');

-- B4 al revés: la PC borra primero (transacción abierta) y la tablet anota después
select prueba.como('A');
set role authenticated;
select metas.alumno_crear('00000000-0000-0000-0000-0000000b0098', gen_random_uuid(), :aula, '{"nombre_completo":"Alumna Ficticia Carrera Dos"}');
reset role;
do $$
declare
  c text := current_setting('prueba.conninfo');
  ini text := $i$select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated","is_anonymous":false}', false); set role authenticated;$i$;
  r text;
begin
  perform dblink_connect('pc', c);
  perform dblink_connect('tablet', c);
  perform dblink_exec('pc', ini);
  perform dblink_exec('tablet', ini);
  perform dblink_exec('pc', 'begin');
  perform dblink_exec('pc', $d$update metas.alumnos set deleted_at = now() where id = '00000000-0000-0000-0000-0000000b0098'$d$);
  perform dblink_send_query('tablet', $n$insert into metas.notas (aula_id, alumno_id, asignatura_id, periodo, valor)
                                         values ('00000000-0000-0000-0000-0000000a0001', '00000000-0000-0000-0000-0000000b0098',
                                                 '00000000-0000-0000-0000-0000000d0001', 'I', 90)$n$);
  perform pg_sleep(0.5);
  perform dblink_exec('pc', 'commit');
  begin
    perform * from dblink_get_result('tablet') as x(r text);
    r := 'sin error';
  exception when others then
    r := sqlerrm;
  end;
  perform prueba.ok(r like '%no existe o está borrado%', 'B4 al revés: la nota para un alumno ya borrado se rechaza', r);
  perform dblink_disconnect('pc');
  perform dblink_disconnect('tablet');
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- A · Alumnos: solo la identidad une; homónimos
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select prueba.ok((metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), :aula,
                  '{"nombre_completo":"Otra Persona Ficticia","identidad":"0000201500001"}') ->> 'misma_identidad')::boolean,
                 'A1 misma identidad → es el mismo alumno (se devuelve el existente)');
select prueba.ok((metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), :aula,
                  '{"nombre_completo":"alumna ficticia   tres"}') ->> 'pregunta') = 'misma_persona',
                 'A2 mismo nombre sin identidad → pregunta «¿es la misma persona?»');
select prueba.ok((metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), :aula,
                  '{"nombre_completo":"Alumno Ficticio Dos","identidad":"0000201599999"}') ->> 'homonimo')::boolean,
                 'A3 homónimos con identidades distintas → se crea, con aviso');
select prueba.ok((metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), :aula,
                  '{"nombre_completo":"Alumno Ficticio Guatemala","identidad":"0000000000001","documento_pais":"GT","documento_tipo":"cui"}') ->> 'ok')::boolean,
                 'A6 documento de Guatemala aceptado');
select prueba.falla($$select metas.alumno_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000a0001', '{"nombre_completo":"Alumna Doce Digitos","identidad":"000020150001"}')$$,
                    'A6 identidad hondureña de 12 dígitos rechazada', '23514');
update metas.alumnos set num_lista = 40 where id = :ana;
select prueba.ok((select count(*) = 1 from metas.familias where alumno_id = :ana and deleted_at is null)
             and (select pagado = '50.00' from metas.v_colecta_alumnos where colecta_id = :c1 and alumno_id = :ana),
                 'A8 cambiar el número de lista no mueve familia ni pagos');
reset role;

-- ════════════════════════════════════════════════════════════════════════════
-- G · Gastos del docente y reembolsos; N · inventario y actas
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select metas.gasto_docente_crear('00000000-0000-0000-0000-0000000e0201', gen_random_uuid(), '2027-02-01', 'material',
                                 'Marcadores', 'Dirección', '300.00');
select metas.reembolso_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000e0201', '100.00', '2027-02-10');
select metas.reembolso_crear(gen_random_uuid(), gen_random_uuid(), '00000000-0000-0000-0000-0000000e0201', '150.00', '2027-02-20',
                             p_conocidos => array(select id from metas.reembolsos where gasto_id = '00000000-0000-0000-0000-0000000e0201'));
select prueba.ok((select estado = 'reembolsado_parcial' and falta = '50.00' from metas.v_gastos_docente
                   where gasto_id = '00000000-0000-0000-0000-0000000e0201'), 'G2 reembolsado parcial, falta 50 (calculado)');
select prueba.ok((metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{"monto":"300.00"}', '{"monto":"200.00"}',
                                             gen_random_uuid()) ->> 'pregunta') = 'monto_menor_que_reembolsado',
                 'P11 bajar el monto por debajo de lo reembolsado → pregunta');
select prueba.ok((metas.gasto_docente_anular('00000000-0000-0000-0000-0000000e0201', 'x', gen_random_uuid()) ->> 'motivo')
                 = 'tiene_reembolsos', 'G6 no se anula un gasto con reembolsos');
-- G9: el aparato no manda lo que veía → pregunta con las dos cifras, no error
insert into t values ('g9', metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{}', '{"monto":"280.00"}',
                                                       gen_random_uuid()));
select prueba.ok((select v ->> 'pregunta' = 'gasto_sin_base' and v -> 'actual' ->> 'monto' = '300.00'
                         and v -> 'este' ->> 'monto' = '280.00' from t where k = 'g9'),
                 'G9 sin monto base → pregunta «¿L 300.00 o L 280.00?»');
select prueba.ok((select monto = '300.00' from metas.vd_gastos_docente where id = '00000000-0000-0000-0000-0000000e0201'),
                 'G9 mientras no responda, el monto no cambia');
select prueba.ok((metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{"fecha":"ayer"}', '{"fecha":"2027-02-02"}',
                                             gen_random_uuid()) ->> 'pregunta') = 'gasto_sin_base',
                 'G9 una fecha base que no se entiende también pregunta');
select prueba.ok((metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{}', '{"monto":"300.00"}',
                                             gen_random_uuid()) ->> 'ok')::boolean,
                 'G9 pedir el mismo monto que ya hay no necesita base');
select prueba.ok((metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{"monto":"300.00"}', '{"monto":"280.00"}',
                                             gen_random_uuid()) -> 'gasto' ->> 'monto') = '280.00',
                 'G9 el segundo botón (base = lo que vio) guarda L 280.00');
-- G10 (rev. 8): lo reembolsado sale como texto con sus centavos, también
-- el cero: «0.00», nunca 0, «0» ni nulo.
select metas.gasto_docente_crear('00000000-0000-0000-0000-0000000e0202', gen_random_uuid(), '2027-02-03', 'material',
                                 'Cartulinas', 'Dirección', '45.00');
select prueba.ok((select reembolsado = '0.00' and jsonb_typeof(to_jsonb(v) -> 'reembolsado') = 'string'
                         and falta = '45.00' and estado = 'por_cobrar'
                    from metas.v_gastos_docente v where gasto_id = '00000000-0000-0000-0000-0000000e0202'),
                 'G10 un gasto sin reembolsos: reembolsado «0.00» (texto), no 0 ni nulo');
select metas.reembolso_crear('00000000-0000-0000-0000-0000000e0212', gen_random_uuid(), '00000000-0000-0000-0000-0000000e0202',
                             '45.00', '2027-02-04');
select metas.reembolso_anular('00000000-0000-0000-0000-0000000e0212', 'se anotó en el gasto equivocado', gen_random_uuid());
select prueba.ok((select reembolsado = '0.00' and falta = '45.00' from metas.v_gastos_docente
                   where gasto_id = '00000000-0000-0000-0000-0000000e0202'),
                 'G10 con su único reembolso anulado vuelve a «0.00»');
select prueba.ok((select v ->> 'reembolsado' = '250.00' and jsonb_typeof(v -> 'reembolsado') = 'string'
                    from (select metas.gasto_docente_editar('00000000-0000-0000-0000-0000000e0201', '{"monto":"280.00"}',
                                                            '{"monto":"240.00"}', gen_random_uuid()) as v) x),
                 'G10 la pregunta «menos que lo reembolsado» trae lo reembolsado como texto: «250.00»');
insert into metas.bienes (id, centro, fecha_desde, descripcion, valor, propietario, gasto_docente_id)
values ('00000000-0000-0000-0000-0000000e0301', 'Escuela Ficticia Las Flores', current_date - 30, 'Librero', 900, 'docente',
        '00000000-0000-0000-0000-0000000e0201');
select prueba.falla($$update metas.bienes set propietario = 'centro' where id = '00000000-0000-0000-0000-0000000e0301'$$,
                    'N2 pasar al centro sin fecha de reembolso → rechazado', 'MT030');
update metas.bienes set propietario = 'centro', reembolso_fecha = current_date - 20 where id = '00000000-0000-0000-0000-0000000e0301';
select prueba.ok((select propietario = 'centro' and pasa_al_centro_at = current_date - 20 from metas.bienes
                   where id = '00000000-0000-0000-0000-0000000e0301'), 'N1 el bien pasa al centro en la misma fila');
select prueba.ok(exists (select 1 from metas.v_bien_historia where bien_id = '00000000-0000-0000-0000-0000000e0301'
                          and propietario_antes = 'docente' and propietario_despues = 'centro'),
                 'N1 la historia muestra que era del docente');
select prueba.ok((metas.acta_inventario_crear(gen_random_uuid(), gen_random_uuid(), 'Escuela Ficticia Las Flores',
                  current_date + 1, 'A', 'Dirección') ->> 'motivo') = 'fecha_futura', 'P10 un acta no lleva fecha futura');
select prueba.ok((metas.acta_inventario_crear(gen_random_uuid(), gen_random_uuid(), 'Escuela Ficticia Las Flores',
                  current_date - 10, 'A', 'Dirección') -> 'acta' ->> 'numero') = '1', 'N4 primera acta = número 1');
select prueba.ok((metas.acta_inventario_crear(gen_random_uuid(), gen_random_uuid(), 'Escuela Ficticia Las Flores',
                  current_date - 10, 'A', 'Dirección') ->> 'pregunta') = 'acta_misma_fecha', 'P10 otra acta con la misma fecha → pregunta');
select prueba.ok((metas.acta_inventario_crear(gen_random_uuid(), gen_random_uuid(), 'Escuela Ficticia Las Flores',
                  current_date - 9, 'A', 'Dirección') -> 'acta' ->> 'numero') = '2', 'P10 con otra fecha → acta número 2');
select prueba.ok((select jsonb_array_length(contenido) = 1 and totales ->> 'valor_centro' = '900.00' from metas.actas_inventario where numero = 1),
                 'N4 el acta fija los bienes y sus totales');
update metas.bienes set valor = 950 where id = '00000000-0000-0000-0000-0000000e0301';
select prueba.ok((select totales ->> 'valor_centro' = '900.00' from metas.actas_inventario where numero = 1),
                 'N5 editar un bien después no cambia el acta');
select prueba.ok((select totales ->> 'valor_docente' = '0.00' and totales ->> 'valor_centro' = '0.00'
                    from jsonb_to_record(metas.acta_inventario_crear(gen_random_uuid(), gen_random_uuid(), 'Escuela Ficticia Sin Bienes',
                                         current_date - 5, 'A', 'Dirección') -> 'acta') as x(totales jsonb)),
                 'N10 el acta de un centro sin bienes dice «0.00», no «0»');
reset role;

-- ════════════════════════════════════════════════════════════════════════════
-- P · Padres
-- ════════════════════════════════════════════════════════════════════════════
select clave as clave_dani from metas.familias where alumno_id = :dani \gset
select clave as clave_eva  from metas.familias where alumno_id = :eva \gset
set role service_role;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f1', '1-K7QM', 'ip-1') ->> 'ok')::boolean, 'P0 padre 1 se vincula con la clave de Ana');
select metas.familia_vincular('00000000-0000-0000-0000-0000000000f2', :'clave_dani', 'ip-2');
select metas.familia_vincular('00000000-0000-0000-0000-0000000000f3', :'clave_eva', 'ip-3');
reset role;

select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(distinct alumno_id) = 1 and bool_and(alumno_id = '00000000-0000-0000-0000-0000000b0001') from metas.vf_colectas),
                 'P1 padre 1 solo ve a su hijo');
select prueba.ok((select count(*) from metas.pagos) = 0, 'P1 0 filas en la tabla directa');
select prueba.falla($$insert into metas.vf_colectas (alumno_id) values (gen_random_uuid())$$, 'P2 no escribe en una vista con uniones');
select prueba.falla($$insert into metas.vf_personalidad (alumno_id, periodo, rasgo, letra) values (gen_random_uuid(), 'I', 'Moralidad', 'S')$$,
                    'P2 no escribe en una vista simple (sin permiso)', '42501');
select prueba.falla($$select metas.familia_vincular('00000000-0000-0000-0000-0000000000f1', '1K7QM', 'x')$$, 'P2 no llama a familia_vincular directo', '42501');
select prueba.ok((select bool_and(recaudado is not null) and count(*) >= 3 from metas.familia_totales_colectas()),
                 'P6 ve solo totales por colecta');
reset role;
select prueba.como('padre2');
set role authenticated;
select prueba.ok((select aplicable = '25.00' and falta = '15.00' from metas.vf_colectas where colecta_id = :c1), 'F6 padre de exento parcial ve falta 15');
reset role;
select prueba.como('padre3');
set role authenticated;
select prueba.ok((select aplicable = '0.00' and falta = '0.00' and situacion = 'ya_no_esta' from metas.vf_colectas where colecta_id = :c1),
                 'F6/P5 padre de alumna trasladada: no le corresponde nada');
reset role;
-- P3: el docente anula un pago → toque en el canal de esa familia
select count(*) as antes from realtime.messages
 where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f1') \gset
select prueba.como('A');
set role authenticated;
select metas.pago_anular((select id from metas.pagos where colecta_id = :c1 and alumno_id = :ana and deleted_at is null),
                         'devuelto a la familia', gen_random_uuid());
reset role;
select prueba.ok((select count(*) > :antes from realtime.messages
                   where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f1')),
                 'P3 anular un pago avisa al canal de esa familia');
select prueba.como('padre1');
set role authenticated;
select prueba.ok((select situacion = 'debe' from metas.vf_colectas where colecta_id = :c1), 'P3 el padre ya ve «debe» tras la anulación');
reset role;

-- ════════════════════════════════════════════════════════════════════════════
-- N · Notas de la familia: una clave ve solo a su niño
-- ════════════════════════════════════════════════════════════════════════════
select clave as clave_beto from metas.familias where alumno_id = :beto and deleted_at is null \gset
select prueba.como('A');
set role authenticated;
insert into metas.asignaturas (id, aula_id, nombre, orden)
values ('00000000-0000-0000-0000-0000000d0002', :aula, 'Español', 2);
insert into metas.notas (aula_id, alumno_id, asignatura_id, periodo, componente, valor) values
  (:aula, :ana,  :mate, 'I',   'final',       85),
  (:aula, :ana,  '00000000-0000-0000-0000-0000000d0002', 'II', 'final', 91.50),
  (:aula, :ana,  :mate, 'III', 'final',       40),
  (:aula, :ana,  :mate, 'I',   'acumulativo', 33),
  (:aula, :beto, :mate, 'I',   'final',       62);
update metas.notas set deleted_at = now()
 where alumno_id = :ana and periodo = 'III' and componente = 'final' and deleted_at is null;
reset role;

select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(*) = 2
                    and bool_and(nombre = 'Alumna')
                    and bool_and(valor in ('85.00', '91.50'))
                    and bool_and(asignatura in ('Matemáticas', 'Español'))
                    from metas.familia_notas('1-k7qm')),
                 'N1 una clave válida muestra las notas de su hijo');
select prueba.ok((select count(*) = 0 from metas.familia_notas(:'clave_beto'))
              and not exists (select 1 from metas.familia_notas('1K7QM')
                               where valor in ('62.00', '40.00', '33.00') or nombre <> 'Alumna'),
                 'N2 esa clave no muestra las notas de otro niño, ni la borrada, ni el acumulativo');
select prueba.ok((select bool_and(alumno_id = :ana)
                    and count(*) filter (where componente = 'final' and valor in (85, 91.50)) = 2
                    and not bool_or(valor = 62)
                    and not bool_or(valor = 40)
                  from metas.vf_notas),
                 'N2 la vista vf_notas tampoco trae al otro niño ni la nota borrada');
select prueba.ok((select count(*) = 0 from metas.familia_notas(''))
              and (select count(*) = 0 from metas.familia_notas('   '))
              and (select count(*) = 0 from metas.familia_notas('ZZZZZZZZZZ')),
                 'N3 una clave vacía o inválida no muestra notas');
select prueba.ok((select count(*) from metas.notas) = 0, 'N3 el padre no lee la tabla de notas');
reset role;

select prueba.como('padre2');
set role authenticated;
select prueba.ok((select count(*) = 0 from metas.familia_notas(:'clave_dani'))
              and (select count(*) = 0 from metas.familia_notas('1K7QM')),
                 'N2 la clave de otro niño no abre las notas de Ana');
reset role;

select prueba.como('panel');
set role authenticated;
select prueba.ok((select count(*) = 0 from metas.familia_notas('1K7QM')),
                 'N3 una cuenta que no es de familia no ve notas');
reset role;

select prueba.como('nadie');
set role anon;
select prueba.falla($$select * from metas.familia_notas('1K7QM')$$,
                    'N3 sin sesión no se puede pedir las notas', '42501');
reset role;

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000f9","role":"authenticated","is_anonymous":true}', false);
set role authenticated;
select prueba.ok((select count(*) = 0 from metas.familia_notas('1K7QM')),
                 'N3 una sesión sin vínculo no ve notas');
reset role;
select prueba.como('A');

-- P12: el tope global de claves equivocadas ALERTA, no bloquea a todos
set role service_role;
do $$
declare i int;
begin
  for i in 1..2005 loop
    -- claves BIEN FORMADAS que no existen (10 símbolos del alfabeto)
    perform metas.familia_vincular(('00000000-0000-0000-0000-' || lpad(to_hex(4096 + i), 12, '0'))::uuid,
                                   translate(upper(substr(md5(i::text), 1, 10)), '01', '23'), 'ip-x' || i);
  end loop;
end $$;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f2', '1K7QM', 'ip-nueva') ->> 'ok')::boolean,
                 'P12 una clave buena sigue entrando (no se bloqueó a todos)');
reset role;
select prueba.ok((select count(*) = 1 from metas.alertas where tipo = 'claves_familia_equivocadas'), 'P12 una sola alerta global');

-- ════════════════════════════════════════════════════════════════════════════
-- K · Las claves viejas vencen al terminar la transición (N3, decisión de Josué)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select prueba.ok(metas.familias_preparar_claves_nuevas() = 1,
                 'K7 la docente prepara las tiras nuevas: solo la familia con clave conservada');
select prueba.ok((select clave = '1K7QM' and clave_siguiente ~ '^[A-HJ-NP-Z2-9]{10}$' from metas.familias where alumno_id = :ana),
                 'K7 la clave entregada no cambia; la siguiente la pone la base (10 símbolos)');
select prueba.ok((select clave_siguiente is null from metas.familias where alumno_id = :dani),
                 'K7 una familia con clave nueva no necesita otra');
select prueba.ok(metas.familias_preparar_claves_nuevas() = 0, 'K7 repetir no cambia las ya preparadas');
select prueba.falla($$update metas.familias set clave_siguiente = 'ZZZZZZZZZZ' where alumno_id = '00000000-0000-0000-0000-0000000b0001'$$,
                    'K7 la siguiente tampoco se cambia una vez puesta', 'MT002');
select prueba.falla($$update metas.familias set clave_siguiente = 'ZZZZZZZZZZ' where alumno_id = '00000000-0000-0000-0000-0000000b0004'$$,
                    'K7 a una clave nueva no se le pone siguiente', 'MT002');
reset role;
select clave_siguiente as clave_ana_nueva from metas.familias where alumno_id = :ana \gset
-- Antes de la fecha: la vieja y la nueva sirven
select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(*) from metas.familia_alumnos() x where x = '00000000-0000-0000-0000-0000000b0001') = 1,
                 'K8 antes de la fecha, el teléfono que entró con la clave vieja sigue viendo');
reset role;
set role service_role;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f3', :'clave_ana_nueva', 'ip-k8') ->> 'ok')::boolean,
                 'K8 la tira nueva ya sirve antes de la fecha');
reset role;
-- La fecha llega (hito del paso 4)
insert into metas.hitos (nombre, at) values ('claves_viejas_vencen', now() - interval '1 second');
select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(*) from metas.familia_alumnos() x where x = '00000000-0000-0000-0000-0000000b0001') = 0,
                 'K9 vencida la clave vieja, ese teléfono deja de ver a Ana');
select prueba.ok((select count(*) = 1 and bool_and(not metas.familia_canal_ok('acceso:' || id::text))
                    from metas.familia_accesos where clave_usada = '1K7QM'),
                 'K9 y deja de escuchar su canal');
reset role;
select prueba.como('padre3');
set role authenticated;
select prueba.ok((select count(*) from metas.familia_alumnos() x where x = '00000000-0000-0000-0000-0000000b0001') = 1,
                 'K9 quien entró con la tira nueva sigue viendo');
select prueba.ok((select count(*) = 1 and bool_and(metas.familia_canal_ok('acceso:' || id::text))
                    from metas.familia_accesos where clave_usada = :'clave_ana_nueva'),
                 'K9 y sigue escuchando el canal de su familia');
reset role;
select prueba.como('padre2');
set role authenticated;
select prueba.ok((select count(*) from metas.familia_alumnos() x where x = '00000000-0000-0000-0000-0000000b0004') = 1,
                 'K10 las claves nuevas no vencen');
reset role;
set role service_role;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f1', '1-K7QM', 'ip-k9') ->> 'motivo') = 'clave_vencida',
                 'K9 la clave vieja ya no vincula: «pida la tira nueva»');
reset role;
select count(*) as cambios_viejo from realtime.messages
 where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f2'
                                and clave_usada = '1K7QM') and event = 'cambio' \gset
select prueba.ok((select count(*) = 1 from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
                   where fa.auth_uid = '00000000-0000-0000-0000-0000000000f1' and fa.clave_usada = '1K7QM' and m.event = 'cerrar'),
                 'K13 al vencer, el teléfono con la clave vieja recibe «cerrar» una sola vez por su canal');
set role service_role;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f1', :'clave_ana_nueva', 'ip-k9') ->> 'ok')::boolean,
                 'K9 con la tira nueva vuelve a entrar');
reset role;
select prueba.como('padre1');
set role authenticated;
select prueba.ok((select count(*) from metas.familia_alumnos() x where x = '00000000-0000-0000-0000-0000000b0001') = 1,
                 'K9 y de verdad vuelve a ver a Ana (el vínculo pasó a la clave nueva)');
reset role;
-- K13: un cambio de Ana le llega a quien tiene clave vigente y NO al teléfono
-- de padre2, que sigue con la vieja aunque no se haya desconectado
select prueba.como('A');
set role authenticated;
update metas.alumnos set num_lista = 41 where id = :ana;
reset role;
select prueba.ok((select count(*) from realtime.messages
                   where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f2'
                                                  and clave_usada = '1K7QM') and event = 'cambio') = :cambios_viejo,
                 'K13 al teléfono con la clave vencida ya no le llega ningún toque');
select prueba.ok((select count(*) > 0 from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
                   where fa.auth_uid = '00000000-0000-0000-0000-0000000000f3' and fa.clave_usada = :'clave_ana_nueva'
                     and m.event = 'cambio' and m.inserted_at > now() - interval '1 minute'),
                 'K13 al teléfono con la tira nueva sí');
select prueba.ok((select clave = '1K7QM' from metas.familias where alumno_id = :ana),
                 'K9 en ningún momento se cambió la clave entregada');
-- R4-1: pasado el paso 4, el alta de una familia ya no conserva una clave vieja
select prueba.como('A');
set role authenticated;
insert into metas.familias (aula_id, alumno_id, clave) values (:aula, :gabi, '2-PRBA');
select prueba.ok((select clave ~ '^[A-HJ-NP-Z2-9]{10}$' and clave_origen = 'nueva' and clave_siguiente is null
                    from metas.familias where alumno_id = :gabi),
                 'K11 vencidas las viejas, pedir conservar «2-PRBA» (de su copia) da una clave nueva');
reset role;
set role service_role;
select prueba.ok((metas.familia_vincular('00000000-0000-0000-0000-0000000000f2', '2PRBA', 'ip-k11') ->> 'ok') = 'false',
                 'K11 y la vieja no abre a nadie');
reset role;
-- R4-5: el canal en vivo solo mientras el alumno siga activo
select prueba.como('padre3');
set role authenticated;
select prueba.ok((select count(*) = 1 and bool_and(not metas.familia_canal_ok('acceso:' || id::text))
                    from metas.familia_accesos where clave_usada = :'clave_eva'),
                 'K12 alumna trasladada: su familia ya no escucha el canal');
reset role;
select prueba.como('padre2');
set role authenticated;
select prueba.ok((select count(*) = 1 and bool_and(metas.familia_canal_ok('acceso:' || id::text))
                    from metas.familia_accesos where clave_usada = :'clave_dani'),
                 'K12 alumno activo: su familia escucha el canal');
reset role;
select prueba.como('A');
set role authenticated;
update metas.alumnos set estado = 'retirado' where id = :dani;
reset role;
select prueba.como('padre2');
set role authenticated;
select prueba.ok((select count(*) = 1 and bool_and(not metas.familia_canal_ok('acceso:' || id::text))
                    from metas.familia_accesos where clave_usada = :'clave_dani'),
                 'K12 retirado: su familia deja de escuchar el canal');
reset role;
select prueba.ok((select count(*) = 1 from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
                   where fa.clave_usada = :'clave_dani' and m.event = 'cerrar'),
                 'K14 al retirarlo, el teléfono conectado recibe «cerrar» al momento');
select count(*) as toques_dani from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
 where fa.clave_usada = :'clave_dani' and m.event = 'cambio' \gset
select prueba.como('A');
set role authenticated;
update metas.alumnos set num_lista = 44 where id = :dani;
reset role;
select prueba.ok((select count(*) from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
                   where fa.clave_usada = :'clave_dani' and m.event = 'cambio') = :toques_dani,
                 'K14 y ningún toque más, aunque siga conectado');
-- K15: el padre se desvincula → «cerrar» a ese teléfono
select prueba.como('padre3');
set role authenticated;
select metas.familia_desvincular((select familia_id from metas.familia_accesos where clave_usada = :'clave_eva'));
reset role;
select prueba.ok((select count(*) = 1 from realtime.messages m join metas.familia_accesos fa on m.topic = 'acceso:' || fa.id::text
                   where fa.clave_usada = :'clave_eva' and m.event = 'cerrar'),
                 'K15 desvincularse manda «cerrar» a ese teléfono');
-- K16 (rev. 7): el paso 4 anota la fecha con anticipación. Anotarla programa
-- el cierre de canales para esa hora; al llegar, se manda «cerrar».
-- (rev. 8: la fecha va a 60 días, no a 2031: más de 11 meses se rechaza, K18.
--  A los 20 segundos de un minuto: la tarea va al minuto SIGUIENTE.)
select date_trunc('minute', now() + interval '60 days') + interval '20 seconds' as k16_at \gset
update metas.hitos set at = :'k16_at' where nombre = 'claves_viejas_vencen';
select prueba.ok((select schedule = to_char((:'k16_at'::timestamptz + interval '1 minute') at time zone 'UTC',
                                            'FMMI FMHH24 FMDD FMMM') || ' *'
                         and command like '%metas.claves_viejas_cerrar_canales()%'
                    from cron.job where jobname = 'metas-claves-vencen'),
                 'K16 anotar una fecha futura programa la tarea a esa hora (UTC, al minuto siguiente)');
-- Con la fecha en el futuro, la clave vieja de padre2 vuelve a valer; un
-- toque de Ana se lo confirma (y le borra la marca de «cerrar»).
select prueba.como('A');
set role authenticated;
update metas.alumnos set num_lista = 42 where id = :ana;
reset role;
select prueba.ok((select canal_cerrado_at is null from metas.familia_accesos
                   where auth_uid = '00000000-0000-0000-0000-0000000000f2' and clave_usada = '1K7QM'),
                 'K16 antes de la fecha, ese vínculo vale y no está cerrado');
select prueba.ok(metas.claves_viejas_cerrar_canales() = 0, 'K16 si la tarea corriera antes de la fecha, no cierra nada');
select count(*) as cerrar_f2 from realtime.messages
 where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f2'
                                and clave_usada = '1K7QM') and event = 'cerrar' \gset
-- Llega la hora: se mueve el reloj (la fecha queda en el pasado SIN volver a
-- disparar nada) y corre lo que pg_cron tiene guardado.
alter table metas.hitos disable trigger hitos_cerrar_canales;
update metas.hitos set at = now() - interval '1 second' where nombre = 'claves_viejas_vencen';
alter table metas.hitos enable trigger hitos_cerrar_canales;
-- (si no hubiera tarea, no corre nada y las dos pruebas de abajo fallan)
do $$ begin execute coalesce((select command from cron.job where jobname = 'metas-claves-vencen'), 'select 1'); end $$;
select prueba.ok((select count(*) from realtime.messages
                   where topic = 'acceso:' || (select id from metas.familia_accesos where auth_uid = '00000000-0000-0000-0000-0000000000f2'
                                                  and clave_usada = '1K7QM') and event = 'cerrar') = :cerrar_f2 + 1,
                 'K16 a la hora programada, el teléfono con la clave vieja recibe «cerrar»');
select prueba.ok(not exists (select 1 from cron.job where jobname = 'metas-claves-vencen'),
                 'K16 y la tarea se borra sola después de correr');
-- K18 (rev. 8): la tarea de pg_cron no guarda el año. Una fecha a 13 meses
-- correría el mes que viene, no cerraría nada y se borraría sola. Anotar una
-- fecha a más de 11 meses se rechaza, con un error que dice qué hacer.
select prueba.falla($$update metas.hitos set at = now() + interval '12 months' where nombre = 'claves_viejas_vencen'$$,
                    'K18 una fecha a más de 11 meses se rechaza al anotarla (pg_cron no guarda el año)', 'MT044');
select prueba.ok(prueba.error_de($$insert into metas.hitos (nombre, at) values ('claves_viejas_vencen', now() + interval '400 days')
                                   on conflict (nombre) do update set at = excluded.at$$) like 'MT044|%11 meses%',
                 'K18 también por el «insert … on conflict» del paso 4, y el error dice «11 meses»');
select prueba.ok((select at <= now() from metas.hitos where nombre = 'claves_viejas_vencen')
                 and not exists (select 1 from cron.job where jobname = 'metas-claves-vencen'),
                 'K18 la fecha rechazada no queda anotada ni programada');
-- K19 (rev. 8): mover la fecha borra la tarea de la fecha anterior, también
-- cuando la nueva ya pasó (antes quedaba la vieja programada).
update metas.hitos set at = now() + interval '10 months' where nombre = 'claves_viejas_vencen';
select prueba.ok(exists (select 1 from cron.job where jobname = 'metas-claves-vencen'),
                 'K19 a 10 meses sí se programa');
update metas.hitos set at = now() - interval '1 minute' where nombre = 'claves_viejas_vencen';
select prueba.ok(not exists (select 1 from cron.job where jobname = 'metas-claves-vencen'),
                 'K19 mover la fecha a una que ya pasó borra la tarea de la fecha anterior');
-- K20 (rev. 9): metas.freno_devolver (rev. 8) es solo de la función de
-- borde: ni anon ni una sesión pueden devolverse intentos a mano.
set role anon;
select prueba.falla($$select metas.freno_devolver('entrar-correo:a@ejemplo.invalid', '1 hour')$$,
                    'K20 anon no llama metas.freno_devolver', '42501');
reset role;
select prueba.como('A');
set role authenticated;
select prueba.falla($$select metas.freno_devolver('entrar-correo:a@ejemplo.invalid', '1 hour')$$,
                    'K20 una sesión de docente tampoco llama metas.freno_devolver', '42501');
reset role;
select prueba.ok(not has_function_privilege('public', 'metas.freno_devolver(text, interval)', 'execute')
                 and has_function_privilege('service_role', 'metas.freno_devolver(text, interval)', 'execute'),
                 'K20 freno_devolver: nada para public, sí para service_role');
-- K17 (rev. 7): IP desconocida → sin freno por IP (nunca un balde común para
-- todos); IP conocida → su freno; y el freno por familia, con o sin IP.
set role service_role;
create temp table k17 (via text, motivo text);
grant all on k17 to public;
do $$
declare i int;
begin
  for i in 1..70 loop
    insert into k17 select 'sin-ip', metas.familia_vincular(gen_random_uuid(), 'ZZZZZZZZZ' || chr(65 + i % 20), null) ->> 'motivo';
  end loop;
  for i in 1..25 loop
    insert into k17 select 'una-ip', metas.familia_vincular(gen_random_uuid(), 'YYYYYYYYY' || chr(65 + i % 20), '203.0.113.9') ->> 'motivo';
  end loop;
end $$;
reset role;
select prueba.ok((select count(*) filter (where motivo = 'espera') = 0 and count(*) = 70 from k17 where via = 'sin-ip'),
                 'K17 setenta intentos SIN IP de setenta teléfonos distintos: ninguno frenado por una «IP» común');
select prueba.ok((select count(*) filter (where motivo = 'espera') > 0 from k17 where via = 'una-ip'),
                 'K17 con la IP conocida, su freno sigue funcionando');
select set_config('prueba.clave_beto', (select clave from metas.familias where alumno_id = :beto and deleted_at is null), false);
set role service_role;
do $$
declare i int; r jsonb;
begin
  for i in 1..21 loop
    r := metas.familia_vincular(gen_random_uuid(), current_setting('prueba.clave_beto'), null);
    insert into k17 values ('familia', coalesce(r ->> 'motivo', 'ok'));
  end loop;
end $$;
reset role;
select prueba.ok((select count(*) filter (where motivo = 'ok') = 20 and count(*) filter (where motivo = 'espera') = 1
                    from k17 where via = 'familia'),
                 'K17 freno por familia sin IP: veinte teléfonos en una hora sí, el 21.º espera');

-- ════════════════════════════════════════════════════════════════════════════
-- D · El dinero sale como texto (R5-1)
-- ════════════════════════════════════════════════════════════════════════════
select prueba.como('A');
set role authenticated;
select prueba.falla($$select monto from metas.pagos$$,                     'D1 la columna monto de pagos no se lee directo', '42501');
select prueba.falla($$select * from metas.pagos$$,                         'D1 ni con «select *»', '42501');
select prueba.falla($$select monto from metas.gastos$$,                    'D1 gastos tampoco', '42501');
select prueba.falla($$select monto from metas.gastos_docente$$,            'D1 gastos del docente tampoco', '42501');
select prueba.falla($$select monto from metas.reembolsos$$,                'D1 reembolsos tampoco', '42501');
select prueba.falla($$select monto from metas.convocatoria_pagos$$,        'D1 pagos de convocatoria tampoco', '42501');
select prueba.falla($$select monto_sugerido from metas.colectas$$,         'D1 monto sugerido tampoco', '42501');
select prueba.falla($$select monto_aplicable from metas.colecta_exenciones$$, 'D1 exenciones tampoco', '42501');
select prueba.falla($$select valor from metas.bienes$$,                    'D1 valor de los bienes tampoco', '42501');
select prueba.falla($$select * from metas._calc_colectas_resumen$$,        'D1 las vistas de cálculo (con números) no se leen', '42501');
select prueba.ok((select count(*) > 0 from metas.pagos), 'D1 lo demás de la tabla sí se lee (ids, fechas, recibos)');
-- Lo que llega a JavaScript: el JSON de cada fila, como lo arma la API
select prueba.ok((select count(*) > 0 and bool_and(jsonb_typeof(to_jsonb(v) -> 'monto') = 'string'
                                                   and (to_jsonb(v) ->> 'monto') ~ '^[0-9]+\.[0-9]{2}$')
                    from metas.vd_pagos v),
                 'D2 vd_pagos: cada monto es texto con dos decimales («150.00», nunca 150)');
select prueba.ok((select bool_and(jsonb_typeof(to_jsonb(v) -> 'recaudado') = 'string' and jsonb_typeof(to_jsonb(v) -> 'saldo') = 'string')
                    from metas.v_colectas_resumen v),
                 'D2 v_colectas_resumen: totales como texto');
select prueba.ok((select recaudado = '0.00' from metas.v_colectas_resumen where colecta_id = :c4),
                 'D2 el cero también lleva sus centavos: «0.00»');
select prueba.ok((select count(*) > 0 and bool_and(jsonb_typeof(despues -> 'monto') = 'string')
                    from metas.auditoria where tabla = 'pagos'),
                 'D3 la auditoría que lee el docente guarda el dinero como texto');
reset role;
select prueba.ok(not exists (
  select 1
    from pg_class k join pg_namespace n on n.oid = k.relnamespace and n.nspname = 'metas'
    join pg_attribute a on a.attrelid = k.oid and a.attnum > 0 and not a.attisdropped
   where k.relkind = 'v'
     and (has_table_privilege('authenticated', k.oid, 'select') or has_table_privilege('metas_lector_familias', k.oid, 'select'))
     and (a.attname in ('monto', 'monto_sugerido', 'monto_aplicable', 'aplicable', 'pagado', 'falta', 'pago_de_mas',
                        'meta', 'recaudado', 'falta_total', 'pago_de_mas_total', 'gastado', 'saldo',
                        'reembolsado', 'por_cobrar', 'reembolso_monto')
          or (a.attname = 'valor' and k.relname in ('vd_bienes', 'v_inventario_resumen')))
     and a.atttypid <> 'text'::regtype),
  'D4 ninguna vista que lee la app o el portal tiene una columna de dinero que no sea texto');
select prueba.ok(not exists (
  select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace and n.nspname = 'metas',
         unnest(p.proargnames, coalesce(p.proallargtypes, p.proargtypes::oid[]), coalesce(p.proargmodes, '{}'::"char"[])) as x(nombre, tipo, modo)
   where has_function_privilege('authenticated', p.oid, 'execute')
     and x.modo in ('o', 't', 'b')
     and x.nombre in ('monto', 'recaudado', 'gastado', 'saldo', 'pagado', 'falta', 'aplicable')
     and x.tipo <> 'text'::regtype),
  'D4 ni una función que devuelva dinero como número');
select prueba.ok((select count(*) = 0 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'metas'
                   and tablename in ('pagos', 'gastos', 'gastos_docente', 'reembolsos', 'convocatoria_pagos',
                                     'colectas', 'colecta_exenciones', 'bienes'))
             and (select count(*) = 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'metas'
                   and tablename = 'notas'),
                 'D5 las tablas de dinero no van por Realtime (su evento traería el número); las demás sí');
select count(*) as toques_a from realtime.messages where topic = 'docente:00000000-0000-0000-0000-00000000000a' \gset
select prueba.como('A');
set role authenticated;
select metas.pago_crear(gen_random_uuid(), gen_random_uuid(), :c2, :gabi, '7.50', '2027-04-01', p_son_distintos => true);
reset role;
select prueba.ok((select count(*) = :toques_a + 1 and bool_and(not (payload ? 'monto') and event = 'cambio')
                    from realtime.messages where topic = 'docente:00000000-0000-0000-0000-00000000000a'),
                 'D5 en su lugar, un toque sin dinero por el canal privado de la docente');
-- D6: el canal del docente y vd_* solo para su dueño
select set_config('realtime.topic', 'docente:00000000-0000-0000-0000-00000000000a', false);
select prueba.como('A');
set role authenticated;
select prueba.ok((select count(*) > 0 from realtime.messages), 'D6 la docente escucha su canal');
reset role;
select prueba.como('B');
set role authenticated;
select prueba.ok((select count(*) = 0 from realtime.messages), 'D6 otro docente no escucha el canal de A');
select prueba.ok((select count(*) = 0 from metas.vd_pagos), 'D6 B no ve los pagos de A en vd_pagos');
reset role;
select prueba.como('padre3');
set role authenticated;
select prueba.ok((select count(*) = 0 from realtime.messages), 'D6 un padre tampoco');
select prueba.ok((select count(*) = 0 from metas.vd_pagos) and (select count(*) = 0 from metas.v_colectas_resumen),
                 'D6 ni ve vd_pagos ni los totales del docente');
select prueba.ok((select bool_and(jsonb_typeof(to_jsonb(v) -> 'monto') = 'string') from metas.vf_pagos v)
                 and (select bool_and(jsonb_typeof(to_jsonb(v) -> 'falta') = 'string') from metas.vf_colectas v),
                 'D2 el portal de familias también recibe el dinero como texto');
reset role;
select set_config('realtime.topic', '', false);

-- ════════════════════════════════════════════════════════════════════════════
-- V · Convivencia con el modelo viejo (paso 1)
-- ════════════════════════════════════════════════════════════════════════════
-- C5: CONGELAR se corrió DOS veces (corre.sh). Nada quedó doble ni enredado.
select prueba.ok((select count(*) from pg_trigger where not tgisinternal and tgname in
                   ('docente_estado_candado', 'mensajes_docente_candado', 'registro_admin_congelada',
                    'registro_admin_congelada_truncate', 'registro_admin_historial_congelada',
                    'registro_admin_historial_congelada_truncate')) = 6,
                 'C5 cada disparador del paso 1 existe una sola vez');
select prueba.ok((select count(*) from metas.hitos where nombre = 'paso1') = 1,
                 'C5 el hito del paso 1 se marcó una vez');
select prueba.ok(not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                              where n.nspname = 'public' and p.proname like '\_metas\_%\_v1'
                                and p.prosrc like '%' || p.proname || '%'),
                 'C5 ninguna función _v1 es la envoltura (no quedó una llamándose a sí misma)');
select prueba.ok((select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                   where n.nspname = 'public' and p.proname like '\_metas\_%\_v1') = 4,
                 'C5 las 4 funciones viejas envueltas siguen ahí, una vez cada una');
select prueba.como('nadie');
set role anon;
-- V1 APK v480: A (vinculada) sube su lista vieja por la función de siempre
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"lista\":[{\"num\":1,\"nombre\":\"Alumna Ficticia Uno\"}]}]}"},"version":99,"dispositivo":"apk-v480"}]') = -2,
  'V1 APK v480 con datos del corte 1 → -2 (la app vieja lo deja pendiente)');
-- V2 la misma app vieja, con una llave que todavía vive en el blob
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_PLANACCION_V1","valor":{"raw":"{\"analisis\":[]}"},"version":5,"dispositivo":"apk-v480"}]') = 1,
  'V2 una llave que aún vive en el blob se guarda');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_CODIGOS_V1","valor":{"raw":"{}"},"version":99,"dispositivo":"pestana-vieja"}]') = -2,
  'V3 pestaña vieja: las claves de familia ya no se suben');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{no es json"},"version":99}]') = -2,
  'V7 raw inválido de un docente vinculado → no se acepta');
reset role;
select prueba.ok((select version = 1 and (valor ->> 'raw') like '%Alumna Ficticia Uno%' from public.docente_estado
                   where codigo = 'PROF-AAAA000001' and k = 'METAS_ADMIN_V1'),
                 'V1 el blob de A no cambió con los intentos rechazados (misma versión, mismo contenido)');
set role anon;
-- N4: el aula misma también es del corte 1 (boleta, asignaturas, logos,
-- fecha de corte de edad, observación del grado)
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"boleta\":{\"director\":\"Director Ficticio\"}}]}"},"version":101}]') = -2,
  'V14 boleta vieja → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"materias\":[\"Español\"]}]}"},"version":101}]') = -2,
  'V14 materias viejas → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"logo\":\"data:image/png;base64,AAAA\"}]}"},"version":101}]') = -2,
  'V14 logo viejo → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"logoSec\":\"data:image/png;base64,BBBB\"}]}"},"version":101}]') = -2,
  'V14 segundo logo viejo → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"edadCorte\":\"2027-01-15\"}]}"},"version":101}]') = -2,
  'V14 fecha de corte de edad vieja → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"obsGrado\":\"Dos alumnos no aparecen en el SACE\"}]}"},"version":101}]') = -2,
  'V14 observación del grado vieja → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"grado\":\"6\",\"lista\":[{\"num\":1}],\"materias\":[\"Español\"]}"},"version":101}]') = -2,
  'V14 formato v1 (lista y materias en la raíz) → -2');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"boleta\":{\"director\":\"X\"}},{\"id\":\"G2\",\"equipos\":{}}]}"},"version":101}]') = -2,
  'V14 basta un aula con datos del corte 1 para rechazar el envío entero');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"lista\":[],\"equipos\":{\"reparto\":\"1,2|3,4\"}}]}"},"version":100}]') = 1,
  'V8 METAS_ADMIN_V1 sin secciones del corte 1 se guarda');
select prueba.ok(public.metas_docente_estado_guardar('PROF-AAAA000001', 'clave-a',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G1\",\"logo\":\"\",\"obsGrado\":\"\",\"acumulativos\":[]}]}"},"version":102}]') = 1,
  'V14 un logo u observación VACÍOS no son datos: se guarda');
select prueba.ok(public.metas_docente_estado_guardar('PROF-CCCC000003', 'clave-c',
  '[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"v\":2,\"grupos\":[{\"id\":\"G9\",\"lista\":[{\"num\":1}]}]}"},"version":1}]') = 1,
  'V4 docente sin vincular: todo como hoy');
-- V5 restaurar una versión vieja: la función está cerrada…
select prueba.falla($$select public.metas_docente_reset_deshacer('PROF-AAAA000001', 'clave-a', 'METAS_ADMIN_V1', '{}')$$,
                    'V5 «restaurar» viejo cerrado', '42501');
-- V6 pestaña vieja: funciones de la copia para el chatbot y del historial cerradas
select prueba.falla($$select public.metas_guardar_admin('[]'::jsonb)$$, 'V6 metas_guardar_admin(jsonb) cerrada', '42501');
select prueba.falla($$select public.metas_guardar_admin('PROF-AAAA000001', 'clave-a', '[]'::jsonb)$$, 'V6 metas_guardar_admin(3 args) cerrada', '42501');
select prueba.falla($$select public.metas_docente_historial('PROF-AAAA000001', 'clave-a', 'METAS_ADMIN_V1', 5)$$, 'V6 historial cerrado', '42501');
select prueba.falla($$select public.metas_docente_papelera('PROF-AAAA000001', 'clave-a')$$, 'V6 papelera cerrada', '42501');
select prueba.falla($$select public.metas_recuperar_admin_docente('PROF-AAAA000001', 'clave-a')$$, 'V6 reposición de pagos cerrada', '42501');
-- Lo que DEBE seguir abierto
select prueba.ok(public.metas_guardar('[]') = 1 and public.metas_guardar_progreso('[]') = 1,
                 'V12 lado del alumno sigue abierto (metas_guardar, metas_guardar_progreso)');
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('7CCCC')) = 1
                 and (select count(*) from public.metas_consultar_avisos_padre('7CCCC')) = 1
                 and public.metas_buzon_docente('[]') is not null,
                 'V12 lecturas de padres y buzón siguen abiertos');
-- N1: metas_guardar_avisos reconoce al docente por su código y contraseña,
-- no por el texto «docente» de la fila
select prueba.ok(public.metas_guardar_avisos('PROF-AAAA000001', 'clave-a',
  '[{"evento_id":"AVI-N1-1","codigo":"1K7QM","subtipo":"aviso","titulo":"Reunión","vigente_hasta":"2099-01-01","docente":"Ana López"}]') = -2,
  'N1 docente vinculado con «Ana López» en la fila → -2');
select prueba.ok(public.metas_guardar_avisos('prof-aaaa000001', 'clave-a',
  '[{"evento_id":"AVI-N1-2","codigo":"1K7QM","subtipo":"aviso","titulo":"Reunión","vigente_hasta":"2099-01-01","docente":"x"}]') = -2,
  'N1 código en minúsculas → -2');
select prueba.ok(public.metas_guardar_avisos('  PROF-AAAA000001 ', 'clave-a',
  '[{"evento_id":"AVR-N1-3","codigo":"1K7QM","subtipo":"cuentas","titulo":"Recibo","vigente_hasta":"2099-01-01"}]') = -2,
  'N1 código con espacios y un recibo sin «docente» → -2');
select prueba.ok(public.metas_guardar_avisos('PROF-AAAA000001', 'otra-clave',
  '[{"evento_id":"AVI-N1-4","codigo":"1K7QM","subtipo":"aviso","titulo":"x","vigente_hasta":"2099-01-01"}]') = -1,
  'N1 contraseña equivocada → -1 como siempre (no revela si está vinculado)');
select prueba.ok(public.metas_guardar_avisos('PROF-CCCC000003', 'clave-c',
  '[{"evento_id":"AVI-N1-C","codigo":"7CCCC","subtipo":"aviso","titulo":"Aviso de C","vigente_hasta":"2099-01-01","docente":"Docente Ficticia C · PROF-CCCC000003"}]') = 1,
  'N1 docente sin vincular: metas_guardar_avisos como hoy');
-- N2: sin dinero de docentes vinculados en las lecturas viejas
select prueba.ok((select count(*) filter (where tipo = 'economia') = 0 and count(*) filter (where tipo = 'asistencia') = 1
                    from public.metas_consultar_admin_padre('1K7QM')),
                 'N2 clave de A con «Ana López» en la fila: sin pagos, con su asistencia');
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('1k7 qm') where tipo = 'economia') = 0,
                 'N2 la misma clave escrita en minúsculas y con espacio: sin pagos');
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('8MINU') where tipo = 'economia') = 0,
                 'N2 fila con el código de A en minúsculas: sin pagos');
select prueba.ok((select count(*) filter (where subtipo = 'cuentas') = 0
                         and count(*) filter (where evento_id = 'AVI-1-1K7QM') = 1
                    from public.metas_consultar_avisos_padre('1K7QM')),
                 'N2 avisos de A: sin recibos ni cuentas claras, con el aviso de la reunión');
select prueba.ok((select count(*) from public.metas_consultar_avisos_padre('8MINU')) = 0,
                 'N2 recibo con el código de A en minúsculas: no se devuelve');
select prueba.ok((select count(*) from public.metas_consultar_admin_padre('7CCCC') where tipo = 'economia' and monto = 30) = 1
                 and (select count(*) from public.metas_consultar_avisos_padre('7CCCC') where evento_id = 'AVR-C1-7CCCC') = 1,
                 'N2 docente sin vincular: su familia sigue viendo pagos y recibos');
reset role;
select prueba.ok((select count(*) >= 3 from metas.blob_rechazos where codigo = 'PROF-AAAA000001' and k <> 'metas_guardar_avisos'),
                 'V1 cada intento de una app vieja queda anotado');
select prueba.ok((select count(*) from metas.blob_rechazos where codigo = 'PROF-AAAA000001' and motivo like 'seccion_corte1:%') >= 8
                 and (select array_agg(distinct substr(motivo, 16) order by substr(motivo, 16)) from metas.blob_rechazos
                       where codigo = 'PROF-AAAA000001' and motivo like 'seccion_corte1:%')
                     @> array['boleta', 'edadCorte', 'lista', 'logo', 'logoSec', 'materias', 'obsGrado'],
                 'V14 cada rechazo dice qué sección lo frenó');
-- V5 …y aunque alguien escriba directo en la tabla, el candado la frena
select prueba.falla($$update public.docente_estado set valor = jsonb_build_object('raw', '{"grupos":[{"lista":[{"num":1}]}]}') where codigo = 'PROF-AAAA000001' and k = 'METAS_ADMIN_V1'$$,
                    'V5 escribir directo una lista vieja → candado', 'MT040');
-- V9 la app nueva usa el blob por sesión, con el mismo candado
select prueba.como('A');
set role authenticated;
select prueba.ok(metas.blob_guardar('[{"k":"METAS_PLANACCION_V1","valor":{"raw":"{\"analisis\":[1]}"},"version":200}]') = 1,
                 'V9 la app nueva guarda por sesión lo que aún vive en el blob');
select prueba.falla($$select metas.blob_guardar('[{"k":"METAS_ADMIN_V1","valor":{"raw":"{\"gastos\":[{\"monto\":5}]}"},"version":300}]')$$,
                    'V9 ni la app nueva puede devolver al blob algo del corte 1', 'MT040');
reset role;
select prueba.como('padre1');
set role authenticated;
select prueba.falla($$select metas.blob_guardar('[]')$$, 'V9 una sesión de padre no toca el blob', '42501');
reset role;
-- N1: lo que se rechazó no entró, y quedó anotado
select prueba.ok(not exists (select 1 from public.mensajes_docente where evento_id like '%-N1-%' and evento_id <> 'AVI-N1-C'),
                 'N1 ninguno de los intentos de A llegó a mensajes_docente');
select prueba.ok((select count(*) from metas.blob_rechazos
                   where codigo = 'PROF-AAAA000001' and k = 'metas_guardar_avisos' and motivo = 'avisos_migrados') = 3,
                 'N1 cada intento con la contraseña buena quedó anotado con el código normalizado (y el de contraseña mala no)');
select prueba.ok((select titulo = 'Aviso de C' and codigo = '7CCCC' from public.mensajes_docente where evento_id = 'AVI-N1-C'),
                 'N1 el aviso del docente sin vincular quedó guardado tal cual');
-- V10 mensajes_docente: el disparador de respaldo (un SQL a mano)
select prueba.falla($$insert into public.mensajes_docente (evento_id, codigo, docente, subtipo, titulo, vigente_hasta) values ('AVR-V10-1K7QM', '1K7QM', 'Docente Ficticia A · PROF-AAAA000001', 'cuentas', '🧾 Recibo RC-0001-1', '2099-01-01')$$,
                    'V10 un recibo viejo de un docente vinculado no entra', 'MT041');
select prueba.falla($$insert into public.mensajes_docente (evento_id, codigo, docente, subtipo, titulo, vigente_hasta) values ('AVR-V10-MIN', '1K7QM', 'docente ficticia a · prof-aaaa000001', 'cuentas', 'Recibo', '2099-01-01')$$,
                    'V10 el respaldo también reconoce el código en minúsculas', 'MT041');
select prueba.falla($$update public.mensajes_docente set docente = 'Docente Ficticia A · PROF-AAAA000001' where evento_id = 'AVI-1-1K7QM'$$,
                    'V10 tampoco se cambia una fila vieja para hacerla pasar por un docente vinculado', 'MT041');
select prueba.ok(not exists (select 1 from public.mensajes_docente where evento_id like 'AVR-V10-%'),
                 'V10 y no quedó ninguna fila rechazada');
insert into public.mensajes_docente (evento_id, codigo, docente, subtipo, titulo, vigente_hasta)
values ('AVI-X-9VIEJ', '9VIEJ', 'Docente Ficticia C · PROF-CCCC000003', 'aviso', 'Aviso de C a mano', '2099-01-01');
select prueba.ok((select count(*) = 1 and bool_and(titulo = 'Aviso de C a mano' and docente like '%PROF-CCCC000003')
                    from public.mensajes_docente where evento_id = 'AVI-X-9VIEJ'),
                 'V10 un docente sin vincular sigue mandando avisos (la fila quedó, con su texto)');
-- V13 con los permisos de fábrica de Supabase (GRANT ALL a anon en public),
-- anon tampoco escribe directo: la RLS sin políticas lo frena
set role anon;
select prueba.falla($$insert into public.mensajes_docente (evento_id, codigo, subtipo, vigente_hasta) values ('AVI-V13', '1K7QM', 'aviso', '2099-01-01')$$,
                    'V13 anon no escribe directo en mensajes_docente', '42501');
select prueba.falla($$insert into public.docente_estado (codigo, k, valor) values ('PROF-AAAA000001', 'METAS_PLANACCION_V1', '{}')$$,
                    'V13 anon no escribe directo en docente_estado', '42501');
-- …ni ejecuta las funciones internas que estos archivos crean o renombran en public
select prueba.falla($$select public._metas_docente_estado_guardar_v1('PROF-CCCC000003', 'clave-c', '[]', false)$$,
                    'V13 la guardadora vieja envuelta no se llama directo', '42501');
select prueba.falla($$select public._metas_guardar_avisos_v1('PROF-AAAA000001', 'clave-a', '[]')$$,
                    'V13 metas_guardar_avisos vieja envuelta no se llama directo', '42501');
select prueba.falla($$select * from public._metas_consultar_admin_padre_v1('1K7QM')$$,
                    'V13 la lectura vieja con dinero no se llama directo', '42501');
select prueba.falla($$select * from public._metas_consultar_avisos_padre_v1('1K7QM')$$,
                    'V13 los recibos viejos no se leen directo', '42501');
select prueba.falla($$select public._metas_cerrar_funciones(array['metas_guardar'])$$,
                    'V13 anon no cierra funciones', '42501');
reset role;
-- R4-6: las funciones viejas cerradas tampoco las llama service_role
set role service_role;
select prueba.falla($$select public.metas_guardar_admin('PROF-AAAA000001', 'clave-a', '[]'::jsonb)$$,
                    'V15 service_role tampoco guarda la copia vieja', '42501');
select prueba.falla($$select public.metas_docente_reset_deshacer('PROF-AAAA000001', 'clave-a', 'METAS_ADMIN_V1', '{}')$$,
                    'V15 service_role tampoco restaura versiones', '42501');
select prueba.falla($$select public.metas_recuperar_admin_docente('PROF-AAAA000001', 'clave-a')$$,
                    'V15 service_role tampoco repone pagos', '42501');
reset role;
select prueba.ok(not exists (
  select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public'
     and p.proname in ('metas_guardar_admin', 'metas_recuperar_admin_docente', 'metas_docente_historial',
                       'metas_docente_historial_listar', 'metas_docente_papelera', 'metas_docente_reset',
                       'metas_docente_reset_deshacer', 'metas_consultar_progreso', 'metas_restaurar_codigos')
     and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute')
          or has_function_privilege('service_role', p.oid, 'execute'))),
  'V15 todas las firmas cerradas en el paso 1 están cerradas a los tres roles');
select prueba.falla($$select public._metas_cerrar_funciones(array['metas_guardar_admin', 'metas_entrar_docente_v2'])$$,
                    'V15 pedir que se cierre una función que usa la de borde es un error, no un descuido', 'MT042');
select prueba.ok(not exists (
  select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public'
     and p.proname in ('_metas_docente_estado_guardar_v1', '_metas_guardar_avisos_v1',
                       '_metas_consultar_admin_padre_v1', '_metas_consultar_avisos_padre_v1',
                       '_metas_cerrar_funciones', '_metas_archivo_congelado', '_metas_candado_blob',
                       '_metas_candado_mensajes', '_metas_registro_congelado')
     and (has_function_privilege('anon', p.oid, 'execute')
          or has_function_privilege('authenticated', p.oid, 'execute')
          or has_function_privilege('service_role', p.oid, 'execute'))),
  'V13 ninguna función interna de public queda ejecutable por anon, authenticated ni service_role');
-- V11 cierre de año: metas_cerrar_familias sigue funcionando y archiva
set role anon;
select prueba.ok(public.metas_cerrar_familias('PROF-AAAA000001', 'clave-a', '["9VIEJ"]') >= 2, 'V11 el cierre de año sigue borrando las claves viejas');
reset role;
select prueba.ok((select count(*) >= 2 from public.registro_admin_historial where codigo = '9VIEJ'), 'V11 y deja lo borrado en el historial');
select prueba.falla($$insert into public.registro_admin (evento_id, codigo, tipo) values ('ADA-X', 'X', 'asistencia')$$,
                    'V11 registro_admin ya no se escribe', 'MT010');

-- ── Datos para la capa C (no es una prueba) ─────────────────────────────────
-- La capa C entra como la docente A y necesita, en su aula, una colecta
-- abierta primero (Excursión) y otra CERRADA (C4, «¿Reabrirla?»). Las
-- pruebas de arriba dejan la Rifa reabierta: aquí se cierra.
select prueba.como('A');
set role authenticated;
select metas.colecta_cerrar(:c4, gen_random_uuid());
reset role;

-- ════════════════════════════════════════════════════════════════════════════
-- Resultado
-- ════════════════════════════════════════════════════════════════════════════
\o
\set QUIET off
select n, case when ok then '✔' else '✘' end as r, nombre, case when not ok then detalle end as detalle
  from prueba.resultados order by n;
do $$
declare f int; t int;
begin
  select count(*) filter (where not ok), count(*) into f, t from prueba.resultados;
  if f > 0 then
    raise exception '% de % pruebas FALLARON', f, t;
  end if;
  raise notice '✅ Las % pruebas de la capa A en verde', t;
end $$;
