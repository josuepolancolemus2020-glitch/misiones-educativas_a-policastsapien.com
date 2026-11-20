/* =====================================================================
   M.E.T.A.S · El centro en el examen impreso, en el navegador
   ---------------------------------------------------------------------
   La otra mitad de _dev/verifica-encabezado-centro.js, con una misión
   de verdad (La Materia: «Instituto» en el conceptual, «Centro
   Educativo» en pensamiento crítico) y Fin de grado 6.º (la operativa):

   (a) sin sesión: la hoja sale con la raya en blanco, sin logo;
   (b) docente con un centro: el logo a color, cuadrado y grande (60 px
       o más) a la izquierda, y a su derecha el nombre, el lugar,
       «Docente: …» con Grado y Sección, Parcial y Fecha ya escritos, el
       título y un solo renglón del alumno (Nombre y N.º de lista); la
       hoja cabe en la carta y no le queda el encabezado de siempre;
       antes de imprimir, el cuadrito de parcial y fecha: «Cancelar» no
       imprime ni anota la pauta; lo elegido sale escrito en letra
       pequeña, como la dirección, y el parcial se recuerda;
   (c) docente con dos centros y el segundo activo en Mi aula: imprime
       directo con el activo, y no aparece ningún selector;
       sin activo y con uno solo, ese; sin activo y con varios, el último
       con que se imprimió;
   (d) sin activo, con varios y sin último: la hoja de siempre, como (a);
       un centro archivado no sale nunca, aunque sea el activo o el último
       usado: con el activo archivado, el único vivo o la hoja sin
       encabezado personalizado;
   (e) el docente cerró sesión: igual que (a);
   · Fin de grado 6.º (sin ajuste propio) y la operativa de Robot que
     decide (su ajuste ya llega al mínimo y no cabe) se paginan igual con
     el centro que sin él.

   Con METAS_CAPTURAS=<carpeta> guarda las capturas del encabezado con
   perfil y sin perfil.

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

/* Dos logos a color: tienen que salir a color en la hoja. */
const svg = (fondo, letra) => 'data:image/svg+xml;base64,' + Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="56" fill="' + fondo
  + '"/><circle cx="60" cy="60" r="40" fill="#ffd400"/><text x="60" y="76" font-size="44" font-family="Arial" font-weight="700" text-anchor="middle" fill="#0b3d91">'
  + letra + '</text></svg>').toString('base64');
const CENTRO_A = { id: 'c-a', nombre: 'Centro de Educación Básica Las Flores', logo: svg('#c0392b', 'LF'), direccion: 'Colonia Ficticia', municipio: 'Villanueva', departamento: 'Cortés', docente: 'Docente Ficticia' };
const CENTRO_B = { id: 'c-b', nombre: 'Escuela Ficticia El Porvenir', logo: svg('#1e8449', 'EP'), direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', docente: '' };
const SESION = { codigo: 'DOC-FICTICIO', nombre: 'Docente De La Cuenta' };
const perfilDe = c => Object.assign({ logoSec: '', grado: '6', seccion: '1', gradoSeccion: '6º-1', anio: '2027' }, c);

/* La copia que escribe Mi aula: un grupo por centro (aula-1, aula-2…),
   `actual` el grupo activo (null: ninguno), y los ids archivados. */
async function preparar(pg, { centros, sesion, actual = 'aula-1', archivados, ultimo, perfiles }) {
  await pg.evaluate(({ centros, sesion, perfiles, actual, archivados, ultimo }) => {
    if (ultimo) localStorage.setItem('METAS_EXAMEN_CENTRO_V1', ultimo);
    else localStorage.removeItem('METAS_EXAMEN_CENTRO_V1');
    const porAula = {};
    perfiles.forEach((p, i) => { porAula['aula-' + (i + 1)] = p; });
    const copia = { actual, porAula, centros };
    if (archivados) copia.archivados = archivados;
    localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify(copia));
    if (sesion) localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify(sesion));
    else localStorage.removeItem('METAS_DOCENTE_V1');
  }, { centros, sesion, actual, archivados: archivados || null, ultimo: ultimo || '', perfiles: (perfiles || centros).map(perfilDe) });
}
/* ¿Apareció el selector viejo, o cualquier diálogo que pregunte por el
   centro? (La misión tiene los suyos, como la tarjeta del alumno: esos
   no cuentan.) */
