/* Ficha de la misión 72 · ¿Qué es la Inteligencia Artificial? · I Ciclo */
'use strict';
const A = require('../arma-fichas-ia.js');
/* Las cuentas de las actividades de Descubre: la pauta se CALCULA de aquí, no se escribe. */
const D = require('../../js/data/ia-descubre.js');
const { esc, con, arma, portada, preguntas, clave, fichaConcepto, tablaReglas, tablaMitos,
        IA_APLICACIONES, IA_MITOS, IA_REGLAS_ORO, IA_CONCEPTOS } = A;

const EVAL = [
  { q: '¿Qué es la Inteligencia Artificial?', o: ['Programas que hacen cosas que antes solo hacían las personas', 'Un robot que vive en el teléfono', 'Una persona dentro de la computadora', 'Un juego de video'], a: 0 },
  { q: '¿Cuál de estos está VIVO?', o: ['Un teléfono', 'Un pino', 'Una calculadora', 'Un robot'], a: 1 },
  { q: '¿Cómo aprende una máquina a reconocer una cara?', o: ['Nació sabiendo', 'Alguien se la dibujó una vez', 'Viendo muchísimas fotos de caras', 'Porque tiene ojos'], a: 2 },
  { q: 'Si a una máquina le enseñamos POCOS ejemplos…', o: ['Aprende más rápido', 'Aprende igual de bien', 'No pasa nada', 'Se equivoca más'], a: 3 },
  { q: '¿La máquina siente alegría o tristeza?', o: ['No: es un aparato y no siente nada', 'Sí, cuando gana', 'Solo sin batería', 'Sí, como un perro'], a: 0 },
  { q: 'Una instrucción es…', o: ['Un dibujo', 'Una orden clara que la máquina obedece', 'Un premio', 'Una foto'], a: 1 },
  { q: '¿Qué NO se le cuenta a una máquina?', o: ['Mi color favorito', 'Qué es un triángulo', 'La dirección de mi casa', 'Una pregunta de la tarea'], a: 2 },
  { q: 'La máquina te dio un dato y no estás seguro. ¿Qué haces?', o: ['Le creo, porque es computadora', 'Se lo cuento a todos', 'Le pregunto lo mismo otra vez', 'Lo busco en el libro o le pregunto a mi maestra'], a: 3 },
  { q: '¿Por qué se dice que la Inteligencia Artificial NO es magia?', o: ['Porque son datos y matemática, y alguien la hizo', 'Porque no funciona', 'Porque solo sirve de noche', 'Porque es muy cara'], a: 0 },
  { q: '¿Qué hace que algo sea un ser vivo?', o: ['Que tenga colores', 'Que nazca, crezca, se alimente y muera', 'Que se encienda', 'Que haga ruido'], a: 1 },
];

const P = [];

