/* ============================================================
   M.E.T.A.S · Sonda de las misiones Prueba de Fin de Grado
   ------------------------------------------------------------
   Vigila lo que cuesta caro en esta misión:
   - que la página cargue SIN errores de consola y con sus 18 pestañas;
   - que las DOS pruebas conceptuales existan de verdad (Matemáticas y
     Español), cada una con 20 ítems y CALIFICABLE en línea;
   - que al imprimir, cada prueba salga con EL COLOR DE SU MATERIA
     (azul #1565c0 la de mate, dorado #c49000 la de español): el maestro
     distingue el examen por el color sin leerlo;
   - que el impreso NO traiga el encogedor a una página (esta misión está
     exceptuada a propósito: abarca el temario del año entero) pero SÍ la
     pauta en página aparte y la orden de rellenar el círculo (nunca ✗);
   - que la prueba operativa se genere y califique;
   - que el catálogo estrene la materia Repaso General: chip con conteo,
     filtro que deja solo las de esta materia, y 61 misiones en Todas.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-fin-de-grado.js
   ============================================================ */
'use strict';
const { chromium } = require('playwright');
const BASE = 'http://localhost:8123';

/* Los grados de la serie. Al estrenar uno nuevo se añade su línea y la
   sonda lo revisa entero, sin tocar nada más. `esp` son palabras que TIENEN
   que aparecer en su prueba de Español: es lo que distingue una prueba de
   verdad de una copia de la de otro grado. */
const GRADOS = [
  { slug: '6to', grado: '6º', tabs: 18, lab: '#widget-fraccion-lab', esp: ['pino', 'colibrí', 'feria'] },
  { slug: '4to', grado: '4º', tabs: 18, lab: '#widget-fraccion-lab', esp: ['tortuga', 'abuela', 'conejo', 'bosque', 'río'] },
  { slug: '5to', grado: '5º', tabs: 18, lab: '#widget-fraccion-lab', esp: ['montaña', 'ganso', 'león', 'ruinas', 'hueso', 'carta', 'anuncio'] },
  { slug: '7mo', grado: '7º', tabs: 18, lab: '#widget-recta-enteros', esp: ['cuento', 'diálogo', 'expresión', 'mensaje', 'personaje', 'comentario'] },
];

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + extra));
  if (!cond) fallos++;
};

// El Chromium propio de Playwright, y si no está (entornos con el navegador
// preinstalado en otra versión), el que apunte CHROMIUM_BIN.
async function lanzar() {
  try { return await chromium.launch(); }
  catch (e) {
    const bin = process.env.CHROMIUM_BIN || '/opt/pw-browsers/chromium';
    return await chromium.launch({ executablePath: bin });
  }
}

