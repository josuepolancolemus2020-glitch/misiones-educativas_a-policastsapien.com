/* ============================================================
   M.E.T.A.S · Ninguna hoja de estilo viene de otro país
   ------------------------------------------------------------
   Medido el 9 de septiembre de 2026, ANTES de tocar nada, con el
   CDN colgado —que es lo que hace la señal de un pueblo: no
   rechaza la conexión, se traga los paquetes y no contesta nunca—:

   | página                    | primer pintado |
   | portada (app del maestro) | NO PINTÓ en 2 min |
   | Las Fracciones            | NO PINTÓ en 2 min |
   | Sólidos Geométricos       | NO PINTÓ en 20 s  |
   | Fin de Grado 6º           | NO PINTÓ en 20 s  |
   | ficha del maestro         | NO PINTÓ en 20 s  |
   | padres.html (sin CSS externo) | 88 ms         |

   Pantalla en blanco, no lenta: BLANCA, y sin final. Una hoja de
   estilo bloquea el pintado hasta que llega, y llegaba de
   fonts.googleapis.com (81 páginas y un @import dentro de
   css/app.css) y de cdnjs.cloudflare.com (65 misiones, para UN
   icono: la flecha de volver). `padres.html`, que no pide nada
   fuera, pintaba en 88 ms con el mismo CDN colgado: era
   exactamente eso.

   Después: 96-428 ms, con el CDN igual de colgado. Las letras
   viven en `css/vendor/fuentes/` y la flecha es un SVG de cinco
   líneas.

   Lo que esta sonda vigila, y por qué:

   - **Del archivo, en TODAS las páginas y todo el CSS**: que no
     vuelva a colarse una hoja de estilo externa. Es lo que se
     multiplica al copiar una misión —así llegaron a 81— y abrir
     201 páginas con Playwright no lo corre nadie.
   - **En el navegador**: que con los tres servidores colgados las
     páginas PINTEN, que no salga ni una petición hacia ellos, que
     la letra que se ve sea la nuestra y salga del sitio, que la
     portada NO baje las letras de las misiones, y que la flecha
     de volver se vea y se pueda tocar.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-cdn-fuera.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Los servidores que se fueron. Three.js sigue viniendo de cdnjs y eso NO
   es lo mismo: es un <script> que carga el propio juego detrás de su telón,
   no una hoja de estilo que para el pintado de la página entera. */
const CDNS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];
/* Las familias se cuentan del propio archivo de fuentes, no se escriben: el
   día que entre una quinta —pasó con JetBrains Mono, que llegó con un juego
   nuevo— la sonda se entera sola. */
let FAMILIAS = [];

/* ⚠️ Los comentarios se quitan ANTES de buscar. Esta trampa ya mordió tres
   veces en este repositorio: el sitio donde se explica por qué algo se
   quitó es justo donde ese algo sigue escrito. */
const sinComentarios = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
/* Y en JavaScript también las de una línea, que es donde mordió la cuarta vez:
   el comentario de sw.js que cuenta que la CSS de Google se quitó nombra
   fonts.gstatic.com, y la sonda se acusaba a sí misma. Los dos puntos de
   `https://` se respetan a propósito. */
const sinComentariosJs = s => sinComentarios(s).replace(/(^|[^:])\/\/[^\n]*/g, '$1');

/* Los archivos se cuentan, no se escriben: la misión 75 entra sola. */
function versionados(ext) {
  const out = [];
  (function anda(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)) {
      if (e.name === '.git' || e.name === 'node_modules' || e.name === 'www' || e.name === '_dev') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name.endsWith(ext)) out.push(path.relative(RAIZ, p));
    }
  })(RAIZ);
  return out;
}

