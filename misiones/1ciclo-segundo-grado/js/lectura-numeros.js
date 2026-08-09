/* ══════════════════════════════════════════════════════════════
   📖 LECTURAS DE LA MISIÓN «NÚMEROS GRANDES: DEL CIEN AL MILLÓN»

   Cinco lecturas por cada grado del II y III ciclo (4º a 9º), para el
   Control de lectura que vive DENTRO de la misión: el alumno se
   cronometra solo, un minuto, y después trabaja ese mismo texto.

   Por qué el corpus es propio y no el de Mi aula: aquí el texto además
   ENSEÑA. Todas las lecturas están cargadas de números grandes —unos
   en cifras y otros en palabras, como se los va a encontrar en la
   vida— y al terminar la toma el alumno los caza sobre el texto, los
   lee, los descompone y los ordena.

   ── De dónde salen los números ──
   NO se escriben a mano en una lista, como sí se hace con los
   adjetivos. Los encuentra y los lee js/data/lectura-numerales.js.
   Con los adjetivos no hay más remedio (un participio es adjetivo o
   verbo según la oración); con los números sí lo hay, porque
   «cuarenta y dos mil» vale lo que vale siempre. Una lista a mano solo
   añadiría erratas, y una errata aquí le enseña al niño un número
   equivocado.

   REGLAS DEL CORPUS (las comprueba _dev/valida-lectura-mision.js):
   · El LARGO va por grado, con la misma banda de palabras del corpus
     de Mi aula: 4º 95–115 · 5º 110–135 · 6º 125–150 · 7º 140–170 ·
     8º 155–185 · 9º 170–200.
   · 5 preguntas exactas por texto, con la mezcla de tipos del grado y
     3 opciones cada una.
   · Cada lectura lleva al menos SEIS números mayores que mil —es lo
     que caza el alumno— y algunos menores, que son los que le obligan
     a mirar de verdad en vez de tocar todo lo que tenga cifras.
   · Los números van MEZCLADOS: unos en cifras (con la coma de millar
     que usa esta misión, 12,000) y otros en palabras («veintiocho
     mil»). Si todos fueran cifras, la actividad de leerlos sobraría.
   · Contexto hondureño y narrativa con gancho: el número tiene que
     importarle a alguien dentro del cuento.
   · NADA que exija fuente oficial: ni censos, ni cifras históricas, ni
     estadísticas reales. Los escenarios son inventados y verosímiles,
     que es justo lo que necesita un problema de matemáticas.
   · Nombres propios SIEMPRE con mayúscula (normativa del proyecto).

   El id es estable (LN<grado>-NN): los resultados guardados lo citan.
══════════════════════════════════════════════════════════════ */

