#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La prueba de pensamiento crítico no repite forma
   ------------------------------------------------------------
   La prueba de pensamiento crítico sacaba sus casos al azar, y el azar
   repite: de las 30 formas de La Célula solo 26 eran distintas. Un
   maestro que reparte la Forma 4 y la Forma 19 para que dos alumnos de
   la misma banca no se copien les estaba dando la misma hoja.

   Ahora las formas no se sortean, se reparten
   (`_repartoCritica`, en js/motor-misiones.js). Esto lo vigila:

   1. EL REPARTO. Con bancos de mentira de todos los tamaños que hay en
      las misiones: ninguna forma repite el conjunto de otra hasta agotar
      TODAS las combinaciones del banco, la misma forma sale igual dos
      veces y los bancos no se tocan.
   2. CADA MISIÓN que ya reparte (declara `critApartados`), con su
      código de verdad y de la Forma 1 a la última:
        · ninguna forma trae los mismos casos que otra;
        · todo lo que trae la hoja está escrito en un banco de su misión,
          y cada caso sale del banco de SU apartado;
        · la misión pinta lo que el motor repartió, sin sacar nada por su
          cuenta;
        · llega a la Forma 50. Si su banco no alcanza, se pone roja y
          dice cuántas da: no se inventan preguntas para rellenar;
        · si tiene versión en inglés, sus bancos tienen el mismo tamaño,
          que es lo que hace que la Forma 7 sea la misma en los dos idiomas.
   3. LAS QUE FALTAN. Las misiones pasan al reparto por tandas. Las que
      todavía sacan al azar se nombran y no ponen la sonda en rojo: su
      deuda la cuenta `verifica-formas-oro.js`.

   Que las formas ya congeladas sigan idénticas lo comprueba
   `verifica-formas-oro.js`. Esta mira que no se repitan.

     node _dev/verifica-critica-sin-repetir.js              → todas
     node _dev/verifica-critica-sin-repetir.js <carpeta>    → una
     node _dev/verifica-critica-sin-repetir.js --tabla      → y cuántas veces sale cada caso
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const L = require('./lib-formas.js');

const args = process.argv.slice(2);
const TABLA = args.includes('--tabla');
const pedidas = args.filter(a => !a.startsWith('--'));

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log('      ' + detalle); }
};

/* ── 1 · el reparto ──────────────────────────────────────────── */
console.log('— El reparto del motor —');
const MOTOR = path.join(L.RAIZ, 'js', 'motor-misiones.js');
const ventana = { document: {}, location: { search: '' }, URLSearchParams };
ventana.window = ventana;
vm.createContext(ventana);
vm.runInContext(fs.readFileSync(MOTOR, 'utf8'), ventana, { filename: MOTOR });
const reparto = ventana._repartoCritica, conjuntos = ventana._conjuntosCritica, formasDe = ventana._formasCritica;
ok('el motor publica _repartoCritica, _formasCritica, _conjuntosCritica, _turnoCritica y _selectorCritica',
  ['_repartoCritica', '_formasCritica', '_conjuntosCritica', '_turnoCritica', '_selectorCritica'].every(n => typeof ventana[n] === 'function'));

/* Bancos de mentira: lo que importa del reparto es el tamaño de cada
   banco y cuántos saca, no lo que dicen los casos. */
const bancosDeMentira = tamanos => tamanos.map(([n, k], i) => [Array.from({ length: n }, (_, j) => 'a' + i + '-c' + j), k]);
/* El conjunto de una forma: los casos de cada apartado, sin su orden. */
const conjuntoDe = casos => JSON.stringify(casos.map(c => c.slice().sort()));

/* Los tamaños de verdad se recogen más abajo, misión por misión, y se
   prueban aquí junto con unos cuantos escogidos para los bordes. */
