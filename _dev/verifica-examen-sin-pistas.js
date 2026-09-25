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
   3. Las 30 formas, armadas con EL MISMO generador de la misión
      (su _evalRng y su _pickF, leídos del archivo), sin un choque.
   4. La ficha imprimible, con la misma regla: todas sus preguntas
      son UNA prueba y se reparten juntas.

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

function cuerpoDe(src, nombreFn) {
  const m = new RegExp('function\\s+' + nombreFn + '\\s*\\(').exec(src);
  if (!m) return null;
  const llave = src.indexOf('{', m.index);
  return trozoBalanceado(src, llave);
}

/* El generador de formas de la misión, tal cual está escrito: si mañana
   cambia la semilla o el barajado, la sonda arma las formas nuevas y no
   unas que ya no existen. */
function generador(src) {
  const rng = src.match(/function\s+_evalRng\s*\([^)]*\)\s*\{/);
  const sh = src.match(/const\s+_shuffleF\s*=[^\n]*/);
  const pk = src.match(/const\s+_pickF\s*=[^\n]*/);
  if (!rng || !sh || !pk) return null;
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
function itemsConceptual(b) {
  const L = [];
  (b.evalCPBank || []).forEach((it, i) => L.push({ banco: 'evalCPBank', i, k: it.k, tipo: 'completar',
    visible: it.q.replace(/_{2,}/g, ' '), resp: it.a, ctx: it.q }));
  (b.evalTFBank || []).forEach((it, i) => L.push({ banco: 'evalTFBank', i, k: it.k, tipo: 'vf',
    visible: it.q, resp: '', ctx: '' }));
  (b.evalMCBank || []).forEach((it, i) => {
    const ops = (it.o || []).map(o => String(o).replace(/^[a-e]\)\s*/i, ''));
    L.push({ banco: 'evalMCBank', i, k: it.k, tipo: 'seleccion',
      visible: it.q + ' ' + ops.join(' · '), resp: ops[it.a] || '', ctx: it.q });
  });
  (b.evalPRBank || []).forEach((it, i) => L.push({ banco: 'evalPRBank', i, k: it.k, tipo: 'pareado',
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
  for (let f = 1; f <= gen.formas; f++) {
    const r = gen.rng(rec.desplaza + f);
    const hoja = [];
    for (const p of rec.picks) {
      const arr = bancos[p.banco];
      if (!Array.isArray(arr)) continue;
      gen.pick(arr.map((_, i) => i), p.n, r).forEach(i => { if (porBanco[p.banco] && porBanco[p.banco][i]) hoja.push(porBanco[p.banco][i]); });
    }
    const ch = revisaPares(hoja, () => true, tema, titulo);
    if (ch.length) { malas++; if (ejemplos.length < 3) ejemplos.push({ f, ch: ch[0] }); }
  }
  return { malas, ejemplos, fiel: rec.fiel };
}

/* ── La ficha imprimible ─────────────────────────────────────────
   Se lee la plantilla de siempre: completar, verdadero o falso,
   selección múltiple, pareados —se llamen «IV. Términos pareados» o
   «IV. Relaciona (Pareados)»— y la pauta con sus claves. Lo que no
   tenga esa forma se deja para leer a mano, y se dice. */
const limpiaHtml = html => String(html).replace(/<span class="linea-resp"[^>]*><\/span>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/_{2,}/g, ' ').replace(/\s+/g, ' ').trim();
const sinLetra = t => t.replace(/^[a-e](?:\)|\s)\s*/i, '');

/* El bloque que abre en `desde`, con sus <div> anidados. */
function divEntero(html, desde) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = desde;
  let prof = 0, m;
  while ((m = re.exec(html))) {
    prof += m[0] === '</div>' ? -1 : 1;
    if (prof === 0) return html.slice(desde, m.index + 6);
  }
  return html.slice(desde);
}

/* Las fichas no numeran igual sus secciones —«I. Completa los espacios»,
   «8. Completa»—, así que se buscan por lo que son y no por su número.
   ⚠️ Y no todas usan el mismo encabezado: las de los tres poderes y la
   Constitución numeran la ficha entera en `<h2>` con su emoji delante
   («✏️ 8. Completa», «🔗 11. Pareados») y escriben cada pregunta en un
   bloque `.preg`, no en un `<li>`. Sin leer esa forma, la sonda se rendía
   con un «se revisa leyéndola» y dos fichas enteras quedaban sin vigilar. */
const TITULO = {
  completa: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Complet/,
  vf: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Verdadero/,
  seleccion: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*Selecci/,
  pareados: /<h[23][^>]*>\s*(?:[^\s<\w]+\s*)?(?:[IVX]+|\d+)\.\s*(?:T[ée]rminos|Relaciona|Pareados|Une)/
};

function itemsFicha(html) {
  const donde = k => { const m = TITULO[k].exec(html); return m ? m.index : -1; };
  const sec = k => {
    const i = donde(k);
    if (i < 0) return null;
    const resto = html.slice(i + 1);
    const fin = resto.search(/<h3[\s>]|<h2[\s>]|<div class="pauta"|class="felic"/);
    return fin < 0 ? resto : resto.slice(0, fin);
  };
  /* Una pregunta es un <li> o, en la otra forma, un `.preg-q` con su número. */
  const lis = t => {
    if (!t) return [];
    const L = [...t.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
    return L.length ? L : [...t.matchAll(/<div class="preg-q"><span class="preg-n">\d+<\/span>([\s\S]*?)<\/div>/g)].map(m => m[1]);
  };
  const iPauta = html.search(/<div class="pauta"/);
  const bloquePauta = iPauta < 0 ? '' : divEntero(html, iPauta);
  const lineaPauta = re => { const m = bloquePauta.match(re); return m ? limpiaHtml(m[1]) : ''; };

  const I = lis(sec('completa'));
  const II = lis(sec('vf'));
  const iIII = donde('seleccion'), iIV = donde('pareados');
  if (!I.length || !II.length || iIII < 0 || iIV < 0 || iIV < iIII || !bloquePauta) return null;

  /* La selección múltiple sigue a veces en la hoja siguiente: se toman los
     bloques .preg que hay entre el título de la selección y el de los pareados. */
  const pregs = [...html.slice(iIII, iIV).matchAll(/<div class="preg-q">([\s\S]*?)<\/div>\s*<div class="preg-ops">([\s\S]*?)<\/div>/g)]
    .map(m => ({ q: limpiaHtml(m[1].replace(/<span class="preg-n">\d+<\/span>/, '')),
      ops: [...m[2].matchAll(/<span class="op[^"]*">([\s\S]*?)<\/span>/g)].map(o => sinLetra(limpiaHtml(o[1]))) }));

  const filas = [...(sec('pareados') || '').matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g)]
    .map(m => ({ a: limpiaHtml(m[1]).replace(/^\d+\.\s*/, ''), b: limpiaHtml(m[2]) }));

  const pI = lineaPauta(/Complet[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const pIII = lineaPauta(/Selecci[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const pIV = lineaPauta(/(?:Pareados|Relaciona)[^:<]*:\s*<\/span>([\s\S]*?)<\/div>/);
  const respI = {};
  [...pI.matchAll(/(\d+)\.\s*(.+?)(?=\s+\d+\.\s|$)/g)].forEach(m => { respI[+m[1]] = m[2].trim(); });
  const respIII = {};
  [...pIII.matchAll(/(\d+)\s*([a-e])\b/g)].forEach(m => { respIII[+m[1]] = 'abcde'.indexOf(m[2]); });
  const respIV = {};
  [...pIV.matchAll(/(\d+)\s*([A-J])\b/g)].forEach(m => { respIV[+m[1]] = m[2]; });

  const L = [];
  I.forEach((li, i) => L.push({ banco: 'ficha I', i: i + 1, tipo: 'completar', visible: limpiaHtml(li), resp: respI[i + 1] || '', ctx: limpiaHtml(li) }));
  II.forEach((li, i) => L.push({ banco: 'ficha II', i: i + 1, tipo: 'vf', visible: limpiaHtml(li), resp: '', ctx: '' }));
  pregs.forEach((p, i) => L.push({ banco: 'ficha III', i: i + 1, tipo: 'seleccion', visible: p.q + ' ' + p.ops.join(' · '),
    resp: respIII[i + 1] >= 0 ? p.ops[respIII[i + 1]] || '' : '', ctx: p.q }));
  const defPorLetra = {};
  filas.forEach(f => { const m = f.b.match(/^([A-J])\.\s*(.*)$/); if (m) defPorLetra[m[1]] = m[2]; });
  let terminos = filas.filter(f => !/^Columna/i.test(f.a)).map(f => f.a);
  /* Hay fichas que ponen los pareados en DOS listas en vez de una tabla —la
     del Himno: «Columna A — Palabra del Himno» y «Columna B — Qué significa»—.
     Sin leerlas, la sonda contaba 30 preguntas donde hay 40 y daba por limpia
     una sección que no había mirado. */
  if (!terminos.length) {
    const listas = [...(sec('pareados') || '').matchAll(/<ol\b([^>]*)>([\s\S]*?)<\/ol>/g)];
    const colA = listas.find(l => !/type="A"/.test(l[1])), colB = listas.find(l => /type="A"/.test(l[1]));
    if (colA && colB) {
      terminos = [...colA[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => limpiaHtml(m[1]));
      [...colB[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].forEach((m, i) => { defPorLetra['ABCDEFGHIJ'[i]] = limpiaHtml(m[1]); });
    }
  }
  terminos.forEach((t, i) => {
    const def = defPorLetra[respIV[i + 1]] || '';
    L.push({ banco: 'ficha IV', i: i + 1, tipo: 'pareado', visible: t + ' · ' + def, term: t, def, resp: '', ctx: '' });
  });
  const faltan = !Object.keys(respI).length || !Object.keys(respIII).length || !Object.keys(respIV).length;

  /* ⚠️ La teoría que comparte HOJA con las actividades. Se encontró
     mirando la ficha de Aspectos Cívicos impresa: la hoja 4 lleva arriba la
     tabla de las fechas y el «Así sí / Así no», y debajo el completar. Una
     pregunta por el 15 de septiembre se contestaba leyendo la misma hoja, y
     el maestro que fotocopia las hojas de la prueba no puede separarlas. */
  const iAct = Math.min(...[html.search(/<h2[^>]*>[^<]*Actividades/), donde('completa')].filter(i => i >= 0));
  const iHoja = html.lastIndexOf('<section class="pagina"', iAct);
  const teoria = iHoja >= 0 && isFinite(iAct) ? limpiaHtml(html.slice(iHoja, iAct)) : '';
  return { items: L, faltan, teoria };
}

function fichaDe(dir, html) {
  const m = html.match(/fichas\/(ficha-[A-Za-z0-9._-]+\.html)/);
  if (!m) return null;
  const p = path.join(RAIZ, 'fichas', m[1]);
  return fs.existsSync(p) ? p : null;
}

/* ── Recorrer las misiones ──────────────────────────────────────── */
const revisadas = [], pendientes = [], fuera = [];

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
  const src = sinComentarios(fs.readFileSync(archivo, 'utf8'));
  const nombresC = ['evalCPBank', 'evalTFBank', 'evalMCBank', 'evalPRBank'];
  const nombresK = ['critCaseBank', 'critErrorBank', 'critDecisionBank', 'critCompareBank', 'critCauseBank', 'critEffectBank'];
  const bancos = {};
  [...nombresC, ...nombresK].forEach(n => { const b = banco(src, n); if (b) bancos[n] = b; });
  const conceptual = itemsConceptual(bancos);
  const conK = conceptual.filter(it => it.k).length;
  const htmlArchivo = fs.readdirSync(path.join(MIS, dir)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));
  const html = htmlArchivo ? fs.readFileSync(path.join(MIS, dir, htmlArchivo), 'utf8') : '';
  const ficha = fichaDe(dir, html);
  const m = { dir, archivo, src, bancos, conceptual, ficha, titulo: palabrasTitulo(html) };
  if (conK === 0) pendientes.push(m);
  else revisadas.push(m);
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
    r.conceptual.total = gen.formas;
    if (exigir) {
      if (r.conceptual.malas) mal('Conceptual: ' + r.conceptual.malas + ' de las ' + gen.formas + ' formas llevan un choque');
      else bien('Conceptual: las ' + gen.formas + ' formas, armadas con el generador de la misión, sin un choque');
    }
  }

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
      const sinK = itemsK.filter(it => !it.k && it.banco !== 'critDecisionBank');
      sinK.slice(0, 5).forEach(it => mal('Pensamiento crítico, sin `k`: ' + nombre(it)));
      chK.forEach(c => mal('Pensamiento crítico: ' + nombre(c.X) + ' y ' + nombre(c.Y) + ': ' + c.por));
      if (!sinK.length && !chK.length) bien('Pensamiento crítico: ' + itemsK.length + ' casos, errores, comparaciones, causas y efectos sin pistas cruzadas');
    }
    if (gen) {
      r.critico = formasConChoque(gen, recK, m.bancos, itemsK.map(it => it), temaK, m.titulo);
      r.critico.total = gen.formas;
      if (exigir) {
        if (r.critico.malas) mal('Pensamiento crítico: ' + r.critico.malas + ' de las ' + gen.formas + ' formas llevan un choque');
        else bien('Pensamiento crítico: las ' + gen.formas + ' formas sin un choque');
      }
    }
  }

  /* 3 · La ficha */
  if (m.ficha) {
    const htmlFicha = fs.readFileSync(m.ficha, 'utf8');
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

console.log((fallos ? '❌ ' : '✅ ') + fallos + ' fallo(s) · ' + revisadas.length + ' misión(es) revisada(s), ' + pendientes.length + ' pendiente(s)' +
  (TODAS ? '' : ' (--todas las mide)') + '\n');
process.exit(fallos ? 1 : 0);
