/* ═══════════════════════════════════════════════════════════════
   🎓 MISIONES DEL MAESTRO · formación y actualización docente

   Las misiones del catálogo son para el ALUMNO. Estas son otra cosa:
   son para el maestro que se registra, y nadie más las ve (viven
   dentro de «Herramientas del aula», que se oculta sin sesión, y
   además vuelven a comprobar la cuenta al abrirse).

   QUÉ SE MUESTRA: el TEMARIO COMPLETO, con las misiones que ya se
   pueden abrir y las que vienen. Las que faltan salen marcadas
   «Pronto» y eso se queda así a propósito (decisión del autor): le
   sirve de plan de trabajo a la vista, y al maestro le dice qué viene,
   así vuelve a mirar. Ningún tema promete nada que no vaya a existir.

   ► Para publicar una misión: agregarle
     `url: 'misiones/…/archivo.html'` a ese tema. La tarjeta pasa sola
     de «Pronto» a un botón que abre la misión.

   ► Las áreas están amarradas a las herramientas del aula
     (`herramienta`): así el maestro entiende que la formación no es
     teoría suelta, sino lo que necesita para usar mejor lo que ya
     tiene en la mano. Las dos que pidió el usuario (estrategias y
     leyes educativas) van de primeras. */

const MF_AREAS = [
  /* Va PRIMERA a propósito, antes que las leyes. Las misiones de leyes le dicen
     al maestro qué le exige la norma; esta le enseña la herramienta con la que
     va a cumplirla, y sin eso el resto se queda en teoría. Además resuelve un
     problema real de adopción: el maestro promedio conoce UNA pieza de
     M.E.T.A.S (la misión que le llegó por WhatsApp) y no sabe que existe todo
     lo demás. La propuesta completa, con los argumentos y las advertencias de
     verificación, está en PROPUESTA-MISIONES-METAS-2026.md. */
  {
    k: 'metas',
    chip: '🚀 Dominar M.E.T.A.S',
    titulo: 'Su plataforma, de punta a punta',
    intro: 'No es un curso de botones: es cuántas horas recupera, con qué decide y con qué se ' +
           'respalda. Lo que casi nadie sabe es que M.E.T.A.S no son las misiones: son cuatro ' +
           'piezas que se alimentan entre sí, y el dato se escribe una sola vez.',
    herramienta: 'Todas: Mi aula · Plan de Acción · Evaluaciones · Asistente de padres · Evidencia',
    temas: [
      { t: 'Bienvenido: qué es M.E.T.A.S y por qué existe',
        s: 'El ecosistema completo en un mapa: las misiones del alumno, las herramientas de su aula, el asistente de las familias y su propia formación. Con lo que cada pieza NO hace, y ficha de estudio de diez páginas.',
        url: 'misiones/docente-bienvenida-metas/bienvenida-metas.html' },
      { t: 'M.E.T.A.S y SACE: qué hace cada uno',
        s: 'SACE guarda la nota oficial; aquí es donde esa nota se gana, se sustenta y se explica. La frontera momento por momento del año, para que no haga dos veces el mismo trabajo ni deje sin hacer el obligatorio. Con ficha de estudio de diez páginas.',
        url: 'misiones/docente-metas-sace/metas-sace.html' },
      { t: 'El código de aula: cómo el trabajo del alumno le llega solo',
        s: 'Cinco letras en la pizarra y el avance de sus alumnos aparece en su cuenta. Sin cuentas ni contraseñas para ellos, y sin que usted escriba un nombre dos veces.' },
      { t: 'Decidir con datos, no con impresiones',
        s: 'Del «el grupo va mal» al «siete alumnos en Debe Mejorar por el mismo contenido». El Plan de Acción, el análisis de la prueba y la asistencia que avisa antes de la deserción.' },
      { t: 'El asistente de padres: la clave que baja los reclamos',
        s: 'Qué ve la familia con su clave y qué no ve. El padre deja de preguntar cómo va su hijo porque ya lo sabe, y usted recupera la reunión de padres.' },
      { t: 'El papeleo que se hace solo',
        s: 'Una sola lista alimenta colectas con recibo, asistencia, notas, boleta imprimible y el parte del mes. Es también con lo que se rinden cuentas cuando alguien pregunta.' },
      { t: 'Sin internet y sin luz: por qué esto no se cae',
        s: 'El alumno trabaja sin señal y los resultados se envían solos cuando aparece. Cómo instalarla como app, y cómo dar Programación y Robótica sin una sola computadora.' },
    ],
  },
  {
    k: 'leyes',
    chip: '⚖️ Leyes educativas',
    titulo: 'Leyes y normativa educativa',
    intro: 'Lo que la ley le exige y lo que la ley le garantiza. Cada misión citará el ' +
           'documento oficial vigente y traducirá a lenguaje de aula lo que significa para usted.',
    herramienta: '',
    temas: [
      /* Va primera a propósito: sin saber de dónde salió cada regla, la Ley
         Fundamental se estudia de memoria y se olvida. Además es la mitad del
         temario de legislación de un concurso de nombramiento. */
      { t: 'Dos siglos de leyes educativas en Honduras',
        s: 'De la independencia de 1821 a la ley que rige hoy su aula: qué cambió, por qué, y el temario de legislación que cae en los concursos. Con ficha de estudio de diez páginas.',
        url: 'misiones/docente-historia-leyes-educativas/historia-leyes-educativas.html' },
      { t: 'La Ley Fundamental de Educación en el aula',
        s: 'Qué le toca al docente de grado, artículo por artículo: los 200 días, la gratuidad, los ciclos, el currículo y la rendición de cuentas. Con ficha de estudio de diez páginas.',
        url: 'misiones/docente-ley-fundamental-aula/ley-fundamental-aula.html' },
      { t: 'Evaluación: qué manda la norma',
        s: 'Notas, recuperación, alumnos NSP y actas. Para que el Plan de Acción y las Notas SACE salgan como el sistema los pide.' },
      { t: 'Derechos de la niñez en la escuela',
        s: 'Nueve escenas del aula con el Código de la Niñez en la mano: disciplina sin humillar, el deber de informar en 24 horas, evaluación impugnable y niñez que trabaja. Con ficha de estudio de diez páginas.',
        url: 'misiones/docente-derechos-ninez/derechos-ninez.html' },
      { t: 'Estatuto del Docente: sus derechos',
        s: 'Los nueve trámites de su carrera, con su artículo y sus plazos: concurso, propiedad, permuta, traslado, permisos, evaluación y cómo defenderse de una sanción. Con ficha de estudio de diez páginas.',
        url: 'misiones/docente-estatuto-derechos/estatuto-derechos.html' },
      { t: 'Bienes del centro y bienes del docente',
        s: 'Qué dice la norma sobre inventarios, donaciones y reembolsos: lo que respalda su acta de inventario.' },
    ],
  },
  {
    k: 'estrategias',
    chip: '🧠 Estrategias de aula',
    titulo: 'Estrategias de enseñanza',
    intro: 'Técnicas concretas, probadas y de aplicar el lunes. Nada de teoría que no se pueda ' +
           'usar con 43 alumnos y un pizarrón.',
    herramienta: '',
    temas: [
      { t: 'Preguntar mejor: de la memoria al pensamiento',
        s: 'Cómo subir el nivel de sus preguntas para que el alumno explique, compare y justifique.' },
      { t: 'Aula multigrado sin morir en el intento',
        s: 'Organizar dos y tres grados a la vez con rotaciones, monitores y tareas escalonadas.' },
      { t: 'Evaluación formativa en 5 minutos',
        s: 'Saber quién entendió ANTES de la prueba: boleto de salida, semáforo y pizarra rápida.' },
      { t: 'Lectura comprensiva en cualquier materia',
        s: 'Tres rutinas de lectura que sirven igual en Sociales, Naturales y Matemáticas.' },
      { t: 'Convivencia: acuerdos en vez de castigos',
        s: 'Cómo construir normas con el grupo y sostenerlas sin gritar ni humillar.' },
    ],
  },
  {
    k: 'datos',
    chip: '📊 Datos y evaluación',
    titulo: 'Leer los datos de su grupo',
    intro: 'Sus notas ya le están diciendo algo. Estas misiones enseñan a escucharlas.',
    herramienta: 'Plan de Acción · Notas SACE · Parte Mensual',
    temas: [
      { t: 'Del promedio al plan de mejora',
        s: 'Qué hacer con un grupo de promedio 62: agrupar por necesidad y decidir a quién atender primero.' },
      { t: 'Análisis de ítems: qué pregunta falló',
        s: 'Cuando media clase falla el mismo número, el problema fue la clase, no el alumno.' },
      { t: 'Recuperación que sí recupera',
        s: 'Diseñar la semana de recuperación para que el alumno aprenda, no solo para que suba la nota.' },
      { t: 'Asistencia: la señal que avisa antes de la deserción',
        s: 'Leer el patrón de faltas y actuar con la familia mientras todavía se puede.' },
    ],
  },
  {
    k: 'gestion',
    chip: '🏫 Gestión del aula',
    titulo: 'Gestión y papelería sin sufrimiento',
    intro: 'Lo administrativo bien hecho es tiempo que le queda para enseñar, y respaldo el día ' +
           'que alguien pregunte.',
    herramienta: 'Mi aula · Economía · Inventario · Comunicados',
    temas: [
      { t: 'Su expediente de aula, al día todo el año',
        s: 'Qué guardar, cada cuánto y en qué orden para que el cierre de año no sea una noche en vela.' },
      { t: 'Dinero de los padres: rendir cuentas sin sospechas',
        s: 'Colectas, recibos y saldo público. La transparencia se prepara antes, no cuando la exigen.' },
      { t: 'Inventario y propiedad: lo suyo y lo del centro',
        s: 'Cómo levantar el acta, quién debe firmarla y cómo cobrar lo que puso de su bolsillo.' },
      { t: 'Comunicados que sí se leen',
        s: 'Escribir corto, claro y sin ambigüedad para que la casa entienda a la primera.' },
    ],
  },
  {
    k: 'familia',
    chip: '👪 Familia y comunidad',
    titulo: 'Trabajar con las familias',
    intro: 'El maestro solo no alcanza. Estas misiones son para que la casa empuje en la misma dirección.',
    herramienta: 'Asistente de padres · Colectas · Gobierno Escolar',
    temas: [
      { t: 'La reunión de padres que vale la pena',
        s: 'Agenda de 40 minutos, datos a la vista y compromisos escritos en vez de discursos.' },
      { t: 'Dar una mala nota sin romper el puente',
        s: 'Cómo decir «va mal» de manera que la familia ayude en vez de castigar.' },
      { t: 'Enseñar a la familia a usar el asistente',
        s: 'Entregar la clave, mostrar la primera consulta y resolver el «no me aparece nada».' },
      { t: 'Gobierno escolar: ciudadanía de verdad',
        s: 'Convertir la elección en una experiencia cívica y no en un trámite de un día.' },
    ],
  },
  {
    k: 'tecnologia',
    chip: '💻 Tecnología para enseñar',
    titulo: 'Tecnología con sentido pedagógico',
    intro: 'El teléfono como herramienta de aprendizaje, no como distracción, incluso donde se ' +
           'va la luz y no hay señal.',
    herramienta: 'Misiones · Fichas · Campeonísimo · Collage · Evidencia',
    temas: [
      { t: 'Una misión M.E.T.A.S en una clase de 45 minutos',
        s: 'Antes, durante y después: cómo montar la clase alrededor de la misión sin perder el control.' },
      { t: 'Enseñar sin internet ni luz',
        s: 'Plan B real: qué queda funcionando en el teléfono y cómo preparar la clase de contingencia.' },
      { t: 'Evidencia que respalda su trabajo',
        s: 'Fotos, collages y registros: qué archivar para demostrar lo que hizo con su grupo.' },
      { t: 'Inteligencia artificial: usarla sin que le enseñe mentiras al alumno',
        s: 'Qué sirve, qué no, y cómo verificar antes de llevarlo al aula.' },
    ],
  },
];

