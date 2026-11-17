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

// ── Rev. 11: lo que sigue en el blob viaja por SESIÓN (CONGELAR, paso 1d) ──
// Equipos, Acumulativos, Estadísticas, Lectura, Gastos de mi bolsillo e
// Inventario abren la pantalla de antes. Con CONGELAR aplicado y SIN la
// entrada vieja (en 127.0.0.1 nunca se hace), lo que se anota allí tiene que
// llegar a la base: al blob con metas.blob_guardar, o a filas lo que es del
// corte 1 (gastos del docente, observación del grado). Y verse en otro aparato.
const { execFileSync } = await import('node:child_process');
function sql(q) {
  return execFileSync('psql', [process.env.METAS_DB, '-XAtq', '-v', 'ON_ERROR_STOP=1', '-c', q], { encoding: 'utf8' }).trim();
}
async function hasta(fn, que, ms = 25000) {
  const fin = Date.now() + ms;
  let ultimo;
  while (Date.now() < fin) {
    try { ultimo = await fn(); if (ultimo) return ultimo; } catch (e) { ultimo = e.message; }
    await new Promise((ok) => setTimeout(ok, 700));
  }
  throw new Error(que + ' (último: ' + String(ultimo).slice(0, 160) + ')');
}
// Únicos por corrida: la capa C se puede volver a correr sobre la misma base.
const GASTO_C13 = 'Copias C13 ' + Date.now().toString(36) + ' (ficticio)';
const BLOB_A = `(select valor->>'raw' from public.docente_estado where codigo = 'PROF-AAAA000001' and k = 'METAS_ADMIN_V1')`;
const AULA_A = `(select id from metas.aulas where owner = '00000000-0000-0000-0000-00000000000a' and escuela like '%Las Flores%' and deleted_at is null limit 1)`;
// Lo que no puede pasar: la app vieja (con contraseña) hablando con la base.
function vigilarViejo(p, dichas) {
  p.on('request', (r) => {
    if (/rpc\/(metas_docente_estado_(guardar|leer)|metas_guardar_admin|metas_guardar_avisos)\b/.test(r.url())) dichas.push(r.url());
  });
}
async function aVieja(p, seccion) {
  await p.click(m('ir-' + seccion));
  await p.waitForSelector('#view-admin.active #ad-tab-body');
}
async function aEconomiaVieja(p, puerta) {
  await p.click(m('ir-economia'));
  await p.waitForSelector(m('pantalla-economia'));
  await p.click(m(puerta));
  await p.waitForSelector('#view-admin.active #ad-tab-body');
}

