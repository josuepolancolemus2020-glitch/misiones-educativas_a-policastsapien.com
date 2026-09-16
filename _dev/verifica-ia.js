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
[[MISIONES[2].ficha, 'Investigá'], [MISIONES[3].ficha, 'Investigá en tu comunidad'], [MISIONES[4].ficha, 'Tu plan']].forEach(([ficha, act]) => {
  const f = plano(leer(ficha));
  const diceQueNoHay = /no lleva respuesta a proposito|sin respuesta.{0,40}a proposito|no trae respuesta a proposito/.test(f);
  if (!diceQueNoHay) mal(`${path.basename(ficha)}: la actividad «${act}» no trae pauta y la hoja del docente NO avisa de que es a propósito`);
});
if (fallos === f0) bien('las tres actividades sin pauta avisan de que es a propósito');

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
