/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · M.E.T.A.S y SACE: qué hace cada uno

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   ─────────────────────────────────────────────────────────────
   ⚠️ LO QUE ESTA MISIÓN NO DICE, Y POR QUÉ

   Esta misión NO enseña a usar SACE por dentro: ni un menú, ni una
   pestaña, ni un plazo de digitación, ni un número de acuerdo. Y no
   es un olvido, es la norma de la casa aplicada al pie de la letra.

   La regla de la serie es «buscar no es leer»: si una misión va a
   citar un documento, el documento tiene que estar delante, en
   `_dev/leyes/`. Al escribir esta, el entorno de desarrollo NO
   alcanzó los portales del Estado (se.gob.hn, sace.se.gob.hn y
   tsc.gob.hn contestaron 403 a través del proxy), así que el Manual
   de Procesos del SACE no se pudo leer. Un extracto de buscador no
   acredita un procedimiento, y mandar a un maestro a una pestaña que
   ya no está, o darle un plazo derogado, es un daño concreto: el
   mismo error que ya costó caro con el Estatuto del Docente y quedó
   contado en INVESTIGACION-ESTATUTO-DOCENTE.md.

   Así que la misión se queda en lo que sí es firme y estable, que
   además es lo único que el maestro necesita para dejar de tener
   miedo:

   • De SACE: que es el Sistema de Administración de Centros
     Educativos de la Secretaría de Educación, que es el registro
     OFICIAL del Estado, que ahí viven la matrícula, la nota que
     cuenta legalmente y la certificación, y que no tiene sustituto.
   • De M.E.T.A.S: absolutamente todo, porque se cuenta en este
     mismo repositorio.
   • Del procedimiento (cuándo se digita, en qué pantalla, quién
     firma): NADA. En cada parada se le dice al maestro que lo
     confirme en su centro y lo anote antes de necesitarlo.

   SI ALGUIEN RETOMA ESTO: la forma de profundizar no es buscar más,
   es meter el documento al repositorio. Está pedido en
   `_dev/leyes/README.md`:

     manual-procesos-sace.pdf   (Secretaría de Educación, USINIEH)

   Con ese PDF delante se pueden añadir plazos y pantallas. Sin él,
   no se añade nada.

   ─────────────────────────────────────────────────────────────
   LAS OTRAS PLATAFORMAS: SIN NOMBRES EN AFIRMACIÓN NEGATIVA

   El apartado 4 de PROPUESTA-MISIONES-METAS-2026.md lo deja escrito
   y aquí se cumple: las otras plataformas se mencionan por FAMILIAS
   («los sistemas de gestión que se venden a colegios privados»,
   «los catálogos de contenido internacional»), nunca por nombre de
   empresa, y la comparación se hace solo sobre diferencias
   ESTRUCTURALES, que son verificables y no envejecen. Ningún nombre
   propio de empresa entra en una frase negativa. Dos razones: no
   hace falta, y un material que ataca a un competidor pierde
   autoridad ante el colega que lo lee.

   ─────────────────────────────────────────────────────────────
   LA SECCIÓN 10 NO ES UN SIMULACRO DE CONCURSO

   Misma excepción que en la misión de bienvenida, y por la misma
   razón: de esto no pregunta ningún concurso de nombramiento. Se
   conserva la mecánica entera (veinte preguntas, una correcta, sin
   pistas hasta calificar, listón en 75) y cambia el propósito: aquí
   mide si el maestro sabe DÓNDE VA CADA COSA, y al calificar le dice
   qué frontera confunde. Las condiciones de la excepción están en
   PLANTILLA-MISIONES-DEL-MAESTRO.md.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_SACE_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, paradas: [], fcVistas: [], nombre: '', sonido: 1,
  memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, diag: 0,
  casos: 0, diagNota: 0,
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
   EL RECORRIDO: OCHO MOMENTOS DEL AÑO ESCOLAR

   La propuesta pedía «tabla comparativa explorable, caso por caso»,
   y esto es eso. No se recorre por sistemas (aquí SACE, allá
   M.E.T.A.S), porque así el maestro se queda con dos listas y sigue
   sin saber qué hacer el lunes. Se recorre por MOMENTOS del año: el
   día que matricula, el día que pone el examen, el día que cierra el
   parcial. Y en cada momento se le dice qué parte es del sistema
   oficial, qué parte es de su plataforma y, sobre todo, QUIÉN MANDA.

   La parada 4 es el corazón de la misión: la nota. Es donde un
   maestro puede perder de verdad, si cree que registrar aquí ya es
   digitar allá.
══════════════════════════════════════════════════════════════ */
/* En cada parada, `ofi` es lo que corresponde al sistema OFICIAL y `metas` lo
   que corresponde a esta plataforma. La clave se llama `ofi` y no `sace` a
   propósito: el nombre del sistema del Estado puede cambiar (ya pasó con otras
   siglas del sector), y lo que no cambia es que hay un registro oficial y una
   herramienta de trabajo. Además evita que el comprobador de nombres propios
   confunda una clave de objeto con la sigla escrita en minúscula. */
