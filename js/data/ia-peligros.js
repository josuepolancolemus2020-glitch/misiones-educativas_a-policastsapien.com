/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Los peligros de la Inteligencia Artificial
   ───────────────────────────────────────────────────────────────────────────
   La etapa 5 de la Ruta de la Máquina que Aprende (misión 76) los PINTA de
   aquí, y su ficha impresa dice lo mismo porque `_dev/verifica-ia.js` compara
   las dos. Es el mismo patrón del Himno, los próceres y la Constitución, y
   aquí la razón es más fuerte que en ninguna: un peligro mal nombrado en la
   pantalla y bien nombrado en el papel le enseña al alumno que ninguno de los
   dos es de fiar, que es justo lo contrario de lo que esta misión hace.

   ⚠️ TRES REGLAS PARA ESCRIBIR AQUÍ, y ninguna es de adorno:

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
    suena: '«Es urgente» · «ya» · «antes de que cierren» · «no hay tiempo»',
    porque: 'Pensar despacio es lo que desarma cualquier engaño, así que lo primero que te quitan es el tiempo.',
    defensa: 'Esperá diez minutos. Lo que es de verdad urgente aguanta diez minutos; lo que no aguanta, no era de verdad.' },
  { k: 'secreto', emoji: '🤫', nombre: 'Secreto',
    suena: '«No le digás a nadie todavía» · «después te explico» · «es entre vos y yo»',
    porque: 'La primera persona a la que le contás lo raro es la que te salva. Por eso te piden que no se lo cuentes a nadie.',
    defensa: 'Contáselo a alguien antes de hacer nada. En voz alta, lo raro se oye raro.' },
  { k: 'canal', emoji: '📵', nombre: 'Canal nuevo',
    suena: '«Este es mi número nuevo» · «mandalo a esta cuenta» · «escribime por aquí»',
    porque: 'Si contestaras por donde siempre, hablarías con la persona de verdad. Todo el engaño depende de que no lo hagas.',
    defensa: 'Volvé por el canal de siempre: el número que ya tenías guardado, la cuenta oficial, la persona en su casa.' },
];

/* ── Las cuatro familias ──────────────────────────────────────────────────
   Se reparten por LO QUE TE QUITAN, no por la tecnología con que se hacen: la
   tecnología cambia y la lista quedaría vieja; lo que te quitan, no. Cada
   familia tiene una pregunta madre, y esa pregunta es lo que el alumno se
   lleva puesto cuando cierre la pantalla. */
const IA_FAMILIAS = [
  { k: 'enganan', emoji: '🎭', nombre: 'Te engañan',
    que: 'Se fabrica algo que parece verdadero —una voz, un video, una cuenta, un dato— para que hagas algo que no harías.',
    pregunta: '¿Lo comprobé POR OTRO CAMINO?' },
  { k: 'deciden', emoji: '⚖️', nombre: 'Deciden por vos',
    que: 'Un programa decide algo sobre una persona: si pasa, si entra, si se le atiende primero.',
    pregunta: '¿Con qué ejemplos se entrenó, quién los eligió y a quién le cae el error?' },
  { k: 'guardan', emoji: '🔒', nombre: 'Se quedan con lo tuyo',
    que: 'Lo que escribís, lo que subís, tu voz y tu cara quedan guardados en una computadora que no es tuya.',
    pregunta: '¿Esto se lo daría a un desconocido en la calle?' },
  { k: 'criterio', emoji: '🧠', nombre: 'Te quitan el criterio',
    que: 'No te quitan dinero ni datos: te quitan la costumbre de decidir y de entender por vos mismo.',
    pregunta: '¿Esto lo decidí yo, y lo puedo explicar?' },
];

/* ── El catálogo ──────────────────────────────────────────────────────────
   `caso` es la persona y su precio; `mecanismo` es qué hace la máquina, sin
   culparla; `pregunta` es lo que lo desarma y `defensa` lo que se hace.
   `soloMecanismo: true` marca los que van SIN caso, a propósito. */
