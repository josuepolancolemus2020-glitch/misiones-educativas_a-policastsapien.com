/* =====================================================================
   M.E.T.A.S — js/datos/claves-familia.js · preparar las fichas de familia
   ---------------------------------------------------------------------
   Un aula traída de un archivo sin familias deja a los alumnos sin fila en
   metas.familias, y sin esa fila no hay tira en el talonario. El botón
   «Preparar claves de familia» le crea la ficha a cada alumno activo que no
   la tiene, siempre con una clave NUEVA.

     preparar(api, aulaId, op)  cuántas fichas se crean y cuántos ya tenían
                                la suya. No guarda nada.
     guardar(api, plan)         lo «nuevo» entra a la cola con
                                api.crear('familias', …), como la importación.
     bonita(clave)              la clave como se lee: 15-K7QM o K7QMX-4PA2B.

   No se conservan claves viejas (decisión de Josué, cierre de año): el
   empareje con metas.claves_archivo confundía más de lo que ayudaba. Por eso
   el insert NUNCA lleva el campo clave: la base sortea una de 10 símbolos
   (metas.t_clave_familia). La importación (importar.js) sigue igual.

   Esto NO es metas.familias_preparar_claves_nuevas: aquella pone la tira
   siguiente a fichas que ya existen; esta crea las fichas que faltan.

   Los ids salen del contenido, igual que en importar.js (owner + familia +
   alumno), y la operación también: tocar dos veces, otro aparato, o importar
   después un archivo con esa familia, cae en la MISMA fila (índice
   familias_alumno_unica y la llave primaria). No toca dinero.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  // Lo que la base acepta como clave conservada (nº de lista + 4) y como
  // clave nueva (10 símbolos sin I, O, 0 ni 1). Las conservadas que ya se
  // entregaron se siguen mostrando en la lista.
  var CONSERVADA = /^[0-9]{1,2}[A-Z0-9]{4}$/;
  var NUEVA = /^[A-HJ-NP-Z2-9]{10}$/;

  function normClave(c) {
    return String(c == null ? '' : c).toUpperCase().replace(/[^0-9A-Z]/g, '');
  }
  function bonita(c) {
    var k = normClave(c);
    if (NUEVA.test(k)) return k.slice(0, 5) + '-' + k.slice(5);
    if (CONSERVADA.test(k)) return k.slice(0, k.length - 4) + '-' + k.slice(k.length - 4);
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
  // op.familias: las fichas del docente leídas de la base. Se suman a las
  //   del aparato (las que esperan en la cola). Sin ellas (sin señal) no se
  //   arma nada: una ficha creada en otro aparato no se vería.
  async function preparar(api, aulaId, op) {
    op = op || {};
    if (!op.familias) throw aviso('Para preparar las claves de familia se necesita señal.');
    var owner = M._nube.uid();
    if (!owner) throw new Error('sin cuenta');

    var conFicha = {};
    var idsFicha = {};
    op.familias.filter(function (f) { return !f.deleted_at; }).concat(api.lista('familias')).forEach(function (f) {
      conFicha[f.alumno_id] = 1;
      idsFicha[f.id] = 1;
    });

    var plan = { aula_id: aulaId, filas: [] };
    var lista = api.lista('alumnos', { aula_id: aulaId });
    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      var id = uuidDe(await sha(owner + '|familia|' + a.id));
      // Quien ya no está en el aula y no tiene ficha no se toca.
      var estado = conFicha[a.id] || idsFicha[id] ? 'ya_estaba' : sigue(a) ? 'nuevo' : 'fuera';
      plan.filas.push({ alumno_id: a.id, id: id, estado: estado });
    }
    plan.resumen = plan.filas.reduce(function (r, f) {
      if (f.estado === 'nuevo') r.nuevos++;
      else if (f.estado === 'ya_estaba') r.ya++;
      return r;
    }, { nuevos: 0, ya: 0 });
    return plan;
  }

  // ── Guardar lo confirmado ──────────────────────────────────────────────
  // Solo lo «nuevo», sin clave: la pone la base. El id de la operación sale
  // del de la fila, como en importar.js: la misma ficha anotada dos veces es
  // la misma operación.
  async function guardar(api, plan) {
    var owner = M._nube.uid();
    if (!owner) throw new Error('sin cuenta');
    var n = 0;
    for (var i = 0; i < plan.filas.length; i++) {
      var f = plan.filas[i];
      if (f.estado !== 'nuevo') continue;
      // Otra vuelta del botón, u otra pestaña, ya la anotó: no se repite.
      if (api.lista('familias', { id: f.id })[0] || api.lista('familias', { alumno_id: f.alumno_id })[0]) continue;
      api.crear('familias', { id: f.id, aula_id: plan.aula_id, alumno_id: f.alumno_id },
        { op_id: uuidDe(await sha(owner + '|op|familia|' + f.id)) });
      n++;
    }
    return { guardados: n };
  }

  // ── Compartir la clave con la familia ──────────────────────────────────
  // El mensaje que el docente copia o manda por WhatsApp. Solo el PRIMER
  // nombre (ni apellidos, ni notas, ni dinero): el mensaje puede quedar en
  // el teléfono de cualquiera. Nada de esto se guarda ni pasa por la base.
  var PORTAL = 'https://metas.policastsapien.com/padres.html';
  function mensaje(nombreCompleto, claveBonita) {
    var primero = String(nombreCompleto == null ? '' : nombreCompleto).trim().split(/\s+/)[0] || '';
    return 'Clave de familia de ' + primero + ' en M.E.T.A.S: ' + claveBonita + '\n'
      + 'Entre aquí y escríbala: ' + PORTAL + '\n'
      + 'No la comparta con nadie.';
  }
  // Sin número: el docente elige el contacto en su WhatsApp.
  function enlaceWhatsApp(texto) {
    return 'https://wa.me/?text=' + encodeURIComponent(texto);
  }

  M.clavesFamilia = { preparar: preparar, guardar: guardar, bonita: bonita, mensaje: mensaje, enlaceWhatsApp: enlaceWhatsApp };
})(window);
