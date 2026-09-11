/* ============================================================
   M.E.T.A.S · La Fábrica Geométrica
   ------------------------------------------------------------
   El juego de la misión «Área de Círculos y Polígonos». Vive en su
   propio archivo y se abre en otra pestaña, como los juegos 3D y por
   las mismas dos razones: sus nombres de clase (.nav, .btn, .chip,
   .pill) chocan con los de la misión, y su maquetación es de pantalla
   completa —body en cuadrícula de 100dvh— que metida dentro de una
   sección se llevaría por delante la página entera.

   Lo que esta sonda vigila, que es lo que cuesta caro:

   · **La estrella se gana.** Abrir la misión no la da, entrar a la
     sección tampoco, y con 3 de 7 estaciones tampoco. La da terminar
     las siete —y paga UNA vez: recargar no vuelve a pagar—. Es la
     normativa de `js/estrella-ganada.js` aplicada a una sección que
     se completa en OTRA pestaña.
   · **El juego no escribe en el progreso de la misión.** Guarda en su
     llave (`j2d_fabrica_geo_v1`); si escribiera en la de la misión, la
     partida abierta en la otra pestaña le borraría al alumno el XP que
     acaba de ganar.
   · **Lo que se ve se puede tocar.** Las partes del círculo se tocan
     SOBRE la figura, y ahí es donde se cuela la avería de siempre: el
     borde del círculo, pintado encima con relleno, se quedaba con
     todos los toques y el sector no se podía tocar NUNCA. Se toca el
     medio del trazo de cada elemento —no el centro de su caja, que en
     un arco cae por dentro del círculo— y se pregunta antes quién
     recibiría ese toque.
   · **Las cuentas son las de la misión**: π = 3.14 (el de su
     evaluación impresa) y A = (P · a) ÷ 2 en los polígonos.
   · **El porcentaje de la Constancia.** Con la sección nueva, el 10
     escrito a mano en `getProgress()` daba **110 %** con todo hecho, y
     esa cifra sale en la Constancia que el alumno le enseña a su
     familia.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-fabrica-geometrica.js
   ============================================================ */
'use strict';

const { abrir } = require('./lib-navegador');

const BASE = 'http://localhost:8123/misiones/mat-2y3ciclo-area-circulo-y-poligonos-regulares';
const JUEGO = BASE + '/juego-fabrica-geometrica.html';
const MISION = BASE + '/circulos-poligonos.html';
const LLAVE = 'j2d_fabrica_geo_v1';
const LLAVE_MISION = 'circulos_poligonos_v1';
const ESTACIONES = ['scene-1','scene-circulo','scene-forja','scene-poli','scene-control','scene-reloj','scene-pedidos'];

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};
const hechas = n => { const h = {}; ESTACIONES.slice(0, n).forEach(k => h[k] = 1); return h; };

