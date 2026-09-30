/* ══════════════════════════════════════════════════════════════
   🤝 EQUIPOS DE TRABAJO — una pestaña de Mi aula

   De dónde sale: un aula de 43 alumnos trabaja en equipos casi todos
   los días, y los equipos se arman como se puede. «Numérense del 1 al
   8» junta a los cinco que se sientan atrás; «júntense como quieran»
   deja a las niñas en una esquina, a los varones en otra y a dos o tres
   que nadie escogió de pie en medio del aula, delante de todos. Y el
   equipo que se lleva a los que van mejor termina el trabajo en diez
   minutos mientras otro no sabe ni por dónde empezar.

   Aquí se arman en un toque, con lo que la plataforma ya sabe del
   grupo: la lista, quién faltó hoy, quién es niña y quién varón, y el
   promedio de Notas SACE. Nadie escoge a nadie, así que nadie se queda
   de último.

   CINCO REGLAS, Y NINGUNA ES DE ADORNO:

   · Los 🧪 de prueba se pueden dejar fuera. Casi todo maestro tiene uno
     o dos alumnos inventados al final de la lista para probar la
     plataforma; en un equipo son un hueco: un equipo «de cuatro» que en
     el aula es de tres. Viene puesto, y se puede quitar.

   · Tamaños parejos, y nunca más grandes de lo que se pidió. «Equipos
     de 4» con 42 alumnos son 9 de 4 y 2 de 3, no 10 de 4 y uno de 2:
     entre el equipo más grande y el más chico hay a lo más UNO. La
     pantalla lo dice ANTES de armar, para que no haya sorpresas.

   · Parejos se mide, no se promete. Debajo de los equipos se dice
     cuántas niñas le tocaron a cada uno, entre qué notas va el promedio
     de cada equipo y si las parejas que había que separar quedaron
     separadas. Se cuenta, igual que la matrícula.

   · Las notas no salen en los equipos. Los equipos se proyectan, se
     leen en voz alta y se pegan en la pizarra: al lado de un nombre no
     puede ir su promedio. Y «por nivel» NO numera a los equipos por
     nivel: el equipo 1 no es el de los que van mejor.

   · Se cambian a mano sin volver a empezar. El maestro conoce a su
     grupo mejor que cualquier cuenta: toca a un alumno, toca a otro y
     cambian de equipo. Y «Armar otros» no borra lo anterior sin salida:
     «Los de antes» lo devuelve.

   El reparto es una BÚSQUEDA, no una fórmula: se prueban muchos
   repartos al azar y se van cambiando alumnos de a dos mientras el
   reparto mejore. Así se pueden pedir varias cosas a la vez —niñas y
   varones, niveles, parejas separadas— y cada vez que se arma sale otro
   distinto, igual de parejo. El núcleo no toca la pantalla a propósito:
   se prueba sin navegador con  node _dev/prueba-equipos.js

   Dónde se guarda: en el grupo (d.equipos), así viaja con el espejo
   del maestro. El reparto va como UNA cadena («1,5,9|2,6,10|…») y no
   como una lista de listas: la fusión de dos equipos empareja las
   listas por su contenido, y dos repartos distintos fusionados así
   dejarían a un alumno en dos equipos. Una cadena se elige entera.
══════════════════════════════════════════════════════════════ */

/* ═════════════ EL NÚCLEO (sin pantalla: corre también en Node) ═════════════ */

/* Azar con semilla: el mismo número da siempre el mismo reparto. La sonda
   lo necesita para comprobar; el maestro nunca lo ve. */
function eqRng(semilla) {
  let s = (semilla >>> 0) || 1;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function eqBarajar(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const x = arr[i]; arr[i] = arr[j]; arr[j] = x;
  }
  return arr;
}

/* Cuántos equipos y de qué tamaño.
   · 'tam' = «alumnos por equipo»: ninguno pasa de lo pedido (hay mesas y
     materiales para cuatro, no para cinco). 42 de a 4 → 9 de 4 y 2 de 3.
   · 'num' = «cuántos equipos».
   En los dos casos, entre el más grande y el más chico hay a lo más uno,
   y NUNCA queda un equipo de uno: «en parejas» con 43 alumnos no deja a
   un niño solo delante de todos, deja un trío. Es la única vez que un
   equipo pasa de lo pedido, y la pantalla lo dice. */
const EQ_TAM_MIN = 2;
function eqTamanos(n, modo, valor) {
  n = Math.max(0, Math.floor(Number(n) || 0));
  if (n < 1) return [];
  if (n < 2 * EQ_TAM_MIN) return [n];
  const v = Math.floor(Number(valor) || 0);
  const k = Math.max(1, Math.min(Math.floor(n / EQ_TAM_MIN), modo === 'num'
    ? (v || 1)
    : Math.ceil(n / Math.max(EQ_TAM_MIN, v || EQ_TAM_MIN))));
  const base = Math.floor(n / k), resto = n % k;
  const out = [];
  for (let i = 0; i < k; i++) out.push(base + (i < resto ? 1 : 0));
  return out;
}
/* «11 equipos: 9 de 4 y 2 de 3» · «8 equipos de 5» · «1 equipo de 3» */
function eqTamanosTxt(tams) {
  if (!tams || !tams.length) return 'ningún equipo';
  const cuenta = {};
  tams.forEach(t => { cuenta[t] = (cuenta[t] || 0) + 1; });
  const tallas = Object.keys(cuenta).map(Number).sort((a, b) => b - a);
  const k = tams.length;
  const cab = k + (k === 1 ? ' equipo' : ' equipos');
  if (tallas.length === 1) return cab + ' de ' + tallas[0];
  return cab + ': ' + tallas.map(t => cuenta[t] + ' de ' + t).join(' y ');
}

/* El reparto guardado: «1,5,9|2,6,10». Una cadena, no una lista de
   listas (el porqué está arriba, en «Dónde se guarda»). */
function eqLeerReparto(txt) {
  return String(txt || '').split('|')
    .map(p => p.split(',').map(x => parseInt(x, 10)).filter(x => x > 0))
    .filter(g => g.length);
}
function eqEscribirReparto(grupos) {
  return (grupos || []).map(g => g.join(',')).filter(Boolean).join('|');
}

/* Los que van mejor, los del medio y los que van más despacio: se ordenan
   por su promedio y se parten en tres montones iguales. Los empates se
   deshacen por el nº de lista, para que medir dé siempre lo mismo. */
function eqTercios(alumnos) {
  const con = alumnos.filter(a => typeof a.nivel === 'number' && isFinite(a.nivel))
    .slice().sort((x, y) => (y.nivel - x.nivel) || (x.num - y.num));
  const t = {};
  con.forEach((a, r) => { t[a.num] = Math.floor(r * 3 / con.length); });
  return t;   /* num → 0 (van mejor) · 1 · 2 (van más despacio) */
}

/* Cuánto pesa cada cosa que se le pide al reparto. Separar a dos que no
   pueden estar juntos pesa tanto que nada lo compensa; repetir compañeros
   de la vez pasada pesa poco: solo desempata entre repartos igual de
   parejos, para que «Armar otros» dé de verdad OTROS.
   «Por nivel» pesa 10 y no 1 porque es lo que el maestro pidió al
   escogerlo: con el mismo peso que niñas y varones, en un grupo donde
   las dos cosas tiran para lados distintos los equipos salían con notas
   separadas por 13 puntos; con 10, por 9, y la mezcla de niñas y varones
   sigue desempatando. Medido en _dev/prueba-equipos.js. */
const EQ_PESO = { sexo: 1, tercio: 1, media: 0.5, nivel: 10, separar: 1000, repetir: 0.2 };

/* Arma los equipos.
   alumnos: [{ num, sexo: 'F'|'M'|'', nivel: número|null }]
   op: { tamanos, sexo: bool, nivel: 'azar'|'parejos'|'nivel',
         separar: [[nums],…], antes: [[nums],…], semilla, intentos }
   Cada lista de «separar» son alumnos que no pueden compartir equipo,
   dos o más: por dentro se cuenta como todas sus parejas.
   Devuelve { grupos: [[nums],…], costo }. */
