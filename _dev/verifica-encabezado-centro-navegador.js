/* =====================================================================
   M.E.T.A.S · El centro en el examen impreso, en el navegador
   ---------------------------------------------------------------------
   La otra mitad de _dev/verifica-encabezado-centro.js, con una misión
   de verdad (La Materia: «Instituto» en el conceptual, «Centro
   Educativo» en pensamiento crítico) y Fin de grado 6.º (la operativa):

   (a) sin sesión: la hoja sale con la raya en blanco, sin logo;
   (b) docente con un centro: imprime directo, con logo en gris y el
       nombre arriba, sin la raya del centro, y la hoja cabe en la carta;
   (c) docente con dos centros: antes de imprimir aparece el selector
       (un botón por centro y «Sin encabezado»), se imprime el elegido y
       la próxima vez ese queda marcado;
   (d) «Sin encabezado»: igual que (a);
   (e) el docente cerró sesión: igual que (a), sin selector.

   Con METAS_CAPTURAS=<carpeta> guarda las capturas del encabezado con
   perfil, sin perfil y del selector.

   Uso: node _dev/servidor-estatico.js   (en otra terminal)
        node _dev/verifica-encabezado-centro-navegador.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const CAPTURAS = process.env.METAS_CAPTURAS || '';
let fallos = 0;
const ok = (c, t, extra) => { console.log((c ? '✓ ' : '✘ ') + t + (c || extra === undefined ? '' : '  → ' + JSON.stringify(extra))); if (!c) fallos++; };

/* Dos logos a color, para ver en la hoja que salen en gris. */
const svg = (fondo, letra) => 'data:image/svg+xml;base64,' + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="56" fill="' + fondo
  + '"/><circle cx="60" cy="60" r="40" fill="#ffd400"/><text x="60" y="76" font-size="44" font-family="Arial" font-weight="700" text-anchor="middle" fill="#0b3d91">'
  + letra + '</text></svg>').toString('base64');
const CENTRO_A = { id: 'c-a', nombre: 'Centro de Educación Básica Las Flores', logo: svg('#c0392b', 'LF'), direccion: 'Colonia Ficticia', municipio: 'Villanueva', departamento: 'Cortés', docente: 'Docente Ficticia' };
const CENTRO_B = { id: 'c-b', nombre: 'Escuela Ficticia El Porvenir', logo: svg('#1e8449', 'EP'), direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', docente: '' };
const SESION = { codigo: 'DOC-FICTICIO', nombre: 'Docente De La Cuenta' };
const perfilDe = c => Object.assign({ logoSec: '', grado: '6', seccion: '1', gradoSeccion: '6º-1', anio: '2027' }, c);

async function preparar(pg, { centros, sesion }) {
  await pg.evaluate(({ centros, sesion, perfiles }) => {
    localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
    const porAula = {};
    perfiles.forEach((p, i) => { porAula['aula-' + (i + 1)] = p; });
    localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula, centros }));
    if (sesion) localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify(sesion));
    else localStorage.removeItem('METAS_DOCENTE_V1');
  }, { centros, sesion, perfiles: centros.map(perfilDe) });
}

