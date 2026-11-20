/* =====================================================================
   M.E.T.A.S · El examen impreso con el encabezado limpio, en el papel
   ---------------------------------------------------------------------
   Abre las hojas de examen de TODAS las misiones (conceptual, operativa
   y pensamiento crítico: 168), y las de las misiones bilingües también
   en inglés (16), como las imprime el docente con su sesión y su centro,
   con una dirección larga (dirección, aldea, municipio y departamento).
   Cada una se compara con la MISMA hoja impresa sin sesión, que es la de
   siempre (no pasa por el motor). Comprueba:
     · que ninguna hoja gana páginas (PDF carta con su propio @page);
     · que el borde de arriba del pie no sube: la cajita de la firma es
       más alta que los rótulos de antes y tiene que ganar su alto bajando
       hacia el margen, porque en muchas hojas el examen llega casi hasta
       el pie;
     · que el título visible es «Evaluación · Tema · Materia» («Test · … »
       en inglés) y el pie lleva la firma y la misma «Forma NN», con la
       letra del tipo de hoja en la misma cajita («Forma 7 · C»);
     · que la dirección sale completa y en un solo renglón.
   Las misiones donde dos hojas quedan con el mismo título (casi todas)
   se distinguen por esa letra: la sonda exige que, con el mismo número de
   forma, ninguna pareja de hojas de una misión diga lo mismo por fuera.

   Uso: node _dev/servidor-estatico.js   (en otra terminal)
        node _dev/verifica-examen-encabezado-limpio-navegador.js
        METAS_SOLO=areas node _dev/verifica-examen-encabezado-limpio-navegador.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const SOLO = process.env.METAS_SOLO || '';

const logo = 'data:image/svg+xml;base64,' + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="56" fill="#c0392b"/></svg>').toString('base64');
const CENTRO = {
  id: 'c-medida', nombre: 'Centro de Educación Básica José Cecilio del Valle', logo,
  direccion: 'Barrio El Centro, frente al parque central, calle principal hacia la iglesia', aldea: 'Aldea Ficticia de San Juan de Arriba',
  municipio: 'Santa Rosa de Copán', departamento: 'Copán', docente: 'María Fernanda López Hernández',
};
const LUGAR = 'Barrio El Centro, frente al parque central, calle principal hacia la iglesia, Aldea Ficticia de San Juan de Arriba, Santa Rosa de Copán, Copán';
const SESION = { codigo: 'DOC-MEDIDA', nombre: 'Docente De La Cuenta' };
const PARES = [['genEval', 'printEval', '_evalPrintData', 'conceptual'],
  ['genEvalOp', 'printEvalOp', '_evalOpData', 'operativa'],
  ['genEvalCrit', 'printEvalCrit', '_evalCritData', 'crítica']];
const LETRA = { conceptual: 'C', operativa: 'O', 'crítica': 'P' };

let fallos = 0;
function ok(c, msg, extra) {
  if (c) console.log('✓ ' + msg);
  else { fallos++; console.log('✘ ' + msg + (extra !== undefined ? '\n    → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); }
}

function misiones() {
  const out = [];
  for (const d of fs.readdirSync(path.join(RAIZ, 'misiones')).sort()) {
    if (SOLO && !d.includes(SOLO)) continue;
    const dir = path.join(RAIZ, 'misiones', d);
    if (!fs.statSync(dir).isDirectory()) continue;
    const html = fs.readdirSync(dir).filter(f => f.endsWith('.html'))
      .find(f => fs.readFileSync(path.join(dir, f), 'utf8').includes('motor-misiones.js'));
    const bilingue = fs.readdirSync(path.join(dir, 'js')).some(f => f.endsWith('-en.js'));
    if (html) out.push({ carpeta: d, url: '/misiones/' + d + '/' + html, bilingue });
  }
  return out;
}

/* Lo que la misión escribe en la ventana nueva (la ventana es de mentira). */
async function capturar(pg, fn) {
  return pg.evaluate(f => {
    let html = '';
    const real = window.open;
    if (window.MotorMisiones) MotorMisiones.centro.preguntar(listo => listo({ parcial: 'III', fecha: '30 de septiembre de 2026' }));
    window.open = () => ({ document: { write: h => { html += h; }, close() {} }, print() {}, focus() {}, close() {} });
    try { window[f](); } finally { window.open = real; }
    return html;
  }, fn);
}

function margenes(html) {
  const m = (html.match(/@page\s*\{[^}]*margin:\s*([^;}]+)/) || [])[1];
  const v = m ? m.trim().split(/\s+/).map(x => parseFloat(x) * (/in$/.test(x) ? 25.4 : /cm$/.test(x) ? 10 : 1)) : [0];
  const [a, d = a, b = a, i = d] = v;
  return [a, d, b, i];
}