/* Área mostrada al entrar. NO es la primera de la lista: es la primera que
   tiene algo que se pueda abrir hoy.

   «Dominar M.E.T.A.S» va primera en los chips porque es la puerta de entrada al
   proyecto, pero mientras sus misiones estén en «Pronto» sería un mal recibo:
   el maestro abre el temario y no encuentra nada que tocar. Así que se abre en
   la primera área con misión disponible, y el chip de la nueva queda a la vista
   para que sepa que viene. El día que se publique su primera misión, esta línea
   la elige sola y no hay que tocar nada. */
let _mfArea = (MF_AREAS.find(a => a.temas.some(t => t.url)) || MF_AREAS[0]).k;

function mfEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mfLogueado() {
  try { const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); return !!(d && d.codigo); }
  catch (_) { return false; }
}

function mfRender() {
  const cont = document.getElementById('mf-content');
  if (!cont) return;
  /* Segundo candado: la vista puede restaurarse al recargar (METAS_NAV_V1)
     aunque la sesión ya no exista. Sin cuenta, no hay temario. */
  if (!mfLogueado()) {
    cont.innerHTML = `
      <div class="mf-hero">
        <div class="mf-hero-ic">🔒</div>
        <div class="mf-hero-t">Solo para el maestro registrado</div>
        <div class="mf-hero-s">Estas misiones son de formación docente. Entra con tu cuenta en la
          Zona Docente y aparecen aquí.</div>
      </div>`;
    return;
  }
  /* El temario se muestra COMPLETO, con sus «Pronto». No es relleno: al autor
     le sirve de plan de trabajo a la vista, y al maestro le dice qué viene,
     así vuelve a mirar. Las que ya se pueden abrir se distinguen solas por su
     etiqueta «Disponible» y su botón. */
  const a = MF_AREAS.find(x => x.k === _mfArea) || MF_AREAS[0];
  const listos = MF_AREAS.reduce((n, x) => n + x.temas.filter(t => t.url).length, 0);

  cont.innerHTML = `
    <div class="mf-hero">
      <div class="mf-hero-ic">🎓</div>
      <div class="mf-hero-t">Aquí el que aprende es usted</div>
      <div class="mf-hero-s">Misiones cortas para su propia actualización: estrategias, leyes
        educativas y lo que necesita para sacarle todo a las herramientas de su aula.
        <strong>Solo las ve el maestro registrado.</strong></div>
      <div class="mf-hero-badge">${listos
        ? (listos === 1 ? '1 misión lista para hoy' : listos + ' misiones listas para hoy') +
          ' · el resto viene en camino'
        : '🚧 En construcción · este es el temario que viene'}</div>
    </div>

    <p class="mf-lead">Toque un área para ver sus temas:</p>
    <div class="mf-chips" id="mf-chips">
      ${MF_AREAS.map(x => `
        <button class="mf-chip ${x.k === a.k ? 'mf-chip-on' : ''}" data-mfarea="${x.k}">${x.chip}</button>`).join('')}
    </div>

    <div class="mf-area">
      <div class="mf-area-t">${mfEsc(a.titulo)}</div>
      <p class="mf-area-s">${mfEsc(a.intro)}</p>
      ${a.herramienta ? `<p class="mf-area-h">🧰 Le sirve para: <strong>${mfEsc(a.herramienta)}</strong></p>` : ''}
      ${a.temas.map(t => `
        <div class="mf-tema ${t.url ? 'mf-tema-listo' : ''}">
          <div class="mf-tema-top">
            <span class="mf-tema-t">${mfEsc(t.t)}</span>
            <span class="mf-tema-badge ${t.url ? 'mf-badge-listo' : ''}">${t.url ? 'Disponible' : 'Pronto'}</span>
          </div>
          <p class="mf-tema-s">${mfEsc(t.s)}</p>
          ${t.url ? `<a class="mf-tema-btn" href="${mfEsc(t.url)}">Abrir la misión →</a>` : ''}
        </div>`).join('')}
    </div>

    <p class="mf-pie">💡 ¿Le falta un tema? Es su plataforma: anote lo que necesita aprender y
      dígalo: estas misiones se construyen con lo que el aula real pide, no con lo que se
      supone que un maestro debería saber.</p>`;

  cont.querySelectorAll('[data-mfarea]').forEach(b =>
    b.addEventListener('click', () => { _mfArea = b.dataset.mfarea; mfRender(); }));
}

function mfAbrir() {
  if (!mfLogueado()) {
    toast('Entra con tu cuenta de maestro: estas misiones son solo para el docente registrado');
    return;
  }
  switchView('view-formacion');
  mfRender();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-formacion-btn')?.addEventListener('click', mfAbrir);
  document.getElementById('formacion-back-btn')?.addEventListener('click', () => switchView('view-perfil'));
});
