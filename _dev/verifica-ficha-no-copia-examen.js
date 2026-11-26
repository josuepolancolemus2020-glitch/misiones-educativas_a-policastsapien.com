#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La práctica de la ficha no es el examen
   ------------------------------------------------------------
   La rúbrica de cada ficha manda resolver su práctica («Ponte a
   Prueba») un día antes del examen. Y en la mayoría de las fichas esa
   práctica ERA el examen: las mismas 40 preguntas del banco, palabra
   por palabra. El alumno que hace la ficha la víspera ya vio, con la
   frase exacta, todo lo que puede caer en las formas 1 a 30. Así el
   examen mide si se acuerda de la hoja, no si aprendió el dato.

   La ficha TIENE que ensayar los mismos datos (para eso es). Lo que no
   puede es preguntarlos con las mismas palabras. La regla está en
   `_dev/lib-ficha.js` (`mismaPregunta`) y aquí solo se aplica:

   1. Cada pregunta de la práctica de cada ficha se compara con TODOS
      los bancos del examen de su misión: los de antes, los nuevos del
      banco grande, los de la prueba crítica y los de la operativa.
   2. LAS PENDIENTES SOLO BAJAN. El día que nació esta sonda (26 de
      noviembre de 2026), 70 fichas copiaban 2,518 preguntas. No se arreglan de golpe: se reescriben
      leyendo, en tandas de seis. `_dev/fichas-copia-pendientes.json`
      guarda cuántas copia hoy cada ficha y la sonda exige esa cifra
      EXACTA: una copia de más la pone roja, y una de menos también,
      hasta que se anota con `--anota` (que nunca sube una cifra). Así
      una ficha arreglada no puede volver a estropearse sin que se vea.
   3. UNA FICHA ARMADA NO TIENE PENDIENTES. La que ya tiene su bloque
      (`misiones/<carpeta>/js/ficha.js`, la arma `_dev/arma-ficha.js`)
      pasó por la reescritura: se le exige cero, que cada `ensaya` de su
      práctica nombre un dato (`k`) que el examen de verdad pregunta, y
      que la ficha publicada sea, letra por letra, la que sale del
      bloque: una ficha armada no se edita a mano.
   3-bis. LA MISIÓN NACIDA SE VIGILA DESDE SU BLOQUE. Una misión nueva
      (la lista de nacidas, `_dev/misiones-nacidas.json`) nace con el bloque de su ficha,
      pero la ficha impresa se arma después, cuando la misión entra al
      catálogo y tiene su QR. Mientras tanto se arma en la memoria, sin
      escribirla, y se le exige lo mismo que a una armada: cero copias y
      cada `ensaya` con su dato. Solo a las nacidas: a una misión
      publicada que deja de enlazar su ficha se le sigue diciendo.
   4. LA FICHA QUE NO SE PUEDE LEER SE NOMBRA. Las que no tienen la
      forma de siempre (Inteligencia Artificial, Filosofía, Fin de
      grado) no se dan por limpias: están en la lista `sinLeer` del
      mismo archivo. Una ficha que deja de poder leerse y no está en esa
      lista pone la sonda roja: cambiarle la forma no la esconde.
   5. LA SONDA SE PRUEBA A SÍ MISMA en cada corrida: toma una pregunta
      del examen de una ficha ya limpia, la mete en su práctica (en la
      memoria, sin tocar el archivo) y exige que la regla la acuse; y
      le da la vuelta a un verdadero o falso y exige que NO la acuse.
      Una sonda que no puede ponerse roja no vigila nada.

   Uso:  node _dev/verifica-ficha-no-copia-examen.js             (npm test)
         node _dev/verifica-ficha-no-copia-examen.js --detalle   (cada par copiado)
         node _dev/verifica-ficha-no-copia-examen.js <carpeta>   (una misión)
         node _dev/verifica-ficha-no-copia-examen.js --anota     (ESCRIBE las
               pendientes: baja las que bajaron, quita las que llegaron a
               cero y se niega a subir ninguna)
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const L = require('./lib-formas.js');
const F = require('./lib-ficha.js');

const RUTA = path.join(__dirname, 'fichas-copia-pendientes.json');
const args = process.argv.slice(2);
const DETALLE = args.includes('--detalle');
const ANOTA = args.includes('--anota');
const pedidas = args.filter(a => !a.startsWith('--'));

let fallos = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const bien = m => console.log('  ✅ ' + m);
const ojo = m => console.log('  ⚠️  ' + m);

