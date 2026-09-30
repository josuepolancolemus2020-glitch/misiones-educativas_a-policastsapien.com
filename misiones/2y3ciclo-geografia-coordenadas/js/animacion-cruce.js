/* ============================================================
   M.E.T.A.S · Geografía y Coordenadas · Los dos números de un punto
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Nely: su casa «es la de la mata de mango, pasando el puente», y la
   noche que necesitó la ambulancia el chofer dio vueltas cuarenta
   minutos preguntando de casa en casa. La historia promete que
   cualquier punto de la Tierra tiene dos números que no dependen de
   ninguna mata de mango. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la aldea: pasando el puente hay TRES casas con mata de mango.
        ¿Cuál es la de doña Nely?
     1  el chofer pregunta en una, en otra… la tercera es la suya:
        cuarenta minutos;
     2  un punto lejos de la aldea, en el mapa del mundo. Su primer
        número se cuenta desde la línea del medio: 30° hacia arriba;
     3  el segundo, desde la línea de partida, que va de arriba abajo:
        105° hacia la izquierda;
     4  pero hacia abajo también hay 30°, y hacia la derecha, 105°: por
        eso cada número lleva la letra de su lado. 30° N, 105° O;
     5  un número sin el otro es una línea entera; los dos juntos se
        cruzan en un solo punto;
     6  por la casa de doña Nely también pasan sus dos líneas: con sus
        dos números, el chofer no habría tenido que preguntar.

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **El punto del mapa NO es Honduras, y a propósito.** La prueba
      de esta misión pregunta qué coordenadas pueden ser de un lugar de
      Honduras, si Honduras queda al norte o al sur, y la de pensamiento
      crítico trae un barco frente a La Ceiba: una animación que leyera
      los números de la aldea contestaría esas preguntas de memoria. El
      punto es otro, en otro país, con números que no salen en ninguna
      pregunta (30 y 105), y la aldea NUNCA se ubica en el mapa.
   2. ⚠️ **Y sus letras son la N y la O, las mismas de Honduras.** El
      alumno lee justo debajo, en la tarjeta que sigue, «15° N y 87° O»:
      con un ejemplo del mismo lado del mundo lo lee a la primera.
   3. ⚠️ **Lo que va en la prueba no se nombra.** Ni «ecuador» ni
      «Greenwich» (son los pareados), ni «paralelos», «meridianos»,
      «polos», «grados» u «oeste» (son respuestas del completar y de la
      selección múltiple), ni el 0°, 0°, ni el 90° ni el 180°. Las dos
      líneas de referencia se llaman como las llama la propia prueba
      cuando no quiere nombrarlas: «la línea del medio»; y la otra, «la
      línea de partida», que es lo que es. La tarjeta de abajo les pone
      el nombre.
   4. ⚠️ **La letra se entiende VIÉNDOLA faltar.** Un número sin letra
      son dos: hacia abajo también hay 30°, y hacia la derecha también
      hay 105°. Se dibujan con raya cortada y sin letra. No se marca
      nunca el punto con las dos letras cambiadas: eso se parece al
      antípoda, que la prueba de pensamiento crítico pide calcular (y no
      se calcula así).
   5. **Un número solo es una línea entera.** Es lo que la historia
      dice con la seña: «la de la mata de mango» le queda a tres casas.
      En el paso 5 cada número se vuelve su línea, de un borde al otro
      del mapa, y el único punto que está en las dos es el nuestro. En
      el 6 pasa lo mismo en la aldea: por la casa de doña Nely pasa una
      línea que toca también otras casas, y otra que toca otra; en las
      dos, solo la suya.
   6. **El mapa es un mapa de verdad.** Los contornos son simplificados
      pero están puestos con sus coordenadas, y el punto cae en tierra.
      Proyección de rejilla: cada grado mide lo mismo de ancho que de
      alto, y la red va de 15° en 15°, así que el punto está en un cruce
      y se puede contar.
   7. **Nada se dice solo con color.** La casa que no es lleva una ✗ y
      la que sí, una ✓; la duda, un «?» con el aro de raya cortada; lo
      que el número sin letra podría ser, raya cortada. El mapa, las
      casas y la ambulancia son dibujos y se quedan como son en las dos
      pantallas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCruce')) return;

  var ANCHO = 304, ALTO = 190, FIN = 6;

  /* ── El mapa: rejilla de 0,8 por grado, de −180 a 180 y de 90 a −90 ── */
  var MX = 8, MY = 23, K = 0.8;
  function gx(lon) { return MX + (lon + 180) * K; }
  function gy(lat) { return MY + (90 - lat) * K; }
  var Y_MEDIO = gy(0), X_PARTIDA = gx(0);      // 95 y 152
  var LAT = 30, LON = -105;                    // el punto: 30° N, 105° O
  var PX = gx(LON), PY = gy(LAT);              // 68 y 71
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Contornos simplificados, [longitud, latitud], puestos con sus
     coordenadas. No es un mapa para medir distancias: es para que el
     punto caiga donde dicen sus números. */
  var TIERRA = [
    [-168,65.6,-166,68.8,-162,70.3,-156.5,71.3,-152,70.8,-146,70.2,-141,69.6,-136,69.3,-133,69.6,-128,70.2,-122,69.8,-117,68.9,
      -112,68,-108,68.2,-104,68,-98,67.8,-95,68.5,-94,71.5,-89,69,-86,68.5,-83,69.5,-81,68.5,-82,66.5,-86,66,-88,64.2,-92.5,62.8,
      -94.5,60,-93,58.5,-90,57,-85,55.2,-82.3,52.8,-79.5,51.5,-78.8,54,-77,56.5,-77.8,58.5,-78,60.8,-77.5,62.3,-73,62,-70,61,
      -69.5,59,-66.5,58.7,-64.5,60.3,-62,57.5,-60,55.5,-57,54,-55.8,52.5,-57.2,51.4,-60,50.2,-64.5,50.2,-66.5,49.2,-64.5,48.8,
      -64.2,47.5,-61.5,45.8,-60,45.9,-64.3,44,-66,45,-67,44.6,-70,43.7,-70.7,42.4,-70,41.7,-71.5,41.4,-73.8,40.6,-74.2,39.4,
      -75.5,38.5,-76.3,37.2,-75.6,35.2,-77.5,34.3,-79,33.4,-81,31.8,-81.4,30,-80.5,28,-80.1,26.5,-80.4,25.2,-81.2,25.4,-81.8,26.7,
      -82.7,28.5,-83.5,29.8,-85,29.7,-86.5,30.4,-89,30.3,-89.4,29.2,-90.5,29.1,-92,29.6,-94,29.7,-95.8,28.6,-97.2,27.6,-97.5,26,
      -97.7,24.5,-97.8,22.5,-97.3,21,-96.2,19.2,-95,18.6,-94.3,18.2,-92.5,18.6,-91.3,18.6,-90.7,19.5,-90.4,21,-89,21.3,-87.3,21.5,
      -86.8,20.8,-87.5,19.5,-87.8,18.2,-88.3,17,-88.3,16,-87.5,15.8,-86.2,16,-85,16,-84,15.8,-83.2,15,-83.6,13.5,-83.8,12,
      -83.6,10.9,-83,10,-81.8,9,-80.5,9.2,-79.5,9.6,-78.2,9.3,-77.4,8.6,-77.9,7.2,-78.9,8.5,-79.5,8.9,-80.4,8.2,-80.4,7.3,-81.2,7.6,
      -81.8,8.2,-82.9,8.1,-83.6,8.5,-84.6,9.5,-85.6,9.9,-85.8,10.9,-86.8,12.2,-87.5,12.9,-88,13.2,-89.5,13.5,-90.7,13.9,-92.3,14.5,
      -93.5,15.6,-94.8,16.2,-96.5,15.7,-98.5,16.3,-99.9,16.8,-101.8,17.8,-103.5,18.3,-105,19.3,-105.6,20.5,-105.3,21.6,-105.7,22.5,
      -106.8,23.8,-108.3,25.2,-109.4,26,-110,27.1,-111.3,28.4,-112.4,29.6,-113.5,31.2,-114.8,31.8,-114.5,30.2,-113.4,28.8,
      -112.4,27.4,-111.7,26.3,-110.6,24.3,-109.9,22.9,-110.3,23.2,-111.8,24.5,-112.2,25.9,-113.5,26.8,-115.1,27.8,-114.1,28.1,
      -114.8,29.8,-115.8,30.4,-116.6,31.9,-117.2,32.6,-118.4,33.8,-120.6,34.6,-121.9,36.6,-122.5,37.8,-123.8,39.6,-124.4,40.4,
      -124.2,42,-124,44.5,-124,46.2,-124.7,48.4,-123.2,48.9,-125.5,50.2,-127.5,51,-128,52.5,-130.2,54.3,-131,55.5,-133.5,57.3,
      -135.5,58.5,-137.5,58.7,-140.3,59.8,-143.5,60,-146.5,60.8,-149.5,60.6,-151.5,59.3,-152.8,58.2,-154.2,57.3,-156.5,56.3,
      -158.8,55.6,-162,54.9,-164.8,54.5,-162,55.8,-159.5,57.3,-158,58.7,-161.5,58.6,-162.5,60,-164.8,60.6,-165.3,61.8,-166,63.2,
      -162.5,63.5,-161,64.4,-163.5,64.6,-166.2,64.6],
    [-73,78.2,-66,80.2,-60,81.8,-50,82.3,-40,83.4,-30,83.3,-22,82.3,-18,81.2,-17,79.5,-19,77,-18.5,75,-21.5,72.5,-22.5,70.5,
      -25,69.5,-30,68.2,-34,66.5,-38,65.6,-40,64.8,-42,62.5,-43.2,60.1,-45,60.5,-48,61.2,-50.5,62.8,-51.8,64.2,-53,66,-53.8,67.5,
      -52.5,69.2,-54.5,70.5,-55,71.8,-56.5,73.5,-58.5,75.3,-61.5,76.2,-66,76.5,-69.5,77.2],
    [-90,73,-86,73.8,-80,73.8,-76,72.6,-71.5,71,-68,70.2,-66,68.2,-62,66.8,-63,65,-64.8,63.2,-68,62.4,-70.8,62.8,-73.5,64,-76,64.2,
      -78,64.5,-78,66,-74,67.5,-73.5,68.5,-77,70,-82,70,-86,70.3,-89,71],
    [-90,81.5,-80,82.8,-70,82.8,-62,82.2,-65,81,-70,80,-76,78.6,-78,76.8,-82,76.3,-88,76.7,-90,78.5,-92,80.2],
    [-92,76.5,-82,76.2,-80,74.7,-86,74.5,-92,75],
    [-118.5,71.6,-114,73.3,-107,73.5,-104,72.3,-102,70.2,-104.8,68.8,-110,68.5,-114.5,69.3,-117.5,70],
    [-125.5,72,-122,74.4,-117.5,74.5,-115.5,73.5,-118.5,72.5,-121.5,71.5],
    [-59.4,47.6,-58.4,49.1,-57.1,51.5,-55.5,51.6,-55.8,49.8,-53.6,49.3,-52.7,47.6,-53.3,46.7,-55,47.1,-56.2,47.6],
    [-128.4,50.8,-125,50.3,-123.3,48.4,-124.8,48.6,-127.5,49.8],
    [-84.9,21.9,-83.5,22.9,-81.8,23.2,-79.6,23,-77.5,21.8,-75.7,21.1,-74.2,20.2,-75.9,19.9,-77.7,19.9,-78.8,21.6,-80.5,21.8,
      -82.5,22.2,-84.4,21.6],
    [-74.3,18.3,-72.3,19.9,-69.9,19.8,-68.4,18.6,-70.9,17.9,-72.8,18.1],
    [-77.4,8.6,-76.2,9.6,-75.5,10.5,-74.2,11.2,-73.2,11.3,-71.8,12.4,-71.2,11.7,-71.8,11,-71.4,10.2,-70.4,11.5,-69.8,12.2,
      -68.4,10.6,-66.4,10.6,-64.2,10.5,-62,10.8,-61.8,10,-60.8,8.5,-59.8,8.3,-58.5,7,-57,6,-55.2,6,-53.5,5.6,-52.2,4.9,-51.5,4.2,
      -51,3,-50,1.8,-50,0.5,-49,-0.2,-48.4,-1,-47,-0.8,-44.8,-1.6,-44.3,-2.6,-42,-2.8,-40,-2.8,-38.5,-3.7,-37.2,-4.8,-35.4,-5.2,
      -34.8,-7.1,-35.2,-8.8,-36.3,-10.3,-37.5,-11.8,-38.5,-13,-39,-14.8,-39.1,-17.4,-39.7,-19.6,-40.4,-20.6,-41,-21.9,-42,-23,
      -43.2,-22.9,-44.7,-23.4,-46.3,-24,-47.9,-25.2,-48.6,-26.5,-48.6,-28.2,-49.7,-29.2,-50.7,-30.7,-52,-32.1,-53.4,-33.7,
      -54.9,-34.9,-56.2,-34.9,-57.5,-34.4,-58.4,-34.3,-57.3,-35.8,-56.7,-36.4,-57.6,-38.1,-59.2,-38.7,-62.2,-38.8,-62.3,-40.6,
      -64.8,-40.7,-63.6,-42.2,-65,-42.8,-65.3,-44.8,-67.5,-46.1,-67.4,-47.9,-68.9,-49.5,-69.2,-51.6,-68.4,-52.3,-68.6,-53.6,
      -67,-54.9,-68.6,-55.3,-70.5,-55,-72.5,-53.6,-74.2,-52,-75.5,-49,-75.4,-46.8,-74.3,-44.2,-73.8,-42,-73.6,-40,-73.3,-37.2,
      -72.2,-35,-71.6,-33,-71.5,-30.3,-71.3,-28,-70.4,-25,-70.2,-21.5,-70.3,-18.4,-71.4,-17.6,-73.2,-16.6,-75.2,-15.2,-76.4,-13.2,
      -77.2,-12,-78.5,-9.5,-79.6,-7.5,-81.3,-5.5,-81,-4.2,-80.3,-3.4,-80.8,-2.2,-80.5,-0.8,-80.1,0.8,-78.9,1.7,-77.9,2.7,-77.2,4,
      -77.4,6,-77.9,7.2],
    [-9.5,38.8,-8.9,37,-7.4,37.2,-6.3,36.5,-5.6,36,-4.4,36.7,-2.1,36.7,-0.8,37.6,0.2,38.8,-0.3,39.5,0.9,40.8,2.2,41.4,3.2,42.2,
      3.1,43.1,4.8,43.4,6.2,43.1,7.5,43.8,8.9,44.4,10.1,44,10.5,42.9,12.2,41.7,13.5,41.2,14.3,40.6,15.6,40.1,16.1,38.9,15.7,38,
      16.6,38.5,17.1,39,16.5,39.8,17.2,40.4,18.4,39.8,18.5,40.6,16.9,41.1,15.9,41.9,14.2,42.4,13.6,43.6,12.4,44.8,12.3,45.4,13.7,45.6,
      13.6,45,14.4,45.3,15.9,43.5,18.1,42.6,19.4,41.8,19.4,40.4,20,39.6,20.7,38.8,21.3,37.7,21.7,36.8,22.5,36.4,23.2,36.4,23,37.9,
      23.7,37.9,24.1,38.2,22.9,39.4,22.6,40.4,23.8,40.2,24.4,40.9,26,40.8,26.4,40.2,26.2,39.5,26.8,38.4,27.3,37.2,28.2,36.7,29.6,36.2,
      30.6,36.8,32,36.5,33.8,36.2,34.7,36.8,36.2,36.6,35.9,35.8,35.9,34.9,35.5,33.9,35,32.8,34.5,31.6,33.8,31.1,32.3,31.3,32.6,30,
      33.2,28.9,34.3,27.7,34.9,29.5,35.7,27.3,38.1,24.1,39.2,21.5,40.8,19.2,42.6,16.9,42.95,14.8,43.4,12.6,45,12.8,49.1,14.5,
      52.2,15.6,54,16.9,55.4,17.6,56.8,18.4,57.8,19,58.8,20.4,59.8,22.5,58.6,23.6,56.7,24.4,56.4,25.7,56.4,26.4,55.3,25.3,54.4,24.4,
      52,24,51.3,24.5,51.6,25.3,51.2,26.1,50.8,25.5,50.1,26.4,49.5,27,48.4,28.4,48,29.4,48.5,29.9,50,30.2,50.8,28.9,52.5,27.5,
      54.5,26.6,56.3,27.2,57.8,25.6,60.6,25.3,62.3,25.1,64.5,25.2,66.9,24.8,67.5,23.8,68.5,23.2,70,22.6,68.97,22.24,69.6,21.6,
      70.9,20.7,72.15,21.76,72.83,21.17,72.8,19,73.3,17,73.8,15.5,74.6,13.5,74.9,12.9,75.8,11.2,76.3,9.9,77.5,8.1,78.2,8.8,
      79.87,10.29,79.8,11.9,80.3,13.1,81.2,15.9,82.3,16.7,83.3,17.7,84.9,19.3,85.8,19.8,86.6,20.3,87.5,21.6,88.8,21.7,89.8,22,
      90.6,22.8,91.8,22.3,92.3,20.8,93.9,19.4,94.2,16.05,95.3,15.8,96.2,16.8,97.6,16.5,98.2,14.1,98.6,12.4,98.6,9.96,98.4,7.9,
      99.8,6.6,100.3,5.4,101.3,2.9,103,1.5,103.5,1.3,104.2,1.4,103.33,3.8,102.24,6.13,101.3,6.9,100.5,7.2,100,8.4,99.3,9.1,99.8,11.8,
      100,13.4,100.5,13.5,100.9,12.9,102.1,12.6,103.5,10.6,104.5,10.4,104.8,8.6,106.3,9.5,107.1,10.35,109,11.6,109.2,12.3,109.2,13.8,
      108.9,15.4,108.2,16.1,107.1,17,106.6,17.5,105.7,18.7,106.4,20,106.7,20.9,108,21.5,109.1,21.5,110.2,20.3,110.4,21.2,112,21.8,
      113.5,22.2,114.2,22.3,115.8,22.8,116.7,23.4,118.1,24.5,119.3,26.1,120.7,28,121.5,28.7,121.55,29.87,121.4,30.8,121.9,31.6,
      121.1,32.5,120.3,34.3,119.2,34.6,120.3,36.1,122.6,37.4,121.4,37.5,119.3,37.1,119.2,37.8,117.7,39,119.6,39.9,121.1,41.1,
      122.2,40.7,121.6,38.9,122.9,39.6,124.3,39.9,125.4,38.7,125,37.9,126.6,37.5,126.5,36.5,126.4,34.8,127.5,34.6,129,35.1,129.4,36,
      129.4,37.6,128.6,38.2,127.4,39.2,127.6,39.9,129.5,40.8,129.8,41.8,130.7,42.3,131.9,43.1,132.9,42.8,135.5,43.8,137.7,45.4,
      138.6,47.2,140.3,48.97,140.5,50.5,141.2,52.9,140.7,53.5,138.5,53.9,137.8,54.6,137.2,56.2,140,57.6,143.2,59.4,148,59.3,
      150.8,59.6,154.2,59.1,155.2,60.5,156.5,61.5,158.5,62,160,61,157.8,58,156.7,57,156.2,54.5,156.7,51.2,158.7,53,160,54.5,
      161.8,55.5,162.5,57.5,163.3,59,166,60.2,170,60.1,172.5,61,174.5,61.8,177.5,62.5,179,63,180,65,180,68.9,176,69.8,170,70.1,
      166,69.6,161,69.6,156,71,152,70.8,147,72.3,140,72.5,135,71.5,130,70.9,126.5,73.4,122,73,118,73.6,113,73.8,109,74,106,76.5,
      104.3,77.7,100,76.5,97,76,93,75.9,88,75.2,86,74.5,82,73.5,80.5,72.5,78.5,72.4,75,72.8,72.5,70,70,73.4,67.5,71.2,66.5,69,
      63,69.7,60,69,57,68.5,53.5,68.3,48.5,67.7,43.3,68.6,41.5,66.7,40.5,64.6,36,64.5,34.5,66,32.5,67.1,35,66.4,39.5,66.7,41,67.8,
      40,68.3,36,69.2,33,69,30,69.7,28,71,25.8,71.1,23.5,70.8,21,70,18.9,69.6,16,69,14.5,68.2,13.5,67,12.5,66,11,64.9,10.4,63.4,
      8.3,63.3,6.15,62.47,5,61.8,5.3,60.4,5.7,58.97,6.6,58.1,7.05,58,8.8,58.4,10.5,59.2,11.2,58.8,11.9,57.7,12.7,56.04,12.9,55.4,
      13.8,55.4,14.6,56.1,15.6,56.2,16.4,56.7,16.7,58,18.1,59.3,18.7,60.2,17.1,60.7,17.5,62.3,20.3,63.8,21.5,64.7,22.1,65.6,
      24.2,65.8,25.4,65,24.5,64.2,21.6,63.1,21.4,61.5,22.3,60.4,25,60.2,27,60.5,28.8,60.6,30.3,59.9,28.3,59.6,26.5,59.5,24.7,59.4,
      23.5,59.2,24.5,58.4,24.1,57,21.6,57.4,21,56.5,21.1,55.7,19.9,54.6,18.6,54.4,17.2,54.8,15.6,54.2,14.2,53.9,13.4,54.3,11.5,54,
      10.1,54.3,10.2,56.2,10.6,57.7,9.9,57.1,8.6,57.1,8.1,56.5,8.1,55.5,8.6,54.9,8.7,53.9,7,53.5,5,53.2,4.6,52.5,4.1,52,3.6,51.5,
      2.5,51.1,1.85,50.95,1.6,50.3,0.2,49.7,-0.8,49.3,-1.6,49.65,-1.9,48.7,-3,48.8,-4.8,48.4,-4.3,47.8,-2.2,47.3,-1.8,46.5,-1.2,45.7,
      -1.2,44.6,-1.5,43.5,-2.9,43.4,-3.8,43.5,-5.8,43.6,-7.7,43.8,-8.4,43.4,-9.3,42.9,-8.9,42.1,-8.7,41.2,-9,40.2,-9.4,39.4],
    [-5.9,35.8,-5.3,35.9,-4.4,35.2,-2.9,35.2,-0.6,35.7,1.3,36.5,3,36.8,5.1,36.7,7.8,36.9,9.9,37.3,10.3,36.8,11.1,37.1,10.6,35.8,
      11.1,35.2,10.8,34.7,10.1,33.9,11,33.4,12.1,32.9,13.2,32.9,15.1,32.4,15.8,31.4,16.6,31.2,18.2,30.8,19.6,30.4,20.1,31.2,20.1,32.1,
      21.5,32.8,22.6,32.8,23.96,32.08,25.15,31.57,27.2,31.35,29.9,31.2,31,31.6,31.8,31.4,32.3,31.3,32.6,30,32.6,29.5,33.8,27.2,
      34.3,26.1,35.5,23.9,36.6,22.2,37.2,19.6,38.5,18,39.45,15.6,40.6,14.6,41.7,13.5,42.7,13,43.3,12.4,43.1,11.6,43.5,11.35,45,10.4,
      47.5,11.2,49.2,11.3,51.27,11.83,51.4,10.4,50.4,8.5,48.5,5.35,46.8,3.4,45.3,2,43.2,0.5,42.5,-0.5,40.9,-2.3,39.7,-4,39.3,-6.8,
      39.5,-8.9,40.2,-10.3,40.5,-13,40.7,-14.5,39.5,-16.8,36.9,-17.9,35.3,-19.2,34.8,-19.8,35.3,-21.5,35.4,-23.9,33.6,-25.1,
      32.6,-25.9,32.9,-26.9,32.1,-28.8,31,-29.9,30.2,-31.1,28.8,-32.2,27.9,-33,26.5,-33.6,25.6,-34,24,-34.1,22.1,-34.2,20,-34.8,
      18.8,-34.3,18.5,-34.36,18.4,-33.9,17.9,-33,17.3,-30.5,16.45,-28.6,15.2,-26.7,14.5,-22.9,13.4,-20.5,11.8,-17.3,12.15,-15.2,
      13.4,-12.6,13.2,-8.8,12.3,-6.1,12,-5,11.8,-4.8,10.1,-2.7,8.8,-0.7,9.5,0.4,9.9,2.9,9.7,4,8.8,4.5,6.1,4.3,5.5,5.2,4.5,6.2,
      3.4,6.4,2.4,6.35,1.2,6.1,-0.2,5.6,-1.75,4.9,-3.2,5.1,-4,5.3,-5.5,5.1,-7.5,4.4,-9.3,5.2,-10.8,6.3,-11.5,6.9,-13.2,8.5,-13.7,9.5,
      -15,10.8,-15.6,11.85,-16.8,12.4,-16.6,13.45,-17.5,14.7,-16.9,15.8,-16.5,16,-16,18.1,-16.4,19.8,-17.05,20.77,-15.9,23.7,
      -14.5,26.1,-13.2,27.15,-11.5,28.2,-10.2,29.1,-9.6,30.4,-9.77,31.5,-9.2,32.3,-8.5,33.2,-7.6,33.6,-6.8,34,-6.15,35.2],
    [49.3,-12,50.4,-15.2,49.9,-16.6,49.4,-17.8,48.4,-21.2,47.5,-24,47.1,-24.9,46.2,-25.2,45.2,-25.6,44,-25,43.6,-23.3,43.3,-21.8,
      43.9,-20.3,44.4,-17.8,44.1,-16.3,45.3,-15.9,46.4,-15.3,47.2,-14.5,48,-13.6],
    [79.9,9.8,81.2,8.6,81.9,7.4,81.6,6.3,80.6,5.95,80,6.3,79.8,7.8],
    [108.6,19.2,110.5,20.1,111,19.7,110.3,18.5,109.5,18.2,108.7,18.5],
    [120.2,23.1,121.5,25.3,122,25,121.4,23,120.8,21.9,120.2,22.6],
    [130.9,34,131.7,34.7,133,35.5,135.8,35.7,136.9,37.4,137.3,36.8,139,37.9,139.9,39,140,40.6,140.4,41.2,141.4,41.4,141.8,40.4,
      142,39.5,141,38.3,140.9,37,140.6,36,140.87,35.7,140,35,139.8,35.2,138.8,34.6,137.6,34.6,136.8,34.5,136.2,33.8,135.7,33.4,
      135.1,34.3,134.2,34.6,132.5,34.2,131.8,34],
    [129.9,33.5,130.9,33.95,131.7,33.3,131.5,31.8,130.7,31,130.2,31.3,130.1,32.8,129.7,33.2],
    [132.6,33.3,134.2,34.3,134.7,33.9,134.3,33.3,133,32.8],
    [140,41.4,141.2,41.8,143.25,41.9,144.9,42.9,145.8,43.4,145,44.3,143.5,44.2,141.9,45.5,141.4,43.8,140.3,43.2,140,42.3],
    [142.1,45.9,143.3,46.8,143.6,49.2,143.1,51.5,143.2,53.5,142.6,54.3,142.3,53,142,51.5,141.9,48.5],
    [120.6,18.5,122.2,18.5,122.4,17.2,121.6,15.9,122,14.2,124.2,12.6,123.1,13.4,121.2,13.7,120.6,14.3,120,16,120.4,17.5],
    [122,11.8,123.5,11.5,125.3,11.3,125.2,10,123.8,9.5,122.5,9.7,121.9,10.6],
    [122.1,6.9,122.3,8.1,123.6,8.6,125.4,9.7,126.6,7.4,126.1,6.3,125.4,5.6,124.2,6.2,123.1,7.6],
    [109,1.4,109.6,-1,110.2,-2.9,111.6,-3.6,114.6,-3.8,116.1,-3.9,116.6,-2.5,117.5,-0.5,117.9,1,118.8,4.9,119.3,5.3,116.8,6.9,
      116,6,115.2,4.9,113.9,4.5,112,2.9,111.1,1.8,109.6,2],
    [95.3,5.6,97.5,5.2,98.7,3.8,100.4,2.1,101.4,1.7,103.5,-0.5,104.4,-1.9,105.9,-3.2,105.9,-5.8,104.6,-5.9,103.4,-4.8,101.9,-3.5,
      100.4,-1,98.8,1.6,97.6,2.9,96,4.3],
    [105.2,-6.8,106.1,-6,107.6,-6.2,108.6,-6.7,110.4,-6.9,112.7,-6.9,114.4,-7.8,114.4,-8.6,112.5,-8.4,110.7,-8.2,108.3,-7.8,106.4,-7.4],
    [119.4,-5.6,119.6,-3.3,118.8,-2.7,119.8,-0.8,120.5,0.9,122.5,1,124.9,1.6,125.2,1.3,123.4,0.4,121,0.5,120.8,-0.9,123.3,-0.9,
      122,-1.7,121.5,-2.7,122.7,-4.5,121.2,-4.6,120.4,-3,120.4,-5.6],
    [131,-1.3,132.3,-0.4,134,-0.9,135.5,-3.3,137.8,-1.5,141,-2.6,143.5,-3.4,145.8,-5.1,147.6,-6.1,147.9,-7.8,149.5,-9.5,150.8,-10.2,
      149.2,-10.3,147.2,-9.5,146.1,-8.1,144.2,-7.7,143.2,-8.9,142.6,-9.3,141,-9.1,139.5,-8.2,137.9,-8.4,138.1,-6.6,137.1,-5,135.5,-4.4,
      134.2,-3.9,133.2,-4.1,132.3,-2.8,132.8,-2.2],
    [113.8,-21.8,114,-26,115,-29.6,115.7,-32,115,-34.3,118,-35,123.6,-33.9,126,-32.3,131,-31.5,134.5,-32.8,135.8,-34.9,137.5,-33.3,
      138.5,-35,140,-37.6,141.6,-38.4,144.9,-37.9,146.4,-39.1,150,-37.5,151.2,-33.9,153.1,-30.3,153.6,-28.2,153,-25.3,150.5,-22.5,
      148.7,-20.2,146,-17,145.3,-14.8,143.6,-14,142.5,-10.7,141.6,-13,141.5,-16.5,140.6,-17.6,139,-17,137,-15.9,135.9,-14,
      136.8,-12.2,132.6,-11.5,130.8,-12.4,129.5,-14.9,126.8,-13.8,125,-15.5,122.2,-17.9,118.6,-20.3,116,-20.6],
    [144.6,-40.7,148.3,-40.9,148,-43.2,146.8,-43.6,145.3,-42.2],
    [172.7,-34.4,174.7,-36.8,178.5,-37.7,177.9,-39.2,176.8,-39.6,174.8,-41.3,174,-39.3,173.6,-35.5],
    [172.7,-40.5,174.3,-41.3,173.2,-43,171.2,-44.4,170.5,-45.9,168.3,-46.6,166.5,-45.6,168.5,-44,171.2,-41.8],
    [-24,65.5,-22,66.5,-18,66.2,-14.5,66.4,-13.5,65,-15,64.3,-18,63.4,-21,63.8,-22.7,64],
    [-5.7,50.1,-3,50.6,1.4,51.2,1.7,52.7,0.3,53.5,-1.6,55,-2.1,57.1,-3.1,58.6,-5,58.6,-6.2,56.7,-5.6,55.3,-3.2,54.9,-3.2,53.4,
      -4.7,52.8,-5.2,51.7,-3.2,51.4,-4.5,51.2],
    [-6,55.2,-5.7,54.2,-6.2,52.2,-9.6,51.5,-10.3,52,-9.9,53.5,-8.3,55.2],
    [11,78.5,16,80,27,80,22,77.3,16,76.6],
    [52,71.5,57,75,68,76.9,60,74,55,70.6],
    [12.4,37.8,15.6,38.3,15.1,36.7],
    [8.2,40.9,9.8,41.1,9.6,39.1,8.4,39],
    [8.6,42.9,9.4,43,9.5,41.4,8.8,41.6],
    [23.5,35.3,26.3,35.3,26.1,35,23.6,35.2],
    [32.3,35.1,34.6,35.6,33.9,34.9,32.9,34.6],
    [-180,-90,-180,-84,-170,-78.5,-160,-78.2,-150,-76.5,-140,-75.5,-120,-73.5,-100,-73,-80,-73.2,-75,-71.5,-68,-67.5,-62,-64.5,
      -57,-63.3,-59,-65,-61,-68,-62,-72,-60,-75,-50,-77.8,-35,-78,-26,-76,-15,-72,-5,-70.5,10,-70,20,-70,30,-69.5,40,-68.5,50,-67,
      60,-67.5,70,-68,75,-69.5,80,-67.5,90,-66.5,100,-66,110,-66.2,120,-66.5,130,-66.2,140,-66.5,150,-68.5,160,-70.5,166,-72.5,
      168,-74,165,-77.5,172,-78.3,180,-78.5,180,-90]
  ];
  /* El mar Negro y el Caspio, que quedan dentro de la tierra. */
  var AGUA = [
    [29.2,41.2,28,41.3,27.5,42.5,28,43.2,28.6,44.2,29.7,45.1,30.8,46.5,31.8,46.6,32.6,46.1,33.5,45.9,33.4,45.2,32.5,45.4,33.5,44.5,
      34.2,44.5,35.4,45,36.6,45.3,37.3,44.9,38.5,44.2,39.7,43.6,41.6,41.6,39.7,41,36.3,41.3,35.2,42,33.2,42,31.8,41.5],
    [46.8,44.8,47.8,45.7,48.5,46.5,49.2,46.4,51.2,47.1,53.2,46.8,53.1,45.3,51.3,44.6,51.2,43.6,52.6,42.9,53,41.4,53.8,40,53.9,38.5,
      53.9,37.2,51.5,36.8,49.5,37.5,48.9,38.4,49.4,40.2,48.8,41.4,47.5,43,47.1,44.2]
  ];
  function contorno(c) {
    var d = '';
    for (var i = 0; i < c.length; i += 2) d += (i ? ' L ' : 'M ') + r2(gx(c[i])) + ' ' + r2(gy(c[i + 1]));
    return d + ' Z';
  }

  /* ── La aldea: el río baja de arriba abajo y el camino lo cruza por el
     puente. La ambulancia entra por la izquierda, así que «pasando el
     puente» es la orilla de la derecha. ── */
  var Y_CAMINO = 100;
  var X_PUENTE = 88;
  /* Las casas y las matas se dibujan a 1,3: a 1 quedaban chicas en el
     teléfono, con aire de sobra arriba y abajo de la aldea. */
  var S = 1.3;
  var ARRIBA = 70, ABAJO = 130;          // el centro de las paredes, a cada lado del camino
  /* [x, y, x de la mata de mango o null]; la de doña Nely es la 5. La mata
     va al lado de su casa, con el pie a la altura del de la casa. */
  var CASAS = [
    [42, ARRIBA, 17],
    [58, ABAJO, null],
    [132, ARRIBA, 107],
    [160, ABAJO, 185],
    [200, ARRIBA, null],
    [264, ARRIBA, 239],
    [264, ABAJO, null]
  ];
  var NELY = 5;
  /* Las tres de la seña, en el orden en que las encuentra la ambulancia
     por el camino. */
  var VISITAS = [2, 3, 5];
  var X_SALIDA = 16;

  var TEXTOS = [
    '«La de la mata de mango, pasando el puente.» Pasando el puente hay tres casas con mata de mango. ¿Cuál es la de doña Nely?',
    'El chofer pregunta en una casa, después en otra. La tercera es la de doña Nely, y ya pasaron cuarenta minutos.',
    'Ahora, un punto lejos de la aldea. Su primer número se cuenta desde la línea del medio: está 30° hacia arriba.',
    'Su segundo número se cuenta desde la línea de partida, que va de arriba abajo: está 105° hacia la izquierda.',
    'Pero hacia abajo también hay 30°, y hacia la derecha, 105°. Cada número lleva la letra de su lado: 30° N, 105° O.',
    'Un número sin el otro es una línea entera. Los dos juntos se cruzan en un solo punto: este.',
    'Por la casa de doña Nely también pasan sus dos líneas. Con sus dos números, el chofer no habría tenido que preguntar.'
  ];

  var A;
  var aldea, mapa;
  var dudas = [], noes = [], sies = [], tramos = [], lineasCasa = [], rotulosCasa = [], aroCasa;
  var refMedio, refPartida, rotMedio, rotPartida, pin, pinCae;
  var flechas = {}, puntas = {}, numeros = {}, letras = {}, enteras = {}, aro, lectura;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una casa del campo: paredes de adobe, techo de teja y su puerta.
     (x, y) es el centro de las paredes; se dibuja a escala S. */
  function casa(padre, x, y, i) {
    var el = A.el;
    var g = el('g', { 'data-casa': String(i), transform: 'translate(' + x + ' ' + y + ') scale(' + S + ')' }, padre);
    el('rect', { class: 'co-pared', 'data-cuerpo': '', x: -8, y: -6, width: 16, height: 12 }, g);
    el('path', { class: 'co-techo', d: 'M -10 -6 L 0 -14 L 10 -6 Z' }, g);
    el('rect', { class: 'co-puerta', x: -2, y: -1, width: 4, height: 7 }, g);
    return g;
  }

  /* Una mata de mango: la copa redonda con sus mangos, y el tronco. (x, pie)
     es el pie del tronco, a la altura del de su casa. */
  function mata(padre, x, pie) {
    var el = A.el;
    var g = el('g', { 'data-mata': '', transform: 'translate(' + x + ' ' + r2(pie) + ') scale(' + S + ')' }, padre);
    el('rect', { class: 'co-tronco', x: -1.3, y: -8, width: 2.6, height: 8 }, g);
    el('circle', { class: 'co-copa', 'data-copa': '', cx: 0, cy: -12, r: 8.5 }, g);
    [[-3.6, 0.6], [2.4, -4.2], [3.9, 1.8], [-1.2, -5], [0.4, 3.4]].forEach(function (m) {
      el('circle', { class: 'co-mango', cx: m[0], cy: -12 + m[1], r: 1.5 }, g);
    });
  }

  /* La marca que se pone sobre una casa: «?» la duda (aro de raya
     cortada), ✗ la que no es (dos rayas), ✓ la que sí (una raya). */
  function marca(padre, tipo, x, y) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera co-marca' + (tipo === 'duda' ? ' co-duda' : ''), 'data-marca': tipo }, padre);
    var h = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(1.2)' }, g);
    el('circle', { class: 'co-marca-fondo', 'data-marca-aro': '', cx: 0, cy: 0, r: 6.5 }, h);
    if (tipo === 'duda') texto(h, { class: 'co-signo', x: 0, y: 3.6, 'font-size': 10 }, '?');
    else el('path', { class: 'co-marca-trazo', 'data-marca-trazo': '',
      d: tipo === 'no' ? 'M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6' : 'M -3 0 L -0.8 2.4 L 3.2 -2.6' }, h);
    return g;
  }

  /* La ambulancia, de lado, mirando al frente del camino. (0, 0) es su
     centro, y va en tres tramos encadenados: cada tramo la lleva de una
     casa a la siguiente, y los tres juntos la dejan en la de doña Nely. */
  function ambulancia(padre) {
    var el = A.el;
    var base = el('g', { transform: 'translate(' + X_SALIDA + ' ' + Y_CAMINO + ')' }, padre);
    var t1 = el('g', { class: 'co-tramo' }, base);
    var t2 = el('g', { class: 'co-tramo' }, t1);
    var t3 = el('g', { class: 'co-tramo' }, t2);
    tramos = [t1, t2, t3];
    var g = el('g', { 'data-ambulancia': '', transform: 'scale(' + S + ')' }, t3);
    el('path', { class: 'co-ambu', d: 'M -11 4 L -11 -5 L 4 -5 L 8 -1 L 11 0 L 11 4 Z' }, g);
    el('path', { class: 'co-vidrio', d: 'M 4.6 -4 L 7.4 -1.2 L 4.6 -1.2 Z' }, g);
    el('rect', { class: 'co-cruz', x: -6.2, y: -3.9, width: 1.6, height: 5.2 }, g);
    el('rect', { class: 'co-cruz', x: -8, y: -2.1, width: 5.2, height: 1.6 }, g);
    el('circle', { class: 'co-llanta', cx: -6, cy: 4.4, r: 2.2 }, g);
    el('circle', { class: 'co-llanta', cx: 6, cy: 4.4, r: 2.2 }, g);
  }

  /* Una flecha que cuenta: la raya desde la línea de referencia hasta el
     punto, y su punta. */
  function flecha(padre, nombre, clase, x1, y1, x2, y2, espejo) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-flecha': nombre }, padre);
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    /* La raya acaba donde empieza la punta. */
    var raya = el('path', { class: clase + (espejo ? ' co-espejo' : ''), 'data-raya': '',
      d: 'M ' + r2(x1) + ' ' + r2(y1) + ' L ' + r2(x2 - ux * 3.6) + ' ' + r2(y2 - uy * 3.6) }, g);
    var bx = x2 - ux * 4.2, by = y2 - uy * 4.2, px = -uy * 2.6, py = ux * 2.6;
    var punta = el('path', { class: 'co-punta ' + clase, 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(x2) + ' ' + r2(y2) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
    flechas[nombre] = g;
    puntas[nombre] = { raya: raya, punta: punta };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ════════ La aldea ════════ */
    aldea = el('g', { class: 'am-capa', 'data-aldea': '' }, svg);
    el('rect', { class: 'co-grama', x: 4, y: 4, width: 296, height: 182, rx: 8 }, aldea);
    el('path', { class: 'co-rio', 'data-rio': '', d: 'M 86 6 C 94 40, 76 64, 88 100 C 98 130, 80 160, 92 184' }, aldea);
    el('path', { class: 'co-rio-brillo', d: 'M 86 6 C 94 40, 76 64, 88 100 C 98 130, 80 160, 92 184' }, aldea);
    el('rect', { class: 'co-camino', x: 4, y: Y_CAMINO - 7, width: 296, height: 14 }, aldea);
    /* El puente: tablas sobre el río, con su baranda a cada lado. */
    var puente = el('g', { 'data-puente': '' }, aldea);
    el('rect', { class: 'co-puente', 'data-tablero': '', x: X_PUENTE - 14, y: Y_CAMINO - 8.5, width: 28, height: 17, rx: 1 }, puente);
    for (var t = -10; t <= 10; t += 5) el('path', { class: 'co-tabla', d: 'M ' + (X_PUENTE + t) + ' ' + (Y_CAMINO - 8.5) + ' V ' + (Y_CAMINO + 8.5) }, puente);
    el('path', { class: 'co-baranda', d: 'M ' + (X_PUENTE - 14) + ' ' + (Y_CAMINO - 8.5) + ' H ' + (X_PUENTE + 14) }, puente);
    el('path', { class: 'co-baranda', d: 'M ' + (X_PUENTE - 14) + ' ' + (Y_CAMINO + 8.5) + ' H ' + (X_PUENTE + 14) }, puente);

    /* Las dos líneas que pasan por la casa de doña Nely (paso 6): una
       acostada y otra de arriba abajo, de un borde al otro de la aldea. */
    var nx = CASAS[NELY][0], ny = CASAS[NELY][1];
    lineasCasa.push(el('path', { class: 'co-lat am-fuera', 'data-linea-casa': 'lat', d: 'M 4 ' + ny + ' H 300' }, aldea));
    lineasCasa.push(el('path', { class: 'co-lon am-fuera', 'data-linea-casa': 'lon', d: 'M ' + nx + ' 4 V 186' }, aldea));

    CASAS.forEach(function (c, i) {
      if (c[2] != null) mata(aldea, c[2], c[1] + 6 * S);
      var g = casa(aldea, c[0], c[1], i);
      if (i === NELY) g.setAttribute('data-nely', '');
    });

    rotulosCasa.push(texto(aldea, { class: 'co-rotulo am-fuera', 'data-rotulo-casa': 'lat', x: 150, y: ny - 4.5, 'font-size': 10.5 }, 'latitud'));
    rotulosCasa.push(texto(aldea, { class: 'co-rotulo am-fuera', 'data-rotulo-casa': 'lon', x: nx - 4, y: 16, 'font-size': 10.5, 'text-anchor': 'end' }, 'longitud'));
    aroCasa = el('circle', { class: 'co-aro am-fuera', 'data-aro-casa': '', cx: nx, cy: ny - 4, r: 17 }, aldea);

    ambulancia(aldea);

    /* Las marcas: encima de las casas de arriba del camino, debajo de las
       de abajo. */
    VISITAS.forEach(function (k) {
      var c = CASAS[k], my = c[1] === ARRIBA ? c[1] - 30 : c[1] + 19;
      dudas.push(marca(aldea, 'duda', c[0], my));
      if (k === NELY) sies.push(marca(aldea, 'si', c[0], my));
      else noes.push(marca(aldea, 'no', c[0], my));
    });

    /* ════════ El mapa del mundo ════════ */
    mapa = el('g', { class: 'am-capa am-fuera', 'data-mundo': '' }, svg);
    el('rect', { class: 'co-mar', 'data-mapa': '', x: MX, y: MY, width: 360 * K, height: 180 * K, rx: 2 }, mapa);
    var malla = el('g', { 'data-malla': '' }, mapa);
    var lat, lon;
    for (lat = -75; lat <= 75; lat += 15) el('path', { class: 'co-malla', 'data-malla-lat': String(lat), d: 'M ' + MX + ' ' + r2(gy(lat)) + ' H ' + r2(gx(180)) }, malla);
    for (lon = -165; lon <= 165; lon += 15) el('path', { class: 'co-malla', 'data-malla-lon': String(lon), d: 'M ' + r2(gx(lon)) + ' ' + MY + ' V ' + r2(gy(-90)) }, malla);
    TIERRA.forEach(function (c) { el('path', { class: 'co-tierra', 'data-tierra': '', d: contorno(c) }, mapa); });
    AGUA.forEach(function (c) { el('path', { class: 'co-agua', 'data-agua': '', d: contorno(c) }, mapa); });

    /* Las dos líneas de referencia, que se trazan cuando les toca. */
    refMedio = el('path', { class: 'co-ref', 'data-ref': 'medio', d: 'M ' + MX + ' ' + Y_MEDIO + ' H ' + r2(gx(180)) }, mapa);
    /* A la derecha: a la izquierda se montaba sobre el «30°» de la flecha. */
    rotMedio = texto(mapa, { class: 'co-rotulo am-fuera', 'data-ref-rotulo': 'medio', x: 292, y: Y_MEDIO - 3.5, 'font-size': 10.5, 'text-anchor': 'end' }, 'línea del medio');
    refPartida = el('path', { class: 'co-ref', 'data-ref': 'partida', d: 'M ' + X_PARTIDA + ' ' + MY + ' V ' + r2(gy(-90)) }, mapa);
    rotPartida = texto(mapa, { class: 'co-rotulo am-fuera', 'data-ref-rotulo': 'partida', x: X_PARTIDA + 4, y: 141, 'font-size': 10.5 }, 'línea de partida');

    /* Cada número, una línea entera (paso 5). */
    enteras.lat = el('path', { class: 'co-lat', 'data-entera': 'lat', d: 'M ' + MX + ' ' + PY + ' H ' + r2(gx(180)) }, mapa);
    enteras.lon = el('path', { class: 'co-lon', 'data-entera': 'lon', d: 'M ' + PX + ' ' + MY + ' V ' + r2(gy(-90)) }, mapa);

    /* Las flechas que cuentan, y las del número sin letra. */
    flecha(mapa, 'lat', 'co-lat', PX, Y_MEDIO, PX, PY, false);
    flecha(mapa, 'lat-espejo', 'co-lat', PX, Y_MEDIO, PX, Y_MEDIO + (Y_MEDIO - PY), true);
    flecha(mapa, 'lon', 'co-lon', X_PARTIDA, PY, PX, PY, false);
    flecha(mapa, 'lon-espejo', 'co-lon', X_PARTIDA, PY, X_PARTIDA + (X_PARTIDA - PX), PY, true);

    /* Los números, y la letra que se les pega en el paso 4. Medidos con la
       Fredoka de la misión a 11 (peso 600): «30°» 16,58; «105°» 20,01; el
       espacio 2,65. */
    numeros.lat = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lat', x: 36, y: 87, 'font-size': 11 }, '30°');
    numeros['lat-espejo'] = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lat-espejo', x: 36, y: 111, 'font-size': 11 }, '30°');
    numeros.lon = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lon', x: 99, y: 66, 'font-size': 11 }, '105°');
    numeros['lon-espejo'] = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lon-espejo', x: 184, y: 66, 'font-size': 11 }, '105°');
    letras.lat = texto(mapa, { class: 'co-rotulo co-letra am-fuera', 'data-letra': 'lat', x: r2(36 + 16.58 + 2.65), y: 87, 'font-size': 11 }, 'N');
    letras.lon = texto(mapa, { class: 'co-rotulo co-letra am-fuera', 'data-letra': 'lon', x: r2(99 + 20.01 + 2.65), y: 66, 'font-size': 11 }, 'O');

    /* El punto: una chincheta clavada en su sitio (la punta es el punto). */
    pin = el('g', { class: 'am-fuera', 'data-pin': '', transform: 'translate(' + PX + ' ' + PY + ')' }, mapa);
    pinCae = el('g', {}, pin);
    el('path', { class: 'co-pin', d: 'M 0 0 C -1.6 -3, -4.4 -5.2, -4.4 -8.6 A 4.4 4.4 0 1 1 4.4 -8.6 C 4.4 -5.2, 1.6 -3, 0 0 Z' }, pinCae);
    el('circle', { class: 'co-pin-ojo', cx: 0, cy: -8.6, r: 1.7 }, pinCae);

    aro = el('circle', { class: 'co-aro am-fuera', 'data-aro': '', cx: PX, cy: PY, r: 7.5 }, mapa);
    lectura = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-lectura': '', x: PX + 6, y: 56, 'font-size': 10.5 }, '30° N, 105° O');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var vuelve = function (k) { return !ida && antes === k; };
    /* El paso 1 se cuenta entero venga de donde venga: al volver del mapa,
       la ambulancia sale otra vez de la entrada y cada marca aparece cuando
       llega a su casa. Con fue(1) volvía a recorrer el camino de golpe con
       las ✗ y la ✓ ya puestas, que es contar el final antes que el viaje. */
    var entra = function (k) { return n === k && antes !== k; };

    /* ── Qué se ve: la aldea en 0, 1 y 6; el mapa del 2 al 5. ── */
    var enAldea = n <= 1 || n === 6;
    A.ver(aldea, enAldea, enAldea ? ((fue(6) || vuelve(2)) ? 300 : 0) : 0);
    A.ver(mapa, !enAldea, !enAldea ? ((fue(2) || vuelve(6)) ? 300 : 0) : 0);

    /* ── La aldea ── */
    /* La ambulancia: en el 1, de casa en casa; en el 6, derecho a la de
       doña Nely; en los demás, esperando a la entrada. */
    var xs = VISITAS.map(function (k) { return CASAS[k][0]; });
    var d1 = 0, d2 = 0, d3 = 0;
    if (n === 1) { d1 = xs[0] - X_SALIDA; d2 = xs[1] - xs[0]; d3 = xs[2] - xs[1]; }
    else if (n === 6) d1 = xs[2] - X_SALIDA;
    A.mover(tramos[0], d1, 0, 0, 1, entra(1) ? 250 : (fue(6) ? 1700 : 0));
    A.mover(tramos[1], d2, 0, 0, 1, entra(1) ? 1500 : 0);
    A.mover(tramos[2], d3, 0, 0, 1, entra(1) ? 2750 : 0);

    /* Las marcas: la duda en el 0; en el 1, cada una se vuelve ✗ o ✓
       cuando la ambulancia llega; en el 6, solo la ✓ de doña Nely. */
    var llega = [1300, 2550, 3800];
    dudas.forEach(function (g, i) { A.ver(g, n === 0, fue(1) ? llega[i] : 0); });
    noes.forEach(function (g, i) { A.ver(g, n === 1, entra(1) ? llega[i] : 0); });
    sies.forEach(function (g) { A.ver(g, n === 1 || n === 6, entra(1) ? llega[2] : (fue(6) ? 2800 : 0)); });

    /* Las dos líneas de la casa de doña Nely, en el 6. */
    lineasCasa.forEach(function (p, i) {
      A.ver(p, n === 6, n === 6 && fue(6) ? 800 + 500 * i : 0);
      A.trazar(p, n === 6, n === 6 && fue(6) ? 800 + 500 * i : 0);
    });
    rotulosCasa.forEach(function (t, i) { A.ver(t, n === 6, n === 6 && fue(6) ? 1100 + 500 * i : 0); });
    A.ver(aroCasa, n === 6, n === 6 && fue(6) ? 2800 : 0);

    /* ── El mapa ── */
    A.ver(pin, n >= 2 && n <= 5, fue(2) ? 700 : 0);
    A.mover(pinCae, 0, (n >= 2 && n <= 5) ? 0 : -12, 0, 1, fue(2) ? 700 : 0);

    var conMedio = n >= 2 && n <= 5, conPartida = n >= 3 && n <= 5;
    A.trazar(refMedio, conMedio, fue(2) ? 1100 : 0);
    A.ver(rotMedio, conMedio, fue(2) ? 1400 : 0);
    A.trazar(refPartida, conPartida, fue(3) ? 200 : 0);
    A.ver(rotPartida, conPartida, fue(3) ? 500 : 0);

    /* Las flechas que cuentan: la del primer número del 2 al 4, la del
       segundo del 3 al 4. En el 5 se vuelven su línea entera. */
    var conLat = n >= 2 && n <= 4, conLon = n >= 3 && n <= 4;
    A.ver(flechas.lat, conLat, fue(2) ? 1900 : 0);
    A.trazar(puntas.lat.raya, conLat, fue(2) ? 1900 : 0);
    A.ver(numeros.lat, conLat, fue(2) ? 2500 : 0);
    A.ver(flechas.lon, conLon, fue(3) ? 1000 : 0);
    A.trazar(puntas.lon.raya, conLon, fue(3) ? 1000 : 0);
    A.ver(numeros.lon, conLon, fue(3) ? 1600 : 0);

    /* El número sin letra, del otro lado (raya cortada), y la letra. */
    var conEspejo = n === 4;
    A.ver(flechas['lat-espejo'], conEspejo, fue(4) ? 200 : 0);
    A.ver(numeros['lat-espejo'], conEspejo, fue(4) ? 400 : 0);
    A.ver(flechas['lon-espejo'], conEspejo, fue(4) ? 800 : 0);
    A.ver(numeros['lon-espejo'], conEspejo, fue(4) ? 1000 : 0);
    A.ver(letras.lat, conEspejo, fue(4) ? 1600 : 0);
    A.ver(letras.lon, conEspejo, fue(4) ? 1900 : 0);

    /* Cada número, su línea entera; y el único punto que está en las dos. */
    var cruce = n === 5;
    A.ver(enteras.lat, cruce, 0);
    A.trazar(enteras.lat, cruce, fue(5) ? 300 : 0);
    A.ver(enteras.lon, cruce, 0);
    A.trazar(enteras.lon, cruce, fue(5) ? 1000 : 0);
    A.ver(aro, cruce, fue(5) ? 1800 : 0);
    A.ver(lectura, cruce, fue(5) ? 1800 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '3', palabras: 'casas con esa seña' },
      { cifra: '40', palabras: 'minutos preguntando' },
      { cifra: '30°', palabras: 'la latitud' },
      { cifra: '105°', palabras: 'la longitud' },
      { cifra: '30° N, 105° O', palabras: 'cada número con su letra' },
      { cifra: '1', palabras: 'punto con esos dos números' },
      { cifra: '0', palabras: 'minutos preguntando' }
    ][n];
  }

  AnimacionMision.montar('#amCruce', {
    vista: [ANCHO, ALTO],
    describe: 'Una aldea con un río, un puente y tres casas con mata de mango pasando el puente. Después, un mapa del mundo: un punto a 30° hacia arriba de la línea del medio y a 105° a la izquierda de la línea de partida, 30° N, 105° O.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🚑 La ambulancia', '🌎 Mirar el mundo', '↔️ El otro número', '🔤 ¿Y las letras?', '✚ Juntar los dos', '🏡 Volver a la aldea', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
