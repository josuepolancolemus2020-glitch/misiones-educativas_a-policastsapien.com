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

  /* Nota final de una materia: promedio de los CUATRO parciales,
     redondeado; sin uno de ellos no hay final (null). La usan el cuadro
     final, el resumen y la matriz de Notas SACE: una sola regla. */
  function notaFinal(d, col, num) {
    var notas = (d && d.notas) || {};
    var xs = PARCIALES.map(function (p) { return numero(((notas[p] || {})[col] || {})[num]); });
    if (xs.some(function (x) { return x == null; })) return null;
    return Math.round(xs.reduce(function (t, x) { return t + x; }, 0) / 4);
  }
  /* La recuperación va DESPUÉS de los cuatro parciales, como en el SACE:
     solo existe si la nota final quedó bajo 70. Una nota guardada para una
     materia que luego se aprobó (se corrigió un parcial) no cuenta. */
  function recuperacionDe(d, col, num, fin) {
    if (fin === undefined) fin = notaFinal(d, col, num);
    if (fin == null || fin >= APRUEBA) return null;
    return numero(((d && d.recuperacion) || {})[col] && d.recuperacion[col][num]);
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
      /* Aprobado = 70 o más en cada asignatura, en la ordinaria O en la
         recuperación (la misma regla del Cuadro final). El promedio y las
         escalas siguen con la nota ordinaria, como en el SACE. */
      var rec = {};
      cuentan.forEach(function (as) {
        if (fin[as.k] != null && fin[as.k] < APRUEBA) rec[as.k] = recuperacionDe(d, as.col, a.num, fin[as.k]);
      });
      var pasa = function (as) { var v = fin[as.k]; return v >= APRUEBA || (rec[as.k] != null && rec[as.k] >= APRUEBA); };
      var aprobo = completo ? cuentan.every(pasa) : null;
      var enRec = !!aprobo && cuentan.some(function (as) { return fin[as.k] < APRUEBA; });
      return { a: a, fin: fin, rec: rec, faltan: faltan, completo: completo, prom: prom, aprobo: aprobo, enRec: enRec };
    });

    var evaluados = porAlumno.filter(function (r) { return r.completo; });
    var sinNota = porAlumno.filter(function (r) { return !r.completo; });

    var escalaGen = {};
    ESCALAS.forEach(function (e) { escalaGen[e.k] = nvt(); });
    evaluados.forEach(function (r) { sumar(escalaGen[escalaDe(r.prom)], r.a); });

    var aprobados = contar(evaluados.filter(function (r) { return r.aprobo; }).map(function (r) { return r.a; }));
    var reprobados = contar(evaluados.filter(function (r) { return !r.aprobo; }).map(function (r) { return r.a; }));
    var aprobadosRec = contar(evaluados.filter(function (r) { return r.enRec; }).map(function (r) { return r.a; }));

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
          /* una materia superada en recuperación cuenta como aprobada;
             su escala (cuadro 3) sigue siendo la de la nota ordinaria */
          var rv = x.rec && x.rec[as.k];
          if (v >= APRUEBA || (rv != null && rv >= APRUEBA)) r.A++; else r.NA++;
          if (v < APRUEBA && rv != null && rv >= APRUEBA) r.recA = (r.recA || 0) + 1;
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
      escalaGen: escalaGen, aprobados: aprobados, reprobados: reprobados, aprobadosRec: aprobadosRec,
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

  /* ══════════ 📈 SEGUNDA HOJA: GRÁFICOS Y ESTADÍSTICA DESCRIPTIVA ══════════
     Sale del MISMO cálculo que los cinco cuadros: ningún número nuevo se
     cuenta aparte, así la hoja de gráficos no puede contradecir al
     formulario. SVG escrito a mano (sin librería): se imprime nítido,
     pesa nada y abre sin señal.
     Colores (validados con el validador de la guía de gráficos, visión
     normal y daltonismo): varones azul, niñas naranja; la escala usa un
     solo azul de claro a oscuro porque va en orden. Ningún dato se dice
     solo con color: cada barra lleva su número y cada serie su nombre. */
  var COL = {
    V: '#2a78d6', N: '#eb6834',
    esc: { I: '#86b6ef', B: '#5598e7', A: '#256abf', E: '#104281' },
    tinta: '#0f2350', gris: '#52514e', suave: '#898781', linea: '#d4dbe6',
    sube: '#0ca30c', baja: '#d03b3b', azul: '#1e3a7c'
  };

  function describir(xs) {
    var n = xs.length;
    if (!n) return { n: 0 };
    var s = xs.slice().sort(function (a, b) { return a - b; });
    var media = s.reduce(function (t, x) { return t + x; }, 0) / n;
    var mediana = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    /* desviación de la población: el grupo entero, no una muestra */
    var desv = Math.sqrt(s.reduce(function (t, x) { return t + (x - media) * (x - media); }, 0) / n);
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    return { n: n, media: r1(media), mediana: r1(mediana), desv: r1(desv), min: s[0], max: s[n - 1] };
  }

  function estadistica(r) {
    var ev = r.porAlumno.filter(function (x) { return x.completo; });
    var proms = function (sexo) {
      return ev.filter(function (x) { return !sexo || x.a.sexo === sexo; }).map(function (x) { return x.prom; });
    };
    var porAsig = r.asignaturas.map(function (as) {
      var xs = as.cuenta ? r.porAlumno.map(function (x) { return x.fin[as.k]; }).filter(function (v) { return v != null; }) : [];
      var d = describir(xs);
      d.k = as.k; d.et = as.et; d.cuenta = as.cuenta;
      d.A = r.porAsig[as.k].A; d.T = r.porAsig[as.k].T;
      return d;
    });
    var puedenQuedar = r.mov.inicial.T + r.mov.ingresos.T;
    return {
      general: describir(proms()), ninas: describir(proms('F')), varones: describir(proms('M')),
      porAsig: porAsig,
      permanencia: puedenQuedar ? Math.round(r.mov.final.T * 100 / puedenQuedar) : null,
      pctAprob: r.evaluados.T ? Math.round(r.aprobados.T * 100 / r.evaluados.T) : null
    };
  }

  function fmt(v) { return v == null ? '·' : String(v).replace('.', ','); }
  function txt(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 10) + '"' +
      (o.anc ? ' text-anchor="' + o.anc + '"' : '') + (o.peso ? ' font-weight="' + o.peso + '"' : '') +
      ' fill="' + (o.col || COL.tinta) + '">' + esc(t) + '</text>';
  }
  /* barra con el extremo de datos redondeado y la base recta */
  function barraV(x, y, w, h, col) {
    if (h <= 0) return '';
    var rr = Math.min(3, h, w / 2);
    return '<path d="M' + x + ' ' + (y + h) + 'V' + (y + rr) + 'Q' + x + ' ' + y + ' ' + (x + rr) + ' ' + y +
      'H' + (x + w - rr) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + rr) + 'V' + (y + h) + 'Z" fill="' + col + '"/>';
  }
  function barraH(x, y, w, h, col, izq) {
    if (w <= 0) return '';
    var rr = Math.min(3, w, h / 2);
    if (izq) {
      return '<path d="M' + (x + w) + ' ' + y + 'H' + (x + rr) + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + rr) +
        'V' + (y + h - rr) + 'Q' + x + ' ' + (y + h) + ' ' + (x + rr) + ' ' + (y + h) + 'H' + (x + w) + 'Z" fill="' + col + '"/>';
    }
    return '<path d="M' + x + ' ' + y + 'H' + (x + w - rr) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + rr) +
      'V' + (y + h - rr) + 'Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - rr) + ' ' + (y + h) + 'H' + x + 'Z" fill="' + col + '"/>';
  }
  function svg(w, h, cuerpo, titulo) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(titulo) +
      '" font-family="Arial, Helvetica, sans-serif">' + cuerpo + '</svg>';
  }
  function leyendaSexo() {
    return '<div class="rf2-ley"><span><i style="background:' + COL.N + '"></i>N · Niñas</span>' +
      '<span><i style="background:' + COL.V + '"></i>V · Varones</span></div>';
  }

  /* 1 · evaluados por escala del promedio general, niñas y varones lado a lado */
  function svgEscala(r) {
    var W = 300, H = 150, top = 16, base = 118, alto = base - top;
    var max = 1;
    ESCALAS.forEach(function (e) { max = Math.max(max, r.escalaGen[e.k].N, r.escalaGen[e.k].V); });
    var paso = W / 4, bw = 22, out = '';
    out += '<line x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '" stroke="' + COL.suave + '" stroke-width="1"/>';
    ESCALAS.forEach(function (e, i) {
      var c = r.escalaGen[e.k], cx = paso * i + paso / 2;
      [['N', cx - bw - 1], ['V', cx + 1]].forEach(function (p) {
        var v = c[p[0]], h = Math.round(v / max * (alto - 12));
        out += barraV(p[1], base - h, bw, h, COL[p[0]]);
        out += txt(p[1] + bw / 2, base - h - 3, v, { anc: 'middle', fs: 10, peso: 700 });
      });
      var pct = r.evaluados.T ? Math.round(c.T * 100 / r.evaluados.T) : 0;
      out += txt(cx, base + 13, e.et, { anc: 'middle', fs: 10, peso: 700 });
      out += txt(cx, base + 25, e.rango + ' · ' + c.T + ' (' + pct + ' %)', { anc: 'middle', fs: 8.5, col: COL.gris });
    });
    return svg(W, H, out, 'Evaluados por escala del promedio general');
  }

  /* 2 · porcentaje que aprobó cada asignatura */
  function svgAprobacion(est) {
    var filas = est.porAsig, fh = 15, W = 300, H = filas.length * fh + 4, x0 = 126, ancho = 104, out = '';
    out += '<line x1="' + x0 + '" y1="0" x2="' + x0 + '" y2="' + (H - 2) + '" stroke="' + COL.suave + '" stroke-width="1"/>';
    filas.forEach(function (a, i) {
      var y = i * fh + 2;
      out += txt(x0 - 5, y + 10, a.et, { anc: 'end', fs: 8.8 });
      if (!a.cuenta || !a.T) { out += txt(x0 + 5, y + 10, 'no se imparte', { fs: 8.5, col: COL.suave }); return; }
      var pct = Math.round(a.A * 100 / a.T);
      out += '<rect x="' + x0 + '" y="' + (y + 2) + '" width="' + ancho + '" height="' + (fh - 5) + '" fill="#eef2f8"/>';
      out += barraH(x0, y + 2, Math.round(pct / 100 * ancho), fh - 5, COL.V);
      out += txt(x0 + ancho + 4, y + 10, pct + ' % (' + a.A + ' de ' + a.T + ')', { fs: 8.5, peso: 700 });
    });
    return svg(W, H, out, 'Porcentaje de aprobados por asignatura');
  }

  /* 3 · de la matrícula inicial a la final, paso a paso (cascada) */
  function svgMovimiento(r) {
    var m = r.mov, W = 300, H = 150, base = 116, alto = 92;
    var pasos = [
      { et: 'Inicial', v: m.inicial.T, tipo: 'tot' },
      { et: '+ Ingresos', v: m.ingresos.T, tipo: 'sube' },
      { et: '− Traslados', v: m.traslados.T, tipo: 'baja' },
      { et: '− Desertores', v: m.desertores.T, tipo: 'baja' },
      { et: 'Final', v: m.final.T, tipo: 'tot' }
    ];
    var max = Math.max(1, m.inicial.T + m.ingresos.T), esc_ = function (v) { return Math.round(v / max * alto); };
    var paso = W / 5, bw = 34, nivel = 0, out = '';
    out += '<line x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '" stroke="' + COL.suave + '" stroke-width="1"/>';
    pasos.forEach(function (p, i) {
      var x = paso * i + (paso - bw) / 2, de, a, col;
      if (p.tipo === 'tot') { de = 0; a = p.v; nivel = p.v; col = COL.azul; }
      else if (p.tipo === 'sube') { de = nivel; a = nivel + p.v; nivel = a; col = COL.sube; }
      else { de = nivel - p.v; a = nivel; nivel = de; col = COL.baja; }
      var y = base - esc_(a), h = esc_(a) - esc_(de);
      if (h > 0) out += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="2" fill="' + col + '"/>';
      out += txt(x + bw / 2, y - 3, (p.tipo === 'sube' ? '+' : p.tipo === 'baja' ? '−' : '') + p.v, { anc: 'middle', fs: 10, peso: 700 });
      out += txt(x + bw / 2, base + 13, p.et, { anc: 'middle', fs: 8.5 });
      /* conector punteado al siguiente paso */
      if (i < pasos.length - 1) {
        var yn = base - esc_(nivel);
        out += '<line x1="' + (x + bw) + '" y1="' + yn + '" x2="' + (x + paso) + '" y2="' + yn + '" stroke="' + COL.suave + '" stroke-dasharray="2 2"/>';
      }
    });
    return svg(W, H, out, 'Movimiento de la matrícula');
  }

  /* 4 · pirámide de edades: niñas a la izquierda, varones a la derecha */
  function svgPiramide(r) {
    var filas = EDADES.slice().reverse(), fh = 12, W = 300, H = filas.length * fh + 6, cx = 150, media = 90, gap = 30, out = '';
    var max = 1;
    EDADES.forEach(function (e) { max = Math.max(max, r.edades[e.k].N, r.edades[e.k].V); });
    filas.forEach(function (e, i) {
      var y = i * fh + 2, c = r.edades[e.k];
      var wn = Math.round(c.N / max * media), wv = Math.round(c.V / max * media);
      out += barraH(cx - gap - wn, y + 1, wn, fh - 3, COL.N, true);
      out += barraH(cx + gap, y + 1, wv, fh - 3, COL.V);
      out += txt(cx, y + 9, e.et, { anc: 'middle', fs: 8.5, peso: 700 });
      if (c.N) out += txt(cx - gap - 4 - wn, y + 9, c.N, { anc: 'end', fs: 8.5 });
      if (c.V) out += txt(cx + gap + 4 + wv, y + 9, c.V, { fs: 8.5 });
    });
    return svg(W, H, out, 'Matrícula final por edad y sexo');
  }

  /* tira de 0 a 100: de la nota más baja a la más alta, la media como
     punto y la línea del 70 que separa aprobado de no aprobado */
  function tira(d) {
    if (!d.n) return '';
    var X = function (v) { return Math.round(v * 1.2 * 10) / 10; };
    return '<svg viewBox="0 0 120 12" width="120" height="12" aria-hidden="true">' +
      '<line x1="0" y1="6" x2="120" y2="6" stroke="#eef2f8" stroke-width="4"/>' +
      '<line x1="' + X(70) + '" y1="0" x2="' + X(70) + '" y2="12" stroke="' + COL.baja + '" stroke-width="1" stroke-dasharray="2 1.5"/>' +
      '<line x1="' + X(d.min) + '" y1="6" x2="' + X(d.max) + '" y2="6" stroke="' + COL.esc.B + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="' + X(d.media) + '" cy="6" r="3.6" fill="' + COL.esc.E + '" stroke="#fff" stroke-width="1.5"/></svg>';
  }

  function graficosHtml(r, avisos) {
    var est = estadistica(r);
    var g = est.general;
    var tile = function (et, v, sub) {
      return '<div class="rf2-kpi"><span>' + esc(et) + '</span><b>' + esc(v) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>';
    };
    var filaEst = function (et, d, extra) {
      return '<tr><th scope="row">' + esc(et) + '</th>' + (d.n
        ? '<td>' + d.n + '</td><td><b>' + fmt(d.media) + '</b></td><td>' + fmt(d.mediana) + '</td><td>' + fmt(d.desv) +
          '</td><td>' + d.min + '</td><td>' + d.max + '</td><td class="rf2-tira">' + tira(d) + '</td>'
        : '<td colspan="7" class="rf2-nada">' + esc(extra || 'sin notas finales') + '</td>') + '</tr>';
    };
    return '<div class="rf2">' +
      '<div class="rf2-kpis">' +
        tile('Matrícula final', r.mov.final.T, r.mov.final.N + ' niñas · ' + r.mov.final.V + ' varones') +
        tile('Evaluados', r.evaluados.T, r.avisos.sinNota.length ? r.avisos.sinNota.length + ' sin nota completa' : 'todos con nota completa') +
        tile('Aprobados', r.aprobados.T, (est.pctAprob == null ? 'de los evaluados' : est.pctAprob + ' % de los evaluados') +
          (r.aprobadosRec && r.aprobadosRec.T ? ' · ' + r.aprobadosRec.T + ' en recuperación' : '')) +
        tile('Reprobados', r.reprobados.T, 'al menos una asignatura bajo 70, también en recuperación') +
        tile('Promedio del grupo', g.n ? fmt(g.media) : '·', g.n ? 'mediana ' + fmt(g.mediana) + ' · de ' + g.min + ' a ' + g.max : '') +
        tile('Permanencia', est.permanencia == null ? '·' : est.permanencia + ' %', 'siguen ' + r.mov.final.T + ' de ' + (r.mov.inicial.T + r.mov.ingresos.T)) +
      '</div>' +
      '<div class="rf2-grid">' +
        '<section class="rf2-card"><h4>Evaluados por escala del promedio general</h4>' + leyendaSexo() + svgEscala(r) + '</section>' +
        '<section class="rf2-card"><h4>Aprobados por asignatura</h4>' + svgAprobacion(est) + '</section>' +
        '<section class="rf2-card"><h4>Movimiento de la matrícula</h4>' +
          '<div class="rf2-ley"><span><i style="background:' + COL.azul + '"></i>Total</span><span><i style="background:' + COL.sube + '"></i>+ Entra</span><span><i style="background:' + COL.baja + '"></i>− Sale</span></div>' +
          svgMovimiento(r) + '</section>' +
        '<section class="rf2-card rf2-ancha"><h4>Estadística descriptiva de las notas finales</h4>' +
          '<table class="rf2-est"><thead><tr><th scope="col">Asignatura</th><th scope="col">Alumnos</th><th scope="col">Promedio</th>' +
          '<th scope="col">Mediana</th><th scope="col">Desviación</th><th scope="col">Mínima</th><th scope="col">Máxima</th>' +
          '<th scope="col">De la más baja a la más alta (0 a 100)</th></tr></thead><tbody>' +
          est.porAsig.map(function (a) { return filaEst(a.et, a, a.cuenta ? '' : 'no se imparte en este grupo'); }).join('') +
          '</tbody><tfoot>' +
          filaEst('Promedio general', g) + filaEst('· Niñas', est.ninas) + filaEst('· Varones', est.varones) +
          '</tfoot></table>' +
          '<p class="rf2-pie">Mediana: la nota del alumno de en medio. Desviación: cuánto se separan las notas del promedio; ' +
          'mientras más baja, más parejo va el grupo. En la tira, ● es el promedio y la raya punteada es el 70.</p></section>' +
        '<section class="rf2-card"><h4>Matrícula final por edad</h4>' + leyendaSexo() + svgPiramide(r) + '</section>' +
      '</div>' +
      (avisos && avisos.length ? '<div class="rf2-avisos"><b>Para quien revisa:</b> ' +
        avisos.map(function (a) { return '<span>' + (a.grave ? '⚠ ' : '') + esc(a.t) + '</span>'; }).join(' ') + '</div>' : '') +
      '</div>';
  }

  /* Estilos de la hoja de gráficos: van con ella, así la pantalla y la
     ventana de imprimir la pintan igual. Es una hoja de papel: fondo
     blanco también en modo oscuro. */
  var GRAF_CSS =
    '.rf2{background:#fff;color:#0f2350;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
    '.rf2-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:7px}' +
    '.rf2-kpi{border:1px solid #d4dbe6;border-radius:8px;padding:5px 8px;background:linear-gradient(180deg,#f4f7fc,#fff)}' +
    '.rf2-kpi span{display:block;font-size:8px;letter-spacing:.5px;text-transform:uppercase;color:#55637d;font-weight:700}' +
    '.rf2-kpi b{display:block;font-family:Georgia,"Times New Roman",serif;font-size:21px;line-height:1.1;color:#1e3a7c}' +
    '.rf2-kpi small{display:block;font-size:8.5px;color:#52514e}' +
    '.rf2-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}' +
    '.rf2-card{border:1px solid #d4dbe6;border-radius:9px;padding:6px 9px;break-inside:avoid;min-width:0}' +
    '.rf2-ancha{grid-column:span 2}' +
    '.rf2-card h4{font-family:Georgia,serif;font-size:11px;color:#1e3a7c;margin:0 0 4px;padding-bottom:3px;border-bottom:1px solid #d4dbe6}' +
    '.rf2-ley{display:flex;gap:12px;font-size:8.5px;color:#52514e;margin:0 0 2px}' +
    '.rf2-ley i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}' +
    '.rf2-est{border-collapse:collapse;width:100%;font-size:9px}' +
    '.rf2-est th,.rf2-est td{border-bottom:1px solid #e6ebf3;padding:1.6px 4px;text-align:center}' +
    '.rf2-est thead th{font-size:7.5px;text-transform:uppercase;letter-spacing:.3px;color:#55637d;border-bottom:1.5px solid #1e3a7c}' +
    '.rf2-est tbody th,.rf2-est tfoot th{text-align:left;font-weight:700;white-space:nowrap}' +
    '.rf2-est tfoot tr:first-child th,.rf2-est tfoot tr:first-child td{border-top:1.5px solid #1e3a7c;background:#fdf6e3;color:#8a5a00}' +
    '.rf2-est .rf2-tira{padding:0 4px;line-height:0}' +
    '.rf2-est .rf2-nada{color:#898781;font-style:italic}' +
    '.rf2-pie{font-size:8px;color:#52514e;margin:3px 0 0;line-height:1.3}' +
    '.rf2-avisos{margin-top:6px;font-size:8px;line-height:1.3;color:#33415c;border-top:1px solid #d4dbe6;padding-top:4px}' +
    '.rf2-avisos span{margin-right:6px}' +
    '@media screen and (max-width:760px){.rf2-kpis{grid-template-columns:repeat(2,1fr)}.rf2-grid{grid-template-columns:1fr}.rf2-ancha{grid-column:auto}' +
    '.rf2-card{overflow-x:auto}}';

  /* ══════════ 📒 CUADRO FINAL DEL AÑO (el consolidado del SACE) ══════════
     Una fila por alumno con todo el año: identidad, personalidad final,
     la nota final de cada asignatura con su casilla de recuperación,
     inasistencias, promedio, valoración y observación. Las reglas son las
     de la boleta, para que el cuadro y la boleta digan lo mismo:
     · nota final = promedio de los CUATRO parciales, redondeado; si falta
       un parcial no hay nota final y el alumno queda «PENDIENTE»;
     · personalidad final = promedio de los parciales en número oficial
       (S 4, MB 3, B 2, NS 1), redondeado y vuelto a letra;
     · aprobado = 70 o más en CADA asignatura (el promedio no salva una
       materia baja);
     · valoración = la escala del formulario: I, B, A, E.
     Recuperación: la aplicación no la guarda. Si la materia está aprobada
     va «N/A» como en el SACE; si no, la casilla queda en blanco para
     escribirla a mano. No se inventa una nota. */
  var PERS_DEF = ['Puntualidad', 'Espíritu de trabajo', 'Orden y presentación', 'Sociabilidad', 'Moralidad'];
  var PERS_NUM = { S: 4, MB: 3, B: 2, NS: 1 };
  var PERS_DE_NUM = { 4: 'S', 3: 'MB', 2: 'B', 1: 'NS' };
  var AREA = { artistica: 'COMUNICACIÓN', espanol: 'COMUNICACIÓN', ingles: 'COMUNICACIÓN', matematicas: 'MATEMÁTICAS',
    naturales: 'CIENCIAS NATURALES', civica: 'CIENCIAS SOCIALES', sociales: 'CIENCIAS SOCIALES',
    fisica: 'EDUCACIÓN FÍSICA', tecnologia: 'TECNOLOGÍA' };

  function cuadroFinal(d, opc) {
    opc = opc || {};
    var SL = opc.SL || raiz.SaceLista;
    var notas = (d && d.notas) || {};
    var pers = opc.pers || PERS_DEF;
    var alumnos = SL.alumnosQueCuentan(d).slice().sort(function (a, b) { return (+a.num || 0) - (+b.num || 0); });
    var val = function (p, col, num) { return numero(((notas[p] || {})[col] || {})[num]); };
    var txt = function (p, col, num) { var v = ((notas[p] || {})[col] || {})[num]; return v == null ? '' : String(v).trim().toUpperCase(); };
    var m = mapearMaterias(d.materias);
    var asigs = ASIGNATURAS.map(function (as) {
      var col = m.mapa[as.k] || '';
      var conNotas = !!col && alumnos.some(function (a) { return PARCIALES.some(function (p) { return val(p, col, a.num) != null; }); });
      return { k: as.k, et: as.et, corto: as.corto, area: AREA[as.k], col: col, cuenta: conNotas };
    }).filter(function (x) { return x.cuenta; });

    var asis = Array.isArray(d.asistencia) ? d.asistencia : [];
    var conPase = asis.some(function (r) { return r && r.f; });
    var faltas = {}, diasVistos = {};
    asis.forEach(function (r) {
      if (!r || !r.f || !r.aus || diasVistos[r.f]) return;
      diasVistos[r.f] = 1;
      Object.keys(r.aus).forEach(function (n) { if (r.aus[n] === 'A') faltas[n] = (faltas[n] || 0) + 1; });
    });
    var porVal = { E: nvt(), A: nvt(), B: nvt(), I: nvt() };
    var aprob = nvt(), aprobRec = nvt(), reprob = nvt(), pend = nvt(), proms = [];
    var filas = alumnos.map(function (a) {
      var faltan = [];
      var ns = asigs.map(function (as) {
        var xs = PARCIALES.map(function (p) { return val(p, as.col, a.num); });
        var vacios = PARCIALES.filter(function (_, i) { return xs[i] == null; });
        if (vacios.length) { faltan.push(as.et + ' (' + vacios.join(', ') + ')'); return { k: as.k, et: as.et, col: as.col, final: null, recup: '' }; }
        var f = notaFinal(d, as.col, a.num);
        /* la nota de recuperación solo existe para una materia reprobada */
        var rn = recuperacionDe(d, as.col, a.num, f);
        return { k: as.k, et: as.et, col: as.col, final: f, recup: f >= APRUEBA ? 'N/A' : (rn == null ? '' : rn) };
      });
      var pf = pers.map(function (r) {
        var xs = PARCIALES.map(function (p) { return txt(p, r, a.num); }).filter(Boolean);
        if (!xs.length || xs.some(function (x) { return !PERS_NUM[x]; })) return '';
        var n = Math.round(xs.reduce(function (t, x) { return t + PERS_NUM[x]; }, 0) / xs.length);
        return PERS_DE_NUM[Math.max(1, Math.min(4, n))];
      });
      /* Inasistencias REALES: los días marcados Ausente («A») en el pase
         de lista, cada día una sola vez. Las excusas («E») no son
         inasistencia. Antes se sumaba la columna de cada parcial, que se
         llena eligiendo fechas: si dos rangos se cruzaban, los mismos días
         contaban dos veces, y las excusas entraban también. Sin pase de
         lista en el grupo, se usa lo escrito en los parciales. */
      var inas = conPase ? [faltas[a.num] || 0]
        : PARCIALES.map(function (p) { return val(p, 'Inasistencias', a.num); }).filter(function (x) { return x != null; });
      var completo = asigs.length > 0 && !faltan.length;
      var prom = completo ? Math.round(ns.reduce(function (t, x) { return t + x.final; }, 0) / ns.length) : null;
      /* Reprobadas en la evaluación ordinaria, y qué pasó en recuperación.
         El promedio y la valoración se quedan con las notas ordinarias,
         como en el consolidado del SACE: la recuperación va en su columna
         y cambia la observación, no el promedio. */
      var reprobadas = completo ? ns.filter(function (x) { return x.final < APRUEBA; }) : [];
      var recPend = reprobadas.filter(function (x) { return x.recup === ''; });
      var recNo = reprobadas.filter(function (x) { return x.recup !== '' && x.recup < APRUEBA; });
      var estado = !completo ? 'PENDIENTE'
        : !reprobadas.length ? 'APROBADO'
        : (!recPend.length && !recNo.length) ? 'APROBADO EN RECUPERACIÓN'
        : 'REPROBADO';
      var vl = prom == null ? '' : escalaDe(prom);
      if (prom != null) { proms.push(prom); sumar(porVal[vl], a); }
      sumar(estado === 'APROBADO' ? aprob : estado === 'REPROBADO' ? reprob : estado === 'PENDIENTE' ? pend : aprobRec, a);
      return {
        num: a.num, idn: a.idn || '', nombre: String(a.nombre || '').trim(), sexo: a.sexo || '',
        pers: pf, notas: ns, inasis: inas.length ? inas.reduce(function (t, x) { return t + x; }, 0) : '',
        prom: prom, valoracion: vl, estado: estado, faltan: faltan,
        reprobadas: reprobadas, recPend: recPend, recNo: recNo,
        encargado: String(a.enc || '').trim(), tel: String(a.encTel || '').trim()
      };
    });
    return {
      pers: pers, asigs: asigs, filas: filas, sobran: m.sobran,
      inasisFuente: conPase ? 'pase' : 'parciales', diasPase: Object.keys(diasVistos).length,
      resumen: { aprob: aprob, aprobRec: aprobRec, reprob: reprob, pend: pend, porVal: porVal, total: contar(alumnos),
        promGrupo: proms.length ? Math.round(proms.reduce(function (t, x) { return t + x; }, 0) / proms.length * 10) / 10 : null }
    };
  }

  /* La observación en palabras (Excel, listado y pantalla). */
  function observacion(f) {
    if (f.estado === 'PENDIENTE') return 'PENDIENTE: falta ' + f.faltan.join(', ');
    if (f.estado === 'APROBADO') return 'APROBADO';
    if (f.estado === 'APROBADO EN RECUPERACIÓN') return 'APROBADO EN RECUPERACIÓN';
    var p = [];
    if (f.recPend.length) p.push('recuperación pendiente: ' + f.recPend.map(function (x) { return x.et; }).join(', '));
    if (f.recNo.length) p.push('no superó la recuperación: ' + f.recNo.map(function (x) { return x.et + ' (' + x.recup + ')'; }).join(', '));
    return 'REPROBADO' + (p.length ? ': ' + p.join('; ') : '');
  }

  /* ── Mensajes a las familias ──
     A la familia se le habla de usted; sin guiones largos; con el nombre
     completo del alumno una vez y luego su primer nombre. El de reprobado
     reconoce el esfuerzo de todos y deja abierta la puerta: no culpa. */
  var VAL_TXT = { E: 'Excelente', A: 'Avanzado', B: 'Básico', I: 'Inicial' };
  var SIGUIENTE = ['', 'segundo grado', 'tercer grado', 'cuarto grado', 'quinto grado', 'sexto grado',
    'séptimo grado', 'octavo grado', 'noveno grado', 'la siguiente etapa de sus estudios'];
  /* «de la Escuela…», «del Centro…», «del centro educativo John Arnold Cook» */
  function delCentro(c) {
    c = String(c || '').trim();
    if (/^(escuela|unidad)\b/i.test(c)) return 'de la ' + c;
    if (/^(centro|instituto|colegio|jard[ií]n|ceb|c\.e\.b)\b/i.test(c)) return 'del ' + c;
    return 'del centro educativo ' + c;
  }
  function lista(xs) { return xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1]; }
  /* ctx: { docente, grupo ('6º-1'), centro, anio, grado (número) } */
  function mensajeFamilia(f, ctx) {
    ctx = ctx || {};
    var primer = String(f.nombre || '').trim().split(/\s+/)[0] || 'su hijo(a)';
    var saludo = 'Estimado(a) padre, madre o encargado(a) de *' + (f.nombre || primer) + '*:\n\n' +
      'Le saluda ' + (ctx.docente || 'el docente') + ', docente de ' + (ctx.grupo || 'su grado') +
      (ctx.centro ? ' ' + delCentro(ctx.centro) : '') + '.\n\n';
    var firma = '\n\nQuedo a sus órdenes.\n' + (ctx.docente || '');
    var sig = SIGUIENTE[+ctx.grado] || 'el siguiente grado';
    if (f.estado === 'APROBADO' || f.estado === 'APROBADO EN RECUPERACIÓN') {
      return saludo + '🎉 ¡Felicidades! Al cierre del año lectivo ' + (ctx.anio || '') + ', *' + primer + ' aprobó el grado*' +
        (f.estado === 'APROBADO EN RECUPERACIÓN' ? ' después de presentar con éxito la recuperación de ' + lista(f.reprobadas.map(function (x) { return x.et; })) : '') +
        ', con un promedio de *' + f.prom + '* (' + VAL_TXT[f.valoracion] + ').\n\n' +
        'Este logro es de ' + primer + ' y también de ustedes, que lo acompañaron todo el año. ' +
        'Le animo a que en vacaciones siga leyendo un poco cada día, para llegar con fuerza a ' + sig + '. ' +
        '¡A seguir adelante!' + firma;
    }
    if (f.estado === 'PENDIENTE') {
      return saludo + 'Le escribo porque a ' + primer + ' aún le faltan notas para cerrar el año en: ' + f.faltan.join(', ') +
        '. Le pido acercarse al centro para revisarlo juntos.' + firma;
    }
    var bajas = f.reprobadas.map(function (x) { return x.et + ' (' + x.final + ')'; });
    var txt = saludo + 'Al cierre del año lectivo ' + (ctx.anio || '') + ', ' + primer +
      ' no alcanzó la nota mínima de 70 en *' + lista(bajas) + '*.\n\n' +
      'Durante el año trabajamos con refuerzos, tareas y seguimiento en clase, y sabemos el esfuerzo que también hicieron en casa. ' +
      'Hicimos todo lo posible para que lo lograra, y este resultado no define a ' + primer + '.';
    if (f.recPend.length) {
      txt += '\n\nTodavía hay una oportunidad: la *recuperación* de ' + lista(f.recPend.map(function (x) { return x.et; })) + '. ' +
        'Le pido acercarse al centro para acordar la fecha y el material de estudio. Con su apoyo en casa, ' + primer + ' puede lograrlo.';
    } else {
      txt += '\n\n' + primer + ' presentó la recuperación, pero no alcanzó el 70 en ' +
        lista(f.recNo.map(function (x) { return x.et + ' (' + x.recup + ')'; })) + ', por lo que el año no queda aprobado. ' +
        'Le invito con todo respeto a conversar conmigo para acordar juntos los pasos a seguir.';
    }
    return txt + firma;
  }
  /* Para el grupo de WhatsApp de padres: SIN nombres. Una lista de quién
     aprobó dice, por omisión, quién no. */
  function mensajeGrupo(cf, ctx) {
    ctx = ctx || {};
    var r = cf.resumen;
    var ap = r.aprob.T + r.aprobRec.T;
    return 'Estimados padres de familia de ' + (ctx.grupo || 'nuestro grado') + ':\n\n' +
      'Cerramos el año lectivo ' + (ctx.anio || '') + '. Gracias por acompañar a sus hijos todo el año: ' +
      'cada tarea revisada en casa y cada reunión a la que asistieron se nota en el aula.\n\n' +
      '🎉 *' + ap + ' de ' + cf.filas.length + ' alumnos aprobaron el grado.* ¡Felicidades a ellos y a sus familias! ' +
      'Les animo a que en vacaciones sigan leyendo un poco cada día.\n\n' +
      'A cada familia le escribo en privado con el resultado de su hijo(a). ' +
      'Si su hijo(a) tiene recuperación, ahí le explico los pasos.\n\nCon aprecio,\n' + (ctx.docente || '');
  }

  /* El mismo cuadro como tabla para el Excel (xlsx de abajo): dos filas de
     encabezado, como el consolidado. */
  function cuadroFinalTabla(cf, idnBonita) {
    var grupos = [{ et: 'IDENTIDAD', subs: [''] }, { et: 'NOMBRE', subs: [''] },
      { et: 'PERSONALIDAD', subs: cf.pers.slice() }]
      .concat(cf.asigs.map(function (as) { return { et: as.corto, subs: ['RECUP.', 'PROMEDIO'] }; }))
      .concat([{ et: 'INASISTENCIAS', subs: [''] }, { et: 'PROMEDIO', subs: [''] }, { et: 'VALORACIÓN', subs: [''] }, { et: 'OBSERVACIONES', subs: [''] }]);
    var filas = cf.filas.map(function (f) {
      var vals = [idnBonita ? idnBonita(f.idn) : f.idn, f.nombre].concat(f.pers.map(function (x) { return x || '·'; }));
      f.notas.forEach(function (n) { vals.push(n.final == null ? '' : n.recup); vals.push(n.final == null ? '·' : n.final); });
      vals.push(f.inasis === '' ? 0 : f.inasis, f.prom == null ? '·' : f.prom, f.valoracion || '·', observacion(f));
      return { et: f.num, vals: vals };
    });
    return { id: 'cf', titulo: 'CUADRO FINAL DEL AÑO', primera: '#', grupos: grupos, filas: filas };
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
    /* meta.anchos: ancho de cada columna (el cuadro final necesita el
       nombre ancho); sin él, la primera ancha y el resto angostas */
    var cols = '<cols>' + (Array.isArray(meta.anchos)
      ? meta.anchos.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('')
      : '<col min="1" max="1" width="18" customWidth="1"/>' +
        (ancho > 1 ? '<col min="2" max="' + ancho + '" width="5.2" customWidth="1"/>' : '')) + '</cols>';
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
    escalaDe: escalaDe, mapearMaterias: mapearMaterias, APRUEBA: APRUEBA,
    notaFinal: notaFinal, recuperacionDe: recuperacionDe,
    calcular: calcular, cuadros: cuadros, tablaHtml: tablaHtml,
    describir: describir, estadistica: estadistica, graficosHtml: graficosHtml, GRAF_CSS: GRAF_CSS,
    cuadroFinal: cuadroFinal, cuadroFinalTabla: cuadroFinalTabla,
    observacion: observacion, mensajeFamilia: mensajeFamilia, mensajeGrupo: mensajeGrupo, delCentro: delCentro,
    xlsx: xlsx, crc32: crc32, colLetra: colLetra
  };
  raiz.ResumenSace = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
