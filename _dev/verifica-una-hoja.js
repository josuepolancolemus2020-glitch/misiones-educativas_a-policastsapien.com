/* ═══════════════════════════════════════════════════════════════
   📄 ¿CADA INFORME CABE EN UNA HOJA CARTA?

   Los informes de 📈 Estadísticas se imprimen en lote: el maestro manda
   los 42 de su grado y se va a hacer otra cosa. Si una hoja se parte, la
   firma queda huérfana en la página siguiente y el estropicio se
   descubre con las 52 hojas ya impresas y la tinta gastada. Pasó de
   verdad, y por eso existe esta herramienta.

   Comprueba las dos hojas:
     · el informe del ALUMNO, en un lote de 42 con datos de todos los
       largos (notas bajas, faltas, NSP, conducta, tomas de lectura);
     · el informe del GRADO, con el año escolar completo de faltas y la
       observación del docente en su tope.

   Se mide como la impresora: media `print`, el ancho útil de una carta
   y el número de páginas que escupe el PDF. Medir en la pantalla ancha
   MIENTE — las columnas se estiran y el texto ocupa menos alto del que
   ocupará en el papel.

   Uso:
     node _dev/servidor-estatico.js        (en otra terminal)
     node _dev/verifica-una-hoja.js

   Necesita Playwright con Chromium (npm i -D playwright && npx
   playwright install chromium). Si no está, la herramienta lo dice y no
   se hace la ilusión de haber comprobado nada. Si ya hay un Chromium
   instalado por otro lado, se le pasa su ruta:
     METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-una-hoja.js
═══════════════════════════════════════════════════════════════ */
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

const BASE = process.env.METAS_URL || 'http://localhost:8123';
/* carta menos los márgenes de 10 mm del @page, a 96 puntos por pulgada */
const ANCHO = Math.round((8.5 - 20 / 25.4) * 96);
const ALTO = Math.round((11 - 20 / 25.4) * 96);
/* Un navegador que ignore el @page pone sus propios márgenes: Firefox usa
   12,7 mm y deja 960 px. La hoja tiene que caber también ahí, así que el
   aviso salta antes del tope real. */
const ALTO_PRUDENTE = Math.round((11 - 25.4 / 25.4) * 96);

const MATS = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas', 'Ciencias Sociales',
              'Ciencias Naturales', 'Educación Física', 'Educación Cívica'];
const NOMS = ['Génesis Nicolle Zelaya Fúnez', 'Emanuel Josué Cruz Maldonado', 'José Fernando Bautista Ordóñez',
              'Alberto Antonio Rivera Zambrano', 'Ballotteth Camila Espino Turcios', 'Brian Alexander Cárcamo Paz',
              'Cherlim Yamileth Osorio Carranza', 'Cristy Daniela Amador Villanueva', 'Carlos Eduardo Fuentes Andino',
              'Eduar Josué Portillo Guillén', 'Fredy Alexander Mejía Ponce', 'Ehivi Nahomy Interiano Bardales'];
const RASGOS = ['Responsabilidad', 'Respeto', 'Solidaridad', 'Honestidad'];
const OBS_TOPE = ('La alumna Nº 42 y los alumnos Estarlin y Kenny están en mi lista pero no aparecen ' +
  'registrados en el SACE. Su inscripción corresponde a la Dirección. En julio hubo cuatro días sin ' +
  'clases por el paro de transporte y se informó a la Dirección el 3 de julio. Queda pendiente la ' +
  'matrícula de los tres alumnos, gestión que no depende del docente de grado.').slice(0, 500);

/* Un grupo de 42 con datos de todos los largos: un tercio con materias
   bajo 70, desplomes de un parcial a otro, faltas repartidas en los
   meses que se pidan, conducta baja, controles sin cumplir y tomas de
   lectura. Así el lote trae informes cortos y largos, que es lo que hay
   en un aula de verdad. */
function grupo(meses, obs) {
  const lista = [];
  for (let i = 1; i <= 42; i++) lista.push({ num: i, nombre: NOMS[(i - 1) % NOMS.length], sexo: i % 2 ? 'F' : 'M' });
  const notas = {};
  ['I', 'II', 'III', 'IV'].forEach((p, pi) => {
    notas[p] = {};
    MATS.forEach((c, ci) => {
      notas[p][c] = {};
      lista.forEach(a => {
        const duro = a.num % 3 === 1;
        const base = duro ? 45 + ((a.num + ci) % 20) : 70 + ((a.num * 3 + ci * 7) % 28);
        notas[p][c][a.num] = Math.max(10, Math.min(100, base - (pi === 1 && a.num % 4 === 0 ? 45 : 0) + pi * 2));
      });
    });
    notas[p]['Inasistencias'] = {};
    lista.forEach(a => { notas[p]['Inasistencias'][a.num] = (a.num % 5) * 4; });
    RASGOS.forEach(r => {
      notas[p][r] = {};
      lista.forEach(a => { notas[p][r][a.num] = a.num % 6 === 0 ? 'NM' : 'S'; });
    });
  });
  const asistencia = [];
  meses.forEach((mes, mi) => {
    for (let dia = 1; dia <= 5; dia++) {
      const aus = {};
      lista.forEach(a => {
        if ((a.num + dia * 3 + mi * 5) % 4 === 0) aus[a.num] = 'A';
        else if ((a.num + dia * 7 + mi) % 6 === 0) aus[a.num] = 'E';
      });
      asistencia.push({ f: '2026-' + mes + '-' + String(dia * 5).padStart(2, '0'), aus });
    }
  });
  const controles = [1, 2, 3, 4].map(i => ({
    nombre: 'Control ' + i, icono: '✅', fecha: '2026-0' + i + '-10',
    datos: Object.fromEntries(lista.filter(a => a.num % 3 === 0).map(a => [a.num, '1'])),
  }));
  const lectura = lista.filter(a => a.num % 2 === 0).flatMap(a => ([
    { f: '2026-05-06', num: a.num, titulo: 'Morazán en la mochila', seg: 60, palabras: 74, total: 133, errores: 4, ppm: 74, comp: 4, compDe: 5 },
    { f: '2026-08-07', num: a.num, titulo: 'La Ciudad Blanca y los que no la buscan', seg: 60, palabras: 61, total: 131, errores: 6, ppm: 61, comp: 2, compDe: 5 },
  ]));
  return { v: 2, activo: 'G1', grupos: [{
    id: 'G1', escuela: 'ESCUELA BÁSICA GUBERNAMENTAL JOHN ARNOLD COOK', grado: '6', seccion: '1', materias: MATS,
    boleta: { docente: 'Josué Polanco Lemus', director: 'Gerardo Sabillón', anio: '2026' },
    lista, notas, asistencia, controles, lectura, obsGrado: obs || '',
    colectas: [], bitacora: [],
  }] };
}

