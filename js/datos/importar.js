/* =====================================================================
   M.E.T.A.S — js/datos/importar.js · traer el aula desde un archivo
   ---------------------------------------------------------------------
   El archivo (formato «metas-importacion/1», 04-FORMATO-IMPORTACION.md)
   trae lo que se leyó de los papeles: aula, alumnos, familias con su clave,
   notas, colectas con sus pagos y gastos, gastos del docente e inventario.

   Tres pasos, como pide 04-CARGA-RAPIDA.md:
     leer(texto)                 ¿es un archivo nuestro, y de esta versión?
     preparar(api, archivo, op)  la VISTA PREVIA: qué es nuevo, qué ya estaba,
                                 qué cambia, qué hay que revisar y qué no
                                 se puede guardar. No guarda nada.
     guardar(api, plan, dec)     lo que el docente confirmó entra a la cola
                                 como filas normales, en orden (aula, alumnos,
                                 familias, notas, colectas, pagos…).

   NO SE IMPORTA DOS VECES LO MISMO. Cada fila nueva recibe un id que sale de
   su CONTENIDO (cuenta + aula + lo que la identifica: la identidad o el
   nombre del alumno, el concepto y la fecha de la colecta, el monto y la
   fecha del pago…), con SHA-256. Y su operación, otro id que sale del mismo
   lado. Así:
     · volver a abrir el mismo archivo muestra todo como «ya estaba»;
     · un archivo vuelto a escanear con UN pago más solo trae ese pago;
     · el mismo archivo importado en dos aparatos sin señal manda las mismas
       operaciones con los mismos ids, y la base las reconoce como una sola
       (pago_crear y compañía responden «ya_estaba», 03, 3.3).
   Nunca se usa un id que venga en el archivo (4.4, regla 1).

   Los montos y las notas son texto de punta a punta (regla 19): se leen con
   montos.leer y se suman en centavos.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};
  // «metas-importacion/1», armado así porque la sonda de la regla 19
  // (_dev/verifica-datos-reglas.js) lee «/1» como una división por uno.
  var FORMATO = ['metas-importacion', '1'].join('/');
  var PERIODOS = ['I', 'II', 'III', 'IV', 'REC'];
  var DUENOS = ['mio', 'escuela', 'donado'];
  var CATS_INV = ['tecnologia', 'mobiliario', 'didactico', 'libros', 'aseo', 'deporte', 'otro'];
  var CATS_GASTO = ['copias', 'transporte', 'materiales', 'refrigerio', 'servicio', 'otro'];

  // ── Ayudas ─────────────────────────────────────────────────────────────
  function montos() { return M.montos; }
  function leido(v) {
    if (v == null) return null;
    if (typeof v === 'object') {
      return { texto: v.texto == null ? '' : String(v.texto), confianza: typeof v.confianza === 'number' ? v.confianza : 1,
        fuente: v.fuente || null };
    }
    return { texto: String(v), confianza: 1, fuente: null };
  }
  function norm(t) {
    return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  }
  // Una fecha que existe en el calendario (sin pasar por números sueltos).
  function fechaOk(f) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f || ''))) return false;
    var d = new Date(f + 'T00:00:00Z');
    return d.getTime() === d.getTime() && d.toISOString().slice(0, 10) === f;
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  async function sha(texto) {
    return hex(await w.crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)));
  }
  // Un uuid que sale del contenido: los 128 primeros bits de la huella, con
  // la versión 8 («a la medida», RFC 9562) y la variante de siempre.
  function uuidDe(h) {
    var x = h.slice(0, 32).split('');
    x[12] = '8';
    x[16] = '89ab'.charAt('0123456789abcdef'.indexOf(x[16]) % 4);
    x = x.join('');
    return x.slice(0, 8) + '-' + x.slice(8, 12) + '-' + x.slice(12, 16) + '-' + x.slice(16, 20) + '-' + x.slice(20, 32);
  }
  // Enteros que vienen como número en el JSON (grado, año, n.º de lista,
  // cantidad). Sin convertir texto a número (regla 19): si no es un entero
  // de verdad, no vale.
  function entero(x, min, max) {
    return typeof x === 'number' && Math.floor(x) === x && x >= min && x <= max ? x : null;
  }
  // «85», «85.0» y «85.00» son la misma nota.
  function notaCanon(t) {
    return String(t == null ? '' : t).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }
  function nuevaFila(clase, estado, extra) {
    return Object.assign({ clase: clase, estado: estado, avisos: [], errores: [], revisar: false }, extra || {});
  }
  function revisar(fila, l) {
    if (l && l.confianza < 0.9) fila.revisar = true;
  }

  // ── 1. ¿Es un archivo nuestro? ─────────────────────────────────────────
  function leer(texto) {
    var a;
    try { a = JSON.parse(texto); } catch (e) {
      return { ok: false, frase: 'Ese archivo no se puede abrir. Tiene que ser un archivo de importación de M.E.T.A.S.' };
    }
    if (!a || typeof a !== 'object' || Array.isArray(a)) {
      return { ok: false, frase: 'Ese archivo no se puede abrir. Tiene que ser un archivo de importación de M.E.T.A.S.' };
    }
    if (a.formato !== FORMATO) {
      return { ok: false, frase: 'Ese archivo es de otra versión. Pide el archivo de importación de M.E.T.A.S, versión 1.' };
    }
    var au = a.aula || {};
    if (!String(au.escuela || '').trim() || entero(au.grado, 0, 12) === null || !/^[0-9A-Za-z]{1,3}$/.test(String(au.seccion || ''))
        || entero(au.anio_lectivo, 2020, 2100) === null) {
      return { ok: false, frase: 'Al archivo le falta el aula: escuela, grado, sección y año.' };
    }
    return { ok: true, archivo: a };
  }

  // ── 2. La vista previa ─────────────────────────────────────────────────
  // opciones.claves: Map clave normalizada → nombre que tenía en la lista
  //   vieja (de metas.claves_archivo). null si no se pudo leer (sin señal):
  //   entonces la clave se comprueba al guardar.
  // opciones.inventario: { leer(): [bienes], guardar(arr) } (el blob).
  // opciones.decisiones: lo que el docente ya respondió (para volver a armar).
  async function preparar(api, archivo, opciones) {
    opciones = opciones || {};
    var dec = opciones.decisiones || {};
    var owner = M._nube.uid();
    if (!owner) throw new Error('sin cuenta');
    var mt = montos();
    async function id() { return uuidDe(await sha(owner + '|' + Array.prototype.join.call(arguments, '|'))); }
    var plan = { aula: null, asignaturas: [], alumnos: [], familias: [], notas: [], colectas: [], exenciones: [], pagos: [],
      gastos: [], gastosDocente: [], reembolsos: [], inventario: [], preguntas: [] };

    // Aula: si ya hay una con la misma escuela, grado, sección y año, es esa.
    var au = archivo.aula;
    var claveAula = [norm(au.escuela), au.grado, String(au.seccion).toUpperCase(), au.anio_lectivo].join('·');
    var aulaHay = api.lista('aulas').filter(function (x) {
      return [norm(x.escuela), x.grado, String(x.seccion).toUpperCase(), x.anio_lectivo].join('·') === claveAula;
    })[0];
    var aulaId = aulaHay ? aulaHay.id : await id('aula', claveAula);
    var aulaYa = !!(aulaHay || api.lista('aulas', { id: aulaId })[0]);
    plan.aula = nuevaFila('aula', aulaYa ? 'ya_estaba' : 'nuevo', {
      id: aulaId, texto: au.grado + 'º-' + au.seccion + ' · ' + au.escuela + ' · ' + au.anio_lectivo,
      campos: { escuela: String(au.escuela).trim().slice(0, 160), grado: au.grado, seccion: String(au.seccion),
        anio_lectivo: au.anio_lectivo, codigo_centro: au.codigo_centro || null },
    });

    // Asignaturas: las del aula y las que aparecen en las notas.
    var asigHay = aulaYa ? api.lista('asignaturas', { aula_id: aulaId }) : [];
    var asigPorNombre = {};
    asigHay.forEach(function (x) { asigPorNombre[norm(x.nombre)] = x.id; });
    var nombresAsig = (au.asignaturas || []).concat((archivo.notas || []).map(function (n) { return n.asignatura; }));
    var orden = asigHay.reduce(function (m, x) { return Math.max(m, x.orden || 0); }, 0);
    for (var ia = 0; ia < nombresAsig.length; ia++) {
      var na = String(nombresAsig[ia] || '').trim().slice(0, 80);
      if (!na || asigPorNombre[norm(na)]) continue;
      var aid = await id('asignatura', aulaId, norm(na));
      asigPorNombre[norm(na)] = aid;
      plan.asignaturas.push(nuevaFila('asignatura', api.lista('asignaturas', { id: aid })[0] ? 'ya_estaba' : 'nuevo',
        { id: aid, texto: na, campos: { aula_id: aulaId, nombre: na, orden: ++orden } }));
    }

    // Alumnos: por identidad (une sola), si no por nombre (se pregunta).
    var hay = aulaYa ? api.lista('alumnos', { aula_id: aulaId }) : [];
    var porRef = {};
    var identidadesVistas = {};
    var nombresVistos = {};
    for (var i = 0; i < (archivo.alumnos || []).length; i++) {
      var a = archivo.alumnos[i];
      var nom = leido(a.nombre_completo) || { texto: '', confianza: 1 };
      var ide = leido(a.identidad);
      var pais = /^[A-Z]{2}$/.test(String(a.documento_pais || '')) ? a.documento_pais : 'HN';
      var tipo = ['identidad', 'cui', 'partida', 'pasaporte', 'otro'].indexOf(a.documento_tipo) >= 0 ? a.documento_tipo : 'identidad';
      var nombre = nom.texto.replace(/\s+/g, ' ').trim();
      var f = nuevaFila('alumno', 'nuevo', { ref: a.ref, texto: nombre, num_lista: a.num_lista || null });
      revisar(f, nom); revisar(f, ide);
      if (nombre.length < 3 || nombre.length > 120) f.errores.push('Falta el nombre completo');
      else if (nombre.split(' ').length < 2) f.avisos.push('¿Falta el apellido?');
      var identidad = null;
      if (ide && ide.texto.trim()) {
        var limpia = ide.texto.toUpperCase().replace(/[\s-]/g, '');
        if (pais === 'HN' && tipo === 'identidad') {
          if (/^\d{13}$/.test(limpia)) identidad = limpia;
          else if (/[A-Z]/.test(limpia)) f.errores.push('La identidad «' + ide.texto + '» trae una letra donde va un número');
          else f.errores.push('El número de identidad tiene ' + limpia.replace(/\D/g, '').length + ' dígitos; debe tener 13');
        } else if (/^[0-9A-Z]{4,25}$/.test(limpia)) {
          identidad = limpia;
        } else {
          f.errores.push('El documento tiene que tener de 4 a 25 letras y números');
        }
      } else {
        f.avisos.push('Falta identidad');
      }
      if (identidad) {
        var llaveId = pais + ':' + identidad;
        if (identidadesVistas[llaveId]) f.errores.push('Esta identidad ya es de ' + identidadesVistas[llaveId] + ' en el archivo');
        identidadesVistas[llaveId] = nombre;
      }
      var nn = norm(nombre);
      f.campos = { aula_id: aulaId, nombre_completo: nombre, num_lista: entero(a.num_lista, 1, 99),
        sexo: a.sexo === 'F' || a.sexo === 'M' ? a.sexo : null, fecha_nacimiento: fechaOk(a.fecha_nacimiento) ? a.fecha_nacimiento : null,
        identidad: identidad, documento_pais: pais, documento_tipo: tipo };
      if (!f.errores.length) {
        var porId = identidad && hay.filter(function (x) { return x.identidad === identidad && (x.documento_pais || 'HN') === pais; })[0];
        var porNom = !porId && hay.filter(function (x) { return norm(x.nombre_completo) === nn; });
        if (porId) {
          f.estado = 'ya_estaba'; f.id = porId.id;
        } else if (porNom && porNom.length && porNom.some(function (x) { return !x.identidad || !identidad; })) {
          // Mismo nombre y a uno le falta la identidad: «¿Es la misma persona?»
          var x0 = porNom[0];
          var k = 'misma:' + a.ref;
          f.pregunta = { clave: k, texto: '¿' + nombre + ' es la misma persona que ya tienes (n.º ' + (x0.num_lista || '·') + ')?',
            botones: [{ etiqueta: 'Es la misma', valor: 'misma' }, { etiqueta: 'Es otra persona', valor: 'otra' }] };
          plan.preguntas.push(f.pregunta);
          if (dec[k] === 'misma') { f.estado = 'ya_estaba'; f.id = x0.id; }
          else if (dec[k] === 'otra') { f.estado = 'nuevo'; }
          else f.estado = 'pregunta';
        }
        if (f.estado === 'nuevo' || f.estado === 'pregunta') {
          nombresVistos[nn] = (nombresVistos[nn] || 0) + 1;
          var nid = await id('alumno', aulaId, identidad ? pais + ':' + identidad : 'n:' + nn + ':' + nombresVistos[nn]);
          if (api.lista('alumnos', { id: nid })[0]) { f.estado = 'ya_estaba'; f.id = nid; }
          else if (f.estado === 'nuevo') f.id = nid;
          else f.idSiNueva = nid;
        }
      } else {
        f.estado = 'error';
      }
      porRef[a.ref] = f;
      plan.alumnos.push(f);
    }
    function alumnoDe(ref) {
      var al = porRef[ref];
      return al && (al.estado === 'nuevo' || al.estado === 'ya_estaba') ? al : null;
    }

    // Familias: la clave que ya tiene, solo si estaba en sus datos anteriores.
    var claves = opciones.claves || null;
    for (var j = 0; j < (archivo.alumnos || []).length; j++) {
      var af = archivo.alumnos[j];
      var clave = String(af.clave_familia || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
      var tel = String(af.telefono || '').trim();
      if (!clave && !af.encargado && !tel) continue;
      var al = alumnoDe(af.ref);
      var ff = nuevaFila('familia', 'nuevo', { ref: af.ref, texto: 'Familia de ' + ((porRef[af.ref] || {}).texto || af.ref) });
      if (!al) { ff.estado = 'error'; ff.errores.push('Su alumno no se guarda'); plan.familias.push(ff); continue; }
      ff.id = await id('familia', al.id || al.idSiNueva);
      if ((al.estado === 'ya_estaba' && api.lista('familias', { alumno_id: al.id })[0]) || api.lista('familias', { id: ff.id })[0]) {
        ff.estado = 'ya_estaba';
        plan.familias.push(ff);
        continue;
      }
      ff.campos = { aula_id: aulaId, alumno_id: al.id, encargado_nombre: af.encargado ? String(af.encargado).slice(0, 120) : null };
      if (tel) {
        if (/^[0-9 +()-]{8,20}$/.test(tel)) ff.campos.telefono = tel;
        else ff.avisos.push('El teléfono «' + tel + '» no se entiende; se guarda sin él');
      }
      // Una clave que ya abre OTRA familia no se puede repetir (la base no lo
      // deja): esta familia recibe una nueva, con su tira (04, 4.2).
      var deOtra = clave && api.lista('familias').filter(function (x) {
        return (x.clave === clave || x.clave_siguiente === clave) && x.alumno_id !== al.id;
      })[0];
      if (deOtra) {
        var suyo = api.lista('alumnos', { id: deOtra.alumno_id })[0];
        ff.avisos.push('Esa clave ya es de la familia de ' + (suyo ? suyo.nombre_completo : 'otro alumno')
          + ': se le da una nueva. Entrega tira nueva');
        ff.tiraNueva = true;
        clave = '';
      }
      if (clave) {
        if (!claves) {
          ff.campos.clave = clave;
          ff.avisos.push('La clave ' + af.clave_familia + ' se comprueba cuando haya señal');
        } else if (!claves.has(clave)) {
          ff.avisos.push('Esa clave no está en tus datos anteriores: se le da una nueva. Entrega tira nueva');
          ff.tiraNueva = true;
        } else {
          var era = claves.get(clave);
          if (era && norm(era) !== norm((porRef[af.ref] || {}).texto)) {
            var kf = 'clave:' + af.ref;
            ff.pregunta = { clave: kf, texto: 'En tus datos anteriores, la clave ' + af.clave_familia + ' era de ' + era + '. ¿Es la misma familia?',
              botones: [{ etiqueta: 'Sí', valor: 'si' }, { etiqueta: 'No, darle una nueva', valor: 'nueva' }] };
            plan.preguntas.push(ff.pregunta);
            if (dec[kf] === 'si') ff.campos.clave = clave;
            else if (dec[kf] === 'nueva') { ff.tiraNueva = true; ff.avisos.push('Se le da una clave nueva. Entrega tira nueva'); }
            else ff.estado = 'pregunta';
          } else {
            ff.campos.clave = clave;
          }
        }
      }
      plan.familias.push(ff);
    }

    // Notas: una por alumno, asignatura y parcial; si ya hay otra, «cambia de X a Y».
    var notasHay = aulaYa ? api.lista('notas', { aula_id: aulaId }) : [];
    for (var n = 0; n < (archivo.notas || []).length; n++) {
      var no = archivo.notas[n];
      var v = leido(no.valor) || { texto: '' };
      var fn = nuevaFila('nota', 'nuevo', { ref: no.alumno, texto: ((porRef[no.alumno] || {}).texto || no.alumno) + ' · ' + no.asignatura + ' · ' + no.periodo });
      revisar(fn, v);
      var aln = alumnoDe(no.alumno);
      var asid = asigPorNombre[norm(no.asignatura)];
      var comp = ['final', 'acumulativo', 'examen'].indexOf(no.componente) >= 0 ? no.componente : 'final';
      var txt = v.texto.trim().replace(',', '.');
      if (!aln) fn.errores.push('Su alumno no se guarda');
      if (PERIODOS.indexOf(no.periodo) < 0) fn.errores.push('El parcial tiene que ser I, II, III, IV o REC');
      if (!txt) fn.errores.push('Sin nota');
      else if (!/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/.test(txt)) fn.errores.push('«' + v.texto + '» no es una nota de 0 a 100');
      else if (/\./.test(txt)) fn.avisos.push('El SACE usa números enteros');
      fn.valor = txt;
      if (fn.errores.length) { fn.estado = 'error'; plan.notas.push(fn); continue; }
      var ya = aln.estado === 'ya_estaba' && notasHay.filter(function (x) {
        return x.alumno_id === aln.id && x.asignatura_id === asid && x.periodo === no.periodo && (x.componente || 'final') === comp;
      })[0];
      fn.campos = { aula_id: aulaId, alumno_id: aln.id, asignatura_id: asid, periodo: no.periodo, componente: comp, valor: txt };
      if (ya) {
        fn.id = ya.id;
        if (notaCanon(ya.valor) === notaCanon(txt)) fn.estado = 'ya_estaba';
        else {
          // Por defecto, un dato ya guardado NO se cambia (4.4, regla 5).
          var kn = 'nota:' + n;
          fn.estado = dec[kn] === 'cambiar' ? 'cambia' : 'cambia_sin_marcar';
          fn.antes = notaCanon(ya.valor);
          fn.marca = kn;
        }
      } else {
        fn.id = await id('nota', aln.id || aln.idSiNueva, asid, no.periodo, comp);
        if (api.lista('notas', { id: fn.id })[0]) fn.estado = 'ya_estaba';
      }
      plan.notas.push(fn);
    }

    // Colectas, con lo que no le corresponde a alguien y sus gastos.
    var colRef = {};
    var colHay = aulaYa ? api.lista('colectas', { aula_id: aulaId }) : [];
    for (var c = 0; c < (archivo.colectas || []).length; c++) {
      var co = archivo.colectas[c];
      var fc = nuevaFila('colecta', 'nuevo', { ref: co.ref, texto: String(co.concepto || '').trim() });
      var sug = leido(co.monto_sugerido) || { texto: '' };
      revisar(fc, sug);
      if (!fc.texto) fc.errores.push('Falta el concepto');
      if (!fechaOk(co.fecha)) fc.errores.push('La fecha de la colecta no se entiende');
      fc.sugerido = leerMontoFila(fc, sug, 'colecta:' + co.ref, dec, true);
      var yaC = colHay.filter(function (x) { return norm(x.concepto) === norm(fc.texto) && x.fecha === co.fecha; })[0];
      fc.id = yaC ? yaC.id : await id('colecta', aulaId, norm(fc.texto), co.fecha);
      if (fc.errores.length) fc.estado = 'error';
      else if (yaC || api.lista('colectas', { id: fc.id })[0]) fc.estado = 'ya_estaba';
      fc.campos = { aula_id: aulaId, concepto: fc.texto.slice(0, 120), monto_sugerido: fc.sugerido, fecha: co.fecha };
      var papel = leido(co.total_en_papel);
      if (papel && papel.texto.trim()) fc.papel = leerMontoFila(fc, papel, 'papel:' + co.ref, dec, true);
      colRef[co.ref] = fc;
      plan.colectas.push(fc);

      for (var e = 0; e < (co.no_corresponde || []).length; e++) {
        var refE = co.no_corresponde[e];
        var ale = alumnoDe(refE);
        var fe = nuevaFila('exencion', ale && fc.estado !== 'error' ? 'nuevo' : 'error', { texto: ((porRef[refE] || {}).texto || refE) + ' · no le corresponde', colecta: co.ref });
        if (!ale) fe.errores.push('Su alumno no se guarda');
        else if (fc.estado === 'error') fe.errores.push('Su colecta no se guarda');
        else {
          fe.id = await id('exencion', fc.id, ale.id || ale.idSiNueva);
          fe.campos = { colecta_id: fc.id, alumno_id: ale.id, monto_aplicable: null, motivo: 'no le corresponde' };
          if (api.lista('colecta_exenciones', { colecta_id: fc.id, alumno_id: ale.id })[0]) fe.estado = 'ya_estaba';
        }
        plan.exenciones.push(fe);
      }
      var gastosVistos = {};
      for (var g = 0; g < (co.gastos || []).length; g++) {
        var ga = co.gastos[g];
        var fg = nuevaFila('gasto', 'nuevo', { texto: String(ga.concepto || '').trim() + ' · ' + fc.texto, colecta: co.ref });
        var mg = leido(ga.monto) || { texto: '' };
        revisar(fg, mg);
        if (!fg.texto) fg.errores.push('Falta el concepto');
        if (!fechaOk(ga.fecha)) fg.errores.push('La fecha no se entiende');
        fg.monto = leerMontoFila(fg, mg, 'gasto:' + co.ref + ':' + g, dec, false);
        if (fc.estado === 'error') fg.errores.push('Su colecta no se guarda');
        var kg = [fc.id, ga.fecha, norm(ga.concepto), fg.monto].join('|');
        gastosVistos[kg] = (gastosVistos[kg] || 0) + 1;
        fg.id = await id('gasto', kg, gastosVistos[kg]);
        fg.campos = { colecta_id: fc.id, fecha: ga.fecha, concepto: String(ga.concepto || '').trim().slice(0, 160), monto: fg.monto };
        fg.estado = fg.errores.length || fg.monto == null ? 'error' : api.lista('gastos', { id: fg.id })[0] ? 'ya_estaba' : 'nuevo';
        plan.gastos.push(fg);
      }
    }

    // Pagos: cada abono es un renglón; el recibo nuevo lo numera la base.
    var pagosVistos = {};
    for (var p = 0; p < (archivo.pagos || []).length; p++) {
      var pa = archivo.pagos[p];
      var fp = nuevaFila('pago', 'nuevo', { texto: ((porRef[pa.alumno] || {}).texto || pa.alumno), colecta: pa.colecta });
      var colp = colRef[pa.colecta];
      var alp = alumnoDe(pa.alumno);
      var mp = leido(pa.monto) || { texto: '' };
      revisar(fp, mp);
      if (!colp || colp.estado === 'error') fp.errores.push('Su colecta no se guarda');
      if (!alp) fp.errores.push('Su alumno no se guarda');
      if (!fechaOk(pa.fecha)) fp.errores.push('La fecha del pago no se entiende');
      fp.monto = leerMontoFila(fp, mp, 'pago:' + p, dec, true);
      if (fp.monto === '0.00') { fp.estado = 'no_dio'; plan.pagos.push(fp); continue; }
      var rec = String(pa.recibo_anterior || '').trim().toUpperCase();
      if (rec && !/^RC-[0-9A-Z]{2,8}-[0-9]{1,4}$/.test(rec)) { fp.avisos.push('El recibo anterior «' + pa.recibo_anterior + '» no se entiende; se guarda sin él'); rec = ''; }
      if (fp.monto && colp && colp.sugerido && mt.comparar(colp.sugerido, '0.00') > 0) {
        if (mt.comparar(fp.monto, mt.desdeCentavos(mt.centavos(colp.sugerido) * 10n)) > 0) fp.avisos.push('¿Seguro? Es más de 10 veces lo sugerido');
        else if (mt.comparar(fp.monto, colp.sugerido) > 0) fp.avisos.push('Más que lo sugerido');
      }
      if (fp.errores.length || fp.monto == null) { fp.estado = 'error'; plan.pagos.push(fp); continue; }
      var kp = [colp.id, alp.id || alp.idSiNueva, fp.monto, pa.fecha, rec].join('|');
      fp.id = await id('pago', kp, (pagosVistos[kp] || 0) + 1);
      // Un recibo anterior no se repite entre los pagos del docente (la base
      // lo exige): si ya es de OTRO pago, este se guarda sin él.
      var recUsado = rec && (api.lista('pagos').some(function (x) { return x.recibo_anterior === rec && x.id !== fp.id; })
        || plan.pagos.some(function (x) { return x.campos && x.campos.recibo_anterior === rec; }));
      if (recUsado) {
        fp.avisos.push('El recibo anterior ' + rec + ' ya está en otro pago; este se guarda sin él');
        rec = '';
        kp = [colp.id, alp.id || alp.idSiNueva, fp.monto, pa.fecha, rec].join('|');
        fp.id = await id('pago', kp, (pagosVistos[kp] || 0) + 1);
      }
      pagosVistos[kp] = (pagosVistos[kp] || 0) + 1;
      fp.campos = { colecta_id: colp.id, alumno_id: alp.id, monto: fp.monto, fecha: pa.fecha, recibo_anterior: rec || null };
      if (api.lista('pagos', { id: fp.id })[0]) fp.estado = 'ya_estaba';
      plan.pagos.push(fp);
    }
    // El control contra el papel: lo escrito en el cuaderno contra la suma.
    plan.colectas.forEach(function (fc2) {
      var suma = mt.sumar(plan.pagos.filter(function (x) {
        return x.colecta === fc2.ref && (x.estado === 'nuevo' || x.estado === 'ya_estaba');
      }).map(function (x) { return x.monto; }));
      fc2.suma = suma;
      if (fc2.papel == null || fc2.estado === 'error') return;
      var dif = mt.restar(fc2.papel, suma);
      if (mt.comparar(dif, '0.00') === 0) { fc2.coincide = true; return; }
      fc2.diferencia = dif.replace('-', '');
      fc2.marca = 'diferencia:' + fc2.ref;
      if (dec[fc2.marca] !== 'con_diferencia') fc2.retenida = true;   // hasta tocar «… con la diferencia»
    });
    // Lo de una colecta retenida (y sus pagos, gastos y exenciones) espera.
    ['exenciones', 'gastos', 'pagos'].forEach(function (k) {
      plan[k].forEach(function (x) {
        var col = colRef[x.colecta];
        if (col && col.retenida && x.estado === 'nuevo') x.estado = 'espera';
      });
    });

    // Gastos del docente («de mi bolsillo») y lo que ya le devolvieron.
    var gdVistos = {};
    for (var q = 0; q < (archivo.gastos_docente || []).length; q++) {
      var gd = archivo.gastos_docente[q];
      var fd = nuevaFila('gasto_docente', 'nuevo', { texto: String(gd.concepto || '').trim() });
      var md = leido(gd.monto) || { texto: '' };
      revisar(fd, md);
      if (!fd.texto) fd.errores.push('Falta el concepto');
      if (!fechaOk(gd.fecha)) fd.errores.push('La fecha no se entiende');
      fd.monto = leerMontoFila(fd, md, 'gastodoc:' + q, dec, false);
      var kd = [gd.fecha, norm(gd.concepto), fd.monto].join('|');
      gdVistos[kd] = (gdVistos[kd] || 0) + 1;
      fd.id = await id('gasto_docente', kd, gdVistos[kd]);
      fd.campos = { fecha: gd.fecha, tipo: CATS_GASTO.indexOf(gd.tipo) >= 0 ? gd.tipo : 'otro', concepto: fd.texto.slice(0, 160),
        cobrar_a: String(gd.cobrar_a || 'Dirección').slice(0, 120), monto: fd.monto, tiene_recibo: !!gd.tiene_recibo,
        escuela: gd.escuela || au.escuela, aula_id: aulaId };
      fd.estado = fd.errores.length || fd.monto == null ? 'error' : api.lista('gastos_docente', { id: fd.id })[0] ? 'ya_estaba' : 'nuevo';
      plan.gastosDocente.push(fd);
      var rVistos = {};
      for (var r = 0; r < (gd.reembolsos || []).length; r++) {
        var re = gd.reembolsos[r];
        var fr = nuevaFila('reembolso', 'nuevo', { texto: 'Te devolvieron · ' + fd.texto });
        var mr = leido(re.monto) || { texto: '' };
        revisar(fr, mr);
        if (!fechaOk(re.fecha)) fr.errores.push('La fecha no se entiende');
        if (fd.estado === 'error') fr.errores.push('Su gasto no se guarda');
        fr.monto = leerMontoFila(fr, mr, 'reemb:' + q + ':' + r, dec, false);
        var kr = [fd.id, re.fecha, fr.monto].join('|');
        rVistos[kr] = (rVistos[kr] || 0) + 1;
        fr.id = await id('reembolso', kr, rVistos[kr]);
        fr.campos = { gasto_id: fd.id, fecha: re.fecha, monto: fr.monto, quien_pago: re.quien_pago || null };
        fr.estado = fr.errores.length || fr.monto == null ? 'error' : api.lista('reembolsos', { id: fr.id })[0] ? 'ya_estaba' : 'nuevo';
        plan.reembolsos.push(fr);
      }
    }

    // Inventario del aula: todavía vive en el blob (corte 3); se suma por id.
    var invHay = opciones.inventario ? opciones.inventario.leer() : [];
    var invVistos = {};
    for (var b = 0; b < (archivo.inventario || []).length; b++) {
      var bi = archivo.inventario[b];
      var fb = nuevaFila('bien', 'nuevo', { texto: String(bi.nombre || '').trim() });
      var vb = leido(bi.valor);
      revisar(fb, vb);
      if (fb.texto.length < 3) fb.errores.push('Falta qué cosa es');
      if (!fechaOk(bi.fecha)) fb.errores.push('La fecha no se entiende');
      var valor = vb && vb.texto.trim() ? leerMontoFila(fb, vb, 'bien:' + b, dec, true) : '0.00';
      var dueno = DUENOS.indexOf(bi.dueno) >= 0 ? bi.dueno : 'escuela';
      var kb = [bi.fecha, norm(bi.nombre), dueno].join('|');
      invVistos[kb] = (invVistos[kb] || 0) + 1;
      fb.id = 'IMP' + (await sha(owner + '|bien|' + kb + '|' + invVistos[kb])).slice(0, 16);
      fb.bien = {
        id: fb.id, fecha: bi.fecha, nombre: fb.texto.slice(0, 120), dueno: dueno,
        cat: CATS_INV.indexOf(bi.categoria) >= 0 ? bi.categoria : 'otro',
        // El valor queda como texto («850.00»), como todo monto (regla 19).
        cant: entero(bi.cantidad, 1, 100000) || 1, valor: valor == null ? '0.00' : valor,
        nota: dueno === 'donado' ? '' : String(bi.nota || ''), donante: dueno === 'donado' ? String(bi.donante || '') : '',
        factura: bi.tiene_recibo ? 1 : 0, escuela: au.escuela,
      };
      fb.estado = fb.errores.length || valor == null ? 'error' : invHay.some(function (x) { return x && x.id === fb.id; }) ? 'ya_estaba' : 'nuevo';
      plan.inventario.push(fb);
    }

    plan.resumen = resumir(plan);
    return plan;
  }

  // Un monto del archivo, con las reglas de 4.2: «1,500» se pregunta.
  function leerMontoFila(fila, l, clave, dec, permitirCero) {
    var r = montos().leer(l.texto);
    if (r.pregunta) {
      var op = r.pregunta.opciones;
      // La pregunta se queda a la vista aunque ya esté respondida: así se ve
      // qué se eligió (✓) y se puede cambiar antes de guardar.
      fila.pregunta = { clave: clave, texto: r.pregunta.texto,
        botones: op.map(function (o) { return { etiqueta: o.etiqueta, valor: o.valor }; }) };
      if (dec[clave] && op.some(function (o) { return o.valor === dec[clave]; })) return dec[clave];
      fila.errores.push('Hay que decir cuál monto es');
      return null;
    }
    if (!r.ok) {
      fila.errores.push(/^\s*\d+[.,]\d{3,}\s*$/.test(l.texto) && !/^\s*\d{1,3}[.,]\d{3}\s*$/.test(l.texto)
        ? 'Los centavos llevan dos cifras' : '«' + l.texto + '» no es un monto');
      return null;
    }
    if (!permitirCero && r.valor === '0.00') { fila.errores.push('El monto tiene que ser mayor que cero'); return null; }
    return r.valor;
  }

  var SECCIONES = ['asignaturas', 'alumnos', 'familias', 'notas', 'colectas', 'exenciones', 'pagos', 'gastos', 'gastosDocente',
    'reembolsos', 'inventario'];
  function resumir(plan) {
    var r = { nuevos: 0, ya: 0, cambian: 0, errores: 0, preguntas: 0, revisar: 0, espera: 0, porSeccion: {} };
    var todas = [plan.aula].concat.apply([plan.aula], SECCIONES.map(function (k) { return plan[k]; }));
    todas.forEach(function (f) {
      if (f.revisar) r.revisar++;
      if (f.estado === 'nuevo' || f.estado === 'cambia') r.nuevos++;
      else if (f.estado === 'ya_estaba') r.ya++;
      else if (f.estado === 'cambia_sin_marcar') r.cambian++;
      else if (f.estado === 'error') r.errores++;
      else if (f.estado === 'pregunta') r.preguntas++;
      else if (f.estado === 'espera') r.espera++;
    });
    SECCIONES.forEach(function (k) {
      r.porSeccion[k] = plan[k].reduce(function (o, f) { o[f.estado] = (o[f.estado] || 0) + 1; return o; }, {});
    });
    r.pagosSuma = montos().sumar(plan.pagos.filter(function (x) { return x.estado === 'nuevo'; }).map(function (x) { return x.monto; }));
    return r;
  }

  // ── 3. Guardar lo confirmado ───────────────────────────────────────────
  // Solo lo que está «nuevo» (o «cambia» y el docente lo marcó). En orden:
  // lo que contiene antes de lo contenido. Cada operación con su id fijo.
  async function guardar(api, plan, opciones) {
    opciones = opciones || {};
    var owner = M._nube.uid();
    async function op(fila) { return { op_id: uuidDe(await sha(owner + '|op|' + fila.clase + '|' + fila.id)) }; }
    function nuevo(f) { return f.estado === 'nuevo'; }
    var n = 0;
    if (nuevo(plan.aula)) { api.crear('aulas', Object.assign({ id: plan.aula.id }, plan.aula.campos), await op(plan.aula)); n++; }
    var listas = [
      ['asignaturas', function (f, x) { api.crear('asignaturas', Object.assign({ id: f.id }, f.campos), x); }],
      ['alumnos', function (f, x) {
        var c = Object.assign({ id: f.id }, f.campos);
        Object.keys(c).forEach(function (k) { if (c[k] == null) delete c[k]; });
        api.crear('alumnos', c, x);
      }],
      ['familias', function (f, x) {
        var c = Object.assign({ id: f.id }, f.campos);
        Object.keys(c).forEach(function (k) { if (c[k] == null) delete c[k]; });
        api.crear('familias', c, x);
      }],
      ['notas', function (f, x) { api.crear('notas', Object.assign({ id: f.id }, f.campos), x); }],
      ['colectas', function (f, x) { api.colecta.crear(Object.assign({ id: f.id }, f.campos), x); }],
      ['exenciones', function (f, x) { api.exencion.poner(Object.assign({ id: f.id }, f.campos), x); }],
      ['pagos', function (f, x) { api.pagar(Object.assign({ id: f.id }, f.campos), x); }],
      ['gastos', function (f, x) { api.gasto.crear(Object.assign({ id: f.id }, f.campos), x); }],
      ['gastosDocente', function (f, x) { api.gastoDocente.crear(Object.assign({ id: f.id, son_distintos: true }, f.campos), x); }],
      ['reembolsos', function (f, x) { api.reembolso.crear(Object.assign({ id: f.id, son_distintos: true }, f.campos), x); }],
    ];
    for (var i = 0; i < listas.length; i++) {
      var filas = plan[listas[i][0]];
      for (var j = 0; j < filas.length; j++) {
        var f = filas[j];
        if (f.clase === 'colecta' && f.retenida) continue;
        if (nuevo(f)) {
          listas[i][1](f, await op(f));
          n++;
        } else if (f.estado === 'cambia' && f.clase === 'nota') {
          api.editar('notas', f.id, { valor: f.campos.valor });
          n++;
        }
      }
    }
    // El inventario, al blob: se suma lo nuevo a lo que ya hay (por id).
    var bienes = plan.inventario.filter(nuevo).map(function (f) { return f.bien; });
    if (bienes.length && opciones.inventario) {
      var hay = opciones.inventario.leer();
      var ids = {};
      hay.forEach(function (x) { if (x && x.id) ids[x.id] = 1; });
      opciones.inventario.guardar(hay.concat(bienes.filter(function (x) { return !ids[x.id]; })));
      n += bienes.length;
    }
    return { guardados: n, aula: plan.aula.id };
  }

  // El inventario de este aparato (METAS_ADMIN_V1, en la raíz): lo que la
  // pantalla de antes muestra y js/metas-blob-sesion.js lleva a la base.
  var inventarioLocal = {
    leer: function () {
      try { var st = JSON.parse(w.localStorage.getItem('METAS_ADMIN_V1')); return st && Array.isArray(st.inventario) ? st.inventario : []; }
      catch (e) { return []; }
    },
    guardar: function (arr) {
      var st;
      try { st = JSON.parse(w.localStorage.getItem('METAS_ADMIN_V1')); } catch (e) { st = null; }
      if (!st || typeof st !== 'object') st = { v: 2, grupos: [] };
      st.inventario = arr;
      w.localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(st));
      if (w.MetasBlob) w.MetasBlob.ahora();
    },
  };

  M.importar = { FORMATO: FORMATO, leer: leer, preparar: preparar, guardar: guardar, inventarioLocal: inventarioLocal,
    _uuidDe: uuidDe };
})(window);
