/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · ¿Cada página de la ficha cabe en una hoja?
   ──────────────────────────────────────────────────────────────
   Las fichas del alumno se arman A MANO: cada <section class="pagina">
   es una hoja carta, con su pie numerado, y ningún recuadro debe
   quedar partido. El problema es que eso no se ve en la pantalla:
   una sección que se pasa tres milímetros del alto útil se imprime
   en DOS hojas, el pie que dice «Página 4» sale en la quinta, y el
   maestro lo descubre con la ficha ya fotocopiada para 43 alumnos.

   Esta herramienta imprime la ficha a PDF de verdad (Chromium, media
   print, carta) y compara: número de páginas del PDF contra número
   de secciones .pagina del archivo. Si no coinciden, dice EXACTAMENTE
   qué hoja se desbordó, mirando en qué página del PDF cae cada pie.

   El PDF es el único juez: medir en la pantalla ancha miente, porque
   las columnas se estiran y el texto ocupa menos alto del que ocupará
   en el papel.

   Y se miran LAS DOS EDICIONES. Cinco fichas de Robótica traen
   traducción de autor, y el motor de idioma cambia el HTML de cada hoja
   entera: el inglés puede partirse donde el español cabe. Así estuvo
   `ficha-robots-problemas`, con la hoja 3 saliendo en dos, sin que nadie
   lo viera — porque esta sonda solo miraba el español.

   Uso:  node _dev/verifica-ficha-paginas.js                    (todas)
         node _dev/verifica-ficha-paginas.js ficha-fracciones   (una)
         node _dev/verifica-ficha-paginas.js fichas/ficha-x.html
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'fichas');

const MM = 96 / 25.4;                 // píxeles CSS por milímetro
const ANCHO_UTIL = 215.9 - 11 - 11;   // carta menos los márgenes del @page
const UTIL = +(279.4 - 11 - 11).toFixed(1); // alto que deja el papel: 257.4 mm

// El Chromium de Playwright y, si no está, el preinstalado del entorno.
/* El navegador lo abre `lib-navegador.js`: primero el que trae Playwright y
   solo si ese no arranca, uno puesto a mano. Esta función estaba COPIADA en
   seis sondas, y las copias ya se habían separado —tres nombres distintos de
   variable de entorno para lo mismo—. */
const lanzar = opciones => abrir(opciones);

function fichasPedidas() {
  const arg = process.argv[2];
  if (!arg) {
    return fs.readdirSync(DIR).filter(f => f.startsWith('ficha-') && f.endsWith('.html')).sort();
  }
  const base = path.basename(arg).replace(/\.html$/, '');
  return [base + '.html'];
}

(async () => {
  const lista = fichasPedidas();
  const browser = await lanzar();
  // La ventana se abre del ANCHO DEL PAPEL, no del ancho de la pantalla: con
  // la ventana ancha las columnas se estiran y cada página parece más corta
  // de lo que saldrá impresa.
  const page = await browser.newPage({ viewport: { width: Math.round(ANCHO_UTIL * MM), height: 1000 } });
  await page.emulateMedia({ media: 'print' });
  let malas = 0;

  for (const archivo of lista) {
    const abs = path.join(DIR, archivo);
    if (!fs.existsSync(abs)) { console.log(`  ✘ ${archivo}: no existe`); malas++; continue; }
    const html = fs.readFileSync(abs, 'utf8');
    // El class puede traer modificadores («pagina p-mat»), así que se cuenta la clase, no la cadena exacta
    const declaradas = (html.match(/class="pagina(?:[ "])/g) || []).length;
    if (declaradas === 0) { console.log(`  · ${archivo}: sin secciones .pagina, se omite`); continue; }

    await page.goto('file://' + abs, { waitUntil: 'load' });

    // ¿Trae edición en inglés? Entonces se cuentan las hojas de las dos.
    const tieneEn = await page.evaluate(() => !!((window.MISION_EN || {}).html));
    const idiomas = tieneEn ? ['es', 'en'] : ['es'];
    let rota = false;

    for (const idioma of idiomas) {
      if (idioma === 'en') {
        await page.evaluate(() => {
          const dic = window.MISION_EN.html;
          document.querySelectorAll('.pagina .contenido').forEach(c => {
            const k = c.getAttribute('data-i18n');
            if (k && dic[k] != null) c.innerHTML = dic[k];
          });
        });
      }
      const pdf = path.join(os.tmpdir(), archivo.replace('.html', '') + '-' + idioma + '.pdf');
      await page.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });

      // Las páginas del PDF se cuentan sin dependencias: el contador /Type /Page
      const bin = fs.readFileSync(pdf, 'latin1');
      const reales = (bin.match(/\/Type\s*\/Page[^s]/g) || []).length;

      // ¿Cuál se desbordó? Se mide con media print Y con el ANCHO REAL del papel
      // (la ventana del navegador es más ancha: ahí el texto ocupa menos alto y
      // la medición miente, que es como estas fichas pasaron la revisión).
      const altos = await page.evaluate(mm => {
        const a = [];
        document.querySelectorAll('.pagina').forEach((s, i) => a.push({ n: i + 1, mm: +(s.getBoundingClientRect().height / mm).toFixed(1) }));
        return a;
      }, MM);
      const desbordadas = altos.filter(p => p.mm > UTIL);
      const sello = idioma === 'en' ? ' (en inglés)' : '';

      if (reales === declaradas && desbordadas.length === 0) {
        console.log(`  ✔ ${archivo}${sello}: ${declaradas} páginas, ${reales} hojas`);
      } else {
        rota = true;
        console.log(`  ✘ ${archivo}${sello}: declara ${declaradas} páginas y el PDF trae ${reales} hojas`);
        desbordadas.forEach(p => console.log(`      · la página ${p.n} mide ${p.mm} mm y el papel deja ${UTIL} mm: sácale contenido`));
      }
      fs.unlinkSync(pdf);
    }
    if (rota) malas++;
  }

  await browser.close();
  console.log(malas === 0
    ? `\n✅ ${lista.length} ficha(s): cada página declarada es una hoja impresa.`
    : `\n❌ ${malas} ficha(s) con hojas partidas.`);
  process.exit(malas === 0 ? 0 : 1);
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