// ── Página 1 ───────────────────────────────────────────────────────────────
P.push(portada('¿Qué es la Inteligencia Artificial?',
  'Máquinas que aprenden con ejemplos: qué son, en qué se diferencian de un ser vivo y cómo usarlas sin salir perjudicado.',
  'qr-mision-que-es-la-ia.png',
  ['Explicar con sus palabras qué es la <strong>Inteligencia Artificial</strong>.',
   'Distinguir un <strong>ser vivo</strong> de una <strong>máquina</strong>.',
   'Reconocer que una máquina aprende <strong>con ejemplos</strong>, y que con pocos se equivoca.',
   'Nombrar tres cosas de su casa donde ya hay Inteligencia Artificial.',
   'Decir por qué <strong>no es magia</strong> y por qué <strong>no siente</strong>.',
   'Aplicar las <strong>tres reglas de oro</strong> para usarla sin salir perjudicado.']) + `
    <h2>🧠 1. ¿Qué es la Inteligencia Artificial?</h2>

    <p>Hay máquinas que hacen cosas que antes <strong>solo hacían las personas</strong>: reconocer una cara,
       entender lo que decimos en voz alta, traducir un letrero. A eso se le llama
       <strong>Inteligencia Artificial</strong>.</p>

    <p>No está viva, no piensa y no siente. Hace <strong>cuentas muy rápido</strong> con lo que le enseñaron.
       Y ya está en tu casa, aunque no lo sepas:</p>

    <table>
      <tr><th style="width:38%">Lo que hace</th><th>Cómo lo aprendió</th></tr>
${IA_APLICACIONES.map(a => `      <tr><td class="k">${a.emoji} ${esc(a.que)}</td><td>${esc(a.como)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea"><b>La idea grande, y con esto ya no te confundes:</b> la máquina no entiende.
      Mira muchísimos ejemplos, busca lo que se repite y con eso decide. Todo lo demás cuelga de ahí.</div>
`);

// ── Página 2 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🐕 2. ¿Está vivo o es una máquina?</h2>

    <p>Un perro y un robot se mueven los dos. Pero <strong>moverse no es estar vivo</strong>: un ventilador
       también se mueve.</p>

    <div class="dos">
      <div class="dA"><b>🌱 Un ser vivo</b>
        <ul><li>Nace</li><li>Crece</li><li>Se alimenta</li><li>Siente: hambre, sueño, miedo, cariño</li><li>Muere</li><li>Aprende solo desde que nace</li></ul>
      </div>
      <div class="dB"><b>⚙️ Una máquina</b>
        <ul><li>La fabricaron personas</li><li>Se enciende y se apaga</li><li>No come</li><li>No siente nada</li><li>Se compone o se bota</li><li>Hay que enseñarle todo</li></ul>
      </div>
    </div>

    <div class="caja truco"><b>El truco para no equivocarse:</b> pregúntate si <b>nace, crece, come y muere</b>.
      Si le falta una, no está vivo. Un teléfono no nació: alguien lo armó en una fábrica.</div>

    <h2>🚫 3. Seis cosas que la gente cree, y no son</h2>

${tablaMitos()}

    <div class="caja idea"><b>Y una que sorprende:</b> hace sesenta años ya existía un programa que
      conversaba, y la gente le contaba cosas de su vida creyendo que la entendía. <b>No entendía nada.</b>
      Que algo conteste como una persona no significa que sea una persona.</div>
`);

// ── Página 3 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>📖 4. Las cuatro palabras nuevas</h2>

    <p>Estas cuatro son las de esta misión. Cópialas en tu cuaderno con un dibujo de cada una:</p>

${IA_CONCEPTOS.filter(c => c.ciclo === 1).map(fichaConcepto).join('\n')}

    <h2>📋 5. Dos maneras de enseñarle a una máquina</h2>

    <p>Y no son lo mismo. Esta es la diferencia más importante de toda la ruta:</p>

    <div class="dos">
      <div class="dB"><b>📋 Con instrucciones</b>
        Le decimos <strong>paso por paso</strong> lo que tiene que hacer. Ella obedece y no aprende nada.
        <ul><li><em>«Enciende la luz. Espera cinco segundos. Apágala.»</em></li></ul>
      </div>
      <div class="dA"><b>🍎 Con ejemplos</b>
        No le decimos qué hacer: le <strong>mostramos muchas cosas</strong> y ella busca sola lo que se repite.
        <ul><li><em>Mil fotos de nances hasta que reconozca uno que nunca vio.</em></li></ul>
      </div>
    </div>

    <div class="caja regla"><b>La Inteligencia Artificial es la segunda.</b> Por eso puede reconocer cosas
      que nadie le describió nunca, y por eso también <b>se equivoca con lo que no estaba en sus
      ejemplos</b>.</div>
`);

// ── Página 4 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🔒 6. Las tres reglas de oro</h2>

    <p>Estas tres son para siempre. Valen para cualquier máquina que te conteste, hoy y cuando estés en
       noveno grado:</p>

${tablaReglas()}

    <div class="acts">
      <h3>✏️ Actividad 1 · Enséñale a la máquina, en papel <span class="val">(20 pts)</span></h3>

      <p>En la misión hay una máquina que aprende a separar <strong>nances</strong> de <strong>anonas</strong>.
         Aquí lo vas a hacer con lápiz. Mira estos ejemplos que alguien ya le enseñó:</p>

      <div class="ilus">
        <div class="ilus-t">Lo que la máquina ya vio</div>
        <table>
          <tr><th>La fruta</th><th>¿Cómo es?</th><th>¿Qué es?</th></tr>
          <tr><td>🟡</td><td>chiquita y bien amarilla</td><td class="k">nance</td></tr>
          <tr><td>🟢</td><td>grandota y verde</td><td class="k">anona</td></tr>
          <tr><td>🟡</td><td>amarilla y medianita</td><td class="k">nance</td></tr>
          <tr><td>🟢</td><td>verde y grande</td><td class="k">anona</td></tr>
        </table>
      </div>

      <p>Ahora le llegan cuatro frutas que <strong>nunca vio</strong>. Escribe qué va a contestar la máquina,
         acordándote de que le pone el nombre de <strong>la que más se le parece</strong>:</p>

      <ol>
        <li>🟡 amarilla y chiquita &nbsp;→&nbsp; <span class="linea-resp"></span></li>
        <li>🟢 verde y grandota &nbsp;→&nbsp; <span class="linea-resp"></span></li>
        <li>🟠 anaranjada y <strong>bien grande</strong> &nbsp;→&nbsp; <span class="linea-resp"></span></li>
        <li>🟢 verde y <strong>pequeñita</strong> &nbsp;→&nbsp; <span class="linea-resp"></span></li>
      </ol>

      <p><strong>Y ahora la pregunta que importa:</strong> ¿en cuáles se equivocó y por qué?
         <span class="linea-resp" style="min-width:100%"></span>
         <span class="linea-resp" style="min-width:100%"></span></p>
    </div>
`);

