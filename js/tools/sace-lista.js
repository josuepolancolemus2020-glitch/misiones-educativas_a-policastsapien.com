/* ══════════════════════════════════════════════════════════════
   📥 LISTA OFICIAL DEL SACE — importar, emparejar y contar
   ──────────────────────────────────────────────────────────────
   La matrícula que se le entrega a la Dirección es la del SACE, no la
   de Mi aula: en Mi aula viven también los que llegaron sin papeles,
   los que se fueron a media semana y el registro de prueba del maestro.
   Por eso la estadística cuenta SOLO a quien trae la marca
   `sace: true`, que se pone al importar el CSV del SACE y que el
   maestro confirma antes de guardar.

   Lo que se guarda va DENTRO de cada alumno de la lista, igual que la
   identidad y los contactos, para que viaje con él al renumerar y al
   fusionar equipos (js/metas-fusion-aula.js empareja por `num`):
     a.fnac      'AAAA-MM-DD'  fecha de nacimiento (la del SACE gana)
     a.sace      true | false  en la lista oficial (ausente = nunca importado)
     a.saceNum   nº de la fila en el SACE (solo referencia; el `num`
                 de la ficha no se toca, de él cuelgan notas y claves)
     a.edadSace  la edad que trae el SACE, para cotejar
     a.estado    'activo' | 'ingreso' | 'trasladado' | 'desertor'
     a.estadoF   'AAAA-MM-DD'  desde cuándo

   Este archivo NO toca la pantalla ni localStorage: recibe el grupo y
   devuelve planes y cuentas. Así la sonda lo carga en Node y comprueba
   que importar no cambia ninguna nota. Nada de esto sale del
   dispositivo: el CSV se lee con FileReader y se queda en memoria.
   ══════════════════════════════════════════════════════════════ */
