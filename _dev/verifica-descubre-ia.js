#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · 🔭 Descubre: lo que las actividades de descubrimiento de la
   Ruta de la Máquina que Aprende AFIRMAN, recalculado aparte
   ──────────────────────────────────────────────────────────────────────────
   El 16 de septiembre de 2026 entraron ocho actividades de descubrimiento,
   dos por etapa, y cada una promete algo en la propia pantalla: «muévela un
   puntito y dice otra cosa», «con un solo ejemplo acierta la mitad», «hasta
   el quinto ejemplo caben dos reglas», «"El remedio" no trae ni una sola
   cosa que se pueda comprobar». Una promesa que la pantalla no cumple enseña
   a no creerle a la pantalla —es lo que costó rehacer entero el «Enséñale a
   la máquina»—, así que aquí se recalcula cada una con el MISMO código que
   corre en el teléfono (`js/data/ia-descubre.js` corre también en Node, como
   `nube-ia.js`).

   Qué vigila, etapa por etapa:

   · 👀 Puntitos: la cruz igualita → «cruz» con 36 de 36; movida un puntito →
     otra cosa; la cuadrícula vacía → «raya», que es lo que la pantalla dice.
   · 🐾 Adivinador: los cinco animales en que se pensó salen bien, los
     «trampa» son EXACTAMENTE los que llevan su explicación (`es`), y ninguna
     pregunta ni hoja se queda sin texto.
   · 🎯 Reglas ocultas: cada ronda tiene ejemplos de las dos clases (si no,
     «todo entra» acertaría siempre), la regla se pide en el ejemplo que la
     pantalla dice, y en la ronda trampa las dos reglas coinciden hasta ahí
     y se separan justo en el siguiente.
   · 📈 Curva: con 1 acierta la mitad, sube, no baja por el camino, y de 20 a
     50 casi no cambia. Y los ejemplos van alternando de clase.
   · 🗓️ ¿Cuánto tardó?: los dos años de cada par EXISTEN en ia-historia.js
     (aquí no vive ninguna fecha), caben en el deslizador, y el texto que
     explica no lleva ningún número, para que no haya dos sitios que lo digan.
   · 🕵️ Comprobar: cada texto trae afirmaciones de las dos clases, salvo «El
     remedio», que no trae ninguna comprobable, porque la pantalla lo promete.
   · 🔮 Escenarios: cuatro, cada uno con su persona nombrada en la situación,
     su precio, tres decisiones con consecuencia y su regla.

   Y lo que se multiplica al copiar: que las cuatro misiones lleven la
   sección, la pestaña, las flechas en su orden, el archivo de datos ANTES
   del JS de la misión, TOTAL_SECTIONS subido, el logro, y que cada onclick
   de la sección tenga su función. Y que en el archivo de datos no entre un
   nombre de producto ni una cifra que envejezca: la misma lista que
   verifica-ia.

   Uso:  node _dev/verifica-descubre-ia.js      (está en `npm test`)
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const D = require(path.join(RAIZ, 'js/data/ia-descubre.js'));
const { IA_HITOS } = require(path.join(RAIZ, 'js/data/ia-historia.js'));

let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);
const leer = r => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const sinComentarios = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

console.log('\n🔭 Descubre · la Ruta de la Máquina que Aprende\n');

