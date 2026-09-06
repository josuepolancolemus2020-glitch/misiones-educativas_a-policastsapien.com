/* Ayudante compartido para las sondas de la auditoría.
   Playwright 1.55 espera chromium 1187; el entorno trae 1194, así que se
   lanza por executablePath. Uso:
     const { abrir } = require('/tmp/.../scratchpad/pw/abrir.js');
     const { browser, page, errores } = await abrir({ movil: true });
*/
const { chromium } = require('playwright');
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function abrir(op = {}) {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    viewport: op.movil === false ? { width: 1280, height: 720 } : { width: 393, height: 873 },
    isMobile: op.movil !== false, hasTouch: op.movil !== false,
    deviceScaleFactor: op.movil === false ? 1 : 2,
    locale: 'es-HN',
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push('console: ' + m.text().slice(0, 200)); });
  page.on('requestfailed', r => { if (!/supabase|cdnjs|googleapis|gstatic/.test(r.url())) errores.push('requestfailed: ' + r.url()); });
  return { browser, ctx, page, errores };
}
module.exports = { abrir, chromium, EXE };
