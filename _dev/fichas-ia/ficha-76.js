/* Ficha de la misión 76 · Los Peligros de la Inteligencia Artificial · III Ciclo */
'use strict';
const A = require('../arma-fichas-ia.js');
const { esc, arma, portada, preguntas, clave, tablaReglas,
        IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS, IA_MENSAJES } = A;
/* Las cuentas de las dos actividades de Descubre: la pauta se CALCULA de aquí,
   no se escribe, igual que en las otras cuatro fichas de la ruta. */
const D = require('../../js/data/ia-descubre.js');

/* ⚠️ La prosa de esta ficha se escribe en lenguaje llano: frases de 25 palabras
   como mucho, párrafos de 45, una idea por frase. Lo mide
   `node _dev/mide-legibilidad.js misiones/3ciclo-peligros-ia --detalle`, y la
   misma hoja la fotocopia un maestro para alumnos de cuarto. */

const EVAL = [
  { q: '¿Cuáles son las tres señales de casi toda estafa?', o: ['Urgencia, secreto y canal nuevo', 'Faltas de ortografía y emojis', 'Un número largo y un enlace', 'Que llegue de noche y por audio'], a: 0 },
  { q: 'Un audio con la voz de tu mamá pide dinero a un número nuevo. ¿Qué hacés?', o: ['Le contesto por audio', 'Cuelgo y la llamo al número de siempre', 'Reconozco su voz y lo mando', 'Le pregunto algo que solo ella sabe'], a: 1 },
  { q: 'Un programa acierta el 95 %. ¿Qué NO dice ese número?', o: ['Cuántas veces acertó', 'A quién le cae el error', 'Cuántos casos revisó', 'Que a veces se equivoca'], a: 1 },
  { q: '¿Por qué una palabra escrita en un grupo deja de servir?', o: ['Porque se olvida', 'Porque la lee cualquiera del grupo', 'Porque caduca al mes', 'Porque cambia sola'], a: 1 },
  { q: '¿De qué está hecha casi toda estafa creíble?', o: ['De tecnología muy cara', 'De lo que la familia publicó', 'De suerte', 'De un día festivo'], a: 1 },
  { q: 'Subir al grupo la foto del salón con los nombres es…', o: ['Una foto normal', 'Publicar datos de treinta personas', 'Un problema de espacio', 'Cosa de la aplicación'], a: 1 },
  { q: 'Un chat que siempre te da la razón está…', o: ['Cuidándote', 'Prediciendo lo que encaja con lo tuyo', 'Comprobando datos', 'Aprendiendo a quererte'], a: 1 },
  { q: 'La pregunta que desarma «Deciden por vos» es…', o: ['¿Con qué ejemplos, y a quién le cae el error?', '¿Cuánto cuesta?', '¿Es rápido?', '¿Lo usan mis amigos?'], a: 0 },
  { q: 'Un aviso del maestro sin prisa ni secreto, por el grupo de siempre, es…', o: ['Sospechoso', 'Un mensaje normal', 'Una estafa disimulada', 'Una prueba'], a: 1 },
  { q: 'Reenviar un video sin comprobarlo es…', o: ['Ayudar a avisar', 'Parte del daño', 'Algo neutral', 'Obligatorio en un grupo'], a: 1 },
];

/* Las cinco defensas del simulador, con su veredicto ya calculado. */
const VEREDICTO = { si: '✅ Sí lo para', no: '❌ No lo para', medias: '⚠️ A medias' };

const P = [];

