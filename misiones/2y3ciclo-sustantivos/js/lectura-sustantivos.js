/* ══════════════════════════════════════════════════════════════
   📖 CORPUS DE LECTURA — MISIÓN DE LOS SUSTANTIVOS

   Cinco lecturas por grado, de 4º a 9º, para el Control de lectura que
   vive dentro de la misión (js/tools/lectura-mision.js). El motor no
   sabe de sustantivos: aquí va el corpus y aquí va el taller.

   ── Por qué estos textos y no otros ──
   Son de Honduras y en el español que se habla en Honduras: el mercado
   del sábado, la champa de la playa, el café de Marcala, la lancha de
   Guanaja. No es adorno regional. El alumno tiene que reconocer un
   sustantivo en el mundo que ya conoce, no en un texto de otro país
   donde «zumo», «coche» y «patata» le roban la atención justo cuando
   está aprendiendo a mirar la palabra.

   Y cada texto trae NOMBRES PROPIOS de verdad —personas, pueblos,
   ríos, instituciones—, porque la segunda actividad clasifica común
   contra propio y sin propios no hay nada que clasificar.

   ⚠️ OJO CON ESTA MISIÓN: en sus otros ejercicios los nombres propios
   van EN MINÚSCULA a propósito, porque el ejercicio es que el alumno
   los corrija (por eso sustantivos.js está en las excepciones de
   _dev/verifica-nombres-propios.js). AQUÍ NO. Estas lecturas se leen en
   voz alta y se dan por buenas: van escritas bien, con su mayúscula, y
   este archivo SÍ pasa por el verificador.

   ── susts y propios son el INVENTARIO COMPLETO ──
   No una muestra. Con ellas el alumno caza sustantivos tocándolos sobre
   el texto, así que un sustantivo que falte es la pantalla diciéndole
   que se equivocó CUANDO ACERTÓ. Tienen que aparecer TAL CUAL en el
   texto: se compara palabra contra palabra, no con indexOf, así que
   «mesa» no vale si el texto dice «mesas».

   `neutros` es la zona gris de ESE texto: el infinitivo que ahí hace de
   sustantivo («el comer»), el adjetivo sustantivado, el título de
   tratamiento (don, doña). Tocarlas no suma ni resta y la pantalla lo
   explica. Los artículos viven en js/data/lectura-clases.js y no se
   repiten aquí.

   Antes de publicar un cambio:
     node _dev/valida-lectura-mision.js
     node _dev/verifica-nombres-propios.js
     node _dev/verifica-impresion-lectura.js
══════════════════════════════════════════════════════════════ */