await prueba('C12 sin la sesión vieja: la ficha no guarda contraseña, y Equipos, Acumulativos y Lectura van al blob por sesión con su lista desde las filas', async () => {
  const ctx = await contexto(TAMANOS[2]);
  const p = await ctx.newPage();
  const viejas = [];
  vigilarViejo(p, viejas);
  // El blob de la docente como quedó ANTES del paso 1: un grupo del mismo
  // grado y sección que el aula de la capa A, CON su lista (el archivo) y un
  // acumulativo suyo. Se escribe con el candado apagado solo en esta
  // transacción: después del paso 1 ninguna app lo puede escribir así.
  sql(`begin;
       alter table public.docente_estado disable trigger docente_estado_candado;
       update public.docente_estado
          set valor = jsonb_build_object('raw', jsonb_build_object('v', 2, 'grupos', jsonb_build_array(jsonb_build_object(
                'id', 'GVIEJO', 'grado', '6', 'seccion', '1', 'escuela', 'Escuela Ficticia Las Flores',
                'lista', jsonb_build_array(jsonb_build_object('num', 1, 'nombre', 'Alumna de antes (ficticia)', 'clave', '1K7QM')),
                'notas', jsonb_build_object('I', jsonb_build_object('Matemáticas', jsonb_build_object('1', '70'))),
                'acumulativos', jsonb_build_array(jsonb_build_object('id', 'AVIEJO', 'titulo', 'Acumulativo de antes (ficticio)',
                  'icono', '📝', 'materia', '', 'parcial', 'I', 'fecha', '2026-03-01', 'tipo', 'actividades',
                  'calculo', 'promedio', 'criterios', jsonb_build_array(jsonb_build_object('id', 'c1', 't', 'Trabajo', 'pts', 10)),
                  'notas', '{}'::jsonb, 'creado', 1)))))::text),
              version = version + 1
        where codigo = 'PROF-AAAA000001' and k = 'METAS_ADMIN_V1';
       alter table public.docente_estado enable trigger docente_estado_candado;
       commit;`);
  await entrar(p);
  const ficha = await p.evaluate(() => JSON.parse(localStorage.getItem('METAS_DOCENTE_V1') || '{}'));
  afirma(ficha.codigo === 'PROF-AAAA000001', 'la ficha no tiene el código: ' + JSON.stringify(ficha));
  afirma(!('clave' in ficha), 'la ficha guarda una contraseña');
  // Equipos: la lista sale de las filas (la de Mi aula) y el reparto va al blob.
  await aVieja(p, 'equipos');
  const enLista = await p.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    const g = st.grupos.find((x) => x.id === st.activo);
    return { aula: g.aula, n: g.lista.length, nombres: g.lista.map((a) => a.nombre).join('|') };
  });
  afirma(enLista.aula === sql(`select ${AULA_A}`), 'el grupo activo no es el aula de Mi aula');
  afirma(enLista.n === Number(sql(`select count(*) from metas.alumnos where aula_id = ${AULA_A} and deleted_at is null`)),
    'la lista de la pantalla de antes no es la de las filas');
  afirma(enLista.nombres.includes('Alumna Ficticia Cinco'), 'falta la alumna de la capa A');
  await p.click('#eq-armar');
  await hasta(() => sql(`select ${BLOB_A}::jsonb @? '$.grupos[*] ? (@.aula == "${enLista.aula}").equipos.reparto ? (@ != "")'`) === 't',
    'el reparto de equipos no llegó al blob');
  // Acumulativos: una actividad desde una plantilla.
  await p.click('#admin-back-btn');
  await p.waitForSelector(m('mi-aula'));
  await aVieja(p, 'acumulativos');
  await p.click('#ac-nuevo');
  await p.click('[data-plant]');
  await hasta(() => Number(sql(`select coalesce(jsonb_array_length((select g->'acumulativos' from jsonb_array_elements(${BLOB_A}::jsonb->'grupos') g where g->>'aula' = '${enLista.aula}')), 0)`)) >= 1,
    'el acumulativo no llegó al blob');
  // Lectura: una toma completa (arranca, marca la última palabra, contesta y guarda).
  await p.click('#admin-back-btn');
  await p.waitForSelector(m('mi-aula'));
  await aVieja(p, 'lectura');
  await p.click('#lec-empezar');
  await p.click('#lec-arrancar');
  await p.waitForTimeout(3300);
  await p.locator('#lec-texto .lec-p').nth(20).click();
  for (const b of await p.locator('[data-lecresp][data-val="1"]').all()) await b.click();
  await p.click('#lec-terminar');
  await p.click('#lec-guardar');
  await hasta(() => sql(`select ${BLOB_A}::jsonb @? '$.grupos[*] ? (@.aula == "${enLista.aula}").lectura[*].ppm'`) === 't',
    'la toma de lectura no llegó al blob');
  // El grupo de antes del mismo grado y sección se unió al aula, con su
  // acumulativo: no queda aparte, escondido.
  // (el grupo conserva su id; lo que cambia es que ya es el de esa aula)
  await hasta(() => sql(`select not (${BLOB_A}::jsonb @? '$.gruposSinAula[*] ? (@.id == "GVIEJO")')
                          and (${BLOB_A}::jsonb @? '$.grupos[*] ? (@.id == "GVIEJO" && @.aula == "${enLista.aula}")')
                          and (${BLOB_A}::jsonb @? '$.grupos[*] ? (@.aula == "${enLista.aula}").acumulativos[*] ? (@.id == "AVIEJO")')
                          and not (${BLOB_A}::jsonb @? '$.grupos[*].lista[*]')`) === 't',
    'el grupo de antes no se unió a su aula');
  // Nada del corte 1 en el blob, y ni una llamada de la app vieja.
  afirma(sql(`select metas._blob_bloqueado('PROF-AAAA000001', 'METAS_ADMIN_V1', ${BLOB_A}) is null`) === 't',
    'el blob guarda algo del corte 1');
  afirma(!viejas.length, 'la app habló con la base con la contraseña: ' + viejas[0]);
  // Lo que es del corte 1 se abre en Mi aula, no en la pantalla de antes.
  await p.click('#admin-content [data-adtab="lista"]');
  await p.waitForSelector(m('pantalla-alumnos'));
  await ctx.close();
});