const anotado = fs.existsSync(RUTA) ? JSON.parse(fs.readFileSync(RUTA, 'utf8')) : null;
const pendientes = anotado ? anotado.copian || {} : {};
const sinLeer = anotado ? anotado.sinLeer || [] : [];

/* ── Lo que hace falta de cada misión ───────────────────────── */
function paginaDe(slug) {
  const dir = path.join(L.DIR_MISIONES, slug);
  const f = fs.readdirSync(dir).find(n => n.endsWith('.html') && !n.startsWith('juego-'));
  return f ? fs.readFileSync(path.join(dir, f), 'utf8') : '';
}

/* Todas las preguntas del examen, de todos sus bancos, en la forma de
   la regla. Se cargan con el JavaScript de verdad de la misión (como las
   formas congeladas): un banco generado de un archivo de datos también
   cuenta, y uno escrito de otra manera no se escapa. */
function examenDe(slug) {
  const mision = L.cargarMision(slug);
  const bancos = L.bancosDe(mision);
  const lista = [], datos = new Set();
  Object.keys(bancos).forEach(nombre => bancos[nombre].forEach((it, i) => {
    const p = F.deBanco(nombre, it);
    if (p) lista.push(Object.assign(p, { banco: nombre, i: i + 1 }));
    if (it && it.k) [].concat(it.k).forEach(k => datos.add(k));
  }));
  return { lista, datos };
}

/* El bloque de la ficha, si la misión ya lo tiene. */
function bloqueDe(slug) {
  const ruta = path.join(L.DIR_MISIONES, slug, 'js', 'ficha.js');
  if (!fs.existsSync(ruta)) return null;
  return vm.runInNewContext(fs.readFileSync(ruta, 'utf8') + '\n;FICHA', {}, { filename: ruta });
}

/* Las preguntas de la práctica que copian al examen. */
function copias(items, vf, examen) {
  const out = [];
  items.forEach(it => {
    const f = F.deFicha(it, it.tipo === 'vf' ? vf[it.i] : '');
    for (const e of examen) {
      const por = F.mismaPregunta(f, e);
      if (por) { out.push({ it, e, por }); break; }
    }
  });
  return out;
}

const nombreFicha = it => it.banco.replace('ficha ', '') + '.' + it.i + ' «' + String(it.tipo === 'pareado' ? it.term : it.visible).slice(0, 70) + '»';

/* ── Recorrer ───────────────────────────────────────────────── */
const { dentro, fuera } = L.listarMisiones();
const nacidas = L.leerNacidas();
const lista = pedidas.length ? dentro.filter(s => pedidas.includes(s)) : dentro;
if (pedidas.length && !lista.length) { console.log('❌ No hay ninguna misión con examen que se llame ' + pedidas.join(', ')); process.exit(1); }

const cuenta = {};          /* ficha → cuántas copia hoy */
const noLeidas = [];        /* fichas que el lector no entiende */
const limpias = [];         /* { slug, ficha, items, vf, examen } para el ensayo */
let totalCopias = 0, totalPreguntas = 0;