/* ============ 1 · Del archivo: ni una hoja de estilo externa ============ */
function delArchivo() {
  console.log('\n1 · Del archivo, en todas las páginas y todo el CSS');

  const htmls = versionados('.html');
  const csss = versionados('.css');
  console.log(`  (leídas ${htmls.length} páginas y ${csss.length} hojas de estilo)`);

  const conLink = [], conImport = [];
  for (const f of htmls) {
    const t = sinComentarios(fs.readFileSync(path.join(RAIZ, f), 'utf8'));
    for (const m of t.matchAll(/<link\b[^>]*>/g)) {
      const et = m[0];
      if (!/rel\s*=\s*"[^"]*stylesheet/i.test(et) && !/rel\s*=\s*"preconnect"/i.test(et)) continue;
      if (CDNS.some(c => et.includes(c))) conLink.push(f);
    }
  }
  for (const f of htmls.concat(csss)) {
    const t = sinComentarios(fs.readFileSync(path.join(RAIZ, f), 'utf8'));
    if (/@import\s+url\(\s*['"]?https?:/.test(t)) conImport.push(f);
  }
  ok('ninguna página pide una hoja de estilo (ni un preconnect) a un CDN', conLink.length === 0, conLink.slice(0, 5));
  ok('ningún @import remoto, ni en el HTML ni en el CSS', conImport.length === 0, conImport.slice(0, 5));

  /* Las letras están de verdad aquí */
  const dirF = path.join(RAIZ, 'css/vendor/fuentes');
  const css = fs.existsSync(path.join(dirF, 'fuentes.css')) ? fs.readFileSync(path.join(dirF, 'fuentes.css'), 'utf8') : '';
  ok('css/vendor/fuentes/fuentes.css existe', !!css);
  const caras = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map(m => m[1]);
  FAMILIAS = [...new Set([...css.matchAll(/font-family:\s*'([^']+)'/g)].map(m => m[1]))];
  ok(`declara sus familias (${FAMILIAS.join(', ')})`, FAMILIAS.length >= 4, FAMILIAS);
  ok('cada @font-face lleva font-display:swap', caras.length > 0 && caras.every(c => /font-display:\s*swap/.test(c)));
  ok('cada @font-face lleva su unicode-range (no se baja letra que no se pinta)',
     caras.length > 0 && caras.every(c => /unicode-range:/.test(c)));
  const archivos = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/['"]/g, '').trim());
  const faltan = archivos.filter(a => !fs.existsSync(path.join(dirF, a)));
  ok(`los ${archivos.length} .woff2 están en el repositorio`, faltan.length === 0, faltan);
  const noWoff = archivos.filter(a => !faltan.includes(a) &&
    fs.readFileSync(path.join(dirF, a)).slice(0, 4).toString() !== 'wOF2');
  ok('y son woff2 de verdad', noWoff.length === 0, noWoff);
  ok('ninguna url del archivo de fuentes sale del sitio', archivos.every(a => !/^https?:/.test(a)));

  /* Quien usa una de las cuatro letras, la enlaza. Es lo que se olvida al
     copiar una misión: no da error, deja la misión con la letra del
     sistema y nadie lo nota. La excepción son los juegos 3D, que las
     declaran en su CSS y NUNCA las han cargado —se dejan como estaban:
     cambiarles la letra les mueve la maquetación, que tiene sonda propia. */
  const enlazan = [], usanSinEnlazar = [];
  for (const f of htmls) {
    const t = fs.readFileSync(path.join(RAIZ, f), 'utf8');
    const propio = [...t.matchAll(/<link[^>]*href="([^"]+\.css)[^"]*"/g)].map(m => m[1]);
    let texto = t;
    for (const c of propio) {
      const p = path.resolve(path.dirname(path.join(RAIZ, f)), c);
      if (fs.existsSync(p)) texto += fs.readFileSync(p, 'utf8');
    }
    const usa = FAMILIAS.some(fa => new RegExp(`font-family:\\s*['"]${fa}['"]`).test(texto));
    const tiene = /vendor\/fuentes\/fuentes\.css/.test(texto);
    if (tiene) enlazan.push(f);
    else if (usa) usanSinEnlazar.push(f);
  }
  console.log(`  (${enlazan.length} páginas enlazan las letras locales)`);
  const soloJuegos = usanSinEnlazar.every(f => /\/juego-.*-3d\.html$/.test(f));
  ok(`quien pinta con una de las ${FAMILIAS.length} letras, la enlaza (salvo los juegos 3D, que nunca la tuvieron)`,
     soloJuegos, usanSinEnlazar.filter(f => !/\/juego-.*-3d\.html$/.test(f)));

  /* El service worker */
  const sw = sinComentariosJs(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8'));
  const listas = sw.slice(sw.indexOf('const ARMAZON'), sw.indexOf('self.addEventListener'));
  ok('sw.js ya no pre-cachea ninguna dirección de esos CDN', !CDNS.some(c => listas.includes(c)),
     CDNS.filter(c => listas.includes(c)));
  const armazon = sw.slice(sw.indexOf('const ARMAZON'), sw.indexOf('const STATIC_ASSETS'));
  ok('el armazón lleva las letras de la portada (index.html abre sin señal la primera vez)',
     armazon.includes('vendor/fuentes/fuentes.css') && armazon.includes('outfit-latin.woff2'));

  /* Font Awesome son 102 KB y una fuente de iconos. Traerlo entero para pintar
     UNA flecha es lo que hacían las 65 misiones, y esa flecha es hoy un SVG de
     cinco líneas. Traerlo para catorce iconos —el juego de la Fábrica
     Geométrica— sí vale; lo que no puede volver es traerlo del CDN, y eso ya
     lo mira la primera comprobación. La regla, entonces, no es «nadie lo
     carga» sino «nadie lo carga por una flecha». */
  const porUnaFlecha = [];
  for (const f of htmls) {
    const t = fs.readFileSync(path.join(RAIZ, f), 'utf8');
    if (!/<link[^>]*fontawesome[^>]*>/i.test(t)) continue;
    const iconos = new Set([...t.matchAll(/\bfa-([a-z0-9-]+)/g)].map(m => m[1])
      .filter(n => !['solid', 'regular', 'brands', 'fw', 'spin', 'beat'].includes(n)));
    if (iconos.size <= 1) porUnaFlecha.push({ pagina: f, iconos: [...iconos] });
  }
  ok('nadie carga Font Awesome entero por una flecha (con catorce iconos sí vale)',
     porUnaFlecha.length === 0, porUnaFlecha.slice(0, 5));
}

/* ============ 2 · En el navegador, con los CDN colgados ============ */
const PAGINAS = [
  ['index.html', 'la portada', 'Outfit'],
  ['misiones/2y3ciclo-fracciones/fracciones.html', 'una misión', 'Fredoka'],
  ['fichas/ficha-docente-metas-sace.html', 'una ficha del maestro', 'Nunito'],
];

async function enElNavegador() {
  console.log('\n2 · En el navegador, con los tres servidores COLGADOS');
  const nav = await abrir();
  try {
    for (const [url, nombre, familia] of PAGINAS) {
      const ctx = await nav.newContext({ viewport: { width: 393, height: 873 } });
      const pg = await ctx.newPage();
      const aLosCdn = [], woff = [];
      /* Colgado, no abortado: la señal mala no rechaza, se traga los
         paquetes. Abortar sería hacerle un favor al código viejo. */
      await pg.route('**/*', route => {
        const u = route.request().url();
        if (CDNS.some(c => u.includes(c))) { aLosCdn.push(u); return; }
        if (/\.woff2?(\?|$)/.test(u)) woff.push(u);
        return route.continue();
      });
      await pg.goto(BASE + '/' + url, { waitUntil: 'commit', timeout: 20000 }).catch(() => {});
      let fcp = null;
      const lim = Date.now() + 8000;
      while (Date.now() < lim) {
        fcp = await pg.evaluate(() => {
          const e = performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint');
          return e ? Math.round(e.startTime) : null;
        }).catch(() => null);
        if (fcp !== null) break;
        await pg.waitForTimeout(80);
      }
      ok(`${nombre} pinta con el CDN colgado, y en menos de 2 s`, fcp !== null && fcp < 2000, { fcp });
      ok(`${nombre} no manda ni una petición a esos servidores`, aLosCdn.length === 0, aLosCdn.slice(0, 3));

      await pg.waitForLoadState('load').catch(() => {});
      const letra = await pg.evaluate(async fam => {
        await document.fonts.ready;
        return {
          usa: document.fonts.check(`16px "${fam}"`),
          cargadas: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family)
        };
      }, familia).catch(() => ({ usa: false, cargadas: [] }));
      ok(`${nombre} pinta de verdad con ${familia}`, letra.usa, letra);
      ok(`y su .woff2 sale del sitio`, woff.length > 0 && woff.every(u => u.startsWith(BASE)), woff.slice(0, 3));

      /* Que la portada no cargue las letras de las misiones: el
         unicode-range y el uso hacen su trabajo, no se baja letra que
         no se pinta. */
      if (url === 'index.html') {
        const deMas = woff.filter(u => /fredoka|fira-code|nunito/.test(u));
        ok('la portada NO baja las letras de las misiones', deMas.length === 0, deMas);
      }
      await ctx.close();
    }

    /* La flecha de volver: se ve y se puede tocar. Era un icono de un
       CDN de 100 KB; ahora es un SVG de cinco líneas y tiene que seguir
       siendo un botón que el dedo acierta. */
    const ctx = await nav.newContext({ viewport: { width: 360, height: 640 } });
    const pg = await ctx.newPage();
    await pg.route('**/*', r => CDNS.some(c => r.request().url().includes(c)) ? r.abort() : r.continue());
    await pg.goto(BASE + '/misiones/2y3ciclo-fracciones/fracciones.html', { waitUntil: 'load' });
    /* La ventana de identidad tapa la pantalla en la primera visita: se
       cierra, que si no el guardián acusaría a un velo que tapa a propósito. */
    await pg.evaluate(() => { document.querySelectorAll('.metas-id-overlay').forEach(e => e.remove()); });
    const fl = await pg.evaluate(() => {
      const s = document.querySelector('.xp-back-arrow');
      if (!s) return { hay: false };
      const r = s.getBoundingClientRect();
      const enc = document.elementFromPoint(Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2));
      return {
        hay: true, tag: s.tagName.toLowerCase(),
        w: Math.round(r.width), h: Math.round(r.height),
        pinta: getComputedStyle(s).stroke,
        recibeElBoton: !!(enc && enc.closest('.xp-back-btn')),
        encima: enc ? enc.tagName + (enc.className ? '.' + String(enc.className).split(' ')[0] : '') : null
      };
    });
    ok('la flecha de volver está y es un SVG del sitio', fl.hay && fl.tag === 'svg', fl);
    ok('se ve (tiene tamaño y color)', fl.hay && fl.w > 8 && fl.h > 8 && fl.pinta !== 'none', fl);
    ok('y se puede tocar: el toque en su centro llega al botón de volver', fl.recibeElBoton, fl);
    await ctx.close();
  } finally { await nav.close(); }
}

(async () => {
  console.log('M.E.T.A.S · Ninguna hoja de estilo viene de otro país');
  delArchivo();
  await enElNavegador();
  console.log(fallos === 0 ? '\n✅ Todo en orden.' : `\n❌ ${fallos} fallo(s).`);
  process.exit(fallos === 0 ? 0 : 1);
})();
