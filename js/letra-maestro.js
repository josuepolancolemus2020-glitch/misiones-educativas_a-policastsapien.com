/* ============================================================
   M.E.T.A.S · El tamaño de letra de la aplicación del maestro
   ------------------------------------------------------------
   Medido el 9 de septiembre de 2026, con la aplicación abierta en un
   teléfono de 390 px y un aula de 43 alumnos sembrada: de los **281
   textos que el maestro tiene delante, 171 estaban por debajo de
   14 px** y 41 por debajo de 12; el más pequeño, **9 px**. Por
   pantalla: Mi aula 51 % de sus textos bajo 14 px, Plan de Acción
   88 %, Parte Mensual 83 %.

   Eso no es un detalle de estilo: un maestro présbita —y lo es la
   mayoría pasados los cuarenta— no puede pasar lista así. Con el
   zoom del navegador ya desbloqueado tenía una salida, pero el
   pellizco en un teléfono de 360 px obliga a deslizar de lado en cada
   renglón, y pasar lista son 43 renglones.

   ⚠️ **Dos caminos se descartaron MIDIENDO, y no se vuelven a
   intentar:**

   · El `+25 %` en cascada que usan las misiones (`body.letra-grande`,
     que infla todos los <span> con `!important`) **rompe la
     maquetación por 764 px**: `css/app.css` tiene 600 tamaños en px y
     30 en rem, así que la cascada no reparte y además se compone sola
     al anidarse.
   · `zoom` sobre el contenedor no desborda, pero **desalinea las
     coordenadas del puntero**, y con eso se rompe el arrastre de la
     barra de grupos, que tiene normativa propia. Lo mismo vale para
     `transform: scale`.

   Lo que sí funciona, y por qué: **una variable que multiplica cada
   `font-size` de la hoja** (`--metas-fz`). No se compone al anidarse
   —cada declaración se multiplica una vez y ya—, no toca una sola
   coordenada del puntero, y a 1 pinta EXACTAMENTE lo de siempre: la
   sonda compara los 841 elementos visibles uno por uno y salen los
   841 idénticos. Eso es lo que permite convertir la hoja entera de
   golpe sin cambiarle la pantalla a nadie hoy.

   **Siete reglas, y ninguna es de adorno:**

   1. ⚠️ **El tope es 1,45 y está medido, no elegido.** A 1,6 los 43
      chips de la lista de asistencia **recortan el nombre del
      alumno** (`.ad-chip-nom`, 21 px de texto en 19 de hueco) y a 1,8
      la tabla de Notas SACE **se sale del teléfono**. A 1,45 no se
      sale ni se recorta nada, en las ocho pestañas de Mi aula y con
      el teléfono más estrecho (360 px). El día que alguien quiera
      subirlo, primero se arregla el chip de asistencia.
   2. **No se baja de lo de siempre.** El problema es que la letra es
      pequeña; un paso «más pequeña» solo serviría para que alguien se
      quede sin poder leer la pantalla y sin saber por qué. El botón
      cicla y vuelve a normal, como el **Aa** de los dieciocho juegos
      3D — que es el mismo gesto y ya lo conoce quien usa la
      plataforma.
   3. ⚠️ **Se guarda en SU PROPIA llave** (`METAS_LETRA_V1`), nunca
      dentro de `METAS_ADMIN_V1`. Esa llave **viaja a la nube** y se
      fusiona con la del otro equipo del maestro: una preferencia de
      vista no tiene por qué entrar ahí, y menos con la fusión dato por
      dato mirando. Es la misma razón por la que el chip de grado de la
      alumna vive aparte.
   4. ⚠️ **Se aplica en el `<head>`, antes del primer pintado.** Si se
      aplicara al final, el maestro vería la pantalla pequeña y luego
      un salto — y en un teléfono lento ese salto le mueve de debajo
      del dedo lo que iba a tocar. Es la misma razón por la que
      `estrella-ganada.js` va en el `<head>`.
   5. **El botón se monta en todos los encabezados COMPACTOS**, que son
      los de las pantallas donde el maestro trabaja: así no tiene que
      volver al inicio para agrandar la letra. Y va a **44 px** aunque
      sus vecinos midan 38: hacerlo igual de pequeño habría sido copiar
      el problema en vez de dejarlo donde está —la misma decisión que se
      tomó con los chips de grado—.

      ⚠️ **En el encabezado de la portada NO cabe, y está medido:** ahí
      viven la marca, el hamburguesa, Actualizar y la medalla, y sus
      124 px de botones acaban en el píxel **361 de un teléfono de 360**
      —la medalla se sale y Actualizar deja de poder tocarse—. Además es
      la pantalla que menos lo necesita: su texto está en 15 px, no en
      11. Se pone desde cualquier pantalla del maestro y vale para toda
      la aplicación, que es una sola variable.
   6. ⚠️ **La marca de la portada NO escala**, y es la única excepción de
      la hoja (`.brand-logo` y `.brand-sub`). Es la misma razón por la que
      en la lectura proyectada no escalan la franja ni el título: el
      encabezado mide el sitio que deja, y si crece con la letra se muerde
      la cola. Medido: con la marca creciendo, a 1,45 el encabezado pasaba
      de 82 a **123 px de alto** —un sexto de la pantalla del alumno— y
      los botones se iban 14 px fuera del teléfono. Y no se gana nada: son
      26 y 8,5 px decorativos que nadie lee para trabajar.
   7. **El papel no crece.** Los informes y las fichas salen de una
      ventana aparte que no hereda esta variable, y por si acaso
      `app.css` la fuerza a 1 en `@media print`: 42 alumnos tienen que
      seguir dando 42 páginas.
   ============================================================ */
