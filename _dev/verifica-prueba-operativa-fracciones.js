/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · ¿La Prueba Operativa de Fracciones pregunta lo que
   la misión enseña —y lo califica bien?
   ──────────────────────────────────────────────────────────────
   La prueba operativa traía cinco bloques de rellenar huecos y tres
   preguntaban casi lo mismo, mientras que media misión no salía por
   ninguna parte. Ahora recorre el tema entero: el dibujo de la parte
   pintada, clasificar y convertir, simplificar, operar, ordenar y un
   problema de la vida real.

   Esta sonda vigila lo que cuesta caro:

   1. Que estén las seis secciones y que sus puntajes sumen 100. Si no
      suman, el alumno saca una nota que no es la suya y llega así a la
      evidencia del maestro.
   2. Que EL DIBUJO DIGA LA VERDAD: que las partes pintadas y el total
      del SVG sean los de la clave. Un dibujo que pinta 3 de 4 con una
      clave que dice 2/4 le marca mal al que acertó, y en papel el
      maestro no tiene cómo notarlo.
   3. Que la fracción del dibujo sea IRREDUCIBLE. Si se pintaran 6 de 8,
      «6/8» y «3/4» serían las dos correctas y la pauta solo lleva una:
      media aula quedaría marcada mal en la hoja de papel.
   4. Que contestando bien TODO dé 100 y sin contestar dé 0, en las 30
      formas. Es la cuenta que acaba en el expediente del alumno.
   5. Que «escríbela como número mixto» pida de verdad un número mixto:
      7/4 vale lo mismo y no es la respuesta a lo que se preguntó.
   6. Que los problemas tengan respuesta posible (nada negativo ni más
      de un entero cuando se reparte un solo pastel).
   7. Que lo impreso lleve las seis secciones, los cuatro dibujos, su
      línea para responder y la pauta del maestro.

   Uso:  node _dev/servidor-estatico.js      (en otra terminal)
         node _dev/verifica-prueba-operativa-fracciones.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir } = require('./lib-navegador');

const URL = 'http://localhost:8123/misiones/2y3ciclo-fracciones/fracciones.html';
const FORMAS = 30;
const PINTA = '#1565c0';

let fallos = 0;
const mal = m => { fallos++; console.log('  ✘ ' + m); };
const bien = m => console.log('  ✔ ' + m);

/* El navegador lo abre `lib-navegador.js`: primero el que trae Playwright y
   solo si ese no arranca, uno puesto a mano. Esta función estaba COPIADA en
   seis sondas, y las copias ya se habían separado —tres nombres distintos de
   variable de entorno para lo mismo—. */
const lanzar = opciones => abrir(opciones);

/* Contesta la prueba que hay en pantalla con la clave de cada ítem. Vive en el
   navegador porque tiene que TOCAR los mismos controles que el alumno: si la
   casilla del dibujo no existiera, esto fallaría igual que le fallaría a él. */
const CONTESTAR = () => {
  const d = window._evalOpData;
  const poner = (sel, v) => { const el = document.querySelector(sel); if (el) el.value = v; return !!el; };
  let faltan = [];
  d.figs.forEach((it, i) => { if (!poner(`[data-fig="${i}"]`, it.ans)) faltan.push('fig' + i); });
  d.clasif.forEach((it, i) => {
    const r = document.querySelector(`input[name="fcls${i}"][value="${it.ans}"]`);
    if (r) r.checked = true; else faltan.push('cls' + i);
  });
  d.conv.forEach((it, i) => { if (!poner(`[data-conv="${i}"]`, it.ans)) faltan.push('conv' + i); });
  d.simp.forEach((it, i) => { if (!poner(`[data-simp="${i}"]`, it.ans)) faltan.push('simp' + i); });
  d.equiv.forEach((it, i) => { if (!poner(`[data-equiv="${i}"]`, it.ans)) faltan.push('equiv' + i); });
  d.ops.forEach((it, i) => { if (!poner(`[data-opx="${i}"]`, it.ans)) faltan.push('op' + i); });
  d.prob.forEach((it, i) => { if (!poner(`[data-prob="${i}"]`, it.ans)) faltan.push('prob' + i); });
  d.ord.forEach(g => { g.current = [...g.correctOrder]; });
  return faltan;
};
const NOTA = () => {
  const el = document.getElementById('evalOpAutoResult');
  const m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
  return m ? { nota: +m[1], base: +m[2] } : null;
};

