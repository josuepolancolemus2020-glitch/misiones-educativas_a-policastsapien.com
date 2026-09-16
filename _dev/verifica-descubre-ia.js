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
const T = require(path.join(RAIZ, 'js/data/ia-actualidad.js'));
const F = require(path.join(RAIZ, 'js/data/ia-futuros.js'));
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

/* ── 🎙️ ¿Cuánto hace falta para una estafa? ───────────────────────────────── */
console.log('\n🎙️ ¿Cuánto hace falta para una estafa?');
{
  const vacio = D.iaEstafaMensaje([]);
  const todo = D.iaEstafaMensaje(D.IA_ESTAFA_PIEZAS.map(p => p.k));
  const tiene = m => D.IA_ESTAFA_SENALES.filter(s => !m.includes(s.busca));
  /* Lo que la pantalla AFIRMA con esas palabras: las tres señales están con
     piezas y sin piezas, porque sin ellas la estafa no funciona. Si alguien
     mueve el texto base y se lleva una por delante, la afirmación se vuelve
     falsa sin dar ningún error: el mensaje se pinta igual de bien. */
  const faltan = [vacio, todo].concat(D.IA_ESTAFA_PIEZAS.map(p => D.iaEstafaMensaje([p.k]))).map(tiene).flat();
  if (!faltan.length) bien('las tres señales están en el mensaje con piezas y sin piezas, que es lo que la actividad promete');
  else mal('el mensaje armado se queda sin la señal «' + faltan[0].k + '» en algún caso: la pantalla dice que están siempre');
  if (todo.length > vacio.length + 60) bien('con las seis piezas el mensaje crece de ' + vacio.length + ' a ' + todo.length + ' caracteres: se ve la diferencia');
  else mal('con las seis piezas el mensaje casi no cambia (' + vacio.length + ' → ' + todo.length + '): la actividad no enseña nada');
  const sinPublico = D.IA_ESTAFA_PIEZAS.filter(p => !p.publico || p.publico.length < 15);
  if (!sinPublico.length) bien('las ' + D.IA_ESTAFA_PIEZAS.length + ' piezas dicen de dónde salieron: es la lección, y sin eso la actividad solo asusta');
  else mal('la pieza «' + sinPublico[0].k + '» no dice de dónde salió');
  /* La pieza del canal es la única que NO se publicó: la pone quien engaña, y
     eso es justo lo que la pantalla remata al final. */
  if (/no se public|la pone quien engaña/i.test(D.IA_ESTAFA_PIEZAS.find(p => p.k === 'canal').publico)) bien('la pieza del número nuevo dice que esa no la publicó la familia');
  else mal('la pieza del número nuevo tendría que decir que esa NO se publicó: es la única que pone quien engaña');
  const vale = k => D.IA_ESTAFA_DEFENSAS.filter(d => d.vale === k).length;
  if (vale('si') >= 2 && vale('no') >= 1 && vale('medias') >= 1) bien('de las ' + D.IA_ESTAFA_DEFENSAS.length + ' defensas, ' + vale('si') + ' paran esto, ' + vale('no') + ' no y ' + vale('medias') + ' a medias: no todas valen igual, y eso se dice');
  else mal('las defensas no traen los tres veredictos (sí / no / a medias): una lista donde todas sirven no enseña a elegir');
  const voz = D.IA_ESTAFA_DEFENSAS.find(d => d.k === 'voz');
  if (voz && voz.vale === 'no') bien('«reconocer la voz» está marcada como que NO lo para: es justo lo que se fabrica');
  else mal('«reconocer la voz» tiene que estar marcada como que no lo para');
}

