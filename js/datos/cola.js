/* =====================================================================
   M.E.T.A.S — js/datos/cola.js · lo anotado llega a la base, una vez
   ---------------------------------------------------------------------
   Cada cosa que el docente anota es una OPERACIÓN sobre una fila (03,
   3.2). Se guarda en la cola del aparato y sale sola, sin botón, de a una
   y en orden: un pago nunca llega antes que el alumno que lo recibe.

   Reenviar no duplica nada: cada operación lleva su op_id, la base lo
   guarda como op_creacion de la fila, y un reenvío de lo ya hecho le
   responde «ya estaba» (03, 3.3). Por eso, si la señal se cae justo
   después de que la base guardó un pago, el aparato vuelve a mandarlo y
   no aparece un segundo pago.

   Lo que la cola NUNCA hace sola:
     · decidir entre dos montos: si otro aparato anotó o cambió el mismo
       dinero, la base lo dice y aquí se arma una pregunta de dos botones
       para el docente (3.5);
     · unir dos alumnos por el nombre: solo la identidad une; con el mismo
       nombre se pregunta (3.6);
     · revivir algo borrado en otro aparato.

   Cuándo sale (3.7): al anotar, al volver la señal, al volver a la app y
   con reintentos de 2, 4, 8, 16, 32 y 60 segundos mientras quede algo.
   Una operación que espera respuesta del docente se aparta, y la cola
   sigue con las que no dependen de ella.

   Una cola por cuenta: cada operación lleva su owner y solo sale con la
   sesión de esa cuenta.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};
  var nube = M._nube;
  var alm = M._almacen;
  var montos = M.montos;

  // Tablas cuyo dinero no se puede leer de la tabla: se leen en vd_<tabla>.
  var CON_DINERO = { pagos: 1, gastos: 1, gastos_docente: 1, reembolsos: 1, convocatoria_pagos: 1,
    colectas: 1, colecta_exenciones: 1, bienes: 1 };
  // Lo que identifica una fila además de su id (los «unique» de la base).
  // Si dos aparatos crean la misma sin señal, el segundo se vuelve edición
  // de la primera (3.6). aulas y asignaturas comparan nombres normalizados.
  var LLAVE_NATURAL = {
    periodos: ['aula_id', 'periodo'],
    asistencia_dias: ['aula_id', 'fecha'],
    asistencia: ['alumno_id', 'fecha'],
    inasistencias_oficiales: ['alumno_id', 'periodo'],
    notas: ['alumno_id', 'asignatura_id', 'periodo', 'componente'],
    notas_personalidad: ['alumno_id', 'periodo', 'rasgo'],
    evaluacion_puntos: ['evaluacion_id', 'alumno_id', 'criterio'],
    control_valores: ['control_id', 'alumno_id'],
    aviso_destinatarios: ['aviso_id', 'alumno_id'],
    familias: ['alumno_id'],
    ajustes_docente: ['clave'],
    aulas: ['grado', 'anio_lectivo'],
    asignaturas: ['aula_id'],
  };
  var REINTENTOS = [2000, 4000, 8000, 16000, 32000, 60000];

  var oyentes = [];
  var esperando = [];
  var corriendo = false;
  var otraVez = false;
  var pausada = false;            // la sesión no se pudo renovar: espera la contraseña
  var temporizador = null;
  var nReintento = 0;

  function avisar(tabla, id) {
    oyentes.forEach(function (f) { try { f({ tabla: tabla, id: id }); } catch (e) { /* un oyente roto no frena la cola */ } });
    contarEstado();
  }

  // ── Varias pestañas (rev. 9) ───────────────────────────────────────────
  // La líder cuenta a las demás cómo quedaron la cola, las preguntas y las
  // tarjetas, y si ya no le queda nada por mandar. Se junta en un solo
  // mensaje por vuelta, aunque cambien diez cosas.
  var estadoPorSalir = false;
  var quietaLider = {};          // en las otras pestañas: lo último que dijo la líder
  var absorbidosPorContar = [];
  function contarEstado() {
    if (!alm.esLider() || estadoPorSalir) return;
    estadoPorSalir = true;
    setTimeout(function () {
      estadoPorSalir = false;
      var u = nube.uid();
      var q = {};
      if (u) q[u] = quieta();
      var ab = absorbidosPorContar;
      absorbidosPorContar = [];
      alm.enviar({ t: 'estado', foto: alm.foto(), quieta: q, absorbidos: ab });
    }, 0);
  }

  // ── Utilidades ─────────────────────────────────────────────────────────
  function normNombre(t) {
    return String(t || '').trim().toLowerCase()
      .replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ñ/g, 'n').replace(/\s+/g, ' ');
  }
  function normDocumento(t) {
    var x = String(t || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
    return x || null;
  }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
    'octubre', 'noviembre', 'diciembre'];
  function fechaLarga(f) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || ''));
    return m ? (m[3].replace(/^0/, '') + ' de ' + MESES[(m[2] - 1)]) : String(f || '');
  }
  function L(monto) {
    return monto == null ? 'exento del todo' : montos.enLetras(monto);
  }
  function fuente(tabla) {
    return CON_DINERO[tabla] ? 'vd_' + tabla : tabla;
  }
  function cod(x) {
    return encodeURIComponent(String(x));
  }
  function ahora() {
    return new Date().toISOString();
  }

  // Lo que ve el aparato de una fila (copia + lo que está en la cola), para
  // poner nombres en las preguntas.
  function nombreAlumno(owner, id) {
    var f = M._vista ? M._vista.fila(owner, 'alumnos', id) : alm.fila(owner, 'alumnos', id);
    return f && f.nombre_completo ? f.nombre_completo : 'este alumno';
  }
  function conceptoColecta(owner, id) {
    var f = M._vista ? M._vista.fila(owner, 'colectas', id) : alm.fila(owner, 'colectas', id);
    return f && f.concepto ? f.concepto : 'esta colecta';
  }

  // ── Qué espera la cola ─────────────────────────────────────────────────
  // Una operación depende de una pregunta si menciona el id de la fila que
  // espera respuesta (un pago para el alumno cuya alta se está
  // preguntando): esa espera con ella.
  function bloqueados(owner) {
    return alm.preguntas().filter(function (p) { return p.owner === owner; })
      .map(function (p) { return p.op && p.op.id; }).filter(Boolean);
  }
  function siguiente(owner) {
    var ids = bloqueados(owner);
    var c = alm.cola();
    for (var i = 0; i < c.length; i++) {
      var op = c[i];
      if (op.owner !== owner) continue;
      if (ids.length) {
        var t = JSON.stringify(op);
        if (ids.some(function (x) { return t.indexOf(x) >= 0; })) continue;
      }
      return op;
    }
    return null;
  }
  function deEsta(owner) {
    return alm.misEntrantes().filter(function (o) { return o.owner === owner; });
  }
  function pendientes(owner) {
    return alm.cola().filter(function (o) { return o.owner === owner; }).length + deEsta(owner).length;
  }

  function quieta() {
    var u = nube.uid();
    if (!alm.esLider()) {
      // Otra pestaña: quieta cuando la líder ya tomó todo lo de aquí y dijo
      // que no le queda nada por mandar de esta cuenta.
      return !u || (!deEsta(u).length && quietaLider[u] === true);
    }
    return !corriendo && (!u || pausada || !siguiente(u));
  }
  function revisarEspera() {
    contarEstado();
    if (!quieta()) return;
    var e = esperando;
    esperando = [];
    e.forEach(function (f) { f(); });
  }
  function esperar() {
    return new Promise(function (ok) {
      esperando.push(ok);
      revisarEspera();
    });
  }

  // ── Encolar ────────────────────────────────────────────────────────────
  function encolar(op) {
    op.op_id = op.op_id || M.ids.nuevo();
    op.owner = op.owner || nube.uid();
    op.hecho_en = op.hecho_en || ahora();
    alm.encolar(op);
    if (!alm.esLider()) quietaLider[op.owner] = false;
    avisar(op.tabla, op.id);
    procesar();
    return op;
  }

  function descartar(op) {
    alm.sacarDeCola(op);
    avisar(op.tabla, op.id);
  }

  // ── Tarjetas «no quedó anotado» ────────────────────────────────────────
  // La razón del aula, nunca una técnica (3.7). Va también a
  // metas.rechazos (con tope en la base) para soporte.
  function queEra(op) {
    var o = op.owner;
    if (op.tabla === 'pagos') {
      var a = (op.args && op.args.p_alumno) || (M._vista && (M._vista.fila(o, 'pagos', op.args && op.args.p_pago) || {}).alumno_id);
      return 'El pago de ' + nombreAlumno(o, a);
    }
    if (op.tabla === 'alumnos') {
      var n = (op.args && op.args.p_campos && op.args.p_campos.nombre_completo) || (op.cambios && op.cambios.nombre_completo);
      return n ? 'Lo de ' + n : 'El cambio en la lista';
    }
    if (op.tabla === 'colectas') return 'El cambio en ' + conceptoColecta(o, op.id);
    if (op.tabla === 'colecta_exenciones') return 'La exención de ' + nombreAlumno(o, op.args && op.args.p_alumno);
    return 'Este cambio';
  }
  function razon(op, motivo) {
    var o = op.owner;
    switch (motivo) {
      case 'alumno': return nombreAlumno(o, op.args && op.args.p_alumno) + ' ya no está en la lista';
      case 'colecta': return conceptoColecta(o, op.args && op.args.p_colecta) + ' ya no está';
      case 'aula': return 'esa sección ya no está';
      case 'anulado': return 'ese pago ya estaba anulado';
      case 'no_existe': return 'ya lo habían borrado en otro aparato';
      case 'borrada': return 'ya lo habían borrado en otro aparato';
      case 'tiene_pagos_o_gastos': return 'tiene pagos o gastos anotados; se puede cerrar';
      case 'MT007': return 'tiene pagos o notas anotados; se le puede cambiar el estado (retirado, trasladado)';
      case 'MT003': return 'lo que lo contenía ya lo habían borrado en otro aparato';
      case 'falta_motivo': return 'falta escribir por qué se anula';
      case 'tiene_reembolsos': return 'ya tiene anotado que te lo pagaron; primero márcalo como pendiente';
      case 'gasto': return 'ese gasto ya no está';
      case 'MT020': return 'esa clave de familia no está en tus datos anteriores; déjala vacía y se le da una nueva';
      case 'id_ocupado': return 'ya estaba anotado de otra forma';
      default: return 'no se pudo anotar';
    }
  }
  function noQuedo(op, motivo, detalle) {
    descartar(op);
    alm.ponerNoAnotado({ id: M.ids.nuevo(), owner: op.owner, texto: queEra(op) + ' no quedó anotado: ' + razon(op, motivo) + '.' });
    avisar(op.tabla, op.id);
    // Para soporte. Si no llega, no pasa nada: el docente ya lo vio.
    var copia = JSON.parse(JSON.stringify(op));
    nube.peticion('POST', 'rechazos', {
      cuerpo: { operacion: copia, codigo: String(motivo).slice(0, 20), motivo: String(detalle || motivo).slice(0, 500) },
      prefer: 'return=minimal',
    }).catch(function () {});
  }

  // ── Preguntas ──────────────────────────────────────────────────────────
  function preguntar(op, tipo, texto, botones, datos) {
    alm.sacarDeCola(op);
    alm.ponerPregunta({
      id: M.ids.nuevo(), owner: op.owner, tipo: tipo, texto: texto, botones: botones, op: op, datos: datos || {},
    });
    avisar(op.tabla, op.id);
    return true;
  }

  function preguntaDePago(op, r) {
    var o = op.owner;
    var a = op.args;
    var nombre = nombreAlumno(o, a.p_alumno || (r.actual && r.actual.alumno_id));
    if (r.pregunta === 'otro_pago_sin_ver') {
      var otros = r.otros || [];
      var quien = otros.map(function (x) { return L(x.monto); }).join(' y ');
      var cuando = otros.length === 1 ? ' (' + fechaLarga(otros[0].fecha) + ')' : '';
      return preguntar(op, 'otro_pago_sin_ver',
        'En otro aparato se anotó ' + quien + ' de ' + nombre + ' para ' + conceptoColecta(o, a.p_colecta) + cuando
        + '. Aquí anotaste ' + L(r.este.monto) + '. ¿Es el mismo dinero?',
        [{ etiqueta: 'Son dos pagos distintos', valor: 'son_dos' }, { etiqueta: 'Es el mismo dinero', valor: 'es_el_mismo' }],
        { otros: otros, este: r.este });
    }
    if (r.pregunta === 'pago_cambiado_en_otro_aparato') {
      var vivo = r.reemplazo && !r.reemplazo.deleted_at ? r.reemplazo : (!r.actual.deleted_at ? r.actual : null);
      if (!vivo) {
        return preguntar(op, 'pago_cambiado_en_otro_aparato',
          'En otro aparato se anuló el pago de ' + nombre + ' de ' + L(r.actual.monto) + '. Tú lo corriges a '
          + L(r.este.monto) + '.',
          [{ etiqueta: 'Dejarlo anulado', valor: 'dejar_actual' }, { etiqueta: 'Anotar ' + L(r.este.monto), valor: 'dejar_este' }],
          { actual: r.actual, vivo: null, este: r.este });
      }
      return preguntar(op, 'pago_cambiado_en_otro_aparato', textoDosMontos(nombre, vivo, r.este),
        botonesDos(vivo, r.este), { actual: r.actual, vivo: vivo, este: r.este });
    }
    if (r.pregunta === 'otro_gasto_sin_ver') {
      var g = (r.otros || [])[0] || {};
      return preguntar(op, 'otro_gasto_sin_ver',
        'En otro aparato se anotó un gasto de ' + L(g.monto) + ' (' + (g.concepto || 'sin concepto') + ') el '
        + fechaLarga(g.fecha) + '. Aquí anotaste ' + L(a.p_monto) + '. ¿Es el mismo gasto?',
        [{ etiqueta: 'Son dos gastos', valor: 'son_dos' }, { etiqueta: 'Es el mismo', valor: 'es_el_mismo' }],
        { otro: g, este: { monto: a.p_monto, fecha: a.p_fecha } });
    }
    // Dos aparatos anotaron que le devolvieron dinero del mismo gasto.
    if (r.pregunta === 'otro_reembolso_sin_ver') {
      var re = (r.otros || [])[0] || {};
      return preguntar(op, 'otro_reembolso_sin_ver',
        'En otro aparato se anotó que te devolvieron ' + L(re.monto) + ' el ' + fechaLarga(re.fecha)
        + '. Aquí anotaste ' + L(a.p_monto) + '. ¿Es el mismo dinero?',
        [{ etiqueta: 'Es el mismo', valor: 'es_el_mismo' }, { etiqueta: 'Son dos pagos', valor: 'son_dos' }],
        { otro: re, este: { monto: a.p_monto, fecha: a.p_fecha } });
    }
    if (r.pregunta === 'pago_corregido_en_otro_aparato') {
      return preguntar(op, 'pago_corregido_en_otro_aparato',
        'En otro aparato este pago se corrigió a ' + L(r.actual.monto) + '.',
        [{ etiqueta: 'Anular también el de ' + L(r.actual.monto), valor: 'anular_tambien' },
         { etiqueta: 'Dejar ' + L(r.actual.monto), valor: 'dejar_actual' }],
        { actual: r.actual });
    }
    return null;
  }

  // «¿L 50.00 o L 60.00?», o con las fechas si el monto es el mismo.
  function textoDosMontos(nombre, actual, este) {
    if (actual.monto === este.monto && este.fecha && actual.fecha !== este.fecha) {
      return 'Pago de ' + nombre + ': ¿' + fechaLarga(actual.fecha) + ' o ' + fechaLarga(este.fecha) + '?';
    }
    return 'En otro aparato el pago de ' + nombre + ' quedó en ' + L(actual.monto) + '. Aquí es '
      + L(este.monto) + '. ¿Cuál es el monto correcto?';
  }
  function botonesDos(actual, este) {
    if (actual.monto === este.monto && este.fecha && actual.fecha !== este.fecha) {
      return [{ etiqueta: fechaLarga(actual.fecha), valor: 'dejar_actual' }, { etiqueta: fechaLarga(este.fecha), valor: 'dejar_este' }];
    }
    return [{ etiqueta: 'Dejar ' + L(actual.monto), valor: 'dejar_actual' }, { etiqueta: 'Dejar ' + L(este.monto), valor: 'dejar_este' }];
  }

  function preguntaDeColecta(op, r) {
    var o = op.owner;
    if (r.pregunta === 'colecta_cambiada_en_otro_aparato' || r.pregunta === 'colecta_sin_base') {
      return preguntar(op, 'colecta_cambiada_en_otro_aparato',
        'En otro aparato ' + r.actual.concepto + ' quedó en ' + L(r.actual.monto_sugerido) + '. Aquí pusiste '
        + L(r.este.monto_sugerido) + '. ¿Cuál queda?',
        [{ etiqueta: 'Dejar ' + L(r.actual.monto_sugerido), valor: 'dejar_actual' },
         { etiqueta: 'Dejar ' + L(r.este.monto_sugerido), valor: 'dejar_este' }],
        { actual: r.actual, este: r.este });
    }
    if (r.pregunta === 'exencion_cambiada_en_otro_aparato' || r.pregunta === 'exencion_quitada_en_otro_aparato') {
      var nombre = nombreAlumno(o, op.args.p_alumno);
      var concepto = conceptoColecta(o, op.args.p_colecta);
      var quitada = r.pregunta === 'exencion_quitada_en_otro_aparato';
      var actual = quitada ? null : r.actual;
      return preguntar(op, r.pregunta,
        (quitada ? 'En otro aparato se quitó la exención de ' + nombre + ' en ' + concepto
          : 'En otro aparato a ' + nombre + ' le quedó ' + L(actual.monto_aplicable) + ' en ' + concepto)
        + '. Aquí pusiste ' + L(r.este.monto_aplicable) + '. ¿Cuál queda?',
        [{ etiqueta: quitada ? 'Dejarla quitada' : 'Dejar ' + L(actual.monto_aplicable), valor: 'dejar_actual' },
         { etiqueta: 'Dejar ' + L(r.este.monto_aplicable), valor: 'dejar_este' }],
        { actual: actual, este: r.este });
    }
    return null;
  }

  function preguntaColectaCerrada(op) {
    return preguntar(op, 'colecta_cerrada', 'Esta colecta está cerrada. ¿Reabrirla?',
      [{ etiqueta: 'Reabrir', valor: 'reabrir' }, { etiqueta: 'Dejarla cerrada', valor: 'dejarla_cerrada' }], {});
  }

  function preguntaMismaPersona(op, r) {
    var c = r.candidatos[0];
    var detalle = [];
    if (c.num_lista) detalle.push('n.º ' + c.num_lista);
    if (!c.identidad) detalle.push('sin identidad');
    return preguntar(op, 'misma_persona',
      'Ya tienes a ' + c.nombre_completo + (detalle.length ? ' (' + detalle.join(', ') + ')' : '') + '. ¿Es la misma persona?',
      [{ etiqueta: 'Es la misma', valor: 'es_ella' }, { etiqueta: 'Son dos alumnos distintos', valor: 'son_dos' }],
      { candidatos: r.candidatos });
  }

  function preguntaMontoAmbiguo(op, p) {
    preguntar(op, 'monto_ambiguo', p.texto,
      p.opciones.map(function (x) { return { etiqueta: x.etiqueta, valor: x.valor }; }), {});
  }

  // Vuelve a poner en la cola una operación que esperaba al docente, en su
  // mismo lugar (su seq): lo que se anotó después sigue después.
  function devolver(p, op) {
    alm.quitarPregunta(p.id);
    alm.encolar(op);
    avisar(op.tabla, op.id);
    procesar();
  }
  function soltar(p) {
    alm.quitarPregunta(p.id);
    avisar(p.op.tabla, p.op.id);
    revisarEspera();
  }

  async function responder(idPregunta, valor) {
    var p = alm.preguntas().filter(function (x) { return x.id === idPregunta; })[0];
    if (!p) return;
    var op = p.op;
    var a = op.args || {};
    switch (p.tipo) {
      case 'otro_pago_sin_ver':
        if (valor === 'son_dos') {
          a.p_son_distintos = true;
          return devolver(p, op);
        }
        if (valor === 'es_el_mismo') {
          var otro = p.datos.otros[p.datos.otros.length - 1];
          if (otro.monto === p.datos.este.monto && otro.fecha === p.datos.este.fecha) return soltar(p);
          // Segunda tarjeta: ¿cuál monto queda? (3.5). Nada sale mientras tanto.
          alm.quitarPregunta(p.id);
          var nombre = nombreAlumno(op.owner, a.p_alumno);
          alm.ponerPregunta({
            id: M.ids.nuevo(), owner: op.owner, tipo: 'pago_cambiado_en_otro_aparato',
            texto: textoDosMontos(nombre, otro, p.datos.este), botones: botonesDos(otro, p.datos.este),
            op: op, datos: { actual: otro, vivo: otro, este: p.datos.este, mismo_dinero: true },
          });
          avisar(op.tabla, op.id);
          return revisarEspera();
        }
        return;
      case 'pago_cambiado_en_otro_aparato':
        if (valor === 'dejar_actual') return soltar(p);
        if (valor !== 'dejar_este') return;
        var vivo = p.datos.vivo;
        if (!vivo) {
          // Lo anularon en otro aparato y el docente quiere su monto: es un
          // pago nuevo, decidido por él.
          var viejo = p.datos.actual;
          op.tipo = 'pago_crear';
          op.args = { p_id: op.id, p_colecta: viejo.colecta_id, p_alumno: viejo.alumno_id, p_monto: p.datos.este.monto,
            p_fecha: p.datos.este.fecha || viejo.fecha, p_nota: viejo.nota || null, p_conocidos: [], p_son_distintos: true };
          return devolver(p, op);
        }
        if (p.datos.mismo_dinero) {
          // «Es el mismo dinero» y queda el monto de aquí: se corrige el
          // pago del otro aparato a este monto; el de aquí no se crea.
          op.tipo = 'pago_corregir';
          op.args = { p_pago: vivo.id, p_base: { monto: vivo.monto, fecha: vivo.fecha }, p_nuevo_id: op.id,
            p_monto: p.datos.este.monto, p_fecha: p.datos.este.fecha || vivo.fecha,
            p_motivo: 'el mismo dinero se anotó en dos aparatos', _alumno: a.p_alumno, _colecta: a.p_colecta };
          op.colecta = a.p_colecta;
          return devolver(p, op);
        }
        a.p_pago = vivo.id;
        a.p_base = { monto: vivo.monto, fecha: vivo.fecha };
        return devolver(p, op);
      case 'otro_gasto_sin_ver':
        if (valor === 'son_dos') {
          a.p_son_distintos = true;
          return devolver(p, op);
        }
        if (valor === 'es_el_mismo') {
          var og = p.datos.otro;
          if (og.monto === p.datos.este.monto) return soltar(p);
          // Es el mismo, pero los montos no coinciden: ¿cuál queda?
          alm.quitarPregunta(p.id);
          alm.ponerPregunta({
            id: M.ids.nuevo(), owner: op.owner, tipo: 'gasto_cual_monto',
            texto: 'El gasto de ' + (og.concepto || 'esta colecta') + ': ¿' + L(og.monto) + ' o ' + L(p.datos.este.monto) + '?',
            botones: [{ etiqueta: 'Dejar ' + L(og.monto), valor: 'dejar_actual' }, { etiqueta: 'Dejar ' + L(p.datos.este.monto), valor: 'dejar_este' }],
            op: op, datos: { otro: og, este: p.datos.este },
          });
          avisar(op.tabla, op.id);
          return revisarEspera();
        }
        return;
      case 'otro_reembolso_sin_ver':
        if (valor === 'son_dos') {
          a.p_son_distintos = true;
          return devolver(p, op);
        }
        if (valor === 'es_el_mismo') return soltar(p);
        return;
      case 'gasto_cual_monto':
        if (valor === 'dejar_actual') return soltar(p);
        if (valor === 'dejar_este') {
          op.tipo = op.tabla === 'gastos_docente' ? 'gasto_docente_editar' : 'gasto_editar';
          op.id = p.datos.otro.id;
          op.args = { p_gasto: p.datos.otro.id, p_base: { monto: p.datos.otro.monto }, p_cambios: { monto: p.datos.este.monto } };
          return devolver(p, op);
        }
        return;
      case 'pago_corregido_en_otro_aparato':
        if (valor === 'dejar_actual') return soltar(p);
        if (valor === 'anular_tambien') {
          a.p_pago = p.datos.actual.id;
          return devolver(p, op);
        }
        return;
      case 'colecta_cerrada':
        if (valor === 'dejarla_cerrada') return soltar(p);
        if (valor === 'reabrir') {
          op.reabrir_primero = true;
          op.reabrir_op = op.reabrir_op || M.ids.nuevo();
          return devolver(p, op);
        }
        return;
      case 'misma_persona':
        if (valor === 'son_dos') {
          a.p_no_es = (a.p_no_es || []).concat(p.datos.candidatos.map(function (c) { return c.id; }));
          return devolver(p, op);
        }
        if (valor === 'es_ella') {
          alm.quitarPregunta(p.id);
          unirAlumno(op, p.datos.candidatos[0].id, null);
          return;
        }
        return;
      case 'monto_ambiguo':
        if (!/^\d+\.\d{2}$/.test(String(valor))) return;
        delete op.por_aclarar;
        if (op.tipo === 'pago_crear' || op.tipo === 'pago_corregir' || op.tipo === 'gasto_crear') a.p_monto = valor;
        else if (op.tipo === 'colecta_crear') a.p_monto_sugerido = valor;
        else if (op.tipo === 'colecta_editar') a.p_cambios.monto_sugerido = valor;
        else if (op.tipo === 'exencion_poner') a.p_monto_aplicable = valor;
        return devolver(p, op);
      case 'colecta_cambiada_en_otro_aparato':
        if (valor === 'dejar_actual') return soltar(p);
        if (valor === 'dejar_este') {
          a.p_base = { monto_sugerido: p.datos.actual.monto_sugerido };
          return devolver(p, op);
        }
        return;
      case 'exencion_cambiada_en_otro_aparato':
      case 'exencion_quitada_en_otro_aparato':
        if (valor === 'dejar_actual') return soltar(p);
        if (valor === 'dejar_este') {
          a.p_base = p.datos.actual ? { monto_aplicable: p.datos.actual.monto_aplicable } : {};
          return devolver(p, op);
        }
        return;
      default:
        // Una pregunta que este aparato todavía no sabe resolver (de un corte
        // siguiente): lo único seguro es dejar lo que ya está en la base.
        if (valor === 'dejar_actual') return soltar(p);
    }
  }

  // ── Identidad: la misma persona en dos aparatos (3.6) ──────────────────
  // El id local pasa a ser el del alumno que ya existe, en esta operación y
  // en todas las que siguen (los pagos y notas anotados sin señal pasan al
  // alumno correcto); lo que este aparato escribió de su ficha se aplica
  // como edición, campo por campo.
  function cambiarId(owner, viejo, nuevo) {
    var reemplazar = function (op) {
      var t = JSON.stringify(op);
      if (t.indexOf(viejo) < 0) return op;
      var n = JSON.parse(t.split(viejo).join(nuevo));
      for (var k in n) op[k] = n[k];
      return op;
    };
    alm.cola().forEach(function (op) {
      if (op.owner === owner) { reemplazar(op); alm.actualizarOp(op); }
    });
    alm.preguntas().forEach(function (p) {
      if (p.owner === owner) { reemplazar(p.op); alm.ponerPregunta(p); }
    });
  }

  function unirAlumno(op, existenteId, existente) {
    var viejo = op.id;
    var campos = op.args.p_campos || {};
    cambiarId(op.owner, viejo, existenteId);
    var cambios = {};
    Object.keys(campos).forEach(function (k) {
      if (k === 'aula_id' || k === 'id') return;
      var v = campos[k];
      if (k === 'identidad') {
        v = normDocumento(v);
        if (!v || (existente && existente.identidad === v)) return;
      }
      if (existente && existente[k] === v) return;
      if (v === undefined) return;
      cambios[k] = v;
    });
    op.tipo = 'editar';
    op.id = existenteId;
    op.base_version = existente ? existente.version : null;
    op.base = {};
    op.cambios = cambios;
    delete op.args;
    if (!Object.keys(cambios).length) {
      descartar(op);
      avisar('alumnos', existenteId);
      revisarEspera();
      return;
    }
    // Vuelve a la cola en su mismo lugar, ya como edición.
    if (alm.cola().indexOf(op) < 0) alm.encolar(op); else alm.actualizarOp(op);
    avisar('alumnos', existenteId);
    procesar();
  }

  // ── Envío ──────────────────────────────────────────────────────────────
  function guardar(owner, tabla, fila) {
    if (fila && alm.guardarFila(owner, tabla, fila)) avisar(tabla, fila.id);
  }
  // Lo que la base ya hizo pero no devolvió (un pago anulado al corregirlo):
  // se marca aquí; el aviso de la base lo confirma después.
  function marcarBorrada(owner, tabla, id) {
    var f = alm.fila(owner, tabla, id);
    if (f && !f.deleted_at) {
      var g = {};
      for (var k in f) g[k] = f[k];
      g.deleted_at = ahora();
      g.version = (f.version || 0) + 1;
      guardar(owner, tabla, g);
    }
  }

  async function leerFila(tabla, id) {
    var filas = await nube.leer(fuente(tabla) + '?id=eq.' + cod(id) + '&select=*');
    return filas[0] || null;
  }

  var RPC = {
    pago_crear: 'pago', pago_corregir: 'pago', pago_anular: 'pago', pago_editar: 'pago',
    colecta_crear: 'colecta', colecta_editar: 'colecta', colecta_cerrar: 'colecta', colecta_reabrir: 'colecta',
    colecta_borrar: 'colecta', exencion_poner: 'exencion', exencion_quitar: 'exencion', alumno_crear: 'alumno',
    gasto_crear: 'gasto', gasto_editar: 'gasto', gasto_anular: 'gasto',
    gasto_docente_crear: 'gasto', gasto_docente_editar: 'gasto', gasto_docente_anular: 'gasto',
    reembolso_crear: 'reembolso', reembolso_anular: 'reembolso',
  };

  function argsDe(op) {
    var a = {};
    for (var k in op.args) if (k.charAt(0) !== '_') a[k] = op.args[k];
    a.p_op = op.op_id;
    return a;
  }

  async function enviarRpc(op) {
    var o = op.owner;
    if (op.reabrir_primero) {
      // El docente respondió «Reabrir»: primero se reabre (queda en la
      // auditoría), y después va lo que quería anotar.
      var col = op.colecta || (op.args && op.args.p_colecta);
      var ra = await nube.rpc('colecta_reabrir', { p_colecta: col, p_motivo: null, p_op: op.reabrir_op }, op.reabrir_op);
      if (ra && ra.colecta) guardar(o, 'colectas', ra.colecta);
      op.reabrir_primero = false;
      alm.actualizarOp(op);
    }
    var r = await nube.rpc(op.tipo, argsDe(op), op.op_id);
    r = r || {};
    if (r.ok) {
      var clave = RPC[op.tipo];
      var tabla = op.tabla;
      if (r[clave]) guardar(o, tabla, r[clave]);
      if (op.tipo === 'pago_corregir') marcarBorrada(o, 'pagos', op.args.p_pago);
      if (op.tipo === 'pago_anular' && !r.pago) marcarBorrada(o, 'pagos', op.args.p_pago);
      // «Ya estaba anulado»: la base no devuelve la fila; aquí se da por quitada.
      if (op.tipo === 'gasto_docente_anular' && !r.gasto) marcarBorrada(o, 'gastos_docente', op.args.p_gasto);
      if (op.tipo === 'reembolso_anular' && !r.reembolso) marcarBorrada(o, 'reembolsos', op.args.p_reembolso);
      if (op.tipo === 'exencion_quitar') {
        alm.filasDe(o, 'colecta_exenciones').forEach(function (e) {
          if (!e.deleted_at && e.colecta_id === op.args.p_colecta && e.alumno_id === op.args.p_alumno) marcarBorrada(o, 'colecta_exenciones', e.id);
        });
      }
      return descartar(op);
    }
    if (r.misma_identidad && r.alumno) {
      guardar(o, 'alumnos', r.alumno);
      return unirAlumno(op, r.alumno.id, r.alumno);
    }
    if (r.pregunta === 'misma_persona') return preguntaMismaPersona(op, r);
    if (r.pregunta && (preguntaDePago(op, r) || preguntaDeColecta(op, r))) return;
    if (r.pregunta) return preguntar(op, r.pregunta, 'Otro aparato cambió esto mismo. ¿Dejar lo de aquí?',
      [{ etiqueta: 'Dejar lo que había', valor: 'dejar_actual' }, { etiqueta: 'Dejar lo de aquí', valor: 'dejar_este' }], r);
    if (r.motivo === 'colecta_cerrada') return preguntaColectaCerrada(op);
    return noQuedo(op, r.motivo || 'desconocido', JSON.stringify(r));
  }

  async function enviarCrear(op) {
    var o = op.owner;
    var cuerpo = {};
    for (var k in op.cambios) cuerpo[k] = op.cambios[k];
    cuerpo.id = op.id;
    cuerpo.op_creacion = op.op_id;
    var r = await nube.peticion('POST', op.tabla, { cuerpo: cuerpo, opId: op.op_id, prefer: 'return=representation' });
    if (r.ok) {
      guardar(o, op.tabla, Array.isArray(r.datos) ? r.datos[0] : r.datos);
      return descartar(op);
    }
    var e = r.datos || {};
    if (e.code === '23505') {
      var texto = String(e.message || '') + ' ' + String(e.details || '');
      if (/_pkey/.test(texto)) {
        // Choca el id: si la fila es de ESTA operación, ya estaba hecha.
        var ya = await leerFila(op.tabla, op.id);
        if (ya && ya.op_creacion === op.op_id) {
          guardar(o, op.tabla, ya);
          return descartar(op);
        }
        return noQuedo(op, 'id_ocupado', texto);
      }
      return llaveNatural(op);
    }
    return noQuedo(op, e.code || ('http_' + r.status), e.message);
  }

  // Dos aparatos crearon lo mismo sin señal (la nota de Ana del parcial I):
  // el segundo toma el id de la fila que ya ocupa ese lugar y su «crear» se
  // vuelve una edición campo por campo. No es dinero: no se pregunta (3.6).
  async function llaveNatural(op) {
    var campos = LLAVE_NATURAL[op.tabla];
    if (!campos) return noQuedo(op, 'llave', 'sin llave natural conocida');
    var q = campos.map(function (c) {
      var v = op.cambios[c];
      return v === null || v === undefined ? c + '=is.null' : c + '=eq.' + cod(v);
    }).join('&');
    var filas = await nube.leer(fuente(op.tabla) + '?' + q + '&deleted_at=is.null&select=*');
    if (op.tabla === 'aulas') {
      filas = filas.filter(function (f) {
        return normNombre(f.escuela) === normNombre(op.cambios.escuela)
          && String(f.seccion).toUpperCase() === String(op.cambios.seccion).toUpperCase();
      });
    } else if (op.tabla === 'asignaturas') {
      filas = filas.filter(function (f) { return normNombre(f.nombre) === normNombre(op.cambios.nombre); });
    }
    var hay = filas[0];
    // Chocó con algo que no es su lugar natural (otra regla de la base):
    // no se insiste, para no frenar la cola entera.
    if (!hay) return noQuedo(op, 'llave', 'sin fila en la llave natural');
    guardar(op.owner, op.tabla, hay);
    var viejo = op.id;
    cambiarId(op.owner, viejo, hay.id);
    var cambios = {};
    Object.keys(op.cambios).forEach(function (k) {
      if (campos.indexOf(k) < 0 && k !== 'id' && hay[k] !== op.cambios[k]) cambios[k] = op.cambios[k];
    });
    op.tipo = 'editar';
    op.id = hay.id;
    op.base_version = hay.version;
    op.base = {};
    op.cambios = cambios;
    if (!Object.keys(cambios).length) return descartar(op);
    alm.actualizarOp(op);
  }

  // Editar fuera del dinero: con la versión que el aparato veía. Si otro
  // aparato ya la cambió, se lee la actual y se vuelve a aplicar SOLO lo que
  // este aparato cambió, campo por campo (3.4). Lo borrado no se revive.
  async function enviarEditar(op) {
    var o = op.owner;
    var version = op.base_version;
    for (var vuelta = 0; vuelta < 5; vuelta++) {
      if (version === null || version === undefined) {
        var hoy = await leerFila(op.tabla, op.id);
        if (!hoy || hoy.deleted_at) {
          if (hoy) guardar(o, op.tabla, hoy);
          return noQuedo(op, 'borrada');
        }
        guardar(o, op.tabla, hoy);
        var faltan = {};
        Object.keys(op.cambios).forEach(function (k) {
          if (JSON.stringify(hoy[k]) !== JSON.stringify(op.cambios[k])) faltan[k] = op.cambios[k];
        });
        if (!Object.keys(faltan).length) return descartar(op);
        op.cambios = faltan;
        version = hoy.version;
      }
      var r = await nube.peticion('PATCH', op.tabla + '?id=eq.' + cod(op.id) + '&version=eq.' + version + '&deleted_at=is.null',
        { cuerpo: op.cambios, opId: op.op_id, prefer: 'return=representation' });
      if (r.ok && Array.isArray(r.datos) && r.datos.length) {
        guardar(o, op.tabla, r.datos[0]);
        return descartar(op);
      }
      if (r.ok) { version = null; continue; }
      var e = r.datos || {};
      return noQuedo(op, e.code || ('http_' + r.status), e.message);
    }
    // Cinco vueltas sin ganarle a otro aparato: se reintenta más tarde.
    var err = new Error('red');
    err.tipo = 'red';
    throw err;
  }

  async function enviarBorrar(op) {
    var o = op.owner;
    var r = await nube.peticion('PATCH', op.tabla + '?id=eq.' + cod(op.id) + '&deleted_at=is.null',
      { cuerpo: { deleted_at: ahora() }, opId: op.op_id, prefer: 'return=representation' });
    if (r.ok) {
      if (Array.isArray(r.datos) && r.datos.length) guardar(o, op.tabla, r.datos[0]);
      else {
        // Ya estaba borrada (o nunca llegó): para el aparato da lo mismo.
        var hoy = await leerFila(op.tabla, op.id);
        if (hoy) guardar(o, op.tabla, hoy);
      }
      return descartar(op);
    }
    var e = r.datos || {};
    return noQuedo(op, e.code || ('http_' + r.status), e.message);
  }

  function enviar(op) {
    if (op.tipo === 'crear') return enviarCrear(op);
    if (op.tipo === 'editar') return enviarEditar(op);
    if (op.tipo === 'borrar') return enviarBorrar(op);
    if (RPC[op.tipo]) return enviarRpc(op);
    return Promise.resolve(noQuedo(op, 'tipo', op.tipo));
  }

  function programarReintento() {
    if (temporizador) return;
    var espera = REINTENTOS[Math.min(nReintento, REINTENTOS.length - 1)];
    nReintento++;
    temporizador = setTimeout(function () { temporizador = null; procesar(); }, espera);
  }

  async function procesar() {
    if (!alm.esLider()) return;          // solo la líder habla con la base
    if (corriendo) { otraVez = true; return; }
    corriendo = true;
    try {
      for (;;) {
        var uid = nube.uid();
        if (!uid || pausada) break;
        var op = siguiente(uid);
        if (!op) break;
        try {
          await enviar(op);
          nReintento = 0;
          if (M._senal) M._senal.hubo(true);
        } catch (e) {
          if (e && e.tipo === 'sesion') {
            // «Escribe tu contraseña» (sin explicar por qué); lo pendiente
            // se queda para esta cuenta.
            pausada = true;
            break;
          }
          if (e && e.tipo === 'red') {
            if (M._senal) M._senal.hubo(false);
            programarReintento();
            break;
          }
          // Un error que no es de red ni de sesión: no se repite para siempre.
          noQuedo(op, (e && e.codigo) || 'error', e && e.message);
        }
      }
    } finally {
      corriendo = false;
      if (otraVez) {
        otraVez = false;
        procesar();
      } else {
        revisarEspera();
      }
    }
  }

  // Volvió la señal, o volvió la app: se manda ya, sin esperar el reintento.
  function ahoraMismo() {
    if (temporizador) { clearTimeout(temporizador); temporizador = null; }
    nReintento = 0;
    procesar();
  }

  // La líder toma lo anotado en otras pestañas. Lo que llegó con un monto
  // por aclarar va derecho a su pregunta.
  async function absorber() {
    var tomadas = await alm.absorberEntrantes();
    alm.cola().slice().forEach(function (op) {
      if (op.pregunta_monto) {
        var p = op.pregunta_monto;
        delete op.pregunta_monto;
        preguntaMontoAmbiguo(op, p);
      }
    });
    absorbidosPorContar = absorbidosPorContar.concat(tomadas);
    if (tomadas.length) avisar(null, null);
    procesar();
    contarEstado();
  }

  // Lo que se le pide a la líder desde otra pestaña, con su respuesta.
  var pedidos = {};
  function pedirALaLider(m) {
    return new Promise(function (ok) {
      var rid = M.ids.nuevo();
      pedidos[rid] = ok;
      m.rid = rid;
      alm.enviar(m);
      // Si en diez segundos nadie contesta (la líder se estaba cerrando),
      // se sigue: lo anotado ya está guardado y lo toma la próxima líder.
      setTimeout(function () { if (pedidos[rid]) { delete pedidos[rid]; ok(); } }, 10000);
    });
  }

  alm.alMensaje(function (m) {
    if (alm.esLider()) {
      if (m.t === 'entrante') absorber();
      else if (m.t === 'hola') contarEstado();
      else if (m.t === 'responder') {
        Promise.resolve(responder(m.id, m.valor)).then(function () { alm.enviar({ t: 'hecho', rid: m.rid }); });
      } else if (m.t === 'entendido') {
        alm.quitarNoAnotado(m.id);
        avisar(null, null);
        alm.enviar({ t: 'hecho', rid: m.rid });
      }
      return;
    }
    if (m.t === 'estado') {
      alm.ponerFoto(m.foto || {}, m.absorbidos);
      for (var k in m.quieta) quietaLider[k] = m.quieta[k];
      avisar(null, null);
      revisarEspera();
    } else if (m.t === 'fila') {
      if (alm.guardarFila(m.owner, m.tabla, m.fila)) avisar(m.tabla, m.fila.id);
    } else if (m.t === 'olvidar') {
      alm.olvidarCuenta(m.owner);
      avisar(null, null);
    } else if (m.t === 'hecho' && pedidos[m.rid]) {
      var f = pedidos[m.rid];
      delete pedidos[m.rid];
      f();
    }
  });

  M._cola = {
    absorber: absorber,
    responderEnLider: function (id, valor) {
      return alm.esLider() ? responder(id, valor) : pedirALaLider({ t: 'responder', id: id, valor: valor });
    },
    entendido: function (id) {
      if (alm.esLider()) { alm.quitarNoAnotado(id); avisar(null, null); return Promise.resolve(); }
      return pedirALaLider({ t: 'entendido', id: id });
    },
    pedirALaLider: pedirALaLider,
    encolar: encolar,
    procesar: procesar,
    ahoraMismo: ahoraMismo,
    esperar: esperar,
    pendientes: pendientes,
    responder: responder,
    preguntaMontoAmbiguo: function (op, p) {
      op.op_id = op.op_id || M.ids.nuevo();
      op.owner = op.owner || nube.uid();
      op.hecho_en = op.hecho_en || ahora();
      if (!alm.esLider()) {
        // La pregunta la arma la líder cuando lo toma de «entrantes».
        op.pregunta_monto = p;
        alm.encolar(op);
        avisar(op.tabla, op.id);
        return;
      }
      if (!op.seq) alm.encolar(op);
      preguntaMontoAmbiguo(op, p);
    },
    reanudar: function () { pausada = false; ahoraMismo(); },
    pausada: function () { return pausada; },
    escuchar: function (f) { oyentes.push(f); },
    avisar: avisar,
    revisarEspera: revisarEspera,
  };
})(window);