/* Abre la hoja al ancho útil de la carta (el de su @page, como la ve el
   ajuste al imprimir), mide y la pasa a PDF. */
async function medir(nav, html) {
  const [, der, , izq] = margenes(html);
  const ancho = Math.round((215.9 - der - izq) * 96 / 25.4);
  const pg = await nav.newPage({ viewport: { width: ancho, height: 1000 } });
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.waitForTimeout(200);
  await pg.emulateMedia({ media: 'print' });
  const d = await pg.evaluate(() => {
    const pie = document.querySelector('.print-foot');
    const r = pie ? pie.getBoundingClientRect() : null;
    const h2 = Array.from(document.querySelectorAll('.ph h2')).filter(h => !h.closest('[data-metas-antes]')).map(h => h.textContent.trim());
    const forma = document.querySelector('.print-foot .forma-tag');
    const letra = document.querySelector('.print-foot .forma-tag [data-metas-letra]');
    const lugar = document.querySelector('[data-metas-lugar]');
    return {
      pieArriba: r ? window.innerHeight - r.top : null,
      titulos: h2, forma: forma ? forma.textContent.trim() : '',
      letra: letra ? { texto: letra.textContent, letra: parseFloat(getComputedStyle(letra).fontSize), forma: parseFloat(getComputedStyle(forma).fontSize),
        color: getComputedStyle(letra).color, alto: forma.getBoundingClientRect().height } : null,
      altoFormaHoy: forma ? forma.getBoundingClientRect().height : 0,
      firma: !!document.querySelector('[data-metas-firma]'), rotulos: document.querySelectorAll('.print-foot .pf-item').length,
      lugar: lugar ? { texto: lugar.textContent, alto: lugar.getBoundingClientRect().height, linea: parseFloat(getComputedStyle(lugar).lineHeight) } : null,
      marca: (document.querySelector('.ph') || { getAttribute() { return ''; } }).getAttribute('data-metas-encabezado'),
    };
  });
  const pdf = await pg.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true });
  await pg.close();
  d.paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  return d;
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
  const hojas = [];
  const errores = [];
  for (const m of misiones()) {
    for (const idioma of m.bilingue ? ['es', 'en'] : ['es']) {
      const ctx = await nav.newContext(Object.assign({}, SIN_SW, { viewport: { width: 1000, height: 900 } }));
      await ctx.addInitScript(en => {
        window.print = function () {}; window.alert = function () {};
        try { localStorage.setItem('metas-idioma', en ? 'en' : 'es'); } catch (e) { }
      }, idioma === 'en');
      const pg = await ctx.newPage();
      try {
        await pg.goto(BASE + m.url, { waitUntil: 'load', timeout: 20000 });
        await pg.waitForTimeout(150);
        for (const [gen, imp, dato, forma] of PARES) {
          const hay = await pg.evaluate(([g, p]) => typeof window[g] === 'function' && typeof window[p] === 'function', [gen, imp]);
          if (!hay) continue;
          const listo = await pg.evaluate(([g, d]) => { try { window[g](); } catch (e) { return 'error: ' + e.message; } return window[d] ? 'ok' : 'sin dato'; }, [gen, dato]);
          if (listo !== 'ok') { errores.push(m.carpeta + ' · ' + forma + ' · ' + idioma + ': ' + listo); continue; }
          await prepararSesion(pg, false);
          const hoy = await medir(nav, await capturar(pg, imp));
          await prepararSesion(pg, true);
          const con = await medir(nav, await capturar(pg, imp));
          hojas.push({ carpeta: m.carpeta, forma, idioma, hoy, con });
        }
      } catch (e) {
        errores.push(m.carpeta + ' · ' + idioma + ': ' + String(e.message || e).split('\n')[0]);
      }
      await ctx.close();
    }
    process.stdout.write('.');
  }
  await nav.close();
  console.log('\n');

  const es = hojas.filter(h => h.idioma === 'es'), en = hojas.filter(h => h.idioma === 'en');
  const nombre = h => h.carpeta + ' · ' + h.forma + (h.idioma === 'en' ? ' · inglés' : '');
  ok(!errores.length, 'todas las hojas se pudieron generar', errores.join(' | '));
  if (!SOLO) ok(es.length === 168 && en.length === 16, 'se midieron las 168 hojas y las 16 en inglés', { es: es.length, en: en.length });

  const masPaginas = hojas.filter(h => h.con.paginas > h.hoy.paginas);
  ok(!masPaginas.length, 'ninguna hoja gana páginas (' + hojas.length + ' hojas)',
    masPaginas.map(h => nombre(h) + ': ' + h.hoy.paginas + ' → ' + h.con.paginas).join(' | '));
  const pieSube = hojas.filter(h => h.con.pieArriba == null || h.hoy.pieArriba == null || h.con.pieArriba > h.hoy.pieArriba + 0.5);
  const subida = hojas.map(h => h.con.pieArriba - h.hoy.pieArriba);
  ok(!pieSube.length, 'el borde de arriba del pie no sube en ninguna (lo más: ' + Math.max(...subida).toFixed(2) + ' px; hoy ' +
    (hojas[0] ? hojas[0].hoy.pieArriba.toFixed(1) : '?') + ' px desde el fondo)',
    pieSube.map(h => nombre(h) + ': ' + h.hoy.pieArriba + ' → ' + h.con.pieArriba).join(' | '));

  const marcaMala = es.filter(h => h.con.marca !== 'centro');
  ok(!marcaMala.length, 'en español, todas salen con el encabezado del centro', marcaMala.map(nombre).join(', '));
  const tituloMalo = hojas.filter(h => {
    const cab = h.idioma === 'en' ? 'Test · ' : 'Evaluación · ';
    const no = h.idioma === 'en' ? /\b(Final|Basic Education|Cycle|Competency|Critical Thinking|Practical|Exam)\b/ : /\b(Final|Educación Básica|Ciclo|Competencial|Pensamiento Crítico|Operativa|Examen|Misión)\b/;
    return !h.con.titulos.length || h.con.titulos.some(t => !t.startsWith(cab) || no.test(t) || t.split(' · ').length < 3);
  });
  ok(!tituloMalo.length, 'el título visible es «Evaluación · Tema · Materia» («Test · Topic · Subject» en inglés)',
    tituloMalo.map(h => nombre(h) + ': ' + h.con.titulos.join(' / ')).join(' | '));
  const pieMalo = hojas.filter(h => !h.con.firma || h.con.rotulos !== 0 || !h.hoy.forma || h.con.forma !== h.hoy.forma + ' · ' + LETRA[h.forma]);
  ok(!pieMalo.length, 'el pie lleva la firma, ninguno de los tres rótulos y la misma «Forma NN» de siempre con su letra («Forma 7 · C»)',
    pieMalo.map(h => nombre(h) + ': ' + h.hoy.forma + ' → ' + h.con.forma).join(' | '));
  const sinLugar = es.filter(h => !h.con.lugar || h.con.lugar.texto !== LUGAR || h.con.lugar.alto > h.con.lugar.linea * 1.5);
  ok(!sinLugar.length, 'la dirección completa (dirección, aldea, municipio, departamento) sale en un solo renglón',
    sinLugar.map(h => nombre(h) + ': ' + JSON.stringify(h.con.lugar)).join(' | '));

  const letraMala = hojas.filter(h => !h.con.letra || h.con.letra.letra >= h.con.letra.forma || h.con.letra.color !== 'rgb(136, 136, 136)'
    || h.con.letra.alto > h.hoy.altoFormaHoy + 0.5);
  ok(!letraMala.length, 'la letra va más pequeña que «Forma», en gris, y la cajita no crece de alto',
    letraMala.map(h => nombre(h) + ': ' + JSON.stringify(h.con.letra) + ' / hoy ' + h.hoy.altoFormaHoy).join(' | '));

  /* Las misiones donde dos hojas quedan con el mismo título. */
  const porMision = {};
  hojas.forEach(h => {
    const k = h.carpeta + ' · ' + h.idioma;
    (porMision[k] = porMision[k] || {});
    const t = h.con.titulos[0] || '';
    (porMision[k][t] = porMision[k][t] || []).push(h.forma);
  });
  const iguales = [];
  Object.keys(porMision).forEach(k => Object.keys(porMision[k]).forEach(t => {
    if (porMision[k][t].length > 1) iguales.push(k + ': «' + t + '» (' + porMision[k][t].join(' y ') + ')');
  }));
  console.log('\nℹ️  Misiones con dos hojas del mismo título: ' + iguales.length + ' (las distingue la letra de la cajita)');
  if (process.env.METAS_DETALLE) iguales.forEach(x => console.log('   ' + x));
  /* Con el mismo número de forma, ninguna pareja de una misión dice lo
     mismo por fuera: el título y la cajita juntos. */
  const porFuera = {};
  const repetidas = [];
  hojas.forEach(h => {
    const k = h.carpeta + ' · ' + h.idioma + ' · ' + (h.con.titulos[0] || '') + ' · ' + h.con.forma;
    if (porFuera[k]) repetidas.push(nombre(h) + ' = ' + porFuera[k]); else porFuera[k] = nombre(h);
  });
  ok(!repetidas.length, 'ninguna hoja dice lo mismo por fuera que otra de su misión (título y «Forma NN · letra»)', repetidas.join(' | '));

  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ Las ' + hojas.length + ' hojas salen con el título y el pie limpios, sin ganar páginas ni subir el pie');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
