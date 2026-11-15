#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · html2canvas, una sola copia
   ------------------------------------------------------------
   Es la biblioteca que saca la foto del diploma. Cada misión traía la
   suya: 85 copias idénticas, 16,9 MB que se publicaban y que cada
   teléfono volvía a bajar misión por misión, 199 KB cada vez, aunque
   ya la tuviera de la misión anterior. Ahora hay una, en
   `js/html2canvas.min.js`, la misma que usa la portada.

   Esto impide que vuelvan: una misión nueva hecha copiando la carpeta
   de otra traería otra vez su copia, o la pediría en `js/` dentro de
   su carpeta, donde ya no está, y el diploma no se podría guardar.

     node _dev/verifica-html2canvas.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const UNICA = path.join(RAIZ, 'js', 'html2canvas.min.js');
/* Lo que no es el sitio que se publica. `www/` es la copia para Android:
   se arma sola desde la raíz y no se edita a mano. */
const FUERA = new Set(['node_modules', 'www', 'android', '.git', '_dev', '_privado']);

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log(detalle); }
};
const lista = xs => xs.slice(0, 15).map(x => '      ' + x).join('\n') + (xs.length > 15 ? '\n      … y ' + (xs.length - 15) + ' más' : '');
const rel = p => path.relative(RAIZ, p).split(path.sep).join('/');

const copias = [], paginas = [], guiones = [];
(function andar(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!(dir === RAIZ && FUERA.has(e.name))) andar(p); return; }
    if (/html2canvas/i.test(e.name)) copias.push(p);
    else if (e.name.endsWith('.html')) paginas.push(p);
    else if (e.name.endsWith('.js')) guiones.push(p);
  });
})(RAIZ);

console.log('— Una sola copia —');
ok('existe js/html2canvas.min.js', fs.existsSync(UNICA));
const sobran = copias.filter(p => p !== UNICA);
ok('no hay ninguna otra copia en lo que se publica', sobran.length === 0, lista(sobran.map(rel)));

console.log('— Las páginas la piden bien —');
/* La portada ya no la trae en un <script>: pesa 199 KB y solo la usa el
   botón de la foto de las calificaciones, así que la pide js/metas-carga.js
   cuando el maestro lo toca. La regla es la misma de antes y no se afloja:
   una sola dirección, con sello, y el mismo sello que las misiones. Lo que
   cambia es dónde está escrita. */
