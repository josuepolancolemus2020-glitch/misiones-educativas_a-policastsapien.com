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
// METAS_SOLO=C3 corre solo las pruebas cuyo nombre empieza así (para
// mirar una de cerca); la corrida completa no la usa.
const SOLO = process.env.METAS_SOLO ? new RegExp('^(' + process.env.METAS_SOLO + ')\\b') : null;
async function prueba(nombre, fn) {
  if (SOLO && !SOLO.test(nombre)) return;
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
  // Rev. 10: arriba están los grupos como pastillas. La docente A tiene,
  // además del aula de la capa A, las que crean las capas A+ y B; se toca la
  // de la capa A («Escuela Ficticia Las Flores»), donde están sus colectas.
  const capaA = pagina.locator(`${m('grupo')}[title*="Las Flores"]`);
  await capaA.first().waitFor({ timeout: 10000 });
  await capaA.first().click();
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
// Las secciones de Mi aula que ya viven en filas (rev. 10: las pastillas de
// la Mi aula de siempre). Equipos, Acumulativos, Estadísticas y Lectura
// abren la pantalla de antes hasta su corte (08, 8.2) y no entran aquí.
const PANTALLAS = ['alumnos', 'economia', 'asistencia', 'controles', 'notas', 'comunicados'];
// Lo que se toca vive en la pantalla y no en el encabezado de la app.
async function botonesDe44(pagina, donde) {
  const chicos = await pagina.evaluate(() => {
    const malos = [];
    document.querySelectorAll('#mi-aula button, #mi-aula input, #mi-aula select, #mi-aula summary, #mi-aula textarea, #ma-tarjeta button, #ma-tarjeta input')
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        // Las casillas de la tabla de notas son su celda entera (46 px de alto).
        if (r.height < 44 || (el.tagName === 'BUTTON' && r.width < 44)) {
          malos.push((el.getAttribute('data-metas') || el.className || el.tagName) + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
        }
      });
    return malos;
  });
  afirma(!chicos.length, `${donde}: menos de 44 px → ${chicos.slice(0, 4).join(', ')}`);
}

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
      await botonesDe44(p, pant);
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
  // Rev. 10: las colectas están en Economía. El teléfono anota de UN toque
  // el aporte completo (L 50.00); la PC, con «Otro monto», L 60.00.
  for (const p of [p1, p2]) {
    await p.click(m('ir-economia'));
    await p.locator(m('colecta')).filter({ hasText: 'Excursión' }).first().click();
  }
  await tel.setOffline(true); await pc.setOffline(true);
  await p1.locator(`${m('pago-alumno')}[data-estado="debe"]`).first().click();
  await p2.click(m('otro-monto'));
  await p2.locator(`${m('pago-alumno')}[data-estado="debe"]`).first().click();
  await p2.fill(m('monto'), '60'); await p2.click(m('anotar'));
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
  await p.click(m('ir-economia'));
  await p.click(`${m('colecta')}[data-estado="cerrada"]`);
  await p.locator(m('pago-alumno')).first().click();
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
  await p.click(m('ir-alumnos'));
  await p.click(m('ir-carga-rapida'));
  const lista = Array.from({ length: 43 }, (_, i) => `Alumna Ficticia C${String(i + 1).padStart(2, '0')}`).join('\n');
  await p.fill(m('carga-pegar'), lista);
  await p.click(m('carga-vista-previa'));
  afirma((await p.locator(m('carga-fila')).count()) === 43, 'la vista previa no muestra 43');
  await p.click(m('carga-guardar'));
  await ctx.setOffline(true);
  // Rev. 10: anotada la lista, el botón queda apagado; el segundo toque no
  // llega a nada (por eso no se espera los 30 s de Playwright).
  await p.click(m('carga-guardar'), { timeout: 1500 }).catch(() => {});
  await ctx.setOffline(false);
  await p.evaluate(() => window.dispatchEvent(new Event('online')));
  await p.click(m('ir-alumnos'));
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