const PARADAS = [
  {
    ic: '🧾', corto: 'El día que matricula al alumno',
    tit: 'Estar en su lista no es estar matriculado',
    sub: 'Momento 1 · quién existe de verdad para el sistema',
    txt: 'Es la confusión más cara de todas, y se resuelve en una frase: <b>la matrícula solo ' +
         'existe en un sitio, y no es este</b>. El registro oficial del alumno lo lleva el centro ' +
         'en <b>SACE</b>, que es el sistema de la Secretaría de Educación. Ahí está su expediente, ' +
         'y de ahí sale todo lo que después certifica. La lista que usted escribe en <b>Mi aula</b> ' +
         'es otra cosa: es su lista de trabajo, la que alimenta asistencia, notas, claves de ' +
         'familia y boleta. Sirve para trabajar, no para inscribir.',
    ofi: 'La matrícula del alumno, su expediente y lo que después certifica. Lo hace el centro.',
    metas: 'Su lista de trabajo, para asistencia, notas, colectas, claves de familia y Plan de Acción.',
    manda: 'El centro, en el sistema oficial. Si un alumno no está ahí, no está.',
    pasos: [
      'Escriba en Mi aula los nombres <b>tal como están en la matrícula oficial</b>, completos y sin abreviar.',
      'Si llega un alumno nuevo a mitad de año, avise a la dirección antes de anotarlo en su lista.',
      'Confirme en su centro quién registra la matrícula y en qué fechas, y anótelo.',
      'Al cerrar el año, compare su lista con la del centro: los nombres que no calzan se arreglan ahí.',
    ],
    nohacer: [
      'No dé por inscrito a un alumno porque ya aparece en Mi aula. Son dos cosas distintas.',
      'No use ninguna lista ni pantalla de M.E.T.A.S como constancia de matrícula: no lo es.',
      'No escriba el nombre de una manera aquí y de otra allá: la boleta y el recibo salen con el suyo.',
      'No matricule usted por su cuenta a nadie «para que no pierda el año»: eso se resuelve en la dirección.',
    ],
    aula: 'El alumno que trabajó todo el año y no está en el registro oficial se queda sin nada, por ' +
          'bien que le haya ido con usted. Revisar eso en marzo cuesta cinco minutos; en noviembre, un año.',
  },
  {
    ic: '📚', corto: 'El día que da el tema',
    tit: 'Aquí no hay reparto: la clase es solo suya',
    sub: 'Momento 2 · el contenido y la práctica',
    txt: 'Un sistema de administración de centros educativos administra: registros, matrícula, ' +
         'calificaciones. No trae la clase, ni el ejercicio, ni el juego con el que un niño de ' +
         'sexto entiende las fracciones. Eso es lo que M.E.T.A.S pone: <b>57 misiones</b> con ' +
         'contenido, práctica y evaluación, alineadas al DCNB y escritas para el alumno hondureño. ' +
         'Y lo pone <b>sin quitarle a usted la clase</b>: la misión practica y evalúa; explicar, ' +
         'sostener el grupo y decidir por dónde se avanza sigue siendo trabajo de maestro.',
    ofi: 'Nada en este momento: administra el centro, no da la clase.',
    metas: '57 misiones en 11 rutas y 7 materias, con juegos, evaluación y ficha imprimible con QR.',
    manda: 'Usted. La plataforma es material; la clase la sostiene el maestro.',
    pasos: [
      'Escoja del catálogo un tema que le toque este mes y recórralo entero antes de llevarlo.',
      'Decida qué parte hace en clase y qué parte deja para práctica.',
      'Imprima la ficha de esa misión para el aula sin dispositivos.',
      'Dicte una vez su código de aula, para que lo que trabajen le llegue a su cuenta.',
    ],
    nohacer: [
      'No ponga la misión y se siente: es un apoyo para atender a quien lo necesita, no un sustituto.',
      'No prometa a la dirección que la plataforma cubre el programa completo: son 57 temas, no el año.',
      'No lleve al aula una misión que usted no recorrió antes.',
    ],
    aula: 'Este es el único momento del año en el que no hay frontera que discutir. Todo lo que ' +
          'venga de aquí es tiempo que usted no gastó preparando desde cero.',
  },
  {
    ic: '🖨️', corto: 'El día que pone el examen',
    tit: 'El examen sale de aquí; la nota la pone usted',
    sub: 'Momento 3 · evaluar el tema',
    txt: 'M.E.T.A.S le arma el examen del tema con su <b>pauta</b> y su clave, en <b>30 formas</b> ' +
         'distintas: la Forma 7 genera siempre el mismo examen y la misma pauta, así que puede dar ' +
         'formas distintas por fila de pupitres y reimprimir la misma prueba dentro de un mes sin ' +
         'perder la correspondencia. Lo que no hace, y conviene tenerlo claro, es <b>calificar por ' +
         'usted ni decidir por usted</b>: la pauta es una ayuda, y el criterio es del maestro que ' +
         'conoce a ese grupo.',
    ofi: 'Nada en este momento: no genera exámenes ni pautas.',
    metas: 'La prueba imprimible del tema, con pauta, clave y 30 formas que se repiten iguales.',
    manda: 'Usted, con su criterio escrito y avisado antes de calificar.',
    pasos: [
      'Elija la Forma y anótela: el pie del examen la dice, y la pauta va con ella.',
      'Tenga su criterio escrito y avisado <b>antes</b> de aplicar la prueba.',
      'Guarde el instrumento y la pauta que usó: es la mitad de su respaldo.',
      'Corrija y anote la nota en M.E.T.A.S, que es donde le va a servir para el análisis.',
    ],
    nohacer: [
      'No reparta la misma Forma a todo el grado si le preocupa la copia: para eso hay treinta.',
      'No tire el examen ni la pauta después de entregar notas.',
      'No presente la nota de esta prueba como nota oficial: todavía le falta el paso 4.',
    ],
    aula: 'Aquí es donde se recuperan las horas de verdad. Redactar un examen con su pauta es media ' +
          'tarde; elegir una Forma es un toque.',
  },
  {
    ic: '🔢', corto: 'El día que cierra el parcial',
    tit: 'La nota que cuenta se digita en SACE, y nadie lo hace por usted',
    sub: 'Momento 4 · el punto donde un maestro puede perder de verdad',
    txt: 'Esta es la parada más importante de la misión. La nota que <b>certifica</b>, la que va al ' +
         'expediente del alumno y la que vale si mañana alguien pregunta, es la que está en el ' +
         'registro oficial. M.E.T.A.S le lleva el acumulativo, le arma la boleta y le enseña cómo ' +
         'quedó el grupo, y ahí <b>se detiene</b>: <b>no envía nada a SACE</b>, ni tiene forma de ' +
         'hacerlo, ni se le va a añadir en secreto. La nota la digita el maestro, en el sistema ' +
         'oficial, dentro de los plazos que fija la Secretaría y que su centro le va a recordar.',
    ofi: 'La nota oficial del parcial. La digita usted, y es la única que certifica.',
    metas: 'El acumulativo, la boleta imprimible, el Plan de Acción y el respaldo de cómo se llegó a esa nota.',
    manda: 'Usted, dos veces: decide la nota y la digita. El registro no se llena solo.',
    pasos: [
      'Cierre en M.E.T.A.S las evaluaciones del parcial y mire el Plan de Acción antes de decidir.',
      'Decida la nota de cada alumno con su criterio, no con la calculadora sola.',
      'Digítela en el sistema oficial y <b>compruebe que quedó guardada</b> antes de salir.',
      'Confirme en su centro la fecha límite de digitación de cada parcial y anótela en su cuaderno.',
      'Imprima la boleta de M.E.T.A.S para la familia y guarde su respaldo.',
    ],
    nohacer: [
      'No suponga que la nota «ya se subió» porque la registró aquí. Nadie la manda: la manda usted.',
      'No deje la digitación para el último día: si ese día no hay señal en el centro, el problema es suyo.',
      'No cambie una nota en un sitio y en el otro no: dos versiones de la misma nota es un reclamo servido.',
      'No entregue la boleta antes de haber cerrado la nota oficial, o va a entregar dos veces.',
    ],
    aula: 'La frase que hay que aprenderse: <b>SACE guarda la nota; M.E.T.A.S es donde esa nota se ' +
          'gana, se sustenta y se explica.</b> Se hacen las dos cosas, y en ese orden.',
  },
  {
    ic: '🔍', corto: 'El día que el grupo salió mal',
    tit: 'El registro guarda el número; no le dice qué hacer con él',
    sub: 'Momento 5 · entender antes de repetir',
    txt: 'Un registro oficial hace lo que tiene que hacer: guardar. Que el grupo salió en 62 va a ' +
         'quedar guardado con toda exactitud, y con eso solo no se arregla nada. Lo que cambia la ' +
         'clase siguiente es saber <b>quiénes</b> son los que van mal y <b>por qué contenido</b>: ' +
         'el <b>Plan de Acción</b> reparte al grupo en cinco categorías (Avanzado, Muy Bueno, ' +
         'Satisfactorio, Debe Mejorar, Insatisfactorio) y propone qué hacer con cada una, y la ' +
         '<b>Evidencia de misiones</b> le dice quién trabajó, cuánto y con qué resultado.',
    ofi: 'El dato guardado, con su respaldo oficial.',
    metas: 'El Plan de Acción con sus cinco categorías, el análisis y la Evidencia de misiones.',
    manda: 'Usted, que es quien conoce al grupo. La herramienta agrupa; decidir es del maestro.',
    pasos: [
      'Abra el Plan de Acción con las notas del parcial ya registradas.',
      'Mire cuántos alumnos hay en «Debe Mejorar» e «Insatisfactorio», y quiénes son.',
      'Pregúntese si fallaron por el mismo contenido: si media clase falló lo mismo, el problema fue la clase.',
      'Escriba qué va a hacer distinto, y con quiénes, antes de empezar el parcial siguiente.',
    ],
    nohacer: [
      'No lea el promedio del grado como si fuera un diagnóstico: un 62 puede ser dos grupos muy distintos.',
      'No use el reparto en categorías para etiquetar a un alumno delante de nadie.',
      'No espere a fin de año para mirarlo: en noviembre ya no hay clase que cambiar.',
    ],
    aula: 'Esto es lo que convierte «el grupo va mal» en «siete alumnos en Debe Mejorar por el mismo ' +
          'contenido». Lo primero se lamenta; lo segundo se atiende el lunes.',
  },
  {
    ic: '👨‍👩‍👧', corto: 'El día que la familia pregunta',
    tit: 'Lo que la casa quiere saber no se contesta con un registro',
    sub: 'Momento 6 · la comunicación con las familias',
    txt: 'Una madre no le pregunta a usted por un registro: le pregunta cómo va su hija, si faltó, ' +
         'qué se debe de la colecta y qué puede hacer en casa. Eso es exactamente lo que le ' +
         'contesta el <b>asistente de padres</b> con una <b>clave de familia</b> (el número de ' +
         'lista más cuatro caracteres), sin cuenta, sin correo y sin instalar nada, y enseñando ' +
         '<b>un solo alumno</b>, el suyo. Si su centro además le da a la familia algún acceso al ' +
         'sistema oficial, no estorba: son cosas distintas y no compiten.',
    ofi: 'El dato oficial del alumno, por la vía que el centro tenga establecida.',
    metas: 'El asistente de padres: notas, boleta del parcial, faltas, conducta, avisos y colaboraciones.',
    manda: 'Usted decide qué publica y cuándo. La clave la genera Mi aula y la entrega usted.',
    pasos: [
      'Imprima las tiras de claves desde Mi aula y recórtelas.',
      'Entréguelas en mano y en privado, en la primera reunión. Es una llave, no un volante.',
      'Diga en voz alta qué se va a poder ver, para que nadie espere lo que no está.',
      'Si una familia pregunta por su nota oficial o por un certificado, mándela a la dirección: eso no sale de aquí.',
    ],
    nohacer: [
      'No reparta claves en un grupo de WhatsApp: una clave publicada deja de ser una clave.',
      'No le diga a una familia que lo que ve en el asistente es su nota oficial. Es la suya, de trabajo.',
      'No use el asistente para dar noticias difíciles: eso se habla, y después se registra.',
    ],
    aula: 'El efecto real no es tecnológico: el padre deja de preguntar «¿cómo va mi hijo?» porque ya ' +
          'lo sabe, y llega a la reunión a hablar de qué hacer.',
  },
  {
    ic: '🎓', corto: 'El día que piden un papel',
    tit: 'Constancia no es certificado, y conviene decirlo antes',
    sub: 'Momento 7 · lo que vale ante el sistema',
    txt: 'Las misiones cierran con una <b>constancia</b> y el alumno la enseña con orgullo, que para ' +
         'eso está. Pero hay que ser claro, con las familias y con uno mismo: <b>es un ' +
         'reconocimiento de la plataforma, no un documento oficial</b>. Lo mismo con la constancia ' +
         'de estudio de estas misiones del maestro: es para su control, no vale como capacitación ' +
         'oficial ni da puntos de carrera. La <b>certificación de estudios</b> la emite el centro ' +
         'por la vía oficial, con el respaldo del registro del Estado.',
    ofi: 'El respaldo del que salen los certificados y las constancias oficiales del alumno.',
    metas: 'Constancias de logro para el alumno y de estudio para usted. Motivan; no certifican.',
    manda: 'El centro y la Secretaría. Ningún papel de una plataforma sustituye eso.',
    pasos: [
      'Explique la diferencia la primera vez que entregue una constancia, no la tercera.',
      'Si un padre pide un documento con valor, remítalo a la dirección del centro.',
      'Use las constancias para lo que sirven: reconocer el esfuerzo delante del grupo.',
      'Guarde su propia constancia de estudio como control personal, no como respaldo de carrera.',
    ],
    nohacer: [
      'No firme ni selle una constancia de la plataforma como si fuera un documento del centro.',
      'No presente su avance en estas misiones como capacitación acreditada.',
      'No prometa a una familia que con esto su hijo «ya tiene el grado aprobado».',
    ],
    aula: 'Decirlo usted primero le ahorra el mal rato. Un límite que el maestro explica es honestidad; ' +
          'el mismo límite descubierto por la familia es un problema.',
  },
  {
    ic: '📁', corto: 'El día que le piden respaldo',
    tit: 'El número está en el sistema; el cómo se llegó a él, en el suyo',
    sub: 'Momento 8 · supervisión, reclamo o reunión',
    txt: 'Llega una visita, o una madre que no acepta la nota, o le piden el informe del mes. El ' +
         'dato oficial va a estar donde tiene que estar. Lo que casi nadie tiene a mano es lo otro: ' +
         'con qué instrumento se evaluó, qué pauta se usó, cuántas veces faltó ese alumno, qué se ' +
         'hizo con los que iban mal, en qué se gastó la colecta. Todo eso lo lleva M.E.T.A.S sin ' +
         'que usted haga nada extra: <b>boleta</b>, <b>Parte Mensual</b>, <b>Evidencia de ' +
         'misiones</b>, <b>economía con recibo</b>. Es la misma lógica del artículo 6 de la Ley ' +
         'Fundamental de Educación, que ya tiene su misión en esta serie: lo que no está en papel, ' +
         'no ocurrió.',
    ofi: 'La nota oficial y el registro del alumno: el dato que certifica.',
    metas: 'El instrumento, la pauta, la asistencia, el análisis, el Parte Mensual y los recibos.',
    manda: 'Usted. El respaldo lo arma quien lo va a necesitar, y se arma antes.',
    pasos: [
      'Antes de la reunión, imprima la boleta y tenga a mano el instrumento y la pauta.',
      'Arme el Parte Mensual el mismo mes, no en diciembre.',
      'Si el reclamo es por una nota, enseñe cómo se llegó a ella, punto por punto.',
      'Guarde copia de lo que entregue, con fecha.',
    ],
    nohacer: [
      'No conteste de memoria: en esta materia gana el papel, no la razón.',
      'No enseñe pantallas con datos de otros alumnos para explicar el caso de uno.',
      'No corrija una nota sin dejar registrado por qué se corrigió.',
    ],
    aula: 'Un maestro que llega con papeles no discute: explica. Y el que explica con datos rara vez ' +
          'tiene que volver a hablar del mismo asunto.',
  },
];