await prueba('C13 Gastos de mi bolsillo: se anota y se cobra como siempre, y queda en filas (gastos_docente y su reembolso), no en el blob', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  const viejas = [];
  vigilarViejo(p, viejas);
  await entrar(p);
  await aEconomiaVieja(p, 'ir-gastos-bolsillo');
  await p.fill('#ad-gsto-con', GASTO_C13);
  await p.fill('#ad-gsto-monto', '35');
  await p.click('#ad-gsto-add');
  const id = await hasta(() => sql(`select id from metas.gastos_docente where concepto = '${GASTO_C13}' and deleted_at is null`),
    'el gasto no llegó a metas.gastos_docente');
  afirma(sql(`select monto::text from metas.gastos_docente where id = '${id}'`) === '35.00', 'el monto no es 35.00');
  await p.click(`[data-cobrado="${id}"]`);
  await hasta(() => sql(`select count(*) from metas.reembolsos where gasto_id = '${id}' and deleted_at is null and monto = 35`) === '1',
    'el reembolso no quedó');
  await p.waitForSelector(`[data-reabrir="${id}"]`);
  afirma(sql(`select coalesce(${BLOB_A}::jsonb ? 'gastos', false)`) === 'f', 'los gastos fueron al blob');
  // La flecha vuelve a la Economía de Mi aula.
  await p.click('#admin-back-btn');
  await p.waitForSelector(m('pantalla-economia'));
  afirma(!viejas.length, 'la app habló con la base con la contraseña: ' + viejas[0]);
  await ctx.close();
});

await prueba('C14 Inventario y Estadísticas: el inventario va al blob; la observación del grado, a metas.aulas', async () => {
  const ctx = await contexto(TAMANOS[1]);
  const p = await ctx.newPage();
  await entrar(p);
  await aEconomiaVieja(p, 'ir-inventario');
  await p.fill('#ad-inv-nom', 'Pizarra C14 (ficticia)');
  await p.click('#ad-inv-add');
  await hasta(() => sql(`select ${BLOB_A}::jsonb @? '$.inventario[*] ? (@.nombre == "Pizarra C14 (ficticia)")'`) === 't',
    'el inventario no llegó al blob');
  await p.click('#admin-back-btn');
  await p.waitForSelector(m('pantalla-economia'));
  await aVieja(p, 'estadisticas');
  await p.fill('#est-obs', 'Observación C14 del grado (ficticia)');
  await hasta(() => sql(`select observacion_grado from metas.aulas where id = ${AULA_A}`) === 'Observación C14 del grado (ficticia)',
    'la observación del grado no llegó a metas.aulas');
  afirma(sql(`select metas._blob_bloqueado('PROF-AAAA000001', 'METAS_ADMIN_V1', ${BLOB_A}) is null`) === 't',
    'el blob guarda algo del corte 1');
  await ctx.close();
});

await prueba('C15 otro aparato: entra y ve el inventario, el gasto cobrado, el acumulativo, la toma de lectura y la observación', async () => {
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await entrar(p);
  await aEconomiaVieja(p, 'ir-inventario');
  await p.waitForSelector('#ad-tab-body :text("Pizarra C14 (ficticia)")', { timeout: 15000 });
  await p.click('#admin-back-btn');
  await aEconomiaVieja(p, 'ir-gastos-bolsillo');
  await p.waitForSelector(`#ad-tab-body .ad-gsto-ok :text("${GASTO_C13}")`, { timeout: 15000 });
  await p.click('#admin-back-btn');
  await p.waitForSelector(m('pantalla-economia'));
  await aVieja(p, 'acumulativos');
  await p.waitForSelector('#ad-tab-body [data-acid]', { timeout: 15000 });
  await p.click('#admin-back-btn');
  await aVieja(p, 'estadisticas');
  await p.waitForFunction(() => (document.getElementById('est-obs') || {}).value === 'Observación C14 del grado (ficticia)',
    null, { timeout: 15000 });
  const tomas = await p.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    const g = st.grupos.find((x) => x.id === st.activo);
    return (g.lectura || []).length;
  });
  afirma(tomas >= 1, 'la toma de lectura no llegó a este aparato');
  await ctx.close();
});

