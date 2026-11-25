/* =====================================================================
   M.E.T.A.S · Ningún examen impreso pasa de dos páginas
   ---------------------------------------------------------------------
   Una hoja de examen son dos páginas: el examen y la pauta del docente.
   La tercera es papel que el maestro paga, y casi siempre sale en blanco
   o con el final de la pauta. El 21 de noviembre de 2026 había 27 hojas
   en tres páginas medidas al ancho de la carta, y 56 impresas desde una
   computadora (35 de ellas en cuatro): el ajuste de tamaño medía con la
   ventana y contra un alto que no era el de su carta. Lo arregla el
   motor (js/motor-misiones.js, `_aLaCarta`); lo de sin navegador lo
   comprueba _dev/verifica-examen-hoja-carta.js.

   Aquí se imprimen TODAS las hojas de examen de las misiones
   (conceptual, operativa y pensamiento crítico) como las imprime el
   docente, con el encabezado que más ocupa: sesión, un centro de nombre
   largo con logo a color, la dirección completa (colonia, aldea,
   municipio y departamento), docente, grado, parcial y la fecha más
   larga del año; y en el pie, la firma del padre. Cada hoja se pasa a
   PDF en carta con sus propios márgenes y se cuentan las páginas:

   · abierta en la ventana de un teléfono (360 px) y en la de una
     computadora (1366 px): en las dos, dos páginas como mucho;
   · en las dos ventanas el ajuste deja el mismo tamaño: la hoja ya no
     depende de dónde se abre;
   · sin sesión (la hoja de siempre, con la raya en blanco), lo mismo;
   · al final dice cuál es la hoja más llena, en % del alto útil de su
     página (100 % es el borde: por encima se pasa).

   Se mide la primera forma de cada examen. Con METAS_FORMAS=5 se miden
   las cinco primeras (tarda cinco veces más); las formas no miden igual,
   sobre todo las operativas.

   Uso: node _dev/servidor-estatico.js   (en otra terminal)
        node _dev/verifica-examen-dos-paginas.js
        METAS_SOLO=robot node _dev/verifica-examen-dos-paginas.js
        METAS_FORMAS=5 METAS_JSON=salida.json node _dev/verifica-examen-dos-paginas.js
        METAS_CARTA=1 node _dev/verifica-examen-dos-paginas.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const SOLO = process.env.METAS_SOLO || '';
const FORMAS = Math.max(1, parseInt(process.env.METAS_FORMAS, 10) || 1);
const HILOS = Math.max(1, parseInt(process.env.METAS_HILOS, 10) || 4);
const JSON_SALIDA = process.env.METAS_JSON || '';
/* Las dos ventanas: la de un teléfono y la de una computadora. Con
   METAS_CARTA=1 se mide además en una ventana del ancho útil de la carta
   de cada hoja (ancho 0): sirve para comparar con una medida de antes
   del arreglo, cuando ese ancho era el único que acertaba. */
const VENTANAS = [['teléfono', 360, 740], ['computadora', 1366, 768]].concat(process.env.METAS_CARTA ? [['carta', 0, 900]] : []);
const TOPE_PAGINAS = 2;

let fallos = 0;
const ok = (c, t, extra) => { console.log((c ? '✓ ' : '✘ ') + t + (c || extra === undefined ? '' : '  → ' + extra)); if (!c) fallos++; };

const logo = 'data:image/svg+xml;base64,' + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="56" fill="#c0392b"/>'
  + '<circle cx="60" cy="60" r="40" fill="#ffd400"/><text x="60" y="76" font-size="44" font-family="Arial" font-weight="700" '
  + 'text-anchor="middle" fill="#0b3d91">JC</text></svg>').toString('base64');
/* Un centro ficticio con todo lo que puede llevar el encabezado. */
const CENTRO = {
  id: 'c-medida', nombre: 'Centro de Educación Básica José Cecilio del Valle', logo,
  direccion: 'Barrio El Centro, frente al parque central', aldea: 'Aldea San José de las Colinas',
  municipio: 'Santa Rosa de Copán', departamento: 'Copán', docente: 'María Fernanda López Hernández',
};
const SESION = { codigo: 'DOC-MEDIDA', nombre: 'Docente De La Cuenta' };
const PARES = [['genEval', 'printEval', '_evalPrintData', 'conceptual'],
  ['genEvalOp', 'printEvalOp', '_evalOpData', 'operativa'],
  ['genEvalCrit', 'printEvalCrit', '_evalCritData', 'crítica']];
const px = mm => mm * 96 / 25.4;

/* La página de cada misión que carga el motor. */
function misiones() {
  const out = [];
  for (const d of fs.readdirSync(path.join(RAIZ, 'misiones')).sort()) {
    if (SOLO && !d.includes(SOLO)) continue;
    const dir = path.join(RAIZ, 'misiones', d);
    if (!fs.statSync(dir).isDirectory()) continue;
    const html = fs.readdirSync(dir).filter(f => f.endsWith('.html'))
      .find(f => fs.readFileSync(path.join(dir, f), 'utf8').includes('motor-misiones.js'));
    if (html) out.push({ carpeta: d, url: '/misiones/' + d + '/' + html });
  }
  return out;
}

