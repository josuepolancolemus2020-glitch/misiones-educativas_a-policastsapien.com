/* ══════════════════════════════════════════════════════════════
   📖 CORPUS DE LECTURA — MISIÓN DE LOS VERBOS

   Cinco lecturas por grado, de 4º a 9º, para el Control de lectura que
   vive dentro de la misión (js/tools/lectura-mision.js). El motor no
   sabe de verbos: aquí van el corpus y el taller.

   ── Por qué estos textos y no otros ──
   Son de Honduras y en el español que se habla aquí. Y son textos donde
   PASAN COSAS —se arma un barrilete, se ordeña una vaca, se apaga la
   luz, se rescata a alguien de una quebrada—, porque un verbo se
   reconoce mejor donde hay acción que en una descripción quieta. Un
   texto de puros adjetivos no sirve para cazar verbos.

   ── Las dos clases que se clasifican ──
   La misión enseña el verbo «según su forma y función», así que la
   segunda actividad separa lo que de verdad se confunde en 4º:

     verbos  → CONJUGADO: dice quién y cuándo (llega, salieron, tapa)
     noPers  → FORMA NO PERSONAL: no dice ni quién ni cuándo
               (infinitivo: cortar · gerundio: cortando · participio:
               cortado, cuando acompaña a haber o a ser)

   ── verbos y noPers son el INVENTARIO COMPLETO ──
   No una muestra. Con ellas el alumno caza verbos tocándolos sobre el
   texto, así que un verbo que falte es la pantalla diciéndole que se
   equivocó CUANDO ACERTÓ. Tienen que aparecer TAL CUAL en el texto: se
   compara palabra contra palabra, no con indexOf.

   `neutros` es la zona gris de ESE texto, y en los verbos es ancha:
   el participio que ahí hace de adjetivo («el zacate cortado», «la
   puerta abierta»), el infinitivo que ahí es sustantivo («el deber»,
   «el amanecer»). Tocarlas no suma ni resta y la pantalla lo explica.
   Esa decisión NO se puede automatizar: «cortado» es verbo en «ha
   cortado» y adjetivo en «el zacate recién cortado», y eso lo dice la
   oración, no una lista.

   Antes de publicar un cambio:
     node _dev/valida-lectura-mision.js
     node _dev/verifica-nombres-propios.js
     node _dev/verifica-impresion-lectura.js
══════════════════════════════════════════════════════════════ */