// ── Página 1 ───────────────────────────────────────────────────────────────
P.push(portada('Los Peligros de la Inteligencia Artificial',
  'Cómo se llama cada peligro y qué pregunta lo desarma: las tres señales, las cuatro familias y el botiquín.',
  'qr-mision-peligros-ia.png',
  ['Nombrar las <strong>tres señales</strong> y usarlas en diez segundos.',
   'Poner un peligro en su <strong>familia</strong> y decir qué pregunta lo desarma.',
   'Explicar por qué <strong>una voz ya no es una prueba</strong>, y qué sí lo es.',
   'Descubrir qué esconde un <strong>promedio de aciertos</strong> alto.',
   'Separar un mensaje con señales de uno <strong>normal</strong>.',
   'Armar su <strong>plan de defensa</strong> con la familia.']) + `
    <h2>🚨 1. Las tres señales</h2>

    <p>La tecnología del engaño cambia todos los años. <strong>Estas tres no</strong>: sin ellas el engaño no
       funciona. Quien engaña necesita que <strong>no pienses</strong>, que <strong>no consultes</strong> y
       que <strong>no contestes por donde siempre</strong>.</p>

    <table>
      <tr><th style="width:22%">La señal</th><th>Cómo suena</th><th style="width:34%">Qué se hace</th></tr>
${IA_SENALES.map(s => `      <tr><td class="k">${s.emoji} ${esc(s.nombre)}</td><td>${esc(s.suena)}<br><i>${esc(s.porque)}</i></td><td>${esc(s.defensa)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>Y al revés:</b> un mensaje sin ninguna de las tres suele ser normal.
      <b>Desconfiar de todo cuesta lo mismo que creerlo todo</b>: el día que el aviso sea de verdad, no lo
      lee nadie.</div>
`);

// ── Página 2 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🧯 2. Un peligro no es «la máquina es mala»</h2>

    <p>Eso no defiende a nadie. Un peligro es un <strong>mecanismo</strong> que se puede nombrar. Y cada
       mecanismo tiene <strong>una pregunta que lo desarma</strong>. Son cuatro familias. No se reparten por
       la tecnología, que cambia, sino por <strong>lo que te quitan</strong>:</p>

${IA_FAMILIAS.map(f => `    <div class="cficha"><div class="cf-tit">${f.emoji} ${esc(f.nombre)}</div><div class="cf-def">${esc(f.que)}</div><div class="cf-ej">❓ La pregunta que lo desarma: <b>${esc(f.pregunta)}</b></div></div>`).join('\n')}

    <div class="caja aviso"><b>Los casos de esta ficha están escritos para ella.</b> Ninguno lleva el nombre
      de nadie real: en un pueblo, un caso con nombres es alguien. Por eso dos peligros van <b>sin caso</b>:
      el del remedio y el de la opinión fabricada.</div>
`);

// ── Página 3 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>📋 3. El catálogo: los trece, con su pregunta</h2>

    <p>Una tabla por familia. <strong>Marcá con una ✗ los cuatro que te puedan pasar a vos este año</strong>
       y copialos en tu cuaderno con su pregunta.</p>

${IA_FAMILIAS.map(f => `    <div class="ilus"><div class="ilus-t">${f.emoji} ${esc(f.nombre)} — ❓ ${esc(f.pregunta)}</div>
    <table>
      <tr><th style="width:4%"></th><th style="width:26%">El peligro</th><th>Qué hace la máquina</th></tr>
${IA_PELIGROS.filter(p => p.familia === f.k).map(p => `      <tr><td></td><td class="k">${p.emoji} ${esc(p.nombre)}</td><td>${esc(p.mecanismo)}</td></tr>`).join('\n')}
    </table></div>`).join('\n')}
`);

// ── Página 4 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🧰 4. El botiquín: seis defensas</h2>

    <p>Cada una dice también <strong>para qué NO sirve</strong>. Una defensa que sirve para todo es peor que
       ninguna: el día que falla, nadie tiene plan.</p>

    <table>
      <tr><th style="width:26%">La defensa</th><th>Sirve para</th><th style="width:32%">NO sirve</th></tr>
${IA_DEFENSAS.map(d => `      <tr><td class="k">${d.emoji} ${esc(d.nombre)}</td><td>${esc(d.para)}</td><td>${esc(d.noPara)}</td></tr>`).join('\n')}
    </table>

    <h2>🔒 5. Las tres reglas de oro</h2>

    <p>Son las mismas de la etapa 1, sin cambiarles una palabra. Ahora ya sabés <strong>de qué te
       defienden</strong>:</p>

${tablaReglas()}
`);

// ── Página 5 · actividades ─────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>🚨 Actividad 1 · Los mensajes que llegan <span class="val">(20 pts)</span></h3>

      <p>Subrayá en cada mensaje los pedazos que sean <strong>señal</strong>. Escribí al lado cuál es:
         urgencia, secreto o canal nuevo. <strong>Uno de los cuatro no trae ninguna.</strong></p>

