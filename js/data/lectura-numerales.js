/* ══════════════════════════════════════════════════════════════
   🔢 LOS NÚMEROS DE UN TEXTO: encontrarlos, leerlos y escribirlos

   En la misión de los números grandes, la sección 📖 Lectura le pide
   al alumno que cace los números sobre el texto que acaba de leer,
   que diga cómo se escriben con cifras y cuánto vale cada posición.
   Para eso hace falta saber, de un texto cualquiera, DÓNDE están los
   números y CUÁNTO valen.

   Se resuelve aquí y no en el corpus a propósito. En la misión de los
   adjetivos el inventario se escribe a mano porque no hay forma de
   deducirlo (un participio es adjetivo o verbo según la oración). Con
   los números no pasa eso: «trescientos cuarenta y cinco mil» vale lo
   que vale, siempre. Escribirlo a mano en treinta lecturas solo
   añadiría erratas — y una errata aquí le enseña al niño un número
   equivocado.

   Encuentra dos formas:
   · en CIFRAS, con la coma de millar que usa la misión: 1,200 · 345,600
   · en PALABRAS: «cuarenta y dos mil trescientos»

   Y NO cuenta como número:
   · «un», «una», «uno» sueltos — ahí son artículos, no cantidades
     («un camión» no es el número 1). Sí cuentan acompañando a un
     multiplicador: «un millón», «veintiún mil».
   · los ordinales (primero, segundo, tercer…), que son otra cosa.

   ⚠️ Si se toca la tabla o el algoritmo, correr _dev/prueba-numerales.js
   ANTES de publicar: son cincuenta casos, y cada uno de ellos es un
   número que el alumno vería mal escrito en la pantalla.
══════════════════════════════════════════════════════════════ */

