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
      nos gusta: alta = nombra a quien responde por ella, con fecha y con un
      documento que se puede abrir; media = varios medios que no se copian
      entre sí lo cuentan, con fecha, pero el documento original no está;
      baja = no dice quién, ni cuándo, ni de dónde.

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
    afirma: 'Un organismo de las Naciones Unidas presentó un estudio sobre cuánta Inteligencia Artificial se usa ya en las universidades de América Latina y el Caribe, y sobre cuántas de ellas tienen reglas escritas para usarla.',
    quien: 'La UNESCO, en su Semana del Aprendizaje Digital, en París. Lo recogieron después varios medios y sitios universitarios de la región.',
    gana: 'Es su trabajo: publica estudios para que los países decidan con datos. Un organismo que publica su método y sus números se puede discutir; ahí está la diferencia.',
    trae: 'Nombra a la institución que responde, la fecha y el acto donde se presentó. El informe está publicado.',
    comprueba: 'Buscá el informe en el sitio de la UNESCO. Mirá **cuántas instituciones** se encuestaron, **de cuántos países** y **en qué fechas**: esos tres números cambian lo que el titular significa.',
    importa: 'La universidad a la que vas a llegar probablemente ya la usa. Si no tiene reglas escritas, las vas a tener que poner vos y tus compañeros.',
  },
  {
    k: 'europa', emoji: '⚖️', fecha: 'desde agosto de 2026', comprobable: 'alta',
    afirma: 'En la Unión Europea entró en aplicación la parte de su reglamento de Inteligencia Artificial que obliga a que lo generado por una máquina se pueda identificar como tal.',
    quien: 'La propia Unión Europea publica el reglamento y la fecha en que cada parte empieza a aplicarse. Lo cuentan además medios de tecnología.',
    gana: 'Un Estado que aprueba una ley gana que se cumpla; y lo que dice la ley no depende de quién lo cuente: está escrito y es gratis de leer.',
    trae: 'Un texto legal publicado, con número de artículo y fecha de entrada en vigor. Es lo más comprobable que existe.',
    comprueba: 'Abrí el texto del reglamento en el sitio oficial y buscá el artículo de transparencia. Fijate **a quién obliga** y **desde cuándo**, que es donde los titulares se equivocan.',
    importa: 'No rige en Honduras. Pero lo que se fabrica allá llega aquí, y una etiqueta que diga «esto lo hizo una máquina» sirve en cualquier idioma.',
  },
  {
    k: 'renuncia', emoji: '🚨', fecha: '8 y 9 de septiembre de 2026', comprobable: 'media',
    afirma: 'Un investigador de seguridad de uno de los laboratorios de Inteligencia Artificial renunció públicamente y escribió que la industria está corriendo hacia sistemas capaces de mejorarse a sí mismos sin saber todavía cómo mantenerlos bajo control.',
    quien: 'Lo publicaron el mismo día medios grandes y de países distintos: TIME, NBC News, Axios, Scientific American, Newsweek y Quartz, entre otros.',
    gana: 'Él dice que no gana nada: que renunció antes de cobrar lo que le tocaba. Los medios ganan lectores con una historia así. Las dos cosas se piensan a la vez, y ninguna prueba ni desmiente lo que dijo.',
    trae: 'Fecha, medios que no se copian entre sí y un texto original suyo publicado en una red social. Falta leer ese texto entero, que es lo que de verdad acredita.',
    comprueba: 'Buscá **su publicación original**, no el resumen. Leela completa y después buscá **qué contestó la empresa**. Una discusión con dos lados leídos no se parece en nada a un titular.',
    importa: 'Es la primera vez que este debate sale de los expertos y llega a la mesa de cualquiera. Y la pregunta que deja es la de esta misión: ¿esto es un punto de inflexión, o una alarma que dentro de un año nadie recordará?',
  },
  {
    k: 'frenar', emoji: '🐢', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'El director de uno de esos laboratorios publicó un ensayo pidiendo que las empresas de Inteligencia Artificial bajen el ritmo para que la seguridad alcance al avance.',
    quien: 'Lo recogen boletines y agregadores de noticias de tecnología. El ensayo original está firmado por él.',
    gana: 'Pensalo con calma, porque no es obvio: quien pide frenar puede estar preocupado de verdad, y también puede ganar que se le vea como el responsable del sector. Que las dos cosas quepan no significa que sea falso.',
    trae: 'Una firma y una fecha. Lo que falta es el ensayo leído entero, y no el resumen de un resumen.',
    comprueba: 'Buscá el ensayo firmado y leé **qué propone exactamente**: no es lo mismo «que lo hagan todos por ley» que «lo hacemos nosotros». Y mirá si alguna empresa cambió algo después.',
    importa: 'Cuando el que corre pide frenar, algo se movió. Guardá la fecha y volvé dentro de un año a mirar si frenaron.',
  },
  {
    k: 'becas', emoji: '🎓', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'Se anunciaron miles de becas de Inteligencia Artificial y computación en la nube para Honduras, en una alianza entre una alcaldía y una empresa de tecnología.',
    quien: 'Salió en un diario hondureño… **como contenido patrocinado**, que es la etiqueta con la que un medio marca lo que alguien pagó por publicar.',
    gana: 'Aquí la pregunta se contesta sola: la empresa gana gente formada en SU tecnología, y la alcaldía gana el anuncio. Eso no lo vuelve falso —las becas pueden existir y servirte—, pero explica por qué está escrito así.',
    trae: 'La etiqueta de patrocinado, que es una señal honesta del medio. Faltan los requisitos, las fechas de inscripción y quién las da de verdad.',
    comprueba: 'Buscá el anuncio **en el sitio de la alcaldía** y los requisitos. Si no aparecen, esa es tu respuesta. Y si aparecen, apuntá la fecha de cierre.',
    importa: 'Si son de verdad, te tocan a vos. Comprobar esto no es desconfiar: es llegar a tiempo a inscribirte.',
  },
  {
    k: 'rezago', emoji: '🏗️', fecha: 'septiembre de 2026', comprobable: 'media',
    afirma: 'Otro diario hondureño publicó, el mismo mes, que al país le falta infraestructura y gente formada para aprovechar la Inteligencia Artificial.',
    quien: 'Un diario nacional, con su firma.',
    gana: 'Un medio gana lectores con un diagnóstico duro igual que con un anuncio bueno. Por eso no se elige entre los dos por cuál suena mejor.',
    trae: 'Fecha y firma. Lo que hay que buscarle son los datos en que se apoya: ¿de dónde saca que falta infraestructura?',
    comprueba: 'Leé las dos noticias —esta y la de las becas— una detrás de otra y subrayá **qué mide cada una**. Las dos pueden ser verdad al mismo tiempo, y casi siempre lo son.',
    importa: 'Esta es la lección más útil del dossier: cuando dos noticias parecen contradecirse, casi nunca es que una miente. Es que miden cosas distintas.',
  },
  {
    k: 'titulares', emoji: '😱', fecha: 'septiembre de 2026', comprobable: 'baja',
    afirma: 'Circularon titulares diciendo que los modelos de Inteligencia Artificial «mienten, roban y hasta matan» cuando nadie los mira.',
    quien: 'Sitios de noticias que lo repiten unos de otros. Debajo de todos hay un experimento: alguien puso varios modelos a jugar en una situación inventada y contó lo que hicieron.',
    gana: 'Un titular así se comparte muchísimo. Ese es el premio, y por eso la palabra elegida es «matar» y no «eliminó a un jugador de una simulación».',
    trae: 'Casi nada: no dice quién hizo el experimento, ni qué se simuló, ni dónde se publicó.',
    comprueba: 'Buscá **el estudio**, no la noticia. Mirá qué se le pidió a los modelos y en qué consistía el juego. Después volvé a leer el titular: casi siempre se cae solo.',
    importa: 'El daño de estos titulares no es que asusten: es que **gastan la alarma**. El día que haya un aviso de verdad, ya nadie va a creerlo. Es el mismo daño del mensaje que grita «urgente» de la etapa 5.',
  },
  {
    k: 'blogs', emoji: '🔁', fecha: 'todo el mes', comprobable: 'baja',
    afirma: 'Decenas de páginas publicaron «los grandes avances de la Inteligencia Artificial de septiembre de 2026», con listas de novedades.',
    quien: 'Blogs que no firman, que no citan de dónde sacan nada y que repiten casi el mismo texto. Varios nombran como novedad cosas de hace años.',
    gana: 'Visitas. Una página que publica «lo último» cada mes vive de que la busques, y le sale más barato copiar que comprobar.',
    trae: 'Nada. Ni autor, ni documento, ni fecha del hecho: solo la fecha del blog.',
    comprueba: 'Tomá una sola frase de esas listas y buscá **de dónde sale**. Si al buscarla solo aparecen otros blogs diciendo lo mismo, ya sabés lo que tenés: un eco, no una fuente.',
    importa: 'Esto es la mayor parte de lo que vas a encontrar si buscás «noticias de IA». Saber descartarlo en diez segundos vale más que leerlo todo.',
  },
];

