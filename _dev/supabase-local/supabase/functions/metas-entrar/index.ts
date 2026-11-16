// ============================================================================
// metas-entrar · el docente entra con su correo y su contraseña de siempre
// ----------------------------------------------------------------------------
// public.docentes sigue siendo la única autoridad de la contraseña: aquí se
// valida con metas_entrar_docente_v2 (el mismo freno de hoy) y se devuelve
// SOLO una sesión de Supabase Auth. La primera vez, la cuenta de Auth se crea
// sola («vinculación transparente», 02, 2.3), con una contraseña al azar que
// nadie guarda: la única puerta a esa cuenta es esta función.
//
// Pide:     POST { correo, clave }
// Devuelve: 200 { ok: true, access_token, refresh_token, expires_at, nombre, rol }
//           401 { ok: false, motivo: 'datos' }      correo o contraseña mal
//           429 { ok: false, motivo: 'espera' }     freno (IP o 5 fallos)
//           503 { ok: false, motivo: 'reintentar' } algo del servidor; reintentar
// Nunca devuelve el código del docente ni ninguna contraseña.
// ============================================================================
import { admin, correoInterno, cuerpo, ipDe, json, preflight, sesionPara, texto } from '../_compartido/comun.ts';

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const b = await cuerpo(req);
  const correo = texto(b.correo, 200);
  const clave = texto(b.clave, 200);
  if (!correo || !clave) return json({ ok: false, motivo: 'datos' }, 401);

  const sb = admin();

  // 0. Frenos ANTES de tocar la contraseña.
  //    · Por CORREO, siempre: 20 intentos por hora (además de los 5 fallos en
  //      10 minutos de metas_entrar_docente_v2). No depende de la IP: si la IP
  //      viniera mal, este sigue protegiendo cada cuenta sin bloquear a nadie más.
  //    · Por IP, solo si se conoce de verdad (ipDe): 30 por hora.
  const frenos = [{ llave: 'entrar-correo:' + correo.toLowerCase(), max: 20 }];
  const ip = ipDe(req);
  if (ip) frenos.push({ llave: 'entrar-ip:' + ip, max: 30 });
  for (const f of frenos) {
    const { data: libre, error: eFreno } = await sb.schema('metas').rpc('freno_ok', {
      p_llave: f.llave, p_max: f.max, p_ventana: '1 hour',
    });
    if (eFreno) return json({ ok: false, motivo: 'reintentar' }, 503);
    if (!libre) return json({ ok: false, motivo: 'espera' }, 429);
  }

  // 1. La contraseña, como HOY (con su freno de 5 fallos por correo).
  const { data: r, error: eEntrar } = await sb.rpc('metas_entrar_docente_v2', { p_correo: correo, p_clave: clave });
  if (eEntrar) return json({ ok: false, motivo: 'reintentar' }, 503);
  if (!r?.ok) {
    return r?.motivo === 'espera' ? json({ ok: false, motivo: 'espera' }, 429) : json({ ok: false, motivo: 'datos' }, 401);
  }
  const codigo = String(r.codigo);
  const interno = correoInterno(codigo);

  // 2. ¿Ya tiene cuenta de Auth vinculada?
  let { data: v } = await sb.schema('metas').rpc('cuenta_de', { p_codigo: codigo });
  if (!Array.isArray(v) || !v.length) {
    // 3. Vinculación transparente. Si dos aparatos entran por primera vez a
    //    la vez, el «unique» de metas.cuentas deja ganar a uno; el usuario de
    //    Auth sobrante se borra (todavía no tiene ningún dato).
    const azar = Array.from(crypto.getRandomValues(new Uint8Array(32)), (x) => x.toString(16).padStart(2, '0')).join('');
    const { data: u } = await sb.auth.admin.createUser({
      email: interno, email_confirm: true, password: azar, app_metadata: { docente_codigo: codigo },
    });
    if (u?.user) {
      const { data: ganador } = await sb.schema('metas').rpc('cuenta_registrar', {
        p_auth: u.user.id, p_codigo: codigo, p_correo_interno: interno,
      });
      if (ganador && ganador !== u.user.id) await sb.auth.admin.deleteUser(u.user.id);
    }
    ({ data: v } = await sb.schema('metas').rpc('cuenta_de', { p_codigo: codigo }));
    if (!Array.isArray(v) || !v.length) return json({ ok: false, motivo: 'reintentar' }, 503);
  }

  // 4. La sesión, para el correo interno de ESE vínculo.
  const s = await sesionPara(v[0].correo_interno);
  if (!s) return json({ ok: false, motivo: 'reintentar' }, 503);

  // 5. Solo la sesión (y lo que la pantalla muestra: nombre y rol).
  return json({
    ok: true, access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at,
    nombre: r.nombre ?? null, rol: r.rol ?? 'docente',
  });
});
