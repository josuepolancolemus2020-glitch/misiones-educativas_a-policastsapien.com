/* ════════════════════════════════════════════════════════════════════
   ARMA fichas/ficha-de-que-esta-hecho-el-mundo.html DESDE los datos
   ────────────────────────────────────────────────────────────────────
   Igual que `_dev/arma-fichas-ia.js` arma las cuatro de la Ruta de la Máquina
   que Aprende, y por el mismo motivo: **el contenido sale del mismo archivo
   que pinta la pantalla** (`js/data/filosofia-mundo.js`). Una corrección hecha
   solo en el HTML de la ficha se pierde en el siguiente armado, y hasta
   entonces la pantalla y el papel dicen cosas distintas.

   Lo que se publica es el HTML resultante, plano y editable como las otras 78.

       node _dev/arma-ficha-mundo.js
       node _dev/reparte-hojas-ficha.js --todas ficha-de-que-esta-hecho-el-mundo
       node _dev/verifica-ficha-paginas.js ficha-de-que-esta-hecho-el-mundo

   ⚠️ Las HOJAS las reparte el repartidor, no este guion: aquí se emiten nueve
   secciones de alumno más la pauta, y él mueve los cortes hasta el mínimo.

   ⚠️ Y cada actividad va en SU PROPIO `<div class="acts">`. Iban las tres en
   uno solo y el repartidor no puede partir un bloque: dejó el «Actividades»
   solo en una hoja de 28,8 mm y la ficha se fue a once.
   ════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'fichas/ficha-de-que-esta-hecho-el-mundo.html');
/* El CSS común sale de la ficha de la unidad 2, que es de donde se calcó: lo
   propio de esta unidad se le pega detrás, en `CSS_PROPIO`. */
const MOLDE = path.join(RAIZ, 'fichas/ficha-pensar-con-orden.html');

/* ── los datos, cargados de verdad ───────────────────────────────── */
const src = fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-mundo.js'), 'utf8');
const nombres = [...src.matchAll(/^const\s+([A-Z_0-9]+)\s*=/gm)].map(m => m[1]);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src + ';this.__D={' + nombres.join(',') + '};', ctx);
const D = ctx.__D;

const CAMBIOS = D.MUN_CAMBIOS, TIPOS = D.MUN_TIPOS;
const de = q => CAMBIOS.filter(x => x.q === q).map(x => x.c);
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

const PIE = '<span>🌳 Ruta de la Raíz · Etapa 3 · <b>¿De qué está hecho el mundo?</b></span>';

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

/* ── Actividad 1: doce cambios con su clase. Salen del archivo de datos, así
      que el ejercicio y la pauta NO se pueden contradecir.
      ⚠️ Y se BARAJAN: en fila salían F·M·D·F·M·D… y quien lo note contesta los
      doce sin leer uno. Nunca tres seguidas iguales, que es lo que se ve desde
      el pupitre. ── */
const LETRA = { forma: 'F', materia: 'M', nombre: 'D' };
let ACT1 = [];
for (let i = 0; i < 4; i++) {
  ACT1.push([de('forma')[i], 'F'], [de('materia')[i], 'M'], [de('nombre')[i], 'D']);
}
(function barajar() {
  const rng = dado(20260917);
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
      clases a propósito: en fila, la respuesta era a·b·c sin leer una sola.
      ACT2[i] dice qué clase le toca a la fila i. ── */
const ACT2 = [1, 2, 0];

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
  ['La masa se vuelve tortilla. ¿Qué cambió?', ['la forma', 'la materia', 'el nombre', 'nada'], 0],
  ['El clavo se llena de herrumbre. ¿Qué cambió?', ['el dueño', 'la materia', 'solo la forma', 'nada'], 1],
  ['A la aldea la vuelven municipio. ¿Qué le pasó al suelo?', ['cambió de materia', 'cambió de forma', 'nada: cambió lo que decimos', 'se hizo más grande'], 2],
  ['La palabra «átomo» quiere decir…', ['muy pequeño', 'lo que brilla', 'lo que pesa', 'lo que no se parte'], 3],
  ['Se quema un tronco y queda un puño de ceniza. ¿Se perdió materia?', ['no: lo que se fue en humo también pesa', 'sí, casi toda', 'sí, la mitad', 'no se puede saber'], 0],
  ['Una cosmovisión es…', ['un mapa del cielo', 'la forma entera en que un pueblo explica el mundo', 'una lista de fechas', 'un aparato'], 1],
], 20260917);

