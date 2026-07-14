# 📧 Reset de contraseña por correo — guía de configuración (una sola vez)

Cuando termines estos pasos, el maestro que olvide su contraseña recibirá
un **código de 6 dígitos en su correo** y la cambiará él solo. Tú no
participas nunca más.

Piezas: **Resend** (envía los correos, gratis hasta ~3,000/mes) +
**Edge Function** en Supabase (genera el código y pide el envío) +
**SQL** (`SUPABASE-RESET-CORREO.sql`, verifica el código).

---

## Paso 1 — Cuenta en Resend y dominio (≈15 min + espera de DNS)

1. Entra a **resend.com** → *Sign up* (gratis, con tu correo).
2. Menú **Domains** → **Add Domain** → escribe `policastsapien.com` → *Add*.
3. Resend te mostrará **3 registros DNS** (parecidos a estos, usa LOS TUYOS):
   - `MX`  → nombre `send` → valor `feedback-smtp.us-east-1.amazonses.com` (prioridad 10)
   - `TXT` → nombre `send` → valor `v=spf1 include:amazonses.com ~all`
   - `TXT` → nombre `resend._domainkey` → valor `p=MIGfMA0...` (largo)
4. En **Squarespace** (donde ya editaste el DNS para `metas.`):
   *Settings → Domains → policastsapien.com → DNS settings* → agrega esos
   3 registros tal cual (nombre, tipo, valor).
5. De vuelta en Resend, toca **Verify DNS Records**. Puede tardar de
   minutos a unas horas (como pasó con `metas.`). Estado esperado: ✅ Verified.
6. Menú **API Keys** → **Create API Key** → nombre `metas-reset` →
   permiso *Sending access* → **copia la clave** (`re_...`) — se muestra
   una sola vez.

## Paso 2 — La Edge Function en Supabase (≈10 min)

1. supabase.com → tu proyecto → menú **Edge Functions** → **Deploy a new
   function** (elige la opción de crear/editar en el navegador, "via Editor").
2. Nombre: `reset-clave` — y pega TODO el código de abajo → **Deploy**.
3. En la función → **Details/Settings** → **desactiva** «Enforce JWT
   verification» (la app la llama sin sesión; el freno anti-abuso va por
   dentro). Guarda.
4. Menú **Edge Functions → Secrets** (o *Project Settings → Edge Functions*):
   **Add secret** → nombre `RESEND_API_KEY` → valor la clave `re_...` del
   Paso 1.6.

```ts
// ============================================================
// M.E.T.A.S — Edge Function «reset-clave»
// Recibe { correo }, genera un código de 6 dígitos, guarda su hash en
// public.docente_reset (vence en 15 min) y lo envía con Resend.
// SIEMPRE responde { ok: true }: nunca revela si un correo existe.
// Frenos: 1 envío por minuto y 5 por día por correo.
// ============================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const generico = () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });

async function sha256hex(t: string): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const { correo } = await req.json();
    const c = String(correo || "").trim().toLowerCase();
    if (!c.includes("@") || c.length > 120) return generico();

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ¿Existe la cuenta? (si no, respondemos igual: nada que revelar)
    const { data: doc } = await sb.from("docentes")
      .select("correo,nombre").ilike("correo", c).maybeSingle();
    if (!doc) return generico();

    // Frenos anti-abuso por correo
    const { data: prev } = await sb.from("docente_reset")
      .select("*").eq("correo", c).maybeSingle();
    const ahora = Date.now();
    if (prev) {
      const creado = new Date(prev.creado).getTime();
      if (ahora - creado < 60_000) return generico();                    // 1 por minuto
      const mismoDia = new Date(prev.creado).toDateString() === new Date().toDateString();
      if (mismoDia && (prev.enviados ?? 1) >= 5) return generico();      // 5 por día
      var enviados = mismoDia ? (prev.enviados ?? 1) + 1 : 1;
    } else { var enviados = 1; }

    // Código de 6 dígitos con azar criptográfico
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const codigo = String(100000 + (buf[0] % 900000));

    const { error } = await sb.from("docente_reset").upsert({
      correo: c,
      codigo_hash: await sha256hex(codigo),
      expira: new Date(ahora + 15 * 60_000).toISOString(),
      intentos: 0,
      enviados,
      creado: new Date().toISOString(),
    });
    if (error) return generico();

    const primer = String(doc.nombre || "").trim().split(/\s+/)[0] || "colega";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "M.E.T.A.S <metas@policastsapien.com>",
        to: [c],
        subject: codigo + " es tu código — M.E.T.A.S",
        html:
          `<div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:18px;">` +
          `<h2 style="color:#1e3a7c;margin:0 0 8px;">🎓 M.E.T.A.S</h2>` +
          `<p>Hola, ${primer}. Tu código para crear una contraseña nueva es:</p>` +
          `<p style="font-size:34px;font-weight:900;letter-spacing:6px;color:#1e3a7c;` +
          `background:#f2f5fb;border-radius:10px;padding:14px;text-align:center;">${codigo}</p>` +
          `<p style="color:#555;font-size:13px;">Vence en <strong>15 minutos</strong>. ` +
          `Si tú no lo pediste, ignora este correo: tu cuenta sigue segura.</p></div>`,
      }),
    });
    return generico();
  } catch (_) {
    return generico();
  }
});
```

## Paso 3 — El SQL

SQL Editor → pega COMPLETO **`SUPABASE-RESET-CORREO.sql`** → Run.

## Paso 4 — Probar

1. En la app: Zona Docente → «¿Ya tienes cuenta? Entrar» →
   **«🆘 ¿Olvidaste tu contraseña?»** → escribe tu correo registrado.
2. Debe llegarte el correo con el código (revisa *no deseado* la primera vez).
3. Escribe el código + una contraseña nueva → entra con ella. ✅

## Si algo falla

- **No llega el correo:** Resend → menú **Logs/Emails** muestra cada envío
  y su error exacto (dominio sin verificar es el clásico).
- **La app dice código vencido siempre:** revisa que corriste el SQL del
  Paso 3 y que la función quedó SIN «Enforce JWT verification».
- **Respaldo de emergencia:** siempre te queda `SOPORTE-RESET-CLAVE.sql`
  (reseteo manual del administrador).