const LECTURA_NUMEROS = {

  /* ════════ 4º GRADO (95–115 palabras · 3 literales, 1 inferencial, 1 crítica) ════════ */
  4: [
    { id: 'LN4-01', titulo: 'Las tapitas de la escuela', genero: 'crónica',
      texto: 'La maestra puso un frasco grande en la puerta del aula. «Vamos a juntar tapitas», dijo. «Con muchas se compra una silla de ruedas.» La primera semana juntaron 240 y pareció poquísimo. Al mes ya eran 3,500 y el frasco no alcanzaba: trajeron un saco. En septiembre iban por 12,000; en octubre, por veintiocho mil; en noviembre pasaron las 45,000. Las otras dos escuelas del barrio aportaron 18,000 más. En diciembre lo pesaron todo y salieron 67,400 tapitas. Nadie las contó de una en una. Ese es el truco de los números grandes, dijo la maestra: no se cuentan, se agrupan.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas tapitas juntaron la primera semana?', r: '240.',
          o: ['240.', '3,500.', '12,000.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántas aportaron las otras dos escuelas?', r: '18,000.',
          o: ['45,000.', '18,000.', '28,000.'], c: 1 },
        { tipo: 'literal', q: '¿Cómo supieron cuántas tapitas había en diciembre?', r: 'Las pesaron.',
          o: ['Las contaron una por una.', 'Lo calculó la maestra de memoria.', 'Las pesaron.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué cambiaron el frasco por un saco?', r: 'Porque las tapitas pasaron de 240 a 3,500 y ya no cabían.',
          o: ['Porque las tapitas ya no cabían en el frasco.', 'Porque el frasco se quebró.', 'Porque el saco era más bonito.'], c: 0 },
        { tipo: 'critica', q: '¿Te parece bien el truco de pesar en vez de contar? ¿Por qué?', r: 'Respuesta abierta: se valora que reconozca que agrupar ahorra tiempo cuando la cantidad es enorme.',
          o: ['No, porque solo cuenta lo que se cuenta de uno en uno.', 'Sí, porque contar 67,400 tapitas de una en una tomaría días.', 'Da igual, porque el número no importa.'], c: 1 },
      ] },

    { id: 'LN4-02', titulo: 'El maratón de lectura', genero: 'crónica',
      texto: 'El colegio se propuso una meta rara: leer 100,000 páginas entre todos antes de las vacaciones. Cada alumno anotaba en un cartel las páginas que leía. Al principio la suma iba lenta, con 1,800 la primera semana. Después empezó a correr: 9,400 en la segunda, quince mil en la tercera y 22,600 en la cuarta. Los de sexto solos juntaron 31,000. Un niño de cuarto leyó 640 páginas él solito y salió en el periódico mural. El último día la suma marcaba 104,300. Pasaron la meta por 4,300 páginas y nadie se lo esperaba. La maestra dijo que el otro año la meta sería de 150,000.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuál era la meta del colegio?', r: 'Leer 100,000 páginas entre todos.',
          o: ['Leer 104,300 páginas.', 'Leer 100,000 páginas entre todos.', 'Leer 31,000 páginas.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántas páginas leyó el niño de cuarto que salió en el periódico mural?', r: '640.',
          o: ['640.', '1,800.', '9,400.'], c: 0 },
        { tipo: 'literal', q: '¿Por cuántas páginas pasaron la meta?', r: 'Por 4,300.',
          o: ['Por 22,600.', 'Por 31,000.', 'Por 4,300.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la suma «empezó a correr» después de la primera semana?', r: 'Porque cada semana más alumnos fueron sumando páginas, y las cantidades crecieron.',
          o: ['Porque cada semana se sumaron más alumnos y más páginas.', 'Porque acortaron los libros.', 'Porque contaron dos veces lo mismo.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve ponerle a un curso una meta con un número tan grande? ¿Por qué?', r: 'Respuesta abierta: se valora que hable de la motivación de la meta común o del riesgo de que asuste.',
          o: ['No sirve: 100,000 asusta y nadie ni lo intenta.', 'Sirve, porque entre muchos una cifra enorme se vuelve posible.', 'No se puede saber.'], c: 1 },
      ] },

    { id: 'LN4-03', titulo: 'La feria del maíz', genero: 'descriptivo',
      texto: 'En la feria del maíz cada saco lleva un número escrito con crayón. Don Efraín trajo 1,250 mazorcas en su carreta. Su vecina llevó 940, casi lo mismo, y se pusieron a discutir cuál era más. Al fondo, la cooperativa apiló 15,000 mazorcas en una montaña amarilla. El comprador de la ciudad pidió 200,000 para toda la temporada. «Eso no lo llena un pueblo», dijo don Efraín. Sacaron cuentas en una hoja: con 8,600 de una aldea, 34,500 de otra y 52,700 de la cooperativa vecina todavía faltaba muchísimo. Entonces entendieron que doscientos mil es un número que solo se junta entre muchos.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas mazorcas trajo don Efraín?', r: '1,250.',
          o: ['940.', '1,250.', '15,000.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántas apiló la cooperativa?', r: '15,000.',
          o: ['15,000.', '8,600.', '34,500.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántas mazorcas pidió el comprador de la ciudad?', r: '200,000.',
          o: ['34,500.', '100,000.', '200,000.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué don Efraín dijo «eso no lo llena un pueblo»?', r: 'Porque 200,000 es muchísimo más de lo que junta una sola aldea.',
          o: ['Porque 200,000 es muchísimo más de lo que junta una aldea sola.', 'Porque el pueblo estaba vacío.', 'Porque el comprador se equivocó de feria.'], c: 0 },
        { tipo: 'critica', q: 'Don Efraín y su vecina discutían por 1,250 y 940. ¿Cómo se sale de esa discusión?', r: 'Respuesta abierta: se valora que proponga comparar las cifras en vez de discutir a ojo.',
          o: ['Gana el que grite más fuerte.', 'No se puede saber sin contarlas otra vez.', 'Comparando los números: 1,250 tiene una cifra más que 940.'], c: 2 },
      ] },

    { id: 'LN4-04', titulo: 'El vivero de los mil árboles', genero: 'crónica',
      texto: 'La aldea decidió sembrar árboles en el cerro pelado. Al principio hablaban de 500, pero el maestro dijo que con eso no se veía nada. Subieron la meta a cinco mil. Las bolsas negras llegaron en camión: 2,400 el lunes y 3,700 el jueves. Los niños llenaron 1,900 bolsas de tierra en un solo día. Cuando terminaron la siembra habían plantado 6,150 arbolitos, más de lo prometido. Dos años después el cerro seguía casi pelado, porque de cada diez arbolitos solo pegaron siete. Aun así quedaron 4,300 árboles vivos donde antes no había ninguno. Para tapar el cerro entero harían falta 20,000.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuál fue la meta después de subirla?', r: '5,000 árboles.',
          o: ['500 árboles.', '5,000 árboles.', '6,150 árboles.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántas bolsas llenaron los niños en un solo día?', r: '1,900.',
          o: ['1,900.', '2,400.', '3,700.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos árboles quedaron vivos dos años después?', r: '4,300.',
          o: ['6,150.', '5,000.', '4,300.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el cerro seguía casi pelado si plantaron 6,150 árboles?', r: 'Porque no todos pegaron y además un árbol pequeño tarda años en verse.',
          o: ['Porque no todos pegaron y un árbol tarda años en crecer.', 'Porque los plantaron en otro cerro.', 'Porque nadie fue a verlos.'], c: 0 },
        { tipo: 'critica', q: '¿Fue buena idea subir la meta de 500 a 5,000? Explica.', r: 'Respuesta abierta: se valora que note que con 500 casi no se notaría el cambio en un cerro entero.',
          o: ['No, porque cuesta más trabajo.', 'Sí, porque en un cerro entero 500 árboles casi no se notan.', 'Da igual: los árboles son árboles.'], c: 1 },
      ] },

    { id: 'LN4-05', titulo: 'La alcancía de Wilmer', genero: 'cuento',
      texto: 'Wilmer quería una bicicleta que costaba 4,500 lempiras. Empezó con 60 que le sobraron de la pulpería. Su abuela le dijo que guardara todos los días algo, aunque fuera poco. En marzo tenía 890. En junio, 2,150. En septiembre pasó los tres mil y ya casi no dormía de la emoción. Vendió elotes en la feria y ganó 1,200 de un solo golpe, y en diciembre juntó otros 1,450 con los tamales. Cuando quebró la alcancía contó 5,340 lempiras. Le alcanzó para la bicicleta y le sobraron 840. Su abuela solo dijo una cosa: «Los números grandes se hacen de números chiquitos.»',
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto costaba la bicicleta?', r: '4,500 lempiras.',
          o: ['5,340 lempiras.', '3,000 lempiras.', '4,500 lempiras.'], c: 2 },
        { tipo: 'literal', q: '¿Cuánto ganó vendiendo elotes en la feria?', r: '1,200.',
          o: ['1,200.', '890.', '2,150.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto le sobró después de comprar la bicicleta?', r: '840.',
          o: ['60.', '840.', '2,150.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiso decir la abuela con «los números grandes se hacen de números chiquitos»?', r: 'Que juntando cantidades pequeñas todos los días se llega a una cantidad grande.',
          o: ['Que juntando poquito cada día se llega a mucho.', 'Que los números chiquitos no sirven.', 'Que hay que pedir prestado.'], c: 0 },
        { tipo: 'critica', q: '¿Qué te parece la forma de ahorrar de Wilmer? ¿La harías tú?', r: 'Respuesta abierta: se valora que opine sobre la constancia y dé una razón propia.',
          o: ['No sirve: con 60 lempiras no se llega a ningún lado.', 'Es mejor pedirle el dinero a alguien de una vez.', 'Sirve, porque guardar todos los días convierte lo poco en mucho.'], c: 2 },
      ] },
  ],

  /* ════════ 5º GRADO (110–135 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  5: [
    { id: 'LN5-01', titulo: 'La rifa del techo', genero: 'crónica',
      texto: 'El techo de la escuela se llovía y arreglarlo costaba 85,000 lempiras. La directora sacó la cuenta en el pizarrón delante de todos. Si vendían boletos de 20 lempiras, hacían falta 4,250 boletos. Nadie dijo nada: sonaba imposible. Entonces la maestra de sexto propuso repartirlo. Eran 340 alumnos; a cada uno le tocaban trece boletos. Dicho así ya no asustaba. La primera semana vendieron 1,180. La segunda, 2,050. Un padre compró 300 de un solo golpe para su cooperativa. Al mes llevaban 4,600 boletos y noventa y dos mil lempiras. Sobraron 7,000, que se gastaron en pintura. El año pasado la misma rifa solo había dejado 31,000. El número no había cambiado: cambió en cuántas partes lo miraron.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto costaba arreglar el techo?', r: '85,000 lempiras.',
          o: ['85,000 lempiras.', '92,000 lempiras.', '7,000 lempiras.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos boletos compró de golpe un padre de familia?', r: '300.',
          o: ['1,180.', '300.', '2,050.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué 4,250 boletos «ya no asustaba» al repartirlo entre 340 alumnos?', r: 'Porque a cada alumno le tocaban solo trece boletos, y trece sí parece posible.',
          o: ['Porque bajaron el precio del boleto.', 'Porque la directora borró el pizarrón.', 'Porque a cada uno le tocaban trece, y trece sí parece posible.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué significa que «el número no había cambiado»?', r: 'Que seguían necesitando lo mismo; lo que cambió fue la forma de repartirlo y de verlo.',
          o: ['Que seguía haciendo falta lo mismo: cambió cómo lo repartieron.', 'Que se equivocaron al sumar.', 'Que el techo costó menos al final.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve partir un número grande en partes pequeñas para no rendirse? Argumenta.', r: 'Respuesta abierta: se valora que reconozca el valor de dividir una meta sin negar que el total sigue igual.',
          o: ['No: partirlo es engañarse, el total es el mismo.', 'Sí: el total es el mismo, pero repartido cada parte sí se puede hacer.', 'No importa cómo se mire un número.'], c: 1 },
      ] },

    { id: 'LN5-02', titulo: 'Los granos de una mazorca', genero: 'expositivo',
      texto: 'Nadie sabe de memoria cuántos granos tiene una mazorca, pero se puede averiguar sin contarlos todos. Se cuentan las hileras y los granos de una hilera. Si hay 16 hileras de 40 granos, la mazorca lleva 640. Con eso ya se puede estimar lo demás. Un saco con 300 mazorcas guarda cerca de 192,000 granos. Una carretada de 1,500 mazorcas anda por los 960,000, casi un millón. Una carreta de 800 mazorcas guarda 512,000. Y con 3,000 mazorcas se pasan los 1,900,000, casi dos millones. Nadie contó ninguno de esos números uno por uno: todos salieron de multiplicar. Ese es el oficio de los números grandes, y por eso se inventaron.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos granos tiene una mazorca de 16 hileras de 40 granos?', r: '640.',
          o: ['640.', '560.', '1,600.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos granos guarda un saco de 300 mazorcas?', r: 'Cerca de 192,000.',
          o: ['Cerca de 960,000.', 'Cerca de 192,000.', 'Cerca de 25,000.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué no hace falta contar todos los granos para saber cuántos hay?', r: 'Porque contando una parte y multiplicando se llega al total.',
          o: ['Porque el número no importa.', 'Porque todas las mazorcas son iguales.', 'Porque contando una parte y multiplicando se llega al total.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que los números grandes «se inventaron» para esto?', r: 'Porque sirven para nombrar cantidades que sería imposible contar de una en una.',
          o: ['Porque sirven para nombrar cantidades imposibles de contar una por una.', 'Porque son más bonitos de escribir.', 'Porque los inventó un agricultor.'], c: 0 },
        { tipo: 'critica', q: 'El texto dice «cerca de» y «anda por los». ¿Está mal no dar el número exacto?', r: 'Respuesta abierta: se valora que distinga entre una estimación honesta y un dato exacto que aquí no se puede tener.',
          o: ['Sí está mal: en matemáticas todo tiene que ser exacto.', 'No: es una estimación, y decirlo así es más honesto que inventar una cifra exacta.', 'Da lo mismo lo que se escriba.'], c: 1 },
      ] },

    { id: 'LN5-03', titulo: 'El camión de la ruta', genero: 'narrativo',
      texto: 'Don Beto maneja el mismo camión desde hace años y le lleva la cuenta al odómetro como quien cuida a un animal. Cuando lo compró marcaba 82,000 kilómetros. El primer año le sumó 41,500. El segundo, 38,900. Un domingo se quedó viendo el tablero: iba a marcar 300,000. Paró en la orilla de la carretera, se bajó y esperó a que la última cifra girara. «Aquí caben tres vueltas al planeta», dijo, aunque no estaba seguro. Cuando pasó los cien mil le había puesto una calcomanía al espejo. Ahora el camión anda por los 412,600 y don Beto ya le tiene puesta la mira a los 500,000. Dice que ese número lo quiere ver con sus nietos arriba.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos kilómetros marcaba el camión cuando lo compró?', r: '82,000.',
          o: ['300,000.', '82,000.', '41,500.'], c: 1 },
        { tipo: 'literal', q: '¿Por cuántos kilómetros anda el camión ahora?', r: '412,600.',
          o: ['412,600.', '38,900.', '500,000.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué don Beto paró el camión en la orilla de la carretera?', r: 'Para ver el momento en que el odómetro marcaba 300,000 kilómetros.',
          o: ['Porque el camión se descompuso.', 'Porque se le acabó el combustible.', 'Para ver el momento en que el tablero marcaba 300,000.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué cifra tiene puesta en la mira don Beto?', r: '500,000 kilómetros.',
          o: ['500,000 kilómetros.', '50,000 kilómetros.', '5,000,000 de kilómetros.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué crees que a don Beto le importa tanto una cifra redonda? ¿Te pasa a ti?', r: 'Respuesta abierta: se valora que note que las cifras redondas funcionan como marcas o metas.',
          o: ['Porque los números redondos valen más que los otros.', 'Porque una cifra redonda es una marca fácil de recordar y de celebrar.', 'No tiene sentido, es una tontería.'], c: 1 },
      ] },

    { id: 'LN5-04', titulo: 'La cooperativa del café', genero: 'expositivo',
      texto: 'En la cooperativa el café se cuenta en libras y las libras se convierten en números grandes muy rápido. Un cafetal pequeño da unas mil ochocientas libras al año. Doña Marta entregó 2,340 en su primera cosecha y le pareció una barbaridad. Su vecino entregó 4,700. Entre los treinta socios juntaron 96,000 libras, y ese fue el número que apuntaron en la pizarra de la bodega. El camión que se las llevó cargaba 24,000 por viaje, así que hicieron cuatro viajes. Al año siguiente la cooperativa llegó a 118,500 libras. El comprador de la ciudad les pidió 250,000 libras para el año siguiente. Doña Marta miró la pizarra y dijo que ella sola nunca habría escrito un número así.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas libras entregó doña Marta en su primera cosecha?', r: '2,340.',
          o: ['1,800.', '4,700.', '2,340.'], c: 2 },
        { tipo: 'literal', q: '¿Cuántas libras cargaba el camión por viaje?', r: '24,000.',
          o: ['24,000.', '96,000.', '118,500.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué hicieron cuatro viajes?', r: 'Porque 96,000 libras no caben en un camión que carga 24,000 por viaje.',
          o: ['Porque la bodega estaba lejos.', 'Porque 96,000 libras no caben en un camión de 24,000.', 'Porque el camión iba despacio.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué doña Marta dice que ella sola nunca habría escrito un número así?', r: 'Porque su cosecha personal es pequeña; el número grande sale de juntar la de todos los socios.',
          o: ['Porque no sabe escribir números grandes.', 'Porque no le gustan las matemáticas.', 'Porque su cosecha sola es pequeña: el número sale de juntar la de todos.'], c: 2 },
        { tipo: 'critica', q: '¿Qué gana un agricultor pequeño al juntarse con otros? Argumenta con los números del texto.', r: 'Respuesta abierta: se valora que use las cifras para explicar la ventaja de sumar cosechas.',
          o: ['Nada: cada quien vende lo suyo igual.', 'Que 2,340 libras solas casi no pesan, pero 96,000 juntas sí mueven un camión.', 'Que le pagan por hablar en la reunión.'], c: 1 },
      ] },

    { id: 'LN5-05', titulo: 'El estadio lleno', genero: 'crónica',
      texto: 'La primera vez que Kevin entró a un estadio grande se quedó parado en la boca del túnel sin poder avanzar. Su tío le había dicho que ahí cabían 35,000 personas y él había dicho que sí con la cabeza sin entender nada. En la escuela son 480 alumnos y el patio ya le parece enorme. Hizo la cuenta despacio, con los dedos: harían falta setenta y tres escuelas como la suya para llenar aquello. Ese día la entrada fue de 28,700 personas. En la tele dijeron que en otro partido habían entrado 41,200, que en uno flojo apenas 19,500 y que el récord del estadio era de cincuenta y dos mil. La boletería del año pasado marcó 33,100. Kevin no volvió a oír esos números igual.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas personas caben en el estadio, según el tío?', r: '35,000.',
          o: ['35,000.', '28,700.', '52,000.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos alumnos hay en la escuela de Kevin?', r: '480.',
          o: ['73.', '480.', '4,800.'], c: 1 },
        { tipo: 'inferencial', q: '¿Para qué comparó Kevin el estadio con su escuela?', r: 'Para entender de verdad cuánto es 35,000, usando algo que él conoce.',
          o: ['Para presumir de su escuela.', 'Para saber cuántos alumnos caben en el patio.', 'Para entender cuánto es 35,000 usando algo que él conoce.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué «no volvió a oír esos números igual»?', r: 'Porque ya sabe a cuánta gente equivale una cifra así: dejó de ser una palabra.',
          o: ['Porque ahora sabe a cuánta gente equivale: dejó de ser una palabra.', 'Porque se quedó sordo con la bulla.', 'Porque decidió no volver al estadio.'], c: 0 },
        { tipo: 'critica', q: '¿Sirve comparar un número grande con algo que uno conoce? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que reconozca la comparación como forma de dar sentido a una cantidad.',
          o: ['No sirve: un número es un número y ya.', 'Sí sirve: un número solo se entiende cuando se compara con algo que uno ha visto.', 'Solo sirve para los estadios.'], c: 1 },
      ] },
  ],

  /* ════════ 6º GRADO (125–150 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  6: [
    { id: 'LN6-01', titulo: 'Las botellas del barrio', genero: 'crónica',
      texto: 'Todo empezó porque la quebrada del barrio bajaba tapada de plástico. Un grupo de muchachos se puso a sacar botellas y a contarlas, y la cuenta se les volvió una obsesión. El primer sábado sacaron 1,340. El segundo, 2,780. Para el cuarto ya llevaban 12,500 y tuvieron que pedir prestada una bodega. El centro de acopio pagaba por peso, no por unidad, así que aprendieron a estimar: cada saco llevaba unas 450 botellas y pesaba dieciocho libras. Con 90 sacos calcularon 40,500 botellas y les pagaron por 1,620 libras. En un año pasaron las doscientas mil. Lo que más los sorprendió no fue el dinero. Fue caminar por la orilla de la quebrada y verle otra vez el fondo, que llevaba años sin verse. Por todo el año les pagaron 8,900 lempiras.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas botellas sacaron el primer sábado?', r: '1,340.',
          o: ['2,780.', '1,340.', '12,500.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántas botellas calcularon con 90 sacos?', r: '40,500.',
          o: ['40,500.', '200,000.', '1,620.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué aprendieron a estimar en vez de contar?', r: 'Porque el centro de acopio pagaba por peso y contar 40,500 botellas una por una era imposible.',
          o: ['Porque se aburrieron de contar.', 'Porque el pago era por peso y contar tantas botellas era imposible.', 'Porque no sabían contar tan alto.'], c: 1 },
        { tipo: 'inferencial', q: '¿Cómo supieron que cada saco llevaba unas 450 botellas?', r: 'Contando las de un saco y suponiendo que los demás eran parecidos.',
          o: ['Contando las de un saco y suponiendo que los demás eran parecidos.', 'Se lo dijo el centro de acopio.', 'Contaron los 90 sacos completos.'], c: 0 },
        { tipo: 'critica', q: 'Al final lo que más los sorprendió no fue el dinero. ¿Qué dice eso del proyecto?', r: 'Respuesta abierta: se valora que note que el resultado visible pesó más que la ganancia.',
          o: ['Que perdieron el tiempo, porque ganaron poco.', 'Que no sabían cuánto iban a cobrar.', 'Que el cambio que vieron en la quebrada les importó más que la ganancia.'], c: 2 },
      ] },

    { id: 'LN6-02', titulo: 'La biblioteca que creció', genero: 'crónica',
      texto: 'La biblioteca del instituto empezó con 320 libros metidos en tres estantes cojos. La bibliotecaria llevaba una libreta donde apuntaba cada entrada y cada salida, y esa libreta terminó contando la historia entera. El primer año entraron 1,150 libros donados. El segundo, 2,400. Un colegio que cerró les regaló de golpe seis mil ochocientos. Cuando pasaron los 10,000 tuvieron que cambiar de sistema: ya no se podía buscar un título de memoria. Hoy el catálogo marca 24,700 volúmenes y los préstamos del año pasado fueron 31,500, más de un préstamo por libro. La bibliotecaria dice que el número que más le gusta no es ninguno de esos. Es el 7: los siete muchachos que llegan todos los días media hora antes de que abra. Este año esperan llegar a 27,000 volúmenes.',
      preguntas: [
        { tipo: 'literal', q: '¿Con cuántos libros empezó la biblioteca?', r: '320.',
          o: ['320.', '1,150.', '2,400.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos préstamos hubo el año pasado?', r: '31,500.',
          o: ['24,700.', '31,500.', '10,000.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué tuvieron que cambiar de sistema al pasar los 10,000 libros?', r: 'Porque con esa cantidad ya nadie podía recordar dónde estaba cada título.',
          o: ['Porque la libreta se acabó.', 'Porque cambiaron de bibliotecaria.', 'Porque con tantos libros ya nadie podía buscarlos de memoria.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que hubo «más de un préstamo por libro»?', r: 'Que 31,500 préstamos es más que los 24,700 libros: en promedio cada libro salió más de una vez.',
          o: ['Que 31,500 es más que 24,700: cada libro salió más de una vez en promedio.', 'Que prestaron libros que no tenían.', 'Que cada alumno se llevó un libro.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué a la bibliotecaria le gusta más el 7 que el 24,700? ¿Estás de acuerdo?', r: 'Respuesta abierta: se valora que distinga entre el tamaño de una cifra y lo que esa cifra significa.',
          o: ['Porque el 7 es más fácil de escribir.', 'Porque un número pequeño puede decir más: siete lectores fieles valen mucho.', 'Porque no le gustan los números grandes.'], c: 1 },
      ] },

    { id: 'LN6-03', titulo: 'La laguna de las tilapias', genero: 'expositivo',
      texto: 'Una granja de tilapias es una máquina de números. Los alevines llegan en bolsas plásticas: cinco mil en cada una, del tamaño de una uña. Don Rigo compró tres bolsas, 15,000 peces, y los soltó en dos estanques. De cada diez, dos no llegan a grandes, así que contaba con unos 12,000. Cada pez se come cerca de 400 gramos de concentrado antes de venderse, y ahí es donde la cuenta se pone seria: 12,000 peces se comen 4,800,000 gramos, que son 4,800 kilos. El saco trae 40 kilos, así que necesitaba 120 sacos. Con 22 estanques como esos harían falta 2,640 sacos. Don Rigo dice que el que no saca esa cuenta antes de empezar termina con la laguna llena y la bodega vacía.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos alevines vienen en cada bolsa?', r: '5,000.',
          o: ['15,000.', '5,000.', '12,000.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántos sacos de concentrado necesitaba don Rigo?', r: '120.',
          o: ['120.', '400.', '40.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué contaba con 12,000 peces y no con 15,000?', r: 'Porque de cada diez, dos no llegan a grandes.',
          o: ['Porque se le escaparon algunos.', 'Porque de cada diez, dos no llegan a grandes.', 'Porque vendió tres mil antes.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué pasa si alguien no saca la cuenta del concentrado antes de empezar?', r: 'Que se queda sin comida para los peces a medio camino.',
          o: ['Que le sobran sacos al final.', 'Que los peces crecen más rápido.', 'Que se queda sin comida a medio camino.'], c: 2 },
        { tipo: 'critica', q: '¿Vale la pena hacer todas esas cuentas antes de soltar el primer pez? Argumenta.', r: 'Respuesta abierta: se valora que reconozca la planificación como forma de evitar una pérdida grande.',
          o: ['No: las cuentas se hacen sobre la marcha.', 'Sí: un error de cuenta aquí se paga con toda la cosecha de peces.', 'Da igual, porque los números cambian solos.'], c: 1 },
      ] },

    { id: 'LN6-04', titulo: 'Un millón de pasos', genero: 'crónica',
      texto: 'A la profesora de Educación Física se le ocurrió un reto para todo el instituto: caminar un millón de pasos entre todos en un mes. Al principio sonó a broma. Después alguien sacó la cuenta y la broma se acabó. Son 620 alumnos; a cada uno le tocaban 1,613 pasos diarios, que es menos de lo que se camina yendo a clase. La primera semana registraron 214,000. La segunda bajaron a 186,500 porque llovió todos los días. La tercera se recuperaron con 268,000 y la última hicieron 340,000, porque ya nadie quería quedarse afuera. Terminaron en 1,008,500 pasos. Lo interesante es que el número no cambió en todo el mes: lo único que cambió fue que dejaron de verlo como un millón y empezaron a verlo como mil seiscientos trece.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos pasos diarios le tocaban a cada alumno?', r: '1,613.',
          o: ['620.', '1,613.', '214,000.'], c: 1 },
        { tipo: 'literal', q: '¿Con cuántos pasos terminaron el reto?', r: '1,008,500.',
          o: ['1,008,500.', '340,000.', '1,000,000.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la segunda semana bajaron a 186,500 pasos?', r: 'Porque llovió todos los días y salieron a caminar menos.',
          o: ['Porque se cansaron del reto.', 'Porque llovió todos los días.', 'Porque cambiaron la forma de contar.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «dejaron de verlo como un millón»?', r: 'Que repartido entre todos y por día, el millón se convirtió en una cantidad que sí podían hacer.',
          o: ['Que se olvidaron de la meta.', 'Que el millón se volvió más pequeño.', 'Que repartido por persona y por día, sí se podía hacer.'], c: 2 },
        { tipo: 'critica', q: '¿Por qué un mismo número puede parecer imposible y luego posible? Explica con el texto.', r: 'Respuesta abierta: se valora que relacione el cambio con repartir la cantidad, no con cambiarla.',
          o: ['Porque los números cambian según el día.', 'Porque repartido entre 620 personas y 30 días, el mismo número se vuelve manejable.', 'Porque al final hicieron menos pasos.'], c: 1 },
      ] },

    { id: 'LN6-05', titulo: 'El puente de ladrillos', genero: 'narrativo',
      texto: 'Cuando el río se llevó el puente de tablas, la comunidad decidió hacer uno de verdad. El maestro de obra llegó con una libreta y empezó a hablar en números. Dijo que hacían falta treinta y cuatro mil ladrillos, 1,200 sacos de cemento y 85 viajes de arena. El presupuesto fue de 148,000: 96,000 en materiales y 52,000 en jornales. Alguien preguntó cuánto era eso en tiempo. El maestro contestó que si ponían 400 ladrillos diarios, eran 85 días de trabajo. Al principio se desanimaron. Después contaron cuántos brazos había: cuarenta y dos vecinos dispuestos. Con diez ladrillos por persona por hora, la cuenta cambió de cara. Terminaron el puente en 61 días, con 2,300 ladrillos de sobra que guardaron para la escuela. Lo que los sacó adelante no fue el ánimo: fue haber puesto los números por delante.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos ladrillos hacían falta?', r: '34,000.',
          o: ['34,000.', '1,200.', '2,300.'], c: 0 },
        { tipo: 'literal', q: '¿En cuántos días terminaron el puente?', r: '61.',
          o: ['85.', '61.', '42.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la cuenta «cambió de cara» al contar los brazos?', r: 'Porque repartiendo el trabajo entre 42 vecinos avanzaban mucho más rápido que a 400 ladrillos diarios.',
          o: ['Porque bajaron la cantidad de ladrillos.', 'Porque el maestro se equivocó al sumar.', 'Porque entre 42 vecinos avanzaban mucho más rápido.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué sobraron 2,300 ladrillos?', r: 'Porque el cálculo inicial dejó margen: se pidió de más para no quedarse cortos.',
          o: ['Porque el cálculo dejó margen y se pidió de más.', 'Porque el puente salió más corto.', 'Porque se robaron algunos.'], c: 0 },
        { tipo: 'critica', q: '«Lo que los sacó adelante no fue el ánimo: fue haber puesto los números por delante.» ¿Estás de acuerdo?', r: 'Respuesta abierta: se valora que argumente sobre planificar antes de empezar, sin negar el papel del esfuerzo.',
          o: ['De acuerdo: sin las cuentas no habrían sabido ni por dónde empezar.', 'En desacuerdo: los números no ponen un solo ladrillo.', 'No se puede opinar de eso.'], c: 0 },
      ] },
  ],

  /* ════════ 7º GRADO (140–170 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  7: [
    { id: 'LN7-01', titulo: 'El cero que costó caro', genero: 'narrativo',
      texto: 'La pulpería de doña Yolanda hacía sus pedidos por mensaje de texto, y una noche escribió mal un número. Quiso pedir 1,500 bolsas de sal y escribió 15,000. Una sola cifra de diferencia y el camión llegó al día siguiente con diez veces lo pedido. La bodega no daba. Las bolsas ocuparon el corredor, el cuarto de atrás y parte de la sala. Doña Yolanda sacó la cuenta con una calculadora prestada: a 12 lempiras la bolsa, el pedido correcto valía dieciocho mil lempiras y el equivocado, 180,000. Ella tenía 22,000 en la cuenta. Pasó tres semanas devolviendo, negociando y regalando sal a medio barrio. Ese mes la pulpería había vendido 43,600 lempiras en total. Desde entonces tiene una regla pegada con cinta sobre el mostrador: «Antes de mandar un número, léelo en voz alta.» Un cero no se ve, pero se oye.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas bolsas quiso pedir doña Yolanda?', r: '1,500.',
          o: ['15,000.', '1,500.', '22,000.'], c: 1 },
        { tipo: 'literal', q: '¿Cuánto valía el pedido equivocado?', r: '180,000 lempiras.',
          o: ['180,000 lempiras.', '18,000 lempiras.', '12,000 lempiras.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué un cero de más multiplicó el pedido por diez?', r: 'Porque cada cifra vale según su posición: agregar un cero corre todas las cifras un lugar a la izquierda.',
          o: ['Porque el camión traía más de lo normal.', 'Porque la sal subió de precio.', 'Porque agregar un cero corre todas las cifras un lugar a la izquierda.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué su regla dice «léelo en voz alta»?', r: 'Porque «quince mil» y «mil quinientos» suenan distinto aunque escritos se parezcan.',
          o: ['Porque «quince mil» y «mil quinientos» suenan distinto aunque se parezcan escritos.', 'Porque así se acuerda mejor del pedido.', 'Porque el celular no tiene teclado.'], c: 0 },
        { tipo: 'critica', q: '¿Debería un negocio pequeño tener reglas así por escrito? Argumenta.', r: 'Respuesta abierta: se valora que pese el costo de un error frente a lo que cuesta revisar.',
          o: ['No: eso es exagerar por un error que pasó una vez.', 'Sí: revisar cuesta un minuto y el error le costó tres semanas.', 'Da igual, los errores no se pueden evitar.'], c: 1 },
      ] },

    { id: 'LN7-02', titulo: 'Las abejas de don Aurelio', genero: 'expositivo',
      texto: 'Don Aurelio tiene doce colmenas detrás de su casa y habla de sus abejas como quien habla de un pueblo. En una colmena buena viven cerca de 50,000 abejas en temporada, así que él anda administrando unas seiscientas mil sin haberlas contado nunca. Cada obrera vive unas seis semanas y en toda su vida produce menos de una cucharadita de miel. Para llenar un frasco de una libra hacen falta cerca de 22,000 viajes a las flores. En la temporada buena sus colmenas dan 1,800 libras de miel, que son 28,800 onzas. El año malo bajó a 41,000 abejas por colmena. Cuando alguien le compra un frasco, don Aurelio se lo entrega con una frase que ya es suya: «Aquí adentro hay más viajes que habitantes tiene este municipio.» La primera vez que lo dijo nadie le creyó y sacaron la cuenta ahí mismo, en una servilleta. Le creyeron.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas abejas viven en una colmena buena en temporada?', r: 'Cerca de 50,000.',
          o: ['Cerca de 600,000.', 'Cerca de 22,000.', 'Cerca de 50,000.'], c: 2 },
        { tipo: 'literal', q: '¿Cuántos viajes a las flores hacen falta para llenar un frasco de una libra?', r: 'Cerca de 22,000.',
          o: ['Cerca de 22,000.', 'Cerca de 12,000.', 'Cerca de 50,000.'], c: 0 },
        { tipo: 'inferencial', q: '¿De dónde sale el número de 600,000 abejas?', r: 'De multiplicar las doce colmenas por las 50,000 abejas de cada una.',
          o: ['De contarlas una por una en el invierno.', 'De multiplicar doce colmenas por 50,000 abejas.', 'Se lo dijo el veterinario.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la gente le creyó solo después de sacar la cuenta?', r: 'Porque la frase suena exagerada hasta que uno hace la multiplicación y comprueba el tamaño real.',
          o: ['Porque la frase suena exagerada hasta que uno hace la cuenta.', 'Porque don Aurelio les mostró las colmenas.', 'Porque el municipio publicó sus datos.'], c: 0 },
        { tipo: 'critica', q: '¿Qué gana don Aurelio contando su miel en viajes y no en libras?', r: 'Respuesta abierta: se valora que note que la comparación hace visible un trabajo que la libra esconde.',
          o: ['Nada: la libra es la única medida que sirve para vender.', 'Que el número le queda más grande y así cobra más caro.', 'Que hace visible el trabajo que hay detrás, y eso una libra no lo dice.'], c: 2 },
      ] },

    { id: 'LN7-03', titulo: 'El censo de los pinos', genero: 'expositivo',
      texto: 'La comunidad quería saber cuántos pinos tenía su montaña antes de decidir nada. Contarlos todos era imposible, así que el técnico forestal propuso otra cosa: contar bien un pedacito y estirar el resultado. Marcaron un cuadro de cien metros por cien metros y contaron 340 pinos dentro. Después midieron la montaña: 1,250 cuadros como ese. La multiplicación dio cuatrocientos veinticinco mil pinos. Nadie caminó entre los 425,000; el número salió de contar 340. Con el mismo método calcularon 96,000 pinos en la ladera norte, 38,500 en la sur y 12,700 en el filo, que sumados dan 572,200. Alguien preguntó si eso valía. El técnico contestó que sí, siempre que el pedacito sea parecido al resto, y por eso repitieron el conteo en tres lugares distintos: en uno salieron 310, en otro 355 y en el tercero 344. Los tres resultados se parecían, y esa parecencia es la que sostiene el número final.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos pinos contaron en el primer cuadro?', r: '340.',
          o: ['340.', '310.', '355.'], c: 0 },
        { tipo: 'literal', q: '¿Cuántos cuadros medía la montaña?', r: '1,250.',
          o: ['425,000.', '1,250.', '344.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué repitieron el conteo en tres lugares distintos?', r: 'Para comprobar que el pedacito medido se parece al resto de la montaña.',
          o: ['Porque se les perdió la primera cuenta.', 'Para que trabajaran más personas.', 'Para comprobar que el pedacito se parece al resto.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué pasaría si el primer cuadro hubiera caído justo en un claro sin árboles?', r: 'El resultado final habría salido muy por debajo del número real.',
          o: ['El resultado final habría salido muy por debajo del real.', 'No cambiaría nada, porque igual se multiplica.', 'La montaña tendría menos pinos.'], c: 0 },
        { tipo: 'critica', q: '¿Es honesto decir «hay 425,000 pinos» si solo contaron 340? Defiende tu postura.', r: 'Respuesta abierta: se valora que distinga entre estimación bien hecha y dato inventado, y que pida decir que es una estimación.',
          o: ['No es honesto: solo se puede decir lo que se contó.', 'Es honesto si se dice que es una estimación y se explica cómo se hizo.', 'Es honesto siempre: los números no mienten.'], c: 1 },
      ] },

    { id: 'LN7-04', titulo: 'La imprenta del pueblo', genero: 'narrativo',
      texto: 'La imprenta de don Nery es un cuarto con dos máquinas viejas y un olor a tinta que no se va con nada. Ahí se imprimen los calendarios del pueblo, las invitaciones de las bodas y los cuadernos de la escuela. Don Nery lleva la cuenta de todo en un libro de tapa dura. El año pasado imprimió 18,600 volantes, 7,300 tarjetas de bautizo, 4,200 calendarios y 96,000 hojas rayadas para cuadernos. La máquina grande saca 1,500 hojas por hora, así que las 96,000 hojas fueron 64 horas de máquina encendida. Un cliente le pidió una vez doscientos cincuenta mil volantes para una campaña de la ciudad y don Nery dijo que no. Le preguntaron por qué rechazaba el trabajo más grande de su vida. Contestó que su máquina habría necesitado 167 horas seguidas y que él prefiere entregar a tiempo lo que sí puede.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas hojas rayadas imprimió el año pasado?', r: '96,000.',
          o: ['18,600.', '4,200.', '96,000.'], c: 2 },
        { tipo: 'literal', q: '¿Cuántas hojas por hora saca la máquina grande?', r: '1,500.',
          o: ['1,500.', '64.', '167.'], c: 0 },
        { tipo: 'inferencial', q: '¿De dónde salen las 64 horas de máquina encendida?', r: 'De dividir las 96,000 hojas entre las 1,500 que saca por hora.',
          o: ['De sumar los tres trabajos del año.', 'De dividir 96,000 entre 1,500.', 'Las contó con un reloj.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué don Nery rechazó el pedido más grande de su vida?', r: 'Porque hizo la cuenta y supo que no podía entregarlo a tiempo con su máquina.',
          o: ['Porque hizo la cuenta y supo que no podía entregarlo a tiempo.', 'Porque no le gustaba el cliente.', 'Porque le pagaban poco.'], c: 0 },
        { tipo: 'critica', q: '¿Fue prudente o cobarde rechazar ese trabajo? Argumenta con los números.', r: 'Respuesta abierta: se valora que use el cálculo de horas para sostener su postura.',
          o: ['Cobarde: debió intentarlo y ver qué pasaba.', 'Prudente: 167 horas seguidas de máquina no es una promesa que se pueda cumplir.', 'Ni una cosa ni la otra: fue mala suerte.'], c: 1 },
      ] },

    { id: 'LN7-05', titulo: 'Los peldaños del cerro', genero: 'crónica',
      texto: 'Al mirador del cerro se sube por una escalera de piedra que hicieron los vecinos hace años. Nadie recordaba cuántos peldaños tenía, y cada quien decía un número distinto: unos hablaban de trescientos, otros de mil. Un grupo de estudiantes decidió acabar con la discusión y los contó de verdad: 1,148. Después les dio por seguir contando. Midieron que cada peldaño tiene 18 centímetros de alto, así que la escalera sube 20,664 centímetros, que son 206 metros. Calcularon que un visitante que suba y baje tres veces por semana durante un año hace 358,176 peldaños. El municipio calcula 24,000 visitantes al año, y un guía que sube dos veces al día hace 838,040 peldaños. Pusieron todo eso en un rótulo de madera al pie de la escalera. Desde entonces la gente ya no discute el número: ahora discute si ese rótulo anima o desanima.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos peldaños tiene la escalera?', r: '1,148.',
          o: ['1,148.', '1,000.', '206.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto mide de alto cada peldaño?', r: '18 centímetros.',
          o: ['20 centímetros.', '18 centímetros.', '206 centímetros.'], c: 1 },
        { tipo: 'inferencial', q: '¿Cómo llegaron a los 20,664 centímetros?', r: 'Multiplicando los 1,148 peldaños por los 18 centímetros de cada uno.',
          o: ['Midiendo la escalera con una cinta larga.', 'Sumando los peldaños de tres subidas.', 'Multiplicando 1,148 peldaños por 18 centímetros.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué la gente decía números tan distintos antes del conteo?', r: 'Porque nadie los había contado: cada uno calculaba a ojo y a ojo un número grande se falla por mucho.',
          o: ['Porque nadie los había contado y a ojo un número grande se falla por mucho.', 'Porque la escalera cambiaba de tamaño.', 'Porque unos subían y otros bajaban.'], c: 0 },
        { tipo: 'critica', q: '¿El rótulo con esos números anima a subir o desanima? Defiende tu respuesta.', r: 'Respuesta abierta: se valora que argumente sobre el efecto de mostrar una cifra grande, en cualquiera de los dos sentidos.',
          o: ['Anima: convierte la subida en un reto con marca.', 'Desanima: ver 1,148 antes de empezar quita las ganas.', 'Las dos cosas, según quién lo lea y para qué suba.'], c: 2 },
      ] },
  ],

  /* ════════ 8º GRADO (155–185 palabras · 2 literales, 2 inferenciales, 1 crítica) ════════ */
  8: [
    { id: 'LN8-01', titulo: 'La coma que cambia todo', genero: 'argumentativo',
      texto: 'Se escribe 25,000 y no 25000 por una razón práctica, no por adorno: el ojo humano no distingue de un golpe una fila de cinco cifras de una de seis. Pruébelo usted mismo con 250000 y 25000 puestos uno debajo del otro. Cuesta. Ahora sepárelos: 250,000 y 25,000. Ya no cuesta nada. Esa coma cada tres cifras no cambia el valor de nada; cambia el tiempo que uno tarda en leerlo, y con eso cambia la cantidad de errores. En una bodega donde se anotan cantidades a mano todo el día, esa diferencia se paga en dinero. Compare 4,500 con 45,000 y con 450,000. Hay quien dice que es una manía de maestros. No lo es. Los grupos de tres existen porque así se nombra el número al leerlo en voz alta: mil, millón. La coma no es una regla de ortografía; es un mapa. Cada grupo de tres cifras tiene nombre, y ese nombre es el que uno pronuncia cuando lee la cantidad completa.',
      preguntas: [
        { tipo: 'literal', q: '¿Cada cuántas cifras se pone la coma?', r: 'Cada tres.',
          o: ['Cada tres.', 'Cada cuatro.', 'Cada dos.'], c: 0 },
        { tipo: 'literal', q: 'Según el texto, ¿qué cambia la coma?', r: 'El tiempo que se tarda en leer el número, no su valor.',
          o: ['El valor del número.', 'El tiempo que se tarda en leerlo, no su valor.', 'La forma de sumarlo.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto pide al lector que compare 250000 con 25000?', r: 'Para que compruebe él mismo lo difícil que es distinguirlos sin la coma.',
          o: ['Para enseñarle a multiplicar por diez.', 'Para que vea cuál es mayor.', 'Para que compruebe él mismo lo difícil que es distinguirlos sin coma.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué dice que los grupos de tres «tienen nombre»?', r: 'Porque cada grupo corresponde a los miles y los millones, que es como se lee la cantidad en voz alta.',
          o: ['Porque cada grupo corresponde a los miles y los millones al leerlo en voz alta.', 'Porque alguien los bautizó así.', 'Porque son tres cifras iguales.'], c: 0 },
        { tipo: 'critica', q: '¿Es «una manía de maestros» separar con comas? Sostén tu postura.', r: 'Respuesta abierta: se valora que use el argumento de la lectura rápida y los errores, o que aporte otro.',
          o: ['Sí: los números se entienden igual sin comas.', 'No: es lo que permite leer una cantidad de un vistazo y equivocarse menos.', 'No se puede saber.'], c: 1 },
      ] },

    { id: 'LN8-02', titulo: 'La gotera que valía una cosecha', genero: 'expositivo',
      texto: 'En la escuela de la aldea había un chorro que goteaba desde hacía meses y nadie lo veía como un problema. Un maestro de séptimo puso una cubeta debajo durante una hora y midió: 900 mililitros. Con ese dato la clase entera se puso a calcular. En un día son 21,600 mililitros, casi 22 litros. En un mes, seiscientos cuarenta y ocho mil. En un año, 7,884,000 mililitros, que son 7,884 litros: el equivalente a llenar 39 tambos de doscientos litros. Solo en el trimestre de clases se van 1,944,000 mililitros, y en las vacaciones otros 2,592,000. Los muchachos llevaron la cuenta escrita a la reunión de padres. Alguien preguntó cuánto costaba el repuesto del chorro. Costaba 45 lempiras. Esa comparación —45 lempiras contra 7,884 litros— hizo más que cualquier discurso: el chorro se arregló esa misma semana. El maestro dice que los números grandes no sirven para presumir, sino exactamente para esto: para volver visible algo que estaba pasando delante de todos.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos mililitros goteaban en una hora?', r: '900.',
          o: ['21,600.', '900.', '648,000.'], c: 1 },
        { tipo: 'literal', q: '¿Cuánto costaba el repuesto del chorro?', r: '45 lempiras.',
          o: ['45 lempiras.', '39 lempiras.', '200 lempiras.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la comparación «45 lempiras contra 7,884 litros» convenció a la gente?', r: 'Porque puso lado a lado un costo mínimo y una pérdida enorme, y la desproporción se ve sola.',
          o: ['Porque los padres querían gastar dinero.', 'Porque el maestro habló muy bien.', 'Porque puso juntos un costo mínimo y una pérdida enorme.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué nadie veía la gotera como un problema antes?', r: 'Porque 900 mililitros por hora parece poquísimo hasta que se multiplica por todas las horas del año.',
          o: ['Porque 900 mililitros parecen poquísimo hasta que se multiplican por un año.', 'Porque el chorro estaba escondido.', 'Porque el agua no cuesta nada.'], c: 0 },
        { tipo: 'critica', q: '«Los números grandes no sirven para presumir, sino para volver visible lo invisible.» ¿Compartes esa idea?', r: 'Respuesta abierta: se valora que tome postura y la sostenga con este caso u otro parecido.',
          o: ['No: un número grande siempre impresiona y ya.', 'Sí: aquí el número fue lo único que hizo ver un problema que llevaba meses a la vista.', 'Depende del día.'], c: 1 },
      ] },

    { id: 'LN8-03', titulo: 'La bodega de don Sabas', genero: 'narrativo',
      texto: 'Don Sabas abastece a las pulperías de tres municipios desde una bodega que por fuera no parece nada. Adentro lleva un control que sorprende a quien lo ve. En una libreta cuadriculada anota, cada lunes, cuántas unidades entraron y cuántas salieron. El mes pasado entraron 128,400 unidades entre todo, y salieron 121,900. La diferencia, seis mil quinientos, es lo que quedó en la bodega, y él sabe exactamente en qué estante está cada cosa. En enero habían entrado 96,200 y salido 99,700; en febrero, 110,300 y 104,800. Un sobrino le llevó una computadora para modernizarlo. Don Sabas la usó dos semanas y volvió a la libreta. No fue terquedad: la computadora le daba los totales, pero él necesitaba ver la columna entera para notar lo que le importaba. Con los números en fila descubre que un producto que salía 900 veces al mes ahora sale 400, y ahí manda a preguntar por qué antes de quedarse con mercadería parada.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas unidades entraron el mes pasado?', r: '128,400.',
          o: ['121,900.', '128,400.', '6,500.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántas unidades quedaron en la bodega?', r: '6,500.',
          o: ['6,500.', '900.', '400.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué volvió a la libreta si la computadora le daba los totales?', r: 'Porque necesitaba ver toda la columna para notar los cambios, no solo el total final.',
          o: ['Porque no sabía usar la computadora.', 'Porque la computadora se descompuso.', 'Porque necesitaba ver toda la columna, no solo el total.'], c: 2 },
        { tipo: 'inferencial', q: '¿Qué le dice a don Sabas que un producto pase de 900 a 400 salidas?', r: 'Que algo cambió y conviene averiguarlo antes de que la mercadería se quede parada.',
          o: ['Que algo cambió y conviene averiguar por qué antes de perder la mercadería.', 'Que ese producto ya no sirve.', 'Que se equivocó al anotar.'], c: 0 },
        { tipo: 'critica', q: '¿Un total dice menos que una columna de números? Argumenta con el caso de don Sabas.', r: 'Respuesta abierta: se valora que distinga entre el dato resumido y la serie que muestra la tendencia.',
          o: ['El total dice más: resume todo en una sola cifra.', 'La columna dice más: el total esconde si algo viene subiendo o bajando.', 'Dicen exactamente lo mismo.'], c: 1 },
      ] },

    { id: 'LN8-04', titulo: 'El maratón de baile', genero: 'crónica',
      texto: 'Para juntar fondos, el instituto organizó un maratón de baile de veinticuatro horas seguidas. La cifra sonaba bien en el afiche, pero a nadie se le ocurrió traducirla hasta que la profesora de Matemáticas subió al escenario con un micrófono y lo hizo en voz alta. Veinticuatro horas son 1,440 minutos, dijo, y 86,400 segundos. Si una canción dura tres minutos, van a sonar 480 canciones. Si cada pareja aguanta cuarenta minutos y descansa, harán falta turnos para 36 relevos. La meta era juntar 50,000 lempiras y el año anterior habían llegado a 31,500. La gente se rio, pero el organizador tomó nota y armó la lista de turnos esa misma tarde. Al final entraron 74,200 lempiras solo en entradas. El maratón terminó con 312 participantes, sesenta y ocho mil lempiras recaudados y una sola pareja que aguantó desde el primer segundo hasta el último. Al año siguiente el afiche ya no decía «veinticuatro horas»: decía «86,400 segundos», y se inscribió el doble de gente.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos segundos tienen veinticuatro horas?', r: '86,400.',
          o: ['86,400.', '1,440.', '480.'], c: 0 },
        { tipo: 'literal', q: '¿Cuánto recaudaron?', r: '68,000 lempiras.',
          o: ['312 lempiras.', '68,000 lempiras.', '36,000 lempiras.'], c: 1 },
        { tipo: 'inferencial', q: '¿Para qué sirvió traducir las horas a minutos y segundos?', r: 'Para poder organizar el evento: saber cuántas canciones y cuántos turnos hacían falta.',
          o: ['Para presumir de saber matemáticas.', 'Para alargar el maratón.', 'Para poder organizarlo: canciones, turnos y relevos.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el segundo afiche atrajo al doble de gente diciendo lo mismo?', r: 'Porque «86,400 segundos» suena mucho más grande e impresiona más que «veinticuatro horas», aunque sea igual.',
          o: ['Porque «86,400 segundos» impresiona más, aunque sea la misma cantidad.', 'Porque el segundo maratón duró más.', 'Porque bajaron el precio de la entrada.'], c: 0 },
        { tipo: 'critica', q: '¿Es honesto anunciar «86,400 segundos» en vez de «veinticuatro horas»? Defiende tu postura.', r: 'Respuesta abierta: se valora que note que el dato es exacto pero está elegido por el efecto que causa.',
          o: ['Es un engaño: el número está inflado.', 'Es exacto, pero elegido para impresionar; conviene saber que eso también se hace.', 'No importa lo que diga un afiche.'], c: 1 },
      ] },

    { id: 'LN8-05', titulo: 'Los melones de la finca', genero: 'expositivo',
      texto: 'En la finca donde trabaja Nelson, la cosecha de melón se mide en cajas y las cajas se convierten en números grandes antes de que uno se dé cuenta. Una hectárea sembrada da alrededor de dos mil ochocientas cajas. La finca tiene 45 hectáreas, así que la cosecha buena anda por las 126,000 cajas. Cada caja lleva unos 9 melones, y ahí el número se dispara: 1,134,000 melones que salieron de un terreno que se cruza caminando en veinte minutos. Nelson lleva el control en una pizarra grande a la entrada de la bodega. Escribe la cifra del día y la del acumulado. El primer día de corte anotó 3,200. A la semana ya iba en 24,600. Cuando pasó las 100,000 cajas, alguien le tomó una foto a la pizarra. El año pasado la finca cerró con 118,400 cajas y este ya va arriba. Nelson dice que esa foto explica su trabajo mejor que cualquier cosa que él pueda contar.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántas cajas da alrededor de una hectárea?', r: '2,800.',
          o: ['126,000.', '2,800.', '3,200.'], c: 1 },
        { tipo: 'literal', q: '¿Cuántos melones lleva cada caja?', r: 'Unos 9.',
          o: ['Unos 9.', 'Unos 45.', 'Unos 20.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cómo se llega a la cifra de 1,134,000 melones?', r: 'Multiplicando las 126,000 cajas por los 9 melones de cada una.',
          o: ['Contando los melones de las 45 hectáreas.', 'Sumando la cifra de cada día en la pizarra.', 'Multiplicando 126,000 cajas por 9 melones.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué el texto menciona que el terreno «se cruza caminando en veinte minutos»?', r: 'Para hacer notar el contraste entre un espacio pequeño y una cantidad enorme.',
          o: ['Para que se note el contraste entre un terreno pequeño y una cantidad enorme.', 'Para explicar cuánto tarda Nelson en llegar.', 'Porque el tamaño del terreno no importa.'], c: 0 },
        { tipo: 'critica', q: '¿Por qué una foto de la pizarra explica su trabajo mejor que sus palabras?', r: 'Respuesta abierta: se valora que reconozca que la cifra acumulada muestra de golpe un esfuerzo largo.',
          o: ['Porque a nadie le interesa lo que él diga.', 'Porque la cifra acumulada muestra de un golpe meses de trabajo.', 'Porque las fotos siempre convencen más.'], c: 1 },
      ] },
  ],

  /* ════════ 9º GRADO (170–200 palabras · 1 literal, 2 inferenciales, 2 críticas) ════════ */
  9: [
    { id: 'LN9-01', titulo: 'Un millón no es lo que parece', genero: 'argumentativo',
      texto: 'Decimos «un millón» con la misma facilidad con la que decimos «mil», y ahí empieza el problema: la boca los pronuncia parecido y la cabeza los guarda parecido, pero no se parecen en nada. Un millón es mil veces mil. Si alguien contara un número por segundo, sin dormir ni parar, tardaría 1,000 segundos en llegar a mil, es decir unos diecisiete minutos. Para llegar a un millón necesitaría 1,000,000 de segundos: once días y medio contando sin parar. La diferencia entre diecisiete minutos y once días es la que hay entre los dos números, y esa diferencia no se oye al pronunciarlos. Por eso conviene desconfiar de uno mismo cuando aparece un número grande en una noticia, en una promesa o en un presupuesto. La reacción normal —«suena a mucho»— no distingue entre 200,000 y 2,000,000, y son diez veces distintos. Entre 150,000 y 1,500,000 va la misma distancia. Un truco sencillo lo arregla: traducir la cifra a algo que uno haya vivido. Días, pasos, canchas, salones de clase. Cualquier cosa, con tal de que se pueda imaginar.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto tardaría alguien en contar hasta un millón, un número por segundo?', r: 'Once días y medio.',
          o: ['Diecisiete minutos.', 'Once días y medio.', 'Un año.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el texto dice que «la boca los pronuncia parecido»?', r: 'Porque «mil» y «millón» suenan casi igual y eso hace que se sientan parecidos aunque no lo sean.',
          o: ['Porque se escriben con las mismas letras.', 'Porque «mil» y «millón» suenan casi igual y por eso se sienten parecidos.', 'Porque la gente habla muy rápido.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué compara diecisiete minutos con once días en vez de solo dar los números?', r: 'Porque el tiempo vivido sí se puede imaginar, y así la diferencia deja de ser abstracta.',
          o: ['Porque el tiempo vivido sí se imagina y la diferencia deja de ser abstracta.', 'Porque contar es más fácil que multiplicar.', 'Porque quería alargar el texto.'], c: 0 },
        { tipo: 'critica', q: '¿Deberían las noticias traducir las cifras grandes a algo imaginable? Argumenta.', r: 'Respuesta abierta: se valora que pese la claridad que se gana frente al riesgo de que la comparación manipule.',
          o: ['No: el dato exacto basta y la comparación solo estorba.', 'Sí, y con cuidado: la comparación aclara, pero también puede empujar a una conclusión.', 'Da igual: nadie lee las cifras de todos modos.'], c: 1 },
        { tipo: 'critica', q: '«Conviene desconfiar de uno mismo ante un número grande.» ¿Te parece exagerado?', r: 'Respuesta abierta: se valora que reconozca el límite de la intuición sin caer en desconfiar de todo.',
          o: ['Exagerado: la intuición funciona bien con los números.', 'Es una tontería: los números no engañan.', 'No es exagerado: la intuición no distingue 200,000 de 2,000,000, y eso es comprobable.'], c: 2 },
      ] },

    { id: 'LN9-02', titulo: 'El cartel que nadie leyó bien', genero: 'narrativo',
      texto: 'En la entrada del pueblo pusieron un cartel con el costo de la carretera nueva: 12,400,000 lempiras. Durante meses la gente pasó por debajo sin comentarlo. Una tarde, una señora se paró y preguntó en voz alta cuántos ceros tenía eso. Un muchacho le contestó que seis. Ella dijo que entonces eran doce millones y pico, y siguió su camino. Esa pregunta hizo más que el cartel entero. En la semana siguiente, en la pulpería, en la parada del bus y en la reunión de padres, la cifra empezó a compararse con cosas conocidas: con lo que cuesta un aula, con lo que cuesta un pozo, con lo que gana un albañil en un año. En la reunión salió el desglose: 4,800,000 en terracería, 5,200,000 en pavimento, 1,900,000 en puentes y 500,000 en señalización. Nadie discutió si la obra valía la pena hasta que la cifra se volvió imaginable. Un número escrito en un cartel no informa a nadie por el hecho de estar escrito. Informa cuando alguien lo lee en voz alta, lo separa en grupos de tres y lo compara con algo suyo.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto costaba la carretera según el cartel?', r: '12,400,000 lempiras.',
          o: ['12,400,000 lempiras.', '1,240,000 lempiras.', '124,000 lempiras.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué la pregunta de la señora «hizo más que el cartel entero»?', r: 'Porque obligó a leer la cifra de verdad y a partir de ahí la gente empezó a discutirla.',
          o: ['Porque la señora era conocida en el pueblo.', 'Porque obligó a leer la cifra de verdad y ahí empezó la discusión.', 'Porque el cartel estaba mal escrito.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué papel juegan los grupos de tres cifras en lo que cuenta el texto?', r: 'Separar en grupos de tres es lo que permite nombrar la cantidad y entender de qué tamaño es.',
          o: ['Sirven para que el cartel se vea más ordenado.', 'No tienen ningún papel en la historia.', 'Separar de tres en tres es lo que permite nombrar la cantidad y saber su tamaño.'], c: 2 },
        { tipo: 'critica', q: '¿De quién es la responsabilidad de que una cifra pública se entienda? Justifica el reparto.', r: 'Respuesta abierta: se valora que reparta la responsabilidad entre quien publica y quien lee.',
          o: ['Solo de quien lee: si no entiende, que pregunte.', 'Solo de quien publica: debería explicarlo todo.', 'De los dos: quien publica debe hacerla legible y quien lee debe detenerse a leerla.'], c: 2 },
        { tipo: 'critica', q: '¿Comparar un gasto público con «lo que gana un albañil en un año» ayuda o distorsiona?', r: 'Respuesta abierta: se valora que reconozca el poder aclaratorio de la comparación y también su carga.',
          o: ['Ayuda a imaginarlo, aunque hay que cuidar que la comparación no empuje sola la conclusión.', 'Distorsiona siempre: son cosas que no se comparan.', 'Ni ayuda ni distorsiona: es un adorno.'], c: 0 },
      ] },

    { id: 'LN9-03', titulo: 'Contar lo que no se deja contar', genero: 'expositivo',
      texto: 'Hay cantidades que no se pueden contar de una en una y sin embargo se conocen con bastante precisión. Los granos de arroz de un saco, las hormigas de un hormiguero, las gotas de una lluvia sobre un techo. El método es siempre el mismo y tiene dos pasos: medir bien una parte pequeña y averiguar cuántas partes como esa hay. Si en 10 gramos de arroz hay 500 granos, en un saco de 100 libras —que son unos cuarenta y cinco mil gramos— habrá alrededor de 2,250,000 granos. Un saco de 50 libras daría 1,125,000; uno de 25, unos 562,500; una libra sola, 22,500, y una taza, 4,500. El número asusta, pero no salió de la imaginación: salió de contar 500. Lo delicado del método no es la multiplicación, que la hace cualquiera. Lo delicado es la primera parte: que los 10 gramos que se midieron se parezcan de verdad al resto del saco. Si se toman del fondo, donde se acumulan los granos partidos, el resultado se va a inflar. Por eso, en cualquier estimación seria, la pregunta importante nunca es «¿cuánto dio?», sino «¿de dónde salió la muestra?».',
      preguntas: [
        { tipo: 'literal', q: '¿Cuántos granos hay en 10 gramos de arroz, según el ejemplo?', r: '500.',
          o: ['45,000.', '500.', '2,250,000.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué el número final «no salió de la imaginación»?', r: 'Porque procede de un conteo real de una parte, multiplicado por las veces que esa parte cabe en el total.',
          o: ['Porque lo dijo un experto.', 'Porque los sacos vienen marcados de fábrica.', 'Porque procede de contar una parte de verdad y multiplicarla.'], c: 2 },
        { tipo: 'inferencial', q: '¿Por qué tomar la muestra del fondo del saco inflaría el resultado?', r: 'Porque ahí se acumulan los granos partidos y en el mismo peso caben más granos que en el resto.',
          o: ['Porque ahí se acumulan los granos partidos y en el mismo peso caben más.', 'Porque el fondo pesa más.', 'Porque el arroz del fondo es de otra clase.'], c: 0 },
        { tipo: 'critica', q: '«La pregunta importante no es cuánto dio, sino de dónde salió la muestra.» ¿Estás de acuerdo?', r: 'Respuesta abierta: se valora que reconozca que el resultado no vale más que el método que lo produjo.',
          o: ['En desacuerdo: lo que importa es el resultado final.', 'De acuerdo: un resultado no vale más que la muestra de la que salió.', 'No se puede saber sin ver el saco.'], c: 1 },
        { tipo: 'critica', q: '¿Qué le preguntarías a alguien que te dice una cifra enorme sin explicar cómo la obtuvo?', r: 'Respuesta abierta: se valora que formule una pregunta sobre el método, la muestra o la fuente.',
          o: ['Nada: si la dice, por algo será.', 'Le pediría un número todavía más grande para comparar.', 'Le preguntaría cómo la midió y sobre qué parte hizo la cuenta.'], c: 2 },
      ] },

    { id: 'LN9-04', titulo: 'El presupuesto en el pizarrón', genero: 'crónica',
      texto: 'La directora hizo algo que en esa escuela no se había hecho nunca: escribió el presupuesto completo en el pizarrón, delante de los padres. Arriba puso lo que entraba en el año, 340,000 lempiras. Debajo fue anotando lo que salía: noventa y seis mil en servicios, 72,500 en materiales, 48,000 en mantenimiento, 61,000 en el bono de los que apoyan. Sumó y quedaron 22,500 sin asignar. El año anterior habían entrado 298,000 y nadie supo nunca en qué se fueron. Entonces preguntó en qué se gastaban. La reunión duró cuatro horas. Se discutió si convenía comprar 2,000 hojas o arreglar dos ventanas; si el dinero alcanzaba para todo o solo para una cosa. Nadie se levantó antes de tiempo. Al final la decisión no fue lo importante. Lo importante lo dijo un padre a la salida: que en veinte años de llevar hijos a esa escuela era la primera vez que veía de dónde salía y a dónde iba el dinero. Un número compartido convierte a un espectador en alguien que decide.',
      preguntas: [
        { tipo: 'literal', q: '¿Cuánto entraba al año en el presupuesto de la escuela?', r: '340,000 lempiras.',
          o: ['340,000 lempiras.', '96,000 lempiras.', '22,500 lempiras.'], c: 0 },
        { tipo: 'inferencial', q: '¿Cómo se llegó a los 22,500 sin asignar?', r: 'Restando de los 340,000 que entraban todo lo que ya estaba gastado.',
          o: ['Sumando los gastos de servicios y materiales.', 'Restando de los 340,000 todo lo ya gastado.', 'Era lo que sobró del año anterior.'], c: 1 },
        { tipo: 'inferencial', q: '¿Por qué la reunión duró cuatro horas y nadie se levantó antes?', r: 'Porque por primera vez estaban decidiendo sobre algo concreto y sabían de cuánto disponían.',
          o: ['Porque la directora no los dejaba salir.', 'Porque el pizarrón estaba difícil de leer.', 'Porque por primera vez decidían sobre algo concreto y sabían cuánto había.'], c: 2 },
        { tipo: 'critica', q: '«Un número compartido convierte a un espectador en alguien que decide.» ¿Lo compartes?', r: 'Respuesta abierta: se valora que relacione el acceso a la información con la posibilidad de participar.',
          o: ['Sí: sin conocer las cifras solo se puede opinar a ciegas.', 'No: la gente opina igual sepa o no sepa.', 'No tiene relación una cosa con la otra.'], c: 0 },
        { tipo: 'critica', q: '¿Debería toda escuela poner su presupuesto a la vista? ¿Qué se gana y qué se arriesga?', r: 'Respuesta abierta: se valora que reconozca la ganancia en confianza y también las tensiones que puede abrir.',
          o: ['No: solo traería discusiones y desconfianza.', 'Sí sin más: no hay nada que perder.', 'Sí: se gana confianza y participación, aunque abra discusiones que hay que saber conducir.'], c: 2 },
      ] },

    { id: 'LN9-05', titulo: 'Grande no es lo mismo que muchos', genero: 'argumentativo',
      texto: 'Hay una confusión que se repite en las conversaciones y también en los periódicos: tratar «un número grande» y «muchos» como si fueran la misma cosa. No lo son. Un número grande es una cantidad; «muchos» es una comparación, y una comparación necesita siempre un contra qué. Si alguien dice que una campaña recogió 150,000 lempiras, todavía no sabemos nada. ¿Frente a los veinte mil del año pasado? Entonces es una barbaridad. ¿Frente a los 3,000,000 que hacían falta? Entonces es apenas un arranque. La cifra es la misma en los dos casos y el juicio es opuesto. Lo mismo pasa con 45,000 firmas, con 8,300 viviendas o con 620,000 árboles. De ahí sale una costumbre que vale la pena adoptar: cada vez que aparezca una cantidad, buscar el número que le sirve de referencia. A veces está en el mismo párrafo. A veces está escondido a propósito, y esa ausencia también informa. Quien da una cifra sin referencia no siempre miente, pero está pidiendo que uno se impresione en vez de que uno entienda.',
      preguntas: [
        { tipo: 'literal', q: '¿Qué necesita siempre una comparación, según el texto?', r: 'Un contra qué: un número de referencia.',
          o: ['Un número de referencia contra el cual comparar.', 'Un número más grande.', 'Una opinión.'], c: 0 },
        { tipo: 'inferencial', q: '¿Por qué 150,000 lempiras puede ser «una barbaridad» y «apenas un arranque»?', r: 'Porque el juicio depende de con qué se compare, no de la cifra en sí.',
          o: ['Porque el valor del dinero cambia.', 'Porque el juicio depende de con qué se compare, no de la cifra.', 'Porque a veces se cuenta mal.'], c: 1 },
        { tipo: 'inferencial', q: '¿Qué quiere decir que «esa ausencia también informa»?', r: 'Que si falta la referencia puede ser a propósito, y notarlo ya dice algo de quien da la cifra.',
          o: ['Que hay que buscarla en otro periódico.', 'Que el dato está incompleto por error.', 'Que si falta puede ser a propósito, y notarlo ya dice algo.'], c: 2 },
        { tipo: 'critica', q: '¿Es justo decir que quien da una cifra sin referencia «pide que uno se impresione»? Argumenta.', r: 'Respuesta abierta: se valora que distinga entre omisión intencionada y descuido, sin absolver ni condenar en bloque.',
          o: ['Es justo siempre: nadie omite una referencia por casualidad.', 'Es injusto: muchas veces es descuido, aunque el efecto sobre el lector sea el mismo.', 'No se puede opinar sobre intenciones.'], c: 1 },
        { tipo: 'critica', q: '¿Qué referencia pedirías tú ante una cifra de tu escuela o tu comunidad? Da un ejemplo.', r: 'Respuesta abierta: se valora que proponga una referencia concreta y explique qué permitiría entender.',
          o: ['Ninguna: con la cifra basta.', 'Pediría otra cifra todavía más grande.', 'Pediría con qué comparar: el año anterior, lo que hacía falta o lo que gastan otros.'], c: 2 },
      ] },
  ],
};

/* ══════════════════════════════════════════════════════════════
   🛠️ EL TALLER DE ESTA MISIÓN

   El motor (js/tools/lectura-mision.js) no sabe de números: ofrece
   formas de actividad y aquí se dice cuáles usa esta misión y con qué
   datos. Las cuatro son, en orden:

   1. las cinco preguntas del texto;
   2. cazar los números grandes sobre lo que acaba de leer — y los que
      no llegan a mil no cuentan, que es lo que obliga a mirar;
   3. leer el número: pasarlo de palabras a cifras, de cifras a
      palabras y decir cuánto vale cada posición;
   4. ordenarlos de menor a mayor, mezclando los que están en cifras
      con los que están en palabras: comparar obliga a leer primero.

   Todo sale del texto, calculado por js/data/lectura-numerales.js. No
   hay ni un número escrito a mano en este taller: si lo hubiera, el
   día que se corrija una lectura el ejercicio quedaría mintiendo.
══════════════════════════════════════════════════════════════ */
const LECTURA_NUMEROS_TALLER = (function () {
  'use strict';
  /* En el navegador el lector ya está cargado: el HTML lo pone antes que
     este archivo. Las herramientas de _dev, en cambio, cargan este archivo
     sin navegador y solo para leer las lecturas, así que se tolera que
     falte — nunca llaman al taller. */
  var N = (typeof LECTURA_NUMERALES !== 'undefined') ? LECTURA_NUMERALES : null;
  var GRANDE = 1000;

  function nums(u) { return N.detectar(u.ps); }
  function grandes(u) { return nums(u).filter(function (x) { return x.v >= GRANDE; }); }
  /* Cómo aparece el número en ESTE texto: si venía en palabras se
     muestra en palabras. Así la ficha que el alumno ordena es la misma
     que acaba de leer en voz alta. */
  function rotulo(x) { return x.forma === 'palabras' ? N.enPalabras(x.v) : N.enCifras(x.v); }

  /* Dos valores equivocados pero creíbles. No son al azar: son los dos
     errores que de verdad comete quien está aprendiendo. El primero es
     escribir por partes («cuarenta y dos mil» + «trescientos» pegados);
     el segundo, correr una posición de más o de menos. */
  function distractores(v) {
    var miles = Math.floor(v / 1000), resto = v % 1000, out = [];
    if (resto > 0) out.push(Number(String(miles) + '0' + String(resto).padStart(3, '0')));
    else out.push(v * 10);
    out.push(v >= 10000 ? Math.floor(v / 10) : v * 10);
    var vistos = {}; vistos[v] = 1;
    return out.filter(function (d) {
      if (!d || d === v || vistos[d]) return false;
      vistos[d] = 1; return true;
    }).concat([v * 100, Math.floor(v / 100), v + 9000]).filter(function (d) {
      if (!d || d === v || vistos[d]) return false;
      vistos[d] = 1; return true;
    }).slice(0, 2);
  }

  return [

    { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?', forma: 'comprension' },

    { id: 'caza', icono: '🎯', titulo: 'Caza de números grandes', forma: 'cazar', meta: 10,
      instruccion: function (t, u, info) {
        return 'En esta lectura hay <strong>' + info.total + ' números mayores que mil</strong>. Encuentra ' +
          '<strong>al menos ' + info.meta + '</strong> y tócalos. Ojo: valen los que están en cifras <em>y</em> los que ' +
          'están escritos con palabras. Los que no llegan a mil no cuentan.';
      },
      objetivos: function (t, u) {
        return grandes(u).map(function (x) { return { ini: x.ini, fin: x.fin, clase: 'a' }; });
      },
      /* En el papel no se toca: se encierra, sobre el texto de la hoja. */
      enPapel: function (t, u, info) {
        return 'En esta lectura hay <strong>' + info.total + ' números mayores que mil</strong>. <strong>Encierra al ' +
          'menos ' + info.meta + '</strong> en el texto de arriba. Ojo: valen los que están en cifras <em>y</em> los ' +
          'que están escritos con palabras. Los que no llegan a mil no cuentan.';
      },
      /* Los pequeños no son un error: son números de verdad, solo que no
         son los que se buscan. Decírselo así le enseña la comparación en
         vez de castigarlo por haber leído bien. */
      neutros: function (t, u) {
        return nums(u).filter(function (x) { return x.v < GRANDE; }).map(function (x) {
          return { ini: x.ini, fin: x.fin,
            motivo: '<strong>' + N.enCifras(x.v) + '</strong> sí es un número, pero no llega a mil: aquí buscamos los ' +
              'que lo pasan. Un número mayor que mil tiene <strong>cuatro cifras o más</strong>.' };
        });
      },
      fallo: function (palabra, u) {
        return '❌ «' + u.esc(palabra) + '» no es un número. Busca cifras (como <strong>12,000</strong>) o cantidades ' +
          'escritas con palabras (como <strong>veintiocho mil</strong>).';
      } },

    { id: 'lee', icono: '🔢', titulo: 'Lee el número', forma: 'tresOpciones',
      pista: 'De palabras a cifras, de cifras a palabras y cuánto vale cada posición',
      items: function (t, u) {
        var lista = u.baraja(grandes(u).filter(function (x, i, a) {
          return a.findIndex(function (y) { return y.v === x.v; }) === i;   /* sin repetir valores */
        }));
        var items = [];
        lista.forEach(function (x) {
          if (items.length >= 4) return;
          var d = distractores(x.v);
          if (d.length < 2) return;
          if (x.forma === 'palabras') {
            /* Lo leyó en palabras: que lo escriba con cifras. */
            var ops = u.baraja([x.v].concat(d)).map(N.enCifras);
            items.push({
              enunciado: 'La lectura dice <strong>«' + u.esc(N.enPalabras(x.v)) + '»</strong>. ¿Cómo se escribe con cifras?',
              ops: ops, c: ops.indexOf(N.enCifras(x.v)),
              bien: 'Cada grupo de tres cifras se separa con una coma, y esa coma es la que marca los miles.',
              mal: 'Se escribe <strong>' + N.enCifras(x.v) + '</strong>. Fíjate en cuántos ceros pide cada parte antes de juntarlas.'
            });
          } else if (items.length % 2 === 0) {
            /* Lo leyó en cifras: que lo lea en voz alta. */
            var opsP = u.baraja([x.v].concat(d)).map(N.enPalabras);
            items.push({
              enunciado: 'La lectura dice <strong>' + N.enCifras(x.v) + '</strong>. ¿Cómo se lee en voz alta?',
              ops: opsP, c: opsP.indexOf(N.enPalabras(x.v)),
              bien: 'Se lee grupo por grupo, y cada grupo de tres tiene su nombre: los miles primero.',
              mal: 'Se lee <strong>' + u.esc(N.enPalabras(x.v)) + '</strong>. Separa el número de tres en tres y lee cada grupo.'
            });
          } else {
            /* Valor posicional sobre un número que acaba de leer. */
            var cif = N.cifrasDe(x.v);
            var c = cif[Math.floor(u.rnd() * cif.length)];
            var opsV = u.baraja([c.vale, c.digito * Math.pow(10, c.pos + 1),
              c.pos > 0 ? c.digito * Math.pow(10, c.pos - 1) : c.digito * Math.pow(10, c.pos + 2)]).map(N.enCifras);
            items.push({
              enunciado: 'En <strong>' + N.enCifras(x.v) + '</strong>, ¿cuánto vale el <strong>' + c.digito + '</strong>?',
              ops: opsV, c: opsV.indexOf(N.enCifras(c.vale)),
              bien: 'Ese ' + c.digito + ' está en las <strong>' + N.nombrePosicion(c.pos) + '</strong>, así que vale ' + N.enCifras(c.vale) + '.',
              mal: 'Vale <strong>' + N.enCifras(c.vale) + '</strong>: está en las <strong>' + N.nombrePosicion(c.pos) +
                '</strong>. Una cifra no vale lo mismo según el lugar que ocupe.'
            });
          }
        });
        return items;
      } },

    { id: 'ordena', icono: '📊', titulo: 'De menor a mayor', forma: 'ordenar',
      pista: 'Toca primero el más pequeño',
      items: function (t, u) {
        var vistos = {}, unicos = [];
        u.baraja(grandes(u)).forEach(function (x) {
          if (!vistos[x.v]) { vistos[x.v] = 1; unicos.push(x); }
        });
        var rondas = [];
        for (var i = 0; i + 3 <= unicos.length && rondas.length < 2; i += 3) {
          rondas.push({
            enunciado: 'Ordena estos tres números de la lectura, del más pequeño al más grande.',
            fichas: unicos.slice(i, i + 3).map(function (x) { return { txt: rotulo(x), v: x.v }; }),
            bien: 'Con la misma cantidad de cifras se compara la primera de la izquierda.',
            mal: 'Cuenta las cifras: el que tiene más cifras es mayor. Si tienen las mismas, gana el de la primera cifra más alta.'
          });
        }
        return rondas;
      } }
  ];
})();

/* La hoja de respuestas del final: el texto con todos sus números. */
const LECTURA_NUMEROS_RESUMEN = {
  titulo: '🔢 Todos los números de esta lectura',
  leyenda: [
    { clase: 'a', txt: 'pasa de mil', dice: 'cuatro cifras o más' },
    { clase: 'b', txt: 'no llega a mil', dice: 'tres cifras o menos' }
  ],
  intro: function (t, u, cuenta, marcar) {
    var mayor = marcar.reduce(function (m, x) { return x.v > m ? x.v : m; }, 0);
    return 'En un solo texto había <strong>' + cuenta.a + ' números mayores que mil</strong> y <strong>' + cuenta.b +
      '</strong> más pequeños. El mayor de todos es <strong>' + LECTURA_NUMERALES.enCifras(mayor) + '</strong>, que se lee ' +
      '«' + LECTURA_NUMERALES.enPalabras(mayor) + '».';
  },
  marcar: function (t, u) {
    return LECTURA_NUMERALES.detectar(u.ps).map(function (x) {
      return { ini: x.ini, fin: x.fin, clase: x.v >= 1000 ? 'a' : 'b', v: x.v };
    });
  }
};
