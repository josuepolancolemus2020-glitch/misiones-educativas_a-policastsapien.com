/* ═══════════════════════════════════════════════════════════════
   🎟️ ¿CABEN SIETE BOLETOS EN CADA HOJA?

   Los boletos de la Convocatoria se imprimen en lote: el maestro manda
   los 42 de su salida y se va a hacer otra cosa. Van siete tiras por
   hoja carta, así que 42 familias tienen que dar SEIS hojas. Si una se
   pasara de alto y empujara a la siguiente a la otra página,
   el estropicio se descubre con las hojas ya impresas y la tinta
   gastada — y en una escuela pública eso no se repite «y ya».

   Es la misma regla de los informes del alumno (_dev/verifica-una-hoja.js)
   y por la misma razón; aquí la cuenta es 7 por hoja en vez de 1.

   Se comprueban además las tres cosas que hacen que el papel sirva:

   · EL FOLIO ES EL MISMO que el padre lleva en su teléfono. Si el
     boleto impreso dijera otro, en el portón no se puede comprobar
     nada y el papel no vale para lo que se imprimió.
   · LA COLILLA. La parte que el maestro recorta y se queda con la
     firma de quien pagó: es su respaldo cuando alguien diga que ya dio
     el dinero.
   · LA FORMA. Un boleto es una TIRA ancha. Salió primero en dos
     columnas, casi cuadrado y con un hueco en medio, y en el papel se
     ve enseguida que eso no es un boleto.

   Y lo mismo con los boletos EN BLANCO —los que el maestro llena a mano
   para las familias sin teléfono—: caben siete por hoja igual, llevan
   sus rayas para escribir, y su folio sale corrido, IMPRESO EN LAS DOS
   MITADES y sin poder chocar nunca con uno de la nube. Dos boletos con
   el mismo folio en el portón son justo lo que el folio existe para
   evitar.

   Se mide como la impresora: media `print`, el ancho útil de una carta
   y el número de páginas que escupe el PDF. Medir en la pantalla ancha
   MIENTE — las columnas se estiran y todo ocupa menos alto del que
   ocupará en el papel.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-boletos.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

let abrir;
try { ({ abrir } = require('./lib-navegador')); }
catch (_) {
  console.error('✘ Falta Playwright. Instálalo con:\n' +
    '    npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

const BASE = process.env.METAS_BASE || process.env.METAS_URL || 'http://localhost:8123';
const POR_HOJA = 7;
/* carta menos los márgenes de 10 mm del @page, a 96 puntos por pulgada */
const ANCHO = Math.round((8.5 - 20 / 25.4) * 96);
const ALTO = Math.round((11 - 20 / 25.4) * 96);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-boletos-'));
let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

/* Nombres largos de verdad y grupos de toda la escuela: un boleto con
   «Ana Paz» cabe siempre; el que aprieta es el de cuatro apellidos. */
const NOMS = ['Génesis Nicolle Zelaya Fúnez', 'Emanuel Josué Cruz Maldonado',
  'José Fernando Bautista Ordóñez', 'Ballotteth Camila Espino Turcios',
  'Cherlim Yamileth Osorio Carranza', 'Cristy Daniela Amador Villanueva',
  'María de los Ángeles Hernández Sabillón', 'Ada Sarai Sevilla'];
