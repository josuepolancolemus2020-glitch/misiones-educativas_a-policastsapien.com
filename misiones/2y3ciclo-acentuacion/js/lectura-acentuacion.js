/* ══════════════════════════════════════════════════════════════
   📖 CORPUS DE LECTURA — MISIÓN DE LA ACENTUACIÓN

   ── Aquí el inventario NO se escribe: se calcula ──
   Una palabra lleva tilde o no la lleva, y eso se ve. Y por qué la
   lleva —aguda, llana, esdrújula, o diacrítica— lo dice
   js/data/lectura-acentos.js, que separa en sílabas y aplica la regla.
   No hay criterio humano que aportar, así que escribir las listas a
   mano solo añadiría erratas. Las de este archivo salieron de recorrer
   cada texto con ese lector.

     porRegla    → la tilde la manda la regla (canción, árbol, médico)
     diacritica  → la tilde distingue dos palabras (él/el, más/mas)

   Ese es también el corte de la actividad de clasificar, y es el de la
   misión: tiene una sección para las reglas generales y otra entera
   para la tilde diacrítica, que es la que de verdad cuesta.

   ── Lo que pasa al tocar una palabra SIN tilde ──
   No es un error mudo: el motor le contesta por qué no la lleva («es
   llana terminada en vocal»). Equivocarse ahí enseña tanto como
   acertar, y es la única actividad del proyecto donde el fallo explica
   la regla completa.

   ── Cada texto trae al menos tres diacríticas ──
   Sin ellas la actividad de clasificar no tiene con qué jugar. Por eso
   los textos son de gente hablando: en el diálogo aparecen solas —él,
   más, sí, qué, sé, mí, cómo—, sin tener que forzarlas.

   Antes de publicar un cambio:
     node _dev/prueba-acentos.js
     node _dev/valida-lectura-mision.js
     node _dev/verifica-nombres-propios.js
     node _dev/verifica-impresion-lectura.js
══════════════════════════════════════════════════════════════ */

