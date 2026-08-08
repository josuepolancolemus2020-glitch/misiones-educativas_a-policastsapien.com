/* ══════════════════════════════════════════════════════════════════
   🚌 SALIDA O EXCURSIÓN — «¿quién va?» antes de contratar el bus
   Vive en «Mi aula» → ✅ Controles.
   ══════════════════════════════════════════════════════════════════
   EL PROBLEMA QUE RESUELVE

   El maestro tiene que contratar el transporte el martes y no sabe
   cuántos van. Preguntarlo en el grupo de WhatsApp no sirve: las
   respuestas llegan sueltas entre cien mensajes («nosotros sí», «yo
   voy con dos»), nadie dice de qué grado es y al final el maestro
   cuenta a mano hacia arriba en el chat. Contrata dos buses y le
   sobran veinte campos, o contrata uno y deja gente en la acera.

   Aquí arma la invitación en un minuto, la manda al grupo, y las
   respuestas le vuelven al WhatsApp con una línea corta que esta
   pantalla suma sola: personas, BUSES y dinero esperado.

   POR QUÉ LAS RESPUESTAS VUELVEN POR WHATSAPP Y NO A LA NUBE

   El enlace no cae solo en el grupo de su grado: cae en el de toda la
   escuela. Pedir la clave de familia dejaría fuera a los demás grados,
   y guardar en la nube obligaría a abrir una tabla a escritura anónima
   —cualquiera con el enlace metiendo filas— y a correr SQL nuevo antes
   del martes. Por WhatsApp, además, le queda EL NÚMERO DE TELÉFONO de
   quien contestó, que es justo lo que necesita para cobrar la otra
   semana y para llamar al que no pague.

   POR QUÉ UNA SOLA SALIDA A LA VEZ

   Esto no es el archivo de la salida: es la mesa donde se cuenta antes
   de contratar. Lo que hay que conservar se pasa con un toque a donde
   ya vive —el 🎟️ control de inscritos y la 💰 colecta del pago— y esos
   sí se guardan para siempre. Por eso empezar otra salida pregunta
   antes de borrar: es dato del maestro.
   ══════════════════════════════════════════════════════════════════ */

/* ── El código del enlace ──
   ⚠ DUPLICADO A PROPÓSITO en excursion.html. Tiene que estarlo: esa
   página la abre una madre que no tiene la app y no puede cargar nada
   de aquí. Si se toca una, se toca la otra, o los enlaces que ya se
   repartieron por WhatsApp dejan de abrirse. */
var EXC_SEP = '\u001f';
function excEmpacar(campos) {
  var s = campos.map(function (v) {
    return String(v == null ? '' : v).split(EXC_SEP).join(' ');
  }).join(EXC_SEP);
  /* unescape(encodeURIComponent(...)) es el camino de UTF-8 a base64 que
     funciona hasta en los WebView viejos de Android. Los signos + / = se
     cambian por - . porque WhatsApp decora y recorta los enlaces. */
  var b = btoa(unescape(encodeURIComponent(s)));
  return b.split('+').join('-').split('/').join('.').replace(/=+$/, '');
}
/* Se añade AL FINAL, nunca en medio: un enlace ya mandado sigue vivo en
   el teléfono de la familia y tiene que seguir abriéndose igual. */
var EXC_CAMPOS = ['ver', 'titulo', 'fecha', 'hsal', 'hreg', 'precio', 'incluye',
  'llevar', 'wa', 'limite', 'maestro', 'escuela', 'punto', 'cap', 'abierto',
  'grupo', 'gancho', 'pago', 'icono'];

var EXC_ICONOS = ['🚌', '🚂', '🏛️', '🌋', '🏖️', '🦁', '⚽', '🎭', '🏭', '🌳'];
var EXC_CAP_DEF = 45;      /* bus escolar típico; el maestro lo cambia */

/* ── Estado ──
   Vive DENTRO del grupo (d.excursion), así que viaja solo entre los
   equipos del maestro con el espejo de la Zona Docente, igual que sus
   colectas y sus controles. */
function excDef(d) {
  var g = d || {};
  return {
    titulo: '', icono: '🚌', fecha: '', hsal: '', hreg: '', punto: '',
    precio: '', incluye: '', llevar: '', pago: '', limite: '', gancho: '',
    cap: EXC_CAP_DEF, wa: '',
    maestro: (typeof adDocenteNombre === 'function' ? adDocenteNombre() : ''),
    escuela: g.escuela || '',
    grupo: (typeof adGradoSeccion === 'function' ? adGradoSeccion(g.grado, g.seccion) : ''),
    respuestas: [],
  };
}
function excGet(d) {
  var e = (d && d.excursion && typeof d.excursion === 'object') ? d.excursion : null;
  if (!e) return null;
  e.respuestas = Array.isArray(e.respuestas) ? e.respuestas : [];
  return e;
}

/* ── Cuentas ──
   Solo cuenta lo confirmado. Un «no» vale para saber que la familia YA
   contestó (y no volverla a molestar), pero no ocupa campo en el bus. */
function excSi(e) { return (e.respuestas || []).filter(function (r) { return r.va; }); }
function excNo(e) { return (e.respuestas || []).filter(function (r) { return !r.va; }); }
function excPersonas(e) {
  return excSi(e).reduce(function (s, r) { return s + (+r.alumnos || 0) + (+r.adultos || 0); }, 0);
}
function excAlumnos(e) { return excSi(e).reduce(function (s, r) { return s + (+r.alumnos || 0); }, 0); }
function excAdultos(e) { return excSi(e).reduce(function (s, r) { return s + (+r.adultos || 0); }, 0); }
function excDinero(e) { return excPersonas(e) * (Number(e.precio) || 0); }
function excBuses(e) {
  var cap = Math.max(1, Number(e.cap) || EXC_CAP_DEF);
  return Math.ceil(excPersonas(e) / cap) || 0;
}
/* Los campos que sobrarían en el último bus: es el número con el que el
   maestro decide si le conviene esperar dos respuestas más o achicarse. */
