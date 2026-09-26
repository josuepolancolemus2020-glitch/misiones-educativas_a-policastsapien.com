/* Ficha de la misión 74 · La Historia de la Inteligencia Artificial · II y III Ciclo */
'use strict';
const A = require('../arma-fichas-ia.js');
/* Las cuentas de las actividades de Descubre: la pauta se CALCULA de aquí, no se escribe. */
const D = require('../../js/data/ia-descubre.js');
const { esc, arma, portada, preguntas, clave, IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS } = A;

const EVAL = [
  { q: '¿Quién preguntó si las máquinas pueden pensar?', o: ['Warren McCulloch', 'Frank Rosenblatt', 'Alan Turing', 'Joseph Weizenbaum'], a: 2 },
  { q: '¿Dónde nació el nombre del campo?', o: ['En un taller del Dartmouth College', 'En una fábrica de teléfonos', 'En un concurso de ajedrez', 'En una escuela de Londres'], a: 0 },
  { q: '¿Qué enseñó ELIZA?', o: ['Que las máquinas ya entendían', 'Que las máquinas sienten', 'Que el ajedrez es fácil', 'Que algo puede contestar como persona sin entender nada'], a: 3 },
  { q: '¿Por qué hubo dos inviernos de la IA?', o: ['Se prohibió investigar', 'Se prometió de más y se cortó el dinero', 'Se perdieron los programas', 'Se acabó la luz'], a: 1 },
  { q: '¿Cómo le ganaba Deep Blue al campeón de ajedrez?', o: ['Aprendiendo de sus partidas', 'Preguntándole a un experto', 'Calculando muchísimas jugadas por segundo', 'Copiando a los campeones'], a: 2 },
  { q: '¿Qué pasó el año en que las máquinas aprendieron a ver?', o: ['Una red profunda ganó el concurso de reconocer imágenes', 'Se inventó la cámara', 'Nació el primer robot', 'Se inventó internet'], a: 0 },
  { q: '¿Cómo aprendió AlphaGo?', o: ['Con un libro de aperturas', 'Jugando millones de partidas contra sí mismo', 'Con fotos etiquetadas', 'Leyendo reglas escritas'], a: 1 },
  { q: '¿De qué año es la manera nueva de armar redes de texto?', o: ['De 1936', 'De 1966', 'De 2012', 'De 2017'], a: 3 },
  { q: '¿Cuáles son las tres patas?', o: ['Robots, sensores y motores', 'Luz, papel y suerte', 'Datos, cómputo y algoritmos', 'Internet, teléfonos y satélites'], a: 2 },
  { q: '¿Qué pasó cuando un chat de IA generativa se abrió al público?', o: ['Se apagaron las computadoras', 'Se prohibió', 'Nada cambió', 'Salió de los laboratorios y entró en las tareas escolares'], a: 3 },
];

/* La línea del tiempo se arma de js/data/ia-historia.js: aquí NO se escribe ni
   un año a mano. Es la regla que más caro cuesta saltarse, porque una fecha
   equivocada se imprime igual de bien que una verdadera. */
const hito = h => `    <div class="cficha">
      <div class="cf-tit">${h.emoji} ${esc(h.anio)} · ${esc(h.titulo)}</div>
      <div class="cf-ej">👤 ${esc(h.quien)}</div>
      <div class="cf-def"><b>Qué pasó:</b> ${esc(h.que)}</div>
      <div class="cf-def"><b>Por qué importa:</b> ${esc(h.porque)}</div>
      <div class="cf-ej">📚 <b>Qué lo acredita:</b> ${esc(h.acredita)}</div>
    </div>`;

const P = [];

