/* =====================================================================
   M.E.T.A.S — js/metas-centro.js · el perfil del centro, desde la base
   ---------------------------------------------------------------------
   La base (metas.centros) es la única fuente. Cada aula apunta a su
   centro: un docente con dos centros tiene dos filas, y el grado y la
   sección siguen en el aula.

   METAS_CENTRO_LECTURA es solo una copia de lectura para cuando la
   misión se imprime sin el motor de datos (sin señal, o en la página
   de la misión). No se sube y no se fusiona: la próxima vez que Mi aula
   lee la base, esta copia se vuelve a escribir con lo que dijo la base.

   El logo es el mismo JPEG a color de hoy (adSubirLogo: lado mayor
   260 px, calidad 0.72). No se pasa a blanco y negro.
   ===================================================================== */
(function (w) {
  'use strict';

  var LLAVE = 'METAS_CENTRO_LECTURA';

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(t) {
    return String(t || '').trim().toLowerCase()
      .replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ñ/g, 'n').replace(/\s+/g, ' ');
  }
  function vacio(t) {
    t = String(t == null ? '' : t).trim();
    return t ? t : null;
  }
  function leer() {
    try { return JSON.parse(w.localStorage.getItem(LLAVE)) || {}; } catch (e) { return {}; }
  }
  function escribir(o) {
    try { w.localStorage.setItem(LLAVE, JSON.stringify(o)); } catch (e) { /* la base sigue siendo la fuente */ }
  }
  function gradoTxt(grado, seccion) {
    if (typeof w.adGradoSeccion === 'function') return w.adGradoSeccion(grado, seccion);
    var g = String(grado == null ? '' : grado).replace(/\D/g, '');
    var s = String(seccion || '').trim();
    if (g && s) return g + 'º-' + s;
    return g ? g + 'º' : s;
  }
  function armar(aula, c) {
    return {
      id: c.id,
      nombre: c.nombre || '',
      direccion: c.direccion || '',
      aldea: c.aldea || '',
      municipio: c.municipio || '',
      departamento: c.departamento || '',
      codigoSace: c.codigo_sace || '',
      director: c.director || '',
      anio: c.anio_lectivo == null ? '' : String(c.anio_lectivo),
      modalidad: c.modalidad || '',
      jornada: c.jornada || '',
      logo: c.logo || '',
      logoSec: c.logo_sec || '',
      grado: aula.grado == null ? '' : String(aula.grado),
      seccion: aula.seccion || '',
      gradoSeccion: gradoTxt(aula.grado, aula.seccion),
    };
  }
  function deCache(aulaId) {
    var c = leer();
    var id = aulaId || c.actual;
    if (!id || !c.porAula || !c.porAula[id]) return null;
    return c.porAula[id];
  }

  // El grupo viejo del aparato, solo si es ESTE centro (mismo nombre, y si
  // se puede, el mismo grado y la misma sección). No se agarra otro colegio.
  function grupoViejo(aula) {
    var st;
    try { st = JSON.parse(w.localStorage.getItem('METAS_ADMIN_V1') || 'null'); } catch (e) { return null; }
    if (!st || !st.grupos || !st.grupos.length || !aula) return null;
    var grado = String(aula.grado == null ? '' : aula.grado).replace(/\D/g, '');
    var sec = String(aula.seccion || '').trim().toUpperCase();
    var escuela = norm(aula.escuela);
    var i, g, gg, ss, porNombre = null;
    for (i = 0; i < st.grupos.length; i++) {
      g = st.grupos[i];
      gg = String(g.grado || '').replace(/\D/g, '');
      ss = String(g.seccion || '').trim().toUpperCase();
      if (escuela && norm(g.escuela) === escuela && gg === grado && ss === sec) return g;
      if (escuela && norm(g.escuela) === escuela && !porNombre) porNombre = g;
    }
    return porNombre;
  }

  function tomar(deBase, deAula, deViejo) {
    if (deBase != null && String(deBase).trim() !== '') return { valor: String(deBase), origen: 'base' };
    if (deAula != null && String(deAula).trim() !== '') return { valor: String(deAula), origen: 'aula' };
    if (deViejo != null && String(deViejo).trim() !== '') return { valor: String(deViejo), origen: 'aparato' };
    return { valor: '', origen: '' };
  }

  // Lo que se muestra en el formulario. Lo de la base gana. Lo del aparato
  // solo llena un hueco, y no se escribe hasta que el docente cambie algo.
  function valoresIniciales(aula, centro) {
    var viejo = grupoViejo(aula);
    var bol = (viejo && viejo.boleta) || {};
    var c = centro || {};
    var campos = {
      nombre: tomar(c.nombre, aula && aula.escuela, viejo && viejo.escuela),
      direccion: tomar(c.direccion, aula && aula.lugar, bol.lugar),
      aldea: tomar(c.aldea, aula && aula.aldea, bol.aldea),
      municipio: tomar(c.municipio, aula && aula.municipio, bol.municipio),
      departamento: tomar(c.departamento, aula && aula.departamento, bol.departamento),
      codigo_sace: tomar(c.codigo_sace, aula && aula.codigo_centro, bol.codigoCentro),
      director: tomar(c.director, aula && aula.director, bol.director),
      anio_lectivo: tomar(c.anio_lectivo, aula && aula.anio_lectivo, bol.anio),
      modalidad: tomar(c.modalidad, aula && aula.modalidad, bol.modalidad),
      jornada: tomar(c.jornada, aula && aula.jornada, bol.jornada),
      logo: tomar(c.logo, '', viejo && viejo.logo),
      logo_sec: tomar(c.logo_sec, '', viejo && viejo.logoSec),
    };
    var ofrecido = false;
    Object.keys(campos).forEach(function (k) { if (campos[k].origen === 'aparato') ofrecido = true; });
    return { campos: campos, ofrecido: ofrecido };
  }

  function get(aulaId) {
    var api = w.MetasDatos;
    if (api && typeof api.lista === 'function') {
      var aulas = api.lista('aulas') || [];
      if (aulas.length) {
        var aula = null;
        for (var i = 0; i < aulas.length; i++) if (aulas[i].id === aulaId) aula = aulas[i];
        if (!aula || !aula.centro_id) return null;
        var centros = api.lista('centros') || [];
        var c = null;
        for (var j = 0; j < centros.length; j++) if (centros[j].id === aula.centro_id) c = centros[j];
        if (!c) return deCache(aulaId);
        var p = armar(aula, c);
        var cache = leer();
        cache.porAula = cache.porAula || {};
        cache.porAula[aulaId] = p;
        cache.actual = aulaId;
        escribir(cache);
        return p;
      }
    }
    return deCache(aulaId);
  }

  function refrescar(api, actual) {
    if (!api || typeof api.lista !== 'function') return;
    var aulas = api.lista('aulas') || [];
    if (!aulas.length) return;
    var centros = api.lista('centros') || [];
    var prev = leer();
    var por = {};
    aulas.forEach(function (a) {
      var c = null;
      if (a.centro_id) {
        for (var i = 0; i < centros.length; i++) if (centros[i].id === a.centro_id) c = centros[i];
      }
      if (c) por[a.id] = armar(a, c);
      else if (a.centro_id && prev.porAula && prev.porAula[a.id]) por[a.id] = prev.porAula[a.id];
      else por[a.id] = null;
    });
    escribir({ actual: actual || prev.actual || null, porAula: por });
  }

  // El mismo objeto que ya leían las hojas: escuela, logos y boleta.
  // El grado, la sección y el docente del aula no se tocan.
  function aplicar(grupo, perfil) {
    if (!perfil || !grupo) return grupo;
    var b = {};
    var antes = grupo.boleta || {};
    var k;
    for (k in antes) b[k] = antes[k];
    b.director = perfil.director || '';
    b.lugar = perfil.direccion || '';
    b.municipio = perfil.municipio || '';
    b.departamento = perfil.departamento || '';
    b.anio = perfil.anio || antes.anio || '';
    b.codigoCentro = perfil.codigoSace || '';
    b.modalidad = perfil.modalidad || '';
    b.jornada = perfil.jornada || '';
    b.aldea = perfil.aldea || '';
    var g = {};
    for (k in grupo) g[k] = grupo[k];
    g.escuela = perfil.nombre || grupo.escuela || '';
    g.logo = perfil.logo || '';
    g.logoSec = perfil.logoSec || '';
    g.boleta = b;
    return g;
  }

  function filaDe(campos) {
    var anioTxt = String(campos.anio_lectivo || '').trim();
    if (!String(campos.nombre || '').trim()) {
      var e = new Error('Escribe el nombre del centro.');
      e.paraElDocente = true;
      throw e;
    }
    // Mientras el año no está completo no se escribe: el docente va cifra por cifra.
    if (!/^\d{4}$/.test(anioTxt)) {
      var espera = new Error('año');
      espera.espera = true;
      throw espera;
    }
    var anio = parseInt(anioTxt, 10);
    if (anio < 2020 || anio > 2100) {
      var e2 = new Error('Escribe el año lectivo, por ejemplo 2026.');
      e2.paraElDocente = true;
      throw e2;
    }
    var fila = {
      nombre: String(campos.nombre).trim(),
      direccion: vacio(campos.direccion),
      aldea: vacio(campos.aldea),
      municipio: vacio(campos.municipio),
      departamento: vacio(campos.departamento),
      codigo_sace: vacio(campos.codigo_sace),
      director: vacio(campos.director),
      anio_lectivo: anio,
      modalidad: vacio(campos.modalidad),
      jornada: vacio(campos.jornada),
    };
    if ('logo' in campos) fila.logo = campos.logo || null;
    if ('logo_sec' in campos) fila.logo_sec = campos.logo_sec || null;
    return fila;
  }

  function guardar(api, aula, campos, idConocido) {
    var fila = filaDe(campos);
    var id = idConocido || (aula && aula.centro_id) || null;
    if (!id) {
      var mismo = (api.lista('centros') || []).filter(function (c) {
        return norm(c.nombre) === norm(fila.nombre) && Number(c.anio_lectivo) === fila.anio_lectivo;
      })[0];
      if (mismo) id = mismo.id;
    }
    if (id) api.editar('centros', id, fila);
    else id = api.crear('centros', fila).id;
    if (aula && aula.centro_id !== id) api.editar('aulas', aula.id, { centro_id: id });
    if (aula && aula.escuela !== fila.nombre) api.editar('aulas', aula.id, { escuela: fila.nombre });
    (api.lista('aulas') || []).forEach(function (a) {
      if (a.id !== aula.id && a.centro_id === id && a.escuela !== fila.nombre) {
        api.editar('aulas', a.id, { escuela: fila.nombre });
      }
    });
    refrescar(api, aula && aula.id);
    return id;
  }

  // Igual que adSubirLogo: JPEG a color, lado mayor de 260 px. Sin filtro.
  function jpeg(file) {
    return new Promise(function (ok, mal) {
      var rd = new FileReader();
      rd.onerror = function () { mal(); };
      rd.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var max = 260;
          var ancho = img.width;
          var alto = img.height;
          if (ancho > alto && ancho > max) { alto = Math.round(alto * max / ancho); ancho = max; }
          else if (alto > max) { ancho = Math.round(ancho * max / alto); alto = max; }
          var cv = w.document.createElement('canvas');
          cv.width = ancho;
          cv.height = alto;
          cv.getContext('2d').drawImage(img, 0, 0, ancho, alto);
          try { ok(cv.toDataURL('image/jpeg', 0.72)); }
          catch (err) { ok(e.target.result); }
        };
        img.onerror = function () { mal(); };
        img.src = e.target.result;
      };
      rd.readAsDataURL(file);
    });
  }

  function llenar(html, etiqueta, clase, texto) {
    if (!texto) return html;
    var re = new RegExp('(<strong>' + etiqueta + ':<\\/strong><span class="' + clase + '">)(?:&nbsp;|\\s*)(<\\/span>)', 'g');
    return html.replace(re, '$1' + texto + '$2');
  }

  // Llena Centro Educativo (o Instituto) y Grado/Sección, y pone el logo
  // arriba a la izquierda de .ph. Nombre, parcial, fecha y N.º no se tocan.
  // Sin perfil, el HTML sale igual, rayas incluidas.
  function examen(html) {
    if (typeof html !== 'string' || html.indexOf('class="ph"') < 0) return html;
    var p = deCache(null);
    if (!p || (!String(p.nombre || '').trim() && !p.logo)) return html;
    var centro = String(p.nombre || '').trim() ? esc(p.nombre) : '';
    var grado = String(p.gradoSeccion || '').trim() ? esc(p.gradoSeccion) : '';
    var out = html;
    if (centro) {
      out = llenar(out, 'Centro Educativo', 'ph-fill', centro);
      out = llenar(out, 'Instituto', 'ph-fill', centro);
    }
    if (grado) {
      out = llenar(out, 'Grado y Sección', 'ph-s', grado);
      out = llenar(out, 'Grado', 'ph-s', grado);
    }
    if (p.logo && out.indexOf('data-metas-logo') < 0) {
      var src = String(p.logo).replace(/["'<>]/g, '');
      var img = '<img data-metas-logo alt="" src="' + src + '" style="float:left;width:46px;height:46px;object-fit:contain;margin:0 8px 2px 0">';
      out = out.replace('<div class="ph">', '<div class="ph">' + img);
    }
    return out;
  }

  // Los perfiles que ya se pueden usar: los de la base si hay aulas, y si no
  // la copia de lectura. Cada uno lleva el id del aula para reconocerlo.
  function perfiles() {
    var out = [];
    var api = w.MetasDatos;
    var cache = leer();
    var por = cache.porAula || {};
    if (api && typeof api.lista === 'function') {
      var aulas = api.lista('aulas') || [];
      if (aulas.length) {
        var centros = api.lista('centros') || [];
        aulas.forEach(function (a) {
          if (!a.centro_id) return;
          var c = null;
          for (var i = 0; i < centros.length; i++) if (centros[i].id === a.centro_id) c = centros[i];
          if (c) out.push({ aulaId: a.id, perfil: armar(a, c) });
          else if (por[a.id]) out.push({ aulaId: a.id, perfil: por[a.id] });
        });
        return out;
      }
    }
    Object.keys(por).forEach(function (id) {
      if (por[id] && String(por[id].nombre || '').trim()) out.push({ aulaId: id, perfil: por[id] });
    });
    return out;
  }

  // El perfil de ESTE grupo: el mismo aula, o el mismo centro con el mismo
  // grado y la misma sección. Si no se puede saber cuál es, no se devuelve
  // ninguno: el impreso se queda como estaba.
  function perfilDe(grupo) {
    if (!grupo) return null;
    var lista = perfiles();
    if (!lista.length) return null;
    var i;
    for (i = 0; i < lista.length; i++) if (grupo.id && lista[i].aulaId === grupo.id) return lista[i].perfil;
    var grado = String(grupo.grado == null ? '' : grupo.grado).replace(/\D/g, '');
    var sec = String(grupo.seccion || '').trim().toUpperCase();
    var esc = norm(grupo.escuela);
    var porNombre = [];
    var porGrupo = [];
    for (i = 0; i < lista.length; i++) {
      var p = lista[i].perfil;
      var pg = String(p.grado || '').replace(/\D/g, '');
      var ps = String(p.seccion || '').trim().toUpperCase();
      var pe = norm(p.nombre);
      if (esc && pe === esc && pg === grado && ps === sec) return p;
      if (esc && pe === esc) porNombre.push(p);
      if (grado && pg === grado && ps === sec) porGrupo.push(p);
    }
    // Un solo 6º-1 con perfil: es este grupo, aunque el nombre que quedó
    // escrito en el aparato todavía no sea el oficial.
    if (porGrupo.length === 1) return porGrupo[0];
    if (porNombre.length === 1) return porNombre[0];
    return null;
  }

  // Copia para imprimir. Sin perfil, es el mismo objeto: el HTML no cambia.
  // Con perfil, solo se escribe lo que el perfil sí trae. Un hueco del
  // perfil no borra lo que el documento ya tenía escrito a mano.
  function paraImpreso(grupo) {
    var perfil = perfilDe(grupo);
    if (!perfil || !grupo) return grupo;
    var g = {};
    var k;
    for (k in grupo) g[k] = grupo[k];
    if (String(perfil.nombre || '').trim()) g.escuela = perfil.nombre;
    if (perfil.logo) g.logo = perfil.logo;
    if (perfil.logoSec) g.logoSec = perfil.logoSec;
    var antes = grupo.boleta || {};
    var b = {};
    for (k in antes) b[k] = antes[k];
    if (perfil.director) b.director = perfil.director;
    if (perfil.direccion) b.lugar = perfil.direccion;
    if (perfil.municipio) b.municipio = perfil.municipio;
    if (perfil.departamento) b.departamento = perfil.departamento;
    if (perfil.anio) b.anio = perfil.anio;
    if (perfil.codigoSace) b.codigoCentro = perfil.codigoSace;
    if (perfil.modalidad) b.modalidad = perfil.modalidad;
    if (perfil.jornada) b.jornada = perfil.jornada;
    if (perfil.aldea) b.aldea = perfil.aldea;
    g.boleta = b;
    return g;
  }

  // El nombre del centro para un impreso que no es un grupo (una
  // convocatoria, un acta de tesis). Sin perfil, devuelve el texto de hoy.
  function textoCentro(grupo, texto) {
    var p = perfilDe(grupo);
    if (!p && texto) {
      var n = norm(texto);
      var hits = perfiles().filter(function (x) { return norm(x.perfil.nombre) === n; });
      if (hits.length === 1) p = hits[0].perfil;
    }
    if (p && String(p.nombre || '').trim()) return String(p.nombre).trim();
    return texto == null ? '' : String(texto);
  }

  function enganchar() {
    if (!w.open || w.open.__metasCentro) return;
    var abierto = w.open;
    function abrir() {
      var win = abierto.apply(w, arguments);
      if (!win || !win.document || win.__metasCentro) return win;
      win.__metasCentro = 1;
      var write = win.document.write.bind(win.document);
      win.document.write = function (html) {
        if (typeof html === 'string' && html.indexOf('class="ph"') >= 0) html = examen(html);
        return write(html);
      };
      return win;
    }
    abrir.__metasCentro = 1;
    w.open = abrir;
  }
  enganchar();
  if (w.document && w.document.addEventListener && w.document.readyState === 'loading') {
    w.document.addEventListener('DOMContentLoaded', enganchar);
  }

  w.MetasCentro = {
    get: get,
    refrescar: refrescar,
    encabezado: function (aulaId) { return get(aulaId); },
    logo: function (aulaId) { var p = get(aulaId); return p && p.logo ? p.logo : ''; },
    aplicar: aplicar,
    valoresIniciales: valoresIniciales,
    paraImpreso: paraImpreso,
    textoCentro: textoCentro,
    guardar: guardar,
    jpeg: jpeg,
    examen: examen,
  };
})(window);