const IA_PELIGROS = [
  { k: 'voz', emoji: '🎙️', nombre: 'La voz fabricada', familia: 'enganan',
    mecanismo: 'Con una grabación corta de alguien —un video de un cumpleaños, un audio del grupo— se fabrica su voz diciendo lo que sea.',
    caso: 'A Yoselin le llega un audio con la voz de su mamá pidiéndole el dinero de la matrícula de su hermano, a un número nuevo y sin contarle a nadie.',
    cuesta: 'la matrícula del hermano, que la familia junta todo el año',
    pregunta: '¿Llamé yo al número de siempre?',
    defensa: 'Colgar y llamar vos. Y acordar en persona una palabra de la familia, que nunca se escriba en un grupo.' },
  { k: 'video', emoji: '📺', nombre: 'El video de algo que no pasó', familia: 'enganan',
    mecanismo: 'Se fabrica un video de una persona diciendo lo que nunca dijo, con su cara y su voz.',
    caso: 'En el grupo de la comunidad circula un video donde el director anuncia que la escuela cierra el lunes. El lunes llegan doce alumnos de cuarenta.',
    cuesta: 'una semana de clases, y que a la próxima noticia de verdad ya no la crea nadie',
    pregunta: '¿Está en la fuente que lo firma?',
    defensa: 'Buscarlo en la cuenta oficial de quien aparece. Si solo existe en un grupo de mensajes, no es una noticia: es un archivo que alguien fabricó.' },
  { k: 'suplanta', emoji: '🪪', nombre: 'La cuenta que se hace pasar por otro', familia: 'enganan',
    mecanismo: 'Con las fotos y la forma de escribir de alguien se arma una cuenta que parece la suya, y le escribe a sus contactos.',
    caso: 'A Wilmer le escribe «su primo» desde una cuenta nueva pidiéndole una recarga; el primo no perdió el teléfono: alguien copió su perfil.',
    cuesta: 'el dinero, y una discusión con el primo de verdad',
    pregunta: '¿Por qué me escribe desde otra cuenta?',
    defensa: 'Escribirle a la cuenta vieja. Si la cuenta vieja contesta, la nueva es falsa.' },
  { k: 'remedio', emoji: '🍵', nombre: 'El remedio que cura todo', familia: 'enganan', soloMecanismo: true,
    mecanismo: 'Un texto generado suena a estudio científico, sin decir cuál, quién lo hizo ni dónde está publicado. Con la salud, eso no es un dato: es un riesgo.',
    caso: '',
    cuesta: 'la salud de quien deja su tratamiento',
    pregunta: '¿Qué estudio, quién lo hizo y dónde está?',
    defensa: 'Preguntar en el centro de salud antes de probar nada. Lo que no se puede comprobar no se prueba en el cuerpo de nadie.' },
  { k: 'opinion', emoji: '📣', nombre: 'La opinión fabricada', familia: 'enganan', soloMecanismo: true,
    mecanismo: 'Una sola persona puede hacer que cien cuentas distintas digan lo mismo el mismo día. Parecen cien voces; es una.',
    caso: '',
    cuesta: 'que una decisión de todos se tome creyendo que la mayoría piensa algo que nadie piensa',
    pregunta: '¿Cuántas voces distintas son de verdad?',
    defensa: 'Mirar quién lo dice, no cuántas veces lo repiten. Y buscar a alguien que responda por lo que dice con su nombre.' },
  { k: 'solicitud', emoji: '📄', nombre: 'El programa que descarta solicitudes', familia: 'deciden',
    mecanismo: 'Un programa lee miles de solicitudes y descarta las que no se parecen a los ejemplos con que lo entrenaron.',
    caso: 'A Yoselin le rechazan la beca en cuatro segundos: su escuela de aldea no se parecía a ninguna de las del entrenamiento.',
    cuesta: 'el año de estudio de alguien que cumplía los requisitos',
    pregunta: '¿A quién le cae el error?',
    defensa: 'Pedir que una persona revise. Una decisión sobre una persona la revisa una persona.' },
  { k: 'califica', emoji: '🏫', nombre: 'La máquina que califica', familia: 'deciden',
    mecanismo: 'Un programa entrenado con textos de otro país marca como error las palabras de aquí.',
    caso: 'A Sofía le bajan la nota de redacción por escribir «cipote», «chucho» y «pisto», que es como se habla en su casa.',
    cuesta: 'una nota injusta, y que aprenda a escribir como no habla',
    pregunta: '¿Con qué ejemplos se entrenó?',
    defensa: 'Pedir la revisión y preguntar de dónde salieron los ejemplos. El programa se cambia; el idioma de un pueblo, no.' },
  { k: 'cara', emoji: '👁️', nombre: 'La cara como llave', familia: 'deciden',
    mecanismo: 'Un programa reconoce caras para abrir una puerta o marcar la entrada, y acierta menos con las caras que casi no vio al entrenarse.',
    caso: 'A doña Rosa el aparato de la entrada no la reconoce tres de cada diez días, y tiene que esperar a que alguien la deje pasar.',
    cuesta: 'llegar tarde a su propio trabajo, y que parezca culpa suya',
    pregunta: '¿A quién no reconoce, y quién responde por eso?',
    defensa: 'Que siempre haya otra forma de entrar. Un sistema que no tiene segunda puerta deja gente afuera.' },
  { k: 'sube', emoji: '📤', nombre: 'Lo que subís queda, y no todo es tuyo', familia: 'guardan',
    mecanismo: 'Lo que se escribe o se sube a un servicio queda guardado en una computadora que no es tuya, y puede usarse para entrenar.',
    caso: 'Marvin sube al grupo la foto de todo el salón con los nombres escritos debajo; en esa foto hay treinta caras que él no preguntó si podía subir.',
    cuesta: 'la privacidad de treinta compañeros, que ya no se puede devolver',
    pregunta: '¿Esto se lo daría a un desconocido en la calle?',
    defensa: 'No subir lo de otros sin preguntar, y no escribir nunca datos de la familia, claves ni direcciones.' },
  { k: 'juguete', emoji: '🧸', nombre: 'El juguete que hace preguntas', familia: 'guardan',
    mecanismo: 'Un juguete o un asistente que contesta necesita oír para funcionar, y lo que oye sale del cuarto.',
    caso: 'La hermanita de Yoselin le cuenta al juguete cómo se llama su mamá, dónde trabaja y a qué hora llega.',
    cuesta: 'que lo que sabe la casa lo sepa una empresa, y a veces cualquiera',
    pregunta: '¿Quién oye esto, además de nosotros?',
    defensa: 'La regla 1 de siempre: a una máquina no se le cuentan las cosas de la familia. Y los aparatos que oyen se apagan cuando no se usan.' },
  { k: 'recomienda', emoji: '🪝', nombre: 'El que decide qué ves', familia: 'criterio',
    mecanismo: 'Un programa aprende qué te hace quedarte mirando y te da más de eso, no lo que más te sirve.',
    caso: 'Wilmer entra a buscar una explicación de física y a la hora y media sigue viendo videos que no eligió.',
    cuesta: 'la tarde, y la costumbre de elegir',
    pregunta: '¿Esto lo elegí yo o me lo pusieron?',
    defensa: 'Entrar sabiendo a qué, y salir cuando eso se acabó. Buscar es tuyo; que te vayan poniendo, no.' },
  { k: 'compania', emoji: '🤝', nombre: 'El que siempre te da la razón', familia: 'criterio',
    mecanismo: 'Un chat está hecho para seguir la conversación, así que tiende a contestar lo que encaja con lo que escribiste. No te acompaña: predice.',
    caso: 'Sofía le cuenta a un chat lo que no le cuenta a nadie, y el chat siempre le contesta que tiene razón.',
    cuesta: 'quedarse sin la persona que sí la iba a contradecir cuando hacía falta',
    pregunta: '¿Siente, o predice lo que quiero oír?',
    defensa: 'Lo que duele se habla con una persona. Una máquina no se acuerda de vos mañana ni va a tocar tu puerta.' },
  { k: 'entrega', emoji: '📚', nombre: 'El trabajo que no podés explicar', familia: 'criterio',
    mecanismo: 'Un texto generado se entrega perfecto y vacío: no lo escribiste vos y a veces trae datos inventados.',
    caso: 'Marvin entrega un ensayo impecable y en clase no puede explicar el segundo párrafo, que citaba un decreto que no existe.',
    cuesta: 'la nota, y la confianza de la maestra, que cuesta más recuperar',
    pregunta: '¿Lo puedo explicar yo?',
    defensa: 'Usarla para entender y escribir vos. Y cuando se usa, decirlo: declarar dónde ayudó enseña dónde está tu aporte.' },
];

