/* ════════════════════════════════════════════════════════════════════
   ARMA fichas/ficha-como-se-que-se.html DESDE los datos
   ────────────────────────────────────────────────────────────────────
   Igual que `_dev/arma-ficha-mundo.js` arma la de la unidad 3, y por el mismo
   motivo: **el contenido sale del mismo archivo que pinta la pantalla**
   (`js/data/filosofia-saber.js`). Una corrección hecha solo en el HTML de la
   ficha se pierde en el siguiente armado, y hasta entonces la pantalla y el
   papel dicen cosas distintas.

   Lo que se publica es el HTML resultante, plano y editable como las otras 79.

       node _dev/arma-ficha-saber.js
       node _dev/reparte-hojas-ficha.js --todas ficha-como-se-que-se
       node _dev/verifica-ficha-paginas.js ficha-como-se-que-se

   ⚠️ Las HOJAS las reparte el repartidor, no este guion: aquí se emiten ocho
   secciones de alumno más la pauta, y él mueve los cortes hasta el mínimo.

   ⚠️ Y cada actividad va en SU PROPIO `<div class="acts">`. Iban las tres de la
   unidad 3 en uno solo y el repartidor no puede partir un bloque: dejó el
   «Actividades» solo en una hoja de 28,8 mm y la ficha se fue a once.

   ⚠️ Las clases propias van con prefijo `sb-`. La de la unidad 2 declaró un
   `.val` de bloque y esa misma clase es el `<span class="val">12 pts</span>`
   de los títulos de actividad: el rótulo de puntos sale metido en un recuadro.
   Aquí no se hereda ese choque.
   ════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'fichas/ficha-como-se-que-se.html');
/* El CSS común sale de la ficha de la unidad 2, que es de donde se calcó: lo
   propio de esta unidad se le pega detrás, en `CSS_PROPIO`. */
const MOLDE = path.join(RAIZ, 'fichas/ficha-pensar-con-orden.html');

/* ── los datos, cargados de verdad ───────────────────────────────── */
const src = fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-saber.js'), 'utf8');
const nombres = [...src.matchAll(/^const\s+([A-Z_0-9]+)\s*=/gm)].map(m => m[1]);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src + ';this.__D={' + nombres.join(',') + '};', ctx);
const D = ctx.__D;

const EST = D.SAB_ESTADOS, AF = D.SAB_AFIRMACIONES, FU = D.SAB_FUENTES;
const de = q => AF.filter(x => x.q === q).map(x => x.a);
const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ⚠️ El rótulo no puede repetir el dato. Varios campos ya empiezan por lo
   mismo que el rótulo —«Ojo: no todas las preguntas…» detrás de un
   «<b>Ojo:</b>»—, y la hoja salía diciendo «Ojo: Ojo: no todas…». No lo caza
   ninguna sonda: el texto está, y es el del archivo de datos. Se vio mirando
   la hoja. `rot()` pega el rótulo y le quita al dato ese arranque repetido. */
