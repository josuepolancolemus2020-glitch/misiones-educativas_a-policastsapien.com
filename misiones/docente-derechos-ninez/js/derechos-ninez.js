/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · Derechos de la niñez en la escuela

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   FUENTES: leída en el documento, no buscada. El texto está en el
   repositorio:

     _dev/leyes/codigo-ninez-adolescencia-decreto-73-96.pdf

   Es el texto CON SUS REFORMAS, publicado por el Poder Judicial. La
   reforma grande es el Decreto 35-2013, del 27 de febrero de 2013,
   publicado en La Gaceta n.º 33,222 del 6 de septiembre de 2013, y
   tocó justo el capítulo del maltrato: por eso las definiciones de
   maltrato por omisión, supresión y transgresión que se citan aquí
   son las reformadas, no las de 1996.

   LO QUE A PROPÓSITO SE MATIZA: el Código nombra al IHNFA en cada
   deber de informar. El mapa institucional de la niñez cambió
   después de 2013 y el nombre de la entidad rectora pudo cambiar
   con él. La misión enseña el DEBER y el PLAZO, que no cambian, y
   le dice al maestro que confirme en su centro a quién se reporta
   hoy. Mandar a un maestro a una oficina que ya no existe es un
   daño concreto.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_NINEZ_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, situaciones: [], fcVistas: [], nombre: '', sonido: 1,
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
   LAS NUEVE SITUACIONES
   Las tres misiones anteriores se recorrían por fechas, por
   artículos y por trámites. Esta se recorre por ESCENAS del aula,
   porque el Código de la Niñez no se consulta antes: se consulta
   cuando ya pasó algo y hay que decidir en caliente.

   Cada escena trae qué hacer y, aparte, qué NO hacer. Lo segundo
   importa más: casi todos los errores de esta materia son de buena
   fe, de un maestro que reacciona como le enseñaron a él.
