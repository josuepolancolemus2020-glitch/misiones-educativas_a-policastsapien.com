/* ============================================================
   M.E.T.A.S · Los Adverbios · «Kenia casi no comió hoy»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: su
   mamá mandó el recado «Kenia casi no comió hoy», al copiarlo en la
   libreta de la escuela le quitaron una palabra y quedó «Kenia no comió
   hoy». El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el recado, prendido con un clip en la libreta; debajo, lo que
        copiaron; y el plato de Kenia. ¿Cuál de los dos dice lo que pasó
        con su plato? Se decide antes de tocar;
     1  al plato le falta un bocado: el recado dice la verdad y la
        libreta, que quedó entero;
     2  lo que copiaron se corre hasta quedar debajo del recado, palabra
        por palabra: «Kenia» y «comió» están en los dos, iguales, y en la
        libreta queda el hueco de «casi»;
     3  «casi» no cambia lo que hizo Kenia: cambia cuánto;
     4  se recortan «casi», «no» y «hoy», y queda «Kenia comió.»: la frase
        sigue en pie, pero ya no dice cuánto ni cuándo;
     5  vuelven a su sitio, y cada pieza con su nombre: el sustantivo, el
        verbo y los tres adverbios.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El plato es lo que pasó.** Los dos papeles dicen algo del plato
      de Kenia y solo uno acierta; lo que decide cuál es el plato, no un
      rótulo. Al plato le falta UN bocado, de la tortilla, y todo lo demás
      está entero: eso es «casi no comió». Y en el paso 4, «Kenia comió.»
      no es mentira (el bocado se lo comió), pero ya no dice cuánto: por
      eso los adverbios no sostienen la frase y aun así cambian la noticia.
   2. **Lo copiado se corre hasta quedar debajo de lo que copió.** En la
      libreta «Kenia no comió hoy.» va seguido, como se escribió. Al
      correrse, cada palabra queda debajo de la suya en el recado y aparece
      el hueco de «casi», con raya cortada: se ve cuál falta sin leer las
      dos frases.
   3. ⚠️ **Nada dice a qué modifica «casi».** En «casi no comió», «casi» va
      pegado a «no», que es otro adverbio, y eso es justo lo que la prueba
      pregunta en sus pareados («Lo que modifica «casi» en «casi nunca»»).
      Por eso aquí «casi» lleva su pregunta, «¿cuánto?», y ninguna raya
      que lo una con otra palabra. Tampoco se nombra ninguna clase de
      adverbio: las clases son los otros pareados.
   4. **Los adverbios se recortan del recado, no se borran.** Salen de la
      nota como tiras de papel, con su borde cortado de tijera, y se quedan
      a la vista, cada una con lo que decía; «comió» se corre hasta
      «Kenia» y la frase queda en pie. Al volver entran en su hueco.
   5. ⚠️ **La prueba no se regala.** Aquí no sale ninguna palabra de sus
      preguntas, ni una clase de adverbio, ni «nada», que es respuesta de
      una tarea. Y tres ejercicios de la misión preguntaban justo por «hoy»
      («En «Hoy hace calor en Choluteca», el adverbio es ___», una tarea
      con «…al cine hoy» y el texto de la pulpería de pensamiento crítico):
      con «hoy» señalado aquí se contestaban de memoria. Ahora son
      «anoche», «ahora» y «temprano».
   6. **Lo que es papel es papel en las dos pantallas.** La libreta, el
      recado y el plato llevan su color siempre, con tinta oscura fija; lo
      que se escribe fuera de ellos lleva la tinta de la pantalla. Y nada
      se dice solo con color: lo que falta va con raya cortada, lo que se
      recorta lleva borde cortado, lo que está bien lleva ✓ y lo que no, ✗.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRecado')) return;

  var ANCHO = 320, ALTO = 224, FIN = 5;

  /* La libreta, que es la página de fondo, y el recado prendido encima. */
  var LX0 = 14, LX1 = 306, LY0 = 4, LY1 = 128;
  var NX0 = 40, NX1 = 262, NY0 = 10, NY1 = 60;

  /* Las palabras, medidas con la Fredoka de la misión a 17: «Kenia» 41,8;
     «casi» 30,1; «no» 19,1; «comió» 45,4; «hoy» 27,9; el punto 3,7; y el
     espacio, 4,05. El recado va en su renglón (SY) y lo copiado, en el de
     la libreta (LB), empezando en el mismo sitio. */
  var X0 = 58, SP = 4.05, SY = 48, LB = 112;
  var PAL = ['Kenia', 'casi', 'no', 'comió', 'hoy', '.'];
  var ANCH = { Kenia: 41.8, casi: 30.1, no: 19.1, 'comió': 45.4, hoy: 27.9, '.': 3.7 };
  var ADV = ['casi', 'no', 'hoy'];
  var PREG = { casi: '¿cuánto?', no: '¿sí o no?', hoy: '¿cuándo?' };

  /* Dónde empieza cada palabra: en el recado, las seis seguidas; en la
     libreta, sin «casi»; y alineadas, con el hueco de «casi». */
  function seguidas(lista) {
    var x = X0, out = {};
    lista.forEach(function (p, i) {
      out[p] = x;
      x += ANCH[p] + (lista[i + 1] === '.' ? 0 : SP);
    });
    return out;
  }
  var XR = seguidas(PAL);
  var XL = seguidas(['Kenia', 'no', 'comió', 'hoy', '.']);
  function centro(p) { return XR[p] + ANCH[p] / 2; }

  /* Paso 4: las tres tiras recortadas se quedan en la libreta. «casi» baja
     derecho y las otras dos se apartan a la derecha lo justo para que
     quepa la pregunta de cada una («¿cuánto?» mide 49,1 a 12; «¿sí o no?»,
     45,6; «¿cuándo?», 51). Y «comió» se corre hasta «Kenia», con el punto
     detrás. */
  var TIRA = { casi: centro('casi'), no: 172, hoy: 232 }, TIRA_Y = 46;
  var CORRE = { 'comió': XR.casi - XR['comió'], '.': XR.casi + ANCH['comió'] - XR['.'] };

  /* Paso 5: los nombres. «sustantivo» y «verbo» debajo de su palabra;
     los tres adverbios bajan a una misma raya, y de ella cuelga el suyo. */
  var ROT_Y = 72, LLAVE_Y = 96, ADV_Y = 102;

  /* El plato de Kenia, visto desde arriba, y el bocado que le falta a la
     tortilla, en su orilla derecha. */
  var PCX = 140, PCY = 178, PR = 42, PW = 31;
  var TCX = 150, TCY = 179, TR = 15;
  var BOCADO = [[163.5, 173.5], [165.6, 179], [163.8, 184.5]], BR = 4.2, BCX = 165, BCY = 179;

  var TEXTOS = [
    'El recado dice una cosa y la libreta otra. ¿Cuál dice lo que pasó con su plato? Decídelo antes de tocar.',
    'Al plato le falta un bocado. El recado dice la verdad; la libreta dice que quedó entero, y no es cierto.',
    '«Kenia» y «comió» están en los dos papeles, iguales. En la libreta solo falta una palabra: «casi».',
    '«Casi» no cambia lo que hizo Kenia: cambia cuánto. Con «casi», falta un bocado; sin «casi», ninguno.',
    'Sin «casi», «no» y «hoy» queda «Kenia comió.»: la frase sigue en pie, pero ya no dice cuánto ni cuándo.',
    '«Casi», «no» y «hoy» son adverbios: dicen cuánto, si pasó y cuándo. Si se quitan, cambia la noticia.'
  ];

  var A;
  var recado = {}, libreta = {}, rotLibreta, hueco, bien, mal, anillo, rotBocado;
  var pildoras = [], conectores = [], llave = [];

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una palabra de uno de los dos papeles, con lo que puede llevar
     alrededor: el marco de «Kenia» y «comió», y en el recado, la tira de
     papel de cada adverbio (su fondo es el del recado, así que dentro de él
     no se ve), su borde de tijera, su pregunta y el subrayado de «casi».
     Las tiras van en dos capas: la de fuera la corre de lado y la de dentro
     la baja, cada una a su tiempo. Así, al recortarla, baja primero y
     después se aparta, y no pasa por encima de ninguna otra palabra: en
     diagonal, la de «casi» tapaba la «a» de «Kenia» y se leía «Kenic». */
  function palabra(padre, p, x, y, renglon) {
    var el = A.el, w = ANCH[p];
    var g = el('g', { 'data-palabra': p, 'data-renglon': renglon }, padre);
    var o = { g: g, gy: g };
    if (renglon === 'recado' && ADV.indexOf(p) >= 0) {
      o.gy = el('g', null, g);
      el('rect', { class: 'ad-tira', x: r2(x - 1.5), y: y - 15, width: r2(w + 3), height: 20, rx: 2 }, o.gy);
      o.borde = el('rect', { class: 'ad-tira-borde am-fuera', 'data-tira': p, x: r2(x - 1.5), y: y - 15, width: r2(w + 3), height: 20, rx: 2 }, o.gy);
      o.pregunta = texto(o.gy, { class: 'ad-pregunta am-fuera', 'data-pregunta': p, x: r2(x + w / 2), y: y + 22, 'text-anchor': 'middle', 'font-size': 12 }, PREG[p]);
    }
    if (p === 'Kenia' || p === 'comió') {
      /* Ceñido: entre dos palabras hay 4 de espacio, y un marco más ancho
         se montaría en la de al lado. */
      o.marco = el('rect', { class: 'ad-marco am-fuera', 'data-marco': p, x: r2(x - 1.5), y: y - 15, width: r2(w + 3), height: 20, rx: 3 }, g);
    }
    if (renglon === 'recado' && p === 'casi') {
      o.subraya = el('path', { class: 'ad-subraya am-fuera', 'data-subraya': p, d: 'M ' + r2(x) + ' ' + (y + 4) + ' H ' + r2(x + w) }, o.gy);
    }
    o.txt = texto(o.gy, { class: 'ad-tinta', 'data-texto': p, x: r2(x), y: y, 'font-size': 17 }, p);
    return o;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La libreta de la escuela: la página, con su margen y sus
       renglones. ── */
    var hoja = el('g', { class: 'ad-hoja' }, svg);
    el('rect', { class: 'ad-libreta', 'data-libreta': '', x: LX0, y: LY0, width: LX1 - LX0, height: LY1 - LY0, rx: 3 }, hoja);
    var renglones = '';
    [20, 44, 68, 92, 116].forEach(function (y) { renglones += 'M ' + (LX0 + 5) + ' ' + y + ' H ' + (LX1 - 5) + ' '; });
    el('path', { class: 'ad-renglon', d: renglones }, hoja);
    el('path', { class: 'ad-margen', d: 'M 30 ' + LY0 + ' V ' + LY1 }, hoja);

    /* Lo que copiaron en la libreta, con su rótulo encima. */
    rotLibreta = texto(hoja, { class: 'ad-rotulo', 'data-rotulo-papel': 'libreta', x: X0, y: 88, 'font-size': 11 }, 'Libreta de la escuela');
    hueco = el('rect', { class: 'ad-hueco am-fuera', 'data-hueco': '', x: r2(XR.casi), y: LB - 15, width: ANCH.casi, height: 20, rx: 3 }, hoja);
    ['Kenia', 'no', 'comió', 'hoy', '.'].forEach(function (p) { libreta[p] = palabra(hoja, p, XL[p], LB, 'libreta'); });
    mal = el('g', { class: 'am-fuera', 'data-marca': 'mal' }, hoja);
    el('circle', { class: 'ad-mal-fondo', cx: 284, cy: LB - 5, r: 9 }, mal);
    el('path', { class: 'ad-mal', d: 'M 280 ' + (LB - 9) + ' L 288 ' + (LB - 1) + ' M 288 ' + (LB - 9) + ' L 280 ' + (LB - 1) }, mal);

    /* ── El recado de la mamá, prendido con un clip. ── */
    var nota = el('g', { class: 'ad-nota' }, svg);
    el('rect', { class: 'ad-recado', 'data-recado': '', x: NX0, y: NY0, width: NX1 - NX0, height: NY1 - NY0, rx: 2 }, nota);
    el('path', { class: 'ad-clip', d: 'M 240 22 V 7 a 4 4 0 0 1 8 0 V 19 a 2.5 2.5 0 0 1 -5 0 V 10' }, nota);
    texto(nota, { class: 'ad-rotulo', 'data-rotulo-papel': 'recado', x: 50, y: 24, 'font-size': 11 }, 'Recado de la mamá');

    /* ── Paso 5: los nombres, en la libreta, con su hilo hasta la palabra.
       Van debajo de las palabras del recado, que los tapan por arriba. ── */
    var nombres = el('g', null, svg);
    [['sustantivo', 'Kenia', 68], ['verbo', 'comió', 43]].forEach(function (c) {
      var cx = r2(centro(c[1]));
      conectores.push(el('path', { class: 'ad-hilo', 'data-conector': c[0], d: 'M ' + cx + ' 54 V ' + ROT_Y }, nombres));
      var g = el('g', { class: 'am-fuera ad-pildora', 'data-rotulo': c[0] }, nombres);
      el('rect', { x: r2(cx - c[2] / 2), y: ROT_Y, width: c[2], height: 16, rx: 8 }, g);
      texto(g, { class: 'ad-pildora-txt', x: cx, y: ROT_Y + 12, 'text-anchor': 'middle', 'font-size': 12 }, c[0]);
      pildoras.push(g);
    });
    var xa = r2(centro('casi')), xh = r2(centro('hoy')), xm = r2((centro('casi') + centro('hoy')) / 2);
    ADV.forEach(function (p) {
      llave.push(el('path', { class: 'ad-hilo-adv', 'data-conector': 'adverbio', 'data-de': p, d: 'M ' + r2(centro(p)) + ' 54 V ' + LLAVE_Y }, nombres));
    });
    llave.push(el('path', { class: 'ad-hilo-adv', 'data-llave': '', d: 'M ' + xa + ' ' + LLAVE_Y + ' H ' + xh }, nombres));
    llave.push(el('path', { class: 'ad-hilo-adv', 'data-conector': 'adverbios', d: 'M ' + xm + ' ' + LLAVE_Y + ' V ' + ADV_Y }, nombres));
    var gA = el('g', { class: 'am-fuera ad-pildora ad-pildora-adv', 'data-rotulo': 'adverbios' }, nombres);
    el('rect', { x: r2(xm - 32.5), y: ADV_Y, width: 65, height: 16, rx: 8 }, gA);
    texto(gA, { class: 'ad-pildora-txt', x: xm, y: ADV_Y + 12, 'text-anchor': 'middle', 'font-size': 12 }, 'adverbios');
    pildoras.push(gA);

    /* Las palabras del recado, encima de todo lo de la libreta: las tiras
       que se recortan pasan por encima al bajar. */
    PAL.forEach(function (p) { recado[p] = palabra(svg, p, XR[p], SY, 'recado'); });

    bien = el('g', { class: 'am-fuera', 'data-marca': 'bien' }, svg);
    el('circle', { class: 'ad-bien-fondo', cx: 284, cy: 36, r: 9 }, bien);
    el('path', { class: 'ad-bien', d: 'M 279.5 36.5 L 282.8 39.8 L 288.8 32.5' }, bien);

    /* ── El plato de Kenia: arroz, frijoles y una tortilla con un bocado
       menos. ── */
    var plato = el('g', { class: 'ad-plato' }, svg);
    el('circle', { class: 'ad-plato-borde', 'data-plato': '', cx: PCX, cy: PCY, r: PR }, plato);
    el('circle', { class: 'ad-plato-fondo', cx: PCX, cy: PCY, r: PW }, plato);
    el('path', { class: 'ad-arroz', d: 'M 113 166 C 112 157 121 152 129 154 C 137 154 141 160 139 167 C 138 174 128 177 121 175 C 116 174 113 171 113 166 Z' }, plato);
    el('path', { class: 'ad-arroz-grano', d: 'M 120 161 l 2.5 -1 M 127 159 l 2.5 1 M 132 164 l 2 -1.5 M 123 168 l 2.5 0.5 M 129 170 l 2 -1 M 118 165 l 1.5 1.5' }, plato);
    el('path', { class: 'ad-frijol', d: 'M 112 191 C 111 184 119 180 126 181 C 134 181 139 186 137 193 C 136 199 127 202 120 200 C 115 199 112 196 112 191 Z' }, plato);
    el('path', { class: 'ad-frijol-brillo', d: 'M 119 187 l 2 0 M 127 185 l 2 0.5 M 123 193 l 2 0 M 131 191 l 1.5 0.5' }, plato);
    var tortilla = el('g', { 'data-tortilla': '' }, plato);
    el('circle', { class: 'ad-tortilla', 'data-tortilla-disco': '', cx: TCX, cy: TCY, r: TR }, tortilla);
    [[144, 173, 2.6], [155, 186, 2.2], [147, 185, 1.8], [157, 171, 1.6], [150, 178, 1.4]].forEach(function (m) {
      el('ellipse', { class: 'ad-tortilla-mancha', cx: m[0], cy: m[1], rx: m[2], ry: r2(m[2] * 0.7) }, tortilla);
    });
    /* El bocado: tres mordidas en la orilla, del color del fondo del
       plato. */
    var bocado = el('g', { 'data-bocado': '' }, plato);
    BOCADO.forEach(function (c) { el('circle', { class: 'ad-mordida', cx: c[0], cy: c[1], r: BR }, bocado); });

    anillo = el('circle', { class: 'ad-anillo am-fuera', 'data-anillo': '', cx: BCX, cy: BCY, r: 10 }, svg);
    rotBocado = texto(svg, { class: 'ad-afuera am-fuera', 'data-rotulo-bocado': '', x: 188, y: 183, 'font-size': 12 }, 'un bocado');
    texto(svg, { class: 'ad-afuera-suave', 'data-rotulo-plato': '', x: 92, y: 175, 'text-anchor': 'end', 'font-size': 12 }, 'el plato');
    texto(svg, { class: 'ad-afuera-suave', 'data-rotulo-plato': '', x: 92, y: 189, 'text-anchor': 'end', 'font-size': 12 }, 'de Kenia');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    /* Al volver del paso 4, lo de la libreta reaparece cuando las tiras ya
       subieron a su sitio: antes se les montaría encima. */
    var deVuelta = antes === 4 && n !== 4, dLib = deVuelta ? 1450 : 0;

    /* 1 · El plato dice cuál acierta: el anillo en el bocado, ✓ al recado
       y ✗ a lo copiado. El ✓ es del recado entero: mientras le faltan sus
       adverbios (paso 4), «Kenia comió.» ya no es lo que dijo la mamá, y se
       aparta. */
    A.ver(anillo, n >= 1, 0);
    A.ver(rotBocado, n >= 1, fue(1) ? 300 : 0);
    A.ver(bien, n >= 1 && n !== 4, fue(1) ? 700 : (deVuelta ? 1500 : 0));
    A.ver(mal, n >= 1 && n <= 3, fue(1) ? 950 : dLib);

    /* 2 · Lo copiado se corre hasta quedar debajo del recado. */
    var alinea = n >= 2;
    ['no', 'comió', 'hoy', '.'].forEach(function (p) {
      A.mover(libreta[p].g, alinea ? XR[p] - XL[p] : 0, 0, 0, 1, 0);
    });
    var lib = n <= 3;
    ['Kenia', 'no', 'comió', 'hoy', '.'].forEach(function (p) { A.ver(libreta[p].g, lib, lib ? dLib : 0); });
    A.ver(rotLibreta, lib, lib ? dLib : 0);
    A.ver(hueco, n === 2 || n === 3, fue(2) ? 750 : dLib);
    ['Kenia', 'comió'].forEach(function (p) {
      A.ver(libreta[p].marco, n === 2, fue(2) ? 1050 : 0);
      A.ver(recado[p].marco, n === 2, fue(2) ? 1050 : 0);
    });
    A.ver(recado.casi.subraya, n === 2 || n === 3, fue(2) ? 1050 : dLib);

    /* 3 · Lo que dice «casi»: cuánto. */
    A.ver(recado.casi.pregunta, n === 3 || n === 4, fue(3) ? 300 : 0);

    /* 4 · Se recortan los tres adverbios: bajan de la nota cuando lo
       copiado ya se fue, se apartan para que quepa la pregunta de cada
       uno, y ya fuera se les ve el borde de tijera; entonces «comió» se
       corre hasta «Kenia». De vuelta, al revés: «comió» vuelve a su sitio,
       las preguntas se apagan, y cuando ya no están (encendidas, al
       correrse se enciman) las tiras se corren debajo de su hueco y
       suben. */
    var fuera = n === 4;
    ADV.forEach(function (p, k) {
      var o = recado[p];
      var baja = fue(4) ? 450 + k * 120 : (fuera ? 350 : (deVuelta ? 850 : 0));
      var aparta = fue(4) ? 750 + k * 120 : (fuera ? 650 : (deVuelta ? 450 : 0));
      A.mover(o.gy, 0, fuera ? TIRA_Y : 0, 0, 1, baja);
      A.mover(o.g, fuera ? TIRA[p] - centro(p) : 0, 0, 0, 1, aparta);
      A.ver(o.borde, fuera, fue(4) ? 1150 + k * 120 : (fuera ? 950 : 0));
      if (p !== 'casi') A.ver(o.pregunta, fuera, fue(4) ? 1650 : (fuera ? 1100 : 0));
    });
    ['comió', '.'].forEach(function (p) {
      A.mover(recado[p].g, fuera ? CORRE[p] : 0, 0, 0, 1, fuera ? (fue(4) ? 1300 : 1000) : 0);
    });

    /* 5 · Los nombres, cuando las tiras ya volvieron a su sitio. */
    var nombra = n === 5;
    var d5 = fue(5) ? 1350 : 0;
    conectores.forEach(function (c) { A.trazar(c, nombra, d5); });
    llave.forEach(function (c) { A.trazar(c, nombra, d5 + (fue(5) ? 250 : 0)); });
    pildoras.forEach(function (g, k) { A.ver(g, nombra, d5 + (fue(5) ? 300 + k * 150 : 0)); });
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿cuál de los dos dice la verdad?' },
      { cifra: '1', palabras: 'bocado que falta en el plato' },
      { cifra: 'casi', palabras: 'la palabra que falta en la libreta' },
      { cifra: '¿cuánto?', palabras: 'lo que cambia «casi»' },
      { cifra: '2', palabras: 'palabras en pie: «Kenia comió.»' },
      { cifra: '3', palabras: 'adverbios en el recado' }
    ][n];
  }

  AnimacionMision.montar('#amRecado', {
    vista: [ANCHO, ALTO],
    describe: 'El recado de la mamá de Kenia, «Kenia casi no comió hoy», prendido en la libreta de la escuela, donde copiaron «Kenia no comió hoy»; y el plato de Kenia, con un bocado menos en la tortilla. Lo copiado se corre debajo del recado y queda el hueco de «casi». Después se recortan «casi», «no» y «hoy», y queda «Kenia comió.».',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🍽️ Ver el plato', '🔍 Comparar', '⚖️ ¿Qué cambia?', '✂️ Quitar palabras', '🧩 Devolverlas', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