function eqArmar(alumnos, op) {
  op = op || {};
  const N = alumnos.length;
  if (!N) return { grupos: [], costo: 0 };
  let tam = Array.isArray(op.tamanos) ? op.tamanos.slice() : [];
  if (tam.reduce((s, x) => s + x, 0) !== N) tam = eqTamanos(N, 'tam', 4);
  const K = tam.length;
  const rnd = eqRng(op.semilla != null ? op.semilla : (Date.now() ^ Math.floor(Math.random() * 1e9)));

  const usaSexo = !!op.sexo && alumnos.some(a => a.sexo === 'F' || a.sexo === 'M');
  const conNota = alumnos.filter(a => typeof a.nivel === 'number' && isFinite(a.nivel));
  const modoNivel = (op.nivel === 'parejos' || op.nivel === 'nivel') && conNota.length >= 2 ? op.nivel : 'azar';

  const sx = alumnos.map(a => usaSexo ? (a.sexo === 'F' ? 1 : a.sexo === 'M' ? 2 : 0) : 0);
  let mu = 0, sd = 1;
  if (modoNivel !== 'azar') {
    mu = conNota.reduce((s, a) => s + a.nivel, 0) / conNota.length;
    const v = conNota.reduce((s, a) => s + (a.nivel - mu) * (a.nivel - mu), 0) / conNota.length;
    sd = Math.sqrt(v) || 1;
  }
  const tercioDe = modoNivel !== 'azar' ? eqTercios(alumnos) : {};
  const z = alumnos.map(a => (modoNivel !== 'azar' && typeof a.nivel === 'number' && isFinite(a.nivel))
    ? (a.nivel - mu) / sd : null);
  const tr = alumnos.map(a => (a.num in tercioDe) ? tercioDe[a.num] : -1);

  /* lo que le tocaría a cada equipo si todo se repartiera exacto */
  const F = sx.filter(x => x === 1).length, M = sx.filter(x => x === 2).length;
  const T = [0, 1, 2].map(k => tr.filter(x => x === k).length);
  const eF = tam.map(s => F * s / N), eM = tam.map(s => M * s / N);
  const eT = tam.map(s => T.map(c => c * s / N));

  /* los que no pueden quedar juntos, y compañeros de la vez pasada */
  const pos = new Map(alumnos.map((a, i) => [a.num, i]));
  const sep = alumnos.map(() => new Set()), rep = alumnos.map(() => new Set());
  (op.separar || []).forEach(g => {
    if (!Array.isArray(g)) return;
    const ix = g.map(n => pos.get(+n)).filter(i => i != null);
    ix.forEach(i => ix.forEach(j => { if (i !== j) sep[i].add(j); }));
  });
  (op.antes || []).forEach(g => {
    const ix = (g || []).map(n => pos.get(+n)).filter(i => i != null);
    ix.forEach(i => ix.forEach(j => { if (i !== j) rep[i].add(j); }));
  });
  const hayPares = sep.some(s => s.size) || rep.some(s => s.size);

  const agNuevo = () => ({ f: 0, m: 0, t: [0, 0, 0], zs: 0, zq: 0, sc: 0 });
  const agSuma = (ag, i, sg) => {
    if (sx[i] === 1) ag.f += sg; else if (sx[i] === 2) ag.m += sg;
    if (tr[i] >= 0) ag.t[tr[i]] += sg;
    if (z[i] != null) { ag.zs += sg * z[i]; ag.zq += sg * z[i] * z[i]; ag.sc += sg; }
  };
  const costoEquipo = (ag, t) => {
    let c = 0;
    if (usaSexo) c += EQ_PESO.sexo * ((ag.f - eF[t]) ** 2 + (ag.m - eM[t]) ** 2);
    if (modoNivel === 'parejos') {
      for (let k = 0; k < 3; k++) c += EQ_PESO.tercio * (ag.t[k] - eT[t][k]) ** 2;
      c += EQ_PESO.media * ag.zs * ag.zs / tam[t];
    } else if (modoNivel === 'nivel' && ag.sc > 1) {
      c += EQ_PESO.nivel * (ag.zq - ag.zs * ag.zs / ag.sc);
    }
    return c;
  };
  /* lo que cuesta que i esté en el equipo t (sin contar a «fuera») */
  const pares = (i, miembros, fuera) => {
    let c = 0;
    for (const y of miembros) {
      if (y === i || y === fuera) continue;
      if (sep[i].has(y)) c += EQ_PESO.separar;
      if (rep[i].has(y)) c += EQ_PESO.repetir;
    }
    return c;
  };

  const intentos = Math.max(1, op.intentos || (N > 60 ? 8 : 16));
  let mejor = null, mejorCosto = Infinity;
  const idx = alumnos.map((_, i) => i);

  for (let r = 0; r < intentos; r++) {
    /* un reparto al azar con los tamaños pedidos … */
    const orden = eqBarajar(idx.slice(), rnd);
    const miembros = tam.map(() => []);
    const de = new Array(N);
    let p = 0;
    tam.forEach((s, t) => { for (let q = 0; q < s; q++, p++) { miembros[t].push(orden[p]); de[orden[p]] = t; } });
    const ag = tam.map(() => agNuevo());
    for (let i = 0; i < N; i++) agSuma(ag[de[i]], i, 1);

    /* … y se cambian alumnos de a dos mientras el reparto mejore */
    if (K > 1) {
      for (let vuelta = 0; vuelta < 40; vuelta++) {
        let mejoro = false;
        const oi = eqBarajar(idx.slice(), rnd);
        for (const i of oi) {
          for (const j of oi) {
            const a = de[i], b = de[j];
            if (a === b) continue;
            const antes = costoEquipo(ag[a], a) + costoEquipo(ag[b], b);
            agSuma(ag[a], i, -1); agSuma(ag[a], j, 1);
            agSuma(ag[b], j, -1); agSuma(ag[b], i, 1);
            let delta = costoEquipo(ag[a], a) + costoEquipo(ag[b], b) - antes;
            if (hayPares) {
              delta += pares(i, miembros[b], j) + pares(j, miembros[a], i)
                     - pares(i, miembros[a], -1) - pares(j, miembros[b], -1);
            }
            if (delta < -1e-9) {
              miembros[a][miembros[a].indexOf(i)] = j;
              miembros[b][miembros[b].indexOf(j)] = i;
              de[i] = b; de[j] = a;
              mejoro = true;
            } else {
              agSuma(ag[a], j, -1); agSuma(ag[a], i, 1);
              agSuma(ag[b], i, -1); agSuma(ag[b], j, 1);
            }
          }
        }
        if (!mejoro) break;
      }
    }

    let costo = 0;
    for (let t = 0; t < K; t++) {
      costo += costoEquipo(ag[t], t);
      if (hayPares) miembros[t].forEach(i => { costo += pares(i, miembros[t], -1) / 2; });
    }
    if (costo < mejorCosto - 1e-9) { mejorCosto = costo; mejor = miembros.map(g => g.slice()); }
  }

  /* Los equipos salen en orden al azar. Sin esto el número delataba el
     nivel: en «por nivel» el equipo de tres (el último hueco) caía siempre
     en una punta de las notas, y «el Equipo 11» pasaba a ser el de los que
     van mejor. Lo cazó la sonda. */
  const grupos = eqBarajar(mejor.map(g => g.map(i => alumnos[i].num).sort((x, y) => x - y)), rnd);
  return { grupos, costo: mejorCosto };
}

/* Qué tan parejos quedaron, CONTADO. Es lo que la pantalla le enseña al
   maestro debajo de los equipos; también lo usa la sonda. */
