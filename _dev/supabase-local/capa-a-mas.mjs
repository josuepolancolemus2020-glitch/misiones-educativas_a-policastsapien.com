// ============================================================================
// Capa A+ · la API, Auth, Realtime y las funciones de borde, DE VERDAD
// ----------------------------------------------------------------------------
// La corre corre-supabase.sh después de la capa A, contra `supabase start`.
// Solo cuentas y datos ficticios. Usa la docente FICTICIA C (que la capa A
// deja sin vincular): entra por metas-entrar, se vincula sola y trabaja por la
// API como lo hará la app; dos teléfonos de familia entran con sesiones
// anónimas reales y escuchan su canal privado.
// Sale con código 1 si alguna prueba falla.
// ============================================================================
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

const API = process.env.METAS_API;
const PUBLICA = process.env.METAS_PUBLICA;
const SERVICIO = process.env.METAS_SERVICIO;
const DB = process.env.METAS_DB;
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(API || '')) {
  console.error('✘ METAS_API no es local; esta capa solo corre contra supabase start');
  process.exit(1);
}

const sinSesion = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const ESPERA_REALTIME = 8000;
let total = 0;
let fallas = 0;

async function prueba(nombre, fn) {
  total++;
  try {
    await fn();
    console.log('  ✔', nombre);
  } catch (e) {
    fallas++;
    console.log('  ✘', nombre, '\n      ', e && e.message ? e.message : e);
  }
}
function afirma(cond, msg) {
  if (!cond) throw new Error(msg || 'no se cumplió');
}
const id = () => crypto.randomUUID();
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

