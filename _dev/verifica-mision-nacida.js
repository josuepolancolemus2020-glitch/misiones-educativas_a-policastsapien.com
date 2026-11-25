#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Una misión nueva nace con sus 50 formas
   ------------------------------------------------------------
   Las misiones nuevas (las seis de Español del primer parcial y las
   que vengan) nacen sobre la plantilla del motor (js/motor-mision.js):
   su contenido.js trae 40 preguntas en los bancos de siempre, de donde
   salen las formas 1 a 30, y 40 en los bancos «Nuevo», de donde salen
   las 31 a 50. No tienen formas «de antes»: ningún maestro imprimió
   todavía su clave, así que no hay nada que congelar el día que nacen.

   Las demás sondas de formas comparan con `_dev/formas-oro/`, y a una
   misión sin referencia la ponían en rojo. Esta es la que la acepta,
   con condiciones. Por cada misión nombrada en `_nacidas.json`:

   1. Es del alcance, usa la plantilla del motor y NO tiene referencia
      (si ya la tiene, se congeló y sale de la lista).
   2. Cada uno de sus ocho bancos del examen trae al menos 10 preguntas
      (las 80 del plan). No basta con mirar que llegue a la Forma 50: con
      cuatro preguntas nuevas el motor también llega, combinándolas, y
      esas formas se aprenden de memoria.
      Su examen conceptual llega a la Forma 50, las 50 salen, cada una
      imprime su hoja, ninguna repite el conjunto de otra, toda pregunta
      es de uno de sus bancos y salen igual dos veces (no dependen del
      azar ni de la fecha).
   3. Si trae prueba de pensamiento crítico: trae al menos 20 casos entre
      sus seis bancos, la reparte el motor sin repetir, llega a la Forma 50, sus 50 formas salen distintas, cada
      una imprime su hoja, todo texto sale de un banco y salen igual dos
      veces. Si no la trae, se dice, sin ponerse roja: el motor no la
      enseña.

   No congela nada. Cuando Josué aprueba las preguntas de la misión,
   `node _dev/genera-formas-oro.js <carpeta>` congela sus formas y la
   saca de la lista; desde entonces la vigila verifica-formas-oro.js
   como a las demás.

   Con la lista vacía esta sonda no se queda de adorno: hace un ENSAYO
   con las misiones que ya usan la plantilla (La Célula), como si
   nacieran hoy. Si el motor dejara de poder dar 50 formas a una misión
   nueva, se pone roja aquí antes de que nazca la primera.

     node _dev/verifica-mision-nacida.js              → las nacidas y el ensayo
     node _dev/verifica-mision-nacida.js <carpeta>    → una, aunque todavía
                                                        no esté en la lista
   ============================================================ */
'use strict';

const fs = require('fs');
const L = require('./lib-formas.js');

const FORMAS = 50;
const POR_BANCO = 10;        /* preguntas de cada banco del examen (plan, 3.2) */
const CASOS_CRITICA = 20;    /* casos de la prueba crítica, como mínimo (plan, 3.2) */
const pedidas = process.argv.slice(2);
const { dentro } = L.listarMisiones();
const nacidas = L.leerNacidas();
const pendiente = fs.existsSync(L.RUTA_PENDIENTE) ? (JSON.parse(fs.readFileSync(L.RUTA_PENDIENTE, 'utf8')).repiten || {}) : {};

let fallos = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const bien = m => console.log('  ✅ ' + m);
const dato = m => console.log('  · ' + m);

/* Qué se mide. Una nacida es la que está en la lista o, pedida por su
   nombre, la que todavía no tiene referencia. El ensayo, sin lista que
   mirar, son las de la plantilla que ya tienen la suya. */