function eqMedir(grupos, alumnos, op) {
  op = op || {};
  const por = new Map(alumnos.map(a => [a.num, a]));
  const g = (grupos || []).map(t => t.map(n => por.get(n)).filter(Boolean)).filter(t => t.length);
  const tams = g.map(t => t.length);
  const res = { equipos: g.length, tamMin: tams.length ? Math.min(...tams) : 0, tamMax: tams.length ? Math.max(...tams) : 0 };

  const conSexo = alumnos.filter(a => a.sexo === 'F' || a.sexo === 'M').length;
  if (conSexo) {
    const fs = g.map(t => t.filter(a => a.sexo === 'F').length);
    const ms = g.map(t => t.filter(a => a.sexo === 'M').length);
    res.sexo = { fMin: Math.min(...fs), fMax: Math.max(...fs), mMin: Math.min(...ms), mMax: Math.max(...ms),
                 sinDato: alumnos.length - conSexo };
  }

  const conNota = alumnos.filter(a => typeof a.nivel === 'number' && isFinite(a.nivel));
  if (conNota.length >= 2) {
    const tercio = eqTercios(alumnos);
    const proms = [], rangos = [];
    let conAlto = 0, conAlguno = 0;
    g.forEach(t => {
      const xs = t.filter(a => a.num in tercio);
      if (!xs.length) return;
      conAlguno++;
      proms.push(xs.reduce((s, a) => s + a.nivel, 0) / xs.length);
      rangos.push(Math.max(...xs.map(a => a.nivel)) - Math.min(...xs.map(a => a.nivel)));
      if (xs.some(a => tercio[a.num] === 0)) conAlto++;
    });
    res.nivel = {
      grupo: Math.round(conNota.reduce((s, a) => s + a.nivel, 0) / conNota.length),
      promMin: Math.round(Math.min(...proms)), promMax: Math.round(Math.max(...proms)),
      rangoMax: Math.round(Math.max(...rangos)), conAlto, conAlguno,
      conNota: conNota.length,
    };
  }

  /* Una separación cuenta si entran por lo menos dos de los suyos. Queda
     «incumplida» si dos de ellos comparten equipo, y «no se puede» si son
     más que los equipos: cinco que no pueden estar juntos en cuatro
     equipos no caben, y eso se dice en vez de callarlo. */
  const seps = (op.separar || []).map(g => Array.isArray(g) ? g.map(Number).filter(n => por.has(n)) : [])
    .filter(g => g.length >= 2);
  if (seps.length) {
    const eqDe = {};
    (grupos || []).forEach((t, k) => t.forEach(n => { eqDe[n] = k; }));
    const juntos = g => {
      const vistos = new Set();
      return g.some(n => { const k = eqDe[n]; if (k == null) return false; if (vistos.has(k)) return true; vistos.add(k); return false; });
    };
    res.separar = {
      total: seps.length,
      juntas: seps.filter(juntos).length,
      noCaben: seps.filter(g => g.length > res.equipos).length,
    };
  }
  return res;
}

/* Llega un alumno a mitad de año y toma su número por orden alfabético:
   los de detrás se recorren. Los equipos guardados van por nº de lista,
   así que se recorren con ellos (lo llama adInsertarAlumno, igual que a
   la asistencia y a las notas). Sin esto, el equipo 3 pasaría a tener a
   otro niño sin que nadie lo tocara. */
function eqRecorrer(d, pos) {
  const e = d && d.equipos;
  if (!e || typeof e !== 'object') return;
  const mueve = n => (+n >= pos ? +n + 1 : +n);
  const reparto = txt => eqEscribirReparto(eqLeerReparto(txt).map(g => g.map(mueve)));
  if (e.reparto) e.reparto = reparto(e.reparto);
  if (e.antes) e.antes = reparto(e.antes);
  if (Array.isArray(e.separar)) e.separar = e.separar.map(g => Array.isArray(g) ? g.map(mueve) : g);
  if (e.fuera && Array.isArray(e.fuera.nums)) e.fuera.nums = e.fuera.nums.map(mueve);
}

/* ¿El nombre dice que es un alumno inventado? Solo SUGIERE marcarlo: la
   marca 🧪 saca al alumno también del informe del grado, así que la pone
   el maestro, nunca la máquina. */
function eqPareceDePrueba(nombre) {
  const n = String(nombre || '').trim();
  if (!n) return false;
  return /\b(prueba|pruebas|test|testing|ejemplo|demo|ficticio|ficticia|inventado|inventada)\b/i.test(n) ||
    /^(x+|asdf+|qwe+|aaa+)$/i.test(n);
}

if (typeof module === 'object' && module.exports) {
  module.exports = { eqRng, eqTamanos, eqTamanosTxt, eqLeerReparto, eqEscribirReparto,
    eqTercios, eqArmar, eqMedir, eqRecorrer, eqPareceDePrueba, eqLimpiarSeparar, EQ_PESO };
}

/* ═════════════ LA PANTALLA ═════════════ */

let _eqSel = null;          /* nº del alumno elegido para cambiarlo de equipo */

const EQ_NIVELES = {
  azar:    { ic: '🎲', t: 'Sin mirar las notas', s: 'Al azar, solo con lo de arriba.' },
  parejos: { ic: '⚖️', t: 'Parejos: en cada equipo hay de todo',
             s: 'Los que van adelante ayudan a los que van más despacio, y ningún equipo sale con ventaja.' },
  nivel:   { ic: '🎯', t: 'Por nivel: juntos los que van parecido',
             s: 'Para darle a cada equipo un trabajo a su medida. El número del equipo no dice cuál es cuál.' },
};

/* Cada separación, ordenada y sin repetidos; las de uno solo se caen.
   Las viejas eran parejas [a,b] y siguen valiendo tal cual. */
function eqLimpiarSeparar(v) {
  if (!Array.isArray(v)) return [];
  return v.filter(Array.isArray)
    .map(g => Array.from(new Set(g.map(Number).filter(n => n > 0))).sort((a, b) => a - b))
    .filter(g => g.length >= 2);
}

function eqDatos(d) {
  const e = (d.equipos && typeof d.equipos === 'object') ? d.equipos : {};
  const conf = Object.assign({ modo: 'tam', valor: 4, sexo: true, nivel: 'parejos', sinPrueba: true, sinAus: true },
    (e.conf && typeof e.conf === 'object') ? e.conf : {});
  const hoy = adHoy();
  return {
    conf,
    separar: eqLimpiarSeparar(e.separar),
    fuera: (e.fuera && e.fuera.f === hoy && Array.isArray(e.fuera.nums)) ? e.fuera.nums.map(Number) : [],
    reparto: String(e.reparto || ''), antes: String(e.antes || ''),
    t: String(e.t || ''), tAntes: String(e.tAntes || ''), mano: !!e.mano,
  };
}
/* Cambia d.equipos y guarda. Se lee y se escribe el grupo en el momento:
   nunca uno viejo guardado en una variable de la pantalla. */
function eqGuardar(fn) {
  const dd = adLoad();
  const e = (dd.equipos && typeof dd.equipos === 'object') ? Object.assign({}, dd.equipos) : {};
  fn(e, dd);
  dd.equipos = e;
  adSave(dd);
  return dd;
}

function eqNombre(a) {
  const n = String((a && a.nombre) || '').trim();
  return n || ('Alumno n.º ' + (a ? a.num : '?'));
}
function eqAusHoy(d) {
  const r = (d.asistencia || []).find(x => x.f === adHoy());
  return (r && r.aus) || {};
}
function eqNivelDe(d, num) {
  if (typeof estSace !== 'function') return null;
  try { const p = estSace(d, num).promGen; return typeof p === 'number' ? p : null; }
  catch (_) { return null; }
}

