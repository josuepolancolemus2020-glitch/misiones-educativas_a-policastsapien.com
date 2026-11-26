#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · El motor arranca cada widget por su cuenta · en el navegador
   ------------------------------------------------------------
   Lo mismo que `verifica-motor-arranque.js`, que lo mira en una página
   de mentira en cada empujón, pero en un navegador de verdad y con la
   página entera: aquí también cargan los guiones de al lado (las
   estrellas, el registro, la barra de secciones, el teclado), que leen
   `SAVE_KEY`, `xp` y `done` y envuelven `fin` y `go`. Es donde se ve si
   una tarjeta escondida de verdad no se ve, o si un guion de al lado
   revienta cuando a la misión le falta un dato.

   Se abre La Célula sin tocar sus archivos: al navegador se le sirve su
   contenido.js con una declaración menos (o su página con los ids
   nuevos), y se mira:

   · que no hay ningún error de página ni de consola;
   · que el widget sin datos no se ve y los demás sí;
   · que el laboratorio y los logros, que arrancan al final, están;
   · que sin los trece datos quedan el laboratorio y el examen, la
     pestaña de una sección vacía no se ve, y la Forma 1 se genera;
   · que con los nombres nuevos se ve lo mismo que con los de antes.

   Va de noche con las demás del navegador (npm run test:navegador).

     node _dev/servidor-estatico.js     # en otra terminal
     node _dev/verifica-motor-arranque-navegador.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');
const A = require('./verifica-motor-arranque.js');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const DIR = path.resolve(__dirname, '..', 'misiones', A.CARPETA);
const URL_MISION = BASE + '/misiones/' + A.CARPETA + '/' + A.PAGINA;
const CONTENIDO = fs.readFileSync(path.join(DIR, 'js', 'contenido.js'), 'utf8');
const HTML = fs.readFileSync(path.join(DIR, A.PAGINA), 'utf8');