const tamanosVistos = new Map();
const probarTamanos = (tamanos, de) => {
  const llave = JSON.stringify(tamanos);
  if (!tamanosVistos.has(llave)) tamanosVistos.set(llave, de);
};
[
  [[2, 1]], [[1, 1], [1, 1]], [[3, 3], [2, 2]], [[2, 1], [2, 1], [2, 1]], [[5, 1], [5, 1], [5, 1]],
  [[4, 2], [4, 3], [3, 1]], [[7, 3], [2, 1]], [[1, 1], [6, 3], [1, 1], [2, 1]], [[3, 1], [1, 1], [3, 2], [1, 1], [4, 1]]
].forEach(t => probarTamanos(t, 'de borde'));

/* ── 2 · cada misión ─────────────────────────────────────────── */
const { dentro } = L.listarMisiones();
pedidas.forEach(s => { if (!dentro.includes(s)) { console.error('✘ ' + s + ' no es una misión del alcance'); process.exit(2); } });
const lista = pedidas.length ? pedidas : dentro;
const listaPendiente = fs.existsSync(L.RUTA_PENDIENTE) ? JSON.parse(fs.readFileSync(L.RUTA_PENDIENTE, 'utf8')) : {};
const sueltosSabidos = listaPendiente.fueraDeBanco || {};

const filas = [], faltan = [], fallosMision = [];
const falla = (slug, que) => fallosMision.push(slug + ': ' + que);
let conCritica = 0;