const LECTURA_ACENTUACION = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LT4-01', titulo: 'El álbum de mi papá', genero: 'narrativo',
      texto: 'Mi papá guarda un álbum de fotografías arriba del ropero. Un día me dijo: mirá, este sí lo podés ver, pero con las manos limpias. Aquí está él a los quince años, flaquísimo, con una camisa que ya no existe. Yo le pregunté qué pasó con el árbol de mango que sale atrás y me contestó que lo cortaron cuando hicieron la carretera. En otra fotografía está mi mamá, más joven que yo ahora. Le pregunté cómo se conocieron y él se rió sin decirme nada. Después me dio el álbum y me dijo: guardalo vos, que a mí ya se me olvidan los nombres.',
      porRegla: ['papá', 'álbum', 'fotografías', 'día', 'mirá', 'podés', 'Aquí', 'está', 'flaquísimo', 'pregunté', 'pasó', 'árbol', 'atrás', 'contestó', 'fotografía', 'mamá', 'rió', 'Después'],
      diacritica: ['sí', 'él', 'qué', 'más', 'cómo', 'mí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde guarda el álbum?', r: 'Arriba del ropero.',
          o: ['En un baúl.', 'Debajo de la cama.', 'Arriba del ropero.'], c: 2 },
        { tipo: 'literal', q: '¿Qué condición le puso para verlo?', r: 'Que lo viera con las manos limpias.',
          o: ['Que lo viera con las manos limpias.', 'Que no lo sacara del cuarto.', 'Que no preguntara nada.'], c: 0 },
        { tipo: 'literal', q: '¿Qué pasó con el árbol de mango?', r: 'Lo cortaron cuando hicieron la carretera.',
          o: ['Lo cortaron cuando hicieron la carretera.', 'Se lo llevó una tormenta.', 'Se secó.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué le entregó el álbum al final?', r: 'Porque a él ya se le olvidan los nombres y quiere que alguien los guarde.',
          o: ['Porque ya no le interesa.', 'Porque no cabe en el ropero.', 'Porque a él ya se le olvidan los nombres y quiere que alguien los guarde.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué crees que no le contestó cómo se conocieron?', r: 'Respuesta abierta: se valora que note la timidez o el pudor detrás del silencio.',
          o: ['Porque no se acordaba.', 'Porque le dio pena contarlo, no porque no lo supiera.', 'Porque no quería hablar con él.'], c: 1 },
      ] },

    { id: 'LT4-02', titulo: 'El árbol del patio', genero: 'narrativo',
      texto: 'En el patio de la escuela hay un árbol de jocote que sembró un alumno hace más de veinte años. Nadie sabe quién fue él. La maestra dice que sí hay un nombre escrito en la corteza, pero ya casi no se lee. Los niños se sientan debajo cuando hace calor y en marzo se pelean por los jocotes. Un día vino un señor mayor, preguntó por el árbol y se quedó viéndolo un rato largo. No dijo quién era. Cuando le preguntaron si él lo había sembrado, contestó: qué importa eso ahora; lo que importa es que todavía está aquí.',
      porRegla: ['árbol', 'sembró', 'día', 'preguntó', 'quedó', 'viéndolo', 'había', 'contestó', 'todavía', 'está', 'aquí'],
      diacritica: ['más', 'quién', 'él', 'sí', 'qué'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué árbol hay en el patio?', r: 'Un árbol de jocote.',
          o: ['Un mango.', 'Un árbol de jocote.', 'Un pino.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hay escrito en la corteza?', r: 'Un nombre, que ya casi no se lee.',
          o: ['Una fecha.', 'Un nombre, que ya casi no se lee.', 'Nada.'], c: 1 },
        { tipo: 'literal', q: '¿Qué contestó el señor mayor?', r: 'Que qué importaba eso ahora, que lo importante era que el árbol siguiera ahí.',
          o: ['Que qué importaba eso ahora, que lo importante era que siguiera ahí.', 'Que no se acordaba.', 'Que él lo había sembrado.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se quedó viéndolo un rato largo?', r: 'Porque probablemente era él quien lo sembró y le trajo recuerdos.',
          o: ['Porque quería cortarlo.', 'Porque probablemente era él quien lo sembró y le trajo recuerdos.', 'Porque nunca había visto un jocote.'], c: 1 },
        { tipo: 'critica', q: '¿Importa saber quién sembró el árbol? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que discuta el valor del nombre frente al del árbol mismo.',
          o: ['Sí: hay que poner una placa con su nombre.', 'Importa menos que el árbol siga dando sombra, como él mismo dijo.', 'No importa nada.'], c: 1 },
      ] },

    { id: 'LT4-03', titulo: 'La lámpara de gas', genero: 'expositivo',
      texto: 'Antes de que llegara la energía eléctrica, en muchas casas se alumbraban con una lámpara de gas. Tenía un depósito, una mecha de algodón y un tubo de vidrio que se llama bombillo. Había que limpiarlo casi a diario, porque el humo lo dejaba negro. La mecha se cortaba pareja con una tijera: si quedaba disparejo, la llama hacía punta y ahumaba más. Mi abuela dice que ella estudió así toda la primaria. Le pregunté si no era difícil y me dijo que sí, pero que él le cortaba la mecha cada noche. El olor a gas todavía le recuerda las tareas, y eso le gusta más de lo que uno creería.',
      porRegla: ['energía', 'eléctrica', 'lámpara', 'Tenía', 'depósito', 'algodón', 'Había', 'hacía', 'estudió', 'así', 'pregunté', 'difícil', 'todavía', 'creería'],
      diacritica: ['más', 'sí', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se llama el tubo de vidrio?', r: 'Bombillo.',
          o: ['Mecha.', 'Bombillo.', 'Depósito.'], c: 1 },
        { tipo: 'literal', q: '¿Por qué había que limpiarlo casi a diario?', r: 'Porque el humo lo dejaba negro y la luz salía débil.',
          o: ['Porque el humo lo dejaba negro y la luz salía débil.', 'Para que no se quebrara.', 'Porque se llenaba de polvo.'], c: 0 },
        { tipo: 'literal', q: '¿Cómo se cortaba la mecha?', r: 'Pareja, con una tijera.',
          o: ['Pareja, con una tijera.', 'Con la mano.', 'En punta.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué nunca le pareció difícil a la abuela?', r: 'Porque no conocía otra cosa: para ella era lo normal.',
          o: ['Porque tenía muy buena vista.', 'Porque estudiaba de día.', 'Porque no conocía otra cosa: para ella era lo normal.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué el olor le recuerda las tareas? Argumenta.', r: 'Respuesta abierta: se valora que relacione un olor con un recuerdo repetido.',
          o: ['Porque los cuadernos olían a gas.', 'Porque le gustaba ese olor.', 'Porque durante años estudió con esa lámpara, y el olor quedó pegado al recuerdo.'], c: 2 },
      ] },

    { id: 'LT4-04', titulo: 'El pájaro que aprendió a hablar', genero: 'narrativo',
      texto: 'A mi tía le regalaron un perico y ella le enseñó dos frases. La primera era su propio nombre; la segunda, «¿ya comiste?». El animal las repetía todo el día, sin saber qué decía. Un domingo llegó el médico a ver a mi abuelo, que estaba enfermo. Cuando entró al cuarto, el perico gritó desde la cocina: ¿ya comiste? Todos se rieron, hasta mi abuelo, que llevaba dos días sin hablar. Mi tía dice que aquel día el perico hizo más que cualquier medicina. Yo creo que él ni cuenta se dio, pero eso no le quita nada.',
      porRegla: ['tía', 'enseñó', 'repetía', 'día', 'decía', 'llegó', 'médico', 'entró', 'gritó', 'días'],
      diacritica: ['qué', 'más', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué dos frases aprendió el perico?', r: 'Su propio nombre y «¿ya comiste?».',
          o: ['Canciones enteras.', 'Solo su nombre.', 'Su propio nombre y «¿ya comiste?».'], c: 2 },
        { tipo: 'literal', q: '¿Quién llegó ese domingo?', r: 'El médico.',
          o: ['El médico.', 'La tía.', 'Un vecino.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto llevaba el abuelo sin hablar?', r: 'Dos días.',
          o: ['Dos días.', 'Un mes.', 'Una semana.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la tía dice que hizo más que cualquier medicina?', r: 'Porque logró que el abuelo se riera después de dos días callado.',
          o: ['Porque el perico era muy inteligente.', 'Porque logró que el abuelo se riera después de dos días callado.', 'Porque el médico no llevaba medicinas.'], c: 1 },
        { tipo: 'critica', q: '¿Le quita valor que el perico no entendiera lo que decía? Argumenta.', r: 'Respuesta abierta: se valora que distinga la intención del efecto.',
          o: ['Sí: si no entiende, no cuenta.', 'Da igual, es solo un animal.', 'No: el efecto en el abuelo fue real, aunque el perico no lo supiera.'], c: 2 },
      ] },

    { id: 'LT4-05', titulo: 'El cumpleaños de Andrés', genero: 'narrativo',
      texto: 'A Andrés le hicieron una fiesta sorpresa y casi se descubre todo. Su mamá compró la piñata el sábado y la escondió arriba del ropero, pero él la vio cuando buscaba su balón. No dijo nada. El domingo llegaron sus primos y él fingió que se sorprendía. Actuó tan mal que su prima le preguntó: ¿vos ya sabías? Él contestó que no, y todos supieron que sí. Después, cuando ya estaban comiendo el pastel, su mamá le dijo al oído: te vi la cara, mijo. Él se rió y le contestó: ¿y vos creés que no sé mirar? Yo también te vi la cara a vos cuando escondiste la piñata.',
      porRegla: ['Andrés', 'mamá', 'compró', 'sábado', 'escondió', 'balón', 'fingió', 'sorprendía', 'Actuó', 'preguntó', 'sabías', 'contestó', 'Después', 'oído', 'rió', 'creés', 'también'],
      diacritica: ['él', 'sí', 'sé'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde escondió la mamá la piñata?', r: 'Arriba del ropero.',
          o: ['Arriba del ropero.', 'En casa de la vecina.', 'Debajo de la cama.'], c: 0 },
        { tipo: 'literal', q: '¿Qué le preguntó su prima?', r: 'Si ya sabía de la fiesta.',
          o: ['Si le gustó el pastel.', 'Dónde estaba su balón.', 'Si ya sabía de la fiesta.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le dijo la mamá al oído?', r: 'Que le vio la cara.',
          o: ['Que le vio la cara.', 'Que repartiera el pastel.', 'Que se portara bien.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué todos supieron que sí sabía?', r: 'Porque actuó tan mal fingiendo sorpresa que se le notó.',
          o: ['Porque su mamá se los contó.', 'Porque su prima lo delató.', 'Porque actuó tan mal fingiendo sorpresa que se le notó.'], c: 2 },
        { tipo: 'critica', q: '¿Hizo bien Andrés en fingir? Defiende tu postura.', r: 'Respuesta abierta: se valora que note la intención de no arruinarle el gusto a los demás.',
          o: ['No: debió decir la verdad de una vez.', 'Sí: quiso no arruinarle la sorpresa a los que la prepararon.', 'Da igual, igual lo descubrieron.'], c: 1 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LT5-01', titulo: 'El teléfono público', genero: 'expositivo',
      texto: 'Antes de los celulares, en cada pueblo había un teléfono público y todos sabían dónde estaba. Se pagaba con fichas o con monedas, y había que hablar rápido porque siempre esperaba alguien más atrás. Las llamadas de larga distancia se pedían con anticipación: uno dejaba el número y el operador avisaba cuando por fin lograba comunicar. Mi mamá cuenta que ella esperó una vez tres horas para hablar cinco minutos con su hermano. Cuando él contestó, ella no supo qué decirle y se le fue casi todo el tiempo en preguntarle cómo estaba. Después lloró de rabia. Hoy le manda mensajes cuando quiere y dice que todavía no se acostumbra a que sea tan fácil.',
      porRegla: ['había', 'teléfono', 'público', 'sabían', 'rápido', 'atrás', 'pedían', 'anticipación', 'número', 'mamá', 'esperó', 'contestó', 'Después', 'lloró', 'todavía', 'fácil'],
      diacritica: ['dónde', 'más', 'él', 'qué', 'cómo'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se pagaba el teléfono público?', r: 'Con fichas o monedas.',
          o: ['Era gratis.', 'Con billetes.', 'Con fichas o monedas.'], c: 2 },
        { tipo: 'literal', q: '¿Cuánto esperó la mamá aquella vez?', r: 'Tres horas.',
          o: ['Tres horas.', 'Media hora.', 'Todo un día.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué lloró de rabia?', r: 'Porque después de esperar tanto, no aprovechó los minutos que tuvo.',
          o: ['Porque después de esperar tanto, no aprovechó los minutos que tuvo.', 'Porque le cobraron de más.', 'Porque su hermano no contestó.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «todavía no se acostumbra a que sea tan fácil»?', r: 'Que le cuesta creer que ahora hablar no cueste esfuerzo ni espera.',
          o: ['Que le cuesta creer que ahora hablar no cueste esfuerzo ni espera.', 'Que prefiere el teléfono viejo.', 'Que no sabe usar el celular.'], c: 0 },
        { tipo: 'critica', q: '¿Se aprovecha más lo que cuesta conseguir? Defiende tu postura.', r: 'Respuesta abierta: se valora que argumente con el ejemplo del texto o con uno propio.',
          o: ['Muchas veces sí, aunque eso no vuelve mejor lo difícil.', 'Sí siempre: lo fácil no se valora.', 'No: da igual lo que cueste.'], c: 0 },
      ] },

    { id: 'LT5-02', titulo: 'El músico del parque', genero: 'narrativo',
      texto: 'En el parque central toca un señor con una guitarra vieja y un sombrero en el suelo. Yo pasaba por ahí todos los días y nunca le dejaba nada. Un día lo oí tocar una canción que mi papá cantaba, y me quedé parado sin darme cuenta. Cuando terminó, él me preguntó: ¿te gustó, muchacho? Le dije que sí, que mi papá la cantaba. Me preguntó dónde estaba él y le contesté que había fallecido. El señor no dijo nada. Volvió a tocarla completa, más despacio, mirándome a mí. Después siguió con otra como si nada. Desde entonces siempre le dejo algo, aunque él nunca me lo pidió. Sé que no se acuerda de mí, y qué importa: yo sí me acuerdo de él.',
      porRegla: ['ahí', 'días', 'día', 'oí', 'canción', 'papá', 'quedé', 'terminó', 'preguntó', 'gustó', 'contesté', 'había', 'Volvió', 'mirándome', 'Después', 'siguió', 'pidió'],
      diacritica: ['él', 'sí', 'dónde', 'más', 'mí', 'Sé', 'qué'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le preguntó el músico?', r: 'Si le había gustado la canción.',
          o: ['Cómo se llamaba.', 'Si tenía monedas.', 'Si le había gustado la canción.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hizo el señor después de saberlo?', r: 'Volvió a tocar la canción completa, más despacio.',
          o: ['Le pidió que se fuera.', 'Le dio el sombrero.', 'Volvió a tocar la canción completa, más despacio.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué volvió a tocarla?', r: 'Porque fue su manera de acompañarlo, sin decir nada.',
          o: ['Porque quería más monedas.', 'Porque fue su manera de acompañarlo, sin decir nada.', 'Porque era la única que sabía.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el narrador le deja algo desde entonces?', r: 'Porque el músico le dio algo que no se paga con monedas y él quiso responder.',
          o: ['Porque el músico le dio algo que no se paga con monedas.', 'Porque se lo pidió.', 'Porque le da lástima.'], c: 0 },
        { tipo: 'critica', q: '¿Vale más lo que hizo el músico que una conversación? Argumenta.', r: 'Respuesta abierta: se valora que reconozca el valor del gesto sin descartar la palabra.',
          o: ['No: debió decirle algo.', 'A veces un gesto llega donde no llega una frase.', 'Da igual, solo tocó una canción.'], c: 1 },
      ] },

    { id: 'LT5-03', titulo: 'Los números del médico', genero: 'expositivo',
      texto: 'En el centro de salud la enfermera anota tres números en la tarjeta de cada niño: el peso, la talla y el perímetro del brazo. Ese último es el que más dice y casi nadie lo sabe. Si el brazo de un niño pequeño mide menos de cierta medida, hay desnutrición aguda aunque el peso parezca normal. La cinta que se usa tiene colores: verde, amarillo y rojo, para que se entienda sin saber leer números. La médica del turno explica siempre lo mismo a las madres: si le sale amarillo, todavía estamos a tiempo; si le sale rojo, hay que actuar hoy, no mañana. Y les enseña cómo medirlo ellas mismas en la casa. Si a él le sale rojo, dice, no esperés a nadie más: vení.',
      porRegla: ['números', 'perímetro', 'último', 'desnutrición', 'médica', 'todavía', 'esperés', 'vení'],
      diacritica: ['más', 'cómo', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué tres números se anotan?', r: 'El peso, la talla y el perímetro del brazo.',
          o: ['La edad, el peso y la estatura.', 'El peso, la talla y el perímetro del brazo.', 'Solo el peso y la talla.'], c: 1 },
        { tipo: 'literal', q: '¿Qué colores tiene la cinta?', r: 'Verde, amarillo y rojo.',
          o: ['Blanco y negro.', 'Verde, amarillo y rojo.', 'Azul y rojo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la cinta usa colores y no solo números?', r: 'Para que se entienda aunque quien la use no sepa leer números.',
          o: ['Porque es más barata.', 'Porque los números se borran.', 'Para que se entienda aunque quien la use no sepa leer números.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el perímetro del brazo «es el que más dice»?', r: 'Porque detecta desnutrición aguda aunque el peso parezca normal.',
          o: ['Porque es el más fácil de medir.', 'Porque detecta desnutrición aguda aunque el peso parezca normal.', 'Porque lo pide el ministerio.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué les enseña a las madres a medirlo ellas? Argumenta.', r: 'Respuesta abierta: se valora que note el valor de detectar a tiempo sin depender del centro de salud.',
          o: ['Para que puedan detectarlo a tiempo sin esperar a la próxima cita.', 'Para que no vayan tanto al centro.', 'Porque la enfermera no da abasto.'], c: 0 },
      ] },

    { id: 'LT5-04', titulo: 'La brújula sin aguja', genero: 'narrativo',
      texto: 'Nos perdimos en el bosque de pino cuando bajábamos de la montaña. Mi tío no llevaba brújula ni teléfono con señal. Yo me asusté y él no. Me dijo: sentate, que perderse no es lo peor; lo peor es caminar rápido sin saber para dónde. Después me enseñó a mirar el sol y los troncos. Dijo que del lado donde crece más musgo suele haber menos sol, y que el agua siempre baja, así que si uno sigue una quebrada tarde o temprano encuentra gente. Seguimos la quebrada hora y media y salimos a una champa. Ahí él tomó café como si nada. Yo todavía me acuerdo de la primera frase más que del camino.',
      porRegla: ['bajábamos', 'tío', 'brújula', 'teléfono', 'asusté', 'rápido', 'Después', 'enseñó', 'así', 'Ahí', 'tomó', 'café', 'todavía'],
      diacritica: ['él', 'dónde', 'más'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le dijo el tío al principio?', r: 'Que se sentara, que perderse no es lo peor.',
          o: ['Que se sentara, que perderse no es lo peor.', 'Que corriera hacia el norte.', 'Que gritara pidiendo ayuda.'], c: 0 },
        { tipo: 'literal', q: '¿Qué siguieron para salir?', r: 'Una quebrada.',
          o: ['El camino de tierra.', 'Las huellas de vuelta.', 'Una quebrada.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué seguir el agua sirve para encontrar gente?', r: 'Porque el agua siempre baja y las personas se asientan cerca de ella.',
          o: ['Porque el agua está fría.', 'Porque las quebradas tienen puentes.', 'Porque el agua siempre baja y las personas se asientan cerca.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué recuerda más la frase que el camino?', r: 'Porque lo que le sirvió de verdad fue calmarse, no la ruta.',
          o: ['Porque el camino era aburrido.', 'Porque lo que le sirvió de verdad fue calmarse, no la ruta.', 'Porque su tío la repitió mucho.'], c: 1 },
        { tipo: 'critica', q: '¿Qué es lo más peligroso al perderse? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que argumente sobre el pánico frente a la falta de equipo.',
          o: ['No tener brújula ni teléfono.', 'La oscuridad.', 'Apurarse sin rumbo: gasta fuerzas y aleja más.'], c: 2 },
      ] },

    { id: 'LT5-05', titulo: 'El árbitro del barrio', genero: 'narrativo',
      texto: 'En la cancha del barrio nadie quería pitar los partidos, porque al árbitro siempre le gritan. Entonces don Óscar, que ya está mayor, se ofreció. Puso una sola condición: que el que reclamara saliera del campo, así fuera el mejor. El primer domingo expulsó a tres. El segundo, a uno. El tercero, a nadie. Un muchacho le preguntó por qué era tan estricto y él contestó algo que se quedó dando vueltas: yo no vine a que ustedes estén de acuerdo conmigo; vine para que puedan jugar. Ahora los partidos duran los noventa minutos completos y ya casi no hay pleitos. Él sigue equivocándose de vez en cuando y todos lo saben, pero nadie le grita. Mi tío dice que sí se equivoca menos que antes, y que aquí ya nadie discute qué es falta.',
      porRegla: ['quería', 'árbitro', 'Óscar', 'está', 'ofreció', 'condición', 'así', 'expulsó', 'preguntó', 'contestó', 'quedó', 'estén', 'equivocándose', 'tío', 'aquí'],
      diacritica: ['qué', 'él', 'sí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué condición puso don Óscar?', r: 'Que el que reclamara saliera del campo.',
          o: ['Que le pagaran por partido.', 'Que el que reclamara saliera del campo.', 'Que jugaran sin público.'], c: 1 },
        { tipo: 'literal', q: '¿A cuántos expulsó el tercer domingo?', r: 'A nadie.',
          o: ['A tres.', 'A uno.', 'A nadie.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué bajó tanto el número de expulsados?', r: 'Porque los jugadores entendieron la regla y dejaron de reclamar.',
          o: ['Porque los jugadores entendieron la regla y dejaron de reclamar.', 'Porque llegaron menos jugadores.', 'Porque él se ablandó.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué significa «no vine a que estén de acuerdo conmigo; vine para que puedan jugar»?', r: 'Que su trabajo es que el partido exista, no que le den la razón.',
          o: ['Que su trabajo es que el partido exista, no que le den la razón.', 'Que no quiere hablar con nadie.', 'Que no le importa equivocarse.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué nadie le grita aunque se equivoque? Argumenta.', r: 'Respuesta abierta: se valora que note la autoridad ganada por sostener una regla pareja.',
          o: ['Porque le tienen miedo.', 'Porque se ganó el respeto sosteniendo la misma regla para todos.', 'Porque es mayor.'], c: 1 },
      ] },
  ],

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LT6-01', titulo: 'La máquina de escribir', genero: 'expositivo',
      texto: 'En el juzgado de un municipio todavía hay una máquina de escribir mecánica, y no es adorno. La usan cuando se va la energía, que ahí pasa seguido. Escribir en ella exige algo que las computadoras nos quitaron: pensar la frase completa antes de teclearla, porque corregir cuesta. Cada error se tapa con corrector o se repite la hoja entera. La secretaria dice que ella escribe más rápido en la computadora, pero que en la máquina se equivoca menos. Un abogado joven quiso saber si eso era cierto y contó las correcciones de un mes. Tenía razón ella. Él lo explicó después así: cuando borrar es fácil, uno escribe sin decidir; cuando cuesta, decide antes. La máquina no lo hace a uno más listo; lo hace más lento, y él dice que a veces es lo mismo. Yo sé que tiene razón, aunque me cueste.',
      porRegla: ['todavía', 'máquina', 'mecánica', 'energía', 'ahí', 'rápido', 'contó', 'Tenía', 'razón', 'explicó', 'después', 'así', 'fácil'],
      diacritica: ['más', 'Él', 'sé'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuándo usan la máquina de escribir?', r: 'Cuando se va la energía.',
          o: ['Todos los días.', 'Para documentos oficiales.', 'Cuando se va la energía.'], c: 2 },
        { tipo: 'literal', q: '¿Qué comprobó el abogado joven?', r: 'Que la secretaria se equivoca menos en la máquina.',
          o: ['Que la secretaria se equivoca menos en la máquina.', 'Que la máquina era más rápida.', 'Que la computadora fallaba.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se equivoca menos en la máquina?', r: 'Porque corregir cuesta, así que piensa la frase antes de escribirla.',
          o: ['Porque corregir cuesta, así que piensa la frase antes de escribirla.', 'Porque las teclas son más grandes.', 'Porque escribe más despacio por costumbre.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir «lo hace más lento, que a veces es lo mismo»?', r: 'Que ir más despacio produce el mismo efecto que pensar mejor.',
          o: ['Que ir más despacio produce el mismo efecto que pensar mejor.', 'Que la máquina está descompuesta.', 'Que la lentitud es un defecto.'], c: 0 },
        { tipo: 'critica', q: '¿Conviene que corregir sea difícil? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta el costo de la fricción frente a lo que hace ganar.',
          o: ['No: entre más fácil, mejor.', 'A veces sí: la facilidad de borrar quita la costumbre de decidir antes.', 'Da igual, lo que importa es el resultado.'], c: 1 },
      ] },

    { id: 'LT6-02', titulo: 'El médico que preguntaba primero', genero: 'narrativo',
      texto: 'Al centro de salud de la aldea llegó un médico joven que hacía algo raro: antes de revisar a nadie, preguntaba a qué se dedicaba y cuánto caminaba para llegar. Las enfermeras pensaron que perdía el tiempo. Después entendieron. A una señora con dolor de espalda le recetó un cambio en cómo cargaba el agua, no una pastilla. A un muchacho con tos crónica le preguntó dónde dormía y descubrió que era junto al fogón, sin ventana. Nada de eso sale en un análisis. Él lo explicaba así: la enfermedad está en el cuerpo, pero casi siempre la causa está en la casa. El primer año las consultas se le alargaron muchísimo. El segundo bajaron, porque la misma gente volvía menos. Cuando le preguntaron cómo lo había logrado, él contestó que no fue él: que fue preguntar.',
      porRegla: ['llegó', 'médico', 'hacía', 'perdía', 'Después', 'recetó', 'crónica', 'preguntó', 'dormía', 'descubrió', 'fogón', 'análisis', 'así', 'está', 'muchísimo', 'volvía', 'había', 'contestó'],
      diacritica: ['qué', 'cuánto', 'cómo', 'dónde', 'Él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué preguntaba antes de revisar?', r: 'A qué se dedicaba y cuánto caminaba para llegar.',
          o: ['Qué edad tenía.', 'A qué se dedicaba y cuánto caminaba para llegar.', 'Si tenía seguro médico.'], c: 1 },
        { tipo: 'literal', q: '¿Qué descubrió con el muchacho de la tos?', r: 'Que dormía junto al fogón, sin ventana.',
          o: ['Que fumaba.', 'Que dormía junto al fogón, sin ventana.', 'Que tenía asma.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué las consultas bajaron el segundo año?', r: 'Porque al resolver la causa, la misma gente volvía menos.',
          o: ['Porque la gente dejó de confiar.', 'Porque contrataron otro médico.', 'Porque al resolver la causa, la misma gente volvía menos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa «la causa está en la casa»?', r: 'Que muchas enfermedades vienen de las condiciones en que se vive, no del cuerpo solo.',
          o: ['Que muchas enfermedades vienen de las condiciones en que se vive.', 'Que hay que desinfectar las casas.', 'Que la gente se enferma por descuido.'], c: 0 },
        { tipo: 'critica', q: '¿Vale la pena una consulta más larga? Argumenta.', r: 'Respuesta abierta: se valora que compare el costo inmediato con el resultado a mediano plazo.',
          o: ['No: hay mucha gente esperando.', 'Solo si el paciente lo pide.', 'Sí si evita que la persona vuelva por lo mismo, como pasó aquí.'], c: 2 },
      ] },

    { id: 'LT6-03', titulo: 'El día que se cayó el sistema', genero: 'narrativo',
      texto: 'En el banco del pueblo se cayó el sistema un viernes de quincena y la fila daba vuelta a la cuadra. Los cajeros no podían hacer nada y la gente empezó a molestarse. Entonces la gerente, que llevaba dos meses ahí, salió a la calle con una libreta. Anotó el nombre de cada persona en orden, les dio un número escrito a mano y les dijo: váyanse a hacer sus cosas y regresen a las dos; les respeto el turno. Nadie perdió su lugar. Cuando el sistema volvió, la fila se despachó en hora y media sin un solo reclamo. Su jefe le preguntó después de dónde había sacado eso. Ella contestó que de ningún manual: su mamá vendía en el mercado y así hacía cuando se le juntaba la gente. Él le preguntó cuánto habían ahorrado y ella dijo que sí sabía, pero que no era eso.',
      porRegla: ['cayó', 'podían', 'empezó', 'ahí', 'salió', 'Anotó', 'número', 'váyanse', 'perdió', 'volvió', 'despachó', 'preguntó', 'después', 'había', 'contestó', 'ningún', 'mamá', 'vendía', 'así', 'hacía', 'habían', 'sabía'],
      diacritica: ['dónde', 'Él', 'cuánto', 'sí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo la gerente?', r: 'Salió con una libreta y le dio un número escrito a mano a cada persona.',
          o: ['Llamó a la policía.', 'Cerró el banco.', 'Salió con una libreta y le dio un número a cada persona.'], c: 2 },
        { tipo: 'literal', q: '¿En cuánto tiempo se despachó la fila?', r: 'En hora y media.',
          o: ['En todo el día.', 'En diez minutos.', 'En hora y media.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la gente dejó de molestarse?', r: 'Porque su lugar quedó garantizado y pudieron irse a hacer otras cosas.',
          o: ['Porque el sistema volvió enseguida.', 'Porque su lugar quedó garantizado y pudieron irse.', 'Porque les dieron café.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué muestra que la idea viniera del mercado?', r: 'Que la solución no salió de un manual sino de un saber práctico y familiar.',
          o: ['Que los bancos copian a los mercados.', 'Que su mamá trabajaba en el banco.', 'Que la solución salió de un saber práctico y familiar.'], c: 2 },
        { tipo: 'critica', q: '¿Debería el banco poner eso por escrito como procedimiento? Argumenta.', r: 'Respuesta abierta: se valora que note el valor de institucionalizar lo que funcionó y también su límite.',
          o: ['No: fue cosa de una sola vez.', 'Sí, para que no dependa de que a alguien se le ocurra.', 'No: cada quien improvisa mejor.'], c: 1 },
      ] },

    { id: 'LT6-04', titulo: 'Cómo se afila un machete', genero: 'instructivo',
      texto: 'Un machete mal afilado cansa más y corta menos, y además es más peligroso, porque rebota. Se afila con lima, no con piedra de agua: la piedra es para el cuchillo. Sujetá el machete firme, con el filo hacia arriba, y pasá la lima siempre en un solo sentido, empujando; nunca de ida y vuelta, que eso solo lo desgasta. El ángulo importa más que la fuerza: hay que mantener el mismo, más o menos como un cuarto de un ángulo recto. Vas a saber que está listo cuando se levante una rebaba finísima del otro lado. Ahí se le da unas pasadas suaves para quitarla. Y al terminar, límpielo y guárdelo seco: el óxido come el filo más rápido que el trabajo. Si él te queda áspero al tacto, todavía le falta; cuando ya no, dejalo así. ¿Y cómo sabés que está bueno? Rebana el zacate sin jalarlo.',
      porRegla: ['además', 'Sujetá', 'pasá', 'ángulo', 'está', 'finísima', 'Ahí', 'límpielo', 'guárdelo', 'óxido', 'rápido', 'áspero', 'todavía', 'así', 'sabés'],
      diacritica: ['más', 'él', 'cómo'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se afila el machete?', r: 'Con lima.',
          o: ['Con lima.', 'Con piedra de agua.', 'Con una piedra del río.'], c: 0 },
        { tipo: 'literal', q: '¿Cómo se pasa la lima?', r: 'Siempre en un solo sentido, empujando.',
          o: ['Siempre en un solo sentido, empujando.', 'De ida y vuelta.', 'En círculos.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cómo se sabe que ya está listo?', r: 'Cuando se levanta una rebaba finísima del otro lado.',
          o: ['Cuando brilla.', 'Cuando se levanta una rebaba finísima del otro lado.', 'Cuando corta un papel.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué un machete mal afilado es más peligroso?', r: 'Porque rebota en vez de morder, y el golpe se desvía.',
          o: ['Porque hay que hacer más fuerza y uno se cansa.', 'Porque se puede quebrar.', 'Porque rebota en vez de morder, y el golpe se desvía.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué el texto insiste en el ángulo y no en la fuerza? Argumenta.', r: 'Respuesta abierta: se valora que note que la técnica constante rinde más que el esfuerzo.',
          o: ['Porque la fuerza cansa.', 'Porque las limas son delicadas.', 'Porque un ángulo constante hace el filo, y la fuerza sin ángulo solo gasta el metal.'], c: 2 },
      ] },

    { id: 'LT6-05', titulo: 'El examen que ella no firmó', genero: 'narrativo',
      texto: 'A mitad del examen de Matemáticas, la profesora Ángela se dio cuenta de que un problema estaba mal planteado: no tenía solución. Faltaban veinte minutos. Podía dejarlo así y anular después esa pregunta, que es lo que casi todos habrían hecho. En cambio detuvo el examen, pidió disculpas y les dio a todos diez minutos más. Un alumno le reclamó que él ya lo había resuelto «de alguna manera». Ella le contestó: si lo resolviste, es que inventaste un dato, y eso no es lo que te estoy pidiendo. Después le entregó al director un informe escrito reconociendo el error, sin que nadie se lo pidiera. Aquello le costó un llamado de atención. Ella dice que sí lo volvería a hacer, porque lo que no se anota nunca se corrige. Él, el director, todavía no está de acuerdo.',
      porRegla: ['Matemáticas', 'Ángela', 'tenía', 'solución', 'Podía', 'así', 'después', 'habrían', 'pidió', 'reclamó', 'había', 'contestó', 'entregó', 'costó', 'atención', 'volvería', 'todavía', 'está'],
      diacritica: ['más', 'él', 'sí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo al darse cuenta del error?', r: 'Detuvo el examen, pidió disculpas y dio diez minutos más.',
          o: ['Detuvo el examen, pidió disculpas y dio diez minutos más.', 'Anuló la pregunta al final.', 'No dijo nada.'], c: 0 },
        { tipo: 'literal', q: '¿Qué le costó entregar el informe?', r: 'Un llamado de atención.',
          o: ['Un llamado de atención.', 'Una felicitación.', 'Nada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué le dijo al alumno que había inventado un dato?', r: 'Porque el problema no tenía solución, así que solo se podía resolver suponiendo algo que no estaba.',
          o: ['Porque copió a un compañero.', 'Porque el problema no tenía solución: solo se resolvía suponiendo un dato.', 'Porque se equivocó al leerlo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué significa «lo que no se anota nunca se corrige»?', r: 'Que un error que no queda registrado se vuelve a cometer.',
          o: ['Que un error que no queda registrado se vuelve a cometer.', 'Que los informes son obligatorios.', 'Que hay que escribirlo todo.'], c: 0 },
        { tipo: 'critica', q: '¿Debió entregar el informe sabiendo lo que le costaría? Defiende tu postura.', r: 'Respuesta abierta: se valora que ponga en la balanza el costo personal y el beneficio del registro.',
          o: ['No: nadie se lo pidió y le fue mal.', 'Sí: sin registro, el mismo error le toca al grupo del año próximo.', 'Debió esperar a que se lo pidieran.'], c: 1 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LT7-01', titulo: 'La tilde que costó una casa', genero: 'expositivo',
      texto: 'En un juzgado se discutió durante meses una escritura por culpa de una tilde. El documento decía que el terreno se repartía «entre él y su hermano»; en la copia registrada, alguien había escrito «entre el y su hermano», sin tilde. Parece una tontería y no lo es: «el» sin tilde es artículo y no señala a nadie, mientras que «él» señala a una persona concreta. El abogado de la otra parte argumentó que así el texto quedaba incompleto y que había que interpretarlo de otra manera. Tardaron casi un año en resolverlo. Al final ganó quien tenía el original firmado. La secretaria del juzgado dice que desde entonces revisa dos veces cada «él», cada «sí» y cada «más» de los documentos que pasan por sus manos, y que nadie le tuvo que explicar por qué. Cuando alguien le dice que exagera, ella contesta lo mismo: ¿vos sabés cuánto vale esa casa? Sí, yo sé, porque la vi discutirse un año entero por una rayita.',
      porRegla: ['discutió', 'decía', 'repartía', 'había', 'tontería', 'artículo', 'argumentó', 'así', 'ganó', 'tenía', 'sabés'],
      diacritica: ['él', 'sí', 'más', 'qué', 'cuánto', 'sé'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué diferencia había entre las dos copias?', r: 'Una decía «él» con tilde y la otra «el» sin tilde.',
          o: ['Una decía «él» con tilde y la otra «el» sin tilde.', 'Faltaba una firma.', 'Cambiaba el número de la finca.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto tardaron en resolverlo?', r: 'Casi un año.',
          o: ['Un mes.', 'Una semana.', 'Casi un año.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué esa tilde cambiaba el sentido?', r: 'Porque «el» es artículo y no señala a nadie, y «él» señala a una persona concreta.',
          o: ['Porque se leía más lento.', 'Porque estaba mal escrita.', 'Porque «el» es artículo y «él» señala a una persona concreta.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la secretaria revisa dos veces esas palabras?', r: 'Porque vio de primera mano lo que cuesta un error en una tilde diacrítica.',
          o: ['Porque se lo ordenaron.', 'Porque le gusta la ortografía.', 'Porque vio lo que cuesta un error en una tilde diacrítica.'], c: 2 },
        { tipo: 'critica', q: '¿Es exagerado discutir un año por una tilde? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta la relación entre precisión y consecuencias.',
          o: ['Sí: se entendía igual y perdieron el tiempo.', 'No, cuando de esa marca depende quién es dueño de una casa.', 'Da igual: al final ganó el que tenía el original.'], c: 1 },
      ] },

    { id: 'LT7-02', titulo: 'El sonido del motor', genero: 'narrativo',
      texto: 'Don Álvaro repara motores desde hace cuarenta años y casi no usa aparatos de diagnóstico. Le pide al cliente que encienda y se queda oyendo con la cabeza ladeada, como si escuchara música. Un mecánico joven del taller de al lado le preguntó una vez cómo lo hacía. Él contestó: yo no sé más que vos de motores; lo que pasa es que yo he oído más. Después le explicó qué cambia según el ruido: un golpeteo parejo arriba es válvula; uno que sube con la aceleración, biela; un silbido, aire que entra por donde no debe. El muchacho empezó a grabar los motores con su teléfono y a compararlos. A los dos años ya diagnosticaba de oído casi tan rápido como él. Don Álvaro dice que aquello es lo que más le ha gustado de su oficio: que sí se puede enseñar.',
      porRegla: ['Álvaro', 'diagnóstico', 'música', 'mecánico', 'preguntó', 'hacía', 'contestó', 'oído', 'Después', 'explicó', 'según', 'válvula', 'aceleración', 'empezó', 'teléfono', 'rápido'],
      diacritica: ['cómo', 'Él', 'sé', 'más', 'qué', 'sí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hace don Álvaro para diagnosticar?', r: 'Pide que enciendan y se queda oyendo.',
          o: ['Conecta un aparato.', 'Pide que enciendan y se queda oyendo.', 'Desarma el motor.'], c: 1 },
        { tipo: 'literal', q: '¿Qué indica un silbido?', r: 'Aire que entra por donde no debe.',
          o: ['Una válvula floja.', 'Una biela.', 'Aire que entra por donde no debe.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiso decir con «yo he oído más»?', r: 'Que su ventaja no es saber más teoría, sino tener años de práctica escuchando.',
          o: ['Que tiene mejor oído de nacimiento.', 'Que el joven no estudió.', 'Que su ventaja es la práctica acumulada, no la teoría.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el muchacho grababa los motores?', r: 'Para poder comparar sonidos y acumular en dos años lo que el otro juntó en cuarenta.',
          o: ['Para publicarlos en internet.', 'Para comparar sonidos y acumular experiencia más rápido.', 'Para que don Álvaro se los explicara.'], c: 1 },
        { tipo: 'critica', q: '¿Se puede enseñar un saber que parece intuición? Argumenta.', r: 'Respuesta abierta: se valora que note que el saber se hizo enseñable al describirlo y compararlo.',
          o: ['Sí, cuando alguien lo pone en palabras y da con qué comparar.', 'No: eso se trae o no se trae.', 'Solo con muchos años.'], c: 0 },
      ] },

    { id: 'LT7-03', titulo: 'La biblioteca de la esquina', genero: 'narrativo',
      texto: 'Una señora abrió una biblioteca en el corredor de su casa con ciento veinte libros, casi todos regalados. No pide carné ni depósito. Anota en un cuaderno quién se llevó qué y confía. Le preguntaron cuántos libros ha perdido en cinco años y contestó, sin dudar, que once. Después aclaró algo que a mucha gente le extraña: no los cuenta como pérdida. Dijo que si un muchacho se quedó con un libro, en el peor de los casos ese libro está en una casa donde antes no había ninguno. Lo que sí la preocupa es otra cosa: que un niño no vuelva porque perdió uno y le da vergüenza. Por eso puso un letrero grande en la entrada que dice: si lo perdiste, vení igual. Desde que lo puso, tres devolvieron libros con años de atraso. Uno de ellos le dijo que no había vuelto por vergüenza. Ella le contestó que sí sabía, que por eso mismo puso el letrero, y que él no era el único.',
      porRegla: ['abrió', 'carné', 'depósito', 'llevó', 'confía', 'contestó', 'Después', 'aclaró', 'pérdida', 'quedó', 'está', 'había', 'perdió', 'vení', 'sabía', 'único'],
      diacritica: ['quién', 'qué', 'cuántos', 'sí', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos libros ha perdido en cinco años?', r: 'Once.',
          o: ['Once.', 'Ninguno.', 'Más de cincuenta.'], c: 0 },
        { tipo: 'literal', q: '¿Qué dice el letrero de la entrada?', r: '«Si lo perdiste, vení igual».',
          o: ['«Si lo perdiste, vení igual».', '«Prohibido no devolver».', '«Se requiere carné».'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué no cuenta los once como pérdida?', r: 'Porque ese libro terminó en una casa donde antes no había ninguno.',
          o: ['Porque ese libro terminó en una casa donde antes no había ninguno.', 'Porque eran libros viejos.', 'Porque se los regalaron.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué le preocupa más que un niño no vuelva?', r: 'Porque perder un lector es peor que perder un libro.',
          o: ['Porque baja el número de préstamos.', 'Porque perder un lector es peor que perder un libro.', 'Porque tendría que cerrar.'], c: 1 },
        { tipo: 'critica', q: '¿Funcionaría esa biblioteca con reglas más estrictas? Argumenta.', r: 'Respuesta abierta: se valora que note el efecto de la confianza sobre quién se atreve a entrar.',
          o: ['Sí: con carné se perdería menos.', 'Perdería menos libros y también a los lectores que más los necesitan.', 'Da igual, son pocos libros.'], c: 1 },
      ] },

    { id: 'LT7-04', titulo: 'El agua que sube sola', genero: 'expositivo',
      texto: 'En varias aldeas de montaña el agua llega sin bomba y sin energía, por un aparato que se llama ariete hidráulico. Funciona con un principio simple: el agua que baja con fuerza por un tubo se detiene de golpe al cerrarse una válvula, y ese golpe empuja una parte pequeña del caudal hacia arriba, mucho más alto de donde venía. No gasta combustible ni electricidad. Lo que sí exige es un desnivel: sin caída no hay golpe, y sin golpe no sube nada. Un técnico lo explica así a la gente: este aparato no crea fuerza, la aprovecha. De cada diez litros que entran, sube uno o dos; los demás se devuelven al río. Muchos preguntan si eso no es un desperdicio, y él siempre contesta lo mismo: el agua no se pierde, sigue su camino. La que sube es la que antes no llegaba.',
      porRegla: ['energía', 'hidráulico', 'válvula', 'venía', 'caída', 'técnico', 'así', 'demás', 'río'],
      diacritica: ['más', 'sí', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se llama el aparato?', r: 'Ariete hidráulico.',
          o: ['Bomba de mano.', 'Ariete hidráulico.', 'Molino de agua.'], c: 1 },
        { tipo: 'literal', q: '¿Cuánta agua sube de cada diez litros?', r: 'Uno o dos.',
          o: ['Uno o dos.', 'Los diez.', 'La mitad.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué es imprescindible el desnivel?', r: 'Porque sin caída no hay golpe, y el golpe es lo que empuja el agua hacia arriba.',
          o: ['Porque así el tubo no se tapa.', 'Porque sin caída no hay golpe, y el golpe es lo que empuja el agua.', 'Porque el agua debe estar limpia.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué dice que «no crea fuerza, la aprovecha»?', r: 'Porque toma la energía que el agua ya trae al bajar, sin añadir ninguna.',
          o: ['Porque toma la energía que el agua ya trae al bajar.', 'Porque es un aparato pequeño.', 'Porque no necesita mantenimiento.'], c: 0 },
        { tipo: 'critica', q: '¿Es un desperdicio que ocho litros se devuelvan al río? Argumenta.', r: 'Respuesta abierta: se valora que distinga entre consumir y usar de paso.',
          o: ['No: el agua sigue su curso y lo que sube antes no llegaba a nadie.', 'Sí: se pierden ocho de cada diez.', 'Depende de la época del año.'], c: 0 },
      ] },

    { id: 'LT7-05', titulo: 'El apodo que no se fue', genero: 'narrativo',
      texto: 'A un compañero de sexto le pusieron un apodo en tercer grado por algo que ya nadie recuerda. Él nunca dijo que le molestara. Se reía cuando lo llamaban así, incluso más fuerte que los demás, y eso todos lo tomamos como permiso. En noveno hubo un trabajo de Español donde cada quien escribía una carta a sí mismo del futuro. La profesora leyó algunas en voz alta, con permiso. En la de él había una línea sola sobre el apodo: ojalá para entonces ya nadie se acuerde de cómo me dicen. Nadie se rió. Después del recreo, sin ponernos de acuerdo, varios empezamos a llamarlo por su nombre. Él no dijo nada tampoco esa vez. Pero al día siguiente llegó distinto, y hasta hoy no sé cómo explicar en qué se le notaba. Él tampoco lo diría, creo. Hay cosas que solo se saben mirando a alguien, y esa fue una.',
      porRegla: ['reía', 'así', 'demás', 'escribía', 'leyó', 'había', 'línea', 'ojalá', 'rió', 'Después', 'día', 'llegó', 'diría'],
      diacritica: ['Él', 'más', 'sí', 'cómo', 'sé', 'qué'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuándo le pusieron el apodo?', r: 'En tercer grado.',
          o: ['En sexto.', 'En noveno.', 'En tercer grado.'], c: 2 },
        { tipo: 'literal', q: '¿Qué decía la línea de su carta?', r: 'Que ojalá para entonces ya nadie se acordara de cómo le dicen.',
          o: ['Que quería cambiarse de colegio.', 'Que le gustaba su apodo.', 'Que ojalá para entonces ya nadie se acordara de cómo le dicen.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué se reía más fuerte que los demás?', r: 'Para que no se notara que le dolía.',
          o: ['Para que no se notara que le dolía.', 'Porque le hacía gracia.', 'Porque quería caer bien.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el grupo cambió sin ponerse de acuerdo?', r: 'Porque todos entendieron a la vez lo que hasta entonces habían leído como permiso.',
          o: ['Porque la profesora se los ordenó.', 'Porque todos entendieron a la vez lo que habían leído como permiso.', 'Porque se cansaron del apodo.'], c: 1 },
        { tipo: 'critica', q: '¿Basta con que alguien se ría para pensar que no le molesta? Argumenta.', r: 'Respuesta abierta: se valora que reconozca la risa como defensa y la dificultad de decirlo.',
          o: ['Sí: si no dice nada, es que está bien.', 'Solo si se ríe mucho.', 'No: reírse suele ser la única salida que le queda al que no se anima a decirlo.'], c: 2 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LT8-01', titulo: 'El acta que nadie leyó', genero: 'narrativo',
      texto: 'En una asamblea de patronato se aprobó por unanimidad un proyecto de alcantarillado. El acta la redactó el secretario esa misma noche y la firmaron catorce personas sin leerla, porque ya era tarde. Tres meses después apareció el problema: el acta decía que la comunidad aportaría la mano de obra «y los materiales menores», y nadie recordaba haber aprobado eso último. El secretario juró que así se dijo. Otros juraron que no. No hubo mala fe de nadie, y aun así la comunidad terminó pagando cemento que no tenía previsto. Desde entonces cambiaron una sola cosa: el acta se lee en voz alta antes de firmar, aunque sea tarde y aunque todos quieran irse. Doña Mercedes, que propuso la medida, lo dijo con una frase que ahí repiten siempre: si te da pereza oírla, imagináte lo que da pagarla. Y agregó algo más que se les quedó: yo no sé leer rápido, pero sé que lo que no oí no lo aprobé. Él, el secretario, fue el primero en apoyarla.',
      porRegla: ['aprobó', 'redactó', 'después', 'apareció', 'decía', 'aportaría', 'último', 'juró', 'así', 'terminó', 'tenía', 'ahí', 'oírla', 'imagináte', 'agregó', 'quedó', 'rápido', 'oí', 'aprobé'],
      diacritica: ['más', 'sé', 'Él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas personas firmaron el acta?', r: 'Catorce.',
          o: ['Cuatro.', 'Cuarenta.', 'Catorce.'], c: 2 },
        { tipo: 'literal', q: '¿Qué cambiaron desde entonces?', r: 'El acta se lee en voz alta antes de firmar.',
          o: ['El acta se lee en voz alta antes de firmar.', 'Cambiaron de secretario.', 'Ya no hacen actas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el texto aclara que «no hubo mala fe de nadie»?', r: 'Para mostrar que el problema fue del procedimiento, no de las personas.',
          o: ['Para defender al secretario.', 'Para mostrar que el problema fue del procedimiento, no de las personas.', 'Porque nadie se enojó.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir la frase de doña Mercedes?', r: 'Que el rato que cuesta leerla es nada comparado con lo que cuesta un error.',
          o: ['Que hay que pagar rápido.', 'Que el rato que cuesta leerla es nada comparado con lo que cuesta un error.', 'Que las actas son aburridas.'], c: 1 },
        { tipo: 'critica', q: '¿Sirve leer en voz alta si igual nadie presta atención? Argumenta.', r: 'Respuesta abierta: se valora que discuta el valor del procedimiento y su límite real.',
          o: ['No: es puro trámite.', 'Sí, siempre y en todos los casos.', 'Sirve porque da la oportunidad de objetar, aunque no garantice que todos escuchen.'], c: 2 },
      ] },

    { id: 'LT8-02', titulo: 'La huella del maestro', genero: 'expositivo',
      texto: 'Un estudio siguió durante veinte años a alumnos de escuelas rurales para ver qué predecía mejor su continuidad en el sistema educativo. Esperaban que fuera el ingreso familiar, que pesa muchísimo. Pesó, sí, pero apareció algo más: haber tenido al menos un maestro que supiera su nombre completo y algo de su vida fuera del aula. No la nota, no el método: eso. Los que recordaban a alguien así tenían bastante más probabilidad de terminar noveno. Los investigadores fueron prudentes al explicarlo, porque una correlación no prueba una causa: quizá los maestros atentos coincidían con escuelas mejores. Aun así, la conclusión práctica les pareció clara. Y también incómoda: eso no se compra con presupuesto ni se ordena por circular. Depende de que un adulto, con cuarenta y tres alumnos y poco tiempo, decida acordarse de quién es cada uno. Cuando a uno de los investigadores le preguntaron si él recordaba a alguien así, contestó que sí, y dio el nombre completo sin pensarlo. Después se quedó callado un rato.',
      porRegla: ['siguió', 'predecía', 'muchísimo', 'Pesó', 'apareció', 'método', 'así', 'tenían', 'correlación', 'quizá', 'coincidían', 'conclusión', 'práctica', 'pareció', 'también', 'incómoda', 'contestó', 'Después', 'quedó'],
      diacritica: ['qué', 'sí', 'más', 'quién', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué esperaban los investigadores que predijera la continuidad?', r: 'El ingreso familiar.',
          o: ['El método de enseñanza.', 'El ingreso familiar.', 'Las notas.'], c: 1 },
        { tipo: 'literal', q: '¿Qué apareció además?', r: 'Haber tenido un maestro que supiera su nombre completo y algo de su vida.',
          o: ['La distancia a la escuela.', 'Haber tenido un maestro que supiera su nombre y algo de su vida.', 'El número de libros en casa.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué los investigadores fueron prudentes?', r: 'Porque una correlación no prueba una causa: podía haber otra explicación.',
          o: ['Porque la muestra era pequeña.', 'Porque una correlación no prueba una causa.', 'Porque no confiaban en los maestros.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la conclusión les pareció incómoda?', r: 'Porque eso no se consigue con presupuesto ni con una orden.',
          o: ['Porque eso no se consigue con presupuesto ni con una orden.', 'Porque culpaba a las familias.', 'Porque contradecía estudios previos.'], c: 0 },
        { tipo: 'critica', q: '¿Se le puede pedir eso a un maestro con cuarenta y tres alumnos? Argumenta.', r: 'Respuesta abierta: se valora que reconozca el valor del gesto y la carga real que implica.',
          o: ['Es valioso, y pedirlo sin darle condiciones lo vuelve otra carga más.', 'Sí: es su trabajo y punto.', 'No: con tantos alumnos es imposible.'], c: 0 },
      ] },

    { id: 'LT8-03', titulo: 'El préstamo del celular', genero: 'narrativo',
      texto: 'A una señora del mercado le ofrecieron un celular en cuotas y firmó sin leer el contrato, porque la letra era chiquísima y el vendedor tenía prisa. El aparato costaba cuatro mil lempiras; ella terminó pagando casi nueve mil. Cuando reclamó, le enseñaron el papel: ahí estaba todo, en su lugar, con los intereses escritos. Nadie la engañó en el sentido de mentirle. Su hija llevó el contrato a una organización de consumidores y ahí le explicaron dos cosas. La primera, que el interés era legal aunque fuera altísimo. La segunda, y esa sí le sirvió: que la ley obliga a informar el costo total antes de firmar, no solo la cuota mensual. Con eso reclamó y le devolvieron una parte. Hoy ella les pregunta a las compañeras del mercado una sola cosa antes de que firmen: ¿cuánto vas a pagar en total? Y si el vendedor no lo dice claro, que no firmen. Ella lo repite así: no preguntés cuánto es la cuota; preguntá cuánto vas a pagar en total, y que te lo escriba él.',
      porRegla: ['firmó', 'chiquísima', 'tenía', 'terminó', 'reclamó', 'ahí', 'engañó', 'llevó', 'organización', 'interés', 'altísimo', 'sirvió', 'así', 'preguntés', 'preguntá'],
      diacritica: ['sí', 'cuánto', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto costaba el aparato y cuánto pagó?', r: 'Costaba cuatro mil y pagó casi nueve mil.',
          o: ['Costaba nueve mil y pagó cuatro mil.', 'Costaba cuatro mil y pagó casi nueve mil.', 'Costaba mil y pagó dos mil.'], c: 1 },
        { tipo: 'literal', q: '¿Qué obliga la ley antes de firmar?', r: 'Informar el costo total, no solo la cuota mensual.',
          o: ['Informar el costo total, no solo la cuota mensual.', 'Dar tres días para arrepentirse.', 'Leer el contrato en voz alta.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que nadie la engañó?', r: 'Porque todo estaba escrito en el contrato; el problema fue que no se lo informaron claro.',
          o: ['Porque ella aceptó voluntariamente.', 'Porque el vendedor era honrado.', 'Porque todo estaba escrito; el problema fue que no se lo informaron claro.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la pregunta del costo total es la más útil?', r: 'Porque una cuota baja puede esconder un precio final altísimo.',
          o: ['Porque asusta al vendedor.', 'Porque una cuota baja puede esconder un precio final altísimo.', 'Porque la ley lo exige.'], c: 1 },
        { tipo: 'critica', q: '¿Basta con que la información esté escrita? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre estar disponible y ser comprensible.',
          o: ['Sí: quien firma debe leer.', 'Depende del monto.', 'No: en letra chiquísima y con prisa, informar y esconder se parecen mucho.'], c: 2 },
      ] },

    { id: 'LT8-04', titulo: 'El río que cambió de nombre', genero: 'expositivo',
      texto: 'Un río del oriente aparece en los mapas oficiales con un nombre y la gente de la zona lo llama de otro. No es un error de imprenta: son dos capas de historia. El nombre del mapa lo puso una comisión en el siglo pasado, tomándolo de una hacienda; el que usa la gente es más antiguo y viene de la lengua que se hablaba ahí antes. Cuando llegó un proyecto de agua, el conflicto se volvió práctico. Los documentos hablaban de un río que, según los vecinos, no existía; y los vecinos hablaban de otro que no salía en ningún papel. Tardaron meses en darse cuenta de que era el mismo. El técnico que lo resolvió no hizo nada complicado: llevó el mapa a la comunidad y pidió que le señalaran con el dedo dónde estaba cada cosa. Ahora el mapa lleva los dos nombres, uno debajo del otro. Un ingeniero preguntó cuál era el correcto y el técnico le contestó: ¿correcto para quién? Él usa el del papel; ellos usan el suyo, y los dos llegan al mismo río.',
      porRegla: ['río', 'comisión', 'tomándolo', 'ahí', 'llegó', 'volvió', 'práctico', 'según', 'existía', 'salía', 'ningún', 'técnico', 'resolvió', 'llevó', 'pidió', 'preguntó', 'contestó'],
      diacritica: ['más', 'dónde', 'cuál', 'quién', 'Él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿De dónde salió el nombre del mapa?', r: 'De una hacienda, puesto por una comisión el siglo pasado.',
          o: ['De una hacienda, puesto por una comisión el siglo pasado.', 'De la lengua antigua de la zona.', 'De un explorador extranjero.'], c: 0 },
        { tipo: 'literal', q: '¿Cómo lo resolvió el técnico?', r: 'Llevó el mapa a la comunidad y pidió que le señalaran cada cosa.',
          o: ['Consultó el archivo nacional.', 'Cambió el nombre oficial.', 'Llevó el mapa a la comunidad y pidió que le señalaran cada cosa.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el conflicto se volvió práctico?', r: 'Porque los documentos y la gente hablaban de ríos que parecían distintos siendo el mismo.',
          o: ['Porque los documentos y la gente hablaban de ríos que parecían distintos.', 'Porque nadie sabía leer mapas.', 'Porque el río se secó.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el mapa lleva ahora los dos nombres?', r: 'Porque cada uno es cierto para quien lo usa, y así ninguno se pierde.',
          o: ['Porque cada uno es cierto para quien lo usa, y así ninguno se pierde.', 'Porque lo exige la ley.', 'Porque no lograron decidir cuál era el bueno.'], c: 0 },
        { tipo: 'critica', q: '¿Cuál nombre debería considerarse el verdadero? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta qué da legitimidad a un nombre: el uso o el registro.',
          o: ['Los dos: uno tiene el registro y el otro el uso, y ambos sirven.', 'El del mapa: es el oficial.', 'El de la gente: es el más antiguo.'], c: 0 },
      ] },

    { id: 'LT8-05', titulo: 'La deuda de la pulpería', genero: 'narrativo',
      texto: 'Don Jesús llevaba treinta años fiando en su pulpería y anotando en un cuaderno de espiral. Cuando murió, sus hijos encontraron catorce cuadernos y una deuda pendiente de más de sesenta mil lempiras repartida entre medio barrio. El hijo mayor quiso cobrar; el menor decía que no, que su papá jamás había cobrado a nadie. Discutieron dos semanas. Al final hicieron algo que no se le ocurrió a ninguno de los dos: le preguntaron a la gente. Pusieron un aviso diciendo que cada quien pasara a ver su cuenta y decidiera. En un mes pagaron cuarenta y dos personas; otras nueve pidieron plazo; tres dijeron que no podían y nadie les insistió. Se recuperó más de la mitad. El hijo menor dice que lo que más le sorprendió no fue el dinero: fue que casi todos ya sabían de memoria cuánto debían, aunque nadie se los hubiera cobrado nunca. Una señora le dijo: yo sé lo que le debo a él desde hace años; solo estaba esperando que alguien me dijera dónde pagar. Y sí pagó, hasta el último centavo.',
      porRegla: ['Jesús', 'pulpería', 'murió', 'decía', 'papá', 'jamás', 'había', 'ocurrió', 'podían', 'insistió', 'recuperó', 'sorprendió', 'sabían', 'debían', 'pagó', 'último'],
      diacritica: ['más', 'cuánto', 'sé', 'él', 'dónde', 'sí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos cuadernos encontraron?', r: 'Catorce.',
          o: ['Uno solo.', 'Treinta.', 'Catorce.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hicieron al final los hermanos?', r: 'Pusieron un aviso para que cada quien pasara a ver su cuenta y decidiera.',
          o: ['Pusieron un aviso para que cada quien viera su cuenta y decidiera.', 'Cobraron casa por casa.', 'Perdonaron todas las deudas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué no insistieron a los que dijeron que no podían?', r: 'Porque mantuvieron el criterio con el que su papá había fiado siempre.',
          o: ['Porque eran pocos.', 'Porque no tenían pruebas.', 'Porque mantuvieron el criterio con el que su papá había fiado siempre.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué revela que casi todos supieran de memoria cuánto debían?', r: 'Que el fiado sostenía un compromiso real, aunque nadie lo exigiera.',
          o: ['Que llevaban sus propias cuentas por desconfianza.', 'Que el fiado sostenía un compromiso real aunque nadie lo exigiera.', 'Que las deudas eran muy pequeñas.'], c: 1 },
        { tipo: 'critica', q: '¿Tenía razón el hijo mayor o el menor? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca lo legítimo de ambas posiciones y el mérito de la salida que hallaron.',
          o: ['El mayor: era dinero de la familia.', 'El menor: no había que cobrar nada.', 'Los dos en parte, y la salida que encontraron respetó ambas cosas.'], c: 2 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LT9-01', titulo: 'Por qué la tilde no es un adorno', genero: 'expositivo',
      texto: 'Mucha gente cree que la tilde es una formalidad de la escuela y que si el mensaje se entiende, da igual. En la mayoría de los casos es cierto: nadie confunde «cancion» con otra palabra. El problema es que el sistema no puede tener excepciones caso por caso, porque entonces habría que decidir cada vez si esta tilde sí importa y aquella no, y esa decisión la tomaría quien escribe, no quien lee. Y hay un puñado donde sí cambia todo: «él» y «el», «más» y «mas», «sí» y «si», «sé» y «se», «qué» y «que». Ahí la tilde no adorna: distingue. Además, la regla general no se inventó por capricho. Marca dónde cae la fuerza cuando el patrón habitual no basta, y por eso solo se escribe donde hace falta: en español, la mayoría de las palabras no lleva tilde justamente porque siguen la regla. Escribirla bien no es obedecer: es dejar el texto listo para que otro lo lea sin tener que adivinar. Y ahí está lo que más cuesta aceptar: el que hace el esfuerzo no es el que se beneficia. Uno tilda para que a otro le salga fácil.',
      porRegla: ['mayoría', 'habría', 'decisión', 'tomaría', 'Ahí', 'Además', 'inventó', 'patrón', 'está', 'fácil'],
      diacritica: ['sí', 'él', 'más', 'sé', 'qué', 'dónde'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué la mayoría de las palabras no lleva tilde?', r: 'Porque siguen la regla general, y solo se escribe donde hace falta.',
          o: ['Porque siguen la regla general, y solo se escribe donde hace falta.', 'Porque son cortas.', 'Porque la tilde ya no se usa.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cuál es el problema de decidir caso por caso?', r: 'Que la decisión la tomaría quien escribe, y quien lee tendría que adivinar.',
          o: ['Que la decisión la tomaría quien escribe, y quien lee tendría que adivinar.', 'Que sería muy lento.', 'Que los maestros se enojarían.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué hace la tilde en «más» frente a «mas»?', r: 'Distingue dos palabras distintas; no adorna ninguna.',
          o: ['Distingue dos palabras distintas; no adorna ninguna.', 'Marca que es más larga.', 'Indica que es una pregunta.'], c: 0 },
        { tipo: 'critica', q: '¿Da igual la tilde si el mensaje se entiende? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre los casos donde no cambia nada y los que sí, sin caer en ninguno de los dos extremos.',
          o: ['Da igual siempre: lo importante es comunicarse.', 'Casi siempre se entiende, y por eso mismo conviene la regla: para el puñado donde no.', 'Nunca da igual: cada tilde es indispensable.'], c: 1 },
        { tipo: 'critica', q: '¿A quién le sirve más la ortografía, a quien escribe o a quien lee? Argumenta.', r: 'Respuesta abierta: se valora que note que el esfuerzo lo hace uno y el beneficio lo recibe el otro.',
          o: ['A quien escribe: queda mejor.', 'A ninguno: es puro trámite.', 'A quien lee: el que escribe hace el esfuerzo para ahorrárselo al otro.'], c: 2 },
      ] },

    { id: 'LT9-02', titulo: 'El corrector automático', genero: 'expositivo',
      texto: 'El corrector del teléfono acierta casi siempre y por eso cuesta desconfiar de él. Funciona con probabilidades: propone la palabra que más veces aparece en contextos parecidos. Eso lo vuelve muy bueno con lo frecuente y sorprendentemente malo con lo raro, que es justo donde uno necesitaría ayuda. Un apellido poco común, un topónimo, un término técnico: ahí es donde más se equivoca, y como el cambio se hace solo, uno lo firma sin darse cuenta. En un juzgado hubo un caso donde el corrector cambió «Ocotepeque» por otra palabra y el documento salió así. Nadie lo leyó. Hay algo más incómodo todavía: cuanto mejor funciona, menos revisamos. La herramienta que reduce los errores también reduce la atención, y esa segunda parte no aparece en ninguna publicidad. Lo razonable no es apagarlo, que sería tonto, sino saber dónde falla: en lo propio, en lo local y en lo que uno mismo escribió mal a propósito. Un editor lo resumió mejor que nadie: él corrige lo que ya sé; yo tengo que corregir lo que él no puede saber. Y eso no se lo puedo delegar.',
      porRegla: ['teléfono', 'necesitaría', 'común', 'topónimo', 'término', 'técnico', 'ahí', 'cambió', 'salió', 'así', 'leyó', 'incómodo', 'todavía', 'también', 'atención', 'sería', 'escribió', 'propósito', 'resumió'],
      diacritica: ['él', 'más', 'dónde', 'sé'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo elige el corrector la palabra que propone?', r: 'Por probabilidad: la que más aparece en contextos parecidos.',
          o: ['Por probabilidad: la que más aparece en contextos parecidos.', 'Consultando un diccionario oficial.', 'Preguntándole al usuario.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué falla más con lo raro?', r: 'Porque lo poco frecuente aparece pocas veces, y él se guía por la frecuencia.',
          o: ['Porque no tiene esas palabras guardadas.', 'Porque no entiende el español.', 'Porque lo poco frecuente aparece pocas veces y él se guía por la frecuencia.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa que «cuanto mejor funciona, menos revisamos»?', r: 'Que al confiar más, bajamos la atención justo donde podría fallar.',
          o: ['Que al confiar más, bajamos la atención justo donde podría fallar.', 'Que la herramienta se vuelve más lenta.', 'Que hay que actualizarla seguido.'], c: 0 },
        { tipo: 'critica', q: '¿Convendría apagarlo? Defiende tu postura.', r: 'Respuesta abierta: se valora que evite los extremos y proponga un criterio de uso.',
          o: ['No, pero conviene revisar a mano lo propio, lo local y los nombres.', 'Sí: así uno aprende de verdad.', 'No: hay que confiar en la tecnología.'], c: 0 },
        { tipo: 'critica', q: '¿Qué otras herramientas te ahorran esfuerzo y también atención? Da un ejemplo.', r: 'Respuesta abierta: se valora que traslade la idea a otro caso —el mapa, la calculadora— con un ejemplo propio.',
          o: ['El mapa del teléfono: uno llega, pero después no sabría volver solo.', 'Ninguna: las herramientas solo ayudan.', 'La televisión.'], c: 0 },
      ] },

    { id: 'LT9-03', titulo: 'La entrevista de trabajo', genero: 'narrativo',
      texto: 'A un muchacho de la aldea lo llamaron a una entrevista en la ciudad. Llevaba su certificado de noveno, planchado, dentro de una bolsa plástica. Le preguntaron por qué debían contratarlo a él y no a otro. Contestó lo que le habían enseñado en el colegio: que era responsable, puntual y trabajador. Como todos. No quedó. Volvió a los seis meses a otra entrevista y esa vez respondió distinto: dijo que él caminaba dos horas para llegar al colegio y que no faltó ni un día en tres años, y que si le daban el trabajo iban a tener que echarlo, porque solo no se iba a ir. Lo contrataron. Después el jefe le contó por qué: las tres palabras del principio las dice cualquiera y no se pueden comprobar; lo de las dos horas caminando sí, y además ya estaba hecho. No prometió nada. Contó algo que había pasado, y eso pesó más que cualquier promesa. Él lo dice ahora así, cuando le preguntan: yo no sabía qué responder, solo dije lo único que sí sabía de mí. Lleva cuatro años en ese trabajo.',
      porRegla: ['plástica', 'debían', 'Contestó', 'habían', 'quedó', 'Volvió', 'respondió', 'faltó', 'día', 'Después', 'contó', 'además', 'prometió', 'había', 'pesó', 'así', 'sabía', 'único'],
      diacritica: ['qué', 'él', 'sí', 'más', 'mí'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué contestó la primera vez?', r: 'Que era responsable, puntual y trabajador.',
          o: ['Que necesitaba el trabajo.', 'Que era responsable, puntual y trabajador.', 'Que tenía experiencia.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la segunda respuesta funcionó mejor?', r: 'Porque contaba un hecho comprobable en vez de prometer cualidades.',
          o: ['Porque fue más larga.', 'Porque contaba un hecho comprobable en vez de prometer cualidades.', 'Porque el jefe era de la misma aldea.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «ya estaba hecho»?', r: 'Que no era una intención a futuro, sino algo que él ya había sostenido durante años.',
          o: ['Que el certificado ya estaba firmado.', 'Que no era una intención a futuro, sino algo que ya había sostenido años.', 'Que ya tenía el trabajo asegurado.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué el colegio le enseñó a responder de la primera manera? Argumenta.', r: 'Respuesta abierta: se valora que note la diferencia entre enseñar una fórmula y enseñar a mostrar lo propio.',
          o: ['Porque los maestros no saben de trabajo.', 'Porque es más fácil enseñar una fórmula que ayudar a cada quien a mirar su historia.', 'Porque esa respuesta es la correcta.'], c: 1 },
        { tipo: 'critica', q: '¿Qué contarías vos de tu propia vida en una entrevista? Explica por qué.', r: 'Respuesta abierta: se valora que identifique un hecho concreto y comprobable de su experiencia, no una cualidad general.',
          o: ['Que soy responsable y puntual.', 'Que necesito mucho el trabajo.', 'Un hecho concreto que ya hice y que se puede comprobar.'], c: 2 },
      ] },

    { id: 'LT9-04', titulo: 'Los apellidos del cementerio', genero: 'narrativo',
      texto: 'Un profesor de Sociales mandó a sus alumnos de noveno a copiar los apellidos del cementerio del pueblo. Parecía un trabajo raro y resultó ser el mejor del año. Encontraron que once apellidos concentraban más de la mitad de las tumbas, y que casi todos aparecían también en la lista de la escuela. Encontraron algo más: entre mil novecientos treinta y mil novecientos sesenta hay muchísimas tumbas de niños menores de cinco años, y después de esa fecha casi ninguna. Un alumno preguntó por qué, y ahí el profesor no contestó: los mandó a preguntar en sus casas. Volvieron con la respuesta que él quería que trajeran de ahí y no de un libro: la campaña de vacunación y el agua entubada. Al final del trabajo, una alumna escribió una frase que el profesor todavía guarda: nunca había pensado que una vacuna se pudiera ver desde afuera, contando piedras. El profesor cuenta que aquel año no cambió el programa ni pidió más recursos: solamente sacó a treinta muchachos del aula una mañana. Y todavía se pregunta por qué no lo había hecho antes, si estaba ahí, a cuatro cuadras.',
      porRegla: ['mandó', 'Parecía', 'resultó', 'aparecían', 'también', 'muchísimas', 'después', 'preguntó', 'ahí', 'contestó', 'quería', 'vacunación', 'escribió', 'todavía', 'había', 'cambió', 'pidió', 'sacó'],
      diacritica: ['más', 'qué', 'él'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Qué encontraron sobre los apellidos?', r: 'Que once concentraban más de la mitad de las tumbas.',
          o: ['Que casi todos eran distintos.', 'Que once concentraban más de la mitad de las tumbas.', 'Que ninguno coincidía con la escuela.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el profesor no contestó la pregunta?', r: 'Porque quería que la respuesta viniera de sus familias y no de un libro.',
          o: ['Porque no la sabía.', 'Porque no había tiempo.', 'Porque quería que la respuesta viniera de sus familias y no de un libro.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué explica la caída de tumbas de niños después de 1960?', r: 'La campaña de vacunación y el agua entubada.',
          o: ['Que la gente se fue del pueblo.', 'Que dejaron de enterrar ahí.', 'La campaña de vacunación y el agua entubada.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué la frase de la alumna impresionó al profesor? Argumenta.', r: 'Respuesta abierta: se valora que note el descubrimiento de que un dato abstracto tiene huellas materiales.',
          o: ['Porque descubrió sola que una política de salud deja huellas que se pueden contar.', 'Porque estaba bien escrita.', 'Porque nombró al profesor.'], c: 0 },
        { tipo: 'critica', q: '¿Qué otra cosa del pueblo podría estudiarse así? Propón una y di qué mostraría.', r: 'Respuesta abierta: se valora que proponga una fuente concreta del entorno y qué pregunta respondería.',
          o: ['Nada: para eso están los libros.', 'La televisión local.', 'Los libros de la iglesia o los recibos del agua: muestran cómo cambió la vida diaria.'], c: 2 },
      ] },

    { id: 'LT9-05', titulo: 'El que corregía los carteles', genero: 'narrativo',
      texto: 'En una ciudad hubo un señor que durante años anduvo corrigiendo con marcador las tildes de los rótulos de los negocios. Lo hacía de noche y nadie sabía quién era. A unos les pareció gracioso y a otros, una falta de respeto: eran rótulos ajenos y algunos habían costado dinero. Cuando por fin lo identificaron, resultó ser un maestro jubilado. No se defendió mucho. Dijo solamente que le dolía que un muchacho aprendiera a escribir mal mirando la calle todos los días, porque uno aprende más de lo que ve repetido que de lo que le explican una vez. El argumento tenía su parte razonable y su parte insostenible: nadie lo autorizó a rayar propiedad de otro. La ciudad terminó haciendo algo mejor que multarlo o aplaudirlo. Le pidieron una lista de los rótulos con error y ofrecieron corregirlos gratis a quien quisiera. Aceptaron cuarenta de setenta y tres. Él nunca volvió a salir de noche, y cuando le preguntaron si estaba conforme contestó que sí, aunque él habría preferido las setenta y tres. Un periodista quiso saber cuál había sido el error más común y él lo dijo de memoria: la tilde de «más».',
      porRegla: ['rótulos', 'hacía', 'sabía', 'pareció', 'habían', 'resultó', 'defendió', 'dolía', 'días', 'tenía', 'autorizó', 'terminó', 'volvió', 'contestó', 'habría', 'había', 'común'],
      diacritica: ['quién', 'más', 'Él', 'sí', 'cuál'],
      neutros: [],
      preguntas: [
        { tipo: 'literal', q: '¿Quién resultó ser el que corregía?', r: 'Un maestro jubilado.',
          o: ['Un estudiante.', 'Un maestro jubilado.', 'Un empleado de la alcaldía.'], c: 1 },
        { tipo: 'inferencial', q: '¿Cuál era su argumento?', r: 'Que uno aprende más de lo que ve repetido que de lo que le explican una vez.',
          o: ['Que los rótulos eran feos.', 'Que uno aprende más de lo que ve repetido que de lo que le explican una vez.', 'Que la ley obliga a escribir bien.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que su argumento tenía una parte insostenible?', r: 'Porque tener razón no lo autorizaba a rayar propiedad ajena.',
          o: ['Porque los datos que daba eran falsos.', 'Porque tener razón no lo autorizaba a rayar propiedad ajena.', 'Porque corregía mal las tildes.'], c: 1 },
        { tipo: 'critica', q: '¿Fue mejor la salida de la ciudad que multarlo o aplaudirlo? Argumenta.', r: 'Respuesta abierta: se valora que note que la solución atendió el problema sin premiar el método.',
          o: ['No: debieron multarlo y ya.', 'Debieron darle un premio.', 'Sí: resolvió lo que él señalaba sin darle la razón en cómo lo hizo.'], c: 2 },
        { tipo: 'critica', q: '¿Tener razón autoriza a actuar por cuenta propia? Defiende tu postura.', r: 'Respuesta abierta: se valora que separe la validez del reclamo de la legitimidad del método.',
          o: ['Sí, si el motivo es bueno.', 'Solo si nadie se entera.', 'No: el reclamo puede ser válido y el método no, y son dos cosas distintas.'], c: 2 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN

   1. las cinco preguntas;
   2. cazar las palabras con tilde sobre el texto;
   3. clasificarlas: ¿la manda la regla o es diacrítica?;
   4. volver de memoria a buscar la palabra exacta.

   ── Lo que hace distinta a esta cacería ──
   Aquí el FALLO enseña. Cuando el alumno toca una palabra sin tilde, la
   pantalla no le dice «no»: le dice por qué esa palabra no la lleva —«es
   llana terminada en vocal»—, calculado en el momento por
   js/data/lectura-acentos.js. Equivocarse aquí enseña la regla completa,
   que es justo lo que se está estudiando.
══════════════════════════════════════════════════════════════ */
const LECTURA_ACENTUACION_TALLER = [

  { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

  { id: 'caza', icono: '🎯', titulo: 'Caza de tildes', forma: 'cazar', meta: 10,
    instruccion: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' palabras con tilde</strong>. Encuentra ' +
        '<strong>al menos ' + info.meta + '</strong> y tócalas. Si tocás una que no lleva tilde, ' +
        'te digo por qué no la lleva: también se aprende así.';
    },
    enPapel: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' palabras con tilde</strong>. ' +
        '<strong>Subraya al menos ' + info.meta + '</strong> en el texto de arriba.';
    },
    objetivos: function (t, u) {
      var reg = {}, dia = {};
      (t.porRegla || []).forEach(function (p) { reg[u.clave(p)] = 1; });
      (t.diacritica || []).forEach(function (p) { dia[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (reg[k]) out.push({ ini: i, fin: i, clase: 'a' });
        else if (dia[k]) out.push({ ini: i, fin: i, clase: 'b' });
      });
      return out;
    },
    neutros: function () { return []; },
    /* El único fallo del proyecto que enseña la regla entera: en vez de
       decir «no es», dice POR QUÉ esa palabra no lleva tilde. */
    fallo: function (palabra, u) {
      if (typeof LECTURA_ACENTOS === 'undefined') {
        return '❌ «' + u.esc(palabra) + '» no lleva tilde.';
      }
      var c = LECTURA_ACENTOS.clasificar(palabra);
      if (!c) return '❌ «' + u.esc(palabra) + '» no lleva tilde.';
      return '❌ «' + u.esc(palabra) + '» no lleva tilde. Se separa <strong>' + c.silabas.join('-') +
        '</strong> y ' + c.regla.charAt(0).toLowerCase() + c.regla.slice(1);
    } },

  { id: 'clasifica', icono: '🗂️', titulo: '¿Por la regla o diacrítica?', forma: 'dosGrupos',
    pista: 'Mirala en su oración antes de decidir',
    grupos: [
      { clave: 'a', titulo: '📐 Por la regla', pista: 'aguda, llana o esdrújula', nombre: 'tildada por la regla' },
      { clave: 'b', titulo: '🆚 Diacrítica', pista: 'distingue dos palabras iguales', nombre: 'tilde diacrítica' }
    ],
    items: function (t, u) {
      var reg = u.baraja(t.porRegla || []), dia = u.baraja(t.diacritica || []);
      var nDia = Math.min(3, dia.length), nReg = Math.min(6 - nDia, reg.length);
      var lista = reg.slice(0, nReg).map(function (p) { return { palabra: p, grupo: 'a' }; })
        .concat(dia.slice(0, nDia).map(function (p) { return { palabra: p, grupo: 'b' }; }));
      return u.baraja(lista).map(function (it) {
        it.contexto = u.contextoDe(it.palabra);
        /* La explicación no se escribe: la calcula el lector de acentos,
           con las sílabas a la vista. Así el alumno ve la regla aplicada
           a SU palabra, no una regla en abstracto. */
        var c = (typeof LECTURA_ACENTOS !== 'undefined') ? LECTURA_ACENTOS.clasificar(it.palabra) : null;
        it.explica = c
          ? '<strong>' + u.esc(c.silabas.join('-')) + '</strong> — ' + c.regla
          : '«' + u.esc(it.palabra) + '» lleva tilde.';
        return it;
      });
    } },

  { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?', forma: 'tresOpciones',
    pista: 'Las tres palabras salen de esta misma lectura',
    items: function (t, u) {
      var todas = (t.porRegla || []).concat(t.diacritica || []);
      var con = {};
      todas.forEach(function (p) { con[u.clave(p)] = 1; });
      var candidatos = [];
      u.oraciones().forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (con[u.clave(u.ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
        }
      });
      return u.baraja(candidatos).slice(0, 4).map(function (c) {
        var correcta = u.ps[c.pos].replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        var otros = u.baraja(todas.filter(function (p) { return u.clave(p) !== u.clave(correcta); })).slice(0, 2);
        var ops = u.baraja([correcta].concat(otros));
        var frase = [];
        for (var i = c.ini; i <= c.fin; i++) {
          frase.push(i === c.pos ? u.HUECO + u.esc(u.ps[i].replace(/^[^.,;:!?»]*/, '')) : u.esc(u.ps[i]));
        }
        return {
          frase: frase.join(' '), ops: ops, c: ops.map(u.clave).indexOf(u.clave(correcta)),
          bien: 'Fíjate en dónde cae la fuerza al leer la oración completa.',
          mal: 'La lectura decía <strong>«' + u.esc(correcta) + '»</strong>. Las otras dos también salen de este texto.'
        };
      });
    } },
];

const LECTURA_ACENTUACION_RESUMEN = {
  titulo: '🔤 Todas las tildes de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'canción', dice: 'por la regla' },
    { clase: 'b', txt: 'él', dice: 'diacrítica' }
  ],
  intro: function (t, u, cuenta) {
    return 'En un solo texto había <strong>' + cuenta.a + ' palabras tildadas por la regla</strong> y <strong>' +
      cuenta.b + ' con tilde diacrítica</strong>. Las primeras siguen la regla de agudas, llanas y esdrújulas; ' +
      'las segundas llevan tilde para distinguirse de otra palabra que se escribe igual.';
  },
  marcar: function (t, u) {
    var reg = {}, dia = {};
    (t.porRegla || []).forEach(function (p) { reg[u.clave(p)] = 1; });
    (t.diacritica || []).forEach(function (p) { dia[u.clave(p)] = 1; });
    var out = [];
    u.ps.forEach(function (p, i) {
      var k = u.clave(p);
      if (reg[k]) out.push({ ini: i, fin: i, clase: 'a' });
      else if (dia[k]) out.push({ ini: i, fin: i, clase: 'b' });
    });
    return out;
  }
};
