/* ══════════════════════════════════════════════════════════════
   📋 RESUMEN FINAL DE RESULTADOS POR GRADO: los cinco cuadros
   ──────────────────────────────────────────────────────────────
   El formulario que la Dirección pide al cerrar el año, contado solo:
     1. Resumen de exámenes ordinarios (centros) en N/V/T, con la escala
        del PROMEDIO GENERAL de cada evaluado.
     2. Resumen de Educación Básica: por asignatura, A / NA / T.
     3. Número de alumnos por materia y escala: I / B / A / E.
     4. Matrícula final por edades y género (6, 6½, 7…14, más de 14).
     5. Resumen final (centros): movimiento, evaluados, aprobados y
        reprobados en N/V/T.

   Por qué está aparte de registros-admin.js: es SOLO lectura. Recibe el
   grupo y devuelve números, tablas y un .xlsx; no toca la pantalla, no
   guarda nada y no escribe ninguna nota. Así la sonda lo carga en Node
   con un grupo ficticio y comprueba cada cuenta sin abrir el navegador.

   De dónde sale cada cosa (para no inventar ninguna):
   · Quién cuenta: la marca «En lista oficial SACE» (a.sace === true) y
     el estado de la ficha (js/tools/sace-lista.js). Las fichas fuera
     del SACE y los registros de prueba no entran en ningún cuadro.
   · N / V: el sexo de la ficha, que trae el SACE al importar.
   · Nota final de una asignatura: promedio de los CUATRO parciales de
     Notas SACE, redondeado con Math.round, la misma regla de la fila
     PROM. de la boleta. Si falta un parcial no hay nota final: el
     alumno va a «Sin nota completa» y se dice quién es y qué le falta.
   · Promedio general: promedio redondeado de sus notas finales, igual
     que el «Promedio del año» de la boleta.
   ══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';

  var PARCIALES = ['I', 'II', 'III', 'IV'];

  /* El orden es el del formulario. Los alias son nombres EXACTOS (sin
     tildes ni mayúsculas) con que el maestro pudo llamar la columna en
     Notas SACE; no se busca por parecido para no cruzar materias. */
  var ASIGNATURAS = [
    { k: 'artistica',  et: 'Educación Artística',          corto: 'EDUCACIÓN ARTÍSTICA',
      alias: ['educacion artistica', 'artistica', 'arte', 'artes', 'educacion artistica y cultural'] },
    { k: 'espanol',    et: 'Español',                      corto: 'ESPAÑOL',
      alias: ['espanol', 'lengua', 'lenguaje', 'lengua y literatura'] },
    { k: 'ingles',     et: 'Inglés',                       corto: 'INGLÉS',
      alias: ['ingles', 'lengua extranjera', 'lengua extranjera ingles'] },
    { k: 'matematicas', et: 'Matemáticas',                 corto: 'MATEMÁTICAS',
      alias: ['matematicas', 'matematica'] },
    { k: 'naturales',  et: 'Ciencias Naturales',           corto: 'CIENCIAS NATURALES',
      alias: ['ciencias naturales', 'naturales', 'ciencias de la naturaleza'] },
    { k: 'civica',     et: 'Educación Cívica',             corto: 'EDUCACIÓN CÍVICA',
      alias: ['educacion civica', 'civica', 'educacion civica y etica', 'civica y etica', 'formacion ciudadana'] },
    { k: 'sociales',   et: 'Ciencias Sociales',            corto: 'CIENCIAS SOCIALES',
      alias: ['ciencias sociales', 'sociales', 'estudios sociales'] },
    { k: 'fisica',     et: 'Educación Física y Deportes',  corto: 'EDUCACIÓN FÍSICA Y DEPORTES',
      alias: ['educacion fisica y deportes', 'educacion fisica', 'fisica', 'deportes'] },
    { k: 'tecnologia', et: 'Tecnología',                   corto: 'TECNOLOGÍA',
      alias: ['tecnologia', 'informatica', 'computacion', 'educacion tecnologica'] }
  ];

  /* Escala de la Secretaría para el formulario. Las notas finales ya son
     enteras (redondeadas), así que los cortes son exactos. */
  var ESCALAS = [
    { k: 'I', et: 'Inicial',   rango: 'hasta 69',  de: 0,  a: 69 },
    { k: 'B', et: 'Básico',    rango: '70–79',     de: 70, a: 79 },
    { k: 'A', et: 'Avanzado',  rango: '80–90',     de: 80, a: 90 },
    { k: 'E', et: 'Excelente', rango: '91–100',    de: 91, a: 100 }
  ];
  function escalaDe(v) {
    if (v < 70) return 'I';
    if (v < 80) return 'B';
    if (v <= 90) return 'A';
    return 'E';
  }
  var APRUEBA = 70;

  /* columnas de edad del cuadro 4, en el orden del formulario */
  var EDADES = [
    { k: '6', et: '6' }, { k: '6.5', et: '6 ½' }, { k: '7', et: '7' }, { k: '8', et: '8' },
    { k: '9', et: '9' }, { k: '10', et: '10' }, { k: '11', et: '11' }, { k: '12', et: '12' },
    { k: '13', et: '13' }, { k: '14', et: '14' }, { k: 'mas', et: 'Más de 14' }
  ];

  function llano(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/\s+/g, ' ').trim();
  }

  /* materia del formulario → nombre de la columna en Notas SACE */
  function mapearMaterias(materias) {
    var usadas = {};
    var mapa = {};
    ASIGNATURAS.forEach(function (as) {
      var col = (materias || []).find(function (c) {
        return !usadas[c] && as.alias.indexOf(llano(c)) >= 0;
      });
      if (col) { mapa[as.k] = col; usadas[col] = 1; }
    });
    var sobran = (materias || []).filter(function (c) { return !usadas[c]; });
    return { mapa: mapa, sobran: sobran };
  }

  function numero(v) {
    if (v == null) return null;
    var t = String(v).trim().replace(',', '.');
    if (t === '' || isNaN(Number(t))) return null;
    return Number(t);
  }

  /* N/V/T vacío y cómo se suma un alumno */
  function nvt() { return { N: 0, V: 0, T: 0 }; }
  function sumar(c, a) {
    if (a.sexo === 'F') c.N++;
    else if (a.sexo === 'M') c.V++;
    c.T++;
  }
  function contar(lista) {
    var c = nvt();
    lista.forEach(function (a) { sumar(c, a); });
    return c;
  }

  /* ── el cálculo entero ──
     d       el grupo de Mi aula (adLoad())
     opc.corte    'AAAA-MM-DD' fecha a la que se cumple la edad (cuadro 4)
     opc.SL       SaceLista (en el navegador se toma de window) */
  function calcular(d, opc) {
    opc = opc || {};
    var SL = opc.SL || raiz.SaceLista;
    var lista = (d && d.lista) || [];
    var notas = (d && d.notas) || {};
    var reales = lista.filter(function (a) { return !a.prueba; });
    var base = reales.filter(function (a) { return a.sace === true; });
    var fueraSace = reales.filter(function (a) { return a.sace !== true; });

    var est = function (a) { return a.estado || 'activo'; };
    var conocidos = { activo: 1, ingreso: 1, trasladado: 1, desertor: 1 };
    var inicial = base.filter(function (a) { return est(a) !== 'ingreso'; });
    var ingresos = base.filter(function (a) { return est(a) === 'ingreso'; });
    var traslados = base.filter(function (a) { return est(a) === 'trasladado'; });
    var desertores = base.filter(function (a) { return est(a) === 'desertor'; });
    var raros = base.filter(function (a) { return !conocidos[est(a)]; });
    /* la matrícula final se CUENTA (la misma de los demás cuadros del
       SACE) y además se calcula con la fórmula del formulario: si no
       coinciden, hay una ficha con un estado que el formulario no conoce */
    var final = SL.matriculaFinal(d);

    var mov = {
      inicial: contar(inicial), ingresos: contar(ingresos), traslados: contar(traslados),
      desertores: contar(desertores), final: contar(final)
    };
    var formula = nvt();
    ['N', 'V', 'T'].forEach(function (s) {
      formula[s] = mov.inicial[s] + mov.ingresos[s] - mov.traslados[s] - mov.desertores[s];
    });
    var cuadra = ['N', 'V', 'T'].every(function (s) { return formula[s] === mov.final[s]; });

    /* ── notas finales ── */
    var m = mapearMaterias(d.materias);
    var val = function (p, col, num) {
      return numero(((notas[p] || {})[col] || {})[num]);
    };
    /* una asignatura entra si está en Notas SACE y alguien de la
       matrícula final tiene al menos una nota en ella; una columna vacía
       todo el año es una materia que no se imparte en este grupo (la
       misma regla de la boleta) */
    var asigs = ASIGNATURAS.map(function (as) {
      var col = m.mapa[as.k] || '';
      var conNotas = !!col && final.some(function (a) {
        return PARCIALES.some(function (p) { return val(p, col, a.num) != null; });
      });
      return { k: as.k, et: as.et, corto: as.corto, col: col, cuenta: conNotas };
    });
    var cuentan = asigs.filter(function (x) { return x.cuenta; });

    var porAlumno = final.map(function (a) {
      var fin = {}, faltan = [];
      cuentan.forEach(function (as) {
        var xs = PARCIALES.map(function (p) { return val(p, as.col, a.num); });
        var vacios = PARCIALES.filter(function (_, i) { return xs[i] == null; });
        if (vacios.length) { faltan.push({ asig: as.et, parciales: vacios }); fin[as.k] = null; }
        else fin[as.k] = Math.round(xs.reduce(function (t, x) { return t + x; }, 0) / xs.length);
      });
      var completo = cuentan.length > 0 && !faltan.length;
      var valores = cuentan.map(function (as) { return fin[as.k]; });
      var prom = completo ? Math.round(valores.reduce(function (t, x) { return t + x; }, 0) / valores.length) : null;
      var aprobo = completo ? valores.every(function (v) { return v >= APRUEBA; }) : null;
      return { a: a, fin: fin, faltan: faltan, completo: completo, prom: prom, aprobo: aprobo };
    });

    var evaluados = porAlumno.filter(function (r) { return r.completo; });
    var sinNota = porAlumno.filter(function (r) { return !r.completo; });

    var escalaGen = {};
    ESCALAS.forEach(function (e) { escalaGen[e.k] = nvt(); });
    evaluados.forEach(function (r) { sumar(escalaGen[escalaDe(r.prom)], r.a); });

    var aprobados = contar(evaluados.filter(function (r) { return r.aprobo; }).map(function (r) { return r.a; }));
    var reprobados = contar(evaluados.filter(function (r) { return !r.aprobo; }).map(function (r) { return r.a; }));

    /* cuadros 2 y 3: por asignatura, todos los de la matrícula final que
       tienen nota final EN ESA asignatura */
    var porAsig = {};
    asigs.forEach(function (as) {
      var r = { A: 0, NA: 0, T: 0, I: 0, B: 0, AV: 0, E: 0, sinNota: 0, cuenta: as.cuenta };
      if (as.cuenta) {
        porAlumno.forEach(function (x) {
          var v = x.fin[as.k];
          if (v == null) { r.sinNota++; return; }
          r.T++;
          if (v >= APRUEBA) r.A++; else r.NA++;
          var e = escalaDe(v);
          r[e === 'A' ? 'AV' : e]++;
        });
      }
      porAsig[as.k] = r;
    });

    /* cuadro 4: la misma matrícula final y la misma edad cumplida que el
       cuadro «Matrícula final por edades y género» de Fichas */
    var corte = opc.corte;
    var edades = {};
    EDADES.forEach(function (e) { edades[e.k] = nvt(); });
    var edTotal = nvt(), sinFecha = [], menores = [];
    final.forEach(function (a) {
      var e = SL.edad(a.fnac, corte);
      if (!e) { sinFecha.push(a); return; }
      var col;
      if (e.anios < 6) { menores.push(a); return; }
      if (e.anios === 6) col = e.meses >= 6 ? '6.5' : '6';
      else if (e.anios > 14) col = 'mas';
      else col = String(e.anios);
      sumar(edades[col], a); sumar(edTotal, a);
    });

    var sinSexo = base.filter(function (a) { return a.sexo !== 'F' && a.sexo !== 'M'; });

    return {
      corte: corte,
      totalSace: base.length,
      mov: mov, formula: formula, cuadra: cuadra,
      evaluados: contar(evaluados.map(function (r) { return r.a; })),
      escalaGen: escalaGen, aprobados: aprobados, reprobados: reprobados,
      asignaturas: asigs, porAsig: porAsig,
      edades: edades, edTotal: edTotal,
      porAlumno: porAlumno,
      avisos: {
        fueraSace: fueraSace, sinNota: sinNota, sinSexo: sinSexo, sinFecha: sinFecha,
        menores: menores, raros: raros, ingresos: ingresos, traslados: traslados,
        desertores: desertores, sinColumna: asigs.filter(function (x) { return !x.col; }),
        vacias: asigs.filter(function (x) { return x.col && !x.cuenta; }),
        sobran: m.sobran
      }
    };
  }

  /* ── los cinco cuadros como tablas ──
     Una sola forma para la pantalla, la hoja impresa y el Excel, así los
     tres dicen exactamente lo mismo. Cada cuadro: título, rótulo de la
     primera columna, grupos de columnas con sus subcolumnas, y las filas
     (la del grupo y la de TOTAL). Una asignatura que no se imparte en
     el grupo va con «·», no con 0: cero diría que nadie aprobó. */
  function cuadros(r, grupo) {
    var NVT = ['N', 'V', 'T'];
    var tri = function (c) { return [c.N, c.V, c.T]; };
    var fila = function (vals) { return [{ et: grupo, vals: vals }, { et: 'TOTAL', vals: vals, total: true }]; };
    var plano = function (xs) { return [].concat.apply([], xs); };

    var c1g = [
      { et: 'MATRÍCULA INICIAL', subs: NVT }, { et: 'MATRÍCULA FINAL', subs: NVT },
      { et: 'INGRESOS', subs: NVT }, { et: 'DESERTORES', subs: NVT },
      { et: 'TRASLADOS', subs: NVT }, { et: 'EVALUADOS', subs: NVT }
    ].concat(ESCALAS.map(function (e) { return { et: e.et.toUpperCase(), sub: e.rango, subs: NVT }; }));
    var c1v = plano([tri(r.mov.inicial), tri(r.mov.final), tri(r.mov.ingresos), tri(r.mov.desertores),
      tri(r.mov.traslados), tri(r.evaluados)].concat(ESCALAS.map(function (e) { return tri(r.escalaGen[e.k]); })));

    var c2v = plano(r.asignaturas.map(function (as) {
      var x = r.porAsig[as.k];
      return x.cuenta ? [x.A, x.NA, x.T] : ['·', '·', '·'];
    }));
    var c3v = plano(r.asignaturas.map(function (as) {
      var x = r.porAsig[as.k];
      return x.cuenta ? [x.I, x.B, x.AV, x.E] : ['·', '·', '·', '·'];
    }));

    var c4g = EDADES.map(function (e) { return { et: e.et, subs: NVT }; }).concat([{ et: 'TOTAL', subs: NVT }]);
    var c4v = plano(EDADES.map(function (e) { return tri(r.edades[e.k]); }).concat([tri(r.edTotal)]));

    var c5g = [
      { et: 'MATRÍCULA INICIAL', subs: NVT }, { et: 'MATRÍCULA FINAL', subs: NVT },
      { et: 'INGRESOS', subs: NVT }, { et: 'DESERTORES', subs: NVT },
      { et: 'TRASLADOS', subs: NVT }, { et: 'EVALUADOS', subs: NVT },
      { et: 'APROBADOS', subs: NVT }, { et: 'REPROBADOS', subs: NVT }
    ];
    var c5v = plano([tri(r.mov.inicial), tri(r.mov.final), tri(r.mov.ingresos), tri(r.mov.desertores),
      tri(r.mov.traslados), tri(r.evaluados), tri(r.aprobados), tri(r.reprobados)]);

    return [
      { id: 'c1', titulo: 'RESUMEN FINAL DE RESULTADOS DE EXÁMENES ORDINARIOS DE LOS CENTROS EDUCATIVOS',
        primera: 'GRADO Y SECCIÓN', grupos: c1g, filas: fila(c1v) },
      { id: 'c2', titulo: 'RESUMEN FINAL DE RESULTADOS DE EXÁMENES ORDINARIOS DE EDUCACIÓN BÁSICA',
        primera: 'GRADO', grupos: r.asignaturas.map(function (as) { return { et: as.corto, subs: ['A', 'NA', 'T'] }; }),
        filas: fila(c2v) },
      { id: 'c3', titulo: 'NÚMERO DE ALUMNOS POR MATERIA Y POR ESCALA DE NOTAS',
        primera: 'GRADO', grupos: r.asignaturas.map(function (as) { return { et: as.corto, subs: ['I', 'B', 'A', 'E'] }; }),
        filas: fila(c3v) },
      { id: 'c4', titulo: 'MATRÍCULA FINAL POR EDADES Y GÉNERO',
        primera: 'GRADO', grupos: c4g, filas: fila(c4v) },
      { id: 'c5', titulo: 'RESUMEN FINAL DE RESULTADOS DE EXÁMENES ORDINARIOS DE LOS CENTROS EDUCATIVOS',
        primera: 'GRADO', grupos: c5g, filas: fila(c5v) }
    ];
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* tabla HTML de un cuadro (pantalla e impresión usan la misma) */
  function tablaHtml(c) {
    var h = '<table class="rf-tabla rf-' + c.id + '"><thead><tr><th rowspan="2" class="rf-primera" scope="col">' +
      esc(c.primera) + '</th>' +
      c.grupos.map(function (g) {
        return '<th colspan="' + g.subs.length + '" scope="colgroup">' + esc(g.et) +
          (g.sub ? '<br><small>' + esc(g.sub) + '</small>' : '') + '</th>';
      }).join('') + '</tr><tr>' +
      c.grupos.map(function (g) {
        return g.subs.map(function (s, i) {
          return '<th scope="col" class="rf-sub' + (i === 0 ? ' rf-ini' : '') + '">' + esc(s) + '</th>';
        }).join('');
      }).join('') + '</tr></thead><tbody>';
    c.filas.forEach(function (f) {
      var k = 0;
      h += '<tr' + (f.total ? ' class="rf-total"' : '') + '><th scope="row">' + esc(f.et) + '</th>' +
        c.grupos.map(function (g) {
          return g.subs.map(function (_, i) {
            var v = f.vals[k++];
            return '<td' + (i === 0 ? ' class="rf-ini"' : '') + '>' + esc(v) + '</td>';
          }).join('');
        }).join('') + '</tr>';
    });
    return h + '</tbody></table>';
  }

  /* ══════════ 📥 EXCEL (.xlsx) sin librería ══════════
     Un .xlsx es un ZIP con unos cuantos XML. Meter una librería de
     planillas (cientos de KB) a una app que abre sin señal en teléfonos
     modestos no se paga: se arma aquí, sin comprimir (ZIP «store»), y
     Excel, LibreOffice y Google Sheets lo abren igual. Celdas con texto
     en línea, encabezados combinados como en el formulario, hoja carta
     horizontal ajustada al ancho. */
  var CRC_T = null;
  function crc32(bytes) {
    if (!CRC_T) {
      CRC_T = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        CRC_T[n] = c >>> 0;
      }
    }
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) crc = CRC_T[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function zipStore(archivos) {
    var enc = new TextEncoder();
    var partes = [], central = [], off = 0;
    var u16 = function (v) { return [v & 0xFF, (v >>> 8) & 0xFF]; };
    var u32 = function (v) { return [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]; };
    archivos.forEach(function (f) {
      var nom = enc.encode(f.nombre), dat = enc.encode(f.texto), crc = crc32(dat);
      /* bit 11: nombres en UTF-8; fecha fija 1/1/2026 para que el mismo
         grupo dé siempre el mismo archivo */
      var comun = [].concat(u16(20), u16(0x0800), u16(0), u16(0), u16(0x5C21), u32(crc), u32(dat.length), u32(dat.length), u16(nom.length));
      var loc = [].concat(u32(0x04034b50), comun, u16(0));
      partes.push(new Uint8Array(loc), nom, dat);
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), comun, u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), nom);
      off += loc.length + nom.length + dat.length;
    });
    var tamC = central.reduce(function (t, x) { return t + x.length; }, 0);
    var fin = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(archivos.length), u16(archivos.length), u32(tamC), u32(off), u16(0)));
    var todo = partes.concat(central, [fin]);
    var largo = todo.reduce(function (t, x) { return t + x.length; }, 0);
    var out = new Uint8Array(largo), p = 0;
    todo.forEach(function (x) { out.set(x, p); p += x.length; });
    return out;
  }
  function colLetra(i) {
    var s = '';
    i++;
    while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }
  function xmlEsc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }

  /* estilos: 0 normal · 1 título · 2 encabezado · 3 celda · 4 TOTAL · 5 dato del encabezado · 6 nota */
  var ESTILOS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="3"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font>' +
    '<font><b/><sz val="12"/><name val="Arial"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFE8EDF5"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' +
    '<border><left style="thin"><color rgb="FF000000"/></left><right style="thin"><color rgb="FF000000"/></right>' +
    '<top style="thin"><color rgb="FF000000"/></top><bottom style="thin"><color rgb="FF000000"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="7">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="top" wrapText="0"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  /* meta: { titulo, datos: [[etiqueta, valor], …], notas: [texto, …] } */
  function xlsx(cs, meta) {
    var filas = [], combinar = [], fila = 0, ancho = 1;
    cs.forEach(function (c) {
      var n = 1 + c.grupos.reduce(function (t, g) { return t + g.subs.length; }, 0);
      if (n > ancho) ancho = n;
    });
    var poner = function (celdas, alto) { filas.push({ r: fila, celdas: celdas, alto: alto }); fila++; };
    var comb = function (r1, c1, r2, c2) {
      if (r1 !== r2 || c1 !== c2) combinar.push(colLetra(c1) + (r1 + 1) + ':' + colLetra(c2) + (r2 + 1));
    };

    poner([{ c: 0, v: meta.titulo, s: 1 }], 20); comb(fila - 1, 0, fila - 1, ancho - 1);
    (meta.datos || []).forEach(function (d) {
      poner([{ c: 0, v: d[0], s: 5 }, { c: 2, v: d[1], s: 0 }]); comb(fila - 1, 0, fila - 1, 1); comb(fila - 1, 2, fila - 1, ancho - 1);
    });
    poner([]);

    cs.forEach(function (c) {
      var n = 1 + c.grupos.reduce(function (t, g) { return t + g.subs.length; }, 0);
      poner([{ c: 0, v: c.titulo, s: 5 }]); comb(fila - 1, 0, fila - 1, n - 1);
      var h1 = [{ c: 0, v: c.primera, s: 2 }], h2 = [{ c: 0, v: '', s: 2 }], col = 1;
      c.grupos.forEach(function (g) {
        h1.push({ c: col, v: g.et + (g.sub ? ' (' + g.sub + ')' : ''), s: 2 });
        for (var i = 1; i < g.subs.length; i++) h1.push({ c: col + i, v: '', s: 2 });
        g.subs.forEach(function (s, i) { h2.push({ c: col + i, v: s, s: 2 }); });
        comb(fila, col, fila, col + g.subs.length - 1);
        col += g.subs.length;
      });
      comb(fila, 0, fila + 1, 0);
      poner(h1, 30); poner(h2);
      c.filas.forEach(function (f) {
        var cel = [{ c: 0, v: f.et, s: f.total ? 4 : 3 }];
        f.vals.forEach(function (v, i) { cel.push({ c: i + 1, v: v, s: f.total ? 4 : 3 }); });
        poner(cel);
      });
      poner([]);
    });
    (meta.notas || []).forEach(function (t) { poner([{ c: 0, v: t, s: 6 }]); });

    var celdaXml = function (r, x) {
      var ref = colLetra(x.c) + (r + 1);
      if (typeof x.v === 'number') return '<c r="' + ref + '" s="' + x.s + '"><v>' + x.v + '</v></c>';
      if (x.v === '' || x.v == null) return '<c r="' + ref + '" s="' + x.s + '"/>';
      return '<c r="' + ref + '" s="' + x.s + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(x.v) + '</t></is></c>';
    };
    var cols = '<cols><col min="1" max="1" width="18" customWidth="1"/>' +
      (ancho > 1 ? '<col min="2" max="' + ancho + '" width="5.2" customWidth="1"/>' : '') + '</cols>';
    var hoja = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>' + cols + '<sheetData>' +
      filas.map(function (f) {
        return '<row r="' + (f.r + 1) + '"' + (f.alto ? ' ht="' + f.alto + '" customHeight="1"' : '') + '>' +
          f.celdas.map(function (x) { return celdaXml(f.r, x); }).join('') + '</row>';
      }).join('') + '</sheetData>' +
      (combinar.length ? '<mergeCells count="' + combinar.length + '">' +
        combinar.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells>' : '') +
      '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>' +
      '<pageSetup paperSize="1" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';

    return zipStore([
      { nombre: '[Content_Types].xml', texto: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>' },
      { nombre: '_rels/.rels', texto: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>' },
      { nombre: 'xl/workbook.xml', texto: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<sheets><sheet name="Resumen final" sheetId="1" r:id="rId1"/></sheets>' +
        '<definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">\'Resumen final\'!$A$1:$' +
        colLetra(ancho - 1) + '$' + fila + '</definedName></definedNames></workbook>' },
      { nombre: 'xl/_rels/workbook.xml.rels', texto: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '</Relationships>' },
      { nombre: 'xl/worksheets/sheet1.xml', texto: hoja },
      { nombre: 'xl/styles.xml', texto: ESTILOS }
    ]);
  }

  var API = {
    PARCIALES: PARCIALES, ASIGNATURAS: ASIGNATURAS, ESCALAS: ESCALAS, EDADES: EDADES,
    escalaDe: escalaDe, mapearMaterias: mapearMaterias,
    calcular: calcular, cuadros: cuadros, tablaHtml: tablaHtml,
    xlsx: xlsx, crc32: crc32, colLetra: colLetra
  };
  raiz.ResumenSace = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
