/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · Dos siglos de leyes educativas en Honduras

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   FUENTES: cada fecha, número de decreto y número de La Gaceta que
   aparece aquí se verificó contra el documento oficial o su ficha
   en un portal del Estado (se.gob.hn, tsc.gob.hn, La Gaceta) en
   agosto de 2026. Si alguien corrige un dato, que corrija también
   la ficha imprimible: las dos se estudian juntas.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_HISTLEYES_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, hitos: [], fcVistas: [], nombre: '', sonido: 1,
  memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
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
   LOS NUEVE HITOS
   Cada uno trae: qué pasó, en qué documento consta y qué le dejó
   al aula de hoy. Ese tercer campo es el que convierte una fecha
   suelta en algo que el maestro usa el lunes.
══════════════════════════════════════════════════════════════ */
const HITOS = [
  {
    anio: '1821', corto: 'Independencia',
    tit: 'Nace el país, no la escuela pública',
    sub: '15 de septiembre de 1821',
    txt: 'Honduras se independiza con una población casi toda analfabeta y sin sistema escolar. ' +
         'Enseñar era asunto de quien pudiera pagarlo: el cabildo del pueblo, la parroquia o el ' +
         'padre de familia que contrataba a un preceptor. Las primeras constituciones de la joven ' +
         'república ya declaran que la instrucción pública importa, pero no hay rentas, ni maestros ' +
         'formados, ni edificios para cumplirlo. Durante medio siglo la escuela vive de la ' +
         'voluntad local y de la Iglesia.',
    doc: 'Constituciones y decretos de la república temprana.',
    aula: 'Es el punto de partida: en Honduras la escuela pública no vino con la independencia, ' +
          'llegó sesenta años después. Por eso el sistema es más joven de lo que se cree.',
  },
  {
    anio: '1882', corto: 'Código de Instrucción',
    tit: 'La Reforma Liberal funda la escuela pública',
    sub: 'Código de Instrucción Pública, vigente desde el 12 de febrero de 1882',
    txt: 'Con Marco Aurelio Soto en la presidencia y Ramón Rosa como ministro, la Reforma Liberal ' +
         'le quita la escuela a la costumbre y se la entrega al Estado. El Código de Instrucción ' +
         'Pública declara la enseñanza primaria gratuita, obligatoria y laica, reorganiza la ' +
         'universidad con criterio positivista y crea las escuelas normales para formar maestros ' +
         'hondureños. Llegan además docentes cubanos, guatemaltecos y mexicanos a levantar el ' +
         'sistema. Es el acta de nacimiento de la escuela pública hondureña.',
    doc: 'Código de Instrucción Pública de 1882.',
    aula: 'Los tres adjetivos que aprendió en la normal (gratuita, obligatoria y laica) no son ' +
          'de ahora: tienen más de ciento cuarenta años y siguen escritos en la Constitución.',
  },
  {
    anio: '1957', corto: 'Reforma de medio siglo',
    tit: 'Formar al maestro se vuelve política de Estado',
    sub: 'Autonomía de la UNAH y Escuela Superior del Profesorado',
    txt: 'A mediados del siglo XX el país crece y la escuela no alcanza. En 1957 la Universidad ' +
         'Nacional Autónoma de Honduras obtiene su autonomía y nace, con apoyo de la UNESCO, la ' +
         'Escuela Superior del Profesorado Francisco Morazán para formar, profesionalizar y ' +
         'actualizar a los docentes del sistema; en 1989 se convertirá en la Universidad ' +
         'Pedagógica Nacional Francisco Morazán. Se construyen escuelas y se amplía la matrícula.',
    doc: 'Reformas educativas del período y creación de la Escuela Superior del Profesorado.',
    aula: 'Ese es el origen de que hoy se le exija título docente y actualización permanente: ' +
          'el país decidió, hace casi setenta años, que enseñar es una profesión y no un oficio.',
  },
  {
    anio: '1966', corto: 'Ley Orgánica',
    tit: 'El sistema se ordena por niveles',
    sub: 'Ley Orgánica de Educación, Decreto 79 del 14 de noviembre de 1966',
    txt: 'La Ley Orgánica de Educación pone por primera vez todo el sistema en un solo cuerpo ' +
         'legal y lo divide en niveles: preescolar, primario, medio y magisterial. Rige la vida ' +
         'escolar hondureña durante cuarenta y seis años, hasta 2012. De ahí vienen las palabras ' +
         'que todavía se oyen en los centros: «primaria», «ciclo común», «educación magisterial».',
    doc: 'Decreto 79 del 14 de noviembre de 1966.',
    aula: 'Cuando un colega dice «primaria» está hablando en el idioma de esta ley, derogada ' +
          'hace más de una década. En documentos oficiales hoy se escribe «educación básica».',
  },
  {
    anio: '1982', corto: 'Constitución',
    tit: 'La educación entra en la Constitución vigente',
    sub: 'Constitución de la República, título sobre educación y cultura',
    txt: 'La Constitución que nos rige declara en su artículo 151 que «la educación es función ' +
         'esencial del Estado para la conservación, el fomento y difusión de la cultura, la cual ' +
         'deberá proyectar sus beneficios a la sociedad sin discriminación de ninguna naturaleza», ' +
         'y añade que la educación nacional será laica. El artículo 152 reconoce a los padres el ' +
         'derecho preferente a escoger el tipo de educación de sus hijos, y el artículo 160 le ' +
         'atribuye a la UNAH organizar y dirigir la educación superior.',
    doc: 'Constitución de la República de 1982, artículos 151 y siguientes.',
    aula: 'Toda ley educativa posterior cuelga de aquí. Si una norma menor contradice estos ' +
          'artículos, manda la Constitución: es el argumento más fuerte que usted puede usar.',
  },
  {
    anio: '1989', corto: 'Educación superior',
    tit: 'La universidad se separa del resto del sistema',
    sub: 'Ley de Educación Superior, Decreto 142-89 del 14 de septiembre de 1989',
    txt: 'La Ley de Educación Superior desarrolla el mandato constitucional y deja el nivel ' +
         'superior fuera de la Secretaría de Educación: le corresponde a la UNAH organizarlo, ' +
         'dirigirlo y desarrollarlo. Se publicó en La Gaceta n.º 25,961 del 17 de octubre de 1989. ' +
         'Desde entonces el sistema hondureño tiene dos mundos con reglas distintas.',
    doc: 'Decreto 142-89, Ley de Educación Superior.',
    aula: 'Por eso su título universitario se rige por normas que no salen de la Secretaría de ' +
          'Educación, y los trámites de equivalencias van por otra ventanilla.',
  },
  {
    anio: '1996', corto: 'Código de la Niñez',
    tit: 'El alumno pasa a ser sujeto de derechos',
    sub: 'Código de la Niñez y la Adolescencia, Decreto 73-96',
    txt: 'El Código de la Niñez y la Adolescencia traslada a la ley hondureña la Convención sobre ' +
         'los Derechos del Niño: la niñez deja de ser objeto de protección y pasa a ser sujeto de ' +
         'derechos. Cambia lo que puede hacerse dentro de un aula, sobre todo en disciplina, ' +
         'castigo, protección y denuncia del maltrato.',
    doc: 'Decreto 73-96, Código de la Niñez y la Adolescencia.',
    aula: 'Es la norma que respalda la disciplina sin castigo físico ni humillación, y la que ' +
          'obliga a actuar ante una sospecha de maltrato en lugar de mirar a otro lado.',
  },
  {
    anio: '1997', corto: 'Estatuto del Docente',
    tit: 'Enseñar se vuelve una carrera con derechos',
    sub: 'Estatuto del Docente Hondureño, Decreto 136-97 del 11 de septiembre de 1997',
    txt: 'El Estatuto del Docente Hondureño ordena la carrera: ingreso por concurso, escalafón, ' +
         'traslados, permisos, licencias, estabilidad y régimen disciplinario. Su Reglamento ' +
         'General (Acuerdo 0760-SE-99) detalla los procedimientos y las juntas de selección que ' +
         'identifican y designan a quien ocupará cada plaza vacante en el nivel municipal, ' +
         'departamental o nacional. El concurso comprende pruebas de aptitud y conocimientos, ' +
         'clasificación de méritos, prueba psicométrica con investigación de antecedentes y ' +
         'clasificación de credenciales; los resultados se suman y el promedio final no puede ' +
         'bajar de setenta y cinco por ciento.',
    doc: 'Decreto 136-97 y Acuerdo 0760-SE-99.',
    aula: 'Es su ley. La plaza, el traslado y el permiso no se piden como favor: se tramitan por ' +
          'un procedimiento escrito, con requisitos y plazos que usted puede citar.',
  },
  {
    anio: '2012', corto: 'Ley Fundamental',
    tit: 'La ley que rige su aula hoy',
    sub: 'Ley Fundamental de Educación, Decreto 262-2011, La Gaceta n.º 32,754 del 22 de febrero de 2012',
    txt: 'La Ley Fundamental de Educación sustituye a la Ley Orgánica de 1966 (que queda derogada ' +
         'salvo unos capítulos sobre bibliotecas, archivos nacionales y monumentos) y rearma el ' +
         'sistema: educación prebásica, educación básica de nueve grados en tres ciclos y ' +
         'educación media, con varias modalidades enumeradas en el artículo 27, entre ellas la ' +
         'educación intercultural bilingüe, la educación de jóvenes y adultos, la especial e ' +
         'inclusiva y la educación en casa. El artículo 8 obliga a los padres a procurar que sus ' +
         'hijos cursen desde un año de prebásica hasta la media. En 2014 salieron sus reglamentos, ' +
         'encabezados por el Reglamento General (Acuerdo 1358-SE-2014, La Gaceta n.º 33,533 del 17 ' +
         'de septiembre de 2014). En 2019 se sumó el Código de Ética para el Docente ' +
         '(Acuerdo 0401-SE-2019).',
    doc: 'Decreto 262-2011 y sus reglamentos de 2014.',
    aula: 'Todo lo que usted hace en el año escolar (matrícula, ciclos, evaluación, actas, ' +
          'consejo de docentes, participación de padres) sale de aquí o de sus reglamentos.',
  },
];

