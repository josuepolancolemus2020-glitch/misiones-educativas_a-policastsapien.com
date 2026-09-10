/* ============================================================
   M.E.T.A.S · El icono de la aplicación instalada
   ------------------------------------------------------------
   Uso:  node _dev/verifica-iconos-app.js

   Cuando el maestro instala M.E.T.A.S desde el navegador, lo que
   le queda en la pantalla de inicio es este icono, y ahí Android
   NO lo enseña tal cual: le pone su máscara encima —círculo,
   cuadrado redondeado o gota, según la marca del teléfono— y se
   queda con lo de dentro. Solo está garantizado el círculo
   central del 80 % del lienzo; el 20 % de fuera se lo puede
   llevar cualquier launcher.

   Lo que cuesta caro es que ESO NO SE VE AL PUBLICAR. El archivo
   se sube bien, el navegador lo enseña entero en la pestaña, el
   manifest no da un solo error… y en la pantalla de inicio del
   maestro el logo sale con el nombre del editorial cortado por
   los lados. Se descubre —si se descubre— mirando el teléfono de
   alguien que ya la instaló.

   Por eso esta sonda no mira el papeleo: abre los PNG, busca la
   tinta píxel a píxel y comprueba que quepa dentro del círculo.
   Es la misma idea que contar las páginas del PDF en vez de
   mirar la pantalla: se mide lo que va a ver la persona.

   Los iconos los arma `_dev/genera-iconos-app.py` a partir de
   `img/logo-oficial.jpg`; aquí no se escribe nada.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const RAIZ = path.resolve(__dirname, '..');

/* La zona segura del maskable, tal como la define la especificación: el
   círculo central de diámetro 80 % del lienzo. No es una elección nuestra. */
const RADIO_SEGURO = 0.40;

/* Qué se cuenta como tinta. Es el mismo umbral del generador: por debajo
   está el halo del antialiasing, que no se ve y encogería la cuenta. */
const UMBRAL_TINTA = 20;

/* Suelos de tamaño. Un icono que cabe pero sale diminuto es el fallo que
   tenía el anterior: un aro azul enorme y el logo perdido dentro, ilegible
   a 48 px, que es como se ve de verdad en la pantalla de inicio. */
const MINIMO_ANY = 0.70;       // del ancho del lienzo
const MINIMO_MASKABLE = 0.85;  // del radio seguro que podría aprovechar

let fallos = 0;
const mal = (m) => { fallos++; console.log('  ✗ ' + m); };
const bien = (m) => console.log('  ✓ ' + m);

/* El resumen en verde de un apartado se imprime solo si ESE apartado salió
   limpio, no si el contador global está en cero. Sin esto la sonda decía «con
   any y maskable separados» en el mismo manifest donde acababa de encontrar
   un archivo haciendo las dos cosas: una línea verde encima de una roja es
   peor que no imprimir nada, porque enseña a no leerlas. */
const marca = () => { const n = fallos; return () => fallos === n; };

/* ── Leer un PNG sin instalar nada ─────────────────────────────────────
   zlib viene con Node. Se descomprimen los IDAT, se deshace el filtro de
   cada renglón y queda el mapa de píxeles. Son cien líneas, y valen lo
   que valen porque sin ellas esta sonda solo podría comprobar que el
   archivo existe — que es justo lo que ya se cumplía cuando el icono
   salía cortado. */