/* ── ⚖️ El promedio que esconde ───────────────────────────────────────────── */
console.log('\n⚖️ El promedio que esconde');
{
  D.IA_SISTEMAS.forEach(s => {
    const pob = s.grupos.reduce((a, g) => a + g.cuantos, 0);
    const chico = s.grupos.reduce((a, g) => (g.cuantos < a.cuantos ? g : a), s.grupos[0]);
    if (s.grupos.length !== 2) { mal('«' + s.nombre + '» no tiene dos grupos'); return; }
    if (chico.cuantos / pob > 0.25) mal('«' + s.nombre + '»: el grupo pequeño es el ' + Math.round(chico.cuantos / pob * 100) + ' % de la población, y así el promedio no llega a esconder nada');
    const solo = D.iaExactitud(s, 'solo_grande'), mitad = D.iaExactitud(s, 'mitad'), pobl = D.iaExactitud(s, 'poblacion');
    const chicoSolo = solo.porGrupo[1];
    /* Lo que la pantalla AFIRMA cuando el grupo pequeño se queda sin ejemplos:
       «esto es echar una moneda al aire». Tiene que ser verdad de la cuenta. */
    if (chicoSolo.ejemplos === 0 && chicoSolo.pct === 50) bien('«' + s.nombre + '»: sin un solo ejemplo suyo, el grupo pequeño es una moneda (50 %) y el promedio sigue diciendo ' + solo.media + ' %');
    else mal('«' + s.nombre + '»: entrenando solo con el grupo grande, el pequeño no queda en 50 %: la pantalla dice que es una moneda');
    if (solo.media >= 85) bien('«' + s.nombre + '»: y ese promedio de ' + solo.media + ' % es el que se presume al comprarlo');
    else mal('«' + s.nombre + '»: el promedio con el reparto malo es ' + solo.media + ' %, demasiado bajo para que se vea que el promedio esconde');
    /* Y la sorpresa que la pantalla remata: repartir parejo da el promedio más
       alto de los cuatro. Es verdad en ESTE caso y la pantalla lo dice así. */
    const medias = D.IA_REPARTOS.map(r => D.iaExactitud(s, r.k).media);
    if (mitad.media >= Math.max.apply(null, medias)) bien('«' + s.nombre + '»: mitad y mitad da el promedio más alto (' + mitad.media + ' %), que es la sorpresa de la actividad');
    else mal('«' + s.nombre + '»: mitad y mitad ya no da el promedio más alto, y la pantalla lo afirma');
    if (Math.abs(mitad.porGrupo[0].pct - mitad.porGrupo[1].pct) <= 2) bien('«' + s.nombre + '»: con mitad y mitad los dos grupos van casi igual');
    else mal('«' + s.nombre + '»: con mitad y mitad los grupos no quedan parejos');
    if (pobl.porGrupo[1].pct > 55 && pobl.porGrupo[1].pct < solo.porGrupo[0].pct) bien('«' + s.nombre + '»: el reparto proporcional deja al grupo pequeño en ' + pobl.porGrupo[1].pct + ' %, mejor que nada y peor que el grande');
  });
  if (D.iaAciertoGrupo(0) === 50) bien('sin ejemplos de un grupo, sobre ese grupo la máquina es una moneda: 50 %');
  else mal('iaAciertoGrupo(0) no da 50: la actividad entera cuelga de eso');
  const sube = [0, 5, 10, 20, 40, 80].map(D.iaAciertoGrupo);
  if (sube.every((v, i) => i === 0 || v >= sube[i - 1])) bien('la curva de acierto sube y se aplana: ' + sube.join(' → '));
  else mal('la curva de acierto baja en algún tramo: ' + sube.join(' → '));
}

/* ── 🌡️ El termómetro de la promesa ──────────────────────────────────────── */
console.log('\n🌡️ El termómetro de la promesa');
{
  const tramos = new Set(T.IA_FRASES.map(f => T.iaFraseTramo(T.iaFraseCuenta(f)).k));
  if (tramos.size === T.IA_TERMOMETRO_TRAMOS.length) bien(`las ${T.IA_FRASES.length} frases caen en los ${tramos.size} tramos distintos: ` + T.IA_FRASES.map(f => T.iaFraseCuenta(f) + '/4').join(' · '));
  else mal('las frases solo tocan ' + tramos.size + ' de los ' + T.IA_TERMOMETRO_TRAMOS.length + ' tramos: con una lista así el alumno no aprende a separar, aprende a desconfiar de todo');
  /* ⚠️ Lo que la pantalla AFIRMA con esas palabras: «de las cinco, dos traen
     con qué comprobarse». Salir de la misión desconfiando de todo cuesta lo
     mismo que creerlo todo, y por eso la lista no puede ser toda humo. */
  const buenas = T.IA_FRASES.filter(f => T.iaFraseCuenta(f) >= 3).length;
  if (buenas >= 2) bien(buenas + ' de las ' + T.IA_FRASES.length + ' frases traen con qué comprobarse, que es lo que la pantalla promete');
  else mal('solo ' + buenas + ' frase(s) traen con qué comprobarse, y la misión dice que son dos');
  T.IA_FRASES.forEach(f => {
    ['quien', 'gana', 'cuando', 'comprueba'].forEach(k => { if (typeof f.tiene[k] !== 'boolean') mal('la frase «' + f.k + '» no contesta la pregunta ' + k); });
    if (!f.porque || f.porque.length < 40) mal('la frase «' + f.k + '» no explica por qué cae donde cae');
  });
  const tope = T.IA_TERMOMETRO_TRAMOS[0];
  if (tope.min === T.IA_TERMOMETRO.length) bien('el tramo más alto pide las ' + T.IA_TERMOMETRO.length + ' preguntas: no se regala');
  else mal('el tramo más alto se alcanza sin contestar las cuatro preguntas');
}