async function prepararSesion(pg, conSesion) {
  await pg.evaluate(({ c, s, con }) => {
    localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
    localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({
      actual: 'aula-1', porAula: { 'aula-1': Object.assign({ grado: '6', seccion: '1', gradoSeccion: '6º-1' }, c) }, centros: [c],
    }));
    if (con) localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify(s));
    else localStorage.removeItem('METAS_DOCENTE_V1');
  }, { c: CENTRO, s: SESION, con: conSesion });
}

/* El texto que la misión escribe en la ventana nueva, ya pasado por el
   motor (la ventana es de mentira: solo guarda lo que se escribe). */
async function capturar(pg, fn) {
  return pg.evaluate(f => {
    let html = '';
    const real = window.open;
    MotorMisiones.centro.preguntar(listo => listo({ parcial: 'III', fecha: '30 de septiembre de 2026' }));
    window.open = () => ({ document: { write: h => { html += h; }, close() {} }, print() {}, focus() {}, close() {} });
    try { window[f](); } finally { window.open = real; }
    return html;
  }, fn);
}

/* Márgenes del @page de la hoja, en mm: [arriba, derecha, abajo, izquierda]. */
function margenes(html) {
  const m = (html.match(/@page\s*\{[^}]*margin:\s*([^;}]+)/) || [])[1];
  const v = m ? m.trim().split(/\s+/).map(x => parseFloat(x) * (/in$/.test(x) ? 25.4 : /cm$/.test(x) ? 10 : 1)) : [0];
  const [a, d = a, b = a, i = d] = v;
  return [a, d, b, i];
}

/* Abre la hoja en una ventana de ese tamaño, deja que se ajuste, la pasa
   a PDF y cuenta las páginas. Después, con la hoja dispuesta como en el
   papel, mide cuánto llena cada página: lo que va de un salto de página
   al siguiente (y al final del cuerpo, con lo que guarda para el pie),
   contra el alto útil de la carta. Una hoja más ancha que el papel la
   reduce el navegador al imprimir, y con eso le cabe más: se cuenta. */
async function medir(ctx, html, ancho, alto) {
  const [arr, der, aba, izq] = margenes(html);
  const util = Math.round(px(215.9 - der - izq));
  const pg = await ctx.newPage();
  try {
    await pg.setViewportSize({ width: ancho || util, height: alto });
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.waitForTimeout(80);
    const zoom = await pg.evaluate(() => [...document.querySelectorAll('body > *')].filter(e => e.style.zoom).map(e => +e.style.zoom));
    const pdf = await pg.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true });
    const paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    await pg.emulateMedia({ media: 'print' });
    await pg.setViewportSize({ width: util, height: alto });
    const lleno = await pg.evaluate(({ altoPagina, util }) => {
      const reduccion = Math.max(1, document.documentElement.scrollWidth / util);
      const cortes = [0];
      document.querySelectorAll('body *').forEach(e => {
        if (getComputedStyle(e).breakBefore === 'page') cortes.push(e.getBoundingClientRect().top + scrollY);
      });
      cortes.push(document.body.getBoundingClientRect().bottom + scrollY);
      const out = [];
      for (let i = 0; i + 1 < cortes.length; i++) out.push((cortes[i + 1] - cortes[i]) / (altoPagina * reduccion) * 100);
      return out;
    }, { altoPagina: px(279.4 - arr - aba), util });
    return { paginas, zoom, lleno };
  } finally { await pg.close(); }
}

