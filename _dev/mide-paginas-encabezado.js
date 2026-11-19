/* =====================================================================
   M.E.T.A.S · ¿Cuánto puede medir el logo del centro sin que una hoja
   del examen pase a otra página?
   ---------------------------------------------------------------------
   Imprime TODAS las hojas de examen de las misiones (conceptual,
   operativa y pensamiento crítico) como las imprime el docente: con
   sesión, con un centro de nombre largo, logo, lugar y docente (las dos
   líneas de texto: el bloque más alto que puede salir). Cada hoja se pasa
   a PDF en carta con sus propios márgenes de impresión (@page) y se
   cuentan las páginas. Se compara con la hoja de siempre (sin sesión),
   del MISMO examen generado.

   ⚠️ El ancho de la ventana importa. El ajuste de la hoja (fit) mide al
   abrirse, con el ancho de la pantalla, y el papel vuelve a partir los
   renglones al ancho de la carta: medida en una ventana ancha, la hoja
   crece al imprimir y parece que se pasa; en una angosta, que sobra
   lugar. Por eso cada hoja se abre en una ventana del ancho útil de la
   carta según SU @page (215,9 mm menos los márgenes): ahí el ajuste ve
   los mismos renglones que salen en el papel.

   Por cada tamaño de logo (METAS_LADOS, en px; por defecto 34 y 44):
   · páginas del PDF con el centro y sin él (tienen que ser las mismas);
   · el zoom con que queda la hoja: el que le pone su propio ajuste
     (fit, las 160 hojas) o el que le pone el motor (las 8 de Fin de
     grado, que no traen ajuste). Un zoom menor es letra más chica: así
     se ve cuánto cuesta cada milímetro de logo.

   No es una sonda: mide, tarda unos minutos y siempre sale en cero si
   pudo medir. La sonda que se pone roja con el tamaño elegido es
   verifica-encabezado-centro(-navegador).

   Uso: node _dev/servidor-estatico.js   (en otra terminal)
        node _dev/mide-paginas-encabezado.js
        METAS_LADOS=34,38,40,42,44 node _dev/mide-paginas-encabezado.js
        METAS_SOLO=fin-de-grado node _dev/mide-paginas-encabezado.js
        METAS_JSON=salida.json node _dev/mide-paginas-encabezado.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const LADOS = (process.env.METAS_LADOS || '34,44').split(',').map(Number).filter(Boolean);
const SOLO = process.env.METAS_SOLO || '';
const JSON_SALIDA = process.env.METAS_JSON || '';

const logo = 'data:image/svg+xml;base64,' + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="56" fill="#c0392b"/>'
  + '<circle cx="60" cy="60" r="40" fill="#ffd400"/><text x="60" y="76" font-size="44" font-family="Arial" font-weight="700" '
  + 'text-anchor="middle" fill="#0b3d91">JC</text></svg>').toString('base64');
const CENTRO = {
  id: 'c-medida', nombre: 'Centro de Educación Básica José Cecilio del Valle', logo,
  direccion: 'Barrio El Centro, frente al parque', municipio: 'Santa Rosa de Copán', departamento: 'Copán',
  docente: 'María Fernanda López Hernández',
};
const SESION = { codigo: 'DOC-MEDIDA', nombre: 'Docente De La Cuenta' };
const PARES = [['genEval', 'printEval', '_evalPrintData', 'conceptual'],
  ['genEvalOp', 'printEvalOp', '_evalOpData', 'operativa'],
  ['genEvalCrit', 'printEvalCrit', '_evalCritData', 'crítica']];

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

/* El texto que la misión escribe en la ventana nueva, ya pasado por el
   motor (la ventana es de mentira: solo guarda lo que se escribe). */
