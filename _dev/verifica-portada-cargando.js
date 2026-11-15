/* ============================================================
   M.E.T.A.S · La portada dice «ya va a abrir», no «se trabó»
   ------------------------------------------------------------
   Entre que la portada se pinta y que app.js le pone vida a los
   botones pasan 1 a 3 segundos con mala señal. En ese hueco el
   maestro toca «Misiones», no pasa nada y cree que la aplicación
   no responde. La señal de carga de index.html tapa ese hueco, y
   esta sonda vigila que lo tape BIEN:

   1. Está en línea en index.html (si viniera en un archivo aparte
      llegaría junto con lo que espera) y sin nada de afuera.
   2. 1.ª visita con mala señal: la señal se ve, los botones no
      reciben toques mientras tanto, y se quita SOLA cuando app.js
      avisa, sin relojes que alarguen la espera. Al quitarse, el
      botón Misiones responde al primer toque.
   3. Visita rápida: si la aplicación abre en menos de 300 ms no
      se llega a ver nada (sin parpadeo).
   4. Si app.js no llega, a los 10 s se quita igual y la portada
      queda usable.
   5. Con «reducir movimiento» nada barre ni gira.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-portada-cargando.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Lo que se mira de la pantalla en un instante dado. */
const foto = pg => pg.evaluate(() => {
  const h = document.documentElement;
  const op = sel => { const e = document.querySelector(sel); return e ? +getComputedStyle(e).opacity : -1; };
  const pe = sel => { const e = document.querySelector(sel); return e ? getComputedStyle(e).pointerEvents : ''; };
  const t1 = document.querySelector('.metas-pildora .me-t1');
  return {
    cls: h.className,
    texto1: t1 ? +getComputedStyle(t1).opacity : -1,
    pildora: document.querySelector('.metas-pildora') ? getComputedStyle(document.querySelector('.metas-pildora')).display : '',
    pildoraOp: op('.metas-pildora'),
    rutasOp: op('.home-nav-btn[data-view="view-rutas"]'),
    rutasPE: pe('.home-nav-btn[data-view="view-rutas"]'),
    misionesPE: pe('.hnb-principal'),
    hamburguesaPE: pe('#hamburger-btn'),
    barre: getComputedStyle(document.querySelector('.hnb-principal'), '::before').animationName,
    gira: document.querySelector('.mp-ico') ? getComputedStyle(document.querySelector('.mp-ico'), '::before').animationName : ''
  };
});

/* Retrasa los guiones como lo haría la mala señal; app.js, el que más. */
async function senalLenta(ctx, msApp) {
  await ctx.route(/\/js\/.*\.js/, async r => {
    await new Promise(z => setTimeout(z, /\/js\/app\.js/.test(r.request().url()) ? msApp : 40));
    r.continue().catch(() => {});
  });
}

/* Anota cuándo avisó app.js y si la señal llegó a verse. Se envuelve la
   función en cuanto index.html la define: aquí todavía no existe ni <html>. */
const anotaAviso = () => {
  let real;
  Object.defineProperty(window, 'metasLista', {
    configurable: true,
    get() { return real; },
    set(v) {
      real = function () {
        const primera = window.__avisoEn === undefined;
        if (primera) window.__avisoEn = performance.now();
        v();
        if (primera) window.__seVio = document.documentElement.classList.contains('metas-vista');
      };
    }
  });
};