/* Quién entra hoy y por qué se queda fuera cada uno de los demás */
function eqQuien(d, x) {
  const aus = eqAusHoy(d);
  const fuera = new Set(x.fuera);
  const dentro = [], afuera = [];
  (d.lista || []).forEach(a => {
    let por = '';
    if (x.conf.sinPrueba && adEsPrueba(a)) por = 'prueba';
    else if (x.conf.sinAus && aus[a.num]) por = aus[a.num] === 'E' ? 'excusa' : 'falto';
    else if (fuera.has(+a.num)) por = 'mano';
    (por ? afuera : dentro).push({ a, por });
  });
  return { dentro: dentro.map(o => o.a), afuera, aus };
}
const EQ_POR = { prueba: '🧪 de prueba', falto: '🚫 faltó hoy', excusa: '📝 con excusa hoy', mano: '✋ fuera hoy' };

function eqAlumnosParaArmar(d, dentro) {
  return dentro.map(a => ({ num: +a.num, sexo: a.sexo === 'F' || a.sexo === 'M' ? a.sexo : '', nivel: eqNivelDe(d, a.num) }));
}

/* ── la pantalla entera de la pestaña ── */
function adRenderEquipos(body, d) {
  _eqSel = null;
  body.innerHTML = `
    <div class="pa-card eq-card-conf">
      <div class="pa-card-title">🤝 Equipos de trabajo</div>
      <p class="eq-intro">Arma los equipos en un toque: del mismo tamaño, con niñas y varones
        mezclados y, si ya tienes notas, con de todo en cada equipo. Nadie escoge a nadie, así que
        nadie se queda de último.</p>
      <div id="eq-quien"></div>
      <div id="eq-cuantos"></div>
      <div id="eq-como"></div>
      <button class="pa-generate-btn eq-armar" id="eq-armar"></button>
    </div>
    <div id="eq-res"></div>`;
  eqPintarQuien(body, d);
  eqPintarCuantos(body, d);
  eqPintarComo(body, d);
  eqPintarBoton(body, d);
  eqPintarRes(body, d);
  document.getElementById('eq-armar').addEventListener('click', () => eqArmarAhora(body));
}

/* Vuelve a pintar UN pedazo sin perder el foco (el que usa teclado se
   quedaba en el <body> después de cada casilla). */
function eqRepintar(body, id) {
  const act = document.activeElement && document.activeElement.id;
  /* y el cajón que el maestro abrió sigue abierto: quitar la última pareja
     no puede cerrarle el cajón donde estaba trabajando */
  const abiertos = [...body.querySelectorAll('details[open][id]')].map(x => x.id);
  const d = adLoad();
  if (id === 'eq-quien') eqPintarQuien(body, d);
  else if (id === 'eq-cuantos') eqPintarCuantos(body, d);
  else if (id === 'eq-como') eqPintarComo(body, d);
  else if (id === 'eq-res') eqPintarRes(body, d);
  abiertos.forEach(k => { const x = document.getElementById(k); if (x) x.open = true; });
  if (act) { const el = document.getElementById(act); if (el && el !== document.activeElement) try { el.focus({ preventScroll: true }); } catch (_) {} }
}
/* Lo que depende de CUÁNTOS entran: la cuenta, el tamaño y los equipos */
function eqRefrescarTodo(body) {
  eqRepintar(body, 'eq-quien');
  eqRepintar(body, 'eq-cuantos');
  eqRepintar(body, 'eq-como');
  eqPintarBoton(body, adLoad());
  eqRepintar(body, 'eq-res');
}

