/* ═══════════════════════════════════════════════════════════════
   📖 ¿FUNCIONA EL CONTROL DE LECTURA DE LA MISIÓN DE NÚMEROS?

   La sección es la misma que la de los adjetivos —el minuto, el toque
   al final, el taller de cuatro actividades— y eso ya lo comprueba
   _dev/verifica-lectura-mision.js. Lo que se vigila AQUÍ es lo propio
   de esta misión, que es donde puede mentirle al alumno:

   · que cazar números grandes cuente los que pasan de mil, estén en
     cifras o en palabras, y que los menores no se marquen como error
     (son números de verdad, solo que no son los que se buscan);
   · que el número que la pantalla dice que vale una cifra sea el que
     de verdad vale — un error aquí le enseña mal el valor posicional;
   · que ordenar de menor a mayor mezcle cifras y palabras, que es lo
     que obliga a leer el número antes de compararlo.

   El tiempo NO se espera: se adelanta el reloj del navegador.

   Uso:
     node _dev/servidor-estatico.js         (en otra terminal)
     node _dev/verifica-lectura-numeros.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir } = require('./lib-navegador');
const path = require('path');
const NUM = require(path.resolve(__dirname, '..', 'js', 'data', 'lectura-numerales.js'));

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const URL = BASE + '/misiones/1ciclo-segundo-grado/numeros-hasta-999.html';

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

(async () => {
  const browser = await abrir(
  );
  const errores = [];
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  await page.addInitScript(() => { try { sessionStorage.setItem('METAS_ID_OMITIDA', '1'); } catch (e) {} });
  page.on('pageerror', e => errores.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|Failed to load/.test(m.text())) errores.push(m.text()); });
  await page.clock.install();

  try {
    console.log('\n═══ La sección dentro de la misión de números ═══');
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.click('[data-s="s-lectura"]');
    await page.waitForSelector('#lm-root .lm-grados');
    const grados = await page.$$eval('[data-lm-grado]', bs => bs.map(b => +b.dataset.lmGrado));
    comprueba(JSON.stringify(grados) === JSON.stringify([4, 5, 6, 7, 8, 9]),
      `ofrece los grados 4º a 9º — salieron ${grados.join(', ')}`);

    await page.click('[data-lm-grado="6"]');
    const ids = await page.$$eval('[data-lm-texto]', bs => bs.map(b => b.dataset.lmTexto));
    comprueba(ids.length === 5, `6º ofrece cinco lecturas (salieron ${ids.length})`);
    await page.click(`[data-lm-texto="${ids[0]}"]`);

    /* ══ el minuto, igual que en la otra misión ══ */
    await page.click('#lm-empezar');
    await page.click('#lm-arrancar');
    await page.clock.runFor(61000);
    comprueba(await page.$$eval('.lm-leida, .lm-aqui', e => e.length) === 0,
      'mientras se lee, el texto no marca nada');
    await page.click('.lm-p[data-i="40"]');
    await page.waitForSelector('#lm-seguir', { state: 'visible' });
    await page.click('#lm-seguir');
    await page.waitForSelector('.lm-preg-q');
    for (let i = 0; i < 5; i++) { await page.click('[data-lm-op="0"]'); await page.click('#lm-sig'); }

    /* ══ actividad 2 · cazar los números grandes ══ */
    console.log('\n═══ Actividad 2 · Caza de números grandes ═══');
    await page.waitForSelector('.lm-marcador');
    const info = await page.evaluate(() => {
      const t = LECTURA_NUMEROS[6][0];
      const ps = t.texto.trim().split(/\s+/);
      const ns = LECTURA_NUMERALES.detectar(ps);
      const grande = ns.find(n => n.v >= 1000 && n.forma === 'cifras');
      const enPalabras = ns.find(n => n.v >= 1000 && n.forma === 'palabras');
      const chico = ns.find(n => n.v < 1000);
      const noEsNumero = ps.map((p, i) => ({ p, i })).find(x => !ns.some(n => x.i >= n.ini && x.i <= n.fin) && x.p.length > 4);
      return { grande, enPalabras, chico, noEsNumero, total: ns.filter(n => n.v >= 1000).length, ps };
    });
    comprueba(!!info.enPalabras, 'la lectura trae al menos un número grande escrito en palabras');

    await page.click(`.lm-p[data-i="${info.grande.ini}"]`);
    comprueba((await page.textContent('.lm-marcador')).indexOf('1 de') >= 0,
      `tocar ${NUM.enCifras(info.grande.v)} (en cifras) suma en el marcador`);

    /* Un número escrito en palabras ocupa varias palabras: tocar
       cualquiera de ellas tiene que encender el número ENTERO. */
    await page.click(`.lm-p[data-i="${info.enPalabras.ini + 1}"]`);
    const encendidas = await page.$$eval('.lm-hallada', e => e.length);
    const anchoPalabras = info.enPalabras.fin - info.enPalabras.ini + 1;
    comprueba(encendidas === 1 + anchoPalabras,
      `tocar en medio de «${NUM.enPalabras(info.enPalabras.v)}» enciende sus ${anchoPalabras} palabras de una vez`);

    await page.click(`.lm-p[data-i="${info.chico.ini}"]`);
    let aviso = await page.textContent('.lm-aviso');
    comprueba(/no llega a mil/.test(aviso) && !/❌/.test(aviso),
      `tocar ${NUM.enCifras(info.chico.v)} explica que no llega a mil, y no lo cuenta como error`);
    comprueba((await page.textContent('.lm-marcador')).indexOf('fallido') < 0,
      'un número pequeño no se apunta como fallo: es un número de verdad');

    await page.click(`.lm-p[data-i="${info.noEsNumero.i}"]`);
    aviso = await page.textContent('.lm-aviso');
    comprueba(/no es un número/.test(aviso), `tocar «${info.noEsNumero.p}» sí explica que no es un número`);

    await page.click('#lm-rindo');
    comprueba(await page.$$eval('.lm-texto .lm-a', e => e.length) > 0, 'al rendirse quedan marcados los que faltaban');
    await page.click('#lm-sig');

    /* ══ actividad 3 · leer el número ══ */
    console.log('\n═══ Actividad 3 · Lee el número ═══');
    await page.waitForSelector('.lm-preg-q');
    let vueltas = 0, tipos = { cifras: 0, palabras: 0, posicion: 0 };
    while (await page.$('.lm-op')) {
      const enunciado = await page.textContent('.lm-preg-q');
      if (/cómo se escribe con cifras/i.test(enunciado)) tipos.cifras++;
      else if (/cómo se lee/i.test(enunciado)) tipos.palabras++;
      else if (/cuánto vale/i.test(enunciado)) tipos.posicion++;
      /* Se comprueba que la opción marcada como correcta sea de verdad la
         correcta, calculándola aparte con el lector de numerales. */
      const caso = await page.evaluate(() => {
        const q = document.querySelector('.lm-preg-q').textContent;
        const ops = [...document.querySelectorAll('.lm-op')].map(b => b.textContent.replace(/^[abc]\)\s*/, '').trim());
        return { q, ops };
      });
      const mVale = caso.q.match(/En ([\d,]+), ¿cuánto vale el (\d)\?/);
      if (mVale) {
        const v = NUM.valorCifra(mVale[1]), d = +mVale[2];
        const c = NUM.cifrasDe(v).find(x => x.digito === d);
        await page.click('[data-lm-op="0"]');
        const marcada = await page.$eval('.lm-op.lm-ok', e => e.textContent.replace(/^[abc]\)\s*/, '').trim());
        comprueba(marcada === NUM.enCifras(c.vale),
          `en ${mVale[1]} el ${d} vale ${NUM.enCifras(c.vale)} (la pantalla dice ${marcada})`);
      } else {
        await page.click('[data-lm-op="0"]');
      }
      await page.click('#lm-sig');
      vueltas++;
      if (vueltas > 6) break;
    }
    comprueba(vueltas === 4, `son cuatro números que leer (fueron ${vueltas})`);
    comprueba(tipos.cifras + tipos.palabras > 0 && tipos.posicion > 0,
      `mezcla escribir el número con el valor posicional (${tipos.cifras} de cifras, ${tipos.palabras} de lectura, ${tipos.posicion} de posición)`);

    /* ══ actividad 4 · ordenar de menor a mayor ══ */
    console.log('\n═══ Actividad 4 · De menor a mayor ═══');
    await page.waitForSelector('.lm-ficha');
    const fichas = await page.$$eval('.lm-ficha', bs => bs.map(b => b.textContent.trim()));
    comprueba(fichas.length === 3, `cada ronda trae tres números (salieron ${fichas.length})`);
    /* Tocar el mayor primero tiene que rebotar. */
    const valores = fichas.map(f => /^[\d,]+$/.test(f) ? NUM.valorCifra(f) : NUM.valorPalabras(f.split(/\s+/)));
    const iMayor = valores.indexOf(Math.max(...valores));
    const iMenor = valores.indexOf(Math.min(...valores));
    await page.click(`[data-lm-ficha="${iMayor}"]`);
    comprueba(await page.$$eval('.lm-puesta', e => e.length) === 0,
      'tocar el mayor primero no lo coloca: hay que empezar por el menor');
    comprueba(/más pequeño/.test(await page.textContent('.lm-aviso')), 'y explica cómo comparar');
    await page.click(`[data-lm-ficha="${iMenor}"]`);
    comprueba(await page.$$eval('.lm-puesta', e => e.length) === 1, 'tocar el menor sí lo coloca en primer lugar');

    let rondas = 0;
    while (await page.$('.lm-ficha') && rondas < 4) {
      const f = await page.$$eval('.lm-ficha', bs => bs.map(b => ({
        txt: b.textContent.trim(), k: +b.dataset.lmFicha, puesta: b.classList.contains('lm-puesta')
      })));
      const libres = f.filter(x => !x.puesta);
      if (!libres.length) { await page.click('#lm-sig'); rondas++; continue; }
      const vals = libres.map(x => {
        const s = x.txt.replace(/\d+º$/, '').trim();
        return { k: x.k, v: /^[\d,]+$/.test(s) ? NUM.valorCifra(s) : NUM.valorPalabras(s.split(/\s+/)) };
      });
      vals.sort((a, b) => a.v - b.v);
      await page.click(`[data-lm-ficha="${vals[0].k}"]`);
    }
    comprueba(rondas === 2, `son dos rondas de ordenar (fueron ${rondas})`);

    /* ══ resultado ══ */
    console.log('\n═══ El resultado ═══');
    await page.waitForSelector('.lm-hero b');
    comprueba((await page.textContent('.lm-chips')).includes('125'), 'compara contra la banda de 6º');
    comprueba(/números mayores que mil/.test(await page.textContent('#lm-root .card.ac-amber')),
      'la hoja de respuestas cuenta los números del texto');
    const evs = await page.evaluate(() => (window.METAS ? window.METAS.eventos() : []).filter(e => e.tipo === 'lectura'));
    comprueba(evs.length === 1 && evs[0].ppm > 0,
      'se registró el evento «lectura» para la Evidencia de misiones');
    const xp = await page.textContent('#xpPts');
    comprueba(+xp.match(/\d+/)[0] >= 5, `la misión pagó XP (${xp.trim()})`);
    comprueba(await page.$eval('[data-s="s-lectura"]', b => b.classList.contains('done')),
      'la pestaña 📖 Lectura quedó marcada como completada');

    console.log('\n═══ Errores de JavaScript ═══');
    comprueba(errores.length === 0, errores.length ? 'sin errores — salieron: ' + errores.join(' | ') : 'sin errores en consola');
  } catch (e) {
    mal('la comprobación se rompió: ' + e.message);
  }

  await browser.close();
  console.log(`\n${fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ el control de lectura de la misión de números funciona'}`);
  process.exit(fallos ? 1 : 0);
})();
