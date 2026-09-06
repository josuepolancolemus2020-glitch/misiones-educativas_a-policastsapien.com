/* ============================================================
   M.E.T.A.S · Arma la ficha de una Prueba de Fin de Grado
   ------------------------------------------------------------
   Uso:  node _dev/arma-ficha-fin-de-grado.js 6to

   Lee  _dev/fin-de-grado/<grado>/contenido.json  (el contenido ya
   verificado del grado) y  _dev/fin-de-grado/cabeza.html  (la cabecera
   con el CSS, que es la misma para todos los grados), y escribe
   fichas/ficha-fin-de-grado-<grado>.html.

   Lo que se publica es el HTML resultante, que queda plano y editable a
   mano como las demás fichas del proyecto: esto es una herramienta de
   trabajo, no una dependencia del sitio.

   POR QUÉ EXISTE: la ficha de Fin de Grado no repasa un tema, repasa el
   año entero y las dos materias, así que pasa de treinta hojas. Cortar
   treinta hojas a ojo deja hojas a medio llenar, y cada hoja de más son
   43 hojas de más en el fotocopiado del grado. El corte de páginas NO se
   hace a ojo: se pinta todo el contenido en un navegador CON EL ANCHO
   DEL PAPEL, se mide bloque por bloque y se empaqueta hasta llenar la
   hoja. Medir en pantalla ancha miente: las columnas se estiran y el
   texto ocupa menos alto del que ocupará en el papel.

   Necesita Playwright. En este entorno se instala aparte y se BORRA al
   terminar, porque node_modules va versionado:
     npm install --no-save playwright
     …
     rm -rf node_modules/playwright* node_modules/.package-lock.json
     git checkout node_modules
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.join(__dirname, '..');
const GRADO = (process.argv[2] || '6to').replace(/[^0-9a-zA-Z]/g, '');
const DIR = path.join(__dirname, 'fin-de-grado', GRADO);
if (!fs.existsSync(DIR)) {
  console.error(`✘ No existe ${path.relative(RAIZ, DIR)}. Cree la carpeta del grado con su contenido.json.`);
  process.exit(1);
}
const SALIDA = path.join(RAIZ, 'fichas', `ficha-fin-de-grado-${GRADO}.html`);
const C = JSON.parse(fs.readFileSync(path.join(DIR, 'contenido.json'), 'utf8'));
const M = C.meta;
const CABEZA = fs.readFileSync(path.join(__dirname, 'fin-de-grado', 'cabeza.html'), 'utf8')
  .replace(/\{\{GRADO\}\}/g, M.grado);

const MM = 96 / 25.4;
const ANCHO = Math.round((215.9 - 22) * MM);   // ancho imprimible de la carta
const BUDGET = 244;                            // mm de contenido por hoja (253 de hoja menos el pie)

/* Todo el texto del contenido pasa por aquí: se escapa y, de paso, las
   fracciones se escriben apiladas. Va en el escape y no sobre el HTML ya
   armado para no meterse nunca dentro del CSS ni de un atributo. */
const armaFrac = (n, d) => `<span class="fr"><b>${n}</b><b class="fd">${d}</b></span>`;
const RX_FRAC = /(\d+)\s+(?:y\s+)?(\d+)\/(\d+)|(\d+)\/(\d+)/g;
const frac = t => t.replace(RX_FRAC, (m, ent, mn, md, n, d) =>
  ent !== undefined ? `<span class="fr-mix">${ent}</span>` + armaFrac(mn, md) : armaFrac(n, d));
