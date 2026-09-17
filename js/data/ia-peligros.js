/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Los peligros de la Inteligencia Artificial
   ───────────────────────────────────────────────────────────────────────────
   La etapa 5 de la Ruta de la Máquina que Aprende (misión 76) los PINTA de
   aquí, y su ficha impresa dice lo mismo porque `_dev/verifica-ia.js` compara
   las dos. Es el mismo patrón del Himno, los próceres y la Constitución, y
   aquí la razón es más fuerte que en ninguna: un peligro mal nombrado en la
   pantalla y bien nombrado en el papel le enseña al alumno que ninguno de los
   dos es de fiar, que es justo lo contrario de lo que esta misión hace.

   ⚠️ CUATRO REGLAS PARA ESCRIBIR AQUÍ, y ninguna es de adorno:

   1. **Un peligro no es «la máquina es mala»: es un MECANISMO con nombre, y
      cada mecanismo tiene una PREGUNTA que lo desarma.** Si de una entrada no
      se puede decir el mecanismo y la pregunta, todavía no está escrita: es
      miedo, y el miedo no defiende a nadie.
   2. **Hay una persona y hay un precio.** Los casos están escritos PARA la
      misión, con mecanismos que ya se pueden hacer hoy, y **sin nombres de
      nadie real**: en un pueblo, un caso con nombres es alguien. Es la misma
      decisión que los casos de violación de la misión de la Constitución.
   3. ⚠️ **Nada que envejezca.** Ni un nombre de producto, ni una cifra de
      usuarios o de dinero, ni «hoy ya se puede hacer X en N segundos». Lo que
      se enseña es el mecanismo, que dura; lo que cambia cada mes no entra.
      `verifica-ia` lo comprueba en este archivo y en la ficha.
   4. ⚠️ **Frases cortas, una idea por frase.** Esto lo lee un alumno de III
      Ciclo y la misma ficha la fotocopia un maestro para cuarto grado. Cada
      campo va en tramos de 45 palabras como mucho y en frases de 25 como
      mucho, medido con `node _dev/mide-legibilidad.js`. Alargar un campo aquí
      alarga la pantalla Y el papel a la vez.

   Y tres peligros van SOLO COMO MECANISMO, sin caso: el remedio milagroso
   (salud), la opinión fabricada (decisiones públicas) y —fuera de este
   archivo a propósito— el uso militar, que es de Media. Un caso con nombres
   sobre cualquiera de los tres acaba señalando a alguien del pueblo.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Las tres señales ─────────────────────────────────────────────────────
   Lo que de verdad hay que saberse de memoria. La tecnología con que se hace
   el engaño cambia cada año; estas tres no cambian, porque **sin ellas el
   engaño no funciona**: quien engaña necesita que no pienses (urgencia), que
   no consultes (secreto) y que no contestes por donde siempre (canal nuevo).
   Por eso son lo único que no pueden quitar del mensaje. */
const IA_SENALES = [
  { k: 'urgencia', emoji: '⏰', nombre: 'Urgencia',
    suena: '«Es urgente» · «ya» · «antes de que cierren»',
    porque: 'Pensar despacio desarma el engaño. Por eso te quitan el tiempo.',
    defensa: 'Esperá diez minutos. Lo urgente de verdad aguanta.' },
  { k: 'secreto', emoji: '🤫', nombre: 'Secreto',
    suena: '«No le digás a nadie todavía» · «es entre vos y yo»',
    porque: 'El primero a quien le contás lo raro te salva. Por eso te piden callar.',
    defensa: 'Contáselo a alguien antes de hacer nada.' },
  { k: 'canal', emoji: '📵', nombre: 'Canal nuevo',
    suena: '«Este es mi número nuevo» · «escribime por aquí»',
    porque: 'Por el canal de siempre hablarías con la persona de verdad.',
    defensa: 'Volvé por el canal de siempre: el número guardado, la cuenta oficial, o ir en persona.' },
];

/* ── Las cuatro familias ──────────────────────────────────────────────────
   Se reparten por LO QUE TE QUITAN, no por la tecnología con que se hacen: la
   tecnología cambia y la lista quedaría vieja; lo que te quitan, no. Cada
   familia tiene una pregunta madre, y esa pregunta es lo que el alumno se
   lleva puesto cuando cierre la pantalla. */
