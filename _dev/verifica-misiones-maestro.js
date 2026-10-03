#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   verifica-misiones-maestro.js · que cada pestaña lleve a algo, y que lo que
   el JS pinta tenga dónde pintarse

   Las misiones del maestro arman su barra de secciones desde una lista que
   vive en su JS (`const SECS = [['sec-linea', '🕰️ Historia'], …]`), no
   desde el HTML. Y sus pintores (`tlPinta`, `arPinta`, `trPinta`…) buscan
   su contenedor por id y, si no está, se callan: `if (!lista) return;`.

   Eso se pagó caro y nadie lo vio en dieciséis días. El 16 de septiembre
   de 2026, al quitarles a las ocho la tarjeta de «situación» que se les
   había puesto de más, la herramienta se llevó también lo que venía detrás:
   la tarjeta principal de cada una —la línea de tiempo de nueve hitos, los
   veintitrés derechos del artículo 13, los ocho cortes de una fila del
   DCNB, las nueve situaciones del Código de la Niñez, los nueve trámites
   del Estatuto…— y, en seis de ellas, la sección «Aprende» entera. 406
   líneas. La pestaña «🧭 Aprende» seguía en la barra y llevaba a una
   pantalla EN BLANCO; el pintor de la lista principal no encontraba su
   contenedor y no decía nada. El maestro que abría «Dos siglos de leyes
   educativas» se encontraba con la estructura de 2012 y ni rastro de los
   dos siglos.

   No daba ningún error: el HTML es válido, el JS compila, la consola
   callada, y la pantalla que se ve al abrir se pinta perfectamente. Es la
   familia del `.pf-p` naranja sobre naranja: lo que se pinta bien y está
   mal. Se descubrió el 3 de octubre de 2026 leyendo el JS para escribirles
   su animación: pintaba en un `tlLista` que el HTML no tenía.

   Por eso esto mira cuatro cosas, en toda misión que arme su barra desde
   una lista `SECS` (hoy son las del maestro; si mañana lo hace otra, entra
   sola):

     1. que cada pestaña de la lista lleve a una sección que EXISTE;
     2. que cada sección del HTML tenga su pestaña (si no, no se llega);
     3. que ninguna sección esté vacía;
     4. que cada `getElementById('…')` del JS de la misión encuentre su
        elemento: en el HTML, o armado por el propio JS. Un pintor que no
        encuentra dónde pintar es justo lo que no avisa.

   node _dev/verifica-misiones-maestro.js         (está en npm test)
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');

let fallos = 0, misiones = 0, pestanas = 0, ids = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };

/* Lo que se lee de verdad: sin comentarios. El sitio donde se explica que
   algo se quitó es justo donde ese algo sigue escrito (es la trampa que este
   repositorio ya mordió seis veces). */
const sinComentariosJS = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const sinComentariosHTML = s => s.replace(/<!--[\s\S]*?-->/g, '');

console.log('\n🧭 Las misiones que arman su barra desde su JS: cada pestaña lleva a algo\n');
fs.readdirSync(path.join(RAIZ, 'misiones')).sort().forEach(dir => {
  const d = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(d).isDirectory()) return;
  const jsDir = path.join(d, 'js');
  if (!fs.existsSync(jsDir)) return;
  const js = fs.readdirSync(jsDir).filter(f => /\.js$/.test(f) && !/-en\.js$/.test(f))
    .map(f => sinComentariosJS(fs.readFileSync(path.join(jsDir, f), 'utf8'))).join('\n');
  const m = js.match(/const\s+SECS\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return;
  const htmlF = fs.readdirSync(d).find(f => /\.html$/.test(f) && !/^juego-/.test(f));
  if (!htmlF) return;
  const html = sinComentariosHTML(fs.readFileSync(path.join(d, htmlF), 'utf8'));
  misiones++;

  /* 1 y 2 · la lista de la barra contra las secciones del HTML */
  const secs = [...m[1].matchAll(/\[\s*'([^']+)'\s*,/g)].map(x => x[1]);
  const secciones = [...html.matchAll(/<section\b[^>]*\bclass="[^"]*\bsec\b[^"]*"[^>]*\bid="([^"]+)"|<section\b[^>]*\bid="([^"]+)"[^>]*\bclass="[^"]*\bsec\b[^"]*"/g)]
    .map(x => x[1] || x[2]);
  secs.forEach(id => {
    pestanas++;
    if (!secciones.includes(id)) mal(`${dir} · la pestaña «${id}» lleva a una sección que no existe: al tocarla, la pantalla queda en blanco`);
  });
  secciones.forEach(id => {
    if (!secs.includes(id)) mal(`${dir} · la sección «${id}» no tiene pestaña: no se llega a ella`);
  });

  /* 3 · ninguna sección vacía (se cuenta desde su <section> hasta la siguiente) */
  const cortes = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>/g)];
  cortes.forEach((c, i) => {
    const fin = i + 1 < cortes.length ? cortes[i + 1].index : html.indexOf('</main>');
    const cuerpo = html.slice(c.index, fin > c.index ? fin : undefined);
    if (!/class="card\b/.test(cuerpo)) mal(`${dir} · la sección «${c[1]}» no tiene ni una tarjeta`);
  });

  /* 4 · todo lo que el JS busca por id, tiene que estar */
  const buscados = [...new Set([...js.matchAll(/getElementById\(\s*'([A-Za-z0-9_-]+)'\s*\)/g)].map(x => x[1]))];
  buscados.forEach(id => {
    ids++;
    const enHTML = new RegExp(`\\bid="${id}"`).test(html);
    const armado = new RegExp(`id=\\\\?["']${id}\\\\?["']|\\.id\\s*=\\s*['"]${id}['"]`).test(js);
    if (!enHTML && !armado) mal(`${dir} · el JS busca «#${id}» y no está ni en el HTML ni lo arma el JS: lo que ahí se pinta, no sale`);
  });
});

if (!misiones) mal('no se encontró ninguna misión que arme su barra desde una lista SECS: ¿cambió la forma de escribirla?');
console.log(fallos
  ? `\n❌ ${fallos} fallo(s)\n`
  : `\n✅ ${misiones} misiones: ${pestanas} pestañas, todas llevan a una sección con contenido, y los ${ids} elementos que su JS busca están.\n`);
process.exit(fallos ? 1 : 0);
