/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · Leer una expectativa de logro sin marearse

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   Es la segunda del área «El DCNB en su aula». La primera
   (docente-cnb-dcnb-programacion) explica quién manda sobre qué;
   esta baja al detalle de la fila que el maestro tiene delante.

   ─────────────────────────────────────────────────────────────
   FUENTES: LEÍDAS EN EL PDF, NO EN EL MARKDOWN

   Los ejemplos son filas REALES del DCNB de Educación Básica, que
   está en el repositorio:

     _dev/dcnb-pdf/dcneb-basica-i-ciclo.pdf   (Ciencias Naturales, 1º)
     _dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf  (Matemáticas 5º, pág. 391
                                               del documento; Español 6º)

   ⚠️ ESTA MISIÓN SE ESCRIBIÓ MIRANDO LA PÁGINA RENDERIZADA, y hay
   una razón concreta: la extracción automática de texto devuelve los
   tres encabezados de la tabla en un orden que NO es el visual. Por
   fiarse de esa extracción, la misión anterior salió publicada
   diciendo que «Procesos y Actividades Sugeridas» era la columna del
   medio. Es la tercera. Se corrigió en las dos.

   El orden impreso, comprobado en la página del PDF, es:

     1) EXPECTATIVAS DE LOGRO
     2) CONTENIDOS CONCEPTUALES (■) Y ACTITUDINALES (●)
     3) PROCESOS Y ACTIVIDADES SUGERIDAS

   Regla para quien siga: la maquetación de un documento (columnas,
   símbolos, viñetas) se verifica RENDERIZANDO la página, nunca con
   el texto extraído. El Markdown de _dev/dcnb/ sirve para buscar y
   para citar frases, no para describir cómo se ve una tabla.

   Las frecuencias de verbos («Identifican» es el más repetido) se
   contaron sobre el texto de los tres volúmenes de Básica: ahí el
   Markdown sí sirve, porque es conteo de palabras, no maquetación.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_EXPECTATIVA_V1';

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
   OCHO CORTES A UNA MISMA FILA
   La misión anterior recorría la escalera del sistema. Esta se
   recorre desarmando UNA FILA REAL del DCNB, pieza por pieza,
   porque el maestro no se marea con el currículo entero: se marea
   con la fila que tiene delante cuando va a planificar.

   Los ejemplos NO son inventados. Salen del DCNB de Educación
   Básica que está en el repositorio, y se citan tal cual:

     Ciencias Naturales, Primer Grado, bloque «Los seres vivos en su
     ambiente» (dcneb-basica-i-ciclo.pdf)
     Matemáticas, Quinto Grado, Bloque 1 «Números y Operaciones»
     (dcneb-basica-ii-ciclo.pdf, página 391 del documento)
     Comunicación / Español, Sexto Grado, Bloque 1 «Lengua Oral»
     (dcneb-basica-ii-ciclo.pdf)

   ⚠️ EL ORDEN DE LAS COLUMNAS SE VERIFICÓ EN EL PDF, NO EN EL
   TEXTO EXTRAÍDO. La extracción automática devuelve los tres
   encabezados en un orden que NO es el visual, y por eso la primera
   versión de la misión anterior dijo que «Procesos y Actividades
   Sugeridas» era la columna del medio. Es la tercera. El orden real,
   mirando la página impresa, es:

     1) EXPECTATIVAS DE LOGRO
     2) CONTENIDOS CONCEPTUALES (■) Y ACTITUDINALES (●)
     3) PROCESOS Y ACTIVIDADES SUGERIDAS

   Quien toque esta misión: para cualquier cosa de maquetación de la
   tabla, se mira el PDF renderizado, no el Markdown de _dev/dcnb/.
