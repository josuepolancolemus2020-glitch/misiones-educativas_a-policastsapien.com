/* ═══════════════════════════════════════════════════════════════
   🚌 ¿FUNCIONA LA SALIDA, DE PUNTA A PUNTA?

   Recorre en un navegador de verdad las DOS mitades, que es donde
   está el riesgo: el maestro arma la invitación en «Mi aula» →
   ✅ Controles, la madre la abre en otra pestaña —sin nada de la app
   guardado, como le pasa a ella— y contesta; después se pega esa
   respuesta de vuelta y se mira si el conteo cuadra.

   Lo que de verdad vigila es que las dos mitades sigan hablándose.
   Están escritas en archivos distintos a propósito (excursion.html
   es autónoma: la abre quien no tiene la app), así que nada obliga a
   que sigan de acuerdo, y el día que dejen de estarlo el maestro no
   se entera —él probó su enlace el sábado— sino que se entera la
   madre el lunes, cuando ya no hay tiempo de arreglarlo.

   Vigila también tres cosas que costaron dinero de verdad:
     · que al número del maestro le viaje su código de país (sin él,
       el botón de la madre abre un chat con nadie);
     · que volver a pegar las mismas respuestas NO las duplique
       (apartaría campos de bus que nadie va a usar);
     · que «Juan Perez» se reconozca como el «Juan Carlos Pérez
       Mejía» de la lista, para que no salga en «no han contestado»
       y se le llame a la casa por gusto.

   Uso:
     node _dev/servidor-estatico.js            (en otra terminal)
     node _dev/verifica-excursion-pantalla.js

   Necesita Playwright con Chromium. Si ya hay uno instalado por
   otro lado, se le pasa su ruta:
     METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-excursion-pantalla.js

   La otra mitad —el enlace y las cuentas, sin navegador— la
   comprueba _dev/verifica-excursion.js, que corre en un segundo.
═══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (c, m) => (c ? ok(m) : mal(m));

(async () => {
  const nav = await chromium.launch({ executablePath: process.env.METAS_CHROMIUM || undefined });
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_/.test(m.text())) errores.push('console: ' + m.text()); });

  /* ── Se siembra un grupo con lista, como el que ya tiene el maestro ── */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ nombre: 'José Policarpo Núñez' }));
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({
      v: 2, activo: 'GTEST1',
      grupos: [{
        id: 'GTEST1', escuela: 'Escuela Ramón Rosa', grado: '6', seccion: '1',
        lista: [
          { num: 1, nombre: 'Juan Carlos Pérez Mejía' },
          { num: 2, nombre: 'Keyla Fernández Andino' },
          { num: 3, nombre: 'Óscar Andino Cruz' },
        ],
        colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      }],
    }));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  /* ── Llegar a Mi aula → ✅ Controles ── */
  await page.evaluate(() => { switchView('view-admin'); if (typeof renderAdmin === 'function') renderAdmin(); });
  await page.waitForTimeout(400);
  await page.click('[data-adtab="ctrl"]');
  await page.waitForTimeout(300);

  const puerta = await page.locator('#exc-entrar').count();
  comprueba(puerta === 1, 'la puerta 🚌 aparece en ✅ Controles');

  await page.click('#exc-entrar');
  await page.waitForTimeout(300);
  comprueba(await page.locator('#exc-crear').count() === 1, 'la primera vez explica los 3 pasos');

  await page.click('#exc-crear');
  await page.waitForTimeout(300);
  comprueba(await page.locator('#exc-f-titulo').count() === 1, 'el formulario se abre solo la primera vez');

  /* ── Llenarlo como lo llenaría el maestro ── */
  await page.fill('#exc-f-titulo', 'Museo Ferroviario de El Progreso');
  await page.fill('#exc-f-fecha', '2026-08-15');
  await page.fill('#exc-f-limite', '2026-08-11');
  await page.fill('#exc-f-wa', '9999-8888');
  await page.fill('#exc-f-hsal', '7:00 a. m.');
  await page.fill('#exc-f-hreg', '4:00 p. m.');
  await page.fill('#exc-f-punto', 'Del portón de la escuela');
  await page.fill('#exc-f-precio', '150');
  await page.fill('#exc-f-cap', '45');
  await page.fill('#exc-f-incluye', 'Transporte y entrada al museo');
  await page.fill('#exc-f-llevar', 'Gorra, agua y su merienda');
  await page.fill('#exc-f-pago', 'De lunes a viernes, en el aula');
  await page.fill('#exc-f-gancho', '¡El tren que sale en el libro lo van a ver de cerca! 🚂');
  await page.click('.exc-ic[data-ic="🚂"]');
  await page.click('#exc-guardar');
  await page.waitForTimeout(500);

  const url = await page.inputValue('#exc-url');
  comprueba(/excursion\.html#/.test(url), 'sale el enlace para mandar');
  comprueba(await page.locator('.exc-cifra').count() === 3, 'el tablero muestra personas, buses y dinero');

  /* Validación: una fecha límite DESPUÉS de la salida no se puede guardar */
  await page.click('#exc-config > summary');
  await page.waitForTimeout(200);
  await page.fill('#exc-f-limite', '2026-08-20');
  await page.click('#exc-guardar');
  await page.waitForTimeout(300);
  const guardadoMal = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].excursion.limite);
  comprueba(guardadoMal === '2026-08-11', 'no deja poner el cierre DESPUÉS de la salida');
  await page.fill('#exc-f-limite', '2026-08-11');
  await page.click('#exc-guardar');
  await page.waitForTimeout(300);

  /* ── Ahora la madre, en otra pestaña sin nada de la app ── */
  const mama = await (await nav.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errMama = [];
  mama.on('pageerror', e => errMama.push(String(e)));
  await mama.goto(url, { waitUntil: 'domcontentloaded' });
  await mama.waitForTimeout(400);

  const titulo = await mama.locator('.b-titulo').textContent();
  comprueba(titulo.includes('Museo Ferroviario'), 'la madre ve a dónde van: ' + titulo);
  comprueba((await mama.locator('.b-fecha').textContent()).includes('sábado 15 de agosto'),
    've el día con su nombre, no una fecha en números');
  comprueba((await mama.locator('.urge').textContent()).includes('martes 11 de agosto'),
    've hasta cuándo puede contestar');
  comprueba((await mama.locator('.precio-grande').textContent()).includes('150'),
    've el aporte por persona');
  comprueba((await mama.locator('.gancho').textContent()).includes('tren'),
    've el gancho del maestro');
  comprueba(await mama.locator('#b-si').count() === 1, 'lo primero que ve es SÍ o NO, nada más');

  /* Contesta que sí */
  await mama.click('#b-si');
  await mama.waitForTimeout(250);
  await mama.fill('#f-nom', 'Juan Perez');           // sin tilde y sin el 2º apellido, como se escribe de verdad
  await mama.fill('#f-gra', '6');
  await mama.fill('#f-sec', '1');
  await mama.click('#b-sig');
  await mama.waitForTimeout(250);
  comprueba(await mama.locator('#c-al-n').count() === 1, 'le pregunta cuántos van, con botones');
  await mama.click('#c-ad-p');   // +1 adulto
  await mama.click('#c-ad-p');   // +2 adultos
  await mama.waitForTimeout(150);
  comprueba((await mama.locator('#tot').textContent()).includes('450'),
    'le dice cuánto va a pagar en total: ' + (await mama.locator('#tot').textContent()));
  await mama.click('#b-sig');
  await mama.waitForTimeout(250);

  /* El botón de WhatsApp: se lee el enlace en vez de abrirlo */
  const wa = await mama.evaluate(() => {
    let capturado = null;
    window.open = u => { capturado = u; return null; };
    document.getElementById('b-wa').click();
    return capturado;
  });
  comprueba(/^https:\/\/wa\.me\/50499998888\?text=/.test(wa),
    'el mensaje va al WhatsApp del maestro con su 504');
  const texto = decodeURIComponent(wa.split('?text=')[1]);
  comprueba(/#METAS\|SI\|1\|2\|6\|1\|Juan Perez/.test(texto), 'lleva la línea que se cuenta sola');
  await mama.waitForTimeout(250);
  comprueba((await mama.locator('.listo h3').textContent()).includes('Ya van apuntados'),
    'le confirma que quedó');

  /* Una segunda familia, que no puede ir */
  await mama.click('#b-otro');
  await mama.waitForTimeout(250);
  await mama.click('#b-no');
  await mama.waitForTimeout(250);
  await mama.fill('#f-nom', 'Óscar Andino Cruz');
  await mama.click('#b-sig');
  await mama.waitForTimeout(250);
  const wa2 = await mama.evaluate(() => {
    let c = null; window.open = u => { c = u; return null; };
    document.getElementById('b-wa').click(); return c;
  });
  const texto2 = decodeURIComponent(wa2.split('?text=')[1]);
  comprueba(/#METAS\|NO\|0\|0\|6\|1\|Óscar Andino Cruz/.test(texto2), 'el «no» también se manda');

  /* ── De vuelta con el maestro: pega las dos respuestas ── */
  await page.fill('#exc-pegar', '[8/8/26, 10:32] Mamá de Juan: ' + texto +
    '\n[8/8/26, 11:02] +504 9876-5432: ' + texto2);
  await page.click('#exc-sumar');
  await page.waitForTimeout(500);

  const cifras = await page.locator('.exc-c-n').allTextContents();
  comprueba(cifras[0] === '3', 'cuenta 3 personas confirmadas (leyó ' + cifras[0] + ')');
  comprueba(cifras[1] === '1', 'dice 1 bus (leyó ' + cifras[1] + ')');
  comprueba(/450/.test(cifras[2]), 'dice cuánto debería recoger (leyó ' + cifras[2] + ')');

  const cuerpo = await page.locator('#ad-tab-body').textContent();
  comprueba(/6º-1/.test(cuerpo), 'el grupo se escribe 6º-1, no «6 1» ni «61»');
  comprueba(/Keyla Fernández Andino/.test(cuerpo), 'avisa que Keyla no ha contestado');
  comprueba(!/#1 · Juan/.test(cuerpo), '«Juan Perez» se reconoce como el Juan Carlos de la lista');
  comprueba(/No pueden ir \(1\)/.test(cuerpo), 'aparta al que dijo que no');

  /* Pegar lo MISMO otra vez no puede duplicar */
  await page.fill('#exc-pegar', texto);
  await page.click('#exc-sumar');
  await page.waitForTimeout(400);
  const cifras2 = await page.locator('.exc-c-n').allTextContents();
  comprueba(cifras2[0] === '3', 'volver a pegar lo mismo NO duplica (leyó ' + cifras2[0] + ')');

  comprueba(errores.length === 0, 'Mi aula sin errores de JavaScript' +
    (errores.length ? ': ' + errores.slice(0, 3).join(' | ') : ''));
  comprueba(errMama.length === 0, 'la invitación sin errores de JavaScript' +
    (errMama.length ? ': ' + errMama.slice(0, 3).join(' | ') : ''));

  await nav.close();
  console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ Todo pasó') + '\n');
  process.exit(fallos ? 1 : 0);
})();
