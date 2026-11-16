/* =====================================================================
   M.E.T.A.S — js/datos/montos.js · el dinero, siempre como texto
   ---------------------------------------------------------------------
   Regla 19 de CLAUDE.md. JavaScript guarda todo número como un double:
   0.10 + 0.20 da 0.30000000000000004, y un «150.00» leído como número ya
   no es lo que el docente escribió. Por eso aquí el dinero entra como
   texto, se convierte a CENTAVOS ENTEROS (BigInt, que no redondea nada),
   se suma y se compara así, y sale otra vez como texto con dos decimales:
   «150.00». Nunca Number() ni parseFloat() sobre un monto.

   Cómo se lee lo que escribe el docente (03, 3.11):
     150 · 150.00 · L 150 · L. 150        → 150.00
     150.5 · 150,5 · 150,50               → 150.50
     1500 · 1 500 · 1,500.50 · 1.500,50   → 1500.00 · 1500.50
     1,500 · 1.500                        → se PREGUNTA (¿mil quinientos o uno con cincuenta?)
     150.555 · -5 · abc                   → no se acepta
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  // La base acepta hasta 10 cifras enteras (metas._monto).
  var MAX_ENTERAS = 10;

  function canonico(enteras, decimales) {
    var e = String(enteras).replace(/^0+(?=\d)/, '');
    var d = (String(decimales || '') + '00').slice(0, 2);
    return e + '.' + d;
  }

  function enLetras(valor) {
    // «1500.00» → «L 1,500.00»: así lo ve el docente en las preguntas.
    var p = valor.split('.');
    return 'L ' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1];
  }

  function leer(texto) {
    var s = String(texto == null ? '' : texto).trim();
    s = s.replace(/^L(ps)?\.?\s*/i, '');
    if (/^-/.test(s)) return { ok: false, motivo: 'negativo' };
    // Espacios como separador de miles: «1 500», «12 345,50».
    if (/^\d{1,3}( \d{3})+([.,]\d{1,2})?$/.test(s)) s = s.replace(/ /g, '');
    var m;
    var valor = null;
    if ((m = /^(\d+)$/.exec(s))) {
      valor = canonico(m[1], '');
    } else if ((m = /^(\d+)[.,](\d{1,2})$/.exec(s))) {
      valor = canonico(m[1], m[2]);
    } else if ((m = /^(\d{1,3})([.,])(\d{3})$/.exec(s))) {
      // Coma o punto seguidos de exactamente tres cifras: no se adivina.
      // Leído como decimales solo tiene sentido si la tercera cifra es 0
      // («1.500» = 1.50); si no («150.555»), no es un monto.
      if (m[3].charAt(2) !== '0') return { ok: false, motivo: 'no_es_monto' };
      var miles = canonico(m[1] + m[3], '');
      var uno = canonico(m[1], m[3].slice(0, 2));
      return {
        ok: false,
        pregunta: {
          tipo: 'monto_ambiguo',
          texto: '¿Quisiste decir ' + enLetras(miles) + ' o ' + enLetras(uno) + '?',
          opciones: [{ etiqueta: enLetras(miles), valor: miles }, { etiqueta: enLetras(uno), valor: uno }],
        },
      };
    } else if ((m = /^(\d{1,3}(?:,\d{3})+)(?:\.(\d{1,2}))?$/.exec(s)) && (m[2] || m[1].split(',').length > 2)) {
      valor = canonico(m[1].replace(/,/g, ''), m[2]);          // 1,500.50 · 1,500,000
    } else if ((m = /^(\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?$/.exec(s)) && (m[2] || m[1].split('.').length > 2)) {
      valor = canonico(m[1].replace(/\./g, ''), m[2]);         // 1.500,50 · 1.500.000
    }
    if (valor === null) return { ok: false, motivo: 'no_es_monto' };
    if (valor.split('.')[0].length > MAX_ENTERAS) return { ok: false, motivo: 'muy_grande' };
    return { ok: true, valor: valor };
  }

  // ── Centavos enteros ─────────────────────────────────────────────────
  // Solo acepta el texto canónico que dan la base y leer(): «-12.30».
  function centavos(texto) {
    var m = /^(-?)(\d+)\.(\d{2})$/.exec(String(texto));
    if (!m) throw new Error('monto que no es texto canónico: ' + texto);
    return BigInt(m[1] + m[2] + m[3]);
  }

  function desdeCentavos(c) {
    var neg = c < 0n;
    var a = (neg ? -c : c).toString();
    while (a.length < 3) a = '0' + a;
    return (neg ? '-' : '') + a.slice(0, -2) + '.' + a.slice(-2);
  }

  function sumar(textos) {
    var t = 0n;
    for (var i = 0; i < textos.length; i++) {
      if (textos[i] != null) t += centavos(textos[i]);
    }
    return desdeCentavos(t);
  }

  function restar(a, b) {
    return desdeCentavos(centavos(a) - centavos(b));
  }

  // -1, 0 o 1, como cualquier comparador.
  function comparar(a, b) {
    var x = centavos(a);
    var y = centavos(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }

  function sinNegativo(texto) {
    return centavos(texto) < 0n ? '0.00' : texto;
  }

  M.montos = {
    leer: leer,
    sumar: sumar,
    restar: restar,
    comparar: comparar,
    sinNegativo: sinNegativo,
    centavos: centavos,
    desdeCentavos: desdeCentavos,
    enLetras: enLetras,
  };
})(window);