await prueba('C16 importar un archivo: vista previa con ✓ ⚠ ✗, preguntas de dos botones, guardar una vez y reimportar sin duplicar', async () => {
  const ejemplo = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/rediseno-datos/ejemplo-importacion.json'), 'utf8'));
  ejemplo.aula.escuela = 'Escuela Ficticia C16 ' + Date.now().toString(36);
  const archivo = { name: 'aula-6-1.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(ejemplo)) };
  const ctx = await contexto(TAMANOS[0]);
  const p = await ctx.newPage();
  await entrar(p);
  await p.click(m('ir-alumnos'));
  await p.click(m('ir-carga-rapida'));
  async function abrirArchivo() {
    const elegir = p.waitForEvent('filechooser');
    await p.click(m('importar-elegir'));
    await (await elegir).setFiles(archivo);
    await p.waitForSelector(m('importar-vista-previa'), { timeout: 15000 }).catch(async (e) => {
      throw new Error('sin vista previa: ' + (await p.locator(m('importar')).innerText()).slice(0, 300));
    });
  }
  await abrirArchivo();
  const vista = await p.locator(m('importar-vista-previa')).innerText();
  afirma(vista.includes('Vas a guardar en 6º-1') && vista.includes('(grupo nuevo)'), vista.slice(0, 200));
  // Lo que no se puede guardar lo dice con ✗, y lo leído con duda con ⚠.
  const malas = p.locator(`${m('importar-fila')}[data-estado="error"]`);
  afirma(await malas.count() >= 3, 'faltan las filas con ✗');
  afirma((await malas.first().innerText()).includes('✗'), 'una fila mala no lleva ✗');
  afirma(/⚠ revisar/.test(vista), 'lo leído con duda no dice «revisar»');
  // «1,500» se pregunta con dos botones; la diferencia con el cuaderno, también.
  const dos = p.locator('[data-accion="importar-decidir"][data-clave="gastodoc:1"]');
  afirma(await dos.count() === 2, 'el «1,500» no trae dos botones');
  await p.click('[data-accion="importar-decidir"][data-clave="gastodoc:1"][data-valor="1500.00"]');
  await p.waitForSelector('[data-clave="gastodoc:1"][data-valor="1500.00"][aria-pressed="true"]');
  await p.click(m('importar-diferencia'));
  await p.waitForSelector(`${m('importar-diferencia')}[aria-pressed="true"]`);
  await sinProhibidos(p, 'vista previa');
  await sinScrollLateral(p, 'vista previa');
  await botonesDe44(p, 'vista previa');
  const guardar = p.locator(m('importar-guardar'));
  afirma(/Guardar \d+ datos nuevos/.test(await guardar.innerText()), await guardar.innerText());
  await guardar.click();
  await p.waitForSelector(m('importar-listo'));
  const aula = await hasta(() => sql(`select id from metas.aulas where escuela = '${ejemplo.aula.escuela}' and deleted_at is null`),
    'el aula no llegó a la base');
  const cuenta = () => sql(`select (select count(*) from metas.alumnos where aula_id = '${aula}' and deleted_at is null) || '/'
      || (select count(*) from metas.pagos where aula_id = '${aula}' and deleted_at is null) || '/'
      || (select count(*) from metas.notas where aula_id = '${aula}' and deleted_at is null) || '/'
      || (select count(*) from metas.gastos_docente where owner = '00000000-0000-0000-0000-00000000000a'
            and concepto in ('Copias de la guía de lectura', 'Pintura para el aula') and deleted_at is null)`);
  await hasta(() => cuenta() === '3/3/4/2', 'no llegó todo a la base', 45000);
  afirma(sql(`select metas.monto_texto(recaudado) from metas._calc_colectas_resumen c join metas.colectas k on k.id = c.colecta_id
              where k.aula_id = '${aula}'`) === sql(`select sum(monto)::text from metas.pagos where aula_id = '${aula}' and deleted_at is null`),
    'lo recaudado no es la suma de los pagos');
  // El mismo archivo otra vez: nada nuevo, y el botón no guarda nada.
  await abrirArchivo();
  await p.click('[data-accion="importar-decidir"][data-clave="gastodoc:1"][data-valor="1500.00"]');
  await p.waitForSelector('[data-clave="gastodoc:1"][aria-pressed="true"]');
  afirma(await p.locator(m('importar-guardar')).isDisabled(), 'al reimportar se puede volver a guardar');
  afirma((await p.locator(m('importar-guardar')).innerText()).includes('No hay nada nuevo'), 'al reimportar no dice que no hay nada nuevo');
  await p.waitForTimeout(1500);
  afirma(cuenta() === '3/3/4/2', 'reimportar duplicó: ' + cuenta());
  await ctx.close();
});

// ── Preparar las claves de familia ────────────────────────────────────────
// El caso de Josué, con datos ficticios: un aula traída de un archivo SIN
// familias. Un solo botón en Alumnos: una línea de vista previa, Guardar una
// vez, todas las claves nuevas (aunque haya una vieja con el mismo nombre) y
// la clave en la lista, solo para leer. Tocar otra vez no duplica.
function sqlJson(q) {
  return JSON.parse(sql(`select coalesce(json_agg(x), '[]') from (${q}) x`) || '[]');
}
await prueba('C17 claves de familia: una línea de vista previa, Guardar una vez, todas nuevas, la clave en la lista y tocar otra vez no duplica', async () => {
  const corr = Date.now().toString(36).toUpperCase().slice(-4);
  const nom = (x) => `${x} Ficticia C17 ${corr}`;
  const vieja = '81' + corr;
  sql(`insert into metas.claves_archivo (docente_codigo, clave, nombre_alumno, origen)
       values ('PROF-AAAA000001', '${vieja}', '${nom('Ana')}', 'METAS_ADMIN_V1') on conflict do nothing`);
  const hitoAntes = sql(`select at from metas.hitos where nombre = 'claves_viejas_vencen'`);
  sql(`delete from metas.hitos where nombre = 'claves_viejas_vencen'`);
  const ctx = await contexto(TAMANOS[0]);
  try {
    const escuela = 'Escuela Ficticia C17 ' + corr;
    const archivo = { formato: ['metas-importacion', '1'].join('/'), aula: { escuela, grado: 3, seccion: '1', anio_lectivo: 2027 },
      alumnos: [['a1', 81, 'Ana'], ['a2', 82, 'Carla'], ['a3', 83, 'Bruno'], ['a4', 84, 'Dora']]
        .map(([ref, n, x]) => ({ ref, num_lista: n, nombre_completo: nom(x) })) };
    const p = await ctx.newPage();
    await entrar(p);
    await p.click(m('ir-alumnos'));
    await p.click(m('ir-carga-rapida'));
    const elegir = p.waitForEvent('filechooser');
    await p.click(m('importar-elegir'));
    await (await elegir).setFiles({ name: 'aula-sin-familias.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(archivo)) });
    await p.waitForSelector(m('importar-vista-previa'), { timeout: 15000 });
    await p.click(m('importar-guardar'));
    await p.waitForSelector(m('importar-listo'));
    const aula = await hasta(() => sql(`select id from metas.aulas where escuela = '${escuela}' and deleted_at is null`), 'el aula no llegó a la base');
    await hasta(() => sql(`select count(*) from metas.alumnos where aula_id = '${aula}' and deleted_at is null`) === '4', 'no llegaron los 4 alumnos');
    const fichas = () => sql(`select count(*) from metas.familias where aula_id = '${aula}' and deleted_at is null`);
    afirma(fichas() === '0', 'el archivo sin familias trajo fichas');
    await p.click(m('ir-alumnos'));
    await p.waitForSelector(m('claves-preparar'));
    afirma(await p.locator(`${m('alumno-clave')}[data-estado="sin"]`).count() === 4, 'la lista no dice «sin clave de familia» en los 4');

    // Una sola línea, sin preguntas ni listas de claves.
    await p.click(m('claves-preparar'));
    await p.waitForSelector(m('claves-vista-previa'), { timeout: 15000 }).catch(async () => {
      throw new Error('sin vista previa: ' + (await p.locator(m('claves')).innerText().catch(() => '')).slice(0, 300));
    });
    const vista = (await p.locator(m('claves-vista-previa')).innerText()).trim();
    afirma(vista === 'Se crearán 4 claves nuevas · 0 ya tenían la suya', 'la vista previa dice: ' + vista);
    afirma(!(await p.locator(m('claves')).innerText()).includes('81-' + corr), 'la vista previa ofrece la clave vieja');
    afirma(await p.locator(`${m('claves')} li, ${m('claves')} [aria-pressed]`).count() === 0, 'la vista previa trae listas o preguntas');
    afirma(fichas() === '0', 'la vista previa ya guardó algo');
    await sinProhibidos(p, 'claves, vista previa');
    await sinScrollLateral(p, 'claves, vista previa');
    await botonesDe44(p, 'claves, vista previa');
    const guardar = p.locator(m('claves-guardar'));
    await guardar.click();
    await guardar.click({ timeout: 1500 }).catch(() => {});      // el segundo toque no anota de nuevo
    await p.waitForSelector(m('claves-listo'));
    await hasta(() => fichas() === '4', 'no llegaron las 4 fichas', 30000);
    const enBase = sqlJson(`select f.clave, f.clave_origen from metas.familias f where f.aula_id = '${aula}' and f.deleted_at is null`);
    afirma(enBase.every((x) => x.clave_origen === 'nueva' && /^[A-HJ-NP-Z2-9]{10}$/.test(x.clave)) && enBase.every((x) => x.clave !== vieja),
      JSON.stringify(enBase));

    // La clave en la lista, solo para leer (sin campo ni botón para cambiarla).
    await hasta(async () => {
      const t = await p.locator(m('alumno-clave')).allInnerTexts();
      return t.length === 4 && t.every((x) => /🔑 [A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}/.test(x));
    }, 'la lista no muestra las 4 claves nuevas');
    afirma(await p.locator(`${m('alumno-clave')} input, ${m('alumno-clave')} button`).count() === 0, 'la clave se puede editar en la lista');

    // Tocar el botón otra vez: nada nuevo.
    await p.click(m('claves-preparar'));
    await p.waitForSelector(m('claves-vista-previa'), { timeout: 15000 });
    afirma((await p.locator(m('claves-vista-previa')).innerText()).trim() === 'Todos tus alumnos ya tienen su clave', 'la segunda vez no lo dice');
    afirma(await p.locator(m('claves-guardar')).isDisabled(), 'la segunda vez se puede guardar');
    await p.waitForTimeout(1500);
    afirma(fichas() === '4', 'tocar otra vez duplicó: ' + fichas());
  } finally {
    await ctx.close();
    if (hitoAntes) sql(`insert into metas.hitos (nombre, at) values ('claves_viejas_vencen', '${hitoAntes}')
                        on conflict (nombre) do update set at = excluded.at`);
  }
});

// ── Tiras de la clave de familia desde Mi aula ────────────────────────────
// «🖨️ Tiras de claves (QR)» y «🖨️ Su tira» imprimen con las MISMAS funciones
// de main (adTirasTodas, adTiraUno), con la clave de metas.familias. Se
// captura el HTML exacto que va a la ventana de impresión. Y con una clave
// vieja, la tira tiene que salir idéntica, letra por letra, a la de main
// (las funciones de main se leen de origin/main; METAS_MAIN cambia la rama).
function deMain(nombres) {
  const ref = process.env.METAS_MAIN || 'origin/main';
  let src;
  try {
    src = execFileSync('git', ['-C', RAIZ, 'show', ref + ':js/tools/registros-admin.js'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  } catch (e) {
    throw new Error('para comparar con main hace falta ' + ref + ' (git fetch origin main)');
  }
  return nombres.map((n) => {
    const i = src.indexOf('\nfunction ' + n + '(');
    afirma(i >= 0, n + ' no está en ' + ref);
    return src.slice(i, src.indexOf('\n}\n', i) + 3);
  }).join('\n');
}
await prueba('C18 tiras de claves: todo el aula y la de un alumno, con la clave nueva, sin señal; con una clave vieja, idéntica a main', async () => {
  const fuenteMain = deMain(['adClaveBonita', 'adTirasTodas', 'adTiraUno']);
  const corr = Date.now().toString(36).toUpperCase().slice(-4);
  const nom = (x) => `${x} Ficticia C18 ${corr}`;
  const ctx = await contexto(TAMANOS[0]);
  try {
    const escuela = 'Escuela Ficticia C18 ' + corr;
    const archivo = { formato: ['metas-importacion', '1'].join('/'), aula: { escuela, grado: 5, seccion: '2', anio_lectivo: 2027 },
      alumnos: [['a1', 1, 'Ana'], ['a2', 2, 'Beto'], ['a3', 3, 'Carla']]
        .map(([ref, n, x]) => ({ ref, num_lista: n, nombre_completo: nom(x) })) };
    const p = await ctx.newPage();
    await entrar(p);
    await p.click(m('ir-alumnos'));
    await p.click(m('ir-carga-rapida'));
    const elegir = p.waitForEvent('filechooser');
    await p.click(m('importar-elegir'));
    await (await elegir).setFiles({ name: 'aula-c18.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(archivo)) });
    await p.waitForSelector(m('importar-vista-previa'), { timeout: 15000 });
    await p.click(m('importar-guardar'));
    await p.waitForSelector(m('importar-listo'));
    const aula = await hasta(() => sql(`select id from metas.aulas where escuela = '${escuela}' and deleted_at is null`), 'el aula no llegó a la base');
    await p.click(m('ir-alumnos'));
    await p.waitForSelector(m('tiras-claves'));
    // Lo que se manda a imprimir, tal cual (sin abrir la ventana).
    await p.evaluate(() => {
      window.__impresos = [];
      window.adPrintAbrir = (html) => { window.__impresos.push(html); return null; };
      window.__toasts = [];
      const t = window.toast;
      window.toast = (x) => { window.__toasts.push(x); return t(x); };
    });
    const impresos = () => p.evaluate(() => window.__impresos.slice());

    // Nadie tiene ficha todavía: no se imprime nada y se dice qué hacer.
    await p.click(m('tiras-claves'));
    afirma((await impresos()).length === 0, 'sin claves se imprimió algo');
    afirma((await p.evaluate(() => window.__toasts)).includes('Primero toca Preparar claves de familia'), 'sin claves, sin aviso');

    // Carla se retira antes de preparar: no recibe ficha y no sale en las
    // tiras. Ana y Beto reciben su clave nueva de la base.
    await p.locator(`${m('alumno')} .ma-al-btn`).nth(2).click();
    await p.click('[data-accion="estado"][data-valor="retirado"]');
    await hasta(() => sql(`select estado from metas.alumnos where aula_id = '${aula}' and num_lista = 3`) === 'retirado', 'Carla no quedó retirada');
    await p.click(m('claves-preparar'));
    await p.waitForSelector(m('claves-guardar'));
    await p.click(m('claves-guardar'));
    await hasta(() => sql(`select count(*) from metas.familias where aula_id = '${aula}' and deleted_at is null`) === '2', 'no llegaron las fichas');
    const clave = Object.fromEntries(sqlJson(`select a.num_lista as n, f.clave from metas.familias f join metas.alumnos a on a.id = f.alumno_id
                                              where f.aula_id = '${aula}' and f.deleted_at is null`).map((x) => [x.n, x.clave]));
    const bonita = (c) => c.slice(0, 5) + '-' + c.slice(5);
    await hasta(async () => (await p.locator(m('alumno-clave')).allInnerTexts()).filter((t) => /[A-Z2-9]{5}-[A-Z2-9]{5}/.test(t)).length === 2,
      'la lista no muestra las 2 claves');

    // Todo el aula, sin señal: lo que ya está en el aparato.
    await ctx.setOffline(true);
    await p.click(m('tiras-claves'));
    let h = (await impresos()).pop();
    afirma(h, 'sin señal no se imprimieron las tiras');
    afirma((h.match(/class="tira"/g) || []).length === 2, 'no salen 2 tiras');
    for (const n of [1, 2]) {
      afirma(h.includes('<div class="cod">' + bonita(clave[n]) + '</div>'), `la tira de #${n} no trae ${bonita(clave[n])}`);
    }
    afirma(!h.includes(nom('Carla')), 'Carla, sin ficha, salió en las tiras');
    afirma(h.includes('img/qr-padres.png') && h.includes('padres.html') && h.includes(nom('Ana')), 'la tira no trae QR, portal o nombre');
    // La de un alumno, desde su ficha.
    await p.locator(`${m('alumno')} .ma-al-btn`).nth(1).click();
    await p.click(m('tira-alumno'));
    h = (await impresos()).pop();
    afirma(h && (h.match(/class="tira"/g) || []).length === 1 && h.includes('<div class="cod">' + bonita(clave[2]) + '</div>')
      && h.includes('<strong>#2</strong>'), 'la tira de Beto no trae su clave');
    await botonesDe44(p, 'tiras');
    await sinScrollLateral(p, 'tiras');
    // Carla, sin ficha: «Su tira» no imprime y dice qué hacer.
    const antes = (await impresos()).length;
    await p.locator(`${m('alumno')} .ma-al-btn`).nth(2).click();
    await p.click(m('tira-alumno'));
    afirma((await impresos()).length === antes, 'sin ficha se imprimió una tira');
    await ctx.setOffline(false);
    afirma(sql(`select count(*) from metas.familias where aula_id = '${aula}' and deleted_at is null`) === '2', 'imprimir tocó las fichas');

    // Con claves viejas, la tira de hoy (por Mi aula, con claveFamilia, y por
    // la herramienta de antes, sin ella) es letra por letra la de main.
    const iguales = await p.evaluate((fuente) => {
      const g = { id: 'grupo-ficticio', grado: '6', seccion: '1', escuela: 'Escuela Ficticia Las Flores',
        lista: [{ num: 3, nombre: 'Alumno Ficticio Tres' }, { num: 15, nombre: 'Alumna Ficticia Quince' }] };
      const viejas = { 3: '3TRES', 15: '15K7QM' };
      const conClave = Object.assign({}, g, { lista: g.lista.map((a) => Object.assign({ claveFamilia: viejas[a.num] }, a)) });
      const deMapa = (id, num) => viejas[num] || '';
      const cap = [];
      const main = new Function('adPrintAbrir', 'adClaveFamilia', fuente + '\nreturn { adTirasTodas, adTiraUno, adClaveBonita };')(
        (x) => cap.push(x), deMapa);
      const hoy = [];
      window.adPrintAbrir = (x) => { hoy.push(x); return null; };
      const antes = window.adClaveFamilia;
      window.adClaveFamilia = deMapa;
      try {
        main.adTirasTodas(g); main.adTiraUno(g, 15);
        window.adTirasTodas(conClave); window.adTiraUno(conClave, 15);     // por Mi aula
        window.adTirasTodas(g); window.adTiraUno(g, 15);                   // por la herramienta de antes
      } finally {
        window.adClaveFamilia = antes;
      }
      return {
        todas: hoy[0] === cap[0] && hoy[2] === cap[0], una: hoy[1] === cap[1] && hoy[3] === cap[1],
        trae: cap[0].includes('15-K7QM') && cap[0].includes('3-TRES') && cap[1].includes('15-K7QM'),
        bonita: ['15K7QM', '3TRES', '5ABCD', '12ABCDEF'].every((c) => main.adClaveBonita(c, c.match(/^\d+/)[0]) === window.adClaveBonita(c, c.match(/^\d+/)[0])),
        nueva: window.adClaveBonita('5KQMX4PA2B', 5) === '5KQMX-4PA2B' && window.adClaveBonita('ACYFS4RGM2', 7) === 'ACYFS-4RGM2',
      };
    }, fuenteMain);
    afirma(iguales.trae, 'la tira de main no trae las claves viejas');
    afirma(iguales.todas && iguales.una, 'con una clave vieja la tira ya no es la de main: ' + JSON.stringify(iguales));
    afirma(iguales.bonita, 'una clave vieja ya no se escribe como en main');
    afirma(iguales.nueva, 'la clave nueva no sale partida al medio');
  } finally {
    await ctx.close();
  }
});

await navegador.close();
console.log(fallas ? `\n✘ ${fallas} de ${total} pruebas de la capa C FALLARON` : `\n✅ Las ${total} pruebas de la capa C en verde`);
process.exit(fallas ? 1 : 0);
