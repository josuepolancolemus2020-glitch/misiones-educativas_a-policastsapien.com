/* ══════════════════════════════════════════════════════════════
   🕵️ REVISAR CRUCES ENTRE EQUIPOS — caso por caso, con el historial
   ──────────────────────────────────────────────────────────────
   Hasta noviembre de 2026 los datos del aula se juntaban entre equipos
   por NÚMERO de lista. Si un equipo reordenó o borró una fila y otro, con
   la numeración vieja, anotó algo, al juntarse los datos de un niño
   cayeron en otro (así se perdió el pago de pupitres de Génesis). Ya no
   pasa (js/metas-numeracion.js), pero lo que se cruzó antes sigue ahí.

   Este módulo busca esos cruces en las copias guardadas del aula (las de
   la nube del último mes y las de este equipo), ordenadas en el tiempo.
   Un CRUCE es: entre una copia y la siguiente, varios datos de un alumno
   X cambiaron de golpe y quedaron IGUALES a los que tenía otro alumno Z,
   y X quedó justo en el número que Z tenía antes. Esa es la huella de
   juntar por número, no la de un maestro corrigiendo notas.

   A cada alumno se le reconoce por su identidad (MetasNumeracion), no por
   su número. Para cada caso dice si SIGUE cruzado hoy y qué habría que
   poner para devolverle a cada quien lo suyo, sin pisar lo que se cambió
   después: solo se tocan las casillas que hoy siguen teniendo lo ajeno.

   No toca la pantalla ni guarda: recibe textos y devuelve listas.
   Se prueba sin navegador:  node _dev/verifica-revisa-cruces.js
   ══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';
  /* se busca al usarse, no al cargar: así el orden de los <script> no importa */
  var _N = null;
  function numeracion() {
    if (!_N) _N = raiz.MetasNumeracion || (typeof require === 'function' ? require('../metas-numeracion.js') : null);
    return _N;
  }

  function grupos(raw) {
    try { var o = JSON.parse(raw); return (o && Array.isArray(o.grupos)) ? o.grupos : []; } catch (_) { return []; }
  }
  function vacio(v) { return v === undefined || v === null || v === ''; }
  function igual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  /* ── Todo lo que un alumno tiene, como { campo: valor } ── */
  function valores(g, num) {
    var n = String(num), out = {};
    var poner = function (k, v) { if (!vacio(v)) out[k] = v; };
    Object.keys(g.notas || {}).forEach(function (p) {
      Object.keys(g.notas[p] || {}).forEach(function (m) { poner('n|' + p + '|' + m, (g.notas[p][m] || {})[n]); });
    });
    Object.keys(g.recuperacion || {}).forEach(function (c) { poner('r|' + c, (g.recuperacion[c] || {})[n]); });
    poner('o', (g.inasisOficial || {})[n]);
    (g.asistencia || []).forEach(function (r) { if (r && r.f) poner('a|' + r.f, (r.aus || {})[n]); });
    (g.colectas || []).forEach(function (c) {
      if (!c || !c.id) return;
      poner('p|' + c.id, (c.pagos || {})[n]);
      poner('pf|' + c.id, (c.pagosF || {})[n]);
    });
    (g.controles || []).forEach(function (c) { if (c && c.id) poner('k|' + c.id, (c.datos || {})[n]); });
    return out;
  }
  /* Pone (o quita, con undefined) UN campo de un alumno */
  function poner(g, num, campo, v) {
    var n = String(num), t = campo.split('|');
    var obj = function (o, k) { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; return o[k]; };
    var fijar = function (o) { if (vacio(v)) delete o[n]; else o[n] = v; };
    if (t[0] === 'n') { g.notas = g.notas || {}; fijar(obj(obj(g.notas, t[1]), t.slice(2).join('|'))); }
    else if (t[0] === 'r') { g.recuperacion = g.recuperacion || {}; fijar(obj(g.recuperacion, t.slice(1).join('|'))); }
    else if (t[0] === 'o') { fijar(obj(g, 'inasisOficial')); }
    else if (t[0] === 'a') {
      var r = (g.asistencia || []).filter(function (x) { return x && x.f === t[1]; })[0];
      if (!r) { if (vacio(v)) return; r = { f: t[1], aus: {} }; (g.asistencia = g.asistencia || []).push(r); }
      fijar(obj(r, 'aus'));
    } else if (t[0] === 'p' || t[0] === 'pf') {
      var c = (g.colectas || []).filter(function (x) { return x && x.id === t[1]; })[0];
      if (c) fijar(obj(c, t[0] === 'p' ? 'pagos' : 'pagosF'));
    } else if (t[0] === 'k') {
      var k = (g.controles || []).filter(function (x) { return x && x.id === t[1]; })[0];
      if (k) fijar(obj(k, 'datos'));
    }
  }
  /* Cómo se lee un campo en la pantalla */
  function etiqueta(g, campo) {
    var t = campo.split('|');
    var fecha = function (iso) { var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + '/' + m[2] + '/' + m[1] : iso; };
    if (t[0] === 'n') return t.slice(2).join('|') + ' · parcial ' + t[1];
    if (t[0] === 'r') return 'Recuperación de ' + t.slice(1).join('|');
    if (t[0] === 'o') return 'Inasistencias oficiales del SACE';
    if (t[0] === 'a') return 'Asistencia del ' + fecha(t[1]);
    var c = (t[0] === 'p' || t[0] === 'pf') ? (g.colectas || []).filter(function (x) { return x && x.id === t[1]; })[0] : null;
    if (t[0] === 'p') return 'Pago de «' + (c ? c.concepto : 'colecta') + '»';
    if (t[0] === 'pf') return 'Fecha del pago de «' + (c ? c.concepto : 'colecta') + '»';
    var k = (g.controles || []).filter(function (x) { return x && x.id === t[1]; })[0];
    if (t[0] === 'k') return 'Control «' + (k ? (k.nombre || 'control') : 'control') + '»';
    return campo;
  }

  /* ── El análisis ──
     actualRaw: METAS_ADMIN_V1 de ahora. copias: [{ raw, cuando, fuente }].
     Devuelve { casos, revisadas, desde, hasta }. */
  function analizar(actualRaw, copias) {
    var hoy = {};
    grupos(actualRaw).forEach(function (g) { if (g && g.id) hoy[g.id] = g; });
    var conFecha = (copias || []).filter(function (c) { return c && c.raw && c.cuando; })
      .slice().sort(function (a, b) { return String(a.cuando).localeCompare(String(b.cuando)); });
    /* sin repetir copias idénticas seguidas (la nube y el equipo guardan la misma) */
    var orden = [];
    conFecha.forEach(function (c) { if (!orden.length || orden[orden.length - 1].raw !== c.raw) orden.push(c); });
    orden.push({ raw: actualRaw, cuando: 'ahora', fuente: 'hoy' });
    var casos = [], vistos = {}, revisar = [], vistosR = {};

    Object.keys(hoy).forEach(function (gid) {
      var gHoy = hoy[gid];
      var lHoy = (gHoy.lista || []).filter(function (a) { return a && a.num != null; });
      /* cada copia: su grupo y, para cada alumno de HOY, su número en esa copia */
      var serie = [];
      orden.forEach(function (c) {
        var g = grupos(c.raw).filter(function (x) { return x && x.id === gid; })[0];
        if (!g || !Array.isArray(g.lista)) return;
        var numDe = {};   // uid/num de hoy → num en la copia
        g.lista.forEach(function (a) {
          if (!a || a.num == null) return;
          var x = numeracion().buscarAlumno(lHoy, { uid: a.uid, idn: a.idn, nombre: a.nombre });
          if (x && numDe[x.num] == null) numDe[x.num] = a.num;
        });
        serie.push({ c: c, g: g, numDe: numDe });
      });
      for (var i = 0; i + 1 < serie.length; i++) {
        var A = serie[i], B = serie[i + 1];
        /* ¿cambió la numeración entre estas dos copias? */
        var renumero = lHoy.some(function (a) {
          return A.numDe[a.num] != null && B.numDe[a.num] != null && +A.numDe[a.num] !== +B.numDe[a.num];
        }) || A.g.lista.length !== B.g.lista.length;
        lHoy.forEach(function (X) {
          var nxA = A.numDe[X.num], nxB = B.numDe[X.num];
          if (nxA == null || nxB == null) return;
          var vxA = valores(A.g, nxA), vxB = valores(B.g, nxB);
          var cambiados = Object.keys(Object.assign({}, vxA, vxB)).filter(function (f) { return !igual(vxA[f], vxB[f]); });
          if (!cambiados.length) return;
          /* pagos que aparecieron justo cuando cambió la numeración: no hay
             cómo saber de quién eran si el original solo vivió en el equipo
             viejo, pero vale confirmarlos con la hoja de la colecta */
          if (renumero) cambiados.forEach(function (f) {
            if (f.indexOf('p|') !== 0 || !vacio(vxA[f]) || vacio(vxB[f])) return;
            var llaveR = gid + '|' + X.num + '|' + f;
            if (vistosR[llaveR]) return;
            if (vacio(valores(gHoy, X.num)[f])) return;   // hoy ya no lo tiene
            vistosR[llaveR] = 1;
            revisar.push({ grupo: gid, cuando: B.c.cuando, num: X.num, nombre: X.nombre, campo: f,
              etiqueta: etiqueta(gHoy, f), monto: vxB[f], fecha: vxB['pf|' + f.slice(2)] || '' });
          });
          lHoy.forEach(function (Z) {
            if (Z === X) return;
            /* la huella de juntar por número: X quedó con datos que Z tenía
               cuando Z llevaba ESE número (en esta copia o en una anterior:
               el equipo viejo trae su numeración de antes) */
            var k = i, nzK = null;
            for (; k >= 0; k--) { if (serie[k].numDe[Z.num] != null && +serie[k].numDe[Z.num] === +nxB) { nzK = serie[k].numDe[Z.num]; break; } }
            if (nzK == null) return;
            var vzA = valores(serie[k].g, nzK);
            var calzan = cambiados.filter(function (f) { return !vacio(vxB[f]) && igual(vxB[f], vzA[f]) && !igual(vxA[f], vzA[f]); });
            if (calzan.length < 2 || calzan.length < cambiados.length * 0.5) return;
            var llave = gid + '|' + X.num + '|' + Z.num;
            if (vistos[llave]) return;
            vistos[llave] = 1;
            /* ¿sigue así hoy? solo cuentan las casillas que HOY tienen lo de Z */
            var vxHoy = valores(gHoy, X.num), vzHoy = valores(gHoy, Z.num);
            var siguen = calzan.filter(function (f) { return igual(vxHoy[f], vzA[f]) && !igual(vxHoy[f], vxA[f]); });
            var arreglo = [];
            siguen.forEach(function (f) {
              arreglo.push({ num: X.num, campo: f, poner: vxA[f] });
              if (vacio(vzHoy[f]) && !vacio(vzA[f])) arreglo.push({ num: Z.num, campo: f, poner: vzA[f] });
            });
            casos.push({
              grupo: gid, cuando: B.c.cuando, antes: A.c.cuando,
              a: { num: X.num, nombre: X.nombre, numAntes: nxA },
              de: { num: Z.num, nombre: Z.nombre, numAntes: nzK },
              campos: calzan.map(function (f) {
                return { campo: f, etiqueta: etiqueta(gHoy, f), suyo: vxA[f], ajeno: vzA[f], hoy: vxHoy[f],
                  sigue: siguen.indexOf(f) >= 0, deZhoy: vzHoy[f] };
              }),
              sigue: siguen.length > 0, arreglo: arreglo,
            });
          });
        });
      }
    });
    casos.sort(function (a, b) { return (b.sigue - a.sigue) || String(a.cuando).localeCompare(String(b.cuando)); });
    /* un pago que ya salió como cruce no se repite en «para confirmar» */
    revisar = revisar.filter(function (r) {
      return !casos.some(function (c) { return c.grupo === r.grupo && c.a.num === r.num && c.campos.some(function (x) { return x.campo === r.campo; }); });
    });
    return { casos: casos, revisar: revisar, revisadas: orden.length - 1,
      desde: orden.length > 1 ? orden[0].cuando : '', hasta: orden.length > 1 ? orden[orden.length - 2].cuando : '' };
  }

  /* Devuelve a cada quien lo suyo en el grupo `g` de hoy. Solo toca las
     casillas que siguen teniendo lo ajeno (`hoy` del análisis); si algo
     cambió desde el análisis, esa casilla se respeta. Devuelve cuántas. */
  function arreglar(g, caso) {
    var n = 0;
    (caso.arreglo || []).forEach(function (x) {
      var actual = valores(g, x.num)[x.campo];
      var campo = (caso.campos || []).filter(function (c) { return c.campo === x.campo; })[0];
      if (!campo) return;
      var esperado = x.num === caso.a.num ? campo.hoy : campo.deZhoy;
      if (!igual(actual, esperado)) return;
      poner(g, x.num, x.campo, x.poner);
      n++;
    });
    return n;
  }

  var API = { analizar: analizar, arreglar: arreglar, valores: valores, etiqueta: etiqueta };
  raiz.RevisaCruces = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
