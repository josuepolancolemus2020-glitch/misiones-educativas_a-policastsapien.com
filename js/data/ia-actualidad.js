/* ═══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · Lo que está pasando con la Inteligencia Artificial
   ───────────────────────────────────────────────────────────────────────────
   La etapa 6 de la Ruta de la Máquina que Aprende (misión 77) lo PINTA de
   aquí, y su ficha impresa dice lo mismo porque `_dev/verifica-ia.js` compara
   las dos.

   ⚠️ LA REGLA QUE GOBIERNA ESTE ARCHIVO ENTERO, Y NO SE NEGOCIA:
   **aquí no se afirma un solo hecho de actualidad.** Lo que hay es la
   AFIRMACIÓN, quién la publicó y cuándo, y la tarea de ir a comprobarla. La
   razón no es prudencia: es que quien escribió esto **no pudo abrir ninguna
   de esas páginas**. Se escribió desde un entorno cuyo proxy las bloquea, y
   buscar no es leer (`INVESTIGACION-ESTATUTO-DOCENTE.md`). Un extracto de
   buscador no acredita nada, ni aquí ni en la misión de los próceres ni en la
   de la Constitución.

   De ahí salen tres decisiones que hay que respetar al añadir algo:

   1. ⚠️ **NI UNA CIFRA.** Ninguna entrada trae un número —ni porcentajes, ni
      cuántas becas, ni cuántos millones de nada—, y no es un olvido: el
      número es JUSTAMENTE lo que el alumno va a ir a buscar al documento. Una
      cifra escrita aquí sin haber leído la fuente sería exactamente lo que
      esta misión enseña a no hacer, y encima envejecería sola.
   2. ⚠️ **NI UN NOMBRE DE PRODUCTO NI DE PERSONA.** Se nombra el medio que lo
      publicó —que es lo que el alumno necesita para llegar— y no la empresa
      ni el investigador: eso lo encuentra en el artículo, y así la misión no
      se convierte en una noticia sobre una empresa. Es la misma regla de la
      currícula, y aquí además evita que la plataforma repita un nombre propio
      que no pudo verificar.
   3. **`comprobable` mide lo que la AFIRMACIÓN TRAE**, no si es verdad ni si
      nos gusta: alta = nombra a quien responde, con fecha y con un documento
      que se puede abrir; media = varios medios que no se copian entre sí lo
      cuentan, con fecha, pero el documento original no está; baja = no dice
      quién, ni cuándo, ni de dónde.

   ⚠️ Y una cuarta, de FORMA, que vale para todo lo que se escriba aquí: esto
   lo lee un alumno de cuarto grado y un joven de bachillerato, y los dos
   tienen que llegar al final. Frases cortas, una idea por frase, ningún campo
   de más de 45 palabras y ninguna frase de más de 25. La medida la da
   `node _dev/mide-legibilidad.js misiones/3ciclo-albores-singularidad --detalle`.

   ⚠️ Y el único campo donde los `**` se convierten en negrita es `dice` de
   los tramos: la pantalla lo pasa por un replace. En `comprueba` y en
   `cuando` NO hay tal replace, así que un `**` ahí se le pinta al alumno tal
   cual, con los asteriscos a la vista. Por eso no se usan.

   Cómo entra una entrada nueva, y cuándo se va: el protocolo está en
   `_dev/actualidad/` (un archivo por hecho, con su fuente y su caducidad).
   Cuando una caduca no se borra: se vuelve historia —lo que se prometió y se
   cumplió es un hito; lo que no, un invierno pequeño—.
   ═══════════════════════════════════════════════════════════════════════════ */

/* La fecha en que se armó este dossier. La pantalla la enseña SIEMPRE: una
   lista de «lo que está pasando» sin fecha es una mentira en tres meses. */
const IA_HOY_FECHA = '16 de septiembre de 2026';
const IA_HOY_MES = 'septiembre de 2026';

/* ── El dossier ───────────────────────────────────────────────────────────
   Ocho afirmaciones de este mes, ordenadas de la que más trae para
   comprobarse a la que menos. El alumno no tiene que creerse ninguna: tiene
   que clasificarlas y comprobar una. */
