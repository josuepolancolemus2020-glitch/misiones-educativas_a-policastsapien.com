/* Ficha de la misión 73 · Cómo Aprende una Máquina · II Ciclo */
'use strict';
const A = require('../arma-fichas-ia.js');
/* Las cuentas de las actividades de Descubre: la pauta se CALCULA de aquí, no se escribe. */
const D = require('../../js/data/ia-descubre.js');
const { esc, arma, portada, preguntas, clave, fichaConcepto, tablaReglas, IA_CONCEPTOS } = A;

const EVAL = [
  { q: '¿Qué diferencia a un programa que APRENDE de uno de siempre?', o: ['Que es más caro', 'Que saca la regla de los ejemplos en vez de seguir una escrita', 'Que no necesita computadora', 'Que nunca se equivoca'], a: 1 },
  { q: '¿Qué es una etiqueta?', o: ['El precio del programa', 'Un adorno de la pantalla', 'La respuesta correcta que una persona le pone a un ejemplo', 'El nombre de la máquina'], a: 2 },
  { q: '¿Para qué sirve PROBAR con ejemplos nuevos?', o: ['Para saber si aprendió el patrón o solo se lo memorizó', 'Para gastar menos batería', 'Para que se entretenga', 'Para hacerla más rápida'], a: 0 },
  { q: 'Una máquina entrenada solo con maíz, frijol y café ve una hoja de plátano. ¿Qué pasa?', o: ['La reconoce igual', 'Se apaga', 'La ignora', 'Se puede equivocar: nunca vio una'], a: 3 },
  { q: '¿Cómo se llama ese fallo?', o: ['Patrón', 'Sesgo', 'Etiqueta', 'Refuerzo'], a: 1 },
  { q: '¿De quién es la responsabilidad de un sesgo?', o: ['De la máquina', 'De nadie', 'De quien eligió los ejemplos', 'Del que la usa'], a: 2 },
  { q: 'Aprender con ejemplos que ya traen su respuesta se llama…', o: ['Aprendizaje supervisado', 'Aprendizaje por refuerzo', 'Aprendizaje no supervisado', 'Memorización'], a: 0 },
  { q: 'Un programa junta fotos parecidas sin que nadie le diga cómo se llaman. Eso es…', o: ['Supervisado', 'Por refuerzo', 'Memorización', 'No supervisado'], a: 3 },
  { q: 'Un robot gana puntos cuando avanza sin caerse. Eso es…', o: ['Supervisado', 'Aprendizaje por refuerzo', 'No supervisado', 'Un patrón'], a: 1 },
  { q: 'La máquina acierta 9 de cada 10. ¿Qué hay que preguntarse?', o: ['Nada, está muy bien', 'Si se puede apagar', 'Cuánto cuesta', 'A quién le toca ese error'], a: 3 },
];

const CICLO = [
  ['📦 1. Datos', 'Se juntan muchísimos ejemplos: fotos, textos, sonidos, medidas.'],
  ['🏷️ 2. Etiquetas', 'Una persona escribe la respuesta correcta de cada uno.'],
  ['🏋️ 3. Entrenamiento', 'La máquina los mira una y otra vez y busca el patrón que los separa.'],
  ['🧪 4. Prueba', 'Se la examina con ejemplos que NUNCA vio.'],
  ['❌ 5. Error', 'Se cuenta cuántas falló. Ninguna acierta el cien por ciento.'],
  ['🔁 6. Se corrige', 'Se juntan los ejemplos que faltaban y se vuelve a entrenar.'],
];

const P = [];

P.push(portada('Cómo Aprende una Máquina',
  'Datos, etiquetas, entrenamiento, prueba y error. Los tres tipos de aprendizaje, y el sesgo: por qué se equivoca justo con lo que nadie le enseñó.',
  'qr-mision-como-aprende-una-maquina.png',
  ['Distinguir un programa que <strong>sigue reglas</strong> de uno que <strong>aprende de ejemplos</strong>.',
   'Explicar el ciclo <strong>datos → patrón → prueba → error</strong> con sus palabras.',
   'Usar bien las palabras <strong>dato, etiqueta, entrenar, probar y patrón</strong>.',
   'Nombrar los <strong>tres tipos de aprendizaje</strong> y dar un ejemplo de cada uno.',
   'Detectar un <strong>sesgo</strong> en un conjunto de ejemplos mal repartido.',
   'Preguntar, ante cualquier sistema que decida algo: <strong>con qué ejemplos, quién los eligió y a quién le cae el error</strong>.']) + `
    <h2>⚙️ 1. Dos maneras de hacer que una computadora haga algo</h2>

    <p>Esta es <strong>la diferencia más importante de toda la ruta</strong>, y es la que se pregunta en el
       examen:</p>

    <div class="dos">
      <div class="dB"><b>📋 Programa de siempre</b>
        Una persona escribe las <strong>reglas</strong>, paso por paso. La computadora las obedece.
        <ul><li><em>«Si la nota es menor que 60, escribe reprobado.»</em></li>
            <li>Nunca mejora solo. Si aparece un caso que la regla no contempló, falla.</li></ul>
      </div>
      <div class="dA"><b>🍎 Programa que aprende</b>
        Nadie le escribe la regla: recibe <strong>ejemplos</strong> y la saca él mismo de ellos.
        <ul><li><em>Diez mil fotos de hojas, marcadas «sana» o «con plaga».</em></li>
            <li>Reconoce cosas que nadie le describió. Y falla con lo que no estaba en sus ejemplos.</li></ul>
      </div>
    </div>

    <div class="caja idea"><b>Las dos fallan, pero por razones contrarias:</b> una porque le faltó una regla
      que alguien tenía que escribir; la otra porque le faltó un ejemplo que alguien tenía que juntar.
      <b>En las dos hay una persona detrás del fallo.</b></div>
`);

