/* ============================================================
   M.E.T.A.S · Los Adjetivos · «Tráeme el saco»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña Nely:
   mandó a Marvin al corredor con un «Tráeme el saco», y en el corredor había
   cuatro. Trajo uno y no era; trajo otro, tampoco; al tercer viaje bajó ella
   misma. Le habría bastado una palabra más: el grande, el viejo, el que está
   lleno. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza en
   cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  doña Nely dice «Tráeme el saco», y en el corredor hay cuatro. ¿Cuál
        es el que pidió? Se decide antes de tocar;
     1  la palabra «saco» sale del globo y se posa sobre CADA uno de los
        cuatro: les queda a todos, y con ella sola no se sabe cuál;
     2  se añade una palabra, «grande», y se posa sobre uno solo: es el único
        grande de los cuatro;
     3  «viejo» o «lleno» también bastaban, y cada una apunta a lo que solo ese
        saco tiene: los parches, y el nudo de un saco lleno;
     4  «saco» es el sustantivo y sigue siendo un saco; «grande», «viejo» y
        «lleno» son adjetivos, y dicen cuál de los cuatro;
     5  con esa palabra, Marvin lo trae a la primera.

   Cinco decisiones, y ninguna es de adorno:

   1. **La palabra se PRUEBA sobre las cosas**, como en Los Sustantivos, que es
      la etapa anterior de la misma ruta: allí «niña» les quedaba a cinco y
      «Kenia Ramírez» a una. Aquí «saco» les queda a los cuatro, y con una
      palabra más le queda a uno.
   2. ⚠️ **El saco sigue siendo saco, y se ve.** Sobre el bueno quedan las dos
      etiquetas, «saco» y encima «grande»: el adjetivo no le quita el
      sustantivo, le añade cuál. Es lo que dice el aviso de la historia: «no
      cambia el sustantivo (sigue siendo un saco), cambia cuál de todos».
   3. ⚠️ **La historia dice que bastaba UNA palabra, y cualquiera de las
      tres.** Para que eso sea verdad, el saco bueno es el ÚNICO grande, el
      único viejo y el único lleno: los otros tres son chicos, nuevos y a medio
      llenar, abiertos arriba. Si otro fuera grande, «el grande» no
      bastaría y la historia mentiría. Y cada adjetivo lleva su hilo hasta lo
      que lo hace verdad: los parches, el nudo.
   4. ⚠️ **La prueba no se regala.** Preguntaba «En «el perro grande», el
      adjetivo es «perro»», que es esta misma cuenta con otro sustantivo: ahora
      es «el puente angosto», en la misión y en la ficha. La tarea «La niña
      dibujó una casa grande» pasó a «redonda». Y aquí no sale ninguna palabra
      de sus preguntas, ni «ese» ni «este», que la prueba pregunta de qué clase
      son, ni «más», «muy» o «-ísimo», que son sus grados.
   5. **Lo que es papel es papel en las dos pantallas.** El globo y las
      etiquetas llevan su color siempre, con tinta oscura fija, y los sacos
      son de manta; los hilos y los rótulos, que van sobre el escenario, llevan
      el color de la misión en cada pantalla. Y nada se dice solo con color:
      lo que le queda a cualquiera va con raya cortada (la etiqueta «saco» y su
      subrayado en el globo) y lo que nombra a uno solo, con raya entera.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amSacos')) return;

  var ANCHO = 320, ALTO = 250, FIN = 5;

  /* El corredor: cuatro sacos, y el bueno es el tercero. */
  var SX = [80, 140, 212, 284];
  var BUENO = 2;
  var PISO = 226;
  /* Dónde acaba cada saco por arriba: los chicos, con la boca abierta y el
     borde enrollado, y el bueno, con la manta recogida encima del nudo. */
  var BOCA = 179.5, ARRIBA_CHICO = 175, ARRIBA_BUENO = 142;

  /* El globo: el renglón de lo que dice doña Nely, y dónde está cada palabra
     que sale de él. Medido con la Fredoka de la misión: «Tráeme el» mide 66,5,
     «saco» 31,2 y «grande» 47,5, y entre palabra y palabra va el espacio de
     esa letra (3,5). Se subrayan, en vez de encerrarlas en un recuadro, para
     que el renglón se lea con los espacios de siempre: subrayar el adjetivo
     es además lo que pide la tarea de la misión. */
  var R = 39;
  var X_EL = 150, X_SACO = 170, X_ADJ = 213.5;
  var ANCHO_SACO = 31.2, ANCHO_ADJ = 47.5;
  /* Dónde se posan las etiquetas: «saco» justo encima de cada saco, y los
     adjetivos en una fila encima de la del bueno. */
  var Y_SACO_CHICO = ARRIBA_CHICO - 14, Y_SACO_BUENO = ARRIBA_BUENO - 13;
  var Y_ADJ = Y_SACO_BUENO - 23;
  var X_VIEJO = 151, X_LLENO = 273;

  /* Marvin: a la izquierda del corredor, y junto al bueno al final. */
  var MX0 = 26, MX1 = 168;

  var TEXTOS = [
    'Hay cuatro sacos en el corredor. ¿Cuál es «el saco» que pidió doña Nely? Decídelo antes de tocar.',
    'La palabra «saco» les queda a los cuatro: con ella sola no se sabe cuál, y hay que ir a ver.',
    'Con otra palabra, «el saco grande», ya le queda a uno solo: es el único grande de los cuatro.',
    'También bastaba «viejo» o «lleno»: solo uno tiene parches, y solo uno va lleno y amarrado. Es el mismo.',
    '«Saco» es el sustantivo, y no cambia. «Grande», «viejo» y «lleno» son adjetivos: dicen cuál de los cuatro.',
    'Con «el saco grande», Marvin lo trae a la primera, y doña Nely no tiene que bajar.'
  ];

  var A;
  var rayaSaco, palabraAdj, rayaAdj, etiquetas = [], etGrande, etOtras = [], hilos = [];
  var conectorS, conectorA, rotuloS, rotuloA, marvin;

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una etiqueta copiada del globo: un papelito con la palabra. Va en dos
     piezas, porque aparece Y viaja: si la misma pieza hiciera las dos cosas,
     las dos llevarían la misma demora y saldría volando antes de verse (es la
     regla de las capas de la numeración maya). */
  function etiqueta(padre, palabra, ancho, alto, clase, de) {
    var fuera = A.el('g', { class: 'am-fuera aj-etiqueta ' + clase, 'data-etiqueta': de }, padre);
    var dentro = A.el('g', null, fuera);
    A.el('rect', { x: r2(-ancho / 2), y: r2(-alto / 2), width: ancho, height: alto, rx: r2(alto / 2) }, dentro);
    texto(dentro, { class: 'aj-tinta', x: 0, y: r2(alto * 0.24), 'text-anchor': 'middle', 'font-size': alto > 18 ? 14 : 13 }, palabra);
    return { fuera: fuera, dentro: dentro };
  }

  /* Un saco chico y nuevo, a medio llenar: se ensancha hacia abajo, donde
     está lo que lleva, y arriba queda abierto, con el borde enrollado y la
     boca oscura, porque no va lleno. Sin parches y sin nudo. */
  function sacoChico(padre, i) {
    var el = A.el, x = SX[i], y = PISO;
    var g = el('g', { class: 'aj-saco', 'data-saco': i }, padre);
    el('path', { class: 'aj-manta', 'data-cuerpo': '', d:
      'M ' + (x - 19) + ' ' + y + ' Q ' + (x - 23) + ' ' + y + ' ' + r2(x - 22.5) + ' ' + (y - 6) +
      ' C ' + (x - 22) + ' ' + (y - 18) + ' ' + (x - 21) + ' ' + (y - 30) + ' ' + (x - 18) + ' ' + (y - 40) +
      ' Q ' + (x - 17) + ' ' + (y - 43) + ' ' + r2(x - 19.5) + ' ' + BOCA + ' H ' + r2(x + 19.5) +
      ' Q ' + (x + 17) + ' ' + (y - 43) + ' ' + (x + 18) + ' ' + (y - 40) +
      ' C ' + (x + 21) + ' ' + (y - 30) + ' ' + (x + 22) + ' ' + (y - 18) + ' ' + r2(x + 22.5) + ' ' + (y - 6) +
      ' Q ' + (x + 23) + ' ' + y + ' ' + (x + 19) + ' ' + y + ' Z' }, g);
    /* La trama de la manta, a lo ancho y a lo alto: es lo que dice que esto es
       tela y no una tinaja. */
    el('path', { class: 'aj-trama', d: 'M ' + (x - 21) + ' ' + (y - 24) + ' H ' + (x + 21) + ' M ' + (x - 22) + ' ' + (y - 12) + ' H ' + (x + 22) +
      ' M ' + (x - 11) + ' ' + (y - 36) + ' V ' + (y - 3) + ' M ' + x + ' ' + (y - 34) + ' V ' + (y - 3) + ' M ' + (x + 11) + ' ' + (y - 36) + ' V ' + (y - 3) }, g);
    /* Los pliegues de la tela floja, debajo del borde. */
    el('path', { class: 'aj-pliegue', d: 'M ' + (x - 8) + ' ' + (BOCA + 4) + ' q 2 5 0 10 M ' + (x + 7) + ' ' + (BOCA + 4) + ' q -2 5 0 9' }, g);
    /* El borde enrollado y la boca abierta. */
    var boca = el('g', { 'data-boca': '' }, g);
    el('ellipse', { class: 'aj-borde', cx: x, cy: BOCA, rx: 19.5, ry: 4.5 }, boca);
    el('ellipse', { class: 'aj-hueco', cx: x, cy: BOCA - 0.3, rx: 14.5, ry: 2.3 }, boca);
    return g;
  }

  /* El bueno: grande, viejo y lleno. Lleno hasta arriba, con la manta
     recogida y amarrada con una cuerda; viejo, con dos parches cosidos. */
  function sacoBueno(padre) {
    var el = A.el, x = SX[BUENO], y = PISO;
    var g = el('g', { class: 'aj-saco', 'data-saco': BUENO }, padre);
    el('path', { class: 'aj-manta-vieja', 'data-cuerpo': '', d:
      'M ' + (x - 9) + ' 156 C ' + (x - 20) + ' 160 ' + (x - 31) + ' 168 ' + (x - 32) + ' 182 L ' + (x - 33) + ' ' + (y - 8) +
      ' Q ' + (x - 33) + ' ' + y + ' ' + (x - 25) + ' ' + y + ' H ' + (x + 25) + ' Q ' + (x + 33) + ' ' + y + ' ' + (x + 33) + ' ' + (y - 8) +
      ' L ' + (x + 32) + ' 182 C ' + (x + 31) + ' 168 ' + (x + 20) + ' 160 ' + (x + 9) + ' 156 Z' }, g);
    el('path', { class: 'aj-trama', d: 'M ' + (x - 30) + ' 190 H ' + (x + 30) + ' M ' + (x - 32) + ' 204 H ' + (x + 32) + ' M ' + (x - 32) + ' 216 H ' + (x + 32) +
      ' M ' + (x - 18) + ' 170 V 223 M ' + x + ' 162 V 223 M ' + (x + 18) + ' 170 V 223' }, g);
    /* La manta recogida encima del nudo. */
    el('path', { class: 'aj-manta-vieja', d:
      'M ' + (x - 8) + ' 157 L ' + (x - 12) + ' 147 Q ' + (x - 6) + ' ' + (ARRIBA_BUENO - 1) + ' ' + x + ' 145 Q ' + (x + 6) + ' ' + (ARRIBA_BUENO - 1) + ' ' + (x + 12) + ' 147 L ' + (x + 8) + ' 157 Z' }, g);
    /* Los dos parches, con su puntada. */
    el('rect', { class: 'aj-parche', 'data-parche': '', x: x - 25, y: 181, width: 14, height: 13, transform: 'rotate(-8 ' + (x - 18) + ' 187.5)' }, g);
    el('rect', { class: 'aj-parche', 'data-parche': '', x: x + 9, y: 203, width: 13, height: 11, transform: 'rotate(7 ' + (x + 15.5) + ' 208.5)' }, g);
    /* La cuerda, con el nudo y sus dos puntas. */
    var nudo = el('g', { 'data-nudo': '' }, g);
    el('path', { class: 'aj-cuerda', d: 'M ' + (x - 10) + ' 156 H ' + (x + 10) }, nudo);
    el('path', { class: 'aj-cuerda', d: 'M ' + (x + 7) + ' 156 q 5 3 4 11 M ' + (x + 7) + ' 156 q 9 1 11 8' }, nudo);
    el('circle', { class: 'aj-nudo', cx: x + 7, cy: 156, r: 2.6 }, nudo);
    return g;
  }

  /* Marvin, con su camiseta y su short. Se distingue por la silueta, no por
     el color. */
  function nino(padre) {
    var el = A.el, x = MX0, y = PISO - 54;
    var g = el('g', { class: 'aj-marvin', 'data-marvin': '' }, padre);
    var piel = '#8d5524';
    el('path', { class: 'aj-pierna', stroke: piel, d: 'M ' + (x - 4) + ' ' + (y + 38) + ' V ' + (y + 51) + ' M ' + (x + 4) + ' ' + (y + 38) + ' V ' + (y + 51) }, g);
    el('ellipse', { class: 'aj-zapato', cx: x - 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    el('ellipse', { class: 'aj-zapato', cx: x + 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    el('path', { class: 'aj-short', d: 'M ' + (x - 8) + ' ' + (y + 29) + ' H ' + (x + 8) + ' L ' + (x + 9) + ' ' + (y + 40) + ' H ' + r2(x + 1.2) + ' V ' + (y + 35) + ' H ' + r2(x - 1.2) + ' V ' + (y + 40) + ' H ' + (x - 9) + ' Z' }, g);
    el('path', { class: 'aj-camiseta', d: 'M ' + (x - 8) + ' ' + (y + 11) + ' Q ' + x + ' ' + (y + 8) + ' ' + (x + 8) + ' ' + (y + 11) +
      ' L ' + (x + 12) + ' ' + (y + 19) + ' L ' + (x + 8.5) + ' ' + (y + 21) + ' V ' + (y + 31) + ' H ' + (x - 8.5) + ' V ' + (y + 21) +
      ' L ' + (x - 12) + ' ' + (y + 19) + ' Z' }, g);
    el('path', { class: 'aj-brazo', stroke: piel, d: 'M ' + (x - 10.5) + ' ' + (y + 20) + ' L ' + (x - 11.5) + ' ' + (y + 29) + ' M ' + (x + 10.5) + ' ' + (y + 20) + ' L ' + (x + 11.5) + ' ' + (y + 29) }, g);
    el('circle', { class: 'aj-cabeza', fill: piel, cx: x, cy: y, r: 9 }, g);
    el('path', { class: 'aj-pelo', d: 'M ' + r2(x - 9.2) + ' ' + (y - 1) + ' C ' + r2(x - 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.2) + ' ' + (y - 1) +
      ' C ' + (x + 5) + ' ' + r2(y - 5.5) + ' ' + (x - 5) + ' ' + r2(y - 5.5) + ' ' + r2(x - 9.2) + ' ' + (y - 1) + ' Z' }, g);
    el('circle', { class: 'aj-ojo', cx: x - 3, cy: y + 1, r: 1.1 }, g);
    el('circle', { class: 'aj-ojo', cx: x + 3, cy: y + 1, r: 1.1 }, g);
    el('path', { class: 'aj-boca', d: 'M ' + r2(x - 2.6) + ' ' + (y + 4.2) + ' Q ' + x + ' ' + (y + 6.4) + ' ' + r2(x + 2.6) + ' ' + (y + 4.2) }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Lo que dice doña Nely, desde arriba: el globo apunta hacia donde
       está ella. ── */
    var globo = el('g', { class: 'aj-dicho' }, svg);
    el('path', { class: 'aj-globo', d: 'M 16 12 H 30 L 36 2 L 44 12 H 304 Q 314 12 314 22 V 44 Q 314 54 304 54 H 16 Q 6 54 6 44 V 22 Q 6 12 16 12 Z' }, globo);
    texto(globo, { class: 'aj-gris', 'data-renglon': 1, x: 14, y: R, 'font-size': 11 }, 'Doña Nely:');
    texto(globo, { class: 'aj-tinta', 'data-renglon': 1, x: X_EL, y: R, 'text-anchor': 'end', 'font-size': 15 }, 'Tráeme el');
    texto(globo, { class: 'aj-tinta', 'data-renglon': 1, 'data-palabra': 'saco', x: X_SACO, y: R, 'text-anchor': 'middle', 'font-size': 15 }, 'saco');
    /* La palabra que faltaba, que se escribe en el paso 2. */
    palabraAdj = texto(globo, { class: 'aj-tinta-azul am-fuera', 'data-renglon': 1, 'data-palabra': 'grande', x: X_ADJ, y: R, 'text-anchor': 'middle', 'font-size': 15 }, 'grande');
    /* El subrayado de «saco», con raya cortada como la etiqueta que sale de
       él; y el de «grande», con raya entera. */
    rayaSaco = el('path', { class: 'aj-subraya aj-subraya-cualquiera am-fuera', 'data-raya': 'saco', d: 'M ' + r2(X_SACO - ANCHO_SACO / 2) + ' ' + (R + 5) + ' H ' + r2(X_SACO + ANCHO_SACO / 2) }, globo);
    rayaAdj = el('path', { class: 'aj-subraya', 'data-raya': 'grande', d: 'M ' + r2(X_ADJ - ANCHO_ADJ / 2) + ' ' + (R + 5) + ' H ' + r2(X_ADJ + ANCHO_ADJ / 2) }, globo);

    /* ── Los rótulos del paso 4, cada uno con su hilo hasta su palabra. ── */
    conectorS = el('path', { class: 'aj-conector', 'data-conector': 'sustantivo', d: 'M ' + (X_SACO - 4) + ' ' + (R + 7) + ' L 142 63' }, svg);
    conectorA = el('path', { class: 'aj-conector', 'data-conector': 'adjetivo', d: 'M ' + (X_ADJ + 6) + ' ' + (R + 7) + ' L 262 63' }, svg);
    rotuloS = el('g', { class: 'am-fuera aj-rotulo', 'data-rotulo': 'sustantivo' }, svg);
    el('rect', { class: 'am-ficha', x: 76, y: 63, width: 76, height: 20, rx: 10 }, rotuloS);
    texto(rotuloS, { class: 'aj-rotulo-txt', x: 114, y: 77.5, 'text-anchor': 'middle', 'font-size': 12 }, 'sustantivo');
    rotuloA = el('g', { class: 'am-fuera aj-rotulo', 'data-rotulo': 'adjetivo' }, svg);
    el('rect', { class: 'am-ficha', x: 246, y: 63, width: 62, height: 20, rx: 10 }, rotuloA);
    texto(rotuloA, { class: 'aj-rotulo-txt', x: 277, y: 77.5, 'text-anchor': 'middle', 'font-size': 12 }, 'adjetivo');

    /* ── El corredor. ── */
    el('path', { class: 'aj-piso', d: 'M 6 ' + PISO + ' H 314' }, svg);
    texto(svg, { class: 'am-rotulo', x: ANCHO / 2, y: 243, 'text-anchor': 'middle', 'font-size': 12 }, 'el corredor');
    var sacos = el('g', null, svg);
    SX.forEach(function (x, i) { if (i === BUENO) sacoBueno(sacos); else sacoChico(sacos, i); });
    marvin = nino(svg);

    /* Los hilos de «viejo» y «lleno», hasta lo que las hace verdad: el
       parche de arriba y el nudo. Acaban en un aro alrededor de eso, para que
       se vea dónde, y el aro deja ver lo que rodea. */
    var xb = SX[BUENO];
    [['viejo', X_VIEJO + 8, xb - 18, 187.5, 11], ['lleno', X_LLENO - 10, xb + 7, 156, 5.5]].forEach(function (h) {
      var x0 = h[1], y0 = Y_ADJ + 10, cx = h[2], cy = h[3], rr = h[4];
      var dx = cx - x0, dy = cy - y0, L = Math.sqrt(dx * dx + dy * dy);
      var x1 = r2(cx - rr * dx / L), y1 = r2(cy - rr * dy / L);
      /* En un grupo, para que en el paso 5 se vayan apagándose y no
         destrazándose: una raya que se recoge deja pedazos colgando. */
      var grupo = el('g', { class: 'aj-senala' }, svg);
      var p = el('path', { class: 'aj-hilo', 'data-hilo': h[0], d: 'M ' + x0 + ' ' + y0 + ' L ' + x1 + ' ' + y1 }, grupo);
      var aro = el('circle', { class: 'aj-aro', 'data-aro': h[0], cx: cx, cy: cy, r: rr }, grupo);
      hilos.push({ de: h[0], grupo: grupo, p: p, aro: aro });
    });

    /* Las etiquetas, encima de todo: salen del globo. «Viejo» y «lleno» van
       DEBAJO de «grande», porque salen de detrás de ella: encima, las tres
       palabras se leerían revueltas mientras se apartan. */
    var capa = el('g', null, svg);
    etiquetas = SX.map(function (x, i) {
      var e = etiqueta(capa, 'saco', 40, 18, 'aj-cualquiera aj-atenua', 'saco');
      e.i = i;
      return e;
    });
    etOtras = [
      { de: 'viejo', x: X_VIEJO, e: etiqueta(capa, 'viejo', 50, 20, 'aj-uno', 'viejo') },
      { de: 'lleno', x: X_LLENO, e: etiqueta(capa, 'lleno', 50, 20, 'aj-uno', 'lleno') }
    ];
    etGrande = etiqueta(capa, 'grande', 56, 20, 'aj-uno', 'grande');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);

    /* 1 · La palabra «saco» se prueba sobre cada saco, de izquierda a
       derecha: aparece en el globo, vuela y se posa. */
    A.ver(rayaSaco, n >= 1, 0);
    etiquetas.forEach(function (et, k) {
      var d = n === 1 && ida ? 300 + k * 190 : 0;
      A.ver(et.fuera, n >= 1, d);
      if (n >= 1) A.mover(et.dentro, SX[et.i], et.i === BUENO ? Y_SACO_BUENO : Y_SACO_CHICO, 0, 1, n === 1 && ida ? d + 150 : 0);
      else A.mover(et.dentro, X_SACO, R - 5, 0, 1, 0);
      /* Con el adjetivo escrito, lo que le queda a cualquiera se queda, pero
         tenue: el ojo va a lo que nombra a uno solo. */
      et.fuera.classList.toggle('aj-tenue', n >= 2);
    });

    /* 2 · Se escribe «grande», y su etiqueta se posa sobre uno solo, encima
       de su «saco». */
    var adj = n === 2 && ida;
    A.ver(palabraAdj, n >= 2, 0);
    A.trazar(rayaAdj, n >= 2, adj ? 400 : 0);
    A.ver(etGrande.fuera, n >= 2, adj ? 900 : 0);
    if (n >= 2) A.mover(etGrande.dentro, SX[BUENO], Y_ADJ, 0, 1, adj ? 1050 : 0);
    else A.mover(etGrande.dentro, X_ADJ, R - 5, 0, 1, 0);

    /* 3 · «Viejo» y «lleno» salen de donde está «grande», que es el sitio de
       la palabra que faltaba, y se apartan a los lados; después, el hilo hasta
       lo que las hace verdad. En el paso 5 se van: lo que doña Nely dice es
       «el saco grande», y Marvin pasa por donde iban sus hilos. */
    var otras = n === 3 && ida, hay = n === 3 || n === 4;
    etOtras.forEach(function (o, k) {
      var d = otras ? 200 + k * 500 : 0;
      A.ver(o.e.fuera, hay, d);
      if (n >= 3) A.mover(o.e.dentro, o.x, Y_ADJ, 0, 1, otras ? d : 0);
      else A.mover(o.e.dentro, SX[BUENO], Y_ADJ, 0, 0.6, 0);
      A.trazar(hilos[k].p, n >= 3, otras ? d + 900 : 0);
      A.trazar(hilos[k].aro, n >= 3, otras ? d + 1500 : 0);
      A.ver(hilos[k].grupo, n <= 4, 0);
    });

    /* 4 · Qué es cada una, con su hilo hasta su palabra del globo. */
    var clases = n === 4 && ida;
    A.trazar(conectorS, n >= 4, 0);
    A.ver(rotuloS, n >= 4, clases ? 500 : 0);
    A.trazar(conectorA, n >= 4, clases ? 300 : 0);
    A.ver(rotuloA, n >= 4, clases ? 800 : 0);

    /* 5 · Marvin va derecho al bueno. */
    A.mover(marvin, n >= 5 ? MX1 - MX0 : 0, 0, 0, 1, 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿cuál de los cuatro?' },
      { cifra: '4', palabras: 'sacos a los que nombra «saco»' },
      { cifra: '1', palabras: 'saco: el grande' },
      { cifra: '3', palabras: 'palabras, y cualquiera basta' },
      { cifra: '2', palabras: 'clases: sustantivo y adjetivo' },
      { cifra: '1', palabras: 'viaje, y no tres' }
    ][n];
  }

  AnimacionMision.montar('#amSacos', {
    vista: [ANCHO, ALTO],
    describe: 'El corredor de la casa, con cuatro sacos: tres chicos, nuevos y a medio llenar, y uno grande, viejo y lleno. La palabra «saco» se posa sobre los cuatro; «grande», sobre uno solo, y Marvin lo trae a la primera.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🎒 Probar con «saco»', '✏️ Otra palabra', '🔎 Otras palabras', '🏷️ ¿Qué es cada una?', '🏃 El viaje de Marvin', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