function eqPintarQuien(body, d) {
  const cont = body.querySelector('#eq-quien');
  if (!cont) return;
  const x = eqDatos(d);
  const q = eqQuien(d, x);
  const pruebas = (d.lista || []).filter(adEsPrueba);
  const ausNums = Object.keys(q.aus).map(Number).filter(n => (d.lista || []).some(a => +a.num === n));
  const nomDe = n => { const a = (d.lista || []).find(z => +z.num === +n); return a ? eqNombre(a) : '#' + n; };
  const sospechosos = (d.lista || []).filter(a => !adEsPrueba(a) && eqPareceDePrueba(a.nombre));
  const libres = (d.lista || []).filter(a => !(x.conf.sinPrueba && adEsPrueba(a)) && !(x.conf.sinAus && q.aus[a.num]));
  const aMano = q.afuera.filter(o => o.por === 'mano').length;
  const total = (d.lista || []).length;

  cont.innerHTML = `
    <div class="ad-bit-lbl">¿Quiénes entran?</div>
    <p class="eq-cuenta" id="eq-cuenta">${total
      ? `<strong>${q.dentro.length}</strong> de ${total} alumnos entran${q.afuera.length ? ' · ' + q.afuera.length + ' se quedan fuera' : ''}`
      : 'Todavía no tienes alumnos en este grupo. Escríbelos en <strong>👥 Alumnos</strong>.'}</p>
    <label class="ad-bit-sw eq-sw">
      <input type="checkbox" id="eq-sin-prueba" ${x.conf.sinPrueba ? 'checked' : ''} ${pruebas.length ? '' : 'disabled'}>
      <span>🧪 <strong>Sin los alumnos de prueba</strong>
        <small class="eq-sub">${pruebas.length
          ? pruebas.map(a => '#' + a.num + ' ' + adEsc(eqNombre(a))).join(' · ')
          : 'No tienes ninguno marcado de prueba.'}</small></span>
    </label>
    ${sospechosos.map(a => `
    <div class="eq-sug">
      <span>¿<strong>${adEsc(eqNombre(a))}</strong> (#${a.num}) es un alumno inventado para probar?</span>
      <button class="pa-generate-btn ad-btn-sec eq-sug-btn" data-eqprueba="${a.num}">🧪 Sí, es de prueba</button>
    </div>`).join('')}
    ${!pruebas.length && !sospechosos.length ? `<p class="eq-nota">¿Tienes uno inventado para probar la
      plataforma? Márcalo de prueba en <button class="eq-link" id="eq-ir-est">📈 Estadísticas</button>: queda
      fuera de los equipos y también del informe del grado.</p>` : ''}
    <label class="ad-bit-sw eq-sw">
      <input type="checkbox" id="eq-sin-aus" ${x.conf.sinAus ? 'checked' : ''} ${ausNums.length ? '' : 'disabled'}>
      <span>🚫 <strong>Sin los que faltaron hoy</strong>
        <small class="eq-sub">${ausNums.length
          ? ausNums.map(n => '#' + n + ' ' + adEsc(nomDe(n))).join(' · ')
          : 'Hoy no hay nadie marcado en 📋 Asistencia. Si pasas lista antes de armar, los que faltaron quedan fuera solos.'}</small></span>
    </label>
    <details class="eq-det" id="eq-det-fuera" ${aMano ? 'open' : ''}>
      <summary>✋ Dejar fuera a alguien más, solo por hoy${aMano ? ' (' + aMano + ')' : ''}</summary>
      <p class="eq-nota">Toca a quien no va a estar en los equipos: el que salió a una comisión, el que
        está en la dirección. Mañana vuelve a entrar solo.</p>
      <div class="ad-chips">
        ${libres.map(a => {
          const fuera = x.fuera.includes(+a.num);
          return `<button class="ad-chip eq-chip${fuera ? ' eq-chip-fuera' : ''}" data-eqfuera="${a.num}"
            aria-pressed="${fuera ? 'true' : 'false'}"
            aria-label="${adEsc(eqNombre(a))}: ${fuera ? 'fuera hoy. Tócalo para que vuelva a entrar' : 'entra. Tócalo para dejarlo fuera hoy'}">
            <span class="ad-chip-num">#${a.num}</span>
            <span class="ad-chip-nom">${adEsc(adPrimerNombre(a.nombre) || 'sin nombre')}</span>
            ${fuera ? '<span class="eq-chip-tag">fuera</span>' : ''}
          </button>`;
        }).join('')}
      </div>
    </details>`;

  cont.querySelector('#eq-sin-prueba').addEventListener('change', e => {
    eqGuardar(ee => { ee.conf = Object.assign({}, eqDatos(adLoad()).conf, { sinPrueba: e.target.checked }); });
    eqRefrescarTodo(body);
  });
  cont.querySelector('#eq-sin-aus').addEventListener('change', e => {
    eqGuardar(ee => { ee.conf = Object.assign({}, eqDatos(adLoad()).conf, { sinAus: e.target.checked }); });
    eqRefrescarTodo(body);
  });
  cont.querySelectorAll('[data-eqprueba]').forEach(b => b.addEventListener('click', async () => {
    const num = +b.dataset.eqprueba;
    const a = (adLoad().lista || []).find(z => +z.num === num);
    if (!await metasConfirm('¿Marcar a **' + eqNombre(a) + '** (#' + num + ') como alumno de prueba?\n\n' +
      'Deja de contar en el **informe del grado** y de entrar en los equipos. Sus notas y su asistencia ' +
      'no se borran, y la marca se quita en 📈 Estadísticas cuando quieras.',
      { icono: '🧪', titulo: 'Alumno de prueba', okTxt: 'Sí, es de prueba' })) return;
    adTogglePrueba(num);
    eqRefrescarTodo(body);
    toast('🧪 ' + eqNombre(a) + ' quedó marcado de prueba');
  }));
  const irEst = cont.querySelector('#eq-ir-est');
  if (irEst) irEst.addEventListener('click', () => { _adTab = 'est'; renderAdmin(); });
  cont.querySelectorAll('[data-eqfuera]').forEach(b => b.addEventListener('click', () => {
    const num = +b.dataset.eqfuera;
    eqGuardar(ee => {
      const xx = eqDatos(adLoad());
      const s = new Set(xx.fuera);
      if (s.has(num)) s.delete(num); else s.add(num);
      ee.fuera = { f: adHoy(), nums: [...s].sort((p, q2) => p - q2) };
    });
    /* el foco vuelve al mismo chip (el cajón lo deja abierto eqRepintar) */
    eqRefrescarTodo(body);
    const mismo = body.querySelector('[data-eqfuera="' + num + '"]');
    if (mismo) try { mismo.focus({ preventScroll: true }); } catch (_) {}
  }));
}

/* El tamaño que se pidió, dentro de lo que se puede con los que entran HOY.
   La pantalla y el botón de armar lo leen de aquí: si cada uno lo acotara
   a su manera, el aviso diría «8 equipos» y saldrían 9. */
const EQ_TAM_MAX = 15;
function eqValor(conf, n) {
  const modo = conf.modo === 'num' ? 'num' : 'tam';
  const max = modo === 'num' ? Math.max(1, Math.floor(n / EQ_TAM_MIN)) : Math.max(EQ_TAM_MIN, Math.min(EQ_TAM_MAX, n));
  const min = modo === 'num' ? Math.min(2, max) : EQ_TAM_MIN;
  const valor = Math.max(min, Math.min(max, Math.floor(+conf.valor || (modo === 'num' ? 6 : 4))));
  return { modo, valor, min, max };
}

function eqPintarCuantos(body, d) {
  const cont = body.querySelector('#eq-cuantos');
  if (!cont) return;
  const x = eqDatos(d);
  const n = eqQuien(d, x).dentro.length;
  const { modo, valor, min, max } = eqValor(x.conf, n);
  const tams = eqTamanos(n, modo, valor);
  cont.innerHTML = `
    <div class="ad-bit-lbl">¿De cuántos?</div>
    <div class="eq-seg" role="group" aria-label="Cómo quieres decir el tamaño">
      <button class="eq-seg-btn${modo === 'tam' ? ' eq-seg-on' : ''}" data-eqmodo="tam" aria-pressed="${modo === 'tam'}">👥 Alumnos por equipo</button>
      <button class="eq-seg-btn${modo === 'num' ? ' eq-seg-on' : ''}" data-eqmodo="num" aria-pressed="${modo === 'num'}">🔢 Cuántos equipos</button>
    </div>
    <div class="eq-paso">
      <button class="eq-paso-btn" id="eq-menos" aria-label="Uno menos" ${valor <= min ? 'disabled' : ''}>−</button>
      <span class="eq-paso-val" aria-live="polite"><strong id="eq-valor">${valor}</strong>
        <small>${modo === 'num' ? 'equipos' : 'por equipo'}</small></span>
      <button class="eq-paso-btn" id="eq-mas" aria-label="Uno más" ${valor >= max ? 'disabled' : ''}>+</button>
    </div>
    <p class="eq-prev" id="eq-prev">${n >= 2 ? '→ ' + eqTamanosTxt(tams) +
      (modo === 'tam' && Math.max(...tams) > valor ? ' <small>(uno de ' + Math.max(...tams) + ' para que nadie quede solo)</small>' : '')
      : 'Hacen falta por lo menos dos alumnos para armar equipos.'}</p>`;
  const poner = cambio => {
    eqGuardar(ee => { ee.conf = Object.assign({}, eqDatos(adLoad()).conf, cambio); });
    eqRepintar(body, 'eq-cuantos');
  };
  cont.querySelectorAll('[data-eqmodo]').forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.eqmodo;
    if (m === modo) return;
    /* al cambiar de forma se ofrece un número parecido al de ahora, no uno
       que no tiene nada que ver con lo que el maestro estaba viendo */
    const k = tams.length;
    poner({ modo: m, valor: m === 'num' ? k : (tams[0] || 4) });
  }));
  cont.querySelector('#eq-menos').addEventListener('click', () => poner({ valor: valor - 1 }));
  cont.querySelector('#eq-mas').addEventListener('click', () => poner({ valor: valor + 1 }));
}