const portada = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const cargadorTxt = fs.readFileSync(path.join(RAIZ, 'js', 'metas-carga.js'), 'utf8');
const pedidas = cargadorTxt.match(/['"][\w.\/-]*html2canvas[\w.\/-]*\.js[^'"\s]*['"]/g) || [];
const sello = (/^['"]js\/html2canvas\.min\.js(\?v=\d+)['"]$/.exec(pedidas[0] || '') || [])[1];
ok('la portada no la baja al arrancar (sin <script> en index.html)', !/<script[^>]*html2canvas/i.test(portada));
ok('el cargador la pide de js/html2canvas.min.js, una sola vez y con sello (' + sello + ')', pedidas.length === 1 && !!sello, lista(pedidas));
ok('y la portada carga el cargador con su sello', /<script src="js\/metas-carga\.js\?v=\d+"><\/script>/.test(portada));

/* Nadie más de la portada puede traerla por su cuenta: un segundo
   createElement('script') con otra dirección sería la segunda copia que
   esta sonda existe para impedir. Y quien la usa tiene que pasar por el
   cargador, o el botón diría «intenta de nuevo» para siempre. */
const dePortada = guiones.filter(g => !/[\\/]misiones[\\/]|[\\/]fichas[\\/]/.test(g) && path.basename(g) !== 'metas-carga.js');
const porSuCuenta = dePortada.filter(g => /['"][\w.\/-]*html2canvas[\w.\/-]*\.js/.test(fs.readFileSync(g, 'utf8')));
ok('ningún otro guion escribe su dirección', porSuCuenta.length === 0, lista(porSuCuenta.map(rel)));
const enPortada = new Set((portada.match(/<script src="([^"?]+)/g) || []).map(s => s.replace('<script src="', '')));
const sinCargador = dePortada.filter(g => enPortada.has(rel(g)))
  .filter(g => { const x = fs.readFileSync(g, 'utf8'); return /(^|[^\w$.])html2canvas\s*\(|typeof html2canvas/.test(x) && !/metasCargarHtml2canvas\s*\(/.test(x); });
ok('los guiones de la portada que sacan una foto la piden con metasCargarHtml2canvas()', sinCargador.length === 0, lista(sinCargador.map(rel)));

const aOtraParte = [], otroSello = [], deFuera = [];
let piden = 0;
const cargaLaUnica = new Set();
paginas.forEach(p => {
  const t = fs.readFileSync(p, 'utf8');
  const re = /<script[^>]*\ssrc=["']([^"']*html2canvas[^"']*)["']/gi;
  let m;
  while ((m = re.exec(t))) {
    piden++;
    if (/^(https?:)?\/\//.test(m[1])) { deFuera.push(rel(p) + ' → ' + m[1]); continue; }
    const [ruta, v] = m[1].split('?');
    if (path.resolve(path.dirname(p), decodeURIComponent(ruta)) !== UNICA) { aOtraParte.push(rel(p) + ' → ' + m[1]); continue; }
    cargaLaUnica.add(p);
    /* El mismo sello que la portada: con la misma dirección exacta, el
       teléfono que ya la bajó en la portada no la vuelve a bajar. */
    if ('?' + (v || '') !== sello) otroSello.push(rel(p) + ' → ' + m[1]);
  }
});
ok('ninguna la pide de fuera (CDN)', deFuera.length === 0, lista(deFuera));
ok('las ' + piden + ' páginas que la piden van a js/html2canvas.min.js', aOtraParte.length === 0, lista(aOtraParte));
ok('y todas con el mismo sello que el cargador de la portada', otroSello.length === 0, lista(otroSello));

/* Una misión que la usa y cuya página no la carga: el botón de guardar el
   diploma diría «Cargando... intenta de nuevo» para siempre. */
console.log('— Quien la usa, la carga —');
const sinCargar = [];
let usan = 0;
/* En una misión que usa el motor, quien saca la foto es el motor
   (js/motor-mision.js): la que tiene que cargar la biblioteca es toda
   página que cargue el motor. */
const motorSacaFoto = /(^|[^\w$.])html2canvas\s*\(/.test(fs.readFileSync(path.join(RAIZ, 'js', 'motor-mision.js'), 'utf8'));
paginas.filter(p => /[\\/]misiones[\\/]/.test(p)).forEach(p => {
  if (!motorSacaFoto || !/<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(fs.readFileSync(p, 'utf8'))) return;
  usan++;
  if (!cargaLaUnica.has(p)) sinCargar.push(rel(p));
});
guiones.filter(g => /[\\/]misiones[\\/]/.test(g)).forEach(g => {
  if (!/(^|[^\w$.])html2canvas\s*\(/.test(fs.readFileSync(g, 'utf8'))) return;
  usan++;
  const carpeta = path.dirname(path.dirname(g));
  const nombre = path.basename(g).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const suyas = paginas.filter(p => path.dirname(p) === carpeta && new RegExp('src="js/' + nombre + '(\\?[^"]*)?"').test(fs.readFileSync(p, 'utf8')));
  if (!suyas.length || suyas.some(p => !cargaLaUnica.has(p))) sinCargar.push(rel(g));
});
ok('las ' + usan + ' misiones que sacan la foto del diploma la cargan en su página', sinCargar.length === 0, lista(sinCargar));

console.log(fallos === 0 ? '\n✅ Una sola copia de html2canvas, y ' + piden + ' páginas la usan.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
