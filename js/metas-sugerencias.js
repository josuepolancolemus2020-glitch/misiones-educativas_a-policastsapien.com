/* =====================================================================
   M.E.T.A.S — metas-sugerencias.js
   El puente del botón «💬 Sugerencias» de las misiones.

   POR QUÉ EXISTE ESTE ARCHIVO
   ---------------------------
   El botón de sugerencias lleva tiempo dentro de cada misión y le dice
   al alumno «tu mensaje ayuda a mejorar M.E.T.A.S». Lo que hacía de
   verdad era guardarlo en el almacén de ESE teléfono y nada más: para
   leerlo había que abrir la Evidencia de misiones en el mismo aparato,
   o sea, en el aparato del niño que escribió. Nadie lo leyó nunca.

   Un botón que promete y guarda en un cajón cerrado es peor que no
   tener botón: quien lo usó se queda tranquilo creyendo que avisó, y la
   errata sigue ahí el año siguiente.

   Este archivo cierra el cable: manda esas sugerencias a la aplicación
   privada de la familia (F.A.R.O), que es donde las lee el
   administrador del proyecto. La pantalla de la misión no cambia y el
   registro local sigue siendo el mismo: esto solo AÑADE la salida.

   POR QUÉ SE MANDAN A OTRO PROYECTO DE SUPABASE
   ---------------------------------------------
   Los resultados de las evaluaciones van al proyecto de M.E.T.A.S
   (metas-supabase.js) porque los consulta el maestro. Las sugerencias
   no: las lee el administrador, y el administrador trabaja en F.A.R.O.
   Es el mismo camino que ya hace `buzon.html` con el Buzón del lector,
   y la clave publicable de ese proyecto ya viaja en este repositorio
   por esa misma razón.

   Se hace en un archivo aparte —y no metiendo 'sugerencia' en los TIPOS
   de metas-supabase.js— porque son DOS DESTINOS DISTINTOS. Meterlos en
   la misma cola obligaría a partirla por destino en cada envío, y esa
   cola es la que lleva las notas de los alumnos: no se toca para
   añadir un camino nuevo.

   NUNCA SE PIERDE
   ---------------
   Sin internet no se bloquea nada. Lo escrito ya está guardado en el
   registro local antes de llegar aquí; esta capa lleva su propia cola
   y reintenta al abrir la siguiente misión, al recuperar la conexión y
   al cerrar la página.

   Lo carga solo metas-registro.js; las misiones NO tienen que
   incluirlo.
   ===================================================================== */