const conPlantilla = dentro.filter(s => L.usaElMotor(s));
const casos = pedidas.length
  ? pedidas.map(slug => ({ slug, nacida: !!nacidas[slug] || !L.leerOro(slug) }))
  : Object.keys(nacidas).sort().map(slug => ({ slug, nacida: true }))
    .concat(conPlantilla.filter(s => !nacidas[s] && L.leerOro(s)).map(slug => ({ slug, nacida: false })));

/* Genera las formas de una prueba con dos azares distintos. Devuelve los
   datos de la primera tanda, o null si alguna no salió. */
function formas(a, b, prueba, tope) {
  const datos = {}, distintas = [], sinSalir = [];
  for (let n = 1; n <= tope; n++) {
    let x, y;
    try { x = a.forma(prueba, n); y = b.forma(prueba, n); }
    catch (e) { sinSalir.push(n + ' (' + String(e.message).split('\n')[0] + ')'); continue; }
    if (JSON.stringify(x.dato) !== JSON.stringify(y.dato) || x.impreso !== y.impreso) distintas.push(n);
    datos[n] = x.dato;
  }
  if (sinSalir.length) { mal('no salen las formas ' + sinSalir.slice(0, 3).join(', ')); return null; }
  if (distintas.length) mal('no salen igual dos veces las formas ' + distintas.slice(0, 10).join(', ') + ': dependen del azar o de la fecha');
  return datos;
}

function sinRepetir(datos, nombre) {
  const r = L.repetidas(datos);
  const malas = r.iguales.map(([a, b]) => a + ' = ' + b).concat(r.mismoConjunto.map(([a, b]) => a + ' ≈ ' + b + ' (otro orden)'));
  if (malas.length) mal(nombre + ': se repiten formas: ' + malas.slice(0, 5).join('; '));
  return r.distintas;
}

