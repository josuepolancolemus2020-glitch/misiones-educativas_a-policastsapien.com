/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Escenarios por venir: el trabajo y el estudio
   ───────────────────────────────────────────────────────────────────────────
   La etapa 7 de la Ruta de la Máquina que Aprende (misión 78) lo PINTA de
   aquí, y su ficha impresa dice lo mismo porque `_dev/verifica-ia.js` compara
   las dos.

   ⚠️ POR QUÉ ESTE ARCHIVO SE REHIZO ENTERO, y es la lección más cara de la
   ruta. La primera versión enseñaba a DISTINGUIR un escenario de una
   profecía: nueve situaciones inventadas y una prueba de cuatro piezas. El
   método estaba bien y el alumno salía sin saber nada de lo que la
   Inteligencia Artificial le va a cambiar. El autor lo dijo con estas
   palabras: «me refería a los escenarios de lo que está pasando con la IA,
   que indagaras de manera simple y sencilla lo del futuro». Tenía razón:
   una misión sobre CÓMO se piensa el futuro no es una misión sobre el futuro.

   ⚠️ Y HABLAR DEL FUTURO SIN PREDECIR SÍ SE PUEDE, pero de una sola forma:
   partiendo de lo que la máquina YA hace —las seis capacidades de abajo, que
   el alumno produjo con sus manos en las etapas anteriores— y mirando qué
   tareas de un oficio de verdad tocan esas capacidades. Eso no es profecía:
   es mirar lo que hay. Por eso aquí no hay ni un año, ni un plazo, ni un
   «para entonces», y por eso cada tarea dice CON QUÉ se la lleva la máquina.

   LO QUE SALE DE LOS DATOS, y no está escrito a mano en ninguna pantalla:
   se cuenta de las 51 tareas de los ocho oficios, por tipo de tarea. La
   máquina se lleva casi todo lo de PAPEL y casi todo lo de MIRAR, y casi
   nada de lo de MANOS y de ESTAR CON ALGUIEN. Ningún oficio se va entero y
   ninguno se salva entero. De ahí la respuesta que esta misión le da al
   alumno de noveno que no sabe qué estudiar: **no preguntés si tu oficio se
   salva; preguntá de qué tareas está hecho.**

   ⚠️ CUATRO REGLAS PARA AÑADIR UN OFICIO O UNA TAREA:

   1. **Una tarea marcada `si` tiene que decir CON QUÉ** (`como`), y solo hay
      dos respuestas honestas: `cuenta` —eso ya lo hacía una computadora
      normal desde antes de la Inteligencia Artificial, como sumar, ordenar o
      buscar en una lista— o la clave de una de las seis capacidades. Si no se
      puede nombrar ninguna, la tarea NO va marcada `si`. Es lo que separa
      esta misión de la publicidad.
   2. **Ni una fecha de lo que va a pasar.** No hay años, no hay plazos.
      Lo único fechado es `IA_FUT_FECHA`, que dice cuándo se escribió esto.
   3. **Oficios de aquí, con una persona con nombre**, como la normativa del
      relato. Y tareas que se puedan mirar: «levantar la pared», no «ejecutar
      labores constructivas».
   4. **Se escribe en lenguaje llano.** Una idea por frase, frases de menos de
      veinticinco palabras y ningún campo de más de cuarenta y cinco. Lo lee
      un alumno de cuarto y un joven de bachillerato. Se mide con
      `node _dev/mide-legibilidad.js`.

   ⚠️ Y UNA HONESTIDAD QUE NO SE PUEDE SALTAR: se cuentan TAREAS, no HORAS.
   Don Chele pierde dos tareas de siete y las cinco que le quedan son las que
   se llevan todo el día. La pantalla lo dice con esas palabras, porque un
   porcentaje que se lee mal enseña peor que ninguno. Es la misma lección que
   «el promedio que esconde» de la etapa 5.

   Las cuatro piezas (`IA_FUT_PIEZAS`) se quedan, pero ya no son la misión:
   son la herramienta corta del final, para el día que alguien le diga «en dos
   años…». Ahí siguen sirviendo, y `iaFutJuzga` las recalcula.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Cuándo se escribió esto. Se enseña siempre: lo que aquí se cuenta se mira
   distinto dentro de un año, y esa es la última tarjeta de la misión. */
const IA_FUT_FECHA = '17 de septiembre de 2026';