P.push(`
    <h2>🔁 2. El ciclo del aprendizaje, paso por paso</h2>

    <p>Así se entrena cualquier máquina que aprende, sea para reconocer plagas, leer recibos o traducir.
       Son siempre los mismos seis pasos:</p>

    <table>
      <tr><th style="width:30%">Paso</th><th>Qué pasa</th></tr>
${CICLO.map(([t, d]) => `      <tr><td class="k">${t}</td><td>${d}</td></tr>`).join('\n')}
    </table>

    <div class="caja truco"><b>El paso 4 es el que la gente se salta,</b> y es el que de verdad mide:
      probarla con ejemplos que <b>NUNCA vio</b>. Probarla con los mismos con que se entrenó no prueba nada,
      porque pudo habérselos memorizado.</div>

    <h2>📖 3. El vocabulario del examen</h2>

${IA_CONCEPTOS.filter(c => ['dato', 'etiqueta', 'entrenar', 'patron', 'prueba', 'error'].includes(c.clave)).map(fichaConcepto).join('\n')}
`);

P.push(`
    <h2>🗂️ 4. Las tres maneras de aprender</h2>

    <p>No todas las máquinas aprenden igual. Estas tres son las que hay que saber distinguir:</p>

${IA_CONCEPTOS.filter(c => ['supervisado', 'nosupervisado', 'refuerzo'].includes(c.clave)).map(fichaConcepto).join('\n')}

    <div class="caja truco"><b>El truco para no confundirlas:</b> pregúntate <b>quién le dio la
      respuesta</b>. Si se la dio una persona, es supervisado. Si no se la dio nadie y ella agrupó por
      parecido, es no supervisado. Si la fue descubriendo a base de premios, es por refuerzo.</div>

    <h2>⚖️ 5. El sesgo</h2>

${IA_CONCEPTOS.filter(c => c.clave === 'sesgo').map(fichaConcepto).join('\n')}

    <div class="caja aviso"><b>No es que la máquina sea mala.</b> Es que alguien eligió los ejemplos, y en
      esa elección se quedó gente afuera. Por eso la pregunta que hay que hacerle a cualquier sistema que
      decide algo importante no es «¿cuánto acierta?», sino estas tres:
      <ol style="margin-top:4px"><li><b>¿Con qué ejemplos lo entrenaron?</b></li>
      <li><b>¿Quién los eligió?</b></li>
      <li><b>¿A quién le cae el error?</b></li></ol></div>
`);