const esc = s => frac(String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
const LETRAS = ['a', 'b', 'c', 'd', 'e'];
const MAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/* Barajado determinista: la Columna B de los pareados nunca sale en el
   orden 1A, 2B, 3C, pero sale SIEMPRE igual, para que la pauta impresa
   coincida con la ficha impresa. */
function rng(semilla) {
  let s = (semilla * 2654435761 + 909090909) >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function baraja(arr, semilla) {
  const r = rng(semilla), a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ─── piezas ─── */
const caja = r => {
  const clase = { regla: 'regla', idea: 'idea', truco: 'truco', hn: 'hn' }[r.tipo] || 'regla';
  const ico = { regla: '⚡', idea: '💡', truco: '🎯', hn: '🇭🇳' }[r.tipo] || '⚡';
  const rot = { regla: 'Regla:', idea: 'Idea clave:', truco: 'Truco:', hn: 'En Honduras:' }[r.tipo] || 'Regla:';
  return `<div class="caja ${clase}">${ico} <b>${rot}</b> ${esc(r.texto)}</div>`;
};

const tabla = t => !t ? '' : `<table>
  <tr>${t.encabezados.map(h => `<th>${esc(h)}</th>`).join('')}</tr>
${t.filas.map(f => `  <tr>${f.map((c, i) => `<td${i === 0 ? ' class="k"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('\n')}
</table>`;

// Parte un enunciado largo en (mini-texto, pregunta) cuando trae los dos
function parteTexto(s) {
  const corte = s.indexOf('\n\n');
  if (corte > 0) return [s.slice(0, corte), s.slice(corte + 2)];
  if (s.length > 190) {
    const m = s.match(/([¿].*)$/s);
    if (m && m.index > 60) return [s.slice(0, m.index).trim(), m[1]];
  }
  return ['', s];
}

function ejemplo(e, n) {
  const [txt, enun] = parteTexto(e.enunciado);
  return `<div class="ejem">
  <div class="ejem-t">Ejemplo resuelto ${n}: <span>${esc(enun)}</span></div>
${txt ? `  <div class="ejem-txt">${esc(txt)}</div>\n` : ''}  <ol>
${e.pasos.map(p => `    <li>${esc(p)}</li>`).join('\n')}
  </ol>
  <div class="res">${esc(e.resultado)}</div>
</div>`;
}

const errorCaja = (e, titulo) => `<div class="err">
  <div class="err-t">${esc(titulo || e.titulo || 'Error común')}</div>
  <div><b class="mal">Mal:</b> ${esc(e.mal)}</div>
  <div><b class="why">¿Por qué está mal?</b> ${esc(e.porque)}</div>
  <div><b class="ok">Correcto:</b> ${esc(e.bien)}</div>
</div>`;

function pregunta(it, n, sim) {
  const [txt, enun] = parteTexto(it.texto);
  const largas = it.o.some(o => String(o).length > 38);
  const ops = it.o.map((o, i) => sim
    ? `    <span class="op${largas ? ' full' : ''}"><i></i> ${LETRAS[i]}) ${esc(o)}</span>`
    : `    <span class="op${largas ? ' full' : ''}"><i>${LETRAS[i]}</i> ${esc(o)}</span>`).join('\n');
  if (txt) return `<div class="preg">
  <div class="${sim ? 'sim-txt' : 'ejem-txt'}" style="margin-left:0;"><span class="preg-n" style="margin-right:6px;">${n}</span>${esc(txt)}</div>
  <div class="preg-q2">${esc(enun)}</div>
  <div class="preg-ops">
${ops}
  </div>
</div>`;
  return `<div class="preg">
  <div class="preg-q"><span class="preg-n">${n}</span>${esc(enun)}</div>
  <div class="preg-ops">
${ops}
  </div>
</div>`;
}

function pareados(items, semilla) {
  const defs = baraja(items, semilla);
  const clave = items.map((it, i) => `${i + 1}${MAY[defs.findIndex(d => d.definicion === it.definicion)]}`);
  const html = `<table>
  <tr><th style="width:42%;">Columna A</th><th>Columna B</th></tr>
${items.map((it, i) => `  <tr><td>${i + 1}. ____ ${esc(it.termino)}</td><td>${MAY[i]}. ${esc(defs[i].definicion)}</td></tr>`).join('\n')}
</table>`;
  return { html, clave: clave.join(', ') };
}

/* ─── secciones y bloques ─────────────────────────────────────────
   Cada SECCIÓN empieza en hoja nueva y lleva su color y su pie. Si no
   cabe, sigue en la hoja siguiente con el mismo color y el pie marcado
   «(sigue)». Los BLOQUES son las piezas que no se pueden partir. */
const secs = [];
let sec = null;
// Título corto para el pie de página: sin el emoji y hasta los dos puntos
const corto = t => t.replace(/^\S+\s/, '').split(':')[0].trim();
// Tope del rótulo del pie: se corta en la última palabra que quepa
const recorta = (t, max = 62) => t.length <= max ? t : t.slice(0, t.lastIndexOf(' ', max)).replace(/[,y]$/, '').trim() + '…';
const S = (clase, pie, nuevaHoja) => { sec = { clase, pie, nuevaHoja: !!nuevaHoja }; secs.push(sec); };
const B = html => sec.bloques.push(html);
secs.push = function (s) { s.bloques = []; Array.prototype.push.call(this, s); return this.length; };

/* 1 · portada */
S('', 'Presentación y objetivos');
B(`<div class="idline"><span>Nombre:</span><span class="raya"></span><span>Nº-Lista:</span><span class="raya corta"></span></div>`);
B(`<div class="fh">
  <div class="fh-txt">
    <div class="f-badge">📄 Ficha Didáctica: Prueba de Fin de Grado, ${M.grado} Grado</div>
    <div class="f-meta"><b>Asignaturas:</b> Matemáticas y Español &nbsp;·&nbsp; <b>Nivel:</b> ${M.ciclo}</div>
    <div class="f-meta"><b>Tema:</b> ${M.tema}</div>
  </div>
  <div class="fh-qr">
    <img src="../img/${M.qr}" alt="QR de la misión">
    <span>📷 Juega la misión en tu teléfono</span>
  </div>
</div>`);
B(`<div class="caja regla">📌 <b>Esta ficha es distinta a las demás:</b> no repasa un tema, repasa <b>todo el año</b> y las <b>dos materias</b> que se evalúan en la Prueba de Fin de Grado. Por eso es más larga: estúdiala por partes, no de una sentada. Las hojas con la franja <b>azul</b> son de Matemáticas y las de la franja <b>dorada</b> son de Español.</div>`);
B(`<h2>🎯 Objetivos de Aprendizaje</h2>
<ol class="objetivos">
${M.objetivos.map(o => `  <li>${o}</li>`).join('\n')}
</ol>`);
B(`<h2>📋 Cómo es la Prueba de Fin de Grado</h2>
<p>${M.comoEs}</p>`);
B(`<div class="caja idea">🖊️ <b>La regla de oro del examen:</b> se <b>rellena completo el círculo</b> de la letra escogida. Nunca se marca con una equis: en el aula la equis significa que algo está malo. Y una pregunta con dos círculos rellenados no se cuenta.</div>`);
B(`<div class="caja truco">🗺️ <b>Cómo usar esta ficha:</b> primero estudia las hojas azules de Matemáticas y contesta sus actividades; después las doradas de Español con las suyas. Deja el <b>simulacro del final</b> para la víspera del examen y contéstalo de corrido, sin ver las hojas de estudio: así sabrás de verdad cómo llegas.</div>`);

/* teoría de Matemáticas */
C.teoriaMat.bloques.forEach((b, i) => {
  S('p-mat', `Matemáticas: ${corto(b.titulo)}`);
  B(`<div class="materia-tag">🔵 Matemáticas · Bloque ${i + 1} de ${C.teoriaMat.bloques.length}</div>
<h2>${esc(b.titulo)}</h2>
<p>${esc(b.intro)}</p>`);
  (b.reglas || []).forEach(r => B(caja(r)));
  b.ejemplos.forEach((e, j) => B(ejemplo(e, j + 1)));
  if (b.tabla) B(tabla(b.tabla));
  if (b.error) B(errorCaja(b.error, 'Cuidado con este error'));
});

/* errores de Matemáticas */
S('p-mat', 'Matemáticas: errores comunes');
B(`<div class="materia-tag">🔵 Matemáticas</div>
<h2>⚠️ Errores que más cuestan puntos</h2>
<p>Las opciones equivocadas del examen no están puestas al azar: cada una es un error que alguien comete
de verdad. Si reconoces el error, reconoces la trampa.</p>`);
C.errores.errores.filter(e => e.materia === 'mat').forEach(e => B(errorCaja(e)));

/* teoría de Español */
C.teoriaEsp.bloques.forEach((b, i) => {
  S('p-esp', `Español: ${corto(b.titulo)}`);
  B(`<div class="materia-tag">🟡 Español · Bloque ${i + 1} de ${C.teoriaEsp.bloques.length}</div>
<h2>${esc(b.titulo)}</h2>
<p>${esc(b.intro)}</p>`);
  (b.reglas || []).forEach(r => B(caja(r)));
  b.ejemplos.forEach((e, j) => B(ejemplo(e, j + 1)));
  if (b.tabla) B(tabla(b.tabla));
  if (b.error) B(errorCaja(b.error, 'Cuidado con este error'));
});

/* errores de Español + estrategia */
S('p-esp', 'Español: errores comunes y estrategia');
B(`<div class="materia-tag">🟡 Español</div>
<h2>⚠️ Errores que más cuestan puntos</h2>`);
C.errores.errores.filter(e => e.materia === 'esp').forEach(e => B(errorCaja(e)));
B(`<h2>🧭 La víspera y el día del examen</h2>
<ol class="objetivos">
${C.errores.estrategia.map(s => `  <li>${esc(s)}</li>`).join('\n')}
</ol>`);

/* actividades de Matemáticas */
const parMat = pareados(C.actMat.pareados, 61);
S('p-mat acts', 'Matemáticas: actividades');
B(`<div class="materia-tag">🔵 Matemáticas</div>
<h2>✍️ ¡Ponte a Prueba! Actividades de Matemáticas</h2>
<h3>I. Completa los espacios <span class="val">(Valor: 10 puntos c/u)</span></h3>
<ol>
${C.actMat.completar.map(i => `  <li>${esc(i.texto).replace('___', '<span class="linea-resp"></span>')}</li>`).join('\n')}
</ol>`);
B(`<h3>II. Verdadero o Falso <span class="val">(Valor: 10 puntos c/u)</span> · Escribe V o F en la línea.</h3>
<ol>
${C.actMat.vf.map(i => `  <li>____ ${esc(i.texto)}</li>`).join('\n')}
</ol>`);
B(`<h3>III. Selección múltiple <span class="val">(Valor: 10 puntos c/u)</span> · Encierra en un círculo la letra correcta.</h3>`);
C.actMat.mc.forEach((it, i) => B(pregunta(it, i + 1, false)));
B(`<h3>IV. Relaciona (Pareados) <span class="val">(Valor: 10 puntos c/u)</span> · Escribe en la línea la letra de la Columna B que corresponde.</h3>
${parMat.html}`);
B(`<h3>V. Resuelve con procedimiento <span class="val">(Valor: 20 puntos c/u)</span> · Escribe todos los pasos en el espacio.</h3>`);
C.actMat.procedimiento.forEach((it, i) => B(`<div class="preg"><div class="preg-q"><span class="preg-n">${i + 1}</span>${esc(it.enunciado)}</div><div class="desarrollo"></div></div>`));

/* actividades de Español */
const parEsp = pareados(C.actEsp.pareados, 77);
S('p-esp acts', 'Español: actividades');
B(`<div class="materia-tag">🟡 Español</div>
<h2>✍️ ¡Ponte a Prueba! Actividades de Español</h2>
<h3>I. Completa los espacios <span class="val">(Valor: 10 puntos c/u)</span></h3>
<ol>
${C.actEsp.completar.map(i => `  <li>${esc(i.texto).replace('___', '<span class="linea-resp"></span>')}</li>`).join('\n')}
</ol>`);
B(`<h3>II. Verdadero o Falso <span class="val">(Valor: 10 puntos c/u)</span> · Escribe V o F en la línea.</h3>
<ol>
${C.actEsp.vf.map(i => `  <li>____ ${esc(i.texto)}</li>`).join('\n')}
</ol>`);
B(`<h3>III. Lee el texto y contesta <span class="val">(Valor: 10 puntos c/u)</span></h3>
<div class="ejem">
  <div class="ejem-t">${esc(C.actEsp.lectura.titulo)}</div>
  <div class="ejem-txt">${esc(C.actEsp.lectura.texto)}</div>
</div>`);
C.actEsp.lectura.preguntas.forEach((it, i) => B(pregunta(it, i + 1, false)));
/* La lista de tipos NO se escribe a mano: se saca de las respuestas del
   propio grado. Escrita a mano, el grado que estrene un tipo nuevo (el
   anuncio en 4º) le pediría al alumno una palabra que no está en la lista. */
const tiposDelGrado = [...new Set(C.actEsp.tipos.map(t => t.tipo))].sort();
B(`<h3>IV. ¿Qué tipo de texto es? <span class="val">(Valor: 10 puntos c/u)</span> · Escribe en la línea: ${tiposDelGrado.slice(0, -1).join(', ')} o ${tiposDelGrado[tiposDelGrado.length - 1]}.</h3>
<ol>
${C.actEsp.tipos.map(t => `  <li>«${esc(t.fragmento)}» <span class="linea-resp"></span></li>`).join('\n')}
</ol>`);
B(`<h3>V. Relaciona (Pareados) <span class="val">(Valor: 10 puntos c/u)</span> · Escribe en la línea la letra de la Columna B.</h3>
${parEsp.html}`);
B(`<h3>VI. Escritura <span class="val">(Valor: 30 puntos c/u)</span> · Escribe en el espacio, con buena letra y cuidando la ortografía.</h3>`);
C.actEsp.escritura.forEach((e, i) => B(`<div class="preg"><div class="preg-q"><span class="preg-n">${i + 1}</span>${esc(e.consigna)}</div><div class="desarrollo" style="height:150px;"></div></div>`));

/* simulacro */
S('sim', 'Simulacro');
B(`<h2>📝 Simulacro: así se siente la prueba de verdad</h2>
<div class="sim-instr"><b>INSTRUCCIONES:</b> ${esc(C.simulacro.instruccion)}</div>
<h3 style="color:var(--mat-osc);">Primera parte: Matemáticas</h3>`);
C.simulacro.matematicas.forEach((it, i) => B(pregunta(it, i + 1, true)));
B(`<h3 style="color:var(--esp-osc);">Segunda parte: Español</h3>
<div class="sim-instr">Lee cada texto con cuidado. La respuesta siempre está en el texto: si no puedes señalar el renglón donde la encontraste, todavía no es tu respuesta.</div>`);
C.simulacro.espanol.forEach((it, i) => B(pregunta(it, i + 1 + C.simulacro.matematicas.length, true)));

/* cierre */
// El cierre lleva la misma clase que el simulacro para que FLUYA detrás de
// él: los dos van en hoja morada y separarlos dejaba dos medias hojas
// seguidas. La hoja del docente sí arranca suelta, que se reparte aparte.
S('sim', 'Cierre');
B(`<div class="felic">
  🏅 <b>¡Terminaste el repaso completo de tu grado!</b> ${M.felicitacion}
</div>`);
B(`<h2>📏 Rúbrica de Evaluación</h2>
<table class="rubrica">
  <tr><th>Actividad</th><th>Lugar</th><th>Valor</th><th>Nota obtenida</th><th>Observación</th></tr>
  <tr><td>Copió en su cuaderno los contenidos de estudio de las dos materias.</td><td class="lg">Tarea en el hogar</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><td>Resolvió las actividades de Matemáticas sobre esta ficha.</td><td class="lg">Tarea en el aula</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><td>Resolvió las actividades de Español sobre esta ficha.</td><td class="lg">Tarea en el aula</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><td>Contestó el simulacro rellenando el círculo, sin dejar preguntas en blanco.</td><td class="lg">Simulacro en el aula, la víspera</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><td colspan="3" style="text-align:right;font-weight:700;">Promedio nota final →</td><td colspan="2">&nbsp; %</td></tr>
</table>
<p style="font-size:9pt;color:var(--gris);">Ya sabes sacar el promedio: suma las cuatro notas y divide entre cuatro.
Perderás puntos si dejas trabajo sin completar, si tu letra no se entiende o si escribes con faltas de ortografía.</p>`);

/* pauta del docente */
const claveVF = items => items.map((it, i) => `${i + 1}${it.a ? 'V' : 'F'}`).join(', ');
const claveMC = items => items.map((it, i) => `${i + 1}${LETRAS[it.a]}`).join(', ');
const claveComp = items => items.map((it, i) => `${i + 1}. ${esc(it.respuesta)}`).join(' &nbsp; ');

S('', 'Hoja del Docente', true);
B(`<h2>✅ Pauta de Respuestas: Hoja del Docente</h2>
<p style="font-size:10pt;color:var(--gris);">Estas hojas se imprimen <strong>sueltas</strong>: son solo para el docente o para la autoevaluación guiada.</p>`);
B(`<h3 style="color:var(--mat-osc);">🔵 Actividades de Matemáticas</h3>
<div class="pauta">
  <div><span class="pt">I. Completar:</span> ${claveComp(C.actMat.completar)}</div>
  <div><span class="pt">II. Verdadero o Falso:</span> ${claveVF(C.actMat.vf)}</div>
  <div><span class="pt">III. Selección múltiple:</span> ${claveMC(C.actMat.mc)}</div>
  <div><span class="pt">IV. Pareados:</span> ${parMat.clave}</div>
  <div><span class="pt">V. Procedimiento:</span> ${C.actMat.procedimiento.map((it, i) => `${i + 1}. ${esc(it.respuesta)}`).join(' &nbsp; ')}</div>
</div>`);
B(`<h3 style="color:var(--esp-osc);">🟡 Actividades de Español</h3>
<div class="pauta">
  <div><span class="pt">I. Completar:</span> ${claveComp(C.actEsp.completar)}</div>
  <div><span class="pt">II. Verdadero o Falso:</span> ${claveVF(C.actEsp.vf)}</div>
  <div><span class="pt">III. Lectura:</span> ${claveMC(C.actEsp.lectura.preguntas)}</div>
  <div><span class="pt">IV. Tipo de texto:</span> ${C.actEsp.tipos.map((t, i) => `${i + 1}. ${esc(t.tipo)}`).join(' &nbsp; ')}</div>
  <div><span class="pt">V. Pareados:</span> ${parEsp.clave}</div>
</div>`);
B(`<h3>📝 Simulacro</h3>
<div class="pauta">
  <div><span class="pt">Matemáticas (1 al ${C.simulacro.matematicas.length}):</span> ${claveMC(C.simulacro.matematicas)}</div>
  <div><span class="pt">Español (${C.simulacro.matematicas.length + 1} al ${C.simulacro.matematicas.length + C.simulacro.espanol.length}):</span> ${C.simulacro.espanol.map((it, i) => `${i + 1 + C.simulacro.matematicas.length}${LETRAS[it.a]}`).join(', ')}</div>
</div>`);
B(`<h3>✍️ Cómo se califica la escritura</h3>
<div class="pauta">
${C.actEsp.escritura.map((e, i) => `  <div><span class="pt">Consigna ${i + 1}:</span> ${esc(e.guia)}</div>`).join('\n')}
</div>`);
B(`<div class="nota-doc">
  <strong>Nota para el docente:</strong> esta ficha está basada en la misión «Prueba de Fin de Grado: ${M.grado} Grado»
  de la plataforma M.E.T.A.S y es la más extensa de la serie a propósito: no repasa un tema sino el temario
  completo del año en las dos materias que la prueba oficial evalúa. Puede trabajarse por partes: las hojas de
  franja azul en los días de Matemáticas y las de franja dorada en los de Español, dejando el simulacro para la
  víspera del examen. Los ítems de esta ficha son <strong>distintos</strong> a los de la misión interactiva, así que
  el estudiante que ya jugó la misión encuentra aquí práctica nueva y no respuestas memorizadas. En la misión
  (código QR de la portada) hay además dos pruebas conceptuales calificables en línea, una por materia, con
  veinte formas distintas para imprimir una versión diferente por fila. Al calificar la escritura, use la guía
  de arriba: lo que se evalúa es que la idea se entienda, no que la letra sea bonita.
</div>`);
B(`<div class="caja idea">🖨️ <b>Si no puede fotocopiar las {{TOTAL}} hojas para todo el grado:</b> imprima solo
las de <b>actividades y simulacro (páginas {{DESDE}} a {{HASTA}})</b>, que son las que el alumno rellena, y
trabaje las hojas de estudio con una sola copia, proyectándolas o dictando lo esencial para que las copien
en el cuaderno. La rúbrica ya cuenta ese trabajo de copia como una de las cuatro notas.</div>`);

/* ─── medir y empaquetar ─── */
(async () => {
  /* ── Empaquetado EXACTO ──────────────────────────────────────────
     No se miden los bloques por separado y se suman: entre dos bloques
     seguidos los márgenes se colapsan (queda el mayor, no la suma), así
     que sumar sobrestima y la hoja cierra antes de tiempo, dejando el
     sobrante en una hoja casi vacía. Aquí se arma la hoja de verdad en
     el navegador, con sus clases, y se mide DESPUÉS DE CADA BLOQUE: el
     que ya no cabe pasa a la hoja siguiente.

     Y el aire sobrante se REPARTE. De todos los repartos que caben en el
     mismo número de hojas se elige el que deja la HOJA MÁS VACÍA lo más
     llena posible. Apretar el presupuesto a secas no sirve: con bloques
     grandes que no se parten (una tabla de diez pareados) el apretón
     empuja el bloque siguiente a la hoja de más allá y deja justo lo que
     se quería evitar, media hoja en blanco. */
  const plano = [];
  secs.forEach((s, si) => s.bloques.forEach((b, bi) => plano.push({
    html: b, clase: s.clase, pie: s.pie, si, corta: s.nuevaHoja && bi === 0,
    // un bloque que es solo un título arrastra al siguiente: nunca se queda solo al pie
    pega: /^<h[23][ >]/.test(b.trim()) && b.trim().split('\n').length <= 3,
    // los recuadros para escribir se estiran después: una hoja con uno
    // siempre acaba llena, así que no cuenta como «hoja cargada»
    elastico: b.includes('class="desarrollo"'),
  })));

  // Grupos: trozos que van entre cortes obligados (cambio de color de hoja)
  const grupos = [];
  plano.forEach((blk, i) => {
    const anterior = plano[i - 1];
    if (!anterior || blk.clase !== anterior.clase || blk.corta) grupos.push([]);
    grupos[grupos.length - 1].push(i);
  });

  const browser = await abrir();
  const page = await browser.newPage({ viewport: { width: ANCHO, height: 1400 } });
  await page.emulateMedia({ media: 'print' });
  const medidor = path.join(DIR, 'medidor.html');
  fs.writeFileSync(medidor, CABEZA + '<section class="pagina" id="hoja" style="min-height:0;"><div class="contenido" id="cont"></div></section></div></body></html>');
  await page.goto('file://' + medidor, { waitUntil: 'load' });

  const reparto = await page.evaluate(({ grupos, plano, budget, mm }) => {
    const hoja = document.getElementById('hoja');
    const cont = document.getElementById('cont');

    function pinta(indices) {
      cont.innerHTML = '';
      indices.forEach(i => {
        const tmp = document.createElement('div');
        tmp.innerHTML = plano[i].html;
        [...tmp.childNodes].forEach(n => cont.appendChild(n));
      });
      return cont.getBoundingClientRect().height / mm;
    }

    const salida = [];
    grupos.forEach(indices => {
      hoja.className = 'pagina' + (plano[indices[0]].clase ? ' ' + plano[indices[0]].clase : '');
      const n = indices.length;

      /* Alto real de cada tramo de bloques seguidos. Se mide pintándolo,
         no sumando: entre dos bloques los márgenes se colapsan. Se corta
         de medir en cuanto el tramo se pasa de la hoja. */
      const alto = [];
      for (let i = 0; i < n; i++) {
        alto[i] = [];
        for (let j = i; j < n; j++) {
          const h = pinta(indices.slice(i, j + 1));
          alto[i][j] = h;
          if (h > budget) break;
        }
      }
      // Coste para repartir: una hoja con recuadro de escribir se estira
      // sola hasta llenarse, así que no pesa; lo que hay que equilibrar es
      // el resto.
      const elastica = (i, j) => indices.slice(i, j + 1).some(k => plano[k].elastico);
      const costo = (i, j) => elastica(i, j) ? 0 : alto[i][j];
      const cabe = (i, j) => alto[i][j] !== undefined && alto[i][j] <= budget
        // un título nunca cierra una hoja: se baja con lo que encabeza
        && !(plano[indices[j]].pega && j < n - 1);

      /* ¿En cuántas hojas cabe, como MÍNIMO? También se calcula con
         reparto óptimo: el codicioso se pasaba de hojas cuando un título
         al final le obligaba a retroceder, y una hoja de más en un
         cuadernillo de treinta son cuarenta y tres hojas de más en el
         fotocopiado del grado. */
      const memoK = new Array(n + 1).fill(-1);
      function minHojas(i) {
        if (i === n) return 0;
        if (memoK[i] !== -1) return memoK[i];
        let m = Infinity;
        for (let j = i; j < n; j++) {
          if (alto[i][j] === undefined) break;
          if (!cabe(i, j)) continue;
          m = Math.min(m, 1 + minHojas(j + 1));
        }
        return (memoK[i] = m);
      }
      const K = minHojas(0);

      /* Con el número de hojas ya fijo, se reparte para que la hoja MÁS
         CARGADA sea lo más liviana posible. Así el aire sobrante se
         reparte entre todas en vez de amontonarse en la última, que es
         la que salía medio vacía. */
      const memo = new Map();
      function mejor(i, k) {
        if (i === n) return k === 0 ? { max: 0, cortes: [] } : null;
        if (k === 0) return null;
        const clave = i * 100 + k;
        if (memo.has(clave)) return memo.get(clave);
        let res = null;
        for (let j = i; j < n; j++) {
          if (alto[i][j] === undefined) break;
          if (!cabe(i, j)) continue;
          const resto = mejor(j + 1, k - 1);
          if (!resto) continue;
          const max = Math.max(costo(i, j), resto.max);
          if (!res || max < res.max) res = { max, cortes: [j, ...resto.cortes] };
        }
        memo.set(clave, res);
        return res;
      }
      const plan = Number.isFinite(K) ? mejor(0, K) : null;

      if (plan) {
        let desde = 0;
        plan.cortes.forEach(j => { salida.push(indices.slice(desde, j + 1)); desde = j + 1; });
      } else {
        // Sin reparto válido (bloques que no caben ni solos): se deja el codicioso
        let a = 0;
        while (a < n) {
          let j = a;
          while (j + 1 < n && cabe(a, j + 1)) j++;
          salida.push(indices.slice(a, j + 1));
          a = j + 1;
        }
      }
    });
    return salida;
  }, { grupos, plano: plano.map(b => ({ html: b.html, clase: b.clase, pega: b.pega, elastico: b.elastico })), budget: BUDGET, mm: MM });

  await browser.close();
  fs.unlinkSync(medidor);

  const paginas = reparto.map(indices => {
    const primero = plano[indices[0]];
    // El pie nombra las secciones que caen en la hoja
    const pies = [...new Set(indices.map(i => plano[i].pie))];
    return { clase: primero.clase, pie: pies[0] + (pies.length > 1 ? ' y ' + pies.slice(1).map(p => p.replace(/^(Matemáticas|Español): /, '')).join(' y ') : ''), html: indices.map(i => plano[i].html), primerIdx: indices[0] };
  });
  // «(sigue)» cuando la hoja continúa la misma sección de la anterior
  paginas.forEach((p, i) => {
    const ant = paginas[i - 1];
    const comparte = p.pie.includes(' y ');
    if (!comparte && ant && plano[p.primerIdx].pie === plano[ant.primerIdx].pie && p.clase === ant.clase) p.pie += ' (sigue)';
  });

  const total = paginas.length;
  const iAct = paginas.findIndex(p => /actividades/i.test(p.pie));
  const iFin = paginas.map(p => /Simulacro/i.test(p.pie)).lastIndexOf(true);
  paginas.forEach(p => p.html = p.html.map(b => b
    .replace('{{TOTAL}}', String(total))
    .replace('{{DESDE}}', String(iAct + 1))
    .replace('{{HASTA}}', String(iFin + 1))));
  const html = CABEZA + paginas.map((p, i) => `
<!-- ═══════════ PÁGINA ${i + 1} ═══════════ -->
<section class="pagina${p.clase ? ' ' + p.clase : ''}">
  <div class="contenido">

${p.html.join('\n\n')}

  </div>
  <div class="pag-pie"><span><b>M.E.T.A.S</b> · Fin de Grado ${M.grado} · ${recorta(p.pie)}</span><span>Página ${i + 1} de ${total}</span></div>
</section>
`).join('') + `
</div>
</body>
</html>
`;
  fs.writeFileSync(SALIDA, html);

  /* Última pasada: en las hojas donde el alumno ESCRIBE, el hueco que
     sobra no se deja en blanco, se le da como espacio para escribir. Una
     hoja de tarea a medio llenar invita a contestar en dos renglones; con
     el recuadro estirado, el alumno usa el sitio que tiene. */
  const br2 = await abrir();
  const pg2 = await br2.newPage({ viewport: { width: ANCHO, height: 1400 } });
  await pg2.emulateMedia({ media: 'print' });
  await pg2.goto('file://' + SALIDA, { waitUntil: 'load' });
  const altosCaja = await pg2.evaluate(({ budget, mm }) => {
    const out = [];
    document.querySelectorAll('.pagina').forEach(hoja => {
      const cajas = hoja.querySelectorAll('.desarrollo');
      if (!cajas.length) return;
      const sobra = budget - hoja.querySelector('.contenido').getBoundingClientRect().height / mm;
      const extra = sobra >= 8 ? Math.floor((sobra * mm) / cajas.length) : 0;
      cajas.forEach(c => out.push(Math.round(c.getBoundingClientRect().height + extra)));
    });
    return out;
  }, { budget: BUDGET, mm: MM });
  await br2.close();

  let j = 0;
  fs.writeFileSync(SALIDA, html.replace(/<div class="desarrollo"[^>]*><\/div>/g,
    () => `<div class="desarrollo" style="height:${altosCaja[j++]}px;"></div>`));

  const sueltas = paginas.filter(p => p.html.length === 1).length;
  console.log(`ficha escrita: ${path.relative(RAIZ, SALIDA)} · ${total} páginas · ${(html.length / 1024).toFixed(0)} KB${sueltas ? ` · ${sueltas} hoja(s) con un solo bloque` : ''}`);
  console.log('Ahora: node _dev/verifica-ficha-paginas.js ficha-fin-de-grado-' + GRADO);
})();