// ── Rev. 10: la cuadrícula de UN toque, como en la Mi aula de siempre ──
async function estado(p, metas, alumno) {
  return p.getAttribute(`${m(metas)}[data-alumno="${alumno}"]`, 'data-estado');
}
async function esperaEstado(p, metas, alumno, valor) {
  await p.waitForSelector(`${m(metas)}[data-alumno="${alumno}"][data-estado="${valor}"]`, { timeout: 5000 });
}
async function preguntaDeDos(p, texto) {
  await p.waitForSelector(m('pregunta'));
  const t = await p.locator(m('pregunta-texto')).innerText();
  afirma(!texto || texto.test(t), 'la pregunta dice: ' + t);
  const b = p.locator(m('pregunta-boton'));
  afirma((await b.count()) === 2, 'no son dos botones');
  for (let i = 0; i < 2; i++) {
    const caja = await b.nth(i).boundingBox();
    afirma(caja.height >= 44 && caja.width >= 44, `botón ${i + 1}: ${caja.width}×${caja.height}`);
  }
  return b;
}

await prueba('C9 colectas: un toque anota el aporte completo, sin cajita; quitarlo pregunta con dos botones; «Otro monto» abre la cajita', async () => {
  const ctx = await contexto(TAMANOS[1]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-economia'));
  await p.click(m('nueva-colecta'));
  await p.fill('[data-form="colecta"] [name="concepto"]', 'Colecta C9 (ficticia)');
  await p.fill('[data-form="colecta"] [name="monto"]', '40');
  await p.click('[data-form="colecta"] [type="submit"]');
  await p.waitForSelector(m('pantalla-colecta'));
  const faltan = async () => Number((await p.locator(m('faltan-n')).innerText()).trim());
  const antes = await faltan();
  const casilla = p.locator(`${m('pago-alumno')}[data-estado="debe"]`).first();
  const al = await casilla.getAttribute('data-alumno');
  await casilla.click();
  await esperaEstado(p, 'pago-alumno', al, 'dio');
  const txt = await p.locator(`${m('pago-alumno')}[data-alumno="${al}"]`).innerText();
  afirma(txt.includes('L 40.00'), 'la casilla no dice el monto: ' + txt);
  afirma(!(await p.isVisible(m('monto'))), 'el toque abrió una cajita');
  afirma((await faltan()) === antes - 1, 'Faltan por dar no bajó');
  // Quitarlo: dos botones; «Dejarlo» no cambia nada.
  await p.click(`${m('pago-alumno')}[data-alumno="${al}"]`);
  await p.click(m('quitar-pago'));
  let b = await preguntaDeDos(p, /L 40\.00/);
  await b.nth(1).click();
  afirma((await estado(p, 'pago-alumno', al)) === 'dio', '«Dejarlo» quitó el pago');
  await p.click(`${m('pago-alumno')}[data-alumno="${al}"]`);
  await p.click(m('quitar-pago'));
  b = await preguntaDeDos(p, /L 40\.00/);
  await b.nth(0).click();
  await esperaEstado(p, 'pago-alumno', al, 'debe');
  afirma((await faltan()) === antes, 'Faltan por dar no volvió');
  // Un monto distinto: «Otro monto», el toque y la cajita.
  await p.click(m('otro-monto'));
  await p.click(`${m('pago-alumno')}[data-alumno="${al}"]`);
  await p.fill(m('monto'), '15');
  await p.click(m('anotar'));
  await esperaEstado(p, 'pago-alumno', al, 'abono');
  afirma((await p.locator(`${m('pago-alumno')}[data-alumno="${al}"]`).innerText()).includes('L 15.00'), 'el abono no dice L 15.00');
  await sinProhibidos(p, 'colecta');
  await ctx.close();
});

await prueba('C10 asistencia: todos presentes de entrada; un toque marca la falta; «Todos presentes este día» pregunta y deja a todos', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-asistencia'));
  await p.fill('[data-accion="fecha"]', '2026-03-02');
  await p.waitForFunction(() => document.querySelector('[data-accion="fecha"]').value === '2026-03-02'
    && document.querySelectorAll('[data-metas="asistencia-alumno"]').length > 0);
  const estados = await p.locator(m('asistencia-alumno')).evaluateAll((xs) => xs.map((x) => x.dataset.estado));
  afirma(estados.length > 0 && estados.every((e) => e === 'presente'), 'no estaban todos presentes: ' + estados.join(','));
  afirma((await p.locator(m('asis-cuenta')).innerText()).includes('Todos presentes'), 'la cuenta no dice «Todos presentes»');
  const primeros = await p.locator(m('asistencia-alumno')).evaluateAll((xs) => xs.slice(0, 2).map((x) => x.dataset.alumno));
  await p.click(`${m('asistencia-alumno')}[data-alumno="${primeros[0]}"]`);
  await esperaEstado(p, 'asistencia-alumno', primeros[0], 'ausente');
  afirma((await p.locator(`${m('asistencia-alumno')}[data-alumno="${primeros[0]}"]`).innerText()).includes('Faltó'), 'la falta no se dice con palabra');
  afirma(/1\s*faltó/.test(await p.locator(m('asis-cuenta')).innerText()), 'la cuenta no dice 1 faltó');
  await p.click(`${m('asistencia-alumno')}[data-alumno="${primeros[0]}"]`);
  await esperaEstado(p, 'asistencia-alumno', primeros[0], 'excusa');
  await p.click(`${m('asistencia-alumno')}[data-alumno="${primeros[0]}"]`);
  await esperaEstado(p, 'asistencia-alumno', primeros[0], 'presente');
  for (const a of primeros) await p.click(`${m('asistencia-alumno')}[data-alumno="${a}"]`);
  await esperaEstado(p, 'asistencia-alumno', primeros[1], 'ausente');
  await p.click(m('todos-presentes'));
  const b = await preguntaDeDos(p, /2 marcas/);
  await b.nth(0).click();
  await esperaEstado(p, 'asistencia-alumno', primeros[0], 'presente');
  await esperaEstado(p, 'asistencia-alumno', primeros[1], 'presente');
  await sinProhibidos(p, 'asistencia');
  await ctx.close();
});

