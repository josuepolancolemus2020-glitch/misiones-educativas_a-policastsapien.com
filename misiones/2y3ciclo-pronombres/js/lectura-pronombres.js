/* ══════════════════════════════════════════════════════════════
   📖 CORPUS DE LECTURA — MISIÓN DE LOS PRONOMBRES

   ── Las dos clases que se clasifican salen de la misión ──
   La misión tiene «Pronombres Personales» por un lado y «Demostrativos
   y Posesivos» por otro. La actividad de clasificar usa ese mismo corte.

     pers    → yo, vos, me, te, se, le, nos, él, ella, mí, ti, usted…
     demPos  → esto, eso, aquello, el mío, la suya, lo nuestro…

   Los indefinidos y relativos (alguien, nadie, algo, nada, quien) van a
   `neutros`: SON pronombres —y la pantalla se lo dice al alumno,
   nombrándole la clase—, pero esta cacería busca las dos de arriba.

   ── Aquí se habla de VOS, como en Honduras ──
   La misión tiene una sección entera sobre el voseo. Sería raro que sus
   lecturas dijeran «tú tienes» cuando el niño oye «vos tenés» en su
   casa y en la calle. Los textos vosean con naturalidad.

   ── Una regla del corpus que no se puede saltar ──
   NO se usan «lo, la, los, las» como pronombre. Son artículo y pronombre
   según la oración, y el motor compara por FORMA, no por posición: en un
   mismo texto no pueden ser las dos cosas a la vez. Con «me, te, se, le,
   les, nos, él, ella, esto, eso, aquello» sobra material y ninguno es
   ambiguo. Esta regla es del corpus, no del motor.

   ── El validador comprueba que no falte ninguno ──
   Los pronombres son CLASE CERRADA (js/data/lectura-clases.js), así que
   `_dev/valida-lectura-mision.js` puede afirmar lo que con adjetivos o
   sustantivos no podía: si uno aparece en el texto y no está
   clasificado, lo canta. Un pronombre que falte es la pantalla
   diciéndole al alumno que se equivocó cuando acertó.

   Antes de publicar un cambio:
     node _dev/valida-lectura-mision.js
     node _dev/verifica-nombres-propios.js
     node _dev/verifica-impresion-lectura.js
══════════════════════════════════════════════════════════════ */