/* Evaluaciones con NSP: dan la observación más larga del informe */
function plan() {
  const students = [];
  for (let i = 1; i <= 42; i++) students.push({ num: i, nota: i % 4 === 0 ? 'NSP' : 60 + (i % 40) });
  const uno = (ev, forma) => ({
    t: '2026-06-01T10:00:00.000Z', fechaPrueba: '2026-06-01', parcial: 'II',
    evaluacion: ev, forma, materia: 'Español', grado: '6', seccion: '1', students,
  });
  return { analisis: [uno('Los Adverbios', 'Forma 3'), uno('Los Sustantivos', 'Forma 20')] };
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-hoja-'));
let fallos = 0;

async function mide(browser, titulo, estado, generar, hojasEsperadas) {
  const page = await browser.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.goto(BASE + '/index.html');
  await page.evaluate(st => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(st));
    localStorage.setItem('METAS_STATS_NUBE_V1', JSON.stringify({ t: '2026-08-07T10:00:00.000Z', resultados: [], progreso: [] }));
  }, estado);
  await page.evaluate(p => localStorage.setItem('METAS_PLANACCION_V1', JSON.stringify(p)), plan());
  await page.reload();
  await page.waitForFunction(() => typeof window.adLoad === 'function');
  const html = await page.evaluate(fn => {
    let h = '';
    const orig = window.adPrintAbrir;
    window.adPrintAbrir = x => { h = x; };
    const d = window.adLoad();
    if (fn === 'grado') window.estImprimirInformeGrado(d);
    else window.estImprimirInforme(d, window.adAlumnosReales(d).map(a => a.num));
    window.adPrintAbrir = orig;
    return h;
  }, generar);
  await page.close();
  errores.forEach(e => { fallos++; console.log('  ✘ error de página: ' + e); });

  const archivo = path.join(TMP, generar + '.html');
  fs.writeFileSync(archivo, html.replace(/<script>[\s\S]*?<\/script>/, ''));
  const pdf = path.join(TMP, generar + '.pdf');

  const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  await hoja.emulateMedia({ media: 'print' });
  await hoja.goto('file://' + archivo);
  await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
  const alturas = await hoja.evaluate(() => {
    /* el alto REAL del contenido, sin el suelo del min-height: es lo que
       decide si la hoja se parte */
    const hs = [...document.querySelectorAll('.hoja')];
    const antes = hs.map(s => s.style.minHeight);
    hs.forEach(s => { s.style.minHeight = '0'; });
    const r = hs.map(s => Math.round(s.getBoundingClientRect().height));
    hs.forEach((s, i) => { s.style.minHeight = antes[i]; });
    return r;
  });
  await hoja.close();

  const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const max = Math.max(...alturas);
  const bienPag = paginas === hojasEsperadas && alturas.length === hojasEsperadas;
  const bienAlto = max <= ALTO_PRUDENTE;
  if (!bienPag || !bienAlto) fallos++;

  console.log('\n  ' + titulo);
  console.log('    hojas ' + alturas.length + ' → páginas ' + paginas + (bienPag ? '  ✔' : '  ✘ sobran ' + (paginas - hojasEsperadas)));
  console.log('    alto del contenido: máx ' + max + 'px · tope carta ' + ALTO + 'px · tope prudente ' + ALTO_PRUDENTE + 'px  ' +
    (bienAlto ? '✔ con ' + (ALTO_PRUDENTE - max) + 'px de sobra' : '✘ pasa del tope prudente por ' + (max - ALTO_PRUDENTE) + 'px'));
  if (!bienPag) {
    alturas.map((h, i) => ({ h, i: i + 1 })).filter(r => r.h > ALTO).slice(0, 10)
      .forEach(r => console.log('      hoja #' + r.i + ' se pasa: ' + r.h + 'px'));
  }
}

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  console.log('📄 UNA HOJA CARTA POR INFORME — comprobación con la medida de la impresora');
  const AÑO = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
  await mide(browser, 'Informe del ALUMNO · lote de 42, año escolar completo', grupo(AÑO), 'alumno', 42);
  await mide(browser, 'Informe del GRADO · año completo + observación del docente en su tope',
    grupo(AÑO, OBS_TOPE), 'grado', 1);
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('\n' + (fallos ? '✘ ' + fallos + ' problema(s): hay informes que NO caben en una hoja' : '✅ todos los informes caben en una hoja carta'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