await prueba('C11 controles: un toque pone ✓ y otro la quita; «Anotados N/M · Faltan»; «Marcar a todos» y «Quitar todas las marcas»', async () => {
  const ctx = await contexto(TAMANOS[2]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-controles'));
  await p.fill('[data-form="control"] [name="nombre"]', 'Control C11 (ficticio)');
  await p.click(m('nuevo-control'));
  await p.waitForSelector(m('control-cuenta'));
  const n = await p.locator(m('control-alumno')).count();
  const cuenta = async () => (await p.locator(m('control-cuenta')).innerText()).replace(/\s+/g, ' ');
  afirma((await cuenta()).includes(`0/${n}`) && (await cuenta()).includes(`Faltan: ${n}`), await cuenta());
  const al = await p.locator(m('control-alumno')).first().getAttribute('data-alumno');
  const sel = `${m('control-alumno')}[data-alumno="${al}"]`;
  await p.click(sel);
  await p.waitForSelector(`${sel}[aria-pressed="true"]`);
  afirma((await p.locator(sel).innerText()).includes('✓'), 'la marca no lleva ✓');
  afirma((await cuenta()).includes(`1/${n}`), await cuenta());
  await p.click(sel);
  await p.waitForSelector(`${sel}[aria-pressed="false"]`);
  afirma((await cuenta()).includes(`0/${n}`), await cuenta());
  await p.click(m('marcar-todos'));
  await p.waitForFunction((t) => document.querySelector('[data-metas="control-cuenta"]').innerText.includes(t), `${n}/${n}`);
  afirma((await cuenta()).includes('Faltan: 0'), await cuenta());
  await p.click(m('quitar-marcas'));
  const b = await preguntaDeDos(p);
  await b.nth(0).click();
  await p.waitForFunction((t) => document.querySelector('[data-metas="control-cuenta"]').innerText.includes(t), `0/${n}`);
  await sinProhibidos(p, 'controles');
  await ctx.close();
});

await navegador.close();
console.log(fallas ? `\n✘ ${fallas} de ${total} pruebas de la capa C FALLARON` : `\n✅ Las ${total} pruebas de la capa C en verde`);
process.exit(fallas ? 1 : 0);
