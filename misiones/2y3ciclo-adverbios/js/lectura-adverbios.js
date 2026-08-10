/* ══════════════════════════════════════════════════════════════
   📖 CORPUS DE LECTURA — MISIÓN DE LOS ADVERBIOS

   Cinco lecturas por grado, de 4º a 9º, para el Control de lectura que
   vive dentro de la misión (js/tools/lectura-mision.js).

   ── Las dos clases que se clasifican salen de la misión ──
   La misión tiene una sección para «Adverbios de Lugar y Tiempo» y otra
   para «Adverbios de Modo y Cantidad». La actividad de clasificar usa
   exactamente ese corte, para que el alumno no tenga que traducir entre
   dos maneras de nombrar lo mismo:

     lugarTiempo   → ¿dónde? ¿cuándo?  (aquí, lejos, ayer, todavía)
     modoCantidad  → ¿cómo? ¿cuánto?   (despacio, así, muy, apenas)

   ── Los de afirmación, negación y duda van a `neutros` ──
   No porque no sean adverbios —lo son, y la pantalla se lo dice—, sino
   porque esta cacería busca las dos clases de arriba. Tocar «no» o
   «quizá» no suma ni resta, y el mensaje aprovecha para enseñar de qué
   clase son. Es el mismo criterio que usa la misión de los números con
   los números que no llegan a mil: no es un error, es otra cosa.

   ── El inventario es COMPLETO, y aquí hay una trampa ──
   Muchas palabras son adverbio en una oración y otra cosa en la de al
   lado: «solo» es adverbio en «solo quiero uno» y adjetivo en «un
   hombre solo»; «mucho» es adverbio en «trabaja mucho» y determinativo
   en «mucho trabajo»; «bajo» es adverbio en «habla bajo» y preposición
   en «bajo la mesa». Esa decisión la toma la ORACIÓN, no una lista, así
   que va escrita a mano texto por texto y las dudosas se marcan en
   `neutros`.

   Antes de publicar un cambio:
     node _dev/valida-lectura-mision.js
     node _dev/verifica-nombres-propios.js
     node _dev/verifica-impresion-lectura.js
══════════════════════════════════════════════════════════════ */

