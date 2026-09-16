#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · La Ruta de la Máquina que Aprende, dato por dato
   ──────────────────────────────────────────────────────────────────────────
   Qué vigila, y por qué cada cosa:

   1. **Que la pantalla y el papel no se separen.** El vocabulario vive en
      `js/data/ia-conceptos.js` y las fechas en `js/data/ia-historia.js`; las
      cuatro misiones los PINTAN de ahí, pero las cuatro fichas son HTML plano
      —como las otras 75— y ahí la copia es inevitable. Lo que no es inevitable
      es que se separen: si alguien corrige una definición en la ficha y no en
      el archivo, a partir de ese día el alumno estudia una cosa y el maestro le
      corrige por la otra.

   2. ⚠️ **Que las misiones no lleven los datos escritos a mano.** Es la trampa
      de verdad: escribir el año en el HTML «para que se vea» funciona
      perfectamente, no da ningún error, y el día que el dato cambie quedan dos
      versiones. En la misión de la historia no puede haber ni un año suelto.

   3. ⚠️ **Que las tres reglas de oro sean las MISMAS en las cuatro etapas.** El
      alumno las abre seguidas, de I a III Ciclo. Tres reglas que cambian de
      redacción entre etapas no enseñan tres matices: enseñan a desconfiar. Es
      la misma comprobación que hace `verifica-proceres` con la definición de
      héroe y prócer.

   4. **Que cada ficha tenga su QR y que el archivo exista.** Un hueco roto en
      el papel no lo descubre nadie hasta que se repartieron las fotocopias.

   5. ⚠️ **Que las actividades SIN RESPUESTA lleven su aviso al docente.** Hay
      dos —investigar una promesa de hoy, y preguntar en la comunidad— que no
      traen pauta a propósito, porque no la hay. Sin el aviso, un maestro las da
      por un descuido y se las salta. Es la misma lección que costó una hoja de
      más en la ficha de la Constitución: la sonda busca lo que el aviso DICE,
      no una frase exacta.

   Uso:  node _dev/verifica-ia.js
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.resolve(__dirname, '..');

const { IA_CONCEPTOS, IA_MITOS, IA_REGLAS_ORO, IA_VERIFICA, IA_PIEZAS_PETICION } =
  require(path.join(RAIZ, 'js/data/ia-conceptos.js'));
const { IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS } =
  require(path.join(RAIZ, 'js/data/ia-historia.js'));
const { IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS } =
  require(path.join(RAIZ, 'js/data/ia-peligros.js'));
const { IA_HOY_FECHA, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_FRASES, IA_INFLEXION } =
  require(path.join(RAIZ, 'js/data/ia-actualidad.js'));
const { IA_FUT_FECHA, IA_CAPACIDADES, IA_FUT_PIEZAS, IA_FUTUROS, IA_FUT_MANOS, iaFutFinal } =
  require(path.join(RAIZ, 'js/data/ia-futuros.js'));

let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

/* Se compara SIN etiquetas, sin acentos y sin distinguir mayúsculas: la ficha
   parte el texto en <strong> y en renglones donde le conviene, y eso no cambia
   lo que el alumno lee. Lo que sí cambia es una palabra distinta. */
