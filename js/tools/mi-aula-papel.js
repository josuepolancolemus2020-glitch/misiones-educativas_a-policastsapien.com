/* =====================================================================
   M.E.T.A.S — js/tools/mi-aula-papel.js · lo que se imprime, desde filas
   ---------------------------------------------------------------------
   Las boletas, el resumen final por grado, el Cuadro final del año y los
   cuadros de ingresos, egresos y el talonario son diseños aprobados por
   Josué, y viven en js/tools/registros-admin.js (y cuadros-sace.js). Aquí
   NO se toca ni una línea de ellos: solo cambia de dónde salen sus datos.

   grupo() arma, con las filas de MetasDatos, el mismo objeto «grupo» que
   esas funciones leían del blob (lista, materias, notas por parcial,
   recuperación, inasistencias, asistencia, colectas con sus pagos y
   gastos, datos de la boleta), y imprimir() las llama tal cual.

   El dinero pasa como TEXTO, tal como sale de la base («150.00»): la suma
   de un alumno se hace en centavos (montos.sumar, regla 19). Lo que las
   hojas impresas hacen después con ese texto es lo mismo que hacían en
   main; cambiarlo sería tocar su diseño.
   ===================================================================== */
(function () {
  'use strict';

  var PARCIALES = ['I', 'II', 'III', 'IV'];
  // Las notas se imprimen como las escribió el docente: «85», no «85.00».
  function nota(v) {
    if (v == null) return '';
    return String(v).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }
  function porNum(a, b) {
    var x = a.num_lista == null ? 999 : a.num_lista;
    var y = b.num_lista == null ? 999 : b.num_lista;
    return x - y || String(a.nombre_completo).localeCompare(String(b.nombre_completo), 'es');
  }

  function grupo(api, aula) {
    var montos = window.MetasDatos.montos;
    var def = typeof window.adBoletaDef === 'function' ? window.adBoletaDef() : {};
    var ajustes = (aula.ajustes && aula.ajustes.boleta) || {};
    var alumnos = api.lista('alumnos', { aula_id: aula.id }).sort(porNum);
    // El número de lista es la llave de todo lo impreso; un alumno sin él
    // (más de 99) va después del último.
    var numDe = {};
    var maximo = alumnos.reduce(function (m, a) { return Math.max(m, a.num_lista || 0); }, 0);
    alumnos.forEach(function (a) { numDe[a.id] = a.num_lista == null ? ++maximo : a.num_lista; });

    // La clave de familia del talonario sale de metas.familias (la que la
    // familia escribe hoy). adPrintTalonario la toma de claveFamilia y, en
    // un grupo del blob (sin ese campo), sigue leyendo la llave vieja.
    var claveDe = {};
    api.lista('familias', { aula_id: aula.id }).forEach(function (f) { if (f.clave) claveDe[f.alumno_id] = f.clave; });

    var g = {
      id: aula.id,
      escuela: aula.escuela || '',
      grado: aula.grado == null ? '' : String(aula.grado),
      seccion: aula.seccion || '',
      // Los logos todavía no pasan a filas (corte 1): sin logo, como un
      // grupo que no lo subió.
      logo: '',
      logoSec: '',
      boleta: Object.assign({}, def, ajustes, {
        director: aula.director || ajustes.director || def.director || '',
        docente: aula.docente_nombre || ajustes.docente || def.docente || '',
        lugar: aula.lugar || ajustes.lugar || def.lugar || '',
        municipio: aula.municipio || ajustes.municipio || def.municipio || '',
        departamento: aula.departamento || ajustes.departamento || def.departamento || '',
        anio: String(aula.anio_lectivo || def.anio || ''),
        escalaPers: aula.escala_personalidad && aula.escala_personalidad.length ? aula.escala_personalidad.slice() : (def.escalaPers || ['S', 'MB', 'B']),
        parcialFechas: ajustes.parcialFechas || {},
      }),
      lista: alumnos.map(function (a) {
        return {
          id: a.id, num: numDe[a.id], nombre: a.nombre_completo, idn: a.identidad || '', sexo: a.sexo || '',
          estado: a.estado || 'activo', estadoF: a.estado_fecha || '', fnac: a.fecha_nacimiento || '',
          noCopiarSace: !!a.no_copiar_sace, claveFamilia: claveDe[a.id] || '',
        };
      }),
      materias: [],
      notas: {},
      recuperacion: {},
      inasisOficial: {},
      asistencia: [],
      colectas: [],
      controles: [],
      bitacora: [],
    };

    var asig = api.lista('asignaturas', { aula_id: aula.id }).sort(function (a, b) {
      return (a.orden || 0) - (b.orden || 0) || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
    });
    var nombreAsig = {};
    asig.forEach(function (x) { nombreAsig[x.id] = x.nombre; g.materias.push(x.nombre); });
    function poner(p, campo, n, v) {
      var porP = g.notas[p] || (g.notas[p] = {});
      (porP[campo] || (porP[campo] = {}))[n] = v;
    }
    api.lista('notas', { aula_id: aula.id }).forEach(function (n) {
      if ((n.componente || 'final') !== 'final' || !nombreAsig[n.asignatura_id] || numDe[n.alumno_id] == null) return;
      if (n.periodo === 'REC') {
        var r = g.recuperacion[nombreAsig[n.asignatura_id]] || (g.recuperacion[nombreAsig[n.asignatura_id]] = {});
        r[numDe[n.alumno_id]] = nota(n.valor);
      } else {
        poner(n.periodo, nombreAsig[n.asignatura_id], numDe[n.alumno_id], nota(n.valor));
      }
    });
    api.lista('notas_personalidad', { aula_id: aula.id }).forEach(function (n) {
      if (numDe[n.alumno_id] != null) poner(n.periodo, n.rasgo, numDe[n.alumno_id], n.letra);
    });
    api.lista('inasistencias_oficiales', { aula_id: aula.id }).forEach(function (n) {
      if (numDe[n.alumno_id] == null) return;
      if (n.periodo === 'ANUAL') g.inasisOficial[numDe[n.alumno_id]] = n.dias;
      else if (PARCIALES.indexOf(n.periodo) >= 0) poner(n.periodo, 'Inasistencias', numDe[n.alumno_id], String(n.dias));
    });

    // Pase de lista: un día por fecha con quien no vino (A ausente, E con
    // excusa), y también los días en que nadie faltó.
    var dias = {};
    api.lista('asistencia_dias', { aula_id: aula.id }).forEach(function (x) { dias[x.fecha] = dias[x.fecha] || {}; });
    api.lista('asistencia', { aula_id: aula.id }).forEach(function (x) {
      if (numDe[x.alumno_id] == null || (x.estado !== 'ausente' && x.estado !== 'excusa')) return;
      (dias[x.fecha] = dias[x.fecha] || {})[numDe[x.alumno_id]] = x.estado === 'ausente' ? 'A' : 'E';
    });
    g.asistencia = Object.keys(dias).sort().map(function (f) { return { f: f, aus: dias[f] }; });

    // Colectas: lo dado por cada alumno (sumado en centavos), la fecha de su
    // último pago y los gastos. «No cuentan» los que ya no están en el aula
    // o no les corresponde, igual que en la pantalla.
    var porAlumno = api.lista('v_colecta_alumnos');
    var cols = api.lista('colectas', { aula_id: aula.id }).sort(function (a, b) {
      return String(a.fecha).localeCompare(String(b.fecha)) || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
    });
    cols.forEach(function (c) {
      var pagos = {};
      var pagosF = {};
      var deEste = {};
      api.lista('pagos', { colecta_id: c.id }).forEach(function (p) {
        if (numDe[p.alumno_id] == null || p.monto == null) return;
        (deEste[p.alumno_id] = deEste[p.alumno_id] || []).push(p);
      });
      Object.keys(deEste).forEach(function (id) {
        pagos[numDe[id]] = montos.sumar(deEste[id].map(function (p) { return p.monto; }));
        pagosF[numDe[id]] = deEste[id].map(function (p) { return p.fecha; }).sort().pop();
      });
      var fuera = porAlumno.filter(function (x) {
        return x.colecta_id === c.id && (!x.sigue || x.situacion === 'no_corresponde') && numDe[x.alumno_id] != null;
      }).map(function (x) { return numDe[x.alumno_id]; }).sort(function (a, b) { return a - b; });
      var col = {
        id: c.id, concepto: c.concepto, fecha: c.fecha, montoAlumno: c.monto_sugerido || '0.00', pagos: pagos, pagosF: pagosF,
        gastos: api.lista('gastos', { colecta_id: c.id }).filter(function (x) { return x.monto != null; })
          .sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); })
          .map(function (x) { return { id: x.id, d: x.concepto, m: x.monto, f: x.fecha }; }),
      };
      if (fuera.length) col.noCuentan = fuera;
      g.colectas.push(col);
    });
    return g;
  }

  var HOJAS = {
    boletas: function (g) { window.adPrintBoletas(g, null); },
    resumen: function (g) { window.adPrintResumenFinal(g); },
    cuadro: function (g) { window.adPrintCuadroFinal(g); },
    ingresos: function (g) { window.adPrintCuadroIngresos(g); },
    egresos: function (g) { window.adPrintCuadroEgresos(g); },
    talonario: function (g) { window.adPrintTalonario(g); },
  };

  window.metasMiAulaPapel = {
    grupo: grupo,
    imprimir: function (api, aula, que) {
      if (HOJAS[que]) HOJAS[que](grupo(api, aula));
    },
  };
})();
