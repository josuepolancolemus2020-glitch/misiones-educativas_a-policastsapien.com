/* ══════════════════════════════════════════════════════════════
   EL ALUMNO ES SU NOMBRE E IDENTIDAD, NO SU NÚMERO DE LISTA
   ──────────────────────────────────────────────────────────────
   Noviembre de 2026: el maestro pasó a Dayrin del #11 al final de la
   lista y quitó alumnos que ya no estaban. En ESE equipo todo se movió
   bien, porque reordenar recorre cada dato con su niño. Pero en otro
   equipo, con la numeración de antes, se marcaron pagos de la colecta de
   pupitres. Al juntarse las dos copias, el «#17» de un equipo y el «#17»
   del otro eran niños distintos: el pago de Génesis se perdió y el
   asistente de padres le dijo a su familia que debía.

   El número de lista cambia (se reordena, se borra una fila, se inserta
   un alumno); el nombre y la identidad no. Por eso:

   1. Cada alumno lleva un `uid` interno que no cambia nunca.
   2. Antes de JUNTAR dos copias del aula (la sincronización entre
      equipos, o el guardado que encuentra que algo cambió en medio), las
      copias se ponen en la MISMA numeración: a cada alumno se le reconoce
      por su uid, si no por su identidad, si no por su nombre. Manda la
      numeración más reciente (`ordenT`, que se sella al reordenar, borrar
      o insertar); así el orden que eligió el maestro no se deshace.
   3. Lo que se guarda por número vive en UNA lista (CAMPOS, abajo). La
      usan la traducción y también reordenar/borrar/insertar, para que
      ninguna pantalla nueva se quede atrás: antes, las notas de
      recuperación, las inasistencias oficiales y los «no cuenta» de una
      colecta se quedaban pegados al número viejo al reordenar.

   Las pantallas siguen leyendo `pagos[num]`, `notas[p][m][num]`…: dentro
   de UN equipo los números siempre cuadran. Lo que se arregla es la
   frontera, que es donde se cruzaban.

   No toca la pantalla ni guarda: recibe objetos o textos y los devuelve.
   Se prueba sin navegador:  node _dev/verifica-numeracion.js
   ══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';

  /* ── TODO lo que el grupo guarda por número de lista ──
     Si una herramienta nueva guarda algo por número DENTRO del grupo,
     se añade AQUÍ y queda cubierta al reordenar, borrar, insertar y
     sincronizar. (Lo que vive en otras llaves —claves de familia,
     comunicados, Plan de Acción— lo recorre registros-admin.js.) */
  function campos(g) {
    var porNum = [];   // objetos { num: valor }
    var listas = [];   // arreglos de números [num, num…]
    var conNum = [];   // arreglos de registros { num, … }
    var poner = function (o, k) { if (o && o[k] && typeof o[k] === 'object' && !Array.isArray(o[k])) porNum.push([o, k]); };
    Object.keys(g.notas || {}).forEach(function (p) {
      Object.keys(g.notas[p] || {}).forEach(function (m) { poner(g.notas[p], m); });
    });
    Object.keys(g.recuperacion || {}).forEach(function (col) { poner(g.recuperacion, col); });
    poner(g, 'inasisOficial');
    (g.asistencia || []).forEach(function (r) { poner(r, 'aus'); });
    (g.colectas || []).forEach(function (c) {
      poner(c, 'pagos'); poner(c, 'pagosF');
      if (c && Array.isArray(c.noCuenta)) listas.push([c, 'noCuenta']);
    });
    (g.controles || []).forEach(function (c) { poner(c, 'datos'); });
    conNum.push([g, 'lista']);
    conNum.push([g, 'lectura']);
    var eq = g.equipos;
    var equipos = [];
    if (eq && typeof eq === 'object') {
      /* el reparto se guarda como texto «1,4,9|2,5,8» (equipos.js) */
      ['reparto', 'antes'].forEach(function (k) { if (typeof eq[k] === 'string') equipos.push([eq, k, 'txt']); });
      ['reparto', 'antes', 'separar'].forEach(function (k) { if (Array.isArray(eq[k])) equipos.push([eq, k, true]); });
      if (Array.isArray(eq.coord)) equipos.push([eq, 'coord', false]);
      if (eq.fuera && Array.isArray(eq.fuera.nums)) equipos.push([eq.fuera, 'nums', false]);
    }
    return { porNum: porNum, listas: listas, conNum: conNum, equipos: equipos };
  }

  /* Recorre todo lo del grupo con `mapa` { numViejo: numNuevo }.
     quitar = true: lo que no está en el mapa se va (borrar una fila).
     quitar = false: lo que no está en el mapa se queda con su número. */
  function remapGrupo(g, mapa, quitar) {
    if (!g || typeof g !== 'object') return g;
    var nuevo = function (n) {
      var k = String(n);
      if (Object.prototype.hasOwnProperty.call(mapa, k)) return mapa[k];
      return quitar ? null : (isNaN(+n) ? n : +n);
    };
    var C = campos(g);
    C.porNum.forEach(function (par) {
      var o = par[0][par[1]], out = {};
      Object.keys(o).forEach(function (k) {
        var nk = nuevo(k);
        if (nk != null) out[nk] = o[k];
      });
      par[0][par[1]] = out;
    });
    C.listas.forEach(function (par) {
      par[0][par[1]] = par[0][par[1]].map(nuevo).filter(function (n) { return n != null; });
    });
    C.conNum.forEach(function (par) {
      var arr = par[0][par[1]];
      if (!Array.isArray(arr)) return;
      par[0][par[1]] = arr.filter(function (r) {
        if (!r || typeof r !== 'object' || r.num == null) return true;
        var nk = nuevo(r.num);
        if (nk == null) return false;
        r.num = nk;
        return true;
      });
    });
    C.equipos.forEach(function (t) {
      var o = t[0], k = t[1];
      var map1 = function (arr) { return (arr || []).map(nuevo).filter(function (n) { return n != null; }); };
      if (t[2] === 'txt') {
        o[k] = o[k].split('|').map(function (p) {
          return map1(p.split(',').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return x > 0; })).join(',');
        }).filter(Boolean).join('|');
      } else if (t[2]) {
        o[k] = o[k].map(function (x) { return Array.isArray(x) ? map1(x) : x; });
        if (k === 'separar') o[k] = o[k].filter(function (par) { return !Array.isArray(par) || par.length >= 2; });
      } else {
        o[k] = map1(o[k]);
      }
    });
    return g;
  }

  /* ── Quién es quién ── */
  function normNom(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function digitos(s) { return String(s || '').replace(/\D/g, ''); }
  /* las llaves con que un alumno sin pareja recibe el mismo número en
     las dos copias que se traducen (la base y la otra) */
  function llaves(a) {
    var out = [];
    if (a && a.uid) out.push('u:' + a.uid);
    var i = digitos(a && a.idn);
    if (i.length >= 6) out.push('i:' + i);
    var n = normNom(a && a.nombre);
    if (n) out.push('n:' + n);
    return out;
  }
  /* busca en `tabla` por cualquiera de sus llaves (una copia puede tener
     el uid y la otra todavía no) */
  function buscarEn(tabla, a) {
    var ks = llaves(a);
    for (var i = 0; i < ks.length; i++) if (tabla[ks[i]] != null) return tabla[ks[i]];
    return null;
  }
  function anotarEn(tabla, a, v) { llaves(a).forEach(function (k) { if (tabla[k] == null) tabla[k] = v; }); }
  var AZ = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function nuevoUid() {
    var s = 'A';
    for (var i = 0; i < 9; i++) s += AZ[Math.floor(Math.random() * AZ.length)];
    return s;
  }
  /* Le pone uid a quien no lo tenga. Devuelve cuántos puso. */
  function asegurarUids(g) {
    var n = 0, vistos = {};
    (g && Array.isArray(g.lista) ? g.lista : []).forEach(function (a) {
      if (!a || typeof a !== 'object') return;
      /* un uid repetido (una fila duplicada a mano) no identifica: otro */
      if (!a.uid || vistos[a.uid]) { a.uid = nuevoUid(); n++; }
      vistos[a.uid] = 1;
    });
    return n;
  }

  /* Empareja los alumnos de `otro` con los de `ref`: uid, luego
     identidad, luego nombre (solo si el nombre no se repite). Devuelve
     { numOtro: numRef } de los que se encontraron. */
  function emparejar(ref, otro) {
    var lr = (ref && ref.lista) || [], lo = (otro && otro.lista) || [];
    var tomado = {}, par = {};
    var buscar = function (pred) {
      lo.forEach(function (a) {
        if (!a || a.num == null || par[String(a.num)] != null) return;
        var cand = lr.filter(function (b) { return b && b.num != null && !tomado[String(b.num)] && pred(a, b); });
        if (cand.length === 1) { par[String(a.num)] = cand[0].num; tomado[String(cand[0].num)] = 1; }
      });
    };
    buscar(function (a, b) { return a.uid && b.uid && a.uid === b.uid; });
    buscar(function (a, b) { var x = digitos(a.idn); return x.length >= 6 && x === digitos(b.idn); });
    buscar(function (a, b) {
      var x = normNom(a.nombre);
      if (!x || x !== normNom(b.nombre)) return false;
      /* dos «Génesis López» sin identidad no se adivinan */
      return lo.filter(function (o) { return o && normNom(o.nombre) === x; }).length === 1;
    });
    return par;
  }

  /* Traduce `otro` (un grupo) a la numeración de `ref`. A los que no
     tienen pareja en `ref` (un alumno que aquí ya se borró, o uno nuevo
     del otro equipo) se les da un número libre después del último, el
     MISMO en la base y en la otra copia (`libres`, compartido), para que
     la fusión sepa si se borró o se añadió. Devuelve true si cambió algo. */
  function traducir(ref, otro, libres) {
    if (!ref || !otro || !Array.isArray(ref.lista) || !Array.isArray(otro.lista)) return false;
    var par = emparejar(ref, otro);
    var mapa = {}, cambia = false;
    var max = 0;
    ref.lista.forEach(function (b) { if (b && +b.num > max) max = +b.num; });
    Object.keys(libres.porFirma).forEach(function (f) { if (libres.porFirma[f] > max) max = libres.porFirma[f]; });
    /* primero los que NO estaban en la base (alumnos nuevos del otro
       equipo): se quedan, y así entran justo después del último, sin
       hueco. Los que sí estaban en la base y aquí faltan son, casi
       siempre, alumnos que este equipo borró: van al final y la fusión
       los quita. */
    var enBase = function (a) { return buscarEn(libres.enBase || {}, a) != null ? 1 : 0; };
    var sinPar = otro.lista.filter(function (a) { return a && a.num != null && par[String(a.num)] == null; })
      .sort(function (a, b) { return (enBase(a) - enBase(b)) || ((+a.num || 0) - (+b.num || 0)); });
    sinPar.forEach(function (a) {
      var n = buscarEn(libres.porFirma, a);
      if (n == null) { n = ++max; anotarEn(libres.porFirma, a, n); }
      par[String(a.num)] = n;
    });
    otro.lista.forEach(function (a) {
      if (!a || a.num == null) return;
      var k = String(a.num), n = par[k];
      mapa[k] = n;
      if (+n !== +a.num) cambia = true;
    });
    if (!cambia) return false;
    remapGrupo(otro, mapa, false);
    otro.lista.sort(function (a, b) { return (+a.num || 0) - (+b.num || 0); });
    return true;
  }

  /* ── La puerta: alinea base, local y remoto ANTES de fusionar ──
     Acepta el aula entera ({ v: 2, grupos: […] }) o un grupo suelto
     ({ id, lista, … }). Si no es ninguna de las dos, o algo no es JSON,
     devuelve los textos tal cual: nunca inventa. */
  function esGrupo(o) { return o && typeof o === 'object' && !Array.isArray(o) && Array.isArray(o.lista) && 'id' in o; }
  function gruposDe(o) {
    if (!o || typeof o !== 'object') return null;
    if (Array.isArray(o.grupos)) return o.grupos;
    if (esGrupo(o)) return [o];
    return null;
  }
  function alinear(baseRaw, localRaw, remotoRaw) {
    var tal = { base: baseRaw, local: localRaw, remoto: remotoRaw, cambio: false };
    var b, l, r;
    try {
      l = JSON.parse(localRaw); r = JSON.parse(remotoRaw);
      b = (baseRaw == null || baseRaw === '') ? null : JSON.parse(baseRaw);
    } catch (_) { return tal; }
    var gl = gruposDe(l), gr = gruposDe(r), gb = b == null ? null : gruposDe(b);
    if (!gl || !gr) return tal;
    var cl = false, cr = false, cb = false;
    gl.forEach(function (gL) {
      if (!gL || gL.id == null) return;
      var gR = gr.filter(function (x) { return x && x.id === gL.id; })[0];
      if (!gR) return;
      var gB = gb ? gb.filter(function (x) { return x && x.id === gL.id; })[0] : null;
      /* manda la numeración más reciente; en empate, la de este equipo */
      var refEsRemoto = (+gR.ordenT || 0) > (+gL.ordenT || 0);
      var ref = refEsRemoto ? gR : gL;
      var libres = { porFirma: {}, enBase: {} };
      if (gB && Array.isArray(gB.lista)) gB.lista.forEach(function (a) { if (a) anotarEn(libres.enBase, a, 1); });
      if (refEsRemoto) { if (traducir(ref, gL, libres)) cl = true; }
      else if (traducir(ref, gR, libres)) cr = true;
      if (gB && traducir(ref, gB, libres)) cb = true;
    });
    if (cl) tal.local = JSON.stringify(l);
    if (cr) tal.remoto = JSON.stringify(r);
    if (cb) tal.base = JSON.stringify(b);
    tal.cambio = cl || cr || cb;
    return tal;
  }

  /* Envuelve la fusión: toda unión de dos copias del aula pasa antes por
     aquí. La fusión sigue sin saber nada de aulas. */
  function envolver(F) {
    if (!F || !F.fusionar || F.fusionar._alineada) return;
    var orig = F.fusionar;
    var nueva = function (baseRaw, localRaw, remotoRaw, ganaLocal) {
      var a = alinear(baseRaw, localRaw, remotoRaw);
      return orig(a.base, a.local, a.remoto, ganaLocal);
    };
    nueva._alineada = true;
    F.fusionar = nueva;
  }

  var API = {
    remapGrupo: remapGrupo, asegurarUids: asegurarUids, emparejar: emparejar,
    traducir: traducir, alinear: alinear, envolver: envolver, normNom: normNom,
  };
  raiz.MetasNumeracion = API;
  if (raiz.MetasFusion) envolver(raiz.MetasFusion);
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
