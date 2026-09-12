/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Reparte la respuesta correcta entre las letras
   ──────────────────────────────────────────────────────────────
   Los bancos de preguntas se escribieron a mano, uno detrás de otro,
   y ahí pasa lo que pasa siempre: quien los escribe pone la buena
   casi siempre en el mismo sitio. Medido con
   `_dev/mide-reparto-respuestas.js`, de las 77 misiones **53 tenían
   sesgo** en algún banco, y la peor ponía el **100 %** de las
   respuestas buenas en la «a».

   Eso no es un detalle de estilo: el alumno que no estudió y marca
   todo «a» se lleva tres cuartos de la sección, y esa nota entra en
   su expediente igual que la del que sí la resolvió. Y al que sí
   estudia le enseña que adivinar funciona.

   Esta herramienta **NO toca el contenido ni cuál es la respuesta
   buena**: solo cambia EN QUÉ POSICIÓN se ofrece. Mueve la correcta
   y deja las demás en su orden relativo.

   Cuatro cosas que no se pueden improvisar:

   1. ⚠️ **En varios bancos la letra va escrita DENTRO del texto de
      la opción** («a) Modificar al verbo»). Al mover hay que volver
      a numerarlas, o el alumno ve dos «b)» y ninguna «d)».
   2. ⚠️ **Hay listas cuyo orden SÍ dice algo** y esas no se tocan:
      «1/2 = ___/4» ofrece 1 · 2 · 4, en orden, que es como se leen.
      Se detectan solas: si todas las opciones son números o
      fracciones y van de menor a mayor (o al revés), la fila se
      queda como está.
   3. ⚠️ **Una misión con edición en inglés no se toca aquí.** Su
      `-en.js` lleva el banco ÍNDICE A ÍNDICE con el español: mover
      uno solo le cambia la respuesta correcta al alumno que estudia
      en inglés. Esas se hacen a mano y las dos a la vez.
   4. **Se reparte A PARTES IGUALES, no justo por debajo del 40 %.**
      Con cuatro opciones, el azar es el 25 %: una letra al 40 %
      sigue siendo una pista, y el alumno que la note gana puntos sin
      saber la respuesta. El objetivo es `ceil(filas / letras)`, y el
      40 % de la normativa queda como el techo que no se puede pasar
      nunca. Aun así se mueve lo mínimo para llegar ahí: la fila que
      ya está en una letra poco usada no se toca.

   Después SIEMPRE:
     node _dev/mide-reparto-respuestas.js
     node _dev/verifica-mision-nueva.js misiones/<carpeta>/<archivo>.html

   Uso:  node _dev/reparte-respuestas.js 2y3ciclo-adverbios [otra…]
         node _dev/reparte-respuestas.js --revisa 2y3ciclo-adverbios
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'misiones');
/* Cada banco con la clave donde guarda el ÍNDICE de la correcta y el nombre
   del campo con las opciones. No son iguales: el de la evaluación usa `a`. */
const BANCOS = [
  { nombre: 'qzData', idx: 'c', opts: 'o' },
  { nombre: 'evalMCBank', idx: 'a', opts: 'o' },
  { nombre: 'cmpData', idx: 'c', opts: 'opts' }
];
const TOPE = 0.4;

const soloRevisa = process.argv.includes('--revisa');
const carpetas = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!carpetas.length) {
  console.error('Uso: node _dev/reparte-respuestas.js <carpeta-de-mision> [otra…] [--revisa]');
  process.exit(2);
}

/* ─── Lectura del archivo, sin decodificar los literales ────────────
   Se guarda el TEXTO CRUDO de cada opción —con sus comillas y sus escapes—
   y se reordenan esos trozos. Decodificar y volver a escribir cambiaría el
   archivo en sitios donde nadie pidió que cambiara. */

function cierre(txt, i) {           // i apunta a [ o {; devuelve el índice del cierre
  const abre = txt[i], cierra = abre === '[' ? ']' : '}';
  let prof = 0, cad = null;
  for (let j = i; j < txt.length; j++) {
    const c = txt[j];
    if (cad) { if (c === '\\') { j++; continue; } if (c === cad) cad = null; continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; continue; }
    if (c === abre) prof++;
    else if (c === cierra) { prof--; if (!prof) return j; }
  }
  return -1;
}

function literales(txt, ini, fin) {  // los literales de cadena de un array, con su sitio
  const out = [];
  let cad = null, desde = -1;
  for (let j = ini; j <= fin; j++) {
    const c = txt[j];
    if (cad) { if (c === '\\') { j++; continue; } if (c === cad) { out.push({ ini: desde, fin: j, txt: txt.slice(desde, j + 1) }); cad = null; } continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; desde = j; }
  }
  return out;
}