const LECTURA_NUMERALES = (function () {
  'use strict';

  /* Palabras que valen una cantidad y se suman dentro de su grupo. */
  var VALOR = {
    cero: 0, uno: 1, un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
    trece: 13, catorce: 14, quince: 15, dieciséis: 16, dieciseis: 16,
    diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20,
    veintiuno: 21, veintiún: 21, veintiun: 21, veintiuna: 21, veintidós: 22, veintidos: 22,
    veintitrés: 23, veintitres: 23, veinticuatro: 24, veinticinco: 25,
    veintiséis: 26, veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29,
    treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70,
    ochenta: 80, noventa: 90, cien: 100, ciento: 100,
    doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300,
    cuatrocientos: 400, cuatrocientas: 400, quinientos: 500, quinientas: 500,
    seiscientos: 600, seiscientas: 600, setecientos: 700, setecientas: 700,
    ochocientos: 800, ochocientas: 800, novecientos: 900, novecientas: 900
  };
  /* Palabras que MULTIPLICAN lo acumulado y cierran el grupo. */
  var MULT = { mil: 1000, millón: 1000000, millon: 1000000, millones: 1000000 };
  /* Sueltas no son cantidad: son artículo. */
  var ARTICULO = { un: 1, una: 1, uno: 1 };

  var LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;
  function limpiaSigno(p) { return String(p).replace(LIMPIA, ''); }
  /* En cifras la coma es el separador de millar que usa esta misión
     (1,200), así que no se puede quitar como los demás signos. Pero la
     coma del FINAL sí es puntuación: en «llevó 940, casi lo mismo» el
     número es 940. Se quitan las de los extremos y se respetan las de
     en medio. */
  function limpiaCifra(p) {
    return String(p).replace(/[.;:()¿?¡!«»"“”'’…—–]/g, '').replace(/^,+|,+$/g, '');
  }
  function normal(p) { return limpiaSigno(p).toLowerCase(); }

  function esPalabraNumero(p) { var k = normal(p); return VALOR.hasOwnProperty(k) || MULT.hasOwnProperty(k); }
  function esCifra(p) { return /^\d{1,3}(,\d{3})+$/.test(limpiaCifra(p)) || /^\d+$/.test(limpiaCifra(p)); }
  function valorCifra(p) { return parseInt(limpiaCifra(p).replace(/,/g, ''), 10); }

  /* Lee una secuencia de palabras-número y devuelve su valor.
     «trescientos cuarenta y cinco mil seiscientos setenta y ocho»
       → 300+40+5 = 345 · mil → 345,000 · 600+70+8 = 678 → 345,678 */
  function valorPalabras(tokens) {
    var total = 0, grupo = 0, hubo = false;
    for (var i = 0; i < tokens.length; i++) {
      var k = normal(tokens[i]);
      if (k === 'y') continue;
      if (MULT.hasOwnProperty(k)) {
        grupo = (grupo || 1) * MULT[k];
        total += grupo; grupo = 0; hubo = true;
      } else if (VALOR.hasOwnProperty(k)) {
        grupo += VALOR[k]; hubo = true;
      } else return null;
    }
    return hubo ? total + grupo : null;
  }

  /* ── Encontrar los números de un texto ya partido en palabras ──
     Devuelve rangos [ini, fin] de índices, con su valor y su forma.
     Los rangos son MAXIMALES: «cuarenta y dos mil» es un número, no
     tres. Eso importa para la cacería: el alumno toca el número, y el
     número entero se enciende. */
  function detectar(ps) {
    var out = [], i = 0;
    while (i < ps.length) {
      if (esCifra(ps[i])) {
        out.push({ ini: i, fin: i, v: valorCifra(ps[i]), forma: 'cifras' });
        i++; continue;
      }
      if (!esPalabraNumero(ps[i])) { i++; continue; }
      var j = i;
      while (j + 1 < ps.length) {
        var sig = normal(ps[j + 1]);
        if (esPalabraNumero(ps[j + 1])) { j++; continue; }
        /* la «y» solo alarga el número si detrás viene otro número:
           «cuarenta y cinco» sí, «cuarenta y llegaron» no */
        if (sig === 'y' && j + 2 < ps.length && esPalabraNumero(ps[j + 2])) { j += 2; continue; }
        break;
      }
      var tokens = ps.slice(i, j + 1);
      var v = valorPalabras(tokens);
      /* «un camión» no es el número 1: sin multiplicador, un/una/uno
         suelto es artículo y no se cuenta. */
      var soloArticulo = tokens.length === 1 && ARTICULO.hasOwnProperty(normal(tokens[0]));
      if (v != null && !soloArticulo) out.push({ ini: i, fin: j, v: v, forma: 'palabras' });
      i = j + 1;
    }
    return out;
  }

  /* ── Escribir un número ── */
  function enCifras(v) {
    var s = String(Math.abs(Math.round(v))), out = '';
    for (var i = s.length; i > 0; i -= 3) out = s.slice(Math.max(0, i - 3), i) + (out ? ',' + out : '');
    return (v < 0 ? '-' : '') + out;
  }

  var UNI = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
    'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
    'veintisiete', 'veintiocho', 'veintinueve'];
  var DEC = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var CEN = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  function menorDeMil(n) {
    if (n === 0) return '';
    if (n === 100) return 'cien';
    var c = Math.floor(n / 100), r = n % 100, out = [];
    if (c) out.push(CEN[c]);
    if (r) {
      if (r < 30) out.push(UNI[r]);
      else {
        var d = Math.floor(r / 10), u = r % 10;
        out.push(DEC[d] + (u ? ' y ' + UNI[u] : ''));
      }
    }
    return out.join(' ');
  }

  /* Delante de «mil» o «millones», «uno» se apocopa. Y no se apocopa
     igual en los dos casos: «veintiún mil» lleva tilde porque el acento
     se le queda en la última sílaba, pero «treinta y un mil» no la
     lleva. Escribirlo mal en la pantalla de una misión de Español
     sería feo; en una de Matemáticas, también. */
  function apocopa(txt) {
    if (/veintiuno$/.test(txt)) return txt.replace(/veintiuno$/, 'veintiún');
    return txt.replace(/uno$/, 'un');
  }

  function enPalabras(v) {
    v = Math.round(v);
    if (v === 0) return 'cero';
    var mill = Math.floor(v / 1000000), resto = v % 1000000;
    var miles = Math.floor(resto / 1000), uni = resto % 1000;
    var out = [];
    if (mill) out.push(mill === 1 ? 'un millón' : apocopa(menorDeMil(mill)) + ' millones');
    if (miles) out.push(miles === 1 ? 'mil' : apocopa(menorDeMil(miles)) + ' mil');
    if (uni) out.push(menorDeMil(uni));
    return out.join(' ');
  }

  /* ── Valor posicional ──
     Para «¿cuánto vale el 4 en 345,678?» → 40,000. Devuelve las cifras
     distintas de cero con su posición y su valor, de mayor a menor. */
  function cifrasDe(v) {
    var s = String(Math.round(v)), out = [];
    for (var i = 0; i < s.length; i++) {
      var d = +s[i], pos = s.length - 1 - i;
      if (d) out.push({ digito: d, pos: pos, vale: d * Math.pow(10, pos) });
    }
    return out;
  }
  var NOMBRE_POS = ['unidades', 'decenas', 'centenas', 'unidades de millar',
    'decenas de millar', 'centenas de millar', 'unidades de millón'];
  function nombrePosicion(pos) { return NOMBRE_POS[pos] || ('10 elevado a ' + pos); }

  var api = {
    detectar: detectar, valorPalabras: valorPalabras, valorCifra: valorCifra,
    esCifra: esCifra, esPalabraNumero: esPalabraNumero,
    enCifras: enCifras, enPalabras: enPalabras,
    cifrasDe: cifrasDe, nombrePosicion: nombrePosicion
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  return api;
})();
