/* ═══════════════════════════════════════════════════════════════
   🎟️ ¿CABEN SEIS BOLETOS EN CADA HOJA?

   Los boletos de la Convocatoria se imprimen en lote: el maestro manda
   los 42 de su salida y se va a hacer otra cosa. Van seis por hoja
   carta, así que 42 familias tienen que dar SIETE hojas. Si uno se
   pasara de alto y arrastrara a los de su fila a la página siguiente,
   el estropicio se descubre con las hojas ya impresas y la tinta
   gastada — y en una escuela pública eso no se repite «y ya».

   Es la misma regla de los informes del alumno (_dev/verifica-una-hoja.js)
   y por la misma razón; aquí la cuenta es 6 por hoja en vez de 1.

   Se comprueban además las dos cosas que hacen que el papel sirva:

   · EL FOLIO ES EL MISMO que el padre lleva en su teléfono. Si el
     boleto impreso dijera otro, en el portón no se puede comprobar
     nada y el papel no vale para lo que se imprimió.
   · LA COLILLA. La parte que el maestro recorta y se queda con la
     firma de quien pagó: es su respaldo cuando alguien diga que ya dio
     el dinero.

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

let chromium;
try { ({ chromium } = require('playwright')); }
catch (_) {
  console.error('✘ Falta Playwright. Instálalo con:\n' +
    '    npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

const BASE = process.env.METAS_BASE || process.env.METAS_URL || 'http://localhost:8123';
const POR_HOJA = 6;
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
  comprueba(datos.desborde === 0, 'y a ninguno se le sale el texto de su recuadro');
  comprueba(datos.colillas === cuantos && datos.firmas === cuantos,
    'cada boleto lleva su colilla con la raya de la firma');

  /* LO QUE SOSTIENE TODO: el folio impreso es el del teléfono. */
  const faltan = salida.folios.filter(f => datos.texto.indexOf(f) < 0);
  comprueba(!faltan.length,
    'los ' + salida.folios.length + ' folios salen impresos, uno por boleto' +
    (faltan.length ? ' (faltó ' + faltan[0] + ')' : ''));
  comprueba(/COLILLA/.test(datos.texto) && /Recibí L 100/.test(datos.texto),
    'y la colilla dice cuánto se recibió, que es el respaldo del maestro');
}

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  console.log('🎟️ LOS BOLETOS DE LA CONVOCATORIA — seis por hoja carta, medido en el PDF');
  try {
    await mide(browser, 42);      /* un aula entera: siete hojas clavadas */
    await mide(browser, 6);       /* la hoja justa: ni una de más */
    await mide(browser, 7);       /* uno más: dos hojas, no tres */
  } finally {
    await browser.close();
    fs.rmSync(TMP, { recursive: true, force: true });
  }
  console.log('\n' + (fallos ? '✘ ' + fallos + ' problema(s) con los boletos' : '✅ los boletos caben donde tienen que caber'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
