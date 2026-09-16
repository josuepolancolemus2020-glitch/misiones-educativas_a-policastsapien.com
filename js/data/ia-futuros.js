/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Los escenarios por venir
   ───────────────────────────────────────────────────────────────────────────
   La etapa 7 de la Ruta de la Máquina que Aprende (misión 78) lo PINTA de
   aquí, y su ficha impresa dice lo mismo porque `_dev/verifica-ia.js` compara
   las dos.

   ⚠️ LA REGLA QUE GOBIERNA ESTE ARCHIVO ENTERO, Y NO SE NEGOCIA:
   **aquí no se predice nada.** La currícula de esta materia prohíbe afirmar
   lo que la Inteligencia Artificial «va a hacer», y este archivo no lo hace:
   lo que hay son situaciones INVENTADAS, declaradas como inventadas en la
   pantalla y en el papel, armadas con cosas que **ya se pueden hacer hoy** y
   terminadas en una decisión que el alumno tiene que tomar.

   La diferencia que enseña esta etapa, y de la que sale todo lo demás:

     · una PROFECÍA dice lo que va a pasar, no se puede incumplir y no pide
       nada de quien la oye;
     · un ESCENARIO dice qué harías vos si pasara, se puede discutir entero
       y se desarma en cuanto una de sus cuatro piezas falla.

   De ahí salen cuatro decisiones que hay que respetar al añadir algo:

   1. ⚠️ **NINGÚN ESCENARIO SE APOYA EN ALGO QUE NO EXISTA HOY.** Cada uno
      declara en `apoya` de qué capacidades está hecho, y esas capacidades
      son las que el alumno PRODUJO en las etapas anteriores — no las que
      alguien le contó—. Un escenario apoyado en algo que no se puede hacer
      no es un escenario: es ciencia ficción, y enseña a esperar en vez de a
      decidir. La sonda comprueba que toda clave de `apoya` exista.
   2. ⚠️ **NI UNA FECHA DE LO QUE VA A PASAR.** No hay años, no hay plazos y
      no hay «para 2035»: ponerle fecha a lo inventado es exactamente la
      profecía que esta misión enseña a reconocer. Lo único fechado es
      `IA_FUT_FECHA`, que dice cuándo se escribió esto.
   3. **Persona con nombre y precio que se pueda contar**, como la normativa
      del relato. «La gente» no es nadie y «es importante» no es un precio.
   4. **Tres decisiones con su consecuencia, y ninguna es la buena.** Hay
      consecuencias, no respuestas correctas: el alumno escribe su regla.

   Y la etapa 4 ya trae cuatro escenarios (`IA_ESCENARIOS`, en
   `ia-descubre.js`). Aquellos son para ELEGIR; estos son para tomarlos en
   pedazos y ARMAR el propio, que es lo que esta etapa añade. El del examen
   que se califica solo NO se repite aquí: está allá, y esta misión lo manda
   a leer.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Cuándo se escribió esto. Se enseña siempre: un escenario de hace tres años
   se lee distinto —y ese es justamente el ejercicio de la última tarjeta—. */
const IA_FUT_FECHA = '16 de septiembre de 2026';

/* ── Con qué está hecho: lo que YA se puede hacer ──────────────────────────
   Seis capacidades, y ninguna se afirma de oídas: de cada una se dice EN QUÉ
   ETAPA el alumno la produjo con sus manos. Esa columna es la que convierte
   «dicen que la IA puede…» en «esto lo hiciste vos». */
