/* Ficha de la misión 75 · IA Generativa · III Ciclo */
'use strict';
const A = require('../arma-fichas-ia.js');
/* Las cuentas de las actividades de Descubre: la pauta se CALCULA de aquí, no se escribe. */
const D = require('../../js/data/ia-descubre.js');
const { esc, arma, portada, preguntas, clave, fichaConcepto, tablaReglas,
        IA_CONCEPTOS, IA_VERIFICA, IA_PIEZAS_PETICION } = A;

const EVAL = [
  { q: '¿Qué hace un modelo de lenguaje cuando te contesta?', o: ['Consulta una enciclopedia', 'Le pregunta a una persona', 'Copia una página', 'Predice la palabra siguiente más probable'], a: 3 },
  { q: '¿Qué es una alucinación?', o: ['Un virus', 'Un dato inventado dicho con toda seguridad', 'Un error de la pantalla', 'Una falla de la conexión'], a: 1 },
  { q: 'La IA te cita un libro perfecto para tu tema. ¿Qué haces?', o: ['Compruebo que exista', 'Lo cito, suena confiable', 'Le pregunto a la IA si existe', 'Le cambio el título'], a: 0 },
  { q: '¿Cuáles son las cuatro piezas de una petición?', o: ['Quién, cómo, cuándo y dónde', 'Título, cuerpo, firma y fecha', 'Contexto, tarea, formato y ejemplo', 'Saludo, pregunta, gracias y adiós'], a: 2 },
  { q: '¿Qué es una falsificación profunda?', o: ['Una foto movida', 'Un filtro de colores', 'Un error de la cámara', 'Foto, voz o video hechos para parecer reales'], a: 3 },
  { q: 'Te llega un audio de un familiar pidiendo dinero urgente. ¿Qué haces?', o: ['Lo llamo yo por otro medio', 'Le mando el dinero', 'Lo reenvío al grupo', 'Le contesto por audio'], a: 0 },
  { q: '¿Qué NO se le escribe nunca a un chat de IA?', o: ['Una duda de matemática', 'Una clave o tu dirección', 'Un texto tuyo para corregir', 'Una lista de ideas'], a: 1 },
  { q: '¿Por qué el tono seguro no prueba nada?', o: ['Porque escribe despacio', 'Porque siempre duda', 'Fue hecho para completar texto, no para comprobarlo', 'Porque no sabe escribir'], a: 2 },
  { q: 'Compartes sin comprobar algo que resultó falso. ¿Qué pasó?', o: ['Nada, no lo escribiste tú', 'Es culpa de la IA', 'No tiene importancia', 'Ayudaste a que la desinformación llegue más lejos'], a: 3 },
  { q: '¿Cuándo se declara que se usó IA en un trabajo?', o: ['Nunca, no hace falta', 'Siempre que se haya usado', 'Solo si sale mal', 'Solo si lo pregunta el maestro'], a: 1 },
];

const P = [];

P.push(portada('IA Generativa: úsala bien y no le creas todo',
  'Por qué un modelo de lenguaje PREDICE y no sabe. Qué es una alucinación y cómo verificar. Falsificación profunda, privacidad y honestidad.',
  'qr-mision-ia-generativa.png',
  ['Explicar que un modelo de lenguaje <strong>predice la palabra siguiente</strong>.',
   'Reconocer una <strong>alucinación</strong> y decir por qué ocurre.',
   'Aplicar los <strong>cinco pasos</strong> para verificar un dato.',
   'Escribir una petición con sus <strong>cuatro piezas</strong>.',
   'Reconocer una <strong>falsificación profunda</strong> y saber qué hacer.',
   'Distinguir usar la IA para <strong>aprender</strong> de usarla para <strong>entregar</strong>.']) + `
    <h2>💬 1. Lo que de verdad hace un chat de IA</h2>

    <p>Le escribimos una pregunta. Devuelve un párrafo redondo y seguro. Parece que lo <em>sabe</em>.
       <strong>No lo sabe.</strong> Hace otra cosa: <strong>predice la palabra siguiente más
       probable</strong>. Después la siguiente. Y la siguiente. Así arma el párrafo. <strong>No busca en
       una enciclopedia. No comprueba nada.</strong></p>

    <div class="ilus">
      <div class="ilus-t">Así arma una frase, paso por paso</div>
      <table>
        <tr><th style="width:46%">Lo que lleva escrito</th><th>Lo que puede venir detrás</th></tr>
        <tr><td>En el recreo los niños juegan…</td><td><b>al fútbol</b> · al trompo · a la rayuela</td></tr>
        <tr><td>…al fútbol…</td><td><b>en el patio</b> · en la cancha · bajo el palo de mango</td></tr>
        <tr><td>…en el patio…</td><td><b>hasta que suena el timbre</b> · toda la media hora</td></tr>
      </table>
      <p style="font-size:9pt;margin:4px 0 0;text-align:left;">En negrita, la que elegiría sola: la más
        probable. La frase sale bien porque cada pedazo es el que más veces vio venir detrás.</p>
    </div>

    <div class="caja aviso"><b>Y ahora la misma máquina, con un DATO.</b> «El Himno Nacional de Honduras
      tiene…» → lo más probable puede ser <b>«cinco estrofas»</b>. Y son <b>siete</b>. La máquina <b>no hizo
      nada distinto</b>: eligió lo más probable. Pero lo PROBABLE no era lo VERDADERO. <b>Eso es una
      alucinación.</b></div>
`);

