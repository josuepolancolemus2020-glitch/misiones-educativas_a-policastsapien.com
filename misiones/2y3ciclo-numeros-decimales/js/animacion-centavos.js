/* ============================================================
   M.E.T.A.S · Números Decimales · Cuarenta y cinco centavos por libra
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de
   Marvin, que en la pulpería apuntó el maíz (L 12.50) y el frijol
   (L 12.05) como «12.5» los dos, y por cada libra de frijol cobró
   cuarenta y cinco centavos de más. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el
   dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  los dos precios, escritos de corrido: las mismas cifras
        (1, 2, 5 y 0). ¿Valen lo mismo?
     1  en la tabla de valor posicional: el 12 empata, y el 5 del
        maíz cae en las décimas y el del frijol en las centésimas;
     2  un lempira son cien centavos, cien cuadritos: una décima es
        una tira de diez, y el 5 del maíz son cinco tiras;
     3  una centésima es un cuadrito solo, y el 5 del frijol son
        cinco: el mismo 5, diez veces menos;
     4  lo que hizo Marvin, hecho a la vista: el 0 del frijol se cae
        de la tabla, el 5 se corre a las décimas y en el cuadro
        aparecen los cuarenta y cinco centavos de más;
     5  el 0 del maíz también se quita, y ahí no se corre nada:
        12.50 vale lo mismo que 12.5. Las dos filas quedan iguales:
        Marvin cobró el frijol al precio del maíz;
     6  cada 0 a su lugar, y se compara desde la izquierda: el 1 y el
        2 empatan, y en las décimas 5 le gana a 0.

   Cuatro decisiones, y ninguna es de adorno:

   1. ⚠️ **El punto es del lugar, no de la cifra.** Se queda quieto
      entre las unidades y las décimas, y las cifras pasan por su
      lado. Es la coma de la escena de Valor Posicional, del otro
      lado de las unidades.
   2. ⚠️ **Un 0 que se quita se ve quitado, no desaparece.** Sale de
      la tabla con raya cortada y la cifra pálida: la diferencia
      entre el 0 del frijol (que guardaba un lugar, y al quitarlo
      el 5 se corre) y el del maíz (que no guardaba nada) se ve en
      lo que pasa DESPUÉS de quitarlo, no en el 0.
   3. ⚠️ **Lo que se dibuja es lo que se cuenta.** Cada cuadro es un
      lempira de diez por diez, lo pintado es lo que vale lo que
      queda después del punto, y los centavos de más van rayados:
      se distinguen sin distinguir colores y fotocopiados. La sonda
      `verifica-animacion-mision` lee cada precio mirando en qué
      columna cayó cada ficha, cuenta los cuadritos por su área y
      los compara con el marcador y con los rótulos, en cada paso.
   4. **Ni una moneda.** El cuadro es un lempira partido en cien
      centavos, que es un dato; qué monedas hay en la cartera no se
      afirma aquí.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCentavos')) return;

  var ANCHO = 320, ALTO = 262, FIN = 6;

  /* Las columnas de la tabla. Van a lo ancho que piden sus nombres
     (medidos con la letra de la misión): «Unidades» y «centésimas» son
     los largos, y a 12 de letra no se tocan con el vecino. Más chica no:
     «décimas» y «centésimas» son lo que se está enseñando. */
  var LUGARES = [
    { col: 'D', nombre: 'Decenas', x: 68 },
    { col: 'U', nombre: 'Unidades', x: 120 },
    { col: 'd', nombre: 'décimas', x: 182 },
    { col: 'c', nombre: 'centésimas', x: 244 }
  ];
  var X_PUNTO = 151;

  /* Las dos filas, con el precio de verdad cifra por cifra (D U . d c). */
  var FILAS = [
    { nombre: 'maíz', y: 45, cifras: [1, 2, 5, 0] },     // L 12.50
    { nombre: 'frijol', y: 103, cifras: [1, 2, 0, 5] }   // L 12.05
  ];
  /* Escritos de corrido (paso 0), grandes y al centro, como en el rótulo
     de la pulpería: de ahí suben a la tabla y se reparten en sus columnas.
     Las cifras van a 17 una de otra, y el punto entre la segunda y la
     tercera; todo a escala GRANDE. */
  var GRANDE = 1.45;
  var Y_CORRIDO = [96, 170];
  var X_NOMBRE = 73, X_L = 121, X_CIFRA0 = 153.7;
  var CORRIDO = [0, 17, 40, 57], PUNTO_CORRIDO = 28.5;
  /* Adónde se va un 0 que se quita: fuera de la tabla, a la derecha. */
  var FUERA = [{ x: 294, y: 42, giro: -16 }, { x: 294, y: 106, giro: 20 }];

  /* Los cuadros de cien centavos: diez por diez, un lempira cada uno. */
  var S = 9.5, CY = 148;
  var GX = { maiz: 48, frijol: 177 };

  var TEXTOS = [
    'El maíz cuesta L 12.50 y el frijol, L 12.05. Tienen las mismas cifras: 1, 2, 5 y 0. ¿Valen lo mismo? Decídelo antes de tocar.',
    'En los dos, el 12 está en el mismo lugar: doce lempiras. El 5 no: en el maíz está en las décimas, y en el frijol, en las centésimas.',
    'Después del punto van los centavos: un lempira son cien cuadritos. Una décima es una tira de diez. El 5 del maíz son cinco tiras: cincuenta centavos.',
    'Una centésima es un cuadrito solo: un centavo. El 5 del frijol son cinco cuadritos, cinco centavos. Es el mismo 5, y vale diez veces menos.',
    'Marvin quitó el 0 del frijol, y el 5 se corrió a las décimas: ahora vale cincuenta centavos. Ese 0 guardaba un lugar. Cobró cuarenta y cinco de más.',
    'El 0 del maíz va al final: quitarlo no corre nada, y 12.50 vale lo mismo que 12.5. Así, Marvin cobró el frijol al precio del maíz.',
    'Para comparar, se mira desde la izquierda. El 1 y el 2 empatan; en las décimas, 5 le gana a 0. El maíz vale cuarenta y cinco centavos más.'
  ];

  var A;
  var fichas = [[], []], puntos = [], grandes = [], chicos = [], cols = [], tintes = {}, rels = {}, cuadros = {};
  var banda = null;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una ficha: la cifra en su cuadro. El cuadro sale al ponerla en la
     tabla (paso 1): escrita de corrido es solo la cifra. La del 5 trae
     su anillo, que la señala cuando se habla de ella. */
  function ficha(padre, f, k, cifra) {
    var el = A.el;
    var g = el('g', { class: 'dc-ficha', 'data-fila': f, 'data-k': k }, padre);
    var r = el('rect', { class: 'am-ficha', x: -17, y: -21, width: 34, height: 42, rx: 7 }, g);
    var t = texto(g, { class: 'am-digito', x: 0, y: 10, 'text-anchor': 'middle', 'font-size': 28 }, String(cifra));
    var a = cifra === 5
      ? el('rect', { class: 'am-trazo dc-anillo am-fuera', x: -22, y: -26, width: 44, height: 52, rx: 10, style: 'stroke-width:2.4' }, g)
      : null;
    return { g: g, rect: r, t: t, anillo: a };
  }

  /* Un cuadro de cien centavos. Lo pintado va DEBAJO de la cuadrícula,
     así cada cuadrito se sigue viendo y se puede contar. */
  function cuadro(clave) {
    var el = A.el, gx = GX[clave];
    var g = el('g', { class: 'dc-cuadro am-capa am-fuera', 'data-grid': clave }, A.svg);
    el('rect', { x: gx, y: CY, width: 10 * S, height: 10 * S, style: 'fill:var(--card,#fff)' }, g);
    var c = { g: g, reales: [], demas: [] };
    if (clave === 'maiz') {
      /* Cinco décimas: cinco tiras de diez. */
      for (var k = 0; k < 5; k++) {
        c.reales.push(el('rect', { class: 'am-relleno dc-llenos am-fuera', 'data-tipo': 'real', x: gx + k * S, y: CY, width: S, height: 10 * S }, g));
      }
    } else {
      /* Cinco centésimas: cinco cuadritos sueltos. */
      for (var j = 0; j < 5; j++) {
        c.reales.push(el('rect', { class: 'am-relleno dc-llenos am-fuera', 'data-tipo': 'real', x: gx, y: CY + j * S, width: S, height: S }, g));
      }
      /* Lo que cobró Marvin de más: lo que falta de la primera tira y
         cuatro tiras enteras. Rayado, para verse sin distinguir colores. */
      c.demas.push(el('rect', { class: 'dc-llenos am-fuera', 'data-tipo': 'demas', x: gx, y: CY + 5 * S, width: S, height: 5 * S, fill: 'url(#amDcRaya)' }, g));
      for (var m = 1; m < 5; m++) {
        c.demas.push(el('rect', { class: 'dc-llenos am-fuera', 'data-tipo': 'demas', x: gx + m * S, y: CY, width: S, height: 10 * S, fill: 'url(#amDcRaya)' }, g));
      }
    }
    var d = '';
    for (var i = 1; i < 10; i++) {
      d += 'M' + (gx + i * S) + ' ' + CY + 'V' + (CY + 10 * S) + 'M' + gx + ' ' + (CY + i * S) + 'H' + (gx + 10 * S);
    }
    el('path', { class: 'dc-lineas', d: d, style: 'fill:none;stroke:var(--gray,#636e72);stroke-opacity:0.5;stroke-width:0.7' }, g);
    el('rect', { class: 'dc-marco', x: gx, y: CY, width: 10 * S, height: 10 * S, style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.2' }, g);
    var medio = gx + 5 * S, nombre = clave === 'maiz' ? 'maíz' : 'frijol';
    c.cuenta = texto(A.svg, { class: 'am-letra dc-cuenta am-fuera', 'data-grid': clave, x: medio, y: 258, 'text-anchor': 'middle', 'font-size': 12 },
      nombre + ': ' + (clave === 'maiz' ? 50 : 5) + ' centavos');
    if (clave === 'frijol') {
      c.cuenta50 = texto(A.svg, { class: 'am-letra dc-cuenta am-fuera', 'data-grid': clave, x: medio, y: 258, 'text-anchor': 'middle', 'font-size': 12 },
        'frijol: 50 centavos');
      c.demasTxt = texto(A.svg, { class: 'am-rotulo dc-demas am-fuera', x: gx + 29, y: CY + 52, 'text-anchor': 'middle', 'font-size': 13 }, '45 de más');
    }
    return c;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    /* El rayado de los centavos de más: el color de la misión con rayas
       del color de la tarjeta, en las dos pantallas. */
    var defs = el('defs', null, svg);
    var pat = el('pattern', { id: 'amDcRaya', patternUnits: 'userSpaceOnUse', width: 4.5, height: 4.5, patternTransform: 'rotate(45)' }, defs);
    el('rect', { class: 'am-relleno-2', width: 4.5, height: 4.5 }, pat);
    el('rect', { width: 1.6, height: 4.5, style: 'fill:var(--card,#fff);fill-opacity:0.6' }, pat);

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* La columna de la que se habla se ilumina, de arriba abajo. */
    ['d', 'c'].forEach(function (col) {
      var x = LUGARES.filter(function (l) { return l.col === col; })[0].x;
      tintes[col] = el('rect', { class: 'am-relleno-2 dc-tinte am-fuera', 'data-col': col, x: x - 26, y: 20, width: 52, height: 109, rx: 9, style: 'fill-opacity:0.2' }, svg);
    });

    /* Los nombres de las columnas. */
    LUGARES.forEach(function (l) {
      cols.push(texto(svg, { class: 'am-letra dc-col am-fuera', 'data-col': l.col, x: l.x, y: 15, 'text-anchor': 'middle', 'font-size': 12 }, l.nombre));
    });

    /* Los nombres de las filas y la L de lempiras, dos veces: grandes junto
       al precio en el paso 0, y chicos a la izquierda de la tabla. No viajan:
       uno se apaga y el otro se enciende. Agrandar letras mientras se mueven
       obliga a redibujarlas en cada cuadro, y en un teléfono barato esa
       vuelta bajaba de 59 a 46 cuadros por segundo. Que viajen las cifras,
       que son las que hay que seguir con la vista. */
    FILAS.forEach(function (fila, f) {
      var grande = el('g', { class: 'am-fuera', transform: 'translate(' + X_NOMBRE + ' ' + (Y_CORRIDO[f] + 1.5) + ') scale(' + GRANDE + ')' }, svg);
      texto(grande, { class: 'am-letra dc-fila', x: 0, y: 4.5, 'font-size': 13 }, fila.nombre);
      texto(grande, { class: 'am-letra', x: (X_L - X_NOMBRE) / GRANDE, y: 7 - 1.5 / GRANDE, 'font-size': 17, style: 'fill-opacity:0.7' }, 'L');
      var chico = el('g', { class: 'am-fuera', transform: 'translate(0 ' + fila.y + ')' }, svg);
      texto(chico, { class: 'am-letra dc-fila', x: 6, y: 4.5, 'font-size': 13 }, fila.nombre);
      texto(chico, { class: 'am-letra', x: 38, y: 7, 'font-size': 17, style: 'fill-opacity:0.7' }, 'L');
      grandes.push(grande);
      chicos.push(chico);
    });

    /* Lo que se compara, entre las dos filas: «=» donde empatan y, en la
       columna que decide, cuál gana. */
    ['D', 'U', 'd'].forEach(function (col) {
      var x = LUGARES.filter(function (l) { return l.col === col; })[0].x;
      rels[col] = texto(svg, { class: 'am-letra dc-rel am-fuera', 'data-col': col, x: x, y: 80, 'text-anchor': 'middle', 'font-size': 17 }, '=');
    });
    rels.gana = texto(svg, { class: 'am-letra dc-rel am-fuera', 'data-col': 'd', x: 182, y: 79, 'text-anchor': 'middle', 'font-size': 14 }, '5 > 0');

    /* Los dos lempiras partidos en cien centavos. */
    banda = texto(svg, { class: 'am-letra dc-banda am-fuera', x: 160, y: 142, 'text-anchor': 'middle', 'font-size': 12 }, '1 lempira = 100 centavos');
    cuadros.maiz = cuadro('maiz');
    cuadros.frijol = cuadro('frijol');

    /* Las fichas y el punto de cada fila, encima de todo. */
    FILAS.forEach(function (fila, f) {
      fila.cifras.forEach(function (c, k) { fichas[f].push(ficha(svg, f, k, c)); });
      var gp = el('g', { class: 'dc-punto-g' }, svg);
      puntos.push(texto(gp, { class: 'am-letra dc-punto', 'data-fila': f, x: 0, y: 10, 'text-anchor': 'middle', 'font-size': 30 }, '.'));
      puntos[f]._g = gp;
    });
  }

  /* ¿Este 0 está fuera de la tabla en el paso n? El del frijol (k = 2) se
     cae en el error de Marvin (pasos 4 y 5); el del maíz (k = 3), en el 5. */
  function quitado(f, k, n) {
    if (f === 1 && k === 2) return n === 4 || n === 5;
    if (f === 0 && k === 3) return n === 5;
    return false;
  }

  function pintar(n, antes) {
    var adelante = n > antes;

    cols.forEach(function (c, i) { A.ver(c, n >= 1, adelante && n === 1 ? 250 + i * 60 : 0); });
    A.ver(tintes.d, n === 2 || n === 4 || n === 6, adelante ? (n === 4 ? 350 : (n === 6 ? 900 : 0)) : 0);
    A.ver(tintes.c, n === 3);

    /* Los nombres y la L: los grandes en el paso 0, los chicos después. */
    FILAS.forEach(function (fila, f) {
      A.ver(grandes[f], n === 0);
      A.ver(chicos[f], n >= 1, adelante && n === 1 ? 400 : 0);
    });

    /* Las fichas: de corrido en el paso 0, en su columna después. */
    fichas.forEach(function (fila, f) {
      fila.forEach(function (p, k) {
        var x, y = FILAS[f].y, giro = 0, esc = 1, d = 0, fuera = quitado(f, k, n);
        if (n === 0) { x = X_CIFRA0 + CORRIDO[k] * GRANDE; y = Y_CORRIDO[f]; esc = GRANDE; }
        else if (fuera) { x = FUERA[f].x; y = FUERA[f].y; giro = FUERA[f].giro; }
        else x = LUGARES[k].x;
        /* En el error de Marvin, el 5 del frijol se corre a las décimas. */
        if (f === 1 && k === 3 && (n === 4 || n === 5)) x = LUGARES[2].x;
        if (adelante) {
          if (n === 1) d = k * 70;
          if (n === 4 && f === 1 && k === 3) d = 380;           // primero cae el 0, después se corre el 5
          if (n === 6 && f === 1 && k === 2) d = 420;           // primero vuelve el 5, después el 0
        }
        A.mover(p.g, x, y, giro, esc, d);
        A.ver(p.rect, n >= 1, adelante && n === 1 ? 250 + k * 70 : 0);
        p.rect.classList.toggle('am-roto', fuera);
        p.t.style.opacity = fuera ? '0.4' : '';
        if (p.anillo) {
          var anillo = f === 0 ? (n === 1 || n === 2) : (n === 1 || n === 3 || n === 4);
          A.ver(p.anillo, anillo, adelante && n === 1 ? 700 : (adelante && n === 4 ? 1000 : 0));
        }
      });
      if (n === 0) A.mover(puntos[f]._g, X_CIFRA0 + PUNTO_CORRIDO * GRANDE, Y_CORRIDO[f], 0, GRANDE, 0);
      else A.mover(puntos[f]._g, X_PUNTO, FILAS[f].y, 0, 1, adelante && n === 1 ? 100 : 0);
    });

    /* Lo que se compara entre las filas. */
    A.ver(rels.D, n === 1 || n === 5 || n === 6, adelante && (n === 1 || n === 5) ? 800 : 0);
    A.ver(rels.U, n === 1 || n === 5 || n === 6, adelante && (n === 1 || n === 5) ? 950 : 0);
    A.ver(rels.d, n === 5, adelante && n === 5 ? 1100 : 0);
    A.ver(rels.gana, n === 6, adelante && n === 6 ? 1150 : 0);

    /* Los cuadros de cien centavos. */
    A.ver(banda, n >= 2, adelante && n === 2 ? 100 : 0);
    var m = cuadros.maiz, fr = cuadros.frijol;
    A.ver(m.g, n >= 2);
    m.reales.forEach(function (r, k) { A.ver(r, n >= 2, adelante && n === 2 ? 350 + k * 180 : 0); });
    A.ver(m.cuenta, n >= 2, adelante && n === 2 ? 1300 : 0);
    A.ver(fr.g, n >= 3);
    fr.reales.forEach(function (r, j) { A.ver(r, n >= 3, adelante && n === 3 ? 300 + j * 160 : 0); });
    var marvin = n === 4 || n === 5;
    fr.demas.forEach(function (r, k) { A.ver(r, marvin, adelante && n === 4 ? 1200 + k * 170 : 0); });
    A.ver(fr.cuenta, n === 3 || n === 6, adelante ? (n === 3 ? 1150 : (n === 6 ? 700 : 0)) : 0);
    A.ver(fr.cuenta50, marvin, adelante && n === 4 ? 2000 : 0);
    A.ver(fr.demasTxt, marvin, adelante && n === 4 ? 2100 : 0);
  }

  var MARCADOR = [
    { cifra: '12.50 y 12.05', palabras: 'las mismas cifras, ¿el mismo precio?' },
    { cifra: '12.50 y 12.05', palabras: 'el 5, en dos lugares distintos' },
    { cifra: '0.50', palabras: 'cinco décimas: cincuenta centavos' },
    { cifra: '0.05', palabras: 'cinco centésimas: cinco centavos' },
    { cifra: '12.5', palabras: 'lo que apuntó Marvin: 45 de más' },
    { cifra: '12.50 = 12.5', palabras: 'sin su 0, el maíz vale lo mismo' },
    { cifra: '12.50 > 12.05', palabras: 'el maíz vale 45 centavos más' }
  ];

  AnimacionMision.montar('#amCentavos', {
    vista: [ANCHO, ALTO],
    describe: 'La tabla de valor posicional con los precios del maíz, L 12.50, y del frijol, L 12.05, y un cuadro de cien centavos para cada uno.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📋 Ponerlos en la tabla', '🌽 ¿Cuánto vale el 5 del maíz?', '🔍 ¿Y el 5 del frijol?',
        '✏️ Apuntarlo como Marvin', '🌽 ¿Y el 0 del maíz?', '⚖️ ¿Cuál vale más?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
