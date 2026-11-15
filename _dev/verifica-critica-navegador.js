#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La prueba de pensamiento crítico, en la página de verdad
   ------------------------------------------------------------
   `verifica-critica-sin-repetir.js` arma las formas en Node, con una
   página de mentira. Esto abre la misión en un navegador y hace lo que
   hace el maestro: elige la forma en el desplegable, toca «Generar» y
   manda a imprimir. Comprueba lo que la página de mentira no ve:

   · el desplegable de la prueba crítica llega a la Forma 50 y el del
     examen conceptual sigue donde estaba;
   · de la Forma 1 a la 50, lo que queda PINTADO en la pantalla no se
     repite: ninguna hoja trae los mismos casos que otra;
   · después de la 50 vuelve la 1, y la forma que toca se guarda con el
     progreso y sigue ahí al recargar;
   · un progreso guardado de antes (cuando la prueba llegaba a la 30) se
     abre sin tropiezo, y generar la crítica no mueve la forma que le toca
     al examen conceptual;
   · la hoja impresa dice su forma, trae los casos de la pantalla y sale
     en dos hojas carta (examen y pauta);
   · en las misiones con inglés, la Forma 7 lleva los mismos casos en los
     dos idiomas.

   Mira las misiones que ya reparten (declaran `critApartados`).

     node _dev/servidor-estatico.js              (en otra terminal)
     node _dev/verifica-critica-navegador.js              → todas las que reparten
     node _dev/verifica-critica-navegador.js <carpeta> …  → esas
   ============================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { abrir } = require('./lib-navegador');
const L = require('./lib-formas.js');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const pedidas = process.argv.slice(2);

let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