P.push(`
    <h2>🌀 2. La alucinación</h2>

${IA_CONCEPTOS.filter(c => ['generativa', 'modelolenguaje', 'alucinacion'].includes(c.clave)).map(fichaConcepto).join('\n')}

    <div class="caja aviso"><b>No está mintiendo.</b> Mentir es decir algo falso a sabiendas. Él no sabe
      nada: completa texto. El que comprueba eres tú.
      <br><br><b>Lo que más inventa es lo que mejor suena:</b> títulos de libros, nombres de autores,
      artículos de leyes, porcentajes. Los arma para que encajen con tu tema. <b>Que suene perfecto es
      razón para desconfiar.</b></div>

    <div class="caja idea"><b>Lo que te cuesta a ti:</b> ese dato entra en tu tarea. De ahí pasa a tu guía
      de estudio y al examen. Y el maestro te lo marca en rojo.</div>

    <h2>🔎 3. Los cinco pasos para verificar</h2>

    <p>Van en este orden a propósito. El paso 1 descarta la mitad de los casos <strong>sin gastar datos de
       internet</strong>.</p>

    <table>
      <tr><th style="width:36%">El paso</th><th>Cómo se hace</th></tr>
${IA_VERIFICA.map(v => `      <tr><td class="k">${v.n}. ${esc(v.paso)}</td><td>${esc(v.detalle)}</td></tr>`).join('\n')}
    </table>

    <div class="caja truco"><b>Y lo que NO es verificar:</b> preguntarle otra vez a la misma IA. Ni juntar
      cinco páginas que copian lo mismo. Verificar es llegar a la <b>fuente</b>: el libro, la ley, la
      institución.</div>
`);

P.push(`
    <h2>🎭 4. Lo que se fabrica: imagen, voz y video</h2>

${IA_CONCEPTOS.filter(c => ['deepfake', 'privacidad', 'verificar'].includes(c.clave)).map(fichaConcepto).join('\n')}

    <div class="dos">
      <div class="dB"><b>🚨 Cómo se usa para dañar</b>
        <ul><li>Estafas por audio: «soy tu tío, mandame dinero».</li>
            <li>Humillar con una imagen fabricada.</li>
            <li>Noticias falsas, con foto.</li>
            <li>Cada vez cuesta más notarlo.</li></ul>
      </div>
      <div class="dA"><b>🛡️ Cómo te defiendes</b>
        <ul><li>Comprueba <strong>por otro camino</strong>: llama tú.</li>
            <li>Pregunta a alguien más de la familia.</li>
            <li>Busca de dónde salió la foto.</li>
            <li>No reenvíes lo que no comprobaste.</li></ul>
      </div>
    </div>

    <h2>⚙️ 5. Cuatro palabras de cómo funciona por dentro</h2>

    <p>No hace falta saber construir una. Sí saber de qué se habla:</p>

${IA_CONCEPTOS.filter(c => ['algoritmo', 'red', 'modelo', 'peticion'].includes(c.clave)).map(fichaConcepto).join('\n')}

    <h2>🧱 6. Las cuatro piezas de una petición</h2>

    <p>La misma pregunta, escrita de dos maneras, da dos respuestas distintas. Una buena petición lleva
       estas cuatro:</p>

    <table>
      <tr><th style="width:16%">Pieza</th><th style="width:34%">Qué contesta</th><th>Ejemplo</th></tr>
${IA_PIEZAS_PETICION.map(p => `      <tr><td class="k">${p.emoji} ${esc(p.pieza)}</td><td>${esc(p.pregunta)}</td><td><em>${esc(p.ejemplo)}</em></td></tr>`).join('\n')}
    </table>

    <div class="caja truco"><b>Y lo que NO es una pieza:</b> saludar, dar las gracias, escribir en
      mayúsculas, repetir la pregunta o decirle que es muy inteligente. Nada de eso le dice qué
      quieres.</div>
`);