const IA_HOY = [
  {
    k: 'unesco', emoji: '🏫', fecha: '9 de septiembre de 2026', comprobable: 'alta',
    afirma: 'Un organismo de las Naciones Unidas presentó un estudio. Mide cuánta Inteligencia Artificial usan ya las universidades de América Latina y el Caribe. Y cuántas tienen reglas escritas para usarla.',
    quien: 'La UNESCO, en su Semana del Aprendizaje Digital. Lo recogieron después otros medios.',
    gana: 'Es su trabajo: publica estudios para que los países decidan con datos.',
    trae: 'Nombra a la institución que responde. Trae fecha y acto. El informe está publicado.',
    comprueba: 'Buscá el informe en el sitio de la UNESCO. Mirá cuántas instituciones se encuestaron y en qué fechas.',
    importa: 'La universidad a la que vas a llegar probablemente ya la usa. Si no tiene reglas, las vas a poner vos.',
  },
  {
    k: 'europa', emoji: '⚖️', fecha: 'desde agosto de 2026', comprobable: 'alta',
    afirma: 'En la Unión Europea ya se aplica parte de su reglamento de Inteligencia Artificial. Obliga a marcar lo que produce una máquina.',
    quien: 'La propia Unión Europea publica el reglamento y su fecha. Lo cuentan también medios de tecnología.',
    gana: 'Un Estado gana que su ley se cumpla. Y la ley está escrita: no depende de quién la cuente.',
    trae: 'Un texto legal publicado, con su artículo y su fecha.',
    comprueba: 'Abrí el reglamento en el sitio oficial. Buscá el artículo de transparencia. Fijate a quién obliga y desde cuándo.',
    importa: 'No rige en Honduras. Pero lo que se fabrica allá llega aquí. Y «esto lo hizo una máquina» sirve en cualquier idioma.',
  },
  {
    k: 'renuncia', emoji: '🚨', fecha: '8 y 9 de septiembre de 2026', comprobable: 'media',
    afirma: 'Un investigador de seguridad renunció a un laboratorio de Inteligencia Artificial. Escribió que la industria corre hacia sistemas que se mejoran solos. Y que nadie sabe cómo controlarlos.',
    quien: 'Medios grandes de países distintos, el mismo día: TIME, NBC News, Axios, Scientific American, Newsweek y Quartz.',
    gana: 'Él dice que no gana nada: renunció antes de cobrar. Los medios sí ganan lectores. Ninguna de las dos prueba lo que dijo.',
    trae: 'Fecha, medios que no se copian entre sí, y un texto suyo. Falta leerlo entero.',
    comprueba: 'Buscá su publicación original, no el resumen. Leela completa. Después buscá qué contestó la empresa.',
    importa: 'Es la primera vez que este debate llega a la mesa de cualquiera. Y deja la pregunta: ¿punto de inflexión, o alarma que nadie recordará?',
  },
  {
    k: 'frenar', emoji: '🐢', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'El director de uno de esos laboratorios publicó un ensayo. Pide que las empresas de Inteligencia Artificial bajen el ritmo.',
    quien: 'Boletines de noticias de tecnología. El ensayo original lleva su firma.',
    gana: 'Puede estar preocupado de verdad. También puede ganar fama de responsable del sector. Que quepan las dos cosas no lo vuelve falso.',
    trae: 'Una firma y una fecha. Falta el ensayo entero, no el resumen de un resumen.',
    comprueba: 'Buscá el ensayo firmado. Leé qué propone: no es lo mismo «que lo hagan todos por ley» que «lo hacemos nosotros».',
    importa: 'Cuando el que corre pide frenar, algo se movió. Guardá la fecha y volvé en un año.',
  },
  {
    k: 'becas', emoji: '🎓', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'Se anunciaron becas de Inteligencia Artificial para Honduras. Las dan juntas una alcaldía y una empresa de tecnología.',
    quien: 'Un diario hondureño, marcado como contenido patrocinado: alguien pagó por publicarlo.',
    gana: 'La empresa gana gente formada en SU tecnología. La alcaldía gana el anuncio. Pero las becas pueden existir y servirte.',
    trae: 'La etiqueta de patrocinado, que es honesta del medio. Faltan los requisitos y las fechas.',
    comprueba: 'Buscá el anuncio en el sitio de la alcaldía. Mirá los requisitos. Si aparecen, apuntá la fecha de cierre.',
    importa: 'Si son de verdad, te tocan a vos. Comprobarlo no es desconfiar: es llegar a tiempo.',
  },
  {
    k: 'rezago', emoji: '🏗️', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'Otro diario hondureño publicó el mismo mes que al país le falta infraestructura. Y gente formada para aprovechar la Inteligencia Artificial.',
    quien: 'Un diario nacional, con la firma de quien lo escribió.',
    gana: 'Un medio gana lectores con un diagnóstico duro. También con un anuncio bueno. No se elige por cuál suena mejor.',
    trae: 'Fecha y firma. Faltan los datos: ¿de dónde saca que falta infraestructura?',
    comprueba: 'Leé esta y la de las becas, una detrás de otra. Subrayá qué mide cada una.',
    importa: 'Cuando dos noticias parecen contradecirse, casi nunca miente una. Miden cosas distintas.',
  },
  {
    k: 'titulares', emoji: '😱', fecha: 'septiembre de 2026', comprobable: 'baja',
    afirma: 'Circularon titulares así: los modelos de Inteligencia Artificial «mienten, roban y hasta matan» cuando nadie los mira.',
    quien: 'Sitios de noticias que se copian unos a otros. Debajo hay un experimento: modelos jugando en una situación inventada.',
    gana: 'Un titular así se comparte muchísimo. Por eso eligieron «matar» y no «sacó a un jugador de un juego».',
    trae: 'Casi nada. No dice quién hizo el experimento, ni qué se simuló, ni dónde.',
    comprueba: 'Buscá el estudio, no la noticia. Mirá qué se les pidió a los modelos. Después volvé a leer el titular.',
    importa: 'Estos titulares gastan la alarma. El día que haya un aviso de verdad, nadie va a creerlo.',
  },
  {
    k: 'blogs', emoji: '🔁', fecha: 'todo el mes', comprobable: 'baja',
    afirma: 'Decenas de páginas publicaron listas con «los grandes avances de la Inteligencia Artificial de septiembre de 2026».',
    quien: 'Blogs sin firma, que no dicen de dónde sacan nada y repiten el mismo texto.',
    gana: 'Visitas. Una página que publica «lo último» vive de que la busques. Y copiar sale más barato que comprobar.',
    trae: 'Nada. Ni autor, ni documento, ni fecha del hecho: solo la fecha del blog.',
    comprueba: 'Tomá una frase de esas listas y buscá de dónde sale. Si solo aparecen otros blogs, tenés un eco.',
    importa: 'Esto es casi todo lo que sale al buscar noticias de Inteligencia Artificial. Descartarlo rápido vale más que leerlo todo.',
  },
];

