/* Ficha de la misión 77 · En los Albores de la Singularidad · III Ciclo
   ⚠️ Esta ficha NO afirma un solo hecho de actualidad: da la afirmación, quién
   la publicó, y cómo se comprueba. La razón está en js/data/ia-actualidad.js y
   se dice también en el papel, porque el papel se fotocopia y se guarda: quien
   la escribió no pudo abrir ninguna de esas páginas. Buscar no es leer.

   ⚠️ Y se escribe en lenguaje llano: esto lo lee un alumno de cuarto grado y
   un joven de bachillerato, y los dos tienen que llegar al final. Frases
   cortas, una idea por frase, nada de incisos con rayas ni moralejas. Lo mide
   `node _dev/mide-legibilidad.js misiones/3ciclo-albores-singularidad --detalle`. */
'use strict';
const A = require('../arma-fichas-ia.js');
const { esc, arma, portada, preguntas, clave,
        IA_HOY_FECHA, IA_HOY_MES, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_TERMOMETRO_TRAMOS,
        IA_FRASES, iaFraseCuenta, iaFraseTramo, IA_INFLEXION } = A;

const EVAL = [
  { q: '¿Qué afirma la palabra «singularidad»?', o: ['Que una máquina mejore máquinas más rápido de lo que podemos seguir', 'Que la IA ya piensa como una persona', 'Que las computadoras se apagarán', 'Que la IA es peligrosa'], a: 0 },
  { q: 'Una promesa sin fecha…', o: ['Es más seria', 'Se cumple sola', 'Vale más', 'No se puede incumplir nunca'], a: 3 },
  { q: 'Cinco páginas dicen lo mismo y ninguna dice de dónde. ¿Qué tenés?', o: ['Cinco fuentes', 'Una prueba', 'Un eco', 'Un estudio'], a: 2 },
  { q: '¿Cuándo se reconoce un punto de inflexión?', o: ['El mismo día, por el ruido', 'Cuando lo dice un experto', 'Cuando sale en televisión', 'Casi siempre mirando para atrás'], a: 3 },
  { q: '¿Qué se rompió en los dos inviernos?', o: ['La confianza', 'Las computadoras', 'Los cables', 'Las leyes'], a: 0 },
  { q: 'Lo que SÍ se sabe hoy es que la máquina…', o: ['Quiere cosas', 'Se mejora sola', 'Aprende de ejemplos que alguien eligió', 'Entiende lo que lee'], a: 2 },
  { q: 'Saber qué gana alguien diciendo algo…', o: ['Lo vuelve falso', 'Pone lo que dice en su sitio', 'Lo vuelve verdadero', 'No sirve'], a: 1 },
  { q: '«Contenido patrocinado» quiere decir que…', o: ['Alguien pagó por publicarlo y el medio lo dice', 'Es falso', 'Es del gobierno', 'Es gratis'], a: 0 },
  { q: 'Dos noticias del mes se contradicen. Lo más probable es que…', o: ['Una mienta', 'Midan cosas distintas', 'Las dos mientan', 'La nueva tenga razón'], a: 1 },
  { q: '¿Cuál es la fecha que más importa?', o: ['La del artículo', 'La de la foto', 'La del hecho', 'La del comentario'], a: 2 },
];

const P = [];

// ── Página 1 ───────────────────────────────────────────────────────────────
P.push(portada('En los Albores de la Singularidad',
  'Puntos de inflexión: cómo se lee lo que se dice hoy sobre Inteligencia Artificial.',
  'qr-mision-albores-singularidad.png',
  ['Explicar qué <strong>afirma</strong> la palabra «singularidad» y qué se <strong>sabe</strong> hoy.',
   'Usar las <strong>cuatro preguntas</strong> con cualquier afirmación.',
   'Distinguir un <strong>punto de inflexión</strong> de un <strong>invierno</strong> y de un <strong>eco</strong>.',
   'Clasificar noticias por <strong>lo que traen</strong>, no por si gustan.',
   'Ponerle <strong>fecha</strong> a una promesa y volver a juzgarla ese día.',
   'Decidir su futuro con datos que pueda comprobar.']) + `
    <h2>🌅 1. «Estamos en los albores de la singularidad»</h2>

    <p>Es la frase del año. Antes de opinar, mirá qué afirma:</p>

    <div class="caja idea"><b>La afirmación:</b> ${esc(IA_SINGULARIDAD.afirmacion)}<br><br>
      ${esc(IA_SINGULARIDAD.albores)}</div>

    <div class="dos">
      <div class="dA"><b>📎 Lo que SÍ se sabe hoy</b>
        <ul>${IA_SINGULARIDAD.seSabe.map(x => `<li>${esc(x.t)}</li>`).join('')}</ul>
      </div>
      <div class="dB"><b>🌫️ Lo que NO se sabe</b>
        <ul>${IA_SINGULARIDAD.noSeSabe.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="caja aviso"><b>Por qué importa la palabra:</b> ${esc(IA_SINGULARIDAD.porQue)}</div>
    <div class="caja regla"><b>🧭 ${esc(IA_SINGULARIDAD.vara)}</b></div>
`);

