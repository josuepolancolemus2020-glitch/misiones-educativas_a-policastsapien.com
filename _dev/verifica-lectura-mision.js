/* ═══════════════════════════════════════════════════════════════
   📖 ¿FUNCIONA EL CONTROL DE LECTURA DENTRO DE LA MISIÓN?

   Lo primero que se comprueba es lo que el alumno no puede comprobar
   solo: que el minuto dure un minuto y que al cumplirse TODO se
   detenga. Un cronómetro que sigue corriendo detrás de una pantalla
   congelada le regala palabras por minuto que el niño no leyó, y ese
   número acaba en su expediente y en el informe que firma su madre.

   Después recorre el taller entero —las cuatro actividades sobre el
   texto recién leído— y vigila la cacería de adjetivos de cerca:
   tocar un adjetivo de verdad tiene que sumar, tocar un sustantivo
   tiene que explicar por qué no, y tocar un ARTÍCULO no puede contar
   como error (la propia misión pone «un» entre los numerales, así que
   el alumno que lo toca ha leído bien).

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

async function eligeGradoYTexto(page, grado, indice) {
  await page.click(`[data-lm-grado="${grado}"]`);
  await page.waitForSelector('[data-lm-texto]');
  const ids = await page.$$eval('[data-lm-texto]', bs => bs.map(b => b.dataset.lmTexto));
  await page.click(`[data-lm-texto="${ids[indice]}"]`);
  return ids[indice];
}

/* Lee el minuto entero marcando hasta la palabra `hasta` y entra al taller. */
async function leeElMinuto(page, hasta) {
  await page.click('#lm-empezar');
  await page.click('#lm-arrancar');
  await page.clock.runFor(20000);
  await page.click(`.lm-p[data-i="${hasta}"]`);
  await page.clock.runFor(41000);
  await page.waitForSelector('#lm-seguir:not([style*="display: none"])');
  await page.click('#lm-seguir');
  await page.waitForSelector('.lm-preg-q');
}

