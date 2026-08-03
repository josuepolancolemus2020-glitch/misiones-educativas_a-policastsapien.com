/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · Bienvenido: qué es M.E.T.A.S y por qué existe

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   ─────────────────────────────────────────────────────────────
   DE DÓNDE SALEN LAS CIFRAS DE ESTA MISIÓN

   Las cuatro misiones anteriores se escribieron leyendo una ley
   guardada en _dev/leyes/. Esta no tiene ley que leer: sus datos
   salen del propio repositorio, y por eso ENVEJECEN SOLOS. Quien
   la retome no debe confiar en estos números: tiene que volver a
   contarlos. Aquí queda dónde se cuenta cada uno.

     Misiones, rutas y materias ......... NO se escriben a mano:
                                           se cuentan solas de
                                           MISSIONS y RUTAS (ver el
                                           bloque CAT más abajo)
     30 formas por evaluación ........... EVAL_FORMAS en el js de
                                           cada misión (las 57 la
                                           tienen)
     46 con prueba de pensamiento
        crítico ......................... genEvalCrit en el js de
                                           cada misión. NO son las
                                           57: por eso la misión
                                           dice «46 traen además»,
                                           y no «dos por misión»
     57 fichas del alumno ............... fichas/ficha-*.html, sin
                                           las cuatro del maestro,
                                           index ni mapa curricular
     8 misiones en inglés ............... MISIONES_EN en
                                           js/data/misiones.js
     10 herramientas del aula ........... la rejilla zd-grid de
                                           index.html
     5 categorías del Plan de Acción .... PA_CATS en
                                           js/tools/plan-accion.js
     código de aula de 5 letras ......... kit-capacitacion.html,
                                           paso 3
     clave de familia ................... adClaveFamilia en
                                           js/tools/registros-admin.js
                                           y MANUAL-PADRE.md
     lo que ve la familia ............... CHIPS_BASE en padres.html

   Contadas en agosto de 2026. El día que se toque esta misión, se
   cuentan otra vez: un número viejo en la misión de marca es lo
   único que no se puede permitir, porque el maestro lo comprueba
   solo, en la primera semana de uso.

   ─────────────────────────────────────────────────────────────
   LO QUE A PROPÓSITO NO SE PROMETE

   Es material de marca, y por eso lleva más advertencias que las
   otras, no menos. Cada parada del recorrido trae su caja roja de
   lo que esa pieza NO hace, y en particular se dice con todas sus
   letras que M.E.T.A.S no sustituye a SACE y que la constancia de
   estudio no vale como capacitación oficial. Un maestro que se
   entera solo de un límite que nadie le avisó deja de creer también
   lo que sí era cierto, y ese maestro no vuelve.

   ─────────────────────────────────────────────────────────────
   LA SECCIÓN 10 NO ES UN SIMULACRO DE CONCURSO

   La plantilla de la serie manda un simulacro de veinte preguntas
   con el listón del concurso. Aquí no encaja: de esto no pregunta
   ningún concurso de nombramiento. Se mantiene la mecánica entera
   (veinte preguntas, sin pistas hasta calificar, listón en 75) y se
   le cambia el propósito: las preguntas son sobre el USO de la
   plataforma, van repartidas en cinco bloques, y al calificar el
   resultado no dice solo la nota, dice QUÉ PIEZA no ha tocado y por
   dónde empezar. Es la desviación que se acordó con el autor antes
   de escribirla; queda anotada en PROPUESTA-MISIONES-METAS-2026.md.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_BIENVENIDA_V1';

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
   EL RECORRIDO POR LAS PIEZAS
   Las cuatro misiones anteriores se recorrían por fechas, por
   artículos, por trámites y por escenas del aula. Esta se recorre
   por PIEZAS de la plataforma, porque el problema que viene a
   resolver es exactamente ese: el maestro conoce una de cuatro y
   nadie le ha enseñado el mapa.

   Cada parada trae dónde se toca esa pieza, los pasos para
   estrenarla y, aparte, lo que esa pieza NO hace.
