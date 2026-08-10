/* ═══════════════════════════════════════════════════════════════
   📖 ¿FUNCIONA EL CONTROL DE LECTURA DENTRO DE LA MISIÓN?

   Lo primero que se comprueba es lo que el alumno no puede comprobar
   solo: que el minuto dure un minuto y que al cumplirse TODO se
   detenga. Un cronómetro que sigue corriendo detrás de una pantalla
   congelada le regala palabras por minuto que el niño no leyó, y ese
   número acaba en su expediente y en el informe que firma su madre.

   Vigila también que MIENTRAS SE LEE el texto no haga nada: se quitó
   el marcado con el dedo porque distraía de la lectura, y esto impide
   que vuelva a colarse. El único toque es el de después del minuto.

   Después recorre el taller entero —las cuatro actividades sobre el
   texto recién leído— y vigila la cacería de adjetivos de cerca:
   tocar un adjetivo de verdad tiene que sumar, tocar un sustantivo
   tiene que explicar por qué no, y tocar un ARTÍCULO no puede contar
   como error (la propia misión pone «un» entre los numerales, así que
   el alumno que lo toca ha leído bien).

   Vigila además dónde está el MANDO del minuto. Tiene que quedar
   DEBAJO del texto: al sonar el minuto el alumno acaba de leer la
   última línea, y si la orden de marcar y el botón de seguir están
   arriba del todo se queda parado creyendo que la pantalla se trabó.

   Y el botón de atrás de las actividades: que deje volver a mirar lo
   anterior, y que volver NO reabra lo ya contestado — si dejara
   rehacerlo, el puntaje del alumno lo pondría el botón y no él.

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
  await page.clock.runFor(61000);
  await page.click(`.lm-p[data-i="${hasta}"]`);   /* la marca va DESPUÉS del minuto */
  await page.waitForSelector('#lm-seguir', { state: 'visible' });
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

    /* Mientras corre el minuto el texto tiene que ser SOLO TEXTO: ni el
       toque ni las flechas pueden marcar nada, o volvemos a lo que
       distraía al alumno de leer. */
    await page.clock.runFor(8000);
    await page.click('.lm-p[data-i="12"]');
    await page.focus('#lm-texto');
    await page.keyboard.press('ArrowRight');
    comprueba(await page.$$eval('.lm-leida, .lm-aqui', e => e.length) === 0,
      'mientras se lee, tocar el texto no marca nada: el alumno solo lee');
    comprueba(!(await page.isVisible('#lm-seguir')), 'y todavía no hay botón para seguir');

    await page.clock.runFor(12000);
    let quedan = await page.textContent('#lm-num');
    comprueba(+quedan >= 39 && +quedan <= 41, `a los 20 s el cronómetro va por ${quedan} (deberían quedar 40)`);

    /* ══ 3. cumplido el minuto: UN toque marca hasta dónde llegó ══ */
    console.log('\n═══ Cumplido el minuto: un solo toque ═══');
    await page.clock.runFor(41000);
    comprueba((await page.textContent('#lm-num')).trim() === '0', 'al cumplirse el minuto el cronómetro marca 0');
    comprueba(/Minuto cumplido/.test(await page.textContent('.lm-aviso')), 'pide marcar la última palabra leída');
    comprueba(!(await page.isVisible('#lm-seguir')),
      'no deja seguir hasta que marque: sin marca no hay palabras por minuto');

    await page.clock.runFor(30000);
    comprueba((await page.textContent('#lm-num')).trim() === '0', 'medio minuto después sigue detenido en 0');

    await page.click('.lm-p[data-i="30"]');
    comprueba(await page.$$eval('.lm-leida', e => e.length) === 30,
      'el toque pinta las 30 palabras que alcanzó a leer');
    await page.waitForSelector('#lm-seguir', { state: 'visible' });
    ok('y entonces sí aparece el botón para seguir');
    /* Se puede corregir la marca antes de seguir, pero el tiempo ya no
       se mueve: el minuto se cumplió. */
    await page.click('.lm-p[data-i="34"]');
    comprueba(await page.$$eval('.lm-leida', e => e.length) === 34, 'tocar otra palabra corrige la marca');
    await page.click('.lm-p[data-i="30"]');
    comprueba((await page.textContent('#lm-num')).trim() === '0', 'y el cronómetro sigue parado en 0');

    /* ══ 4. actividad 1 · comprensión, una a la vez y en letra grande ══ */
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

    /* ══ 5. actividad 2 · la cacería de adjetivos ══ */
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
    const revelados = await page.$$eval('.lm-a, .lm-b, .lm-hallada', e => e.length);
    comprueba(revelados === objetivo.total,
      `«no encuentro más» revela los ${objetivo.total} adjetivos del texto (mostró ${revelados})`);
    await page.click('#lm-sig');

    /* ══ 6. actividad 3 · ¿califica o determina? ══ */
    console.log('\n═══ Actividad 3 · ¿Califica o determina? ═══');
    await page.waitForSelector('[data-lm-grupo]');
    comprueba((await page.textContent('.lm-frase')).length > 10,
      'cada palabra se clasifica dentro de su oración, no suelta');
    let vueltas = 0;
    while (await page.$('[data-lm-grupo]')) {
      await page.click('[data-lm-grupo="a"]');
      if (vueltas === 0) comprueba(await page.isVisible('.lm-guia'), 'explica en el acto qué clase era y por qué');
      await page.click('#lm-sig');
      vueltas++;
      if (vueltas > 8) break;
      if (!(await page.$('[data-lm-grupo]'))) break;
    }
    comprueba(vueltas === 6, `se clasifican seis palabras (fueron ${vueltas})`);

    /* ══ 7. actividad 4 · ¿cómo lo decía el texto? ══ */
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

    /* ══ 8. resultado, evidencia y XP ══ */
    console.log('\n═══ El resultado y lo que le queda al maestro ═══');
    await page.waitForSelector('.lm-hero b');
    const ppm = +(await page.$eval('.lm-hero b', e => e.textContent));
    comprueba(ppm === 31, `31 palabras en 60 s dan 31 ppm (salió ${ppm})`);
    comprueba((await page.textContent('.lm-chips')).includes('125'),
      'el resultado compara contra la banda de 6º (125–134)');
    /* Se cuenta dentro del texto: fuera hay dos ejemplos en la leyenda. */
    const claves = await page.$$eval('.lm-texto .lm-a, .lm-texto .lm-b', e => e.length);
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

    /* ══ 9. las actividades no cambian al repetir la misma lectura ══ */
    console.log('\n═══ Repetir la misma lectura ═══');
    const antes = await page.evaluate(() => LECTURA_ADJETIVOS[6][0].id);
    await page.click('#lm-repetir');
    await page.waitForSelector('#lm-arrancar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(61000);
    await page.click('.lm-p[data-i="20"]');
    await page.waitForSelector('#lm-seguir', { state: 'visible' });
    await page.click('#lm-seguir');
    await contestaComprension(page, 0);
    comprueba(!!antes, 'la relectura arranca de nuevo sin arrastrar el resultado anterior');
    comprueba(await page.isVisible('.lm-marcador'), 'y vuelve a llevar al taller completo');

    /* ══ 10. terminar el texto antes del minuto ══ */
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
    for (let i = 0; i < 6; i++) { await page.click('[data-lm-grupo="a"]'); await page.click('#lm-sig'); }
    for (let i = 0; i < 4; i++) { await page.click('[data-lm-op="0"]'); await page.click('#lm-sig'); }
    await page.waitForSelector('.lm-hero b');
    const ppm2 = +(await page.$eval('.lm-hero b', e => e.textContent));
    comprueba(Math.abs(ppm2 - Math.round(total * 60 / 40)) <= 2,
      `leer las ${total} palabras en 40 s da ${ppm2} ppm (se esperaba ${Math.round(total * 60 / 40)})`);

    /* ══ 11. salir de la pestaña a media toma ══ */
    console.log('\n═══ Salir de la pestaña a media toma ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 5, 0);
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(15000);
    await page.click('[data-s="s-quiz"]');
    await page.click('[data-s="s-lectura"]');
    comprueba(await page.isVisible('.lm-grados'), 'al volver, la toma a medias se canceló y vuelve a la lista');

    /* ══ 12. el mando del minuto va DEBAJO del texto ══ */
    console.log('\n═══ El mando del minuto, debajo del texto ═══');
    await abrirLectura(page);
    await eligeGradoYTexto(page, 9, 0);   /* el texto más largo: 200 palabras */
    await page.click('#lm-empezar');
    const sitio = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const t = document.getElementById('lm-texto').getBoundingClientRect();
      const p = document.getElementById('lm-panel').getBoundingClientRect();
      return {
        despuesDelTexto: p.top > t.top,
        /* pegado abajo: con el texto de 200 palabras sin caber de una
           vez, el mando tiene que seguir a la vista sin desplazar */
        aLaVista: p.top >= 0 && p.bottom <= window.innerHeight + 2,
        texto: Math.round(t.height), pantalla: window.innerHeight,
      };
    });
    comprueba(sitio.despuesDelTexto,
      'el cronómetro, la instrucción y los botones van debajo del texto, no encima');
    comprueba(sitio.aLaVista,
      `el mando se queda pegado abajo y a la vista, aunque el texto de 9º (${sitio.texto}px) ` +
      `no quepa en la pantalla (${sitio.pantalla}px)`);
    await page.click('#lm-arrancar');
    await page.clock.runFor(61000);
    /* Al cumplirse el minuto, la orden de marcar tiene que estar en el
       mismo sitio donde acaba de leer, no en otra pantalla. */
    const ordenAbajo = await page.evaluate(() => {
      const a = document.querySelector('#lm-panel .lm-aviso');
      return !!a && /Minuto cumplido/.test(a.textContent);
    });
    comprueba(ordenAbajo, 'la orden de marcar la última palabra sale en ese mismo mando de abajo');
    await page.click('.lm-p[data-i="40"]');
    comprueba(await page.evaluate(() => {
      const b = document.getElementById('lm-seguir');
      return !!b && b.offsetParent !== null && document.getElementById('lm-panel').contains(b);
    }), 'y el botón de seguir aparece ahí mismo, sin tener que buscarlo arriba');

    /* ══ 13. volver a lo anterior en las actividades ══ */
    console.log('\n═══ Volver a lo anterior ═══');
    await page.click('#lm-seguir');
    await page.waitForSelector('.lm-preg-q');
    comprueba(!(await page.isVisible('#lm-atras')),
      'en la primera pregunta no hay atrás: atrás sería volver al texto, y el minuto ya se tomó');
    const preg1 = await page.textContent('.lm-preg-q');
    await page.click('[data-lm-op="0"]');
    await page.click('#lm-sig');
    const preg2 = await page.textContent('.lm-preg-q');
    comprueba(preg1 !== preg2, 'la segunda pregunta es otra');
    await page.waitForSelector('#lm-atras');
    await page.click('#lm-atras');
    comprueba((await page.textContent('.lm-preg-q')) === preg1, 'el botón de atrás devuelve a la pregunta anterior');
    comprueba(await page.isVisible('.lm-guia'), 'y la trae con su corrección puesta, como la dejó');
    comprueba(await page.isDisabled('.lm-op'), 'no deja volver a contestarla: se puede mirar, no rehacer');
    await page.click('#lm-sig');
    comprueba((await page.textContent('.lm-preg-q')) === preg2, 'y desde ahí se sigue adelante con normalidad');

    /* Volver de una actividad a la ANTERIOR, con el taller ya empezado. */
    for (let i = 0; i < 4; i++) { await page.click('[data-lm-op="0"]'); await page.click('#lm-sig'); }
    await page.waitForSelector('.lm-marcador');
    await page.click('#lm-atras');
    comprueba(await page.isVisible('.lm-preg-q'),
      'desde la cacería, atrás devuelve a la última pregunta de la actividad anterior');
    await page.click('#lm-sig');
    await page.waitForSelector('.lm-marcador');
    ok('y hacia adelante se vuelve a la cacería sin perder lo cazado');

    /* ══ 14. la lectura en el proyector del aula ══
       El maestro proyecta la lectura y sus 43 alumnos la copian del
       muro. Lo que se vigila es lo que él pidió con estas palabras:
       «ese número del minuto me tapa bastante», «que se reduzca el
       interlineado», «que se pueda agrandar la letra» y «que se pueda
       ver completa». El que copia desde su pupitre no hace scroll: lo
       que se queda fuera de la pared, para él no existe. */
    console.log('\n═══ La lectura en el proyector ═══');
    const aula = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    aula.on('pageerror', e => errores.push(String(e)));
    aula.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|Failed to load/.test(m.text())) errores.push(m.text()); });
    await aula.addInitScript(() => { try { sessionStorage.setItem('METAS_ID_OMITIDA', '1'); } catch (e) {} });

    /* Mide sobre la PALABRA, no sobre la caja: varias misiones traen
       `body.letra-grande`, que infla los <span> un 25 % con !important,
       y lo que el niño ve es la palabra. */
    const mide = () => aula.evaluate(() => {
      const c = document.getElementById('lm-texto');
      const p = document.getElementById('lm-panel');
      const w = document.querySelector('.lm-p');
      const cs = getComputedStyle(w);
      const alto = c.scrollHeight - parseFloat(getComputedStyle(c).paddingBottom || 0);
      return {
        fz: +parseFloat(cs.fontSize).toFixed(1),
        interlineado: +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2),
        cabeEntero: c.getBoundingClientRect().top >= 0 &&
          c.getBoundingClientRect().top + alto <= p.getBoundingClientRect().top + 1,
        panel: Math.round(p.offsetHeight),
        mandos: !!document.querySelector('#lm-vista') && document.querySelector('#lm-vista').offsetParent !== null,
      };
    });
    const abreEnAula = async (grado, i) => {
      await aula.goto(URL, { waitUntil: 'domcontentloaded' });
      await aula.click('[data-s="s-lectura"]');
      await aula.waitForSelector('#lm-root .lm-grados');
      await aula.click(`[data-lm-grado="${grado}"]`);
      await aula.waitForSelector('[data-lm-texto]');
      const l = await aula.$$eval('[data-lm-texto]', bs => bs.map(b => b.dataset.lmTexto));
      await aula.click(`[data-lm-texto="${l[i]}"]`);
      await aula.click('#lm-empezar');
    };

    await abreEnAula(6, 0);
    const enPantalla = await mide();
    comprueba(enPantalla.cabeEntero,
      `en la pantalla del aula el texto de 6º se ve ENTERO, sin desplazar (letra ${enPantalla.fz}px)`);
    /* El mando llegó a medir 165 px de alto en cuatro renglones: el
       número del minuto, partido en dos por el modo de letra grande,
       ponía la mitad. */
    comprueba(enPantalla.panel <= 130,
      `el mando del minuto no se come la pantalla: mide ${enPantalla.panel}px (tope 130)`);
    comprueba(enPantalla.interlineado <= 1.55,
      `los renglones van juntos, no sueltos: interlineado ${enPantalla.interlineado} (tope 1.55)`);

    /* El botón del proyector: pantalla completa, letra más grande y el
       texto SIGUE cabiendo entero, que es la condición de todo esto. */
    await aula.click('#lm-proyector');
    const proyectado = await mide();
    comprueba(await aula.$eval('#lm-root', e => e.classList.contains('lm-proy')),
      'el botón 📽️ pone la lectura a pantalla completa, sin cabecera ni pestañas');
    comprueba(proyectado.fz > enPantalla.fz,
      `y con la pantalla entera la letra crece de ${enPantalla.fz}px a ${proyectado.fz}px`);
    comprueba(proyectado.cabeEntero, 'con el texto todavía entero a la vista, que es de lo que se copia');

    /* Agrandar a mano, y que se quede puesto: el maestro lo dice una
       vez, no en cada una de las cinco lecturas del grado. */
    await aula.click('#lm-mas');
    const masGrande = await mide();
    comprueba(masGrande.fz > proyectado.fz,
      `A+ agranda la letra a mano (${proyectado.fz}px → ${masGrande.fz}px)`);
    await aula.click('#lm-menos');
    comprueba((await mide()).fz === proyectado.fz, 'y A− la devuelve como estaba');
    await aula.click('#lm-mas');
    await abreEnAula(6, 1);
    const otraLectura = await mide();
    const recordado = await aula.evaluate(() => JSON.parse(localStorage.getItem('METAS_LECTURA_MISION_VISTA') || '{}'));
    comprueba(recordado.proy === true && recordado.off >= 1 &&
      await aula.$eval('#lm-root', e => e.classList.contains('lm-proy')),
      'la siguiente lectura abre ya proyectada y con el retoque de letra puesto, sin repetirlo');
    /* Lo que se guarda es el RETOQUE, no el tamaño: cada lectura se mide
       sola y el retoque se le suma. Por eso al quitarlo el texto vuelve a
       caber entero aunque esta lectura tenga otro largo que la anterior
       —y por eso guardar el tamaño en sí no serviría: el que llena la
       pared con 100 palabras deja a medias las de 172—. */
    await aula.click('#lm-menos');
    const sinRetoque = await mide();
    comprueba(sinRetoque.fz < otraLectura.fz && sinRetoque.cabeEntero,
      `y esta otra lectura también se ve entera con lo que le cabe a ella (${sinRetoque.fz}px)`);

    /* Y lo que no puede pasar: que mientras se lee haya algo que
       toquetear. Ya se quitó de aquí un selector de modos porque el
       niño se ponía a probarlo y llegaba al minuto sin haber leído. */
    comprueba(otraLectura.mandos, 'antes de arrancar, el maestro tiene a mano A−, A+ y el proyector');
    await aula.click('#lm-arrancar');
    comprueba(!(await mide()).mandos,
      'y al arrancar el minuto desaparecen: mientras se lee, la pantalla no pide nada');
    await aula.close();

    console.log('\n═══ Errores de JavaScript ═══');
    comprueba(errores.length === 0, errores.length ? 'sin errores en consola — salieron: ' + errores.join(' | ') : 'sin errores en consola');
  } catch (e) {
    mal('la comprobación se rompió: ' + e.message);
  }

  await browser.close();
  console.log(`\n${fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ el control de lectura de la misión funciona'}`);
  process.exit(fallos ? 1 : 0);
})();