function eqPintarComo(body, d) {
  const cont = body.querySelector('#eq-como');
  if (!cont) return;
  const x = eqDatos(d);
  const q = eqQuien(d, x);
  const f = q.dentro.filter(a => a.sexo === 'F').length, m = q.dentro.filter(a => a.sexo === 'M').length;
  const sin = q.dentro.length - f - m;
  const conNota = q.dentro.filter(a => eqNivelDe(d, a.num) != null).length;
  const hayNotas = conNota >= 2;
  const nivel = hayNotas ? (EQ_NIVELES[x.conf.nivel] ? x.conf.nivel : 'parejos') : 'azar';
  const nomDe = n => { const a = (d.lista || []).find(z => +z.num === +n); return a ? eqNombre(a) : '#' + n; };
  const enLista = n => (d.lista || []).some(a => +a.num === +n);
  const seps = x.separar.map(g => g.filter(enLista)).filter(g => g.length >= 2);
  /* cuántos equipos van a salir hoy: una separación de más alumnos que
     equipos no se puede cumplir, y se avisa antes de armar */
  const vv = eqValor(x.conf, q.dentro.length);
  const kHoy = q.dentro.length >= 2 ? eqTamanos(q.dentro.length, vv.modo, vv.valor).length : 0;
  const dentroSet = new Set(q.dentro.map(a => +a.num));
  const nombres = g => g.map(n => adEsc(nomDe(n)));
  const juntaY = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' <span class="eq-sep-x">y</span> ' + xs[xs.length - 1];

  cont.innerHTML = `
    <div class="ad-bit-lbl">¿Cómo los reparto?</div>
    <label class="ad-bit-sw eq-sw">
      <input type="checkbox" id="eq-sexo" ${x.conf.sexo && (f || m) ? 'checked' : ''} ${f || m ? '' : 'disabled'}>
      <span>♀♂ <strong>Niñas y varones mezclados</strong>
        <small class="eq-sub">${f || m
          ? 'Entran ' + f + (f === 1 ? ' niña' : ' niñas') + ' y ' + m + (m === 1 ? ' varón' : ' varones') + '.' +
            (sin ? ' A ' + sin + ' les falta anotar si son niña o varón: van donde toque.' : '')
          : 'Todavía no anotas quién es niña y quién varón.'}</small></span>
    </label>
    ${sin ? `<p class="eq-nota">Se anota en <button class="eq-link" id="eq-ir-fichas">🗂️ Identidad y
      contactos</button>, dentro de 👥 Alumnos: un toque por alumno.</p>` : ''}
    <p class="eq-nota eq-nota-lead">📊 <strong>Y con las notas</strong>: ${hayNotas
      ? 'hay promedio de Notas SACE de ' + conNota + ' de ' + q.dentro.length + ' alumnos' +
        (conNota < q.dentro.length ? '; los que todavía no tienen van donde toque.' : '.')
      : 'cuando tengas notas en 🧮 Notas SACE, podrás armarlos parejos o por nivel.'}</p>
    <div class="eq-niveles" role="radiogroup" aria-label="Qué hacer con las notas">
      ${['parejos', 'nivel', 'azar'].map(k => `
      <label class="ad-bit-sw eq-sw">
        <input type="radio" name="eq-nivel" value="${k}" ${nivel === k ? 'checked' : ''} ${hayNotas || k === 'azar' ? '' : 'disabled'}>
        <span>${EQ_NIVELES[k].ic} <strong>${EQ_NIVELES[k].t}</strong>
          <small class="eq-sub">${EQ_NIVELES[k].s}</small></span>
      </label>`).join('')}
    </div>
    ${hayNotas ? `<p class="eq-nota">🔒 Las notas no salen en los equipos: ni en la pantalla, ni en el
      papel, ni en WhatsApp.</p>` : ''}
    <details class="eq-det" id="eq-det-sep" ${seps.length ? 'open' : ''}>
      <summary>🚫 Que no queden juntos${seps.length ? ' (' + seps.length + ')' : ''}</summary>
      <p class="eq-nota">Los dos que pelean, los tres que no paran de platicar, los hermanos. Cada
        uno va en un equipo distinto. Se guarda para las próximas veces.</p>
      ${seps.map((g, i) => {
        const hoy = g.filter(n => dentroSet.has(n)).length;
        return `
      <div class="eq-sep-fila">
        <span>${juntaY(nombres(g))}${hoy > kHoy && kHoy ? `
          <small class="eq-sep-aviso">⚠️ Hoy salen ${kHoy} equipos para ${hoy}: dos de ellos van a quedar juntos</small>` : ''}</span>
        <button class="eq-sep-quitar" data-eqsepq="${i}" aria-label="Ya pueden estar juntos: ${nombres(g).join(', ')}">✕</button>
      </div>`; }).join('')}
      ${(d.lista || []).length >= 2 ? `
      <p class="eq-nota eq-nota-lead">Toca a los que no pueden quedar juntos, dos o más:</p>
      <div class="eq-sep-elige" role="group" aria-label="Los que no pueden quedar juntos">
        ${(d.lista || []).map(a => `<button class="eq-sep-al" aria-pressed="false" data-eqsepal="${a.num}">${adEsc(eqNombre(a))}</button>`).join('')}
      </div>
      <button class="pa-generate-btn ad-btn-sec eq-sep-guardar" id="eq-sep-add" disabled>🚫 Toca a dos o más</button>` : ''}
    </details>`;

  const sexo = cont.querySelector('#eq-sexo');
  sexo.addEventListener('change', () => {
    eqGuardar(ee => { ee.conf = Object.assign({}, eqDatos(adLoad()).conf, { sexo: sexo.checked }); });
  });
  cont.querySelectorAll('input[name="eq-nivel"]').forEach(r => r.addEventListener('change', () => {
    if (!r.checked) return;
    eqGuardar(ee => { ee.conf = Object.assign({}, eqDatos(adLoad()).conf, { nivel: r.value }); });
  }));
  const irF = cont.querySelector('#eq-ir-fichas');
  if (irF) irF.addEventListener('click', () => { _adTab = 'lista'; _adFichasOn = 1; renderAdmin(); });
  /* Elegir no repinta nada: el chip cambia solo, y el botón dice cuántos
     van. Repintar a cada toque le movería la lista de debajo del dedo. */
  const add = cont.querySelector('#eq-sep-add');
  const elegidos = () => Array.from(cont.querySelectorAll('.eq-sep-al[aria-pressed="true"]')).map(b => +b.dataset.eqsepal);
  const ponBoton = () => {
    const n = elegidos().length;
    add.disabled = n < 2;
    add.textContent = n < 2 ? (n ? '🚫 Toca a uno más' : '🚫 Toca a dos o más')
      : '🚫 Que estos ' + n + ' no queden juntos';
  };
  cont.querySelectorAll('[data-eqsepal]').forEach(b => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    ponBoton();
  }));
  const igual = (a, b) => a.length === b.length && a.every((n, i) => n === b[i]);
  if (add) add.addEventListener('click', () => {
    const g = eqLimpiarSeparar([elegidos()])[0];
    if (!g) { toast('Toca a dos alumnos o más'); return; }
    let nuevo = false;
    eqGuardar(ee => {
      const ya = eqDatos(adLoad()).separar;
      if (ya.some(p => igual(p, g))) return;
      ee.separar = ya.concat([g]); nuevo = true;
    });
    eqRepintar(body, 'eq-como');
    eqRepintar(body, 'eq-res');
    /* con muchos, los nombres no caben en el aviso: se dice cuántos */
    toast(nuevo ? '🚫 Listo: ' + (g.length <= 3 ? g.map(nomDe).join(', ') : 'estos ' + g.length) + ' irán en equipos distintos'
                : 'Esos ya estaban separados');
  });
  cont.querySelectorAll('[data-eqsepq]').forEach(b => b.addEventListener('click', () => {
    const quita = seps[+b.dataset.eqsepq];
    eqGuardar(ee => {
      /* se quita la separación que se ve; los de la lista que ya no están
         (dados de baja) no cuentan al compararla */
      ee.separar = eqDatos(adLoad()).separar.filter(p => !igual(p.filter(enLista), quita));
    });
    eqRepintar(body, 'eq-como');
    eqRepintar(body, 'eq-res');
  }));
}

function eqPintarBoton(body, d) {
  const b = body.querySelector('#eq-armar');
  if (!b) return;
  const x = eqDatos(d);
  const n = eqQuien(d, x).dentro.length;
  b.disabled = n < 2;
  b.textContent = x.reparto ? '🎲 Armar otros equipos' : '🎲 Armar los equipos';
}

