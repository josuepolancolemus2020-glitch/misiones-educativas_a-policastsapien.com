/* Ficha de la misión 78 · Escenarios por venir · III Ciclo
   ⚠️ Esta ficha NO predice nada. Los nueve escenarios están inventados y lo
   dice el papel, porque el papel se fotocopia y se guarda un año en una
   gaveta: sin esa línea, dentro de doce meses alguien lo lee como si hubiera
   pasado. El motivo largo está en js/data/ia-futuros.js. */
'use strict';
const A = require('../arma-fichas-ia.js');
const { esc, arma, portada, preguntas, clave,
        IA_FUT_FECHA, IA_CAPACIDADES, IA_FUT_PIEZAS, IA_FUTUROS, IA_FUT_MANOS,
        iaFutAl, iaFutFinal } = A;

const EVAL = [
  { q: '¿Qué diferencia a un escenario de una profecía?', o: ['Que el escenario termina en una decisión y la profecía en un anuncio', 'Que el escenario es más largo', 'Que la profecía la dicen los expertos', 'Que el escenario habla del pasado'], a: 0 },
  { q: 'Un escenario tiene que estar hecho con…', o: ['Algo que ya se puede hacer hoy', 'Algo que se inventará pronto', 'Cifras exactas', 'Lo que diga la televisión'], a: 0 },
  { q: '«Esto es gravísimo para la sociedad» falla porque…', o: ['El precio no se puede contar', 'Es una frase corta', 'No trae emoji', 'Habla del futuro'], a: 0 },
  { q: '¿Qué pieza le falta a «la Inteligencia Artificial lo va a cambiar todo»?', o: ['La persona con nombre', 'El año', 'La firma', 'El título'], a: 0 },
  { q: 'El mismo programa en manos de una alcaldía y de una familia…', o: ['Alcanza a mucha más gente en la alcaldía', 'Cuesta lo mismo', 'Se arregla solo', 'No decide nada'], a: 0 },
  { q: '¿Qué hace la revisión?', o: ['Ver el fallo antes de que la decisión valga', 'Evitar que la máquina falle', 'Acelerar el programa', 'Bajar el precio'], a: 0 },
  { q: 'Cuando no se puede revisar todo, lo honesto es…', o: ['Decidir de antemano qué decisiones no valen sin una persona', 'Revisar al azar', 'Confiar en el programa', 'No comprar nada'], a: 0 },
  { q: 'Una predicción falla en una ladera donde no hay estación porque…', o: ['Donde nadie midió no hay con qué predecir', 'El programa es viejo', 'Llueve poco', 'Nadie sabe usarlo'], a: 0 },
  { q: 'Un programa que acierta casi siempre con lo común…', o: ['Es el que peor se porta con lo raro', 'Acierta también con lo raro', 'No sirve para nada', 'Nunca se equivoca'], a: 0 },
  { q: '¿Por qué los escenarios de esta ficha no traen la fecha en que pasarían?', o: ['Porque ponerle fecha a lo inventado ya es hacer una profecía', 'Porque no se sabe el año', 'Porque la pone el maestro', 'Porque las fechas envejecen'], a: 0 },
];

/* Las cuatro combinaciones de la actividad 3. Se eligen aquí y la pauta se
   CALCULA con iaFutFinal, así que el día que cambie una capacidad la hoja del
   docente cambia sola en vez de quedarse diciendo lo de antes. */
const COMBOS = [
  { cap: 'voz', mano: 'familia' },
  { cap: 'cara', mano: 'alcaldia' },
  { cap: 'texto', mano: 'escuela' },
  { cap: 'predice', mano: 'empresa' },
];

const P = [];