P.push(portada('La Historia de la Inteligencia Artificial',
  'De la pregunta de Alan Turing en 1950 al chat de hoy. Quince hitos, cada uno con el documento que lo acredita.',
  'qr-mision-historia-ia.png',
  ['Ubicar los hitos de la Inteligencia Artificial en una <strong>línea del tiempo</strong>.',
   'Distinguir <strong>cuándo se tuvo la idea</strong> de <strong>cuándo llegó al público</strong>.',
   'Explicar qué fueron los <strong>dos inviernos</strong> y por qué pasaron.',
   'Nombrar las <strong>tres patas</strong>: datos, cómputo y algoritmos.',
   'Citar, de cada hito, <strong>qué documento o hecho lo acredita</strong>.',
   'Oír una promesa de hoy y <strong>preguntar</strong>, en vez de creerla o burlarse.']) + `
    <h2>📜 1. Esto no empezó en 2022</h2>

    <p>Mucha gente cree que la Inteligencia Artificial nació con el chat. <strong>No.</strong>
       La pregunta es de <strong>1950</strong> y el nombre, de <strong>1956</strong>.
       En medio hay <strong>setenta años</strong> y dos fracasos grandes.</p>

    <div class="caja truco"><b>Esto sirve para dos cosas.</b> Una: la IDEA y el PÚBLICO no llegan el mismo
      día. La pieza de los chats es de 2017; el chat, de 2022.<br><br>
      Y dos: esto ya prometió de más dos veces. Quien conoce esos inviernos oye una promesa y
      <b>pregunta</b>.</div>

    <h2>🕰️ 2. Las cuatro edades</h2>

    <p>La historia de la IA no es una línea recta. Son cuatro tramos, y dos son caídas:</p>

    <table>
      <tr><th style="width:30%">La edad</th><th style="width:22%">Cuándo</th><th>Qué pasó</th></tr>
${IA_EPOCAS.map(e => `      <tr><td class="k">${e.emoji} ${esc(e.nombre)}</td><td>${esc(e.rango)}</td><td>${esc(e.resumen)}</td></tr>`).join('\n')}
    </table>

    <h2>🏗️ 3. Las tres patas</h2>

    <p>Esto despegó cuando se juntaron <strong>tres cosas a la vez</strong>. Y son a la vez:
       <strong>faltando una, no pasa</strong>.</p>

    <table>
      <tr><th style="width:18%">La pata</th><th>Qué aporta</th><th style="width:34%">Qué pasaba antes</th></tr>
${IA_TRES_PATAS.map(p => `      <tr><td class="k">${p.emoji} ${esc(p.pata)}</td><td>${esc(p.que)}</td><td>${esc(p.antes)}</td></tr>`).join('\n')}
    </table>

    <div class="caja idea">Las ideas de los años ochenta no estaban mal. Faltaban los millones de fotos
      etiquetadas y las máquinas para entrenarlas. La misma idea, veinte años después, funcionó.</div>
`);

// Los quince hitos, repartidos de tres en tres. El repartidor los recoloca.
for (let i = 0; i < IA_HITOS.length; i += 4) {
  const tramo = IA_HITOS.slice(i, i + 4);
  P.push(`
    <h2>🗓️ ${i === 0 ? '4. La línea del tiempo, hito por hito' : '4. La línea del tiempo (continuación)'}</h2>
${i === 0 ? `
    <p>De cada hito: qué pasó, por qué importa y <strong>qué documento lo acredita</strong>. Lo último no es
       papeleo. Aquí se copian fechas, y una fecha equivocada no se nota: se estudia y se escribe en el
       examen.</p>
` : ''}
${tramo.map(hito).join('\n')}
`);
}

P.push(`
    <h2>❄️ 5. ${esc(IA_LECCION_INVIERNOS.titulo)}</h2>

    <p>${esc(IA_LECCION_INVIERNOS.texto)}</p>

    <div class="caja aviso"><b>Y esto vale para hoy:</b> ${esc(IA_LECCION_INVIERNOS.hoy)}</div>

    <div class="acts">
      <h3>🗓️ Actividad 1 · Ordena la línea del tiempo <span class="val">(20 pts)</span></h3>

      <p>Numera del <strong>1</strong> (el más antiguo) al <strong>8</strong> (el más reciente):</p>

      <table>
        <tr><td style="width:50%"><span class="linea-resp" style="min-width:30px"></span> AlphaGo gana al Go</td><td><span class="linea-resp" style="min-width:30px"></span> Nace el nombre en Dartmouth</td></tr>
        <tr><td><span class="linea-resp" style="min-width:30px"></span> Deep Blue gana al ajedrez</td><td><span class="linea-resp" style="min-width:30px"></span> La pregunta de Turing</td></tr>
        <tr><td><span class="linea-resp" style="min-width:30px"></span> Un chat de IA llega al público</td><td><span class="linea-resp" style="min-width:30px"></span> ELIZA conversa con la gente</td></tr>
        <tr><td><span class="linea-resp" style="min-width:30px"></span> El artículo del transformador</td><td><span class="linea-resp" style="min-width:30px"></span> Las máquinas aprenden a ver</td></tr>
      </table>

      <h3>🔗 Actividad 2 · Uní cada año con lo que pasó <span class="val">(16 pts)</span></h3>

      <table>
        <tr><th style="width:18%">Año</th><th>Escribe la letra</th><th>Lo que pasó</th></tr>
        <tr><td class="k">1950</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>A.</b> Una máquina gana al campeón mundial de ajedrez</td></tr>
        <tr><td class="k">1956</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>B.</b> Un chat de IA generativa se abre al público</td></tr>
        <tr><td class="k">1966</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>C.</b> «¿Pueden pensar las máquinas?»</td></tr>
        <tr><td class="k">1997</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>D.</b> Se presenta el transformador</td></tr>
        <tr><td class="k">2012</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>E.</b> ELIZA conversa sin entender nada</td></tr>
        <tr><td class="k">2016</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>F.</b> El campo estrena nombre</td></tr>
        <tr><td class="k">2017</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>G.</b> Las máquinas aprenden a ver</td></tr>
        <tr><td class="k">2022</td><td><span class="linea-resp" style="min-width:40px"></span></td><td><b>H.</b> AlphaGo gana al Go</td></tr>
      </table>
    </div>
`);