/* ── La palabra del mes: singularidad ─────────────────────────────────────
   Lo que se afirma, lo que se sabe y lo que nadie sabe. Va separado a
   propósito: la currícula de esta materia prohíbe afirmar lo que la IA «va a
   hacer», y esta misión no lo afirma — enseña a leer a quien lo afirma. */
const IA_SINGULARIDAD = {
  palabra: 'Singularidad',
  afirmacion: 'Que va a llegar un momento en que una máquina mejore a otra máquina —y a sí misma— más rápido de lo que una persona puede seguir, y que a partir de ahí el cambio se acelere solo y no se pueda predecir lo que venga después.',
  albores: 'Y «estar en los albores» quiere decir que ese momento ya empezó: que lo que pasa este año son las primeras luces de eso.',
  seSabe: [
    { e: '🍎', t: 'Aprende de ejemplos que alguien eligió.', p: 'Lo produjiste vos en la etapa 1: no es cuántos ejemplos, es cuáles. Y los elige una persona.' },
    { e: '⚖️', t: 'Se equivoca con lo que no vio, y el error cae siempre sobre los mismos.', p: 'Lo mediste en las etapas 2 y 5: un promedio alto puede esconder a quién le falla.' },
    { e: '💬', t: 'Predice; no comprueba.', p: 'Lo viste nacer en la etapa 4: elige la continuación más probable, sea verdad o no.' },
    { e: '🧑‍🔧', t: 'Todo sistema que hoy se usa lo entrena gente, con datos que alguien juntó y pagó.', p: 'Eso no es una opinión: es cómo están hechos, y es lo que enseña toda esta ruta.' },
  ],
  noSeSabe: [
    'Si eso va a pasar.',
    'Cuándo.',
    'Qué se sentiría el día antes de que pasara. Y esta es la más incómoda: si nadie sabe cómo se ve por dentro el principio, tampoco se puede afirmar que estemos en él.',
  ],
  porQue: 'La palabra importa porque mueve decisiones y dinero. Si de verdad estamos en los albores, hay cosas urgentes que hacer. Y si no lo estamos, hay quien gana diciendo que sí —el que vende, el que pide dinero para investigar, el que quiere una ley, el que quiere que no la haya—. Las dos posibilidades se piensan a la vez.',
  vara: 'Por eso esta misión no te dice si es verdad: te da la vara con la que se mide. Y la vara ya la tenés: son los dos inviernos de la etapa 3. En los dos se prometió más de lo que se podía, y el que se lo creyó perdió años.',
};