/* ══════════════════ las hojas ══════════════════ */
const pags = [];
let p;

// ── 1 ──
p = [];
p.push('<div class="idline"><span>Nombre:</span><span class="raya"></span><span>Nº-Lista:</span><span class="raya corta"></span></div>');
p.push(`<div class="fh">
      <div class="fh-txt">
        <div class="f-badge">📄 Ficha Didáctica: Misión ¿De qué está hecho el mundo?</div>
        <div class="f-meta"><b>Asignatura:</b> Filosofía &nbsp;·&nbsp; <b>Nivel:</b> Educación Básica, I, II y III Ciclo</div>
        <div class="f-meta"><b>Tema:</b> Las cuatro preguntas de la metafísica. Las tres clases de cambio y su prueba. Cuándo algo sigue siendo lo mismo. De lo que se pensó a lo que hoy se mide. Qué es una cosmovisión.</div>
      </div>
      <div class="fh-qr">
        <img src="../img/qr-mision-de-que-esta-hecho-el-mundo.png" alt="Código QR de la misión ¿De qué está hecho el mundo?">
        <span>Apunta con el teléfono para abrir la misión</span>
      </div>
    </div>`);
p.push('<h2>¿Por qué esta ficha?</h2>');
p.push('<p>En un aula de 43 alumnos con tres teléfonos, la misión no le llega a todos. Esta hoja lleva\n       lo mismo en papel. Se fotocopia, se lleva a casa y funciona sin señal y sin luz.</p>');
p.push('<div class="caja idea"><b>Lo que hay que sacar de aquí:</b> no todo cambio es el mismo cambio.\n      A veces cambia la forma, a veces la materia, y a veces no le pasa nada a la cosa: solo cambia\n      lo que decimos de ella. Saber cuál es cuál es la destreza de esta unidad.</div>');
p.push('<h3>Objetivos</h3>');
p.push(`<ol class="objetivos">
      <li>Decir de qué clase es un cambio y con qué prueba se sabe.</li>
      <li>Separar lo que le pasa a la cosa de lo que solo cambia en lo que decimos.</li>
      <li>Escribir una regla propia de cuándo algo sigue siendo lo mismo, y aplicarla igual a varios casos.</li>
      <li>Contar una pregunta que la filosofía hizo y hoy la ciencia mide.</li>
      <li>Explicar qué es una cosmovisión y averiguar la de su propio municipio.</li>
    </ol>`);
p.push('<h2>Le pasó a alguien</h2>');
p.push('<p>El abuelo le dejó el machete a Elvin. Hace años le cambiaron el <b>mango</b>. El verano\n       pasado, la <b>hoja</b>. Ahora su hermana dice que ese ya no es el machete del abuelo, que del\n       de él no queda nada, y que entonces le toca la mitad de lo que valga.</p>');
p.push('<div class="caja regla"><b>Llevan tres semanas sin hablarse</b> por una pregunta que ninguno\n      de los dos sabe contestar: ¿sigue siendo el mismo machete? Los dos tienen media razón, y por eso\n      no se acaba. Lo que les falta es una <b>regla</b> dicha antes de discutir.</div>');
pags.push(p);

// ── 2 ──
p = [];
p.push('<h2>Cuatro preguntas que no se cierran solas</h2>');
p.push(`<p>${esc(D.MUN_METAFISICA.hace)} Se llama <b>${esc(D.MUN_METAFISICA.nombre)}</b>, y pregunta: ${esc(D.MUN_METAFISICA.pregunta)}</p>`);
p.push('<div class="rejilla">' + D.MUN_PREGUNTAS.map(x =>
  `<div><b>${x.emoji} ${esc(x.nombre)}</b><p class="q">${esc(x.que)}</p><p class="h"><i>${esc(x.aqui)}</i></p><p class="h">${esc(x.hoy)}</p></div>`).join('') + '</div>');