P.push(`
    <div class="acts">
      <h3>💡 Actividad 3 · Explica con tus palabras <span class="val">(24 pts)</span></h3>

      <ol>
        <li>¿Por qué se dice que la Inteligencia Artificial no nació en 2022?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿Qué fueron los dos inviernos y qué enseñan?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿En qué se diferencia lo que hizo Deep Blue en 1997 de lo que hizo AlphaGo en 2016?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>

      <h3>🔭 Actividad 4 · Investiga <span class="val">(sin respuesta en esta hoja, a propósito)</span></h3>

      <p>La línea del tiempo llega hasta hoy y <strong>se queda abierta</strong>. Lo que venga lo escriben
         personas, y algunas están en esta aula.</p>

      <ol>
        <li>Busca en una noticia o en un video una promesa de HOY sobre la Inteligencia Artificial.
            Escribila tal cual.</li>
        <li>¿Quién la hace, y qué gana si la gente se la cree?</li>
        <li>¿Para cuándo la promete? ¿Una fecha, o un «pronto»?</li>
        <li>Sabiendo lo de los dos inviernos, ¿qué le preguntarías a quien la hizo?</li>
      </ol>

      <div class="caja idea"><b>Esta actividad no trae respuesta, y no es un descuido: no la hay.</b>
        Se evalúa que el alumno pregunte con criterio, no que acierte lo que va a pasar.</div>
    </div>
`);

// ── Descubre, en papel · 🗓️ ¿Cuánto tardó? y ✍️ el hito de este año ───────
/* Los años NO se escriben: salen de IA_HITOS, que es el único sitio donde
   vive una fecha, y la pauta se calcula. */
const _par = p => ({ A: IA_HITOS.find(h => String(h.anio) === p.a), B: IA_HITOS.find(h => String(h.anio) === p.b), anos: parseInt(p.b, 10) - parseInt(p.a, 10) });
P.push(`
    <div class="acts">
      <h3>🗓️ Actividad 5 · ¿Cuánto tardó? <span class="val">(10 pts)</span></h3>

      <p>Entre la idea y el día en que funciona pasa media vida. <strong>Primero adivina</strong> cuántos
         años separan cada par, sin mirar arriba. <strong>Después</strong> búscalos y saca la cuenta:</p>

      <table>
        <tr><th>De…</th><th>…a</th><th style="width:16%">Mi cálculo</th><th style="width:16%">De verdad</th></tr>
${D.IA_TIEMPO_PARES.map(p => { const q = _par(p); return '        <tr><td>' + q.A.emoji + ' ' + esc(q.A.titulo) + '</td><td>' + q.B.emoji + ' ' + esc(q.B.titulo) + '</td><td><span class="linea-resp" style="min-width:40px"></span> años</td><td><span class="linea-resp" style="min-width:40px"></span> años</td></tr>'; }).join('\n')}
      </table>
      <p>¿Qué faltó todo ese tiempo, si la idea ya estaba? <span class="linea-resp" style="min-width:60%"></span></p>

      <h3>✍️ Actividad 6 · El hito de este año <span class="val">(sin respuesta, a propósito)</span></h3>

      <p>Escribe tú el hito de este año, con las mismas piezas que llevan los de arriba. La última es la
         que más cuesta.</p>
      <ol>
        <li>¿Qué pasó, o qué se promete? <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿Quién lo dice, y qué gana diciéndolo? <span class="linea-resp" style="min-width:100%"></span></li>
        <li>Si es una promesa, ¿para cuándo? <span class="linea-resp" style="min-width:60%"></span></li>
        <li>¿Dónde lo leíste o lo oíste? (sin fuente no es un hito: es un rumor) <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>
      <div class="caja idea"><b>Si es una promesa, apunta la fecha.</b> Dentro de un año vuelve a esta hoja
        y mira si se cumplió. Así se distingue un hito de un invierno.</div>
    </div>
`);