// ── Página 1 ───────────────────────────────────────────────────────────────
P.push(portada('Escenarios por venir',
  'Lo que podría pasar, pensado con método: nueve situaciones inventadas, las cuatro piezas que separan un escenario de una profecía, y de qué depende de verdad el final.',
  'qr-mision-escenarios-porvenir.png',
  ['Distinguir un <strong>escenario</strong> de una <strong>profecía</strong> en una frase cualquiera.',
   'Comprobar que un escenario está hecho con <strong>algo que ya se puede hacer</strong>.',
   'Exigir una <strong>persona con nombre</strong> y un <strong>precio que se cuente</strong>.',
   'Terminar un escenario en una <strong>decisión</strong>, no en un anuncio.',
   'Explicar por qué el final depende de <strong>en manos de quién</strong> y de <strong>quién revisa</strong>.',
   'Armar un escenario propio y someterlo a la prueba de las cuatro piezas.']) + `
    <h2>🛒 1. La frase con la que le vendieron un programa a la escuela</h2>

    <p>El patronato de una escuela va a comprar un programa que califica los exámenes de redacción.
       El vendedor lo presentó con una frase que a todos les pareció suficiente:
       <i>«en dos años ningún maestro va a calificar a mano»</i>. Aplaudieron y pasaron a votar.</p>

    <p>Nadie hizo la única pregunta que servía para algo: <b>¿qué hacemos el día que le ponga mal la nota
       a un alumno, y quién la revisa?</b> Son <b>L 12 000</b> de la caja de la escuela y la nota de
       <b>43 alumnos</b>. Esa pregunta no se hizo porque el vendedor no vendió un escenario:
       <b>vendió una profecía</b>.</p>

    <div class="dos">
      <div class="dB"><b>📣 Una profecía</b>
        <ul><li>Dice lo que <b>va a pasar</b>.</li>
            <li>No se puede incumplir nunca.</li>
            <li>Le pasa a «todo el mundo».</li>
            <li>Termina en un anuncio.</li>
            <li>No te pide nada.</li></ul>
      </div>
      <div class="dA"><b>🔮 Un escenario</b>
        <ul><li>Dice <b>qué harías vos</b> si pasara.</li>
            <li>Se desarma si le falla una pieza.</li>
            <li>Le pasa a alguien con nombre.</li>
            <li>Termina en una decisión.</li>
            <li>Te deja algo que hacer el día que llegue.</li></ul>
      </div>
    </div>

    <div class="caja aviso"><b>⚠️ Todo lo que sigue está INVENTADO, y hay que decirlo en voz alta en clase.</b>
      Ninguno de los nueve escenarios de esta ficha ha pasado. Tampoco traen la fecha en que pasarían:
      <b>ponerle fecha a lo inventado ya es hacer una profecía</b>, que es justamente lo que esta ficha
      enseña a reconocer. Escrita el <b>${esc(IA_FUT_FECHA)}</b>.</div>
`);

// ── Página 2 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🔧 2. Las cuatro piezas de un escenario</h2>

    <p>Son las que se pueden comprobar. Si le falta una, no sirve para decidir, y esa es toda la prueba:</p>

    <table>
      <tr><th style="width:26%">La pieza</th><th>La trae cuando…</th><th>Le falta cuando…</th></tr>
${IA_FUT_PIEZAS.map(p => `      <tr><td class="k">${p.e} ${esc(p.nombre)}</td><td>${esc(p.si)}</td><td>${esc(p.no)}</td></tr>`).join('\n')}
    </table>

    <h2>🍎 3. Con qué está hecho: lo que YA se puede hacer</h2>

    <p>Un escenario se apoya en cosas que existen. Y estas no se las contó nadie al alumno:
       <b>las produjo él</b> en las etapas anteriores de esta ruta.</p>

    <table>
      <tr><th style="width:30%">La capacidad</th><th style="width:34%">Dónde la produjiste</th><th>Cómo falla</th></tr>