(function () {
  'use strict';

  var LLAVE = 'METAS_LETRA_V1';
  /* Cada paso está medido en las ocho pestañas de Mi aula a 360 px.
     El siguiente que había —1,6— recorta los 43 nombres de la lista de
     asistencia, así que aquí no está. */
  var PASOS = [100, 115, 130, 145];
  var NOMBRES = ['normal', 'grande', 'muy grande', 'la más grande'];

  var paso = 0;
  try {
    var g = parseInt(localStorage.getItem(LLAVE), 10);
    if (g >= 0) paso = Math.min(g, PASOS.length - 1);
  } catch (_) { /* almacén cerrado: se queda en lo de siempre */ }

  function aplicar() {
    /* Se escribe en el <html> y no en el <body>: la hoja la declara en
       `:root`, y así también alcanza a lo que se pinte fuera del body
       (los diálogos que se cuelgan del documento). */
    document.documentElement.style.setProperty('--metas-fz', PASOS[paso] / 100);
  }

  /* Regla 4: aquí mismo, con el <head> a medio leer. */
  aplicar();

  function rotular() {
    var t = 'Tamaño de la letra: ' + NOMBRES[paso] +
            (paso === PASOS.length - 1 ? '. Tócalo para volver a la normal' : '. Tócalo para agrandarla');
    var bs = document.querySelectorAll('.lm-btn');
    for (var i = 0; i < bs.length; i++) {
      bs[i].setAttribute('aria-label', t);
      bs[i].title = t;
      bs[i].dataset.paso = String(paso);
    }
  }

  function ciclo() {
    paso = (paso + 1) % PASOS.length;
    aplicar();
    try { localStorage.setItem(LLAVE, String(paso)); } catch (_) {}
    rotular();
    /* Se dice en qué paso quedó: un botón que cambia la pantalla sin
       decir qué hizo se toca una vez y no se vuelve a tocar. */
    if (typeof window.toast === 'function') window.toast('🔠 Letra: ' + NOMBRES[paso]);
  }

  function nuevoBoton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lm-btn';
    b.textContent = 'Aa';
    b.addEventListener('click', ciclo);
    return b;
  }

  function montar() {
    /* Regla 5: los compactos. El de la portada se queda fuera porque sus
       botones ya acaban en el píxel 361 de un teléfono de 360. */
    var hs = document.querySelectorAll('.app-header.compact');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      if (h.querySelector('.lm-btn')) continue;          // idempotente
      var acciones = h.querySelector('.header-actions');
      if (acciones) { acciones.insertBefore(nuevoBoton(), acciones.firstChild); continue; }

      /* En los encabezados compactos el hueco de la derecha lo ocupa
         ya el botón de Actualizar, que `app.js` mete ahí. Se envuelven
         los dos para que queden juntos y alineados a la derecha, en vez
         de pelearse por la misma celda de la rejilla. */
      var ult = h.lastElementChild;
      if (ult && ult.classList && ult.classList.contains('refresh-btn')) {
        var caja = document.createElement('div');
        caja.className = 'header-actions';
        h.insertBefore(caja, ult);
        caja.appendChild(nuevoBoton());
        caja.appendChild(ult);
        continue;
      }
      /* Y si Actualizar todavía no llegó, se deja la caja hecha: al
         encontrarla, `app.js` mete el suyo dentro. */
      if (ult && ult.tagName === 'DIV' && !ult.children.length && !ult.textContent.trim()) {
        var caja2 = document.createElement('div');
        caja2.className = 'header-actions';
        caja2.appendChild(nuevoBoton());
        ult.replaceWith(caja2);
      } else {
        h.appendChild(nuevoBoton());
      }
    }
    rotular();
  }

  /* Se monta en los dos momentos a propósito: `app.js` inyecta su botón
     de Actualizar en el mismo hueco y no hay forma de saber quién llega
     primero. Montar dos veces no duplica nada —se mira si ya está—, y
     así el orden de los <script> deja de importar. */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
  window.addEventListener('load', montar);
})();