const LECTURA_ADVERBIOS = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LD4-01', titulo: 'La pulpería de la esquina', genero: 'descriptivo',
      texto: 'La pulpería de doña Tina abre temprano y cierra tarde. Adentro huele siempre a jabón y a pan. Arriba, en un estante alto, están las cosas que se venden poco; abajo, al alcance de la mano, lo que sale todos los días. Doña Tina atiende despacio y nunca se equivoca con el vuelto, aunque suma mentalmente. Si un niño llega apenas con dos lempiras, ella le busca algo que sí alcance. Casi nadie del barrio se ha ido de ahí con las manos vacías. Cuando alguien no trae dinero, ella lo anota en un cuaderno y después no lo cobra tan seguido como debería.',
      lugarTiempo: ['temprano', 'tarde', 'Adentro', 'siempre', 'Arriba', 'abajo', 'nunca', 'después'],
      modoCantidad: ['poco', 'despacio', 'mentalmente', 'apenas', 'Casi', 'tan', 'seguido'],
      neutros: ['sí', 'no', 'alto', 'vacías'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hay en el estante de arriba?', r: 'Las cosas que se venden poco.',
          o: ['El pan y el jabón.', 'Las cosas que se venden poco.', 'El cuaderno de las cuentas.'], c: 1 },
        { tipo: 'literal', q: '¿Cómo saca doña Tina el vuelto?', r: 'Sumando mentalmente, y nunca se equivoca.',
          o: ['Sumando mentalmente, y nunca se equivoca.', 'Con una calculadora.', 'Le pregunta al cliente.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hace cuando alguien no trae dinero?', r: 'Lo anota en un cuaderno.',
          o: ['Lo anota en un cuaderno.', 'Le pide que vuelva otro día.', 'No le vende nada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué lo que más se vende está abajo?', r: 'Porque así queda al alcance de la mano y se despacha más rápido.',
          o: ['Porque pesa mucho.', 'Porque así queda al alcance de la mano y se despacha más rápido.', 'Porque arriba no cabe.'], c: 1 },
        { tipo: 'critica', q: '¿Le conviene a doña Tina fiar y no cobrar seguido? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que note la tensión entre el negocio y la relación con el barrio.',
          o: ['Da igual: nadie le paga nunca.', 'No le conviene: así va a quebrar.', 'Le conviene: el barrio le responde, aunque el negocio sufra.'], c: 2 },
      ] },

    { id: 'LD4-02', titulo: 'Así se camina en el lodo', genero: 'instructivo',
      texto: 'Cuando el camino está bien enlodado, no camines rápido: caminá cortito y bien pegado a la orilla, donde el zacate agarra. Pisá primero con el talón y después asentá todo el pie, despacio. Si te resbalás, no manotees; agachate de una vez, porque desde abajo uno se cae menos duro. Nunca subás una cuesta de lodo en zapato liso: mejor descalzo, que el pie agarra mucho más. Y si llevás carga, amarrala bien arriba de la espalda, nunca colgando, porque una carga que se mece te tumba enseguida. Los que trabajan afuera todo el invierno lo saben así, sin que nadie se los haya enseñado.',
      lugarTiempo: ['primero', 'después', 'abajo', 'arriba', 'enseguida', 'afuera', 'Nunca'],
      modoCantidad: ['bien', 'rápido', 'cortito', 'despacio', 'menos', 'duro', 'mucho', 'más', 'así'],
      neutros: ['no', 'mejor', 'descalzo', 'liso'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo hay que pisar?', r: 'Primero con el talón y después todo el pie, despacio.',
          o: ['Con toda la planta de golpe.', 'Primero con el talón y después todo el pie, despacio.', 'De puntillas.'], c: 1 },
        { tipo: 'literal', q: '¿Qué se hace si uno se resbala?', r: 'Agacharse de una vez, sin manotear.',
          o: ['Manotear para no caerse.', 'Agacharse de una vez, sin manotear.', 'Correr hasta el zacate.'], c: 1 },
        { tipo: 'literal', q: '¿Dónde se amarra la carga?', r: 'Bien arriba de la espalda, nunca colgando.',
          o: ['Bien arriba de la espalda, nunca colgando.', 'En la cintura.', 'Colgando de un hombro.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué es mejor descalzo que con zapato liso?', r: 'Porque el pie agarra mucho más que una suela lisa.',
          o: ['Porque el zapato se ensucia.', 'Porque así se camina más rápido.', 'Porque el pie agarra mucho más que una suela lisa.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué el texto dice que eso se sabe «sin que nadie lo haya enseñado»?', r: 'Respuesta abierta: se valora que reconozca el saber que deja la experiencia repetida.',
          o: ['Porque nadie quiere enseñar.', 'Porque no está escrito en ningún libro.', 'Porque quien camina eso todos los inviernos lo aprende con el cuerpo.'], c: 2 },
      ] },

    { id: 'LD4-03', titulo: 'El gato que llegó tarde', genero: 'narrativo',
      texto: 'Michín se fue un lunes y no volvió. Lo buscamos por todos lados: adentro del ropero, arriba del techo, afuera en el solar y hasta lejos, en la casa de los vecinos. Mi hermana lloró bastante. Mi mamá dijo que los gatos siempre regresan, pero pasaron doce días y ya casi nadie lo mencionaba. Entonces, un sábado muy temprano, oímos algo en la puerta. Ahí estaba, flaquísimo y sucio, maullando bajito. Comió despacio, durmió dieciséis horas seguidas y después anduvo dos semanas sin salir del corredor. Nunca supimos dónde estuvo. Mi papá dice que un gato jamás cuenta esas cosas.',
      lugarTiempo: ['adentro', 'arriba', 'afuera', 'lejos', 'siempre', 'ya', 'temprano', 'Ahí', 'después', 'Nunca', 'jamás', 'Entonces'],
      modoCantidad: ['bastante', 'casi', 'muy', 'bajito', 'despacio'],
      neutros: ['no', 'flaquísimo', 'seguidas', 'sucio'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos días pasaron antes de que volviera?', r: 'Doce.',
          o: ['Dos.', 'Doce.', 'Un mes.'], c: 1 },
        { tipo: 'literal', q: '¿Cómo estaba Michín cuando apareció?', r: 'Flaquísimo y sucio, maullando bajito.',
          o: ['Gordo y limpio.', 'Herido en una pata.', 'Flaquísimo y sucio, maullando bajito.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hizo después de comer?', r: 'Durmió dieciséis horas seguidas.',
          o: ['Durmió dieciséis horas seguidas.', 'Salió al solar.', 'Se volvió a ir.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué anduvo dos semanas sin salir del corredor?', r: 'Porque venía agotado y todavía no se sentía seguro para alejarse.',
          o: ['Porque venía agotado y todavía no se sentía seguro para alejarse.', 'Porque lo tenían amarrado.', 'Porque le gustaba el corredor.'], c: 0 },
        { tipo: 'critica', q: '¿Qué quiso decir el papá con que «un gato jamás cuenta esas cosas»?', r: 'Respuesta abierta: se valora que note el humor y la idea de que hay cosas que no se pueden saber.',
          o: ['Que hay cosas que no vamos a saber nunca, y hay que aceptarlo.', 'Que los gatos no hablan y ya.', 'Que Michín estaba enojado.'], c: 0 },
      ] },

    { id: 'LD4-04', titulo: 'Cómo se tira la atarraya', genero: 'instructivo',
      texto: 'Primero mojá bien la red, porque seca no se abre. Colgate el cabo en la muñeca izquierda y juntá la atarraya cuidadosamente, dejando los plomos parejos abajo. Poné un pedazo entre los dientes si la tenés muy grande. Después mirá el agua un rato: donde el pez está, la superficie se riza distinto. Cuando ya lo tengás claro, girá el cuerpo y soltá todo de una vez, hacia afuera y bien arriba, no de frente. Si la red cae abierta y redonda, quedó bien tirada. Si cae hecha bulto, no atrapaste nada y hay que empezar otra vez. Nadie la tira bien la primera semana. Casi todos aprenden mirando a alguien más.',
      lugarTiempo: ['Primero', 'abajo', 'Después', 'ya', 'afuera', 'arriba'],
      modoCantidad: ['bien', 'cuidadosamente', 'muy', 'distinto', 'Casi'],
      neutros: ['no', 'seca', 'claro', 'parejos', 'izquierda'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué hay que mojar la red primero?', r: 'Porque seca no se abre.',
          o: ['Porque seca no se abre.', 'Para que pese más.', 'Para que no se enrede.'], c: 0 },
        { tipo: 'literal', q: '¿Cómo se sabe dónde está el pez?', r: 'La superficie del agua se riza distinto.',
          o: ['Por el ruido que hace.', 'Por el color del agua.', 'La superficie del agua se riza distinto.'], c: 2 },
        { tipo: 'literal', q: '¿Cómo debe caer la red si se tiró bien?', r: 'Abierta y redonda.',
          o: ['Hecha bulto.', 'Abierta y redonda.', 'De frente al pescador.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se suelta hacia afuera y arriba, y no de frente?', r: 'Porque así la red tiene tiempo de abrirse antes de tocar el agua.',
          o: ['Porque así la red tiene tiempo de abrirse antes de tocar el agua.', 'Porque de frente se moja el pescador.', 'Porque el cabo se enreda.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué casi todos aprenden mirando a alguien más? Argumenta.', r: 'Respuesta abierta: se valora que reconozca que el gesto no se explica bien con palabras.',
          o: ['Porque es más barato que un curso.', 'Porque ese movimiento no se explica bien con palabras: hay que verlo.', 'Porque nadie sabe explicarlo.'], c: 1 },
      ] },

    { id: 'LD4-05', titulo: 'La fiesta de los quince', genero: 'narrativo',
      texto: 'Mi prima Yohana cumplió quince el sábado pasado. Estuvimos preparando todo desde muy temprano: mi tía cocinó afuera, en un fogón grande, y nosotros acomodamos las sillas adentro. Llegó bastante gente, más de la que esperábamos. Yohana bailó primero con mi abuelo, despacito, y él se equivocó dos veces pero nadie se rió. Después sonó la música fuerte y ya no paramos hasta tarde. A medianoche mi tía lloró un poco, calladita, en la cocina. Dijo que no era tristeza, que era otra cosa que no sabía cómo se llamaba. Hoy todavía estamos recogiendo sillas prestadas.',
      lugarTiempo: ['temprano', 'afuera', 'adentro', 'primero', 'Después', 'ya', 'tarde', 'Hoy', 'todavía'],
      modoCantidad: ['muy', 'bastante', 'más', 'despacito', 'fuerte', 'poco', 'calladita'],
      neutros: ['no', 'pasado', 'grande', 'prestadas'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde cocinó la tía?', r: 'Afuera, en un fogón grande.',
          o: ['Afuera, en un fogón grande.', 'Adentro, en la cocina.', 'En casa de una vecina.'], c: 0 },
        { tipo: 'literal', q: '¿Con quién bailó Yohana primero?', r: 'Con su abuelo.',
          o: ['Con su tía.', 'Con un amigo de la escuela.', 'Con su abuelo.'], c: 2 },
        { tipo: 'literal', q: '¿Qué dijo la tía sobre su llanto?', r: 'Que no era tristeza, sino otra cosa que no sabía nombrar.',
          o: ['Que estaba cansada.', 'Que era de alegría.', 'Que no era tristeza, sino otra cosa que no sabía nombrar.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué nadie se rió cuando el abuelo se equivocó?', r: 'Porque entendieron lo que significaba para él bailar con su nieta.',
          o: ['Porque no se dieron cuenta.', 'Porque la música estaba muy fuerte.', 'Porque entendieron lo que significaba para él bailar con su nieta.'], c: 2 },
        { tipo: 'critica', q: '¿Vale la pena gastar tanto en una fiesta de quince años? Defiende tu postura.', r: 'Respuesta abierta: se valora que sostenga su postura hablando del costo, de la costumbre o de lo que significa para la familia.',
          o: ['Nunca: es dinero botado.', 'Depende de lo que la familia pueda y de lo que signifique para ellos.', 'Siempre: es lo más importante del año.'], c: 1 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LD5-01', titulo: 'El pizarrón de los precios', genero: 'narrativo',
      texto: 'Don Chepe vende verdura en el mercado de Danlí y escribe los precios afuera, en un pizarrón grande. Antes no lo hacía. Los ponía solamente de palabra y cada cliente preguntaba dos veces. Un día una señora le reclamó fuerte, delante de todos, que a ella le había cobrado más caro que a otro. Él revisó y descubrió que era cierto: se le había ido la mano sin querer. Esa misma tarde compró el pizarrón. Ahora escribe todo bien claro, y arriba pone la fecha. Vende exactamente igual que antes, ni más ni menos, pero ya nadie le discute. Dice que el pizarrón no le sirvió tanto para vender: le sirvió para que nadie dudara de él, que le dolía bastante más.',
      lugarTiempo: ['afuera', 'Antes', 'Ahora', 'arriba', 'ya', 'tarde'],
      modoCantidad: ['solamente', 'fuerte', 'más', 'bien', 'exactamente', 'menos', 'tanto', 'bastante'],
      neutros: ['no', 'cierto', 'claro', 'igual', 'caro'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo daba los precios antes?', r: 'Solamente de palabra.',
          o: ['En un papel pegado.', 'Solamente de palabra.', 'No los daba.'], c: 1 },
        { tipo: 'literal', q: '¿Qué escribe arriba del pizarrón?', r: 'La fecha.',
          o: ['Su nombre.', 'La fecha.', 'El total del día.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué compró el pizarrón esa misma tarde?', r: 'Porque comprobó que el reclamo era cierto y quiso evitar que volviera a pasar.',
          o: ['Porque estaba de oferta.', 'Porque comprobó que el reclamo era cierto y quiso evitar que volviera a pasar.', 'Porque se lo exigió el mercado.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué le dolía más que perder ventas?', r: 'Que la gente dudara de su honradez.',
          o: ['Que le reclamaran en voz alta.', 'Que la gente dudara de su honradez.', 'Que otro vendiera más barato.'], c: 1 },
        { tipo: 'critica', q: '¿Debería ser obligatorio poner los precios a la vista? Argumenta.', r: 'Respuesta abierta: se valora que hable de la confianza y del derecho del comprador a saber.',
          o: ['Sí: el comprador tiene derecho a saber antes de preguntar.', 'No: cada quien vende como quiere.', 'Solo en los supermercados.'], c: 0 },
      ] },

    { id: 'LD5-02', titulo: 'Corriendo la vuelta', genero: 'narrativo',
      texto: 'La carrera del pueblo son diez kilómetros y siempre la gana alguien de la montaña. Este año Elvin salió demasiado rápido y a los tres kilómetros ya venía sufriendo. Adelante iba Norman, que corre distinto: sale despacio, se mantiene atrás y aprieta apenas al final. Elvin lo miraba constantemente hacia atrás, y eso lo cansaba todavía más. En el kilómetro ocho lo alcanzó Norman, pasó suavemente por su lado y ni siquiera volteó a verlo. Elvin llegó cuarto. Después, sentado afuera de la iglesia y todavía con la respiración entrecortada, dijo despacio algo que su entrenador les repite ahora a todos sus corredores: yo no corrí mi carrera, corrí la de él.',
      lugarTiempo: ['siempre', 'ya', 'Adelante', 'atrás', 'final', 'Después', 'afuera', 'ahora', 'todavía'],
      modoCantidad: ['demasiado', 'rápido', 'distinto', 'despacio', 'apenas', 'constantemente', 'más', 'suavemente'],
      neutros: ['no', 'sentado', 'cuarto'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo corre Norman?', r: 'Sale despacio, se mantiene atrás y aprieta apenas al final.',
          o: ['Corre siempre al lado del rival.', 'Sale rapidísimo desde el principio.', 'Sale despacio, se mantiene atrás y aprieta apenas al final.'], c: 2 },
        { tipo: 'literal', q: '¿En qué lugar llegó Elvin?', r: 'Cuarto.',
          o: ['Segundo.', 'Primero.', 'Cuarto.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué mirar hacia atrás lo cansaba todavía más?', r: 'Porque gastaba energía y atención en el rival en vez de en su propio ritmo.',
          o: ['Porque gastaba energía y atención en el rival en vez de en su propio ritmo.', 'Porque se torcía el cuello.', 'Porque perdía el camino.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué significa «yo no corrí mi carrera, corrí la de él»?', r: 'Que ajustó su ritmo al del rival en vez de al que él podía sostener.',
          o: ['Que se equivocó de ruta.', 'Que ajustó su ritmo al del rival en vez de al que él podía sostener.', 'Que Norman le prestó su número.'], c: 1 },
        { tipo: 'critica', q: '¿Sirve esa lección fuera del deporte? Da un ejemplo.', r: 'Respuesta abierta: se valora que traslade la idea a otra situación —estudio, trabajo— con un ejemplo propio.',
          o: ['No: solo aplica a las carreras.', 'Solo si uno pierde.', 'Sí: pasa igual cuando uno estudia o trabaja midiéndose con otro.'], c: 2 },
      ] },

    { id: 'LD5-03', titulo: 'La abeja que baila', genero: 'expositivo',
      texto: 'Cuando una abeja encuentra flores lejos de la colmena, regresa y baila adentro, sobre el panal. No lo hace por gusto: está informando exactamente dónde está la comida. Si mueve la cola rápidamente en línea recta, indica la dirección con respecto al sol; si baila en círculos, la comida está muy cerca y no hace falta explicar tanto. Mientras más dura la parte recta del baile, más lejos queda el lugar. Las otras abejas la rodean, la tocan y después salen derecho hacia allá, aunque nunca han estado ahí. Un investigador tapó el sol con una lámina y las abejas empezaron a equivocarse enseguida. Así se comprobó que el baile no era casualidad: era un mensaje que se lee.',
      lugarTiempo: ['lejos', 'adentro', 'dónde', 'cerca', 'después', 'allá', 'nunca', 'ahí', 'enseguida'],
      modoCantidad: ['exactamente', 'rápidamente', 'muy', 'tanto', 'más', 'derecho', 'Así'],
      neutros: ['no', 'recta', 'casualidad'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué indica el baile en línea recta?', r: 'La dirección con respecto al sol.',
          o: ['La dirección con respecto al sol.', 'Cuántas flores hay.', 'Qué tipo de flor es.'], c: 0 },
        { tipo: 'literal', q: '¿Qué significa que baile en círculos?', r: 'Que la comida está muy cerca.',
          o: ['Que la comida está muy cerca.', 'Que la abeja está perdida.', 'Que hay peligro afuera.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cómo se sabe qué tan lejos está la comida?', r: 'Por lo que dura la parte recta del baile: mientras más dura, más lejos.',
          o: ['Por lo que dura la parte recta del baile.', 'Por el ruido que hace la abeja.', 'Por cuántas abejas salen.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué demostró el experimento de tapar el sol?', r: 'Que el baile usa el sol como referencia y por eso sin él las abejas se equivocan.',
          o: ['Que el baile usa el sol como referencia.', 'Que las abejas no ven de noche.', 'Que a las abejas no les gusta la sombra.'], c: 0 },
        { tipo: 'critica', q: '¿Se puede llamar «lenguaje» a lo que hace la abeja? Defiende tu postura.', r: 'Respuesta abierta: se valora que compare el baile con el lenguaje humano señalando algún parecido y alguna diferencia.',
          o: ['Comunica información precisa, aunque no sea igual que una lengua humana.', 'No: los animales no hablan.', 'Sí, es exactamente igual que hablar.'], c: 0 },
      ] },

    { id: 'LD5-04', titulo: 'El taller de reparar zapatos', genero: 'descriptivo',
      texto: 'Don Aurelio trabaja afuera, bajo un alero, porque adentro no entra bien la luz. Tiene ahí un banco bajito, una lata de clavos y una máquina de coser que mueve con el pie constantemente. Cose despacio, revisando cada puntada, y jamás entrega un par el mismo día: dice que el pegamento necesita dormir. La gente antes se molestaba bastante por esa demora. Ahora ya casi nadie reclama, porque saben que un zapato reparado por él dura muchísimo más que uno nuevo barato. Cerca del mediodía llegan los muchachos de la escuela y se quedan viendo cómo trabaja. Él no les habla mucho, pero tampoco los corre. Uno de ellos ya sabe cambiar una suela solo.',
      lugarTiempo: ['afuera', 'adentro', 'ahí', 'jamás', 'antes', 'Ahora', 'ya', 'Cerca'],
      modoCantidad: ['bien', 'constantemente', 'despacio', 'bastante', 'casi', 'muchísimo', 'más', 'mucho'],
      neutros: ['no', 'tampoco', 'bajito', 'nuevo', 'barato', 'solo'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué trabaja afuera?', r: 'Porque adentro no entra bien la luz.',
          o: ['Porque adentro no cabe la máquina.', 'Porque adentro no entra bien la luz.', 'Para que lo vean los clientes.'], c: 1 },
        { tipo: 'literal', q: '¿Por qué no entrega un par el mismo día?', r: 'Porque el pegamento necesita dormir.',
          o: ['Porque tiene mucho trabajo.', 'Porque el pegamento necesita dormir.', 'Porque cierra temprano.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué ya casi nadie reclama por la demora?', r: 'Porque comprobaron que su trabajo dura mucho más.',
          o: ['Porque comprobaron que su trabajo dura mucho más.', 'Porque ahora entrega más rápido.', 'Porque bajó los precios.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué está pasando con el muchacho que ya sabe cambiar una suela?', r: 'Que aprendió el oficio mirando, sin que nadie le diera clase.',
          o: ['Que aprendió el oficio mirando, sin que nadie le diera clase.', 'Que va a abrir su propio taller.', 'Que don Aurelio le cobra por enseñarle.'], c: 0 },
        { tipo: 'critica', q: '¿Conviene reparar o comprar nuevo? Defiende tu postura con una razón.', r: 'Respuesta abierta: se valora que compare precio, duración y basura generada.',
          o: ['Siempre comprar nuevo: sale más barato.', 'Siempre reparar, sin excepción.', 'Depende: lo barato dura poco y al final se gasta más y se bota más.'], c: 2 },
      ] },

    { id: 'LD5-05', titulo: 'La cancha se llena de noche', genero: 'expositivo',
      texto: 'La cancha del barrio Cabañas está vacía casi todo el día porque el sol pega durísimo y el cemento quema. Pero apenas cae la tarde empieza a llenarse. Primero llegan los niños, que juegan desordenadamente y gritan bastante. Luego, como a las seis, llegan los muchachos y el juego cambia completamente: se arman equipos, se respetan turnos y el que pierde sale. Más tarde, ya casi de noche, llegan los señores, que juegan lentamente y discuten menos. Cada grupo sabe cuándo le toca y nadie lo escribió nunca en ninguna parte. Cuando alguien intenta quedarse afuera de su horario, los demás se lo hacen ver enseguida, casi siempre en broma.',
      lugarTiempo: ['tarde', 'Primero', 'Luego', 'noche', 'cuándo', 'nunca', 'afuera', 'enseguida', 'siempre'],
      modoCantidad: ['casi', 'durísimo', 'apenas', 'desordenadamente', 'bastante', 'completamente', 'lentamente', 'menos', 'Más'],
      neutros: ['vacía'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué la cancha está vacía casi todo el día?', r: 'Porque el sol pega durísimo y el cemento quema.',
          o: ['Porque no hay pelota.', 'Porque está cerrada con candado.', 'Porque el sol pega durísimo y el cemento quema.'], c: 2 },
        { tipo: 'literal', q: '¿Quiénes llegan más tarde, ya casi de noche?', r: 'Los señores.',
          o: ['Los niños.', 'Los muchachos.', 'Los señores.'], c: 2 },
        { tipo: 'inferencial', q: '¿En qué cambia el juego cuando llegan los muchachos?', r: 'Se arman equipos, se respetan turnos y el que pierde sale.',
          o: ['Se juega con árbitro.', 'Se juega con pelota nueva.', 'Se arman equipos, se respetan turnos y el que pierde sale.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué muestra que nadie haya escrito nunca esos horarios?', r: 'Que la costumbre se sostiene sola, por acuerdo y no por reglamento.',
          o: ['Que nadie sabe escribir en el barrio.', 'Que la costumbre se sostiene sola, por acuerdo y no por reglamento.', 'Que el patronato se olvidó de hacerlo.'], c: 1 },
        { tipo: 'critica', q: '¿Funcionaría mejor la cancha con un horario escrito y un encargado? Argumenta.', r: 'Respuesta abierta: se valora que pese lo que aporta la regla escrita contra lo que ya funciona por costumbre.',
          o: ['Sí: sin reglamento todo es desorden.', 'Da igual, nadie respeta nada.', 'No necesariamente: lo que ya funciona por acuerdo se puede dañar al normarlo.'], c: 2 },
      ] },
  ],

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LD6-01', titulo: 'El reloj del cuerpo', genero: 'expositivo',
      texto: 'El cuerpo humano lleva adentro un reloj que funciona aunque uno nunca mire la hora. Se ajusta principalmente con la luz: cuando amanece, el ojo avisa al cerebro y este apaga poco a poco la hormona que da sueño. Por eso alguien que se acuesta muy tarde viendo una pantalla brillante duerme peor, aunque duerma igual cantidad de horas. La pantalla, tan cerca de la cara, le dice al cerebro que todavía es de día. Los estudios encontraron además que los adolescentes tienen ese reloj naturalmente corrido: les da sueño más tarde y se despiertan más tarde, y no es pereza. Algunos países movieron por eso la entrada del colegio media hora, y las notas subieron levemente. No es magia: simplemente dejaron de pedirle al cuerpo algo que biológicamente no podía dar todavía.',
      lugarTiempo: ['adentro', 'nunca', 'cuando', 'tarde', 'todavía'],
      modoCantidad: ['principalmente', 'poco', 'muy', 'peor', 'igual', 'tan', 'cerca', 'naturalmente', 'más', 'levemente', 'simplemente', 'biológicamente'],
      neutros: ['no', 'brillante', 'corrido', 'Algunos'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué se ajusta principalmente el reloj del cuerpo?', r: 'Con la luz.',
          o: ['Con el ejercicio.', 'Con la comida.', 'Con la luz.'], c: 2 },
        { tipo: 'literal', q: '¿Qué pasó donde movieron la entrada del colegio?', r: 'Las notas subieron levemente.',
          o: ['Los alumnos llegaron más tarde.', 'No cambió nada.', 'Las notas subieron levemente.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la pantalla cerca de la cara hace dormir peor?', r: 'Porque su luz le dice al cerebro que todavía es de día.',
          o: ['Porque cansa la vista.', 'Porque su luz le dice al cerebro que todavía es de día.', 'Porque hace ruido.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto aclara que «no es pereza»?', r: 'Porque el sueño corrido de los adolescentes tiene una causa biológica, no de voluntad.',
          o: ['Porque los adolescentes trabajan mucho.', 'Porque los maestros son muy exigentes.', 'Porque tiene una causa biológica, no de voluntad.'], c: 2 },
        { tipo: 'critica', q: '¿Debería tu escuela mover la hora de entrada? Argumenta.', r: 'Respuesta abierta: se valora que pese el argumento biológico contra los horarios de trabajo y transporte de las familias.',
          o: ['Sí, sin discutirlo: lo dice la ciencia.', 'Habría que ver: ayuda al sueño, pero choca con el horario de las familias.', 'No: siempre se ha entrado a la misma hora.'], c: 1 },
      ] },

    { id: 'LD6-02', titulo: 'La bajada de la carga', genero: 'narrativo',
      texto: 'La bestia venía cargada con dos sacos de café y bajaba lentamente por el atajo. Adelante iba Toño, jalando la cuerda cortita, y atrás su papá, mirando constantemente las patas del animal. En la parte más empinada la mula se paró en seco y no quiso seguir. Toño jaló fuerte, dos veces, y el animal solo asentó más las manos. Su papá se acercó despacio, le pasó la mano por el pescuezo y esperó ahí, callado, casi un minuto entero. Después la mula caminó sola. Más abajo, ya en lo plano, el muchacho preguntó qué había hecho. El papá contestó tranquilamente que él no había hecho nada: que el animal sabía perfectamente que ese paso estaba flojo, y que solo estaba esperando a que alguien le creyera.',
      lugarTiempo: ['Adelante', 'atrás', 'ahí', 'Después', 'abajo', 'ya'],
      modoCantidad: ['lentamente', 'cortita', 'constantemente', 'más', 'fuerte', 'despacio', 'casi', 'tranquilamente', 'perfectamente'],
      neutros: ['no', 'solo', 'plano', 'entero', 'callado', 'flojo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo el papá cuando la mula se paró?', r: 'Se acercó despacio, le pasó la mano por el pescuezo y esperó callado.',
          o: ['Le pegó con la cuerda.', 'Se acercó despacio, le pasó la mano por el pescuezo y esperó callado.', 'Le quitó los sacos.'], c: 1 },
        { tipo: 'literal', q: '¿Qué pasó cuando Toño jaló fuerte?', r: 'El animal asentó más las manos.',
          o: ['El animal asentó más las manos.', 'La mula avanzó de una vez.', 'Se cayó un saco.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la mula se paró en seco?', r: 'Porque sabía que ese paso estaba flojo.',
          o: ['Porque venía cansada.', 'Porque sabía que ese paso estaba flojo.', 'Porque le pesaba la carga.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiso decir el papá con «estaba esperando a que alguien le creyera»?', r: 'Que el animal ya había avisado del peligro y necesitaba que dejaran de forzarlo.',
          o: ['Que ya había avisado del peligro y necesitaba que dejaran de forzarlo.', 'Que había que darle comida.', 'Que la mula era desobediente.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve esa manera de tratar a un animal también entre personas? Argumenta.', r: 'Respuesta abierta: se valora que traslade la idea de escuchar antes de forzar a una situación humana.',
          o: ['Sí: cuando alguien se niega, muchas veces está avisando algo.', 'No: con la gente hay que ser firme.', 'Solo con los niños pequeños.'], c: 0 },
      ] },

    { id: 'LD6-03', titulo: 'El agua que se pierde de noche', genero: 'expositivo',
      texto: 'Una tubería vieja gotea siempre, pero de noche pierde mucho más. La razón está en la presión: cuando casi nadie abre la llave, el agua empuja fuertemente contra las paredes del tubo y sale más rápido por cualquier grieta. Por eso los técnicos miden el consumo justamente a las tres de la mañana, cuando el pueblo duerme. Si a esa hora el medidor sigue girando, ahí hay una fuga. El método suena simple y detecta problemas que de día quedan completamente escondidos entre el gasto normal. En un municipio del sur encontraron así una fuga enterrada bajo el asfalto que llevaba años botando el equivalente a lo que consumían ochenta casas diariamente. Nadie la había visto nunca, porque el agua se iba abajo, hacia una quebrada, sin aflorar arriba.',
      lugarTiempo: ['siempre', 'noche', 'cuando', 'ahí', 'nunca', 'abajo', 'arriba', 'diariamente'],
      modoCantidad: ['mucho', 'más', 'casi', 'fuertemente', 'rápido', 'justamente', 'completamente', 'así'],
      neutros: ['vieja', 'simple', 'normal', 'enterrada'],
      preguntas: [
        { tipo: 'literal', q: '¿A qué hora miden los técnicos el consumo?', r: 'A las tres de la mañana.',
          o: ['A las tres de la mañana.', 'Al mediodía.', 'Al anochecer.'], c: 0 },
        { tipo: 'literal', q: '¿Qué encontraron en el municipio del sur?', r: 'Una fuga enterrada bajo el asfalto.',
          o: ['Una fuga enterrada bajo el asfalto.', 'Un medidor dañado.', 'Un tanque roto.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué de noche se pierde más agua?', r: 'Porque casi nadie abre la llave y la presión dentro del tubo aumenta.',
          o: ['Porque hace más frío.', 'Porque nadie vigila las tuberías.', 'Porque casi nadie abre la llave y la presión dentro del tubo aumenta.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué nadie había visto nunca esa fuga?', r: 'Porque el agua se iba hacia abajo, a una quebrada, sin aflorar en la superficie.',
          o: ['Porque estaba fuera del pueblo.', 'Porque el medidor estaba descompuesto.', 'Porque el agua se iba hacia abajo sin aflorar en la superficie.'], c: 2 },
        { tipo: 'critica', q: '¿Conviene invertir en buscar fugas o en traer más agua? Defiende tu postura.', r: 'Respuesta abierta: se valora que compare el costo de cada opción con lo que se recupera.',
          o: ['Traer más agua: es lo que hace falta.', 'Ninguna de las dos: no hay dinero.', 'Buscar fugas primero: recuperar lo que ya se paga suele salir más barato.'], c: 2 },
      ] },

    { id: 'LD6-04', titulo: 'El que llegó de último', genero: 'narrativo',
      texto: 'En la maratón escolar de Comayagua, un muchacho de la aldea llegó tan atrás que ya estaban desarmando la meta. Había corrido casi todo el trayecto solo, sin nadie adelante ni atrás, y venía cojeando visiblemente desde el kilómetro seis. Los organizadores dudaron: técnicamente el tiempo ya había cerrado. Entonces un maestro tomó el megáfono y pidió a la gente que se quedara ahí un momento más. Cuando el muchacho entró, el público aplaudió fuertísimo, mucho más fuerte que cuando pasó el ganador. Él no entendió bien por qué y sonrió incómodo. Días después el maestro lo explicó así en clase: al primero lo aplaudimos por lo que hizo; a él lo aplaudimos por lo que no dejó de hacer, que muchas veces cuesta bastante más y casi nunca se ve desde la meta.',
      lugarTiempo: ['atrás', 'ya', 'adelante', 'desde', 'Entonces', 'ahí', 'después', 'Cuando'],
      modoCantidad: ['tan', 'casi', 'visiblemente', 'técnicamente', 'más', 'fuertísimo', 'mucho', 'fuerte', 'bien', 'así'],
      neutros: ['no', 'solo', 'incómodo', 'primero'],
      preguntas: [
        { tipo: 'literal', q: '¿Desde qué kilómetro venía cojeando?', r: 'Desde el kilómetro seis.',
          o: ['Desde el kilómetro seis.', 'Desde el arranque.', 'Desde el último kilómetro.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hizo el maestro con el megáfono?', r: 'Pidió a la gente que se quedara un momento más.',
          o: ['Anunció al ganador.', 'Suspendió la carrera.', 'Pidió a la gente que se quedara un momento más.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué dudaron los organizadores?', r: 'Porque técnicamente el tiempo ya había cerrado.',
          o: ['Porque no lo tenían inscrito.', 'Porque venía lesionado.', 'Porque técnicamente el tiempo ya había cerrado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué diferencia hace el maestro entre los dos aplausos?', r: 'Al ganador se le aplaude el resultado; al último, el no haberse rendido.',
          o: ['Que uno fue más largo que el otro.', 'Al ganador se le aplaude el resultado; al último, el no haberse rendido.', 'Que al ganador nadie lo aplaudió.'], c: 1 },
        { tipo: 'critica', q: '¿Está bien aplaudir más al último que al primero? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca el mérito de ambos sin anular ninguno.',
          o: ['Se pueden reconocer las dos cosas: son logros distintos.', 'No: eso le quita mérito al que ganó.', 'Sí: ganar no tiene ningún mérito.'], c: 0 },
      ] },

    { id: 'LD6-05', titulo: 'Cómo suena una casa vacía', genero: 'descriptivo',
      texto: 'Una casa sin muebles suena completamente distinta. El sonido rebota duramente contra las paredes desnudas y vuelve enseguida, de manera que la voz parece más grande y a la vez más ajena. Adentro, cualquier paso retumba; afuera, en cambio, se oye exactamente igual que antes. Los que se mudan lo notan siempre el último día, cuando ya sacaron todo: hablan más bajito sin darse cuenta, como si estuvieran en un lugar que ya no les pertenece. Un albañil lo explica prácticamente al revés: dice que la casa no cambió nada, que lo que se fue es lo que amortiguaba. Las cortinas, los colchones y hasta la ropa colgada se tragaban el sonido calladamente, todos los días, sin que nadie lo notara jamás. Nadie agradece nunca lo que trabaja bien y en silencio.',
      lugarTiempo: ['enseguida', 'Adentro', 'afuera', 'antes', 'siempre', 'ya', 'jamás', 'cuando'],
      modoCantidad: ['completamente', 'duramente', 'más', 'exactamente', 'igual', 'bajito', 'prácticamente', 'calladamente'],
      neutros: ['no', 'distinta', 'desnudas', 'ajena', 'colgada', 'último'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo se oye la voz en una casa vacía?', r: 'Más grande y a la vez más ajena.',
          o: ['Más baja y apagada.', 'Más grande y a la vez más ajena.', 'Exactamente igual que siempre.'], c: 1 },
        { tipo: 'literal', q: '¿Qué dice el albañil que cambió?', r: 'Nada de la casa: lo que se fue es lo que amortiguaba.',
          o: ['Nada de la casa: lo que se fue es lo que amortiguaba.', 'Que las paredes se secaron.', 'Que el techo se levantó.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la gente habla más bajito el último día?', r: 'Porque el eco les hace sentir que el lugar ya no es suyo.',
          o: ['Porque están tristes y cansados.', 'Porque el eco les hace sentir que el lugar ya no es suyo.', 'Porque no quieren que los oigan los vecinos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué hacían las cortinas y los colchones sin que nadie lo notara?', r: 'Se tragaban el sonido todos los días.',
          o: ['Guardaban el polvo de la casa.', 'Se tragaban el sonido todos los días.', 'Mantenían fresca la casa.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué solemos notar las cosas solo cuando faltan? Argumenta.', r: 'Respuesta abierta: se valora que dé una explicación propia sobre la costumbre y la atención.',
          o: ['Porque lo que funciona bien y siempre deja de llamar la atención.', 'Porque somos desagradecidos.', 'Porque no nos fijamos en nada.'], c: 0 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LD7-01', titulo: 'Lo que cambia una raya en la calle', genero: 'expositivo',
      texto: 'En un tramo de la salida de Siguatepeque atropellaban peatones constantemente. La calle era ancha, recta y estaba muy bien pavimentada, y precisamente por eso los carros pasaban rapidísimo. Los vecinos pidieron durante años un semáforo, que nunca llegó. Entonces un ingeniero municipal propuso algo mucho más barato: pintar la calzada de manera que pareciera más angosta. Pintaron dos franjas anchas a los lados, un paso peatonal bien marcado y unas líneas transversales que se van juntando gradualmente antes del cruce. No pusieron ni un tope ni una señal nueva. Los conductores empezaron a levantar el pie casi sin darse cuenta, porque el ojo lee esas líneas como un embudo y el cuerpo frena solo. Al año siguiente los atropellos habían bajado bastante. La calle sigue siendo exactamente igual de ancha que antes: lo único que cambió fue lo que aparenta, y eso bastó para que la gente cruzara tranquila.',
      lugarTiempo: ['constantemente', 'antes', 'nunca', 'Entonces', 'siguiente'],
      modoCantidad: ['muy', 'bien', 'precisamente', 'rapidísimo', 'mucho', 'más', 'gradualmente', 'casi', 'bastante', 'igual'],
      neutros: ['no', 'ancha', 'recta', 'angosta', 'solo', 'único'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué pidieron los vecinos durante años?', r: 'Un semáforo.',
          o: ['Más policía.', 'Un tope de velocidad.', 'Un semáforo.'], c: 2 },
        { tipo: 'literal', q: '¿Qué pintaron en la calzada?', r: 'Dos franjas anchas, un paso peatonal y líneas transversales que se juntan.',
          o: ['Solo el paso peatonal.', 'Dos franjas anchas, un paso peatonal y líneas transversales que se juntan.', 'Flechas de dirección.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué una calle ancha y bien pavimentada era más peligrosa?', r: 'Porque invitaba a los conductores a ir rapidísimo.',
          o: ['Porque no tenía aceras.', 'Porque invitaba a los conductores a ir rapidísimo.', 'Porque los peatones cruzaban donde querían.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué los conductores frenaban «casi sin darse cuenta»?', r: 'Porque el ojo lee las líneas como un embudo y el cuerpo reacciona antes que la decisión.',
          o: ['Porque había un policía escondido.', 'Porque el ojo lee las líneas como un embudo y el cuerpo reacciona solo.', 'Porque la pintura era resbalosa.'], c: 1 },
        { tipo: 'critica', q: '¿Es válido resolver un problema cambiando lo que la gente percibe y no la calle? Argumenta.', r: 'Respuesta abierta: se valora que discuta si el resultado justifica la estrategia o si es una manera de engañar.',
          o: ['No: eso es engañar a los conductores.', 'Es válido si salva vidas y no oculta ningún peligro real.', 'Sí, y además fue barato.'], c: 1 },
      ] },

    { id: 'LD7-02', titulo: 'El silencio del examen', genero: 'narrativo',
      texto: 'La profesora Miriam repartió el examen boca abajo y dijo tranquilamente que nadie lo volteara todavía. Explicó lentamente las instrucciones, dos veces, y solo entonces autorizó empezar. Al minuto Kevin levantó la mano: no entendía la pregunta cuatro. Ella se acercó, la leyó otra vez con él en voz muy baja y se dio cuenta de que la pregunta efectivamente estaba mal redactada. Podría haberla dejado así, porque técnicamente el error no era grave. En cambio detuvo el examen completamente, pidió atención y corrigió la pregunta en el pizarrón, delante de todos. Después dijo algo que aquel grupo repitió durante años: si la pregunta está mala, la respuesta equivocada no es de ustedes, es mía. Ese día nadie sacó una nota distinta por eso. Pero varios entendieron perfectamente, y para siempre, algo que ninguna clase les había explicado antes: para qué sirve reconocer un error a tiempo.',
      lugarTiempo: ['todavía', 'entonces', 'Después', 'durante'],
      modoCantidad: ['tranquilamente', 'lentamente', 'solo', 'muy', 'efectivamente', 'así', 'técnicamente', 'completamente', 'perfectamente'],
      neutros: ['no', 'abajo', 'grave', 'distinta', 'mala'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo la profesora al descubrir el error?', r: 'Detuvo el examen y corrigió la pregunta en el pizarrón.',
          o: ['Anuló la pregunta sin decir nada.', 'Se lo explicó solo a Kevin.', 'Detuvo el examen y corrigió la pregunta en el pizarrón.'], c: 2 },
        { tipo: 'literal', q: '¿Qué pasó con las notas ese día?', r: 'Nadie sacó una nota distinta por eso.',
          o: ['Nadie sacó una nota distinta por eso.', 'Todos subieron un punto.', 'Se repitió el examen.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué podría haber dejado la pregunta como estaba?', r: 'Porque técnicamente el error no era grave y casi nadie lo habría notado.',
          o: ['Porque ya no quedaba tiempo.', 'Porque el examen no valía nota.', 'Porque técnicamente el error no era grave y casi nadie lo habría notado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué aprendieron varios alumnos ese día?', r: 'Para qué sirve reconocer un error a tiempo.',
          o: ['Para qué sirve reconocer un error a tiempo.', 'Que conviene preguntar en los exámenes.', 'Que hay que leer despacio.'], c: 0 },
        { tipo: 'critica', q: '¿Pierde autoridad quien reconoce un error delante de otros? Defiende tu postura.', r: 'Respuesta abierta: se valora que argumente sobre la confianza y el ejemplo, no solo sobre la imagen.',
          o: ['Sí: después nadie le hace caso.', 'Depende de cuántos lo vean.', 'No: se gana la confianza, que sostiene más que la imagen.'], c: 2 },
      ] },

    { id: 'LD7-03', titulo: 'Cuando el volcán avisa', genero: 'expositivo',
      texto: 'Un volcán activo casi nunca estalla de repente: avisa antes, aunque lo hace en un idioma que hay que aprender a leer. Primero tiembla levemente, muchas veces al día, con sismos tan pequeños que la gente ni los siente y solo los registran los aparatos. Después el suelo se infla milimétricamente, porque el magma empuja desde abajo, y unos medidores muy precisos detectan que la ladera creció apenas unos centímetros. También cambian los gases: sale más azufre y sale más rápido. Ninguna de esas señales sirve sola. Los vulcanólogos las miran todas juntas y aun así hablan siempre de probabilidad, nunca de certeza. Por eso una evacuación se decide difícilmente: sacar a diez mil personas cuesta muchísimo y desgasta la confianza si no pasa nada, pero no sacarlas a tiempo cuesta lo que no se repone después, y esa cuenta la carga siempre alguien que tuvo que decidir rapidísimo y con datos incompletos.',
      lugarTiempo: ['antes', 'Primero', 'Después', 'abajo', 'siempre', 'nunca'],
      modoCantidad: ['casi', 'levemente', 'tan', 'solo', 'milimétricamente', 'muy', 'apenas', 'más', 'rápido', 'así', 'difícilmente', 'muchísimo'],
      neutros: ['no', 'activo', 'precisos', 'juntas', 'sola'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué pasa con el suelo antes de una erupción?', r: 'Se infla milimétricamente porque el magma empuja desde abajo.',
          o: ['Se hunde varios metros.', 'Se infla milimétricamente porque el magma empuja desde abajo.', 'Se agrieta a la vista.'], c: 1 },
        { tipo: 'literal', q: '¿De qué hablan siempre los vulcanólogos?', r: 'De probabilidad, nunca de certeza.',
          o: ['De probabilidad, nunca de certeza.', 'De fechas exactas.', 'De la altura de la ceniza.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué ninguna señal sirve sola?', r: 'Porque cada una por separado puede tener otras causas; juntas dan una idea más confiable.',
          o: ['Porque cada una por separado puede tener otras causas.', 'Porque los aparatos fallan seguido.', 'Porque son muy caras de medir.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué una evacuación «se decide difícilmente»?', r: 'Porque equivocarse por exceso desgasta la confianza y equivocarse por defecto cuesta vidas.',
          o: ['Porque equivocarse por exceso desgasta la confianza y por defecto cuesta vidas.', 'Porque la gente no quiere salir.', 'Porque no hay transporte suficiente.'], c: 0 },
        { tipo: 'critica', q: '¿Qué debería hacer una autoridad ante una probabilidad alta pero no segura? Propón algo.', r: 'Respuesta abierta: se valora que proponga una medida gradual y no solo evacuar o no evacuar.',
          o: ['Esperar a estar segura del todo.', 'Evacuar siempre, por si acaso.', 'Avisar con niveles y preparar la salida antes de ordenarla.'], c: 2 },
      ] },

    { id: 'LD7-04', titulo: 'El puesto de baleadas', genero: 'narrativo',
      texto: 'Doña Reina puso su puesto de baleadas afuera de una maquila, justamente donde salen los turnos. Abre a las cuatro y media de la mañana, mucho antes que cualquiera, y cierra tarde. Trabaja rapidísimo: echa la tortilla, unta los frijoles y arma cada baleada en menos de un minuto, hablando todo el tiempo con la fila. Nunca apunta nada. Se acuerda perfectamente de quién debe y de quién pagó de más la semana pasada. Un día un ingeniero de la maquila le propuso instalarle un sistema de cuentas en el celular. Ella lo escuchó atentamente, le agradeció y le dijo que no. Después explicó por qué: si empieza a mirar la pantalla, deja de mirar a la gente, y entonces ya no va a saber quién viene mal, quién no ha comido y a quién hay que fiarle sin que lo pida.',
      lugarTiempo: ['afuera', 'antes', 'tarde', 'Nunca', 'Después', 'entonces', 'ya', 'pasada'],
      modoCantidad: ['justamente', 'mucho', 'rapidísimo', 'menos', 'perfectamente', 'más', 'atentamente', 'mal'],
      neutros: ['no', 'media'],
      preguntas: [
        { tipo: 'literal', q: '¿En cuánto tiempo arma cada baleada?', r: 'En menos de un minuto.',
          o: ['Depende del pedido.', 'En cinco minutos.', 'En menos de un minuto.'], c: 2 },
        { tipo: 'literal', q: '¿Qué le propuso el ingeniero?', r: 'Instalarle un sistema de cuentas en el celular.',
          o: ['Comprarle el puesto.', 'Cambiarle el horario.', 'Instalarle un sistema de cuentas en el celular.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué abre a las cuatro y media?', r: 'Porque a esa hora salen los turnos de la maquila.',
          o: ['Porque a esa hora salen los turnos de la maquila.', 'Porque no puede dormir.', 'Porque la competencia abre después.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué dijo que no al sistema de cuentas?', r: 'Porque mirar la pantalla la haría dejar de mirar a la gente y perdería lo que de verdad sabe.',
          o: ['Porque mirar la pantalla la haría dejar de mirar a la gente.', 'Porque le parecía caro.', 'Porque no sabe usar el celular.'], c: 0 },
        { tipo: 'critica', q: '¿Tiene razón doña Reina o le conviene modernizarse? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca lo que gana y lo que perdería con el cambio.',
          o: ['Le conviene: así no pierde dinero.', 'Ella sabe qué sostiene su negocio; la herramienta debería sumar, no reemplazar eso.', 'Tiene razón: la tecnología no sirve.'], c: 1 },
      ] },

    { id: 'LD7-05', titulo: 'Por qué se cae un puente peatonal', genero: 'expositivo',
      texto: 'Un puente peatonal no se cae generalmente por el peso de la gente. Se cae por lo que nadie mira: el óxido que avanza silenciosamente en la base de las columnas, justo donde el agua se empoza y se queda ahí semanas enteras. Ese punto casi nunca se revisa porque está abajo, tapado por basura o por zacate crecido. Arriba, en cambio, todo se ve perfectamente bien: la baranda pintada, el piso firme, las gradas completas. Los ingenieros lo llaman deterioro oculto y advierten que una estructura así puede aguantar años y fallar de golpe, sin doblarse antes ni crujir. Por eso una inspección seria empieza siempre por lo más incómodo: agacharse, apartar la basura y golpear el metal para oír si suena hueco. Lo que suena mal abajo importa muchísimo más que lo que se ve bien arriba, y sin embargo casi nunca es lo primero que alguien va a revisar.',
      lugarTiempo: ['ahí', 'nunca', 'abajo', 'Arriba', 'antes', 'siempre', 'años'],
      modoCantidad: ['generalmente', 'silenciosamente', 'justo', 'casi', 'perfectamente', 'bien', 'así', 'más', 'muchísimo', 'mal'],
      neutros: ['no', 'crecido', 'firme', 'completas', 'oculto', 'hueco', 'seria'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde avanza el óxido?', r: 'En la base de las columnas, donde el agua se empoza.',
          o: ['En la baranda de arriba.', 'En la base de las columnas, donde el agua se empoza.', 'En el piso del puente.'], c: 1 },
        { tipo: 'literal', q: '¿Cómo empieza una inspección seria?', r: 'Agachándose, apartando la basura y golpeando el metal.',
          o: ['Agachándose, apartando la basura y golpeando el metal.', 'Midiendo el ancho del puente.', 'Contando cuánta gente pasa.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué ese punto casi nunca se revisa?', r: 'Porque está abajo, tapado por basura o zacate, y no se ve.',
          o: ['Porque revisarlo es muy caro.', 'Porque está abajo, tapado por basura o zacate, y no se ve.', 'Porque no hay ingenieros suficientes.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué es peligroso el deterioro oculto?', r: 'Porque la estructura aguanta años y falla de golpe, sin dar aviso visible.',
          o: ['Porque la estructura aguanta años y falla de golpe, sin aviso visible.', 'Porque obliga a cerrar el puente seguido.', 'Porque el óxido mancha la pintura.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué crees que se invierte más en pintar que en revisar la base? Argumenta.', r: 'Respuesta abierta: se valora que note que lo visible da rédito inmediato y lo invisible no.',
          o: ['Porque pintar es más barato.', 'Porque nadie sabe revisar.', 'Porque lo que se ve se luce y lo que no se ve no le da crédito a nadie.'], c: 2 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LD8-01', titulo: 'La cola que avanza más despacio', genero: 'expositivo',
      texto: 'En un banco con cinco cajas, la gente siempre siente que su fila avanza más lentamente que las demás. No es mala suerte ni imaginación: es estadística. Si hay cinco filas parejas, la probabilidad de que la suya sea justamente la más rápida es apenas de una entre cinco. Cuatro veces de cada cinco, alguna otra irá mejor, y eso es exactamente lo que uno recuerda después. Por eso muchos bancos cambiaron completamente el sistema y pusieron una sola fila que alimenta todas las cajas. Ahí el tiempo promedio no baja casi nada, porque los cajeros atienden igual de rápido que antes. Lo que cambia radicalmente es otra cosa: nadie puede quedarse atrapado detrás de un trámite lentísimo mientras al lado despachan rapidísimo. La espera se vuelve pareja, y una espera pareja se siente muchísimo más corta aunque el reloj marque exactamente lo mismo. Lo que molesta profundamente no es esperar: es ver que al lado avanzan y uno no.',
      lugarTiempo: ['siempre', 'después', 'Ahí', 'antes', 'detrás'],
      modoCantidad: ['más', 'lentamente', 'apenas', 'mejor', 'exactamente', 'completamente', 'casi', 'igual', 'rápido', 'radicalmente', 'lentísimo', 'rapidísimo', 'muchísimo', 'profundamente'],
      neutros: ['no', 'parejas', 'pareja', 'corta'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué probabilidad hay de que tu fila sea la más rápida entre cinco?', r: 'Apenas una entre cinco.',
          o: ['Apenas una entre cinco.', 'La mitad de las veces.', 'Ninguna.'], c: 0 },
        { tipo: 'literal', q: '¿Qué sistema pusieron muchos bancos?', r: 'Una sola fila que alimenta todas las cajas.',
          o: ['Más cajeros por caja.', 'Una sola fila que alimenta todas las cajas.', 'Turnos con número.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué uno recuerda que su fila iba más lenta?', r: 'Porque cuatro de cada cinco veces alguna otra fila efectivamente va mejor.',
          o: ['Porque cuatro de cada cinco veces alguna otra fila efectivamente va mejor.', 'Porque uno se fija solo en lo malo.', 'Porque los cajeros trabajan distinto.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la fila única se siente más corta si el reloj marca lo mismo?', r: 'Porque nadie queda atrapado detrás de un trámite lento y la espera se vuelve pareja.',
          o: ['Porque hay menos gente.', 'Porque los cajeros se apuran más.', 'Porque nadie queda atrapado detrás de un trámite lento y la espera se vuelve pareja.'], c: 2 },
        { tipo: 'critica', q: '¿Vale la pena un cambio que no ahorra tiempo pero mejora cómo se siente la espera? Argumenta.', r: 'Respuesta abierta: se valora que discuta si la percepción cuenta como resultado real.',
          o: ['No: si no ahorra tiempo, no sirve de nada.', 'Solo si además ponen más cajeros.', 'Sí: la injusticia percibida también es un costo, y ese sí bajó.'], c: 2 },
      ] },

    { id: 'LD8-02', titulo: 'El maestro que hablaba poco', genero: 'narrativo',
      texto: 'El profesor Fabio daba Matemáticas y hablaba notablemente menos que los demás. Escribía un problema en el pizarrón, se sentaba atrás en su escritorio y esperaba tranquilamente. Al principio la clase se desesperaba: alguien preguntaba y él respondía solamente con otra pregunta. Muchos lo detestaron el primer mes. Después, lentamente, el aula cambió. Los alumnos empezaron a discutir entre ellos, primero tímidamente y luego bastante fuerte, y alguno pasaba adelante a defender su procedimiento. Fabio corregía únicamente cuando alguien se iba a quedar con un error grande. Al final del año, aquel grupo resolvía problemas que nunca les habían enseñado directamente. Una madre le reclamó una vez que él casi no explicaba. Fabio le contestó despacio que explicar demasiado bien tiene un problema: el alumno entiende perfectamente en el momento y después no vuelve a pensarlo nunca más. Años más tarde, varios de aquel grupo volvieron expresamente a buscarlo para decírselo, y él los escuchó igual que siempre: callado, sentado atrás, sin apurar a nadie.',
      lugarTiempo: ['atrás', 'principio', 'Después', 'luego', 'adelante', 'final', 'nunca', 'tarde'],
      modoCantidad: ['notablemente', 'menos', 'tranquilamente', 'solamente', 'lentamente', 'tímidamente', 'bastante', 'fuerte', 'únicamente', 'directamente', 'casi', 'despacio', 'demasiado', 'bien', 'perfectamente', 'más', 'expresamente'],
      neutros: ['no', 'primer', 'grande'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hacía Fabio después de escribir un problema?', r: 'Se sentaba atrás y esperaba tranquilamente.',
          o: ['Se sentaba atrás y esperaba tranquilamente.', 'Lo resolvía en el pizarrón.', 'Preguntaba quién lo sabía.'], c: 0 },
        { tipo: 'literal', q: '¿Cuándo corregía?', r: 'Únicamente cuando alguien se iba a quedar con un error grande.',
          o: ['Cada vez que alguien fallaba.', 'Nunca corregía.', 'Únicamente cuando alguien se iba a quedar con un error grande.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué muchos lo detestaron el primer mes?', r: 'Porque esperaban que explicara y él los dejaba resolver solos.',
          o: ['Porque esperaban que explicara y él los dejaba resolver solos.', 'Porque ponía exámenes difíciles.', 'Porque hablaba muy despacio.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cuál es el problema de explicar «demasiado bien», según Fabio?', r: 'Que el alumno entiende en el momento y ya no vuelve a pensar el asunto.',
          o: ['Que el maestro se cansa mucho.', 'Que el alumno entiende en el momento y ya no vuelve a pensarlo.', 'Que la clase se hace larga.'], c: 1 },
        { tipo: 'critica', q: '¿Es justo con los alumnos un maestro así? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca el valor del método y también el riesgo para quien se queda atrás.',
          o: ['Sí, y no hay más que discutir: da resultado.', 'Da resultado, pero necesita cuidar al que se queda atrás y no lo dice.', 'No: un maestro está para explicar.'], c: 1 },
      ] },

    { id: 'LD8-03', titulo: 'La represa que se llenó de tierra', genero: 'expositivo',
      texto: 'Una represa no se acaba solamente cuando se rompe. Se acaba lentamente, por dentro, cuando el vaso se llena de sedimento. Cada invierno el río arrastra tierra desde las laderas de arriba y la deposita ahí, calladamente, año tras año. Si la cuenca está deforestada, el arrastre aumenta muchísimo: donde antes bajaba poca tierra, ahora baja bastante más. El agua embalsada se queda quieta, la tierra se asienta abajo y el volumen útil disminuye gradualmente. Nadie lo nota afuera, porque el espejo de agua se ve exactamente igual de grande. Pero el mismo embalse guarda cada vez menos y aguanta peor un verano largo. Sacar ese sedimento después cuesta enormemente más que haber sembrado árboles arriba a tiempo. Por eso los ingenieros repiten siempre lo mismo: una represa no se cuida principalmente en la cortina, se cuida allá arriba, donde nadie la ve y donde casi nunca alcanza el presupuesto. Ahí se decide silenciosamente cuántos años va a durar.',
      lugarTiempo: ['dentro', 'arriba', 'ahí', 'antes', 'ahora', 'abajo', 'afuera', 'después', 'siempre', 'allá'],
      modoCantidad: ['solamente', 'lentamente', 'calladamente', 'muchísimo', 'poca', 'bastante', 'más', 'gradualmente', 'exactamente', 'igual', 'menos', 'peor', 'enormemente', 'principalmente', 'silenciosamente'],
      neutros: ['no', 'útil', 'quieta', 'largo', 'grande'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué se acumula dentro del vaso de la represa?', r: 'Sedimento, es decir, tierra arrastrada por el río.',
          o: ['Agua de lluvia sucia.', 'Basura de los pueblos.', 'Sedimento, es decir, tierra arrastrada por el río.'], c: 2 },
        { tipo: 'literal', q: '¿Por qué nadie lo nota desde afuera?', r: 'Porque el espejo de agua se ve igual de grande.',
          o: ['Porque el acceso está cerrado.', 'Porque nadie mide el volumen.', 'Porque el espejo de agua se ve igual de grande.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué relación hay entre la deforestación y la vida de la represa?', r: 'Sin árboles arriba baja mucha más tierra, y el embalse se llena antes.',
          o: ['Ninguna: son cosas separadas.', 'Sin árboles arriba baja mucha más tierra, y el embalse se llena antes.', 'Los árboles consumen el agua del embalse.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se dice que la represa «se cuida allá arriba»?', r: 'Porque el problema se origina en la cuenca, no en la obra misma.',
          o: ['Porque arriba está la oficina técnica.', 'Porque la cortina no necesita mantenimiento.', 'Porque el problema se origina en la cuenca, no en la obra misma.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué es tan difícil convencer de invertir arriba y no en la obra? Argumenta.', r: 'Respuesta abierta: se valora que note que lo invisible y lo lento no dan rédito político ni se ven.',
          o: ['Porque sembrar árboles es carísimo.', 'Porque los ingenieros no lo explican.', 'Porque lo que se hace arriba no se ve, y lo que no se ve no luce ni da votos.'], c: 2 },
      ] },

    { id: 'LD8-04', titulo: 'Cuando se apagó el motor', genero: 'narrativo',
      texto: 'Íbamos en la lancha rumbo a Cayos Cochinos cuando el motor tosió dos veces y se apagó completamente. El silencio de repente fue lo más raro: hasta entonces nadie se había fijado en cuánto ruido hacía. El motorista, don Beto, no se alteró absolutamente nada. Levantó la tapa, revisó despacio la manguera de combustible y encontró rápidamente una burbuja de aire. Mientras tanto la lancha se movía cada vez más, porque sin motor la proa se atraviesa y las olas pegan de lado. Una señora empezó a rezar bastante fuerte y dos muchachos se pararon al mismo tiempo. Ahí don Beto habló por primera vez, tranquilamente pero firme: siéntense todos, ya. Lo dijo suavemente y nadie discutió. Después explicó por qué: de pie, con la lancha meciéndose así, cualquiera se cae, y un hombre al agua es mucho peor problema que un motor apagado. Purgó la manguera pacientemente, arrancó de nuevo al tercer intento y seguimos como si nada hubiera pasado.',
      lugarTiempo: ['entonces', 'Mientras', 'Ahí', 'Después', 'ya'],
      modoCantidad: ['completamente', 'más', 'absolutamente', 'despacio', 'rápidamente', 'bastante', 'fuerte', 'tranquilamente', 'suavemente', 'así', 'mucho', 'peor', 'pacientemente', 'nuevo'],
      neutros: ['no', 'raro', 'firme', 'pie', 'apagado', 'primera'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué encontró don Beto al revisar?', r: 'Una burbuja de aire en la manguera de combustible.',
          o: ['Que se había acabado la gasolina.', 'Una burbuja de aire en la manguera de combustible.', 'Una hélice quebrada.'], c: 1 },
        { tipo: 'literal', q: '¿Qué les ordenó a los pasajeros?', r: 'Que se sentaran todos, ya.',
          o: ['Que se pusieran el chaleco.', 'Que se sentaran todos, ya.', 'Que remaran con las manos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la lancha empezó a moverse más?', r: 'Porque sin motor la proa se atraviesa y las olas pegan de lado.',
          o: ['Porque sin motor la proa se atraviesa y las olas pegan de lado.', 'Porque subió el viento.', 'Porque la gente se movió.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué dio la orden suavemente y no gritando?', r: 'Porque gritar habría aumentado el pánico que estaba tratando de contener.',
          o: ['Porque no quería despertar a nadie.', 'Porque estaba muy cansado.', 'Porque gritar habría aumentado el pánico que trataba de contener.'], c: 2 },
        { tipo: 'critica', q: '¿Qué hace que alguien obedezca en una emergencia? Argumenta.', r: 'Respuesta abierta: se valora que hable de la calma, la autoridad ganada y la claridad de la orden.',
          o: ['El miedo: la gente obedece por susto.', 'Que quien manda esté calmado, sepa lo que hace y lo diga claro.', 'El grito más fuerte.'], c: 1 },
      ] },

    { id: 'LD8-05', titulo: 'El mapa que se hizo caminando', genero: 'expositivo',
      texto: 'Cuando en una aldea no existe mapa, los proyectos llegan diseñados desde afuera y casi siempre fallan. En una comunidad de Intibucá lo resolvieron distinto. Reunieron a treinta vecinos y dibujaron el mapa entre todos, directamente en el suelo, con maíz, piedras y ceniza. Marcaron primero las casas, después los caminos y luego, muy cuidadosamente, las fuentes de agua. Ahí apareció lo que ningún técnico había visto antes: dos manantiales que en verano bajan notablemente y una vivienda que queda demasiado abajo del tanque, adonde el agua nunca llega bien. Los ancianos señalaron además dónde antes había bosque y dónde ya no. Alguien fotografió todo aquello y después lo pasaron limpiamente a papel. Ese mapa costó exactamente cero lempiras y cambió por completo el proyecto: lo que iba a ser una tubería recta terminó siendo otra cosa, notoriamente más larga y bastante más útil. Hoy el agua llega arriba y abajo por igual, todos los días del año.',
      lugarTiempo: ['afuera', 'siempre', 'primero', 'después', 'luego', 'Ahí', 'antes', 'abajo', 'nunca', 'ya', 'dónde', 'adonde', 'Hoy'],
      modoCantidad: ['casi', 'distinto', 'directamente', 'muy', 'cuidadosamente', 'notablemente', 'demasiado', 'bien', 'limpiamente', 'exactamente', 'más', 'bastante', 'notoriamente'],
      neutros: ['no', 'recta', 'larga', 'útil'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué materiales dibujaron el mapa?', r: 'Con maíz, piedras y ceniza, en el suelo.',
          o: ['Con maíz, piedras y ceniza, en el suelo.', 'Con lápiz sobre papel grande.', 'Con un programa de computadora.'], c: 0 },
        { tipo: 'literal', q: '¿Qué apareció que ningún técnico había visto?', r: 'Dos manantiales que bajan en verano y una vivienda demasiado abajo del tanque.',
          o: ['Dos manantiales que bajan en verano y una vivienda demasiado abajo del tanque.', 'Un camino más corto a la cabecera.', 'Una escuela sin registrar.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué fallan los proyectos diseñados desde afuera?', r: 'Porque no conocen detalles del terreno que solo sabe quien vive ahí.',
          o: ['Porque no conocen detalles del terreno que solo sabe quien vive ahí.', 'Porque los técnicos no estudian.', 'Porque siempre son muy caros.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el texto subraya que el mapa costó cero lempiras?', r: 'Para mostrar que lo decisivo no fue el dinero sino el conocimiento de la gente.',
          o: ['Para criticar a los que cobran por hacer mapas.', 'Para mostrar que lo decisivo no fue el dinero sino el conocimiento de la gente.', 'Porque no tenían presupuesto.'], c: 1 },
        { tipo: 'critica', q: '¿Debería exigirse un mapa hecho así antes de cualquier obra comunitaria? Argumenta.', r: 'Respuesta abierta: se valora que note las ventajas y también el costo en tiempo y organización.',
          o: ['Convendría, aunque exige tiempo y alguien que sepa conducir la reunión.', 'No: atrasaría todas las obras.', 'Sí, siempre y sin excepción.'], c: 0 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LD9-01', titulo: 'Lo que dice el tono y no la palabra', genero: 'expositivo',
      texto: 'La misma frase significa cosas distintas según cómo se diga. «Qué bien» dicho rápidamente y con la voz arriba felicita; dicho lentamente y con la voz cayendo, reprocha. Ninguna palabra cambió: cambió solamente la entonación, y sin embargo el oyente entiende perfectamente lo contrario. Los lingüistas llaman prosodia a esa capa, y calculan que carga una parte enorme del significado en la conversación diaria. Por eso un mensaje escrito se malinterpreta tan frecuentemente: llega desnudo, sin tono, y quien lo lee le pone mentalmente el que trae por dentro ese día. Los emojis aparecieron precisamente para tapar ese hueco, aunque lo hacen toscamente. En las lenguas de señas la prosodia existe igual, pero va en la cara: la ceja levantada, la boca abierta, la velocidad del movimiento. Un intérprete que seña correctamente pero con la cara quieta transmite las palabras y pierde exactamente la mitad del mensaje, que es justamente la que más pesa. Por eso los buenos intérpretes se cansan enormemente: están hablando con todo el cuerpo, continuamente y sin descanso.',
      lugarTiempo: ['arriba', 'dentro'],
      modoCantidad: ['rápidamente', 'lentamente', 'solamente', 'perfectamente', 'tan', 'frecuentemente', 'mentalmente', 'precisamente', 'toscamente', 'igual', 'correctamente', 'exactamente', 'justamente', 'más', 'enormemente', 'continuamente'],
      neutros: ['distintas', 'enorme', 'desnudo', 'quieta', 'levantada'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo llaman los lingüistas a esa capa de la lengua?', r: 'Prosodia.',
          o: ['Prosodia.', 'Sintaxis.', 'Ortografía.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué un mensaje escrito se malinterpreta tan seguido?', r: 'Porque llega sin tono y el lector le pone el suyo.',
          o: ['Porque la gente escribe con faltas.', 'Porque los mensajes son muy cortos.', 'Porque llega sin tono y el lector le pone el suyo.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué un intérprete con la cara quieta pierde medio mensaje?', r: 'Porque en la lengua de señas la prosodia va en el rostro, no en la voz.',
          o: ['Porque en la lengua de señas la prosodia va en el rostro.', 'Porque se cansa más rápido.', 'Porque los sordos leen los labios.'], c: 0 },
        { tipo: 'critica', q: '¿Los emojis resuelven el problema del tono o lo empeoran? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca lo que aportan y lo que siguen sin cubrir.',
          o: ['Ayudan a medias: tapan el hueco toscamente y a veces confunden más.', 'Lo resuelven completamente.', 'Lo empeoran siempre.'], c: 0 },
        { tipo: 'critica', q: '¿Deberías escribir distinto sabiendo esto? Propón una regla propia.', r: 'Respuesta abierta: se valora que proponga una práctica concreta —releer como si lo recibiera enojado, decirlo de viva voz— y no una vaguedad.',
          o: ['Sí: releer lo escrito imaginando que el otro lo recibe de mal humor.', 'No: quien lee mal, problema suyo.', 'Sí: escribir siempre con emojis.'], c: 0 },
      ] },

    { id: 'LD9-02', titulo: 'Por qué se olvida lo estudiado la noche antes', genero: 'expositivo',
      texto: 'Estudiar intensamente la noche anterior funciona sorprendentemente bien para el examen de mañana y sorprendentemente mal para todo lo demás. La memoria trabaja distinto de como uno supone: lo que se repasa muchas veces seguidas se guarda superficialmente, y basta con dormir mal una noche para que se borre casi entero. En cambio, lo que se repasa espaciadamente —un poco hoy, otro poco en tres días, otro poco la semana siguiente— se fija profundamente y aguanta meses. Los investigadores lo llaman efecto de espaciamiento y lo comprobaron repetidamente desde hace más de un siglo. Hay algo todavía más incómodo: mientras uno relee, siente que sabe muchísimo, porque el texto le resulta familiar. Esa sensación engaña casi siempre. Recordar cuesta bastante más que reconocer, y por eso cerrar el libro y tratar de decirlo en voz alta, aunque salga mal, enseña muchísimo más que releerlo diez veces seguidas y sentirse cómodo. Aprender de verdad se siente casi siempre incómodo, y ahí está justamente la señal de que está pasando algo. Cuando el estudio se siente fácil y agradable, casi siempre es porque uno solo está paseando la vista.',
      lugarTiempo: ['anterior', 'mañana', 'hoy', 'siguiente', 'todavía', 'siempre', 'ahí'],
      modoCantidad: ['intensamente', 'sorprendentemente', 'bien', 'mal', 'distinto', 'superficialmente', 'casi', 'espaciadamente', 'poco', 'profundamente', 'repetidamente', 'más', 'muchísimo', 'bastante'],
      neutros: ['entero', 'familiar', 'incómodo', 'cómodo', 'alta'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo llaman los investigadores al método de repasar espaciado?', r: 'Efecto de espaciamiento.',
          o: ['Memoria profunda.', 'Efecto de espaciamiento.', 'Repaso intensivo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué releer da la sensación de que uno sabe?', r: 'Porque el texto resulta familiar, y reconocer se confunde con recordar.',
          o: ['Porque el texto resulta familiar, y reconocer se confunde con recordar.', 'Porque uno ya lo entendió bien.', 'Porque el libro está bien escrito.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué conviene cerrar el libro aunque salga mal?', r: 'Porque recordar exige más esfuerzo que reconocer, y ese esfuerzo es el que fija lo aprendido.',
          o: ['Porque así se ahorra tiempo.', 'Porque el libro distrae mucho.', 'Porque recordar exige más esfuerzo que reconocer, y ese esfuerzo fija lo aprendido.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué casi todos siguen estudiando la noche antes aunque saben esto? Argumenta.', r: 'Respuesta abierta: se valora que hable de la urgencia, del resultado inmediato y de lo que cuesta cambiar un hábito.',
          o: ['Porque no les importa aprender.', 'Porque funciona para pasar mañana, y lo inmediato siempre gana.', 'Porque nadie se los ha explicado.'], c: 1 },
        { tipo: 'critica', q: '¿Debería el sistema escolar evaluar de otra manera sabiendo esto? Propón algo.', r: 'Respuesta abierta: se valora que proponga una forma concreta —evaluaciones acumulativas, repasos espaciados— con su razón.',
          o: ['Sí: evaluar varias veces a lo largo del año premia el repaso espaciado.', 'No: el examen final es lo justo.', 'Sí: eliminar todos los exámenes.'], c: 0 },
      ] },

    { id: 'LD9-03', titulo: 'La estadística que se lee al revés', genero: 'expositivo',
      texto: 'Un titular decía recientemente que la mayoría de los accidentes de tránsito ocurre cerca de la casa. La conclusión que muchos sacaron rápidamente fue absurda: entonces es más peligroso manejar cerca de casa. En realidad la gente maneja abrumadoramente más cerca de su casa que lejos, así que ahí se acumula naturalmente casi todo lo que pasa, bueno y malo. Para saber si un tramo es realmente peligroso hay que dividir los accidentes entre los kilómetros recorridos ahí, no contarlos sueltos. Esa trampa aparece constantemente. Se dice que la mayoría de los muertos en un hospital fallece en la unidad de cuidados intensivos y se concluye alegremente que esa unidad es peligrosa, cuando simplemente ahí llegan los más graves. Leer bien una estadística exige preguntarse siempre lo mismo, casi mecánicamente: ¿comparado con qué? Sin esa pregunta, un número verdadero sostiene tranquilamente una conclusión completamente falsa, y encima la sostiene con la autoridad que da parecer exacta. Nada engaña mejor que un dato cierto mal comparado, y por eso circula tanto: nadie tiene que inventarlo para que funcione.',
      lugarTiempo: ['recientemente', 'cerca', 'lejos', 'ahí', 'entonces', 'siempre', 'constantemente', 'encima'],
      modoCantidad: ['rápidamente', 'más', 'abrumadoramente', 'así', 'naturalmente', 'casi', 'realmente', 'alegremente', 'simplemente', 'bien', 'mecánicamente', 'tranquilamente', 'completamente', 'mejor'],
      neutros: ['no', 'absurda', 'sueltos', 'graves', 'verdadero', 'falsa'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hay que hacer para saber si un tramo es realmente peligroso?', r: 'Dividir los accidentes entre los kilómetros recorridos ahí.',
          o: ['Contar cuántos accidentes hubo.', 'Dividir los accidentes entre los kilómetros recorridos ahí.', 'Preguntar a los conductores.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué se acumulan los accidentes cerca de casa?', r: 'Porque es donde la gente maneja abrumadoramente más.',
          o: ['Porque la gente se confía cerca de casa.', 'Porque es donde la gente maneja abrumadoramente más.', 'Porque las calles del barrio son malas.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué error se repite en el ejemplo del hospital?', r: 'Confundir dónde se concentra un hecho con dónde está su causa.',
          o: ['Contar mal a los pacientes.', 'Confundir dónde se concentra un hecho con dónde está su causa.', 'Creer que los hospitales son peligrosos.'], c: 1 },
        { tipo: 'critica', q: '¿De quién es la responsabilidad cuando un titular verdadero engaña? Argumenta.', r: 'Respuesta abierta: se valora que reparta responsabilidad entre quien publica y quien lee, con una razón.',
          o: ['De quien lo publica sabiendo cómo se entenderá, y de quien lo repite sin preguntar.', 'Solo del lector, que no piensa.', 'De nadie: el dato es cierto.'], c: 0 },
        { tipo: 'critica', q: '¿Qué pregunta te harías tú ante un dato llamativo? Propón una.', r: 'Respuesta abierta: se valora que formule una pregunta concreta y útil, como «¿comparado con qué?» o «¿sobre cuántos casos?».',
          o: ['Ninguna: si sale publicado, es cierto.', '¿Quién lo dijo?', '¿Comparado con qué, y sobre cuántos casos se calculó?'], c: 2 },
      ] },

    { id: 'LD9-04', titulo: 'El pueblo que dejó de tener nombre', genero: 'narrativo',
      texto: 'Cuando la carretera nueva pasó ocho kilómetros al norte, El Zapotal empezó a vaciarse lentamente. Primero cerró el comedor, después la agencia bancaria y finalmente la escuela, que quedó abierta tres años más con apenas nueve alumnos. La gente no se fue de golpe: se fue yéndose, que es distinto. Hoy quedan once casas habitadas y ninguna tiene menos de sesenta años de construida. Doña Ercilia vive ahí todavía y explica tranquilamente que ella no se queda por terca. Se queda porque afuera nadie sabría dónde está enterrada su gente, ni por qué aquel cerro se llama así, ni cuál palo da mejor sombra en abril. Dice que un pueblo no se acaba cuando se va el último habitante: se acaba antes, el día en que ya nadie de afuera sabe pronunciar bien su nombre. Ella todavía lo pronuncia entero, despacio y bien fuerte, cada vez que alguien pregunta. Después se queda callada un rato, como esperando que la palabra se acomode nuevamente en el aire y alguien más la repita alguna vez, aunque sea lejos de aquí.',
      lugarTiempo: ['norte', 'Primero', 'después', 'finalmente', 'Hoy', 'ahí', 'todavía', 'afuera', 'antes', 'dónde', 'cuando', 'nuevamente'],
      modoCantidad: ['lentamente', 'más', 'apenas', 'distinto', 'menos', 'tranquilamente', 'mejor', 'así', 'bien', 'despacio', 'fuerte'],
      neutros: ['no', 'abierta', 'terca', 'entero', 'último', 'nueva'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué cerró primero en El Zapotal?', r: 'El comedor.',
          o: ['La escuela.', 'El comedor.', 'La agencia bancaria.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué diferencia hay entre «irse de golpe» e «irse yéndose»?', r: 'Que la segunda ocurre poco a poco, sin un momento en que alguien decida abandonar el pueblo.',
          o: ['Que la segunda es más rápida.', 'Que la segunda la deciden las autoridades.', 'Que ocurre poco a poco, sin un momento en que alguien decida abandonarlo.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué doña Ercilia dice que no se queda «por terca»?', r: 'Porque ella guarda un saber del lugar que afuera nadie tendría.',
          o: ['Porque no tiene adónde ir.', 'Porque espera que vuelva la gente.', 'Porque ella guarda un saber del lugar que afuera nadie tendría.'], c: 2 },
        { tipo: 'critica', q: '¿Estás de acuerdo con su idea de cuándo se acaba un pueblo? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta si un lugar existe por sus habitantes o por su memoria.',
          o: ['Tiene razón en algo: cuando nadie afuera lo nombra, ya dejó de existir para el resto.', 'No: un pueblo existe mientras alguien viva ahí.', 'Da igual: los pueblos se acaban y ya.'], c: 0 },
        { tipo: 'critica', q: '¿Qué se le debe a un lugar así antes de darlo por perdido? Propón algo.', r: 'Respuesta abierta: se valora que proponga algo concreto —registrar su historia, mantener un servicio, documentar los nombres— y no solo lamentarlo.',
          o: ['Nada: es ley de vida.', 'Registrar su historia y sus nombres antes de que se vaya quien los sabe.', 'Reconstruir la carretera vieja.'], c: 1 },
      ] },

    { id: 'LD9-05', titulo: 'El que corrige mapas de memoria', genero: 'narrativo',
      texto: 'Don Efraín trabajó cuarenta años midiendo terrenos en Olancho y hoy, ya jubilado, corrige mapas oficiales desde su casa. Recibe una impresión satelital y la revisa lentamente, con lupa. Casi siempre encuentra algo. Señala tranquilamente que un río está dibujado dos metros al oeste de donde realmente pasa, o que una quebrada que aparece ahí en realidad se secó definitivamente hace treinta años. Los técnicos jóvenes al principio lo escuchaban educadamente y no le hacían mucho caso, porque la imagen viene de un satélite y él trabaja de memoria. Un día lo comprobaron en el campo, punto por punto, y él tenía razón exactamente en once de trece casos. Ahora lo llaman seguido. Él lo explica sencillamente, sin presumir: la foto muestra fielmente cómo se ve el terreno hoy; yo me acuerdo de cómo se comporta cuando llueve fuerte, y eso ninguna cámara lo ha visto nunca desde arriba, por más alto que vuele y por más nítidamente que fotografíe. Los mapas nuevos ya salen con una nota al pie que dice: revisado en campo. Esa línea la puso él, sin firmarla.',
      lugarTiempo: ['hoy', 'ya', 'siempre', 'ahí', 'principio', 'Ahora', 'seguido', 'nunca', 'arriba', 'cuando'],
      modoCantidad: ['lentamente', 'Casi', 'tranquilamente', 'realmente', 'definitivamente', 'educadamente', 'mucho', 'exactamente', 'sencillamente', 'fielmente', 'fuerte', 'nítidamente', 'alto'],
      neutros: ['no', 'jubilado', 'jóvenes', 'oficiales'],
      preguntas: [
        { tipo: 'literal', q: '¿En cuántos casos tenía razón cuando lo comprobaron?', r: 'En once de trece.',
          o: ['En todos.', 'En once de trece.', 'En la mitad.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué los técnicos jóvenes no le hacían caso al principio?', r: 'Porque confiaban en la imagen del satélite más que en la memoria de una persona.',
          o: ['Porque no lo conocían.', 'Porque no hablaba claro.', 'Porque confiaban en la imagen del satélite más que en la memoria de una persona.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué sabe él que la foto no muestra?', r: 'Cómo se comporta el terreno cuando llueve fuerte.',
          o: ['Cómo se comporta el terreno cuando llueve fuerte.', 'La altura exacta de los cerros.', 'El nombre de los dueños.'], c: 0 },
        { tipo: 'critica', q: '¿Debería un mapa oficial incorporar ese tipo de saber? Argumenta.', r: 'Respuesta abierta: se valora que discuta cómo se verifica e incorpora un conocimiento que no viene de un instrumento.',
          o: ['No: solo vale lo que mide un aparato.', 'Sí, sin verificar: él sabe más.', 'Sí, si se verifica en el campo: aporta lo que el instrumento no capta.'], c: 2 },
        { tipo: 'critica', q: '¿Qué se pierde cuando se jubila alguien así y nadie lo consulta? Propón cómo evitarlo.', r: 'Respuesta abierta: se valora que proponga un mecanismo concreto —registrar, acompañar a un joven, documentar— y no solo el lamento.',
          o: ['Nada: los datos ya están en el sistema.', 'Se pierde su experiencia y no hay remedio.', 'Se pierde un saber sin registro; convendría documentarlo con alguien joven al lado.'], c: 2 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN
   1. las cinco preguntas; 2. cazar los adverbios sobre el texto;
   3. clasificarlos en lugar/tiempo o modo/cantidad; 4. volver de
   memoria a buscar el adverbio exacto.
══════════════════════════════════════════════════════════════ */
const LECTURA_ADVERBIOS_TALLER = [

  { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

  { id: 'caza', icono: '🎯', titulo: 'Caza de adverbios', forma: 'cazar', meta: 10,
    instruccion: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' adverbios</strong> de lugar, tiempo, modo y cantidad. ' +
        'Encuentra <strong>al menos ' + info.meta + '</strong> y tócalos: dicen <strong>dónde</strong>, ' +
        '<strong>cuándo</strong>, <strong>cómo</strong> o <strong>cuánto</strong>.';
    },
    enPapel: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' adverbios</strong> de lugar, tiempo, modo y cantidad. ' +
        '<strong>Subraya al menos ' + info.meta + '</strong> en el texto de arriba: dicen <strong>dónde</strong>, ' +
        '<strong>cuándo</strong>, <strong>cómo</strong> o <strong>cuánto</strong>.';
    },
    objetivos: function (t, u) {
      var lt = {}, mc = {};
      (t.lugarTiempo || []).forEach(function (p) { lt[u.clave(p)] = 1; });
      (t.modoCantidad || []).forEach(function (p) { mc[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (lt[k]) out.push({ ini: i, fin: i, clase: 'a' });
        else if (mc[k]) out.push({ ini: i, fin: i, clase: 'b' });
      });
      return out;
    },
    /* «no», «sí» y «quizá» SON adverbios —de negación, afirmación y
       duda—, pero esta cacería busca las dos clases de arriba. Se dice,
       en vez de castigar al que los toca teniendo razón. */
    neutros: function (t, u) {
      var neu = {};
      (t.neutros || []).forEach(function (p) { neu[u.clave(p)] = 1; });
      if (typeof LECTURA_CLASES !== 'undefined') LECTURA_CLASES.neutros.forEach(function (p) { neu[u.clave(p)] = 1; });
      var DUDA = { 'no': 'de negación', 'sí': 'de afirmación', 'tampoco': 'de negación',
        'también': 'de afirmación', 'quizá': 'de duda', 'quizás': 'de duda', 'acaso': 'de duda' };
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (!neu[k]) return;
        var limpio = p.replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        out.push({ ini: i, fin: i, motivo: DUDA[k]
          ? '«' + u.esc(limpio) + '» <strong>sí es adverbio</strong>, ' + DUDA[k] + '. Aquí buscamos los de ' +
            'lugar, tiempo, modo y cantidad, así que no cuenta: ni bien ni mal.'
          : '«' + u.esc(limpio) + '» aquí <strong>no está haciendo de adverbio</strong>: en esta oración funciona ' +
            'como adjetivo u otra clase. No cuenta: ni bien ni mal.' });
      });
      return out;
    },
    fallo: function (palabra, u) {
      return '❌ «' + u.esc(palabra) + '» no es adverbio. Un adverbio dice <strong>dónde</strong>, ' +
        '<strong>cuándo</strong>, <strong>cómo</strong> o <strong>cuánto</strong>, y no cambia nunca de forma.';
    } },

  { id: 'clasifica', icono: '🗂️', titulo: '¿Lugar y tiempo, o modo y cantidad?', forma: 'dosGrupos',
    pista: 'Míralos en su oración antes de decidir',
    grupos: [
      { clave: 'a', titulo: '🗺️ Lugar y tiempo', pista: '¿dónde? ¿cuándo?', nombre: 'de lugar o tiempo' },
      { clave: 'b', titulo: '🎭 Modo y cantidad', pista: '¿cómo? ¿cuánto?', nombre: 'de modo o cantidad' }
    ],
    items: function (t, u) {
      var lt = u.baraja(t.lugarTiempo || []), mc = u.baraja(t.modoCantidad || []);
      var nMc = Math.min(3, mc.length), nLt = Math.min(6 - nMc, lt.length);
      var lista = lt.slice(0, nLt).map(function (p) { return { palabra: p, grupo: 'a' }; })
        .concat(mc.slice(0, nMc).map(function (p) { return { palabra: p, grupo: 'b' }; }));
      return u.baraja(lista).map(function (it) {
        it.contexto = u.contextoDe(it.palabra);
        it.explica = '«' + u.esc(it.palabra) + '» ' + (it.grupo === 'a'
          ? 'te dice <strong>dónde</strong> o <strong>cuándo</strong> pasa algo.'
          : 'te dice <strong>cómo</strong> o <strong>cuánto</strong>: la manera o la medida.');
        return it;
      });
    } },

  { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?', forma: 'tresOpciones',
    pista: 'Las tres palabras salen de esta misma lectura',
    items: function (t, u) {
      var adv = {};
      (t.lugarTiempo || []).concat(t.modoCantidad || []).forEach(function (p) { adv[u.clave(p)] = 1; });
      var todos = (t.lugarTiempo || []).concat(t.modoCantidad || []);
      var candidatos = [];
      u.oraciones().forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (adv[u.clave(u.ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
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
          bien: 'Fíjate en cuánto cambia la oración según el adverbio que se le ponga.',
          mal: 'La lectura decía <strong>«' + u.esc(correcta) + '»</strong>. Los otros dos también salen de este texto, ' +
            'pero decían otra circunstancia.'
        };
      });
    } },
];

const LECTURA_ADVERBIOS_RESUMEN = {
  titulo: '🧭 Todos los adverbios de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'ayer', dice: 'lugar o tiempo' },
    { clase: 'b', txt: 'despacio', dice: 'modo o cantidad' }
  ],
  intro: function (t, u, cuenta) {
    return 'En un solo texto había <strong>' + cuenta.a + ' adverbios de lugar o tiempo</strong> y <strong>' +
      cuenta.b + ' de modo o cantidad</strong>. Los primeros dicen dónde y cuándo; los segundos, cómo y cuánto.';
  },
  marcar: function (t, u) {
    var lt = {}, mc = {};
    (t.lugarTiempo || []).forEach(function (p) { lt[u.clave(p)] = 1; });
    (t.modoCantidad || []).forEach(function (p) { mc[u.clave(p)] = 1; });
    var out = [];
    u.ps.forEach(function (p, i) {
      var k = u.clave(p);
      if (lt[k]) out.push({ ini: i, fin: i, clase: 'a' });
      else if (mc[k]) out.push({ ini: i, fin: i, clase: 'b' });
    });
    return out;
  }
};
