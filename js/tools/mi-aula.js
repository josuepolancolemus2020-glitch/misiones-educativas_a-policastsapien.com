/* =====================================================================
   M.E.T.A.S — js/tools/mi-aula.js · Mi aula del corte 1, sobre filas
   ---------------------------------------------------------------------
   La pantalla de lo que ya vive como una fila por dato en la base (08,
   8.1): la lista, las notas, la asistencia, las colectas y sus gastos, los
   controles, los avisos y la conducta, más la carga rápida. Lee y escribe
   SOLO por MetasDatos (js/datos/), y dibuja SOLO lo que el motor ofrece:

     · lo que el docente anota, al instante, con señal o sin ella;
     · un punto gris con la señal tachada mientras NO hay señal (y nada
       cuando sí hay: ni «guardado», ni «al día», 09-INTERFAZ.md);
     · las preguntas de dos botones (dinero, misma persona, colecta
       cerrada), de a una;
     · la tarjeta «no quedó anotado», con un solo botón: «Entendido»;
     · «Escribe tu contraseña», si la sesión venció y no se pudo renovar.

   Pocos botones, solo lo esencial, nada técnico. Los elementos que tocan
   las pruebas llevan data-metas (pruebas-capa-c/CONTRATO-PANTALLA.md).
   Al docente, de tú (regla 12).
   ===================================================================== */
