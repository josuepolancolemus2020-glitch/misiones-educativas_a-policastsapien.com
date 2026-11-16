// ============================================================================
// metas-salir-todos · cerrar las sesiones de un docente en otros aparatos
// ----------------------------------------------------------------------------
// Dos usos (02, 2.5):
//   · La app, justo después de metas_cambiar_clave_docente: con la sesión del
//     docente, cierra las OTRAS sesiones («otras»). Este aparato sigue.
//         POST  Authorization: Bearer <sesión>   { alcance: 'otras' }
//   · La función reset-clave, cuando metas_reset_confirmar dijo que sí: no
//     tiene la sesión del docente; llama con la llave de servicio y el código,
//     y se cierran TODAS.
//         POST  Authorization: Bearer <llave de servicio>   { codigo, alcance: 'todas' }
// Devuelve 200 { ok: true } o 401 { ok: false, motivo: 'sesion' }.
//
// Cerrar una sesión invalida su token de renovación al momento; el token de
// acceso que ya tenía el otro aparato vale hasta que vence (1 hora como
// máximo) y entonces la renovación falla y la app pide la contraseña.
// ============================================================================
import { admin, cuerpo, iguales, json, preflight, SERVICIO, sesionPara, texto, tokenDe } from '../_compartido/comun.ts';

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const token = tokenDe(req);
  const b = await cuerpo(req);
  const sb = admin();

  // Desde el servidor (reset-clave): llave de servicio + código.
  if (iguales(token, SERVICIO)) {
    const codigo = texto(b.codigo, 40).toUpperCase();
    if (!codigo) return json({ ok: false, motivo: 'datos' }, 400);
    const { data: v } = await sb.schema('metas').rpc('cuenta_de', { p_codigo: codigo });
    if (!Array.isArray(v) || !v.length) return json({ ok: true, cerradas: 0 });   // sin cuenta nueva: nada que cerrar
    // Para cerrar TODAS hace falta una sesión de esa cuenta: se abre una aquí
    // (que también se cierra con las demás).
    const s = await sesionPara(v[0].correo_interno);
    if (!s) return json({ ok: false, motivo: 'reintentar' }, 503);
    const { error } = await sb.auth.admin.signOut(s.access_token, 'global');
    return error ? json({ ok: false, motivo: 'reintentar' }, 503) : json({ ok: true });
  }

  // Desde la app: la sesión del propio docente.
  if (!token) return json({ ok: false, motivo: 'sesion' }, 401);
  const { data: u, error } = await sb.auth.getUser(token);
  if (error || !u?.user || u.user.is_anonymous) return json({ ok: false, motivo: 'sesion' }, 401);
  const alcance = b.alcance === 'todas' ? 'global' : 'others';
  const { error: e2 } = await sb.auth.admin.signOut(token, alcance);
  return e2 ? json({ ok: false, motivo: 'reintentar' }, 503) : json({ ok: true });
});