P.push(`
    <div class="acts">
      <h3>🔎 Actividad 1 · Cazador de inventos <span class="val">(20 pts)</span></h3>

      <p>El párrafo de abajo <strong>lo escribió una IA</strong>. Es inventado a propósito. No se pregunta
         si es verdad: se pregunta <strong>qué hay que comprobar antes de usarlo</strong>.
         <strong>Subraya</strong> los pedazos que hay que verificar. Deja los que solo son opinión.</p>

      <div class="ilus" style="text-align:left">
        <div class="ilus-t">Texto generado por una IA</div>
        <p style="font-size:11pt;line-height:1.9;margin:0">El parque municipal de la ciudad fue inaugurado
          en 1968 y tiene una extensión de 42 manzanas. Es un lugar agradable para caminar por la tarde.
          Según el libro «Parques de Centroamérica», de la doctora Elena Ramírez, alberga 37 especies de
          aves. Conviene visitarlo temprano, cuando hay menos gente. La alcaldía lo declaró patrimonio
          municipal el 3 de marzo de 2011.</p>
      </div>

      <p><strong>Y ahora lo que de verdad se califica:</strong> elige <strong>dos</strong> pedazos
         subrayados y escribe <strong>cómo</strong> los comprobarías.</p>
      <ol>
        <li><span class="linea-resp" style="min-width:100%"></span>
            <span class="linea-resp" style="min-width:100%"></span></li>
        <li><span class="linea-resp" style="min-width:100%"></span>
            <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>

      <h3>🧱 Actividad 2 · Arma una petición completa <span class="val">(16 pts)</span></h3>

      <p>Piensa en algo que necesites para una de tus clases. Escribe la petición con sus cuatro
         piezas:</p>

      <table>
        <tr><td class="k" style="width:20%">👤 Contexto</td><td><span class="linea-resp" style="min-width:100%"></span></td></tr>
        <tr><td class="k">🎯 Tarea</td><td><span class="linea-resp" style="min-width:100%"></span></td></tr>
        <tr><td class="k">📐 Formato</td><td><span class="linea-resp" style="min-width:100%"></span></td></tr>
        <tr><td class="k">🧩 Ejemplo</td><td><span class="linea-resp" style="min-width:100%"></span></td></tr>
      </table>
    </div>
`);

P.push(`
    <div class="acts">
      <h3>🚨 Actividad 3 · ¿Qué es cada caso? <span class="val">(12 pts)</span></h3>

      <p>Escribe <strong>A</strong> (alucinación), <strong>F</strong> (falsificación profunda) o
         <strong>P</strong> (problema de privacidad):</p>

      <ol>
        <li>Un chat inventa un libro que no existe. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Un audio imita la voz de tu tío y te pide dinero. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Escribiste la dirección de tu casa en un chat. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Te da una fecha con seguridad, y está mala. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Un video de alguien diciendo lo que nunca dijo. <span class="linea-resp" style="min-width:50px"></span></li>
        <li>Subiste una foto de tus compañeros sin preguntarles. <span class="linea-resp" style="min-width:50px"></span></li>
      </ol>

      <h3>💡 Actividad 4 · Explica con tus palabras <span class="val">(12 pts)</span></h3>

      <ol>
        <li>¿Por qué el tono seguro no prueba que el dato sea bueno?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
        <li>¿Qué diferencia hay entre usar la IA para aprender y para entregar?
          <span class="linea-resp" style="min-width:100%"></span>
          <span class="linea-resp" style="min-width:100%"></span></li>
      </ol>

      <h3>🗣️ Actividad 5 · Investiga en tu comunidad <span class="val">(sin respuesta, a propósito)</span></h3>

      <p>Habla con alguien que trabaje: en una pulpería, en la alcaldía, en una finca. Pregúntale si usa
         alguna herramienta de Inteligencia Artificial. Después escribe:</p>
      <ol>
        <li>Qué tareas suyas podría hacer una máquina.</li>
        <li>Qué tareas necesitan una persona delante, y por qué.</li>
        <li>Qué opina esa persona.</li>
      </ol>
    </div>
`);

