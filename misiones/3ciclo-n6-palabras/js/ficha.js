/* ============================================================
   M.E.T.A.S · Misión Las palabras y sus significados · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n6-palabras.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n6-palabras`; la ficha no se
   edita a mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA, y es a propósito: la ficha impresa, su QR
     (`img/qr-mision-n6-palabras.png`) y el enlace desde la misión se
     hacen cuando la misión entra al catálogo. Mientras tanto las sondas
     la arman en la memoria y le exigen lo mismo que a una armada.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (otra pareja de palabras, otro
         prefijo en otra palabra, otra sigla);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con lo que dice una
         nota corta (el sábado de Óscar en el platanal), no con su
         definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.
     Las 40 ensayan, una por una, las 40 del banco de las formas 1 a 30
     (los cuatro bancos de siempre de `contenido.js`), que son las que el
     alumno tiene más cerca: ninguna se queda sin su práctica.

   ► TRES REGLAS DE LA REVISIÓN DE LA TANDA 2, medidas también aquí:
       · la respuesta de un completar no está escrita en ningún otro
         enunciado de la práctica (ni en una opción, ni en la nota de
         los pareados);
       · cada completar tiene una sola respuesta válida;
       · en la selección, la correcta no es la opción más larga ni la
         más corta más que alguna vez.

   ► De dónde sale lo que afirma: de las mismas fuentes que la misión
     (la programación de 7.º a 9.º, PDF pp. 7, 15 y 23, y el DCNB, pp. 86,
     88, 91, 108, 113, 121, 124, 153, 154, 162 y 191; para Media, los
     programas de 10.º y 11.º). Lo que es redacción nuestra (casi todas
     las definiciones, y el significado de cada prefijo y de cada
     sufijo) y lo que queda pendiente de verificar con la RAE está
     anotado en la cabecera de `contenido.js`.

   ► Los ejemplos son inventados para la misión. Los datos que no lo
     son (el manglar, la raíz cuadrada de 196, el verso del Himno, el
     nombre completo de cada sigla) salen de las misiones y de los
     archivos que los acreditan.

   ► SIN ETIQUETAS DE GRADO. La ficha llega a manos del alumno, igual
     que la pantalla: los temas no llevan «7.º», «8.º» ni «9.º». Qué
     tema toca a cada grado se le dice al docente en su hoja
     (`notaDocente`).
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n6-palabras',
  mision: 'Las palabras y sus significados',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato',
  tema: 'Sinónimos y antónimos, el contexto, el diccionario, el vocabulario técnico y los regionalismos, la denotación y la connotación, los prefijos y los sufijos, los neologismos, la polisemia, las siglas y los acrónimos',
  qr: 'qr-mision-n6-palabras.png',

  estilos: `
  /* Dos textos, uno al lado del otro */
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .dos > div { border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; border: 1.5px solid var(--linea); background: #fff; }
  .dos b { display: block; font-size: 9.5pt; margin-bottom: 2px; color: var(--materia-osc); }
  /* La palabra partida en sus piezas: cada pieza dice debajo qué es */
  .piezas { display: flex; flex-wrap: wrap; gap: 6px; align-items: stretch; justify-content: center; margin: 4px 0; }
  .piezas span { display: flex; flex-direction: column; align-items: center; border: 1.5px solid var(--linea); border-radius: 8px; padding: 3px 10px; font-weight: 700; font-size: 11pt; background: #fff; }
  .piezas span.raiz { border: 2.5px solid var(--materia); }
  .piezas small { font-weight: 600; font-size: 8pt; color: var(--materia-osc); }
  .piezas .igual { border: none; background: none; justify-content: center; padding: 3px 2px; }
  /* El recuadro de Media */
  .media { border: 1.5px solid var(--materia); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10pt; background: var(--papel); break-inside: avoid; }
  .media b { color: var(--materia-osc); }
  /* La nota de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .dos > div, .piezas span, .media, .historia { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Usar <strong>sinónimos</strong> y <strong>antónimos</strong> según el <strong>contexto</strong>, y saber buscar una palabra en el <strong>diccionario</strong>.',
    'Reconocer el <strong>vocabulario técnico</strong> y los <strong>regionalismos</strong>, y respetar las dos formas de hablar.',
    'Distinguir la <strong>denotación</strong> de la <strong>connotación</strong>, y el lenguaje <strong>literario</strong> del no literario.',
    'Partir una palabra en su <strong>raíz</strong>, su <strong>prefijo</strong> y su <strong>sufijo</strong>, y armar palabras nuevas con esas piezas.',
    'Reconocer un <strong>neologismo</strong>, una palabra con varios significados (<strong>polisemia</strong>), una <strong>sigla</strong> y un <strong>acrónimo</strong>.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '🔁 1. Sinónimos y antónimos' },
      { tabla: { cab: ['', 'Qué son', 'Ejemplos'], filas: [
        ['🔁 Sinónimos', 'Palabras distintas que significan LO MISMO o casi lo mismo.', '«contento» y «alegre»; «enorme» y «gigantesco».'],
        ['↔️ Antónimos', 'Palabras que significan LO CONTRARIO una de la otra.', '«frío» y «caliente»; «presente» y «ausente».']
      ] } },
      { caja: 'regla', html: '⚡ <b>El contexto manda.</b> Los sinónimos ayudan a no repetir la misma palabra, pero no siempre se pueden cambiar uno por otro. Las palabras que rodean a otra y ayudan a entender qué significa forman su <strong>contexto</strong>.' },
      { html: `<div class="dos">
        <div><b>💧 «El agua está clara»</b>Aquí «clara» es <strong>transparente</strong> o <strong>cristalina</strong>. Su contrario: «turbia».</div>
        <div><b>💡 «La explicación fue clara»</b>Aquí «clara» es <strong>fácil de entender</strong>. Su contrario: «confusa». Y lo mismo pasa con los contrarios: «seguro» (sin riesgo) tiene por contrario «peligroso».</div>
      </div>` },
      { h2: '📖 2. El diccionario' },
      { p: 'El <strong>diccionario</strong> explica qué significan las palabras. Para usarlo: <strong>1)</strong> las palabras van en <strong>orden alfabético</strong>; <strong>2)</strong> el verbo se busca en infinitivo («correr», no «corrían»); <strong>3)</strong> una palabra puede traer <strong>varios significados</strong>: se leen todos; <strong>4)</strong> se elige <strong>el que encaja</strong> en la oración.' },
      { tabla: { cab: ['Diccionario', 'Qué pregunta responde'], filas: [
        ['📘 De la lengua', '¿Qué significa esta palabra? ¿Cómo se escribe?'],
        ['🔁 De sinónimos y antónimos', '¿Con qué otra palabra lo digo? ¿Cuál es su contrario?'],
        ['🔬 Especializado', 'Explica los términos de una sola materia: Matemáticas, Medicina, Música.']
      ] } }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { h2: '⚙️ 3. Vocabulario técnico y regionalismos', pegado: true },
      { tabla: { cab: ['', 'Qué es', 'Ejemplos'], filas: [
        ['⚙️ Vocabulario técnico', 'Las palabras EXACTAS de una ciencia o de un oficio. A quien no conoce la materia hay que explicárselas.', 'Matemáticas: «cociente» (resultado de una división), «residuo» (lo que sobra). Ciencias Naturales: «ecosistema», «abiótico» (sin vida).'],
        ['🗺️ Regionalismo', 'Palabra que se usa en UNA REGIÓN y no en todos los lugares donde se habla español. No es un error.', 'En Honduras: «pulpería», «pisto» (dinero), «cipote» (niño), «chunche» (cosa).']
      ] } },
      { h2: '🎭 4. Denotación y connotación' },
      { tabla: { cab: ['', 'Qué es', 'Ejemplo'], filas: [
        ['📘 Denotación', 'El significado DIRECTO de una palabra, sin sugerir nada más.', '«Anoche brillaba una estrella»: un astro.'],
        ['🎭 Connotación', 'Lo que la palabra SUGIERE además.', '«Eres la estrella del equipo»: alguien que destaca.']
      ] } },
      { caja: 'idea', html: '💡 <b>La connotación es de todos los días:</b> «dame una mano» (ayúdame), «tiene un corazón de piedra» (no se conmueve), «anda en las nubes» (está distraído).' },
      { caja: 'regla', html: '⚡ <b>Dos lenguajes.</b> El <strong>literario</strong> (cuentos, poemas) busca la belleza y usa mucho la connotación. El <strong>no literario</strong> (un informe, unas instrucciones, un libro de Ciencias) busca informar con exactitud: en él predomina la denotación.' },
      { html: `<div class="dos">
        <div><b>📋 No literario</b>«El manglar es un bosque costero de árboles que viven con las raíces en agua salada».</div>
        <div><b>✨ Con connotación</b>«Los manglares son las guarderías del mar»: muchos peces nacen y crecen protegidos entre sus raíces.</div>
      </div>` },
      { caja: 'hn', html: '🇭🇳 <b>En el Himno Nacional:</b> «Tu bandera es un <strong>lampo</strong> de cielo». Un lampo es un resplandor. El verso no describe la tela: sugiere que la bandera brilla como la luz del cielo.' }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '🧩 5. La palabra por dentro', pegado: true },
      { p: 'Muchas palabras se pueden desarmar. La parte que <strong>no cambia</strong> es la <strong>raíz</strong>. Delante se le pone un <strong>prefijo</strong> y detrás, un <strong>sufijo</strong>: las dos piezas le cambian el significado. Las palabras que comparten la raíz son una <strong>familia</strong>: «libro», «librero», «librería», «librito».' },
      { html: `<div class="piezas">
        <span>re-<small>prefijo: volver a</small></span>
        <span class="raiz">carg-<small>raíz</small></span>
        <span>-able<small>sufijo: que se puede</small></span>
        <span class="igual">=</span>
        <span>recargable<small>que se puede volver a cargar</small></span>
      </div>` },
      { tabla: { cab: ['Prefijo', 'Significa', 'Ejemplos'], filas: [
        ['re-', 'volver a', 'releer, rehacer'],
        ['des-', 'lo contrario', 'deshacer, desordenar'],
        ['in- o im-', 'no', 'incompleto, imposible'],
        ['pre-', 'antes', 'prehistoria, precalentar'],
        ['sub-', 'debajo', 'subsuelo, submarino'],
        ['anti-', 'contra', 'antirrobo'],
        ['bi-, tri-, multi-', 'dos, tres, muchos', 'bilingüe, tricolor, multicolor'],
        ['bio-, geo-, foto-', 'vida, tierra, luz', 'biología, geografía, fotosíntesis'],
        ['tele-, micro-', 'lejos, muy pequeño', 'teléfono, microscopio']
      ] } },
      { tabla: { cab: ['Sufijo', 'Significa', 'Ejemplos'], filas: [
        ['-ero', 'oficio', 'panadero, lechero'],
        ['-ería', 'lugar donde se hace o se vende', 'zapatería, librería'],
        ['-dor, -ante', 'el que hace la acción', 'pescador, cantante'],
        ['-ito · -ón, -ona', 'pequeño · grande', 'perrito · zapatón, casona'],
        ['-oso · -able', 'que tiene mucho · que se puede', 'lluvioso · lavable'],
        ['-mente · -al', 'de cierta manera · terreno sembrado', 'lentamente · maizal, arrozal']
      ] } },
      { caja: 'idea', html: '📖 <b>Otro nombre:</b> a bio-, geo-, foto-, tele- y micro- el diccionario de la RAE los llama <strong>elementos compositivos</strong>.' },
      { caja: 'truco', html: '🧠 <b>Ojo:</b> no toda combinación de piezas da una palabra. Si armas una por tu cuenta, compruébala en el diccionario antes de usarla.' }
    ],

    /* ───────── Hoja 4 ───────── */
    [
      { h2: '🆕 6. Neologismos', pegado: true },
      { p: 'Un <strong>neologismo</strong> es una <strong>palabra nueva</strong> que entra a la lengua para nombrar algo que antes no existía: con la tecnología llegaron «chatear» y «escanear». A veces una <strong>palabra de siempre gana un significado nuevo</strong>: la «nube» ya no es solo la del cielo, es también el lugar de internet donde se guardan archivos; «navegar» ya no es solo ir en barco, es también pasar de una página a otra en internet.' },
      { h2: '🔀 7. Polisemia' },
      { caja: 'regla', html: '⚡ <b>Polisemia</b> es que una sola palabra tenga varios significados. El contexto dice cuál vale en cada oración.' },
      { tabla: { cab: ['Oración', '¿Qué significa «raíz» ahí?'], k: 'normal', filas: [
        ['«El mangle vive con las raíces en agua salada».', 'Parte de una planta.'],
        ['«La raíz cuadrada de 196 es 14».', 'Operación de Matemáticas.'],
        ['«La raíz de "librero" es "libr-"».', 'Parte de una palabra.']
      ] } },
      { h2: '🔠 8. Siglas y acrónimos' },
      { p: 'Una <strong>sigla</strong> es una abreviación que se forma con las <strong>iniciales</strong> de un nombre largo (algunas toman más de una letra de cada palabra); se escribe con mayúsculas. Unas se leen letra por letra. Las que se leen de corrido, como una palabra cualquiera, son <strong>acrónimos</strong>.' },
      { tabla: { cab: ['Sigla', 'Nombre completo', '¿Cómo se lee?'], filas: [
        ['IHSS', 'Instituto Hondureño de Seguridad Social', 'Letra por letra.'],
        ['IA', 'Inteligencia artificial', 'Letra por letra.'],
        ['ONU', 'Organización de las Naciones Unidas', 'De corrido: es un acrónimo.'],
        ['UNAH', 'Universidad Nacional Autónoma de Honduras', 'De corrido: es un acrónimo.'],
        ['COPECO', 'Comisión Permanente de Contingencias', 'De corrido: es un acrónimo. Toma dos letras de cada palabra.']
      ] } },
      { caja: 'idea', html: '💡 <b>Al escribir:</b> pon el nombre completo la primera vez que uses una sigla que tu lector quizá no conoce. Después ya puedes usar solo la sigla.' },
      { html: '<div class="media">🎓 <b>Para Media:</b> el programa de 10.º estudia los <strong>prefijos y sufijos grecolatinos</strong> y suma los <strong>parónimos</strong> y los <strong>homónimos</strong>. El de 11.º vuelve al <strong>lenguaje denotativo</strong>, a los <strong>neologismos</strong> y a los <strong>regionalismos</strong>. Aquí solo van los nombres.</div>' }
    ],

    /* ───────── Hoja 5: la práctica ───────── */
    [
      { h2: '✍️ 9. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' },
      { practica: 'vf' },
      { practica: 'seleccion', hasta: 1 }
    ],

    /* ───────── Hoja 6 ───────── */
    [
      { practica: 'seleccion', desde: 2 }
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
      { q: '«Lleno» y «vacío» dicen lo opuesto una de la otra: por eso se llaman ___.', a: 'antónimos', ensaya: 'cp-antonimos' },
      { q: '«Planta» nombra un ser vivo, la parte de abajo del pie y un piso de un edificio. A eso de tener varios significados se le dice ___.', a: 'polisemia', ensaya: 'cp-polisemia' },
      { q: 'Hace unos años nadie decía «escanear». Como es una palabra recién llegada a la lengua, es un ___.', a: 'neologismo', ensaya: 'cp-neologismo' },
      { q: 'Con el prefijo «des-» y el verbo «ordenar» se forma otro verbo, que dice lo opuesto: ___.', a: 'desordenar', ensaya: 'cp-deshacer' },
      { q: 'El lugar donde se venden libros se nombra con la raíz «libr-» y el sufijo «-ería»: ___.', a: 'librería', ensaya: 'cp-fruteria' },
      { q: 'Con las cuatro iniciales de «Universidad Nacional Autónoma de Honduras» se escribe la sigla ___.', a: 'UNAH', ensaya: 'cp-onu' },
      { q: '«Panadero», «panadería» y «panecillo» salen de una misma palabra de tres letras: ___.', a: 'pan', ensaya: 'cp-flor' },
      { q: '«Barco» está antes que «casa» en el diccionario porque sus palabras siguen el orden ___.', a: 'alfabético', ensaya: 'cp-alfabetico' },
      { q: 'Lo opuesto de «abrir» es ___.', a: 'cerrar', ensaya: 'cp-apagar' },
      { q: 'En «Me duele la muñeca», las palabras «me duele» te dicen que no se habla de un juguete: son el ___ de «muñeca».', a: 'contexto', ensaya: 'cp-contexto' }
    ],
    vf: [
      { q: 'Antes de cambiar una palabra por un sinónimo hay que leer la oración, porque no todos sirven en todas.', a: true, ensaya: 'tf-sinonimos-siempre' },
      { q: 'En el diccionario, cada palabra trae siempre un único significado.', a: false, ensaya: 'tf-diccionario-varios' },
      { q: 'Los términos técnicos son palabras vagas: cada persona los entiende a su manera.', a: false, ensaya: 'tf-tecnico-exacto' },
      { q: '«Cipote» y «chunche» son formas de hablar de una región, y no errores.', a: true, ensaya: 'tf-pulperia' },
      { q: 'Un poema usa casi siempre las palabras con su significado directo, sin sugerir nada.', a: false, ensaya: 'tf-poema-connotativo' },
      { q: 'En un informe de laboratorio predomina el valor denotativo de las palabras.', a: true, ensaya: 'tf-ciencias-denotativo' },
      { q: 'En «incontable» hay un prefijo delante de la raíz y un sufijo detrás.', a: true, ensaya: 'tf-dos-piezas' },
      { q: '«Hipotenusa» es un término técnico, no una palabra del habla popular.', a: true, ensaya: 'tf-fotosintesis' },
      { q: 'En la sigla «IHSS», la «H» es la inicial de «Hospital».', a: false, ensaya: 'tf-unah' },
      { q: 'Un diccionario de Medicina es un diccionario especializado.', a: true, ensaya: 'tf-especializado' }
    ],
    seleccion: [
      { q: '«La casa de mi tía es amplia». ¿Qué palabra dice lo mismo que «amplia»?', o: ['angosta', 'grande', 'antigua', 'lejana'], a: 1, ensaya: 'mc-sencillo' },
      { q: '¿Qué palabra significa lo opuesto de «valiente»?', o: ['fuerte', 'audaz', 'cobarde', 'atrevido'], a: 2, ensaya: 'mc-abundante' },
      { q: '«Los buzos hallaron un banco de sardinas». En esa oración, «banco» nombra…', o: ['un asiento de madera', 'una oficina de dinero', 'un montón de tierra', 'un grupo de peces'], a: 3, ensaya: 'mc-banco' },
      { q: 'No sabes qué es un «pentagrama» y quieres la explicación de un músico. Te conviene buscar en…', o: ['un diccionario de Música', 'un diccionario de Medicina', 'un diccionario de Matemáticas', 'un diccionario de sinónimos'], a: 0, ensaya: 'mc-hipotenusa' },
      { q: '«Ese niño es un terremoto». Con esa expresión se quiere decir que el niño…', o: ['vive en una zona de temblores', 'es muy inquieto y travieso', 'estudia Ciencias Naturales', 'se cayó al suelo'], a: 1, ensaya: 'mc-corazon-oro' },
      { q: 'En «prever» y «preescolar», la pieza «pre-» quiere decir…', o: ['debajo', 'contra', 'muchos', 'antes'], a: 3, ensaya: 'mc-pre' },
      { q: 'En «zapatero», «jardinero» y «cocinero», el sufijo «-ero» señala…', o: ['un oficio', 'un lugar', 'un tamaño', 'un color'], a: 0, ensaya: 'mc-ero' },
      { q: '¿Cuál de estas oraciones usa vocabulario técnico de las Matemáticas?', o: ['«Nos tocaron unos confites a cada uno»', '«Sobraron dos y me los comí yo»', '«El cociente es 5 y el residuo es 1»', '«Partimos la bolsa entre los cuatro»'], a: 2, ensaya: 'mc-tecnico' },
      { q: '¿Cuál de estos textos está escrito en lenguaje no literario?', o: ['Un cuento de espantos de mi abuelo', 'Una canción de cuna muy antigua', 'El manual de uso de una licuadora', 'Un poema dedicado a la madre'], a: 2, ensaya: 'mc-literario' },
      { q: '¿Qué nombre completo se esconde en «COPECO»?', o: ['Comisión Permanente de Contingencias', 'Comité Pedagógico del Colegio', 'Cooperativa de Pesca de la Costa', 'Consejo Pesquero de Comunidades'], a: 0, ensaya: 'mc-ihss' }
    ],
    /* Pareados de aplicar: el término se une con lo que dice la nota.
       El examen lo une con su significado. */
    pareados: {
      intro: '<div class="historia"><b>Lee esta nota de Óscar:</b> «El sábado mi abuelo me llevó a su platanal. Tuve que rehacer la mochila, porque había olvidado la crema antimosquitos. Caminamos lentamente por una vereda llena de mariposas multicolores. Empezamos a cortar racimos a las siete y subimos hasta lo más alto de la finca. Mi abuelo me explicó que la lluvia y el sol son factores sin vida, y que al repartir doce racimos entre cuatro mulas el resultado es tres. Al volver me dio diez lempiras: “Tomá, para que tengás dinero”, me dijo».</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: lo que dice la nota',
      anchoA: '24%',
      pares: [
        { term: 're-', def: '«rehacer la mochila»', ensaya: 'pr-re' },
        { term: 'anti-', def: '«la crema antimosquitos»', ensaya: 'pr-anti' },
        { term: 'multi-', def: '«mariposas multicolores»', ensaya: 'pr-multi' },
        { term: '-al', def: '«me llevó a su platanal»', ensaya: 'pr-al' },
        { term: '-mente', def: '«caminamos lentamente»', ensaya: 'pr-mente' },
        { term: 'Iniciar', def: '«empezamos a cortar racimos»', ensaya: 'pr-iniciar' },
        { term: 'Ascender', def: '«subimos hasta lo más alto»', ensaya: 'pr-ascender' },
        { term: 'Abiótico', def: '«factores sin vida»', ensaya: 'pr-abiotico' },
        { term: 'Cociente', def: '«el resultado es tres»', ensaya: 'pr-cociente' },
        { term: 'Pisto', def: '«para que tengás dinero»', ensaya: 'pr-pisto' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión Las palabras y sus significados.</b> Ahora sabes que una palabra no significa siempre lo mismo: miras las que la rodean antes de decidir. Sabes cambiarla por otra que diga lo mismo, encontrarle su contrario y buscarla en el diccionario que conviene. Distingues lo que una palabra dice de lo que sugiere. Y sabes desarmarla: con su raíz, su prefijo y su sufijo entiendes palabras que nunca habías visto. Las palabras ya no te engañan.',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Anotó tres regionalismos de su casa, dos siglas con su nombre completo y una palabra con dos significados.', 'Tarea en el hogar'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión Las palabras y sus significados» (III Ciclo y Bachillerato; primer parcial, febrero y marzo). La misión cubre los tres grados del ciclo, y los prefijos, los sufijos, los neologismos, las siglas y la polisemia son sobre todo de 9.º: en 7.º y 8.º puede darlos como adelanto o dejarlos para después. Los temas no llevan etiqueta de grado, para que la hoja sirva de 7.º a 9.º. Según la programación mensual de Español: sinónimos y antónimos, denotación y connotación y vocabulario técnico van en los tres grados; el uso del diccionario, los regionalismos y el lenguaje literario y no literario, en 7.º (este último también en 8.º); el contexto y los diccionarios especializados, en 8.º y 9.º; los prefijos y sufijos, los neologismos, la polisemia y las siglas y acrónimos, en 9.º. El recuadro «Para Media» es para 10.º y 11.º. Las definiciones son redacción de la plataforma (la programación nombra estos temas sin definirlos) y el significado de cada prefijo y sufijo es el que tiene en las palabras de ejemplo: conviene contrastarlos con el diccionario que use su centro. La sección «Ponte a Prueba» <strong>no es el examen</strong>: ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados) con otras preguntas, para que el alumno practique sin haber visto la hoja que se le va a evaluar. Los ejemplos son inventados: puede cambiarlos por palabras de su comunidad. Para la evaluación final imprima la prueba desde la plataforma, que genera formas distintas con su pauta.'
};