let _hito = 0;
/* La lista va en vertical y el detalle se abre DEBAJO del año tocado, como un
   acordeón. Antes era un riel horizontal con el detalle aparte: en el teléfono
   se veían tres años, los otros seis quedaban fuera de la pantalla y el detalle
   aparecía lejos de lo que se había tocado. */
function tlPinta() {
  const lista = document.getElementById('tlLista');
  if (!lista) return;
  lista.innerHTML = HITOS.map((h, i) => {
    const abierto = i === _hito;
    return `
    <div class="tl-item ${abierto ? 'on' : ''} ${S.hitos.includes(i) ? 'visto' : ''}" id="tlIt${i}">
      <button class="tl-cab" onclick="tlVer(${i})" aria-expanded="${abierto}">
        <span class="tl-anio">${h.anio}</span>
        <span class="tl-tit">${h.corto}</span>
        ${S.hitos.includes(i) ? '<span class="tl-visto">✓</span>' : ''}
        <span class="tl-flecha" aria-hidden="true">▾</span>
      </button>
      ${abierto ? `
      <div class="tl-det" id="tlDet">
        <h3>${h.anio} · ${h.tit}</h3>
        <div class="tl-sub">${h.sub}</div>
        <p>${h.txt}</p>
        <div class="dato">📜 <b>Dónde consta:</b> ${h.doc}</div>
        <div class="aula">🎯 <b>Qué le deja a su aula:</b> ${h.aula}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}
function tlVer(i) {
  _hito = i;
  if (!S.hitos.includes(i)) { S.hitos.push(i); xp(3); }
  tlPinta();
  // Que el año tocado quede a la vista aunque el detalle empuje la lista
  const el = document.getElementById('tlIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function tlMover(d) { tlVer(Math.max(0, Math.min(HITOS.length - 1, _hito + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════
   NOMBRES PROPIOS CON MAYÚSCULA, aquí también (normativa de la casa).
   Estas tarjetas salieron escritas en minúscula («marco aurelio soto»,
   «la unah», «la ley fundamental de educación») y así se le mostraron a
   un maestro. Es material que circula entre colegas y en preparación de
   concursos: una minúscula en el nombre de una ley o de una persona le
   quita autoridad a todo lo demás, por bien verificado que esté. */
const FC = [
  ['¿En qué año se independiza Honduras?', 'El 15 de septiembre de 1821, con una población casi toda analfabeta y sin sistema escolar público.'],
  ['¿Qué documento funda la escuela pública hondureña?', 'El Código de Instrucción Pública de 1882, vigente desde el 12 de febrero de ese año, durante la Reforma Liberal.'],
  ['¿Quiénes impulsaron la Reforma Liberal en la educación?', 'El presidente Marco Aurelio Soto y su ministro Ramón Rosa.'],
  ['¿Qué tres características declaró el Código de 1882 para la enseñanza primaria?', 'Gratuita, obligatoria y laica.'],
  ['¿Para qué se crearon las escuelas normales?', 'Para formar maestros hondureños en vez de depender de preceptores sin título o de docentes traídos de otros países.'],
  ['¿Qué pasó en 1957 con la formación docente?', 'La UNAH obtuvo su autonomía y nació la Escuela Superior del Profesorado Francisco Morazán, con apoyo de la UNESCO.'],
  ['¿Qué ley ordenó el sistema educativo en 1966?', 'La Ley Orgánica de Educación, Decreto 79 del 14 de noviembre de 1966, que rigió cuarenta y seis años.'],
  ['¿Qué dice el artículo 151 de la Constitución?', 'Que la educación es función esencial del Estado para la conservación, el fomento y difusión de la cultura, sin discriminación de ninguna naturaleza.'],
  ['¿Qué reconoce el artículo 152 de la Constitución?', 'El derecho preferente de los padres a escoger el tipo de educación que darán a sus hijos.'],
  ['¿Qué ley rige la educación superior?', 'La Ley de Educación Superior, Decreto 142-89 de 1989: el nivel superior no depende de la Secretaría de Educación.'],
  ['¿Qué cambió el Código de la Niñez y la Adolescencia de 1996?', 'Que el niño pasó de ser objeto de protección a ser sujeto de derechos, con efectos directos en disciplina y protección escolar.'],
  ['¿Qué ordena el Estatuto del Docente Hondureño de 1997?', 'La carrera docente: ingreso por concurso, escalafón, traslados, permisos, licencias, estabilidad y régimen disciplinario.'],
  ['¿Qué promedio mínimo exige el concurso docente?', 'Setenta y cinco por ciento, sumando pruebas de conocimientos, méritos, prueba psicométrica y credenciales.'],
  ['¿Cuál es la ley educativa vigente y desde cuándo?', 'La Ley Fundamental de Educación, Decreto 262-2011, publicada en La Gaceta n.º 32,754 del 22 de febrero de 2012.'],
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
  ['1882', 'Código de Instrucción Pública'],
  ['1966', 'Ley Orgánica de Educación'],
  ['1982', 'Constitución vigente'],
  ['1989', 'Ley de Educación Superior'],
  ['1997', 'Estatuto del Docente'],
  ['2012', 'Ley Fundamental de Educación'],
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
  { q: '¿Qué había en Honduras en materia de escuela pública el día de la independencia, en 1821?',
    o: ['Casi nada: la enseñanza dependía del cabildo, la parroquia o el bolsillo familiar',
        'Un sistema nacional de escuelas primarias gratuitas',
        'Escuelas normales en cada departamento',
        'Un ministerio de educación con presupuesto propio'],
    c: 0, e: 'La escuela pública hondureña se funda sesenta años después, con la Reforma Liberal.' },
  { q: 'El Código de Instrucción Pública de 1882 declaró la enseñanza primaria…',
    o: ['Voluntaria y religiosa', 'Pagada y universitaria',
        'Gratuita, obligatoria y laica', 'Solo para varones de la cabecera'],
    c: 2, e: 'Esos tres adjetivos siguen vivos: la Constitución de 1982 repite que la educación nacional será laica.' },
  { q: '¿Quién fue el ministro que dio forma a la reforma educativa liberal?',
    o: ['José Cecilio del Valle', 'Ramón Rosa', 'Francisco Morazán', 'Dionisio de Herrera'],
    c: 1, e: 'Ramón Rosa, con Marco Aurelio Soto en la presidencia, impulsó el Código de Instrucción Pública de 1882.' },
  { q: '¿Cuántos años rigió la Ley Orgánica de Educación de 1966?',
    o: ['Diez años', 'Veinte años', 'Treinta años', 'Cuarenta y seis años, hasta 2012'],
    c: 3, e: 'De 1966 a 2012. Por eso su vocabulario («primaria», «ciclo común») todavía se oye en los centros.' },
  { q: 'Según el artículo 151 de la Constitución, la educación es…',
    o: ['Un servicio que el Estado puede delegar por completo', 'Una obligación exclusiva de la familia',
        'Función esencial del Estado', 'Competencia de cada municipalidad'],
    c: 2, e: 'Función esencial del Estado, y sus beneficios se proyectan a la sociedad sin discriminación de ninguna naturaleza.' },
  { q: 'El artículo 152 de la Constitución reconoce a los padres…',
    o: ['El derecho preferente a escoger el tipo de educación de sus hijos',
        'La obligación de pagar la matrícula', 'El derecho a nombrar al maestro de grado',
        'La facultad de aprobar las notas'],
    c: 0, e: 'De ese artículo cuelga, entre otras cosas, la modalidad de educación en casa.' },
  { q: '¿Qué norma ordena la carrera docente: concurso, escalafón, traslados y permisos?',
    o: ['La Ley Fundamental de Educación', 'El Código de la Niñez y la Adolescencia',
        'La Ley de Educación Superior', 'El Estatuto del Docente Hondureño'],
    c: 3, e: 'Decreto 136-97, con su Reglamento General (Acuerdo 0760-SE-99).' },
  { q: '¿Qué ley rige hoy la estructura del sistema educativo hondureño?',
    o: ['La Ley Orgánica de Educación de 1966', 'La Ley Fundamental de Educación de 2012',
        'El Código de Instrucción Pública de 1882', 'La Ley de Educación Superior de 1989'],
    c: 1, e: 'Decreto 262-2011, publicado en La Gaceta n.º 32,754 del 22 de febrero de 2012.' },
  { q: 'Bajo la ley vigente, la educación básica se organiza en…',
    o: ['Seis grados en dos ciclos', 'Doce grados sin ciclos',
        'Nueve grados en tres ciclos', 'Cuatro grados y un ciclo común'],
    c: 2, e: 'Tres ciclos de tres grados cada uno. En documentos oficiales se escribe «educación básica», no «primaria».' },
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
  { t: 'Siglo XIX (Reforma Liberal)', it: ['Código de Instrucción Pública', 'Marco Aurelio Soto', 'Primeras escuelas normales'] },
  { t: 'Mediados del siglo XX', it: ['Ley Orgánica de Educación', 'Escuela Superior del Profesorado', 'Autonomía de la UNAH'] },
  { t: 'Retorno democrático (1982-1997)', it: ['Constitución vigente', 'Ley de Educación Superior', 'Estatuto del Docente'] },
  { t: 'Siglo XXI', it: ['Ley Fundamental de Educación', 'Reglamento General de 2014', 'Código de Ética del Docente'] },
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
    (bien === _clTodas.length ? 'Todo en su época. Así se pregunta en el concurso.'
                              : 'Revise las que quedaron fuera de sitio y vuelva a intentarlo.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['El Código de Instrucción Pública entró en vigor en el año ____.', ['1882']],
  ['La Ley Orgánica de Educación es el Decreto ____ de 1966.', ['79']],
  ['La Constitución vigente de Honduras es del año ____.', ['1982']],
  ['El Estatuto del Docente Hondureño es el Decreto ____.', ['136-97', '13697']],
  ['La Ley Fundamental de Educación es el Decreto ____.', ['262-2011', '2622011']],
  ['La educación básica tiene nueve grados repartidos en ____ ciclos.', ['3', 'tres']],
  ['El promedio mínimo para ganar un concurso docente es ____ por ciento.', ['75', 'setenta y cinco']],
  ['El artículo 151 dice que la educación es función ____ del Estado.', ['esencial']],
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
                        : 'Vuelva a la línea de tiempo por las que falló: se memorizan mejor con su historia.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════ */
const RETO = [
  { t: 'Independencia de Honduras', o: 1821 },
  { t: 'Código de Instrucción Pública', o: 1882 },
  { t: 'Autonomía de la UNAH', o: 1957 },
  { t: 'Ley Orgánica de Educación', o: 1966 },
  { t: 'Constitución vigente', o: 1982 },
  { t: 'Ley de Educación Superior', o: 1989 },
  { t: 'Código de la Niñez y la Adolescencia', o: 1996 },
  { t: 'Estatuto del Docente Hondureño', o: 1997 },
  { t: 'Ley Fundamental de Educación', o: 2012 },
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
  l.innerHTML = _retoOrden.map((it, i) => `<div class="reto-it sel">${i + 1}. ${it.t} (${it.o})</div>`).join('')
    + _retoPend.map((it, i) => `<button class="reto-it" onclick="retoToca(${i})">${it.t}</button>`).join('');
}
function retoToca(i) {
  const it = _retoPend[i];
  const menor = Math.min(..._retoPend.map(x => x.o));
  if (it.o !== menor) {
    clearInterval(_retoTimer);
    retoFin(false, 'Ese no era el más antiguo de los que quedaban.');
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
    ? `<span class="resu-num">¡Listo!</span>Ordenó los nueve hitos con ${_retoSeg} segundos de sobra.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['ESTATUTO', 'GACETA', 'CONCURSO', 'REFORMA', 'DECRETO', 'CICLO', 'BASICA', 'LAICA'];
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
  { q: 'La escuela pública hondureña se funda con:',
    o: ['El Código de Instrucción Pública de 1882', 'La independencia de 1821',
        'La Ley Orgánica de 1966', 'La Constitución de 1982'], c: 0 },
  { q: 'El Código de Instrucción Pública fue obra del gobierno de:',
    o: ['Francisco Morazán', 'Tiburcio Carías Andino', 'Marco Aurelio Soto', 'Ramón Villeda Morales'], c: 2 },
  { q: 'Las escuelas normales se crearon para:',
    o: ['Enseñar oficios a los adultos', 'Formar maestros hondureños titulados',
        'Sustituir a la universidad', 'Atender solo a la población rural'], c: 1 },
  { q: 'La Ley Orgánica de Educación corresponde al:',
    o: ['Decreto 136-97', 'Decreto 262-2011', 'Decreto 142-89', 'Decreto 79 de 1966'], c: 3 },
  { q: 'La Constitución de la República vigente en Honduras data de:',
    o: ['1957', '1965', '1982', '2012'], c: 2 },
  { q: 'Según el artículo 151 constitucional, la educación nacional será además:',
    o: ['Laica', 'Confesional', 'Optativa', 'Exclusivamente técnica'], c: 0 },
  { q: 'El derecho preferente de los padres a escoger el tipo de educación de sus hijos está en:',
    o: ['El Estatuto del Docente', 'La Ley de Educación Superior',
        'El Reglamento General de 2014', 'El artículo 152 de la Constitución'], c: 3 },
  { q: 'La educación superior en Honduras se rige por:',
    o: ['La Ley Fundamental de Educación', 'La Ley de Educación Superior, Decreto 142-89',
        'La Ley Orgánica de 1966', 'El Estatuto del Docente'], c: 1 },
  { q: 'El Código de la Niñez y la Adolescencia (Decreto 73-96) establece que el niño es:',
    o: ['Sujeto de derechos', 'Objeto de tutela del centro',
        'Responsabilidad exclusiva del docente', 'Menor sin capacidad de opinión'], c: 0 },
  { q: 'El ingreso a la carrera docente por concurso está ordenado en:',
    o: ['La Constitución de 1957', 'El Código de Ética del Docente',
        'El Estatuto del Docente Hondureño', 'El Reglamento de Educación en Casa'], c: 2 },
  { q: 'Las juntas de selección docente funcionan en el nivel:',
    o: ['Solo nacional', 'Solo departamental', 'Solo del centro educativo',
        'Municipal, departamental y nacional'], c: 3 },
  { q: 'El promedio final mínimo para aprobar el concurso docente es:',
    o: ['60%', '75%', '80%', '90%'], c: 1 },
  { q: 'El concurso docente comprende, entre otros componentes:',
    o: ['Solo la entrevista con el director', 'Solo la antigüedad en el servicio',
        'Pruebas de conocimientos, méritos, prueba psicométrica y credenciales',
        'Un sorteo entre los inscritos'], c: 2 },
  { q: 'La Ley Fundamental de Educación corresponde al:',
    o: ['Decreto 262-2011', 'Decreto 79-66', 'Decreto 73-96', 'Decreto 136-97'], c: 0 },
  { q: 'La Ley Fundamental de Educación se publicó en La Gaceta el:',
    o: ['14 de noviembre de 1966', '22 de febrero de 2012',
        '11 de septiembre de 1997', '17 de septiembre de 2014'], c: 1 },
  { q: 'Bajo la ley vigente, la educación básica comprende:',
    o: ['Seis grados', 'Siete grados', 'Ocho grados', 'Nueve grados en tres ciclos'], c: 3 },
  { q: 'La educación en casa, dentro del sistema hondureño, es:',
    o: ['Una modalidad reconocida por la Ley Fundamental de Educación', 'Una práctica prohibida',
        'Un permiso que da cada director', 'Una figura solo para extranjeros'], c: 0 },
  { q: 'El Reglamento General de la Ley Fundamental de Educación es el:',
    o: ['Acuerdo 0760-SE-99', 'Acuerdo 0401-SE-2019', 'Acuerdo 1358-SE-2014', 'Acuerdo 1367-SE-2014'], c: 2 },
  { q: 'De la Ley Orgánica de 1966, tras la ley de 2012, quedaron vigentes capítulos sobre:',
    o: ['Evaluación de los aprendizajes', 'Carrera docente',
        'Educación prebásica', 'Bibliotecas, archivos nacionales y monumentos'], c: 3 },
  { q: 'En un documento oficial de hoy, el nivel que antes se llamaba «primaria» se escribe:',
    o: ['Ciclo común', 'Educación básica', 'Educación elemental', 'Instrucción primaria'], c: 1 },
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
  ['🕰️ Recorrió la historia', () => S.hitos.length === HITOS.length],
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
  ['sec-linea', '🕰️ Historia'],
  ['sec-aprende', '🧭 Aprende'],
  ['sec-tarjetas', '🃏 Tarjetas'],
  ['sec-quiz', '❓ Quiz'],
  ['sec-clasifica', '🗂️ Épocas'],
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
  const tema = S.sonido;
  S = { xp: 0, hitos: [], fcVistas: [], nombre: '', sonido: tema,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _hito = 0; _fc = 0; _qzResp = [];
  tlPinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); cnInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  tlPinta();
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