// ── Descubre, en papel · 🕵️ ¿Se puede comprobar? y 🔮 un escenario ────────
/* Los textos y el escenario salen de IA_COMPROBAR e IA_ESCENARIOS, los
   mismos de la pantalla; la pauta se calcula de ahí. */
const _tx = D.IA_COMPROBAR.filter(t => t.k === 'escuela' || t.k === 'remedio');
const _esc1 = D.IA_ESCENARIOS[0];
P.push(`
    <div class="acts">
      <h3>🕵️ Actividad 6 · ¿Se puede comprobar? <span class="val">(14 pts)</span></h3>

      <p>Estos dos textos se escribieron para este ejercicio. No te preguntamos si los escribió una
         máquina: eso no lo aciertan ni los expertos. Te preguntamos, afirmación por afirmación, si
         <strong>trae con qué comprobarse</strong>. Escribe <strong>SÍ</strong> o <strong>NO</strong>:</p>

${_tx.map(t => '      <div class="ilus"><div class="ilus-t">' + t.e + ' ' + esc(t.titulo) + '</div><ol>' + t.trozos.map(z => '<li>' + esc(z.t) + ' <span class="linea-resp" style="min-width:45px"></span></li>').join('') + '</ol></div>').join('\n')}

      <p>¿Cuál de los dos está mejor escrito? <span class="linea-resp" style="min-width:120px"></span> ¿Y cuál se puede
         comprobar? <span class="linea-resp" style="min-width:120px"></span></p>

      <h3>🔮 Actividad 7 · Un escenario por venir: tú decides <span class="val">(sin respuesta única, a propósito)</span></h3>

      <p><strong>${esc(_esc1.quien)}</strong> se juega ${esc(_esc1.cuesta)}. ${esc(_esc1.situacion)}</p>
      <p>Rellena el círculo de lo que harías tú, y escribe abajo tu regla:</p>
      <div class="preg-ops">
${_esc1.ops.map(o => '        <div class="op full"><i></i>' + esc(o.t) + '</div>').join('\n')}
      </div>
      <p>Mi regla, en una línea:<br><span class="linea-resp" style="min-width:100%"></span></p>
      <div class="caja idea"><b>El escenario es inventado para pensar.</b> Está armado con algo que ya se
        puede hacer: una voz se fabrica con unos segundos de audio.</div>
    </div>
`);

P.push(`
    <h2>🔒 7. Las tres reglas de oro</h2>

    <p>Son las mismas tres de la etapa 1, sin cambiar una palabra. Lo que cambió es que ahora ya sabes
       <strong>por qué</strong>.</p>

${tablaReglas()}

    <h2 data-hoja-propia>🎓 Evaluación · Rellena el círculo de la respuesta correcta <span style="font-size:9.5pt;font-weight:400">(40 pts · 4 cada una)</span></h2>

${preguntas(EVAL)}
`);

