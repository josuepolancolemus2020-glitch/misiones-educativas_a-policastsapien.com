// ============================================================================
// familia-vincular · un teléfono de familia se une con su hijo por la clave
// ----------------------------------------------------------------------------
// La familia no tiene cuenta: el teléfono abre una sesión ANÓNIMA (Auth, con
// Turnstile) y llama aquí con la clave de la tira. Esta función revisa el
// token de Turnstile de ESTE intento, toma la IP que puso la infraestructura y
// llama a metas.familia_vincular con la llave de servicio, que es quien aplica
// los frenos (por sesión, por IP, global) y la regla de las claves (07, 2.7).
//
// Pide:     POST  Authorization: Bearer <sesión anónima>   { clave, turnstile, alias? }
// Devuelve: 200 { ok: true, alias }                          ya ve a su hijo
//           200 { ok: false, motivo: 'clave' | 'clave_vencida' | 'espera' | 'muchos' }
//           401 { ok: false, motivo: 'sesion' }              sin sesión anónima válida
//           403 { ok: false, motivo: 'turnstile' }           no pasó la verificación
// El canal en vivo del teléfono es «acceso:<id>»; el id lo lee el propio
// teléfono de metas.familia_accesos (solo ve los suyos).
// ============================================================================
import { admin, cuerpo, esLocal, ipDe, json, preflight, texto, tokenDe } from '../_compartido/comun.ts';

const SECRETO_TURNSTILE = Deno.env.get('TURNSTILE_SECRET') ?? '';
// Solo en `supabase start`: no hay clave de prueba de Turnstile sin red. Si
// alguien dejara esta variable en el proyecto real, se ignora (esLocal).
const SIN_TURNSTILE = Deno.env.get('METAS_SIN_TURNSTILE') === '1' && esLocal();

async function turnstileOk(token: string, ip: string): Promise<boolean> {
  if (SIN_TURNSTILE) return true;
  if (!SECRETO_TURNSTILE || !token) return false;      // sin secreto configurado: se cierra, no se abre
  const f = new FormData();
  f.append('secret', SECRETO_TURNSTILE);
  f.append('response', token);
  if (ip !== 'sin-ip') f.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: f });
    const o = await r.json();
    return o?.success === true;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const token = tokenDe(req);
  if (!token) return json({ ok: false, motivo: 'sesion' }, 401);
  const sb = admin();
  const { data: u, error } = await sb.auth.getUser(token);
  // Solo sesiones anónimas: una cuenta de docente no se vincula como familia
  // (la base también lo impide).
  if (error || !u?.user || !u.user.is_anonymous) return json({ ok: false, motivo: 'sesion' }, 401);

  const b = await cuerpo(req);
  const ip = ipDe(req);
  if (!(await turnstileOk(texto(b.turnstile, 4096), ip))) return json({ ok: false, motivo: 'turnstile' }, 403);

  const { data: r, error: e2 } = await sb.schema('metas').rpc('familia_vincular', {
    p_uid: u.user.id, p_clave: texto(b.clave, 40), p_ip: ip, p_alias: texto(b.alias, 40) || null,
  });
  if (e2 || !r) return json({ ok: false, motivo: 'reintentar' }, 503);
  return r.ok ? json({ ok: true, alias: r.alias ?? null }) : json({ ok: false, motivo: r.motivo ?? 'clave' });
});
