// ============================================================================
// Lo que comparten las tres funciones de borde de M.E.T.A.S
// ----------------------------------------------------------------------------
// Corren en Supabase Edge Functions (Deno) con la llave de servicio, que
// nunca sale del servidor. Diseño: docs/rediseno-datos/02-CUENTAS-Y-SEGURIDAD.md.
// La versión de supabase-js va fija, como todo lo de afuera.
// ============================================================================
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';

export const URL_SB = Deno.env.get('SUPABASE_URL') ?? '';
export const SERVICIO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const PUBLICA = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Solo el sitio publicado llama a estas funciones. En local, el archivo
// .env.local lo abre a «*» para las pruebas.
const ORIGEN = Deno.env.get('METAS_ORIGEN') ?? 'https://metas.policastsapien.com';

const sinSesion = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

export function admin(): SupabaseClient {
  return createClient(URL_SB, SERVICIO, sinSesion);
}

export function publico(): SupabaseClient {
  return createClient(URL_SB, PUBLICA, sinSesion);
}

// ¿Corre en una computadora (supabase start) y no en el proyecto real? Dentro
// del contenedor local la API se llama «kong»; desde afuera, 127.0.0.1.
export function esLocal(): boolean {
  return /^https?:\/\/(kong|127\.0\.0\.1|localhost)(:\d+)?(\/|$)/.test(URL_SB);
}

const cabeceras = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': ORIGEN,
  'access-control-allow-headers': 'authorization, apikey, content-type, x-metas-aparato',
  'access-control-allow-methods': 'POST, OPTIONS',
  'vary': 'origin',
};

export function json(o: unknown, status = 200): Response {
  return new Response(JSON.stringify(o), { status, headers: cabeceras });
}

export function preflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabeceras });
  if (req.method !== 'POST') return json({ ok: false, motivo: 'metodo' }, 405);
  return null;
}

// La IP la añade la infraestructura de Supabase como ÚLTIMO valor de
// x-forwarded-for. El primero lo puede escribir el aparato: nunca se usa.
export function ipDe(req: Request): string {
  const partes = (req.headers.get('x-forwarded-for') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return partes.pop() ?? 'sin-ip';
}

export function tokenDe(req: Request): string {
  const h = req.headers.get('authorization') ?? '';
  return h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : '';
}

// Comparación de tiempo constante: no se averigua la llave de servicio
// midiendo cuánto tarda en decir que no.
export function iguales(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return d === 0 && a.length > 0;
}

export async function cuerpo(req: Request): Promise<Record<string, unknown>> {
  try {
    const o = await req.json();
    return o && typeof o === 'object' ? o as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function texto(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

// Correo interno y fijo de la cuenta de Auth de un docente (02, 2.2): nunca
// se le manda nada; no depende del correo real, que el docente puede cambiar.
export function correoInterno(codigo: string): string {
  return codigo.toLowerCase() + '@cuentas.metas.policastsapien.com';
}

// Una sesión de Auth para una cuenta, sin conocer ninguna contraseña de Auth:
// enlace mágico generado y canjeado aquí mismo (nunca se manda por correo).
export async function sesionPara(correo: string) {
  const { data: link, error } = await admin().auth.admin.generateLink({ type: 'magiclink', email: correo });
  if (error || !link?.properties?.hashed_token) return null;
  const { data, error: e2 } = await publico().auth.verifyOtp({
    token_hash: link.properties.hashed_token, type: 'email',
  });
  if (e2 || !data.session) return null;
  return data.session;
}
