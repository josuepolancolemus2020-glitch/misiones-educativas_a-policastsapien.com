/* ══════════════════════════════════════════════════════════════
   🏷️ CLASES DE PALABRA PARA LA CACERÍA DE ADJETIVOS

   En la sección 📖 Lectura de una misión el alumno CAZA los adjetivos
   tocándolos sobre el texto que acaba de leer. Cada lectura trae su
   inventario (`adjs` y `dets`), pero hay dos grupos de palabras que no
   se pueden dejar al criterio de quien escribe el corpus, y por eso
   viven aquí, en un solo sitio que leen la misión Y las herramientas
   de _dev que revisan el corpus:

   ── NEUTROS ──
   Palabras que, si el alumno las toca, NO cuentan ni a favor ni en
   contra. La pantalla le explica por qué en vez de decirle que se
   equivocó. Son de dos tipos:

   · Los ARTÍCULOS (el, la, un, una…). En esta misión el artículo no
     es adjetivo determinativo y se enseña aparte. Pero la pestaña
     «Tipos» de la misión pone «un» entre los ejemplos de numeral, así
     que un alumno atento puede tocarlo con toda la razón del mundo.
     Marcarlo como error sería castigarlo por haber leído bien.
   · Los IDENTIFICATIVOS de los que ni los libros de texto se ponen de
     acuerdo (mismo, propio, tal, semejante). Si los gramáticos
     discuten, un niño de 6º no pierde puntos por eso.

   ── DETERMINATIVOS ──
   Es una CLASE CERRADA: se pueden nombrar todos. Por eso las
   herramientas de _dev pueden afirmar, sin heurísticas, que un
   determinativo que está en el texto y no está en `dets` (ni en
   `neutros`, cuando en esa oración funciona como pronombre) es un
   error del corpus. Los calificativos, en cambio, son clase abierta y
   no hay lista que valga: esos se revisan a mano.

   Ojo con la diferencia: aquí no importa si la palabra ES un
   determinativo en abstracto, sino si en SU oración acompaña a un
   sustantivo. «Todos los vecinos la saludan» lleva determinativo;
   «todos íbamos sucios» lleva pronombre. La lista señala el candidato;
   quien escribe el corpus decide en cuál de las dos listas va.
══════════════════════════════════════════════════════════════ */

const LECTURA_CLASES = {

  /* No cuentan ni a favor ni en contra (ver arriba el porqué). */
  neutros: ('el la los las un una unos unas uno lo al del ' +
    'mismo misma mismos mismas propio propia propios propias tal tales semejante semejantes').split(' '),

  /* Clase cerrada: demostrativos, posesivos, numerales e indefinidos.
     Los artículos NO están aquí a propósito. */
  determinativos: (
    /* demostrativos */
    'este esta estos estas ese esa esos esas aquel aquella aquellos aquellas ' +
    /* posesivos */
    'mi mis tu tus su sus nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras ' +
    'mío mía míos mías tuyo tuya tuyos tuyas suyo suya suyos suyas ' +
    /* numerales cardinales y ordinales */
    'dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis ' +
    'veinte treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento mil ' +
    'primer primera primero segundo segunda tercer tercera tercero cuarta séptimo octavo noveno ' +
    'medio media doble triple ambos ambas ' +
    /* indefinidos */
    'algún alguna algunos algunas ningún ninguno ninguna ningunos ningunas ' +
    'mucho mucha muchos muchas poco poca pocos pocas todo toda todos todas ' +
    'otro otra otros otras cada varios varias cualquier cualquiera demás ' +
    'tanto tanta tantos tantas bastante bastantes cierto cierta ciertos ciertas'
  ).split(' '),
};

/* Node (las herramientas de _dev) y navegador con el mismo archivo. */
if (typeof module !== 'undefined' && module.exports) module.exports = LECTURA_CLASES;
