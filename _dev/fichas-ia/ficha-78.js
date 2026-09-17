/* Ficha de la misión 78 · Escenarios por venir · III Ciclo
   ──────────────────────────────────────────────────────────────────────────
   ⚠️ ESTA FICHA SE REHIZO ENTERA cuando se rehizo la misión. La primera
   enseñaba a distinguir un escenario de una profecía con nueve situaciones
   inventadas. El autor pidió otra cosa: lo que viene con la Inteligencia
   Artificial EN EL TRABAJO Y EN EL ESTUDIO. El motivo largo está en
   js/data/ia-futuros.js.

   ⚠️ NI UN NÚMERO ESCRITO A MANO. Los porcentajes por clase de tarea, los de
   cada oficio y los de las tareas de clase salen de `iaOfiPorTipo()`,
   `iaOfiCuenta()` y `iaClaseCuenta()`, que son las MISMAS funciones que pinta
   la pantalla. Escribirlos aquí sería garantizar que un día el papel y el
   teléfono digan cosas distintas, y el maestro corregiría por el viejo.

   ⚠️ LAS 51 TAREAS SE IMPRIMEN UNA SOLA VEZ, y en la actividad. La pantalla
   puede permitirse enseñarlas ya clasificadas Y volver a pedirlas en Descubre;
   el papel no: serían dos hojas más por alumno, o sea 86 hojas más en un grado
   de 43. Así que la ficha enseña el método con UN oficio resuelto —don Chele,
   que es el de la advertencia de las horas— y las otras siete las clasifica el
   alumno. Es la regla de siempre: el alumno lo PRODUCE, no lo lee. El veredicto
   y el «con qué» de esas 44 van en la hoja del docente, CALCULADOS del archivo.

   ⚠️ CADA BLOQUE DE PRIMER NIVEL TIENE QUE PODER MOVERSE SOLO.
   `reparte-hojas-ficha.js` reparte los hijos directos de `.contenido`, así que
   un `<div class="acts">` que envuelva cuatro oficios es UN bloque de 287 mm
   que no cabe en ninguna hoja. Aquí cada rótulo va con su tabla en su propio
   `.acts`: el reparto encuentra el mínimo y la hoja no se parte.

   ⚠️ Y se escribe en lenguaje llano: frases de 25 palabras como mucho,
   párrafos de 45, una idea por frase. Esta hoja la fotocopia un maestro para
   alumnos de cuarto y para jóvenes de bachillerato. Lo mide
   `node _dev/verifica-legibilidad-ia.js`, que está en `npm test`. */
'use strict';
const path = require('path');
const A = require('../arma-fichas-ia.js');
const { esc, arma, portada, preguntas, clave, IA_CAPACIDADES, IA_FUT_PIEZAS, IA_FUT_FECHA } = A;

/* Lo nuevo del archivo de datos se pide aquí y no al armador: el armador
   exporta lo que exportaba, y una ficha no tiene por qué obligar a las otras
   seis a recargarse por lo suyo. */
const F = require(path.join(A.RAIZ, 'js/data/ia-futuros.js'));
const { IA_CUENTA, IA_OFI_TIPOS, IA_OFICIOS, IA_ESCUDOS, IA_TAREAS_CLASE, IA_ESTUDIO,
        iaOfiPorTipo, iaOfiCuenta, iaOfiTotalTareas, iaClaseCuenta } = F;

/* ── Piezas de dibujo ──────────────────────────────────────────────────────
   El círculo que el alumno RELLENA. Nunca la ✗: en el aula la ✗ es la marca de
   lo que está MAL, y pedirla para señalar lo correcto enseña dos cosas
   contrarias con el mismo signo. Va en línea porque el CSS común solo lo trae
   dentro de `.preg-ops`, y esta ficha lo necesita dentro de sus tablas. */