function excSobran(e) {
  var cap = Math.max(1, Number(e.cap) || EXC_CAP_DEF);
  var b = excBuses(e);
  return b ? b * cap - excPersonas(e) : 0;
}

/* ── Nombres ──
   El padre escribe «Juan Perez» y en la lista dice «Juan Carlos Pérez
   Mejía». Comparar letra por letra dejaría al niño fuera del conteo, así
   que se comparan PALABRAS sin tildes: si todas las del nombre corto
   están en el largo, es el mismo niño. Es la comparación que perdona
   tildes, apellidos de menos y mayúsculas, que es como escribe la gente
   en un teléfono. */
function excNorm(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function excPalabras(s) {
  return excNorm(s).split(' ').filter(function (w) { return w.length > 2; });
}
function excMismoNombre(a, b) {
  var A = excPalabras(a), B = excPalabras(b);
  if (!A.length || !B.length) return false;
  var corto = A.length <= B.length ? A : B, largo = corto === A ? B : A;
  return corto.every(function (w) { return largo.indexOf(w) >= 0; });
}
/* Dos respuestas del mismo niño = la última manda. Una madre que se
   equivoca y vuelve a contestar tiene que poder corregirse sola: si se
   sumaran las dos, el bus saldría con campos apartados de más. */
function excMismaResp(a, b) {
  return String(a.grado || '') === String(b.grado || '') &&
    String(a.seccion || '') === String(b.seccion || '') &&
    excMismoNombre(a.nombre, b.nombre);
}

/* ── Leer las respuestas pegadas del WhatsApp ──
   Se busca la línea corta en CUALQUIER parte del texto pegado: da igual
   que venga un mensaje suelto, veinte seguidos o la exportación entera
   del chat con sus «[8/8/26, 10:32] Mamá de Juan:» delante. */
var EXC_RE = /#METAS\s*\|\s*(SI|NO)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^\n\r]+)/gi;
function excParsear(txt) {
  var out = [], m;
  EXC_RE.lastIndex = 0;
  while ((m = EXC_RE.exec(String(txt || '')))) {
    var nombre = String(m[6] || '').trim().replace(/\s+/g, ' ');
    if (!nombre) continue;
    out.push({
      va: /^si$/i.test(m[1]),
      alumnos: Math.max(0, Math.min(9, +m[2] || 0)),
      adultos: Math.max(0, Math.min(9, +m[3] || 0)),
      grado: String(m[4] || '').replace(/\D/g, ''),
      seccion: String(m[5] || '').trim().toUpperCase(),
      nombre: nombre.slice(0, 60),
    });
  }
  return out;
}

/* ── El enlace que se manda ── */
function excBase() {
  var u = location.origin + location.pathname.replace(/[^/]*$/, '');
  /* Abierto desde el teléfono como archivo (file://) no hay origen que
     valga: se apunta al sitio publicado, que es de donde lo abrirán las
     familias de todos modos. */
  if (!/^https?:/.test(u)) return 'https://metas.policastsapien.com/';
  return u;
}
function excEnlace(e) {
  var vals = EXC_CAMPOS.map(function (k) {
    if (k === 'ver') return '1';
    if (k === 'abierto') return '1';
    return e[k] == null ? '' : e[k];
  });
  return excBase() + 'excursion.html#' + excEmpacar(vals);
}
/* WhatsApp quiere el número con código de país y sin signos. En Honduras
   el maestro lo escribe de 8 dígitos («9999-8888»), así que se le pone el
   504 solo: si no, el botón del padre abre un chat con nadie. */
function excWaNum(s) {
  var n = String(s || '').replace(/\D/g, '');
  if (n.length === 8) n = '504' + n;
  return n;
}

var EXC_MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var EXC_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
/* Se parte a mano para que la zona horaria no corra la fecha un día
   atrás, que en Honduras (UTC-6) pasa siempre con new Date('2026-08-15'). */
function excFechaObj(iso) {
  var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
function excFechaLarga(iso) {
  var d = excFechaObj(iso);
  return d ? EXC_DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + EXC_MESES[d.getMonth()] : '';
}
function excDiasHasta(iso) {
  var d = excFechaObj(iso); if (!d) return null;
  var h = new Date(); h = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  return Math.round((d - h) / 86400000);
}
function excLps(n) {
  return typeof adLps === 'function' ? adLps(n) : ('L ' + (Number(n) || 0));
}

/* El mensaje para el grupo de WhatsApp de la escuela. Es lo que de verdad
   decide si contestan: se lee en dos segundos entre cien mensajes, dice
   QUÉ gana el niño, CUÁNTO cuesta y CUÁNDO se cierra. El enlace va solo
   en su renglón y sin punto detrás: WhatsApp se lo tragaría dentro del
   enlace y no abriría. */
function excInvitacion(e) {
  var L = [];
  L.push((e.icono || '🚌') + ' *' + String(e.titulo || '').toUpperCase() + '*');
  if (e.fecha) L.push('📅 ' + excFechaLarga(e.fecha) +
    (e.hsal ? ' · sale a las ' + e.hsal : '') + (e.hreg ? ' · regresa ' + e.hreg : ''));
  L.push('');
  L.push('Padres y madres' + (e.escuela ? ' de ' + e.escuela : '') + ': estamos organizando una ' +
    'salida educativa y necesitamos saber *cuántos van* para contratar el transporte.');
  if (e.gancho) L.push('', e.gancho);
  L.push('', '👉 Conteste aquí, le toma un minuto:');
  L.push(excEnlace(e));
  L.push('');
  L.push('✅ Usted puede acompañar a su hijo o hija.');
  if (Number(e.precio) > 0) L.push('💵 Aporte: ' + excLps(e.precio) + ' por cada persona que va.');
  if (e.pago) L.push('💰 ' + e.pago);
  if (e.limite) L.push('⏰ *Conteste antes del ' + excFechaLarga(e.limite) + '*: el transporte se ' +
    'contrata con los que estén confirmados.');
  L.push('');
  L.push('_Conteste aunque sea que NO: así no apartamos un campo que nadie va a usar._');
  if (e.maestro) L.push('', '— Prof. ' + e.maestro + (e.grupo ? ' · ' + e.grupo : ''));
  return L.join('\n');
}

/* ══════════════════ LA PUERTA, EN ✅ CONTROLES ══════════════════
   Va arriba del todo y con el estado a la vista (personas y buses) porque
   mientras una salida está abierta ese es el número que el maestro viene
   a mirar diez veces al día. Cerrada la salida, es una tarjeta más. */
function excTarjetaEntrada(d) {
  var e = excGet(d);
  if (!e || !e.titulo) {
    return '<div class="pa-card exc-puerta">' +
      '<button class="exc-puerta-btn" id="exc-entrar">' +
        '<span class="exc-p-ic">🚌</span>' +
        '<span class="exc-p-txt"><b>Salida o excursión</b>' +
          '<small>¿Cuántos van? Manda un enlace al grupo de WhatsApp y sabe a quién llevar ' +
          'y cuántos buses contratar, antes de contratarlos.</small></span>' +
        '<span class="ad-cr-arrow">›</span>' +
      '</button></div>';
  }
  var dias = excDiasHasta(e.limite || e.fecha);
  var estado = dias === null ? '' : dias < 0 ? ' · ⛔ ya cerró'
    : dias === 0 ? ' · ⏰ hoy se cierra' : ' · ⏰ faltan ' + dias + ' día' + (dias === 1 ? '' : 's');
  return '<div class="pa-card exc-puerta exc-puerta-viva">' +
    '<button class="exc-puerta-btn" id="exc-entrar">' +
      '<span class="exc-p-ic">' + (e.icono || '🚌') + '</span>' +
      '<span class="exc-p-txt"><b>' + adEsc(e.titulo) + '</b>' +
        '<small>' + excPersonas(e) + ' persona(s) confirmadas · ' + excBuses(e) + ' bus(es)' +
        adEsc(estado) + '</small></span>' +
      '<span class="ad-cr-arrow">›</span>' +
    '</button></div>';
}
function excEnganchaEntrada() {
  var b = document.getElementById('exc-entrar');
  if (b) b.addEventListener('click', function () { adAbrirExcursion(); });
}

/* ══════════════════ PANTALLA ══════════════════ */
function excRender(body, d) {
  var e = excGet(d);
  if (!e) { excRenderNueva(body, d); return; }
  body.innerHTML =
    '<div class="pa-card">' +
      '<button class="nav-ruta-link" id="exc-volver">🗂️ Volver a Controles</button>' +
      '<div class="pa-card-title" style="margin-top:10px">' + (e.icono || '🚌') + ' ' + adEsc(e.titulo || 'Salida sin nombre') + '</div>' +
      excCabecera(e) +
    '</div>' +
    excCardEnlace(e) +
    excCardRespuestas(e, d) +
    excCardConfig(e);

  document.getElementById('exc-volver').addEventListener('click', function () {
    adSalirExcursion();
  });
  excEnganchaEnlace(e);
  excEnganchaRespuestas(e, d);
  excEnganchaConfig(e, d);
}

function excCabecera(e) {
  var dias = excDiasHasta(e.limite || e.fecha);
  var estado = dias === null ? ''
    : dias < 0 ? '<span class="exc-chip exc-chip-mal">⛔ Ya cerró</span>'
    : dias === 0 ? '<span class="exc-chip exc-chip-urge">⏰ Hoy es el último día</span>'
    : '<span class="exc-chip exc-chip-ok">⏰ Faltan ' + dias + ' día' + (dias === 1 ? '' : 's') + '</span>';
  return '<div class="exc-chips">' +
    (e.fecha ? '<span class="exc-chip">📅 ' + adEsc(excFechaLarga(e.fecha)) + '</span>' : '') +
    (Number(e.precio) > 0 ? '<span class="exc-chip">💵 ' + excLps(e.precio) + ' c/u</span>' : '') +
    '<span class="exc-chip">🚌 ' + adEsc(String(e.cap || EXC_CAP_DEF)) + ' por bus</span>' +
    estado + '</div>';
}

/* ── Paso 2 · el enlace ── */
function excCardEnlace(e) {
  var url = excEnlace(e);
  var num = excWaNum(e.wa);
  return '<div class="pa-card">' +
    '<div class="pa-card-title">2️⃣ Manda la invitación</div>' +
    (num ? '' : '<p class="pa-optional-hint">⚠️ <strong>Te falta tu WhatsApp.</strong> Sin él, ' +
      'el padre tiene que buscarte a mano en sus contactos y la mitad no lo hace. ' +
      'Ponlo abajo, en «Cómo es la salida».</p>') +
    '<p class="pa-optional-hint">Este es el enlace. Mándalo al grupo de la escuela: ' +
      'lo puede contestar <strong>cualquier familia, de cualquier grado</strong>, sin clave y sin instalar nada.</p>' +
    '<input class="pa-inp-field exc-url" id="exc-url" readonly value="' + adEsc(url) + '">' +
    '<div class="ad-btn-row">' +
      '<button class="pa-generate-btn" id="exc-wa">📲 Mandarlo al grupo de WhatsApp</button>' +
    '</div>' +
    '<div class="ad-btn-row">' +
      '<button class="pa-generate-btn ad-btn-sec" id="exc-copiar-msg">📋 Copiar la invitación completa</button>' +
      '<button class="pa-generate-btn ad-btn-sec" id="exc-copiar-url">🔗 Copiar solo el enlace</button>' +
    '</div>' +
    '<div class="ad-btn-row">' +
      '<button class="pa-generate-btn ad-btn-sec" id="exc-ver">👁 Ver cómo lo verá la familia</button>' +
    '</div>' +
    '<details class="exc-det"><summary>Ver el mensaje que se va a mandar</summary>' +
      '<pre class="exc-pre">' + adEsc(excInvitacion(e)) + '</pre></details>' +
  '</div>';
}
function excEnganchaEnlace(e) {
  var u = document.getElementById('exc-url');
  if (u) u.addEventListener('click', function () { u.select(); });
  document.getElementById('exc-wa').addEventListener('click', function () {
    /* Sin número de destino: WhatsApp abre el selector y el maestro elige
       el GRUPO de la escuela, que es a donde va esto. */
    window.open('https://wa.me/?text=' + encodeURIComponent(excInvitacion(e)), '_blank');
  });
  document.getElementById('exc-copiar-msg').addEventListener('click', function () {
    adCopiar(excInvitacion(e),
      function () { toast('📋 Copiado: pégalo en el grupo de WhatsApp'); },
      function () { toast('⚠️ No se pudo copiar en este navegador'); });
  });
  document.getElementById('exc-copiar-url').addEventListener('click', function () {
    adCopiar(excEnlace(e),
      function () { toast('🔗 Enlace copiado'); },
      function () { toast('⚠️ No se pudo copiar en este navegador'); });
  });
  document.getElementById('exc-ver').addEventListener('click', function () {
    window.open(excEnlace(e), '_blank');
  });
}

/* ── Paso 3 · las respuestas ── */
function excCardRespuestas(e, d) {
  var personas = excPersonas(e), buses = excBuses(e);
  var propio = excFaltanDeMiLista(e, d);
  var porGrado = excPorGrado(e);

  return '<div class="pa-card">' +
    '<div class="pa-card-title">3️⃣ Lo que ya contestaron</div>' +
    '<div class="exc-tablero">' +
      excCifra('👥', personas, 'personas confirmadas',
        excAlumnos(e) + ' alumno(s) y ' + excAdultos(e) + ' adulto(s)') +
      excCifra('🚌', buses, buses === 1 ? 'bus' : 'buses',
        buses ? 'de ' + (e.cap || EXC_CAP_DEF) + ' campos · sobran ' + excSobran(e) : 'aún nadie confirma') +
      excCifra('💵', Number(e.precio) > 0 ? excLps(excDinero(e)) : '—', 'debería recogerse',
        Number(e.precio) > 0 ? personas + ' × ' + excLps(e.precio) : 'salida sin costo') +
    '</div>' +

    '<p class="pa-optional-hint">Cuando te lleguen las respuestas al WhatsApp: <strong>mantén ' +
      'presionado un mensaje</strong>, marca todos los que quieras, tócale «copiar» y pégalos aquí. ' +
      'Se pueden pegar de uno en uno o de veinte en veinte, y volver a pegar los mismos no los duplica.</p>' +
    '<textarea id="exc-pegar" class="pa-paste-area" rows="4" ' +
      'placeholder="Pega aquí lo que copiaste de WhatsApp…"></textarea>' +
    '<div class="ad-btn-row">' +
      '<button class="pa-generate-btn" id="exc-sumar">➕ Sumar estas respuestas</button>' +
    '</div>' +
    '<div class="ad-btn-row">' +
      '<button class="pa-generate-btn ad-btn-sec" id="exc-mano">✍️ Anotar una que me dijeron de palabra</button>' +
    '</div>' +

    (porGrado.length ? '<div class="pa-card-title" style="margin-top:18px">🏫 De qué grados vienen</div>' +
      '<div class="filas-exc">' + porGrado.map(function (g) {
        return '<div class="ad-gasto-row"><span><strong>' + adEsc(g.et) + '</strong> · ' +
          g.confirmados + ' familia(s)</span><span><strong>' + g.personas + ' persona(s)</strong></span></div>';
      }).join('') + '</div>' : '') +

    excListaRespuestas(e) +
    excCardFaltan(propio, e) +

    (excSi(e).length ? '<div class="ad-btn-row" style="margin-top:14px">' +
      '<button class="pa-generate-btn ad-btn-sec" id="exc-a-control">🎟️ Pasarlos a un control del aula</button>' +
      '</div>' +
      (Number(e.precio) > 0 ? '<div class="ad-btn-row">' +
        '<button class="pa-generate-btn ad-btn-sec" id="exc-a-colecta">💰 Abrir la colecta del pago</button>' +
        '</div>' : '') +
      '<div class="ad-btn-row">' +
        '<button class="pa-generate-btn ad-btn-sec" id="exc-imprimir">🖨️ Imprimir la lista del bus</button>' +
      '</div>' : '') +
  '</div>';
}
function excCifra(ic, n, et, sub) {
  return '<div class="exc-cifra"><div class="exc-c-ic">' + ic + '</div>' +
    '<div class="exc-c-n">' + adEsc(String(n)) + '</div>' +
    '<div class="exc-c-et">' + adEsc(et) + '</div>' +
    '<div class="exc-c-sub">' + adEsc(sub) + '</div></div>';
}
function excPorGrado(e) {
  var map = {};
  excSi(e).forEach(function (r) {
    var k = r.grado + '|' + r.seccion;
    if (!map[k]) map[k] = { et: adGradoSeccion(r.grado, r.seccion) || 'Sin grado', confirmados: 0, personas: 0 };
    map[k].confirmados++;
    map[k].personas += (+r.alumnos || 0) + (+r.adultos || 0);
  });
  return Object.keys(map).sort().map(function (k) { return map[k]; });
}
function excListaRespuestas(e) {
  var si = excSi(e), no = excNo(e);
  if (!si.length && !no.length) {
    return '<p class="pa-optional-hint" style="margin-top:14px">Todavía no has pegado ninguna ' +
      'respuesta. En cuanto llegue la primera, aquí verás los buses que hacen falta.</p>';
  }
  var h = '';
  if (si.length) {
    h += '<div class="pa-card-title" style="margin-top:18px">✅ Van (' + si.length + ')</div><div class="filas-exc">' +
      si.map(function (r, i) { return excFila(r, e.respuestas.indexOf(r), true); }).join('') + '</div>';
  }
  if (no.length) {
    h += '<div class="pa-card-title" style="margin-top:18px">🙁 No pueden ir (' + no.length + ')</div>' +
      '<p class="pa-optional-hint">Ya contestaron: no hay que volver a molestarlos.</p><div class="filas-exc">' +
      no.map(function (r) { return excFila(r, e.respuestas.indexOf(r), false); }).join('') + '</div>';
  }
  return h;
}
function excFila(r, i, va) {
  var tot = (+r.alumnos || 0) + (+r.adultos || 0);
  return '<div class="ad-gasto-row"><span>' +
    '<strong>' + adEsc(r.nombre) + '</strong> · ' + adEsc(adGradoSeccion(r.grado, r.seccion)) +
    (va ? '<br><small>' + tot + ' persona(s): ' + r.alumnos + ' alumno(s)' +
      (r.adultos ? ' y ' + r.adultos + ' acompañante(s)' : ', sin acompañante') + '</small>' : '') +
    '</span><span><button class="ad-al-del exc-del" data-i="' + i + '" aria-label="Quitar esta respuesta">✕</button></span></div>';
}

/* Quiénes de MI lista no han contestado. Es el mismo dato que manda en
   los Controles («quiénes faltan»): sin él, el maestro no sabe a quién
   llamar y acaba preguntando otra vez en el grupo, a todos. */
function excFaltanDeMiLista(e, d) {
  var mg = String(d.grado || '').replace(/\D/g, '');
  var ms = String(d.seccion || '').trim().toUpperCase();
  if (!mg || !ms || !(d.lista || []).length) return null;
  var faltan = (d.lista || []).filter(function (a) {
    if (!String(a.nombre || '').trim()) return false;
    return !(e.respuestas || []).some(function (r) {
      return String(r.grado) === mg && String(r.seccion) === ms && excMismoNombre(r.nombre, a.nombre);
    });
  });
  return { faltan: faltan, total: (d.lista || []).filter(function (a) { return String(a.nombre || '').trim(); }).length };
}
function excCardFaltan(p, e) {
  if (!p || !p.total) return '';
  if (!p.faltan.length) {
    return '<p class="pa-optional-hint" style="margin-top:14px">🎉 <strong>¡Todo tu grado contestó!</strong> ' +
      'Ya no falta nadie tuyo por responder.</p>';
  }
  return '<div class="pa-card-title" style="margin-top:18px">⏳ De tu grado, no han contestado (' +
      p.faltan.length + ' de ' + p.total + ')</div>' +
    '<p class="pa-optional-hint">Estos son los tuyos. Los de otros grados no aparecen aquí: ' +
      'de esos no tienes lista.</p>' +
    '<div class="filas-exc">' + p.faltan.map(function (a) {
      return '<div class="ad-gasto-row"><span>#' + a.num + ' · ' + adEsc(a.nombre) + '</span></div>';
    }).join('') + '</div>' +
    '<div class="ad-btn-row"><button class="pa-generate-btn ad-btn-sec" id="exc-recordar">' +
      '📲 Recordarles por WhatsApp</button></div>';
}

function excEnganchaRespuestas(e, d) {
  var ta = document.getElementById('exc-pegar');
  document.getElementById('exc-sumar').addEventListener('click', function () {
    var nuevas = excParsear(ta.value);
    if (!nuevas.length) {
      toast('🤔 Ahí no vino ninguna respuesta de la invitación');
      return;
    }
    var dd = adLoad(), ee = excGet(dd);
    var añadidas = 0, corregidas = 0;
    nuevas.forEach(function (r) {
      var i = ee.respuestas.findIndex(function (x) { return excMismaResp(x, r); });
      if (i >= 0) { ee.respuestas[i] = r; corregidas++; }
      else { ee.respuestas.push(r); añadidas++; }
    });
    adSave(dd);
    ta.value = '';
    renderAdmin();
    toast('✅ ' + añadidas + ' nueva(s)' + (corregidas ? ' · ' + corregidas + ' actualizada(s)' : ''));
  });

  document.getElementById('exc-mano').addEventListener('click', async function () {
    var nombre = await metasPrompt('¿Cómo se llama el alumno?\nLo que la mamá te dijo en el portón también cuenta: anótalo aquí para que entre en el conteo.', {
      icono: '✍️', titulo: 'Respuesta de palabra', okTxt: 'Siguiente',
      valida: function (v) { return String(v).trim().length >= 4 ? '' : 'Escribe el nombre y el apellido.'; },
    });
    if (nombre === null) return;
    var gs = await metasPrompt('¿De qué grado y sección es?\nEscríbelo así: **6-1** (sexto grado, sección 1).', {
      icono: '🏫', titulo: 'Respuesta de palabra', okTxt: 'Siguiente',
      value: (adGradoSeccion(d.grado, d.seccion) || '').replace(/[º°]/g, ''),
      valida: function (v) { return /\d\s*[-\s]\s*\w/.test(String(v)) ? '' : 'Escríbelo así: 6-1'; },
    });
    if (gs === null) return;
    var m = String(gs).match(/(\d+)\s*[-\s]\s*(\w+)/);
    var cuantos = await metasPrompt('¿Cuántas personas van en total?\nEl alumno y quien lo acompañe. Escribe **0** si esta familia NO va.', {
      icono: '👥', titulo: 'Respuesta de palabra', inputmode: 'numeric', okTxt: 'Anotar', value: '1',
      valida: function (v) { return /^\d+$/.test(String(v).trim()) ? '' : 'Escribe un número.'; },
    });
    if (cuantos === null) return;
    var n = Math.max(0, Math.min(18, +cuantos || 0));
    var r = {
      va: n > 0, alumnos: n > 0 ? 1 : 0, adultos: n > 0 ? n - 1 : 0,
      grado: m[1], seccion: m[2].toUpperCase(), nombre: String(nombre).trim().replace(/\s+/g, ' '),
    };
    var dd = adLoad(), ee = excGet(dd);
    var i = ee.respuestas.findIndex(function (x) { return excMismaResp(x, r); });
    if (i >= 0) ee.respuestas[i] = r; else ee.respuestas.push(r);
    adSave(dd); renderAdmin();
    toast(r.va ? '✅ Anotado: ' + n + ' persona(s)' : '🙁 Anotado: esta vez no va');
  });

  document.querySelectorAll('.exc-del').forEach(function (b) {
    b.addEventListener('click', async function () {
      var dd = adLoad(), ee = excGet(dd);
      var r = ee.respuestas[+b.dataset.i];
      if (!r) return;
      if (!await metasConfirm('¿Quitar la respuesta de **' + r.nombre + '**?\nDejará de contar para los buses.',
        { icono: '🚌', titulo: 'Salida', okTxt: 'Sí, quitar' })) return;
      if (typeof adUndoGuardar === 'function') adUndoGuardar('Quitar una respuesta de la salida');
      ee.respuestas.splice(+b.dataset.i, 1);
      adSave(dd); renderAdmin();
    });
  });

  var rec = document.getElementById('exc-recordar');
  if (rec) rec.addEventListener('click', function () {
    var p = excFaltanDeMiLista(excGet(d), d);
    var ee = excGet(d);
    var txt = '👋 Buenos días. Estas familias de ' + (adGradoSeccion(d.grado, d.seccion) || 'mi grado') +
      ' todavía no me han contestado por la salida ' + (ee.icono || '🚌') + ' *' + ee.titulo + '*:\n\n' +
      p.faltan.map(function (a) { return '• ' + a.nombre; }).join('\n') +
      '\n\nConteste aquí, es un minuto:\n' + excEnlace(ee) +
      (ee.limite ? '\n\n⏰ Se cierra el ' + excFechaLarga(ee.limite) + '.' : '');
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
  });

  var ac = document.getElementById('exc-a-control');
  if (ac) ac.addEventListener('click', function () { excACabControl(d); });
  var acol = document.getElementById('exc-a-colecta');
  if (acol) acol.addEventListener('click', function () { excAColecta(d); });
  var imp = document.getElementById('exc-imprimir');
  if (imp) imp.addEventListener('click', function () { excImprimir(excGet(d), d); });
}

/* ── Paso 1 (y correcciones) · cómo es la salida ── */
var EXC_FORM = [
  { k: 'titulo', et: '🎯 A dónde van', ph: 'Ej.: Museo Ferroviario de El Progreso', req: 1 },
  { k: 'fecha', et: '📅 Día de la salida', tipo: 'date', req: 1 },
  { k: 'limite', et: '⏰ Último día para contestar', tipo: 'date', req: 1,
    ay: 'El día que contratas el bus. La invitación cuenta los días que faltan.' },
  { k: 'wa', et: '📲 Tu WhatsApp', tipo: 'tel', ph: '9999-8888', req: 1,
    ay: 'A este número le llegan las respuestas. Si es de Honduras, con 8 dígitos basta.' },
  { k: 'hsal', et: '🕗 Hora de salida', ph: '7:00 a. m.' },
  { k: 'hreg', et: '🏠 Hora de regreso', ph: '4:00 p. m.' },
  { k: 'punto', et: '📍 De dónde salen', ph: 'Del portón de la escuela' },
  { k: 'precio', et: '💵 Aporte por persona (Lempiras)', tipo: 'num', ph: '0',
    ay: 'Vale igual para el alumno y para el acompañante. Déjalo en 0 si es gratis.' },
  { k: 'cap', et: '🚌 Campos que tiene cada bus', tipo: 'num', ph: String(EXC_CAP_DEF),
    ay: 'Con esto se calcula cuántos buses hay que contratar.' },
  { k: 'incluye', et: '✅ Qué incluye el aporte', ph: 'Transporte y entrada al museo' },
  { k: 'llevar', et: '🎒 Qué debe llevar', ph: 'Gorra, agua y su merienda' },
  { k: 'pago', et: '💰 Cuándo y dónde se paga', ph: 'Del lunes al viernes, en el aula, con el maestro' },
  { k: 'gancho', et: '💬 Por qué vale la pena', tipo: 'area',
    ph: 'Lo que vieron en el libro lo van a ver de cerca…',
    ay: 'Sale destacado en la invitación. Es lo que hace que el padre conteste.' },
];

function excCardConfig(e) {
  return '<div class="pa-card">' +
    '<details class="exc-det" id="exc-config"' + (e.titulo ? '' : ' open') + '>' +
      '<summary><strong>1️⃣ Cómo es la salida</strong> · tócalo para corregir</summary>' +
      '<div class="exc-form">' + excFormHtml(e) + '</div>' +
      '<div class="ad-btn-row"><button class="pa-generate-btn" id="exc-guardar">💾 Guardar los cambios</button></div>' +
      '<div class="ad-btn-row"><button class="pa-generate-btn ad-btn-sec ad-btn-peligro" id="exc-borrar">🗑 Empezar otra salida</button></div>' +
    '</details>' +
  '</div>';
}
function excFormHtml(e) {
  var h = '<label class="exc-et">🎨 Dibujito de la salida</label><div class="ad-meses exc-iconos">' +
    EXC_ICONOS.map(function (i) {
      return '<button type="button" class="ad-mes-btn exc-ic' + (i === e.icono ? ' exc-ic-on' : '') +
        '" data-ic="' + i + '">' + i + '</button>';
    }).join('') + '</div>';
  EXC_FORM.forEach(function (c) {
    var v = adEsc(e[c.k] == null ? '' : e[c.k]);
    h += '<label class="exc-et" for="exc-f-' + c.k + '">' + c.et + (c.req ? ' *' : '') + '</label>';
    h += c.tipo === 'area'
      ? '<textarea class="pa-paste-area exc-area" id="exc-f-' + c.k + '" rows="2" maxlength="240" placeholder="' + adEsc(c.ph || '') + '">' + v + '</textarea>'
      : '<input class="pa-inp-field" id="exc-f-' + c.k + '" type="' + (c.tipo === 'date' ? 'date' : c.tipo === 'tel' ? 'tel' : 'text') + '"' +
        (c.tipo === 'num' ? ' inputmode="numeric"' : '') +
        ' placeholder="' + adEsc(c.ph || '') + '" value="' + v + '">';
    if (c.ay) h += '<p class="exc-ay">' + c.ay + '</p>';
  });
  return h;
}
function excLeerForm(e) {
  var o = {};
  EXC_FORM.forEach(function (c) {
    var el = document.getElementById('exc-f-' + c.k);
    if (el) o[c.k] = String(el.value || '').trim();
  });
  o.icono = e.icono || '🚌';
  return o;
}
function excValida(o) {
  if (String(o.titulo || '').length < 4) return '🎯 Escribe a dónde van.';
  if (!o.fecha) return '📅 Falta el día de la salida.';
  if (!o.limite) return '⏰ Falta el último día para contestar.';
  if (excWaNum(o.wa).length < 10) return '📲 Ese WhatsApp está corto. En Honduras son 8 dígitos.';
  if (excFechaObj(o.limite) > excFechaObj(o.fecha)) return '⏰ El día de contestar no puede ser DESPUÉS de la salida.';
  return '';
}
function excEnganchaConfig(e, d) {
  document.querySelectorAll('.exc-ic').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.exc-ic').forEach(function (x) { x.classList.remove('exc-ic-on'); });
      b.classList.add('exc-ic-on');
      e.icono = b.dataset.ic;
    });
  });
  document.getElementById('exc-guardar').addEventListener('click', function () {
    var o = excLeerForm(e);
    var mal = excValida(o);
    if (mal) { toast(mal); return; }
    var dd = adLoad(), ee = excGet(dd);
    /* El número se guarda YA con su código de país, no al mandarlo. La
       página de la familia solo le quita los guiones, así que si el 504
       no viaja dentro del enlace, el botón del padre abre un chat con
       nadie y el maestro nunca se entera de que perdió esa respuesta. */
    o.wa = excWaNum(o.wa);
    Object.keys(o).forEach(function (k) { ee[k] = o[k]; });
    ee.escuela = dd.escuela || ee.escuela;
    ee.grupo = adGradoSeccion(dd.grado, dd.seccion) || ee.grupo;
    ee.maestro = ee.maestro || (typeof adDocenteNombre === 'function' ? adDocenteNombre() : '');
    adSave(dd); renderAdmin();
    toast('💾 Guardado: el enlace ya lleva los cambios');
  });
  document.getElementById('exc-borrar').addEventListener('click', async function () {
    var ee = excGet(d);
    var n = (ee.respuestas || []).length;
    if (!await metasConfirm('¿Empezar otra salida?\n\nSe borra **' + (ee.titulo || 'esta salida') +
      '** con sus **' + n + ' respuesta(s)**, y el enlace que ya mandaste dejará de contar aquí.\n\n' +
      'Si todavía no has pasado a los que van a un 🎟️ control o a una 💰 colecta, hazlo antes.',
      { icono: '🗑', titulo: 'Salida o excursión', okTxt: 'Sí, empezar otra' })) return;
    if (typeof adUndoGuardar === 'function') adUndoGuardar('Borrar la salida «' + (ee.titulo || '') + '»');
    var dd = adLoad();
    delete dd.excursion;
    adSave(dd); renderAdmin();
  });
}

