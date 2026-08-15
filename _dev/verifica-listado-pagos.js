/* ═══════════════════════════════════════════════════════════════
   💵 EL LISTADO DE APORTES: ¿SIRVE EN EL PAPEL?

   La pantalla de 💵 Quién ya pagó sirve para ANOTAR; esta hoja sirve
   para COBRAR, que es otra cosa. Se cobra de pie, en el recreo o en el
   portón, sin la aplicación delante y con el lápiz en la mano. Lo que
   aquí se vigila es lo que hace que ese papel sirva o no sirva:

   · QUE NO SE SALGA DEL PAPEL. La tabla lleva nueve columnas y la
     última es la firma de quien paga. Si la tabla se pasa de los 196 mm
     útiles de una carta, lo que se corta por la derecha es justo esa
     firma —y una hoja de dinero sin firma no respalda a nadie—.
   · QUE NO GASTE HOJAS DE BALDE. Cuando contesta la escuela entera son
     doce grupos de tres o cuatro familias, y una hoja por grupo eran
     doce hojas con dos dedos de tinta y el resto en blanco. Compacto
     tiene que caber en las hojas que se le miden aquí; cada hoja de más
     se paga de un bolsillo que no da para eso.
   · QUE LA OTRA FORMA SIGA SIRVIENDO. Con el botón «una hoja por
     grado» (body.reparto) cada grupo vuelve a empezar hoja, con su
     encabezado y su firma: es la que se reparte, la de 6º al maestro de
     6º. Las dos formas dicen lo MISMO; lo único que cambia es dónde
     parte la hoja.
   · QUE ESTÉN TODOS LOS DATOS. Nombre, cuántos van, folio del boleto,
     teléfono, lo que le toca, lo que dio y lo que debe. Falta uno y hay
     que volver al teléfono, que es lo que esta hoja existe para evitar.
   · QUE LAS CUENTAS CUADREN. La suma de los grados tiene que dar el
     total del resumen. Un total que no cuadra se descubre delante del
     director.
   · QUE AL QUE NO HA PAGADO SE LE DEJE SU HUECO. Esta hoja se usa
     cobrando: lo que ya entró va impreso con su fecha, y lo que falta
     es una raya donde se escribe.

   Se mide como la impresora: media `print`, el ancho útil de una carta
   y el número de páginas que escupe el PDF. Medir en la pantalla ancha
   MIENTE — las columnas se estiran y todo ocupa menos de lo que va a
   ocupar en el papel.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-listado-pagos.js
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
/* carta menos los márgenes de 10 mm del @page, a 96 puntos por pulgada */
const ANCHO = Math.round((8.5 - 20 / 25.4) * 96);
const ALTO = Math.round((11 - 20 / 25.4) * 96);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-aportes-'));
let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

/* Nombres largos de verdad: el que aprieta la columna no es «Ana Paz»,
   es el de cuatro apellidos, y en un aula hay varios. */
const NOMS = ['Génesis Nicolle Zelaya Fúnez', 'Emanuel Josué Cruz Maldonado',
  'José Fernando Bautista Ordóñez', 'Ballotteth Camila Espino Turcios',
  'Cherlim Yamileth Osorio Carranza', 'Cristy Daniela Amador Villanueva',
  'María de los Ángeles Hernández Sabillón', 'Ada Sarai Sevilla'];

/* La escuela entera contesta: por eso hay grados que no son el del
   maestro, que es justo lo que la colecta de Economía no sabe hacer.
   La sección se saca de una vuelta distinta a la del grado para que
   salgan grupos de verdad (6º-1 y 6º-2 son dos listas, no una). */
function respuestas(n, grados, secs) {
  const s = Math.max(1, secs || 1);
  const r = [];
  for (let i = 0; i < n; i++) {
    r.push({
      va: true, alumno: NOMS[i % NOMS.length] + ' ' + (i + 1),
      grado: grados[i % grados.length], seccion: String((Math.floor(i / grados.length) % s) + 1),
      personas: (i % 4) + 1, tel: '9999' + String(1000 + i), nota: '',
    });
  }
  return r;
}

