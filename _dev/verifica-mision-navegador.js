#!/usr/bin/env node
/* Abre una misión en un navegador de verdad y comprueba lo que un validador
   de texto no puede: que no reviente en la consola, que los widgets se
   pinten, que la evaluación se genere y que el panel de nota diga lo que el
   registro del maestro necesita leer.

   Antes:  node _dev/servidor-estatico.js   (en otra terminal)
   Uso:    node _dev/verifica-mision-navegador.js misiones/<carpeta>/<archivo>.html  */
const { chromium } = require('playwright');

const ruta = process.argv[2];
if (!ruta) { console.error('Uso: node _dev/verifica-mision-navegador.js misiones/<carpeta>/<archivo>.html'); process.exit(2); }
const BASE = process.env.METAS_BASE || 'http://localhost:8080';

(async () => {
  let fallos = 0;
  const mal = m => { console.log('  ❌ ' + m); fallos++; };
  const ojo = m => { console.log('  ⚠️  ' + m); };
  const bien = m => console.log('  ✅ ' + m);

  /* En algunos entornos el Chromium instalado no es el que espera la versión
     de Playwright del día. METAS_CHROMIUM permite apuntarlo a mano. */
  const exe = process.env.METAS_CHROMIUM;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|font|cdnjs|fonts\.googleapis|Failed to load resource/.test(m.text())) errores.push(m.text()); });
  /* Los recursos EXTERNOS (fuentes, iconos) fallan en cualquier aula sin
     internet y la misión tiene que funcionar igual: solo se miran los del
     propio sitio. */
  const rotos = [];
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE)) rotos.push(r.status() + ' ' + r.url().replace(BASE, '')); });
  page.on('requestfailed', r => { if (r.url().startsWith(BASE)) rotos.push('sin respuesta ' + r.url().replace(BASE, '')); });

  await page.goto(`${BASE}/${ruta}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  console.log('\n🌐 Carga de la misión');
  if (errores.length) errores.slice(0, 6).forEach(e => mal('error en consola: ' + e.slice(0, 160)));
  else bien('carga sin errores de consola');
  if (rotos.length) [...new Set(rotos)].forEach(r => mal('recurso propio que no carga: ' + r));
  else bien('todos los archivos del sitio cargan');

  console.log('\n🎮 Widgets pintados');
  const vacios = await page.evaluate(() =>
    [...document.querySelectorAll('[id^="widget-"]')].filter(d => d.children.length === 0).map(d => d.id));
  const total = await page.evaluate(() => document.querySelectorAll('[id^="widget-"]').length);
  if (vacios.length) vacios.forEach(v => mal('el widget ' + v + ' se quedó vacío'));
  else bien(total + ' widgets pintados');

  console.log('\n🃏 Flashcards, quiz y memorama');
  await page.evaluate(() => go('s-flash'));
  await page.waitForTimeout(300);
  const fc = await page.textContent('#fcW');
  if (!fc || !fc.trim()) mal('la primera flashcard salió vacía'); else bien('flashcard 1: ' + fc.trim().slice(0, 40));
  const memo = await page.evaluate(() => document.querySelectorAll('#memoGrid .memo-card, #memoGrid button').length);
  if (memo < 12) mal('el memorama pintó ' + memo + ' cartas (se esperan 12)'); else bien('memorama con ' + memo + ' cartas');
  await page.evaluate(() => go('s-quiz'));
  await page.waitForTimeout(300);
  const qz = await page.textContent('#qzQ');
  if (!qz || !qz.trim()) mal('el quiz no pintó la pregunta'); else bien('quiz: ' + qz.trim().slice(0, 45));

  console.log('\n🔤 Sopa de letras');
  await page.evaluate(() => go('s-sopa'));
  await page.waitForTimeout(400);
  const celdas = await page.evaluate(() => document.querySelectorAll('#sopaGrid .sopa-cell, #sopaGrid div').length);
  if (celdas < 100) mal('la sopa pintó ' + celdas + ' celdas (se esperan 100)'); else bien('sopa de ' + celdas + ' celdas');

  console.log('\n📝 Evaluación conceptual');
  await page.evaluate(() => go('s-evaluacion'));
  await page.waitForTimeout(200);
  await page.evaluate(() => genEval());
  await page.waitForTimeout(500);
  const items = await page.evaluate(() => document.querySelectorAll('#evalOut .eval-item').length);
  if (items < 15) mal('la evaluación generó ' + items + ' ítems'); else bien(items + ' ítems generados');
  await page.evaluate(() => gradeEval());
  await page.waitForTimeout(300);
  const nota = await page.textContent('#evalAutoResult');
  if (!/Resultado: \d+\/100 pts/.test(nota || '')) mal('el panel no dice «Resultado: N/100 pts»: ' + (nota || '').slice(0, 80));
  else bien('califica y anuncia: ' + nota.trim().split('\n')[0].slice(0, 50));

  console.log('\n📐 Prueba operativa');
  await page.evaluate(() => evalSwitchMode('op'));
  await page.evaluate(() => genEvalOp());
  await page.waitForTimeout(500);
  const opItems = await page.evaluate(() => document.querySelectorAll('#evalOpOut .eval-item').length);
  if (opItems < 15) mal('la prueba operativa generó ' + opItems + ' ítems'); else bien(opItems + ' ítems generados');
  await page.evaluate(() => gradeEvalOp());
  await page.waitForTimeout(300);
  const notaOp = await page.textContent('#evalOpAutoResult');
  if (!/Resultado: \d+\/100 pts/.test(notaOp || '')) mal('el panel operativo no dice «Resultado: N/100 pts»');
  else bien('operativa calificada');

  console.log('\n🔁 Determinismo de las formas');
  const f1 = await page.evaluate(() => { evalFormNum = 7; genEval(); return document.getElementById('evalOut').textContent; });
  const f2 = await page.evaluate(() => { evalFormNum = 7; genEval(); return document.getElementById('evalOut').textContent; });
  if (f1 !== f2) mal('la Forma 7 salió distinta dos veces: la pauta que el maestro guardó no serviría');
  else bien('la Forma 7 sale igual las dos veces');
  const f3 = await page.evaluate(() => { evalFormNum = 8; genEval(); return document.getElementById('evalOut').textContent; });
  if (f1 === f3) mal('la Forma 8 salió idéntica a la 7');
  else bien('formas distintas dan exámenes distintos');

  // ── Impresión: la normativa manda 2 hojas carta, ni una más ────────────
  console.log('\n🖨️  Impresión de la evaluación (2 hojas exactas)');
  const fs = require('fs');
  const os = require('os');
  const pathmod = require('path');
  /* La normativa de las 2 hojas es de printEval (la conceptual). La operativa
     de las misiones publicadas sale hoy en 3 (una hoja más de examen), así que
     aquí se avisa en vez de fallar: si algún día se ajusta el motor, este
     aviso se convierte en fallo. */
  for (const [fn, etiqueta, duro] of [['printEval', 'conceptual', true], ['printEvalOp', 'operativa', false]]) {
    const doc = await page.evaluate((f) => {
      let capturado = '';
      const real = window.open;
      window.open = () => ({
        document: { write: h => { capturado = h; }, close: () => {} },
        print: () => {}, focus: () => {}, close: () => {}
      });
      try { window[f](); } finally { window.open = real; }
      return capturado;
    }, fn);
    if (!doc) { mal('la ' + etiqueta + ' no generó documento imprimible'); continue; }
    const hoja = await browser.newPage();
    await hoja.setContent(doc, { waitUntil: 'networkidle' });
    await hoja.waitForTimeout(900);   // el auto-ajuste de escala necesita medir
    const pdf = pathmod.join(os.tmpdir(), 'metas-' + fn + '.pdf');
    await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
    await hoja.close();
    const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    if (paginas !== 2 && duro) mal(`la ${etiqueta} sale en ${paginas} hojas: tienen que ser 2 (examen + pauta)`);
    else if (paginas !== 2) ojo(`la ${etiqueta} sale en ${paginas} hojas (las misiones publicadas hacen lo mismo)`);
    else bien(`la ${etiqueta} sale en 2 hojas carta: examen y pauta`);
  }

  if (errores.length) { console.log('\n📋 Errores recogidos:'); errores.slice(0, 8).forEach(e => console.log('   · ' + e.slice(0, 200))); }
  await browser.close();
  console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s)\n`);
  process.exit(fallos ? 1 : 0);
})();