const GRADOS = ['Prebásica', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Media'];

function respuestas(n) {
  const r = [];
  for (let i = 0; i < n; i++) {
    r.push({
      va: true, alumno: NOMS[i % NOMS.length] + ' ' + (i + 1),
      grado: GRADOS[i % GRADOS.length], seccion: String((i % 3) + 1),
      personas: (i % 4) + 1, tel: '9999' + String(1000 + i), nota: '',
    });
  }
  return r;
}

/* La convocatoria más larga que puede haber: título de doce palabras,
   lugar largo y punto de embarque escrito a mano por el maestro. */
function convocatoria(resp) {
  return {
    id: 'V1', icono: '🚌',
    titulo: 'Excursión al Museo Ferroviario Nacional de la ciudad de El Progreso, Yoro',
    gancho: 'x', gana: ['a', 'b', 'c'],
    lugar: 'Museo Ferroviario Nacional de El Progreso',
    fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.',
    punto: 'Portón de abajo de la escuela, entrada a la colonia Colinas',
    aporte: 100, incluye: 'transporte, entrada', cobro: '', nota: '',
    limite: '2026-08-11', limiteHora: '16:00',
    dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
    wa: '50499998888', escuela: 'ESCUELA BÁSICA GUBERNAMENTAL JOHN ARNOLD COOK',
    capacidad: 55, costoBus: 3500, cupos: 120, arranque: 0,
    codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp, respFecha: '', creada: '2026-08-08',
  };
}

async function mide(browser, cuantos) {
  const page = await browser.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.route('**/rest/v1/rpc/**', route => route.abort('failed'));   /* la nube no se toca */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.convImprimirBoletos === 'function');

  /* Se le quita adPrintAbrir para quedarse con el HTML en vez de abrir
     una ventana: es lo mismo que hace la sonda de los informes. */
  const salida = await page.evaluate(c => {
    let h = '';
    const orig = window.adPrintAbrir;
    window.adPrintAbrir = x => { h = x; return null; };
    window.convImprimirBoletos(c);
    window.adPrintAbrir = orig;
    const folios = (c.resp || []).filter(x => x.va)
      .map(x => window.convFolio(c.codigo, window.convHuella(x.alumno, x.grado, x.seccion)));
    return { h, folios };
  }, convocatoria(respuestas(cuantos)));
  await page.close();
  errores.forEach(e => mal('error de página: ' + e));

  const archivo = path.join(TMP, 'boletos-' + cuantos + '.html');
  fs.writeFileSync(archivo, salida.h);
  const pdf = path.join(TMP, 'boletos-' + cuantos + '.pdf');

  const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  await hoja.emulateMedia({ media: 'print' });
  await hoja.goto('file://' + archivo);
  const datos = await hoja.evaluate(() => ({
    boletos: document.querySelectorAll('.bo').length,
    colillas: document.querySelectorAll('.bo-col').length,
    firmas: document.querySelectorAll('.bo-firma').length,
    alto: Math.max(...[...document.querySelectorAll('.bo')].map(n => Math.round(n.getBoundingClientRect().height))),
    ancho: Math.max(...[...document.querySelectorAll('.bo')].map(n => Math.round(n.getBoundingClientRect().width))),
    /* Que ningún texto se salga de su boleto: un nombre largo que se
       desborde tapa el folio de al lado y el papel deja de servir. */
    desborde: [...document.querySelectorAll('.bo')].filter(n =>
      n.scrollHeight > n.clientHeight + 2 || n.scrollWidth > n.clientWidth + 2).length,
    texto: document.body.textContent,
  }));
  await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
  await hoja.close();

  const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const esperadas = Math.ceil(cuantos / POR_HOJA);

  console.log('\n  ── ' + cuantos + ' familias ──');
  comprueba(datos.boletos === cuantos, 'salen los ' + cuantos + ' boletos (salieron ' + datos.boletos + ')');
  comprueba(paginas === esperadas,
    'en ' + esperadas + ' hoja' + (esperadas === 1 ? '' : 's') + ' carta (el PDF trajo ' + paginas + ')');
  comprueba(datos.alto <= ALTO, 'ningún boleto se pasa del alto de la hoja (el más alto: ' + datos.alto + 'px de ' + ALTO + ')');
  /* Un boleto es una TIRA, no un cuadro. Salió primero casi cuadrado y
     con un hueco en medio; en el papel se ve enseguida que eso no tiene
     forma de boleto. Aquí se le exige que sea al menos tres veces más
     ancho que alto para que no vuelva a pasar sin que nadie se entere. */
  const forma = datos.ancho / datos.alto;
  comprueba(forma >= 3,
    'y tiene forma de tira: ' + datos.ancho + ' × ' + datos.alto + 'px (' + forma.toFixed(1) + ' a 1)');
  comprueba(datos.desborde === 0, 'y a ninguno se le sale el texto de su recuadro');
  comprueba(datos.colillas === cuantos && datos.firmas === cuantos,
    'cada boleto lleva su colilla con la raya de la firma');

  /* LO QUE SOSTIENE TODO: el folio impreso es el del teléfono. */
  const faltan = salida.folios.filter(f => datos.texto.indexOf(f) < 0);
  comprueba(!faltan.length,
    'los ' + salida.folios.length + ' folios salen impresos, uno por boleto' +
    (faltan.length ? ' (faltó ' + faltan[0] + ')' : ''));
  comprueba(/COLILLA/.test(datos.texto) && /recibí L 100/i.test(datos.texto),
    'y la colilla dice cuánto se recibió, que es el respaldo del maestro');
}

