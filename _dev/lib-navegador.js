/* ============================================================
   M.E.T.A.S · Abrir el navegador de las sondas, en un solo sitio
   ------------------------------------------------------------
   Cada sonda abría Chromium a su manera y con su propia idea de
   dónde está: unas con `executablePath` clavado a una ruta de
   este contenedor, otras probando primero y cayendo a una ruta
   de reserva, y por el camino salieron TRES nombres distintos
   de variable de entorno para lo mismo (CHROME_EXE, CHROMIUM_BIN
   y METAS_CHROMIUM).

   Eso se pagó el 6 de septiembre de 2026, el mismo día que se
   estrenó el CI: cinco sondas llevaban dentro
   `/opt/pw-browsers/chromium-1194/...`, que es donde está el
   navegador de ESTA máquina. En GitHub, donde Playwright instala
   el suyo en otro lado, las cinco reventaron antes de comprobar
   nada. Y no era un fallo del producto: era la sonda diciendo
   que no encontraba el navegador.

   La regla, y es la del andamio de los juegos 3D: **primero el
   navegador que trae Playwright**, que es el que hay en cualquier
   máquina donde se haya instalado, y solo si ese no arranca se
   busca uno puesto a mano. Así la misma sonda corre aquí y allá
   sin tocarle una línea.

   Uso:  const { abrir } = require('./lib-navegador');
         const nav = await abrir();                  // como chromium.launch()
         const nav = await abrir({ args:['--no-sandbox'] });
   ============================================================ */
'use strict';

const { chromium } = require('playwright');

/* Los tres nombres que quedaron sueltos por el camino, más la ruta del
   contenedor de trabajo. Se miran EN ORDEN y solo si Playwright falla. */
function deReserva() {
  return [
    process.env.CHROME_EXE,
    process.env.CHROMIUM_BIN,
    process.env.METAS_CHROMIUM,
    '/opt/pw-browsers/chromium'
  ].filter(Boolean);
}

async function abrir(opciones) {
  const op = Object.assign({}, opciones);
  /* ⚠️ Primero el Chromium COMPLETO (`channel: 'chromium'`), no el
     «headless shell» que Playwright abre por defecto. El shell coloca la
     letra en píxeles enteros: la misma frase en Fredoka mide 144 px donde
     el Chromium completo —y el del teléfono— mide 142,2. Con eso, todas
     las sondas que miden letra (la tinta de un rótulo, el hueco entre dos
     pedazos de una frase, si un botón se parte en dos renglones) salían
     rojas con el dibujo bien. Estuvo tapado por un accidente: mientras la
     versión de Playwright instalada no casaba con la del contenedor, el
     arranque fallaba y la reserva de abajo abría el completo. El 2 de
     octubre de 2026 casaron, se abrió el shell y la sonda de las
     animaciones dio 95 fallos que no eran del producto. `npx playwright
     install chromium` trae los dos, así que en GitHub está igual. */
  if (!op.executablePath && !op.channel) {
    try { return await chromium.launch(Object.assign({}, op, { channel: 'chromium' })); }
    catch (_) { /* sin el completo, lo de siempre */ }
  }
  /* Sin executablePath: que Playwright use el suyo. Es el caso normal en
     GitHub y en cualquier máquina con `npx playwright install` hecho. */
  try { return await chromium.launch(op); }
  catch (e) {
    for (const exe of deReserva()) {
      try { return await chromium.launch(Object.assign({}, op, { executablePath: exe })); }
      catch (_) { /* se prueba el siguiente */ }
    }
    /* Si no hubo ninguno, se cuenta el fallo ORIGINAL de Playwright: es el
       que dice qué falta instalar, no el «no existe» de la última reserva. */
    throw e;
  }
}

/* ============================================================
   Y una segunda cosa que se abre aquí: la página SIN service worker.

   Las sondas que fingen la nube con `page.route` tienen que abrirla así,
   y no es una comodidad: es lo único que hace que comprueben lo que
   dicen comprobar. Cuando el service worker toma el control de la
   página —`sw.js` hace `skipWaiting()` y `clients.claim()`, así que lo
   toma sin recargar— las peticiones pasan por él, y las que pasan por
   él **`page.route` no las intercepta**: se van a la nube de verdad,
   allí se quedan colgadas, y la sonda ve una pantalla que no se pinta
   nunca. No dice «el service worker se me adelantó»; dice que la
   pantalla está rota.

   Estuvo tapado por un accidente, y por eso hay que dejarlo escrito: la
   instalación del service worker pre-cacheaba dos direcciones de CDN
   que en la sonda no contestan, así que tardaba lo suficiente en tomar
   el control y a las sondas les daba tiempo de sobra. El 9 de
   septiembre de 2026 esas dos direcciones se fueron —el CDN salió del
   camino crítico— la instalación pasó a ser instantánea y
   `verifica-convocatoria` se puso roja **sin que nada del producto
   estuviera roto**. La otra mitad del aviso llevaba meses escrita en
   CLAUDE.md: «lo que se le manda a la nube se comprueba ANTES de
   recargar la página».

   La que SÍ tiene que abrir con service worker es
   `verifica-service-worker`, que es la que lo comprueba a él.

   Uso:  const { abrir, SIN_SW } = require('./lib-navegador');
         const page = await nav.newPage({ ...SIN_SW, viewport: {...} });
   ============================================================ */
const SIN_SW = { serviceWorkers: 'block' };

module.exports = { abrir, SIN_SW };