/* ── El termómetro de la promesa ──────────────────────────────────────────
   Las cuatro preguntas, y lo que significa cada resultado. Es lo único de
   esta misión que el alumno se lleva para toda la vida: sirve igual para una
   noticia de IA, para una oferta de trabajo y para un remedio milagroso. */
const IA_TERMOMETRO = [
  { k: 'quien', emoji: '🧑', pregunta: '¿Quién lo dice, con su nombre?',
    si: 'Alguien responde por esto: una institución, un medio que firma, una persona con nombre.',
    no: 'No lo dice nadie en concreto: «dicen que», «los expertos», «según un estudio».',
    porque: 'A una afirmación sin dueño no se le puede preguntar nada. Por eso convence tanto: no hay a quién ir.' },
  { k: 'gana', emoji: '💰', pregunta: '¿Qué gana diciéndolo?',
    si: 'Se puede nombrar qué gana —y eso NO lo vuelve falso: lo pone en su sitio.',
    no: 'No se sabe quién paga ni qué se vende detrás.',
    porque: 'Quien vende una cosa tiene razones para exagerarla, y quien la teme también. Saberlo no cierra la discusión: la abre bien.' },
  { k: 'cuando', emoji: '📅', pregunta: 'Si es una promesa, ¿para cuándo?',
    si: 'Trae una fecha, un plazo o un año.',
    no: 'Dice «pronto», «en los próximos años», «está a la vuelta de la esquina».',
    porque: 'Una promesa sin fecha no se puede incumplir nunca, y por eso se hace así. Con fecha, el tiempo la califica sola.' },
  { k: 'comprueba', emoji: '📎', pregunta: '¿Con qué se comprueba?',
    si: 'Hay un documento, una ley, un estudio o un dato que se puede abrir.',
    no: 'Solo hay otras páginas repitiendo lo mismo.',
    porque: 'Cinco páginas que dicen lo mismo sin decir de dónde no son cinco fuentes: son un eco.' },
];
/* Lo que dice el termómetro según cuántas contestó que sí. No hay nota ni
   puntaje: hay un nombre para lo que tiene en la mano. */
