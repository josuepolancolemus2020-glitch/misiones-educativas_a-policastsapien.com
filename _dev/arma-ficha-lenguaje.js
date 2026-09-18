/* ════════════════════════════════════════════════════════════════════
   ARMA fichas/ficha-palabras-que-piensan.html DESDE los datos
   ────────────────────────────────────────────────────────────────────
   Igual que `_dev/arma-ficha-saber.js` arma la de la unidad 4, y por el mismo
   motivo: **el contenido sale del mismo archivo que pinta la pantalla**
   (`js/data/filosofia-lenguaje.js`). Una corrección hecha solo en el HTML de
   la ficha se pierde en el siguiente armado, y hasta entonces la pantalla y el
   papel dicen cosas distintas.

   Lo que se publica es el HTML resultante, plano y editable como las otras 80.

       node _dev/arma-ficha-lenguaje.js
       node _dev/reparte-hojas-ficha.js --todas ficha-palabras-que-piensan
       node _dev/verifica-ficha-paginas.js ficha-palabras-que-piensan

   ⚠️ Las HOJAS las reparte el repartidor, no este guion: aquí se emiten nueve
   secciones de alumno más la pauta, y él mueve los cortes hasta el mínimo.

   ⚠️ Y cada actividad va en SU PROPIO `<div class="acts">`. Iban las tres de la
   unidad 3 en uno solo y el repartidor no puede partir un bloque: dejó el
   «Actividades» solo en una hoja de 28,8 mm y la ficha se fue a once.

   ⚠️ Las clases propias van con prefijo `lg-`. La ficha de la unidad 2 declara
   un `.val` de bloque y esa misma clase es el `<span class="val">12 pts</span>`
   de los títulos de actividad: el rótulo de puntos sale metido en un recuadro.
   Aquí no se hereda ese choque.
   ════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'fichas/ficha-palabras-que-piensan.html');
/* El CSS común sale de la ficha de la unidad 2, que es de donde se calcó: lo
   propio de esta unidad se le pega detrás, en `CSS_PROPIO`. */
const MOLDE = path.join(RAIZ, 'fichas/ficha-pensar-con-orden.html');

/* ── los datos, cargados de verdad. ⚠️ `require` no sirve: el archivo es de
      navegador —`const` pelados, sin `module.exports`— y devolvería `{}`. Es
      la avería que dejó a `mide-legibilidad` midiendo media misión. ── */
const src = fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-lenguaje.js'), 'utf8');
const nombres = [...src.matchAll(/^const\s+([A-Z_0-9]+)\s*=/gm)].map(m => m[1]);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src + ';this.__D={' + nombres.join(',') + ',lenDeClase:lenDeClase,lenDerechas:lenDerechas};', ctx);
const D = ctx.__D;

const AC = D.LEN_ACTOS, FR = D.LEN_FRASES, AM = D.LEN_AMBIG;
const de = c => D.lenDeClase(c);
const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ⚠️ El rótulo no puede repetir el dato. Varios campos ya empiezan por lo
   mismo que el rótulo —«Ojo: la forma no dice…» detrás de un «<b>Ojo:</b>»—, y
   la hoja salía diciendo «Ojo: Ojo: la forma no dice…». No lo caza ninguna
   sonda: el texto está, y es el del archivo de datos. Se vio mirando la hoja.
   `rot()` pega el rótulo y le quita al dato ese arranque repetido. */
