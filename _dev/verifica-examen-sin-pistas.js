#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Ninguna pregunta le regala la respuesta a otra
   ------------------------------------------------------------
   Lo pidió un maestro el 25 de septiembre de 2026, con la ficha
   de Aspectos Cívicos en la mano: «a veces en el mismo examen
   están las respuestas que se plantean allí mismo de otra forma,
   mis alumnos se dan cuenta de eso». Tenía razón medida: el
   completar pedía «La Bandera lleva ___ estrellas», el verdadero
   o falso decía «tiene cuatro estrellas», la selección preguntaba
   «¿Qué representan las CINCO estrellas?» y el pareado ponía
   «Tres franjas y cinco estrellas». Cuatro preguntas, un dato, y
   la respuesta de la primera escrita en las otras tres.

   Eso no mide lo que el alumno sabe: mide si lee la hoja entera
   antes de contestar. Y el que la lee entera saca la nota del que
   estudió, en la prueba que entra en su expediente.

   Qué comprueba, en cada misión que ya pasó por la revisión:

   1. UN DATO, UNA PREGUNTA. Cada ítem de los bancos de la
      evaluación lleva su `k`, el dato que pregunta, y ninguna `k`
      se repite en los bancos que pueden caer en la misma hoja.
   2. LA RESPUESTA NO APARECE ESCRITA EN OTRA PREGUNTA, tampoco
      como opción equivocada: si «Hartling» es la respuesta de un
      completar, no puede ser la b) de una selección. Esto no lo ve
      la `k` —son dos datos distintos— y por eso se lee el texto.
   3. Las formas, armadas con EL MISMO generador de la misión (su
      _evalRng y su _pickF: leídos de su archivo o, desde que viven una
      sola vez, de js/motor-misiones.js), sin un choque. La prueba de
      pensamiento crítico que ya reparte sus formas sin repetir se arma
      con el reparto del motor (_repartoCritica), de la 1 a la 50.
   4. La ficha imprimible, con la misma regla: todas sus preguntas
      son UNA prueba y se reparten juntas.
   5. EL BANCO GRANDE. La misión que trae un banco nuevo al lado del de
      siempre (evalCPBankNuevo…) arma formas nuevas que mezclan los dos:
      las preguntas nuevas se miden contra las nuevas Y contra las de
      antes, y las formas nuevas se arman con el reparto del motor
      (_repartoConceptual).

   Una misión «pasó por la revisión» cuando sus bancos llevan `k`.
   Las demás se cuentan como pendientes y no se ponen rojas: la
   revisión se hace de una en una, leyendo, y esta sonda es la que
   impide que lo revisado se vuelva a estropear.

   Uso:  node _dev/verifica-examen-sin-pistas.js                    (npm test)
         node _dev/verifica-examen-sin-pistas.js --todas            (mide también
                                                                     las pendientes)
         node _dev/verifica-examen-sin-pistas.js --todas --detalle  (y tres pistas
                                                                     de cada una)

   ⚠️ Lo que mide en las pendientes son las pistas que se VEN en el
   texto: la palabra de una respuesta escrita en otra pregunta. Que
   dos preguntas pregunten el mismo dato con palabras distintas no se
   ve así, y por eso la revisión de verdad es ponerle a cada ítem su
   `k` leyéndolo: esa es la que no se escapa.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const MIS = path.join(RAIZ, 'misiones');
const TODAS = process.argv.includes('--todas');
const DETALLE = process.argv.includes('--detalle');

let fallos = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const bien = m => console.log('  ✅ ' + m);
const ojo = m => console.log('  ⚠️  ' + m);

/* ── Leer del archivo lo que corre en la misión ─────────────────
   Se quitan los comentarios ANTES de buscar: el bloque que explica
   esta regla escribe nombres de bancos y respuestas de ejemplo, y
   una sonda que se acusa a sí misma enseña a no mirarla. */
function sinComentarios(src) {
  let out = '', i = 0, cad = null;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (cad) {
      out += c;
      if (c === '\\') { out += d || ''; i += 2; continue; }
      if (c === cad) cad = null;
      i++; continue;
    }
    if (c === '"' || c === "'" || c === '`') { cad = c; out += c; i++; continue; }
    if (c === '/' && d === '*') { const f = src.indexOf('*/', i + 2); i = f < 0 ? src.length : f + 2; out += ' '; continue; }
    /* Solo el «//» que abre la línea: uno a media línea puede ser parte de
       una expresión regular, y cortarla ahí se comería el código. */
    if (c === '/' && d === '/' && /(^|\n)[ \t]*$/.test(out.slice(-200))) {
      const f = src.indexOf('\n', i); i = f < 0 ? src.length : f; continue;
    }
    out += c; i++;
  }
  return out;
}

function trozoBalanceado(src, desde) {
  const abre = src[desde], cierra = abre === '[' ? ']' : abre === '{' ? '}' : ')';
  let prof = 0, cad = null;
  for (let i = desde; i < src.length; i++) {
    const c = src[i];
    if (cad) { if (c === '\\') { i++; continue; } if (c === cad) cad = null; continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; continue; }
    if (c === abre) prof++;
    else if (c === cierra) { prof--; if (prof === 0) return src.slice(desde, i + 1); }
  }
  return null;
}

function banco(src, nombre) {
  const m = new RegExp('(?:const|let|var)\\s+' + nombre + '\\s*=\\s*\\[').exec(src);
  if (!m) return null;
  const lit = trozoBalanceado(src, m.index + m[0].length - 1);
  if (!lit) return null;
  try { return vm.runInNewContext('(' + lit + ')'); } catch (e) { return null; }
}

/* ⚠️ Un banco también puede estar GENERADO de un archivo de datos: los casos
   de pensamiento crítico de la Constitución salen de CONST_CASOS
   (`CONST_CASOS.casos.filter(…).map(…)`). Sin leerlos, la sonda no veía los
   casos: los daba por inexistentes y la prueba salía limpia sin haberlos
   mirado. Se arma como en la misión, con sus archivos de datos cargados
   antes —la lección de verifica-mision-nueva: lo que hay que medir es lo que
   el banco TIENE, no cómo está escrito—. */