${IA_MENSAJES.map((m, i) => `      <div class="ilus"><div class="ilus-t">${i + 1}. ${m.emoji} ${esc(m.de)}</div><p>«${esc(m.trozos.map(z => z.txt).join('').trim())}»</p><p>Señales que encontré: <span class="linea-resp" style="min-width:60%"></span></p></div>`).join('\n')}

      <p>¿Cuál no traía ninguna? <span class="linea-resp" style="min-width:45%"></span> ¿Y por qué eso
         también importa? <span class="linea-resp" style="min-width:100%"></span></p>
    </div>
`);

// ── Página 6 · Descubre en papel ───────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>🎙️ Actividad 2 · ¿Cuánto hace falta para una estafa? <span class="val">(20 pts)</span></h3>

      <p>Este es el mensaje que le llegó a una alumna. Todo lo que lo hace creíble salió de <strong>algo
         publicado</strong>. Escribí de dónde pudo salir cada pieza:</p>

      <div class="ilus"><div class="ilus-t">📨 El mensaje</div><p><i>«${esc(D.iaEstafaMensaje(D.IA_ESTAFA_PIEZAS.map(p => p.k)))}»</i></p></div>

      <table>
        <tr><th style="width:44%">La pieza del mensaje</th><th>¿De dónde pudo salir?</th></tr>
${D.IA_ESTAFA_PIEZAS.map(p => `        <tr><td class="k">${p.emoji} ${esc(p.que)}</td><td><span class="linea-resp" style="min-width:90%"></span></td></tr>`).join('\n')}
      </table>

      <p>Y ahora lo que importa: <strong>¿qué lo hubiera parado?</strong> Escribí <b>SÍ</b>, <b>NO</b> o
         <b>A MEDIAS</b> en cada una, y por qué:</p>

      <ol>
${D.IA_ESTAFA_DEFENSAS.map(d => `        <li>${d.emoji} ${esc(d.que)} <span class="linea-resp" style="min-width:90px"></span><br><span class="linea-resp" style="min-width:100%"></span></li>`).join('\n')}
      </ol>
    </div>
`);

// ── Página 7 · Descubre en papel (2) ───────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>⚖️ Actividad 3 · El promedio que esconde <span class="val">(20 pts)</span></h3>

      <p>Un programa decide <strong>${esc(D.IA_SISTEMAS[0].decide)}</strong>. Cuando falla, cuesta
         ${esc(D.IA_SISTEMAS[0].cuesta)}. Se entrena con ${D.IA_EJEMPLOS_TOTAL} ejemplos. De las
         ${D.IA_SISTEMAS[0].grupos.reduce((a, g) => a + g.cuantos, 0)} personas que lo van a usar,
         ${D.IA_SISTEMAS[0].grupos.map(g => g.cuantos + ' son ' + esc(g.nombre.toLowerCase())).join(' y ')}.</p>

      <p>Con cada reparto, la máquina acierta esto. <strong>Completá la última columna</strong>: cuántas
         personas de cada grupo quedan mal clasificadas.</p>

      <table>
        <tr><th>Con qué ejemplos se entrenó</th><th>Acierto en cada grupo</th><th style="width:24%">¿Cuántas personas fallan?</th></tr>
${D.IA_REPARTOS.map(r => { const e = D.iaExactitud(D.IA_SISTEMAS[0], r.k); return `        <tr><td class="k">${esc(r.nombre)}</td><td>${e.porGrupo.map(g => g.pct + ' %').join(' · ')} <i>(promedio: ${e.media} %)</i></td><td><span class="linea-resp" style="min-width:80%"></span></td></tr>`; }).join('\n')}
      </table>

      <ol>
        <li>¿Qué reparto tiene el promedio más alto? <span class="linea-resp" style="min-width:45%"></span></li>
        <li>Con «solo del grupo grande», ¿qué le pasa al grupo pequeño?
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>Si fueras del grupo pequeño, ¿qué le pedirías a quien hizo el programa?
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>

      <h3>✍️ Actividad 4 · Tu plan <span class="val">(sin respuesta, a propósito)</span></h3>
      <ol>
        <li>¿Con quién y cuándo vas a acordar la palabra de tu familia?
          <span class="linea-resp" style="min-width:100%"></span>
          <br><b>La palabra NO se escribe aquí</b>, ni en esta hoja ni en ningún grupo. Se dice en voz alta
          y se queda en la cabeza. Una defensa que se escribe deja de ser una defensa.</li>
        <li>¿Qué vas a dejar de publicar? <span class="linea-resp" style="min-width:100%"></span></li>
        <li>Nombrá los cuatro peligros del catálogo que te puedan pasar a vos este año.
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
      <div class="caja idea"><b>Esta actividad no trae respuesta, y no es un descuido:</b> no la hay. Se
        evalúa que el plan sea concreto y que lo pueda hacer esta semana.</div>
    </div>