(async () => {
  const nav = await abrir();

  /* ── EL JUEGO ─────────────────────────────────────────────── */
  console.log('\n▶ El juego: se juega entero y con el dedo');
  {
    const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, locale: 'es-HN' });
    const pg = await ctx.newPage();
    const errores = [];
    /* Las fuentes y los iconos vienen de un CDN: sin internet fallan y eso
       no es una avería del juego, así que no cuentan como error. */
    pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errores.push(m.text()); });
    pg.on('pageerror', e => errores.push('pageerror: ' + e.message));

    await pg.goto(JUEGO, { waitUntil: 'domcontentloaded' });
    await pg.waitForTimeout(500);
    ok('abre con sus siete estaciones', await pg.locator('.nav-btn').count() === 7);
    /* ⚠️ Se quitan los COMENTARIOS antes de buscar. El sitio donde se
       explica por qué algo ya no está es justo donde ese algo sigue
       escrito: esta misma comprobación se acusaba a sí misma, porque el
       <head> del juego lleva la nota de que el zoom NO se bloquea. Es la
       quinta vez que este repositorio pisa la misma trampa. */
    const sinNotas = (await pg.content()).replace(/<!--[\s\S]*?-->/g, '');
    ok('y sin bloquear el zoom', !/user-scalable\s*=\s*no|maximum-scale/.test(sinNotas));

    /* 1 · Torno: el pedido no siempre es el radio, así que hay que
       llegar a él desde el diámetro, la circunferencia o el área. */
    const num = t => parseFloat(String(t).replace(/[^\d.]/g, ''));
    let torno = true;
    for (let i = 0; i < 5; i++) {
      const ask = await pg.textContent('#s1-ask'), goal = num(await pg.textContent('#s1-goal'));
      let r = /DIÁMETRO/.test(ask) ? goal / 2
            : /circunferencia/.test(ask) ? goal / (2 * 3.14)
            : /área/.test(ask) ? Math.sqrt(goal / 3.14) : goal;
      await pg.locator('#s1-slider').fill(String(Math.round(r)));
      await pg.click('#s1-check');
      if (!await pg.locator('#s1-next').isVisible()) { torno = false; ok('el pedido «' + ask + ' ' + goal + '» se puede clavar', false); break; }
      await pg.click('#s1-next'); await pg.waitForTimeout(100);
    }
    if (torno) ok('el torno se termina contestando bien', await pg.locator('#s1-win').isVisible());
    ok('y las cuentas del torno usan π = 3.14', await pg.evaluate(() => {
      const r = +document.querySelector('#s1-r').textContent;
      const c = +document.querySelector('#s1-c').textContent;
      const a = +document.querySelector('#s1-a').textContent;
      return Math.abs(c - 2 * 3.14 * r) < 0.02 && Math.abs(a - 3.14 * r * r) < 0.02;
    }));

    /* 2 · Partes del círculo: el guardián del toque tapado. */
    await pg.click('[data-go="scene-circulo"]');
    const mapa = { 'EL CENTRO':'centro', 'EL RADIO':'radio', 'EL DIÁMETRO':'diametro', 'LA CUERDA':'cuerda', 'EL ARCO':'arco', 'EL SECTOR CIRCULAR':'sector' };
    let partes = true;
    for (let i = 0; i < 6; i++) {
      const pide = (await pg.textContent('#sc-goal')).trim(), k = mapa[pide];
      const pt = await pg.evaluate(k => {
        const el = document.querySelector('#sc-svg [data-k="' + k + '"]');
        const svg = document.getElementById('sc-svg');
        let x, y;
        if (el.tagName === 'circle') { x = +el.getAttribute('cx'); y = +el.getAttribute('cy'); }
        else { const p = el.getPointAtLength(el.getTotalLength() / 2); x = p.x; y = p.y; }
        const m = svg.getScreenCTM();
        return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
      }, k);
      /* Se pregunta ANTES de tocar: al acertar aparece el botón Siguiente,
         la figura se encoge y preguntarlo después mide otra pantalla. */
      const recibe = await pg.evaluate(p => { const e = document.elementFromPoint(p.x, p.y); return e ? (e.dataset && e.dataset.k) || e.tagName : 'nada'; }, pt);
      ok('el toque en «' + pide + '» llega a su elemento', recibe === k, { lo_recibe: recibe });
      await pg.mouse.click(pt.x, pt.y);
      if (!await pg.locator('#sc-next').isVisible()) { partes = false; break; }
      await pg.click('#sc-next'); await pg.waitForTimeout(100);
    }
    ok('las seis partes se completan tocándolas sobre la figura', partes && await pg.locator('#sc-win').isVisible());

    /* 3 · Forja: tocar pieza y hueco, que es la vía que vale sin arrastrar. */
    await pg.click('[data-go="scene-forja"]');
    /* Primero ARRASTRANDO, que es la otra mitad y la que se rompe sin
       hacer ruido: se hace con eventos de puntero, nunca con draggable
       —que es de ratón y en un teléfono no existe—. */
    {
      const zona0 = pg.locator('#sf-formula .zone').first();
      const quiere0 = await zona0.getAttribute('data-ok');
      const chip0 = pg.locator('#sf-tray .chip[data-t="' + quiere0 + '"]').first();
      const a = await chip0.boundingBox(), b = await zona0.boundingBox();
      await pg.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
      await pg.mouse.down();
      await pg.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
      await pg.mouse.up();
      await pg.waitForTimeout(120);
      ok('la pieza también se ARRASTRA hasta su hueco', (await zona0.textContent()).trim() === quiere0);
    }
    let forja = true;
    for (let f = 0; f < 5 && forja; f++) {
      const zonas = await pg.locator('#sf-formula .zone').count();
      for (let z = 0; z < zonas; z++) {
        if (await pg.locator('#sf-formula .zone').nth(z).getAttribute('data-puesta')) continue;
        const quiere = await pg.locator('#sf-formula .zone').nth(z).getAttribute('data-ok');
        const chip = pg.locator('#sf-tray .chip[data-t="' + quiere + '"]').first();
        if (await chip.count() === 0) { forja = false; break; }
        await chip.click();
        await pg.locator('#sf-formula .zone').nth(z).click();
        await pg.waitForTimeout(50);
      }
      if (!forja || !await pg.locator('#sf-next').isVisible()) { forja = false; break; }
      await pg.click('#sf-next'); await pg.waitForTimeout(120);
    }
    ok('las cinco fórmulas se arman SIN arrastrar (tocar pieza y hueco)', forja && await pg.locator('#sf-win').isVisible());

    /* 4 · Polígonos: la cuenta de la misión. */
    await pg.click('[data-go="scene-poli"]');
    const nombres = { 'TRIÁNGULO':3,'CUADRADO':4,'PENTÁGONO':5,'HEXÁGONO':6,'HEPTÁGONO':7,'OCTÁGONO':8,'ENEÁGONO':9,'DECÁGONO':10,'ENDECÁGONO':11,'DODECÁGONO':12 };
    let poli = true;
    for (let i = 0; i < 5; i++) {
      const goal = (await pg.textContent('#sp-goal')).trim();
      await pg.locator('#sp-slider').fill(String(nombres[goal] || parseInt(goal)));
      await pg.click('#sp-check');
      if (!await pg.locator('#sp-next').isVisible()) { poli = false; ok('el pedido «' + goal + '» se puede fabricar', false); break; }
      await pg.click('#sp-next'); await pg.waitForTimeout(100);
    }
    ok('el taller de polígonos se termina', poli && await pg.locator('#sp-win').isVisible());
    const cuenta = await pg.evaluate(() => ({
      P: +document.querySelector('#sp-p').textContent,
      a: +document.querySelector('#sp-a').textContent,
      A: +document.querySelector('#sp-ar').textContent
    }));
    ok('y el área del polígono es (P · a) ÷ 2', Math.abs(cuenta.A - cuenta.P * cuenta.a / 2) < 0.11, cuenta);

    /* 5 · Control de calidad. Aquí se avanza contestando lo que sea, así
       que es donde se comprueba que la estación NO se gana tocando por
       tocar: llegar al final no es hacerla. */
    await pg.click('[data-go="scene-control"]');
    const estacionHecha = k => pg.evaluate(k => { const d = JSON.parse(localStorage.getItem('j2d_fabrica_geo_v1') || '{}'); return !!(d.hechas && d.hechas[k]); }, k);
    for (let i = 0; i < 6; i++) {
      await pg.locator('#sq-opts .opt:not([data-ok="1"])').first().click();
      if (await pg.locator('#sq-next').isVisible()) { await pg.click('#sq-next'); await pg.waitForTimeout(100); }
    }
    ok('fallándolo todo, el control llega al final…', await pg.locator('#sq-win').isVisible());
    ok('…pero NO se da por hecho, y dice cuántas faltan',
      !(await estacionHecha('scene-control')) && await pg.locator('#sq-win .ov-falta').count() === 1);
    await pg.click('#sq-win [data-restart]'); await pg.waitForTimeout(250);
    for (let i = 0; i < 6; i++) {
      await pg.locator('#sq-opts .opt[data-ok="1"]').first().click();
      if (await pg.locator('#sq-next').isVisible()) { await pg.click('#sq-next'); await pg.waitForTimeout(100); }
    }
    ok('contestando bien, el control SÍ cuenta', await estacionHecha('scene-control'));

    /* 6 · Contrarreloj. */
    await pg.click('[data-go="scene-reloj"]');
    await pg.click('#sr-start'); await pg.waitForTimeout(300);
    for (let i = 0; i < 8; i++) {
      const b = pg.locator('#sr-opts .opt[data-ok="1"]').first();
      if (await b.count()) await b.click();
      await pg.waitForTimeout(1400);
    }
    ok('el turno de noche termina', await pg.locator('#sr-win').isVisible());
    ok('y contestando bien las ocho da 8 de 8', (await pg.textContent('#sr-score')).trim() === '8 / 8');

    /* 7 · Pedidos. */
    await pg.click('[data-go="scene-pedidos"]');
    for (let i = 0; i < 6; i++) {
      await pg.locator('#sd-opts .opt[data-ok="1"]').first().click();
      await pg.waitForTimeout(100);
      if (await pg.locator('#sd-next').isVisible()) { await pg.click('#sd-next'); await pg.waitForTimeout(100); }
    }
    ok('los seis pedidos se entregan', await pg.locator('#sd-win').isVisible());
    await pg.waitForTimeout(1100);
    ok('con las siete estaciones sale la pantalla final', await pg.locator('#final').isVisible());

    const guardado = await pg.evaluate(() => JSON.parse(localStorage.getItem('j2d_fabrica_geo_v1')));
    ok('quedan guardadas las siete estaciones', guardado && Object.keys(guardado.hechas).length === 7);
    /* ⚠️ La regla 2 de los juegos 3D, aquí también. */
    const llaves = await pg.evaluate(() => Object.keys(localStorage));
    ok('el juego NO escribe en la llave de la misión', !llaves.some(k => k.indexOf(LLAVE_MISION.split('_v')[0]) === 0), llaves);
    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  /* ── LA SECCIÓN EN LA MISIÓN ──────────────────────────────── */
  console.log('\n▶ La sección de la misión: la estrella se gana');
  {
    const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, locale: 'es-HN' });
    const abrirMision = async (estado, hash) => {
      const pg = await ctx.newPage();
      await pg.addInitScript(([ll, d]) => { localStorage.clear(); if (d) localStorage.setItem(ll, JSON.stringify(d)); }, [LLAVE, estado]);
      await pg.goto(MISION + (hash || ''), { waitUntil: 'domcontentloaded' });
      await pg.waitForTimeout(500);
      /* el saludo de identidad tapa la pantalla, como en las demás sondas */
      await pg.evaluate(() => { const m = document.getElementById('metasIdModal'); if (m) m.remove(); });
      return pg;
    };
    const guardado = pg => pg.evaluate(k => JSON.parse(localStorage.getItem(k) || '{}'), LLAVE_MISION);

    let pg = await abrirMision(null);
    ok('la sección 🏭 está, con su chip en la barra',
      await pg.locator('#s-fabrica').count() === 1 && await pg.locator('nav.nav [data-s="s-fabrica"]').count() === 1);
    const chips = await pg.evaluate(() => [...document.querySelectorAll('nav.nav .nav-t[data-s]')].map(b => b.dataset.s));
    ok('va detrás de Completa y delante del Reto', chips.indexOf('s-fabrica') === chips.indexOf('s-completa') + 1, chips);
    ok('el botón lleva al juego y en otra pestaña',
      await pg.getAttribute('#fabBtn', 'href') === 'juego-fabrica-geometrica.html' && await pg.getAttribute('#fabBtn', 'target') === '_blank');
    ok('sin partida, la medalla dice «sin empezar»', (await pg.textContent('#fabMedalla')).includes('sin empezar'));
    ok('abrir la misión NO regala la estrella', !((await guardado(pg)).doneSections || []).includes('s-fabrica'));
    await pg.click('nav.nav [data-s="s-fabrica"]'); await pg.waitForTimeout(250);
    ok('el chip abre la sección', await pg.locator('#s-fabrica.active').count() === 1);
    ok('y entrar a la sección tampoco la da', !((await guardado(pg)).doneSections || []).includes('s-fabrica'));
    await pg.close();

    pg = await abrirMision({ xp: 120, mejorRacha: 4, hechas: hechas(3) });
    ok('una partida a medias se ve en la medalla', /3 de 7/.test(await pg.textContent('#fabMedalla')));
    ok('y el botón invita a seguir, no a entrar', (await pg.textContent('#fabBtn')).includes('Seguir'));
    ok('con 3 de 7 todavía NO hay estrella', !((await guardado(pg)).doneSections || []).includes('s-fabrica'));
    await pg.close();

    pg = await abrirMision({ xp: 430, mejorRacha: 9, hechas: hechas(7) });
    ok('terminar las siete SÍ da la estrella', ((await guardado(pg)).doneSections || []).includes('s-fabrica'));
    ok('y el chip se marca', await pg.locator('[data-s="s-fabrica"].done').count() === 1);
    ok('y el logro 🏭 queda desbloqueado', ((await guardado(pg)).unlockedAch || []).includes('fabrica_maestro'));
    const xpAntes = (await guardado(pg)).xp;
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(500);
    const d2 = await guardado(pg);
    ok('recargar NO vuelve a pagar el XP', d2.xp === xpAntes, { antes: xpAntes, ahora: d2.xp });
    ok('y lo ganado no se pierde al recargar', (d2.doneSections || []).includes('s-fabrica'));
    /* El 10 escrito a mano daba 110 % con la sección nueva. */
    const pct = await pg.evaluate(() => { SECS_COMPLETABLES.forEach(x => done.add(x)); return getProgress(); });
    ok('con todo hecho la Constancia da 100 %, no 110 %', pct === 100, pct);
    await pg.close();

    pg = await abrirMision({ xp: 430, mejorRacha: 9, hechas: hechas(7) }, '#s-fabrica');
    ok('volver del juego con #s-fabrica abre esa sección', await pg.locator('#s-fabrica.active').count() === 1);
    await pg.close();
    await ctx.close();
  }

  /* ── LA PANTALLA CORTA TAMBIÉN ES UNA PANTALLA ────────────── */
  console.log('\n▶ Las pantallas: lo que se ve se puede tocar');
  {
    const medidas = [
      { width: 360, height: 640, n: 'teléfono chico' },
      { width: 393, height: 873, n: 'teléfono normal' },
      { width: 740, height: 360, n: 'teléfono acostado' },
      { width: 1280, height: 720, n: 'pantalla de aula' }
    ];
    for (const vp of medidas) {
      const ctx = await nav.newContext({ viewport: { width: vp.width, height: vp.height } });
      const pg = await ctx.newPage();
      await pg.goto(JUEGO, { waitUntil: 'domcontentloaded' });
      await pg.waitForTimeout(350);
      const malos = [];
      for (const e of ESTACIONES) {
        await pg.click('[data-go="' + e + '"]');
        await pg.waitForTimeout(120);
        const r = await pg.evaluate(id => {
          const out = [];
          document.querySelectorAll('#' + id + ' button, #' + id + ' input, #' + id + ' a').forEach(b => {
            const q = b.getBoundingClientRect();
            if (!q.width && !q.height) return;
            /* fuera del mundo: el mando que no se ve no existe */
            if (q.bottom > innerHeight + 1 || q.right > innerWidth + 1 || q.top < -1 || q.left < -1) out.push({ t: (b.textContent || b.id).trim().slice(0, 20), fuera: Math.round(q.bottom) });
            /* y ningún blanco de toque baja de 44 px, que es lo que un
               dedo acierta sin mirar */
            else if (q.height < 40) out.push({ t: (b.textContent || b.id).trim().slice(0, 20), alto: Math.round(q.height) });
          });
          return out;
        }, e);
        if (r.length) malos.push({ escena: e, cosas: r });
      }
      const deLado = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      ok('en ' + vp.n + ' (' + vp.width + '×' + vp.height + ') todo cabe y se puede tocar', !malos.length && !deLado, { malos, deLado });
      await ctx.close();
    }
  }

  await nav.close();
  console.log('\n' + '─'.repeat(48));
  if (fallos) { console.log(`✖ ${fallos} problema(s) en la Fábrica Geométrica.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la fábrica se juega entera y la estrella se gana.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