(function () {
  'use strict';

  var PANTALLAS = [
    ['lista', 'Lista'], ['notas', 'Notas'], ['asistencia', 'Asistencia'], ['colectas', 'Colectas'],
    ['controles', 'Controles'], ['avisos', 'Avisos'], ['conducta', 'Conducta'], ['gastos', 'Gastos'],
    ['carga-rapida', 'Carga rápida'],
  ];
  // Preferencia de vista: en su propia llave (regla 5), nunca en el aula.
  var PREF = 'METAS_MI_AULA_VISTA_V1';

  var d = null;
  var listo = null;
  var vista = leerPref();
  var colectaAbierta = null;     // id de la colecta que se está viendo
  var pagoDe = null;             // alumno al que se le está anotando un pago
  var alumnoAbierto = null;      // alumno de la lista que se está editando
  var controlAbierto = null;
  var preguntaLocal = null;      // «Esta colecta está cerrada. ¿Reabrirla?» antes de tocar nada
  var reabriendo = null;         // la colecta que se reabre, esperando el «¿Por qué?»
  var cargaFilas = [];
  var cargaTexto = '';
  var avisoCarga = '';
  var porPintar = false;

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
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
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
  // Un error del motor que sí se le puede decir al docente; cualquier otro,
  // una frase del aula y nada más (nunca «error» ni nada técnico).
  function frase(e) {
    return e && e.paraElDocente ? e.message : 'Eso no se pudo anotar. Revisa lo que escribiste.';
  }

  // ── Lo que se ve ───────────────────────────────────────────────────────
  function aulas() {
    return d.lista('aulas').sort(function (a, b) {
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
  function colectas(aula) {
    return d.lista('colectas', { aula_id: aula.id }).sort(function (a, b) {
      return String(a.fecha).localeCompare(String(b.fecha))
        || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
    });
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
    var vistaActiva = document.getElementById('view-mi-aula');
    if (vistaActiva && !vistaActiva.classList.contains('active')) return;
    var aula = aulaActual();
    var pant = vista.pantalla || 'lista';
    var h = '';
    var todas = aulas();
    if (todas.length > 1) {
      h += '<label class="ma-aula-elegir"><span class="ma-oculto">Sección</span><select class="pa-inp-field ma-aula-sel" data-accion="aula">'
        + todas.map(function (a) {
          return '<option value="' + esc(a.id) + '"' + (aula && a.id === aula.id ? ' selected' : '') + '>'
            + esc(grupo(a)) + ' · ' + esc(a.escuela) + '</option>';
        }).join('') + '</select></label>';
    } else if (aula) {
      h += '<p class="ma-aula-una">' + esc(grupo(aula)) + ' · ' + esc(aula.escuela) + '</p>';
    }
    h += '<nav class="ma-tabs" aria-label="Partes de Mi aula">' + PANTALLAS.map(function (p) {
      return '<button type="button" class="ma-tab' + (p[0] === pant ? ' ma-tab-on' : '') + '" data-metas="ir-' + p[0]
        + '" data-accion="pantalla" data-valor="' + p[0] + '"' + (p[0] === pant ? ' aria-current="page"' : '') + '>'
        + esc(p[1]) + '</button>';
    }).join('') + '</nav>';
    h += '<section class="ma-pant" data-metas="pantalla-' + pant + '">';
    if (!aula && pant !== 'lista') h += '<p class="ma-nota">Primero escribe los datos de tu sección en «Lista».</p>';
    else h += PINTORES[pant](aula);
    h += '</section>';
    raiz.innerHTML = h;
  }

  function pintarLista(aula) {
    if (!aula) {
      return '<form class="ma-form" data-form="aula">'
        + '<p class="ma-nota">Escribe los datos de tu sección para empezar.</p>'
        + '<input class="pa-inp-field" name="escuela" placeholder="Nombre de la escuela" required maxlength="160">'
        + '<div class="ma-fila2"><input class="pa-inp-field" name="grado" inputmode="numeric" placeholder="Grado (1 a 9)" required>'
        + '<input class="pa-inp-field" name="seccion" placeholder="Sección" required maxlength="3"></div>'
        + '<button class="ma-btn ma-btn-1" type="submit">Empezar</button></form>';
    }
    var lista = alumnos(aula);
    var h = '<div class="ma-lista">' + lista.map(function (a) {
      var abierto = alumnoAbierto === a.id;
      var estado = sigue(a) ? '' : '<span class="ma-chip">' + esc(nombreEstado(a.estado)) + '</span>';
      var r = '<div class="ma-al' + (sigue(a) ? '' : ' ma-al-fuera') + '" data-metas="alumno">'
        + '<button type="button" class="ma-al-btn" data-accion="alumno" data-valor="' + esc(a.id) + '" aria-expanded="' + abierto + '">'
        + '<span class="ma-num">' + (a.num_lista == null ? '·' : esc(a.num_lista)) + '</span>'
        + '<span class="ma-nom">' + esc(a.nombre_completo) + '</span>' + estado + '</button>';
      if (abierto) {
        r += '<div class="ma-al-edit">' + ['activo', 'retirado', 'trasladado', 'desertor'].map(function (e) {
          var on = (a.estado || 'activo') === e;
          return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="estado" data-alumno="'
            + esc(a.id) + '" data-valor="' + e + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '') + esc(nombreEstado(e)) + '</button>';
        }).join('') + '</div>';
      }
      return r + '</div>';
    }).join('') + '</div>';
    if (!lista.length) h += '<p class="ma-nota">Todavía no hay alumnos. Escríbelos uno por uno o pega la lista en «Carga rápida».</p>';
    h += '<form class="ma-form ma-en-linea" data-form="alumno">'
      + '<input class="pa-inp-field" name="nombre" placeholder="Nombre completo" required minlength="3" maxlength="120" aria-label="Nombre completo">'
      + '<button class="ma-btn ma-btn-1" type="submit">Agregar</button></form>';
    return h;
  }
  function nombreEstado(e) {
    return { activo: 'En el aula', ingreso: 'Ingresó', retirado: 'Retirado', trasladado: 'Trasladado', desertor: 'Desertor' }[e] || e;
  }

  function pintarNotas(aula) {
    var asig = d.lista('asignaturas', { aula_id: aula.id }).sort(function (a, b) {
      return (a.orden || 0) - (b.orden || 0) || String(a.nombre).localeCompare(String(b.nombre), 'es');
    });
    var actual = asig.filter(function (x) { return x.id === vista.asignatura; })[0] || asig[0];
    var periodo = vista.periodo || 'I';
    var h = '<div class="ma-chips">' + asig.map(function (x) {
      var on = actual && x.id === actual.id;
      return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="asignatura" data-valor="'
        + esc(x.id) + '" aria-pressed="' + on + '">' + esc(x.nombre) + '</button>';
    }).join('') + '</div>';
    h += '<form class="ma-form ma-en-linea" data-form="asignatura"><input class="pa-inp-field" name="nombre" placeholder="Otra asignatura" maxlength="80" aria-label="Otra asignatura" required>'
      + '<button class="ma-btn" type="submit">Agregar</button></form>';
    if (!actual) return h + '<p class="ma-nota">Agrega una asignatura para anotar sus notas.</p>';
    h += '<div class="ma-chips" role="group" aria-label="Parcial">' + ['I', 'II', 'III', 'IV'].map(function (p) {
      var on = p === periodo;
      return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="periodo" data-valor="' + p
        + '" aria-pressed="' + on + '">Parcial ' + p + '</button>';
    }).join('') + '</div>';
    var notas = {};
    d.lista('notas', { asignatura_id: actual.id, periodo: periodo, componente: 'final' }).forEach(function (n) { notas[n.alumno_id] = n; });
    h += '<div class="ma-tabla">' + alumnos(aula).filter(sigue).map(function (a) {
      var n = notas[a.id];
      return '<label class="ma-renglon"><span class="ma-num">' + (a.num_lista == null ? '·' : esc(a.num_lista)) + '</span>'
        + '<span class="ma-nom">' + esc(a.nombre_completo) + '</span>'
        + '<input class="pa-inp-field ma-nota-inp" inputmode="decimal" maxlength="5" data-accion="nota" data-alumno="' + esc(a.id)
        + '" data-asignatura="' + esc(actual.id) + '" data-periodo="' + periodo + '" value="' + (n ? esc(n.valor) : '') + '" aria-label="Nota de '
        + esc(a.nombre_completo) + '"></label>';
    }).join('') + '</div>';
    return h;
  }

  var ESTADOS_ASIS = [['presente', '✓ Vino'], ['ausente', '✗ Faltó'], ['tarde', '⏱ Tarde'], ['excusa', '✉ Excusa']];
  function pintarAsistencia(aula) {
    var fecha = vista.fecha || hoy();
    var marcas = {};
    d.lista('asistencia', { aula_id: aula.id, fecha: fecha }).forEach(function (x) { marcas[x.alumno_id] = x; });
    var h = '<label class="ma-fecha">Día <input type="date" class="pa-inp-field" data-accion="fecha" value="' + esc(fecha) + '"></label>';
    h += '<div class="ma-tabla">' + alumnos(aula).filter(sigue).map(function (a) {
      var m = marcas[a.id];
      var actual = m ? m.estado : 'presente';
      return '<div class="ma-renglon ma-asis"><span class="ma-num">' + (a.num_lista == null ? '·' : esc(a.num_lista)) + '</span>'
        + '<span class="ma-nom">' + esc(a.nombre_completo) + '</span><span class="ma-botonera">'
        + ESTADOS_ASIS.map(function (e) {
          var on = e[0] === actual;
          return '<button type="button" class="ma-btn ma-btn-chico' + (on ? ' ma-on' : '') + '" data-accion="asistencia" data-alumno="'
            + esc(a.id) + '" data-valor="' + e[0] + '" aria-pressed="' + on + '">' + esc(e[1]) + '</button>';
        }).join('') + '</span></div>';
    }).join('') + '</div>';
    return h;
  }

  function pintarColectas(aula) {
    var lista = colectas(aula);
    var col = lista.filter(function (c) { return c.id === colectaAbierta; })[0];
    if (!col) {
      var h = '<div class="ma-colectas">' + lista.map(function (c) {
        return '<button type="button" class="ma-colecta" data-metas="colecta" data-estado="' + esc(c.estado) + '" data-accion="colecta" data-valor="'
          + esc(c.id) + '"><span class="ma-nom">' + esc(c.concepto) + '</span><span class="ma-sub">'
          + (c.estado === 'cerrada' ? '🔒 Cerrada · ' : '') + L(c.monto_sugerido) + '</span></button>';
      }).join('') + '</div>';
      if (!lista.length) h += '<p class="ma-nota">Todavía no hay colectas.</p>';
      h += '<form class="ma-form" data-form="colecta"><input class="pa-inp-field" name="concepto" placeholder="¿Para qué es? (excursión, refrigerio…)" required maxlength="120">'
        + '<div class="ma-fila2"><input class="pa-inp-field" name="monto" inputmode="decimal" placeholder="Cuánto por alumno (L)" required>'
        + '<input class="pa-inp-field" type="date" name="fecha" value="' + hoy() + '" required></div>'
        + '<button class="ma-btn ma-btn-1" type="submit">Nueva colecta</button></form>';
      return h;
    }
    var res = d.lista('v_colectas_resumen', { colecta_id: col.id })[0] || {};
    var porAlumno = {};
    d.lista('v_colecta_alumnos', { colecta_id: col.id }).forEach(function (x) { porAlumno[x.alumno_id] = x; });
    var h2 = '<button type="button" class="ma-volver" data-accion="colectas">← Colectas</button>'
      + '<h2 class="ma-titulo">' + esc(col.concepto) + (col.estado === 'cerrada' ? ' <span class="ma-chip">🔒 Cerrada</span>' : '') + '</h2>'
      + '<p class="ma-resumen">Por alumno: <b>' + L(col.monto_sugerido) + '</b> · Recaudado: <b>' + L(res.recaudado)
      + '</b> · Falta: <b>' + L(res.falta_total) + '</b></p>';
    // El cuadro para anotar sale JUSTO debajo de quien se tocó, no al final
    // de una lista de 43.
    var panel = '';
    if (pagoDe) {
      var al = alumnos(aula).filter(function (a) { return a.id === pagoDe; })[0];
      var xp = porAlumno[pagoDe] || {};
      if (al) {
        panel = '<form class="ma-form ma-panel" data-form="pago">'
          + '<label class="ma-et">Cuánto dio ' + esc(al.nombre_completo) + ' (L)<input class="pa-inp-field" data-metas="monto" name="monto" inputmode="decimal" value="'
          + (xp.falta && xp.falta !== '0.00' ? esc(xp.falta) : '') + '" required></label>'
          + '<button class="ma-btn ma-btn-1" type="submit" data-metas="anotar">Anotar</button></form>';
      }
    }
    h2 += '<div class="ma-pagos">' + alumnos(aula).filter(sigue).map(function (a) {
      var x = porAlumno[a.id] || {};
      var listo = x.situacion === 'pagado' || x.situacion === 'pago_de_mas' || x.situacion === 'no_corresponde';
      return '<button type="button" class="ma-pago' + (pagoDe === a.id ? ' ma-on' : '') + '" data-metas="pago-alumno" data-accion="pago-alumno" data-valor="' + esc(a.id) + '">'
        + '<span class="ma-num">' + (a.num_lista == null ? '·' : esc(a.num_lista)) + '</span><span class="ma-nom">' + esc(a.nombre_completo) + '</span>'
        + '<span class="ma-sub">' + (x.situacion === 'no_corresponde' ? '✓ No le corresponde'
          : (listo ? '✓ ' : '') + 'Dio ' + L(x.pagado) + (x.falta && x.falta !== '0.00' ? ' · falta ' + L(x.falta) : '')) + '</span></button>'
        + (pagoDe === a.id ? panel : '');
    }).join('') + '</div>';
    h2 += '<div class="ma-pie">' + (col.estado === 'cerrada'
      ? '<button type="button" class="ma-btn" data-accion="reabrir" data-valor="' + esc(col.id) + '">Reabrir la colecta</button>'
      : '<button type="button" class="ma-btn" data-accion="cerrar" data-valor="' + esc(col.id) + '">Cerrar la colecta</button>') + '</div>';
    return h2;
  }

  function pintarControles(aula) {
    var lista = d.lista('controles', { aula_id: aula.id }).sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
    var c = lista.filter(function (x) { return x.id === controlAbierto; })[0];
    if (!c) {
      var h = '<div class="ma-colectas">' + lista.map(function (x) {
        return '<button type="button" class="ma-colecta" data-accion="control" data-valor="' + esc(x.id) + '"><span class="ma-nom">'
          + esc(x.nombre) + '</span><span class="ma-sub">' + esc(fechaCorta(x.fecha)) + '</span></button>';
      }).join('') + '</div>';
      if (!lista.length) h += '<p class="ma-nota">Un control es una lista para marcar: tareas, materiales, firmas.</p>';
      return h + '<form class="ma-form ma-en-linea" data-form="control"><input class="pa-inp-field" name="nombre" placeholder="¿Qué vas a revisar?" required maxlength="120" aria-label="¿Qué vas a revisar?">'
        + '<button class="ma-btn ma-btn-1" type="submit">Nuevo control</button></form>';
    }
    var marcas = {};
    d.lista('control_valores', { control_id: c.id }).forEach(function (v) { marcas[v.alumno_id] = v; });
    return '<button type="button" class="ma-volver" data-accion="controles">← Controles</button><h2 class="ma-titulo">' + esc(c.nombre) + '</h2>'
      + '<div class="ma-tabla">' + alumnos(aula).filter(sigue).map(function (a) {
        var on = !!(marcas[a.id] && marcas[a.id].marcado);
        return '<button type="button" class="ma-renglon ma-marca' + (on ? ' ma-on' : '') + '" data-accion="marca" data-alumno="' + esc(a.id)
          + '" aria-pressed="' + on + '"><span class="ma-num">' + (a.num_lista == null ? '·' : esc(a.num_lista)) + '</span><span class="ma-nom">'
          + esc(a.nombre_completo) + '</span><span class="ma-check">' + (on ? '✓' : '○') + '</span></button>';
      }).join('') + '</div>';
  }

  function pintarAvisos(aula) {
    var lista = d.lista('avisos', { aula_id: aula.id }).sort(function (a, b) {
      return String(b.created_at || '9').localeCompare(String(a.created_at || '9'));
    });
    return '<form class="ma-form" data-form="aviso"><input class="pa-inp-field" name="titulo" placeholder="Aviso para las familias" required maxlength="160">'
      + '<textarea class="pa-inp-field" name="texto" rows="3" placeholder="Detalle (si hace falta)" maxlength="2000"></textarea>'
      + '<button class="ma-btn ma-btn-1" type="submit">Publicar aviso</button></form>'
      + '<div class="ma-tabla">' + lista.map(function (x) {
        return '<div class="ma-tarjetita"><b>' + esc(x.titulo) + '</b>' + (x.texto ? '<p>' + esc(x.texto) + '</p>' : '') + '</div>';
      }).join('') + '</div>';
  }

  var TIPOS_CONDUCTA = [['felicitacion', '⭐ Felicitación'], ['llamado', '📣 Llamado de atención'], ['leve', '⚠ Falta leve']];
  function pintarConducta(aula) {
    var lista = alumnos(aula).filter(sigue);
    var nombres = {};
    lista.forEach(function (a) { nombres[a.id] = a.nombre_completo; });
    var obs = d.lista('observaciones', { aula_id: aula.id }).sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
    return '<form class="ma-form" data-form="conducta">'
      + '<select class="pa-inp-field" name="alumno" required aria-label="Alumno"><option value="">¿De quién?</option>'
      + lista.map(function (a) { return '<option value="' + esc(a.id) + '">' + esc(a.nombre_completo) + '</option>'; }).join('') + '</select>'
      + '<div class="ma-chips" role="radiogroup" aria-label="Tipo">' + TIPOS_CONDUCTA.map(function (t, i) {
        return '<label class="ma-radio"><input type="radio" name="tipo" value="' + t[0] + '"' + (i === 0 ? ' checked' : '') + '> ' + esc(t[1]) + '</label>';
      }).join('') + '</div>'
      + '<textarea class="pa-inp-field" name="texto" rows="2" placeholder="Qué pasó" required maxlength="500"></textarea>'
      + '<button class="ma-btn ma-btn-1" type="submit">Anotar</button></form>'
      + '<div class="ma-tabla">' + obs.slice(0, 30).map(function (o) {
        var t = TIPOS_CONDUCTA.filter(function (x) { return x[0] === o.tipo; })[0];
        return '<div class="ma-tarjetita"><b>' + esc(nombres[o.alumno_id] || '') + '</b> · ' + esc(t ? t[1] : o.tipo) + ' · ' + esc(fechaCorta(o.fecha))
          + '<p>' + esc(o.texto) + '</p></div>';
      }).join('') + '</div>';
  }

  function pintarGastos(aula) {
    var lista = colectas(aula);
    if (!lista.length) return '<p class="ma-nota">Los gastos son de una colecta. Primero crea una en «Colectas».</p>';
    var col = lista.filter(function (c) { return c.id === vista.colectaGastos; })[0] || lista[0];
    var res = d.lista('v_colectas_resumen', { colecta_id: col.id })[0] || {};
    var gastos = d.lista('gastos', { colecta_id: col.id }).sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
    return '<label class="ma-et">Colecta<select class="pa-inp-field" data-accion="colecta-gastos">' + lista.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === col.id ? ' selected' : '') + '>' + esc(c.concepto) + (c.estado === 'cerrada' ? ' (cerrada)' : '') + '</option>';
    }).join('') + '</select></label>'
      + '<p class="ma-resumen">Recaudado: <b>' + L(res.recaudado) + '</b> · Gastado: <b>' + L(res.gastado) + '</b> · Queda: <b>' + L(res.saldo) + '</b></p>'
      + '<form class="ma-form" data-form="gasto" data-colecta="' + esc(col.id) + '"><input class="pa-inp-field" name="concepto" placeholder="¿En qué se gastó?" required maxlength="160">'
      + '<div class="ma-fila2"><input class="pa-inp-field" name="monto" inputmode="decimal" placeholder="Cuánto (L)" required>'
      + '<input class="pa-inp-field" type="date" name="fecha" value="' + hoy() + '" required></div>'
      + '<button class="ma-btn ma-btn-1" type="submit">Anotar gasto</button></form>'
      + '<div class="ma-tabla">' + gastos.map(function (g) {
        return '<div class="ma-tarjetita"><b>' + L(g.monto) + '</b> · ' + esc(g.concepto) + ' · ' + esc(fechaCorta(g.fecha)) + '</div>';
      }).join('') + '</div>';
  }

  function pintarCarga() {
    return '<form class="ma-form" data-form="carga-vista">'
      + '<label class="ma-et">Pega la lista, un nombre por renglón (si tienes la identidad, va al final del renglón)'
      + '<textarea class="pa-inp-field" name="pegado" rows="8" data-metas="carga-pegar">' + esc(cargaTexto) + '</textarea></label>'
      + '<button class="ma-btn" type="submit" data-metas="carga-vista-previa">Ver cómo queda</button></form>'
      + (avisoCarga ? '<p class="ma-nota">' + esc(avisoCarga) + '</p>' : '')
      + (cargaFilas.length ? '<div class="ma-tabla">' + cargaFilas.map(function (f, i) {
        return '<div class="ma-renglon" data-metas="carga-fila"><span class="ma-num">' + (i + 1) + '</span><span class="ma-nom">' + esc(f.nombre)
          + '</span>' + (f.identidad ? '<span class="ma-sub">' + esc(f.identidad) + '</span>' : '') + '</div>';
      }).join('') + '</div>' : '')
      + '<button type="button" class="ma-btn ma-btn-1" data-metas="carga-guardar" data-accion="carga-guardar">Agregar a la lista</button>';
  }

  var PINTORES = {
    lista: pintarLista, notas: pintarNotas, asistencia: pintarAsistencia, colectas: pintarColectas,
    controles: pintarControles, avisos: pintarAvisos, conducta: pintarConducta, gastos: pintarGastos,
    'carga-rapida': pintarCarga,
  };

  // ── La tarjeta: una pregunta, un «no quedó anotado» o la contraseña ────
  function pintarTarjeta() {
    var t = document.getElementById('ma-tarjeta');
    if (!t || !d) return;
    var hay = !!(d.cuenta() || d.pideContrasena());
    var p = preguntaLocal || (hay && d.preguntas()[0]);
    var h = '';
    if (reabriendo) {
      h = '<div class="ma-carta" role="dialog" aria-label="Reabrir la colecta"><form data-form="reabrir">'
        + '<label class="ma-et">¿Por qué? (puedes dejarlo en blanco)<input class="pa-inp-field" name="motivo" maxlength="200"></label>'
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
      h = '<div class="ma-carta" role="dialog"><form data-form="clave"><label class="ma-et">Escribe tu contraseña'
        + '<input class="pa-inp-field" type="password" name="clave" autocomplete="current-password" required></label>'
        + '<div class="ma-botones"><button class="ma-btn ma-btn-1" type="submit">Entrar</button></div></form></div>';
    }
    t.innerHTML = h;
    t.hidden = !h;
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

  // Tocar algo de una colecta cerrada: antes de nada, la pregunta (09, 9.4).
  function siCerrada(colectaId, luego) {
    var col = d.lista('colectas', { id: colectaId })[0];
    if (!col || col.estado !== 'cerrada') return luego();
    preguntaLocal = {
      id: 'local', texto: 'Esta colecta está cerrada. ¿Reabrirla?',
      botones: [{ etiqueta: 'Reabrir', valor: 'reabrir' }, { etiqueta: 'Dejarla cerrada', valor: 'dejarla_cerrada' }],
      colecta: colectaId, luego: luego,
    };
    pintarTarjeta();
  }

  function alClic(ev) {
    var b = ev.target.closest('[data-accion]');
    if (!b || !d || b.tagName === 'SELECT' || (b.tagName === 'INPUT' && b.type !== 'button')) return;
    var acc = b.getAttribute('data-accion');
    var v = b.getAttribute('data-valor');
    var aula = aulaActual();
    switch (acc) {
      case 'pantalla':
        vista.pantalla = v; guardarPref();
        colectaAbierta = null; pagoDe = null; controlAbierto = null; alumnoAbierto = null;
        return pintar();
      case 'alumno': alumnoAbierto = alumnoAbierto === v ? null : v; return pintar();
      case 'estado':
        intentar(function () { d.editar('alumnos', b.getAttribute('data-alumno'), { estado: v, estado_fecha: hoy() }); });
        alumnoAbierto = null;
        return pintar();
      case 'asignatura': vista.asignatura = v; guardarPref(); return pintar();
      case 'periodo': vista.periodo = v; guardarPref(); return pintar();
      case 'asistencia': return marcarAsistencia(aula, b.getAttribute('data-alumno'), v);
      case 'colecta': colectaAbierta = v; pagoDe = null; return pintar();
      case 'colectas': colectaAbierta = null; pagoDe = null; return pintar();
      case 'pago-alumno':
        return siCerrada(colectaAbierta, function () {
          pagoDe = v; pintar();
          var m = document.querySelector('[data-metas="monto"]');
          if (m) m.focus();
        });
      case 'cerrar': intentar(function () { d.colecta.cerrar(v); }); pagoDe = null; return pintar();
      case 'reabrir': reabriendo = { colecta: v, luego: null }; return pintarTarjeta();
      case 'control': controlAbierto = v; return pintar();
      case 'controles': controlAbierto = null; return pintar();
      case 'marca': return marcar(aula, b.getAttribute('data-alumno'));
      case 'carga-guardar': return guardarCarga(aula);
      case 'entendido': d.entendido(v); return pintarTarjeta();
      case 'responder': return responder(b.getAttribute('data-pregunta'), v);
    }
  }

  function responder(id, valor) {
    if (id === 'local' && preguntaLocal) {
      var p = preguntaLocal;
      preguntaLocal = null;
      if (valor === 'reabrir') reabriendo = { colecta: p.colecta, luego: p.luego };
      pintarTarjeta();
      return;
    }
    Promise.resolve(d.responder(id, valor)).then(pedirPintar);
  }

  function marcarAsistencia(aula, alumno, estado) {
    var fecha = vista.fecha || hoy();
    var hay = d.lista('asistencia', { alumno_id: alumno, fecha: fecha })[0];
    intentar(function () {
      if (estado === 'presente') { if (hay) d.borrar('asistencia', hay.id); }
      else if (hay) d.editar('asistencia', hay.id, { estado: estado });
      else d.crear('asistencia', { aula_id: aula.id, alumno_id: alumno, fecha: fecha, estado: estado });
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

  function alCambiar(ev) {
    var el = ev.target;
    var acc = el.getAttribute && el.getAttribute('data-accion');
    if (!acc || !d) return;
    if (acc === 'aula') { vista.aula = el.value; guardarPref(); colectaAbierta = null; return pintar(); }
    if (acc === 'fecha') { vista.fecha = el.value || hoy(); guardarPref(); return pintar(); }
    if (acc === 'colecta-gastos') { vista.colectaGastos = el.value; guardarPref(); return pintar(); }
    if (acc === 'nota') return anotarNota(el);
  }

  function anotarNota(el) {
    var txt = el.value.trim().replace(',', '.');
    var alumno = el.getAttribute('data-alumno');
    var asig = el.getAttribute('data-asignatura');
    var periodo = el.getAttribute('data-periodo');
    var hay = d.lista('notas', { alumno_id: alumno, asignatura_id: asig, periodo: periodo, componente: 'final' })[0];
    var renglon = el.closest('.ma-renglon');
    if (txt === '') {
      if (hay) intentar(function () { d.borrar('notas', hay.id); }, renglon);
      return;
    }
    // La nota viaja como texto (03, 3.2); aquí solo se revisa que sea de 0 a 100.
    var m = /^(\d{1,3})(\.\d{1,2})?$/.exec(txt);
    var cien = m && (m[1].length < 3 || txt === '100' || /^100\.0{1,2}$/.test(txt));
    if (!cien) { avisarEn(renglon, 'Escribe una nota de 0 a 100.'); return; }
    intentar(function () {
      if (hay) d.editar('notas', hay.id, { valor: txt });
      else d.crear('notas', { aula_id: aulaActual().id, alumno_id: alumno, asignatura_id: asig, periodo: periodo, componente: 'final', valor: txt });
    }, renglon);
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
        }, f);
        break;
      case 'alumno':
        var n = alumnos(aula).reduce(function (x, a) { return Math.max(x, a.num_lista || 0); }, 0);
        ok = intentar(function () { d.crear('alumnos', { aula_id: aula.id, nombre_completo: datos.nombre, num_lista: n + 1 }); }, f);
        break;
      case 'asignatura':
        ok = intentar(function () {
          vista.asignatura = d.crear('asignaturas', { aula_id: aula.id, nombre: datos.nombre }).id; guardarPref();
        }, f);
        break;
      case 'colecta':
        ok = intentar(function () {
          colectaAbierta = d.colecta.crear({ aula_id: aula.id, concepto: datos.concepto, monto_sugerido: datos.monto, fecha: datos.fecha }).id;
        }, f);
        break;
      case 'pago':
        var alumno = pagoDe;
        var col = colectaAbierta;
        return siCerrada(col, function () {
          if (intentar(function () { d.pagar({ colecta_id: col, alumno_id: alumno, monto: datos.monto, fecha: hoy() }); }, f)) {
            pagoDe = null;
            pintar();
          }
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
          if (intentar(function () { d.gasto.crear({ colecta_id: cg, concepto: datos.concepto, monto: datos.monto, fecha: datos.fecha }); }, f)) pintar();
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
      // La flecha sube un nivel: de una colecta o un control, a su lista.
      if (colectaAbierta || controlAbierto) { colectaAbierta = null; controlAbierto = null; pagoDe = null; pintar(); return; }
      if (typeof window.switchView === 'function') window.switchView('view-perfil');
      return;
    }
    if (ev.target.closest('#mi-aula') || ev.target.closest('#ma-tarjeta')) alClic(ev);
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.closest && ev.target.closest('#mi-aula')) alCambiar(ev);
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
