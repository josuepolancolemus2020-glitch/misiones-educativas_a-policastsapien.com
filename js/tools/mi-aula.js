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
  var AYUDA_PERFIL = [
    'Cada grupo pertenece a un solo centro.',
    'Al cambiar de centro ves solo sus grupos.',
    'El grado y las materias quedan en el grupo.',
  ];
  // Preferencia de vista: en su propia llave (regla 5), nunca en el aula.
  var PREF = 'METAS_MI_AULA_VISTA_V1';

  var d = null;
  var listo = null;
  var vista = leerPref();
  var colectaAbierta = null;
  var controlAbierto = null;
  var alumnoAbierto = null;
  var subAlumnos = '';           // '' , 'carga', 'sace', 'datos-sace' o 'sin-sexo'
  // Las fichas que estaban sin sexo al abrir «Completar el sexo»: se quedan
  // a la vista aunque ya tengan uno, para que un toque equivocado se vea y
  // se corrija ahí mismo, sin ir a buscarlo en la lista de 43.
  var sinSexoIds = null;
  var subComunicados = 'avisos';
  var otroMonto = false;         // el próximo toque abre la cajita en vez de anotar el monto completo
  var hoja = null;               // la cajita de un pago: { alumno, colecta }
  var preguntaLocal = null;      // pregunta de dos botones de la pantalla (reabrir, quitar un pago…)
  var reabriendo = null;
  var formGrupo = false;
  var formColecta = false;
  var formGasto = false;
  var ayudaSace = false;
  var ayudaPerfil = false;
  var perfilPantalla = false;    // el perfil es su pantalla: no va con las notas
  var centroNuevo = false;       // el formulario en blanco para otro centro
  // El perfil se guarda una vez, no con cada letra (hasta v568 cada letra
  // era una petición, y un centro nuevo nacía con la primera): al tocar
  // «Guardar perfil», al salir del campo, o tras ESPERA_PERFIL sin escribir.
  var ESPERA_PERFIL = 1500;
  var esperaPerfil = null;
  var perfilGuardado = null;     // id del centro cuyo perfil se acaba de guardar
  var SIN_SENAL_GUARDADO = 'Guardado en este aparato. Se subirá cuando haya señal.';
  var confirmarArchivo = false;
  var avisoArchivo = '';          // 'grupos', 'ultimo' o ''
  var archivadosAbiertos = false;
  // La papelera del chip: elige, aviso1 o aviso2. Vacío si no hay pregunta.
  var pasoPapelera = '';
  var pasoCentro = null;
  var avisoLinea = '';
  var barraAlSalir = null;
  var ordenAlArchivar = null;
  var alSalirConBarra = false;
  var barraCentroHasta = 0;
  var barraCentroTimer = null;
  var focoBorrar = false;
  var ICONO_BASURA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6.5 7l1 13h9l1-13"/></svg>';
  var choqueArchivo = null;       // { id, texto } si recuperar choca con el nombre
  var barraHasta = 0;
  var barraTimer = null;
  var cargaFilas = [];
  var cargaTexto = '';
  var avisoCarga = '';
  var porPintar = false;
  var tarjetaPintada = null;
  var excusas = {};              // por aula: { t, filas, buscando }
  var deMiAula = false;          // la pantalla de antes se abrió desde aquí
  var importe = null;            // importar un archivo: { plan, archivo, decisiones, frase, aviso }
  var claves = null;             // preparar las claves de familia: { aula, plan, frase, aviso, guardando }
  var listaSace = null;          // importar la lista del SACE: { aula, leido, plan, conf, frase, aviso, guardando }

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
    var todas = aulasVisibles();
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
    // Lo escrito en el perfil que esperaba su pausa se guarda antes de que
    // el repintado se lleve el formulario.
    if (esperaPerfil) guardarFormCentro({});
    asegurarPrimerCentro();
    prepararSalidaCentro();
    var aula = aulaActual();
    var sec = seccion();
    var h = perfilPantalla ? pintarPantallaPerfil(aula) : (pintarBarraCentros(aula) + pintarGrupos(aula));
    if (!perfilPantalla && (!aula || formGrupo)) {
      h += pintarFormGrupo(!aula);
    }
    if (!perfilPantalla && aula) {
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
    rotularVolver();
    if (focoBorrar) {
      focoBorrar = false;
      var campoBorrar = raiz.querySelector('[data-metas="escribir-borrar"]');
      if (campoBorrar) campoBorrar.focus();
    }
    if (window.MetasCentro && d) window.MetasCentro.refrescar(d, aula && aula.id);
  }

  // El perfil es otra pantalla. Aquí solo queda el centro activo, el aviso
  // si todavía no hay ninguno, y el acceso para editarlo.
  function tienePerfil() {
    return centrosDelDocente().length > 0;
  }
  function centrosDelDocente() {
    return ((d && d.lista('centros')) || []).slice().sort(function (a, b) {
      // El que ya existía queda primero. El recién creado, sin fecha, va al final.
      var ac = a.created_at || '9999';
      var bc = b.created_at || '9999';
      return String(ac).localeCompare(String(bc)) || String(a.id).localeCompare(String(b.id));
    });
  }
  function centroActivoId() {
    var centros = centrosDelDocente();
    if (!centros.length) return null;
    if (vista.centro && centros.some(function (c) { return c.id === vista.centro; })) return vista.centro;
    var marca = (d.lista('aulas') || []).filter(function (a) { return a.id === vista.aula; })[0];
    if (marca && marca.centro_id && centros.some(function (c) { return c.id === marca.centro_id; })) return marca.centro_id;
    return centros[0].id;
  }
  function centroActivo() {
    var id = centroActivoId();
    return id ? (centrosDelDocente().filter(function (c) { return c.id === id; })[0] || null) : null;
  }
  function aulasVisibles() {
    var todas = aulas();
    var id = centroActivoId();
    if (!id) return todas;
    return todas.filter(function (a) { return a.centro_id === id; });
  }
  // Los grupos sin centro son de la primera institución. Solo se les
  // anota el vínculo: el grupo, sus notas y su lista no se tocan.
  function asegurarPrimerCentro() {
    if (!d || typeof d.editar !== 'function') return;
    var centros = centrosDelDocente();
    if (!centros.length) return;
    var primero = centros[0].id;
    (d.lista('aulas') || []).forEach(function (a) {
      if (!a.centro_id) {
        try { d.editar('aulas', a.id, { centro_id: primero }); }
        catch (e) { /* el grupo sigue en la lista */ }
      }
    });
  }
  function nombreMaestro(centro) {
    if (!centro) return '';
    if (centro.docente) return String(centro.docente);
    var hermana = (d.lista('aulas') || []).filter(function (a) {
      return a.centro_id === centro.id && a.docente_nombre;
    })[0];
    return hermana ? String(hermana.docente_nombre) : '';
  }
  function pintarSegmentos() {
    var centros = centrosDelDocente();
    var activo = centroActivoId();
    if (!centros.length) return '';
    var puedeQuitar = centros.length > 1;
    return '<div class="ma-seg ma-centros" role="group" aria-label="Tus centros">' + centros.map(function (c) {
      var on = !centroNuevo && c.id === activo;
      var nombre = '<button type="button" class="ma-seg-btn" data-metas="perfil-centro" data-accion="institucion" data-valor="'
        + esc(c.id) + '" aria-pressed="' + on + '">' + esc(c.nombre) + '</button>';
      // La papelera solo en el chip elegido, y nunca en el último centro vivo.
      if (puedeQuitar && on) {
        return '<span class="ma-seg-on">' + nombre
          + '<button type="button" class="ma-basura" data-metas="papelera-centro" data-accion="papelera-centro" aria-label="Archivar o borrar '
          + esc(c.nombre) + '">' + ICONO_BASURA + '</button></span>';
      }
      return nombre;
    }).join('') + '</div>';
  }
  function pintarBarraCentros() {
    var h = '<div class="ma-barra-centro">';
    if (!tienePerfil()) {
      h += '<div class="ma-puertas"><button type="button" class="ma-puerta" data-metas="aviso-perfil" data-accion="perfil">'
        + '<span class="ma-puerta-ic" aria-hidden="true">🏫</span>'
        + '<span class="ma-puerta-t"><b>Completa tu perfil institucional</b>'
        + '<span>Encabezado y logos de este centro</span></span>'
        + '<span class="ma-flecha" aria-hidden="true">›</span></button></div>';
    }
    h += pintarSegmentos();
    h += htmlZonaPapelera();
    h += htmlBotonArchivados();
    h += htmlListaArchivados();
    h += '<div class="ma-acciones">';
    if (tienePerfil()) {
      h += '<button type="button" class="ma-btn" data-metas="perfil-institucional" data-accion="perfil">Perfil institucional ›</button>';
      h += '<button type="button" class="ma-btn" data-metas="agregar-perfil" data-accion="agregar-perfil">+ Otro centro</button>';
    }
    h += '</div></div>';
    return h;
  }
  function gruposDel(id) {
    return (d.lista('aulas') || []).filter(function (a) { return a.centro_id === id; });
  }
  function centrosArchivados() {
    if (!d || typeof d.archivados !== 'function') return [];
    return d.archivados('centros').slice().sort(function (a, b) {
      return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es') || String(a.id).localeCompare(String(b.id));
    });
  }
  function frasePasarGrupos(n) {
    if (n === 1) return 'Primero pasa su grupo a otro centro.';
    return 'Primero pasa sus ' + n + ' grupos a otro centro.';
  }
  function esArchivado(id) {
    return centrosArchivados().some(function (c) { return c.id === id; });
  }
  function centroPorId(id) {
    return centrosDelDocente().filter(function (c) { return c.id === id; })[0]
      || centrosArchivados().filter(function (c) { return c.id === id; })[0]
      || null;
  }
  function piezasCentro(id) {
    var arch = esArchivado(id);
    var aulas = arch
      ? d.archivados('aulas').filter(function (a) { return a.centro_id === id; })
      : gruposDel(id);
    var ids = {};
    aulas.forEach(function (a) { ids[a.id] = 1; });
    var alumnos = (arch ? d.archivados('alumnos') : d.lista('alumnos')).filter(function (a) { return ids[a.aula_id]; });
    return { aulas: aulas, alumnos: alumnos.length };
  }
  function fraseArchivar(c) {
    var n = piezasCentro(c.id).aulas;
    if (n.length === 1) return '¿Archivar ' + c.nombre + ' y su grupo ' + grupo(n[0]) + '?';
    if (n.length > 1) return '¿Archivar ' + c.nombre + ' y sus ' + n.length + ' grupos?';
    return '¿Archivar ' + c.nombre + '?';
  }
  var FRASE_SOLO_ARCHIVAR = 'Tiene pagos o notas: solo se puede archivar.';
  function filasTodas(tabla) {
    var vivas = (d.lista(tabla) || []);
    var viejas = [];
    try { viejas = d.archivados(tabla) || []; } catch (e) { viejas = []; }
    return vivas.concat(viejas);
  }
  function tieneHistorial(centroId) {
    var aulas = {};
    filasTodas('aulas').forEach(function (a) {
      if (a.centro_id === centroId) aulas[a.id] = 1;
    });
    var gastos = {};
    var tablas = ['pagos', 'colectas', 'gastos', 'gastos_docente', 'bienes', 'notas', 'asistencia', 'notas_personalidad', 'colecta_exenciones'];
    var i;
    for (i = 0; i < tablas.length; i++) {
      if (filasTodas(tablas[i]).some(function (f) { return aulas[f.aula_id]; })) return true;
    }
    var convocatorias = {};
    filasTodas('convocatorias').forEach(function (cv) {
      if (aulas[cv.aula_id]) convocatorias[cv.id] = 1;
    });
    if (filasTodas('convocatoria_pagos').some(function (f) { return convocatorias[f.convocatoria_id]; })) return true;
    if (filasTodas('convocatoria_inscritos').some(function (f) { return convocatorias[f.convocatoria_id]; })) return true;
    filasTodas('gastos_docente').forEach(function (g) {
      if (aulas[g.aula_id]) gastos[g.id] = 1;
    });
    return filasTodas('reembolsos').some(function (r) { return gastos[r.gasto_id]; });
  }
  function fraseBorrar(c) {
    var p = piezasCentro(c.id);
    var g = p.aulas.length === 1 ? '1 grupo' : p.aulas.length + ' grupos';
    var a = p.alumnos === 1 ? '1 alumno' : p.alumnos + ' alumnos';
    return 'Se borrarán ' + c.nombre + ', ' + g + ' y ' + a + '.';
  }
  function htmlBarraCentro() {
    var on = Date.now() < barraCentroHasta;
    return '<div class="ma-barra-ok" data-metas="centro-listo" role="status" aria-label="Listo"'
      + (on ? '' : ' hidden') + '><span class="ma-barra-ok-linea" aria-hidden="true"></span></div>';
  }
  function htmlPasos(c) {
    var h = '<div class="ma-zona-archivar" data-metas="pasos-papelera">';
    if (pasoPapelera === 'elige') {
      h += '<p class="ma-confirma-t">' + esc(fraseArchivar(c)) + '</p><div class="ma-acciones">'
        + '<span class="ma-par"><button type="button" class="ma-btn" data-accion="papelera-archivar" data-metas="papelera-archivar">Archivar</button>'
        + '<span class="ma-pista">Puedes recuperarlo luego.</span></span>'
        + (tieneHistorial(c.id)
          ? '<p class="ma-nota" data-metas="solo-archivar">' + esc(FRASE_SOLO_ARCHIVAR) + '</p>'
          : '<button type="button" class="ma-btn ma-btn-peligro" data-accion="papelera-borrar" data-metas="papelera-borrar">Borrar para siempre</button>')
        + '<button type="button" class="ma-btn" data-accion="papelera-cancelar">Cancelar</button></div>';
    } else if (pasoPapelera === 'aviso1') {
      h += '<p class="ma-paso">Aviso 1 de 2</p><p class="ma-confirma-t" data-metas="aviso-borrar">' + esc(fraseBorrar(c)) + '</p>'
        + '<div class="ma-acciones"><button type="button" class="ma-btn" data-accion="papelera-seguir" data-metas="papelera-seguir">Seguir</button>'
        + '<button type="button" class="ma-btn" data-accion="papelera-cancelar">Cancelar</button></div>';
    } else if (pasoPapelera === 'aviso2') {
      h += '<p class="ma-paso">Aviso 2 de 2</p><p class="ma-confirma-t">No se puede deshacer. Escribe BORRAR para confirmar.</p>'
        + '<div class="ma-acciones"><input class="ma-inp ma-borrar-inp" data-metas="escribir-borrar" aria-label="Escribe BORRAR" autocomplete="off" autocapitalize="characters" spellcheck="false">'
        + '<button type="button" class="ma-btn ma-btn-peligro" data-accion="papelera-confirmar" data-metas="papelera-confirmar" disabled>Borrar para siempre</button>'
        + '<button type="button" class="ma-btn" data-accion="papelera-cancelar">Cancelar</button></div>';
    }
    return h + '</div>';
  }
  function htmlZonaPapelera() {
    var h = htmlBarraCentro();
    if (avisoLinea) h += '<p class="ma-confirma-t" data-metas="aviso-papelera" role="status">' + esc(avisoLinea) + '</p>';
    if (pasoPapelera && pasoCentro && !esArchivado(pasoCentro)) {
      var c = centroPorId(pasoCentro);
      if (c) h += htmlPasos(c);
    }
    return h;
  }
  function htmlBotonArchivados() {
    var n = centrosArchivados().length;
    if (!n) return '';
    return '<button type="button" class="ma-chip-arch" data-metas="archivados" data-accion="archivados" aria-expanded="'
      + archivadosAbiertos + '">Archivados (' + n + ')</button>';
  }
  function htmlListaArchivados() {
    if (!centrosArchivados().length || !archivadosAbiertos) return '';
    return '<ul class="ma-lista-arch">' + centrosArchivados().map(function (c) {
      var h = '<li><div class="ma-fila-arch"><span>' + esc(c.nombre) + '</span>'
        + '<button type="button" class="ma-btn" data-metas="recuperar-centro" data-accion="recuperar-centro" data-valor="'
        + esc(c.id) + '">Recuperar</button>'
        + (tieneHistorial(c.id)
          ? '<p class="ma-nota" data-metas="solo-archivar">' + esc(FRASE_SOLO_ARCHIVAR) + '</p>'
          : '<button type="button" class="ma-btn ma-btn-peligro" data-metas="borrar-archivado" data-accion="borrar-archivado" data-valor="'
            + esc(c.id) + '">Borrar para siempre</button>')
        + '</div>';
      if (choqueArchivo && choqueArchivo.id === c.id) {
        h += '<p class="ma-linea-choque" data-metas="choque-archivo">' + esc(choqueArchivo.texto) + '</p>';
      }
      if (pasoPapelera && pasoCentro === c.id) h += htmlPasos(c);
      return h + '</li>';
    }).join('') + '</ul>';
  }
  function prepararSalidaCentro() {
    if (!barraAlSalir || !d) return;
    var vivo = centrosDelDocente().some(function (c) { return c.id === barraAlSalir; });
    var archivado = esArchivado(barraAlSalir);
    if (vivo) return;
    // Archivar: ya está en Archivados y toca la barra. Borrar: ya no está en ningún lado.
    if (alSalirConBarra && !archivado) return;
    if (!alSalirConBarra && archivado) return;
    var id = barraAlSalir;
    var orden = ordenAlArchivar || [];
    var conBarra = alSalirConBarra;
    barraAlSalir = null;
    ordenAlArchivar = null;
    alSalirConBarra = false;
    var ids = centrosDelDocente().map(function (c) { return c.id; });
    var i = orden.indexOf(id);
    var sig = null;
    var k;
    for (k = i + 1; k < orden.length; k++) if (ids.indexOf(orden[k]) >= 0) { sig = orden[k]; break; }
    if (!sig) for (k = i - 1; k >= 0; k--) if (ids.indexOf(orden[k]) >= 0) { sig = orden[k]; break; }
    if (sig) {
      vista.centro = sig;
      var del = (d.lista('aulas') || []).filter(function (a) { return a.centro_id === sig; });
      if (!del.some(function (a) { return a.id === vista.aula; })) vista.aula = del[0] ? del[0].id : null;
      guardarPref();
    }
    if (!conBarra) return;
    barraCentroHasta = Date.now() + 2000;
    if (barraCentroTimer) clearTimeout(barraCentroTimer);
    barraCentroTimer = setTimeout(function () {
      barraCentroTimer = null;
      if (Date.now() >= barraCentroHasta) pintar();
    }, 2000);
  }
  function cerrarPapelera() {
    pasoPapelera = '';
    pasoCentro = null;
    avisoLinea = '';
  }
  function sinSenalPapelera() {
    if (!d.sinSenal()) return false;
    avisoLinea = 'Sin señal. No se cambió nada.';
    pintar();
    return true;
  }
  function pintarPantallaPerfil(aula) {
    var h = pintarSegmentos();
    h += htmlZonaPapelera();
    h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="agregar-perfil" data-accion="agregar-perfil" aria-pressed="'
      + centroNuevo + '">+ Otro centro</button>';
    h += htmlBotonArchivados();
    h += '<button type="button" class="ma-btn ma-btn-chico" data-accion="ayuda-perfil" aria-expanded="' + ayudaPerfil + '" aria-label="Ayuda">ⓘ</button></div>';
    h += htmlListaArchivados();
    if (ayudaPerfil) h += '<ol class="ma-ayuda">' + AYUDA_PERFIL.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>';
    h += pintarEncabezado(aula, centroNuevo ? 'nuevo' : null);
    return h;
  }
  function rotularVolver() {
    var b = document.getElementById('mi-aula-back-btn');
    if (!b) return;
    var t = perfilPantalla ? 'Volver a Mi aula'
      : (colectaAbierta || controlAbierto || subAlumnos) ? 'Volver'
      : 'Volver a la Zona Docente';
    b.setAttribute('aria-label', t);
    var s = b.querySelector('.back-txt');
    if (s) s.textContent = 'Volver';
    var titulo = document.querySelector('#view-mi-aula .view-title');
    if (titulo) titulo.textContent = perfilPantalla ? 'Perfil' : 'Mi aula';
  }
  function abrirPerfil(nuevo) {
    centroNuevo = !!nuevo;
    perfilPantalla = true;
    ayudaPerfil = false;
    confirmarArchivo = false;
    avisoArchivo = '';
    choqueArchivo = null;
    pintar();
    var marco = document.querySelector('#view-mi-aula .view-scroll');
    if (marco) marco.scrollTop = 0;
  }

  function pintarGrupos(aula) {
    var todas = aulasVisibles();
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
    var centro = centroActivo();
    var a = aulaActual();
    var escuela = centro ? centro.nombre : (a ? a.escuela : '');
    var titulo = primero ? (centro ? '🏫 Grupo de este centro' : '🏫 Tu grupo') : '🏫 Otro grupo';
    var nota = primero
      ? (centro ? 'Este centro todavía no tiene grupos.' : 'Escribe los datos de tu grupo para empezar.')
      : 'Un grupo nuevo tiene su propia lista, economía, asistencia y notas.';
    return '<form class="ma-card ma-form" data-form="aula" data-metas="form-grupo">'
      + '<h2 class="ma-h">' + titulo + '</h2>'
      + '<p class="ma-nota">' + nota + '</p>'
      + '<label class="ma-campo"><span>Escuela</span><input class="ma-inp" name="escuela" required maxlength="160" value="'
      + esc(escuela) + '" autocomplete="off"></label>'
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
    if (subAlumnos === 'sace') return pintarListaSace(aula);
    if (subAlumnos === 'datos-sace') return pintarDatosSace(aula);
    if (subAlumnos === 'sin-sexo') return pintarSinSexo(aula);
    var lista = alumnos(aula);
    var h = '<div class="ma-card ma-card-grupo"><div><p class="ma-grupo-grande">' + esc(grupo(aula)) + '</p>'
      + '<p class="ma-nota">' + esc(aula.escuela) + ' · ' + esc(aula.anio_lectivo) + '</p></div>'
      + '<p class="ma-cifra" aria-label="' + enAula(aula).length + ' alumnos en el aula"><b>' + enAula(aula).length + '</b> en el aula</p></div>';
    h += '<div class="ma-card"><div class="ma-card-cab"><h2 class="ma-h">Mis alumnos</h2>'
      + '<button type="button" class="ma-btn" data-metas="ir-carga-rapida" data-accion="carga">📋 Pegar una lista</button></div>';
    // Debajo de «Pegar una lista», en su renglón: la cabecera queda como siempre.
    if (lista.length) {
      h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="claves-preparar" data-accion="claves-preparar">'
        + '🔑 Preparar claves de familia</button></div>';
      // Las tiras salen de lo que ya está en el aparato: imprimen sin señal.
      h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="tiras-claves" data-accion="imprimir" data-valor="tiras">'
        + '🖨️ Tiras de claves (QR)</button></div>';
      h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="lista-sace-abrir" data-accion="lista-sace">'
        + '📥 Importar lista del SACE</button></div>';
      var oficiales = lista.filter(function (a) { return a.en_sace === true; }).length;
      if (oficiales) {
        h += '<p class="ma-nota" data-metas="lista-sace-cuenta">📥 En la lista oficial del SACE: <b>' + oficiales + '</b> de '
          + lista.length + '. Los cuadros y las estadísticas cuentan solo a esos.</p>';
      }
      h += avisoSinSexo(aula);
      // Los que siguen en el aula y faltan en el SACE: la hoja para
      // registrarlos allá, con lo que el SACE pide.
      var pendientes = window.SaceLista ? window.SaceLista.datosParaSace(lista).length : 0;
      if (pendientes) {
        h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-metas="datos-sace-abrir" data-accion="datos-sace">'
          + '📝 Datos para el SACE (' + pendientes + ')</button></div>';
      }
    }
    if (!lista.length) h += '<p class="ma-nota">Todavía no hay alumnos. Escríbelos uno por uno o pega la lista completa.</p>';
    h += pintarClaves(aula);
    // La clave de cada familia, solo para leer: la pone la base y no se
    // cambia desde aquí (metas.t_clave_familia).
    var fichaDe = {};
    d.lista('familias', { aula_id: aula.id }).forEach(function (f) { fichaDe[f.alumno_id] = f; });
    h += '<ul class="ma-lista">' + lista.map(function (a) {
      var abierto = alumnoAbierto === a.id;
      var r = '<li class="ma-al' + (sigue(a) ? '' : ' ma-al-fuera') + '" data-metas="alumno">'
        + '<button type="button" class="ma-al-btn" data-accion="alumno" data-valor="' + esc(a.id) + '" aria-expanded="' + abierto + '">'
        + '<span class="ma-num">' + esc(num(a)) + '</span><span class="ma-nom">' + esc(a.nombre_completo) + '</span>'
        + claveEnLista(a, fichaDe[a.id])
        + (sigue(a) ? '' : '<span class="ma-etq">' + esc(nombreEstado(a.estado)) + '</span>')
        + '<span class="ma-flecha" aria-hidden="true">›</span></button>'
        + avisoFicha(a);
      if (abierto) {
        r += pintarFicha(a);
        r += '<div class="ma-al-edit" role="group" aria-label="Situación de ' + esc(a.nombre_completo) + '">'
          + ['activo', 'retirado', 'trasladado', 'desertor'].map(function (e) {
            var on = (a.estado || 'activo') === e;
            return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="estado" data-alumno="'
              + esc(a.id) + '" data-valor="' + e + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + esc(nombreEstado(e)) + '</button>';
          }).join('') + '</div>'
          + '<div class="ma-al-edit" role="group" aria-label="' + esc('Clave de familia de ' + a.nombre_completo) + '">'
          + '<button type="button" class="ma-btn ma-btn-chico" data-metas="tira-alumno" data-accion="tira-alumno" data-alumno="'
          + esc(a.id) + '">🖨️ Su tira</button>'
          + (fichaDe[a.id] && fichaDe[a.id].clave ? botonesCompartir(a) : '') + '</div>';
      }
      return r + '</li>';
    }).join('') + '</ul>';
    // Alta rápida: nombre y sexo (obligatorio, como en el SACE); la
    // identidad es opcional y la marca del SACE se puede poner después.
    h += '<form class="ma-form ma-alta" data-form="alumno" data-metas="alta-alumno"><label class="ma-oculto" for="ma-nuevo-al">Nombre completo</label>'
      + '<input class="ma-inp" id="ma-nuevo-al" name="nombre" placeholder="Nombre completo de otro alumno" required minlength="3" maxlength="120" autocomplete="off">'
      + '<fieldset class="ma-sexo"><legend>Sexo</legend>'
      + '<label class="ma-opcion"><input type="radio" name="sexo" value="F" required data-metas="alta-sexo-f"> Niña (F)</label>'
      + '<label class="ma-opcion"><input type="radio" name="sexo" value="M" required data-metas="alta-sexo-m"> Niño (M)</label></fieldset>'
      + '<label class="ma-campo"><span>Identidad (si la tienes)</span><input class="ma-inp" name="identidad" inputmode="numeric" maxlength="15" '
      + 'placeholder="0801-2015-01234" autocomplete="off" data-metas="alta-identidad"></label>'
      + '<label class="ma-opcion"><input type="checkbox" name="en_sace" value="1" data-metas="alta-en-sace"> Ya está registrado en el SACE</label>'
      + '<button class="ma-btn ma-btn-1" type="submit">Agregar</button></form></div>';
    return h;
  }
  // Debajo del nombre, en letra chica: lo que le falta a la ficha. Nada
  // dicho solo con color.
  function avisoFicha(a) {
    if (!sigue(a)) return '';
    var t = [];
    if (a.en_sace !== true) t.push('Aún no está en el SACE: no cuenta en estadísticas');
    if (a.sexo !== 'F' && a.sexo !== 'M') t.push('⚠ Falta el sexo');
    if (!t.length) return '';
    return '<p class="ma-al-aviso" data-metas="alumno-sin-sace">' + esc(t.join(' · ')) + '</p>';
  }
  // La ficha del alumno abierto: sexo y marca del SACE de un toque, y la
  // identidad, la fecha de nacimiento y el número del SACE con «Guardar».
  function pintarFicha(a) {
    var sexoBtn = function (v, t) {
      var on = a.sexo === v;
      return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="ficha-sexo" data-alumno="'
        + esc(a.id) + '" data-valor="' + v + '" aria-pressed="' + on + '" data-metas="ficha-sexo">' + (on ? '✓ ' : '') + t + '</button>';
    };
    return '<div class="ma-al-ficha" data-metas="ficha-alumno">'
      + '<div class="ma-al-edit" role="group" aria-label="' + esc('Sexo de ' + a.nombre_completo) + '">'
      + sexoBtn('F', 'Niña (F)') + sexoBtn('M', 'Niño (M)') + '</div>'
      + '<div class="ma-al-edit"><label class="ma-opcion ma-opcion-sace"><input type="checkbox" data-accion="en-sace" data-alumno="' + esc(a.id) + '"'
      + (a.en_sace === true ? ' checked' : '') + ' data-metas="alumno-en-sace"> Registrado en SACE</label></div>'
      + '<form class="ma-al-edit ma-ficha-form" data-form="ficha" data-alumno="' + esc(a.id) + '">'
      + '<label class="ma-campo"><span>Identidad (opcional)</span><input class="ma-inp" name="identidad" inputmode="numeric" maxlength="25" autocomplete="off" value="'
      + esc(a.identidad ? ((a.documento_pais || 'HN') === 'HN' && window.SaceLista ? window.SaceLista.idnBonita(a.identidad) : a.identidad) : '') + '"></label>'
      + '<label class="ma-campo"><span>Fecha de nacimiento</span><input class="ma-inp" type="date" name="fecha_nacimiento" value="'
      + esc(a.fecha_nacimiento || '') + '"></label>'
      + '<label class="ma-campo"><span>N.º en el SACE (opcional)</span><input class="ma-inp" name="sace_num" inputmode="numeric" maxlength="3" value="'
      + esc(a.sace_num == null ? '' : a.sace_num) + '"></label>'
      + '<button class="ma-btn" type="submit" data-metas="ficha-guardar">Guardar ficha</button></form></div>';
  }

  // ── ♀♂ Fichas del SACE sin sexo ────────────────────────────────────────
  // Las fichas de antes de v577 pueden no tener sexo. Los cuadros las cuentan
  // en T y no en N ni en V, así que N + V deja de dar el total y en la hoja
  // no se nota. Aquí se dice con números, antes de imprimir. El sexo lo pone
  // el maestro con un toque: nunca se adivina por el nombre.
  function avisoSinSexo(aula) {
    var c = window.SaceLista ? window.SaceLista.sexosSace(alumnos(aula)) : null;
    if (!c || !c.sinSexo.length) return '';
    var n = c.sinSexo.length, uno = n === 1;
    return '<div class="ma-aviso-rec ma-aviso-sexo" role="status" data-metas="sace-sin-sexo">'
      + '<p class="ma-aviso-sexo-t"><b>⚠ ' + n + (uno ? ' alumno del SACE sin sexo: no sale' : ' alumnos del SACE sin sexo: no salen')
      + ' en N/V. Complét' + (uno ? 'alo' : 'alos') + '.</b><br>'
      + '<span data-metas="sace-sin-sexo-cuenta">Del SACE: ' + c.total + ' = ' + c.N + (c.N === 1 ? ' niña' : ' niñas') + ' (N) + '
      + c.V + (c.V === 1 ? ' varón' : ' varones') + ' (V) + ' + n + ' sin sexo. En los cuadros, N + V da ' + (c.N + c.V)
      + ' y no ' + c.total + ' mientras falte' + (uno ? '' : 'n') + '.</span></p>'
      + '<button type="button" class="ma-btn" data-accion="sin-sexo" data-metas="sin-sexo-abrir">♀♂ Completar '
      + (uno ? 'su ficha' : 'las ' + n + ' fichas') + '</button></div>';
  }
  function pintarSinSexo(aula) {
    var todos = alumnos(aula);
    var ids = sinSexoIds || window.SaceLista.sexosSace(todos).sinSexo.map(function (a) { return a.id; });
    var fichas = todos.filter(function (a) { return ids.indexOf(a.id) >= 0; });
    var faltan = fichas.filter(function (a) { return a.sexo !== 'F' && a.sexo !== 'M'; }).length;
    var h = '<button type="button" class="ma-volver" data-accion="alumnos">‹ Mis alumnos</button>'
      + '<div class="ma-card" data-metas="sin-sexo"><div class="ma-card-cab"><h2 class="ma-h">♀♂ Alumnos del SACE sin sexo</h2></div>'
      + '<p class="ma-nota" data-metas="sin-sexo-faltan">' + (faltan
        ? (faltan === 1 ? 'Falta 1' : 'Faltan ' + faltan) + ' de ' + fichas.length
          + '. Toca Niña (F) o Niño (M) como sale en la lista del SACE o en su partida.'
        : '✓ Listo: ' + (fichas.length === 1 ? 'la ficha ya tiene' : 'las ' + fichas.length + ' fichas ya tienen')
          + ' sexo. Ahora N + V da el total del SACE.') + '</p>'
      + avisoSinSexo(aula).replace(/<button[\s\S]*?<\/button>/, '');
    h += '<ul class="ma-lista">' + fichas.map(function (a) {
      var b = function (v, t) {
        var on = a.sexo === v;
        return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="ficha-sexo" data-alumno="'
          + esc(a.id) + '" data-valor="' + v + '" aria-pressed="' + on + '" data-metas="ficha-sexo">' + (on ? '✓ ' : '') + t + '</button>';
      };
      return '<li class="ma-al" data-metas="sin-sexo-fila"><p class="ma-renglon"><span class="ma-num">' + esc(num(a)) + '</span>'
        + '<span class="ma-nom">' + esc(a.nombre_completo) + '</span></p>'
        + '<div class="ma-al-edit" role="group" aria-label="' + esc('Sexo de ' + a.nombre_completo) + '">'
        + b('F', 'Niña (F)') + b('M', 'Niño (M)') + '</div></li>';
    }).join('') + '</ul>';
    return h + '</div>';
  }

  // ── 📝 Datos para el SACE ──────────────────────────────────────────────
  // Las fichas que siguen en el aula y no están en el SACE, con lo que el
  // SACE pide para registrarlas. Lo que falta va en blanco y se dice.
  function pintarDatosSace(aula) {
    var filas = window.SaceLista.datosParaSace(alumnos(aula));
    var h = '<button type="button" class="ma-volver" data-accion="alumnos">‹ Mis alumnos</button>'
      + '<div class="ma-card" data-metas="datos-sace"><div class="ma-card-cab"><h2 class="ma-h">📝 Datos para el SACE</h2>'
      + (filas.length ? '<button type="button" class="ma-btn" data-accion="datos-sace-imprimir" data-metas="datos-sace-imprimir">🖨️ Imprimir</button>' : '')
      + '</div><p class="ma-nota">' + (filas.length
        ? esc(grupo(aula)) + ': ' + filas.length + (filas.length === 1 ? ' alumno que todavía no está' : ' alumnos que todavía no están')
          + ' en el SACE. Regístralos allá y luego marca «Registrado en SACE» en su ficha (o importa la lista del SACE).'
        : 'Todos tus alumnos ya están en el SACE.') + '</p>';
    if (filas.length) {
      h += '<ul class="ma-lista">' + filas.map(function (f) {
        return '<li class="ma-renglon ma-fila-col" data-metas="datos-sace-fila"><span class="ma-nom">#' + esc(f.num) + ' ' + esc(f.nombre) + '</span>'
          + '<span class="ma-sub">Identidad: ' + esc(f.identidad || '(sin identidad)') + ' · Sexo: ' + esc(f.sexo || '⚠ falta')
          + ' · Nacimiento: ' + esc(f.fecha_nacimiento ? fechaSace(f.fecha_nacimiento) : '⚠ falta') + '</span></li>';
      }).join('') + '</ul>';
    }
    return h + '</div>';
  }
  // Una hoja carta, letra del cuerpo sin achicar. Se arma con lo que hay
  // en el aparato: imprime sin señal.
  function imprimirDatosSace(aula) {
    var filas = window.SaceLista.datosParaSace(alumnos(aula));
    if (!filas.length) return;
    var fn = function (f) { return f ? f.slice(8, 10) + '/' + f.slice(5, 7) + '/' + f.slice(0, 4) : ''; };
    var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>' + esc('Datos para el SACE · ' + grupo(aula)) + '</title><style>'
      + '@page{size:letter;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#0f2350;font-size:12px;margin:0}'
      + 'h1{font-size:16px;margin:0 0 2px}p{margin:0 0 8px;color:#33415c}table{border-collapse:collapse;width:100%}'
      + 'th,td{border:1px solid #9aa6bd;padding:5px 6px;text-align:left;vertical-align:top}th{background:#eaf0fa;font-size:11px}'
      + 'td.c{text-align:center}.vacio{height:22px}</style></head><body>'
      + '<h1>Datos para registrar en el SACE</h1><p>' + esc((aula.escuela || '') + ' · ' + grupo(aula) + ' · ' + (aula.anio_lectivo || ''))
      + ' · ' + filas.length + (filas.length === 1 ? ' alumno' : ' alumnos') + ' · ' + esc(fn(hoy())) + '</p>'
      + '<table><thead><tr><th>#</th><th>Nombre completo</th><th>Identidad</th><th>Sexo</th><th>Fecha de nacimiento</th><th>Registrado ✓</th></tr></thead><tbody>'
      + filas.map(function (f) {
        return '<tr><td class="c">' + esc(f.num) + '</td><td>' + esc(f.nombre) + '</td><td>' + esc(f.identidad) + '</td><td class="c">'
          + esc(f.sexo) + '</td><td>' + esc(fn(f.fecha_nacimiento)) + '</td><td></td></tr>';
      }).join('') + '</tbody></table>'
      + '<p style="margin-top:8px">Lo que está en blanco falta en la ficha de Mi aula: complétalo al registrarlo en el SACE.</p>'
      + '<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script></body></html>';
    if (typeof window.adPrintAbrir === 'function') return window.adPrintAbrir(html);
    var w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }
  function nombreEstado(e) {
    return { activo: 'En el aula', ingreso: 'Ingresó', retirado: 'Retirado', trasladado: 'Trasladado', desertor: 'Desertor' }[e] || e;
  }
  // Con ficha y clave: la clave, como la lee la familia. Con ficha recién
  // anotada sin señal, la clave todavía no existe (la sortea la base). Sin
  // ficha, se dice; a quien ya no está en el aula no se le pide.
  // El espacio de adelante separa la clave del nombre al leerlo en voz alta
  // (y al copiarlo): sin él, quedaría «Ana López15-K7QM».
  function claveEnLista(a, f) {
    if (f && f.clave) {
      var k = window.MetasDatos.clavesFamilia.bonita(f.clave);
      return '<span class="ma-sub ma-al-clave" data-metas="alumno-clave"> <span aria-hidden="true">🔑</span> ' + esc(k) + '</span>';
    }
    if (f) return '<span class="ma-sub ma-al-clave" data-metas="alumno-clave"> <span aria-hidden="true">🔑</span> clave de familia: llega con señal</span>';
    return sigue(a) ? '<span class="ma-sub ma-al-clave" data-metas="alumno-clave" data-estado="sin"> sin clave de familia</span>' : '';
  }

  // ── Compartir la clave de una familia ──────────────────────────────────
  // «Copiar» y WhatsApp, al lado de «Su tira», solo si el alumno ya tiene su
  // clave en metas.familias. El ícono es el de WhatsApp, con su verde.
  var ICONO_WHATSAPP = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">'
    + '<path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199'
    + '-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446'
    + '-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371'
    + '-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709'
    + '.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198'
    + '-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45'
    + ' 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11'
    + '.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h'
    + '.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  function botonesCompartir(a) {
    return '<button type="button" class="ma-btn ma-btn-chico" data-metas="clave-copiar" data-accion="clave-copiar" data-alumno="'
      + esc(a.id) + '">📋 Copiar</button>'
      + '<button type="button" class="ma-btn ma-btn-chico" data-metas="clave-whatsapp" data-accion="clave-whatsapp" data-alumno="'
      + esc(a.id) + '" aria-label="Enviar por WhatsApp">' + ICONO_WHATSAPP + '</button>';
  }
  function mensajeClave(alumnoId) {
    var a = d.lista('alumnos', { id: alumnoId })[0];
    var f = d.lista('familias', { alumno_id: alumnoId })[0];
    if (!a || !f || !f.clave) return '';
    var C = window.MetasDatos.clavesFamilia;
    var k = typeof window.adClaveBonita === 'function' ? window.adClaveBonita(f.clave, a.num_lista) : C.bonita(f.clave);
    return C.mensaje(a.nombre_completo, k);
  }
  // El portapapeles moderno pide una página segura; si no está, el de antes.
  function copiarTexto(t) {
    function aLaAntigua() {
      var ta = document.createElement('textarea');
      ta.value = t;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      return ok;
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(t).then(function () { return true; }, aLaAntigua);
    }
    return Promise.resolve(aLaAntigua());
  }
  function compartirClave(alumnoId, como) {
    var t = mensajeClave(alumnoId);
    if (!t) return;
    if (como === 'copiar') {
      return copiarTexto(t).then(function (ok) {
        if (typeof window.toast === 'function') window.toast(ok ? 'Copiado' : 'No se pudo copiar');
      });
    }
    // Como el resto de la app: en el navegador abre otra pestaña; en la app
    // de Android, Capacitor manda los enlaces de otro dominio fuera de la app
    // (a WhatsApp) y Mi aula se queda donde estaba.
    window.open(window.MetasDatos.clavesFamilia.enlaceWhatsApp(t), '_blank');
  }

  // ── 🔑 Preparar las claves de familia (js/datos/claves-familia.js) ─────
  // Cada alumno sin ficha recibe una clave NUEVA (la pone la base): una
  // línea de vista previa y nada se guarda hasta tocar «Guardar». Solo el
  // aula que se ve.
  function pintarClaves(aula) {
    if (!claves || claves.aula !== aula.id) return '';
    var h = '<div data-metas="claves">';
    if (claves.frase) h += '<p class="ma-aviso" role="alert" data-metas="claves-aviso">✗ ' + esc(claves.frase) + '</p>';
    if (claves.aviso) h += '<p class="ma-nota ma-nota-ok" role="status" data-metas="claves-listo">✓ ' + esc(claves.aviso) + '</p>';
    if (!claves.plan) return h + '</div>';
    var r = claves.plan.resumen;
    h += '<p class="ma-nota" data-metas="claves-vista-previa">' + (r.nuevos
      ? '<b>Se crearán ' + r.nuevos + (r.nuevos === 1 ? ' clave nueva' : ' claves nuevas') + '</b> · ' + r.ya
        + (r.ya === 1 ? ' ya tenía la suya' : ' ya tenían la suya')
      : 'Todos tus alumnos ya tienen su clave') + '</p>';
    h += '<div class="ma-acciones"><button type="button" class="ma-btn" data-accion="claves-cancelar">Cancelar</button>'
      + '<button type="button" class="ma-btn ma-btn-1" data-accion="claves-guardar" data-metas="claves-guardar"' + (r.nuevos ? '' : ' disabled')
      + '>Guardar</button></div>';
    return h + '</div>';
  }
  // Lee, con señal, las fichas de TODAS las aulas del docente: una ficha
  // creada en otro aparato cuenta como «ya tenía la suya». Sin señal no se
  // arma nada.
  function clavesAbrir(aula) {
    var n = window.MetasDatos && window.MetasDatos._nube;
    var sinSenal = 'Para preparar las claves de familia se necesita señal. Vuelve a tocar el botón cuando tengas.';
    if (!n || d.sinSenal()) {
      claves = { aula: aula.id, frase: sinSenal };
      return pintar();
    }
    claves = { aula: aula.id };
    return n.leer('familias?select=id,alumno_id&deleted_at=is.null').catch(function () { return null; })
      .then(function (familias) {
        if (!claves || claves.aula !== aula.id) return;
        if (!familias) { claves.frase = sinSenal; return pintar(); }
        return window.MetasDatos.clavesFamilia.preparar(d, aula.id, { familias: familias })
          .then(function (plan) { if (claves && claves.aula === aula.id) { claves.plan = plan; pintar(); } });
      })
      .catch(function (e) { claves = { aula: aula.id, frase: frase(e) }; pintar(); });
  }
  // «Guardar» se apaga en cuanto se toca; y aunque llegara dos veces, los
  // ids salen del alumno: la misma ficha no se anota dos veces.
  function clavesGuardar() {
    if (!claves || !claves.plan || claves.guardando) return;
    claves.guardando = true;
    var b = document.querySelector('[data-metas="claves-guardar"]');
    if (b) b.disabled = true;
    var aulaId = claves.aula;
    window.MetasDatos.clavesFamilia.guardar(d, claves.plan).then(function (r) {
      claves = { aula: aulaId, aviso: 'Listo: ' + r.guardados + (r.guardados === 1 ? ' clave nueva' : ' claves nuevas')
        + '. Entrega su tira del talonario.' };
      pintar();
    }).catch(function (e) {
      claves.guardando = false;
      claves.frase = frase(e);
      pintar();
    });
  }

  function pintarCarga() {
    return '<button type="button" class="ma-volver" data-accion="alumnos">‹ Mis alumnos</button>'
      + '<form class="ma-card ma-form" data-form="carga-vista"><h2 class="ma-h">📋 Pegar una lista</h2>'
      + '<label class="ma-campo"><span>Un nombre por renglón, con F (niña) o M (niño) al final. Si tienes la identidad, va después.</span>'
      + '<textarea class="ma-inp" name="pegado" rows="8" data-metas="carga-pegar">' + esc(cargaTexto) + '</textarea></label>'
      + '<div class="ma-acciones"><button class="ma-btn" type="submit" data-metas="carga-vista-previa">Ver cómo queda</button></div></form>'
      + (avisoCarga ? '<p class="ma-nota ma-nota-ok" role="status">' + esc(avisoCarga) + '</p>' : '')
      + (cargaFilas.length ? '<div class="ma-card"><ol class="ma-lista ma-lista-previa">' + cargaFilas.map(function (f, i) {
        // El sexo es obligatorio en la ficha: si el renglón no lo trae, se
        // elige aquí con un toque.
        return '<li class="ma-renglon" data-metas="carga-fila"><span class="ma-nom">' + esc(f.nombre) + '</span>'
          + (f.identidad ? '<span class="ma-sub">' + esc(f.identidad) + '</span>' : '')
          + '<span class="ma-al-edit ma-carga-sexo" role="group" aria-label="' + esc('Sexo de ' + f.nombre) + '">'
          + [['F', 'Niña (F)'], ['M', 'Niño (M)']].map(function (x) {
            var on = f.sexo === x[0];
            return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="carga-sexo" data-fila="' + i
              + '" data-valor="' + x[0] + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + x[1] + '</button>';
          }).join('') + '</span></li>';
      }).join('') + '</ol>' + (cargaSinSexo() ? '<p class="ma-nota" role="status" data-metas="carga-falta-sexo">⚠ Falta el sexo de '
        + cargaSinSexo() + ': tócalo en cada renglón.</p>' : '') + '</div>' : '')
      + '<div class="ma-acciones"><button type="button" class="ma-btn ma-btn-1" data-metas="carga-guardar" data-accion="carga-guardar"'
      + (cargaFilas.length && !cargaSinSexo() ? '' : ' disabled') + '>Agregar a la lista</button></div>'
      + pintarImportar();
  }

  // ── 📂 Importar un archivo (04-FORMATO-IMPORTACION.md) ─────────────────
  // Todo pasa por esta vista previa: nada se guarda hasta tocar «Guardar».
  // Lo que ya estaba no se toca; lo que cambia un dato guardado viene sin
  // marcar; lo que tiene error no se guarda y dice por qué (04, 4.3 y 4.4).
  var NOMBRE_SECCION = { asignaturas: 'Asignaturas', alumnos: 'Alumnos', familias: 'Familias', notas: 'Notas',
    colectas: 'Colectas', exenciones: 'No les corresponde', pagos: 'Pagos', gastos: 'Gastos de colecta',
    gastosDocente: 'Gastos de mi bolsillo', reembolsos: 'Lo que me devolvieron', inventario: 'Inventario' };
  function pintarImportar() {
    var h = '<div class="ma-card" data-metas="importar"><div class="ma-card-cab"><h2 class="ma-h">📂 Importar un archivo</h2>'
      + '<button type="button" class="ma-btn" data-accion="importar-elegir" data-metas="importar-elegir">Elegir el archivo</button></div>'
      + '<p class="ma-nota">El archivo de importación de M.E.T.A.S: lista, familias, notas, colectas, gastos e inventario. '
      + 'Antes de guardar ves todo lo que trae.</p>';
    if (importe && importe.frase) h += '<p class="ma-aviso" role="alert">✗ ' + esc(importe.frase) + '</p>';
    if (importe && importe.aviso) h += '<p class="ma-nota ma-nota-ok" role="status" data-metas="importar-listo">✓ ' + esc(importe.aviso) + '</p>';
    if (!importe || !importe.plan) return h + '</div>';
    var p = importe.plan;
    var r = p.resumen;
    var fila = function (txt, n, marca, extra) {
      return '<li class="ma-renglon"><span class="ma-nom">' + txt + '</span><span class="ma-sub">' + n + ' ' + marca + '</span>'
        + (extra || '') + '</li>';
    };
    h += '<div data-metas="importar-vista-previa"><p class="ma-nota"><b>Vas a guardar en ' + esc(p.aula.texto) + '</b>'
      + (p.aula.estado === 'nuevo' ? ' (grupo nuevo)' : '') + '</p><ul class="ma-lista">'
      + fila('Nuevos', r.nuevos, '✓')
      + fila('Ya estaban', r.ya, '(no se tocan)')
      + (r.cambian ? fila('Cambian un dato guardado', r.cambian, '⚠ sin marcar') : '')
      + (r.revisar ? fila('Para revisar (se leyó con duda)', r.revisar, '⚠ revisar') : '')
      + (r.preguntas ? fila('Falta que respondas', r.preguntas, '⚠') : '')
      + (r.espera ? fila('Esperan a que decidas la diferencia', r.espera, '⚠') : '')
      + (r.errores ? fila('No se pueden guardar', r.errores, '✗') : '')
      + '</ul>';
    // Una línea por sección, con lo que trae.
    h += '<ul class="ma-lista">' + Object.keys(NOMBRE_SECCION).filter(function (k) { return p[k].length; }).map(function (k) {
      var c = r.porSeccion[k] || {};
      var partes = [];
      if (c.nuevo || c.cambia) partes.push(((c.nuevo || 0) + (c.cambia || 0)) + ' nuevos ✓');
      if (c.ya_estaba) partes.push(c.ya_estaba + ' ya estaban');
      if (c.error) partes.push(c.error + ' no se guardan ✗');
      return '<li class="ma-renglon" data-metas="importar-seccion" data-seccion="' + k + '"><span class="ma-nom">'
        + esc(NOMBRE_SECCION[k]) + '</span><span class="ma-sub">' + esc(partes.join(' · ')) + '</span></li>';
    }).join('') + '</ul>';
    // Lo que pide atención: preguntas, diferencias, cambios, errores y dudas.
    var atencion = [];
    Object.keys(NOMBRE_SECCION).forEach(function (k) {
      p[k].forEach(function (f) {
        var t = '';
        if (f.pregunta) {
          t += '<p class="ma-nota">⚠ ' + esc(f.pregunta.texto) + '</p><div class="ma-botones">'
            + f.pregunta.botones.map(function (b) {
              var on = (importe.decisiones || {})[f.pregunta.clave] === b.valor;
              return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="importar-decidir" data-clave="'
                + esc(f.pregunta.clave) + '" data-valor="' + esc(b.valor) + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + esc(b.etiqueta) + '</button>';
            }).join('') + '</div>';
        }
        if (f.estado === 'cambia' || f.estado === 'cambia_sin_marcar') {
          var on = f.estado === 'cambia';
          t += '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="importar-decidir" data-clave="'
            + esc(f.marca) + '" data-valor="' + (on ? '' : 'cambiar') + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '')
            + 'Cambiar de ' + esc(f.antes) + ' a ' + esc(f.valor) + '</button>';
        }
        if (f.clase === 'colecta' && f.diferencia) {
          var guardaDif = !f.retenida;
          t += '<p class="ma-aviso">Total en el cuaderno ' + esc(L(f.papel)) + ' · sumado ' + esc(L(f.suma)) + ' · Diferencia: '
            + esc(L(f.diferencia)) + ' ✗</p><button type="button" class="ma-btn ma-btn-chico' + (guardaDif ? ' ma-on' : '')
            + '" data-accion="importar-decidir" data-clave="' + esc(f.marca) + '" data-valor="' + (guardaDif ? '' : 'con_diferencia')
            + '" aria-pressed="' + guardaDif + '" data-metas="importar-diferencia">' + (guardaDif ? '✓ ' : '') + 'Guardar con la diferencia</button>';
        } else if (f.clase === 'colecta' && f.coincide) {
          t += '<p class="ma-nota ma-nota-ok">Total en el cuaderno: coincide ✓</p>';
        }
        f.errores.forEach(function (e) { if (!f.pregunta || e !== 'Hay que decir cuál monto es') t += '<p class="ma-aviso">✗ ' + esc(e) + '</p>'; });
        f.avisos.forEach(function (a) { t += '<p class="ma-nota">⚠ ' + esc(a) + '</p>'; });
        if (f.revisar) t += '<p class="ma-nota">⚠ revisar: se leyó con duda</p>';
        if (t) atencion.push('<li class="ma-renglon ma-fila-col" data-metas="importar-fila" data-estado="' + esc(f.estado) + '"><span class="ma-nom">'
          + esc(NOMBRE_SECCION[k].replace(/s$/, '')) + ': ' + esc(f.texto) + '</span>' + t + '</li>');
      });
    });
    if (atencion.length) h += '<h3 class="ma-h">Para mirar antes de guardar</h3><ul class="ma-lista">' + atencion.join('') + '</ul>';
    h += '</div><div class="ma-acciones"><button type="button" class="ma-btn" data-accion="importar-cancelar">Volver a revisar</button>'
      + '<button type="button" class="ma-btn ma-btn-1" data-accion="importar-guardar" data-metas="importar-guardar"'
      + (r.nuevos ? '' : ' disabled') + '>' + (r.nuevos ? 'Guardar ' + r.nuevos + (r.nuevos === 1 ? ' dato nuevo' : ' datos nuevos')
        : 'No hay nada nuevo en este archivo') + '</button></div>';
    return h + '</div>';
  }

  function importarElegir() {
    // El campo de archivo vive fuera de Mi aula y sin mostrarse: lo que se
    // toca es el botón de 44 px.
    var inp = document.getElementById('ma-importar-archivo');
    if (!inp) {
      inp = document.createElement('input');
      inp.type = 'file';
      inp.id = 'ma-importar-archivo';
      inp.accept = '.json,application/json';
      inp.hidden = true;
      inp.setAttribute('data-metas', 'importar-archivo');
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0];
        inp.value = '';
        if (!f) return;
        f.text().then(importarAbrir);
      });
      document.body.appendChild(inp);
    }
    inp.click();
  }
  // Las claves de familia que el docente tenía antes (metas.claves_archivo).
  // Sin señal no se pueden leer: la clave se comprueba al guardar.
  function clavesViejas() {
    var n = window.MetasDatos && window.MetasDatos._nube;
    if (!n || d.sinSenal()) return Promise.resolve(null);
    return n.leer('claves_archivo?select=clave,nombre_alumno').then(function (filas) {
      return new Map(filas.map(function (x) { return [x.clave, x.nombre_alumno]; }));
    }).catch(function () { return null; });
  }
  function importarAbrir(texto) {
    var I = window.MetasDatos.importar;
    var l = I.leer(texto);
    if (!l.ok) { importe = { frase: l.frase }; return pintar(); }
    importe = { archivo: l.archivo, decisiones: {} };
    return clavesViejas().then(function (claves) {
      importe.claves = claves;
      return importarPreparar();
    });
  }
  function importarPreparar() {
    if (!importe || !importe.archivo) return Promise.resolve();
    var I = window.MetasDatos.importar;
    return I.preparar(d, importe.archivo, { claves: importe.claves, inventario: I.inventarioLocal, decisiones: importe.decisiones })
      .then(function (plan) { importe.plan = plan; pintar(); })
      .catch(function () { importe = { frase: 'Ese archivo no se pudo leer entero. Revisa que sea el archivo de importación de M.E.T.A.S.' }; pintar(); });
  }
  // «Guardar» se apaga en cuanto se toca: tocarlo dos veces no anota dos
  // veces (y aunque llegara a pasar, los ids salen del contenido).
  function importarGuardar() {
    if (!importe || !importe.plan || importe.guardando) return;
    importe.guardando = true;
    var b = document.querySelector('[data-metas="importar-guardar"]');
    if (b) b.disabled = true;
    var I = window.MetasDatos.importar;
    var plan = importe.plan;
    I.guardar(d, plan, { inventario: I.inventarioLocal }).then(function (r) {
      importe = { aviso: 'Listo: ' + r.guardados + (r.guardados === 1 ? ' dato' : ' datos') + ' de tu archivo en ' + plan.aula.texto + '.' };
      vista.aula = r.aula; guardarPref();
      pintar();
    }).catch(function (e) {
      importe.guardando = false;
      importe.frase = frase(e);
      pintar();
    });
  }

  // ── 📥 Lista oficial del SACE ──────────────────────────────────────────
  // La matrícula que se entrega es la del SACE: los cuadros cuentan solo a
  // quien tiene en_sace (SaceLista.alumnosQueCuentan). Aquí se lee el CSV
  // del SACE en el aparato (no viaja a ningún lado), se empareja con la
  // MISMA regla de sace-lista.js (identidad de Honduras y, si no, nombre;
  // nunca el número de lista) y se muestra todo antes de guardar. Guardar
  // es un editar por alumno con solo lo que cambia: ni crea ni borra a
  // nadie y no toca ninguna nota, asistencia ni inasistencia.
  function listaSaceAbrir(aula, texto) {
    var SL = window.SaceLista;
    var leido = SL.parseCsv(texto);
    if (!leido.filas.length) {
      listaSace = { aula: aula.id, frase: 'No encontré alumnos en ese archivo. Tiene que ser el CSV del SACE con las columnas '
        + 'num, identidad, nombre, sexo, fecha_nacimiento y edad_sace.' };
      return pintar();
    }
    var plan = SL.emparejarFilas(alumnos(aula), leido.filas);
    // Lo seguro (✓) viene confirmado; lo parecido (⚠) espera a que el
    // maestro diga que es la misma persona.
    var conf = { pares: {}, manuales: {}, estados: {} };
    plan.pares.forEach(function (p, i) { if (p.seguro) conf.pares[i] = true; });
    listaSace = { aula: aula.id, leido: leido, plan: plan, conf: conf };
    pintar();
  }
  function listaSaceConf() {
    var c = listaSace.conf;
    return {
      pares: Object.keys(c.pares).filter(function (i) { return c.pares[i]; }).map(Number),
      manuales: Object.keys(c.manuales).filter(function (i) { return c.manuales[i]; })
        .map(function (i) { return { i: +i, id: c.manuales[i] }; }),
      estados: c.estados,
      fecha: hoy(),
    };
  }
  function listaSaceElegir(aula) {
    var inp = document.getElementById('ma-lista-sace-archivo');
    if (!inp) {
      inp = document.createElement('input');
      inp.type = 'file';
      inp.id = 'ma-lista-sace-archivo';
      inp.accept = '.csv,text/csv,text/plain';
      inp.hidden = true;
      inp.setAttribute('data-metas', 'lista-sace-archivo');
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0];
        inp.value = '';
        var a = aulaActual();
        if (!f || !a) return;
        f.text().then(function (t) { listaSaceAbrir(a, t); });
      });
      document.body.appendChild(inp);
    }
    inp.click();
  }
  // En una fecha de nacimiento el año es lo que más importa.
  function fechaSace(f) { return f ? fechaCorta(f) + ' de ' + String(f).slice(0, 4) : 'sin fecha'; }
  function pintarListaSace(aula) {
    var h = '<button type="button" class="ma-volver" data-accion="alumnos">‹ Mis alumnos</button>'
      + '<div class="ma-card" data-metas="lista-sace"><div class="ma-card-cab"><h2 class="ma-h">📥 Lista oficial del SACE</h2>'
      + '<button type="button" class="ma-btn" data-accion="lista-sace-elegir" data-metas="lista-sace-elegir">Elegir el archivo</button></div>'
      + '<p class="ma-nota">El archivo CSV que bajas del SACE. Antes de guardar ves a quién encontró. '
      + 'No se borra ningún alumno y no cambia ninguna nota.</p>';
    var s = listaSace && listaSace.aula === aula.id ? listaSace : null;
    if (s && s.frase) h += '<p class="ma-aviso" role="alert">✗ ' + esc(s.frase) + '</p>';
    if (s && s.aviso) h += '<p class="ma-nota ma-nota-ok" role="status" data-metas="lista-sace-listo">✓ ' + esc(s.aviso) + '</p>';
    if (!s || !s.plan) return h + '</div>';

    var SL = window.SaceLista;
    var lista = alumnos(aula);
    var porId = {};
    lista.forEach(function (a) { porId[a.id] = a; });
    var plan = s.plan, conf = listaSaceConf();
    var cambios = {};
    SL.cambiosFilas(lista, plan, conf).forEach(function (x) { cambios[x.id] = x.cambios; });
    var dentro = {};
    conf.pares.forEach(function (i) { dentro[plan.pares[i].id] = 1; });
    conf.manuales.forEach(function (m) { dentro[m.id] = 1; });
    var fuera = lista.filter(function (a) { return !dentro[a.id]; });
    var seguros = plan.pares.filter(function (p) { return p.seguro; }).length;
    var nCambian = Object.keys(cambios).length;
    var queCambia = function (id) {
      var c = cambios[id];
      if (!c) return '<span class="ma-sub">Nada que cambiar</span>';
      var t = [];
      if ('fecha_nacimiento' in c) t.push('Nacimiento: ' + fechaSace(porId[id].fecha_nacimiento) + ' → ' + fechaSace(c.fecha_nacimiento));
      // El sexo del SACE gana: se ve antes de guardar.
      if ('sexo' in c) t.push('Sexo: ' + (porId[id].sexo || 'sin anotar') + ' → ' + c.sexo);
      if ('estado' in c) t.push('Situación: ' + nombreEstado(c.estado));
      if ('edad_sace' in c) t.push('Edad en el SACE: ' + c.edad_sace);
      return t.length ? '<span class="ma-sub">' + esc(t.join(' · ')) + '</span>' : '';
    };
    var ficha = function (a) { return '#' + num(a) + ' ' + a.nombre_completo; };
    var delSace = function (f) { return (f.num ? 'N.º ' + f.num + ' del SACE · ' : '') + f.nombre; };

    h += '<div data-metas="lista-sace-vista-previa"><p class="ma-nota">El SACE trae <b>' + s.leido.filas.length + '</b> alumnos; '
      + 'en ' + esc(grupo(aula)) + ' tienes <b>' + lista.length + '</b>.</p><ul class="ma-lista">'
      + '<li class="ma-renglon"><span class="ma-nom">Encontrados</span><span class="ma-sub">' + seguros + ' ✓</span></li>'
      + (plan.pares.length > seguros ? '<li class="ma-renglon"><span class="ma-nom">Para confirmar que es la misma persona</span><span class="ma-sub">'
        + (plan.pares.length - seguros) + ' ⚠</span></li>' : '')
      + (plan.sinFicha.length ? '<li class="ma-renglon"><span class="ma-nom">Del SACE sin alumno en Mi aula</span><span class="ma-sub">'
        + plan.sinFicha.length + ' ✗</span></li>' : '')
      + '<li class="ma-renglon"><span class="ma-nom">Quedan fuera de la lista oficial (no se borran)</span><span class="ma-sub">'
      + fuera.length + '</span></li></ul>';
    if (s.leido.errores.length) h += s.leido.errores.map(function (e) { return '<p class="ma-nota">⚠ ' + esc(e) + '</p>'; }).join('');

    // ✓ y ⚠: los emparejados, en el orden del SACE.
    h += '<h3 class="ma-h">En la lista oficial</h3><ul class="ma-lista">' + plan.pares.map(function (p, i) {
      var a = porId[p.id];
      var t = '<li class="ma-renglon ma-fila-col" data-metas="lista-sace-par" data-estado="' + (p.seguro ? 'seguro' : 'confirmar') + '">'
        + '<span class="ma-nom">' + (p.seguro ? '✓ ' : '⚠ ') + esc(ficha(a)) + '</span>'
        + '<span class="ma-sub">' + esc(delSace(p.f)) + ' · ' + (p.por === 'identidad' ? 'por identidad' : 'por nombre') + '</span>';
      if (!p.seguro) {
        var on = !!s.conf.pares[i];
        t += '<p class="ma-nota">⚠ ' + esc(p.por === 'nombre' ? 'El nombre se parece. ¿Es la misma persona?'
          : 'Coincide solo parte del nombre (' + p.por + '). ¿Es la misma persona?') + '</p>'
          + '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="lista-sace-par" data-valor="' + i
          + '" aria-pressed="' + on + '" data-metas="lista-sace-confirmar">' + (on ? '✓ ' : '') + 'Es la misma persona</button>';
      }
      t += SL.avisosPar(p.f).map(function (x) { return '<p class="ma-nota" data-metas="lista-sace-aviso">⚠ ' + esc(x) + '</p>'; }).join('');
      return t + (s.conf.pares[i] ? queCambia(p.id) : '') + '</li>';
    }).join('') + '</ul>';

    // ✗: del SACE sin alumno en Mi aula. Si sí tiene ficha (con otro
    // nombre), se elige aquí; si no, se agrega con «Pegar una lista».
    if (plan.sinFicha.length) {
      var libres = plan.sinSace.map(function (id) { return porId[id]; }).filter(Boolean);
      h += '<h3 class="ma-h">Del SACE sin alumno en Mi aula</h3><ul class="ma-lista">' + plan.sinFicha.map(function (f, i) {
        var elegido = s.conf.manuales[i] || '';
        return '<li class="ma-renglon ma-fila-col" data-metas="lista-sace-sin-ficha"><span class="ma-nom">' + (elegido ? '✓ ' : '✗ ')
          + esc(delSace(f)) + '</span><span class="ma-sub">' + esc(f.idn || 'sin identidad') + ' · ' + esc(fechaSace(f.fnac)) + '</span>'
          + (libres.length ? '<label class="ma-campo"><span>¿Ya está en tu lista con otro nombre?</span><select class="ma-inp" data-accion="lista-sace-mano" data-fila="' + i + '">'
            + '<option value="">No está en mi lista</option>' + libres.map(function (a) {
              return '<option value="' + esc(a.id) + '"' + (elegido === a.id ? ' selected' : '') + '>' + esc(ficha(a)) + '</option>';
            }).join('') + '</select></label>' : '')
          + (elegido ? queCambia(elegido) : '<p class="ma-nota">No se agrega solo: si es tu alumno, agrégalo con «Pegar una lista» y vuelve a importar.</p>')
          + '</li>';
      }).join('') + '</ul>';
    }

    // Los que quedan fuera: siguen en la lista con sus notas.
    if (fuera.length) {
      h += '<h3 class="ma-h">Quedan fuera de la lista oficial</h3><p class="ma-nota">Siguen en Mi aula con todas sus notas, '
        + 'pero no entran en los cuadros. Si se fue, dilo aquí.</p><ul class="ma-lista">' + fuera.map(function (a) {
          var e = s.conf.estados[a.id] || '';
          return '<li class="ma-renglon ma-fila-col" data-metas="lista-sace-fuera"><span class="ma-nom">' + esc(ficha(a)) + '</span>'
            + (sigue(a) ? '' : '<span class="ma-sub">' + esc(nombreEstado(a.estado)) + '</span>')
            + '<div class="ma-botones" role="group" aria-label="' + esc('Situación de ' + a.nombre_completo) + '">'
            + [['', 'Sigue igual'], ['trasladado', 'Trasladado'], ['desertor', 'Desertor']].map(function (x) {
              var on = e === x[0];
              return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="lista-sace-estado" data-alumno="'
                + esc(a.id) + '" data-valor="' + x[0] + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + x[1] + '</button>';
            }).join('') + '</div></li>';
        }).join('') + '</ul>';
    }
    h += '</div><div class="ma-acciones"><button type="button" class="ma-btn" data-accion="lista-sace-cancelar">Volver a revisar</button>'
      + '<button type="button" class="ma-btn ma-btn-1" data-accion="lista-sace-guardar" data-metas="lista-sace-guardar"'
      + (nCambian ? '' : ' disabled') + '>' + (nCambian ? 'Guardar la lista oficial (' + nCambian + (nCambian === 1 ? ' alumno)' : ' alumnos)')
        : 'Ya está todo como en el SACE') + '</button></div>';
    return h + '</div>';
  }
  // «Guardar» se apaga en cuanto se toca. El plan se vuelve a armar con la
  // lista de AHORA: si otro aparato agregó o cambió alumnos mientras se
  // revisaba, los pares tienen que seguir siendo los mismos.
  function listaSaceGuardar(aula) {
    var s = listaSace;
    if (!s || !s.plan || s.guardando || s.aula !== aula.id) return;
    s.guardando = true;
    var b = document.querySelector('[data-metas="lista-sace-guardar"]');
    if (b) b.disabled = true;
    var SL = window.SaceLista;
    var lista = alumnos(aula);
    var plan = SL.emparejarFilas(lista, s.leido.filas);
    var firma = function (pl) { return JSON.stringify(pl.pares.map(function (p) { return [p.f.i, p.id]; })); };
    if (firma(plan) !== firma(s.plan)) {
      listaSace = { aula: aula.id, frase: 'Tu lista cambió mientras revisabas. Vuelve a elegir el archivo.' };
      return pintar();
    }
    var cambios = SL.cambiosFilas(lista, plan, listaSaceConf());
    var hechos = 0;
    cambios.forEach(function (x) {
      if (intentar(function () { d.editar('alumnos', x.id, x.cambios); })) hechos++;
    });
    listaSace = { aula: aula.id, aviso: 'Listo: ' + hechos + (hechos === 1 ? ' alumno actualizado' : ' alumnos actualizados')
      + ' con la lista del SACE. Ninguna nota cambió.' + (d.sinSenal() ? ' ' + SIN_SENAL_GUARDADO : '') };
    pintar();
  }
  // ── fin de la lista oficial del SACE ─────────────────────────────────

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
      + '<button type="button" class="ma-acceso" data-metas="perfil-desde-notas" data-accion="perfil">Perfil institucional <span aria-hidden="true">›</span></button>'
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
      + '<button type="button" class="ma-btn" data-accion="imprimir" data-valor="cuadro">📒 Cuadro final del año</button></div>'
      + notaImprimirSace(aula) + '</div>';
    return h;
  }

  // El Resumen final y el Cuadro final cuentan solo a quien está en el
  // SACE (y sigue en el aula): se dice antes de imprimir, con cuántos.
  function notaImprimirSace(aula) {
    var lista = alumnos(aula);
    var cuentan = lista.filter(function (a) { return a.en_sace === true && sigue(a); }).length;
    var faltan = window.SaceLista ? window.SaceLista.datosParaSace(lista).length : 0;
    return '<p class="ma-nota" data-metas="imprimir-cuenta-sace">El Resumen final y el Cuadro final cuentan <b>' + cuentan + '</b> '
      + (cuentan === 1 ? 'alumno registrado' : 'alumnos registrados') + ' en el SACE.'
      + (faltan ? ' ' + faltan + (faltan === 1 ? ' todavía no está' : ' todavía no están') + ': mira «Datos para el SACE» en Alumnos.' : '') + '</p>'
      + avisoSinSexo(aula);
  }

  function camposPerfilNuevo(aula) {
    var vacio = function () { return { valor: '', origen: '' }; };
    return {
      nombre: vacio(), direccion: vacio(), aldea: vacio(), municipio: vacio(), departamento: vacio(),
      codigo_sace: vacio(), director: vacio(), docente: vacio(), modalidad: vacio(), jornada: vacio(),
      logo: vacio(), logo_sec: vacio(),
      anio_lectivo: { valor: aula && aula.anio_lectivo ? String(aula.anio_lectivo) : String(new Date().getFullYear()), origen: '' },
    };
  }
  function pintarEncabezado(aula, modo) {
    var nuevo = modo === 'nuevo';
    var centroId = nuevo ? null : centroActivoId();
    var centro = centroId ? (d.lista('centros', { id: centroId })[0] || null) : null;
    var ini = nuevo
      ? { campos: camposPerfilNuevo(aula || centroActivo()), ofrecido: false }
      : window.MetasCentro.valoresIniciales(aula, centro);
    if (!nuevo && ini.campos.docente && !ini.campos.docente.valor) {
      var ya = nombreMaestro(centro);
      if (ya) ini.campos.docente = { valor: ya, origen: 'aula' };
    }
    var c = ini.campos;
    function campo(nombre, et, extra) {
      return '<label class="ma-campo"><span>' + et + '</span><input class="ma-inp" data-centro="' + nombre
        + '" value="' + esc(c[nombre].valor) + '"' + (extra || '') + ' autocomplete="off"></label>';
    }
    function logoCaja(id, src, propio, vacio) {
      if (src && (propio || id === 'ma-logo-prev')) {
        return '<img alt="" src="' + esc(src) + '"' + (propio ? ' data-propio="1"' : '') + '>';
      }
      return vacio;
    }
    var h = '<form class="ma-card ma-form" data-form="centro" data-centro-id="' + esc(!nuevo && centro ? centro.id : '') + '">'
      + '<h2 class="ma-h">🏫 Encabezado y logos</h2>';
    if (ini.ofrecido) {
      h += '<p class="ma-nota">En este aparato había datos del centro. Quedan aquí para empezar y no pisan lo que ya está guardado.</p>';
    }
    h += '<div class="ma-fila2">'
      + '<div class="ad-logo-fila"><div class="ad-logo-prev" id="ma-logo-prev">'
      + logoCaja('ma-logo-prev', c.logo.valor, true, '<span>Sin logo</span>')
      + '</div><div><p class="ma-nota">Logo del centro</p><div class="ma-acciones">'
      + '<label class="ma-btn">Subir<input type="file" data-centro-logo="logo" accept="image/*" style="display:none"></label>'
      + (c.logo.valor ? '<button type="button" class="ma-btn" data-accion="centro-quitar" data-valor="logo">Quitar</button>' : '')
      + '</div></div></div>'
      + '<div class="ad-logo-fila"><div class="ad-logo-prev" id="ma-logosec-prev">'
      + (c.logo_sec.valor
        ? '<img alt="Logo de la Secretaría" src="' + esc(c.logo_sec.valor) + '" data-propio="1">'
        : '<img alt="Logo de la Secretaría" src="img/logo-secretaria.png">')
      + '</div><div><p class="ma-nota">Logo de la Secretaría' + (c.logo_sec.valor ? '' : ' (oficial, ya incluido)') + '</p><div class="ma-acciones">'
      + '<label class="ma-btn">Subir<input type="file" data-centro-logo="logoSec" accept="image/*" style="display:none"></label>'
      + (c.logo_sec.valor ? '<button type="button" class="ma-btn" data-accion="centro-quitar" data-valor="logoSec">Quitar</button>' : '')
      + '</div></div></div></div>';
    h += campo('nombre', 'Nombre del centro educativo', ' maxlength="160" required');
    // «Ya tienes María Consuelo. ¿Abrirlo?»: se llena sin repintar el
    // formulario, para no borrarle al docente lo que sigue escribiendo.
    h += '<div class="ma-ya" data-metas="ya-existe" role="status" hidden></div>';
    h += campo('docente', 'Nombre del maestro(a)', ' maxlength="120"');
    h += '<div class="ma-fila2">' + campo('director', 'Nombre del director(a)', ' maxlength="120"')
      + campo('codigo_sace', 'Código SACE del centro', ' maxlength="30"') + '</div>';
    h += '<div class="ma-fila2">' + campo('direccion', 'Dirección', ' maxlength="160"')
      + campo('aldea', 'Aldea', ' maxlength="120"') + '</div>';
    h += '<div class="ma-fila2">' + campo('municipio', 'Municipio', ' maxlength="80"')
      + campo('departamento', 'Departamento', ' maxlength="80"') + '</div>';
    h += '<div class="ma-fila2">' + campo('anio_lectivo', 'Año lectivo', ' inputmode="numeric" maxlength="4"')
      + campo('modalidad', 'Modalidad', ' maxlength="80"') + '</div>';
    h += campo('jornada', 'Jornada', ' maxlength="80"');
    h += '<p class="ma-nota">El grado y la sección salen del grupo.</p>';
    h += '<p class="ma-nota">El logo se guarda a color.</p>';
    h += '<p class="ma-nota">Si no subes el de la Secretaría, la boleta usa el oficial.</p>';
    if (!nuevo && centro) {
      // Cambiar el nombre aquí cambia el de estos grupos: por eso se dice.
      var gs = gruposDel(centro.id).map(function (a) { return grupo(a); });
      h += gs.length
        ? '<p class="ma-info" data-metas="grupos-del-centro"><span aria-hidden="true">ⓘ</span> Este centro tiene '
          + gs.length + (gs.length === 1 ? ' grupo' : ' grupos') + ' (' + esc(gs.join(', ')) + ').</p>'
        : '<p class="ma-nota" data-metas="grupos-del-centro">Este centro todavía no tiene grupos.</p>';
    }
    if (nuevo) h += '<p class="ma-nota">El centro nuevo se crea al tocar «Guardar perfil».</p>';
    h += '<div class="ma-acciones ma-pie-perfil"><div class="ma-guardar"><button type="submit" class="ma-btn ma-btn-1" data-metas="guardar-perfil">Guardar perfil</button>'
      + htmlBarra() + '</div></div>';
    if (!nuevo && centro) h += htmlArchivar(centro);
    h += '<p class="ma-aviso" role="status"></p></form>';
    return h;
  }
  function htmlBarra() {
    var on = Date.now() < barraHasta;
    return '<div class="ma-barra-ok" data-metas="perfil-estado" role="status" aria-live="polite" aria-label="Perfil guardado"'
      + (on ? '' : ' hidden') + '><span class="ma-barra-ok-linea" aria-hidden="true"></span>'
      + '<span class="ma-barra-ok-check" aria-hidden="true">✓</span></div>';
  }
  function htmlArchivar(centro) {
    var h = '<div class="ma-zona-archivar">';
    if (confirmarArchivo) {
      h += '<div data-metas="confirmar-archivar"><p class="ma-confirma-t">'
        + esc('¿Archivar ' + centro.nombre + '?' + ' Puedes recuperarlo luego.') + '</p><div class="ma-acciones">'
        + '<button type="button" class="ma-btn ma-btn-peligro" data-metas="si-archivar" data-accion="si-archivar">Sí, archivar</button>'
        + '<button type="button" class="ma-btn" data-accion="cancelar-archivar">Cancelar</button></div></div>';
    } else {
      h += '<button type="button" class="ma-btn ma-btn-peligro" data-metas="archivar-centro" data-accion="archivar-centro">Archivar centro</button>';
      if (avisoArchivo === 'grupos') {
        h += '<p class="ma-info" data-metas="aviso-archivar-grupos"><span aria-hidden="true">ⓘ</span> '
          + esc(frasePasarGrupos(gruposDel(centro.id).length)) + '</p>';
      }
      if (avisoArchivo === 'ultimo') {
        h += '<p class="ma-info" data-metas="aviso-archivar-ultimo"><span aria-hidden="true">ⓘ</span> No se puede archivar el último centro.</p>';
      }
    }
    return h + '</div>';
  }
  // La frase ya no se pinta: la señal es la barrita. La función se queda
  // porque otras pruebas y el sin señal la conocían.
  function textoGuardado() {
    return d && d.sinSenal() ? SIN_SENAL_GUARDADO : 'Perfil guardado ✓';
  }
  function pintarEstadoPerfil(form, texto) {
    var el = form && form.querySelector('[data-metas="perfil-estado"]');
    if (!el) return;
    if (texto) el.removeAttribute('hidden');
    else el.hidden = true;
  }
  function mostrarBarra() {
    barraHasta = Date.now() + 2000;
    var el = document.querySelector('#mi-aula [data-metas="perfil-estado"]');
    if (el) el.hidden = false;
    if (barraTimer) clearTimeout(barraTimer);
    barraTimer = setTimeout(function () {
      barraTimer = null;
      if (Date.now() < barraHasta) return;
      var nodo = document.querySelector('#mi-aula [data-metas="perfil-estado"]');
      if (nodo) nodo.hidden = true;
    }, 2000);
  }
  function pintarYaExiste(form, ya) {
    var el = form && form.querySelector('[data-metas="ya-existe"]');
    if (!el) return;
    if (!ya) { el.hidden = true; el.innerHTML = ''; return; }
    var html = '<span>Ya tienes ' + esc(ya.nombre) + '. ¿Abrirlo?</span>'
      + '<button type="button" class="ma-btn" data-metas="abrir-centro" data-accion="abrir-centro" data-valor="' + esc(ya.id) + '">Abrirlo</button>';
    if (el.innerHTML !== html) el.innerHTML = html;
    el.hidden = false;
  }
  function programarPerfil() {
    if (esperaPerfil) clearTimeout(esperaPerfil);
    esperaPerfil = setTimeout(function () { esperaPerfil = null; guardarFormCentro({}); }, ESPERA_PERFIL);
  }

  function leerFormCentro() {
    var f = document.querySelector('#mi-aula [data-form="centro"]');
    if (!f) return null;
    var campos = {};
    f.querySelectorAll('[data-centro]').forEach(function (el) { campos[el.getAttribute('data-centro')] = el.value; });
    var logo = document.querySelector('#ma-logo-prev img');
    campos.logo = logo ? logo.getAttribute('src') : '';
    var sec = document.querySelector('#ma-logosec-prev img');
    campos.logo_sec = (sec && sec.getAttribute('data-propio') === '1') ? sec.getAttribute('src') : '';
    return { form: f, campos: campos, id: f.getAttribute('data-centro-id') || null };
  }
  // op.confirmado: el docente tocó «Guardar perfil» (o Enter). Solo así
  // se crea un centro nuevo; salir del campo o dejar de escribir solo
  // guarda uno que ya existe.
  function guardarFormCentro(op) {
    op = op || {};
    if (esperaPerfil) { clearTimeout(esperaPerfil); esperaPerfil = null; }
    var leo = leerFormCentro();
    if (!leo || !d || !window.MetasCentro) return;
    var MC = window.MetasCentro;
    var aula = aulaActual();
    var eraNuevo = !leo.id;
    var ya = typeof MC.mismoNombre === 'function'
      ? MC.mismoNombre(d, leo.campos.nombre, leo.campos.anio_lectivo, leo.id || null) : null;
    pintarYaExiste(leo.form, ya);
    var aviso = leo.form.querySelector('.ma-aviso');
    try {
      var id = MC.guardar(d, eraNuevo ? null : aula, leo.campos, leo.id || null, { confirmado: !!op.confirmado });
      if (aviso) aviso.textContent = '';
      perfilGuardado = id;
      if (eraNuevo) {
        // Ya existe el centro: se repinta para que aparezca entre los tuyos.
        // El docente acaba de tocar el botón, no está escribiendo.
        centroNuevo = false;
        vista.centro = id;
        guardarPref();
        mostrarBarra();
        pintar();
        return;
      }
      leo.form.setAttribute('data-centro-id', id);
      mostrarBarra();
      // Ya hay perfil: el aviso de arriba no tiene que esperar a otro repintado,
      // porque repintar ahora le borraría al docente lo que sigue escribiendo.
      var nota = document.querySelector('#mi-aula [data-metas="aviso-perfil"]');
      var caja = nota && nota.parentNode && nota.parentNode.classList && nota.parentNode.classList.contains('ma-puertas')
        ? nota.parentNode : nota;
      if (caja && caja.remove) caja.remove();
    } catch (e) {
      if (e && e.espera) return;
      if (e && e.yaExiste) { pintarYaExiste(leo.form, e.yaExiste); return; }
      avisarEn(leo.form, frase(e));
    }
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
      // Una tarjeta por fila y motivo; si pasó más de una vez, se cuenta.
      var veces = n.veces > 1 ? ' <span class="ma-veces" data-metas="no-anotado-veces">(' + n.veces + ' veces)</span>' : '';
      h = '<div class="ma-carta" data-metas="no-anotado" role="alert"><p class="ma-carta-t">' + esc(n.texto) + veces + '</p>'
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
      // La pantalla de antes lee su aula del aparato: se le arma desde las
      // filas, con este mismo grupo activo (js/tools/mi-aula-puente.js).
      var aula = aulaActual();
      if (window.metasMiAulaPuente && aula) window.metasMiAulaPuente.preparar(aula.id);
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
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; hoja = null; formGrupo = false; claves = null;
        pintarTarjeta();
        return pintar();
      case 'otro-grupo': formGrupo = !formGrupo; return pintar();
      case 'seccion':
        var s = SECCIONES.filter(function (x) { return x.k === v; })[0];
        if (s && s.vieja) return abrirVieja(s.vieja);
        vista.seccion = v; guardarPref();
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; subAlumnos = ''; hoja = null; otroMonto = false; claves = null;
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
      case 'carga': subAlumnos = 'carga'; avisoCarga = ''; importe = null; pintar(); return enfocarPantalla();
      case 'importar-elegir': return importarElegir();
      case 'importar-decidir':
        if (!importe || !importe.decisiones) return;
        importe.decisiones[b.getAttribute('data-clave')] = v || undefined;
        return importarPreparar();
      case 'importar-cancelar': importe = null; return pintar();
      case 'importar-guardar': return importarGuardar();
      case 'claves-preparar': alumnoAbierto = null; return clavesAbrir(aula);
      case 'claves-cancelar': claves = null; return pintar();
      case 'claves-guardar': return clavesGuardar();
      case 'alumnos': subAlumnos = ''; sinSexoIds = null; return pintar();
      case 'sin-sexo':
        // Se llega desde Alumnos o desde Notas SACE › Para imprimir: se va a
        // Alumnos con solo esas fichas a la vista.
        sinSexoIds = window.SaceLista.sexosSace(alumnos(aula)).sinSexo.map(function (a) { return a.id; });
        vista.seccion = 'alumnos'; guardarPref();
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; hoja = null; otroMonto = false; claves = null;
        subAlumnos = 'sin-sexo';
        pintarTarjeta();
        pintar();
        return enfocarPantalla();
      case 'lista-sace': subAlumnos = 'sace'; alumnoAbierto = null; listaSace = null; pintar(); return enfocarPantalla();
      case 'datos-sace': subAlumnos = 'datos-sace'; alumnoAbierto = null; pintar(); return enfocarPantalla();
      case 'datos-sace-imprimir': return imprimirDatosSace(aula);
      case 'ficha-sexo':
        // Un toque: la ficha toma F o M. Solo se manda si cambia.
        var alS = alumnos(aula).filter(function (x) { return x.id === b.getAttribute('data-alumno'); })[0];
        if (!alS || alS.sexo === v || (v !== 'F' && v !== 'M')) return;
        intentar(function () { d.editar('alumnos', alS.id, { sexo: v }); });
        return pintar();
      case 'lista-sace-elegir': return listaSaceElegir(aula);
      case 'lista-sace-par':
        if (!listaSace || !listaSace.plan) return;
        listaSace.conf.pares[v] = !listaSace.conf.pares[v];
        return pintar();
      case 'lista-sace-estado':
        if (!listaSace || !listaSace.plan) return;
        listaSace.conf.estados[b.getAttribute('data-alumno')] = v || undefined;
        return pintar();
      case 'lista-sace-cancelar': listaSace = null; return pintar();
      case 'lista-sace-guardar': return listaSaceGuardar(aula);
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
      case 'tira-alumno': return imprimir(aula, 'tira', b.getAttribute('data-alumno'));
      case 'clave-copiar': return compartirClave(b.getAttribute('data-alumno'), 'copiar');
      case 'clave-whatsapp': return compartirClave(b.getAttribute('data-alumno'), 'whatsapp');
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
      case 'perfil': return abrirPerfil(false);
      case 'institucion':
        centroNuevo = false;
        formGrupo = false;
        confirmarArchivo = false;
        avisoArchivo = '';
        choqueArchivo = null;
        vista.centro = v;
        cerrarPapelera();
        var delCentro = aulasVisibles();
        if (!delCentro.some(function (a) { return a.id === vista.aula; })) {
          vista.aula = delCentro[0] ? delCentro[0].id : null;
        }
        guardarPref();
        colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; hoja = null;
        return pintar();
      case 'agregar-perfil': return abrirPerfil(true);
      // «Ya tienes María Consuelo. ¿Abrirlo?»: se abre ese, y lo escrito
      // en el formulario no se manda (no se crea un centro repetido).
      case 'abrir-centro':
        if (esperaPerfil) { clearTimeout(esperaPerfil); esperaPerfil = null; }
        centroNuevo = false;
        perfilPantalla = true;
        vista.centro = v;
        var deEse = aulasVisibles();
        if (!deEse.some(function (a) { return a.id === vista.aula; })) vista.aula = deEse[0] ? deEse[0].id : null;
        guardarPref();
        return pintar();
      case 'ayuda-perfil': ayudaPerfil = !ayudaPerfil; return pintar();
      case 'papelera-centro': return pedirPapelera();
      case 'papelera-archivar': return archivarDesdeChip();
      case 'papelera-borrar':
      case 'borrar-archivado':
        pasoCentro = acc === 'borrar-archivado' ? v : (pasoCentro || centroActivoId());
        if (tieneHistorial(pasoCentro)) { pasoPapelera = 'elige'; return pintar(); }
        pasoPapelera = 'aviso1';
        avisoLinea = '';
        archivadosAbiertos = acc === 'borrar-archivado' ? true : archivadosAbiertos;
        return pintar();
      case 'papelera-seguir':
        pasoPapelera = 'aviso2';
        focoBorrar = true;
        return pintar();
      case 'papelera-confirmar': return confirmarBorrado();
      case 'papelera-cancelar': cerrarPapelera(); return pintar();
      case 'archivar-centro': return pedirArchivar();
      case 'cancelar-archivar': confirmarArchivo = false; return pintar();
      case 'si-archivar': return siArchivar();
      case 'archivados':
        archivadosAbiertos = !archivadosAbiertos;
        if (!archivadosAbiertos) choqueArchivo = null;
        return pintar();
      case 'recuperar-centro': return recuperarCentro(v);
      case 'centro-quitar': return quitarLogoCentro(v, b);
      case 'materias-siempre':
        intentar(function () {
          MATERIAS_DE_SIEMPRE.forEach(function (n, i) { d.crear('asignaturas', { aula_id: aula.id, nombre: n, orden: i + 1 }); });
        });
        return pintar();
      case 'sub-com': subComunicados = v; return pintar();
      case 'carga-guardar': return guardarCarga(aula);
      case 'carga-sexo':
        var fi = cargaFilas[+b.getAttribute('data-fila')];
        if (fi && (v === 'F' || v === 'M')) fi.sexo = v;
        return pintar();
      case 'entendido': d.entendido(v); return pintarTarjeta();
      case 'responder': return responder(b.getAttribute('data-pregunta'), v);
    }
  }

  function pedirArchivar() {
    var c = centroActivo();
    if (!c) return;
    choqueArchivo = null;
    if (centrosDelDocente().length < 2) {
      confirmarArchivo = false;
      avisoArchivo = 'ultimo';
      return pintar();
    }
    if (gruposDel(c.id).length) {
      confirmarArchivo = false;
      avisoArchivo = 'grupos';
      return pintar();
    }
    avisoArchivo = '';
    confirmarArchivo = true;
    pintar();
  }
  function siArchivar() {
    var c = centroActivo();
    if (!c || centrosDelDocente().length < 2 || gruposDel(c.id).length) return;
    if (!intentar(function () { d.borrar('centros', c.id); })) return;
    confirmarArchivo = false;
    avisoArchivo = '';
    var queda = centrosDelDocente().filter(function (x) { return x.id !== c.id; })[0];
    if (queda) { vista.centro = queda.id; guardarPref(); }
    archivadosAbiertos = false;
    pintar();
  }
  function recuperarCentro(id) {
    var c = centrosArchivados().filter(function (x) { return x.id === id; })[0];
    if (!c || !window.MetasCentro) return;
    var ya = window.MetasCentro.mismoNombre(d, c.nombre, c.anio_lectivo, null);
    if (ya) {
      choqueArchivo = { id: c.id, texto: 'Ya tienes ' + ya.nombre + '.' };
      archivadosAbiertos = true;
      return pintar();
    }
    choqueArchivo = null;
    // Con grupos o alumnos archivados junto al centro, los devuelve la base.
    // Sin ellos, sigue el camino de siempre (solo el centro).
    var junto = piezasCentro(c.id);
    if (junto.aulas.length || junto.alumnos) {
      if (sinSenalPapelera()) return;
      d.recuperarCentroJunto(c.id);
      return pintar();
    }
    if (!intentar(function () { d.recuperar('centros', c.id); })) return;
    pintar();
  }
  function pedirPapelera() {
    var c = centroActivo();
    if (!c || centrosDelDocente().length < 2) return;
    pasoCentro = c.id;
    pasoPapelera = 'elige';
    avisoLinea = '';
    pintar();
  }
  function archivarDesdeChip() {
    var c = centroPorId(pasoCentro);
    if (!c || centrosDelDocente().length < 2) { cerrarPapelera(); return pintar(); }
    if (sinSenalPapelera()) return;
    ordenAlArchivar = centrosDelDocente().map(function (x) { return x.id; });
    barraAlSalir = c.id;
    alSalirConBarra = true;
    cerrarPapelera();
    d.archivarCentro(c.id);
    pintar();
  }
  function confirmarBorrado() {
    var campo = document.querySelector('#mi-aula [data-metas="escribir-borrar"]');
    if (!campo || campo.value !== 'BORRAR') return;
    var c = centroPorId(pasoCentro);
    if (!c) { cerrarPapelera(); return pintar(); }
    if (tieneHistorial(c.id)) { pasoPapelera = 'elige'; return pintar(); }
    if (sinSenalPapelera()) return;
    if (!esArchivado(c.id)) {
      ordenAlArchivar = centrosDelDocente().map(function (x) { return x.id; });
      barraAlSalir = c.id;
      alSalirConBarra = false;
    } else {
      barraAlSalir = c.id;
      ordenAlArchivar = centrosDelDocente().map(function (x) { return x.id; });
      alSalirConBarra = false;
    }
    var id = c.id;
    cerrarPapelera();
    d.borrarCentroDefinitivo(id);
    pintar();
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

  function imprimir(aula, que, alumnoId) {
    if (!aula || !papel()) return;
    papel().imprimir(d, aula, que, alumnoId);
  }

  function alCambiar(ev) {
    var el = ev.target;
    if (el.getAttribute && el.getAttribute('data-centro-logo')) return subirLogoCentro(el);
    // Salir de un campo del perfil que cambió: se guarda ya, sin esperar.
    if (el.getAttribute && el.getAttribute('data-centro')) return guardarFormCentro({});
    var acc = el.getAttribute && el.getAttribute('data-accion');
    if (!acc || !d) return;
    if (acc === 'fecha') { vista.fecha = el.value || hoy(); guardarPref(); return pintar(); }
    if (acc === 'sace') return anotarSace(el);
    // La casilla «Registrado en SACE»: solo en_sace, de un toque. Las notas,
    // la asistencia y las boletas no cambian; los cuadros sí lo cuentan.
    if (acc === 'en-sace') {
      var aulaS = aulaActual();
      var alE = aulaS && alumnos(aulaS).filter(function (x) { return x.id === el.getAttribute('data-alumno'); })[0];
      if (!alE) return;
      var cm = window.SaceLista.cambiosMarca(alE, el.checked, '');
      if (Object.keys(cm).length) intentar(function () { d.editar('alumnos', alE.id, cm); });
      return pintar();
    }
    // Emparejar a mano una fila del SACE con un alumno: uno no puede ser de dos.
    if (acc === 'lista-sace-mano' && listaSace && listaSace.plan) {
      var m = listaSace.conf.manuales;
      Object.keys(m).forEach(function (i) { if (m[i] === el.value) m[i] = ''; });
      m[el.getAttribute('data-fila')] = el.value;
      return pintar();
    }
  }
  function subirLogoCentro(el) {
    var file = el.files && el.files[0];
    el.value = '';
    if (!file || !window.MetasCentro) return;
    var cual = el.getAttribute('data-centro-logo');
    window.MetasCentro.jpeg(file).then(function (url) {
      var caja = document.getElementById(cual === 'logoSec' ? 'ma-logosec-prev' : 'ma-logo-prev');
      if (caja) {
        caja.innerHTML = '<img alt="" src="' + String(url).replace(/"/g, '') + '"'
          + (cual === 'logoSec' ? ' data-propio="1"' : '') + '>';
      }
      guardarFormCentro();
    }).catch(function () {
      avisarEn(document.querySelector('#mi-aula [data-form="centro"]'), 'No se pudo leer la imagen.');
    });
  }
  function quitarLogoCentro(cual, boton) {
    var caja = document.getElementById(cual === 'logoSec' ? 'ma-logosec-prev' : 'ma-logo-prev');
    if (caja) {
      caja.innerHTML = cual === 'logoSec'
        ? '<img alt="Logo de la Secretaría" src="img/logo-secretaria.png">'
        : '<span>Sin logo</span>';
    }
    if (boton) boton.hidden = true;
    guardarFormCentro();
  }

  // El color de la nota cambia mientras se escribe; se anota al soltar.
  function alEscribir(ev) {
    var el = ev.target;
    if (el.getAttribute && el.getAttribute('data-metas') === 'escribir-borrar') {
      var botonBorrar = document.querySelector('#mi-aula [data-metas="papelera-confirmar"]');
      if (botonBorrar) botonBorrar.disabled = el.value !== 'BORRAR';
      return;
    }
    if (el.getAttribute && el.getAttribute('data-centro')) {
      pintarEstadoPerfil(el.form, '');
      return programarPerfil();
    }
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
      // «Guardar perfil» (o Enter en un campo): es la confirmación que crea
      // un centro nuevo.
      case 'centro':
        guardarFormCentro({ confirmado: true });
        return;
      case 'aula':
        var grado = /^\d{1,2}/.exec(datos.grado);
        if (!grado) { avisarEn(f, 'Escribe el grado con número, por ejemplo 6.'); return; }
        ok = intentar(function () {
          var centro = centroActivo();
          var filaAula = {
            escuela: datos.escuela,
            grado: grado[0],
            seccion: datos.seccion.replace(/[^0-9A-Za-z]/g, '').slice(0, 3),
            anio_lectivo: centro && centro.anio_lectivo ? centro.anio_lectivo : new Date().getFullYear(),
          };
          if (centro) {
            filaAula.centro_id = centro.id;
            var maestro = nombreMaestro(centro);
            if (maestro) filaAula.docente_nombre = maestro;
          }
          var id = d.crear('aulas', filaAula).id;
          vista.aula = id;
          if (centro) vista.centro = centro.id;
          guardarPref();
          formGrupo = false;
        }, f);
        break;
      case 'alumno':
        // La misma regla que la ficha: sexo F o M obligatorio, identidad
        // opcional (si viene, con sus 13 cifras).
        var rev = window.SaceLista.revisarFicha({ nombre_completo: datos.nombre, sexo: datos.sexo, identidad: datos.identidad });
        if (rev.errores.length) { avisarEn(f, rev.errores.join(' ')); return; }
        var n = alumnos(aula).reduce(function (x, a) { return Math.max(x, a.num_lista || 0); }, 0);
        var nueva = { aula_id: aula.id, nombre_completo: rev.campos.nombre_completo, sexo: rev.campos.sexo, num_lista: n < 99 ? n + 1 : null };
        if (rev.campos.identidad) nueva.identidad = rev.campos.identidad;
        if (datos.en_sace) nueva.en_sace = true;
        ok = intentar(function () { d.crear('alumnos', nueva); }, f);
        if (ok) { pintar(); enfocar('#ma-nuevo-al'); return; }
        break;
      case 'ficha':
        var alF = alumnos(aula).filter(function (x) { return x.id === f.getAttribute('data-alumno'); })[0];
        if (!alF) return;
        // El sexo se pone con sus botones, de un toque: aquí no se pide, para
        // que una ficha vieja sin sexo pueda guardar su identidad igual.
        var revF = window.SaceLista.revisarFicha({ nombre_completo: alF.nombre_completo, sexo: alF.sexo, identidad: datos.identidad,
          documento_pais: alF.documento_pais, fecha_nacimiento: datos.fecha_nacimiento });
        var errF = revF.errores.filter(function (e) { return !/niña \(F\)/.test(e); });
        var numS = String(datos.sace_num || '').replace(/\D/g, '');
        if (numS && !(+numS >= 1 && +numS <= 999)) errF.push('El número del SACE va de 1 a 999.');
        if (errF.length) { avisarEn(f, errF.join(' ')); return; }
        // Solo lo que cambia: una identidad borrada queda vacía (null).
        var cf = {};
        if ((revF.campos.identidad || null) !== (alF.identidad || null)) cf.identidad = revF.campos.identidad || null;
        if ((revF.campos.fecha_nacimiento || null) !== (alF.fecha_nacimiento || null)) cf.fecha_nacimiento = revF.campos.fecha_nacimiento || null;
        var numN = numS ? +numS : null;
        if (numN !== (alF.sace_num == null ? null : alF.sace_num)) cf.sace_num = numN;
        if (!Object.keys(cf).length) { avisarEn(f, 'No hay nada que cambiar.'); return; }
        ok = intentar(function () { d.editar('alumnos', alF.id, cf); }, f);
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
  // Un renglón: «Nombre Apellido F 0801-2015-01234». La F o la M (sola,
  // al final del nombre) es el sexo; sin ella se elige en la vista previa.
  function leerCarga(texto) {
    return String(texto || '').split(/\r?\n/).map(function (r) { return r.replace(/\t/g, ' ').trim(); })
      .filter(function (r) { return r.length >= 3; })
      .map(function (r) {
        var m = /^(.*?)[\s,;]+(\d{4}-?\d{4}-?\d{5})$/.exec(r);
        var fila = m ? { nombre: m[1].trim(), identidad: m[2] } : { nombre: r, identidad: null };
        var sx = /^(.*?)[\s,;]+([FfMm])$/.exec(fila.nombre);
        fila.sexo = sx ? sx[2].toUpperCase() : '';
        if (sx) fila.nombre = sx[1].replace(/[\s,;]+$/, '').trim();
        return fila;
      });
  }
  function cargaSinSexo() {
    return cargaFilas.filter(function (f) { return f.sexo !== 'F' && f.sexo !== 'M'; }).length;
  }

  // Tocar «Agregar a la lista» dos veces no anota dos veces: la vista previa
  // se vacía en cuanto se anota (lo mismo sin señal).
  function guardarCarga(aula) {
    if (!cargaFilas.length || !aula || cargaSinSexo()) return;
    var filas = cargaFilas;
    cargaFilas = [];
    cargaTexto = '';
    var n = alumnos(aula).reduce(function (x, a) { return Math.max(x, a.num_lista || 0); }, 0);
    filas.forEach(function (f) {
      n++;
      intentar(function () {
        var fila = { aula_id: aula.id, nombre_completo: f.nombre, sexo: f.sexo, num_lista: n <= 99 ? n : null };
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
    if (ev.target.closest('#zd-ir-perfil')) {
      abrirPerfil(false);
      if (typeof window.switchView === 'function') window.switchView('view-mi-aula');
      return;
    }
    if (ev.target.closest('#mi-aula-back-btn')) {
      // La flecha sube un nivel: del perfil al aula; de una colecta, un
      // control o la lista pegada, a su lista; si no, a la Zona Docente.
      if (perfilPantalla) { perfilPantalla = false; centroNuevo = false; pintar(); return; }
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
    // Gastos de mi bolsillo e Inventario se abren desde la Economía de Mi
    // aula: su flecha vuelve allá, no a la Economía de antes.
    var enEconomia = false;
    try { enEconomia = !!(_adGastosOn || _adInvOn) && !_adColectaId; } catch (e) { enEconomia = false; }
    if (dentro && !enEconomia) return;
    if (enEconomia) {
      try { _adGastosOn = 0; _adInvOn = 0; } catch (e) { /* ya cerrada */ }
      vista.seccion = 'economia'; guardarPref();
    }
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
    // Desde la pantalla de antes: lo que ya vive en filas se abre aquí.
    irA: function (sec) {
      deMiAula = false;
      colectaAbierta = null; controlAbierto = null; alumnoAbierto = null; subAlumnos = ''; hoja = null; otroMonto = false;
      perfilPantalla = sec === 'perfil';
      if (sec === 'perfil') centroNuevo = false;
      else if (sec === 'otro-grupo') formGrupo = true;
      else if (SECCIONES.some(function (s) { return s.k === sec && !s.vieja; })) { vista.seccion = sec; guardarPref(); }
      try { _adGastosOn = 0; _adInvOn = 0; } catch (e) { /* sin la pantalla de antes */ }
      window.switchView('view-mi-aula');
    },
    elegirAula: function (id) { vista.aula = id; guardarPref(); },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preparar);
  else preparar();
})();