/* ── 👀 Puntitos ─────────────────────────────────────────────────────────── */
console.log('👀 La máquina ve puntitos');
{
  const cruz = D.iaPixDeFilas(D.IA_PIX_RECUERDOS.find(r => r.k === 'cruz').filas);
  const exacta = D.iaPixAdivina(cruz);
  if (exacta.mejor.k === 'cruz' && exacta.mejor.coincide === exacta.total) bien('la cruz igualita → «cruz», ' + exacta.total + ' de ' + exacta.total);
  else mal('la cruz igualita no da «cruz» con todo coincidiendo: ' + JSON.stringify(exacta.mejor));
  const movida = D.iaPixAdivina(D.iaPixMover(cruz));
  if (movida.mejor.k !== 'cruz') bien('la cruz movida un puntito → «' + movida.mejor.n + '» (' + movida.mejor.coincide + ' de ' + movida.total + '): la promesa de la pantalla se cumple');
  else mal('la cruz movida sigue dando «cruz»: la actividad promete que no');
  const vacia = D.iaPixAdivina(cruz.map(() => 0));
  if (vacia.mejor.k === 'raya') bien('la cuadrícula vacía → «raya» con ' + vacia.mejor.coincide + ' de ' + vacia.total + ', que es lo que la pantalla explica');
  else mal('la cuadrícula vacía no da «raya»: la pantalla dice que sí (' + vacia.mejor.k + ')');
  const lado = D.IA_PIX_LADO;
  D.IA_PIX_RECUERDOS.forEach(r => {
    if (r.filas.length !== lado || r.filas.some(f => f.length !== lado)) mal('el recuerdo «' + r.k + '» no es de ' + lado + ' × ' + lado);
  });
  if (lado * lado <= 40) bien(lado * lado + ' casillas: por debajo de las 40 paradas de tabulador que la normativa del teclado tolera');
  else mal(lado * lado + ' casillas son más de 40 paradas de tabulador');
}

/* ── 🐾 Adivinador ───────────────────────────────────────────────────────── */
console.log('\n🐾 El adivinador de animales');
{
  const trampas = D.iaAdivTrampas();
  const conExplicacion = D.IA_ADIV_ANIMALES.filter(a => a.es).map(a => a.k);
  if (trampas.join() === conExplicacion.join()) bien('los que el árbol falla son exactamente los que traen su explicación: ' + trampas.join(', '));
  else mal('el árbol falla con [' + trampas.join(', ') + '] y la explicación la llevan [' + conExplicacion.join(', ') + ']');
  if (trampas.length >= 2) bien('hay ' + trampas.length + ' animales en los que nadie pensó: la actividad tiene con qué sorprender');
  else mal('con ' + trampas.length + ' trampas la actividad no enseña lo que promete');
  D.IA_ADIV_ANIMALES.forEach(a => ['agua', 'concha', 'plumas', 'patas4'].forEach(p => { if (typeof a[p] !== 'boolean') mal('a «' + a.k + '» le falta el rasgo ' + p); }));
  const hojas = [], preguntas = [];
  (function anda(n) { if (n.hoja) { hojas.push(n.hoja); return; } preguntas.push(n.p); anda(n.si); anda(n.no); })(D.IA_ADIV_ARBOL);
  preguntas.forEach(p => { if (!D.IA_ADIV_PREGUNTAS[p]) mal('la pregunta «' + p + '» del árbol no tiene texto'); });
  hojas.forEach(h => { if (!D.IA_ADIV_NOMBRES[h]) mal('la hoja «' + h + '» no tiene nombre para decirlo'); if (!D.IA_ADIV_ANIMALES.some(a => a.k === h)) mal('la hoja «' + h + '» no es ningún animal de la lista'); });
  bien(preguntas.length + ' preguntas y ' + hojas.length + ' hojas, todas con texto');
}