function rot(rotulo, txt) {
  const r = rotulo.replace(/:$/, '');
  const re = new RegExp('^' + r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[:,]?\\s+', 'i');
  return `<b>${rotulo}</b> ${esc(String(txt).replace(re, ''))}`;
}

const PIE = '<span>🌳 Ruta de la Raíz · Etapa 5 · <b>Palabras que piensan</b></span>';

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

/* ── Actividad 1: doce frases con lo que HACE cada una. Salen del archivo de
      datos, así que el ejercicio y la pauta NO se pueden contradecir.
      ⚠️ Y se BARAJAN: en fila salían A·P·M·E·A·P… y quien lo note contesta las
      doce sin leer una. Nunca tres seguidas iguales, que es lo que se ve desde
      el pupitre. ── */
const LETRA = { afirma: 'A', pregunta: 'P', pide: 'M', exclama: 'E' };
let ACT1 = [];
for (let i = 0; i < 3; i++) {
  AC.forEach(a => ACT1.push([de(a.clave)[i], LETRA[a.clave]]));
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

/* ── Actividad 2: el orden en que salen las cuatro PRUEBAS. NO es el de las
      clases a propósito: en fila, la respuesta era a·b·c·d sin leer una sola.
      ACT2[i] dice qué clase le toca a la fila i. ── */
const ACT2 = [2, 0, 3, 1];

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
  ['En la mesa, «¿me pasás la sal?» ¿qué hace?', ['Pide una acción', 'Pregunta un dato', 'Afirma algo', 'Exclama'], 0],
  ['«Una silla es algo donde uno se sienta.» Esa definición…', ['está justa', 'es muy ancha: entra una piedra', 'es muy angosta', 'no dice nada'], 1],
  ['«Un ave es un animal que vuela.» Esa definición…', ['está justa', 'es muy ancha', 'es muy angosta: deja fuera la gallina', 'no dice nada'], 2],
  ['«Te espero en el banco» dice dos cosas. ¿Con qué se arregla?', ['Escribiéndola más bonita', 'Hablando más fuerte', 'Cambiando de tema', 'Preguntando en cuál de los dos'], 3],
  ['«¿Por qué el abono caro rinde más?» ¿Qué tiene de raro?', ['Da por hecho que rinde más', 'Es muy larga', 'No lleva signos', 'Nada: es una pregunta normal'], 0],
  ['«Es de mejor calidad» no se puede comprobar porque…', ['es mentira', 'no dice mejor en qué ni cuánto', 'está mal escrita', 'nadie la dice'], 1],
], 20260918);

/* ══════════════════ las hojas ══════════════════ */
const pags = [];
let p;

// ── 1 ──
const L = D.LEN_LENGUAJE;
p = [];
p.push('<div class="idline"><span>Nombre:</span><span class="raya"></span><span>Nº-Lista:</span><span class="raya corta"></span></div>');
p.push(`<div class="fh">
      <div class="fh-txt">
        <div class="f-badge">📄 Ficha Didáctica: Misión Palabras que piensan</div>
        <div class="f-meta"><b>Asignatura:</b> Filosofía &nbsp;·&nbsp; <b>Nivel:</b> Educación Básica, I, II y III Ciclo</div>
        <div class="f-meta"><b>Tema:</b> Qué hace una frase: afirma, pregunta, pide o exclama. Y la forma no dice lo que hace.</div>
        <div class="f-meta"><b>Además:</b> las frases que dicen dos cosas y las dos pruebas de una definición. Y lo que arrastra la palabra elegida.</div>
      </div>
      <div class="fh-qr">
        <img src="../img/qr-mision-palabras-que-piensan.png" alt="Código QR de la misión Palabras que piensan">
        <span>Apunta con el teléfono para abrir la misión</span>
      </div>
    </div>`);
p.push('<h2>¿Por qué esta ficha?</h2>');
p.push('<p>En un aula de 43 alumnos con tres teléfonos, la misión no le llega a todos. Esta hoja lleva\n       lo mismo en papel. Se fotocopia, se lleva a casa y funciona sin señal y sin luz.</p>');
p.push(`<div class="caja idea"><b>Lo que hay que sacar de aquí:</b> una frase no solo dice cosas.\n      <b>Hace</b> cosas. Saber qué hace —y darse cuenta cuando la forma engaña— es la destreza de\n      esta unidad. ${esc(L.ojo)}</div>`);
p.push('<h3>Objetivos</h3>');
p.push(`<ol class="objetivos">
      <li>Decir qué hace una frase: si afirma, si pregunta, si pide o si exclama, con su prueba.</li>
      <li>Darse cuenta cuando la forma de la frase no dice lo que la frase hace.</li>
      <li>Encontrar las dos lecturas de una frase ambigua y la pregunta que la arregla.</li>
      <li>Probar una definición: buscar lo que entra y no debería, y lo que queda fuera y sí.</li>
      <li>Reconocer los tres trucos de la palabra, y el caso en que una palabra fuerte sí vale.</li>
    </ol>`);