// ── Página 5 ───────────────────────────────────────────────────────────────
P.push(`
    <div class="acts">
      <h3>🗂️ Actividad 2 · ¿Vivo o máquina? <span class="val">(16 pts)</span></h3>

      <p>Escribe <strong>V</strong> si está vivo y <strong>M</strong> si es una máquina:</p>

      <table>
        <tr><td style="width:42%">Un perro <span class="linea-resp" style="min-width:40px"></span></td><td>Un teléfono <span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td>Una mata de maíz <span class="linea-resp" style="min-width:40px"></span></td><td>Un robot <span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td>Tu maestra <span class="linea-resp" style="min-width:40px"></span></td><td>Una calculadora <span class="linea-resp" style="min-width:40px"></span></td></tr>
        <tr><td>Un zanate <span class="linea-resp" style="min-width:40px"></span></td><td>Una computadora <span class="linea-resp" style="min-width:40px"></span></td></tr>
      </table>

      <h3>✅ Actividad 3 · ¿Se lo cuento o no? <span class="val">(12 pts)</span></h3>

      <p>Escribe <strong>SÍ</strong> si se lo puedo contar a una máquina y <strong>NO</strong> si no:</p>

      <ol>
        <li>Mi color favorito <span class="linea-resp" style="min-width:60px"></span></li>
        <li>La dirección de mi casa <span class="linea-resp" style="min-width:60px"></span></li>
        <li>Una pregunta de la tarea <span class="linea-resp" style="min-width:60px"></span></li>
        <li>El teléfono de mi mamá <span class="linea-resp" style="min-width:60px"></span></li>
        <li>Cómo se escribe una palabra <span class="linea-resp" style="min-width:60px"></span></li>
        <li>Una foto de mis compañeros <span class="linea-resp" style="min-width:60px"></span></li>
      </ol>

      <h3>💡 Actividad 4 · Escribe con tus palabras <span class="val">(12 pts)</span></h3>

      <ol>
        <li>¿En qué se diferencia un perro de un robot? Escribe tres diferencias.
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>Nombra dos cosas de tu casa donde ya hay Inteligencia Artificial y decí qué hace cada una.
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
    </div>
`);