lista.forEach(slug => {
  let m;
  try { m = L.cargarMision(slug, 7); } catch (e) { falla(slug, 'no carga: ' + String(e.message).split('\n')[0]); return; }
  if (!m.pruebas.includes('critica')) return;
  conCritica++;
  if (!m.reparteCritica) { faltan.push(slug); return; }

  /* Los apartados, tal como los declara la misión: de cada uno, el nombre
     de su banco (si es un banco con nombre), su tamaño y cuántos saca. */
  const bancos = L.bancosDe(m);
  const apartados = JSON.parse(m.correr('JSON.stringify(critApartados().map(function (a) { return { n: a[0].length, saca: a[1] }; }))', 'apartados'));
  probarTamanos(apartados.map(a => [a.n, a.saca]), slug);
  const tope = m.topeCritica, posibles = m.conjuntosCritica;

  if (tope < 50) falla(slug, 'su banco solo da ' + posibles + ' conjuntos distintos: la prueba crítica llega a la Forma ' + tope + ' y no a la 50. Faltan casos, y los casos los aprueba Josué; no se inventan.');

  /* Cada caso, del banco de su apartado. Se mira dentro de la misión, por
     identidad: que el texto exista en otro banco no vale. */
  const ajenos = m.correr('(function () { var ap = critApartados(), malos = []; for (var f = 1; f <= ' + tope + '; f++) { _repartoCritica(f, ap).forEach(function (casos, i) { if (casos.length !== ap[i][1] || !casos.every(function (c) { return ap[i][0].indexOf(c) >= 0; })) malos.push(f + "/" + (i + 1)); }); } return malos.join(" "); })()', 'ajenos');
  if (ajenos) falla(slug, 'hay casos que no salen del banco de su apartado (forma/apartado): ' + ajenos.slice(0, 120));

  const datos = {}, usos = {};
  let desiguales = 0;
  for (let n = 1; n <= tope; n++) {
    let f;
    try { f = m.forma('critica', n); } catch (e) { falla(slug, 'Forma ' + n + ' no se pudo generar: ' + String(e.message).split('\n')[0]); continue; }
    datos[n] = f.dato;
    /* La misión pinta lo que el motor repartió y nada más: los textos de
       su hoja son los de los casos repartidos. */
    const repartidos = L.cadenasDe(JSON.parse(m.correr('JSON.stringify(_repartoCritica(' + n + ', critApartados()))', 'reparto'))).sort();
    const pintados = L.cadenasDe(f.dato).sort();
    const sobran = pintados.filter(t => !repartidos.includes(t));
    if (sobran.length > (sueltosSabidos[slug] || 0) || repartidos.some(t => !pintados.includes(t))) desiguales++;
    if (!f.impreso.includes('Forma ' + n)) falla(slug, 'la hoja impresa de la Forma ' + n + ' no dice su número');
    L.cadenasDe(f.dato).forEach(t => { usos[t] = (usos[t] || 0) + 1; });
  }
  if (desiguales) falla(slug, desiguales + ' formas no llevan los casos que repartió el motor: la misión saca algo por su cuenta');

  const r = L.repetidas(datos);
  r.iguales.forEach(([a, b]) => falla(slug, 'la Forma ' + a + ' es idéntica a la Forma ' + b));
  r.mismoConjunto.forEach(([a, b]) => falla(slug, 'la Forma ' + a + ' trae los mismos casos que la Forma ' + b + ', en otro orden'));

  const sueltos = L.textosFueraDeBanco(bancos, datos);
  if (sueltos.length > (sueltosSabidos[slug] || 0))
    falla(slug, 'trae ' + sueltos.length + ' textos que no están en ningún banco de la misión, por ejemplo: ' + sueltos.slice(0, 2).map(t => JSON.stringify(t.slice(0, 70))).join(', '));

  /* Después de la última forma viene la primera, y la misma forma sale
     igual pedida dos veces. La forma se pide como la pide el desplegable:
     dejándola apuntada en la variable de la misión. */
  try {
    m.correr('evalCritFormNum = ' + tope, 'pedir');
    const otra = m.forma('critica', tope).dato;
    if (JSON.stringify(otra) !== JSON.stringify(datos[tope])) falla(slug, 'la Forma ' + tope + ' no sale igual dos veces');
    if (m.correr('evalCritFormNum', 'siguiente') !== 1) falla(slug, 'después de la Forma ' + tope + ' no vuelve a la Forma 1');
  } catch (e) { falla(slug, 'no se pudo repetir la última forma: ' + String(e.message).split('\n')[0]); }

  /* La versión en inglés cambia los bancos enteros por los suyos. El
     reparto va por posición: si un banco en inglés tiene otro tamaño, la
     Forma 7 en inglés ya no es la Forma 7 en español. */
  const dirJs = path.dirname(m.js);
  const enIngles = fs.readdirSync(dirJs).find(f => /-en\.js$/.test(f));
  if (enIngles) {
    try {
      m.correr(fs.readFileSync(path.join(dirJs, enIngles), 'utf8'), enIngles);
      const tamEn = JSON.parse(m.correr('JSON.stringify((function () { var d = (window.MISION_EN && window.MISION_EN.data) || {}, o = {}; Object.keys(d).forEach(function (k) { if (Array.isArray(d[k])) o[k] = d[k].length; }); return o; })())', 'inglés'));
      Object.keys(bancos).filter(n => /^crit/.test(n) && n in tamEn && tamEn[n] !== bancos[n].length)
        .forEach(n => falla(slug, 'el banco ' + n + ' tiene ' + bancos[n].length + ' casos en español y ' + tamEn[n] + ' en inglés: las formas no coincidirían entre idiomas'));
    } catch (e) { falla(slug, 'no se pudo leer ' + enIngles + ': ' + String(e.message).split('\n')[0]); }
  }

  const veces = Object.values(usos);
  filas.push({ slug, apartados, posibles, tope, distintas: r.distintas, menos: Math.min(...veces), mas: Math.max(...veces), ingles: !!enIngles });
});

/* ── 1 (sigue) · el reparto, con los tamaños de verdad ───────── */
/* Hasta aquí se prueba TODO el banco: de la Forma 1 a la última
   combinación, ninguna repetida. Los bancos más grandes dan millones de
   combinaciones; de esos se prueban las primeras. */