/* ── 🎯 Reglas ocultas ───────────────────────────────────────────────────── */
console.log('\n🎯 Tú eres la máquina');
{
  D.IA_REGLAS_OCULTAS.forEach((r, i) => {
    const et = r.ejemplos.map(x => !!r.regla(x));
    const si = et.filter(Boolean).length, no = et.length - si;
    if (si >= 3 && no >= 3) bien('ronda ' + (i + 1) + ' («' + r.nombre + '»): ' + si + ' entran y ' + no + ' no');
    else mal('ronda ' + (i + 1) + ': ' + si + ' entran y ' + no + ' no; con tan pocos de una clase, contestar siempre lo mismo acierta casi todo');
    if (D.IA_REGLAS_MEDIO >= r.ejemplos.length) mal('ronda ' + (i + 1) + ': la regla se pide después del último ejemplo');
    if (r.trampa) {
      const otra = r.ejemplos.map(x => !!r.trampa.otra(x));
      const igualesHasta = et.slice(0, r.trampa.hasta).every((v, k) => v === otra[k]);
      const separa = et[r.trampa.hasta] !== otra[r.trampa.hasta];
      if (igualesHasta && separa) bien('ronda ' + (i + 1) + ' (trampa): «' + r.nombre + '» y «' + r.trampa.otraNombre + '» coinciden en los ' + r.trampa.hasta + ' primeros y el ' + r.ejemplos[r.trampa.hasta] + ' las separa');
      else mal('ronda ' + (i + 1) + ' (trampa): las dos reglas no coinciden hasta el ' + r.trampa.hasta + ' o no se separan justo después');
      if (r.trampa.hasta !== D.IA_REGLAS_MEDIO) mal('la regla se pide en el ejemplo ' + D.IA_REGLAS_MEDIO + ' pero la trampa dura hasta el ' + r.trampa.hasta + ': hay que pedirla justo cuando todavía caben las dos');
    }
  });
  /* La pantalla dice «hasta el quinto ejemplo»: si cambia el número, cambia
     la palabra. */
  const ORD = { 3: 'tercer', 4: 'cuarto', 5: 'quinto', 6: 'sexto', 7: 'séptimo' };
  const html73 = leer('misiones/2ciclo-como-aprende-una-maquina/como-aprende-una-maquina.html');
  const r4 = D.IA_REGLAS_OCULTAS.find(r => r.trampa);
  if (r4 && html73.includes('Hasta el ' + ORD[r4.trampa.hasta] + ' ejemplo')) bien('la misión dice «hasta el ' + ORD[r4.trampa.hasta] + ' ejemplo», que es lo que la trampa dura');
  else mal('la misión no dice «hasta el ' + (r4 ? ORD[r4.trampa.hasta] : '?') + ' ejemplo» donde explica la trampa');
}

/* ── 📈 Curva ────────────────────────────────────────────────────────────── */
console.log('\n📈 ¿Cuántos ejemplos hacen falta?');
{
  const datos = D.iaCurvaDatos();
  const ac = D.IA_CURVA_N.map(n => D.iaCurvaExactitud(n, datos));
  const tabla = D.IA_CURVA_N.map((n, i) => n + '→' + ac[i]).join('  ');
  if (ac[0] === 10) bien('con 1 ejemplo acierta 10 de 20: «la mitad, como una moneda», como dice la pantalla');
  else mal('con 1 ejemplo acierta ' + ac[0] + ' de 20 y la pantalla dice que la mitad');
  if (ac[1] > ac[0]) bien('con 2 ya acierta más que con 1 (' + ac[1] + ')'); else mal('con 2 ejemplos no mejora: ' + tabla);
  const i20 = D.IA_CURVA_N.indexOf(20), i50 = D.IA_CURVA_N.indexOf(50);
  if (ac[i20] >= ac[1] + 2) bien('de 2 a 20 ejemplos sube (' + ac[1] + ' → ' + ac[i20] + ')'); else mal('de 2 a 20 no sube lo bastante para verse: ' + tabla);
  if (Math.abs(ac[i50] - ac[i20]) <= 1) bien('de 20 a 50 casi no cambia (' + ac[i20] + ' → ' + ac[i50] + '): «deja de subir»'); else mal('de 20 a 50 cambia ' + Math.abs(ac[i50] - ac[i20]) + ', y la pantalla dice que casi nada');
  if (ac.every((v, i) => i === 0 || v >= ac[i - 1])) bien('no baja por el camino: ' + tabla); else mal('la curva baja en algún tramo, y la pantalla promete que sube y se aplana: ' + tabla);
  if (datos.entrena[0].c !== datos.entrena[1].c) bien('los ejemplos alternan de clase: con dos ya conoce las dos'); else mal('los dos primeros ejemplos son de la misma clase');
  if (datos.prueba.filter(p => p.c === 'rojo').length === 10) bien('la prueba es 10 y 10: acertar la mitad ES contestar siempre lo mismo'); else mal('la prueba no está repartida 10 y 10');
}