const IA_CAPACIDADES = [
  { k: 'parecido', e: '🍎', etapa: 1, que: 'Ponerle nombre a algo por el parecido con los ejemplos que vio',
    donde: 'Lo hiciste en «Enséñale a la máquina»: le enseñaste frutas y le puso nombre a la siguiente.',
    uso: 'para clasificar sin preguntarle a nadie',
    falla: 'se equivoca con lo raro, con lo que no estaba en los ejemplos',
    contra: 'quien menos se parece a los ejemplos que le dieron' },
  { k: 'cara', e: '👤', etapa: 1, que: 'Reconocer una cara comparándola con las que tiene guardadas',
    donde: 'Es el mismo parecido de la etapa 1, con caras en vez de frutas.',
    uso: 'para saber quién es quién sin preguntarle el nombre',
    falla: 'confunde a dos personas parecidas',
    contra: 'el que se parece a otro y no se enteró nunca' },
  { k: 'predice', e: '📈', etapa: 2, que: 'Predecir lo que va a pasar con los datos que alguien midió',
    donde: 'Lo mediste en «¿Cuántos ejemplos hacen falta?»: con un ejemplo acierta la mitad; con veinte, casi siempre.',
    uso: 'para decidir antes de que pase',
    falla: 'no tiene con qué acertar donde nadie midió',
    contra: 'el que vive justo donde no se tomaron datos' },
  { k: 'texto', e: '💬', etapa: 4, que: 'Escribir un texto que suena seguro y a veces inventa el dato',
    donde: 'Lo viste nacer en el predictor: la continuación más probable era «cinco estrofas», y son siete.',
    uso: 'para escribir lo que alguien va a leer',
    falla: 'inventa con la misma seguridad con que acierta',
    contra: 'el que lo leyó sin comprobarlo' },
  { k: 'voz', e: '🎙️', etapa: 5, que: 'Fabricar una voz con unos segundos de audio',
    donde: 'Lo armaste en «¿Cuánto hace falta para una estafa?»: las piezas salieron de lo que la propia familia publicó.',
    uso: 'para hablar con la voz de otra persona',
    falla: 'no falla, funciona — y por eso una voz dejó de ser una prueba',
    contra: 'el que decide por lo que oye' },
  { k: 'refuerzo', e: '🎮', etapa: 2, que: 'Mejorar a fuerza de intentos, sin que nadie le diga cómo',
    donde: 'Lo viste en el juego del Refuerzo: el suelo se fue levantando hasta quedar una rampa.',
    uso: 'para encontrar sola la forma de ganar',
    falla: 'aprende a ganar el juego que le pusiste, no el que vos querías',
    contra: 'el que escribió el premio sin pensarlo dos veces' },
];

/* ── Las cuatro piezas de un escenario ─────────────────────────────────────
   Es la prueba que separa un escenario de una profecía, y la que el alumno
   le aplica a lo suyo en el taller. Las cuatro se pueden comprobar; por eso
   son estas cuatro y no una lista de buenas intenciones. */
const IA_FUT_PIEZAS = [
  { k: 'hoy', e: '🔧', nombre: 'Está hecho con algo que YA se puede hacer',
    si: 'Se apoya en una capacidad que existe, y que vos produjiste en una etapa anterior.',
    no: 'Se apoya en algo que todavía no se puede hacer.',
    porque: 'Un escenario sirve para decidir; para decidir tiene que poder pasar. Lo demás es ciencia ficción, que está bien para otra cosa.' },
  { k: 'quien', e: '🧑', nombre: 'Le pasa a alguien con nombre',
    si: 'Hay una persona concreta, con su nombre.',
    no: 'Le pasa a «la gente», «todos» o «la sociedad».',
    porque: 'A «la gente» no le pasa nada. Sin una persona no hay quién decida ni a quién le duela, y lo que queda es un titular.' },
  { k: 'precio', e: '💸', nombre: 'Lo que cuesta se puede contar',
    si: 'Se puede decir en días, en lempiras, en clases, en cosechas o en nombres.',
    no: 'Dice «es grave», «es peligroso» o «es importante».',
    porque: 'Un precio que se cuenta se puede comparar con lo que cuesta evitarlo. «Es grave» no se compara con nada.' },
  { k: 'decide', e: '🔀', nombre: 'Termina en una decisión, no en un anuncio',
    si: 'Acaba en una pregunta: ¿qué hago yo si esto pasa?',
    no: 'Acaba contando lo que va a pasar.',
    porque: 'Ahí está la diferencia entera. Una profecía te deja mirando; un escenario te deja algo que hacer el día que llegue, si llega.' },
];