const plano = s => String(s)
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[«»“”"'’]/g, ' ')
  .replace(/\s+/g, ' ').trim().toLowerCase();

const leer = r => fs.readFileSync(path.join(RAIZ, r), 'utf8');

const MISIONES = [
  { id: 72, ciclo: 1, dir: 'misiones/1ciclo-que-es-la-ia', html: 'que-es-la-ia.html', js: 'js/que-es-la-ia.js',
    ficha: 'fichas/ficha-que-es-la-ia.html', qr: 'img/qr-mision-que-es-la-ia.png' },
  { id: 73, ciclo: 2, dir: 'misiones/2ciclo-como-aprende-una-maquina', html: 'como-aprende-una-maquina.html', js: 'js/como-aprende-una-maquina.js',
    ficha: 'fichas/ficha-como-aprende-una-maquina.html', qr: 'img/qr-mision-como-aprende-una-maquina.png' },
  { id: 74, ciclo: 0, dir: 'misiones/2y3ciclo-historia-ia', html: 'historia-ia.html', js: 'js/historia-ia.js',
    ficha: 'fichas/ficha-historia-ia.html', qr: 'img/qr-mision-historia-ia.png' },
  { id: 75, ciclo: 3, dir: 'misiones/3ciclo-ia-generativa', html: 'ia-generativa.html', js: 'js/ia-generativa.js',
    ficha: 'fichas/ficha-ia-generativa.html', qr: 'img/qr-mision-ia-generativa.png' },
  /* La 76 va con `ciclo: 0` como la de historia, y por la misma razón: no
     estrena vocabulario propio de III Ciclo —lo trae de la 75, que es su
     etapa anterior—, así que pedirle que repita las nueve definiciones sería
     inflarle la ficha por cumplir una comprobación. Lo suyo se comprueba en
     la sección 6-bis, contra js/data/ia-peligros.js. */
  { id: 76, ciclo: 0, dir: 'misiones/3ciclo-peligros-ia', html: 'peligros-ia.html', js: 'js/peligros-ia.js',
    ficha: 'fichas/ficha-peligros-ia.html', qr: 'img/qr-mision-peligros-ia.png' },
  /* La 77 también va con `ciclo: 0`: no estrena vocabulario, y lo suyo —el
     dossier fechado y el termómetro— se comprueba en la sección 6-ter. */
  { id: 77, ciclo: 0, dir: 'misiones/3ciclo-albores-singularidad', html: 'albores-singularidad.html', js: 'js/albores-singularidad.js',
    ficha: 'fichas/ficha-albores-singularidad.html', qr: 'img/qr-mision-albores-singularidad.png' },
  /* La 78, igual: lo suyo —los escenarios y sus cuatro piezas— se comprueba en
     la sección 6-quater, contra js/data/ia-futuros.js. */
  { id: 78, ciclo: 0, dir: 'misiones/3ciclo-escenarios-porvenir', html: 'escenarios-porvenir.html', js: 'js/escenarios-porvenir.js',
    ficha: 'fichas/ficha-escenarios-porvenir.html', qr: 'img/qr-mision-escenarios-porvenir.png' },
];

console.log('\n✨ Ruta de la Máquina que Aprende · la pantalla y el papel\n');

// ── 1. Las cuatro piezas de cada etapa están donde tienen que estar ────────
console.log('📁 Las piezas de cada etapa');
MISIONES.forEach(m => {
  ['html', 'js'].forEach(k => {
    const p = path.join(RAIZ, m.dir, m[k]);
    if (!fs.existsSync(p)) mal(`falta ${m.dir}/${m[k]}`);
  });
  if (!fs.existsSync(path.join(RAIZ, m.ficha))) mal('falta ' + m.ficha);
  if (!fs.existsSync(path.join(RAIZ, m.qr))) mal('falta el QR ' + m.qr);
});
if (!fallos) bien(`las ${MISIONES.length} misiones, con su JS, su ficha y su QR`);

// ── 2. El QR que la ficha PIDE es el que existe ────────────────────────────
/* El hilo va misión → su ficha → el <img> del QR, y no se deduce del nombre de
   la carpeta: deducirlo es lo que hacía la revisión vieja, y fallaba en los dos
   sentidos (dos misiones con el mismo nombre deducido, y fichas con un QR que
   no se parece a su carpeta). */
console.log('\n📷 El QR que cada ficha pide');
MISIONES.forEach(m => {
  const f = leer(m.ficha);
  const img = f.match(/<img src="\.\.\/img\/(qr-mision-[^"]+)"/);
  if (!img) { mal(m.ficha + ': no pide ningún QR'); return; }
  if (!fs.existsSync(path.join(RAIZ, 'img', img[1]))) mal(`${m.ficha} pide img/${img[1]} y ese archivo no está`);
  if (!leer(path.join(m.dir, m.html)).includes(path.basename(m.ficha))) mal(`la misión ${m.id} no enlaza a su ficha ${path.basename(m.ficha)}`);
});
if (!fallos) bien(`las ${MISIONES.length} fichas piden un QR que existe, y las ${MISIONES.length} misiones enlazan a su ficha`);

// ── 3. El vocabulario: lo que dice el archivo es lo que dice el papel ──────
console.log('\n📖 El vocabulario, del archivo de datos al papel');
let f0 = fallos;
MISIONES.filter(m => m.ciclo).forEach(m => {
  const f = plano(leer(m.ficha));
  IA_CONCEPTOS.filter(c => c.ciclo === m.ciclo).forEach(c => {
    if (!f.includes(plano(c.palabra))) mal(`${path.basename(m.ficha)}: no está la palabra «${c.palabra}»`);
    else if (!f.includes(plano(c.definicion))) mal(`${path.basename(m.ficha)}: la definición de «${c.palabra}» no dice lo que dice js/data/ia-conceptos.js`);
  });
});
if (fallos === f0) bien(`${IA_CONCEPTOS.filter(c => c.ciclo).length} conceptos: el papel dice lo mismo que el archivo`);