/* ── Con qué se la lleva: lo que YA se puede hacer ─────────────────────────
   Seis capacidades, y ninguna se afirma de oídas: de cada una se dice EN QUÉ
   ETAPA el alumno la produjo con sus manos. Esa columna es la que convierte
   «dicen que la IA puede…» en «esto lo hiciste vos». */
const IA_CAPACIDADES = [
  { k: 'parecido', e: '🍎', etapa: 1, corto: 'Le pone nombre por parecido',
    que: 'Ponerle nombre a algo por su parecido con los ejemplos',
    donde: 'Lo hiciste en «Enséñale a la máquina»: le enseñaste frutas y nombró la siguiente.',
    uso: 'para clasificar sin preguntarle a nadie',
    falla: 'se equivoca con lo raro, con lo que no vio',
    contra: 'quien menos se parece a los ejemplos' },
  { k: 'cara', e: '👤', etapa: 1, corto: 'Reconoce caras',
    que: 'Reconocer una cara comparándola con las que tiene guardadas',
    donde: 'El mismo parecido de la etapa 1, con caras y no frutas.',
    uso: 'para saber quién es quién sin preguntar',
    falla: 'confunde a dos personas parecidas',
    contra: 'el que se parece a otro sin saberlo' },
  { k: 'predice', e: '📈', etapa: 2, corto: 'Predice con datos medidos',
    que: 'Predecir lo que va a pasar con datos que alguien midió',
    donde: 'Lo mediste en «¿Cuántos ejemplos hacen falta?». Con veinte ya casi siempre acierta.',
    uso: 'para decidir antes de que pase',
    falla: 'no tiene con qué acertar donde nadie midió',
    contra: 'el que vive donde no se tomaron datos' },
  { k: 'texto', e: '💬', etapa: 4, corto: 'Escribe texto, y a veces inventa',
    que: 'Escribir un texto que suena seguro y a veces inventa el dato',
    donde: 'Lo viste en el predictor: lo más probable era «cinco estrofas», y son siete.',
    uso: 'para escribir lo que otro va a leer',
    falla: 'inventa con la misma seguridad con que acierta',
    contra: 'el que lo leyó sin comprobarlo' },
  { k: 'voz', e: '🎙️', etapa: 5, corto: 'Fabrica una voz',
    que: 'Fabricar una voz con unos segundos de audio',
    donde: 'Lo armaste en «¿Cuánto hace falta para una estafa?»: las piezas las publicó la familia.',
    uso: 'para hablar con la voz de otra persona',
    falla: 'una voz fabricada pasa por verdadera',
    contra: 'el que decide por lo que oye' },
  { k: 'refuerzo', e: '🎮', etapa: 2, corto: 'Aprende a fuerza de intentos',
    que: 'Mejorar a fuerza de intentos, sin que nadie le diga cómo',
    donde: 'Lo viste en el juego del Refuerzo: el suelo se levantó hasta ser una rampa.',
    uso: 'para encontrar sola la forma de ganar',
    falla: 'aprende a ganar el juego que le pusiste, no el tuyo',
    contra: 'el que escribió el premio sin pensarlo' },
];

/* ⚠️ Y la séptima respuesta, que NO es una capacidad de Inteligencia
   Artificial y por eso vive aparte: hay tareas que una computadora normal ya
   hacía desde mucho antes. Sumar, ordenar, buscar en una lista. Meterlas en el
   mismo saco sería vender como nuevo lo que tiene sesenta años, y el alumno
   tiene que poder distinguirlo: es la mitad de no creerle a un vendedor. */
const IA_CUENTA = { k: 'cuenta', e: '⚙️', corto: 'Sumar, ordenar, buscar',
  que: 'Sumar, ordenar y buscar en una lista',
  donde: 'Esto NO es Inteligencia Artificial. Una computadora normal ya lo hacía antes.' };

/* ── Los cuatro tipos de tarea ─────────────────────────────────────────────
   Son cuatro y no tres porque «mirar y decir qué es» tenía que ir aparte: es
   justo la capacidad que el alumno produjo en la etapa 1, y es la que
   sorprende. Casi todo el mundo da por hecho que mirar es cosa de personas. */