const LECTURA_VERBOS = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LV4-01', titulo: 'Cómo se hace un barrilete', genero: 'instructivo',
      texto: 'Primero busca dos varillas de caña brava y ráspalas hasta dejarlas parejas. Después amárralas en cruz con hilo de cáñamo y estira un hilo por todo el borde, porque ese hilo sostiene la forma. Recorta el papel de china dos dedos más grande que el marco y pégalo doblando las orillas. La cola se arma con tiras de trapo: si el barrilete cabecea, alárgala; si no sube, córtala. Amarra el hilo principal en el cruce y prueba en un potrero abierto. Cuando sientas que jala, suelta despacio. Nunca corras mirando hacia arriba, porque ahí es donde la gente tropieza.',
      verbos: ['busca', 'ráspalas', 'amárralas', 'estira', 'sostiene', 'Recorta', 'pégalo', 'arma', 'cabecea', 'alárgala', 'sube', 'córtala', 'Amarra', 'prueba', 'sientas', 'jala', 'suelta', 'corras', 'es', 'tropieza'],
      noPers: ['dejarlas', 'doblando', 'mirando', 'abierto'],
      neutros: ['parejas', 'brava'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se amarran las varillas en cruz?', r: 'Con hilo de cáñamo.',
          o: ['Con tiras de trapo.', 'Con hilo de cáñamo.', 'Con papel de china.'], c: 1 },
        { tipo: 'literal', q: '¿Qué se hace si el barrilete cabecea?', r: 'Se alarga la cola.',
          o: ['Se alarga la cola.', 'Se corta la cola.', 'Se cambia el papel.'], c: 0 },
        { tipo: 'literal', q: '¿Dónde se amarra el hilo principal?', r: 'En el cruce de las varillas.',
          o: ['En el cruce de las varillas.', 'En la cola.', 'En la punta de arriba.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el hilo del borde es importante?', r: 'Porque sostiene la forma del barrilete.',
          o: ['Porque lo hace más liviano.', 'Porque sirve para amarrar la cola.', 'Porque sostiene la forma del barrilete.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué el texto advierte que no se corra mirando hacia arriba?', r: 'Respuesta abierta: se valora que relacione la advertencia con un peligro real y conocido.',
          o: ['Porque el barrilete se puede romper.', 'Porque así el barrilete no sube.', 'Porque quien no mira el suelo tropieza y se lastima.'], c: 2 },
      ] },

    { id: 'LV4-02', titulo: 'La noche que se fue la luz', genero: 'narrativo',
      texto: 'A las siete se apagó todo el barrio. Mi mamá encendió una candela y la puso sobre un plato. Mi hermano buscó la linterna y no la halló. Afuera los vecinos salieron a la acera y empezaron a conversar, porque adentro hacía calor. Doña Fina sacó una radio de pilas y nos quedamos escuchando las noticias juntos. Mi abuelo contó que antes, cuando él era niño, en la aldea no había luz ninguna noche. Nadie se quejaba. A las diez volvió la corriente y la gente aplaudió. Después cada quien entró a su casa y el barrio quedó callado otra vez.',
      verbos: ['apagó', 'encendió', 'puso', 'buscó', 'halló', 'salieron', 'empezaron', 'hacía', 'sacó', 'quedamos', 'contó', 'era', 'había', 'quejaba', 'volvió', 'aplaudió', 'entró', 'quedó'],
      noPers: ['conversar', 'escuchando', 'callado'],
      neutros: ['juntos'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué encendió la mamá?', r: 'Una candela, y la puso sobre un plato.',
          o: ['Una linterna.', 'Una candela, y la puso sobre un plato.', 'Una radio de pilas.'], c: 1 },
        { tipo: 'literal', q: '¿Por qué los vecinos salieron a la acera?', r: 'Porque adentro hacía calor.',
          o: ['Porque adentro hacía calor.', 'Porque tenían miedo.', 'Porque esperaban al de la luz.'], c: 0 },
        { tipo: 'literal', q: '¿Qué contó el abuelo?', r: 'Que cuando él era niño, en la aldea no había luz ninguna noche.',
          o: ['Que cuando él era niño no había luz ninguna noche.', 'Que la luz se iba todos los días.', 'Que él arreglaba la luz.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el abuelo dice que nadie se quejaba?', r: 'Porque nunca habían tenido luz y no echaban de menos lo que no conocían.',
          o: ['Porque nunca habían tenido luz y no echaban de menos lo que no conocían.', 'Porque la gente era más callada.', 'Porque tenían miedo de reclamar.'], c: 0 },
        { tipo: 'critica', q: '¿Puede un apagón tener algo bueno? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que note lo que ocurrió —la gente se juntó a conversar— sin negar la molestia.',
          o: ['Algo bueno tuvo: sacó a los vecinos a conversar.', 'No, un apagón solo trae problemas.', 'Sí, porque así se ahorra dinero.'], c: 0 },
      ] },

    { id: 'LV4-03', titulo: 'La carrera de cintas', genero: 'narrativo',
      texto: 'En la feria de la aldea corren la carrera de cintas. Los jinetes pasan al galope bajo un lazo del que cuelgan argollas pequeñas, y tienen que ensartar una con un clavo que llevan en la mano. Suena fácil y no lo es: el caballo no se detiene y la argolla se mueve con el viento. Rigoberto ganó tres años seguidos. Este año falló las dos primeras vueltas y la gente empezó a gritarle. En la tercera acertó, levantó el brazo y la plaza entera se puso de pie, aplaudiendo. Después dijo que la mano tiembla más cuando uno ya ganó antes.',
      verbos: ['corren', 'pasan', 'cuelgan', 'tienen', 'llevan', 'Suena', 'es', 'detiene', 'mueve', 'ganó', 'falló', 'empezó', 'acertó', 'levantó', 'puso', 'dijo', 'tiembla'],
      noPers: ['ensartar', 'gritarle', 'aplaudiendo'],
      neutros: ['seguidos', 'pie'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué tienen que ensartar los jinetes?', r: 'Una argolla, con un clavo que llevan en la mano.',
          o: ['Una cinta de colores.', 'Un lazo colgado.', 'Una argolla, con un clavo que llevan en la mano.'], c: 2 },
        { tipo: 'literal', q: '¿Cuántos años seguidos había ganado Rigoberto?', r: 'Tres.',
          o: ['Tres.', 'Dos.', 'Cinco.'], c: 0 },
        { tipo: 'literal', q: '¿Qué pasó en la tercera vuelta?', r: 'Acertó y la plaza entera se puso de pie.',
          o: ['Se cayó del caballo.', 'Volvió a fallar.', 'Acertó y la plaza entera se puso de pie.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la prueba es más difícil de lo que parece?', r: 'Porque el caballo no se detiene y la argolla se mueve con el viento.',
          o: ['Porque el clavo pesa mucho.', 'Porque el caballo no se detiene y la argolla se mueve con el viento.', 'Porque la gente grita.'], c: 1 },
        { tipo: 'critica', q: '¿Qué quiso decir Rigoberto con que «la mano tiembla más cuando uno ya ganó antes»?', r: 'Respuesta abierta: se valora que hable del peso de la expectativa o del miedo a perder lo ganado.',
          o: ['Que pesa más el miedo a perder lo que ya se ganó.', 'Que se estaba poniendo viejo.', 'Que el clavo estaba flojo.'], c: 0 },
      ] },

    { id: 'LV4-04', titulo: 'Ordeñar antes del amanecer', genero: 'expositivo',
      texto: 'Don Chico se levanta a las cuatro y camina hasta el corral. Primero amarra el ternero cerca de la madre, porque la vaca no baja la leche si no ve a su cría. Después lava la ubre con agua limpia y se sienta en un banco de madera. Aprieta con las dos manos, sin jalar, y la leche cae en el balde con un ruido parejo. Una vaca mansa se ordeña en diez minutos. Si el ordeñador se apura o le pega, la vaca patea y se pierde el balde entero. Por eso don Chico repite siempre lo mismo: aquí gana el que tiene paciencia.',
      verbos: ['levanta', 'camina', 'amarra', 'baja', 've', 'lava', 'sienta', 'Aprieta', 'cae', 'ordeña', 'apura', 'pega', 'patea', 'pierde', 'repite', 'gana', 'tiene'],
      noPers: ['jalar', 'limpia', 'mansa'],
      neutros: ['parejo', 'entero'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué se amarra el ternero cerca de la madre?', r: 'Porque la vaca no baja la leche si no ve a su cría.',
          o: ['Para que tome primero.', 'Para que no se escape.', 'Porque la vaca no baja la leche si no ve a su cría.'], c: 2 },
        { tipo: 'literal', q: '¿En cuánto tiempo se ordeña una vaca mansa?', r: 'En diez minutos.',
          o: ['En una hora.', 'En diez minutos.', 'En media mañana.'], c: 1 },
        { tipo: 'literal', q: '¿Qué pasa si el ordeñador se apura o le pega?', r: 'La vaca patea y se pierde el balde entero.',
          o: ['La vaca da menos leche.', 'La vaca patea y se pierde el balde entero.', 'El ternero se suelta.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se aprieta la ubre sin jalar?', r: 'Porque jalar lastima a la vaca y ella reacciona.',
          o: ['Porque así sale más rápido.', 'Porque jalar lastima a la vaca y ella reacciona.', 'Porque el balde se voltea.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué don Chico dice que «aquí gana el que tiene paciencia»?', r: 'Respuesta abierta: se valora que relacione la calma con el resultado del trabajo.',
          o: ['Porque el trabajo es aburrido.', 'Porque las vacas son lentas.', 'Porque apurarse arruina el trabajo de toda la mañana.'], c: 2 },
      ] },

    { id: 'LV4-05', titulo: 'El perro que aprendió a esperar', genero: 'narrativo',
      texto: 'Canelo llegó a la casa flaco y asustado. Al principio robaba comida de la mesa y salía corriendo. Mi papá no le pegó ninguna vez. Le servía en un traste aparte y esperaba a que se acercara. Pasaron dos semanas. Un día Canelo se sentó frente al traste y no comió hasta que mi papá le dijo que ya. Desde entonces no ha vuelto a robar. Mi hermana dice que el perro entendió una regla. Mi papá dice otra cosa: que el perro dejó de tener hambre de urgencia, y que un animal tranquilo aprende cualquier cosa.',
      verbos: ['llegó', 'robaba', 'salía', 'pegó', 'servía', 'esperaba', 'acercara', 'Pasaron', 'sentó', 'comió', 'dijo', 'ha', 'dice', 'entendió', 'dejó', 'aprende'],
      noPers: ['corriendo', 'vuelto', 'robar', 'tener'],
      neutros: ['flaco', 'asustado', 'aparte', 'tranquilo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hacía Canelo al principio?', r: 'Robaba comida de la mesa y salía corriendo.',
          o: ['Se escondía todo el día.', 'Robaba comida de la mesa y salía corriendo.', 'No comía nada.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hizo el papá cuando el perro robaba?', r: 'No le pegó: le servía aparte y esperaba.',
          o: ['No le pegó: le servía aparte y esperaba.', 'Lo amarró en el patio.', 'Lo sacó de la casa.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto tiempo pasó antes del cambio?', r: 'Dos semanas.',
          o: ['Un mes.', 'Dos semanas.', 'Dos días.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir el papá con «hambre de urgencia»?', r: 'Que el perro robaba por miedo a no volver a comer, no por maldad.',
          o: ['Que comía muy rápido.', 'Que tenía una enfermedad.', 'Que robaba por miedo a no volver a comer, no por maldad.'], c: 2 },
        { tipo: 'critica', q: '¿Quién explica mejor lo que pasó, la hermana o el papá? Defiende tu postura.', r: 'Respuesta abierta: se valora que compare las dos explicaciones y sostenga una con razones.',
          o: ['La hermana: el perro solo aprendió una regla.', 'Ninguno: fue casualidad.', 'El papá: el perro cambió porque dejó de sentirse en peligro.'], c: 2 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LV5-01', titulo: 'El simulacro de la escuela', genero: 'narrativo',
      texto: 'A las nueve sonó la campana tres veces seguidas y todos supimos que empezaba el simulacro. La maestra Reina levantó la mano y nadie habló. Salimos en fila, sin correr, pegados a la pared del corredor. En el patio nos formamos por grados y el maestro de guardia contó a cada grupo. Faltaban dos de sexto: se habían quedado guardando unos cuadernos. Cuando aparecieron, el director no los regañó delante de todos, pero explicó algo que nadie olvidó: en un terremoto de verdad, esos treinta segundos que uno gasta salvando una cosa son los que le faltan a otro para salir. Repetimos el simulacro tres días después. Esa vez salieron todos completos en un minuto y veinte segundos.',
      verbos: ['sonó', 'supimos', 'empezaba', 'levantó', 'habló', 'Salimos', 'formamos', 'contó', 'Faltaban', 'habían', 'aparecieron', 'regañó', 'explicó', 'olvidó', 'gasta', 'son', 'faltan', 'Repetimos', 'salieron'],
      noPers: ['correr', 'guardando', 'quedado', 'salvando', 'salir'],
      neutros: ['seguidas', 'pegados', 'completos'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo salieron los alumnos del aula?', r: 'En fila, sin correr, pegados a la pared del corredor.',
          o: ['Cada quien por su lado.', 'Corriendo hacia el patio.', 'En fila, sin correr, pegados a la pared del corredor.'], c: 2 },
        { tipo: 'literal', q: '¿Por qué faltaban dos alumnos de sexto?', r: 'Se habían quedado guardando unos cuadernos.',
          o: ['Se habían quedado guardando unos cuadernos.', 'Estaban enfermos ese día.', 'Salieron por otra puerta.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el director no los regañó delante de todos?', r: 'Porque prefirió explicar la razón en vez de avergonzarlos.',
          o: ['Porque no le importaba el simulacro.', 'Porque no sabía quiénes eran.', 'Porque prefirió explicar la razón en vez de avergonzarlos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué demuestra que la segunda vez salieran en un minuto y veinte?', r: 'Que la explicación sirvió y el grupo mejoró de verdad.',
          o: ['Que la explicación sirvió y el grupo mejoró.', 'Que había menos alumnos ese día.', 'Que la campana sonó más fuerte.'], c: 0 },
        { tipo: 'critica', q: '¿Sirven de algo los simulacros si nunca tiembla? Argumenta.', r: 'Respuesta abierta: se valora que hable de la preparación y de lo que cuesta improvisar en una emergencia.',
          o: ['No: es tiempo de clase perdido.', 'Sí: en una emergencia nadie improvisa bien, se hace lo que se practicó.', 'Solo si tiembla ese mismo año.'], c: 1 },
      ] },

    { id: 'LV5-02', titulo: 'Cómo se arma un nacatamal', genero: 'instructivo',
      texto: 'La víspera se remoja el maíz con cal y al otro día se muele para sacar la masa. La masa se bate con manteca hasta que flote una bolita en un vaso de agua: esa prueba avisa que ya está en su punto. Aparte se cocina la carne con achiote, ajo y culantro. Las hojas de plátano se pasan por el fuego para que se ablanden y no se rajen al doblarlas. Sobre la hoja se extiende la masa, se acomoda la carne, una rodaja de papa, una aceituna y unas pasas. Después se envuelve apretando bien las esquinas y se amarra con cibaque. Los nacatamales se cuecen tres horas, parados y con poca agua, para que no se deshagan.',
      verbos: ['remoja', 'muele', 'bate', 'flote', 'avisa', 'está', 'cocina', 'pasan', 'ablanden', 'rajen', 'extiende', 'acomoda', 'envuelve', 'amarra', 'cuecen', 'deshagan'],
      noPers: ['sacar', 'doblarlas', 'apretando', 'parados'],
      neutros: ['punto', 'Aparte'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se sabe que la masa está en su punto?', r: 'Cuando una bolita flota en un vaso de agua.',
          o: ['Cuando se despega de las manos.', 'Cuando cambia de color.', 'Cuando una bolita flota en un vaso de agua.'], c: 2 },
        { tipo: 'literal', q: '¿Cuánto tiempo se cuecen los nacatamales?', r: 'Tres horas.',
          o: ['Una hora.', 'Toda la noche.', 'Tres horas.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué las hojas se pasan por el fuego?', r: 'Para que se ablanden y no se rajen al doblarlas.',
          o: ['Para que se ablanden y no se rajen al doblarlas.', 'Para matarles los bichos.', 'Para que agarren sabor.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se cuecen parados y con poca agua?', r: 'Para que no se deshagan dentro de la olla.',
          o: ['Para que no se deshagan dentro de la olla.', 'Para que se cuezan más rápido.', 'Para que quepan más en la olla.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué crees que una comida así se hace para las fiestas y no cualquier día?', r: 'Respuesta abierta: se valora que relacione el trabajo y el tiempo que exige con el sentido de la ocasión.',
          o: ['Porque los ingredientes están prohibidos.', 'Porque solo se consiguen en diciembre.', 'Porque lleva dos días de trabajo y muchas manos.'], c: 2 },
      ] },

    { id: 'LV5-03', titulo: 'La tormenta llegó de noche', genero: 'narrativo',
      texto: 'Empezó a llover a las once y no paró. Mi tío salió con una lámpara a ver la quebrada y volvió corriendo: el agua ya lamía el palo del tendedero. Levantamos los colchones sobre las mesas y subimos los sacos de maíz al tapesco. Mi mamá metió los papeles importantes en una bolsa plástica y se la amarró a la cintura. A la una tocamos la puerta de los vecinos de la parte alta y nos recibieron sin preguntar nada. Desde ahí vimos cómo el agua entraba despacio a la casa, sin ruido, como si tuviera todo el tiempo del mundo. Al amanecer bajó. Perdimos dos gallinas y el piso, pero no perdimos los papeles.',
      verbos: ['Empezó', 'paró', 'salió', 'volvió', 'lamía', 'Levantamos', 'subimos', 'metió', 'amarró', 'tocamos', 'recibieron', 'vimos', 'entraba', 'tuviera', 'bajó', 'Perdimos'],
      noPers: ['llover', 'ver', 'corriendo', 'preguntar'],
      neutros: ['importantes', 'alta', 'amanecer'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo la mamá con los papeles importantes?', r: 'Los metió en una bolsa plástica y se la amarró a la cintura.',
          o: ['Los guardó en el tapesco.', 'Los dejó sobre la mesa.', 'Los metió en una bolsa plástica y se la amarró a la cintura.'], c: 2 },
        { tipo: 'literal', q: '¿Qué vio el tío cuando salió con la lámpara?', r: 'Que el agua ya lamía el palo del tendedero.',
          o: ['Que la quebrada estaba seca.', 'Que el agua ya lamía el palo del tendedero.', 'Que el puente se había caído.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que el agua entraba «como si tuviera todo el tiempo del mundo»?', r: 'Para mostrar que subía despacio y sin ruido, y aun así no había cómo pararla.',
          o: ['Porque el agua estaba tibia.', 'Para mostrar que subía despacio y sin ruido, y aun así no había cómo pararla.', 'Porque la tormenta ya había pasado.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la última frase menciona los papeles y no las gallinas?', r: 'Porque los papeles no se pueden reponer y las gallinas sí.',
          o: ['Porque las gallinas no valían nada.', 'Porque los papeles no se pueden reponer y las gallinas sí.', 'Porque la mamá quería presumir.'], c: 1 },
        { tipo: 'critica', q: '¿Qué debería tener lista una familia que vive cerca de una quebrada? Propón algo.', r: 'Respuesta abierta: se valora que proponga medidas concretas —documentos aparte, un lugar alto, un aviso— y no solo el susto.',
          o: ['Los papeles aparte, un lugar alto acordado y con quién avisarse.', 'Nada: si el agua sube, no hay nada que hacer.', 'Una lámpara más grande.'], c: 0 },
      ] },

    { id: 'LV5-04', titulo: 'Aprender a tejer una hamaca', genero: 'expositivo',
      texto: 'En Yoro varias familias tejen hamacas de hilo de manila. El bastidor son dos horcones parados y un travesaño; ahí se tienden los hilos de la urdimbre, uno junto al otro, sin dejar que se crucen. Después se pasa la trama con una aguja de madera, jalando parejo, porque un hilo flojo se ve al colgarla. La orilla se remata con una trenza gruesa que aguanta el peso. Una hamaca de matrimonio lleva más de mil metros de hilo y dos semanas de trabajo. Quien aprende empieza tejiendo bolsas pequeñas, y solo después de fallar varias veces entiende que la mano tiene que ir siempre al mismo ritmo. El error no se nota tejiendo: se nota cuando alguien se acuesta.',
      verbos: ['tejen', 'son', 'tienden', 'crucen', 'pasa', 've', 'remata', 'aguanta', 'lleva', 'aprende', 'empieza', 'entiende', 'tiene', 'nota', 'acuesta'],
      noPers: ['parados', 'jalando', 'colgarla', 'tejiendo', 'fallar', 'ir'],
      neutros: ['flojo', 'gruesa', 'parejo'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se pasa la trama?', r: 'Con una aguja de madera.',
          o: ['Con los dedos.', 'Con una aguja de madera.', 'Con un gancho de metal.'], c: 1 },
        { tipo: 'literal', q: '¿Cuánto hilo lleva una hamaca de matrimonio?', r: 'Más de mil metros.',
          o: ['Cien metros.', 'Más de mil metros.', 'Diez metros.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué hay que jalar parejo la trama?', r: 'Porque un hilo flojo se nota al colgar la hamaca.',
          o: ['Porque si no se rompe la aguja.', 'Porque así se termina más rápido.', 'Porque un hilo flojo se nota al colgar la hamaca.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa que «el error no se nota tejiendo: se nota cuando alguien se acuesta»?', r: 'Que el defecto aparece con el peso, cuando ya no se puede corregir.',
          o: ['Que el defecto aparece con el peso, cuando ya no se puede corregir.', 'Que el tejedor no revisa su trabajo.', 'Que hay que tejer acostado.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué quien aprende empieza por bolsas pequeñas y no por una hamaca? Argumenta.', r: 'Respuesta abierta: se valora que hable de practicar el gesto antes de arriesgar dos semanas de material.',
          o: ['Porque las bolsas se venden mejor.', 'Porque conviene practicar el gesto antes de arriesgar semanas de trabajo.', 'Porque las hamacas están prohibidas para principiantes.'], c: 1 },
      ] },

    { id: 'LV5-05', titulo: 'El primer día en la escuela nueva', genero: 'narrativo',
      texto: 'Nos mudamos en enero y entré a mitad de curso. Esa mañana caminé despacio, buscando alguna cara conocida, y no encontré ninguna. La maestra me presentó y treinta pares de ojos se voltearon a verme. Me senté en el último pupitre y no hablé en todo el día. Al recreo salí solo y me quedé mirando un partido desde la orilla. Entonces un muchacho pateó la pelota hacia mí y me gritó: «¡Devolvéla, pues!». Se la devolví. Después me hizo un gesto para que entrara al equipo. No me preguntó cómo me llamaba ni de dónde venía. Ese día aprendí que a veces uno no necesita que lo presenten: necesita que lo inviten a jugar.',
      verbos: ['mudamos', 'entré', 'caminé', 'encontré', 'presentó', 'voltearon', 'senté', 'hablé', 'salí', 'quedé', 'pateó', 'gritó', 'Devolvéla', 'devolví', 'hizo', 'entrara', 'preguntó', 'llamaba', 'venía', 'aprendí', 'necesita', 'presenten', 'inviten'],
      noPers: ['buscando', 'verme', 'mirando', 'jugar', 'conocida'],
      neutros: ['solo', 'último'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo el narrador durante el recreo?', r: 'Se quedó mirando un partido desde la orilla.',
          o: ['Se quedó en el aula.', 'Se puso a jugar de inmediato.', 'Se quedó mirando un partido desde la orilla.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le gritó el muchacho?', r: '«¡Devolvéla, pues!».',
          o: ['«¿Cómo te llamás?».', '«¡Devolvéla, pues!».', '«¿De dónde venís?».'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué importa que el muchacho no le preguntara su nombre?', r: 'Porque lo incluyó sin exigirle explicaciones, y eso fue lo que lo hizo sentirse parte.',
          o: ['Porque lo incluyó sin exigirle explicaciones.', 'Porque ya lo conocía de antes.', 'Porque no le interesaba saberlo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué diferencia hay entre «presentar» e «invitar a jugar», según el texto?', r: 'Presentar es un trámite; invitar a jugar es lo que de verdad integra a alguien.',
          o: ['Que presentar es un trámite e invitar a jugar es lo que integra.', 'Que ninguna de las dos sirve.', 'Que presentar lo hace la maestra.'], c: 0 },
        { tipo: 'critica', q: '¿Qué podría hacer un grupo para recibir a un compañero nuevo? Propón algo concreto.', r: 'Respuesta abierta: se valora que proponga una acción concreta y no solo buenas intenciones.',
          o: ['Invitarlo a algo el primer día, sin interrogarlo.', 'Nada: que él se acomode solo.', 'Hacerle muchas preguntas para conocerlo.'], c: 0 },
      ] },
  ],

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LV6-01', titulo: 'El rescate en la quebrada', genero: 'narrativo',
      texto: 'El muchacho se resbaló en la piedra y cayó al pozo cuando la quebrada venía crecida. Sus compañeros gritaron desde la orilla, pero ninguno se tiró: los tres sabían nadar en el mar, pero ninguno de ellos conocía la fuerza de esa corriente. Uno corrió hasta la casa más cercana y volvió con una cuerda de amarrar ganado. Amarraron un extremo a un guayabo y lanzaron el otro tres veces antes de que él lo agarrara. No lo jalaron de frente: caminaron por la orilla hacia abajo, dejando que el agua misma lo arrimara. Cuando salió, temblaba y no podía hablar. El bombero que llegó después les dijo algo que no esperaban oír: lo que le salvó la vida fue que ninguno de ustedes se tiró a buscarlo.',
      verbos: ['resbaló', 'cayó', 'venía', 'gritaron', 'tiró', 'sabían', 'conocía', 'corrió', 'volvió', 'Amarraron', 'lanzaron', 'agarrara', 'jalaron', 'caminaron', 'arrimara', 'salió', 'temblaba', 'podía', 'llegó', 'dijo', 'esperaban', 'salvó', 'fue'],
      noPers: ['nadar', 'amarrar', 'dejando', 'hablar', 'oír', 'buscarlo'],
      neutros: ['crecida', 'cercana'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué lo sacaron del pozo?', r: 'Con una cuerda de amarrar ganado.',
          o: ['Con una rama larga.', 'Con una cuerda de amarrar ganado.', 'Nadando hasta él.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hicieron en vez de jalarlo de frente?', r: 'Caminaron por la orilla hacia abajo y dejaron que el agua lo arrimara.',
          o: ['Caminaron por la orilla hacia abajo y dejaron que el agua lo arrimara.', 'Lo jalaron entre los tres.', 'Esperaron a que bajara la creciente.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué ninguno se tiró al agua aunque sabían nadar?', r: 'Porque saber nadar en el mar no sirve contra una corriente que no se conoce.',
          o: ['Porque tenían miedo del muchacho.', 'Porque saber nadar en el mar no sirve contra una corriente desconocida.', 'Porque la cuerda ya venía en camino.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el bombero les dijo que lo que lo salvó fue que nadie se tiró?', r: 'Porque en esas corrientes el que se tira suele convertirse en una segunda víctima.',
          o: ['Porque el agua estaba muy fría.', 'Porque así llegaron más rápido.', 'Porque el que se tira suele convertirse en una segunda víctima.'], c: 2 },
        { tipo: 'critica', q: '¿Es cobardía no tirarse al agua a salvar a alguien? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre valentía y decisión informada, con una razón.',
          o: ['Sí: un amigo se tira sin pensarlo.', 'No: ayudar bien exige pensar, y un rescatador ahogado no salva a nadie.', 'Depende de si sabe nadar o no.'], c: 1 },
      ] },

    { id: 'LV6-02', titulo: 'Aprender a soldar', genero: 'expositivo',
      texto: 'En el taller de don Marcial se aprende soldando, no oyendo. El primer día el aprendiz solo limpia el metal con cepillo de alambre, porque la soldadura no pega sobre óxido ni sobre grasa. Después practica el arco: acerca el electrodo, lo pega, lo despega y vuelve a acercarlo hasta que aprende a sostener la distancia. Si lo pega mucho, el electrodo se queda pegado; si lo aleja, el arco se corta. Todo se decide en unos milímetros que la mano tiene que aprender sola. Don Marcial revisa el cordón por debajo, no por arriba, porque arriba cualquier cosa se ve bonita. Dice que él no enseña a soldar: enseña a mirar el charco de metal mientras se enfría, que es donde se ve si el trabajo va a aguantar.',
      verbos: ['aprende', 'limpia', 'pega', 'practica', 'acerca', 'despega', 'vuelve', 'queda', 'aleja', 'corta', 'decide', 'tiene', 'revisa', 've', 'Dice', 'enseña', 'enfría', 'es', 'va', 'aguantar'],
      noPers: ['soldando', 'oyendo', 'sostener', 'acercarlo', 'pegado', 'soldar', 'mirar'],
      neutros: ['bonita', 'sola'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hace el aprendiz el primer día?', r: 'Limpia el metal con cepillo de alambre.',
          o: ['Suelda una pieza pequeña.', 'Solo mira trabajar a don Marcial.', 'Limpia el metal con cepillo de alambre.'], c: 2 },
        { tipo: 'literal', q: '¿Por dónde revisa don Marcial el cordón?', r: 'Por debajo.',
          o: ['Por debajo.', 'Por arriba.', 'Por los dos lados.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué hay que limpiar el metal antes de soldar?', r: 'Porque la soldadura no pega sobre óxido ni sobre grasa.',
          o: ['Porque así se ve más ordenado.', 'Porque el cepillo calienta el metal.', 'Porque la soldadura no pega sobre óxido ni sobre grasa.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «arriba cualquier cosa se ve bonita»?', r: 'Que el aspecto de la superficie engaña y el defecto se esconde debajo.',
          o: ['Que el aspecto de la superficie engaña y el defecto se esconde debajo.', 'Que hay que trabajar con buena luz.', 'Que don Marcial pinta las piezas.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué dice que enseña «a mirar» y no «a soldar»? Argumenta.', r: 'Respuesta abierta: se valora que reconozca que el criterio para juzgar el propio trabajo es lo que hace autónomo a alguien.',
          o: ['Porque no sabe explicar bien.', 'Porque quien aprende a juzgar su propio trabajo ya no necesita maestro.', 'Porque soldar es muy fácil.'], c: 1 },
      ] },

    { id: 'LV6-03', titulo: 'El torneo de ajedrez', genero: 'narrativo',
      texto: 'La escuela inscribió por primera vez un equipo en el torneo departamental. Nadie tenía reloj, así que entrenaron contando en voz alta. Marielos, que había aprendido mirando jugar a su abuelo, ganó las tres primeras partidas sin levantar la vista del tablero. En la cuarta se enfrentó a un muchacho de un colegio grande que movía rapidísimo para apurarla. Ella no se apuró. Pensó cada jugada igual que antes, perdió por tiempo en el reloj y salió llorando. El profesor no le habló de la derrota. Le preguntó qué había visto en la jugada quince, y estuvieron media hora repasando esa posición. Al año siguiente Marielos volvió con reloj propio y ganó el torneo. Todavía dice que aprendió más de esa partida perdida que de las tres ganadas.',
      verbos: ['inscribió', 'tenía', 'entrenaron', 'había', 'ganó', 'enfrentó', 'movía', 'apuró', 'Pensó', 'perdió', 'salió', 'habló', 'preguntó', 'estuvieron', 'volvió', 'dice', 'aprendió'],
      noPers: ['contando', 'aprendido', 'mirando', 'jugar', 'levantar', 'apurarla', 'llorando', 'visto', 'repasando', 'perdida', 'ganadas'],
      neutros: ['propio', 'siguiente'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo entrenaron sin reloj?', r: 'Contando en voz alta.',
          o: ['Sin controlar el tiempo.', 'Con el reloj del profesor.', 'Contando en voz alta.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le preguntó el profesor después de la derrota?', r: 'Qué había visto en la jugada quince.',
          o: ['Qué había visto en la jugada quince.', 'Por qué se había apurado tan poco.', 'Si quería seguir jugando.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el rival movía rapidísimo?', r: 'Para apurarla y hacerla fallar por tiempo.',
          o: ['Para apurarla y hacerla fallar por tiempo.', 'Porque tenía prisa por irse.', 'Porque ya sabía todas las jugadas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el profesor no le habló de la derrota?', r: 'Porque le interesaba lo que ella había pensado, no el resultado.',
          o: ['Porque le interesaba lo que ella había pensado, no el resultado.', 'Porque estaba enojado con ella.', 'Porque no le importaba el torneo.'], c: 0 },
        { tipo: 'critica', q: '¿Se aprende más ganando o perdiendo? Defiende tu postura con una razón.', r: 'Respuesta abierta: se valora que sostenga su postura sin repetir el lugar común, apoyándose en el texto o en su experiencia.',
          o: ['Ganando: perder solo desanima.', 'Da igual: se aprende con la práctica y ya.', 'Perdiendo, si alguien ayuda a mirar qué pasó; si no, solo duele.'], c: 2 },
      ] },

    { id: 'LV6-04', titulo: 'Cómo se levanta una champa', genero: 'instructivo',
      texto: 'Escoge un terreno que no se empoce y márcalo con estacas antes de cavar. Los horcones se entierran a media vara y se aploman con una plomada de hilo, porque una champa torcida se descuadra sola con el primer viento. Amarra las soleras encima y clava las tijeras del techo, dejando la caída suficiente para que corra el agua. La palma se coloca de abajo hacia arriba, traslapando cada hilera sobre la anterior como escamas: así el agua resbala y no se mete. Nunca amarres la palma con alambre; usa bejuco o mecate, que ceden cuando el viento empuja. Al terminar, párate lejos y míralo desde tres lados distintos. Si algo se ve torcido desde uno solo de esos tres lados, está torcido de verdad y conviene desarmarlo ahora.',
      verbos: ['Escoge', 'empoce', 'márcalo', 'entierran', 'aploman', 'descuadra', 'Amarra', 'clava', 'corra', 'coloca', 'resbala', 'mete', 'amarres', 'usa', 'ceden', 'empuja', 'párate', 'míralo', 've', 'está', 'conviene'],
      noPers: ['cavar', 'dejando', 'traslapando', 'terminar', 'desarmarlo'],
      neutros: ['torcida', 'suficiente', 'anterior', 'torcido', 'distintos'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se coloca la palma del techo?', r: 'De abajo hacia arriba, traslapando cada hilera sobre la anterior.',
          o: ['De abajo hacia arriba, traslapando cada hilera sobre la anterior.', 'De arriba hacia abajo, sin traslapar.', 'En cuatro capas parejas.'], c: 0 },
        { tipo: 'literal', q: '¿Con qué NO se debe amarrar la palma?', r: 'Con alambre.',
          o: ['Con bejuco.', 'Con mecate.', 'Con alambre.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué se prefiere bejuco o mecate al alambre?', r: 'Porque ceden cuando el viento empuja, en vez de cortar o romperse.',
          o: ['Porque son más baratos.', 'Porque duran más años.', 'Porque ceden cuando el viento empuja.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué hay que mirar la champa desde tres lados?', r: 'Porque desde un solo lado una torcedura puede pasar desapercibida.',
          o: ['Porque desde un solo lado una torcedura puede pasar desapercibida.', 'Para ver si cabe la mesa.', 'Para calcular cuánta palma falta.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué el texto insiste tanto en aplomar antes de seguir? Argumenta.', r: 'Respuesta abierta: se valora que note que un error en la base se arrastra a todo lo demás.',
          o: ['Porque así queda más bonita.', 'Porque un error en la base se arrastra a todo lo que se construya encima.', 'Porque la plomada es barata.'], c: 1 },
      ] },

    { id: 'LV6-05', titulo: 'La huelga de los cortadores', genero: 'expositivo',
      texto: 'En 1954 los trabajadores de las bananeras de la costa norte pararon el trabajo y no volvieron a los campos durante sesenta y nueve días. No pedían un imposible: reclamaban jornada de ocho horas, pago en dinero y no en vales, y atención médica. Hasta entonces se les pagaba con fichas que solo servían en la tienda de la compañía, de manera que el salario regresaba completo a quien lo había entregado. La huelga se extendió a otras empresas y paralizó buena parte del norte del país. Terminó con un acuerdo que no dio todo lo que se pedía, pero cambió el país: de ahí salieron el Código del Trabajo y el derecho a organizarse en sindicato. Los que empezaron aquello no leyeron ninguna ley: sabían que estaban trabajando de más.',
      verbos: ['pararon', 'volvieron', 'pedían', 'reclamaban', 'pagaba', 'servían', 'regresaba', 'había', 'extendió', 'paralizó', 'Terminó', 'dio', 'pedía', 'cambió', 'salieron', 'empezaron', 'leyeron', 'sabían', 'estaban'],
      noPers: ['entregado', 'organizarse', 'trabajando'],
      neutros: ['completo', 'médica', 'buena'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto duró la huelga?', r: 'Sesenta y nueve días.',
          o: ['Un mes.', 'Todo un año.', 'Sesenta y nueve días.'], c: 2 },
        { tipo: 'literal', q: '¿Qué reclamaban los trabajadores?', r: 'Jornada de ocho horas, pago en dinero y atención médica.',
          o: ['Jornada de ocho horas, pago en dinero y atención médica.', 'Tierras propias para sembrar.', 'La salida de la compañía del país.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué pagar con fichas favorecía a la compañía?', r: 'Porque el salario solo servía en su tienda y regresaba completo a sus manos.',
          o: ['Porque las fichas eran más fáciles de contar.', 'Porque el salario solo servía en su tienda y regresaba a sus manos.', 'Porque las fichas valían más que el dinero.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué significa que «no leyeron ninguna ley: sabían que estaban trabajando de más»?', r: 'Que el reclamo nació de la experiencia del cuerpo, no de un texto legal.',
          o: ['Que eran analfabetos y no podían leer.', 'Que el reclamo nació de la experiencia, no de un texto legal.', 'Que la ley todavía no existía en ninguna parte.'], c: 1 },
        { tipo: 'critica', q: '¿Cambia algo una huelga que no consigue todo lo que pedía? Defiende tu postura.', r: 'Respuesta abierta: se valora que note el resultado a largo plazo —leyes y derechos— frente al reclamo inmediato.',
          o: ['No: si no consiguieron todo, fue una derrota.', 'Sí: de ahí salieron el Código del Trabajo y el derecho a sindicato.', 'Solo si duró más de dos meses.'], c: 1 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LV7-01', titulo: 'La brigada que llegó primero', genero: 'narrativo',
      texto: 'El temblor los agarró a las dos de la tarde y la pared de adobe se vino encima del corredor. Los bomberos tardarían dos horas en subir desde la cabecera, así que la gente empezó sola. Nadie dio órdenes al principio y por eso se estorbaban: unos jalaban de un lado mientras otros levantaban del otro. Entonces don Rigo se subió a una piedra y organizó el trabajo en voz alta. Formó tres grupos: uno que removía, otro que sacaba el escombro en carretillas y otro que se quedaba callado escuchando, por si alguien contestaba. La regla del tercer grupo era la más difícil de cumplir: cuando ellos levantaban la mano, todos tenían que parar y callarse. Fue en uno de esos silencios cuando se oyó el llanto de la niña. La sacaron a las seis, y estaba viva. Los bomberos llegaron cuando la niña ya iba camino del centro de salud.',
      verbos: ['agarró', 'vino', 'tardarían', 'empezó', 'dio', 'estorbaban', 'jalaban', 'levantaban', 'subió', 'organizó', 'Formó', 'removía', 'sacaba', 'quedaba', 'contestaba', 'era', 'tenían', 'Fue', 'oyó', 'sacaron', 'estaba', 'llegaron', 'iba'],
      noPers: ['escuchando', 'cumplir', 'parar', 'callarse'],
      neutros: ['callado', 'viva', 'difícil'],
      preguntas: [
        { tipo: 'literal', q: '¿En cuántos grupos organizó don Rigo el trabajo?', r: 'En tres.',
          o: ['En tres.', 'En dos.', 'En cinco.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hacía el tercer grupo?', r: 'Se quedaba callado escuchando, por si alguien contestaba.',
          o: ['Sacaba el escombro en carretillas.', 'Buscaba a los bomberos.', 'Se quedaba callado escuchando, por si alguien contestaba.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué al principio la gente se estorbaba?', r: 'Porque nadie coordinaba y cada quien jalaba por su lado.',
          o: ['Porque eran demasiados.', 'Porque no tenían herramientas.', 'Porque nadie coordinaba y cada quien jalaba por su lado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la regla del silencio era la más difícil de cumplir?', r: 'Porque obliga a detener el rescate justo cuando la urgencia empuja a seguir.',
          o: ['Porque la gente no se conocía.', 'Porque obliga a parar justo cuando la urgencia empuja a seguir.', 'Porque había mucho ruido de máquinas.'], c: 1 },
        { tipo: 'critica', q: '¿Debe la gente actuar antes de que lleguen los bomberos? Argumenta.', r: 'Respuesta abierta: se valora que reconozca la urgencia real y también el riesgo de actuar sin método.',
          o: ['Nunca: hay que esperar a los expertos.', 'Siempre, sin pensarlo dos veces.', 'Sí cuando la ayuda tarda, pero organizándose, que fue lo que aquí funcionó.'], c: 2 },
      ] },

    { id: 'LV7-02', titulo: 'Sembrar en ladera sin perder el suelo', genero: 'expositivo',
      texto: 'Sembrar en pendiente parece imposible y sin embargo es lo que hace la mayoría de los productores del occidente. El problema no es la inclinación: es el agua que baja arrastrando la capa fértil, esa que tardó siglos en formarse. Las barreras vivas resuelven buena parte. Se siembran hileras de zacate o de piña siguiendo la curva a nivel, de manera que el agua se topa con la barrera, pierde fuerza y suelta ahí la tierra que traía. Año con año esa tierra retenida va formando una terraza sola, sin que nadie la construya. También ayuda no quemar el rastrojo: quemarlo deja el suelo desnudo justo antes de que empiecen las lluvias. Un técnico lo resume así: aquí no se trata de traer tierra nueva, sino de no dejar ir la que ya está, porque nadie ha logrado nunca fabricar un centímetro de suelo fértil.',
      verbos: ['parece', 'es', 'hace', 'baja', 'tardó', 'resuelven', 'siembran', 'topa', 'pierde', 'suelta', 'traía', 'va', 'construya', 'ayuda', 'deja', 'empiecen', 'resume', 'trata', 'está', 'ha'],
      noPers: ['Sembrar', 'arrastrando', 'formarse', 'siguiendo', 'retenida', 'formando', 'quemar', 'quemarlo', 'traer', 'ir', 'logrado', 'fabricar'],
      neutros: ['imposible', 'fértil', 'vivas', 'desnudo', 'nueva'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se siembran las barreras vivas?', r: 'En hileras de zacate o piña, siguiendo la curva a nivel.',
          o: ['En hileras de zacate o piña, siguiendo la curva a nivel.', 'De arriba hacia abajo de la ladera.', 'Alrededor de toda la parcela.'], c: 0 },
        { tipo: 'literal', q: '¿Qué pasa con el rastrojo quemado?', r: 'Deja el suelo desnudo justo antes de las lluvias.',
          o: ['Mejora la tierra con la ceniza.', 'Ahuyenta las plagas del maíz.', 'Deja el suelo desnudo justo antes de las lluvias.'], c: 2 },
        { tipo: 'inferencial', q: '¿Cómo se forma sola una terraza?', r: 'Porque la barrera detiene la tierra que baja y esa tierra se acumula año con año.',
          o: ['Porque la barrera detiene la tierra que baja y se acumula año con año.', 'Porque el productor la cava con azadón.', 'Porque la piña levanta el terreno.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el técnico dice que no se trata de traer tierra nueva?', r: 'Porque la capa fértil tardó siglos en formarse y no hay cómo reponerla trayéndola de otro lado.',
          o: ['Porque traer tierra es caro.', 'Porque la tierra de otro lado no sirve.', 'Porque tardó siglos en formarse y no hay cómo reponerla.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué crees que muchos siguen quemando aunque conocen el daño? Argumenta.', r: 'Respuesta abierta: se valora que reconozca razones prácticas —tiempo, mano de obra, costumbre— y no solo ignorancia.',
          o: ['Porque quemar es rápido y barato, y el daño se ve años después.', 'Porque no les importa la tierra.', 'Porque nadie se los ha dicho nunca.'], c: 0 },
      ] },

    { id: 'LV7-03', titulo: 'El día que el arbitraje se equivocó', genero: 'narrativo',
      texto: 'Faltaban cuatro minutos y el marcador estaba empatado. El delantero se metió al área, el defensa lo tocó apenas y él se dejó caer. El árbitro pitó penal. La banca del equipo contrario reclamó, el público chifló y el capitán de los locales hizo algo que nadie esperaba: caminó hasta el árbitro y le dijo que no había sido falta. El árbitro dudó, consultó al asistente y mantuvo su decisión. Anotaron el penal y ganaron. Al terminar, varios compañeros le reclamaron al capitán por haber hablado. Él contestó que no lo había hecho por el otro equipo, sino porque no quería pasarse la semana explicándole a su hermano menor por qué se había tirado. El entrenador no lo castigó. Tampoco lo felicitó delante de todos: se lo dijo aparte, en el camerino y sin testigos, para no ponerlo de ejemplo obligatorio delante de los demás.',
      verbos: ['Faltaban', 'estaba', 'metió', 'tocó', 'dejó', 'pitó', 'reclamó', 'chifló', 'hizo', 'esperaba', 'caminó', 'dijo', 'había', 'dudó', 'consultó', 'mantuvo', 'Anotaron', 'ganaron', 'reclamaron', 'contestó', 'quería', 'castigó', 'felicitó'],
      noPers: ['caer', 'terminar', 'haber', 'hablado', 'hecho', 'pasarse', 'explicándole', 'tirado', 'ponerlo'],
      neutros: ['empatado', 'menor', 'aparte', 'obligatorio'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo el capitán de los locales?', r: 'Le dijo al árbitro que no había sido falta.',
          o: ['Le dijo al árbitro que no había sido falta.', 'Reclamó el penal a favor.', 'Se retiró del campo.'], c: 0 },
        { tipo: 'literal', q: '¿Qué decidió finalmente el árbitro?', r: 'Mantuvo su decisión después de consultar al asistente.',
          o: ['Mantuvo su decisión después de consultar al asistente.', 'Anuló el penal.', 'Expulsó al capitán.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el capitán dijo que no lo hizo por el otro equipo?', r: 'Porque su razón era personal: no quería tener que justificarle la trampa a su hermano.',
          o: ['Porque odiaba a su propio equipo.', 'Porque su razón era personal: no quería justificarle la trampa a su hermano.', 'Porque quería que lo felicitaran.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el entrenador se lo dijo aparte y no delante de todos?', r: 'Para no convertir su decisión personal en una obligación para los demás.',
          o: ['Para no convertir su decisión personal en una obligación para los demás.', 'Porque no quería que los otros se enteraran.', 'Porque no estaba de acuerdo con él.'], c: 0 },
        { tipo: 'critica', q: '¿Hizo bien el capitán? Defiende tu postura con una razón.', r: 'Respuesta abierta: se valora que sostenga su posición reconociendo lo que su equipo perdía o ganaba.',
          o: ['No: primero está el equipo, y le costó puntos a los suyos.', 'Sí, aunque le costara: ganó algo que el marcador no mide.', 'Da igual, el árbitro decidió al final.'], c: 1 },
      ] },

    { id: 'LV7-04', titulo: 'Cómo se toma la presión', genero: 'instructivo',
      texto: 'Antes de medir, deja que la persona se siente y descanse cinco minutos, con la espalda apoyada y los pies en el suelo. No midas si acaba de caminar, de fumar o de tomar café: cualquiera de esas tres cosas sube la cifra y te hace registrar un dato que no existe. Coloca el brazo a la altura del corazón y ajusta el brazalete dos dedos arriba del codo, ni flojo ni apretando. Infla mientras palpas el pulso, y cuando deje de sentirse, sigue inflando treinta milímetros más. Después suelta despacio, escuchando: el primer golpe que oigas marca la sistólica y el último que se apaga marca la diastólica. Anota los dos números en el momento, sin confiar en la memoria. Si el valor sale alto, no alarmes a nadie: espera dos minutos y vuelve a medir en el otro brazo.',
      verbos: ['deja', 'siente', 'descanse', 'midas', 'acaba', 'sube', 'hace', 'existe', 'Coloca', 'ajusta', 'Infla', 'palpas', 'deje', 'sigue', 'suelta', 'oigas', 'marca', 'apaga', 'Anota', 'sale', 'alarmes', 'espera', 'vuelve'],
      noPers: ['medir', 'apoyada', 'caminar', 'fumar', 'tomar', 'registrar', 'apretando', 'sentirse', 'inflando', 'escuchando', 'confiar'],
      neutros: ['flojo', 'sistólica', 'diastólica', 'alto'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto debe descansar la persona antes de medir?', r: 'Cinco minutos.',
          o: ['Media hora.', 'Cinco minutos.', 'No hace falta descansar.'], c: 1 },
        { tipo: 'literal', q: '¿Qué marca el primer golpe que se oye?', r: 'La sistólica.',
          o: ['La diastólica.', 'La sistólica.', 'El pulso por minuto.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué no se mide después de caminar, fumar o tomar café?', r: 'Porque esas tres cosas suben la cifra y el dato registrado no sería real.',
          o: ['Porque el brazalete no ajusta bien.', 'Porque suben la cifra y el dato registrado no sería real.', 'Porque la persona no se queda quieta.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se anotan los números en el momento?', r: 'Porque confiar en la memoria hace perder o cambiar el dato.',
          o: ['Porque lo exige el reglamento.', 'Porque el aparato se apaga solo.', 'Porque confiar en la memoria hace perder o cambiar el dato.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué el texto pide no alarmar a nadie ante un valor alto? Argumenta.', r: 'Respuesta abierta: se valora que note que una sola medición puede estar equivocada y que el susto sube la presión.',
          o: ['Porque no es asunto de quien mide.', 'Porque siempre se equivoca el aparato.', 'Porque una sola medición puede fallar, y el susto sube todavía más la presión.'], c: 2 },
      ] },

    { id: 'LV7-05', titulo: 'La radionovela del mediodía', genero: 'expositivo',
      texto: 'Antes de que llegara la televisión a los pueblos, la radionovela detenía el país a la una de la tarde. Las familias comían escuchando y nadie hablaba durante esos treinta minutos. Los actores trabajaban en un estudio pequeño, leyendo el libreto de pie y turnándose frente a un solo micrófono. Los efectos se hacían a mano: una lámina que se sacudía era el trueno, dos cocos partidos golpeando una tabla eran los cascos de un caballo, y un puñado de sal cayendo sobre papel era la lluvia. El oyente no veía nada, y por eso lo veía todo. Cuando murió un personaje querido, llegaron cartas de condolencia a la emisora. Un locutor lo recordaba muchos años después con una idea que sigue sirviendo hoy: aquella gente no confundía la ficción con la vida, simplemente había aprendido a habitarla durante el rato que duraba.',
      verbos: ['llegara', 'detenía', 'comían', 'hablaba', 'trabajaban', 'hacían', 'sacudía', 'era', 'eran', 'veía', 'murió', 'llegaron', 'recordaba', 'sigue', 'confundía', 'había', 'duraba'],
      noPers: ['escuchando', 'leyendo', 'turnándose', 'partidos', 'golpeando', 'cayendo', 'querido', 'aprendido', 'habitarla', 'sirviendo'],
      neutros: ['pequeño', 'pie'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se hacía el sonido de la lluvia?', r: 'Con un puñado de sal cayendo sobre papel.',
          o: ['Con dos cocos partidos.', 'Con una lámina que se sacudía.', 'Con un puñado de sal cayendo sobre papel.'], c: 2 },
        { tipo: 'literal', q: '¿Cómo trabajaban los actores en el estudio?', r: 'De pie, leyendo el libreto y turnándose frente a un solo micrófono.',
          o: ['De pie, leyendo el libreto y turnándose frente a un solo micrófono.', 'Cada uno con su micrófono.', 'Grabando por separado.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «no veía nada, y por eso lo veía todo»?', r: 'Que al no mostrarle imágenes, el oyente las construía él mismo y resultaban más vivas.',
          o: ['Que la radio tenía mala señal.', 'Que al no mostrarle imágenes, el oyente las construía él mismo.', 'Que la gente cerraba los ojos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué muestran las cartas de condolencia por un personaje?', r: 'Hasta qué punto el público vivía la historia como algo propio.',
          o: ['Hasta qué punto el público vivía la historia como algo propio.', 'Que la emisora las inventaba para promocionarse.', 'Que la gente creía que era real.'], c: 0 },
        { tipo: 'critica', q: '¿Se perdió algo cuando la imagen reemplazó al sonido? Defiende tu postura.', r: 'Respuesta abierta: se valora que compare lo que aporta cada medio sin caer en que todo pasado fue mejor.',
          o: ['No: la televisión es mejor en todo.', 'Se perdió el trabajo de imaginar, aunque se ganaron otras cosas.', 'Sí: antes todo era mejor.'], c: 1 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LV8-01', titulo: 'Si se prende la sartén', genero: 'instructivo',
      texto: 'Si el aceite de la sartén se prende, lo primero que tenés que hacer es no moverla. Mucha gente agarra el sartén y corre con él hacia la pila, y en ese trayecto el aire aviva la llama, el aceite se derrama y el fuego se reparte por toda la cocina. Apagá la hornilla si podés alcanzar la perilla sin pasar la mano sobre el fuego. Después tapá la sartén con una tapadera de metal, con una lata o con una toalla mojada bien escurrida, y dejala tapada hasta que se enfríe sola. Sin aire, la llama se apaga en segundos. Nunca le echés agua: el agua se hunde, se convierte en vapor de golpe y revienta el aceite hacia arriba, y esa bola de fuego es la que quema la cara. Tampoco uses harina ni azúcar, que arden. Cuando todo termine, no destapés de curiosidad: si entra aire y el aceite sigue caliente, vuelve a prenderse.',
      verbos: ['prende', 'tenés', 'agarra', 'corre', 'aviva', 'derrama', 'reparte', 'Apagá', 'podés', 'tapá', 'dejala', 'enfríe', 'apaga', 'echés', 'hunde', 'convierte', 'revienta', 'es', 'quema', 'uses', 'arden', 'termine', 'destapés', 'entra', 'sigue', 'vuelve'],
      noPers: ['hacer', 'moverla', 'alcanzar', 'pasar', 'mojada', 'escurrida', 'tapada', 'prenderse'],
      neutros: ['primero', 'caliente', 'sola'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se tapa la sartén encendida?', r: 'Con una tapadera de metal, una lata o una toalla mojada bien escurrida.',
          o: ['Con un plato de vidrio.', 'Con una tapadera de metal, una lata o una toalla mojada bien escurrida.', 'Con harina o azúcar.'], c: 1 },
        { tipo: 'literal', q: '¿Qué NO se debe hacer nunca?', r: 'Echarle agua.',
          o: ['Echarle agua.', 'Apagar la hornilla.', 'Dejarla tapada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué no hay que correr con la sartén hacia la pila?', r: 'Porque el aire aviva la llama y el aceite se derrama repartiendo el fuego.',
          o: ['Porque uno se puede resbalar.', 'Porque la pila se puede dañar.', 'Porque el aire aviva la llama y el aceite se derrama repartiendo el fuego.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el agua empeora el incendio de aceite?', r: 'Porque se hunde, se vuelve vapor de golpe y revienta el aceite hacia arriba.',
          o: ['Porque el agua también arde.', 'Porque se hunde, se vuelve vapor de golpe y revienta el aceite hacia arriba.', 'Porque enfría demasiado rápido el metal.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué crees que la reacción natural de la gente es justo la equivocada? Argumenta.', r: 'Respuesta abierta: se valora que relacione el impulso de alejar el peligro con la falta de práctica en emergencias.',
          o: ['Porque la gente es descuidada.', 'Porque el impulso es alejar el peligro, y eso solo se corrige sabiéndolo antes.', 'Porque nadie lee las instrucciones.'], c: 1 },
      ] },

    { id: 'LV8-02', titulo: 'Los nueve días', genero: 'expositivo',
      texto: 'Cuando alguien muere, en muchos pueblos de Honduras la familia reza el novenario: nueve noches seguidas de rosario en la casa del difunto. La costumbre parece solo religiosa y cumple además una función que nadie escribió en ninguna parte. Durante esos nueve días la casa no se queda sola nunca. Llegan vecinos, se cuela café en olla grande, alguien barre, alguien presta sillas y alguien se queda hasta tarde conversando. La viuda o el viudo no tiene que pedir compañía: la compañía llega sin avisar y se organiza sola. Al noveno día se levanta la cruz de arena o de cal que estuvo puesta en el suelo, se reparte comida y la gente empieza a espaciar las visitas. Los que estudian el duelo dicen que ese calendario protege sin proponérselo: pone un límite a la etapa más dura y avisa cuándo hay que volver, poco a poco, a la vida de siempre. Nadie tuvo que decidirlo: la costumbre ya lo traía resuelto.',
      verbos: ['muere', 'reza', 'parece', 'cumple', 'escribió', 'queda', 'Llegan', 'cuela', 'barre', 'presta', 'tiene', 'llega', 'organiza', 'levanta', 'estuvo', 'reparte', 'empieza', 'estudian', 'dicen', 'protege', 'pone', 'avisa', 'hay', 'volver', 'tuvo', 'traía'],
      noPers: ['conversando', 'pedir', 'avisar', 'puesta', 'espaciar', 'proponérselo', 'seguidas', 'decidirlo', 'resuelto'],
      neutros: ['religiosa', 'sola', 'dura'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué se hace el noveno día?', r: 'Se levanta la cruz de arena o de cal y se reparte comida.',
          o: ['Se cierra la casa y nadie vuelve.', 'Se levanta la cruz de arena o de cal y se reparte comida.', 'Empieza otro novenario.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hacen los vecinos durante esos nueve días?', r: 'Llegan, cuelan café, barren, prestan sillas y se quedan conversando.',
          o: ['Llegan, cuelan café, barren, prestan sillas y se quedan conversando.', 'Solo asisten al rosario y se van.', 'Esperan a que la familia los llame.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cuál es la función que «nadie escribió en ninguna parte»?', r: 'Acompañar a la familia sin que tenga que pedirlo.',
          o: ['Recaudar dinero para el entierro.', 'Rezar por el alma del difunto.', 'Acompañar a la familia sin que tenga que pedirlo.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que ese calendario «protege sin proponérselo»?', r: 'Porque marca un límite a la etapa más dura y señala cuándo volver a la vida normal.',
          o: ['Porque impide que la familia salga de casa.', 'Porque marca un límite a la etapa más dura y señala cuándo volver.', 'Porque obliga a rezar todos los días.'], c: 1 },
        { tipo: 'critica', q: '¿Qué se pierde cuando una costumbre así deja de practicarse? Argumenta.', r: 'Respuesta abierta: se valora que note la pérdida del acompañamiento organizado, no solo la del rito.',
          o: ['No se pierde nada: son creencias viejas.', 'Se pierde solo el café y las sillas.', 'Se pierde una manera ya armada de acompañar a quien está de duelo.'], c: 2 },
      ] },

    { id: 'LV8-03', titulo: 'Manejar en la montaña', genero: 'expositivo',
      texto: 'Bajar una cuesta larga en primera parece exagerado y es lo único que evita quedarse sin frenos. Quien baja en neutro o en una marcha alta se ve obligado a frenar todo el tiempo; las pastillas se calientan, el líquido hierve y de pronto el pedal se hunde hasta el suelo sin que pase nada. A eso le llaman fatiga de frenos y no avisa antes: avisa cuando ya no hay dónde parar. Los que manejan rastras en la carretera de Olancho lo aprendieron a la mala, y por eso bajan zumbando el motor. También cuentan otra cosa que un manual no dice: en curva cerrada conviene tocar el pito antes de entrar, porque del otro lado puede venir alguien invadiendo el carril. Y si el carro de adelante empieza a echar humo, hay que dejarle campo, no pegársele. Manejar en la montaña se aprende bajando despacio y escuchando el motor, y ningún curso reemplaza las primeras veces que uno hace esa cuesta con miedo.',
      verbos: ['parece', 'es', 'evita', 'baja', 've', 'calientan', 'hierve', 'hunde', 'pase', 'llaman', 'avisa', 'hay', 'manejan', 'aprendieron', 'bajan', 'cuentan', 'dice', 'conviene', 'puede', 'venir', 'empieza', 'aprende', 'reemplaza', 'hace'],
      noPers: ['Bajar', 'quedarse', 'obligado', 'frenar', 'parar', 'zumbando', 'tocar', 'entrar', 'invadiendo', 'echar', 'dejarle', 'pegársele', 'Manejar', 'bajando', 'escuchando'],
      neutros: ['exagerado', 'alta', 'cerrada'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo bajan las cuestas largas los que manejan rastras?', r: 'En primera, zumbando el motor.',
          o: ['En neutro, para ahorrar combustible.', 'Frenando todo el tiempo.', 'En primera, zumbando el motor.'], c: 2 },
        { tipo: 'literal', q: '¿Qué se recomienda antes de entrar en una curva cerrada?', r: 'Tocar el pito.',
          o: ['Tocar el pito.', 'Acelerar para pasarla rápido.', 'Encender las luces de emergencia.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué es peligrosa la fatiga de frenos?', r: 'Porque no da aviso previo: aparece justo cuando ya no hay dónde parar.',
          o: ['Porque no da aviso previo: aparece cuando ya no hay dónde parar.', 'Porque daña el motor del vehículo.', 'Porque gasta más combustible.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué hay que dejarle campo al carro que echa humo?', r: 'Porque es señal de que sus frenos están fallando y puede no poder detenerse.',
          o: ['Porque el humo no deja ver.', 'Porque va contaminando la carretera.', 'Porque es señal de que sus frenos fallan y puede no poder detenerse.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué lo que «un manual no dice» se aprende igual? Argumenta.', r: 'Respuesta abierta: se valora que reconozca el saber que se forma con la experiencia compartida del oficio.',
          o: ['Porque los manuales están mal escritos.', 'Porque el oficio acumula un saber que se pasa de conductor a conductor.', 'Porque nadie lee manuales.'], c: 1 },
      ] },

    { id: 'LV8-04', titulo: 'La jornada de vacunación', genero: 'narrativo',
      texto: 'La enfermera Delia salió a las seis con la hielera al hombro y una lista de veintidós casas. Caminó hasta la última, la más lejana, y desde ahí fue devolviéndose: aprendió hace años que si empieza por la cercana, a media mañana ya está cansada y termina apurando lo difícil. En la tercera casa una señora le dijo que no, que en la radio habían dicho cosas. Delia no discutió ni se molestó. Se sentó, aceptó un vaso de agua y le preguntó por el niño mayor, que había tenido tosferina de bebé. Estuvieron conversando media hora. Al final la señora sacó a los dos pequeños al corredor. Delia anotó las dosis, revisó la temperatura de la hielera y siguió caminando. Esa tarde había vacunado a diecinueve niños de veintidós. De las tres que faltaron, dos no estaban en casa. Solo una dijo que no, y Delia apuntó la dirección para volver el sábado, cuando el marido de la señora estuviera en la casa y pudieran conversarlo los dos.',
      verbos: ['salió', 'Caminó', 'fue', 'aprendió', 'empieza', 'está', 'termina', 'dijo', 'habían', 'discutió', 'molestó', 'sentó', 'aceptó', 'preguntó', 'había', 'Estuvieron', 'sacó', 'anotó', 'revisó', 'siguió', 'faltaron', 'estaban', 'apuntó', 'volver', 'estuviera', 'pudieran'],
      noPers: ['devolviéndose', 'apurando', 'dicho', 'tenido', 'conversando', 'caminando', 'vacunado', 'conversarlo'],
      neutros: ['lejana', 'cansada', 'difícil', 'mayor'],
      preguntas: [
        { tipo: 'literal', q: '¿Por dónde empezó Delia el recorrido?', r: 'Por la casa más lejana, para devolverse desde ahí.',
          o: ['Por la casa más lejana, para devolverse desde ahí.', 'Por la casa más cercana.', 'Por la casa de la señora que dijo que no.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hizo Delia cuando la señora le dijo que no?', r: 'Se sentó, aceptó agua y le preguntó por el niño mayor.',
          o: ['Se sentó, aceptó agua y le preguntó por el niño mayor.', 'Se fue a la siguiente casa.', 'Le explicó que estaba equivocada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué empieza por la casa más lejana?', r: 'Porque si dejara lo difícil para el final, llegaría cansada y lo apuraría.',
          o: ['Porque ahí vive más gente.', 'Porque el camino es mejor de bajada.', 'Porque si dejara lo difícil para el final, llegaría cansada y lo apuraría.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué le preguntó por el niño que tuvo tosferina?', r: 'Porque esa experiencia propia dice más que cualquier discusión sobre lo que se oyó en la radio.',
          o: ['Porque quería cambiar de tema.', 'Porque esa experiencia propia dice más que cualquier discusión.', 'Porque necesitaba el dato para su lista.'], c: 1 },
        { tipo: 'critica', q: '¿Sirve discutir con quien desconfía de una vacuna? Defiende tu postura.', r: 'Respuesta abierta: se valora que compare la discusión con lo que hizo Delia y sostenga una razón.',
          o: ['Sí: hay que corregir de una vez lo que está mal.', 'Discutir cierra la puerta; escuchar y partir de su propia experiencia la abre.', 'No sirve nada, esa gente no cambia.'], c: 1 },
      ] },

    { id: 'LV8-05', titulo: 'Cuando llegó la señal', genero: 'narrativo',
      texto: 'La antena la instalaron en el techo de la escuela un martes, y para el viernes ya había cola de gente afuera. Al principio todos querían lo mismo: hacer videollamada con los que se habían ido. Doña Cristina vio a su hijo después de once años y no dijo nada durante el primer minuto; solo se quedó mirando la pantalla, tapándose la boca. Después vinieron otros usos que nadie había anticipado. El patronato empezó a mandar sus actas por correo en vez de bajarlas a la cabecera. Dos muchachas abrieron un negocio vendiendo tortillas por encargo. Un maestro descargó los libros que la Secretaría no había podido enviar en tres años. También llegaron los problemas: dos alumnos dejaron de dormir y aparecieron rumores que antes se apagaban solos. El director lo resumió en una reunión sin adornos: llegó una herramienta, no una solución, y ahora nos toca aprender a usarla, que es un trabajo que no hizo la antena y que va a llevarnos años.',
      verbos: ['instalaron', 'había', 'querían', 'vio', 'dijo', 'quedó', 'vinieron', 'empezó', 'abrieron', 'descargó', 'llegaron', 'dejaron', 'aparecieron', 'apagaban', 'resumió', 'llegó', 'toca', 'es', 'hizo', 'va'],
      noPers: ['hacer', 'ido', 'mirando', 'tapándose', 'anticipado', 'mandar', 'bajarlas', 'vendiendo', 'podido', 'enviar', 'dormir', 'aprender', 'usarla', 'llevarnos'],
      neutros: ['solos', 'primer'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué quería hacer todo el mundo al principio?', r: 'Videollamada con los que se habían ido.',
          o: ['Buscar trabajo en internet.', 'Ver videos de música.', 'Videollamada con los que se habían ido.'], c: 2 },
        { tipo: 'literal', q: '¿Qué usos aparecieron después?', r: 'Mandar las actas del patronato, vender tortillas por encargo y descargar libros.',
          o: ['Mandar las actas, vender tortillas por encargo y descargar libros.', 'Solo juegos y redes sociales.', 'Ninguno: la gente se aburrió.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué doña Cristina no dijo nada durante el primer minuto?', r: 'Porque la emoción de ver a su hijo después de once años la dejó sin palabras.',
          o: ['Porque la señal estaba fallando.', 'Porque no reconocía a su hijo.', 'Porque la emoción de ver a su hijo después de once años la dejó sin palabras.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiso decir el director con «llegó una herramienta, no una solución»?', r: 'Que el internet abre posibilidades pero no resuelve nada por sí solo ni evita sus propios daños.',
          o: ['Que abre posibilidades pero no resuelve nada por sí solo.', 'Que había que comprar computadoras.', 'Que la antena estaba mal instalada.'], c: 0 },
        { tipo: 'critica', q: '¿Cómo debería una comunidad prepararse antes de que llegue el internet? Propón algo.', r: 'Respuesta abierta: se valora que proponga acuerdos concretos —horarios, formación, uso escolar— y no solo el temor.',
          o: ['Acordando desde antes horarios, usos escolares y qué hacer con los rumores.', 'No hace falta prepararse: se aprende usándolo.', 'Mejor no dejar que llegue.'], c: 0 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LV9-01', titulo: 'Interpretar no es traducir palabra por palabra', genero: 'expositivo',
      texto: 'Un intérprete de lengua de señas no convierte palabras en gestos, uno por uno. Trabaja con una lengua completa, con su propia gramática, en la que el orden de la oración y la expresión de la cara cambian el significado igual que aquí lo cambia la entonación. Por eso, cuando escucha una frase larga, primero espera, entiende el sentido entero y solo entonces empieza a señar. Ese retraso, que dura unos segundos, incomoda a quien no lo conoce: parece que se quedó atrás. En realidad está haciendo lo único que permite decir la idea completa. La interpretación exige además decidir sobre la marcha. Si el orador cuenta un chiste que depende de un doble sentido en español, el intérprete tiene que resolver en un segundo si lo explica, si lo sustituye por otro o si avisa que hubo un chiste imposible de trasladar. Se equivocará algunas veces. Lo que no puede hacer, y es la regla que más cuesta sostener, es inventar contenido para llenar el silencio, porque quien recibe la seña no tiene con qué comprobar lo que le están diciendo.',
      verbos: ['convierte', 'Trabaja', 'cambian', 'cambia', 'escucha', 'espera', 'entiende', 'empieza', 'dura', 'incomoda', 'conoce', 'parece', 'quedó', 'está', 'permite', 'exige', 'cuenta', 'depende', 'tiene', 'explica', 'sustituye', 'avisa', 'hubo', 'equivocará', 'puede', 'es', 'cuesta', 'recibe', 'están'],
      noPers: ['señar', 'haciendo', 'decir', 'decidir', 'resolver', 'trasladar', 'hacer', 'sostener', 'inventar', 'llenar', 'comprobar', 'diciendo'],
      neutros: ['completa', 'entero', 'imposible', 'atrás'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hace el intérprete antes de empezar a señar una frase larga?', r: 'Espera y entiende el sentido entero.',
          o: ['Traduce palabra por palabra.', 'Espera y entiende el sentido entero.', 'Pide al orador que repita.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el retraso incomoda a quien no conoce el oficio?', r: 'Porque parece que el intérprete se quedó atrás, cuando en realidad está esperando el sentido completo.',
          o: ['Porque parece que se quedó atrás, cuando está esperando el sentido completo.', 'Porque el intérprete se ve cansado.', 'Porque el público no oye nada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué un chiste de doble sentido es un problema difícil?', r: 'Porque depende del español y hay que decidir en un segundo entre explicarlo, sustituirlo o avisar que se perdió.',
          o: ['Porque los chistes están prohibidos.', 'Porque la lengua de señas no tiene humor.', 'Porque depende del español y hay que decidir en un segundo qué hacer.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué inventar contenido es peor que quedarse corto? Argumenta.', r: 'Respuesta abierta: se valora que hable de la confianza del receptor, que no tiene cómo verificar lo que se le dice.',
          o: ['Porque el intérprete se cansa más.', 'Porque quien recibe la seña no tiene cómo saber que le están mintiendo.', 'Porque el orador se puede molestar.'], c: 1 },
        { tipo: 'critica', q: '¿Debería haber intérprete en toda información pública? Defiende tu postura.', r: 'Respuesta abierta: se valora que ponga en juego el derecho a la información y el costo de garantizarlo.',
          o: ['Sí: sin intérprete esa información sencillamente no existe para ellos.', 'No: son muy pocas personas.', 'Solo en los noticieros.'], c: 0 },
      ] },

    { id: 'LV9-02', titulo: 'El juzgado de paz', genero: 'expositivo',
      texto: 'En los municipios pequeños funciona un juzgado de paz que resuelve lo que nunca llegará a un tribunal grande: un lindero movido, un animal que se metió a un cultivo, una deuda de dos mil lempiras, un pleito entre vecinos que ya escaló a insultos. El juez de paz no siempre es abogado, y muchas veces conoce a las dos partes desde niño. Eso, que parecería un defecto, resulta ser lo que hace funcionar el sistema: sabe qué pesa de verdad en ese pueblo. La ley le pide primero intentar la conciliación, es decir, lograr que las partes acuerden algo antes de dictar cualquier resolución. La mayoría de los casos termina así. Cuando alguien se niega, el juez resuelve, y su decisión puede apelarse. El riesgo de este modelo también es evidente: donde el juez debe favores o teme a alguien, la cercanía se vuelve presión. Por eso la conciliación tiene que quedar escrita y firmada delante de testigos, no dicha en el corredor: el papel es lo único que después sostiene el acuerdo cuando alguien cambia de versión.',
      verbos: ['funciona', 'resuelve', 'llegará', 'movido', 'metió', 'escaló', 'es', 'conoce', 'parecería', 'resulta', 'hace', 'sabe', 'pesa', 'pide', 'acuerden', 'termina', 'niega', 'puede', 'debe', 'teme', 'vuelve', 'tiene', 'sostiene', 'cambia'],
      noPers: ['intentar', 'lograr', 'dictar', 'apelarse', 'funcionar', 'quedar', 'escrita', 'firmada', 'dicha'],
      neutros: ['pequeños', 'grande', 'evidente'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le pide la ley al juez de paz antes de resolver?', r: 'Intentar primero la conciliación.',
          o: ['Escuchar solo a la parte que reclama.', 'Consultar a un abogado de la capital.', 'Intentar primero la conciliación.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué conocer a las dos partes «resulta ser lo que hace funcionar el sistema»?', r: 'Porque el juez sabe qué pesa de verdad en ese pueblo y puede acercar a las partes.',
          o: ['Porque así resuelve más rápido.', 'Porque le tienen miedo.', 'Porque sabe qué pesa de verdad en ese pueblo y puede acercar a las partes.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la conciliación debe quedar escrita y firmada?', r: 'Porque lo hablado en el corredor deja abierta la puerta a la presión y a negarlo después.',
          o: ['Porque lo exige el archivo del municipio.', 'Porque así se cobra el trámite.', 'Porque lo hablado deja abierta la puerta a la presión y a negarlo después.'], c: 2 },
        { tipo: 'critica', q: '¿La cercanía del juez con la gente es una ventaja o un riesgo? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca que es las dos cosas y proponga qué la mantiene del lado bueno.',
          o: ['Es las dos: ayuda a conciliar y, sin reglas escritas, se vuelve presión.', 'Solo ventaja: conoce a todos.', 'Solo riesgo: debería venir de fuera.'], c: 0 },
        { tipo: 'critica', q: '¿Debería exigirse que todo juez de paz sea abogado? Argumenta.', r: 'Respuesta abierta: se valora que pese la formación jurídica contra la disponibilidad real de abogados en municipios pequeños.',
          o: ['Sí, sin excepción y de inmediato.', 'Conviene, pero exigirlo hoy dejaría a muchos municipios sin juzgado.', 'No hace falta ninguna formación.'], c: 1 },
      ] },

    { id: 'LV9-03', titulo: 'El que volvió', genero: 'narrativo',
      texto: 'Nelson se fue a los diecinueve y regresó a los treinta y uno, deportado, con una mochila y ochocientos dólares. En doce años había mandado dinero cada mes sin fallar uno solo. Con eso su familia levantó la casa de bloque, terminó de criar a los hermanos y compró la moto con la que su papá reparte gas. Cuando llegó, encontró que en el pueblo lo trataban con una mezcla difícil de nombrar: respeto por lo que había sostenido y una distancia que él no esperaba. Sus amigos habían formado familia y él no conocía a los hijos de nadie. Tampoco conocía los precios, ni las calles nuevas, ni el nombre del alcalde. Estuvo cuatro meses casi sin salir. Después empezó a trabajar reparando refrigeradoras, un oficio que aprendió allá, y hoy tiene taller propio y dos empleados. Dice que lo más duro no fue perder los papeles ni el viaje de vuelta, que ya se imaginaba: fue descubrir, al bajarse del bus, que había estado sosteniendo durante doce años un lugar donde ya no le quedaba sitio.',
      verbos: ['fue', 'regresó', 'había', 'levantó', 'terminó', 'compró', 'reparte', 'llegó', 'encontró', 'trataban', 'esperaba', 'habían', 'conocía', 'Estuvo', 'empezó', 'aprendió', 'tiene', 'Dice', 'imaginaba', 'quedaba'],
      noPers: ['deportado', 'mandado', 'fallar', 'criar', 'nombrar', 'sostenido', 'formado', 'salir', 'trabajar', 'reparando', 'descubrir', 'estado', 'sosteniendo', 'perder', 'bajarse'],
      neutros: ['propio', 'nuevas', 'duro'],
      preguntas: [
        { tipo: 'literal', q: '¿En qué se usó el dinero que Nelson mandó durante doce años?', r: 'En la casa de bloque, en criar a los hermanos y en la moto del papá.',
          o: ['En pagar su propio viaje de regreso.', 'En comprar tierras para sembrar.', 'En la casa de bloque, en criar a los hermanos y en la moto del papá.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué no conocía los precios ni el nombre del alcalde?', r: 'Porque el pueblo siguió cambiando durante los doce años en que él estuvo fuera.',
          o: ['Porque el pueblo siguió cambiando durante los doce años en que estuvo fuera.', 'Porque nunca le interesó su pueblo.', 'Porque nadie quiso contarle nada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué significa que había «estado sosteniendo un lugar donde ya no tenía sitio»?', r: 'Que mantuvo económicamente una vida que siguió sin él y en la que ya no encajaba al volver.',
          o: ['Que la casa se cayó mientras él no estaba.', 'Que mantuvo una vida que siguió sin él y en la que ya no encajaba.', 'Que su familia no le agradeció el dinero.'], c: 1 },
        { tipo: 'critica', q: '¿Qué debería ofrecer un país a quien regresa deportado? Propón algo concreto.', r: 'Respuesta abierta: se valora que proponga medidas concretas —reconocer el oficio aprendido, crédito, acompañamiento— y no solo compasión.',
          o: ['Nada: se fue por su cuenta.', 'Un discurso de bienvenida.', 'Reconocer el oficio que trae, y crédito o acompañamiento para arrancar aquí.'], c: 2 },
        { tipo: 'critica', q: '¿Se puede llamar «éxito» a doce años de remesas? Defiende tu postura.', r: 'Respuesta abierta: se valora que ponga en la balanza lo logrado y lo que costó personalmente.',
          o: ['Sí, sin más: levantó a toda su familia.', 'No: al final lo deportaron.', 'Logró mucho, y el costo personal también fue enorme: las dos cosas son ciertas.'], c: 2 },
      ] },

    { id: 'LV9-04', titulo: 'Restaurar no es repintar', genero: 'expositivo',
      texto: 'Cuando una iglesia colonial necesita reparación, la tentación es repintar el retablo para que se vea nuevo. Un restaurador hace justo lo contrario: primero documenta, después limpia y solo interviene lo mínimo. La regla del oficio se llama reversibilidad, y significa que todo lo que él añada tiene que poder quitarse después sin dañar lo original. Por eso usa materiales distintos de los antiguos, y a veces pinta las zonas perdidas con líneas finas que de cerca se notan y de lejos no: quien mire la obra debe poder distinguir qué puso el artista y qué puso quien la reparó. Repintar encima, en cambio, borra la información para siempre. Un retablo del siglo dieciocho cubierto de esmalte pierde el registro de cómo se doraba entonces, qué pigmentos se conseguían y qué manos lo hicieron. Se conserva el objeto y se pierde el documento. En Honduras varios retablos se salvaron porque alguien llegó a tiempo con este argumento y no con dinero, y convenció al párroco de esperar unos meses más antes de mandar a pintar.',
      verbos: ['necesita', 'es', 'vea', 'hace', 'documenta', 'limpia', 'interviene', 'llama', 'significa', 'añada', 'tiene', 'usa', 'pinta', 'notan', 'mire', 'debe', 'puso', 'reparó', 'borra', 'pierde', 'doraba', 'conseguían', 'hicieron', 'conserva', 'salvaron', 'llegó', 'convenció'],
      noPers: ['repintar', 'quitarse', 'dañar', 'perdidas', 'distinguir', 'cubierto', 'esperar', 'mandar', 'pintar'],
      neutros: ['nuevo', 'mínimo', 'original', 'finas', 'colonial'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se llama la regla del oficio del restaurador?', r: 'Reversibilidad.',
          o: ['Reversibilidad.', 'Conservación total.', 'Repintado técnico.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué usa materiales distintos de los antiguos?', r: 'Para que lo que él añada pueda quitarse después sin dañar lo original.',
          o: ['Porque los antiguos ya no se consiguen.', 'Porque son más baratos.', 'Para que lo que él añada pueda quitarse después sin dañar lo original.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiere decir «se conserva el objeto y se pierde el documento»?', r: 'Que la pieza sigue ahí pero ya no puede contar cómo fue hecha ni por quién.',
          o: ['Que se pierden los papeles del archivo.', 'Que la pieza sigue ahí pero ya no puede contar cómo fue hecha.', 'Que el retablo se cae después.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué un retablo repintado «se ve mejor» y sin embargo está peor? Argumenta.', r: 'Respuesta abierta: se valora que separe el criterio estético inmediato del valor documental.',
          o: ['Porque el esmalte se despinta al año.', 'Porque lo que gana en apariencia lo pierde como testimonio, y eso no se repone.', 'Porque los colores nuevos son feos.'], c: 1 },
        { tipo: 'critica', q: '¿Quién debería decidir cómo se repara un bien de una comunidad? Defiende tu postura.', r: 'Respuesta abierta: se valora que reparta la decisión entre el criterio técnico y la comunidad que lo usa.',
          o: ['La comunidad con el técnico: uno pone el criterio y la otra, el sentido de la pieza.', 'Solo el técnico: es el que sabe.', 'Solo el que paga la reparación.'], c: 0 },
      ] },

    { id: 'LV9-05', titulo: 'Lo que mide una prueba', genero: 'expositivo',
      texto: 'Cada año se aplican pruebas estandarizadas y los resultados salen en los periódicos como si midieran la calidad de cada escuela. Miden algo, sin duda, pero mucho menos de lo que se les atribuye. Una prueba de una mañana captura lo que un alumno logra resolver ese día, en ese formato y con hambre o sin hambre. No registra si llegó caminando una hora, si estudió con luz eléctrica o con candil, ni si el maestro que lo preparó lleva ocho meses sin cobrar. Comparar dos escuelas por su promedio, sin mirar de dónde parte cada una, no informa: premia a la que recibió alumnos con más ventajas. Lo que sí sirve es comparar a la misma escuela consigo misma a lo largo del tiempo, porque ahí sí se ve si algo mejoró. Los sistemas que entendieron esto dejaron de publicar rankings y empezaron a publicar trayectorias. Los que no, siguen ordenando escuelas en una lista que nadie sabe leer y que, año con año, termina castigando siempre a las mismas.',
      verbos: ['aplican', 'salen', 'midieran', 'Miden', 'atribuye', 'captura', 'logra', 'registra', 'llegó', 'estudió', 'preparó', 'lleva', 'informa', 'premia', 'recibió', 'sirve', 'es', 'parte', 've', 'mejoró', 'entendieron', 'dejaron', 'empezaron', 'siguen', 'sabe', 'termina'],
      noPers: ['estandarizadas', 'resolver', 'caminando', 'cobrar', 'Comparar', 'mirar', 'publicar', 'ordenando', 'leer', 'castigando'],
      neutros: ['eléctrica', 'misma'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué empezaron a publicar los sistemas que entendieron el problema?', r: 'Trayectorias, en vez de rankings.',
          o: ['Los nombres de los maestros.', 'Trayectorias, en vez de rankings.', 'Promedios por departamento.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué comparar dos escuelas por su promedio «premia» a una de ellas?', r: 'Porque no mira de dónde parte cada una y favorece a la que recibió alumnos con más ventajas.',
          o: ['Porque no mira de dónde parte cada una y favorece a la de más ventajas.', 'Porque le dan un premio en efectivo.', 'Porque los periódicos la mencionan más.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué sirve comparar a una escuela consigo misma?', r: 'Porque así se ve si mejoró, sin castigarla por las condiciones con las que empezó.',
          o: ['Porque es más fácil de calcular.', 'Porque así se ve si mejoró, sin castigarla por sus condiciones de partida.', 'Porque a los maestros les gusta más.'], c: 1 },
        { tipo: 'critica', q: '¿Deberían publicarse los resultados de las pruebas? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre transparencia y ranking, y proponga cómo publicarlos.',
          o: ['Sí, pero como trayectoria de cada escuela y no como lista de mejores y peores.', 'No: solo sirven para humillar escuelas.', 'Sí, tal como están: el que sale mal que se esfuerce.'], c: 0 },
        { tipo: 'critica', q: '¿Qué habría que medir además del resultado de la prueba? Propón algo concreto.', r: 'Respuesta abierta: se valora que proponga indicadores concretos —asistencia, condiciones, avance del grupo— con una razón.',
          o: ['Las condiciones de partida y el avance del mismo grupo año con año.', 'Nada más: la prueba es objetiva.', 'La opinión de los padres únicamente.'], c: 0 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN

   1. las cinco preguntas del texto;
   2. cazar los verbos tocándolos sobre lo que acaba de leer;
   3. clasificar los que cazó: conjugado o forma no personal;
   4. volver de memoria al texto a buscar el verbo exacto.
══════════════════════════════════════════════════════════════ */
const LECTURA_VERBOS_TALLER = [

  { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

  { id: 'caza', icono: '🎯', titulo: 'Caza de verbos', forma: 'cazar', meta: 10,
    instruccion: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' verbos</strong>. Encuentra ' +
        '<strong>al menos ' + info.meta + '</strong> y tócalos: valen los <strong>conjugados</strong> ' +
        '(llegó, sube, tenían) y también las <strong>formas no personales</strong> ' +
        '(cortar, cortando, cortado).';
    },
    enPapel: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' verbos</strong>. <strong>Subraya al menos ' +
        info.meta + '</strong> en el texto de arriba: valen los <strong>conjugados</strong> (llegó, sube, tenían) ' +
        'y también las <strong>formas no personales</strong> (cortar, cortando, cortado).';
    },
    objetivos: function (t, u) {
      var con = {}, np = {};
      (t.verbos || []).forEach(function (p) { con[u.clave(p)] = 1; });
      (t.noPers || []).forEach(function (p) { np[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (con[k]) out.push({ ini: i, fin: i, clase: 'a' });
        else if (np[k]) out.push({ ini: i, fin: i, clase: 'b' });
      });
      return out;
    },
    /* La zona gris de los verbos es ancha: el participio que ahí hace de
       adjetivo, el infinitivo que ahí es sustantivo. Tocarlas no suma ni
       resta, y la pantalla explica por qué. */
    neutros: function (t, u) {
      var neu = {};
      (t.neutros || []).forEach(function (p) { neu[u.clave(p)] = 1; });
      if (typeof LECTURA_CLASES !== 'undefined') LECTURA_CLASES.neutros.forEach(function (p) { neu[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        if (neu[u.clave(p)]) {
          out.push({ ini: i, fin: i, motivo: '«' + u.esc(p.replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '')) +
            '» viene de un verbo, pero <strong>aquí no está haciendo de verbo</strong>: en esta oración ' +
            'funciona como adjetivo o como sustantivo. No cuenta: ni bien ni mal.' });
        }
      });
      return out;
    },
    fallo: function (palabra, u) {
      return '❌ «' + u.esc(palabra) + '» no es verbo. Un verbo dice lo que <strong>pasa</strong> o lo que ' +
        '<strong>se hace</strong>. Prueba a ponerle <em>yo</em> o <em>ayer</em> delante y fíjate si suena.';
    } },

  { id: 'clasifica', icono: '🗂️', titulo: '¿Conjugado o no personal?', forma: 'dosGrupos',
    pista: 'Míralos en su oración antes de decidir',
    grupos: [
      { clave: 'a', titulo: '👤 Conjugado', pista: 'dice quién y cuándo', nombre: 'verbo conjugado' },
      { clave: 'b', titulo: '♾️ No personal', pista: '-ar, -er, -ir, -ando, -ado', nombre: 'forma no personal' }
    ],
    items: function (t, u) {
      var con = u.baraja(t.verbos || []), np = u.baraja(t.noPers || []);
      var nNp = Math.min(3, np.length), nCon = Math.min(6 - nNp, con.length);
      var lista = con.slice(0, nCon).map(function (p) { return { palabra: p, grupo: 'a' }; })
        .concat(np.slice(0, nNp).map(function (p) { return { palabra: p, grupo: 'b' }; }));
      return u.baraja(lista).map(function (it) {
        it.contexto = u.contextoDe(it.palabra);
        it.explica = '«' + u.esc(it.palabra) + '» ' + (it.grupo === 'a'
          ? 'te dice <strong>quién</strong> lo hace y <strong>cuándo</strong>: está conjugado.'
          : 'no dice ni quién ni cuándo. Es una <strong>forma no personal</strong>: infinitivo, gerundio o participio.');
        return it;
      });
    } },

  { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?', forma: 'tresOpciones',
    pista: 'Las tres palabras salen de esta misma lectura',
    items: function (t, u) {
      var ver = {};
      (t.verbos || []).forEach(function (p) { ver[u.clave(p)] = 1; });
      var candidatos = [];
      u.oraciones().forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (ver[u.clave(u.ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
        }
      });
      return u.baraja(candidatos).slice(0, 4).map(function (c) {
        var correcta = u.ps[c.pos].replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        var otros = u.baraja((t.verbos || []).filter(function (p) { return u.clave(p) !== u.clave(correcta); })).slice(0, 2);
        var ops = u.baraja([correcta].concat(otros));
        var frase = [];
        for (var i = c.ini; i <= c.fin; i++) {
          frase.push(i === c.pos ? u.HUECO + u.esc(u.ps[i].replace(/^[^.,;:!?»]*/, '')) : u.esc(u.ps[i]));
        }
        return {
          frase: frase.join(' '), ops: ops, c: ops.map(u.clave).indexOf(u.clave(correcta)),
          bien: 'Fíjate en cuánto cambia la oración según el verbo que se le ponga.',
          mal: 'La lectura decía <strong>«' + u.esc(correcta) + '»</strong>. Los otros dos también salen de este texto, ' +
            'pero decían otra acción.'
        };
      });
    } },
];

/* La hoja de respuestas del final: el texto entero con sus verbos. */
const LECTURA_VERBOS_RESUMEN = {
  titulo: '🏃 Todos los verbos de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'llegó', dice: 'conjugado' },
    { clase: 'b', txt: 'cortando', dice: 'no personal' }
  ],
  intro: function (t, u, cuenta) {
    return 'En un solo texto había <strong>' + cuenta.a + ' verbos conjugados</strong> y <strong>' + cuenta.b +
      ' formas no personales</strong>. El conjugado dice quién y cuándo; la forma no personal, no.';
  },
  marcar: function (t, u) {
    var con = {}, np = {};
    (t.verbos || []).forEach(function (p) { con[u.clave(p)] = 1; });
    (t.noPers || []).forEach(function (p) { np[u.clave(p)] = 1; });
    var out = [];
    u.ps.forEach(function (p, i) {
      var k = u.clave(p);
      if (con[k]) out.push({ ini: i, fin: i, clase: 'a' });
      else if (np[k]) out.push({ ini: i, fin: i, clase: 'b' });
    });
    return out;
  }
};