async function funcion(nombre, cuerpo, token) {
  const r = await fetch(`${API}/functions/v1/${nombre}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: PUBLICA, ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(cuerpo),
  });
  return { status: r.status, cuerpo: await r.json().catch(() => ({})) };
}

// Un cliente como el de la app: la sesión va en cada petición y en Realtime.
function cliente(token) {
  const c = createClient(API, PUBLICA, { ...sinSesion, global: { headers: { Authorization: `Bearer ${token}` } } });
  c.realtime.setAuth(token);
  return c;
}

// Se une a un canal privado y junta lo que llega. Devuelve el estado de la
// suscripción ('SUBSCRIBED' o el error) y la lista de eventos recibidos.
function escuchar(c, tema) {
  const recibidos = [];
  return new Promise((resolver) => {
    const canal = c.channel(tema, { config: { private: true } });
    canal.on('broadcast', { event: '*' }, (m) => recibidos.push(m));
    canal.subscribe((estado, err) => {
      if (estado === 'SUBSCRIBED' || estado === 'CHANNEL_ERROR' || estado === 'TIMED_OUT') {
        resolver({ canal, estado, error: err ? String(err.message || err) : '', recibidos });
      }
    });
  });
}
async function esperarEvento(lista, evento, desde) {
  const fin = Date.now() + ESPERA_REALTIME;
  while (Date.now() < fin) {
    if (lista.slice(desde).some((m) => m.event === evento)) return true;
    await pausa(200);
  }
  return false;
}

const C = { correo: 'c@ejemplo.invalid', clave: 'clave-c' };
let sesionC;
let c;
const aula = id();
const colecta = id();
const ana = id();
const beto = id();
let pagoAna;
let claveAna;
let claveBeto;

console.log('▶ metas-entrar');
await prueba('E1 contraseña equivocada → 401 «datos», sin sesión', async () => {
  const r = await funcion('metas-entrar', { correo: C.correo, clave: 'mala' });
  afirma(r.status === 401 && r.cuerpo.motivo === 'datos' && !r.cuerpo.access_token, JSON.stringify(r));
});
await prueba('E2 la docente entra con su contraseña de siempre y recibe SOLO la sesión', async () => {
  const r = await funcion('metas-entrar', C);
  afirma(r.status === 200 && r.cuerpo.ok && r.cuerpo.access_token && r.cuerpo.refresh_token, JSON.stringify(r));
  afirma(!('codigo' in r.cuerpo) && !('clave' in r.cuerpo), 'devolvió el código o la clave');
  sesionC = r.cuerpo;
  c = cliente(sesionC.access_token);
});
await prueba('E3 la primera vez se vinculó sola (metas.cuentas), y la segunda usa la misma cuenta', async () => {
  const adm = createClient(API, SERVICIO, sinSesion);
  const { data: v1 } = await adm.schema('metas').rpc('cuenta_de', { p_codigo: 'PROF-CCCC000003' });
  const r = await funcion('metas-entrar', C);
  const { data: v2 } = await adm.schema('metas').rpc('cuenta_de', { p_codigo: 'PROF-CCCC000003' });
  afirma(v1?.length === 1 && v2?.length === 1 && v1[0].auth_uid === v2[0].auth_uid && r.status === 200,
    JSON.stringify({ v1, v2 }));
});
await prueba('E4 la contraseña de Auth no sirve para entrar: la única puerta es metas-entrar', async () => {
  const { error } = await createClient(API, PUBLICA, sinSesion).auth.signInWithPassword({
    email: 'prof-cccc000003@cuentas.metas.policastsapien.com', password: 'clave-c',
  });
  afirma(error, 'entró con la contraseña de siempre directo en Auth');
});
// Con un correo que no es de nadie: el freno cuenta por correo, y así no
// deja bloqueada 10 minutos a una docente que usa la capa B después.
await prueba('E5 cinco fallos seguidos → «espera» (el freno de hoy)', async () => {
  const otro = { correo: 'nadie@ejemplo.invalid', clave: 'mala' };
  for (let i = 0; i < 5; i++) await funcion('metas-entrar', otro);
  const r = await funcion('metas-entrar', otro);
  afirma(r.status === 429 && r.cuerpo.motivo === 'espera', JSON.stringify(r));
});

// E6 (rev. 8): el freno por correo cuenta solo los FALLOS. Antes contaba
// también las entradas buenas: quien supiera el correo de un docente lo
// dejaba una hora afuera entrando bien veinte veces (o el propio docente,
// con tres teléfonos y una mañana de cerrar y abrir).
await prueba('E6 freno por CORREO: veinticinco entradas buenas seguidas no lo frenan', async () => {
  const D = { correo: 'd@ejemplo.invalid', clave: 'clave-d' };
  for (let i = 0; i < 25; i++) {
    const r = await funcion('metas-entrar', D);
    afirma(r.status === 200, `entrada buena ${i + 1}: ${JSON.stringify(r)}`);
  }
});
// Los 5 fallos en 10 minutos de hoy frenarían antes: se borran entre un
// intento y otro (como quien prueba despacio, de a cuatro cada diez minutos),
// para ver el freno de la hora solo.
await prueba('E6 freno por CORREO: veinte contraseñas equivocadas en la hora → la 21.ª espera, aunque sea la buena', async () => {
  const D = { correo: 'd@ejemplo.invalid', clave: 'clave-d' };
  const olvidarFallosCortos = () => execFileSync('psql', [DB, '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-c',
    `delete from public.docente_intentos where correo = '${D.correo}'`]);
  let r;
  for (let i = 0; i < 20; i++) {
    olvidarFallosCortos();
    r = await funcion('metas-entrar', { correo: D.correo, clave: 'mala-' + i });
    afirma(r.status === 401 && r.cuerpo.motivo === 'datos', `fallo ${i + 1}: ${JSON.stringify(r)}`);
  }
  olvidarFallosCortos();
  r = await funcion('metas-entrar', D);
  afirma(r.status === 429 && r.cuerpo.motivo === 'espera', JSON.stringify(r));
});

console.log('▶ La IP de los frenos (metas-diagnostico-ip)');
async function diagnostico(cabeceras) {
  const r = await fetch(`${API}/functions/v1/metas-diagnostico-ip`, {
    method: 'POST', headers: { 'content-type': 'application/json', apikey: PUBLICA, ...cabeceras }, body: '{}',
  });
  return r.json();
}
await prueba('IP1 x-forwarded-for NUNCA se usa: sin cf-connecting-ip, la IP es desconocida', async () => {
  const r = await diagnostico({ 'x-forwarded-for': '198.51.100.7, 10.0.0.1', 'x-real-ip': '198.51.100.8' });
  afirma(r.ok && r.ip_para_frenos === null, JSON.stringify(r));
});
await prueba('IP2 cf-connecting-ip válida se usa; basura no', async () => {
  const a = await diagnostico({ 'cf-connecting-ip': '203.0.113.5' });
  const b = await diagnostico({ 'cf-connecting-ip': 'no-es-una-ip' });
  afirma(a.ip_para_frenos === '203.0.113.5' && b.ip_para_frenos === null, JSON.stringify({ a, b }));
  // En local no hay Cloudflare: que el aparato pueda inventarla AQUÍ es
  // esperable. Que no pueda en el proyecto alojado lo confirma 06, 6.8.
});

console.log('▶ La docente trabaja por la API (como la app)');
await prueba('D1 arma su aula, dos alumnos, una colecta y un pago por las funciones', async () => {
  let r = await c.schema('metas').from('aulas').insert({
    id: aula, escuela: 'Escuela Ficticia Los Pinos', grado: 4, seccion: '1', anio_lectivo: 2027, docente_nombre: 'Docente Ficticia C',
  });
  afirma(!r.error, JSON.stringify(r.error));
  for (const [al, nombre] of [[ana, 'Alumna Ficticia Uno'], [beto, 'Alumno Ficticio Dos']]) {
    r = await c.schema('metas').rpc('alumno_crear', { p_id: al, p_op: id(), p_aula: aula, p_campos: { nombre_completo: nombre } });
    afirma(!r.error && r.data?.ok, JSON.stringify(r));
  }
  r = await c.schema('metas').rpc('colecta_crear', {
    p_id: colecta, p_op: id(), p_aula: aula, p_concepto: 'Excursión (ficticia)', p_monto_sugerido: '150', p_fecha: '2027-03-01',
  });
  afirma(!r.error && r.data?.ok, JSON.stringify(r));
  pagoAna = id();
  r = await c.schema('metas').rpc('pago_crear', {
    p_id: pagoAna, p_op: id(), p_colecta: colecta, p_alumno: ana, p_monto: '150.00', p_fecha: '2027-03-02',
  });
  afirma(!r.error && r.data?.ok && /^RC-27-/.test(r.data.pago.recibo), JSON.stringify(r));
});
await prueba('R5-1 el dinero llega a JavaScript como texto: «150.00», no 150', async () => {
  const { data, error } = await c.schema('metas').from('vd_pagos').select('monto').eq('id', pagoAna).single();
  afirma(!error && data.monto === '150.00' && typeof data.monto === 'string', JSON.stringify({ data, error }));
  const { data: res } = await c.schema('metas').from('v_colectas_resumen').select('recaudado,saldo').eq('colecta_id', colecta).single();
  afirma(res.recaudado === '150.00' && res.saldo === '150.00', JSON.stringify(res));
});
await prueba('R5-1 leer el dinero directo de la tabla está prohibido', async () => {
  const { error } = await c.schema('metas').from('pagos').select('*').eq('id', pagoAna);
  afirma(error, 'leyó la tabla con el monto como número');
  const { data, error: e2 } = await c.schema('metas').from('pagos').select('id,recibo').eq('id', pagoAna);
  afirma(!e2 && data.length === 1, 'tampoco deja leer lo que no es dinero');
});
await prueba('D2 insertar directo en pagos o colectas → rechazado', async () => {
  const r1 = await c.schema('metas').from('pagos').insert({ aula_id: aula, colecta_id: colecta, alumno_id: beto, monto: 1, fecha: '2027-03-03' });
  const r2 = await c.schema('metas').from('colectas').insert({ aula_id: aula, concepto: 'x', monto_sugerido: 1, fecha: '2027-03-03' });
  afirma(r1.error && r2.error, JSON.stringify({ r1: r1.error, r2: r2.error }));
});
// Con los parámetros de verdad: con «{}» la API no encuentra la función
// (404) y la prueba no diría nada del permiso.
await prueba('D3 sin sesión (solo la llave pública), pago_crear → 401', async () => {
  const r = await fetch(`${API}/rest/v1/rpc/pago_crear`, {
    method: 'POST', headers: { apikey: PUBLICA, 'content-type': 'application/json', 'content-profile': 'metas' },
    body: JSON.stringify({
      p_id: id(), p_op: id(), p_colecta: colecta, p_alumno: beto, p_monto: '1.00', p_fecha: '2027-03-03',
    }),
  });
  afirma(r.status === 401, String(r.status) + ' ' + (await r.text()).slice(0, 200));
});
await prueba('D4 la app vieja (llave pública + contraseña) recibe -2 en avisos y en el blob', async () => {
  const pub = createClient(API, PUBLICA, sinSesion);
  const a = await pub.rpc('metas_guardar_avisos', {
    p_prof: 'prof-cccc000003', p_clave: 'clave-c',
    filas: [{ evento_id: 'AVR-X-1', codigo: '1ABCD', subtipo: 'cuentas', vigente_hasta: '2099-01-01', docente: 'Ana López' }],
  });
  const b = await pub.rpc('metas_docente_estado_guardar', {
    p_codigo: 'PROF-CCCC000003', p_clave: 'clave-c',
    p_entradas: [{ k: 'METAS_ADMIN_V1', valor: { raw: '{"v":2,"grupos":[{"id":"G","lista":[{"num":1}]}]}' }, version: 9 }],
  });
  afirma(a.data === -2 && b.data === -2, JSON.stringify({ a, b }));
});

console.log('▶ Familias: sesión anónima, familia-vincular y su canal');
const { data: fams } = await c.schema('metas').from('familias').insert([
  { aula_id: aula, alumno_id: ana }, { aula_id: aula, alumno_id: beto },
]).select('alumno_id, clave');
claveAna = fams?.find((f) => f.alumno_id === ana)?.clave;
claveBeto = fams?.find((f) => f.alumno_id === beto)?.clave;

async function padreNuevo() {
  const anon = createClient(API, PUBLICA, sinSesion);
  const { data, error } = await anon.auth.signInAnonymously();
  if (error) throw error;
  return { sesion: data.session, c: cliente(data.session.access_token) };
}
let padreAna;
let padreBeto;
let canalAna;
let canalBeto;

await prueba('P1 un padre con clave equivocada no entra; con la buena, ve a su hija', async () => {
  padreAna = await padreNuevo();
  const mala = await funcion('familia-vincular', { clave: 'ZZZZZZZZZZ', turnstile: 'local' }, padreAna.sesion.access_token);
  afirma(mala.cuerpo.ok === false && mala.cuerpo.motivo === 'clave', JSON.stringify(mala));
  const buena = await funcion('familia-vincular', { clave: claveAna, turnstile: 'local' }, padreAna.sesion.access_token);
  afirma(buena.cuerpo.ok === true, JSON.stringify(buena));
  const { data } = await padreAna.c.schema('metas').from('vf_hijos').select('alumno_id');
  afirma(data?.length === 1 && data[0].alumno_id === ana, JSON.stringify(data));
});
await prueba('P2 sin sesión anónima, familia-vincular → 401; con la sesión de la docente, tampoco', async () => {
  const r1 = await funcion('familia-vincular', { clave: claveAna, turnstile: 'local' });
  const r2 = await funcion('familia-vincular', { clave: claveAna, turnstile: 'local' }, sesionC.access_token);
  afirma(r1.status === 401 && r2.status === 401, JSON.stringify({ r1, r2 }));
});
await prueba('P3 el padre ve el pago de su hija con el monto como texto', async () => {
  const { data } = await padreAna.c.schema('metas').from('vf_pagos').select('monto,recibo');
  afirma(data?.length === 1 && data[0].monto === '150.00', JSON.stringify(data));
});
await prueba('P4 un padre anónimo no puede llamar pago_crear', async () => {
  const r = await padreAna.c.schema('metas').rpc('pago_crear', {
    p_id: id(), p_op: id(), p_colecta: colecta, p_alumno: ana, p_monto: '1.00', p_fecha: '2027-03-03',
  });
  afirma(r.error, 'un padre creó un pago');
});

console.log('▶ Realtime de verdad');
await prueba('T1 el padre se une al canal de SU vínculo; otra familia recibe «Unauthorized»', async () => {
  const { data: acc } = await padreAna.c.schema('metas').from('familia_accesos').select('id');
  afirma(acc?.length === 1, 'no ve su vínculo');
  canalAna = await escuchar(padreAna.c, `acceso:${acc[0].id}`);
  afirma(canalAna.estado === 'SUBSCRIBED', canalAna.estado + ' ' + canalAna.error);
  padreBeto = await padreNuevo();
  await funcion('familia-vincular', { clave: claveBeto, turnstile: 'local' }, padreBeto.sesion.access_token);
  const intruso = await escuchar(padreBeto.c, `acceso:${acc[0].id}`);
  afirma(intruso.estado !== 'SUBSCRIBED', 'otra familia se unió al canal de Ana');
  const { data: accB } = await padreBeto.c.schema('metas').from('familia_accesos').select('id');
  canalBeto = await escuchar(padreBeto.c, `acceso:${accB[0].id}`);
  afirma(canalBeto.estado === 'SUBSCRIBED', canalBeto.estado);
});
await prueba('T2 la docente anula el pago → el padre recibe el toque, sin datos', async () => {
  const antes = canalAna.recibidos.length;
  const r = await c.schema('metas').rpc('pago_anular', { p_pago: pagoAna, p_motivo: 'devuelto', p_op: id() });
  afirma(r.data?.ok, JSON.stringify(r));
  afirma(await esperarEvento(canalAna.recibidos, 'cambio', antes), 'no llegó el toque');
  const m = canalAna.recibidos.slice(antes).find((x) => x.event === 'cambio');
  afirma(!JSON.stringify(m.payload).includes('150'), 'el toque trajo dinero');
});
await prueba('T3 la docente escucha su canal privado: el toque de un pago no trae el monto', async () => {
  const { data: u } = await c.auth.getUser(sesionC.access_token);
  const propio = await escuchar(c, `docente:${u.user.id}`);
  afirma(propio.estado === 'SUBSCRIBED', propio.estado + ' ' + propio.error);
  const antes = propio.recibidos.length;
  await c.schema('metas').rpc('pago_crear', {
    p_id: id(), p_op: id(), p_colecta: colecta, p_alumno: beto, p_monto: '75.50', p_fecha: '2027-03-04',
  });
  afirma(await esperarEvento(propio.recibidos, 'cambio', antes), 'no llegó el toque al docente');
  afirma(!JSON.stringify(propio.recibidos.slice(antes)).includes('75.5'), 'el toque trajo el monto');
  const otro = await escuchar(padreAna.c, `docente:${u.user.id}`);
  afirma(otro.estado !== 'SUBSCRIBED', 'un padre se unió al canal de la docente');
});
await prueba('R5-2 trasladan a Beto → su padre recibe «cerrar» y ningún toque más, aunque siga conectado', async () => {
  const antes = canalBeto.recibidos.length;
  const r = await c.schema('metas').from('alumnos').update({ estado: 'trasladado' }).eq('id', beto);
  afirma(!r.error, JSON.stringify(r.error));
  afirma(await esperarEvento(canalBeto.recibidos, 'cerrar', antes), 'no llegó «cerrar»');
  const n = canalBeto.recibidos.length;
  await c.schema('metas').rpc('pago_crear', {
    p_id: id(), p_op: id(), p_colecta: colecta, p_alumno: beto, p_monto: '1.00', p_fecha: '2027-03-05', p_son_distintos: true,
  });
  await pausa(3000);
  afirma(!canalBeto.recibidos.slice(n).some((m) => m.event === 'cambio'), 'le siguió llegando un toque');
  const otraVez = await escuchar(padreBeto.c, canalBeto.canal.topic.replace(/^realtime:/, ''));
  afirma(otraVez.estado !== 'SUBSCRIBED', 'se volvió a unir con el alumno trasladado');
});

console.log('▶ metas-salir-todos');
await prueba('S1 la docente cambia su contraseña: «otras» cierra el otro aparato y este sigue', async () => {
  const otro = (await funcion('metas-entrar', C)).cuerpo;
  const r = await funcion('metas-salir-todos', { alcance: 'otras' }, sesionC.access_token);
  afirma(r.status === 200 && r.cuerpo.ok, JSON.stringify(r));
  const anon = createClient(API, PUBLICA, sinSesion);
  const { error: eOtro } = await anon.auth.refreshSession({ refresh_token: otro.refresh_token });
  const { data: este, error: eEste } = await anon.auth.refreshSession({ refresh_token: sesionC.refresh_token });
  afirma(eOtro && !eEste && este.session, JSON.stringify({ eOtro: !!eOtro, eEste }));
  sesionC = este.session;
});
await prueba('S2 recuperación por correo: con la llave de servicio y el código, se cierran TODAS', async () => {
  const r = await funcion('metas-salir-todos', { codigo: 'PROF-CCCC000003', alcance: 'todas' }, SERVICIO);
  afirma(r.status === 200 && r.cuerpo.ok, JSON.stringify(r));
  const { error } = await createClient(API, PUBLICA, sinSesion).auth.refreshSession({ refresh_token: sesionC.refresh_token });
  afirma(error, 'la sesión siguió viva');
});
await prueba('S3 sin sesión ni llave de servicio → 401', async () => {
  const r = await funcion('metas-salir-todos', { codigo: 'PROF-CCCC000003', alcance: 'todas' }, PUBLICA);
  afirma(r.status === 401, JSON.stringify(r));
});

for (const p of [padreAna, padreBeto]) p?.c.removeAllChannels();
c?.removeAllChannels();
console.log(fallas ? `\n✘ ${fallas} de ${total} pruebas de la capa A+ FALLARON` : `\n✅ Las ${total} pruebas de la capa A+ en verde`);
process.exit(fallas ? 1 : 0);