(async () => {
  const nav = await abrir();
  const lista = misiones();
  const hojas = [];
  const errores = [];
  let turno = 0;

  async function hilo() {
    while (turno < lista.length) {
      const m = lista[turno++];
      const ctx = await nav.newContext(Object.assign({}, SIN_SW, { viewport: { width: 1000, height: 900 } }));
      await ctx.addInitScript(() => { window.print = function () {}; window.alert = function () {}; });
      const pg = await ctx.newPage();
      try {
        await pg.goto(BASE + m.url, { waitUntil: 'load', timeout: 30000 });
        await pg.waitForTimeout(150);
        for (const [gen, imp, dato, tipo] of PARES) {
          /* En la plantilla del motor genEvalCrit existe siempre; si la misión
             no trae banco crítico (_hayCritica), no tiene esa prueba. */
          const hay = await pg.evaluate(([g, p]) => typeof window[g] === 'function' && typeof window[p] === 'function' && !(g === 'genEvalCrit' && typeof window._hayCritica === 'function' && !window._hayCritica()), [gen, imp]);
          if (!hay) continue;
          const vistas = new Set();
          for (let n = 0; n < FORMAS; n++) {
            /* Cada llamada trae la forma siguiente, como el botón «Nueva». */
            const listo = await pg.evaluate(([g, d]) => { try { window[g](); } catch (e) { return 'error: ' + e.message; } return window[d] ? 'ok' : 'sin dato'; }, [gen, dato]);
            if (listo !== 'ok') { errores.push(m.carpeta + ' · ' + tipo + ': ' + listo); break; }
            await prepararSesion(pg, true);
            const conCentro = await capturar(pg, imp);
            const forma = (conCentro.match(/class="forma-tag">\s*Forma\s+([^<\s]+)/) || conCentro.match(/Forma\s+([A-Z]?-?\d+)/) || [, String(n + 1)])[1];
            if (vistas.has(forma)) break;
            vistas.add(forma);
            await prepararSesion(pg, false);
            const sinCentro = await capturar(pg, imp);
            const h = { carpeta: m.carpeta, tipo, forma, marca: /data-metas-encabezado="centro"/.test(conCentro), carta: /<style data-metas-carta=/.test(conCentro) && /<style data-metas-carta=/.test(sinCentro), ventanas: {} };
            for (const [nombre, ancho, alto] of VENTANAS) h.ventanas[nombre] = await medir(ctx, conCentro, ancho, alto);
            h.sin = await medir(ctx, sinCentro, VENTANAS[1][1], VENTANAS[1][2]);
            hojas.push(h);
          }
        }
      } catch (e) {
        errores.push(m.carpeta + ': ' + String(e.message || e).split('\n')[0]);
      }
      await ctx.close();
      process.stdout.write('.');
    }
  }
  await Promise.all(Array.from({ length: Math.min(HILOS, lista.length) }, hilo));
  await nav.close();
  console.log('\n');
  hojas.sort((a, b) => (a.carpeta + a.tipo + a.forma.padStart(4, '0')).localeCompare(b.carpeta + b.tipo + b.forma.padStart(4, '0')));

  const nombre = h => h.carpeta + ' · ' + h.tipo + (FORMAS > 1 ? ' · Forma ' + h.forma : '');
  const tel = h => h.ventanas[VENTANAS[0][0]], pc = h => h.ventanas[VENTANAS[1][0]];
  const lista5 = a => a.slice(0, 5).join(' | ') + (a.length > 5 ? ' … y ' + (a.length - 5) + ' más' : '');

  ok(!errores.length, 'todas las misiones abren y generan sus exámenes', lista5(errores));
  ok(SOLO ? hojas.length > 0 : hojas.length >= 160 * Math.min(FORMAS, 1), 'se midieron las hojas de examen de las misiones (' + hojas.length + ')');
  const sinCentro = hojas.filter(h => !h.marca);
  ok(!sinCentro.length, 'todas salen con el encabezado del centro: logo, dirección completa y docente', lista5(sinCentro.map(nombre)));
  const sinCarta = hojas.filter(h => !h.carta);
  ok(!sinCarta.length, 'todas se miden con su carta, no con la ventana', lista5(sinCarta.map(nombre)));

  for (const [v] of VENTANAS) {
    const pasadas = hojas.filter(h => h.ventanas[v].paginas > TOPE_PAGINAS);
    ok(!pasadas.length, 'abiertas en ' + (v === 'teléfono' ? 'la ventana de un teléfono' : v === 'carta' ? 'una ventana del ancho de la carta' : 'la ventana de una computadora') + ', ninguna pasa de ' + TOPE_PAGINAS + ' páginas',
      pasadas.length + ': ' + lista5(pasadas.map(h => nombre(h) + ' (' + h.ventanas[v].paginas + ')')));
  }
  const pasadasSin = hojas.filter(h => h.sin.paginas > TOPE_PAGINAS);
  ok(!pasadasSin.length, 'sin sesión (la hoja con la raya en blanco), ninguna pasa de ' + TOPE_PAGINAS + ' páginas',
    pasadasSin.length + ': ' + lista5(pasadasSin.map(h => nombre(h) + ' (' + h.sin.paginas + ')')));

  /* El mismo tamaño en las dos ventanas: una diferencia es que la hoja
     volvió a medirse con la ventana. */
  const distintas = hojas.filter(h => tel(h).zoom.length !== pc(h).zoom.length
    || tel(h).zoom.some((z, i) => Math.abs(z - pc(h).zoom[i]) > 0.001 * z));
  ok(!distintas.length, 'el ajuste deja el mismo tamaño en el teléfono y en la computadora',
    distintas.length + ': ' + lista5(distintas.map(h => nombre(h) + ' (' + tel(h).zoom.map(z => z.toFixed(3)).join('/') + ' y ' + pc(h).zoom.map(z => z.toFixed(3)).join('/') + ')')));

  /* Cuán llena queda la más llena. */
  const maximo = h => Math.max(...pc(h).lleno);
  const porLlenas = hojas.slice().sort((a, b) => maximo(b) - maximo(a));
  if (porLlenas.length) {
    const p = porLlenas[0];
    ok(maximo(p) <= 100, 'la hoja más llena cabe en su página: ' + nombre(p) + ', al ' + maximo(p).toFixed(1) + ' %');
    console.log('   las cinco más llenas: ' + porLlenas.slice(0, 5).map(h => nombre(h) + ' ' + maximo(h).toFixed(1) + ' %').join(' · '));
  }

  if (JSON_SALIDA) fs.writeFileSync(JSON_SALIDA, JSON.stringify(hojas, null, 1));
  console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ Todo en orden');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