/* ── Los boletos EN BLANCO ──
   Son para las familias sin teléfono, que el maestro apunta él. Se les
   exige lo mismo que a los otros —siete por hoja, forma de tira, colilla
   con firma— y dos cosas más que solo tienen ellos: sitio para escribir
   a mano, y un folio corrido que salga en las DOS mitades sin repetirse
   nunca ni chocar con uno de la nube. */
async function mideBlancos(browser, cuantos, desde) {
  const page = await browser.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.route('**/rest/v1/rpc/**', route => route.abort('failed'));   /* la nube no se toca */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.convImprimirBlancos === 'function');

  const salida = await page.evaluate(([c, n, d0]) => {
    let h = '';
    const orig = window.adPrintAbrir;
    window.adPrintAbrir = x => { h = x; return null; };
    window.convImprimirBlancos(c, n, d0);
    window.adPrintAbrir = orig;
    const folios = [];
    for (let i = 0; i < n; i++) folios.push(window.convFolioBlanco(c, d0 + i));
    /* Los de la nube, para comprobar que ninguno coincide: los blancos
       llevan dígitos y aquellos son cuatro letras de CONV_ALFA. */
    const nube = (c.resp || []).filter(x => x.va)
      .map(x => window.convFolio(c.codigo, window.convHuella(x.alumno, x.grado, x.seccion)));
    return { h, folios, nube };
  }, [convocatoria(respuestas(42)), cuantos, desde]);
  await page.close();
  errores.forEach(e => mal('error de página: ' + e));

  const archivo = path.join(TMP, 'blancos-' + cuantos + '.html');
  fs.writeFileSync(archivo, salida.h);
  const pdf = path.join(TMP, 'blancos-' + cuantos + '.pdf');

  const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  await hoja.emulateMedia({ media: 'print' });
  await hoja.goto('file://' + archivo);
  const datos = await hoja.evaluate(() => ({
    boletos: document.querySelectorAll('.bo').length,
    colillas: document.querySelectorAll('.bo-col').length,
    firmas: document.querySelectorAll('.bo-firma').length,
    /* Cuatro rayas por tira: dos en la colilla del maestro (alumno y
       grupo·personas·L) y dos en la parte de la familia (nombre y
       grupo). Sin ellas el boleto no se puede llenar a mano. */
    rayas: document.querySelectorAll('.bo-lin').length,
    huecos: document.querySelectorAll('.bo-hueco').length,
    alto: Math.max(...[...document.querySelectorAll('.bo')].map(n => Math.round(n.getBoundingClientRect().height))),
    ancho: Math.max(...[...document.querySelectorAll('.bo')].map(n => Math.round(n.getBoundingClientRect().width))),
    /* Aquí el desborde es lo que más aprieta: la colilla mide 34 mm de
       ancho y las rayas tienen que caber con su rótulo sin empujar la
       firma fuera del papel. */
    desborde: [...document.querySelectorAll('.bo')].filter(n =>
      n.scrollHeight > n.clientHeight + 2 || n.scrollWidth > n.clientWidth + 2).length,
    /* Que el nombre no venga escrito: si saliera un nombre, el maestro
       le entregaría a una familia el boleto de otra. */
    nombres: document.querySelectorAll('.bo-nom').length,
    texto: document.body.textContent,
    /* El folio de cada tira, contado dentro de la tira: tiene que estar
       en la colilla y en la caja de la derecha, que es lo que empareja
       los dos papeles cuando alguien discuta en el portón. */
    porTira: [...document.querySelectorAll('.bo')].map(n => ({
      col: (n.querySelector('.bo-col-f') || {}).textContent || '',
      caja: (n.querySelector('.bo-folio b') || {}).textContent || '',
    })),
  }));
  await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
  await hoja.close();

  const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const esperadas = Math.ceil(cuantos / POR_HOJA);

  console.log('\n  ── ' + cuantos + ' boletos en blanco, desde el ' + desde + ' ──');
  comprueba(datos.boletos === cuantos, 'salen los ' + cuantos + ' boletos (salieron ' + datos.boletos + ')');
  comprueba(paginas === esperadas,
    'en ' + esperadas + ' hoja' + (esperadas === 1 ? '' : 's') + ' carta (el PDF trajo ' + paginas + ')');
  comprueba(datos.alto <= ALTO, 'ninguno se pasa del alto de la hoja (el más alto: ' + datos.alto + 'px de ' + ALTO + ')');
  const forma = datos.ancho / datos.alto;
  comprueba(forma >= 3, 'y tiene forma de tira: ' + datos.ancho + ' × ' + datos.alto + 'px (' + forma.toFixed(1) + ' a 1)');
  comprueba(datos.desborde === 0, 'y a ninguno se le sale nada del recuadro');
  comprueba(datos.colillas === cuantos && datos.firmas === cuantos,
    'cada uno lleva su colilla con la raya de la firma');
  comprueba(datos.rayas === cuantos * 4 && datos.huecos === cuantos * 2,
    'y sus rayas para escribir a mano el nombre, el grupo y las personas (salieron ' +
    datos.rayas + ' rayas y ' + datos.huecos + ' huecos)');
  comprueba(datos.nombres === 0, 'ninguno viene con un nombre ya escrito');

  /* LO QUE SOSTIENE TODO: un folio, dos mitades, y ninguno repetido. */
  const mal2 = datos.porTira.filter((p, i) =>
    p.col !== salida.folios[i] || p.caja !== salida.folios[i]);
  comprueba(!mal2.length,
    'el folio sale impreso en la colilla Y en el boleto, y son el mismo' +
    (mal2.length ? ' (falló ' + JSON.stringify(mal2[0]) + ')' : ''));
  comprueba(new Set(salida.folios).size === cuantos,
    'los ' + cuantos + ' folios son distintos entre sí');
  const choque = salida.folios.filter(f => salida.nube.indexOf(f) >= 0);
  comprueba(!choque.length,
    'y ninguno choca con un folio de los que contestaron por el enlace' +
    (choque.length ? ' (chocó ' + choque[0] + ')' : ''));
  comprueba(/COLILLA/.test(datos.texto) && /firma de quien paga/.test(datos.texto),
    'la colilla sigue siendo el respaldo del maestro, con su firma');
}

(async () => {
  const browser = await abrir();
  console.log('🎟️ LOS BOLETOS DE LA CONVOCATORIA — seis por hoja carta, medido en el PDF');
  try {
    await mide(browser, 42);      /* un aula entera: seis hojas clavadas */
    await mide(browser, 7);       /* la hoja justa: ni una de más */
    await mide(browser, 8);       /* uno más: dos hojas, no tres */
    await mideBlancos(browser, 14, 1);    /* dos hojas de boletos a mano */
    await mideBlancos(browser, 7, 15);    /* la segunda tanda: sigue donde quedó la primera */
    await mideBlancos(browser, 8, 96);    /* tres cifras: el folio no se parte ni se sale */
  } finally {
    await browser.close();
    fs.rmSync(TMP, { recursive: true, force: true });
  }
  console.log('\n' + (fallos ? '✘ ' + fallos + ' problema(s) con los boletos' : '✅ los boletos caben donde tienen que caber'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