/* ── 📰 El dossier fechado ────────────────────────────────────────────────── */
console.log('\n📰 El dossier de la actualidad');
{
  if (/\d{1,2} de [a-zé]+ de \d{4}/.test(T.IA_HOY_FECHA)) bien('el dossier lleva su fecha completa: ' + T.IA_HOY_FECHA);
  else mal('IA_HOY_FECHA no es una fecha completa, y un dossier sin fecha es una mentira en tres meses');
  const niveles = new Set(T.IA_HOY.map(h => h.comprobable));
  if (niveles.size === 3) bien('el dossier trae afirmaciones de los tres niveles: ' + [...niveles].join(', '));
  else mal('el dossier solo trae ' + niveles.size + ' nivel(es): sin las tres clases no se puede aprender a separarlas');
  T.IA_HOY.forEach(h => {
    ['afirma', 'quien', 'gana', 'trae', 'comprueba', 'importa'].forEach(k => {
      if (!h[k] || String(h[k]).length < 15) mal('la entrada «' + h.k + '» no trae ' + k);
    });
    /* La fecha se mide aparte: «todo el mes» es una fecha legítima para un
       patrón que dura semanas, y pedirle quince caracteres la daba por
       ausente. Lo que hace falta es que ESTÉ. */
    if (!h.fecha || h.fecha.length < 5) mal('la entrada «' + h.k + '» no trae fecha');
    /* ⚠️ Ninguna afirmación puede nombrar un producto ni una empresa: se nombra
       al MEDIO que lo publicó, que es lo que el alumno necesita para llegar. */
    if (/\bgpt-?\d|chatgpt|\bgemini\b|\bcopilot\b|\bclaude\b/i.test(h.afirma + h.quien)) mal('la entrada «' + h.k + '» nombra un producto');
  });
  if (T.IA_HOY.every(h => /comprob|busc|abr|le[eé]|mir/i.test(h.comprueba))) bien('las ' + T.IA_HOY.length + ' entradas dicen CÓMO se comprueban, que es lo único que esta misión afirma');
  else mal('alguna entrada no dice cómo comprobarla');
  /* Y la declaración que sostiene la misión entera. */
  const html = leer('misiones/3ciclo-albores-singularidad/albores-singularidad.html');
  if (/no pudo abrir/.test(html) && /buscar no es leer/i.test(html)) bien('la misión declara en pantalla que no pudo abrir esas páginas: buscar no es leer');
  else mal('la misión no declara que no pudo abrir esas páginas, y sin eso está afirmando hechos que nadie verificó');
}