const IA_TERMOMETRO_TRAMOS = [
  { min: 4, k: 'comprobable', emoji: '📎', nombre: 'Se puede comprobar hoy',
    dice: 'Trae todo lo que hace falta. Eso no la vuelve verdadera: la vuelve **comprobable**, que es lo único que se puede pedir. Andá al documento.' },
  { min: 3, k: 'seria', emoji: '🧭', nombre: 'Se puede seguir la pista',
    dice: 'Le falta una pieza. Nombrala —¿quién? ¿para cuándo? ¿con qué?— y buscá **esa**: es el trabajo más corto que te queda por hacer.' },
  { min: 2, k: 'promesa', emoji: '⏳', nombre: 'Promesa sin fecha de examen',
    dice: 'Suena bien y no se puede incumplir. Ponele vos la fecha: apuntala y volvé a leerla dentro de un año. Así se distingue un hito de un invierno.' },
  { min: 0, k: 'humo', emoji: '💨', nombre: 'Eco',
    dice: 'No hay a quién preguntarle ni qué abrir. No hace falta discutirla: se deja. Lo que no se puede comprobar tampoco se puede desmentir, y ahí está su truco.' },
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
  { k: 'colegio', emoji: '💬', texto: 'No vale la pena estudiar nada de computación: en dos años la Inteligencia Artificial lo va a hacer todo.',
    de: 'Un mensaje reenviado en el grupo del colegio.',
    tiene: { quien: false, gana: false, cuando: true, comprueba: false },
    porque: 'Trae un plazo —«dos años»— y nada más. No dice quién lo dijo, no se sabe qué gana quien lo reenvía y no hay nada que abrir. Esta es la frase que le hizo a Marvin dejar la matrícula.' },
  { k: 'europa', emoji: '⚖️', texto: 'Desde este año, en la Unión Europea lo generado por una máquina tiene que poder identificarse como tal.',
    de: 'El reglamento europeo de Inteligencia Artificial.',
    tiene: { quien: true, gana: true, cuando: true, comprueba: true },
    porque: 'Las cuatro. Lo dice un Estado con su nombre, se sabe qué gana (que su ley se cumpla), trae fecha de entrada en vigor y el texto está publicado y es gratis de leer.' },
  { k: 'renuncia', emoji: '🚨', texto: 'La industria está corriendo hacia sistemas que se mejoran a sí mismos sin saber todavía cómo mantenerlos bajo control.',
    de: 'Un investigador de seguridad que renunció, en septiembre de 2026.',
    tiene: { quien: true, gana: true, cuando: false, comprueba: true },
    porque: 'Tiene nombre, se puede pensar qué gana y qué pierde, y su texto original se puede leer. Lo que NO trae es plazo: «está corriendo» no se puede incumplir nunca. Por eso se sigue la pista y se vuelve con fecha.' },
  { k: 'becas', emoji: '🎓', texto: 'Habrá miles de becas de Inteligencia Artificial para Honduras.',
    de: 'Un anuncio publicado como contenido patrocinado.',
    tiene: { quien: true, gana: true, cuando: false, comprueba: false },
    porque: 'Se sabe quién lo dice y qué gana —está hasta etiquetado como pagado, que es honesto del medio—. Lo que falta es lo que a vos te sirve: cuándo, dónde y con qué requisitos. Eso se busca en el sitio de la alcaldía.' },
  { k: 'titular', emoji: '😱', texto: 'Los modelos de Inteligencia Artificial mienten, roban y matan cuando nadie los mira.',
    de: 'Un titular que circuló mucho.',
    tiene: { quien: false, gana: true, cuando: false, comprueba: false },
    porque: 'Lo único claro es qué gana: se comparte muchísimo. No dice quién hizo el experimento, ni cuándo, ni dónde está publicado. Debajo hay una simulación, y «eliminó a un jugador de un juego inventado» no cabe en un titular.' },
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
  que: 'Un punto de inflexión es el día en que algo que no se podía hacer empezó a poder hacerse, y todo lo de después cambió por eso.',
  cuando: 'Casi siempre se reconocen **mirando para atrás**. En su momento parecían una noticia más, y muchas noticias que parecían enormes no dejaron nada.',
  reglas: [
    { e: '🔎', t: 'Se reconoce por lo que vino DESPUÉS, no por el ruido que hizo.', p: 'El artículo del que salen los chats de hoy pasó casi desapercibido; la máquina que ganó al ajedrez llenó portadas y cambió menos.' },
    { e: '🏗️', t: 'Un punto de inflexión suele ser que se juntó algo que faltaba.', p: 'Datos, cómputo y algoritmos: las tres patas de la etapa 3. Una idea sola no mueve nada; una idea con su pata debajo, sí.' },
    { e: '❄️', t: 'Lo contrario también existe y tiene nombre: el invierno.', p: 'Dos veces se prometió más de lo que se podía y el campo casi se para. Lo que se rompió no fue la tecnología: fue la confianza.' },
    { e: '📅', t: 'Y por eso lo único honesto que se puede hacer hoy es fechar.', p: 'Escribí lo que se promete, con la fecha de hoy, y volvé cuando toque. El tiempo es el único que no se equivoca.' },
  ],
};

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_HOY_FECHA, IA_HOY_MES, IA_HOY, IA_SINGULARIDAD, IA_TERMOMETRO, IA_TERMOMETRO_TRAMOS,
                     IA_FRASES, iaFraseCuenta, iaFraseTramo, IA_INFLEXION };
}