(async () => {
  let fallos = 0;
  const ok = (nombre, cond, detalle) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) { fallos++; if (detalle) console.log('      ' + detalle); } };
  const nav = await abrir();

  /* Abre la misión sirviéndole el contenido (y la página) que se le dé, y
     devuelve lo que se ve. Cada escenario en su contexto: sin progreso
     guardado de otro. */
  async function abre(contenido, html, ids) {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 780 } });
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(String(e.message || e)));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errores.push(m.text()); });
    await page.route(/\/js\/contenido\.js(\?.*)?$/, r => r.fulfill({ status: 200, contentType: 'text/javascript; charset=utf-8', body: contenido }));
    if (html) await page.route(u => u.pathname.endsWith('/' + A.PAGINA), r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    await page.goto(URL_MISION, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const ve = await page.evaluate(ids => {
      const id = n => (ids && ids[n]) || n;
      const el = n => document.getElementById(id(n));
      /* Se ve si no está escondido él ni ninguna caja de arriba. La sección
         que no es la activa también está escondida, así que se mira el
         `display` de la tarjeta y no si ocupa sitio. */
      const tapada = n => { const e = el(n); const caja = e && (e.closest('.card') || e); return !caja || getComputedStyle(caja).display === 'none'; };
      const txt = n => { const e = el(n); return e ? e.textContent.trim() : null; };
      const hijos = n => { const e = el(n); return e ? e.children.length : -1; };
      return {
        arranque: (window.MotorMisiones && MotorMisiones.arranque) || null,
        tapadas: ['fcInner', 'qzQ', 'clsBank', 'idSent', 'cmpSent', 'routeList', 'neuronOpts', 'neuroOpts', 'enferOpts', 'retoWord'].filter(tapada),
        pestanasTapadas: Array.from(document.querySelectorAll('.nav-t[data-s]')).filter(b => getComputedStyle(b).display === 'none').map(b => b.dataset.s),
        pinta: {
          tarjetas: txt('fcW'), quiz: txt('qzQ'), clasifica: hijos('clsBank'), identifica: hijos('idSent'), completa: txt('cmpSent'),
          ordena: hijos('routeList'), describe: txt('neuronDesc') + ' · ' + hijos('neuronOpts'), empareja: txt('neuroTrans') + ' · ' + hijos('neuroOpts'),
          situacion: txt('enferDisease') + ' · ' + hijos('enferOpts'),
          reto: Array.from(document.querySelectorAll('.reto-btns .btn')).map(b => b.textContent).join(' | '),
          laboratorio: txt('lab-display'), logros: hijos('achList')
        },
        llave: typeof SAVE_KEY !== 'undefined' ? SAVE_KEY : null
      };
    }, ids || null);
    return { page, ctx, errores, ve };
  }
  /* Las opciones de los tres widgets salen barajadas: se compara lo que no
     depende del azar (el texto y cuántas son), que es lo que `pinta` trae. */
  const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  console.log('— Control: La Célula con todo declarado —');
  const control = await abre(CONTENIDO);
  const base = control.ve.pinta;
  ok('carga sin errores y sin pasos sin datos', !control.errores.length && control.ve.arranque && !control.ve.arranque.sinDatos.length && !control.ve.arranque.fallaron.length, control.errores[0] || JSON.stringify(control.ve.arranque));
  ok('pinta sus doce piezas y no esconde ninguna tarjeta ni pestaña', base.tarjetas === 'Célula' && base.clasifica === 10 && base.ordena === 5 && base.logros === 8 && /Núcleo/.test(base.laboratorio || '') && !control.ve.tapadas.length && !control.ve.pestanasTapadas.length, JSON.stringify(control.ve));
  await control.ctx.close();

  console.log('— Sin cada uno de los trece datos, uno por uno —');
  for (const t of A.TRECE) {
    const p = await abre(A.quita(CONTENIDO, [t.dato]));
    const fallas = [];
    if (p.errores.length) fallas.push('errores: ' + p.errores.slice(0, 2).join(' | '));
    const a = p.ve.arranque || { sinDatos: ['?'], fallaron: ['?'] };
    if (!igual(a.sinDatos, t.paso ? [t.paso] : []) || a.fallaron.length) fallas.push('arranque: ' + JSON.stringify(a));
    if (!igual(p.ve.tapadas, t.id ? [t.id] : [])) fallas.push('tarjetas que no se ven: ' + (p.ve.tapadas.join(', ') || 'ninguna'));
    Object.keys(base).forEach(k => {
      if (k === t.paso || (k === 'logros' && t.dato === 'ACHIEVEMENTS')) return;
      if (!igual(p.ve.pinta[k], base[k])) fallas.push(k + ': ' + JSON.stringify(p.ve.pinta[k]));
    });
    if (t.dato === 'SAVE_KEY' && p.ve.llave !== 'metas_' + A.CARPETA.replace(/[^a-z0-9]+/gi, '_') + '_v1') fallas.push('la llave publicada es ' + p.ve.llave);
    ok('sin ' + t.dato + ': la página entera sigue en pie' + (t.paso ? ' y solo falta «' + t.paso + '»' : ''), fallas.length === 0, fallas.join(' · '));
    await p.ctx.close();
  }

  console.log('— Sin los trece a la vez, ni los demás datos con reserva —');
  const vacia = await abre(A.quita(CONTENIDO, A.TRECE.map(t => t.dato).concat(A.CON_RESERVA)));
  ok('carga sin errores', !vacia.errores.length && vacia.ve.arranque && !vacia.ve.arranque.fallaron.length, vacia.errores.slice(0, 2).join(' | '));
  ok('el laboratorio sigue pintado', igual(vacia.ve.pinta.laboratorio, base.laboratorio));
  ok('las pestañas de las secciones vacías no se ven, y las de Aprende, Laboratorio y Evaluación sí',
    ['s-flash', 's-quiz', 's-widgets', 's-reto', 's-sopa', 's-tareas'].every(s => vacia.ve.pestanasTapadas.includes(s)) && !['s-aprende', 's-lab', 's-evaluacion'].some(s => vacia.ve.pestanasTapadas.includes(s)), vacia.ve.pestanasTapadas.join(', '));
  /* La flecha del laboratorio lleva a Tarjetas, que ya no está: tiene que
     caer en la Evaluación. Y el examen se genera con los textos de reserva. */
  const fin = await vacia.page.evaluate(() => {
    go('s-flash');
    const activa = (document.querySelector('.sec.active') || {}).id;
    genEval();
    return { activa, titulo: document.getElementById('eval-screen-title').textContent, preguntas: document.querySelectorAll('#evalOut .eval-auto-item').length };
  });
  ok('la flecha que llevaba a Tarjetas cae en la Evaluación', fin.activa === 's-evaluacion', fin.activa);
  ok('y el examen se genera con los textos de reserva (Forma 1, con el título de la página)', fin.preguntas === 15 && /Forma 1 · La Célula/.test(fin.titulo) && !vacia.errores.length, JSON.stringify(fin) + ' ' + vacia.errores.join(' | '));
  await vacia.ctx.close();

  console.log('— Con los nombres nuevos —');
  const nueva = await abre(A.conNombresNuevos(CONTENIDO), A.paginaConNombresNuevos(HTML), A.NOMBRES_NUEVOS.ids);
  ok('carga sin errores y sin pasos sin datos', !nueva.errores.length && nueva.ve.arranque && !nueva.ve.arranque.sinDatos.length && !nueva.ve.arranque.fallaron.length, nueva.errores[0] || JSON.stringify(nueva.ve.arranque));
  ok('y pinta lo mismo que con los nombres de antes', igual(nueva.ve.pinta, base), JSON.stringify(nueva.ve.pinta));
  /* Se contesta bien el primero de «de un término a lo suyo» con los ids
     nuevos: tiene que marcarlo correcto y pagar su XP. */
  const acierto = await nueva.page.evaluate(() => {
    go('s-widgets');
    const antes = xp;
    const bien = Array.from(document.querySelectorAll('#emparejaOpts .qz-opt')).find(b => b.textContent === 'Guarda el ADN y dirige la célula');
    if (bien) bien.click();
    return { habia: !!bien, marcada: !!bien && bien.classList.contains('correct'), gano: xp - antes, aviso: document.getElementById('fbEmpareja').textContent };
  });
  ok('contestar bien un widget con ids nuevos lo marca y paga su XP', acierto.habia && acierto.marcada && acierto.gano === 3 && /Correcto/.test(acierto.aviso), JSON.stringify(acierto));
  await nueva.ctx.close();

  await nav.close();
  console.log(fallos === 0 ? '\n✅ En el navegador, La Célula sigue en pie sin cualquiera de sus datos heredados y con los nombres nuevos.' : '\n❌ ' + fallos + ' fallo(s).');
  process.exit(fallos === 0 ? 0 : 1);
})().catch(e => { console.error('✘ La sonda reventó: ' + (e && e.stack || e)); process.exit(1); });
