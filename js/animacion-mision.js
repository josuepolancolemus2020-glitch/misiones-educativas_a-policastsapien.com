/* ============================================================
   M.E.T.A.S · La animación que explica el tema
   ------------------------------------------------------------
   Va justo después de la historia con que abre la misión. La
   historia termina diciendo qué va a ver el alumno («eso es lo
   que vas a ver aquí»), y esto es lo que ve.

   APARATO COMPARTIDO, NO COPIADO. Aquí vive lo que es igual en
   todas: el escenario, la frase de cada paso, el marcador, los
   botones, el «reducir movimiento». Cada misión trae solo su
   ESCENA (qué se dibuja y dónde va cada pieza en cada paso), en
   su propia carpeta. Copiar esto misión por misión sería
   arreglarlo en una y dejarlo roto en las demás, que es la lección
   del andamio de los juegos 3D y de la sección de videos.

   Seis decisiones, y ninguna es de adorno:

   1. **La mueve el alumno, paso a paso.** No corre sola: cada
      toque es un paso, y el alumno lee la frase antes de pedir el
      siguiente. Una animación que avanza sola va al ritmo de quien
      la hizo, y el niño de cuarto que lee despacio se queda con la
      mitad. Y en el aula, con el proyector, el maestro la lleva al
      ritmo de su explicación.
   2. **Cada paso es un ESTADO, no una película.** La escena dice
      dónde va cada pieza en el paso N y el navegador la lleva hasta
      ahí con una transición de CSS. Por eso «Atrás» sale gratis,
      por eso un toque impaciente no deja nada a medias (la
      transición se redirige sola) y por eso **no hay un solo bucle
      de dibujo**: entre toque y toque el teléfono no gasta batería.
   3. **Sin movimiento también se entiende.** Con «reducir
      movimiento» cada paso llega de golpe, con la misma frase y el
      mismo dibujo. Lo que explica es el paso, no la transición.
   4. **La frase se anuncia** (aria-live): quien no ve el dibujo
      oye lo mismo que se ve. El dibujo no lleva información que no
      esté en la frase.
   5. **No da XP ni marca la sección.** Es la regla de los videos:
      nadie puede comprobar que el niño la miró, y un puntaje que se
      gana tocando «siguiente» diez veces es un puntaje regalado.
   6. **Nada sale del sitio.** Un SVG y dos archivos locales; sin
      biblioteca y sin CDN, así que abre sin señal igual que el
      resto de la misión.

   Cómo se monta, en la misión:

     <link rel="stylesheet" href="../../css/animacion-mision.css">  (tras el CSS de la misión)
     <div class="card ac-teal" data-animacion> <h2>…</h2> <div id="amX">frase de reserva</div> </div>
     <script src="../../js/animacion-mision.js"></script>
     <script src="js/animacion-<tema>.js"></script>            (llama a AnimacionMision.montar)

   La escena es un objeto con:
     vista      [ancho, alto] del dibujo (viewBox)
     describe   lo que se ve, en una frase (para el lector de pantalla)
     pasos      cuántos estados hay (0 … pasos-1)
     construir(svg, a)       arma el dibujo UNA vez
     pintar(n, antes, a)     pone cada pieza donde va en el paso n
     texto(n)                la frase del paso
     boton(n)                el rótulo del botón que avanza
     atajo(n)                { rotulo, a } o null: un salto opcional
     marcador(n, antes)      { cifra, palabras, salto }
   ============================================================ */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var sinMovimiento = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  var montadas = 0;

  function el(tag, attrs, padre) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) n.setAttribute(k, attrs[k]);
      }
    }
    if (padre) padre.appendChild(n);
    return n;
  }

  function r2(v) { return Math.round(v * 100) / 100; }
  function r4(v) { return Math.round(v * 10000) / 10000; }

  /* Pone una pieza en su sitio. SIEMPRE las tres funciones y en este
     orden: con la misma lista en los dos extremos, el navegador
     interpola cada una por su lado, y un huevo que estaba girado en el
     montón se endereza mientras viaja a su fila. Con listas distintas
     interpolaría matrices y el huevo daría una voltereta rara. */
  function mover(n, x, y, giro, esc, demora) {
    var t = 'translate(' + r2(x) + 'px,' + r2(y) + 'px) rotate(' + r2(giro || 0) +
      'deg) scale(' + r4(esc == null ? 1 : esc) + ')';
    var d = Math.round(demora || 0) + 'ms';
    /* Cada paso vuelve a decir dónde va TODO, también lo que no se mueve.
       Reescribir el mismo estilo le hace recalcular al navegador lo que ya
       sabía, así que se guarda el último y se salta si es igual. */
    if (n._amT === t && n._amD === d) return;
    n._amT = t; n._amD = d;
    n.style.setProperty('--d', d);
    n.style.transform = t;
  }

  function ver(n, si, demora) {
    if (demora != null) {
      var d = Math.round(demora) + 'ms';
      if (n._amD !== d) { n._amD = d; n.style.setProperty('--d', d); }
    }
    n.classList.toggle('am-fuera', !si);
  }

  /* Dibuja una línea poco a poco (una flecha que sale mientras la rana
     salta): la raya entera es un solo guion del largo del camino, y se
     corre de fuera a dentro. Se mide el largo una vez; sin movimiento
     (.am-quieto) la raya aparece de golpe, como todo lo demás. */
  function trazar(n, si, demora) {
    if (n._amL == null) {
      try { n._amL = Math.ceil(n.getTotalLength()) + 2; } catch (e) { n._amL = 0; }
      if (n._amL) n.style.strokeDasharray = n._amL + ' ' + n._amL;
    }
    if (!n._amL) return;
    if (demora != null) n.style.setProperty('--d', Math.round(demora) + 'ms');
    n.style.strokeDashoffset = si ? '0' : String(n._amL);
  }

  /* Azar con semilla (mulberry32): el montón de huevos sale revuelto,
     pero SIEMPRE igual. Lo que se ve tiene que poder repetirse, para
     contarlo en el aula y para que una sonda lo mida. */
  function azar(semilla) {
    var t = semilla >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var x = Math.imul(t ^ (t >>> 15), 1 | t);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function barajar(lista, rnd) {
    for (var i = lista.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = lista[i]; lista[i] = lista[j]; lista[j] = t;
    }
    return lista;
  }

  /* Leer una medida obliga al navegador a asentar los estilos que se
     acaban de poner. Hace falta al crear piezas nuevas a medio camino:
     si no, nacen ya en su sitio final y la transición no se ve. */
  function asentar(n) { if (n && n.getBoundingClientRect) n.getBoundingClientRect(); }

  /* La cifra del marcador puede ser una fracción («1/5»). Si la misión trae
     js/metas-fracciones.js, se escribe como en el cuaderno, apilada; si no,
     tal cual. El marcador no se anuncia (aria-hidden): quien usa lector de
     pantalla la oye en la frase, dicha con palabras. */
  function ponCifra(n, txt) {
    if (window.MetasFracciones && /\d\/\d/.test(txt)) n.innerHTML = window.MetasFracciones.html(txt);
    else n.textContent = txt;
  }

  function crear(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function montar(destino, escena) {
    var raiz = typeof destino === 'string' ? document.querySelector(destino) : destino;
    if (!raiz || !escena || !escena.pasos) return null;
    var id = 'am' + (++montadas);

    /* El bloque trae una frase de reserva escrita en el HTML: si este
       archivo no llega, el alumno lee eso en vez de un hueco. Llegó,
       así que se quita. */
    raiz.textContent = '';
    raiz.classList.add('am-raiz');
    /* ⚠️ Las fracciones de aquí las escribe el aparato, no el barrido de la
       misión. Las misiones de fracciones apilan «3/4» en toda la página al
       cargar (js/metas-fracciones.js, Fr.barrer), y ese barrido metería HTML
       dentro del texto del dibujo, donde un SVG no lo pinta, y dejaría
       apilada la frase del primer paso y no la de los demás. */
    raiz.setAttribute('data-sinfr', '');

    var marcador = crear('div', 'am-marcador');
    marcador.setAttribute('aria-hidden', 'true');
    var fila = crear('div', 'am-fila');
    var cifra = crear('b', 'am-cifra');
    var salto = crear('i', 'am-salto');
    var palabras = crear('em', 'am-palabras');
    fila.appendChild(cifra);
    fila.appendChild(salto);
    marcador.appendChild(fila);
    marcador.appendChild(palabras);

    var escenario = crear('div', 'am-escenario');
    var vista = escena.vista || [320, 200];
    var svg = el('svg', {
      viewBox: '0 0 ' + vista[0] + ' ' + vista[1],
      role: 'img',
      'aria-label': escena.describe || '',
      focusable: 'false'
    });
    escenario.appendChild(svg);

    var avance = crear('div', 'am-avance');
    avance.setAttribute('aria-hidden', 'true');
    var barra = crear('i');
    avance.appendChild(barra);

    var texto = crear('p', 'am-texto');
    texto.setAttribute('aria-live', 'polite');

    var mandos = crear('div', 'am-mandos');
    /* «Atrás» va solo con la flecha: con la palabra entera, el botón que
       avanza se partía en dos renglones en un teléfono de 360 px. El
       nombre lo lleva igual para el lector de pantalla y para el dedo que
       se queda encima (title). */
    var atras = crear('button', 'am-atras', '◀');
    var sigue = crear('button', 'am-sigue');
    var atajo = crear('button', 'am-atajo');
    atras.type = sigue.type = atajo.type = 'button';
    atras.setAttribute('aria-label', 'Paso anterior');
    atras.title = 'Atrás';
    mandos.appendChild(atras);
    mandos.appendChild(sigue);
    mandos.appendChild(atajo);

    raiz.appendChild(marcador);
    raiz.appendChild(escenario);
    raiz.appendChild(avance);
    raiz.appendChild(texto);
    raiz.appendChild(mandos);

    var ayuda = {
      id: id,
      svg: svg,
      el: el,
      mover: mover,
      ver: ver,
      trazar: trazar,
      azar: azar,
      barajar: barajar,
      asentar: function () { asentar(svg); },
      /* ¿Este paso llega sin movimiento? (el primer pintado, un salto con
         «Atrás» hecho por código, o «reducir movimiento»). Lo que la escena
         anime con keyframes propios —un brinco— lo tiene que preguntar,
         porque .am-quieto solo apaga las transiciones. */
      quieto: function () { return svg.classList.contains('am-quieto'); }
    };

    escena.construir(svg, ayuda);

    var n = 0;
    var destinoAtajo = null;

    function marcar(m, antes) {
      var dato = escena.marcador ? escena.marcador(m, antes) : null;
      if (!dato) { marcador.hidden = true; return; }
      marcador.hidden = false;
      if (cifra._amTxt !== dato.cifra) {
        cifra._amTxt = dato.cifra;
        ponCifra(cifra, dato.cifra);
        cifra.classList.remove('am-pop');
        void cifra.offsetWidth;          // reinicia la animación del número
        cifra.classList.add('am-pop');
      }
      palabras.textContent = dato.palabras || '';
      salto.classList.remove('am-sube');
      if (dato.salto) {
        salto.textContent = dato.salto;
        void salto.offsetWidth;
        salto.classList.add('am-sube');
      }
    }

    function ir(m, animar) {
      m = Math.max(0, Math.min(escena.pasos - 1, m));
      var antes = n;
      n = m;
      svg.classList.toggle('am-quieto', !animar || sinMovimiento.matches);
      escena.pintar(n, antes, ayuda);

      texto.textContent = escena.texto(n);
      sigue.textContent = escena.boton(n);
      atras.disabled = n === 0;
      var a = escena.atajo ? escena.atajo(n) : null;
      destinoAtajo = a ? a.a : null;
      /* Si el atajo desaparece con el foco encima, el foco se iría al
         <body> y quien usa el teclado tendría que volver a buscar la
         animación desde arriba. Se lo lleva el botón que avanza. */
      if (!a && document.activeElement === atajo) sigue.focus();
      atajo.hidden = !a;
      if (a) atajo.textContent = a.rotulo;
      barra.style.width = (escena.pasos > 1 ? (100 * n / (escena.pasos - 1)) : 100) + '%';
      marcar(n, antes);
    }

    sigue.addEventListener('click', function () {
      ir(n >= escena.pasos - 1 ? 0 : n + 1, true);
    });
    atras.addEventListener('click', function () {
      ir(n - 1, true);
      /* En el paso 0 «Atrás» se apaga, y un botón apagado suelta el
         foco. Se lo queda el que avanza. */
      if (n === 0) sigue.focus();
    });
    atajo.addEventListener('click', function () {
      if (destinoAtajo != null) ir(destinoAtajo, true);
    });

    /* El primer pintado no tiene de dónde venir: sin movimiento, y se
       asienta antes de soltar las transiciones. Si no, los huevos
       saldrían volando desde la esquina de arriba a la izquierda. */
    svg.classList.add('am-quieto');
    ir(0, false);
    asentar(svg);
    if (!sinMovimiento.matches) svg.classList.remove('am-quieto');

    /* ⚠️ El botón que avanza NO se mueve de un paso a otro. La frase y
       las palabras del marcador cambian de largo en cada paso, y en un
       teléfono de 360 px, con la letra grande con que abre la misión, el
       botón subía y bajaba hasta 58 px: el dedo del que toca «siguiente»
       de corrido caía en el hueco o encima de la frase, y en Valor
       Posicional se movía hasta el dibujo. Un alto mínimo escrito a mano
       no alcanza, porque cuántos renglones son depende del ancho, de la
       letra y de la frase. Así que se MIDE: cada frase y cada rótulo de la
       escena se escriben en una copia invisible del mismo ancho, y se
       queda el alto del más largo.
       Se mide en una copia y no en la frase de verdad porque esa se
       anuncia (aria-live): escribir en ella todas las frases seguidas
       sería leérselas de golpe a quien usa lector de pantalla. */
    var medida = crear('div', 'am-medida');
    medida.setAttribute('aria-hidden', 'true');
    var mTexto = crear('p', 'am-texto');
    var mPalabras = crear('em', 'am-palabras');
    /* Y la cifra, que tampoco mide siempre lo mismo: una fracción apilada
       ocupa dos renglones y un número, uno. Sin medirla, el dibujo bajaba en
       los pasos de la fracción y subía en los del número. */
    var mFila = crear('div', 'am-fila');
    var mCifra = crear('b', 'am-cifra');
    mFila.appendChild(mCifra);
    medida.appendChild(mTexto);
    medida.appendChild(mPalabras);
    medida.appendChild(mFila);
    raiz.appendChild(medida);
    var anchoMedido = -1;
    function igualar(forzar) {
      var ancho = raiz.clientWidth;
      /* Con la sección escondida no hay nada que medir: se mide al volver
         a verla (el ResizeObserver avisa cuando pasa de 0 a su ancho). */
      if (!ancho) { anchoMedido = -1; return; }
      if (!forzar && ancho === anchoMedido) return;
      anchoMedido = ancho;
      var altoT = 0, altoP = 0, altoC = 0;
      for (var m = 0; m < escena.pasos; m++) {
        mTexto.textContent = escena.texto(m);
        var dato = escena.marcador ? escena.marcador(m, m) : null;
        mPalabras.textContent = dato && dato.palabras ? dato.palabras : '';
        ponCifra(mCifra, dato && dato.cifra ? dato.cifra : '');
        altoT = Math.max(altoT, mTexto.getBoundingClientRect().height);
        altoP = Math.max(altoP, mPalabras.getBoundingClientRect().height);
        altoC = Math.max(altoC, mCifra.getBoundingClientRect().height);
      }
      texto.style.minHeight = Math.ceil(altoT) + 'px';
      palabras.style.minHeight = Math.ceil(altoP) + 'px';
      fila.style.minHeight = Math.ceil(altoC) + 'px';
    }
    /* Los avisos se juntan: la letra grande llega al <body> DESPUÉS de
       montar (la pone js/metas-presentacion.js) y el cambio de alto que
       trae dispara también el de tamaño. Si el último aviso borrara al
       anterior, el «hay que volver a medir» se perdía y la animación se
       quedaba medida con la letra chica: pasaba una vez de cada dos. */
    var espera = null, forzarLuego = false;
    function igualarLuego(forzar) {
      forzarLuego = forzarLuego || forzar;
      clearTimeout(espera);
      espera = setTimeout(function () {
        var f = forzarLuego;
        forzarLuego = false;
        igualar(f);
      }, 80);
    }
    igualar(true);
    /* Tres cosas cambian los renglones: que llegue la letra de la misión
       (sale primero con la del sistema), que cambie el ancho (el teléfono
       se acuesta) y que se ponga o se quite la letra grande, que es una
       clase en el <body> y no cambia el ancho. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { igualar(true); });
    if (window.ResizeObserver) new ResizeObserver(function () { igualarLuego(false); }).observe(raiz);
    else window.addEventListener('resize', function () { igualarLuego(false); });
    if (window.MutationObserver) {
      new MutationObserver(function () { igualarLuego(true); })
        .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    var control = {
      ir: function (m) { ir(m, false); },
      paso: function () { return n; },
      pasos: escena.pasos
    };
    raiz.amControl = control;
    return control;
  }

  window.AnimacionMision = { montar: montar };
})();