const IA_OFI_TIPOS = [
  { k: 'papel', e: '📄', nombre: 'De papel', que: 'Escribir, copiar, sumar, ordenar, buscar.' },
  { k: 'ojo', e: '👁️', nombre: 'De mirar', que: 'Mirar algo y decir qué es o qué tiene.' },
  { k: 'manos', e: '✋', nombre: 'De manos', que: 'Hacerlo con el cuerpo, en un sitio.' },
  { k: 'gente', e: '🧑', nombre: 'De estar con alguien', que: 'Convencer, darse cuenta, responder por lo hecho.' },
];

/* ── Ocho oficios, desarmados en tareas ────────────────────────────────────
   `clase` dice de qué está hecho el oficio sobre todo. No decide nada: el
   conteo sale de las tareas, una por una. */
const IA_OFICIOS = [
  { k: 'maestra', e: '🏫', nombre: 'Maestra de escuela', clase: 'gente', quien: 'la profesora Delmy',
    tareas: [
      { t: 'Escribir el examen del bloque', tipo: 'papel', maquina: 'medias', como: 'texto',
        porque: 'Escribe las preguntas en segundos. Hay que revisarlas una por una: inventa.' },
      { t: 'Calificar exámenes de marcar', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Comparar una marca con la clave es lo más viejo que hace una computadora.' },
      { t: 'Llenar planillas y sacar promedios', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Son cuentas. Es lo que más horas le quita hoy y lo primero que se va.' },
      { t: 'Mirar un cuaderno y marcar el error', tipo: 'ojo', maquina: 'medias', como: 'parecido',
        porque: 'Marca dónde está el error. No sabe por qué ESE niño lo comete siempre.' },
      { t: 'Explicarle otra vez al que no entendió', tipo: 'gente', maquina: 'medias', como: 'texto',
        porque: 'Repite mil veces sin cansarse. No sabe qué le pasa hoy a ese niño.' },
      { t: 'Darse cuenta de que un niño no desayunó', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Eso no está escrito en ningún dato. Se ve en la cara y se pregunta.' },
      { t: 'Responder por la nota que puso', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Una máquina no responde ante una madre ni ante el director.' },
    ] },

  { k: 'enfermera', e: '💉', nombre: 'Enfermera del centro de salud', clase: 'gente', quien: 'la enfermera Sandra',
    tareas: [
      { t: 'Buscar qué medicina choca con cuál', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Es buscar en una lista. Lo hace sin equivocarse y en un segundo.' },
      { t: 'Llevar el control de las vacunas', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Contar y avisar quién va atrasado son cuentas.' },
      { t: 'Mirar una radiografía y marcar lo raro', tipo: 'ojo', maquina: 'si', como: 'parecido',
        porque: 'Es el parecido de la etapa 1, con radiografías. Marca lo raro para que alguien mire.' },
      { t: 'Ponerle la vía a un niño de tres años', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Se hace con las manos, con el niño llorando y moviéndose.' },
      { t: 'Decirle a una madre que hay que viajar a Tegucigalpa', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Hay que decirlo de una forma que la señora pueda oír.' },
      { t: 'Decidir a quién atiende primero', tipo: 'gente', maquina: 'medias', como: 'predice',
        porque: 'Ordena por lo que dice el papel. No ve al que se está poniendo mal en la banca.' },
    ] },

  { k: 'mercado', e: '🍅', nombre: 'Vendedora del mercado', clase: 'gente', quien: 'doña Tere',
    tareas: [
      { t: 'Sacar la cuenta del día', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Sumar y restar. Una computadora normal ya lo hacía.' },
      { t: 'Saber qué se va a vender más el sábado', tipo: 'papel', maquina: 'si', como: 'predice',
        porque: 'Con lo que se vendió otros sábados, lo predice mejor que de memoria.' },
      { t: 'Mirar el tomate y ver cuál ya no aguanta', tipo: 'ojo', maquina: 'si', como: 'parecido',
        porque: 'Es el parecido otra vez: mil fotos de tomate bueno y de tomate pasado.' },
      { t: 'Cargar, acomodar y limpiar el puesto', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Son las manos y la espalda, en el mercado, a las cuatro de la mañana.' },
      { t: 'Convencer al que está dudando', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Es mirar a alguien a la cara y encontrarle el precio.' },
      { t: 'Fiarle a la señora de siempre', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Eso no es una cuenta: es saber quién es esa señora.' },
    ] },

  { k: 'cuentas', e: '🧾', nombre: 'El que lleva las cuentas de la cooperativa', clase: 'papel', quien: 'don Beto',
    tareas: [
      { t: 'Sumar las facturas del mes', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Sumar es lo que mejor hace una computadora, y desde hace sesenta años.' },
      { t: 'Pasar los números a la planilla', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Copiar de un lado a otro sin equivocarse.' },
      { t: 'Escribir el informe para la asamblea', tipo: 'papel', maquina: 'medias', como: 'texto',
        porque: 'Lo escribe bonito y rápido. Los números se los das vos, y hay que revisarlo.' },
      { t: 'Avisar quién lleva tres meses sin pagar', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Es mirar fechas en una lista.' },
      { t: 'Sacar cuánto toca de impuesto', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Es una cuenta con reglas escritas. No falla y no se cansa.' },
      { t: 'Decidir si se le fía al que tuvo un mal año', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Los números dicen que no. Don Beto sabe que ese hombre paga siempre.' },
      { t: 'Firmar el informe y responder si está mal', tipo: 'gente', maquina: 'no', como: '',
        porque: 'La firma es de una persona. Una máquina no va a la asamblea a dar la cara.' },
    ] },

  { k: 'secretaria', e: '🗂️', nombre: 'Secretaria de la dirección', clase: 'papel', quien: 'la señorita Lesly',
    tareas: [
      { t: 'Pasar en limpio lo que se dictó', tipo: 'papel', maquina: 'si', como: 'texto',
        porque: 'Oye y escribe. Es de lo primero que aprendió a hacer bien.' },
      { t: 'Contestar el correo de siempre', tipo: 'papel', maquina: 'si', como: 'texto',
        porque: 'Las respuestas que se repiten las escribe igual de bien que ella.' },
      { t: 'Buscar un expediente en el archivo', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Buscar en una lista. Tarda un segundo donde ella tardaba media hora.' },
      { t: 'Cuadrar una cita entre tres agendas', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Es probar combinaciones hasta que una calce.' },
      { t: 'Atender al padre que llega enojado', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Hay que bajarle el enojo a alguien que tiene a su hijo de por medio.' },
      { t: 'Saber a quién hay que avisarle primero', tipo: 'gente', maquina: 'medias', como: 'cuenta',
        porque: 'Ordena por lo que está escrito. No sabe quién se ofende si no le avisan.' },
    ] },

  { k: 'albanil', e: '🧱', nombre: 'Albañil', clase: 'manos', quien: 'don Toño',
    tareas: [
      { t: 'Calcular los bloques y la arena', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Es una cuenta de área y de volumen. La misma de las misiones de sexto.' },
      { t: 'Mirar la pared y ver que está fuera de plomo', tipo: 'ojo', maquina: 'si', como: 'parecido',
        porque: 'Con una foto y una línea lo marca. Es mirar y comparar.' },
      { t: 'Levantar la pared', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Bloque por bloque, con la mezcla en la mano y el sol encima.' },
      { t: 'Arreglar lo que se mojó cuando llovió a media obra', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Nadie midió eso antes. Hay que estar ahí y resolver con lo que hay.' },
      { t: 'Doblar el hierro a la medida', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Se hace con las manos y con fuerza, en el terreno.' },
      { t: 'Ponerse de acuerdo con el dueño que cambió de idea', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Es una conversación sobre plata con alguien que no quiere pagar más.' },
    ] },

  { k: 'agricultor', e: '🌽', nombre: 'Agricultor', clase: 'manos', quien: 'don Chele',
    tareas: [
      { t: 'Llevar la cuenta de lo que se gastó', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Sumar gastos. Una computadora normal ya lo hacía.' },
      { t: 'Decir cuándo sembrar, con el clima medido', tipo: 'papel', maquina: 'si', como: 'predice',
        porque: 'Con datos de estaciones cercanas acierta. Donde nadie midió, no tiene con qué.' },
      { t: 'Mirar la hoja y decir qué plaga es', tipo: 'ojo', maquina: 'si', como: 'parecido',
        porque: 'Es el detector de plagas que vos entrenaste en la etapa 2.' },
      { t: 'Sembrar, limpiar y cosechar', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Es la ladera, el machete y el sol. Ahí no entra ninguna máquina.' },
      { t: 'Cargar y acarrear los sacos', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Cien libras al hombro por un camino que no es camino.' },
      { t: 'Decidir si vende ahora o espera el precio', tipo: 'gente', maquina: 'medias', como: 'predice',
        porque: 'Puede decir cómo va el precio. No sabe si su familia aguanta un mes más.' },
      { t: 'Aguantar el año en que se pierde la milpa', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Eso no es una tarea que se delega. Es la vida de una familia.' },
    ] },

  { k: 'motorista', e: '🚌', nombre: 'Motorista de bus', clase: 'manos', quien: 'don Gerardo',
    tareas: [
      { t: 'Llevar la cuenta de los pasajes', tipo: 'papel', maquina: 'si', como: 'cuenta',
        porque: 'Sumar pasajes y sacar lo del día.' },
      { t: 'Decir cuál es la ruta más rápida hoy', tipo: 'papel', maquina: 'si', como: 'predice',
        porque: 'Con lo medido de otros días predice bien dónde se traba.' },
      { t: 'Mirar el camino y ver el hueco', tipo: 'ojo', maquina: 'si', como: 'parecido',
        porque: 'Mirar y reconocer es lo suyo. Por eso hay carros que se manejan solos.' },
      { t: 'Manejar por la calle de tierra con lluvia', tipo: 'manos', maquina: 'medias', como: 'refuerzo',
        porque: 'Se manejan solos donde las calles están medidas. Aquí no las midió nadie.' },
      { t: 'Arreglar el bus cuando se para en el camino', tipo: 'manos', maquina: 'no', como: '',
        porque: 'Con las manos, debajo del bus y con lo que lleve en la caja.' },
      { t: 'Esperar a la señora que viene corriendo', tipo: 'gente', maquina: 'no', como: '',
        porque: 'Esperar treinta segundos no está en ninguna regla. Se decide mirando.' },
    ] },
];

/* ── La escuela: los tres escudos ──────────────────────────────────────────
   Lo que hace que una tarea NO se pueda entregar hecha por una máquina. No
   son castigos ni trucos del maestro: son las tres cosas que a la máquina le
   faltan, y las tres salen de las etapas anteriores. */
const IA_ESCUDOS = [
  { k: 'delante', e: '👀', nombre: 'Se hace delante de alguien',
    que: 'Hay que explicarlo en voz alta y contestar una pregunta que no estaba.',
    porque: 'La máquina te escribe el texto. No se sienta a sostenerlo por vos.' },
  { k: 'aqui', e: '📍', nombre: 'Usa un dato de aquí',
    que: 'Algo de tu casa, tu barrio o tu municipio que no está escrito en ninguna parte.',
    porque: 'Solo sabe lo que alguien escribió antes. De tu aldea casi no hay nada escrito.' },
  { k: 'manos', e: '✋', nombre: 'Pide que midás o hagás algo',
    que: 'Contar, medir, preguntarle a alguien, construir.',
    porque: 'No puede ir a tu patio con la cinta métrica.' },
];

/* ── Doce tareas de clase ──────────────────────────────────────────────────
   ⚠️ `copia: true` quiere decir que una máquina puede entregarla COMPLETA y
   bien. Y la regla que la sonda recalcula: toda tarea con `copia: false`
   tiene al menos un escudo, y ninguna con `copia: true` tiene ninguno. Si un
   día alguien mete una tarea sin escudo que igual no se copia, la afirmación
   de la pantalla se vuelve falsa sin dar ningún error. */
const IA_TAREAS_CLASE = [
  { k: 'resumen', t: 'Escribí un resumen de la Independencia de Honduras', copia: true, escudos: [],
    porque: 'Eso está escrito mil veces. Lo entrega en segundos y bien.' },
  { k: 'ensayo', t: 'Escribí un ensayo sobre la contaminación', copia: true, escudos: [],
    porque: 'Es el trabajo más fácil de todos para una máquina que escribe.' },
  { k: 'ejercicios', t: 'Resolvé estos veinte ejercicios de fracciones', copia: true, escudos: [],
    porque: 'Los resuelve y hasta te explica el paso. Vos no aprendiste nada.' },
  { k: 'definicion', t: 'Copiá la definición de adjetivo', copia: true, escudos: [],
    porque: 'Copiar por copiar ya no vale para nada. Nunca valió mucho.' },
  { k: 'linea', t: 'Hacé la línea del tiempo de los próceres', copia: true, escudos: [],
    porque: 'Son fechas escritas. Ojo: a veces inventa una, y va firmada por vos.' },
  { k: 'preguntas', t: 'Leé este texto y contestá cinco preguntas', copia: true, escudos: [],
    porque: 'Lee y contesta mejor que rápido. No hay forma de saber si vos leíste.' },
  { k: 'explicar', t: 'Explicá en voz alta cómo resolviste el problema 5', copia: false, escudos: ['delante'],
    porque: 'Aquí se ve en diez segundos quién lo hizo. No hay dónde esconderse.' },
  { k: 'patio', t: 'Medí tu patio y sacá su perímetro y su área', copia: false, escudos: ['manos'],
    porque: 'Nadie midió tu patio. Los números los ponés vos, con la cinta.' },
  { k: 'abuela', t: 'Preguntale a alguien mayor qué se sembraba antes aquí', copia: false, escudos: ['aqui', 'manos'],
    porque: 'Eso no está escrito en ninguna parte. Está en la cabeza de tu vecina.' },
  { k: 'buses', t: 'Contá los buses que pasan en media hora y hacé la gráfica', copia: false, escudos: ['manos'],
    porque: 'La gráfica te la hace. Los números de TU calle los tenés que contar.' },
  { k: 'lectura', t: 'Tomale la lectura un minuto a tu hermano menor', copia: false, escudos: ['manos', 'delante'],
    porque: 'Hay que sentarse con él, con el reloj en la mano.' },
  { k: 'tanque', t: 'Escribí qué haría tu familia si se acaba el agua del tanque', copia: false, escudos: ['aqui'],
    porque: 'Te escribe algo general y se nota. Tu casa no está en internet.' },
];

/* ── Qué cambia al estudiar ────────────────────────────────────────────────
   Cinco cosas, y ninguna es un regaño. Tres son malas noticias para el que
   copia y dos son buenas noticias para el que estudia en un aula de 43. */
const IA_ESTUDIO = [
  { k: 'copiar', e: '📝', titulo: 'Copiar dejó de servir, y no por castigo',
    que: 'Si la máquina te la hace, llegás al examen igual que si no la hubieras hecho.',
    hoy: 'La nota de la tarea se la lleva ella. El examen lo hacés vos solo.' },
  { k: 'memoria', e: '🧠', titulo: 'Lo que hay que saberse es lo que sirve para comprobar',
    que: 'Si no sabés que el Himno tiene siete estrofas, no cazás la mentira cuando te diga cinco.',
    hoy: 'Ya te pasó en la etapa 4. Saber poco te deja creyendo todo.' },
  { k: 'explica', e: '🔁', titulo: 'Te explica mil veces sin cansarse',
    que: 'Es lo mejor que trae. En un aula de 43 nadie puede explicarte cuarenta y tres veces.',
    hoy: 'Pedile que te lo explique otra vez, más fácil. Eso sí te sirve.' },
  { k: 'sostener', e: '🗣️', titulo: 'Lo que va a valer más es sostener lo que decís',
    que: 'Delante de alguien, con una pregunta que no estaba en el papel.',
    hoy: 'Por eso los maestros van a pedir más cosas en voz alta y menos en hoja.' },
  { k: 'responde', e: '✍️', titulo: 'Lo que entregás lo firmás vos',
    que: 'Si te copia un dato falso, el que lo entregó fuiste vos.',
    hoy: 'La máquina no repite el año. Es la misma regla que en el trabajo de don Beto.' },
];

/* ── Las cuatro piezas ─────────────────────────────────────────────────────
   Ya no son la misión: son la herramienta del final, para el día que alguien
   le diga «en dos años ningún maestro va a calificar a mano». Sirven para
   desarmar esa frase en veinte segundos. */
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

/* ═════════════════════ LAS CUENTAS ═══════════════════════════════════════
   Corren igual en el navegador y en Node, que es lo que deja a la sonda
   rehacer cada número en vez de creerle a la pantalla. */

/* «a el» no se dice: se dice «al». Lo usa el Laboratorio de la misión al
   componer «Le cae a el que vive donde no se tomaron datos». Un detalle de
   español que, mal puesto, es lo primero que ve un maestro. */
function iaFutAl(t) {
  const x = (t || '').toString().trim();
  return /^el\s/i.test(x) ? 'al ' + x.slice(3) : 'a ' + x;
}

/* Cuánto pesa una tarea en el conteo: la que se lleva entera vale 1, la que
   se lleva a medias vale medio. */
function iaOfiPeso(m) { return m === 'si' ? 1 : (m === 'medias' ? 0.5 : 0); }

/* Un oficio: cuántas tareas de cada clase y qué parte se lleva la máquina. */
function iaOfiCuenta(k) {
  const o = IA_OFICIOS.find(x => x.k === k);
  if (!o) return null;
  const si = o.tareas.filter(t => t.maquina === 'si').length;
  const medias = o.tareas.filter(t => t.maquina === 'medias').length;
  const no = o.tareas.filter(t => t.maquina === 'no').length;
  const peso = o.tareas.reduce((a, t) => a + iaOfiPeso(t.maquina), 0);
  return { k, si, medias, no, total: o.tareas.length, pct: Math.round(100 * peso / o.tareas.length) };
}

/* ⚠️ La cuenta que sostiene la misión entera: por TIPO de tarea, juntando los
   ocho oficios. Es de aquí de donde sale lo que la pantalla afirma, y por eso
   la pantalla no escribe ni un número a mano. */
function iaOfiPorTipo() {
  return IA_OFI_TIPOS.map(ti => {
    const tareas = IA_OFICIOS.reduce((a, o) => a.concat(o.tareas.filter(t => t.tipo === ti.k)), []);
    const peso = tareas.reduce((a, t) => a + iaOfiPeso(t.maquina), 0);
    return { k: ti.k, e: ti.e, nombre: ti.nombre, total: tareas.length,
             pct: tareas.length ? Math.round(100 * peso / tareas.length) : 0 };
  });
}

/* Cuántas tareas hay en total, para no escribir el número en ninguna parte. */
function iaOfiTotalTareas() { return IA_OFICIOS.reduce((a, o) => a + o.tareas.length, 0); }

/* La escuela: cuántas se pueden copiar y qué escudo lleva cada una que no. */
function iaClaseCuenta() {
  const copiables = IA_TAREAS_CLASE.filter(t => t.copia);
  const protegidas = IA_TAREAS_CLASE.filter(t => !t.copia);
  const porEscudo = IA_ESCUDOS.map(e => ({
    k: e.k, e: e.e, nombre: e.nombre,
    cuantas: protegidas.filter(t => t.escudos.indexOf(e.k) >= 0).length,
  }));
  return { total: IA_TAREAS_CLASE.length, copiables: copiables.length,
           protegidas: protegidas.length, porEscudo };
}

/* ── Las cuatro piezas, juzgadas ──────────────────────────────────────────── */
const IA_FUT_GENERICOS = ['la gente', 'gente', 'todos', 'todo el mundo', 'la sociedad', 'las personas',
  'los niños', 'la humanidad', 'nosotros', 'uno', 'alguien', 'la juventud', 'los jóvenes', 'el pueblo'];
const IA_FUT_CONTABLES = ['día', 'días', 'semana', 'semanas', 'mes', 'meses', 'año', 'años', 'hora', 'horas',
  'lempira', 'lempiras', 'l ', 'clase', 'clases', 'cosecha', 'cosechas', 'quintal', 'quintales',
  'saco', 'sacos', 'milpa', 'libra', 'libras', 'kilómetro', 'kilómetros', 'asiento', 'asientos', 'nota', 'notas'];

function iaFutNorm(t) { return (t || '').toString().trim().toLowerCase().replace(/\s+/g, ' '); }

function iaFutJuzga(esc) {
  esc = esc || {};
  const quien = iaFutNorm(esc.quien), precio = iaFutNorm(esc.precio), decide = iaFutNorm(esc.decide);
  const hay = IA_CAPACIDADES.some(c => c.k === esc.cap);
  const generico = IA_FUT_GENERICOS.indexOf(quien) >= 0;
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
  module.exports = { IA_FUT_FECHA, IA_CAPACIDADES, IA_CUENTA, IA_OFI_TIPOS, IA_OFICIOS,
                     IA_ESCUDOS, IA_TAREAS_CLASE, IA_ESTUDIO, IA_FUT_PIEZAS,
                     iaFutAl, iaOfiPeso, iaOfiCuenta, iaOfiPorTipo, iaOfiTotalTareas, iaClaseCuenta,
                     IA_FUT_GENERICOS, IA_FUT_CONTABLES, iaFutJuzga, iaFutCuenta,
                     iaFutEsEscenario, iaFutLeFalta };
}