function banco(src, b) {
  const m = new RegExp('const\\s+' + b.nombre + '\\s*=\\s*\\[').exec(src);
  if (!m) return null;
  const ini = src.indexOf('[', m.index), fin = cierre(src, ini);
  if (fin < 0) return null;
  const filas = [];
  for (let i = ini + 1; i < fin; i++) {
    if (src[i] !== '{') continue;
    const f = cierre(src, i);
    if (f < 0) break;
    const cuerpo = src.slice(i, f + 1);
    const mo = new RegExp('\\b' + b.opts + '\\s*:\\s*\\[').exec(cuerpo);
    const mi = new RegExp('\\b' + b.idx + '\\s*:\\s*(\\d+)').exec(cuerpo);
    if (mo && mi) {
      const aIni = i + cuerpo.indexOf('[', mo.index), aFin = cierre(src, aIni);
      filas.push({
        opts: literales(src, aIni + 1, aFin - 1),
        idx: parseInt(mi[1], 10),
        idxIni: i + mi.index + mi[0].length - mi[1].length,
        idxFin: i + mi.index + mi[0].length
      });
    }
    i = f;
  }
  return filas.length ? filas : null;
}

/* ─── Las dos reglas de contenido ──────────────────────────────── */

const sinComillas = (s) => s.slice(1, -1);
const LETRA = /^\s*[a-d]\)/;
const conLetra = (fila) => fila.opts.length > 1 && fila.opts.every(o => LETRA.test(sinComillas(o.txt)));

/* Una lista que va en orden dice algo por sí misma y no se toca: «1/2 = ___/4»
   ofrece 1 · 2 · 4, que es como se leen.

   ⚠️ Con DOS matices que costaron medirlos:

   · La coma es separador de MILES, no decimal («400,000»). Leerla como decimal
     convertía cuatrocientos mil en cuatrocientos, y con eso una lista se
     declaraba ordenada —o no— por un motivo inventado.
   · Una lista que BAJA y tiene la correcta la PRIMERA no es un menú: es «escribí
     la respuesta y detrás me inventé distractores más pequeños». Medido en el
     catálogo entero: hay 63 listas que SUBEN —y en 58 la correcta no es la
     primera, o sea que son menús de verdad— y solo 10 que bajan; de esas, las
     4 que empiezan por la correcta son las cuatro el mismo caso
     (347 · 34.7 · 3,470 · 0.0347 y parecidas: el error de correr la coma).
     Esas sí se pueden mover; las otras seis, no. */
function valor(s) {
  const txt = sinComillas(s).replace(LETRA, '').trim();
  const f = /^(-?\d+)\s*\/\s*(\d+)$/.exec(txt);
  if (f) return parseInt(f[1], 10) / parseInt(f[2], 10);
  // 1,250 y 400,000 son enteros con separador de miles; 3.5 es un decimal.
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(txt)) return parseFloat(txt.replace(/,/g, ''));
  return /^-?\d+(\.\d+)?$/.test(txt) ? parseFloat(txt) : null;
}

function ordenada(fila) {
  const val = fila.opts.map(o => valor(o.txt));
  if (val.some(v => v === null) || val.length < 3) return false;
  const sube = val.every((v, i) => !i || v > val[i - 1]);
  const baja = val.every((v, i) => !i || v < val[i - 1]);
  if (sube) return true;
  return baja && fila.idx !== 0;      // si baja y empieza por la correcta, no es un menú
}

/* ─── A qué letra va cada fila ─────────────────────────────────── */

/* ⚠️ Que las CUENTAS cuadren no basta, y esto se vio midiendo después de darlo
   por hecho: la primera versión movía filas de arriba abajo, así que las que no
   hacía falta tocar —todas con la letra del sesgo— se quedaban AMONTONADAS AL
   FINAL. El banco de Respiratorio quedaba `adacdacdcacbbbb`: 27 % por letra en
   la cuenta y **las cuatro últimas preguntas seguidas en la «b»**. En un examen
   de quince, eso se ve; y el alumno que lo note tiene las últimas cuatro
   regaladas, que es lo mismo que veníamos a quitar.

   Así que se reparte en dos pasos: primero CUÁNTAS de cada letra, y después EN
   QUÉ ORDEN. El orden se arma con el clásico «la letra que más queda, pero
   nunca la misma que la anterior», que es el que deja el mínimo de repeticiones
   seguidas posible. */