// ── Página 2 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🧭 2. Qué es un punto de inflexión</h2>

    <p>${esc(IA_INFLEXION.que)} <b>${esc(IA_INFLEXION.cuando)}</b></p>

    <table>
      <tr><th style="width:38%">La regla</th><th>Por qué</th></tr>
${IA_INFLEXION.reglas.map(r => `      <tr><td class="k">${r.e} ${esc(r.t)}</td><td>${esc(r.p)}</td></tr>`).join('\n')}
    </table>

    <h2>🌡️ 3. El termómetro de la promesa</h2>

    <p>Cuatro preguntas para cualquier afirmación. Sirven para una noticia, para una oferta de
       trabajo y para un remedio milagroso:</p>

    <table>
      <tr><th style="width:26%">La pregunta</th><th>Suena a SÍ</th><th>Suena a NO</th></tr>
${IA_TERMOMETRO.map(t => `      <tr><td class="k">${t.emoji} ${esc(t.pregunta)}</td><td>${esc(t.si)}</td><td>${esc(t.no)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>Y lo que dice el resultado:</b><br>
${IA_TERMOMETRO_TRAMOS.map(t => `      ${t.emoji} <b>${esc(t.nombre)}</b> (${t.min} de ${IA_TERMOMETRO.length} o más): ${esc(t.dice.replace(/\*\*/g, ''))}`).join('<br>')}</div>
`);

// ── Página 3 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>📰 4. El dossier de ${esc(IA_HOY_MES)}</h2>

    <div class="caja aviso"><b>⚠️ Aquí no se afirma ni un solo hecho. Decilo en voz alta en clase.</b>
      Quien armó esta ficha <b>no pudo abrir ninguna de estas páginas</b>: desde ahí están bloqueadas, y
      <b>buscar no es leer</b>. Lo que hay es la afirmación, quién la publicó y cómo se comprueba. Dossier
      armado el <b>${esc(IA_HOY_FECHA)}</b>.</div>

    <table>
      <tr><th style="width:15%">Fecha</th><th>Lo que se afirma</th><th style="width:22%">¿Cuánto trae?</th></tr>
${IA_HOY.map(h => `      <tr><td class="k">${h.emoji} ${esc(h.fecha)}</td><td>${esc(h.afirma)}</td><td><span class="linea-resp" style="min-width:80%"></span></td></tr>`).join('\n')}
    </table>

    <p><b>Actividad 1 · Clasificá cada una</b> <span class="val">(16 pts)</span>: escribí en la última columna
       <b>MUCHO</b> (quien responde, con fecha y documento), <b>ALGO</b> (varios medios con fecha, sin el
       documento) o <b>POCO</b> (no dice quién, ni cuándo, ni de dónde).</p>
`);

// ── Página 4 ───────────────────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>🌡️ Actividad 2 · El termómetro, frase por frase <span class="val">(20 pts)</span></h3>

      <p>Marcá <b>SÍ</b> o <b>NO</b> en las cuatro preguntas. Después escribí en qué tramo cae.</p>

      <table>
        <tr><th>La frase</th><th style="width:8%">🧑</th><th style="width:8%">💰</th><th style="width:8%">📅</th><th style="width:8%">📎</th><th style="width:22%">¿En qué tramo cae?</th></tr>
${IA_FRASES.map(f => `        <tr><td>${f.emoji} «${esc(f.texto)}»<br><i>${esc(f.de)}</i></td><td></td><td></td><td></td><td></td><td><span class="linea-resp" style="min-width:80%"></span></td></tr>`).join('\n')}
      </table>

      <p>De las cinco, ¿cuántas traen con qué comprobarse? <span class="linea-resp" style="min-width:60px"></span>
         ¿Por qué eso también importa? <span class="linea-resp" style="min-width:100%"></span></p>
    </div>
`);