const TODO_HASTA = 20000, PRIMERAS = 2000;
const repiten = [], noCiclan = [], cambian = [], tocan = [];
let enteros = 0, parciales = 0;
tamanosVistos.forEach((de, llave) => {
  const tamanos = JSON.parse(llave);
  const ap = bancosDeMentira(tamanos);
  const antes = JSON.stringify(ap);
  const N = conjuntos(ap);
  const hasta = N <= TODO_HASTA ? N : PRIMERAS;
  if (N <= TODO_HASTA) enteros++; else parciales++;
  const vistos = new Map();
  for (let f = 1; f <= hasta; f++) {
    const c = conjuntoDe(reparto(f, ap));
    if (vistos.has(c)) { repiten.push(llave + ' (' + de + '): la Forma ' + f + ' repite a la ' + vistos.get(c)); break; }
    vistos.set(c, f);
  }
  /* Agotadas todas, la siguiente vuelve a ser la primera: ni antes ni después. */
  if (N <= TODO_HASTA && conjuntoDe(reparto(N + 1, ap)) !== conjuntoDe(reparto(1, ap))) noCiclan.push(llave);
  if (JSON.stringify(reparto(7, ap)) !== JSON.stringify(reparto(7, ap))) cambian.push(llave);
  if (JSON.stringify(ap) !== antes) tocan.push(llave);
  if (formasDe(ap) !== Math.min(50, N)) repiten.push(llave + ': dice que da ' + formasDe(ap) + ' formas y sus bancos dan ' + N + ' conjuntos');
});
ok('ninguna forma repite el conjunto de otra: ' + enteros + ' tamaños de banco probados enteros, hasta su última combinación' + (parciales ? ', y ' + parciales + ' más grandes en sus primeras ' + PRIMERAS + ' formas' : ''),
  repiten.length === 0, repiten.slice(0, 5).join('\n      '));
ok('agotadas todas las combinaciones, vuelve a empezar por la primera', noCiclan.length === 0, noCiclan.slice(0, 5).join('\n      '));
ok('la misma forma sale igual dos veces y los bancos no se tocan', cambian.length === 0 && tocan.length === 0, cambian.concat(tocan).slice(0, 5).join('\n      '));
const chico = bancosDeMentira([[2, 1], [2, 1], [1, 1]]);
ok('un banco que no alcanza para 50 ofrece solo las formas que da (4 conjuntos, 4 formas)', formasDe(chico) === 4);
let avisa = false;
try { reparto(1, [[['solo uno'], 2]]); } catch (e) { avisa = /apartado 1/.test(e.message); }
ok('un apartado que pide más casos de los que tiene su banco se dice claro, con su número', avisa);

/* ── lo que salió ────────────────────────────────────────────── */
console.log('\n— Las misiones —');
console.log('  ' + conCritica + ' misiones con prueba de pensamiento crítico · ' + filas.length + ' ya reparten sin repetir' + (faltan.length ? ' · ' + faltan.length + ' todavía sacan al azar' : ''));
if (filas.length) {
  console.log('\n  ' + 'misión'.padEnd(46) + 'banco → saca'.padEnd(30) + 'conjuntos'.padEnd(11) + 'formas'.padEnd(8) + 'distintas');
  filas.forEach(f => console.log('  ' + f.slug.padEnd(46) + f.apartados.map(a => a.n + '→' + a.saca).join(' ').padEnd(30) + String(f.posibles).padEnd(11) + String(f.tope).padEnd(8) + f.distintas + (f.ingles ? '  (y en inglés)' : '')));
  if (TABLA) {
    console.log('\n  Cuántas veces sale cada texto en las formas de la misión (el que menos y el que más):');
    filas.forEach(f => console.log('  ' + f.slug.padEnd(46) + f.menos + ' a ' + f.mas + ' de ' + f.tope));
  }
}
if (faltan.length) {
  console.log('\n  Pasan al reparto por tandas. Todavía sacan los casos al azar (' + faltan.length + '):');
  for (let i = 0; i < faltan.length; i += 4) console.log('    ' + faltan.slice(i, i + 4).join(', '));
}

if (fallosMision.length) {
  console.log('\n──────── LO QUE FALLÓ (' + fallosMision.length + ') ────────');
  fallosMision.slice(0, 60).forEach(f => console.log('  ✘ ' + f));
  if (fallosMision.length > 60) console.log('  … y ' + (fallosMision.length - 60) + ' más');
}
if (fallos || fallosMision.length) {
  console.log('\n❌ La prueba de pensamiento crítico repite formas o trae algo que no es de su banco.');
  process.exit(1);
}
console.log('\n✅ En las ' + filas.length + ' misiones que ya reparten, ninguna forma crítica repite a otra y todo sale del banco de su misión.');