function bancoGenerado(src, nombre, html) {
  const m = new RegExp('(?:const|let|var)\\s+' + nombre + '\\s*=').exec(src);
  if (!m) return null;
  let prof = 0, cad = null, i = m.index + m[0].length;
  for (; i < src.length; i++) {
    const c = src[i];
    if (cad) { if (c === '\\') { i++; continue; } if (c === cad) cad = null; continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; continue; }
    if ('([{'.includes(c)) prof++;
    else if (')]}'.includes(c)) prof--;
    else if (c === ';' && prof === 0) break;
  }
  const caja = {};
  vm.createContext(caja);
  try {
    (String(html).match(/src="[^"]*\/(js\/data\/[A-Za-z0-9._-]+\.js)"/g) || []).forEach(s => {
      const rel = s.match(/(js\/data\/[A-Za-z0-9._-]+\.js)/)[1];
      const p = path.join(RAIZ, rel);
      if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), caja);
    });
    vm.runInContext('this.__banco = (' + src.slice(m.index + m[0].length, i) + ');', caja);
    return Array.isArray(caja.__banco) ? caja.__banco : null;
  } catch (e) { return null; }
}

function cuerpoDe(src, nombreFn) {
  const m = new RegExp('function\\s+' + nombreFn + '\\s*\\(').exec(src);
  if (!m) return null;
  const llave = src.indexOf('{', m.index);
  return trozoBalanceado(src, llave);
}

/* El generador de formas de la misión, tal cual está escrito: si mañana
   cambia la semilla o el barajado, la sonda arma las formas nuevas y no
   unas que ya no existen. */
/* ⚠️ Desde que el generador se sacó de las 84 misiones al motor
   compartido, ninguna lo trae escrito, y esta función devolvía «no hay
   generador»: la comprobación de las formas se saltaba en todas sin
   ponerse roja. Ahora, si la misión no trae su copia, se usa la del
   motor, que es la que corre en la página. */
let _delMotor;
function generadorDelMotor() {
  if (_delMotor !== undefined) return _delMotor;
  const caja = { document: {}, location: { search: '' }, URLSearchParams };
  caja.window = caja;
  vm.createContext(caja);
  try {
    vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'motor-misiones.js'), 'utf8'), caja);
    _delMotor = { rng: caja._evalRng, pick: caja._pickF, reparto: caja._repartoCritica, formasCritica: caja._formasCritica,
      formasConceptual: caja._formasConceptual, repartoConceptual: caja._repartoConceptual };
  } catch (e) { _delMotor = null; }
  return _delMotor;
}

function generador(src) {
  const rng = src.match(/function\s+_evalRng\s*\([^)]*\)\s*\{/);
  const sh = src.match(/const\s+_shuffleF\s*=[^\n]*/);
  const pk = src.match(/const\s+_pickF\s*=[^\n]*/);
  const formasDe = () => +(src.match(/const\s+EVAL_FORMAS\s*=\s*(\d+)/) || [0, 30])[1];
  if (!rng || !sh || !pk) {
    const m = generadorDelMotor();
    return m && typeof m.rng === 'function' && typeof m.pick === 'function' ? Object.assign({ formas: formasDe() }, m) : null;
  }
  const cuerpo = 'function _evalRng' + src.slice(rng.index + rng[0].indexOf('('), rng.index + rng[0].length - 1)
    + trozoBalanceado(src, rng.index + rng[0].length - 1);
  const caja = {};
  vm.createContext(caja);
  try {
    vm.runInContext(cuerpo + '\n' + sh[0] + '\n' + pk[0] + '\nthis._evalRng=_evalRng;this._pickF=_pickF;', caja);
  } catch (e) { return null; }
  const formas = +(src.match(/const\s+EVAL_FORMAS\s*=\s*(\d+)/) || [0, 30])[1];
  return { rng: caja._evalRng, pick: caja._pickF, formas };
}

