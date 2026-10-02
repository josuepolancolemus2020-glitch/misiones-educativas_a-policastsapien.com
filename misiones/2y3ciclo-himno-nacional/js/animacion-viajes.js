/* ============================================================
   Animación de «El Himno Nacional de Honduras» · el mapa de los viajes
   ------------------------------------------------------------
   La primera estrofa le habla a Honduras dormida junto a su mar, y un
   día «el audaz navegante te halló». La segunda dice de dónde venía: «de
   un país donde el sol se levanta, más allá del Atlante azulado», y
   termina con «un extraño pendón» flotando sobre la costa. Esta escena
   pone esas dos estrofas en un mapa:

     0  el Atlántico, con Honduras a la izquierda, dormida (z z z), y
        España a la derecha: ¿de qué lado viene el navegante?;
     1  desde Honduras, el sol sale por el oriente, y de ese lado está
        España: «un país donde el sol se levanta»;
     2  el primer viaje, en 1492: cruza el Atlante (así llama el Himno al
        Atlántico) y llega a unas islas del Caribe;
     3  el segundo y el tercero, en 1493 y 1498: las islas otra vez y la
        costa de Sudamérica. A Honduras, todavía no;
     4  el cuarto, en 1502: al llegar al sur de Jamaica la cámara baja al
        Caribe, y el barco llega a las Islas de la Bahía y a la costa norte de
        Honduras. Honduras despierta;
     5  sobre la costa ya flota «un extraño pendón»: la bandera de otro país;
     6  los cuatro viajes, de lejos, con sus años: el mapa para el cuaderno.

   Lo que pide el currículo es esto mismo: «Investigan acerca de los viajes
   de Cristóbal Colón y los representa en un mapa» (DCNB, II Ciclo,
   Ciencias Sociales de Cuarto Grado; la cita y su página están en
   js/data/viajes-colon.js, que es de donde salen los viajes).

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **Los viajes no se escriben aquí**: salen de js/data/viajes-colon.js
      (años, rutas y adónde llegó cada uno), y los contornos, de
      js/data/contornos-mundo.js, con el detalle de las islas y de Honduras
      que el mapa del mundo no dibuja. Si la escena y los datos dejan de
      decir lo mismo que himno.js (Colón llegó a Honduras «en 1502, en su
      cuarto viaje»), la escena NO se monta y queda la frase de reserva: un
      mapa que contradice la explicación de la estrofa enseña a no creerle a
      ninguno de los dos.
   2. ⚠️ **La letra tampoco se escribe aquí.** Lo que se cita del Himno («un
      país donde el sol se levanta», «Atlante», «un extraño pendón», «el
      audaz navegante») se saca de js/data/himno.js por estrofa, verso y
      palabra. verifica-himno busca en las cadenas de este archivo cualquier
      tirada de cuatro palabras del Himno y se pone roja si la encuentra.
   3. **El sol no se dibuja «sobre» España como si saliera de ahí.** Sale por
      el oriente, que en un mapa es la derecha, y España queda de ese lado.
      La frase lo dice así: «de ese lado está España».
   4. **La cámara baja para el cuarto viaje**, porque de lejos Honduras
      mide veinte píxeles y las Islas de la Bahía, uno. El barco y los
      números van dentro del mapa con una envoltura que se encoge mientras
      el mapa crece: así siguen la costa sin volverse enormes. Las rayas de
      las rutas se dibujan con su largo medido en el mapa (A.trazar), y por
      eso NO llevan vector-effect: con él, la raya se mediría en la
      pantalla y la ruta quedaría a medio dibujar al acercarse. Se
      adelgazan con una transición propia mientras el mapa crece.
      ⚠️ Y de cerca se pinta OTRA costa, la fina (centroamerica, en
      contornos-mundo.js): a cinco aumentos la del mapa del mundo deja a
      Honduras hecha un polígono de cinco lados. La fina lleva su propio mar
      y un recorte, se enciende cuando la cámara YA bajó y se apaga antes de
      que suba: si se viera a medio viaje, se vería la orilla del recorte.
   5. **El barco va de tramo en tramo, a paso parejo** (.am-viaja): una
      envoltura por tramo, cada una con su demora, y la estela de ese tramo
      se dibuja al mismo tiempo. Mira hacia donde navega: hacia el poniente
      casi siempre, y hacia el oriente por la costa de Honduras.
   6. **Nada se dice solo con color.** Cada ruta lleva su número en un
      círculo y su año en la leyenda; Honduras lleva su nombre; el pendón es
      una bandera sin escudo ni colores de ningún país (el Himno no dice
      cuál), con su nombre escrito.
   7. **El mapa es papel**: el mar, la tierra y las rutas son del mismo color
      en las dos pantallas; lo que va escrito encima lleva su halo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !window.CONTORNOS_MUNDO || !window.VIAJES_COLON || !document.getElementById('amViajes')) return;
  if (typeof HIMNO === 'undefined') return;

  var ANCHO = 320, ALTO = 150;
  var MUNDO = window.CONTORNOS_MUNDO, VIAJES = window.VIAJES_COLON;
  if (!MUNDO.detalle || !MUNDO.detalle.centroamerica || VIAJES.length !== 4) return;

  /* ── La proyección: equirectangular con su paralelo en 25° N ──
     Un grado de latitud mide lo mismo en todo el mapa (S), y uno de
     longitud, lo que mide a 25° N (S · cos 25°). En la franja del Atlántico
     que va de la costa de Honduras al norte de España es el mapa de siempre,
     y es el que la sonda puede rehacer con dos multiplicaciones. */
  var LON0 = -94, LAT_ARRIBA = 46, K = Math.cos(25 * Math.PI / 180), S = 3.6;
  function px(lon) { return (lon - LON0) * K * S; }
  function py(lat) { return (LAT_ARRIBA - lat) * S; }
  function pt(ll) { return [px(ll[0]), py(ll[1])]; }
  /* De cerca: la ventana que se ve cuando la cámara baja al Caribe, del
     golfo de Tehuantepec a Jamaica y del sur de Cuba a Nicaragua. A cinco
     aumentos Honduras ocupa un tercio del ancho: de lejos, la quinta parte
     de un dedo. */
  var ZOOM = 5, VENTANA = [px(-94.6), py(19.75)];
  var CA = MUNDO.detalle && MUNDO.detalle.centroamerica;
  /* Lo que cubre la costa fina: un poco más que la ventana, para que la
     orilla del recorte no se vea nunca. */
  var MARCO = { oeste: -95.4, este: -74.2, norte: 20.4, sur: 10.9 };
  function cerca(q) { return [(q[0] - VENTANA[0]) * ZOOM, (q[1] - VENTANA[1]) * ZOOM]; }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── Lo que se cita del Himno, de himno.js ── */
  function estrofa(c) { return HIMNO.filter(function (e) { return e.clave === c; })[0]; }
  function palabras(c, v, desde, hasta) {
    var e = estrofa(c);
    if (!e || !e.versos[v]) return '';
    return e.versos[v].split(' ').slice(desde, hasta).join(' ').replace(/^[¡¿«(]+/, '').replace(/[.,;:!?»)]+$/, '');
  }
  var C_PAIS = palabras('e2', 0, 1, 8);
  var C_ATLANTE = palabras('e2', 1, 3, 4);
  var C_PENDON = palabras('e2', 7, 2, 5);
  var C_NAVEGANTE = palabras('e1', 3, 0, 3);
  if (!C_PAIS || !C_ATLANTE || !C_PENDON || !C_NAVEGANTE) return;

  /* ⚠️ El mapa y la explicación de la primera estrofa dicen lo mismo, o
     no hay mapa. */
  var CUARTO = VIAJES[3], E1 = estrofa('e1');
  var ordenados = VIAJES.every(function (v, i) { return v.n === i + 1 && (i === 0 || v.anio > VIAJES[i - 1].anio); });
  var soloElCuarto = VIAJES.every(function (v) { return !!v.honduras === (v.n === 4); });
  if (!ordenados || !soloElCuarto || !E1 || E1.explicacion.indexOf(String(CUARTO.anio)) < 0 || !/cuarto viaje/.test(E1.explicacion)) return;
  var DIEZ = CUARTO.anio - VIAJES[0].anio;

  var COLOR = ['#b45309', '#7c3aed', '#be185d', '#dc2626'];

  /* ── Los tiempos de cada paso (ms) ── */
  var TRAMO = 800;          // lo que dura cada tramo de un viaje (.am-viaja)
  var D4 = 100;             // cuándo zarpa el cuarto viaje
  var PAUSA = 5;            // el tramo que espera a que la cámara baje: al sur de Jamaica
  var ZOOM_EN = D4 + 250 + PAUSA * TRAMO;   // cuándo baja la cámara: al llegar ahí
  var BAJADA = TRAMO + 50;  // lo que dura la bajada (y lo que espera el barco)
  /* El tramo que llega a la costa de Honduras (no a las islas): el primero
     que termina sobre la costa norte, entre el Motagua y el cabo. */
  var A_LA_COSTA = VIAJES[3].ruta.map(function (q, i) { return i > 0 && q[0] > -89 && q[0] < -83 && q[1] < 16.3 ? i - 1 : -1; })
    .filter(function (i) { return i >= 0; })[0];
  if (A_LA_COSTA == null) return;

  var P = { viajes: [] };

  function linea(A, padre, pts, clase, extra) {
    var d = pts.map(function (q, i) { return (i ? 'L' : 'M') + r2(q[0]) + ' ' + r2(q[1]); }).join(' ');
    var a = { d: d, 'class': clase };
    for (var k in extra) a[k] = extra[k];
    return A.el('path', a, padre);
  }
  function anillo(A, padre, c, clase, extra) {
    var pts = [];
    for (var i = 0; i < c.length; i += 2) pts.push(pt([c[i], c[i + 1]]));
    var n = linea(A, padre, pts, clase, extra);
    n.setAttribute('d', n.getAttribute('d') + ' Z');
    return n;
  }
  function texto(A, padre, x, y, clase, tam, ancla, contenido, extra) {
    var a = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'middle' };
    for (var k in extra) a[k] = extra[k];
    var n = A.el('text', a, padre);
    n.textContent = contenido;
    return n;
  }
  /* ¿Toca la caja de este anillo la franja del mapa? Lo que no la toca
     (Australia, Japón) no se dibuja: no se vería y costaría igual. */
  function seVe(c) {
    var x0 = 999, x1 = -999, y0 = 999, y1 = -999;
    for (var i = 0; i < c.length; i += 2) {
      x0 = Math.min(x0, c[i]); x1 = Math.max(x1, c[i]); y0 = Math.min(y0, c[i + 1]); y1 = Math.max(y1, c[i + 1]);
    }
    return x1 > -100 && x0 < 10 && y1 > 0 && y0 < 50;
  }

  /* El barco: una carabela vista de lado, con la proa hacia la izquierda.
     Flota sobre su origen (la línea del agua). */
  function barco(A, padre) {
    var g = A.el('g', { 'class': 'vj-barco' }, padre);
    A.el('path', { d: 'M-7.2 -2.6 Q-5.4 1 -3.6 1 L4.6 1 L6.4 -2.6 Z', 'class': 'vj-casco' }, g);
    A.el('path', { d: 'M-1.4 -2.6 L-1.4 -11 M2.6 -2.6 L2.6 -9.4', 'class': 'vj-mastil' }, g);
    A.el('path', { d: 'M-4.6 -10 Q-1.6 -11 1.4 -10 L1 -4 Q-1.6 -3.2 -4.2 -4 Z', 'class': 'vj-vela' }, g);
    A.el('path', { d: 'M0.9 -8.6 Q2.7 -9.3 4.6 -8.6 L4.3 -4.2 Q2.7 -3.6 1.2 -4.2 Z', 'class': 'vj-vela' }, g);
    A.el('path', { d: 'M-1.4 -11 L-4 -12 L-1.4 -12.8 Z', 'class': 'vj-banderin' }, g);
    return g;
  }

  /* Un círculo con su número, que no crece cuando la cámara se acerca. */
  function numero(A, padre, q, k) {
    var g = A.el('g', { 'data-numero': k + 1 }, padre);
    g.setAttribute('transform', 'translate(' + r2(q[0]) + ' ' + r2(q[1]) + ')');
    var contra = A.el('g', {}, g);
    A.el('circle', { r: 4.6, 'class': 'vj-num', style: 'fill:' + COLOR[k] }, contra);
    texto(A, contra, 0, 2.6, 'vj-num-txt', 6.5, 'middle', String(k + 1));
    return { g: g, contra: contra };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'vj-mar', 'data-mar': '' }, svg);

    /* ── El mapa (todo lo que crece cuando baja la cámara) ── */
    P.cam = A.el('g', { 'class': 'vj-cam', 'data-cam': '' }, svg);
    var reja = [];
    for (var la = 10; la <= 40; la += 10) reja.push('M0 ' + r2(py(la)) + ' L' + ANCHO + ' ' + r2(py(la)));
    for (var lo = -90; lo <= 0; lo += 10) reja.push('M' + r2(px(lo)) + ' 0 L' + r2(px(lo)) + ' ' + ALTO);
    A.el('path', { d: reja.join(' '), 'class': 'vj-reja' }, P.cam);
    var tierra = A.el('g', { 'data-tierra': '' }, P.cam);
    MUNDO.tierra.forEach(function (c) { if (seVe(c)) anillo(A, tierra, c, 'vj-tierra'); });
    MUNDO.detalle.islas.forEach(function (isla) { anillo(A, tierra, isla.anillo, 'vj-tierra vj-isla', { 'data-isla': isla.nombre }); });
    P.honduras = anillo(A, P.cam, MUNDO.detalle.honduras, 'vj-honduras', { 'data-honduras': '' });

    /* ── El Caribe de cerca: su propio mar, su reja y su costa fina, dentro
       de un recorte. Se enciende cuando la cámara ya bajó y se apaga antes
       de que suba: así nunca se ve la orilla del recorte. ── */
    var x0 = px(MARCO.oeste), x1 = px(MARCO.este), y0 = py(MARCO.norte), y1 = py(MARCO.sur);
    var defs = A.el('defs', {}, P.cam);
    var recorte = A.el('clipPath', { id: 'vjRecorteCerca' }, defs);
    A.el('rect', { x: r2(x0), y: r2(y0), width: r2(x1 - x0), height: r2(y1 - y0) }, recorte);
    P.mapaCerca = A.el('g', { 'data-mapa-cerca': '', 'clip-path': 'url(#vjRecorteCerca)' }, P.cam);
    A.el('rect', { x: r2(x0), y: r2(y0), width: r2(x1 - x0), height: r2(y1 - y0), 'class': 'vj-mar' }, P.mapaCerca);
    var rejaC = [];
    for (var laC = 15; laC <= 20; laC += 5) rejaC.push('M' + r2(x0) + ' ' + r2(py(laC)) + ' L' + r2(x1) + ' ' + r2(py(laC)));
    for (var loC = -95; loC <= -75; loC += 5) rejaC.push('M' + r2(px(loC)) + ' ' + r2(y0) + ' L' + r2(px(loC)) + ' ' + r2(y1));
    A.el('path', { d: rejaC.join(' '), 'class': 'vj-reja vj-reja-cerca' }, P.mapaCerca);
    anillo(A, P.mapaCerca, CA.tierra, 'vj-tierra vj-tierra-cerca', { 'data-tierra-cerca': '' });
    MUNDO.detalle.islas.forEach(function (isla) {
      if (isla.grupo === 'bahia' || isla.nombre === 'Jamaica') anillo(A, P.mapaCerca, isla.anillo, 'vj-tierra vj-tierra-cerca vj-isla', { 'data-isla-cerca': isla.nombre });
    });
    P.hondurasCerca = anillo(A, P.mapaCerca, CA.honduras, 'vj-honduras vj-honduras-cerca', { 'data-honduras-cerca': '' });

    /* ── Los cuatro viajes: la estela de cada tramo, el número y el barco ── */
    VIAJES.forEach(function (v, k) {
      var pts = v.ruta.map(pt);
      var V = { v: v, pts: pts, tramos: [], piernas: [] };
      var estela = A.el('g', { 'data-viaje': v.n, 'class': 'vj-estela', style: 'stroke:' + COLOR[k] }, P.cam);
      for (var i = 1; i < pts.length; i++) {
        V.tramos.push(linea(A, estela, [pts[i - 1], pts[i]], 'vj-ruta' + (v.honduras ? ' vj-ruta-hn' : ''), { 'data-tramo': i }));
      }
      V.estela = estela;
      if (v.sigue) {
        var fin = pts[pts.length - 1], s = pt(v.sigue);
        V.sigue = A.el('g', { 'data-sigue': '' }, estela);
        V.sigueTrazo = linea(A, V.sigue, [fin, s], 'vj-ruta vj-ruta-sigue');
        var ang = Math.atan2(s[1] - fin[1], s[0] - fin[0]);
        var punta = [-0.5, 0.5].map(function (d) { return [s[0] - 3 * Math.cos(ang + d), s[1] - 3 * Math.sin(ang + d)]; });
        linea(A, V.sigue, [punta[0], s, punta[1]], 'vj-ruta vj-ruta-sigue', { 'data-punta': '' });
      }
      /* El número va un poco antes de la llegada, sobre su propia ruta:
         el primero y el segundo llegan a La Española a dos grados uno del
         otro, y en la punta los dos círculos se montarían. */
      var ult0 = pts[pts.length - 2], ult1 = pts[pts.length - 1];
      var largo = Math.hypot(ult1[0] - ult0[0], ult1[1] - ult0[1]) || 1;
      V.numero = numero(A, estela, [ult1[0] - (ult1[0] - ult0[0]) / largo * 4.5, ult1[1] - (ult1[1] - ult0[1]) / largo * 4.5], k);

      /* el barco: dónde arranca, una envoltura por tramo, y dentro de la
         última, la que lo voltea y la que lo encoge. Lo que hizo después
         (`sigue`) es solo una flecha: el barco se queda en la costa, que es
         donde lo nombra el Himno */
      var base = A.el('g', { 'data-barco': v.n }, P.cam);
      base.setAttribute('transform', 'translate(' + r2(pts[0][0]) + ' ' + r2(pts[0][1]) + ')');
      V.aparece = A.el('g', {}, base);
      V.seVa = A.el('g', {}, V.aparece);
      var dentro = V.seVa;
      for (var j = 1; j < pts.length; j++) {
        var pierna = A.el('g', { 'class': 'am-viaja' }, dentro);
        V.piernas.push({ el: pierna, dx: pts[j][0] - pts[j - 1][0], dy: pts[j][1] - pts[j - 1][1] });
        dentro = pierna;
      }
      V.voltea = A.el('g', { 'class': 'vj-voltea' }, dentro);
      V.contra = A.el('g', {}, V.voltea);
      barco(A, V.contra);
      P.viajes.push(V);
    });

    /* ── Lo que se lee de LEJOS ── */
    var lejos = P.lejos = A.el('g', { 'data-vista': 'lejos' }, svg);
    var hn = pt([-86.5, 14.6]);
    P.zzz = A.el('g', { 'data-zzz': '' }, lejos);
    texto(A, P.zzz, hn[0] + 9, hn[1] - 7, 'vj-zzz', 5, 'start', 'z');
    texto(A, P.zzz, hn[0] + 13, hn[1] - 11, 'vj-zzz', 6, 'start', 'z');
    texto(A, P.zzz, hn[0] + 18, hn[1] - 16, 'vj-zzz', 7, 'start', 'z');
    linea(A, lejos, [[24, 81], [hn[0] - 1, hn[1] - 5]], 'vj-hilo');
    texto(A, lejos, 24, 78, 'vj-rotulo', 9, 'middle', 'Honduras', { 'data-rotulo': 'honduras' });
    texto(A, lejos, 296, 23, 'vj-rotulo', 9, 'middle', 'España', { 'data-rotulo': 'espana' });
    texto(A, lejos, 40, 24, 'vj-continente', 7.5, 'middle', 'AMÉRICA');
    texto(A, lejos, 288, 96, 'vj-continente', 7.5, 'middle', 'ÁFRICA');
    texto(A, lejos, 176, 50, 'vj-rotulo', 9, 'middle', 'océano Atlántico', { 'data-rotulo': 'oceano' });
    P.atlante = texto(A, lejos, 176, 61, 'vj-rotulo vj-cita', 9, 'middle', '«' + C_ATLANTE + '»', { 'data-rotulo': 'atlante' });

    /* la rosa de los vientos: el norte arriba y el oriente a la derecha */
    var rosa = P.rosa = A.el('g', { 'data-rosa': '' }, lejos);
    rosa.setAttribute('transform', 'translate(205 137)');
    A.el('path', { d: 'M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z', 'class': 'vj-rosa' }, rosa);
    texto(A, rosa, 0, -11, 'vj-rosa-txt', 6, 'middle', 'N');
    P.rosaE = texto(A, rosa, 13, 2, 'vj-rosa-txt', 6, 'middle', 'E', { 'data-este': '' });

    /* el oriente: de Honduras hacia el lado de España, y el sol que sale */
    var esp = pt([-5.5, 40.5]);
    P.oriente = A.el('g', { 'data-oriente': '' }, lejos);
    P.orienteTrazo = linea(A, P.oriente, [[hn[0] + 8, hn[1] - 2], [esp[0] - 14, esp[1] + 8]], 'vj-oriente');
    var ang = Math.atan2(esp[1] + 8 - (hn[1] - 2), esp[0] - 14 - (hn[0] + 8));
    var tip = [esp[0] - 14, esp[1] + 8];
    linea(A, P.oriente, [[tip[0] - 5 * Math.cos(ang - 0.45), tip[1] - 5 * Math.sin(ang - 0.45)], tip,
      [tip[0] - 5 * Math.cos(ang + 0.45), tip[1] - 5 * Math.sin(ang + 0.45)]], 'vj-oriente', { 'data-punta': '' });
    texto(A, P.oriente, 118, 91, 'vj-rotulo', 9, 'middle', 'oriente', { 'data-rotulo': 'oriente' });
    P.sol = A.el('g', { 'data-sol': '' }, lejos);
    P.sol.setAttribute('transform', 'translate(306 11)');
    P.solSube = A.el('g', {}, P.sol);
    var rayos = [];
    for (var a = 0; a < 360; a += 45) {
      var rr = a * Math.PI / 180;
      rayos.push('M' + r2(7.5 * Math.cos(rr)) + ' ' + r2(7.5 * Math.sin(rr)) + ' L' + r2(10.5 * Math.cos(rr)) + ' ' + r2(10.5 * Math.sin(rr)));
    }
    A.el('path', { d: rayos.join(' '), 'class': 'vj-rayo' }, P.solSube);
    A.el('circle', { r: 5.6, 'class': 'vj-sol' }, P.solSube);
    P.citaPais = A.el('g', { 'data-cita-pais': '' }, lejos);
    texto(A, P.citaPais, 276, 42, 'vj-rotulo vj-cita', 8, 'middle', '«' + C_PAIS.split(' ').slice(0, 3).join(' '));
    texto(A, P.citaPais, 276, 51, 'vj-rotulo vj-cita', 8, 'middle', C_PAIS.split(' ').slice(3).join(' ') + '»');

    /* el nombre que el Himno le da, para el último paso */
    var b4 = P.viajes[3].pts[P.viajes[3].pts.length - 1];
    P.navegante = A.el('g', { 'data-navegante': '' }, lejos);
    linea(A, P.navegante, [[70, 70], [b4[0] + 4, b4[1] - 5]], 'vj-hilo');
    texto(A, P.navegante, 72, 67, 'vj-rotulo vj-cita', 8.5, 'middle', '«' + C_NAVEGANTE + '»', { 'data-rotulo': 'navegante' });

    /* ── Lo que se lee de CERCA ── */
    var deCerca = P.cerca = A.el('g', { 'data-vista': 'cerca' }, svg);
    var hnC = cerca(pt([-86.6, 14.55]));
    texto(A, deCerca, hnC[0], hnC[1], 'vj-rotulo', 10, 'middle', 'Honduras', { 'data-rotulo': 'honduras-cerca' });
    P.zzzCerca = A.el('g', { 'data-zzz': 'cerca' }, deCerca);
    texto(A, P.zzzCerca, hnC[0] + 26, hnC[1] - 2, 'vj-zzz', 6, 'start', 'z');
    texto(A, P.zzzCerca, hnC[0] + 31, hnC[1] - 7, 'vj-zzz', 7.5, 'start', 'z');
    texto(A, P.zzzCerca, hnC[0] + 37, hnC[1] - 13, 'vj-zzz', 9, 'start', 'z');
    /* Las islas son de verdad delgadas (Roatán, de punta a punta, es veinte
       veces más larga que ancha), así que un aro de raya cortada dice dónde
       mirar, y su nombre va a la izquierda de Utila: arriba pasa el barco y
       sube el pendón. */
    var islaC = MUNDO.detalle.islas.filter(function (i) { return i.grupo === 'bahia'; }).map(function (i) {
      var sx = 0, sy = 0, m = i.anillo.length / 2;
      for (var q = 0; q < i.anillo.length; q += 2) { sx += i.anillo[q]; sy += i.anillo[q + 1]; }
      return cerca(pt([sx / m, sy / m]));
    });
    var oe = islaC[0], es = islaC[islaC.length - 1];
    var mitad = [(oe[0] + es[0]) / 2, (oe[1] + es[1]) / 2];
    var giroIslas = Math.atan2(es[1] - oe[1], es[0] - oe[0]) * 180 / Math.PI;
    P.aroIslas = A.el('ellipse', {
      cx: r2(mitad[0]), cy: r2(mitad[1]), rx: r2(Math.hypot(es[0] - oe[0], es[1] - oe[1]) / 2 + 5), ry: 5.5,
      transform: 'rotate(' + r2(giroIslas) + ' ' + r2(mitad[0]) + ' ' + r2(mitad[1]) + ')', 'class': 'vj-aro', 'data-aro-islas': ''
    }, deCerca);
    texto(A, deCerca, oe[0] - 8, oe[1] + 1, 'vj-rotulo', 8.5, 'end', 'Islas de la Bahía', { 'data-rotulo': 'bahia' });
    var ja = cerca(pt([-77.3, 18.6]));
    texto(A, deCerca, ja[0], ja[1], 'vj-rotulo vj-suave', 8, 'middle', 'Jamaica', { 'data-rotulo': 'jamaica' });
    var mar = cerca(pt([-80.5, 14.0]));
    texto(A, deCerca, mar[0], mar[1], 'vj-continente', 7.5, 'middle', 'MAR CARIBE');

    /* el pendón: un asta en la costa, y una bandera que sube por ella */
    var asta = cerca(pt([-85.95, 15.82]));
    P.pendon = A.el('g', { 'data-pendon': '' }, deCerca);
    P.pendon.setAttribute('transform', 'translate(' + r2(asta[0]) + ' ' + r2(asta[1]) + ')');
    A.el('path', { d: 'M0 0 L0 -26', 'class': 'vj-asta', 'data-asta': '' }, P.pendon);
    P.tela = A.el('g', { 'data-tela': '' }, P.pendon);
    A.el('path', { d: 'M0.6 -25.5 L15 -25.5 L11 -21.2 L15 -16.9 L0.6 -16.9 Z', 'class': 'vj-tela' }, P.tela);
    P.rotuloPendon = texto(A, P.pendon, 18, -30, 'vj-rotulo vj-cita', 9, 'start', '«' + C_PENDON + '»', { 'data-rotulo': 'pendon' });

    /* ── La leyenda: cada viaje, con su año ── */
    P.leyenda = [];
    VIAJES.forEach(function (v, k) {
      var x = 134 + k * 32.6;
      var g = A.el('g', { 'data-leyenda': v.n }, svg);
      A.el('rect', { x: x, y: 2.5, width: 30, height: 12.5, rx: 6, 'class': 'vj-chip' + (v.honduras ? ' vj-chip-hn' : '') }, g);
      A.el('circle', { cx: x + 6.6, cy: 8.75, r: 4, 'class': 'vj-num', style: 'fill:' + COLOR[k] }, g);
      texto(A, g, x + 6.6, 11.1, 'vj-num-txt', 6, 'middle', String(v.n));
      texto(A, g, x + 19.6, 11.6, 'vj-chip-txt', 7.6, 'middle', String(v.anio), { 'data-anio': v.anio });
      P.leyenda.push(g);
    });
  }

  /* ── Los estados ───────────────────────────────────────────── */
  function camara(A, deCerca, d) {
    A.mover(P.cam, deCerca ? -VENTANA[0] * ZOOM : 0, deCerca ? -VENTANA[1] * ZOOM : 0, 0, deCerca ? ZOOM : 1, d);
    /* Las rutas se adelgazan mientras el mapa crece (.vj-de-cerca, con la
       misma demora): sin eso, a cinco aumentos la del cuarto viaje sería
       una franja de un dedo encima de las islas que tiene que enseñar. */
    P.cam.style.setProperty('--dz', Math.round(d || 0) + 'ms');
    P.cam.classList.toggle('vj-de-cerca', !!deCerca);
    P.viajes.forEach(function (V) {
      /* el barco del cuarto viaje queda un poco más grande de cerca: la
         cámara se le acerca; los números, del mismo tamaño */
      A.mover(V.contra, 0, 0, 0, deCerca ? (V.v.honduras ? 1.5 : 1) / ZOOM : 1, d);
      A.mover(V.numero.contra, 0, 0, 0, deCerca ? 1 / ZOOM : 1, d);
    });
  }
  /* Voltear el barco es una sola orden por viaje (una pieza tiene UNA
     demora): mira al poniente al salir, y se voltea, si acaso, una vez. */
  function voltear(n, haciaElOriente, d) {
    n.style.setProperty('--d', Math.round(d || 0) + 'ms');
    n.style.transform = haciaElOriente ? 'scale(-1, 1)' : 'scale(1, 1)';
  }
  function alOriente(p) { return p.dx > 0.5; }
  /* Las rutas que no son la de Honduras se quedan tenues de cerca. */
  function tenue(V, si, d) {
    V.estela.style.setProperty('--d', Math.round(d || 0) + 'ms');
    V.estela.classList.toggle('vj-tenue', si);
  }

  /* Un viaje, hecho o por hacer, de golpe. */
  function viajeQuieto(A, V, hecho) {
    V.piernas.forEach(function (p) { A.mover(p.el, hecho ? p.dx : 0, hecho ? p.dy : 0, 0, 1, 0); });
    V.tramos.forEach(function (t) { A.trazar(t, hecho, 0); });
    if (V.sigue) { A.ver(V.sigue, hecho, 0); A.trazar(V.sigueTrazo, hecho, 0); }
    A.ver(V.numero.g, hecho, 0);
    /* De los tres primeros, el barco se va al llegar y queda su número. El
       del cuarto se queda en la costa: es el que el Himno nombra. */
    A.ver(V.aparece, hecho && V.v.honduras, 0);
    A.ver(V.seVa, true, 0);
    voltear(V.voltea, hecho && alOriente(V.piernas[V.piernas.length - 1]), 0);
  }

  /* Un viaje que se hace ahora: aparece en España, navega tramo por tramo
     dibujando su estela, y al llegar se va (o se queda, el cuarto). Desde el
     tramo `pausa` espera `espera` ms más: ahí baja la cámara. */
  function navegar(A, V, d0, pausa, espera) {
    A.ver(V.aparece, true, d0);
    var t = d0 + 250, oriente = false;
    V.piernas.forEach(function (p, i) {
      if (pausa != null && i === pausa) t += espera;
      A.mover(p.el, p.dx, p.dy, 0, 1, t);
      A.trazar(V.tramos[i], true, t);
      if (alOriente(p) !== oriente) { oriente = alOriente(p); voltear(V.voltea, oriente, t); }
      t += TRAMO;
    });
    if (V.sigue) {
      A.ver(V.sigue, true, t);
      A.trazar(V.sigueTrazo, true, t);
      t += TRAMO;
    }
    A.ver(V.numero.g, true, t);
    if (!V.v.honduras) A.ver(V.seVa, false, t);
    return t;
  }
  /* Cuándo LLEGA el barco al final del tramo i (para despertar a Honduras). */
  function llegaDelTramo(d0, i, pausa, espera) { return d0 + 250 + (i + 1) * TRAMO + (pausa != null && i >= pausa ? espera : 0); }

  /* Todo lo que no se mueve ahora, de golpe: sin transición si el paso
     llega con movimiento (si ya llega quieto, el aparato ya lo apagó). */
  function base(A, E) {
    var yaQuieto = A.quieto();
    if (!yaQuieto) A.svg.classList.add('am-quieto');
    camara(A, E.cerca, 0);
    P.viajes.forEach(function (V, k) { viajeQuieto(A, V, k < E.hechos); });
    lecturas(A, E, 0);
    A.asentar();
    if (!yaQuieto) A.svg.classList.remove('am-quieto');
  }
  function lecturas(A, E, d) {
    A.ver(P.lejos, !E.cerca, d);
    A.ver(P.cerca, E.cerca, d);
    A.ver(P.mapaCerca, E.cerca, d);
    A.ver(P.zzz, E.zzz, d);
    A.ver(P.zzzCerca, E.zzz, d);
    A.ver(P.oriente, E.oriente, d);
    A.trazar(P.orienteTrazo, E.oriente, d);
    A.ver(P.sol, E.oriente, d);
    A.mover(P.solSube, 0, E.oriente ? 0 : 9, 0, 1, d);
    A.ver(P.citaPais, E.oriente, d);
    A.ver(P.atlante, E.atlante, d);
    A.ver(P.navegante, E.navegante, d);
    A.ver(P.pendon, E.pendon, d);
    A.mover(P.tela, 0, E.pendon ? 0 : 9, 0, 1, d);
    A.ver(P.rotuloPendon, E.pendon, d);
    P.leyenda.forEach(function (g, k) { A.ver(g, k < E.hechos, d); });
    P.viajes.forEach(function (V) { tenue(V, E.cerca && !V.v.honduras, d); });
  }

  /* Al TERMINAR cada paso: cuántos viajes se ven hechos, si la cámara está
     de cerca, y qué se lee. */
  var ESTADOS = [
    { hechos: 0, cerca: false, zzz: true, oriente: false, atlante: false, pendon: false, navegante: false },
    { hechos: 0, cerca: false, zzz: true, oriente: true, atlante: false, pendon: false, navegante: false },
    { hechos: 1, cerca: false, zzz: true, oriente: false, atlante: true, pendon: false, navegante: false },
    { hechos: 3, cerca: false, zzz: true, oriente: false, atlante: true, pendon: false, navegante: false },
    { hechos: 4, cerca: true, zzz: false, oriente: false, atlante: false, pendon: false, navegante: false },
    { hechos: 4, cerca: true, zzz: false, oriente: false, atlante: false, pendon: true, navegante: false },
    { hechos: 4, cerca: false, zzz: false, oriente: false, atlante: true, pendon: false, navegante: true }
  ];

  function pintar(n, antes, A) {
    var E = ESTADOS[n];
    /* Cada paso se cuenta cada vez que se ENTRA en él, también volviendo
       con «Atrás»: arranca del estado del paso anterior y hace lo suyo. El
       primer pintado (antes === n) solo pone cada cosa en su sitio. */
    if (n === antes || n === 0) { base(A, E); return; }
    if (n === 1) {
      base(A, ESTADOS[0]);
      lecturas(A, E, 250);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      lecturas(A, ESTADOS[0], 0);
      var t2 = navegar(A, P.viajes[0], 300);
      A.ver(P.atlante, true, 1300);
      A.ver(P.leyenda[0], true, t2);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      var t3 = navegar(A, P.viajes[1], 100);
      A.ver(P.leyenda[1], true, t3);
      var t4 = navegar(A, P.viajes[2], t3 + 200);
      A.ver(P.leyenda[2], true, t4);
      return;
    }
    if (n === 4) {
      /* el cuarto viaje: la cámara baja al Caribe cuando el barco llega a
         La Española, y Honduras despierta cuando llega a su costa */
      base(A, ESTADOS[3]);
      var V4 = P.viajes[3];
      var tFin = navegar(A, V4, D4, PAUSA, BAJADA);
      camara(A, true, ZOOM_EN);
      A.ver(P.lejos, false, ZOOM_EN);
      /* la costa fina, cuando la cámara YA bajó: así no se ve su recorte */
      A.ver(P.mapaCerca, true, ZOOM_EN + TRAMO);
      A.ver(P.cerca, true, ZOOM_EN + TRAMO + 100);
      A.ver(P.zzzCerca, false, llegaDelTramo(D4, A_LA_COSTA, PAUSA, BAJADA));
      P.viajes.forEach(function (V) { if (!V.v.honduras) tenue(V, true, ZOOM_EN); });
      A.ver(P.leyenda[3], true, tFin);
      return;
    }
    if (n === 5) {
      base(A, ESTADOS[4]);
      A.ver(P.pendon, true, 0);
      A.mover(P.tela, 0, 0, 0, 1, 300);
      A.ver(P.rotuloPendon, true, 1000);
      return;
    }
    /* n === 6: la cámara se aleja y se ven los cuatro */
    base(A, ESTADOS[5]);
    lecturas(A, E, 1100);
    A.ver(P.cerca, false, 0);
    A.ver(P.pendon, false, 0);
    /* primero se apaga la costa fina, y después sube la cámara */
    A.ver(P.mapaCerca, false, 0);
    camara(A, false, 500);
  }

  var FRASES = [
    'La primera estrofa le habla a Honduras, dormida junto a su mar. Alguien viene de muy lejos a buscarla. ¿De qué lado del mapa?',
    'Desde Honduras, el sol sale por el oriente, y de ese lado está España: «' + C_PAIS + '».',
    'En ' + VIAJES[0].anio + ', Colón salió de España y cruzó el ' + C_ATLANTE + ', que así llama el Himno al océano Atlántico. Llegó a ' + VIAJES[0].llega + '.',
    'En ' + VIAJES[1].anio + ' volvió a ' + VIAJES[1].llega + ', y en ' + VIAJES[2].anio + ' llegó hasta ' + VIAJES[2].llega + '. A Honduras, todavía no.',
    'En ' + CUARTO.anio + ', en su cuarto viaje, llegó a ' + CUARTO.llega + '. Honduras despierta.',
    'Y la segunda estrofa termina así: sobre su cielo ya flotaba «' + C_PENDON + '», la bandera de otro país. Ahí empieza la conquista.',
    'El Himno nunca dice su nombre: lo llama «' + C_NAVEGANTE + '». Dibuja en tu cuaderno este mapa, con sus cuatro viajes y sus años.'
  ];
  var BOTONES = ['☀️ ¿De qué lado?', '⛵ El primer viaje', '⛵ Dos viajes más', '⛵ El cuarto viaje', '🏳️ ¿Y entonces?', '🗺️ Los cuatro', '↺ Empezar otra vez'];
  var MARCADOR = [
    { cifra: '?', palabras: '¿de qué lado viene el navegante?' },
    { cifra: 'Oriente', palabras: 'el lado de España, por donde sale el sol' },
    { cifra: String(VIAJES[0].anio), palabras: 'primer viaje: ' + VIAJES[0].llega },
    { cifra: String(VIAJES[2].anio), palabras: 'tres viajes, y ninguno a Honduras' },
    { cifra: String(CUARTO.anio), palabras: 'cuarto viaje: la costa de Honduras', salto: '+' + DIEZ + ' años' },
    { cifra: String(CUARTO.anio), palabras: 'y en la costa, una bandera ajena' },
    { cifra: String(VIAJES.length), palabras: 'viajes, y solo el cuarto llegó a Honduras' }
  ];

  AnimacionMision.montar('#amViajes', {
    vista: [ANCHO, ALTO],
    describe: 'Un mapa del océano Atlántico, con Honduras a la izquierda y España a la derecha. Del lado de España sale el sol. Colón cruza el océano cuatro veces, en ' +
      VIAJES.map(function (v) { return v.anio; }).join(', ') + '; solo el cuarto viaje llega a las Islas de la Bahía y a la costa de Honduras, y sobre la costa sube una bandera ajena.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n, antes) {
      var m = MARCADOR[n];
      return { cifra: m.cifra, palabras: m.palabras, salto: n !== antes ? m.salto : null };
    }
  });
})();
