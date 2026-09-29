/* ============================================================
   M.E.T.A.S · Los Verbos · «Mi mamá ___ el dinero de la excursión»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Marvin: le
   dejó al maestro un papel al que le faltaba el verbo, nadie pudo saber si
   el dinero ya había salido, y el sábado se quedó viendo salir el bus. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js; aquí
   solo está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el papel, con el hueco del verbo: ¿el dinero ya salió, o todavía no?
        El sobre del dinero puede caer en tres sitios de la línea del
        tiempo, y sin la palabra no se sabe en cuál. Se decide antes de
        tocar;
     1  «mandó»: el sobre cae ANTES de ahora. Ya salió;
     2  «manda»: cambia una letra y el sobre cae en el AHORA. Sale ahora;
     3  «mandará»: el sobre cae DESPUÉS. Va a salir. Son tres noticias
        distintas del mismo papel, y las tres se quedan a la vista;
     4  «mand-» es la raíz, y no cambió en ninguna de las tres: dice qué se
        hace. La terminación es la desinencia, y aquí dice cuándo.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **La historia prometía tres noticias, y con «el viernes» eran dos.**
      El papel decía «Mi mamá ___ el dinero de la excursión el viernes», y
      con una fecha que viene, el presente habla del futuro, como en
      «mañana voy»: «lo manda el viernes» y «lo mandará el viernes» le dicen
      al maestro lo mismo, que todavía no ha salido. Se quitó la fecha del
      papel, en la historia de la misión: sin ella, las tres noticias son de
      verdad tres, y cada una es lo que la misión enseña justo debajo (ya
      ocurrió, ocurre ahora, va a ocurrir). Cuando el cuento y la verdad se
      pelean, se cambia el cuento.
   2. **El verbo va al final del primer renglón**, para que cambiarle la
      terminación no corra el resto de la frase: lo único que se mueve en el
      papel es lo que cambia.
   3. ⚠️ **La raíz no se mueve nunca.** «Mand» aparece en el paso 1 y se queda
      quieta en su sitio hasta el final; lo que sale y entra es la
      terminación, y el sobre se mueve CON ella, después de ella. Así se ve
      que lo que dice cuándo es el final de la palabra, antes de que el paso
      4 le ponga nombre. La sonda mide que «mand» no se corra ni un punto.
   4. **Las tres noticias se quedan.** Cada tiempo que se prueba deja arriba
      de su punto la forma («mandó», «manda», «mandará») y debajo lo que el
      maestro entiende. En el paso 3 están las tres a la vez, que es lo que
      promete la historia: tres noticias distintas del mismo papel.
   5. ⚠️ **La prueba no se regala.** Aquí no sale ninguna palabra de sus
      preguntas (ni «cantar», ni «jugar», ni «Copán»…), ni lo que la misión
      pregunta y la historia no necesita: persona, número, modo. Y dos
      ejercicios de la misión repetían el sujeto de este papel en presente
      («Mi mamá prepara la cena», y en la prueba de pensamiento crítico
      «Mi mamá preparan…», que se corrige con «prepara»): con «Mi mamá
      manda» a la vista se contestaban por el parecido. Ahora son de «Mi
      tía».
   6. **Lo que es papel es papel en las dos pantallas.** El papel de Marvin y
      el sobre del dinero llevan su color siempre, con tinta oscura fija; la
      línea del tiempo y lo que se escribe en ella llevan la tinta de la
      pantalla. Y nada se dice solo con color: la terminación va subrayada
      con raya entera, la raíz con raya cortada, y los dos rótulos llevan el
      borde con la misma raya que su pieza.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPapel')) return;

  var ANCHO = 320, ALTO = 208, FIN = 4;

  /* El papel de Marvin: dos renglones, y el verbo al final del primero.
     Medido con la Fredoka de la misión: «Mi mamá» mide 64,5; «mand», 39,9;
     el espacio, 3,8; y la terminación más larga, «ará», 24,3. */
  var PX0 = 30, PX1 = 290, PY0 = 4, PY1 = 82;
  var X0 = 52, Y1 = 44, Y2 = 68;
  var X_R = 120.3, ANCHO_R = 39.9, X_D = 160.2;
  var FINES = [{ t: 'ó', w: 8.9 }, { t: 'a', w: 8.9 }, { t: 'ará', w: 24.3 }];

  /* La línea del tiempo. «Ahora» es cuando Marvin entrega el papel: lo que
     ya pasó queda a la izquierda y lo que va a pasar, a la derecha, como en
     la línea del tiempo de cualquier cuaderno. Arriba de cada punto va la
     forma del verbo (medida a 14: «mand» 34,9) y abajo, lo que entiende el
     maestro. */
  var AY = 158, P = [64, 160, 256], EY = 128, FY = 104, NY = 198;
  var FORMA_R = 34.9, FORMA_FIN = [7.8, 7.9, 21.2];
  var ZONAS = ['antes', 'ahora', 'después'];
  var NOTICIAS = ['«Ya salió.»', '«Sale ahora.»', '«Va a salir.»'];

  /* Los rótulos del paso 4, en el papel: «raíz» encima de «mand» y
     «desinencia» a la derecha de la terminación. */
  var XR_MEDIO = 140.25, XD_ROT = 196, YD_ROT = 38.5;

  var TEXTOS = [
    'Al papel de Marvin le falta una palabra. ¿El dinero ya salió, o todavía no? Decídelo antes de tocar.',
    'Sin la palabra no se sabía. Con «mandó», el dinero ya salió: eso pasó antes.',
    'Cambia una letra y cambia la noticia: con «manda», el dinero sale ahora, cuando Marvin entrega el papel.',
    'Con «mandará», todavía no sale: va a salir después. Son tres noticias distintas del mismo papel.',
    '«Mand-» es la raíz y no cambia: dice qué se hace. La terminación es la desinencia, y aquí dice cuándo.'
  ];

  var A;
  var hueco, raiz, rayaRaiz, finesPapel = [], sobre, caidas = [], abanico = [], preguntas = [];
  var formas = [], noticias = [], conR, rotR, conD, rotD;

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El papel de Marvin: una hoja de cuaderno, con su margen y sus
       renglones, firmada abajo. ── */
    var hoja = el('g', { class: 'vb-hoja' }, svg);
    el('rect', { class: 'vb-papel', 'data-papel': '', x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0, rx: 3 }, hoja);
    el('path', { class: 'vb-renglon', d: 'M ' + (PX0 + 6) + ' 51 H ' + (PX1 - 6) + ' M ' + (PX0 + 6) + ' 75 H ' + (PX1 - 6) }, hoja);
    el('path', { class: 'vb-margen', d: 'M ' + (PX0 + 16) + ' ' + PY0 + ' V ' + PY1 }, hoja);
    /* Es un recado para el maestro, y así empieza. */
    texto(hoja, { class: 'vb-firma', 'data-saludo': '', x: X0, y: 24, 'font-size': 12 }, 'Maestro:');
    texto(hoja, { class: 'vb-tinta', 'data-renglon': 1, x: X0, y: Y1, 'font-size': 16 }, 'Mi mamá');
    texto(hoja, { class: 'vb-tinta', 'data-renglon': 2, x: X0, y: Y2, 'font-size': 16 }, 'el dinero de la excursión.');
    texto(hoja, { class: 'vb-firma', 'data-firma': '', x: PX1 - 12, y: Y2, 'text-anchor': 'end', 'font-size': 11 }, 'Marvin');
    /* El hueco del verbo, del ancho de una palabra corta. */
    hueco = el('rect', { class: 'vb-hueco', 'data-hueco': '', x: X_R - 2, y: Y1 - 16, width: 54, height: 22, rx: 4 }, hoja);
    /* La raíz: aparece una vez y no se mueve más. */
    raiz = texto(hoja, { class: 'vb-tinta am-fuera', 'data-renglon': 1, 'data-pieza': 'raiz', x: X_R, y: Y1, 'font-size': 16 }, 'mand');
    /* Su raya cortada, que es la de su rótulo, en el paso 4. */
    rayaRaiz = el('path', { class: 'vb-subraya-raiz am-fuera', 'data-raya': 'raiz', d: 'M ' + X_R + ' ' + (Y1 + 3.5) + ' H ' + r2(X_R + ANCHO_R) }, hoja);
    /* Las tres terminaciones, cada una con su raya entera. Van en dos piezas
       porque aparecen Y se corren: la que se va baja apagándose y la que
       llega baja desde arriba, en el mismo sitio. */
    finesPapel = FINES.map(function (f) {
      var fuera = el('g', { class: 'am-fuera', 'data-fin': f.t }, hoja);
      var dentro = el('g', null, fuera);
      texto(dentro, { class: 'vb-fin-papel', 'data-renglon': 1, 'data-pieza': 'fin', x: X_D, y: Y1, 'font-size': 16 }, f.t);
      el('path', { class: 'vb-subraya', 'data-raya': 'fin', d: 'M ' + X_D + ' ' + (Y1 + 3.5) + ' H ' + r2(X_D + f.w) }, dentro);
      return { fuera: fuera, dentro: dentro };
    });

    /* ── La línea del tiempo. ── */
    el('path', { class: 'vb-eje', 'data-eje': '', d: 'M 14 ' + AY + ' H 300' }, svg);
    el('path', { class: 'vb-flecha', d: 'M 299 ' + (AY - 4.5) + ' L 308 ' + AY + ' L 299 ' + (AY + 4.5) + ' Z' }, svg);
    el('path', { class: 'vb-ahora-marca', 'data-ahora': '', d: 'M 160 ' + (AY - 8) + ' V ' + (AY + 8) }, svg);
    P.forEach(function (x, i) {
      el('circle', { class: 'vb-punto', 'data-punto': ZONAS[i], cx: x, cy: AY, r: 3.5 }, svg);
      texto(svg, { class: 'vb-zona' + (i === 1 ? ' vb-zona-ahora' : ''), 'data-zona': ZONAS[i], x: x, y: AY + 18, 'text-anchor': 'middle', 'font-size': 12 }, ZONAS[i]);
    });

    /* La raya que une el sobre con su punto. Es una por punto y NO viaja
       con el sobre: mientras él cruza la línea, una raya colgando de él
       apunta a un sitio del tiempo que no es ninguno de los tres. Aparece
       cuando el sobre ya llegó. */
    caidas = P.map(function (x, i) {
      return el('path', { class: 'vb-caida am-fuera', 'data-caida': ZONAS[i], d: 'M ' + x + ' ' + (EY + 10) + ' V ' + (AY - 5) }, svg);
    });

    /* Paso 0: los tres sitios donde podría caer el sobre, y en ninguno se
       sabe qué pasó. Van debajo del sobre, que tapa de dónde salen. */
    abanico = P.map(function (x, i) {
      return el('path', { class: 'vb-abanico am-fuera', 'data-abanico': ZONAS[i], d: 'M 160 ' + (EY + 10) + ' L ' + x + ' ' + (AY - 5) }, svg);
    });
    preguntas = P.map(function (x, i) {
      return texto(svg, { class: 'vb-pregunta am-fuera', 'data-pregunta': ZONAS[i], x: x, y: NY, 'text-anchor': 'middle', 'font-size': 14 }, '?');
    });

    /* Lo que se leyó en cada tiempo: la forma arriba de su punto, con la
       terminación subrayada, y lo que entiende el maestro, debajo. */
    formas = FINES.map(function (f, k) {
      var w = FORMA_R + FORMA_FIN[k], x0 = r2(P[k] - w / 2), xd = r2(x0 + FORMA_R);
      var g = el('g', { class: 'am-fuera', 'data-forma': f.t }, svg);
      texto(g, { class: 'vb-forma-raiz', 'data-parte': 'raiz', x: x0, y: FY, 'font-size': 14 }, 'mand');
      texto(g, { class: 'vb-forma-fin', 'data-parte': 'fin', x: xd, y: FY, 'font-size': 14 }, f.t);
      el('path', { class: 'vb-forma-subraya', 'data-raya-forma': 'fin', d: 'M ' + xd + ' ' + (FY + 3.5) + ' H ' + r2(xd + FORMA_FIN[k]) }, g);
      var rr = el('path', { class: 'vb-forma-raiz-raya am-fuera', 'data-raya-forma': 'raiz', d: 'M ' + x0 + ' ' + (FY + 3.5) + ' H ' + r2(x0 + FORMA_R) }, g);
      return { g: g, rr: rr };
    });
    noticias = NOTICIAS.map(function (t, k) {
      return texto(svg, { class: 'vb-noticia am-fuera', 'data-noticia': ZONAS[k], x: P[k], y: NY, 'text-anchor': 'middle', 'font-size': 13 }, t);
    });

    /* ── El sobre del dinero, con el billete asomándose. No se apaga nunca:
       lo único que hace es viajar. ── */
    var dinero = el('g', { class: 'vb-dinero' }, svg);
    sobre = el('g', { 'data-sobre': '' }, dinero);
    el('rect', { class: 'vb-billete', x: -11, y: -16, width: 22, height: 11, rx: 1.5 }, sobre);
    el('rect', { class: 'vb-sobre', 'data-sobre-cuerpo': '', x: -14, y: -9, width: 28, height: 18, rx: 2 }, sobre);
    el('path', { class: 'vb-solapa', d: 'M -14 -9 L 0 1.5 L 14 -9' }, sobre);

    /* ── Los rótulos del paso 4, encima de todo, cada uno con su hilo hasta
       su pieza del papel. El de la raíz lleva el borde cortado, como su raya;
       el de la desinencia, entero. ── */
    conR = el('path', { class: 'vb-conector-raiz', 'data-conector': 'raiz', d: 'M ' + XR_MEDIO + ' 24 V 31' }, svg);
    rotR = el('g', { class: 'am-fuera vb-pildora vb-pildora-raiz', 'data-rotulo': 'raiz' }, svg);
    el('rect', { x: r2(XR_MEDIO - 18), y: 8, width: 36, height: 16, rx: 8 }, rotR);
    texto(rotR, { class: 'vb-pildora-txt', x: XR_MEDIO, y: 20, 'text-anchor': 'middle', 'font-size': 12 }, 'raíz');
    conD = el('path', { class: 'vb-conector', 'data-conector': 'desinencia', d: 'M ' + r2(X_D + FINES[2].w + 3) + ' ' + YD_ROT + ' H ' + XD_ROT }, svg);
    rotD = el('g', { class: 'am-fuera vb-pildora', 'data-rotulo': 'desinencia' }, svg);
    el('rect', { x: XD_ROT, y: YD_ROT - 8, width: 72, height: 16, rx: 8 }, rotD);
    texto(rotD, { class: 'vb-pildora-txt', x: XD_ROT + 36, y: YD_ROT + 4, 'text-anchor': 'middle', 'font-size': 12 }, 'desinencia');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    /* Qué terminación está en el papel: ninguna en el paso 0, y en el 4 se
       queda la última que se probó. */
    var actual = n === 0 ? -1 : Math.min(n, 3) - 1;
    var nuevo = ida && n >= 1 && n <= 3;

    /* 0 · El hueco, hasta que se escribe la primera palabra; y la raíz, que
       desde ahí no se mueve más. */
    A.ver(hueco, n === 0, 0);
    A.ver(raiz, n >= 1, 0);

    /* La terminación: la que se va baja apagándose, y la que llega baja
       desde arriba un momento después. */
    finesPapel.forEach(function (f, k) {
      var si = k === actual, d = si && nuevo ? 250 : 0;
      A.ver(f.fuera, si, d);
      A.mover(f.dentro, 0, si ? 0 : (k < actual ? 7 : -7), 0, 1, d);
    });

    /* El sobre: en el paso 0, en medio y con sus tres caminos; después, cae
       en el tiempo que dice la terminación, cuando ya se cambió. Lo que lo
       ata a su sitio (la raya de su punto, o los tres caminos del paso 0)
       aparece cuando el sobre ya llegó: de ida tarda la terminación y el
       viaje; de vuelta, solo el viaje. */
    var vuelve = antes != null && antes !== n;
    var llega = nuevo ? 1250 : (vuelve ? 650 : 0);
    A.mover(sobre, actual < 0 ? 160 : P[actual], EY, 0, 1, nuevo ? 450 : 0);
    caidas.forEach(function (c, k) { A.ver(c, k === actual, k === actual ? llega : 0); });
    abanico.forEach(function (p) { A.ver(p, n === 0, n === 0 ? llega : 0); });
    preguntas.forEach(function (q) { A.ver(q, n === 0, n === 0 ? llega : 0); });

    /* Lo que se leyó en cada tiempo se queda: la forma arriba, la noticia
       abajo. En el paso 4, cada «mand» lleva la raya cortada de la raíz. */
    formas.forEach(function (f, k) {
      var hecho = n >= k + 1, recien = nuevo && k === actual;
      A.ver(f.g, hecho, recien ? 1100 : 0);
      A.ver(noticias[k], hecho, recien ? 1400 : 0);
      A.ver(f.rr, n >= 4, n === 4 && ida ? 900 + k * 150 : 0);
    });

    /* 4 · Qué es cada pieza, en el papel. */
    var clases = n === 4 && ida;
    A.ver(rayaRaiz, n >= 4, 0);
    A.trazar(conR, n >= 4, 0);
    A.ver(rotR, n >= 4, clases ? 200 : 0);
    A.trazar(conD, n >= 4, clases ? 450 : 0);
    A.ver(rotD, n >= 4, clases ? 650 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿cuándo sale el dinero?' },
      { cifra: '-ó', palabras: 'pasado: ya pasó' },
      { cifra: '-a', palabras: 'presente: pasa ahora' },
      { cifra: '-ará', palabras: 'futuro: va a pasar' },
      { cifra: 'mand-', palabras: 'la raíz, igual en las tres' }
    ][n];
  }

  AnimacionMision.montar('#amPapel', {
    vista: [ANCHO, ALTO],
    describe: 'El papel de Marvin, «Mi mamá … el dinero de la excursión», con el hueco del verbo, y debajo una línea del tiempo. Con «mandó», el sobre del dinero cae antes de ahora; con «manda», en el ahora, y con «mandará», después. La raíz «mand» no cambia: cambia la terminación.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['⏪ En pasado', '▶️ En presente', '⏩ En futuro', '🧩 ¿Qué cambió?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
