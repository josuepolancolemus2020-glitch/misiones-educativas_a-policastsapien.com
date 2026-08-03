/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · M.E.T.A.S y SACE: qué hace cada uno

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   ─────────────────────────────────────────────────────────────
   FUENTES: LEÍDAS, NO BUSCADAS

   Lo de SACE que se afirma aquí sale de los manuales oficiales, que
   están en el repositorio y hay que tener delante para tocar esta
   misión:

     _dev/leyes/Manual_de_usuario_SACE_Docente.pdf
     _dev/leyes/sace_manual_de_usuario_director.pdf

   Los publica la Unidad del Sistema Nacional de Información
   Educativa de Honduras (USINIEH) de la Secretaría de Educación.

   ⚠️ EL DATO QUE MANDA SOBRE TODOS LOS DEMÁS: los dos son
   **versión 2.0**. El del docente se actualizó en **junio de 2019**
   y el del director en **septiembre de 2017**. Esta misión se
   escribió en agosto de 2026, o sea que los manuales tienen entre
   siete y nueve años. Por eso:

   • Se cuenta el FLUJO (qué módulo, en qué orden, qué produce),
     que es lo que aguanta el tiempo.
   • NO se cuenta ninguna FECHA de digitación ni ningún plazo: eso
     lo fija la Secretaría cada año por circular y no está en los
     manuales.
   • Cada vez que se nombra un botón, la misión dice que si la
     pantalla no calza, gana la pantalla del maestro, y le recuerda
     la línea de soporte (104, en el pie de todas las páginas del
     manual del director).

   Primera versión de esta misión, escrita antes de tener los PDF,
   no citaba nada de SACE y mandaba al maestro a preguntarlo todo en
   su centro. Con los documentos leídos se corrigieron dos cosas que
   estaban dichas de menos y una dicha de más:

   1. Las notas NO se teclean en una pantalla: se descarga un
      archivo con el cuadro de calificaciones, se llena con la nota
      total y las inasistencias por parcial, y se vuelve a subir
      (Manual del docente, módulo Notas). Eso cambia por completo el
      consejo práctico de la misión: M.E.T.A.S produce exactamente
      esas dos columnas.
   2. SACE SÍ tiene acceso para el padre de familia: el
      administrador del centro lo genera con usuario y contraseña,
      si el alumno tiene matrícula activa (Manual del director,
      «Generar Acceso Padre de Familia | Encargado»). Antes la
      misión decía «por la vía que el centro tenga», que era vago.
   3. El Tablero de Estadísticas del propio SACE ya da el listado de
      reprobados y de alumnos en peligro de reprobación. Decir que
      «el registro solo guarda y no analiza» era pasarse: guarda,
      avisa quiénes, y no dice por qué ni qué hacer. Así se dice
      ahora.

   LO QUE SIGUE SIN DECIRSE, Y HAY QUE MANTENERLO ASÍ: fechas de
   digitación, plazos de matrícula y cualquier cosa que cambie por
   circular. Eso se pregunta en el centro, y la ficha trae la lista.

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
   LAS CIFRAS DEL CATÁLOGO SE CUENTAN, NO SE ESCRIBEN

   Normativa de la casa (CLAUDE.md). Cuántas misiones hay no es un
   dato del proyecto: es una FOTO. El plan es cubrir el currículo
   entero de Básica en sus tres ciclos y el de Media, así que un
   texto que diga «son 57 misiones» envejece en una semana y, peor,
   le sugiere al maestro que eso es todo lo que va a haber.

   Por eso esta misión carga el catálogo del alumno
   (js/data/misiones.js, que es puro dato y no engancha nada) y
   pinta las cifras al vuelo. En el texto se escriben marcadores:

     {{MISIONES}}  {{RUTAS}}  {{MATERIAS}}  {{INGLES}}

   y se rellenan al arrancar, tanto en el HTML escrito a mano como
   en los bancos de datos de aquí abajo. El día que entre la misión
   siguiente, este texto se corrige solo.

   OJO al redactar: que el número se cuente no basta. La FRASE
   también tiene que decir que la lista crece («hoy», «y siguen
   entrando»), porque el maestro lee una cifra y la da por final.
