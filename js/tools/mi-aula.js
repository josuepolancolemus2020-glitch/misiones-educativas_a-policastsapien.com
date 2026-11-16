/* =====================================================================
   M.E.T.A.S — js/tools/mi-aula.js · Mi aula del corte 1, sobre filas
   ---------------------------------------------------------------------
   La forma de trabajar es la de la Mi aula de siempre (registros-admin.js
   en main), que los maestros ya dominan; lo que cambia es de dónde salen
   los datos (una fila por dato, por MetasDatos) y cómo se ve:

     · arriba, los grupos como pastillas («6º-1», «+ Otro grupo») y debajo
       las secciones con su ícono: Alumnos, Economía, Asistencia, Equipos,
       Controles, Acumulativos, Notas SACE, Estadísticas, Lectura y
       Comunicados;
     · cuadrícula de UN TOQUE por número de lista en Asistencia (todos
       presentes de entrada; un toque, la falta), en las colectas (un toque,
       el monto completo; solo un monto distinto abre una cajita; quitar un
       pago pregunta con dos botones) y en Controles (toque pone ✓, otro
       toque la quita);
     · Notas SACE con parcial y sección como interruptores grandes, la
       tabla con la columna de alumnos fija y las notas por color de nivel.

   Lo que todavía no pasó a filas (Equipos, Acumulativos, Estadísticas,
   Lectura, Gastos de mi bolsillo, Inventario) abre la pantalla de antes,
   hasta su corte (08, 8.2). Lo que se imprime sale de las MISMAS funciones
   de main, sin tocarlas: js/tools/mi-aula-papel.js les arma los datos.

   De la conexión, solo el punto gris sin señal. Nada técnico: ni
   «guardado», ni «al día», ni contadores (09-INTERFAZ.md). Los elementos
   que tocan las pruebas llevan data-metas (CONTRATO-PANTALLA.md). Al
   docente, de tú (regla 12).
   ===================================================================== */