const IA_FAMILIAS = [
  { k: 'enganan', emoji: '🎭', nombre: 'Te engañan',
    que: 'Fabrican algo que parece verdadero: una voz, un video, una cuenta, un dato. Y hacés lo que no harías.',
    pregunta: '¿Lo comprobé POR OTRO CAMINO?' },
  { k: 'deciden', emoji: '⚖️', nombre: 'Deciden por vos',
    que: 'Un programa decide sobre una persona: si pasa, si entra, quién va primero.',
    pregunta: '¿Con qué ejemplos se entrenó, quién los eligió y a quién le cae el error?' },
  { k: 'guardan', emoji: '🔒', nombre: 'Se quedan con lo tuyo',
    que: 'Lo que subís, tu voz y tu cara quedan en una computadora ajena.',
    pregunta: '¿Esto se lo daría a un desconocido en la calle?' },
  { k: 'criterio', emoji: '🧠', nombre: 'Te quitan el criterio',
    que: 'Te quitan la costumbre de decidir por vos mismo.',
    pregunta: '¿Esto lo decidí yo, y lo puedo explicar?' },
];

/* ── El catálogo ──────────────────────────────────────────────────────────
   `caso` es la persona y su precio; `mecanismo` es qué hace la máquina, sin
   culparla; `pregunta` es lo que lo desarma y `defensa` lo que se hace.
   `soloMecanismo: true` marca los que van SIN caso, a propósito. */
