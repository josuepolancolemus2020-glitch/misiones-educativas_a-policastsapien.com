/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · CNB, DCNB y programación: quién manda sobre qué

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   ─────────────────────────────────────────────────────────────
   FUENTES: LEÍDAS, NO BUSCADAS

   Todo lo que se afirma aquí sale del currículo oficial, que está en
   el repositorio y hay que tener delante para tocar esta misión:

     _dev/dcnb-pdf/cnb-sintetizado.pdf          (estructura del sistema)
     _dev/dcnb-pdf/dcneb-basica-i-ciclo.pdf
     _dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf
     _dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf
     _dev/dcnb-pdf/dcnb-prebasica-2015.pdf
     _dev/dcnb-pdf/cnb-media-bch-ciencias-y-humanidades.pdf

   Para trabajar están troceados por área y grado en `_dev/dcnb/`, con
   su INDICE.md. Pero el PDF es el que acredita: el Markdown salió de
   una conversión automática y sirve para buscar, no para citar.

   ⚠️ TRES CAUTELAS QUE NO SE PUEDEN QUITAR

   1. LOS DOCUMENTOS DE MEDIA SON VERSIÓN PRELIMINAR 2025 y lo dicen
      en cada página. Por eso esta misión toma de ellos SOLO la
      aritmética de la programación (cuarenta semanas, hora de
      cuarenta y cinco minutos, horas anuales), que es el molde de
      una jornalización y no depende de que el documento se apruebe
      tal cual. No se cita de Media ninguna competencia ni ningún
      criterio de evaluación como si ya fueran norma firme.

   2. NO SE AFIRMA NINGÚN NÚMERO DE DÍAS DEL AÑO LECTIVO. El dato de
      los doscientos días es de la Ley Fundamental de Educación, y
      ese documento NO está en el repositorio: afirmarlo aquí sería
      citarlo de memoria, que es justo lo que costó caro en
      INVESTIGACION-ESTATUTO-DOCENTE.md. La misión enseña a contar
      las semanas reales y manda a confirmar el calendario en el
      centro. Si algún día entra la Ley Fundamental a `_dev/leyes/`,
      se lee y entonces se agrega.

   3. BÁSICA Y MEDIA HABLAN IDIOMAS DISTINTOS. El DCNB de Básica
      trabaja con áreas, bloques y expectativas de logro; los
      documentos de Media de 2025 traen espacios curriculares,
      competencias y criterios de evaluación. La misión lo cuenta
      como lo que es (dos generaciones de documentos conviviendo) y
      no da a entender que uno derogó al otro, porque eso no consta.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_CURRICULO_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, peldanos: [], fcVistas: [], nombre: '', sonido: 1,
  memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
  casos: 0, concursoNota: 0,
};
function cargar() {
  try { const o = JSON.parse(localStorage.getItem(SAVE_KEY)); if (o && typeof o === 'object') S = Object.assign(S, o); }
  catch (_) {}
}
function guardar() {
  S.nombre = (document.getElementById('constNombre')?.value || S.nombre || '').trim();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (_) {}
  pintaXP(); pintaLogros(); pintaConst();
}
function xp(n) { S.xp = Math.max(0, S.xp + n); guardar(); }

const XP_META = 120;
function pintaXP() {
  const f = document.getElementById('xpFill'), n = document.getElementById('xpNum');
  if (f) f.style.width = Math.min(100, (S.xp / XP_META) * 100) + '%';
  if (n) n.textContent = S.xp + ' XP';
}