// ── Descubre, en papel · 👀 La máquina ve puntitos ─────────────────────────
/* Las cuadrículas se pintan con ■ y no con un fondo de color: el navegador
   imprime «sin gráficos de fondo» de fábrica y una casilla pintada saldría en
   blanco, que aquí ES el ejercicio. Los números de la pauta se calculan con
   el mismo código que corre en la misión (iaPixAdivina). */
const _rej = (celdas, vacio) => '<table class="rej"><tr>' + celdas.map((v, i) => (i && i % D.IA_PIX_LADO === 0 ? '</tr><tr>' : '') + '<td>' + (v ? '■' : (vacio || '')) + '</td>').join('') + '</tr></table>';
const _cruz = D.iaPixDeFilas(D.IA_PIX_RECUERDOS.find(r => r.k === 'cruz').filas);
const _movida = D.iaPixMover(_cruz);
const _res = D.iaPixAdivina(_movida);
P.push(`
    <div class="acts">
      <h3>👀 Actividad 5 · La máquina ve puntitos, en papel <span class="val">(16 pts)</span></h3>

      <p>En la misión hay una máquina que <strong>no ve dibujos: ve casillas llenas y vacías, y las
         cuenta</strong>. Tiene tres recuerdos. A cada dibujo nuevo le pone el nombre del recuerdo con el que
         <strong>más casillas coinciden</strong> (las dos llenas, o las dos vacías).</p>

      <div class="ilus">
        <div class="ilus-t">Los tres recuerdos de la máquina</div>
        <div class="rejs">
${D.IA_PIX_RECUERDOS.map(r => '          <div><b>' + r.e + ' ' + esc(r.n) + '</b>' + _rej(D.iaPixDeFilas(r.filas)) + '</div>').join('\n')}
        </div>
      </div>

      <p>Alguien dibujó la cruz <strong>movida una casilla a la derecha</strong>. Cuenta, para cada recuerdo,
         cuántas de las ${D.IA_PIX_LADO * D.IA_PIX_LADO} casillas coinciden con este dibujo, y escribe el número:</p>

      <div class="rejs">
        <div><b>El dibujo nuevo</b>${_rej(_movida)}</div>
        <div style="flex:2">
          <ol>
${D.IA_PIX_RECUERDOS.map(r => '            <li>Con ' + esc(r.n) + ' coinciden <span class="linea-resp" style="min-width:50px"></span> casillas</li>').join('\n')}
            <li>Entonces la máquina dirá: «se parece más a <span class="linea-resp" style="min-width:90px"></span>»</li>
            <li>¿Y tú qué ves? <span class="linea-resp" style="min-width:90px"></span> ¿Por qué no coinciden la máquina y tú?
              <span class="linea-resp" style="min-width:100%"></span></li>
          </ol>
        </div>
      </div>

      <p><strong>Para jugar en pareja:</strong> dibuja algo en la cuadrícula vacía. Tu compañero hace de máquina:
         solo puede contar casillas, y tiene que decir a cuál de los tres recuerdos se parece más.</p>
      <div class="rejs"><div>${_rej(_cruz.map(() => 0), '&nbsp;')}</div></div>
    </div>
`);

// ── Página 6 ───────────────────────────────────────────────────────────────
P.push(`
    <h2>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}

    <div class="felic"><b>¡Bien hecho!</b> Si contestaste estas diez, ya sabes lo más importante: que la
      máquina <b>no está viva</b>, que <b>aprende con ejemplos</b> y que hay cosas que <b>no se le
      cuentan</b>. Eso te va a servir toda la vida, aunque las máquinas cambien.</div>
`);