══════════════════════════════════════════════════════════════ */
const PARADAS = [
  {
    ic: '🧭', corto: 'Usted conoce una pieza de cuatro',
    tit: 'M.E.T.A.S no son las misiones: son cuatro piezas',
    sub: 'El mapa completo, antes de entrar en cada pieza',
    txt: 'Casi todos los maestros que usan esto llegaron igual: alguien les pasó por WhatsApp el ' +
         'enlace de una misión, la abrieron con su grado, funcionó, y ahí se quedó la cosa. Esa ' +
         'misión es <b>una de {{MISIONES}}</b>, y digo hoy porque el catálogo sigue creciendo: la ' +
         'meta es cubrir el currículo entero de Básica y de Media. Todas juntas son solo la ' +
         '<b>primera de cuatro piezas</b>. ' +
         'Las otras tres (las herramientas de su aula, el asistente de las familias y estas ' +
         'misiones suyas) no se anuncian solas: viven dentro de la <b>Zona Docente</b>, y hay que ' +
         'entrar con su cuenta para verlas. Esta misión existe porque nadie se las ha contado, y ' +
         'porque un maestro que solo conoce la primera pieza está usando la cuarta parte de lo que ' +
         'ya tiene.',
    donde: 'Abra <b>metas.policastsapien.com</b>, entre con su cuenta y vaya a <b>Zona Docente</b>. ' +
           'Arriba aparece <b>Herramientas del aula</b>: un mosaico de diez.',
    pasos: [
      'Entre a la Zona Docente con su cuenta de maestro. Es gratis y se abre en minutos.',
      'Mire el mosaico completo de arriba sin tocar nada todavía: son diez herramientas.',
      'Cuente cuántas de esas diez había abierto alguna vez. Ese número es lo que esta misión viene a subir.',
      'Recorra las paradas de abajo en orden: una pieza por vez, sin apuro.',
    ],
    nohacer: [
      'Esto no es un curso de botones. Si al final solo aprende dónde toca cada cosa, la misión falló.',
      'No sustituye a SACE ni a ningún registro oficial del Estado: eso tiene su propia misión en esta área.',
      'No le pide cambiar su forma de dar clase ni su planificación.',
      'No cuesta nada y no pide datos de tarjeta. Si alguna vez le piden pagar por esto, no es esto.',
    ],
    aula: 'Lo primero que gana no es una herramienta: es dejar de hacer a mano lo que ya se hace ' +
          'solo. Casi todo el tiempo que un maestro pierde con esta plataforma lo pierde por no ' +
          'saber que la pieza existía.',
  },
  {
    ic: '📚', corto: 'Pieza 1: las misiones del alumno',
    tit: 'Hoy {{MISIONES}} misiones, y la lista sigue creciendo',
    sub: 'Lo único que la mayoría de los maestros conoce',
    txt: 'Hoy son <b>{{MISIONES}} misiones</b> repartidas en <b>{{RUTAS}} rutas</b> y ' +
         '<b>{{MATERIAS}} materias</b> (Español, Matemáticas, Ciencias Naturales, Ciencias ' +
         'Sociales, Programación, Robótica e Inglés), escritas para el alumno hondureño y ' +
         'alineadas al DCNB. Ese <b>hoy</b> va a propósito: el catálogo <b>está en construcción y ' +
         'no para</b>. La meta declarada es cubrir el <b>currículo completo de Básica en sus tres ' +
         'ciclos y el de Media</b>, y para eso entran temas nuevos durante todo el año. Cada misión ' +
         'trae su contenido, sus juegos, su constancia, su <b>evaluación imprimible con pauta</b> y ' +
         'su <b>ficha de papel</b> con código QR. Y <b>{{INGLES}} están traducidas al inglés</b> ' +
         'por autor, no por traductor automático.',
    donde: 'El catálogo del alumno se abre en <b>metas.policastsapien.com</b>, sin cuenta y sin ' +
           'clave. Las fichas, en <b>Zona Docente → Fichas didácticas</b>.',
    pasos: [
      'Busque en el catálogo un tema que le toque enseñar este mes.',
      'Ábralo usted primero, entero, como si fuera el alumno: nunca lleve al aula una misión que no recorrió.',
      'Abra su evaluación y elija una Forma: la Forma 7 genera siempre el mismo examen y la misma pauta.',
      'Imprima la ficha de esa misión para los alumnos que no van a tener teléfono en la mano.',
    ],
    nohacer: [
      'Todavía no cubren el programa completo: hoy son {{MISIONES}} temas, no el año entero. Lo que aún no está, lo sigue dando usted.',
      'No sustituyen su clase. La misión practica y evalúa; explicar sigue siendo suyo.',
      'No ponen la nota oficial: el examen sale con pauta, pero quien califica y quien decide es usted.',
      'No todas traen la prueba de pensamiento crítico: hoy la tienen 46, y las demás se van poniendo al día.',
    ],
    aula: 'Lo que se ahorra aquí es redactar exámenes. Cada misión da <b>30 formas</b> de su ' +
          'evaluación, y cada forma sale idéntica cada vez que se pide: imprime hoy y reimprime en ' +
          'un mes sin perder la pauta. Y si su tema todavía no está, vuelva a mirar el mes que ' +
          'viene: la lista de hoy no es la de fin de año.',
  },
  {
    ic: '🧰', corto: 'Pieza 2: las herramientas de su aula',
    tit: 'Diez herramientas, y una sola lista de alumnos',
    sub: 'La pieza que casi nadie abre, y la que más tiempo devuelve',
    txt: 'Dentro de la Zona Docente hay <b>diez herramientas</b>: <b>Mi aula</b> (lista, claves de ' +
         'familia, economía de colectas con recibo, asistencia y notas), <b>Plan de Acción</b>, ' +
         '<b>Evaluaciones</b>, <b>Fichas didácticas</b>, <b>Campeonísimo</b>, <b>Parte Mensual</b>, ' +
         '<b>Collage</b>, <b>Gobierno Escolar</b>, <b>Evidencia de misiones</b> y estas <b>Misiones ' +
         'del maestro</b>. La regla que las une es una sola: <b>la lista de alumnos se escribe una ' +
         'vez</b> y de ahí comen todas. Nunca vuelve a teclear un nombre.',
    donde: '<b>Zona Docente → Herramientas del aula</b>. El mosaico se reordena solo: lo que más ' +
           'usa se le va poniendo delante.',
    pasos: [
      'Entre a Mi aula y escriba su lista una sola vez, con los nombres bien escritos desde el principio.',
      'Deje que genere las claves de familia: salen solas, una por alumno.',
      'Registre la primera nota de un parcial y mire cómo aparece ya en la boleta y en el Plan de Acción.',
      'Abra el Plan de Acción: le reparte el grupo en cinco categorías y le dice qué hacer con cada una.',
    ],
    nohacer: [
      'No envían nada a SACE por su cuenta: la nota oficial la sigue digitando usted allá.',
      'No borre ni reinicie el aula para «probar»: se lleva por delante las claves ya repartidas.',
      'No escriba el nombre a medias ni con abreviaturas: ese nombre va a salir en la boleta y en el recibo.',
      'No es una herramienta de vigilancia del maestro: nadie del centro ve sus datos, salvo que usted los enseñe.',
    ],
    aula: 'El <b>Plan de Acción</b> es lo que cambia la conversación. Deja de ser «el grupo va mal» ' +
          'y pasa a ser «siete alumnos en Debe Mejorar por el mismo contenido». Eso ya se puede ' +
          'atender el lunes, y se puede enseñar en una reunión.',
  },
  {
    ic: '👨‍👩‍👧', corto: 'Pieza 3: el asistente de las familias',
    tit: 'Una clave por alumno, y se acabó el «¿cómo va mi hijo?»',
    sub: 'Sin aplicación, sin cuenta y sin molestarlo a usted',
    txt: 'La familia entra a una página, escribe su <b>clave de familia</b> (el número de lista de ' +
         'su hijo más cuatro caracteres, por ejemplo <b>15-K7QM</b>) y un asistente de chat le ' +
         'cuenta, en lenguaje llano, cómo va: notas de cada evaluación, boleta del parcial, faltas, ' +
         'conducta, avisos del maestro, colaboraciones con su recibo y consejos para apoyar en ' +
         'casa. <b>No necesita cuenta, ni correo, ni instalar nada</b>, y no ve nombres de otros ' +
         'alumnos. Las claves las genera Mi aula y usted las reparte impresas, una tira por ' +
         'estudiante.',
    donde: 'Las claves se sacan en <b>Mi aula</b>. La familia entra en ' +
           '<b>metas.policastsapien.com/padres.html</b>, que usted le pasa por WhatsApp.',
    pasos: [
      'Imprima las tiras de claves desde Mi aula y recórtelas.',
      'Entréguelas en la primera reunión, en mano y en privado: es una llave, no un volante.',
      'Enséñeles la primera consulta ahí mismo, con un teléfono en la mano.',
      'Diga en voz alta qué van a poder ver, para que nadie espere lo que no está.',
    ],
    nohacer: [
      'No es un chat con usted: nadie le va a escribir por ahí, y por eso baja el ruido en vez de subirlo.',
      'No enseña las notas de los demás. Cada clave ve un solo alumno.',
      'No sustituye la reunión de padres ni la conversación difícil: la prepara.',
      'No reparta las claves en un grupo de WhatsApp. Una clave publicada deja de ser una clave.',
    ],
    aula: 'El efecto real no es tecnológico: el padre deja de preguntar «¿cómo va mi hijo?» porque ' +
          'ya lo sabe, y llega a la reunión a hablar de qué hacer. Eso le devuelve la reunión de ' +
          'padres entera.',
  },
  {
    ic: '🎓', corto: 'Pieza 4: sus propias misiones',
    tit: 'La cuarta pieza es esta, la que está usted usando',
    sub: 'Formación del maestro, y solo la ve el maestro',
    txt: 'Las <b>Misiones del maestro</b> son para su actualización, no para su grado: leyes ' +
         'educativas, estrategias de aula, lectura de datos, gestión, familia, tecnología y esta ' +
         'área de <b>Dominar M.E.T.A.S</b>. Están escritas con la misma mecánica que las del alumno ' +
         '(recorrido, tarjetas, juegos, casos) porque se estudian igual: de pie, en el teléfono, ' +
         'entre clase y clase. Cada una trae una <b>ficha de estudio de diez páginas</b> para ' +
         'imprimir, con ejercicios y pauta, y cita sus fuentes.',
    donde: '<b>Zona Docente → Misiones del maestro</b>. El temario se ve completo, con lo que ya se ' +
           'puede abrir y lo que viene marcado «Pronto».',
    pasos: [
      'Mire el temario entero una vez: le dice qué hay hoy y qué está en camino.',
      'Empiece por el área que le urge, no por la primera de la lista.',
      'Imprima la ficha de diez páginas y estúdiela en papel: es la parte que se usa sin batería.',
      'Escriba su nombre en la constancia al terminar, para llevar su propio control.',
    ],
    nohacer: [
      'La constancia NO vale como capacitación oficial ante la Secretaría de Educación ni da puntos de carrera.',
      'No se envía a ningún expediente: se queda en su teléfono y es suya.',
      'Su avance no lo ve el director, ni el centro, ni sus alumnos. Nadie más.',
      'No reemplaza leer la ley: las misiones citan el documento y le dicen dónde bajarlo, gratis.',
    ],
    aula: 'Lo que gana aquí es autoridad. Un maestro que puede citar el artículo, enseñar el dato y ' +
          'presentar el papel no discute de memoria en una reunión: llega con con qué sostenerlo.',
  },
  {
    ic: '🔗', corto: 'Lo que nadie más le da: las flechas',
    tit: 'El dato se escribe una vez y aparece en los cuatro sitios',
    sub: 'El argumento está en las flechas, no en las cajas',
    txt: 'Herramientas sueltas hay muchas. Lo que no se consigue armando piezas de distintos ' +
         'lugares es que <b>hablen entre sí</b>. Aquí el trabajo del alumno viaja con su <b>código ' +
         'de aula</b> (cinco letras que usted dicta una vez) y aterriza en su <b>Evidencia de ' +
         'misiones</b>. La <b>lista</b> que escribió en Mi aula genera las <b>claves de familia</b>. ' +
         'Las <b>notas</b> que registró salen a la vez en la <b>boleta</b>, en el <b>Plan de ' +
         'Acción</b>, en el <b>Parte Mensual</b> y en lo que ve la <b>familia</b>. Y todo eso se ' +
         'sincroniza solo entre su teléfono y su computadora: gana siempre el cambio más reciente, ' +
         'y usted no decide nada.',
    donde: 'El código de aula está en <b>Zona Docente</b>, en la tarjeta con su nombre. La ' +
           'sincronización trabaja sola; hay un botón de <b>Sincronizar ahora</b> por si quiere ' +
           'verla moverse.',
    pasos: [
      'Dicte su código de aula al grado y déjelo escrito en la pizarra la primera semana.',
      'Pida que lo escriban una sola vez en su teléfono: queda guardado y no se vuelve a pedir.',
      'Abra Evidencia de misiones al final de la semana y mire qué trabajó cada quien.',
      'Entre a su cuenta también desde la computadora y compruebe que ve exactamente lo mismo.',
    ],
    nohacer: [
      'No escriba dos listas: una en Mi aula y otra en un cuaderno aparte. La que se parte, se pierde.',
      'No cambie el código de aula a mitad de año sin avisar al grado.',
      'Un nombre mal escrito al inicio se arrastra a la boleta, al recibo y a la clave. Se corrige el primer día.',
      'No dicte el código de aula fuera de su grado: no es un secreto, pero es su aula.',
    ],
    aula: 'Esta es la pieza que no se puede copiar juntando aplicaciones sueltas. No es que cada ' +
          'herramienta sea mejor: es que el dato entra una vez y sale en los cuatro sitios.',
  },
  {
    ic: '🚀', corto: 'Su primera semana, en concreto',
    tit: 'Qué hacer el lunes, y qué dejar para después',
    sub: 'El recorrido guiado, sin adornos',
    txt: 'La forma más segura de abandonar esto es intentar todo la primera semana. El orden que ' +
         'funciona es otro: <b>primero la lista, después una misión, después las familias</b>. Con ' +
         'eso ya tiene evidencia, ya tiene una nota y ya tiene a la casa mirando, que es lo que ' +
         'sostiene el resto. Lo demás (Campeonísimo, Collage, Gobierno Escolar, Parte Mensual) ' +
         'espera sin problema al segundo mes.',
    donde: 'Todo esto cabe en la <b>Zona Docente</b>. Si va a capacitar a colegas, la sesión de ' +
           '<b>60 minutos</b> ya está escrita en el kit de capacitación del proyecto.',
    pasos: [
      'Lunes: entre con su cuenta y escriba su lista de alumnos en Mi aula, bien escrita.',
      'Lunes: dicte su código de aula y déjelo en la pizarra toda la semana.',
      'Martes: abra usted una misión completa antes de llevarla al aula.',
      'Miércoles: pásela con su grado y mire después la Evidencia de misiones.',
      'Jueves: registre la primera nota y abra el Plan de Acción con ella.',
      'Viernes: imprima las tiras de claves de familia y prepare cómo las va a entregar.',
      'La otra semana: la primera reunión con las familias, con la clave en mano.',
    ],
    nohacer: [
      'No abra las diez herramientas el primer día: se olvidan las diez.',
      'No espere a tener buena señal para empezar: la misión trabaja sin ella.',
      'No reparta claves sin explicar qué se ve con ellas. Una clave sin explicación se vuelve un reclamo.',
      'No lo anuncie como «la aplicación de la escuela» ante los padres si el centro no lo decidió así.',
    ],
    aula: 'Al viernes de esa semana ya tiene tres cosas que antes no tenía: quién trabajó y cuánto, ' +
          'una nota con su análisis, y una vía para que la casa lo sepa sin llamarlo a usted.',
  },
];