(async () => {
  const browser = await lanzar();
  const page = await browser.newPage({ viewport: { width: 412, height: 900 } });
  page.on('pageerror', e => mal('la misión tropezó: ' + e.message));
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded' }).catch(() => null);
  if (!r || !r.ok()) {
    console.log('  ✘ no responde ' + URL + ' — ¿está corriendo node _dev/servidor-estatico.js?');
    await browser.close(); process.exit(1);
  }
  await page.waitForFunction(() => typeof window.genEvalOp === 'function');
  await page.evaluate(() => { window.go('s-evaluacion'); window.evalSwitchMode('op'); window.genEvalOp(); });

  console.log('\n1. Las seis secciones del tema, y sus puntajes suman 100');
  const secciones = await page.evaluate(() => [...document.querySelectorAll('#evalOpOut .eval-section-title')].map(t => ({
    ttl: t.childNodes[0].textContent.trim(),
    pts: parseInt((t.querySelector('.eval-pts') || {}).textContent || '0', 10)
  })));
  const ESPERADAS = ['¿Qué fracción está pintada?', 'Clasifica y convierte', 'Simplifica y completa la equivalente',
    'Suma y resta de fracciones', 'Ordena las fracciones', 'Problemas de la vida real'];
  if (secciones.length !== 6) mal(`la prueba tiene ${secciones.length} secciones y no 6`);
  ESPERADAS.forEach((e, i) => {
    if (!secciones[i] || secciones[i].ttl.indexOf(e) < 0) mal(`la sección ${i + 1} debería ser «${e}» y dice «${secciones[i] ? secciones[i].ttl : '—'}»`);
  });
  const suma = secciones.reduce((a, s) => a + s.pts, 0);
  if (suma !== 100) mal(`los puntajes de las secciones suman ${suma} y no 100`);
  else bien(`las seis secciones del tema, de 100 puntos: ${secciones.map(s => s.pts).join(' + ')}`);

  console.log('\n2. El dibujo dice la verdad (y su fracción es irreducible)');
  const mcd = (a, b) => { while (b) { const t = b; b = a % b; a = t; } return a; };
  let figsMal = 0, figsVistas = 0;
  for (let f = 1; f <= FORMAS; f++) {
    const figs = await page.evaluate(forma => {
      evalOpFormNum = forma; /* la Forma se fija en la variable, no en el <select>: genEvalOp
         reescribe el selector con evalOpFormNum antes de leerlo */
      window.genEvalOp();
      const svgs = [...document.querySelectorAll('#evalOpOut .opfig-draw svg')];
      return window._evalOpData.figs.map((it, i) => {
        const s = svgs[i];
        if (!s) return { it, error: 'sin dibujo' };
        if (it.tipo === 'recta') {
          const rayas = [...s.querySelectorAll('line')].filter(l => l.getAttribute('x1') === l.getAttribute('x2'));
          const punto = s.querySelector('circle');
          if (!punto || rayas.length < 2) return { it, error: 'la recta no tiene ni marcas ni punto' };
          const xs = rayas.map(l => parseFloat(l.getAttribute('x1'))).sort((a, b) => a - b);
          const paso = (xs[xs.length - 1] - xs[0]) / (xs.length - 1);
          return { it, partes: xs.length - 1, pintadas: Math.round((parseFloat(punto.getAttribute('cx')) - xs[0]) / paso) };
        }
        const piezas = [...s.querySelectorAll(it.tipo === 'circulo' ? 'path' : 'rect')];
        return { it, partes: piezas.length, pintadas: piezas.filter(p => (p.getAttribute('fill') || '').toLowerCase() === '#1565c0').length };
      });
    }, f);
    figs.forEach(({ it, partes, pintadas, error }) => {
      figsVistas++;
      const total = it.tipo === 'recta' ? it.d * it.enteros : it.d;
      if (error) { if (figsMal++ < 3) mal(`Forma ${f}: ${error}`); return; }
      if (partes !== total || pintadas !== it.n) {
        if (figsMal++ < 3) mal(`Forma ${f}: el dibujo enseña ${pintadas} de ${partes} y la clave dice ${it.n}/${it.d}`);
      } else if (mcd(it.n, it.d) !== 1) {
        if (figsMal++ < 3) mal(`Forma ${f}: el dibujo pinta ${it.n}/${it.d}, que se puede simplificar: en papel habría dos respuestas correctas y la pauta solo lleva una`);
      }
    });
  }
  if (!figsMal) bien(`los ${figsVistas} dibujos de las ${FORMAS} formas pintan exactamente la fracción de su clave, y ninguna se puede simplificar`);

  console.log('\n3. Contestando bien da 100 y en blanco da 0 (las 30 formas)');
  let peor = null, faltantes = null, cero = null;
  for (let f = 1; f <= FORMAS; f++) {
    const res = await page.evaluate(({ forma, contestar }) => {
      evalOpFormNum = forma;
      window.genEvalOp();
      window.gradeEvalOp();
      const vacio = (() => { const el = document.getElementById('evalOpAutoResult'); const m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/); return m ? +m[1] : null; })();
      const faltan = new Function('return (' + contestar + ')()')();
      window.gradeEvalOp();
      const el = document.getElementById('evalOpAutoResult');
      const m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
      return { vacio, faltan, lleno: m ? { nota: +m[1], base: +m[2] } : null };
    }, { forma: f, contestar: CONTESTAR.toString() });
    if (res.faltan && res.faltan.length && !faltantes) faltantes = { f, faltan: res.faltan };
    if (res.vacio !== 0 && cero === null) cero = { f, nota: res.vacio };
    if (!res.lleno) { mal(`Forma ${f}: el panel ya no dice «Resultado: N/100» — la nota no llegaría a la evidencia`); break; }
    if (res.lleno.nota !== 100 && (!peor || res.lleno.nota < peor.nota)) peor = { f, nota: res.lleno.nota, base: res.lleno.base };
  }
  if (faltantes) mal(`Forma ${faltantes.f}: no hay dónde contestar ${faltantes.faltan.join(', ')}`);
  if (cero) mal(`Forma ${cero.f}: una prueba en blanco da ${cero.nota} puntos y no 0`);
  if (peor) mal(`Forma ${peor.f}: contestando TODO bien la nota es ${peor.nota}/${peor.base} y no 100`);
  if (!faltantes && !cero && !peor) bien(`las ${FORMAS} formas dan 100/100 contestadas y 0/100 en blanco`);

  console.log('\n4. «Como número mixto» pide un número mixto de verdad');
  const mixto = await page.evaluate(() => ({
    bien: window.isMixtoCorrect('1 3/4', { e: 1, n: 3, d: 4 }),
    conY: window.isMixtoCorrect('1 y 3/4', { e: 1, n: 3, d: 4 }),
    impropia: window.isMixtoCorrect('7/4', { e: 1, n: 3, d: 4 }),
    pegado: window.isMixtoCorrect('13/4', { e: 1, n: 3, d: 4 }),
    otroValor: window.isMixtoCorrect('2 1/4', { e: 1, n: 3, d: 4 }),
    /* Y al revés: en una operación, «1 1/4» es una respuesta bien escrita
       para 5/4. Se lo acabamos de enseñar en la sección II. */
    enOperacion: window.isFracCorrect('1 1/4', '5/4'),
    enOperacionMal: window.isFracCorrect('1 1/4', '1/4')
  }));
  if (!mixto.bien || !mixto.conY) mal('«1 3/4» o «1 y 3/4» no se dan por buenas, y son como se escribe a mano');
  else if (mixto.impropia) mal('«7/4» pasa como número mixto: se preguntó justo lo contrario');
  else if (mixto.pegado) mal('«13/4» pegado pasa como «1 3/4»: eso son trece cuartos');
  else if (mixto.otroValor) mal('«2 1/4» pasa donde la respuesta es 1 3/4');
  else if (!mixto.enOperacion) mal('en una operación, «1 1/4» no se da por buena donde la respuesta es 5/4: es la misma cantidad y está bien escrita');
  else if (mixto.enOperacionMal) mal('«1 1/4» pasa por 1/4: se está leyendo solo la parte fraccionaria');
  else bien('acepta el mixto escrito a mano —también como respuesta de una operación— y rechaza la impropia, la pegada y la de otro valor');

  console.log('\n5. Los problemas tienen respuesta posible');
  const problemas = await page.evaluate(FORMAS => {
    const raros = [], vistos = new Set();
    for (let f = 1; f <= FORMAS; f++) {
      evalOpFormNum = f;
      window.genEvalOp();
      window._evalOpData.prob.forEach(p => {
        vistos.add(p.q.slice(0, 24));
        const m = p.ans.match(/^(\d+)(?:\/(\d+))?$/);
        if (!m) { raros.push(`Forma ${f}: la clave «${p.ans}» no es una fracción`); return; }
        const v = +m[1] / (m[2] ? +m[2] : 1);
        if (!(v > 0) || v > 1) raros.push(`Forma ${f}: «${p.q.slice(0, 40)}…» da ${p.ans}, que no cabe en un entero`);
      });
      if (window._evalOpData.prob.length !== 3) raros.push(`Forma ${f}: salieron ${window._evalOpData.prob.length} problemas y no 3`);
    }
    return { raros, distintos: vistos.size };
  }, FORMAS);
  if (problemas.raros.length) problemas.raros.slice(0, 3).forEach(mal);
  else bien(`los 90 problemas de las ${FORMAS} formas se pueden resolver, con ${problemas.distintos} enunciados distintos`);

  console.log('\n6. La misma Forma vuelve a salir igual');
  const igual = await page.evaluate(() => {
    const foto = () => { evalOpFormNum = 7; window.genEvalOp(); return JSON.stringify(window._evalOpData); };
    const a = foto();
    evalOpFormNum = 19; window.genEvalOp();
    return a === foto();
  });
  igual ? bien('la Forma 7 sale idéntica cada vez que se pide') : mal('la Forma 7 cambia entre una generación y otra: dos alumnos con la misma forma tendrían pruebas distintas');

  console.log('\n7. La hoja impresa lleva las seis secciones, los dibujos y la pauta');
  const impreso = await page.evaluate(() => {
    const docs = []; const orig = window.open;
    window.open = () => ({ document: { write: t => docs.push(t), close() { } }, print() { }, focus() { } });
    try { evalOpFormNum = 3; window.genEvalOp(); window.printEvalOp(); } finally { window.open = orig; }
    return docs[0] || '';
  });
  const romanos = ['I. ¿Qué fracción está pintada?', 'II. Clasifica y convierte', 'III. Simplifica y completa la equivalente',
    'IV. Suma y resta de fracciones', 'V. Ordena las fracciones', 'VI. Problemas de la vida real'];
  const faltanSec = romanos.filter(t => impreso.indexOf(t) < 0);
  if (faltanSec.length) mal('la hoja impresa no trae: ' + faltanSec.join(' · '));
  const svgs = (impreso.match(/<svg /g) || []).length;
  if (svgs !== 4) mal(`la hoja impresa lleva ${svgs} dibujos y no 4: sin el dibujo la pregunta no se puede contestar en papel`);
  const lineas = (impreso.match(/class="fig-ln"/g) || []).length;
  if (lineas !== 4) mal(`los dibujos impresos llevan ${lineas} líneas para responder y no 4`);
  if (impreso.indexOf('PAUTA') < 0) mal('la hoja impresa se va sin la pauta del maestro');
  if (impreso.indexOf('page-break-before:always') < 0) mal('la pauta no arranca en hoja aparte: se le entregaría al alumno con las respuestas');
  /* El relleno del dibujo va en el SVG y no en un fondo de CSS: el navegador
     imprime «sin gráficos de fondo» de fábrica, y la parte pintada —que es la
     pregunta entera— saldría en blanco. */
  if (impreso.indexOf('fill="#1565c0"') < 0) mal('los dibujos impresos no llevan su relleno dentro del SVG: la parte pintada saldría en blanco');
  const pleca = (impreso.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').match(/\d+\/\d+/g) || []);
  if (pleca.length) mal(`la hoja impresa deja fracciones con pleca: ${pleca.slice(0, 4).join(', ')}`);
  if (!faltanSec.length && svgs === 4 && lineas === 4 && !pleca.length && impreso.indexOf('PAUTA') >= 0) bien('la hoja impresa trae las seis secciones, sus cuatro dibujos con su línea y la pauta en hoja aparte');

  await browser.close();
  console.log(fallos === 0
    ? '\n✅ La Prueba Operativa pregunta lo que la misión enseña, y la nota que da es la que es.'
    : `\n❌ ${fallos} problema(s).`);
  process.exit(fallos === 0 ? 0 : 1);
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
