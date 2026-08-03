/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · La Ley Fundamental de Educación en el aula

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   FUENTES: cada número de artículo, de decreto y de La Gaceta que
   aparece aquí se verificó contra el documento oficial o su ficha en
   un portal del Estado (se.gob.hn, tsc.gob.hn, La Gaceta, RAE-DPEJ)
   en agosto de 2026. Si alguien corrige un dato, que corrija también
   la ficha imprimible: las dos se estudian juntas.

   LO QUE A PROPÓSITO NO SE DICE: los porcentajes de evaluación
   (examen contra acumulativo) y las notas mínimas de promoción. No
   los fija la ley: los mueve la Secretaría cada año por acuerdo o
   circular. Ponerlos aquí sería envejecer la misión en un año y,
   peor, hacer que un maestro cite en un concurso un número derogado.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_LEYFUND_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, arts: [], fcVistas: [], nombre: '', sonido: 1,
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
   LOS DIEZ ARTÍCULOS
   Cada uno trae: qué manda, la frase con que lo dice la ley y qué
   le deja al aula de hoy. Ese tercer campo es el que convierte un
   número de artículo en algo que el maestro usa el lunes.

   Van en orden de artículo, no de importancia: así se memorizan, y
   así se preguntan en el concurso.
══════════════════════════════════════════════════════════════ */
const ARTS = [
  {
    num: 'Art. 6', corto: 'Rendir cuentas',
    tit: 'La educación es plata pública, y se rinde cuentas de ella',
    sub: 'Ley Fundamental de Educación, artículo 6',
    txt: 'La ley declara la educación una inversión social pública. De ahí saca una consecuencia ' +
         'que mucha gente en los centros todavía toma como desconfianza personal: quien administra ' +
         'y gestiona educación está obligado a rendir cuentas a la nación por el logro de los ' +
         'resultados que se establecen periódicamente, y queda sujeto a auditoría social y a las ' +
         'actividades de fiscalización del Estado. La auditoría social no la hace un inspector de ' +
         'la capital: la ejercen las asociaciones de padres y los consejos de desarrollo educativo ' +
         'del centro y del municipio.',
    cita: 'La educación es una inversión social pública, y por ello los responsables de su ' +
          'administración y gestión están obligados a rendir cuentas a la nación.',
    aula: 'Cuando un padre pregunta en qué se gastó una colecta, está usando la ley, no faltándole ' +
          'el respeto. Lleve el cuadro de ingresos y gastos con recibos y déjelo en acta antes de ' +
          'que se lo pidan.',
  },
  {
    num: 'Art. 7', corto: 'Gratuidad',
    tit: 'Gratuita quiere decir que no se le exige nada a la familia',
    sub: 'Ley Fundamental de Educación, artículo 7',
    txt: 'La educación que se ofrece en los establecimientos oficiales es gratuita y el Estado ' +
         'garantiza su financiamiento. La ley va más allá de declararlo: prohíbe exigir ' +
         'aportaciones económicas o en especie de parte de docentes o autoridades educativas, y ' +
         'manda sancionar la infracción conforme al reglamento respectivo. La palabra que decide ' +
         'es «exigir»: un aporte voluntario acordado en asamblea, con acta y con recibo, no es lo ' +
         'mismo que una cuota que se cobra en el aula y sin la cual el niño no recibe algo.',
    cita: 'La educación que se ofrece en los establecimientos oficiales es gratuita. Se prohíbe ' +
          'exigir aportaciones económicas o en especie por parte de docentes o autoridades educativas.',
    aula: 'Si en su grado se recoge dinero, que sea voluntario, acordado en asamblea, con acta, ' +
          'con recibo y con rendición pública. El que tuvo el dinero en la mano es el que responde.',
  },
  {
    num: 'Art. 8', corto: 'Obligatoriedad',
    tit: 'De un año de prebásica hasta la media, y es obligación de la casa',
    sub: 'Ley Fundamental de Educación, artículo 8',
    txt: 'La escolaridad obligatoria en Honduras va de al menos un año de educación prebásica ' +
         'hasta terminar la educación media. La ley se la carga a los padres, madres o tutores: ' +
         'ellos tienen el deber de procurar que sus hijos la cursen. No es un consejo pedagógico, ' +
         'es una obligación legal, y los consejos de desarrollo educativo tienen entre sus tareas ' +
         'velar porque se cumpla.',
    cita: 'Es obligación de los padres, madres o tutores procurar que sus hijos cursen desde un ' +
          'año de educación prebásica hasta la educación media.',
    aula: 'Ante la familia que va a sacar al niño de la escuela, usted no está pidiendo un favor: ' +
          'está recordando una obligación. Dígalo con esas palabras y deje constancia de que avisó.',
  },
  {
    num: 'Art. 16', corto: 'Doscientos días',
    tit: 'El año lectivo tiene doscientos días y alguien los cuenta',
    sub: 'Ley Fundamental de Educación, artículo 16',
    txt: 'El artículo que organiza la educación formal en niveles con pautas curriculares ' +
         'progresivas es también el que fija el reloj del año escolar: el año lectivo consta de al ' +
         'menos doscientos días de clase u otra unidad de medida equivalente, y no puede darse por ' +
         'concluido hasta completarlos. Y le pone contador: las Direcciones Municipales o ' +
         'Distritales de Educación, junto con los Consejos de Desarrollo del Centro Educativo, ' +
         'están obligadas a informar mensualmente cuántos días se trabajaron en cada centro, para ' +
         'que se apliquen los correctivos y, en su caso, las sanciones del Estatuto del Docente ' +
         'Hondureño. Si las autoridades educativas omiten ese informe, incurren en responsabilidad.',
    cita: 'El año lectivo consta de, al menos, doscientos (200) días de clase u otra unidad de ' +
          'medida equivalente. El año lectivo no podrá darse por concluido, sino hasta completar ' +
          'el número de días establecidos.',
    aula: 'De aquí salen el reporte mensual de días y la reposición de los días perdidos. Su ' +
          'registro de asistencia es la prueba de que su grado sí trabajó, aunque el centro no.',
  },
  {
    num: 'Art. 21', corto: 'Prebásica',
    tit: 'Prebásica: gratuita, obligatoria y con edades de referencia',
    sub: 'Ley Fundamental de Educación, artículo 21',
    txt: 'La educación prebásica es gratuita y obligatoria. Su finalidad es favorecer el ' +
         'crecimiento y el desarrollo integral de las capacidades físicas y motoras, socioafectivas, ' +
         'lingüísticas y cognitivas del niño, para su adaptación al contexto escolar y comunitario. ' +
         'Cubre las edades de referencia de cuatro, cinco y seis años.',
    cita: 'La educación prebásica es gratuita y obligatoria. La cobertura de este nivel corresponde ' +
          'a educandos entre las edades de referencia de cuatro (4), cinco (5) y seis (6) años.',
    aula: 'A la madre que dice que la prebásica «es solo jugar» se le contesta con esta línea: es ' +
          'obligatoria, es gratuita y prepara la adaptación escolar. No es guardería ni es opcional.',
  },
  {
    num: 'Art. 22', corto: 'Básica',
    tit: 'Su aula: nueve grados en tres ciclos',
    sub: 'Ley Fundamental de Educación, artículo 22',
    txt: 'La educación básica es gratuita y obligatoria. Consta de nueve años, con edades de ' +
         'referencia de seis a catorce, y se divide en tres ciclos secuenciales y continuos de tres ' +
         'años cada uno. Es el artículo que le da nombre y forma a lo que usted hace: su grado no ' +
         'es «primaria», es un grado de un ciclo de la educación básica, y las tres palabras ' +
         'importan cuando llena un acta o una certificación.',
    cita: 'La educación básica es gratuita y obligatoria. Consta de nueve (9) años y se divide en ' +
          'tres (3) ciclos secuenciales y continuos de tres (3) años cada uno.',
    aula: 'En documentos oficiales se escribe «educación básica» y se indica el ciclo. «Primaria» ' +
          'es el vocabulario de la Ley Orgánica de 1966, derogada: un acta así se devuelve.',
  },
  {
    num: 'Art. 23', corto: 'Media',
    tit: 'La media también es gratuita y obligatoria',
    sub: 'Ley Fundamental de Educación, artículo 23',
    txt: 'La educación media es gratuita y obligatoria, con edades de referencia de quince a ' +
         'diecisiete años. Su propósito es ofrecer la experiencia formativa para incorporarse al ' +
         'mundo del trabajo o proseguir estudios en el nivel superior. Que sea obligatoria es el ' +
         'cambio que más cuesta creer en las aldeas: terminar noveno ya no es terminar.',
    cita: 'La educación media es gratuita y obligatoria. Comprende las edades de referencia entre ' +
          'los quince (15) y los diecisiete (17) años.',
    aula: 'Al alumno de noveno que dice que ya cumplió, y a su familia, se les explica que la ' +
          'obligación escolar llega hasta la media. Es el argumento legal contra la deserción.',
  },
  {
    num: 'Art. 27', corto: 'Modalidades',
    tit: 'Siete modalidades, y ninguna es un favor',
    sub: 'Ley Fundamental de Educación, artículo 27',
    txt: 'Las modalidades son las opciones de organización y de currículo que el Sistema Nacional ' +
         'de Educación ofrece, bajo principios de integralidad, equidad e inclusión de todos los ' +
         'grupos y personas, para responder a requerimientos formativos específicos, permanentes o ' +
         'temporales. La ley enumera siete: personas con capacidades diferentes o talentos ' +
         'excepcionales; jóvenes y adultos; pueblos indígenas y afrohondureños; educación artística; ' +
         'educación física y deportes; educación en casa; y educación para la prevención y ' +
         'rehabilitación social. Por reglamento pueden atenderse otras, y cada una se rige por su ' +
         'reglamento especial.',
    cita: 'Las modalidades educativas son opciones de organización y currículo que ofrece el ' +
          'Sistema Nacional de Educación, bajo principios de integralidad, equidad e inclusión.',
    aula: 'Es el artículo que se cita mal más veces. Si le llega una familia con educación en casa, ' +
          'o un alumno con discapacidad, o un joven que vuelve a estudiar de adulto, no está ante ' +
          'una excepción: está ante una modalidad del sistema, con su reglamento.',
  },
  {
    num: 'Art. 59', corto: 'Currículo',
    tit: 'El currículo manda lo que usted planifica y con qué evalúa',
    sub: 'Ley Fundamental de Educación, artículo 59',
    txt: 'El currículo es la normativa básica del Sistema Nacional de Educación: define el conjunto ' +
         'de competencias, objetivos, contenidos, criterios metodológicos y de evaluación de los ' +
         'aprendizajes que el educando debe alcanzar en un determinado nivel educativo. El currículo ' +
         'nacional se articula en horizontal y en vertical, y la Secretaría de Educación emite las ' +
         'directrices para que responda a la historia y la cultura del país, con consideración ' +
         'especial de los pueblos indígenas y afrohondureños y de las características territoriales ' +
         'e interculturales.',
    cita: 'El currículo, como normativa básica del Sistema Nacional de Educación, define el ' +
          'conjunto de competencias, objetivos, contenidos, criterios metodológicos y de evaluación ' +
          'de los aprendizajes.',
    aula: 'Su planificación no arranca de una idea suya: arranca de aquí. Y sus criterios de ' +
          'evaluación tampoco los inventa usted, los baja del currículo y los escribe antes de ' +
          'calificar, no después de que le reclamen.',
  },
  {
    num: 'Reglamento', corto: 'PEC y consejos',
    tit: 'El reglamento aterriza la ley en su centro',
    sub: 'Reglamento General, Acuerdo 1358-SE-2014, La Gaceta n.º 33,533 del 17 de septiembre de 2014',
    txt: 'La ley dice qué; el reglamento dice cómo. El Reglamento General manda que cada centro ' +
         'elabore y ponga en práctica su Proyecto Educativo de Centro con la comunidad educativa, ' +
         'precisando los principios y fines del centro, los recursos docentes y didácticos ' +
         'disponibles y necesarios, la estrategia pedagógica, la normativa para docentes y educandos ' +
         'y el sistema de gestión, y exige que sea concreto, factible y evaluable. Los instrumentos ' +
         'de gestión se formulan, ejecutan y evalúan con participación del Consejo de Desarrollo ' +
         'Escolar del centro, el Consejo Distrital y el Consejo Municipal de Desarrollo Educativo. ' +
         'Junto a este reglamento salieron, el mismo día, los de Centros Educativos (1361-SE-2014), ' +
         'Nivel de Educación Básica (1362-SE-2014), Instituciones No Gubernamentales (1363-SE-2014) ' +
         'y Educación en Casa (1367-SE-2014).',
    cita: 'Los instrumentos de gestión, entre ellos el Proyecto Educativo de Centro, se formulan, ' +
          'ejecutan y evalúan con la participación de los consejos de desarrollo educativo.',
    aula: 'Su planificación anual cuelga del Proyecto Educativo de Centro. Pida verlo: si el centro ' +
          'no lo tiene o nadie lo ha evaluado, ese es un incumplimiento del centro, no suyo, y ' +
          'conviene que conste en acta del consejo de docentes.',
  },
];