const LECTURA_PRONOMBRES = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LP4-01', titulo: 'El mandado de la esquina', genero: 'narrativo',
      texto: 'Mi mamá me dio veinte lempiras y me dijo: andá vos, que yo estoy cocinando. Salí corriendo. En la pulpería estaba don Beto y le pedí una libra de arroz. Él me preguntó si eso era todo y yo le contesté que sí. Entonces me di cuenta de que había perdido el billete en el camino. Se me puso la cara caliente. Don Beto me dijo tranquilo: esto no es problema, llevátelo y me pagás después. Volví a mi casa y le conté a mi mamá. Ella no se enojó: me dijo que eso le pasó a ella también, y que aquello no se olvida. Al día siguiente fuimos las dos y le pagamos.',
      pers: ['me', 'vos', 'yo', 'le', 'Él', 'Se', 'Ella'],
      demPos: ['eso', 'aquello', 'esto'],
      neutros: ['todo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le mandó a comprar la mamá?', r: 'Una libra de arroz.',
          o: ['Una libra de frijoles.', 'Una libra de arroz.', 'Pan y café.'], c: 1 },
        { tipo: 'literal', q: '¿Qué le dijo don Beto?', r: 'Que se lo llevara y le pagara después.',
          o: ['Que se lo llevara y le pagara después.', 'Que volviera con el dinero.', 'Que no podía fiarle.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hicieron al día siguiente?', r: 'Fueron las dos y le pagaron.',
          o: ['Buscaron el billete perdido.', 'Fueron las dos y le pagaron.', 'No volvieron a la pulpería.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se le puso la cara caliente?', r: 'Porque le dio vergüenza haber perdido el dinero.',
          o: ['Porque hacía mucho calor.', 'Porque venía corriendo.', 'Porque le dio vergüenza haber perdido el dinero.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué crees que don Beto le fio? Argumenta.', r: 'Respuesta abierta: se valora que hable de la confianza que se construye en un barrio.',
          o: ['Porque le sobraba el arroz.', 'Porque conoce a la familia y sabe que le van a pagar.', 'Porque le dio lástima.'], c: 1 },
      ] },

    { id: 'LP4-02', titulo: 'La bicicleta prestada', genero: 'narrativo',
      texto: 'Wilmer me prestó su bicicleta el sábado. Me dijo: cuidámela, que esa me la regaló mi papá. Yo le prometí que sí. Anduve toda la tarde con ella y en una bajada me caí. La cadena se salió y el timbre se quebró. No le avisé enseguida porque me dio miedo. El domingo se la llevé y le conté todo. Él se quedó callado un rato. Después me dijo que lo del timbre no era nada, pero que no avisarle sí le había dolido. Eso me quedó dando vueltas, y aquello que dijo se me grabó. Nunca más le escondí algo a un amigo.',
      pers: ['me', 'Yo', 'le', 'Él', 'se', 'ella'],
      demPos: ['esa', 'Eso', 'aquello'],
      neutros: ['todo', 'nada', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué se dañó en la caída?', r: 'La cadena se salió y el timbre se quebró.',
          o: ['Se torció el manubrio.', 'Se ponchó una llanta.', 'La cadena se salió y el timbre se quebró.'], c: 2 },
        { tipo: 'literal', q: '¿Por qué no avisó enseguida?', r: 'Porque le dio miedo.',
          o: ['Porque le dio miedo.', 'Porque no tenía teléfono.', 'Porque pensaba arreglarla.'], c: 0 },
        { tipo: 'literal', q: '¿Qué le dolió más a Wilmer?', r: 'Que no le hubiera avisado.',
          o: ['Que se quebrara el timbre.', 'Que le dañaran la cadena.', 'Que no le hubiera avisado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué Wilmer se quedó callado un rato?', r: 'Porque estaba pensando qué decir sin pelear.',
          o: ['Porque estaba pensando qué decir sin pelear.', 'Porque no lo había oído.', 'Porque estaba muy enojado para hablar.'], c: 0 },
        { tipo: 'critica', q: '¿Es peor romper algo prestado o esconderlo? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre el daño material y la confianza.',
          o: ['Romperlo: eso cuesta dinero.', 'Esconderlo: lo roto se arregla y la confianza cuesta más.', 'Las dos cosas son iguales.'], c: 1 },
      ] },

    { id: 'LP4-03', titulo: 'Esa es la mía', genero: 'narrativo',
      texto: 'En la escuela nos dieron una planta a cada uno. Nos dijeron: esta es tuya, vos la cuidás. La mía era la más chiquita de todas. Alexis se burló de mí y me dijo que la suya iba a crecer primero. Yo no le contesté nada. Regué la mía todos los días y le puse una piedra al lado para que no se cayera. A los dos meses la de él se secó porque se le olvidaba regarla. La mía todavía está allá, junto a la cancha. Cuando alguien pregunta cuál es, yo digo: aquella, la del rincón. Esa es la mía.',
      pers: ['nos', 'vos', 'se', 'mí', 'me', 'Yo', 'le', 'él'],
      demPos: ['esta', 'tuya', 'mía', 'suya', 'aquella', 'Esa'],
      neutros: ['nada', 'alguien', 'todas', 'todos'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo era la planta del narrador?', r: 'La más chiquita de todas.',
          o: ['Igual a las demás.', 'La más grande.', 'La más chiquita de todas.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le puso al lado?', r: 'Una piedra, para que no se cayera.',
          o: ['Una piedra, para que no se cayera.', 'Un palito.', 'Un letrero con su nombre.'], c: 0 },
        { tipo: 'literal', q: '¿Qué pasó con la planta de Alexis?', r: 'Se secó porque se le olvidaba regarla.',
          o: ['Se secó porque se le olvidaba regarla.', 'Creció más rápido.', 'Se la robaron.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el narrador no le contestó nada a Alexis?', r: 'Porque prefirió demostrarlo cuidando su planta en vez de discutir.',
          o: ['Porque prefirió demostrarlo cuidando su planta en vez de discutir.', 'Porque le tenía miedo.', 'Porque no lo escuchó.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué el tamaño inicial no decidió el resultado? Argumenta.', r: 'Respuesta abierta: se valora que relacione el cuidado sostenido con el resultado.',
          o: ['Porque la chiquita era de mejor calidad.', 'Porque fue pura suerte.', 'Porque lo que decidió fue el cuidado de todos los días.'], c: 2 },
      ] },

    { id: 'LP4-04', titulo: 'Ustedes se turnan', genero: 'instructivo',
      texto: 'Si son tres para lavar los trastes, no se peleen: túrnense. Uno enjabona, otro enjuaga y el tercero seca y guarda. A la semana siguiente se cambian, para que a nadie le toque siempre lo peor. Pónganse de acuerdo antes, no después, porque después ya alguien está enojado. Si uno no cumple, no le griten: recuérdenselo una vez, tranquilos. Y si de plano no quiere, díganselo a su mamá sin pelear delante de ella. Uno se queja de esto y otro de aquello, y eso cansa. Esto que parece un asunto de trastes en realidad les enseña algo que van a usar toda la vida: repartir el trabajo sin que nadie se sienta usado.',
      pers: ['se', 'le', 'les', 'su', 'ella'],
      demPos: ['Esto', 'aquello', 'eso'],
      neutros: ['nadie', 'alguien', 'algo', 'Uno', 'otro'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuáles son las tres tareas?', r: 'Enjabonar, enjuagar, y secar y guardar.',
          o: ['Enjabonar, enjuagar, y secar y guardar.', 'Lavar, barrer y ordenar.', 'Cocinar, servir y lavar.'], c: 0 },
        { tipo: 'literal', q: '¿Cada cuánto se cambian?', r: 'A la semana siguiente.',
          o: ['Cada día.', 'Cada mes.', 'A la semana siguiente.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hay que hacer si uno no cumple?', r: 'Recordárselo una vez, tranquilos, sin gritarle.',
          o: ['Acusarlo enseguida.', 'Hacer su parte sin decir nada.', 'Recordárselo una vez, tranquilos, sin gritarle.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué hay que ponerse de acuerdo antes y no después?', r: 'Porque después ya hay alguien enojado y cuesta más acordar.',
          o: ['Porque después ya hay alguien enojado y cuesta más acordar.', 'Porque después no hay tiempo.', 'Porque antes es más fácil olvidarse.'], c: 0 },
        { tipo: 'critica', q: '¿Qué se aprende repartiendo tareas en la casa? Argumenta.', r: 'Respuesta abierta: se valora que traslade la idea a otros ámbitos —grupo de clase, trabajo—.',
          o: ['Nada: son solo trastes.', 'A repartir el trabajo sin que nadie se sienta usado, que sirve toda la vida.', 'A lavar más rápido.'], c: 1 },
      ] },

    { id: 'LP4-05', titulo: 'Él y yo en la parada', genero: 'narrativo',
      texto: 'Todas las mañanas espero el bus con un señor que nunca me habla. Él llega primero y se para siempre en la misma baldosa. Yo me pongo detrás de él. Un día el bus no vino y nos quedamos los dos ahí, media hora. Entonces él me preguntó para dónde iba yo. Le dije que al colegio. Me contó que su hija estudió ahí hace años y que ahora vive lejos. Nos reímos de algo, no me acuerdo de qué. Aquello fue raro: esa risa nos dejó distintos. Desde ese día siempre nos saludamos. Todavía no sé cómo se llama y él tampoco me ha preguntado mi nombre.',
      pers: ['me', 'Él', 'se', 'Yo', 'nos', 'Le', 'su'],
      demPos: ['ese', 'Aquello', 'esa'],
      neutros: ['algo', 'tampoco'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde se para siempre el señor?', r: 'En la misma baldosa.',
          o: ['Dentro de la caseta.', 'Bajo el árbol.', 'En la misma baldosa.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le contó el señor?', r: 'Que su hija estudió ahí hace años y ahora vive lejos.',
          o: ['Que su hija estudió ahí hace años y ahora vive lejos.', 'Que él trabajaba en el colegio.', 'Que el bus siempre se atrasa.'], c: 0 },
        { tipo: 'literal', q: '¿Saben cómo se llaman?', r: 'No: ninguno le ha preguntado el nombre al otro.',
          o: ['Sí, se presentaron ese día.', 'No: ninguno le ha preguntado el nombre al otro.', 'Solo el señor sabe el nombre.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué cambió después de aquella media hora?', r: 'Que desde entonces se saludan todos los días.',
          o: ['Que ahora viajan juntos.', 'Que desde entonces se saludan todos los días.', 'Que el señor cambió de parada.'], c: 1 },
        { tipo: 'critica', q: '¿Hace falta saber el nombre de alguien para tener trato con él? Argumenta.', r: 'Respuesta abierta: se valora que reconozca formas de vínculo que no dependen del nombre.',
          o: ['Sí: sin nombre no hay relación.', 'No siempre: hay tratos diarios que se sostienen sin eso.', 'Solo si se ven mucho.'], c: 1 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LP5-01', titulo: 'Lo nuestro y lo de todos', genero: 'narrativo',
      texto: 'El patronato compró unas sillas plásticas para la casa comunal. Al principio cada quien se llevaba una prestada y no la devolvía. Doña Alba dijo en la reunión: si esto es de todos, entonces no es de nadie, y así se nos va a acabar. Nos propuso algo sencillo. Pintaron todas las sillas de un solo color, que nadie tiene en su casa, y colgaron una lista donde uno anota su nombre cuando se lleva alguna. Ella misma se encargó al principio. Ahora se encarga otra señora, porque se turnan cada tres meses. En dos años no se ha perdido ni una. Doña Alba, a quien todos le hacen caso, dice que el truco no fue la pintura ni aquello del color: fue que alguien se hiciera cargo. Esa es la parte que cuesta.',
      pers: ['se', 'nos', 'Ella', 'su', 'le'],
      demPos: ['esto', 'aquello', 'Esa'],
      neutros: ['nadie', 'algo', 'alguien', 'todos', 'todas', 'alguna', 'otra', 'misma', 'quien'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hicieron con las sillas?', r: 'Las pintaron de un solo color que nadie tiene en su casa.',
          o: ['Las pintaron de un solo color que nadie tiene en su casa.', 'Les pusieron candado.', 'Las guardaron bajo llave.'], c: 0 },
        { tipo: 'literal', q: '¿Cada cuánto se turnan las encargadas?', r: 'Cada tres meses.',
          o: ['Cada año.', 'Cada semana.', 'Cada tres meses.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiso decir doña Alba con «si es de todos, no es de nadie»?', r: 'Que sin alguien responsable, nadie cuida lo común.',
          o: ['Que había que vender las sillas.', 'Que sin alguien responsable, nadie cuida lo común.', 'Que el patronato se equivocó al comprarlas.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué dice que el truco no fue la pintura?', r: 'Porque lo que funcionó fue que alguien se hiciera cargo, no el color.',
          o: ['Porque lo que funcionó fue que alguien se hiciera cargo.', 'Porque el color era feo.', 'Porque la pintura se despintó.'], c: 0 },
        { tipo: 'critica', q: '¿Qué se necesita para cuidar algo que es de todos? Propón algo.', r: 'Respuesta abierta: se valora que proponga una medida concreta —turnos, registro, responsable— y no solo buena voluntad.',
          o: ['Que la gente sea más honrada.', 'Un candado y una multa.', 'Un responsable con nombre y un registro sencillo que rote.'], c: 2 },
      ] },

    { id: 'LP5-02', titulo: 'Vos sabés más de lo que creés', genero: 'narrativo',
      texto: 'Marlon reprobó Matemáticas en el primer parcial y se convenció de que él era malo para eso. La profesora lo notó y un día lo llamó aparte. No le explicó ningún tema. Le preguntó cómo hacía él las cuentas cuando vendía pan los domingos con su abuela. Marlon le contó: primero junto los billetes iguales, después cuento de cinco en cinco y al final me acuerdo de lo que ya di de vuelto. Ella le dijo: eso que hacés es exactamente lo que no te sale en el examen, pero ahí lo hacés bien y rapidísimo. A él se le quedó grabado aquello, y esa frase la repite todavía. No se volvió el mejor de la clase, pero dejó de decir que era malo, y con eso le alcanzó para seguir intentando.',
      pers: ['se', 'él', 'le', 'su', 'me', 'Ella', 'te'],
      demPos: ['eso', 'aquello', 'esa'],
      neutros: ['ningún', 'mejor'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le preguntó la profesora?', r: 'Cómo hacía las cuentas cuando vendía pan con su abuela.',
          o: ['Si quería repetir el examen.', 'Por qué había reprobado.', 'Cómo hacía las cuentas cuando vendía pan con su abuela.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hacía Marlon primero al vender?', r: 'Juntaba los billetes iguales.',
          o: ['Contaba de cinco en cinco.', 'Juntaba los billetes iguales.', 'Anotaba en un cuaderno.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la profesora no le explicó ningún tema?', r: 'Porque el problema no era el tema, era lo que él creía de sí mismo.',
          o: ['Porque no le alcanzaba el tiempo.', 'Porque el problema no era el tema, era lo que él creía de sí mismo.', 'Porque ya se lo había explicado antes.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué cambió en Marlon después de aquella conversación?', r: 'Dejó de decir que era malo y siguió intentando.',
          o: ['Dejó de decir que era malo y siguió intentando.', 'Empezó a vender más pan.', 'Se volvió el mejor de la clase.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué creer que uno «es malo» para algo hace daño? Argumenta.', r: 'Respuesta abierta: se valora que note que esa creencia hace abandonar antes de intentar.',
          o: ['Porque quien se cree incapaz deja de intentar, y así nunca mejora.', 'Porque los demás se burlan.', 'Porque baja las notas.'], c: 0 },
      ] },

    { id: 'LP5-03', titulo: 'Nos tocó a nosotros', genero: 'narrativo',
      texto: 'Cuando el río se llevó el puente de hamaca, los de este lado nos quedamos sin paso. Los del otro lado nos gritaban desde allá y nosotros les gritábamos de vuelta, pero nadie oía nada con el ruido del agua. Al segundo día ellos amarraron una botella a una cuerda delgada y nos la tiraron. Se cayó tres veces. A la cuarta la agarramos. Con esa cuerda pasamos otra más gruesa, y con aquella pasamos el cable. Nadie dirigió nada: cada quien hizo lo que le tocaba. Cuando por fin cruzó el primero, del otro lado aplaudieron. Mi tío dice que ese día entendió algo: no nos ayudaron ellos ni les ayudamos nosotros. Nos ayudamos.',
      pers: ['se', 'nos', 'nosotros', 'les', 'ellos', 'le'],
      demPos: ['este', 'esa', 'aquella', 'ese'],
      neutros: ['nadie', 'nada', 'algo', 'otro', 'otra', 'cada', 'quien'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué amarraron a la cuerda delgada?', r: 'Una botella.',
          o: ['Una botella.', 'Una piedra.', 'Un palo.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántas veces se cayó antes de que la agarraran?', r: 'Tres.',
          o: ['Una.', 'Cinco.', 'Tres.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué pasaron primero una cuerda delgada?', r: 'Porque una delgada se puede tirar lejos y con ella se jala luego la gruesa.',
          o: ['Porque era la única que tenían.', 'Porque una delgada se puede tirar lejos y con ella se jala la gruesa.', 'Porque pesaba menos que el cable.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiso decir el tío con «nos ayudamos»?', r: 'Que no hubo quien diera ni quien recibiera: hicieron falta los dos lados.',
          o: ['Que no hubo quien diera ni quien recibiera: hicieron falta los dos lados.', 'Que nadie ayudó a nadie.', 'Que se ayudaron por turnos.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué funcionó si «nadie dirigió nada»? Argumenta.', r: 'Respuesta abierta: se valora que note que la urgencia clara y la tarea evidente pueden reemplazar al jefe, sin negar que a veces hace falta.',
          o: ['Porque tuvieron suerte.', 'Porque en realidad sí había un jefe.', 'Porque la tarea era clara y cada quien vio qué le tocaba.'], c: 2 },
      ] },

    { id: 'LP5-04', titulo: 'La carta que él nunca mandó', genero: 'narrativo',
      texto: 'Mi abuelo guardaba una carta en su Biblia. Nunca nos la enseñó. Cuando él murió, mi mamá la encontró y nos la leyó a todos. Era para su hermano, con quien se había peleado hacía cuarenta años por un pedazo de tierra. En ella le pedía perdón y le decía que aquello no valía lo que les había costado. La escribió, la dobló y la guardó. Nunca se la mandó. Mi mamá se quedó callada un rato y después dijo algo que nos dejó pensando: él sí lo resolvió por dentro, y eso no se lo puede quitar nadie; lo que no hizo fue avisarle al otro. Esa parte, dijo ella, ya no la puede hacer nadie por él, y esto nos toca aprenderlo.',
      pers: ['se', 'nos', 'él', 'su', 'le', 'les', 'ella'],
      demPos: ['aquello', 'eso', 'Esa', 'esto'],
      neutros: ['nadie', 'algo', 'todos', 'quien', 'otro'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde guardaba la carta el abuelo?', r: 'En su Biblia.',
          o: ['Debajo del colchón.', 'En un baúl.', 'En su Biblia.'], c: 2 },
        { tipo: 'literal', q: '¿Por qué se habían peleado los hermanos?', r: 'Por un pedazo de tierra.',
          o: ['Por una herencia de dinero.', 'Por un pedazo de tierra.', 'Por una discusión familiar.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la escribió y no la mandó?', r: 'Porque le costó menos resolverlo por dentro que dar el paso frente a su hermano.',
          o: ['Porque no sabía la dirección.', 'Porque le costó menos resolverlo por dentro que dar el paso frente a su hermano.', 'Porque su hermano ya había muerto.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué distinguió la mamá en lo que hizo el abuelo?', r: 'Que perdonar por dentro y avisarle al otro son dos cosas distintas.',
          o: ['Que la carta estaba mal escrita.', 'Que perdonar por dentro y avisarle al otro son dos cosas distintas.', 'Que el abuelo nunca perdonó.'], c: 1 },
        { tipo: 'critica', q: '¿Sirve de algo un perdón que el otro nunca supo? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga el efecto en quien perdona del efecto en la relación.',
          o: ['Le sirvió a él, pero no reparó lo que estaba roto entre los dos.', 'No sirve de nada si el otro no lo sabe.', 'Sirve igual: lo importante es sentirlo.'], c: 0 },
      ] },

    { id: 'LP5-05', titulo: 'Se lo dije a ella primero', genero: 'narrativo',
      texto: 'Cuando me dieron la beca, la primera a quien se lo conté fue a mi maestra de sexto, no a mis papás. Todavía me da pena admitirlo. Ella fue la que me dijo, hace cuatro años, que yo servía para estudiar, cuando ni yo mismo me lo creía. Le mandé un mensaje ese mismo día. Me contestó con una sola línea: ya lo sabía. Después, en la casa, se lo dije a mi mamá y ella lloró. Mi papá no dijo nada, pero al otro día llegó con un cuaderno nuevo y me lo puso en la mesa sin hablar. Cada quien lo celebró como pudo: esto de una manera, aquello de otra. Esa fue la mía.',
      pers: ['me', 'se', 'Ella', 'yo', 'Le'],
      demPos: ['ese', 'esto', 'aquello', 'Esa', 'mía'],
      neutros: ['nada', 'quien', 'mismo', 'otro', 'cada'],
      preguntas: [
        { tipo: 'literal', q: '¿A quién se lo contó primero?', r: 'A su maestra de sexto.',
          o: ['A su papá.', 'A su mamá.', 'A su maestra de sexto.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le contestó la maestra?', r: 'Una sola línea: ya lo sabía.',
          o: ['Que la felicitaba mucho.', 'No le contestó.', 'Una sola línea: ya lo sabía.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué le da pena admitir a quién se lo dijo primero?', r: 'Porque siente que debía haber sido a sus papás.',
          o: ['Porque la maestra ya no da clases.', 'Porque siente que debía haber sido a sus papás.', 'Porque le contestó muy corto.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué significó el cuaderno del papá?', r: 'Fue su manera de celebrar, sin palabras.',
          o: ['Fue su manera de celebrar, sin palabras.', 'Que no le importaba la beca.', 'Que quería que estudiara más.'], c: 0 },
        { tipo: 'critica', q: '¿Todas las formas de celebrar valen igual? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca distintas maneras de expresar afecto sin jerarquizarlas de golpe.',
          o: ['Valen distinto para cada quien, y ninguna es la única correcta.', 'No: hay que decirlo con palabras.', 'Sí, todas son exactamente iguales.'], c: 0 },
      ] },
  ],
};