p.push('<h2>Le pasó a alguien</h2>');
/* ⚠️ La misma historia que la pantalla, no otra. El alumno que lee las dos se
   pregunta cuál de las dos fue. La ficha lleva lo mismo en papel. */
p.push('<p>A Marlon le llegó un mensaje: «Te espero en el banco a las tres». Él fue al <b>banco de la\n       plaza</b>, a hacer el trámite. El otro lo esperaba en la <b>banca del parque</b>.</p>');
p.push('<p>Los dos se fueron a las cuatro sin verse. <b>El trámite se pasó para otro día.</b></p>');
p.push('<div class="caja regla"><b>Nadie escribió mal.</b> La frase estaba perfecta, y decía dos cosas.\n      Faltaba una pregunta de cuatro palabras: <b>¿en cuál de los dos?</b></div>');
pags.push(p);

// ── 2 ──
p = [];
p.push('<h2>Una frase no solo dice: hace</h2>');
p.push(`<p>${esc(L.hace)} Se llama <b>${esc(L.nombre)}</b>, y pregunta: ${esc(L.pregunta)}</p>`);
p.push('<p>Son cuatro cosas. Cada una tiene su prueba. La prueba es una pregunta: se la haces a la\n       frase y ella te contesta cuál es.</p>');
AC.forEach(a => p.push(
  `<div class="lg-acto c-${a.clave}"><b>${a.emoji} ${esc(a.nombre)}</b> <span class="et">${esc(a.corto)}</span><p class="s">${esc(a.senal)}</p><p class="p"><b>La prueba:</b> ${esc(a.prueba)}</p></div>`));
p.push(`<div class="caja truco">${rot('Ojo:', D.LEN_ACTOS_OJO)}</div>`);
pags.push(p);

// ── 3 ──
p = [];
p.push('<h2>La forma no dice lo que la frase hace</h2>');
p.push('<p>Estas ocho parecen una cosa y hacen otra. Lo que lo decide no es la frase: es <b>dónde se\n       dice</b>. Leé la frase, mirá dónde, y después lo que hace.</p>');
p.push('<table><tr><th style="width:30%">La frase</th><th style="width:28%">Dónde se dice</th><th style="width:14%">Parece</th><th>Y hace</th></tr>' +
  D.LEN_DISFRAZ.map(d => `<tr><td class="k">«${esc(d.f)}»</td><td>${esc(d.donde)}</td><td>${esc(d.forma)}</td><td><b>${esc(d.hace)}</b> — ${esc(d.como)}</td></tr>`).join('') + '</table>');
p.push(`<div class="caja idea">${rot('Ojo:', D.LEN_DISFRAZ_OJO)}</div>`);
pags.push(p);

// ── 4 ──
p = [];
p.push('<h2>La misma frase, dos cosas</h2>');
p.push('<p>Estas cuatro frases están bien escritas. Y dicen dos cosas cada una. Buscá las dos antes\n       de leer la respuesta.</p>');
AM.forEach(a => p.push(
  `<div class="lg-amb"><div class="t">${a.emoji} «${esc(a.frase)}»</div>` +
  `<ul><li>${rot('Puede ser:', a.una)}</li><li>${rot('O puede ser:', a.otra)}</li></ul>` +
  `<p class="c">🔧 ${esc(a.arregla).replace(/^Se arregla\s+/, 'Se arregla ')}</p></div>`));
p.push(`<div class="caja truco">${rot('Ojo:', D.LEN_AMBIG_OJO)}</div>`);
pags.push(p);

// ── 5 ──
p = [];
p.push('<h2>Cuándo una definición sirve</h2>');
p.push('<p>Definir es decir qué entra y qué no. Se falla de dos maneras contrarias, y las dos se\n       comprueban.</p>');
D.LEN_DEFINIR.forEach(d => p.push(
  `<div class="lg-def d-${d.clave}"><b>${d.emoji} ${esc(d.nombre)}</b><p class="h">${esc(d.que)}</p>` +
  `<p class="v">${esc(d.ej)}</p><p class="d"><b>La prueba:</b> ${esc(d.prueba)}</p></div>`));
