/* ============================================================
   M.E.T.A.S · Condicionales: el Robot Decide · El aviso del lunes
   ------------------------------------------------------------
   La escena de la animación que va después de la historia: el maestro
   dejó dicho «si llueve, Educación Física se hace adentro», el lunes
   amaneció nublado y con viento pero no llovió, y media clase se quedó
   en el aula y la otra media salió al patio. La historia dice que
   «nublado» no es «llueve»: una pregunta así solo sirve si se contesta
   con sí o con no, sin término medio. Eso es lo que se ve aquí. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   A la izquierda, la fila de la clase y el aviso del maestro; en medio,
   el cruce con su pregunta, de donde salen dos caminos: el del «no» sube
   al patio y el del «sí» baja al aula. Arriba, el cielo.

     0  el aviso, el cielo nublado y con viento, y ni una gota: ¿por cuál
        camino se va la clase?;
     1  cada uno contesta a su manera: cuatro dicen que sí y se meten al
        aula, cuatro dicen que no y salen al patio. La clase, partida;
     2  llega el robot: para él, «llueve» es que caen gotas, y las cuenta
        en un vasito. Cero: contesta que no y va al patio, como siempre;
     3  el maestro cambia la pregunta por una que no se presta a dudas
        («si caen gotas»): todos contestan que no y la clase va junta;
     4  otro día sí caen gotas: todos contestan que sí y van adentro. Esta
        vez les toca el otro camino, y solo ese;
     5  y la pregunta es del alumno: un aviso de su escuela que se lea de
        dos maneras, escrito con una pregunta de sí o no.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que contesta cada uno dice a dónde va, y la sonda lo cruza.**
      Cada alumno lleva su respuesta escrita encima de la cabeza («sí» o
      «no»), y el que dice «sí» termina DENTRO del aula y el que dice «no»
      dentro del patio, habiendo pasado por el cruce y por el camino de su
      respuesta. La sonda lee la etiqueta y la posición de cada uno en el
      dibujo; no le cree al rótulo de un sitio.
   2. ⚠️ **La historia no dice que el maestro se equivocó de palabra.**
      «¿Llueve?» ya es una pregunta de sí o no, y ese lunes la respuesta
      era no. Lo que partió la clase es que cada uno la contestó mirando
      otra cosa (las nubes, o el agua que no caía). Por eso el robot no la
      cambia: la contesta contando gotas, y por eso el arreglo del paso 3
      es escribir la pregunta como el robot la contesta.
   3. **El vasito cuenta de verdad.** Dentro lleva las gotas que dice su
      rótulo: ninguna el lunes y tres el día de lluvia. Y la lluvia solo
      cae el día de lluvia: el lunes está nublado y hace viento, y no se
      dibuja ni una gota.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** La animación no nombra
      la condición, ni las ramas, ni el sensor, ni cuántas partes tiene un
      condicional, ni ninguna palabra clave del pseudocódigo (SI, ENTONCES,
      SINO): el aviso está escrito como lo escribe un maestro. El nombre de
      lo que se ve lo da la tarjeta de abajo.
   5. **Cada paso que cuenta una historia la cuenta cada vez que se entra
      en él**, también volviendo con «Atrás»: la clase vuelve a la fila y
      camina otra vez.
   6. **Nada se dice solo con color.** Cada respuesta va escrita, cada
      camino lleva su «sí» o su «no», y el camino que nadie toma se queda
      con raya cortada.

   ⚠️ **La misión es bilingüe, y la animación también.** El motor de idioma
   no la traduce (js/animacion-mision.js lo cuenta): aquí están escritos los
   dos idiomas, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amAviso')) return;

  var ANCHO = 320, ALTO = 256;
  var lang = 'es';

  /* El cruce: de ahí salen los dos caminos. */
  var CRUCE = { x: 112, y: 152 };
  var ROMBO = { ax: 50, ay: 20 };
  var ENTRA = { patio: { x: 186, y: 108 }, aula: { x: 190, y: 209 } };
  var PATIO = { x0: 184, y0: 46, x1: 316, y1: 142 };
  var AULA = { x0: 188, y0: 168, x1: 314, y1: 253, techo: 154, puerta: [196, 222] };

  /* La fila: dos renglones de cuatro, a los dos lados del camino. Los de
     adelante salen primero. */
  var FILA = [[56, 142], [56, 172], [41, 142], [41, 172], [26, 142], [26, 172], [11, 142], [11, 172]];
  /* El robot entra desde afuera del dibujo, por el camino, y se para
     ANTES del cruce a mirar el vasito: parado en el cruce taparía la
     pregunta que está contestando. */
  var ROBOT_SALE = { x: -24, y: 152 };
  var PARADA = { x: CRUCE.x - ROMBO.ax - 12, y: CRUCE.y };

  /* Los lugares dentro de cada sitio: el primero que llega va al fondo,
     para que los que vienen detrás no le pasen por encima. */
  var LUGARES = {
    patio: [[280, 92], [280, 136], [256, 92], [256, 136], [232, 92], [232, 136], [208, 92], [208, 136]],
    aula: [[280, 210], [280, 251], [256, 210], [256, 251], [232, 210], [232, 251], [208, 210], [208, 251]]
  };
  var LUGAR_ROBOT = { patio: [304, 136], aula: [304, 251] };

  /* Lo que contestó cada uno el lunes, con el aviso de «si llueve».
     Cuatro miraron las nubes y dijeron que sí; cuatro miraron si caía
     agua y dijeron que no. */
  var LUNES = ['si', 'no', 'no', 'si', 'no', 'si', 'si', 'no'];

  var CAMISA = ['#e76f51', '#2a9d8f', '#e9c46a', '#8e7dbe', '#f4a261', '#457b9d', '#c2185b', '#6a994e'];
  var PIEL = ['#c68642', '#8d5524', '#e0ac69', '#a86b3c', '#d9a066', '#8d5524', '#c68642', '#e0ac69'];

  /* Cada tramo del camino dura lo que dura .am-viaja. */
  var TRAMO = 800, ENTRE = 320;

  var RS = {
    dia: { es: 'Lunes', en: 'Monday' },
    otroDia: { es: 'Otro día', en: 'Another day' },
    avisoTit: { es: 'Aviso del maestro', en: 'Teacher’s notice' },
    avisoA: { es: ['Si llueve,', 'Educación Física', 'va adentro.'], en: ['If it rains,', 'P.E. is held', 'indoors.'] },
    avisoB: { es: ['Si caen gotas,', 'Educación Física', 'va adentro.'], en: ['If drops fall,', 'P.E. is held', 'indoors.'] },
    pregA: { es: '¿Llueve?', en: 'Is it raining?' },
    pregB: { es: '¿Caen gotas?', en: 'Do drops fall?' },
    si: { es: 'sí', en: 'yes' },
    no: { es: 'no', en: 'no' },
    patio: { es: 'patio', en: 'yard' },
    aula: { es: 'aula', en: 'classroom' },
    gotas0: { es: '0 gotas', en: '0 drops' },
    gotas3: { es: '3 gotas', en: '3 drops' }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Una nube: tres bolas y una base. */
  function nube(A, padre, x, y, s, clase) {
    var g = A.el('g', { 'class': clase }, padre);
    A.el('ellipse', { cx: x, cy: y + 4 * s, rx: 20 * s, ry: 7 * s }, g);
    A.el('circle', { cx: x - 9 * s, cy: y + 1 * s, r: 8 * s }, g);
    A.el('circle', { cx: x + 2 * s, cy: y - 3 * s, r: 10 * s }, g);
    A.el('circle', { cx: x + 12 * s, cy: y + 2 * s, r: 7 * s }, g);
    return g;
  }

  /* Un alumno de pie, con los pies en (0, 0), y su respuesta encima, en
     letra que se lee en un teléfono: 9 del dibujo. */
  function alumno(A, padre, i) {
    var g = A.el('g', { 'data-alumno': i + 1 }, padre);
    A.el('rect', { x: -3.6, y: -7, width: 7.2, height: 7, rx: 1.2, 'class': 'dc-pantalon' }, g);
    A.el('rect', { x: -5.5, y: -17, width: 11, height: 10.5, rx: 2.4, fill: CAMISA[i], 'class': 'dc-camisa' }, g);
    A.el('circle', { cx: 0, cy: -21.8, r: 4.6, fill: PIEL[i], 'class': 'dc-cara' }, g);
    A.el('path', { d: 'M-4.6 -22.4 Q-4.6 -27.4 0 -27.4 Q4.6 -27.4 4.6 -22.4 Q2.3 -25 0 -24.6 Q-2.3 -25 -4.6 -22.4 Z', 'class': 'dc-pelo' }, g);
    var tag = A.el('g', { 'data-respuesta': '' }, g);
    A.el('rect', { x: -10, y: -40, width: 20, height: 11, rx: 3, 'class': 'dc-etiqueta' }, tag);
    var t = texto(A, tag, 0, -31.6, 'dc-etiqueta-txt', 9, 'middle', '');
    return { g: g, tag: tag, txt: t };
  }

  /* El robot, visto de lado: ruedas, cuerpo, cabeza y antena. */
  function robot(A, padre) {
    var g = A.el('g', { 'data-robot': '' }, padre);
    A.el('circle', { cx: -4.4, cy: -2.8, r: 2.8, 'class': 'dc-rueda' }, g);
    A.el('circle', { cx: 4.4, cy: -2.8, r: 2.8, 'class': 'dc-rueda' }, g);
    A.el('rect', { x: -7.5, y: -17, width: 15, height: 12, rx: 2.6, 'class': 'dc-robot' }, g);
    A.el('rect', { x: -6, y: -27, width: 12, height: 9, rx: 2.2, 'class': 'dc-robot' }, g);
    A.el('circle', { cx: -2.4, cy: -22.5, r: 1.4, 'class': 'dc-ojo' }, g);
    A.el('circle', { cx: 2.4, cy: -22.5, r: 1.4, 'class': 'dc-ojo' }, g);
    A.el('path', { d: 'M0 -27 V-31', 'class': 'dc-antena' }, g);
    A.el('circle', { cx: 0, cy: -32.5, r: 1.7, 'class': 'dc-antena-bola' }, g);
    var tag = A.el('g', { 'data-respuesta': '' }, g);
    A.el('rect', { x: -10, y: -48, width: 20, height: 11, rx: 3, 'class': 'dc-etiqueta' }, tag);
    var t = texto(A, tag, 0, -39.6, 'dc-etiqueta-txt', 9, 'middle', '');
    return { g: g, tag: tag, txt: t };
  }

  /* Quien camina (un alumno o el robot) lleva tres tramos, uno dentro del
     otro: de su lugar en la fila al cruce, del cruce a la entrada del
     sitio por el camino de su respuesta, y de la entrada a su lugar. Cada
     tramo se mueve cuando acabó el anterior. */
  function caminante(A, padre, x, y, dato, alto) {
    var base = A.el('g', { 'data-caminante': dato }, padre);
    A.mover(base, x, y, 0, 1, 0);
    /* El que se para antes del cruce lleva un tramo más, por fuera de
       los otros tres: de donde sale hasta donde se para. */
    var ante = alto ? A.el('g', { 'class': 'am-viaja', 'data-alto': '' }, base) : null;
    var t1 = A.el('g', { 'class': 'am-viaja', 'data-tramo': 1 }, ante || base);
    var t2 = A.el('g', { 'class': 'am-viaja', 'data-tramo': 2 }, t1);
    var t3 = A.el('g', { 'class': 'am-viaja', 'data-tramo': 3 }, t2);
    if (alto) return { base: base, x: alto.x, y: alto.y, alto: ante, altoV: [alto.x - x, alto.y - y], t: [t1, t2, t3], cuerpo: t3 };
    return { base: base, x: x, y: y, t: [t1, t2, t3], cuerpo: t3 };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el cielo ─────────────────────────────────────────── */
    P.nubesClaras = A.el('g', { 'data-nubes': 'claras' }, svg);
    P.nubesOscuras = A.el('g', { 'data-nubes': 'oscuras' }, svg);
    [[34, 20, 1], [118, 18, 1.15], [206, 21, 1.05], [284, 18, 0.95]].forEach(function (n) {
      nube(A, P.nubesClaras, n[0], n[1], n[2], 'dc-nube');
      nube(A, P.nubesOscuras, n[0], n[1], n[2], 'dc-nube-oscura');
    });
    /* el viento del lunes */
    P.viento = A.el('g', { 'data-viento': '' }, svg);
    [[60, 36], [158, 38], [236, 36]].forEach(function (v) {
      A.el('path', { d: 'M' + v[0] + ' ' + v[1] + ' q7 -3.5 14 0 t14 0 q5 -2.5 3 -6', 'class': 'dc-viento' }, P.viento);
      A.el('path', { d: 'M' + (v[0] + 6) + ' ' + (v[1] + 5) + ' q6 -3 12 0 t12 0', 'class': 'dc-viento' }, P.viento);
    });
    P.dia = texto(A, svg, 316, 40, 'am-rotulo', 9.5, 'end', '');
    P.otroDia = texto(A, svg, 316, 40, 'am-rotulo', 9.5, 'end', '');
    P.dia.setAttribute('data-dia', 'lunes');
    P.otroDia.setAttribute('data-dia', 'otro');

    /* ── el patio (al aire libre) ─────────────────────────── */
    A.el('rect', { x: PATIO.x0, y: PATIO.y0, width: PATIO.x1 - PATIO.x0, height: PATIO.y1 - PATIO.y0, rx: 6,
      'class': 'dc-patio', 'data-sitio': 'patio' }, svg);
    A.el('path', { d: 'M' + (PATIO.x0 + 6) + ' ' + ((PATIO.y0 + PATIO.y1) / 2 + 5) + ' H' + (PATIO.x1 - 6), 'class': 'dc-patio-raya' }, svg);

    /* ── la lluvia del otro día ───────────────────────────── */
    /* Detrás de todo lo demás: se ve en el aire y sobre el pasto, y lo
       tapan el aula, el aviso, el cruce y la gente, como tapa la lluvia
       lo que está delante. Una capa entera: se enciende de una vez.
       Y las gotas van en UN solo trazo, cada una su pedacito: son unas
       ciento setenta, y mientras la clase camina el teléfono repinta el
       dibujo en cada cuadro; ciento setenta trazos sueltos le costaban
       el cuadro más lento de la escena. */
    P.lluvia = A.el('g', { 'class': 'am-capa', 'data-lluvia': '' }, svg);
    var gotas = '';
    for (var fy = 0; fy < 10; fy++) {
      for (var fx = 0; fx < 18; fx++) {
        var gx = 8 + fx * 18 + (fy % 2) * 9, gy = 48 + fy * 21;
        if (gx > 314) continue;
        gotas += 'M' + gx + ' ' + gy + ' l-2 6 ';
      }
    }
    A.el('path', { d: gotas.trim(), 'class': 'dc-gota', 'data-gotas': '' }, P.lluvia);

    /* ── el aula (un edificio: bajo techo) ────────────────── */
    var aula = A.el('g', { 'data-sitio': 'aula' }, svg);
    A.el('rect', { x: AULA.x0, y: AULA.y0, width: AULA.x1 - AULA.x0, height: AULA.y1 - AULA.y0, 'class': 'dc-aula-fondo' }, aula);
    A.el('path', { d: 'M' + AULA.x0 + ' ' + AULA.y0 + ' V' + AULA.puerta[0] + ' M' + AULA.x0 + ' ' + AULA.puerta[1] + ' V' + AULA.y1 +
      ' H' + AULA.x1 + ' V' + AULA.y0, 'class': 'dc-aula-pared' }, aula);
    A.el('path', { d: 'M182 ' + AULA.y0 + ' L250 ' + AULA.techo + ' L318 ' + AULA.y0 + ' Z', 'class': 'dc-techo' }, aula);
    P.rotAula = texto(A, aula, 250, 165.5, 'dc-techo-txt', 8.5, 'middle', '');
    P.rotAula.setAttribute('data-rotulo', 'aula');
    P.rotPatio = texto(A, svg, 180, 60, 'am-rotulo', 9.5, 'end', '');
    P.rotPatio.setAttribute('data-rotulo', 'patio');

    /* ── los caminos ──────────────────────────────────────── */
    A.el('path', { d: 'M0 ' + CRUCE.y + ' L' + CRUCE.x + ' ' + CRUCE.y, 'class': 'dc-camino', 'data-camino': 'entrada' }, svg);
    A.el('path', { d: 'M' + CRUCE.x + ' ' + CRUCE.y + ' L' + ENTRA.patio.x + ' ' + ENTRA.patio.y, 'class': 'dc-camino', 'data-camino': 'no' }, svg);
    A.el('path', { d: 'M' + CRUCE.x + ' ' + CRUCE.y + ' L' + ENTRA.aula.x + ' ' + ENTRA.aula.y, 'class': 'dc-camino', 'data-camino': 'si' }, svg);
    /* la raya de cada camino: cortada si nadie lo toma, llena si alguien
       lo toma, con su punta a la entrada */
    P.guia = {}; P.activo = {};
    ['no', 'si'].forEach(function (k) {
      var e = k === 'no' ? ENTRA.patio : ENTRA.aula;
      P.guia[k] = A.el('path', { d: 'M' + CRUCE.x + ' ' + CRUCE.y + ' L' + e.x + ' ' + e.y, 'class': 'dc-guia', 'data-guia': k }, svg);
      var act = A.el('g', { 'data-activo': k }, svg);
      A.el('path', { d: 'M' + CRUCE.x + ' ' + CRUCE.y + ' L' + e.x + ' ' + e.y, 'class': 'dc-activo' }, act);
      var dx = e.x - CRUCE.x, dy = e.y - CRUCE.y, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var bx = e.x - ux * 7, by = e.y - uy * 7;
      A.el('path', { d: 'M' + (bx - uy * 4.5) + ' ' + (by + ux * 4.5) + ' L' + e.x + ' ' + e.y + ' L' + (bx + uy * 4.5) + ' ' + (by - ux * 4.5),
        'class': 'dc-activo-punta' }, act);
      P.activo[k] = act;
    });
    P.rotNo = texto(A, svg, 146, 117, 'am-rotulo', 10, 'middle', '');
    P.rotSi = texto(A, svg, 146, 196, 'am-rotulo', 10, 'middle', '');
    P.rotNo.setAttribute('data-rotulo-camino', 'no');
    P.rotSi.setAttribute('data-rotulo-camino', 'si');

    /* ── el cruce y su pregunta ───────────────────────────── */
    A.el('path', { d: 'M' + (CRUCE.x - ROMBO.ax) + ' ' + CRUCE.y + ' L' + CRUCE.x + ' ' + (CRUCE.y - ROMBO.ay) +
      ' L' + (CRUCE.x + ROMBO.ax) + ' ' + CRUCE.y + ' L' + CRUCE.x + ' ' + (CRUCE.y + ROMBO.ay) + ' Z', 'class': 'dc-rombo', 'data-rombo': '' }, svg);
    P.pregA = texto(A, svg, CRUCE.x, CRUCE.y + 3.4, 'dc-pregunta', 9.5, 'middle', '');
    P.pregB = texto(A, svg, CRUCE.x, CRUCE.y + 3.4, 'dc-pregunta', 9.5, 'middle', '');
    P.pregA.setAttribute('data-pregunta', 'a');
    P.pregB.setAttribute('data-pregunta', 'b');

    /* ── el vasito que cuenta las gotas ───────────────────── */
    P.vasito = A.el('g', { 'data-vasito': '' }, svg);
    A.el('path', { d: 'M84 84 V104', 'class': 'dc-poste' }, P.vasito);
    A.el('path', { d: 'M75 64 L93 64 L91 84 L77 84 Z', 'class': 'dc-vaso', 'data-vaso': '' }, P.vasito);
    P.gotasVaso = [];
    [[80, 79], [84, 73], [88, 79]].forEach(function (p, i) {
      P.gotasVaso.push(A.el('path', { d: 'M' + p[0] + ' ' + (p[1] - 3.2) + ' q2.4 3 0 4.8 q-2.4 -1.8 0 -4.8 Z', 'class': 'dc-gota-vaso', 'data-gota-vaso': i + 1 }, P.vasito));
    });
    P.gotas0 = texto(A, P.vasito, 98, 78, 'am-rotulo', 9.5, 'start', '');
    P.gotas3 = texto(A, P.vasito, 98, 78, 'am-rotulo', 9.5, 'start', '');
    P.gotas0.setAttribute('data-cuenta', '0');
    P.gotas3.setAttribute('data-cuenta', '3');

    /* ── el aviso del maestro ─────────────────────────────── */
    var aviso = A.el('g', { 'data-aviso': '' }, svg);
    A.el('rect', { x: 4, y: 200, width: 102, height: 52, rx: 4, 'class': 'dc-aviso' }, aviso);
    A.el('circle', { cx: 55, cy: 203.5, r: 2, 'class': 'dc-chincheta' }, aviso);
    P.avisoTit = texto(A, aviso, 55, 213.5, 'dc-aviso-tit', 8, 'middle', '');
    P.avisoA = A.el('g', { 'data-aviso-dice': 'a' }, aviso);
    P.avisoB = A.el('g', { 'data-aviso-dice': 'b' }, aviso);
    P.lineasA = []; P.lineasB = [];
    for (var l = 0; l < 3; l++) {
      P.lineasA.push(texto(A, P.avisoA, 55, 225.5 + l * 11.5, 'dc-aviso-txt', 9.5, 'middle', ''));
      P.lineasB.push(texto(A, P.avisoB, 55, 225.5 + l * 11.5, 'dc-aviso-txt', 9.5, 'middle', ''));
    }

    /* ── la clase y el robot ──────────────────────────────── */
    /* El robot va debajo de la clase: su lugar está al fondo, y para
       llegar pasa por detrás de los que ya están, no por encima. */
    P.robotVe = A.el('g', { 'data-robot-ve': '' }, svg);
    P.robot = caminante(A, P.robotVe, ROBOT_SALE.x, ROBOT_SALE.y, 'robot', PARADA);
    var r = robot(A, P.robot.cuerpo);
    P.robot.tag = r.tag; P.robot.txt = r.txt;
    P.alumnos = FILA.map(function (f, i) {
      var c = caminante(A, svg, f[0], f[1], 'alumno-' + (i + 1));
      var a = alumno(A, c.cuerpo, i);
      c.tag = a.tag; c.txt = a.txt; c.fig = a.g;
      return c;
    });
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.dia.textContent = RS.dia[lang];
    P.otroDia.textContent = RS.otroDia[lang];
    P.avisoTit.textContent = RS.avisoTit[lang];
    for (var i = 0; i < 3; i++) {
      P.lineasA[i].textContent = RS.avisoA[lang][i];
      P.lineasB[i].textContent = RS.avisoB[lang][i];
    }
    var tam = lang === 'en' ? 9 : 9.5;
    P.pregA.setAttribute('font-size', tam);
    P.pregB.setAttribute('font-size', tam);
    P.pregA.textContent = RS.pregA[lang];
    P.pregB.textContent = RS.pregB[lang];
    P.rotNo.textContent = RS.no[lang];
    P.rotSi.textContent = RS.si[lang];
    P.rotPatio.textContent = RS.patio[lang];
    P.rotAula.textContent = RS.aula[lang];
    P.gotas0.textContent = RS.gotas0[lang];
    P.gotas3.textContent = RS.gotas3[lang];
    P.alumnos.concat([P.robot]).forEach(function (c) {
      if (c.resp) c.txt.textContent = RS[c.resp][lang];
    });
  }

  /* ── dónde va cada uno ──────────────────────────────────── */

  /* Los tres tramos de alguien que sale de (x, y), pasa por el cruce, toma
     el camino de su respuesta y llega a su lugar. Para el robot, (x, y)
     es donde se para antes del cruce. */
  function tramos(c, sitio, lugar) {
    var e = ENTRA[sitio];
    return [[CRUCE.x - c.x, CRUCE.y - c.y], [e.x - CRUCE.x, e.y - CRUCE.y], [lugar[0] - e.x, lugar[1] - e.y]];
  }

  function aLaFila(A, c) {
    if (c.alto) A.mover(c.alto, 0, 0, 0, 1, 0);
    c.t.forEach(function (t) { A.mover(t, 0, 0, 0, 1, 0); });
    A.ver(c.tag, false, 0);
  }

  /* Quieto en su lugar, con su respuesta encima. */
  function enSuLugar(A, c, sitio, lugar, resp) {
    if (c.alto) A.mover(c.alto, c.altoV[0], c.altoV[1], 0, 1, 0);
    tramos(c, sitio, lugar).forEach(function (v, i) { A.mover(c.t[i], v[0], v[1], 0, 1, 0); });
    c.resp = resp;
    c.txt.textContent = RS[resp][lang];
    A.ver(c.tag, true, 0);
  }

  /* Camina desde la fila, empezando a los `d` ms: su respuesta aparece
     cuando llega al cruce, que es donde contesta. */
  function camina(A, c, sitio, lugar, resp, d) {
    tramos(c, sitio, lugar).forEach(function (v, i) { A.mover(c.t[i], v[0], v[1], 0, 1, d + i * TRAMO); });
    c.resp = resp;
    c.txt.textContent = RS[resp][lang];
    A.ver(c.tag, true, d + TRAMO);
  }

  /* El robot: llega hasta antes del cruce, mira el vasito, contesta y
     sigue por su camino, tramo por tramo. */
  function caminaRobot(A, sitio, resp, d, mira) {
    var c = P.robot, v = tramos(c, sitio, LUGAR_ROBOT[sitio]), llega = d + TRAMO, sigue = llega + mira + 400;
    A.mover(c.alto, c.altoV[0], c.altoV[1], 0, 1, d);
    c.resp = resp;
    c.txt.textContent = RS[resp][lang];
    A.ver(c.tag, true, llega + mira);
    v.forEach(function (w, i) { A.mover(c.t[i], w[0], w[1], 0, 1, sigue + i * TRAMO); });
    return { llega: llega, contesta: llega + mira };
  }

  function piezasDe(c) { return c.t.concat(c.alto ? [c.alto, c.tag] : [c.tag]); }
  function todos() { return P.alumnos.concat([P.robot]); }

  /* Pone de golpe, sin movimiento: así una caminata se vuelve a ver
     entera cada vez que se entra en su paso, también volviendo con
     «Atrás». */
  function deGolpe(A, lista, hazlo) {
    var piezas = [];
    lista.forEach(function (c) { piezas = piezas.concat(piezasDe(c)); });
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* El lunes con el aviso de «si llueve»: cada uno a su manera. */
  function lugaresDelLunes() {
    var n = { patio: 0, aula: 0 };
    return LUNES.map(function (resp) {
      var sitio = resp === 'si' ? 'aula' : 'patio';
      return { sitio: sitio, lugar: LUGARES[sitio][n[sitio]++], resp: resp };
    });
  }
  /* Todos contestan lo mismo, y todos van al mismo sitio. */
  function lugaresIguales(resp) {
    var sitio = resp === 'si' ? 'aula' : 'patio';
    return LUGARES[sitio].map(function (lugar) { return { sitio: sitio, lugar: lugar, resp: resp }; });
  }

  function claseQuieta(A, destinos) {
    P.alumnos.forEach(function (c, i) {
      if (destinos) enSuLugar(A, c, destinos[i].sitio, destinos[i].lugar, destinos[i].resp);
      else aLaFila(A, c);
    });
  }

  function claseCamina(A, destinos, desde) {
    deGolpe(A, P.alumnos, function () { P.alumnos.forEach(function (c) { aLaFila(A, c); }); });
    P.alumnos.forEach(function (c, i) {
      camina(A, c, destinos[i].sitio, destinos[i].lugar, destinos[i].resp, desde + i * ENTRE);
    });
  }

  function caminos(A, no, si, dNo, dSi) {
    A.ver(P.activo.no, no, no ? dNo : 0);
    A.ver(P.guia.no, !no, 0);
    A.ver(P.activo.si, si, si ? dSi : 0);
    A.ver(P.guia.si, !si, 0);
  }

  function cielo(A, llueve) {
    A.ver(P.lluvia, llueve, 0);
    A.ver(P.nubesOscuras, llueve, 0);
    A.ver(P.nubesClaras, !llueve, 0);
    A.ver(P.viento, !llueve, 0);
    A.ver(P.dia, !llueve, llueve ? 0 : 300);
    A.ver(P.otroDia, llueve, llueve ? 300 : 0);
  }

  function aviso(A, n) {
    var b = n >= 3;
    A.ver(P.avisoA, !b, b ? 0 : 300);
    A.ver(P.avisoB, b, b ? 300 : 0);
    A.ver(P.pregA, !b, b ? 0 : 300);
    A.ver(P.pregB, b, b ? 300 : 0);
  }

  function sinVasito(A) {
    var piezas = [P.vasito, P.gotas0];
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    A.ver(P.vasito, false, 0);
    A.ver(P.gotas0, false, 0);
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function vasito(A, n, dVe, dGotas) {
    A.ver(P.vasito, n >= 2, n >= 2 ? dVe : 0);
    var llueve = n >= 4;
    P.gotasVaso.forEach(function (g, i) { A.ver(g, llueve, llueve ? dGotas + i * 200 : 0); });
    A.ver(P.gotas0, n >= 2 && !llueve, !llueve ? dVe + 300 : 0);
    A.ver(P.gotas3, llueve, llueve ? dGotas + 600 : 0);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };

    cielo(A, n >= 4);
    aviso(A, n);
    A.ver(P.robotVe, n >= 2, 0);

    if (n === 0) {
      deGolpe(A, todos(), function () { claseQuieta(A, null); aLaFila(A, P.robot); });
      vasito(A, 0, 0, 0);
      caminos(A, false, false, 0, 0);
      return;
    }

    if (n === 1) {
      deGolpe(A, [P.robot], function () { aLaFila(A, P.robot); });
      vasito(A, 1, 0, 0);
      if (entra(1)) {
        claseCamina(A, lugaresDelLunes(), 300);
        caminos(A, true, true, 300 + ENTRE + TRAMO, 300 + TRAMO);
      } else {
        claseQuieta(A, lugaresDelLunes());
        caminos(A, true, true, 0, 0);
      }
      return;
    }

    if (n === 2) {
      /* la clase se queda como la dejó el lunes */
      if (antes !== 1) deGolpe(A, P.alumnos, function () { claseQuieta(A, lugaresDelLunes()); });
      if (entra(2)) {
        deGolpe(A, [P.robot], function () { aLaFila(A, P.robot); });
        /* Volviendo con «Atrás», el vasito ya estaba puesto: se quita de
           golpe, para que salga otra vez cuando el robot llega a mirarlo. */
        if (antes > 2) sinVasito(A);
        /* llega hasta antes del cruce, sale el vasito (cero gotas),
           contesta y sigue */
        var rb = caminaRobot(A, 'patio', 'no', 300, 900);
        vasito(A, 2, rb.llega, 0);
        caminos(A, true, false, rb.contesta + 200, 0);
      } else {
        enSuLugar(A, P.robot, 'patio', LUGAR_ROBOT.patio, 'no');
        vasito(A, 2, 0, 0);
        caminos(A, true, false, 0, 0);
      }
      return;
    }

    if (n === 3) {
      if (antes !== 2) deGolpe(A, [P.robot], function () { enSuLugar(A, P.robot, 'patio', LUGAR_ROBOT.patio, 'no'); });
      vasito(A, 3, 0, 0);
      if (entra(3)) {
        claseCamina(A, lugaresIguales('no'), 900);
        caminos(A, true, false, 900 + TRAMO, 0);
      } else {
        claseQuieta(A, lugaresIguales('no'));
        caminos(A, true, false, 0, 0);
      }
      return;
    }

    /* 4 y 5: el día de lluvia */
    if (entra(4)) {
      vasito(A, 4, 0, 500);
      claseCamina(A, lugaresIguales('si'), 1300);
      deGolpe(A, [P.robot], function () { aLaFila(A, P.robot); });
      caminaRobot(A, 'aula', 'si', 1300 + P.alumnos.length * ENTRE, 600);
      caminos(A, false, true, 0, 1300 + TRAMO);
      return;
    }
    if (n === 4 || (n === 5 && antes !== 4)) {
      deGolpe(A, todos(), function () {
        claseQuieta(A, lugaresIguales('si'));
        enSuLugar(A, P.robot, 'aula', LUGAR_ROBOT.aula, 'si');
      });
    }
    vasito(A, n, 0, 0);
    caminos(A, false, true, 0, 0);
  }

  var FRASES = {
    es: [
      'El aviso dice «si llueve». Hoy está nublado y hace viento, pero no cae ni una gota. ¿Por cuál camino se va la clase?',
      'Cada uno contestó a su manera: cuatro miraron las nubes y dijeron que sí; cuatro vieron que no caía agua. La clase quedó partida en dos.',
      'Para el robot, «llueve» quiere decir que caen gotas, y las cuenta en un vasito. No cae ninguna: contesta que no y va al patio, como siempre.',
      'El maestro cambia la pregunta por una que no se presta a dudas: «si caen gotas». Todos miran el vasito, contestan que no y la clase va junta al patio.',
      'Otro día sí caen gotas. Todos contestan que sí y van adentro: esta vez les toca el otro camino, y solo ese.',
      'Una pregunta que todos contestan igual lleva a todos al mismo lugar. Piensa en un aviso de tu escuela que se entienda de dos maneras y escríbelo con una pregunta de sí o no.'
    ],
    en: [
      'The notice says «if it rains». Today it is cloudy and windy, but not a single drop is falling. Which way does the class go?',
      'Each one answered in their own way: four looked at the clouds and said yes; four saw no water falling. The class ended up split in two.',
      'For the robot, «it rains» means drops are falling, and it counts them in a cup. None falls: it answers no and goes to the yard, as always.',
      'The teacher changes the question for one that leaves no doubt: «if drops fall». Everyone looks at the cup, answers no, and the class goes to the yard together.',
      'Another day, drops do fall. Everyone answers yes and goes indoors: this time the other path is theirs, and only that one.',
      'A question everyone answers the same way takes everyone to the same place. Think of a notice at your school that can be read two ways, and write it with a yes-or-no question.'
    ]
  };
  var BOTONES = {
    es: ['👣 Que salga la clase', '🤖 ¿Y el robot?', '✏️ Otra pregunta', '🌧️ Otro día', '📝 Tu turno', '↺ Empezar otra vez'],
    en: ['👣 Send the class out', '🤖 And the robot?', '✏️ New question', '🌧️ Another day', '📝 Your turn', '↺ Start over']
  };
  var MARCADOR = {
    es: [['0', 'gotas caen del cielo'], ['2', 'lugares para una sola clase'], ['0', 'gotas en el vasito'],
      ['1', 'lugar para toda la clase'], ['1', 'lugar, y esta vez es adentro'], ['1', 'pregunta clara, un solo lugar']],
    en: [['0', 'drops falling from the sky'], ['2', 'places for a single class'], ['0', 'drops in the cup'],
      ['1', 'place for the whole class'], ['1', 'place, and this time it is indoors'], ['1', 'clear question, a single place']]
  };

  AnimacionMision.montar('#amAviso', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'Una clase en fila frente a un cruce con una pregunta; un camino sube al patio y otro baja al aula. Arriba, el cielo; abajo, el aviso del maestro.',
      en: 'A class in line in front of a crossing with a question; one path goes up to the yard and another down to the classroom. Above, the sky; below, the teacher’s notice.'
    },
    pasos: 6,
    construir: construir,
    idioma: idioma,
    pintar: pintar,
    texto: function (n) { return FRASES[lang][n]; },
    boton: function (n) { return BOTONES[lang][n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[lang][n][0], palabras: MARCADOR[lang][n][1] }; }
  });
})();
