/* =====================================================================
   M.E.T.A.S — js/datos/datos.js · la única puerta de las herramientas
   ---------------------------------------------------------------------
   Las herramientas del maestro (Mi aula, notas, asistencia, colectas…)
   leen y escriben SOLO por aquí (03, 3.10). Contrato con sus pruebas:
   docs/rediseno-datos/pruebas-capa-b/CONTRATO.md.

   Lo que ve la pantalla es la copia de lo que dice la base MÁS lo que
   todavía está en la cola, como si ya estuviera guardado: el docente no
   ve ninguna diferencia entre una cosa y otra (03, 3.8). Escribir es
   instantáneo y nunca espera a la red.

   Aquí no hay ningún texto de «sincronizar», «guardar», «recuperar» ni
   «restaurar» (09-INTERFAZ.md): lo único que le llega al docente son las
   preguntas de dos botones y, rara vez, «no quedó anotado».
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};
  var nube = M._nube;
  var alm = M._almacen;
  var cola = M._cola;
  var tr = M._tiempoReal;
  var montos = M.montos;

  // Columnas que pone la base y el aparato no manda nunca (03, 3.2).
  var DE_LA_BASE = ['owner', 'created_at', 'updated_at', 'updated_by', 'version', 'deleted_at', 'op_creacion',
    'device_id', 'recibo', 'nombre_norm'];
  // El dinero solo se escribe por funciones del servidor (regla 18).
  var SOLO_FUNCIONES = { colecta_exenciones: 1, gastos: 1, gastos_docente: 1, reembolsos: 1,
    convocatoria_pagos: 1, actas_inventario: 1, bienes: 1 };

  function copia(o) {
    var r = {};
    for (var k in o) r[k] = o[k];
    return r;
  }
  // Vacío y null valen lo mismo: la base guarda null donde no hay nada.
  function igual(a, b) {
    return JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);
  }
  function limpia(fila) {
    var r = {};
    for (var k in fila) if (DE_LA_BASE.indexOf(k) < 0 && fila[k] !== undefined) r[k] = fila[k];
    return r;
  }
  // Lo que la pantalla le puede mostrar al docente tal cual: una frase del
  // aula, de tú, sin nada técnico (09-INTERFAZ.md). La pantalla valida antes
  // de llamar, así que casi nunca se llega aquí.
  function aviso(texto) {
    var e = new Error(texto);
    e.paraElDocente = true;
    return e;
  }

  function cuenta() {
    var u = nube.uid();
    if (!u) throw aviso('Escribe tu correo y tu contraseña para entrar.');
    return u;
  }

  // ── Lo que ve la pantalla: copia + cola ─────────────────────────────────
  // Lo de la cola y las preguntas va en su orden (seq); lo que esta
  // pestaña anotó y la líder todavía no tomó, al final, en el orden en que
  // se anotó. Una misma operación nunca se cuenta dos veces.
  function opsDe(owner, tabla) {
    var vistas = {};
    var ops = alm.cola().filter(function (o) { return o.owner === owner && o.tabla === tabla; });
    alm.preguntas().forEach(function (p) {
      if (p.owner === owner && p.op && p.op.tabla === tabla) ops.push(p.op);
    });
    ops.sort(function (a, b) { return a.seq - b.seq; });
    ops.forEach(function (o) { vistas[o.op_id] = 1; });
    alm.misEntrantes().forEach(function (o) {
      if (o.owner === owner && o.tabla === tabla && !vistas[o.op_id]) ops.push(o);
    });
    return ops;
  }

  function aplicar(mapa, op) {
    var a = op.args || {};
    var f;
    switch (op.tipo) {
      case 'crear':
        mapa.set(op.id, Object.assign({ id: op.id, version: 0, deleted_at: null }, op.cambios));
        break;
      case 'alumno_crear':
        mapa.set(op.id, Object.assign({ id: op.id, version: 0, deleted_at: null, estado: 'activo', aula_id: a.p_aula },
          a.p_campos));
        break;
      case 'editar':
        if ((f = mapa.get(op.id))) mapa.set(op.id, Object.assign(copia(f), op.cambios));
        break;
      case 'borrar':
      case 'colecta_borrar':
        mapa.delete(op.id);
        break;
      case 'desarchivar':
        // La fila archivada no está en el mapa (se armó sin las borradas).
        // La operación trae sus campos para que vuelva a verse al momento.
        mapa.set(op.id, Object.assign({ id: op.id, version: 0, deleted_at: null }, op.cambios || {}));
        break;
      case 'pago_crear':
        mapa.set(op.id, {
          id: op.id, colecta_id: a.p_colecta, alumno_id: a.p_alumno, monto: a.p_monto || null, fecha: a.p_fecha,
          nota: a.p_nota || null, recibo_anterior: a.p_recibo_anterior || null, recibo: null, version: 0, deleted_at: null,
        });
        break;
      case 'pago_corregir':
        f = mapa.get(a.p_pago);
        mapa.delete(a.p_pago);
        mapa.set(a.p_nuevo_id, Object.assign(f ? copia(f) : { colecta_id: a._colecta, alumno_id: a._alumno }, {
          id: a.p_nuevo_id, monto: a.p_monto || null, fecha: a.p_fecha || (f && f.fecha), recibo: null,
          reemplaza_a: a.p_pago, reemplaza_recibo: f ? f.recibo : null, version: 0, deleted_at: null,
        }));
        break;
      case 'pago_anular':
        mapa.delete(a.p_pago);
        break;
      case 'pago_editar':
        if ((f = mapa.get(a.p_pago))) mapa.set(a.p_pago, Object.assign(copia(f), a.p_cambios));
        break;
      case 'colecta_crear':
        mapa.set(op.id, {
          id: op.id, aula_id: a.p_aula, concepto: a.p_concepto, monto_sugerido: a.p_monto_sugerido || null,
          fecha: a.p_fecha, estado: 'abierta', version: 0, deleted_at: null,
        });
        break;
      case 'colecta_editar':
        if ((f = mapa.get(op.id))) mapa.set(op.id, Object.assign(copia(f), a.p_cambios));
        break;
      case 'colecta_cerrar':
      case 'colecta_reabrir':
        if ((f = mapa.get(op.id))) mapa.set(op.id, Object.assign(copia(f), { estado: op.tipo === 'colecta_cerrar' ? 'cerrada' : 'abierta' }));
        break;
      case 'gasto_crear':
        mapa.set(op.id, {
          id: op.id, colecta_id: a.p_colecta, fecha: a.p_fecha, concepto: a.p_concepto, monto: a.p_monto || null,
          version: 0, deleted_at: null,
        });
        break;
      case 'gasto_editar':
        if ((f = mapa.get(a.p_gasto))) mapa.set(a.p_gasto, Object.assign(copia(f), a.p_cambios));
        break;
      case 'gasto_anular':
        mapa.delete(a.p_gasto);
        break;
      // Gastos del docente (de su bolsillo) y lo que le devuelven: el estado
      // («me lo pagaron») no se guarda, se calcula de los reembolsos.
      case 'gasto_docente_crear':
        mapa.set(op.id, Object.assign({
          id: op.id, fecha: a.p_fecha, tipo: a.p_tipo, concepto: a.p_concepto, cobrar_a: a.p_cobrar_a,
          monto: a.p_monto || null, version: 0, deleted_at: null, tiene_recibo: false, aula_id: null, escuela: null,
        }, a.p_campos || {}));
        break;
      case 'gasto_docente_editar':
        if ((f = mapa.get(a.p_gasto))) mapa.set(a.p_gasto, Object.assign(copia(f), a.p_cambios));
        break;
      case 'gasto_docente_anular':
        mapa.delete(a.p_gasto);
        break;
      case 'reembolso_crear':
        mapa.set(op.id, {
          id: op.id, gasto_id: a.p_gasto, fecha: a.p_fecha, monto: a.p_monto || null, quien_pago: a.p_quien_pago || null,
          nota: a.p_nota || null, version: 0, deleted_at: null,
        });
        break;
      case 'reembolso_anular':
        mapa.delete(a.p_reembolso);
        break;
      case 'exencion_poner':
      case 'exencion_quitar':
        mapa.forEach(function (e, id) {
          if (e.colecta_id === a.p_colecta && e.alumno_id === a.p_alumno) mapa.delete(id);
        });
        if (op.tipo === 'exencion_poner') {
          mapa.set(op.id, {
            id: op.id, colecta_id: a.p_colecta, alumno_id: a.p_alumno, monto_aplicable: a.p_monto_aplicable,
            motivo: a.p_motivo || null, version: 0, deleted_at: null, por_aclarar: !!op.por_aclarar,
          });
        }
        break;
    }
  }

  function tabla(owner, nombre) {
    var mapa = new Map();
    alm.filasDe(owner, nombre).forEach(function (f) { if (!f.deleted_at) mapa.set(f.id, f); });
    opsDe(owner, nombre).forEach(function (op) { aplicar(mapa, op); });
    return mapa;
  }

  M._vista = {
    tabla: tabla,
    fila: function (owner, nombre, id) { return tabla(owner, nombre).get(id) || null; },
  };

  function filtrar(filas, filtro) {
    if (!filtro) return filas;
    var ks = Object.keys(filtro);
    return filas.filter(function (f) {
      return ks.every(function (k) { return String(f[k]) === String(filtro[k]); });
    });
  }

  function lista(nombre, filtro) {
    var u = nube.uid();
    if (!u) return [];
    var filas;
    if (nombre === 'v_colectas_resumen' || nombre === 'v_colecta_alumnos') {
      var col = Array.from(tabla(u, 'colectas').values());
      var alu = Array.from(tabla(u, 'alumnos').values());
      var exe = Array.from(tabla(u, 'colecta_exenciones').values());
      var pag = Array.from(tabla(u, 'pagos').values());
      filas = nombre === 'v_colecta_alumnos'
        ? M.calculos.colectaAlumnos(col, alu, exe, pag)
        : M.calculos.colectasResumen(col, alu, exe, pag, Array.from(tabla(u, 'gastos').values()));
    } else {
      filas = Array.from(tabla(u, nombre).values()).map(copia);
    }
    return filtrar(filas, filtro);
  }

  // ── Escribir ───────────────────────────────────────────────────────────
  function leerMonto(texto, permitirCero) {
    var r = montos.leer(texto);
    if (r.pregunta) return r;
    if (!r.ok) throw aviso('Escribe el monto con números, por ejemplo 150 o 150.50.');
    if (!permitirCero && r.valor === '0.00') throw aviso('El monto tiene que ser mayor que cero.');
    return r;
  }

  // La importación (importar.js) manda su propio id de operación, que sale
  // del contenido del archivo: así el mismo dato importado dos veces, o en
  // dos aparatos, es la MISMA operación y la base lo reconoce (03, 3.3).
  function conOp(op, extra) {
    if (extra && extra.op_id) op.op_id = extra.op_id;
    return op;
  }

  // El monto lo escribió el docente y es ambiguo («1,500»): la operación
  // queda anotada y espera su respuesta («¿L 1,500.00 o L 1.50?»).
  function encolarConMonto(op, lectura) {
    // Mientras se aclara, lo que depende de ese monto queda sin dato (calculos.js).
    if (lectura.pregunta) op.por_aclarar = true;
    if (lectura.pregunta) cola.preguntaMontoAmbiguo(op, lectura.pregunta);
    else cola.encolar(op);
    return { id: op.id };
  }

  function crear(nombre, fila, extra) {
    var u = cuenta();
    if (nombre === 'pagos') return pagar(fila, extra);
    if (nombre === 'colectas') return colecta.crear(fila, extra);
    if (SOLO_FUNCIONES[nombre]) throw aviso('Esto no se puede anotar aquí.');
    var id = (fila && fila.id) || M.ids.nuevo();
    var campos = limpia(fila || {});
    delete campos.id;
    if (nombre === 'alumnos') {
      var aula = campos.aula_id;
      delete campos.aula_id;
      cola.encolar(conOp({ owner: u, tipo: 'alumno_crear', tabla: 'alumnos', id: id,
        args: { p_id: id, p_aula: aula, p_campos: campos, p_no_es: [] } }, extra));
      return { id: id };
    }
    cola.encolar(conOp({ owner: u, tipo: 'crear', tabla: nombre, id: id, cambios: campos }, extra));
    return { id: id };
  }

  // extra.op_id lo manda el importador: la misma corrección, otra vez, es
  // la misma operación. Quien no lo pasa sigue con un id nuevo, como antes.
  function editar(nombre, id, cambios, extra) {
    var u = cuenta();
    var c = limpia(cambios || {});
    delete c.id;
    if (nombre === 'colectas') return colecta.editar(id, c);
    if (nombre === 'pagos') {
      Object.keys(c).forEach(function (k) {
        if (k !== 'nota' && k !== 'recibo_anterior') throw aviso('Para cambiar el monto o la fecha, corrige el pago.');
      });
      cola.encolar({ owner: u, tipo: 'pago_editar', tabla: 'pagos', id: id, colecta: (M._vista.fila(u, 'pagos', id) || {}).colecta_id,
        args: { p_pago: id, p_cambios: c } });
      return { id: id };
    }
    if (SOLO_FUNCIONES[nombre]) throw aviso('Esto no se puede cambiar aquí.');
    if (nombre === 'alumnos' && 'identidad' in c) {
      c.identidad = String(c.identidad || '').toUpperCase().replace(/[^0-9A-Z]/g, '') || null;
    }
    var enBase = alm.fila(u, nombre, id);
    var visto = M._vista.fila(u, nombre, id) || {};
    // Solo va lo que cambió frente a lo que ve el aparato. Mandar la fila
    // entera (con el nombre que no se tocó) hacía que un nombre repetido
    // trabara también todas las ediciones siguientes de esa fila, y que
    // una edición vieja en cola volviera a escribir el nombre de antes.
    if (M._vista.fila(u, nombre, id)) {
      Object.keys(c).forEach(function (k) { if (igual(visto[k], c[k])) delete c[k]; });
      if (!Object.keys(c).length) return { id: id };
    }
    var base = {};
    Object.keys(c).forEach(function (k) { base[k] = visto[k] === undefined ? null : visto[k]; });
    cola.encolar(conOp({ owner: u, tipo: 'editar', tabla: nombre, id: id,
      base_version: enBase && !enBase.deleted_at ? enBase.version : null, base: base, cambios: c }, extra));
    return { id: id };
  }

  // Los centros archivados (deleted_at) y los que están por archivarse
  // en la cola. lista() no los trae: si los trajera, un centro oculto
  // volvería a la barra de arriba.
  function archivados(nombre) {
    var u = nube.uid();
    if (!u) return [];
    var mapa = new Map();
    alm.filasDe(u, nombre).forEach(function (f) {
      if (f.deleted_at) mapa.set(f.id, f);
    });
    opsDe(u, nombre).forEach(function (op) {
      if (op.tipo === 'desarchivar') mapa.delete(op.id);
      if (op.tipo === 'borrar' || op.tipo === 'colecta_borrar') {
        var f = alm.fila(u, nombre, op.id);
        if (f) mapa.set(op.id, Object.assign(copia(f), { deleted_at: f.deleted_at || 'pendiente' }));
      }
    });
    return Array.from(mapa.values()).map(copia);
  }

  function borrar(nombre, id) {
    var u = cuenta();
    if (nombre === 'colectas') {
      cola.encolar({ owner: u, tipo: 'colecta_borrar', tabla: 'colectas', id: id, colecta: id, args: { p_colecta: id } });
      return { id: id };
    }
    if (nombre === 'pagos') throw aviso('Un pago no se borra: se anula, con su motivo.');
    if (SOLO_FUNCIONES[nombre]) throw aviso('Esto no se puede quitar aquí.');
    cola.encolar({ owner: u, tipo: 'borrar', tabla: nombre, id: id });
    return { id: id };
  }

  // deleted_at vuelve a vacío. No es un editar: esa columna la pone la
  // base y editar() la quita. La pantalla ya miró centros_unico.
  function recuperar(nombre, id) {
    var u = cuenta();
    if (SOLO_FUNCIONES[nombre]) throw aviso('Esto no se hace desde aquí.');
    var guardada = alm.fila(u, nombre, id) || {};
    cola.encolar({ owner: u, tipo: 'desarchivar', tabla: nombre, id: id, cambios: limpia(guardada) });
    return { id: id };
  }

  // No se aplica a la vista hasta que la base contesta. Así, si la función
  // todavía no está pegada, el centro sigue en la lista.
  function mandarCentro(tipo, id) {
    var u = cuenta();
    cola.encolar({ owner: u, tipo: tipo, tabla: 'centros', id: id, args: { p_centro: id } });
    return { id: id };
  }

  // ── Dinero (solo por funciones del servidor, regla 18) ────────────────
  function pagar(p, extra) {
    var u = cuenta();
    var lectura = leerMonto(p.monto, false);
    var id = p.id || M.ids.nuevo();
    // Lo que el aparato tenía a la vista de ese alumno en esa colecta: si en
    // la base hay otro pago que no estaba aquí, la base pregunta (3.5).
    var conocidos = lista('pagos', { colecta_id: p.colecta_id, alumno_id: p.alumno_id }).map(function (x) { return x.id; });
    return encolarConMonto(conOp({
      owner: u, tipo: 'pago_crear', tabla: 'pagos', id: id, colecta: p.colecta_id,
      args: { p_id: id, p_colecta: p.colecta_id, p_alumno: p.alumno_id, p_monto: lectura.valor || null, p_fecha: p.fecha,
        p_nota: p.nota || null, p_recibo_anterior: p.recibo_anterior || null, p_conocidos: conocidos, p_son_distintos: false },
    }, extra), lectura);
  }

  function corregirPago(id, c) {
    var u = cuenta();
    var visto = M._vista.fila(u, 'pagos', id);
    if (!visto) throw aviso('Ese pago ya no está en la lista.');
    var lectura = leerMonto(c.monto == null ? visto.monto : c.monto, false);
    var nuevo = M.ids.nuevo();
    return encolarConMonto({
      owner: u, tipo: 'pago_corregir', tabla: 'pagos', id: nuevo, colecta: visto.colecta_id,
      args: { p_pago: id, p_base: { monto: visto.monto, fecha: visto.fecha }, p_nuevo_id: nuevo,
        p_monto: lectura.valor || null, p_fecha: c.fecha || visto.fecha, p_motivo: c.motivo || 'corrección',
        _alumno: visto.alumno_id, _colecta: visto.colecta_id },
    }, lectura);
  }

  function anularPago(id, motivo) {
    var u = cuenta();
    var visto = M._vista.fila(u, 'pagos', id) || {};
    cola.encolar({ owner: u, tipo: 'pago_anular', tabla: 'pagos', id: id, colecta: visto.colecta_id,
      args: { p_pago: id, p_motivo: motivo } });
    return { id: id };
  }

  var colecta = {
    crear: function (c, extra) {
      var u = cuenta();
      var lectura = leerMonto(c.monto_sugerido, true);
      var id = c.id || M.ids.nuevo();
      return encolarConMonto(conOp({
        owner: u, tipo: 'colecta_crear', tabla: 'colectas', id: id, colecta: id,
        args: { p_id: id, p_aula: c.aula_id, p_concepto: c.concepto, p_monto_sugerido: lectura.valor || null, p_fecha: c.fecha },
      }, extra), lectura);
    },
    editar: function (id, cambios) {
      var u = cuenta();
      var c = {};
      ['concepto', 'fecha', 'monto_sugerido'].forEach(function (k) { if (k in cambios) c[k] = cambios[k]; });
      var visto = M._vista.fila(u, 'colectas', id) || {};
      var lectura = { ok: true };
      if ('monto_sugerido' in c) {
        lectura = leerMonto(c.monto_sugerido, true);
        c.monto_sugerido = lectura.valor || null;
      }
      return encolarConMonto({
        owner: u, tipo: 'colecta_editar', tabla: 'colectas', id: id, colecta: id,
        args: { p_colecta: id, p_base: visto.monto_sugerido ? { monto_sugerido: visto.monto_sugerido } : {}, p_cambios: c },
      }, lectura);
    },
    cerrar: function (id) {
      var u = cuenta();
      cola.encolar({ owner: u, tipo: 'colecta_cerrar', tabla: 'colectas', id: id, colecta: id, args: { p_colecta: id } });
      return { id: id };
    },
    reabrir: function (id, motivo) {
      var u = cuenta();
      cola.encolar({ owner: u, tipo: 'colecta_reabrir', tabla: 'colectas', id: id, colecta: id,
        args: { p_colecta: id, p_motivo: motivo || null } });
      return { id: id };
    },
    borrar: function (id) { return borrar('colectas', id); },
  };

  var exencion = {
    // monto_aplicable vacío o null = exento del todo.
    poner: function (e, extra) {
      var u = cuenta();
      var hay = lista('colecta_exenciones', { colecta_id: e.colecta_id, alumno_id: e.alumno_id })[0];
      var lectura = { ok: true, valor: null };
      if (e.monto_aplicable != null && e.monto_aplicable !== '') lectura = leerMonto(e.monto_aplicable, true);
      var id = e.id || M.ids.nuevo();
      return encolarConMonto(conOp({
        owner: u, tipo: 'exencion_poner', tabla: 'colecta_exenciones', id: id, colecta: e.colecta_id,
        args: { p_id: id, p_colecta: e.colecta_id, p_alumno: e.alumno_id, p_monto_aplicable: lectura.valor || null,
          p_motivo: e.motivo || null, p_base: hay ? { monto_aplicable: hay.monto_aplicable } : {} },
      }, extra), lectura);
    },
    quitar: function (e) {
      var u = cuenta();
      var id = M.ids.nuevo();
      cola.encolar({ owner: u, tipo: 'exencion_quitar', tabla: 'colecta_exenciones', id: id, colecta: e.colecta_id,
        args: { p_colecta: e.colecta_id, p_alumno: e.alumno_id } });
      return { id: id };
    },
  };

  // Gastos de una colecta («cuentas claras»): solo por funciones.
  var gasto = {
    crear: function (g, extra) {
      var u = cuenta();
      var lectura = leerMonto(g.monto, false);
      var id = g.id || M.ids.nuevo();
      var visto = M._vista.fila(u, 'colectas', g.colecta_id) || {};
      var conocidos = lista('gastos', { colecta_id: g.colecta_id }).map(function (x) { return x.id; });
      return encolarConMonto(conOp({
        owner: u, tipo: 'gasto_crear', tabla: 'gastos', id: id, colecta: g.colecta_id,
        args: { p_id: id, p_colecta: g.colecta_id, p_fecha: g.fecha, p_concepto: g.concepto, p_monto: lectura.valor || null,
          p_campos: {}, p_conocidos: conocidos, p_son_distintos: false, _aula: visto.aula_id },
      }, extra), lectura);
    },
    anular: function (id, motivo) {
      var u = cuenta();
      var visto = M._vista.fila(u, 'gastos', id) || {};
      cola.encolar({ owner: u, tipo: 'gasto_anular', tabla: 'gastos', id: id, colecta: visto.colecta_id,
        args: { p_gasto: id, p_motivo: motivo } });
      return { id: id };
    },
  };

  // Gastos del docente y sus reembolsos («Gastos de mi bolsillo»): dinero,
  // solo por funciones. El monto de un reembolso no se cambia: se anula.
  var gastoDocente = {
    crear: function (g, extra) {
      var u = cuenta();
      var lectura = leerMonto(g.monto, false);
      var id = g.id || M.ids.nuevo();
      var conocidos = lista('gastos_docente').map(function (x) { return x.id; });
      var campos = {};
      ['tiene_recibo', 'escuela', 'aula_id'].forEach(function (k) { if (g[k] != null && g[k] !== '') campos[k] = g[k]; });
      return encolarConMonto(conOp({
        owner: u, tipo: 'gasto_docente_crear', tabla: 'gastos_docente', id: id,
        args: { p_id: id, p_fecha: g.fecha, p_tipo: g.tipo || 'otro', p_concepto: g.concepto, p_cobrar_a: g.cobrar_a || 'Otro',
          p_monto: lectura.valor || null, p_campos: campos, p_conocidos: conocidos, p_son_distintos: !!g.son_distintos },
      }, extra), lectura);
    },
    anular: function (id, motivo) {
      var u = cuenta();
      cola.encolar({ owner: u, tipo: 'gasto_docente_anular', tabla: 'gastos_docente', id: id,
        args: { p_gasto: id, p_motivo: motivo || 'quitado por el docente' } });
      return { id: id };
    },
  };
  var reembolso = {
    crear: function (r, extra) {
      var u = cuenta();
      var lectura = leerMonto(r.monto, false);
      var id = r.id || M.ids.nuevo();
      var conocidos = lista('reembolsos', { gasto_id: r.gasto_id }).map(function (x) { return x.id; });
      return encolarConMonto(conOp({
        owner: u, tipo: 'reembolso_crear', tabla: 'reembolsos', id: id,
        args: { p_id: id, p_gasto: r.gasto_id, p_monto: lectura.valor || null, p_fecha: r.fecha,
          p_quien_pago: r.quien_pago || null, p_nota: r.nota || null, p_conocidos: conocidos, p_son_distintos: !!r.son_distintos },
      }, extra), lectura);
    },
    anular: function (id, motivo) {
      var u = cuenta();
      cola.encolar({ owner: u, tipo: 'reembolso_anular', tabla: 'reembolsos', id: id,
        args: { p_reembolso: id, p_motivo: motivo || 'quitado por el docente' } });
      return { id: id };
    },
  };

  // ── Cuenta ─────────────────────────────────────────────────────────────
  // Solo la líder habla con la base (rev. 9): conecta Realtime, se pone al
  // día y manda la cola. Las demás pestañas reciben lo que ella cuenta.
  var arrancada = null;
  function arrancar(owner) {
    if (!alm.esLider() || !owner) return;
    if (arrancada !== owner) {
      tr.desconectar();
      tr.conectar(owner);
      arrancada = owner;
    }
    tr.ponerseAlDia(owner);
    cola.reanudar();
  }
  function parar() {
    tr.desconectar();
    arrancada = null;
  }

  async function entrar(correo, clave) {
    var r = await nube.entrar(correo, clave);
    if (r.ok) arrancar(nube.uid());
    return r;
  }

  // Con señal, termina de mandar lo pendiente antes de cerrar (el botón
  // muestra su espera normal, sin texto). Sin señal, lo guarda para esta
  // cuenta en este aparato y sale cuando esta cuenta vuelva a entrar (3.7).
  async function salirEnLider() {
    var u = nube.uid();
    if (!u) return;
    if (M._senal.hay()) {
      await Promise.race([cola.esperar(), new Promise(function (ok) { setTimeout(ok, 15000); })]);
      var s = nube.sesion();
      if (s) {
        w.fetch(nube.url + '/auth/v1/logout?scope=local', {
          method: 'POST', headers: { apikey: nube.llave, authorization: 'Bearer ' + s.access_token },
        }).catch(function () {});
      }
    }
    parar();
    nube.olvidarSesion();
    var queda = alm.cola().some(function (o) { return o.owner === u; })
      || alm.preguntas().some(function (p) { return p.owner === u; });
    if (!queda) alm.olvidarCuenta(u);
    cola.revisarEspera();
  }
  async function salir() {
    if (!nube.uid()) return;
    if (alm.esLider()) return salirEnLider();
    // Otra pestaña: lo hace la líder, que es la que tiene la cola; aquí se
    // toma la sesión vacía que ella reparte.
    await cola.pedirALaLider({ t: 'salir' });
    if (nube.uid()) nube.tomarDeOtra(null);
  }

  // La sesión cambió en ESTA pestaña (entró, renovó, salió): se les cuenta
  // a las demás. Si llegó de otra, la líder arranca o para según quién quedó.
  nube.alCambiarSesion(function (s, deOtra) {
    if (!deOtra) alm.enviar({ t: 'sesion', s: s });
    if (!alm.esLider()) return;
    if (s && s.uid) { if (deOtra) arrancar(s.uid); } else parar();
  });

  alm.alMensaje(function (m) {
    if (m.t === 'sesion') {
      var actual = nube.sesion();
      if (!m.s && !actual) return;
      if (m.s && actual && m.s.access_token === actual.access_token) return;
      nube.tomarDeOtra(m.s || null);
      return;
    }
    if (!alm.esLider()) return;
    if (m.t === 'renovar') nube.renovar().catch(function () {});
    else if (m.t === 'hola') { var s = nube.sesion(); if (s) alm.enviar({ t: 'sesion', s: s }); }
    else if (m.t === 'salir') salirEnLider().then(function () { alm.enviar({ t: 'hecho', rid: m.rid }); });
  });

  // Esta pestaña pasa a ser la líder (la anterior se cerró): lee lo
  // guardado, toma lo que anotaron las demás y sigue.
  async function serLider() {
    await alm.asumir();
    nube.retomar();
    if (nube.uid()) arrancar(nube.uid());
    await cola.absorber();
  }

  // Los avisos de antes de v569 no traen clave y dicen «no se pudo anotar».
  // El docente no los entiende y ya no tienen arreglo. No se borran:
  // noAnotado() simplemente no los entrega. Los de ahora traen clave y
  // el motivo real, y sí se muestran.
  function avisoViejoGenerico(t) {
    if (!t || t.clave) return false;
    return /no se pudo anotar/.test(String(t.texto || ''));
  }

  var api = null;
  var iniciando = null;

  M.iniciar = function () {
    if (iniciando) return iniciando;
    iniciando = (async function () {
      await alm.cargar();
      nube.retomar();
      var soyLider = await alm.elegirLider(serLider);
      w.addEventListener('online', function () {
        if (!alm.esLider()) return;
        cola.ahoraMismo();
        if (nube.uid()) tr.ponerseAlDia(nube.uid());
      });
      if (w.document && w.document.addEventListener) {
        w.document.addEventListener('visibilitychange', function () {
          if (w.document.visibilityState !== 'visible' || !alm.esLider()) return;
          cola.ahoraMismo();
          if (nube.uid()) tr.ponerseAlDia(nube.uid());
        });
      }
      api = {
        entrar: entrar,
        salir: salir,
        crear: crear,
        editar: editar,
        borrar: borrar,
        recuperar: recuperar,
        // El centro, sus grupos y sus alumnos. La base lo hace junto.
        // Si la función todavía no está, la cola avisa y no esconde nada.
        archivarCentro: function (id) { return mandarCentro('centro_archivar', id); },
        recuperarCentroJunto: function (id) { return mandarCentro('centro_volver', id); },
        borrarCentroDefinitivo: function (id) { return mandarCentro('centro_borrar', id); },
        archivados: archivados,
        pagar: pagar,
        corregirPago: corregirPago,
        anularPago: anularPago,
        colecta: colecta,
        exencion: exencion,
        gasto: gasto,
        gastoDocente: gastoDocente,
        reembolso: reembolso,
        lista: lista,
        escuchar: cola.escuchar,
        preguntas: function () {
          var u = nube.uid();
          return alm.preguntas().filter(function (p) { return p.owner === u; }).map(function (p) {
            return { id: p.id, tipo: p.tipo, texto: p.texto, botones: p.botones.map(copia) };
          });
        },
        responder: cola.responderEnLider,
        pendientes: function () { return nube.uid() ? cola.pendientes(nube.uid()) : 0; },
        noAnotado: function () {
          var u = nube.uid();
          return alm.noAnotado().filter(function (t) {
            return t.owner === u && !avisoViejoGenerico(t);
          }).map(function (t) {
            // Una sola tarjeta por fila y motivo: «veces» cuenta cuántas veces pasó.
            return { id: t.id, texto: t.texto, veces: t.veces || 1 };
          });
        },
        // El único botón de la tarjeta «no quedó anotado»: «Entendido».
        entendido: cola.entendido,
        esperarCola: cola.esperar,
        // Para el punto gris de «sin señal» (lo dibuja la pantalla).
        sinSenal: function () { return !M._senal.hay(); },
        alCambiarSenal: function (f) { M._senal.alCambiar(function (hay) { f(!hay); }); },
        // La sesión venció y no se pudo renovar: la pantalla pide la
        // contraseña («Escribe tu contraseña»), sin explicar por qué.
        pideContrasena: function () { return cola.pausada(); },
        cuenta: function () { var s = nube.sesion(); return s ? { nombre: s.nombre, rol: s.rol } : null; },
      };
      if (soyLider) {
        if (nube.uid()) arrancar(nube.uid());
        await cola.absorber();
      } else {
        alm.enviar({ t: 'hola' });
      }
      return api;
    })();
    return iniciando;
  };
})(window);
