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

   ⚠️ Y una quinta, de septiembre de 2026: **se escribe en lenguaje llano.**
   Una idea por frase, frases de menos de veinticinco palabras y ningún campo
   de más de cuarenta y cinco. Esto lo lee un alumno de cuarto grado y un
   joven de bachillerato, y los dos abandonan por el mismo motivo: el párrafo
   largo. Se mide con `node _dev/mide-legibilidad.js`.

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
  { k: 'parecido', e: '🍎', etapa: 1, que: 'Ponerle nombre a algo por su parecido con los ejemplos',
    donde: 'Lo hiciste en «Enséñale a la máquina»: le enseñaste frutas y nombró la siguiente.',
    uso: 'para clasificar sin preguntarle a nadie',
    falla: 'se equivoca con lo raro, con lo que no vio',
    contra: 'quien menos se parece a los ejemplos' },
  { k: 'cara', e: '👤', etapa: 1, que: 'Reconocer una cara comparándola con las que tiene guardadas',
    donde: 'El mismo parecido de la etapa 1, con caras y no frutas.',
    uso: 'para saber quién es quién sin preguntar',
    falla: 'confunde a dos personas parecidas',
    contra: 'el que se parece a otro sin saberlo' },
  { k: 'predice', e: '📈', etapa: 2, que: 'Predecir lo que va a pasar con datos que alguien midió',
    donde: 'Lo mediste en «¿Cuántos ejemplos hacen falta?». Con veinte ya casi siempre acierta.',
    uso: 'para decidir antes de que pase',
    falla: 'no tiene con qué acertar donde nadie midió',
    contra: 'el que vive donde no se tomaron datos' },
  { k: 'texto', e: '💬', etapa: 4, que: 'Escribir un texto que suena seguro y a veces inventa el dato',
    donde: 'Lo viste en el predictor: lo más probable era «cinco estrofas», y son siete.',
    uso: 'para escribir lo que otro va a leer',
    falla: 'inventa con la misma seguridad con que acierta',
    contra: 'el que lo leyó sin comprobarlo' },
  { k: 'voz', e: '🎙️', etapa: 5, que: 'Fabricar una voz con unos segundos de audio',
    donde: 'Lo armaste en «¿Cuánto hace falta para una estafa?»: las piezas las publicó la familia.',
    uso: 'para hablar con la voz de otra persona',
    falla: 'una voz fabricada pasa por verdadera',
    contra: 'el que decide por lo que oye' },
  { k: 'refuerzo', e: '🎮', etapa: 2, que: 'Mejorar a fuerza de intentos, sin que nadie le diga cómo',
    donde: 'Lo viste en el juego del Refuerzo: el suelo se levantó hasta ser una rampa.',
    uso: 'para encontrar sola la forma de ganar',
    falla: 'aprende a ganar el juego que le pusiste, no el tuyo',
    contra: 'el que escribió el premio sin pensarlo' },
];

/* ── Las cuatro piezas de un escenario ─────────────────────────────────────
   Es la prueba que separa un escenario de una profecía, y la que el alumno
   le aplica a lo suyo en el taller. Las cuatro se pueden comprobar; por eso
   son estas cuatro y no una lista de buenas intenciones. */
const IA_FUT_PIEZAS = [
  { k: 'hoy', e: '🔧', nombre: 'Está hecho con algo que YA se puede hacer',
    si: 'Se apoya en una capacidad que existe y que vos produjiste antes.',
    no: 'Se apoya en algo que todavía no se puede hacer.',
    porque: 'Para decidir, tiene que poder pasar. Lo demás es ciencia ficción.' },
  { k: 'quien', e: '🧑', nombre: 'Le pasa a alguien con nombre',
    si: 'Hay una persona concreta, con su nombre.',
    no: 'Le pasa a «la gente», «todos» o «la sociedad».',
    porque: 'A «la gente» no le pasa nada. Sin una persona no hay quién decida.' },
  { k: 'precio', e: '💸', nombre: 'Lo que cuesta se puede contar',
    si: 'Se dice en días, en lempiras, en clases o en cosechas.',
    no: 'Dice «es grave», «es peligroso» o «es importante».',
    porque: 'Un precio contado se compara con lo que cuesta evitarlo. «Es grave» no se compara.' },
  { k: 'decide', e: '🔀', nombre: 'Termina en una decisión, no en un anuncio',
    si: 'Acaba en una pregunta: ¿qué hago yo si esto pasa?',
    no: 'Acaba contando lo que va a pasar.',
    porque: 'Una profecía te deja mirando. Un escenario te deja algo que hacer.' },
];

