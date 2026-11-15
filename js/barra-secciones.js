/* ============================================================
   M.E.T.A.S · La barra de secciones, arriba y siempre a la vista
   ------------------------------------------------------------
   El porqué está entero en css/barra-secciones.css. Aquí va lo que
   no se puede hacer con CSS:

   1. SUBIRLA. En las 66 misiones del alumno el <nav> está escrito
      DESPUÉS de las veinte secciones. Se mueve aquí y no en los 66
      archivos: mover un bloque a mano 66 veces es garantizar que en
      alguno quede a medias, y además así lo hereda la misión que
      entre mañana. Las 8 del maestro ya lo tienen arriba —esa es la
      forma buena, y de ahí salió esta— y no se tocan.

      ⚠️ Y no es solo deslizar: la barra es role="tablist" y las
      secciones role="tabpanel". Estaba anunciándose DESPUÉS de los
      veinte paneles, así que quien usa un lector de pantalla oía la
      misión entera antes de enterarse de que había pestañas.

   2. TRAER EL CHIP ACTIVO A LA VISTA. Con una sola fila que se
      desliza, el chip de la sección en que está el alumno puede
      quedar fuera. Se centra a mano moviendo scrollLeft, NUNCA con
      scrollIntoView: ese arrastra también la página y le movería de
      debajo del dedo lo que está leyendo.

   3. SABER CUÁNDO SE LLEGÓ A CADA PUNTA, para apagar la sombra que
      avisa de que hay más.

   No toca go() ni ninguna función de la misión: escucha los cambios
   de clase de la barra, así que sirve igual la venga de un toque en
   la pestaña, de la flecha del final de una sección o de
   abrirSeccionDelEnlace() al volver de un juego 3D.
   ============================================================ */