/* Las que reparten se reconocen en su código, sin abrir el navegador. */
const reparten = L.listarMisiones().dentro.filter(slug => {
  const dir = path.join(L.DIR_MISIONES, slug, 'js');
  return fs.readdirSync(dir).some(f => f.endsWith('.js') && /function\s+critApartados\s*\(/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
});
pedidas.forEach(s => { if (!reparten.includes(s)) { console.error('✘ ' + s + ' no reparte todavía su prueba crítica (no declara critApartados)'); process.exit(2); } });
const lista = pedidas.length ? pedidas : reparten;

const paginaDe = slug => fs.readdirSync(path.join(L.DIR_MISIONES, slug)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));

/* Lo que el alumno lee de una forma: los textos de los casos, tal como
   quedaron en la pantalla. Sin orden, para comparar conjuntos. Se quita
   el rótulo de cada caja («Caso A», «Texto B», «Causa»), que no es del
   caso y cada misión lo llama a su manera. */
const leerHoja = () => Array.from(document.querySelectorAll('#evalCritOut .crit-scenario, #evalCritOut .crit-compare-box, #evalCritOut .crit-ce-given'))
  .map(e => { const c = e.cloneNode(true); c.querySelectorAll('h5, .crit-ce-tag').forEach(r => r.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); });

(async () => {
  const nav = await abrir();
  for (const slug of lista) {
    console.log('\n🧠 ' + slug);
    const url = BASE + '/misiones/' + slug + '/' + paginaDe(slug);
    const ctx = await nav.newContext({ viewport: { width: 390, height: 780 } });
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|font|Failed to load resource/.test(m.text())) errores.push(m.text()); });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    /* Se entra como entra el maestro: a la evaluación y a la pestaña. */
    await page.evaluate(() => { if (typeof go === 'function') go('s-evaluacion'); evalSwitchMode('crit'); });
    await page.waitForTimeout(200);

    const sel = await page.evaluate(() => {
      const c = document.getElementById('evalCritFormaSel'), e = document.getElementById('evalFormaSel');
      return { crit: c ? c.options.length : 0, rotulo: c ? c.getAttribute('aria-label') : '', conceptual: e ? e.options.length : 0, tope: EVAL_FORMAS, formas: _formasCritica(critApartados()) };
    });
    if (sel.crit !== sel.formas || !/1 a 50/.test(sel.rotulo) || sel.formas !== 50) mal('el desplegable de la prueba crítica tiene ' + sel.crit + ' formas («' + sel.rotulo + '») y tendría que llegar a la 50');
    else bien('el desplegable de la prueba crítica llega a la Forma 50, y lo dice a quien no lo ve');
    if (sel.conceptual !== sel.tope) mal('el desplegable del examen conceptual tiene ' + sel.conceptual + ' formas y la misión dice ' + sel.tope);
    else bien('el desplegable del examen conceptual sigue en ' + sel.tope + ' formas');

    /* De la 1 a la 50, eligiendo en el desplegable y tocando el botón. */
    const hojas = {};
    let sinTitulo = 0, vacias = 0;
    const conceptualAntes = await page.evaluate(() => evalFormNum);
    for (let n = 1; n <= sel.formas; n++) {
      await page.selectOption('#evalCritFormaSel', String(n));
      const h = await page.evaluate(leer => {
        document.querySelector('[onclick*="genEvalCrit()"]').click();
        return { titulo: document.getElementById('evalcrit-screen-title').textContent, casos: (new Function('return (' + leer + ')()'))(), siguiente: document.getElementById('evalCritFormaSel').value };
      }, leerHoja.toString());
      if (!new RegExp('Forma ' + n + '\\b').test(h.titulo)) sinTitulo++;
      if (!h.casos.length) vacias++;
      hojas[n] = h;
    }
    if (sinTitulo || vacias) mal(sinTitulo + ' formas no dicen su número en el título y ' + vacias + ' salieron vacías');
    const conjuntos = new Map(), repetidas = [];
    Object.keys(hojas).forEach(n => {
      const c = JSON.stringify(hojas[n].casos.slice().sort());
      if (conjuntos.has(c)) repetidas.push('la ' + n + ' con la ' + conjuntos.get(c)); else conjuntos.set(c, n);
    });
    if (repetidas.length) mal('en la pantalla se repiten ' + repetidas.length + ' formas: ' + repetidas.slice(0, 5).join(', '));
    else if (!sinTitulo && !vacias) bien('las ' + sel.formas + ' formas, generadas desde el desplegable, pintan ' + conjuntos.size + ' hojas con casos distintos');

    /* Lo pintado sale de los bancos de la misión. */
    const fuera = await page.evaluate(vistos => {
      const quita = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.replace(/\s+/g, ' ').trim(); };
      const enBanco = [];
      const junta = x => { if (typeof x === 'string') enBanco.push(quita(x)); else if (Array.isArray(x)) x.forEach(junta); else if (x && typeof x === 'object') Object.keys(x).forEach(k => junta(x[k])); };
      critApartados().forEach(a => junta(a[0]));
      return vistos.filter(t => !enBanco.some(b => b && t.indexOf(b) >= 0));
    }, Array.from(new Set([].concat(...Object.keys(hojas).map(n => hojas[n].casos)))));
    if (fuera.length) mal(fuera.length + ' textos pintados no están en los bancos de la misión, por ejemplo: ' + JSON.stringify(fuera[0].slice(0, 80)));
    else bien('todo lo pintado está escrito en los bancos de la misión');

    /* Generar la crítica no mueve la forma que le toca al examen conceptual. */
    const conceptualDespues = await page.evaluate(() => evalFormNum);
    if (conceptualDespues !== conceptualAntes) mal('generar la prueba crítica movió el examen conceptual de la Forma ' + conceptualAntes + ' a la ' + conceptualDespues);
    else bien('generar las ' + sel.formas + ' formas críticas no mueve la forma del examen conceptual');

    if (hojas[sel.formas] && hojas[sel.formas].siguiente !== '1') mal('después de la Forma ' + sel.formas + ' el desplegable no vuelve a la 1 (dice ' + hojas[sel.formas].siguiente + ')');
    else bien('después de la Forma ' + sel.formas + ' vuelve la Forma 1');

    /* La hoja impresa de una forma nueva (de la 31 en adelante). */
    const FORMA_IMPRESA = 37;
    await page.selectOption('#evalCritFormaSel', String(FORMA_IMPRESA));
    const impresa = await page.evaluate(leer => {
      document.querySelector('[onclick*="genEvalCrit()"]').click();
      let doc = '';
      const real = window.open;
      window.open = () => ({ document: { write: h => { doc = h; }, close: () => {} }, print: () => {}, focus: () => {}, close: () => {} });
      try { printEvalCrit(); } finally { window.open = real; }
      return { doc, casos: (new Function('return (' + leer + ')()'))() };
    }, leerHoja.toString());
    if (!impresa.doc) mal('la Forma ' + FORMA_IMPRESA + ' no generó hoja para imprimir');
    else {
      const hoja = await ctx.newPage();
      await hoja.setContent(impresa.doc, { waitUntil: 'networkidle' });
      await hoja.waitForTimeout(900);   // el ajuste a una hoja necesita medir
      /* Se compara sin espacios: la pantalla y el papel no parten los
         renglones en el mismo sitio. */
      const texto = await hoja.evaluate(() => document.body.textContent.replace(/\s+/g, ''));
      const visible = await hoja.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
      const pdf = path.join(os.tmpdir(), 'metas-critica-' + slug + '.pdf');
      await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
      await hoja.close();
      const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
      fs.unlinkSync(pdf);
      const faltan = impresa.casos.filter(c => texto.indexOf(c.replace(/\s+/g, '').slice(0, 60)) < 0);
      if (!/Forma 37/.test(visible)) mal('la hoja impresa no dice «Forma ' + FORMA_IMPRESA + '»');
      else if (faltan.length) mal('la hoja impresa de la Forma ' + FORMA_IMPRESA + ' no trae ' + faltan.length + ' de los casos de la pantalla, por ejemplo: ' + JSON.stringify(faltan[0].slice(0, 70)));
      else if (paginas !== 2) mal('la Forma ' + FORMA_IMPRESA + ' se imprime en ' + paginas + ' hojas: tienen que ser 2 (prueba y pauta)');
      else bien('la Forma ' + FORMA_IMPRESA + ' se imprime con su número, con los casos de la pantalla y en 2 hojas carta');
    }

    /* La forma que toca se guarda con el progreso y sigue ahí al recargar.
       Entrar a la pestaña genera sola la que toca: tiene que ser la 42.
       (El desplegable se pinta antes de leer el progreso y al recargar
       enseña «Forma 1» hasta que se genera; pasa igual en el examen
       conceptual y en todas las misiones, y aquí no se mide.) */
    await page.selectOption('#evalCritFormaSel', '41');
    await page.evaluate(() => document.querySelector('[onclick*="genEvalCrit()"]').click());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const trasRecargar = await page.evaluate(() => {
      const guardada = evalCritFormNum;
      if (typeof go === 'function') go('s-evaluacion'); evalSwitchMode('crit');
      const sel = document.getElementById('evalCritFormaSel');
      return { guardada, titulo: document.getElementById('evalcrit-screen-title').textContent, sel: sel.value, ops: sel.options.length };
    });
    if (trasRecargar.guardada !== 42 || !/Forma 42\b/.test(trasRecargar.titulo) || trasRecargar.sel !== '43' || trasRecargar.ops !== 50) mal('tras generar la Forma 41 y recargar, estaba guardada la ' + trasRecargar.guardada + ', se generó «' + trasRecargar.titulo + '» y el desplegable dice ' + trasRecargar.sel + ' de ' + trasRecargar.ops);
    else bien('la forma que toca (la 42, después de la 41) se guarda, y al recargar se genera esa y queda apuntada la 43');

    /* Un progreso guardado de antes: la prueba llegaba a la 30. */
    const llave = await page.evaluate(() => SAVE_KEY);
    await page.evaluate(k => { const s = JSON.parse(localStorage.getItem(k) || '{}'); s.evalCritFormNum = 30; localStorage.setItem(k, JSON.stringify(s)); }, llave);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const deAntes = await page.evaluate(() => {
      if (typeof go === 'function') go('s-evaluacion'); evalSwitchMode('crit');
      return { titulo: document.getElementById('evalcrit-screen-title').textContent, sigue: evalCritFormNum };
    });
    if (!/Forma 30\b/.test(deAntes.titulo) || deAntes.sigue !== 31) mal('con un guardado de antes en la Forma 30: «' + deAntes.titulo + '» y sigue la ' + deAntes.sigue);
    else bien('un progreso guardado de antes, en la Forma 30, abre la 30 y sigue con la 31');

    /* En inglés los bancos se cambian enteros: la misma forma tiene que
       llevar los mismos casos, que se reconocen por su llave `k`. */
    const bilingue = await page.evaluate(() => typeof window.MISION_APLICAR_IDIOMA === 'function' && !!(window.MISION_EN && window.MISION_EN.data));
    if (bilingue) {
      const llaves = () => JSON.stringify(_repartoCritica(7, critApartados()).map(ap => ap.map(c => (c && c.k) || String(c).slice(0, 12))));
      const es = await page.evaluate('(' + llaves.toString() + ')()');
      const en = await page.evaluate(fn => {
        window.MISION_APLICAR_IDIOMA('en');
        const r = { llaves: (new Function('return (' + fn + ')()'))(), ops: document.getElementById('evalCritFormaSel').options.length, formas: _formasCritica(critApartados()) };
        window.MISION_APLICAR_IDIOMA('es');
        return r;
      }, llaves.toString());
      /* Los casos sin llave (un texto suelto) se comparan por posición:
         basta con que haya el mismo número. */
      const mismas = JSON.parse(es).every((ap, i) => ap.length === JSON.parse(en.llaves)[i].length && ap.every((k, j) => !/^[a-z]{2}-/.test(k) || k === JSON.parse(en.llaves)[i][j]));
      if (!mismas || en.formas !== 50 || en.ops !== 50) mal('en inglés la Forma 7 no lleva los mismos casos que en español, o no llega a la 50 (' + en.formas + ' formas)');
      else bien('en inglés la Forma 7 lleva los mismos casos que en español y también llega a la 50');
    }

    if (errores.length) errores.slice(0, 5).forEach(e => mal('error en la consola: ' + e.slice(0, 160)));
    else bien('sin errores en la consola');
    await ctx.close();
  }
  await nav.close();
  console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ La prueba de pensamiento crítico reparte sin repetir en la página, en ' + lista.length + ' misiones.') + '\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