console.log('\n🔎 La práctica de cada ficha contra el examen de su misión\n');
for (const slug of lista) {
  const rutaFicha = F.fichaDe(slug, paginaDe(slug));
  const bloque = bloqueDe(slug);
  /* La nacida: su ficha todavía no está impresa. Se arma en la memoria. */
  let sinArmar = null;
  if (!rutaFicha && nacidas[slug]) {
    if (!bloque) { mal(slug + ': es una misión nacida y no trae el bloque de su ficha (js/ficha.js): una misión nueva nace con él'); continue; }
    try { sinArmar = require('./arma-ficha.js').enMemoria(slug); }
    catch (e) {
      if (!(e instanceof require('./arma-ficha.js').Rechazo)) throw e;
      mal(slug + ': el armador se niega a armar su ficha: ' + e.message); continue;
    }
  }
  if (!rutaFicha && !sinArmar) { mal(slug + ': su página no enlaza ninguna ficha que exista'); continue; }
  const ficha = sinArmar ? sinArmar.archivo : path.basename(rutaFicha, '.html');
  const html = sinArmar ? sinArmar.html : fs.readFileSync(rutaFicha, 'utf8');
  const leida = F.itemsFicha(html);
  if (!leida) {
    noLeidas.push(ficha);
    if (bloque) mal(ficha + ': tiene bloque (js/ficha.js) y el lector no la entiende: el armador y el lector ya no hablan igual');
    else if (!sinLeer.includes(ficha) && anotado) mal(ficha + ': el lector ya no la entiende y no está en «sinLeer». Si se le cambió la forma, hay que enseñársela al lector (_dev/lib-ficha.js)');
    continue;
  }
  if (sinLeer.includes(ficha) && !ANOTA) mal(ficha + ': está en «sinLeer» y ya se puede leer: corre --anota para empezar a vigilarla');
  const { lista: examen, datos } = examenDe(slug);
  const vf = F.pautaVF(html);
  const ch = copias(leida.items, vf, examen);
  cuenta[ficha] = ch.length;
  totalCopias += ch.length; totalPreguntas += leida.items.length;
  const permitido = pendientes[ficha] || 0;

  if (bloque) {
    /* Armada: cero, y sus `ensaya` nombran datos del examen de verdad. */
    if (pendientes[ficha]) mal(ficha + ': está armada desde su bloque y sigue en la lista de pendientes: una ficha armada no tiene pendientes');
    /* Y es la que sale de su bloque. Una ficha armada que alguien retocó a
       mano dice una cosa en el papel y otra en sus datos, y el siguiente
       armado se lleva el retoque sin avisar. */
    const difiere = sinArmar ? '' : require('./arma-ficha.js').difiereDelBloque(slug);
    if (difiere) mal(ficha + ': ' + difiere + ' (node _dev/arma-ficha.js ' + slug + ')');
    if (ch.length) ch.forEach(c => mal(ficha + ' · ' + nombreFicha(c.it) + ' es ' + c.por + ' de ' + c.e.banco + ' ' + c.e.i));
    const P = bloque.practica || {};
    const todas = [].concat(P.completar || [], P.vf || [], P.seleccion || [], (P.pareados && P.pareados.pares) || []);
    const ensayados = new Set();
    todas.forEach(q => [].concat(q.ensaya || []).forEach(k => {
      if (!datos.has(k)) mal(ficha + ': la práctica dice que ensaya «' + k + '» y el examen no tiene ningún dato con esa `k`');
      else ensayados.add(k);
    }));
    if (!ch.length) {
      bien(ficha + ': ' + leida.items.length + ' preguntas de práctica y ninguna es del examen; ensaya ' + ensayados.size + ' de los ' + datos.size + ' datos que preguntan sus pruebas'
        + (sinArmar ? ' (misión nacida: se leyó de su bloque, la ficha impresa todavía no está armada)' : ''));
      limpias.push({ slug, ficha, items: leida.items, vf, examen });
    }
    continue;
  }

  if (!anotado && ANOTA) { /* primera vez: no hay con qué comparar, solo se anota */ }
  else if (ch.length > permitido) {
    mal(ficha + ': copia ' + ch.length + ' preguntas del examen y tenía anotadas ' + permitido + '. Las pendientes solo bajan');
    ch.slice(0, DETALLE ? ch.length : 3).forEach(c => console.log('       ' + nombreFicha(c.it) + ' = ' + c.e.banco + ' ' + c.e.i + ' (' + c.por + ')'));
  } else if (ch.length < permitido && !ANOTA) {
    mal(ficha + ': bajó de ' + permitido + ' a ' + ch.length + ' copias y no está anotado. Corre: node _dev/verifica-ficha-no-copia-examen.js --anota');
  } else if (DETALLE && ch.length) {
    console.log('  ' + ficha + ': ' + ch.length + ' de ' + leida.items.length);
    ch.forEach(c => console.log('       ' + nombreFicha(c.it) + ' = ' + c.e.banco + ' ' + c.e.i + ' (' + c.por + ')'));
  }
  if (!ch.length) limpias.push({ slug, ficha, items: leida.items, vf, examen });
}

/* Una pendiente de una ficha que ya no existe o ya no tiene examen es una
   cifra que nadie vigila: se dice, para que no se quede de adorno. */
if (!pedidas.length) Object.keys(pendientes).forEach(f => { if (!(f in cuenta)) mal('«' + f + '» está en las pendientes y ya no es la ficha de ninguna misión con examen'); });

/* ── El ensayo: la sonda tiene que poder ponerse roja ───────── */
/* Se hace con una ficha armada si hay, o con cualquiera limpia. Si no
   hay ninguna (no debería: la piloto existe), se dice y se pone roja. */
