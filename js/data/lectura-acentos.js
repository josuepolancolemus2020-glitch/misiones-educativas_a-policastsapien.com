/* ══════════════════════════════════════════════════════════════
   🔤 SÍLABAS Y ACENTO — el lector que dice por qué lleva tilde

   Igual que js/data/lectura-numerales.js le dice al alumno cuánto vale
   «trescientos cuarenta y cinco mil», esto le dice POR QUÉ «canción»
   lleva tilde y «cancion» no existiría. Y por lo mismo tiene prueba
   propia: si se equivoca, no falla una pantalla — le enseña mal la regla
   a un niño.

     node _dev/prueba-acentos.js

   ── Qué hace ──
   · silabas('canción')   → ['can', 'ción']
   · clasificar('árbol')  → { clase: 'llana', tilde: true, regla: '…' }
   · conTilde(palabras)   → las que llevan tilde, con su clase

   ── Cómo separa ──
   Primero arma los NÚCLEOS (grupos de vocales que suenan juntos) y
   después reparte las consonantes. Un grupo de vocales es una sola
   sílaba si forma diptongo o triptongo, y son dos si hay hiato:

     · fuerte + fuerte  → hiato   (le-er, ca-os, po-e-ta)
     · fuerte + débil   → diptongo (cau-sa, pei-ne)  …salvo que
     · el débil lleve tilde → hiato (dí-a, ra-íz, o-í-do)
     · débil + débil    → diptongo (ciu-dad, cui-da)

   Las consonantes se reparten con la regla clásica, respetando los
   grupos que no se separan nunca (pr, br, tr, dr, cr, gr, fr, pl, bl,
   cl, gl, fl) y los dígrafos (ch, ll, rr).

   ── Dónde cae la fuerza ──
   Si hay tilde, ahí. Si no, la regla general: palabra terminada en
   vocal, en «n» o en «s» lleva la fuerza en la penúltima; en cualquier
   otra letra, en la última.

   ── La tilde diacrítica ──
   Es la que NO manda la regla: distingue dos palabras que se escriben
   igual (él/el, más/mas, sí/si, qué/que). Va en una lista cerrada
   porque no se puede deducir contando sílabas — es justo lo que la hace
   difícil, y la misión le dedica una sección entera.
══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';

  var FUERTES = 'aeoáéó';
  var DEBILES = 'iuü';
  var DEBILES_TILDE = 'íú';
  var VOCALES = FUERTES + DEBILES + DEBILES_TILDE;
  var CON_TILDE = 'áéíóú';
  /* Grupos que nunca se parten al separar en sílabas. */
  var INSEPARABLES = ['pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr',
                      'pl', 'bl', 'cl', 'gl', 'fl'];
  var DIGRAFOS = ['ch', 'll', 'rr'];

  /* ── Tilde diacrítica: lista CERRADA ──
     No se puede deducir contando sílabas: «el» y «él» tienen una sola
     sílaba las dos y la regla general no le pondría tilde a ninguna. La
     tilde está ahí para distinguirlas, y eso hay que saberlo, no
     calcularlo. Se escriben CON su tilde: son las formas acentuadas. */
  var DIACRITICAS = {
    'él': 'pronombre personal, frente al artículo «el»',
    'tú': 'pronombre personal, frente al posesivo «tu»',
    'mí': 'pronombre personal, frente al posesivo «mi»',
    'sí': 'afirmación o pronombre, frente a la condición «si»',
    'sé': 'del verbo saber o ser, frente al pronombre «se»',
    'dé': 'del verbo dar, frente a la preposición «de»',
    'té': 'la bebida, frente al pronombre «te»',
    'más': 'cantidad, frente a la conjunción «mas» (= pero)',
    'aún': 'todavía, frente a «aun» (= incluso)',
    'qué': 'pregunta o exclamación, frente al «que» que enlaza',
    'quién': 'pregunta o exclamación, frente a «quien»',
    'quiénes': 'pregunta o exclamación, frente a «quienes»',
    'cuál': 'pregunta o exclamación, frente a «cual»',
    'cuáles': 'pregunta o exclamación, frente a «cuales»',
    'cómo': 'pregunta o exclamación, frente al «como» que compara',
    'cuándo': 'pregunta o exclamación, frente al «cuando» del tiempo',
    'dónde': 'pregunta o exclamación, frente al «donde» del lugar',
    'adónde': 'pregunta o exclamación, frente a «adonde»',
    'cuánto': 'pregunta o exclamación, frente a «cuanto»',
    'cuánta': 'pregunta o exclamación, frente a «cuanta»',
    'cuántos': 'pregunta o exclamación, frente a «cuantos»',
    'cuántas': 'pregunta o exclamación, frente a «cuantas»'
  };

  function esVocal(c) { return VOCALES.indexOf(c) >= 0; }
  function esFuerte(c) { return FUERTES.indexOf(c) >= 0 || DEBILES_TILDE.indexOf(c) >= 0; }
  function tieneTilde(p) {
    for (var i = 0; i < p.length; i++) if (CON_TILDE.indexOf(p[i]) >= 0) return true;
    return false;
  }

  /* Quita lo que no sea letra y baja a minúsculas, respetando la tilde
     y la ñ: la tilde es justamente el dato. */
  function limpiar(p) {
    return String(p == null ? '' : p).toLowerCase()
      .replace(/[^a-záéíóúüñ]/g, '');
  }

  /* ── Un grupo de vocales, ¿es una sílaba o son dos? ──
     Devuelve los cortes DENTRO del grupo (posiciones donde se parte). */
  function cortesDelGrupo(g) {
    var cortes = [];
    for (var i = 0; i + 1 < g.length; i++) {
      var a = g[i], b = g[i + 1];
      var aF = esFuerte(a), bF = esFuerte(b);
      /* dos fuertes: hiato siempre (le-er, ca-os) */
      if (aF && bF) { cortes.push(i + 1); continue; }
      /* débil con tilde junto a cualquiera: hiato (dí-a, ra-íz) */
      if (DEBILES_TILDE.indexOf(a) >= 0 || DEBILES_TILDE.indexOf(b) >= 0) { cortes.push(i + 1); continue; }
      /* lo demás (fuerte+débil, débil+fuerte, débil+débil): diptongo */
    }
    return cortes;
  }

  /* ── Separar en sílabas ── */
  function silabas(palabra) {
    var p = limpiar(palabra);
    if (!p) return [];
    /* 1 · trocear en bloques alternos de consonantes y vocales */
    var bloques = [], i = 0;
    while (i < p.length) {
      var voc = esVocal(p[i]), j = i;
      while (j < p.length && esVocal(p[j]) === voc) j++;
      bloques.push({ voc: voc, txt: p.slice(i, j) });
      i = j;
    }
    /* 2 · repartir las consonantes entre el núcleo de antes y el de después */
    var silabas = [], actual = '';
    for (var b = 0; b < bloques.length; b++) {
      var bl = bloques[b];
      if (bl.voc) {
        actual += bl.txt;
        /* cortes internos del grupo vocálico (hiatos) */
        var base = actual.length - bl.txt.length;
        var cortes = cortesDelGrupo(bl.txt);
        for (var c = 0; c < cortes.length; c++) {
          silabas.push(actual.slice(0, base + cortes[c]));
          actual = actual.slice(base + cortes[c]);
          base = 0;
        }
        continue;
      }
      var cs = bl.txt;
      /* consonantes finales de palabra: se quedan con la última sílaba */
      if (b === bloques.length - 1) { actual += cs; continue; }
      /* consonantes iniciales de palabra: van con la sílaba que sigue */
      if (b === 0) { actual = cs; continue; }
      var quedan, siguen;
      if (cs.length === 1) { quedan = ''; siguen = cs; }
      else if (cs.length === 2) {
        if (juntas(cs)) { quedan = ''; siguen = cs; }
        else { quedan = cs[0]; siguen = cs[1]; }
      } else if (cs.length === 3) {
        if (juntas(cs.slice(1))) { quedan = cs[0]; siguen = cs.slice(1); }
        else { quedan = cs.slice(0, 2); siguen = cs[2]; }
      } else {
        quedan = cs.slice(0, 2); siguen = cs.slice(2);
      }
      silabas.push(actual + quedan);
      actual = siguen;
    }
    if (actual) silabas.push(actual);
    return silabas;
  }
  function juntas(par) {
    return INSEPARABLES.indexOf(par) >= 0 || DIGRAFOS.indexOf(par) >= 0;
  }

  /* ── Dónde cae la fuerza y cómo se llama la palabra ── */
  var NOMBRES = ['aguda', 'llana', 'esdrújula', 'sobresdrújula'];

  function clasificar(palabra) {
    var p = limpiar(palabra);
    var sil = silabas(p);
    if (!sil.length) return null;
    var conTilde = tieneTilde(p);
    var pos = -1;   /* índice de la sílaba tónica */
    if (conTilde) {
      for (var i = 0; i < sil.length; i++) if (tieneTilde(sil[i])) { pos = i; break; }
    } else {
      var ultima = p[p.length - 1];
      var abierta = esVocal(ultima) || ultima === 'n' || ultima === 's';
      pos = abierta ? sil.length - 2 : sil.length - 1;
      if (pos < 0) pos = 0;
    }
    var desdeElFinal = sil.length - pos;   /* 1 = última, 2 = penúltima… */
    var clase = NOMBRES[Math.min(desdeElFinal, 4) - 1];
    var diac = Object.prototype.hasOwnProperty.call(DIACRITICAS, p);
    return {
      palabra: p, silabas: sil, tonica: pos, clase: clase,
      tilde: conTilde, diacritica: diac,
      /* monosílabo: una sola sílaba. Solo lleva tilde si es diacrítica. */
      monosilabo: sil.length === 1,
      regla: diac ? 'Tilde diacrítica: ' + DIACRITICAS[p] : reglaDe(p, sil, clase, conTilde)
    };
  }

  function reglaDe(p, sil, clase, conTilde) {
    var ultima = p[p.length - 1];
    if (sil.length === 1) {
      return conTilde ? 'Monosílabo con tilde: solo se tilda si es diacrítica.'
        : 'Monosílabo: no lleva tilde.';
    }
    if (clase === 'esdrújula' || clase === 'sobresdrújula') {
      return 'Es ' + clase + ': todas llevan tilde, sin excepción.';
    }
    if (clase === 'aguda') {
      return conTilde
        ? 'Es aguda terminada en «' + ultima + '»: las agudas se tildan cuando terminan en vocal, en «n» o en «s».'
        : 'Es aguda terminada en «' + ultima + '»: no se tilda, porque no termina en vocal, «n» ni «s».';
    }
    return conTilde
      ? 'Es llana terminada en «' + ultima + '»: las llanas se tildan cuando NO terminan en vocal, «n» ni «s».'
      : 'Es llana terminada en «' + ultima + '»: no se tilda, porque termina en vocal, «n» o «s».';
  }

  /* ── Las palabras con tilde de un texto ya partido en palabras ──
     Devuelve la posición para que el motor pueda resaltarlas. */
  function conTildeEn(ps) {
    var out = [];
    for (var i = 0; i < ps.length; i++) {
      var info = clasificar(ps[i]);
      if (info && info.tilde) out.push({ ini: i, fin: i, info: info });
    }
    return out;
  }

  var API = {
    silabas: silabas,
    clasificar: clasificar,
    conTilde: conTildeEn,
    tieneTilde: function (p) { return tieneTilde(limpiar(p)); },
    diacriticas: DIACRITICAS
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.LECTURA_ACENTOS = API;
})(typeof self !== 'undefined' ? self : this);