// ── Página 7 · hoja del docente ────────────────────────────────────────────
P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Enséñale a la máquina (20 pts):</span> 1 → nance · 2 → anona ·
        <b>3 → la máquina dice «anona» y se EQUIVOCA</b> (es un nance grande) ·
        <b>4 → la máquina dice «nance» y se EQUIVOCA</b> (es una anona pequeña).
        Lo que se califica de verdad es la última pregunta: se valora que el alumno diga que la máquina
        <b>no vio ningún ejemplo parecido</b> a esas dos, no que «está mala».</div>
      <div><span class="pt">Actividad 2 · ¿Vivo o máquina? (16 pts):</span> V · M · V · M · V · M · V · M.</div>
      <div><span class="pt">Actividad 3 · ¿Se lo cuento? (12 pts):</span> SÍ · NO · SÍ · NO · SÍ · NO.</div>
      <div><span class="pt">Actividad 4 · Con tus palabras (12 pts):</span> respuesta abierta. En la primera
        se valoran tres diferencias reales (nace/lo fabricaron, come/no come, siente/no siente, muere/se
        apaga). En la segunda, que nombre cosas de SU vida: dictar un mensaje, la cámara que encuentra
        caras, traducir un letrero, el teclado que adivina la palabra.</div>
      <div><span class="pt">Actividad 5 · La máquina ve puntitos (16 pts):</span> ${_res.todos.map(t => esc(t.n) + ' <b>' + t.coincide + '</b>').join(' · ')} de ${_res.total}
        → la máquina dice «<b>${esc(_res.mejor.n)}</b>» (${_res.mejor.coincide} de ${_res.total}); el alumno ve una cruz. Lo que se
        califica es la última pregunta: que diga que la máquina compara <b>casilla por casilla en el mismo sitio</b> y por eso una
        cruz movida ya no le coincide con su cruz. El juego en pareja no lleva respuesta.</div>
    </div>

    <div class="nota-doc">
      <b>Para qué sirve esta ficha, y qué NO hay que enseñar de más.</b> Es la etapa 1 de la Ruta de la
      Máquina que Aprende, escrita para I Ciclo. A esta edad no se explica cómo funciona una red neuronal ni
      se usan las palabras «dato», «etiqueta» o «entrenamiento»: eso entra en la etapa 2, con II Ciclo. Aquí
      lo que se busca es que el niño pueda decir tres cosas y sostenerlas: que la máquina <b>no está
      viva</b>, que <b>aprende de ejemplos</b> y que hay cosas que <b>no se le cuentan</b>.
      <br><br>
      <b>La Actividad 1 es el corazón de la ficha</b> y conviene no adelantar la respuesta. Casi todos los
      alumnos contestan bien las dos primeras y se equivocan al explicar las dos últimas: dicen que la
      máquina «está mala». Ahí es donde el maestro interviene con una sola pregunta: <b>¿le enseñaron
      alguna fruta parecida a esas dos?</b> Esa conversación es el aprendizaje; el resto de la ficha es el
      andamio.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>, y entra igual
      porque el alumno ya la usa. El propio currículo dice dónde va lo tecnológico en I y II Ciclo: dentro
      del bloque «Materia, energía y tecnología» de Ciencias Naturales, «a través de ejemplos sencillos de
      sus aplicaciones en la vida cotidiana». El porqué entero, el marco internacional del que sale y lo que
      a propósito NO se enseña están en <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>.
      <br><br>
      <b>La ficha y la misión salen del mismo archivo del proyecto</b> (js/data/ia-conceptos.js), así que no
      pueden decir cosas distintas. Etapa 1 de cuatro: después vienen cómo aprende una máquina, la historia
      completa y la IA generativa.
    </div>
`);

arma('fichas/ficha-que-es-la-ia.html', '¿Qué es la Inteligencia Artificial?', P);