const IA_PELIGROS = [
  { k: 'voz', emoji: '🎙️', nombre: 'La voz fabricada', familia: 'enganan',
    mecanismo: 'Con una grabación corta se fabrica la voz de alguien diciendo lo que sea.',
    caso: 'A Yoselin le llega un audio con la voz de su mamá. Pide la matrícula a un número nuevo, sin contarle a nadie.',
    cuesta: 'la matrícula que la familia junta todo el año',
    pregunta: '¿Llamé yo al número de siempre?',
    defensa: 'Colgá y llamá vos. Acordá en persona una palabra de la familia.' },
  { k: 'video', emoji: '📺', nombre: 'El video de algo que no pasó', familia: 'enganan',
    mecanismo: 'Se fabrica un video de alguien diciendo lo que nunca dijo.',
    caso: 'En el grupo circula un video del director: la escuela cierra el lunes. Llegan doce de cuarenta.',
    cuesta: 'una semana de clases, y que nadie crea la próxima noticia',
    pregunta: '¿Está en la fuente que lo firma?',
    defensa: 'Buscalo en la cuenta oficial de quien aparece. Si solo está en un grupo, lo fabricaron.' },
  { k: 'suplanta', emoji: '🪪', nombre: 'La cuenta que finge ser otra', familia: 'enganan',
    mecanismo: 'Con las fotos de alguien se arma una cuenta que parece la suya.',
    caso: 'A Wilmer le escribe «su primo» desde una cuenta nueva. Le pide una recarga.',
    cuesta: 'el dinero, y una discusión con el primo de verdad',
    pregunta: '¿Por qué me escribe desde otra cuenta?',
    defensa: 'Escribile a la cuenta vieja. Si contesta, la nueva es falsa.' },
  { k: 'remedio', emoji: '🍵', nombre: 'El remedio que cura todo', familia: 'enganan', soloMecanismo: true,
    mecanismo: 'Un texto generado suena a estudio científico. No dice cuál ni quién lo hizo.',
    caso: '',
    cuesta: 'la salud de quien deja su tratamiento',
    pregunta: '¿Qué estudio, quién lo hizo y dónde está?',
    defensa: 'Preguntá en el centro de salud antes de probar nada.' },
  { k: 'opinion', emoji: '📣', nombre: 'La opinión fabricada', familia: 'enganan', soloMecanismo: true,
    mecanismo: 'Una sola persona hace que cien cuentas digan lo mismo. Parecen cien voces. Es una.',
    caso: '',
    cuesta: 'una decisión de todos, tomada creyendo en una mayoría falsa',
    pregunta: '¿Cuántas voces distintas son de verdad?',
    defensa: 'Mirá quién lo dice, no cuántas veces se repite.' },
  { k: 'solicitud', emoji: '📄', nombre: 'El programa que descarta solicitudes', familia: 'deciden',
    mecanismo: 'Un programa lee miles de solicitudes. Descarta las que no se parecen a sus ejemplos.',
    caso: 'A Yoselin le rechazan la beca en cuatro segundos. De escuelas de aldea casi no vio ninguna.',
    cuesta: 'el año de estudio de alguien que cumplía los requisitos',
    pregunta: '¿A quién le cae el error?',
    defensa: 'Pedí que una persona revise la decisión.' },
  { k: 'califica', emoji: '🏫', nombre: 'La máquina que califica', familia: 'deciden',
    mecanismo: 'Un programa entrenado con textos de otro país marca como error las palabras de aquí.',
    caso: 'A Sofía le bajan la nota por escribir «cipote» y «pisto». Así se habla en su casa.',
    cuesta: 'una nota injusta, y aprender a escribir como no habla',
    pregunta: '¿Con qué ejemplos se entrenó?',
    defensa: 'Pedí la revisión y preguntá de dónde salieron los ejemplos.' },
  { k: 'cara', emoji: '👁️', nombre: 'La cara como llave', familia: 'deciden',
    mecanismo: 'Un programa abre la puerta reconociendo caras. Acierta menos con las que casi no vio.',
    caso: 'A doña Rosa el aparato no la reconoce tres de cada diez días.',
    cuesta: 'llegar tarde a su trabajo, y que parezca culpa suya',
    pregunta: '¿A quién no reconoce, y quién responde por eso?',
    defensa: 'Que siempre haya otra forma de entrar.' },
  { k: 'sube', emoji: '📤', nombre: 'Lo que subís queda, y no todo es tuyo', familia: 'guardan',
    mecanismo: 'Lo que subís queda en una computadora ajena. Y sirve para entrenar.',
    caso: 'Marvin sube la foto del salón con los nombres debajo. Son treinta caras que él no preguntó.',
    cuesta: 'la privacidad de treinta compañeros, que ya no se devuelve',
    pregunta: '¿Esto se lo daría a un desconocido en la calle?',
    defensa: 'No subás lo de otros sin preguntar. Ni claves ni datos de tu casa.' },
  { k: 'juguete', emoji: '🧸', nombre: 'El juguete que hace preguntas', familia: 'guardan',
    mecanismo: 'Un juguete que contesta necesita oír para funcionar. Lo que oye sale del cuarto.',
    caso: 'La hermanita de Yoselin le cuenta al juguete dónde trabaja su mamá y a qué hora llega.',
    cuesta: 'que lo de la casa lo sepa una empresa',
    pregunta: '¿Quién oye esto, además de nosotros?',
    defensa: 'No le contés a una máquina las cosas de la familia. Apagá el aparato que oye.' },
  { k: 'recomienda', emoji: '🪝', nombre: 'El que decide qué ves', familia: 'criterio',
    mecanismo: 'Un programa aprende qué te hace quedarte mirando. Te da más de eso.',
    caso: 'Wilmer entra a buscar física. Hora y media después sigue viendo videos que no eligió.',
    cuesta: 'la tarde, y la costumbre de elegir',
    pregunta: '¿Esto lo elegí yo o me lo pusieron?',
    defensa: 'Entrá sabiendo a qué, y salí cuando eso se acabó.' },
  { k: 'compania', emoji: '🤝', nombre: 'El que siempre te da la razón', familia: 'criterio',
    mecanismo: 'Un chat está hecho para seguir la conversación. No te acompaña: predice.',
    caso: 'Sofía le cuenta al chat lo que no le cuenta a nadie. Siempre le da la razón.',
    cuesta: 'quedarse sin la persona que sí la contradice',
    pregunta: '¿Siente, o predice lo que quiero oír?',
    defensa: 'Lo que duele se habla con una persona.' },
  { k: 'entrega', emoji: '📚', nombre: 'El trabajo que no podés explicar', familia: 'criterio',
    mecanismo: 'Un texto generado se entrega perfecto y vacío. A veces inventa datos.',
    caso: 'Marvin entrega un ensayo impecable. En clase no puede explicar el segundo párrafo.',
    cuesta: 'la nota, y la confianza de la maestra',
    pregunta: '¿Lo puedo explicar yo?',
    defensa: 'Usala para entender, y escribí vos. Si la usaste, decilo.' },
];