const CIR = '<span style="display:inline-block;width:11px;height:11px;border:1.3px solid #333;border-radius:50%;"></span>';
const raya = ancho => `<span class="linea-resp" style="min-width:${ancho}"></span>`;
/* ⚠️ La celda destacada del CSS común (`td.k`) lleva `white-space: nowrap`, y
   con anchos automáticos eso MANDA: una celda con «El que lleva las cuentas de
   la cooperativa» estira su columna y aplasta a las demás. La fila sale en tres
   renglones donde cabía en dos, y la tabla de lo que cambia en la escuela medía
   183 mm en vez de 88. El nowrap está pensado para celdas de una palabra; aquí
   casi todas son frases, así que se las deja envolver. */
const tdk = html => `<td class="k" style="white-space:normal">${html}</td>`;

/* El veredicto, con los mismos tres dibujos que la pantalla. */
const SIG = { si: '🤖', medias: '🤝', no: '🧑' };
const ETIQ = { si: 'Se la lleva', medias: 'A medias', no: 'No puede' };

/* ⚠️ La clave de cada capacidad SALE DE SU POSICIÓN en el archivo, no se
   escribe. Si mañana entra una capacidad nueva, las letras se corren solas y
   la pauta del docente se corre con ellas. Escribirlas a mano sería dejar la
   hoja del docente apuntando a la capacidad de al lado. La G se salta a
   propósito: es la de «esto ya lo hacía una computadora normal», que no es una
   capacidad de Inteligencia Artificial y por eso vive aparte en el archivo. */
const LETRAS = 'ABCDEFHIJK';
const LETRA_CUENTA = 'G';
const capLetra = k => {
  const i = IA_CAPACIDADES.findIndex(c => c.k === k);
  return i >= 0 ? LETRAS[i] : (k === IA_CUENTA.k ? LETRA_CUENTA : '—');
};
/* La tarea que la máquina NO se lleva no trae «con qué», y eso no es un hueco:
   es la respuesta. */
const conQue = t => (t.maquina === 'no' ? '' : capLetra(t.como));

/* El oficio que va resuelto como ejemplo. Es el de la advertencia de las
   horas, así que la advertencia cae donde se entiende. */
const EJEMPLO = 'agricultor';
const ofiEjemplo = IA_OFICIOS.find(o => o.k === EJEMPLO);
const ofiRestantes = IA_OFICIOS.filter(o => o.k !== EJEMPLO);
const tipoDe = k => IA_OFI_TIPOS.find(t => t.k === k);
const nEjemplo = iaOfiCuenta(EJEMPLO);
const porTipo = iaOfiPorTipo();
const cl = iaClaseCuenta();

/* Una tabla de la actividad 1: el rótulo del oficio y sus tareas, en su propio
   bloque para que el reparto pueda moverla sola. */
const tablaOficio = o => `    <div class="acts">
      <h3>${o.e} ${esc(o.nombre)} · ${esc(o.quien)}</h3>
      <table>
        <tr><th style="width:39%">La tarea</th><th style="width:23%">Clase</th><th style="width:7%">${SIG.si}</th><th style="width:7%">${SIG.medias}</th><th style="width:7%">${SIG.no}</th><th>Con qué</th></tr>
${o.tareas.map(t => `        <tr><td>${esc(t.t)}</td><td>${tipoDe(t.tipo).e} ${esc(tipoDe(t.tipo).nombre)}</td><td>${CIR}</td><td>${CIR}</td><td>${CIR}</td><td>${raya('80%')}</td></tr>`).join('\n')}
      </table>
    </div>`;