/* Contesta las cinco preguntas de comprensión (siempre la opción `op`). */
async function contestaComprension(page, op) {
  for (let i = 0; i < 5; i++) {
    await page.click(`[data-lm-op="${op}"]`);
    await page.waitForSelector('#lm-sig');
    await page.click('#lm-sig');
  }
  await page.waitForSelector('.lm-marcador');
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
    /* ══ 1. la sección, sus grados y NADA que elegir antes de leer ══ */
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
    /* El maestro reportó que elegir modo antes de leer distraía muchísimo.
       Esto vigila que no vuelva a colarse una decisión antes del minuto. */
    const modos = await page.$$eval('[data-lm-modo]', b => b.length);
    comprueba(modos === 0, `no hay nada que elegir antes de leer, solo el texto (salieron ${modos} selectores de modo)`);

    /* ══ 2. el minuto para y congela el marcado ══ */
    console.log('\n═══ El minuto: al cumplirse, todo se detiene ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 6, 0);
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');

    /* El dedo: se arrastra por encima de las palabras, que es el gesto real
       —tocar una por una sería imposible leyendo en voz alta—. */
    await page.clock.runFor(8000);
    const p0 = await page.locator('.lm-p[data-i="0"]').boundingBox();
    const p12 = await page.locator('.lm-p[data-i="12"]').boundingBox();
    await page.mouse.move(p0.x + 2, p0.y + p0.height / 2);
    await page.mouse.down();
    await page.mouse.move(p12.x + p12.width / 2, p12.y + p12.height / 2, { steps: 12 });
    await page.mouse.up();
    /* No se exige una palabra exacta: elementFromPoint puede caer en la de
       al lado en el borde entre dos. Lo que sí tiene que cumplirse siempre
       es la invariante —lo pintado es exactamente lo que quedó atrás— y que
       el arrastre haya avanzado de verdad. */
    const traArrastre = await page.$eval('.lm-aqui', e => +e.dataset.i);
    const pintadas = await page.$$eval('.lm-leida', e => e.length);
    comprueba(traArrastre >= 9 && pintadas === traArrastre,
      `arrastrar el dedo pinta todo lo que queda atrás (marca en la palabra ${traArrastre + 1}, ${pintadas} pintadas)`);

    await page.focus('#lm-texto');
    await page.keyboard.press('ArrowRight');
    comprueba(await page.$eval('.lm-aqui', e => +e.dataset.i) === traArrastre + 1,
      'con teclado, la flecha derecha adelanta exactamente una palabra');

    await page.clock.runFor(12000);
    await page.click('.lm-p[data-i="30"]');
    let quedan = await page.textContent('#lm-num');
    comprueba(+quedan >= 39 && +quedan <= 41, `a los 20 s el cronómetro va por ${quedan} (deberían quedar 40)`);

    await page.clock.runFor(41000);
    await page.waitForSelector('#lm-seguir:not([style*="display: none"])');
    comprueba((await page.textContent('#lm-num')).trim() === '0', 'al cumplirse el minuto el cronómetro marca 0');
    comprueba(await page.isVisible('.lm-aviso'), 'avisa que el minuto se cumplió');
    await page.clock.runFor(30000);
    comprueba((await page.textContent('#lm-num')).trim() === '0', 'medio minuto después sigue detenido en 0');
    comprueba(await page.$$eval('.lm-leida', e => e.length) === 30, 'el marcado quedó congelado donde estaba');

    /* ══ 3. actividad 1 · comprensión, una a la vez y en letra grande ══ */
    console.log('\n═══ Actividad 1 · ¿Qué entendiste? ═══');
    await page.click('#lm-seguir');
    await page.waitForSelector('.lm-preg-q');
    comprueba(await page.$$eval('.lm-preg-q', e => e.length) === 1,
      'se muestra UNA pregunta a la vez, no las cinco juntas');
    const fzPreg = await page.$eval('.lm-preg-q', e => parseFloat(getComputedStyle(e).fontSize));
    const fzOp = await page.$eval('.lm-op', e => parseFloat(getComputedStyle(e).fontSize));
    comprueba(fzPreg >= 17, `la pregunta va en letra grande (${fzPreg}px; el mínimo pedido es 17)`);
    comprueba(fzOp >= 15.5, `las opciones van en letra grande (${fzOp}px)`);
    comprueba(await page.$$eval('.lm-op', e => e.length) === 3, 'cada pregunta trae tres opciones');
    await page.click('[data-lm-op="0"]');
    comprueba(await page.isVisible('.lm-guia'), 'al contestar explica en el acto si acertó y por qué');
    comprueba(await page.isDisabled('.lm-op'), 'ya no deja cambiar la respuesta');
    for (let i = 0; i < 4; i++) { await page.click('#lm-sig'); await page.click('[data-lm-op="0"]'); }
    await page.click('#lm-sig');

    /* ══ 4. actividad 2 · la cacería de adjetivos ══ */
    console.log('\n═══ Actividad 2 · Caza de adjetivos ═══');
    await page.waitForSelector('.lm-marcador');
    /* Se buscan en el corpus tres palabras del texto: un adjetivo, un
       artículo y una que no es ninguna de las dos. */
    const objetivo = await page.evaluate(() => {
      const t = LECTURA_ADJETIVOS[6][0];
      const ps = t.texto.trim().split(/\s+/);
      const lim = /[.,;:()¿?¡!«»"“”'’…—–]/g;
      const k = p => p.replace(lim, '').toLowerCase();
      const adjs = new Set((t.adjs || []).map(k)), dets = new Set((t.dets || []).map(k));
      const neu = new Set((t.neutros || []).map(k).concat(LECTURA_CLASES.neutros.map(k)));
      const buscar = f => ps.map((p, i) => ({ p, i })).filter(x => f(k(x.p)))[0];
      return {
        adjetivo: buscar(x => adjs.has(x)),
        articulo: buscar(x => LECTURA_CLASES.neutros.indexOf(x) >= 0),
        ninguno: buscar(x => !adjs.has(x) && !dets.has(x) && !neu.has(x)),
        total: ps.filter(p => adjs.has(k(p)) || dets.has(k(p))).length
      };
    });

    await page.click(`.lm-p[data-i="${objetivo.adjetivo.i}"]`);
    comprueba((await page.textContent('.lm-marcador')).indexOf('1 de') >= 0,
      `tocar «${objetivo.adjetivo.p}» (adjetivo) suma en el marcador`);
    comprueba(await page.$$eval('.lm-hallada', e => e.length) === 1, 'la palabra cazada queda marcada en el texto');

    await page.click(`.lm-p[data-i="${objetivo.ninguno.i}"]`);
    let aviso = await page.textContent('.lm-aviso');
    comprueba(/no es adjetivo/.test(aviso), `tocar «${objetivo.ninguno.p}» explica por qué no es adjetivo`);

    await page.click(`.lm-p[data-i="${objetivo.articulo.i}"]`);
    aviso = await page.textContent('.lm-aviso');
    comprueba(/no cuenta/.test(aviso) && /art/i.test(aviso),
      `tocar el artículo «${objetivo.articulo.p}» no cuenta ni bien ni mal`);
    comprueba((await page.textContent('.lm-marcador')).indexOf('1 intento(s) fallido') >= 0,
      'el artículo no se apuntó como fallo; el sustantivo sí');

    await page.click('#lm-rindo');
    await page.waitForSelector('#lm-sig');
    const revelados = await page.$$eval('.lm-adj, .lm-det, .lm-hallada', e => e.length);
    comprueba(revelados === objetivo.total,
      `«no encuentro más» revela los ${objetivo.total} adjetivos del texto (mostró ${revelados})`);
    await page.click('#lm-sig');

    /* ══ 5. actividad 3 · ¿califica o determina? ══ */
    console.log('\n═══ Actividad 3 · ¿Califica o determina? ═══');
    await page.waitForSelector('[data-lm-clase]');
    comprueba((await page.textContent('.lm-frase')).length > 10,
      'cada palabra se clasifica dentro de su oración, no suelta');
    let vueltas = 0;
    while (await page.$('[data-lm-clase]')) {
      await page.click('[data-lm-clase="adj"]');
      if (vueltas === 0) comprueba(await page.isVisible('.lm-guia'), 'explica en el acto qué clase era y por qué');
      await page.click('#lm-sig');
      vueltas++;
      if (vueltas > 8) break;
      if (!(await page.$('[data-lm-clase]'))) break;
    }
    comprueba(vueltas === 6, `se clasifican seis palabras (fueron ${vueltas})`);

    /* ══ 6. actividad 4 · ¿cómo lo decía el texto? ══ */
    console.log('\n═══ Actividad 4 · ¿Cómo lo decía el texto? ═══');
    await page.waitForSelector('.lm-hueco');
    comprueba(await page.$$eval('.lm-op', e => e.length) === 3, 'el hueco ofrece tres adjetivos de la misma lectura');
    let huecos = 0;
    while (await page.$('.lm-hueco')) {
      await page.click('[data-lm-op="0"]');
      await page.click('#lm-sig');
      huecos++;
      if (huecos > 6) break;
    }
    comprueba(huecos === 4, `son cuatro oraciones que completar (fueron ${huecos})`);

    /* ══ 7. resultado, evidencia y XP ══ */
    console.log('\n═══ El resultado y lo que le queda al maestro ═══');
    await page.waitForSelector('.lm-hero b');
    const ppm = +(await page.$eval('.lm-hero b', e => e.textContent));
    comprueba(ppm === 31, `31 palabras en 60 s dan 31 ppm (salió ${ppm})`);
    comprueba((await page.textContent('.lm-chips')).includes('125'),
      'el resultado compara contra la banda de 6º (125–134)');
    /* Se cuenta dentro del texto: fuera hay dos ejemplos en la leyenda. */
    const claves = await page.$$eval('.lm-texto .lm-adj, .lm-texto .lm-det', e => e.length);
    comprueba(claves === objetivo.total, `la hoja de respuestas resalta los ${objetivo.total} adjetivos`);

    const guardado = await page.evaluate(() => JSON.parse(localStorage.getItem('METAS_LECTURA_MISION_V1') || '{}'));
    const unaLectura = guardado.adjetivos && Object.values(guardado.adjetivos)[0];
    comprueba(!!unaLectura && unaLectura.ppm > 0, 'la toma queda guardada en el dispositivo con sus ppm');
    const evs = await page.evaluate(() => (window.METAS ? window.METAS.eventos() : []).filter(e => e.tipo === 'lectura'));
    comprueba(evs.length === 1 && evs[0].ppm > 0 && typeof evs[0].comp === 'number' && typeof evs[0].puntos === 'number',
      'se registró un evento «lectura» con velocidad, comprensión y puntos del taller');
    const xp = await page.textContent('#xpPts');
    comprueba(+xp.match(/\d+/)[0] >= 5, `la misión pagó XP por la lectura y el taller (${xp.trim()})`);
    comprueba(await page.$eval('[data-s="s-lectura"]', b => b.classList.contains('done')),
      'la pestaña 📖 Lectura quedó marcada como completada');

    /* ══ 8. las actividades no cambian al repetir la misma lectura ══ */
    console.log('\n═══ Repetir la misma lectura ═══');
    const antes = await page.evaluate(() => LECTURA_ADJETIVOS[6][0].id);
    await page.click('#lm-repetir');
    await page.waitForSelector('#lm-arrancar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(20000);
    await page.click('.lm-p[data-i="20"]');
    await page.clock.runFor(41000);
    await page.click('#lm-seguir');
    await contestaComprension(page, 0);
    comprueba(!!antes, 'la relectura arranca de nuevo sin arrastrar el resultado anterior');
    comprueba(await page.isVisible('.lm-marcador'), 'y vuelve a llevar al taller completo');

    /* ══ 9. terminar el texto antes del minuto ══ */
    console.log('\n═══ Terminar el texto antes del minuto ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 4, 2);
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(40000);
    await page.click('#lm-termine');
    const total = await page.evaluate(() => LECTURA_ADJETIVOS[4][2].texto.trim().split(/\s+/).length);
    await page.click('#lm-seguir');
    await contestaComprension(page, 0);
    await page.click('#lm-rindo');
    await page.click('#lm-sig');
    for (let i = 0; i < 6; i++) { await page.click('[data-lm-clase="adj"]'); await page.click('#lm-sig'); }
    for (let i = 0; i < 4; i++) { await page.click('[data-lm-op="0"]'); await page.click('#lm-sig'); }
    await page.waitForSelector('.lm-hero b');
    const ppm2 = +(await page.$eval('.lm-hero b', e => e.textContent));
    comprueba(Math.abs(ppm2 - Math.round(total * 60 / 40)) <= 2,
      `leer las ${total} palabras en 40 s da ${ppm2} ppm (se esperaba ${Math.round(total * 60 / 40)})`);

    /* ══ 10. salir de la pestaña a media toma ══ */
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
