/* Lo que la familia lee de las notas de SU clave.
   La base ya decidió qué filas salen (metas.familia_notas): aquí solo se
   pintan. Si la respuesta trae dos niños, o un valor que no es una nota,
   no se pinta nada: mejor callarse que mezclar o repetir lo que llegó de más. */
(function (root) {
  'use strict';

  var PARCIALES = {
    I: 'Primer parcial',
    II: 'Segundo parcial',
    III: 'Tercer parcial',
    IV: 'Cuarto parcial',
    REC: 'Recuperación'
  };
  var ORDEN = { I: 1, II: 2, III: 3, IV: 4, REC: 5 };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* El valor llega como texto («85.00»), igual que el dinero, para no
     perder los centavos al pasar por JSON. Se muestra 85, o 91.5 si hay
     décimas. Cualquier otra cosa se descarta. */
  function notaBonita(valor) {
    var s = String(valor == null ? '' : valor).trim();
    if (!/^\d{1,3}\.\d{2}$/.test(s)) return null;
    var partes = s.split('.');
    var entera = Number(partes[0]);
    var decimas = Number(partes[1]);
    if (!isFinite(entera) || !isFinite(decimas)) return null;
    var centavos = entera * 100 + decimas;
    if (centavos > 10000) return null;
    var texto = partes[1] === '00' ? String(entera) : (partes[1].charAt(1) === '0' ? entera + '.' + partes[1].charAt(0) : s);
    return { texto: texto, bajo: centavos < 7000 };
  }

  function limpiar(filas) {
    if (!Array.isArray(filas) || !filas.length) return [];
    var out = [];
    var nombres = {};
    var nNombres = 0;
    for (var i = 0; i < filas.length; i++) {
      var f = filas[i];
      if (!f || typeof f !== 'object') continue;
      var nombre = String(f.nombre || '').trim();
      var asignatura = String(f.asignatura || '').trim();
      var periodo = String(f.periodo || '').trim();
      var nota = notaBonita(f.valor);
      if (!nombre || nombre.length > 40 || !asignatura || asignatura.length > 80 || !PARCIALES[periodo] || !nota) continue;
      if (!nombres[nombre]) { nombres[nombre] = true; nNombres++; }
      out.push({ nombre: nombre, asignatura: asignatura, periodo: periodo, texto: nota.texto, bajo: nota.bajo });
    }
    /* Dos nombres en la misma respuesta: no es una sola clave. No se muestra
       ninguno, ni el número, para no atribuirle a un niño la nota de otro. */
    if (nNombres !== 1) return [];
    return out;
  }

  function html(filas, estado) {
    if (estado === 'error') {
      return '<span data-metas="familia-notas">📝 Ahora no pude ver las notas. Intente de nuevo en un rato.</span>';
    }
    var rows = limpiar(filas);
    if (Array.isArray(filas) && filas.length && !rows.length) {
      return '<span data-metas="familia-notas">📝 No se pueden mostrar las notas.</span>';
    }
    if (!rows.length) {
      return '<span data-metas="familia-notas">📝 Todavía no hay notas.</span>';
    }
    var grupos = {};
    rows.forEach(function (r) {
      (grupos[r.periodo] || (grupos[r.periodo] = [])).push(r);
    });
    var periodos = Object.keys(grupos).sort(function (a, b) { return ORDEN[a] - ORDEN[b]; });
    var t = '<span data-metas="familia-notas">📝 <strong>Notas de ' + esc(rows[0].nombre) + '</strong>';
    periodos.forEach(function (p) {
      t += '<br><strong>' + esc(PARCIALES[p]) + '</strong>';
      grupos[p].sort(function (a, b) { return a.asignatura.localeCompare(b.asignatura, 'es'); });
      grupos[p].forEach(function (r) {
        var marca = r.bajo ? '✗' : '✓';
        var palabra = r.bajo ? 'hay que repasar' : 'va bien';
        /* El número va en el color del texto: si fuera en verde, un 64
           parecería aprobado. Lo que distingue es la marca y la palabra. */
        t += '<br>' + marca + ' <strong>' + esc(r.asignatura) + '</strong>: ' + esc(r.texto) + ', ' + palabra;
      });
    });
    return t + '</span>';
  }

  var api = { html: html, limpiar: limpiar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.MetasNotasFamilia = api;
})(typeof window !== 'undefined' ? window : global);
