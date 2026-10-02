/* ============================================================
   M.E.T.A.S · Los cuatro viajes de Cristóbal Colón
   ------------------------------------------------------------
   El mapa de los viajes vive aquí, y no dentro de la animación que lo
   dibuja (misiones/2y3ciclo-himno-nacional/js/animacion-viajes.js), por
   la razón de siempre: el día que otra misión necesite los viajes —la
   Ruta del Tiempo los va a necesitar—, dos copias se separan con la
   primera ruta que alguien corrija.

   POR QUÉ SE DIBUJAN. Lo pide el currículo con estas palabras: «Investigan
   acerca de los viajes de Cristóbal Colón y los representa en un mapa»
   (DCNB, II Ciclo, Ciencias Sociales de Cuarto Grado; confirmado en el
   PDF, `_dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf`, página 283 del archivo,
   «Secretaría de Educación 289» en el pie impreso). Y lo pide el Himno: su
   primera estrofa cuenta el día en que «el audaz navegante» llegó a estas
   costas, y la segunda, de dónde venía.

   LO QUE SE AFIRMA, Y NADA MÁS:
   · Cuatro viajes, en 1492, 1493, 1498 y 1502. Son los años que traen
     todos los textos escolares y no hay fuente que los discuta.
   · Que los cuatro salieron de España y cruzaron el Atlántico.
   · Adónde llegó cada uno, dicho con la palabra más gruesa que es verdad:
     «unas islas del Caribe», «las islas del Caribe» (otra vez), «la costa
     de Sudamérica», «las Islas de la Bahía y la costa norte de Honduras».
   · Que solo el cuarto llegó a Honduras. Lo dice también js/data/himno.js
     (Colón «llegó a estas costas en 1502, en su cuarto viaje»), y la sonda
     comprueba que los dos archivos digan lo mismo.

   ⚠️ LO QUE NO SE ESCRIBE, a propósito:
   · El día exacto de cada desembarco. Se cuenta distinto según la fuente
     (el día que se vio tierra, el día que se bajó, el calendario de
     entonces), y en una pantalla un día mal puesto se aprende igual de bien.
   · Que «Honduras es el único país de América donde Colón pisó tierra
     firme». Ya se quitó una vez de himno.js porque no lo acredita nada, y
     este mismo mapa enseña por qué: el tercer viaje llegó a la costa de
     Sudamérica cuatro años antes.
   · La frase de «Gracias a Dios que hemos salido de estas honduras». Es una
     leyenda que cada quien cuenta a su manera.
   · Las vueltas a España. Se dibuja solo la ida, que es lo que cuenta el
     Himno («y en tu busca a la mar se lanzó»).

   LAS RUTAS SON ESQUEMAS. Pasan por los sitios por donde de verdad pasó
   cada viaje (las Canarias, Cabo Verde, las Antillas, Jamaica), pero entre
   un sitio y otro van derechas: el mar no tiene caminos pintados. Cada
   punto es [longitud, latitud], y el último es adonde llegó. El cuarto, que
   es el que se mira de cerca, no cruza tierra en ningún tramo: lo comprueba
   verifica-himno contra la costa fina de contornos-mundo.js (la que se ve
   cuando la cámara baja al Caribe) y contra todas sus islas, y la sonda de
   las animaciones otra vez en el navegador, sobre lo que se pinta. Al
   escribirlo cruzaba tres: Guanaja, Lanzarote y Martinica. Por eso llega a
   Guanaja por el oriente, pasa entre Gran Canaria y Fuerteventura y deja
   Martinica al norte.
   En el cuarto, después de las islas va por la costa norte hacia el
   oriente, y `sigue` es lo que hizo después de Honduras: bajar por la
   costa; se dibuja como una flecha que se va, sin decir hasta dónde.

   Corre también en Node (`require` devuelve { VIAJES_COLON }) para que la
   sonda lo lea sin abrir el navegador.
   ============================================================ */
(function (raiz) {
  'use strict';

  var VIAJES_COLON = [
    {
      n: 1, anio: 1492, llega: 'unas islas del Caribe', honduras: false,
      ruta: [[-6.9, 37.05], [-17.2, 28.0], [-40, 26.5], [-62, 25.4], [-74.5, 24.05], [-75.7, 21.25], [-72.6, 19.9]]
    },
    {
      n: 2, anio: 1493, llega: 'las islas del Caribe', honduras: false,
      ruta: [[-6.3, 36.5], [-18.0, 27.7], [-40, 19.6], [-61.0, 15.45], [-64.6, 18.2], [-66.5, 17.8], [-70.6, 19.85]]
    },
    {
      n: 3, anio: 1498, llega: 'la costa de Sudamérica', honduras: false,
      ruta: [[-6.4, 36.8], [-16.6, 32.6], [-23.2, 15.4], [-45, 9.6], [-60.4, 9.6], [-61.75, 9.9]]
    },
    {
      n: 4, anio: 1502, llega: 'las Islas de la Bahía y la costa norte de Honduras', honduras: true,
      ruta: [[-6.3, 36.5], [-15.2, 28.5], [-40, 18.6], [-60.9, 14.2], [-69.9, 18.25], [-77.2, 17.55], [-85.76, 16.47], [-86.0, 16.07], [-84.6, 16.05], [-82.95, 15.15]],
      sigue: [-83.1, 13.6]
    }
  ];

  raiz.VIAJES_COLON = VIAJES_COLON;
})(this);
