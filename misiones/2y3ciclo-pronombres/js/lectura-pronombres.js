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

   ── Los inventarios NO se escriben: se calculan ──
   De 6º en adelante, `pers`, `demPos` y `neutros` salieron de recorrer el
   texto contra la clase cerrada, no de una lista escrita a mano. La
   clasificación es determinista y no admite criterio: «me, te, se, le,
   les, nos, yo, vos, él, ella…» son SIEMPRE personales; «esto, eso,
   aquello, mío, tuyo, suyo…» son SIEMPRE demostrativos o posesivos; y
   «alguien, nadie, algo, nada, quien» son pronombres de otra clase, así
   que van a neutros. Donde no hay criterio que aplicar, escribir a mano
   solo añade erratas — es la misma razón por la que la misión de los
   números no escribe sus cifras.

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

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LP6-01', titulo: 'El que se quedó cuidando', genero: 'narrativo',
      texto: 'Cuando mi abuela se enfermó, éramos cuatro nietos y todos dijimos que íbamos a turnarnos. Yo lo dije primero y en voz alta. Al final se quedó Denis, el más callado, que ni siquiera lo había prometido. Él pidió permiso en su trabajo y durmió tres meses en una silla. Nosotros llegábamos los domingos, le llevábamos algo y nos íbamos. Cuando ella murió, nadie se lo agradeció a él delante de los demás, y a mí eso todavía me pesa. Un día se lo dije. Denis me contestó que no lo había hecho por nosotros ni para que alguien se lo reconociera: lo hizo porque ella lo crio a él cuando su mamá se fue. Eso me cerró la boca y me la abrió al mismo tiempo. Aquello no era un favor suyo: era algo que él le debía a ella, y solo él lo sabía.',
      pers: ['se', 'Yo', 'Él', 'Nosotros', 'le', 'nos', 'ella', 'mí', 'me'],
      demPos: ['eso', 'Aquello', 'suyo'],
      neutros: ['algo', 'nadie', 'alguien'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto tiempo durmió Denis en una silla?', r: 'Tres meses.',
          o: ['Un año.', 'Tres semanas.', 'Tres meses.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hacían los demás nietos los domingos?', r: 'Llegaban, le llevaban algo y se iban.',
          o: ['Se quedaban toda la noche.', 'Llegaban, le llevaban algo y se iban.', 'No llegaban nunca.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué al narrador le pesa lo que pasó?', r: 'Porque prometió en voz alta y no cumplió, y encima nadie le agradeció a Denis.',
          o: ['Porque no quería a su abuela.', 'Porque Denis se quedó con la casa.', 'Porque prometió en voz alta, no cumplió y nadie le agradeció a Denis.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué lo hizo Denis, según él mismo?', r: 'Porque ella lo crio cuando su mamá se fue.',
          o: ['Porque era el que tenía más tiempo.', 'Porque se lo pidieron los demás.', 'Porque ella lo crio cuando su mamá se fue.'], c: 2 },
        { tipo: 'critica', q: '¿Vale más prometer en voz alta o cumplir en silencio? Argumenta.', r: 'Respuesta abierta: se valora que sostenga su postura sin caer en el lugar común.',
          o: ['Prometer: así los demás saben con quién contar.', 'Cumplir: la promesa sin cumplimiento no le sirve a nadie.', 'Las dos cosas dan igual.'], c: 1 },
      ] },

    { id: 'LP6-02', titulo: 'Nos cambiaron de maestro', genero: 'narrativo',
      texto: 'A mitad de año nos cambiaron al profesor de Español y nos dieron a otro que nadie conocía. Nosotros lo recibimos mal a propósito. No le contestábamos, nos hacíamos los sordos y alguien le escondió el borrador. Él nunca nos gritó. Un lunes llegó y nos dijo: yo sé que ustedes querían al otro; a mí me pasó lo mismo cuando me cambiaron de escuela. Después nos preguntó qué era lo que más nos gustaba de él. Se lo dijimos. Él anotó todo eso en su cuaderno y lo fue haciendo poco a poco, a su manera. En diciembre le hicimos una tarjeta. La firmamos los treinta y dos. Nadie propuso quién la escribía: se nos ocurrió a todos casi al mismo tiempo. Aquello fue raro, y eso todavía lo comentamos. La letra de adentro es mía.',
      pers: ['nos', 'Nosotros', 'le', 'Él', 'yo', 'ustedes', 'mí', 'me', 'Se'],
      demPos: ['eso', 'Aquello', 'mía'],
      neutros: ['nadie', 'alguien'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hacían al principio con el maestro nuevo?', r: 'No le contestaban, se hacían los sordos y le escondieron el borrador.',
          o: ['No le contestaban y le escondieron el borrador.', 'Le hacían preguntas difíciles.', 'Se cambiaron de sección.'], c: 0 },
        { tipo: 'literal', q: '¿Qué les preguntó el maestro un lunes?', r: 'Qué era lo que más les gustaba del maestro anterior.',
          o: ['Por qué se portaban mal.', 'Qué era lo que más les gustaba del maestro anterior.', 'Quién había escondido el borrador.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué les contó que a él le había pasado lo mismo?', r: 'Para mostrarles que entendía lo que sentían, en vez de castigarlos.',
          o: ['Para que le tuvieran lástima.', 'Para cambiar de tema.', 'Para mostrarles que entendía lo que sentían, en vez de castigarlos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué muestra que nadie propusiera quién escribía la tarjeta?', r: 'Que el cambio de trato ya era de todo el grupo, sin que nadie lo dirigiera.',
          o: ['Que estaban desorganizados.', 'Que el maestro se los pidió.', 'Que el cambio de trato ya era de todo el grupo, sin que nadie lo dirigiera.'], c: 2 },
        { tipo: 'critica', q: '¿Qué habría pasado si él les hubiera gritado? Argumenta.', r: 'Respuesta abierta: se valora que imagine la consecuencia y la contraste con lo que sí ocurrió.',
          o: ['Habría confirmado que era el enemigo, y la pelea se alarga.', 'Se habrían callado y ya.', 'Habrían aprendido a respetar.'], c: 0 },
      ] },

    { id: 'LP6-03', titulo: 'Lo mío y lo tuyo en un cuarto', genero: 'expositivo',
      texto: 'Compartir cuarto con un hermano se arregla con una conversación, no con una raya en el piso. Primero conviene separar lo que es de cada quien: esto es mío, aquello es tuyo, y lo demás es de los dos. Después se acuerda lo difícil, que nunca son las cosas sino los horarios. A qué hora se apaga la luz, quién puede traer visita y hasta cuándo. Si a vos te molesta el ruido y a él no, díganselo sin pelear y busquen un arreglo: audífonos, una hora tope, lo que sea. Lo que no funciona es aguantarse callado. El que se aguanta va juntando y un día explota por algo pequeño, y entonces el otro ni entiende qué le pasó. Casi siempre eso es lo que rompe a dos que se quieren bien.',
      pers: ['se', 'vos', 'te', 'él', 'le'],
      demPos: ['esto', 'mío', 'aquello', 'tuyo', 'eso'],
      neutros: ['quien', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué conviene separar primero?', r: 'Lo que es de cada quien y lo que es de los dos.',
          o: ['Las camas y los muebles.', 'Lo que es de cada quien y lo que es de los dos.', 'La ropa sucia de la limpia.'], c: 1 },
        { tipo: 'literal', q: '¿Qué es lo difícil de acordar, según el texto?', r: 'Los horarios, no las cosas.',
          o: ['Los horarios, no las cosas.', 'El espacio del clóset.', 'Quién limpia.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué no funciona aguantarse callado?', r: 'Porque uno va juntando y después explota por algo pequeño.',
          o: ['Porque el otro nunca se da cuenta.', 'Porque es de mala educación.', 'Porque uno va juntando y después explota por algo pequeño.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el otro «ni entiende qué le pasó»?', r: 'Porque nunca le avisaron de lo que se venía acumulando.',
          o: ['Porque nunca le avisaron de lo que se venía acumulando.', 'Porque no le importa.', 'Porque no estaba prestando atención.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve una raya en el piso? Defiende tu postura.', r: 'Respuesta abierta: se valora que note que el reparto físico no resuelve el problema de fondo.',
          o: ['Sí: así cada quien sabe su lugar.', 'Sirve poco: el problema no es el espacio, son los acuerdos.', 'No sirve para nada.'], c: 1 },
      ] },

    { id: 'LP6-04', titulo: 'El préstamo entre hermanas', genero: 'narrativo',
      texto: 'Mi hermana mayor me prestó dinero para el pasaje cuando entré al instituto. Nunca me dijo cuánto le debía. Yo llevaba la cuenta en un papel: esto de marzo, aquello de abril, y así. Cuando empecé a trabajar quise pagarle todo de una vez. Ella no me lo aceptó. Me dijo que a ella se lo había prestado una tía y que tampoco se lo cobró nunca, que eso funcionaba así entre nosotras: uno le devuelve a quien viene atrás, no a quien viene adelante. Me costó entenderlo. Este año le presté a mi prima para su matrícula. Ella me preguntó cuándo se lo pagaba y yo le contesté eso mismo que me contestaron a mí: que aquello no era mío ni suyo, sino de la que venga después. Se quedó igual de confundida que yo.',
      pers: ['me', 'le', 'Yo', 'Ella', 'se', 'nosotras', 'mí'],
      demPos: ['esto', 'aquello', 'eso', 'mío', 'suyo'],
      neutros: ['quien'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo llevaba la cuenta el narrador?', r: 'En un papel, anotando cada préstamo.',
          o: ['En el celular.', 'De memoria.', 'En un papel, anotando cada préstamo.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le contestó la hermana cuando quiso pagarle?', r: 'Que no se lo aceptaba.',
          o: ['Que se lo pagara en cuotas.', 'Que no se lo aceptaba.', 'Que le pagara el doble.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué regla explicó la hermana?', r: 'Que uno le devuelve a quien viene atrás, no a quien le prestó.',
          o: ['Que entre familia no se cobra nunca.', 'Que uno le devuelve a quien viene atrás, no a quien le prestó.', 'Que hay que anotarlo todo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la prima se quedó confundida?', r: 'Porque es una regla que cuesta entender la primera vez, como le costó al narrador.',
          o: ['Porque no le alcanzaba el dinero.', 'Porque es una regla que cuesta entender la primera vez.', 'Porque no confiaba en el narrador.'], c: 1 },
        { tipo: 'critica', q: '¿Funciona esa manera de prestar? Defiende tu postura.', r: 'Respuesta abierta: se valora que note lo que sostiene esa cadena y también lo que puede romperla.',
          o: ['Funciona mientras cada quien pase adelante lo que recibió.', 'No: así nadie devuelve nunca.', 'Sí, siempre y en todo caso.'], c: 0 },
      ] },

    { id: 'LP6-05', titulo: 'Se lo prometí a él', genero: 'narrativo',
      texto: 'Mi papá se fue a trabajar a otro país cuando yo tenía nueve años. La última noche me hizo prometerle algo raro: no que sacara buenas notas, sino que le contara la verdad siempre, aunque a él no le gustara. Yo se lo prometí sin entenderlo. A los trece reprobé dos clases y quise esconderlo. Nadie de la casa se lo iba a decir. Pero me acordé de aquello y se lo conté yo mismo por teléfono. Él se quedó callado un rato largo. Después me dijo: eso que acabás de hacer vale más que las dos clases. No me regañó ni ese día ni después. Yo creo que él sabía desde el principio que lo difícil no iba a ser el estudio: era esto otro, aquello que no se ve por teléfono. La promesa era suya, pero el trabajo fue mío.',
      pers: ['se', 'yo', 'me', 'le', 'él'],
      demPos: ['aquello', 'eso', 'esto', 'suya', 'mío'],
      neutros: ['algo', 'Nadie'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le hizo prometer el papá?', r: 'Contarle la verdad siempre, aunque no le gustara.',
          o: ['Contarle la verdad siempre, aunque no le gustara.', 'Sacar buenas notas.', 'Cuidar a su mamá.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hizo el narrador a los trece años?', r: 'Le contó él mismo por teléfono que había reprobado.',
          o: ['Le contó él mismo por teléfono que había reprobado.', 'Escondió las notas.', 'Le pidió a su mamá que se lo dijera.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el papá pidió esa promesa y no otra?', r: 'Porque sabía que lo difícil de la distancia iba a ser la confianza, no el estudio.',
          o: ['Porque sabía que lo difícil iba a ser la confianza, no el estudio.', 'Porque no le importaban las notas.', 'Porque no podía revisar sus notas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se quedó callado un rato largo?', r: 'Porque estaba entendiendo que su hijo había cumplido justo lo que le pidió.',
          o: ['Porque estaba enojado.', 'Porque se cortó la llamada.', 'Porque estaba entendiendo que su hijo cumplió justo lo que le pidió.'], c: 2 },
        { tipo: 'critica', q: '¿Fue buena idea no regañarlo? Argumenta.', r: 'Respuesta abierta: se valora que relacione el castigo con lo que se quiere sostener a futuro.',
          o: ['Sí: castigar la verdad enseña a esconderla la próxima vez.', 'No: reprobar dos clases merece regaño.', 'Da igual, estaba lejos.'], c: 0 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LP7-01', titulo: 'La disculpa que nadie pidió', genero: 'narrativo',
      texto: 'En el equipo se armó un pleito por una falta en un entrenamiento. Kevin le entró fuerte a Josué y Josué le devolvió con el codo. El entrenador nos paró a todos y nos dijo: ustedes dos, arreglen esto ahora, delante de nosotros. Ninguno quiso hablar primero. Estuvimos ahí parados como diez minutos, en silencio, todos incómodos. Entonces Kevin dijo una cosa que no era exactamente una disculpa: yo no te quise pegar, se me fue la pierna. Josué le contestó igual de torcido: a mí también se me fue el codo. Se dieron la mano. El entrenador no les exigió más y siguió el entrenamiento. Después nos explicó por qué: si él los obligaba a decir la frase exacta, se la iban a decir a él y no entre ellos. Eso no le sirve a nadie. Aquello que dijeron era torcido, sí, pero era suyo y no mío ni de él: por eso funcionó.',
      pers: ['se', 'le', 'nos', 'ustedes', 'nosotros', 'yo', 'te', 'me', 'mí', 'les', 'él', 'ellos'],
      demPos: ['esto', 'Eso', 'Aquello', 'suyo', 'mío'],
      neutros: ['nadie'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué les pidió el entrenador?', r: 'Que lo arreglaran ahí mismo, delante de todos.',
          o: ['Que se fueran del entrenamiento.', 'Que se disculparan por escrito.', 'Que lo arreglaran ahí mismo, delante de todos.'], c: 2 },
        { tipo: 'literal', q: '¿Qué dijo Kevin?', r: 'Que no quiso pegarle, que se le fue la pierna.',
          o: ['Que Josué tenía la culpa.', 'Que no quiso pegarle, que se le fue la pierna.', 'Pidió perdón formalmente.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el entrenador no exigió una disculpa exacta?', r: 'Porque entonces se la habrían dicho a él y no el uno al otro.',
          o: ['Porque entonces se la habrían dicho a él y no el uno al otro.', 'Porque no tenía tiempo.', 'Porque le daba igual el pleito.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué los diez minutos de silencio importaban?', r: 'Porque los dejó sin salida cómoda hasta que uno decidió hablar por su cuenta.',
          o: ['Porque los dejó sin salida cómoda hasta que uno decidió hablar solo.', 'Porque el equipo se aburrió.', 'Porque los cansó y se rindieron.'], c: 0 },
        { tipo: 'critica', q: '¿Cuenta como disculpa lo que dijeron? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta la forma frente al efecto real entre los dos.',
          o: ['Cuenta: cada uno reconoció su parte con sus palabras, y quedaron bien.', 'No: no dijeron «perdón» y eso no vale.', 'Solo si el entrenador lo aprueba.'], c: 0 },
      ] },

    { id: 'LP7-02', titulo: 'Ustedes deciden', genero: 'narrativo',
      texto: 'La directora nos reunió a los de noveno y nos dijo algo que no esperábamos: el dinero de la excursión ya está, ustedes deciden en qué se gasta. Nos dio dos opciones y nos dejó solos en el aula. Al principio nadie hablaba y después hablábamos todos a la vez. Karen propuso votar de una vez; Eduardo dijo que no, que primero convenía oír a quien no había hablado. Le hicimos caso. Ahí salió que a tres compañeros el paseo largo no les servía porque ese día trabajaban. Nadie lo sabía. Al final elegimos la opción más corta, que ni siquiera era la que más votos tenía al principio. Cuando ella volvió, nos preguntó cómo lo habíamos decidido. Se lo contamos. Nos dijo que eso era exactamente lo que quería enseñarnos, y que la excursión era lo de menos. Aquello me quedó dando vueltas: la decisión fue nuestra de verdad, no suya, y eso se siente distinto. La firma de abajo es mía.',
      pers: ['nos', 'ustedes', 'se', 'Le', 'les', 'ella', 'me'],
      demPos: ['eso', 'Aquello', 'suya', 'mía'],
      neutros: ['algo', 'nadie', 'quien'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué propuso Eduardo?', r: 'Oír primero a quien no había hablado.',
          o: ['Votar de una vez.', 'Oír primero a quien no había hablado.', 'Preguntarle a la directora.'], c: 1 },
        { tipo: 'literal', q: '¿Qué opción eligieron al final?', r: 'La más corta.',
          o: ['La más larga.', 'La más corta.', 'Ninguna de las dos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué cambió la decisión después de oír a los callados?', r: 'Porque salió que a tres el paseo largo no les servía, y eso nadie lo sabía.',
          o: ['Porque Karen cambió de opinión.', 'Porque la directora los presionó.', 'Porque salió que a tres el paseo largo no les servía.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiso decir la directora con que «la excursión era lo de menos»?', r: 'Que lo importante era aprender a decidir juntos, no el paseo.',
          o: ['Que lo importante era aprender a decidir juntos.', 'Que se podía cancelar sin problema.', 'Que la excursión no le importaba.'], c: 0 },
        { tipo: 'critica', q: '¿Es mejor votar de una vez o escuchar primero? Argumenta.', r: 'Respuesta abierta: se valora que reconozca lo que cada método aporta y cuesta.',
          o: ['Votar: es rápido y es lo justo.', 'Da igual, gana la mayoría.', 'Escuchar primero: la votación temprana esconde lo que nadie dijo aún.'], c: 2 },
      ] },

    { id: 'LP7-03', titulo: 'El chisme que me llegó', genero: 'narrativo',
      texto: 'A mí me llegó de tercera mano: que ella había dicho que yo era una interesada. Me lo contó una prima, que se lo había contado otra, que decía que se lo oyó a alguien más. Yo me enojé todo el día y ya tenía pensado lo que le iba a decir. En la noche mi mamá me preguntó una cosa que me desarmó: ¿y vos se lo vas a reclamar a ella o a la que te lo contó? Porque la que lo dijo, si lo dijo, es una; la que te lo trajo hasta aquí es otra. Al otro día le pregunté a ella, directo y sin adorno. Me dijo que nunca lo había dicho, y le creí. Después me quedé pensando en la cadena. Aquello fue lo que más me impresionó: nadie de las tres inventó nada, y entre todas armaron algo que no existía. El enojo era mío, pero la culpa no era suya sola ni de ninguna.',
      pers: ['mí', 'me', 'ella', 'yo', 'se', 'le', 'vos', 'te'],
      demPos: ['Aquello', 'mío', 'suya'],
      neutros: ['alguien', 'nadie', 'nada', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo le llegó el chisme?', r: 'De tercera mano, por una prima.',
          o: ['Lo leyó en un mensaje.', 'Se lo dijeron de frente.', 'De tercera mano, por una prima.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le preguntó su mamá?', r: 'A quién se lo iba a reclamar: a ella o a la que se lo contó.',
          o: ['A quién se lo iba a reclamar: a ella o a la que se lo contó.', 'Si estaba segura de lo que oyó.', 'Por qué se enojaba tanto.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué esa pregunta la desarmó?', r: 'Porque le mostró que había otra responsable que ella no estaba viendo.',
          o: ['Porque su mamá la regañó.', 'Porque le mostró que había otra responsable que ella no estaba viendo.', 'Porque ya era muy tarde.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué entendió sobre la cadena de personas?', r: 'Que sin que nadie inventara nada, entre todas armaron algo que no existía.',
          o: ['Que sin que nadie inventara nada, entre todas armaron algo que no existía.', 'Que todas la odiaban.', 'Que su prima le mintió a propósito.'], c: 0 },
        { tipo: 'critica', q: '¿Tiene responsabilidad quien solo repite algo? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre inventar y difundir, sin exculpar del todo.',
          o: ['No: solo repitió lo que oyó.', 'Sí: repetir sin comprobar es lo que hace crecer el daño.', 'Solo si lo repite muchas veces.'], c: 1 },
      ] },

    { id: 'LP7-04', titulo: 'Cuando ella se fue', genero: 'narrativo',
      texto: 'Mi mamá se fue a España cuando yo tenía siete y mi hermano cuatro. A él le explicaron que ella iba a volver pronto; a mí no me explicaron nada, porque decían que yo ya entendía. Eso no era cierto. Durante años le contesté mal por teléfono, y ella nunca me lo reclamó. A los quince le pregunté por fin por qué se había ido. Me contestó con números, no con sentimientos: lo que ganaba aquí, lo que costaba la casa, lo que nos mandó cada mes. Yo le dije que no le había preguntado eso. Entonces ella se quedó callada y después me dijo, muy despacio: si te contesto lo otro, no puedo seguir trabajando mañana. Nunca se lo volví a preguntar. Y desde ese día le contesto bien el teléfono. Aquello no lo entendí de golpe: lo fui entendiendo. Esto que escribo ahora es mío, pero la parte difícil fue suya.',
      pers: ['se', 'yo', 'él', 'le', 'ella', 'mí', 'me', 'nos', 'te'],
      demPos: ['Eso', 'Aquello', 'Esto', 'mío', 'suya'],
      neutros: ['nada'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué le explicaron al hermano menor?', r: 'Que ella iba a volver pronto.',
          o: ['Que ella iba a volver pronto.', 'Que se iba para siempre.', 'No le explicaron nada.'], c: 0 },
        { tipo: 'literal', q: '¿Con qué le contestó la mamá a los quince años?', r: 'Con números, no con sentimientos.',
          o: ['Con una carta larga.', 'No le contestó.', 'Con números, no con sentimientos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué a él no le explicaron nada de niño?', r: 'Porque supusieron que ya entendía, y no era cierto.',
          o: ['Porque no estaba en la casa.', 'Porque no le interesaba.', 'Porque supusieron que ya entendía, y no era cierto.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa «si te contesto lo otro, no puedo seguir trabajando mañana»?', r: 'Que para sostener la separación tiene que no permitirse sentir lo que perdió.',
          o: ['Que la iban a despedir del trabajo.', 'Que para sostener la separación tiene que no permitirse sentir lo que perdió.', 'Que no tenía tiempo para hablar.'], c: 1 },
        { tipo: 'critica', q: '¿Fue justo con él no explicarle de niño? Argumenta.', r: 'Respuesta abierta: se valora que reconozca la intención de proteger y el daño que igual causó.',
          o: ['Sí: era muy pequeño para entender.', 'No importa: ya pasó.', 'Quisieron protegerlo, pero el silencio le dolió más que la verdad.'], c: 2 },
      ] },

    { id: 'LP7-05', titulo: 'Nos repartimos la cosecha', genero: 'expositivo',
      texto: 'Cuando dos siembran juntos y no acuerdan antes cómo se reparte, la cosecha los pelea. Suena exagerado y en las aldeas todos conocen un caso. El problema es que cada quien recuerda distinto lo que puso: uno se acuerda de los días que trabajó, el otro de la semilla que compró, y ninguno de los dos miente. Por eso conviene escribirlo el día que se siembra, cuando todavía nadie sabe si va a haber buena cosecha o mala. Ahí las cuentas salen parejas, porque nadie está defendiendo lo suyo todavía. Se anota quién puso qué, cómo se reparte si sale bien y qué pasa si se pierde. Ese papel no vale por la ley, vale porque los dos lo firmaron antes de tener algo que ganar. Después ya es tarde: entonces no se firma un acuerdo, se firma una tregua. Y aquello nunca queda bien, porque cada quien siente que lo suyo valió más y que esto no es lo que había entendido.',
      pers: ['se'],
      demPos: ['eso', 'suyo', 'aquello', 'esto'],
      neutros: ['quien', 'nadie', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuándo conviene escribir el acuerdo?', r: 'El día que se siembra.',
          o: ['Cuando aparece el problema.', 'Al levantar la cosecha.', 'El día que se siembra.'], c: 2 },
        { tipo: 'literal', q: '¿Qué se anota en ese papel?', r: 'Quién puso qué, cómo se reparte si sale bien y qué pasa si se pierde.',
          o: ['Quién puso qué, cómo se reparte y qué pasa si se pierde.', 'Solo cuánta tierra puso cada uno.', 'El precio de venta.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué ninguno de los dos miente aunque recuerden distinto?', r: 'Porque cada uno recuerda mejor lo que él mismo aportó.',
          o: ['Porque los dos tienen mala memoria.', 'Porque cada uno recuerda mejor lo que él mismo aportó.', 'Porque no llevan cuentas.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el papel «no vale por la ley»?', r: 'Porque lo que lo sostiene es haberlo firmado antes de tener algo que ganar.',
          o: ['Porque lo que lo sostiene es haberlo firmado antes de tener algo que ganar.', 'Porque nadie lo lleva al juzgado.', 'Porque no lo firma un abogado.'], c: 0 },
        { tipo: 'critica', q: '¿Escribir un acuerdo entre amigos muestra desconfianza? Argumenta.', r: 'Respuesta abierta: se valora que discuta si el acuerdo protege la relación o la daña.',
          o: ['Sí: entre amigos basta la palabra.', 'Al revés: la protege, porque evita que la memoria los enfrente.', 'Solo si es mucho dinero.'], c: 1 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LP8-01', titulo: 'El testigo que se calló', genero: 'narrativo',
      texto: 'A un compañero lo acusaron de haberse robado el dinero de la excursión. Yo estaba ahí y sabía que no había sido él, porque a esa hora estábamos juntos afuera. No dije nada. Me quedé callado tres días y me convencí de que alguien más lo iba a aclarar. Nadie lo hizo. A él lo suspendieron una semana y su mamá tuvo que venir. Cuando por fin hablé, ya lo habían castigado y lo único que conseguí fue que le levantaran la sanción, no que le devolvieran aquello. Él nunca me lo reclamó, y eso fue lo peor. Me dijo una sola cosa, sin enojo: yo sabía que vos sabías. Ese es mi recuerdo más incómodo del colegio, y no es el robo: es haber esperado a que otro hiciera lo que me tocaba a mí. Lo suyo se arregló en una semana; lo mío todavía no. Y aquello no se arregla pidiéndole perdón a él: se arregla la próxima vez que a mí me toque hablar y me dé miedo.',
      pers: ['Yo', 'él', 'Me', 'le', 'vos', 'mí', 'se'],
      demPos: ['aquello', 'eso', 'suyo', 'mío'],
      neutros: ['nada', 'alguien', 'Nadie'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto tiempo se quedó callado?', r: 'Tres días.',
          o: ['Todo el año.', 'Una semana.', 'Tres días.'], c: 2 },
        { tipo: 'literal', q: '¿Qué consiguió cuando por fin habló?', r: 'Que le levantaran la sanción.',
          o: ['Que le levantaran la sanción.', 'Que le pidieran perdón.', 'Que encontraran al culpable.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se convenció de que otro lo iba a aclarar?', r: 'Porque así podía no hacer nada sin sentirse culpable.',
          o: ['Porque así podía no hacer nada sin sentirse culpable.', 'Porque había más testigos seguros.', 'Porque el maestro se lo dijo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué «lo peor» fue que el otro no le reclamara?', r: 'Porque sin reclamo no hubo pelea que lo descargara, y la culpa se le quedó entera.',
          o: ['Porque quería discutir con él.', 'Porque sin reclamo la culpa se le quedó entera.', 'Porque así nadie supo lo que pasó.'], c: 1 },
        { tipo: 'critica', q: '¿Es lo mismo callar que mentir? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta la responsabilidad de quien sabe y no habla.',
          o: ['No: mentir es peor, callar no hace daño.', 'Cuando alguien va a pagar por lo que uno sabe, callar hace el mismo daño.', 'Sí, es exactamente igual.'], c: 1 },
      ] },

    { id: 'LP8-02', titulo: 'Lo que él no me dijo', genero: 'narrativo',
      texto: 'Mi papá trabajó dieciocho años en una empresa y lo despidieron sin liquidación. Nosotros no supimos nada durante cuatro meses. Él salía a la misma hora, con la camisa planchada, y volvía a la misma hora. Nos dimos cuenta porque mi mamá encontró un recibo suyo de una venta de herramienta. Cuando ella se lo preguntó, él no lo negó. Dijo solamente: no quería que ustedes se preocuparan. Ese día se armó la única pelea que les he visto en mi vida. Mi mamá le gritó algo que yo entendí años después: al no decírnoslo, decidió por todos nosotros; nos quitó la posibilidad de ayudarle. Él le contestó que aquello era suyo, que él era el que tenía que resolverlo. Ninguno de los dos tenía toda la razón, y a mí me tocó verlo desde la puerta sin poder decir nada. Aquello me enseñó algo que no se enseña en ninguna clase: hay silencios que uno cree suyos y en realidad son de todos los que viven con uno.',
      pers: ['Nosotros', 'Él', 'Nos', 'ella', 'se', 'ustedes', 'les', 'le', 'yo', 'mí', 'me'],
      demPos: ['suyo', 'aquello', 'suyos'],
      neutros: ['nada', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se dieron cuenta?', r: 'La mamá encontró un recibo suyo de una venta de herramienta.',
          o: ['La mamá encontró un recibo suyo de una venta de herramienta.', 'Se lo dijo un compañero de trabajo.', 'Él lo confesó una noche.'], c: 0 },
        { tipo: 'literal', q: '¿Qué explicación dio el papá?', r: 'Que no quería que se preocuparan.',
          o: ['Que pensaba conseguir otro trabajo pronto.', 'Que le daba vergüenza.', 'Que no quería que se preocuparan.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué le reclamó la mamá exactamente?', r: 'Que al ocultarlo decidió por todos y les quitó la posibilidad de ayudar.',
          o: ['Que al ocultarlo decidió por todos y les quitó la posibilidad de ayudar.', 'Que hubiera vendido la herramienta.', 'Que no buscara trabajo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que ninguno tenía toda la razón?', r: 'Porque él quiso protegerlos y ella defendía el derecho de la familia a saber.',
          o: ['Porque los dos gritaron.', 'Porque él quiso protegerlos y ella defendía el derecho de la familia a saber.', 'Porque no entendieron el problema.'], c: 1 },
        { tipo: 'critica', q: '¿Hasta dónde puede alguien ocultar un problema «para no preocupar»? Argumenta.', r: 'Respuesta abierta: se valora que ponga un criterio y no solo una opinión general.',
          o: ['Siempre: para eso está el que sostiene la casa.', 'Nunca: hay que contarlo todo.', 'Hasta donde su decisión no le quite a los demás la posibilidad de actuar.'], c: 2 },
      ] },

    { id: 'LP8-03', titulo: 'La firma que no era suya', genero: 'expositivo',
      texto: 'A una señora de una aldea le aparecieron dos préstamos que ella nunca pidió. Fue al banco y le dijeron que ahí estaba su firma. Ella no sabe firmar: pone su huella. Aquello fue lo que le salvó el caso, aunque le tomó dos años demostrarlo. Un abogado de oficio le explicó lo que a mucha gente no le explica nadie: cuando alguien reclama una deuda, es él quien tiene que probar que uno la contrajo, no uno probar que no. La carga de la prueba es suya. Ella lo repitió después en su comunidad, con sus palabras: si a vos te llega un cobro raro, no salgás a buscar papeles todavía; pediles a ellos que te enseñen lo que firmaste. A varios les sirvió. A una vecina le apareció lo mismo y en tres semanas se lo quitaron, porque preguntó eso desde el primer día y no después de pagar. Aquello que a una le costó dos años, a la otra le costó una pregunta, y la diferencia no fue la suerte: fue saberlo.',
      pers: ['le', 'ella', 'él', 'vos', 'te', 'ellos', 'les', 'se'],
      demPos: ['Aquello', 'suya', 'eso'],
      neutros: ['nadie', 'alguien', 'quien'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué no podía ser suya la firma?', r: 'Porque ella no sabe firmar: pone su huella.',
          o: ['Porque estaba fuera del país.', 'Porque el banco la falsificó.', 'Porque ella no sabe firmar: pone su huella.'], c: 2 },
        { tipo: 'literal', q: '¿Cuánto tardó en demostrarlo?', r: 'Dos años.',
          o: ['Un mes.', 'Tres semanas.', 'Dos años.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa que «la carga de la prueba es suya»?', r: 'Que le toca a quien cobra demostrar la deuda, no al cobrado demostrar que no existe.',
          o: ['Que el banco decide quién tiene razón.', 'Que hay que pagar y reclamar después.', 'Que le toca a quien cobra demostrar la deuda.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué a la vecina se lo resolvieron en tres semanas?', r: 'Porque preguntó desde el primer día en vez de pagar o buscar papeles.',
          o: ['Porque tenía un abogado propio.', 'Porque preguntó desde el primer día en vez de pagar o buscar papeles.', 'Porque su caso era más sencillo.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué esa información no llega a la gente que la necesita? Argumenta.', r: 'Respuesta abierta: se valora que note quién gana con el desconocimiento.',
          o: ['Porque a quien cobra le conviene que uno no lo sepa, y nadie más se lo dice.', 'Porque a la gente no le interesa.', 'Porque está en los periódicos y nadie lee.'], c: 0 },
      ] },

    { id: 'LP8-04', titulo: 'Nos toca a nosotros decidirlo', genero: 'narrativo',
      texto: 'La junta de agua tenía que decidir si subía la cuota de treinta a cincuenta lempiras. En la asamblea todos sabían que hacía falta, y ninguno quería ser el que lo propusiera. Estuvimos hora y media hablando de otras cosas. Al final, don Melvin se paró y dijo: yo lo propongo, y me hago cargo de que me lo echen en cara. Aquello destrabó la reunión. Se votó y pasó, aunque no por mucho. Después él nos explicó por qué lo hizo así: no porque le gustara, sino porque cuando nadie firma una decisión, la decisión igual se toma, pero después nadie la defiende y se cae sola. Él prefirió que aquello tuviera dueño. Yo pensé mucho en eso. En un grupo lo más difícil casi nunca es saber qué hay que hacer: es que alguien diga en voz alta que fue idea suya. Aquello me quedó claro esa noche, y desde entonces trato de ser yo el que lo diga cuando nadie más quiere.',
      pers: ['se', 'yo', 'me', 'él', 'nos', 'le'],
      demPos: ['Aquello', 'eso', 'suya'],
      neutros: ['nadie', 'alguien'],
      preguntas: [
        { tipo: 'literal', q: '¿De cuánto a cuánto iba a subir la cuota?', r: 'De treinta a cincuenta lempiras.',
          o: ['De cincuenta a cien.', 'De treinta a cincuenta lempiras.', 'De veinte a treinta.'], c: 1 },
        { tipo: 'literal', q: '¿Qué dijo don Melvin al pararse?', r: 'Que él lo proponía y se hacía cargo.',
          o: ['Que se opusieran todos juntos.', 'Que él lo proponía y se hacía cargo.', 'Que lo decidiera la directiva.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué nadie quería proponerlo?', r: 'Porque quien lo propusiera iba a cargar con el reclamo de los demás.',
          o: ['Porque quien lo propusiera iba a cargar con el reclamo de los demás.', 'Porque no estaban seguros de que hiciera falta.', 'Porque no sabían cuánto subir.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué pasa cuando una decisión no tiene dueño?', r: 'Que igual se toma, pero después nadie la defiende y se cae sola.',
          o: ['Que igual se toma, pero después nadie la defiende y se cae sola.', 'Que la toma la directiva.', 'Que no se cumple nunca.'], c: 0 },
        { tipo: 'critica', q: '¿Debería una decisión colectiva tener un responsable con nombre? Argumenta.', r: 'Respuesta abierta: se valora que pese la responsabilidad personal contra el riesgo de cargarla a uno solo.',
          o: ['Sí: sin alguien que la sostenga, nadie la defiende cuando cuesta.', 'No: si es de todos, es de todos.', 'Solo si es una decisión de dinero.'], c: 0 },
      ] },

    { id: 'LP8-05', titulo: 'El que pidió perdón primero', genero: 'narrativo',
      texto: 'Dos primos míos dejaron de hablarse doce años por un pleito de una pared medianera. Cada uno tenía razón en su parte: el terreno era de uno y el muro lo había pagado el otro. Ninguno de los dos estaba dispuesto a ir primero, porque ir primero se leía como aceptar que la culpa era suya. La cosa se heredó a los hijos, que ni sabían por qué no se saludaban. Lo resolvió algo pequeño. Al mayor le dio un infarto y el otro llegó al hospital sin avisar. No hablaron del muro. Solo se dieron la mano y el que estaba en la cama dijo: qué tonto lo nuestro. Nada más. Después la familia inventó que hubo una disculpa formal, porque eso se cuenta mejor. Yo estaba ahí y sé que no la hubo. Bastó con que uno apareciera. Eso me hizo pensar en todo lo que uno se aguanta esperando una frase que a lo mejor nunca va a llegar, y que quizá tampoco hace falta.',
      pers: ['se', 'le', 'Yo', 'me'],
      demPos: ['míos', 'suya', 'eso'],
      neutros: ['algo', 'Nada'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto tiempo dejaron de hablarse?', r: 'Doce años.',
          o: ['Toda la vida.', 'Dos años.', 'Doce años.'], c: 2 },
        { tipo: 'literal', q: '¿Qué dijo el que estaba en la cama?', r: '«Qué tonto lo nuestro».',
          o: ['Pidió perdón formalmente.', 'Le reclamó por el muro.', '«Qué tonto lo nuestro».'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué ninguno quería ir primero?', r: 'Porque ir primero se leía como aceptar que la culpa era suya.',
          o: ['Porque vivían lejos uno del otro.', 'Porque ir primero se leía como aceptar que la culpa era suya.', 'Porque los hijos se lo prohibían.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la familia inventó una disculpa formal?', r: 'Porque una historia con disculpa se cuenta mejor que una donde solo alguien apareció.',
          o: ['Porque nadie recordaba bien.', 'Porque una historia con disculpa se cuenta mejor.', 'Porque querían quedar bien con los hijos.'], c: 1 },
        { tipo: 'critica', q: '¿Hace falta pedir perdón con palabras? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta el valor del gesto frente al de la palabra explícita.',
          o: ['No siempre: a veces aparecer dice más que la frase exacta.', 'Sí: sin palabras no hay perdón.', 'Nunca hace falta.'], c: 0 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LP9-01', titulo: 'Yo, vos, usted', genero: 'expositivo',
      texto: 'En Honduras se trata a alguien de tres maneras y ninguna es neutral. El usted marca distancia o respeto; el vos marca confianza; el tú casi no se usa hablando, aunque aparezca escrito en los libros de la escuela. Cambiar de uno a otro es un acto social, no gramatical. Cuando alguien que te vosea empieza de pronto a hablarte de usted, algo pasó entre ustedes dos y los dos lo saben sin decirlo. Al revés ocurre lo mismo: pasar al vos es una invitación, y quien la recibe puede aceptarla o no aceptarla, siguiendo con el usted. Nadie enseña esas reglas y todos las manejan. Lo curioso es que la escuela conjuga «tú tienes» mientras el niño oye «vos tenés» en su casa, y muchas veces se le corrige lo suyo como si fuera un error. No lo es: es otra forma, tan válida como la del libro. Lo que sí conviene enseñarle es cuándo se usa cada una, porque eso sí decide cómo lo van a recibir a él. Aquello del libro no es más suyo que esto de su casa: son dos herramientas, y le sirven las dos.',
      pers: ['se', 'usted', 'vos', 'tú', 'te', 'ustedes', 'le', 'él'],
      demPos: ['suyo', 'eso', 'Aquello', 'esto'],
      neutros: ['alguien', 'algo', 'quien', 'Nadie'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué marca el usted?', r: 'Distancia o respeto.',
          o: ['Distancia o respeto.', 'Confianza.', 'Enojo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué cambiar de vos a usted «dice» algo?', r: 'Porque el cambio señala que la relación entre los dos se movió.',
          o: ['Porque el cambio señala que la relación entre los dos se movió.', 'Porque suena más elegante.', 'Porque es más correcto.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el vos es «una invitación» que se puede no aceptar?', r: 'Porque quien la recibe puede seguir tratando de usted, y eso también comunica.',
          o: ['Porque hay que pedir permiso para vosear.', 'Porque quien la recibe puede seguir de usted, y eso también comunica.', 'Porque el vos es de mala educación.'], c: 1 },
        { tipo: 'critica', q: '¿Está bien que se le corrija el voseo a un niño? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre enseñar otra forma y descalificar la propia.',
          o: ['Sí: en la escuela se enseña lo correcto.', 'No: hay que dejarlo hablar como quiera.', 'Enseñarle la otra forma sí; decirle que la suya está mal, no.'], c: 2 },
        { tipo: 'critica', q: '¿Qué se le enseña de verdad a alguien cuando se le corrige cómo habla? Argumenta.', r: 'Respuesta abierta: se valora que note el mensaje implícito sobre él y sobre los suyos.',
          o: ['Se le enseña gramática y nada más.', 'Se le enseña también algo sobre el valor de su casa y su gente.', 'No se le enseña nada.'], c: 1 },
      ] },

    { id: 'LP9-02', titulo: 'El nosotros de los discursos', genero: 'expositivo',
      texto: 'Vale la pena fijarse en quién habla dentro de un discurso. Cuando alguien dice «nosotros logramos», se está incluyendo; cuando dice «se cometieron errores», desaparece: no hay nadie que los cometiera. Ese salto no es casual y los que escriben discursos lo saben perfectamente. Al éxito se le pone dueño y al fracaso se le quita. Conviene mirar también a quién deja afuera ese «nosotros». A veces es todo el país y a veces son ellos, los del partido, aunque suene igual. Y hay un tercer truco: el «ustedes» acusador, que separa al que habla de los que escuchan justo cuando toca repartir la culpa. Nada de esto es exclusivo de la política. Pasa en una reunión de trabajo y en una casa. Escuchar quién aparece y quién se borra en cada frase no vuelve a nadie desconfiado: lo vuelve difícil de engañar, que es distinto. Lo suyo, lo mío y lo de nadie no significan lo mismo, aunque nos las digan seguidas y en la misma frase. Aquello que suena a promesa de todos muchas veces solo compromete a esto: a nadie en particular.',
      pers: ['nosotros', 'se', 'le', 'ellos', 'ustedes', 'nos'],
      demPos: ['esto', 'suyo', 'mío', 'Aquello'],
      neutros: ['alguien', 'nadie', 'Nada'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué pasa cuando alguien dice «se cometieron errores»?', r: 'Que desaparece el que los cometió.',
          o: ['Que desaparece el que los cometió.', 'Que acepta la culpa.', 'Que acusa a otro.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué se le pone dueño al éxito y no al fracaso?', r: 'Porque conviene aparecer en lo bueno y desaparecer en lo malo.',
          o: ['Porque el fracaso no tiene responsables.', 'Porque así lo manda la gramática.', 'Porque conviene aparecer en lo bueno y desaparecer en lo malo.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué hace el «ustedes» acusador?', r: 'Separa a quien habla de quienes escuchan justo cuando toca repartir la culpa.',
          o: ['Separa a quien habla de quienes escuchan cuando toca repartir la culpa.', 'Suaviza el reclamo.', 'Incluye a todos por igual.'], c: 0 },
        { tipo: 'critica', q: '¿Fijarse en esto vuelve a alguien desconfiado? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre desconfianza y capacidad de leer lo que se dice.',
          o: ['Sí: uno termina dudando de todo el mundo.', 'No: lo vuelve difícil de engañar, que no es lo mismo.', 'Da igual, nadie escucha con esa atención.'], c: 1 },
        { tipo: 'critica', q: '¿Pasa esto también en tu casa o en tu clase? Da un ejemplo.', r: 'Respuesta abierta: se valora que traslade el análisis a una situación propia con un ejemplo concreto.',
          o: ['Sí: «se rompió el vidrio» dicho por quien lo rompió es exactamente eso.', 'No: eso solo lo hacen los políticos.', 'Solo pasa en la televisión.'], c: 0 },
      ] },

    { id: 'LP9-03', titulo: 'Ella firmó por todas', genero: 'narrativo',
      texto: 'En una empresa de maquila, ciento veinte trabajadoras reclamaron por el agua del comedor. Todas estaban de acuerdo y ninguna quería poner su nombre en el papel, porque a la que firmara la iban a marcar. Estuvieron tres semanas así. Entonces Yamileth dijo que ella lo firmaba. Tenía dos hijos y era la que más tenía que perder, y quizá por eso nadie se lo discutió. La respuesta llegó rápido: a ella la cambiaron de línea, le pusieron metas más altas y a los cuatro meses la despidieron con una excusa. Ellas no se quedaron calladas. Las ciento diecinueve firmaron entonces una carta, ya no por el agua, sino por ella. Eso no le devolvió el empleo. Le consiguió una indemnización y algo que ella misma valora más: que ninguna de las que se quedaron pueda decir hoy que aquello no fue asunto suyo. El bebedero, por cierto, lo pusieron a los dos meses, cuando ella ya no estaba. Aquello es lo que más rabia da de esto: que lo suyo sirvió, y que el precio no lo pagaron entre todas sino ella sola.',
      pers: ['ella', 'se', 'le', 'Ellas'],
      demPos: ['eso', 'aquello', 'suyo', 'esto'],
      neutros: ['nadie', 'algo'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué ninguna quería firmar?', r: 'Porque a la que firmara la iban a marcar.',
          o: ['Porque a la que firmara la iban a marcar.', 'Porque no sabían escribir.', 'Porque no estaban de acuerdo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué nadie le discutió a Yamileth que firmara ella?', r: 'Porque era la que más tenía que perder y aun así se ofreció.',
          o: ['Porque era la jefa del grupo.', 'Porque nadie la conocía.', 'Porque era la que más tenía que perder y aun así se ofreció.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la segunda carta ya no era por el agua?', r: 'Porque el reclamo se había vuelto la defensa de ella.',
          o: ['Porque el agua ya la habían puesto.', 'Porque el reclamo se había vuelto la defensa de ella.', 'Porque cambiaron de opinión sobre el comedor.'], c: 1 },
        { tipo: 'critica', q: '¿Ganó o perdió Yamileth? Defiende tu postura.', r: 'Respuesta abierta: se valora que ponga en la balanza el empleo perdido y lo que se consiguió.',
          o: ['Perdió: se quedó sin trabajo.', 'Ganó: le pagaron indemnización.', 'Perdió el empleo y ganó algo que ella valora más; las dos cosas son ciertas.'], c: 2 },
        { tipo: 'critica', q: '¿Es justo que el costo lo pague quien da el primer paso? Argumenta.', r: 'Respuesta abierta: se valora que proponga cómo repartir ese costo en vez de solo lamentarlo.',
          o: ['No es justo, y por eso conviene firmar en grupo desde el principio.', 'Es lo normal: quien se expone, se arriesga.', 'Nadie debería reclamar nada.'], c: 0 },
      ] },

    { id: 'LP9-04', titulo: 'Nadie se hizo cargo', genero: 'expositivo',
      texto: 'Cuando un puente se cae o un expediente se pierde, la primera respuesta suele ser la misma: no fue nadie. Cada oficina explica que aquello le correspondía a otra y todas dicen la verdad a medias, porque la responsabilidad estaba repartida de tal manera que nunca era de alguien en particular. Los que estudian las organizaciones lo llaman difusión de responsabilidad, y no es un defecto de las personas: es un defecto del diseño. Se arregla de una manera aburrida y muy eficaz: poniéndole nombre a cada tarea. No «el departamento revisará», sino «fulano revisa y firma». Cuando algo tiene dueño, se hace; cuando es de todos, se hace a medias o no se hace. Lo interesante es que quienes más se resisten a ese cambio no siempre son los que trabajan mal: muchas veces son los que trabajan bien y saben que, con su nombre en el papel, van a cargar también con lo que otros no hicieron. Aquello es un temor razonable y conviene atenderlo: si el nombre es suyo, la tarea tiene que ser suya de verdad, no esto de firmar por el trabajo ajeno.',
      pers: ['se', 'le'],
      demPos: ['aquello', 'suyo', 'suya', 'esto'],
      neutros: ['nadie', 'alguien', 'algo', 'quienes'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo llaman los estudiosos a ese fenómeno?', r: 'Difusión de responsabilidad.',
          o: ['Difusión de responsabilidad.', 'Negligencia colectiva.', 'Error de sistema.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué todas las oficinas «dicen la verdad a medias»?', r: 'Porque la responsabilidad estaba repartida y ninguna la tenía entera.',
          o: ['Porque se pusieron de acuerdo para mentir.', 'Porque nadie sabía qué pasó.', 'Porque la responsabilidad estaba repartida y ninguna la tenía entera.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué se resisten algunos que trabajan bien?', r: 'Porque con su nombre en el papel cargarían también con lo que otros no hacen.',
          o: ['Porque no quieren más trabajo.', 'Porque prefieren el anonimato.', 'Porque cargarían también con lo que otros no hacen.'], c: 2 },
        { tipo: 'critica', q: '¿Es justo ponerle nombre a cada tarea? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca la eficacia de la medida y el riesgo que señala el propio texto.',
          o: ['Sí, y sin discusión: así se sabe a quién reclamar.', 'No: es una forma de vigilar a la gente.', 'Funciona, pero hay que asegurarse de que nadie cargue lo ajeno.'], c: 2 },
        { tipo: 'critica', q: '¿Dónde has visto que «lo de todos» no lo haga nadie? Da un ejemplo y propón algo.', r: 'Respuesta abierta: se valora que dé un ejemplo propio y proponga un responsable concreto.',
          o: ['No lo he visto nunca.', 'En el aseo del aula: se arregla con un encargado por día y una lista.', 'Pasa siempre y no tiene arreglo.'], c: 1 },
      ] },

    { id: 'LP9-05', titulo: 'Lo que uno le debe a quien lo crio', genero: 'narrativo',
      texto: 'A mi tía la crio su abuela, y ella crio después a tres sobrinos que no eran suyos. Cuando le preguntaban por qué, contestaba siempre lo mismo, medio en broma: porque a mí me tocó y no me consultaron. Uno de esos sobrinos se fue del país a los diecinueve y durante años le mandó dinero. Ella lo recibía y no decía nada. Un día él la llamó y le preguntó, incómodo, si con eso ya estaban a mano. Mi tía se rió y le contestó algo que a mí me costó entender de niño: vos no me debés nada, mijo; lo que a vos te tocaba era irte. Después me lo explicó a mí con otras palabras: ella no crio a nadie para que se lo pagaran, sino para que después ellos pudieran criar a otro. Lo que él le mandaba estaba bien, pero no era la deuda. La deuda, si acaso, se paga adelante. Yo entendí aquello mucho después, cuando me tocó a mí hacerme cargo de alguien, y ahí supe que esto que ella hizo no era generosidad suelta: era una manera de entender lo suyo y lo de uno.',
      pers: ['ella', 'le', 'mí', 'me', 'se', 'él', 'vos', 'te', 'ellos', 'Yo'],
      demPos: ['suyos', 'eso', 'aquello', 'esto', 'suyo'],
      neutros: ['nada', 'algo', 'nadie', 'alguien'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué contestaba la tía cuando le preguntaban por qué crio a los sobrinos?', r: 'Que le tocó y no la consultaron.',
          o: ['Que se lo pidió su abuela.', 'Que le tocó y no la consultaron.', 'Que le pagaban por hacerlo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiso decir con «lo que a vos te tocaba era irte»?', r: 'Que su tarea no era pagarle, sino hacer su propia vida.',
          o: ['Que ya no lo quería cerca.', 'Que debía mandar más dinero.', 'Que su tarea no era pagarle, sino hacer su propia vida.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa que «la deuda se paga adelante»?', r: 'Que se devuelve criando o ayudando a otro, no a quien lo crio a uno.',
          o: ['Que se paga por adelantado.', 'Que se devuelve criando o ayudando a otro, no a quien lo crio a uno.', 'Que hay que pagarla pronto.'], c: 1 },
        { tipo: 'critica', q: '¿Se le debe algo a quien lo crio a uno? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta la idea de deuda frente a la de gratitud o continuidad.',
          o: ['Sí: una deuda que se paga con dinero y cuidados.', 'Algo se le debe, aunque quizá no en forma de pago sino de continuidad.', 'No se le debe nada.'], c: 1 },
        { tipo: 'critica', q: '¿Qué cambia si uno piensa la ayuda como cadena y no como préstamo? Argumenta.', r: 'Respuesta abierta: se valora que note el efecto de esa idea sobre quien recibe y sobre quien da.',
          o: ['Cambia que quien recibe no queda en deuda, y que la ayuda sigue moviéndose.', 'Nada: es la misma cosa dicha distinto.', 'Cambia que nadie devuelve nada.'], c: 0 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN
   1. las cinco preguntas; 2. cazar los pronombres sobre el texto;
   3. clasificarlos en personal o demostrativo/posesivo; 4. volver de
   memoria a buscar el pronombre exacto.
══════════════════════════════════════════════════════════════ */
const LECTURA_PRONOMBRES_TALLER = [

  { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

  { id: 'caza', icono: '🎯', titulo: 'Caza de pronombres', forma: 'cazar', meta: 10,
    instruccion: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' pronombres</strong>. Encuentra ' +
        '<strong>al menos ' + info.meta + '</strong> y tócalos: valen los <strong>personales</strong> ' +
        '(yo, vos, me, te, se, le, él, ella) y los <strong>demostrativos y posesivos</strong> ' +
        '(esto, eso, aquello, el mío, la suya).';
    },
    enPapel: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' pronombres</strong>. <strong>Subraya al menos ' +
        info.meta + '</strong> en el texto de arriba: valen los <strong>personales</strong> (yo, vos, me, te, se, ' +
        'le, él, ella) y los <strong>demostrativos y posesivos</strong> (esto, eso, aquello, el mío, la suya).';
    },
    objetivos: function (t, u) {
      var pe = {}, dp = {};
      (t.pers || []).forEach(function (p) { pe[u.clave(p)] = 1; });
      (t.demPos || []).forEach(function (p) { dp[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (pe[k]) out.push({ ini: i, fin: i, clase: 'a' });
        else if (dp[k]) out.push({ ini: i, fin: i, clase: 'b' });
      });
      return out;
    },
    /* «alguien», «nadie», «algo», «nada» y «quien» SON pronombres —
       indefinidos y relativos—, pero esta cacería busca las dos clases
       de la misión. Se le dice, en vez de castigarlo por saber. */
    neutros: function (t, u) {
      var neu = {};
      (t.neutros || []).forEach(function (p) { neu[u.clave(p)] = 1; });
      if (typeof LECTURA_CLASES !== 'undefined') LECTURA_CLASES.neutros.forEach(function (p) { neu[u.clave(p)] = 1; });
      var OTRA = { 'alguien': 'indefinido', 'nadie': 'indefinido', 'algo': 'indefinido', 'nada': 'indefinido',
        'quien': 'relativo', 'quienes': 'relativo' };
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (!neu[k]) return;
        var limpio = p.replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        out.push({ ini: i, fin: i, motivo: OTRA[k]
          ? '«' + u.esc(limpio) + '» <strong>sí es pronombre</strong>, ' + OTRA[k] + '. Aquí buscamos los ' +
            'personales y los demostrativos o posesivos, así que no cuenta: ni bien ni mal.'
          : '«' + u.esc(limpio) + '» aquí <strong>no está haciendo de pronombre</strong>: en esta oración es ' +
            'artículo o acompaña a un sustantivo. No cuenta: ni bien ni mal.' });
      });
      return out;
    },
    fallo: function (palabra, u) {
      return '❌ «' + u.esc(palabra) + '» no es pronombre. Un pronombre <strong>ocupa el lugar</strong> de un ' +
        'sustantivo: en vez de repetir «Denis», se dice «él».';
    } },

  { id: 'clasifica', icono: '🗂️', titulo: '¿Personal, o demostrativo y posesivo?', forma: 'dosGrupos',
    pista: 'Míralos en su oración antes de decidir',
    grupos: [
      { clave: 'a', titulo: '👥 Personal', pista: 'quién habla, a quién y de quién', nombre: 'pronombre personal' },
      { clave: 'b', titulo: '📌 Demostrativo o posesivo', pista: 'señala o dice de quién es', nombre: 'demostrativo o posesivo' }
    ],
    items: function (t, u) {
      var pe = u.baraja(t.pers || []), dp = u.baraja(t.demPos || []);
      var nDp = Math.min(3, dp.length), nPe = Math.min(6 - nDp, pe.length);
      var lista = pe.slice(0, nPe).map(function (p) { return { palabra: p, grupo: 'a' }; })
        .concat(dp.slice(0, nDp).map(function (p) { return { palabra: p, grupo: 'b' }; }));
      return u.baraja(lista).map(function (it) {
        it.contexto = u.contextoDe(it.palabra);
        it.explica = '«' + u.esc(it.palabra) + '» ' + (it.grupo === 'a'
          ? 'señala a una <strong>persona</strong> del diálogo: quien habla, a quien se le habla o de quien se habla.'
          : '<strong>señala</strong> algo o dice <strong>de quién es</strong>, sin nombrarlo.');
        return it;
      });
    } },

  { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?', forma: 'tresOpciones',
    pista: 'Las tres palabras salen de esta misma lectura',
    items: function (t, u) {
      var todos = (t.pers || []).concat(t.demPos || []);
      var pron = {};
      todos.forEach(function (p) { pron[u.clave(p)] = 1; });
      var candidatos = [];
      u.oraciones().forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (pron[u.clave(u.ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
        }
      });
      return u.baraja(candidatos).slice(0, 4).map(function (c) {
        var correcta = u.ps[c.pos].replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        var otros = u.baraja(todos.filter(function (p) { return u.clave(p) !== u.clave(correcta); })).slice(0, 2);
        var ops = u.baraja([correcta].concat(otros));
        var frase = [];
        for (var i = c.ini; i <= c.fin; i++) {
          frase.push(i === c.pos ? u.HUECO + u.esc(u.ps[i].replace(/^[^.,;:!?»]*/, '')) : u.esc(u.ps[i]));
        }
        return {
          frase: frase.join(' '), ops: ops, c: ops.map(u.clave).indexOf(u.clave(correcta)),
          bien: 'Fíjate en cómo cambia de quién se habla según el pronombre que se le ponga.',
          mal: 'La lectura decía <strong>«' + u.esc(correcta) + '»</strong>. Los otros dos también salen de este texto, ' +
            'pero señalaban a otra persona.'
        };
      });
    } },
];

const LECTURA_PRONOMBRES_RESUMEN = {
  titulo: '👤 Todos los pronombres de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'ella', dice: 'personal' },
    { clase: 'b', txt: 'aquello', dice: 'demostrativo o posesivo' }
  ],
  intro: function (t, u, cuenta) {
    return 'En un solo texto había <strong>' + cuenta.a + ' pronombres personales</strong> y <strong>' +
      cuenta.b + ' demostrativos o posesivos</strong>. Todos ocupan el lugar de un sustantivo: por eso el ' +
      'texto no tiene que repetir el nombre en cada oración.';
  },
  marcar: function (t, u) {
    var pe = {}, dp = {};
    (t.pers || []).forEach(function (p) { pe[u.clave(p)] = 1; });
    (t.demPos || []).forEach(function (p) { dp[u.clave(p)] = 1; });
    var out = [];
    u.ps.forEach(function (p, i) {
      var k = u.clave(p);
      if (pe[k]) out.push({ ini: i, fin: i, clase: 'a' });
      else if (dp[k]) out.push({ ini: i, fin: i, clase: 'b' });
    });
    return out;
  }
};