/* ══════════════════════════════════════════════════════════════
   LOS OCHO PELDAÑOS
   Las misiones anteriores se recorrían por fechas, por artículos,
   por trámites y por escenas del aula. Esta se recorre por una
   ESCALERA, porque la pregunta del maestro no es «qué dice el
   currículo» sino «quién manda sobre qué»: de dónde viene cada
   regla y hasta dónde puede decidir él.

   Se baja del documento más general al plan del lunes. Cada peldaño
   dice en qué documento consta, porque el que no sabe dónde está
   escrito no puede defender su decisión cuando alguien la cuestiona.
══════════════════════════════════════════════════════════════ */
const PELDANOS = [
  {
    ic: '🏛️', corto: 'El CNB: el que manda sobre todos',
    tit: 'Un instrumento normativo, no una recomendación',
    sub: 'Currículo Nacional Básico, Versión Sintetizada',
    txt: 'El Currículo Nacional Básico es el <b>instrumento normativo de carácter nacional</b> que ' +
         'establece las capacidades, competencias, conceptos, destrezas, habilidades y actitudes ' +
         'que debe lograr todo sujeto del Sistema Educativo Nacional. La palabra que hay que ' +
         'subrayar es <b>normativo</b>: no es una guía de la que se toma lo que gusta. Nació de la ' +
         'Propuesta de Transformación de la Educación Nacional presentada por el <b>Foro Nacional ' +
         'de Convergencia</b> (FONAC), o sea que no lo escribió una oficina sola. El CNB se ' +
         'operativiza en la estructura de niveles y ciclos, y ahí establece propósitos, áreas ' +
         'curriculares, objetivos, alcances, contenidos, expectativas de logro, competencias y ' +
         'estándares educativos.',
    cita: 'El Currículo Nacional Básico es el instrumento normativo que establece las capacidades, ' +
          'competencias, conceptos, destrezas, habilidades y actitudes que debe lograr todo sujeto ' +
          'del Sistema Educativo Nacional en los niveles, ciclos y modalidades.',
    pasos: [
      'Ubique de qué nivel es su grado: eso decide cuál documento le aplica.',
      'Del CNB salen las áreas y los ejes; del documento de su nivel salen las expectativas de su grado.',
      'Cuando alguien le discuta un contenido, la respuesta no es su opinión: es en qué página está escrito.',
      'Guarde el documento de su nivel en el teléfono: se consulta más de lo que se cree.',
    ],
    nohacer: [
      'No confunda el CNB con el DCNB: el primero es el marco de todo el sistema, el segundo es el desarrollo de un nivel.',
      'No dé por norma lo que trae un libro de texto: el libro es un apoyo, el currículo es el que obliga.',
      'No trabaje de memoria ni de lo que se dijo en una capacitación: lo que se cita se lee.',
    ],
    aula: 'Saber que el CNB es normativo le cambia el tono de las reuniones: usted deja de pedir ' +
          'permiso para dar un contenido y pasa a mostrar dónde está mandado.',
  },
  {
    ic: '🪜', corto: 'Los cuatro niveles y dónde cae su grado',
    tit: 'Prebásica, Básica, Media y Superior',
    sub: 'CNB, Estructura del Sistema Educativo',
    txt: 'El Sistema Educativo Hondureño comprende cuatro niveles: <b>Prebásica, Básica, Media y ' +
         'Superior</b>. El CNB se concreta en los tres primeros, que son responsabilidad directa de ' +
         'la <b>Secretaría de Educación</b>. Prebásica atiende de cero a tres años y de tres a seis, ' +
         'con tres años de duración cada tramo, y <b>solo el último año es obligatorio</b>. Básica se ' +
         'organiza en tres ciclos de tres años: <b>I Ciclo</b> de seis a nueve años, <b>II Ciclo</b> ' +
         'de nueve a doce y <b>III Ciclo</b> de doce a quince. Media tiene dos modalidades: el ' +
         '<b>Bachillerato Científico Humanista</b>, de dos años (quince a diecisiete), y el ' +
         '<b>Bachillerato Técnico Profesional</b>, de tres (quince a dieciocho).',
    cita: 'El Sistema Educativo Hondureño, comprende cuatro niveles: Educación Prebásica, Educación ' +
          'Básica, Educación Media y Educación Superior. Los niveles señalados están estructurados a ' +
          'su vez en ciclos o modalidades y grados.',
    pasos: [
      'Cada ciclo tiene una intención distinta: el I inicia las destrezas instrumentales.',
      'El II las profundiza y suma procesos mentales y actitudinales.',
      'El III toma carácter científico y tecnológico, y prepara para Media.',
      'Si da clase en más de un ciclo, no dé por hecho que el mismo contenido se pide igual.',
    ],
    nohacer: [
      'No llame «grado» al ciclo ni al revés: el ciclo agrupa tres grados y es la unidad con que se piensa la continuidad.',
      'No suponga que Prebásica entera es obligatoria: solo el último año lo es.',
      'No aplique a Media lo que dice el documento de Básica: son documentos distintos, y ya se verá que hablan idiomas distintos.',
    ],
    aula: 'Ubicar su grado en su ciclo le dice qué trae el alumno y qué le va a exigir el año que ' +
          'viene. Ahí es donde se decide qué repasar en marzo y qué no.',
  },
  {
    ic: '🧩', corto: 'Las áreas no son las asignaturas',
    tit: 'Un área es más ancha que una materia',
    sub: 'CNB, Estructura Curricular',
    txt: 'El CNB organiza el aprendizaje en <b>áreas curriculares</b>, que define como agrupaciones ' +
         'de contenidos afines ordenadas de lo más global a lo más específico, y avisa que <b>son ' +
         'más amplias que las asignaturas</b>. Las de Educación Básica son <b>Comunicación, ' +
         'Matemática, Ciencias Sociales, Ciencias Naturales, Educación Física, Tecnología</b> y ' +
         '<b>Educación Técnica</b>. Prebásica usa las suyas: <b>Desarrollo Personal Social, Relación ' +
         'con el Entorno</b> y <b>Comunicación y Representación</b>. Dos detalles que se preguntan ' +
         'mucho: el <b>Idioma Extranjero</b> entra dentro del área de Comunicación a partir del ' +
         '<b>II Ciclo</b>, y el <b>III Ciclo</b> se diferencia por tener <b>Tecnología como área ' +
         'independiente</b> e incorporar la <b>Educación Técnica</b> como área de libre elección ' +
         'institucional.',
    cita: 'Las Áreas Curriculares, facilitan la interrelación de aprendizajes de carácter ' +
          'científico, técnico y funcional. Se conceptualizan como agrupaciones de contenidos afines ' +
          'que se organizan desde lo mas global y general hasta lo más específico. Estas áreas son ' +
          'más amplias que las asignaturas.',
    pasos: [
      'Cuando planifique, piense en el área: Español y Educación Artística viven las dos en Comunicación.',
      'Si su centro elige Educación Técnica en el III Ciclo, esa elección es institucional y consta en el proyecto del centro.',
      'Revise si el Idioma Extranjero de su grado está dentro de Comunicación o se le da tratamiento aparte en su centro.',
    ],
    nohacer: [
      'No parta el área en compartimentos: el CNB la arma justamente para que los aprendizajes se relacionen.',
      'No espere que el nombre del área coincida con el nombre de la casilla de la boleta: no siempre pasa.',
    ],
    aula: 'Pensar por área es lo que le permite dar una sola actividad que sirva a dos contenidos. ' +
          'Con cuarenta y tres alumnos, eso no es elegancia: es tiempo.',
  },
  {
    ic: '🧵', corto: 'Los tres ejes transversales',
    tit: 'Identidad, Trabajo y Democracia Participativa',
    sub: 'CNB, Estructura Curricular',
    txt: 'Los <b>ejes transversales</b> son elementos actitudinales que orientan el aprendizaje y ' +
         'sostienen la integración y la interdisciplinariedad del currículo. El CNB establece tres: ' +
         '<b>La Identidad, El Trabajo</b> y <b>La Democracia Participativa</b>. No son una materia ' +
         'ni una hora aparte: atraviesan todas las áreas, y por eso están «inherentes» dentro de ' +
         'ellas. En la práctica es lo que muchos dejan sin trabajar porque no encuentran dónde ' +
         'ponerlo, cuando lo que pide el currículo es exactamente lo contrario: que no tenga un ' +
         'lugar propio, sino que esté en todos.',
    cita: 'Los Ejes Transversales, se definen como elementos actitudinales que orientan el ' +
          'aprendizaje y contribuyen a proveer y a conservar la integración, la articulación y la ' +
          'interdisciplinariedad del currículo. El CNB establece como ejes transversales: La ' +
          'Identidad, El Trabajo y La Democracia Participativa.',
    pasos: [
      'Identidad: en Sociales es evidente, pero también está en el cuento que escoge para leer.',
      'Trabajo: no es «hablar de oficios», es el valor de hacer bien lo que se hace, y se enseña con la rutina de la clase.',
      'Democracia Participativa: el Gobierno Escolar y los acuerdos del aula son su lugar natural.',
      'Anote en su plan de clase con qué eje trabaja: cuando se anota, se hace.',
    ],
    nohacer: [
      'No los convierta en un tema suelto de una semana: son transversales, no una unidad.',
      'No los deje solo para el acto cívico.',
    ],
    aula: 'Los ejes son la parte del currículo que se evalúa sola en la convivencia del aula. Si su ' +
          'grupo trabaja en equipo y respeta acuerdos, usted ya los está dando.',
  },
  {
    ic: '🎯', corto: 'Estándares y expectativas de logro',
    tit: 'Uno dice a dónde llega el país, la otra a dónde llega su grado',
    sub: 'CNB y DCNB de Educación Básica',
    txt: 'Se confunden todo el tiempo y no son lo mismo. Los <b>Estándares Educativos</b> son, según ' +
         'el CNB, <b>declaraciones claras, exigentes y consistentes sobre lo que se espera que ' +
         'aprenda el alumnado</b> del sistema, y describen capacidades y habilidades complejas ' +
         'ligadas a cada área. Las <b>expectativas de logro</b> son otra cosa: el DCNB las define ' +
         'como <b>opciones de carácter curricular que concretizan las intencionalidades educativas y ' +
         'las competencias de carácter conceptual, procedimental y actitudinal</b>. Dicho en el ' +
         'idioma del aula: el estándar es la meta común del país, y la expectativa es el escalón que ' +
         'le toca a su grado para llegar allá.',
    cita: 'Las expectativas de logro son opciones de carácter curricular que concretizan las ' +
          'intencionalidades educativas y las competencias de carácter Conceptual, Procedimental y ' +
          'Actitudinal.',
    pasos: [
      'Para planificar la clase, mande la expectativa de logro de su grado: es la que está a su altura.',
      'Para rendir cuentas de resultados, hable de estándares: es el idioma de las evaluaciones externas.',
      'Escriba la expectativa completa en su plan, no un resumen: en el resumen se pierde el verbo, y el verbo es el que dice qué se evalúa.',
    ],
    nohacer: [
      'No use «expectativa» y «estándar» como sinónimos delante de un evaluador: es lo primero que delata que no se leyó el documento.',
      'No copie la expectativa de otro grado porque «es el mismo tema»: el tema se repite, el escalón no.',
    ],
    aula: 'La expectativa de logro es lo que va escrito en su plan y lo que después se pregunta en ' +
          'la evaluación. Si las dos no coinciden, el problema no fue del alumno.',
  },
  {
    ic: '📊', corto: 'La tabla del DCNB: tres columnas',
    tit: 'La tercera columna ya trae la clase escrita',
    sub: 'DCNB de Educación Básica, programación por área y grado',
    txt: 'Abra el DCNB de su nivel en cualquier grado y va a encontrar siempre la misma tabla, con ' +
         'tres columnas, y en este orden: <b>Expectativas de Logro</b>, <b>Contenidos Conceptuales ' +
         '(■) y Actitudinales (●)</b> y <b>Procesos y Actividades Sugeridas</b>. La primera dice a ' +
         'dónde hay que llegar. La segunda, con qué. Y la tercera, que es la que casi nadie mira, ' +
         'ya trae las actividades pensadas: está escrita para ahorrarle el trabajo de inventarlas. El ' +
         'documento organiza todo eso en <b>bloques de contenido o macrotemas</b>, de los cuales ' +
         'derivan los contenidos conceptuales, procedimentales y actitudinales de cada ciclo y de ' +
         'cada grado.',
    cita: 'El DCN-EB está organizado en varios bloques de contenidos o macrotemas, de los cuales ' +
          'derivan los diferentes contenidos actitudinales, conceptuales y procedimentales que ' +
          'identifican cada ciclo y cada uno de sus grados.',
    pasos: [
      'Lea la fila completa antes de planificar: las tres columnas son una sola idea partida en tres.',
      'De la tercera columna saque la actividad, y ahórrese inventarla.',
      'Fíjese en qué tipo de contenido está: conceptual se evalúa distinto que procedimental.',
      'Un bloque no es una semana: es un macrotema que puede tomar varias.',
    ],
    nohacer: [
      'No planifique solo con la columna de contenidos: da la lista de temas y le quita el para qué.',
      'No convierta la expectativa en el título de la clase: la expectativa es el logro, no el tema.',
    ],
    aula: 'Esa fila es, literalmente, su plan de clase a medio escribir. El día que lo descubra va a ' +
          'recuperar las tardes de domingo.',
  },
  {
    ic: '📅', corto: 'De los bloques a la programación',
    tit: 'El currículo dice qué; el calendario dice cuándo',
    sub: 'CNB y planes de estudio de Educación Media',
    txt: 'Aquí es donde el documento deja de mandar solo y entra la aritmética. El currículo fija los ' +
         'bloques y las expectativas; <b>repartirlos en el año es trabajo suyo</b>, y se hace ' +
         'contando. Los planes de estudio de Educación Media lo muestran con todas sus letras: ' +
         'trabajan sobre <b>cuarenta semanas</b>, con la hora clase de <b>cuarenta y cinco minutos</b>, ' +
         'y calculan las horas anuales multiplicando las semanales por cuarenta. En el Bachillerato ' +
         'en Ciencias y Humanidades, el décimo grado suma <b>treinta y seis horas semanales</b> de ' +
         'cuarenta y cinco minutos, que son <b>mil cuatrocientas cuarenta horas al año</b> repartidas ' +
         'en once espacios curriculares. Ese es el molde de una jornalización: horas reales, no ' +
         'buenas intenciones.',
    cita: 'Horas semanales (45 min/hora), 40 semanas, Horas anuales (horas semanales x 40). Total de ' +
          'horas semanales: 36 horas de 45 min/semana, 1440 horas.',
    pasos: [
      'Cuente primero las semanas que de verdad va a tener, con feriados y actividades del centro descontados.',
      'Reparta los bloques sobre ese número, no sobre el año ideal.',
      'Deje semanas de holgura: la evaluación, la recuperación y lo imprevisto también ocupan.',
      'Escriba la jornalización antes de que empiece el año y revísela al cerrar cada parcial.',
    ],
    nohacer: [
      'No copie la jornalización del año pasado sin recontar: el calendario cambia todos los años.',
      'No deje tres bloques para el último mes: en octubre no hay mes que alcance.',
      'No invente fechas oficiales: el calendario del año lectivo lo fija la Secretaría de Educación y se confirma en su centro.',
    ],
    aula: 'Una jornalización hecha con las semanas verdaderas es lo único que evita la carrera de ' +
          'octubre. Y es lo primero que le van a pedir cuando llegue una supervisión.',
  },
  {
    ic: '🏫', corto: 'Lo que sí se ajusta en su centro',
    tit: 'El PEC, la adecuación y hasta dónde llega su margen',
    sub: 'CNB, Marco Pedagógico Didáctico',
    txt: 'El currículo es nacional, pero no se aplica igual en todas partes, y eso también está ' +
         'escrito. La dirección del centro conduce la gestión educativa a través del <b>Proyecto ' +
         'Educativo de Centro</b> (PEC), donde se organizan los tiempos y espacios y se da ' +
         'seguimiento a la ejecución curricular. Y el CNB incluye la <b>adecuación curricular para ' +
         'la atención a la diversidad</b> en tres componentes: <b>educación intercultural bilingüe</b> ' +
         '(dirigida a los pueblos autóctonos y afroantillanos), <b>educación especial</b> y ' +
         '<b>educación de jóvenes y adultos</b>. La evaluación tiene su propio sistema, el ' +
         '<b>SINECE</b>, que evalúa aprendizajes, desempeño docente, planes y programas, proyectos e ' +
         'instituciones. La evaluación interna cumple propósitos diagnósticos, formativos y ' +
         'sumativos.',
    cita: 'Contextualizar el curriculum a las necesidades e intereses de los educandos y de la ' +
          'comunidad.',
    pasos: [
      'Lo que se ajusta es el camino: la actividad, el tiempo, el material, el apoyo.',
      'Lo que no se quita es el derecho al aprendizaje: la expectativa sigue siendo la meta.',
      'Si hay alumnos con necesidades educativas especiales, la adecuación se escribe y se sostiene con el centro, no a solas.',
      'Lleve al PEC lo que decida: así deja de ser su criterio y pasa a ser el del centro.',
    ],
    nohacer: [
      'No baje la expectativa por bajar la exigencia: adecuar es cambiar el camino, no el destino.',
      'No haga adecuaciones de palabra: lo que no está escrito no se sostiene ante nadie.',
      'No decida solo lo que le toca al centro: el PEC existe justamente para eso.',
    ],
    aula: 'Aquí está su margen real, y es más ancho de lo que se cree: el cómo es suyo. Lo que no es ' +
          'negociable es a dónde tiene derecho a llegar el alumno.',
  },
];
let _pel = 0;
/* La lista va en vertical y la escena se abre DEBAJO de la que se tocó: es el
   molde de la serie, y en el teléfono es la única forma de que se vean las
   nueve sin arrastrar. */