const EVAL = [
  { q: '¿Qué se lleva la máquina?', o: ['Oficios enteros', 'Tareas sueltas de un oficio', 'Solo el trabajo de oficina', 'Nada todavía'], a: 1 },
  { q: 'La pregunta que sirve para elegir qué estudiar es…', o: ['¿De qué tareas está hecho ese oficio?', '¿Ese oficio se salva?', '¿Qué dicen en el grupo?', '¿Cuánto paga?'], a: 0 },
  { q: '¿Qué clase de tarea se lleva casi entera?', o: ['Las de manos', 'Las de estar con alguien', 'Las de papel', 'Ninguna'], a: 2 },
  { q: '¿Cuál casi no toca?', o: ['Las de mirar', 'Las de manos', 'Las de papel', 'Las de sumar'], a: 1 },
  { q: 'Contar tareas no es lo mismo que contar…', o: ['Personas', 'Oficios', 'Dinero', 'Horas'], a: 3 },
  { q: 'Sumar, ordenar y buscar en una lista es…', o: ['Algo que una computadora normal ya hacía', 'Inteligencia Artificial recién salida', 'Imposible para una máquina', 'Cosa de robots'], a: 0 },
  { q: 'Una tarea de clase que la máquina no puede entregar…', o: ['Es más larga', 'Es más difícil', 'Lleva por lo menos un escudo', 'La pone el director'], a: 2 },
  { q: '¿Cuál de estas cuatro lleva escudo?', o: ['Copiá la definición de adjetivo', 'Escribí un resumen', 'Resolvé veinte ejercicios', 'Medí tu patio y sacá su área'], a: 3 },
  { q: 'Copiar la tarea dejó de servir porque…', o: ['Está prohibido', 'Al examen llegás igual que si no la hubieras hecho', 'La máquina se equivoca siempre', 'El maestro se da cuenta'], a: 1 },
  { q: '«En dos años la máquina lo hará todo» no sirve porque…', o: ['Es muy corta', 'Nadie la dijo', 'No le pasa a nadie con nombre ni termina en una decisión', 'Habla de computadoras'], a: 2 },
];

const P = [];

// ── Página 1 · la portada y Katy ───────────────────────────────────────────
P.push(portada('Escenarios por venir',
  'Qué tareas de un oficio se lleva la máquina y cuáles no. Y qué cambia en la escuela.',
  'qr-mision-escenarios-porvenir.png',
  ['Explicar que un oficio es un <strong>montón de tareas</strong>, no una cosa.',
   'Nombrar las <strong>cuatro clases de tarea</strong> y poner una tarea en la suya.',
   'Decir <strong>con qué</strong> se lleva la máquina cada tarea.',
   'Separar la Inteligencia Artificial de lo que <strong>ya hacía una computadora</strong>.',
   'Reconocer los <strong>tres escudos</strong> de una tarea de clase.',
   'Desarmar la frase «en dos años…» con <strong>cuatro piezas</strong>.']) + `
    <h2>🎓 1. «¿Y para qué estudio?»</h2>

    <p><b>Katy</b> termina noveno en noviembre. En el grupo del colegio le dicen dos cosas al mismo
       tiempo. Una: <i>«estudiá computación, que es el futuro»</i>. La otra: <i>«no estudiés eso, la
       máquina lo va a hacer todo»</i>.</p>

    <p>Las dos suenan seguras. Ninguna le dice qué hacer. Y lo que decide son <b>tres años</b> de su vida
       y la <b>matrícula</b> que su familia junta vendiendo pan.</p>

    <div class="caja idea"><b>Nadie le hizo la pregunta que sirve:</b> ¿de qué tareas está hecho ese
      oficio? Eso sí se puede mirar, y es lo que vas a hacer acá. Aquí no hay ninguna fecha de lo que va a
      pasar: esta ficha mira lo que la máquina YA hace. Escrita el <b>${esc(IA_FUT_FECHA)}</b>.</div>
`);