══════════════════════════════════════════════════════════════ */
const CAT = (function () {
  try {
    const m = MISSIONS.length;
    const r = Object.keys(RUTAS).length;
    const s = new Set(MISSIONS.map(x => x.subject)).size;
    const en = typeof MISIONES_EN !== 'undefined' ? MISIONES_EN.size : 0;
    if (m && r && s) return { misiones: m, rutas: r, materias: s, ingles: en };
  } catch (_) {}
  /* Respaldo por si el catálogo no cargó. Es la foto de agosto de 2026: si el
     maestro ve estos números es que algo falló, pero el texto sigue teniendo
     sentido en vez de quedarse con los marcadores a la vista. */
  return { misiones: 57, rutas: 11, materias: 7, ingles: 8 };
})();
function catTxt(s) {
  return String(s)
    .replace(/\{\{MISIONES\}\}/g, CAT.misiones)
    .replace(/\{\{RUTAS\}\}/g, CAT.rutas)
    .replace(/\{\{MATERIAS\}\}/g, CAT.materias)
    .replace(/\{\{INGLES\}\}/g, CAT.ingles);
}
/* Rellena los marcadores del HTML escrito a mano. Va por nodos de texto para
   no tocar ni una etiqueta ni un atributo. */
function catPintaHTML() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const pend = [];
  while (w.nextNode()) if (w.currentNode.nodeValue.indexOf('{{') >= 0) pend.push(w.currentNode);
  pend.forEach(n => { n.nodeValue = catTxt(n.nodeValue); });
}
/* Y los de los bancos: se recorren una sola vez al arrancar, antes de pintar. */
function catAplica(o) {
  if (Array.isArray(o)) {
    o.forEach((v, i) => { if (typeof v === 'string') o[i] = catTxt(v); else catAplica(v); });
  } else if (o && typeof o === 'object') {
    Object.keys(o).forEach(k => { const v = o[k]; if (typeof v === 'string') o[k] = catTxt(v); else catAplica(v); });
  }
  return o;
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
    txt: 'Es la confusión más cara de todas, y se resuelve mirando quién tiene qué en la mano. En ' +
         'SACE, la <b>matrícula</b>, el registro del alumno, los <b>repitientes</b> y los ' +
         '<b>traslados</b> son módulos del <b>administrador del centro</b>: no aparecen en el perfil ' +
         'del docente, o sea que usted no puede matricular a nadie ni aunque quiera. Su lista de ' +
         '<b>Mi aula</b> es otra cosa: es la lista de trabajo que alimenta asistencia, notas, claves ' +
         'de familia y boleta. Sirve para trabajar, no para inscribir.',
    ofi: 'Matrícula, expediente, repitientes y traslados. Son módulos del administrador del centro, no suyos.',
    metas: 'Su lista de trabajo: asistencia, notas, colectas, claves de familia y Plan de Acción.',
    manda: 'El centro, en el sistema oficial. Si un alumno no está ahí, no está.',
    pasos: [
      'Escriba en Mi aula los nombres <b>tal como están en la matrícula oficial</b>, completos y sin abreviar.',
      'Si llega un alumno de otro centro, el traslado lo hace el centro de origen y <b>el suyo tiene que aceptarlo</b>: pregunte en la dirección si ya quedó aceptado.',
      'Si un alumno repite, avise para que quede registrado <b>como repitiente</b>. El manual advierte que si no, el alumno está en el centro y no aparece en los cuadros de notas del docente.',
      'Al cerrar el año, compare su lista con la del centro: los nombres que no calzan se arreglan ahí.',
    ],
    nohacer: [
      'No dé por inscrito a un alumno porque ya aparece en Mi aula. Son dos cosas distintas.',
      'No use ninguna lista ni pantalla de M.E.T.A.S como constancia de matrícula: la de verdad la extiende el centro.',
      'No escriba el nombre de una manera aquí y de otra allá: la boleta y el recibo salen con el suyo.',
      'No deje pasar semanas con un alumno «prestado» sin registrar: el que pierde el año es él.',
    ],
    aula: 'El alumno que trabajó todo el año y no está en el registro oficial se queda sin nada, por ' +
          'bien que le haya ido con usted. Revisar eso en marzo cuesta cinco minutos; en noviembre, un año.',
  },
  {
    ic: '📚', corto: 'El día que da el tema',
    tit: 'Aquí no hay reparto: la clase es solo suya',
    sub: 'Momento 2 · el contenido y la práctica',
    txt: 'Basta con mirar los <b>nueve módulos</b> que el manual le da al perfil docente: Tablero de ' +
         'Estadísticas, Perfil del Docente, Puestos de Trabajo, Notas, Zona de Descargas, Alumnos, ' +
         'Polimedias, Salud y Voucher. Ninguno da clase, y no es un defecto: es un sistema de ' +
         '<b>administración</b> de centros educativos, y hace bien lo suyo. La clase, el ejercicio y ' +
         'el juego con el que un niño de sexto entiende las fracciones vienen de otro lado. Eso es ' +
         'lo que pone M.E.T.A.S: hoy <b>{{MISIONES}} misiones</b> alineadas al DCNB, y subiendo, porque ' +
         'la meta es cubrir el currículo completo de Básica y de Media. Sin quitarle a usted la clase.',
    ofi: 'Nada en este momento. Sus nueve módulos administran: ninguno trae contenido para el alumno.',
    metas: 'Hoy {{MISIONES}} misiones en {{RUTAS}} rutas y {{MATERIAS}} materias, y creciendo, con juegos, evaluación y ficha imprimible con QR.',
    manda: 'Usted. La plataforma es material; la clase la sostiene el maestro.',
    pasos: [
      'Escoja del catálogo un tema que le toque este mes y recórralo entero antes de llevarlo.',
      'Decida qué parte hace en clase y qué parte deja para práctica.',
      'Imprima la ficha de esa misión para el aula sin dispositivos.',
      'Dicte una vez su código de aula, para que lo que trabajen le llegue a su cuenta.',
    ],
    nohacer: [
      'No ponga la misión y se siente: es un apoyo para atender a quien lo necesita, no un sustituto.',
      'No prometa a la dirección que la plataforma cubre ya el programa completo: hoy son {{MISIONES}} temas, y van entrando más.',
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
         'conoce a ese grupo. En SACE no hay nada de esto: entra la nota ya decidida.',
    ofi: 'Nada en este momento: no genera exámenes ni pautas. Recibe el resultado, no el instrumento.',
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
      'No presente la nota de esta prueba como nota oficial: todavía le falta el momento 4.',
    ],
    aula: 'Aquí es donde se recuperan las horas de verdad. Redactar un examen con su pauta es media ' +
          'tarde; elegir una Forma es un toque.',
  },
  {
    ic: '🔢', corto: 'El día que cierra el parcial',
    tit: 'La nota oficial se sube en un archivo, y lo sube usted',
    sub: 'Momento 4 · el punto donde un maestro puede perder de verdad',
    txt: 'Esta es la parada más importante de la misión, y la que más gente hace mal por no saber ' +
         'cómo funciona. En el módulo <b>Notas</b> del perfil docente no se teclea alumno por ' +
         'alumno: se <b>descarga un archivo</b> con el cuadro de calificaciones de esa clase (por ' +
         'modalidad, curso, sección y jornada), se llena con <b>la nota total de cada alumno y su ' +
         'cantidad de inasistencias del parcial</b>, y se <b>vuelve a subir</b>. Después se ' +
         'comprueba en <b>Ver Cuadro #1</b>. Y ahí está el punto: esas dos columnas, nota total e ' +
         'inasistencias, son exactamente lo que M.E.T.A.S ya tiene calculado por usted. Lo que no ' +
         'hace, ni tiene forma de hacer, es <b>mandarlas allá</b>: eso lo hace el maestro.',
    ofi: 'La nota oficial. Se descarga el cuadro de calificaciones, se llena con nota total e inasistencias por parcial, y se sube.',
    metas: 'El acumulativo que produce esa nota, la boleta, el Plan de Acción y el respaldo de cómo se llegó a ella.',
    manda: 'Usted, dos veces: decide la nota y sube el archivo. El registro no se llena solo.',
    pasos: [
      'Cierre en M.E.T.A.S las evaluaciones del parcial y mire el Plan de Acción antes de decidir.',
      'Decida la nota de cada alumno con su criterio, no con la calculadora sola.',
      'Descargue el cuadro de calificaciones de su clase y llénelo con la nota total y las inasistencias.',
      'Súbalo y <b>compruebe en Ver Cuadro #1</b> que quedó cargado antes de salir.',
      'Imprima la boleta de M.E.T.A.S para la familia y guarde su respaldo.',
    ],
    nohacer: [
      'No suponga que la nota «ya se subió» porque la registró aquí. Nadie la manda: la manda usted.',
      'No suba una nota provisional «para ir adelantando»: el manual avisa que una nota ya ingresada <b>se puede modificar, pero no eliminar ni poner en cero</b>.',
      'No deje la subida para el último día: si ese día no hay señal en el centro, el problema es suyo.',
      'No entregue la boleta antes de haber cerrado la nota oficial, o va a entregar dos veces.',
    ],
    aula: 'La frase que hay que aprenderse: <b>SACE guarda la nota; M.E.T.A.S es donde esa nota se ' +
          'gana, se sustenta y se explica.</b> Se hacen las dos cosas, y en ese orden.',
  },
  {
    ic: '🔍', corto: 'El día que el grupo salió mal',
    tit: 'El sistema le dice quiénes; no le dice por qué',
    sub: 'Momento 5 · entender antes de repetir',
    txt: 'Aquí hay que ser justo con el sistema oficial, porque hace más de lo que la gente cree: su ' +
         '<b>Tablero de Estadísticas</b> muestra el rendimiento del centro y deja descargar el ' +
         '<b>listado de reprobados</b> y el de <b>alumnos en peligro de reprobación</b>. Eso ya es ' +
         'una alerta, y sirve. Lo que no le da es lo otro: <b>por qué contenido</b> fallaron y ' +
         '<b>qué hacer</b> con cada grupo. El <b>Plan de Acción</b> reparte al grado en cinco ' +
         'categorías (Avanzado, Muy Bueno, Satisfactorio, Debe Mejorar, Insatisfactorio) y propone ' +
         'qué hacer con cada una, y la <b>Evidencia de misiones</b> dice quién trabajó y cuánto.',
    ofi: 'El Tablero de Estadísticas: rendimiento del centro, listado de reprobados y de alumnos en peligro.',
    metas: 'Por qué contenido falló cada quien, el grupo repartido en cinco categorías y qué hacer con cada una.',
    manda: 'Usted, que conoce al grupo. Los dos sistemas señalan; decidir es del maestro.',
    pasos: [
      'Mire el listado de alumnos en peligro que le da el sistema oficial: es una alerta gratis.',
      'Abra el Plan de Acción con las notas del parcial ya registradas.',
      'Pregúntese si fallaron por el mismo contenido: si media clase falló lo mismo, el problema fue la clase.',
      'Escriba qué va a hacer distinto, y con quiénes, antes de empezar el parcial siguiente.',
    ],
    nohacer: [
      'No lea el promedio del grado como si fuera un diagnóstico: un 62 puede ser dos grupos muy distintos.',
      'No use el reparto en categorías para etiquetar a un alumno delante de nadie.',
      'No espere a fin de año para mirarlo: en noviembre ya no hay clase que cambiar.',
    ],
    aula: 'Un listado de reprobados le dice a quién perdió. El Plan de Acción le dice a quién todavía ' +
          'puede recuperar, y con qué. Esa es toda la diferencia.',
  },
  {
    ic: '👨‍👩‍👧', corto: 'El día que la familia pregunta',
    tit: 'Hay dos accesos para la casa, y no son el mismo',
    sub: 'Momento 6 · la comunicación con las familias',
    txt: 'Los dos existen, y conviene saber cuál es cuál. El sistema oficial <b>sí</b> tiene acceso ' +
         'para la familia: el administrador del centro lo genera con un <b>usuario y una ' +
         'contraseña</b>, y solo si el alumno tiene <b>matrícula activa</b>. Ahí la familia ve el ' +
         'expediente oficial. La <b>clave de familia</b> de M.E.T.A.S es otra cosa: la genera usted ' +
         'en Mi aula, es anónima, no pide cuenta ni correo, y enseña el día a día (notas de cada ' +
         'evaluación, boleta, faltas, conducta, avisos y colaboraciones) de <b>un solo alumno</b>. ' +
         'No compiten: una es el expediente, la otra es el seguimiento.',
    ofi: 'Acceso al expediente con usuario y contraseña, que genera el administrador del centro si hay matrícula activa.',
    metas: 'La clave de familia, anónima y sin cuenta: notas, boleta, faltas, conducta, avisos y colaboraciones.',
    manda: 'El centro genera el acceso oficial; usted genera y entrega la clave de familia.',
    pasos: [
      'Imprima las tiras de claves desde Mi aula y recórtelas.',
      'Entréguelas en mano y en privado, en la primera reunión. Es una llave, no un volante.',
      'Diga en voz alta qué se va a poder ver, y aclare que <b>no es</b> el acceso al sistema oficial.',
      'Si una familia quiere el acceso oficial, mándela a la dirección: ahí se lo generan.',
    ],
    nohacer: [
      'No reparta claves en un grupo de WhatsApp: una clave publicada deja de ser una clave.',
      'No le diga a una familia que lo que ve en el asistente es su expediente oficial. Es el seguimiento del aula.',
      'No prometa generar usted un acceso al sistema oficial: ese módulo no está en su perfil.',
      'No use el asistente para dar noticias difíciles: eso se habla, y después se registra.',
    ],
    aula: 'El efecto real no es tecnológico: el padre deja de preguntar «¿cómo va mi hijo?» porque ya ' +
          'lo sabe, y llega a la reunión a hablar de qué hacer.',
  },
  {
    ic: '🎓', corto: 'El día que piden un papel',
    tit: 'Constancia no es certificado, y conviene decirlo antes',
    sub: 'Momento 7 · lo que vale ante el sistema',
    txt: 'En el sistema oficial hay un módulo entero para esto: <b>Documentos</b>, con la ' +
         '<b>Constancia de Matrícula</b>, los <b>Cuadros Finales</b> por grado y sección y los ' +
         '<b>Certificados y Boletas</b> por alumno. Los extiende el <b>director del centro</b>. ' +
         'M.E.T.A.S no tiene nada de eso ni lo va a tener: sus constancias <b>reconocen el esfuerzo ' +
         'del alumno, no certifican un grado</b>. Lo mismo con la constancia de estudio de estas ' +
         'misiones del maestro: es para su control, no vale como capacitación oficial ni da puntos ' +
         'de carrera.',
    ofi: 'El módulo Documentos: constancia de matrícula, cuadros finales, certificados y boletas. Los extiende el director.',
    metas: 'Constancias de logro para el alumno y de estudio para usted. Motivan; no certifican.',
    manda: 'El centro y la Secretaría de Educación. Ningún papel de una plataforma sustituye eso.',
    pasos: [
      'Explique la diferencia la primera vez que entregue una constancia, no la tercera.',
      'Si un padre pide un documento con valor, remítalo a la dirección: ahí está el módulo que lo emite.',
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
         'dato oficial va a estar donde tiene que estar, y se comprueba en <b>Ver Cuadro #1</b>. Lo ' +
         'que casi nadie tiene a mano es lo otro: con qué instrumento se evaluó, qué pauta se usó, ' +
         'cuántas veces faltó ese alumno, qué se hizo con los que iban mal, en qué se gastó la ' +
         'colecta. Todo eso lo lleva M.E.T.A.S sin que usted haga nada extra: <b>boleta</b>, ' +
         '<b>Parte Mensual</b>, <b>Evidencia de misiones</b>, <b>economía con recibo</b>. Es la ' +
         'misma lógica del artículo 6 de la Ley Fundamental de Educación, que ya tiene su misión en ' +
         'esta serie: lo que no está en papel, no ocurrió.',
    ofi: 'La nota oficial y el registro del alumno, comprobables en Ver Cuadro #1: el dato que certifica.',
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
  ['¿Qué es SACE?', 'El Sistema de Administración de Centros Educativos, de la Secretaría de Educación de Honduras. Lo administra la Unidad del Sistema Nacional de Información Educativa (USINIEH) y es el registro oficial del Estado.'],
  ['¿M.E.T.A.S sustituye a SACE?', 'No, y no va a hacerlo nunca. SACE guarda la nota; M.E.T.A.S es donde esa nota se gana, se sustenta y se explica.'],
  ['¿Cómo se sube la nota oficial de un parcial?', 'En el módulo Notas se descarga el cuadro de calificaciones de la clase, se llena, se vuelve a subir y se comprueba en «Ver Cuadro #1». No se teclea alumno por alumno.'],
  ['¿Qué pide exactamente ese archivo?', 'La nota total obtenida por cada alumno y su cantidad de inasistencias del parcial. Las dos las tiene ya calculadas M.E.T.A.S.'],
  ['¿Se puede corregir una nota ya subida?', 'Modificarla sí. Eliminarla o ponerla en cero, no. Por eso nunca se sube una nota provisional «para ir adelantando».'],
  ['¿Cuáles son los módulos del perfil docente?', 'Nueve: Tablero de Estadísticas, Perfil del Docente, Puestos de Trabajo, Notas, Zona de Descargas, Alumnos, Polimedias, Salud y Voucher. Ninguno da clase.'],
  ['¿Quién matricula, traslada y registra repitientes?', 'El administrador del centro. Esos módulos no existen en el perfil del docente, así que el maestro no puede hacerlo ni queriendo.'],
  ['¿Y si un alumno repite y no lo registran como repitiente?', 'El manual avisa: el alumno está en el centro pero no aparece en los cuadros de notas del docente. Conviene comprobarlo al inicio del año.'],
  ['¿La familia tiene acceso al sistema oficial?', 'Sí: el administrador del centro se lo genera con usuario y contraseña, y solo si el alumno tiene matrícula activa.'],
  ['¿En qué se diferencia de la clave de familia?', 'La clave la genera el maestro, es anónima, no pide cuenta ni correo y enseña el día a día de un solo alumno. El acceso oficial enseña el expediente.'],
  ['¿De dónde salen los certificados y las boletas oficiales?', 'Del módulo Documentos, y los extiende el director del centro: constancia de matrícula, cuadros finales, certificados y boletas.'],
  ['¿Qué vale la constancia de una misión?', 'Reconoce el esfuerzo del alumno; no certifica un grado. Y la constancia de estudio del maestro no vale como capacitación oficial ni da puntos de carrera.'],
  ['¿Qué le da el Tablero de Estadísticas que M.E.T.A.S no?', 'El listado de reprobados y el de alumnos en peligro de reprobación del centro. Lo que no le da es por qué contenido fallaron ni qué hacer con ellos.'],
  ['Si su pantalla no calza con lo que dice esta misión, ¿qué gana?', 'Su pantalla. Los manuales oficiales que se leyeron son de 2017 y 2019, y el sistema cambia. La línea de soporte del SACE es el 104.'],
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
  ['Módulo Notas', 'Se descarga el cuadro, se llena y se sube'],
  ['Ver Cuadro #1', 'Comprobar que la nota quedó cargada'],
  ['Módulo Documentos', 'Certificados y boletas, del director'],
  ['Clave de familia', 'La genera el maestro, y es anónima'],
  ['Línea 104', 'El soporte del SACE, si algo no calza'],
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
    c: 1, e: 'Lo administra la USINIEH y es el registro oficial del Estado: ahí viven la matrícula, la nota que cuenta legalmente y la certificación.' },
  { q: 'La nota oficial del parcial se sube…',
    o: ['Tecleándola alumno por alumno en una pantalla', 'Sola, porque M.E.T.A.S la envía',
        'Descargando el cuadro de calificaciones, llenándolo y volviéndolo a subir', 'Entregando la boleta impresa en la dirección'],
    c: 2, e: 'Y después se comprueba en «Ver Cuadro #1». M.E.T.A.S le da justo las dos columnas que ese archivo pide: nota total e inasistencias.' },
  { q: 'Una nota que ya subió al sistema oficial…',
    o: ['Se puede modificar, pero no eliminar ni poner en cero', 'Se puede borrar y volver a empezar',
        'Queda bloqueada y no se toca', 'Se corrige llamando a la Dirección Departamental'],
    c: 0, e: 'Por eso no se suben notas provisionales: lo que entra, se queda, aunque se pueda corregir su valor.' },
  { q: 'Un alumno aparece en su lista de Mi aula. Eso quiere decir que…',
    o: ['Ya quedó matriculado', 'Usted lo tiene en su lista de trabajo, nada más',
        'El centro ya lo registró', 'Tiene expediente oficial abierto'],
    c: 1, e: 'La matrícula, los traslados y los repitientes son módulos del administrador del centro: no están en el perfil del docente.' },
  { q: 'El grupo salió con promedio 62. ¿Qué le da cada sistema?',
    o: ['Los dos le dicen lo mismo', 'El oficial le dice quiénes van a reprobar; M.E.T.A.S, por qué contenido y qué hacer',
        'Solo M.E.T.A.S dice algo', 'Solo el oficial dice algo'],
    c: 1, e: 'El Tablero de Estadísticas deja descargar el listado de reprobados y de alumnos en peligro. El Plan de Acción reparte al grupo y propone qué hacer.' },
  { q: 'Sobre el acceso de la familia, lo correcto es que…',
    o: ['Solo existe el de M.E.T.A.S', 'Solo existe el oficial',
        'Existen los dos: el oficial lo genera el centro con usuario y contraseña; la clave de familia la genera usted', 'Ninguno de los dos existe'],
    c: 2, e: 'El oficial pide matrícula activa y lo genera el administrador. La clave de familia es anónima, sin cuenta, y enseña el día a día de un solo alumno.' },
  { q: 'Los certificados y las boletas oficiales salen…',
    o: ['De M.E.T.A.S, al terminar la misión', 'Del cuaderno del maestro',
        'De la Dirección Departamental, a solicitud', 'Del módulo Documentos, y los extiende el director del centro'],
    c: 3, e: 'Ahí están también la constancia de matrícula y los cuadros finales por grado y sección.' },
  { q: 'La constancia que el alumno recibe al terminar una misión…',
    o: ['Certifica el grado aprobado', 'Sustituye el certificado del centro',
        'Vale ante la Dirección Departamental', 'Reconoce su esfuerzo, pero no es un documento oficial'],
    c: 3, e: 'Motiva, y para eso está. La certificación de estudios la emite el centro por la vía oficial.' },
  { q: 'Si la pantalla del sistema no calza con lo que dice esta misión…',
    o: ['Gana su pantalla, y para dudas está la línea 104', 'Gana la misión, que se escribió con los manuales',
        'Hay que reportarlo a la Secretaría de Educación', 'Se deja de usar el sistema hasta que coincida'],
    c: 0, e: 'Los manuales oficiales que se leyeron son de 2017 y 2019: el flujo aguanta, los botones pueden haber cambiado.' },
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
  { t: 'Solo en SACE', it: ['La matrícula oficial', 'El certificado de estudios', 'El listado de reprobados del centro'] },
  { t: 'Solo en M.E.T.A.S', it: ['Misiones con juegos y evaluación', 'El Plan de Acción por contenido', 'La ficha imprimible con QR'] },
  { t: 'En los dos, cada uno a lo suyo', it: ['La nota del parcial', 'La lista de sus alumnos', 'Un acceso para la familia'] },
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
  ['La matrícula, los traslados y los repitientes los maneja el administrador del ____.', ['centro', 'centro educativo']],
  ['Para subir la nota oficial se descarga un ____, se llena y se vuelve a subir.', ['archivo', 'cuadro']],
  ['Ese archivo pide la nota total de cada alumno y su cantidad de ____.', ['inasistencias', 'faltas']],
  ['Una nota ya ingresada se puede modificar, pero no ____.', ['eliminar', 'borrar']],
  ['Que la nota quedó cargada se comprueba en Ver Cuadro #____.', ['1', 'uno']],
  ['SACE guarda la nota; M.E.T.A.S es donde esa nota se ____, se sustenta y se explica.', ['gana']],
  ['La línea de soporte del SACE es el ____.', ['104']],
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
  { t: 'Descarga el cuadro de calificaciones de su clase', o: 4 },
  { t: 'Lo llena con la nota total y las inasistencias', o: 5 },
  { t: 'Lo sube al sistema oficial', o: 6 },
  { t: 'Comprueba en Ver Cuadro #1 que quedó cargado', o: 7 },
  { t: 'Imprime la boleta de M.E.T.A.S para la familia', o: 8 },
  { t: 'Guarda el respaldo: instrumento, pauta y registro', o: 9 },
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
  { b: 0, q: 'La matrícula oficial de un alumno la hace:',
    o: ['Usted, al escribirlo en Mi aula', 'El administrador del centro, en el sistema oficial',
        'La Dirección Departamental', 'El padre de familia, con su acceso'], c: 1 },
  { b: 1, q: 'La nota oficial del parcial se sube:',
    o: ['Tecleándola alumno por alumno', 'Sola, porque M.E.T.A.S la envía',
        'Entregando la boleta en la dirección', 'Descargando el cuadro de calificaciones, llenándolo y subiéndolo'], c: 3 },
  { b: 2, q: 'El acceso de la familia al sistema oficial:',
    o: ['Lo genera usted desde Mi aula', 'No existe',
        'Lo genera el administrador del centro, si el alumno tiene matrícula activa', 'Se pide a la Secretaría de Educación'], c: 2 },
  { b: 3, q: 'Los certificados y las boletas oficiales salen:',
    o: ['Del módulo Documentos, y los extiende el director del centro', 'De M.E.T.A.S, al cerrar el parcial',
        'De la Dirección Departamental', 'Del cuaderno del maestro'], c: 0 },
  { b: 4, q: 'Quién decide la nota final de un alumno:',
    o: ['El promedio automático', 'El maestro, con su criterio escrito',
        'El sistema oficial', 'La plataforma, según los juegos completados'], c: 1 },

  { b: 0, q: 'Un alumno aparece en su lista de Mi aula. Eso significa que:',
    o: ['Ya está matriculado', 'Ya tiene expediente oficial',
        'Lo tiene en su lista de trabajo, nada más', 'El centro ya lo registró'], c: 2 },
  { b: 1, q: 'Ese archivo de notas pide, por cada alumno:',
    o: ['La nota total y la cantidad de inasistencias del parcial', 'Solo la nota',
        'La nota de cada evaluación por separado', 'La nota y la conducta'], c: 0 },
  { b: 2, q: 'La clave de familia de M.E.T.A.S:',
    o: ['Es el acceso al expediente oficial', 'La entrega la dirección del centro',
        'Necesita correo y contraseña', 'La genera el maestro, es anónima y enseña un solo alumno'], c: 3 },
  { b: 3, q: 'La constancia que el alumno recibe al terminar una misión:',
    o: ['Certifica el grado aprobado', 'Reconoce su esfuerzo, pero no certifica un grado',
        'Sustituye el certificado del centro', 'Vale ante la Dirección Departamental'], c: 1 },
  { b: 4, q: 'Explicar el tema en clase y sostener al grupo es trabajo de:',
    o: ['La plataforma', 'El sistema oficial',
        'El maestro, y no lo hace ningún sistema', 'Las fichas imprimibles'], c: 2 },

  { b: 0, q: 'Llega un alumno que viene de otro centro educativo:',
    o: ['El traslado lo hace el centro de origen y el suyo tiene que aceptarlo', 'Basta con anotarlo en Mi aula',
        'Se matricula de nuevo desde cero', 'Lo resuelve el padre de familia con su acceso'], c: 0 },
  { b: 1, q: 'Una nota que ya subió al sistema oficial:',
    o: ['Se puede borrar y volver a empezar', 'Queda bloqueada y no se toca',
        'Se corrige llamando a la Dirección Departamental', 'Se puede modificar, pero no eliminar ni poner en cero'], c: 3 },
  { b: 2, q: 'Las tiras de claves de familia se entregan:',
    o: ['Por el grupo de WhatsApp del grado', 'En mano y en privado, explicando qué se ve con ellas',
        'Pegadas en la pizarra', 'Solo a quien las pida'], c: 1 },
  { b: 3, q: 'Ante un reclamo por una nota, lo que lo respalda es:',
    o: ['Su memoria de cómo trabajó el alumno', 'La palabra del director',
        'El criterio escrito, el instrumento, la pauta y el registro', 'El promedio del grado'], c: 2 },
  { b: 4, q: 'El Plan de Acción reparte al grupo en cinco categorías. Lo que hace usted con eso es:',
    o: ['Archivarlo con la boleta', 'Enviarlo al sistema oficial',
        'Publicarlo en el aula', 'Decidir a quién atiende primero y con qué'], c: 3 },

  { b: 0, q: 'Si un alumno repite y no queda registrado como repitiente:',
    o: ['Está en el centro pero no aparece en los cuadros de notas del docente', 'No pasa nada, se arregla al cierre',
        'El sistema lo detecta solo', 'Lo corrige el maestro desde su perfil'], c: 0 },
  { b: 1, q: 'Después de subir el archivo de notas conviene:',
    o: ['Esperar el correo de confirmación', 'Volver a subirlo por seguridad',
        'Comprobar en Ver Cuadro #1 que quedó cargado', 'Imprimir la boleta de una vez'], c: 2 },
  { b: 2, q: 'Si una familia le pide el acceso al sistema oficial:',
    o: ['Le da su clave de familia', 'La remite a la dirección del centro, que es donde se genera',
        'Le dice que no existe', 'Se lo genera usted desde Mi aula'], c: 1 },
  { b: 3, q: 'Le piden el informe del mes. Lo arma:',
    o: ['El sistema oficial, solo', 'La Dirección Departamental',
        'Nadie: se escribe a mano cada vez', 'El Parte Mensual de M.E.T.A.S, con lo que ya registró'], c: 3 },
  { b: 4, q: 'Si la pantalla del sistema oficial no calza con lo que dice esta misión:',
    o: ['Gana su pantalla, y para dudas está la línea de soporte 104', 'Gana la misión, que se escribió con los manuales',
        'Hay que dejar de usar el sistema', 'Se reporta a la Secretaría de Educación'], c: 0 },
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
  'Compare su lista de Mi aula con la matrícula del centro, nombre por nombre, y pregunte si los repitientes quedaron registrados como tales.',
  'Vuelva al momento 4: la nota se sube en un archivo que usted descarga, llena con la nota total y las inasistencias, y vuelve a subir.',
  'Prepare cómo va a entregar las claves de familia, y aclare que no son el acceso al sistema oficial: ese lo genera la dirección.',
  'Arme su carpeta de respaldo antes de necesitarla: criterio escrito, instrumento, pauta y registro. Los certificados los extiende el centro.',
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
  [PARADAS, FC, MEMO, QZ, CL_GRUPOS, CP, RETO, DG, DIAG_SALIDA].forEach(catAplica);
  catPintaHTML();
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
