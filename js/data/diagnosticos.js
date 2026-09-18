/* Diagnóstico de entrada por ruta de aprendizaje (Fase 3).
   Preguntas tomadas de los bancos de evaluación de las propias misiones
   (evalMCBank), una por etapa en rutas largas y dos en rutas cortas,
   ordenadas de la etapa más básica a la más avanzada.
   Regla de recomendación: la primera etapa con error es el punto de
   partida sugerido; sin errores → la última etapa de la ruta. */
const DIAGNOSTICOS = {
  numero: [
    { etapa: 0, q: '¿Cómo se lee el número 45,000?', o: ['Cuatro mil quinientos', 'Cuarenta y cinco mil', 'Cuatrocientos cincuenta mil', 'Cuarenta y cinco millones'], a: 1 },
    { etapa: 1, q: '¿Cuál es el valor del dígito 4 en 573,420?', o: ['4', '400', '4,000', '40,000'], a: 1 },
    { etapa: 2, q: '¿Cuál es el punto medio entre 200 y 300?', o: ['205', '250', '230', '295'], a: 1 },
    { etapa: 3, q: '¿Cuál es el m.c.m. de 4 y 10?', o: ['40', '2', '20', '14'], a: 2 },
    { etapa: 4, q: '¿Cuál de estos números es primo?', o: ['33', '39', '31', '35'], a: 2 },
    { etapa: 5, q: '¿Cuánto es 8²?', o: ['16', '64', '82', '32'], a: 1 },
    { etapa: 6, q: '¿Qué indica el numerador de una fracción?', o: ['En cuántas partes se divide el entero', 'Cuántas partes se toman del entero', 'El resultado de una suma', 'El nombre de la fracción'], a: 1 },
    { etapa: 7, q: '¿Cuánto es 2/3 × 4/5?', o: ['8/15', '6/8', '2/15', '8/8'], a: 0 },
    { etapa: 8, q: '¿Cuál fracción es equivalente a 0.75?', o: ['7/5', '1/4', '7/10', '3/4'], a: 3 },
    { etapa: 9, q: '¿Cuánto es 0.2 × 0.3?', o: ['0.6', '0.06', '6', '0.5'], a: 1 },
    { etapa: 10, q: '¿A qué división entera equivale 1.5 ÷ 0.3?', o: ['150 ÷ 3', '15 ÷ 30', '15 ÷ 3'], a: 2 },
    { etapa: 11, q: '¿Cuánto es 23 × 4?', o: ['82', '92', '812', '96'], a: 1 },
    { etapa: 12, q: 'En la numeración maya, ¿cuánto vale una barra?', o: ['1', '5', '10', '20'], a: 1 },
  ],
  forma: [
    { etapa: 1, q: '¿Cuánto mide un ángulo recto?', o: ['45°', '90°', '180°', '360°'], a: 1 },
    { etapa: 1, q: '¿Qué hace la bisectriz de un ángulo?', o: ['Lo elimina', 'Lo duplica', 'Lo divide en dos partes iguales', 'Lo convierte en recto'], a: 2 },
    { etapa: 2, q: '¿Cuál es la fórmula para calcular el área de un círculo?', o: ['A = π · d', 'A = π · r²', 'A = (P · a) / 2', 'A = 2 · π · r'], a: 1 },
    { etapa: 3, q: '¿Cómo se llama un ángulo que mide 130°?', o: ['Agudo', 'Recto', 'Obtuso', 'Llano'], a: 2 },
    { etapa: 4, q: '¿Cuál es el área de un rectángulo de 6 × 4?', o: ['20 cm²', '24 cm²', '10 cm²', '48 cm²'], a: 1 },
    { etapa: 5, q: '¿Cuál es la fórmula del área de un polígono regular?', o: ['lado × lado', 'base × altura', '(P × apotema) ÷ 2', '4 × lado'], a: 2 },
    { etapa: 6, q: '¿Cuántas aristas tiene un cubo?', o: ['6', '8', '12', '4'], a: 2 },
    { etapa: 7, q: '¿Cuál es el volumen de un cubo de 3 cm de arista?', o: ['9 cm³', '27 cm³', '12 cm³', '6 cm³'], a: 1 },
  ],
  palabra: [
    { etapa: 1, q: '¿Qué es un sustantivo?', o: ['Palabra que indica acción', 'Palabra que nombra seres y cosas', 'Palabra que describe cualidades', 'Palabra que une oraciones'], a: 1 },
    { etapa: 2, q: '¿Cuál de las siguientes palabras es un adjetivo calificativo?', o: ['Perro', 'Grande', 'Correr', 'Nosotros'], a: 1 },
    { etapa: 3, q: '¿Cuál de las siguientes palabras es un verbo?', o: ['Feliz', 'Saltar', 'Casa', 'Rápido'], a: 1 },
    { etapa: 4, q: '«Llegó TARDE a la reunión». La palabra en mayúsculas es adverbio de:', o: ['Lugar', 'Modo', 'Tiempo', 'Cantidad'], a: 2 },
    { etapa: 5, q: '«No quiero este, dame AQUEL». La palabra en mayúsculas es un pronombre:', o: ['Personal', 'Demostrativo', 'Indefinido', 'Numeral'], a: 1 },
    { etapa: 6, q: 'Las palabras agudas llevan tilde cuando:', o: ['Terminan en consonante', 'Terminan en n, s o vocal', 'Nunca', 'Siempre'], a: 1 },
    { etapa: 7, q: '«Sin embargo» es un marcador de...', o: ['Adición', 'Causa', 'Contraste', 'Orden'], a: 2 },
    { etapa: 8, q: '¿Cuál es el propósito del texto argumentativo?', o: ['Informar', 'Convencer', 'Describir', 'Contar'], a: 1 },
    { etapa: 9, q: 'Un adjetivo restrictivo se caracteriza por:', o: ['Limitar la referencia del sustantivo al que modifica', 'Ir siempre antepuesto', 'Ser invariable en género', 'Funcionar siempre como atributo'], a: 0 },
  ],
  planeta: [
    { etapa: 1, q: '¿Qué línea imaginaria divide la Tierra en Hemisferio Norte y Hemisferio Sur?', o: ['Meridiano de Greenwich', 'Trópico de Cáncer', 'El Ecuador', 'Círculo Polar Ártico'], a: 2 },
    { etapa: 2, q: '¿Cuál es el continente más pequeño del mundo?', o: ['Europa', 'Antártida', 'Oceanía', 'América Central'], a: 2 },
    { etapa: 3, q: '¿Cuál es el continente más grande y más poblado del mundo?', o: ['África', 'Europa', 'América', 'Asia'], a: 3 },
    { etapa: 4, q: '¿Cuándo un fenómeno natural se convierte en desastre?', o: ['Siempre que ocurre', 'Cuando afecta a una comunidad vulnerable y causa daños', 'Solo si ocurre de noche', 'Cuando lo predice la ciencia'], a: 1 },
    { etapa: 5, q: '¿En qué era geológica vivieron los dinosaurios?', o: ['Precámbrica', 'Paleozoica', 'Mesozoica', 'Cenozoica'], a: 2 },
    { etapa: 6, q: '¿Qué siglas identifican al sistema de áreas protegidas de Honduras?', o: ['SERNA', 'SINAPH', 'COHDEFOR', 'ICF'], a: 1 },
  ],
  cuerpo: [
    { etapa: 1, q: '¿Qué parte del encéfalo controla el equilibrio y la coordinación de movimientos?', o: ['Cerebro', 'Cerebelo', 'Tronco encefálico', 'Médula espinal'], a: 1 },
    { etapa: 1, q: '¿Cómo se llama la vaina que recubre el axón y acelera el impulso nervioso?', o: ['Dendrita', 'Sinapsis', 'Mielina', 'Soma'], a: 2 },
    { etapa: 2, q: '¿Qué mensajero químico usa el sistema endocrino para comunicarse?', o: ['El impulso eléctrico', 'La hormona', 'El neurotransmisor', 'La enzima'], a: 1 },
    { etapa: 2, q: '¿Cuál es la «glándula maestra» que dirige a las demás glándulas?', o: ['La tiroides', 'El páncreas', 'La hipófisis', 'La glándula pineal'], a: 2 },
  ],
  codigo: [
    { etapa: 1, q: '¿Cuál de estas instrucciones es EXACTA?', o: ['Camina por ahí', 'Da 3 pasos hacia adelante', 'Muévete un poco', 'Ve rápido'], a: 1 },
    { etapa: 2, q: 'Un robot mira hacia arriba (Norte) y ejecuta: AVANZA, GIRA DERECHA, AVANZA. ¿Hacia dónde mira al final?', o: ['Norte', 'Sur', 'Este', 'Oeste'], a: 2 },
    { etapa: 3, q: 'SI hay pared adelante ENTONCES gira derecha, SINO avanza. El robot NO tiene pared adelante. ¿Qué hace?', o: ['Gira derecha', 'Avanza', 'Se detiene', 'Gira izquierda'], a: 1 },
    { etapa: 4, q: 'Para dibujar un cuadrado, el robot ejecuta REPETIR ___ VECES [AVANZA, GIRA DERECHA]. ¿Qué número falta?', o: ['2', '3', '4', '8'], a: 2 },
    { etapa: 5, q: 'Una variable en programación es como…', o: ['Un dibujo del robot', 'Una cajita con nombre que guarda un valor que puede cambiar', 'Un error del programa', 'Un botón de apagado'], a: 1 },
    { etapa: 6, q: '¿Qué es un «bug» en programación?', o: ['Un insecto que daña la computadora', 'Un error en el programa', 'Un tipo de robot', 'Un premio por programar bien'], a: 1 },
    { etapa: 7, q: 'Antes de escribir un programa completo conviene…', o: ['Probar botones al azar', 'Planificarlo en pseudocódigo y dividirlo en partes', 'Copiar el programa de otro', 'Hacerlo todo en una sola instrucción'], a: 1 },
  ],
  robots: [
    { etapa: 1, q: '¿Qué parte del robot funciona como sus «sentidos»?', o: ['Los actuadores', 'Los sensores', 'La batería', 'Las ruedas'], a: 1 },
    { etapa: 1, q: '¿Cuál de estas máquinas es un robot?', o: ['Un martillo', 'Una bicicleta', 'Una aspiradora que detecta obstáculos y decide su ruta sola', 'Un ventilador encendido'], a: 2 },
    { etapa: 2, q: '¿Qué sensor necesita un robot para no chocar con una pared?', o: ['Un sensor de luz', 'Un sensor de distancia', 'Un sensor de temperatura', 'Un sensor de sonido'], a: 1 },
    { etapa: 2, q: 'En el cuerpo humano, el ojo cumple el mismo papel que…', o: ['Un actuador', 'Un motor', 'Un sensor de luz', 'La batería'], a: 2 },
    { etapa: 3, q: 'Si dos engranajes están en contacto y el primero gira a la derecha, el segundo gira…', o: ['También a la derecha', 'A la izquierda', 'No gira', 'Al doble de velocidad y a la derecha'], a: 1 },
    { etapa: 3, q: 'Un engranaje pequeño mueve a uno grande. El grande gira…', o: ['Más rápido y con menos fuerza', 'Más lento y con más fuerza', 'Igual de rápido', 'Al revés y más rápido'], a: 1 },
    { etapa: 4, q: 'Para que un foquito encienda, el circuito debe estar…', o: ['Abierto', 'Cerrado', 'Cortado', 'Sin pila'], a: 1 },
    { etapa: 4, q: '¿Cuál de estos materiales es un aislante?', o: ['El cobre', 'El aluminio', 'El plástico', 'El agua con sal'], a: 2 },
    { etapa: 5, q: 'El ciclo de trabajo de un robot es…', o: ['Mover, apagar y guardar', 'Leer sensores, decidir y mover actuadores, y repetir', 'Solo esperar órdenes por control remoto', 'Cargar la batería y detenerse'], a: 1 },
    { etapa: 5, q: 'Si el sensor detecta una pared adelante, ¿qué instrucción conviene?', o: ['Avanzar más rápido', 'Girar y buscar otro camino', 'Apagar el sensor', 'Repetir avanzar para siempre'], a: 1 },
    { etapa: 6, q: 'En el ciclo de diseño, ¿qué se hace justo después de probar el prototipo?', o: ['Se olvida el proyecto', 'Se mejora con lo aprendido en la prueba', 'Se empieza otro problema distinto', 'Se vende el robot'], a: 1 },
    { etapa: 6, q: 'Antes de diseñar un robot, lo primero es…', o: ['Comprar los materiales', 'Identificar bien el problema y a quién afecta', 'Escribir el programa', 'Pintarlo bonito'], a: 1 },
  ],
  /* Ruta de la Patria (Educación Cívica): las preguntas salen del evalMCBank
     de la misión, de lo más básico a lo que cuesta más. */
  patria: [
    { etapa: 1, q: '¿Cuáles son los tres símbolos patrios mayores de Honduras?', o: ['El pino, la orquídea y la guara roja', 'La Bandera, el Escudo y el Himno Nacional', 'El mapa, la moneda y la lengua', 'El venado, el volcán y el arco iris'], a: 1 },
    { etapa: 1, q: '¿Cuántas estrellas tiene la Bandera Nacional y qué representan?', o: ['Tres, los poderes del Estado', 'Siete, las estrofas del Himno', 'Cinco, las naciones de la antigua Federación de Centroamérica', 'Cinco, los mares que rodean al país'], a: 2 },
    { etapa: 1, q: '¿Quién escribió la letra del Himno Nacional de Honduras?', o: ['Carlos Hartling', 'Ramón Rosa', 'José Trinidad Reyes', 'Augusto C. Coello'], a: 3 },
    { etapa: 1, q: '¿Quién es el Héroe Nacional que resistió la conquista española?', o: ['Lempira', 'Francisco Morazán', 'José Cecilio del Valle', 'José Trinidad Cabañas'], a: 0 },
    { etapa: 2, q: '¿De cuántas partes consta el Himno Nacional de Honduras?', o: ['Un coro y siete estrofas', 'Solo siete estrofas', 'Un coro y tres estrofas', 'Un coro y diez estrofas'], a: 0 },
    { etapa: 2, q: 'En los actos cívicos de la escuela, ¿qué parte del Himno se canta junto con el coro?', o: ['La primera estrofa', 'La cuarta estrofa', 'La séptima estrofa', 'Todas las estrofas'], a: 2 },
    { etapa: 2, q: '¿Qué hace el coro del Himno Nacional?', o: ['Cuenta la llegada de Cristóbal Colón', 'Describe la Bandera y el Escudo', 'Cuenta la muerte de Lempira', 'Promete defender la patria'], a: 1 },
    { etapa: 2, q: 'En la tercera estrofa, ¿quién cae «envuelto en su sangre»?', o: ['Francisco Morazán', 'Cristóbal Colón', 'José Cecilio del Valle', 'Lempira'], a: 3 },
    { etapa: 3, q: '¿Cuál es la diferencia entre un héroe y un prócer?', o: ['El héroe defiende a su pueblo; el prócer ayuda a fundar la nación', 'El héroe es militar y el prócer es civil', 'No hay ninguna diferencia', 'El prócer es más antiguo'], a: 0 },
    { etapa: 3, q: '¿Quién redactó el Acta de Independencia de Centroamérica?', o: ['Francisco Morazán', 'Lempira', 'José Cecilio del Valle', 'Marco Aurelio Soto'], a: 2 },
    { etapa: 3, q: '¿Quién fue el primer Jefe de Estado de Honduras, en 1824?', o: ['José Trinidad Cabañas', 'Ramón Rosa', 'José Trinidad Reyes', 'Dionisio de Herrera'], a: 3 },
    { etapa: 3, q: '¿Por qué el Día del Maestro Hondureño es el 17 de septiembre?', o: ['Por la Independencia de Centroamérica', 'Por el natalicio de José Trinidad Reyes, que fundó la primera universidad', 'Por el Código de Instrucción Pública', 'Por el natalicio de Francisco Morazán'], a: 1 },
    { etapa: 4, q: '¿Cuáles son los tres poderes del Estado?', o: ['Civil, militar y religioso', 'Ejecutivo, Legislativo y Judicial', 'Nacional, departamental y municipal', 'Presidente, alcalde y juez'], a: 1 },
    { etapa: 4, q: '¿Qué poder del Estado HACE las leyes?', o: ['El Judicial', 'El Ejecutivo', 'El Legislativo, por medio del Congreso Nacional', 'Los tres a la vez'], a: 2 },
    { etapa: 4, q: '¿Por qué se dice que la Constitución es la ley fundamental?', o: ['Porque es la más larga', 'Porque está por encima de todas las demás', 'Porque es la más antigua', 'Porque la firma el Presidente'], a: 1 },
    { etapa: 4, q: 'Dos personas tienen un pleito por lo que dice una ley. ¿A quién le toca resolverlo?', o: ['Al Congreso Nacional', 'Al Presidente de la República', 'A los juzgados y tribunales', 'A la Secretaría de Estado'], a: 2 },
    { etapa: 5, q: 'En «artículo 128 numeral 7 de la Constitución», ¿qué es el numeral 7?', o: ['El año en que se escribió', 'Uno de los puntos numerados dentro del artículo 128', 'La página donde está', 'El número de reformas'], a: 1 },
    { etapa: 5, q: '¿Por qué no basta con citar «el artículo 128» sin decir de qué norma es?', o: ['Por cortesía', 'Porque hay un artículo con ese número en casi todas las leyes', 'Porque cambia cada año', 'Porque lo exige el formato'], a: 1 },
    { etapa: 5, q: 'El Estatuto del Docente existe por «un mandato» de la Constitución. ¿Qué significa?', o: ['Que la Constitución ordenó que esa ley se escribiera', 'Que la Constitución la prohíbe', 'Que la escribió un juez', 'Que se puede cambiar cuando se quiera'], a: 0 },
    { etapa: 5, q: 'Que un artículo esté escrito en la Constitución, ¿garantiza que se cumpla?', o: ['Sí, siempre', 'Solo en las ciudades', 'No: por eso hay que analizar casos en que no se cumple', 'Solo si lo repite otra ley'], a: 2 },
  ],
  /* Ruta de la Máquina que Aprende (Inteligencia Artificial). Las preguntas
     salen del evalMCBank de cada etapa, de lo más básico a lo que cuesta más.
     La etapa 1 es de I Ciclo y la 4 de III, así que aquí la escalera de
     dificultad es también una escalera de edad: el que falla en la primera no
     necesita la cuarta, necesita empezar por el principio. */
  maquina: [
    { etapa: 1, q: '¿Qué es la Inteligencia Artificial?', o: ['Programas que hacen cosas que antes solo hacían las personas', 'Un robot que vive en el teléfono', 'Una persona dentro de la computadora', 'Un juego de video'], a: 0 },
    { etapa: 1, q: '¿Cómo aprende una máquina a reconocer una cara?', o: ['Nació sabiendo', 'Alguien se la dibujó una vez', 'Viendo muchísimas fotos de caras', 'Porque tiene ojos'], a: 2 },
    { etapa: 1, q: '¿La máquina siente alegría o tristeza?', o: ['No: es un aparato y no siente nada', 'Sí, cuando gana', 'Solo sin batería', 'Sí, como un perro'], a: 0 },
    { etapa: 2, q: '¿Qué diferencia a un programa que APRENDE de uno de siempre?', o: ['Que es más caro', 'Que saca la regla de los ejemplos en vez de seguir una escrita', 'Que no necesita computadora', 'Que nunca se equivoca'], a: 1 },
    { etapa: 2, q: 'Una máquina entrenada solo con maíz, frijol y café ve una hoja de plátano. ¿Cómo se llama ese fallo?', o: ['Patrón', 'Sesgo', 'Etiqueta', 'Refuerzo'], a: 1 },
    { etapa: 2, q: '¿Para qué sirve PROBAR con ejemplos nuevos?', o: ['Para saber si aprendió el patrón o solo se lo memorizó', 'Para gastar menos batería', 'Para que se entretenga', 'Para hacerla más rápida'], a: 0 },
    { etapa: 2, q: '¿De quién es la responsabilidad de un sesgo?', o: ['De la máquina', 'De nadie', 'De quien eligió los ejemplos', 'Del que la usa'], a: 2 },
    { etapa: 3, q: '¿Dónde y cuándo nació el nombre «Inteligencia Artificial»?', o: ['En el taller de Dartmouth, en 1956', 'En Londres, en 1950', 'En Nueva York, en 1997', 'En internet, en 2022'], a: 0 },
    { etapa: 3, q: '¿Por qué hubo dos inviernos de la IA?', o: ['Se prohibió investigar', 'Se prometió más de lo que se podía y se cortó el dinero', 'Se perdieron los programas', 'Se acabó la electricidad'], a: 1 },
    { etapa: 3, q: '¿Cuáles son las tres patas que tuvieron que juntarse?', o: ['Robots, sensores y motores', 'Dinero, publicidad y suerte', 'Datos, cómputo y algoritmos', 'Internet, teléfonos y satélites'], a: 2 },
    { etapa: 4, q: '¿Qué hace un modelo de lenguaje cuando te contesta?', o: ['Consulta una enciclopedia', 'Le pregunta a una persona', 'Copia una página', 'Predice la palabra siguiente más probable'], a: 3 },
    { etapa: 4, q: '¿Qué es una alucinación?', o: ['Un virus', 'Un dato inventado dicho con toda seguridad', 'Un error de la pantalla', 'Una falla de la conexión'], a: 1 },
    { etapa: 4, q: 'La IA te cita un libro perfecto para tu tema. ¿Qué hacés?', o: ['Compruebo que el libro exista', 'Lo cito, suena confiable', 'Le pregunto a la IA si existe', 'Le cambio el título'], a: 0 },
    { etapa: 4, q: 'Te llega un audio con la voz de un familiar pidiendo dinero urgente. ¿Qué hacés?', o: ['Lo llamo yo por otro medio antes de hacer nada', 'Le mando el dinero', 'Lo reenvío al grupo', 'Le contesto por audio'], a: 0 },
    { etapa: 5, q: '¿Cuáles son las tres señales que trae casi toda estafa?', o: ['Faltas de ortografía, mayúsculas y emojis', 'Urgencia, secreto y canal nuevo', 'Un número largo, una foto y un enlace', 'Que llegue de noche y por audio'], a: 1 },
    { etapa: 5, q: 'Un programa acierta el 95 %. ¿Qué NO te dice ese número?', o: ['Cuántas veces acertó', 'A quién le cae el error', 'Que se equivoca a veces', 'Cuántos casos revisó'], a: 1 },
    { etapa: 5, q: '¿De qué está hecha casi toda estafa creíble?', o: ['De tecnología muy cara', 'De información que la propia familia publicó', 'De suerte', 'De un día festivo'], a: 1 },
    { etapa: 6, q: 'Una promesa sin fecha…', o: ['Es más seria', 'No se puede incumplir nunca', 'Se cumple sola', 'Vale más que una con fecha'], a: 1 },
    { etapa: 6, q: 'Cinco páginas dicen lo mismo y ninguna dice de dónde. ¿Qué tenés?', o: ['Cinco fuentes', 'Un eco', 'Una prueba', 'Un estudio'], a: 1 },
    { etapa: 6, q: '¿Cuándo se reconoce un punto de inflexión?', o: ['El mismo día, por el ruido', 'Casi siempre mirando para atrás', 'Cuando lo dice un experto', 'Cuando sale en televisión'], a: 1 },
    { etapa: 7, q: '¿Qué se lleva la máquina de un oficio?', o: ['El oficio entero', 'Algunas tareas, no el oficio', 'Nada', 'Solo los oficios nuevos'], a: 1 },
    { etapa: 7, q: '¿Qué clase de tarea casi no toca?', o: ['Las de escribir', 'Las de sumar', 'Las de manos y las de estar con alguien', 'Las de mirar'], a: 2 },
    { etapa: 7, q: 'Una tarea de clase que la máquina NO puede entregar…', o: ['Es más larga', 'La pide el maestro enojado', 'Lleva un escudo: se hace delante de alguien, usa un dato de aquí o pide medir', 'No existe'], a: 2 },
  ],
  // Ruta de la Meta (Repaso General): una pregunta de cada materia de la prueba
  meta: [
    { etapa: 1, q: 'Una caja trae 7 lápices. ¿Cuántos lápices hay en 36 cajas?', o: ['43', '252', '245', '2,52'], a: 1 },
    { etapa: 1, q: '«Doña Rosa quedó satisfecha con su cosecha». ¿Qué significa ahí la palabra satisfecha?', o: ['Cansada', 'Enojada', 'Contenta', 'Apurada'], a: 2 },
    { etapa: 2, q: '¿Qué fracción impropia vale lo mismo que el número mixto 3 1/4?', o: ['4/3', '7/4', '13/4', '31/4'], a: 2 },
    { etapa: 2, q: '«La campesina siguió subiendo y no se dio por vencida». ¿Qué significa ahí no se dio por vencida?', o: ['Que no dejó de intentarlo', 'Que se cansó y bajó', 'Que perdió el camino', 'Que llegó de primera'], a: 0 },
    { etapa: 3, q: 'En el mercado, la libra de frijoles cuesta L.22.40. ¿Cuánto cuestan 3.5 libras?', o: ['L.25.90', 'L.67.20', 'L.78.40', 'L.784.00'], a: 2 },
    { etapa: 4, q: 'El galón de combustible estaba a L.105 y hoy está a L.95. ¿Qué número representa ese cambio?', o: ['+10', '−10', '−95', '+105'], a: 1 },
    { etapa: 4, q: 'Cuatro obreros levantan un muro en 50 días. ¿Cuántos obreros hacen falta para levantarlo en 10 días?', o: ['20', '8', '40', '200'], a: 0 },
    { etapa: 3, q: '¿Cómo se encuentra la idea principal de un texto?', o: ['Copiando la primera oración', 'Preguntándose de qué trata TODO el texto', 'Buscando la palabra más repetida', 'Leyendo solo el título'], a: 1 },
  ],
  /* Ruta de la Raíz (Filosofía). Tres preguntas por etapa, sacadas del
     evalMCBank de cada misión, y las tres de cada una miden lo que esa unidad
     enseña de verdad: en la 1, qué quiere decir la palabra y cómo se distingue
     una clase de pregunta de otra; en la 2, la prueba de una razón que
     sostiene, que la regla del «si… entonces» va en un solo sentido, y que
     bien armado NO quiere decir verdadero; en la 3, las tres clases de cambio
     —y sobre todo la frontera de la unidad: que un cambio de nombre no le pasa
     a la cosa— y qué es una cosmovisión.
     ⚠️ La posición de la correcta se reparte a propósito —es la normativa del
     reparto de respuestas—, así que el orden de las opciones no es el del
     banco de la misión aunque la respuesta buena sea la misma. */
  raiz: [
    { etapa: 1, q: '¿Qué quiere decir la palabra «filosofía»?', o: ['Ganas de saber', 'El que ya sabe', 'Escuela de pensar', 'Libro antiguo'], a: 0 },
    { etapa: 1, q: '¿Cuál es la señal de una pregunta de hechos?', o: ['Que es muy larga', 'Que nadie la ha contestado', 'Que tiene una sola respuesta y se puede comprobar', 'Que la hizo un filósofo'], a: 2 },
    { etapa: 1, q: '«¿Está bien callarse cuando molestan a otro?» es una pregunta…', o: ['de valor', 'de hechos', 'de significado', 'sin clase'], a: 0 },
    { etapa: 2, q: '¿Cuál es la prueba de una razón que sostiene?', o: ['Que la diga alguien importante', 'Que si fuera verdad, tendría que serlo la conclusión', 'Que la digan muchos', 'Que suene bonita'], a: 1 },
    { etapa: 2, q: 'La regla es «si llueve, la cancha se moja». ¿Qué SÍ se puede concluir?', o: ['Está mojada, así que llovió', 'No está mojada, así que no hay regla', 'Nada se puede concluir', 'Llovió, así que está mojada'], a: 3 },
    { etapa: 2, q: '«Todos los peces vuelan. La tilapia es un pez. Así que la tilapia vuela.» Este argumento…', o: ['está mal hecho', 'no es un argumento', 'está bien hecho, pero parte de una mentira', 'es verdad'], a: 2 },
    { etapa: 3, q: 'La leña se vuelve ceniza. ¿Qué cambió?', o: ['El nombre', 'La materia', 'Solo la forma', 'Nada'], a: 1 },
    { etapa: 3, q: 'A la escuela le cambian el nombre. ¿Qué le pasó al edificio?', o: ['Nada: cambió lo que decimos', 'Cambió de materia', 'Cambió de forma', 'Se hizo otro'], a: 0 },
    { etapa: 3, q: '¿Qué es una cosmovisión?', o: ['Un mapa del cielo', 'Una lista de fechas', 'La forma entera en que un pueblo explica el mundo', 'Un aparato para ver lejos'], a: 2 },
  ],
};