(function ensayo() {
  if (pedidas.length && !limpias.length) return;
  const base = limpias.find(x => bloqueDe(x.slug)) || limpias[0];
  if (!base) { mal('Ensayo: no hay ninguna ficha limpia con la que probar que la sonda ve una copia'); return; }
  const de = tipo => base.examen.find(e => e.tipo === tipo);
  const casos = [
    ['completar', e => ({ banco: 'ficha I', i: 99, tipo: 'completar', visible: e.texto.replace(/_{2,}/g, ' '), resp: e.resp, ctx: '' })],
    ['vf', e => ({ banco: 'ficha II', i: 99, tipo: 'vf', visible: e.texto, resp: '', ctx: '' })],
    ['seleccion', e => ({ banco: 'ficha III', i: 99, tipo: 'seleccion', visible: e.texto, resp: e.resp, ctx: e.texto })],
    ['pareado', e => ({ banco: 'ficha IV', i: 99, tipo: 'pareado', visible: '', term: e.texto, def: e.resp, resp: '', ctx: '' })]
  ];
  let vistas = 0;
  casos.forEach(([tipo, hacer]) => {
    const e = de(tipo);
    if (!e) return;
    const metida = hacer(e);
    const vfEnsayo = Object.assign({}, base.vf, { 99: e.resp });
    if (copias(base.items.concat([metida]), vfEnsayo, base.examen).length === 1) vistas++;
    else mal('Ensayo: se metió en la práctica de ' + base.ficha + ' una pregunta del examen (' + e.banco + ' ' + e.i + ', ' + tipo + ') y la sonda no la vio');
  });
  /* Y lo que NO es copia: la misma frase con la respuesta al revés. */
  const v = de('vf');
  if (v) {
    const alReves = { banco: 'ficha II', i: 98, tipo: 'vf', visible: v.texto, resp: '', ctx: '' };
    const vfEnsayo = Object.assign({}, base.vf, { 98: v.resp === 'V' ? 'F' : 'V' });
    if (copias([alReves], vfEnsayo, base.examen).length) mal('Ensayo: un verdadero o falso con la respuesta al revés no es copia y la sonda lo acusó');
  }
  if (vistas) bien('Ensayo con ' + base.ficha + ': ' + vistas + ' preguntas del examen metidas en su práctica, y la sonda vio las ' + vistas);
})();

/* ── Anotar ─────────────────────────────────────────────────── */
if (ANOTA) {
  if (pedidas.length) { console.log('\n❌ --anota escribe el archivo entero: se corre sin nombrar misiones.'); process.exit(1); }
  const nuevas = {};
  let subidas = 0;
  Object.keys(cuenta).sort().forEach(f => {
    if (!cuenta[f]) return;
    /* La primera vez no hay archivo y se anota lo que hay. Después, nunca
       se sube una cifra: una copia nueva se arregla, no se anota. */
    if (anotado && cuenta[f] > (pendientes[f] || 0)) { subidas++; nuevas[f] = pendientes[f] || 0; return; }
    nuevas[f] = cuenta[f];
  });
  Object.keys(nuevas).forEach(f => { if (!nuevas[f]) delete nuevas[f]; });
  const salida = {
    '//': [
      'Cuántas preguntas de su práctica copia cada ficha del examen de su misión. Lo escribe',
      '`node _dev/verifica-ficha-no-copia-examen.js --anota` y lo exige la misma sonda en npm test.',
      'SOLO BAJA: --anota nunca sube una cifra. No se edita a mano para hacer sitio a una copia nueva.',
      '«sinLeer» son las fichas que el lector (_dev/lib-ficha.js) no entiende: no se midieron.'
    ],
    copian: nuevas,
    sinLeer: noLeidas.slice().sort()
  };
  fs.writeFileSync(RUTA, JSON.stringify(salida, null, 2) + '\n');
  const suma = Object.values(nuevas).reduce((a, b) => a + b, 0);
  console.log('\n📝 Anotado: ' + Object.keys(nuevas).length + ' fichas con copias (' + suma + ' preguntas) y ' + noLeidas.length + ' sin leer.');
  if (subidas) { console.log('❌ ' + subidas + ' ficha(s) copian MÁS que lo anotado: no se subió su cifra. Corre la sonda sin --anota para verlas.'); process.exit(1); }
  process.exit(fallos ? 1 : 0);
}

/* ── Resumen ────────────────────────────────────────────────── */
if (!anotado) mal('No existe ' + path.basename(RUTA) + ': se crea con --anota');
const conCopias = Object.values(cuenta).filter(n => n > 0).length;
console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ 0 fallo(s)') + ' · ' + Object.keys(cuenta).length + ' ficha(s) leída(s), '
  + (Object.keys(cuenta).length - conCopias) + ' limpia(s), ' + conCopias + ' pendiente(s) con ' + totalCopias + ' de ' + totalPreguntas + ' preguntas copiadas · '
  + noLeidas.length + ' sin leer' + (noLeidas.length && DETALLE ? ' (' + noLeidas.join(', ') + ')' : '') + ' · ' + fuera.length + ' misión(es) sin examen por formas');
process.exit(fallos ? 1 : 0);