/* ── Los nueve escenarios ──────────────────────────────────────────────────
   Todos inventados, todos apoyados en capacidades de arriba, todos con su
   persona, su precio contable, sus tres decisiones y su regla. Y ninguno
   trae una fecha de cuándo pasaría: eso sería la profecía. */
const IA_FUTUROS = [
  { k: 'maestro', e: '🏫', titulo: 'El maestro que no está', quien: 'la profesora Delmy', ciclo: 'III Ciclo',
    apoya: ['texto', 'parecido'],
    cuesta: 'las tres horas diarias que ella daba de clase, y lo que aprendan sus 43 alumnos ese año',
    situacion: 'Imagina que a la escuela unidocente donde da clase la profesora Delmy le mandan un programa que «da la clase»: explica, pone ejercicios y los califica. A ella le dicen que ahora su trabajo es revisar.',
    ops: [
      { t: 'Dejar que el programa dé la clase entera y revisar al final del día.',
        pasa: 'El programa explicó bien la mayor parte, e inventó un dato en la lección de Sociales. Nadie lo comprobó hasta el examen, y 43 cuadernos tenían copiada la misma frase falsa. Revisar al final es revisar cuando ya se aprendió.' },
      { t: 'Usarlo para los ejercicios y explicar ella lo nuevo.',
        pasa: 'Lo que el programa hace bien —repetir un ejercicio cuarenta veces sin cansarse, y con un ejercicio distinto para cada uno— se lo queda él. Lo que hace mal —afirmar sin comprobar— no llega al cuaderno, porque lo nuevo lo explica quien puede responder preguntas.' },
      { t: 'Pedir por escrito qué hace el programa cuando no sabe algo.',
        pasa: 'Es la pregunta que casi nadie hace al comprar. Si la respuesta es «contesta igual», ya sabe que su trabajo no es revisar de vez en cuando: es revisar lo que el programa afirma, siempre.' },
    ],
    regla: 'Un programa puede repetir un ejercicio mil veces sin cansarse. No puede responder por lo que afirma: eso sigue siendo de una persona.' },

  { k: 'cosecha', e: '🌽', titulo: 'La cosecha que la máquina predijo', quien: 'don Chele', ciclo: 'II y III Ciclo',
    apoya: ['predice'],
    cuesta: 'media milpa y la semilla de la siembra siguiente',
    situacion: 'Imagina que a don Chele le llega al teléfono un programa que le dice cuándo sembrar. El programa aprendió con datos de lluvia de estaciones que están todas en el valle grande; en su ladera no hay ninguna. Le dice: sembrá esta semana.',
    ops: [
      { t: 'Sembrar esa semana: el programa sabe más que él.',
        pasa: 'En el valle llovió; en su ladera, dos semanas después. La mitad de la semilla no nació. El programa no mintió: predijo bien para donde tenía datos, y él no vive ahí.' },
      { t: 'Preguntarle al programa de dónde saca los datos.',
        pasa: 'Cuando el programa dice de dónde mide, don Chele ve que la estación más cercana está a cuarenta kilómetros y del otro lado del cerro. Con eso ya sabe cuánto creerle: para el valle, mucho; para su ladera, poco.' },
      { t: 'Apuntar él la lluvia de su ladera todo el año.',
        pasa: 'Es el trabajo aburrido que nadie quiere hacer y el único que arregla el problema de fondo. Un año de apuntes suyos vale más para su ladera que el programa entero, y además el programa mejora si se los dan.' },
    ],
    regla: 'Una predicción vale para donde midieron. Preguntá siempre dónde midieron.' },

  { k: 'abuelo', e: '📼', titulo: 'La voz del abuelo', quien: 'Wendy', ciclo: 'III Ciclo y Media',
    apoya: ['voz', 'texto'],
    cuesta: 'L 400 al mes, y algo que no se cuenta en lempiras',
    situacion: 'Imagina que a Wendy le ofrecen un servicio que «habla» con la voz de su abuelo, que murió el año pasado, hecho con los audios que él mandaba al grupo de la familia. Contesta como él, con sus dichos. Cuesta una cuota al mes.',
    ops: [
      { t: 'Pagarlo y hablar con él todas las noches.',
        pasa: 'Los primeros días consuela. Después Wendy nota algo que no puede quitarse: eso no recuerda nada, predice lo que su abuelo habría dicho. El día que le contesta una cosa que él nunca habría dicho, duele más que el silencio.' },
      { t: 'Usar los audios que ya tiene, sin pagar nada.',
        pasa: 'Los audios de verdad son pocos y se acaban. Y son suyos, dijeron lo que dijeron, y no cambian cada vez que los oye. Es menos y es cierto.' },
      { t: 'Preguntar quién se queda con la voz del abuelo.',
        pasa: 'Es la pregunta que no se hace, y es la que decide. La voz la fabricaron con audios de su familia; si el servicio cierra, o sube la cuota, o la usa para otra cosa, ya no depende de ella. Se pagó por algo que no se puede tener.' },
    ],
    regla: 'Una voz fabricada no recuerda: predice. Y conviene saber quién se queda con ella.' },

  { k: 'camaras', e: '📹', titulo: 'El pueblo con cámaras', quien: 'Elvin', ciclo: 'III Ciclo',
    apoya: ['cara'],
    cuesta: 'tres días detenido y el trabajo que perdió por no llegar',
    situacion: 'Imagina que la alcaldía pone cámaras que reconocen caras en el parque y en la entrada del mercado, «por seguridad». A Elvin lo paran porque el sistema dice que se parece a alguien buscado.',
    ops: [
      { t: 'Esperar a que se aclare: si no hizo nada, no le pasa nada.',
        pasa: 'Se aclaró, y tardó tres días. El sistema no acusó a Elvin: dijo que se parecía, y alguien lo tomó como si fuera una prueba. El error no fue de la máquina, fue de quien no le pidió una segunda comprobación.' },
      { t: 'Preguntar cuántas veces se equivoca y con quién.',
        pasa: 'Es la pregunta de la etapa 2, aplicada a caras. Si el sistema se entrenó con pocas fotos de gente como él, se equivoca más con gente como él — y eso no se ve en el porcentaje general, que sale altísimo.' },
      { t: 'Pedir en el cabildo que digan quién guarda las caras y por cuánto tiempo.',
        pasa: 'Es lo único que se puede pedir antes de que pase, y lo que casi nunca se pregunta. Una cara guardada no se cambia como una contraseña: si se filtra, se filtró para siempre.' },
    ],
    regla: 'Un parecido no es una identificación. Y una cara no se puede cambiar cuando se pierde.' },

  { k: 'ana', e: '🧾', titulo: 'El trabajo de Ana', quien: 'Ana', ciclo: 'III Ciclo y Media',
    apoya: ['texto', 'predice'],
    cuesta: 'tres años de estudio y la decisión de a qué dedicarse',
    situacion: 'Imagina que Ana quiere ser contadora y le dicen que no estudie eso, que el programa ya hace las cuentas. Ella se pone a mirar en qué se le va el día a la contadora del pueblo.',
    ops: [
      { t: 'Cambiar de carrera: si el programa hace las cuentas, no hay trabajo.',
        pasa: 'Ana cambió de idea por una frase que nadie comprobó. Al mirar el día de la contadora, las cuentas eran hora y media; el resto era decidir qué gasto entra dónde, discutir con el dueño y responder ante quien pregunte. Eso no lo estaba haciendo ningún programa.' },
      { t: 'Estudiarlo, y aprender a usar el programa mejor que nadie.',
        pasa: 'Le queda el trabajo entero menos la parte aburrida, y encima puede revisar lo que el programa propone — que es justamente para lo que la van a contratar cuando el programa se equivoque.' },
      { t: 'Partir el oficio en dos listas: lo que es cuenta y lo que es decisión.',
        pasa: 'Es el ejercicio que sirve para cualquier oficio, no solo para este. Lo que es cuenta lo hace mejor una máquina; lo que es decidir y responder por lo decidido, no. Y casi ningún oficio es solo cuenta.' },
    ],
    regla: 'Antes de descartar un oficio, partilo en cuentas y decisiones. Lo que se automatiza es la cuenta.' },

  { k: 'tarea', e: '📓', titulo: 'La tarea sin tarea', quien: 'Óscar', ciclo: 'III Ciclo',
    apoya: ['texto'],
    cuesta: 'lo que iba a aprender escribiendo, y no se nota hasta el examen',
    situacion: 'Imagina que el colegio de Óscar deja de mandar tareas escritas para la casa «porque las hace la máquina». En su lugar mandan a leer.',
    ops: [
      { t: 'Alegrarse: menos tarea.',
        pasa: 'El examen es escrito y se hace en el aula. Óscar llevaba meses sin escribir un párrafo entero, y escribir no es algo que se sepa o no se sepa: es algo que se agarra escribiendo. Se notó en la nota.' },
      { t: 'Pedir que la tarea se defienda en clase, en dos minutos.',
        pasa: 'Cambia la tarea, no la quita. Da igual quién la escribió si hay que explicarla de pie: el que la entendió la explica, y el que la copió, no. Es la misma regla del ensayo de la etapa 4.' },
      { t: 'Escribir primero él y usar el programa para que le señale los fallos.',
        pasa: 'El orden importa, y es el orden lo único que cambia. Escribir y después preguntar deja el trabajo suyo; preguntar y después copiar deja un texto que no puede defender.' },
    ],
    regla: 'Lo que se aprende escribiendo no se aprende leyendo lo que escribió otro. El orden es primero vos.' },

  { k: 'senal', e: '📴', titulo: 'El día sin señal', quien: 'doña Tere', ciclo: 'II y III Ciclo',
    apoya: ['texto', 'predice'],
    cuesta: 'tres días de pulpería sin saber qué cobrar ni qué pedir',
    situacion: 'Imagina que doña Tere lleva un año llevando la pulpería con un asistente del teléfono: le saca las cuentas, le dice qué pedir y le escribe los mensajes al proveedor. Se cae la señal en la aldea y no vuelve en tres días.',
    ops: [
      { t: 'Esperar a que vuelva la señal.',
        pasa: 'Tres días sin saber cuánto le deben ni cuánto pedir. Lo que se le olvidó en ese año no fueron las cuentas: fue tener el cuaderno al día, que es lo que hacía antes y dejó de hacer porque «ya lo llevaba el teléfono».' },
      { t: 'Sacar el cuaderno viejo y las cuentas a mano.',
        pasa: 'Le costó una tarde volver a agarrarlo y salió adelante. Las cuentas de una pulpería son sumas y restas: eso no se olvida, se oxida. Lo que sí se había perdido era el registro de lo fiado.' },
      { t: 'Dejar apuntado en papel lo que no puede perder, aunque use el teléfono.',
        pasa: 'Es lo aburrido y lo que salva: el teléfono para lo rápido, el papel para lo que tiene que sobrevivir a que se caiga la señal, se moje el aparato o se acabe el saldo. No es desconfiar de la herramienta: es no apostarlo todo a una.' },
    ],
    regla: 'Preguntate qué pasa el día que no esté. Lo que no se pueda hacer sin ella, se aprende igual.' },

  { k: 'salud', e: '🩺', titulo: 'La máquina en el centro de salud', quien: 'la enfermera Xiomara', ciclo: 'III Ciclo y Media',
    apoya: ['parecido', 'predice'],
    cuesta: 'un traslado de dos horas que no hacía falta, o uno que sí hacía falta y no se hizo',
    situacion: 'Imagina que al centro de salud donde trabaja Xiomara, donde hay médico dos días a la semana, le dan un programa que sugiere qué puede ser. Acierta casi siempre con lo común y se pierde con lo raro.',
    ops: [
      { t: 'Seguir siempre lo que dice el programa.',
        pasa: 'Con lo común va bien y ahorra tiempo. El día que llega lo raro —que es justo el día en que un traslado salva a alguien— el programa propone lo más parecido a lo que ya vio, y eso es lo peor que puede hacer con lo raro.' },
      { t: 'Usarlo como una segunda opinión, nunca como la primera.',
        pasa: 'Xiomara decide y después mira qué propone. Cuando coinciden, sigue. Cuando no coinciden, ahí es donde el programa sirve de verdad: la obliga a mirar dos veces, y decide ella.' },
      { t: 'Preguntar qué hace el programa cuando no está seguro.',
        pasa: 'Si contesta igual de seguro siempre, no sirve para lo raro y hay que saberlo antes. Si dice «no sé, traslade», vale mucho más, aunque se equivoque más veces.' },
    ],
    regla: 'Lo que más acierta con lo común es lo que peor se porta con lo raro. Y lo raro es lo que urge.' },

  { k: 'promesa', e: '⏳', titulo: 'La promesa que se cumplió (o no)', quien: 'Brayan', ciclo: 'III Ciclo y Media',
    apoya: ['texto'],
    cuesta: 'la matrícula que no hizo, y tres años de estudio',
    situacion: 'Imagina que Brayan está en el último año y se encuentra un cuaderno suyo de séptimo con una promesa apuntada: la que le hizo dejar la matrícula de computación. Ahí está, con la fecha en que la oyó.',
    ops: [
      { t: 'Reírse y pasar la página.',
        pasa: 'Es lo que hace casi todo el mundo, y por eso las promesas sin fecha siguen funcionando: nadie vuelve a mirarlas. La que dejó a Brayan sin matrícula sigue circulando igual de nueva.' },
      { t: 'Marcar qué se cumplió y qué no.',
        pasa: 'Algunas se cumplieron y otras no se acercaron. Con eso en la mano ya sabe algo que no se aprende de otra forma: quién acertó, en qué, y cuánto conviene creerle la próxima vez.' },
      { t: 'Apuntar la promesa de hoy, con la fecha de hoy.',
        pasa: 'Es lo mismo que hizo con la cápsula de la etapa anterior, y es lo único honesto que se puede hacer con una promesa sin plazo: ponerle vos la fecha del examen. El tiempo es el único que no se equivoca.' },
    ],
    regla: 'A una promesa sin fecha, ponele vos la fecha. Y volvé a mirarla, que es la parte que nadie hace.' },
];