let _par = 0;
/* La lista va en vertical y la parada se abre DEBAJO de la que se tocó: es el
   molde de la serie, y en el teléfono es la única forma de que se vean las
   siete sin arrastrar. */
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
        <div class="re-donde">📍 <b>Dónde se toca:</b> ${t.donde}</div>
        <ol class="re-pasos">${t.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="re-nohacer"><b>⛔ Lo que esta pieza no hace</b>
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
  ['¿De cuántas piezas se compone M.E.T.A.S?', 'De cuatro: las misiones del alumno, las herramientas de su aula, el asistente de las familias y las misiones del maestro.'],
  ['¿Cuántas misiones tiene el catálogo del alumno?', 'Hoy {{MISIONES}}, en {{RUTAS}} rutas y {{MATERIAS}} materias, alineadas al DCNB. Es la cifra de hoy: la meta es cubrir Básica completa y Media, así que sigue subiendo.'],
  ['¿Qué trae cada misión además del contenido y los juegos?', 'Una evaluación imprimible con pauta y 30 formas (la Forma 7 sale siempre igual), y una ficha didáctica de papel con su código QR para el aula sin dispositivos.'],
  ['¿A qué familia de proyectos pertenece M.E.T.A.S?', 'A la de JClic, del Departament d\'Educació de la Generalitat de Catalunya, y el Proyecto Descartes, de España: material educativo libre hecho por docentes. La diferencia es que esta es hondureña y está pensada con el DCNB.'],
  ['¿Cuántas herramientas hay en la Zona Docente?', 'Diez: Mi aula, Plan de Acción, Evaluaciones, Fichas didácticas, Campeonísimo, Parte Mensual, Collage, Gobierno Escolar, Evidencia de misiones y Misiones del maestro.'],
  ['¿Cuántas veces se escribe la lista de alumnos?', 'Una sola vez, en Mi aula. De ahí comen la asistencia, las notas, la boleta, las colectas, las claves de familia y el Plan de Acción.'],
  ['¿En cuántas categorías reparte el grupo el Plan de Acción?', 'En cinco: Avanzado, Muy Bueno, Satisfactorio, Debe Mejorar e Insatisfactorio.'],
  ['¿Qué necesita el alumno para que su trabajo le llegue al maestro?', 'El código de aula: cinco letras que el maestro dicta una vez. No necesita cuenta ni contraseña.'],
  ['¿Cómo entra la familia al asistente?', 'Con su clave de familia (el número de lista más cuatro caracteres). Sin cuenta, sin correo y sin instalar nada.'],
  ['¿Qué ve la familia con su clave?', 'Las notas, la boleta del parcial, las faltas, la conducta, los avisos del maestro y las colaboraciones de su hijo o hija. De ningún otro alumno.'],
  ['¿Qué pasa si el alumno se queda sin señal a mitad de una misión?', 'Sigue trabajando: la misión ya está en el teléfono, y los resultados se envían solos cuando aparece señal. Para Programación y Robótica basta con cartón, cinta y tijeras: están diseñadas desconectado primero.'],
  ['¿Por qué existe el botón «Actualizar» y cuándo se usa?', 'Porque la plataforma cambia seguido y el teléfono guarda la versión vieja para poder trabajar sin señal. Ese botón trae lo último y lo deja a usted donde estaba. Úselo si un colega le habla de algo que usted no ve.'],
  ['¿M.E.T.A.S sustituye a SACE?', 'No. SACE es el registro oficial del Estado y no tiene sustituto. M.E.T.A.S es el trabajo diario con el que esa nota se gana, se sustenta y se explica.'],
  ['¿De quién es la frase de la portada y qué dice?', 'De José Cecilio del Valle: «América de día cuando escriba. América de noche cuando piense. El estudio más digno de un americano es América.»'],
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
  ['Mi aula', 'La lista que se escribe una sola vez'],
  ['Plan de Acción', 'Reparte el grupo en cinco categorías'],
  ['Evidencia de misiones', 'Qué trabajó cada alumno y cuánto'],
  ['Clave de familia', 'La casa consulta sin cuenta y sin app'],
  ['Código de aula', 'Cinco letras y el avance le llega solo'],
  ['SACE', 'El registro oficial, que no se sustituye'],
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
  { q: 'M.E.T.A.S está formada por…',
    o: ['Un catálogo de misiones y nada más', 'Cuatro piezas que se alimentan entre sí',
        'Dos aplicaciones separadas', 'Una plataforma de la Secretaría de Educación'],
    c: 1, e: 'Misiones del alumno, herramientas del aula, asistente de las familias y misiones del maestro. El argumento está en cómo se pasan el dato.' },
  { q: 'El catálogo del alumno tiene hoy…',
    o: ['{{MISIONES}} misiones en {{RUTAS}} rutas y {{MATERIAS}} materias, y sigue creciendo',
        'Solo Español y Matemáticas', 'Una misión por grado, sin rutas',
        'Un catálogo cerrado que ya no cambia'],
    c: 0, e: 'Cada una con su ficha imprimible y su evaluación con pauta. Y es la cifra de hoy: la meta es cubrir Básica completa y Media.' },
  { q: 'Para que el trabajo del alumno le llegue a usted, el alumno necesita…',
    o: ['Una cuenta con correo y contraseña', 'Pagar una suscripción',
        'Escribir una sola vez el código de aula de cinco letras', 'Estar conectado todo el tiempo'],
    c: 2, e: 'El alumno no tiene cuenta. Cinco letras dictadas una vez y el avance viaja solo.' },
  { q: 'La lista de alumnos se escribe…',
    o: ['Una vez en cada herramienta', 'Cada parcial',
        'Al inicio y al cierre del año', 'Una sola vez, y de ahí comen todas las herramientas'],
    c: 3, e: 'Asistencia, notas, boleta, colectas, claves de familia y Plan de Acción salen de esa misma lista.' },
  { q: 'El Plan de Acción reparte al grupo en…',
    o: ['Aprobados y reprobados', 'Cinco categorías, de Avanzado a Insatisfactorio',
        'Tres niveles de logro', 'Una nota por alumno, sin categorías'],
    c: 1, e: 'Y propone qué hacer con cada categoría. Deja de ser «el grupo va mal» y pasa a ser un grupo concreto de alumnos.' },
  { q: 'Para consultar las notas de su hijo, una madre necesita…',
    o: ['Instalar la aplicación', 'Crear una cuenta con su correo',
        'Su clave de familia y nada más', 'Que el maestro esté conectado en ese momento'],
    c: 2, e: 'Ni cuenta, ni correo, ni instalación. La clave la genera Mi aula y la reparte usted impresa.' },
  { q: 'Sobre SACE, lo correcto es decir que M.E.T.A.S…',
    o: ['Lo reemplaza y ahorra ese trámite', 'Sube las notas a SACE automáticamente',
        'No tiene nada que ver con las notas', 'No lo reemplaza: SACE es el registro oficial y la nota se sigue digitando allá'],
    c: 3, e: 'Un alumno que no está en SACE no existe para el sistema educativo. M.E.T.A.S es el trabajo diario con el que esa nota se gana y se sustenta.' },
  { q: 'La constancia de estudio de una misión del maestro…',
    o: ['Es para su propio control y se queda en su teléfono', 'Vale como capacitación oficial',
        'Da puntos en el concurso de nombramiento', 'Se envía sola a su expediente'],
    c: 0, e: 'No se promete lo que no da. Lo que sí gana es saber el dato y poder enseñar el papel.' },
  { q: 'Si el alumno se queda sin señal a mitad de la misión…',
    o: ['Pierde lo hecho', 'Tiene que empezar de nuevo',
        'Sigue trabajando y los resultados se envían solos cuando aparece señal', 'La misión se cierra'],
    c: 2, e: 'Aunque pasen días. Esto no se diseñó suponiendo que hay internet: se diseñó suponiendo que no lo hay.' },
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
   Las cuatro cajas son las cuatro piezas del ecosistema: si el maestro
   sabe poner cada cosa en su pieza, ya tiene el mapa. */
const CL_GRUPOS = [
  { t: 'Misiones del alumno', it: ['{{RUTAS}} rutas y {{MATERIAS}} materias', 'Evaluación con 30 formas', 'Ficha imprimible con QR'] },
  { t: 'Herramientas de su aula', it: ['Plan de Acción', 'Boleta y Parte Mensual', 'Economía de colectas con recibo'] },
  { t: 'Asistente de las familias', it: ['Clave de familia', 'Sin cuenta y sin aplicación', 'Avisos del maestro a la casa'] },
  { t: 'Misiones del maestro', it: ['Ficha de estudio de diez páginas', 'Solo la ve el maestro registrado', 'Leyes educativas y estrategias'] },
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
    (bien === _clTodas.length ? 'Cada cosa en su pieza. Ya tiene el mapa completo en la cabeza.'
                              : 'Revise las que quedaron fuera de sitio: son piezas que todavía no ubica.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['M.E.T.A.S se compone de ____ piezas que se alimentan entre sí.', ['4', 'cuatro']],
  ['La única cuenta de todo el sistema es la del ____.', ['maestro', 'docente']],
  ['La familia entra al asistente con su clave de ____.', ['familia']],
  ['La evaluación de cada misión tiene ____ formas distintas.', ['30', 'treinta']],
  ['El código de aula que el maestro dicta tiene ____ letras.', ['5', 'cinco']],
  ['El Plan de Acción reparte al grupo en ____ categorías.', ['5', 'cinco']],
  ['La Zona Docente tiene ____ herramientas del aula.', ['10', 'diez']],
  ['El registro oficial del Estado, que M.E.T.A.S no sustituye, es el ____.', ['SACE', 'sace']],
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
   como se debe («SACE», no «sace»). */
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
    (bien === CP.length ? 'Los números los tiene. Son los que le va a preguntar el colega al que le cuente esto.'
                        : 'Vuelva a la parada por la que falló: el número se pega cuando se sabe para qué sirve.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   Aquí se ordena el arranque real de la primera semana. No es un
   ejercicio de memoria: el orden importa, y hacerlo al revés (repartir
   claves antes de tener la lista, por ejemplo) es la forma más común de
   abandonar esto en la segunda semana. */
const RETO = [
  { t: 'Entra a la Zona Docente con su cuenta de maestro', o: 1 },
  { t: 'Escribe su lista de alumnos en Mi aula, una sola vez', o: 2 },
  { t: 'Dicta su código de aula y lo deja en la pizarra', o: 3 },
  { t: 'Abre usted una misión completa antes de llevarla', o: 4 },
  { t: 'Pasa la misión con su grado', o: 5 },
  { t: 'Mira en Evidencia de misiones quién trabajó y cuánto', o: 6 },
  { t: 'Registra la primera nota del parcial', o: 7 },
  { t: 'Abre el Plan de Acción con esa nota', o: 8 },
  { t: 'Imprime las tiras de claves y prepara la reunión', o: 9 },
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
    ? `<span class="resu-num">¡Listo!</span>Puso el arranque en orden con ${_retoSeg} segundos de sobra. Esa es su primera semana, tal cual.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['MISIONES', 'EVIDENCIA', 'HERRAMIENTA', 'FAMILIA', 'VALLE', 'RUTAS', 'CLAVE', 'BOLETA'];
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
   SECCIÓN 10 · «¿YA LE ESTÁ SACANDO TODO?»
   Aquí iría el simulacro de concurso de la plantilla. No va, y la
   razón está arriba, en la cabecera: de esto no pregunta ningún
   concurso de nombramiento, y poner veinte preguntas con la etiqueta
   «simulacro» sobre algo que nadie le va a preguntar sería el primer
   engaño de una misión que se sostiene sobre no exagerar.

   Se conserva la mecánica entera (veinte preguntas, una sola
   correcta, sin retroalimentación hasta calificar, listón en 75) y
   se le cambia el propósito: son preguntas de USO de la plataforma,
   cada una marcada con su BLOQUE, y al calificar el resultado dice
   qué bloque quedó flojo. Ahí es donde tiene que empezar.

   Reparto de correctas: a=4, b=5, c=6, d=5 sobre veinte (ninguna
   pasa del 40 %, normativa 1-ter). Van interleadas por bloque a
   propósito: agrupadas, la tercera pregunta de cada bloque se
   contesta por inercia.
══════════════════════════════════════════════════════════════ */
const DIAG_BLOQUES = [
  'Las misiones del alumno',
  'Las herramientas de su aula',
  'El asistente de las familias',
  'Su propia formación',
  'Sin señal y sin luz',
];
/* b: índice del bloque al que pertenece la pregunta */
const DG = [
  { b: 0, q: 'Un alumno abre una misión con el enlace que usted le pasó. Para que su trabajo le llegue a usted, necesita:',
    o: ['Crear una cuenta con su correo', 'Escribir el código de aula de cinco letras',
        'Pedirle la clave de familia a su madre', 'Nada: llega solo por el enlace'], c: 1 },
  { b: 1, q: '¿Cuántas veces hay que escribir la lista de alumnos para usar asistencia, notas, boleta, colectas y Plan de Acción?',
    o: ['Una vez por cada herramienta', 'Una vez por parcial',
        'Una al inicio y otra al cierre del año', 'Una sola vez'], c: 3 },
  { b: 2, q: 'Para entrar al asistente de padres, la familia necesita:',
    o: ['Una cuenta con correo y contraseña', 'Instalar una aplicación',
        'Su clave de familia y nada más', 'Que usted esté conectado en ese momento'], c: 2 },
  { b: 3, q: 'Las misiones del maestro las puede ver:',
    o: ['Solo el maestro que entró con su cuenta', 'Cualquiera que abra la página',
        'También los alumnos, desde el catálogo', 'Solo el director del centro'], c: 0 },
  { b: 4, q: 'Un alumno abre la misión con señal y se queda sin datos a la mitad:',
    o: ['Pierde lo que llevaba hecho', 'Sigue trabajando: la misión ya está en su teléfono',
        'Tiene que empezar de nuevo cuando vuelva la señal', 'La misión se cierra sola'], c: 1 },

  { b: 0, q: 'El catálogo de misiones del alumno:',
    o: ['Está cerrado: es el que hay y no cambia', 'Solo crece si el maestro lo pide',
        'Está en construcción: la meta es cubrir Básica completa y Media', 'Cambia de temas cada año, quitando los viejos'], c: 2 },
  { b: 1, q: 'El Plan de Acción reparte al grupo en:',
    o: ['Cinco categorías, de Avanzado a Insatisfactorio', 'Aprobados y reprobados',
        'Tres niveles de logro', 'Una nota por alumno, sin categorías'], c: 0 },
  { b: 2, q: 'La clave de familia se arma con:',
    o: ['El nombre completo del alumno', 'El código de aula del maestro',
        'La fecha de nacimiento del alumno', 'El número de lista del alumno más cuatro caracteres'], c: 3 },
  { b: 3, q: 'Además de los juegos, cada misión del maestro trae:',
    o: ['Un certificado con valor de puntaje', 'Un examen que califica la Secretaría de Educación',
        'Una ficha de estudio de diez páginas para imprimir', 'Un curso en video'], c: 2 },
  { b: 4, q: 'Los resultados del alumno que trabajó sin señal:',
    o: ['Se pierden si ese día no hubo internet', 'Se envían solos cuando aparece señal, aunque pasen días',
        'Hay que dictárselos al maestro', 'Solo llegan si vuelve a abrir la misión en menos de una hora'], c: 1 },

  { b: 0, q: 'Imprimió la Forma 7 para su grado y el mes que viene quiere pasar la misma prueba:',
    o: ['Vuelve a elegir la Forma 7 y sale idéntica, con su misma pauta', 'Tiene que haberla guardado: no se regenera',
        'Toca «Nueva evaluación» hasta que salga parecida', 'Le toca escribirla a mano'], c: 0 },
  { b: 1, q: 'Lo que las misiones registraron de su grado (sesiones, secciones y evaluaciones) se ve en:',
    o: ['Campeonísimo', 'Collage',
        'Gobierno Escolar', 'Evidencia de misiones'], c: 3 },
  { b: 2, q: 'Con su clave, una madre puede ver:',
    o: ['Las notas de todo el grado, para comparar', 'Las notas, faltas, avisos y colaboraciones de su hijo o hija',
        'Solo el promedio final del año', 'El expediente completo de la sección'], c: 1 },
  { b: 3, q: 'Los manuales del maestro, del alumno y de la familia están en:',
    o: ['Solo dentro de la aplicación', 'Se piden por correo',
        'El índice de guías de policastsapien.com, para leer, imprimir y repartir', 'No existen todavía'], c: 2 },
  { b: 4, q: 'Para dar clase de Programación y Robótica hace falta:',
    o: ['Un laboratorio con computadoras', 'Un kit de robótica por equipo',
        'Comprar tarjetas programables', 'Cartón, cinta, tijeras y lo que ya tiene: están diseñadas desconectado primero'], c: 3 },

  { b: 0, q: 'Para el aula sin dispositivos, cada misión trae además:',
    o: ['Una ficha didáctica imprimible con su código QR', 'Un video para descargar',
        'Un cuaderno de trabajo que se compra aparte', 'Nada: sin teléfono no se puede'], c: 0 },
  { b: 1, q: 'Su Zona Docente se ve igual en el teléfono y en la computadora porque:',
    o: ['Hay que exportar y volver a importar a mano', 'Solo funciona si usa siempre el mismo aparato',
        'Sus datos se sincronizan solos con su cuenta de maestro', 'Se pasa por WhatsApp'], c: 2 },
  { b: 2, q: 'La familia consultó ayer y hoy se quedó sin datos:',
    o: ['Pierde todo y hay que darle otra clave', 'Tiene que ir a la escuela a preguntar',
        'El asistente deja de abrir', 'Puede releer lo último consultado, avisada de que son datos guardados'], c: 3 },
  { b: 3, q: 'Su avance en una misión del maestro:',
    o: ['Lo ven sus alumnos en el catálogo', 'Es privado: no lo ve nadie más',
        'Lo publica el centro educativo', 'Lo revisa el director'], c: 1 },
  { b: 4, q: 'Para tener M.E.T.A.S como aplicación en el teléfono:',
    o: ['Hay que comprarla en la tienda de aplicaciones', 'No existe: solo funciona dentro del navegador',
        'Se instala desde la propia página, sin tienda y sin pago', 'Hay que pedir autorización a la Secretaría de Educación'], c: 2 },
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
/* Lo que se le dice al maestro cuando un bloque queda flojo. No es un
   regaño: es por dónde empezar el lunes. */
const DIAG_SALIDA = [
  'Abra el catálogo y recorra una misión completa antes de llevarla al aula. Y toque «Actualizar»: el catálogo crece y su teléfono guarda la versión vieja.',
  'Entre a Mi aula, escriba su lista y registre una nota: de ahí sale todo lo demás.',
  'Imprima las tiras de claves y prepare cómo las va a entregar en la próxima reunión.',
  'Vuelva al temario de Misiones del maestro y escoja el área que le urge.',
  'Instale la plataforma como aplicación y pruebe una misión con los datos apagados.',
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
  /* El bloque más flojo primero: es lo que el maestro se lleva de aquí. */
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
      ? `Le está sacando buen provecho: acertó ${bien} de ${DG.length}.`
      : `Todavía hay piezas sin estrenar: acertó ${bien} de ${DG.length}.`) +
    `<div class="diag-bloques">${filas}</div>` +
    (flojo.bien < flojo.total
      ? `<div style="font-weight:600;font-size:14px;margin-top:10px;text-align:left">👉 <b>Por dónde empezar:</b>
           ${DIAG_SALIDA[flojo.i]}</div>`
      : `<div style="font-weight:600;font-size:14px;margin-top:10px">Sin piezas flojas. Cuéntele esto a un colega: es la mejor forma de fijarlo.</div>`);
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
  ['🧭 Recorrió las piezas', () => S.paradas.length === PARADAS.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó el arranque', () => !!S.reto],
  ['🔤 Sopa terminada', () => !!S.sopa],
  ['🚀 Pasó el diagnóstico', () => !!S.diag],
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
      (S.diagNota ? ` Mejor nota en el diagnóstico de uso: <b>${S.diagNota}/100</b>.` : '')
    : 'Escriba su nombre arriba.';
}

/* ══════════════════ NAVEGACIÓN ══════════════════ */
const SECS = [
  ['sec-recorrido', '🧭 Recorrido'],
  ['sec-aprende', '💡 Aprende'],
  ['sec-tarjetas', '🃏 Tarjetas'],
  ['sec-quiz', '❓ Quiz'],
  ['sec-clasifica', '🗂️ Piezas'],
  ['sec-completa', '✍️ Completa'],
  ['sec-reto', '⏱️ Reto'],
  ['sec-sopa', '🔤 Sopa'],
  ['sec-casos', '🏫 Casos'],
  ['sec-diagnostico', '🚀 ¿Le saca todo?'],
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
  if (!confirm('¿Empezar esta misión de nuevo?\n\nSe borra su avance en ella (XP, logros y el diagnóstico de uso). Los datos de su aula no se tocan.')) return;
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