function convocatoria(resp, pagos) {
  return {
    id: 'V1', icono: '🚌',
    titulo: 'Excursión al Museo Ferroviario Nacional de la ciudad de El Progreso, Yoro',
    gancho: 'x', gana: ['a', 'b', 'c'],
    lugar: 'Museo Ferroviario Nacional de El Progreso',
    fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.',
    punto: 'Portón de abajo de la escuela, entrada a la colonia Colinas',
    aporte: 250, incluye: 'transporte en bus, entrada al museo', cobro: '', nota: '',
    limite: '2026-08-11', limiteHora: '16:00',
    dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
    wa: '50499998888', escuela: 'ESCUELA BÁSICA GUBERNAMENTAL JOHN ARNOLD COOK',
    capacidad: 55, costoBus: 3500, cupos: 120, arranque: 0, manual: [],
    pagos: pagos || {},
    codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp, respFecha: '', creada: '2026-08-08',
  };
}

/* Un aula de verdad: unos pagaron entero, otros abonaron a medias y
   unos cuantos no han dado nada. Las tres cosas tienen que salir
   distintas en el papel, o la hoja no dice a quién hay que cobrarle. */
function pagosDe(resp) {
  const p = {};
  resp.forEach((x, i) => {
    if (i % 3 === 0) p[huella(x)] = { monto: 250 * x.personas, fecha: '2026-08-12' };
    else if (i % 3 === 1) p[huella(x)] = { monto: 100, fecha: '2026-08-13' };
  });
  return p;
}
function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function huella(x) {
  return (norm(x.alumno) + '|' + norm(x.grado) + '|' + norm(x.seccion)).slice(0, 120);
}

/* Cuenta las páginas que escupe el PDF, que es la verdad de la
   impresora: lo pintado en pantalla siempre parece caber. */