/* ── La primera vez ── */
function excRenderNueva(body, d) {
  body.innerHTML =
    '<div class="pa-card">' +
      '<button class="nav-ruta-link" id="exc-volver">🗂️ Volver a Controles</button>' +
      '<div class="pa-card-title" style="margin-top:10px">🚌 Salida o excursión</div>' +
      '<p class="pa-optional-hint">Antes de contratar el bus tienes que saber <strong>cuántos van</strong>. ' +
        'Aquí armas una invitación, la mandas al grupo de WhatsApp de la escuela y las respuestas ' +
        'te vuelven al teléfono ya contadas: <strong>personas, buses y dinero</strong>.</p>' +
      '<div class="exc-pasos">' +
        '<div class="exc-paso"><b>1️⃣ Lo llenas una vez</b><small>A dónde van, qué día, cuánto es y hasta cuándo se puede contestar.</small></div>' +
        '<div class="exc-paso"><b>2️⃣ Mandas el enlace</b><small>Al grupo de toda la escuela. Se contesta sin clave y sin instalar nada.</small></div>' +
        '<div class="exc-paso"><b>3️⃣ Pegas lo que te llegue</b><small>Y la pantalla te dice cuántos buses contratar.</small></div>' +
      '</div>' +
      '<div class="ad-btn-row"><button class="pa-generate-btn" id="exc-crear">➕ Armar la invitación</button></div>' +
    '</div>';
  document.getElementById('exc-volver').addEventListener('click', function () {
    adSalirExcursion();
  });
  document.getElementById('exc-crear').addEventListener('click', function () {
    var dd = adLoad();
    dd.excursion = excDef(dd);
    adSave(dd); renderAdmin();
  });
}