function pelPinta() {
  const lista = document.getElementById('pelLista');
  if (!lista) return;
  lista.innerHTML = PELDANOS.map((t, i) => {
    const abierto = i === _pel;
    return `
    <div class="si-item ${abierto ? 'on' : ''} ${S.peldanos.includes(i) ? 'visto' : ''}" id="siIt${i}">
      <button class="si-cab" onclick="pelVer(${i})" aria-expanded="${abierto}">
        <span class="si-num" aria-hidden="true">${t.ic}</span>
        <span class="si-tit">${t.corto}</span>
        ${S.peldanos.includes(i) ? '<span class="si-visto">✓</span>' : ''}
        <span class="si-flecha" aria-hidden="true">▾</span>
      </button>
      ${abierto ? `
      <div class="si-det" id="siDet">
        <h3>${t.ic} ${t.tit}</h3>
        <div class="si-sub">${t.sub}</div>
        <p>${t.txt}</p>
        <div class="si-cita">📜 <b>Lo dice así:</b> «${t.cita}»</div>
        <ol class="si-pasos">${t.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="si-nohacer"><b>⛔ Lo que no se hace</b>
          <ul>${t.nohacer.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="aula">🎯 <b>Qué le deja a su aula:</b> ${t.aula}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}
function pelVer(i) {
  _pel = i;
  if (!S.peldanos.includes(i)) { S.peldanos.push(i); xp(3); }
  pelPinta();
  // Que la escena tocada quede a la vista aunque el texto empuje la lista
  const el = document.getElementById('siIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function pelMover(d) { pelVer(Math.max(0, Math.min(PELDANOS.length - 1, _pel + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════
   NOMBRES PROPIOS CON MAYÚSCULA, aquí también (normativa de la casa,
   en CLAUDE.md). Se comprueba con node _dev/verifica-nombres-propios.js. */
const FC = [
  ['¿Qué es el Currículo Nacional Básico?', 'El instrumento normativo de carácter nacional que establece las capacidades, competencias, conceptos, destrezas, habilidades y actitudes que debe lograr todo sujeto del Sistema Educativo Nacional.'],
  ['¿De qué propuesta nació el CNB?', 'De la Propuesta de Transformación de la Educación Nacional presentada por el Foro Nacional de Convergencia (FONAC).'],
  ['¿Cuántos niveles tiene el Sistema Educativo Hondureño y cuáles son?', 'Cuatro: Educación Prebásica, Educación Básica, Educación Media y Educación Superior. El CNB se concreta en los tres primeros.'],
  ['¿Cómo se organiza la Educación Básica?', 'En tres ciclos de tres años: I Ciclo de seis a nueve años, II Ciclo de nueve a doce y III Ciclo de doce a quince.'],
  ['¿Qué parte de Prebásica es obligatoria?', 'Solo el último año. Prebásica atiende de cero a tres y de tres a seis años, con tres años de duración cada tramo.'],
  ['¿Cuáles son las modalidades de Educación Media y cuánto duran?', 'El Bachillerato Científico Humanista, de dos años, y el Bachillerato Técnico Profesional, de tres.'],
  ['¿Cuáles son las áreas curriculares de Educación Básica?', 'Comunicación, Matemática, Ciencias Sociales, Ciencias Naturales, Educación Física, Tecnología y Educación Técnica.'],
  ['¿Cuáles son las áreas de Educación Prebásica?', 'Desarrollo Personal Social, Relación con el Entorno, y Comunicación y Representación.'],
  ['¿Desde qué ciclo se enseña Idioma Extranjero y dentro de qué área?', 'A partir del II Ciclo, dentro del área de Comunicación.'],
  ['¿Qué distingue al III Ciclo de los otros dos?', 'Tiene Tecnología como área independiente e incorpora la Educación Técnica como área de libre elección institucional.'],
  ['¿Cuáles son los tres ejes transversales del CNB?', 'La Identidad, El Trabajo y La Democracia Participativa. Atraviesan todas las áreas: no son una materia aparte.'],
  ['¿Qué son los Estándares Educativos?', 'Declaraciones claras, exigentes y consistentes sobre lo que se espera que aprenda el alumnado del Sistema Educativo Nacional.'],
  ['¿Qué son las expectativas de logro?', 'Opciones de carácter curricular que concretizan las intencionalidades educativas y las competencias de carácter conceptual, procedimental y actitudinal.'],
  ['¿Qué tres columnas trae la tabla del DCNB, y en qué orden?', 'Expectativas de Logro, luego Contenidos Conceptuales (■) y Actitudinales (●), y por último Procesos y Actividades Sugeridas.'],
];
let _fc = 0;
function fcPinta() {
  document.getElementById('fc')?.classList.remove('flip');
  const q = document.getElementById('fcQ'), a = document.getElementById('fcA'), n = document.getElementById('fcNum');
  if (q) q.textContent = FC[_fc][0];
  if (a) a.textContent = FC[_fc][1];
  if (n) n.textContent = (_fc + 1) + ' de ' + FC.length;
}
function fcVoltea() {
  const c = document.getElementById('fc');
  if (!c) return;
  c.classList.toggle('flip');
  if (c.classList.contains('flip') && !S.fcVistas.includes(_fc)) { S.fcVistas.push(_fc); xp(1); }
}
function fcPasa(d) { _fc = (_fc + d + FC.length) % FC.length; fcPinta(); }

/* ══════════════════ MEMORAMA ══════════════════ */
const MEMO = [
  ['CNB', 'El instrumento normativo de todo el sistema'],
  ['DCNB', 'El desarrollo del currículo para un nivel'],
  ['Estándar Educativo', 'A dónde debe llegar el alumnado del país'],
  ['Expectativa de logro', 'El escalón que le toca a su grado'],
  ['Eje transversal', 'Identidad, Trabajo y Democracia Participativa'],
  ['PEC', 'Donde el centro organiza tiempos y ejecución'],
];
let _memoAbiertas = [], _memoLogradas = 0, _memoCartas = [];
function memoInit() {
  _memoCartas = [];
  MEMO.forEach((p, i) => { _memoCartas.push({ par: i, t: p[0] }); _memoCartas.push({ par: i, t: p[1] }); });
  for (let i = _memoCartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_memoCartas[i], _memoCartas[j]] = [_memoCartas[j], _memoCartas[i]];
  }
  _memoAbiertas = []; _memoLogradas = 0;
  memoPinta();
}
function memoPinta() {
  const g = document.getElementById('memoGrid');
  if (!g) return;
  g.innerHTML = _memoCartas.map((c, i) => {
    const abierta = _memoAbiertas.includes(i), lograda = c.lograda;
    return `<button class="memo-c ${lograda ? 'lograda' : abierta ? 'abierta' : ''}" onclick="memoToca(${i})">${
      lograda || abierta ? c.t : '?'}</button>`;
  }).join('');
}
function memoToca(i) {
  const c = _memoCartas[i];
  if (c.lograda || _memoAbiertas.includes(i) || _memoAbiertas.length >= 2) return;
  _memoAbiertas.push(i);
  memoPinta();
  if (_memoAbiertas.length === 2) {
    const [a, b] = _memoAbiertas;
    if (_memoCartas[a].par === _memoCartas[b].par) {
      _memoCartas[a].lograda = _memoCartas[b].lograda = true;
      _memoLogradas++; _memoAbiertas = []; xp(1); sfx('bien');
      if (_memoLogradas === MEMO.length && !S.memo) { S.memo = 1; xp(4); }
      memoPinta();
    } else {
      setTimeout(() => { _memoAbiertas = []; memoPinta(); }, 850);
    }
  }
}

/* ══════════════════ QUIZ ══════════════════
   Reparto de correctas entre las cuatro letras (normativa 1-ter:
   ninguna pasa del 40 %). Aquí es a=2, b=3, c=2, d=2 sobre nueve. */
const QZ = [
  { q: 'El Currículo Nacional Básico es, ante todo…',
    o: ['Un instrumento normativo de carácter nacional', 'Una guía de sugerencias metodológicas',
        'Un libro de texto oficial', 'Un plan de capacitación docente'],
    c: 0, e: 'Normativo: establece lo que debe lograr todo sujeto del Sistema Educativo Nacional. No es de aplicación optativa.' },
  { q: '¿Cuántos niveles comprende el Sistema Educativo Hondureño?',
    o: ['Dos', 'Tres', 'Cuatro', 'Seis'],
    c: 2, e: 'Prebásica, Básica, Media y Superior. El CNB se concreta en los tres primeros, que son responsabilidad de la Secretaría de Educación.' },
  { q: 'La Educación Básica está organizada en…',
    o: ['Dos ciclos de cuatro años', 'Tres ciclos de tres años',
        'Seis grados sin ciclos', 'Cuatro ciclos de dos años'],
    c: 1, e: 'I Ciclo de seis a nueve años, II Ciclo de nueve a doce y III Ciclo de doce a quince.' },
  { q: 'La enseñanza de Idioma Extranjero se incorpora…',
    o: ['Desde el I Ciclo, como área independiente', 'Solo en Educación Media',
        'Desde Prebásica', 'A partir del II Ciclo, dentro del área de Comunicación'],
    c: 3, e: 'Va dentro de Comunicación, no como área aparte.' },
  { q: 'Los ejes transversales que establece el CNB son…',
    o: ['Lectura, Escritura y Cálculo', 'Identidad, Trabajo y Democracia Participativa',
        'Salud, Ambiente y Tecnología', 'Valores, Civismo y Deporte'],
    c: 1, e: 'Son elementos actitudinales que atraviesan todas las áreas: no son una materia con hora propia.' },
  { q: 'Una declaración clara, exigente y consistente sobre lo que se espera que aprenda el alumnado del país es…',
    o: ['Un estándar educativo', 'Una expectativa de logro',
        'Un contenido procedimental', 'Un bloque de contenido'],
    c: 0, e: 'El estándar es la meta común del sistema. La expectativa de logro es el escalón que le corresponde a un grado.' },
  { q: 'Las expectativas de logro concretizan competencias de carácter…',
    o: ['Únicamente conceptual', 'Conceptual y procedimental solamente',
        'Conceptual, procedimental y actitudinal', 'Actitudinal solamente'],
    c: 2, e: 'Las tres. Por eso una expectativa no se evalúa solo con una prueba escrita.' },
  { q: 'En la tabla del DCNB, la columna que trae las actividades ya pensadas es…',
    o: ['Expectativas de Logro', 'Contenidos Conceptuales y Actitudinales',
        'La de evaluación', 'Procesos y Actividades Sugeridas'],
    c: 3, e: 'Es la tercera columna, la de más a la derecha, y está escrita para ahorrarle el trabajo de inventar la actividad.' },
  { q: 'El área de libre elección institucional que incorpora el III Ciclo es…',
    o: ['Educación Física', 'Educación Técnica', 'Tecnología', 'Ciencias Sociales'],
    c: 1, e: 'La Educación Técnica. En ese mismo ciclo, Tecnología pasa a ser área independiente.' },
];
let _qzResp = [];
function qzPinta() {
  const c = document.getElementById('quiz');
  if (!c) return;
  c.innerHTML = QZ.map((q, i) => `
    <div class="q">
      <div class="q-num">Pregunta ${i + 1} de ${QZ.length}</div>
      <div class="q-txt">${q.q}</div>
      ${q.o.map((o, j) => `<button class="q-op" id="qz${i}-${j}" onclick="qzResp(${i},${j})">${'abcd'[j]}) ${o}</button>`).join('')}
      <div class="q-fb" id="qzfb${i}"></div>
    </div>`).join('');
}
function qzResp(i, j) {
  if (_qzResp[i] != null) return;
  _qzResp[i] = j;
  const bien = j === QZ[i].c;
  document.getElementById('qz' + i + '-' + j)?.classList.add(bien ? 'bien' : 'mal');
  if (!bien) document.getElementById('qz' + i + '-' + QZ[i].c)?.classList.add('bien');
  const fb = document.getElementById('qzfb' + i);
  if (fb) { fb.className = 'q-fb ' + (bien ? 'bien' : 'mal'); fb.textContent = (bien ? '✅ Correcto. ' : '❌ No era esa. ') + QZ[i].e; }
  sfx(bien ? 'bien' : 'mal');
  if (bien) xp(2);
  if (_qzResp.filter(x => x != null).length === QZ.length && !S.quiz) { S.quiz = 1; xp(4); }
  guardar();
}
let _clSel = null, _clPos = {}, _clTodas = [];
function clInit() {
  _clSel = null; _clPos = {};
  const banco = document.getElementById('clBanco'), cajas = document.getElementById('clCajas');
  if (!banco || !cajas) return;
  const todas = [];
  CL_GRUPOS.forEach((g, gi) => g.it.forEach(t => todas.push({ t, g: gi })));
  for (let i = todas.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [todas[i], todas[j]] = [todas[j], todas[i]]; }
  _clTodas = todas;
  cajas.innerHTML = CL_GRUPOS.map((g, i) => `
    <div class="cl-caja" id="clcaja${i}" onclick="clSuelta(${i})">
      <div class="cl-caja-t">${g.t}</div><div id="clcont${i}"></div>
    </div>`).join('');
  document.getElementById('clResu').className = 'resu';
  clPinta();
}
function clPinta() {
  const banco = document.getElementById('clBanco');
  banco.innerHTML = _clTodas.map((f, i) => _clPos[i] == null
    ? `<button class="cl-ficha ${_clSel === i ? 'sel' : ''}" onclick="clToca(${i})">${f.t}</button>` : '').join('');
  CL_GRUPOS.forEach((g, gi) => {
    const c = document.getElementById('clcont' + gi);
    if (c) c.innerHTML = _clTodas.map((f, i) => _clPos[i] === gi
      ? `<button class="cl-ficha" onclick="clSaca(${i})">${f.t}</button>` : '').join('');
  });
}
function clToca(i) { _clSel = (_clSel === i ? null : i); clPinta(); }
function clSuelta(gi) { if (_clSel == null) return; _clPos[_clSel] = gi; _clSel = null; clPinta(); }
function clSaca(i) { if (_clSel != null) return; delete _clPos[i]; clPinta(); }
function clRevisa() {
  let bien = 0;
  _clTodas.forEach((f, i) => { if (_clPos[i] === f.g) bien++; });
  const r = document.getElementById('clResu');
  r.className = 'resu on ' + (bien === _clTodas.length ? 'bien' : 'mal');
  r.innerHTML = `<span class="resu-num">${bien}/${_clTodas.length}</span>` +
    (bien === _clTodas.length ? 'Cada cosa en su sitio. Así se pregunta en el concurso.'
                              : 'Revise las que quedaron fuera de sitio y vuelva a intentarlo.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ CLASIFICA ══════════════════ */
const CL_GRUPOS = [
  { t: 'Estructura del sistema', it: ['Cuatro niveles', 'Tres ciclos en Básica', 'Dos modalidades en Media'] },
  { t: 'Áreas y ejes', it: ['Comunicación', 'La Identidad', 'Educación Técnica de libre elección'] },
  { t: 'Metas de aprendizaje', it: ['Estándar educativo', 'Expectativa de logro', 'Contenido procedimental'] },
  { t: 'Del papel a la clase', it: ['Jornalización por semanas', 'Proyecto Educativo de Centro', 'Adecuación curricular'] },
];

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['El Sistema Educativo Hondureño comprende ____ niveles.', ['4', 'cuatro']],
  ['La Educación Básica se organiza en ____ ciclos.', ['3', 'tres']],
  ['De Educación Prebásica solo es obligatorio el ____ año.', ['ultimo', 'último']],
  ['El Idioma Extranjero se incorpora a partir del ____ Ciclo.', ['II', '2', 'segundo']],
  ['El eje transversal que trabaja el Gobierno Escolar es la Democracia ____.', ['participativa']],
  ['La meta común del país se llama ____ educativo.', ['estandar', 'estándar']],
  ['El escalón que le toca a su grado se llama expectativa de ____.', ['logro']],
  ['Los planes de estudio de Educación Media calculan las horas anuales sobre ____ semanas.', ['40', 'cuarenta']],
];

function cpPinta() {
  const c = document.getElementById('completa');
  if (!c) return;
  c.innerHTML = CP.map((p, i) => `
    <div class="q">
      <div class="q-num">${i + 1}</div>
      <div class="q-txt">${p[0]}</div>
      <input class="q-inp" id="cp${i}" placeholder="Escriba aquí" autocomplete="off">
      <div class="q-fb" id="cpfb${i}"></div>
    </div>`).join('');
}
/* Se comparan sin tildes ni mayúsculas: el maestro escribe con el teclado
   del teléfono y no se le va a reprobar por una tilde. */
function norm(s) {
  return String(s).toLowerCase().trim()
    .normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/\s+/g, ' ');
}
function cpRevisa() {
  let bien = 0;
  CP.forEach((p, i) => {
    const v = norm(document.getElementById('cp' + i)?.value || '');
    const ok = p[1].some(a => norm(a) === v);
    if (ok) bien++;
    const fb = document.getElementById('cpfb' + i);
    if (fb) { fb.className = 'q-fb ' + (ok ? 'bien' : 'mal'); fb.textContent = ok ? '✅ Correcto' : '❌ La respuesta es: ' + p[1][0]; }
  });
  const r = document.getElementById('cpResu');
  r.className = 'resu on ' + (bien === CP.length ? 'bien' : 'mal');
  r.innerHTML = `<span class="resu-num">${bien}/${CP.length}</span>` +
    (bien === CP.length ? 'Los datos duros los tiene. Son los que se preguntan en el concurso y los que se citan en una reunión.'
                        : 'Vuelva a los peldaños por los que falló: el número se pega cuando se sabe para qué sirve.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   Aquí se ordena el camino que va del documento nacional al plan del
   lunes. No es memoria: es el orden en que se decide, y el maestro
   que lo tiene claro deja de planificar a ciegas. */
const RETO = [
  { t: 'El CNB fija áreas, ejes y estándares para todo el país', o: 1 },
  { t: 'El documento de su nivel desarrolla el currículo de ese nivel', o: 2 },
  { t: 'Dentro del nivel, usted ubica su ciclo y su grado', o: 3 },
  { t: 'En su grado busca el área y su bloque de contenido', o: 4 },
  { t: 'Del bloque toma la expectativa de logro que le toca', o: 5 },
  { t: 'Cuenta las semanas reales del año y reparte los bloques', o: 6 },
  { t: 'Lleva al centro lo que haya que acordar en el PEC', o: 7 },
  { t: 'Escribe el plan de clase con la expectativa completa', o: 8 },
  { t: 'Evalúa lo mismo que puso en la expectativa, no otra cosa', o: 9 },
];
let _retoOrden = [], _retoPend = [], _retoTimer = null, _retoSeg = 90;
function retoInit() {
  clearInterval(_retoTimer);
  _retoSeg = 90; _retoOrden = [];
  _retoPend = RETO.slice();
  for (let i = _retoPend.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [_retoPend[i], _retoPend[j]] = [_retoPend[j], _retoPend[i]]; }
  document.getElementById('retoResu').className = 'resu';
  document.getElementById('retoBtn').textContent = '🔄 Reiniciar';
  retoPinta();
  _retoTimer = setInterval(() => {
    _retoSeg--;
    retoReloj();
    if (_retoSeg <= 0) { clearInterval(_retoTimer); retoFin(false); }
  }, 1000);
  retoReloj();
}
function retoReloj() {
  const r = document.getElementById('retoReloj');
  if (r) r.textContent = Math.floor(_retoSeg / 60) + ':' + String(_retoSeg % 60).padStart(2, '0');
}
function retoPinta() {
  const l = document.getElementById('retoLista');
  if (!l) return;
  l.innerHTML = _retoOrden.map((it, i) => `<div class="reto-it sel">${i + 1}. ${it.t}</div>`).join('')
    + _retoPend.map((it, i) => `<button class="reto-it" onclick="retoToca(${i})">${it.t}</button>`).join('');
}
function retoToca(i) {
  const it = _retoPend[i];
  const menor = Math.min(..._retoPend.map(x => x.o));
  if (it.o !== menor) {
    clearInterval(_retoTimer);
    retoFin(false, 'Ese paso todavía no toca: falta uno anterior.');
    return;
  }
  _retoPend.splice(i, 1);
  _retoOrden.push(it);
  retoPinta();
  if (!_retoPend.length) { clearInterval(_retoTimer); retoFin(true); }
}
function retoFin(gano, motivo) {
  const r = document.getElementById('retoResu');
  r.className = 'resu on ' + (gano ? 'bien' : 'mal');
  r.innerHTML = gano
    ? `<span class="resu-num">¡Listo!</span>Puso el camino en orden con ${_retoSeg} segundos de sobra. Ese es el recorrido que hay detrás de cada plan de clase.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['CURRICULO', 'ESTANDAR', 'EXPECTATIVA', 'BLOQUE', 'CICLO', 'IDENTIDAD', 'TRABAJO', 'ESPACIO'];
const SOPA_N = 12;
let _sopaGrid = [], _sopaUbic = {}, _sopaHall = [], _sopaSel = null;
function sopaInit() {
  _sopaHall = []; _sopaSel = null; _sopaUbic = {};
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];
  let intento = 0;
  do {
    _sopaGrid = Array.from({ length: SOPA_N }, () => new Array(SOPA_N).fill(''));
    _sopaUbic = {};
    var ok = SOPA_PAL.every(p => {
      for (let t = 0; t < 300; t++) {
        const d = dirs[Math.floor(Math.random() * dirs.length)];
        const f = Math.floor(Math.random() * SOPA_N), c = Math.floor(Math.random() * SOPA_N);
        const ff = f + d[0] * (p.length - 1), cc = c + d[1] * (p.length - 1);
        if (ff < 0 || ff >= SOPA_N || cc < 0 || cc >= SOPA_N) continue;
        let cabe = true;
        for (let k = 0; k < p.length; k++) {
          const x = _sopaGrid[f + d[0] * k][c + d[1] * k];
          if (x && x !== p[k]) { cabe = false; break; }
        }
        if (!cabe) continue;
        const celdas = [];
        for (let k = 0; k < p.length; k++) { _sopaGrid[f + d[0] * k][c + d[1] * k] = p[k]; celdas.push([f + d[0] * k, c + d[1] * k]); }
        _sopaUbic[p] = celdas;
        return true;
      }
      return false;
    });
  } while (!ok && ++intento < 40);
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let f = 0; f < SOPA_N; f++) for (let c = 0; c < SOPA_N; c++)
    if (!_sopaGrid[f][c]) _sopaGrid[f][c] = abc[Math.floor(Math.random() * abc.length)];
  sopaPinta();
}
function sopaPinta() {
  const g = document.getElementById('sopaGrid');
  if (!g) return;
  g.style.gridTemplateColumns = `repeat(${SOPA_N}, 1fr)`;
  let h = '';
  for (let f = 0; f < SOPA_N; f++) for (let c = 0; c < SOPA_N; c++) {
    const hallada = _sopaHall.some(p => _sopaUbic[p].some(u => u[0] === f && u[1] === c));
    const sel = _sopaSel && _sopaSel[0] === f && _sopaSel[1] === c;
    h += `<div class="sopa-c ${hallada ? 'hallada' : ''} ${sel ? 'sel' : ''}" id="sc${f}-${c}" onclick="sopaToca(${f},${c})">${_sopaGrid[f][c]}</div>`;
  }
  g.innerHTML = h;
  const p = document.getElementById('sopaPal');
  if (p) p.innerHTML = SOPA_PAL.map(w => `<span class="${_sopaHall.includes(w) ? 'ok' : ''}">${w}</span>`).join('');
}
function sopaToca(f, c) {
  if (!_sopaSel) { _sopaSel = [f, c]; sopaPinta(); return; }
  const [f0, c0] = _sopaSel;
  _sopaSel = null;
  const df = f - f0, dc = c - c0;
  const largo = Math.max(Math.abs(df), Math.abs(dc)) + 1;
  const paso = [Math.sign(df), Math.sign(dc)];
  if (df !== 0 && dc !== 0 && Math.abs(df) !== Math.abs(dc)) { sopaPinta(); return; }
  let txt = '';
  for (let k = 0; k < largo; k++) txt += _sopaGrid[f0 + paso[0] * k][c0 + paso[1] * k];
  const rev = txt.split('').reverse().join('');
  const hit = SOPA_PAL.find(p => (p === txt || p === rev) && !_sopaHall.includes(p));
  if (hit) {
    _sopaHall.push(hit); xp(2); sfx('bien');
    if (_sopaHall.length === SOPA_PAL.length && !S.sopa) { S.sopa = 1; xp(5); }
    guardar();
  }
  sopaPinta();
}
function sopaLinterna() {
  xp(-2);
  const pend = SOPA_PAL.filter(p => !_sopaHall.includes(p));
  pend.forEach(p => _sopaUbic[p].forEach(u => document.getElementById('sc' + u[0] + '-' + u[1])?.classList.add('linterna')));
  setTimeout(() => document.querySelectorAll('.sopa-c.linterna').forEach(e => e.classList.remove('linterna')), 3000);
}

/* ══════════════════ SIMULACRO DE CONCURSO ══════════════════
   Veinte preguntas, una sola correcta, sin retroalimentación hasta
   calificar: así se siente la prueba real. Currículo es materia fija
   de las pruebas de conocimientos, así que aquí el simulacro va como
   simulacro, sin la excepción del área «Dominar M.E.T.A.S».
   Reparto de correctas: cinco en cada letra (normativa 1-ter). */
const CN = [
  { q: 'El Currículo Nacional Básico se define como:',
    o: ['Un instrumento normativo de carácter nacional', 'Una propuesta metodológica optativa',
        'Un reglamento interno de cada centro', 'Un manual de texto escolar'], c: 0 },
  { q: 'El CNB es resultado de la propuesta presentada por:',
    o: ['La Universidad Pedagógica', 'El Foro Nacional de Convergencia',
        'El Congreso Nacional', 'El Tribunal Superior de Cuentas'], c: 1 },
  { q: 'Los niveles del Sistema Educativo Hondureño son:',
    o: ['Prebásica, Básica y Media', 'Básica, Media y Superior',
        'Prebásica, Básica, Media y Superior', 'Inicial, Primaria, Secundaria y Universitaria'], c: 2 },
  { q: 'El CNB se concreta, bajo responsabilidad directa de la Secretaría de Educación, en:',
    o: ['Los cuatro niveles', 'Solo Educación Básica',
        'Educación Media y Superior', 'Prebásica, Básica y Media'], c: 3 },
  { q: 'La Educación Básica está estructurada en:',
    o: ['Seis grados y dos ciclos', 'Tres ciclos de tres años cada uno',
        'Nueve grados sin ciclos', 'Cuatro ciclos de dos años'], c: 1 },
  { q: 'El II Ciclo de Educación Básica atiende a la población de:',
    o: ['Seis a nueve años', 'Doce a quince años', 'Nueve a doce años', 'Tres a seis años'], c: 2 },
  { q: 'De Educación Prebásica es obligatorio:',
    o: ['Todo el nivel', 'Ningún año', 'Los últimos dos años', 'Solo el último año'], c: 3 },
  { q: 'El Bachillerato Científico Humanista tiene una duración de:',
    o: ['Dos años', 'Tres años', 'Cuatro años', 'Un año'], c: 0 },
  { q: 'El Bachillerato Técnico Profesional se caracteriza porque:',
    o: ['Solo prepara para la universidad', 'No permite el acceso a Educación Superior',
        'Permite el acceso a Educación Superior y habilita para el mercado laboral',
        'Sustituye a la Educación Media'], c: 2 },
  { q: 'Las áreas curriculares de Educación Básica incluyen:',
    o: ['Lectura, Escritura y Cálculo', 'Solo Español y Matemática',
        'Filosofía, Sociología y Psicología',
        'Comunicación, Matemática, Ciencias Sociales, Ciencias Naturales, Educación Física, Tecnología y Educación Técnica'], c: 3 },
  { q: 'Según el CNB, las áreas curriculares son:',
    o: ['Más amplias que las asignaturas', 'Sinónimo exacto de asignatura',
        'Más específicas que las asignaturas', 'Una lista de temas por grado'], c: 0 },
  { q: 'Las áreas curriculares de Educación Prebásica son:',
    o: ['Comunicación, Matemática y Ciencias', 'Desarrollo Personal Social, Relación con el Entorno, y Comunicación y Representación',
        'Lenguaje, Motricidad y Socialización', 'Identidad, Trabajo y Democracia'], c: 1 },
  { q: 'La enseñanza de Idioma Extranjero se incorpora dentro del área de Comunicación a partir del:',
    o: ['I Ciclo', 'III Ciclo', 'Nivel Prebásico', 'II Ciclo'], c: 3 },
  { q: 'El III Ciclo se diferencia de los anteriores porque:',
    o: ['Tiene Tecnología como área independiente e incorpora la Educación Técnica de libre elección institucional',
        'Elimina el área de Comunicación', 'Dura cuatro años', 'No trabaja ejes transversales'], c: 0 },
  { q: 'Los ejes transversales establecidos por el CNB son:',
    o: ['Salud, Ambiente y Género', 'La Identidad, El Trabajo y La Democracia Participativa',
        'Lectura, Investigación y Tecnología', 'Valores, Civismo y Deporte'], c: 1 },
  { q: 'Los ejes transversales se definen como:',
    o: ['Asignaturas con hora propia en el horario', 'Contenidos exclusivos de Ciencias Sociales',
        'Elementos actitudinales que orientan el aprendizaje y sostienen la integración del currículo',
        'Actividades de fin de año'], c: 2 },
  { q: 'Las declaraciones claras, exigentes y consistentes sobre lo que se espera que aprenda el alumnado se denominan:',
    o: ['Estándares educativos', 'Expectativas de logro', 'Bloques de contenido', 'Ejes transversales'], c: 0 },
  { q: 'Las expectativas de logro concretizan competencias de carácter:',
    o: ['Solo conceptual', 'Conceptual, procedimental y actitudinal',
        'Solo procedimental', 'Solo actitudinal'], c: 1 },
  { q: 'Los macrotemas de los que derivan los contenidos conceptuales, procedimentales y actitudinales se llaman:',
    o: ['Ejes transversales', 'Estándares', 'Bloques de contenido', 'Espacios curriculares'], c: 2 },
  { q: 'La atención a la diversidad en el CNB comprende los componentes de:',
    o: ['Educación rural, urbana y a distancia', 'Educación pública, privada y semioficial',
        'Educación técnica, artística y deportiva',
        'Educación intercultural bilingüe, educación especial y educación de jóvenes y adultos'], c: 3 },
];
let _cnResp = [];
function cnInit() {
  _cnResp = [];
  const c = document.getElementById('concurso');
  if (!c) return;
  c.innerHTML = CN.map((q, i) => `
    <div class="q">
      <div class="q-num">${i + 1} de ${CN.length}</div>
      <div class="q-txt">${q.q}</div>
      ${q.o.map((o, j) => `<button class="q-op" id="cn${i}-${j}" onclick="cnMarca(${i},${j})">${'abcd'[j]}) ${o}</button>`).join('')}
    </div>`).join('');
  document.getElementById('cnResu').className = 'resu';
}
function cnMarca(i, j) {
  _cnResp[i] = j;
  CN[i].o.forEach((_, k) => document.getElementById('cn' + i + '-' + k)?.classList.remove('sel', 'bien', 'mal'));
  document.getElementById('cn' + i + '-' + j)?.classList.add('sel');
}
function cnCalifica() {
  let bien = 0;
  const fallos = [];
  CN.forEach((q, i) => {
    const marc = _cnResp[i];
    CN[i].o.forEach((_, k) => document.getElementById('cn' + i + '-' + k)?.classList.remove('sel', 'bien', 'mal'));
    if (marc === q.c) { bien++; document.getElementById('cn' + i + '-' + q.c)?.classList.add('bien'); }
    else {
      fallos.push(i + 1);
      if (marc != null) document.getElementById('cn' + i + '-' + marc)?.classList.add('mal');
      document.getElementById('cn' + i + '-' + q.c)?.classList.add('bien');
    }
  });
  const nota = Math.round((bien / CN.length) * 100);
  const r = document.getElementById('cnResu');
  r.className = 'resu on ' + (nota >= 75 ? 'bien' : 'mal');
  r.innerHTML = `<span class="resu-num">${nota}/100</span>` +
    (nota >= 75
      ? `Pasa el listón del concurso (75). Acertó ${bien} de ${CN.length}.`
      : `Todavía no llega al 75 que exige el concurso. Acertó ${bien} de ${CN.length}.`) +
    (fallos.length ? `<div style="font-weight:600;font-size:14px;margin-top:8px">Repase las preguntas: ${fallos.join(', ')}.</div>` : '');
  sfx(nota >= 75 ? 'logro' : 'mal');
  if (nota >= 75 && !S.concurso) { S.concurso = 1; xp(15); }
  S.concursoNota = Math.max(S.concursoNota || 0, nota);
  guardar();
}

/* ══════════════════ CASOS ══════════════════ */
function casoVer(btn) {
  const r = btn.nextElementSibling;
  if (!r) return;
  r.classList.toggle('on');
  btn.textContent = r.classList.contains('on') ? '🙈 Ocultar' : '💡 Ver una salida';
  if (r.classList.contains('on') && !S.casos) { S.casos = 1; xp(2); }
}

/* ══════════════════ LOGROS Y CONSTANCIA ══════════════════ */
const LOGROS = [
  ['🪜 Subió la escalera', () => S.peldanos.length === PELDANOS.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó el camino', () => !!S.reto],
  ['🔤 Sopa terminada', () => !!S.sopa],
  ['🎯 Pasó el simulacro', () => !!S.concurso],
];
function pintaLogros() {
  const c = document.getElementById('logros');
  if (!c) return;
  c.innerHTML = LOGROS.map(l => `<span class="logro ${l[1]() ? 'on' : ''}">${l[0]}</span>`).join('');
}
function pintaConst() {
  const t = document.getElementById('constTxt');
  if (!t) return;
  const hechos = LOGROS.filter(l => l[1]()).length;
  const n = S.nombre || '';
  t.innerHTML = n
    ? `<b>${n}</b> completó ${hechos} de ${LOGROS.length} retos de esta misión, con ${S.xp} XP.` +
      (S.concursoNota ? ` Mejor nota en el simulacro: <b>${S.concursoNota}/100</b>.` : '')
    : 'Escriba su nombre arriba.';
}

/* ══════════════════ NAVEGACIÓN ══════════════════ */
const SECS = [
  ['sec-peldanos', '🪜 La escalera'],
  ['sec-aprende', '🧭 Aprende'],
  ['sec-tarjetas', '🃏 Tarjetas'],
  ['sec-quiz', '❓ Quiz'],
  ['sec-clasifica', '🗂️ Clasifica'],
  ['sec-completa', '✍️ Completa'],
  ['sec-reto', '⏱️ Reto'],
  ['sec-sopa', '🔤 Sopa'],
  ['sec-casos', '🏫 Casos'],
  ['sec-concurso', '🎯 Simulacro'],
  ['sec-cierre', '🖨️ Ficha'],
];
/* La sección activa lleva la clase «active» y los botones «nav-t» con data-s:
   son los nombres que busca metas-presentacion.js para el modo presentación y
   el modo libro. Cambiarlos deja al maestro sin esos dos apoyos. */
function go(id) {
  document.querySelectorAll('.sec').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.s === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'sec-reto') { clearInterval(_retoTimer); }
}
function navPinta() {
  const n = document.getElementById('nav');
  if (!n) return;
  n.innerHTML = SECS.map(([id, t], i) =>
    `<button class="nav-t ${i === 0 ? 'on' : ''}" data-s="${id}" onclick="go('${id}')">${t}</button>`).join('');
}

/* ══════════════════════════════════════════════════════════════
   PIE: SONIDO, TEMA, LOGROS Y REINICIAR
   Los mismos apoyos que traen las misiones del alumno, porque el
   maestro los usa en las mismas condiciones: pantalla al sol, vista
   cansada, aula con ruido y a veces un proyector. «🔎 Letra» y
   «📽️ Presentación» los agrega metas-presentacion.js al pie.
══════════════════════════════════════════════════════════════ */

/* Sonido corto y sintetizado: ni un archivo que descargar, que aquí se
   estudia con datos contados y a veces sin señal. */
let _audio = null;
function sfx(tipo) {
  if (S.sonido === 0) return;
  try {
    _audio = _audio || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { bien: [660, 880], mal: [220, 165], click: [520], logro: [660, 880, 1180] };
    (notas[tipo] || notas.click).forEach((f, i) => {
      const o = _audio.createOscillator(), g = _audio.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(.06, _audio.currentTime + i * .09);
      g.gain.exponentialRampToValueAtTime(.0001, _audio.currentTime + i * .09 + .16);
      o.connect(g); g.connect(_audio.destination);
      o.start(_audio.currentTime + i * .09); o.stop(_audio.currentTime + i * .09 + .18);
    });
  } catch (_) {}
}
window.sfx = sfx;
function toggleSnd() {
  S.sonido = S.sonido === 0 ? 1 : 0;
  const b = document.getElementById('sndBtn');
  if (b) b.textContent = S.sonido === 0 ? '🔇 Sonido' : '🔊 Sonido';
  guardar();
  sfx('click');
}

/* El tema se recuerda por misión, como en las del alumno */
function toggleTheme() {
  const oscuro = document.documentElement.getAttribute('data-theme') !== 'dark';
  document.documentElement.setAttribute('data-theme', oscuro ? 'dark' : 'light');
  const b = document.getElementById('themeBtn');
  if (b) b.textContent = oscuro ? '☀️ Tema' : '🌙 Tema';
  try { localStorage.setItem(SAVE_KEY + '_theme', oscuro ? 'dark' : 'light'); } catch (_) {}
  sfx('click');
}
function initTheme() {
  let t = null;
  try { t = localStorage.getItem(SAVE_KEY + '_theme'); } catch (_) {}
  const sis = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (t === 'dark' || (t === null && sis)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    const b = document.getElementById('themeBtn');
    if (b) b.textContent = '☀️ Tema';
  }
  const sb = document.getElementById('sndBtn');
  if (sb && S.sonido === 0) sb.textContent = '🔇 Sonido';
}

function toggleAchPanel() {
  const f = document.getElementById('achFondo');
  if (!f) return;
  const abrir = !f.classList.contains('on');
  if (abrir) {
    const hechos = LOGROS.filter(l => l[1]()).length;
    document.getElementById('achSub').textContent =
      hechos + ' de ' + LOGROS.length + ' completados · ' + S.xp + ' XP';
    document.getElementById('achLista').innerHTML = LOGROS.map(l =>
      `<div class="ach-fila ${l[1]() ? '' : 'no'}">${l[1]() ? '✅' : '⬜'} ${l[0]}</div>`).join('');
  }
  f.classList.toggle('on', abrir);
  sfx('click');
}

/* Reiniciar borra SOLO el progreso de esta misión (su clave), nunca los
   datos del aula. Se pregunta antes: el maestro pudo tocarlo sin querer. */
function resetXP() {
  if (!confirm('¿Empezar esta misión de nuevo?\n\nSe borra su avance en ella (XP, logros y el simulacro). Los datos de su aula no se tocan.')) return;
  const son = S.sonido;
  S = { xp: 0, peldanos: [], fcVistas: [], nombre: '', sonido: son,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
        casos: 0, concursoNota: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _pel = 0; _fc = 0; _qzResp = [];
  pelPinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); cnInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  pelPinta();
  fcPinta();
  memoInit();
  qzPinta();
  clInit();
  cpPinta();
  sopaInit();
  cnInit();
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = S.nombre || '';
  initTheme();
  pintaXP(); pintaLogros(); pintaConst();
});