/* ── El botiquín ──────────────────────────────────────────────────────────
   Seis defensas, y cada una dice también **para qué NO sirve**. Una defensa
   que se vende como buena para todo es peor que ninguna: el día que falla, el
   que confió en ella no tiene plan B. */
const IA_DEFENSAS = [
  { k: 'llamar', emoji: '📞', nombre: 'Volver por el canal de siempre',
    para: 'Cualquier mensaje que pida dinero, datos o una acción urgente: la voz, el video, la cuenta nueva.',
    noPara: 'No sirve si llamás al número que te mandaron ELLOS. Tiene que ser el que ya tenías.' },
  { k: 'palabra', emoji: '🔑', nombre: 'Una palabra acordada en persona',
    para: 'Comprobar que del otro lado está quien dice ser, aunque la voz suene igual.',
    noPara: 'No sirve si se escribió alguna vez en un grupo o en un mensaje: ahí ya la puede leer cualquiera.' },
  { k: 'fuente', emoji: '🧾', nombre: 'Buscar la fuente que firma',
    para: 'Noticias, datos, leyes, remedios: llegar a quien responde por el dato con su nombre.',
    noPara: 'No sirve encontrar cinco páginas que repiten lo mismo sin decir de dónde lo sacaron.' },
  { k: 'tres', emoji: '⚖️', nombre: 'Las tres preguntas del sesgo',
    para: 'Todo lo que decide algo sobre personas: con qué ejemplos, quién los eligió, a quién le cae el error.',
    noPara: 'No sirve el porcentaje de aciertos solo: un 95 % puede fallar siempre con los mismos.' },
  { k: 'ajeno', emoji: '🙈', nombre: 'No subir lo de otros',
    para: 'Fotos, audios y conversaciones de otras personas, que no son tuyas para publicarlas.',
    noPara: 'No arregla lo que ya se subió: lo que salió, salió. Por eso esta se aplica antes.' },
  { k: 'diez', emoji: '⏳', nombre: 'Esperar diez minutos y contarlo',
    para: 'Todo lo que venga con urgencia y con secreto, que son dos de las tres señales.',
    noPara: 'No sirve si el que engaña logra que no se lo cuentes a nadie: por eso la espera va con el contárselo.' },
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
      { t: 'urgencia', txt: 'Necesito que me mandés los dos mil de la matrícula HOY MISMO, antes de las cinco. ' },
      { t: 'canal', txt: 'Mandámelos a este número, que el mío se dañó. ' },
      { t: 'secreto', txt: 'No le digás nada a tu papá todavía, después le explico yo.' },
    ] },
  { k: 'premio', emoji: '🎁', de: 'Un mensaje de un número desconocido', estafa: true,
    trozos: [
      { t: '', txt: '¡Felicidades! Ganaste un teléfono en el sorteo de la feria. ' },
      { t: 'urgencia', txt: 'Tenés 2 horas para reclamarlo o pasa al siguiente. ' },
      { t: 'canal', txt: 'Escribí a este otro número para los datos de entrega. ' },
      { t: 'secreto', txt: 'Es un premio personal: no lo compartás con nadie.' },
    ] },
  { k: 'amigo', emoji: '📱', de: 'Un mensaje de la cuenta de un amigo', estafa: true,
    trozos: [
      { t: '', txt: 'Hermano, ¿me hacés un favor? ' },
      { t: 'urgencia', txt: 'Necesito una recarga ya, es una emergencia. ' },
      { t: 'canal', txt: 'Perdí mi número, este es el nuevo. ' },
      { t: '', txt: 'Te la pago el viernes sin falta.' },
    ] },
  { k: 'escuela', emoji: '🏫', de: 'Un mensaje del maestro en el grupo del grado', estafa: false,
    trozos: [
      { t: '', txt: 'Buenas tardes. Recuerden que el jueves es la reunión de padres a las 2:00 p. m. en el aula. ' },
      { t: '', txt: 'Si alguien no puede venir, me avisa por aquí mismo y buscamos otro día. ' },
      { t: '', txt: 'No hay que llevar nada.' },
    ] },
];

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_SENALES, IA_FAMILIAS, IA_PELIGROS, IA_DEFENSAS, IA_MENSAJES };
}
