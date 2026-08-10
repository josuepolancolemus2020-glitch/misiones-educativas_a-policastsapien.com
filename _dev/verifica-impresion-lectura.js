/* ═══════════════════════════════════════════════════════════════
   🖨️ ¿CABE LA LECTURA EN TRES HOJAS CARTA?

   El maestro imprime la lectura y sus actividades para repartirla en un
   aula de 43 donde hay tres teléfonos. Fotocopia por grupo: cada hoja de
   más son 43 hojas de más, en una fotocopiadora de escuela pública con
   el tóner contado.

   El reparto es fijo y no se negocia:

     1ª · la lectura, con el conteo acumulado por renglón, y la
          actividad que se hace SOBRE ese mismo texto;
     2ª · las demás actividades de la misión;
     3ª · la clave del maestro, que NO se fotocopia.

   Aquí está la tensión que vigila esta herramienta: la letra tiene que
   ser lo más grande posible —la hoja la lee un niño, muchas veces con
   poca luz— y los textos crecen con el grado, de 95 palabras en 4º hasta
   200 en 9º. La hoja, en cambio, es siempre la misma.

   Mide como la impresora: media `print`, el ancho útil de una carta y
   EL NÚMERO DE PÁGINAS DEL PDF, que es la verdad. Medir en la pantalla
   ancha miente: las columnas se estiran y el texto ocupa menos alto del
   que ocupará en el papel.

   Vigila también que la hoja NO pida «marca con una ✗»: en el aula la ✗
   es lo que el maestro pone sobre lo que está mal, y usarla para señalar
   lo correcto enseña dos cosas contrarias con el mismo signo. Las
   opciones llevan círculo y el círculo se rellena.

   Y comprueba una cosa que no se ve venir: que ningún renglón del texto
   se parta en dos. El número del final es el conteo acumulado, y
   descolgado no sirve para nada — es lo que convierte la hoja en una
   toma de fluidez de verdad.

   Uso:
     node _dev/servidor-estatico.js        (en otra terminal)
     node _dev/verifica-impresion-lectura.js
     node _dev/verifica-impresion-lectura.js 6     (solo un grado)

   Necesita Playwright con Chromium (npm i -D playwright && npx
   playwright install chromium). Si ya hay un Chromium instalado por otro
   lado, se le pasa su ruta:
     METAS_CHROMIUM=/ruta/al/chrome node _dev/verifica-impresion-lectura.js
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
/* carta menos los márgenes de 10 mm del @page de la hoja */
const ANCHO = Math.round((8.5 - 20 / 25.4) * 96);
const ALTO = Math.round((11 - 20 / 25.4) * 96);
/* Un navegador que ignore el @page pone los suyos (Firefox usa 12,7 mm y
   deja 960 px). La hoja tiene que caber también ahí. */
const ALTO_PRUDENTE = Math.round((11 - 25.4 / 25.4) * 96);
const HOJAS = 3;

const MISIONES = [
  { nombre: 'Los adjetivos', url: '/misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { nombre: 'Números grandes', url: '/misiones/1ciclo-segundo-grado/numeros-hasta-999.html' },
  { nombre: 'Los sustantivos', url: '/misiones/2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
];
const GRADOS = process.argv[2] ? [Number(process.argv[2])] : [4, 5, 6, 7, 8, 9];
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'metas-papel-'));
let fallos = 0;

