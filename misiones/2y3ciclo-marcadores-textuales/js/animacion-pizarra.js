/* ============================================================
   M.E.T.A.S · Marcadores Textuales · La pizarra del maestro
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de las
   instrucciones: el maestro dejó en la pizarra «leer el texto, subrayar,
   copiar en el cuaderno, en parejas», medio grado lo hizo solo y medio en
   parejas, unos subrayaron antes de copiar y otros después, y llegaron
   cuatro trabajos distintos. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza en
   cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la pizarra, con una marca de raya cortada debajo de cada una de sus
        tres comas: son lo único que junta las cuatro cosas. Se decide antes
        de tocar si se entiende de una sola manera;
     1  las comas no dicen si se subraya el texto o lo copiado: salen dos
        trabajos, uno subraya y copia, el otro copia y subraya;
     2  tampoco dicen qué se hace en parejas: cada uno de los dos se parte en
        dos, solo o en parejas. Cuatro trabajos, 2 × 2, y hubo que repetir la
        clase;
     3  se escriben «Primero» y una «y» donde había coma: leer y subrayar el
        texto van juntos, y se van los dos trabajos que subrayan en el
        cuaderno;
     4  la coma que sigue a «subrayar» pasa a ser punto y «Después»: «en
        parejas» queda con copiar, y sale un solo trabajo, igual para todos;
     5  «Primero», «y» y «Después» son marcadores textuales: no agregan nada
        que hacer, y deciden cómo lo entiende el que lee.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Ni una palabra del maestro cambia.** Las cuatro cosas de la
      pizarra son las mismas en los seis pasos, con las mismas letras: solo
      se corren para hacerles sitio a las nuevas. Es lo que dice la
      historia, «ninguna palabra estaba mal escrita», y se ve: lo que cambia
      son las junturas.
   2. ⚠️ **Los trabajos de abajo son las lecturas que la pizarra deja.** Dos
      maneras de ordenar por dos maneras de entender «en parejas»: los
      cuatro trabajos de la historia. Y cada palabra que se escribe quita las
      que ya no caben. La sonda no le cree al dibujo: lee la pizarra, saca
      ella las lecturas que el texto permite y las compara con las filas.
   3. **Nadie lo hizo mal: la pizarra no decía.** Ningún trabajo lleva una
      ✗; los que se van, se van porque el texto nuevo ya no los permite. Es
      la misma regla que el mensaje de Los Pronombres.
   4. ⚠️ **El trabajo que queda no es ninguno de los dos que quedaban.** Con
      las comas, «en parejas» se leyó para todo o para nada, y así lo hizo el
      grado: todo en parejas, o todo solo. Con el punto y «Después», «en
      parejas» queda con copiar, y eso no lo había hecho nadie: cada uno lee
      y subraya, y copian en parejas. La frase lo dice, para que no parezca
      que uno de los dos acertó.
   5. ⚠️ **Lo que va debajo no se regala.** Aquí no se nombra ninguna clase
      de marcador (las clases son los pareados) ni sale ninguna palabra de
      las respuestas de la prueba. La historia estaba en la prueba de
      pensamiento crítico palabra por palabra, y dos preguntas pedían justo
      «primero» y «después»: las tres se cambiaron (marcadores-textuales.js y
      la ficha).
   6. **La pizarra es de verdad en las dos pantallas.** Verde, con tiza
      blanca para lo que escribió el maestro y tiza amarilla para lo que se
      agrega; los trabajos son de papel, con tinta oscura fija. Y nada se
      dice solo con color: lo abierto va con raya cortada (las marcas de
      las comas, el subrayado de «en parejas») y lo que se agregó, con raya
      entera. Las marcas de las comas van DEBAJO del renglón, como la de un
      corrector: un aro alrededor de una coma se montaba en las letras de
      al lado, que están a medio espacio.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPizarra')) return;

  var ANCHO = 320, ALTO = 258, FIN = 5;

  /* La pizarra: tres renglones de tiza, medidos con la Fredoka de la misión
     a 16 (peso 600). «leer el texto» 88,84; «subrayar» 64,91; «copiar en el
     cuaderno» 156,40; «en parejas» 74,29; la coma 3,58; el punto 3,47; el
     espacio 3,86; «Primero,» 59,89; «y» 8,94; «Después,» 63,89. Con los
     marcadores, el renglón más largo (el de «Después,») mide 227: cabe
     con aire. En dos renglones no cabía. Entre renglón y renglón queda
     sitio para la marca de las comas. Junto a un marcador el espacio es un
     poco más ancho (SPM): en el paso 5 cada uno lleva su aro, y con el
     espacio de siempre el aro se pegaba a la palabra de al lado. */
  var X0 = 22, SP = 3.86, SPM = 5.5;
  var RY = [33, 59, 85];
  var ANCH = {
    'leer el texto': 88.84, subrayar: 64.91, 'copiar en el cuaderno': 156.4, 'en parejas': 74.29,
    ',': 3.58, '.': 3.47, 'Primero,': 59.89, y: 8.94, 'Después,': 63.89
  };
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Dónde empieza cada cosa del maestro sin marcadores (O) y con ellos. */
  var C1_O = X0, C1_M = r2(X0 + ANCH['Primero,'] + SPM);
  var J1 = r2(C1_O + ANCH['leer el texto']);
  var C2_O = r2(J1 + ANCH[','] + SP);
  var Y_X = r2(C1_M + ANCH['leer el texto'] + SPM);
  var C2_M = r2(Y_X + ANCH.y + SPM);
  var C3_O = X0, C3_M = r2(X0 + ANCH['Después,'] + SPM);
  var PUNTO_FINAL = r2(X0 + ANCH['en parejas']);

  /* Los trabajos de abajo: las tres cosas que se hacen, en el orden en que
     se hicieron, a 14 («leer» 25,17; «subrayar» 56,80; «copiar» 39,75; el
     «›» 5,04, con 7 de aire a cada lado). Las dos maneras de ordenarlas
     miden lo mismo, 159,80, así que las dos filas acaban en el mismo sitio;
     con el cuaderno, la fila entera va centrada. */
  var ACC = { leer: 25.17, subrayar: 56.8, copiar: 39.75 };
  var SEP = 5.04, AIRE = 7, AX = 92;
  var ORDEN_SC = ['leer', 'subrayar', 'copiar'], ORDEN_CS = ['leer', 'copiar', 'subrayar'];
  var PAPEL_X0 = 84, PAPEL_X1 = r2(AX + 159.8 + 8);

  /* Cada fila: su orden, qué se hace en parejas y dónde va. R1 y R3 salen
     de debajo de R0 y R2 (se dibujan antes, así los tapan) y bajan a su
     sitio en el paso 2. */
  var YR = [131, 169, 207, 245], YF = 188;
  var FILAS = [
    { de: 'R1', orden: ORDEN_SC, pareja: ['leer', 'subrayar', 'copiar'], y: YR[1], nace: YR[0] },
    { de: 'R0', orden: ORDEN_SC, pareja: [], y: YR[0] },
    { de: 'R3', orden: ORDEN_CS, pareja: ['leer', 'subrayar', 'copiar'], y: YR[3], nace: YR[2] },
    { de: 'R2', orden: ORDEN_CS, pareja: [], y: YR[2] },
    { de: 'F', orden: ORDEN_SC, pareja: ['copiar'], y: YF }
  ];

  var TEXTOS = [
    'El maestro escribió cuatro cosas en la pizarra, separadas por comas. ¿Se puede entender de una sola manera? Decídelo y toca.',
    'Las comas no dicen si se subraya el texto o lo copiado. Unos subrayaron y copiaron; otros copiaron y subrayaron en el cuaderno.',
    'Tampoco dicen qué se hace en parejas. Medio grado lo hizo solo y medio en parejas. Cuatro trabajos: hubo que repetir la clase.',
    'Se escriben «Primero» y una «y» donde había coma: leer y subrayar el texto van juntos. Ya nadie subraya en el cuaderno.',
    'Tras «subrayar», la coma pasa a ser punto y «Después». «En parejas» queda con copiar: cada uno lee y subraya, y copian en parejas.',
    '«Primero», «y» y «Después» son marcadores textuales. No agregan nada que hacer: deciden cómo lo entiende el que lee.'
  ];

  var A;
  var gC1, gC2, gC3, coma1, marca1, coma2, marca2, punto2, coma3, marca3, puntoFinal, rayaParejas;
  var nuevas = {}, rayas = {}, aros = {}, filas = {}, leyenda;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Un pedazo de tiza en la pizarra. */
  function tiza(padre, dice, x, renglon, clase, rol) {
    return texto(padre, { class: clase, 'data-pizarra': rol, 'data-renglon': renglon, x: r2(x), y: RY[renglon - 1], 'font-size': 16 }, dice);
  }

  /* La marca de raya cortada debajo de una coma: esa juntura no dice nada
     todavía. Va debajo del renglón y apunta a la coma, como la de un
     corrector. */
  function marcaComa(padre, x, renglon, de) {
    var cx = r2(x + 2), y = RY[renglon - 1];
    return A.el('path', { class: 'mk-marca-abierta', 'data-marca-coma': de,
      d: 'M ' + r2(cx - 3.6) + ' ' + (y + 10.5) + ' L ' + cx + ' ' + (y + 4.5) + ' L ' + r2(cx + 3.6) + ' ' + (y + 10.5) }, padre);
  }

  /* El subrayado de tiza amarilla de lo que se agregó (raya entera), o el de
     «en parejas» mientras no se sabe para qué es (raya cortada). */
  function raya(padre, x, w, renglon, clase, de) {
    var y = RY[renglon - 1] + 4.5;
    return A.el('path', { class: clase, 'data-raya': de, d: 'M ' + r2(x) + ' ' + y + ' H ' + r2(x + w) }, padre);
  }

  /* Un trabajo: el cuaderno, la tira de papel, las tres cosas en el orden en
     que se hicieron, la banda de lo que se hizo en parejas y las banderitas
     de arriba. Todo en coordenadas de la fila (la raya de la letra en 0);
     la fila entera se mueve con su grupo de dentro y se apaga con el de
     fuera (la regla de las capas de la numeración maya). */
  function fila(padre, f) {
    var el = A.el;
    var fuera = el('g', { class: 'am-fuera', 'data-trabajo': f.de }, padre);
    var dentro = el('g', null, fuera);

    /* El cuaderno de ese trabajo. */
    el('rect', { class: 'mk-cuaderno', x: 61, y: -14, width: 14, height: 20, rx: 1.5 }, dentro);
    el('rect', { class: 'mk-cuaderno-etq', x: 65, y: -10, width: 8, height: 5.5, rx: 0.8 }, dentro);
    [-11, -6.5, -2, 2.5].forEach(function (y) { el('circle', { class: 'mk-espiral', cx: 61, cy: y, r: 1.4 }, dentro); });

    el('rect', { class: 'mk-papel', 'data-papel': '', x: PAPEL_X0, y: -14, width: r2(PAPEL_X1 - PAPEL_X0), height: 20, rx: 5 }, dentro);

    /* Dónde va cada cosa, en el orden en que se hizo. */
    var x = AX, pos = {};
    f.orden.forEach(function (a, i) {
      pos[a] = x;
      x += ACC[a];
      if (i < f.orden.length - 1) x += AIRE + SEP + AIRE;
    });

    /* La banda de lo que se hizo en parejas: de la primera a la última de
       ellas, que siempre van seguidas. */
    var banda = null, bandera = [];
    var enPar = f.orden.filter(function (a) { return f.pareja.indexOf(a) >= 0; });
    if (enPar.length) {
      var b0 = pos[enPar[0]] - 5, ult = enPar[enPar.length - 1], b1 = pos[ult] + ACC[ult] + 5;
      banda = el('rect', { class: 'mk-pareja', 'data-banda': 'pareja', x: r2(b0), y: -12.5, width: r2(b1 - b0), height: 17, rx: 4 }, dentro);
    }
    f.orden.forEach(function (a, i) {
      texto(dentro, { class: 'mk-accion', 'data-accion': a, x: r2(pos[a]), y: 0, 'font-size': 14 }, a);
      if (i < f.orden.length - 1) texto(dentro, { class: 'mk-sep', x: r2(pos[a] + ACC[a] + AIRE), y: 0, 'font-size': 14 }, '›');
    });

    /* Las banderitas: «solo» encima de lo que se hizo solo y «en parejas»
       encima de la banda. Aparecen cuando la pregunta de las parejas ya se
       hizo (paso 2); la fila F las trae desde que sale. */
    var sol = f.orden.filter(function (a) { return f.pareja.indexOf(a) < 0; });
    var gBand = el('g', { class: 'am-fuera' }, dentro);
    if (sol.length) bandera.push(texto(gBand, { class: 'mk-bandera', 'data-bandera': 'solo', x: r2(pos[sol[0]] - 5), y: -18, 'font-size': 11 }, 'solo'));
    if (enPar.length) bandera.push(texto(gBand, { class: 'mk-bandera', 'data-bandera': 'en parejas', x: r2(pos[enPar[0]] - 5), y: -18, 'font-size': 11 }, 'en parejas'));

    /* Antes de la pregunta de las parejas, la banda tampoco se ve. */
    if (banda && f.de !== 'F') banda.classList.add('am-fuera');
    return { fuera: fuera, dentro: dentro, banda: banda, banderas: gBand };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La pizarra, con su marco de madera. ── */
    el('rect', { class: 'mk-marco', x: 6, y: 6, width: 308, height: 90, rx: 5 }, svg);
    el('rect', { class: 'mk-verde', 'data-pizarra-fondo': '', x: 10, y: 10, width: 300, height: 82, rx: 3 }, svg);

    /* Renglón 1: «leer el texto, subrayar,». La coma de en medio se apaga
       cuando llega la «y»; la del final va con «subrayar» (se corre con él)
       y pasa a ser punto en el paso 4. */
    gC1 = el('g', null, svg);
    tiza(gC1, 'leer el texto', C1_O, 1, 'mk-tiza', 'maestro');
    coma1 = tiza(svg, ',', J1, 1, 'mk-tiza', 'coma');
    marca1 = marcaComa(svg, J1, 1, 'J1');
    gC2 = el('g', null, svg);
    tiza(gC2, 'subrayar', C2_O, 1, 'mk-tiza', 'maestro');
    coma2 = tiza(gC2, ',', C2_O + ANCH.subrayar, 1, 'mk-tiza', 'coma');
    marca2 = marcaComa(gC2, C2_O + ANCH.subrayar, 1, 'J2');
    punto2 = tiza(gC2, '.', C2_O + ANCH.subrayar, 1, 'mk-tiza-nueva am-fuera', 'punto');

    /* Renglón 2: «copiar en el cuaderno,». */
    gC3 = el('g', null, svg);
    tiza(gC3, 'copiar en el cuaderno', C3_O, 2, 'mk-tiza', 'maestro');
    coma3 = tiza(gC3, ',', C3_O + ANCH['copiar en el cuaderno'], 2, 'mk-tiza', 'coma');
    marca3 = marcaComa(gC3, C3_O + ANCH['copiar en el cuaderno'], 2, 'J3');

    /* Renglón 3: «en parejas», que no se mueve nunca. Mientras no se sabe
       para qué es, va subrayado con raya cortada. */
    tiza(svg, 'en parejas', X0, 3, 'mk-tiza', 'maestro');
    rayaParejas = raya(svg, X0, ANCH['en parejas'], 3, 'mk-raya-abierta am-fuera', 'en parejas');
    puntoFinal = tiza(svg, '.', PUNTO_FINAL, 3, 'mk-tiza-nueva am-fuera', 'punto');

    /* Lo que se agrega, en tiza amarilla y subrayado con raya entera. */
    nuevas['Primero,'] = tiza(svg, 'Primero,', X0, 1, 'mk-tiza-nueva am-fuera', 'nueva');
    nuevas.y = tiza(svg, 'y', Y_X, 1, 'mk-tiza-nueva am-fuera', 'nueva');
    nuevas['Después,'] = tiza(svg, 'Después,', X0, 2, 'mk-tiza-nueva am-fuera', 'nueva');
    rayas['Primero,'] = raya(svg, X0, ANCH['Primero,'], 1, 'mk-raya am-fuera', 'Primero,');
    rayas.y = raya(svg, Y_X, ANCH.y, 1, 'mk-raya am-fuera', 'y');
    rayas['Después,'] = raya(svg, X0, ANCH['Después,'], 2, 'mk-raya am-fuera', 'Después,');

    /* Paso 5: un aro de raya entera alrededor de cada marcador. */
    [['Primero,', X0, 1], ['y', Y_X, 1], ['Después,', X0, 2]].forEach(function (m) {
      var w = ANCH[m[0]], y = RY[m[2] - 1];
      aros[m[0]] = el('rect', { class: 'mk-aro am-fuera', 'data-aro-marcador': m[0], x: r2(m[1] - 2.5), y: y - 15, width: r2(w + 5), height: 21, rx: 7 }, svg);
    });

    /* ── Los trabajos del grado. ── */
    FILAS.forEach(function (f) { filas[f.de] = fila(svg, f); });

    /* ── Paso 5: lo que quiere decir el aro, en un pedazo de pizarra. ── */
    leyenda = el('g', { class: 'am-fuera', 'data-leyenda': '' }, svg);
    el('rect', { class: 'mk-verde', x: 80, y: 117, width: 160, height: 22, rx: 6 }, leyenda);
    el('rect', { class: 'mk-aro', 'data-leyenda-aro': '', x: 88, y: 122, width: 17, height: 12, rx: 5 }, leyenda);
    texto(leyenda, { class: 'mk-tiza', 'data-leyenda-dice': '', x: 111, y: 132.5, 'font-size': 12 }, 'marcadores textuales');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var vuelve = function (k) { return !ida && antes === k; };

    /* ── La pizarra ──
       Con marcadores (M): desde el paso 3, «Primero» y la «y»; desde el 4,
       el punto y «Después». Primero se apaga lo que se va, después se corren
       las palabras del maestro y al final se escribe lo nuevo: si se
       corrieran encima de la coma, se leería revuelto. De vuelta, al revés. */
    var m1 = n >= 3, m2 = n >= 4;
    var dMueve = ida ? 450 : 350, dEscribe = 1100, dVuelve = 900;

    A.ver(coma1, !m1, fue(3) ? 0 : (vuelve(3) ? dVuelve : 0));
    A.ver(marca1, !m1, fue(3) ? 0 : (vuelve(3) ? dVuelve : 0));
    A.mover(gC1, m1 ? C1_M - C1_O : 0, 0, 0, 1, fue(3) || vuelve(3) ? dMueve : 0);
    A.mover(gC2, m1 ? C2_M - C2_O : 0, 0, 0, 1, fue(3) || vuelve(3) ? dMueve : 0);
    ['Primero,', 'y'].forEach(function (w) {
      A.ver(nuevas[w], m1, fue(3) ? dEscribe : 0);
      A.ver(rayas[w], m1 && n < 5, fue(3) ? dEscribe : (vuelve(5) ? 400 : 0));
    });

    /* La coma que sigue a «subrayar»: su marca mientras la pizarra deja más de
       una lectura, y punto desde el paso 4. */
    A.ver(coma2, !m2, fue(4) ? 0 : (vuelve(4) ? dVuelve : 0));
    A.ver(marca2, !m2, fue(4) ? 0 : (vuelve(4) ? dVuelve : 0));
    A.ver(punto2, m2, fue(4) ? dEscribe : 0);
    A.mover(gC3, m2 ? C3_M - C3_O : 0, 0, 0, 1, fue(4) || vuelve(4) ? dMueve : 0);
    A.ver(marca3, !m2, fue(4) ? 0 : (vuelve(4) ? dVuelve : 0));
    A.ver(nuevas['Después,'], m2, fue(4) ? dEscribe : 0);
    A.ver(rayas['Después,'], m2 && n < 5, fue(4) ? dEscribe : (vuelve(5) ? 400 : 0));
    A.ver(puntoFinal, m2, fue(4) ? dEscribe : 0);

    /* «en parejas», con raya cortada desde que se pregunta (paso 2) hasta
       que el punto y «Después» lo dejan con copiar (paso 4). */
    A.ver(rayaParejas, n === 2 || n === 3, fue(2) ? 300 : (vuelve(4) ? dVuelve : 0));

    /* 5 · Los aros de los marcadores y la leyenda. */
    ['Primero,', 'y', 'Después,'].forEach(function (w, k) { A.ver(aros[w], n === 5, fue(5) ? 300 + k * 200 : 0); });
    A.ver(leyenda, n === 5, fue(5) ? 900 : 0);

    /* ── Los trabajos ──
       1 · las dos maneras de ordenar; 2 · cada una en solo y en parejas; 3 ·
       se van las que subrayan en el cuaderno; 4 · se van las dos que
       quedaban y sale la que la pizarra dice ahora. Los que se van, se van
       cuando la pizarra ya cambió: primero el texto, después lo que permite.
       Y la que sale espera a que las otras ya no se vean: sale en el sitio
       de la segunda, y encendidas a la vez se montaban. */
    var dSale = ida ? 1300 : 0, dEntra = ida ? 1850 : 500;
    var ve = {
      R0: n >= 1 && n <= 3, R2: n === 1 || n === 2,
      R1: n === 2 || n === 3, R3: n === 2, F: n >= 4
    };
    FILAS.forEach(function (f) {
      var h = filas[f.de], si = ve[f.de];
      var abajo = f.nace == null || n >= 2;
      var y = abajo ? f.y : f.nace;
      var dFuera = 0, dMover = 0;
      if (f.nace != null && (fue(2) || vuelve(2))) {
        /* R1 y R3 salen de debajo de R0 y R2: al ir, se encienden tapadas y
           bajan; al volver, suben y se apagan ya tapadas. */
        dFuera = fue(2) ? 0 : 800;
        dMover = fue(2) ? 100 : 0;
      } else if (si) {
        dFuera = fue(1) ? 300 : (fue(4) ? dEntra : (ida ? 0 : 500));
      } else {
        dFuera = ((fue(3) && (f.de === 'R2' || f.de === 'R3')) || (fue(4) && (f.de === 'R0' || f.de === 'R1'))) ? dSale : 0;
      }
      A.ver(h.fuera, si, dFuera);
      A.mover(h.dentro, 0, y, 0, 1, dMover);
      /* Las banderitas y la banda de las parejas: desde el paso 2. */
      var conModo = f.de === 'F' || n >= 2;
      A.ver(h.banderas, conModo, fue(2) ? 900 : 0);
      if (h.banda && f.de !== 'F') A.ver(h.banda, conModo, fue(2) ? 0 : (vuelve(2) ? 800 : 0));
    });
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'maneras de entender la pizarra' },
      { cifra: '2', palabras: 'maneras de hacer la tarea' },
      { cifra: '4', palabras: 'trabajos distintos: 2 × 2' },
      { cifra: '2', palabras: 'trabajos que todavía caben' },
      { cifra: '1', palabras: 'trabajo, igual para todos' },
      { cifra: '3', palabras: 'marcadores textuales' }
    ][n];
  }

  AnimacionMision.montar('#amPizarra', {
    vista: [ANCHO, ALTO],
    describe: 'La pizarra del maestro dice «leer el texto, subrayar, copiar en el cuaderno, en parejas». Debajo salen los trabajos del grado: unos subrayan y copian, otros copian y subrayan; unos solos, otros en parejas. Con «Primero», «y» y «Después» en la pizarra queda uno solo: cada uno lee y subraya, y copian en parejas.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['✏️ ¿Qué se subraya?', '👥 ¿Y en parejas?', '✍️ Escribir «Primero»', '✍️ Escribir «Después»', '🏷️ ¿Qué son?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