/* Imprime y devuelve la ventana nueva ya escrita. */
async function hojaDe(pg, accion) {
  const [win] = await Promise.all([pg.waitForEvent('popup', { timeout: 8000 }), accion()]);
  await win.waitForLoadState('load');
  await win.waitForTimeout(150);
  return win;
}
async function leerHoja(win) {
  return win.evaluate(() => {
    const ph = document.querySelector('.ph');
    const img = ph.querySelector('img[data-metas-logo]');
    const pag = document.querySelector('#evalPage, #critEvalPage, #evalOpPage, [id$="EvalPage"]') || ph.parentElement;
    const mm = (() => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;height:100mm'; document.body.appendChild(d); const r = d.getBoundingClientRect().height / 100; d.remove(); return r; })();
    return {
      marca: ph.getAttribute('data-metas-encabezado'),
      texto: ph.innerText.replace(/\s+/g, ' ').trim(),
      html: ph.outerHTML,
      logo: !!img,
      filtro: img ? getComputedStyle(img).filter : '',
      logoIzq: img ? img.getBoundingClientRect().left < ph.getBoundingClientRect().left + 20 : false,
      altoMm: pag.getBoundingClientRect().height / mm,
    };
  });
}
async function captura(win, nombre) {
  if (!CAPTURAS) return;
  fs.mkdirSync(CAPTURAS, { recursive: true });
  await win.setViewportSize({ width: 816, height: 400 });
  await win.locator('.ph').first().screenshot({ path: path.join(CAPTURAS, nombre) });
}

(async () => {
  const nav = await abrir();
  const ctx = await nav.newContext(Object.assign({}, SIN_SW, { viewport: { width: 390, height: 844 }, deviceScaleFactor: CAPTURAS ? 2 : 1 }));
  // Que la ventana de impresión no se quede esperando al diálogo.
  await ctx.addInitScript(() => { window.print = function () {}; });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));

  await pg.goto(BASE + '/misiones/2y3ciclo-la-materia/la-materia.html', { waitUntil: 'load' });
  ok(await pg.evaluate(() => { const e = MotorMisiones.centro.envueltas(); return e.includes('printEval') && e.includes('printEvalCrit'); }),
    'la misión carga con printEval y printEvalCrit envueltas');
  await pg.evaluate(() => { genEval(); genEvalCrit(); });
  // El aviso de datos del alumno no es de esta prueba: se cierra para que la captura se vea limpia.
  const ahoraNo = pg.getByRole('button', { name: 'Ahora no' });
  if (await ahoraNo.count() && await ahoraNo.first().isVisible()) await ahoraNo.first().click();

  console.log('── (a) sin sesión ──');
  await preparar(pg, { centros: [CENTRO_A], sesion: null });
  let win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  const hoy = await leerHoja(win);
  ok(!hoy.marca && !hoy.logo && hoy.texto.includes('Instituto:') && !hoy.texto.includes('Las Flores'),
    '(a) la hoja sale como hoy: raya «Instituto» en blanco, sin logo', hoy.texto.slice(0, 160));
  await captura(win, 'sin-perfil.png');
  await win.close();

  console.log('\n── (b) docente con un centro ──');
  await preparar(pg, { centros: [CENTRO_A], sesion: SESION });
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  let h = await leerHoja(win);
  ok(h.marca === 'centro', '(b) imprime directo, sin preguntar');
  ok(h.logo && /grayscale\(1\)/.test(h.filtro) && h.logoIzq, '(b) el logo sale en gris, arriba a la izquierda', h.filtro);
  ok(h.texto.startsWith('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES Colonia Ficticia, Villanueva · Docente: Docente Ficticia'),
    '(b) el nombre en mayúsculas, y debajo el lugar y el docente', h.texto.slice(0, 120));
  ok(!/Instituto:|Centro Educativo:/.test(h.texto) && /Grado y Sección: N\.º de lista:/.test(h.texto),
    '(b) sin la raya del centro; quedan Grado y Sección y N.º de lista', h.texto);
  ok(h.texto.includes('Nombre: Parcial: Fecha:') && h.texto.includes('Evaluación Final · La Materia'), '(b) nombre, parcial, fecha y el título del examen siguen');
  ok(h.altoMm <= 252.5, '(b) la hoja sigue cabiendo en la carta', h.altoMm.toFixed(1));
  await captura(win, 'con-perfil.png');
  await win.close();

  win = await hojaDe(pg, () => pg.evaluate(() => printEvalCrit()));
  h = await leerHoja(win);
  ok(h.marca === 'centro' && !h.texto.includes('Centro Educativo:') && h.texto.includes('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES'),
    '(b) pensamiento crítico («Centro Educativo») también');
  await win.close();

  console.log('\n── (c) docente con dos centros ──');
  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION });
  let abiertas = 0;
  const contar = () => abiertas++;
  pg.on('popup', contar);
  await pg.evaluate(() => printEval());
  await pg.waitForSelector('.metas-centro-caja', { timeout: 3000 });
  const sel = await pg.evaluate(() => {
    const caja = document.querySelector('.metas-centro-caja');
    const bs = [...caja.querySelectorAll('button')];
    return {
      dialogo: caja.getAttribute('role') === 'dialog' && caja.getAttribute('aria-modal') === 'true',
      titulo: caja.querySelector('h2').textContent,
      botones: bs.map(b => b.innerText.replace(/\s+/g, ' ').trim()),
      logos: caja.querySelectorAll('.metas-centro-op img').length,
      minAlto: Math.min(...bs.map(b => b.getBoundingClientRect().height)),
      ancho: document.documentElement.scrollWidth,
    };
  });
  ok(abiertas === 0, '(c) antes de elegir no se abre ninguna hoja');
  ok(sel.dialogo && sel.titulo === '¿Con qué centro imprimes el examen?', '(c) aparece el selector', sel.titulo);
  ok(sel.botones.length === 4 && sel.botones[0] === CENTRO_A.nombre && sel.botones[1] === CENTRO_B.nombre
    && sel.botones[2] === 'Sin encabezado (como antes)' && sel.botones[3] === 'Cancelar', '(c) un botón por centro, «Sin encabezado» y Cancelar', sel.botones);
  ok(sel.logos === 2, '(c) cada centro con su logo');
  ok(sel.minAlto >= 44 && sel.ancho <= 390, '(c) botones de 44 px o más, sin salirse de la pantalla', sel);
  if (CAPTURAS) await pg.screenshot({ path: path.join(CAPTURAS, 'selector-centros.png') });
  pg.off('popup', contar);
  win = await hojaDe(pg, () => pg.click('.metas-centro-op[data-centro="c-b"]'));
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.texto.startsWith('ESCUELA FICTICIA EL PORVENIR Danlí · Docente: Docente De La Cuenta'),
    '(c) se imprime el centro elegido (sin docente en el centro, el de la cuenta)', h.texto.slice(0, 100));
  await captura(win, 'con-perfil-segundo-centro.png');
  await win.close();
  ok(await pg.evaluate(() => !document.querySelector('.metas-centro-velo') && localStorage.getItem('METAS_EXAMEN_CENTRO_V1') === 'c-b'),
    '(c) el selector se cierra y se recuerda el elegido');

  await pg.evaluate(() => printEval());
  await pg.waitForSelector('.metas-centro-caja');
  const otra = await pg.evaluate(() => ({
    marcado: document.querySelector('.metas-centro-op[data-ultimo]')?.getAttribute('data-centro'),
    foco: document.activeElement?.getAttribute('data-centro'),
    rotulo: document.querySelector('.metas-centro-op[data-ultimo]')?.innerText || '',
  }));
  ok(otra.marcado === 'c-b' && otra.foco === 'c-b' && /La última vez/.test(otra.rotulo), '(c) la próxima vez el último va marcado y con el foco: un toque', otra);
  await pg.keyboard.press('Escape');
  ok(await pg.evaluate(() => !document.querySelector('.metas-centro-velo')), '(c) Escape cierra sin imprimir');

  console.log('\n── (d) «Sin encabezado» ──');
  await pg.evaluate(() => printEval());
  await pg.waitForSelector('.metas-centro-caja');
  win = await hojaDe(pg, () => pg.click('.metas-centro-sin'));
  h = await leerHoja(win);
  ok(h.marca === 'sin' && !h.logo && h.texto === hoy.texto, '(d) la hoja de siempre, con la raya para escribir el centro', h.texto.slice(0, 120));
  ok(h.html.replace(' data-metas-encabezado="sin"', '') === hoy.html, '(d) el encabezado es el mismo de (a), byte por byte');
  await win.close();

  console.log('\n── (e) el docente cerró sesión ──');
  await pg.evaluate(() => localStorage.removeItem('METAS_DOCENTE_V1'));
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(!h.marca && h.html === hoy.html, '(e) sin selector y con la hoja de hoy, aunque los centros sigan guardados');
  await win.close();

  console.log('\n── Fin de grado 6.º, la operativa ──');
  await pg.goto(BASE + '/misiones/fin-de-grado-6to/fin-de-grado-6to.html', { waitUntil: 'load' });
  await preparar(pg, { centros: [CENTRO_A], sesion: SESION });
  await pg.evaluate(() => { evalOpNueva(); });
  win = await hojaDe(pg, () => pg.evaluate(() => printEvalOp()));
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.logo && h.texto.includes('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES') && !/Centro Educativo:|Instituto:/.test(h.texto),
    'Fin de grado también lleva el centro', h.texto.slice(0, 120));
  await win.close();
  /* Fin de grado no trae ajuste propio: se pagina como hoy. Mismo examen,
     con y sin centro, y la misma cantidad de páginas en el PDF. */
  const paginas = async conSesion => {
    await pg.evaluate(s => { if (s) localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify(s)); else localStorage.removeItem('METAS_DOCENTE_V1'); }, conSesion ? SESION : null);
    const w = await hojaDe(pg, () => pg.evaluate(() => printEvalOp()));
    const pdf = await w.pdf({ format: 'Letter', preferCSSPageSize: true });
    await w.close();
    return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  };
  const sinC = await paginas(false), conC = await paginas(true);
  ok(sinC === conC, 'y su hoja se pagina igual que hoy', { hoy: sinC, conCentro: conC });

  ok(!errores.length, 'sin errores en la página', errores);
  await nav.close();
  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El examen impreso lleva el centro elegido, y sin sesión o sin encabezado sale como hoy');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