/* ── El botiquín ──────────────────────────────────────────────────────────
   Seis defensas, y cada una dice también **para qué NO sirve**. Una defensa
   que se vende como buena para todo es peor que ninguna: el día que falla, el
   que confió en ella no tiene plan B. */
const IA_DEFENSAS = [
  { k: 'llamar', emoji: '📞', nombre: 'Volver por el canal de siempre',
    para: 'Cualquier mensaje que pida dinero o algo urgente.',
    noPara: 'No sirve si llamás al número que te mandaron ELLOS.' },
  { k: 'palabra', emoji: '🔑', nombre: 'Una palabra acordada en persona',
    para: 'Comprobar quién está del otro lado, aunque la voz suene igual.',
    noPara: 'No sirve si se escribió en un grupo: ahí la lee cualquiera.' },
  { k: 'fuente', emoji: '🧾', nombre: 'Buscar la fuente que firma',
    para: 'Noticias, datos, leyes y remedios: llegar a quien firma.',
    noPara: 'No sirve encontrar cinco páginas que repiten lo mismo.' },
  { k: 'tres', emoji: '⚖️', nombre: 'Las tres preguntas del sesgo',
    para: 'Todo lo que decide sobre personas.',
    noPara: 'No sirve el porcentaje solo: un 95 % puede fallar siempre con los mismos.' },
  { k: 'ajeno', emoji: '🙈', nombre: 'No subir lo de otros',
    para: 'Fotos, audios y conversaciones de otras personas.',
    noPara: 'No arregla lo que ya se subió.' },
  { k: 'diez', emoji: '⏳', nombre: 'Esperar diez minutos y contarlo',
    para: 'Todo lo que venga con urgencia y con secreto.',
    noPara: 'No sirve si te lo guardás.' },
];

/* ── Los mensajes que llegan ──────────────────────────────────────────────
   La actividad de la sección 🚨: el alumno marca las señales en mensajes de
   verdad. `t` es la señal de cada trozo ('urgencia', 'secreto', 'canal') o
   vacío si no es señal.

   ⚠️ EL CUARTO NO TRAE NINGUNA SEÑAL, y es el más importante de los cuatro.
   Una misión de peligros que solo enseñe mensajes malos fabrica un alumno que
   desconfía de todo, y desconfiar de todo cuesta lo mismo que creerlo todo:
   el maestro manda un aviso de verdad y no lo lee nadie. */
const IA_MENSAJES = [
  { k: 'audio', emoji: '🎙️', de: 'Un audio con la voz de tu mamá', estafa: true,
    trozos: [
      { t: '', txt: 'Mija, soy yo. ' },
      { t: 'urgencia', txt: 'Mandame los dos mil de la matrícula HOY, antes de las cinco. ' },
      { t: 'canal', txt: 'Mandámelos a este número, que el mío se dañó. ' },
      { t: 'secreto', txt: 'No le digás nada a tu papá todavía.' },
    ] },
  { k: 'premio', emoji: '🎁', de: 'Un mensaje de un número desconocido', estafa: true,
    trozos: [
      { t: '', txt: '¡Felicidades! Ganaste un teléfono en el sorteo. ' },
      { t: 'urgencia', txt: 'Tenés 2 horas para reclamarlo o pasa al siguiente. ' },
      { t: 'canal', txt: 'Escribí a este otro número para la entrega. ' },
      { t: 'secreto', txt: 'Es personal: no se lo contés a nadie.' },
    ] },
  { k: 'amigo', emoji: '📱', de: 'Un mensaje de la cuenta de un amigo', estafa: true,
    trozos: [
      { t: '', txt: 'Hermano, ¿me hacés un favor? ' },
      { t: 'urgencia', txt: 'Necesito una recarga ya, es una emergencia. ' },
      { t: 'canal', txt: 'Perdí mi número, este es el nuevo. ' },
      { t: '', txt: 'Te la pago el viernes.' },
    ] },
  { k: 'escuela', emoji: '🏫', de: 'Un mensaje del maestro en el grupo del grado', estafa: false,
    trozos: [
      { t: '', txt: 'Buenas tardes. El jueves a las 2:00 p. m. es la reunión de padres. ' },
      { t: '', txt: 'Si alguien no puede venir, me avisa por aquí. ' },
      { t: '', txt: 'No hay que llevar nada.' },
    ] },
];

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS, IA_MENSAJES };
}