let _art = 0;
/* La lista va en vertical y el texto se abre DEBAJO del artículo tocado, como
   un acordeón: es el molde que quedó de la primera misión, donde el riel
   horizontal dejaba seis de nueve fichas fuera de la pantalla del teléfono. */
function arPinta() {
  const lista = document.getElementById('arLista');
  if (!lista) return;
  lista.innerHTML = ARTS.map((a, i) => {
    const abierto = i === _art;
    return `
    <div class="ar-item ${abierto ? 'on' : ''} ${S.arts.includes(i) ? 'visto' : ''}" id="arIt${i}">
      <button class="ar-cab" onclick="arVer(${i})" aria-expanded="${abierto}">
        <span class="ar-num">${a.num}</span>
        <span class="ar-tit">${a.corto}</span>
        ${S.arts.includes(i) ? '<span class="ar-visto">✓</span>' : ''}
        <span class="ar-flecha" aria-hidden="true">▾</span>
      </button>
      ${abierto ? `
      <div class="ar-det" id="arDet">
        <h3>${a.num} · ${a.tit}</h3>
        <div class="ar-sub">${a.sub}</div>
        <p>${a.txt}</p>
        <div class="ar-cita">📜 <b>Lo dice así:</b> «${a.cita}»</div>
        <div class="aula">🎯 <b>Qué le deja a su aula:</b> ${a.aula}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}
function arVer(i) {
  _art = i;
  if (!S.arts.includes(i)) { S.arts.push(i); xp(3); }
  arPinta();
  // Que el artículo tocado quede a la vista aunque el texto empuje la lista
  const el = document.getElementById('arIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function arMover(d) { arVer(Math.max(0, Math.min(ARTS.length - 1, _art + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════ */
const FC = [
  ['¿Cuál es la ley que rige hoy la educación hondureña?', 'La ley fundamental de educación, decreto 262-2011, publicada en la gaceta 32,754 del 22 de febrero de 2012.'],
  ['¿Cuántos días de clase tiene el año lectivo, como mínimo?', 'Doscientos días de clase, y el año no puede darse por concluido antes de completarlos. Lo dice el artículo 16.'],
  ['¿Quién informa cada mes cuántos días se trabajaron en un centro?', 'La dirección municipal o distrital de educación, junto con el consejo de desarrollo del centro educativo.'],
  ['¿Qué pasa si no se cumplen los días de clase?', 'Se aplican correctivos y, en su caso, las sanciones que establece el estatuto del docente hondureño.'],
  ['¿Qué dice el artículo 7 sobre el dinero?', 'Que la educación en establecimientos oficiales es gratuita y que se prohíbe exigir aportaciones económicas o en especie por parte de docentes o autoridades educativas.'],
  ['¿Hasta dónde llega la escolaridad obligatoria en Honduras?', 'Desde al menos un año de prebásica hasta terminar la educación media. Es obligación de los padres procurarla, según el artículo 8.'],
  ['¿Cómo está organizada la educación básica?', 'Nueve años en tres ciclos secuenciales y continuos de tres años cada uno, con edades de referencia de seis a catorce años.'],
  ['¿Cuáles son las edades de referencia de la prebásica?', 'Cuatro, cinco y seis años. La prebásica es gratuita y obligatoria.'],
  ['¿Qué edades de referencia cubre la educación media?', 'De quince a diecisiete años, y también es gratuita y obligatoria.'],
  ['¿Qué son las modalidades educativas?', 'Opciones de organización y de currículo del sistema nacional de educación, con principios de integralidad, equidad e inclusión. El artículo 27 enumera siete.'],
  ['¿Qué define el currículo, según el artículo 59?', 'Las competencias, objetivos, contenidos y criterios metodológicos y de evaluación de los aprendizajes que el educando debe alcanzar en cada nivel.'],
  ['¿Qué es el proyecto educativo de centro?', 'El instrumento que cada centro elabora con su comunidad educativa: principios y fines, recursos, estrategia pedagógica, normativa y gestión. Debe ser concreto, factible y evaluable.'],
  ['¿Qué dice el artículo 6 sobre la rendición de cuentas?', 'Que la educación es inversión social pública y que quien la administra rinde cuentas a la nación, sujeto a auditoría social y a la fiscalización del estado.'],
  ['¿Cuál es el reglamento general de esta ley?', 'El acuerdo 1358-SE-2014, publicado en la gaceta 33,533 del 17 de septiembre de 2014.'],
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
  ['Artículo 6', 'Rendición de cuentas y auditoría social'],
  ['Artículo 7', 'Gratuidad: prohibido exigir aportaciones'],
  ['Artículo 8', 'De un año de prebásica hasta la media'],
  ['Artículo 16', 'Año lectivo de doscientos días'],
  ['Artículo 22', 'Básica: nueve años en tres ciclos'],
  ['Artículo 27', 'Las siete modalidades educativas'],
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
   Las respuestas correctas van repartidas a propósito entre las
   cuatro letras (normativa 1-ter: ninguna pasa del 40%). Aquí el
   reparto es a=2, b=2, c=3, d=2 sobre nueve preguntas. */
const QZ = [
  { q: '¿Cuántos días de clase tiene, como mínimo, el año lectivo?',
    o: ['Ciento ochenta días', 'Doscientos días', 'Doscientos veinte días', 'Los que decida cada centro'],
    c: 1, e: 'Artículo 16: al menos doscientos días, y el año no se puede dar por concluido antes de completarlos.' },
  { q: 'Según el artículo 7, ¿qué se prohíbe expresamente?',
    o: ['Que la municipalidad done materiales', 'Que la asociación de padres tenga fondos',
        'Que un centro privado cobre matrícula',
        'Que docentes o autoridades educativas exijan aportaciones económicas o en especie'],
    c: 3, e: 'La educación en establecimientos oficiales es gratuita, y la infracción se sanciona conforme al reglamento respectivo.' },
  { q: 'La escolaridad obligatoria en Honduras abarca…',
    o: ['Desde al menos un año de prebásica hasta la educación media',
        'Solo los nueve grados de la educación básica', 'De primero a sexto grado',
        'Desde prebásica completa hasta la universidad'],
    c: 0, e: 'Artículo 8: es obligación de los padres, madres o tutores procurar que sus hijos la cursen entera.' },
  { q: 'La educación básica, según el artículo 22, consta de…',
    o: ['Seis años en dos ciclos', 'Doce años sin ciclos',
        'Nueve años en tres ciclos secuenciales y continuos', 'Nueve años sin división en ciclos'],
    c: 2, e: 'Tres ciclos de tres años cada uno, con edades de referencia de seis a catorce años.' },
  { q: 'Las edades de referencia de la educación prebásica son…',
    o: ['De tres a cinco años', 'De cuatro, cinco y seis años', 'De cinco a siete años', 'De seis a ocho años'],
    c: 1, e: 'Artículo 21. Y el nivel es gratuito y obligatorio, no una guardería opcional.' },
  { q: '¿Quién debe informar mensualmente sobre los días trabajados en un centro educativo?',
    o: ['El docente de grado, directamente al Congreso Nacional', 'La asociación de padres de familia',
        'El Tribunal Superior de Cuentas',
        'La Dirección Municipal o Distrital junto con el Consejo de Desarrollo del Centro'],
    c: 3, e: 'Lo manda el artículo 16, para que se apliquen correctivos y, en su caso, las sanciones del Estatuto del Docente.' },
  { q: 'El artículo 6 declara que la educación es…',
    o: ['Una inversión social pública sujeta a rendición de cuentas y auditoría social',
        'Un gasto corriente del presupuesto', 'Una donación del Estado a las familias',
        'Un servicio que se cobra según la capacidad de pago'],
    c: 0, e: 'Por eso la auditoría social la ejercen las asociaciones de padres y los consejos de desarrollo educativo.' },
  { q: 'Según el artículo 59, el currículo define…',
    o: ['Solo la lista de contenidos por grado', 'Únicamente el horario semanal de clases',
        'Competencias, objetivos, contenidos y criterios metodológicos y de evaluación',
        'El sueldo y la jornada del docente'],
    c: 2, e: 'Es la normativa básica del sistema: de ahí baja su planificación y de ahí bajan sus criterios de evaluación.' },
  { q: 'El Proyecto Educativo de Centro debe ser, según el Reglamento General…',
    o: ['Elaborado por el director en solitario', 'Redactado por la Dirección Departamental',
        'Concreto, factible y evaluable, elaborado con la comunidad educativa',
        'Renovado únicamente cuando cambia el gobierno'],
    c: 2, e: 'Acuerdo 1358-SE-2014. Y los consejos de desarrollo educativo participan en formularlo, ejecutarlo y evaluarlo.' },
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
  { t: 'Tiempo escolar', it: ['Doscientos días de clase', 'Informe mensual de días trabajados', 'El año no se cierra antes'] },
  { t: 'Estructura y niveles', it: ['Tres ciclos de tres años', 'Edades de referencia', 'Las siete modalidades'] },
  { t: 'Dinero y gratuidad', it: ['Prohibido exigir aportaciones', 'El Estado garantiza el financiamiento', 'Recibo y acta de cada colecta'] },
  { t: 'Cuentas y participación', it: ['Auditoría social', 'Consejo de Desarrollo Escolar', 'Proyecto Educativo de Centro'] },
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
    (bien === _clTodas.length ? 'Todo en su tema. Así se pregunta en el concurso.'
                              : 'Revise las que quedaron fuera de sitio y vuelva a intentarlo.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['El año lectivo consta de, al menos, ____ días de clase.', ['200', 'doscientos']],
  ['La Ley Fundamental de Educación es el Decreto ____.', ['262-2011', '2622011']],
  ['La educación básica tiene nueve años repartidos en ____ ciclos.', ['3', 'tres']],
  ['El artículo ____ prohíbe exigir aportaciones económicas o en especie.', ['7', 'siete']],
  ['El artículo 6 declara que la educación es una inversión ____ pública.', ['social']],
  ['Cada centro elabora con su comunidad el Proyecto ____ de Centro.', ['educativo']],
  ['El Reglamento General de la ley es el Acuerdo ____.', ['1358-se-2014', '1358se2014', '1358']],
  ['El artículo 27 enumera siete ____ del Sistema Nacional de Educación.', ['modalidades', 'modalidades educativas']],
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
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
    (bien === CP.length ? 'Los datos duros los tiene. Esos son los que caen tal cual en la prueba.'
                        : 'Vuelva al recorrido por artículos con las que falló: el número se pega cuando se sabe qué manda.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   Se ordena por número de artículo, y en la ficha aparece el mismo
   ejercicio: es el orden en que se memorizan, porque en un examen la
   pregunta llega por el número, no por el tema. */
const RETO = [
  { t: 'La educación es inversión social pública y se rinde cuentas', o: 6 },
  { t: 'Gratuidad: prohibido exigir aportaciones', o: 7 },
  { t: 'Obligación de los padres: de prebásica a media', o: 8 },
  { t: 'El año lectivo tiene doscientos días', o: 16 },
  { t: 'Prebásica: cuatro, cinco y seis años', o: 21 },
  { t: 'Básica: nueve años en tres ciclos', o: 22 },
  { t: 'Media: de quince a diecisiete años', o: 23 },
  { t: 'Las siete modalidades educativas', o: 27 },
  { t: 'El currículo, normativa básica del sistema', o: 59 },
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
  l.innerHTML = _retoOrden.map((it, i) => `<div class="reto-it sel">${i + 1}. Art. ${it.o} · ${it.t}</div>`).join('')
    + _retoPend.map((it, i) => `<button class="reto-it" onclick="retoToca(${i})">${it.t}</button>`).join('');
}
function retoToca(i) {
  const it = _retoPend[i];
  const menor = Math.min(..._retoPend.map(x => x.o));
  if (it.o !== menor) {
    clearInterval(_retoTimer);
    retoFin(false, 'Ese no era el artículo más bajo de los que quedaban.');
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
    ? `<span class="resu-num">¡Listo!</span>Ordenó los nueve artículos con ${_retoSeg} segundos de sobra.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['GRATUIDAD', 'LECTIVO', 'CURRICULO', 'MODALIDAD', 'CONSEJO', 'GACETA', 'CICLOS', 'ACUERDO'];
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
  { q: 'La ley que rige hoy la estructura del sistema educativo hondureño es:',
    o: ['La Ley Orgánica de Educación de 1966', 'El Código de Instrucción Pública de 1882',
        'La Ley Fundamental de Educación, Decreto 262-2011', 'La Ley de Educación Superior'], c: 2 },
  { q: 'El año lectivo, conforme a la Ley Fundamental de Educación, consta de al menos:',
    o: ['Doscientos días de clase', 'Ciento ochenta días de clase',
        'Diez meses corridos', 'Los días que fije cada Dirección Departamental'], c: 0 },
  { q: 'El año lectivo puede darse por concluido:',
    o: ['Cuando lo decida el consejo de docentes', 'Al terminar el mes de octubre',
        'Cuando el centro haya cubierto el currículo', 'Solo hasta completar el número de días establecidos'], c: 3 },
  { q: 'La obligación de informar mensualmente sobre los días trabajados en el centro recae en:',
    o: ['El docente de grado', 'La Dirección Municipal o Distrital junto con el Consejo de Desarrollo del Centro',
        'La asociación de padres de familia', 'El Tribunal Superior de Cuentas'], c: 1 },
  { q: 'El incumplimiento de los días de clase da lugar a correctivos y sanciones conforme al:',
    o: ['Estatuto del Docente Hondureño', 'Código de la Niñez y la Adolescencia',
        'Reglamento de Educación en Casa', 'Código Penal'], c: 0 },
  { q: 'La educación que se ofrece en los establecimientos oficiales es:',
    o: ['Gratuita solo en el primer ciclo', 'Gratuita salvo la matrícula',
        'De costo compartido con la familia', 'Gratuita, y el Estado garantiza su financiamiento'], c: 3 },
  { q: 'La Ley Fundamental de Educación prohíbe expresamente:',
    o: ['Que las municipalidades apoyen a los centros', 'Que existan centros no gubernamentales',
        'Exigir aportaciones económicas o en especie por parte de docentes o autoridades educativas',
        'Que los padres participen en la gestión del centro'], c: 2 },
  { q: 'La escolaridad obligatoria en Honduras comprende:',
    o: ['Solo la educación básica', 'Desde al menos un año de prebásica hasta la educación media',
        'De primero a sexto grado', 'Desde prebásica hasta el nivel superior'], c: 1 },
  { q: 'Procurar que los hijos cursen la escolaridad obligatoria es deber de:',
    o: ['Los padres, madres o tutores', 'El docente de grado',
        'La municipalidad', 'La asociación de padres de familia'], c: 0 },
  { q: 'La educación prebásica, según la ley vigente, es:',
    o: ['Voluntaria y de pago', 'Obligatoria solo en las ciudades',
        'Gratuita y obligatoria', 'Un servicio que ofrece cada centro si tiene cupo'], c: 2 },
  { q: 'Las edades de referencia de la educación prebásica son:',
    o: ['De tres a cinco años', 'De cinco a siete años', 'De seis a ocho años', 'Cuatro, cinco y seis años'], c: 3 },
  { q: 'La educación básica consta de:',
    o: ['Seis años', 'Nueve años en tres ciclos de tres años cada uno',
        'Doce años en cuatro ciclos', 'Nueve años sin división en ciclos'], c: 1 },
  { q: 'Las edades de referencia de la educación básica van:',
    o: ['De seis a catorce años', 'De siete a doce años', 'De cinco a quince años', 'De seis a doce años'], c: 0 },
  { q: 'La educación media, conforme a la ley vigente:',
    o: ['Es optativa', 'Solo es gratuita en centros oficiales del área urbana',
        'Es gratuita y obligatoria, con edades de referencia de quince a diecisiete años',
        'Depende de la Universidad Nacional Autónoma de Honduras'], c: 2 },
  { q: 'Las modalidades educativas se definen como:',
    o: ['Los turnos en que funciona un centro educativo', 'Las asignaturas optativas del currículo',
        'Los métodos de enseñanza aprobados por la Secretaría',
        'Opciones de organización y currículo del Sistema Nacional de Educación'], c: 3 },
  { q: 'La educación en casa, dentro del sistema hondureño, es:',
    o: ['Una práctica prohibida', 'Una de las modalidades enumeradas en el artículo 27',
        'Un permiso que otorga cada director', 'Una figura reservada a extranjeros'], c: 1 },
  { q: 'El currículo, como normativa básica del Sistema Nacional de Educación, define:',
    o: ['Competencias, objetivos, contenidos y criterios metodológicos y de evaluación',
        'Únicamente la lista de contenidos por grado', 'El calendario de vacaciones',
        'La jornada laboral y el salario del docente'], c: 0 },
  { q: 'El instrumento que cada centro elabora con su comunidad educativa y debe ser concreto, factible y evaluable es:',
    o: ['El acta de inventario', 'El informe de matrícula',
        'El Proyecto Educativo de Centro', 'El plan de emergencia'], c: 2 },
  { q: 'La rendición de cuentas y la auditoría social en educación se fundan en que la ley declara la educación:',
    o: ['Un servicio delegable al sector privado', 'Un gasto corriente del presupuesto nacional',
        'Una obligación exclusiva de la familia', 'Una inversión social pública'], c: 3 },
  { q: 'El Reglamento General de la Ley Fundamental de Educación corresponde al:',
    o: ['Acuerdo 0760-SE-99', 'Acuerdo 1358-SE-2014', 'Acuerdo 0401-SE-2019', 'Acuerdo 1367-SE-2014'], c: 1 },
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
  ['📜 Recorrió los artículos', () => S.arts.length === ARTS.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los datos', () => !!S.completa],
  ['⏱️ Ordenó a tiempo', () => !!S.reto],
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
  ['sec-articulos', '📜 Artículos'],
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
  S = { xp: 0, arts: [], fcVistas: [], nombre: '', sonido: son,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
        casos: 0, concursoNota: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _art = 0; _fc = 0; _qzResp = [];
  arPinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); cnInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  arPinta();
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
