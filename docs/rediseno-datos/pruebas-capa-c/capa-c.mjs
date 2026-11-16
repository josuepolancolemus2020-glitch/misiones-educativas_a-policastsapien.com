// ============================================================================
// Capa C · la pantalla del corte 1 en el navegador (escrita ANTES del código)
// ----------------------------------------------------------------------------
// Corre con:  bash _dev/supabase-local/corre-supabase.sh --capa-c
// Playwright (no versionado: npm install --no-save playwright), el sitio
// servido por _dev/servidor-estatico.js (http://localhost:8123) y Supabase
// local con la capa A cargada. Tres tamaños: teléfono 390, tablet 800, PC 1366.
//
// Contrato de la pantalla: los elementos que la prueba toca llevan
// data-metas="…" (la lista está en CONTRATO-PANTALLA.md). Las pruebas no
// dependen de clases ni de textos de botones salvo los que 09-INTERFAZ.md fija
// palabra por palabra.
// Mientras el corte 1 no exista, sale con código 2 y dice qué falta.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../..');
// Playwright se instala con --no-save en _dev/supabase-local (no va en el
// repositorio); un módulo ES no mira NODE_PATH, por eso se pide desde allí.
const { chromium } = createRequire(path.join(RAIZ, '_dev/supabase-local/requerir.js'))('playwright');
const SITIO = process.env.METAS_SITIO || 'http://localhost:8123';
const NUBE = { url: process.env.METAS_API, llavePublica: process.env.METAS_PUBLICA };
const A = { correo: 'a@ejemplo.invalid', clave: 'clave-a' };

// La compuerta mira la vista de Mi aula del corte 1 (rev. 9): el formulario
// de entrada lo pinta app.js dentro de la Zona Docente, no está escrito en
// index.html.
if (!fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').includes('data-metas="mi-aula"')) {
  console.log('… capa C escrita antes del código: index.html todavía no tiene Mi aula del corte 1');
  console.log('  (data-metas="mi-aula"); hasta entonces esta capa no puede correr');
  process.exit(2);
}

// Textos que NO pueden aparecer en ninguna pantalla (09-INTERFAZ.md, 9.1).
const PROHIBIDOS = [
  /guardad[oa]\b/i, /guardando/i, /sincroniz/i, /\bnube\b/i, /al d[ií]a/i, /pendiente/i,
  /recuperar(?! contrase)/i, /restaurar/i, /papelera/i, /versi[oó]n(es)? (anterior|guardada)/i,
  /por subir/i, /subir pendientes/i, /usar este equipo/i, /empezar de nuevo/i, /pagos recuperados/i,
  /\berror\b/i, /servidor/i, /sin conexi[oó]n con/i,
];
const TAMANOS = [
  { nombre: 'teléfono', viewport: { width: 390, height: 844 } },
  { nombre: 'tablet', viewport: { width: 800, height: 1280 } },
  { nombre: 'PC', viewport: { width: 1366, height: 768 } },
];

let total = 0;
let fallas = 0;
async function prueba(nombre, fn) {
  total++;
  try {
    await fn();
    console.log('  ✔', nombre);
  } catch (e) {
    fallas++;
    console.log('  ✘', nombre, '\n      ', e && e.message ? e.message.split('\n')[0] : e);
  }
}
function afirma(cond, msg) {
  if (!cond) throw new Error(msg || 'no se cumplió');
}
const m = (nombre) => `[data-metas="${nombre}"]`;