p.push(`<div class="caja idea">${rot('Ojo:', D.LEN_DEFINIR_OJO)}</div>`);
p.push('<h2>La misma cosa, otra palabra</h2>');
p.push('<p>Las dos palabras de cada fila nombran lo mismo. Y no llegan igual. Leelas en voz alta y\n       fijate cuál te cae mejor.</p>');
p.push('<table><tr><th style="width:34%">La cosa</th><th style="width:22%">Dicho suave</th><th style="width:22%">Dicho fuerte</th><th>Las dos</th></tr>' +
  D.LEN_CARGA.map(c => `<tr><td>${esc(c.cosa)}</td><td class="k">${esc(c.suave)}</td><td class="k">${esc(c.fuerte)}</td><td>${esc(c.igual)}</td></tr>`).join('') + '</table>');
p.push(`<div class="caja regla">${rot('Ojo:', D.LEN_CARGA_OJO)}</div>`);
pags.push(p);

// ── 6 ──
p = [];
p.push('<h2>Cuando la palabra convence sola</h2>');
p.push('<p>Aquí no se examina la razón: eso fue la unidad anterior. Se examina la frase. <b>Tres de\n       estas cuatro traen trampa.</b> La cuarta no, y por eso está.</p>');
D.LEN_TRUCOS.forEach(t => p.push(
  `<div class="lg-tru ${t.truco ? 't-si' : 't-no'}"><b>${t.emoji} ${esc(t.nombre)}</b>` +
  `<p class="h">${esc(t.hace)}</p><p class="v">${rot('Suena así:', t.suena)}</p>` +
  `<p class="h">${rot('Cuesta:', t.cuesta)}</p><p class="d">${rot('Se desarma:', t.desarma)}</p></div>`));
p.push(`<div class="caja truco">${rot('Ojo:', D.LEN_TRUCOS_OJO)}</div>`);
pags.push(p);

// ── 7 ──
p = [];
p.push('<h2>Palabras de la unidad</h2>');
p.push('<table><tr><th style="width:22%">Palabra</th><th>Qué quiere decir</th></tr>' +
  D.LEN_VOCABULARIO.map(v => `<tr><td class="k">${esc(v.w)}</td><td>${esc(v.a)}</td></tr>`).join('') + '</table>');
p.push('<h2>Dos que miraron las palabras con lupa</h2>');
p.push('<p>Uno las miró como se miran las cuentas; el otro dijo que cada palabra arrastra la vida de\n       quien la usa. Aquí <b>no hay ni una fecha</b>, y no es un olvido: una fecha que no se puede\n       acreditar no se escribe.</p>');
D.LEN_PENSADORES.forEach(x => p.push(
  `<div class="lg-pens"><b>${x.emoji} ${esc(x.nombre)}</b><p class="w">${esc(x.donde)}</p><p class="p">${esc(x.quien)}</p>` +
  `<p class="p"><b>Qué hizo:</b> ${esc(x.hizo)}</p><p class="p"><b>Por qué se le recuerda:</b> ${esc(x.porque)}</p>` +
  `<p class="dato"><b>Dato:</b> ${esc(x.dato)}</p></div>`));
p.push('<h2>Qué le deja esto a cada materia</h2>');
p.push('<table><tr><th style="width:25%">Materia</th><th>Qué le deja</th></tr>' +
  D.LEN_ARBOL.map(a => `<tr><td class="k">${a.emoji} ${esc(a.materia)}</td><td>${esc(a.le)}<br><b>Pruébalo hoy:</b> ${esc(a.hoy)}</td></tr>`).join('') + '</table>');
pags.push(p);