const LECTURA_SUSTANTIVOS = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LS4-01', titulo: 'El mercado de los sábados', genero: 'narrativo',
      texto: 'Cada sábado el mercado de Gracias se llena desde temprano. Doña Marta llega con canastos de aguacate, queso y cuajada. Su vecino don Ramón trae naranjas de su solar. Los niños corren entre las mesas y buscan las bolsas de mango con sal. En una esquina, una señora vende horchata en vasos de plástico. El olor del café recién colado sale de la cocina de un comedor pequeño. A las once el sol pega fuerte y los vendedores estiran plásticos para hacer sombra. Antes del mediodía casi todo está vendido, y el mercado queda callado hasta el sábado siguiente.',
      susts: ['sábado', 'mercado', 'canastos', 'aguacate', 'queso', 'cuajada', 'vecino', 'naranjas', 'solar', 'niños', 'mesas', 'bolsas', 'mango', 'sal', 'esquina', 'señora', 'horchata', 'vasos', 'plástico', 'olor', 'café', 'cocina', 'comedor', 'sol', 'vendedores', 'plásticos', 'mediodía', 'sombra'],
      propios: ['Gracias', 'Marta', 'Ramón'],
      neutros: ['Doña', 'don', 'todo'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué trae doña Marta al mercado?', r: 'Canastos de aguacate, queso y cuajada.',
          o: ['Bolsas de mango con sal.', 'Canastos de aguacate, queso y cuajada.', 'Vasos de horchata.'], c: 1 },
        { tipo: 'literal', q: '¿De dónde saca don Ramón las naranjas?', r: 'De su solar.',
          o: ['Se las compra a doña Marta.', 'De su solar.', 'Las trae de otro pueblo.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hacen los vendedores a las once?', r: 'Estiran plásticos para hacer sombra.',
          o: ['Se van para su casa.', 'Bajan los precios.', 'Estiran plásticos para hacer sombra.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el mercado queda callado antes del mediodía?', r: 'Porque casi todo se vendió y la gente ya se fue.',
          o: ['Porque casi todo se vendió y la gente ya se fue.', 'Porque llueve todos los sábados.', 'Porque los vendedores se enojaron.'], c: 0 },
        { tipo: 'critica', q: '¿Te parece bien que el mercado abra solo un día a la semana? ¿Por qué?', r: 'Respuesta abierta: se valora que dé una razón, sobre la costumbre del pueblo o sobre la comodidad de la gente.',
          o: ['Está mal: debería abrir todos los días aunque no llegue nadie.', 'Da igual, el mercado no le sirve a nadie.', 'Está bien: así los vendedores juntan producto y la gente sabe cuándo ir.'], c: 2 },
      ] },

    { id: 'LS4-02', titulo: 'El pozo de la comunidad', genero: 'expositivo',
      texto: 'En la aldea de El Rosario el agua no llega por tubería. La gente la saca de un pozo que está a la orilla del camino. Cada familia lleva su balde y su lazo. Los sábados un grupo de vecinos limpia la boca del pozo y cambia la tapa de madera, porque una tapa rota deja caer hojas y tierra adentro. Don Emilio y su hija Sonia anotan en un cuaderno quién ayudó cada mes. Ese cuaderno no es un castigo: es la memoria del trabajo. Cuando alguien se enferma, el mismo grupo le lleva el agua hasta la puerta de su casa.',
      susts: ['agua', 'tubería', 'gente', 'pozo', 'orilla', 'camino', 'familia', 'balde', 'lazo', 'grupo', 'vecinos', 'boca', 'tapa', 'madera', 'hojas', 'tierra', 'cuaderno', 'mes', 'hija', 'aldea', 'sábados', 'castigo', 'memoria', 'trabajo', 'puerta', 'casa'],
      propios: ['Rosario', 'Emilio', 'Sonia'],
      neutros: ['Don'],
      preguntas: [
        { tipo: 'literal', q: '¿De dónde saca el agua la gente de El Rosario?', r: 'De un pozo a la orilla del camino.',
          o: ['De un pozo a la orilla del camino.', 'De una tubería que llega a las casas.', 'De un río que pasa por la aldea.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hacen los vecinos los sábados?', r: 'Limpian la boca del pozo y cambian la tapa.',
          o: ['Cobran por el agua.', 'Limpian la boca del pozo y cambian la tapa.', 'Cavan un pozo nuevo.'], c: 1 },
        { tipo: 'literal', q: '¿Qué anota don Emilio en su cuaderno?', r: 'Quién ayudó cada mes.',
          o: ['Cuánta agua saca cada familia.', 'Quién ayudó cada mes.', 'Los nombres de los enfermos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que el cuaderno «es la memoria del trabajo»?', r: 'Porque guarda constancia de lo que cada quien hizo, no para castigar sino para recordar.',
          o: ['Porque ahí se apunta a quien no quiere trabajar.', 'Porque don Emilio lo usa para cobrar.', 'Porque guarda constancia de lo que cada quien hizo.'], c: 2 },
        { tipo: 'critica', q: '¿Está bien que le lleven el agua a quien se enferma? Defiende tu postura.', r: 'Respuesta abierta: se valora que sostenga su opinión con una razón sobre la ayuda mutua o sobre la justicia del reparto.',
          o: ['Sí, porque hoy es él y mañana puede ser cualquiera.', 'No, cada quien debe arreglárselas solo.', 'Solo si esa persona ayudó muchas veces antes.'], c: 0 },
      ] },

    { id: 'LS4-03', titulo: 'La champa de la playa', genero: 'descriptivo',
      texto: 'La champa de doña Chila está en la playa de Tela, casi encima de la arena. El techo es de manaca y las paredes solo llegan a la cintura, para que entre el viento. Adentro hay cuatro mesas de plástico y un fogón donde su nieto Denis fríe el pescado. El olor del ajo y del plátano se mete hasta la calle. Los domingos llegan familias enteras con hieleras y sombrillas. Los niños entran mojados y dejan un charco en el piso de cemento. Doña Chila no se enoja: dice que el agua se seca sola y que la alegría no.',
      susts: ['champa', 'playa', 'arena', 'techo', 'manaca', 'paredes', 'cintura', 'viento', 'mesas', 'plástico', 'fogón', 'pescado', 'nieto', 'olor', 'ajo', 'plátano', 'calle', 'domingos', 'familias', 'hieleras', 'sombrillas', 'niños', 'charco', 'piso', 'cemento', 'agua', 'alegría'],
      propios: ['Chila', 'Tela', 'Denis'],
      neutros: ['doña'],
      preguntas: [
        { tipo: 'literal', q: '¿De qué es el techo de la champa?', r: 'De manaca.',
          o: ['De manaca.', 'De lámina.', 'De cemento.'], c: 0 },
        { tipo: 'literal', q: '¿Por qué las paredes solo llegan a la cintura?', r: 'Para que entre el viento.',
          o: ['Porque no alcanzó el material.', 'Para que entre el viento.', 'Para que se vea el mar desde la calle.'], c: 1 },
        { tipo: 'literal', q: '¿Qué llevan las familias los domingos?', r: 'Hieleras y sombrillas.',
          o: ['Hieleras y sombrillas.', 'Leña para el fogón.', 'Mesas y sillas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir doña Chila con que «el agua se seca sola y la alegría no»?', r: 'Que el charco no importa comparado con la alegría de los niños.',
          o: ['Que el piso de cemento nunca se moja.', 'Que hay que secar el piso rápido.', 'Que el charco no importa comparado con la alegría de los niños.'], c: 2 },
        { tipo: 'critica', q: '¿Te parece bien la actitud de doña Chila con los niños mojados? ¿Por qué?', r: 'Respuesta abierta: se valora que argumente sobre el trato a los clientes o sobre el cuidado del local.',
          o: ['Mal: un negocio tiene que estar seco y ordenado siempre.', 'Bien: un charco se limpia y un cliente contento vuelve.', 'Da lo mismo, nadie se fija en el piso.'], c: 1 },
      ] },

    { id: 'LS4-04', titulo: 'El equipo de la escuela', genero: 'narrativo',
      texto: 'El maestro Julio armó un equipo de fútbol con alumnos de quinto y sexto. No había uniformes, así que cada quien llegó con la camisa que tenía. La cancha era de tierra y tenía dos piedras por portería. El primer partido lo perdieron contra la escuela de Sabanagrande por cuatro goles. Nadie lloró. En el segundo partido metieron uno y la algarabía se oyó hasta la calle. Al final del año una señora del barrio, doña Reina, les regaló diez camisetas azules. El maestro dice que lo importante no fueron las camisetas, sino que ningún jugador se retiró después de la primera derrota.',
      susts: ['maestro', 'equipo', 'fútbol', 'alumnos', 'uniformes', 'camisa', 'cancha', 'tierra', 'piedras', 'portería', 'partido', 'escuela', 'goles', 'algarabía', 'calle', 'año', 'señora', 'barrio', 'camisetas', 'jugador', 'derrota'],
      propios: ['Julio', 'Sabanagrande', 'Reina'],
      neutros: ['quinto', 'sexto', 'final', 'doña'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hacía de portería en la cancha?', r: 'Dos piedras.',
          o: ['Dos camisetas amarradas.', 'Dos palos de madera.', 'Dos piedras.'], c: 2 },
        { tipo: 'literal', q: '¿Cómo terminó el primer partido?', r: 'Lo perdieron por cuatro goles contra la escuela de Sabanagrande.',
          o: ['Lo ganaron por un gol.', 'Se suspendió por la lluvia.', 'Lo perdieron por cuatro goles.'], c: 2 },
        { tipo: 'literal', q: '¿Quién les regaló las camisetas?', r: 'Una señora del barrio.',
          o: ['El maestro Julio.', 'La escuela de Sabanagrande.', 'Una señora del barrio.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el maestro dice que lo importante no fueron las camisetas?', r: 'Porque valoró más que ningún jugador se retirara después de perder.',
          o: ['Porque valoró más que nadie se retirara después de perder.', 'Porque las camisetas eran feas.', 'Porque prefería uniformes completos.'], c: 0 },
        { tipo: 'critica', q: '¿Se puede armar un buen equipo sin uniformes ni cancha buena? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que sostenga su postura con una razón sobre el esfuerzo o sobre las condiciones materiales.',
          o: ['Sí: lo que sostiene a un equipo es que sus jugadores no se rindan.', 'No: sin equipo bueno no se puede jugar.', 'Solo si el maestro paga los uniformes.'], c: 0 },
      ] },

    { id: 'LS4-05', titulo: 'La siembra de maíz', genero: 'expositivo',
      texto: 'En mayo, cuando caen las primeras lluvias, los campesinos de Cololaca, en Lempira, preparan la milpa. Primero limpian el terreno con machete y dejan el rastrojo en el suelo, porque esa capa guarda la humedad. Después hacen agujeros con un palo puntudo y echan dos o tres granos en cada uno. El maíz nace en una semana si el aguacero llegó parejo. A los dos meses la planta pasa la cintura de don Sabas y ya se ve la flor arriba. La cosecha se recoge en agosto o septiembre. De esa mazorca sale la tortilla que estará en la mesa todo el año.',
      susts: ['lluvias', 'campesinos', 'milpa', 'terreno', 'machete', 'rastrojo', 'suelo', 'capa', 'humedad', 'agujeros', 'palo', 'granos', 'maíz', 'semana', 'aguacero', 'meses', 'planta', 'cintura', 'flor', 'mayo', 'agosto', 'septiembre', 'cosecha', 'mazorca', 'tortilla', 'mesa', 'año'],
      propios: ['Cololaca', 'Lempira', 'Sabas'],
      neutros: ['Primero', 'don'],
      preguntas: [
        { tipo: 'literal', q: '¿Para qué dejan el rastrojo en el suelo?', r: 'Porque esa capa guarda la humedad.',
          o: ['Porque esa capa guarda la humedad.', 'Para que se lo coman los animales.', 'Porque cuesta mucho recogerlo.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos granos echan en cada agujero?', r: 'Dos o tres.',
          o: ['Uno solo.', 'Un puñado.', 'Dos o tres.'], c: 2 },
        { tipo: 'literal', q: '¿Cuándo se recoge la cosecha?', r: 'En agosto o septiembre.',
          o: ['En mayo.', 'En agosto o septiembre.', 'En diciembre.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la siembra empieza justo con las primeras lluvias?', r: 'Porque el grano necesita agua para nacer y el aguacero la trae.',
          o: ['Porque en mayo hace menos calor.', 'Porque el grano necesita agua para nacer.', 'Porque el machete corta mejor mojado.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué crees que se dice que el maíz sostiene a la familia todo el año?', r: 'Respuesta abierta: se valora que relacione la cosecha con la comida diaria y con el ahorro.',
          o: ['Porque de esa cosecha sale la tortilla de cada día.', 'Porque se vende caro en el mercado.', 'Porque el maíz no se echa a perder nunca.'], c: 0 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LS5-01', titulo: 'El río que baja de la montaña', genero: 'expositivo',
      texto: 'El río Cangrejal nace en la montaña, arriba de La Ceiba, y baja entre piedras enormes. En invierno el agua sube y arrastra troncos; en verano se puede cruzar a pie por varios puntos. La corriente mueve el aire y por eso la orilla es fresca aun al mediodía. Muchas familias llegan el domingo con ollas y hacen sopa a la orilla. Don Isidro, guía del lugar, advierte una cosa: el río no avisa. Cuando llueve en la montaña, la creciente llega abajo media hora después, aunque en la playa esté haciendo sol. Por eso el consejo es mirar el color del agua. Si se vuelve café, hay que salir de una vez.',
      susts: ['río', 'montaña', 'piedras', 'invierno', 'agua', 'troncos', 'verano', 'pie', 'puntos', 'corriente', 'aire', 'orilla', 'mediodía', 'familias', 'domingo', 'ollas', 'sopa', 'guía', 'lugar', 'cosa', 'creciente', 'hora', 'playa', 'sol', 'consejo', 'color', 'vez'],
      propios: ['Cangrejal', 'Ceiba', 'Isidro'],
      neutros: ['café', 'media', 'Don'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde nace el río Cangrejal?', r: 'En la montaña, arriba de La Ceiba.',
          o: ['En la montaña, arriba de La Ceiba.', 'En la playa de La Ceiba.', 'En una laguna del valle.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hay que mirar para saber si viene la creciente?', r: 'El color del agua.',
          o: ['El tamaño de las piedras.', 'La cantidad de gente en la orilla.', 'El color del agua.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la orilla es fresca aunque sea mediodía?', r: 'Porque la corriente mueve el aire.',
          o: ['Porque la corriente mueve el aire.', 'Porque la montaña tapa el sol.', 'Porque el agua viene con hielo.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué significa que «el río no avisa»?', r: 'Que la creciente puede llegar sin que abajo se note ninguna señal.',
          o: ['Que no hay letreros en la orilla.', 'Que la creciente llega sin señal alguna abajo.', 'Que los guías no hablan con la gente.'], c: 1 },
        { tipo: 'critica', q: '¿Debería prohibirse bañarse en ese río? Defiende tu postura.', r: 'Respuesta abierta: se valora que pese el riesgo real contra el derecho a usar el río, con una razón.',
          o: ['No: hay que enseñar a leer el río, no cerrarlo.', 'Sí, hay que cerrarlo para siempre.', 'Solo pueden entrar los guías.'], c: 0 },
      ] },

    { id: 'LS5-02', titulo: 'La panadería de la esquina', genero: 'narrativo',
      texto: 'La panadería de don Nicolás abre a las cuatro de la mañana. A esa hora la calle está oscura y lo único que se oye es el golpe de la masa contra la mesa. Su hija Karla enciende el horno de barro con leña de guanacaste, porque esa madera da una brasa pareja. El primer pan sale a las seis: semitas, rosquillas y pan de yema. Los clientes hacen fila en la acera con su bolsa en la mano. Doña Petrona compra siempre lo mismo desde hace veinte años. Cuando el horno se apagó un lunes por la lluvia, media cuadra se quedó sin desayuno y todo el barrio se dio cuenta.',
      susts: ['panadería', 'mañana', 'calle', 'golpe', 'masa', 'mesa', 'hija', 'hora', 'horno', 'barro', 'leña', 'guanacaste', 'madera', 'brasa', 'pan', 'semitas', 'rosquillas', 'yema', 'clientes', 'fila', 'acera', 'bolsa', 'mano', 'años', 'lunes', 'lluvia', 'cuadra', 'desayuno', 'barrio'],
      propios: ['Nicolás', 'Karla', 'Petrona'],
      neutros: ['don', 'Doña', 'cuenta'],
      preguntas: [
        { tipo: 'literal', q: '¿Con qué leña enciende Karla el horno?', r: 'Con leña de guanacaste.',
          o: ['Con carbón comprado.', 'Con leña de pino.', 'Con leña de guanacaste.'], c: 2 },
        { tipo: 'literal', q: '¿A qué hora sale el primer pan?', r: 'A las seis.',
          o: ['A las cuatro.', 'A las ocho.', 'A las seis.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué se escoge la leña de guanacaste y no cualquiera?', r: 'Porque da una brasa pareja, y eso hornea mejor.',
          o: ['Porque es la más barata.', 'Porque huele bien.', 'Porque da una brasa pareja.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué muestra que media cuadra se quedara sin desayuno aquel lunes?', r: 'Que la panadería es parte de la vida diaria del barrio.',
          o: ['Que la gente del barrio no sabe cocinar.', 'Que la panadería es parte de la vida diaria del barrio.', 'Que don Nicolás vende demasiado caro.'], c: 1 },
        { tipo: 'critica', q: '¿Vale la pena levantarse a las cuatro de la mañana por un oficio así? Argumenta.', r: 'Respuesta abierta: se valora que argumente sobre el esfuerzo, el servicio al barrio o el costo personal.',
          o: ['Sí: hay oficios que sostienen la rutina de mucha gente.', 'No: ningún trabajo merece perder el sueño.', 'Solo si le pagan el doble.'], c: 0 },
      ] },

    { id: 'LS5-03', titulo: 'Las tortugas de Punta Ratón', genero: 'expositivo',
      texto: 'Entre septiembre y diciembre, la tortuga golfina llega a la playa de Punta Ratón, en el golfo de Fonseca. Sale de noche, escarba un hoyo con las aletas traseras y deja más de ochenta huevos. Después tapa el nido, borra la huella con el cuerpo y regresa al mar sin mirar atrás. Antes la gente recogía todos los huevos para venderlos. Hoy varias familias trabajan con la Secretaría de Recursos Naturales y llevan una parte a un corral vigilado. Cuando nacen las tortuguitas, los mismos niños del pueblo las acompañan hasta la orilla. De cada mil apenas una llegará a adulta, y esa cuenta es la que explica por qué se cuida cada nido.',
      susts: ['tortuga', 'golfina', 'playa', 'golfo', 'noche', 'hoyo', 'aletas', 'huevos', 'nido', 'huella', 'cuerpo', 'mar', 'gente', 'familias', 'parte', 'corral', 'tortuguitas', 'niños', 'pueblo', 'orilla', 'cuenta', 'septiembre', 'diciembre'],
      propios: ['Punta', 'Ratón', 'Fonseca', 'Secretaría', 'Recursos', 'Naturales'],
      neutros: ['adulta'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos huevos deja la tortuga golfina?', r: 'Más de ochenta.',
          o: ['Alrededor de diez.', 'Más de ochenta.', 'Más de mil.'], c: 1 },
        { tipo: 'literal', q: '¿Qué hace la tortuga después de tapar el nido?', r: 'Borra la huella con el cuerpo y regresa al mar.',
          o: ['Se queda cuidando el nido.', 'Borra la huella con el cuerpo y regresa al mar.', 'Escarba otro hoyo al lado.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la tortuga borra la huella del nido?', r: 'Para que nadie ni nada encuentre los huevos.',
          o: ['Para descansar antes de volver al mar.', 'Porque la arena le molesta en el cuerpo.', 'Para que nadie encuentre los huevos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que la cuenta de «una de cada mil» explica el cuidado?', r: 'Porque si sobreviven tan pocas, cada nido perdido pesa muchísimo.',
          o: ['Porque si sobreviven tan pocas, cada nido perdido pesa muchísimo.', 'Porque así se venden menos huevos.', 'Porque las tortugas son animales caros.'], c: 0 },
        { tipo: 'critica', q: '¿Es justo pedirle a una familia que deje de vender huevos si de eso vivía? Argumenta.', r: 'Respuesta abierta: se valora que reconozca las dos partes —la necesidad de la familia y la de la especie— y proponga algo.',
          o: ['Sí, la ley es la ley y no hay más que hablar.', 'No, que sigan vendiendo como siempre.', 'Solo si se le ofrece otra forma de ganarse la vida.'], c: 2 },
      ] },

    { id: 'LS5-04', titulo: 'La radio de la comunidad', genero: 'narrativo',
      texto: 'En la aldea de Yamaranguila, en Intibucá, hay una radio pequeña que transmite desde un cuarto con paredes de tabla. El equipo es viejo y la antena está amarrada a un poste de madera. Todos los días, a las cinco de la tarde, don Aurelio lee los avisos que la gente deja escritos en un papel: una vaca perdida, un velorio, una reunión del patronato. Nadie paga por ese servicio. La señal apenas alcanza tres aldeas, pero en esas tres no hay otra manera de mandar un recado. Cuando el huracán cortó el camino, la radio siguió al aire con una planta de gasolina y avisó dónde estaba abierto el paso.',
      susts: ['radio', 'aldea', 'cuarto', 'paredes', 'tabla', 'equipo', 'antena', 'poste', 'madera', 'días', 'tarde', 'avisos', 'gente', 'papel', 'vaca', 'velorio', 'reunión', 'patronato', 'servicio', 'señal', 'aldeas', 'manera', 'recado', 'huracán', 'camino', 'aire', 'planta', 'gasolina', 'paso'],
      propios: ['Yamaranguila', 'Intibucá', 'Aurelio'],
      neutros: ['don', 'cinco', 'tres'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué lee don Aurelio a las cinco de la tarde?', r: 'Los avisos que la gente deja escritos en un papel.',
          o: ['La lista de precios del mercado.', 'Las noticias de la capital.', 'Los avisos que la gente deja escritos en un papel.'], c: 2 },
        { tipo: 'literal', q: '¿Hasta dónde alcanza la señal de la radio?', r: 'Apenas hasta tres aldeas.',
          o: ['Hasta todo el departamento.', 'Apenas hasta tres aldeas.', 'Hasta la capital.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué esa radio pequeña importa tanto en esas aldeas?', r: 'Porque no hay otra manera de mandar un recado.',
          o: ['Porque no hay otra manera de mandar un recado.', 'Porque pone buena música.', 'Porque el equipo es moderno.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué demuestra que siguiera al aire durante el huracán?', r: 'Que en la emergencia era el único medio para informar a la gente.',
          o: ['Que tenían mucho dinero guardado.', 'Que en la emergencia era el único medio para informar.', 'Que la antena era muy resistente.'], c: 1 },
        { tipo: 'critica', q: '¿Debería el Estado apoyar radios así? Defiende tu postura.', r: 'Respuesta abierta: se valora que argumente sobre el derecho a la información en zonas aisladas o sobre el uso de los fondos.',
          o: ['Sí: donde no llega otra señal, esa radio es el único aviso.', 'No, que se mantengan solas o que cierren.', 'Solo si transmiten música todo el día.'], c: 0 },
      ] },

    { id: 'LS5-05', titulo: 'El vivero de la escuela', genero: 'expositivo',
      texto: 'Los alumnos de la escuela Ramón Rosales levantaron un vivero detrás del aula de sexto. Consiguieron bolsas negras, tierra negra y semilla de caoba y de cedro. Cada grado adoptó una hilera y la riega por turnos, sin faltar un solo día. La regla es sencilla: se riega temprano o al caer la tarde, nunca al mediodía, porque el sol quema la hoja tierna y evapora el agua antes de que la raíz la tome. En dos años el vivero ha entregado más de seiscientos arbolitos a las comunidades vecinas. La directora, la profesora Idalia, dice que el vivero enseña algo que no cabe en un examen: la paciencia de esperar un árbol.',
      susts: ['alumnos', 'escuela', 'vivero', 'aula', 'bolsas', 'tierra', 'semilla', 'caoba', 'cedro', 'grado', 'hilera', 'turnos', 'regla', 'tarde', 'mediodía', 'sol', 'hoja', 'agua', 'raíz', 'años', 'arbolitos', 'comunidades', 'directora', 'profesora', 'día', 'examen', 'paciencia', 'árbol'],
      propios: ['Ramón', 'Rosales', 'Idalia'],
      neutros: ['sexto', 'negra', 'negras'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué semillas sembraron en el vivero?', r: 'De caoba y de cedro.',
          o: ['De caoba y de cedro.', 'De pino y de roble.', 'De maíz y de frijol.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos arbolitos ha entregado el vivero en dos años?', r: 'Más de seiscientos.',
          o: ['Más de seiscientos.', 'Más de cien.', 'Más de diez mil.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué no se riega al mediodía?', r: 'Porque el sol quema la hoja tierna y evapora el agua antes de que la raíz la tome.',
          o: ['Porque los alumnos están en clase.', 'Porque el sol quema la hoja y evapora el agua.', 'Porque el agua está caliente a esa hora.'], c: 1 },
        { tipo: 'inferencial', q: '¿A qué se refiere la directora con «la paciencia de esperar un árbol»?', r: 'A que el resultado tarda años y hay que sostener el cuidado sin verlo pronto.',
          o: ['A que hay que esperar sentados en el vivero.', 'A que el resultado tarda años y hay que sostener el cuidado.', 'A que los exámenes son largos.'], c: 1 },
        { tipo: 'critica', q: '¿Se aprende más en un vivero o en un libro? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que reconozca el valor de ambos y sostenga su postura con una razón.',
          o: ['Solo en el libro: lo demás es perder el tiempo.', 'Solo en el vivero: los libros no sirven.', 'Cada uno enseña cosas distintas y las dos hacen falta.'], c: 2 },
      ] },
  ],

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LS6-01', titulo: 'Las piedras que hablan', genero: 'expositivo',
      texto: 'En Copán Ruinas, los mayas dejaron una escalinata con más de mil ochocientos bloques tallados. Cada bloque lleva un signo, y los signos juntos cuentan la historia de una dinastía: nombres de gobernantes, fechas de batallas, herencias de padre a hijo. Durante siglos nadie pudo leerla. Los primeros viajeros creyeron que era adorno. En el siglo veinte, varios investigadores descubrieron que la escritura maya mezcla dibujos que valen por una idea con dibujos que valen por un sonido, igual que si alguien escribiera «sol» con un círculo y «dado» con un cubo. A partir de ahí las piedras empezaron a hablar. Hoy se sabe el nombre del gobernante Dieciocho Conejo y hasta el día en que murió. Una ciudad que parecía callada resultó ser un archivo abierto.',
      susts: ['escalinata', 'bloques', 'bloque', 'signo', 'signos', 'historia', 'dinastía', 'nombres', 'gobernantes', 'fechas', 'batallas', 'herencias', 'padre', 'hijo', 'siglos', 'viajeros', 'adorno', 'siglo', 'investigadores', 'escritura', 'dibujos', 'idea', 'sonido', 'sol', 'dado', 'círculo', 'cubo', 'piedras', 'nombre', 'gobernante', 'día', 'ciudad', 'archivo'],
      propios: ['Copán', 'Ruinas', 'Dieciocho', 'Conejo'],
      neutros: ['mayas', 'maya', 'primeros'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hay tallado en la escalinata de Copán Ruinas?', r: 'Signos que cuentan la historia de una dinastía.',
          o: ['Signos que cuentan la historia de una dinastía.', 'Solo figuras de animales.', 'Nombres de los constructores.'], c: 0 },
        { tipo: 'literal', q: '¿Qué creyeron los primeros viajeros?', r: 'Que la escalinata era adorno.',
          o: ['Que era una escalera cualquiera.', 'Que era adorno.', 'Que la habían hecho los españoles.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la escritura maya costó tanto de entender?', r: 'Porque mezcla signos que valen por una idea con signos que valen por un sonido.',
          o: ['Porque las piedras estaban rotas.', 'Porque mezcla signos de idea con signos de sonido.', 'Porque los mayas la escribieron al revés.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «una ciudad callada resultó ser un archivo»?', r: 'Que lo que parecía mudo guardaba información escrita y ordenada.',
          o: ['Que en Copán Ruinas había bibliotecas.', 'Que lo que parecía mudo guardaba información escrita.', 'Que la ciudad estaba abandonada.'], c: 1 },
        { tipo: 'critica', q: '¿Por qué vale la pena estudiar una escritura de hace más de mil años?', r: 'Respuesta abierta: se valora que relacione el pasado con la identidad, la ciencia o el orgullo de saber quiénes fuimos.',
          o: ['No vale la pena: eso ya pasó.', 'Porque saber quiénes estuvieron antes explica quiénes somos ahora.', 'Solo sirve para los turistas.'], c: 1 },
      ] },

    { id: 'LS6-02', titulo: 'El café de la montaña', genero: 'expositivo',
      texto: 'En Marcala el café crece a más de mil doscientos metros, bajo la sombra de árboles grandes. Esa altura no es un detalle: el frío hace que el grano madure despacio y guarde más azúcar, y de ahí sale el sabor. La cosecha empieza en noviembre y doña Fidelina abre su cuadrilla desde temprano. Las cortadoras pasan por la mata varias veces, porque el fruto no madura parejo y solo se corta el que está rojo. Después viene el despulpado, la fermentación en una pila y el secado al sol sobre una tarima. Un descuido en cualquiera de esos pasos arruina el trabajo de todo un año. La cooperativa de La Esperanza revisa cada saco antes de exportarlo. Un lote rechazado se paga como café corriente, aunque sea de altura.',
      susts: ['café', 'metros', 'sombra', 'árboles', 'altura', 'detalle', 'frío', 'grano', 'azúcar', 'sabor', 'cosecha', 'noviembre', 'cuadrilla', 'cortadoras', 'mata', 'veces', 'fruto', 'despulpado', 'fermentación', 'pila', 'secado', 'sol', 'tarima', 'descuido', 'pasos', 'trabajo', 'año', 'cooperativa', 'saco', 'lote'],
      propios: ['Marcala', 'Fidelina', 'Esperanza'],
      neutros: ['rojo', 'corriente', 'doña'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuál es el único fruto que se corta?', r: 'El que está rojo.',
          o: ['El que está verde y firme.', 'Todos los de la mata.', 'El que está rojo.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hace la cooperativa antes de exportar?', r: 'Revisa cada saco.',
          o: ['Revisa cada saco.', 'Tuesta el grano.', 'Lo vende en el mercado local.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la altura mejora el sabor del café?', r: 'Porque el frío hace madurar el grano despacio y guardar más azúcar.',
          o: ['Porque el frío hace madurar el grano despacio.', 'Porque llueve más arriba.', 'Porque hay menos plagas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué un lote rechazado duele tanto al productor?', r: 'Porque se le paga como café corriente aunque haya trabajado todo el año en café de altura.',
          o: ['Porque tiene que botar el saco.', 'Porque se le paga como corriente todo un año de trabajo.', 'Porque debe volver a cortarlo.'], c: 1 },
        { tipo: 'critica', q: '¿Es justo que un solo descuido eche a perder el trabajo de un año? Argumenta.', r: 'Respuesta abierta: se valora que reconozca la exigencia de la calidad y a la vez lo duro del castigo.',
          o: ['Sí, y no hay nada que discutir.', 'Es duro, pero la calidad se pierde con un solo paso mal hecho.', 'No, el comprador debería pagar igual.'], c: 1 },
      ] },

    { id: 'LS6-03', titulo: 'La lancha de las siete', genero: 'narrativo',
      texto: 'En Guanaja no hay calles para carros: la calle es el mar. La lancha de las siete sale del muelle con estudiantes, bolsas de mandado y un termo de café para el maestro Óscar, que da clases en la isla. El motorista se llama Wilmer y conoce el canal de memoria, con bajos y arrecifes que no se ven desde arriba. Cuando el viento sopla del norte, la travesía se pone brava y él cambia la ruta sin decir nada. Los pasajeros ya conocen ese silencio: quiere decir agárrense. Una vez, un turista le pidió ir más rápido. Wilmer bajó la marcha en lugar de subirla. Explicó después, ya en el muelle, que en ese tramo la ola viene de lado y el apuro es lo que voltea una lancha.',
      susts: ['calles', 'carros', 'calle', 'mar', 'lancha', 'muelle', 'estudiantes', 'bolsas', 'mandado', 'termo', 'café', 'maestro', 'clases', 'isla', 'motorista', 'canal', 'memoria', 'bajos', 'arrecifes', 'viento', 'norte', 'travesía', 'ruta', 'pasajeros', 'silencio', 'vez', 'turista', 'marcha', 'tramo', 'ola', 'apuro'],
      propios: ['Guanaja', 'Wilmer', 'Óscar'],
      neutros: ['brava', 'siete', 'lugar'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué lleva la lancha de las siete?', r: 'Estudiantes, bolsas de mandado y un termo de café.',
          o: ['Estudiantes, bolsas de mandado y un termo de café.', 'Solo turistas.', 'Carga pesada para el muelle.'], c: 0 },
        { tipo: 'literal', q: '¿Qué hace Wilmer cuando el viento sopla del norte?', r: 'Cambia la ruta sin decir nada.',
          o: ['Suspende el viaje.', 'Pide ayuda por radio.', 'Cambia la ruta sin decir nada.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué los pasajeros entienden el silencio de Wilmer?', r: 'Porque viajan seguido con él y ya saben qué significa.',
          o: ['Porque él se los explicó una vez.', 'Porque viajan seguido con él y ya saben qué significa.', 'Porque el motor hace mucho ruido.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué bajó la marcha cuando le pidieron ir más rápido?', r: 'Porque en ese tramo la ola viene de lado y el apuro voltea la lancha.',
          o: ['Porque el motor estaba fallando.', 'Porque quería molestar al turista.', 'Porque ahí la ola viene de lado y el apuro voltea la lancha.'], c: 2 },
        { tipo: 'critica', q: '¿Debe un motorista obedecer a un pasajero que le pide apurarse? Argumenta.', r: 'Respuesta abierta: se valora que distinga entre atender al cliente y responder por la seguridad de todos.',
          o: ['Sí, el cliente manda.', 'Solo si el pasajero paga más.', 'No: el que responde por la vida de todos es él.'], c: 2 },
      ] },

    { id: 'LS6-04', titulo: 'El taller de la esquina', genero: 'descriptivo',
      texto: 'El taller de bicicletas de Chepe ocupa media acera en el barrio Guamilito. No tiene rótulo ni necesita uno: todo el mundo sabe dónde queda. La herramienta cuelga de un tablero de madera, cada llave en su clavo, y el suelo está manchado de aceite viejo. Chepe repara llantas, cambia cadenas y endereza rines con una calma que desespera a los apurados. Dice que una bicicleta avisa antes de quebrarse: un ruido nuevo, un pedal que se siente flojo, un freno que agarra tarde. El problema, según él, es que casi nadie escucha ese aviso y llegan cuando ya se rompió la pieza. Los muchachos del barrio, entre ellos Kevin, le llevan sus bicicletas y se quedan viendo un rato largo. Ninguno paga clase, pero varios ya saben parchar una llanta solos.',
      susts: ['taller', 'bicicletas', 'acera', 'barrio', 'rótulo', 'herramienta', 'tablero', 'madera', 'llave', 'clavo', 'suelo', 'aceite', 'llantas', 'cadenas', 'rines', 'calma', 'bicicleta', 'ruido', 'pedal', 'freno', 'problema', 'aviso', 'pieza', 'mundo', 'rato', 'muchachos', 'clase', 'llanta'],
      propios: ['Chepe', 'Guamilito', 'Kevin'],
      neutros: ['apurados', 'media'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo tiene Chepe la herramienta?', r: 'Colgada de un tablero de madera, cada llave en su clavo.',
          o: ['Colgada de un tablero, cada llave en su clavo.', 'Guardada en una caja bajo la mesa.', 'Regada por el suelo.'], c: 0 },
        { tipo: 'literal', q: 'Según Chepe, ¿cómo avisa una bicicleta antes de quebrarse?', r: 'Con un ruido nuevo, un pedal flojo o un freno que agarra tarde.',
          o: ['Con una luz en el manubrio.', 'No avisa de ninguna manera.', 'Con un ruido nuevo, un pedal flojo o un freno que agarra tarde.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué su calma «desespera a los apurados»?', r: 'Porque él trabaja despacio y con cuidado, y quien tiene prisa quisiera todo ya.',
          o: ['Porque cobra por hora.', 'Porque no habla con los clientes.', 'Porque trabaja despacio y con cuidado, y quien tiene prisa quisiera todo ya.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué está pasando con los muchachos que se quedan viendo?', r: 'Que están aprendiendo el oficio sin que nadie lo llame clase.',
          o: ['Que están aprendiendo el oficio sin que nadie lo llame clase.', 'Que esperan a que les regalen repuestos.', 'Que estorban el trabajo del taller.'], c: 0 },
        { tipo: 'critica', q: '¿Se aprende un oficio mirando? Defiende tu postura con una razón.', r: 'Respuesta abierta: se valora que reconozca el valor de observar y también el de practicar.',
          o: ['No: sin título no se aprende nada.', 'Solo si el maestro explica todo en voz alta.', 'Sí, mirando se aprende mucho, aunque después hay que hacerlo con las manos.'], c: 2 },
      ] },

    { id: 'LS6-05', titulo: 'La banda de guerra', genero: 'narrativo',
      texto: 'Dos meses antes del desfile, el instituto Central Vicente Cáceres saca la banda al patio. Al principio no hay música: hay ruido. Las cajas van cada una por su lado y los platillos entran tarde. La instructora, la profesora Wendy, no grita. Detiene todo, manda repetir cuatro compases y vuelve a detener. Un compañero llamado Alexis pregunta, ya cansado, por qué tanta repetición si el desfile dura apenas media hora. Ella responde que el público no ve los ensayos, pero oye el resultado, y que un redoble mal empatado se nota desde la acera. La víspera del quince de septiembre, la banda toca completa por primera vez. Nadie se equivoca. Esa noche, camino a casa, varios muchachos entienden por fin qué significa preparar algo de verdad.',
      susts: ['meses', 'desfile', 'instituto', 'banda', 'patio', 'principio', 'música', 'ruido', 'cajas', 'lado', 'platillos', 'instructora', 'profesora', 'compases', 'compañero', 'repetición', 'hora', 'público', 'ensayos', 'resultado', 'redoble', 'acera', 'víspera', 'vez', 'noche', 'casa', 'camino', 'septiembre', 'muchachos'],
      propios: ['Central', 'Vicente', 'Cáceres', 'Wendy', 'Alexis'],
      neutros: ['media', 'primera', 'fin', 'verdad'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hace la profesora Wendy cuando algo sale mal?', r: 'Detiene todo y manda repetir cuatro compases.',
          o: ['Detiene todo y manda repetir cuatro compases.', 'Grita hasta que salga bien.', 'Cambia a los músicos de lugar.'], c: 0 },
        { tipo: 'literal', q: '¿Cuándo toca la banda completa por primera vez?', r: 'La víspera del quince de septiembre.',
          o: ['La víspera del quince de septiembre.', 'El primer día de ensayo.', 'Un mes antes del desfile.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «el público no ve los ensayos, pero oye el resultado»?', r: 'Que el trabajo escondido es el que se nota cuando llega el momento.',
          o: ['Que el público llega tarde al desfile.', 'Que el trabajo escondido es el que se nota cuando llega el momento.', 'Que los ensayos son secretos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué al principio «no hay música: hay ruido»?', r: 'Porque cada instrumento va por su lado y todavía no están coordinados.',
          o: ['Porque cada instrumento va por su lado y no están coordinados.', 'Porque nadie sabe leer música.', 'Porque los instrumentos están dañados.'], c: 0 },
        { tipo: 'critica', q: '¿Vale la pena ensayar dos meses para media hora de desfile? Argumenta.', r: 'Respuesta abierta: se valora que sostenga su postura relacionando el esfuerzo con el resultado o con lo aprendido.',
          o: ['No: es demasiado tiempo perdido.', 'Solo si ganan el primer lugar.', 'Sí: lo que se aprende ensayando dura más que el desfile.'], c: 2 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LS7-01', titulo: 'El puente que se llevó la creciente', genero: 'narrativo',
      texto: 'El puente viejo de Santa Rita aguantó cuarenta años de camiones y de invierno. La noche que el huracán entró por el norte, la creciente subió tanto que el agua pasó por encima del piso y arrancó los estribos. Al amanecer solo quedaban dos muñones de concreto y un cable colgando. La aldea quedó partida en dos: la escuela y el centro de salud de un lado, y la mitad de las casas del otro. Durante nueve meses la gente cruzó en una canoa que manejaba don Alberto. Los alumnos llegaban con el uniforme mojado hasta la rodilla. Cuando por fin llegó la maquinaria, el ingeniero explicó que el puente nuevo iría más alto y con la base más ancha, porque el río ya había enseñado hasta dónde puede llegar. Nadie discutió el gasto, ni siquiera los que vivían del otro lado y ya se habían acostumbrado a la canoa.',
      susts: ['puente', 'años', 'camiones', 'invierno', 'noche', 'huracán', 'norte', 'creciente', 'agua', 'piso', 'estribos', 'muñones', 'concreto', 'cable', 'aldea', 'escuela', 'centro', 'salud', 'lado', 'mitad', 'casas', 'meses', 'gente', 'canoa', 'alumnos', 'uniforme', 'rodilla', 'maquinaria', 'ingeniero', 'base', 'río', 'gasto'],
      propios: ['Santa', 'Rita', 'Alberto'],
      neutros: ['don', 'amanecer', 'viejo', 'fin'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué quedó del puente después de la creciente?', r: 'Dos muñones de concreto y un cable colgando.',
          o: ['Solo el piso, sin los estribos.', 'Dos muñones de concreto y un cable colgando.', 'Nada, ni una piedra.'], c: 1 },
        { tipo: 'literal', q: '¿Cómo cruzó la gente durante nueve meses?', r: 'En una canoa que manejaba don Alberto.',
          o: ['En una canoa que manejaba don Alberto.', 'Por un puente provisional de tablas.', 'Dando la vuelta por otra aldea.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el puente nuevo se hizo más alto y con la base más ancha?', r: 'Porque el río ya había mostrado hasta dónde puede subir.',
          o: ['Porque el río ya había mostrado hasta dónde puede subir.', 'Porque así se veía más bonito.', 'Porque era más barato construirlo así.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué significa que «la aldea quedó partida en dos»?', r: 'Que los servicios quedaron de un lado y muchas casas del otro, sin paso entre ellos.',
          o: ['Que los servicios quedaron de un lado y muchas casas del otro.', 'Que el terreno se rajó por el temblor.', 'Que la gente se peleó y se dividió.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué crees que «nadie discutió el gasto» del puente nuevo?', r: 'Respuesta abierta: se valora que relacione el costo con lo que la comunidad ya había sufrido sin puente.',
          o: ['Porque la gente no entiende de dinero.', 'Porque el ingeniero no dejó opinar a nadie.', 'Porque ya habían vivido nueve meses lo que cuesta no tenerlo.'], c: 2 },
      ] },

    { id: 'LS7-02', titulo: 'La feria de La Esperanza', genero: 'descriptivo',
      texto: 'La feria patronal de La Esperanza llena el parque central durante una semana. Desde el jueves los comerciantes arman champas de lona y sacan mesas con dulces de leche, rosquillas y tamales. En una esquina, un hombre vende sombreros de junco tejidos en Santa Bárbara. Al otro lado, dos muchachas ofrecen collares de semilla y ponchos de lana. El olor de la carne asada se mezcla con el humo de la leña y con el perfume dulce de los buñuelos. Por la tarde entra la procesión y la música de la banda tapa por un rato el ruido de los juegos mecánicos. Los niños miran la rueda de Chicago con la boca abierta. Doña Aurora, que vende atol desde hace treinta años, dice que la feria no es el negocio: es el único momento del año en que ve a todos sus parientes juntos.',
      susts: ['feria', 'parque', 'semana', 'jueves', 'comerciantes', 'champas', 'lona', 'mesas', 'dulces', 'leche', 'rosquillas', 'tamales', 'esquina', 'hombre', 'sombreros', 'junco', 'lado', 'muchachas', 'collares', 'semilla', 'ponchos', 'lana', 'olor', 'carne', 'humo', 'leña', 'perfume', 'buñuelos', 'tarde', 'procesión', 'música', 'banda', 'rato', 'ruido', 'juegos', 'niños', 'rueda', 'boca', 'atol', 'años', 'negocio', 'momento', 'año', 'parientes'],
      propios: ['Esperanza', 'Santa', 'Bárbara', 'Chicago', 'Aurora'],
      neutros: ['Doña', 'central', 'patronal'],
      preguntas: [
        { tipo: 'literal', q: '¿De dónde vienen los sombreros de junco?', r: 'De Santa Bárbara.',
          o: ['De Santa Bárbara.', 'De La Esperanza.', 'De Chicago.'], c: 0 },
        { tipo: 'literal', q: '¿Qué vende doña Aurora?', r: 'Atol, desde hace treinta años.',
          o: ['Atol, desde hace treinta años.', 'Collares de semilla.', 'Carne asada.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la música de la banda «tapa por un rato el ruido de los juegos»?', r: 'Porque la procesión pasa y su música se impone sobre lo demás.',
          o: ['Porque la procesión pasa y su música se impone sobre lo demás.', 'Porque apagan los juegos mecánicos.', 'Porque los niños se van a la iglesia.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué revela lo que dice doña Aurora sobre el valor de la feria?', r: 'Que para ella vale más el reencuentro familiar que la ganancia.',
          o: ['Que el negocio del atol le va muy bien.', 'Que para ella vale más el reencuentro familiar que la ganancia.', 'Que preferiría que la feria durara más.'], c: 1 },
        { tipo: 'critica', q: '¿Deberían las ferias patronales seguir organizándose igual que siempre? Argumenta.', r: 'Respuesta abierta: se valora que sostenga su postura hablando de tradición, economía local o cambios necesarios.',
          o: ['No: son cosas viejas que ya no sirven.', 'Sí en lo que une a la gente, aunque haya cosas que mejorar.', 'Da igual, la feria no cambia nada.'], c: 1 },
      ] },

    { id: 'LS7-03', titulo: 'El barro de Ojojona', genero: 'expositivo',
      texto: 'En Ojojona la alfarería no se aprende en un curso: se aprende mirando. El barro se saca de una mina cercana, se deja secar al sol y se muele con un mazo hasta volverlo polvo. Después se cierne, se moja y se amasa con los pies, porque el pie siente los grumos que la mano deja pasar. La pieza se levanta en el torno o a puro pulso, según lo que se vaya a hacer. Luego viene el secado a la sombra: al sol directo la olla se raja. La cocción dura horas en un horno de leña, y ahí se decide todo. Doña Rufina calcula la temperatura por el color del fuego, sin termómetro. Su nieta Yessenia ya reconoce ese punto, aunque todavía no sabría explicarlo con palabras. En el taller nadie lleva apuntes: el saber se guarda en la mano y se pasa de una generación a la siguiente.',
      susts: ['alfarería', 'curso', 'barro', 'mina', 'sol', 'mazo', 'polvo', 'pies', 'pie', 'grumos', 'mano', 'pieza', 'torno', 'pulso', 'secado', 'sombra', 'olla', 'cocción', 'horas', 'horno', 'leña', 'temperatura', 'color', 'fuego', 'termómetro', 'nieta', 'punto', 'palabras', 'taller', 'apuntes', 'saber', 'generación'],
      propios: ['Ojojona', 'Rufina', 'Yessenia'],
      neutros: ['Doña', 'todo', 'directo'],
      preguntas: [
        { tipo: 'literal', q: '¿Por qué el barro se amasa con los pies?', r: 'Porque el pie siente los grumos que la mano deja pasar.',
          o: ['Porque las manos se ensucian mucho.', 'Porque así se trabaja más rápido.', 'Porque el pie siente los grumos que la mano deja pasar.'], c: 2 },
        { tipo: 'literal', q: '¿Cómo calcula doña Rufina la temperatura del horno?', r: 'Por el color del fuego, sin termómetro.',
          o: ['Con un termómetro viejo.', 'Por el color del fuego, sin termómetro.', 'Contando las horas exactas.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el secado se hace a la sombra y no al sol?', r: 'Porque al sol directo la pieza se raja.',
          o: ['Porque a la sombra seca más rápido.', 'Porque al sol directo la pieza se raja.', 'Porque el sol le cambia el color.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que Yessenia reconoce el punto «aunque no sabría explicarlo»?', r: 'Que aprendió con la práctica un saber que todavía no puede poner en palabras.',
          o: ['Que aprendió con la práctica un saber que aún no puede poner en palabras.', 'Que su abuela no quiere enseñarle.', 'Que no ha estudiado lo suficiente.'], c: 0 },
        { tipo: 'critica', q: '¿Se puede enseñar en un aula un oficio que «se aprende mirando»? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre el saber teórico y el que se forma con las manos.',
          o: ['Sí, cualquier cosa se enseña con un libro.', 'En parte: lo del ojo y la mano pide práctica al lado de quien sabe.', 'No, ese saber se pierde y ya.'], c: 1 },
      ] },

    { id: 'LS7-04', titulo: 'La cuadrilla contra el fuego', genero: 'narrativo',
      texto: 'En verano, el humo se ve desde lejos y la radio del pueblo lo anuncia antes que nadie. La cuadrilla de Catacamas, en el corazón de Olancho, se junta en la entrada del bosque con palas, rastrillos y bombas de espalda. Nadie usa agua: no la hay a esa altura. Lo que se hace es abrir una ronda, una franja de tierra pelada de dos metros de ancho que el fuego no puede saltar. Los muchachos raspan la hojarasca hasta dejar el suelo desnudo. El calor reseca la garganta y la ceniza se mete en los ojos. El jefe de brigada, don Wilfredo, revisa el viento cada cierto rato, porque un cambio de rumbo convierte la ronda en una trampa. Al día siguiente el pino queda negro, pero de pie. La raíz aguanta y en dos inviernos el monte vuelve. Lo que no vuelve, advierte don Wilfredo, es el suelo que la lluvia se lleva de una ladera quemada dos años seguidos.',
      susts: ['verano', 'humo', 'radio', 'pueblo', 'cuadrilla', 'entrada', 'bosque', 'palas', 'rastrillos', 'bombas', 'espalda', 'agua', 'altura', 'ronda', 'franja', 'tierra', 'metros', 'ancho', 'fuego', 'muchachos', 'hojarasca', 'suelo', 'calor', 'garganta', 'ceniza', 'ojos', 'jefe', 'brigada', 'viento', 'rato', 'cambio', 'rumbo', 'trampa', 'día', 'pino', 'pie', 'raíz', 'inviernos', 'monte', 'corazón', 'lluvia', 'ladera', 'años'],
      propios: ['Catacamas', 'Wilfredo', 'Olancho'],
      neutros: ['don', 'desnudo', 'pelada'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué es una ronda?', r: 'Una franja de tierra pelada de dos metros de ancho.',
          o: ['Una manguera larga que rodea el bosque.', 'Un turno de vigilancia nocturna.', 'Una franja de tierra pelada de dos metros de ancho.'], c: 2 },
        { tipo: 'literal', q: '¿Qué revisa don Wilfredo cada cierto rato?', r: 'El viento.',
          o: ['La cantidad de agua.', 'El viento.', 'La hora del día.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué un cambio de viento «convierte la ronda en una trampa»?', r: 'Porque el fuego puede girar y dejar a la cuadrilla del lado equivocado.',
          o: ['Porque la ronda se llena de humo.', 'Porque el viento apaga las bombas.', 'Porque el fuego puede girar y dejarlos del lado equivocado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el pino queda negro «pero de pie»?', r: 'Porque el fuego quemó la superficie sin matar la raíz.',
          o: ['Porque lo apagaron con agua a tiempo.', 'Porque el pino no arde nunca.', 'Porque el fuego quemó la superficie sin matar la raíz.'], c: 2 },
        { tipo: 'critica', q: '¿Debería pagarse un salario a estas cuadrillas? Argumenta tu postura.', r: 'Respuesta abierta: se valora que pese el riesgo y el servicio prestado contra la realidad de los fondos públicos.',
          o: ['Sí: arriesgan la vida en un trabajo que beneficia a todos.', 'No: es un deber de la comunidad y ya.', 'Solo si el bosque es privado.'], c: 0 },
      ] },

    { id: 'LS7-05', titulo: 'Los pescadores de los cayos', genero: 'expositivo',
      texto: 'En Chachahuate, un cayo de arena del tamaño de una cancha, viven unas cuarenta familias garífunas. No hay pozo ni tubería: el agua dulce llega en cayucos desde tierra firme, en bidones. La luz la dan paneles solares y una planta que se enciende un par de horas por la noche. Los hombres salen a pescar de madrugada con línea de mano, no con red, y regresan al mediodía con pargo y barracuda. Las mujeres limpian el pescado en la orilla y guardan el hielo como si fuera oro, porque sin hielo la captura no llega entera al mercado de La Ceiba. En los últimos años el turismo trajo visitantes y también basura. La comunidad decidió cobrar una cuota de entrada y con ese fondo pagan la recolección. Nadie de afuera se los sugirió. Doña Tomasa, que preside el comité, lleva la cuenta en una libreta y la lee en voz alta cada mes frente a todos.',
      susts: ['cayo', 'arena', 'tamaño', 'cancha', 'familias', 'pozo', 'tubería', 'agua', 'cayucos', 'tierra', 'bidones', 'luz', 'paneles', 'planta', 'par', 'horas', 'noche', 'hombres', 'madrugada', 'línea', 'mano', 'red', 'mediodía', 'pargo', 'barracuda', 'mujeres', 'pescado', 'orilla', 'hielo', 'oro', 'captura', 'mercado', 'años', 'turismo', 'visitantes', 'basura', 'comunidad', 'cuota', 'entrada', 'fondo', 'recolección', 'comité', 'cuenta', 'libreta', 'voz', 'mes'],
      propios: ['Chachahuate', 'Ceiba', 'Tomasa'],
      neutros: ['garífunas', 'dulce', 'firme', 'doña', 'alta'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo llega el agua dulce a Chachahuate?', r: 'En cayucos desde tierra firme, en bidones.',
          o: ['Por una tubería submarina.', 'De un pozo del cayo.', 'En cayucos desde tierra firme, en bidones.'], c: 2 },
        { tipo: 'literal', q: '¿Con qué pescan los hombres?', r: 'Con línea de mano, no con red.',
          o: ['Con red grande.', 'Con línea de mano, no con red.', 'Con arpón.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué guardan el hielo «como si fuera oro»?', r: 'Porque sin hielo la captura se echa a perder antes de llegar al mercado.',
          o: ['Porque el hielo cuesta carísimo.', 'Porque lo usan para el agua de beber.', 'Porque sin hielo la captura se echa a perder antes de llegar al mercado.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué muestra la frase final, «nadie de afuera se los sugirió»?', r: 'Que la solución al problema de la basura salió de la propia comunidad.',
          o: ['Que nadie los visita nunca.', 'Que no aceptan consejos de nadie.', 'Que la solución salió de la propia comunidad.'], c: 2 },
        { tipo: 'critica', q: '¿Es justo cobrar una cuota de entrada a los visitantes? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que relacione el cobro con el costo real que deja el turismo.',
          o: ['Sí: quien genera el gasto de la basura ayuda a pagarlo.', 'No: la playa es de todos y no se cobra.', 'Solo si el visitante es extranjero.'], c: 0 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LS8-01', titulo: 'La línea que ya no pasa', genero: 'expositivo',
      texto: 'Entre Puerto Cortés y El Progreso todavía se ven los rieles hundidos en el zacate. Por esa vía pasó durante décadas el tren que llevaba banano hasta el muelle. El ferrocarril no se construyó para la gente: se construyó para la fruta, y sin embargo la gente lo hizo suyo. En cada apeadero creció un caserío, y varios pueblos del valle deben su nombre a una parada del tren. Cuando la compañía cambió el transporte por camiones, las locomotoras se quedaron oxidándose y los rieles empezaron a desaparecer. Algunos tramos se los llevó el invierno; otros, la venta de chatarra. Hoy quedan durmientes sueltos, un puente de hierro sin uso y estaciones convertidas en bodegas o en viviendas. Un historiador de la zona insiste en que ese hierro no es basura: es el documento más grande que tiene el valle sobre cómo se pobló. Nadie lo ha declarado patrimonio todavía, y cada invierno que pasa se lleva otro pedazo de esa historia sin que nadie tome nota.',
      susts: ['rieles', 'zacate', 'vía', 'décadas', 'tren', 'banano', 'muelle', 'ferrocarril', 'gente', 'fruta', 'apeadero', 'caserío', 'pueblos', 'valle', 'nombre', 'parada', 'compañía', 'transporte', 'camiones', 'locomotoras', 'tramos', 'invierno', 'venta', 'chatarra', 'durmientes', 'puente', 'hierro', 'uso', 'estaciones', 'bodegas', 'viviendas', 'historiador', 'zona', 'basura', 'documento', 'patrimonio', 'pedazo', 'historia'],
      propios: ['Puerto', 'Cortés', 'Progreso'],
      neutros: ['sueltos', 'Algunos', 'nota'],
      preguntas: [
        { tipo: 'literal', q: '¿Para qué se construyó el ferrocarril?', r: 'Para llevar el banano hasta el muelle, no para la gente.',
          o: ['Para transportar pasajeros del valle.', 'Para llevar el banano hasta el muelle.', 'Para unir dos capitales.'], c: 1 },
        { tipo: 'literal', q: '¿En qué se convirtieron muchas estaciones?', r: 'En bodegas o en viviendas.',
          o: ['En museos del ferrocarril.', 'En escuelas del valle.', 'En bodegas o en viviendas.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué varios pueblos deben su nombre a una parada del tren?', r: 'Porque los caseríos nacieron alrededor de los apeaderos.',
          o: ['Porque los caseríos nacieron alrededor de los apeaderos.', 'Porque los bautizaron los ingenieros extranjeros.', 'Porque el tren llevaba los nombres pintados.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué quiere decir el historiador con que el hierro «es un documento»?', r: 'Que esos restos cuentan la historia del poblamiento del valle igual que lo haría un papel.',
          o: ['Que esos restos cuentan la historia del poblamiento del valle.', 'Que el hierro se puede vender caro.', 'Que hay papeles escondidos dentro de las locomotoras.'], c: 0 },
        { tipo: 'critica', q: '¿Debería declararse patrimonio lo que queda del ferrocarril? Argumenta.', r: 'Respuesta abierta: se valora que pese el valor histórico contra el costo de conservarlo.',
          o: ['Sí: sin ese rastro se pierde cómo se pobló el valle.', 'No: es chatarra y estorba.', 'Solo si viene un turista a verlo.'], c: 0 },
      ] },

    { id: 'LS8-02', titulo: 'La escuela de dos aulas', genero: 'narrativo',
      texto: 'La escuela de la aldea El Zapote tiene dos aulas y dos maestras para seis grados. La profesora Delmy atiende de primero a tercero en el aula de adelante; la profesora Marleny, de cuarto a sexto en la de atrás. Cada maestra maneja tres pizarras dentro del mismo salón, una por grado, y camina de una a otra durante toda la mañana. El método suena imposible y funciona por una razón concreta: los mayores explican a los menores. Un alumno de sexto que le enseña una división a uno de cuarto tiene que entenderla dos veces, y en ese segundo entendimiento está la ganancia. Al mediodía las dos maestras cocinan la merienda con lo que manda el programa y con lo que aportan los padres. Delmy dice que su mayor problema no es el número de alumnos: es que cada año, cuando por fin arma el grupo, alguna familia emigra y se lleva a tres.',
      susts: ['escuela', 'aldea', 'aulas', 'maestras', 'grados', 'profesora', 'aula', 'maestra', 'pizarras', 'salón', 'grado', 'mañana', 'método', 'razón', 'mayores', 'menores', 'alumno', 'división', 'veces', 'entendimiento', 'ganancia', 'mediodía', 'merienda', 'programa', 'padres', 'problema', 'número', 'alumnos', 'año', 'grupo', 'familia'],
      propios: ['Zapote', 'Delmy', 'Marleny'],
      neutros: ['primero', 'tercero', 'cuarto', 'sexto', 'segundo', 'fin'],
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas pizarras maneja cada maestra dentro del salón?', r: 'Tres, una por grado.',
          o: ['Una sola para todos.', 'Tres, una por grado.', 'Seis, una por alumno mayor.'], c: 1 },
        { tipo: 'literal', q: '¿Con qué cocinan la merienda?', r: 'Con lo que manda el programa y lo que aportan los padres.',
          o: ['Solo con lo que manda el programa.', 'Con lo que compran las maestras.', 'Con lo que manda el programa y lo que aportan los padres.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué funciona que los mayores expliquen a los menores?', r: 'Porque quien explica tiene que entender el tema una segunda vez, y ahí aprende más.',
          o: ['Porque quien explica tiene que entender el tema una segunda vez.', 'Porque así la maestra descansa.', 'Porque los menores copian las respuestas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la emigración es un problema mayor que el número de alumnos?', r: 'Porque le deshace el grupo cada año, justo cuando ya está formado.',
          o: ['Porque las aulas quedan vacías y las cierran.', 'Porque los que se van no vuelven a estudiar.', 'Porque le deshace el grupo cada año, justo cuando ya está formado.'], c: 2 },
        { tipo: 'critica', q: '¿Es aceptable que dos maestras atiendan seis grados? Defiende tu postura.', r: 'Respuesta abierta: se valora que reconozca el esfuerzo real y a la vez la deuda del sistema con esa escuela.',
          o: ['No: funciona por el esfuerzo de ellas, no porque esté bien resuelto.', 'Sí, se las arreglan bien y no hace falta más.', 'Da igual, en la aldea no hay muchos niños.'], c: 0 },
      ] },

    { id: 'LS8-03', titulo: 'El mural de la cancha', genero: 'narrativo',
      texto: 'La pared de la cancha del barrio San Miguel estuvo veinte años llena de rayones y de propaganda vieja. Un grupo de jóvenes pidió permiso al patronato para pintarla y le pusieron una condición: que el dibujo saliera de una asamblea, no de la cabeza de uno solo. Hicieron tres reuniones. Los ancianos querían el cerro y el río; los niños, un partido de fútbol; las señoras, la fila del agua, porque esa fila es la historia diaria del barrio. Al final entró todo. El mural mide treinta metros y en la esquina lleva los nombres de las cuarenta personas que aportaron pintura, andamio o comida. Desde que está pintado nadie ha vuelto a rayar la pared. Un muchacho llamado Nery lo explicó con una frase que quedó dando vueltas: uno no raya lo que ayudó a hacer. El patronato guardó los bocetos de las tres reuniones en una carpeta, porque esos papeles cuentan cómo se puso de acuerdo un barrio entero.',
      susts: ['pared', 'cancha', 'barrio', 'años', 'rayones', 'propaganda', 'grupo', 'jóvenes', 'permiso', 'patronato', 'condición', 'dibujo', 'asamblea', 'cabeza', 'reuniones', 'ancianos', 'cerro', 'río', 'niños', 'partido', 'fútbol', 'señoras', 'fila', 'agua', 'historia', 'mural', 'metros', 'esquina', 'nombres', 'personas', 'pintura', 'andamio', 'comida', 'muchacho', 'frase', 'vueltas', 'bocetos', 'carpeta', 'papeles', 'acuerdo'],
      propios: ['San', 'Miguel', 'Nery'],
      neutros: ['todo', 'uno', 'vieja', 'final'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué condición puso el patronato?', r: 'Que el dibujo saliera de una asamblea, no de una sola persona.',
          o: ['Que terminaran en una semana.', 'Que la pintura la pagaran los jóvenes.', 'Que el dibujo saliera de una asamblea.'], c: 2 },
        { tipo: 'literal', q: '¿Qué querían pintar las señoras?', r: 'La fila del agua.',
          o: ['El cerro y el río.', 'La fila del agua.', 'Un partido de fútbol.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué las señoras proponían la fila del agua?', r: 'Porque esa fila es parte de la vida diaria del barrio.',
          o: ['Porque esa fila es parte de la vida diaria del barrio.', 'Porque era más fácil de dibujar.', 'Porque querían pedir agua a la alcaldía.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué nadie ha vuelto a rayar la pared?', r: 'Porque el barrio la siente propia después de haber participado.',
          o: ['Porque el barrio la siente propia después de haber participado.', 'Porque la pintura no se deja rayar.', 'Porque el patronato puso vigilancia.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve de algo pintar un mural en un barrio con problemas más grandes? Argumenta.', r: 'Respuesta abierta: se valora que discuta si lo simbólico cambia conductas o si distrae de lo urgente.',
          o: ['No: primero hay que resolver lo importante.', 'Sí: lo que la gente construye junta cambia cómo se cuida el lugar.', 'Solo si lo paga la alcaldía.'], c: 1 },
      ] },

    { id: 'LS8-04', titulo: 'Las lagunas de Choluteca', genero: 'expositivo',
      texto: 'En el sur de Honduras, entre Marcovia y el estero, se extienden lagunas de camarón que se ven desde el aire como un tablero de agua. La actividad da empleo a miles de personas y exporta a Europa y a Estados Unidos. También cambió el paisaje: donde había manglar hay ahora bordos y compuertas. El manglar no era monte inútil. Sus raíces son el criadero natural de la larva, sostienen la orilla cuando llega una marea grande y filtran el agua que baja de los ríos. Cortarlo para hacer una laguna produce camarón a corto plazo y quita la fábrica que produce el camarón a largo plazo. Hoy varias empresas siembran mangle en los bordos y dejan corredores de vegetación entre una laguna y otra. Un biólogo del lugar lo resume sin adornos: el negocio depende del ecosistema que se estaba comiendo. El cambio no salió de una ley nueva, sino de una cuenta sencilla que cualquier productor puede hacer con lápiz y papel.',
      susts: ['sur', 'estero', 'lagunas', 'camarón', 'aire', 'tablero', 'agua', 'actividad', 'empleo', 'miles', 'personas', 'paisaje', 'manglar', 'bordos', 'compuertas', 'monte', 'raíces', 'criadero', 'larva', 'orilla', 'marea', 'ríos', 'laguna', 'plazo', 'fábrica', 'empresas', 'mangle', 'corredores', 'vegetación', 'biólogo', 'lugar', 'adornos', 'negocio', 'ecosistema', 'cambio', 'ley', 'cuenta', 'productor', 'lápiz', 'papel'],
      propios: ['Honduras', 'Marcovia', 'Europa', 'Estados', 'Unidos'],
      neutros: ['inútil', 'natural'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué función cumplen las raíces del manglar?', r: 'Son criadero de la larva, sostienen la orilla y filtran el agua.',
          o: ['Marcan el límite entre las lagunas.', 'Sirven de leña para las fincas.', 'Son criadero de la larva, sostienen la orilla y filtran el agua.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hacen hoy varias empresas?', r: 'Siembran mangle en los bordos y dejan corredores de vegetación.',
          o: ['Cierran las lagunas más viejas.', 'Siembran mangle en los bordos y dejan corredores de vegetación.', 'Exportan solo a Europa.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué cortar el manglar es un mal negocio a largo plazo?', r: 'Porque destruye el criadero natural del que depende el propio camarón.',
          o: ['Porque la madera vale poco.', 'Porque destruye el criadero natural del que depende el propio camarón.', 'Porque la marea se lleva los bordos.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir el biólogo con «el negocio depende del ecosistema que se estaba comiendo»?', r: 'Que la actividad se destruía a sí misma al destruir el manglar.',
          o: ['Que el camarón se alimenta de manglar.', 'Que los biólogos no entienden de negocios.', 'Que la actividad se destruía a sí misma al destruir el manglar.'], c: 2 },
        { tipo: 'critica', q: '¿Se puede producir camarón y cuidar el manglar a la vez? Defiende tu postura.', r: 'Respuesta abierta: se valora que proponga condiciones concretas en vez de responder solo sí o no.',
          o: ['No: una cosa excluye a la otra.', 'Sí, si se ponen límites y se repone lo que se corta.', 'Da igual, el manglar vuelve solo.'], c: 1 },
      ] },

    { id: 'LS8-05', titulo: 'El archivo de la alcaldía', genero: 'expositivo',
      texto: 'En el segundo piso de la alcaldía de Yuscarán hay un cuarto con estantes de madera y cajas amarradas con cinta. Ahí están las actas de nacimiento, los libros de defunción y los títulos de tierra de más de un siglo. La humedad y el comején hicieron más daño que cualquier incendio: hay páginas que se deshacen al tocarlas. Una secretaria, doña Blanca, tomó una decisión que nadie le ordenó. Empezó a fotografiar página por página con un teléfono, a guardar las imágenes por año y a anotar en un cuaderno qué caja iba en qué carpeta. Lleva ocho mil fotografías. No es un archivo digital como manda la técnica, pero un vecino que necesitó probar la propiedad de su solar la encontró ahí, en una foto, cuando el papel original ya estaba ilegible. La costumbre del pueblo cambió: ahora la gente de todo El Paraíso pregunta primero por el cuaderno de doña Blanca, antes que por el estante.',
      susts: ['piso', 'alcaldía', 'cuarto', 'estantes', 'madera', 'cajas', 'cinta', 'actas', 'nacimiento', 'libros', 'defunción', 'títulos', 'tierra', 'siglo', 'humedad', 'comején', 'daño', 'incendio', 'páginas', 'secretaria', 'decisión', 'página', 'teléfono', 'imágenes', 'año', 'cuaderno', 'caja', 'carpeta', 'fotografías', 'archivo', 'técnica', 'vecino', 'propiedad', 'solar', 'foto', 'papel', 'costumbre', 'pueblo', 'gente', 'estante'],
      propios: ['Yuscarán', 'Blanca', 'Paraíso'],
      neutros: ['doña', 'segundo', 'digital', 'original', 'primero'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué hizo doña Blanca sin que nadie se lo ordenara?', r: 'Fotografiar página por página y anotar qué caja iba en qué carpeta.',
          o: ['Pedir dinero para un archivo digital.', 'Botar los papeles dañados.', 'Fotografiar página por página y anotar qué caja iba en qué carpeta.'], c: 2 },
        { tipo: 'literal', q: '¿Qué hizo más daño que un incendio?', r: 'La humedad y el comején.',
          o: ['Una inundación del río.', 'Un robo de documentos.', 'La humedad y el comején.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que su trabajo «no es un archivo digital como manda la técnica»?', r: 'Porque lo hizo con un teléfono y un cuaderno, sin el método formal, aunque funciona.',
          o: ['Porque lo hizo con un teléfono y un cuaderno, sin el método formal.', 'Porque las fotos salieron borrosas.', 'Porque no tiene computadora en la alcaldía.'], c: 0 },
        { tipo: 'inferencial', q: '¿Qué demuestra el caso del vecino que probó la propiedad de su solar?', r: 'Que ese trabajo improvisado salvó información que ya se había perdido en el papel.',
          o: ['Que los títulos de tierra no sirven.', 'Que ese trabajo salvó información ya perdida en el papel.', 'Que doña Blanca cobra por las fotos.'], c: 1 },
        { tipo: 'critica', q: '¿Debe la alcaldía adoptar como oficial el trabajo de doña Blanca? Argumenta.', r: 'Respuesta abierta: se valora que discuta el valor de lo hecho y la necesidad de respaldarlo con método y recursos.',
          o: ['Sí, y además darle el respaldo y el método que le faltan.', 'No: no cumple la técnica y punto.', 'Solo si ella lo sigue haciendo gratis.'], c: 0 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LS9-01', titulo: 'Los nombres del mapa', genero: 'expositivo',
      texto: 'Un mapa de Honduras es también un archivo de lenguas. Comayagua, Ojojona, Siguatepeque, Erandique, Tegucigalpa: la mayoría de esos nombres no vienen del español, sino del náhuatl, del lenca o de otras lenguas que se hablaban antes de la Colonia. Un topónimo es una descripción congelada. Muchos guardan un accidente del terreno, un árbol, un animal o el oficio de quien vivía ahí. Cuando el sonido original pasó al oído de un escribano español, se deformó y quedó escrito de una manera que ya no se puede deshacer del todo. Por eso los especialistas discuten el significado exacto de varios nombres y no se ponen de acuerdo. Lo que nadie discute es lo que revela el conjunto: el país estuvo poblado y nombrado mucho antes de que alguien lo dibujara en un papel. Cambiarle el nombre a un lugar, entonces, no es un trámite. Es borrar la única palabra que sobrevivió de quienes estuvieron ahí primero, y ninguna decisión de oficina puede reponer después ese pedazo de historia que ya nadie escribió en otra parte.',
      susts: ['mapa', 'archivo', 'lenguas', 'mayoría', 'nombres', 'español', 'náhuatl', 'lenca', 'Colonia', 'topónimo', 'descripción', 'accidente', 'terreno', 'árbol', 'animal', 'oficio', 'sonido', 'oído', 'escribano', 'manera', 'especialistas', 'significado', 'conjunto', 'país', 'papel', 'nombre', 'lugar', 'trámite', 'palabra', 'decisión', 'oficina', 'pedazo', 'historia', 'parte'],
      propios: ['Honduras', 'Comayagua', 'Ojojona', 'Siguatepeque', 'Erandique', 'Tegucigalpa'],
      neutros: ['original', 'exacto', 'primero'],
      preguntas: [
        { tipo: 'literal', q: '¿De qué lenguas vienen la mayoría de esos nombres?', r: 'Del náhuatl, del lenca y de otras lenguas anteriores a la Colonia.',
          o: ['Del inglés de los colonos.', 'Del español antiguo.', 'Del náhuatl, del lenca y de otras lenguas anteriores a la Colonia.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto llama a un topónimo «una descripción congelada»?', r: 'Porque guarda fija una característica del lugar tal como era cuando se le puso el nombre.',
          o: ['Porque guarda fija una característica del lugar de cuando se nombró.', 'Porque los mapas se hacen en lugares fríos.', 'Porque ya nadie usa esos nombres.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué los especialistas no se ponen de acuerdo en el significado de varios nombres?', r: 'Porque el sonido original se deformó al ser escrito por oído en otra lengua.',
          o: ['Porque no estudian lo suficiente.', 'Porque el sonido original se deformó al ser escrito por oído en otra lengua.', 'Porque los mapas antiguos se perdieron.'], c: 1 },
        { tipo: 'critica', q: '¿Debería poder cambiarse el nombre de un municipio por decisión de sus autoridades? Argumenta.', r: 'Respuesta abierta: se valora que ponga en tensión la autonomía local con el valor histórico del topónimo.',
          o: ['Con mucho cuidado: se está decidiendo sobre un rastro que no se puede reponer.', 'Sí, si la mayoría lo aprueba no hay nada que discutir.', 'No, los nombres no importan.'], c: 0 },
        { tipo: 'critica', q: '¿Qué se pierde cuando desaparece una lengua, además de sus palabras?', r: 'Respuesta abierta: se valora que mencione la forma de nombrar el mundo, el conocimiento del territorio o la identidad.',
          o: ['Se pierde una manera entera de nombrar y entender el territorio.', 'No se pierde nada: siempre queda otra lengua.', 'Se pierden solo unos diccionarios.'], c: 0 },
      ] },

    { id: 'LS9-02', titulo: 'El precio del sombrero', genero: 'expositivo',
      texto: 'Una tejedora de Santa Bárbara tarda cinco días en terminar un sombrero fino de junco. El intermediario que llega a la aldea se lo compra en ciento veinte lempiras. Ese mismo sombrero se vende en una tienda de Tegucigalpa en cuatrocientos, y en el aeropuerto puede llegar a mil. La diferencia no es solo abuso: el intermediario asume el transporte, la venta lenta y el riesgo de quedarse con la mercadería. El problema es que la tejedora no tiene manera de saber en cuánto se revende su trabajo ni de negociar con esa información en la mano. Varias cooperativas nacieron para saltar ese eslabón. Algunas funcionaron; otras quebraron porque vender es un oficio distinto de tejer y nadie les enseñó a cotizar, a empacar ni a cobrar. La lección quedó clara para quien la quiera oír: no basta con quitar al intermediario. Hay que aprender a hacer lo que él hacía. Una cooperativa que hoy funciona empezó por lo más aburrido: llevar un cuaderno de costos y aprender a decir que no cuando el precio no daba.',
      susts: ['tejedora', 'días', 'sombrero', 'junco', 'intermediario', 'aldea', 'lempiras', 'tienda', 'aeropuerto', 'diferencia', 'abuso', 'transporte', 'venta', 'riesgo', 'mercadería', 'problema', 'manera', 'trabajo', 'información', 'mano', 'cooperativas', 'eslabón', 'oficio', 'lección', 'cooperativa', 'cuaderno', 'costos', 'precio'],
      propios: ['Santa', 'Bárbara', 'Tegucigalpa'],
      neutros: ['fino', 'Algunas', 'clara'],
      preguntas: [
        { tipo: 'literal', q: '¿En cuánto compra el intermediario el sombrero en la aldea?', r: 'En ciento veinte lempiras.',
          o: ['En mil lempiras.', 'En cuatrocientos lempiras.', 'En ciento veinte lempiras.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que la diferencia de precio «no es solo abuso»?', r: 'Porque el intermediario asume costos y riesgos reales que alguien tiene que cubrir.',
          o: ['Porque el intermediario asume costos y riesgos reales.', 'Porque los precios los pone el gobierno.', 'Porque el sombrero mejora en el camino.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué quebraron varias cooperativas?', r: 'Porque vender exige un oficio distinto de tejer y nadie se los enseñó.',
          o: ['Porque las tejedoras dejaron de trabajar.', 'Porque vender exige un oficio distinto de tejer y nadie se los enseñó.', 'Porque el junco se acabó.'], c: 1 },
        { tipo: 'critica', q: '¿Cuál es el problema de fondo: el precio o la falta de información? Defiende tu postura.', r: 'Respuesta abierta: se valora que argumente cuál de los dos condiciona al otro.',
          o: ['El precio: si pagaran más, no habría problema.', 'Ninguno de los dos: es cosa de suerte.', 'La información: sin saber cuánto vale su trabajo, no puede negociar ningún precio.'], c: 2 },
        { tipo: 'critica', q: '¿Qué haría falta para que la tejedora gane más sin quebrar el negocio? Propón algo.', r: 'Respuesta abierta: se valora que proponga algo concreto —formación en ventas, precios públicos, venta directa— y no solo una queja.',
          o: ['Prohibir a los intermediarios por ley.', 'Enseñarle a cotizar y a vender, y hacer públicos los precios de destino.', 'Que teja más rápido para vender más.'], c: 1 },
      ] },

    { id: 'LS9-03', titulo: 'La microcuenca', genero: 'expositivo',
      texto: 'En departamentos como Yoro o Francisco Morazán, la quebrada que abastece a un pueblo no empieza en el tanque: empieza arriba, en una ladera de bosque que casi nadie visita. A esa zona se le llama microcuenca, y su estado decide la cantidad y la limpieza del agua que llega a la llave. El bosque funciona como una esponja. La hojarasca y la raíz frenan el aguacero, lo hacen entrar despacio al suelo y lo devuelven poco a poco durante el verano. Sin esa esponja el agua corre por la superficie, arrastra tierra y llega de golpe: crecida en invierno y quebrada seca en marzo. Por eso varios municipios compraron los terrenos de la parte alta o pagan a los dueños para que no siembren ni corten. La medida choca con una realidad incómoda: esas familias vivían de ese terreno. Un acuerdo que protege el agua de miles y arruina a diez no se sostiene mucho tiempo. En Tegucigalpa el problema se ve en grande: la ciudad depende de laderas que otros habitan y trabajan.',
      susts: ['quebrada', 'pueblo', 'tanque', 'ladera', 'bosque', 'zona', 'microcuenca', 'estado', 'cantidad', 'limpieza', 'agua', 'llave', 'esponja', 'hojarasca', 'raíz', 'aguacero', 'suelo', 'verano', 'superficie', 'tierra', 'golpe', 'crecida', 'invierno', 'marzo', 'municipios', 'terrenos', 'parte', 'dueños', 'medida', 'realidad', 'familias', 'terreno', 'acuerdo', 'miles', 'tiempo', 'departamentos', 'problema', 'ciudad', 'laderas'],
      propios: ['Yoro', 'Francisco', 'Morazán', 'Tegucigalpa'],
      neutros: ['alta', 'incómoda', 'seca'],
      preguntas: [
        { tipo: 'literal', q: '¿Cómo funciona el bosque de la parte alta?', r: 'Como una esponja: frena el aguacero y devuelve el agua poco a poco.',
          o: ['Como una esponja: frena el aguacero y devuelve el agua poco a poco.', 'Como un techo que impide que llueva.', 'Como un filtro que limpia el tanque.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué sin bosque hay crecida en invierno y quebrada seca en marzo?', r: 'Porque el agua corre por la superficie en vez de guardarse en el suelo.',
          o: ['Porque llueve menos que antes.', 'Porque el tanque se llena de tierra.', 'Porque el agua corre por la superficie en vez de guardarse en el suelo.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué se dice que la medida «choca con una realidad incómoda»?', r: 'Porque proteger la microcuenca deja sin sustento a las familias que vivían de ese terreno.',
          o: ['Porque los municipios no tienen dinero.', 'Porque los dueños no quieren vender.', 'Porque proteger la microcuenca deja sin sustento a las familias de arriba.'], c: 2 },
        { tipo: 'critica', q: '¿Es justo pagarle a alguien para que no use su propia tierra? Argumenta.', r: 'Respuesta abierta: se valora que discuta el bien común frente al derecho de propiedad, con una razón.',
          o: ['Sí: está prestando un servicio del que vive todo el pueblo.', 'No: cada quien hace lo que quiera con lo suyo.', 'Solo si el terreno es pequeño.'], c: 0 },
        { tipo: 'critica', q: '¿Qué tendría que incluir un acuerdo para que se sostenga en el tiempo? Propón algo.', r: 'Respuesta abierta: se valora que proponga condiciones concretas —pago sostenido, alternativa productiva, vigilancia compartida—.',
          o: ['Solo una multa fuerte para el que corte.', 'Un pago sostenido y una alternativa real de ingreso para esas familias.', 'Nada: basta con prohibirlo.'], c: 1 },
      ] },

    { id: 'LS9-04', titulo: 'La lengua que no se ha ido', genero: 'expositivo',
      texto: 'En la Mosquitia, en el oriente de Gracias a Dios, el miskito se habla en la casa, en el mercado y en la cancha. En cambio el tol de los tolupanes y el pech quedan en boca de unos pocos ancianos, y el chortí se sostiene apenas en unas aldeas de Copán. La diferencia no es de suerte: una lengua se mantiene mientras sirva para algo todos los días. Si la escuela, el trabajo y el trámite ocurren solo en español, el niño aprende que su lengua es cosa de la abuela, y eso basta para que la abandone en una generación. Por eso la educación intercultural bilingüe no es un gesto de cortesía hacia una minoría. Es la única política que le devuelve a esa lengua un uso diario y un prestigio. Un idioma no muere porque le falten hablantes: muere cuando deja de servir en los lugares donde se decide algo. Los hablantes se van después. Por eso el dato que hay que mirar no es cuántos la hablan hoy, sino en cuántos lugares sigue sirviendo para algo.',
      susts: ['casa', 'mercado', 'cancha', 'cambio', 'boca', 'ancianos', 'aldeas', 'diferencia', 'suerte', 'lengua', 'días', 'escuela', 'trabajo', 'trámite', 'español', 'niño', 'cosa', 'abuela', 'generación', 'educación', 'gesto', 'cortesía', 'minoría', 'política', 'uso', 'prestigio', 'idioma', 'hablantes', 'lugares', 'oriente', 'dato'],
      propios: ['Mosquitia', 'Gracias', 'Dios', 'Copán'],
      neutros: ['miskito', 'tol', 'tolupanes', 'pech', 'chortí', 'bilingüe', 'intercultural', 'diario', 'única'],
      preguntas: [
        { tipo: 'literal', q: '¿Dónde se sostiene apenas el chortí?', r: 'En unas aldeas de Copán.',
          o: ['En toda la Mosquitia.', 'En unas aldeas de Copán.', 'Solo en las escuelas bilingües.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el miskito se mantiene y el pech no?', r: 'Porque el miskito sigue sirviendo en la vida diaria y el pech dejó de usarse.',
          o: ['Porque hay más territorio en la Mosquitia.', 'Porque el pech es más difícil de aprender.', 'Porque el miskito sigue sirviendo en la vida diaria.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «los hablantes se van después»?', r: 'Que primero la lengua pierde utilidad y solo entonces la gente deja de hablarla.',
          o: ['Que los hablantes emigran a otro país.', 'Que primero la lengua pierde utilidad y solo entonces se deja de hablar.', 'Que los ancianos mueren y ya.'], c: 1 },
        { tipo: 'critica', q: '¿Es la educación bilingüe un gasto o una inversión? Defiende tu postura.', r: 'Respuesta abierta: se valora que argumente sobre el costo real y sobre lo que se pierde sin ella.',
          o: ['Un gasto: mejor enseñar solo en español.', 'Una inversión: sostiene un saber que no se puede reponer después.', 'Ninguna de las dos: da lo mismo.'], c: 1 },
        { tipo: 'critica', q: '¿De quién es la responsabilidad de que una lengua siga viva? Argumenta.', r: 'Respuesta abierta: se valora que reparta la responsabilidad entre la familia, la escuela y el Estado, con una razón.',
          o: ['Solo de las familias que la hablan.', 'De la familia, la escuela y el Estado a la vez: sin los tres no se sostiene.', 'De nadie: las lenguas mueren solas.'], c: 1 },
      ] },

    { id: 'LS9-05', titulo: 'El museo que hizo el pueblo', genero: 'narrativo',
      texto: 'Cuando cerró la mina de El Corpus, el pueblo quedó con dos calles vacías y una memoria que nadie recogía. Un profesor jubilado empezó a juntar cosas en el corredor de su casa: una lámpara de carburo, un carrito de riel, contratos amarillos, la fotografía de una cuadrilla de hombres jóvenes que ya nadie sabía nombrar. Al principio la gente se reía del montón de fierros. Después empezaron a llevarle objetos y, sobre todo, empezaron a contarle historias. Ese fue el giro: el museo dejó de ser una bodega de chatarra y se volvió un lugar donde alguien anota lo que un anciano recuerda. Hoy ocupa una casa prestada, tiene fichas escritas a mano y recibe visitas de escuelas de todo el departamento. No tiene presupuesto ni vitrinas de vidrio. Tiene algo más difícil de conseguir: los nombres de los que trabajaron abajo, escritos por sus propios nietos. Don Anselmo, minero durante treinta años, dictó de memoria una lista de veintidós compañeros. La escuela Dionisio de Herrera lleva a sus alumnos cada noviembre, y algunos reconocen ahí el apellido de su bisabuelo.',
      susts: ['mina', 'pueblo', 'calles', 'memoria', 'profesor', 'cosas', 'corredor', 'casa', 'lámpara', 'carburo', 'carrito', 'riel', 'contratos', 'fotografía', 'cuadrilla', 'hombres', 'principio', 'gente', 'montón', 'fierros', 'objetos', 'historias', 'giro', 'museo', 'bodega', 'chatarra', 'lugar', 'anciano', 'fichas', 'mano', 'visitas', 'escuelas', 'departamento', 'presupuesto', 'vitrinas', 'vidrio', 'nombres', 'nietos', 'minero', 'años', 'lista', 'compañeros', 'escuela', 'alumnos', 'noviembre', 'apellido', 'bisabuelo'],
      propios: ['Corpus', 'Anselmo', 'Dionisio', 'Herrera'],
      neutros: ['jubilado', 'amarillos', 'prestada', 'don', 'algunos'],
      preguntas: [
        { tipo: 'literal', q: '¿Qué empezó a juntar el profesor jubilado?', r: 'Objetos de la mina: una lámpara de carburo, un carrito de riel, contratos y fotografías.',
          o: ['Objetos de la mina: lámpara, carrito de riel, contratos y fotografías.', 'Libros de historia del departamento.', 'Dinero para reabrir la mina.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cuál fue «el giro» que cambió al museo?', r: 'Que la gente empezó a contar historias, no solo a llevar objetos.',
          o: ['Que la gente empezó a contar historias, no solo a llevar objetos.', 'Que consiguió una casa prestada.', 'Que llegaron visitas de las escuelas.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que tener los nombres es «más difícil de conseguir» que las vitrinas?', r: 'Porque una vitrina se compra y esa memoria solo la puede dar la gente que la vivió.',
          o: ['Porque una vitrina se compra y esa memoria solo la da la gente que la vivió.', 'Porque los nombres estaban perdidos en la alcaldía.', 'Porque los nietos cobran por escribirlos.'], c: 0 },
        { tipo: 'critica', q: '¿Vale un museo sin presupuesto ni vitrinas? Defiende tu postura.', r: 'Respuesta abierta: se valora que discuta qué hace valioso a un museo: los objetos o el sentido que la comunidad les da.',
          o: ['No: sin recursos no es un museo de verdad.', 'Solo si lo reconoce el gobierno.', 'Sí: lo que lo hace museo es la memoria que guarda, no el mobiliario.'], c: 2 },
        { tipo: 'critica', q: '¿Quién debería hacerse cargo de una memoria así cuando el profesor ya no esté? Propón algo.', r: 'Respuesta abierta: se valora que proponga un relevo concreto —la escuela, la alcaldía, un patronato— y no solo lamentarlo.',
          o: ['Nadie: cuando él falte, se acaba.', 'Un museo de la capital que se lleve todo.', 'La escuela y la alcaldía juntas, formando desde ya a quien lo continúe.'], c: 2 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN

   El motor (js/tools/lectura-mision.js) no sabe de sustantivos:
   ofrece formas de actividad y aquí se dice cuáles usa esta misión y
   con qué datos. Las cuatro, en orden:

   1. las cinco preguntas del texto;
   2. cazar los sustantivos tocándolos sobre lo que acaba de leer;
   3. clasificar los que cazó: común o propio (encontrar no es saber
      de qué clase es);
   4. volver de memoria al texto a buscar el sustantivo exacto.
══════════════════════════════════════════════════════════════ */
const LECTURA_SUSTANTIVOS_TALLER = [

  { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

  { id: 'caza', icono: '🎯', titulo: 'Caza de sustantivos', forma: 'cazar', meta: 10,
    instruccion: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' sustantivos</strong>. Encuentra ' +
        '<strong>al menos ' + info.meta + '</strong> y tócalos: valen los <strong>comunes</strong> ' +
        '(mercado, río, maestra) y los <strong>propios</strong> (Marta, Copán, Honduras). ' +
        'Los artículos (el, la, un, una) no cuentan.';
    },
    /* En el papel no se toca: se subraya, y sobre el texto de la hoja. */
    enPapel: function (t, u, info) {
      return 'En esta lectura hay <strong>' + info.total + ' sustantivos</strong>. <strong>Subraya al menos ' +
        info.meta + '</strong> en el texto de arriba: valen los <strong>comunes</strong> (mercado, río, maestra) ' +
        'y los <strong>propios</strong> (Marta, Copán, Honduras). Los artículos (el, la, un, una) no cuentan.';
    },
    objetivos: function (t, u) {
      var com = {}, pro = {};
      (t.susts || []).forEach(function (p) { com[u.clave(p)] = 1; });
      (t.propios || []).forEach(function (p) { pro[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        var k = u.clave(p);
        if (com[k]) out.push({ ini: i, fin: i, clase: 'a' });
        else if (pro[k]) out.push({ ini: i, fin: i, clase: 'b' });
      });
      return out;
    },
    /* La zona gris de esta lectura más los artículos: tocarlas no suma
       ni resta, y la pantalla explica por qué en vez de decir «no». */
    neutros: function (t, u) {
      var neu = {};
      (t.neutros || []).forEach(function (p) { neu[u.clave(p)] = 1; });
      if (typeof LECTURA_CLASES !== 'undefined') LECTURA_CLASES.neutros.forEach(function (p) { neu[u.clave(p)] = 1; });
      var out = [];
      u.ps.forEach(function (p, i) {
        if (neu[u.clave(p)]) {
          out.push({ ini: i, fin: i, motivo: '«' + u.esc(p.replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '')) +
            '» aquí no está haciendo de sustantivo (es artículo, tratamiento o una palabra discutida). ' +
            'En esta cacería no cuenta: ni bien ni mal.' });
        }
      });
      return out;
    },
    fallo: function (palabra, u) {
      return '❌ «' + u.esc(palabra) + '» no es sustantivo. Un sustantivo <strong>nombra</strong> algo: ' +
        'una persona, un animal, una cosa, un lugar o una idea. Prueba a ponerle <em>el</em> o <em>la</em> ' +
        'delante y fíjate si suena.';
    } },

  { id: 'clasifica', icono: '🗂️', titulo: '¿Común o propio?', forma: 'dosGrupos',
    pista: 'Míralos en su oración antes de decidir',
    grupos: [
      { clave: 'a', titulo: '📦 Común', pista: 'nombra una clase de cosas', nombre: 'sustantivo común' },
      { clave: 'b', titulo: '🏷️ Propio', pista: 'nombra a uno en particular', nombre: 'sustantivo propio' }
    ],
    items: function (t, u) {
      var com = u.baraja(t.susts || []), pro = u.baraja(t.propios || []);
      var nPro = Math.min(3, pro.length), nCom = Math.min(6 - nPro, com.length);
      var lista = com.slice(0, nCom).map(function (p) { return { palabra: p, grupo: 'a' }; })
        .concat(pro.slice(0, nPro).map(function (p) { return { palabra: p, grupo: 'b' }; }));
      return u.baraja(lista).map(function (it) {
        it.contexto = u.contextoDe(it.palabra);
        it.explica = '«' + u.esc(it.palabra) + '» ' + (it.grupo === 'a'
          ? 'nombra <strong>una clase de cosas</strong>, no a una en particular: hay muchas en el mundo.'
          : 'nombra a <strong>uno en particular</strong> y lo separa de los demás de su clase. Por eso lleva mayúscula.');
        return it;
      });
    } },

  { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?', forma: 'tresOpciones',
    pista: 'Las tres palabras salen de esta misma lectura',
    items: function (t, u) {
      var sus = {};
      (t.susts || []).forEach(function (p) { sus[u.clave(p)] = 1; });
      var candidatos = [];
      u.oraciones().forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (sus[u.clave(u.ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
        }
      });
      return u.baraja(candidatos).slice(0, 4).map(function (c) {
        var correcta = u.ps[c.pos].replace(/[.,;:()¿?¡!«»"“”'’…—–]/g, '');
        /* Los distractores salen de t.susts TAL CUAL están escritos y de
           la MISMA lectura, para que no se acierte por descarte de
           vocabulario: hay que acordarse de lo leído. */
        var otros = u.baraja((t.susts || []).filter(function (p) { return u.clave(p) !== u.clave(correcta); })).slice(0, 2);
        var ops = u.baraja([correcta].concat(otros));
        var frase = [];
        for (var i = c.ini; i <= c.fin; i++) {
          frase.push(i === c.pos ? u.HUECO + u.esc(u.ps[i].replace(/^[^.,;:!?»]*/, '')) : u.esc(u.ps[i]));
        }
        return {
          frase: frase.join(' '), ops: ops, c: ops.map(u.clave).indexOf(u.clave(correcta)),
          bien: 'Fíjate en cuánto cambia la oración según el sustantivo que se le ponga.',
          mal: 'La lectura decía <strong>«' + u.esc(correcta) + '»</strong>. Las otras dos también salen de este texto, ' +
            'pero nombraban otra cosa.'
        };
      });
    } },
];

/* La hoja de respuestas del final: el texto entero con sus sustantivos
   pintados encima de lo que el alumno acaba de leer. */
const LECTURA_SUSTANTIVOS_RESUMEN = {
  titulo: '📦 Todos los sustantivos de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'mercado', dice: 'común' },
    { clase: 'b', txt: 'Copán', dice: 'propio' }
  ],
  intro: function (t, u, cuenta) {
    return 'En un solo texto había <strong>' + cuenta.a + ' sustantivos comunes</strong> y <strong>' + cuenta.b +
      ' propios</strong>. Los comunes nombran una clase de cosas; los propios nombran a uno en particular, ' +
      'y por eso van con mayúscula.';
  },
  marcar: function (t, u) {
    var com = {}, pro = {};
    (t.susts || []).forEach(function (p) { com[u.clave(p)] = 1; });
    (t.propios || []).forEach(function (p) { pro[u.clave(p)] = 1; });
    var out = [];
    u.ps.forEach(function (p, i) {
      var k = u.clave(p);
      if (com[k]) out.push({ ini: i, fin: i, clase: 'a' });
      else if (pro[k]) out.push({ ini: i, fin: i, clase: 'b' });
    });
    return out;
  }
};