p.push(`<div class="caja truco">${rot('Ojo:', D.MUN_METAFISICA.ojo)}</div>`);
p.push('<h2>No todo cambio es el mismo cambio</h2>');
p.push('<p>Hay tres clases, y cada una tiene su prueba. La prueba es una pregunta: se la haces al\n       cambio y él te contesta cuál es.</p>');
TIPOS.forEach(t => p.push(
  `<div class="sem c-${t.clave}"><b>${t.emoji} ${esc(t.nombre)}</b> <span class="et">${esc(t.corto)}</span><p class="s">${esc(t.senal)}</p><p class="p"><b>La prueba:</b> ${esc(t.prueba)}</p></div>`));
p.push(`<div class="caja truco">${rot('Un atajo que falla:', D.MUN_TIPOS_OJO)}</div>`);
pags.push(p);

// ── 3 ──
p = [];
p.push('<h2>¿Sigue siendo el mismo?</h2>');
p.push('<p>El caso de Elvin y tres más. <b>Ninguno tiene una sola respuesta buena</b>, y eso no es un\n       fallo: es lo que hace dura la pregunta. Lo que sí se puede hacer es decir tu regla antes y\n       aplicarla igual a los cuatro.</p>');
D.MUN_IDENTIDAD.forEach(k => p.push(
  `<div class="val"><div class="t">${k.emoji} ${esc(k.titulo)}</div><p class="q">${esc(k.cambio)}</p>` +
  `<ul><li>✅ ${esc(k.unos)}</li><li>❌ ${esc(k.otros)}</li></ul>` +
  `<p class="c">Lo que lo decide: ${esc(k.decide)}</p></div>`));
p.push(`<div class="caja regla">${rot('Ojo:', D.MUN_IDENTIDAD_OJO)}</div>`);
pags.push(p);

// ── 4 ──
p = [];
p.push('<h2>De lo que se pensó a lo que hoy se mide</h2>');
p.push('<p>Estas cuatro preguntas las hizo la filosofía cuando no había con qué medirlas. Hoy la\n       ciencia las contesta con una balanza y una tabla. Mira qué cambió y qué no.</p>');
D.MUN_PUENTE.forEach(x => p.push(
  `<div class="si2-wrap"><p class="puente-p"><b>${esc(x.p)}</b></p><div class="si2">` +
  `<div class="ok"><b>🌌 Se contestó pensando</b><p>${esc(x.antes)}</p></div>` +
  `<div class="no"><b>🔬 Hoy se mide</b><p>${esc(x.hoy)}</p></div></div>` +
  `<p class="puente-q">${esc(x.quien)}</p></div>`));
p.push(`<div class="caja idea">${rot('Ojo:', D.MUN_PUENTE_OJO)}</div>`);
pags.push(p);

// ── 5 ──
const C = D.MUN_COSMOS;
p = [];
p.push('<h2>Cada pueblo explica el mundo entero</h2>');
p.push(`<p>${esc(C.que)}</p>`);
p.push(`<p>${esc(C.toda)}</p>`);
p.push('<p>Toda cosmovisión contesta estas tres:</p>');
p.push('<ul>' + C.preguntas.map(q => `<li>${q.emoji} ${esc(q.p)}</li>`).join('') + '</ul>');
p.push(`<div class="caja hn">${rot('En Honduras:', C.aqui)}</div>`);
p.push('<h2>Palabras de la unidad</h2>');
p.push('<table><tr><th style="width:22%">Palabra</th><th>Qué quiere decir</th></tr>' +
  D.MUN_VOCABULARIO.map(v => `<tr><td class="k">${esc(v.w)}</td><td>${esc(v.a)}</td></tr>`).join('') + '</table>');
pags.push(p);