const haySelector = pg => pg.evaluate(() => !!document.querySelector('.metas-centro-velo, .metas-centro-caja, .metas-centro-op, #metas-centro-velo')
  || [...document.querySelectorAll('[role="dialog"]')].some(d => d.offsetParent && /centro/i.test(d.textContent)));

/* Imprime y devuelve la ventana nueva ya escrita. */
async function hojaDe(pg, accion) {
  const [win] = await Promise.all([pg.waitForEvent('popup', { timeout: 8000 }), accion()]);
  await win.waitForLoadState('load');
  await win.waitForTimeout(150);
  return win;
}
/* Con el logo, antes de imprimir sale el cuadrito de parcial y fecha:
   se contesta como el docente (toca el parcial, escribe la fecha, toca
   «Imprimir») y se devuelve la ventana nueva. */
async function hojaConDatos(pg, fn, { parcial, fecha } = {}) {
  return hojaDe(pg, async () => {
    await pg.evaluate(f => { window[f](); }, fn);
    await pg.waitForSelector('.metas-datos-caja', { timeout: 3000 });
    if (parcial) await pg.check('input[name="metas-parcial"][value="' + parcial + '"]');
    if (fecha !== undefined) await pg.fill('#metas-datos-fecha', fecha);
    await pg.click('.metas-datos-ir');
  });
}
const pautasVistas = pg => pg.evaluate(() => { try { return (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || []).filter(e => e.tipo === 'pauta_vista').length; } catch (e) { return -1; } });
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
      ladoLogo: img ? Math.round(img.getBoundingClientRect().width / (parseFloat(getComputedStyle(ph.parentElement).zoom) || 1)) : 0,
      /* Lo que va a la derecha del logo empieza después del logo. */
      aLaDerecha: img ? ['[data-metas-docente]', 'h2'].every(sel => { const e = ph.querySelector(sel); return e && e.getBoundingClientRect().left >= img.getBoundingClientRect().right; })
        && [...ph.querySelectorAll('.ph-line strong')].filter(s => s.textContent === 'Nombre:').every(s => s.getBoundingClientRect().left >= img.getBoundingClientRect().right) : false,
      copiaQuitada: !document.querySelector('[data-metas-antes]'),
      letraDocente: (() => { const e = ph.querySelector('[data-metas-docente]'); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; })(),
      letraLugar: (() => { const e = [...ph.querySelectorAll('[data-metas-centro] div')].find(d => /Colonia Ficticia/.test(d.textContent) && !d.children.length); return e ? parseFloat(getComputedStyle(e).fontSize) : -1; })(),
      altoLogo: img ? Math.round(img.getBoundingClientRect().height / (parseFloat(getComputedStyle(ph.parentElement).zoom) || 1)) : 0,
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

  console.log('\n── (b) docente con un centro: el cuadrito de parcial y fecha ──');
  /* La pauta impresa se anota a lo más una vez por minuto, y (a) acaba de
     imprimir: se recarga la misión para mirar «Cancelar» desde cero. */
  await preparar(pg, { centros: [CENTRO_A], sesion: SESION });
  await pg.reload({ waitUntil: 'load' });
  await pg.evaluate(() => { genEval(); genEvalCrit(); });
  if (await ahoraNo.count() && await ahoraNo.first().isVisible()) await ahoraNo.first().click();
  await pg.evaluate(() => { localStorage.removeItem('METAS_EXAMEN_PARCIAL_V1'); localStorage.setItem('METAS_SACE_PARCIAL', 'III'); });
  let abiertas = 0;
  const contar = () => abiertas++;
  pg.on('popup', contar);
  await pg.evaluate(() => printEval());
  await pg.waitForSelector('.metas-datos-caja', { timeout: 3000 });
  const cuadro = await pg.evaluate(() => {
    const caja = document.querySelector('.metas-datos-caja');
    const hoy = new Date(); const dos = x => (x < 10 ? '0' : '') + x;
    const toques = [...caja.querySelectorAll('label:has(input[type="radio"]), input[type="date"], button')];
    return {
      dialogo: caja.getAttribute('role') === 'dialog' && caja.getAttribute('aria-modal') === 'true',
      titulo: caja.querySelector('h2').textContent,
      parciales: [...caja.querySelectorAll('input[name="metas-parcial"]')].map(i => i.value + (i.checked ? '*' : '')).join(' '),
      fecha: caja.querySelector('#metas-datos-fecha').value,
      hoy: hoy.getFullYear() + '-' + dos(hoy.getMonth() + 1) + '-' + dos(hoy.getDate()),
      botones: [...caja.querySelectorAll('button')].map(b => b.textContent.trim()),
      /* ⚠️ Se redondea a la unidad con que Chromium coloca las cajas (1/64 de px)
         antes de comparar, como en verifica-notas-sace-simple. Lo que mide 44 px de
         verdad (min-height: 44px) a veces vuelve como 43,99998 por la resta en coma
         flotante de getBoundingClientRect, y la sonda salía roja o verde según la
         corrida sin que cambiara un píxel. Lo que no mide 44 (43,98 o menos) sigue
         saliendo rojo. */
      minAlto: Math.min(...toques.map(b => Math.round(b.getBoundingClientRect().height * 64) / 64)),
      ancho: document.documentElement.scrollWidth,
    };
  });
  ok(abiertas === 0, '(b) antes de contestar no se abre ninguna hoja');
  ok(cuadro.dialogo && cuadro.titulo === 'Datos del examen', '(b) aparece el cuadrito «Datos del examen»', cuadro.titulo);
  ok(cuadro.parciales === 'I II III* IV', '(b) los cuatro parciales, con el que está abierto en Notas SACE ya marcado', cuadro.parciales);
  ok(cuadro.fecha === cuadro.hoy, '(b) la fecha de hoy ya puesta', cuadro);
  ok(cuadro.botones.join('|') === '🖨️ Imprimir|Cancelar', '(b) «Imprimir» y «Cancelar»', cuadro.botones);
  ok(cuadro.minAlto >= 44 && cuadro.ancho <= 390, '(b) todo se toca con 44 px o más y cabe en el teléfono', cuadro);
  if (CAPTURAS) await pg.screenshot({ path: path.join(CAPTURAS, 'cuadrito-parcial-fecha.png') });
  const pautasAntes = await pautasVistas(pg);
  await pg.click('.metas-datos-cerrar');
  await pg.waitForTimeout(300);
  ok(abiertas === 0 && !(await pg.$('.metas-datos-velo')), '(b) «Cancelar» cierra sin imprimir');
  ok(await pautasVistas(pg) === pautasAntes, '(b) y no anota «vio la pauta»: no se imprimió nada', { antes: pautasAntes, despues: await pautasVistas(pg) });
  pg.off('popup', contar);

  win = await hojaConDatos(pg, 'printEval', { parcial: 'II', fecha: '2026-11-19' });
  let h = await leerHoja(win);
  ok(h.marca === 'centro', '(b) al tocar «Imprimir» sale la hoja con el centro');
  ok(h.logo && h.filtro === 'none' && h.logoIzq, '(b) el logo sale a color, arriba a la izquierda', h.filtro);
  ok(h.ladoLogo >= 60 && h.altoLogo === h.ladoLogo, '(b) el logo es cuadrado y mide 60 px o más', { ancho: h.ladoLogo, alto: h.altoLogo });
  ok(h.aLaDerecha, '(b) el docente, el título y el Nombre van a la derecha del logo, sin taparlo');
  ok(h.copiaQuitada, '(b) el encabezado de siempre, que va al lado para medir, ya no está en la hoja abierta');
  ok(h.texto.startsWith('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES Colonia Ficticia, Villanueva, Cortés Docente: Docente Ficticia · Grado y Sección: 6º-1 · Parcial: II · Fecha: 19 de noviembre de 2026'),
    '(b) el nombre, el lugar, y ya escritos el docente, el grado, el parcial y la fecha', h.texto.slice(0, 180));
  ok(h.letraDocente === h.letraLugar && h.letraLugar > 0, '(b) con la misma letra que la dirección', { docente: h.letraDocente, lugar: h.letraLugar });
  ok(!/Instituto:|Centro Educativo:/.test(h.texto) && /Nombre: N\.º de lista:/.test(h.texto) && (h.texto.match(/Parcial:/g) || []).length === 1,
    '(b) sin la raya del centro; el alumno tiene un solo renglón (Nombre y N.º de lista) y nada sale dos veces', h.texto);
  ok(h.texto.indexOf('Fecha:') < h.texto.indexOf('Evaluación · La Materia · Ciencias Naturales') && h.texto.indexOf('Evaluación · La Materia · Ciencias Naturales') < h.texto.indexOf('Nombre:'),
    '(b) el título del examen, «Evaluación · Tema · Materia», va entre el renglón del docente y el del alumno');
  ok(h.altoMm <= 252.5, '(b) la hoja sigue cabiendo en la carta', h.altoMm.toFixed(1));
  ok(await pautasVistas(pg) === pautasAntes + 1, '(b) imprimir sí anota «vio la pauta», como siempre');
  await captura(win, 'con-perfil.png');
  await win.close();

  await pg.evaluate(() => printEvalCrit());
  await pg.waitForSelector('.metas-datos-caja');
  const recordado = await pg.evaluate(() => document.querySelector('input[name="metas-parcial"]:checked').value);
  ok(recordado === 'II', '(b) la próxima vez ya está marcado el parcial que se eligió', recordado);
  await pg.keyboard.press('Escape');
  ok(!(await pg.$('.metas-datos-velo')), '(b) Escape también cierra sin imprimir');
  win = await hojaConDatos(pg, 'printEvalCrit', { fecha: '' });
  h = await leerHoja(win);
  ok(h.marca === 'centro' && !h.texto.includes('Centro Educativo:') && h.texto.includes('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES')
    && /Parcial: II · Fecha: ?$|Parcial: II · Fecha: (?!\d)/.test(h.texto.split('Evaluación')[0].trim()),
    '(b) pensamiento crítico («Centro Educativo») también; con la fecha borrada queda la raya', h.texto.slice(0, 160));
  await win.close();

  console.log('\n── (c) dos centros, el segundo activo en Mi aula ──');
  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION, actual: 'aula-2' });
  win = await hojaConDatos(pg, 'printEval', { parcial: 'IV', fecha: '2027-03-02' });
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.texto.startsWith('ESCUELA FICTICIA EL PORVENIR Danlí, El Paraíso Docente: Docente De La Cuenta · Grado y Sección: 6º-1 · Parcial: IV · Fecha: 2 de marzo de 2027')
    && !h.texto.includes('LAS FLORES'),
    '(c) sale el centro activo con su grupo (sin docente en el centro, el de la cuenta)', h.texto.slice(0, 140));
  await captura(win, 'con-perfil-segundo-centro.png');
  await win.close();
  ok(!(await haySelector(pg)), '(c) y no aparece ningún selector de centro');
  ok(await pg.evaluate(() => localStorage.getItem('METAS_EXAMEN_CENTRO_V1') === 'c-b'), '(c) queda anotado como el último con que se imprimió');

  await preparar(pg, { centros: [CENTRO_B], sesion: SESION, actual: null, perfiles: [] });
  win = await hojaConDatos(pg, 'printEval');
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.texto.startsWith('ESCUELA FICTICIA EL PORVENIR') && /Grado y Sección: · Parcial: IV/.test(h.texto.replace(/\s+/g, ' ')),
    '(c) sin activo y con un solo centro, sale ese; sin grupo, el grado queda con su raya', h.texto.slice(0, 120));
  await win.close();

  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION, actual: null, perfiles: [], ultimo: 'c-b' });
  win = await hojaConDatos(pg, 'printEvalCrit');
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.texto.startsWith('ESCUELA FICTICIA EL PORVENIR') && !(await haySelector(pg)),
    '(c) sin activo y con varios, el último con que se imprimió, sin preguntar el centro', h.texto.slice(0, 60));
  await win.close();

  console.log('\n── (d) sin centro que elegir, y un centro activo archivado ──');
  /* Con sesión, la hoja sin centro es la de (a) con el título y el pie
     limpios («Evaluación · Tema · Materia» y la firma del padre), como lo
     pidió Josué el 20 de noviembre. */
  const hoyLimpio = await pg.evaluate(x => MotorMisiones.centro.limpia(x), hoy.html);
  const textoLimpio = hoy.texto.replace('Evaluación Final · La Materia · Educación Básica · Ciencias Naturales', 'Evaluación · La Materia · Ciencias Naturales');
  ok(textoLimpio !== hoy.texto && hoyLimpio !== hoy.html, '(d) la hoja de (a), con el título limpio');
  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION, actual: null, perfiles: [] });
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(h.marca === 'sin' && !h.logo && h.texto === textoLimpio, '(d) varios, sin activo y sin último: la hoja de siempre, con la raya para escribir el centro', h.texto.slice(0, 120));
  ok(h.html.replace(' data-metas-encabezado="sin"', '') === hoyLimpio, '(d) es la de (a), byte por byte, con el título y el pie limpios');
  ok(!(await haySelector(pg)) && !(await pg.$('.metas-datos-velo')), '(d) sin logo no se pregunta nada: ni centro, ni parcial, ni fecha');
  await win.close();

  await preparar(pg, { centros: [CENTRO_A], sesion: SESION, actual: 'aula-2', perfiles: [CENTRO_A, CENTRO_B], archivados: ['c-b'], ultimo: 'c-b' });
  win = await hojaConDatos(pg, 'printEval');
  h = await leerHoja(win);
  ok(h.marca === 'centro' && h.texto.startsWith('CENTRO DE EDUCACIÓN BÁSICA LAS FLORES') && !h.texto.includes('PORVENIR'),
    '(d) el centro activo archivado no sale: queda el único que hay', h.texto.slice(0, 60));
  await win.close();

  /* Tres centros: el C (aula-3) es el activo y está archivado; A y B
     siguen vivos y B fue el último usado. No se adivina: hoja sin
     encabezado personalizado, y sin preguntar parcial ni fecha. */
  const CENTRO_C = { id: 'c-c', nombre: 'Instituto Ficticio Tercero', logo: CENTRO_A.logo, direccion: '', municipio: 'Juticalpa', departamento: 'Olancho', docente: '' };
  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION, actual: 'aula-3', perfiles: [CENTRO_A, CENTRO_B, CENTRO_C], archivados: ['c-c'], ultimo: 'c-b' });
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(h.marca === 'sin' && !h.logo && h.texto === textoLimpio && !(await pg.$('.metas-datos-velo')),
    '(d) activo archivado y dos vivos: la hoja sin encabezado personalizado, aunque el último usado siga vivo', h.texto.slice(0, 80));
  await win.close();

  await preparar(pg, { centros: [CENTRO_A, CENTRO_B], sesion: SESION, actual: null, perfiles: [], archivados: ['c-c'], ultimo: 'c-c' });
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(h.marca === 'sin' && !h.texto.includes('TERCERO'), '(d) sin grupo activo y con el último usado archivado: tampoco sale', h.texto.slice(0, 80));
  await win.close();

  await preparar(pg, { centros: [CENTRO_A, CENTRO_B, Object.assign({}, CENTRO_C, { deleted_at: '2027-03-01T00:00:00Z' })], sesion: SESION, actual: 'aula-3', perfiles: [CENTRO_A, CENTRO_B, CENTRO_C], ultimo: 'c-c' });
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(h.marca === 'sin' && !h.texto.includes('TERCERO'), '(d) ni con deleted_at en el renglón de la lista', h.texto.slice(0, 80));
  await win.close();

  console.log('\n── (e) el docente cerró sesión ──');
  await pg.evaluate(() => localStorage.removeItem('METAS_DOCENTE_V1'));
  win = await hojaDe(pg, () => pg.evaluate(() => printEval()));
  h = await leerHoja(win);
  ok(!h.marca && h.html === hoy.html && !(await pg.$('.metas-datos-velo')), '(e) la hoja de hoy, sin preguntar nada, aunque los centros sigan guardados');
  await win.close();

  console.log('\n── Fin de grado 6.º, la operativa ──');
  await pg.goto(BASE + '/misiones/fin-de-grado-6to/fin-de-grado-6to.html', { waitUntil: 'load' });
  await preparar(pg, { centros: [CENTRO_A], sesion: SESION });
  await pg.evaluate(() => { evalOpNueva(); });
  /* Aquí se mide el papel: el cuadrito lo contesta la página sola. */
  await pg.evaluate(() => MotorMisiones.centro.preguntar(listo => listo({ parcial: 'II', fecha: '19 de noviembre de 2026' })));
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
  ok(sinC === conC, 'y su hoja se pagina igual que hoy, con el logo nuevo', { hoy: sinC, conCentro: conC });

  console.log('\n── Robot que decide, la operativa: ya en su zoom mínimo ──');
  /* Su ajuste llega a 0,55 y aun así mide 260 mm de 252: con el centro
     pasaba a una tercera hoja con cualquier logo. Se imprime al ancho de
     la carta (215,9 mm menos los márgenes de 7 mm de su @page), que es
     donde el ajuste ve los mismos renglones que el papel. */
  await pg.goto(BASE + '/misiones/2y3ciclo-robot-decide/robot-decide.html', { waitUntil: 'load' });
  await pg.evaluate(() => { genEvalOp(); });
  await pg.evaluate(() => MotorMisiones.centro.preguntar(listo => listo({ parcial: 'II', fecha: '19 de noviembre de 2026' })));
  const robot = async conSesion => {
    await preparar(pg, { centros: [CENTRO_A], sesion: conSesion ? SESION : null });
    const html = await pg.evaluate(() => {
      let h = '';
      const real = window.open;
      window.open = () => ({ document: { write: t => { h += t; }, close() {} }, print() {}, focus() {}, close() {} });
      try { printEvalOp(); } finally { window.open = real; }
      return h;
    });
    const w = await ctx.newPage();
    await w.setViewportSize({ width: Math.round((215.9 - 14) * 96 / 25.4), height: 1000 });
    await w.setContent(html, { waitUntil: 'load' });
    await w.waitForTimeout(250);
    const marca = await w.evaluate(() => document.querySelector('.ph').getAttribute('data-metas-encabezado'));
    const pdf = await w.pdf({ format: 'Letter', preferCSSPageSize: true });
    await w.close();
    return { marca, paginas: (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length };
  };
  const rHoy = await robot(false), rCon = await robot(true);
  ok(rCon.marca === 'centro' && rHoy.paginas === rCon.paginas, 'con el centro se pagina igual que hoy (examen y pauta)', { hoy: rHoy.paginas, conCentro: rCon.paginas });

  ok(!errores.length, 'sin errores en la página', errores);
  await nav.close();
  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El examen impreso lleva el centro activo, el logo a color y el grado, parcial y fecha escritos; sin sesión sale como hoy');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
