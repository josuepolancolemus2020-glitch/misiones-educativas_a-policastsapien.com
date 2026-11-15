#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · El banco grande del examen conceptual
   ------------------------------------------------------------
   El examen conceptual saca cinco preguntas de cada banco de diez. El
   alumno que se aprende las primeras formas se sabe el banco entero, y
   de la Forma 31 en adelante aprobaría de memoria. La misión que trae
   un banco NUEVO al lado del de siempre (evalCPBankNuevo…) ofrece
   formas nuevas, repartidas por el motor (`_repartoConceptual`).

   Esta sonda carga la misión de verdad, genera todas sus formas con su
   `genEval` y DICE dos números, que es para lo que se pidió:

     · cuántas formas conceptuales distintas hay;
     · qué porcentaje de las preguntas de las formas nuevas viene del
       banco nuevo.

   Y se pone roja si:

   1. una forma de antes ya no sale como su referencia (hay clave
      impresa; lo mira entero `verifica-formas-oro.js`, aquí se repite
      el dato porque es lo primero que rompe un banco mal añadido);
   2. dos formas, de la 1 a la última, llevan el mismo conjunto de
      preguntas;
   3. una forma nueva no trae de cada sección las preguntas nuevas que
      el motor dice (hoy tres de cinco), o trae una que no es de ninguno
      de los dos bancos;
   4. una pregunta del banco nuevo no cae en ninguna forma nueva: sería
      una pregunta escrita para nada;
   5. la respuesta correcta se amontona en una letra: más de dos de las
      cinco selecciones de una hoja, o más del 40 % entre todas las
      formas nuevas o en el banco nuevo tal como está escrito;
   6. un pareado de una forma nueva deja la definición en la fila de su
      término (se contesta sin leer);
   7. una pregunta nueva no dice su dato (`k`) o de dónde salió
      (`fuente`: la ficha, la guía o una actividad de la misión);
   8. una forma no sale igual dos veces.

   Que ninguna pregunta le regale la respuesta a otra lo mide
   `verifica-examen-sin-pistas.js`.

     node _dev/verifica-conceptual-banco-grande.js              → todas
     node _dev/verifica-conceptual-banco-grande.js <carpeta>    → una
     … --formas 31,40,50    → además escribe esas formas, para leerlas
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./lib-formas.js');

const args = process.argv.slice(2);
const iFormas = args.indexOf('--formas');
const aLeer = iFormas >= 0 ? String(args[iFormas + 1] || '').split(',').map(Number).filter(Boolean) : [];
const pedidas = args.filter((a, i) => !a.startsWith('--') && i !== iFormas + 1);

const LIMITE = 0.4;                       /* ninguna letra pasa del 40 % */
const SECCIONES = [['cp', 'Completar'], ['tf', 'Verdadero o falso'], ['mc', 'Selección'], ['pr', 'Pareados']];
const BANCO = { cp: 'evalCPBank', tf: 'evalTFBank', mc: 'evalMCBank', pr: 'evalPRBank' };
const FUENTE = /^(Ficha, página \d|Guía \(Aprende\)|Actividad )/;

let fallos = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const bien = m => console.log('  ✅ ' + m);
const pct = (n, de) => de ? Math.round(1000 * n / de) / 10 : 0;

/* Las misiones con banco grande se reconocen sin cargarlas: su archivo de
   bancos declara los cuatro nuevos. Cargar las 85 para saber que 84 no lo
   traen costaría un minuto en cada `npm test`. */