// ── 4. Los seis mitos y las tres reglas ────────────────────────────────────
console.log('\n🚫 Los mitos y las reglas de oro');
f0 = fallos;
const f72 = plano(leer(MISIONES[0].ficha));
IA_MITOS.forEach(x => {
  if (!f72.includes(plano(x.mito))) mal('ficha-que-es-la-ia: falta el mito «' + x.mito + '»');
  else if (!f72.includes(plano(x.verdad))) mal('ficha-que-es-la-ia: el mito «' + x.mito + '» no trae su verdad tal como la escribe el archivo');
});
/* ⚠️ Las tres reglas tienen que estar en las fichas que enseñan a USAR la
   Inteligencia Artificial (etapas 1, 2 y 4) y decir exactamente lo mismo: el
   alumno las abre seguidas de I a III Ciclo, y tres reglas que cambian de
   redacción entre etapas no enseñan tres matices, enseñan a desconfiar.
   La etapa 3 queda fuera a propósito: es una lección de fechas, no de uso, y
   meterle las tres reglas sería relleno. */
/* ⚠️ Y la lista de las que las llevan NO es «las que tienen ciclo»: la etapa 5
   habla de cómo NO salir perjudicado y las lleva, aunque no estrene
   vocabulario propio. La 3 sigue fuera a propósito: es una lección de fechas. */
const CON_REGLAS = [72, 73, 75, 76];
MISIONES.filter(m => CON_REGLAS.indexOf(m.id) >= 0).forEach(m => {
  const f = plano(leer(m.ficha));
  IA_REGLAS_ORO.forEach(r => {
    if (!f.includes(plano(r.regla))) mal(`${path.basename(m.ficha)}: falta la regla de oro «${r.regla}»`);
  });
});
if (fallos === f0) bien(`${IA_MITOS.length} mitos y las 3 reglas de oro, iguales en las ${CON_REGLAS.length} etapas que enseñan a usarla`);

// ── 5. La historia: los quince hitos, con lo que los acredita ──────────────
console.log('\n📜 Los quince hitos y sus fuentes');
f0 = fallos;
const f74 = plano(leer(MISIONES[2].ficha));
IA_HITOS.forEach(h => {
  if (!f74.includes(plano(h.anio))) mal(`ficha-historia-ia: falta el año «${h.anio}»`);
  else if (!f74.includes(plano(h.titulo))) mal(`ficha-historia-ia: falta el hito «${h.titulo}»`);
  else if (!f74.includes(plano(h.que))) mal(`ficha-historia-ia: el «qué pasó» de ${h.anio} no dice lo que dice js/data/ia-historia.js`);
  else if (!f74.includes(plano(h.acredita))) mal(`ficha-historia-ia: el hito de ${h.anio} está SIN LA FUENTE que lo acredita`);
});
IA_EPOCAS.forEach(e => { if (!f74.includes(plano(e.nombre))) mal('ficha-historia-ia: falta la edad «' + e.nombre + '»'); });
IA_TRES_PATAS.forEach(p => { if (!f74.includes(plano(p.pata))) mal('ficha-historia-ia: falta la pata «' + p.pata + '»'); });
if (!f74.includes(plano(IA_LECCION_INVIERNOS.texto))) mal('ficha-historia-ia: la lección de los inviernos no dice lo que dice el archivo');
if (fallos === f0) bien(`${IA_HITOS.length} hitos con su año, su relato y su fuente · ${IA_EPOCAS.length} edades · ${IA_TRES_PATAS.length} patas`);