P.push(`
    <h2 data-hoja-propia>🔓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}
`);

P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Ordena la línea del tiempo (20 pts):</span>
        AlphaGo <b>6</b> · Dartmouth <b>2</b> · Deep Blue <b>4</b> · La pregunta de Turing <b>1</b> ·
        El chat al público <b>8</b> · ELIZA <b>3</b> · El transformador <b>7</b> · Las máquinas ven <b>5</b>.</div>
      <div><span class="pt">Actividad 2 · Uní cada año (16 pts):</span>
        1950-C · 1956-F · 1966-E · 1997-A · 2012-G · 2016-H · 2017-D · 2022-B.</div>
      <div><span class="pt">Actividad 3 · Con tus palabras (24 pts):</span> respuesta abierta.
        1) Que nombre 1950, 1956 y 1966, y que distinga la idea de su llegada al público.
        2) Que sean dos períodos en que el campo casi se para porque se prometió de más, y que la
        lección es sobre la CONFIANZA, no sobre la tecnología.
        3) Que Deep Blue calculaba y AlphaGo aprendió jugando contra sí mismo, porque en el Go hay
        demasiadas jugadas.</div>
      <div><span class="pt">Actividad 4 · Investiga:</span> <b>no lleva respuesta a propósito.</b> Se valora
        que copie la promesa tal cual, que diga quién la hace y qué gana, que note si hay fecha, y que su
        pregunta final sea comprobable.</div>
      <div><span class="pt">Actividad 5 · ¿Cuánto tardó? (10 pts):</span>
        ${D.IA_TIEMPO_PARES.map(p => { const q = _par(p); return esc(p.a) + '→' + esc(p.b) + ' <b>' + q.anos + '</b>'; }).join(' · ')} años.
        Se califica la cuenta, no el cálculo a ojo: adivinar mal es parte del ejercicio. En la última
        pregunta se valora que nombre las tres patas, no «que no sabían».</div>
      <div><span class="pt">Actividad 6 · El hito de este año:</span> <b>no lleva respuesta a propósito.</b>
        Se valora que traiga fuente, que distinga lo que pasó de lo que se promete, y que si es promesa
        lleve fecha.</div>
    </div>

    <div class="nota-doc">
      <b>De dónde sale cada fecha, y la regla que no se salta.</b> Este repositorio no tiene una biblioteca
      de historia de la computación. Así que cada hito trae escrito <b>el documento o el hecho público que
      lo sostiene</b>: un artículo con su revista, una propuesta con su nombre, una partida jugada en
      público. Donde la fecha se discute, se escribe la DÉCADA: los dos inviernos van como períodos porque
      nadie se pone de acuerdo en el día. Y no se escribe ninguna cifra de producto: eso cambia cada mes, y
      esta hoja se guarda un año en una gaveta.
      <br><br>
      <b>Lo que más cuesta enseñar aquí</b> no es memorizar años. Es que el alumno distinga <b>cuándo se
      tuvo la idea</b> de <b>cuándo llegó al público</b>. El transformador es de 2017 y el chat de 2022, y
      esos cinco años son el error más común. Si un alumno se lleva solo eso, la hoja cumplió.
      <br><br>
      <b>La ficha y la misión salen del mismo archivo</b> (js/data/ia-historia.js), así que no pueden decir
      fechas distintas. La pantalla no tiene ni un año escrito a mano: los pinta de ahí, y
      <b>node _dev/verifica-ia.js</b> compara las dos hito por hito. Etapa 3 de cuatro.
    </div>
`);

arma('fichas/ficha-historia-ia.html', 'La Historia de la Inteligencia Artificial', P);
