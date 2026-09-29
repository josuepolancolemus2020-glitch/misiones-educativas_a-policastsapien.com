/* ============================================================
   M.E.T.A.S · Los Pronombres · «Dígale que lo lleve mañana»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia del mensaje que
   llegó al grupo de las familias: decía solo «Dígale que lo lleve
   mañana», y al día siguiente una familia mandó el cuaderno, otra el
   dinero de la merienda y tres no mandaron nada. El aparato (botones,
   frase, marcador) vive en js/animacion-mision.js; aquí solo está el
   dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el mensaje, en el grupo, con «le» y «lo» subrayados con raya
        cortada; debajo, los cinco niños de esas cinco familias. La
        historia pide contar cuántas cosas puede decir: se cuenta antes
        de tocar;
     1  «le» no dice a quién: se prueba en los cinco, y les queda a todos,
        niñas y niños;
     2  «lo» tampoco dice qué: el cuaderno o el dinero de la merienda. Con
        cinco niños y dos cosas, la misma frase ya dice diez mensajes;
     3  lo que pasó: Kenia llevó un cuaderno, Selvin el dinero, y en tres
        casas no mandaron nada;
     4  con una frase antes, «Marvin olvidó el cuaderno.», «le» ya es
        Marvin y «lo», el cuaderno: las cinco casas leen lo mismo, y el
        cuaderno le llega a quien tenía que llegarle;
     5  «le» y «lo» son pronombres: toman el lugar de «Marvin» y de «el
        cuaderno» para no repetirlos.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que el pronombre deja abierto se CUENTA.** La historia
      termina pidiendo contar las cosas distintas que puede decir esa
      frase. Aquí se ve: «le» se posa en los cinco niños y «lo» en dos
      cosas, y el marcador multiplica lo que se ve, 5 × 2 = 10. Y se dice
      «ya son diez»: en el grupo puede haber más familias y más cosas que
      llevar, así que diez es lo menos, no la respuesta.
   2. ⚠️ **Nadie se equivocó: el mensaje no decía.** Kenia llevó un
      cuaderno que no le pidieron y Selvin un dinero que no hacía falta,
      y en la casa de Marvin, que era a quien le tocaba, no mandaron
      nada. Nadie lleva una ✗: el que cambia en el paso 4 es el mensaje,
      no las familias.
   3. **La pregunta se contesta en el mismo sitio donde se hizo.** Debajo
      de «le» está «¿a quién?» y debajo de «lo», «¿qué?», con raya
      cortada; con la frase de antes, en el mismo sitio quedan «a Marvin»
      y «el cuaderno», con raya entera, y un hilo sube de cada pronombre
      hasta la palabra de la que saca lo que dice.
   4. ⚠️ **La prueba no se regala.** Su selección múltiple preguntaba
      «“Dígale que lo lleve mañana” no se entiende porque…», que es la
      historia palabra por palabra, y la ficha igual: ahora pregunta a qué
      se refiere «le» en otra oración (pronombres.js y la ficha). Aquí no
      se nombra ninguna clase de pronombre, ni «antecedente», que son los
      pareados; ni sale ninguna palabra de las respuestas de la prueba.
      «Dígale» lleva el pronombre pegado, y no se dice cómo se llama ni se
      separa en dos: pegar el verbo con el pronombre es lo que pide el
      completar.
   5. **Los pronombres de las frases no traen trampa.** Una lección de
      pronombres no puede tener uno que no se sepa a qué se refiere. Al
      escribirlas, la del paso 3 salió con «en tres casas no supieron si
      era para ellas», y ya no se sabía si «ellas» eran las casas o las
      familias: ahora dice que el mensaje no decía a qué casa.
   6. **El mensaje es de papel en las dos pantallas.** El globo del grupo
      lleva su color siempre, con tinta oscura fija; lo que va sobre el
      escenario (los hilos, los aros, los nombres) lleva la tinta de la
      pantalla. Y nada se dice solo con color: lo que queda abierto va con
      raya cortada (los subrayados, las preguntas, los hilos y los aros)
      y lo que ya se sabe, con raya entera.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMensaje')) return;

  var ANCHO = 320, ALTO = 252, FIN = 5;

  /* El globo del mensaje: de un renglón mientras el mensaje va solo, y de
     dos cuando le llega la frase de antes. La punta de arriba a la
     izquierda es la de un mensaje recibido. */
  var BX0 = 12, BX1 = 246, BY0 = 19, BY1 = 51, BY2 = 81;

  /* Las palabras, medidas con la Fredoka de la misión a 17 (peso 600):
     «Díga» 34,03 y «le» 14,25 («Dígale» entera mide 48,28: van pegadas,
     como se escribe); «que» 28,02; «lo» 14,62; «lleve» 36,58; «mañana»
     61,51; el punto 3,69; y el espacio, 4,1. La frase de antes: «Marvin»
     53,79; «olvidó» 46,75; «el» 14,25; «cuaderno» 72,67. El mensaje va en
     su renglón (MY) y baja un renglón (BAJA) cuando llega la frase. */
  var X0 = 24, SP = 4.1, MY = 40, BAJA = 30;
  var MSG = ['Díga', 'le', 'que', 'lo', 'lleve', 'mañana', '.'];
  var CTX = ['Marvin', 'olvidó', 'el', 'cuaderno', '.'];
  var ANCH = {
    'Díga': 34.03, le: 14.25, que: 28.02, lo: 14.62, lleve: 36.58, 'mañana': 61.51, '.': 3.69,
    Marvin: 53.79, 'olvidó': 46.75, el: 14.25, cuaderno: 72.67
  };
  function seguidas(lista) {
    var x = X0, out = {};
    lista.forEach(function (p, i) {
      var sig = lista[i + 1];
      out[p] = x;
      x += ANCH[p] + (sig === '.' || (p === 'Díga' && sig === 'le') ? 0 : SP);
    });
    return out;
  }
  var XM = seguidas(MSG), XC = seguidas(CTX);
  function centro(p) { return XM[p] + ANCH[p] / 2; }
  var PRON = ['le', 'lo'];

  /* Las preguntas y sus respuestas, a 12 («¿a quién?» 50,44; «¿qué?»
     31,25; «a Marvin» 47,62; «el cuaderno» 64,25; «pronombres» 64,62),
     cada una centrada debajo de su pronombre. Las dos no caben en la misma
     fila («el cuaderno» se montaría en «a Marvin»), así que la de «lo» va
     un escalón más abajo, con su palito hasta el subrayado. */
  var PREG = { le: '¿a quién?', lo: '¿qué?' };
  var RESP = { le: 'a Marvin', lo: 'el cuaderno' };
  var ANCH12 = { '¿a quién?': 50.44, '¿qué?': 31.25, 'a Marvin': 47.62, 'el cuaderno': 64.25, pronombres: 64.62 };
  var PY = { le: 55, lo: 75 }, PH = 16;

  /* Los cinco niños de esas cinco familias, con el uniforme de la
     escuela. Marvin es el tercero; debajo de cada uno va su nombre. */
  var NINOS = [
    { nombre: 'Kenia', es: 'nina' },
    { nombre: 'Selvin', es: 'nino' },
    { nombre: 'Marvin', es: 'nino' },
    { nombre: 'Yeimy', es: 'nina' },
    { nombre: 'Wilmer', es: 'nino' }
  ];
  var MARVIN = 2;
  function xDe(i) { return 36 + 62 * i; }
  var YC = 178, YN = 246, YCOSA = 148, RA = 13;
  var PIEL = ['#c68642', '#8d5524', '#e0ac69', '#a1665e', '#7b4a32'];
  var LAZO = ['#e84393', '#0984e3'];

  /* Lo que se pudo llevar: dónde aparece (paso 2), a quién le tocó según
     cada casa (paso 3) y a quién le toca de verdad (paso 4). Aparecen a la
     derecha de «¿qué?», una a su altura y la otra más abajo, con lo que
     son escrito al lado: puestas las dos debajo, los dos hilos salían casi
     juntos del mismo punto y se leían como uno solo. */
  var BANDA = { cuaderno: [190, 84], dinero: [194, 120] };
  var HILO_A = { cuaderno: 176, dinero: 177 };
  var LLEVO = { cuaderno: 0, dinero: 1 };
  var ROT_COSA = { cuaderno: 'el cuaderno', dinero: 'el dinero' };
  var DUDA = [2, 3, 4];

  /* Paso 5: los dos pronombres bajan a una misma raya, y de ella cuelga
     su nombre. */
  var LLAVE_Y = 112, ROT_Y = 118;

  var TEXTOS = [
    'Este mensaje llegó a las cinco familias del grupo. Cuenta las cosas distintas que puede decir antes de tocar.',
    '«Le» no dice a quién. Puede ser cualquiera de los cinco, y no dice si es niña o niño.',
    '«Lo» tampoco dice qué: el cuaderno o el dinero de la merienda. Con cinco niños y dos cosas, ya son diez mensajes.',
    'Eso pasó: Kenia llevó un cuaderno y Selvin el dinero. Tres familias no mandaron nada: el mensaje no decía a qué casa.',
    'Con una frase antes, «le» ya es Marvin y «lo», el cuaderno. Las cinco familias leen el mismo mensaje.',
    '«Le» y «lo» son pronombres: toman el lugar de «Marvin» y de «el cuaderno» para no repetir los nombres.'
  ];

  var A;
  var globo1, globo2, gMsg, ctx = [], huecos = {}, subrayas = {}, subCtx = [], arcos = [];
  var preguntas = {}, respuestas = {}, hilosLe = [], anillos = [], cosas = {}, rotCosas = {}, hilosLo = [];
  var dudas = [], anilloMarvin, marcoMarvin, conectores = [], llave = [], rotPron, gArcos, gLlave;

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  function globo(y1) {
    return 'M 4 ' + BY0 + ' H ' + (BX1 - 8) + ' A 8 8 0 0 1 ' + BX1 + ' ' + (BY0 + 8) + ' V ' + (y1 - 8) +
      ' A 8 8 0 0 1 ' + (BX1 - 8) + ' ' + y1 + ' H ' + (BX0 + 8) + ' A 8 8 0 0 1 ' + BX0 + ' ' + (y1 - 8) +
      ' V ' + (BY0 + 9) + ' Z';
  }

  /* Una píldora debajo de un pronombre, con su palito hasta el
     subrayado: la pregunta (raya cortada) o la respuesta (raya entera). */
  function pildora(padre, p, dice, y, linea, clase, dato) {
    var w = r2(ANCH12[dice] + 8), cx = r2(centro(p));
    var g = A.el('g', { class: 'am-fuera pn-pildora ' + clase }, padre);
    g.setAttribute(dato, p);
    A.el('path', { class: 'pn-palito', d: 'M ' + cx + ' ' + (linea + 1.5) + ' V ' + y }, g);
    A.el('rect', { x: r2(cx - w / 2), y: y, width: w, height: PH, rx: 8 }, g);
    texto(g, { x: cx, y: y + 12, 'text-anchor': 'middle', 'font-size': 12 }, dice);
    return g;
  }

  /* Un alumno con el uniforme de la escuela: blusa o camisa blanca, y
     falda o pantalón azul. Se distinguen por la silueta (la falda que se
     abre, las dos piernas del pantalón, las colitas del pelo), no por el
     color. */
  function alumno(padre, i) {
    var el = A.el, x = xDe(i), es = NINOS[i].es, y = YC;
    var g = el('g', { class: 'pn-alumno', 'data-alumno': i, 'data-es': es, 'data-nombre': NINOS[i].nombre }, padre);
    var piel = PIEL[i % PIEL.length];
    el('path', { class: 'pn-pierna', stroke: piel, d: 'M ' + r2(x - 4) + ' ' + (y + 40) + ' V ' + (y + 51) + ' M ' + r2(x + 4) + ' ' + (y + 40) + ' V ' + (y + 51) }, g);
    el('ellipse', { class: 'pn-zapato', cx: x - 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    el('ellipse', { class: 'pn-zapato', cx: x + 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    if (es === 'nina') {
      el('path', { class: 'pn-azul', d: 'M ' + (x - 8) + ' ' + (y + 30) + ' H ' + (x + 8) + ' L ' + (x + 12) + ' ' + (y + 43) + ' H ' + (x - 12) + ' Z' }, g);
    } else {
      el('path', { class: 'pn-azul', d: 'M ' + (x - 8) + ' ' + (y + 30) + ' H ' + (x + 8) + ' V ' + (y + 50) + ' H ' + r2(x + 1.2) + ' V ' + (y + 38) + ' H ' + r2(x - 1.2) + ' V ' + (y + 50) + ' H ' + (x - 8) + ' Z' }, g);
    }
    el('path', { class: 'pn-blusa', d: 'M ' + (x - 8) + ' ' + (y + 11) + ' Q ' + x + ' ' + (y + 7) + ' ' + (x + 8) + ' ' + (y + 11) +
      ' L ' + (x + 11.5) + ' ' + (y + 25) + ' L ' + (x + 8) + ' ' + (y + 26) + ' V ' + (y + 32) + ' H ' + (x - 8) + ' V ' + (y + 26) +
      ' L ' + (x - 11.5) + ' ' + (y + 25) + ' Z' }, g);
    if (es === 'nina') {
      var lazo = LAZO[i === 0 ? 0 : 1];
      el('circle', { class: 'pn-pelo', cx: x - 11, cy: y + 2, r: 3.8 }, g);
      el('circle', { class: 'pn-pelo', cx: x + 11, cy: y + 2, r: 3.8 }, g);
      el('circle', { class: 'pn-lazo', fill: lazo, cx: x - 9.2, cy: y - 2.4, r: 2 }, g);
      el('circle', { class: 'pn-lazo', fill: lazo, cx: x + 9.2, cy: y - 2.4, r: 2 }, g);
    }
    el('circle', { class: 'pn-cabeza', fill: piel, cx: x, cy: y, r: 9 }, g);
    el('path', { class: 'pn-pelo', d: es === 'nina'
      ? 'M ' + r2(x - 9.3) + ' ' + (y + 1) + ' C ' + r2(x - 10) + ' ' + (y - 12) + ' ' + r2(x + 10) + ' ' + (y - 12) + ' ' + r2(x + 9.3) + ' ' + (y + 1) +
        ' C ' + r2(x + 6) + ' ' + (y - 5) + ' ' + r2(x + 1) + ' ' + (y - 6) + ' ' + x + ' ' + (y - 4) + ' C ' + r2(x - 1) + ' ' + (y - 6) + ' ' + r2(x - 6) + ' ' + (y - 5) + ' ' + r2(x - 9.3) + ' ' + (y + 1) + ' Z'
      : 'M ' + r2(x - 9.2) + ' ' + (y - 1) + ' C ' + r2(x - 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.2) + ' ' + (y - 1) +
        ' C ' + r2(x + 5) + ' ' + (y - 5.5) + ' ' + r2(x - 5) + ' ' + (y - 5.5) + ' ' + r2(x - 9.2) + ' ' + (y - 1) + ' Z' }, g);
    el('circle', { class: 'pn-ojo', cx: x - 3, cy: y + 1, r: 1.1 }, g);
    el('circle', { class: 'pn-ojo', cx: x + 3, cy: y + 1, r: 1.1 }, g);
    el('path', { class: 'pn-boca', d: 'M ' + r2(x - 2.6) + ' ' + (y + 4.2) + ' Q ' + x + ' ' + (y + 6.4) + ' ' + r2(x + 2.6) + ' ' + (y + 4.2) }, g);
    texto(g, { class: 'pn-nombre', 'data-nombre-de': i, x: x, y: YN, 'text-anchor': 'middle', 'font-size': 11 }, NINOS[i].nombre);
    return g;
  }

  /* El cuaderno y el dinero de la merienda, dibujados alrededor de su
     centro. Cada uno en dos piezas: la de fuera se enciende y se apaga, y
     la de dentro viaja. Si la misma pieza hiciera las dos cosas, las dos
     llevarían la misma demora (es la regla de las capas de la numeración
     maya). */
  function cosa(padre, de) {
    var el = A.el;
    var fuera = el('g', { class: 'am-fuera', 'data-cosa': de }, padre);
    var dentro = el('g', null, fuera);
    if (de === 'cuaderno') {
      el('rect', { class: 'pn-cuaderno', x: -10, y: -12, width: 20, height: 24, rx: 2 }, dentro);
      el('rect', { class: 'pn-cuaderno-etq', x: -4.5, y: -7, width: 11, height: 7, rx: 1 }, dentro);
      el('path', { class: 'pn-cuaderno-linea', d: 'M -2.5 -4.6 H 4.5 M -2.5 -2.4 H 2.5' }, dentro);
      [-9, -4.5, 0, 4.5, 9].forEach(function (y) { el('circle', { class: 'pn-espiral', cx: -10, cy: y, r: 1.7 }, dentro); });
    } else {
      el('rect', { class: 'pn-billete', x: -15, y: -8, width: 30, height: 16, rx: 2 }, dentro);
      el('rect', { class: 'pn-billete-borde', x: -12.5, y: -5.5, width: 25, height: 11, rx: 1 }, dentro);
      el('circle', { class: 'pn-billete-sello', cx: 0, cy: 0, r: 4.6 }, dentro);
      texto(dentro, { class: 'pn-billete-l', x: 0, y: 3, 'text-anchor': 'middle', 'font-size': 8 }, 'L');
    }
    return { fuera: fuera, dentro: dentro };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    texto(svg, { class: 'pn-grupo', 'data-grupo': '', x: 14, y: 13, 'font-size': 11 }, 'Grupo de las familias');

    /* ── El globo, de uno y de dos renglones. ── */
    globo2 = el('path', { class: 'pn-globo am-fuera', 'data-globo': 2, d: globo(BY2) }, svg);
    globo1 = el('path', { class: 'pn-globo', 'data-globo': 1, d: globo(BY1) }, svg);

    /* La frase de antes, que llega en el paso 4, con el subrayado de las
       palabras de las que «le» y «lo» sacan lo que dicen. */
    CTX.forEach(function (p) {
      ctx.push(texto(svg, { class: 'pn-tinta am-fuera', 'data-palabra': p, 'data-renglon': 'contexto', x: r2(XC[p]), y: MY, 'font-size': 17 }, p));
    });
    subCtx.push(el('path', { class: 'pn-subraya am-fuera', 'data-subraya-ctx': 'Marvin', d: 'M ' + r2(XC.Marvin) + ' ' + (MY + 4.5) + ' H ' + r2(XC.Marvin + ANCH.Marvin) }, svg));
    subCtx.push(el('path', { class: 'pn-subraya am-fuera', 'data-subraya-ctx': 'cuaderno', d: 'M ' + r2(XC.el) + ' ' + (MY + 4.5) + ' H ' + r2(XC.cuaderno + ANCH.cuaderno) }, svg));

    /* El mensaje, que baja entero cuando llega la frase: sus palabras y
       los subrayados de «le» y «lo», el de raya cortada (no dicen) y el
       de raya entera (ya dicen). */
    gMsg = el('g', { 'data-mensaje': '' }, svg);
    MSG.forEach(function (p) {
      texto(gMsg, { class: 'pn-tinta', 'data-palabra': p, 'data-renglon': 'mensaje', x: r2(XM[p]), y: MY, 'font-size': 17 }, p);
    });
    PRON.forEach(function (p) {
      var d = 'M ' + r2(XM[p]) + ' ' + (MY + 4.5) + ' H ' + r2(XM[p] + ANCH[p]);
      huecos[p] = el('path', { class: 'pn-hueco', 'data-hueco': p, d: d }, gMsg);
      subrayas[p] = el('path', { class: 'pn-subraya am-fuera', 'data-subraya': p, d: d }, gMsg);
    });

    /* Los hilos del paso 4, que suben de cada pronombre a la palabra de
       la que sacan lo que dicen: «le» a «Marvin» y «lo» a «el cuaderno».
       Van en el hueco entre los dos renglones, y en un grupo: al irse se
       apagan juntos, no se recogen, que una raya que se recoge deja pedazos
       colgando en el aire (la regla de los hilos de Los Adjetivos). */
    var ctxM = XC.Marvin + ANCH.Marvin / 2, ctxC = (XC.el + XC.cuaderno + ANCH.cuaderno) / 2;
    gArcos = el('g', { class: 'am-fuera' }, svg);
    arcos.push(el('path', { class: 'pn-arco', 'data-arco': 'le', 'data-a': 'Marvin', d: 'M ' + r2(centro('le')) + ' ' + (MY + BAJA - 14.5) + ' L ' + r2(ctxM) + ' ' + (MY + 7) }, gArcos));
    arcos.push(el('path', { class: 'pn-arco', 'data-arco': 'lo', 'data-a': 'cuaderno', d: 'M ' + r2(centro('lo')) + ' ' + (MY + BAJA - 14.5) + ' L ' + r2(ctxC) + ' ' + (MY + 7) }, gArcos));

    /* ── Las preguntas (pasos 1 a 3) y las respuestas (paso 4). ── */
    PRON.forEach(function (p) {
      preguntas[p] = pildora(svg, p, PREG[p], PY[p], MY + 4.5, 'pn-abierta', 'data-pregunta');
      respuestas[p] = pildora(svg, p, RESP[p], PY[p] + BAJA, MY + BAJA + 4.5, 'pn-sabida', 'data-respuesta');
    });

    /* ── Los niños, y lo que se pinta encima de ellos. ── */
    var hilos = el('g', null, svg);
    var bajoPregLe = PY.le + PH;
    NINOS.forEach(function (n, i) {
      hilosLe.push(el('path', { class: 'pn-hilo am-fuera', 'data-hilo': 'le', 'data-a': i,
        d: 'M ' + r2(centro('le')) + ' ' + bajoPregLe + ' L ' + xDe(i) + ' ' + (YC - RA - 1) }, hilos));
    });
    /* Los de «lo» salen del lado derecho de «¿qué?», porque las cosas
       están a su derecha. */
    var wq = ANCH12[PREG.lo] + 8, xq = r2(centro('lo') + wq / 2), yq = PY.lo + PH / 2;
    ['cuaderno', 'dinero'].forEach(function (de) {
      var b = BANDA[de];
      hilosLo.push(el('path', { class: 'pn-hilo am-fuera', 'data-hilo': 'lo', 'data-a': de,
        d: 'M ' + xq + ' ' + yq + ' L ' + HILO_A[de] + ' ' + b[1] }, hilos));
      rotCosas[de] = texto(svg, { class: 'pn-rotulo am-fuera', 'data-rotulo-cosa': de, x: b[0] + (de === 'cuaderno' ? 16 : 20), y: b[1] + 4, 'font-size': 11 }, ROT_COSA[de]);
    });

    var clase = el('g', null, svg);
    NINOS.forEach(function (n, i) {
      alumno(clase, i);
      anillos.push(el('circle', { class: 'pn-anillo am-fuera', 'data-anillo': i, cx: xDe(i), cy: YC, r: RA }, svg));
    });
    anilloMarvin = el('circle', { class: 'pn-anillo-uno am-fuera', 'data-anillo-uno': MARVIN, cx: xDe(MARVIN), cy: YC, r: RA }, svg);
    marcoMarvin = el('rect', { class: 'pn-nombre-marco am-fuera', 'data-nombre-marco': MARVIN,
      x: r2(xDe(MARVIN) - 21.3), y: YN - 10, width: 42.6, height: 14, rx: 4 }, svg);

    /* Las dudas: en tres casas no supieron si era para ellos. */
    DUDA.forEach(function (i) {
      var g = el('g', { class: 'am-fuera pn-duda', 'data-duda': i }, svg);
      el('circle', { cx: xDe(i), cy: YCOSA, r: 9 }, g);
      texto(g, { x: xDe(i), y: YCOSA + 4.6, 'text-anchor': 'middle', 'font-size': 13 }, '?');
      dudas.push(g);
    });

    cosas.cuaderno = cosa(svg, 'cuaderno');
    cosas.dinero = cosa(svg, 'dinero');

    /* ── Paso 5: los dos pronombres, colgados de una misma raya. También
       en un grupo, para apagarse juntos. ── */
    var xl = r2(centro('le')), xo = r2(centro('lo')), xm = r2((centro('le') + centro('lo')) / 2);
    var arriba = MY + BAJA + 6;
    gLlave = el('g', { class: 'am-fuera' }, svg);
    PRON.forEach(function (p) {
      conectores.push(el('path', { class: 'pn-conector', 'data-conector': 'pronombre', 'data-de': p,
        d: 'M ' + r2(centro(p)) + ' ' + arriba + ' V ' + LLAVE_Y }, gLlave));
    });
    llave.push(el('path', { class: 'pn-conector', 'data-llave': '', d: 'M ' + xl + ' ' + LLAVE_Y + ' H ' + xo }, gLlave));
    llave.push(el('path', { class: 'pn-conector', 'data-llave': 'baja', d: 'M ' + xm + ' ' + LLAVE_Y + ' V ' + ROT_Y }, gLlave));
    rotPron = el('g', { class: 'am-fuera pn-pildora pn-sabida', 'data-rotulo': 'pronombres' }, svg);
    var wr = r2(ANCH12.pronombres + 12);
    el('rect', { x: r2(xm - wr / 2), y: ROT_Y, width: wr, height: PH, rx: 8 }, rotPron);
    texto(rotPron, { x: xm, y: ROT_Y + 12, 'text-anchor': 'middle', 'font-size': 12 }, 'pronombres');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var dos = n >= 4;
    /* De vuelta desde el paso 4 o 5, la frase se apaga antes de que el
       mensaje suba: si subiera encendida, las dos se montarían. */
    var sube = !dos && antes != null && antes >= 4;

    /* 4 · El globo crece un renglón, el mensaje baja y llega la frase de
       antes. */
    A.ver(globo2, dos, sube ? 700 : 0);
    A.ver(globo1, !dos, fue(4) ? 300 : 0);
    A.mover(gMsg, 0, dos ? BAJA : 0, 0, 1, sube ? 300 : 0);
    ctx.forEach(function (t) { A.ver(t, dos, fue(4) ? 700 : 0); });

    /* Los subrayados: con raya cortada mientras no dicen nada; con raya
       entera, y con el de las palabras de las que lo sacan, cuando ya
       dicen. */
    PRON.forEach(function (p) {
      A.ver(huecos[p], !dos, fue(4) ? 1000 : (sube ? 300 : 0));
      A.ver(subrayas[p], dos, fue(4) ? 1000 : 0);
    });
    subCtx.forEach(function (s) { A.ver(s, dos, fue(4) ? 1000 : 0); });
    /* Los hilos se trazan al llegar; al irse se apaga el grupo, y cuando ya
       no se ve se recogen, para trazarse otra vez la próxima. */
    A.ver(gArcos, dos, 0);
    arcos.forEach(function (a) { A.trazar(a, dos, fue(4) ? 1200 : (dos ? 0 : 600)); });

    /* 1 y 2 · Las preguntas debajo de cada pronombre; 4 · las respuestas
       en su lugar. Al volver del 5, las respuestas esperan a que la raya
       de los pronombres se recoja. */
    A.ver(preguntas.le, n >= 1 && n <= 3, sube ? 1000 : 0);
    A.ver(preguntas.lo, n >= 2 && n <= 3, fue(2) ? 300 : (sube ? 1000 : 0));
    PRON.forEach(function (p) { A.ver(respuestas[p], n === 4, fue(4) ? 1500 : (antes === 5 && n === 4 ? 400 : 0)); });

    /* 1 · «le» se prueba en los cinco: un hilo a cada uno y un aro de raya
       cortada alrededor de su cabeza. Los aros siguen en el paso 2. */
    hilosLe.forEach(function (h, i) { A.ver(h, n === 1, fue(1) ? 400 + i * 120 : (antes === 2 && n === 1 ? 300 : 0)); });
    anillos.forEach(function (a, i) { A.ver(a, n === 1 || n === 2, fue(1) ? 650 + i * 120 : (antes === 3 && n === 2 ? 700 : 0)); });

    /* 2 · «lo» en las dos cosas; 3 · cada cosa donde la mandaron; 4 · el
       cuaderno, en Marvin, y el dinero se va. */
    ['cuaderno', 'dinero'].forEach(function (de, k) {
      var c = cosas[de], b = BANDA[de], x = b[0], y = b[1];
      if (n === 3 || (n >= 4 && de === 'dinero')) { x = xDe(LLEVO[de]); y = YCOSA; }
      if (n >= 4 && de === 'cuaderno') { x = xDe(MARVIN); y = YCOSA; }
      var ve = de === 'cuaderno' ? n >= 2 : (n === 2 || n === 3);
      A.ver(c.fuera, ve, fue(2) ? 700 + k * 150 : (fue(4) && de === 'dinero' ? 300 : 0));
      /* Lo que se apaga vuelve a su sitio cuando ya no se ve: si viajara
         mientras se apaga, cruzaría la pantalla medio borrado. */
      A.mover(c.dentro, x, y, 0, 1, fue(3) ? 200 + k * 150 : (fue(4) ? 1700 : (n < 2 ? 500 : 0)));
      A.ver(rotCosas[de], n === 2, fue(2) ? 850 + k * 150 : (antes === 3 && n === 2 ? 800 : 0));
    });
    hilosLo.forEach(function (h, k) { A.ver(h, n === 2, fue(2) ? 1000 + k * 150 : (antes === 3 && n === 2 ? 900 : 0)); });

    /* 3 · En tres casas no mandaron nada. */
    dudas.forEach(function (g, k) { A.ver(g, n === 3, fue(3) ? 1100 + k * 150 : (antes === 4 && n === 3 ? 600 : 0)); });

    /* 4 · El que tenía que llevarlo, con raya entera. */
    A.ver(anilloMarvin, dos, fue(4) ? 2300 : 0);
    A.ver(marcoMarvin, dos, fue(4) ? 2300 : 0);

    /* 5 · Los nombres: los dos pronombres bajan a una misma raya, cuando
       las respuestas ya se fueron. */
    var nombra = n === 5, d5 = fue(5) ? 400 : 0;
    A.ver(gLlave, nombra, 0);
    conectores.forEach(function (c) { A.trazar(c, nombra, nombra ? d5 : 600); });
    llave.forEach(function (c) { A.trazar(c, nombra, nombra ? d5 + (fue(5) ? 250 : 0) : 600); });
    A.ver(rotPron, nombra, fue(5) ? 800 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'cosas distintas que puede decir' },
      { cifra: '5', palabras: 'niños que pueden ser «le»' },
      { cifra: '10', palabras: 'mensajes distintos: 5 × 2' },
      { cifra: '3', palabras: 'familias que no mandaron nada' },
      { cifra: '1', palabras: 'mensaje, igual en cada casa' },
      { cifra: '2', palabras: 'pronombres en el mensaje' }
    ][n];
  }

  AnimacionMision.montar('#amMensaje', {
    vista: [ANCHO, ALTO],
    describe: 'El mensaje «Dígale que lo lleve mañana.» en el grupo de las familias, y debajo cinco niños: Kenia, Selvin, Marvin, Yeimy y Wilmer. «Le» se prueba en los cinco y «lo», en un cuaderno y en el dinero de la merienda: ya son diez mensajes. Kenia lleva un cuaderno, Selvin el dinero, y en tres casas no mandan nada. Con la frase «Marvin olvidó el cuaderno.» antes, «le» es Marvin y «lo» es el cuaderno.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['👥 ¿A quién?', '🎒 ¿Y qué?', '🏠 ¿Qué pasó?', '💬 Una frase antes', '🏷️ ¿Qué son?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