async function capturar(pg, fn) {
  return pg.evaluate(f => {
    let html = '';
    const real = window.open;
    /* El cuadrito de parcial y fecha lo contesta la herramienta, con la
       fecha más larga del año: «30 de septiembre de 2026». */
    if (window.MotorMisiones) MotorMisiones.centro.preguntar(listo => listo({ parcial: 'III', fecha: '30 de septiembre de 2026' }));
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

async function medir(nav, html) {
  const [, der, , izq] = margenes(html);
  const ancho = Math.round((215.9 - der - izq) * 96 / 25.4);
  const pg = await nav.newPage({ viewport: { width: ancho, height: 1000 } });
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.waitForTimeout(250);
  const datos = await pg.evaluate(() => {
    const ph = document.querySelector('.ph');
    const pag = ph && ph.parentElement;
    const zoom = pag ? parseFloat(pag.style.zoom || '1') || 1 : 1;
    return { marca: ph && ph.getAttribute('data-metas-encabezado'), zoom };
  });
  const pdf = await pg.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true });
  await pg.close();
  datos.paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  return datos;
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

(async () => {
  const nav = await abrir();
  const filas = [];
  const lista = misiones();
  for (const m of lista) {
    for (const [i, lado] of LADOS.entries()) {
      const ctx = await nav.newContext(Object.assign({}, SIN_SW, { viewport: { width: 1000, height: 900 } }));
      await ctx.addInitScript(() => { window.print = function () {}; window.alert = function () {}; });
      await ctx.route(/\/js\/motor-misiones\.js/, async r => {
        const res = await r.fetch();
        const cuerpo = (await res.text()).replace(/var LADO_LOGO = \d+;/, 'var LADO_LOGO = ' + lado + ';');
        await r.fulfill({ response: res, body: cuerpo });
      });
      const pg = await ctx.newPage();
      try {
        await pg.goto(BASE + m.url, { waitUntil: 'load', timeout: 20000 });
        await pg.waitForTimeout(150);
        for (const [gen, imp, dato, forma] of PARES) {
          const hay = await pg.evaluate(([g, p]) => typeof window[g] === 'function' && typeof window[p] === 'function', [gen, imp]);
          if (!hay) continue;
          const listo = await pg.evaluate(([g, d]) => { try { window[g](); } catch (e) { return 'error: ' + e.message; } return window[d] ? 'ok' : 'sin dato'; }, [gen, dato]);
          if (listo !== 'ok') { filas.push({ carpeta: m.carpeta, forma, lado, error: listo }); continue; }
          let fila = filas.find(f => f.carpeta === m.carpeta && f.forma === forma && !f.error);
          if (!fila) { fila = { carpeta: m.carpeta, forma, porLado: {} }; filas.push(fila); }
          /* La hoja de siempre y la del centro salen del mismo examen: cada
             carga de la página genera uno nuevo, y las formas no miden igual. */
          await prepararSesion(pg, false);
          const hoy = await medir(nav, await capturar(pg, imp));
          await prepararSesion(pg, true);
          const con = await medir(nav, await capturar(pg, imp));
          fila.porLado[lado] = { paginas: con.paginas, zoom: con.zoom, marca: con.marca, paginasHoy: hoy.paginas, zoomHoy: hoy.zoom };
          if (i === 0) { fila.paginasHoy = hoy.paginas; fila.zoomHoy = hoy.zoom; }
        }
      } catch (e) {
        filas.push({ carpeta: m.carpeta, lado, error: String(e.message || e).split('\n')[0] });
      }
      await ctx.close();
    }
    process.stdout.write('.');
  }
  await nav.close();
  console.log('\n');

  const hojas = filas.filter(f => !f.error);
  const errores = filas.filter(f => f.error);
  const fin = h => h.carpeta.startsWith('fin-de-grado');
  for (const lado of LADOS) {
    const pasadas = hojas.filter(h => !h.porLado[lado] || h.porLado[lado].paginas > h.porLado[lado].paginasHoy || h.porLado[lado].marca !== 'centro');
    const hoyDeMas = hojas.filter(h => h.porLado[lado] && h.porLado[lado].paginasHoy > 2);
    const zooms = grupo => grupo.map(h => h.porLado[lado] && h.porLado[lado].zoom).filter(Boolean);
    const min = a => a.length ? Math.min(...a).toFixed(3) : '-';
    console.log('logo ' + lado + ' px: ' + (hojas.length - pasadas.length) + ' de ' + hojas.length
      + ' hojas en las mismas páginas que hoy · zoom más chico: Fin de grado ' + min(zooms(hojas.filter(fin)))
      + ', con ajuste ' + min(zooms(hojas.filter(h => !fin(h)))));
    pasadas.forEach(h => console.log('   ✘ ' + h.carpeta + ' · ' + h.forma + ' · hoy ' + (h.porLado[lado] || {}).paginasHoy + ' pág., con centro '
      + (h.porLado[lado] ? h.porLado[lado].paginas + ' (' + h.porLado[lado].marca + ', zoom ' + h.porLado[lado].zoom.toFixed(3) + ')' : '?')));
    if (hoyDeMas.length) console.log('   (sin centro, ya hoy salen en más de 2 páginas: ' + hoyDeMas.map(h => h.carpeta + ' · ' + h.forma).join(', ') + ')');
  }
  console.log('\nFin de grado, hoja por hoja (páginas hoy → con centro · zoom):');
  hojas.filter(fin).forEach(h => console.log('   ' + h.carpeta + ' · ' + h.forma + ': ' + h.paginasHoy + ' → '
    + LADOS.map(l => l + ' px ' + (h.porLado[l] ? h.porLado[l].paginas + ' · ' + h.porLado[l].zoom.toFixed(3) : '?')).join(' | ')));
  if (errores.length) {
    console.log('\nNo se pudieron medir:');
    errores.forEach(e => console.log('   ' + e.carpeta + (e.forma ? ' · ' + e.forma : '') + ' (' + e.lado + ' px): ' + e.error));
  }
  if (JSON_SALIDA) fs.writeFileSync(JSON_SALIDA, JSON.stringify(filas, null, 1));
  process.exit(0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