/* ── Los nueve escenarios ──────────────────────────────────────────────────
   Todos inventados, todos apoyados en capacidades de arriba, todos con su
   persona, su precio contable, sus tres decisiones y su regla. Y ninguno
   trae una fecha de cuándo pasaría: eso sería la profecía. */
const IA_FUTUROS = [
  { k: 'maestro', e: '🏫', titulo: 'El maestro que no está', quien: 'la profesora Delmy', ciclo: 'III Ciclo',
    apoya: ['texto', 'parecido'],
    cuesta: 'tres horas de clase al día y lo que aprendan 43 alumnos',
    situacion: 'Imagina esto. A la escuela de la profesora Delmy le mandan un programa que «da la clase». Explica, pone ejercicios y califica. Le dicen que ella ahora revise.',
    ops: [
      { t: 'Dejar que dé la clase y revisar al final.',
        pasa: 'Explicó bien casi todo. En Sociales inventó un dato. Nadie lo vio hasta el examen, y 43 cuadernos lo llevaban copiado.' },
      { t: 'Usarlo para los ejercicios y explicar ella lo nuevo.',
        pasa: 'El programa repite el ejercicio sin cansarse. Eso se lo queda él. Lo nuevo lo explica Delmy, que contesta preguntas.' },
      { t: 'Pedir por escrito qué hace cuando no sabe.',
        pasa: 'Casi nadie pregunta eso antes de comprar. Si contesta igual de seguro, Delmy ya sabe que tiene que revisar siempre.' },
    ],
    regla: 'Un programa repite un ejercicio mil veces. Por lo que afirma responde una persona.' },

  { k: 'cosecha', e: '🌽', titulo: 'La cosecha que la máquina predijo', quien: 'don Chele', ciclo: 'II y III Ciclo',
    apoya: ['predice'],
    cuesta: 'media milpa y la semilla de la siembra siguiente',
    situacion: 'Imagina que a don Chele le llega un programa que dice cuándo sembrar. Aprendió con datos del valle. En su ladera no hay estación. Dice: sembrá esta semana.',
    ops: [
      { t: 'Sembrar esa semana: el programa sabe más que él.',
        pasa: 'En el valle llovió. En su ladera, dos semanas después. La mitad de la semilla no nació. El programa acertó donde midieron.' },
      { t: 'Preguntarle de dónde saca los datos.',
        pasa: 'La estación más cercana está a cuarenta kilómetros, del otro lado del cerro. Para el valle, mucho crédito. Para su ladera, poco.' },
      { t: 'Apuntar él la lluvia de su ladera.',
        pasa: 'Es el trabajo aburrido que nadie quiere. Un año de apuntes suyos vale más que el programa.' },
    ],
    regla: 'Una predicción vale para donde midieron. Preguntá siempre dónde midieron.' },

  { k: 'abuelo', e: '📼', titulo: 'La voz del abuelo', quien: 'Wendy', ciclo: 'III Ciclo y Media',
    apoya: ['voz', 'texto'],
    cuesta: 'L 400 al mes, y algo que no se cuenta en lempiras',
    situacion: 'Imagina que a Wendy le ofrecen hablar con la voz de su abuelo, que murió. La hicieron con los audios de la familia. Cuesta una cuota al mes.',
    ops: [
      { t: 'Pagarlo y hablar con él todas las noches.',
        pasa: 'Los primeros días consuela. Después Wendy nota algo: eso no recuerda, predice. El día que contesta lo que él nunca habría dicho, duele.' },
      { t: 'Usar los audios que ya tiene, sin pagar nada.',
        pasa: 'Los audios de verdad son pocos y se acaban. Pero son suyos y no cambian. Es menos, y es cierto.' },
      { t: 'Preguntar quién se queda con esa voz.',
        pasa: 'La voz la fabricaron con audios de la familia. Si el servicio cierra, ya no depende de Wendy. Pagó por algo que no tiene.' },
    ],
    regla: 'Una voz fabricada no recuerda: predice. Preguntá quién se queda con ella.' },

  { k: 'camaras', e: '📹', titulo: 'El pueblo con cámaras', quien: 'Elvin', ciclo: 'III Ciclo',
    apoya: ['cara'],
    cuesta: 'tres días detenido y el trabajo que perdió',
    situacion: 'Imagina que la alcaldía pone cámaras que reconocen caras en el mercado, por seguridad. A Elvin lo paran: el sistema dice que se parece a alguien buscado.',
    ops: [
      { t: 'Esperar: si no hizo nada, no pasa nada.',
        pasa: 'Se aclaró, y tardó tres días. El sistema dijo que se parecía, no que fuera él. Alguien lo tomó como prueba.' },
      { t: 'Preguntar cuántas veces se equivoca y con quién.',
        pasa: 'Es la pregunta de la etapa 2, aplicada a caras. Entrenado con pocas fotos de gente como él, falla más con ellos.' },
      { t: 'Pedir en el cabildo quién guarda las caras.',
        pasa: 'Es lo único que se puede pedir antes. Una cara no se cambia como una contraseña. Si se filtra, es para siempre.' },
    ],
    regla: 'Un parecido no es una identificación. Y una cara no se cambia.' },

  { k: 'ana', e: '🧾', titulo: 'El trabajo de Ana', quien: 'Ana', ciclo: 'III Ciclo y Media',
    apoya: ['texto', 'predice'],
    cuesta: 'tres años de estudio y la decisión de a qué dedicarse',
    situacion: 'Imagina que Ana quiere ser contadora. Le dicen que ya no hace falta: el programa hace las cuentas. Ella mira el día de la contadora del pueblo.',
    ops: [
      { t: 'Cambiar de carrera: el programa ya cuenta.',
        pasa: 'Cambió de idea por una frase que nadie comprobó. Las cuentas eran hora y media del día. El resto era decidir y responder.' },
      { t: 'Estudiarlo, y usar el programa mejor que nadie.',
        pasa: 'Le queda el trabajo menos la parte aburrida. Y puede revisar lo que el programa propone: para eso la contratan.' },
      { t: 'Partir el oficio en cuentas y decisiones.',
        pasa: 'Sirve para cualquier oficio. La cuenta la hace mejor una máquina. Decidir y responder, no. Casi ningún oficio es solo cuenta.' },
    ],
    regla: 'Antes de descartar un oficio, partilo en cuentas y decisiones. Se automatiza la cuenta.' },

  { k: 'tarea', e: '📓', titulo: 'La tarea sin tarea', quien: 'Óscar', ciclo: 'III Ciclo',
    apoya: ['texto'],
    cuesta: 'lo que iba a aprender escribiendo; no se nota hasta el examen',
    situacion: 'Imagina que el colegio de Óscar deja de mandar tareas escritas para la casa. Dicen que las hace la máquina. En su lugar mandan a leer.',
    ops: [
      { t: 'Alegrarse: menos tarea.',
        pasa: 'El examen es escrito y se hace en el aula. Óscar llevaba meses sin escribir un párrafo. Se notó en la nota.' },
      { t: 'Pedir que la tarea se defienda en clase.',
        pasa: 'No quita la tarea: la cambia. Da igual quién la escribió si hay que explicarla de pie. El que copió, no puede.' },
      { t: 'Escribir primero él y después pedir los fallos.',
        pasa: 'Lo que cambia es el orden. Escribir y después preguntar deja el trabajo suyo. Al revés, queda un texto ajeno.' },
    ],
    regla: 'Lo que se aprende escribiendo no se aprende leyendo lo que escribió otro. Primero vos.' },

  { k: 'senal', e: '📴', titulo: 'El día sin señal', quien: 'doña Tere', ciclo: 'II y III Ciclo',
    apoya: ['texto', 'predice'],
    cuesta: 'tres días de pulpería sin saber qué cobrar ni qué pedir',
    situacion: 'Imagina que doña Tere lleva la pulpería con un asistente del teléfono. Le saca las cuentas y le escribe al proveedor. Se cae la señal tres días.',
    ops: [
      { t: 'Esperar a que vuelva la señal.',
        pasa: 'Tres días sin saber cuánto le deben ni cuánto pedir. Se le olvidó tener el cuaderno al día.' },
      { t: 'Sacar el cuaderno y hacer las cuentas a mano.',
        pasa: 'Le costó una tarde y salió adelante. Sumar y restar no se olvida, se oxida. Lo perdido era lo fiado.' },
      { t: 'Apuntar en papel lo que no puede perder.',
        pasa: 'Es lo aburrido y lo que salva. El teléfono para lo rápido. El papel para lo que no se puede perder.' },
    ],
    regla: 'Preguntate qué pasa el día que no esté. Y aprendé a hacerlo sin ella.' },

  { k: 'salud', e: '🩺', titulo: 'La máquina en el centro de salud', quien: 'la enfermera Xiomara', ciclo: 'III Ciclo y Media',
    apoya: ['parecido', 'predice'],
    cuesta: 'un traslado de dos horas de más, o uno que hacía falta y no se hizo',
    situacion: 'Imagina el centro de salud de Xiomara, con médico dos días a la semana. Le dan un programa que sugiere qué puede ser. Acierta con lo común, falla con lo raro.',
    ops: [
      { t: 'Seguir siempre lo que dice el programa.',
        pasa: 'Con lo común va bien. Con lo raro propone lo más parecido a lo que vio. Y ese día el traslado salva.' },
      { t: 'Usarlo como segunda opinión, nunca como la primera.',
        pasa: 'Xiomara decide y después mira qué propone. Cuando coinciden, sigue. Cuando no, mira dos veces. Y decide ella.' },
      { t: 'Preguntar qué hace cuando no está seguro.',
        pasa: 'Si siempre contesta igual de seguro, no sirve para lo raro. Si dice «no sé, traslade», vale más aunque acierte menos.' },
    ],
    regla: 'Lo que más acierta con lo común falla con lo raro. Y lo raro urge.' },

  { k: 'promesa', e: '⏳', titulo: 'La promesa que se cumplió (o no)', quien: 'Brayan', ciclo: 'III Ciclo y Media',
    apoya: ['texto'],
    cuesta: 'la matrícula que no hizo, y tres años de estudio',
    situacion: 'Imagina que Brayan está en el último año. En un cuaderno de séptimo encuentra una promesa apuntada, con su fecha. Es la que le hizo dejar computación.',
    ops: [
      { t: 'Reírse y pasar la página.',
        pasa: 'Casi todo el mundo hace eso. Una promesa sin fecha funciona porque nadie vuelve a mirarla. La de Brayan sigue circulando.' },
      { t: 'Marcar qué se cumplió y qué no.',
        pasa: 'Algunas se cumplieron y otras no se acercaron. Ya sabe quién acertó y cuánto creerle la próxima vez.' },
      { t: 'Apuntar la promesa de hoy, con su fecha.',
        pasa: 'Es la cápsula de la etapa anterior. A una promesa sin plazo le ponés vos la fecha del examen.' },
    ],
    regla: 'A una promesa sin fecha, ponele vos la fecha. Y volvé a mirarla.' },
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
    revisor: 'la propia familia, llamando al número de siempre',
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
    cuesta: 'lo que tarde el reclamo, y reclama quien puede',
    todo: false, revisarTodo: 'nadie mira una por una las multas de un pueblo entero' },
  { k: 'empresa', e: '🏢', quien: 'una empresa que lo vende', alcanceN: 100000,
    alcance: 'todas las escuelas y alcaldías que lo compren',
    decide: 'lo mismo que los de arriba, en todas a la vez',
    revisor: 'solo quien lo compra, si lo exige por escrito antes de firmar',
    cuesta: 'una cláusula del contrato, barata a tiempo y carísima después',
    todo: false, revisarTodo: 'nadie mira una por una las decisiones de todas esas escuelas' },
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
      pasa: 'Cuando ' + c.falla + ', la decisión se toma igual y ya vale. Alcanza ' + iaFutAl(m.alcance) + '. Le cae ' + iaFutAl(c.contra) + '.',
      cuesta: 'Lo que cuesta se multiplica por a cuánta gente alcanza. Aquí, ' + m.alcance + '.',
      aviso: '',
    };
  }
  return {
    cap: c, mano: m, revisa: true, alcance: m.alcanceN,
    titulo: 'Con revisión',
    usa,
    pasa: 'Cuando ' + c.falla + ', la decisión no vale todavía: la mira ' + m.revisor + '. El fallo se ve antes.',
    cuesta: 'Revisar cuesta ' + m.cuesta + '. No sale gratis: hay que decidir antes qué se revisa.',
    aviso: m.todo ? ''
      : 'Y acá no se puede revisar todo: ' + m.revisarTodo + '. Se revisa lo que decide algo grave. Y eso se escribe ANTES de comprar el programa.',
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