// ── Página 5 ───────────────────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>📅 Actividad 3 · Tu cápsula del tiempo <span class="val">(sin respuesta, a propósito)</span></h3>

      <p>Lo único que separa un <b>hito</b> de un <b>invierno</b> es el tiempo. Y el tiempo no se apura:
         se apunta. Llená esto hoy, doblá la hoja y guardala.</p>

      <div class="ilus">
        <div class="ilus-t">📅 Escrita el <span class="linea-resp" style="min-width:140px"></span></div>
        <p><b>1. ¿Qué se promete?</b> (copiala tal cual)
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></p>
        <p><b>2. ¿Quién lo dice, y qué gana?</b>
          <span class="linea-resp" style="min-width:100%"></span></p>
        <p><b>3. ¿Para cuándo lo promete?</b> <span class="linea-resp" style="min-width:60%"></span></p>
        <p><b>4. ¿Qué creés vos que va a pasar?</b>
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></p>
        <p><b>5. Vuelvo a leer esto el:</b> <span class="linea-resp" style="min-width:45%"></span>
          <i>(dentro de un año)</i></p>
      </div>

      <h3>🔎 Actividad 4 · Comprobá UNA <span class="val">(14 pts)</span></h3>
      <p>Elegí una afirmación del dossier y hacé el trabajo completo:</p>
      <ol>
        <li>¿Quién responde por ella, con nombre? <span class="linea-resp" style="min-width:70%"></span></li>
        <li>¿Qué documento habría que abrir? <span class="linea-resp" style="min-width:70%"></span></li>
        <li>¿Lo encontraste? ¿Qué decía que el titular no decía?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
      <div class="caja idea"><b>Esta actividad no trae respuesta, y no es un descuido:</b> depende del día en
        que se haga. Se evalúa el camino, no el resultado.</div>
    </div>
`);

// ── Página 6 ───────────────────────────────────────────────────────────────
P.push(`
    <h2 data-hoja-propia>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}

    <div class="felic"><b>¡Bien hecho!</b> Antes de entregar, revisá tus respuestas <b>una por una</b>.</div>
`);

// ── Página 7 · hoja del docente ────────────────────────────────────────────
P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · El dossier (16 pts):</span>
        ${IA_HOY.map(h => esc(h.fecha) + ': <b>' + (h.comprobable === 'alta' ? 'MUCHO' : (h.comprobable === 'media' ? 'ALGO' : 'POCO')) + '</b>').join(' · ')}.
        No se califica el acierto: se califica el motivo. «POCO porque no estoy de acuerdo» falló el
        ejercicio, aunque coincida la letra.</div>
      <div><span class="pt">Actividad 2 · El termómetro (20 pts):</span>
        ${IA_FRASES.map(f => esc(f.de.replace(/\.$/, '')) + ': <b>' + iaFraseCuenta(f) + '/4, ' + esc(iaFraseTramo(iaFraseCuenta(f)).nombre) + '</b>').join(' · ')}.
        <b>Dos de las cinco traen con qué comprobarse.</b> Subrayalo en clase: salir de aquí desconfiando de
        todo cuesta lo mismo que creerlo todo.</div>
      <div><span class="pt">Actividades 3 y 4:</span> <b>no llevan respuesta a propósito.</b> En la cápsula se
        valora que traiga una fecha concreta. En la comprobación, el camino: a quién iba a preguntarle y qué
        documento iba a abrir, lo haya encontrado o no.</div>
    </div>

    <div class="nota-doc">
      <b>Para qué sirve esta ficha, y qué NO hay que enseñar de más.</b> Es la etapa 6 de la Ruta de la
      Máquina que Aprende, y la única que habla de lo que está pasando ahora. Su regla sostiene todo lo
      demás: <b>aquí no se afirma ningún hecho de actualidad</b>. Se da la afirmación, quién la publicó y
      cómo se comprueba. El trabajo lo hace el alumno. El motivo no es prudencia: quien armó la ficha no
      pudo abrir ninguna de esas páginas, y <b>buscar no es leer</b>.
      <br><br>
      <b>Por eso tampoco se le dice al alumno si estamos en los albores de la singularidad.</b> Nadie lo
      sabe. Afirmarlo sería justo lo que esta misión enseña a no hacer. Lo que se le da es la vara: las
      cuatro preguntas y los dos inviernos.
      <br><br>
      <b>El dossier caduca.</b> Está fechado el ${esc(IA_HOY_FECHA)}. Dentro de un año va a servir para otra
      cosa: para mirar qué se cumplió. Ahí una promesa se vuelve hito o invierno, y es la mejor clase que da
      esta ficha. Cómo entra un hecho nuevo está en <b>_dev/actualidad/</b> del repositorio.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>. El marco, las
      expectativas de logro que cumple y lo que a propósito NO se enseña están en
      <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>. Cómo se hace la siguiente misión de esta ruta, en
      <b>COMPENDIO-MISIONES-IA.md</b>.
    </div>
`);

arma('fichas/ficha-albores-singularidad.html', 'En los Albores de la Singularidad', P);
