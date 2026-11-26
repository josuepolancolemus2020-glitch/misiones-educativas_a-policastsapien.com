/* ============================================================
   M.E.T.A.S · Misión Conversar en lengua estándar · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n1-conversacion.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n1-conversacion`; la ficha no se
   edita a mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA, y es a propósito: la ficha impresa, su QR
     (`img/qr-mision-n1-conversacion.png`) y el enlace desde la misión se
     hacen cuando la misión entra al catálogo. Mientras tanto las sondas
     la arman en la memoria y le exigen lo mismo que a una armada.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (otra situación, otra frase);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con lo que pasa en una
         escena corta (Karla en la dirección), no con su definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.

   ► De dónde sale lo que afirma: de las mismas fuentes que la misión
     (la programación de 7.º a 9.º, PDF pp. 7, 15 y 23, y el DCNB, pp. 84
     a 86, 116 a 118, 149 y 157 a 160; para Media, el programa de 10.º,
     CE1.2). Lo que se suavizó está anotado en la cabecera de
     `contenido.js`: los niveles se explican por su nombre y con ejemplos,
     «lengua estándar» lleva una descripción de trabajo, y de las
     funciones del lenguaje solo van los nombres.

   ► Cada tema dice para qué grado es, igual que en la misión.
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n1-conversacion',
  mision: 'Conversar en lengua estándar',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato',
  tema: 'La conversación en lengua estándar, el lenguaje verbal y no verbal, las formas de hablar en grupo y los niveles de uso de la lengua',
  qr: 'qr-mision-n1-conversacion.png',

  estilos: `
  /* La etiqueta del grado: lleva texto, no solo color. */
  .gr { display: inline-block; font-size: 8pt; font-weight: 700; padding: 0 6px; border-radius: 9px; border: 1px solid var(--materia); color: var(--materia-osc); background: #fff; margin-left: 4px; vertical-align: middle; white-space: nowrap; }
  h2 .gr { border-color: #fff; }
  /* Lo mismo dicho de dos maneras */
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .dos > div { border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; border: 1.5px solid var(--linea); background: #fff; }
  .dos b { display: block; font-size: 9.5pt; margin-bottom: 2px; color: var(--materia-osc); }
  /* El recuadro de Media */
  .media { border: 1.5px solid var(--materia); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10pt; background: var(--papel); break-inside: avoid; }
  .media b { color: var(--materia-osc); }
  /* La escena de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .dos > div, .media, .historia, .gr { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Usar la <strong>lengua estándar</strong> y las <strong>fórmulas sociales de intercambio</strong> cuando la situación lo pide.',
    'Distinguir el <strong>lenguaje verbal</strong> del <strong>no verbal</strong> y reconocer lo que comunican la <strong>entonación, el énfasis y las pausas</strong>.',
    'Reconocer la <strong>charla</strong>, el <strong>diálogo</strong>, el <strong>trabajo de equipo</strong> y la <strong>asamblea escolar</strong>, y participar respetando los turnos.',
    'Identificar los <strong>niveles de uso de la lengua</strong> y elegir el que conviene a cada situación.',
    'Usar un <strong>lenguaje libre de discriminación</strong> y respetar las formas de hablar de los demás.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '🗣️ 1. Conversar en lengua estándar <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { p: 'En tu casa hablas de una manera y con tus amigos, de otra. La <strong>lengua estándar</strong> es la forma de hablar que <strong>se entiende en todo el país</strong> y que se usa en la escuela, en un trámite o ante un grupo. No reemplaza tu manera de hablar en casa: <strong>se suma</strong> a ella.' },
      { caja: 'regla', html: '⚡ <b>Las fórmulas sociales de intercambio</b> <span class="gr">9.º</span> son las frases de trato que todos esperan en una conversación: <strong>saludar, despedirse, dar las gracias y respetar el uso de la palabra</strong>.' },
      { tabla: { cab: ['Fórmula social', 'Cuándo se usa', 'Ejemplo'], filas: [
        ['👋 Saludar', 'Al llegar a un lugar o al encontrarte con alguien.', '«Buenos días, ¿cómo ha estado?»'],
        ['🚪 Despedirse', 'Antes de irte.', '«Hasta luego, que le vaya bien».'],
        ['🙏 Dar las gracias', 'Cuando recibes un favor o una atención.', '«Muchas gracias, muy amable».'],
        ['✋ Respetar el uso de la palabra', 'Cuando otra persona está hablando.', 'Levantas la mano y esperas.']
      ] } },
      { caja: 'idea', html: '💡 <b>Las fórmulas de cortesía</b> acompañan a las fórmulas sociales: «por favor», «con permiso», «disculpe». Con ellas, cualquier petición se recibe mejor.' },
      { h3: '🔬 Minidemostración' },
      { html: `<div class="ilus">
      <div class="ilus-t">Brayan necesita una constancia de estudios. Quiere lo mismo las dos veces: lo que cambia es cómo lo dice.</div>
      <div class="dos">
        <div><b>🙈 Sin mirar al director</b>«Profe, deme el papel ese». El director no supo de qué papel le hablaba.</div>
        <div><b>🤝 En lengua estándar</b>«Buenos días, director. ¿Sería tan amable de darme una constancia de estudios?». En cinco minutos la tenía.</div>
      </div>
    </div>` }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { h2: '💬 2. Lo verbal y lo no verbal <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>', pegado: true },
      { tabla: { cab: ['Lenguaje', 'Cómo comunica', 'Ejemplos'], filas: [
        ['💬 Verbal', 'CON PALABRAS, habladas o escritas.', 'una conversación, una charla, una carta, un mensaje de texto'],
        ['🙌 No verbal', 'SIN PALABRAS.', 'los gestos, las expresiones del rostro, la mirada, la postura, las señales, los íconos, los símbolos']
      ] } },
      { caja: 'idea', html: '💡 <b>Cuando los dos no coinciden:</b> si dices «sí, te escucho» sin dejar de ver el teléfono, tus palabras dicen una cosa y tu cuerpo, otra. Así nacen los <strong>malentendidos</strong>: quien escucha entiende otra cosa que la que quisiste decir.' },
      { h2: '🎵 3. La voz también habla <span class="gr">8.º</span>' },
      { p: 'Con las <strong>mismas palabras</strong> puedes decir cosas distintas. Lo deciden tres indicadores de tu <strong>intención</strong>, que es lo que buscas al hablar (pedir, avisar, bromear o regañar):' },
      { html: `<div class="pasos">
      <div><span class="pn">1</span><b>🎵 Entonación</b>La voz sube o baja: la frase suena a pregunta, a orden o a broma.</div>
      <div><span class="pn">2</span><b>🔊 Énfasis</b>Se dice con más fuerza la palabra que más importa.</div>
      <div><span class="pn">3</span><b>⏸️ Pausas</b>Silencios breves que separan una idea de la siguiente.</div>
    </div>` },
      { caja: 'truco', html: '🧠 <b>Prueba en voz alta:</b> «MAÑANA es el examen» avisa del día; «mañana es el EXAMEN», de lo que viene; y «¿mañana es el examen?», con la voz subiendo al final, ya es una pregunta.' },
      { h2: '🎤 4. Hablar ante otros' },
      { tabla: { k: 'normal', cab: ['Forma', 'Cómo es', 'Grado'], filas: [
        ['🎤 Charla', 'Una persona expone un tema y el público escucha: va casi siempre en una sola dirección, como la conferencia. Se preparan el tema, la fecha, los responsables y los materiales de apoyo (tarjetas con las ideas clave, láminas con dibujos grandes, afiches, carteles).', '7.º, 8.º y 9.º'],
        ['🧑‍🤝‍🧑 Trabajo de equipo', 'Varios compañeros se reparten las tareas para una misma meta. Todos opinan y todos escuchan.', '7.º'],
        ['💬 Diálogo', 'Dos o más personas se alternan para hablar y responderse.', '8.º'],
        ['🏫 Asamblea escolar', 'Reúne a personas con un propósito común para llegar a conclusiones sobre un problema. La preparan el coordinador, los organizadores y el comité de planeamiento.', '9.º']
      ] } },
      { caja: 'regla', html: '⚡ <b>El circuito del habla:</b> para que haya comunicación hacen falta un <strong>hablante</strong>, un <strong>oyente</strong>, un <strong>mensaje</strong>, un <strong>código</strong> (el idioma que comparten) y un <strong>contexto</strong> (la situación en que hablan). Cada persona que toma parte en la conversación es un <strong>interlocutor</strong>.' },
      { caja: 'idea', html: '💡 <b>Cinco cualidades de quien habla bien:</b> <strong>claridad</strong>, <strong>concisión</strong> (las palabras justas), <strong>coherencia</strong> (las ideas en orden lógico), <strong>sencillez</strong> y <strong>naturalidad</strong>.' }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '📶 5. Los niveles de uso de la lengua <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>', pegado: true },
      { p: 'Todos hablamos el mismo idioma, pero no lo usamos igual en todas partes. Ningún nivel es «el bueno»: <strong>cada uno sirve para una situación</strong>.' },
      { tabla: { k: 'normal', cab: ['Grupo', 'Niveles', 'Dónde los oyes o los lees'], filas: [
        ['👄 Formas orales', 'Popular (el de todos los días), familiar (el de la casa, con confianza), vulgar y regionalismos (palabras propias de una zona). En 9.º, también modismos y jergas.', 'En la casa, la calle, el mercado, el bus.'],
        ['✍️ Formas escritas', 'Culto, científico-técnico, literario.', 'En una ley, un informe de Ciencias, un poema.'],
        ['📣 Formas mixtas', 'Publicitario, periodístico.', 'En un anuncio, en un noticiero.']
      ] } },
      { caja: 'truco', html: '🧠 <b>Truco para recordar:</b> antes de hablar, hazte dos preguntas: «¿<b>con quién</b> hablo?» y «¿<b>para qué</b>?». La respuesta te dice qué palabras, qué tono y qué gestos convienen, y cuánta <strong>formalidad</strong>: un acto cívico pide más seriedad que el recreo.' },
      { h3: '🔬 Lo mismo, dicho de dos maneras' },
      { tabla: { k: false, cab: ['En lenguaje científico-técnico', 'En lenguaje popular o familiar'], filas: [
        ['«Un ecosistema es el conjunto de los seres vivos de un lugar, su medio físico y las relaciones entre ellos».', '«En el monte todo va amarrado: las plantas, los animales, el agua y la tierra se necesitan».'],
        ['«Los productores fabrican su alimento por fotosíntesis».', '«Las plantas hacen su propia comida con la luz del sol».'],
        ['«Dividendo», «cociente» y «residuo».', '«Lo que se va a repartir», «lo que le toca a cada uno» y «lo que sobra».']
      ] } },
      { h2: '🕊️ 6. Un lenguaje libre de discriminación <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { p: 'Hablar distinto <strong>no es hablar mal</strong>. Cada quien habla como aprendió en su casa y en su comunidad. Un lenguaje libre de discriminación <strong>no se burla ni rebaja</strong> a nadie por su origen, por ser niña o niño ni por su manera de hablar. Y al opinar: das tus razones, respetas las de los demás y entre todos negocian (cada parte cede un poco) hasta llegar a un acuerdo.' },
      { caja: 'hn', html: '🇭🇳 <b>En Honduras:</b> además del español, en nuestro país se hablan el <strong>chortí</strong>, el <strong>tol</strong>, el <strong>tawaka</strong>, el <strong>miskito</strong>, el <strong>pech</strong>, el <strong>garífuna</strong> y el <strong>inglés criollo</strong>. Y la Constitución habla en lengua culta: su artículo 162 dice que la docencia «determina para el educador responsabilidades científicas y morales frente a sus discípulos».' },
      { html: '<div class="media">🎓 <b>Para Media (10.º y 11.º):</b> el programa de 10.º estudia la situación de comunicación con seis elementos (<strong>emisor, receptor, canal, mensaje, código y contexto</strong>) y los relaciona con las seis funciones del lenguaje: <strong>referencial, estética, metalingüística, fática, emotiva y apelativa</strong> (tu docente te dará la definición de cada una). En 11.º se estudian los <strong>estereotipos discriminatorios</strong> de tipo étnico, de género o religioso.</div>' }
    ],

    /* ───────── Hoja 4: la práctica ───────── */
    [
      { h2: '✍️ 7. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' },
      { practica: 'vf' },
      { practica: 'seleccion', hasta: 2 }
    ],

    /* ───────── Hoja 5 ───────── */
    [
      { practica: 'seleccion', desde: 3 }
    ],

    /* ───────── Hoja 6 ───────── */
    [
      { practica: 'pareados' },
      { felicitacion: true },
      { rubrica: true }
    ]
  ],

  practica: {
    completar: [
      { q: 'Cruzar los brazos o encogerse de hombros son ___ que comunican sin palabras.', a: 'gestos', ensaya: 'cp-gesto' },
      { q: 'Cuando la voz sube al final de «¿Vienes mañana?», lo que cambia es la ___.', a: 'entonación', ensaya: 'cp-entonacion' },
      { q: 'Si dices «¡HOY es la entrega!» marcando fuerte la primera palabra, le pones ___ a «hoy».', a: 'énfasis', ensaya: 'cp-enfasis' },
      { q: 'En «Llegó el bus. (Silencio). Súbanse todos», el silencio entre las dos ideas es una ___.', a: 'pausa', ensaya: 'cp-pausa' },
      { q: 'Tu tío te llama por teléfono: él es el hablante y tú eres el ___.', a: 'oyente', ensaya: 'cp-oyente' },
      { q: 'En el circuito del habla, «mañana no hay clases» es el ___ que te da tu maestra.', a: 'mensaje', ensaya: 'cp-mensaje' },
      { q: 'Decir «buenas noches, que descansen» al salir de una visita es ___.', a: 'despedirse', ensaya: 'cp-despedirse' },
      { q: 'Con tus primos hablas con confianza: usas el nivel ___.', a: 'familiar', ensaya: 'cp-familiar' },
      { q: 'Quien da un aviso sin palabras de más habla con ___.', a: 'concisión', ensaya: 'cp-concision' },
      { q: 'En el trabajo de equipo hablas cuando te toca: respetas tu ___.', a: 'turno', ensaya: 'cp-turno' }
    ],
    vf: [
      { q: 'Además de lo que se dice, en una conversación cuenta cómo se dice.', a: true, ensaya: 'tf-solo-palabras' },
      { q: 'El tono de la voz no cambia nunca el sentido de una frase.', a: false, ensaya: 'tf-tono' },
      { q: 'En una conferencia, el público habla tanto como el conferencista.', a: false, ensaya: 'tf-conferencia' },
      { q: 'En una asamblea escolar se oyen las ideas de varios antes de decidir.', a: true, ensaya: 'tf-asamblea-decide' },
      { q: 'Quien habla distinto a ti, porque creció en otra zona, habla mal.', a: false, ensaya: 'tf-respeto-comunidad' },
      { q: 'El lugar y el momento en que se habla influyen en cómo se entiende lo dicho.', a: true, ensaya: 'tf-contexto' },
      { q: 'Hablar con naturalidad es hablar sin fingir otra voz.', a: true, ensaya: 'tf-naturalidad' },
      { q: 'Los noticieros y los periódicos usan un lenguaje que es solo oral.', a: false, ensaya: 'tf-periodistico' },
      { q: 'En un acto cívico se habla igual de relajado que en el recreo.', a: false, ensaya: 'tf-director' },
      { q: 'El lenguaje culto se cuenta entre las formas escritas de la lengua.', a: true, ensaya: 'tf-culto' }
    ],
    seleccion: [
      { q: 'Entras a la pulpería de don Beto y hay tres vecinos. ¿Qué fórmula social corresponde primero?', o: ['pedir fiado', 'saludar', 'despedirte', 'dar el pésame'], a: 1, ensaya: 'mc-llegar' },
      { q: '¿Cuál de estos comunica sin palabras?', o: ['una carta', 'un audio de voz', 'la sirena de una ambulancia', 'un poema'], a: 2, ensaya: 'mc-no-verbal' },
      { q: 'Necesitas saber la hora y solo hay un señor que no conoces. ¿Cómo se lo pides en lengua estándar?', o: ['«¡Ey! ¿Qué horas son?»', '«La hora, pues»', '«Oiga, ¿y la hora?»', '«Disculpe, ¿me puede decir la hora, por favor?»'], a: 3, ensaya: 'mc-biblioteca' },
      { q: 'Vas a dar una charla sobre el reciclaje. ¿Qué te sirve como material de apoyo?', o: ['un cartel con dibujos', 'hablar más rápido', 'un chiste largo', 'llegar tarde'], a: 0, ensaya: 'mc-material' },
      { q: '«El agua pasa de líquido a gas: se evapora». Esa oración usa el lenguaje…', o: ['literario', 'científico-técnico', 'vulgar', 'publicitario'], a: 1, ensaya: 'mc-tecnico' },
      { q: 'Tu hermanito pregunta qué es un ecosistema y le dices: «Es como el monte, con sus plantas y sus animales». Eso es explicar con…', o: ['prisa', 'enojo', 'sencillez', 'desgano'], a: 2, ensaya: 'mc-sencillez' },
      { q: 'En Matemáticas dices «residuo». En la casa, con palabras de todos los días, sería…', o: ['lo que se reparte', 'lo que sobra', 'el que reparte', 'lo que le toca a cada uno'], a: 1, ensaya: 'mc-cociente' },
      { q: 'Además del español, ¿cuál de estas es una lengua de Honduras?', o: ['el francés', 'el chino', 'el tawaka', 'el alemán'], a: 2, ensaya: 'mc-pech' },
      { q: 'El coordinador le dio la palabra a Josué y tú también quieres opinar. ¿Qué haces?', o: ['hablar encima de él', 'levantar la mano y aguardar', 'salirte del aula', 'reírte'], a: 1, ensaya: 'mc-esperar' },
      { q: '«Ese río viene bravo, mejor no se meta». Esa manera de hablar es la…', o: ['técnica', 'literaria', 'periodística', 'popular'], a: 3, ensaya: 'mc-popular' }
    ],
    /* Pareados de aplicar: el término se une con lo que pasa en la escena.
       El examen lo une con su definición o con otro ejemplo. */
    pareados: {
      intro: '<div class="historia"><b>Lee esta escena:</b> Karla toca la puerta de la dirección: «Perdone la molestia». Entra, ve a los ojos a la licenciada y dice: «Buenos días, licenciada. Vengo por mi constancia». La licenciada le responde y se la entrega. «Se lo agradezco mucho», dice Karla. Y al salir: «Con permiso, que pase buen día».</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: lo que pasa en la escena',
      anchoA: '30%',
      pares: [
        { term: 'Saludo', def: '«Buenos días, licenciada»', ensaya: 'pr-saludo' },
        { term: 'Despedida', def: '«Que pase buen día»', ensaya: 'pr-despedida' },
        { term: 'Agradecimiento', def: '«Se lo agradezco mucho»', ensaya: 'pr-agradecimiento' },
        { term: 'Disculpa', def: '«Perdone la molestia»', ensaya: 'pr-disculpa' },
        { term: 'Mirada', def: 'Karla ve a los ojos a quien le habla', ensaya: 'pr-mirada' },
        { term: 'Código', def: 'El español, que las dos comparten', ensaya: 'pr-codigo' },
        { term: 'Intención', def: 'Conseguir su constancia: a eso vino Karla', ensaya: 'pr-intencion' },
        { term: 'Interlocutor', def: 'La licenciada, con quien Karla conversa', ensaya: 'pr-interlocutor' },
        { term: 'Formalidad', def: 'Karla trata de «usted» porque está en una oficina', ensaya: 'pr-formalidad' },
        { term: 'Diálogo', def: 'Karla habla, la licenciada responde, y así se alternan', ensaya: 'pr-dialogo' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión Conversar en lengua estándar.</b> Ahora sabes que no solo hablan tus palabras: también hablan tu tono, tus pausas, tus gestos y tu mirada. Conoces las fórmulas sociales que abren cualquier conversación, sabes participar en una charla, en un diálogo y en una asamblea, y eliges el nivel de la lengua que pide cada situación. Y sabes lo más importante: hablar distinto no es hablar mal, y toda forma de hablar merece respeto.',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Recogió en su casa tres expresiones de su comunidad y las dijo en lengua estándar.', 'Tarea en el hogar'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión Conversar en lengua estándar» (III Ciclo y Bachillerato; primer parcial, febrero y marzo). Cada tema lleva señalado su grado según la programación mensual de Español de 7.º a 9.º; el recuadro «Para Media» es para 10.º y 11.º. La sección «Ponte a Prueba» <strong>no es el examen</strong>: ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados) con otras preguntas, para que el alumno practique sin haber visto la hoja que se le va a evaluar. Los ejemplos de habla popular y familiar son ejemplos: puede cambiarlos por los de su comunidad. Para la evaluación final imprima la prueba desde la plataforma, que genera formas distintas con su pauta.'
};