/* ── ⚖️ En manos de quién ──────────────────────────────────────────────────
   La segunda actividad, y la lección que de verdad trae esta etapa: lo que
   decide si un escenario acaba bien o mal NO es la máquina. Es a cuánta
   gente alcanza la decisión y si alguien puede revisarla antes de que valga.

   Por eso el final se CALCULA con estos tres datos y no se escribe uno por
   uno: con la lista escrita a mano, cambiar una capacidad obligaría a
   reescribir veinticuatro finales y alguno se quedaría diciendo lo de antes
   —que es la avería que este repositorio ya conoce—. */
const IA_FUT_MANOS = [
  { k: 'familia', e: '🏠', quien: 'una familia', alcanceN: 1,
    alcance: 'una casa',
    decide: 'a quién le abre la puerta y a quién le manda dinero',
    revisor: 'la propia familia, llamando de vuelta al número de siempre',
    cuesta: 'dos minutos',
    todo: true },
  { k: 'escuela', e: '🏫', quien: 'la escuela', alcanceN: 43,
    alcance: 'un aula de 43',
    decide: 'una nota, una matrícula y quién entra al aula',
    revisor: 'el maestro, antes de que la nota valga',
    cuesta: 'una tarde por bimestre',
    todo: true },
  { k: 'alcaldia', e: '🏛️', quien: 'la alcaldía', alcanceN: 4000,
    alcance: 'el pueblo entero',
    decide: 'una multa, un permiso y a quién se para en la calle',
    revisor: 'una persona de la alcaldía, cuando alguien reclama',
    cuesta: 'lo que tarde el reclamo, y el reclamo lo pone quien puede',
    todo: false, revisarTodo: 'nadie puede mirar una por una las decisiones de un pueblo entero' },
  { k: 'empresa', e: '🏢', quien: 'una empresa que lo vende', alcanceN: 100000,
    alcance: 'todas las escuelas y alcaldías que lo compren',
    decide: 'lo mismo que los de arriba, en todas a la vez',
    revisor: 'nadie por dentro: lo tiene que exigir quien lo compra, por escrito y antes de comprarlo',
    cuesta: 'una cláusula en el contrato, que es gratis si se escribe a tiempo y carísima después',
    todo: false, revisarTodo: 'nadie mira una por una las decisiones de todas las escuelas que lo compraron' },
];