${IA_CAPACIDADES.map(c => `      <tr><td class="k">${c.e} ${esc(c.que)}</td><td>Etapa ${c.etapa}. ${esc(c.donde)}</td><td>${esc(c.falla)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>Lo que todavía NO se puede hacer</b> —que una máquina sepa lo que sentís, que
      entienda lo que lee, que se dé cuenta de que se está equivocando o que responda ante un juez por lo
      que decidió— <b>no entra en un escenario</b>. Con eso se hace ciencia ficción, que está muy bien
      para otra cosa.</div>
`);

// ── Página 3 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🔮 4. Nueve escenarios para pensar</h2>

    <p>Todos inventados. Cada uno está armado con capacidades de la página anterior, le pasa a una
       persona con nombre y cuesta algo que se puede contar.</p>

    <table>
      <tr><th style="width:24%">El escenario</th><th style="width:16%">Le pasa a</th><th>Lo que cuesta</th><th style="width:20%">¿Con qué está hecho?</th></tr>
${IA_FUTUROS.map(e => `      <tr><td class="k">${e.e} ${esc(e.titulo)}</td><td>${esc(e.quien)}</td><td>${esc(e.cuesta)}</td><td><span class="linea-resp" style="min-width:85%"></span></td></tr>`).join('\n')}
    </table>

    <p><b>Actividad 1 · ¿Con qué está hecho cada uno?</b> <span class="val">(18 pts · 2 cada uno)</span>
       Escribí en la última columna la capacidad —o las dos— de la página anterior en que se apoya cada
       escenario. Si no te sale ninguna, ese escenario no sería un escenario.</p>
`);

// ── Página 4 ───────────────────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>⚖️ Actividad 2 · El mismo invento, en otras manos <span class="val">(20 pts)</span></h3>

      <p>Acá no cambia la máquina: cambia <b>quién la tiene</b> y <b>si alguien revisa antes de que la
         decisión valga</b>. Para cada fila, escribí a cuánta gente alcanza el fallo y quién revisaría.</p>

      <table>
        <tr><th style="width:22%">La capacidad</th><th style="width:20%">En manos de</th><th>Sin revisión, ¿a cuánta gente alcanza el fallo?</th><th style="width:26%">Con revisión, ¿quién la mira?</th></tr>
${COMBOS.map(c => {
  const cap = IA_CAPACIDADES.find(x => x.k === c.cap), m = IA_FUT_MANOS.find(x => x.k === c.mano);
  return `        <tr><td class="k">${cap.e} ${esc(cap.que)}</td><td>${m.e} ${esc(m.quien)}</td><td><span class="linea-resp" style="min-width:90%"></span></td><td><span class="linea-resp" style="min-width:90%"></span></td></tr>`;
}).join('\n')}
      </table>

      <p>Y la pregunta que de verdad importa: <b>¿qué cambió más el final, la máquina o quién la tiene?</b>
        <span class="linea-resp" style="min-width:100%"></span></p>

      <div class="caja regla"><b>Ojo con una trampa:</b> revisar <b>no sale gratis</b> y no se puede revisar
        todo. Cuando la decisión alcanza a un pueblo entero, lo honesto es decidir de antemano
        <b>qué decisiones no valen sin que una persona las mire</b>, y escribirlo antes de comprar el
        programa, no cuando ya falló.</div>
    </div>
`);

// ── Página 5 ───────────────────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>🔮 Actividad 3 · Armá el tuyo <span class="val">(sin respuesta, a propósito)</span></h3>

      <p>Hasta aquí leíste escenarios de otros. Ahora al revés. Llená las cuatro piezas y después marcá
         vos mismo si las cumple.</p>

      <div class="ilus">
        <div class="ilus-t">🔮 Mi escenario · escrito el <span class="linea-resp" style="min-width:130px"></span></div>
        <p><b>1. ¿Con qué está hecho?</b> (una capacidad de la página 2)
          <span class="linea-resp" style="min-width:75%"></span></p>
        <p><b>2. ¿A quién le pasa?</b> (un nombre, no «la gente»)
          <span class="linea-resp" style="min-width:75%"></span></p>
        <p><b>3. ¿Qué le cuesta?</b> (algo que se pueda contar: días, lempiras, clases, cosechas)
          <span class="linea-resp" style="min-width:100%"></span></p>
        <p><b>4. La situación</b>
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></p>
        <p><b>5. ¿Qué hay que decidir?</b> (escribilo como pregunta)
          <span class="linea-resp" style="min-width:100%"></span></p>
      </div>

      <table>
        <tr><th>La prueba de las cuatro piezas</th><th style="width:12%">Sí</th><th style="width:12%">No</th></tr>