══════════════════════════════════════════════════════════════ */
const SITUACIONES = [
  {
    ic: '🩹', corto: 'Llega con señales de golpes',
    tit: 'Veinticuatro horas, y el reloj ya empezó',
    sub: 'Código de la Niñez, artículo 168',
    txt: 'Esta es la obligación más dura y la que menos gente conoce. Los directores de centros ' +
         'educativos y los <b>responsables directos de los niños y niñas en esos centros</b>, que ' +
         'es usted, deben informar en un <b>plazo máximo de veinticuatro horas</b> sobre los niños ' +
         'que muestren signos evidentes de agresión o cuyos exámenes revelen que han sido ' +
         'víctimas de malos tratos. El Código dirige ese informe a la entidad rectora de la niñez ' +
         'y al Ministerio Público. Y no es un deber sin consecuencia: <b>omitir el informe se ' +
         'sanciona con multa de dos a cinco salarios mínimos</b> en su valor más alto, sin ' +
         'perjuicio de tener que cumplir igual la obligación.',
    cita: 'En la misma obligación incurrirán los Directores de Centros Educativos y Centros de ' +
          'Cuidado, así como los responsables directos de los niños y niñas en esos centros. La ' +
          'omisión de estos informes se sancionará con multa de dos (2) a cinco (5) salarios ' +
          'mínimos en su valor más alto.',
    pasos: [
      'Registre lo que vio, con fecha y hora, describiendo hechos: «moretón en el brazo izquierdo», no «parece que lo golpean».',
      'Informe de inmediato a la dirección del centro y deje constancia escrita de que informó.',
      'Confirme en su centro a qué entidad se reporta hoy, y que el informe salga dentro de las veinticuatro horas.',
      'Guarde copia de todo lo que entregue, con sello o acuse.',
      'Siga tratando al niño con normalidad: no lo señale ni lo aparte.',
    ],
    nohacer: [
      'No interrogue al niño ni le pida que repita lo que pasó: eso le toca a quien investiga.',
      'No confronte a la familia por su cuenta.',
      'No espere «a estar seguro»: la ley pide informar ante signos evidentes, no ante certeza.',
      'No lo comente en la sala de maestros. Se rompe la protección del niño y la suya.',
    ],
    aula: 'Aquí no hay margen para el «mejor no me meto». La ley le puso a usted el deber, el ' +
          'plazo y la multa. Lo que lo protege es el papel: registre y deje constancia el mismo día.',
  },
  {
    ic: '✋', corto: 'Hay que corregir y no sabe hasta dónde',
    tit: 'La disciplina no es excusa: lo dice el artículo 24',
    sub: 'Código de la Niñez, artículos 24 y 165',
    txt: 'El artículo 24 declara que la dignidad forma parte de la personalidad de los niños, y ' +
         'que es deber de todas las personas protegerlos contra cualquier trato inhumano, ' +
         'violento, aterrorizante, humillante o destructivo, <b>aún cuando se pretenda que se debe ' +
         'a razones disciplinarias o correctivas</b> y quienquiera que sea quien lo haga. Esa ' +
         'frase cierra la puerta al argumento más repetido del oficio: «era para corregirlo». El ' +
         'artículo 165 pone nombre a las conductas: agresiones emocionales o de palabra, ' +
         '<b>incluyendo la ofensa y la humillación</b>, la incomunicación rechazante y el castigo ' +
         'por medio de labores pesadas.',
    cita: 'Es deber de todas las personas velar por el respeto de tal derecho y de proteger a los ' +
          'niños contra cualquier trato inhumano, violento, aterrorizante, humillante o ' +
          'destructivo, aún cuando se pretenda que el mismo se debe a razones disciplinarias o ' +
          'correctivas y quienquiera que sea el agente activo.',
    pasos: [
      'Corrija la conducta, no a la persona: «esto no se hace aquí», no «vos sos así».',
      'Hable en privado siempre que pueda: la corrección en público humilla, y la humillación está nombrada en la ley.',
      'Use consecuencias que reparen: pedir disculpas, arreglar lo que dañó, recuperar el trabajo.',
      'Deje registrado lo que ocurrió y lo que usted hizo.',
    ],
    nohacer: [
      'Nada de castigo físico, ni «un jalón de orejas», ni reglazos.',
      'Nada de apodos, burlas ni comparaciones delante del grupo.',
      'Nada de mandarlo a hacer labores pesadas como castigo: el artículo 165 lo nombra.',
      'Nada de dejar de hablarle o aislarlo del grupo: eso es incomunicación rechazante.',
    ],
    aula: 'La pregunta útil antes de cualquier corrección: si esto se lo hicieran a mi hijo delante ' +
          'de su clase, ¿me parecería bien? Si la respuesta duda, la ley ya la contestó.',
  },
  {
    ic: '🚫', corto: 'Dejarlo sin recreo o fuera del aula',
    tit: 'El castigo que quita derechos tiene nombre legal',
    sub: 'Código de la Niñez, artículo 164',
    txt: 'Este es el que más sorprende, porque parece inofensivo. El Código llama <b>maltrato por ' +
         'supresión</b> a todo trato, disimulado o no, <b>aplicado como medida disciplinaria o ' +
         'correctiva, que tienda a negar al niño el goce de sus derechos</b>. Y comprende toda ' +
         'supresión o discriminación que le cause perjuicio, incluido negarle el acceso a un ' +
         'ambiente infantil, a actividades y áreas recreativas o a relacionarse con otros niños ' +
         'cuando no hay causa justa. Dejarlo sin recreo de manera habitual, sacarlo del aula, no ' +
         'dejarlo entrar, excluirlo de la actividad o negarle el examen entran por esa puerta.',
    cita: 'El maltrato por Supresión implica todo aquel trato, disimulado o no, como medidas ' +
          'disciplinarias o correctivas, que tiendan a negar al niño o niña el goce de sus ' +
          'derechos.',
    pasos: [
      'Separe la falta de la clase: quien se porta mal responde por eso, no pierde el derecho a aprender.',
      'Si necesita sacarlo un momento para calmar la situación, que sea breve, acompañado y con la dirección enterada.',
      'Recupere siempre lo perdido: si faltó a una actividad, se repone.',
      'Anote la medida que aplicó y por qué, en el registro del grado.',
    ],
    nohacer: [
      'No use el recreo como moneda de castigo repetida.',
      'No lo deje fuera del aula sin supervisión ni por tiempo largo.',
      'No condicione la boleta, el examen o la constancia a una conducta o a un pago.',
      'No lo excluya del acto, la excursión o el equipo como sanción.',
    ],
    aula: 'La regla práctica: un castigo que le quita al niño un derecho (aprender, jugar, comer, ' +
          'estar con los demás) está mal escogido, aunque la falta haya sido grave. Busque otro.',
  },
  {
    ic: '🗣️', corto: 'El alumno quiere explicar',
    tit: 'Ser oído no es una cortesía: es un principio del Código',
    sub: 'Código de la Niñez, artículos 5 y 35 literal b)',
    txt: 'El Código manda que en toda medida que tomen las instituciones públicas o privadas la ' +
         'consideración primordial sea el <b>interés superior del niño</b>, y que se respeten, ' +
         'entre otras cosas, su condición de <b>sujeto de derecho</b> y su <b>derecho a ser oído ' +
         'y a que su opinión sea tenida en cuenta</b>, atendiendo a su edad y grado de madurez. Y ' +
         'el capítulo de educación es aún más directo: la enseñanza se imparte de manera que ' +
         'asegure el <b>respeto recíproco y un trato digno entre educador y educando</b>. Recíproco ' +
         'quiere decir en las dos direcciones.',
    cita: 'Debiéndose respetar: 1) Su condición de sujeto de derecho; 2) El derecho de los niños y ' +
          'niñas a ser oídos y que su opinión sea tenida en cuenta.',
    pasos: [
      'Antes de decidir una sanción, escuche su versión. Dos minutos.',
      'Pregunte por hechos, no por culpables: «contame qué pasó», no «¿quién empezó?».',
      'Dígale qué decidió y por qué: tener en cuenta su opinión no es obedecerla, es contestarla.',
      'Si son varios, escuche por separado.',
    ],
    nohacer: [
      'No sancione al grupo entero para no averiguar.',
      'No decida delante de todos antes de oírlo.',
      'No use «porque yo lo digo» como fundamento de una sanción.',
    ],
    aula: 'Escuchar primero le va a ahorrar la mitad de los conflictos con las familias. Casi ' +
          'ningún padre reclama por la sanción: reclaman porque a su hijo no lo oyeron.',
  },
  {
    ic: '📉', corto: 'La nota que quieren impugnar',
    tit: 'El alumno tiene derecho a impugnar su evaluación',
    sub: 'Código de la Niñez, artículos 35 literal c) y 43',
    txt: 'El derecho a la educación incluye, con todas sus letras, <b>la impugnación ante las ' +
         'instancias correspondientes, de acuerdo con la ley y los reglamentos, de las ' +
         'evaluaciones hechas durante el proceso de enseñanza y aprendizaje</b>. Y el artículo 43 ' +
         'añade que los educandos y sus padres o representantes legales tienen derecho a ' +
         '<b>obtener información sobre los procesos pedagógicos</b>, y los padres a participar en ' +
         'la definición de propuestas educacionales. No es un favor que usted concede: es un ' +
         'derecho que la ley reconoce.',
    cita: 'La impugnación ante las instancias correspondientes, de acuerdo con la ley y los ' +
          'reglamentos, de las evaluaciones hechas durante el proceso de enseñanza y aprendizaje.',
    pasos: [
      'Tenga el criterio escrito y avisado ANTES de calificar: es lo que convierte una nota en algo defendible.',
      'Muestre el instrumento: la prueba, la rúbrica, el registro de acumulativo.',
      'Explique cómo se llegó a la nota, punto por punto.',
      'Si hay error, corríjalo sin drama: corregir a tiempo no le quita autoridad, se la da.',
      'Si no hay error, indique cuál es la instancia siguiente y no se lo tome como algo personal.',
    ],
    nohacer: [
      'No responda «así es y punto».',
      'No cambie la nota solo por evitar el conflicto: eso le enseña al alumno lo contrario.',
      'No comente la nota de un alumno delante de otros.',
    ],
    aula: 'Todo esto se resuelve con un cuaderno de criterios y evidencias. La impugnación asusta ' +
          'al que califica de memoria; al que registra, le da la razón sola.',
  },
  {
    ic: '🧒', corto: 'Un alumno de doce años trabaja',
    tit: 'Trabajar no puede costarle la escuela',
    sub: 'Código de la Niñez, artículos 120, 125, 126 y 173',
    txt: 'El Código es tajante: <b>en ningún caso se autorizará para trabajar a un niño menor de ' +
         'catorce años</b>. De catorce a dieciséis, la jornada no puede exceder de <b>cuatro horas ' +
         'diarias</b>; de dieciséis a dieciocho, de <b>seis horas</b>. El trabajo nocturno está ' +
         'prohibido, y los de dieciséis a dieciocho solo pueden ser autorizados hasta las ocho de ' +
         'la noche <b>siempre que no se afecte su asistencia regular a un centro docente</b>. ' +
         'Además, todo empleador que ocupe a un niño debe llevar un registro que incluya la ' +
         '<b>constancia de que está cumpliendo sus obligaciones escolares</b>: ese papel sale de ' +
         'su centro. Y el artículo 173 considera maltrato obligar al niño a actividades que ' +
         '<b>impidan su concurrencia a los establecimientos educativos</b>.',
    cita: 'En ningún caso se autorizará para trabajar a un niño menor de catorce (14) años.',
    pasos: [
      'Averigüe con calma el horario real del alumno: cuántas horas, en qué, hasta qué hora.',
      'Si es menor de catorce años y trabaja, hay una prohibición legal de por medio: informe a la dirección.',
      'Si el trabajo le está costando la asistencia, eso es maltrato según el artículo 173, y se reporta.',
      'Ajuste lo que esté en su mano: horarios de entrega, recuperaciones, apoyo del grupo.',
      'Documente cada conversación con la familia, con fecha.',
    ],
    nohacer: [
      'No lo trate como vago ni lo humille por dormirse en clase.',
      'No le baje la nota por faltas cuya causa usted ya conoce, sin buscar antes una alternativa.',
      'No firme una constancia de cumplimiento escolar que no sea cierta.',
    ],
    aula: 'El alumno que trabaja no está eligiendo entre trabajo y escuela: casi siempre su familia ' +
          'eligió por él. Su papel es que la escuela no sea lo primero que se cae.',
  },
  {
    ic: '♿', corto: 'Dificultad para aprender',
    tit: 'Detectar y dar cuenta es un deber suyo, con nombre y apellido',
    sub: 'Código de la Niñez, artículos 110 y 36 literal c)',
    txt: 'Este artículo nombra directamente al maestro: los maestros de educación preescolar, ' +
         'primaria y media <b>que detecten cualquier dificultad para el aprendizaje</b> que ' +
         'presenten los niños con discapacidad <b>deberán dar cuenta del hecho a sus superiores ' +
         'jerárquicos, así como a los padres o representantes legales</b>, para que se adopten las ' +
         'medidas que las circunstancias exijan. Y entre los deberes del Estado está establecer y ' +
         'promover servicios de atención y educación especial, tanto para los niños con ' +
         'discapacidad como para quienes tengan un nivel de inteligencia superior.',
    cita: 'Los maestros de educación preescolar, primaria y media que detecten cualquier dificultad ' +
          'para el aprendizaje que presenten los niños discapacitados, deberán dar cuenta del hecho ' +
          'a sus superiores jerárquicos, así como a los correspondientes padres o representantes ' +
          'legales.',
    pasos: [
      'Anote lo observado con ejemplos concretos y fechas, no con etiquetas.',
      'Informe a la dirección por escrito y guarde copia.',
      'Hable con la familia el mismo mes, no al final del año.',
      'Ajuste mientras tanto lo que pueda: tiempo, formato, ubicación en el aula, apoyo de un compañero.',
    ],
    nohacer: [
      'No diagnostique: usted detecta y reporta, no dice qué tiene el niño.',
      'No espere «a ver si madura».',
      'No lo aparte del grupo ni lo dé por perdido: el Código lo llama educación especial, no exclusión.',
    ],
    aula: 'La ley le pide detectar, no resolver. Detectar y avisar por escrito ya es cumplir, y es ' +
          'lo que abre la puerta al apoyo que usted solo no puede dar.',
  },
  {
    ic: '🚪', corto: 'El que dejó de venir',
    tit: 'Contra la deserción, la ley le da un papel activo',
    sub: 'Código de la Niñez, artículo 39',
    txt: 'El Código no deja la deserción en manos de la casa: dice que <b>las autoridades ' +
         'escolares, los padres o representantes legales y los maestros velarán porque el ambiente ' +
         'y el tratamiento escolar constituyan un incentivo para evitar la deserción, la ' +
         'repitencia y el ausentismo</b>. Es decir: el trato que se da dentro del aula es parte del ' +
         'problema o parte de la solución, y la ley se lo dice al maestro por su nombre. Añade que ' +
         'la Secretaría de Educación adoptará las medidas para que se cumpla el principio de ' +
         'educación obligatoria y pondrá en práctica programas alternativos para la niñez que ' +
         'trabaja.',
    cita: 'Las autoridades escolares, los padres o representantes legales de los niños y los ' +
          'maestros velarán porque el ambiente y tratamiento escolar constituyan un incentivo para ' +
          'evitar la deserción, la repitencia y el ausentismo.',
    pasos: [
      'Mire el patrón de faltas antes de que se vuelva abandono: tres seguidas ya es una señal.',
      'Busque a la familia temprano, y con tono de quien pregunta, no de quien reclama.',
      'Deje constancia escrita de cada intento de contacto, con fecha.',
      'Pregúntese qué del ambiente del aula pesa: burlas del grupo, la materia que no entiende, el hambre.',
    ],
    nohacer: [
      'No espere al cierre para reportar al que ya no viene.',
      'No lo reciba con reproche el día que regresa: ese día decide si vuelve mañana.',
      'No dé por hecho que «a esa familia no le interesa» sin haber preguntado.',
    ],
    aula: 'La ley le está diciendo algo incómodo y cierto: el ambiente del aula es una de las causas ' +
          'de la deserción. Esa parte sí está en sus manos.',
  },
  {
    ic: '🎓', corto: 'Las becas del cinco por ciento',
    tit: 'Un derecho que casi nadie reclama',
    sub: 'Código de la Niñez, artículo 36 literal g)',
    txt: 'Entre los deberes del Estado en materia educativa está establecer servicios de asistencia ' +
         'para los alumnos que carecen de recursos económicos, y el Código concreta uno: dentro de ' +
         'esos servicios <b>debe quedar incluido el otorgamiento de becas de estudio para el cinco ' +
         'por ciento, por lo menos, del alumnado de cada establecimiento educativo público o ' +
         'privado</b>. Y el artículo 35 reconoce entre los contenidos del derecho a la educación la ' +
         'participación en programas de becas y el acceso a escuelas gratuitas cercanas a la ' +
         'residencia.',
    cita: 'Dentro de estos servicios debe quedar incluido el otorgamiento de becas de estudio para ' +
          'el cinco por ciento (5%), por lo menos, del alumnado de cada establecimiento educativo ' +
          'público o privado.',
    pasos: [
      'Saque la cuenta de su centro: el cinco por ciento de la matrícula, en alumnos.',
      'Llévelo al consejo de docentes y pida que conste en acta qué becas existen.',
      'Identifique en su grado a quienes están a punto de salirse por dinero.',
      'Informe a esas familias que la beca existe y cómo se solicita.',
    ],
    nohacer: [
      'No dé por sentado que «aquí no hay becas» sin preguntar formalmente.',
      'No la ofrezca como premio de conducta: es un servicio para quien carece de recursos.',
    ],
    aula: 'Es el artículo que más rápido cambia la vida de un alumno concreto. Un maestro que sabe ' +
          'esto y lo dice en la reunión de padres vale por dos.',
  },
];

