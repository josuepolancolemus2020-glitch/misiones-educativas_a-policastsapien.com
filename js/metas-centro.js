/* =====================================================================
   M.E.T.A.S — js/metas-centro.js · el perfil del centro, desde la base
   ---------------------------------------------------------------------
   La base (metas.centros) es la única fuente. Cada aula apunta a su
   centro: un docente con dos centros tiene dos filas, y el grado, la
   sección y las materias siguen en el aula. Al elegir un centro, Mi aula
   muestra solo los grupos de ese centro.

   El nombre del maestro vive en el centro (columna docente). Si esa
   columna todavía no está, el nombre no se manda a la base: queda en
   docente_nombre del grupo, que ya existía, y no se borra el que había.

   METAS_CENTRO_LECTURA es solo una copia de lectura para cuando la
   misión se imprime sin el motor de datos (sin señal, o en la página
   de la misión). No se sube y no se fusiona: la próxima vez que Mi aula
   lee la base, esta copia se vuelve a escribir con lo que dijo la base.
   Lleva el perfil por grupo (porAula) y, aparte, la lista de centros
   (centros), porque un centro recién creado todavía no tiene grupos y
   el examen de la misión igual tiene que poder usarlo.

   Un centro archivado (deleted_at, desde v570) no sale en ninguna de
   las dos: MetasDatos.lista() ya no lo trae, y la copia guarda aparte
   los ids archivados (archivados) para que la página de la misión, que
   no tiene el motor de datos, tampoco lo use.

   Todo esto se usa solo con la sesión del docente abierta en el
   aparato (METAS_DOCENTE_V1.codigo, la misma prueba de la portada y de
   js/solo-docente.js). Al cerrar sesión la copia no se borra, pero el
   examen vuelve a salir con la raya en blanco.

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
      docente: c.docente || '',
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
  // La lista que guarda la copia: un renglón por centro, sin repetidos,
  // en el orden en que Mi aula los muestra (el más antiguo primero). El
  // nombre del maestro, si el centro no lo trae, sale de un grupo de ese
  // centro que sí lo tenga, igual que en la pantalla del perfil.
  function listaCentros(api) {
    var filas = (api.lista('centros') || []).slice().sort(function (a, b) {
      var ac = a.created_at || '9999';
      var bc = b.created_at || '9999';
      return String(ac).localeCompare(String(bc)) || String(a.id).localeCompare(String(b.id));
    });
    var aulas = api.lista('aulas') || [];
    var vistos = {};
    var out = [];
    filas.forEach(function (c) {
      if (!c || !c.id || vistos[c.id] || c.deleted_at) return;
      vistos[c.id] = 1;
      var docente = c.docente || '';
      if (!docente) {
        for (var i = 0; i < aulas.length; i++) {
          if (aulas[i].centro_id === c.id && aulas[i].docente_nombre) { docente = String(aulas[i].docente_nombre); break; }
        }
      }
      out.push({
        id: c.id,
        nombre: c.nombre || '',
        logo: c.logo || '',
        direccion: c.direccion || '',
        municipio: c.municipio || '',
        departamento: c.departamento || '',
        docente: docente,
      });
    });
    return out;
  }
  // Los ids de los centros archivados. MetasDatos.archivados() existe
  // desde v570; con uno más viejo no hay archivados que contar.
  function idsArchivados(api) {
    if (!api || typeof api.archivados !== 'function') return null;
    try {
      return (api.archivados('centros') || []).map(function (c) { return c && c.id; }).filter(Boolean);
    } catch (e) { return null; }
  }
  function archivadoEnCopia(cache, id) {
    return !!(id && Array.isArray(cache.archivados) && cache.archivados.indexOf(id) >= 0);
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
      docente: tomar(c.docente, aula && aula.docente_nombre, bol.docente),
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
    var prev = leer();
    // Una lista vacía no borra la que había: puede ser que la base todavía
    // no haya contestado. Un centro no se borra (la base no deja).
    var lista = listaCentros(api);
    var arch = idsArchivados(api);
    var aulas = api.lista('aulas') || [];
    if (!aulas.length) {
      if (lista.length) prev.centros = lista;
      if (arch) prev.archivados = arch;
      if (lista.length || arch) escribir(prev);
      return;
    }
    var centros = api.lista('centros') || [];
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
    var nuevo = { actual: actual || prev.actual || null, porAula: por };
    if (lista.length) nuevo.centros = lista;
    else if (prev.centros) nuevo.centros = prev.centros;
    if (arch) nuevo.archivados = arch;
    else if (prev.archivados) nuevo.archivados = prev.archivados;
    escribir(nuevo);
  }

  // ¿Hay un docente con sesión en este aparato? La misma prueba que la
  // portada (mfLogueado) y js/solo-docente.js.
  function sesionDocente() {
    try {
      var d = JSON.parse(w.localStorage.getItem('METAS_DOCENTE_V1'));
      return d && d.codigo ? d : null;
    } catch (e) { return null; }
  }

  // Los centros del docente, para quien imprime fuera de Mi aula (el
  // examen de la misión). Con el motor de datos, los de la base; si no,
  // la lista de la copia. Una copia escrita antes de que existiera la
  // lista se arma con los perfiles de sus grupos, sin repetir centro.
  function centros() {
    var api = w.MetasDatos;
    if (api && typeof api.lista === 'function') {
      var deBase = listaCentros(api);
      if (deBase.length) return deBase;
    }
    var cache = leer();
    var copia = function (c) {
      return {
        id: c.id, nombre: c.nombre || '', logo: c.logo || '', direccion: c.direccion || '',
        municipio: c.municipio || '', departamento: c.departamento || '', docente: c.docente || '',
      };
    };
    var vale = function (c) { return c && c.id && !c.deleted_at && !archivadoEnCopia(cache, c.id); };
    if (Array.isArray(cache.centros)) return cache.centros.filter(vale).map(copia);
    var vistos = {};
    var out = [];
    perfiles().forEach(function (x) {
      var p = x.perfil;
      if (!vale(p) || vistos[p.id]) return;
      vistos[p.id] = 1;
      out.push(copia(p));
    });
    return out;
  }

  // El centro del grupo que está abierto en Mi aula, con los mismos
  // campos que centros(). Es el que sale en el examen impreso: el docente
  // ya lo eligió al cambiar de grupo y no se le vuelve a preguntar.
  // El grupo está en la copia (actual) y su perfil (porAula) trae el id
  // del centro. Si el motor de datos tiene ese centro, se usa el suyo,
  // que es más reciente. Un centro archivado no vale: null, y el examen
  // decide con la lista de siempre.
  function centroActual() {
    var cache = leer();
    var aulaId = cache.actual;
    if (!aulaId) return null;
    var p = cache.porAula && cache.porAula[aulaId];
    var id = p && p.id;
    var api = w.MetasDatos;
    var conApi = api && typeof api.lista === 'function';
    if (conApi) {
      var aulas = api.lista('aulas') || [];
      for (var i = 0; i < aulas.length; i++) {
        if (aulas[i] && aulas[i].id === aulaId) { id = aulas[i].centro_id || null; break; }
      }
    }
    if (!id || (p && p.id === id && p.deleted_at)) return null;
    var arch = conApi ? idsArchivados(api) : null;
    if (arch ? arch.indexOf(id) >= 0 : archivadoEnCopia(cache, id)) return null;
    if (conApi) {
      var deBase = listaCentros(api);
      for (var j = 0; j < deBase.length; j++) if (deBase[j].id === id) return deBase[j];
      // La base contestó con centros y este no está: se archivó.
      if (deBase.length) return null;
    }
    // Sin el motor de datos, la copia. La lista de centros también es de
    // la base: si existe y el centro ya no está en ella, se archivó.
    var enLista = null;
    if (Array.isArray(cache.centros) && cache.centros.length) {
      for (var k = 0; k < cache.centros.length; k++) {
        if (cache.centros[k] && cache.centros[k].id === id) enLista = cache.centros[k];
      }
      if (!enLista || enLista.deleted_at) return null;
    }
    // Manda el renglón de la lista, que es el mismo que da centros() (y
    // su docente ya trae el del grupo cuando el centro no lo tiene). El
    // perfil del grupo solo llena lo que una copia vieja no tenga.
    var perfil = (p && p.id === id) ? p : {};
    var de = enLista || perfil;
    if (!enLista && !perfil.id) return null;
    var campo = function (k) { return de[k] != null && de[k] !== '' ? de[k] : (perfil[k] || ''); };
    return {
      id: id,
      nombre: campo('nombre'),
      logo: campo('logo'),
      direccion: campo('direccion'),
      municipio: campo('municipio'),
      departamento: campo('departamento'),
      docente: campo('docente'),
    };
  }

  // El mismo objeto que ya leían las hojas: escuela, logos y boleta.
  // El grado y la sección del aula no se tocan. El nombre del maestro
  // entra solo si el perfil lo trae: vacío no borra el que ya estaba.
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
    b.docente = perfil.docente || antes.docente || '';
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
    // Solo si la base ya devolvió la columna: si no está, mandarla
    // frenaría el guardado del resto del perfil.
    if (campos._docenteEnBase) fila.docente = vacio(campos.docente);
    return fila;
  }

  function docenteEnBase(api) {
    var filas = (api && api.lista('centros')) || [];
    return filas.some(function (c) { return Object.prototype.hasOwnProperty.call(c, 'docente'); });
  }

  // Vacío y null valen lo mismo: la base guarda null donde no hay nada.
  function igual(a, b) {
    return JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);
  }
  // Las letras del nombre, sin contar espacios, cifras ni signos.
  function letras(t) {
    return String(t || '').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '').length;
  }
  function paraElDocente(texto, extra) {
    var e = new Error(texto);
    e.paraElDocente = true;
    if (extra) for (var k in extra) e[k] = extra[k];
    return e;
  }

  // ¿Ya tiene el docente otro centro con este nombre en ese año? Se compara
  // como la base (norm_nombre: sin acentos, sin mayúsculas, sin espacios de
  // más), que es la regla centros_unico. Devuelve {id, nombre} o null.
  function mismoNombre(api, nombre, anio, exceptoId) {
    var n = norm(nombre);
    if (!n || !api || typeof api.lista !== 'function') return null;
    var a = /^\d{4}$/.test(String(anio == null ? '' : anio).trim()) ? Number(anio) : null;
    var c = (api.lista('centros') || []).filter(function (x) {
      return x && x.id !== exceptoId && norm(x.nombre) === n && (a === null || Number(x.anio_lectivo) === a);
    })[0];
    return c ? { id: c.id, nombre: c.nombre } : null;
  }

  // Guarda el perfil UNA vez (Mi aula llama al tocar «Guardar perfil», al
  // salir del campo o tras 1,5 s sin escribir). Hasta v568 se llamaba con
  // cada letra: un centro nacía con la primera («J», «M») y el nombre
  // completo chocaba con otro igual. Ahora:
  //   · un centro NUEVO solo se crea con opciones.confirmado, con al menos
  //     tres letras y si no hay otro igual (error con yaExiste);
  //   · a uno que ya existe se le manda solo lo que cambió, y el nombre no
  //     va si es de otro centro o si tiene menos de tres letras;
  //   · el nombre de los grupos (aulas.escuela) solo se toca cuando el
  //     nombre del centro de verdad cambió en este guardado.
  function guardar(api, aula, campos, idConocido, opciones) {
    opciones = opciones || {};
    campos._docenteEnBase = docenteEnBase(api);
    var fila = filaDe(campos);
    // Un perfil nuevo no se lleva el grupo que estaba abierto.
    if (!idConocido) aula = null;
    var id = idConocido || null;
    var otro = mismoNombre(api, fila.nombre, fila.anio_lectivo, id);
    var cortoNombre = letras(fila.nombre) < 3;
    var visto = null;
    var cambio = {};
    if (!id) {
      if (otro) throw paraElDocente('Ya tienes ' + otro.nombre + '. ¿Abrirlo?', { yaExiste: otro });
      if (!opciones.confirmado) {
        var espera = new Error('confirmar');
        espera.espera = true;
        throw espera;
      }
      if (cortoNombre) throw paraElDocente('Escribe al menos 3 letras del nombre del centro.');
      id = api.crear('centros', fila).id;
      Object.keys(fila).forEach(function (k) { cambio[k] = 1; });
    } else {
      visto = (api.lista('centros') || []).filter(function (c) { return c.id === id; })[0] || {};
      var cambios = {};
      Object.keys(fila).forEach(function (k) { if (!igual(visto[k], fila[k])) cambios[k] = fila[k]; });
      if ('nombre' in cambios && (otro || cortoNombre)) {
        delete cambios.nombre;
        if (opciones.confirmado && cortoNombre && !otro) {
          // Lo demás sí se guarda; solo el nombre espera.
          if (Object.keys(cambios).length) api.editar('centros', id, cambios);
          throw paraElDocente('Escribe al menos 3 letras del nombre del centro.');
        }
      }
      if (Object.keys(cambios).length) api.editar('centros', id, cambios);
      Object.keys(cambios).forEach(function (k) { cambio[k] = 1; });
    }
    // El nombre que de verdad tiene el centro: el nuevo si se mandó, si no
    // el que ya tenía (un nombre repetido no se le pasa a los grupos).
    var nombreCentro = cambio.nombre ? fila.nombre : ((visto && visto.nombre) || fila.nombre);
    var aulaId = aula && aula.id;
    // No se mueve un grupo que ya pertenece a otro centro.
    if (aula && aula.centro_id && aula.centro_id !== id) aula = null;
    if (aula && aula.centro_id !== id) api.editar('aulas', aula.id, { centro_id: id });
    if (aula && (cambio.nombre || aula.centro_id !== id) && aula.escuela !== nombreCentro) {
      api.editar('aulas', aula.id, { escuela: nombreCentro });
    }
    if (cambio.nombre) {
      (api.lista('aulas') || []).forEach(function (a) {
        if (a.id !== aulaId && a.centro_id === id && a.escuela !== nombreCentro) {
          api.editar('aulas', a.id, { escuela: nombreCentro });
        }
      });
    }
    // El nombre del maestro también queda en el grupo, donde ya se leía.
    // Vacío no borra el que el grupo tenía.
    if (fila.docente) {
      (api.lista('aulas') || []).forEach(function (a) {
        if (a.centro_id === id && a.docente_nombre !== fila.docente) {
          api.editar('aulas', a.id, { docente_nombre: fila.docente });
        }
      });
    } else if (campos.docente && String(campos.docente).trim() && !campos._docenteEnBase) {
      var nombre = String(campos.docente).trim();
      (api.lista('aulas') || []).forEach(function (a) {
        if (a.centro_id === id && a.docente_nombre !== nombre) {
          api.editar('aulas', a.id, { docente_nombre: nombre });
        }
      });
    }
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
  // Sin sesión no se llena nada. Una hoja que el motor de las misiones ya
  // armó (data-metas-encabezado) no se toca: ahí el docente eligió.
  function examen(html) {
    if (typeof html !== 'string' || html.indexOf('class="ph"') < 0) return html;
    if (html.indexOf('data-metas-encabezado') >= 0) return html;
    if (!sesionDocente()) return html;
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

  // Cuántas aulas tienen este grado y esta sección. Null si no hay
  // lista de aulas: el impreso viejo sigue con la regla de un solo grupo.
  function aulasDe(grado, sec) {
    var api = w.MetasDatos;
    if (!api || typeof api.lista !== 'function') return null;
    var aulas = api.lista('aulas') || [];
    if (!aulas.length) return null;
    return aulas.filter(function (a) {
      return String(a.grado == null ? '' : a.grado).replace(/\D/g, '') === grado
        && String(a.seccion || '').trim().toUpperCase() === sec;
    });
  }

  // El perfil de ESTE grupo. Manda el aula (su id es el de la fila, y esa
  // fila apunta a su centro). Si hay dos grupos con el mismo grado y la
  // misma sección, no se le presta el centro del otro: cada uno usa el
  // centro_id que el docente eligió. Sin poder saber cuál es, no se
  // devuelve ninguno y el impreso se queda como estaba.
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
    var mismas = aulasDe(grado, sec);
    if (mismas && mismas.length > 1) return null;
    // Un solo 6º-1 con perfil: es este grupo, aunque el nombre que quedó
    // escrito en el aparato todavía no sea el oficial.
    if (porGrupo.length === 1) return porGrupo[0];
    if (porNombre.length === 1) return porNombre[0];
    return null;
  }

  // Logo y nombre para un papel que no es un grupo (el análisis, la
  // papeleta, el parte, el collage). Es el centro del aula que está
  // abierta. Si esa aula no tiene perfil, no se toma el de otra. Si no
  // hay aula abierta y solo existe un centro, es ese.
  function marca() {
    var cache = leer();
    var p = cache.actual ? get(cache.actual) : null;
    if (!p && !cache.actual) {
      var vistos = {};
      var unicos = [];
      perfiles().forEach(function (x) {
        var id = x.perfil && x.perfil.id;
        if (!id || vistos[id]) return;
        vistos[id] = 1;
        unicos.push(x.perfil);
      });
      if (unicos.length === 1) p = unicos[0];
    }
    if (!p) return null;
    var nombre = String(p.nombre || '').trim();
    var logo = p.logo ? String(p.logo) : '';
    if (!nombre && !logo) return null;
    return { nombre: nombre, logo: logo };
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
    if (perfil.docente) b.docente = perfil.docente;
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
    marca: marca,
    guardar: guardar,
    mismoNombre: mismoNombre,
    jpeg: jpeg,
    examen: examen,
    centros: centros,
    centroActual: centroActual,
    sesionDocente: sesionDocente,
  };
})(window);