console.log('\n🔮 El taller de escenarios');
{
  /* Lo que la pantalla AFIRMA: que juzga las cuatro piezas por la forma, no
     por el tema. Se le tiran los dos extremos, que es como se comprueba que
     una prueba de verdad discrimina: una profecía de manual y un escenario
     completo. */
  const profecia = F.iaFutJuzga({ cap: 'teletransporte', quien: 'la gente', precio: 'es grave', decide: 'va a cambiar todo' });
  if (F.iaFutCuenta(profecia) === 0) bien('una profecía de manual no pasa ninguna de las cuatro piezas');
  else mal('la prueba le da ' + F.iaFutCuenta(profecia) + ' pieza(s) a una frase que no tiene ninguna');
  const bueno = F.iaFutJuzga({ cap: 'voz', quien: 'Kenia', precio: 'L 1 500 de la matrícula', decide: '¿le contesta o la llama al número de siempre?' });
  if (F.iaFutEsEscenario(bueno)) bien('un escenario con sus cuatro piezas las pasa todas');
  else mal('un escenario completo no pasa la prueba: le falta ' + F.iaFutLeFalta(bueno).map(x => x.k).join(', '));
  /* Y cada pieza se cae SOLA cuando falta: si se cayeran juntas, la pantalla
     no le estaría diciendo al alumno cuál arreglar. */
  const base = { cap: 'voz', quien: 'Kenia', precio: 'tres días de trabajo', decide: '¿qué hace?' };
  const rompe = { hoy: { cap: 'nada' }, quien: { quien: 'la gente' }, precio: { precio: 'es importante' }, decide: { decide: 'va a pasar' } };
  let solas = 0;
  Object.keys(rompe).forEach(k => {
    const v = F.iaFutJuzga(Object.assign({}, base, rompe[k]));
    const faltan = F.iaFutLeFalta(v).map(x => x.k);
    if (faltan.length === 1 && faltan[0] === k) solas++;
    else mal('al romper «' + k + '» la prueba señala ' + (faltan.join(', ') || 'nada') + ': cada pieza tiene que caerse sola');
  });
  if (solas === 4) bien('las cuatro piezas se caen una a una, así que la pantalla dice cuál arreglar');
  /* ⚠️ Y la lista de lo contable no puede estar vacía de números: un precio
     con cifra tiene que pasar aunque no use ninguna de las palabras. */
  if (F.iaFutJuzga(Object.assign({}, base, { precio: '43 de ellos' })).precio) bien('un precio con número pasa aunque no use ninguna palabra de la lista');
  else mal('un precio con número no pasa: la lista de palabras se volvió obligatoria');
}

console.log('\n⚖️ El mismo invento, en otras manos');
{
  /* Lo que la actividad AFIRMA con esas palabras: la máquina es la misma y lo
     que cambia el final es a cuánta gente alcanza y si alguien revisa. Se
     recalculan las combinaciones enteras, no una. */
  let mal1 = 0, mal2 = 0, mal3 = 0;
  F.IA_CAPACIDADES.forEach(c => F.IA_FUT_MANOS.forEach(m => {
    const sin = F.iaFutFinal(c.k, m.k, false), con = F.iaFutFinal(c.k, m.k, true);
    if (!sin || !con) { mal1++; return; }
    if (sin.alcance !== m.alcanceN || con.alcance !== m.alcanceN) mal1++;
    if (!/no vale todav[ií]a/i.test(con.pasa)) mal2++;
    if (!/no sale gratis/i.test(con.cuesta)) mal3++;
  }));
  const total = F.IA_CAPACIDADES.length * F.IA_FUT_MANOS.length;
  if (!mal1) bien('en las ' + total + ' combinaciones el alcance lo pone la mano, no la capacidad');
  else mal(mal1 + ' combinación(es) no sacan el alcance de quien tiene la máquina');
  if (!mal2) bien('con revisión, la decisión no vale todavía: el fallo se ve antes de ejecutarse');
  else mal(mal2 + ' combinación(es) no dicen que la decisión se detiene');
  if (!mal3) bien('y NINGUNA promete que revisar salga gratis, que es lo honesto');
  else mal(mal3 + ' combinación(es) dejan creer que revisar es gratis');
  /* Las manos de alcance grande tienen que avisar de que no se puede revisar
     todo. Es lo que separa esta actividad de una moraleja. */
  const grandes = F.IA_FUT_MANOS.filter(m => !m.todo);
  if (grandes.length >= 2 && grandes.every(m => F.iaFutFinal('voz', m.k, true).aviso)) bien('las manos grandes avisan de que revisarlo todo no se puede');
  else mal('alguna mano de alcance grande no avisa de que revisarlo todo no se puede');
  /* Y que las manos vayan de menos a más alcance, que es lo que el alumno ve
     moverse al cambiar de chip. */
  const orden = F.IA_FUT_MANOS.map(m => m.alcanceN);
  if (orden.every((v, i) => i === 0 || v > orden[i - 1])) bien('las manos van de la casa a la empresa, de menos alcance a más');
  else mal('las manos no están ordenadas por alcance: el chip de al lado tiene que ser el siguiente escalón');
  /* La declaración que sostiene la misión entera. */
  const html = leer('misiones/3ciclo-escenarios-porvenir/escenarios-porvenir.html');
  if (/inventad/.test(html) && /no se dice.{0,30}fecha|ponerle fecha a lo inventado/.test(html)) bien('la misión declara en pantalla que los escenarios están inventados y por qué no llevan fecha');
  else mal('la misión no declara que los escenarios están inventados, o no explica por qué no llevan fecha');
}