══════════════════════════════════════════════════════════════ */
const PELDANOS = [
  {
    ic: '🔎', corto: 'Empiece por el verbo',
    tit: 'El verbo es lo que se evalúa',
    sub: 'Lo primero que se busca en cualquier expectativa',
    txt: 'Una expectativa de logro se lee como se lee una receta: primero el verbo. El verbo dice ' +
         'qué tiene que <b>hacer</b> el alumno, y por lo tanto qué va a tener que hacer el día de la ' +
         'evaluación. No es un detalle de redacción: <b>«identifican» no se evalúa igual que ' +
         '«analizan»</b>. El DCNB no usa los verbos al azar y tampoco usa muchos. Contando los del ' +
         'currículo de Básica, los más repetidos son <b>Identifican</b>, <b>Analizan</b>, ' +
         '<b>Reconocen</b>, <b>Elaboran</b>, <b>Describen</b> y <b>Aplican</b>. Si aprende a leer ' +
         'seis verbos, ya lee casi todo el documento.',
    cita: 'Clasifican los elementos ambientales en seres no vivos y seres vivos, y éstos en los dos ' +
          'tipos más evidentes, plantas y animales, con énfasis en el componente diversidad.',
    pasos: [
      'Subraye el verbo antes de leer el resto de la fila. Va siempre al principio y en plural.',
      'Pregúntese: ¿qué tendría que ver yo para dar por logrado ese verbo?',
      '«Identifican» y «Reconocen» se comprueban señalando o nombrando.',
      '«Clasifican» y «Comparan» piden agrupar o poner en frente uno de otro: no basta con nombrar.',
      '«Analizan», «Explican» y «Elaboran» piden producir algo: una razón, un texto, un objeto.',
    ],
    nohacer: [
      'No cambie el verbo al pasarlo a su plan: si la expectativa dice «analizan», poner «conocen» le baja el nivel a la clase entera.',
      'No evalúe con un verbo distinto del que planificó: ahí es donde el alumno reprueba algo que sí sabía.',
      'No suponga que todos los verbos piden escribir: varios se comprueban viendo hacer.',
    ],
    aula: 'La prueba más rápida de que una expectativa está bien entendida: si usted puede decir en ' +
          'una frase qué va a ver al alumno haciendo, la entendió. Si no, vuelva al verbo.',
  },
  {
    ic: '🎯', corto: 'Después, sobre qué exactamente',
    tit: 'El objeto es más estrecho de lo que parece',
    sub: 'La segunda parte de la expectativa',
    txt: 'Detrás del verbo viene el <b>objeto</b>: sobre qué se ejerce. Aquí es donde se pierden las ' +
         'clases que «tocaron el tema» pero no dieron el contenido. En el ejemplo de Primer Grado el ' +
         'objeto no es «la naturaleza» ni «el medio ambiente»: son <b>los elementos ambientales</b>. ' +
         'Y en el de Quinto no es «las potencias» en general: es <b>la potencia de un número como ' +
         'abreviación de un producto de factores iguales</b>, que es una idea concreta y comprobable. ' +
         'El DCNB escribe el objeto con más precisión de la que se suele leer, y esa precisión es la ' +
         'que evita dar de más o de menos.',
    cita: 'Reconocen la potencia de un número como abreviación de un producto de factores iguales.',
    pasos: [
      'Lea el objeto completo, incluida la aclaración que viene después de «como» o «en».',
      'Escríbalo en su plan tal cual, sin resumirlo a una palabra.',
      'Compruebe que su actividad trabaja ESE objeto y no uno parecido.',
    ],
    nohacer: [
      'No sustituya el objeto por el nombre del tema del libro: casi nunca dicen lo mismo.',
      'No amplíe el objeto por su cuenta «ya que estamos»: lo que sobra le quita horas a lo que falta.',
    ],
    aula: 'Cuando una clase sale bien pero el examen sale mal, el problema suele estar aquí: se ' +
          'trabajó un objeto vecino, no el que pedía la expectativa.',
  },
  {
    ic: '📏', corto: 'El techo: hasta dónde llega',
    tit: 'El DCNB dice hasta dónde, y casi nadie lo lee',
    sub: 'La condición o alcance de la expectativa',
    txt: 'Esta es la parte que más tranquilidad da cuando se descubre. Muchas expectativas traen un ' +
         '<b>límite explícito</b>, y ese límite lo protege a usted de exigir de más y al alumno de ' +
         'que le pidan lo que todavía no le toca. En Primer Grado no se pide clasificar toda la ' +
         'diversidad: se pide clasificar en <b>los dos tipos más evidentes, plantas y animales</b>. ' +
         'En Quinto no se pide la raíz cuadrada de cualquier número: se pide la de <b>números ' +
         'cuadrados pequeños</b>. Cuando el límite está escrito, es parte de la norma: dárselo más ' +
         'difícil no es exigencia, es salirse del currículo.',
    cita: 'Reconoce la raíz cuadrada de números cuadrados pequeños.',
    pasos: [
      'Busque las palabras que acotan: «más evidentes», «pequeños», «sencillos», «de la vida real», «hasta».',
      'Ese límite es el techo de su evaluación: no ponga en el examen lo que queda por encima.',
      'Si un alumno llega más lejos, celébrelo, pero no lo convierta en el mínimo del grupo.',
      'Si la expectativa NO trae límite, el techo lo pone el contenido de la segunda columna.',
    ],
    nohacer: [
      'No suba el nivel «porque el grupo puede»: la expectativa está calibrada con lo que viene el año siguiente.',
      'No evalúe fuera del techo escrito: es la queja más justa que puede recibir de una familia.',
    ],
    aula: 'Leer el techo le ahorra la mitad de las discusiones sobre si un examen estuvo muy difícil: ' +
          'la respuesta está escrita en la fila.',
  },
  {
    ic: '🧭', corto: 'El énfasis: el componente',
    tit: 'La coletilla que dice desde dónde mirar el tema',
    sub: 'Ciencias Naturales lo marca con todas sus letras',
    txt: 'Algunas áreas cierran la expectativa con una fórmula fija: <b>«con énfasis en el componente ' +
         '…»</b>. No es relleno. Dice desde qué mirada hay que trabajar el contenido, y por lo tanto ' +
         'qué debe quedar subrayado al final de la clase. En el currículo de Ciencias Naturales de ' +
         'Básica aparecen, entre otros, los componentes <b>ambiente</b>, <b>salud</b>, ' +
         '<b>diversidad</b>, <b>sostenibilidad</b> e <b>interrelación</b>. La misma planta se estudia ' +
         'distinto si el énfasis es diversidad (cuántas clases hay) que si es ambiente (de qué ' +
         'depende para vivir).',
    cita: 'Identifican las necesidades básicas de los seres humanos y la forma en que son ' +
          'satisfechas utilizando los recursos naturales, relacionando este proceso con ciertos ' +
          'cambios visibles en el paisaje, con énfasis en el componente ambiente.',
    pasos: [
      'Lea la coletilla del final antes de escoger la actividad: cambia la actividad, no solo el discurso.',
      'Anote el componente en su plan, al lado de la expectativa.',
      'Al cerrar la clase, la idea que se lleva el alumno debería ser la del componente.',
    ],
    nohacer: [
      'No la trate como una frase de adorno: es lo que distingue dos clases sobre el mismo tema.',
      'No mezcle dos componentes en la misma expectativa: cada fila trae el suyo.',
    ],
    aula: 'Si dos maestros dan «las plantas» y a uno le sale una clase de nombres y al otro una de ' +
          'cuidado del entorno, casi siempre es que uno leyó el componente y el otro no.',
  },
  {
    ic: '📊', corto: 'Las tres columnas, en su orden',
    tit: 'Expectativas, después Contenidos, y al final Procesos',
    sub: 'Tal como está impreso en el DCNB',
    txt: 'Abra el DCNB en cualquier grado y la tabla es siempre la misma, con las columnas en este ' +
         'orden de izquierda a derecha: <b>Expectativas de Logro</b>, luego <b>Contenidos ' +
         'Conceptuales (■) y Actitudinales (●)</b>, y al final <b>Procesos y Actividades ' +
         'Sugeridas</b>. Conviene decirlo con precisión porque el orden se confunde fácil: la ' +
         'primera dice <b>a dónde llegar</b>, la segunda <b>con qué</b>, y la tercera <b>cómo</b>. ' +
         'Las tres son una sola idea partida en tres, y por eso la fila se lee entera antes de ' +
         'escribir nada.',
    cita: 'EXPECTATIVAS DE LOGRO · CONTENIDOS CONCEPTUALES (■) Y ACTITUDINALES (●) · PROCESOS Y ' +
          'ACTIVIDADES SUGERIDAS',
    pasos: [
      'Lea la fila de izquierda a derecha, completa, antes de decidir la clase.',
      'De la primera columna sale el objetivo de su plan, copiado tal cual.',
      'De la segunda, la lista de contenidos que va a trabajar.',
      'De la tercera, la actividad, que ya está pensada.',
    ],
    nohacer: [
      'No planifique solo con la columna de contenidos: da la lista de temas y le quita el para qué.',
      'No convierta la expectativa en el título de la clase: la expectativa es el logro, no el tema.',
      'No dé por hecho el orden de memoria: si va a citarlo, mírelo en el documento impreso.',
    ],
    aula: 'La fila completa es su plan de clase a medio escribir. El que la lee entera se ahorra la ' +
          'tarde del domingo; el que lee una sola columna la repite todas las semanas.',
  },
  {
    ic: '🔲', corto: 'Los dos símbolos de la segunda columna',
    tit: 'El cuadrito y el círculo no son viñetas de adorno',
    sub: 'Contenidos conceptuales y actitudinales',
    txt: 'La segunda columna trae dos clases de contenido y los distingue con <b>dos símbolos ' +
         'distintos</b>, explicados en su propio encabezado: el <b>cuadrito (■)</b> marca los ' +
         '<b>contenidos conceptuales</b> y el <b>círculo (●)</b> marca los <b>actitudinales</b>. ' +
         'Saber cuál está trabajando cambia por completo cómo se evalúa: un contenido conceptual se ' +
         'comprueba con una pregunta, y uno actitudinal solo se comprueba <b>observando a lo largo ' +
         'del tiempo</b>. Ahí está la razón de que un alumno «se sepa la teoría» y no logre la ' +
         'expectativa: la expectativa pedía las dos cosas y la evaluación midió una.',
    cita: 'CONTENIDOS CONCEPTUALES (■) Y ACTITUDINALES (●)',
    pasos: [
      'Mire el símbolo antes de escribir el instrumento de evaluación.',
      'Los conceptuales van a prueba escrita, pregunta oral o explicación con sus palabras.',
      'Los actitudinales van a observación sostenida, registro anecdótico o autoevaluación.',
      'Si la fila trae de los dos, su evaluación necesita dos instrumentos, no uno.',
    ],
    nohacer: [
      'No evalúe una actitud con una pregunta de examen: no se puede, y el número que salga no significa nada.',
      'No deje los actitudinales sin evaluar porque «no se pueden medir»: se observan, que es distinto.',
    ],
    aula: 'La regla corta: cuadrito, se pregunta; círculo, se observa. Y si hay de los dos en la ' +
          'misma fila, hay que hacer las dos cosas.',
  },
  {
    ic: '🛠️', corto: 'La tercera columna ya trae la clase',
    tit: 'Procesos y Actividades Sugeridas: el trabajo hecho',
    sub: 'La columna que casi nadie usa',
    txt: 'Es la columna más generosa del documento y la más desaprovechada. Trae <b>las actividades ' +
         'ya pensadas</b> para llegar a esa expectativa, y en varias áreas incluso con el ejemplo ' +
         'numérico resuelto. En el bloque de Quinto Grado sobre divisibilidad, por ejemplo, la ' +
         'tercera columna no dice «trabajar múltiplos»: dice <b>calcular y comparar múltiplos de dos ' +
         'números</b> y pone la lista de los múltiplos de 4 y de 6 para que se vea el común. Eso es ' +
         'una actividad de clase escrita por el currículo, gratis, y esperando a que alguien la lea.',
    cita: 'Calculan y comparan múltiplos de dos números. Ejemplo: Múltiplos de 4: 4, 8, 12, 16, 20, ' +
          '24… Múltiplos de 6: 6, 12, 18, 24… Reconocen que dos números tienen múltiplos en común.',
    pasos: [
      'Antes de inventar una actividad, lea la tercera columna: casi siempre ya está.',
      'Adáptela a lo que tiene en el aula, pero conserve lo que la actividad hace pensar al alumno.',
      'Si la columna trae un ejemplo resuelto, úselo en la pizarra: viene calibrado para el grado.',
    ],
    nohacer: [
      'No la lea como si fuera obligatoria al pie de la letra: dice «sugeridas», y su contexto manda.',
      'No la ignore por completo: es la única parte del documento que le devuelve tiempo.',
    ],
    aula: 'Si de esta misión se lleva una sola cosa, que sea abrir la tercera columna antes de ' +
          'planificar. Es media hora de trabajo que ya está hecha.',
  },
  {
    ic: '⚠️', corto: 'Dos listas que se confunden',
    tit: 'La expectativa del grado y la expectativa de la fila',
    sub: 'Por qué a veces parecen no coincidir',
    txt: 'El DCNB trae las expectativas de logro <b>en dos lugares</b>, y ahí se marea mucha gente. ' +
         'Al empezar cada área hay una lista general que arranca con <b>«Al finalizar el Primer ' +
         'Grado de la Educación Básica, los alumnos y las alumnas…»</b>: son las expectativas ' +
         '<b>del grado completo</b>, redactadas en grande y agrupadas por bloque. Después, dentro de ' +
         'cada bloque, la tabla trae las expectativas <b>de esa fila</b>, más chicas y pegadas a su ' +
         'contenido. No se contradicen: las de la tabla son los pedazos con que se cumple la del ' +
         'grado. Para planificar una clase manda la de la tabla; para ver si el año va completo, la ' +
         'del grado.',
    cita: 'Al finalizar el Primer Grado de la Educación Básica, los alumnos y las alumnas: ' +
          'Clasifican los elementos ambientales en seres no vivos y seres vivos…',
    pasos: [
      'Al empezar el año, lea la lista del grado entera: es el mapa de a dónde tiene que llegar.',
      'Al planificar cada clase, use la de la tabla del bloque.',
      'Al cerrar cada parcial, vuelva a la lista del grado y marque lo que ya quedó cubierto.',
      'Lo que no quedó marcado en octubre es lo que hay que reordenar el año siguiente.',
    ],
    nohacer: [
      'No estudie solo la lista del grado: no dice con qué contenidos ni con qué actividades.',
      'No planifique solo con la tabla: se puede llegar a fin de año con bloques dados y expectativas del grado sin cumplir.',
    ],
    aula: 'Las dos listas juntas son su control del año: la del grado le dice si va completo, la de ' +
          'la tabla le dice qué hacer el lunes.',
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
  ['¿Qué es lo primero que se busca al leer una expectativa de logro?', 'El verbo. Dice qué tiene que hacer el alumno y, por lo tanto, qué se va a evaluar.'],
  ['¿Cuáles son los verbos más repetidos en el DCNB de Básica?', 'Identifican, Analizan, Reconocen, Elaboran, Describen y Aplican. Con seis verbos se lee casi todo el documento.'],
  ['¿Qué diferencia hay entre «identifican» y «analizan» al evaluar?', 'Identificar se comprueba señalando o nombrando; analizar exige producir una razón. No se evalúan con el mismo instrumento.'],
  ['¿Qué es el objeto de una expectativa?', 'Aquello sobre lo que se ejerce el verbo. Se copia completo: «los elementos ambientales», no «la naturaleza».'],
  ['¿Qué es el techo o alcance de una expectativa?', 'El límite explícito que trae escrito: «los dos tipos más evidentes», «números cuadrados pequeños». Marca hasta dónde se puede evaluar.'],
  ['¿Qué significa «con énfasis en el componente…»?', 'Dice desde qué mirada hay que trabajar el contenido. En Ciencias Naturales aparecen ambiente, salud, diversidad, sostenibilidad e interrelación.'],
  ['¿En qué orden van las tres columnas de la tabla del DCNB?', 'Expectativas de Logro, luego Contenidos Conceptuales (■) y Actitudinales (●), y por último Procesos y Actividades Sugeridas.'],
  ['¿Qué dice cada columna?', 'La primera, a dónde llegar. La segunda, con qué. La tercera, cómo.'],
  ['¿Qué marca el cuadrito (■) en la segunda columna?', 'Los contenidos conceptuales. Se evalúan con pregunta, explicación o prueba escrita.'],
  ['¿Qué marca el círculo (●) en la segunda columna?', 'Los contenidos actitudinales. Solo se comprueban observando a lo largo del tiempo.'],
  ['¿Qué trae la tercera columna?', 'Los Procesos y Actividades Sugeridas: la actividad ya pensada, a veces con el ejemplo resuelto.'],
  ['¿Es obligatorio hacer lo que dice la tercera columna?', 'No: dice «sugeridas». Pero ignorarla es tirar el único trabajo que el documento ya hizo por usted.'],
  ['¿Dónde aparecen las expectativas de logro, además de en la tabla?', 'En una lista general al inicio de cada área: «Al finalizar el Primer Grado de la Educación Básica, los alumnos y las alumnas…». Son las del grado completo.'],
  ['¿Cuál de las dos listas se usa para planificar una clase?', 'La de la tabla del bloque. La del grado sirve para revisar, al cerrar cada parcial, si el año va completo.'],
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
  ['El verbo', 'Dice qué se va a evaluar'],
  ['El objeto', 'Dice sobre qué exactamente'],
  ['El techo', 'Dice hasta dónde se puede exigir'],
  ['El componente', 'Dice desde qué mirada se trabaja'],
  ['Cuadrito (■)', 'Contenido conceptual: se pregunta'],
  ['Círculo (●)', 'Contenido actitudinal: se observa'],
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
  { q: 'Al leer una expectativa de logro, lo primero que conviene subrayar es…',
    o: ['El verbo', 'El nombre del bloque', 'El grado', 'El área'],
    c: 0, e: 'El verbo dice qué tendrá que hacer el alumno, y por lo tanto qué instrumento de evaluación hace falta.' },
  { q: 'En la tabla del DCNB, la columna del medio es…',
    o: ['Procesos y Actividades Sugeridas', 'Contenidos Conceptuales y Actitudinales',
        'Expectativas de Logro', 'La de evaluación'],
    c: 1, e: 'El orden impreso es: Expectativas, Contenidos (■ y ●), y al final Procesos y Actividades Sugeridas.' },
  { q: 'El símbolo ■ en la segunda columna marca contenidos…',
    o: ['Actitudinales', 'Procedimentales', 'Conceptuales', 'Transversales'],
    c: 2, e: 'El cuadrito es conceptual y el círculo (●) es actitudinal. Está explicado en el propio encabezado de la columna.' },
  { q: 'Un contenido actitudinal se evalúa…',
    o: ['Con una pregunta de examen', 'Con una prueba de opción múltiple',
        'No se evalúa', 'Observando a lo largo del tiempo'],
    c: 3, e: 'Por eso una fila con contenidos de los dos tipos necesita dos instrumentos, no uno.' },
  { q: 'Cuando una expectativa dice «raíz cuadrada de números cuadrados pequeños», esa última parte es…',
    o: ['Una sugerencia de redacción', 'El techo: marca hasta dónde se puede evaluar',
        'Un ejemplo opcional', 'El nombre del contenido'],
    c: 1, e: 'El límite escrito es parte de la norma: evaluar por encima de él es salirse del currículo.' },
  { q: 'La fórmula «con énfasis en el componente ambiente» indica…',
    o: ['Desde qué mirada hay que trabajar el contenido', 'Que el tema es opcional',
        'El nombre del bloque', 'La materia a la que pertenece'],
    c: 0, e: 'Cambia la actividad, no solo el discurso: la misma planta se estudia distinto según el componente.' },
  { q: 'La tercera columna del DCNB, «Procesos y Actividades Sugeridas»…',
    o: ['Es de uso obligatorio al pie de la letra', 'Trae la actividad ya pensada, a veces con el ejemplo resuelto',
        'Solo trae el listado de temas', 'Es la que dice a dónde llegar'],
    c: 1, e: 'Dice «sugeridas», así que su contexto manda, pero es la única parte del documento que le devuelve tiempo.' },
  { q: 'Una lista que empieza «Al finalizar el Primer Grado de la Educación Básica, los alumnos y las alumnas…» corresponde a…',
    o: ['Las expectativas de una fila de la tabla', 'Los estándares del país',
        'Las expectativas de logro del grado completo', 'Los ejes transversales'],
    c: 2, e: 'Son las del grado, agrupadas por bloque. Las de la tabla son los pedazos con que se cumplen.' },
  { q: 'Si al pasar la expectativa a su plan usted cambia «analizan» por «conocen», lo que ocurre es que…',
    o: ['No pasa nada, son sinónimos', 'Sube el nivel de exigencia',
        'Le baja el nivel a la clase y a la evaluación', 'Se cumple igual la expectativa'],
    c: 2, e: 'El verbo es lo que se evalúa. Cambiarlo cambia el logro, aunque el tema siga siendo el mismo.' },
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
  { t: 'Partes de la expectativa', it: ['El verbo', 'El objeto', 'El techo o alcance'] },
  { t: 'Primera columna', it: ['A dónde tiene que llegar', 'Se copia completa en el plan', 'Es lo que se evalúa'] },
  { t: 'Segunda columna', it: ['Cuadrito: conceptual', 'Círculo: actitudinal', 'La lista de contenidos'] },
  { t: 'Tercera columna', it: ['La actividad ya pensada', 'A veces con el ejemplo resuelto', 'Dice «sugeridas»'] },
];

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['Lo primero que se subraya en una expectativa es el ____.', ['verbo']],
  ['El verbo más repetido en el DCNB de Básica es ____.', ['identifican', 'identificar']],
  ['La columna del medio de la tabla es la de ____.', ['contenidos', 'contenido']],
  ['La tercera columna se llama Procesos y Actividades ____.', ['sugeridas']],
  ['El símbolo que marca los contenidos conceptuales es el ____.', ['cuadrito', 'cuadro', 'cuadrado']],
  ['Los contenidos actitudinales no se preguntan: se ____.', ['observan', 'observa']],
  ['La coletilla «con énfasis en el ____» dice desde qué mirada se trabaja.', ['componente']],
  ['La lista que empieza «Al finalizar el Primer Grado» son las expectativas del ____.', ['grado']],
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
   Aquí se ordena la lectura de UNA fila, que es lo que el maestro
   hace de verdad cuando se sienta a planificar. */
const RETO = [
  { t: 'Ubica el área, el grado y el bloque de la fila', o: 1 },
  { t: 'Subraya el verbo de la expectativa', o: 2 },
  { t: 'Lee el objeto completo, sin resumirlo', o: 3 },
  { t: 'Busca el techo: hasta dónde se puede exigir', o: 4 },
  { t: 'Anota el componente del énfasis, si la fila lo trae', o: 5 },
  { t: 'Pasa a la segunda columna y mira si es ■ o ●', o: 6 },
  { t: 'Toma la actividad de la tercera columna', o: 7 },
  { t: 'Escribe el plan con la expectativa copiada tal cual', o: 8 },
  { t: 'Escoge el instrumento que corresponde al verbo y al símbolo', o: 9 },
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
const SOPA_PAL = ['VERBO', 'ENFASIS', 'COLUMNA', 'EXPECTATIVA', 'CONTENIDO', 'PROCESO', 'BLOQUE', 'ACTITUDINAL'];
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
   calificar: así se siente la prueba real. La lectura del currículo
   y el planeamiento didáctico son materia fija de las pruebas de
   conocimientos, así que aquí el simulacro va como simulacro.
   Reparto de correctas: cinco en cada letra (normativa 1-ter). */
const CN = [
  { q: 'En una expectativa de logro, el elemento que determina qué se va a evaluar es:',
    o: ['El verbo', 'El nombre del bloque', 'El área curricular', 'El número de grado'], c: 0 },
  { q: 'El orden impreso de las columnas en la tabla del DCNB es:',
    o: ['Contenidos, Expectativas, Procesos', 'Expectativas, Contenidos, Procesos',
        'Procesos, Contenidos, Expectativas', 'Expectativas, Procesos, Contenidos'], c: 1 },
  { q: 'La columna que indica «a dónde tiene que llegar el alumno» es:',
    o: ['Procesos y Actividades Sugeridas', 'Contenidos Conceptuales y Actitudinales',
        'Expectativas de Logro', 'Bloques de contenido'], c: 2 },
  { q: 'La columna que trae la actividad ya pensada es:',
    o: ['Expectativas de Logro', 'Contenidos Conceptuales', 'Estándares',
        'Procesos y Actividades Sugeridas'], c: 3 },
  { q: 'El símbolo ■ en la segunda columna corresponde a contenidos:',
    o: ['Actitudinales', 'Conceptuales', 'Procedimentales', 'Transversales'], c: 1 },
  { q: 'El símbolo ● en la segunda columna corresponde a contenidos:',
    o: ['Conceptuales', 'Procedimentales', 'Actitudinales', 'Instrumentales'], c: 2 },
  { q: 'Un contenido actitudinal se comprueba principalmente mediante:',
    o: ['Prueba objetiva escrita', 'Examen oral de definiciones',
        'Cuestionario de opción múltiple', 'Observación sostenida en el tiempo'], c: 3 },
  { q: 'Cuando una expectativa dice «en los dos tipos más evidentes», esa frase constituye:',
    o: ['El alcance o techo de la expectativa', 'Una sugerencia metodológica',
        'El nombre del contenido', 'Un ejemplo prescindible'], c: 0 },
  { q: 'Evaluar por encima del alcance escrito en la expectativa significa:',
    o: ['Elevar correctamente la exigencia', 'Salirse de lo que manda el currículo',
        'Aplicar una adecuación curricular', 'Cumplir con el estándar'], c: 1 },
  { q: 'La fórmula «con énfasis en el componente diversidad» señala:',
    o: ['El grado al que pertenece', 'La modalidad del centro',
        'La mirada desde la cual se trabaja el contenido', 'El instrumento de evaluación'], c: 2 },
  { q: 'Entre los componentes que aparecen en el currículo de Ciencias Naturales de Básica están:',
    o: ['Lectura, escritura y cálculo', 'Identidad, trabajo y democracia',
        'Conceptual, procedimental y actitudinal', 'Ambiente, salud y diversidad'], c: 3 },
  { q: 'Los verbos más frecuentes en las expectativas de logro del DCNB de Básica incluyen:',
    o: ['Identifican, analizan y reconocen', 'Memorizan, copian y repiten',
        'Supervisan, autorizan y certifican', 'Planifican, administran y evalúan'], c: 0 },
  { q: 'Si la expectativa dice «analizan» y el docente escribe «conocen» en su plan:',
    o: ['No hay diferencia, son sinónimos', 'Baja el nivel del logro y de la evaluación',
        'Sube el nivel de exigencia', 'Se cumple igualmente la expectativa'], c: 1 },
  { q: 'La lista que inicia «Al finalizar el Primer Grado de la Educación Básica, los alumnos y las alumnas:» contiene:',
    o: ['Los estándares nacionales', 'Los ejes transversales',
        'Las expectativas de logro del grado completo', 'Los criterios de evaluación'], c: 2 },
  { q: 'Para planificar una clase concreta, el docente debe usar:',
    o: ['La lista general del grado', 'Los fines de la educación nacional',
        'El estándar del área', 'La expectativa de la fila del bloque'], c: 3 },
  { q: 'Leer la fila completa antes de planificar se recomienda porque:',
    o: ['Las tres columnas son una sola idea partida en tres', 'Lo exige el reglamento interno',
        'Así se llena más rápido el formato', 'Evita usar el libro de texto'], c: 0 },
  { q: 'El objeto de la expectativa «Reconocen la potencia de un número como abreviación de un producto de factores iguales» es:',
    o: ['Los números en general', 'La potencia de un número como abreviación de un producto de factores iguales',
        'La raíz cuadrada', 'El sistema de numeración decimal'], c: 1 },
  { q: 'Que la tercera columna se llame «sugeridas» significa que:',
    o: ['No debe usarse nunca', 'Es de aplicación literal y obligatoria',
        'Orienta, pero el contexto del aula manda', 'Solo aplica en Educación Media'], c: 2 },
  { q: 'Si una fila del DCNB trae contenidos conceptuales y actitudinales a la vez, la evaluación:',
    o: ['Debe usar solo prueba escrita', 'Debe omitir los actitudinales',
        'Puede resolverse con un único instrumento', 'Necesita dos instrumentos distintos'], c: 3 },
  { q: 'Los bloques de contenido del DCNB se definen como:',
    o: ['Macrotemas de los que derivan los contenidos de cada ciclo y grado',
        'Las horas semanales de cada asignatura', 'Los niveles del sistema educativo',
        'Las modalidades de Educación Media'], c: 0 },
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
  ['🔎 Desarmó la fila', () => S.peldanos.length === PELDANOS.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó la lectura', () => !!S.reto],
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
  ['sec-peldanos', '🔎 Los cortes'],
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
