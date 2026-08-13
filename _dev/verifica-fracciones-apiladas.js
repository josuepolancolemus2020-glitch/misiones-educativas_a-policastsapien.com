/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · ¿La misión de Fracciones escribe las fracciones
   como en el cuaderno?
   ──────────────────────────────────────────────────────────────
   En el pizarrón una fracción se escribe con el numerador ARRIBA,
   la raya en medio y el denominador ABAJO. La misión las venía
   pintando «3/4», que es como se teclean, no como se leen: el
   alumno que está aprendiendo a leerlas tenía que traducir.

   Esta sonda recorre las catorce pantallas de la misión y vigila
   las tres cosas que cuestan caro:

   1. Que NO quede ninguna fracción con pleca a la vista. Se mira
      el texto pintado, pantalla por pantalla.
   2. Que apilar no rompa lo que se mueve o se compara por su
      texto. Con la fracción apilada, el textContent de «3/4» se
      lee «34»: la ficha llegaría rota a su columna del clasificar
      y el botón correcto del widget no se marcaría nunca. Por eso
      el texto de verdad viaja en dataset.txt.
   3. Que la NOTA siga siendo legible. El registro del maestro saca
      la nota del panel de resultado buscando «Resultado: 85/100» en
      el texto de la pantalla (js/metas-registro.js). Apilada, ese
      «85/100» se leería «85100» y la nota del alumno no llegaría a
      su evidencia. Ese panel —y solo ese— se queda con la barra.

   Uso:  node _dev/servidor-estatico.js      (en otra terminal)
         node _dev/verifica-fracciones-apiladas.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');

const URL = 'http://localhost:8123/misiones/2y3ciclo-fracciones/fracciones.html';
// Las catorce puertas de la misión, en el orden en que las abre el alumno
const SECCIONES = ['s-aprende', 's-estructura', 's-flash', 's-quiz', 's-clasifica',
  's-identifica', 's-completa', 's-widgets', 's-lab', 's-reto', 's-tareas',
  's-sopa', 's-evaluacion', 's-recursos'];

/* Dentro de esta misión, una barra entre dos números se lee como una fracción
   —es justo lo que la misión enseña—, así que NINGÚN marcador la usa: los
   aciertos se cuentan «5 de 8». Las únicas barras que quedan a la vista son
   el contador de las flashcards («3 / 14», con espacios) y el panel de la
   nota, que el registro del maestro lee con barra y por eso se exceptúa
   abajo. El ejemplo del recuadro donde el alumno TECLEA («ej. 3/4») no
   cuenta: vive en un atributo, no en el texto de la pantalla. */
const PLECA = /(?<!\d\s)\b\d+\/\d+/;

let fallos = 0;
const mal = m => { fallos++; console.log('  ✘ ' + m); };
const bien = m => console.log('  ✔ ' + m);

async function lanzar() {
  try { return await chromium.launch(); }
  catch (e) { return await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || '/opt/pw-browsers/chromium' }); }
}