function eqArmarAhora(body) {
  const d = adLoad();
  const x = eqDatos(d);
  const q = eqQuien(d, x);
  if (q.dentro.length < 2) { toast('Hacen falta por lo menos dos alumnos'); return; }
  const { modo, valor } = eqValor(x.conf, q.dentro.length);
  const tams = eqTamanos(q.dentro.length, modo, valor);
  const alumnos = eqAlumnosParaArmar(d, q.dentro);
  const hayNotas = alumnos.filter(a => a.nivel != null).length >= 2;
  const r = eqArmar(alumnos, {
    tamanos: tams,
    sexo: x.conf.sexo,
    nivel: hayNotas ? x.conf.nivel : 'azar',
    separar: x.separar,
    antes: eqLeerReparto(x.reparto),
  });
  const ahora = new Date().toISOString();
  eqGuardar(ee => {
    if (x.reparto) { ee.antes = x.reparto; ee.tAntes = x.t; }
    ee.reparto = eqEscribirReparto(r.grupos);
    ee.t = ahora; ee.mano = false;
  });
  _eqSel = null;
  eqPintarBoton(body, adLoad());
  eqRepintar(body, 'eq-res');
  const res = body.querySelector('#eq-res');
  if (res && res.scrollIntoView) try { res.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
  toast('🤝 Listos: ' + eqTamanosTxt(tams));
}

/* «hoy a las 9:14» · «ayer» · «el 29/09» */
function eqCuando(iso) {
  if (!iso) return '';
  const dt = new Date(iso);
  if (isNaN(dt)) return '';
  const f = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  const hora = dt.getHours() + ':' + String(dt.getMinutes()).padStart(2, '0');
  if (f === adHoy()) return 'hoy a las ' + hora;
  return 'el ' + adFechaBonita(f).slice(0, 5);
}

/* Los equipos guardados, leídos contra la lista de HOY: el que ya no
   está en la lista no sale; el que hoy no entra sale tachado con su
   motivo; el que entra y no tiene equipo va aparte, para ponerlo. */
function eqEquiposDeHoy(d, x) {
  const q = eqQuien(d, x);
  const porNum = new Map((d.lista || []).map(a => [+a.num, a]));
  const motivo = new Map(q.afuera.map(o => [+o.a.num, o.por]));
  const grupos = eqLeerReparto(x.reparto).map(g => g.filter(n => porNum.has(n)).map(n => ({
    a: porNum.get(n), por: motivo.get(n) || '' })));
  const conEquipo = new Set(eqLeerReparto(x.reparto).flat());
  const sinEquipo = q.dentro.filter(a => !conEquipo.has(+a.num));
  return { grupos, sinEquipo, q };
}

function eqPintarRes(body, d) {
  const cont = body.querySelector('#eq-res');
  if (!cont) return;
  const x = eqDatos(d);
  if (!x.reparto) { cont.innerHTML = ''; return; }
  const { grupos, sinEquipo, q } = eqEquiposDeHoy(d, x);
  const sel = _eqSel;
  const equipoDeSel = sel == null ? -2 : (sinEquipo.some(a => +a.num === sel) ? -1
    : grupos.findIndex(g => g.some(o => +o.a.num === sel)));

  const alumnoBtn = (o, k) => {
    const n = +o.a.num;
    const es = sel === n;
    return `<button class="eq-al${es ? ' eq-al-sel' : ''}${o.por ? ' eq-al-fuera' : ''}" data-eqal="${n}" data-eqk="${k}"
      aria-pressed="${es ? 'true' : 'false'}"
      aria-label="${adEsc(eqNombre(o.a))}${o.por ? ', ' + EQ_POR[o.por] : ''}. ${es ? 'Elegido: toca a otro para que cambien.' : 'Tócalo para cambiarlo de equipo.'}">
      ${es ? '<span class="eq-al-mano" aria-hidden="true">✋</span>' : ''}<span class="eq-al-num">#${n}</span>
      <span class="eq-al-nom">${adEsc(eqNombre(o.a))}</span>
      ${o.por ? `<span class="eq-tag">${EQ_POR[o.por]}</span>` : ''}
    </button>`;
  };
  const pasar = k => (sel != null && equipoDeSel !== k)
    ? `<button class="eq-pasar" data-eqpasar="${k}">⬇️ Pasar aquí</button>` : '';

  const hoyCuenta = g => g.filter(o => !o.por).length;
  const medida = eqMedir(grupos.map(g => g.filter(o => !o.por).map(o => +o.a.num)),
    eqAlumnosParaArmar(d, q.dentro), { separar: x.separar });

  cont.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">🤝 Tus equipos <span class="eq-cuando">armados ${adEsc(eqCuando(x.t))}${x.mano ? ' · con tus cambios' : ''}</span></div>
      <p class="eq-nota">✋ ¿Cambiar a alguien? <strong>Tócalo y después toca a otro</strong>: cambian de
        equipo. O toca <strong>«Pasar aquí»</strong> en el equipo al que lo quieras llevar.</p>
      <div class="eq-grid">
        ${grupos.map((g, k) => `
        <section class="eq-eq eq-c${k % 10}" aria-label="Equipo ${k + 1}">
          <div class="eq-eq-h"><span class="eq-eq-t">Equipo ${k + 1}</span>
            <span class="eq-eq-n">${hoyCuenta(g) === g.length ? g.length : 'hoy ' + hoyCuenta(g) + ' de ' + g.length}</span></div>
          <div class="eq-eq-al">${g.length ? g.map(o => alumnoBtn(o, k)).join('') : '<p class="eq-vacio">Sin nadie</p>'}</div>
          ${pasar(k)}
        </section>`).join('')}
        ${sinEquipo.length ? `
        <section class="eq-eq eq-eq-sin" aria-label="Sin equipo">
          <div class="eq-eq-h"><span class="eq-eq-t">🆕 Sin equipo</span><span class="eq-eq-n">${sinEquipo.length}</span></div>
          <p class="eq-nota">Entraron después de armarlos. Tócalos y pásalos a un equipo, o arma otros.</p>
          <div class="eq-eq-al">${sinEquipo.map(a => alumnoBtn({ a, por: '' }, -1)).join('')}</div>
        </section>` : ''}
      </div>
      ${eqMedidaHtml(medida, x)}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="eq-copiar">📋 Copiar para WhatsApp</button>
        <button class="pa-generate-btn ad-btn-sec" id="eq-imprimir">🖨️ Imprimir</button>
        ${x.antes ? '<button class="pa-generate-btn ad-btn-sec" id="eq-antes">↩️ Los de antes</button>' : ''}
      </div>
    </div>`;

  cont.querySelectorAll('[data-eqal]').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.eqal, k = +b.dataset.eqk;
    if (_eqSel == null || _eqSel === n) { _eqSel = _eqSel === n ? null : n; eqRepintarRes(body, n); return; }
    const kSel = equipoDeSel;
    if (kSel === k) { _eqSel = n; eqRepintarRes(body, n); return; }   /* mismo equipo: se cambia de elegido */
    eqCambiar(_eqSel, n);
    _eqSel = null;
    eqRepintarRes(body, n);
  }));
  cont.querySelectorAll('[data-eqpasar]').forEach(b => b.addEventListener('click', () => {
    const k = +b.dataset.eqpasar, n = _eqSel;
    eqPasar(n, k);
    _eqSel = null;
    eqRepintarRes(body, n);
  }));
  cont.querySelector('#eq-copiar').addEventListener('click', () => {
    adCopiar(eqTexto(adLoad()), () => toast('📋 Copiado: pégalo en el grupo de WhatsApp'),
      () => toast('No se pudo copiar'));
  });
  cont.querySelector('#eq-imprimir').addEventListener('click', () => eqImprimir(adLoad()));
  const antes = cont.querySelector('#eq-antes');
  if (antes) antes.addEventListener('click', () => {
    eqGuardar(ee => {
      const xx = eqDatos(adLoad());
      ee.reparto = xx.antes; ee.antes = xx.reparto;
      ee.t = xx.tAntes || xx.t; ee.tAntes = xx.t; ee.mano = false;
    });
    _eqSel = null;
    eqRepintar(body, 'eq-res');
    toast('↩️ Volvieron los equipos de antes');
  });
}
/* Repinta los equipos y devuelve el foco al mismo alumno: el maestro está
   a mitad de la lista y un salto le quita de debajo del dedo lo que iba a
   tocar (la regla de la barra de grupos y de la cola de avisos). */
function eqRepintarRes(body, num) {
  eqPintarRes(body, adLoad());
  const b = body.querySelector('[data-eqal="' + num + '"]');
  if (b) try { b.focus({ preventScroll: true }); } catch (_) {}
}

function eqMedidaHtml(m, x) {
  const L = [];
  if (!m.equipos) return '';
  L.push('👥 ' + (m.tamMin === m.tamMax ? 'Todos de ' + m.tamMax : 'De ' + m.tamMin + ' y de ' + m.tamMax + ' alumnos') +
    (m.tamMax - m.tamMin > 1 ? (x.mano ? ': con tus cambios, unos quedaron más grandes que otros'
      : ': por los que hoy no están. Si quieres, arma otros') : ''));
  if (m.sexo && x.conf.sexo) {
    const r = (a, b) => a === b ? String(a) : 'de ' + a + ' a ' + b;
    L.push('♀♂ Niñas por equipo: ' + r(m.sexo.fMin, m.sexo.fMax) + ' · varones: ' + r(m.sexo.mMin, m.sexo.mMax));
  }
  if (m.nivel && x.conf.nivel === 'parejos') {
    L.push(m.nivel.promMin === m.nivel.promMax
      ? '⚖️ Todos los equipos quedaron con el mismo promedio: ' + m.nivel.promMin + ' (el del grupo es ' + m.nivel.grupo + ')'
      : '⚖️ El promedio de cada equipo queda entre ' + m.nivel.promMin + ' y ' + m.nivel.promMax +
        ' (el del grupo es ' + m.nivel.grupo + ')');
    L.push('⭐ ' + m.nivel.conAlto + ' de ' + m.equipos + ' equipos tienen a alguien de los que van mejor');
  } else if (m.nivel && x.conf.nivel === 'nivel') {
    L.push('🎯 Dentro de cada equipo, las notas se separan a lo más ' + m.nivel.rangoMax + ' puntos');
  }
  if (m.separar) {
    const j = m.separar.juntas;
    L.push(j
      ? '⚠️ ' + (m.separar.total === 1 ? 'Dos de los que separaste quedaron juntos'
        : 'En ' + j + ' de tus ' + m.separar.total + ' separaciones quedaron dos juntos') +
        (m.equipos < 2 ? ': con un solo equipo no se puede'
          : m.separar.noCaben ? ': son más que los equipos, así que alguien tiene que repetir'
          : ': arma otros o cámbialos a mano')
      : '🚫 Los que separaste quedaron cada uno en un equipo distinto');
  }
  return `<div class="eq-medida"><div class="eq-medida-t">📏 Cómo quedaron</div>
    <ul>${L.map(t => '<li>' + adEsc(t) + '</li>').join('')}</ul></div>`;
}

/* Cambia a dos alumnos de equipo (o mete al que no tenía equipo en el
   lugar del otro, que queda sin equipo). */
function eqCambiar(n1, n2) {
  eqGuardar(ee => {
    const xx = eqDatos(adLoad());
    const gs = eqLeerReparto(xx.reparto);
    const donde = n => { for (let k = 0; k < gs.length; k++) { const i = gs[k].indexOf(n); if (i >= 0) return [k, i]; } return null; };
    const p1 = donde(n1), p2 = donde(n2);
    if (p1 && p2) { gs[p1[0]][p1[1]] = n2; gs[p2[0]][p2[1]] = n1; }
    else if (p1 && !p2) { gs[p1[0]][p1[1]] = n2; }
    else if (!p1 && p2) { gs[p2[0]][p2[1]] = n1; }
    gs.forEach(g => g.sort((a, b) => a - b));
    ee.reparto = eqEscribirReparto(gs); ee.mano = true;
  });
}
/* Lleva a un alumno al equipo k (el suyo queda con uno menos) */
function eqPasar(n, k) {
  eqGuardar(ee => {
    const xx = eqDatos(adLoad());
    const gs = eqLeerReparto(xx.reparto);
    if (!gs[k]) return;
    gs.forEach(g => { const i = g.indexOf(n); if (i >= 0) g.splice(i, 1); });
    gs[k].push(n);
    gs.forEach(g => g.sort((a, b) => a - b));
    /* un equipo que se quedó vacío se quita: el número siguiente sube */
    ee.reparto = eqEscribirReparto(gs.filter(g => g.length)); ee.mano = true;
  });
}

/* Lo que sale del teléfono (WhatsApp y papel) son los equipos de HOY:
   sin el de prueba, sin el que faltó, sin el que se dejó fuera. */
function eqListaParaSacar(d) {
  const x = eqDatos(d);
  const { grupos } = eqEquiposDeHoy(d, x);
  return grupos.map(g => g.filter(o => !o.por).map(o => o.a));
}
function eqFechaLarga() {
  const dt = new Date();
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[dt.getDay()] + ' ' + adFechaBonita(adHoy()).slice(0, 5);
}
function eqTexto(d) {
  const grupo = adGradoSeccion(d.grado, d.seccion);
  const gs = eqListaParaSacar(d);
  return '🤝 *Equipos de trabajo' + (grupo ? ' de ' + grupo : '') + '* · ' + eqFechaLarga() + '\n\n' +
    gs.map((g, k) => '*Equipo ' + (k + 1) + ':* ' + (g.length ? g.map(eqNombre).join(', ') : 'nadie hoy')).join('\n');
}

/* Una hoja carta: para pegar en la pizarra o recortar y darle a cada
   equipo su tira. Sin notas, sin marcas de nivel.

   La letra NO se escribe: se busca. Van de dos equipos de 22 a 21
   parejas, y los nombres de aquí son de cuatro apellidos: la letra que
   llena bien la hoja con ocho equipos de cinco parte la de las parejas
   en dos. Se prueba de mayor a menor (EQ_LETRAS) y se queda la más
   grande con la que la hoja mide 248 mm o menos —el colchón de siempre,
   para que quepa aunque el navegador ponga sus propios márgenes—. Es la
   regla de la lectura proyectada: con pocos nombres la hoja se lee
   desde el fondo del aula, pegada en la pizarra. Lo cuenta la sonda en
   las páginas del PDF, en el peor caso. */
const EQ_LETRAS = [18, 16, 14.5, 13, 12, 11, 10];
function eqImprimir(d) {
  const gs = eqListaParaSacar(d);
  const grupo = adGradoSeccion(d.grado, d.seccion);
  const esc = d.escuela ? String(d.escuela).trim() : '';
  /* con dos equipos, dos columnas anchas: en tres, los nombres largos
     se partían en dos renglones y la mitad de la hoja quedaba vacía */
  const cols = Math.max(1, Math.min(3, gs.length));
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Equipos de trabajo${grupo ? ' · ' + adEsc(grupo) : ''}</title>
<style>
@page { size: letter; margin: 10mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; }
.hoja { width: 195.9mm; --fz: 13pt; }
.cab { border-bottom: 2px solid #1e3a7c; padding-bottom: 2.5mm; margin-bottom: 3.5mm; }
.cab h1 { font-size: 17pt; color: #1e3a7c; }
.cab p { font-size: 10pt; color: #444; margin-top: 1mm; }
.grid { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 3mm; }
.eq { border: 1.5px dashed #777; border-radius: 3mm; padding: 2mm 3mm 2.5mm; break-inside: avoid; }
.eq h2 { font-size: calc(var(--fz) * 1.12); color: #1e3a7c; margin-bottom: 1mm; }
.eq h2 small { font-size: 9pt; color: #555; font-weight: normal; }
.eq ol { padding-left: 1.5em; }
.eq li { font-size: var(--fz); line-height: 1.25; }
.pie { margin-top: 3mm; font-size: 8.5pt; color: #666; }
</style></head><body><div class="hoja">
<div class="cab"><h1>🤝 Equipos de trabajo${grupo ? ' · ' + adEsc(grupo) : ''}</h1>
<p>${adEsc(eqFechaLarga())}${esc ? ' · ' + adEsc(esc) : ''}</p></div>
<div class="grid">
${gs.map((g, k) => `<div class="eq"><h2>Equipo ${k + 1} <small>· ${g.length}</small></h2>
<ol>${g.map(a => '<li>' + adEsc(eqNombre(a)) + '</li>').join('') || '<li>nadie hoy</li>'}</ol></div>`).join('\n')}
</div>
<p class="pie">Armados con M.E.T.A.S · Mi aula</p>
</div>
<script>(function () {
  var h = document.querySelector('.hoja'), tope = 248 * 96 / 25.4, t = ${JSON.stringify(EQ_LETRAS)};
  for (var i = 0; i < t.length; i++) {
    h.style.setProperty('--fz', t[i] + 'pt');
    if (h.getBoundingClientRect().height <= tope) break;
  }
  h.setAttribute('data-letra', t[Math.min(i, t.length - 1)]);
})();<\/script>
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}

if (typeof window !== 'undefined') {
  window.adRenderEquipos = adRenderEquipos;
  window.eqRecorrer = eqRecorrer;
  window.eqArmar = eqArmar;
  window.eqMedir = eqMedir;
  window.eqTamanos = eqTamanos;
  window.eqImprimir = eqImprimir;
  window.eqTexto = eqTexto;
}
