/* =====================================================================
   M.E.T.A.S — js/datos/calculos.js · los totales, calculados
   ---------------------------------------------------------------------
   Ningún total se guarda (01, 03): se calcula de las filas. La base lo
   hace en sus vistas (_calc_colecta_alumnos, _calc_colectas_resumen); aquí
   se hace IGUAL, con las mismas fórmulas, para que sin señal el docente vea
   los mismos números que verá con señal, y para que lo recién anotado
   (todavía en la cola) ya cuente. La capa B (B12) lo compara con la base.

   Un monto que el docente todavía está aclarando («1,500»: ¿mil quinientos
   o uno con cincuenta?) no se adivina: todo lo que depende de él queda SIN
   DATO (null) y la situación del alumno es «por_aclarar». Antes contaba
   como cero, y un alumno al que sí le tocaba pagar salía como «no le
   corresponde» (rev. 9).

   Todo en centavos enteros (montos.js); todo sale como texto «150.00».
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};
  var montos = M.montos;
  var c = montos.centavos;

  // Centavos o null (sin dato). Cualquier cuenta con un null da null.
  function t(x) {
    return x === null ? null : montos.desdeCentavos(x);
  }
  function mas(a, b) {
    return a === null || b === null ? null : a + b;
  }
  function menos(a, b) {
    return a === null || b === null ? null : a - b;
  }
  function maxCero(x) {
    return x === null ? null : x < 0n ? 0n : x;
  }
  function vivos(filas) {
    return filas.filter(function (f) { return !f.deleted_at; });
  }
  function sigue(a) {
    return a.estado === 'activo' || a.estado === 'ingreso' || a.estado == null;
  }
  function deMonto(m) {
    return m == null ? null : c(m);
  }

  // Por alumno y colecta: lo que le corresponde, lo pagado, lo que falta.
  //   aplicable  = el sugerido; 0 si está exento; el monto_aplicable si la
  //                exención es parcial; 0 si ya no está en el aula.
  //   falta      = nunca negativo.
  //   pago_de_mas= solo si sigue en el aula.
  function colectaAlumnos(colectas, alumnos, exenciones, pagos) {
    var ex = new Map();
    vivos(exenciones).forEach(function (e) { ex.set(e.colecta_id + '|' + e.alumno_id, e); });
    var porAlumno = new Map();
    vivos(pagos).forEach(function (p) {
      var k = p.colecta_id + '|' + p.alumno_id;
      var x = porAlumno.get(k) || { pagado: 0n, cuantos: 0, ultima: null };
      x.pagado = mas(x.pagado, deMonto(p.monto));
      x.cuantos += 1;
      if (!x.ultima || p.fecha > x.ultima) x.ultima = p.fecha;
      porAlumno.set(k, x);
    });
    var filas = [];
    vivos(colectas).forEach(function (col) {
      vivos(alumnos).filter(function (a) { return a.aula_id === col.aula_id; }).forEach(function (a) {
        var e = ex.get(col.id + '|' + a.id);
        var s = sigue(a);
        var aplicable = !s ? 0n
          : !e ? deMonto(col.monto_sugerido)
          : e.por_aclarar ? null
          : e.monto_aplicable == null ? 0n : c(e.monto_aplicable);
        var p = porAlumno.get(col.id + '|' + a.id) || { pagado: 0n, cuantos: 0, ultima: null };
        var falta = maxCero(menos(aplicable, p.pagado));
        var deMas = s ? maxCero(menos(p.pagado, aplicable)) : 0n;
        var situacion = !s ? 'ya_no_esta'
          : aplicable === null || p.pagado === null ? 'por_aclarar'
          : aplicable === 0n && p.pagado === 0n ? 'no_corresponde'
          : p.pagado === 0n ? 'debe'
          : p.pagado < aplicable ? 'abono'
          : p.pagado === aplicable ? 'pagado' : 'pago_de_mas';
        filas.push({
          colecta_id: col.id, aula_id: col.aula_id, alumno_id: a.id, num_lista: a.num_lista,
          nombre_completo: a.nombre_completo, estado: a.estado || 'activo', sigue: s, exento: !!e,
          monto_aplicable: e && !e.por_aclarar && e.monto_aplicable != null ? e.monto_aplicable : null,
          aplicable: t(aplicable), pagado: t(p.pagado), pagos: p.cuantos, ultima_fecha: p.ultima,
          falta: t(falta), pago_de_mas: t(deMas), situacion: situacion,
        });
      });
    });
    return filas;
  }

  // Por colecta. Lo recaudado es TODO pago activo, aunque el alumno ya no
  // esté; la meta y lo que falta, solo de los que siguen.
  function colectasResumen(colectas, alumnos, exenciones, pagos, gastos) {
    var porColecta = colectaAlumnos(colectas, alumnos, exenciones, pagos);
    return vivos(colectas).map(function (col) {
      var mios = porColecta.filter(function (x) { return x.colecta_id === col.id; });
      var esperados = 0;
      var meta = 0n;
      var falta = 0n;
      var deMas = 0n;
      var pagaron = 0;
      mios.forEach(function (x) {
        var ap = deMonto(x.aplicable);
        if (x.sigue) {
          esperados = esperados === null || ap === null ? null : esperados + (ap > 0n ? 1 : 0);
          meta = mas(meta, ap);
          falta = mas(falta, deMonto(x.falta));
        }
        deMas = mas(deMas, deMonto(x.pago_de_mas));
        if (x.pagos > 0) pagaron++;         // todo pago es mayor que cero
      });
      var recaudado = 0n;
      vivos(pagos).forEach(function (p) { if (p.colecta_id === col.id) recaudado = mas(recaudado, deMonto(p.monto)); });
      var gastado = 0n;
      vivos(gastos || []).forEach(function (g) { if (g.colecta_id === col.id) gastado = mas(gastado, deMonto(g.monto)); });
      return {
        colecta_id: col.id, aula_id: col.aula_id, concepto: col.concepto, fecha: col.fecha, estado: col.estado,
        monto_sugerido: col.monto_sugerido == null ? null : col.monto_sugerido,
        esperados: esperados, meta: t(meta), recaudado: t(recaudado), falta_total: t(falta),
        pago_de_mas_total: t(deMas), gastado: t(gastado), saldo: t(menos(recaudado, gastado)), pagaron: pagaron,
      };
    });
  }

  M.calculos = { colectaAlumnos: colectaAlumnos, colectasResumen: colectasResumen };
})(window);
