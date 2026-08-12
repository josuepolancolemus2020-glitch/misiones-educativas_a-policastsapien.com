/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Fracciones escritas como fracciones
   ──────────────────────────────────────────────────────────────
   En el cuaderno y en el pizarrón una fracción se escribe con el
   numerador ARRIBA, la raya en medio y el denominador ABAJO. En la
   pantalla se venía escribiendo «3/4», que es como se teclea, no
   como se lee: el alumno de 6º que está aprendiendo a comparar 3/4
   con 0.8 tiene que reconocer la forma que su maestro le dibujó en
   el pizarrón, no traducirla.

   Este archivo convierte el texto tecleado en la forma escrita:

     Fr('¿qué es mayor, 3/4 o 0.8?')  →  ¿qué es mayor, ³⁄₄ apilada…

   Se aplica AL PINTAR, no en los bancos de datos: los bancos siguen
   con «3/4» en texto plano, que es lo que se puede buscar, comparar
   y corregir. Si alguna vez hay que volver atrás, se quita la
   llamada y el texto sigue siendo correcto.

   Qué reconoce:
   - la fracción suelta: 3/4, 12/25
   - el número mixto: «2 1/3» y también «1 y 1/3»
   Qué NO toca: km/h, L.94.50, «3 / 14» con espacios (el contador de
   las flashcards) y cualquier barra que no lleve dígitos a los dos
   lados. Tampoco entra dentro de las etiquetas HTML, así que sirve
   igual con texto plano que con texto que ya trae <strong>.

   Uso:  <script src="../../js/metas-fracciones.js"></script>
         el.innerHTML = Fr(texto);
   Trae su propio CSS: adoptarlo en otra misión es esa línea y ya.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CSS =
    '.fr{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;' +
    'vertical-align:middle;line-height:1.06;font-size:0.86em;margin:0 0.12em;text-align:center;}' +
    '.fr>b{display:block;font-weight:inherit;padding:0 0.18em;}' +
    '.fr>b.fd{border-top:0.085em solid currentColor;margin-top:0.05em;padding-top:0.05em;}' +
    '.fr-mix{margin-right:0.1em;}';

  function inyectaCSS() {
    if (document.getElementById('metas-frac-css')) return;
    var s = document.createElement('style');
    s.id = 'metas-frac-css';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inyectaCSS);
  else inyectaCSS();

  function armada(n, d) {
    return '<span class="fr"><b>' + n + '</b><b class="fd">' + d + '</b></span>';
  }

  // Un solo barrido: primero el número mixto, si no la fracción suelta.
  // (Dos barridos seguidos volverían a mirar el HTML ya generado.)
  var RX = /(\d+)\s+(?:y\s+)?(\d+)\/(\d+)|(\d+)\/(\d+)/g;

  function marca(t) {
    return t.replace(RX, function (todo, ent, mn, md, n, d) {
      if (ent !== undefined) return '<span class="fr-mix">' + ent + '</span>' + armada(mn, md);
      return armada(n, d);
    });
  }

  /* Convierte el texto y devuelve HTML. Salta lo que va dentro de una
     etiqueta, para no tocar atributos ni romper el marcado que ya traiga. */
  function Fr(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/<[^>]*>|[^<]+/g, function (trozo) {
      return trozo.charAt(0) === '<' ? trozo : marca(trozo);
    });
  }

  // El CSS suelto, para los documentos que se imprimen en ventana aparte
  Fr.css = CSS;
  window.Fr = Fr;
  window.MetasFracciones = { html: Fr, css: CSS };
})();