function rot(rotulo, txt) {
  const r = rotulo.replace(/:$/, '');
  const re = new RegExp('^' + r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[:,]?\\s+', 'i');
  return `<b>${rotulo}</b> ${esc(String(txt).replace(re, ''))}`;
}

const PIE = '<span>🌳 Ruta de la Raíz · Etapa 4 · <b>¿Cómo sé que sé?</b></span>';

/* ⚠️ Un azar con SEMILLA: el mismo archivo de datos da siempre la misma ficha,
   así volver a armarla no ensucia el diff. Es la misma decisión que el relleno
   de las sopas y que el reparto de respuestas. */
function dado(semilla) {
  let s = semilla >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Actividad 1: doce afirmaciones con su manera. Salen del archivo de datos,
      así que el ejercicio y la pauta NO se pueden contradecir.
      ⚠️ Y se BARAJAN: en fila salían S·C·O·S·C·O… y quien lo note contesta las
      doce sin leer una. Nunca tres seguidas iguales, que es lo que se ve desde
      el pupitre. ── */
const LETRA = { se: 'S', creo: 'C', opino: 'O' };
let ACT1 = [];
for (let i = 0; i < 4; i++) {
  ACT1.push([de('se')[i], 'S'], [de('creo')[i], 'C'], [de('opino')[i], 'O']);
}
(function barajar() {
  const rng = dado(20260918);
  for (let intento = 0; intento < 500; intento++) {
    for (let i = ACT1.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = ACT1[i]; ACT1[i] = ACT1[j]; ACT1[j] = t;
    }
    const l = ACT1.map(x => x[1]);
    if (!l.some((_, i) => i + 2 < l.length && l[i] === l[i + 1] && l[i] === l[i + 2])) return;
  }
})();

/* ── Actividad 2: el orden en que salen las tres PRUEBAS. NO es el de las
      maneras a propósito: en fila, la respuesta era a·b·c sin leer una sola.
      ACT2[i] dice qué manera le toca a la fila i. ── */
const ACT2 = [2, 0, 1];

/* ── Actividad 4: la selección múltiple. Es lo único de esta ficha que no sale
      del archivo de datos, y por eso vive aquí. La correcta se reparte entre
      las cuatro letras: es la normativa del reparto de respuestas. ── */

/* ⚠️ La correcta NO se deja donde la escribió quien la redactó. Escritas en
   fila, las seis salían a·b·c·d·a·b: quien lo note contesta las cuatro primeras
   sin leer ninguna. Es el mismo sesgo que la normativa del reparto de
   respuestas y la misma cara que la actividad 2 que salía resuelta.
   Se reparte con la SEMILLA de siempre —así volver a armar no ensucia el
   diff—, con las cuatro letras repartidas, sin tres seguidas iguales y sin
   que las primeras vayan en orden. */
function repartirMC(mc, semilla) {
  const n = mc.length, letras = mc[0][1].length;
  const cupo = [];
  for (let i = 0; i < n; i++) cupo.push(i % letras);
  const rng = dado(semilla);
  let dest = cupo;
  for (let intento = 0; intento < 800; intento++) {
    const t = cupo.slice();
    for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const x = t[i]; t[i] = t[j]; t[j] = x; }
    const tresIguales = t.some((_, i) => i + 2 < t.length && t[i] === t[i + 1] && t[i] === t[i + 2]);
    const enOrden = t.every((v, i) => i === 0 || v === (t[i - 1] + 1) % letras);
    if (!tresIguales && !enOrden) { dest = t; break; }
  }
  return mc.map(([q, ops, k], i) => {
    const t = dest[i] % ops.length;
    const resto = ops.filter((_, j) => j !== k);
    const nuevas = resto.slice(0, t).concat([ops[k]], resto.slice(t));
    return [q, nuevas, t];
  });
}

const MC = repartirMC([
  ['La moneda aparece en la taza al echar agua porque…', ['la luz se dobla al salir del agua', 'la moneda flota', 'el agua la empuja', 'la taza se inclina'], 0],
  ['¿Qué NO se puede averiguar pensando solo, sin mirar?', ['cuántos alumnos hay hoy en tu aula', 'que 2 + 2 son 4', 'que 10 es más que 5', 'que un triángulo tiene tres lados'], 0],
  ['¿Por qué hay que buscar a quien diga lo contrario?', ['si solo buscás lo que te da la razón, lo hallás siempre', 'para pelear', 'para ganar tiempo', 'porque sí'], 0],
  ['La misma agua tibia se siente distinta en cada mano porque…', ['la piel compara, no mide grados', 'el agua cambia', 'una mano está sucia', 'el agua se mueve'], 0],
  ['¿Quién decidió dudar de todo para ver qué quedaba en pie?', ['René Descartes', 'John Locke', 'Sócrates', 'Demócrito'], 0],
  ['Decir «no sé» es…', ['el punto de partida para averiguarlo', 'perder la discusión', 'lo mismo que opinar', 'una falta'], 0],
], 20260918);

/* ══════════════════ las hojas ══════════════════ */
const pags = [];
let p;

// ── 1 ──
const E = D.SAB_EPISTEMOLOGIA;
p = [];
p.push('<div class="idline"><span>Nombre:</span><span class="raya"></span><span>Nº-Lista:</span><span class="raya corta"></span></div>');
p.push(`<div class="fh">
      <div class="fh-txt">
        <div class="f-badge">📄 Ficha Didáctica: Misión ¿Cómo sé que sé?</div>
        <div class="f-meta"><b>Asignatura:</b> Filosofía &nbsp;·&nbsp; <b>Nivel:</b> Educación Básica, I, II y III Ciclo</div>
        <div class="f-meta"><b>Tema:</b> Las tres maneras de estar con una idea: creer, opinar y saber. Las cinco fuentes de lo que sabemos, con su fallo y su arreglo.</div>
        <div class="f-meta"><b>Además:</b> cuatro engaños para repetir en casa, los cinco pasos para comprobar algo y las dos escuelas que discutieron de dónde sale el saber.</div>
      </div>
      <div class="fh-qr">
        <img src="../img/qr-mision-como-se-que-se.png" alt="Código QR de la misión ¿Cómo sé que sé?">
        <span>Apunta con el teléfono para abrir la misión</span>
      </div>
    </div>`);
p.push('<h2>¿Por qué esta ficha?</h2>');
p.push('<p>En un aula de 43 alumnos con tres teléfonos, la misión no le llega a todos. Esta hoja lleva\n       lo mismo en papel. Se fotocopia, se lleva a casa y funciona sin señal y sin luz.</p>');
p.push(`<div class="caja idea"><b>Lo que hay que sacar de aquí:</b> «lo sé», «lo creo» y «es mi\n      opinión» no son lo mismo, aunque se digan con el mismo tono. Decir cuál de las tres es, y con\n      qué se sostiene, es la destreza de esta unidad. ${esc(E.ojo)}</div>`);
p.push('<h3>Objetivos</h3>');
p.push(`<ol class="objetivos">
      <li>Decir si una afirmación se sabe, se cree o es una opinión, y con qué prueba se distingue.</li>
      <li>Nombrar las cinco fuentes de lo que sabemos, con lo que cada una hace bien y lo que le falla.</li>
      <li>Repetir un engaño de los sentidos y explicar qué pasó de verdad.</li>
      <li>Aplicar los cinco pasos para comprobar una afirmación propia.</li>
      <li>Comparar el racionalismo y el empirismo, y decir en qué acierta cada uno.</li>
    </ol>`);
p.push('<h2>Le pasó a alguien</h2>');
/* ⚠️ La misma historia que la pantalla, no otra. Iba la del examen mal
   corregido —con la misma Yeimy y el mismo 40— y el alumno que lee las dos se
   pregunta cuál fue. La ficha lleva lo mismo en papel, no una variante. */
p.push('<p>En el recreo alguien le dijo a Yeimy que el examen de Matemáticas se había pasado\n       <b>para el jueves</b>. Esa noche no estudió. El martes el examen estaba ahí. <b>Sacó 40</b>.\n       Con esa nota se quedó fuera del cuadro de honor.</p>');
p.push('<div class="caja regla"><b>Nadie le mintió a propósito.</b> Se lo dijeron de oídas, y bastaba\n      una pregunta: <b>¿y vos cómo lo sabés?</b> El maestro estaba a diez pasos.</div>');
pags.push(p);

// ── 2 ──
p = [];
p.push('<h2>Tres maneras de estar con una idea</h2>');
p.push(`<p>${esc(E.hace)} Se llama <b>${esc(E.nombre)}</b>, y pregunta: ${esc(E.pregunta)}</p>`);
p.push('<p>Cada manera tiene su prueba. La prueba es una pregunta: se la haces a la idea y ella te\n       contesta cuál de las tres es.</p>');
EST.forEach(e => p.push(
  `<div class="sb-est c-${e.clave}"><b>${e.emoji} ${esc(e.nombre)}</b> <span class="et">${esc(e.corto)}</span><p class="s">${esc(e.senal)}</p><p class="p"><b>La prueba:</b> ${esc(e.prueba)}</p></div>`));
p.push(`<div class="caja truco">${rot('Y una cuarta:', D.SAB_NOSE)}</div>`);
pags.push(p);

// ── 3 ──
p = [];
p.push('<h2>De dónde sale lo que sabemos</h2>');
p.push('<p>Todo lo que sabés entró por algún lado. Son cinco puertas. Ninguna es mala, y ninguna\n       basta sola: cada una hace algo bien y cada una falla en algo.</p>');
FU.forEach(f => p.push(
  `<div class="sb-fte"><div class="t">${f.emoji} ${esc(f.nombre)}</div>` +
  `<ul><li>${rot('Sirve para:', f.sirve)}</li><li>${rot('Falla cuando:', f.falla)}</li></ul>` +
  `<p class="c">🛠 ${esc(f.arregla)}</p></div>`));
p.push(`<div class="caja idea">${rot('Ojo:', D.SAB_FUENTES_OJO)}</div>`);
pags.push(p);

// ── 4 ──
p = [];
p.push('<h2>Cuatro engaños que podés repetir en tu casa</h2>');
p.push('<p>No son trucos de magia: se hacen con lo que hay en una cocina. Hacelo, mirá lo que se ve\n       y después leé lo que pasó de verdad.</p>');
D.SAB_ENGANOS.forEach(g => p.push(
  `<div class="sb-eng"><b>${g.emoji} ${esc(g.titulo)}</b><p class="h">${rot('Hacelo:', g.hace)}</p>` +
  `<p class="v">${rot('Se ve:', g.ves)}</p><p class="h">${rot('Lo que pasa:', g.pasa)}</p>` +
  `<p class="d">${rot('Se desarma:', g.desarma)}</p></div>`));
p.push(`<div class="caja truco">${esc(D.SAB_ENGANOS_OJO)}</div>`);
pags.push(p);

// ── 5 ──
p = [];
p.push('<h2>Cinco pasos para comprobar algo</h2>');
p.push('<p>Sirven para cualquier cosa que alguien te diga. El quinto es el que más cuesta.</p>');
D.SAB_PASOS.forEach(s => p.push(
  `<div class="sb-paso"><b><span class="n">${s.n}</span> ${esc(s.paso)}</b><p>${esc(s.porque)}</p></div>`));
p.push('<h2>Dos escuelas que discutieron de dónde sale el saber</h2>');
p.push('<p>Las dos tienen razón en algo y a las dos les falta algo. Mira en qué acierta cada una y\n       en qué se queda corta.</p>');
p.push('<div class="sb-esc">' + D.SAB_ESCUELAS.map(x =>
  `<div><b>${x.emoji} ${esc(x.nombre)}</b><p class="d">${esc(x.dice)}</p>` +
  `<p class="a">${rot('Acierta:', x.acierta)}</p><p class="k">${rot('Se queda corta:', x.corto)}</p></div>`).join('') + '</div>');
p.push(`<div class="caja idea">${rot('Ojo:', D.SAB_ESCUELAS_OJO)}</div>`);
pags.push(p);

// ── 6 ──
p = [];
p.push('<h2>Palabras de la unidad</h2>');
p.push('<table><tr><th style="width:22%">Palabra</th><th>Qué quiere decir</th></tr>' +
  D.SAB_VOCABULARIO.map(v => `<tr><td class="k">${esc(v.w)}</td><td>${esc(v.a)}</td></tr>`).join('') + '</table>');
p.push('<h2>Dos que discutieron esto primero</h2>');
p.push('<p>Uno empezó dudando de todo; el otro dijo que la mente arranca vacía. Aquí <b>no hay ni una\n       fecha</b>, y no es un olvido: una fecha que no se puede acreditar no se escribe.</p>');
D.SAB_PENSADORES.forEach(x => p.push(
  `<div class="sb-pens"><b>${x.emoji} ${esc(x.nombre)}</b><p class="w">${esc(x.donde)}</p><p class="p">${esc(x.quien)}</p>` +
  `<p class="p"><b>Qué hizo:</b> ${esc(x.hizo)}</p><p class="p"><b>Por qué se le recuerda:</b> ${esc(x.porque)}</p>` +
  `<p class="dato"><b>Dato:</b> ${esc(x.dato)}</p></div>`));
p.push('<h2>Qué le da esta pregunta a cada materia</h2>');
p.push('<table><tr><th style="width:25%">Materia</th><th>Qué le deja</th></tr>' +
  D.SAB_ARBOL.map(a => `<tr><td class="k">${a.emoji} ${esc(a.materia)}</td><td>${esc(a.le)}<br><b>Pruébalo hoy:</b> ${esc(a.hoy)}</td></tr>`).join('') + '</table>');
pags.push(p);

// ── 7 · actividades 1-3 ──
p = [];
p.push('<h2>Actividades</h2>');
p.push('<div class="acts"><h3>1. ¿Lo sé, lo creo o es mi opinión? <span class="val">12 pts</span></h3>');
p.push('<p>Escribe <b>S</b> si se sabe y se puede comprobar, <b>C</b> si solo se cree, y <b>O</b> si\n       es una opinión.</p>');
p.push('<table><tr><th style="width:10%">S, C u O</th><th>La afirmación</th></tr>' +
  ACT1.map(([a]) => `<tr><td></td><td>${esc(a)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>2. La prueba de cada manera <span class="val">6 pts</span></h3>');
p.push('<p>Une cada prueba con su manera. Escribe la letra en el paréntesis.</p>');
p.push('<table><tr><th style="width:8%">( )</th><th>La pregunta que se le hace a la idea</th><th style="width:30%">La manera</th></tr>' +
  [0, 1, 2].map(i => `<tr><td></td><td>${esc(EST[ACT2[i]].prueba)}</td><td><b>${'abc'[i]})</b> ${EST[i].emoji} ${esc(EST[i].nombre)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>3. Comprueba una tuya <span class="val">10 pts</span></h3>');
p.push('<p>Escribe algo que «sabés» porque alguien te lo contó. Después pásale los cinco pasos.</p>');
p.push('<div class="caja regla"><b>Lo que alguien me contó:</b>\n      <span class="linea-resp" style="min-width:300px"></span></div>');
p.push('<table><tr><th style="width:42%">El paso</th><th>Qué me sale a mí</th></tr>' +
  D.SAB_PASOS.map(s => `<tr><td class="k">${s.n}. ${esc(s.paso)}</td><td></td></tr>`).join('') + '</table>');
p.push('</div>');
pags.push(p);

// ── 8 · actividades 4-5 + investiga ──
const INV = D.SAB_INVESTIGA;
p = [];
p.push('<div class="acts"><h3>4. Rellena el círculo de la letra correcta <span class="val">6 pts</span></h3>');
MC.forEach(([q, ops], i) => p.push(
  `<div class="preg"><div class="preg-q"><span class="preg-n">${i + 1}</span><span>${esc(q)}</span></div><div class="preg-ops">` +
  ops.map((o, k) => `<span class="op"><i></i><b>${'abcd'[k]})</b> ${esc(o)}</span>`).join('') + '</div></div>'));
p.push('</div>');
p.push('<div class="acts"><h3>5. Cada fuente y su arreglo <span class="val">10 pts</span></h3>');
p.push('<p>Completa cuándo falla cada fuente y cómo se arregla. La primera columna ya está.</p>');
p.push('<table><tr><th style="width:26%">La fuente</th><th>Falla cuando…</th><th>Se arregla…</th></tr>' +
  FU.map(f => `<tr><td class="k">${f.emoji} ${esc(f.nombre)}</td><td></td><td></td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<h2>Investiga (no se contesta copiando de aquí)</h2>');
p.push(`<p>${esc(INV.aviso)}</p>`);
p.push('<div class="caja idea">' + INV.preguntas.map((q, i) => `<b>${i + 1}.</b> ${esc(q)}`).join('<br>') + '</div>');
/* ⚠️ El rótulo es el GLIFO, no una palabra: el campo `cuidado` ya empieza por
   «Al preguntar», y con el rótulo escrito la hoja decía «Al preguntar: Al
   preguntar, se pregunta con respeto». La pantalla ya lo hacía así. */
p.push(`<div class="caja hn"><b>🤲</b> ${esc(INV.cuidado)}</div>`);
p.push('<h2>Para hacer entre varios</h2>');
p.push('<div class="caja regla"><b>La gaveta del maestro.</b> Cada uno trae en un papelito algo que\n      «todo el mundo sabe» en la escuela. Se leen en voz alta y a cada uno se le hace una sola\n      pregunta: <b>¿quién lo vio o lo midió?</b> Los que tengan respuesta se ponen en un montón; los\n      que no, en otro. Al final se elige uno del segundo montón y se decide entre todos cómo\n      comprobarlo esta semana.</div>');
pags.push(p);

/* ── la última: la pauta, SOLA. Es lo único del maestro que la ficha lleva, y
      el repartidor protege solo la última página. ── */
p = [];
p.push('<h2>Pauta de corrección · NO se fotocopia</h2>');
p.push('<div class="pauta">');
p.push('<div><span class="pt">1. ¿Lo sé, lo creo o es mi opinión? (12 pts)</span> ' +
  ACT1.map(([, l], i) => `${i + 1}. ${l}`).join(' · ') + '</div>');
p.push('<div><span class="pt">2. La prueba de cada manera (6 pts)</span> ' +
  [0, 1, 2].map(i => `${i + 1} → ${'abc'[ACT2[i]]} (${esc(EST[ACT2[i]].nombre)})`).join(' · ') +
  '. Las pruebas NO salen en el orden de las maneras: hay que leerlas.</div>');
p.push('<div><span class="pt">3. Comprueba una tuya (10 pts)</span> ⚠️ <b>No tiene una sola respuesta ' +
  'buena, a propósito.</b> Se califica que lo escrito en el paso 1 se pueda comprobar —«ese abono ' +
  'es mejor» no vale, «da más mazorcas por planta» sí—, que el paso 2 diga quién lo cuenta, y que ' +
  'el paso 5 nombre algo concreto que le haría cambiar de idea. Un «nada» en el 5 no se califica ' +
  'mal: se le pregunta entonces si estaba sabiendo o defendiendo.</div>');
p.push('<div><span class="pt">4. Selección múltiple (6 pts)</span> ' +
  MC.map(([, , k], i) => `${i + 1}. ${'abcd'[k]}`).join(' · ') + '</div>');
p.push('<div><span class="pt">5. Cada fuente y su arreglo (10 pts)</span> ' +
  /* ⚠️ El campo `arregla` ya empieza por «Se arregla», así que detrás del rótulo
     se le quita: sin esto la pauta decía «Se arregla: Se arregla escribiéndolo el
     mismo día» en las cinco. En la hoja de contenido el rótulo es el 🛠, por lo
     mismo. */
  FU.map(f => `<b>${esc(f.nombre)}</b> Falla: ${esc(f.falla)} Se arregla: ${esc(f.arregla).replace(/^Se arregla\s+/, '')}`).join(' · ') +
  '</div>');
p.push('<div><span class="pt">Investiga</span> ⚠️ <b>No trae respuestas, a propósito.</b> Las cuatro se ' +
  'contestan donde vive el alumno y no en esta hoja. Se califica que diga DE DÓNDE sacó cada cosa, ' +
  'a quién se lo preguntó y qué día; en la primera, que estén las DOS versiones y marcado en qué ' +
  'no coinciden.</div>');
p.push('</div>');
pags.push(p);

/* ══════════════════ el documento ══════════════════ */
const molde = fs.readFileSync(MOLDE, 'utf8');
let css = molde.slice(molde.indexOf('<style>') + 7, molde.indexOf('</style>'));
css = css.slice(0, css.indexOf('  /* ═══ LAS TRES PIEZAS DE UN ARGUMENTO ═══ */')) + CSS_PROPIO();
css = css.replace(`     · ⚠️ Aquí NO hay ni una fecha, y no es un olvido: está contado en la
       cabecera de js/data/filosofia-asombro.js. Ponerlas es la investigación
       de la página 7. */`,
`     · ⚠️ Aquí NO hay ni una fecha, y no es un olvido: está contado en la
       cabecera de js/data/filosofia-saber.js.
     · ⚠️ ESTA FICHA NO SE EDITA A MANO: sale de _dev/arma-ficha-saber.js. */`);

const secs = pags.map((bloques, i) =>
  `<!-- ═══════════ PÁGINA ${i + 1} ═══════════ -->\n<section class="pagina">\n  <div class="contenido">\n\n    ` +
  bloques.join('\n\n    ') +
  `\n\n  </div>\n  <div class="pag-pie">${PIE}<span>Página ${i + 1}</span></div>\n</section>`);

fs.writeFileSync(SALIDA, `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ficha Didáctica · Misión ¿Cómo sé que sé?</title>
<meta name="robots" content="noindex">
<style>${css}</style>
</head>
<body>
<button class="imprimir-btn" onclick="window.print()">🖨️ Imprimir la ficha</button>

<div class="doc">

${secs.join('\n\n')}

</div>
</body>
</html>
`);
console.log(`✔ ficha-como-se-que-se.html · ${pags.length} secciones (las hojas las reparte reparte-hojas-ficha.js)`);

/* ── lo propio de esta unidad. Va detrás del CSS común de las fichas. ── */
function CSS_PROPIO() {
  return `  /* ═══ LAS TRES MANERAS DE ESTAR CON UNA IDEA ═══
     ⚠️ Cada manera lleva SU EMOJI además del color. Esta hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde:
     sin el emoji, clasificar afirmaciones sería justo la actividad que él no
     puede hacer. */
  .sb-est { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
            padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .sb-est.c-creo { border-left-color: #b45309; }
  .sb-est.c-opino { border-left-color: #6b6b6b; }
  .sb-est.c-se { border-left-color: var(--verde); }
  .sb-est b { font-size: 11.5pt; color: var(--fil-osc); }
  .sb-est .et { font-size: 7.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
                border-radius: 999px; padding: 1px 7px; background: var(--fil-claro); color: var(--fil-osc); }
  .sb-est p.s { font-size: 10.5pt; font-weight: 700; margin: 2px 0; }
  .sb-est p.p { font-size: 10pt; background: var(--verde-claro); border-radius: 6px;
                padding: 3px 8px; margin: 3px 0 0; }

  /* ═══ LAS CINCO FUENTES ═══
     Lo que SIRVE va antes de lo que FALLA, y en la misma tarjeta: lo que
     enseña la fuente es que sirve Y falla, no que sea de fiar o no. */
  .sb-fte { border: 1.5px solid var(--linea); border-radius: 8px; padding: 6px 12px; margin: 6px 0;
            break-inside: avoid; }
  .sb-fte .t { font-size: 11pt; font-weight: 800; color: var(--fil-osc); }
  .sb-fte ul { margin: 2px 0 2px 22px; font-size: 10.5pt; }
  .sb-fte p.c { font-size: 10.5pt; font-weight: 700; border-top: 1.5px solid var(--fil);
                padding-top: 3px; margin: 3px 0 0; }

  /* ═══ LOS CUATRO ENGAÑOS ═══
     «Se ve» va destacado porque es lo que el alumno va a comprobar con sus
     manos antes de leer la explicación. */
  .sb-eng { border: 1.5px solid var(--linea); border-left: 5px solid var(--verde); border-radius: 8px;
            padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .sb-eng b { font-size: 11pt; color: var(--fil-osc); }
  .sb-eng p { font-size: 10pt; margin: 2px 0; }
  .sb-eng p.v { background: var(--fil-claro); border-radius: 6px; padding: 3px 8px; font-weight: 700; }
  .sb-eng p.d { background: var(--verde-claro); border-radius: 6px; padding: 3px 8px; margin: 3px 0 0; }

  /* ═══ LOS CINCO PASOS ═══ */
  .sb-paso { border: 1px solid var(--linea); border-radius: 7px; padding: 5px 10px; margin: 5px 0;
             break-inside: avoid; }
  .sb-paso b { font-size: 10.5pt; color: var(--fil-osc); }
  .sb-paso .n { display: inline-block; min-width: 17px; text-align: center; border-radius: 999px;
                background: var(--fil); color: #fff; font-size: 9pt; margin-right: 4px; }
  .sb-paso p { font-size: 10pt; color: var(--gris); margin: 1px 0 0; }

  /* ═══ LAS DOS ESCUELAS ═══
     Van una al lado de la otra a propósito: lo que se compara es que las dos
     aciertan en algo y a las dos les falta algo. */
  .sb-esc { display: flex; gap: 6px; margin: 6px 0; break-inside: avoid; flex-wrap: wrap; }
  .sb-esc > div { flex: 1 1 45%; border: 1px solid var(--linea); border-top: 4px solid var(--fil);
                  border-radius: 0 0 7px 7px; padding: 5px 9px; font-size: 10pt; background: #fdfafc; }
  .sb-esc b { display: block; font-size: 10.5pt; color: var(--fil-osc); }
  .sb-esc p { margin: 2px 0; }
  .sb-esc p.a { background: var(--verde-claro); border-radius: 6px; padding: 2px 7px; }
  /* ⚠️ «Se queda corta» NO va en gris claro, y no es estética: es la mitad
     honesta de la lección —que a las dos escuelas les falta algo— y esta hoja se
     fotocopia. En gris era lo más tenue de la página y en la fotocopia se pierde.
     Lleva el mismo trato que el «Falla aquí» de las fuentes. */
  .sb-esc p.k { background: #fdeaea; border-radius: 6px; padding: 2px 7px; }

  .sb-pens { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
             padding: 7px 12px; margin: 7px 0; break-inside: avoid; }
  .sb-pens b { font-size: 11.5pt; color: var(--fil-osc); }
  .sb-pens p.w { font-size: 9pt; color: var(--gris); font-style: italic; margin: 0; }
  .sb-pens p.p { font-size: 10.5pt; margin: 3px 0; }
  .sb-pens p.dato { font-size: 9.5pt; color: var(--gris); margin: 0; }

`;
}