/* ── Lo que se multiplica al copiar: las misiones de la ruta ────────────── */
const MISIONES = [
  { dir: 'misiones/1ciclo-que-es-la-ia', html: 'que-es-la-ia.html', js: 'js/que-es-la-ia.js', logro: 'descubridor' },
  { dir: 'misiones/2ciclo-como-aprende-una-maquina', html: 'como-aprende-una-maquina.html', js: 'js/como-aprende-una-maquina.js', logro: 'maquina_humana' },
  { dir: 'misiones/2y3ciclo-historia-ia', html: 'historia-ia.html', js: 'js/historia-ia.js', logro: 'cronista_hoy' },
  { dir: 'misiones/3ciclo-ia-generativa', html: 'ia-generativa.html', js: 'js/ia-generativa.js', logro: 'decide' },
  { dir: 'misiones/3ciclo-peligros-ia', html: 'peligros-ia.html', js: 'js/peligros-ia.js', logro: 'blindado' },
  /* ⚠️ La 77 NO carga ia-descubre.js: sus dos actividades salen de
     ia-actualidad.js, que es donde vive su dossier. Por eso cada misión dice
     cuál es SU archivo de datos en vez de darlo por sabido. */
  { dir: 'misiones/3ciclo-albores-singularidad', html: 'albores-singularidad.html', js: 'js/albores-singularidad.js', logro: 'cronometro', datos: 'js/data/ia-actualidad.js' },
  { dir: 'misiones/3ciclo-escenarios-porvenir', html: 'escenarios-porvenir.html', js: 'js/escenarios-porvenir.js', logro: 'cronometro', datos: 'js/data/ia-futuros.js' },
];
console.log(`\n🔌 Las ${MISIONES.length} misiones de la ruta`);
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
  const iDatos = html.indexOf(m.datos || 'js/data/ia-descubre.js'), iJs = html.indexOf('<script src="' + m.js + '"');
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
  const PROHIBIDO = [/\bgpt-?\d/i, /chatgpt/i, /\bgemini\b/i, /\bcopilot\b/i, /\bclaude\b/i, /\bllama\s*[0-9]/i, /modelo llama/i, /* ⚠️ «llama» a secas NO se puede prohibir: es un verbo corriente en español
       («te llama por tu nombre») y pedirlo así pone roja una actividad
       perfectamente escrita. Una sonda que acusa a un archivo sano enseña a
       no mirarla, que es la lección de «Cuadrado Perfecto» de la auditoría.
       Lo que sí se puede afirmar sin adivinar es la forma en que se nombra un
       producto: con su número de versión, o dicho «modelo …». */
    /\bmistral\b/i,
    /\d+\s*(millones|mil millones|billones)\s+de\s+(usuarios|parámetros)/i, /\\U[0-9A-F]{8}/];
  const malas = PROHIBIDO.filter(r => r.test(src));
  if (!malas.length) bien('ni un nombre de producto, ni una cifra que envejece, ni un escape de Python');
  else malas.forEach(r => mal('en ia-descubre.js aparece ' + r));
  if (!/https?:\/\//.test(src)) bien('ninguna actividad manda a ninguna parte: todo corre dentro del teléfono'); else mal('hay una dirección web en las actividades');
}

/* El número de actividades se CUENTA, no se escribe: decía «las ocho» y ya
   son diez. Una sonda con el número dentro se pone roja —o miente— el día
   que entre una actividad nueva sin que nada esté roto. */
const ACTIVIDADES = 2 * MISIONES.length;
console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : `\n✅ Las ${ACTIVIDADES} actividades cumplen lo que prometen.\n`);
process.exit(fallos ? 1 : 0);