casos.forEach(({ slug, nacida }) => {
  console.log('\n' + (nacida ? '🌱 ' : '🧪 ensayo · ') + slug);

  /* 1 · dónde está */
  if (!dentro.includes(slug)) { mal('no es una misión del alcance (o no tiene examen por formas)'); return; }
  if (!L.usaElMotor(slug)) { mal('no usa la plantilla del motor (js/motor-mision.js): una misión nueva nace sobre ella'); return; }
  if (nacida) {
    if (L.leerOro(slug)) mal('ya tiene formas congeladas: no es una nacida (sácala de _nacidas.json)');
    else bien('no tiene nada congelado: sus formas esperan el visto bueno de Josué');
    if (!nacidas[slug]) mal('no está en _dev/formas-oro/_nacidas.json: anótala, o verifica-formas-oro la pone en rojo por no tener referencia');
    if (pendiente[slug]) mal('está en _critica-pendiente.json, que es la deuda de las misiones de antes');
  }

  let a, b;
  try { a = L.cargarMision(slug, 7); b = L.cargarMision(slug, 2654435761); }
  catch (e) { mal('no carga: ' + String(e.message).split('\n')[0]); return; }

  /* 2 · el examen conceptual */
  const bancos = L.bancosDe(a);
  const tam = n => (bancos[n] || []).length;
  dato('bancos del examen: ' + ['CP', 'TF', 'MC', 'PR'].map(s => s + ' ' + tam('eval' + s + 'Bank') + '+' + tam('eval' + s + 'BankNuevo')).join(' · ') + ' (de siempre + nuevo)');
  const BANCOS_EXAMEN = ['CP', 'TF', 'MC', 'PR'].map(s => 'eval' + s + 'Bank').reduce((l, n) => l.concat([n, n + 'Nuevo']), []);
  const cortos = BANCOS_EXAMEN.filter(n => tam(n) < POR_BANCO);
  if (cortos.length) mal('bancos del examen con menos de ' + POR_BANCO + ' preguntas: ' + cortos.map(n => n + ' (' + tam(n) + ')').join(', '));
  else bien('los ocho bancos del examen traen ' + POR_BANCO + ' preguntas o más (' + BANCOS_EXAMEN.reduce((s, n) => s + tam(n), 0) + ' en total)');
  if (a.topeConceptual !== FORMAS) mal('su examen conceptual llega a la Forma ' + a.topeConceptual + ' y una misión nueva nace con ' + FORMAS + ' (formas 1 a ' + a.tope + ' del banco de siempre y las demás del nuevo)');
  else {
    const datos = formas(a, b, 'conceptual', FORMAS);
    if (datos) {
      const distintas = sinRepetir(datos, 'examen conceptual');
      const B = L.bancosConceptual(a, bancos, null);
      const ajenas = [];
      Object.keys(datos).map(Number).forEach(n => {
        const d = datos[n];
        const partes = { cp: d.cp, tf: d.tf, mc: d.mc, pr: d.pr && d.pr.terms };
        Object.keys(partes).forEach(parte => {
          /* En las formas del banco nuevo las opciones van barajadas. */
          const igual = n > a.tope && parte === 'mc' ? x => JSON.stringify(L.sinOrdenDeOpciones(x)) : x => JSON.stringify(x);
          const enBanco = new Set((B[parte] || []).map(igual));
          if (!Array.isArray(partes[parte]) || !partes[parte].length) ajenas.push('Forma ' + n + ' no trae ' + parte);
          else partes[parte].forEach(it => { if (!enBanco.has(igual(it))) ajenas.push('Forma ' + n + ', ' + parte + ': ' + JSON.stringify(it).slice(0, 70)); });
        });
      });
      if (ajenas.length) mal('examen conceptual: preguntas que no son de sus bancos: ' + ajenas.slice(0, 3).join(' · '));
      if (distintas === FORMAS && !ajenas.length) bien('examen conceptual: las ' + FORMAS + ' formas salen, imprimen su hoja, son distintas y toda pregunta es de sus bancos');
    }
  }

  /* 3 · la prueba de pensamiento crítico */
  if (!a.pruebas.includes('critica')) { dato('no trae prueba de pensamiento crítico: el motor no la enseña'); return; }
  if (!a.reparteCritica) { mal('su prueba crítica no la reparte el motor (critApartados)'); return; }
  const casosCritica = JSON.parse(a.correr('JSON.stringify(critApartados().map(function (ap) { return ap[0].length; }))', 'casos'));
  const nCasos = casosCritica.reduce((s, x) => s + x, 0);
  if (nCasos < CASOS_CRITICA) mal('su prueba crítica trae ' + nCasos + ' casos (' + casosCritica.join(' + ') + ') y una misión nueva nace con ' + CASOS_CRITICA + ' como mínimo');
  else bien('su prueba crítica trae ' + nCasos + ' casos (' + casosCritica.join(' + ') + ')');
  if (a.topeCritica !== FORMAS) { mal('su prueba crítica llega a la Forma ' + a.topeCritica + ': con su banco caben ' + a.conjuntosCritica + ' conjuntos de casos y hacen falta ' + FORMAS + ' distintos'); return; }
  const datos = formas(a, b, 'critica', FORMAS);
  if (!datos) return;
  const distintas = sinRepetir(datos, 'prueba crítica');
  const sueltos = L.textosFueraDeBanco(bancos, datos);
  if (sueltos.length) mal('prueba crítica: ' + sueltos.length + ' textos no salen de ningún banco, por ejemplo ' + JSON.stringify(sueltos[0].slice(0, 70)));
  if (distintas === FORMAS && !sueltos.length) bien('prueba crítica: las ' + FORMAS + ' formas salen, imprimen su hoja, son distintas y todo sale de sus bancos (' + a.conjuntosCritica + ' conjuntos posibles)');
});

const n = casos.filter(c => c.nacida).length;
console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ 0 fallos') + ' · ' + n + ' misión(es) nacida(s) por congelar · ' + (casos.length - n) + ' en ensayo' + (n ? '' : ' (la lista _nacidas.json está vacía)') + '\n');
process.exit(fallos ? 1 : 0);