/* ── Puentes con lo que ya existe ──
   El conteo es de paso; lo que hay que conservar vive en Controles y en
   Economía, que son los que el maestro imprime y rinde. */
async function excACabControl(d) {
  var e = excGet(d);
  var mg = String(d.grado || '').replace(/\D/g, '');
  var ms = String(d.seccion || '').trim().toUpperCase();
  var mios = excSi(e).filter(function (r) {
    return String(r.grado) === mg && String(r.seccion) === ms;
  });
  if (!mios.length) {
    toast('🤔 De TU grado todavía no hay confirmados');
    return;
  }
  var enc = [];
  mios.forEach(function (r) {
    var a = (d.lista || []).find(function (x) { return excMismoNombre(x.nombre, r.nombre); });
    if (a) enc.push(a.num);
  });
  if (!await metasConfirm('Se creará el control **🎟️ ' + (e.titulo || 'Salida') + '** con **' +
    enc.length + ' alumno(s)** de tu lista ya marcados como inscritos.' +
    (enc.length < mios.length ? '\n\n(' + (mios.length - enc.length) + ' contestaron con un nombre que no ' +
      'encontré en tu lista; a esos los marcas tú a mano.)' : '') +
    '\n\nLas familias lo verán en su Bitácora.',
    { icono: '🎟️', titulo: 'Pasar a un control', okTxt: 'Sí, crear' })) return;
  var dd = adLoad();
  var datos = {};
  enc.forEach(function (n) { datos[n] = 1; });
  dd.controles = dd.controles || [];
  dd.controles.push({
    id: 'K' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    icono: '🎟️', nombre: 'Inscritos: ' + (e.titulo || 'Salida'), tipo: 'marca',
    fecha: adHoy(), datos: datos, fam: 1, acum: 0, misionId: null, verbo: 'inscrito',
  });
  adSave(dd);
  adSalirExcursion();
  toast('🎟️ Control creado con ' + enc.length + ' inscrito(s)');
}