(async () => {
  console.log('\n════════ LA SEÑAL DE CARGA DE LA PORTADA ════════\n');

  console.log('1) En línea, sin nada de afuera, y con su aviso explícito');
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const appjs = fs.readFileSync(path.join(RAIZ, 'js', 'app.js'), 'utf8');
  const estilo = (html.match(/<style>[\s\S]*?metas-cargando[\s\S]*?<\/style>/) || [''])[0];
  ok('el estilo de la señal va en línea en index.html', !!estilo);
  ok('y antes de los guiones de la aplicación', estilo && html.indexOf(estilo) < html.indexOf('js/app.js'));
  ok('pesa poco (menos de 8 KB en línea)', Buffer.byteLength(estilo) < 8192, Buffer.byteLength(estilo));
  ok('no pide nada de afuera (ni url() ni @import)', !/url\(|@import/.test(estilo));
  ok('solo anima transform y opacity (nada de width, left, top ni background-position en los @keyframes)',
     !(estilo.match(/@keyframes[^{]+\{([^{}]*\{[^}]*\})+\s*\}/g) || []).some(k => /(width|height|left|top|background-position|margin)\s*:/.test(k)));
  ok('el reloj de seguridad es de 10 s', /setTimeout\(window\.metasLista,10000\)/.test(html));
  ok('app.js avisa con metasLista() cuando ya enganchó los botones',
     /home-nav-btn[\s\S]*addEventListener[\s\S]*window\.metasLista\(\)/.test(appjs));
  ok('no promete funcionar desconectada', !/sin\s+(internet|conexi[oó]n|se[ñn]al)|offline/i.test(
     (html.match(/class="metas-pildora[\s\S]*?<\/div>/) || [''])[0]));

  const nav = await abrir({ args: ['--no-sandbox'] });
  const telefono = { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-HN' };

  console.log('\n2) 1.ª visita con mala señal');
  {
    const ctx = await nav.newContext(telefono);
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    await senalLenta(ctx, 2500);
    await ctx.addInitScript(anotaAviso);
    const pg = await ctx.newPage();
    const errores = [];
    pg.on('pageerror', e => errores.push(String(e)));
    pg.goto(BASE + '/index.html').catch(() => {});
    await pg.waitForSelector('.hnb-principal', { state: 'attached' });
    await pg.waitForTimeout(900);
    const d = await foto(pg);
    ok('mientras carga, la portada lleva la marca de «cargando»', /metas-cargando/.test(d.cls) && !/metas-lista/.test(d.cls), d.cls);
    ok('la píldora se ve abajo', d.pildora === 'flex' && d.pildoraOp > 0.5, d);
    ok('y dice «Preparando tus misiones…»', d.texto1 > 0.5, d.texto1);
    ok('con su anillo girando', d.gira === 'me-gira', d.gira);
    ok('los demás botones se ven apagados', d.rutasOp < 0.6, d.rutasOp);
    ok('y ningún botón recibe toques (ni Misiones ni el menú)',
       d.rutasPE === 'none' && d.misionesPE === 'none' && d.hamburguesaPE === 'none', d);
    ok('el botón Misiones lleva su barrido de luz', d.barre === 'me-barre', d.barre);

    await pg.waitForFunction(() => document.documentElement.classList.contains('metas-lista'), null, { timeout: 9000 });
    const aviso = await pg.evaluate(() => ({ en: window.__avisoEn, vio: window.__seVio, app: typeof switchView }));
    ok('la señal se quita cuando avisa app.js, no por el reloj de 10 s', aviso.en < 9000 && aviso.app === 'function', aviso);
    ok('y como se había visto, el botón «se enciende»', aviso.vio === true, aviso);
    await pg.waitForTimeout(1200);
    const f = await foto(pg);
    ok('al terminar no queda nada de la señal', !/metas-cargando|metas-vista/.test(f.cls) && f.pildora === 'none', f);
    ok('los botones vuelven enteros y reciben toques', f.rutasOp === 1 && f.rutasPE === 'auto' && f.misionesPE === 'auto', f);
    const alto = await pg.evaluate(() => document.querySelector('#view-inicio .app-header').offsetHeight);
    ok('el encabezado no cambió de alto al quitarla (sin saltos)', alto < 90, alto);
    await pg.click('.hnb-principal');
    await pg.waitForTimeout(400);
    const vista = await pg.evaluate(() => document.querySelector('.view.active').id);
    ok('el primer toque en Misiones abre las misiones', vista === 'view-misiones', vista);
    ok('sin errores en la página', errores.length === 0, errores[0]);
    await ctx.close();
  }

  console.log('\n3) Visita rápida: sin parpadeo');
  {
    const ctx = await nav.newContext(telefono);
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    await ctx.addInitScript(anotaAviso);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/index.html');           // calienta la caché del navegador
    await pg.waitForTimeout(300);
    await pg.reload();
    await pg.waitForFunction(() => window.__avisoEn !== undefined, null, { timeout: 9000 });
    const a = await pg.evaluate(() => ({ en: Math.round(window.__avisoEn), vio: window.__seVio, cls: document.documentElement.className }));
    /* El navegador de la sonda no siempre abre en menos de 300 ms; lo que se
       vigila es la regla: antes de 300 ms no se enciende nada, después sí. */
    ok(`abrió en ${a.en} ms y ${a.vio ? 'sí' : 'no'} se encendió: es lo que toca`, a.vio === (a.en > 300), a);
    if (!a.vio) ok('y se limpió al instante', !/metas-cargando/.test(a.cls), a.cls);
    await ctx.close();
  }

  console.log('\n4) Si app.js no llega, a los 10 s se quita igual');
  {
    const ctx = await nav.newContext(telefono);
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    await ctx.route(/\/js\/app\.js/, r => r.abort());
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await pg.waitForTimeout(5000);
    const antes = await foto(pg);
    ok('a los 5 s todavía espera', /metas-cargando/.test(antes.cls) && !/metas-lista/.test(antes.cls), antes.cls);
    await pg.waitForTimeout(6500);
    const f = await foto(pg);
    ok('a los 11 s ya no hay señal', /metas-lista/.test(f.cls) && !/metas-cargando/.test(f.cls), f.cls);
    ok('y los botones vuelven a recibir toques', f.rutasPE === 'auto' && f.rutasOp === 1, f);
    await ctx.close();
  }

  console.log('\n5) Con «reducir movimiento»');
  {
    const ctx = await nav.newContext({ ...telefono, reducedMotion: 'reduce' });
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    await senalLenta(ctx, 2000);
    const pg = await ctx.newPage();
    pg.goto(BASE + '/index.html').catch(() => {});
    await pg.waitForSelector('.hnb-principal', { state: 'attached' });
    await pg.waitForTimeout(800);
    const d = await foto(pg);
    ok('nada barre el botón', d.barre === 'none', d.barre);
    ok('el anillo no gira', d.gira === 'none', d.gira);
    ok('pero la señal se ve igual', d.pildora === 'flex', d.pildora);
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): la señal de carga no tapa bien el hueco.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la portada dice «ya va a abrir» y se quita cuando de verdad abrió.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