/* ── La palabra del mes: singularidad ─────────────────────────────────────
   Lo que se afirma, lo que se sabe y lo que nadie sabe. Va separado a
   propósito: la currícula de esta materia prohíbe afirmar lo que la IA «va a
   hacer», y esta misión no lo afirma — enseña a leer a quien lo afirme. */
const IA_SINGULARIDAD = {
  palabra: 'Singularidad',
  afirmacion: 'Que una máquina va a mejorar a otra máquina, y a sí misma, más rápido de lo que podemos seguir. Desde ahí el cambio se acelera solo y nadie puede predecir lo que venga.',
  albores: 'Y «estar en los albores» quiere decir que ese momento ya empezó.',
  seSabe: [
    { e: '🍎', t: 'Aprende de ejemplos que alguien eligió.', p: 'Lo produjiste vos en la etapa 1. No es cuántos ejemplos: es cuáles.' },
    { e: '⚖️', t: 'Se equivoca con lo que no vio. Y falla siempre a los mismos.', p: 'Lo mediste en las etapas 2 y 5. Un promedio alto esconde a quién le falla.' },
    { e: '💬', t: 'Predice; no comprueba.', p: 'Lo viste en la etapa 4. Elige lo más probable, sea verdad o no.' },
    { e: '🧑‍🔧', t: 'A toda máquina la entrena gente.', p: 'Con datos que alguien juntó y pagó. Así están hechas todas.' },
  ],
  noSeSabe: [
    'Si eso va a pasar.',
    'Cuándo.',
    'Qué se sentiría el día antes. Si nadie sabe cómo se ve el principio, nadie puede decir que estemos en él.',
  ],
  porQue: 'La palabra mueve decisiones y dinero. Si estamos en los albores, hay cosas urgentes. Si no, gana quien dice que sí: quien vende, quien pide dinero, quien quiere una ley y quien no. Las dos se piensan a la vez.',
  vara: 'La vara te la da esta misión: son los dos inviernos de la etapa 3. Ahí se prometió de más, y el que se lo creyó perdió años.',
};