P.push(`
    <div class="acts">
      <h3>🧪 Actividad 1 · Entrena el detector de plagas, en papel <span class="val">(24 pts)</span></h3>

      <p>Una aplicación tiene que decir si una hoja está <strong>sana</strong> o <strong>con plaga</strong>.
         La entrenaron con hojas de <strong>maíz, frijol y café</strong>, y aprendió esto:</p>

      <div class="ilus">
        <div class="ilus-t">Lo que la máquina aprendió de cada cultivo</div>
        <table>
          <tr><th>Cultivo</th><th>Una hoja sana suya tiene…</th></tr>
          <tr><td class="k">🌽 Maíz</td><td>hasta <b>1</b> mancha</td></tr>
          <tr><td class="k">🫘 Frijol</td><td>hasta <b>1</b> mancha</td></tr>
          <tr><td class="k">☕ Café</td><td>hasta <b>1</b> mancha</td></tr>
          <tr><td class="k">❓ Un cultivo que nunca vio</td><td>usa el <b>promedio</b> de los que conoce: <b>1</b> mancha</td></tr>
        </table>
      </div>

      <p>Ahora le llegan estas hojas. Escribe qué va a contestar la máquina y si <strong>acierta</strong>:</p>

      <table>
        <tr><th>La hoja</th><th>Manchas</th><th>De verdad está…</th><th>La máquina dice</th><th>¿Acierta?</th></tr>
        <tr><td class="k">🌽 Maíz</td><td>1</td><td>sana</td><td><span class="linea-resp" style="min-width:70px"></span></td><td><span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td class="k">🌽 Maíz</td><td>3</td><td>con plaga</td><td><span class="linea-resp" style="min-width:70px"></span></td><td><span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td class="k">☕ Café</td><td>1</td><td>sana</td><td><span class="linea-resp" style="min-width:70px"></span></td><td><span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td class="k">🍌 Plátano</td><td>3</td><td><b>sana</b> (las hojas de plátano se rasgan con el viento)</td><td><span class="linea-resp" style="min-width:70px"></span></td><td><span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td class="k">🍌 Plátano</td><td>6</td><td>con plaga</td><td><span class="linea-resp" style="min-width:70px"></span></td><td><span class="linea-resp" style="min-width:40px"></span></td></tr>
      </table>

      <p><strong>Las dos preguntas que de verdad se califican:</strong></p>
      <ol>
        <li>¿Con cuál se equivocó, y por qué?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿Qué le cuesta ese error al productor de plátano?
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
    </div>
`);

P.push(`
    <div class="acts">
      <h3>🗂️ Actividad 2 · ¿Qué tipo de aprendizaje es? <span class="val">(12 pts)</span></h3>

      <p>Escribe <strong>S</strong> (supervisado), <strong>N</strong> (no supervisado) o <strong>R</strong>
         (por refuerzo):</p>

      <ol>
        <li>Le damos fotos de hojas con la etiqueta «sana» o «con plaga». <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Le damos miles de fotos sin decirle nada y ella las junta por parecido. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Juega millones de partidas y se premia cada vez que gana. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Le damos recibos ya clasificados en «pagado» y «pendiente». <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Agrupa sola a los clientes que compran parecido, sin nombres de grupo. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Un robot prueba caminar y gana puntos cuando avanza sin caerse. <span class="linea-resp" style="min-width:50px"></span></li>
      </ol>

      <h3>📦 Actividad 3 · ¿Dato o etiqueta? <span class="val">(12 pts)</span></h3>

      <p>Escribe <strong>D</strong> si es un dato y <strong>E</strong> si es una etiqueta:</p>

      <table>
        <tr><td style="width:50%">La foto de una hoja <span class="linea-resp" style="min-width:40px"></span></td><td>La palabra «sana» escrita por una persona <span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td>El peso de una naranja <span class="linea-resp" style="min-width:40px"></span></td><td>«Esto es un nance» <span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td>La grabación de una voz <span class="linea-resp" style="min-width:40px"></span></td><td>«Esta hoja tiene plaga» <span class="linea-resp" style="min-width:40px"></span></td></tr>
      </table>

      <h3>💡 Actividad 4 · Explica con tus palabras <span class="val">(12 pts)</span></h3>

      <ol>
        <li>¿Por qué hay que probar con ejemplos que la máquina NUNCA vio?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>Una máquina acierta 9 de cada 10. ¿Por qué ese 1 que falla puede importar mucho?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
    </div>
`);

// ── Descubre, en papel · 🎯 Tú eres la máquina ─────────────────────────────
/* Las etiquetas y la trampa salen de IA_REGLAS_OCULTAS, con la misma regla
   que corre en la misión: si mañana cambia un ejemplo, cambia aquí y en la
   pauta a la vez. */
const _r1 = D.IA_REGLAS_OCULTAS[0], _rt = D.IA_REGLAS_OCULTAS.find(r => r.trampa);
const _et = (r, x) => (r.regla(x) ? '✅ entra' : '❌ no entra');
P.push(`
    <div class="acts">
      <h3>🎯 Actividad 5 · Tú eres la máquina <span class="val">(16 pts)</span></h3>

      <p>Nadie te dice la regla. Mira los ejemplos que YA vienen con su respuesta, saca la regla, y
         contesta los que faltan como lo haría una máquina que aprendió de esos ejemplos.</p>

      <table>
        <tr><th style="width:50%">Ejemplo</th><th>¿Entra en el grupo?</th></tr>
${_r1.ejemplos.map((x, i) => '        <tr><td class="k">' + esc(String(x)) + '</td><td>' + (i < D.IA_REGLAS_MEDIO ? _et(_r1, x) : '<span class="linea-resp" style="min-width:110px"></span>') + '</td></tr>').join('\n')}
      </table>
      <p>La regla es: <span class="linea-resp" style="min-width:60%"></span></p>

      <p><strong>Ahora la trampa.</strong> Estos cinco ejemplos también vienen con su respuesta:</p>
      <p style="text-align:center;font-size:11.5pt">${_rt.ejemplos.slice(0, _rt.trampa.hasta).map(x => '<b>' + esc(String(x)) + '</b> ' + _et(_rt, x)).join(' &nbsp;·&nbsp; ')}</p>
      <ol>
        <li>Escribe <strong>dos reglas distintas</strong> que encajen con los cinco:
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿Qué número le pedirías a la máquina para saber cuál de las dos reglas aprendió?
          <span class="linea-resp" style="min-width:60px"></span> ¿Por qué ese?
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>

      <div class="caja idea"><b>Lo que acaba de pasarte es lo que le pasa a la máquina:</b> con pocos ejemplos
        caben varias reglas, y elige una sin saber si es la buena. Por eso hacen falta ejemplos
        <b>variados</b>, no solo muchos.</div>
    </div>
`);