(async () => {
  const browser = await lanzar();
  const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
  page.on('pageerror', e => mal('la misión tropezó: ' + e.message));
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded' }).catch(() => null);
  if (!r || !r.ok()) {
    console.log('  ✘ no responde ' + URL + ' — ¿está corriendo node _dev/servidor-estatico.js?');
    await browser.close(); process.exit(1);
  }
  await page.waitForFunction(() => typeof window.go === 'function');

  console.log('\n1. Ninguna fracción con pleca a la vista');
  for (const sec of SECCIONES) {
    await page.evaluate(s => window.go(s), sec);
    // Los generadores se disparan a mano: sin ellos la pantalla está vacía
    if (sec === 's-tareas') await page.evaluate(() => window.genTask());
    if (sec === 's-evaluacion') await page.evaluate(() => { window.genEval(); window.evalSwitchMode('op'); window.genEvalOp(); window.evalSwitchMode('concept'); });
    /* El reto no enseña ninguna fracción hasta que arranca el cronómetro, y
       las tres tandas no clasifican lo mismo: la segunda es «equivalente a
       1/2», que va escrito en los botones. */
    if (sec === 's-reto') await page.evaluate(async () => {
      for (let i = 0; i < 3; i++) { window.startReto(); window.endReto(); window.nextRetoPair(); }
      window.startReto();
    });
    /* El laboratorio guarda sus fracciones detrás de los botones: cuatro
       clases de fracción por cinco aspectos, y la pantalla empieza en el
       aspecto que menos números tiene. */
    if (sec === 's-lab') await page.evaluate(() => {
      ['propia', 'impropia', 'mixta', 'equivalente'].forEach(p => {
        window.labShowParte(p);
        ['definicion', 'ejemplo', 'grafica', 'regla'].forEach(a => window.labShowAspecto(a));
      });
      window.labShowParte('propia'); window.labShowAspecto('ejemplo');
    });
    const restos = await page.evaluate(id => {
      const sec = document.getElementById(id);
      const fuera = [];
      const w = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, null, false);
      let n;
      while ((n = w.nextNode())) {
        const t = n.nodeValue;
        if (!/\d\/\d/.test(t)) continue;
        // el panel de la nota lleva la barra a propósito
        if (n.parentElement.closest('.eval-auto-result')) continue;
        fuera.push(t.trim().slice(0, 70));
      }
      return fuera;
    }, sec);
    const sucios = restos.filter(t => PLECA.test(t));
    if (sucios.length) mal(`${sec}: quedan fracciones con pleca → ${sucios.slice(0, 3).join(' | ')}`);
  }
  if (!fallos) bien('las catorce pantallas pintan la fracción apilada');

  console.log('\n2. Se escribe apilada de verdad (numerador sobre denominador)');
  const apiladas = await page.evaluate(() => {
    const uno = document.querySelector('.fr');
    if (!uno) return null;
    const nu = uno.children[0], de = uno.children[1];
    return { n: nu.textContent, d: de.textContent, raya: getComputedStyle(de).borderTopWidth, total: document.querySelectorAll('.fr').length };
  });
  if (!apiladas) mal('no hay ni una fracción apilada en la página');
  else if (parseFloat(apiladas.raya) <= 0) mal('la fracción no lleva raya entre numerador y denominador');
  else bien(`${apiladas.total} fracciones apiladas, con su raya (la primera: ${apiladas.n} sobre ${apiladas.d})`);

  console.log('\n3. Mover una fracción no la convierte en un número de dos cifras');
  await page.evaluate(() => window.go('s-clasifica'));
  const arrastre = await page.evaluate(() => {
    const ficha = document.querySelector('#clsBank .wb-item');
    const txt = ficha.dataset.txt;
    ficha.click();
    document.getElementById('col-left').click();
    const puesta = document.querySelector('#items-left .drop-item');
    return { antes: txt, despues: puesta ? puesta.dataset.txt : null, pintado: puesta ? puesta.innerHTML : '' };
  });
  if (arrastre.antes !== arrastre.despues) mal(`la ficha «${arrastre.antes}» llegó a la columna como «${arrastre.despues}»`);
  else if (/\d\/\d/.test(arrastre.pintado.replace(/<[^>]*>/g, ''))) mal('la ficha de la columna se pintó con pleca');
  else bien(`la ficha «${arrastre.antes}» llega entera a su columna`);

  console.log('\n4. El botón correcto se sigue marcando');
  await page.evaluate(() => window.go('s-widgets'));
  const marcado = await page.evaluate(() => {
    const d = window.neuronPartes ? null : null; // los datos son locales: se usa la pantalla
    const btns = [...document.querySelectorAll('#neuronOpts .cmp-opt')];
    const bueno = btns.find(b => b.dataset.txt);
    if (!bueno) return { ok: false, por: 'los botones no guardan su texto en dataset.txt' };
    bueno.click();
    const marcados = [...document.querySelectorAll('#neuronOpts .cmp-opt')].filter(b => b.classList.contains('correct'));
    return { ok: marcados.length === 1, por: `se marcaron ${marcados.length} botones como correctos` };
  });
  marcado.ok ? bien('el widget marca UN botón como correcto') : mal(marcado.por);

  console.log('\n5. La nota sigue llegando al registro del maestro');
  await page.evaluate(() => { window.go('s-evaluacion'); window.genEval(); window.gradeEval(); });
  const nota = await page.evaluate(() => {
    const el = document.getElementById('evalAutoResult');
    const m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
    return m ? { nota: +m[1], base: +m[2] } : null;
  });
  if (!nota) mal('el panel de resultado ya no dice «Resultado: N/100»: la nota no llegaría a la evidencia');
  else bien(`el panel dice ${nota.nota}/${nota.base} y el registro lo lee`);

  await page.evaluate(() => { window.evalSwitchMode('op'); window.genEvalOp(); window.gradeEvalOp(); });
  const notaOp = await page.evaluate(() => {
    const el = document.getElementById('evalOpAutoResult');
    const m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
    return m ? { nota: +m[1], base: +m[2] } : null;
  });
  if (!notaOp) mal('la prueba operativa ya no dice «Resultado: N/100»');
  else bien(`la prueba operativa dice ${notaOp.nota}/${notaOp.base}`);

  console.log('\n6. Lo impreso se lleva la fracción apilada');
  const impreso = await page.evaluate(() => {
    const abiertas = [];
    const orig = window.open;
    window.open = function () {
      const falsa = { document: { write: t => abiertas.push(t), close: () => {} }, print: () => {}, focus: () => {} };
      return falsa;
    };
    try { window.genEval(); window.printEval(); window.genEvalOp(); window.printEvalOp(); } finally { window.open = orig; }
    return abiertas.map(h => ({
      apiladas: (h.match(/class="fr"/g) || []).length,
      css: h.indexOf('.fr>b.fd') >= 0,
      /* Lo que ve el alumno es el texto: fuera van las etiquetas y también el
         contenido de <style> y <script> —ahí hay divisiones de verdad, como el
         96/25.4 que pasa milímetros a píxeles, y no son fracciones de nadie. */
      pleca: (h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ')
        .match(/\d+\/\d+/g) || [])
    }));
  });
  if (impreso.length < 2) mal('no se generaron los dos documentos impresos');
  impreso.forEach((doc, i) => {
    const cual = i === 0 ? 'la evaluación conceptual' : 'la prueba operativa';
    if (!doc.css) mal(`${cual} impresa se va sin el estilo de la fracción: saldría en dos renglones`);
    else if (!doc.apiladas) mal(`${cual} impresa no lleva ninguna fracción apilada`);
    else if (doc.pleca.length) mal(`${cual} impresa deja fracciones con pleca: ${doc.pleca.slice(0, 4).join(', ')}`);
    else bien(`${cual} impresa: ${doc.apiladas} fracciones apiladas y su estilo`);
  });

  console.log('\n7. El examen impreso no se encogió para caber');
  /* La fracción apilada engorda el renglón: son dos pisos donde había uno. El
     documento impreso se ajusta solo (fit() busca el zoom más grande con el
     que cabe), así que el problema no se ve como una hoja de más: se ve como
     un examen encogido que el alumno lee en el pupitre con lupa. Cuando se
     apilaron las fracciones, la prueba operativa cayó de 1.04 a 0.86; se
     recuperó QUITANDO AIRE —rellenos y márgenes—, nunca tamaño de letra.
     Se miden las 30 formas: no todas pesan igual. */
  const MINZOOM = 0.93;
  const zooms = await page.evaluate(async () => {
    const out = [];
    const orig = window.open;
    const docs = [];
    window.open = () => ({ document: { write: t => docs.push(t), close() {} }, print() {}, focus() {} });
    try {
      for (let f = 1; f <= 30; f++) {
        document.getElementById('evalFormaSel').value = String(f);
        window.genEval(); window.printEval();
        document.getElementById('evalOpFormaSel').value = String(f);
        window.genEvalOp(); window.printEvalOp();
        out.push({ forma: f, docs: docs.splice(0, 2) });
      }
    } finally { window.open = orig; }
    return out;
  });
  const medida = await browser.newPage({ viewport: { width: 794, height: 1000 } });
  let peor = { z: 9, forma: 0, cual: '' };
  for (const { forma, docs } of zooms) {
    for (let i = 0; i < docs.length; i++) {
      await medida.setContent(docs[i], { waitUntil: 'load' });
      await medida.emulateMedia({ media: 'print' });
      const z = await medida.evaluate(() => {
        const e = document.getElementById('evalPage');
        return e ? parseFloat(e.style.zoom || 1) : 1;
      });
      if (z < peor.z) peor = { z: +z.toFixed(3), forma, cual: i === 0 ? 'conceptual' : 'operativa' };
    }
  }
  await medida.close();
  if (peor.z < MINZOOM) mal(`la prueba ${peor.cual} de la Forma ${peor.forma} se encoge al ${Math.round(peor.z * 100)} % para caber en la hoja (mínimo ${Math.round(MINZOOM * 100)} %): quítale aire, no tamaño de letra`);
  else bien(`las 30 formas de las dos pruebas caben sin encogerse (la más apretada, la ${peor.cual} de la Forma ${peor.forma}, al ${Math.round(peor.z * 100)} %)`);

  await browser.close();
  console.log(fallos === 0
    ? '\n✅ La misión escribe las fracciones como el maestro las dibuja en el pizarrón.'
    : `\n❌ ${fallos} problema(s).`);
  process.exit(fallos === 0 ? 0 : 1);
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
