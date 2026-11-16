/* =====================================================================
   M.E.T.A.S — js/datos/tiempo-real.js · lo de otro aparato, al momento
   ---------------------------------------------------------------------
   Mientras la app está abierta (03, 3.8):
     · de las tablas SIN dinero llega por Realtime un aviso de qué fila
       cambió; la fila se vuelve a leer por la API (lo que trae el aviso no
       se guarda, rev. 9); si la versión es mayor se reemplaza, si viene
       borrada se quita;
     · las tablas CON dinero no van por ahí (su evento traería el número
       como double): la base manda un toque SIN DATOS por el canal privado
       del docente, «docente:<su uid>», con la tabla y el id, y aquí se
       vuelve a leer esa fila en vd_<tabla>, con el dinero como texto.

   Al entrar, al volver la señal y al volver a la app: «ponerse al día»,
   lo cambiado desde la última hora de servidor vista, INCLUIDO lo borrado
   (updated_at > cursor − 2 minutos; lo repetido se descarta por versión).

   Realtime usa el RealtimeClient de supabase-js (js/vendor/supabase.min.js,
   solo esa parte: ver _dev/supabase-local/arma-supabase-js.sh) con la
   sesión puesta a mano.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};
  var nube = M._nube;
  var alm = M._almacen;

  var CON_DINERO = { pagos: 1, gastos: 1, gastos_docente: 1, reembolsos: 1, convocatoria_pagos: 1,
    colectas: 1, colecta_exenciones: 1, bienes: 1 };
  // Lo que es del corte 1 (08, 8.1). Lo de cortes siguientes se agrega aquí
  // el día de su corte.
  var TABLAS = ['aulas', 'periodos', 'asignaturas', 'alumnos', 'familias', 'colectas', 'colecta_exenciones',
    'pagos', 'gastos', 'asistencia_dias', 'asistencia', 'inasistencias_oficiales', 'notas', 'notas_personalidad',
    'controles', 'control_valores', 'observaciones', 'avisos', 'aviso_destinatarios', 'gastos_docente', 'reembolsos'];
  var SOLAPE_MS = 2 * 60 * 1000;
  var POR_PAGINA = 1000;

  var cliente = null;
  var cuenta = null;
  var alDia = null;

  function avisar(tabla, id) {
    if (M._cola) M._cola.avisar(tabla, id);
  }
  function guardar(owner, tabla, fila) {
    if (fila && alm.guardarFila(owner, tabla, fila)) avisar(tabla, fila.id);
  }

  async function toque(owner, p) {
    if (!p || !p.tabla || !p.id || nube.uid() !== owner || !CON_DINERO[p.tabla]) return;
    try {
      var filas = await nube.leer('vd_' + p.tabla + '?id=eq.' + encodeURIComponent(p.id) + '&select=*');
      if (filas[0]) guardar(owner, p.tabla, filas[0]);
    } catch (e) {
      // Sin señal justo ahora: lo trae «ponerse al día» al volver.
    }
  }

  // Un aviso de Realtime de una tabla sin dinero (rev. 9): lo que trae NO se
  // guarda. Solo dice «cambió tal fila», y la fila se vuelve a leer por la
  // API, con la sesión y la RLS de siempre. Así el canal no es una puerta de
  // entrada de datos: aunque llegara algo que no debía, aquí no se guarda
  // nada que la base no entregue por la vía normal. Los avisos de un mismo
  // momento se juntan en una sola lectura por tabla.
  var porReleer = {};
  var releyendo = null;
  function cambioDeFila(owner, tabla, aviso) {
    if (nube.uid() !== owner || !aviso || !aviso.id || CON_DINERO[tabla] || TABLAS.indexOf(tabla) < 0) return;
    (porReleer[tabla] = porReleer[tabla] || {})[aviso.id] = 1;
    if (!releyendo) releyendo = setTimeout(function () { releer(owner); }, 150);
  }
  async function releer(owner) {
    var pedidas = porReleer;
    porReleer = {};
    releyendo = null;
    for (var tabla in pedidas) {
      var ids = Object.keys(pedidas[tabla]);
      for (var i = 0; i < ids.length; i += 100) {
        var tanda = ids.slice(i, i + 100);
        try {
          var filas = await nube.leer(tabla + '?id=in.(' + tanda.map(encodeURIComponent).join(',') + ')&select=*');
          if (nube.uid() !== owner) return;
          filas.forEach(function (f) { guardar(owner, tabla, f); });
        } catch (e) {
          // Sin señal justo ahora: lo trae «ponerse al día» al volver.
        }
      }
    }
  }

  function conectar(owner) {
    desconectar();
    var Realtime = w.supabase && w.supabase.RealtimeClient;
    if (typeof Realtime !== 'function') return;
    var s = nube.sesion();
    if (!s) return;
    cuenta = owner;
    cliente = new Realtime(nube.url.replace(/^http/i, 'ws') + '/realtime/v1', { params: { apikey: nube.llave } });
    cliente.setAuth(s.access_token);
    var reconexiones = 0;
    cliente.channel('docente:' + owner, { config: { private: true } })
      .on('broadcast', { event: 'cambio' }, function (m) { toque(owner, m.payload); })
      .subscribe(function (estado) {
        // Si se cayó y volvió, pudo perderse algo: ponerse al día.
        if (estado === 'SUBSCRIBED' && reconexiones++ > 0) ponerseAlDia(owner);
      });
    cliente.channel('metas-filas:' + owner)
      .on('postgres_changes', { event: '*', schema: 'metas' }, function (p) { cambioDeFila(owner, p.table, p.new); })
      .subscribe();
  }

  function desconectar() {
    if (!cliente) return;
    try {
      cliente.removeAllChannels();
      cliente.disconnect();
    } catch (e) { /* ya estaba cerrado */ }
    cliente = null;
    cuenta = null;
  }

  // La sesión se renovó: Realtime sigue con la nueva.
  nube.alCambiarSesion(function (s) {
    if (cliente && s && s.uid === cuenta) {
      try { cliente.setAuth(s.access_token); } catch (e) { /* se reconecta solo */ }
    }
  });

  function restarSolape(iso) {
    var t = Date.parse(iso);
    return isNaN(t) ? iso : new Date(t - SOLAPE_MS).toISOString();
  }

  // De a mil filas, en orden de (hora, id). Por hora sola no alcanza: lo
  // que se escribe en una misma transacción (mil pagos de una carga) lleva
  // la MISMA hora, y la página siguiente volvería a empezar en esa hora sin
  // pasar nunca de ahí.
  async function traerTabla(owner, tabla) {
    var llave = 'cursor|' + owner + '|' + tabla;
    var cursor = alm.meta(llave);
    var fuente = CON_DINERO[tabla] ? 'vd_' + tabla : tabla;
    var mayor = cursor || null;
    // La primera vez, solo lo activo; después, también lo borrado.
    var filtro = cursor ? 'updated_at=gte.' + encodeURIComponent(restarSolape(cursor)) : 'deleted_at=is.null';
    var tras = null;
    for (var vuelta = 0; vuelta < 500; vuelta++) {
      var q = fuente + '?select=*&' + filtro + '&order=updated_at.asc,id.asc&limit=' + POR_PAGINA;
      if (tras) {
        q += '&or=' + encodeURIComponent('(updated_at.gt."' + tras.t + '",and(updated_at.eq."' + tras.t + '",id.gt.' + tras.id + '))');
      }
      var filas = await nube.leer(q);
      if (nube.uid() !== owner) return;
      filas.forEach(function (f) {
        guardar(owner, tabla, f);
        if (!mayor || f.updated_at > mayor) mayor = f.updated_at;
      });
      if (filas.length < POR_PAGINA) break;
      var ultima = filas[filas.length - 1];
      tras = { t: ultima.updated_at, id: ultima.id };
    }
    if (mayor && mayor !== cursor) alm.ponerMeta(llave, mayor);
  }

  function ponerseAlDia(owner) {
    if (alDia && alDia.owner === owner) return alDia.promesa;
    var promesa = (async function () {
      for (var i = 0; i < TABLAS.length; i++) {
        if (nube.uid() !== owner) return;
        try {
          await traerTabla(owner, TABLAS[i]);
        } catch (e) {
          if (e && (e.tipo === 'red' || e.tipo === 'sesion')) return;   // se sigue la próxima vez
        }
      }
    })();
    alDia = { owner: owner, promesa: promesa };
    promesa.then(fin, fin);
    function fin() { if (alDia && alDia.promesa === promesa) alDia = null; }
    return promesa;
  }

  M._tiempoReal = {
    conectar: conectar,
    desconectar: desconectar,
    ponerseAlDia: ponerseAlDia,
    tablas: TABLAS.slice(),
  };
})(window);