/* Un azar con semilla: el mismo archivo da SIEMPRE el mismo reparto —volver a
   correr la herramienta no ensucia el diff— pero no dibuja un ciclo. Sin él, el
   desempate por orden alfabético saca a·b·c·d·a·b·c·d…, que es tan adivinable
   como el 93 % en la «b». */
function semilla(txt) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let x = Math.imul(h ^ (h >>> 15), 1 | h); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}

function reparte(filas, marca) {
  const n = filas.length;
  const fija = filas.map(f => ordenada(f));
  const opciones = filas.map(f => f.opts.length);
  const letras = Math.max(...opciones);

  /* ── 1. Cuántas de cada letra ──
     A partes iguales y sin pasar del 40 %. Una letra solo puede tocarle a las
     filas que tengan esa opción: la «d» no existe en una fila de tres. */
  const cabe = [...Array(letras).keys()].map(l => opciones.filter(o => o > l).length);
  const cuenta = new Array(letras).fill(0);
  filas.forEach((f, i) => { if (fija[i]) cuenta[f.idx]++; });
  let libres = n - fija.filter(Boolean).length;
  const tope = Math.min(Math.ceil(n / letras), Math.floor(n * TOPE)) || 1;
  while (libres > 0) {
    // la letra menos usada que todavía admita una más
    let mejor = -1;
    for (let l = 0; l < letras; l++) {
      if (cuenta[l] >= cabe[l]) continue;
      if (mejor < 0 || cuenta[l] < cuenta[mejor]) mejor = l;
    }
    if (mejor < 0) break;
    cuenta[mejor]++; libres--;
  }

  /* ── 2. En qué orden ──
     ⚠️ Y aquí hay una trampa que costó una segunda pasada: lo primero que sale
     es «que no se repita nunca la anterior», y eso deja la racha en 1 SIEMPRE.
     Suena mejor y es otro patrón: el alumno que lo note sabe que la siguiente
     NO es la que acaba de marcar, y pasa de acertar 1 de 4 a 1 de 3. Se cambió
     un sesgo grande por uno pequeño, pero se cambió por otro.

     Lo que no se puede adivinar es el azar. Así que se baraja de verdad —con
     semilla, para que el mismo archivo dé siempre lo mismo— y solo se rechaza
     lo que de verdad se ve desde el pupitre: **tres o más seguidas iguales**.
     Dos seguidas pasan, porque en una lista al azar pasan, y una lista donde
     nunca pasan ya no parece azar.

     Si después de barajar muchas veces no sale ninguna válida —una fila sin
     letra posible—, se devuelve null y el banco se deja como estaba: es mejor
     no tocarlo que escribir algo peor. */
  const az = semilla(marca);
  const bolsa = [];
  cuenta.forEach((c, l) => { const yaFijas = filas.filter((f, i) => fija[i] && f.idx === l).length; for (let k = 0; k < c - yaFijas; k++) bolsa.push(l); });
  const huecos = filas.map((_, i) => i).filter(i => !fija[i]);

  for (let intento = 0; intento < 400; intento++) {
    const b = bolsa.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(az() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    const destino = new Array(n).fill(-1);
    filas.forEach((f, i) => { if (fija[i]) destino[i] = f.idx; });
    huecos.forEach((pos, k) => { destino[pos] = b[k]; });
    // ¿le cabe a cada fila la letra que le tocó? (la «d» no existe en una de tres)
    if (destino.some((l, i) => l >= opciones[i])) continue;
    if (racha(destino) >= 3) continue;
    const c = destino.reduce((a, l) => (a[l] = (a[l] || 0) + 1, a), {});
    return { destino, cuenta: c, max: Math.max(...Object.values(c)) / n, tope };
  }
  return null;
}

/* Lo que de verdad hay que mirar de una secuencia: cuántas iguales seguidas. */
function racha(destino) {
  let mejor = 1, act = 1;
  for (let i = 1; i < destino.length; i++) { act = destino[i] === destino[i - 1] ? act + 1 : 1; if (act > mejor) mejor = act; }
  return destino.length ? mejor : 0;
}

/* ─── Escribir ─────────────────────────────────────────────────── */

function renumera(literal, k) {
  const q = literal[0];
  const dentro = sinComillas(literal).replace(LETRA, 'abcd'[k] + ')');
  return q + dentro + q;
}

function aplica(src, filas, destino, renum) {
  // De atrás hacia delante: así los índices de los trozos siguen valiendo.
  const parches = [];
  filas.forEach((f, i) => {
    if (destino[i] === f.idx) return;
    const buena = f.opts[f.idx];
    const resto = f.opts.filter((_, k) => k !== f.idx);
    const nuevo = resto.slice(0, destino[i]).concat([buena], resto.slice(destino[i]));
    f.opts.forEach((o, k) => {
      const texto = renum ? renumera(nuevo[k].txt, k) : nuevo[k].txt;
      parches.push({ ini: o.ini, fin: o.fin + 1, texto });
    });
    parches.push({ ini: f.idxIni, fin: f.idxFin, texto: String(destino[i]) });
  });
  parches.sort((a, b) => b.ini - a.ini);
  parches.forEach(p => { src = src.slice(0, p.ini) + p.texto + src.slice(p.fin); });
  return src;
}

/* ─── Por misión ───────────────────────────────────────────────── */

let tocadas = 0, avisos = 0;
for (const carpeta of carpetas) {
  const dir = path.join(DIR, carpeta, 'js');
  if (!fs.existsSync(dir)) { console.log('  ⚠️  no existe misiones/' + carpeta + '/js'); avisos++; continue; }
  const js = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.includes('html2canvas'));
  /* ⚠️ Con edición en inglés, aquí no se toca: su banco va índice a índice. */
  if (js.some(f => f.endsWith('-en.js'))) {
    console.log('  ⚠️  ' + carpeta + ': tiene edición en inglés; se reparte a mano y las dos a la vez');
    avisos++; continue;
  }
  const archivo = path.join(dir, carpeta.replace(/^\d\w*ciclo-|^fin-de-grado-|^docente-/, '') + '.js');
  const ruta = fs.existsSync(archivo) ? archivo : path.join(dir, js[0]);
  let src = fs.readFileSync(ruta, 'utf8');
  const antes = src;

  console.log('\n📚 ' + carpeta + '  (' + path.basename(ruta) + ')');
  for (const b of BANCOS) {
    const filas = banco(src, b);
    if (!filas) { console.log('   ·  ' + b.nombre + ': no está'); continue; }
    /* La marca de la semilla lleva la misión y el banco: así dos bancos de la
       misma misión no salen con la misma baraja, y volver a correr la
       herramienta sobre el mismo archivo da siempre lo mismo. */
    const r = reparte(filas, carpeta + '/' + b.nombre);
    if (!r) { console.log('   ⚠️  ' + b.nombre + ': no se pudo repartir sin dejar una fila sin letra; se deja como está'); avisos++; continue; }
    const { destino, cuenta, max } = r;
    const movidas = destino.filter((l, i) => l !== filas[i].idx).length;
    const pinta = (arr) => 'abcd'.split('').map((L, k) => arr[k] ? L + ' ' + Math.round(100 * arr[k] / filas.length) + '%' : null).filter(Boolean).join(' · ');
    const previo = filas.reduce((a, f) => (a[f.idx] = (a[f.idx] || 0) + 1, a), {});
    const letras = (d) => d.map(l => 'abcd'[l]).join('');
    console.log('   ' + (max <= TOPE ? '✔' : '✘') + '  ' + b.nombre.padEnd(12) + filas.length + 'q  '
      + pinta(previo) + '   →   ' + pinta(cuenta) + (movidas ? '   (' + movidas + ' movidas)' : '   (sin tocar)'));
    console.log('        ' + letras(filas.map(f => f.idx)) + '  →  ' + letras(destino)
      + '   ·  seguidas iguales: ' + racha(filas.map(f => f.idx)) + ' → ' + racha(destino));
    if (movidas) src = aplica(src, filas, destino, conLetra(filas[0]));
  }

  if (src === antes) { console.log('   · ya estaba repartida'); continue; }
  if (soloRevisa) { console.log('   (--revisa: no se escribe)'); continue; }
  /* Que compile ANTES de guardarlo: un archivo con un error de sintaxis no da
     la cara —el navegador se calla y la misión se pinta igual—. */
  // ⚠️ El temporal tiene que acabar en .js: `node --check` no sabe qué hacer
  //    con otra extensión y falla por eso, no por el contenido — y entonces la
  //    red de seguridad se dispara siempre y no escribe nunca.
  const tmp = ruta.replace(/\.js$/, '.probando.js');
  fs.writeFileSync(tmp, src);
  const r = cp.spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
  if (r.status !== 0) { fs.unlinkSync(tmp); console.log('   ❌ no compila, no se escribe:\n' + r.stderr); avisos++; continue; }
  fs.unlinkSync(tmp);
  fs.writeFileSync(ruta, src);
  tocadas++;
  console.log('   ✎ escrita');
}

console.log('\n' + (soloRevisa ? '(--revisa) ' : '') + tocadas + ' misión(es) repartida(s)'
  + (avisos ? ', ' + avisos + ' aviso(s)' : '') + '\n');
