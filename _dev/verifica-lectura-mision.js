/* ═══════════════════════════════════════════════════════════════
   📖 ¿FUNCIONA EL CONTROL DE LECTURA DENTRO DE LA MISIÓN?

   Lo que se comprueba es lo que el alumno no puede comprobar solo:
   que el minuto dure un minuto y que al cumplirse TODO se detenga.
   Un cronómetro que sigue corriendo detrás de una pantalla congelada
   le regala palabras por minuto que el niño no leyó, y ese número
   acaba en su expediente y en el informe que firma su madre.

   Recorre el flujo entero en las dos formas de marcar:
   · ✋ marco yo — se toca hasta dónde se leyó;
   · ✨ se marca sola — la guía avanza al ritmo de la banda del grado.
   Y el atajo de terminar el texto antes del minuto.

   El tiempo NO se espera de verdad: se adelanta el reloj del
   navegador (page.clock), porque si no cada comprobación costaría un
   minuto y nadie las correría antes de publicar.

   Uso:
     node _dev/servidor-estatico.js         (en otra terminal)
     node _dev/verifica-lectura-mision.js

   Necesita Playwright con Chromium. Si ya hay uno instalado por otro
   lado, se le pasa su ruta:
     METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-lectura-mision.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const URL = BASE + '/misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html';

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

async function abrirLectura(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.click('[data-s="s-lectura"]');
  await page.waitForSelector('#lm-root .lm-grados');
}

async function eligeGradoYTexto(page, grado, indiceTexto) {
  await page.click(`[data-lm-grado="${grado}"]`);
  await page.waitForSelector('[data-lm-texto]');
  const ids = await page.$$eval('[data-lm-texto]', bs => bs.map(b => b.dataset.lmTexto));
  await page.click(`[data-lm-texto="${ids[indiceTexto]}"]`);
  return ids;
}

async function contestaTodo(page) {
  const n = await page.$$eval('.lm-preg', e => e.length);
  for (let i = 0; i < n; i++) await page.click(`[data-lm-resp="${i}"][data-lm-op="0"]`);
  await page.click('#lm-revisar');
  await page.waitForSelector('#lm-ver');
  await page.click('#lm-ver');
  await page.waitForSelector('.lm-hero b');
}

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {}
  );
  const errores = [];
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  /* La capa de registro abre la ficha de identificación en la primera visita
     y taparía la sección. Se marca omitida ANTES de que corra el JS de la
     página: así, además, se prueba el caso en que la plataforma no sabe el
     grado del alumno y tiene que preguntárselo. */
  await page.addInitScript(() => { try { sessionStorage.setItem('METAS_ID_OMITIDA', '1'); } catch (e) {} });
  page.on('pageerror', e => errores.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|Failed to load/.test(m.text())) errores.push(m.text()); });
  await page.clock.install();

  try {
    /* ══ 1. la sección existe y ofrece los grados del II y III ciclo ══ */
    console.log('\n═══ La sección y sus grados ═══');
    await abrirLectura(page);
    const grados = await page.$$eval('[data-lm-grado]', bs => bs.map(b => +b.dataset.lmGrado));
    comprueba(JSON.stringify(grados) === JSON.stringify([4, 5, 6, 7, 8, 9]),
      `los grados ofrecidos son 4º a 9º (II y III ciclo) — salieron ${grados.join(', ')}`);

    for (const g of grados) {
      await page.click(`[data-lm-grado="${g}"]`);
      const n = await page.$$eval('[data-lm-texto]', b => b.length);
      comprueba(n === 5, `${g}º ofrece cinco lecturas (salieron ${n})`);
    }

    /* ══ 2. modo «marco yo»: el minuto para y congela el marcado ══ */
    console.log('\n═══ Modo ✋ marco yo: al minuto todo se detiene ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 6, 0);
    await page.click('[data-lm-modo="marco"]');
    await page.click('#lm-empezar');
    await page.waitForSelector('#lm-arrancar');
    await page.click('#lm-arrancar');

    /* El dedo: se arrastra por encima de las palabras, que es el gesto real
       —tocar una por una sería imposible leyendo en voz alta—. Se comprueba
       que arrastrar pinte todo lo que va quedando atrás. */
    await page.clock.runFor(8000);
    const p0 = await page.locator('.lm-p[data-i="0"]').boundingBox();
    const p12 = await page.locator('.lm-p[data-i="12"]').boundingBox();
    await page.mouse.move(p0.x + 2, p0.y + p0.height / 2);
    await page.mouse.down();
    await page.mouse.move(p12.x + p12.width / 2, p12.y + p12.height / 2, { steps: 12 });
    await page.mouse.up();
    const arrastradas = await page.$$eval('.lm-leida', e => e.length);
    comprueba(arrastradas === 12, `arrastrar el dedo hasta la palabra 13 pinta las 12 anteriores (pintó ${arrastradas})`);

    /* Teclado, para la computadora del aula: las flechas mueven la marca. */
    await page.focus('#lm-texto');
    await page.keyboard.press('ArrowRight');
    const traFlecha = await page.$eval('.lm-aqui', e => +e.dataset.i);
    comprueba(traFlecha === 13, `la flecha derecha adelanta una palabra (quedó en la ${traFlecha + 1})`);

    await page.clock.runFor(12000);
    await page.click('.lm-p[data-i="30"]');
    let quedan = await page.textContent('#lm-num');
    comprueba(+quedan >= 39 && +quedan <= 41, `a los 20 s el cronómetro va por ${quedan} (deberían quedar 40)`);
    let marcadas = await page.$$eval('.lm-leida', e => e.length);
    comprueba(marcadas === 30, `se pintaron las 30 palabras leídas (salieron ${marcadas})`);

    await page.clock.runFor(41000);
    await page.waitForSelector('#lm-preguntas:not([style*="display: none"])');
    quedan = await page.textContent('#lm-num');
    comprueba(quedan.trim() === '0', `al cumplirse el minuto el cronómetro marca 0 (marca «${quedan.trim()}»)`);
    comprueba(await page.isVisible('.lm-aviso'), 'avisa que el minuto se cumplió');

    /* Y sigue detenido: el reloj puede correr, el cronómetro no. */
    await page.clock.runFor(30000);
    quedan = await page.textContent('#lm-num');
    comprueba(quedan.trim() === '0', 'medio minuto después sigue detenido en 0');
    marcadas = await page.$$eval('.lm-leida', e => e.length);
    comprueba(marcadas === 30, 'el marcado quedó congelado donde estaba');

    /* ══ 3. las cinco preguntas y el resultado ══ */
    console.log('\n═══ Las cinco preguntas y el resultado ═══');
    await page.click('#lm-preguntas');
    await page.waitForSelector('.lm-preg');
    const nPreg = await page.$$eval('.lm-preg', e => e.length);
    comprueba(nPreg === 5, `son cinco preguntas (salieron ${nPreg})`);
    const nOps = await page.$$eval('.lm-preg:first-of-type .lm-op', e => e.length);
    comprueba(nOps === 3, `cada pregunta trae tres opciones (salieron ${nOps})`);
    comprueba(await page.isDisabled('#lm-revisar'), 'no deja revisar sin contestarlas todas');
    await contestaTodo(page);

    const ppm = +(await page.textContent('.lm-hero b'));
    comprueba(ppm === 31, `31 palabras en 60 s dan 31 ppm (salió ${ppm})`);
    comprueba((await page.textContent('.lm-chips')).includes('125'),
      'el resultado compara contra la banda de 6º (125–134)');
    const nAdj = await page.$$eval('.lm-adj', e => e.length);
    const nDet = await page.$$eval('.lm-det', e => e.length);
    comprueba(nAdj > 5 && nDet > 0, `resalta los adjetivos del texto (${nAdj} calificativos y ${nDet} determinativos)`);

    /* ══ 4. queda evidencia para el maestro ══ */
    console.log('\n═══ La evidencia que le queda al maestro ═══');
    const guardado = await page.evaluate(() => JSON.parse(localStorage.getItem('METAS_LECTURA_MISION_V1') || '{}'));
    const unaLectura = guardado.adjetivos && Object.values(guardado.adjetivos)[0];
    comprueba(!!unaLectura && unaLectura.ppm > 0, 'la toma queda guardada en el dispositivo con sus ppm');
    const evs = await page.evaluate(() => (window.METAS ? window.METAS.eventos() : []).filter(e => e.tipo === 'lectura'));
    comprueba(evs.length === 1 && evs[0].ppm > 0 && typeof evs[0].comp === 'number',
      'se registró un evento «lectura» con velocidad y comprensión para la Evidencia de misiones');
    const xp = await page.textContent('#xpPts');
    comprueba(/\d+/.test(xp) && +xp.match(/\d+/)[0] >= 5, `la misión pagó XP por la lectura (${xp.trim()})`);
    const hecho = await page.$eval('[data-s="s-lectura"]', b => b.classList.contains('done'));
    comprueba(hecho, 'la pestaña 📖 Lectura quedó marcada como completada');

    /* ══ 5. modo «se marca sola»: la guía avanza y para al minuto ══ */
    console.log('\n═══ Modo ✨ se marca sola: avanza al ritmo del grado y para ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 4, 1);
    await page.click('[data-lm-modo="guia"]');
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');

    await page.clock.runFor(30000);
    let aqui = await page.$eval('.lm-aqui', e => +e.dataset.i);
    /* 4º va a 100 palabras por minuto: a los 30 s la guía debe ir por 50. */
    comprueba(Math.abs(aqui - 50) <= 2, `a los 30 s la guía va por la palabra ${aqui + 1} (se esperaba la 51)`);
    await page.clock.runFor(31000);
    const aquiFin = await page.$eval('.lm-aqui', e => +e.dataset.i);
    await page.clock.runFor(20000);
    const aquiDespues = await page.$eval('.lm-aqui', e => +e.dataset.i);
    comprueba(aquiFin === aquiDespues, 'cumplido el minuto, la guía deja de avanzar');
    comprueba((await page.textContent('.lm-aviso')).includes('Minuto cumplido'), 'avisa que el minuto se cumplió');

    /* ══ 6. terminar el texto antes del minuto ══ */
    console.log('\n═══ Terminar el texto antes del minuto ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 4, 2);
    await page.click('[data-lm-modo="marco"]');
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(40000);
    await page.click('#lm-termine');
    await page.click('#lm-preguntas');
    await contestaTodo(page);
    const ppm2 = +(await page.textContent('.lm-hero b'));
    const total = await page.evaluate(() => LECTURA_ADJETIVOS[4][2].texto.trim().split(/\s+/).length);
    comprueba(Math.abs(ppm2 - Math.round(total * 60 / 40)) <= 2,
      `leer las ${total} palabras en 40 s da ${ppm2} ppm (se esperaba ${Math.round(total * 60 / 40)})`);

    /* ══ 7. salir de la pestaña cancela la toma a medias ══ */
    console.log('\n═══ Salir de la pestaña a media toma ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 5, 0);
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(15000);
    await page.click('[data-s="s-quiz"]');
    await page.click('[data-s="s-lectura"]');
    comprueba(await page.isVisible('.lm-grados'), 'al volver, la toma a medias se canceló y vuelve a la lista');

    console.log('\n═══ Errores de JavaScript ═══');
    comprueba(errores.length === 0, errores.length ? 'sin errores en consola — salieron: ' + errores.join(' | ') : 'sin errores en consola');
  } catch (e) {
    mal('la comprobación se rompió: ' + e.message);
  }

  await browser.close();
  console.log(`\n${fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ el control de lectura de la misión funciona'}`);
  process.exit(fallos ? 1 : 0);
})();