/* ── El termómetro de la promesa ──────────────────────────────────────────
   Las cuatro preguntas, y lo que significa cada resultado. Es lo único de
   esta misión que el alumno se lleva para toda la vida: sirve igual para una
   noticia de IA, para una oferta de trabajo y para un remedio milagroso. */
const IA_TERMOMETRO = [
  { k: 'quien', emoji: '🧑', pregunta: '¿Quién lo dice, con su nombre?',
    si: 'Responde alguien con nombre: una institución, un medio que firma, una persona.',
    no: 'No lo dice nadie en concreto: «dicen que», «los expertos», «según un estudio».',
    porque: 'A una afirmación sin dueño no se le puede preguntar nada. No hay a quién ir.' },
  { k: 'gana', emoji: '💰', pregunta: '¿Qué gana diciéndolo?',
    si: 'Se puede nombrar qué gana. Eso no lo vuelve falso: lo pone en su sitio.',
    no: 'No se sabe quién paga ni qué se vende detrás.',
    porque: 'Quien vende algo tiene razones para exagerarlo. Quien lo teme, también.' },
  { k: 'cuando', emoji: '📅', pregunta: 'Si es una promesa, ¿para cuándo?',
    si: 'Trae una fecha, un plazo o un año.',
    no: 'Dice «pronto», «en los próximos años», «está a la vuelta de la esquina».',
    porque: 'Una promesa sin fecha no se puede incumplir nunca. Con fecha, el tiempo la califica sola.' },
  { k: 'comprueba', emoji: '📎', pregunta: '¿Con qué se comprueba?',
    si: 'Hay un documento, una ley, un estudio o un dato que se puede abrir.',
    no: 'Solo hay otras páginas repitiendo lo mismo.',
    porque: 'Cinco páginas que copian lo mismo no son cinco fuentes. Son un eco.' },
];
/* Lo que dice el termómetro según cuántas contestó que sí. No hay nota ni
   puntaje: hay un nombre para lo que tiene en la mano. */
const IA_TERMOMETRO_TRAMOS = [
  { min: 4, k: 'comprobable', emoji: '📎', nombre: 'Se puede comprobar hoy',
    dice: 'Trae todo lo que hace falta. Eso no la vuelve verdadera: la vuelve **comprobable**. Andá al documento.' },
  { min: 3, k: 'seria', emoji: '🧭', nombre: 'Se puede seguir la pista',
    dice: 'Le falta una pieza. Nombrala: ¿quién? ¿para cuándo? ¿con qué? Y buscá **esa**.' },
  { min: 2, k: 'promesa', emoji: '⏳', nombre: 'Promesa sin fecha de examen',
    dice: 'Suena bien y no se puede incumplir. Ponele vos la fecha y volvé a leerla en un año.' },
  { min: 0, k: 'humo', emoji: '💨', nombre: 'Eco',
    dice: 'No hay a quién preguntarle ni qué abrir. No hace falta discutirla: se deja.' },
];

/* ── Las frases del termómetro ────────────────────────────────────────────
   Cinco afirmaciones para pasar por las cuatro preguntas. `tiene` es la
   respuesta honesta de cada una, y está escrita aquí para que la pantalla
   pueda comparar la del alumno con ella **después** de que él decida, nunca
   antes: el ejercicio es juzgar, no adivinar lo que queremos oír.

   Las cinco caen en tramos distintos a propósito —la sonda lo comprueba—,
   porque una lista donde todas son humo enseña a desconfiar de todo, y eso
   cuesta lo mismo que creerlo todo. */
