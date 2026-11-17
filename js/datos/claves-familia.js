/* =====================================================================
   M.E.T.A.S — js/datos/claves-familia.js · preparar las fichas de familia
   ---------------------------------------------------------------------
   Un aula traída de un archivo sin familias deja a los alumnos sin fila en
   metas.familias, y sin esa fila no hay tira en el talonario. Este módulo
   arma la VISTA PREVIA de las fichas que faltan y, cuando el docente toca
   Guardar, las anota en la cola como cualquier otra fila.

     preparar(api, aulaId, op)  qué ficha se crea, si conserva la clave de
                                siempre o recibe una nueva, y qué hay que
                                preguntar. No guarda nada.
     guardar(api, plan)         lo «nuevo» entra a la cola con
                                api.crear('familias', …), como la importación.
     bonita(clave)              la clave como se lee: 15-K7QM o K7QMX-4PA2B.

   LA CLAVE LA PONE LA BASE (metas.t_clave_familia): sin clave, sortea una
   nueva de 10 símbolos; con una clave que estaba en metas.claves_archivo de
   ESE docente, la conserva. Aquí solo se decide si se PIDE conservar una, y
   solo cuando el empareje es seguro. Nunca se adivina: ante la duda se
   pregunta, y sin respuesta esa ficha no se guarda.

   Esto NO es metas.familias_preparar_claves_nuevas: aquella pone la tira
   siguiente a fichas que ya existen; esta crea las fichas que faltan.

   Los ids salen del contenido, igual que en importar.js (owner + familia +
   alumno), y la operación también: tocar dos veces, o importar después un
   archivo con esa familia, cae en la MISMA fila (índice familias_alumno_unica
   y la llave primaria). No toca dinero.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  // Lo que la base acepta como clave conservada (nº de lista + 4) y como
  // clave nueva (10 símbolos sin I, O, 0 ni 1). Una clave del archivo con
  // otra forma no se puede conservar: la base la rechazaría.
  var CONSERVABLE = /^[0-9]{1,2}[A-Z0-9]{4}$/;
  var NUEVA = /^[A-HJ-NP-Z2-9]{10}$/;

  function norm(t) {
    return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  }
  function normClave(c) {
    return String(c == null ? '' : c).toUpperCase().replace(/[^0-9A-Z]/g, '');
  }
  // El número de lista con que nació una clave conservada (15K7QM → 15).
  // Las 4 últimas son la clave; lo de adelante, el número, como texto y sin
  // el cero de adelante («07» es el 7).
  function numDe(clave) {
    if (!CONSERVABLE.test(clave)) return null;
    return clave.slice(0, clave.length - 4).replace(/^0(?=[0-9])/, '');
  }
  function bonita(c) {
    var k = normClave(c);
    if (NUEVA.test(k)) return k.slice(0, 5) + '-' + k.slice(5);
    if (CONSERVABLE.test(k)) return k.slice(0, k.length - 4) + '-' + k.slice(k.length - 4);
    return k;
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  async function sha(texto) {
    return hex(await w.crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)));
  }
  // El mismo uuid v8 «del contenido» que importar.js.
  function uuidDe(h) {
    if (M.importar && M.importar._uuidDe) return M.importar._uuidDe(h);
    var x = h.slice(0, 32).split('');
    x[12] = '8';
    x[16] = '89ab'.charAt('0123456789abcdef'.indexOf(x[16]) % 4);
    x = x.join('');
    return x.slice(0, 8) + '-' + x.slice(8, 12) + '-' + x.slice(12, 16) + '-' + x.slice(16, 20) + '-' + x.slice(20, 32);
  }
  function sigue(a) {
    return !a.estado || a.estado === 'activo' || a.estado === 'ingreso';
  }
  function aviso(texto) {
    var e = new Error(texto);
    e.paraElDocente = true;
    return e;
  }

  // ── La vista previa ────────────────────────────────────────────────────
  // op.claves: las de metas.claves_archivo del docente, como Map (clave →
  //   nombre) o como filas { clave, nombre_alumno }. Sin ellas (sin señal) no
  //   se arma nada: preparar a ciegas daría claves nuevas a quien podía
  //   conservar la suya.
  // op.familias: las fichas del docente leídas de la base (todas sus aulas),
  //   para no repetir una clave que ya abre otra familia. Se suman a las del
  //   aparato (las que están en la cola).
  // op.decisiones: lo que el docente ya respondió, { 'clave:<alumno>': clave | 'nueva' }.
  async function preparar(api, aulaId, op) {
    op = op || {};
    if (!op.claves) throw aviso('Para preparar las claves de familia se necesita señal.');
    var dec = op.decisiones || {};
    var owner = M._nube.uid();
    if (!owner) throw new Error('sin cuenta');
    async function id() { return uuidDe(await sha(owner + '|' + Array.prototype.join.call(arguments, '|'))); }

    // Las fichas que ya hay: las de la base y las que esperan en la cola.
    var familias = (op.familias || []).filter(function (f) { return !f.deleted_at; }).concat(api.lista('familias'));
    var conFicha = {};
    var idsFicha = {};
    var usadaPor = {};          // clave → alumno_id de la familia que ya la tiene
    familias.forEach(function (f) {
      conFicha[f.alumno_id] = 1;
      idsFicha[f.id] = 1;
      [f.clave, f.clave_siguiente].forEach(function (c) {
        c = normClave(c);
        if (c && !usadaPor[c]) usadaPor[c] = f.alumno_id;
      });
    });

    // Las claves de antes que todavía se pueden conservar.
    var archivo = [];
    // Filas, o el Map clave → nombre de clavesViejas() (de otra ventana o
    // contexto, «instanceof Map» no alcanza).
    var filasClaves = Array.isArray(op.claves) ? op.claves
      : Array.from(op.claves.entries(), function (x) { return { clave: x[0], nombre_alumno: x[1] }; });
    filasClaves.forEach(function (x) {
      var c = normClave(x.clave);
      if (!CONSERVABLE.test(c)) return;
      var nombre = String(x.nombre_alumno || '').trim();
      archivo.push({ clave: c, nombre: nombre, nn: norm(nombre), num: numDe(c), usada: usadaPor[c] || null });
    });
    archivo.sort(function (a, b) { return a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0; });

    // Todos los alumnos del docente: un nombre del archivo que es de OTRO
    // alumno suyo (de esta aula o de otra) no se le ofrece a este.
    var todos = api.lista('alumnos');
    var porNombre = {};
    todos.forEach(function (a) { var n = norm(a.nombre_completo); (porNombre[n] = porNombre[n] || []).push(a); });
    var alumnoPorId = {};
    todos.forEach(function (a) { alumnoPorId[a.id] = a; });
    var idFicha = {};
    for (var t = 0; t < todos.length; t++) idFicha[todos[t].id] = await id('familia', todos[t].id);
    function tieneFicha(a) { return !!(conFicha[a.id] || idsFicha[idFicha[a.id]]); }
    // Los que todavía no tienen ficha, en cualquier aula: si dos comparten
    // nombre o número, una clave sin dueño claro no es de ninguno a ciegas.
    var sinFicha = todos.filter(function (a) { return sigue(a) && !tieneFicha(a); });
    function cuantosConNombre(a) {
      var n = norm(a.nombre_completo);
      return sinFicha.filter(function (x) { return norm(x.nombre_completo) === n; }).length;
    }
    function otrosConNumero(a) {
      return sinFicha.filter(function (x) { return x.id !== a.id && x.num_lista != null && x.num_lista === a.num_lista; }).length;
    }
    function esDeOtro(k, a) {
      return k.nn && k.nn !== norm(a.nombre_completo) && !!porNombre[k.nn];
    }
    // Las claves que podrían ser de este alumno: las que tenían su nombre, y
    // las de su número de lista cuyo nombre no es de otro alumno suyo.
    function candidatas(a, tomadas) {
      var nn = norm(a.nombre_completo);
      var num = a.num_lista == null ? null : String(a.num_lista);
      return archivo.filter(function (k) {
        if (k.usada || tomadas[k.clave]) return false;
        if (k.nn && k.nn === nn) return true;
        return num !== null && k.num === num && !esDeOtro(k, a);
      });
    }

    var aula = api.lista('aulas', { id: aulaId })[0] || null;
    var lista = api.lista('alumnos', { aula_id: aulaId }).sort(function (a, b) {
      var x = a.num_lista == null ? 999 : a.num_lista;
      var y = b.num_lista == null ? 999 : b.num_lista;
      return x - y || String(a.nombre_completo).localeCompare(String(b.nombre_completo), 'es');
    });
    var plan = { aula_id: aulaId, aula: aula, filas: [], preguntas: [] };
    var tomadas = {};
    var porAlumno = {};

    // 1) Quien ya tiene ficha: «ya estaba». Quien ya no está en el aula, no
    //    se toca.
    lista.forEach(function (a) {
      var f = { alumno_id: a.id, id: idFicha[a.id], num_lista: a.num_lista, texto: a.nombre_completo, avisos: [] };
      if (tieneFicha(a)) f.estado = 'ya_estaba';
      else if (!sigue(a)) f.estado = 'fuera';
      else f.estado = 'por_ver';
      porAlumno[a.id] = f;
      plan.filas.push(f);
    });
    var porVer = plan.filas.filter(function (f) { return f.estado === 'por_ver'; });

    // 2) Lo que el docente ya respondió, si la clave sigue libre. La
    //    pregunta se queda a la vista, con su respuesta marcada, para poder
    //    cambiar de idea antes de guardar.
    porVer.forEach(function (f) {
      var r = dec['clave:' + f.alumno_id];
      if (!r) return;
      var a = alumnoPorId[f.alumno_id];
      var cand = candidatas(a, tomadas);
      var ok = r === 'nueva' || cand.some(function (k) { return k.clave === r; });
      if (!ok || !cand.length) return;
      preguntar(f, cand, textoPregunta(a, cand));
      f.estado = 'nuevo';
      f.respondida = true;
      if (r !== 'nueva') { f.clave = r; tomadas[r] = 1; }
    });

    // 3) Lo seguro, sin preguntar; lo dudoso, se pregunta.
    porVer.forEach(function (f) {
      if (f.estado !== 'por_ver') return;
      var a = alumnoPorId[f.alumno_id];
      var nn = norm(a.nombre_completo);
      var num = a.num_lista == null ? null : String(a.num_lista);
      var cand = candidatas(a, tomadas);
      var conNombre = cand.filter(function (k) { return k.nn === nn; });
      var sinNombre = cand.filter(function (k) { return !k.nn; });
      // Una sola clave con su nombre, y un solo alumno sin ficha con ese
      // nombre: es la suya.
      if (conNombre.length === 1 && cuantosConNombre(a) === 1) {
        var k = conNombre[0];
        // El nombre cuadra; el número de la clave también tiene que cuadrar.
        if (k.num === null || num === null || k.num === num) {
          f.estado = 'nuevo'; f.clave = k.clave; tomadas[k.clave] = 1;
          return;
        }
        return preguntar(f, [k], textoPregunta(a, [k]));
      }
      if (!cand.length) return nueva(f, a);
      if (!conNombre.length && cand.length === 1 && sinNombre.length === 1 && otrosConNumero(a) === 0) {
        f.estado = 'nuevo'; f.clave = cand[0].clave; tomadas[cand[0].clave] = 1;
        return;
      }
      // Dudas: el nombre no cuadra, hay varias, o el número se repite.
      preguntar(f, cand, textoPregunta(a, cand));
    });

    // La pregunta, en el tono de la importación (importar.js).
    function textoPregunta(a, cand) {
      var nn = norm(a.nombre_completo);
      var num = a.num_lista == null ? null : String(a.num_lista);
      if (cand.length > 1) {
        return 'En tus datos anteriores hay ' + cand.length + ' claves que podrían ser de esta familia: '
          + cand.map(function (x) { return bonita(x.clave) + ' (' + (x.nombre || 'sin nombre') + ')'; }).join(', ')
          + '. ¿Cuál es la suya?';
      }
      var c = cand[0];
      if (c.nn === nn && c.num !== null && num !== null && c.num !== num) {
        return 'En tus datos anteriores, la clave ' + bonita(c.clave) + ' era de ' + c.nombre + ', con el número ' + c.num
          + '. Ahora tiene el número ' + num + '. ¿Es la misma familia?';
      }
      if (c.nombre) return 'En tus datos anteriores, la clave ' + bonita(c.clave) + ' era de ' + c.nombre + '. ¿Es la misma familia?';
      return 'En tus datos anteriores, la clave ' + bonita(c.clave) + ' no tenía nombre y tienes más de un alumno con el número '
        + num + ' sin ficha. ¿Es de esta familia?';
    }

    function preguntar(f, cand, texto) {
      var k = 'clave:' + f.alumno_id;
      var una = cand.length === 1;
      f.estado = 'pregunta';
      f.pregunta = { clave: k, texto: texto, botones: cand.map(function (x) {
        return { etiqueta: una ? 'Sí' : bonita(x.clave), valor: x.clave };
      }).concat([{ etiqueta: una ? 'No, darle una nueva' : 'Ninguna, darle una nueva', valor: 'nueva' }]) };
      plan.preguntas.push(f.pregunta);
    }
    // Sin empareje: la base pone una clave nueva. Si la que tenía su nombre
    // ya abre OTRA familia, se dice de quién.
    function nueva(f, a) {
      var nn = norm(a.nombre_completo);
      var deOtra = archivo.filter(function (k) { return k.nn === nn && k.usada && k.usada !== a.id; })[0];
      if (deOtra) {
        var suyo = alumnoPorId[deOtra.usada];
        f.avisos.push('La clave ' + bonita(deOtra.clave) + ' ya es de la familia de ' + (suyo ? suyo.nombre_completo : 'otro alumno')
          + ': se le da una nueva');
      }
      f.estado = 'nuevo';
    }

    plan.filas.forEach(function (f) {
      if (f.estado === 'nuevo' && !f.clave) {
        f.tiraNueva = true;
        f.avisos.push('Se le da una clave nueva. Entrega tira nueva');
      }
    });
    plan.resumen = resumir(plan);
    return plan;
  }

  function resumir(plan) {
    var r = { nuevos: 0, conservan: 0, nuevas: 0, ya: 0, preguntas: 0, fuera: 0 };
    plan.filas.forEach(function (f) {
      if (f.estado === 'nuevo') { r.nuevos++; if (f.clave) r.conservan++; else r.nuevas++; }
      else if (f.estado === 'ya_estaba') r.ya++;
      else if (f.estado === 'pregunta') r.preguntas++;
      else if (f.estado === 'fuera') r.fuera++;
    });
    return r;
  }

  // ── Guardar lo confirmado ──────────────────────────────────────────────
  // Solo lo «nuevo». La clave se manda solo cuando se conserva; si no, la
  // base sortea una. El id de la operación sale del de la fila, como en
  // importar.js: la misma ficha anotada dos veces es la misma operación.
  async function guardar(api, plan) {
    var owner = M._nube.uid();
    if (!owner) throw new Error('sin cuenta');
    var n = 0;
    for (var i = 0; i < plan.filas.length; i++) {
      var f = plan.filas[i];
      if (f.estado !== 'nuevo') continue;
      // Otra vuelta del botón, u otra pestaña, ya la anotó: no se repite.
      if (api.lista('familias', { id: f.id })[0] || api.lista('familias', { alumno_id: f.alumno_id })[0]) continue;
      var fila = { id: f.id, aula_id: plan.aula_id, alumno_id: f.alumno_id };
      if (f.clave) fila.clave = f.clave;
      api.crear('familias', fila, { op_id: uuidDe(await sha(owner + '|op|familia|' + f.id)) });
      n++;
    }
    return { guardados: n };
  }

  M.clavesFamilia = { preparar: preparar, guardar: guardar, bonita: bonita };
})(window);
