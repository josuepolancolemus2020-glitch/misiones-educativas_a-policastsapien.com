/* ============================================================
   M.E.T.A.S · Misión El cuento · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n2-cuento.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n2-cuento`; la ficha no se
   edita a mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA, y es a propósito: la ficha impresa, su QR
     (`img/qr-mision-n2-cuento.png`) y el enlace desde la misión se
     hacen cuando la misión entra al catálogo. Mientras tanto las sondas
     la arman en la memoria y le exigen lo mismo que a una armada.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro fragmento para la misma idea (otro cuento, otro narrador,
         otra cuenta de años);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con lo que dice un
         cuento corto (la máquina de coser de doña Lola), no con su
         definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.
     Las 40 ensayan, una por una, las 40 del banco de las formas 1 a 30
     (los cuatro bancos de siempre de `contenido.js`), que son las que el
     alumno tiene más cerca: ninguna se queda sin su práctica. Entre ellas
     van las dos de la lectura como transmisión de cultura.

   ► TRES REGLAS DE LA REVISIÓN DE LAS TANDAS 2 Y 3, medidas también aquí:
       · la respuesta de un completar no está escrita en ningún otro
         enunciado de la práctica (ni en una opción, ni en el cuento de
         los pareados);
       · cada completar tiene una sola respuesta válida;
       · en la selección, la correcta no es la opción más larga ni la
         más corta más que alguna vez.

   ► De dónde sale lo que afirma: de las mismas fuentes que la misión
     (la programación de 7.º a 9.º, PDF pp. 7, 15 y 23, y el DCNB, pp. 86,
     89, 103, 104, 105, 119, 122, 140, 163, 177 y 179; para Media, los
     programas de 10.º y 11.º). Lo que es redacción nuestra (casi todas
     las definiciones) está anotado en la cabecera de `contenido.js`.

   ► LOS TEXTOS. «El arriero y los dos perros» es una versión NUESTRA
     del cuento del Cadejo, de la tradición oral de Honduras: no es cita
     de ningún libro, y la ficha lo dice. Lo que se cuenta de la Sucia y
     del Sisimite, igual. El cuento de la máquina de coser y su autora,
     Rosa Mejía, son inventados, y la ficha lo dice. Los datos de
     Francisco Morazán y de José Trinidad Cabañas salen de
     `js/data/proceres-honduras.js`. No hay ningún texto de autor ni se
     nombra a ningún autor real: en `_dev/` no hay fuente.

   ► SIN ETIQUETAS DE GRADO. La ficha llega a manos del alumno, igual
     que la pantalla: los temas no llevan «7.º», «8.º» ni «9.º». Qué
     tema toca a cada grado se le dice al docente en su hoja
     (`notaDocente`).
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n2-cuento',
  mision: 'El cuento',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato',
  tema: 'El cuento de tradición oral y el cuento de autor, las tres partes del cuento, los personajes y el ambiente, la lectura como transmisión de cultura, el punto de vista (quién narra), la biografía y cómo escribir un cuento',
  qr: 'qr-mision-n2-cuento.png',

  estilos: `
  /* Dos textos, uno al lado del otro */
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .dos > div { border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; border: 1.5px solid var(--linea); background: #fff; }
  .dos b { display: block; font-size: 9.5pt; margin-bottom: 2px; color: var(--materia-osc); }
  /* El cuento que se lee entero: cada parte lleva su rótulo escrito */
  .cuento { border: 1.5px solid var(--linea); border-left: 6px solid var(--materia); border-radius: 4px 9px 9px 4px; padding: 6px 12px; margin: 6px 0; font-size: 10pt; background: #fff; break-inside: avoid; }
  .cuento .ct { font-weight: 700; font-size: 11pt; color: var(--materia-osc); }
  .cuento .cn { font-size: 8.5pt; font-style: italic; margin-bottom: 3px; }
  .cuento p { margin: 3px 0; }
  .cuento .rot { font-weight: 700; font-size: 8.5pt; letter-spacing: .04em; color: var(--materia-osc); border: 1.5px solid var(--materia); border-radius: 5px; padding: 0 5px; margin-right: 4px; }
  /* El recuadro de Media */
  .media { border: 1.5px solid var(--materia); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10pt; background: var(--papel); break-inside: avoid; }
  .media b { color: var(--materia-osc); }
  /* El cuento de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .dos > div, .cuento, .cuento .rot, .media, .historia { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Reconocer un <strong>cuento de tradición oral</strong> y distinguirlo de un <strong>cuento de autor</strong>.',
    'Identificar las tres partes de un cuento: <strong>inicio</strong>, <strong>desarrollo</strong> y <strong>cierre</strong>.',
    'Describir a un <strong>personaje</strong> por fuera y por dentro, y reconocer el <strong>ambiente</strong>.',
    'Saber <strong>quién narra</strong> un cuento y qué sabe ese narrador.',
    'Reconocer una <strong>biografía</strong>, escribir un cuento por pasos y valorar la <strong>lectura</strong> como herencia de un pueblo.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '🗣️ 1. La tradición oral y el cuento' },
      { p: 'La <strong>tradición oral</strong> es todo lo que un pueblo se pasa <strong>de boca en boca</strong>, de una generación a otra, sin escribirlo. Un <strong>cuento</strong> es una narración <strong>corta</strong> e <strong>inventada</strong>, con pocos personajes. Quien lo cuenta es el narrador; quien lo recibe escuchando es el <strong>oyente</strong>, y quien lo recibe leyendo, el <strong>lector</strong>.' },
      { tabla: { cab: ['', 'De dónde viene', 'Cómo es'], filas: [
        ['🗣️ Cuento de tradición oral', 'Nadie sabe quién lo inventó: es ANÓNIMO. Se aprende escuchando.', 'Cada quien lo cuenta con sus palabras: tiene VARIAS VERSIONES.'],
        ['✍️ Cuento de autor', 'Lo escribió y lo firmó una persona: su AUTOR o su autora. Se aprende leyendo.', 'Su texto NO CAMBIA, porque está escrito.']
      ] } },
      { tabla: { cab: ['En Honduras se cuenta…', 'Lo que dicen de él'], filas: [
        ['🐕 El Cadejo', 'Un perro que se aparece de noche en los caminos. El blanco acompaña al caminante; el negro lo asusta.'],
        ['👻 La Sucia', 'Una mujer de blanco que se aparece de noche junto a los ríos y las quebradas.'],
        ['👣 El Sisimite', 'Un ser peludo de la montaña. Dicen que tiene los pies al revés.']
      ] } },
      { caja: 'idea', html: '💡 <b>Es literatura, no una noticia.</b> Un cuento de tradición oral no vale por si pasó de verdad. Y si en tu casa lo cuentan distinto, esa versión también vale. En la biblioteca de tu centro hay, además, cuentos escritos por autores de Honduras.' }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { h2: '🧱 2. Las tres partes del cuento', pegado: true },
      { html: `<div class="cuento">
        <div class="ct">El arriero y los dos perros</div>
        <div class="cn">Cuento de la tradición oral de Honduras (el del Cadejo). Esta versión se escribió para la misión: en tu casa quizá lo cuentan distinto.</div>
        <p><span class="rot">INICIO</span>Cuentan que don Chema era arriero. Era un hombre flaco, de bigote blanco, callado y muy trabajador. Una tarde volvía de vender frijoles y la noche lo agarró en el camino viejo, solo con su mula.</p>
        <p><span class="rot">DESARROLLO</span>De pronto, la mula se paró en seco. Entre los pinos brillaban dos ojos rojos: era un perro negro, enorme, que arrastraba una cadena. Don Chema quiso correr y las piernas no le obedecieron. Entonces salió del monte un perro blanco y se plantó entre él y el animal negro. Los dos perros se gruñeron largo rato.</p>
        <p><span class="rot">CIERRE</span>Al fin, el negro retrocedió y se perdió en la oscuridad. El perro blanco caminó junto a la mula hasta el pueblo. Cuando don Chema se volvió para darle las gracias, ya no estaba. Desde esa noche, dicen, el arriero dejaba un guacal de agua en la cerca, por si el perro blanco volvía a pasar.</p>
      </div>` },
      { tabla: { cab: ['Parte', 'Qué pasa', 'También se llama', 'Palabras que avisan'], filas: [
        ['1. Inicio', 'Se presenta a los personajes y se dice dónde y cuándo.', 'Planteamiento', '«Había una vez», «Cuentan que»'],
        ['2. Desarrollo', 'Aparece un problema y los personajes lo enfrentan.', 'Nudo', '«De pronto», «entonces», «después»'],
        ['3. Cierre', 'El problema se resuelve y la historia termina.', 'Desenlace', '«Desde ese día», «y colorín colorado, este cuento se ha acabado»']
      ] } },
      { p: 'El <strong>tema</strong> de un cuento es el asunto del que trata. El de este: la ayuda que llega cuando menos se espera.' },
      { h2: '👤 3. Los personajes y el ambiente' },
      { p: 'Los <strong>personajes</strong> son los seres que actúan en el cuento: personas, animales o seres imaginarios. El <strong>principal</strong>, o <strong>protagonista</strong>, vive la historia de principio a fin (don Chema); los <strong>secundarios</strong> lo acompañan (la mula, los perros). El <strong>ambiente</strong> es el lugar y el tiempo: «el camino viejo, de noche». Lo que los personajes se dicen es el <strong>diálogo</strong>.' },
      { tabla: { cab: ['', 'Qué hace', 'Ejemplo'], filas: [
        ['👀 Describir por fuera', 'Dice lo que SE VE del personaje.', '«Era un hombre flaco, de bigote blanco».'],
        ['💭 Describir por dentro', 'Dice su MANERA DE SER.', '«Era callado y muy trabajador».'],
        ['🏃 Narrar', 'Cuenta un HECHO: algo pasa.', '«La mula se paró en seco».']
      ] } }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '🌎 4. Leer también es heredar', pegado: true },
      { p: 'Cuando un pueblo cuenta sus historias, les pasa a los más jóvenes <strong>lo que sabe, lo que cree, sus costumbres y su manera de hablar</strong>: su <strong>cultura</strong>. Mientras el cuento solo se cuenta, llega hasta donde llega la voz. Cuando alguien lo <strong>escribe</strong>, lo puede leer quien vive lejos y quien nacerá muchos años después.' },
      { caja: 'regla', html: '⚡ <b>Por eso se dice</b> que la lectura es un medio de comunicación y de <strong>transmisión de la cultura de los pueblos</strong>. Si lees un cuento de tu tierra, recibes una herencia; si lees uno de otro país, conoces a un pueblo en el que nunca has estado.' },
      { h2: '🎥 5. ¿Quién narra? El punto de vista' },
      { p: 'El <strong>narrador</strong> es la <strong>voz que cuenta</strong> el cuento. No es lo mismo que el autor: el autor escribe; el narrador es la voz que el autor eligió. Según quién narra, el lector se entera de unas cosas y de otras no.' },
      { tabla: { cab: ['Narrador', 'Persona', 'Qué sabe', 'Ejemplo'], filas: [
        ['🙋 El protagonista', 'Primera («yo»)', 'Lo que él mismo vio, pensó y sintió.', '«Yo quise correr y las piernas no me obedecieron».'],
        ['👀 Un testigo', 'Primera («yo vi»)', 'Lo que vio y oyó que le pasaba a otro.', '«Desde la pulpería vi pasar al arriero, pálido».'],
        ['📷 Narrador objetivo', 'Tercera («él», «ella»)', 'Solo lo que se ve y se oye, como una cámara.', '«El hombre se detuvo. No se movió».'],
        ['🌟 Narrador omnisciente', 'Tercera («él», «ella»)', 'Todo: hasta lo que cada uno piensa y siente.', '«Don Chema quiso correr, pero pensó en su mula».']
      ] } },
      { caja: 'truco', html: '🧠 <b>Ojo:</b> no cambies de narrador a medio cuento. Si empezaste con «yo», sigue con «yo» hasta el final.' },
      { caja: 'hn', html: '🇭🇳 <b>En el Himno Nacional:</b> «India virgen y hermosa <strong>dormías</strong>». La voz no habla <em>de</em> Honduras: le habla <em>a</em> ella, de «tú». Eso es la segunda persona.' }
    ],

    /* ───────── Hoja 4 ───────── */
    [
      { h2: '📜 6. La biografía', pegado: true },
      { p: 'Una <strong>biografía</strong> cuenta <strong>la vida de una persona real</strong>. Los hechos <strong>se averiguan</strong>, no se inventan. La escribe <strong>otra persona</strong>, por eso va en tercera persona; sigue <strong>el orden de una vida</strong>, con fechas y lugares, y describe cómo era la persona. Puede ser de alguien que ya murió o de alguien que vive. Si una persona escribe su propia vida, el texto es una <strong>autobiografía</strong>.' },
      { html: `<div class="cuento">
        <div class="ct">Francisco Morazán</div>
        <div class="cn">Biografía corta, escrita para la misión con datos comprobados.</div>
        <p>Francisco Morazán nació en Tegucigalpa el 3 de octubre de 1792. Llegó a ser presidente de la República Federal de Centro América, que unía a Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica. Impulsó la educación pública y peleó hasta el final por mantener unidas a las cinco naciones. Murió el 15 de septiembre de 1842.</p>
      </div>` },
      { caja: 'idea', html: '➗ <b>La línea de tiempo</b> es una raya con fechas que ordena los hechos de una vida. Con ella se sacan cuentas. Para saber cuántos años hay entre dos fechas, se resta: si una maestra nació en 1950 y empezó a dar clases en 1972, entre un año y otro hay 22 años (el ejemplo es inventado).' },
      { h2: '✍️ 7. Escribe y cuenta tu cuento' },
      { tabla: { cab: ['Paso', 'Qué haces'], filas: [
        ['1. Planear', 'Decides los personajes, el lugar y el problema. Y decides quién narra.'],
        ['2. Borrador', 'Escribes un texto de prueba, con inicio, desarrollo y cierre, sin miedo a tachar.'],
        ['3. Revisión', 'Lo lees para corregirlo: ¿se entiende?, ¿el problema se resuelve?, ¿cambiaste de narrador?'],
        ['4. Versión final', 'Lo pasas en limpio y le pones un título, que se escribe arriba del texto.']
      ] } },
      { caja: 'regla', html: '⚡ <b>Si lo cuentas en voz alta:</b> sé breve, mantén el <strong>hilo</strong> de la historia sin saltar de un asunto a otro, y haz <strong>pausas</strong> en los momentos de suspenso. Y cuando narre otro, escucha sin interrumpir.' },
      { html: '<div class="media">🎓 <b>Para Media:</b> el programa de 10.º estudia cómo se organizan los textos <strong>narrativos, descriptivos, argumentativos y expositivos</strong>, y el de 11.º, los <strong>géneros narrativos</strong>. Aquí solo van los nombres.</div>' }
    ],

    /* ───────── Hoja 5: la práctica ───────── */
    [
      { h2: '✍️ 8. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' },
      { practica: 'vf' }
    ],

    /* ───────── Hoja 6 ───────── */
    [
      { practica: 'seleccion' }
    ],

    /* ───────── Hoja 7 ───────── */
    [
      { practica: 'pareados' },
      { felicitacion: true },
      { rubrica: true }
    ]
  ],

  practica: {
    completar: [
      { q: 'Abuelos, padres e hijos no nacieron en la misma época: cada grupo es una ___ distinta de la familia.', a: 'generación', ensaya: 'cp-generacion' },
      { q: 'El nudo de un cuento se desata en su última parte. Por eso el cierre tiene otro nombre, que viene de «desenlazar»: el ___.', a: 'desenlace', ensaya: 'cp-desenlace' },
      { q: 'En el cuento del arriero y los dos perros, el personaje principal es don Chema. Dicho con otra palabra, don Chema es el ___ del cuento.', a: 'protagonista', ensaya: 'cp-protagonista' },
      { q: '«Nosotros subimos a la escuela con lo puesto». Como el narrador dice «nosotros», narra en ___ persona.', a: 'primera', ensaya: 'cp-primera' },
      { q: 'Francisco Morazán nació en 1792 y José Trinidad Cabañas, en 1805. Entre un nacimiento y otro pasaron ___ años.', a: '13', ensaya: 'cp-morazan' },
      { q: 'La palabra que significa «sin nombre de autor» es ___: así es el cuento de la Sucia.', a: 'anónimo', ensaya: 'cp-anonimo' },
      { q: 'Cambia de narrador. «Yo abrí la ventana» se convierte en «Él ___ la ventana».', a: 'abrió', ensaya: 'cp-cruzo' },
      { q: 'Wilmer escribió su cuento a lápiz, con tachones, para corregirlo después. Todavía no es la versión final: es el ___.', a: 'borrador', ensaya: 'cp-borrador' },
      { q: 'En el cuento del arriero, la mula y los dos perros acompañan a don Chema, pero la historia no es de ellos: son personajes ___.', a: 'secundarios', ensaya: 'cp-secundarios' },
      { q: '«Desde la pulpería vi pasar al arriero, pálido». Quien narra no es el arriero: solo lo vio. Es un narrador ___.', a: 'testigo', ensaya: 'cp-testigo' }
    ],
    vf: [
      { q: 'Quien lee cuentos de otros pueblos se queda sin saber cómo se vive allá.', a: false, ensaya: 'tf-cultura' },
      { q: 'Hay cuentos de tradición oral que nadie ha escrito todavía.', a: true, ensaya: 'tf-oral-libro' },
      { q: 'Dos personas pueden contar el mismo cuento de tradición oral con detalles distintos, y ninguna miente.', a: true, ensaya: 'tf-oral-cambia' },
      { q: 'El problema de un cuento aparece en el cierre, cuando ya todo terminó.', a: false, ensaya: 'tf-desarrollo-problema' },
      { q: 'Si un cuento lo narra un niño de siete años, es que lo escribió un niño de siete años.', a: false, ensaya: 'tf-narrador-escritor' },
      { q: 'Con decir que un personaje es «alto y moreno» ya sabemos cómo es por dentro.', a: false, ensaya: 'tf-describir-dos' },
      { q: 'Un personaje que narra con «yo» sabe lo que él mismo piensa, pero lo que piensan los demás solo puede suponerlo.', a: true, ensaya: 'tf-yo-pensamientos' },
      { q: 'Un cuento no deja de ser un buen cuento porque lo que narra nunca haya pasado.', a: true, ensaya: 'tf-inventado' },
      { q: 'Si Keyla cuenta por escrito la vida de su madrina, ese texto es una biografía.', a: true, ensaya: 'tf-biografia-quien' },
      { q: 'En Honduras no hay más cuentos que los de tradición oral: ningún escritor del país ha escrito uno.', a: false, ensaya: 'tf-cuento-honduras' }
    ],
    seleccion: [
      { q: 'En el cuento del arriero aparecen las mulas, el guacal y los caminos de antes. ¿Qué recibe quien lo lee hoy?', o: ['Una receta para cocinar frijoles', 'Algo de las costumbres de su gente', 'Una prueba de que el perro existe', 'Un mapa exacto para llegar al pueblo'], a: 1, ensaya: 'mc-cultura' },
      { q: '¿Cuál de estas personas está contando un cuento de tradición oral?', o: ['Un señor que lee el periódico en voz alta', 'Un tío que repite lo que le contaba su papá', 'Una alumna que copia un poema del libro', 'Un locutor que lee los anuncios de la radio'], a: 1, ensaya: 'mc-oral-cual' },
      { q: 'En un cuento, ¿qué parte va entre el inicio y el cierre?', o: ['El título', 'El planteamiento', 'El desarrollo', 'El punto de vista'], a: 2, ensaya: 'mc-orden-partes' },
      { q: '«Yo me escondí debajo de la cama y cerré los ojos». ¿Quién cuenta lo que pasó?', o: ['Alguien que lo supo después', 'Una vecina que lo vio por la ventana', 'El dueño de la casa de al lado', 'El personaje que se escondió'], a: 3, ensaya: 'mc-yo-vereda' },
      { q: '¿Cuál de estas palabras habla de la manera de ser de un personaje?', o: ['paciente', 'bigotudo', 'moreno', 'delgado'], a: 0, ensaya: 'mc-por-dentro' },
      { q: '¿Con cuál de estas oraciones empezarías un cuento?', o: ['«Y así terminó el largo viaje de los tres hermanos»', '«Entonces el puente empezó a crujir»', '«Hace muchos años vivía en Olancho un herrero»', '«Por eso nadie volvió a entrar en la cueva»'], a: 2, ensaya: 'mc-es-inicio' },
      { q: 'Una alumna quiere que la biografía que prepara sea de fiar. ¿Qué le sirve más?', o: ['Preguntar fechas y lugares a su gente', 'Agregarle una hazaña para que emocione', 'Contarla como un cuento de espantos', 'Escribirla sin decir de quién es'], a: 0, ensaya: 'mc-biografia-antes' },
      { q: '¿Cuál de estas oraciones describe, en vez de contar un hecho?', o: ['«La abuela encendió una vela»', '«El río se llevó el puente»', '«Toño corrió hasta su casa»', '«La casa era de adobe y teja»'], a: 3, ensaya: 'mc-describe' },
      { q: 'Al escribir un cuento, ¿qué paso va de primero?', o: ['Pasarlo en limpio', 'Planear lo que va a pasar', 'Corregir las faltas de ortografía', 'Ponerle el título'], a: 1, ensaya: 'mc-pasos-ultimo' },
      { q: '«Marta callaba, pero se moría de ganas de contarlo; su mamá, mientras tanto, ya lo sospechaba». ¿En qué palabras se nota que este narrador lo sabe todo?', o: ['«Marta callaba» y «su mamá, mientras tanto»', '«callaba» y «contarlo»', '«se moría de ganas» y «lo sospechaba»', '«Marta» y «su mamá»'], a: 2, ensaya: 'mc-sabe-todo' }
    ],
    /* Pareados de aplicar: el término se une con lo que dice el cuento.
       El examen lo une con su definición. */
    pareados: {
      intro: '<div class="historia"><b>Lee este cuento corto</b> (el cuento y su autora son inventados): «<em>La máquina de coser</em>, por Rosa Mejía. Había una costurera llamada doña Lola. Era bajita y de trenzas largas. Vivía en el barrio El Centro, y todo pasó una noche de mayo. De pronto, su máquina empezó a coser sola. Doña Lola corrió a destrabar la ventana y el ruido paró. Desde esa noche, cose con la ventana de par en par». <b>Al pie del cuento dice:</b> «Rosa Mejía nació en La Esperanza y escribe desde los nueve años».</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: lo que dice el cuento',
      anchoA: '24%',
      pares: [
        { term: 'El inicio', def: 'La oración con que empieza: «Había una costurera…»', ensaya: 'pr-inicio' },
        { term: 'El cierre', def: 'La oración con que termina: «Desde esa noche…»', ensaya: 'pr-cierre' },
        { term: 'El personaje', def: 'Doña Lola, a quien le pasa la historia', ensaya: 'pr-personaje' },
        { term: 'El narrador', def: 'No es Rosa Mejía ni doña Lola: es quien lo cuenta', ensaya: 'pr-narrador' },
        { term: 'La biografía', def: '«nació en La Esperanza y escribe desde los nueve años»', ensaya: 'pr-biografia' },
        { term: 'La descripción', def: 'Cómo es ella: «bajita y de trenzas largas»', ensaya: 'pr-descripcion' },
        { term: 'La narración', def: 'Un hecho: «su máquina empezó a coser sola»', ensaya: 'pr-narracion' },
        { term: 'El ambiente', def: '«el barrio El Centro», «una noche de mayo»', ensaya: 'pr-ambiente' },
        { term: 'La tercera persona', def: 'Se dice «cose» y no «coso»', ensaya: 'pr-tercera' },
        { term: 'El autor', def: '«por Rosa Mejía»', ensaya: 'pr-autor' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión El cuento.</b> Ahora sabes de dónde vienen los cuentos que se cuentan en tu casa y por qué cada quien los cuenta a su manera. Sabes partir un cuento en su inicio, su desarrollo y su cierre, describir a un personaje por fuera y por dentro, y reconocer quién narra y qué sabe. Sabes que una biografía no se inventa, y que quien lee recibe la herencia de un pueblo. Ya puedes escribir tu propio cuento, y contarlo.',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Escribió el cuento que le contaron en su casa, con sus tres partes, y anotó quién se lo contó.', 'Tarea en el hogar'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión El cuento» (III Ciclo y Bachillerato; primer parcial, febrero y marzo). La misión cubre los tres grados del ciclo y los temas no llevan etiqueta de grado, para que la hoja sirva de 7.º a 9.º. Según la programación mensual de Español: el cuento de tradición oral va en 7.º y en 9.º; la descripción de personajes y la escritura de un cuento (borrador, revisión y versión final), en 7.º; el esquema de inicio, desarrollo y cierre, el cuento en Honduras y de autores nacionales, la biografía y la lectura como transmisión de cultura, en 8.º; el punto de vista (quién narra), en 9.º. El recuadro «Para Media» es para 10.º y 11.º. <strong>Sobre los textos:</strong> «El arriero y los dos perros» es una versión propia del cuento del Cadejo, escrita para la misión, y lo que se dice de la Sucia y del Sisimite es lo que se cuenta comúnmente; no son cita de ningún libro, y si en su comunidad se cuentan de otra manera conviene usar esa versión. La ficha no trae ningún cuento de autor: para el «cuento de autores nacionales» lleve al aula uno de la biblioteca de su centro. La leyenda como género y los nombres «prosopografía» y «etopeya» no se tratan aquí, porque la programación los pone en abril. Las definiciones son redacción de la plataforma (la programación nombra estos temas sin definirlos). La sección «Ponte a Prueba» <strong>no es el examen</strong>: ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados) con otras preguntas, para que el alumno practique sin haber visto la hoja que se le va a evaluar. Para la evaluación final imprima la prueba desde la plataforma, que genera formas distintas con su pauta.'
};
