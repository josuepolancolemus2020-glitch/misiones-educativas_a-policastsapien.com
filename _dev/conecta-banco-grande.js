#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Conecta una misión de archivo propio al banco grande
   ------------------------------------------------------------
   El banco grande del examen conceptual (formas 31 a 50 con preguntas
   nuevas) lo reparte js/motor-misiones.js. La misión que usa la
   plantilla (js/motor-mision.js) no necesita nada: declara sus cuatro
   bancos nuevos y ya. Pero casi todas las misiones traen todavía su
   propio `genEval`, que saca las cinco preguntas de cada banco con el
   generador de siempre y se detiene en `EVAL_FORMAS`.

   Esta herramienta le hace a ese `genEval` el mismo cambio que tiene el
   de la plantilla, y ninguno más:

   · el tope del examen se le pregunta al motor (`evalFormasTotal`), y
     con el motor de antes guardado en el teléfono se queda en las formas
     de siempre;
   · de la última forma de antes en adelante, las preguntas de cada
     sección y el orden de las definiciones vienen ya repartidos
     (`_repartoConceptual`); hasta ahí se sacan igual que siempre, con la
     misma semilla y en el mismo orden, y por eso las formas con clave
     impresa no cambian.

   Se hace con una herramienta y no a mano para que las misiones no
   lleven cada una su versión del cambio: o entra entero, o no entra. Se
   niega si no encuentra cada trozo exactamente una vez.

   Los cuatro bancos nuevos (evalCPBankNuevo…) se escriben aparte, en el
   archivo de la misión; sin ellos la misión conectada sigue dando sus
   formas de siempre.

     node _dev/conecta-banco-grande.js <carpeta> …
   ============================================================ */
'use strict';

const fs = require('fs');
const L = require('./lib-formas.js');

const pedidas = process.argv.slice(2);
if (!pedidas.length) { console.error('✘ Dime qué misiones: node _dev/conecta-banco-grande.js <carpeta> …'); process.exit(2); }
const { dentro } = L.listarMisiones();
pedidas.forEach(s => { if (!dentro.includes(s)) { console.error('✘ ' + s + ' no es una misión del alcance'); process.exit(2); } });

const TOPE = `/* Hasta qué forma llega el examen conceptual. Con banco grande (los bancos
   evalCPBankNuevo, evalTFBankNuevo, evalMCBankNuevo y evalPRBankNuevo, que
   van junto a los de siempre), después de las formas de siempre (EVAL_FORMAS, las que tienen
   clave impresa) js/motor-misiones.js reparte formas nuevas. Si el teléfono
   se sirve de lo guardado el motor de antes, que no sabe repartirlas, el
   examen se queda en las de siempre. */
function evalFormasTotal(){return typeof _topeConceptual==='function'?_topeConceptual():EVAL_FORMAS;}
`;

/* [trozo de antes, trozo nuevo, dónde: en todo el archivo o solo en genEval] */
const CAMBIOS = [
  ["function _evalFormaSelector() { _injectFormaSel('genEval', 'evalFormaSel', evalFormNum, function (v) { evalFormNum = v; }); }",
    TOPE + "function _evalFormaSelector() { _injectFormaSel('genEval', 'evalFormaSel', evalFormNum, function (v) { evalFormNum = v; }, evalFormasTotal()); }", 'archivo'],
  ['if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf);',
    'const _topeF = evalFormasTotal(); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(_topeF, Math.max(1, parseInt(_selF.value, 10))); ' +
    '/* Una forma nueva guardada (la 45) y el motor de antes servido de lo guardado: se vuelve a una que exista. */ if (evalFormNum > _topeF) evalFormNum = _topeF; ' +
    'const cf = evalFormNum; const rng = _evalRng(cf); ' +
    '/* Las formas nuevas del banco grande llegan ya repartidas y no gastan la semilla de las de antes. */ ' +
    'const nuevaF = cf > EVAL_FORMAS ? _repartoConceptual(cf, EVAL_FORMAS, _bancoGrandeConceptual()) : null;', 'genEval'],
  ['evalFormNum = (evalFormNum % EVAL_FORMAS) + 1;', 'evalFormNum = (evalFormNum % _topeF) + 1;', 'genEval'],
  ['const cpItems=_pickF(evalCPBank,5, rng);', 'const cpItems=nuevaF?nuevaF.cp:_pickF(evalCPBank,5, rng);', 'genEval'],
  ['const tfItems=_pickF(evalTFBank,5, rng);', 'const tfItems=nuevaF?nuevaF.tf:_pickF(evalTFBank,5, rng);', 'genEval'],
  ['const mcItems=_pickF(evalMCBank,5, rng);', 'const mcItems=nuevaF?nuevaF.mc:_pickF(evalMCBank,5, rng);', 'genEval'],
  ['const prItems=_pickF(evalPRBank,5, rng);', 'const prItems=nuevaF?nuevaF.pr:_pickF(evalPRBank,5, rng);', 'genEval'],
  ['const shuffledDefs=_shuffleF(prItems, rng);', 'const shuffledDefs=nuevaF?nuevaF.defs:_shuffleF(prItems, rng);', 'genEval']
];

const veces = (texto, trozo) => texto.split(trozo).length - 1;

let hechas = 0;
pedidas.forEach(slug => {
  if (L.usaElMotor(slug)) { console.log('  · ' + slug + ': usa la plantilla (js/motor-mision.js), que ya sabe repartir el banco grande'); return; }
  const archivo = L.archivoPrincipal(slug);
  let src = fs.readFileSync(archivo, 'utf8');
  if (/function evalFormasTotal\(/.test(src)) { console.log('  · ' + slug + ': ya estaba conectada'); return; }

  /* `genEval` va de su cabecera a la del examen que le sigue: los trozos
     del sorteo se buscan solo ahí, porque la prueba operativa y la crítica
     tienen líneas parecidas con sus propios bancos. */
  const ini = src.indexOf('function genEval(){');
  const fin = src.indexOf('\nfunction ', ini + 1);
  if (ini < 0 || fin < 0) { console.error('✘ ' + slug + ': no encuentro su genEval'); process.exit(1); }
  let antes = src.slice(0, ini), gen = src.slice(ini, fin), despues = src.slice(fin);

  CAMBIOS.forEach(([viejo, nuevo, donde]) => {
    const n = donde === 'genEval' ? veces(gen, viejo) : veces(antes, viejo) + veces(gen, viejo) + veces(despues, viejo);
    if (n !== 1) { console.error('✘ ' + slug + ': se esperaba una vez y está ' + n + ' → ' + viejo.slice(0, 70) + '…\n  Su genEval no es el de siempre: se conecta leyéndolo, no con esta herramienta.'); process.exit(1); }
  });
  CAMBIOS.forEach(([viejo, nuevo, donde]) => {
    if (donde === 'genEval') gen = gen.replace(viejo, () => nuevo);
    else { antes = antes.replace(viejo, () => nuevo); despues = despues.replace(viejo, () => nuevo); }
  });
  fs.writeFileSync(archivo, antes + gen + despues, 'utf8');
  hechas++;
  console.log('  ✔ ' + slug + ': su examen conceptual le pregunta al motor hasta qué forma llega');
});

console.log('\n' + (hechas ? '✅ ' + hechas + ' misión(es) conectada(s). Falta escribirles sus cuatro bancos nuevos.' : '· No se cambió ninguna.'));