// ── 6. Los cinco pasos y las cuatro piezas ─────────────────────────────────
console.log('\n🔎 Verificar y pedir bien');
f0 = fallos;
const f75 = plano(leer(MISIONES[3].ficha));
IA_VERIFICA.forEach(v => {
  if (!f75.includes(plano(v.paso))) mal('ficha-ia-generativa: falta el paso «' + v.paso + '»');
  else if (!f75.includes(plano(v.detalle))) mal(`ficha-ia-generativa: el paso ${v.n} no dice lo que dice el archivo`);
});
IA_PIEZAS_PETICION.forEach(p => {
  if (!f75.includes(plano(p.pieza))) mal('ficha-ia-generativa: falta la pieza «' + p.pieza + '»');
  else if (!f75.includes(plano(p.ejemplo))) mal(`ficha-ia-generativa: el ejemplo de «${p.pieza}» no es el del archivo`);
});
if (fallos === f0) bien(`${IA_VERIFICA.length} pasos de verificar y ${IA_PIEZAS_PETICION.length} piezas de la petición, del archivo al papel`);

// ── 6-bis. Los peligros: lo que dice el archivo es lo que dice el papel ────
console.log('\n🛡️ Los peligros, las señales y el botiquín');
f0 = fallos;
const f76 = plano(leer(MISIONES[4].ficha));
IA_SENALES.forEach(x => {
  if (!f76.includes(plano(x.nombre))) mal('ficha-peligros-ia: falta la señal «' + x.nombre + '»');
  else if (!f76.includes(plano(x.porque))) mal(`ficha-peligros-ia: la señal «${x.nombre}» no dice lo que dice js/data/ia-peligros.js`);
});
IA_FAMILIAS.forEach(x => {
  if (!f76.includes(plano(x.nombre))) mal('ficha-peligros-ia: falta la familia «' + x.nombre + '»');
  else if (!f76.includes(plano(x.pregunta))) mal(`ficha-peligros-ia: la familia «${x.nombre}» no trae su pregunta tal como la escribe el archivo`);
});
IA_PELIGROS.forEach(p => {
  if (!f76.includes(plano(p.nombre))) mal('ficha-peligros-ia: falta el peligro «' + p.nombre + '»');
  else if (!f76.includes(plano(p.mecanismo))) mal(`ficha-peligros-ia: el mecanismo de «${p.nombre}» no dice lo que dice el archivo`);
});
IA_DEFENSAS.forEach(d => {
  if (!f76.includes(plano(d.nombre))) mal('ficha-peligros-ia: falta la defensa «' + d.nombre + '»');
  /* ⚠️ El «para qué NO sirve» es lo que más se cae al recortar una ficha, y es
     justo la mitad que evita que una defensa se venda como buena para todo. */
  else if (!f76.includes(plano(d.noPara))) mal(`ficha-peligros-ia: la defensa «${d.nombre}» está SIN su «no sirve para»`);
});
/* Y que la misión no los lleve escritos a mano: los pinta del archivo. */
const h76 = plano(leer(path.join(MISIONES[4].dir, MISIONES[4].html)));
IA_PELIGROS.forEach(p => {
  if (h76.includes(plano(p.mecanismo))) mal(`la misión 76 lleva escrito a mano el mecanismo de «${p.nombre}»: tiene que pintarlo del archivo`);
});
if (!leer(path.join(MISIONES[4].dir, MISIONES[4].html)).includes('js/data/ia-peligros.js')) mal('la misión 76 no carga js/data/ia-peligros.js');
if (fallos === f0) bien(`${IA_SENALES.length} señales, ${IA_FAMILIAS.length} familias, ${IA_PELIGROS.length} peligros y ${IA_DEFENSAS.length} defensas, del archivo al papel`);

// ── 6-ter. La actualidad: fechada, atribuida y SIN afirmar nada ───────────
console.log('\n🧭 El dossier de la actualidad y el termómetro');
f0 = fallos;
const M77 = MISIONES[5];
const f77 = plano(leer(M77.ficha));
const h77crudo = leer(path.join(M77.dir, M77.html));
IA_TERMOMETRO.forEach(t => {
  if (!f77.includes(plano(t.pregunta))) mal('ficha-albores-singularidad: falta la pregunta «' + t.pregunta + '»');
  else if (!f77.includes(plano(t.si))) mal(`ficha-albores-singularidad: la pregunta «${t.pregunta}» no trae su «suena a sí» tal como lo escribe el archivo`);
});
IA_HOY.forEach(h => {
  if (!f77.includes(plano(h.afirma))) mal('ficha-albores-singularidad: falta la afirmación del ' + h.fecha);
});
IA_INFLEXION.reglas.forEach(r => {
  if (!f77.includes(plano(r.t))) mal('ficha-albores-singularidad: falta la regla del punto de inflexión «' + r.t + '»');
});
IA_SINGULARIDAD.seSabe.forEach(x => {
  if (!f77.includes(plano(x.t))) mal('ficha-albores-singularidad: falta «' + x.t + '» de lo que SÍ se sabe');
});
IA_FRASES.forEach(x => { if (!f77.includes(plano(x.texto))) mal('ficha-albores-singularidad: falta la frase «' + x.texto.slice(0, 40) + '…» del termómetro'); });
/* ⚠️ Lo que de verdad sostiene esta misión: el dossier va FECHADO y la ficha
   dice que no afirma ningún hecho. Sin esas dos cosas, una lista de «lo que
   está pasando» se convierte en una mentira dentro de tres meses. */