/* Qué pasa con esa capacidad, en esas manos, con revisión o sin ella.
   No hay tabla: se compone de los datos de arriba, así que una capacidad
   nueva trae sus ocho finales sin escribir ninguno. */
/* «a el» no existe en castellano y la frase se compone sola: sin esto la
   pantalla escribe «le cae a el que se parece a otro», que es lo que pasa
   cuando un texto se arma juntando trozos y nadie lo lee en voz alta. */
function iaFutAl(t) { return /^el\s/.test(t) ? 'al ' + t.slice(3) : 'a ' + t; }

function iaFutFinal(capK, manoK, revisa) {
  const c = IA_CAPACIDADES.find(x => x.k === capK);
  const m = IA_FUT_MANOS.find(x => x.k === manoK);
  if (!c || !m) return null;
  const usa = m.quien.charAt(0).toUpperCase() + m.quien.slice(1) + ' lo usa ' + c.uso + '. Decide ' + m.decide + '.';
  if (!revisa) {
    return {
      cap: c, mano: m, revisa: false, alcance: m.alcanceN,
      titulo: 'Sin revisión',
      usa,
      pasa: 'Cuando ' + c.falla + ', la decisión se toma igual y ya vale. El fallo alcanza ' + iaFutAl(m.alcance) + ', y le cae ' + iaFutAl(c.contra) + '.',
      cuesta: 'Lo que cuesta se multiplica por a cuánta gente alcanza: aquí, ' + m.alcance + '.',
      aviso: '',
    };
  }
  return {
    cap: c, mano: m, revisa: true, alcance: m.alcanceN,
    titulo: 'Con revisión',
    usa,
    pasa: 'Cuando ' + c.falla + ', la decisión NO vale todavía: la mira ' + m.revisor + '. El fallo se ve antes de ejecutarse.',
    cuesta: 'Revisar cuesta ' + m.cuesta + '. No sale gratis, y por eso hay que decidir antes qué se revisa.',
    aviso: m.todo ? ''
      : 'Y acá no se puede revisar todo: ' + m.revisarTodo + '. Lo que se revisa es lo que decide algo grave, y eso hay que escribirlo ANTES de comprar el programa, no cuando ya falló.',
  };
}