/* ── 🗓️ ¿Cuánto tardó? ───────────────────────────────────────────────────── */
console.log('\n🗓️ ¿Cuánto tardó?');
{
  D.IA_TIEMPO_PARES.forEach(p => {
    const A = IA_HITOS.find(h => String(h.anio) === p.a), B = IA_HITOS.find(h => String(h.anio) === p.b);
    if (!A || !B) { mal('el par ' + p.a + ' → ' + p.b + ' nombra un año que no está en ia-historia.js'); return; }
    const gap = parseInt(p.b, 10) - parseInt(p.a, 10);
    if (gap <= 0 || gap > 80) mal('el par ' + p.a + ' → ' + p.b + ' da ' + gap + ' años, fuera del deslizador (0 a 80)');
    if (/\d/.test(p.por)) mal('el par ' + p.a + ' → ' + p.b + ' lleva un número en su explicación: las fechas viven solo en ia-historia.js');
  });
  bien(D.IA_TIEMPO_PARES.length + ' pares, todos con sus dos años en ia-historia.js y sin fechas escritas aparte');
}

/* ── 🕵️ Comprobar ────────────────────────────────────────────────────────── */
console.log('\n🕵️ ¿Se puede comprobar?');
{
  D.IA_COMPROBAR.forEach(t => {
    const si = t.trozos.filter(z => z.c).length, no = t.trozos.length - si;
    t.trozos.forEach(z => { if (!z.por || z.por.length < 20) mal('«' + t.titulo + '»: una afirmación no explica por qué'); });
    if (t.k === 'remedio') { if (si === 0 && no >= 3) bien('«' + t.titulo + '»: ' + no + ' afirmaciones y ninguna comprobable, como promete la pantalla'); else mal('«El remedio» tiene ' + si + ' comprobables y la pantalla promete que ninguna'); }
    else if (si >= 1 && no >= 1) bien('«' + t.titulo + '»: ' + si + ' comprobables y ' + no + ' que no');
    else mal('«' + t.titulo + '» no trae afirmaciones de las dos clases');
  });
  const html75 = leer('misiones/3ciclo-ia-generativa/ia-generativa.html');
  if (/no lo aciertan ni los\s+expertos/.test(html75)) bien('la misión dice que adivinar quién lo escribió no lo aciertan ni los expertos: no promete un detector');
  else mal('la misión ya no avisa de que no se puede adivinar quién escribió un texto');
}

/* ── 🔮 Escenarios ───────────────────────────────────────────────────────── */
console.log('\n🔮 Escenarios por venir');
{
  if (D.IA_ESCENARIOS.length === 4) bien('cuatro escenarios, como dice la pantalla'); else mal('la pantalla dice cuatro escenarios y hay ' + D.IA_ESCENARIOS.length);
  D.IA_ESCENARIOS.forEach(e => {
    const nombre = e.quien.replace(/^don\s+|^doña\s+/i, '').split(/[ ,]/)[0];
    if (!e.situacion.includes(nombre)) mal('«' + e.titulo + '»: la situación no nombra a ' + nombre);
    if (!e.cuesta || e.cuesta.length < 10) mal('«' + e.titulo + '» no dice qué cuesta');
    if (e.ops.length !== 3 || e.ops.some(o => !o.t || !o.pasa || o.pasa.length < 40)) mal('«' + e.titulo + '» no trae tres decisiones con su consecuencia');
    if (!e.regla) mal('«' + e.titulo + '» no deja una regla');
  });
  bien('cada uno con su persona en la situación, su precio, tres decisiones con consecuencia y su regla');
  const html75 = leer('misiones/3ciclo-ia-generativa/ia-generativa.html');
  if (/inventadas para pensar/.test(html75)) bien('la misión los declara inventados en la propia pantalla'); else mal('la misión ya no declara que los escenarios son inventados');
}