function leePng(ruta) {
  const b = fs.readFileSync(ruta);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error('no es un PNG');
  let i = 8, ihdr = null, plte = null, trns = false, idat = [];
  while (i < b.length) {
    const largo = b.readUInt32BE(i);
    const tipo = b.toString('ascii', i + 4, i + 8);
    const datos = b.slice(i + 8, i + 8 + largo);
    if (tipo === 'IHDR') {
      ihdr = {
        ancho: datos.readUInt32BE(0), alto: datos.readUInt32BE(4),
        bits: datos[8], color: datos[9], entrelazado: datos[12]
      };
    } else if (tipo === 'PLTE') plte = datos;
    else if (tipo === 'tRNS') trns = true;
    else if (tipo === 'IDAT') idat.push(datos);
    else if (tipo === 'IEND') break;
    i += 12 + largo;
  }
  if (ihdr.bits !== 8) throw new Error(`profundidad ${ihdr.bits} bits: esta sonda lee de 8`);
  if (ihdr.entrelazado) throw new Error('entrelazado: esta sonda lee PNG normales');

  const canales = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.color];
  if (!canales) throw new Error('tipo de color ' + ihdr.color);

  const crudo = zlib.inflateSync(Buffer.concat(idat));
  const paso = canales;                    // bytes por píxel (8 bits/canal)
  const ancho = ihdr.ancho * paso;
  const pix = Buffer.alloc(ihdr.ancho * ihdr.alto * paso);

  let o = 0, p = 0;
  let previa = Buffer.alloc(ancho);
  for (let y = 0; y < ihdr.alto; y++) {
    const filtro = crudo[o++];
    const linea = Buffer.from(crudo.slice(o, o + ancho)); o += ancho;
    for (let x = 0; x < ancho; x++) {
      const a = x >= paso ? linea[x - paso] : 0;
      const b2 = previa[x];
      const c = x >= paso ? previa[x - paso] : 0;
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b2;
      else if (filtro === 3) v += (a + b2) >> 1;
      else if (filtro === 4) {
        const pr = a + b2 - c, pa = Math.abs(pr - a), pb = Math.abs(pr - b2), pc = Math.abs(pr - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b2 : c);
      }
      linea[x] = v & 0xff;
    }
    linea.copy(pix, p); p += ancho;
    previa = linea;
  }

  const rgb = (x, y) => {
    const k = (y * ihdr.ancho + x) * paso;
    if (ihdr.color === 3) { const j = pix[k] * 3; return [plte[j], plte[j + 1], plte[j + 2]]; }
    if (ihdr.color === 0 || ihdr.color === 4) { const g = pix[k]; return [g, g, g]; }
    return [pix[k], pix[k + 1], pix[k + 2]];
  };
  return { ...ihdr, transparente: ihdr.color === 4 || ihdr.color === 6 || trns, rgb };
}

/* Dónde está la tinta y hasta dónde llega desde el centro del lienzo. */
function mideTinta(png) {
  const { ancho, alto, rgb } = png;
  const cx = (ancho - 1) / 2, cy = (alto - 1) / 2;
  let minx = ancho, miny = alto, maxx = -1, maxy = -1, radio = 0, lejos = null;
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const [r, g, b] = rgb(x, y);
      if (255 - Math.min(r, g, b) <= UMBRAL_TINTA) continue;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      const d = Math.hypot(x - cx, y - cy);
      if (d > radio) { radio = d; lejos = [x, y]; }
    }
  }
  return { minx, miny, maxx, maxy, radio, lejos, hay: maxx >= 0 };
}

/* ── 1 · Los manifests: `any` y `maskable`, y NUNCA el mismo archivo ── */
console.log('\n1 · Los manifests declaran las dos familias de icono');
const MANIFESTS = ['manifest.json', 'manifest-padres.json'];
const declarados = new Map();   // archivo -> Set de propósitos

for (const m of MANIFESTS) {
  const limpio = marca();
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(RAIZ, m), 'utf8')); }
  catch (e) { mal(`${m}: no es JSON válido (${e.message})`); continue; }
  const iconos = j.icons || [];
  const propositos = new Set();
  for (const ic of iconos) {
    const usos = String(ic.purpose || 'any').trim().split(/\s+/);
    usos.forEach(u => propositos.add(u));
    if (!declarados.has(ic.src)) declarados.set(ic.src, new Set());
    usos.forEach(u => declarados.get(ic.src).add(u));

    /* La trampa, y es la que había: un mismo archivo sirviendo para las dos
       cosas. Obliga a elegir entre un icono pequeño en todas partes o un
       recorte que se come el logo, y nadie lo ve hasta tener el teléfono
       delante. Son dos archivos porque son dos trabajos distintos. */
    if (usos.includes('any') && usos.includes('maskable')) {
      mal(`${m}: ${ic.src} sirve a la vez de "any" y de "maskable". Android le`
        + ' aplicará la máscara al icono que se dibujó para verse entero.');
    }
    const f = path.join(RAIZ, ic.src);
    if (!fs.existsSync(f)) { mal(`${m}: falta el archivo ${ic.src}`); continue; }
    const png = leePng(f);
    const [w, h] = String(ic.sizes).split('x').map(Number);
    if (png.ancho !== w || png.alto !== h) {
      mal(`${ic.src}: el manifest dice ${ic.sizes} y el archivo mide ${png.ancho}x${png.alto}`);
    }
  }
  if (!propositos.has('any')) mal(`${m}: no declara ningún icono "any"`);
  if (!propositos.has('maskable')) {
    mal(`${m}: no declara ningún icono "maskable". Sin él, Android recorta el "any".`);
  }
  if (limpio()) bien(`${m}: ${iconos.length} iconos, con "any" y "maskable" separados`);
}