/* Qué bancos saca cada prueba, cuántos de cada uno y con qué semilla. */
function receta(src, nombreFn) {
  const cuerpo = cuerpoDe(src, nombreFn);
  if (!cuerpo) return null;
  /* La prueba crítica que ya reparte sus formas no saca con _pickF:
     declara sus apartados (`[[critCaseBank, 1], …]`) en `critApartados`
     y el motor los reparte. Se leen de ahí, o esta prueba se quedaría sin
     mirar justo cuando cambia de método. */
  if (/_turnoCritica\s*\(/.test(cuerpo)) {
    const declarados = cuerpoDe(src, 'critApartados');
    const pares = declarados ? [...declarados.matchAll(/\[\s*(\w+)\s*,\s*(\d+)\s*\]/g)].map(m => ({ banco: m[1], n: +m[2] })) : [];
    return pares.length ? { picks: pares, desplaza: 0, fiel: true, reparto: true } : null;
  }
  const picks = [...cuerpo.matchAll(/_pickF\(\s*(\w+)\s*,\s*(\d+)/g)].map(m => ({ banco: m[1], n: +m[2] }));
  if (!picks.length) return null;
  const semilla = cuerpo.match(/_evalRng\(\s*(\d+)\s*\+/);
  /* Si la prueba gasta la semilla en otra cosa ANTES de la última sacada
     —barajar opciones, por ejemplo—, las formas que arma la sonda ya no
     son las de la misión: se dice, en vez de contar formas que no existen. */
  const ultima = cuerpo.lastIndexOf('_pickF(');
  const antes = cuerpo.slice(0, ultima).replace(/_pickF\(/g, '');
  const fiel = !/_shuffleF\(|\brng\w*\(\s*\)/.test(antes);
  return { picks, desplaza: semilla ? +semilla[1] : 0, fiel };
}

/* ── El texto, en palabras comparables ─────────────────────────── */
const PARADA = new Set(('a al ante bajo con contra de del desde durante e el ella ellos en entre era es esa ese eso esta este esto estos estas fue han hasta hay la las le les lo los mas me mi muy nada ni no nos o os otra otro para pero por porque que quien se ser si sin sobre son su sus tambien te tiene tienen tu un una uno unos unas y ya yo cual cuales como cuando donde cuanto cuantos cuantas mismo misma solo sola todo toda todos todas aqui alli asi va van cada tan ' +
  'sea hace hacen dice dicen lleva llevan puede pueden debe deben esta estan').split(/\s+/));

const sinTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/* Solo se quita el plural: «estrellas» y «estrella» son la misma palabra.
   Quitar también la vocal final juntaba «canta» con «Canto a Honduras» y
   acusaba de pista a dos preguntas que no tienen nada que ver. */
function raiz(p) {
  if (/^\d+$/.test(p)) return p;
  if (p.length >= 5 && /[lnrdzj]es$/.test(p)) return p.slice(0, -2);
  if (p.length >= 4 && p.endsWith('s')) return p.slice(0, -1);
  return p;
}

/* Palabras con su marca de «fuerte»: un número, un nombre propio (con
   mayúscula) o una palabra en MAYÚSCULAS, que es como las pautas de la
   prueba de pensamiento crítico señalan la respuesta. Una palabra fuerte
   delata sola; una corriente, solo si va con la pregunta de al lado. */
function palabras(txt) {
  const out = [];
  const limpio = String(txt || '').replace(/<[^>]+>/g, ' ').replace(/[«»"“”]/g, ' ');
  for (const t of limpio.split(/\s+/)) {
    const pal = t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (!pal) continue;
    const norm = sinTildes(pal.toLowerCase());
    const esNum = /^\d+$/.test(norm);
    if (!esNum && (norm.length < 3 || PARADA.has(norm))) continue;
    const todoMayus = pal.length >= 3 && pal === pal.toUpperCase() && /\p{L}/u.test(pal);
    /* Un número corto —5, 18— sale en muchas preguntas de matemáticas sin
       delatar nada; uno largo —1866, 1821— es un dato con nombre propio. */
    const largo = esNum && norm.length >= 3;
    out.push({ r: raiz(norm), num: largo, mayus: todoMayus, fuerte: largo || todoMayus || /^\p{Lu}/u.test(pal) });
  }
  return out;
}

/* ── Los ítems de una prueba, todos con la misma forma ────────────
   visible: lo que el alumno lee en la hoja.
   resp:    lo que tiene que escribir o elegir (vacío si es V/F).
   ctx:     la pregunta que rodea a la respuesta. */
/* `sufijo` es para el banco grande: los cuatro bancos nuevos se llaman
   como los de siempre con «Nuevo» detrás y tienen la misma forma. */
function itemsConceptual(b, sufijo = '') {
  const L = [];
  const CP = 'evalCPBank' + sufijo, TF = 'evalTFBank' + sufijo, MC = 'evalMCBank' + sufijo, PR = 'evalPRBank' + sufijo;
  (b[CP] || []).forEach((it, i) => L.push({ banco: CP, i, k: it.k, tipo: 'completar',
    visible: it.q.replace(/_{2,}/g, ' '), resp: it.a, ctx: it.q }));
  (b[TF] || []).forEach((it, i) => L.push({ banco: TF, i, k: it.k, tipo: 'vf',
    visible: it.q, resp: '', ctx: '' }));
  (b[MC] || []).forEach((it, i) => {
    const ops = (it.o || []).map(o => String(o).replace(/^[a-e]\)\s*/i, ''));
    L.push({ banco: MC, i, k: it.k, tipo: 'seleccion',
      visible: it.q + ' ' + ops.join(' · '), resp: ops[it.a] || '', ctx: it.q });
  });
  (b[PR] || []).forEach((it, i) => L.push({ banco: PR, i, k: it.k, tipo: 'pareado',
    visible: it.term + ' · ' + it.def, resp: '', ctx: '', term: it.term, def: it.def }));
  return L;
}

/* La pauta de pensamiento crítico no se lee toda igual:
   - «mayusculas»: los errores. La corrección va escrita en MAYÚSCULAS
     («lleva CINCO estrellas»), que es lo que el alumno tiene que poner;
     el resto de la frase es de adorno y no delata nada.
   - «fuertes»: la comparación. Lo que se pide es un nombre —Herrera, los
     símbolos MAYORES—, y ese nombre no puede estar escrito en otra parte.
   - «frase»: las causas y los efectos, frases enteras. Una palabra suelta
     en común no es una pista; dos del mismo dato, sí.
   El razonamiento de la comparación (gr) no entra: es la explicación para
   el maestro, no lo que se le pide al alumno.

   ⚠️ Y en la comparación, un NOMBRE PROPIO no delata solo. En la de los
   próceres el alumno lee dos obras sin nombre —«Fundó la primera
   universidad del país»— y dice de quién es cada una; los nombres salen en
   otras preguntas, cada vez con OTRO dato («falta la fecha de nacimiento de
   José Trinidad Reyes»), y eso no le dice quién fundó la universidad: lo que
   se lo diría es el nombre JUNTO a esa obra. Es la misma regla de los
   pareados, que se contestan emparejando. Lo escrito en MAYÚSCULAS o con
   números —«los símbolos MAYORES»— sí delata solo, como siempre: ahí la
   mayúscula marca lo que el alumno tiene que escribir, no a quién. */
const CRIT_CONOCIDOS = ['critCaseBank', 'critErrorBank', 'critDecisionBank', 'critCompareBank', 'critCauseBank', 'critEffectBank'];
function itemsCritico(b) {
  const L = [];
  const k = it => it && typeof it === 'object' ? it.k : undefined;
  (b.critCaseBank || []).forEach((it, i) => L.push({ banco: 'critCaseBank', i, k: k(it), visible: it.txt || it, oculto: '' }));
  (b.critErrorBank || []).forEach((it, i) => L.push({ banco: 'critErrorBank', i, k: k(it), visible: it.txt, oculto: [it.g1, it.g2].join(' '), modo: 'mayusculas' }));
  (b.critDecisionBank || []).forEach((it, i) => L.push({ banco: 'critDecisionBank', i, k: k(it), visible: typeof it === 'string' ? it : it.txt, oculto: '' }));
  (b.critCompareBank || []).forEach((it, i) => L.push({ banco: 'critCompareBank', i, k: k(it), visible: it.a + ' ' + it.b, oculto: [it.ga, it.gb].join(' '), modo: 'fuertes',
    lados: [{ oculto: it.ga, obra: it.a }, { oculto: it.gb, obra: it.b }] }));
  (b.critCauseBank || []).forEach((it, i) => L.push({ banco: 'critCauseBank', i, k: k(it), visible: it.cause, oculto: it.guide, modo: 'frase' }));
  (b.critEffectBank || []).forEach((it, i) => L.push({ banco: 'critEffectBank', i, k: k(it), visible: it.effect, oculto: it.guide, modo: 'frase' }));
  /* Las misiones de robótica traen bancos propios —el sensor que hace falta,
     el ciclo percibir-decidir-actuar, el mecanismo, el diseño— con otros
     nombres. Sin leerlos, la sonda daba por limpia una prueba que no había
     mirado. Lo que el alumno lee es el texto (`txt`, o la cadena entera); lo
     demás es la pauta. */
  Object.keys(b).filter(n => /^crit\w*Bank$/.test(n) && !CRIT_CONOCIDOS.includes(n)).forEach(n => {
    (b[n] || []).forEach((it, i) => {
      if (typeof it === 'string') { L.push({ banco: n, i, k: undefined, visible: it, oculto: '', sinPauta: true }); return; }
      const vis = it.txt || it.q || it.situ || '';
      const oc = Object.keys(it).filter(c => c !== 'k' && c !== 'txt' && c !== 'q' && c !== 'situ' && typeof it[c] === 'string').map(c => it[c]).join(' ');
      L.push({ banco: n, i, k: k(it), visible: vis, oculto: oc, modo: 'frase' });
    });
  });
  return L;
}

/* Una palabra que sale en muchos ítems es el TEMA de la prueba —«Himno»,
   «Bandera», «Nacional»— y no dice nada de ninguna respuesta. Se mide en
   cada prueba en vez de escribir la lista: en la de fracciones el tema es
   otro, y una lista escrita a mano envejece con la misión siguiente. */
function temaDe(items) {
  const df = new Map();
  items.forEach(it => {
    const vistas = new Set(palabras(it.visible + ' ' + (it.resp || '') + ' ' + (it.oculto || '')).map(p => p.r));
    vistas.forEach(r => df.set(r, (df.get(r) || 0) + 1));
  });
  const tope = Math.max(4, Math.ceil(items.length * 0.08));
  return new Set([...df].filter(([, n]) => n >= tope).map(([r]) => r));
}

function claves(it) { return [].concat(it.k || []).filter(Boolean); }

/* ⚠️ El NOMBRE de la prueba no delata nada: va impreso en el pie de cada hoja
   de la ficha y arriba de la pantalla. «Honduras» es la respuesta de «¿con qué
   título se escribió el Himno?» —«Canto a Honduras»— y la sonda la daba por
   escrita en la hoja de la séptima estrofa («serán muchos, Honduras, tus
   muertos»), cuando el pie de esa misma hoja ya dice «El Himno Nacional de
   Honduras». Las palabras del título solo dejan de contar como pista POR SÍ
   SOLAS; junto a otra palabra de la pregunta siguen contando, porque ahí sí
   pueden decir la respuesta. */
function palabrasTitulo(html) {
  const t = (String(html).match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const limpio = t.replace(/\|[^|]*$/, '').replace(/Ficha Did[aá]ctica|Misi[oó]n/gi, ' ');
  return new Set(palabras(limpio).map(p => p.r));
}

/* ¿El ítem Y le deja ver la respuesta del ítem X?
   `nombres`: las palabras que repiten VARIOS de la columna de los
   pareados —«José», «Trinidad»—, que no identifican a nadie: José
   Trinidad Cabañas y José Trinidad Reyes son dos próceres distintos. */
function pista(X, Y, tema, nombres, titulo = new Set()) {
  const vistoY = palabras(Y.visible);
  const enY = new Set(vistoY.map(p => p.r));
  const utiles = ps => ps.filter(p => !tema.has(p.r));
  /* ⚠️ Un nombre que en la otra pregunta sale solo como OPCIÓN, o en una
     columna de los pareados, no delata a una selección ni a un pareado.
     Se encontró en la de los tres poderes: «¿Qué poder HACE las leyes?»
     tiene por respuesta «El Legislativo», y la sonda la daba por escrita en
     la selección de al lado, que ofrece «El Judicial · El Legislativo · El
     Ejecutivo», y en el pareado «Poder Legislativo». Ninguna de las dos dice
     qué hace el Legislativo: lo ponen en una lista, igual que la propia
     pregunta, que ya enseña sus cuatro opciones. Por eso, para esas dos
     clases de pregunta, un nombre solo cuenta si está en lo que la otra
     AFIRMA —el enunciado de la selección, el verdadero o falso, el
     completar—. Para el completar se sigue mirando todo: ahí el alumno tiene
     que escribir la respuesta, y verla en una lista de opciones es verla
     escrita, que es la lección de «Hartling» en Aspectos Cívicos. */
  const afirmaY = Y.tipo === 'seleccion' ? Y.ctx : Y.tipo === 'pareado' ? '' : Y.visible;
  const enLista = X.tipo === 'seleccion' || X.tipo === 'pareado';
  const enYnombre = enLista ? new Set(palabras(afirmaY).map(p => p.r)) : enY;

  if (X.tipo === 'pareado') {
    /* El pareado se contesta EMPAREJANDO: lo delata otra pregunta que
       junte las dos mitades, o que repita el nombre de la de la izquierda. */
    const T = utiles(palabras(X.term)).filter(p => !nombres.has(p.r)), D = utiles(palabras(X.def));
    const fuerteT = T.filter(p => p.fuerte && !titulo.has(p.r) && enYnombre.has(p.r));
    if (fuerteT.length) return 'repite «' + X.term + '»';
    if (T.some(p => enY.has(p.r)) && D.some(p => enY.has(p.r))) return 'junta «' + X.term + '» con «' + X.def + '»';
    return null;
  }

  if (X.oculto && X.lados) {
    for (const lado of X.lados) {
      const N = utiles(palabras(lado.oculto)).filter(p => p.fuerte && !titulo.has(p.r));
      const vistos = [...new Set(N.filter(p => enY.has(p.r)).map(p => p.r))];
      if (!vistos.length) continue;
      if (N.some(p => p.mayus || p.num)) return 'deja escrito «' + vistos.join(', ') + '»';
      const obra = [...new Set(utiles(palabras(lado.obra)).filter(p => !N.some(n => n.r === p.r) && enY.has(p.r)).map(p => p.r))];
      if (obra.length) return 'junta «' + vistos.join(', ') + '» con «' + obra.join(', ') + '», que es lo que hizo';
    }
    return null;
  }

  if (X.oculto) {
    const O = utiles(palabras(X.oculto));
    const delata = (X.modo === 'mayusculas' ? O.filter(p => p.mayus || p.num)
      : X.modo === 'fuertes' ? O.filter(p => p.fuerte) : O.filter(p => p.num)).filter(p => !titulo.has(p.r));
    const vistas = [...new Set(delata.filter(p => enY.has(p.r)).map(p => p.r))];
    if (vistas.length) return 'deja escrito «' + vistas.join(', ') + '»';
    if (X.modo !== 'frase') return null;
    const comunes = [...new Set(O.filter(p => enY.has(p.r)).map(p => p.r))];
    return comunes.length >= 2 ? 'deja escrito «' + comunes.join(', ') + '»' : null;
  }

  const R = utiles(palabras(X.resp || ''));
  if (!R.length) return null;
  const fuertes = R.filter(p => p.fuerte && !titulo.has(p.r) && enYnombre.has(p.r));
  if (fuertes.length) return 'deja escrito «' + fuertes.map(p => p.r).join(', ') + '»';
  const comunes = [...new Set(R.filter(p => enY.has(p.r)).map(p => p.r))];
  if (!comunes.length) return null;
  const C = utiles(palabras(X.ctx || '')).map(p => p.r).filter(r => !R.some(p => p.r === r));
  const ctxEnY = C.filter(r => enY.has(r));
  if (ctxEnY.length || comunes.length >= 2) return 'deja escrito «' + comunes.join(', ') + '» junto a «' + (ctxEnY[0] || comunes[1]) + '»';
  return null;
}

function nombre(it) {
  const t = String(it.visible).replace(/\s+/g, ' ');
  return it.banco + '[' + it.i + '] «' + (t.length > 70 ? t.slice(0, 67) + '…' : t) + '»';
}

/* Todos los pares que pueden caer en la misma hoja. `juntos(a, b)` dice si
   dos ítems pueden salir en la misma forma. */
function nombresRepetidos(items) {
  const cuenta = new Map();
  items.filter(it => it.tipo === 'pareado').forEach(it =>
    new Set(palabras(it.term).map(p => p.r)).forEach(r => cuenta.set(r, (cuenta.get(r) || 0) + 1)));
  return new Set([...cuenta].filter(([, n]) => n >= 2).map(([r]) => r));
}

function revisaPares(items, juntos, tema, titulo) {
  const choques = [];
  const nombres = nombresRepetidos(items);
  for (let a = 0; a < items.length; a++) {
    for (let b = 0; b < items.length; b++) {
      if (a === b || !juntos(items[a], items[b])) continue;
      const X = items[a], Y = items[b];
      if (a < b) {
        const kc = claves(X).filter(k => claves(Y).includes(k));
        if (kc.length) choques.push({ X, Y, por: 'preguntan el mismo dato (' + kc.join(', ') + ')' });
      }
      const p = pista(X, Y, tema, nombres, titulo);
      if (p) choques.push({ X, Y, por: 'la segunda ' + p + ', que es la respuesta de la primera' });
    }
  }
  return choques;
}

/* Arma las formas con el generador de la misión y cuenta las que chocan. */
function formasConChoque(gen, rec, bancos, items, tema, titulo) {
  const porBanco = {};
  items.forEach(it => { (porBanco[it.banco] = porBanco[it.banco] || [])[it.i] = it; });
  let malas = 0;
  const ejemplos = [];
  /* Con el reparto, las formas son las del motor: tantas como dé el banco
     (hasta 50) y con los casos que le tocan a cada una. Se reparten las
     posiciones de cada banco, que es de lo único que depende. */
  /* Un banco que no se deja leer como texto (el de los recorridos de
     Programando un Robot lleva constantes del simulador) no tiene ítems
     que comparar, pero su TAMAÑO sí hace falta: sin él las formas que se
     arman aquí no serían las de la misión. Viene en `rec.tamanos`. */
  const largo = p => Array.isArray(bancos[p.banco]) ? bancos[p.banco].length : (rec.tamanos || {})[p.banco];
  const apartados = rec.reparto ? rec.picks.map(p => [Array.from({ length: largo(p) || 0 }, (_, i) => i), p.n]) : null;
  if (apartados && (typeof gen.reparto !== 'function' || rec.picks.some(p => !(largo(p) >= p.n)))) return null;
  const total = apartados ? gen.formasCritica(apartados) : gen.formas;
  for (let f = 1; f <= total; f++) {
    const hoja = [];
    const pon = (banco, i) => { if (porBanco[banco] && porBanco[banco][i]) hoja.push(porBanco[banco][i]); };
    if (apartados) gen.reparto(f, apartados).forEach((posiciones, j) => posiciones.forEach(i => pon(rec.picks[j].banco, i)));
    else {
      const r = gen.rng(rec.desplaza + f);
      for (const p of rec.picks) {
        const arr = bancos[p.banco];
        if (!Array.isArray(arr)) continue;
        gen.pick(arr.map((_, i) => i), p.n, r).forEach(i => pon(p.banco, i));
      }
    }
    const ch = revisaPares(hoja, () => true, tema, titulo);
    if (ch.length) { malas++; if (ejemplos.length < 3) ejemplos.push({ f, ch: ch[0] }); }
  }
  return { malas, ejemplos, fiel: rec.fiel, total };
}

/* ── La ficha imprimible ─────────────────────────────────────────
   El lector vive en `_dev/lib-ficha.js`, porque ya no lo usa solo esta
   sonda: la que vigila que la ficha no copie el examen y el armador de
   fichas leen la ficha con él. Aquí se usa igual que antes. */
const { limpiaHtml, itemsFicha, fichaDe } = require('./lib-ficha.js');

/* ── Recorrer las misiones ──────────────────────────────────────── */
const revisadas = [], pendientes = [], fuera = [];
const NACIDAS = require('./lib-formas.js').leerNacidas();

for (const dir of fs.readdirSync(MIS).sort()) {
  const jsDir = path.join(MIS, dir, 'js');
  if (!fs.existsSync(jsDir)) continue;
  const archivo = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('-en.js'))
    .map(f => path.join(jsDir, f)).find(f => /(?:const|let|var)\s+evalCPBank\s*=/.test(fs.readFileSync(f, 'utf8')));
  if (!archivo) {
    /* Las Pruebas de Fin de Grado arman DOS materias con bancos por materia
       (evalCPBankMat, evalCPBankEsp…) y las misiones del maestro no traen
       esta prueba: no tienen la forma que esta sonda sabe leer. No se callan:
       se nombran, para que nadie crea que se midieron y salieron limpias. */
    const conPrueba = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'))
      .some(f => /function\s+genEval\s*\(/.test(fs.readFileSync(path.join(jsDir, f), 'utf8')));
    if (conPrueba) fuera.push(dir);
    continue;
  }
  /* En una misión que usa el motor, genEval está en el motor y los bancos
     en su contenido: se leen juntos, o la misión se quedaría sin medir. */
  const src = sinComentarios(require('./lib-formas.js').fuenteDeMision(archivo));
  const nombresC = ['evalCPBank', 'evalTFBank', 'evalMCBank', 'evalPRBank'];
  const nombresK = ['critCaseBank', 'critErrorBank', 'critDecisionBank', 'critCompareBank', 'critCauseBank', 'critEffectBank'];
  const htmlArchivo = fs.readdirSync(path.join(MIS, dir)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));
  const html = htmlArchivo ? fs.readFileSync(path.join(MIS, dir, htmlArchivo), 'utf8') : '';
  const bancos = {};
  const nombresOtros = [...new Set([...src.matchAll(/(?:const|let|var)\s+(crit\w*Bank)\s*=/g)].map(x => x[1]))].filter(n => !nombresK.includes(n));
  const nombresN = nombresC.map(n => n + 'Nuevo');
  [...nombresC, ...nombresN, ...nombresK, ...nombresOtros].forEach(n => { const b = banco(src, n) || bancoGenerado(src, n, html); if (b) bancos[n] = b; });
  const conceptual = itemsConceptual(bancos);
  const nuevas = itemsConceptual(bancos, 'Nuevo');
  const conK = conceptual.filter(it => it.k).length;
  const ficha = fichaDe(dir, html);
  /* La misión nacida trae el bloque de su ficha, pero la ficha impresa se
     arma después (cuando entra al catálogo y tiene QR). Se arma en la
     memoria para medirle la práctica desde ya: una pista entre dos
     preguntas se arregla más barato hoy que con la ficha fotocopiada. */
  let fichaHtml = null;
  if (!ficha && NACIDAS[dir] && fs.existsSync(path.join(jsDir, 'ficha.js'))) {
    try { fichaHtml = require('./arma-ficha.js').enMemoria(dir); } catch (e) { fichaHtml = { rechazo: e.message }; }
  }
  const m = { dir, archivo, src, bancos, conceptual, nuevas, ficha, fichaHtml, titulo: palabrasTitulo(html) };
  if (conK === 0) pendientes.push(m);
  else revisadas.push(m);
}

/* El banco grande. En las formas nuevas caen juntas preguntas del banco
   nuevo y del de antes, así que el dato de una nueva no puede ser el de
   ninguna otra, nueva o de antes, y su respuesta no puede estar escrita en
   ninguna. Los choques entre dos preguntas DE ANTES no se cuentan aquí: ya
   los mide la revisión de arriba, con las palabras del tema de su banco.

   El tema se mide dos veces a propósito. Una palabra es «del tema» si sale
   en muchas preguntas, y al juntar los dos bancos el listón sube: una
   palabra que era tema con cuarenta preguntas puede dejar de serlo con
   ochenta. Se toma lo que es tema en el banco entero, y nada más: así una
   pregunta nueva no se libra por repetir muchas veces una palabra que el
   banco de antes cuidaba. */
function revisaBancoGrande(m, gen, exigir) {
  const todas = m.conceptual.concat(m.nuevas);
  const esNueva = it => /Nuevo$/.test(it.banco);
  const sinK = m.nuevas.filter(it => !it.k);
  const vistas = new Map();
  todas.forEach(it => claves(it).forEach(k => { (vistas.get(k) || vistas.set(k, []).get(k)).push(it); }));
  const rep = [...vistas].filter(([, v]) => v.length > 1 && v.some(esNueva));
  const tema = temaDe(todas);
  const ch = revisaPares(todas, (a, b) => esNueva(a) || esNueva(b), tema, m.titulo).filter(c => !c.por.startsWith('preguntan'));
  if (exigir) {
    sinK.slice(0, 5).forEach(it => mal('Banco grande, sin `k`, no se puede comprobar: ' + nombre(it)));
    rep.forEach(([k, v]) => mal('Banco grande: el dato «' + k + '» se pregunta ' + v.length + ' veces: ' + v.map(nombre).join(' / ')));
    ch.forEach(c => mal('Banco grande: ' + nombre(c.X) + ' y ' + nombre(c.Y) + ': ' + c.por));
    if (!sinK.length && !rep.length) bien('Banco grande: ' + m.nuevas.length + ' preguntas nuevas, y ninguna pregunta un dato que ya pregunte otra, nueva o de antes');
    if (!ch.length) bien('Banco grande: ninguna respuesta, nueva o de antes, aparece escrita en una pregunta con la que pueda caer');
  }

  /* Las formas nuevas, armadas con el reparto del motor sobre los bancos
     de verdad (baraja las opciones de la selección, y para eso las pide). */
  const B = m.bancos, S = { cp: 'evalCPBank', tf: 'evalTFBank', mc: 'evalMCBank', pr: 'evalPRBank' };
  const completo = Object.keys(S).every(s => Array.isArray(B[S[s]]) && Array.isArray(B[S[s] + 'Nuevo']));
  if (!gen || typeof gen.repartoConceptual !== 'function' || !completo) {
    if (exigir) mal('Banco grande: no se pudieron armar sus formas nuevas con el reparto del motor (falta un banco nuevo o el motor no trae _repartoConceptual)');
    return { malas: 0, total: 0, choques: ch.length };
  }
  const grande = {};
  Object.keys(S).forEach(s => { grande[s] = { deAntes: B[S[s]], nuevas: B[S[s] + 'Nuevo'] }; });
  const porK = new Map();
  todas.forEach(it => claves(it).forEach(k => porK.set(k, it)));
  const deAntes = gen.formas, total = gen.formasConceptual(deAntes, grande);
  let malas = 0;
  const ejemplos = [];
  for (let f = deAntes + 1; f <= total; f++) {
    const h = gen.repartoConceptual(f, deAntes, grande);
    const hoja = [].concat(h.cp, h.tf, h.mc, h.pr).map(it => porK.get(it.k)).filter(Boolean);
    const c = revisaPares(hoja, () => true, tema, m.titulo);
    if (c.length) { malas++; if (ejemplos.length < 3) ejemplos.push({ f, ch: c[0] }); }
  }
  if (exigir) {
    if (total <= deAntes) mal('Banco grande: el banco nuevo no da ninguna forma nueva');
    else if (malas) { mal('Banco grande: ' + malas + ' de las formas ' + (deAntes + 1) + ' a ' + total + ' llevan un choque'); ejemplos.forEach(e => console.log('      · Forma ' + e.f + ': ' + nombre(e.ch.X) + ' / ' + nombre(e.ch.Y) + ': ' + e.ch.por)); }
    else bien('Banco grande: las formas ' + (deAntes + 1) + ' a ' + total + ', repartidas por el motor, sin un choque');
  }
  return { malas, total, choques: ch.length };
}

function revisa(m, exigir) {
  const gen = generador(m.src);
  const r = { conceptual: null, critico: null, ficha: null };

  /* 1 · Evaluación conceptual */
  const items = m.conceptual;
  if (exigir) {
    const sinK = items.filter(it => !it.k);
    if (sinK.length) sinK.slice(0, 5).forEach(it => mal('sin `k`, no se puede comprobar: ' + nombre(it)));
    const vistas = new Map();
    items.forEach(it => claves(it).forEach(k => { (vistas.get(k) || vistas.set(k, []).get(k)).push(it); }));
    const rep = [...vistas].filter(([, v]) => v.length > 1);
    rep.forEach(([k, v]) => mal('el dato «' + k + '» se pregunta ' + v.length + ' veces: ' + v.map(nombre).join(' / ')));
    if (!sinK.length && !rep.length) bien('Conceptual: ' + items.length + ' preguntas, ' + vistas.size + ' datos distintos: ninguno se pregunta dos veces');
  }
  const temaC = temaDe(items);
  const chC = revisaPares(items, () => true, temaC, m.titulo).filter(c => !c.por.startsWith('preguntan'));
  if (exigir) {
    if (chC.length) chC.forEach(c => mal('Conceptual: ' + nombre(c.X) + ' y ' + nombre(c.Y) + ': ' + c.por));
    else bien('Conceptual: ninguna respuesta aparece escrita en otra pregunta, tampoco como opción equivocada');
  }
  const recC = receta(m.src, 'genEval');
  if (gen && recC) {
    r.conceptual = formasConChoque(gen, recC, m.bancos, items, temaC, m.titulo);
    if (exigir) {
      if (r.conceptual.malas) mal('Conceptual: ' + r.conceptual.malas + ' de las ' + gen.formas + ' formas llevan un choque');
      else bien('Conceptual: las ' + gen.formas + ' formas, armadas con el generador de la misión, sin un choque');
    }
  }

  /* 1b · El banco grande: las preguntas nuevas, y las formas que las mezclan */
  if (m.nuevas.length) r.grande = revisaBancoGrande(m, gen, exigir);

  /* 2 · Pensamiento crítico */
  const recK = receta(m.src, 'genEvalCrit');
  if (recK && m.bancos.critErrorBank) {
    const itemsK = itemsCritico(m.bancos);
    const temaK = temaDe(itemsK);
    const cuantos = {};
    recK.picks.forEach(p => { cuantos[p.banco] = p.n; });
    /* Dos ítems del mismo banco solo caen juntos si de ese banco se sacan
       varios (las causas, los efectos); de los demás sale uno. */
    const juntos = (a, b) => a.banco !== b.banco || (cuantos[a.banco] || 1) > 1;
    const chK = revisaPares(itemsK, juntos, temaK, m.titulo);
    if (exigir) {
      const sinK = itemsK.filter(it => !it.k && it.banco !== 'critDecisionBank' && !it.sinPauta);
      sinK.slice(0, 5).forEach(it => mal('Pensamiento crítico, sin `k`: ' + nombre(it)));
      chK.forEach(c => mal('Pensamiento crítico: ' + nombre(c.X) + ' y ' + nombre(c.Y) + ': ' + c.por));
      if (!sinK.length && !chK.length) bien('Pensamiento crítico: ' + itemsK.length + ' casos, errores, comparaciones, causas y efectos sin pistas cruzadas');
    }
    if (gen) {
      /* Los bancos declarados que no se pudieron leer del texto: su tamaño
         se le pregunta a la misión cargada de verdad. */
      const sinLeer = recK.reparto ? recK.picks.filter(p => !Array.isArray(m.bancos[p.banco])).map(p => p.banco) : [];
      if (sinLeer.length) {
        recK.tamanos = {};
        try {
          const L = require('./lib-formas.js');
          const cargada = L.cargarMision(m.dir, 7);
          sinLeer.forEach(n => { recK.tamanos[n] = cargada.correr('Array.isArray(' + n + ') ? ' + n + '.length : 0', 'tamaño'); });
        } catch (e) { /* sin tamaño, abajo se dice que no se pudieron armar */ }
      }
      r.critico = formasConChoque(gen, recK, m.bancos, itemsK.map(it => it), temaK, m.titulo);
      if (!r.critico) { if (exigir) mal('Pensamiento crítico: no se pudieron armar sus formas con el reparto del motor (falta un banco de los que declara critApartados)'); }
      else if (exigir) {
        if (r.critico.malas) mal('Pensamiento crítico: ' + r.critico.malas + ' de las ' + r.critico.total + ' formas llevan un choque');
        else bien('Pensamiento crítico: las ' + r.critico.total + ' formas' + (recK.reparto ? ', repartidas por el motor,' : '') + ' sin un choque' +
          (sinLeer.length ? ' (los casos de ' + sinLeer.join(', ') + ' no se leen como texto y no entran en la comparación, igual que antes)' : ''));
      }
    }
  }

  /* 3 · La ficha */
  if (m.fichaHtml && m.fichaHtml.rechazo && exigir) mal('Ficha: el armador se niega a armar el bloque de esta misión nacida: ' + m.fichaHtml.rechazo);
  if (m.ficha || (m.fichaHtml && m.fichaHtml.html)) {
    const htmlFicha = m.ficha ? fs.readFileSync(m.ficha, 'utf8') : m.fichaHtml.html;
    if (!m.ficha) m.ficha = m.fichaHtml.archivo + '.html (de su bloque, sin armar todavía)';
    const leida = itemsFicha(htmlFicha);
    const tituloF = palabrasTitulo(htmlFicha);
    if (!leida) { if (exigir) ojo('la ficha ' + path.basename(m.ficha) + ' no tiene la forma de siempre: se revisa leyéndola'); }
    else {
      if (leida.faltan && exigir) ojo('la pauta de ' + path.basename(m.ficha) + ' no se pudo leer entera');
      const temaF = temaDe(leida.items);
      const chF = revisaPares(leida.items, () => true, temaF, tituloF);
      if (leida.teoria) {
        const hoja = { banco: 'teoría de la misma hoja', i: '', visible: leida.teoria };
        const nombresF = nombresRepetidos(leida.items);
        leida.items.forEach(X => {
          const p = pista(X, hoja, temaF, nombresF, tituloF);
          if (p) chF.push({ X, Y: hoja, por: 'la teoría impresa en la misma hoja ' + p + ', que es la respuesta' });
        });
      }
      r.ficha = { choques: chF.length, preguntas: leida.items.length, ejemplos: chF.slice(0, 3) };
      if (exigir) {
        chF.forEach(c => mal('Ficha: ' + nombre(c.X) + ' y ' + nombre(c.Y) + ': ' + c.por));
        if (!chF.length) bien('Ficha ' + path.basename(m.ficha) + ': ' + leida.items.length + ' preguntas y ninguna deja escrita la respuesta de otra');
      }
    }
  }
  return r;
}

console.log('\n🔎 Ninguna pregunta le regala la respuesta a otra\n');
revisadas.forEach(m => {
  console.log('📘 ' + m.dir);
  revisa(m, true);
  console.log('');
});

if (TODAS) {
  console.log('📋 Pendientes de revisión (solo se mide: las pistas que se ven en el texto; las repeticiones de un mismo dato hay que leerlas)\n');
  const filas = pendientes.map(m => {
    const f0 = fallos;
    const r = revisa(m, false);
    fallos = f0;
    return { dir: m.dir, c: r.conceptual, k: r.critico, f: r.ficha };
  }).sort((a, b) => ((b.c && b.c.malas) || 0) - ((a.c && a.c.malas) || 0));
  filas.forEach(x => {
    const c = x.c ? (x.c.fiel ? '' : '≈') + x.c.malas + '/' + x.c.total : '—';
    const k = x.k ? (x.k.fiel ? '' : '≈') + x.k.malas + '/' + x.k.total : '—';
    const f = x.f ? String(x.f.choques) : '—';
    console.log('  ' + x.dir.padEnd(46) + ' conceptual ' + c.padEnd(6) + ' crítico ' + k.padEnd(6) + ' pistas en la ficha ' + f);
    if (DETALLE) {
      const ej = [...((x.c && x.c.ejemplos) || []).map(e => e.ch), ...((x.f && x.f.ejemplos) || [])].slice(0, 3);
      ej.forEach(e => console.log('      · ' + nombre(e.X) + ' / ' + nombre(e.Y) + ': ' + e.por));
    }
  });
  if (fuera.length) console.log('\n  Con evaluación, pero fuera de la plantilla (se revisan leyendo): ' + fuera.join(', '));
  console.log('');
}

/* ⚠️ En papel, un pareado que cae en su propia fila se contesta sin leer:
   el 6 de la Columna A al lado de la F de la Columna B. Así salieron 52 fichas
   armadas por la misma herramienta —la permutación que usaba dejaba el 6 en su
   sitio— y ninguna sonda lo veía. La clave de la pauta dice qué letra va con
   cada número; si alguna es la de su propia fila, está mal. */
let alineadas = 0;
for (const f of fs.readdirSync(path.join(RAIZ, 'fichas')).filter(n => n.endsWith('.html')).sort()) {
  const h = fs.readFileSync(path.join(RAIZ, 'fichas', f), 'utf8');
  const m = h.match(/<span class="pt">IV\. Pareados:<\/span>\s*([^<]+)/);
  if (!m) continue;
  const clave = m[1].split(/,|&nbsp;/).map(x => x.trim()).filter(Boolean);
  const propias = clave.filter(x => { const k = x.match(/^(\d+)\.?\s*([A-J])$/); return k && 'ABCDEFGHIJ'[+k[1] - 1] === k[2]; });
  if (propias.length) { alineadas++; mal(f + ': el pareado ' + propias.join(', ') + ' cae en su propia fila (se contesta sin leer)'); }
}
if (!alineadas) console.log('✅ Pareados de las fichas: ninguno cae en su propia fila\n');

console.log((fallos ? '❌ ' : '✅ ') + fallos + ' fallo(s) · ' + revisadas.length + ' misión(es) revisada(s), ' + pendientes.length + ' pendiente(s)' +
  (TODAS ? '' : ' (--todas las mide)') + '\n');
process.exit(fallos ? 1 : 0);
