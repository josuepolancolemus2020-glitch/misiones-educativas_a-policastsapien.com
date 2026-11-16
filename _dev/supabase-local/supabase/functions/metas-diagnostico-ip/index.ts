// ============================================================================
// metas-diagnostico-ip · SOLO para un proyecto de PRUEBA aparte (no producción)
// ----------------------------------------------------------------------------
// Devuelve los encabezados de IP que le llegan a una función alojada y la IP
// que usarían los frenos (ipDe), para confirmar ANTES del corte 1 que
// cf-connecting-ip trae la IP real del aparato y que el aparato no la puede
// inventar. Cómo se usa: docs/rediseno-datos/06-PRUEBAS.md, 6.8.
// No responde nada si no está encendida con METAS_DIAGNOSTICO=1, para que un
// despliegue por descuido en producción no muestre nada.
// No lee ni escribe la base; no pide sesión: solo repite lo que el propio
// aparato mandó y lo que la infraestructura le agregó.
// ============================================================================
import { ipDe, json, preflight } from '../_compartido/comun.ts';

const ENCENDIDA = Deno.env.get('METAS_DIAGNOSTICO') === '1';
const ENCABEZADOS = ['cf-connecting-ip', 'true-client-ip', 'x-real-ip', 'x-forwarded-for', 'forwarded',
  'x-envoy-external-address', 'cf-ray', 'cf-ipcountry', 'via'];

Deno.serve((req) => {
  if (!ENCENDIDA) return new Response('', { status: 404 });
  const pre = preflight(req);
  if (pre) return pre;
  const vistos: Record<string, string | null> = {};
  for (const h of ENCABEZADOS) vistos[h] = req.headers.get(h);
  return json({ ok: true, ip_para_frenos: ipDe(req), encabezados: vistos });
});
