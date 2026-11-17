// ============================================================================
// Capa A+ · con el CAPTCHA de Auth ENCENDIDO (Turnstile)
// ----------------------------------------------------------------------------
// En el proyecto real, para abrir el portal de las familias, Auth exige un
// token de Turnstile (Bot and Abuse Protection). Lo que NO puede pasar es que
// eso deje al docente afuera: metas-entrar no manda ningún token, porque
// arma la sesión con un enlace mágico generado y canjeado en el servidor
// (sesionPara: admin.generateLink + verifyOtp con token_hash).
//
// corre-supabase.sh enciende el CAPTCHA en el Auth LOCAL con la llave secreta
// de PRUEBA que Cloudflare publica para eso (siempre aprueba; no es la de
// Josué, que nunca entra al repositorio), corre esto en dos tiempos y lo
// vuelve a apagar:
//   node capa-a-mas-captcha.mjs antes     → con el CAPTCHA apagado, abre una
//                                           sesión de familia (la de hoy)
//   node capa-a-mas-captcha.mjs           → con el CAPTCHA encendido
// Sin esta capa en verde no se enciende el CAPTCHA en el proyecto real.
// Solo cuentas y datos ficticios. Sale con código 1 si alguna prueba falla.
// ============================================================================
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const API = process.env.METAS_API;
const PUBLICA = process.env.METAS_PUBLICA;
const ARCHIVO = process.env.METAS_CAPTCHA_ARCHIVO;
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(API || '') || !ARCHIVO) {
  console.error('✘ METAS_API no es local o falta METAS_CAPTCHA_ARCHIVO; esta capa solo corre desde corre-supabase.sh');
  process.exit(1);
}
const sinSesion = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
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
async function funcion(nombre, cuerpo, token) {
  const r = await fetch(`${API}/functions/v1/${nombre}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: PUBLICA, ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(cuerpo),
  });
  return { status: r.status, cuerpo: await r.json().catch(() => ({})) };
}
// El alta anónima tal como la hace padres.html (POST /auth/v1/signup).
async function altaAnonima(captcha) {
  const cuerpo = { data: {} };
  if (captcha) cuerpo.gotrue_meta_security = { captcha_token: captcha };
  const r = await fetch(`${API}/auth/v1/signup`, {
    method: 'POST', headers: { apikey: PUBLICA, 'content-type': 'application/json' }, body: JSON.stringify(cuerpo),
  });
  return { status: r.status, cuerpo: await r.json().catch(() => ({})) };
}
// La renovación tal como la hacen la app y padres.html (sin CAPTCHA).
async function renovar(refresh) {
  const r = await fetch(`${API}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: { apikey: PUBLICA, 'content-type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }),
  });
  return { status: r.status, cuerpo: await r.json().catch(() => ({})) };
}

if (process.argv[2] === 'antes') {
  // Con el CAPTCHA apagado: un teléfono de familia que ya tenía su sesión.
  const a = await altaAnonima();
  if (!a.cuerpo.refresh_token) {
    console.error('✘ no se pudo abrir la sesión de familia de antes: ' + JSON.stringify(a));
    process.exit(1);
  }
  fs.writeFileSync(ARCHIVO, JSON.stringify({ refresh: a.cuerpo.refresh_token }));
  process.exit(0);
}

console.log('▶ Con el CAPTCHA de Auth encendido (Turnstile)');
const antes = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));

await prueba('K1 el CAPTCHA está encendido: una sesión anónima SIN token se rechaza', async () => {
  const r = await altaAnonima();
  afirma(r.status >= 400 && r.status < 500 && !r.cuerpo.access_token, 'se abrió sin token: ' + JSON.stringify(r).slice(0, 200));
  afirma(/captcha/i.test(JSON.stringify(r.cuerpo)), 'el rechazo no es por el CAPTCHA: ' + JSON.stringify(r.cuerpo).slice(0, 200));
});

let sesionA = null;
await prueba('K2 la docente entra por metas-entrar con su contraseña de siempre y recibe su sesión', async () => {
  const r = await funcion('metas-entrar', { correo: 'a@ejemplo.invalid', clave: 'clave-a' });
  afirma(r.status === 200 && r.cuerpo.ok && r.cuerpo.access_token && r.cuerpo.refresh_token,
    'metas-entrar no dio sesión: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
  sesionA = r.cuerpo;
});

await prueba('K3 con esa sesión trabaja: lee sus aulas por la API', async () => {
  afirma(sesionA, 'sin sesión de K2');
  const c = createClient(API, PUBLICA, { ...sinSesion, global: { headers: { Authorization: `Bearer ${sesionA.access_token}` } } });
  const { data, error } = await c.schema('metas').from('aulas').select('id').limit(1);
  afirma(!error && Array.isArray(data), 'no pudo leer: ' + (error && error.message));
});

await prueba('K4 la sesión de la docente se renueva sin CAPTCHA (la app lo hace sola cada hora)', async () => {
  afirma(sesionA, 'sin sesión de K2');
  const r = await renovar(sesionA.refresh_token);
  afirma(r.status === 200 && r.cuerpo.access_token, 'no se renovó: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
});

await prueba('K5 la primera entrada de una docente (se crea y se vincula su cuenta) también funciona', async () => {
  const r = await funcion('metas-entrar', { correo: 'b@ejemplo.invalid', clave: 'clave-b' });
  afirma(r.status === 200 && r.cuerpo.ok && r.cuerpo.access_token,
    'la primera entrada no dio sesión: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
});

await prueba('K6 una contraseña equivocada sigue diciendo que no (401), sin abrir nada', async () => {
  const r = await funcion('metas-entrar', { correo: 'a@ejemplo.invalid', clave: 'no-es-esta' });
  afirma(r.status === 401 && !r.cuerpo.access_token, 'respuesta: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
});

await prueba('K7 un teléfono de familia que ya tenía sesión la renueva sin CAPTCHA (no pierde su vínculo)', async () => {
  const r = await renovar(antes.refresh);
  afirma(r.status === 200 && r.cuerpo.access_token, 'no se renovó: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
});

// Con la llave de PRUEBA de Cloudflare cualquier token pasa, pero Auth tiene
// que llegar a Cloudflare para preguntarlo. Si este equipo no tiene esa
// salida, se avisa y no se cuenta (METAS_CAPTCHA_RED=1 la vuelve obligatoria).
await prueba('K8 con un token, la familia abre su sesión anónima y llega a familia-vincular', async () => {
  const r = await altaAnonima('XXXX.DUMMY.TOKEN.XXXX');
  if (!r.cuerpo.access_token && process.env.METAS_CAPTCHA_RED !== '1' && /captcha/i.test(JSON.stringify(r.cuerpo))) {
    console.log('     ⚠ Auth no pudo preguntarle a Cloudflare desde este equipo (sin salida): no se cuenta');
    return;
  }
  afirma(r.status === 200 && r.cuerpo.access_token, 'con token no se abrió: ' + r.status + ' ' + JSON.stringify(r.cuerpo).slice(0, 200));
  const v = await funcion('familia-vincular', { clave: 'ZZZZZZZZZZ', turnstile: 'local' }, r.cuerpo.access_token);
  afirma(v.status === 200 && v.cuerpo.ok === false && v.cuerpo.motivo === 'clave', 'familia-vincular: ' + JSON.stringify(v));
});

console.log(fallas ? `\n✘ ${fallas} de ${total} pruebas con CAPTCHA FALLARON` : `\n✅ Las ${total} pruebas con el CAPTCHA de Auth encendido en verde`);
process.exit(fallas ? 1 : 0);