function ok(t) { console.log('  ✔ ' + t); }
function mal(t) { fallos++; console.log('  ✘ ' + t); }

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
  console.log('🖨️ LA LECTURA EN PAPEL — tres hojas carta, medidas como las mide la impresora\n');

  /* Una sola pestaña «hoja» reutilizada: abrir una por lectura cuesta
     más que todo lo que se mide. */
  const hoja = await browser.newPage({ viewport: { width: ANCHO, height: ALTO } });
  await hoja.emulateMedia({ media: 'print' });

  for (const mision of MISIONES) {
    console.log('═══ ' + mision.nombre + ' ═══');
    const page = await browser.newPage();
    page.on('pageerror', e => mal('error de página: ' + e.message));
    await page.goto(BASE + mision.url);
    await page.waitForFunction(() => typeof window.LecturaMision !== 'undefined');
    await page.evaluate(() => {
      if (!window.LecturaMision.ultima && typeof window.initLectura === 'function') window.initLectura();
    });
    await page.waitForFunction(() => !!(window.LecturaMision && window.LecturaMision.ultima));

    for (const grado of GRADOS) {
      const lista = await page.evaluate(g => window.LecturaMision.ultima.lecturas(g), grado);

      if (!lista.length) { mal(grado + 'º: no se encontró ninguna lectura'); continue; }

      let peorAlto = 0, peorTexto = '', renglonesRotos = 0, paginasMal = 0, conEquis = [];
      for (const id of lista) {
        const html = await page.evaluate(([i, g]) => window.LecturaMision.ultima.papel(i, g), [id, grado]);
        if (!html) { mal(grado + 'º · ' + id + ': la hoja salió vacía'); continue; }

        /* la ✗ marca lo MALO: no puede ser lo que se le pide al alumno
           para señalar lo correcto */
        if (/marca\s+con\s+una\s+[✗✘xX]/i.test(html)) conEquis.push(id);

        const archivo = path.join(TMP, mision.nombre.replace(/\W/g, '') + '-' + id + '.html');
        /* fuera el <script> que dispara la impresión: aquí solo se mide */
        fs.writeFileSync(archivo, html.replace(/<script>[\s\S]*?<\/script>/, ''));
        const pdf = archivo.replace(/\.html$/, '.pdf');

        await hoja.goto('file://' + archivo);
        await hoja.pdf({ path: pdf, format: 'Letter', printBackground: true });
        const med = await hoja.evaluate(() => {
          /* el alto REAL del contenido, sin el suelo del min-height: es
             lo que decide si una hoja se parte en dos */
          const hs = [...document.querySelectorAll('.hoja')];
          const antes = hs.map(s => s.style.minHeight);
          hs.forEach(s => { s.style.minHeight = '0'; });
          const alt = hs.map(s => Math.round(s.getBoundingClientRect().height));
          hs.forEach((s, i) => { s.style.minHeight = antes[i]; });
          /* ¿algún renglón del texto se partió en dos? Se compara su alto
             con el de un renglón suelto: si lo dobla, envolvió. */
          const ls = [...document.querySelectorAll('.lp-linea')];
          const unaLinea = ls.length ? parseFloat(getComputedStyle(ls[0]).lineHeight) : 0;
          const rotos = ls.filter(l => l.getBoundingClientRect().height > unaLinea * 1.35).length;
          return { hojas: alt, rotos: rotos, nHojas: hs.length };
        });

        const paginas = (fs.readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        const max = Math.max(...med.hojas);
        if (max > peorAlto) { peorAlto = max; peorTexto = id; }
        renglonesRotos += med.rotos;
        if (paginas !== HOJAS || med.nHojas !== HOJAS) paginasMal++;
        fs.rmSync(archivo, { force: true }); fs.rmSync(pdf, { force: true });
      }

      const bienAlto = peorAlto <= ALTO_PRUDENTE;
      console.log('  ' + grado + 'º · ' + lista.length + ' lecturas');
      if (bienAlto) ok('la hoja más larga mide ' + peorAlto + 'px (' + peorTexto + ') · tope prudente ' +
        ALTO_PRUDENTE + 'px, sobran ' + (ALTO_PRUDENTE - peorAlto));
      else mal('la hoja de «' + peorTexto + '» se pasa por ' + (peorAlto - ALTO_PRUDENTE) + 'px (' +
        peorAlto + ' de ' + ALTO_PRUDENTE + '): se partirá en dos');
      if (!paginasMal) ok('las ' + lista.length + ' salen en ' + HOJAS + ' páginas de PDF exactas');
      else mal(paginasMal + ' lectura(s) no salen en ' + HOJAS + ' páginas');
      if (!renglonesRotos) ok('ningún renglón del texto se parte: el conteo acumulado queda con su renglón');
      else mal(renglonesRotos + ' renglón(es) del texto se parten en dos y descuelgan su conteo');
      if (!conEquis.length) ok('ninguna hoja pide marcar con una ✗: los círculos se rellenan');
      else mal(conEquis.length + ' hoja(s) piden marcar con una ✗ (' + conEquis.join(', ') +
        '): la ✗ es para lo que está mal');
    }
    await page.close();
    console.log('');
  }

  await hoja.close();
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(fallos ? '✘ ' + fallos + ' problema(s): la lectura NO cabe en sus tres hojas'
                     : '✅ todas las lecturas caben en tres hojas carta, con su conteo entero');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