// ── 6 ──
p = [];
p.push('<h2>Tres que discutieron esto primero</h2>');
p.push('<p>Uno pensó las piezas sin verlas; los otros dos no se pusieron de acuerdo, y su discusión\n       sigue abierta. Aquí <b>no hay ni una fecha</b>, y no es un olvido: una fecha que no se puede\n       acreditar no se escribe. Ponerlas es la investigación de más adelante.</p>');
D.MUN_PENSADORES.forEach(x => p.push(
  `<div class="pens"><b>${x.emoji} ${esc(x.nombre)}</b><p class="w">${esc(x.donde)}</p><p class="p">${esc(x.quien)}</p>` +
  `<p class="p"><b>Qué hizo:</b> ${esc(x.hizo)}</p><p class="p"><b>Por qué se le recuerda:</b> ${esc(x.porque)}</p>` +
  `<p class="dato"><b>Dato:</b> ${esc(x.dato)}</p></div>`));
p.push('<h2>Qué le da esta pregunta a cada materia</h2>');
p.push('<table><tr><th style="width:25%">Materia</th><th>Qué le deja</th></tr>' +
  D.MUN_ARBOL.map(a => `<tr><td class="k">${a.emoji} ${esc(a.materia)}</td><td>${esc(a.le)}<br><b>Pruébalo hoy:</b> ${esc(a.hoy)}</td></tr>`).join('') + '</table>');
pags.push(p);