P.push(`
    <h2>🔒 6. Las tres reglas de oro</h2>

    <p>Son las mismas de la etapa 1, y son las mismas que vas a usar en noveno. Lo que cambia con los años
       no son las reglas: es que ahora ya sabes <strong>por qué</strong>.</p>

${tablaReglas()}

    <h2>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}
`);

P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · El detector de plagas (24 pts):</span>
        maíz 1 → «sana» ✔ · maíz 3 → «con plaga» ✔ · café 1 → «sana» ✔ ·
        <b>plátano 3 → «con plaga» ✘ (se equivoca)</b> · plátano 6 → «con plaga» ✔.
        En la pregunta 1 se valora que el alumno diga que <b>nunca vio una hoja de plátano</b> y que por eso
        le aplicó el promedio de los otros, no que la máquina «esté mala». En la pregunta 2, que nombre el
        costo real: ese productor fumiga de balde, o deja de vender creyendo que su cosecha está enferma.</div>
      <div><span class="pt">Actividad 2 · Tipos de aprendizaje (12 pts):</span> S · N · R · S · N · R.</div>
      <div><span class="pt">Actividad 3 · ¿Dato o etiqueta? (12 pts):</span> D · E · D · E · D · E.</div>
      <div><span class="pt">Actividad 4 · Con tus palabras (12 pts):</span> respuesta abierta.
        1) Porque si se la prueba con los mismos con que se entrenó, no se sabe si aprendió el patrón o se
        los memorizó. 2) Porque en ese 1 hay una persona concreta, y porque el error puede caer siempre
        sobre el mismo grupo: el porcentaje solo no lo enseña.</div>
      <div><span class="pt">Actividad 5 · Tú eres la máquina (16 pts):</span> los que faltan:
        ${_r1.ejemplos.slice(D.IA_REGLAS_MEDIO).map(x => esc(String(x)) + ' ' + _et(_r1, x)).join(' · ')}; la regla:
        <b>${esc(_r1.nombre)}</b>. La trampa: <b>${esc(_rt.trampa.otraNombre)}</b> y <b>${esc(_rt.nombre)}</b> encajan las dos con los
        cinco; las separa cualquier número que cumpla una y no la otra (el <b>${esc(String(_rt.ejemplos[_rt.trampa.hasta]))}</b>, por
        ejemplo). Se valora que el alumno explique POR QUÉ ese número separa las dos, no solo que acierte uno.</div>
    </div>

    <div class="nota-doc">
      <b>Qué se está enseñando de verdad en esta hoja.</b> El vocabulario (dato, etiqueta, entrenar, probar,
      patrón, error) es el andamio; lo que se evalúa es otra cosa: que el alumno, ante una máquina que
      decide algo, sepa preguntar <b>con qué ejemplos la entrenaron, quién los eligió y a quién le cae el
      error</b>. Esas tres preguntas le van a servir el resto de su vida, aunque la tecnología cambie entera.
      <br><br>
      <b>La Actividad 1 es el corazón de la ficha.</b> Conviene dejar que se equivoquen y que discutan de
      quién es la culpa antes de dar la respuesta: casi todos dicen «la máquina está mala», y el trabajo
      del maestro es una sola pregunta, <b>¿le enseñaron alguna hoja de plátano?</b> El ejemplo es
      hondureño a propósito: el alumno puede señalar la mata.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>. El propio
      currículo dice dónde va lo tecnológico en II Ciclo: dentro del bloque «Materia, energía y tecnología»
      de Ciencias Naturales. El porqué entero y lo que a propósito NO se enseña están en
      <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>.
      <br><br>
      <b>La ficha y la misión salen del mismo archivo del proyecto</b> (js/data/ia-conceptos.js), así que no
      pueden decir cosas distintas. Etapa 2 de cuatro.
    </div>
`);

arma('fichas/ficha-como-aprende-una-maquina.html', 'Cómo Aprende una Máquina', P);