${IA_FUT_PIEZAS.map(p => `        <tr><td>${p.e} ${esc(p.nombre)}</td><td></td><td></td></tr>`).join('\n')}
      </table>

      <p><b>Ahora llevalo a clase</b> y pedile a alguien que conteste tu pregunta. Si puede contestarla,
         es un escenario; si se queda mirando, todavía es un anuncio.</p>

      <div class="caja idea"><b>Esta actividad no trae respuesta y no es un descuido:</b> lo que se evalúa
        es que las cuatro piezas estén, no de qué trate. Y lo que la pauta no puede juzgar —si vale la
        pena— lo decide quien lo escribió.</div>
    </div>
`);

// ── Página 6 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}

    <div class="felic"><b>¡Bien hecho!</b> Lo que te llevás de aquí no es una opinión sobre el futuro: son
      cuatro preguntas que sirven hoy y dentro de veinte años. Con qué está hecho, a quién le pasa, qué le
      cuesta y qué hay que decidir.</div>
`);

// ── Página 7 · hoja del docente ────────────────────────────────────────────
P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Con qué está hecho (18 pts):</span>
        ${IA_FUTUROS.map(e => esc(e.titulo) + ': <b>' + e.apoya.map(k => esc(IA_CAPACIDADES.find(c => c.k === k).que.toLowerCase())).join(' + ') + '</b>').join(' · ')}.
        Se acepta cualquiera de las dos cuando el escenario se apoya en dos. Lo que no se acepta es una
        capacidad que todavía no exista: ahí el alumno confundió escenario con ciencia ficción.</div>
      <div><span class="pt">Actividad 2 · En otras manos (20 pts):</span>
        ${COMBOS.map(c => {
          const sin = iaFutFinal(c.cap, c.mano, false), con = iaFutFinal(c.cap, c.mano, true);
          return esc(sin.mano.quien) + ': alcanza <b>' + esc(sin.mano.alcance) + '</b>; revisa <b>' + esc(con.mano.revisor) + '</b>';
        }).join(' · ')}.
        <b>Y la respuesta de la pregunta final es «quién la tiene»</b>, no la máquina: es lo que hay que
        subrayar en clase, porque es lo único de todo esto que se puede cambiar antes de comprar nada.</div>
      <div><span class="pt">Actividad 3 · Armá el tuyo:</span> <b>no lleva respuesta a propósito.</b> Se
        valora que las cuatro piezas estén: una capacidad que ya exista, un nombre propio, un precio que se
        cuente y una pregunta. Un escenario con «la gente» o con «es grave» no está terminado, aunque el
        tema sea bueno.</div>
    </div>

    <div class="nota-doc">
      <b>Para qué sirve esta ficha, y qué NO hay que enseñar de más.</b> Es la etapa 7 de la Ruta de la
      Máquina que Aprende y la que enseña a pensar lo que todavía no pasó. Su regla es la que sostiene
      todo lo demás: <b>aquí no se predice nada</b>. Los nueve escenarios están inventados, se dice que lo
      están, y ninguno trae la fecha en que pasaría. Un maestro que sienta la tentación de decir cuándo va
      a pasar algo conviene que recuerde qué le costó a la escuela del patronato creerle a una frase sin
      fecha.
      <br><br>
      <b>Y la lección que más vale no es ninguno de los nueve: es la actividad 2.</b> La máquina es la
      misma en las cuatro manos. Lo que cambia el final es a cuánta gente alcanza la decisión y si alguien
      puede mirarla antes de que valga. Eso es lo que un patronato, una alcaldía o una Dirección Distrital
      SÍ pueden decidir, y casi siempre deciden sin saber que lo están decidiendo.
      <br><br>
      <b>Falta un escenario a propósito:</b> el del examen que se califica solo —el del español de
      Honduras— está en la etapa 4 de esta ruta y no se repite aquí. Si la clase lo pide, se lee allá.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>. El marco,
      las expectativas de logro que cumple y lo que a propósito NO se enseña están en
      <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>; cómo se hace la siguiente misión de esta ruta, en
      <b>COMPENDIO-MISIONES-IA.md</b>.
    </div>
`);

arma('fichas/ficha-escenarios-porvenir.html', 'Escenarios por venir', P);