let _par = 0;
/* La lista va en vertical y la parada se abre DEBAJO de la que se tocó: es el
   molde de la serie, y en el teléfono es la única forma de que se vean las
   ocho sin arrastrar. */
function rePinta() {
  const lista = document.getElementById('reLista');
  if (!lista) return;
  lista.innerHTML = PARADAS.map((t, i) => {
    const abierto = i === _par;
    return `
    <div class="re-item ${abierto ? 'on' : ''} ${S.paradas.includes(i) ? 'visto' : ''}" id="reIt${i}">
      <button class="re-cab" onclick="reVer(${i})" aria-expanded="${abierto}">
        <span class="re-num" aria-hidden="true">${t.ic}</span>
        <span class="re-tit">${t.corto}</span>
        ${S.paradas.includes(i) ? '<span class="re-visto">✓</span>' : ''}
        <span class="re-flecha" aria-hidden="true">▾</span>
      </button>
      ${abierto ? `
      <div class="re-det" id="reDet">
        <h3>${t.ic} ${t.tit}</h3>
        <div class="re-sub">${t.sub}</div>
        <p>${t.txt}</p>
        <div class="re-lado re-sace"><b>🏛️ Esto es de SACE</b>${t.ofi}</div>
        <div class="re-lado re-metas"><b>🚀 Esto es de M.E.T.A.S</b>${t.metas}</div>
        <div class="re-manda">⚖️ <b>Quién manda aquí:</b> ${t.manda}</div>
        <ol class="re-pasos">${t.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="re-nohacer"><b>⛔ Lo que no se hace</b>
          <ul>${t.nohacer.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="aula">🎯 <b>Qué le deja a su aula:</b> ${t.aula}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}
function reVer(i) {
  _par = i;
  if (!S.paradas.includes(i)) { S.paradas.push(i); xp(3); }
  rePinta();
  // Que la parada tocada quede a la vista aunque el texto empuje la lista
  const el = document.getElementById('reIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function reMover(d) { reVer(Math.max(0, Math.min(PARADAS.length - 1, _par + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════
   NOMBRES PROPIOS CON MAYÚSCULA, aquí también (normativa de la casa,
   en CLAUDE.md). Se comprueba con node _dev/verifica-nombres-propios.js. */
const FC = [
  ['¿Qué es SACE?', 'El Sistema de Administración de Centros Educativos, de la Secretaría de Educación de Honduras. Es el registro oficial del Estado.'],
  ['¿M.E.T.A.S sustituye a SACE?', 'No, y no va a hacerlo nunca. SACE guarda la nota; M.E.T.A.S es donde esa nota se gana, se sustenta y se explica.'],
  ['¿Quién digita la nota oficial?', 'Usted, en el sistema oficial. M.E.T.A.S no envía nada allá: si no la digitó, para el sistema esa nota no existe.'],
  ['¿Qué pasa con un alumno que no está en el registro oficial?', 'Para el sistema educativo no existe, por muchas misiones que haya completado. La matrícula la hace el centro.'],
  ['¿Para qué sirve entonces la lista de Mi aula?', 'Es su lista de trabajo: asistencia, notas, colectas con recibo, claves de familia, boleta y Plan de Acción. No matricula a nadie.'],
  ['¿Quién decide la nota de un alumno?', 'El maestro. Ni el registro oficial ni la plataforma deciden: uno la guarda y el otro le da con qué sustentarla.'],
  ['¿Qué vale la constancia de una misión?', 'Es un reconocimiento de la plataforma, no un documento oficial. La certificación de estudios la emite el centro por la vía oficial.'],
  ['¿Y la constancia de estudio de las misiones del maestro?', 'Es para su propio control. No vale como capacitación oficial ante la Secretaría de Educación ni da puntos de carrera.'],
  ['¿Dónde se ve por qué falló el grupo?', 'En el Plan de Acción, que reparte al grupo en cinco categorías. Un registro guarda el número; no lo explica.'],
  ['La frase que resume toda la misión', 'SACE guarda la nota; M.E.T.A.S es donde esa nota se gana, se sustenta y se explica.'],
  ['¿Qué le pasa al maestro que registra aquí y no digita allá?', 'Se queda sin nota oficial. El respaldo no sustituye el registro: se hacen las dos cosas, y en ese orden.'],
  ['¿Qué NO le enseña esta misión?', 'A usar SACE por dentro. Menús, pantallas y plazos los fija la Secretaría de Educación y cambian por circular: eso se confirma en su centro y se anota.'],
  ['¿En qué se diferencian los sistemas de gestión que se venden a colegios privados?', 'Resuelven la administración del centro, con contrato y con pago. M.E.T.A.S resuelve el aula, para el maestro, sin contrato y sin pago.'],
  ['¿Y los catálogos de contenido internacional?', 'Traen catálogos grandes, pero no están alineados al DCNB, no hablan de la realidad hondureña y casi todos exigen conexión permanente.'],
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
  ['SACE', 'El registro oficial del Estado'],
  ['Mi aula', 'La lista de trabajo del maestro'],
  ['La nota que certifica', 'Se digita en el sistema oficial'],
  ['El Plan de Acción', 'Explica por qué falló el grupo'],
  ['La constancia de una misión', 'Reconoce el esfuerzo, no certifica'],
  ['El certificado de estudios', 'Lo emite el centro por la vía oficial'],
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
   ninguna pasa del 40 %). Aquí es a=2, b=2, c=3, d=2 sobre nueve. */
const QZ = [
  { q: 'SACE es…',
    o: ['Una plataforma privada de contenido', 'El Sistema de Administración de Centros Educativos, de la Secretaría de Educación',
        'Un programa de la Dirección Departamental para capacitar docentes', 'Otro nombre de M.E.T.A.S'],
    c: 1, e: 'Es el registro oficial del Estado: ahí viven la matrícula, la nota que cuenta legalmente y la certificación.' },
  { q: 'La nota que certifica al alumno queda registrada en…',
    o: ['M.E.T.A.S, que la envía sola', 'El cuaderno del maestro',
        'El sistema oficial, digitada por el maestro', 'La boleta impresa'],
    c: 2, e: 'M.E.T.A.S no envía nada al sistema oficial. La digita usted, y esa es la única que certifica.' },
  { q: 'Un alumno aparece en su lista de Mi aula. Eso quiere decir que…',
    o: ['Usted lo tiene en su lista de trabajo, nada más', 'Ya quedó matriculado',
        'El centro ya lo registró', 'Tiene expediente oficial abierto'],
    c: 0, e: 'La matrícula es un acto oficial del centro. Mi aula es una lista de trabajo: sirve para trabajar, no para inscribir.' },
  { q: 'La constancia que el alumno recibe al terminar una misión…',
    o: ['Certifica el grado aprobado', 'Sustituye el certificado del centro',
        'Vale ante la Dirección Departamental', 'Reconoce su esfuerzo, pero no es un documento oficial'],
    c: 3, e: 'Motiva, y para eso está. La certificación de estudios la emite el centro por la vía oficial.' },
  { q: 'El grupo salió con promedio 62. ¿Dónde se averigua qué hacer con eso?',
    o: ['En el registro oficial, que guarda el dato', 'En el Plan de Acción de M.E.T.A.S, que reparte al grupo y propone qué hacer',
        'En la boleta', 'En el Parte Mensual'],
    c: 1, e: 'Un registro guarda con exactitud; no analiza. El Plan de Acción convierte «el grupo va mal» en alumnos concretos.' },
  { q: 'Una madre le pregunta cómo va su hija. Lo que resuelve eso es…',
    o: ['Mandarla a la dirección', 'Enseñarle el registro oficial',
        'Su clave de familia en el asistente de padres', 'Esperar a la entrega de boletas'],
    c: 2, e: 'Sin cuenta, sin correo y sin instalar nada, y enseñando un solo alumno: el suyo.' },
  { q: 'Si usted registra las notas en M.E.T.A.S y no las digita en el sistema oficial…',
    o: ['El sistema las toma igual, con retraso', 'Se pierde la nota oficial de ese parcial',
        'El centro las copia de la boleta', 'No pasa nada, la boleta sirve'],
    c: 1, e: 'El respaldo no sustituye el registro. Se hacen las dos cosas, y en ese orden: decidir, digitar, respaldar.' },
  { q: 'Sobre las otras plataformas educativas, esta serie enseña a…',
    o: ['Explicar en qué se diferencian, sin desacreditar a ninguna', 'Advertir a los colegas de cuáles son malas',
        'No mencionarlas jamás', 'Compararlas por precio'],
    c: 0, e: 'La comparación se hace sobre diferencias estructurales, que son verificables. Un material que ataca a un competidor pierde autoridad.' },
  { q: 'Los plazos y las pantallas para digitar notas en el sistema oficial…',
    o: ['Están explicados en esta misión', 'Son los mismos todos los años',
        'Los fija la Secretaría de Educación y se confirman en su centro', 'Los decide cada maestro'],
    c: 2, e: 'Por eso esta misión no los inventa: lo que cambia por circular se pregunta donde se sabe, y se anota antes de necesitarlo.' },
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

/* ══════════════════ CLASIFICA ══════════════════
   Las cuatro cajas son la frontera entera de la misión, y la cuarta es
   la que más enseña: hay cosas que no las hace ninguno de los dos
   sistemas porque son del maestro. Un maestro que espera que la
   plataforma «decida» la nota es el mismo que después se queja de la
   plataforma. */
const CL_GRUPOS = [
  { t: 'Solo en SACE', it: ['La matrícula oficial', 'La nota que certifica', 'El certificado de estudios'] },
  { t: 'Solo en M.E.T.A.S', it: ['Misiones con juegos y evaluación', 'La clave de familia', 'El Plan de Acción'] },
  { t: 'En los dos, cada uno a lo suyo', it: ['La lista de sus alumnos', 'Las notas del parcial', 'Dejar constancia de lo hecho'] },
  { t: 'En ninguno: eso es suyo', it: ['Decidir la nota final', 'Explicar el tema en clase', 'Sostener la disciplina del grupo'] },
];
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
    (bien === _clTodas.length ? 'Tiene la frontera clara. Con eso ya no hace dos veces el mismo trabajo.'
                              : 'Revise las que quedaron fuera de sitio: ahí es donde se meten los problemas.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['SACE es el Sistema de Administración de Centros ____.', ['Educativos', 'educativos']],
  ['La matrícula del alumno la hace el ____ en el sistema oficial.', ['centro', 'centro educativo']],
  ['M.E.T.A.S no envía nada a SACE: la nota oficial la digita ____.', ['usted', 'el maestro', 'el docente']],
  ['Un alumno que no está en SACE no ____ para el sistema educativo.', ['existe']],
  ['La lista de Mi aula es una lista de ____, no una matrícula.', ['trabajo']],
  ['La constancia de una misión es un reconocimiento, no un ____ oficial.', ['certificado', 'documento']],
  ['SACE guarda la nota; M.E.T.A.S es donde esa nota se ____, se sustenta y se explica.', ['gana']],
  ['Quien decide la nota final de un alumno es el ____.', ['maestro', 'docente']],
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
   del teléfono y no se le va a reprobar por una tilde. Ojo: la PRIMERA de
   cada lista es la que se le muestra cuando falla, así que esa va escrita
   como se debe («Educativos», no «educativos»). */
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
    (bien === CP.length ? 'Eso es lo que hay que poder decir de memoria cuando un colega pregunte.'
                        : 'Vuelva al momento del año por el que falló: la frontera se aprende con el caso, no con la definición.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   El cierre de parcial, en orden. Aquí el orden no es un capricho
   didáctico: entregar la boleta antes de cerrar la nota oficial obliga a
   entregar dos veces, y digitar sin haber mirado el Plan de Acción es
   perder el único momento del año en que ese análisis sirve para algo. */
const RETO = [
  { t: 'Cierra en M.E.T.A.S las evaluaciones del parcial', o: 1 },
  { t: 'Abre el Plan de Acción y mira cómo quedó el grupo', o: 2 },
  { t: 'Decide la nota de cada alumno, con su criterio escrito', o: 3 },
  { t: 'Digita esa nota en el sistema oficial', o: 4 },
  { t: 'Comprueba que quedó guardada antes de salir', o: 5 },
  { t: 'Imprime la boleta de M.E.T.A.S para la familia', o: 6 },
  { t: 'Publica el aviso a las familias', o: 7 },
  { t: 'Guarda el respaldo: instrumento, pauta y registro', o: 8 },
  { t: 'Anota qué hay que reforzar el próximo parcial', o: 9 },
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
    ? `<span class="resu-num">¡Listo!</span>Puso el cierre de parcial en orden con ${_retoSeg} segundos de sobra. Ese es el orden que evita entregar dos veces.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['SACE', 'MATRICULA', 'CERTIFICADO', 'REGISTRO', 'OFICIAL', 'BOLETA', 'RESPALDO', 'EVIDENCIA'];
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

/* ══════════════════════════════════════════════════════════════
   SECCIÓN 10 · «¿SABE DÓNDE VA CADA COSA?»
   Aquí iría el simulacro de concurso de la plantilla, y no va: de
   esto no pregunta ningún concurso de nombramiento, y ponerle esa
   etiqueta a veinte preguntas que nadie le va a hacer sería el primer
   dato falso de una misión cuyo asunto es justamente decir la verdad
   sobre lo que cada sistema hace.

   Misma mecánica (veinte preguntas, una correcta, sin
   retroalimentación hasta calificar, listón en 75) y otro propósito:
   mide si el maestro tiene clara la FRONTERA, y al calificar le dice
   cuál de las cinco confunde. Esa es la que le va a costar un
   problema.

   Reparto de correctas: a=5, b=5, c=5, d=5 sobre veinte (ninguna
   pasa del 40 %, normativa 1-ter). Van interleadas por bloque a
   propósito: agrupadas, la tercera de cada bloque se contesta por
   inercia.
══════════════════════════════════════════════════════════════ */
const DIAG_BLOQUES = [
  'Matrícula y alumnos',
  'Notas y evaluación',
  'La familia',
  'Papeles y respaldo',
  'Lo que decide usted',
];
/* b: índice del bloque al que pertenece la pregunta */
const DG = [
  { b: 0, q: 'La matrícula oficial de un alumno se hace:',
    o: ['En Mi aula, al escribir su nombre', 'En el sistema oficial, y la hace el centro',
        'En el catálogo, al darle el código de aula', 'En la boleta del primer parcial'], c: 1 },
  { b: 1, q: 'La nota que certifica al alumno queda registrada:',
    o: ['En el sistema oficial, digitada por el maestro', 'En M.E.T.A.S, que la envía sola',
        'En la boleta impresa', 'En la Evidencia de misiones'], c: 0 },
  { b: 2, q: 'Para consultar cómo va su hija, la familia usa:',
    o: ['El sistema oficial, con una cuenta', 'Una llamada al maestro',
        'Su clave de familia en el asistente de padres', 'La boleta, cuando se entrega'], c: 2 },
  { b: 3, q: 'El instrumento y la pauta con que evaluó un tema quedan guardados:',
    o: ['En el registro oficial', 'En la Dirección Departamental',
        'En ningún lado: se botan', 'En M.E.T.A.S, y son la mitad de su respaldo'], c: 3 },
  { b: 4, q: 'Quién decide la nota final de un alumno:',
    o: ['El promedio automático', 'El maestro, con su criterio escrito',
        'El sistema oficial', 'La plataforma, según los juegos completados'], c: 1 },

  { b: 0, q: 'Un alumno aparece en su lista de Mi aula. Eso significa que:',
    o: ['Ya está matriculado', 'Ya tiene expediente oficial',
        'Lo tiene en su lista de trabajo, nada más', 'El centro ya lo registró'], c: 2 },
  { b: 1, q: 'Si registra las notas en M.E.T.A.S y no las digita en el sistema oficial:',
    o: ['El sistema las toma igual, con retraso', 'El centro las copia de la boleta',
        'No pasa nada, la boleta sirve', 'Se queda sin la nota oficial de ese parcial'], c: 3 },
  { b: 2, q: 'Con su clave de familia, una madre puede ver:',
    o: ['Las notas de todo el grado', 'Solo lo de su hijo o hija',
        'El expediente oficial del alumno', 'La planificación del maestro'], c: 1 },
  { b: 3, q: 'Le piden el informe del mes. Lo arma:',
    o: ['El Parte Mensual de M.E.T.A.S, con lo que ya registró', 'El sistema oficial, solo',
        'La Dirección Departamental', 'Nadie: se escribe a mano cada vez'], c: 0 },
  { b: 4, q: 'Explicar el tema en clase y sostener al grupo es trabajo de:',
    o: ['La plataforma', 'El sistema oficial',
        'Las fichas imprimibles', 'El maestro, y no lo hace ningún sistema'], c: 3 },

  { b: 0, q: 'Los nombres de sus alumnos en Mi aula deben escribirse:',
    o: ['Abreviados, para que quepan', 'Como cada quien prefiera',
        'Tal como están en la matrícula oficial', 'Solo con el primer nombre'], c: 2 },
  { b: 1, q: 'La evaluación de una misión trae 30 formas. Eso sirve para:',
    o: ['Que cada alumno reciba una prueba distinta y sin pauta', 'Dar formas distintas por fila y reimprimir la misma prueba con su pauta',
        'Cambiar el contenido del tema', 'Subir la nota del grupo'], c: 1 },
  { b: 2, q: 'Si una familia le pide un certificado de estudios:',
    o: ['Se lo imprime desde M.E.T.A.S', 'Le entrega la constancia de la misión',
        'La remite a la dirección del centro, que es la vía oficial', 'Le enseña la boleta'], c: 2 },
  { b: 3, q: 'Ante un reclamo por una nota, lo que lo respalda es:',
    o: ['Su memoria de cómo trabajó el alumno', 'El criterio escrito, el instrumento, la pauta y el registro',
        'La palabra del director', 'El promedio del grado'], c: 1 },
  { b: 4, q: 'El Plan de Acción reparte al grupo en cinco categorías. Lo que hace usted con eso es:',
    o: ['Archivarlo con la boleta', 'Enviarlo al sistema oficial',
        'Publicarlo en el aula', 'Decidir a quién atiende primero y con qué'], c: 3 },

  { b: 0, q: 'Un alumno trabajó todo el año con usted pero no está en el registro oficial:',
    o: ['Para el sistema educativo no existe, y hay que resolverlo en la dirección', 'Se le certifica igual con la constancia de las misiones',
        'Basta con que aparezca en la Evidencia', 'La plataforma lo registra sola al final del año'], c: 0 },
  { b: 1, q: 'Los plazos para digitar las notas de cada parcial:',
    o: ['Vienen en esta misión', 'Son iguales todos los años',
        'Los decide cada maestro', 'Los fija la Secretaría de Educación y se confirman en el centro'], c: 3 },
  { b: 2, q: 'Las tiras de claves de familia se entregan:',
    o: ['Por el grupo de WhatsApp del grado', 'En mano y en privado, explicando qué se ve con ellas',
        'Pegadas en la pizarra', 'Solo a quien las pida'], c: 1 },
  { b: 3, q: 'La constancia que el alumno recibe al terminar una misión:',
    o: ['Certifica el grado aprobado', 'Sustituye el certificado del centro',
        'Reconoce su esfuerzo, pero no es un documento oficial', 'Vale ante la Dirección Departamental'], c: 2 },
  { b: 4, q: 'Sobre otras plataformas educativas, ante un colega conviene:',
    o: ['Explicar en qué se diferencian, sin desacreditar a ninguna', 'Advertirle de cuáles son malas',
        'No hablar del tema', 'Compararlas por precio'], c: 0 },
];
let _dgResp = [];
function dgInit() {
  _dgResp = [];
  const c = document.getElementById('diag');
  if (!c) return;
  c.innerHTML = DG.map((q, i) => `
    <div class="q">
      <div class="q-num">${i + 1} de ${DG.length}<span class="q-bloque">${DIAG_BLOQUES[q.b]}</span></div>
      <div class="q-txt">${q.q}</div>
      ${q.o.map((o, j) => `<button class="q-op" id="dg${i}-${j}" onclick="dgMarca(${i},${j})">${'abcd'[j]}) ${o}</button>`).join('')}
    </div>`).join('');
  document.getElementById('dgResu').className = 'resu';
}
function dgMarca(i, j) {
  _dgResp[i] = j;
  DG[i].o.forEach((_, k) => document.getElementById('dg' + i + '-' + k)?.classList.remove('sel', 'bien', 'mal'));
  document.getElementById('dg' + i + '-' + j)?.classList.add('sel');
}
/* Qué se le dice al maestro cuando una frontera queda floja. No es un
   regaño: es el problema concreto que esa confusión le va a costar. */
const DIAG_SALIDA = [
  'Compare su lista de Mi aula con la matrícula del centro, nombre por nombre. Ahí es donde se pierde un alumno.',
  'Repase la parada del cierre de parcial: la nota que certifica se digita en el sistema oficial, y nadie lo hace por usted.',
  'Prepare cómo va a entregar las claves de familia y qué va a decir que se ve con ellas.',
  'Arme su carpeta de respaldo antes de necesitarla: criterio escrito, instrumento, pauta y registro.',
  'Vuelva a la sección «Cada cosa en su sitio»: hay decisiones que no las toma ningún sistema, las toma usted.',
];
function dgCalifica() {
  let bien = 0;
  const porBloque = DIAG_BLOQUES.map(() => ({ bien: 0, total: 0 }));
  DG.forEach((q, i) => {
    const marc = _dgResp[i];
    porBloque[q.b].total++;
    DG[i].o.forEach((_, k) => document.getElementById('dg' + i + '-' + k)?.classList.remove('sel', 'bien', 'mal'));
    if (marc === q.c) { bien++; porBloque[q.b].bien++; document.getElementById('dg' + i + '-' + q.c)?.classList.add('bien'); }
    else {
      if (marc != null) document.getElementById('dg' + i + '-' + marc)?.classList.add('mal');
      document.getElementById('dg' + i + '-' + q.c)?.classList.add('bien');
    }
  });
  const nota = Math.round((bien / DG.length) * 100);
  /* La frontera más floja primero: es lo que el maestro se lleva de aquí. */
  const orden = porBloque.map((p, i) => ({ i, ...p })).sort((a, b) => a.bien - b.bien);
  const flojo = orden[0];
  const filas = porBloque.map((p, i) =>
    `<div class="diag-fila ${p.bien <= 2 ? 'floja' : 'buena'}">
       <span class="df-n">${p.bien}/${p.total}</span><span>${DIAG_BLOQUES[i]}</span>
     </div>`).join('');
  const r = document.getElementById('dgResu');
  r.className = 'resu on ' + (nota >= 75 ? 'bien' : 'mal');
  r.innerHTML = `<span class="resu-num">${nota}/100</span>` +
    (nota >= 75
      ? `Tiene la frontera clara: acertó ${bien} de ${DG.length}.`
      : `Todavía hay fronteras que se le mezclan: acertó ${bien} de ${DG.length}.`) +
    `<div class="diag-bloques">${filas}</div>` +
    (flojo.bien < flojo.total
      ? `<div style="font-weight:600;font-size:14px;margin-top:10px;text-align:left">👉 <b>Lo que le conviene revisar:</b>
           ${DIAG_SALIDA[flojo.i]}</div>`
      : `<div style="font-weight:600;font-size:14px;margin-top:10px">Sin fronteras flojas. Esta es la misión que hay que contarle al colega que tiene miedo de usar la plataforma.</div>`);
  sfx(nota >= 75 ? 'logro' : 'mal');
  if (nota >= 75 && !S.diag) { S.diag = 1; xp(15); }
  S.diagNota = Math.max(S.diagNota || 0, nota);
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
  ['🗓️ Recorrió los ocho momentos', () => S.paradas.length === PARADAS.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó el cierre de parcial', () => !!S.reto],
  ['🔤 Sopa terminada', () => !!S.sopa],
  ['🧭 Pasó el diagnóstico', () => !!S.diag],
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
      (S.diagNota ? ` Mejor nota en el diagnóstico de fronteras: <b>${S.diagNota}/100</b>.` : '')
    : 'Escriba su nombre arriba.';
}

/* ══════════════════ NAVEGACIÓN ══════════════════ */
const SECS = [
  ['sec-recorrido', '🗓️ Momentos'],
  ['sec-aprende', '💡 Aprende'],
  ['sec-tarjetas', '🃏 Tarjetas'],
  ['sec-quiz', '❓ Quiz'],
  ['sec-clasifica', '🗂️ Cada cosa'],
  ['sec-completa', '✍️ Completa'],
  ['sec-reto', '⏱️ Reto'],
  ['sec-sopa', '🔤 Sopa'],
  ['sec-casos', '🏫 Casos'],
  ['sec-diagnostico', '🧭 ¿Dónde va?'],
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
  if (!confirm('¿Empezar esta misión de nuevo?\n\nSe borra su avance en ella (XP, logros y el diagnóstico). Los datos de su aula no se tocan.')) return;
  const son = S.sonido;
  S = { xp: 0, paradas: [], fcVistas: [], nombre: '', sonido: son,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, diag: 0,
        casos: 0, diagNota: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _par = 0; _fc = 0; _qzResp = [];
  rePinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); dgInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  rePinta();
  fcPinta();
  memoInit();
  qzPinta();
  clInit();
  cpPinta();
  sopaInit();
  dgInit();
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = S.nombre || '';
  initTheme();
  pintaXP(); pintaLogros(); pintaConst();
});