(function () {
  'use strict';

  function activo(nav) {
    /* .nav-t.active en las misiones del alumno; button.on en las del
       maestro, que arman su barra desde JS con otras clases. */
    return nav.querySelector('.nav-t.active, .nav-t[aria-selected="true"], button.on');
  }

  function centrar(nav) {
    var c = activo(nav);
    if (!c) return;
    var meta = c.offsetLeft - (nav.clientWidth - c.offsetWidth) / 2;
    var max = nav.scrollWidth - nav.clientWidth;
    nav.scrollLeft = Math.max(0, Math.min(max, meta));
  }

  function sombras(marco, nav) {
    var max = nav.scrollWidth - nav.clientWidth;
    /* 2 px de margen: en pantallas con escala fraccionaria el
       scrollLeft del final no cae en el máximo redondo y la sombra
       se quedaba encendida contra el borde. */
    marco.classList.toggle('bs-izq', nav.scrollLeft > 2);
    marco.classList.toggle('bs-der', nav.scrollLeft < max - 2);
  }

  function montar() {
    var nav = document.querySelector('nav.nav');
    var main = document.querySelector('main.main');
    if (!nav || !main || nav.dataset.bsPuesta) return;
    nav.dataset.bsPuesta = '1';

    /* Arriba del contenido, si no lo estaba ya. compareDocumentPosition
       es lo que distingue las 66 de las 8 sin listas escritas a mano,
       que envejecen con la misión siguiente. */
    var marco = document.createElement('div');
    marco.className = 'bs-marco';
    if (nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING) {
      main.parentNode.insertBefore(marco, main);
    } else {
      nav.parentNode.insertBefore(marco, nav);
    }
    marco.appendChild(nav);

    /* ⚠️ Ocho misiones —las del maestro— traen la barra SIN fondo. Quieta al
       final del documento no se notaba; pegada arriba, el contenido se vería
       pasar por debajo. Se le pone el de la página, medido UNA vez y solo a
       las que lo necesitan: las 66 del alumno traen el suyo en --nav-bg y su
       modo oscuro lo cambia solo, sin que aquí haya que enterarse.

       ⚠️ Y se mide una vez al montar, nunca al cambiar de tema: .nav lleva
       un `transition: background .3s`, así que leer el color en el instante
       del cambio devuelve el VIEJO. Eso ya me dio una falsa costura. */
    if (/^(transparent|rgba\(0, 0, 0, 0\))$/.test(getComputedStyle(nav).backgroundColor)) {
      marco.style.setProperty('--bs-fondo', getComputedStyle(document.body).backgroundColor);
    }

    var pintar = function () { sombras(marco, nav); };
    nav.addEventListener('scroll', pintar, { passive: true });
    window.addEventListener('resize', function () { centrar(nav); pintar(); }, { passive: true });

    /* 4. GUARDARLA AL BAJAR, solo si es alta. Con todas las pestañas a
       la vista, en un teléfono de 360 px la barra ocupa 3 filas
       (unos 160 px) y pegada arriba le quitaba un cuarto de pantalla
       a la lectura. Al bajar leyendo se guarda; al subir un poco, o al
       cambiar de sección, vuelve.

       ⚠️ En v542 esto no funcionaba en el teléfono de verdad, por dos
       razones que la sonda no veía:

       · «Alta» era «más del 20 % del alto de la ventana». En un Android
         de 360×800, y más en la app instalada (sin barra de
         direcciones), eso son 160 px, y la barra de 3 filas de Pensar
         con Orden mide 157: nunca se guardaba. Encima, Chrome esconde
         su barra de direcciones al bajar y la ventana crece en pleno
         gesto. Ahora se cuentan FILAS: con 3 o más se guarda, con 1 o
         2 (tablet y computadora con 15 pestañas) nunca. Las filas no
         dependen del alto del teléfono ni del modo de la app. Queda un
         respaldo para el teléfono acostado: si la barra pasa del 25 %
         de la ventana, también se guarda.

       · No se guardaba «si el foco estaba dentro de la barra», pensado
         para el teclado. Pero en el teléfono, TOCAR una pestaña deja el
         foco en ese botón: después del primer toque no se guardaba
         nunca más. Ahora solo cuenta el foco de teclado (:focus-visible),
         que tocar con el dedo no enciende.

       El ancla marca dónde empieza la barra en el documento: mientras
       el alumno no la haya pasado, la barra está en su sitio natural y
       guardarla dejaría un hueco. */
    var ancla = document.createElement('div');
    ancla.setAttribute('aria-hidden', 'true');
    marco.parentNode.insertBefore(ancla, marco);
    var filas = function () {
      var ys = {}, n = 0;
      var chips = nav.children;
      for (var i = 0; i < chips.length; i++) {
        if (!chips[i].offsetParent) continue;
        var t = Math.round(chips[i].offsetTop / 8);
        if (!ys[t]) { ys[t] = 1; n++; }
      }
      return n;
    };
    var esAlta = function () {
      return filas() >= 3 || marco.offsetHeight > window.innerHeight * 0.25;
    };
    var focoDeTeclado = function () {
      try { return !!marco.querySelector(':focus-visible'); }
      catch (e) { return false; } /* navegador viejo sin :focus-visible: el toque manda */
    };
    var ultimoY = window.scrollY;
    var mostrar = function () { marco.classList.remove('bs-guardada'); };
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var pasada = ancla.getBoundingClientRect().top + marco.offsetHeight < 0;
      /* 8 px de margen: el temblor del dedo al leer no la hace saltar. */
      if (!pasada || y < ultimoY - 8 || !esAlta()) mostrar();
      else if (y > ultimoY + 8 && !focoDeTeclado()) marco.classList.add('bs-guardada');
      if (Math.abs(y - ultimoY) > 8 || !pasada) ultimoY = y;
    }, { passive: true });
    /* Quien navega con teclado tiene que ver dónde está el foco. */
    marco.addEventListener('focusin', function () { if (focoDeTeclado()) mostrar(); });

    /* Cambiar de sección lo hace go(), que no es de aquí y vive
       copiada en las 74 misiones. En vez de engancharla se mira la
       barra: cualquier cosa que marque otro chip pasa por aquí. */
    new MutationObserver(function () { mostrar(); centrar(nav); pintar(); })
      .observe(nav, { attributes: true, attributeFilter: ['class', 'aria-selected'], subtree: true });

    centrar(nav);
    pintar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/* ============================================================
   CÓMO SE PONE EN UNA MISIÓN NUEVA — dos líneas, y ninguna toca
   el aparato:

   El <link>, DESPUÉS del CSS de la misión (de ahí saca su color):
     <link rel="stylesheet" href="../../css/barra-secciones.css">

   Y el <script>, al final del <body>:
     <script src="../../js/barra-secciones.js"></script>

   Lo comprueba _dev/verifica-barra-secciones.js en TODAS, que es
   lo que se multiplica al copiar una misión.
   ============================================================ */