// ── Página 2 · las cuatro clases y las siete claves ────────────────────────
P.push(`
    <h2>🧰 2. Un oficio no es UNA cosa</h2>

    <p>Un oficio es un montón de tareas distintas. Un albañil calcula, mira, levanta y discute con el
       dueño. <b>La máquina no se lleva oficios: se lleva tareas.</b> Y no se lleva cualquiera.</p>

    <table>
      <tr><th style="width:32%">La clase de tarea</th><th>Qué quiere decir</th></tr>
${IA_OFI_TIPOS.map(t => `      <tr>${tdk(`${t.e} ${esc(t.nombre)}`)}<td>${esc(t.que)}</td></tr>`).join('\n')}
    </table>

    <h2>🍎 3. Con qué se las lleva</h2>

    <p>No es magia. Son seis cosas, y <b>las produjiste vos</b> en las etapas anteriores. La letra de la
       izquierda la vas a usar en la actividad.</p>

    <table>
      <tr><th style="width:5%"></th><th style="width:38%">Qué puede hacer</th><th>Dónde la produjiste vos, y cómo falla</th></tr>
${IA_CAPACIDADES.map((c, i) => `      <tr><td class="k">${LETRAS[i]}</td>${tdk(`${c.e} ${esc(c.que)}`)}<td>Etapa ${c.etapa}. ${esc(c.donde)} Falla así: ${esc(c.falla)}.</td></tr>`).join('\n')}
    </table>

    <div class="caja truco"><b>${LETRA_CUENTA} · ${IA_CUENTA.e} ${esc(IA_CUENTA.que)}.</b> ${esc(IA_CUENTA.donde)}
      Quien te venda eso como nuevo te está vendiendo humo de hace sesenta años.</div>
`);

// ── Página 3 · un oficio resuelto, y la advertencia de las horas ───────────
P.push(`
    <h2>${ofiEjemplo.e} 4. Un oficio por dentro: ${esc(ofiEjemplo.quien)}</h2>

    <p>Así se desarma un oficio: ${esc(ofiEjemplo.nombre)}, tarea por tarea. Mirá la última columna. Cada
       tarea que la máquina se lleva dice <b>con qué</b>.</p>

    <table>
      <tr><th style="width:24%">La tarea</th><th style="width:15%">Clase</th><th style="width:13%">¿Se la lleva?</th><th>Por qué</th><th style="width:6%">Con qué</th></tr>
${ofiEjemplo.tareas.map(t => `      <tr>${tdk(esc(t.t))}<td>${tipoDe(t.tipo).e} ${esc(tipoDe(t.tipo).nombre)}</td><td>${SIG[t.maquina]} ${esc(ETIQ[t.maquina])}</td><td>${esc(t.porque)}</td><td class="k">${conQue(t)}</td></tr>`).join('\n')}
    </table>

    <div class="caja regla"><b>Si no se puede decir con qué, no se la lleva.</b> Esa columna es la que
      separa esto de la publicidad. Una máquina que «lo hace todo» no existe en ninguna parte.</div>

    <div class="caja aviso"><b>⚠️ Esto cuenta tareas, no horas.</b> A ${esc(ofiEjemplo.quien)} la máquina
      se le lleva ${nEjemplo.si} tareas enteras de ${nEjemplo.total}. Le quedan ${nEjemplo.no} enteras y
      ${nEjemplo.medias} a medias, y esas son las que se llevan todo el día. Un porcentaje que se lee mal
      enseña peor que ninguno.</div>
`);