async function paginasDe(hoja, pdf) {
  await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
  return (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
}

async function mide(browser, cuantos, grados, secs, maxHojas, etiqueta) {
  const resp = respuestas(cuantos, grados, secs);
  const c = convocatoria(resp, pagosDe(resp));

  const page = await browser.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.route('**/rest/v1/rpc/**', route => route.abort('failed'));   /* la nube no se toca */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.convImprimirListado === 'function');

  /* Se le quita adPrintAbrir para quedarse con el HTML en vez de abrir
     una ventana: es lo mismo que hacen las demás sondas de impresión. */
  const salida = await page.evaluate(cc => {
    let h = '';
    const orig = window.adPrintAbrir;
    window.adPrintAbrir = x => { h = x; return null; };
    window.convImprimirListado(cc);
    window.adPrintAbrir = orig;
    const van = (cc.resp || []).filter(x => x.va);
    return {
      h,
      folios: van.map(x => window.convFolio(cc.codigo, window.convHuella(x.alumno, x.grado, x.seccion))),
      nombres: van.map(x => x.alumno),
      tels: van.map(x => x.tel),
      /* Lo que dice la PANTALLA. Si el papel dijera otra cosa, el maestro
         tendría dos verdades y una de ellas se firma en la Dirección. */
      pantalla: window.convTotales(cc),
      grupos: window.convPorGrado(van).map(g => ({
        k: g.k, t: window.convGradoTotales(cc, g.filas),
      })),
    };
  }, c);
  await page.close();
  errores.forEach(e => mal('error de página: ' + e));

  const base = 'aportes-' + cuantos + '-' + grados.length + '-' + secs;
  const archivo = path.join(TMP, base + '.html');
  fs.writeFileSync(archivo, salida.h);
  const pdf = path.join(TMP, base + '.pdf');

  const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  await hoja.emulateMedia({ media: 'print' });
  await hoja.goto('file://' + archivo);
  const lee = () => hoja.evaluate(() => {
    /* Lo que NO se ve no cuenta: las dos formas llevan en el papel las
       mismas piezas y se esconden con CSS según la que esté puesta. */
    const visible = n => n.getClientRects().length > 0;
    return {
      bloques: [...document.querySelectorAll('.hoja')].filter(visible).length,
      huecos: document.querySelectorAll('.hueco').length,
      firmas: [...document.querySelectorAll('.firmas')].filter(visible).length,
      encabezados: [...document.querySelectorAll('.enc')].filter(visible).length,
      sumas: [...document.querySelectorAll('.suma')].filter(visible).length,
      /* Lo que de verdad cuesta caro: que la tabla se pase del ancho del
         papel. Lo que se corta por la derecha es la columna de la firma. */
      desborde: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      anchoTabla: Math.max(...[...document.querySelectorAll('table')].map(n => Math.round(n.getBoundingClientRect().width))),
      /* Ningún renglón puede quedar más alto que la hoja: uno solo así
         arrastraría a los demás y partiría la lista por donde no toca. */
      filaMasAlta: Math.max(...[...document.querySelectorAll('tbody tr')]
        .map(n => Math.round(n.getBoundingClientRect().height))),
      texto: document.body.textContent.replace(/\s+/g, ' '),
    };
  });
  const datos = await lee();
  const paginas = await paginasDe(hoja, pdf);

  /* ── Y ahora la otra forma: una hoja por grado, para repartirlas ── */
  await hoja.evaluate(() => document.body.classList.add('reparto'));
  const rep = await lee();
  const paginasRep = await paginasDe(hoja, path.join(TMP, base + '-reparto.pdf'));
  await hoja.evaluate(() => document.body.classList.remove('reparto'));
  await hoja.close();

  /* Los GRUPOS son grado + sección: «6º-1» y «6º-2» son dos hojas, dos
     maestros y dos listas, aunque los dos sean sexto. */
  const grupos = salida.grupos.length;
  console.log('\n  ── ' + etiqueta + ' (' + grupos + ' grupos) ──');

  /* ── COMPACTO: lo que sale por defecto ── */
  comprueba(paginas <= maxHojas,
    'compacto cabe en ' + maxHojas + ' hoja' + (maxHojas === 1 ? '' : 's') +
    ' (el PDF trajo ' + paginas + ')');
  comprueba(grupos < 3 || paginas < grupos + 1,
    'y gasta menos que una hoja por grado: ' + paginas + ' contra ' + (grupos + 1));
  comprueba(datos.encabezados === 1,
    'el encabezado del evento va UNA vez, no uno por grupo (salieron ' + datos.encabezados + ')');
  comprueba(datos.firmas === 1,
    'y una sola raya de firma, al final del documento (salieron ' + datos.firmas + ')');

  /* ── REPARTIENDO: cada grado con su hoja, su encabezado y su firma ── */
  comprueba(rep.bloques === grupos + 1,
    'repartiendo salen el resumen y una hoja por grupo: ' + (grupos + 1) +
    ' (salieron ' + rep.bloques + ')');
  comprueba(paginasRep >= grupos + 1,
    'y ningún grupo comparte hoja con otro (' + paginasRep + ' páginas para ' + grupos + ' grupos)');
  comprueba(rep.encabezados === grupos + 1 && rep.firmas === grupos + 1,
    'cada hoja repartida lleva su encabezado y su firma: la de 6º viaja sola al maestro de 6º');
  /* El renglón de totales de cada grupo solo sale repartiendo: compacto
     lo dice la franja del grado, y repetirlo doce veces gasta hoja. */
  comprueba(datos.sumas === 1 && rep.sumas === grupos + 1,
    'los totales de cada grupo salen repartiendo y no compacto (' +
    datos.sumas + ' compacto, ' + rep.sumas + ' repartiendo)');
  comprueba(rep.texto.replace(/Sale compacto.*?posibles\./g, '').indexOf('Firma de quien paga') >= 0 &&
    salida.nombres.every(n => rep.texto.indexOf(n) >= 0),
    'y dice lo mismo que la compacta: los mismos nombres y las mismas columnas');

  /* EL ANCHO: lo que se sale por la derecha es la firma. */
  comprueba(datos.desborde === 0,
    'nada se sale del ancho del papel (se salían ' + datos.desborde + 'px)');
  comprueba(datos.anchoTabla <= ANCHO,
    'la tabla cabe en la carta: ' + datos.anchoTabla + 'px de ' + ANCHO);
  comprueba(datos.filaMasAlta < ALTO / 3,
    'ninguna fila se infla (la más alta: ' + datos.filaMasAlta + 'px)');

  /* TODOS LOS DATOS: sin uno hay que volver al teléfono. */
  const sinNombre = salida.nombres.filter(n => datos.texto.indexOf(n) < 0);
  comprueba(!sinNombre.length,
    'están los ' + salida.nombres.length + ' alumnos' +
    (sinNombre.length ? ' (faltó ' + sinNombre[0] + ')' : ''));
  const sinFolio = salida.folios.filter(f => datos.texto.indexOf(f) < 0);
  comprueba(!sinFolio.length,
    'y sus folios de boleto, que es lo que se compara en el portón' +
    (sinFolio.length ? ' (faltó ' + sinFolio[0] + ')' : ''));
  const sinTel = salida.tels.filter(t => datos.texto.indexOf(t) < 0);
  comprueba(!sinTel.length,
    'y sus teléfonos, para cobrarle al que no aparece' +
    (sinTel.length ? ' (faltó ' + sinTel[0] + ')' : ''));
  comprueba(/Firma de quien paga/.test(datos.texto),
    'está la columna donde firma quien paga');

  /* LAS CUENTAS: la suma de los grados es el total del resumen. */
  const sumaToca = salida.grupos.reduce((a, g) => a + g.t.toca, 0);
  const sumaPag = salida.grupos.reduce((a, g) => a + g.t.pagado, 0);
  const sumaDebe = salida.grupos.reduce((a, g) => a + g.t.debe, 0);
  comprueba(sumaToca === salida.pantalla.dinero,
    'lo que se espera cuadra con la pantalla: ' + sumaToca + ' = ' + salida.pantalla.dinero);
  comprueba(sumaPag === salida.pantalla.recogido,
    'lo recogido también: ' + sumaPag + ' = ' + salida.pantalla.recogido);
  comprueba(sumaDebe === salida.pantalla.falta,
    'y lo que falta por cobrar: ' + sumaDebe + ' = ' + salida.pantalla.falta);
  /* El papel tiene que DECIR esas cifras, no solo calcularlas bien */
  const totTxt = 'TOTAL';
  comprueba(datos.texto.indexOf(totTxt) >= 0 && /Resumen del aporte/.test(datos.texto),
    'y el papel abre con el resumen y su total, que es la hoja que se firma');

  /* LA RAYA DEL QUE DEBE: esta hoja se usa cobrando. La lleva TODO el
     que deba algo, también el que abonó a medias: va a traer el resto y
     hay que apuntarlo en su renglón, de pie y en el portón. */
  comprueba(datos.huecos === salida.pantalla.deudoras,
    'todo el que debe algo lleva su raya para escribir lo que dé (' +
    datos.huecos + ' rayas para ' + salida.pantalla.deudoras + ' familias con deuda)');
  comprueba(/12\/08\/2026/.test(datos.texto),
    'y al que ya pagó le sale impreso el día en que entró el dinero');
}

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  console.log('💵 EL LISTADO DE APORTES POR GRADO — medido en el PDF');
  try {
    /* LA ESCUELA ENTERA, que es de donde vienen las respuestas y el caso
       que trajo esta regla: doce grupos de tres o cuatro familias eran
       trece hojas casi en blanco. Compacto tiene que caber en tres. */
    await mide(browser, 42, ['1', '2', '3', '4', '5', '6'], 2, 3, '42 familias de seis grados');
    /* El maestro que solo lleva el suyo, con sus dos secciones */
    await mide(browser, 30, ['6'], 2, 2, '30 familias de sexto');
    /* EL AULA GRANDE DE VERDAD: 43 familias de UN solo grupo. Es la que
       pasa a la segunda hoja, y donde se ve si el encabezado se repite. */
    await mide(browser, 43, ['6'], 1, 2, '43 familias de un solo grupo');
  } finally {
    await browser.close();
    fs.rmSync(TMP, { recursive: true, force: true });
  }
  console.log('\n' + (fallos ? '✘ ' + fallos + ' problema(s) con el listado'
    : '✅ el listado sirve para cobrar con él en la mano'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