// ── 8 · actividades 1-3 ──
p = [];
p.push('<h2>Actividades</h2>');
p.push('<div class="acts"><h3>1. ¿Qué hace esta frase? <span class="val">12 pts</span></h3>');
p.push('<p>Escribe <b>A</b> si afirma, <b>P</b> si pregunta, <b>M</b> si pide o manda, y <b>E</b> si\n       exclama.</p>');
p.push('<table><tr><th style="width:12%">A, P, M o E</th><th>La frase</th></tr>' +
  ACT1.map(([f]) => `<tr><td></td><td>${esc(f)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>2. La prueba de cada clase <span class="val">8 pts</span></h3>');
p.push('<p>Une cada prueba con su clase. Escribe la letra en el paréntesis.</p>');
p.push('<table><tr><th style="width:8%">( )</th><th>La pregunta que se le hace a la frase</th><th style="width:30%">La clase</th></tr>' +
  [0, 1, 2, 3].map(i => `<tr><td></td><td>${esc(AC[ACT2[i]].prueba)}</td><td><b>${'abcd'[i]})</b> ${AC[i].emoji} ${esc(AC[i].nombre)}</td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<div class="acts"><h3>3. Escribí unas tuyas <span class="val">10 pts</span></h3>');
p.push('<p>Escuchá en tu casa. Anotá tres frases y qué hace cada una. Después escribí una que diga\n       dos cosas, y la pregunta que la arregla.</p>');
p.push('<table><tr><th style="width:58%">La frase que oí</th><th>Qué hace, y por qué</th></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>');
p.push('<div class="caja regla"><b>Una frase que dice dos cosas:</b>\n      <span class="linea-resp" style="min-width:290px"></span><br><b>La pregunta que la arregla:</b>\n      <span class="linea-resp" style="min-width:270px"></span></div>');
p.push('</div>');
pags.push(p);

// ── 9 · actividades 4-6 + investiga ──
const INV = D.LEN_INVESTIGA;
p = [];
p.push('<div class="acts"><h3>4. Rellena el círculo de la letra correcta <span class="val">6 pts</span></h3>');
MC.forEach(([q, ops], i) => p.push(
  `<div class="preg"><div class="preg-q"><span class="preg-n">${i + 1}</span><span>${esc(q)}</span></div><div class="preg-ops">` +
  ops.map((o, k) => `<span class="op"><i></i><b>${'abcd'[k]})</b> ${esc(o)}</span>`).join('') + '</div></div>'));
p.push('</div>');
/* ⚠️ Aquí iba una actividad de «escribe la palabra suave y la fuerte» con la
   misma columna `cosa` de la hoja 5: se contestaba COPIANDO de esa hoja, y
   costaba una hoja de más —43 fotocopias por grado—. Lo que la palabra
   arrastra se examina en la 3, donde el alumno trae una frase de su casa. */
p.push('<div class="acts"><h3>5. ¿Cuál trae trampa? <span class="val">8 pts</span></h3>');
/* ⚠️ Aquí NO se pide una ✗, y no es un matiz: en el aula la ✗ significa MALO
   y es lo que el maestro pone encima de lo errado. Pedírsela para señalar algo
   que el alumno acertó enseña dos cosas contrarias con el mismo signo. Se
   escribe SÍ o NO, que además deja escribir en el cuaderno. */
p.push('<p>Escribe <b>SÍ</b> o <b>NO</b> según traiga trampa, y con qué se desarma.\n       <b>Una de las cuatro no trae ninguna.</b></p>');
p.push('<table><tr><th style="width:12%">¿Trampa?</th><th style="width:38%">Cómo suena</th><th>Se desarma con…</th></tr>' +
  D.LEN_TRUCOS.map(t => `<tr><td></td><td>${esc(t.suena)}</td><td></td></tr>`).join('') + '</table>');
p.push('</div>');
p.push('<h2>Investiga (no se contesta copiando de aquí)</h2>');
p.push(`<p>${esc(INV.aviso)}</p>`);
p.push('<div class="caja idea">' + INV.preguntas.map((q, i) => `<b>${i + 1}.</b> ${esc(q)}`).join('<br>') + '</div>');
/* ⚠️ El rótulo es el GLIFO, no una palabra: el campo `cuidado` ya empieza por
   «Al preguntar», y con el rótulo escrito la hoja decía «Al preguntar: Al
   preguntar, se pregunta con respeto». La pantalla ya lo hacía así. */
p.push(`<div class="caja hn"><b>🤲</b> ${esc(INV.cuidado)}</div>`);
p.push('<h2>Para hacer entre varios</h2>');
p.push('<div class="caja regla"><b>El pedido disfrazado.</b> Cada uno trae escrita una frase que oyó\n      en su casa y que <b>pedía algo sin pedirlo</b>: «ya son las seis», «qué calor hace aquí». Se\n      leen en voz alta, y los demás dicen qué estaba pidiendo y cómo se dieron cuenta. Al final se\n      eligen las tres que más cuesta notar y se escriben en la pizarra con su versión directa al\n      lado.</div>');
pags.push(p);

/* ── la última: la pauta, SOLA. Es lo único del maestro que la ficha lleva, y
      el repartidor protege solo la última página. ── */
p = [];
p.push('<h2>Pauta de corrección · NO se fotocopia</h2>');
p.push('<div class="pauta">');
p.push('<div><span class="pt">1. ¿Qué hace esta frase? (12 pts)</span> ' +
  ACT1.map(([, l], i) => `${i + 1}. ${l}`).join(' · ') +
  '. A = afirma · P = pregunta · M = pide o manda · E = exclama.</div>');
p.push('<div><span class="pt">2. La prueba de cada clase (8 pts)</span> ' +
  [0, 1, 2, 3].map(i => `${i + 1} → ${'abcd'[ACT2[i]]} (${esc(AC[ACT2[i]].nombre)})`).join(' · ') +
  '. Las pruebas NO salen en el orden de las clases: hay que leerlas.</div>');
p.push('<div><span class="pt">3. Escribí unas tuyas (10 pts)</span> ⚠️ <b>No tiene una sola respuesta ' +
  'buena, a propósito.</b> Se califica que diga POR QUÉ —la prueba, no la forma—, y que la frase de ' +
  'doble sentido se pueda leer de verdad de dos maneras. Si la frase que trajo parece una cosa y ' +
  'hace otra, eso vale doble: es lo que más cuesta de la unidad. Y la pregunta que la arregla tiene ' +
  'que pedir el dato que falta, no repetir la frase.</div>');
p.push('<div><span class="pt">4. Selección múltiple (6 pts)</span> ' +
  MC.map(([, , k], i) => `${i + 1}. ${'abcd'[k]}`).join(' · ') + '</div>');
p.push('<div><span class="pt">5. ¿Cuál trae trampa? (8 pts)</span> ' +
  D.LEN_TRUCOS.map((t, i) => `${i + 1}. ${t.truco ? 'SÍ' : 'NO'} — ${esc(t.desarma)}`).join(' · ') +
  '. ⚠️ La cuarta <b>no trae trampa</b>, y marcarla es el error que hay que corregir hablando: una ' +
  'unidad donde toda palabra fuerte es trampa deja a un alumno que no le cree a nadie.</div>');
p.push('<div><span class="pt">Investiga</span> ⚠️ <b>No trae respuestas, a propósito.</b> Las cuatro se ' +
  'contestan donde vive el alumno y no en esta hoja. Se califica que diga DE DÓNDE sacó cada cosa, ' +
  'a quién se lo preguntó y qué día; en la tercera, que estén las DOS respuestas y marcado en qué ' +
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
       cabecera de js/data/filosofia-lenguaje.js.
     · ⚠️ ESTA FICHA NO SE EDITA A MANO: sale de _dev/arma-ficha-lenguaje.js. */`);

const secs = pags.map((bloques, i) =>
  `<!-- ═══════════ PÁGINA ${i + 1} ═══════════ -->\n<section class="pagina">\n  <div class="contenido">\n\n    ` +
  bloques.join('\n\n    ') +
  `\n\n  </div>\n  <div class="pag-pie">${PIE}<span>Página ${i + 1}</span></div>\n</section>`);

fs.writeFileSync(SALIDA, `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ficha Didáctica · Misión Palabras que piensan</title>
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
console.log(`✔ ficha-palabras-que-piensan.html · ${pags.length} secciones (las hojas las reparte reparte-hojas-ficha.js)`);

/* ── lo propio de esta unidad. Va detrás del CSS común de las fichas. ── */
function CSS_PROPIO() {
  return `  /* ═══ LAS CUATRO COSAS QUE HACE UNA FRASE ═══
     ⚠️ Cada clase lleva SU EMOJI además del color. Esta hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde:
     sin el emoji, clasificar frases sería justo la actividad que él no puede
     hacer. */
  .lg-acto { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
             padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .lg-acto.c-afirma { border-left-color: var(--verde); }
  .lg-acto.c-pregunta { border-left-color: #1565c0; }
  .lg-acto.c-pide { border-left-color: #b45309; }
  .lg-acto.c-exclama { border-left-color: #6b21a8; }
  .lg-acto b { font-size: 11.5pt; color: var(--fil-osc); }
  .lg-acto .et { font-size: 7.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
                 border-radius: 999px; padding: 1px 7px; background: var(--fil-claro); color: var(--fil-osc); }
  .lg-acto p.s { font-size: 10.5pt; font-weight: 700; margin: 2px 0; }
  .lg-acto p.p { font-size: 10pt; background: var(--verde-claro); border-radius: 6px;
                 padding: 3px 8px; margin: 3px 0 0; }

  /* ═══ LA MISMA FRASE, DOS COSAS ═══
     Las dos lecturas van en una lista de verdad y no en dos <span>:
     \`mide-legibilidad\` corta los tramos por elemento de bloque, y una tarjeta
     hecha de <span> le sale como un tramo de setenta palabras. */
  .lg-amb { border: 1.5px solid var(--linea); border-radius: 8px; padding: 6px 12px; margin: 6px 0;
            break-inside: avoid; }
  .lg-amb .t { font-size: 11pt; font-weight: 800; color: var(--fil-osc); }
  .lg-amb ul { margin: 2px 0 2px 22px; font-size: 10.5pt; }
  .lg-amb p.c { font-size: 10.5pt; font-weight: 700; border-top: 1.5px solid var(--fil);
                padding-top: 3px; margin: 3px 0 0; }

  /* ═══ CUÁNDO UNA DEFINICIÓN SIRVE ═══
     Las dos fallas son CONTRARIAS, así que llevan color contrario a propósito:
     lo que hay que ver es que se falla en los dos sentidos. */
  .lg-def { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
            padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .lg-def.d-ancha { border-left-color: #b45309; }
  .lg-def.d-angosta { border-left-color: #1565c0; }
  .lg-def.d-justa { border-left-color: var(--verde); }
  .lg-def b { font-size: 11pt; color: var(--fil-osc); }
  .lg-def p { font-size: 10pt; margin: 2px 0; }
  .lg-def p.h { font-weight: 700; }
  .lg-def p.v { background: var(--fil-claro); border-radius: 6px; padding: 3px 8px; font-style: italic; }
  .lg-def p.d { background: var(--verde-claro); border-radius: 6px; padding: 3px 8px; margin: 3px 0 0; }

  /* ═══ CUANDO LA PALABRA CONVENCE SOLA ═══
     ⚠️ Los tres primeros traen trampa y el cuarto NO, y esa diferencia no puede
     ir solo en el color: el emoji de cada uno lo dice —🪤 🏷️ 🌫️ frente a ✅— y
     el aviso del final también. Fotocopiado en blanco y negro, sin eso los
     cuatro son la misma tarjeta. */
  .lg-tru { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
            padding: 6px 12px; margin: 6px 0; break-inside: avoid; }
  .lg-tru.t-si { border-left-color: #b45309; }
  .lg-tru.t-no { border-left-color: var(--verde); }
  .lg-tru b { font-size: 11pt; color: var(--fil-osc); }
  .lg-tru p { font-size: 10pt; margin: 2px 0; }
  .lg-tru p.h { font-weight: 700; }
  .lg-tru p.v { background: var(--fil-claro); border-radius: 6px; padding: 3px 8px; font-style: italic; }
  .lg-tru p.d { background: var(--verde-claro); border-radius: 6px; padding: 3px 8px; margin: 3px 0 0; }

  .lg-pens { border: 1.5px solid var(--linea); border-left: 5px solid var(--fil); border-radius: 8px;
             padding: 7px 12px; margin: 7px 0; break-inside: avoid; }
  .lg-pens b { font-size: 11.5pt; color: var(--fil-osc); }
  .lg-pens p.w { font-size: 9pt; color: var(--gris); font-style: italic; margin: 0; }
  .lg-pens p.p { font-size: 10.5pt; margin: 3px 0; }
  .lg-pens p.dato { font-size: 9.5pt; color: var(--gris); margin: 0; }

`;
}