if (!f77.includes(plano(IA_HOY_FECHA))) mal('ficha-albores-singularidad: el dossier no lleva la fecha en que se armó');
if (!/buscar no es leer/.test(f77)) mal('ficha-albores-singularidad: no dice que no se pudo abrir ninguna de esas páginas (buscar no es leer)');
if (!/no se afirma ni un solo hecho|no se afirma ningun hecho/.test(f77)) mal('ficha-albores-singularidad: no avisa de que no afirma ningún hecho de actualidad');
/* Y que la misión pinte el dossier en vez de escribirlo. */
IA_HOY.forEach(h => { if (plano(h77crudo).includes(plano(h.afirma))) mal(`la misión 77 lleva escrita a mano la afirmación del ${h.fecha}: tiene que pintarla del archivo`); });
if (!h77crudo.includes('js/data/ia-actualidad.js')) mal('la misión 77 no carga js/data/ia-actualidad.js');
/* ⚠️ Y ni una cifra afirmada en el dossier: el número es justo lo que el
   alumno va a ir a buscar al documento. */
IA_HOY.forEach(h => {
  /* ⚠️ El AÑO no es una cifra de estas: «avances de septiembre de 2026» es el
     título citado, y prohibirlo ponía roja una entrada perfectamente escrita.
     Es la trampa de «Cuadrado Perfecto» otra vez. Lo que no puede haber es una
     CANTIDAD: un porcentaje, un número de personas, de becas o de dinero. */
  const sinAnios = h.afirma.replace(/\b(19|20)\d{2}\b/g, '');
  if (/\d+\s*(%|por ciento)|\b\d[\d.,]*\s*(millones|mil|becas|personas|instituciones|países)\b|\b\d{2,}\b/.test(sinAnios))
    mal(`la afirmación del ${h.fecha} lleva una cantidad: en este dossier el número lo trae el alumno del documento`);
});
if (fallos === f0) bien(`${IA_HOY.length} afirmaciones fechadas, ${IA_TERMOMETRO.length} preguntas y ${IA_FRASES.length} frases, del archivo al papel y sin una cifra afirmada`);

// ── 6-quater. Los escenarios: inventados, hechos de hoy y sin una fecha ───
console.log('\n🔮 Los escenarios por venir');
f0 = fallos;
const M78 = MISIONES[6];
const f78 = plano(leer(M78.ficha));
const h78crudo = leer(path.join(M78.dir, M78.html));
IA_FUT_PIEZAS.forEach(p => {
  if (!f78.includes(plano(p.nombre))) mal('ficha-escenarios-porvenir: falta la pieza «' + p.nombre + '»');
  else if (!f78.includes(plano(p.si))) mal(`ficha-escenarios-porvenir: la pieza «${p.nombre}» no trae su «la trae cuando» tal como lo escribe el archivo`);
});
IA_CAPACIDADES.forEach(c => {
  if (!f78.includes(plano(c.que))) mal('ficha-escenarios-porvenir: falta la capacidad «' + c.que + '»');
  else if (!f78.includes(plano(c.donde))) mal(`ficha-escenarios-porvenir: la capacidad «${c.que}» no dice dónde la produjo el alumno`);
});
IA_FUTUROS.forEach(e => {
  if (!f78.includes(plano(e.titulo))) mal('ficha-escenarios-porvenir: falta el escenario «' + e.titulo + '»');
  else if (!f78.includes(plano(e.cuesta))) mal(`ficha-escenarios-porvenir: el escenario «${e.titulo}» no dice lo que cuesta`);
});
/* ⚠️ Lo que de verdad sostiene esta misión, y va en el PAPEL porque el papel se
   guarda un año en una gaveta: que los escenarios están INVENTADOS. Sin esa
   línea, dentro de doce meses alguien los lee como si hubieran pasado. */
