/* ═══════════════════════════════════════════════════════════════
   📖 ¿CADA FICHA DE LECTURA CABE EN UNA HOJA CARTA?

   El maestro imprime «Las 50 fichas de 6º» de una tacada. Si una se
   parte, las preguntas quedan en la hoja siguiente y la ficha ya no
   sirve para tomar la lectura: hay que reimprimir el juego entero.

   Aquí está la tensión que vigila esta herramienta: el maestro pide
   LETRA MÁS GRANDE (la ficha la lee un niño de 8 años, muchas veces con
   poca luz) y los textos crecen con el grado —58 palabras en 2º, hasta
   200 en 9º—. La hoja, en cambio, es siempre la misma. Los tamaños de
   LEC_FICHA_FZ son los más grandes que caben; esto lo comprueba.

   Recorre los OCHO grados con sus 50 fichas —400 en total, todo el
   catálogo— y mide como la impresora: media `print`, el ancho útil de
   una carta y las páginas que escupe el PDF.

   Uso:
     node _dev/servidor-estatico.js        (en otra terminal)
     node _dev/verifica-fichas-lectura.js
     node _dev/verifica-fichas-lectura.js 6      (solo un grado)

   Necesita Playwright con Chromium (npm i -D playwright && npx
   playwright install chromium). Si ya hay un Chromium instalado por otro
   lado, se le pasa su ruta:
     CHROMIUM_BIN=/ruta/al/chrome node _dev/verifica-fichas-lectura.js
═══════════════════════════════════════════════════════════════ */
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

const BASE = process.env.METAS_URL || 'http://localhost:8123';
/* carta menos los márgenes de 12 mm del @page de las fichas */
const ANCHO = Math.round((8.5 - 24 / 25.4) * 96);
const ALTO = Math.round((11 - 24 / 25.4) * 96);
/* Un navegador que ignore el @page pone los suyos (Firefox usa 12,7 mm y
   deja 960 px). La ficha tiene que caber también ahí. */
const ALTO_PRUDENTE = Math.round((11 - 25.4 / 25.4) * 96);

const GRADOS = process.argv[2] ? [Number(process.argv[2])] : [2, 3, 4, 5, 6, 7, 8, 9];
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-fichas-'));
let fallos = 0;

const ESTADO = {
  v: 2, activo: 'G1',
  grupos: [{
    id: 'G1', escuela: 'ESCUELA BÁSICA GUBERNAMENTAL JOHN ARNOLD COOK', grado: '6', seccion: '1',
    materias: ['Español'], lista: [{ num: 1, nombre: 'Ada Sarai Sevilla' }], notas: {},
  }],
};

(async () => {
  const browser = await abrir();
  console.log('📖 UNA HOJA CARTA POR FICHA — comprobación con la medida de la impresora\n');

  const page = await browser.newPage();
  page.on('pageerror', e => { fallos++; console.log('  ✘ error de página: ' + e.message); });
  await page.goto(BASE + '/index.html');
  await page.evaluate(st => localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(st)), ESTADO);
  await page.reload();
  await page.waitForFunction(() => typeof window.lecImprimirFichas === 'function');

  for (const grado of GRADOS) {
    const html = await page.evaluate(g => {
      let h = '';
      const orig = window.adPrintAbrir;
      window.adPrintAbrir = x => { h = x; };
      /* LECTURA_TEXTOS es un `const` de módulo clásico: existe como
         global léxica pero NO cuelga de window */
      const ids = (LECTURA_TEXTOS[g] || []).map(t => t.id);
      window.lecImprimirFichas(window.adLoad(), g, ids);
      window.adPrintAbrir = orig;
      return { html: h, n: ids.length };
    }, grado).then(r => r);

    const archivo = path.join(TMP, 'g' + grado + '.html');
    fs.writeFileSync(archivo, html.html.replace(/<script>[\s\S]*?<\/script>/, ''));
    const pdf = path.join(TMP, 'g' + grado + '.pdf');

    const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
    await hoja.emulateMedia({ media: 'print' });
    await hoja.goto('file://' + archivo);
    await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
    const med = await hoja.evaluate(() => {
      /* el alto REAL del contenido, sin el suelo del min-height: es lo
         que decide si la hoja se parte. La ÚLTIMA sección es la pauta,
         que sí puede ocupar más de una hoja: se mide aparte. */
      const hs = [...document.querySelectorAll('.hoja')];
      const antes = hs.map(s => s.style.minHeight);
      hs.forEach(s => { s.style.minHeight = '0'; });
      const alt = hs.map(s => Math.round(s.getBoundingClientRect().height));
      hs.forEach((s, i) => { s.style.minHeight = antes[i]; });
      return { fichas: alt.slice(0, -1), pauta: alt[alt.length - 1] };
    });
    await hoja.close();

    const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    const max = Math.max(...med.fichas);
    const peor = med.fichas.indexOf(max) + 1;
    const pagsPauta = Math.max(1, Math.ceil(med.pauta / ALTO));
    const esperadas = med.fichas.length + pagsPauta;
    const bienAlto = max <= ALTO_PRUDENTE;
    const bienPag = paginas === esperadas;
    if (!bienAlto || !bienPag) fallos++;

    console.log('  ' + grado + 'º · ' + med.fichas.length + ' fichas + pauta de ' + pagsPauta + ' hoja(s)');
    console.log('     ficha más larga: ' + max + 'px (la nº ' + peor + ') · tope prudente ' + ALTO_PRUDENTE + 'px  ' +
      (bienAlto ? '✔ sobran ' + (ALTO_PRUDENTE - max) + 'px' : '✘ se pasa por ' + (max - ALTO_PRUDENTE) + 'px'));
    console.log('     páginas del PDF: ' + paginas + ' · esperadas ' + esperadas + '  ' + (bienPag ? '✔' : '✘'));
    if (!bienPag) {
      med.fichas.map((h, i) => ({ h, i: i + 1 })).filter(r => r.h > ALTO).slice(0, 8)
        .forEach(r => console.log('       ficha #' + r.i + ' se pasa: ' + r.h + 'px'));
    }
  }

  await page.close();
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('\n' + (fallos ? '✘ ' + fallos + ' grado(s) con fichas que NO caben en una hoja'
                             : '✅ las 400 fichas caben, cada una en su hoja carta'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