P.push(`
    <h2>🔑 Pauta de corrección y nota para el docente</h2>

    <div class="pauta">
      <div><span class="pt">Evaluación (40 pts):</span> ${clave(EVAL)}</div>
      <div><span class="pt">Actividad 1 · Cazador de inventos (20 pts):</span> hay que subrayar cinco
        pedazos: <b>«fue inaugurado en 1968»</b> (una fecha), <b>«tiene una extensión de 42 manzanas»</b>
        (un número con unidad), <b>«Según el libro "Parques de Centroamérica", de la doctora Elena
        Ramírez»</b> (una cita con autor y título: es lo que estos programas inventan más), <b>«alberga 37
        especies de aves»</b> (otro número, y atribuido a esa cita: si la cita no existe, el número tampoco)
        y <b>«el 3 de marzo de 2011»</b> con el acto de la alcaldía. NO se subrayan «es un lugar agradable»
        ni «conviene visitarlo temprano»: eso no se verifica, se juzga con la cabeza. Los 20 puntos se
        reparten sobre todo en las dos explicaciones de CÓMO comprobar, no en el subrayado.</div>
      <div><span class="pt">Actividad 2 · Arma una petición (16 pts):</span> 4 puntos por pieza. Se valora
        que el contexto diga grado y materia, que la tarea sea concreta, que el formato diga extensión o
        forma, y que el ejemplo diga a qué se tiene que parecer. Una pieza con un saludo o un halago vale 0.</div>
      <div><span class="pt">Actividad 3 · ¿Qué es cada caso? (12 pts):</span> A · F · P · A · F · P.</div>
      <div><span class="pt">Actividad 4 · Con tus palabras (12 pts):</span> respuesta abierta.
        1) Porque fue hecho para completar texto, no para comprobarlo: escribe igual de seguro cuando
        acierta que cuando inventa. 2) Que en un caso aprende él y puede defender lo que escribió, y en el
        otro entrega algo que no hizo; y que cuando se usa, se declara.</div>
      <div><span class="pt">Actividad 5 · Investiga:</span> <b>no lleva respuesta a propósito.</b> Se valora
        que haya hablado con una persona real, que distinga tareas mecánicas de las que piden criterio, y
        que recoja la opinión sin corregirla.</div>
      <div><span class="pt">Actividad 6 · ¿Se puede comprobar? (14 pts):</span>
        ${_tx.map(t => esc(t.titulo) + ': ' + t.trozos.map(z => '<b>' + (z.c ? 'SÍ' : 'NO') + '</b>').join(' · ')).join(' &nbsp;|&nbsp; ')}.
        El mejor escrito («${esc(_tx[1].titulo)}») no trae nada comprobable: lo bien escrito no es lo verdadero.</div>
      <div><span class="pt">Actividad 7 · Un escenario por venir:</span> <b>no lleva respuesta única a propósito.</b> Se califica la
        regla escrita: que sirva para no mandar dinero por una voz. La primera decisión pierde el dinero; la misión lo cuenta.</div>
    </div>

    <div class="nota-doc">
      <b>Esta es la hoja que más le va a servir al alumno esta semana,</b> y conviene decirlo así en clase.
      No es una advertencia contra la Inteligencia Artificial: es el manual para usarla sin salir
      perjudicado. La va a usar con o sin nuestro permiso; lo que está en nuestra mano es que sepa que
      <b>predice</b> y no sabe, y que un dato se comprueba antes de usarlo.
      <br><br>
      ⚠️ <b>El párrafo de la Actividad 1 es inventado, y está dicho en la hoja con esas palabras.</b> No hay
      que corregirlo como si fuera un texto sobre un parque real: lo que se practica son los TIPOS de dato
      que hay que verificar (nombres, fechas, números y citas), no si ese párrafo acierta. Publicar aquí
      datos sin acreditar sería exactamente lo que esta ficha enseña a no hacer.
      <br><br>
      <b>Y la misión NO manda al alumno a ninguna IA en línea.</b> El predictor, el cazador de inventos y el
      armador de peticiones corren dentro del teléfono, sin una sola petición hacia afuera: las misiones de
      M.E.T.A.S funcionan sin señal, y mandar a un niño desde la escuela a un chat de IA es mandarlo a una
      pantalla donde lo que pasa después no lo eligió nadie.
      <br><br>
      <b>De dónde sale esta materia.</b> La Inteligencia Artificial <b>no está en el DCNB</b>, pero esta
      etapa cumple de frente una expectativa de logro del área de Tecnología de III Ciclo, que sí está:
      «Seleccionar, obtener, almacenar y <b>evaluar la información</b>, optando por los recursos
      informáticos». Esa expectativa se escribió para la época del buscador; hoy la información la escribe
      una máquina que no firma nada, y evaluarla es exactamente esto. El porqué entero está en
      <b>CURRICULA-INTELIGENCIA-ARTIFICIAL.md</b>.
      <br><br>
      <b>La ficha y la misión salen del mismo archivo del proyecto</b> (js/data/ia-conceptos.js), así que no
      pueden decir cosas distintas. Etapa 4 y última de la Ruta de la Máquina que Aprende.
    </div>
`);

arma('fichas/ficha-ia-generativa.html', 'IA Generativa', P);