(function () {
  'use strict';

  /* El proyecto de F.A.R.O. La clave es «publicable»: va en el
     navegador porque así se diseña, y lo que la vuelve segura es que la
     seguridad por fila está cerrada y la única puerta abierta es la
     función de enviar, que solo sabe escribir. Con esta clave no se
     puede leer una sugerencia, ni contarlas, ni saber si existen. */
  var SB_URL = 'https://bzrnjvalpwlcnpszvwim.supabase.co';
  var SB_KEY = 'sb_publishable_74mJW5LoxPZOWtIi7YrBEw_0y9JjSfM';
  try {
    SB_URL = localStorage.getItem('METAS_SUG_SB_URL') || SB_URL;
    SB_KEY = localStorage.getItem('METAS_SUG_SB_KEY') || SB_KEY;
  } catch (e) {}

  var CLAVE_COLA = 'METAS_SUG_OUTBOX_V1';
  var CLAVE_BACKFILL = 'METAS_SUG_BACKFILL_V1';
  var MIN_TEXTO = 5;     // el mismo mínimo que hace cumplir el servidor
  var MAX_COLA = 60;     // tope de seguridad para no llenar localStorage

  // ---------- la cola ----------
  function leerCola() {
    try { var a = JSON.parse(localStorage.getItem(CLAVE_COLA)); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function escribirCola(filas) {
    if (filas.length > MAX_COLA) filas = filas.slice(filas.length - MAX_COLA);
    try { localStorage.setItem(CLAVE_COLA, JSON.stringify(filas)); return true; }
    catch (e) {
      try { localStorage.setItem(CLAVE_COLA, JSON.stringify(filas.slice(20))); return true; }
      catch (e2) { return false; }
    }
  }

  /* El título de la misión se toma AQUÍ, mientras la página está
     abierta, y no al enviar: un mensaje escrito sin señal se manda tres
     días después desde otra misión, y para entonces el título de la
     pantalla sería el de la otra. Lo mismo con la dirección. */
  function tituloMision() {
    var t = (document.title || '').replace(/^[^\wÁÉÍÓÚÑáéíóúñ]+/, '').trim();
    return t.slice(0, 140);
  }

  function fila(ev) {
    return {
      evento_id: ev.id,
      categoria: ev.categoria || 'idea',
      texto: String(ev.texto || '').slice(0, 500),
      mision: ev.mision || '',
      mision_titulo: ev.mision_titulo || tituloMision(),
      seccion: ev.seccion || '',
      url: ev.url || (location.pathname || ''),
      alumno: ev.alumno || '',
      grado: ev.grado || '',
      escuela: ev.escuela || '',
      docente: ev.docente || '',
      codigo_aula: ev.codigo_aula || '',
      dispositivo: ev.disp || '',
      escrito_at: ev.t || null
    };
  }

  function encolar(ev) {
    if (!ev || ev.tipo !== 'sugerencia' || !ev.id) return;
    if (String(ev.texto || '').trim().length < MIN_TEXTO) return;
    var cola = leerCola();
    for (var i = 0; i < cola.length; i++) { if (cola[i].evento_id === ev.id) return; }
    cola.push(fila(ev));
    escribirCola(cola);
    programar();
  }

  /* Primera vez: las sugerencias que ya estaban atrapadas en este
     aparato. No es un adorno de migración —es el motivo por el que
     este archivo se escribió—: todo lo que alguien escribió hasta hoy
     está ahí y nadie lo ha leído. Se manda una sola vez; el servidor
     deduplica por evento_id, así que aunque se corriera dos veces no
     saldrían mensajes gemelos.

     Aquí NO se puede saber el título ni la dirección de la misión de
     cada mensaje viejo (se escribieron en otra página, quizá hace
     meses). Van sin ellos a propósito: la bandeja de F.A.R.O enseña
     entonces la carpeta de la misión, que se entiende de sobra, y eso
     es infinitamente mejor que dejarlos donde están. */
  function backfill() {
    try {
      if (localStorage.getItem(CLAVE_BACKFILL) === '1') return;
      var eventos = [];
      try { eventos = JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || []; } catch (e) {}
      if (Array.isArray(eventos)) {
        var cola = leerCola();
        var enCola = {};
        cola.forEach(function (f) { enCola[f.evento_id] = 1; });
        eventos.forEach(function (ev) {
          if (!ev || ev.tipo !== 'sugerencia' || !ev.id || enCola[ev.id]) return;
          if (String(ev.texto || '').trim().length < MIN_TEXTO) return;
          var f = fila(ev);
          f.mision_titulo = '';   // no se puede saber: ver la nota de arriba
          f.url = '';
          cola.push(f);
        });
        escribirCola(cola);
      }
      localStorage.setItem(CLAVE_BACKFILL, '1');
    } catch (e) {}
  }

  // ---------- el envío ----------
  /* Se manda de uno en uno. Son mensajes escritos a mano por una
     persona: en un aparato normal hay dos o tres, no doscientos, y un
     lote suelto ahorraría una décima de segundo a cambio de no poder
     distinguir cuál de ellos fue el rechazado. */
  var enCurso = false;

  function enviarUno(f) {
    return fetch(SB_URL + '/rest/v1/rpc/faro_metas_sugerencia_enviar', {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_evento_id: f.evento_id,
        p_categoria: f.categoria,
        p_texto: f.texto,
        p_mision: f.mision,
        p_mision_titulo: f.mision_titulo,
        p_seccion: f.seccion,
        p_url: f.url,
        p_alumno: f.alumno,
        p_grado: f.grado,
        p_escuela: f.escuela,
        p_docente: f.docente,
        p_codigo_aula: f.codigo_aula,
        p_dispositivo: f.dispositivo,
        p_escrito_at: f.escrito_at
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* Qué se hace con la respuesta. Hay CUATRO finales y son distintos:

     · entró            → fuera de la cola;
     · no y nunca va a entrar (texto de tres letras, sin identificador)
                        → fuera de la cola TAMBIÉN, porque reintentarlo
                          es dar vueltas hasta el fin de los tiempos;
     · no, hoy no (el freno del día, o no contestó el servidor)
                        → se queda entero y se para la tanda: si este
                          aparato está frenado, los de detrás también;
     · se atragantó con ESTE mensaje (motivo «error»)
                        → ver la nota de abajo. Es el que muerde.

     Sin esta distinción la cola o se atasca con basura o tira mensajes
     buenos, y las dos cosas se descubren tarde. */
  var DEFINITIVOS = { corto: 1, sin_id: 1 };
  var MAX_INTENTOS = 5;

  /* El mensaje atragantado, y por qué tiene tratamiento propio.

     La cola se manda SIEMPRE desde el principio, y si el primero no
     sale, se para la tanda. Para el freno eso está bien —está frenado
     el aparato entero—, pero para un mensaje que el servidor no logra
     tragar es la peor avería posible: ese mensaje se queda de tapón y
     TODOS los de detrás no salen nunca. Y como nadie mira esta cola,
     no se enteraría nadie: el aparato seguiría diciendo «va camino al
     equipo» y no llegaría ni uno más. Justo lo que este archivo vino a
     arreglar, otra vez y peor, porque ahora estaría escondido.

     Así que un «error» no para la tanda: cuenta un intento y manda el
     mensaje al FINAL de la cola, para que los de detrás pasen. A los
     cinco intentos se tira. Perder uno duele; perderlos todos y en
     silencio, mucho más. */
  function alFinal(f, cola) {
    f.intentos = (f.intentos || 0) + 1;
    var resto = cola.filter(function (x) { return x.evento_id !== f.evento_id; });
    return f.intentos >= MAX_INTENTOS ? resto : resto.concat([f]);
  }

  function sincronizar(opciones) {
    opciones = opciones || {};
    var quedan = function () { return { enviadas: 0, pendientes: leerCola().length }; };
    if (!SB_URL || !SB_KEY || typeof fetch !== 'function' || enCurso) return Promise.resolve(quedan());
    if (navigator.onLine === false) return Promise.resolve(quedan());
    var cola = leerCola();
    if (!cola.length) return Promise.resolve(quedan());

    enCurso = true;
    var f = cola[0];
    return enviarUno(f)
      .then(function (j) {
        var motivo = (j && j.motivo) || '';
        var fuera = !!(j && j.ok) || !!DEFINITIVOS[motivo];
        if (fuera) {
          escribirCola(leerCola().filter(function (x) { return x.evento_id !== f.evento_id; }));
        } else if (motivo === 'error') {
          escribirCola(alFinal(f, leerCola()));
        }
        enCurso = false;
        // El freno (y el «error», que ya se apartó): se para y ya seguirá
        if (!fuera) return quedan();
        if (opciones.unaSola) return { enviadas: 1, pendientes: leerCola().length };
        if (!leerCola().length) return { enviadas: 1, pendientes: 0 };
        return sincronizar(opciones).then(function (r2) {
          return { enviadas: 1 + r2.enviadas, pendientes: r2.pendientes };
        });
      })
      .catch(function () { enCurso = false; return quedan(); });
  }

  var timer = null;
  function programar() {
    if (timer) clearTimeout(timer);
    /* Cuatro segundos, no cero: quien acaba de escribir una sugerencia
       muchas veces recuerda algo y manda otra seguida. Así salen las
       dos en la misma tanda. */
    timer = setTimeout(function () { timer = null; sincronizar(); }, 4000);
  }

  // ---------- conexiones ----------
  // metas-registro.js emite este evento por cada registro nuevo
  document.addEventListener('metas:registro', function (e) {
    if (e && e.detail && e.detail.tipo === 'sugerencia') encolar(e.detail);
  });
  window.addEventListener('online', function () { sincronizar(); });
  /* Al cerrar solo se intenta UNA. keepalive tiene un tope de tamaño y
     el navegador corta lo que sigue sin avisar; lo que quede se manda
     al abrir la siguiente misión, que es lo que de verdad sostiene
     esto. */
  window.addEventListener('pagehide', function () { sincronizar({ unaSola: true }); });

  // ---------- API pública (la usa la sonda) ----------
  window.METAS_SUG = {
    version: 1,
    url: SB_URL,
    pendientes: function () { return leerCola().length; },
    cola: leerCola,
    sincronizar: sincronizar
  };

  backfill();
  /* Siete segundos después de abrir: primero que la misión termine de
     pintarse. El alumno viene a leer, no a que su teléfono hable con un
     servidor. */
  setTimeout(function () { sincronizar(); }, 7000);
})();