const { dentro } = L.listarMisiones();
const tieneGrande = slug => {
  const dir = path.join(L.DIR_MISIONES, slug, 'js');
  return fs.readdirSync(dir).filter(f => f.endsWith('.js') && !/html2canvas/.test(f))
    .some(f => /(?:const|let|var)\s+evalCPBankNuevo\s*=/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
};
pedidas.forEach(s => { if (!dentro.includes(s)) { console.error('✘ ' + s + ' no es una misión del alcance'); process.exit(2); } });
const conGrande = (pedidas.length ? pedidas : dentro).filter(tieneGrande);

console.log('\n🧮 El banco grande del examen conceptual\n');

/* Todas las formas conceptuales de una misión, con su `genEval`. La forma
   se le pide poniéndola en su variable: el selector de la página de mentira
   no manda, y así no depende de pedirlas en orden. */
function formasDe(slug, semilla) {
  const m = L.cargarMision(slug, semilla);
  const formas = {};
  for (let n = 1; n <= m.topeConceptual; n++) {
    m.correr('evalFormNum = ' + n, 'forma pedida');
    const f = m.forma('conceptual', n);
    const salio = m.correr('window._currentEvalForm', 'forma que salió');
    if (salio !== n) throw new Error('se pidió la Forma ' + n + ' y salió la ' + salio);
    formas[n] = f;
  }
  return { m, formas };
}

/* El conjunto de una forma: los datos (`k`) que pregunta, sin el orden. */
const conjunto = d => SECCIONES.map(([s]) => (s === 'pr' ? d.pr.terms : d[s]).map(it => it.k).sort().join(',')).join('|');

function escribeForma(n, d) {
  console.log('\n  ──────── Forma ' + n + ' ────────');
  console.log('  I. Completar');
  d.cp.forEach((it, i) => console.log('    ' + (i + 1) + '. ' + it.q + '   [' + it.a + ']' + (it.fuente ? ' · nueva' : '')));
  console.log('  II. Verdadero o falso');
  d.tf.forEach((it, i) => console.log('    ' + (i + 6) + '. ' + it.q + '   [' + (it.a ? 'V' : 'F') + ']' + (it.fuente ? ' · nueva' : '')));
  console.log('  III. Selección');
  d.mc.forEach((it, i) => console.log('    ' + (i + 11) + '. ' + it.q + '  ' + it.o.join('  ') + '   [' + 'abcdef'[it.a] + ']' + (it.fuente ? ' · nueva' : '')));
  console.log('  IV. Pareados');
  d.pr.terms.forEach((it, i) => console.log('    ' + (i + 16) + '. ' + it.term + '   [' + d.pr.letters[d.pr.shuffledDefs.findIndex(x => x.def === it.def)] + ']' + (it.fuente ? ' · nueva' : '')));
  d.pr.shuffledDefs.forEach((it, i) => console.log('       ' + d.pr.letters[i] + '. ' + it.def));
}

conGrande.forEach(slug => {
  console.log('📘 ' + slug);
  let a, b;
  try { a = formasDe(slug, 7); b = formasDe(slug, 2654435761); }
  catch (e) { mal('no se pudieron generar sus formas: ' + String(e.message).split('\n')[0]); return; }
  const m = a.m, deAntes = m.tope, total = m.topeConceptual;
  const datos = {};
  Object.keys(a.formas).forEach(n => { datos[n] = a.formas[n].dato; });
  const nuevasN = []; for (let n = deAntes + 1; n <= total; n++) nuevasN.push(n);
  const bancos = L.bancosDe(m);
  const porSeccion = m.correr('MotorMisiones.conceptual.nuevasPorSeccion', 'cuota');

  if (total <= deAntes) { mal('trae banco nuevo y no ofrece ninguna forma nueva (sigue en ' + deAntes + ')'); return; }

  /* 8 · sale igual dos veces */
  const cambia = Object.keys(datos).filter(n => JSON.stringify(datos[n]) !== JSON.stringify(b.formas[n].dato) || a.formas[n].impreso !== b.formas[n].impreso);
  if (cambia.length) mal('no salen igual dos veces las formas ' + cambia.join(', ') + ': dependen del azar o de la fecha');
  else bien('las ' + total + ' formas salen igual cada vez que se generan, en pantalla y en la hoja impresa');

  /* 1 · las de antes, como su referencia */
  const oro = L.leerOro(slug);
  if (!oro || !oro.pruebas.conceptual) mal('no tiene referencia de sus formas de antes (_dev/formas-oro/)');
  else {
    const movidas = [];
    for (let n = 1; n <= deAntes; n++) if (!oro.pruebas.conceptual[n] || JSON.stringify(oro.pruebas.conceptual[n].dato) !== JSON.stringify(datos[n])) movidas.push(n);
    if (movidas.length) mal('cambiaron formas con clave impresa: ' + movidas.join(', ') + '. No se vuelve a congelar: se deshace el cambio');
    else bien('las formas 1 a ' + deAntes + ' son idénticas a su referencia: las claves impresas siguen valiendo');
  }

  /* 2 · ninguna repite conjunto */
  const vistos = {}, repiten = [];
  Object.keys(datos).map(Number).forEach(n => { const c = conjunto(datos[n]); if (c in vistos) repiten.push(n + ' = ' + vistos[c]); else vistos[c] = n; });
  const distintas = Object.keys(vistos).length;
  if (repiten.length) mal('formas con el mismo conjunto de preguntas: ' + repiten.join('; '));
  else bien(distintas + ' formas conceptuales distintas: ninguna de las ' + total + ' lleva el conjunto de preguntas de otra');

  /* 3 · la cuota de nuevas, y todo del banco */
  const kNuevas = {}, textoDe = {};
  SECCIONES.forEach(([s]) => {
    kNuevas[s] = new Set((bancos[BANCO[s] + 'Nuevo'] || []).map(it => it.k));
    (bancos[BANCO[s]] || []).concat(bancos[BANCO[s] + 'Nuevo'] || []).forEach(it => { textoDe[it.k] = it.q || (it.term + '|' + it.def); });
  });
  const usadas = new Set(), malCuota = [], ajenas = [];
  let nNuevas = 0, nPreguntas = 0, minimo = Infinity;
  nuevasN.forEach(n => {
    let enEsta = 0;
    SECCIONES.forEach(([s, nombre]) => {
      const items = s === 'pr' ? datos[n].pr.terms : datos[n][s];
      const suyas = items.filter(it => kNuevas[s].has(it.k));
      suyas.forEach(it => usadas.add(it.k));
      enEsta += suyas.length; nPreguntas += items.length;
      if (suyas.length !== porSeccion) malCuota.push('Forma ' + n + ', ' + nombre + ': ' + suyas.length + ' nuevas');
      items.forEach(it => { if (textoDe[it.k] !== (it.q || (it.term + '|' + it.def))) ajenas.push('Forma ' + n + ', ' + nombre + ': ' + JSON.stringify(it).slice(0, 80)); });
    });
    nNuevas += enEsta; minimo = Math.min(minimo, enEsta);
  });
  if (ajenas.length) mal('preguntas que no están en ninguno de los dos bancos: ' + ajenas.slice(0, 3).join(' · '));
  if (malCuota.length) mal('cada sección de una forma nueva lleva ' + porSeccion + ' preguntas del banco nuevo, y no es así en: ' + malCuota.slice(0, 5).join(' · '));
  else bien(pct(nNuevas, nPreguntas) + ' % de las preguntas de las formas ' + (deAntes + 1) + ' a ' + total + ' viene del banco nuevo (' + nNuevas + ' de ' + nPreguntas +
    '): ' + minimo + ' de 20 en cada forma, ' + porSeccion + ' de 5 en cada sección');

  /* Las formas de antes no llevan ninguna: es lo que impide que una nueva repita a una de antes. */
  const coladas = [];
  for (let n = 1; n <= deAntes; n++) SECCIONES.forEach(([s]) => (s === 'pr' ? datos[n].pr.terms : datos[n][s]).forEach(it => { if (kNuevas[s].has(it.k)) coladas.push(n); }));
  if (coladas.length) mal('las formas de antes ' + [...new Set(coladas)].join(', ') + ' llevan preguntas del banco nuevo');

  /* 4 · ninguna pregunta nueva se queda sin usar */
  const todasNuevas = [].concat(...SECCIONES.map(([s]) => [...kNuevas[s]]));
  const sinUsar = todasNuevas.filter(k => !usadas.has(k));
  if (sinUsar.length) mal('preguntas del banco nuevo que no caen en ninguna forma nueva: ' + sinUsar.join(', '));
  else bien('las ' + todasNuevas.length + ' preguntas del banco nuevo caen en alguna forma nueva (' +
    SECCIONES.map(([s, nombre]) => kNuevas[s].size + ' de ' + nombre.toLowerCase()).join(', ') + ')');

  /* 5 · la correcta, repartida entre las letras */
  const cuenta = [0, 0, 0, 0, 0, 0], amontonan = [];
  nuevasN.forEach(n => {
    const enHoja = [0, 0, 0, 0, 0, 0];
    datos[n].mc.forEach(it => { cuenta[it.a]++; enHoja[it.a]++; });
    const tope = Math.floor(datos[n].mc.length * LIMITE + 1e-9);
    enHoja.forEach((c, i) => { if (c > tope) amontonan.push('Forma ' + n + ': ' + c + ' en la ' + 'abcdef'[i]); });
    datos[n].mc.forEach(it => { if (it.o.some((o, i) => !new RegExp('^' + 'abcdef'[i] + '\\) ').test(o))) amontonan.push('Forma ' + n + ': las letras de «' + it.q + '» no van en orden'); });
  });
  const totalMc = cuenta.reduce((x, y) => x + y, 0);
  const reparto = cuenta.map((c, i) => c ? 'abcdef'[i] + ' ' + pct(c, totalMc) + ' %' : '').filter(Boolean).join(', ');
  cuenta.forEach((c, i) => { if (c / totalMc > LIMITE) amontonan.push('entre todas, la ' + 'abcdef'[i] + ' lleva el ' + pct(c, totalMc) + ' %'); });
  const escrito = [0, 0, 0, 0, 0, 0], bancoMc = bancos.evalMCBankNuevo || [];
  bancoMc.forEach(it => { escrito[it.a]++; });
  escrito.forEach((c, i) => { if (bancoMc.length && c / bancoMc.length > LIMITE) amontonan.push('en el banco nuevo, tal como está escrito, la ' + 'abcdef'[i] + ' lleva el ' + pct(c, bancoMc.length) + ' %'); });
  if (amontonan.length) mal('la respuesta correcta se amontona: ' + amontonan.slice(0, 5).join(' · '));
  else bien('la correcta está repartida entre las letras en las formas nuevas (' + reparto + '), y en ninguna hoja pasa de dos de cinco');

  /* 6 · pareados fuera de su fila */
  const enFila = [];
  nuevasN.forEach(n => datos[n].pr.terms.forEach((it, i) => { if (datos[n].pr.shuffledDefs[i].def === it.def) enFila.push('Forma ' + n + ': ' + it.term); }));
  if (enFila.length) mal('pareados con la definición en su misma fila: ' + enFila.slice(0, 5).join(' · '));
  else bien('en las formas nuevas ningún pareado deja la definición en la fila de su término');

  /* 7 · cada pregunta nueva dice su dato y de dónde salió */
  const sinDatos = [];
  SECCIONES.forEach(([s]) => (bancos[BANCO[s] + 'Nuevo'] || []).forEach((it, i) => {
    if (!it.k) sinDatos.push(BANCO[s] + 'Nuevo[' + i + '] sin `k`');
    if (!it.fuente || !String(it.fuente).split(' · ').every(f => FUENTE.test(f))) sinDatos.push(BANCO[s] + 'Nuevo[' + i + '] sin `fuente` (Ficha, página N… · Guía (Aprende)… · Actividad …)');
  }));
  if (sinDatos.length) mal('preguntas nuevas sin anotar: ' + sinDatos.slice(0, 5).join(' · '));
  else bien('cada pregunta nueva anota su dato y de dónde salió: la ficha, la guía o una actividad de la misión');

  aLeer.filter(n => datos[n]).forEach(n => escribeForma(n, datos[n]));
  console.log('');
});

if (!conGrande.length) console.log('  Ninguna misión trae banco grande todavía.\n');
const sinGrande = (pedidas.length ? pedidas : dentro).length - conGrande.length;
console.log((fallos ? '❌ ' : '✅ ') + fallos + ' fallo(s) · ' + conGrande.length + ' misión(es) con banco grande' +
  (sinGrande ? ', ' + sinGrande + ' con sus formas de siempre' : '') + '\n');
process.exit(fallos ? 1 : 0);
