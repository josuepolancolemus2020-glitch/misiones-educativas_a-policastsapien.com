/* ============================================================
   M.E.T.A.S · Motor de misiones (primera pieza: la puerta)
   ------------------------------------------------------------
   mision.html estuvo rota desde abril de 2026: pedía este archivo, que
   no existía, y se quedaba en «Cargando misión...» para siempre.

   Hoy el motor hace una sola cosa: recibe `mision.html?m=<carpeta>` y
   lleva a esa misión. No pinta ninguna misión todavía; cada una sigue
   en su página de siempre, con su misma dirección, para que el QR
   impreso y la ficha sigan valiendo.

   Por qué no hay pantalla intermedia: quien llega aquí ya eligió la
   misión. Mostrarle su nombre y un botón «Entrar» sería hacerle
   confirmar lo que acaba de pedir. Si la misión existe, se abre; solo
   cuando no se puede abrir hay algo que decir, y entonces se dice una
   cosa y se ofrece un botón.

   La carpeta es lo que identifica a la misión (`2y3ciclo-la-celula`),
   no su número: los números del catálogo no son correlativos y no dicen
   nada a quien lee el enlace. Por eso `?id=N` no se atiende.
   ============================================================ */
(function (global) {
  'use strict';

  /* La carpeta de una misión sale de su dirección en el catálogo
     (`misiones/<carpeta>/<página>.html`): así no hay un segundo dato que
     mantener al día junto al catálogo. */
  function carpetaDe(mision) {
    var partes = String((mision && mision.url) || '').split('/');
    return partes.length >= 3 && partes[0] === 'misiones' ? partes[1] : '';
  }

  function catalogo() {
    return (typeof MISSIONS !== 'undefined' && Array.isArray(MISSIONS)) ? MISSIONS : [];
  }

  /* Se compara sin distinguir mayúsculas: hay una carpeta con mayúsculas
     y un enlace copiado a mano no debería fallar por eso. */
  function buscar(carpeta) {
    var pedida = String(carpeta || '').trim().toLowerCase();
    if (!pedida) return null;
    var lista = catalogo();
    for (var i = 0; i < lista.length; i++) {
      if (carpetaDe(lista[i]).toLowerCase() === pedida) return lista[i];
    }
    return null;
  }

  function pedidaEn(busqueda) {
    try { return (new URLSearchParams(busqueda || '').get('m') || '').trim(); }
    catch (e) { return ''; }
  }

  /* La dirección sale siempre del catálogo, nunca del enlace: lo que
     viene en `?m=` solo sirve para buscar. Así esta página no puede
     usarse para mandar a nadie a otro sitio. */
  function direccionDe(mision) {
    return mision.url.split('/').map(encodeURIComponent).join('/');
  }

  function mostrarAviso(pedida) {
    var doc = global.document;
    var texto = doc.getElementById('aviso-texto');
    if (texto) {
      texto.textContent = pedida
        ? 'Puede que el enlace esté mal escrito o que la misión haya cambiado de nombre.'
        : 'Este enlace no dice qué misión abrir.';
    }
    doc.documentElement.classList.remove('abriendo');
    var boton = doc.getElementById('aviso-boton');
    if (boton && boton.focus) boton.focus();
  }

  function iniciar() {
    var pedida = pedidaEn(global.location.search);
    var mision = buscar(pedida);
    if (mision) {
      /* `replace` y no `href`: si quedara en el historial, el botón de
         atrás del teléfono volvería a esta puerta y la puerta lo
         devolvería a la misión. No se podría salir. */
      global.location.replace(direccionDe(mision));
      return;
    }
    mostrarAviso(pedida);
  }

  global.MotorMisiones = { iniciar: iniciar, buscar: buscar, carpetaDe: carpetaDe };
  iniciar();
})(window);
