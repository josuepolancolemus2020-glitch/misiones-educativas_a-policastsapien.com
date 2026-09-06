/*
  M.E.T.A.S — _dev/verifica-service-worker.js

  La promesa está escrita en la pantalla del alumno: ábrelo una vez con señal
  y después funciona sin ella. Se rompía por dos sitios.

  1. El armazón NO se precacheaba. Tras la primera visita faltaban
     index.html, app.js y app.css: hacía falta una SEGUNDA visita en línea
     para que el teléfono tuviera la aplicación entera.
  2. Cada despliegue BORRABA la caché completa —incluidas las misiones que el
     alumno había abierto con señal para usarlas sin ella—, porque el nombre
     de la caché lleva la versión y al activarse se borraba todo lo demás.
     Entre el 13 y el 28 de agosto de 2026 eso pasó 37 veces.

  Y había un tercero que no se veía: lo precacheado se guarda sin el sello
  («js/app.js») y la página lo pide con él («js/app.js?v=176»), así que sin
  ignoreSearch no lo encontraba nadie.

  Playwright arranca sin service worker, así que esta sonda lo REGISTRA a mano
  y espera a que tome el control. Es el punto ciego que el CLAUDE.md apunta a
  cuenta de la convocatoria y de los videos.
*/
const { chromium } = require('playwright');
const fs = require('fs');
const EXE = process.env.CHROME_EXE || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE || 'http://localhost:8123';

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

const estado = pag => pag.evaluate(async () => {
  const nombres = await caches.keys();
  const out = { cachés: nombres, entradas: {} };
  for (const n of nombres) {
    const c = await caches.open(n);
    out.entradas[n] = (await c.keys()).map(r => new URL(r.url).pathname + new URL(r.url).search);
  }
  return out;
});
const hay = (e, cache, frag) => (e.entradas[cache] || []).some(u => u.indexOf(frag) >= 0);

(async () => {
  // ── lectura del archivo: lo que Playwright no puede ver de la lógica
  console.log('El archivo');
  const sw = fs.readFileSync('sw.js', 'utf8');
  ok(/const CACHE_NAME = 'meta-app-v\d+'/.test(sw), 'CACHE_NAME sigue siendo el literal que se sella');
  ok(/CACHE_DATOS = 'meta-datos-v\d+'/.test(sw), 'y hay una caché de datos con nombre estable');
  ok(/indexOf\('meta-app-'\) === 0 && key !== CACHE_APP/.test(sw),
     'al activar solo se borran los armazones viejos, no todo');
  ok(/ignoreSearch: true/.test(sw), 'la copia guardada se busca ignorando el sello ?v=');
  ok(/PLAZO_RED/.test(sw), 'la red tiene plazo: la señal mala no deja la pantalla en blanco');
  ok(/PLAZO_INSTALA/.test(sw), 'y la instalación también: un CDN colgado ya no la deja a medias');
  ok(/CASA_YT\.test\(url\.hostname\) \|\| event\.request\.headers\.has\('range'\)/.test(sw),
     'sigue intacto el guardián de lo que se transmite (videos)');
  ok(/'\.\/js\/3d\/parque-3d\.js'/.test(sw) && /'\.\/css\/parque-3d\.css'/.test(sw),
     'sigue precacheado el andamio de los juegos 3D');

  const nav = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pag = await ctx.newPage();

  // ── PRIMERA visita, con el service worker activo de verdad
  console.log('\nLa primera visita en línea');
  await pag.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await pag.evaluate(() => navigator.serviceWorker.register('/sw.js'));
  await pag.evaluate(() => navigator.serviceWorker.ready);
  await pag.waitForTimeout(2500);
  const e1 = await estado(pag);

  const app = e1.cachés.find(n => n.indexOf('meta-app-') === 0);
  ok(!!app, 'existe la caché del armazón', e1.cachés);
  for (const f of ['/index.html', '/css/app.css', '/js/app.js', '/js/data/misiones.js'])
    ok(hay(e1, app, f), `${f} queda guardado a la PRIMERA visita`);

  // ── un despliegue: cambia la versión y se vuelve a entrar
  console.log('\nY después de un despliegue');
  await pag.evaluate(async () => {
    const c = await caches.open('meta-datos-v1');
    await c.put(new Request('/misiones/prueba-de-la-sonda/mision.html'),
                new Response('<h1>una misión que el alumno ya abrió</h1>',
                             { headers: { 'content-type': 'text/html' } }));
  });
  const original = fs.readFileSync('sw.js', 'utf8');
  try {
    fs.writeFileSync('sw.js', original.replace(/const CACHE_NAME = 'meta-app-v(\d+)'/,
      (_, n) => `const CACHE_NAME = 'meta-app-v${+n + 1}'`));
    await pag.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      await reg.update();
    });
    /* Se espera al RELEVO, no a un reloj: instalar y activar son asíncronos, y
       con una espera fija la sonda acusaba de no borrar al que todavía no
       había tenido tiempo de borrar. Se sondea aquí, en Node, para no depender
       de cómo trate el navegador una promesa dentro de waitForFunction. */
    for (let i = 0; i < 40; i++) {
      const ns = await pag.evaluate(() => caches.keys());
      if (ns.indexOf(app) < 0) break;
      await pag.waitForTimeout(1500);
    }
    const e2 = await estado(pag);
    const appNueva = e2.cachés.find(n => n.indexOf('meta-app-') === 0 && n !== app);
    ok(!!appNueva, 'el despliegue crea el armazón nuevo', e2.cachés);
    ok(e2.cachés.indexOf(app) < 0, 'y borra el armazón viejo');
    ok(hay(e2, 'meta-datos-v1', '/misiones/prueba-de-la-sonda/'),
       'PERO la misión que el alumno tenía guardada SIGUE ahí',
       e2.entradas['meta-datos-v1']);
  } finally {
    fs.writeFileSync('sw.js', original);
  }

  await nav.close();
  console.log('\n' + (fallos
    ? `✘ ${fallos} comprobaciones fallaron`
    : '✓ abre sin señal desde la primera visita, y un despliegue ya no le borra lo suyo'));
  process.exit(fallos ? 1 : 0);
})();