// ── 7 · actividades 1-3 ──
p = [];
p.push('<h2>Actividades</h2>');
p.push('<div class="acts"><h3>1. ¿Qué cambió? <span class="val">12 pts</span></h3>');
p.push('<p>Escribe <b>F</b> si cambió la forma, <b>M</b> si cambió la materia y <b>D</b> si solo\n       cambió lo que decimos.</p>');
p.push('<table><tr><th style="width:10%">F, M o D</th><th>El cambio</th></tr>' +
  ACT1.map(([c]) => `<tr><td></td><td>${esc(c)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>2. La prueba de cada clase <span class="val">6 pts</span></h3>');
p.push('<p>Une cada prueba con su clase de cambio. Escribe la letra en el paréntesis.</p>');
p.push('<table><tr><th style="width:8%">( )</th><th>La pregunta que se le hace al cambio</th><th style="width:30%">La clase</th></tr>' +
  [0, 1, 2].map(i => `<tr><td></td><td>${esc(TIPOS[ACT2[i]].prueba)}</td><td><b>${'abc'[i]})</b> ${TIPOS[i].emoji} ${esc(TIPOS[i].nombre)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>3. Tu regla <span class="val">8 pts</span></h3>');
p.push('<p>Primero escribe tu regla. Después contesta los cuatro casos <b>con la misma regla</b>.</p>');
p.push('<div class="caja regla"><b>Mi regla:</b> algo sigue siendo lo mismo mientras\n      <span class="linea-resp" style="min-width:330px"></span></div>');
p.push('<table><tr><th style="width:10%">Sí o no</th><th>El caso</th><th style="width:40%">Por qué, con mi regla</th></tr>' +
  D.MUN_IDENTIDAD.map(k => `<tr><td></td><td>${k.emoji} ${esc(k.titulo)}: ${esc(k.cambio)}</td><td></td></tr>`).join('') + '</table>');
p.push('</div>');
pags.push(p);

// ── 8 · actividades 4-5 + investiga ──
const INV = D.MUN_INVESTIGA;
p = [];
p.push('<div class="acts"><h3>4. Rellena el círculo de la letra correcta <span class="val">6 pts</span></h3>');
MC.forEach(([q, ops], i) => p.push(
  `<div class="preg"><div class="preg-q"><span class="preg-n">${i + 1}</span><span>${esc(q)}</span></div><div class="preg-ops">` +
  ops.map((o, k) => `<span class="op"><i></i><b>${'abcd'[k]})</b> ${esc(o)}</span>`).join('') + '</div></div>'));
p.push('</div>');
p.push('<div class="acts"><h3>5. Antes y hoy <span class="val">8 pts</span></h3>');
p.push('<p>Completa qué se contestaba antes, pensando, y qué se mide hoy.</p>');
p.push('<table><tr><th style="width:34%">La pregunta</th><th>Antes se contestó…</th><th>Hoy se mide…</th></tr>' +
  D.MUN_PUENTE.map(x => `<tr><td class="k">${esc(x.p)}</td><td></td><td></td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<h2>Investiga (no se contesta copiando de aquí)</h2>');
p.push(`<p>${esc(INV.aviso)}</p>`);
p.push('<div class="caja idea">' + INV.preguntas.map((q, i) => `<b>${i + 1}.</b> ${esc(q)}`).join('<br>') + '</div>');
/* ⚠️ El rótulo es el GLIFO, no una palabra: el campo `cuidado` ya empieza por
   «Al preguntar», y con el rótulo escrito la hoja decía «Al preguntar: Al
   preguntar, se pregunta con respeto». La pantalla ya lo hacía así. */
p.push(`<div class="caja hn"><b>🤲</b> ${esc(INV.cuidado)}</div>`);
p.push('<h2>Para hacer entre varios</h2>');
p.push('<div class="caja regla"><b>La mesa de los cambios.</b> Cada uno trae en un papelito un cambio\n      que vio esta semana en su casa. Se ponen en tres montones: 🔵 la forma, 🟠 la materia y ⚪ solo\n      lo que decimos. Los que no cuadren en ninguno se apartan y se les hace la prueba en voz alta.\n      Al final, cada uno escribe en su cuaderno un cambio que se pasó de montón y por qué.</div>');
pags.push(p);

/* ── la última: la pauta, SOLA. Es lo único del maestro que la ficha lleva, y
      el repartidor protege solo la última página. ── */
p = [];
p.push('<h2>Pauta de corrección · NO se fotocopia</h2>');
p.push('<div class="pauta">');
p.push('<div><span class="pt">1. ¿Qué cambió? (12 pts)</span> ' +
  ACT1.map(([, l], i) => `${i + 1}. ${l}`).join(' · ') + '</div>');
p.push('<div><span class="pt">2. La prueba de cada clase (6 pts)</span> ' +
  [0, 1, 2].map(i => `${i + 1} → ${'abc'[ACT2[i]]} (${esc(TIPOS[ACT2[i]].nombre)})`).join(' · ') +
  '. Las pruebas NO salen en el orden de las clases: hay que leerlas.</div>');
p.push('<div><span class="pt">3. Tu regla (8 pts)</span> ⚠️ <b>No tiene una sola respuesta buena, ' +
  'a propósito.</b> Se califica que la regla esté escrita ANTES, que sea una sola y que se ' +
  'aplique IGUAL a los cuatro casos. Un «sí» y un «no» pueden valer los dos: lo que no vale ' +
  'es cambiar de regla a mitad de camino.</div>');
p.push('<div><span class="pt">4. Selección múltiple (6 pts)</span> ' +
  MC.map(([, , k], i) => `${i + 1}. ${'abcd'[k]}`).join(' · ') + '</div>');
p.push('<div><span class="pt">5. Antes y hoy (8 pts)</span> ' +
  D.MUN_PUENTE.map(x => `<b>${esc(x.p)}</b> Antes: ${esc(x.antes)} Hoy: ${esc(x.hoy)}`).join(' · ') + '</div>');
p.push('<div><span class="pt">Investiga</span> ⚠️ <b>No trae respuestas, a propósito.</b> Aquí no está ' +
  'escrita la cosmovisión de ningún pueblo porque no hay con qué acreditarla, y ponerle a un ' +
  'pueblo una creencia que no se sostiene es peor que callarla. Se califica que diga DE DÓNDE ' +
  'sacó cada cosa y a quién se lo preguntó.</div>');
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
       cabecera de js/data/filosofia-mundo.js. Ponerlas es la investigación.
     · ⚠️ Y NO se escribe qué dice la cosmovisión de ningún pueblo de Honduras:
       no hay con qué acreditarlo, y ponerle a un pueblo una creencia que no se
       sostiene es peor que callarla. Por eso esa parte es una investigación.
     · ⚠️ ESTA FICHA NO SE EDITA A MANO: sale de _dev/arma-ficha-mundo.js. */`);

const secs = pags.map((bloques, i) =>
  `<!-- ═══════════ PÁGINA ${i + 1} ═══════════ -->\n<section class="pagina">\n  <div class="contenido">\n\n    ` +
  bloques.join('\n\n    ') +
  `\n\n  </div>\n  <div class="pag-pie">${PIE}<span>Página ${i + 1}</span></div>\n</section>`);

fs.writeFileSync(SALIDA, `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ficha Didáctica · Misión ¿De qué está hecho el mundo?</title>
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
console.log(`✔ ficha-de-que-esta-hecho-el-mundo.html · ${pags.length} secciones (las hojas las reparte reparte-hojas-ficha.js)`);

/* ── lo propio de esta unidad. Va detrás del CSS común de las fichas. ── */
function CSS_PROPIO() {
  return `  /* ═══ LAS CUATRO PREGUNTAS GRANDES ═══ */
  .rejilla { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
  .rejilla > div { flex: 1 1 47%; border: 1px solid var(--linea); border-radius: 7px; padding: 5px 9px;
                   font-size: 9.5pt; background: #fdfafc; break-inside: avoid; }
  .rejilla b { display: block; font-size: 10pt; color: var(--fil-osc); }
  .rejilla .q { font-weight: 700; margin: 1px 0; }
  .rejilla .h { color: var(--gris); margin: 0; }

  /* ═══ LAS TRES CLASES DE CAMBIO ═══
     ⚠️ Cada clase lleva SU EMOJI además del color. Esta hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde:
     sin el emoji, clasificar cambios sería justo la actividad que él no
     puede hacer. */
  .sem { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
         padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .sem.c-forma { border-left-color: #1d4f91; }
  .sem.c-materia { border-left-color: #b45309; }
  .sem.c-nombre { border-left-color: #6b6b6b; }
  .sem b { font-size: 11.5pt; color: var(--fil-osc); }
  .sem .et { font-size: 7.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
             border-radius: 999px; padding: 1px 7px; background: var(--fil-claro); color: var(--fil-osc); }
  .sem p.s { font-size: 10.5pt; font-weight: 700; margin: 2px 0; }
  .sem p.p { font-size: 10pt; background: var(--verde-claro); border-radius: 6px;
             padding: 3px 8px; margin: 3px 0 0; }

  /* ═══ ¿SIGUE SIENDO EL MISMO? ═══
     Las dos respuestas van juntas y con la raya encima de lo que decide: lo
     que enseña la tarjeta es que las dos se sostienen. */
  .val { border: 1.5px solid var(--linea); border-radius: 8px; padding: 6px 12px; margin: 6px 0;
         break-inside: avoid; }
  .val .t { font-size: 11pt; font-weight: 800; color: var(--fil-osc); }
  .val p.q { font-size: 10.5pt; font-weight: 700; margin: 2px 0; }
  .val ul { margin: 2px 0 2px 22px; font-size: 10.5pt; }
  .val p.c { font-size: 10.5pt; font-weight: 700; border-top: 1.5px solid var(--fil);
             padding-top: 3px; margin: 3px 0 0; }

  /* ═══ EL PUENTE: lo que se pensó y lo que hoy se mide ═══ */
  .si2-wrap { margin: 6px 0; break-inside: avoid; }
  .puente-p { font-size: 11pt; color: var(--fil-osc); margin: 0 0 2px; }
  .puente-q { font-size: 9.5pt; color: var(--gris); margin: 2px 0 0; }
  .si2 { display: flex; gap: 6px; margin: 0; break-inside: avoid; flex-wrap: wrap; }
  .si2 > div { flex: 1 1 45%; border: 1px solid var(--linea); border-top: 4px solid var(--fil);
               border-radius: 0 0 7px 7px; padding: 5px 9px; font-size: 10pt; background: #fdfafc; }
  .si2 > div.ok { border-top-color: var(--fil); }
  .si2 > div.no { border-top-color: var(--verde); }
  .si2 b { display: block; font-size: 10.5pt; color: var(--fil-osc); }
  .si2 p { margin: 0; }

  .pens { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
          padding: 7px 12px; margin: 7px 0; break-inside: avoid; }
  .pens b { font-size: 11.5pt; color: var(--fil-osc); }
  .pens p.w { font-size: 9pt; color: var(--gris); font-style: italic; margin: 0; }
  .pens p.p { font-size: 10.5pt; margin: 3px 0; }
  .pens p.dato { font-size: 9.5pt; color: var(--gris); margin: 0; }

`;
}