if (!/estan? inventad/.test(f78)) mal('ficha-escenarios-porvenir: no dice que los escenarios están inventados');
if (!f78.includes(plano(IA_FUT_FECHA))) mal('ficha-escenarios-porvenir: no lleva la fecha en que se escribió');
if (!/ponerle fecha a lo inventado/.test(f78)) mal('ficha-escenarios-porvenir: no explica por qué no trae la fecha en que pasaría');
/* Y que la misión los PINTE en vez de escribirlos. */
IA_FUTUROS.forEach(e => {
  if (plano(h78crudo).includes(plano(e.situacion))) mal(`la misión 78 lleva escrita a mano la situación de «${e.titulo}»: tiene que pintarla del archivo`);
});
if (!h78crudo.includes('js/data/ia-futuros.js')) mal('la misión 78 no carga js/data/ia-futuros.js');
/* ⚠️ Y NI UNA FECHA de cuándo pasaría: ponerle fecha a lo inventado es la
   profecía que esta misión enseña a reconocer. Se miran la situación, las
   consecuencias y la regla; el año dentro de un nombre de etapa no cuenta. */
IA_FUTUROS.forEach(e => {
  const texto = [e.situacion, e.regla].concat(e.ops.map(o => o.pasa)).join(' ');
  if (/\b(19|20)\d{2}\b/.test(texto)) mal(`el escenario «${e.titulo}» trae un año: un escenario no se fecha, se decide`);
});
/* ⚠️ Y ninguno se apoya en algo que no exista: esa es la diferencia entre un
   escenario y la ciencia ficción, y es lo único de las cuatro piezas que la
   sonda puede comprobar sola. */
IA_FUTUROS.forEach(e => {
  e.apoya.forEach(k => {
    if (!IA_CAPACIDADES.some(c => c.k === k)) mal(`el escenario «${e.titulo}» se apoya en «${k}», que no es una capacidad de hoy`);
  });
  if (!e.apoya.length) mal(`el escenario «${e.titulo}» no dice con qué está hecho`);
  const nombre = e.quien.replace(/^(don|doña|la profesora|el profesor|la enfermera)\s+/i, '').split(/[ ,]/)[0];
  if (!e.situacion.includes(nombre)) mal(`el escenario «${e.titulo}»: la situación no nombra a ${nombre}`);
  if (e.ops.length !== 3 || e.ops.some(o => !o.t || !o.pasa || o.pasa.length < 40)) mal(`el escenario «${e.titulo}» no trae tres decisiones con su consecuencia`);
  if (!e.regla) mal(`el escenario «${e.titulo}» no deja una regla`);
});
/* ⚠️ Y lo que la actividad AFIRMA, recalculado: que la revisión acota lo que
   cuesta un fallo en TODAS las combinaciones, y que NUNCA lo vuelve gratis.
   Prometer que revisar sale gratis sería la promesa falsa que esta ruta ya
   tuvo que rehacer una vez. */
IA_CAPACIDADES.forEach(c => IA_FUT_MANOS.forEach(m => {
  const sin = iaFutFinal(c.k, m.k, false), con = iaFutFinal(c.k, m.k, true);
  if (!sin || !con) { mal(`no hay final para ${c.k} en manos de ${m.k}`); return; }
  if (!/la decision se toma igual/.test(plano(sin.pasa))) mal(`sin revisión, ${c.k} en manos de ${m.k} no dice que la decisión se ejecuta igual`);
  if (!/no vale todavia/.test(plano(con.pasa))) mal(`con revisión, ${c.k} en manos de ${m.k} no dice que la decisión todavía no vale`);
  if (!/no sale gratis/.test(plano(con.cuesta))) mal(`con revisión, ${c.k} en manos de ${m.k} deja creer que revisar es gratis`);
  if (!m.todo && !con.aviso) mal(`${m.quien} no puede revisarlo todo y la pantalla no lo avisa`);
}));
if (fallos === f0) bien(`${IA_FUTUROS.length} escenarios inventados, ${IA_FUT_PIEZAS.length} piezas y ${IA_CAPACIDADES.length} capacidades de hoy, del archivo al papel, sin una fecha de lo que pasaría y con los ${IA_CAPACIDADES.length * IA_FUT_MANOS.length} finales recalculados`);