// ── Página 4 · lo que sale de contarlas todas ──────────────────────────────
P.push(`
    <h2>📊 5. Lo que sale de contar las ${iaOfiTotalTareas()}</h2>

    <p>Los ${IA_OFICIOS.length} oficios de esta ficha tienen ${iaOfiTotalTareas()} tareas entre todos.
       Contadas una por una y repartidas por clase, sale esto:</p>

    <table>
      <tr><th style="width:32%">La clase de tarea</th><th style="width:22%">Cuántas hay</th><th>Cuánto se lleva la máquina</th></tr>
${porTipo.map(t => `      <tr>${tdk(`${t.e} ${esc(t.nombre)}`)}<td>${t.total} tareas</td><td><b>${t.pct} %</b></td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>Se lleva casi todo lo de papel y casi todo lo de mirar.</b> Casi nada de lo
      de manos ni de lo de estar con alguien. Eso no lo dice nadie: sale de contar.</div>

    <h2>🧰 6. Ningún oficio se va entero</h2>

    <p>Y ninguno se salva entero. Mirá cuánto pierde cada uno. Con esta tabla vas a comparar tu
       actividad:</p>

    <table>
      <tr><th style="width:32%">El oficio</th><th style="width:22%">Quién lo hace</th><th style="width:26%">Sobre todo es…</th><th>Se lleva</th></tr>
${IA_OFICIOS.map(o => { const n = iaOfiCuenta(o.k); const ti = tipoDe(o.clase); return `      <tr>${tdk(`${o.e} ${esc(o.nombre)}`)}<td>${esc(o.quien)}</td><td>${ti.e} ${esc(ti.nombre)}</td><td><b>${n.pct} %</b> de ${n.total}</td></tr>`; }).join('\n')}
    </table>

    <div class="caja regla"><b>Y esta es la respuesta para Katy.</b> Ninguno llega a cero y ninguno llega a
      cien. Todos cambian de forma; ninguno desaparece. Así que no preguntés si tu oficio se salva.
      Preguntá de qué tareas está hecho.</div>
`);

// ── Página 5 · la escuela ──────────────────────────────────────────────────
P.push(`
    <h2>📚 7. Y en la escuela, ¿qué cambia?</h2>

    <p>Cinco cosas. Tres son malas noticias para el que copia. Dos son buenas para el que estudia.</p>

    <table>
      <tr><th style="width:30%">Qué cambia</th><th>Qué quiere decir, y qué hacés con eso</th></tr>
${IA_ESTUDIO.map(x => `      <tr>${tdk(`${x.e} ${esc(x.titulo)}`)}<td>${esc(x.que)} ${esc(x.hoy)}</td></tr>`).join('\n')}
    </table>

    <h2>🛡️ 8. Los tres escudos de una tarea</h2>

    <p>Hay tareas de clase que la máquina no puede entregar hechas. Llevan una de estas tres cosas:</p>

    <table>
      <tr><th style="width:30%">El escudo</th><th style="width:36%">Qué le pide a la tarea</th><th>Por qué para a la máquina</th></tr>
${IA_ESCUDOS.map(e => `      <tr>${tdk(`${e.e} ${esc(e.nombre)}`)}<td>${esc(e.que)}</td><td>${esc(e.porque)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>No son castigos del maestro.</b> Son las tres cosas que a la máquina le
      faltan, y por eso sirven.</div>

    <h2>🔮 9. Y cuando te digan «en dos años…»</h2>

    <p>Esa frase le costó la matrícula a Marvin en la etapa anterior. Se desarma con cuatro piezas. Un
       <b>escenario</b> sirve para decidir; una <b>profecía</b> te deja mirando.</p>

    <table>
      <tr><th style="width:26%">La pieza</th><th>La trae cuando…</th><th>Le falta cuando…</th></tr>
${IA_FUT_PIEZAS.map(p => `      <tr>${tdk(`${p.e} ${esc(p.nombre)}`)}<td>${esc(p.si)}</td><td>${esc(p.no)}</td></tr>`).join('\n')}
    </table>

    <div class="caja truco"><b>Escribí una frase así que hayas oído vos:</b> ${raya('88%')}
      Y rellená el círculo de las piezas que trae: ${IA_FUT_PIEZAS.map(p => `${CIR} ${p.e} ${esc(p.nombre)}`).join(' &nbsp;·&nbsp; ')}</div>
`);

// ── Página 6 · Actividad 1 · los cuatro primeros oficios ───────────────────
P.push(`
    <div class="acts">
      <h3>🧰 Actividad 1 · Un oficio, tarea por tarea <span class="val">(30 pts)</span></h3>
      <p><b>Elegí UN oficio</b>, el que te gustaría tener, y hacelo entero. En el aula no lo hacen todos
         con el mismo, y después se comparan.</p>
      <p>En cada tarea, <b>rellená el círculo</b> que te parezca: ${SIG.si} se la lleva, ${SIG.medias} a
         medias, ${SIG.no} no puede. Si marcaste una de las dos primeras, escribí <b>con qué</b>. Es la
         letra de la tabla 3, o una <b>${LETRA_CUENTA}</b> si eso ya lo hacía una computadora normal.</p>
      <p><b>Las claves, para no volver atrás:</b>
         ${IA_CAPACIDADES.map((c, i) => `<b>${LETRAS[i]}</b> ${c.e} ${esc(c.corto)}`).join(' &nbsp;·&nbsp; ')}
         &nbsp;·&nbsp; <b>${LETRA_CUENTA}</b> ${IA_CUENTA.e} ${esc(IA_CUENTA.corto)}</p>
    </div>

    <div class="caja regla"><b>Cuando termines, contá las tuyas</b> y comparalas con la tabla «Ningún
      oficio se va entero». Si te da muy distinto, volvé a mirar las tareas de papel.</div>

${ofiRestantes.slice(0, 4).map(tablaOficio).join('\n\n')}
`);

// ── Página 7 · Actividad 1 · los tres últimos ──────────────────────────────
P.push(`
${ofiRestantes.slice(4).map(tablaOficio).join('\n\n')}

    <div class="acts">
      <p>Del oficio que elegiste: ¿cuántas tareas se lleva enteras? ${raya('70px')} ¿Cuántas le quedan?
         ${raya('70px')}</p>
      <p>Y la pregunta que de verdad importa. ¿Qué tienen en común las que le quedan?
         ${raya('100%')}</p>
    </div>
`);

// ── Página 8 · Actividad 2 ─────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>📚 Actividad 2 · ¿Se puede copiar esta tarea? <span class="val">(30 pts)</span></h3>
      <p>${cl.total} tareas de clase. <b>Rellená un círculo en cada una</b>: ¿la puede entregar una
         máquina, hecha y bien? Si no puede, escribí qué escudo la para.</p>
      <table>
        <tr><th style="width:50%">La tarea de clase</th><th style="width:11%">🤖 La copia</th><th style="width:11%">🧑 No puede</th><th>¿Qué escudo la para?</th></tr>
${IA_TAREAS_CLASE.map(t => `        <tr><td>${esc(t.t)}</td><td>${CIR}</td><td>${CIR}</td><td>${raya('85%')}</td></tr>`).join('\n')}
      </table>
      <p>¿Cuántas copia la máquina? ${raya('60px')} ¿Cuántas no? ${raya('60px')}</p>
    </div>

    <div class="acts">
      <h3>✍️ Y ahora escribí vos una <span class="val">(sin respuesta, a propósito)</span></h3>
      <p>Escribí una tarea de clase que la máquina <b>no te pueda hacer</b>. Tiene que llevar un escudo.
         Después rellená el círculo del escudo que la para.</p>
      <div class="ilus">
        <div class="ilus-t">✍️ Mi tarea</div>
        <p>${raya('100%')}</p>
        <p>${raya('100%')}</p>
        <p><b>El escudo que la para:</b> ${IA_ESCUDOS.map(e => `${CIR} ${e.e} ${esc(e.nombre)}`).join(' &nbsp;·&nbsp; ')}</p>
        <p><b>Por qué no la puede hacer:</b> ${raya('100%')}</p>
      </div>
    </div>

    <div class="caja idea"><b>Esta última no lleva respuesta a propósito.</b> No la hay. Se evalúa que la
      tarea sea de verdad y que el escudo le calce. Llevala a clase y probala con alguien.</div>
`);

// ── Página 9 · evaluación ──────────────────────────────────────────────────
P.push(`
    <h2>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}

    <div class="felic"><b>¡Bien hecho!</b> De aquí te llevás una pregunta que sirve toda la vida. No es
      «¿mi oficio se salva?». Es <b>«¿de qué tareas está hecho?»</b>.</div>
`);

// ── Página 10 · hoja del docente ───────────────────────────────────────────
/* ⚠️ ES UNA SOLA HOJA, Y TIENE QUE CABER ELLA SOLA. `reparte-hojas-ficha.js`
   deja fuera del reparto la ÚLTIMA hoja y solo esa (`doc.paginas.slice(0, -1)`),
   porque la del docente se imprime suelta y no se fotocopia. Partir la pauta en
   dos hojas dejaría la de arriba DENTRO del reparto, y la clave de respuestas
   acabaría impresa al pie de la hoja de examen del alumno. Así que cuando esta
   hoja se pasa del papel no se parte: se le quita aire. Midió 281,9 mm y de ahí
   salieron estos recortes. */
P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Un oficio, tarea por tarea (30 pts):</span> el veredicto de cada
        tarea, en el orden impreso (${SIG.si} se la lleva · ${SIG.medias} a medias · ${SIG.no} no puede) y
        la letra del <b>con qué</b>. Cada alumno hace un oficio: son seis o siete tareas.
${ofiRestantes.map(o => `        <br><b>${o.e} ${esc(o.nombre)}</b> — ` +
  o.tareas.map((t, i) => `${i + 1} ${SIG[t.maquina]}${conQue(t) ? ' ' + conQue(t) : ''}`).join(' · ')).join('\n')}
        <br><i>Y lo que hay que decir en voz alta: lo que le queda a cada oficio es de manos o de estar
        con alguien, y no es lo que sobra. Es lo que nadie más puede hacer.</i></div>
      <div><span class="pt">Actividad 2 · ¿Se puede copiar esta tarea? (30 pts):</span> la máquina entrega
        <b>${cl.copiables}</b> de ${cl.total}; las otras <b>${cl.protegidas}</b> no puede. Todas las que no
        se copian llevan por lo menos un escudo, y ninguna de las que se copian lleva ninguno
        (${cl.porEscudo.map(e => `${e.e} ${esc(e.nombre)}, en ${e.cuantas}`).join(' · ')}).
        <br>🤖 <b>Las copia:</b> ${IA_TAREAS_CLASE.filter(t => t.copia).map(t => esc(t.t)).join(' · ')}.
        <br>🧑 <b>No puede, y con qué escudo:</b> ${IA_TAREAS_CLASE.filter(t => !t.copia).map(t => esc(t.t) + ' <i>(' + t.escudos.map(k => esc(IA_ESCUDOS.find(e => e.k === k).nombre.toLowerCase())).join(' + ') + ')</i>').join(' · ')}.</div>
      <div><span class="pt">✍️ La tarea que escribe el alumno:</span> <b>no lleva respuesta a
        propósito.</b> No la hay: es de producir, no de acertar. Sin este aviso se lee como un descuido y
        se salta, que es la mitad que más vale. Se valora que la tarea sea real y que el escudo le calce.</div>
    </div>

    <div class="nota-doc">
      <b>Para qué sirve esta ficha, y qué NO hay que enseñar de más.</b> Es la etapa 7 de la Ruta de la
      Máquina que Aprende, y la que contesta la pregunta de Katy. <b>Aquí no se predice nada</b>: no hay
      ni un año de lo que va a pasar, y no se le dice a nadie qué estudiar. Se le da la pregunta.
      <br><br>
      <b>Los números no están escritos: se calculan.</b> Los porcentajes por clase de tarea, los de cada
      oficio y los de las tareas de clase salen de las mismas funciones que pinta la pantalla
      (<b>js/data/ia-futuros.js</b>). Por eso el papel y el teléfono no pueden decir cosas distintas.
      <br><br>
      <b>Y la honestidad que no se puede saltar: esto cuenta tareas, no horas.</b> A
      ${esc(ofiEjemplo.quien)} le quedan pocas tareas y le ocupan la jornada entera. Conviene decirlo
      antes de que alguien lea el porcentaje como si fuera un sueldo.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>. El marco y
      lo que a propósito NO se enseña están en <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>; cómo se hace
      la siguiente misión de esta ruta, en <b>COMPENDIO-MISIONES-IA.md</b>.
    </div>
`);

arma('fichas/ficha-escenarios-porvenir.html', 'Escenarios por venir', P);