(async () => {
  const browser = await lanzar();
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } }); // teléfono, que es el aparato real
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  // Los recursos externos (fuentes, Font Awesome) pueden no cargar en entornos
  // sin salida a internet; eso NO es un fallo de la misión. Lo que sí lo es:
  // cualquier error de JavaScript.
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errores.push(m.text()); });

  for (const G of GRADOS) {
  console.log(`\n══ Prueba de Fin de Grado: ${G.grado} ══`);
  errores.length = 0;
  console.log('La misión abre y respira');
  await page.goto(`${BASE}/misiones/fin-de-grado-${G.slug}/fin-de-grado-${G.slug}.html`, { waitUntil: 'networkidle' });
  ok('sin errores de JavaScript al cargar', errores.length === 0, errores[0]);
  ok(`${G.tabs} pestañas de navegación`, await page.locator('.nav-t').count() === G.tabs);
  ok('el héroe anuncia la Ruta de la Meta', (await page.locator('.badge').innerText()).includes('Ruta de la Meta'));

  console.log('Los juegos responden');
  await page.evaluate(() => go('s-quiz'));
  ok('el quiz pinta 4 opciones', await page.locator('.qz-opt').count() === 4);
  ok('el cuento del repaso trae sus 4 preguntas', await page.locator('#textoLargoWrap .mini-quiz-wrap').count() === 4);
  await page.evaluate(() => go('s-lab'));
  ok('el primer laboratorio se dibuja', await page.locator(G.lab + ' svg path').count() > 0, G.lab);
  ok('el segundo laboratorio se pinta', (await page.locator('#s-lab .card:nth-child(2) > div').innerText()).length > 20);
  await page.evaluate(() => go('s-sopa'));
  await page.waitForTimeout(150);
  ok('la sopa arma su grid de 100 celdas', await page.locator('#sopaGrid .sopa-cell').count() === 100);

  console.log('La evaluación conceptual de Matemáticas');
  await page.evaluate(() => go('s-evaluacion'));
  ok('arranca en Matemáticas', (await page.locator('#eval-screen-title').innerText()).includes('Matemáticas'));
  const items = await page.locator('#evalOut .eval-auto-item').count();
  ok('20 ítems en pantalla (5+5+5 y pareados en una tarjeta)', items === 16); // 5 cp + 5 tf + 5 mc + 1 tarjeta de pareados
  await page.evaluate(() => gradeEval());
  ok('se puede calificar en línea (Resultado: N/100 pts)', /Resultado: \d+\/100 pts/.test(await page.locator('#evalAutoResult').innerText()));

  console.log('El impreso de Matemáticas sale AZUL y sin encogedor');
  let docMat = '';
  await page.evaluate(() => { window.open = function () { return { document: { write: d => { window.__doc = d; }, close: () => {} }, print: () => {} }; }; });
  await page.evaluate(() => printEval());
  docMat = await page.evaluate(() => window.__doc || '');
  ok('acento azul de Matemáticas (#1565c0)', docMat.includes('#1565c0'));
  ok('sin rastro del dorado de Español', !docMat.includes('#c49000'));
  ok('la pauta arranca en página aparte', docMat.includes('page-break-before:always'));
  ok('SIN el encogedor a una página (excepción pedida)', !docMat.includes('el.style.zoom'));
  ok('pide RELLENAR EL CÍRCULO, nunca la ✗', docMat.includes('Rellena el círculo') && !/marca con(?: una)? ✗/i.test(docMat));
  ok('clave ZipGrade presente', docMat.includes('ZipGrade'));

  console.log('La prueba de Español es OTRA prueba y sale DORADA');
  await page.evaluate(() => evalSwitchMode('esp'));
  ok('el título cambia a Español', (await page.locator('#eval-screen-title').innerText()).includes('Español'));
  const textoEsp = await page.locator('#evalOut').innerText();
  ok('trae mini-textos de lectura propios del grado', G.esp.some(w => textoEsp.includes(w)), textoEsp.slice(0, 90));
  await page.evaluate(() => gradeEval());
  ok('también se califica en línea', /Resultado: \d+\/100 pts/.test(await page.locator('#evalAutoResult').innerText()));
  await page.evaluate(() => printEval());
  const docEsp = await page.evaluate(() => window.__doc || '');
  ok('acento dorado de Español (#c49000)', docEsp.includes('#c49000'));
  ok('sin rastro del azul de mate', !docEsp.includes('#1565c0'));

  console.log('La prueba operativa');
  await page.evaluate(() => evalSwitchMode('op'));
  ok('genera sus 19 ítems de cálculo', await page.locator('#evalOpOut .eval-auto-item').count() === 19); // 5+5+5+3+1
  await page.evaluate(() => gradeEvalOp());
  ok('se califica en línea', /Resultado: \d+\/100 pts/.test(await page.locator('#evalOpAutoResult').innerText()));

  console.log('Las fracciones se escriben apiladas, y el examen sigue cabiendo en una hoja');
  const apiladas = await page.evaluate(() => document.querySelectorAll('.fr').length);
  ok('en pantalla las fracciones van con la raya en medio', apiladas > 0, apiladas);
  /* La fracción apilada engorda el renglón. Si se pasa del alto de la hoja,
     el examen de Matemáticas salta a DOS hojas: 43 hojas de más por grado,
     y el maestro lo descubre con la fotocopiadora andando. Se miden LAS 20
     FORMAS porque cada una trae enunciados de distinto largo. */
  const MM = 96 / 25.4, UTIL = 261.4;      // carta menos los márgenes del @page
  const medidor = await browser.newPage({ viewport: { width: Math.round((215.9 - 20) * MM), height: 1200 } });
  await medidor.emulateMedia({ media: 'print' });
  await page.evaluate(() => { window.open = function () { return { document: { write: d => { window.__doc = d; }, close: () => { } }, print: () => { } }; }; });
  const altos = { 'Matemáticas': [], 'operativa': [] };
  for (let f = 1; f <= 20; f++) {
    await page.evaluate(n => { evalSwitchMode('mat'); document.getElementById('evalFormaSel').value = String(n); genEval(); printEval(); }, f);
    await medidor.setContent(await page.evaluate(() => window.__doc), { waitUntil: 'load' });
    altos['Matemáticas'].push(await medidor.evaluate(mm => document.getElementById('evalPage').getBoundingClientRect().height / mm, MM));
    await page.evaluate(n => { evalSwitchMode('op'); document.getElementById('evalOpFormaSel').value = String(n); genEvalOp(); printEvalOp(); }, f);
    await medidor.setContent(await page.evaluate(() => window.__doc), { waitUntil: 'load' });
    altos['operativa'].push(await medidor.evaluate(mm => document.getElementById('evalPage').getBoundingClientRect().height / mm, MM));
  }
  await medidor.close();
  Object.entries(altos).forEach(([nombre, v]) => {
    const peor = Math.max(...v), forma = v.indexOf(peor) + 1;
    ok(`las 20 formas de ${nombre} caben en una hoja`, peor <= UTIL, `la forma ${forma} mide ${peor.toFixed(1)} mm y el papel deja ${UTIL}`);
  });
  await page.reload({ waitUntil: 'networkidle' });

  console.log('Nada de guiones largos a la vista del alumno');
  const cuerpo = await page.evaluate(() => document.body.innerText);
  ok('ni un guion largo en la pantalla de la misión', !cuerpo.includes('—'));
  }

  console.log('\n══ El catálogo ══');
  const errores2 = [];
  const page2 = await browser.newPage({ viewport: { width: 412, height: 915 } });
  page2.on('pageerror', e => errores2.push(String(e)));
  await page2.goto(BASE + '/index.html?view=misiones', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(300);
  ok('la portada carga sin errores', errores2.length === 0, errores2[0]);
  ok('el filtro Todas cuenta 61 misiones', (await page2.locator('.pill-all .pill-count').innerText()).trim() === '61');
  const pillRep = page2.locator('.pill.rep');
  ok('el chip Repaso General existe y cuenta 4', (await pillRep.locator('.pill-count').innerText()).trim() === '4');
  await pillRep.click();
  await page2.waitForTimeout(300);
  const tarjetas = await page2.locator('#missions-container .mission-card').count();
  ok('el filtro deja solo las misiones de Fin de Grado', tarjetas === 4);
  const rotulos = await page2.locator('#missions-container').innerText();
  GRADOS.forEach(G => ok(`la tarjeta de ${G.grado} está en el catálogo`, rotulos.includes(`Prueba de Fin de Grado: ${G.grado} Grado`)));

  await browser.close();
  console.log(fallos === 0 ? `\n✅ Las ${GRADOS.length} misiones de Fin de Grado están listas.` : `\n❌ ${fallos} fallo(s).`);
  process.exit(fallos === 0 ? 0 : 1);
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