/* ── Lo que se multiplica al copiar: las cuatro misiones ─────────────────── */
console.log('\n🔌 Las cuatro misiones');
const MISIONES = [
  { dir: 'misiones/1ciclo-que-es-la-ia', html: 'que-es-la-ia.html', js: 'js/que-es-la-ia.js', logro: 'descubridor' },
  { dir: 'misiones/2ciclo-como-aprende-una-maquina', html: 'como-aprende-una-maquina.html', js: 'js/como-aprende-una-maquina.js', logro: 'maquina_humana' },
  { dir: 'misiones/2y3ciclo-historia-ia', html: 'historia-ia.html', js: 'js/historia-ia.js', logro: 'cronista_hoy' },
  { dir: 'misiones/3ciclo-ia-generativa', html: 'ia-generativa.html', js: 'js/ia-generativa.js', logro: 'decide' },
];
MISIONES.forEach(m => {
  const html = leer(path.join(m.dir, m.html)), js = leer(path.join(m.dir, m.js));
  const n = m.html;
  const errores = [];
  if (!html.includes('<div class="sec" id="s-descubre"')) errores.push('sin sección s-descubre');
  if (!/data-s="s-descubre"/.test(html)) errores.push('sin pestaña');
  const flechas = [...html.matchAll(/next-sec-btn" aria-label="[^"]*" onclick="go\('([a-z0-9-]+)'\)"/g)].map(x => x[1]);
  const iDesc = flechas.indexOf('s-descubre'), iLab = flechas.indexOf('s-lab');
  if (iDesc < 0 || iLab !== iDesc + 1) errores.push('las flechas no van estructura → descubre → lab (' + flechas.slice(0, 4).join(' → ') + ')');
  const tabs = [...html.matchAll(/data-s="(s-[a-z0-9]+)"/g)].map(x => x[1]);
  if (tabs.indexOf('s-descubre') !== tabs.indexOf('s-estructura') + 1) errores.push('la pestaña Descubre no va detrás de la de la actividad');
  const iDatos = html.indexOf('js/data/ia-descubre.js'), iJs = html.indexOf('<script src="' + m.js + '"');
  if (iDatos < 0 || iJs < 0 || iDatos > iJs) errores.push('el archivo de datos no va antes del JS de la misión');
  if (!/const TOTAL_SECTIONS=14;/.test(js)) errores.push('TOTAL_SECTIONS no es 14');
  if (!new RegExp('\\n  ' + m.logro + ':\\{icon:').test(js)) errores.push('sin el logro «' + m.logro + '»');
  const limpio = sinComentarios(js);
  if (!/fin\('s-descubre'\)/.test(limpio)) errores.push('nada llama a fin(\'s-descubre\')');
  if ((limpio.match(/fin\('s-descubre'\)/g) || []).length !== 1) errores.push('fin(\'s-descubre\') se llama en más de un sitio');
  if (!/iaDescInit\(\);/.test(limpio)) errores.push('el arranque no llama a iaDescInit()');
  /* Cada onclick/oninput de la sección tiene su función en el JS. */
  const sec = html.slice(html.indexOf('id="s-descubre"'), html.indexOf('id="s-lab"'));
  const llamadas = new Set([...sec.matchAll(/on(?:click|input)="([A-Za-z_]+)\(/g)].map(x => x[1]));
  llamadas.forEach(f => { if (f !== 'go' && !new RegExp('function ' + f + '\\(').test(js)) errores.push('el HTML llama a ' + f + '() y no existe en el JS'); });
  if (errores.length) errores.forEach(e => mal(n + ': ' + e));
  else bien(n + ': sección, pestaña, flechas, datos, TOTAL_SECTIONS=14, logro «' + m.logro + '», ' + llamadas.size + ' funciones enganchadas');
});

/* ── Lo que a propósito no se escribe ────────────────────────────────────── */
console.log('\n🚧 Lo que a propósito no se escribe');
{
  const src = sinComentarios(leer('js/data/ia-descubre.js'));
  const PROHIBIDO = [/\bgpt-?\d/i, /chatgpt/i, /\bgemini\b/i, /\bcopilot\b/i, /\bclaude\b/i, /\bllama\b/i, /\bmistral\b/i,
    /\d+\s*(millones|mil millones|billones)\s+de\s+(usuarios|parámetros)/i, /\\U[0-9A-F]{8}/];
  const malas = PROHIBIDO.filter(r => r.test(src));
  if (!malas.length) bien('ni un nombre de producto, ni una cifra que envejece, ni un escape de Python');
  else malas.forEach(r => mal('en ia-descubre.js aparece ' + r));
  if (!/https?:\/\//.test(src)) bien('ninguna actividad manda a ninguna parte: todo corre dentro del teléfono'); else mal('hay una dirección web en las actividades');
}

console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ Las ocho actividades cumplen lo que prometen.\n');
process.exit(fallos ? 1 : 0);