/* ── 🔮 El taller: la prueba de las cuatro piezas ──────────────────────────
   El alumno arma SU escenario y la pantalla lo juzga por la forma, nunca por
   el tema: elegir de qué está hecho, nombrar a alguien, contar el precio y
   terminar en una pregunta. Todo lo que juzga se puede comprobar; lo que no
   se puede comprobar —si vale la pena— lo decide él, y la pantalla lo dice. */
const IA_FUT_GENERICOS = ['la gente', 'gente', 'alguien', 'todos', 'todas', 'nadie', 'uno', 'la sociedad',
  'las personas', 'la humanidad', 'el mundo', 'el pueblo', 'la familia', 'un niño', 'una niña',
  'los niños', 'un maestro', 'una maestra', 'los maestros', 'el agricultor', 'un alumno', 'los alumnos'];
const IA_FUT_CONTABLES = ['lempira', 'lempiras', ' l ', 'día', 'días', 'hora', 'horas', 'semana', 'semanas',
  'mes', 'meses', 'año', 'años', 'minuto', 'minutos', 'clase', 'clases', 'alumno', 'alumnos', 'hoja', 'hojas',
  'cosecha', 'cosechas', 'matrícula', 'sueldo', 'almuerzo', 'almuerzos', 'viaje', 'viajes', 'cuaderno',
  'cuadernos', 'beca', 'becas', 'tarea', 'tareas', 'manzana', 'manzanas', 'quintal', 'quintales',
  'saco', 'sacos', 'milpa', 'libra', 'libras', 'kilómetro', 'kilómetros', 'asiento', 'asientos', 'nota', 'notas'];

