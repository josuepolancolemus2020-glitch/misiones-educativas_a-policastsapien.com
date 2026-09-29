/* ============================================================
   M.E.T.A.S · La Acentuación · «Mañana publico la lista»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña Nely:
   el maestro escribió en el grupo «Mañana publico la lista de los que
   van», ella leyó «publicó», con la voz cargada al final, entendió que la
   lista ya estaba y caminó cuarenta minutos hasta la escuela y cuarenta de
   vuelta para nada. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el mensaje, con «publico» subrayado, y sus tres sílabas: pu · bli
        · co. ¿En cuál carga la voz? Se decide antes de tocar;
     1  lo que leyó doña Nely: la voz en «co», «publicó», ya pasó. Y lo que
        le costó: cuarenta minutos de ida y cuarenta de vuelta;
     2  lo que escribió el maestro: la voz en «bli», «publico», como en «yo
        publico». Con «mañana» delante, la lista salía al día siguiente;
     3  la tercera: la voz en «pu», «público», la gente que mira. Las
        mismas letras dan tres palabras;
     4  solo «publico» va sin rayita, que es la que carga en «bli»; en las
        otras dos, la rayita avisa dónde carga la voz;
     5  el mensaje decía «publico», sin rayita: la voz va en «bli» y la
        lista sale mañana. Leído así, doña Nely se ahorra el viaje.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Primero la voz, después la escritura.** Arriba de cada palabra
      van sus sílabas como fichas, y la que carga la voz sube y lleva el
      dibujo de la voz encima; debajo va la palabra escrita. La rayita
      aparece en la escritura y siempre sobre la misma sílaba que subió: es
      lo que la sonda comprueba, calculando ella dónde tiene que ir.
   2. ⚠️ **La rayita avisa dónde carga la voz; no se dice que «distingue
      palabras».** «Publicó» y «público» la llevan por la regla general, no
      por la diacrítica, y la prueba define la diacrítica justo como la que
      distingue dos palabras que se escriben igual. Decir aquí que la
      rayita distingue palabras le enseñaría al alumno a llamar diacrítica
      a la de «publicó». Por eso tampoco se dice «tilde»: se dice
      «rayita», como la historia.
   3. ⚠️ **La prueba no se regala.** Sus pareados son las clases (la
      sílaba tónica, las agudas, las llanas, las esdrújulas, el diptongo,
      el hiato, la diacrítica), y sus definiciones dicen «la última», «la
      penúltima», «la antepenúltima». Aquí no se nombra ninguna clase ni
      ninguna de esas posiciones: la sílaba se dice por lo que suena,
      «pu», «bli», «co». Y no sale ninguna palabra de sus preguntas.
   4. **La regla se dice solo de estas tres palabras.** «Solo «publico» va
      sin rayita: carga en «bli»» es verdad de estas tres, que terminan en
      vocal. Dicho de todas las palabras sería falso («día» carga en la
      misma posición y lleva rayita), y una animación que enseña una regla
      que falla enseña a no creerle.
   5. **Lo que le costó a doña Nely se ve.** En el paso 1 camina de su
      casa a la escuela y vuelve, y quedan las dos flechas con sus
      cuarenta minutos; el marcador suma lo que dicen, 80. En el último
      paso las flechas ya no están: leyendo bien, ese viaje no se hace.
   6. **El mensaje no cambia nunca.** El maestro escribió «publico», sin
      rayita, y así se queda en los seis pasos: lo que cambia es cómo se
      lee. La rayita de «publicó» del paso 1 está en la lectura de doña
      Nely, no en el mensaje.

   El globo del mensaje es de papel en las dos pantallas, con tinta oscura
   fija; las fichas de las sílabas, también. Lo que va sobre el escenario
   (el dibujo de la voz, las flechas, los rótulos) lleva la tinta de la
   pantalla. Y nada se dice solo con color: la sílaba que carga la voz sube,
   lleva el borde grueso y el dibujo de la voz encima.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRayita')) return;

  var ANCHO = 320, ALTO = 258, FIN = 5;

  /* El globo del mensaje, con su punta de mensaje recibido. */
  var BX0 = 12, BX1 = 204, BY0 = 17, BY1 = 65;

  /* El mensaje, medido con la Fredoka de la misión a 16 (peso 600):
     «Mañana» 57,98; «publico» 52,27; «la lista» 49,02; el espacio 3,86;
     «de los que van.» 106,61. Va en dos renglones. */
  var X0 = 24, L1 = 37, L2 = 57, SP = 3.86;
  var W16 = { 'Mañana': 57.98, publico: 52.27, 'la lista': 49.02 };
  var XP = X0 + W16['Mañana'] + SP, XL = XP + W16.publico + SP;

  /* Las tres lecturas, una columna cada una, ordenadas por dónde carga la
     voz: en «pu», en «bli» y en «co». */
  var SIL = ['pu', 'bli', 'co'];
  var COL = [60, 160, 260];
  var LEE = [
    { escrita: 'público', dice: 'la gente que mira', quien: 'otra palabra', rayita: 0 },
    { escrita: 'publico', dice: 'yo lo hago', quien: 'el maestro', rayita: -1 },
    { escrita: 'publicó', dice: 'ya pasó', quien: 'doña Nely', rayita: 2 }
  ];
  /* Desde qué paso se ve cada columna: la de doña Nely en el 1, la del
     maestro en el 2 y la tercera en el 3. */
  var DESDE = [3, 2, 1];

  /* Las fichas de las sílabas: 26 de ancho, 3 de hueco, y la que carga la
     voz sube 5. El dibujo de la voz va encima de ella. */
  var TW = 26, TH = 24, TG = 3, TY = 89, SUBE = 5, VY = 76;
  function xFicha(c, k) { return COL[c] + (k - 1) * (TW + TG); }

  /* La palabra escrita, a 17: las tres miden 55,54 («ú» y «ó» miden lo
     mismo que sin rayita); la «p» 9,38 y «public» 46,04, y cada vocal con
     rayita 9,5. De ahí sale dónde acaba el hilo del paso 4, que baja de la
     sílaba que carga la voz hasta su rayita: la punta de la rayita está 13
     por encima del renglón. Un aro alrededor de la rayita se comía la
     letra de debajo y se leía «p⊙blico». */
  var WY = 135, WW = 55.54;
  var RAYA_X = [9.38 + 9.52 / 2, null, 46.04 + 9.5 / 2];

  /* El camino de doña Nely: de su casa a la escuela, y las dos flechas del
     paso 1, cada una con sus cuarenta minutos. */
  var SUELO = 244, NX = 56, VIAJE = 172;

  var TEXTOS = [
    'El maestro escribió «publico», sin rayita. ¿En cuál sílaba carga la voz? Dilo en voz alta antes de tocar.',
    'Doña Nely cargó la voz en «co»: «publicó», ya pasó. Caminó cuarenta minutos de ida y cuarenta de vuelta, y no había lista.',
    'El maestro la cargaba en «bli»: «publico», como en «yo publico». Con «mañana» delante, la lista salía al día siguiente.',
    'Y si carga en «pu», es otra palabra: «público», la gente que mira. Las mismas letras dan tres palabras.',
    'Solo «publico» va sin rayita: carga en «bli». En las otras dos, la rayita avisa dónde carga la voz.',
    'Sin rayita, la voz va en «bli»: «publico», la lista sale mañana. Leído así, doña Nely se ahorra ochenta minutos.'
  ];

  var A;
  var subCortada, subEntera, enlace, gEnlace, neutras, columnas = [], hilos = [], marco;
  var ida = {}, vuelta = {}, nely, nelyVa, nelyVuelve;

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  function globo() {
    return 'M 4 ' + BY0 + ' H ' + (BX1 - 8) + ' A 8 8 0 0 1 ' + BX1 + ' ' + (BY0 + 8) + ' V ' + (BY1 - 8) +
      ' A 8 8 0 0 1 ' + (BX1 - 8) + ' ' + BY1 + ' H ' + (BX0 + 8) + ' A 8 8 0 0 1 ' + BX0 + ' ' + (BY1 - 8) +
      ' V ' + (BY0 + 9) + ' Z';
  }

  /* El dibujo de la voz: un punto y dos ondas a cada lado. */
  function voz(padre, x) {
    var g = A.el('g', { class: 'ra-voz', 'data-voz': '' }, padre);
    A.el('circle', { cx: x, cy: VY, r: 2.4 }, g);
    var d = '';
    [5.5, 9].forEach(function (r) {
      var dx = r2(r * Math.cos(Math.PI / 4.5)), dy = r2(r * Math.sin(Math.PI / 4.5));
      d += 'M ' + r2(x - dx) + ' ' + r2(VY - dy) + ' A ' + r + ' ' + r + ' 0 0 0 ' + r2(x - dx) + ' ' + r2(VY + dy) + ' ';
      d += 'M ' + r2(x + dx) + ' ' + r2(VY - dy) + ' A ' + r + ' ' + r + ' 0 0 1 ' + r2(x + dx) + ' ' + r2(VY + dy) + ' ';
    });
    A.el('path', { d: d }, g);
    return g;
  }

  /* Las tres fichas de una columna; la que carga la voz, subida y con el
     borde grueso. */
  function fichas(padre, c, carga) {
    SIL.forEach(function (s, k) {
      var x = xFicha(c, k), arriba = k === carga;
      var g = A.el('g', { class: 'ra-ficha' + (arriba ? ' ra-ficha-voz' : ''), 'data-silaba': s, 'data-carga': arriba ? 'si' : 'no' }, padre);
      var y = TY - (arriba ? SUBE : 0);
      A.el('rect', { x: r2(x - TW / 2), y: y, width: TW, height: TH, rx: 5 }, g);
      texto(g, { class: 'ra-tinta', x: x, y: y + 17, 'text-anchor': 'middle', 'font-size': 16 }, s);
    });
  }

  /* Doña Nely: una señora con su moño, su vestido y su bolso. Va en dos
     capas, una para la ida y otra para la vuelta: si una sola hiciera las
     dos cosas, llevarían la misma demora y no se vería ir y volver. */
  function senora(padre) {
    var el = A.el, x = NX, y = SUELO;
    nelyVa = el('g', { class: 'am-viaja' }, padre);
    nelyVuelve = el('g', { class: 'am-viaja', 'data-nely': '' }, nelyVa);
    var g = nelyVuelve;
    el('path', { class: 'ra-pierna', d: 'M ' + (x - 2.5) + ' ' + (y - 7) + ' V ' + (y - 0.5) + ' M ' + (x + 2.5) + ' ' + (y - 7) + ' V ' + (y - 0.5) }, g);
    el('path', { class: 'ra-vestido', d: 'M ' + (x - 5) + ' ' + (y - 20) + ' H ' + (x + 5) + ' L ' + (x + 8) + ' ' + (y - 6) + ' H ' + (x - 8) + ' Z' }, g);
    el('circle', { class: 'ra-pelo', cx: x - 3.8, cy: y - 26.5, r: 2.6 }, g);
    el('circle', { class: 'ra-cara', cx: x, cy: y - 25, r: 4.6 }, g);
    el('path', { class: 'ra-pelo', d: 'M ' + (x - 4.7) + ' ' + (y - 25) + ' C ' + (x - 5) + ' ' + (y - 31) + ' ' + (x + 5) + ' ' + (y - 31) + ' ' + (x + 4.7) + ' ' + (y - 25) + ' C ' + (x + 2) + ' ' + (y - 28) + ' ' + (x - 2) + ' ' + (y - 28) + ' ' + (x - 4.7) + ' ' + (y - 25) + ' Z' }, g);
    el('rect', { class: 'ra-bolso', x: x + 5.5, y: y - 16, width: 4.5, height: 5, rx: 1 }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    texto(svg, { class: 'ra-grupo', x: 14, y: 12, 'font-size': 11 }, 'Grupo de las familias');

    /* ── El mensaje del maestro, que no cambia nunca. ── */
    el('path', { class: 'ra-globo', 'data-globo': '', d: globo() }, svg);
    texto(svg, { class: 'ra-tinta', 'data-mensaje': 1, x: X0, y: L1, 'font-size': 16 }, 'Mañana');
    texto(svg, { class: 'ra-tinta', 'data-mensaje': 1, 'data-palabra': 'publico', x: r2(XP), y: L1, 'font-size': 16 }, 'publico');
    texto(svg, { class: 'ra-tinta', 'data-mensaje': 1, x: r2(XL), y: L1, 'font-size': 16 }, 'la lista');
    texto(svg, { class: 'ra-tinta', 'data-mensaje': 2, x: X0, y: L2, 'font-size': 16 }, 'de los que van.');
    var sub = 'M ' + r2(XP) + ' ' + (L1 + 4.5) + ' H ' + r2(XP + W16.publico);
    subCortada = el('path', { class: 'ra-sub-cortada', 'data-sub': 'cortada', d: sub }, svg);
    subEntera = el('path', { class: 'ra-sub-entera am-fuera', 'data-sub': 'entera', d: sub }, svg);
    /* Paso 5: del mensaje baja una raya a la lectura del maestro. Sale del
       final de «publico», por la derecha del segundo renglón, y va en un
       grupo: al irse se apaga entera, no se recoge (una raya que se recoge
       deja pedazos colgando, como se vio en Los Adjetivos). */
    gEnlace = el('g', { class: 'am-fuera' }, svg);
    enlace = el('path', { class: 'ra-enlace', 'data-enlace': '', d: 'M ' + r2(XP + W16.publico) + ' ' + (L1 + 5.5) + ' L ' + (COL[1] - 12) + ' ' + (VY - 8) }, gEnlace);

    /* ── Paso 0: las tres sílabas, todavía sin voz, y una pregunta encima
       de cada una. ── */
    neutras = el('g', { 'data-neutras': '' }, svg);
    fichas(neutras, 1, -1);
    SIL.forEach(function (s, k) {
      texto(neutras, { class: 'ra-duda', 'data-duda': s, x: xFicha(1, k), y: VY + 5, 'text-anchor': 'middle', 'font-size': 13 }, '?');
    });

    /* ── Las tres lecturas. ── */
    LEE.forEach(function (l, c) {
      var g = el('g', { class: 'am-fuera', 'data-lectura': l.escrita, 'data-carga': SIL[c] }, svg);
      voz(g, xFicha(c, c));
      fichas(g, c, c);
      texto(g, { class: 'ra-escrita', 'data-escrita': '', x: COL[c], y: WY, 'text-anchor': 'middle', 'font-size': 17 }, l.escrita);
      texto(g, { class: 'ra-dice', 'data-dice': '', x: COL[c], y: WY + 16, 'text-anchor': 'middle', 'font-size': 11 }, l.dice);
      texto(g, { class: 'ra-quien', 'data-quien': '', x: COL[c], y: WY + 31, 'text-anchor': 'middle', 'font-size': 11 }, l.quien);
      columnas.push(g);
      /* Paso 4: el hilo que baja de la sílaba que carga la voz hasta su
         rayita, con su punta de flecha. */
      if (l.rayita >= 0) {
        var ax = r2(COL[c] - WW / 2 + RAYA_X[c]), tx = xFicha(c, c), ty = TY - SUBE + TH + 1.5, py = WY - 15.5;
        var dx = ax - tx, dy = py - ty, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
        var p1 = [r2(ax - 4 * ux - 2.6 * uy), r2(py - 4 * uy + 2.6 * ux)], p2 = [r2(ax - 4 * ux + 2.6 * uy), r2(py - 4 * uy - 2.6 * ux)];
        hilos.push(el('path', { class: 'ra-hilo am-fuera', 'data-hilo': l.escrita,
          d: 'M ' + r2(tx) + ' ' + r2(ty) + ' L ' + ax + ' ' + r2(py) + ' M ' + p1.join(' ') + ' L ' + ax + ' ' + r2(py) + ' L ' + p2.join(' ') }, svg));
      }
    });
    /* Paso 5: la lectura del maestro, enmarcada. */
    marco = el('rect', { class: 'ra-marco am-fuera', 'data-marco': 'publico', x: COL[1] - 48, y: VY - 8, width: 96, height: WY + 36 - (VY - 8), rx: 8 }, svg);

    /* ── El camino de doña Nely. ── */
    var camino = el('g', null, svg);
    el('path', { class: 'ra-suelo', d: 'M 8 ' + SUELO + ' H 312' }, camino);
    el('path', { class: 'ra-camino', d: 'M 50 ' + (SUELO + 0.5) + ' H 238' }, camino);
    /* La casa. */
    el('path', { class: 'ra-techo', d: 'M 10 ' + (SUELO - 18) + ' L 28 ' + (SUELO - 32) + ' L 46 ' + (SUELO - 18) + ' Z' }, camino);
    el('rect', { class: 'ra-pared', x: 13, y: SUELO - 18, width: 30, height: 18 }, camino);
    el('rect', { class: 'ra-puerta', x: 24, y: SUELO - 10, width: 8, height: 10 }, camino);
    texto(camino, { class: 'ra-rotulo', 'data-lugar': 'casa', x: 28, y: SUELO + 11, 'text-anchor': 'middle', 'font-size': 11 }, 'casa');
    /* La escuela, con el tablero donde iba a estar la lista: vacío. */
    el('path', { class: 'ra-techo', d: 'M 260 ' + (SUELO - 22) + ' L 285 ' + (SUELO - 34) + ' L 310 ' + (SUELO - 22) + ' Z' }, camino);
    el('rect', { class: 'ra-pared', x: 263, y: SUELO - 22, width: 44, height: 22 }, camino);
    el('rect', { class: 'ra-ventana', x: 268, y: SUELO - 17, width: 8, height: 7 }, camino);
    el('rect', { class: 'ra-ventana', x: 294, y: SUELO - 17, width: 8, height: 7 }, camino);
    el('rect', { class: 'ra-puerta', x: 281, y: SUELO - 12, width: 8, height: 12 }, camino);
    texto(camino, { class: 'ra-rotulo', 'data-lugar': 'escuela', x: 285, y: SUELO + 11, 'text-anchor': 'middle', 'font-size': 11 }, 'escuela');
    el('path', { class: 'ra-pata', d: 'M 243 ' + (SUELO - 9) + ' V ' + SUELO + ' M 253 ' + (SUELO - 9) + ' V ' + SUELO }, camino);
    el('rect', { class: 'ra-tablero', 'data-tablero': '', x: 240, y: SUELO - 22, width: 16, height: 13, rx: 1 }, camino);

    /* Las dos flechas del paso 1: la ida por arriba y la vuelta por abajo,
       cada una con sus minutos. */
    var yI = SUELO - 50, yV = SUELO - 40;
    ida.g = el('g', { class: 'am-fuera', 'data-flecha': 'ida' }, svg);
    el('path', { class: 'ra-flecha', d: 'M 70 ' + yI + ' H 228 M 222 ' + (yI - 4) + ' L 228 ' + yI + ' L 222 ' + (yI + 4) }, ida.g);
    texto(ida.g, { class: 'ra-rotulo', 'data-minutos': 40, x: 149, y: yI - 5, 'text-anchor': 'middle', 'font-size': 11 }, '40 min de ida');
    vuelta.g = el('g', { class: 'am-fuera', 'data-flecha': 'vuelta' }, svg);
    el('path', { class: 'ra-flecha', d: 'M 228 ' + yV + ' H 70 M 76 ' + (yV - 4) + ' L 70 ' + yV + ' L 76 ' + (yV + 4) }, vuelta.g);
    texto(vuelta.g, { class: 'ra-rotulo', 'data-minutos': 40, x: 149, y: yV + 13, 'text-anchor': 'middle', 'font-size': 11 }, '40 min de vuelta');

    nely = senora(svg);
  }

  function pintar(n, antes) {
    var ida1 = !(antes != null && antes > n);
    var fue = function (k) { return ida1 && n === k; };

    /* 0 · Las tres sílabas sin voz. Al volver al principio esperan a que
       se apaguen las columnas: encendidas a la vez, las de en medio se
       montaban sobre la lectura del maestro. */
    A.ver(neutras, n === 0, n === 0 && antes != null && antes > 0 ? 400 : 0);

    /* 1 a 3 · Cada lectura en su columna, y se quedan. */
    columnas.forEach(function (g, c) {
      A.ver(g, n >= DESDE[c], fue(DESDE[c]) ? 300 : 0);
    });

    /* 1 · Doña Nely camina a la escuela y vuelve; quedan las dos flechas.
       De vuelta a este paso, o saliendo de él, las dos capas se mueven a la
       vez y se anulan: no se la ve caminar otra vez. */
    var camina = fue(1);
    A.mover(nelyVa, n === 1 ? VIAJE : 0, 0, 0, 1, camina ? 900 : 0);
    A.mover(nelyVuelve, n === 1 ? -VIAJE : 0, 0, 0, 1, camina ? 2100 : 0);
    A.ver(ida.g, n === 1, camina ? 1700 : 0);
    A.ver(vuelta.g, n === 1, camina ? 2900 : 0);

    /* 4 · De la sílaba que carga la voz baja un hilo hasta su rayita. */
    hilos.forEach(function (h, k) { A.ver(h, n === 4, fue(4) ? 300 + k * 250 : 0); });

    /* 5 · El mensaje decía «publico»: su subrayado pasa a raya entera y
       una raya baja a la lectura del maestro, que queda enmarcada. */
    A.ver(subCortada, n !== 5, 0);
    A.ver(subEntera, n === 5, fue(5) ? 200 : 0);
    A.ver(gEnlace, n === 5, 0);
    A.trazar(enlace, n === 5, fue(5) ? 400 : (n === 5 ? 0 : 600));
    A.ver(marco, n === 5, fue(5) ? 900 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿en cuál sílaba carga la voz?' },
      { cifra: '80', palabras: 'minutos caminando de balde' },
      { cifra: 'bli', palabras: 'la sílaba donde carga la voz' },
      { cifra: '3', palabras: 'palabras, las mismas letras' },
      { cifra: '2', palabras: 'rayitas: avisan dónde carga' },
      { cifra: '0', palabras: 'minutos de balde' }
    ][n];
  }

  AnimacionMision.montar('#amRayita', {
    vista: [ANCHO, ALTO],
    describe: 'El mensaje «Mañana publico la lista de los que van.» en el grupo de las familias, y la palabra «publico» partida en sus tres sílabas: pu, bli, co. Doña Nely cargó la voz en «co» y leyó «publicó»: caminó cuarenta minutos de ida y cuarenta de vuelta. El maestro la cargaba en «bli»: «publico». Y en «pu» es otra palabra: «público». Solo «publico» va sin rayita.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['👀 Lo que leyó ella', '✏️ Lo que escribió', '🔄 Otra sílaba', '🔍 ¿Y la rayita?', '💬 Volver al mensaje', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