`);

// ── Página 8 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}

    <div class="felic"><b>¡Bien hecho!</b> Con estas diez ya tenés lo que de verdad defiende: las tres
      señales, el canal de siempre y la pregunta de a quién le cae el error. No hace falta saber de
      computadoras. Hace falta acordarse.</div>
`);

// ── Página 9 · hoja del docente ────────────────────────────────────────────
P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Los mensajes (20 pts):</span>
        ${IA_MENSAJES.map((m, i) => (i + 1) + '. ' + (m.trozos.some(z => z.t) ? [...new Set(m.trozos.filter(z => z.t).map(z => z.t))].join(' + ') : '<b>ninguna señal</b>')).join(' · ')}.
        El cuarto es el que más enseña: es un mensaje normal, y reconocerlo es parte de la destreza.</div>
      <div><span class="pt">Actividad 2 · La estafa por dentro (20 pts):</span> las seis piezas salen de algo
        publicado —${D.IA_ESTAFA_PIEZAS.map(p => esc(p.publico.toLowerCase())).join('; ')}—, salvo el número
        nuevo, que lo pone quien engaña. Las defensas:
        ${D.IA_ESTAFA_DEFENSAS.map(d => esc(d.que) + ' <b>' + VEREDICTO[d.vale] + '</b>').join(' · ')}.</div>
      <div><span class="pt">Actividad 3 · El promedio que esconde (20 pts):</span>
        ${D.IA_REPARTOS.map(r => { const e = D.iaExactitud(D.IA_SISTEMAS[0], r.k); return esc(r.nombre) + ': fallan <b>' + e.fallan.join(' y ') + '</b>'; }).join(' · ')}.
        El promedio más alto es el de «mitad y mitad», y esa es la sorpresa. En este caso, repartir parejo
        no solo es más justo: además acierta más. <b>No es una ley general</b>, y conviene decirlo: pasa
        porque el grupo pequeño estaba sin aprender.</div>
      <div><span class="pt">Actividad 4 · Tu plan:</span> <b>no lleva respuesta a propósito.</b> Se valora
        que sea concreto y que se pueda hacer esta semana. <b>Y una advertencia:</b> si algún alumno escribe
        aquí la palabra de su familia, hay que decírselo delante de todos y cambiarla. Es justo el error que
        la actividad enseña a no cometer.</div>
    </div>

    <div class="nota-doc">
      <b>Para qué sirve esta ficha, y qué NO hay que enseñar de más.</b> Es la etapa 5 de la Ruta de la
      Máquina que Aprende, y la única que habla de daños. Se enseña <b>el mecanismo y la pregunta que lo
      desarma</b>, nunca el miedo. Un alumno asustado desconfía de todo, deja de leer los avisos de verdad y
      queda igual de indefenso. Por eso el cuarto mensaje de la Actividad 1 no trae ninguna señal, y por eso
      conviene no saltárselo.
      <br><br>
      <b>Lo que esta ficha no hace, a propósito:</b> no explica cómo se fabrica una voz ni cómo se arma un
      video falso. La Actividad 2 le pide al alumno mirar <b>de qué está hecho</b> el engaño: información que
      la propia familia publicó. Eso es lo que le permite defenderse. Y termina siempre en la otra mitad, qué
      lo hubiera parado. Es como se enseña a reconocer un correo falso en cualquier oficina.
      <br><br>
      <b>Tres peligros van sin caso con nombres:</b> el remedio milagroso, la opinión fabricada y —fuera de
      esta ficha— el uso militar, que es de Educación Media. En un pueblo, un caso con nombres se parece a
      alguien, y la clase acaba señalando a una persona de verdad. Es la misma decisión que los casos de la
      misión de la Constitución.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b> y entra igual,
      porque el alumno ya la tiene encima. El marco, las expectativas de logro que cumple y lo que a
      propósito NO se enseña están en <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>. Cómo se hace la siguiente
      misión de esta ruta, en <b>COMPENDIO-MISIONES-IA.md</b>.
    </div>
`);

arma('fichas/ficha-peligros-ia.html', 'Los Peligros de la Inteligencia Artificial', P);