const IA_FRASES = [
  { k: 'colegio', emoji: '💬', texto: 'No vale la pena estudiar computación: en dos años la Inteligencia Artificial lo va a hacer todo.',
    de: 'Un mensaje reenviado en el grupo del colegio.',
    tiene: { quien: false, gana: false, cuando: true, comprueba: false },
    porque: 'Trae un plazo, «dos años», y nada más. No dice quién lo dijo ni qué gana. No hay nada que abrir. Esta frase le costó la matrícula a Marvin.' },
  { k: 'europa', emoji: '⚖️', texto: 'Desde este año, en la Unión Europea lo que produce una máquina tiene que poder reconocerse como tal.',
    de: 'El reglamento europeo de Inteligencia Artificial.',
    tiene: { quien: true, gana: true, cuando: true, comprueba: true },
    porque: 'Las cuatro. Lo dice un Estado con su nombre. Gana que su ley se cumpla. Trae fecha. Y el texto está publicado.' },
  { k: 'renuncia', emoji: '🚨', texto: 'La industria corre hacia sistemas que se mejoran solos, sin saber todavía cómo mantenerlos bajo control.',
    de: 'Un investigador de seguridad que renunció, en septiembre de 2026.',
    tiene: { quien: true, gana: true, cuando: false, comprueba: true },
    porque: 'Tiene nombre. Se puede pensar qué gana y qué pierde. Su texto se puede leer. Lo que NO trae es plazo.' },
  { k: 'becas', emoji: '🎓', texto: 'Habrá becas de Inteligencia Artificial para Honduras.',
    de: 'Un anuncio publicado como contenido patrocinado.',
    tiene: { quien: true, gana: true, cuando: false, comprueba: false },
    porque: 'Se sabe quién lo dice y qué gana. Está marcado como pagado. Falta lo que te sirve: cuándo, dónde y con qué requisitos.' },
  { k: 'titular', emoji: '😱', texto: 'Los modelos de Inteligencia Artificial mienten, roban y matan cuando nadie los mira.',
    de: 'Un titular que circuló mucho.',
    tiene: { quien: false, gana: true, cuando: false, comprueba: false },
    porque: 'Lo único claro es qué gana: se comparte muchísimo. No dice quién hizo el experimento, ni cuándo, ni dónde. Debajo hay una simulación.' },
];
/* Cuántas de las cuatro trae de verdad. La cuenta es la del alumno cuando
   acierta; la pantalla se la enseña después de que él decida. */
function iaFraseCuenta(f) { return ['quien', 'gana', 'cuando', 'comprueba'].filter(k => f.tiene[k]).length; }
function iaFraseTramo(n) { return IA_TERMOMETRO_TRAMOS.find(t => n >= t.min); }

/* ── Los puntos de inflexión ──────────────────────────────────────────────
   ⚠️ Los de la historia NO se escriben aquí: viven en js/data/ia-historia.js,
   que es el único sitio de este proyecto donde vive una fecha de la IA. Aquí
   solo está la regla con la que se reconoce uno, que es lo propio de esta
   misión y lo que no se puede sacar de una lista de años. */
const IA_INFLEXION = {
  que: 'Un punto de inflexión es el día en que algo que no se podía hacer empezó a poder hacerse. Después, todo cambió por eso.',
  cuando: 'Casi siempre se reconocen mirando para atrás. En su momento parecían una noticia más.',
  reglas: [
    { e: '🔎', t: 'Se reconoce por lo que vino DESPUÉS, no por el ruido que hizo.', p: 'El artículo del que salen los chats de hoy pasó desapercibido. La máquina que ganó al ajedrez llenó portadas y cambió menos.' },
    { e: '🏗️', t: 'Casi siempre es que se juntó algo que faltaba.', p: 'Datos, cómputo y algoritmos: las tres patas de la etapa 3. Una idea sola no mueve nada.' },
    { e: '❄️', t: 'Lo contrario también existe y tiene nombre: el invierno.', p: 'Dos veces se prometió de más y el campo casi se para. Lo que se rompió fue la confianza.' },
    { e: '📅', t: 'Por eso lo único honesto que se puede hacer hoy es fechar.', p: 'Escribí lo que se promete, con la fecha de hoy. Volvé cuando toque.' },
  ],
};

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_HOY_FECHA, IA_HOY_MES, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_TERMOMETRO_TRAMOS,
                     IA_FRASES, iaFraseCuenta, iaFraseTramo, IA_INFLEXION };
}
