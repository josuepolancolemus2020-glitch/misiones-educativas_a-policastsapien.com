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
  function limpia(fila) {
    var r = {};
    for (var k in fila) if (DE_LA_BASE.indexOf(k) < 0 && fila[k] !== undefined) r[k] = fila[k];
    return r;
  }
  function cuenta() {
    var u = nube.uid();
    if (!u) throw new Error('no hay una cuenta abierta en este aparato');
    return u;
  }

  // ── Lo que ve la pantalla: copia + cola ─────────────────────────────────
  function opsDe(owner, tabla) {
    var ops = alm.cola().filter(function (o) { return o.owner === owner && o.tabla === tabla; });
    alm.preguntas().forEach(function (p) {
      if (p.owner === owner && p.op && p.op.tabla === tabla) ops.push(p.op);
    });
    return ops.sort(function (a, b) { return a.seq - b.seq; });
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
      case 'pago_crear':
        mapa.set(op.id, {
          id: op.id, colecta_id: a.p_colecta, alumno_id: a.p_alumno, monto: a.p_monto || null, fecha: a.p_fecha,
          nota: a.p_nota || null, recibo: null, version: 0, deleted_at: null,
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
      case 'exencion_poner':
      case 'exencion_quitar':
        mapa.forEach(function (e, id) {
          if (e.colecta_id === a.p_colecta && e.alumno_id === a.p_alumno) mapa.delete(id);
        });
        if (op.tipo === 'exencion_poner') {
          mapa.set(op.id, {
            id: op.id, colecta_id: a.p_colecta, alumno_id: a.p_alumno, monto_aplicable: a.p_monto_aplicable,
            motivo: a.p_motivo || null, version: 0, deleted_at: null,
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
    if (!r.ok) throw new Error('monto no válido: ' + texto);
    if (!permitirCero && r.valor === '0.00') throw new Error('monto en cero');
    return r;
  }

  // El monto lo escribió el docente y es ambiguo («1,500»): la operación
  // queda anotada y espera su respuesta («¿L 1,500.00 o L 1.50?»).
  function encolarConMonto(op, lectura) {
    if (lectura.pregunta) cola.preguntaMontoAmbiguo(op, lectura.pregunta);
    else cola.encolar(op);
    return { id: op.id };
  }

  function crear(nombre, fila) {
    var u = cuenta();
    if (nombre === 'pagos') return pagar(fila);
    if (nombre === 'colectas') return colecta.crear(fila);
    if (SOLO_FUNCIONES[nombre]) throw new Error(nombre + ' se anota con su función, no con crear');
    var id = (fila && fila.id) || M.ids.nuevo();
    var campos = limpia(fila || {});
    delete campos.id;
    if (nombre === 'alumnos') {
      var aula = campos.aula_id;
      delete campos.aula_id;
      cola.encolar({ owner: u, tipo: 'alumno_crear', tabla: 'alumnos', id: id,
        args: { p_id: id, p_aula: aula, p_campos: campos, p_no_es: [] } });
      return { id: id };
    }
    cola.encolar({ owner: u, tipo: 'crear', tabla: nombre, id: id, cambios: campos });
    return { id: id };
  }

  function editar(nombre, id, cambios) {
    var u = cuenta();
    var c = limpia(cambios || {});
    delete c.id;
    if (nombre === 'colectas') return colecta.editar(id, c);
    if (nombre === 'pagos') {
      Object.keys(c).forEach(function (k) {
        if (k !== 'nota' && k !== 'recibo_anterior') throw new Error('el monto y la fecha de un pago se corrigen con corregirPago');
      });
      cola.encolar({ owner: u, tipo: 'pago_editar', tabla: 'pagos', id: id, colecta: (M._vista.fila(u, 'pagos', id) || {}).colecta_id,
        args: { p_pago: id, p_cambios: c } });
      return { id: id };
    }
    if (SOLO_FUNCIONES[nombre]) throw new Error(nombre + ' se cambia con su función, no con editar');
    if (nombre === 'alumnos' && 'identidad' in c) {
      c.identidad = String(c.identidad || '').toUpperCase().replace(/[^0-9A-Z]/g, '') || null;
    }
    var enBase = alm.fila(u, nombre, id);
    var visto = M._vista.fila(u, nombre, id) || {};
    var base = {};
    Object.keys(c).forEach(function (k) { base[k] = visto[k] === undefined ? null : visto[k]; });
    cola.encolar({ owner: u, tipo: 'editar', tabla: nombre, id: id,
      base_version: enBase && !enBase.deleted_at ? enBase.version : null, base: base, cambios: c });
    return { id: id };
  }

  function borrar(nombre, id) {
    var u = cuenta();
    if (nombre === 'colectas') {
      cola.encolar({ owner: u, tipo: 'colecta_borrar', tabla: 'colectas', id: id, colecta: id, args: { p_colecta: id } });
      return { id: id };
    }
    if (nombre === 'pagos') throw new Error('un pago se anula con anularPago');
    if (SOLO_FUNCIONES[nombre]) throw new Error(nombre + ' se quita con su función, no con borrar');
    cola.encolar({ owner: u, tipo: 'borrar', tabla: nombre, id: id });
    return { id: id };
  }

  // ── Dinero (solo por funciones del servidor, regla 18) ────────────────
  function pagar(p) {
    var u = cuenta();
    var lectura = leerMonto(p.monto, false);
    var id = M.ids.nuevo();
    // Lo que el aparato tenía a la vista de ese alumno en esa colecta: si en
    // la base hay otro pago que no estaba aquí, la base pregunta (3.5).
    var conocidos = lista('pagos', { colecta_id: p.colecta_id, alumno_id: p.alumno_id }).map(function (x) { return x.id; });
    return encolarConMonto({
      owner: u, tipo: 'pago_crear', tabla: 'pagos', id: id, colecta: p.colecta_id,
      args: { p_id: id, p_colecta: p.colecta_id, p_alumno: p.alumno_id, p_monto: lectura.valor || null, p_fecha: p.fecha,
        p_nota: p.nota || null, p_conocidos: conocidos, p_son_distintos: false },
    }, lectura);
  }

  function corregirPago(id, c) {
    var u = cuenta();
    var visto = M._vista.fila(u, 'pagos', id);
    if (!visto) throw new Error('ese pago no está');
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
    crear: function (c) {
      var u = cuenta();
      var lectura = leerMonto(c.monto_sugerido, true);
      var id = c.id || M.ids.nuevo();
      return encolarConMonto({
        owner: u, tipo: 'colecta_crear', tabla: 'colectas', id: id, colecta: id,
        args: { p_id: id, p_aula: c.aula_id, p_concepto: c.concepto, p_monto_sugerido: lectura.valor || null, p_fecha: c.fecha },
      }, lectura);
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
    poner: function (e) {
      var u = cuenta();
      var hay = lista('colecta_exenciones', { colecta_id: e.colecta_id, alumno_id: e.alumno_id })[0];
      var lectura = { ok: true, valor: null };
      if (e.monto_aplicable != null && e.monto_aplicable !== '') lectura = leerMonto(e.monto_aplicable, true);
      var id = M.ids.nuevo();
      return encolarConMonto({
        owner: u, tipo: 'exencion_poner', tabla: 'colecta_exenciones', id: id, colecta: e.colecta_id,
        args: { p_id: id, p_colecta: e.colecta_id, p_alumno: e.alumno_id, p_monto_aplicable: lectura.valor || null,
          p_motivo: e.motivo || null, p_base: hay ? { monto_aplicable: hay.monto_aplicable } : {} },
      }, lectura);
    },
    quitar: function (e) {
      var u = cuenta();
      var id = M.ids.nuevo();
      cola.encolar({ owner: u, tipo: 'exencion_quitar', tabla: 'colecta_exenciones', id: id, colecta: e.colecta_id,
        args: { p_colecta: e.colecta_id, p_alumno: e.alumno_id } });
      return { id: id };
    },
  };

  // ── Cuenta ─────────────────────────────────────────────────────────────
  function arrancar(owner) {
    tr.conectar(owner);
    tr.ponerseAlDia(owner);
    cola.reanudar();
  }

  async function entrar(correo, clave) {
    var antes = nube.uid();
    var r = await nube.entrar(correo, clave);
    if (r.ok) {
      if (antes && antes !== nube.uid()) tr.desconectar();
      arrancar(nube.uid());
    }
    return r;
  }

  // Con señal, termina de mandar lo pendiente antes de cerrar (el botón
  // muestra su espera normal, sin texto). Sin señal, lo guarda para esta
  // cuenta en este aparato y sale cuando esta cuenta vuelva a entrar (3.7).
  async function salir() {
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
    tr.desconectar();
    nube.olvidarSesion();
    var queda = alm.cola().some(function (o) { return o.owner === u; })
      || alm.preguntas().some(function (p) { return p.owner === u; });
    if (!queda) alm.olvidarCuenta(u);
    cola.revisarEspera();
  }

  var api = null;
  var iniciando = null;

  M.iniciar = function () {
    if (iniciando) return iniciando;
    iniciando = (async function () {
      await alm.cargar();
      nube.retomar();
      w.addEventListener('online', function () {
        cola.ahoraMismo();
        if (nube.uid()) tr.ponerseAlDia(nube.uid());
      });
      if (w.document && w.document.addEventListener) {
        w.document.addEventListener('visibilitychange', function () {
          if (w.document.visibilityState !== 'visible') return;
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
        pagar: pagar,
        corregirPago: corregirPago,
        anularPago: anularPago,
        colecta: colecta,
        exencion: exencion,
        lista: lista,
        escuchar: cola.escuchar,
        preguntas: function () {
          var u = nube.uid();
          return alm.preguntas().filter(function (p) { return p.owner === u; }).map(function (p) {
            return { id: p.id, tipo: p.tipo, texto: p.texto, botones: p.botones.map(copia) };
          });
        },
        responder: cola.responder,
        pendientes: function () { return nube.uid() ? cola.pendientes(nube.uid()) : 0; },
        noAnotado: function () {
          var u = nube.uid();
          return alm.noAnotado().filter(function (t) { return t.owner === u; }).map(function (t) { return { id: t.id, texto: t.texto }; });
        },
        // El único botón de la tarjeta «no quedó anotado»: «Entendido».
        entendido: function (id) { alm.quitarNoAnotado(id); },
        esperarCola: cola.esperar,
        // Para el punto gris de «sin señal» (lo dibuja la pantalla).
        sinSenal: function () { return !M._senal.hay(); },
        alCambiarSenal: function (f) { M._senal.alCambiar(function (hay) { f(!hay); }); },
        // La sesión venció y no se pudo renovar: la pantalla pide la
        // contraseña («Escribe tu contraseña»), sin explicar por qué.
        pideContrasena: function () { return cola.pausada(); },
        cuenta: function () { var s = nube.sesion(); return s ? { nombre: s.nombre, rol: s.rol } : null; },
      };
      if (nube.uid()) arrancar(nube.uid());
      return api;
    })();
    return iniciando;
  };
})(window);