(function () {
  'use strict';

  // Las diez secciones, en el orden de siempre. «vieja»: la pestaña de la
  // pantalla de antes que la atiende mientras no pase a filas.
  var SECCIONES = [
    { k: 'alumnos', et: 'Alumnos', ic: '👥' },
    { k: 'economia', et: 'Economía', ic: '💰' },
    { k: 'asistencia', et: 'Asistencia', ic: '📋' },
    { k: 'equipos', et: 'Equipos', ic: '🤝', vieja: 'eq' },
    { k: 'controles', et: 'Controles', ic: '✅' },
    { k: 'acumulativos', et: 'Acumulativos', ic: '📝', vieja: 'acum' },
    { k: 'notas', et: 'Notas SACE', ic: '🧮' },
    { k: 'estadisticas', et: 'Estadísticas', ic: '📈', vieja: 'est' },
    { k: 'lectura', et: 'Lectura', ic: '📖', vieja: 'lec' },
    { k: 'comunicados', et: 'Comunicados', ic: '📣' },
  ];
  var PARCIALES = ['I', 'II', 'III', 'IV'];
  var SACE_VISTAS = [['aprov', '📚 Aprovechamiento'], ['pers', '🙂 Personalidad'], ['inasis', '📅 Inasistencias'],
    ['recup', '✍️ Recuperación']];
  var RASGOS = ['Puntualidad', 'Espíritu de trabajo', 'Orden y presentación', 'Sociabilidad', 'Moralidad'];
  var MATERIAS_DE_SIEMPRE = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas', 'Ciencias Sociales',
    'Ciencias Naturales', 'Educación Física', 'Educación Cívica'];
  var PLANTILLAS = [['📄', 'Entrega de ficha'], ['📗', 'Entrega de libro'], ['🍎', 'Merienda escolar'],
    ['🧰', 'Material solicitado'], ['✍️', 'Firma del padre'], ['🧾', 'Documento entregado']];
  var TIPOS_CONDUCTA = [['felicitacion', '⭐ Felicitación'], ['llamado', '📣 Llamado de atención'], ['leve', '⚠ Falta leve']];
  var AYUDA_SACE = {
    aprov: ['Elige el parcial arriba.', 'Escribe la nota de cada alumno y pasa a la siguiente con Enter.',
      'El color dice el nivel: rojo Inicial, amarillo Básico, azul Avanzado, verde Excelente.'],
    pers: ['Los cuatro parciales están a la vista.', 'Escribe la letra de la escala de tu grupo (S, MB, B).',
      'Una casilla vacía no se imprime.'],
    inasis: ['La del parcial va a la boleta.', 'La oficial del año va al Cuadro final.',
      'Si la dejas vacía, se usa lo que cuenta el pase de lista.'],
    recup: ['Solo se escribe donde el final del año quedó bajo 70.', 'El final es el promedio de los cuatro parciales.',
      'La nota de recuperación sale en el Cuadro final.'],
  };
  // Preferencia de vista: en su propia llave (regla 5), nunca en el aula.
  var PREF = 'METAS_MI_AULA_VISTA_V1';

  var d = null;
  var listo = null;
  var vista = leerPref();
  var colectaAbierta = null;
  var controlAbierto = null;
  var alumnoAbierto = null;
  var subAlumnos = '';           // '' o 'carga'
  var subComunicados = 'avisos';
  var otroMonto = false;         // el próximo toque abre la cajita en vez de anotar el monto completo
  var hoja = null;               // la cajita de un pago: { alumno, colecta }
  var preguntaLocal = null;      // pregunta de dos botones de la pantalla (reabrir, quitar un pago…)
  var reabriendo = null;
  var formGrupo = false;
  var formColecta = false;
  var formGasto = false;
  var ayudaSace = false;
  var cargaFilas = [];
  var cargaTexto = '';
  var avisoCarga = '';
  var porPintar = false;
  var tarjetaPintada = null;
  var excusas = {};              // por aula: { t, filas, buscando }
  var deMiAula = false;          // la pantalla de antes se abrió desde aquí

  function leerPref() {
    try { return JSON.parse(localStorage.getItem(PREF)) || {}; } catch (e) { return {}; }
  }
  function guardarPref() {
    try { localStorage.setItem(PREF, JSON.stringify(vista)); } catch (e) { /* solo es la vista */ }
  }
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hoy() {
    var f = new Date();
    return f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0');
  }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre',
    'noviembre', 'diciembre'];
  function fechaCorta(f) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || ''));
    return m ? m[3].replace(/^0/, '') + ' de ' + MESES[m[2] - 1] : '';
  }
  function L(m) {
    return m == null ? '—' : window.MetasDatos.montos.enLetras(m);
  }
  function grupo(a) {
    if (typeof window.adGradoSeccion === 'function') return window.adGradoSeccion(a.grado, a.seccion);
    return a.grado + 'º-' + a.seccion;
  }
  function num(a) { return a.num_lista == null ? '·' : String(a.num_lista); }
  function corto(a) { return String(a.nombre_completo || '').trim().split(/\s+/)[0] || ''; }
  function quien(a) { return '#' + num(a) + ' ' + corto(a); }
  function frase(e) {
    return e && e.paraElDocente ? e.message : 'Eso no se pudo anotar. Revisa lo que escribiste.';
  }
  function papel() { return window.metasMiAulaPapel; }

  // ── Lo que se ve ───────────────────────────────────────────────────────
  function aulas() {
    return d.lista('aulas').sort(function (a, b) {
      // Como en la Mi aula de siempre: el año más nuevo y, dentro, en el
      // orden en que el docente creó sus grupos.
      return (b.anio_lectivo || 0) - (a.anio_lectivo || 0)
        || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
    });
  }
  function aulaActual() {
    var todas = aulas();
    return todas.filter(function (a) { return a.id === vista.aula; })[0] || todas[0] || null;
  }
  function alumnos(aula) {
    return d.lista('alumnos', { aula_id: aula.id }).sort(function (a, b) {
      var x = a.num_lista == null ? 999 : a.num_lista;
      var y = b.num_lista == null ? 999 : b.num_lista;
      return x - y || String(a.nombre_completo).localeCompare(String(b.nombre_completo), 'es');
    });
  }
  function sigue(a) {
    return !a.estado || a.estado === 'activo' || a.estado === 'ingreso';
  }
  function enAula(aula) { return alumnos(aula).filter(sigue); }
  function colectas(aula) {
    // La más reciente arriba, como en «Mis colectas» de siempre.
    return d.lista('colectas', { aula_id: aula.id }).sort(function (a, b) {
      return String(b.fecha).localeCompare(String(a.fecha))
        || String(b.created_at || '').localeCompare(String(a.created_at || ''));
    });
  }
  function asignaturas(aula) {
    return d.lista('asignaturas', { aula_id: aula.id }).sort(function (a, b) {
      return (a.orden || 0) - (b.orden || 0) || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
    });
  }
  function seccion() {
    var k = vista.seccion;
    return SECCIONES.filter(function (s) { return s.k === k && !s.vieja; })[0] ? k : 'alumnos';
  }

  // ── Pintar ─────────────────────────────────────────────────────────────
  // Si el docente está escribiendo en un campo, no se le borra: se pinta al
  // soltarlo.
  function pedirPintar() {
    if (porPintar) return;
    porPintar = true;
    setTimeout(function () {
      porPintar = false;
      var raiz = document.getElementById('mi-aula');
      var foco = document.activeElement;
      if (raiz && foco && raiz.contains(foco) && /^(INPUT|TEXTAREA|SELECT)$/.test(foco.tagName)) {
        foco.addEventListener('blur', pedirPintar, { once: true });
      } else {
        pintar();
      }
      pintarTarjeta();
    }, 40);
  }

  function pintar() {
    var raiz = document.getElementById('mi-aula');
    if (!raiz || !d) return;
    var activa = document.getElementById('view-mi-aula');
    if (activa && !activa.classList.contains('active')) return;
    var aula = aulaActual();
    var sec = seccion();
    var h = pintarGrupos(aula);
    if (!aula || formGrupo) {
      h += pintarFormGrupo(!aula);
    }
    if (aula) {
      h += '<nav class="ma-secs" aria-label="Secciones de Mi aula">' + SECCIONES.map(function (s) {
        var on = s.k === sec;
        return '<button type="button" class="ma-sec' + (on ? ' ma-sec-on' : '') + '" data-sec="' + s.k + '" data-metas="ir-' + s.k
          + '" data-accion="seccion" data-valor="' + s.k + '"' + (on ? ' aria-current="page"' : '') + '>'
          + '<span class="ma-sec-ic" aria-hidden="true">' + s.ic + '</span><span>' + esc(s.et) + '</span></button>';
      }).join('') + '</nav>';
      var pant = sec === 'alumnos' && subAlumnos === 'carga' ? 'carga-rapida' : sec;
      h += '<section class="ma-pant" data-sec="' + sec + '" data-metas="pantalla-' + pant + '" aria-label="'
        + esc(SECCIONES.filter(function (s) { return s.k === sec; })[0].et) + '">' + PINTORES[sec](aula) + '</section>';
    }
    // Repintar no mueve la página: el maestro sigue donde tocó.
    var marco = raiz.closest('.view-scroll');
    var y = marco ? marco.scrollTop : 0;
    raiz.innerHTML = h;
    if (marco && marco.scrollTop !== y) marco.scrollTop = y;
  }

  function pintarGrupos(aula) {
    var todas = aulas();
    if (!todas.length) return '';
    var escuelas = {};
    todas.forEach(function (a) { escuelas[String(a.escuela || '').trim().toLowerCase()] = 1; });
    var verEsc = Object.keys(escuelas).length > 1;
    return '<div class="ma-grupos" role="group" aria-label="Mis grupos">' + todas.map(function (a) {
      var on = aula && a.id === aula.id;
      return '<button type="button" class="ma-grupo' + (on ? ' ma-grupo-on' : '') + '" data-metas="grupo" data-accion="aula" data-valor="'
        + esc(a.id) + '" aria-pressed="' + !!on + '" title="' + esc(grupo(a) + ' · ' + a.escuela) + '"><span class="ma-grupo-gs">'
        + esc(grupo(a)) + '</span>' + (verEsc ? '<span class="ma-grupo-esc">' + esc(a.escuela) + '</span>' : '') + '</button>';
    }).join('') + '<button type="button" class="ma-grupo ma-grupo-mas" data-metas="otro-grupo" data-accion="otro-grupo" aria-expanded="'
      + formGrupo + '">+ Otro grupo</button></div>';
  }

  function pintarFormGrupo(primero) {
    var a = aulaActual();
    return '<form class="ma-card ma-form" data-form="aula" data-metas="form-grupo">'
      + '<h2 class="ma-h">' + (primero ? '🏫 Tu grupo' : '🏫 Otro grupo') + '</h2>'
      + '<p class="ma-nota">' + (primero ? 'Escribe los datos de tu grupo para empezar.'
        : 'Un grupo nuevo tiene su propia lista, economía, asistencia y notas.') + '</p>'
      + '<label class="ma-campo"><span>Escuela</span><input class="ma-inp" name="escuela" required maxlength="160" value="'
      + esc(a ? a.escuela : '') + '" autocomplete="off"></label>'
      + '<div class="ma-fila2"><label class="ma-campo"><span>Grado</span><input class="ma-inp" name="grado" inputmode="numeric" required placeholder="6"></label>'
      + '<label class="ma-campo"><span>Sección</span><input class="ma-inp" name="seccion" required maxlength="3" placeholder="1"></label></div>'
      + '<div class="ma-acciones"><button class="ma-btn ma-btn-1" type="submit">Crear el grupo</button>'
      + (primero ? '' : '<button class="ma-btn" type="button" data-accion="otro-grupo">Cancelar</button>') + '</div></form>';
  }

  // Una casilla de la cuadrícula de un toque. El estado se dice con ícono y
  // palabra además del color (regla 6).
  function casilla(o) {
    return '<button type="button" class="ma-ch ma-ch-' + o.estado + '" data-metas="' + o.metas + '" data-estado="' + o.estado
      + '" data-accion="' + o.accion + '" data-alumno="' + esc(o.alumno.id) + '"'
      + (o.pressed == null ? '' : ' aria-pressed="' + o.pressed + '"')
      + ' aria-label="' + esc('Número ' + num(o.alumno) + ', ' + o.alumno.nombre_completo + ': ' + o.dice) + '">'
      + '<span class="ma-ch-n">#' + esc(num(o.alumno)) + '</span>'
      + (o.ic ? '<span class="ma-ch-ic" aria-hidden="true">' + o.ic + '</span>' : '')
      + '<span class="ma-ch-nom">' + esc(corto(o.alumno)) + '</span>'
      + (o.pie ? '<span class="ma-ch-pie">' + esc(o.pie) + '</span>' : '') + '</button>';
  }

  // ── 👥 Alumnos ─────────────────────────────────────────────────────────
  function pintarAlumnos(aula) {
    if (subAlumnos === 'carga') return pintarCarga(aula);
    var lista = alumnos(aula);
    var h = '<div class="ma-card ma-card-grupo"><div><p class="ma-grupo-grande">' + esc(grupo(aula)) + '</p>'
      + '<p class="ma-nota">' + esc(aula.escuela) + ' · ' + esc(aula.anio_lectivo) + '</p></div>'
      + '<p class="ma-cifra" aria-label="' + enAula(aula).length + ' alumnos en el aula"><b>' + enAula(aula).length + '</b> en el aula</p></div>';
    h += '<div class="ma-card"><div class="ma-card-cab"><h2 class="ma-h">Mis alumnos</h2>'
      + '<button type="button" class="ma-btn" data-metas="ir-carga-rapida" data-accion="carga">📋 Pegar una lista</button></div>';
    if (!lista.length) h += '<p class="ma-nota">Todavía no hay alumnos. Escríbelos uno por uno o pega la lista completa.</p>';
    h += '<ul class="ma-lista">' + lista.map(function (a) {
      var abierto = alumnoAbierto === a.id;
      var r = '<li class="ma-al' + (sigue(a) ? '' : ' ma-al-fuera') + '" data-metas="alumno">'
        + '<button type="button" class="ma-al-btn" data-accion="alumno" data-valor="' + esc(a.id) + '" aria-expanded="' + abierto + '">'
        + '<span class="ma-num">' + esc(num(a)) + '</span><span class="ma-nom">' + esc(a.nombre_completo) + '</span>'
        + (sigue(a) ? '' : '<span class="ma-etq">' + esc(nombreEstado(a.estado)) + '</span>')
        + '<span class="ma-flecha" aria-hidden="true">›</span></button>';
      if (abierto) {
        r += '<div class="ma-al-edit" role="group" aria-label="Situación de ' + esc(a.nombre_completo) + '">'
          + ['activo', 'retirado', 'trasladado', 'desertor'].map(function (e) {
            var on = (a.estado || 'activo') === e;
            return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="estado" data-alumno="'
              + esc(a.id) + '" data-valor="' + e + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + esc(nombreEstado(e)) + '</button>';
          }).join('') + '</div>';
      }
      return r + '</li>';
    }).join('') + '</ul>';
    h += '<form class="ma-en-linea" data-form="alumno"><label class="ma-oculto" for="ma-nuevo-al">Nombre completo</label>'
      + '<input class="ma-inp" id="ma-nuevo-al" name="nombre" placeholder="Nombre completo de otro alumno" required minlength="3" maxlength="120" autocomplete="off">'
      + '<button class="ma-btn ma-btn-1" type="submit">Agregar</button></form></div>';
    return h;
  }
  function nombreEstado(e) {
    return { activo: 'En el aula', ingreso: 'Ingresó', retirado: 'Retirado', trasladado: 'Trasladado', desertor: 'Desertor' }[e] || e;
  }

  function pintarCarga() {
    return '<button type="button" class="ma-volver" data-accion="alumnos">‹ Mis alumnos</button>'
      + '<form class="ma-card ma-form" data-form="carga-vista"><h2 class="ma-h">📋 Pegar una lista</h2>'
      + '<label class="ma-campo"><span>Un nombre por renglón. Si tienes la identidad, va al final del renglón.</span>'
      + '<textarea class="ma-inp" name="pegado" rows="8" data-metas="carga-pegar">' + esc(cargaTexto) + '</textarea></label>'
      + '<div class="ma-acciones"><button class="ma-btn" type="submit" data-metas="carga-vista-previa">Ver cómo queda</button></div></form>'
      + (avisoCarga ? '<p class="ma-nota ma-nota-ok" role="status">' + esc(avisoCarga) + '</p>' : '')
      + (cargaFilas.length ? '<div class="ma-card"><ol class="ma-lista ma-lista-previa">' + cargaFilas.map(function (f) {
        return '<li class="ma-renglon" data-metas="carga-fila"><span class="ma-nom">' + esc(f.nombre) + '</span>'
          + (f.identidad ? '<span class="ma-sub">' + esc(f.identidad) + '</span>' : '') + '</li>';
      }).join('') + '</ol></div>' : '')
      + '<div class="ma-acciones"><button type="button" class="ma-btn ma-btn-1" data-metas="carga-guardar" data-accion="carga-guardar"'
      + (cargaFilas.length ? '' : ' disabled') + '>Agregar a la lista</button></div>';
  }

  // ── 💰 Economía ────────────────────────────────────────────────────────
  function resumenDe(col) { return d.lista('v_colectas_resumen', { colecta_id: col.id })[0] || {}; }
  function pct(res) { return res.esperados ? Math.min(100, Math.round(res.pagaron * 100 / res.esperados)) : 0; }
  function barra(p, alto) {
    return '<span class="ma-barra' + (alto ? ' ma-barra-alta' : '') + '" role="img" aria-label="Participación ' + p + ' %">'
      + '<span class="ma-barra-lleno" style="width:' + p + '%"></span></span>';
  }

  function pintarEconomia(aula) {
    if (colectaAbierta) {
      var col = d.lista('colectas', { id: colectaAbierta })[0];
      if (col) return pintarColecta(aula, col);
      colectaAbierta = null;
    }
    var lista = colectas(aula);
    var h = '<div class="ma-puertas">'
      + '<button type="button" class="ma-puerta" data-accion="vieja" data-valor="eco" data-sub="gastos" data-metas="ir-gastos-bolsillo">'
      + '<span class="ma-puerta-ic" aria-hidden="true">🧾</span><span class="ma-puerta-t"><b>Gastos de mi bolsillo</b>'
      + '<span>Copias, un flete, materiales: anótalo y cóbralo</span></span><span class="ma-flecha" aria-hidden="true">›</span></button>'
      + '<button type="button" class="ma-puerta" data-accion="vieja" data-valor="eco" data-sub="inv" data-metas="ir-inventario">'
      + '<span class="ma-puerta-ic" aria-hidden="true">📦</span><span class="ma-puerta-t"><b>Inventario del aula</b>'
      + '<span>Lo tuyo y lo de la escuela, con acta firmada</span></span><span class="ma-flecha" aria-hidden="true">›</span></button></div>';
    h += '<div class="ma-card"><h2 class="ma-h">Colaboraciones y acuerdos</h2>'
      + '<p class="ma-nota">Cada acuerdo de reunión es una colecta: se marca quién dio, se anotan los gastos y el saldo queda claro.</p>';
    if (formColecta) {
      h += '<form class="ma-form ma-form-dentro" data-form="colecta">'
        + '<label class="ma-campo"><span>¿Cuál es el acuerdo?</span><input class="ma-inp" name="concepto" required minlength="3" maxlength="120" placeholder="Aporte día del niño" autocomplete="off"></label>'
        + '<div class="ma-fila2"><label class="ma-campo"><span>Aporte por alumno (L)</span><input class="ma-inp" name="monto" inputmode="decimal" required placeholder="50"></label>'
        + '<label class="ma-campo"><span>Fecha</span><input class="ma-inp" type="date" name="fecha" value="' + hoy() + '" required></label></div>'
        + '<div class="ma-acciones"><button class="ma-btn ma-btn-1" type="submit">Crear la colecta</button>'
        + '<button class="ma-btn" type="button" data-accion="nueva-colecta">Cancelar</button></div></form>';
    } else {
      h += '<div class="ma-acciones"><button type="button" class="ma-btn ma-btn-1" data-accion="nueva-colecta" data-metas="nueva-colecta">➕ Nueva colecta o acuerdo</button></div>';
    }
    h += '</div>';
    if (lista.length) {
      h += '<div class="ma-card"><h2 class="ma-h">🗂️ Mis colectas</h2><div class="ma-colectas">' + lista.map(function (c) {
        var res = resumenDe(c);
        var p = pct(res);
        return '<button type="button" class="ma-colecta" data-metas="colecta" data-estado="' + esc(c.estado) + '" data-accion="colecta" data-valor="'
          + esc(c.id) + '"><span class="ma-colecta-t"><b>' + esc(c.concepto) + '</b>'
          + (c.estado === 'cerrada' ? '<span class="ma-etq">🔒 Cerrada</span>' : '') + '</span>'
          + '<span class="ma-sub">' + esc(fechaCorta(c.fecha)) + ' · ' + (res.pagaron || 0) + '/' + (res.esperados == null ? '·' : res.esperados)
          + ' dieron (' + p + ' %) · saldo ' + L(res.saldo) + '</span>' + barra(p) + '<span class="ma-flecha" aria-hidden="true">›</span></button>';
      }).join('') + '</div>'
        + '<div class="ma-imprimir"><button type="button" class="ma-btn" data-accion="imprimir" data-valor="ingresos">🖨️ Cuadro de ingresos</button>'
        + '<button type="button" class="ma-btn" data-accion="imprimir" data-valor="egresos">🖨️ Cuadro de egresos</button>'
        + '<button type="button" class="ma-btn" data-accion="imprimir" data-valor="talonario">🎟️ Talonario por alumno</button></div>'
        + '<p class="ma-nota">Para Dirección. Ingresos lleva nombres: no es para el grupo de padres.</p></div>';
    }
    return h;
  }

  function pintarColecta(aula, col) {
    var res = resumenDe(col);
    var p = pct(res);
    var porAlumno = {};
    d.lista('v_colecta_alumnos', { colecta_id: col.id }).forEach(function (x) { porAlumno[x.alumno_id] = x; });
    var lista = enAula(aula);
    var faltan = lista.filter(function (a) {
      var x = porAlumno[a.id];
      return x && (x.situacion === 'debe' || x.situacion === 'abono');
    });
    var cerrada = col.estado === 'cerrada';
    var h = '<button type="button" class="ma-volver" data-accion="colectas">‹ Mis colectas</button>';
    h += '<div class="ma-card" data-metas="pantalla-colecta"><div class="ma-card-cab"><div><h2 class="ma-h ma-h-grande">' + esc(col.concepto)
      + (cerrada ? ' <span class="ma-etq">🔒 Cerrada</span>' : '') + '</h2><p class="ma-nota">' + esc(fechaCorta(col.fecha))
      + ' · aporte <b>' + L(col.monto_sugerido) + '</b></p></div></div>';
    h += '<dl class="ma-cifras">'
      + cifra('Dieron', (res.pagaron || 0) + '/' + (res.esperados == null ? '·' : res.esperados))
      + cifra('Participación', p + ' %')
      + cifra('Recaudado', L(res.recaudado))
      + cifra('Falta por recaudar', L(res.falta_total))
      + cifra('Gastado', L(res.gastado))
      + cifra('Saldo', L(res.saldo)) + '</dl>' + barra(p, true);
    h += faltan.length
      ? '<details class="ma-faltan" data-metas="faltan"><summary>⏳ Faltan por dar: <b data-metas="faltan-n">' + faltan.length + '</b> · ver quiénes</summary>'
        + '<p class="ma-nota">Solo lo ves tú.</p><ol class="ma-faltan-lista">' + faltan.map(function (a) {
          var x = porAlumno[a.id];
          return '<li><b>#' + esc(num(a)) + '</b> ' + esc(a.nombre_completo) + (x.situacion === 'abono' ? ' · falta ' + L(x.falta) : '') + '</li>';
        }).join('') + '</ol></details>'
      : '<p class="ma-faltan ma-faltan-ok" data-metas="faltan">🎉 Ya dieron todos.</p>';
    h += '<div class="ma-cuadri-cab"><p class="ma-nota">Toca a quien dio el aporte completo.</p>'
      + '<button type="button" class="ma-btn ma-btn-chico' + (otroMonto ? ' ma-on' : '') + '" data-metas="otro-monto" data-accion="otro-monto" aria-pressed="'
      + otroMonto + '">✎ Otro monto</button></div>';
    h += '<div class="ma-cuadri" role="group" aria-label="Quién dio">' + lista.map(function (a) {
      var x = porAlumno[a.id] || {};
      var s = x.situacion;
      var estado = s === 'pagado' ? 'dio' : s === 'pago_de_mas' ? 'dio' : s === 'abono' ? 'abono'
        : s === 'no_corresponde' ? 'exento' : s === 'por_aclarar' ? 'aclarar' : 'debe';
      var dice = estado === 'dio' ? 'dio ' + L(x.pagado) : estado === 'abono' ? 'abonó ' + L(x.pagado) + ', falta ' + L(x.falta)
        : estado === 'exento' ? 'no le corresponde' : estado === 'aclarar' ? 'monto por aclarar' : 'todavía no ha dado';
      return casilla({
        metas: 'pago-alumno', accion: 'pago-alumno', alumno: a, estado: estado, dice: dice,
        ic: estado === 'dio' ? '✓' : estado === 'abono' ? '½' : estado === 'exento' ? '—' : '',
        pie: estado === 'dio' || estado === 'abono' ? L(x.pagado) : estado === 'exento' ? 'No le toca' : '',
      });
    }).join('') + '</div></div>';
    var gastos = d.lista('gastos', { colecta_id: col.id }).sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
    h += '<div class="ma-card" data-metas="gastos"><h2 class="ma-h">🧾 Gastos de esta colecta</h2>'
      + (gastos.length ? '<ul class="ma-filas">' + gastos.map(function (g) {
        return '<li class="ma-fila"><span>' + esc(fechaCorta(g.fecha)) + ' · ' + esc(g.concepto) + '</span><b>' + L(g.monto) + '</b></li>';
      }).join('') + '</ul>' : '<p class="ma-nota">Sin gastos todavía.</p>')
      + (formGasto
        ? '<form class="ma-form ma-form-dentro" data-form="gasto" data-colecta="' + esc(col.id) + '">'
          + '<label class="ma-campo"><span>¿En qué se gastó?</span><input class="ma-inp" name="concepto" required minlength="3" maxlength="160" autocomplete="off"></label>'
          + '<div class="ma-fila2"><label class="ma-campo"><span>Cuánto (L)</span><input class="ma-inp" name="monto" inputmode="decimal" required></label>'
          + '<label class="ma-campo"><span>¿Qué día salió el dinero?</span><input class="ma-inp" type="date" name="fecha" value="' + hoy() + '" max="' + hoy() + '" required></label></div>'
          + '<div class="ma-acciones"><button class="ma-btn ma-btn-1" type="submit">Anotar el gasto</button>'
          + '<button class="ma-btn" type="button" data-accion="nuevo-gasto">Cancelar</button></div></form>'
        : '<div class="ma-acciones"><button type="button" class="ma-btn" data-accion="nuevo-gasto" data-metas="nuevo-gasto">➕ Anotar gasto</button>'
          + (cerrada
            ? '<button type="button" class="ma-btn" data-accion="reabrir" data-valor="' + esc(col.id) + '">Reabrir la colecta</button>'
            : '<button type="button" class="ma-btn" data-accion="cerrar" data-valor="' + esc(col.id) + '">🔒 Cerrar la colecta</button>')
          + '</div>')
      + '</div>';
    return h;
  }
  function cifra(et, v) { return '<div class="ma-cifra-t"><dt>' + esc(et) + '</dt><dd>' + esc(v) + '</dd></div>'; }

  // ── 📋 Asistencia ──────────────────────────────────────────────────────
  var ASIS = {
    presente: { ic: '', dice: 'presente. Toca para marcar la falta', pie: '' },
    ausente: { ic: '🚫', dice: 'faltó. Toca para ponerle excusa', pie: 'Faltó' },
    excusa: { ic: '📝', dice: 'con excusa. Toca para dejarlo presente', pie: 'Excusa' },
    tarde: { ic: '⏱', dice: 'llegó tarde. Toca para dejarlo presente', pie: 'Tarde' },
  };
  function fechaAsis() {
    var f = vista.fecha && /^\d{4}-\d{2}-\d{2}$/.test(vista.fecha) ? vista.fecha : hoy();
    return f > hoy() ? hoy() : f;
  }
  function pintarAsistencia(aula) {
    var fecha = fechaAsis();
    var marcas = {};
    d.lista('asistencia', { aula_id: aula.id, fecha: fecha }).forEach(function (x) { marcas[x.alumno_id] = x; });
    var lista = enAula(aula);
    var aus = 0;
    var exc = 0;
    lista.forEach(function (a) {
      var m = marcas[a.id];
      if (m && m.estado === 'ausente') aus++;
      if (m && m.estado === 'excusa') exc++;
    });
    var hay = lista.some(function (a) { return marcas[a.id]; });
    var h = '<div class="ma-card"><div class="ma-card-cab"><h2 class="ma-h">Pase de lista</h2>'
      + '<label class="ma-fecha"><span>Día</span><input type="date" class="ma-inp" data-accion="fecha" value="' + esc(fecha)
      + '" max="' + hoy() + '"></label></div>'
      + '<p class="ma-cuenta" data-metas="asis-cuenta" aria-live="polite">' + (hay
        ? '🚫 <b>' + aus + '</b> ' + (aus === 1 ? 'faltó' : 'faltaron') + ' · 📝 <b>' + exc + '</b> con excusa'
        : '✅ Todos presentes este día.') + '</p>'
      + '<p class="ma-nota">Toca solo a los que faltaron. Otro toque: con excusa. Otro más: presente.</p>'
      + '<div class="ma-cuadri" role="group" aria-label="Pase de lista del ' + esc(fechaCorta(fecha)) + '">' + lista.map(function (a) {
        var m = marcas[a.id];
        var e = m ? m.estado : 'presente';
        var x = ASIS[e] || ASIS.presente;
        return casilla({ metas: 'asistencia-alumno', accion: 'asis', alumno: a, estado: e, dice: x.dice, ic: x.ic, pie: x.pie });
      }).join('') + '</div>'
      + (hay ? '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="todos-presentes" data-accion="todos-presentes">✓ Todos presentes este día</button></div>' : '')
      + '</div>';
    h += '<div class="ma-card"><h2 class="ma-h">📨 Excusas de las familias</h2><div data-metas="excusas">' + pintarExcusas(aula, marcasDe(aula)) + '</div></div>';
    return h;
  }
  function marcasDe(aula) {
    var m = {};
    d.lista('asistencia', { aula_id: aula.id }).forEach(function (x) { m[x.alumno_id + '|' + x.fecha] = x; });
    return m;
  }

  // Las excusas que mandan las familias por el asistente («[EXCUSA fecha]
  // razón») viven en su buzón, que es de ellas y no pasa a filas (07, 7.3).
  // Aquí solo se leen con sus claves; aprobar una sí es una fila del aula:
  // asistencia con estado «excusa» y la razón como justificación.
  function pintarExcusas(aula, marcas) {
    var e = excusas[aula.id];
    if (!e || Date.now() - e.t > 60000) buscarExcusas(aula);
    var filas = e ? e.filas : [];
    if (!filas.length) return '<p class="ma-nota">Cuando una familia avise una falta, aparece aquí para que la apruebes.</p>';
    var porId = {};
    alumnos(aula).forEach(function (a) { porId[a.id] = a; });
    return '<ul class="ma-filas">' + filas.slice(0, 25).map(function (x) {
      var a = porId[x.alumno_id];
      if (!a) return '';
      var m = marcas[x.alumno_id + '|' + x.fecha];
      var lista = m && m.estado === 'excusa';
      return '<li class="ma-fila ma-fila-excusa"><span><b>' + esc(quien(a)) + '</b> · faltó el ' + esc(fechaCorta(x.fecha))
        + '<br><span class="ma-sub">«' + esc(x.razon) + '»</span></span>'
        + (lista ? '<span class="ma-etq ma-etq-ok">✓ Aprobada</span>'
          : '<button type="button" class="ma-btn ma-btn-chico" data-accion="aprobar-excusa" data-alumno="' + esc(a.id) + '" data-fecha="'
            + esc(x.fecha) + '" data-razon="' + esc(x.razon) + '">Aprobar</button>') + '</li>';
    }).join('') + '</ul>';
  }
  function buscarExcusas(aula) {
    var e = excusas[aula.id] || (excusas[aula.id] = { t: 0, filas: [] });
    if (e.buscando || !window.MetasDatos || !window.MetasDatos._nube || navigator.onLine === false) return;
    var deClave = {};
    d.lista('familias', { aula_id: aula.id }).forEach(function (f) {
      // El buzón viejo conoce la clave como se entregó: «1-K7QM».
      var c = String(f.clave || '');
      var m = /^(\d{1,2})([A-Z0-9]{4})$/.exec(c);
      if (c) deClave[m ? m[1] + '-' + m[2] : c] = f.alumno_id;
    });
    var claves = Object.keys(deClave);
    if (!claves.length) { e.t = Date.now(); return; }
    e.buscando = true;
    var nube = window.MetasDatos._nube;
    fetch(nube.url + '/rest/v1/rpc/metas_buzon_docente', {
      method: 'POST',
      headers: { apikey: nube.llave, authorization: 'Bearer ' + nube.llave, 'content-type': 'application/json' },
      body: JSON.stringify({ p_codigos: claves }),
    }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }).then(function (rows) {
      var filas = [];
      (Array.isArray(rows) ? rows : []).forEach(function (m) {
        var x = /^\[EXCUSA (\d{4}-\d{2}-\d{2})\]\s*([\s\S]*)$/.exec(String(m.texto || ''));
        if (x && deClave[m.codigo]) filas.push({ alumno_id: deClave[m.codigo], fecha: x[1], razon: (x[2] || '').trim() || 'Sin razón' });
      });
      filas.sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
      excusas[aula.id] = { t: Date.now(), filas: filas, buscando: false };
      pedirPintar();
    });
  }

  // ── ✅ Controles ───────────────────────────────────────────────────────
  function marcasControl(c) {
    var m = {};
    d.lista('control_valores', { control_id: c.id }).forEach(function (v) { m[v.alumno_id] = v; });
    return m;
  }
  function pintarControles(aula) {
    var lista = d.lista('controles', { aula_id: aula.id }).sort(function (a, b) {
      return String(b.fecha || '').localeCompare(String(a.fecha || '')) || String(b.created_at || '').localeCompare(String(a.created_at || ''));
    });
    var c = lista.filter(function (x) { return x.id === controlAbierto; })[0];
    if (c) return pintarControl(aula, c);
    var total = enAula(aula).length;
    var h = '<div class="ma-card"><h2 class="ma-h">Controles del aula</h2>'
      + '<p class="ma-nota">Lo que se anota a diario y no es dinero ni nota. Toca una etiqueta para crear el control de hoy:</p>'
      + '<div class="ma-pastillas">' + PLANTILLAS.map(function (p, i) {
        return '<button type="button" class="ma-pastilla" data-accion="plantilla" data-valor="' + i + '">' + p[0] + ' ' + esc(p[1]) + '</button>';
      }).join('') + '</div>'
      + '<form class="ma-en-linea" data-form="control"><label class="ma-oculto" for="ma-nuevo-ctrl">Otro control</label>'
      + '<input class="ma-inp" id="ma-nuevo-ctrl" name="nombre" placeholder="Otro: ¿qué vas a revisar?" required minlength="3" maxlength="120" autocomplete="off">'
      + '<button class="ma-btn ma-btn-1" type="submit" data-metas="nuevo-control">Crear</button></form></div>';
    if (lista.length) {
      h += '<div class="ma-card"><h2 class="ma-h">🗂️ Mis controles</h2><div class="ma-colectas">' + lista.map(function (x) {
        var m = marcasControl(x);
        var hechos = enAula(aula).filter(function (a) { return m[a.id] && m[a.id].marcado; }).length;
        return '<button type="button" class="ma-colecta" data-metas="control" data-accion="control" data-valor="' + esc(x.id) + '">'
          + '<span class="ma-colecta-t"><b>' + esc((x.icono ? x.icono + ' ' : '') + x.nombre) + '</b></span>'
          + '<span class="ma-sub">' + esc(fechaCorta(x.fecha)) + ' · ' + hechos + '/' + total + ' anotados'
          + (total - hechos ? ' · faltan ' + (total - hechos) : ' · completo') + '</span>'
          + '<span class="ma-flecha" aria-hidden="true">›</span></button>';
      }).join('') + '</div></div>';
    }
    return h;
  }
  function pintarControl(aula, c) {
    var m = marcasControl(c);
    var lista = enAula(aula);
    var faltan = lista.filter(function (a) { return !(m[a.id] && m[a.id].marcado); });
    var hechos = lista.length - faltan.length;
    return '<button type="button" class="ma-volver" data-accion="controles">‹ Mis controles</button>'
      + '<div class="ma-card"><h2 class="ma-h ma-h-grande">' + esc((c.icono ? c.icono + ' ' : '') + c.nombre) + '</h2>'
      + '<p class="ma-nota">' + esc(fechaCorta(c.fecha)) + '</p>'
      + '<p class="ma-cuenta" data-metas="control-cuenta" aria-live="polite">✅ Anotados: <b>' + hechos + '/' + lista.length + '</b> · ⏳ Faltan: <b>'
      + faltan.length + '</b></p>'
      + '<div class="ma-cuadri" role="group" aria-label="Quién cumplió">' + lista.map(function (a) {
        var on = !!(m[a.id] && m[a.id].marcado);
        return casilla({ metas: 'control-alumno', accion: 'marca', alumno: a, estado: on ? 'si' : 'no', pressed: on,
          dice: on ? 'anotado' : 'sin anotar', ic: on ? '✓' : '', pie: '' });
      }).join('') + '</div>'
      + '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="marcar-todos" data-accion="marcar-todos">✅ Marcar a todos</button>'
      + '<button type="button" class="ma-btn" data-metas="quitar-marcas" data-accion="quitar-marcas">🧹 Quitar todas las marcas</button></div>'
      + '<p class="ma-nota">Si casi todos cumplieron, marca a todos y quita solo a los que faltaron.</p></div>'
      + (faltan.length ? '<div class="ma-card"><h2 class="ma-h">⏳ Todavía faltan (' + faltan.length + ')</h2><p class="ma-nota">'
        + faltan.map(function (a) { return esc(quien(a)); }).join(' · ') + '</p></div>' : '');
  }

  // ── 🧮 Notas SACE ──────────────────────────────────────────────────────
  function claseNota(v) {
    var t = String(v == null ? '' : v).trim();
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(t)) return '';
    var n = parseFloat(t);         // una nota de 0 a 100, no dinero: la regla 19 no aplica
    if (n < 1 || n > 100) return '';
    return n < 70 ? 'nt-i' : n < 80 ? 'nt-b' : n <= 90 ? 'nt-a' : 'nt-e';
  }
  function pintarNotas(aula) {
    var parcial = PARCIALES.indexOf(vista.parcial) >= 0 ? vista.parcial : 'I';
    var sv = vista.saceVista && SACE_VISTAS.some(function (v) { return v[0] === vista.saceVista; }) ? vista.saceVista : 'aprov';
    var asig = asignaturas(aula);
    var h = '<div class="ma-card ma-card-sace">'
      + '<div class="ma-seg-fila"><span class="ma-seg-et" id="ma-seg-parcial">Parcial</span>'
      + (sv === 'pers' || sv === 'recup'
        ? '<p class="ma-nota">' + (sv === 'recup' ? 'Al final del año, después del Parcial IV.' : 'Los cuatro parciales están a la vista.') + '</p>'
        : '<div class="ma-seg" role="group" aria-labelledby="ma-seg-parcial">' + PARCIALES.map(function (p) {
          return '<button type="button" class="ma-seg-btn" data-metas="parcial" data-accion="parcial" data-valor="' + p + '" aria-pressed="'
            + (p === parcial) + '">' + p + '</button>';
        }).join('') + '</div>') + '</div>'
      + '<div class="ma-seg-fila"><span class="ma-seg-et" id="ma-seg-vista">Sección</span><div class="ma-seg ma-seg-ancho" role="group" aria-labelledby="ma-seg-vista">'
      + SACE_VISTAS.map(function (v) {
        return '<button type="button" class="ma-seg-btn" data-metas="sace-' + v[0] + '" data-accion="sace-vista" data-valor="' + v[0]
          + '" aria-pressed="' + (v[0] === sv) + '">' + v[1] + '</button>';
      }).join('') + '</div></div>'
      + '<div class="ma-ley-fila">' + (sv === 'aprov' || sv === 'recup'
        ? '<div class="ma-ley" aria-label="Colores de las notas"><span class="nt-i">Inicial: hasta 69</span><span class="nt-b">Básico: 70 a 79</span>'
          + '<span class="nt-a">Avanzado: 80 a 90</span><span class="nt-e">Excelente: 91 a 100</span></div>' : '<span></span>')
      + '<button type="button" class="ma-btn ma-btn-chico" data-accion="ayuda-sace" aria-expanded="' + ayudaSace + '">ⓘ ¿Cómo se llena?</button></div>'
      + (ayudaSace ? '<ol class="ma-ayuda">' + AYUDA_SACE[sv].map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '');
    if (!asig.length && sv !== 'pers' && sv !== 'inasis') {
      h += '<p class="ma-nota">Este grupo todavía no tiene clases.</p><div class="ma-acciones">'
        + '<button type="button" class="ma-btn ma-btn-1" data-accion="materias-siempre">Poner las clases de siempre</button></div>';
    } else {
      h += tablaSace(aula, sv, parcial, asig);
    }
    if (sv === 'aprov') {
      h += '<form class="ma-en-linea" data-form="asignatura"><label class="ma-oculto" for="ma-nueva-asig">Otra clase</label>'
        + '<input class="ma-inp" id="ma-nueva-asig" name="nombre" placeholder="Otra clase" maxlength="80" required autocomplete="off">'
        + '<button class="ma-btn" type="submit">➕ Agregar</button></form>';
    }
    h += '</div><div class="ma-card"><h2 class="ma-h">🖨️ Para imprimir</h2><div class="ma-imprimir">'
      + '<button type="button" class="ma-btn ma-btn-1" data-accion="imprimir" data-valor="boletas">🧾 Boletas de todo el grupo</button>'
      + '<button type="button" class="ma-btn" data-accion="imprimir" data-valor="resumen">📋 Resumen final por grado</button>'
      + '<button type="button" class="ma-btn" data-accion="imprimir" data-valor="cuadro">📒 Cuadro final del año</button></div></div>';
    return h;
  }

  function tablaSace(aula, sv, parcial, asig) {
    var lista = enAula(aula);
    var blob = sv === 'recup' && papel() ? papel().grupo(d, aula) : null;
    var numBlob = {};
    if (blob) blob.lista.forEach(function (b) { numBlob[b.id] = b.num; });
    var notas = {};
    var tablaN = sv === 'pers' ? 'notas_personalidad' : sv === 'inasis' ? 'inasistencias_oficiales' : 'notas';
    d.lista(tablaN, { aula_id: aula.id }).forEach(function (n) {
      var k = sv === 'pers' ? n.alumno_id + '|' + n.periodo + '|' + n.rasgo
        : sv === 'inasis' ? n.alumno_id + '|' + n.periodo
        : (n.componente || 'final') === 'final' ? n.alumno_id + '|' + n.asignatura_id + '|' + n.periodo : null;
      if (k) notas[k] = n;
    });
    var cols = [];
    var cab = '';
    if (sv === 'pers') {
      RASGOS.forEach(function (r) { PARCIALES.forEach(function (p, i) { cols.push({ rasgo: r, periodo: p, ini: i === 0, et: r + ', parcial ' + p }); }); });
      cab = '<tr><th class="ma-mx-fijo" rowspan="2" scope="col">N.º · Alumno</th>' + RASGOS.map(function (r) {
        return '<th colspan="4" class="ma-mx-ini" scope="colgroup">' + esc(r) + '</th>';
      }).join('') + '</tr><tr>' + cols.map(function (c) {
        return '<th scope="col" class="ma-mx-sub' + (c.ini ? ' ma-mx-ini' : '') + '">' + c.periodo + '</th>';
      }).join('') + '</tr>';
    } else if (sv === 'inasis') {
      cols = [{ periodo: parcial, et: 'Inasistencias del parcial ' + parcial }, { periodo: 'ANUAL', et: 'Inasistencia oficial del año' }];
      cab = '<tr><th class="ma-mx-fijo" scope="col">N.º · Alumno</th><th scope="col">Parcial ' + parcial
        + '<small>para la boleta</small></th><th scope="col">Oficial del año<small>va al Cuadro final</small></th>'
        + '<th scope="col">Pase de lista<small>faltas del año</small></th></tr>';
    } else {
      cols = asig.map(function (a) { return { asig: a, periodo: sv === 'recup' ? 'REC' : parcial, et: a.nombre }; });
      cab = '<tr><th class="ma-mx-fijo" scope="col">N.º · Alumno</th>' + cols.map(function (c) {
        return '<th scope="col">' + esc(c.asig.nombre) + '</th>';
      }).join('') + '</tr>';
    }
    var faltas = {};
    if (sv === 'inasis') {
      var anio = String(aula.anio_lectivo);
      d.lista('asistencia', { aula_id: aula.id }).forEach(function (x) {
        if (String(x.fecha).slice(0, 4) === anio && (x.estado === 'ausente' || x.estado === 'excusa')) faltas[x.alumno_id] = (faltas[x.alumno_id] || 0) + 1;
      });
    }
    var bajo70 = 0;
    var cuerpo = lista.map(function (a, fila) {
      var celdas = cols.map(function (c, ci) {
        var tipo = sv === 'pers' ? 'pers' : sv === 'inasis' ? (c.periodo === 'ANUAL' ? 'anual' : 'inas') : sv === 'recup' ? 'rec' : 'aprov';
        var k = sv === 'pers' ? a.id + '|' + c.periodo + '|' + c.rasgo : sv === 'inasis' ? a.id + '|' + c.periodo : a.id + '|' + c.asig.id + '|' + c.periodo;
        var n = notas[k];
        var v = n ? (sv === 'pers' ? n.letra : sv === 'inasis' ? n.dias : n.valor) : '';
        if (sv === 'recup') {
          var fin = blob && window.ResumenSace ? window.ResumenSace.notaFinal(blob, c.asig.nombre, numBlob[a.id]) : null;
          if (fin == null || fin >= 70) {
            return '<td class="ma-mx-na"><span aria-label="' + esc(c.et + ': ' + (fin == null ? 'sin final' : 'final ' + fin + ', no le toca')) + '">'
              + (fin == null ? '·' : esc(fin)) + '</span></td>';
          }
        }
        var cls = (c.ini ? 'ma-mx-ini ' : '') + (tipo === 'aprov' || tipo === 'rec' ? claseNota(v) : '');
        return '<td' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + '><input class="ma-mx-inp" data-accion="sace" data-tipo="' + tipo
          + '" data-alumno="' + esc(a.id) + '" data-fila="' + fila + '" data-col="' + ci + '"'
          + (c.asig ? ' data-asignatura="' + esc(c.asig.id) + '"' : '') + (c.rasgo ? ' data-rasgo="' + esc(c.rasgo) + '"' : '')
          + ' data-periodo="' + c.periodo + '" inputmode="' + (tipo === 'pers' ? 'text' : 'decimal') + '" maxlength="' + (tipo === 'pers' ? 3 : 5)
          + '" autocomplete="off" value="' + esc(v == null ? '' : v) + '" aria-label="' + esc(c.et + ' de ' + a.nombre_completo) + '"></td>';
      }).join('');
      if (sv === 'inasis') celdas += '<td class="ma-mx-na">' + (faltas[a.id] || 0) + '</td>';
      return '<tr><th class="ma-mx-fijo" scope="row"><span class="ma-mx-num">#' + esc(num(a)) + '</span><span class="ma-mx-nom">'
        + esc(corto(a)) + '</span></th>' + celdas + '</tr>';
    }).join('');
    if (sv === 'aprov' && window.ResumenSace && papel()) {
      var b = papel().grupo(d, aula);
      bajo70 = b.lista.filter(function (x) {
        return b.materias.some(function (mat) { var f = window.ResumenSace.notaFinal(b, mat, x.num); return f != null && f < 70; });
      }).length;
    }
    return '<div class="ma-mx-marco" tabindex="0" role="region" aria-label="Tabla de notas"><table class="ma-mx' + (sv === 'pers' ? ' ma-mx-pers' : '')
      + '"><thead>' + cab + '</thead><tbody>' + cuerpo + '</tbody></table></div>'
      + (bajo70 ? '<p class="ma-aviso-rec">⚠️ <b>' + bajo70 + '</b> ' + (bajo70 === 1 ? 'alumno tiene' : 'alumnos tienen')
        + ' final bajo 70: les toca recuperación. <button type="button" class="ma-btn ma-btn-chico" data-accion="sace-vista" data-valor="recup">✍️ Escribirla</button></p>' : '');
  }

  // ── 📣 Comunicados ─────────────────────────────────────────────────────
  function pintarComunicados(aula) {
    var h = '<div class="ma-seg ma-seg-ancho" role="group" aria-label="Qué anotar">'
      + [['avisos', '📣 Avisos a las familias'], ['conducta', '⭐ Conducta']].map(function (s) {
        return '<button type="button" class="ma-seg-btn" data-metas="ir-' + s[0] + '" data-accion="sub-com" data-valor="' + s[0] + '" aria-pressed="'
          + (subComunicados === s[0]) + '">' + s[1] + '</button>';
      }).join('') + '</div>';
    return h + (subComunicados === 'conducta' ? pintarConducta(aula) : pintarAvisos(aula));
  }
  function pintarAvisos(aula) {
    var lista = d.lista('avisos', { aula_id: aula.id }).sort(function (a, b) {
      return String(b.created_at || '9').localeCompare(String(a.created_at || '9'));
    });
    return '<form class="ma-card ma-form" data-form="aviso" data-metas="pantalla-avisos"><h2 class="ma-h">Aviso para todas las familias</h2>'
      + '<label class="ma-campo"><span>Título</span><input class="ma-inp" name="titulo" required maxlength="160" autocomplete="off"></label>'
      + '<label class="ma-campo"><span>Detalle (si hace falta)</span><textarea class="ma-inp" name="texto" rows="3" maxlength="2000"></textarea></label>'
      + '<div class="ma-acciones"><button class="ma-btn ma-btn-1" type="submit">Publicar el aviso</button></div></form>'
      + (lista.length ? '<div class="ma-card"><h2 class="ma-h">Avisos publicados</h2><ul class="ma-filas">' + lista.map(function (x) {
        return '<li class="ma-fila ma-fila-col"><b>' + esc(x.titulo) + '</b>' + (x.texto ? '<span class="ma-sub">' + esc(x.texto) + '</span>' : '') + '</li>';
      }).join('') + '</ul></div>' : '');
  }
  function pintarConducta(aula) {
    var lista = enAula(aula);
    var porId = {};
    alumnos(aula).forEach(function (a) { porId[a.id] = a; });
    var obs = d.lista('observaciones', { aula_id: aula.id }).sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
    return '<form class="ma-card ma-form" data-form="conducta" data-metas="pantalla-conducta"><h2 class="ma-h">Conducta</h2>'
      + '<label class="ma-campo"><span>¿De quién?</span><select class="ma-inp" name="alumno" required><option value="">Elige al alumno</option>'
      + lista.map(function (a) { return '<option value="' + esc(a.id) + '">#' + esc(num(a)) + ' ' + esc(a.nombre_completo) + '</option>'; }).join('')
      + '</select></label><fieldset class="ma-radios"><legend>Tipo</legend>' + TIPOS_CONDUCTA.map(function (t, i) {
        return '<label class="ma-radio"><input type="radio" name="tipo" value="' + t[0] + '"' + (i === 0 ? ' checked' : '') + '> ' + esc(t[1]) + '</label>';
      }).join('') + '</fieldset>'
      + '<label class="ma-campo"><span>Qué pasó</span><textarea class="ma-inp" name="texto" rows="2" required maxlength="500"></textarea></label>'
      + '<div class="ma-acciones"><button class="ma-btn ma-btn-1" type="submit">Anotar</button></div></form>'
      + (obs.length ? '<div class="ma-card"><h2 class="ma-h">Lo anotado</h2><ul class="ma-filas">' + obs.slice(0, 30).map(function (o) {
        var t = TIPOS_CONDUCTA.filter(function (x) { return x[0] === o.tipo; })[0];
        var a = porId[o.alumno_id];
        return '<li class="ma-fila ma-fila-col"><span><b>' + esc(a ? quien(a) : '') + '</b> · ' + esc(t ? t[1] : o.tipo) + ' · '
          + esc(fechaCorta(o.fecha)) + '</span><span class="ma-sub">' + esc(o.texto) + '</span></li>';
      }).join('') + '</ul></div>' : '');
  }

  var PINTORES = {
    alumnos: pintarAlumnos, economia: pintarEconomia, asistencia: pintarAsistencia, controles: pintarControles,
    notas: pintarNotas, comunicados: pintarComunicados,
  };

  // ── La tarjeta de abajo: de a una ──────────────────────────────────────
  function pintarTarjeta() {
    var t = document.getElementById('ma-tarjeta');
    if (!t || !d) return;
    var hay = !!(d.cuenta() || d.pideContrasena());
    var p = preguntaLocal || (hay && d.preguntas()[0]);
    var h = '';
    if (reabriendo) {
      h = '<div class="ma-carta" role="dialog" aria-label="Reabrir la colecta"><form data-form="reabrir">'
        + '<label class="ma-campo"><span>¿Por qué la reabres? (puedes dejarlo en blanco)</span><input class="ma-inp" name="motivo" maxlength="200"></label>'
        + '<div class="ma-botones"><button class="ma-btn ma-btn-1" type="submit">Listo</button></div></form></div>';
    } else if (p) {
      h = '<div class="ma-carta" data-metas="pregunta" role="dialog" aria-live="polite"><p class="ma-carta-t" data-metas="pregunta-texto">'
        + esc(p.texto) + '</p><div class="ma-botones">' + p.botones.map(function (b, i) {
          return '<button type="button" class="ma-btn' + (i === 0 ? ' ma-btn-1' : '') + '" data-metas="pregunta-boton" data-accion="responder" data-pregunta="'
            + esc(p.id) + '" data-valor="' + esc(b.valor) + '">' + esc(b.etiqueta) + '</button>';
        }).join('') + '</div></div>';
    } else if (hay && d.noAnotado()[0]) {
      var n = d.noAnotado()[0];
      h = '<div class="ma-carta" data-metas="no-anotado" role="alert"><p class="ma-carta-t">' + esc(n.texto) + '</p>'
        + '<div class="ma-botones"><button type="button" class="ma-btn ma-btn-1" data-accion="entendido" data-valor="' + esc(n.id) + '">Entendido</button></div></div>';
    } else if (d.pideContrasena()) {
      h = '<div class="ma-carta" role="dialog"><form data-form="clave"><label class="ma-campo"><span>Escribe tu contraseña</span>'
        + '<input class="ma-inp" type="password" name="clave" autocomplete="current-password" required></label>'
        + '<div class="ma-botones"><button class="ma-btn ma-btn-1" type="submit">Entrar</button></div></form></div>';
    } else if (hoja) {
      h = pintarHoja();
    }
    // Solo si cambió: repintarla igual borraba lo que el docente escribía
    // en la cajita y movía los botones bajo su dedo.
    if (h === tarjetaPintada) return;
    tarjetaPintada = h;
    t.innerHTML = h;
    t.hidden = !h;
  }

  // La cajita de un pago: un monto distinto, o lo que ya dio (cambiarlo o
  // quitarlo). Solo aparece cuando hace falta; el toque normal no la abre.
  function pintarHoja() {
    var a = d.lista('alumnos', { id: hoja.alumno })[0];
    var col = d.lista('colectas', { id: hoja.colecta })[0];
    if (!a || !col) { hoja = null; return ''; }
    var pagos = d.lista('pagos', { colecta_id: col.id, alumno_id: a.id });
    var x = d.lista('v_colecta_alumnos', { colecta_id: col.id, alumno_id: a.id })[0] || {};
    var t = pagos.length
      ? quien(a) + ' dio ' + L(x.pagado) + (pagos.length > 1 ? ' en ' + pagos.length + ' pagos' : '') + '.'
      : '¿Cuánto dio ' + quien(a) + '?';
    var et = !pagos.length ? 'Monto (L)' : pagos.length === 1 ? 'Cambiar el monto (L)' : 'Agregar otro pago (L)';
    return '<div class="ma-carta" role="dialog" aria-label="' + esc('Pago de ' + a.nombre_completo) + '" data-metas="hoja-pago">'
      + '<p class="ma-carta-t">' + esc(t) + '</p><form data-form="pago" class="ma-hoja-form">'
      + '<label class="ma-campo"><span>' + esc(et) + '</span><input class="ma-inp ma-inp-monto" data-metas="monto" name="monto" inputmode="decimal" required value="'
      + (pagos.length === 1 ? esc(pagos[0].monto || '') : '') + '" autocomplete="off"></label>'
      + '<button class="ma-btn ma-btn-1" type="submit" data-metas="anotar">Anotar</button></form>'
      + '<div class="ma-botones">' + (pagos.length ? '<button type="button" class="ma-btn ma-btn-peligro" data-metas="quitar-pago" data-accion="quitar-pago">'
        + (pagos.length > 1 ? 'Quitar los pagos' : 'Quitar el pago') + '</button>' : '')
      + '<button type="button" class="ma-btn" data-accion="cerrar-hoja">Cerrar</button></div></div>';
  }

  function pintarSenal(sin) {
    var s = document.querySelector('[data-metas="senal"]');
    if (s) s.hidden = !sin;
  }

  // ── Lo que hace el docente ─────────────────────────────────────────────
  function intentar(f, donde) {
    try {
      f();
      return true;
    } catch (e) {
      avisarEn(donde, frase(e));
      return false;
    }
  }
  function avisarEn(donde, texto) {
    var el = donde && donde.querySelector ? donde.querySelector('.ma-aviso') : null;
    if (!el && donde && donde.appendChild) {
      el = document.createElement('p');
      el.className = 'ma-aviso';
      el.setAttribute('role', 'status');
      donde.appendChild(el);
    }
    if (el) el.textContent = texto;
  }
  function preguntar(texto, botones, alResponder) {
    preguntaLocal = { id: 'local', texto: texto, botones: botones, alResponder: alResponder };
    pintarTarjeta();
    var b = document.querySelector('#ma-tarjeta [data-metas="pregunta-boton"]');
    if (b) b.focus();
  }

  // Tocar algo de una colecta cerrada: antes de nada, la pregunta (09, 9.4).
  function siCerrada(colectaId, luego) {
    var col = d.lista('colectas', { id: colectaId })[0];
    if (!col || col.estado !== 'cerrada') return luego();
    preguntar('Esta colecta está cerrada. ¿Reabrirla?',
      [{ etiqueta: 'Reabrir', valor: 'reabrir' }, { etiqueta: 'Dejarla cerrada', valor: 'dejarla_cerrada' }],
      function (v) { if (v === 'reabrir') { reabriendo = { colecta: colectaId, luego: luego }; } });
  }

  // Lo que todavía vive en la pantalla de antes (08, 8.2): se abre allá, con
  // su candado, y la flecha de allá vuelve aquí.
  function abrirVieja(tab, sub) {
    var abrir = function () {
      try {
        /* global _adTab, _adGastosOn, _adInvOn, _adColectaId, _adControlId, renderAdmin, switchView */
        _adTab = tab;
        _adColectaId = null;
        _adControlId = null;
        _adGastosOn = sub === 'gastos' ? 1 : 0;
        _adInvOn = sub === 'inv' ? 1 : 0;
      } catch (e) { /* sin la pantalla de antes cargada no hay a dónde ir */ return; }
      deMiAula = true;
      window.switchView('view-admin');
      window.renderAdmin();
    };
    if (typeof window.paVerificarPin === 'function') {
      Promise.resolve(window.paVerificarPin('Los registros administrativos guardan **dinero y notas finales**:')).then(function (ok) { if (ok) abrir(); });
    } else {
      abrir();
    }
  }

  function alClic(ev) {
    var b = ev.target.closest('[data-accion]');
    if (!b || !d || b.disabled || b.tagName === 'SELECT' || (b.tagName === 'INPUT' && b.type !== 'button')) return;
    var acc = b.getAttribute('data-accion');
    var v = b.getAttribute('data-valor');
    var aula = aulaActual();
    switch (acc) {
      case 'aula':
        vista.aula = v; guardarPref();
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; hoja = null; formGrupo = false;
        pintarTarjeta();
        return pintar();
      case 'otro-grupo': formGrupo = !formGrupo; return pintar();
      case 'seccion':
        var s = SECCIONES.filter(function (x) { return x.k === v; })[0];
        if (s && s.vieja) return abrirVieja(s.vieja);
        vista.seccion = v; guardarPref();
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; subAlumnos = ''; hoja = null; otroMonto = false;
        pintarTarjeta();
        pintar();
        enfocarPantalla();
        return;
      case 'vieja': return abrirVieja(v, b.getAttribute('data-sub'));
      case 'alumno': alumnoAbierto = alumnoAbierto === v ? null : v; return pintar();
      case 'estado':
        intentar(function () { d.editar('alumnos', b.getAttribute('data-alumno'), { estado: v, estado_fecha: hoy() }); });
        alumnoAbierto = null;
        return pintar();
      case 'carga': subAlumnos = 'carga'; avisoCarga = ''; pintar(); return enfocarPantalla();
      case 'alumnos': subAlumnos = ''; return pintar();
      case 'nueva-colecta': formColecta = !formColecta; pintar(); if (formColecta) enfocar('[data-form="colecta"] input'); return;
      case 'colecta': colectaAbierta = v; otroMonto = false; formGasto = false; pintar(); return enfocarPantalla();
      case 'colectas': colectaAbierta = null; hoja = null; otroMonto = false; pintarTarjeta(); return pintar();
      case 'otro-monto': otroMonto = !otroMonto; return pintar();
      case 'nuevo-gasto':
        return siCerrada(colectaAbierta, function () {
          formGasto = !formGasto; pintar();
          if (formGasto) enfocar('[data-form="gasto"] input');
        });
      case 'pago-alumno': return tocarPago(aula, b.getAttribute('data-alumno'));
      case 'cerrar-hoja': hoja = null; return pintarTarjeta();
      case 'quitar-pago': return quitarPago();
      case 'cerrar': intentar(function () { d.colecta.cerrar(v); }); hoja = null; pintarTarjeta(); return pintar();
      case 'reabrir': reabriendo = { colecta: v, luego: null }; return pintarTarjeta();
      case 'imprimir': return imprimir(aula, v);
      case 'asis': return tocarAsistencia(aula, b.getAttribute('data-alumno'));
      case 'todos-presentes': return todosPresentes(aula);
      case 'aprobar-excusa':
        return aprobarExcusa(aula, b.getAttribute('data-alumno'), b.getAttribute('data-fecha'), b.getAttribute('data-razon'));
      case 'plantilla':
        var pl = PLANTILLAS[+v];
        if (pl && intentar(function () {
          controlAbierto = d.crear('controles', { aula_id: aula.id, nombre: pl[1], icono: pl[0], tipo: 'marca', fecha: hoy() }).id;
        })) pintar();
        return;
      case 'control': controlAbierto = v; pintar(); return enfocarPantalla();
      case 'controles': controlAbierto = null; return pintar();
      case 'marca': return marcar(aula, b.getAttribute('data-alumno'));
      case 'marcar-todos': return marcarTodos(aula, true);
      case 'quitar-marcas':
        return preguntar('¿Quitar todas las marcas de este control?',
          [{ etiqueta: 'Quitar las marcas', valor: 'si' }, { etiqueta: 'Dejarlas', valor: 'no' }],
          function (r) { if (r === 'si') marcarTodos(aula, false); });
      case 'parcial': vista.parcial = v; guardarPref(); return pintar();
      case 'sace-vista': vista.saceVista = v; guardarPref(); return pintar();
      case 'ayuda-sace': ayudaSace = !ayudaSace; return pintar();
      case 'materias-siempre':
        intentar(function () {
          MATERIAS_DE_SIEMPRE.forEach(function (n, i) { d.crear('asignaturas', { aula_id: aula.id, nombre: n, orden: i + 1 }); });
        });
        return pintar();
      case 'sub-com': subComunicados = v; return pintar();
      case 'carga-guardar': return guardarCarga(aula);
      case 'entendido': d.entendido(v); return pintarTarjeta();
      case 'responder': return responder(b.getAttribute('data-pregunta'), v);
    }
  }

  function enfocar(sel) {
    var el = document.querySelector(sel);
    if (el) el.focus();
  }
  // Para el lector de pantalla: al cambiar de sección, el foco va a ella.
  function enfocarPantalla() {
    var p = document.querySelector('#mi-aula .ma-pant');
    if (!p) return;
    p.setAttribute('tabindex', '-1');
    try { p.focus({ preventScroll: true }); } catch (e) { p.focus(); }
  }

  function responder(id, valor) {
    if (id === 'local' && preguntaLocal) {
      var p = preguntaLocal;
      preguntaLocal = null;
      if (p.alResponder) p.alResponder(valor);
      pintarTarjeta();
      pintar();
      return;
    }
    Promise.resolve(d.responder(id, valor)).then(pedirPintar);
  }

  // Un toque: el aporte completo. Solo abre la cajita un monto distinto
  // («✎ Otro monto»), una colecta sin aporte fijo, o quien ya dio.
  function tocarPago(aula, alumno) {
    var colId = colectaAbierta;
    return siCerrada(colId, function () {
      var col = d.lista('colectas', { id: colId })[0];
      if (!col) return;
      var x = d.lista('v_colecta_alumnos', { colecta_id: colId, alumno_id: alumno })[0] || {};
      var yaDio = d.lista('pagos', { colecta_id: colId, alumno_id: alumno }).length > 0;
      var sinMonto = col.monto_sugerido == null || col.monto_sugerido === '0.00';
      if (yaDio || otroMonto || sinMonto || x.situacion === 'no_corresponde' || x.situacion === 'por_aclarar') {
        hoja = { alumno: alumno, colecta: colId };
        otroMonto = false;
        pintar();
        pintarTarjeta();
        enfocar('#ma-tarjeta [data-metas="monto"]');
        return;
      }
      intentar(function () { d.pagar({ colecta_id: colId, alumno_id: alumno, monto: col.monto_sugerido, fecha: hoy() }); });
      pintar();
    });
  }

  function quitarPago() {
    if (!hoja) return;
    var h = hoja;
    var a = d.lista('alumnos', { id: h.alumno })[0];
    var pagos = d.lista('pagos', { colecta_id: h.colecta, alumno_id: h.alumno });
    var x = d.lista('v_colecta_alumnos', { colecta_id: h.colecta, alumno_id: h.alumno })[0] || {};
    if (!a || !pagos.length) return;
    hoja = null;
    preguntar('¿Quitar ' + (pagos.length > 1 ? 'los pagos' : 'el pago') + ' de ' + quien(a) + ' (' + L(x.pagado) + ')?',
      [{ etiqueta: pagos.length > 1 ? 'Quitar los pagos' : 'Quitar el pago', valor: 'quitar' }, { etiqueta: 'Dejarlo', valor: 'dejar' }],
      function (r) {
        if (r !== 'quitar') return;
        siCerrada(h.colecta, function () {
          pagos.forEach(function (p) { intentar(function () { d.anularPago(p.id, 'Quitado por el docente'); }); });
          pintar();
        });
      });
  }

  function marcarDia(aula, fecha) {
    // El día queda como «se pasó lista» (asistencia_dias): sin esta fila no
    // se sabe si nadie faltó o si no se pasó lista.
    if (!d.lista('asistencia_dias', { aula_id: aula.id, fecha: fecha }).length) {
      d.crear('asistencia_dias', { aula_id: aula.id, fecha: fecha });
    }
  }
  function tocarAsistencia(aula, alumno) {
    var fecha = fechaAsis();
    var hay = d.lista('asistencia', { alumno_id: alumno, fecha: fecha })[0];
    intentar(function () {
      marcarDia(aula, fecha);
      if (!hay) d.crear('asistencia', { aula_id: aula.id, alumno_id: alumno, fecha: fecha, estado: 'ausente' });
      else if (hay.estado === 'ausente') d.editar('asistencia', hay.id, { estado: 'excusa' });
      else d.borrar('asistencia', hay.id);
    });
    pintar();
  }
  function todosPresentes(aula) {
    var fecha = fechaAsis();
    var marcas = d.lista('asistencia', { aula_id: aula.id, fecha: fecha });
    if (!marcas.length) return;
    preguntar('¿Dejar a todos presentes el ' + fechaCorta(fecha) + '? Se quitan ' + marcas.length
      + (marcas.length === 1 ? ' marca.' : ' marcas.'),
      [{ etiqueta: 'Todos presentes', valor: 'si' }, { etiqueta: 'Dejarlo así', valor: 'no' }],
      function (r) {
        if (r !== 'si') return;
        intentar(function () {
          marcarDia(aula, fecha);
          marcas.forEach(function (m) { d.borrar('asistencia', m.id); });
        });
      });
  }
  function aprobarExcusa(aula, alumno, fecha, razon) {
    var hay = d.lista('asistencia', { alumno_id: alumno, fecha: fecha })[0];
    intentar(function () {
      marcarDia(aula, fecha);
      if (hay) d.editar('asistencia', hay.id, { estado: 'excusa', justificacion: String(razon || '').slice(0, 300) });
      else d.crear('asistencia', { aula_id: aula.id, alumno_id: alumno, fecha: fecha, estado: 'excusa', justificacion: String(razon || '').slice(0, 300) });
    });
    pintar();
  }

  function marcar(aula, alumno) {
    var hay = d.lista('control_valores', { control_id: controlAbierto, alumno_id: alumno })[0];
    intentar(function () {
      if (hay) d.editar('control_valores', hay.id, { marcado: !hay.marcado });
      else d.crear('control_valores', { aula_id: aula.id, control_id: controlAbierto, alumno_id: alumno, marcado: true });
    });
    pintar();
  }
  function marcarTodos(aula, valor) {
    var c = controlAbierto;
    var m = {};
    d.lista('control_valores', { control_id: c }).forEach(function (v) { m[v.alumno_id] = v; });
    intentar(function () {
      enAula(aula).forEach(function (a) {
        var hay = m[a.id];
        if (hay && !!hay.marcado !== valor) d.editar('control_valores', hay.id, { marcado: valor });
        else if (!hay && valor) d.crear('control_valores', { aula_id: aula.id, control_id: c, alumno_id: a.id, marcado: true });
      });
    });
    pintar();
  }

  function imprimir(aula, que) {
    if (!aula || !papel()) return;
    papel().imprimir(d, aula, que);
  }

  function alCambiar(ev) {
    var el = ev.target;
    var acc = el.getAttribute && el.getAttribute('data-accion');
    if (!acc || !d) return;
    if (acc === 'fecha') { vista.fecha = el.value || hoy(); guardarPref(); return pintar(); }
    if (acc === 'sace') return anotarSace(el);
  }

  // El color de la nota cambia mientras se escribe; se anota al soltar.
  function alEscribir(ev) {
    var el = ev.target;
    if (!el.classList || !el.classList.contains('ma-mx-inp')) return;
    var tipo = el.getAttribute('data-tipo');
    if (tipo !== 'aprov' && tipo !== 'rec') return;
    var td = el.parentNode;
    td.classList.remove('nt-i', 'nt-b', 'nt-a', 'nt-e');
    var c = claseNota(el.value);
    if (c) td.classList.add(c);
  }
  // Enter baja al siguiente alumno, como en una hoja de cálculo.
  function alTeclear(ev) {
    var el = ev.target;
    if (ev.key !== 'Enter' || !el.classList || !el.classList.contains('ma-mx-inp')) return;
    ev.preventDefault();
    var sig = document.querySelector('#mi-aula .ma-mx-inp[data-col="' + el.getAttribute('data-col') + '"][data-fila="'
      + (+el.getAttribute('data-fila') + 1) + '"]');
    if (sig) { sig.focus(); sig.select(); } else el.blur();
  }

  function anotarSace(el) {
    var tipo = el.getAttribute('data-tipo');
    var alumno = el.getAttribute('data-alumno');
    var periodo = el.getAttribute('data-periodo');
    var aula = aulaActual();
    var txt = el.value.trim().replace(',', '.');
    var celda = el.closest('td');
    var tabla;
    var filtro;
    var fila;
    if (tipo === 'pers') {
      txt = txt.toUpperCase();
      tabla = 'notas_personalidad';
      filtro = { alumno_id: alumno, periodo: periodo, rasgo: el.getAttribute('data-rasgo') };
      var escala = aula.escala_personalidad && aula.escala_personalidad.length ? aula.escala_personalidad : ['S', 'MB', 'B'];
      if (txt && escala.indexOf(txt) < 0) { marcarMal(el, 'Usa la escala: ' + escala.join(', ')); return; }
      fila = { letra: txt };
    } else if (tipo === 'inas' || tipo === 'anual') {
      tabla = 'inasistencias_oficiales';
      filtro = { alumno_id: alumno, periodo: periodo };
      if (txt && !/^\d{1,3}$/.test(txt)) { marcarMal(el, 'Escribe los días con números.'); return; }
      fila = { dias: txt };
    } else {
      tabla = 'notas';
      filtro = { alumno_id: alumno, asignatura_id: el.getAttribute('data-asignatura'), periodo: periodo, componente: 'final' };
      var m = /^(\d{1,3})(\.\d{1,2})?$/.exec(txt);
      if (txt && !(m && (m[1].length < 3 || /^100(\.0{1,2})?$/.test(txt)))) { marcarMal(el, 'Escribe una nota de 0 a 100.'); return; }
      fila = { valor: txt };
    }
    el.removeAttribute('aria-invalid');
    el.title = '';
    var hay = d.lista(tabla, filtro)[0];
    intentar(function () {
      if (txt === '') { if (hay) d.borrar(tabla, hay.id); return; }
      if (hay) d.editar(tabla, hay.id, fila);
      else d.crear(tabla, Object.assign({ aula_id: aula.id }, filtro, fila));
    }, celda);
  }
  function marcarMal(el, texto) {
    el.setAttribute('aria-invalid', 'true');
    el.title = texto;
    avisarEn(document.querySelector('#mi-aula .ma-card-sace'), texto);
  }

  function alEnviar(ev) {
    var f = ev.target;
    var tipo = f.getAttribute && f.getAttribute('data-form');
    if (!tipo || !d) return;
    ev.preventDefault();
    var datos = {};
    new FormData(f).forEach(function (val, k) { datos[k] = String(val).trim(); });
    var aula = aulaActual();
    var ok = true;
    switch (tipo) {
      case 'aula':
        var grado = /^\d{1,2}/.exec(datos.grado);
        if (!grado) { avisarEn(f, 'Escribe el grado con número, por ejemplo 6.'); return; }
        ok = intentar(function () {
          var id = d.crear('aulas', { escuela: datos.escuela, grado: grado[0], seccion: datos.seccion.replace(/[^0-9A-Za-z]/g, '').slice(0, 3),
            anio_lectivo: new Date().getFullYear() }).id;
          vista.aula = id; guardarPref();
          formGrupo = false;
        }, f);
        break;
      case 'alumno':
        var n = alumnos(aula).reduce(function (x, a) { return Math.max(x, a.num_lista || 0); }, 0);
        ok = intentar(function () { d.crear('alumnos', { aula_id: aula.id, nombre_completo: datos.nombre, num_lista: n < 99 ? n + 1 : null }); }, f);
        if (ok) { pintar(); enfocar('#ma-nuevo-al'); return; }
        break;
      case 'asignatura':
        ok = intentar(function () {
          d.crear('asignaturas', { aula_id: aula.id, nombre: datos.nombre, orden: asignaturas(aula).length + 1 });
        }, f);
        break;
      case 'colecta':
        ok = intentar(function () {
          colectaAbierta = d.colecta.crear({ aula_id: aula.id, concepto: datos.concepto, monto_sugerido: datos.monto, fecha: datos.fecha }).id;
          formColecta = false;
        }, f);
        break;
      case 'pago':
        var h = hoja;
        if (!h) return;
        return siCerrada(h.colecta, function () {
          var pagos = d.lista('pagos', { colecta_id: h.colecta, alumno_id: h.alumno });
          var hecho = intentar(function () {
            if (pagos.length === 1) d.corregirPago(pagos[0].id, { monto: datos.monto, motivo: 'corrección' });
            else d.pagar({ colecta_id: h.colecta, alumno_id: h.alumno, monto: datos.monto, fecha: hoy() });
          }, f);
          if (hecho) { hoja = null; pintarTarjeta(); pintar(); }
        });
      case 'control':
        ok = intentar(function () {
          controlAbierto = d.crear('controles', { aula_id: aula.id, nombre: datos.nombre, tipo: 'marca', fecha: hoy() }).id;
        }, f);
        break;
      case 'aviso':
        ok = intentar(function () {
          d.crear('avisos', { aula_id: aula.id, tipo: 'aviso', titulo: datos.titulo, texto: datos.texto || null });
        }, f);
        break;
      case 'conducta':
        if (!datos.alumno) { avisarEn(f, 'Elige de quién es.'); return; }
        ok = intentar(function () {
          d.crear('observaciones', { aula_id: aula.id, alumno_id: datos.alumno, tipo: datos.tipo || 'felicitacion', texto: datos.texto,
            fecha: hoy() });
        }, f);
        break;
      case 'gasto':
        var cg = f.getAttribute('data-colecta');
        return siCerrada(cg, function () {
          if (intentar(function () { d.gasto.crear({ colecta_id: cg, concepto: datos.concepto, monto: datos.monto, fecha: datos.fecha }); }, f)) {
            formGasto = false;
            pintar();
          }
        });
      case 'carga-vista':
        cargaTexto = datos.pegado || '';
        cargaFilas = leerCarga(datos.pegado);
        avisoCarga = cargaFilas.length ? '' : 'No encontré nombres. Pega un nombre por renglón.';
        return pintar();
      case 'reabrir':
        var r = reabriendo;
        reabriendo = null;
        intentar(function () { d.colecta.reabrir(r.colecta, datos.motivo || null); });
        pintarTarjeta();
        pintar();
        if (r.luego) setTimeout(r.luego, 0);
        return;
      case 'clave':
        var correo = correoGuardado();
        return d.entrar(correo, datos.clave).then(function (res) {
          if (!res.ok) avisarEn(f, res.motivo === 'sin_senal' ? 'Para entrar se necesita señal.' : 'Esa no es tu contraseña. Vuelve a escribirla.');
          pintarTarjeta();
        });
    }
    if (ok) pintar();
  }

  // Un nombre por renglón; si al final hay una identidad (13 cifras, con o
  // sin guiones), va aparte. Los renglones vacíos no cuentan.
  function leerCarga(texto) {
    return String(texto || '').split(/\r?\n/).map(function (r) { return r.replace(/\t/g, ' ').trim(); })
      .filter(function (r) { return r.length >= 3; })
      .map(function (r) {
        var m = /^(.*?)[\s,;]+(\d{4}-?\d{4}-?\d{5})$/.exec(r);
        return m ? { nombre: m[1].trim(), identidad: m[2] } : { nombre: r, identidad: null };
      });
  }

  // Tocar «Agregar a la lista» dos veces no anota dos veces: la vista previa
  // se vacía en cuanto se anota (lo mismo sin señal).
  function guardarCarga(aula) {
    if (!cargaFilas.length || !aula) return;
    var filas = cargaFilas;
    cargaFilas = [];
    cargaTexto = '';
    var n = alumnos(aula).reduce(function (x, a) { return Math.max(x, a.num_lista || 0); }, 0);
    filas.forEach(function (f) {
      n++;
      intentar(function () {
        var fila = { aula_id: aula.id, nombre_completo: f.nombre, num_lista: n <= 99 ? n : null };
        if (f.identidad) fila.identidad = f.identidad;
        d.crear('alumnos', fila);
      });
    });
    avisoCarga = 'Listo: ' + filas.length + (filas.length === 1 ? ' alumno' : ' alumnos') + ' en tu lista.';
    var t = document.querySelector('[data-metas="carga-pegar"]');
    if (t) t.value = '';
    pintar();
  }

  function correoGuardado() {
    try { return (JSON.parse(localStorage.getItem('METAS_ENTRADA_V1')) || {}).correo || ''; } catch (e) { return ''; }
  }

  // ── Arranque ───────────────────────────────────────────────────────────
  function preparar() {
    if (listo) return listo;
    if (!window.MetasDatos || typeof window.MetasDatos.iniciar !== 'function') return Promise.resolve(null);
    listo = window.MetasDatos.iniciar().then(function (api) {
      d = api;
      d.escuchar(pedirPintar);
      d.alCambiarSenal(pintarSenal);
      pintarSenal(d.sinSenal());
      pintarTarjeta();
      // La Zona Docente se pintó antes de saber si ya había una sesión en
      // este aparato: se vuelve a pintar para que aparezcan las herramientas.
      var perfil = document.getElementById('view-perfil');
      if (perfil && perfil.classList.contains('active') && typeof window.renderProfile === 'function') window.renderProfile();
      if (document.getElementById('view-mi-aula') && document.getElementById('view-mi-aula').classList.contains('active')) pintar();
      return api;
    }).catch(function () { return null; });
    return listo;
  }

  document.addEventListener('click', function (ev) {
    if (!ev.target.closest) return;
    if (ev.target.closest('#mi-aula-back-btn')) {
      // La flecha sube un nivel: de una colecta, un control o la lista
      // pegada, a su lista; si no, a la Zona Docente.
      if (colectaAbierta || controlAbierto || subAlumnos) {
        colectaAbierta = null; controlAbierto = null; subAlumnos = ''; hoja = null; pintarTarjeta(); pintar(); return;
      }
      if (typeof window.switchView === 'function') window.switchView('view-perfil');
      return;
    }
    if (ev.target.closest('#mi-aula') || ev.target.closest('#ma-tarjeta')) alClic(ev);
  });
  // La pantalla de antes abierta desde aquí: su flecha, en el primer nivel,
  // vuelve a Mi aula y no a la Zona Docente.
  document.addEventListener('click', function (ev) {
    if (!deMiAula || !ev.target.closest || !ev.target.closest('#admin-back-btn')) return;
    var dentro = false;
    try {
      /* global _adFichasOn, adConvNivel */
      dentro = !!(_adFichasOn || _adGastosOn || _adInvOn || _adColectaId || _adControlId
        || (typeof adConvNivel === 'function' && adConvNivel()));
    } catch (e) { dentro = false; }
    if (dentro) return;
    ev.stopImmediatePropagation();
    deMiAula = false;
    window.switchView('view-mi-aula');
    pintar();
  }, true);
  document.addEventListener('change', function (ev) {
    if (ev.target.closest && ev.target.closest('#mi-aula')) alCambiar(ev);
  });
  document.addEventListener('input', function (ev) {
    if (ev.target.closest && ev.target.closest('#mi-aula')) alEscribir(ev);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.target.closest && ev.target.closest('#mi-aula')) alTeclear(ev);
  });
  document.addEventListener('submit', function (ev) {
    if (ev.target.closest && (ev.target.closest('#mi-aula') || ev.target.closest('#ma-tarjeta'))) alEnviar(ev);
  });

  window.metasMiAula = {
    preparar: preparar,
    abrir: function () { return preparar().then(function () { pintar(); pintarTarjeta(); }); },
    // Para la Zona Docente: ¿hay una cuenta abierta en MetasDatos?
    cuenta: function () { return d ? d.cuenta() : null; },
    entrar: function (correo, clave) {
      return preparar().then(function (api) {
        if (!api) return { ok: false, motivo: 'reintentar' };
        return api.entrar(correo, clave).then(function (r) {
          if (r.ok) {
            try { localStorage.setItem('METAS_ENTRADA_V1', JSON.stringify({ correo: correo })); } catch (e) { /* solo para pedir la contraseña */ }
          }
          pintarTarjeta();
          return r;
        });
      });
    },
    salir: function () { return d ? d.salir().then(pintarTarjeta) : Promise.resolve(); },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preparar);
  else preparar();
})();