function iaFutNorm(t) { return (t || '').toString().trim().toLowerCase().replace(/\s+/g, ' '); }

/* Juzga las cuatro piezas de lo que el alumno escribió. Corre igual en el
   navegador y en Node, que es lo que deja a la sonda rehacer la cuenta en
   vez de creerle a la pantalla. */
function iaFutJuzga(esc) {
  esc = esc || {};
  const quien = iaFutNorm(esc.quien), precio = iaFutNorm(esc.precio), decide = iaFutNorm(esc.decide);
  const hay = IA_CAPACIDADES.some(c => c.k === esc.cap);
  const generico = IA_FUT_GENERICOS.indexOf(quien.replace(/^(el|la|los|las|un|una) /, m => m)) >= 0
    || IA_FUT_GENERICOS.indexOf(quien) >= 0;
  /* Un nombre propio: empieza en mayúscula en lo que el alumno escribió y no
     está en la lista de los que no son nadie. «don Chele» y «doña Tere» pasan
     por el nombre que llevan detrás. */
  const crudo = (esc.quien || '').toString().trim().replace(/^(don|doña|la profesora|el profesor|la enfermera)\s+/i, '');
  const conNombre = /^[A-ZÁÉÍÓÚÑ]/.test(crudo) && crudo.length >= 3 && !generico;
  const contable = /\d/.test(precio) || IA_FUT_CONTABLES.some(u => (' ' + precio + ' ').includes(u.trim() === '' ? u : ' ' + u.trim()));
  const pregunta = /[?¿]/.test(decide) && decide.length >= 10;
  return {
    hoy: !!hay, quien: !!conNombre, precio: !!contable, decide: !!pregunta,
    cap: IA_CAPACIDADES.find(c => c.k === esc.cap) || null,
  };
}
function iaFutCuenta(v) { return ['hoy', 'quien', 'precio', 'decide'].filter(k => v[k]).length; }
function iaFutEsEscenario(v) { return iaFutCuenta(v) === 4; }
function iaFutLeFalta(v) { return IA_FUT_PIEZAS.filter(p => !v[p.k]); }

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_FUT_FECHA, IA_CAPACIDADES, IA_FUT_PIEZAS, IA_FUTUROS, IA_FUT_MANOS,
                     iaFutAl, iaFutFinal, IA_FUT_GENERICOS, IA_FUT_CONTABLES, iaFutJuzga, iaFutCuenta,
                     iaFutEsEscenario, iaFutLeFalta };
}
