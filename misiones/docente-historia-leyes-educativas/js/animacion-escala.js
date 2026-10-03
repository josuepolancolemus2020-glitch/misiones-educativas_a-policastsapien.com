/* ============================================================
   Animación de «Dos siglos de leyes educativas en Honduras»
   (misión del maestro, sección de la línea de tiempo)
   ------------------------------------------------------------
   Lo que enseña: lo que la lista de arriba no puede decir. Ahí los nueve
   momentos van a la misma distancia, uno debajo del otro, y parece que
   entre uno y otro pasó siempre lo mismo. A escala no: el país pasó sus
   primeros años sin escuela pública, y seis de las nueve fechas se
   amontonan al final. De cerca, cada norma rige desde su año hasta hoy, o
   hasta que otra la reemplaza; y hoy rigen cuatro a la vez el aula que el
   maestro abrió esta mañana. La que se cortó, la de 1966, rigió mucho más
   tiempo del que lleva la de hoy: por eso todavía se oye «primaria», y por
   eso a quien la escribe en un acta se la devuelven.

   De dónde sale: de los nueve hitos de la propia misión (HITOS, en
   js/historia-leyes-educativas.js), que su autor verificó contra La Gaceta
   y los portales del Estado. Ni un año escrito a mano: cada momento se
   busca por su nombre corto, y lo que la escena afirma se comprueba en el
   texto de su hito ANTES de montarse:
   - que la Ley Orgánica rige «hasta» el año de la Ley Fundamental, y que
     la Ley Fundamental «sustituye a la Ley Orgánica de» su año;
   - que la ley de Educación superior deja ese nivel «fuera de la
     Secretaría de Educación»: rige la universidad, no el aula;
   - que las que siguen rigiendo el aula son las cuatro que nombra la frase.
   Si la misión cambiara y algo dejara de ser verdad, la escena no se monta
   y queda la frase de reserva: la sonda lo dice antes de publicar. «Hoy» es
   el día del teléfono, y nunca antes de octubre de 2026.

   ⚠️ Las dos cuentas que dependen del día se hacen con FECHAS, no restando
   años, porque restando salían mal:
   - de la Independencia al Código hay 61 años de calendario, y 60 de verdad
     (del 15 de septiembre de 1821 al 12 de febrero de 1882): la misión dice
     «sesenta años después», y eso dice la escena. Las dos fechas son las del
     campo «sub» de cada hito;
   - «la de 1966 rigió el aula más de tres veces lo que lleva la de hoy» se
     afirma solo si es verdad del lado seguro: lo que rigió, como poco (los
     años enteros entre las dos), contra lo que lleva la de hoy, como mucho
     (desde el 1 de enero de su año hasta hoy). Hoy da 45 contra 14,75: más de
     tres veces. El 1 de enero de 2027 deja de poder afirmarse, y la frase
     pasa sola a «más del doble».

   ⚠️ Lo que NO se dice, y a propósito: cuántos años rigió la de 1966 (lo
   pregunta el quiz; aquí se ve en el largo de su barra), los números de
   decreto y de La Gaceta, los ciclos y los grados de la ley de hoy, cómo se
   llama hoy lo que antes era «primaria» (lo pregunta el simulacro, y es lo
   que el maestro anota al final), los tres adjetivos de 1882, los artículos
   de la Constitución, los capítulos de 1966 que siguen vigentes y ningún
   nombre de persona.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amEscala')) return;
  if (typeof HITOS === 'undefined' || !Array.isArray(HITOS)) return;

  var ANCHO = 320, ALTO = 300;

  /* ── lo que dice la misión ─────────────────────────────────── */
  var MOM = HITOS.map(function (h, i) { return { i: i, anio: +h.anio, corto: h.corto, h: h }; });
  if (MOM.length !== 9 || MOM.some(function (m, i) {
    return !/^\d{4}$/.test(String(m.h.anio)) || (i > 0 && m.anio <= MOM[i - 1].anio);
  })) return;
  function por(corto) { for (var i = 0; i < MOM.length; i++) if (MOM[i].corto === corto) return MOM[i]; return null; }
  var INDEP = por('Independencia'), CODIGO = por('Código de Instrucción'), ORG = por('Ley Orgánica'),
      LFE = por('Ley Fundamental'), SUP = por('Educación superior');
  if (!INDEP || !CODIGO || !ORG || !LFE || !SUP || MOM[0] !== INDEP || MOM[1] !== CODIGO) return;
  var finOrg = /hasta (\d{4})/.exec(ORG.h.txt);
  if (!finOrg || +finOrg[1] !== LFE.anio) return;
  if (LFE.h.txt.indexOf('sustituye a la Ley Orgánica de ' + ORG.anio) < 0) return;
  if (SUP.h.txt.indexOf('fuera de la Secretaría de Educación') < 0) return;
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fecha(h) {
    var f = /(\d{1,2}) de ([a-z]+) de (\d{4})/.exec(h.sub || '');
    return f && MESES.indexOf(f[2]) >= 0 && +f[3] === +h.anio ? new Date(+f[3], MESES.indexOf(f[2]), +f[1]) : null;
  }
  var ANIO_MS = 365.25 * 864e5;
  var fIndep = fecha(INDEP.h), fCodigo = fecha(CODIGO.h);
  if (!fIndep || !fCodigo) return;

  var A0 = INDEP.anio, Z0 = ORG.anio, CORTE = LFE.anio;
  var AHORA = Math.max(Date.now(), new Date(2026, 9, 1).getTime());
  var HOY = new Date(AHORA).getFullYear();
  /* De cerca: las que salieron desde la Ley Orgánica hasta hoy */
  var CERCA = MOM.filter(function (m) { return m.anio >= Z0; });
  /* Las que rigen hoy el aula: las de cerca, menos la que se cortó y la de
     la universidad. La frase las nombra, así que tienen que ser esas. */
  var AULA = CERCA.filter(function (m) { return m !== ORG && m !== SUP; });
  if (AULA.map(function (m) { return m.corto; }).join('|') !== 'Constitución|Código de la Niñez|Estatuto del Docente|Ley Fundamental') return;
  /* Los años enteros entre la Independencia y el Código: 60, lo que dice la
     misión («llegó sesenta años después») */
  var SIN_ESCUELA = Math.floor((fCodigo - fIndep) / ANIO_MS);
  var ULTIMOS = HOY - Z0;
  var LLEVA = HOY - CORTE;
  /* Cuántas veces cabe lo que lleva la de hoy en lo que rigió la de 1966,
     del lado seguro: lo que rigió, como poco, son los años enteros entre las
     dos; lo que lleva la de hoy, como mucho, va desde el 1 de enero de su año */
  var RIGIO_MIN = CORTE - Z0 - 1, LLEVA_MAX = (AHORA - new Date(CORTE, 0, 1).getTime()) / ANIO_MS;
  var VECES = 0;
  while ((VECES + 1) * LLEVA_MAX < RIGIO_MIN) VECES++;
  if (VECES < 1) return;
  var PALABRA = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  var CUANTO = VECES >= 3 ? 'más de ' + (PALABRA[VECES] || String(VECES)) + ' veces lo que lleva la de hoy'
    : VECES === 2 ? 'más del doble de lo que lleva la de hoy' : 'más tiempo del que lleva la de hoy';
  var NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* La regla de arriba, de la Independencia a hoy. Los años van ENCIMA: las
     fichas llegan desde abajo, y con los años debajo les pasaban por encima. */
  var R = { x0: 16, x1: 304, eje: 40, tick: 3.5, siglo: 6.5, anio: 31, tam: 9.5, rotulo: 14 };
  function xa(a) { return R.x0 + (a - A0) * (R.x1 - R.x0) / (HOY - A0); }
  /* Lo que la regla dice debajo, una llave a cada lado: la de los primeros
     años, a la izquierda, y la de las que se amontonan, a la derecha */
  var HUECO = { y0: 52, y1: 55, dice: 67, sub: 79 };
  var MONTON = { y0: 52, y1: 55, dice: 67 };
  /* La lista, como la de arriba: cada momento en su renglón, el nombre a la
     izquierda y el año en su ficha a la derecha */
  var LISTA = { y0: 108, paso: 19.5, nombre: 20, chip: 171, ancho: 38, alto: 15, tam: 11, tamAnio: 10.5,
    llave: 196, dice: 205 };
  function fila(i) { return LISTA.y0 + LISTA.paso * i; }
  /* Una ficha de la lista, sobre la regla, se vuelve un punto: esta escala */
  var PUNTO = 0.3;
  /* ⚠️ Y no vuela en diagonal desde su renglón: así pasaba por encima del año
     de los renglones de arriba (se leía «196[1989]»). Primero sale de lado,
     por su propio renglón, hasta este carril vacío; de ahí sube a la regla,
     por donde no hay nada escrito. */
  var CARRIL = 270;
  /* De cerca: el marco sobre la regla y el panel grande, con una barra por
     norma */
  var LUPA = { y0: 34, y1: 47, sale: 4 };
  var G = { x0: 8, x1: 312, y0: 92, y1: 248, titulo: 106, gx0: 110, gx1: 292, punta: 7, fila0: 122, paso: 19,
    grueso: 10, eje: 231, anio: 243, tam: 10.5 };
  function xg(a) { return G.gx0 + (a - Z0) * (G.gx1 - G.gx0) / (HOY - Z0); }
  function filaG(i) { return G.fila0 + G.paso * i; }
  /* La comparación de abajo: las dos barras, desde el mismo punto */
  var COMPARA = { y: [262, 282], rotulo: 105 };
  /* El acta y el cuaderno, en el sitio del panel */
  var ACTA = { x0: 16, x1: 154, y0: 98, y1: 244 };
  /* lo que miden en la Fredoka de 12, peso 600 (medido en el navegador) */
  var ACTA_LETRA = { sexto: 45.9, primaria: 45.67, espacio: 2.89 };
  var CUAD = { x0: 166, x1: 304, y0: 98, y1: 244 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var APAGA = 500;
  var T1 = { chip: 0, cada: 110, lado: 350, vuelo: 800 };
  T1.hueco = T1.chip + T1.cada * 8 + T1.lado + T1.vuelo + 150;
  T1.dice = T1.hueco + 350;
  var T2 = { lista: 0, regla: 600 };
  /* El tiempo corre de 1966 a hoy a paso parejo: tantos milisegundos por año */
  var POR_ANIO = 50;
  var T3 = { sale: 0, marco: APAGA, rayos: APAGA + 250, panel: APAGA + 500, corre: APAGA + 1100 };
  function enT3(a) { return T3.corre + (a - Z0) * POR_ANIO; }
  T3.fin = enT3(HOY);
  var T4 = { hoy: 0, rotulo: 300, uni: 700, aro: 1200, cada: 250 };
  var T5 = { copia: 0, mueve: 300, rotulo: 1200, palabra: 1500 };
  var T6 = { sale: 0, acta: APAGA, marca: APAGA + 500, sello: APAGA + 1000, cuaderno: APAGA + 1600 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Una raya que corre a paso parejo durante «ms»: la transición la pone la
     pieza, porque cada barra dura lo que dura su norma. «Reducir movimiento»
     y el primer pintado la apagan con !important, como todo lo demás. */
  function aPasoParejo(n, ms, que) {
    n.style.transition = (que || 'stroke-dashoffset') + ' ' + ms + 'ms linear var(--d, 0s), opacity .5s ease var(--d, 0s)';
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la regla de arriba ── */
    var gr = P.regla = A.el('g', { 'data-regla': '' }, svg);
    texto(A, gr, R.x0, R.rotulo, 'es-anio', 10, 'start', 'a escala, de ' + A0 + ' a hoy');
    A.el('path', { d: 'M' + R.x0 + ' ' + R.eje + ' L' + R.x1 + ' ' + R.eje, 'class': 'es-eje', 'data-eje': '' }, gr);
    var marcas = [];
    for (var d = Math.ceil(A0 / 10) * 10; d < HOY; d += 10) {
      var alto = d % 100 === 0 ? R.siglo : R.tick;
      marcas.push('M' + r2(xa(d)) + ' ' + R.eje + ' L' + r2(xa(d)) + ' ' + (R.eje + alto));
    }
    A.el('path', { d: marcas.join(' '), 'class': 'es-marca', 'data-decadas': '' }, gr);
    texto(A, gr, R.x0, R.anio, 'es-anio', R.tam, 'start', String(A0)).setAttribute('data-regla-anio', String(A0));
    for (d = Math.ceil(A0 / 100) * 100; d < HOY; d += 100) {
      texto(A, gr, xa(d), R.anio, 'es-anio', R.tam, 'middle', String(d)).setAttribute('data-regla-anio', String(d));
    }
    texto(A, gr, R.x1, R.anio, 'es-anio', R.tam, 'end', 'hoy').setAttribute('data-regla-anio', 'hoy');

    /* ── la llave de los primeros años, sin escuela pública ── */
    var gh = P.hueco = A.el('g', { 'data-hueco': '' }, svg);
    var hx0 = xa(A0), hx1 = xa(CODIGO.anio);
    A.el('path', { d: 'M' + r2(hx0) + ' ' + HUECO.y0 + ' L' + r2(hx0) + ' ' + HUECO.y1 + ' L' + r2(hx1) + ' ' + HUECO.y1 + ' L' + r2(hx1) + ' ' + HUECO.y0,
      'class': 'es-llave', 'data-llave': 'hueco' }, gh);
    texto(A, gh, hx1, R.anio, 'es-anio', R.tam, 'middle', String(CODIGO.anio)).setAttribute('data-regla-anio', String(CODIGO.anio));
    var hm = Math.max((hx0 + hx1) / 2, 50);
    texto(A, gh, hm, HUECO.dice, 'am-rotulo es-sec', 11, 'middle', SIN_ESCUELA + ' años').setAttribute('data-llave-dice', 'hueco');
    texto(A, gh, hm, HUECO.sub, 'am-rotulo', 9.5, 'middle', 'sin escuela pública').setAttribute('data-llave-sub', 'hueco');

    /* ── la llave de las que se amontonan, encima de la regla ── */
    var gm = P.monton = A.el('g', { 'data-monton': '' }, svg);
    var mx0 = xa(Z0), mx1 = xa(HOY);
    A.el('path', { d: 'M' + r2(mx0) + ' ' + MONTON.y0 + ' L' + r2(mx0) + ' ' + MONTON.y1 + ' L' + r2(mx1) + ' ' + MONTON.y1 + ' L' + r2(mx1) + ' ' + MONTON.y0,
      'class': 'es-llave', 'data-llave': 'monton' }, gm);
    texto(A, gm, (mx0 + mx1) / 2, MONTON.dice, 'am-rotulo es-sec', 9.5, 'middle', 'los últimos ' + ULTIMOS + ' años').setAttribute('data-llave-dice', 'monton');

    /* ── la lista ── */
    var gl = P.lista = A.el('g', { 'data-lista': '' }, svg);
    P.fantasma = [];
    MOM.forEach(function (m, i) {
      var y = fila(i);
      texto(A, gl, LISTA.nombre, y + 4, 'es-nombre', LISTA.tam, 'start', m.corto).setAttribute('data-nombre', String(m.anio));
      /* su sitio en la lista, cuando la ficha ya se fue a la regla */
      var f = A.el('g', { 'class': 'es-al-golpe', 'data-fantasma': String(m.anio) }, gl);
      A.el('rect', { x: LISTA.chip - LISTA.ancho / 2, y: y - LISTA.alto / 2, width: LISTA.ancho, height: LISTA.alto, rx: LISTA.alto / 2,
        'class': 'es-fantasma', 'data-fantasma-caja': '' }, f);
      texto(A, f, LISTA.chip, y + 3.8, 'es-fantasma-txt', LISTA.tamAnio, 'middle', String(m.anio));
      P.fantasma.push(f);
    });
    /* la llave de la lista: las mismas seis, que aquí ocupan dos tercios */
    var ly0 = fila(MOM.indexOf(ORG)) - LISTA.alto / 2 - 1, ly1 = fila(MOM.length - 1) + LISTA.alto / 2 + 1;
    P.llaveLista = A.el('g', { 'data-llave-lista': '' }, gl);
    A.el('path', { d: 'M' + (LISTA.llave - 4) + ' ' + r2(ly0) + ' L' + LISTA.llave + ' ' + r2(ly0) + ' L' + LISTA.llave + ' ' + r2(ly1) + ' L' + (LISTA.llave - 4) + ' ' + r2(ly1),
      'class': 'es-llave', 'data-llave': 'lista' }, P.llaveLista);
    texto(A, P.llaveLista, LISTA.dice, (ly0 + ly1) / 2 + 3.8, 'am-rotulo es-sec', 10.5, 'start', CERCA.length + ' de las ' + MOM.length).setAttribute('data-llave-dice', 'lista');

    /* ── las fichas: en la lista, y después puntos en la regla ── */
    var gc = A.el('g', { 'data-fichas': '' }, svg);
    /* los años de las fichas, quietos en su renglón y encima de las cápsulas */
    var gy;
    P.ficha = MOM.map(function (m, i) {
      /* dos sobres, uno por tramo: el de fuera la saca de lado y el de
         dentro la lleva a su año (una pieza tiene una sola demora) */
      var lado = A.el('g', { 'class': 'es-sale', 'data-ficha-sale': String(m.anio) }, gc);
      var f = A.el('g', { 'data-ficha': String(m.anio) }, lado);
      /* ⚠️ El año NO viaja: al salir la ficha, se queda en su renglón, en
         el sitio de raya cortada, y vuela solo la cápsula, que al subir se
         achica hasta el punto. Una letra que se mueve con su ficha se vuelve
         a colocar en cada cuadro, y con nueve en el aire un teléfono barato
         bajaba a 46 cuadros por segundo (sin ella, 58). Por eso el año se
         cambia DE GOLPE por el del sitio: en el mismo lugar y sin parpadear. */
      var caja = A.el('rect', { x: -LISTA.ancho / 2, y: -LISTA.alto / 2, width: LISTA.ancho, height: LISTA.alto, rx: LISTA.alto / 2,
        'class': 'es-chip es-cuerpo', 'data-ficha-caja': '' }, f);
      gy = gy || A.el('g', { 'data-fichas-anio': '' }, svg);
      var t = texto(A, gy, LISTA.chip, fila(i) + 3.8, 'es-chip-txt es-al-golpe', LISTA.tamAnio, 'middle', String(m.anio));
      t.setAttribute('data-ficha-anio', String(m.anio));
      /* en la regla es un punto lleno, con su borde del color de la tarjeta:
         dos que caen casi juntos se ven como dos */
      var punto = A.el('circle', { cx: 0, cy: 0, r: 10, 'class': 'es-punto', 'data-punto': String(m.anio) }, f);
      return { lado: lado, g: f, caja: caja, t: t, punto: punto, m: m };
    });

    /* ── de cerca: el marco sobre la regla, los rayos y el panel ── */
    var lx0 = xa(Z0) - LUPA.sale, lx1 = xa(HOY) + LUPA.sale;
    P.marco = A.el('rect', { x: r2(lx0), y: LUPA.y0, width: r2(lx1 - lx0), height: LUPA.y1 - LUPA.y0, rx: 3,
      'class': 'es-lupa', 'data-lupa-marco': '' }, svg);
    P.rayos = [[lx0, G.x0], [lx1, G.x1]].map(function (q) {
      return A.el('path', { d: 'M' + r2(q[0]) + ' ' + LUPA.y1 + ' L' + q[1] + ' ' + G.y0, 'class': 'es-rayo', 'data-lupa-raya': '' }, svg);
    });
    var gp = P.panel = A.el('g', { 'data-panel': '' }, svg);
    A.el('rect', { x: G.x0, y: G.y0, width: G.x1 - G.x0, height: G.y1 - G.y0, rx: 5, 'class': 'es-panel', 'data-panel-marco': '' }, gp);
    texto(A, gp, G.x0 + 8, G.titulo, 'es-anio', 9.5, 'start', 'de cerca: de ' + Z0 + ' a hoy');
    /* su regla, abajo */
    A.el('path', { d: 'M' + G.gx0 + ' ' + G.eje + ' L' + G.gx1 + ' ' + G.eje, 'class': 'es-eje', 'data-eje-cerca': '' }, gp);
    var mg = [];
    for (d = Z0; d <= HOY; d++) {
      if (d % 10 === 0 || d === Z0 || d === CORTE || d === HOY) mg.push('M' + r2(xg(d)) + ' ' + G.eje + ' L' + r2(xg(d)) + ' ' + (G.eje + 3.5));
    }
    A.el('path', { d: mg.join(' '), 'class': 'es-marca', 'data-decadas-cerca': '' }, gp);
    [Z0, 1980, 2000, CORTE].forEach(function (a) {
      if (a < Z0 || a > HOY) return;
      texto(A, gp, xg(a), G.anio, 'es-anio', 9.5, 'middle', String(a)).setAttribute('data-cerca-anio', String(a));
    });
    texto(A, gp, xg(HOY), G.anio, 'es-anio', 9.5, 'end', 'hoy').setAttribute('data-cerca-anio', 'hoy');
    /* la guía del año en que se cortó una, detrás de las barras */
    P.guia = A.el('path', { d: 'M' + r2(xg(CORTE)) + ' ' + (G.fila0 - 10) + ' L' + r2(xg(CORTE)) + ' ' + (G.eje - 2),
      'class': 'es-guia', 'data-guia': String(CORTE) }, gp);
    /* el tiempo que corre: una raya que va de 1966 a hoy a paso parejo. En
       el mismo paso aparece, corre y se va: son tres demoras, así que van en
       tres envolturas (una pieza tiene una sola) */
    P.cursorMueve = A.el('g', { 'class': 'am-viaja', 'data-cursor-mueve': '' }, gp);
    aPasoParejo(P.cursorMueve, (HOY - Z0) * POR_ANIO, 'transform');
    P.cursorSale = A.el('g', null, P.cursorMueve);
    P.cursor = A.el('path', { d: 'M' + r2(xg(Z0)) + ' ' + (G.fila0 - 10) + ' L' + r2(xg(Z0)) + ' ' + (G.eje - 2),
      'class': 'es-cursor', 'data-cursor': '' }, P.cursorSale);
    /* una fila por norma: su año y su nombre, y su barra desde su año */
    P.fila = {};
    CERCA.forEach(function (m, i) {
      var y = filaG(i), x0 = xg(m.anio), cortada = m === ORG, x1 = cortada ? xg(CORTE) : xg(HOY);
      var g = A.el('g', { 'data-fila': String(m.anio) }, gp);
      var t = A.el('text', { x: r2(x0 - 5), y: r2(y + 3.7), 'class': 'es-nombre', 'font-size': G.tam, 'text-anchor': 'end', 'data-fila-dice': '' }, g);
      var ta = A.el('tspan', { 'class': 'es-fila-anio' }, t); ta.textContent = String(m.anio) + ' ';
      var tn = A.el('tspan', null, t); tn.textContent = m.corto;
      var b = A.el('path', { d: 'M' + r2(x0) + ' ' + y + ' L' + r2(x1) + ' ' + y, 'class': 'es-barra', 'data-barra': String(m.anio),
        'data-desde': String(m.anio), 'data-hasta': cortada ? String(CORTE) : 'hoy' }, gp);
      aPasoParejo(b, ((cortada ? CORTE : HOY) - m.anio) * POR_ANIO);
      var o = { g: g, barra: b, m: m, y: y };
      if (cortada) {
        /* el corte: una raya atravesada al final de la barra */
        o.corte = A.el('path', { d: 'M' + r2(x1 - 2.5) + ' ' + (y + 7.5) + ' L' + r2(x1 + 2.5) + ' ' + (y - 7.5), 'class': 'es-corte', 'data-corte': String(CORTE) }, gp);
      } else {
        /* la punta: sigue rigiendo */
        o.punta = A.el('path', { d: 'M' + r2(x1) + ' ' + (y - G.grueso / 2) + ' L' + r2(x1 + G.punta) + ' ' + y + ' L' + r2(x1) + ' ' + (y + G.grueso / 2) + ' Z',
          'class': 'es-punta', 'data-punta': String(m.anio) }, gp);
      }
      if (m === SUP) {
        /* la de la universidad: hueca y con raya cortada, y lo dice */
        o.uni = A.el('g', { 'data-uni': '' }, gp);
        A.el('rect', { x: r2(x0), y: y - G.grueso / 2, width: r2(x1 - x0), height: G.grueso, 'class': 'es-uni', 'data-uni-caja': '' }, o.uni);
        texto(A, o.uni, (x0 + x1) / 2, y + 3.3, 'es-uni-txt', 9, 'middle', 'la universidad').setAttribute('data-uni-dice', '');
      }
      P.fila[m.anio] = o;
    });
    /* hoy: la raya del aula, y lo que cruza */
    P.hoy = A.el('g', { 'data-hoy': '' }, gp);
    A.el('path', { d: 'M' + r2(xg(HOY)) + ' ' + (G.fila0 - 10) + ' L' + r2(xg(HOY)) + ' ' + (G.eje - 2), 'class': 'es-hoy', 'data-hoy-raya': '' }, P.hoy);
    texto(A, P.hoy, G.x1 - 8, G.titulo, 'am-rotulo es-sec', 9.5, 'end', 'su aula, hoy').setAttribute('data-hoy-dice', '');
    P.aro = {};
    AULA.forEach(function (m) {
      var o = P.fila[m.anio];
      P.aro[m.anio] = A.el('circle', { cx: r2(xg(HOY) + G.punta / 2), cy: o.y, r: 8.5, 'class': 'es-aro', 'data-aro': String(m.anio) }, gp);
    });

    /* ── la comparación de abajo: las mismas dos barras, desde el mismo punto ── */
    var gk = P.compara = A.el('g', { 'data-compara': '' }, svg);
    var oOrg = P.fila[ORG.anio], oLfe = P.fila[LFE.anio];
    P.copia = {
      vieja: A.el('path', { d: 'M' + r2(xg(Z0)) + ' ' + oOrg.y + ' L' + r2(xg(CORTE)) + ' ' + oOrg.y, 'class': 'es-barra es-copia', 'data-copia': String(Z0) }, gk),
      hoy: A.el('path', { d: 'M' + r2(xg(CORTE)) + ' ' + oLfe.y + ' L' + r2(xg(HOY)) + ' ' + oLfe.y, 'class': 'es-barra es-copia', 'data-copia': String(CORTE) }, gk)
    };
    P.copiaDice = {
      vieja: texto(A, gk, COMPARA.rotulo, COMPARA.y[0] + 3.7, 'es-nombre', 10.5, 'end', 'la de ' + Z0),
      hoy: texto(A, gk, COMPARA.rotulo, COMPARA.y[1] + 3.7, 'es-nombre', 10.5, 'end', 'la de hoy')
    };
    P.copiaDice.vieja.setAttribute('data-copia-dice', String(Z0));
    P.copiaDice.hoy.setAttribute('data-copia-dice', String(CORTE));
    P.primaria = texto(A, gk, (xg(Z0) + xg(CORTE)) / 2, COMPARA.y[0] + 3.4, 'es-palabra', 9.5, 'middle', '«primaria»');
    P.primaria.setAttribute('data-palabra', '');

    /* ── el acta que devuelven ── */
    var ga = P.acta = A.el('g', { 'data-acta': '' }, svg);
    A.el('rect', { x: ACTA.x0, y: ACTA.y0, width: ACTA.x1 - ACTA.x0, height: ACTA.y1 - ACTA.y0, rx: 3, 'class': 'es-papel', 'data-acta-papel': '' }, ga);
    texto(A, ga, (ACTA.x0 + ACTA.x1) / 2, ACTA.y0 + 20, 'es-tinta', 11.5, 'middle', 'Acta de fin de año').setAttribute('data-acta-titulo', '');
    A.el('path', { d: 'M' + (ACTA.x0 + 10) + ' ' + (ACTA.y0 + 28) + ' L' + (ACTA.x1 - 10) + ' ' + (ACTA.y0 + 28), 'class': 'es-raya' }, ga);
    texto(A, ga, ACTA.x0 + 10, ACTA.y0 + 48, 'es-tinta-fina', 10, 'start', 'Grado:');
    /* «sexto de» y «primaria» van en dos piezas, con el ancho que miden en la
       Fredoka y un espacio entre las dos: así la raya de debajo marca justo la
       palabra vieja, llegue o no la letra a tiempo. Se SUBRAYA y no se encierra:
       con un espacio de por medio, un aro pisaría el «de» de al lado. */
    var linea = ACTA.y0 + 66, xs = ACTA.x0 + 10, xv = r2(xs + ACTA_LETRA.sexto + ACTA_LETRA.espacio);
    texto(A, ga, xs, linea, 'es-tinta', 12, 'start', 'sexto de').setAttribute('textLength', String(ACTA_LETRA.sexto));
    var vieja = texto(A, ga, xv, linea, 'es-tinta', 12, 'start', 'primaria');
    vieja.setAttribute('textLength', String(ACTA_LETRA.primaria));
    vieja.setAttribute('data-acta-vieja', '');
    P.marcaActa = A.el('path', { d: 'M' + xv + ' ' + (linea + 5) + ' L' + r2(xv + ACTA_LETRA.primaria) + ' ' + (linea + 5),
      'class': 'es-marca-acta', 'data-marca-acta': '' }, ga);
    ['M' + (ACTA.x0 + 10) + ' ' + (ACTA.y0 + 88) + ' L' + (ACTA.x1 - 14) + ' ' + (ACTA.y0 + 88),
     'M' + (ACTA.x0 + 10) + ' ' + (ACTA.y0 + 100) + ' L' + (ACTA.x1 - 40) + ' ' + (ACTA.y0 + 100),
     'M' + (ACTA.x0 + 10) + ' ' + (ACTA.y0 + 112) + ' L' + (ACTA.x1 - 24) + ' ' + (ACTA.y0 + 112)].forEach(function (dd) {
      A.el('path', { d: dd, 'class': 'es-renglon' }, ga);
    });
    /* el sello: llega de golpe, como llega un sello */
    P.sello = A.el('g', { 'data-sello': '' }, ga);
    var se = A.el('g', { transform: 'translate(' + ((ACTA.x0 + ACTA.x1) / 2) + ' ' + (ACTA.y0 + 112) + ')' }, P.sello);
    P.selloDentro = A.el('g', null, se);
    A.el('rect', { x: -42, y: -12, width: 84, height: 24, rx: 3, 'class': 'es-sello', 'data-sello-caja': '' }, P.selloDentro);
    texto(A, P.selloDentro, 0, 4.6, 'es-sello-txt', 13, 'middle', 'DEVUELTA').setAttribute('data-sello-dice', '');

    /* ── el cuaderno del maestro ── */
    var gq = P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUAD.x0, y: CUAD.y0, width: CUAD.x1 - CUAD.x0, height: CUAD.y1 - CUAD.y0, rx: 3, 'class': 'es-papel', 'data-cuaderno-papel': '' }, gq);
    texto(A, gq, (CUAD.x0 + CUAD.x1) / 2, CUAD.y0 + 20, 'es-tinta', 11.5, 'middle', 'En su cuaderno');
    [['Se oye en mi centro:', 52, 76], ['La ley de hoy dice:', 104, 128]].forEach(function (q) {
      texto(A, gq, CUAD.x0 + 10, CUAD.y0 + q[1], 'es-tinta-fina', 10, 'start', q[0]).setAttribute('data-cuaderno-dice', '');
      A.el('path', { d: 'M' + (CUAD.x0 + 10) + ' ' + (CUAD.y0 + q[2]) + ' L' + (CUAD.x1 - 10) + ' ' + (CUAD.y0 + q[2]),
        'class': 'es-raya', 'data-cuaderno-raya': '' }, gq);
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: dónde están las fichas, qué llaves hay y qué se
     ve de cerca. */
  var ESTADOS = [
    { fichas: 'lista', regla: true, lista: true, hueco: false, monton: false, cerca: false, hoy: false, copias: false, acta: false },
    { fichas: 'regla', regla: true, lista: true, hueco: true, monton: false, cerca: false, hoy: false, copias: false, acta: false },
    { fichas: 'regla', regla: true, lista: true, hueco: true, monton: true, cerca: false, hoy: false, copias: false, acta: false },
    { fichas: 'regla', regla: true, lista: false, hueco: false, monton: false, cerca: true, hoy: false, copias: false, acta: false },
    { fichas: 'regla', regla: true, lista: false, hueco: false, monton: false, cerca: true, hoy: true, copias: false, acta: false },
    { fichas: 'regla', regla: true, lista: false, hueco: false, monton: false, cerca: true, hoy: true, copias: true, acta: false },
    { fichas: 'regla', regla: true, lista: false, hueco: false, monton: false, cerca: false, hoy: true, copias: true, acta: true }
  ];
  function con(s, cambios) { var o = {}, k; for (k in s) o[k] = s[k]; for (k in cambios) o[k] = cambios[k]; return o; }

  /* En la regla, el sobre de fuera queda corrido al carril y el de dentro
     en su año, menos lo corrido: juntos, la ficha cae en su año. */
  function fichaEn(A, f, i, enRegla, dLado, dVuelo) {
    var dx = CARRIL - LISTA.chip;
    A.mover(f.lado, enRegla ? dx : 0, 0, 0, 1, dLado);
    if (enRegla) A.mover(f.g, xa(f.m.anio) - dx, R.eje, 0, PUNTO, dVuelo);
    else A.mover(f.g, LISTA.chip, fila(i), 0, 1, dVuelo);
    A.ver(f.caja, !enRegla, dVuelo);
    A.ver(f.t, !enRegla, dLado);
    A.ver(f.punto, enRegla, dVuelo);
  }
  function todo() {
    var l = [P.regla, P.hueco, P.monton, P.lista, P.llaveLista, P.marco, P.panel, P.cursorMueve, P.cursorSale, P.cursor, P.guia, P.hoy, P.compara,
      P.copia.vieja, P.copia.hoy, P.copiaDice.vieja, P.copiaDice.hoy, P.primaria, P.acta, P.marcaActa, P.sello, P.selloDentro, P.cuaderno]
      .concat(P.rayos).concat(P.fantasma);
    P.ficha.forEach(function (f) { l.push(f.lado, f.g, f.caja, f.t, f.punto); });
    Object.keys(P.fila).forEach(function (k) {
      var o = P.fila[k];
      [o.g, o.barra, o.corte, o.punta, o.uni].forEach(function (q) { if (q) l.push(q); });
    });
    Object.keys(P.aro).forEach(function (k) { l.push(P.aro[k]); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      P.ficha.forEach(function (f, i) { fichaEn(A, f, i, s.fichas === 'regla', 0, 0); });
      A.ver(P.regla, s.regla, 0);
      A.ver(P.lista, s.lista, 0);
      P.fantasma.forEach(function (f) { A.ver(f, s.fichas === 'regla', 0); });
      A.ver(P.llaveLista, s.monton, 0);
      A.ver(P.hueco, s.hueco, 0);
      A.ver(P.monton, s.monton, 0);
      A.ver(P.marco, s.cerca, 0);
      P.rayos.forEach(function (r) { A.ver(r, s.cerca, 0); });
      A.ver(P.panel, s.cerca, 0);
      Object.keys(P.fila).forEach(function (k) {
        var o = P.fila[k];
        A.ver(o.g, s.cerca, 0);
        A.ver(o.barra, s.cerca, 0);
        A.trazar(o.barra, s.cerca, 0);
        if (o.corte) A.ver(o.corte, s.cerca, 0);
        if (o.punta) A.ver(o.punta, s.cerca, 0);
        if (o.uni) A.ver(o.uni, s.cerca && s.hoy, 0);
      });
      /* la de la universidad, hueca desde que se mira hoy */
      A.ver(P.fila[SUP.anio].barra, s.cerca && !s.hoy, 0);
      A.ver(P.fila[SUP.anio].punta, s.cerca && !s.hoy, 0);
      A.ver(P.guia, s.cerca && !s.hoy, 0);
      A.mover(P.cursorMueve, s.cerca ? xg(HOY) - xg(Z0) : 0, 0, 0, 1, 0);
      A.ver(P.cursorSale, true, 0);
      A.ver(P.cursor, false, 0);
      A.ver(P.hoy, s.cerca && s.hoy, 0);
      Object.keys(P.aro).forEach(function (k) { A.ver(P.aro[k], s.cerca && s.hoy, 0); });
      A.ver(P.compara, s.copias, 0);
      A.mover(P.copia.vieja, 0, s.copias ? COMPARA.y[0] - P.fila[ORG.anio].y : 0, 0, 1, 0);
      A.mover(P.copia.hoy, s.copias ? xg(Z0) - xg(CORTE) : 0, s.copias ? COMPARA.y[1] - P.fila[LFE.anio].y : 0, 0, 1, 0);
      [P.copia.vieja, P.copia.hoy, P.copiaDice.vieja, P.copiaDice.hoy, P.primaria].forEach(function (q) { A.ver(q, s.copias, 0); });
      A.ver(P.acta, s.acta, 0);
      A.ver(P.marcaActa, s.acta, 0);
      A.ver(P.sello, s.acta, 0);
      /* el sello espera grande: llega achicándose, como cae un sello */
      A.mover(P.selloDentro, 0, 0, -10, s.acta ? 1 : 1.6, 0);
      A.ver(P.cuaderno, s.acta, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre, también en el
       primer pintado. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* cada ficha sale de lado de su renglón y sube a su año de la regla,
         una tras otra; donde estaba queda su sitio, de raya cortada */
      base(A, ESTADOS[0]);
      P.ficha.forEach(function (f, i) {
        var t = T1.chip + T1.cada * i;
        fichaEn(A, f, i, true, t, t + T1.lado);
        A.ver(P.fantasma[i], true, t);
      });
      A.ver(P.hueco, true, T1.hueco);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      A.ver(P.llaveLista, true, T2.lista);
      A.ver(P.monton, true, T2.regla);
      return;
    }
    if (n === 3) {
      /* se va la lista, y se mira de cerca: el tiempo corre de 1966 a hoy,
         y cada barra crece desde su año a paso parejo */
      base(A, antes === 2 ? ESTADOS[2] : con(ESTADOS[2], { monton: false }));
      A.ver(P.lista, false, T3.sale);
      A.ver(P.llaveLista, false, T3.sale);
      A.ver(P.hueco, false, T3.sale);
      A.ver(P.monton, false, T3.sale);
      A.ver(P.marco, true, T3.marco);
      P.rayos.forEach(function (r) { A.ver(r, true, T3.rayos); });
      A.ver(P.panel, true, T3.panel);
      A.ver(P.cursor, true, T3.corre - 300);
      A.mover(P.cursorMueve, xg(HOY) - xg(Z0), 0, 0, 1, T3.corre);
      A.ver(P.cursorSale, false, T3.fin + 200);
      CERCA.forEach(function (m) {
        var o = P.fila[m.anio], t = enT3(m.anio);
        A.ver(o.g, true, t);
        A.ver(o.barra, true, t);
        A.trazar(o.barra, true, t);
        if (o.punta) A.ver(o.punta, true, T3.fin);
      });
      /* el corte, cuando el tiempo llega al año de la que la reemplazó */
      A.ver(P.guia, true, enT3(CORTE));
      A.ver(P.fila[ORG.anio].corte, true, enT3(CORTE));
      return;
    }
    if (n === 4) {
      base(A, ESTADOS[3]);
      A.ver(P.guia, false, T4.hoy);
      A.ver(P.hoy, true, T4.hoy);
      A.ver(P.fila[SUP.anio].barra, false, T4.uni);
      A.ver(P.fila[SUP.anio].punta, false, T4.uni);
      A.ver(P.fila[SUP.anio].uni, true, T4.uni);
      AULA.forEach(function (m, i) { A.ver(P.aro[m.anio], true, T4.aro + T4.cada * i); });
      return;
    }
    if (n === 5) {
      /* las dos barras se copian y bajan, la de hoy debajo de la de 1966 y
         desde el mismo punto */
      base(A, ESTADOS[4]);
      A.ver(P.compara, true, T5.copia);
      A.ver(P.copia.vieja, true, T5.mueve);
      A.ver(P.copia.hoy, true, T5.mueve);
      A.mover(P.copia.vieja, 0, COMPARA.y[0] - P.fila[ORG.anio].y, 0, 1, T5.mueve);
      A.mover(P.copia.hoy, xg(Z0) - xg(CORTE), COMPARA.y[1] - P.fila[LFE.anio].y, 0, 1, T5.mueve);
      A.ver(P.copiaDice.vieja, true, T5.rotulo);
      A.ver(P.copiaDice.hoy, true, T5.rotulo);
      A.ver(P.primaria, true, T5.palabra);
      return;
    }
    /* el 6: se va lo de cerca y llegan el acta y el cuaderno */
    base(A, ESTADOS[5]);
    A.ver(P.marco, false, T6.sale);
    P.rayos.forEach(function (r) { A.ver(r, false, T6.sale); });
    A.ver(P.panel, false, T6.sale);
    A.ver(P.acta, true, T6.acta);
    A.ver(P.marcaActa, true, T6.marca);
    A.ver(P.sello, true, T6.sello);
    A.mover(P.selloDentro, 0, 0, -10, 1, T6.sello);
    A.ver(P.cuaderno, true, T6.cuaderno);
  }

  var FRASES = [
    'En la lista, los nueve van a la misma distancia, uno debajo del otro. ¿Pasó el mismo tiempo entre uno y otro?',
    'A escala, no. Entre la Independencia y el Código de ' + CODIGO.anio + ' pasan ' + SIN_ESCUELA + ' años: el país empezó sin escuela pública.',
    'Y al final se amontonan: ' + NUM[CERCA.length] + ' de las nueve caben en los últimos ' + ULTIMOS + ' años, desde ' + Z0 + '.',
    'De cerca, el tiempo corre de ' + Z0 + ' a hoy. Cada norma rige desde su año; la de ' + Z0 + ' dejó de regir el aula en ' + CORTE + ', cuando llegó la que rige hoy.',
    'Hoy, la raya de su aula cruza ' + NUM[AULA.length] + ' a la vez: la Constitución, el Código de la Niñez, el Estatuto y la Ley Fundamental. La de ' + SUP.anio + ' rige la universidad.',
    'La de ' + Z0 + ' rigió el aula ' + CUANTO + '. Por eso se sigue oyendo «primaria».',
    'Por eso, un acta que dice «sexto de primaria» se la devuelven. Anote una palabra vieja que se oiga en su centro, y cómo la dice la ley de hoy.'
  ];
  var BOTONES = ['📏 Ponerla a escala', '🔚 ¿Y al final?', '🔍 De cerca', '🏫 Su aula, hoy', '🗣️ ¿Y «primaria»?', '📄 El acta', '↺ Empezar otra vez'];
  var MARCADOR = [
    [String(MOM.length), 'momentos en la lista'],
    [String(SIN_ESCUELA), 'años sin escuela pública'],
    [String(CERCA.length), 'de nueve, en los últimos ' + ULTIMOS + ' años'],
    [String(CORTE), 'la de ' + Z0 + ' deja de regir el aula'],
    [String(AULA.length), 'normas rigen su aula a la vez'],
    [String(LLEVA), 'años lleva la de hoy'],
    ['?', 'cómo la dice la ley de hoy']
  ];

  AnimacionMision.montar('#amEscala', {
    vista: [ANCHO, ALTO],
    describe: 'Los nueve momentos de la lista, puestos a escala de ' + A0 + ' a hoy. Entre la Independencia y el Código de ' + CODIGO.anio +
      ' pasan ' + SIN_ESCUELA + ' años, y ' + NUM[CERCA.length] + ' de las nueve se amontonan desde ' + Z0 + '. De cerca, cada norma rige desde su año: la de ' + Z0 +
      ' dejó de regir el aula en ' + CORTE + ', y hoy rigen el aula la Constitución, el Código de la Niñez, el Estatuto y la Ley Fundamental. La de ' + Z0 +
      ' rigió mucho más tiempo que la de hoy, y por eso se sigue oyendo «primaria».',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