const navegador = await chromium.launch();
async function contexto(tam) {
  const ctx = await navegador.newContext({ viewport: tam.viewport, locale: 'es-HN' });
  await ctx.addInitScript((nube) => { window.__METAS_NUBE_DE_PRUEBA__ = nube; }, NUBE);
  return ctx;
}
// La entrada del docente vive en la Zona Docente, no en la portada del
// alumno (rev. 9, decidido por Josué): primero se toca «Zona Docente».
async function aZonaDocente(pagina) {
  await pagina.goto(SITIO + '/index.html');
  await pagina.click(m('ir-zona-docente'));
}
async function entrar(pagina) {
  await aZonaDocente(pagina);
  await pagina.fill(m('entrar-correo'), A.correo);
  await pagina.fill(m('entrar-clave'), A.clave);
  await pagina.click(m('entrar-boton'));
  await pagina.waitForSelector(m('ir-mi-aula'));
  await pagina.click(m('ir-mi-aula'));
  await pagina.waitForSelector(m('mi-aula'));
}
async function textoVisible(pagina) {
  return pagina.evaluate(() => document.body.innerText);
}
async function sinProhibidos(pagina, donde) {
  const t = await textoVisible(pagina);
  const hallado = PROHIBIDOS.find((re) => re.test(t));
  afirma(!hallado, `${donde}: aparece ${hallado} → «${(t.match(hallado) || [''])[0]}»`);
}
async function sinScrollLateral(pagina, donde) {
  const ancho = await pagina.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  afirma(ancho <= 1, `${donde}: se corre ${ancho} px a los lados`);
}
// Las pantallas de Mi aula del corte 1 (cada una con su data-metas).
const PANTALLAS = ['lista', 'notas', 'asistencia', 'colectas', 'controles', 'avisos', 'conducta', 'gastos'];

console.log('▶ Capa C · la pantalla del corte 1');

for (const tam of TAMANOS) {
  await prueba(`C1 ${tam.nombre}: con señal no hay NINGÚN indicador ni texto técnico en ninguna pantalla`, async () => {
    const ctx = await contexto(tam);
    const p = await ctx.newPage();
    await entrar(p);
    for (const pant of PANTALLAS) {
      await p.click(m('ir-' + pant));
      await p.waitForSelector(m('pantalla-' + pant));
      afirma(!(await p.isVisible(m('senal'))), `${pant}: se ve el indicador de señal con señal`);
      await sinProhibidos(p, pant);
      await sinScrollLateral(p, pant);
    }
    await ctx.close();
  });
}

await prueba('C2 sin señal: solo el punto gris, con aria-label «Sin señal» y sin texto; vuelve la señal y se va', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await entrar(p);
  await ctx.setOffline(true);
  await p.evaluate(() => window.dispatchEvent(new Event('offline')));
  await p.waitForSelector(m('senal'), { state: 'visible', timeout: 5000 });
  const punto = p.locator(m('senal'));
  afirma((await punto.getAttribute('aria-label')) === 'Sin señal', 'aria-label');
  afirma(((await punto.innerText()) || '').trim() === '', 'el indicador lleva texto');
  await sinProhibidos(p, 'sin señal');
  await ctx.setOffline(false);
  await p.evaluate(() => window.dispatchEvent(new Event('online')));
  await p.waitForSelector(m('senal'), { state: 'hidden', timeout: 10000 });
  await ctx.close();
});

await prueba('C3 pregunta de dinero entre dos aparatos: tarjeta con dos botones de 44 px y los dos montos', async () => {
  const tel = await contexto(TAMANOS[0]);
  const pc = await contexto(TAMANOS[2]);
  const p1 = await tel.newPage();
  const p2 = await pc.newPage();
  await entrar(p1); await entrar(p2);
  for (const p of [p1, p2]) { await p.click(m('ir-colectas')); await p.click(`${m('colecta')}:first-child`); }
  await tel.setOffline(true); await pc.setOffline(true);
  await p1.click(`${m('pago-alumno')}:first-child`); await p1.fill(m('monto'), '50'); await p1.click(m('anotar'));
  await p2.click(`${m('pago-alumno')}:first-child`); await p2.fill(m('monto'), '60'); await p2.click(m('anotar'));
  await tel.setOffline(false); await p1.evaluate(() => window.dispatchEvent(new Event('online')));
  await p1.waitForTimeout(2000);
  await pc.setOffline(false); await p2.evaluate(() => window.dispatchEvent(new Event('online')));
  await p2.waitForSelector(m('pregunta'), { timeout: 10000 });
  const texto = await p2.locator(m('pregunta-texto')).innerText();
  afirma(/L 50\.00/.test(texto) && /L 60\.00/.test(texto), texto);
  const botones = p2.locator(m('pregunta-boton'));
  afirma((await botones.count()) === 2, 'no son dos botones');
  for (let i = 0; i < 2; i++) {
    const caja = await botones.nth(i).boundingBox();
    afirma(caja.height >= 44 && caja.width >= 44, `botón ${i + 1}: ${caja.width}×${caja.height}`);
  }
  await tel.close(); await pc.close();
});