async function excAColecta(d) {
  var e = excGet(d);
  var precio = Number(e.precio) || 0;
  if (!await metasConfirm('Se abrirá la colecta **' + (e.titulo || 'Salida') + '** con un aporte de **' +
    excLps(precio) + ' por alumno**.\n\nAhí marcas quién ya pagó, apuntas los gastos del bus y la cuenta ' +
    'le queda clara a las familias.\n\n_Ojo: la colecta cobra por ALUMNO de tu lista. Al que lleve ' +
    'acompañantes le pones el monto completo al marcarlo._',
    { icono: '💰', titulo: 'Abrir la colecta', okTxt: 'Sí, abrir' })) return;
  var dd = adLoad();
  dd.colectas = dd.colectas || [];
  dd.colectas.push({
    id: 'C' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    concepto: (e.titulo || 'Salida educativa'),
    montoAlumno: precio, fecha: adHoy(), pagos: {}, pagosF: {}, gastos: [],
  });
  adSave(dd);
  adIrAColecta(dd.colectas[dd.colectas.length - 1].id);
  toast('💰 Colecta abierta: márcales el pago ahí');
}

/* La lista que se lleva al bus el día de la salida: nombres, de qué
   grado y cuántos vienen con cada uno, con casilla para ir tachando al
   subir. En papel, porque en la puerta del bus no hay señal ni manos
   libres para andar buscando en el teléfono. */
