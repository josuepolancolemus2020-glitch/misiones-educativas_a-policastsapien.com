/* =====================================================================
   M.E.T.A.S — js/datos/nube.js · la conexión con la base
   ---------------------------------------------------------------------
   Lo único que sabe hablar con Supabase. El docente entra por la función
   metas-entrar con su correo y su contraseña de siempre, y de ahí sale
   SOLO una sesión (02, 2.3): la contraseña no se guarda en ningún lado.

   Cada petición lleva:
     · la sesión (Authorization) y la llave pública (apikey);
     · x-metas-aparato: un uuid por instalación, para saber desde qué
       aparato se anotó cada cosa (queda en la auditoría);
     · x-metas-op: la operación de la cola que la manda. La base la anota
       como op_creacion de la fila; así un reenvío se reconoce como el
       MISMO dato (03, 3.3).

   La dirección de la base va escrita aquí y en ningún otro lado. Solo en
   pruebas, y solo en 127.0.0.1 o localhost, se toma de
   window.__METAS_NUBE_DE_PRUEBA__ (CONTRATO.md). Nunca de localStorage:
   con eso se podía mandar la sesión de un docente a un servidor ajeno
   (02, 2.6).

   Lo que se guarda en el aparato (02, 2.6):
     sb-<proyecto>-auth-token  la sesión (token, no contraseña)
     METAS_APARATO_ID          el uuid de este aparato
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  var URL_REAL = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  var LLAVE_REAL = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';

  function config() {
    var h = w.location && w.location.hostname;
    var p = w.__METAS_NUBE_DE_PRUEBA__;
    if ((h === '127.0.0.1' || h === 'localhost') && p && p.url && p.llavePublica) {
      return { url: String(p.url).replace(/\/+$/, ''), llave: String(p.llavePublica) };
    }
    return { url: URL_REAL, llave: LLAVE_REAL };
  }
  var CFG = config();
  var LLAVE_SESION = 'sb-' + new URL(CFG.url).hostname.split('.')[0] + '-auth-token';

  // ── Lo poco que va en localStorage (puede fallar en modo privado) ──────
  function leerLocal(k) {
    try { return w.localStorage.getItem(k); } catch (e) { return null; }
  }
  function ponerLocal(k, v) {
    try { if (v === null) w.localStorage.removeItem(k); else w.localStorage.setItem(k, v); } catch (e) { /* se sigue en memoria */ }
  }

  var aparatoId = leerLocal('METAS_APARATO_ID');
  if (!aparatoId || !/^[0-9a-f-]{36}$/.test(aparatoId)) {
    aparatoId = M.ids.nuevo();
    ponerLocal('METAS_APARATO_ID', aparatoId);
  }

  // ── Errores, en tres clases que la cola trata distinto ─────────────────
  //   red:    no hubo respuesta (o fue del servidor, 5xx): se reintenta igual
  //   sesion: la sesión ya no sirve y no se pudo renovar: se pausa y se pide
  //           la contraseña
  //   base:   la base dijo que no (un error de verdad, con su código)
  function error(tipo, extra) {
    var e = new Error(tipo + (extra && extra.mensaje ? ': ' + extra.mensaje : ''));
    e.tipo = tipo;
    if (extra) for (var k in extra) e[k] = extra[k];
    return e;
  }

  // ── La sesión ──────────────────────────────────────────────────────────
  var sesion = null;
  var oyentesSesion = [];

  function uidDe(token) {
    try {
      var p = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (p.length % 4) p += '=';
      return JSON.parse(decodeURIComponent(escape(w.atob(p)))).sub || null;
    } catch (e) {
      return null;
    }
  }

  // deOtra: la sesión llegó de otra pestaña del mismo aparato, que ya la
  // guardó; aquí solo se toma, sin volver a guardarla ni a repartirla.
  function fijarSesion(s, deOtra) {
    sesion = s;
    if (!deOtra) ponerLocal(LLAVE_SESION, s ? JSON.stringify(s) : null);
    oyentesSesion.forEach(function (f) { try { f(s, !!deOtra); } catch (e) { /* un oyente roto no tumba la sesión */ } });
  }

  function retomar() {
    var t = leerLocal(LLAVE_SESION);
    if (!t) return null;
    try {
      var s = JSON.parse(t);
      if (s && s.access_token && s.refresh_token) {
        s.uid = s.uid || uidDe(s.access_token);
        sesion = s.uid ? s : null;
      }
    } catch (e) {
      sesion = null;
    }
    return sesion;
  }

  async function llamar(url, opciones) {
    // Copia: no se le pisa el objeto a quien llamó, por si lo reutiliza.
    var op = {};
    if (opciones) for (var k in opciones) op[k] = opciones[k];
    // La caché HTTP del navegador también devolvía la lectura de antes
    // (Supabase manda max-age). Aunque el service worker ya no la guarde,
    // sin esto el aparato seguía releyendo la fila vieja.
    op.cache = 'no-store';
    try {
      return await w.fetch(url, op);
    } catch (e) {
      throw error('red', { mensaje: String(e && e.message || e) });
    }
  }

  // Una sola renovación a la vez: si diez peticiones ven el token vencido,
  // las diez esperan la misma. Y una sola pestaña renueva: la líder (rev. 9).
  // Supabase entrega una llave de renovación NUEVA cada vez y la vieja deja
  // de servir; si dos pestañas renovaban, la segunda usaba la llave ya gastada
  // y se quedaba pidiendo la contraseña sin motivo. Las demás piden a la
  // líder y reciben la sesión nueva por el canal entre pestañas.
  var renovando = null;
  function esperarSesionNueva(vieja) {
    return new Promise(function (ok, mal) {
      var listo = false;
      var f = function (s) {
        if (listo || s === vieja) return;
        listo = true;
        if (s) ok(s); else mal(error('sesion'));
      };
      oyentesSesion.push(f);
      if (M._almacen) M._almacen.enviar({ t: 'renovar' });
      setTimeout(function () { if (!listo) { listo = true; mal(error('red')); } }, 15000);
    });
  }
  function renovar() {
    if (renovando) return renovando;
    var s = sesion;
    if (M._almacen && !M._almacen.esLider()) {
      renovando = esperarSesionNueva(s);
      renovando.then(function () { renovando = null; }, function () { renovando = null; });
      return renovando;
    }
    renovando = (async function () {
      if (!s) throw error('sesion');
      var r = await llamar(CFG.url + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { apikey: CFG.llave, 'content-type': 'application/json' },
        body: JSON.stringify({ refresh_token: s.refresh_token }),
      });
      // 5xx, 429 (demasiados intentos) y 408 (tardó): falta de red o de
      // servidor, no una sesión mala. Se reintenta; la sesión no se cierra.
      if (r.status >= 500 || r.status === 429 || r.status === 408) {
        await r.arrayBuffer().catch(function () {});
        throw error('red', { status: r.status });
      }
      var j = await r.json().catch(function () { return {}; });
      if (!r.ok || !j.access_token) {
        // Otra cuenta pudo haber entrado mientras tanto: no se le borra.
        if (sesion === s) fijarSesion(null);
        throw error('sesion', { status: r.status });
      }
      var nueva = {
        access_token: j.access_token, refresh_token: j.refresh_token,
        expires_at: j.expires_at || (Math.floor(Date.now() / 1000) + (j.expires_in || 3600)),
        uid: uidDe(j.access_token), nombre: s.nombre, rol: s.rol,
      };
      if (sesion === s) fijarSesion(nueva);
      return nueva;
    })();
    renovando.then(limpiar, limpiar);
    function limpiar() { renovando = null; }
    return renovando;
  }

  async function token() {
    if (!sesion) throw error('sesion');
    if (sesion.expires_at && sesion.expires_at - 60 < Date.now() / 1000) await renovar();
    return sesion.access_token;
  }

  // ── Peticiones a la API ────────────────────────────────────────────────
  // Devuelve { status, datos } si la base respondió (aunque sea con un
  // error de la base, 4xx); lanza 'red' o 'sesion' si no.
  async function peticion(metodo, ruta, op) {
    op = op || {};
    for (var intento = 0; intento < 2; intento++) {
      var t = await token();
      var cab = {
        apikey: CFG.llave,
        authorization: 'Bearer ' + t,
        'accept-profile': 'metas',
        'x-metas-aparato': aparatoId,
      };
      if (metodo !== 'GET') {
        cab['content-type'] = 'application/json';
        cab['content-profile'] = 'metas';
      }
      if (op.prefer) cab.prefer = op.prefer;
      if (op.opId) cab['x-metas-op'] = op.opId;
      var r = await llamar(CFG.url + '/rest/v1/' + ruta, {
        method: metodo, headers: cab, body: op.cuerpo === undefined ? undefined : JSON.stringify(op.cuerpo),
      });
      if (r.status === 401 && intento === 0) {
        await r.arrayBuffer().catch(function () {});
        await renovar();
        continue;
      }
      if (r.status === 401) throw error('sesion', { status: 401 });
      if (r.status >= 500 || r.status === 408 || r.status === 429) {
        await r.arrayBuffer().catch(function () {});
        throw error('red', { status: r.status });
      }
      var texto = await r.text().catch(function () { return ''; });
      var datos = null;
      try { datos = texto ? JSON.parse(texto) : null; } catch (e) { datos = texto; }
      return { status: r.status, ok: r.ok, datos: datos };
    }
    throw error('sesion');
  }

  async function rpc(nombre, args, opId) {
    var r = await peticion('POST', 'rpc/' + nombre, { cuerpo: args || {}, opId: opId });
    if (!r.ok) throw error('base', { status: r.status, codigo: r.datos && r.datos.code, mensaje: r.datos && r.datos.message });
    return r.datos;
  }

  async function leer(ruta) {
    var r = await peticion('GET', ruta);
    if (!r.ok) throw error('base', { status: r.status, codigo: r.datos && r.datos.code, mensaje: r.datos && r.datos.message });
    return Array.isArray(r.datos) ? r.datos : [];
  }

  // ── Entrar y salir ─────────────────────────────────────────────────────
  async function entrar(correo, clave) {
    var r;
    try {
      r = await w.fetch(CFG.url + '/functions/v1/metas-entrar', {
        method: 'POST',
        headers: { apikey: CFG.llave, 'content-type': 'application/json', 'x-metas-aparato': aparatoId },
        body: JSON.stringify({ correo: correo, clave: clave }),
      });
    } catch (e) {
      return { ok: false, motivo: 'sin_senal' };
    }
    var j = await r.json().catch(function () { return {}; });
    if (r.status === 200 && j.ok && j.access_token) {
      var uid = uidDe(j.access_token);
      if (!uid) return { ok: false, motivo: 'reintentar' };
      fijarSesion({
        access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at,
        uid: uid, nombre: j.nombre || null, rol: j.rol || 'docente',
      });
      return { ok: true };
    }
    if (r.status === 401) return { ok: false, motivo: 'datos' };
    if (r.status === 429) return { ok: false, motivo: 'espera' };
    return { ok: false, motivo: 'reintentar' };
  }

  M._nube = {
    url: CFG.url,
    llave: CFG.llave,
    aparato: function () { return aparatoId; },
    retomar: retomar,
    sesion: function () { return sesion; },
    uid: function () { return sesion ? sesion.uid : null; },
    token: token,
    renovar: renovar,
    alCambiarSesion: function (f) { oyentesSesion.push(f); },
    olvidarSesion: function () { fijarSesion(null); },
    // La sesión que guardó otra pestaña (al entrar, al renovar o al salir).
    tomarDeOtra: function (s) {
      if (s) s.uid = s.uid || uidDe(s.access_token);
      fijarSesion(s && s.uid ? s : null, true);
    },
    entrar: entrar,
    peticion: peticion,
    rpc: rpc,
    leer: leer,
  };
})(window);