await prueba('C4 colecta cerrada: «Esta colecta está cerrada. ¿Reabrirla?» → [Reabrir] [Dejarla cerrada]', async () => {
  const ctx = await contexto(TAMANOS[1]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-colectas'));
  await p.click(`${m('colecta')}[data-estado="cerrada"]`);
  await p.click(`${m('pago-alumno')}:first-child`);
  await p.waitForSelector(m('pregunta'));
  afirma((await p.locator(m('pregunta-texto')).innerText()).trim() === 'Esta colecta está cerrada. ¿Reabrirla?');
  const etiquetas = await p.locator(m('pregunta-boton')).allInnerTexts();
  afirma(etiquetas.map((s) => s.trim()).join('|') === 'Reabrir|Dejarla cerrada', etiquetas.join('|'));
  await ctx.close();
});

await prueba('C5 primera vez sin señal: una sola frase, «Para entrar la primera vez se necesita señal»', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await aZonaDocente(p);                    // carga con señal (el sitio), entra sin señal
  await ctx.setOffline(true);
  await p.evaluate(() => window.dispatchEvent(new Event('offline')));
  await p.fill(m('entrar-correo'), A.correo);
  await p.fill(m('entrar-clave'), A.clave);
  await p.click(m('entrar-boton'));
  await p.waitForSelector(m('aviso-primera-vez'));
  afirma((await p.locator(m('aviso-primera-vez')).innerText()).trim() === 'Para entrar la primera vez se necesita señal');
  await sinProhibidos(p, 'primera vez');
  await ctx.close();
});

await prueba('C6 carga rápida: pegar 43 alumnos, tocar dos veces y cortar la señal → 43, ni uno más', async () => {
  const ctx = await contexto(TAMANOS[2]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-carga-rapida'));
  const lista = Array.from({ length: 43 }, (_, i) => `Alumna Ficticia C${String(i + 1).padStart(2, '0')}`).join('\n');
  await p.fill(m('carga-pegar'), lista);
  await p.click(m('carga-vista-previa'));
  afirma((await p.locator(m('carga-fila')).count()) === 43, 'la vista previa no muestra 43');
  await p.click(m('carga-guardar'));
  await ctx.setOffline(true);
  await p.click(m('carga-guardar')).catch(() => {});
  await ctx.setOffline(false);
  await p.evaluate(() => window.dispatchEvent(new Event('online')));
  await p.click(m('ir-lista'));
  await p.waitForTimeout(3000);
  // Solo los que pegó esta prueba (C01 a C43): la capa A ya tiene en esa
  // aula a «Alumna Ficticia Cinco» y «Alumna Ficticia Carrera Dos» (rev. 9).
  const pegados = await p.locator(m('alumno')).filter({ hasText: /Alumna Ficticia C\d{2}\b/ }).count();
  afirma(pegados === 43, `${pegados} en la lista, no 43`);
  await ctx.close();
});

await prueba('C7 accesibilidad: sin user-scalable=no y botones de pregunta de 44 px', async () => {
  for (const pagina of ['index.html', 'padres.html']) {
    const html = fs.readFileSync(path.join(RAIZ, pagina), 'utf8');
    afirma(!/user-scalable\s*=\s*no/i.test(html), pagina);
  }
});

await prueba('C8 portal de familias: el monto se lee «L 150.00» y la clave vencida da su frase de usted', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await p.goto(SITIO + '/padres.html');
  await p.fill(m('familia-clave'), '1-K7QM');             // conservada y ya vencida en la capa A
  await p.click(m('familia-entrar'));
  await p.waitForSelector(m('familia-aviso'));
  afirma((await p.locator(m('familia-aviso')).innerText()).trim()
    === 'Esta clave ya no sirve. Escriba la clave de la tira nueva que le dio su docente.');
  await sinProhibidos(p, 'padres');
  await ctx.close();
});

await navegador.close();
console.log(fallas ? `\n✘ ${fallas} de ${total} pruebas de la capa C FALLARON` : `\n✅ Las ${total} pruebas de la capa C en verde`);
process.exit(fallas ? 1 : 0);