/* ── 2 · Opacos, siempre ───────────────────────────────────────────────
   iOS pone lo transparente sobre NEGRO, y este logo es azul marino: se
   perdería. Y una máscara de Android sobre esquinas transparentes deja el
   icono con el fondo en nada. El logo se diseñó sobre blanco. */
console.log('\n2 · Ningún icono es transparente');
const opacosLimpios = marca();
for (const [src] of declarados) {
  const f = path.join(RAIZ, src);
  if (!fs.existsSync(f)) continue;
  const png = leePng(f);
  if (png.transparente) {
    mal(`${src}: lleva canal alfa. iOS lo compone sobre negro y el logo azul desaparece.`);
  }
  const esq = [[0, 0], [png.ancho - 1, 0], [0, png.alto - 1], [png.ancho - 1, png.alto - 1]]
    .map(([x, y]) => png.rgb(x, y));
  if (esq.some(c => Math.min(...c) < 250)) {
    mal(`${src}: las esquinas no son blancas; el fondo tiene que llegar al borde.`);
  }
}
if (opacosLimpios()) bien(`los ${declarados.size} son opacos y con el fondo hasta el borde`);

/* ── 3 · La tinta del maskable cabe en el círculo del 80 % ─────────────
   Esta es la comprobación por la que existe la sonda. */
console.log('\n3 · El logo del maskable cabe entero en la zona segura');
for (const [src, usos] of declarados) {
  if (!usos.has('maskable')) continue;
  const png = leePng(path.join(RAIZ, src));
  const t = mideTinta(png);
  if (!t.hay) { mal(`${src}: no se encontró tinta ninguna (¿está en blanco?)`); continue; }
  const seguro = RADIO_SEGURO * png.ancho;
  const pct = 100 * t.radio / seguro;
  if (t.radio > seguro) {
    mal(`${src}: la tinta llega a ${t.radio.toFixed(0)} px del centro y la zona segura`
      + ` acaba en ${seguro.toFixed(0)}. La máscara del teléfono se come lo de fuera`
      + ` (lo más lejos, en ${t.lejos}).`);
  } else if (pct < MINIMO_MASKABLE * 100) {
    mal(`${src}: el logo solo llena el ${pct.toFixed(0)} % de la zona segura. Cabe, pero`
      + ' sale diminuto en la pantalla de inicio; se ve mejor aprovechándola.');
  } else {
    bien(`${src}: la tinta llena el ${pct.toFixed(0)} % de la zona segura y no la pasa`);
  }
}

/* ── 4 · El `any` sí se ve grande ──────────────────────────────────── */
console.log('\n4 · El icono "any" aprovecha el lienzo');
for (const [src, usos] of declarados) {
  if (!usos.has('any')) continue;
  const png = leePng(path.join(RAIZ, src));
  const t = mideTinta(png);
  const ancho = (t.maxx - t.minx + 1) / png.ancho;
  if (ancho < MINIMO_ANY) {
    mal(`${src}: el logo ocupa el ${(100 * ancho).toFixed(0)} % del ancho. A 48 px, que es`
      + ' como se ve en la pantalla de inicio, no se reconoce.');
  } else {
    bien(`${src}: el logo ocupa el ${(100 * ancho).toFixed(0)} % del ancho`);
  }
}

/* ── 5 · Sin señal también tiene icono ─────────────────────────────── */
console.log('\n5 · Los cuatro van precacheados en sw.js');
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const swLimpio = marca();
for (const [src] of declarados) {
  if (!sw.includes(`'./${src}'`)) {
    mal(`sw.js no precachea ${src}: sin señal la aplicación se instalaría sin su icono`);
  }
}
for (const m of MANIFESTS) {
  if (!sw.includes(`'./${m}'`)) mal(`sw.js no precachea ${m}`);
}
if (swLimpio()) bien(`los manifests y los ${declarados.size} iconos están en el service worker`);

/* ── 6 · Se pueden volver a armar ──────────────────────────────────── */
console.log('\n6 · El logo oficial sigue en el repositorio');
const ORIGEN = 'img/logo-oficial.jpg';
if (!fs.existsSync(path.join(RAIZ, ORIGEN))) {
  mal(`falta ${ORIGEN}: sin el original los iconos no se pueden volver a armar`
    + ' y el próximo cambio se haría recortando a mano.');
} else {
  bien(`${ORIGEN} · se rearman con  python3 _dev/genera-iconos-app.py`);
}

console.log('\n' + '─'.repeat(60));
if (fallos) {
  console.log(`✖ ${fallos} problema(s) en los iconos de la aplicación instalada.\n`);
  process.exit(1);
}
console.log('✅ El icono de la aplicación instalada se ve entero en el teléfono.\n');
