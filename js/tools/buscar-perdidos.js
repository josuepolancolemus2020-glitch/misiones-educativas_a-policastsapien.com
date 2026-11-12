/* ══════════════════════════════════════════════════════════════
   🔎 BUSCAR DATOS PERDIDOS: pagos, gastos y notas que estaban y ya no
   ──────────────────────────────────────────────────────────────
   Noviembre de 2026: un maestro perdió el pago de Luis, un gasto de
   L 1,090 «Entregado a dirección» y el IV parcial entero por choques entre
   sus equipos. Los arreglos de la sincronización evitan que vuelva a
   pasar; esto es para lo que ya se perdió.

   El dato perdido suele seguir guardado en alguna COPIA:
     · el respaldo que la sincronización hace antes de cambiar el aula
       (METAS_AULA_RESPALDO_V1, la última y las tres anteriores);
     · las fotos de «Deshacer» (METAS_ADMIN_UNDO_V1);
     · el historial de la nube, si el SQL de historial está instalado.
   Aquí se compara cada copia con lo de AHORA y se listan las cosas que
   estaban en una copia y hoy faltan. No se devuelve nada solo: algo pudo
   quitarse a propósito (una marca de pago puesta por error), así que el
   maestro marca qué vuelve. Devolver solo AÑADE lo que falta; nunca
   cambia ni borra lo que hay.

   No toca la pantalla ni guarda: recibe textos y devuelve listas.
   Se prueba sin navegador:  node _dev/verifica-buscar-perdidos.js
   ══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';

  function grupos(raw) {
    try {
      var o = JSON.parse(raw);
      return (o && Array.isArray(o.grupos)) ? o.grupos : [];
    } catch (_) { return []; }
  }
  function vacio(v) { return v === undefined || v === null || v === ''; }
  function gastoId(g) {
    return g && g.id ? 'id:' + g.id : 'c:' + String(g && g.d || '').trim().toLowerCase() + '|' + Number(g && g.m) + '|' + (g && g.f || '');
  }
  function mismoGasto(a, b) {
    if (a.id && b.id) return a.id === b.id;
    return String(a.d || '').trim().toLowerCase() === String(b.d || '').trim().toLowerCase() &&
      Number(a.m) === Number(b.m) && (a.f || '') === (b.f || '');
  }

  /* actualRaw: el texto de METAS_ADMIN_V1 de ahora.
     copias: [{ raw, cuando: 'AAAA-MM-DDTHH:MM…', fuente: 'respaldo' | 'deshacer' | 'nube' }]
     Devuelve [{ tipo, clave, grupo, grupoTxt, … , vistoEn, fuente }] sin repetidos,
     cada uno con la copia MÁS RECIENTE donde se vio. */
  function buscar(actualRaw, copias) {
    var ahora = {};
    grupos(actualRaw).forEach(function (g) { ahora[g.id] = g; });
    var hallados = {};
    var poner = function (it, c) {
      var ya = hallados[it.clave];
      if (ya && String(ya.vistoEn) >= String(c.cuando || '')) return;
      it.vistoEn = c.cuando || ''; it.fuente = c.fuente || '';
      hallados[it.clave] = it;
    };
    (copias || []).forEach(function (c) {
      grupos(c.raw).forEach(function (gv) {
        var g = ahora[gv.id];
        if (!g) return;                     // un grupo que ya no existe no se revive por aquí
        var nombreDe = function (num) {
          var a = (g.lista || []).find(function (x) { return String(x.num) === String(num); }) ||
                  (gv.lista || []).find(function (x) { return String(x.num) === String(num); });
          return a ? String(a.nombre || '').trim() : '';
        };
        /* ── colectas: pagos y gastos ── */
        (gv.colectas || []).forEach(function (cv) {
          var ca = (g.colectas || []).find(function (x) { return x.id === cv.id; });
          if (!ca) return;                  // colecta borrada entera: decisión del maestro
          Object.keys(cv.pagos || {}).forEach(function (num) {
            if (vacio(cv.pagos[num])) return;
            if (!vacio((ca.pagos || {})[num])) return;
            poner({ tipo: 'pago', clave: 'p|' + g.id + '|' + cv.id + '|' + num, grupo: g.id,
              colecta: cv.id, colectaTxt: cv.concepto || cv.nombre || 'Colecta', num: num,
              nombre: nombreDe(num), monto: Number(cv.pagos[num]),
              fecha: (cv.pagosF || {})[num] || '' }, c);
          });
          (cv.gastos || []).forEach(function (gs) {
            if ((ca.gastos || []).some(function (x) { return mismoGasto(x, gs); })) return;
            poner({ tipo: 'gasto', clave: 'g|' + g.id + '|' + cv.id + '|' + gastoId(gs), grupo: g.id,
              colecta: cv.id, colectaTxt: cv.concepto || cv.nombre || 'Colecta',
              gasto: gs, desc: gs.d || '', monto: Number(gs.m), fecha: gs.f || '' }, c);
          });
        });
        /* ── notas: casilla por casilla ── */
        Object.keys(gv.notas || {}).forEach(function (p) {
          Object.keys(gv.notas[p] || {}).forEach(function (mat) {
            Object.keys(gv.notas[p][mat] || {}).forEach(function (num) {
              var v = gv.notas[p][mat][num];
              if (vacio(v)) return;
              var va = (((g.notas || {})[p] || {})[mat] || {})[num];
              if (!vacio(va)) return;
              if (!(g.lista || []).some(function (x) { return String(x.num) === String(num); })) return;
              poner({ tipo: 'nota', clave: 'n|' + g.id + '|' + p + '|' + mat + '|' + num, grupo: g.id,
                parcial: p, materia: mat, num: num, nombre: nombreDe(num), valor: v }, c);
            });
          });
        });
      });
    });
    var orden = { pago: 0, gasto: 1, nota: 2 };
    return Object.keys(hallados).map(function (k) { return hallados[k]; }).sort(function (a, b) {
      return orden[a.tipo] - orden[b.tipo] || String(a.colectaTxt || a.parcial).localeCompare(String(b.colectaTxt || b.parcial)) ||
        String(a.materia || '').localeCompare(String(b.materia || '')) || (+a.num || 0) - (+b.num || 0);
    });
  }

  /* Devuelve lo marcado al grupo `g` (el de ahora). Solo AÑADE: si mientras
     tanto la casilla ya se llenó, no la toca. Devuelve cuántos puso. */
  function devolver(g, items) {
    var n = 0;
    (items || []).forEach(function (it) {
      if (!g || it.grupo !== g.id) return;
      if (it.tipo === 'pago') {
        var c = (g.colectas || []).find(function (x) { return x.id === it.colecta; });
        if (!c) return;
        c.pagos = c.pagos || {}; c.pagosF = c.pagosF || {};
        if (!vacio(c.pagos[it.num])) return;
        c.pagos[it.num] = it.monto;
        if (it.fecha) c.pagosF[it.num] = it.fecha;
        n++;
      } else if (it.tipo === 'gasto') {
        var cg = (g.colectas || []).find(function (x) { return x.id === it.colecta; });
        if (!cg) return;
        cg.gastos = cg.gastos || [];
        if (cg.gastos.some(function (x) { return mismoGasto(x, it.gasto); })) return;
        cg.gastos.push(JSON.parse(JSON.stringify(it.gasto)));
        n++;
      } else if (it.tipo === 'nota') {
        g.notas = g.notas || {};
        g.notas[it.parcial] = g.notas[it.parcial] || {};
        g.notas[it.parcial][it.materia] = g.notas[it.parcial][it.materia] || {};
        if (!vacio(g.notas[it.parcial][it.materia][it.num])) return;
        g.notas[it.parcial][it.materia][it.num] = it.valor;
        n++;
      }
    });
    return n;
  }

  var API = { buscar: buscar, devolver: devolver };
  raiz.BuscarPerdidos = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