let _sit = 0;
/* La lista va en vertical y la escena se abre DEBAJO de la que se tocó: es el
   molde de la serie, y en el teléfono es la única forma de que se vean las
   nueve sin arrastrar. */
function siPinta() {
  const lista = document.getElementById('siLista');
  if (!lista) return;
  lista.innerHTML = SITUACIONES.map((t, i) => {
    const abierto = i === _sit;
    return `
    <div class="si-item ${abierto ? 'on' : ''} ${S.situaciones.includes(i) ? 'visto' : ''}" id="siIt${i}">
      <button class="si-cab" onclick="siVer(${i})" aria-expanded="${abierto}">
        <span class="si-num" aria-hidden="true">${t.ic}</span>
        <span class="si-tit">${t.corto}</span>
        ${S.situaciones.includes(i) ? '<span class="si-visto">✓</span>' : ''}
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
function siVer(i) {
  _sit = i;
  if (!S.situaciones.includes(i)) { S.situaciones.push(i); xp(3); }
  siPinta();
  // Que la escena tocada quede a la vista aunque el texto empuje la lista
  const el = document.getElementById('siIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function siMover(d) { siVer(Math.max(0, Math.min(SITUACIONES.length - 1, _sit + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════
   NOMBRES PROPIOS CON MAYÚSCULA, aquí también (normativa de la casa,
   en CLAUDE.md). Se comprueba con node _dev/verifica-nombres-propios.js. */
const FC = [
  ['¿Cuál es la norma que protege a la niñez en Honduras y de qué año es?', 'El Código de la Niñez y la Adolescencia, Decreto 73-96, de 1996. Su reforma grande es el Decreto 35-2013.'],
  ['¿Hasta qué edad se es niño o niña para el Código?', 'Hasta los dieciocho años. Y en caso de duda sobre la edad, se presume que la persona es menor de dieciocho.'],
  ['¿Qué pasa con los derechos que reconoce el Código?', 'Son irrenunciables, intransigibles y de aplicación obligatoria en todo acto, decisión o medida que se adopte respecto de un niño.'],
  ['¿Qué dice el artículo 24 sobre la disciplina?', 'Que hay que proteger al niño de todo trato inhumano, violento, aterrorizante, humillante o destructivo, aunque se pretenda que es por razones disciplinarias o correctivas.'],
  ['¿Qué es el maltrato por supresión?', 'Todo trato aplicado como medida disciplinaria o correctiva que tienda a negar al niño el goce de sus derechos. Artículo 164.'],
  ['¿Qué conductas nombra el artículo 165 como maltrato por transgresión?', 'Malos tratos físicos, agresiones emocionales o de palabra incluyendo la ofensa y la humillación, la incomunicación rechazante y el castigo por medio de labores pesadas.'],
  ['¿En qué plazo debe informarse sobre un niño con signos evidentes de agresión?', 'En un plazo máximo de veinticuatro horas. La obligación alcanza a los directores de centros educativos y a los responsables directos de los niños en esos centros.'],
  ['¿Qué pasa si se omite ese informe?', 'Multa de dos a cinco salarios mínimos en su valor más alto, sin perjuicio de tener que cumplir igual la obligación. Artículo 168.'],
  ['¿Qué debe hacer el maestro que detecta una dificultad de aprendizaje?', 'Dar cuenta del hecho a sus superiores jerárquicos y a los padres o representantes legales. Artículo 110.'],
  ['¿Qué derecho tiene el alumno sobre sus evaluaciones?', 'El de impugnarlas ante las instancias correspondientes, de acuerdo con la ley y los reglamentos. Artículo 35 literal c).'],
  ['¿Quiénes son responsables de la educación de un niño, según el artículo 38?', 'El padre y la madre, los representantes legales y también sus maestros.'],
  ['¿Qué manda el artículo 39 sobre la deserción?', 'Que las autoridades escolares, los padres y los maestros velen porque el ambiente y el trato escolar sean un incentivo para evitar la deserción, la repitencia y el ausentismo.'],
  ['¿A qué edad mínima se puede autorizar el trabajo de un niño?', 'A los catorce años. En ningún caso se autoriza a un menor de catorce. Artículo 120.'],
  ['¿Cuál es la jornada máxima de un niño trabajador?', 'Cuatro horas diarias entre los catorce y los dieciséis años; seis horas entre los dieciséis y los dieciocho. Artículo 125.'],
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
  ['Artículo 24', 'La disciplina no justifica el trato humillante'],
  ['Artículo 164', 'Maltrato por supresión: castigos que quitan derechos'],
  ['Artículo 168', 'Informar en 24 horas, o multa'],
  ['Artículo 110', 'Detectar y dar cuenta a superiores y padres'],
  ['Artículo 39', 'El trato escolar contra la deserción'],
  ['Artículo 120', 'Nunca a trabajar antes de los catorce'],
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
  { q: 'Para el Código de la Niñez y la Adolescencia, es niño o niña toda persona…',
    o: ['Hasta los doce años', 'Hasta los dieciocho años', 'Hasta los quince años', 'Hasta los veintiún años'],
    c: 1, e: 'Hasta los dieciocho. Y en caso de duda sobre la edad, se presume que es menor de dieciocho.' },
  { q: 'El artículo 24 protege al niño de todo trato humillante…',
    o: ['Aunque se pretenda que es por razones disciplinarias o correctivas',
        'Salvo cuando lo aplica un docente', 'Salvo cuando la falta es grave',
        'Solo si ocurre fuera del centro educativo'],
    c: 0, e: 'La ley cierra expresamente la puerta al argumento de que «era para corregirlo».' },
  { q: 'Dejar a un alumno sin recreo como castigo habitual encaja en…',
    o: ['Una práctica pedagógica válida', 'El maltrato por omisión',
        'El maltrato por supresión', 'Una falta administrativa del alumno'],
    c: 2, e: 'Artículo 164: medidas disciplinarias o correctivas que tiendan a negar al niño el goce de sus derechos.' },
  { q: 'Ante un niño con signos evidentes de agresión, el centro educativo debe informar en un plazo máximo de…',
    o: ['Una semana', 'Cuarenta y ocho horas', 'Un mes', 'Veinticuatro horas'],
    c: 3, e: 'Artículo 168, y la obligación alcanza a los responsables directos de los niños en el centro, no solo al director.' },
  { q: 'Omitir ese informe se sanciona con…',
    o: ['Una amonestación verbal', 'Multa de dos a cinco salarios mínimos',
        'Nada, es solo una recomendación', 'La suspensión inmediata del docente'],
    c: 1, e: 'Y sin perjuicio de tener que cumplir igual la obligación.' },
  { q: 'El maestro que detecta una dificultad de aprendizaje debe…',
    o: ['Esperar al cierre del año para reportarlo',
        'Dar cuenta a sus superiores jerárquicos y a los padres o representantes legales',
        'Diagnosticar al alumno', 'Cambiarlo de sección'],
    c: 1, e: 'Artículo 110. Usted detecta y avisa; no diagnostica.' },
  { q: 'Sobre las evaluaciones, el Código reconoce al alumno el derecho a…',
    o: ['Escoger a su evaluador', 'Repetir el examen cuantas veces quiera',
        'Impugnarlas ante las instancias correspondientes', 'Conocerlas solo al final del año'],
    c: 2, e: 'Artículo 35 literal c). Y el 43 le da a él y a sus padres derecho a información sobre los procesos pedagógicos.' },
  { q: '¿A partir de qué edad puede autorizarse el trabajo de un niño?',
    o: ['Catorce años', 'Doce años', 'Dieciséis años', 'No hay edad mínima'],
    c: 0, e: 'Artículo 120: en ningún caso se autoriza a un menor de catorce años.' },
  { q: 'Según el artículo 39, contra la deserción y el ausentismo deben velar…',
    o: ['Solo la Secretaría de Educación', 'Solo los padres de familia',
        'Solo el director del centro', 'Las autoridades escolares, los padres y los maestros'],
    c: 3, e: 'Y lo dice del ambiente y el tratamiento escolar: el trato dentro del aula es parte del problema o de la solución.' },
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

/* ══════════════════ CLASIFICA ══════════════════ */
const CL_GRUPOS = [
  { t: 'Dignidad y disciplina', it: ['La corrección no justifica humillar', 'Nada de castigo con labores pesadas', 'Ni apodos ni burlas delante del grupo'] },
  { t: 'Deber de informar', it: ['Veinticuatro horas', 'Multa por omitir el informe', 'Dar cuenta a superiores y a los padres'] },
  { t: 'Derecho a aprender', it: ['Impugnar la evaluación', 'Beca para el cinco por ciento', 'Trato digno entre educador y educando'] },
  { t: 'Niñez que trabaja', it: ['Nunca antes de los catorce', 'Cuatro horas de catorce a dieciséis', 'Constancia de cumplimiento escolar'] },
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
    (bien === _clTodas.length ? 'Cada cosa en su sitio. Así se pregunta en el concurso.'
                              : 'Revise las que quedaron fuera de sitio y vuelva a intentarlo.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['El Código de la Niñez y la Adolescencia es el Decreto ____.', ['73-96', '7396']],
  ['Para el Código, es niño o niña toda persona hasta los ____ años.', ['18', 'dieciocho']],
  ['Ante signos evidentes de agresión hay que informar en un máximo de ____ horas.', ['24', 'veinticuatro']],
  ['Omitir ese informe se sanciona con multa de dos a ____ salarios mínimos.', ['5', 'cinco']],
  ['El artículo ____ dice que la disciplina no justifica un trato humillante.', ['24', 'veinticuatro']],
  ['El castigo que niega derechos se llama maltrato por ____.', ['supresion', 'supresión']],
  ['En ningún caso se autoriza a trabajar a un niño menor de ____ años.', ['14', 'catorce']],
  ['Deben becarse al menos el ____ por ciento del alumnado de cada establecimiento.', ['5', 'cinco']],
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
    (bien === CP.length ? 'Los datos duros los tiene. Son los que se citan cuando hay que actuar rápido.'
                        : 'Vuelva a las situaciones por las que falló: el número se pega cuando se sabe para qué sirve.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   Aquí se ordena lo que hay que hacer el día que un niño llega con
   señales de golpes. No es un ejercicio de memoria: es el orden que
   hay que tener claro cuando pasa, que es cuando nadie piensa bien. */
const RETO = [
  { t: 'Usted nota las señales y decide no dejarlo pasar', o: 1 },
  { t: 'Registra lo observado con fecha, hora y hechos', o: 2 },
  { t: 'Evita interrogar al niño y confrontar a la familia', o: 3 },
  { t: 'Informa a la dirección del centro ese mismo día', o: 4 },
  { t: 'Deja constancia escrita de que informó', o: 5 },
  { t: 'Confirma a qué entidad se reporta hoy', o: 6 },
  { t: 'El informe sale dentro de las veinticuatro horas', o: 7 },
  { t: 'Guarda copia sellada de todo lo entregado', o: 8 },
  { t: 'Sigue tratando al niño con normalidad, sin señalarlo', o: 9 },
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
    ? `<span class="resu-num">¡Listo!</span>Puso la ruta en orden con ${_retoSeg} segundos de sobra. El día que pase, no va a tener que pensarlo.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['DIGNIDAD', 'MALTRATO', 'SUPRESION', 'DENUNCIA', 'INTERES', 'BECA', 'DESERCION', 'OPINION'];
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
   calificar: así se siente la prueba real. Reparto de correctas:
   cinco en cada letra (normativa 1-ter). */
const CN = [
  { q: 'El Código de la Niñez y la Adolescencia corresponde al:',
    o: ['Decreto 73-96', 'Decreto 136-97', 'Decreto 262-2011', 'Decreto 79 de 1966'], c: 0 },
  { q: 'Para el Código, es niño o niña toda persona hasta los:',
    o: ['Doce años', 'Quince años', 'Dieciocho años', 'Veintiún años'], c: 2 },
  { q: 'Los derechos que el Código establece a favor de los niños son:',
    o: ['Renunciables por sus padres', 'Aplicables solo en el ámbito judicial',
        'Válidos solo en centros públicos', 'Irrenunciables, intransigibles y de aplicación obligatoria'], c: 3 },
  { q: 'En caso de duda sobre la edad de una persona, el Código manda:',
    o: ['Presumir que es mayor de dieciocho', 'Suspender toda actuación',
        'Presumir que es menor de dieciocho', 'Esperar la partida de nacimiento'], c: 2 },
  { q: 'La consideración primordial en toda medida que afecte a un niño es:',
    o: ['La disponibilidad presupuestaria', 'El interés superior del niño',
        'La opinión de la autoridad', 'La costumbre del centro'], c: 1 },
  { q: 'El artículo 24 prohíbe el trato humillante contra un niño:',
    o: ['Salvo si lo aplica un docente', 'Solo dentro del centro educativo',
        'Solo si hay denuncia previa', 'Aunque se pretenda que se debe a razones disciplinarias'], c: 3 },
  { q: 'El maltrato por supresión consiste en:',
    o: ['Dejar de proveer afecto al niño', 'Medidas disciplinarias o correctivas que niegan al niño el goce de sus derechos',
        'Golpear al niño', 'No matricularlo a tiempo'], c: 1 },
  { q: 'Entre las conductas de maltrato por transgresión, el Código menciona expresamente:',
    o: ['La ofensa y la humillación', 'La falta de útiles escolares',
        'El exceso de tareas', 'La repetición de grado'], c: 0 },
  { q: 'El plazo máximo para informar sobre un niño con signos evidentes de agresión es de:',
    o: ['Veinticuatro horas', 'Una semana', 'Setenta y dos horas', 'Cuarenta y ocho horas'], c: 0 },
  { q: 'Esa obligación de informar alcanza, además del director, a:',
    o: ['Los padres de familia únicamente', 'Solo el personal de salud',
        'Solo la Secretaría de Educación', 'Los responsables directos de los niños en el centro'], c: 3 },
  { q: 'La omisión del informe sobre un niño agredido se sanciona con multa de:',
    o: ['Medio a un salario mínimo', 'Uno a dos salarios mínimos',
        'Dos a cinco salarios mínimos', 'No tiene sanción'], c: 2 },
  { q: 'El maestro que detecta una dificultad de aprendizaje debe dar cuenta:',
    o: ['A sus superiores jerárquicos y a los padres o representantes legales',
        'Solo a la Secretaría de Educación', 'Solo al padre de familia', 'Al Ministerio Público'], c: 0 },
  { q: 'Según el Código, son responsables de la educación de un niño:',
    o: ['Solo el Estado', 'Solo los padres',
        'El padre, la madre, los representantes legales y sus maestros', 'Solo el centro educativo'], c: 2 },
  { q: 'El derecho a la educación incluye la posibilidad de:',
    o: ['Elegir las materias que se cursan', 'Impugnar las evaluaciones ante las instancias correspondientes',
        'Exigir la repetición de todo examen', 'Cambiar de docente a solicitud'], c: 1 },
  { q: 'Contra la deserción, la repitencia y el ausentismo deben velar:',
    o: ['Solo el director', 'Solo la familia',
        'Solo la Secretaría de Educación', 'Las autoridades escolares, los padres y los maestros'], c: 3 },
  { q: 'El Código manda otorgar becas de estudio, por lo menos, para:',
    o: ['El uno por ciento del alumnado', 'El cinco por ciento del alumnado',
        'El diez por ciento del alumnado', 'Los alumnos de excelencia'], c: 1 },
  { q: 'La edad mínima para autorizar el trabajo de un niño es:',
    o: ['Doce años', 'Trece años', 'Quince años', 'Catorce años'], c: 3 },
  { q: 'La jornada de un niño mayor de catorce y menor de dieciséis años no puede exceder de:',
    o: ['Cuatro horas diarias', 'Seis horas diarias', 'Ocho horas diarias', 'Dos horas diarias'], c: 0 },
  { q: 'El empleador que ocupe a un niño debe agregar a su registro:',
    o: ['Una carta de recomendación', 'La constancia de que cumple sus obligaciones escolares',
        'Un examen psicológico', 'El expediente médico completo'], c: 1 },
  { q: 'Obligar a un niño a actividades que impidan su asistencia a los establecimientos educativos:',
    o: ['Es potestad de los padres', 'Es una falta administrativa del centro',
        'Se considera maltrato', 'No está regulado'], c: 2 },
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
  ['🏫 Recorrió las situaciones', () => S.situaciones.length === SITUACIONES.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó la ruta', () => !!S.reto],
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
  ['sec-situaciones', '🏫 Situaciones'],
  ['sec-aprende', '🧭 Aprende'],
  ['sec-tarjetas', '🃏 Tarjetas'],
  ['sec-quiz', '❓ Quiz'],
  ['sec-clasifica', '🗂️ Temas'],
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
  S = { xp: 0, situaciones: [], fcVistas: [], nombre: '', sonido: son,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
        casos: 0, concursoNota: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _sit = 0; _fc = 0; _qzResp = [];
  siPinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); cnInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  siPinta();
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