function excImprimir(e, d) {
  var si = excSi(e);
  var filas = si.slice().sort(function (a, b) {
    return (a.grado - b.grado) || String(a.seccion).localeCompare(String(b.seccion)) ||
      String(a.nombre).localeCompare(String(b.nombre), 'es');
  });
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
    '<title>Lista del bus — ' + adEsc(e.titulo || 'Salida') + '</title><style>' +
    '@page { size: letter; margin: 12mm; }' +
    'body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; }' +
    'h1 { font-size: 17px; margin: 0 0 2px; }' +
    '.sub { font-size: 12px; color: #444; margin-bottom: 10px; }' +
    'table { width: 100%; border-collapse: collapse; }' +
    'th, td { border: 1px solid #999; padding: 5px 6px; text-align: left; }' +
    'th { background: #eef2f9; font-size: 11px; }' +
    '.c { text-align: center; width: 34px; }' +
    '.tot { margin-top: 12px; font-size: 13px; font-weight: bold; }' +
    'tr { break-inside: avoid; }' +
    '</style></head><body>' +
    '<h1>' + (e.icono || '🚌') + ' ' + adEsc(e.titulo || 'Salida') + ' — lista del bus</h1>' +
    '<div class="sub">' + adEsc(excFechaLarga(e.fecha)) +
      (e.hsal ? ' · sale ' + adEsc(e.hsal) : '') +
      (e.punto ? ' · desde ' + adEsc(e.punto) : '') +
      (e.escuela ? '<br>' + adEsc(e.escuela) : '') +
      (e.maestro ? ' · Prof. ' + adEsc(e.maestro) : '') + '</div>' +
    '<table><thead><tr><th class="c">Subió</th><th>Alumno</th><th>Grado</th>' +
      '<th class="c">Alum.</th><th class="c">Adultos</th><th class="c">Total</th></tr></thead><tbody>' +
    filas.map(function (r) {
      return '<tr><td class="c">☐</td><td>' + adEsc(r.nombre) + '</td><td>' +
        adEsc(adGradoSeccion(r.grado, r.seccion)) + '</td><td class="c">' + r.alumnos +
        '</td><td class="c">' + r.adultos + '</td><td class="c"><strong>' +
        ((+r.alumnos || 0) + (+r.adultos || 0)) + '</strong></td></tr>';
    }).join('') +
    '</tbody></table>' +
    '<div class="tot">Total: ' + excPersonas(e) + ' personas · ' + excBuses(e) + ' bus(es) de ' +
      (e.cap || EXC_CAP_DEF) + ' campos' +
      (Number(e.precio) > 0 ? ' · debería recogerse ' + excLps(excDinero(e)) : '') + '</div>' +
    '<div class="sub" style="margin-top:14px">Conteo al ' + adFechaBonita(adHoy()) +
      '. Las familias que confirmen después no aparecen en esta hoja.</div>' +
    '</body></html>';
  adPrintAbrir(html);
}