// ── 7. ⚠️ Las misiones no llevan los datos escritos a mano ─────────────────
console.log('\n🖐️  Que la misión PINTE los datos y no los escriba');
f0 = fallos;
const h74 = leer(path.join(MISIONES[2].dir, MISIONES[2].html));
/* En la misión de la historia no puede haber ni un año suelto en el HTML. Se
   permiten los que salen en el texto de la teoría (1950, 1956, 2017, 2022,
   2012, 2016, 1997 se nombran al explicar POR QUÉ importa la fecha), pero no
   la lista de hitos: eso se comprueba pidiendo que NINGÚN título de hito esté
   escrito a mano, que es lo que de verdad se duplicaría. */
IA_HITOS.forEach(h => {
  if (plano(h74).includes(plano(h.titulo)))
    mal(`la misión 74 lleva escrito a mano el hito «${h.titulo}»: tiene que pintarlo de js/data/ia-historia.js`);
});
MISIONES.filter(m => m.ciclo).forEach(m => {
  const html = plano(leer(path.join(m.dir, m.html)));
  IA_CONCEPTOS.filter(c => c.ciclo === m.ciclo).forEach(c => {
    if (html.includes(plano(c.definicion)))
      mal(`la misión ${m.id} lleva escrita a mano la definición de «${c.palabra}»: tiene que pintarla del archivo`);
  });
});
/* Y que cada misión enlace su archivo de datos: sin el <script> la pantalla
   sale vacía y eso sí se ve, pero vale la pena decirlo por su nombre. */
MISIONES.forEach(m => {
  const html = leer(path.join(m.dir, m.html));
  if (!html.includes('js/data/ia-conceptos.js')) mal(`la misión ${m.id} no carga js/data/ia-conceptos.js`);
  if (m.id === 74 && !html.includes('js/data/ia-historia.js')) mal('la misión 74 no carga js/data/ia-historia.js');
});
if (fallos === f0) bien('ninguna misión escribe a mano lo que tiene que pintar del archivo de datos');

// ── 8. ⚠️ Las actividades sin respuesta llevan su aviso ────────────────────
console.log('\n📝 Las actividades que NO traen pauta, y lo dicen');
f0 = fallos;
/* Se busca lo que el aviso DICE, no una frase exacta: pedir una redacción
   literal es lo que hizo escribir el aviso dos veces en la ficha de la
   Constitución y pasarse de hoja. Basta con que la hoja del docente diga que
   esa actividad no lleva respuesta y que es a propósito. */
[[MISIONES[2].ficha, 'Investigá'], [MISIONES[3].ficha, 'Investigá en tu comunidad'], [MISIONES[4].ficha, 'Tu plan'], [MISIONES[5].ficha, 'Tu cápsula del tiempo'], [MISIONES[6].ficha, 'Armá el tuyo']].forEach(([ficha, act]) => {
  const f = plano(leer(ficha));
  const diceQueNoHay = /no lleva respuesta a proposito|sin respuesta.{0,40}a proposito|no trae respuesta a proposito/.test(f);
  if (!diceQueNoHay) mal(`${path.basename(ficha)}: la actividad «${act}» no trae pauta y la hoja del docente NO avisa de que es a propósito`);
});
if (fallos === f0) bien('las actividades sin pauta avisan de que es a propósito');

// ── 9. Lo que la currícula promete que NO se escribe ───────────────────────
console.log('\n🚧 Lo que a propósito no se escribe');
f0 = fallos;
/* La normativa del papel: una cifra que envejece o se cuenta al vuelo o se
   fecha. En estas cuatro fichas no puede haber cifras de producto, porque la
   hoja se fotocopia y se guarda un año en una gaveta. */
const PROHIBIDO = [
  [/\b\d[\d.,]*\s*(mil|millones|billones)?\s*de\s*(par[aá]metros|usuarios)\b/i, 'una cifra de parámetros o de usuarios'],
  [/\bgpt-?\d|\bchatgpt\b|\bgemini\b|\bcopilot\b|\bclaude\b/i, 'el nombre de un producto de IA'],
];
MISIONES.forEach(m => {
  const f = leer(m.ficha).replace(/<!--[\s\S]*?-->/g, '');
  PROHIBIDO.forEach(([re, que]) => {
    if (re.test(f)) mal(`${path.basename(m.ficha)}: aparece ${que}. Eso cambia cada mes y la ficha se guarda un año.`);
  });
});
if (fallos === f0) bien('ninguna ficha nombra un producto ni escribe una cifra que envejece');

console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s)\n`);
process.exit(fallos ? 1 : 0);