(function (raiz) {
  'use strict';

  var ESTADOS = {
    activo:     'Activo',
    ingreso:    'Ingreso',
    trasladado: 'Traslado',   /* la clave no cambia: ya hay fichas guardadas con ella */
    desertor:   'Desertor'
  };
  /* los que se fueron siguen en la lista con sus notas, pero ya no son
     matrícula final */
  var ESTADOS_FUERA = { trasladado: 1, desertor: 1 };

  function digitos(s) { return String(s == null ? '' : s).replace(/\D/g, ''); }
  function idnValida(s) { return digitos(s).length === 13; }
  /* 0801201301234 → 0801-2013-01234, como viene en la tarjeta */
  function idnBonita(s) {
    var d = digitos(s);
    return d.length === 13 ? d.slice(0, 4) + '-' + d.slice(4, 8) + '-' + d.slice(8) : String(s || '').trim();
  }

  function fechaValida(iso) {
    var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return false;
    var f = new Date(+m[1], +m[2] - 1, +m[3]);
    return f.getFullYear() === +m[1] && f.getMonth() === +m[2] - 1 && f.getDate() === +m[3];
  }
  /* El SACE exporta AAAA-MM-DD, pero el CSV a veces pasa por Excel y
     vuelve como 15/03/2014: se acepta y se lleva a la forma oficial. */
  function normFecha(s) {
    s = String(s || '').trim();
    var m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (m) s = m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
    else if ((m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/))) {
      s = m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
    }
    return fechaValida(s) ? s : '';
  }

  function normSexo(s) {
    var t = String(s || '').trim().toUpperCase();
    if (/^(F|FEM|FEMENINO|MUJER|NIÑA|NINA)$/.test(t)) return 'F';
    if (/^(M|MAS|MASC|MASCULINO|HOMBRE|VARON|VARÓN|NIÑO|NINO)$/.test(t)) return 'M';
    return '';
  }

  /* ── edad en años y meses a una fecha ── */
  function edad(fnac, corte) {
    if (!fechaValida(fnac) || !fechaValida(corte)) return null;
    var a = fnac.split('-').map(Number), c = corte.split('-').map(Number);
    var meses = (c[0] - a[0]) * 12 + (c[1] - a[1]) - (c[2] < a[2] ? 1 : 0);
    if (meses < 0) return null;
    return { anios: Math.floor(meses / 12), meses: meses % 12 };
  }
  function edadTxt(fnac, corte) {
    var e = edad(fnac, corte);
    if (!e) return '';
    return e.anios + ' años' + (e.meses ? ' ' + e.meses + (e.meses === 1 ? ' mes' : ' meses') : '');
  }

  /* ── leer el CSV ──
     Columnas: num, identidad, nombre, sexo, fecha_nacimiento, edad_sace.
     Se aceptan coma, punto y coma o tabulación (Excel en español guarda
     con punto y coma) y comillas alrededor de los campos. Si la primera
     línea es la cabecera, las columnas se toman por su nombre y el orden
     no importa. */
  function partirLinea(linea, sep) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < linea.length; i++) {
      var ch = linea[i];
      if (q) {
        if (ch === '"' && linea[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === sep) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out.map(function (x) { return x.trim(); });
  }
  function sinTildes(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  var COLS = ['num', 'identidad', 'nombre', 'sexo', 'fecha_nacimiento', 'edad_sace'];
  function columnaDe(cab) {
    var t = sinTildes(cab).toLowerCase().replace(/[^a-z]/g, '');
    if (/^(num|no|n|numero|nro)$/.test(t)) return 'num';
    if (/^(identidad|idn|dni|id|rne|numerodeidentidad)$/.test(t)) return 'identidad';
    if (/^(nombre|nombres|alumno|nombrecompleto|estudiante)$/.test(t)) return 'nombre';
    if (/^(sexo|genero)$/.test(t)) return 'sexo';
    if (/^(fechanacimiento|fechadenacimiento|fnac|nacimiento)$/.test(t)) return 'fecha_nacimiento';
    if (/^(edadsace|edad)$/.test(t)) return 'edad_sace';
    return '';
  }

  function parseCsv(texto) {
    var lineas = String(texto || '').replace(/^﻿/, '').split(/\r?\n/)
      .filter(function (l) { return l.trim(); });
    if (!lineas.length) return { filas: [], errores: ['El archivo está vacío.'] };
    var l0 = lineas[0];
    var sep = (l0.match(/;/g) || []).length > (l0.match(/,/g) || []).length ? ';'
            : (l0.match(/\t/g) || []).length > (l0.match(/,/g) || []).length ? '\t' : ',';
    var orden = COLS.slice();
    var cab = partirLinea(l0, sep).map(columnaDe);
    var hayCab = cab.indexOf('nombre') >= 0;
    if (hayCab) { orden = cab; lineas = lineas.slice(1); }

    var filas = [], errores = [];
    lineas.forEach(function (l, i) {
      var p = partirLinea(l, sep), r = {};
      orden.forEach(function (c, j) { if (c) r[c] = p[j] == null ? '' : p[j]; });
      var nombre = String(r.nombre || '').replace(/\s+/g, ' ').trim();
      var renglon = i + (hayCab ? 2 : 1);
      if (!nombre) { errores.push('Renglón ' + renglon + ': sin nombre, se salta.'); return; }
      var fRaw = String(r.fecha_nacimiento || '').trim();
      var fnac = normFecha(fRaw);
      filas.push({
        i: filas.length,
        renglon: renglon,
        num: parseInt(digitos(r.num), 10) || null,
        idn: String(r.identidad || '').trim(),
        idnOk: idnValida(r.identidad),
        nombre: nombre,
        sexo: normSexo(r.sexo),
        fnac: fnac,
        fnacRaw: fRaw,
        fnacOk: !!fnac,
        edadSace: String(r.edad_sace || '').trim()
      });
    });
    return { filas: filas, errores: errores };
  }

  /* ── emparejar ── */
  function normNombre(s) {
    return sinTildes(s).toUpperCase().replace(/[^A-ZÑ ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, prev = [], cur, i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[n];
  }
  /* Parecido entre dos nombres, de 0 a 1. Por PALABRAS y sin importar el
     orden: el SACE escribe «LÓPEZ MARTÍNEZ MARÍA JOSÉ» y el maestro
     «María José López». Una palabra cuenta si es igual o si difiere en
     una letra (Yeimi/Yeimy), pero solo en palabras de 4 letras o más:
     «Ana» y «Ena» son dos niñas distintas. */
  function similitud(a, b) {
    var ta = normNombre(a).split(' ').filter(Boolean);
    var tb = normNombre(b).split(' ').filter(Boolean);
    if (!ta.length || !tb.length) return 0;
    var usadas = {}, hits = 0;
    ta.forEach(function (x) {
      for (var k = 0; k < tb.length; k++) {
        if (usadas[k]) continue;
        var y = tb[k];
        if (x === y || (x.length >= 4 && y.length >= 4 && lev(x, y) <= 1)) { usadas[k] = 1; hits++; return; }
      }
    });
    /* con una sola palabra en común no se empareja a nadie: hay tres
       «María» en cualquier grado */
    if (hits < Math.min(2, ta.length, tb.length)) return 0;
    return (2 * hits) / (ta.length + tb.length);
  }
  var UMBRAL = 0.6;

  /* palabras en común, con la misma tolerancia de una letra */
  function comunes(a, b) {
    var ta = normNombre(a).split(' ').filter(Boolean), tb = normNombre(b).split(' ').filter(Boolean);
    var usadas = {}, hits = 0;
    ta.forEach(function (x) {
      for (var k = 0; k < tb.length; k++) {
        if (usadas[k]) continue;
        var y = tb[k];
        if (x === y || (x.length >= 4 && y.length >= 4 && lev(x, y) <= 1)) { usadas[k] = 1; hits++; return; }
      }
    });
    return { hits: hits, na: ta.length, nb: tb.length };
  }
  function similitudSuelta(a, b) {
    var c = comunes(a, b);
    return c.na && c.nb ? (2 * c.hits) / (c.na + c.nb) : 0;
  }
  function difDigitos(a, b) {
    a = digitos(a); b = digitos(b);
    if (a.length !== 13 || b.length !== 13) return 99;
    var n = 0; for (var i = 0; i < 13; i++) if (a[i] !== b[i]) n++;
    return n;
  }
  /* ¿qué respalda emparejar esta fila del SACE con esta ficha? */
  function pista(f, al) {
    var c = comunes(al.nombre, f.nombre);
    if (!c.hits) return null;
    var idCasi = difDigitos(f.idn, al.idn) <= 2;
    var fecha = f.fnacOk && al.fnac === f.fnac;
    var contenida = c.na > 0 && c.hits === c.na;          // todo lo que dice la ficha está en el SACE
    return {
      al: al, vale: idCasi || fecha || contenida,
      peso: (idCasi ? 100 : 0) + (fecha ? 50 : 0) + c.hits,
      por: idCasi ? 'identidad parecida' : fecha ? 'fecha y nombre' : 'nombre parcial'
    };
  }

  function cambiosDe(al, f) {
    var c = [];
    /* una identidad mal escrita en el SACE no pisa la de la ficha: se marca */
    if (f.idnOk && digitos(al.idn) !== digitos(f.idn)) c.push({ campo: 'idn', antes: al.idn || '', despues: idnBonita(f.idn) });
    if (normNombre(al.nombre) !== normNombre(f.nombre)) c.push({ campo: 'nombre', antes: al.nombre || '', despues: f.nombre });
    if (f.sexo && al.sexo !== f.sexo) c.push({ campo: 'sexo', antes: al.sexo || '', despues: f.sexo });
    if (f.fnacOk && al.fnac !== f.fnac) c.push({ campo: 'fnac', antes: al.fnac || '', despues: f.fnac });
    return c;
  }

  /* Devuelve el plan, sin tocar nada:
       pares    [{ f, num, por: 'identidad'|'nombre', parecido, cambios }]
       sinFicha [fila del SACE sin ficha en Mi aula]
       sinSace  [num de fichas reales que no están en el SACE]
     Los 🧪 registros de prueba no se emparejan ni se ofrecen como
     «sin alumno en el SACE»: nunca fueron alumnos. */
  function emparejar(lista, filas) {
    var reales = (lista || []).filter(function (a) { return !a.prueba; });
    var libre = {}; reales.forEach(function (a) { libre[a.num] = a; });
    var pares = [], pend = [];

    /* 1 · por identidad: solo con 13 dígitos en los dos lados; con
       menos, dos niños distintos podrían coincidir por accidente */
    filas.forEach(function (f) {
      var d = digitos(f.idn), al = null;
      if (d.length === 13) {
        for (var k in libre) { if (digitos(libre[k].idn) === d) { al = libre[k]; break; } }
      }
      if (al) {
        delete libre[al.num];
        pares.push({ f: f, num: al.num, por: 'identidad', parecido: 1, cambios: cambiosDe(al, f) });
      } else pend.push(f);
    });

    /* 2 · por nombre aproximado: todos contra todos y se toman primero
       los más parecidos, para que un «Ana María» no le robe la ficha a
       la «Ana María» exacta que viene más abajo */
    var cand = [];
    pend.forEach(function (f) {
      Object.keys(libre).forEach(function (k) {
        var s = similitud(f.nombre, libre[k].nombre);
        if (s >= UMBRAL) cand.push({ f: f, al: libre[k], s: s });
      });
    });
    cand.sort(function (x, y) { return y.s - x.s || x.f.i - y.f.i || x.al.num - y.al.num; });
    var tomada = {};
    cand.forEach(function (c) {
      if (tomada[c.f.i] || !libre[c.al.num]) return;
      tomada[c.f.i] = 1; delete libre[c.al.num];
      pares.push({ f: c.f, num: c.al.num, por: 'nombre', parecido: Math.round(c.s * 100) / 100, cambios: cambiosDe(c.al, c.f) });
    });
    /* 3 · lo que sobra, con UNA palabra en común y algo más que lo
       respalde. Pasó en 6º-1 (nov. 2026): la ficha decía solo «Fredy» y el
       SACE trae «FREDY ESAU MEZA DIAZ» con una identidad distinta; con la
       regla de dos palabras quedaba «Fuera de la lista oficial» siendo
       alumno del grado. Se acepta si además (a) la identidad difiere en dos
       dígitos o menos, (b) la fecha de nacimiento es la misma, o (c) todas
       las palabras de la ficha están en el SACE y es el ÚNICO candidato.
       Sin un ganador claro no se adivina: queda para emparejar a mano. */
    var resto = pend.filter(function (f) { return !tomada[f.i]; });
    resto.forEach(function (f) {
      var opciones = Object.keys(libre).map(function (k) { return pista(f, libre[k]); })
        .filter(function (o) { return o && o.vale; })
        .sort(function (x, y) { return y.peso - x.peso; });
      if (!opciones.length || (opciones[1] && opciones[1].peso === opciones[0].peso)) return;
      var o = opciones[0];
      tomada[f.i] = 1; delete libre[o.al.num];
      pares.push({ f: f, num: o.al.num, por: o.por, parecido: Math.round(similitudSuelta(f.nombre, o.al.nombre) * 100) / 100, cambios: cambiosDe(o.al, f) });
    });
    pares.sort(function (x, y) { return x.f.i - y.f.i; });

    return {
      pares: pares,
      sinFicha: pend.filter(function (f) { return !tomada[f.i]; }),
      sinSace: Object.keys(libre).map(Number).sort(function (a, b) { return a - b; })
    };
  }

  /* ── aplicar lo que el maestro confirmó ──
     conf = {
       pares:    [índices de plan.pares confirmados],
       campos:   { idn, nombre, sexo, fnac }   qué datos del SACE se copian
       nuevos:   [índices de plan.sinFicha que se agregan como ficha nueva]
       fuera:    [num de plan.sinSace que se marcan «Fuera de la lista oficial»]
       estados:  { num: 'trasladado' | 'desertor' }  opcional, para los de «fuera»
       fecha:    'AAAA-MM-DD'  fecha de la importación
     }
     Solo AÑADE o CAMBIA campos de fichas; nunca quita un alumno, nunca
     cambia un `num` y no mira d.notas ni nada fuera de d.lista. Devuelve
     los `num` de las fichas nuevas para que la pantalla les dé su clave
     de familia. */
  function aplicar(d, plan, conf) {
    conf = conf || {};
    var campos = conf.campos || {};
    var porNum = {}; (d.lista || []).forEach(function (a) { porNum[a.num] = a; });
    var res = { marcadas: 0, actualizadas: 0, nuevas: [], fuera: 0 };

    (conf.pares || []).forEach(function (i) {
      var p = plan.pares[i], al = p && porNum[p.num];
      if (!al) return;
      var f = p.f, cambio = false;
      al.sace = true; res.marcadas++;
      if (f.num) al.saceNum = f.num;
      if (f.edadSace) al.edadSace = f.edadSace;
      p.cambios.forEach(function (c) {
        if (!campos[c.campo]) return;
        al[c.campo] = c.despues; cambio = true;
      });
      if (cambio) res.actualizadas++;
    });

    /* emparejados A MANO en la vista previa: { i: fila de sinFicha, num } */
    var aMano = {};
    (conf.manuales || []).forEach(function (m) {
      var f = plan.sinFicha[m.i], al = porNum[m.num];
      if (!f || !al || aMano[m.num]) return;
      aMano[m.num] = 1;
      al.sace = true; res.marcadas++;
      if (f.num) al.saceNum = f.num;
      if (f.edadSace) al.edadSace = f.edadSace;
      var cambio = false;
      cambiosDe(al, f).forEach(function (c) { if (campos[c.campo]) { al[c.campo] = c.despues; cambio = true; } });
      if (cambio) res.actualizadas++;
    });
    var filaAMano = {};
    (conf.manuales || []).forEach(function (m) { filaAMano[m.i] = 1; });

    var maxNum = (d.lista || []).reduce(function (m, a) { return Math.max(m, +a.num || 0); }, 0);
    (conf.nuevos || []).forEach(function (i) {
      var f = plan.sinFicha[i];
      if (!f || filaAMano[i]) return;
      var al = { num: ++maxNum, nombre: f.nombre, sace: true };
      if (f.idn) al.idn = f.idnOk ? idnBonita(f.idn) : f.idn;
      if (f.sexo) al.sexo = f.sexo;
      if (f.fnacOk) al.fnac = f.fnac;
      if (f.num) al.saceNum = f.num;
      if (f.edadSace) al.edadSace = f.edadSace;
      d.lista.push(al);
      res.nuevas.push(al.num);
    });

    (conf.fuera || []).forEach(function (num) {
      var al = porNum[num];
      if (!al || aMano[num]) return;
      al.sace = false; res.fuera++;
      var e = conf.estados && conf.estados[num];
      if (e && ESTADOS_FUERA[e]) { al.estado = e; if (conf.fecha) al.estadoF = conf.fecha; }
    });

    d.saceImport = { f: conf.fecha || '', filas: plan.pares.length + plan.sinFicha.length };
    return res;
  }

  /* ── quién cuenta ── */
  function seFue(a) { return !!(a && ESTADOS_FUERA[a.estado]); }
  function enListaOficial(a) { return !!(a && a.sace === true); }
  function hayImportacion(d) { return (d.lista || []).some(enListaOficial); }
  /* Matrícula final: en la lista oficial, no de prueba, y no trasladado
     ni desertor. Si el grupo nunca importó el SACE no hay lista oficial
     y devuelve vacío: un cuadro con 44 cuando el SACE dice 41 es peor
     que un cuadro que pide importar. */
  function matriculaFinal(d) {
    return (d.lista || []).filter(function (a) { return !a.prueba && enListaOficial(a) && !seFue(a); });
  }
  /* Para los informes que ya existían (niñas y varones, informe del
     grado): con lista oficial cuentan la matrícula final; sin ella,
     como siempre, menos los que se fueron. */
  function alumnosQueCuentan(d) {
    if (hayImportacion(d)) return matriculaFinal(d);
    return (d.lista || []).filter(function (a) { return !a.prueba && !seFue(a); });
  }

  /* ── cuadro «Matrícula final por edades y género» ── */
  function cuadroEdades(d, corte) {
    var mf = matriculaFinal(d), porEdad = {}, sinFecha = [], sinSexo = [];
    var tot = { F: 0, M: 0, total: 0 };
    mf.forEach(function (a) {
      var e = edad(a.fnac, corte);
      if (!e) { sinFecha.push(a.num); return; }
      if (a.sexo !== 'F' && a.sexo !== 'M') { sinSexo.push(a.num); return; }
      var r = porEdad[e.anios] || (porEdad[e.anios] = { edad: e.anios, F: 0, M: 0, total: 0 });
      r[a.sexo]++; r.total++; tot[a.sexo]++; tot.total++;
    });
    var filas = Object.keys(porEdad).map(Number).sort(function (a, b) { return a - b; })
      .map(function (k) { return porEdad[k]; });
    var lista = d.lista || [];
    return {
      corte: corte, filas: filas, total: tot, matricula: mf.length,
      sinFecha: sinFecha, sinSexo: sinSexo,
      fueraOficial: lista.filter(function (a) { return !a.prueba && a.sace === false; }).length,
      trasladados: lista.filter(function (a) { return !a.prueba && a.estado === 'trasladado'; }),
      desertores: lista.filter(function (a) { return !a.prueba && a.estado === 'desertor'; }),
      ingresos: lista.filter(function (a) { return !a.prueba && a.estado === 'ingreso'; })
    };
  }

  var API = {
    ESTADOS: ESTADOS, digitos: digitos, idnValida: idnValida, idnBonita: idnBonita,
    fechaValida: fechaValida, normFecha: normFecha, normSexo: normSexo,
    edad: edad, edadTxt: edadTxt, parseCsv: parseCsv, normNombre: normNombre,
    similitud: similitud, emparejar: emparejar, aplicar: aplicar,
    seFue: seFue, enListaOficial: enListaOficial, hayImportacion: hayImportacion,
    matriculaFinal: matriculaFinal, alumnosQueCuentan: alumnosQueCuentan,
    cuadroEdades: cuadroEdades
  };
  raiz.SaceLista = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
