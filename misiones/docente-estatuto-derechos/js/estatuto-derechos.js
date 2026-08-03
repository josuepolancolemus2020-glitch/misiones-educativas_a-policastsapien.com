/* ═══════════════════════════════════════════════════════════════
   Misión del maestro · El Estatuto del Docente y sus derechos

   Es una misión de FORMACIÓN DOCENTE: la abre el maestro registrado
   desde «Misiones del maestro», no el alumno. Por eso no se registra
   en js/data/misiones.js (ese catálogo es del alumno y la haría
   visible para todo el mundo) y no engancha metas-registro.js: aquí
   no hay evidencia de alumno que enviar, el progreso es del maestro
   y se queda en su teléfono.

   FUENTES: esta misión NO se escribió con buscador. Cada artículo,
   plazo y cifra se leyó en el documento, que está en el repositorio:

     _dev/leyes/estatuto-docente-decreto-136-97.pdf
     _dev/leyes/reglamento-estatuto-docente-acuerdo-0760-se-99.pdf

   Se hizo así porque el primer intento, con búsqueda web, terminó con
   números de artículo que se contradecían entre sí (el 13 y el 28
   para la lista de derechos, por ejemplo) y con datos sacados de
   apuntes de estudiantes. Está contado en INVESTIGACION-ESTATUTO-DOCENTE.md.
   Si alguien corrige un dato, que corrija también la ficha imprimible:
   las dos se estudian juntas.

   LO QUE A PROPÓSITO NO SE DICE: nada sobre salarios en lempiras. Las
   cifras del Estatuto son de 1997 y el régimen económico se ha movido
   por acuerdos posteriores. Un número viejo de sueldo hace más daño
   que su ausencia.
═══════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'METAS_MD_ESTATUTO_V1';

/* ── Estado guardado (solo de este maestro, en este teléfono) ── */
let S = {
  xp: 0, tramites: [], fcVistas: [], nombre: '', sonido: 1,
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
   LOS NUEVE TRÁMITES
   La primera misión de esta área se recorría por fechas y la segunda
   por artículos. Esta se recorre por TRÁMITES, porque el Estatuto no
   se consulta por curiosidad: se consulta el día que hay que pedir
   algo o defenderse de algo. Cada trámite trae los pasos en orden y
   los papeles que hay que llevar, que es lo que se olvida y lo que
   hace volver otro día a la misma oficina.
══════════════════════════════════════════════════════════════ */
const TRAMITES = [
  {
    ic: '🎓', corto: 'Entrar a la carrera',
    tit: 'Los cinco requisitos para ingresar',
    sub: 'Estatuto, artículo 7',
    txt: 'La carrera docente no se entra por nombramiento a dedo: el Estatuto fija cinco ' +
         'requisitos y son acumulativos, hay que cumplirlos todos. Dos de ellos sorprenden a ' +
         'mucha gente: estar afiliado a un colegio magisterial y solvente con él, y estar ' +
         'inscrito en el Escalafón de la carrera docente. Sin esos dos papeles, el expediente ' +
         'está incompleto aunque el título esté perfecto.',
    cita: 'Para ingresar a la carrera docente se requiere: 1) Ser hondureño por nacimiento; ' +
          '2) Estar en el goce de los derechos civiles; 3) Acreditar la identidad y los ' +
          'requisitos para ocupar el puesto; 4) Estar afiliado a un colegio magisterial y ' +
          'solvente; y 5) Estar inscrito en el Escalafón de la carrera docente.',
    pasos: [
      'Reúna los cinco requisitos del artículo 7, no cuatro.',
      'Inscríbase en el Escalafón de la carrera docente.',
      'Manténgase solvente con su colegio magisterial: la solvencia caduca y se pide con fecha.',
      'Acredite los requisitos propios del puesto al que va a optar.',
    ],
    papeles: [
      'Título docente y su registro.',
      'Tarjeta de identidad.',
      'Constancia de afiliación y de solvencia del colegio magisterial.',
      'Constancia de inscripción en el Escalafón.',
    ],
    aula: 'La solvencia y la inscripción en el Escalafón son las dos que se vencen o se ' +
          'olvidan. Pídalas con tiempo: un concurso no espera a que le salga un papel.',
  },
  {
    ic: '🏆', corto: 'Ganar una plaza',
    tit: 'El concurso: cuándo, con qué pruebas y con qué nota',
    sub: 'Estatuto, artículos 17 a 22 · Reglamento, artículos 73 a 85',
    txt: 'Los concursos generales se hacen cada año, y el Reglamento fija la fecha: del 20 al ' +
         '30 de enero. El llamamiento se publica con quince días hábiles de antelación. Los ' +
         'concursos para un puesto específico se hacen al surgir la vacante, dentro de los ' +
         'quince días hábiles siguientes. El concurso comprende al menos prueba de aptitud y ' +
         'conocimiento, calificación de méritos, prueba psicométrica con investigación de ' +
         'antecedentes cuando corresponde, y calificación de títulos y créditos para el puesto. ' +
         'Los resultados se suman y el promedio final no puede ser menor del setenta y cinco por ' +
         'ciento. Del concurso general sale una lista ordenada de mayor a menor puntaje, y esa ' +
         'lista vale un año. Los resultados se publican dentro de los veinte días hábiles ' +
         'siguientes.',
    cita: 'El concurso comprenderá al menos: la prueba de aptitud y conocimiento, la ' +
          'calificación de méritos, prueba psicométrica e investigación de antecedentes si es ' +
          'el caso y la calificación de títulos y de créditos para el puesto. Se sumarán los ' +
          'resultados para establecer el promedio de la calificación final, que no deberá ser ' +
          'menor a 75% para aprobar el mismo.',
    pasos: [
      'Espere el llamamiento: sale con quince días hábiles de antelación.',
      'Inscríbase reuniendo los requisitos del puesto que concursa.',
      'Presente las pruebas. Las elabora una comisión de la junta, no quien lo examina.',
      'Los resultados se publican dentro de los veinte días hábiles siguientes.',
      'La lista se ordena por puntaje descendente y vale un año.',
    ],
    papeles: [
      'Expediente completo el día de la inscripción, con copia sellada de todo lo entregado.',
      'Títulos y créditos que se van a calificar.',
      'Constancias de servicio y certificados de cursos, con sello, firma y horas.',
      'Constancia de inscripción al concurso: es la que prueba que usted participó.',
    ],
    aula: 'Dos palabras que se confunden y caen en examen: un concurso queda <b>desierto</b> ' +
          'cuando nadie se inscribe o nadie se presenta, y <b>fracasado</b> cuando los que se ' +
          'presentaron no alcanzan el 75 %. El fracasado se repite en un plazo no menor de ' +
          'treinta días.',
  },
  {
    ic: '📌', corto: 'Que le den la propiedad',
    tit: 'Seis meses de interinato, y el puesto es suyo',
    sub: 'Estatuto, artículo 20 · Reglamento, artículo 52',
    txt: 'Este es el derecho que más maestros dejan pasar por no saberlo. Si usted ingresó ' +
         'legalmente a un puesto, cumpliendo todos los requisitos, y lo ocupa por seis meses ' +
         'consecutivos como mínimo, tiene derecho a que se le nombre en propiedad en un puesto ' +
         'de igual nivel sin volver a cumplir los requisitos de selección. El Reglamento lo ' +
         'concreta: si cubría una plaza vacante de manera interina durante esos seis meses y la ' +
         'plaza se convierte en vacante definitiva, le corresponde el nombramiento en propiedad. ' +
         'La condición que nadie debe pasar por alto es «haber ingresado legalmente»: si el ' +
         'interinato se dio al margen del procedimiento, el tiempo no cuenta.',
    cita: 'El docente que hubiere ingresado legalmente a un puesto y lo ocupare por un término ' +
          'de seis (6) meses consecutivos como mínimo, tendrá derecho a ocupar en propiedad un ' +
          'puesto de igual nivel, sin cumplir nuevamente los requisitos de selección.',
    pasos: [
      'Cuente los meses desde que tomó posesión, y que sean consecutivos.',
      'Compruebe que su ingreso fue legal: acuerdo o nombramiento de por medio.',
      'Cuando la plaza se declare vacante definitiva, solicite el nombramiento por escrito.',
      'Pida copia sellada de su solicitud el mismo día que la entrega.',
    ],
    papeles: [
      'Acuerdo o nombramiento del interinato.',
      'Constancia de servicio con fechas exactas de inicio y fin.',
      'Copia sellada de la solicitud de nombramiento en propiedad.',
    ],
    aula: 'Guarde desde el primer día el papel con el que entró. Ese documento es el que ' +
          'convierte seis meses de trabajo en un derecho, y el que nadie encuentra cuando hace falta.',
  },
  {
    ic: '🔁', corto: 'Permutar',
    tit: 'La permuta: de mutuo acuerdo y entre iguales',
    sub: 'Estatuto, artículo 27 · Reglamento, artículos 105 a 108',
    txt: 'La permuta es el intercambio voluntario de empleos de igual nivel. Se hace de mutuo ' +
         'acuerdo, en igualdad de condiciones y de puesto, y requiere dictamen y aprobación de ' +
         'la autoridad competente. Puede ser definitiva o temporal: la temporal dura como mínimo ' +
         'un año y se prorroga por voluntad de ambas partes hasta un máximo de cuatro. Al ' +
         'terminar, los dos están obligados a reintegrarse a sus puestos anteriores; si no lo ' +
         'hacen, la permuta se vuelve definitiva y así lo declara de oficio la autoridad. Quién ' +
         'la autoriza depende del mapa: si los dos trabajan en el mismo departamento, el ' +
         'Director Departamental; si están en departamentos distintos, los dos Directores ' +
         'Departamentales. Hay una prohibición que conviene conocer antes de ilusionarse: no se ' +
         'permuta dentro de los tres años previos a la edad de jubilación voluntaria ni después ' +
         'de esa edad.',
    cita: 'Las permutas son intercambios voluntarios de empleos de igual nivel. Podrán ' +
          'autorizarse permutas temporales por períodos desde uno (1) a cuatro (4) años. ' +
          'Después de este término se convertirán en definitivas.',
    pasos: [
      'Póngase de acuerdo con el otro docente: sin mutuo acuerdo no hay permuta.',
      'Comprueben que los puestos son de igual nivel y condiciones.',
      'Presenten la solicitud conjunta a la autoridad que corresponda.',
      'Espere el dictamen y la aprobación: la permuta no existe hasta que hay acuerdo emitido.',
      'Si es temporal, anote la fecha de vencimiento y reintégrese, o quedará definitiva.',
    ],
    papeles: [
      'Solicitud firmada por los dos docentes.',
      'Constancias de los dos puestos, con nivel y condiciones.',
      'El acuerdo de aprobación: todo movimiento requiere acuerdo emitido.',
    ],
    aula: 'La trampa de la permuta temporal es la fecha. Si vence y usted no se reintegra, se ' +
          'vuelve definitiva sin que nadie le pregunte. Póngala en el calendario del teléfono ' +
          'el día que la firma.',
  },
  {
    ic: '🚚', corto: 'Pedir un traslado',
    tit: 'Traslado: seis causas y un orden de prioridad',
    sub: 'Estatuto, artículos 28 y 29 · Reglamento, artículos 110 a 113',
    txt: 'El traslado es el movimiento de un docente a otro empleo de igual o menor nivel, y ' +
         'procede por seis causas: a petición del docente; por años laborados en el área rural ' +
         'cuando se solicita hacia la urbana; por fuerza mayor comprobada; para resolver ' +
         'situaciones conflictivas en el centro o la comunidad; por reajuste de personal; y por ' +
         'sanción disciplinaria firme. Cuando el traslado se pide para otro departamento, lo ' +
         'aprueba el Director Departamental donde se solicita la ubicación, y el Reglamento fija ' +
         'un orden estricto de prioridades: seguridad personal, enfermedad, integración familiar, ' +
         'lugar de origen y, por último, caso fortuito, fuerza mayor y calamidad doméstica. Las ' +
         'solicitudes se resuelven cuando existan plazas vacantes, y las vacantes se cubren ' +
         'primero por traslado, después con los exonerados de concurso y al final por resultados ' +
         'de concurso. Una regla que ordena todo lo demás: una misma persona no puede ser objeto ' +
         'de movimiento laboral antes de un año desde el anterior, salvo que gane un concurso o ' +
         'que se le aplique como medida disciplinaria.',
    cita: 'Traslado es el movimiento de un docente a otro empleo de igual o menor nivel. En ' +
          'todo caso, una misma persona no podrá ser objeto de movimiento laboral antes de un ' +
          '(1) año desde un movimiento anterior.',
    pasos: [
      'Identifique en cuál de las seis causas del artículo 28 encaja su caso.',
      'Justifique documentalmente: la prioridad se gana con papeles, no con explicaciones.',
      'Presente la solicitud a la autoridad competente y pida copia sellada.',
      'Si es para otro departamento, resuelve el Director Departamental de destino.',
      'Espere a que exista plaza vacante: sin vacante no hay traslado.',
    ],
    papeles: [
      'Constancia policial o denuncia, si alega seguridad personal.',
      'Constancia médica, si alega enfermedad.',
      'Documentos de parentesco y domicilio, si alega integración familiar.',
      'Copia sellada de la solicitud, con fecha.',
    ],
    aula: 'El orden de prioridades del Reglamento es lo que decide quién se lleva la plaza. Si ' +
          'su caso es de salud o de seguridad, dígalo con ese nombre y respáldelo: no es lo ' +
          'mismo pedir «acercamiento familiar» que acreditar enfermedad.',
  },
  {
    ic: '📝', corto: 'Permisos y licencias',
    tit: 'Cuántos días le tocan y con qué papel',
    sub: 'Estatuto, artículo 13 numerales 6, 7 y 8 · Reglamento, artículos 46 a 48',
    txt: 'El Estatuto distingue tres cosas que en el centro se confunden. La <b>licencia con ' +
         'goce de sueldo</b> cubre enfermedad (por el período de incapacidad que extienda el ' +
         'Instituto Hondureño de Seguridad Social o el médico autorizado), maternidad, aborto, ' +
         'estudios autorizados y cargos directivos gremiales de nivel nacional. La <b>licencia ' +
         'sin goce de sueldo</b> cubre asuntos particulares hasta dos años, prorrogables por dos ' +
         'más, ocupar otro puesto del sistema o desempeñar cargos de elección popular. Y los ' +
         '<b>permisos especiales con goce de sueldo</b>, que van desde uno hasta un total de ' +
         'treinta días en el curso del año, con una tabla en el Reglamento. La maternidad son ' +
         'seis semanas antes y seis después en el área urbana, y cuatro antes y ocho después en ' +
         'la rural. Y hay una hora diaria de lactancia hasta que el hijo cumple seis meses.',
    cita: 'Permisos especiales con goce de sueldo, desde uno (1) hasta un total de treinta (30) ' +
          'días en el curso del año. En ningún caso los permisos acumulados podrán exceder de ' +
          'los 30 días.',
    pasos: [
      'Enfermedad suya: hasta tres días hábiles con simple excusa por escrito al reintegrarse.',
      'Asistir a un familiar enfermo: hasta seis días calendario, con constancia médica.',
      'Muerte de cónyuge, padres, hijos o hermanos: nueve días calendario, y tres más si el sepelio es fuera de su domicilio.',
      'Muerte de otros parientes hasta el cuarto grado: tres días calendario.',
      'Matrimonio: seis días hábiles en primeras nupcias, tres en las siguientes.',
      'Trámites ante una institución: dos días hábiles si es en el municipio donde vive.',
    ],
    papeles: [
      'Excusa escrita, para los tres días de enfermedad propia.',
      'Constancia médica, para asistir a un familiar.',
      'Certificación del acta de defunción o de matrimonio, según el caso.',
      'Aval de la organización magisterial, para eventos gremiales.',
    ],
    aula: 'Los treinta días son un tope anual que suma todas las causas, no treinta por cada ' +
          'una. Lleve su propia cuenta: cuando se le pasa, el permiso siguiente se lo niegan con ' +
          'razón.',
  },
  {
    ic: '📊', corto: 'Que lo evalúen',
    tit: 'La evaluación, y los diez días para reclamarla',
    sub: 'Estatuto, artículos 30 y 31 · Reglamento, artículos 116 y 120',
    txt: 'La evaluación del docente sirve para sustentar los méritos, las prestaciones y los ' +
         'correctivos, y hay que calificar por lo menos una vez al año a cada docente. Se hace ' +
         'en dos mitades que valen igual: cincuenta por ciento institucional y cincuenta por ' +
         'ciento participativa, y la suma de las dos es la calificación final. El docente tiene ' +
         'derecho a conocer el manejo, los propósitos y los resultados de la evaluación. Y hay ' +
         'un plazo que hay que saberse de memoria: si considera que fue perjudicado, puede pedir ' +
         'revisión ante el mismo órgano que lo evaluó, dentro de los diez días hábiles ' +
         'posteriores a la notificación. El Estatuto añade un candado: quien use la evaluación ' +
         'para perjudicar o favorecer a alguien será sancionado, sin perjuicio de la ' +
         'responsabilidad administrativa, civil y penal.',
    cita: 'Cuando el docente considere que ha sido perjudicado en la evaluación, tendrá derecho ' +
          'a solicitar revisión ante el órgano que practicó la evaluación en el término de diez ' +
          'días hábiles posteriores a su notificación.',
    pasos: [
      'Exija que le notifiquen el resultado: el plazo corre desde la notificación.',
      'Anote la fecha de notificación el mismo día.',
      'Si va a reclamar, presente la solicitud de revisión dentro de los diez días hábiles.',
      'Diríjala al órgano que practicó la evaluación, no a otro.',
      'Pida copia sellada.',
    ],
    papeles: [
      'La notificación del resultado, con su fecha.',
      'Solicitud de revisión por escrito, con los hechos concretos.',
      'Pruebas de su desempeño: planificaciones, registros, evidencias del año.',
    ],
    aula: 'Diez días hábiles se pasan volando entre clases. El día que le notifiquen, escriba ' +
          'la fecha en su registro: es el reloj que decide si su reclamo se puede o no se puede.',
  },
  {
    ic: '⚖️', corto: 'Defenderse',
    tit: 'Ninguna sanción sin audiencia de descargos',
    sub: 'Estatuto, artículos 35 a 41 · Reglamento, artículos 145 a 155',
    txt: 'Las faltas se clasifican en leves, graves y muy graves. Las leves se sancionan con ' +
         'amonestación oral privada, escrita, o escrita con asiento en el expediente. Las graves, ' +
         'con multa del cinco al diez por ciento del sueldo mensual o suspensión sin salario de ' +
         'ocho a treinta días. Las muy graves, con suspensión de treinta y un días hasta un año, ' +
         'traslado a un puesto de menor jerarquía o destitución. Lo que más le importa a usted no ' +
         'es la lista, es el procedimiento: para faltas graves y muy graves el trámite incluye ' +
         '<b>siempre</b> una audiencia de descargo con garantías de legítima defensa. La ' +
         'autoridad debe notificarle por escrito los hechos que se le imputan y citarlo ' +
         'indicando lugar, fecha y hora; la audiencia se celebra dentro de los siete días hábiles ' +
         'siguientes a la notificación, con dos testigos, y <b>uno de ellos lo nombra usted</b>. ' +
         'Si no se presenta, su ausencia se toma como aceptación de los hechos. Y ninguna sanción ' +
         'se tramita sin haber cumplido este procedimiento.',
    cita: 'Para las faltas graves y muy graves, el procedimiento incluirá siempre una audiencia ' +
          'de descargo, con las garantías y formalidades de legítima defensa que el mismo ' +
          'reglamento especifique.',
    pasos: [
      'Le notifican por escrito los hechos imputados y lo citan con lugar, fecha y hora.',
      'La audiencia se celebra dentro de los siete días hábiles siguientes.',
      'Preséntese. No comparecer se toma como aceptación de los hechos.',
      'Lleve su testigo: de los dos, uno lo nombra usted.',
      'Presente sus descargos y sus pruebas; todo lo actuado consta en acta.',
      'Contra una sanción grave o muy grave caben los recursos, y después la vía judicial.',
    ],
    papeles: [
      'La notificación escrita, guardada con su fecha.',
      'Sus pruebas: registros, actas, planificaciones, comunicaciones.',
      'El nombre de su testigo, avisado con tiempo.',
      'Copia del acta de la audiencia.',
    ],
    aula: 'Si le anuncian una sanción sin notificación escrita y sin audiencia, el procedimiento ' +
          'está viciado desde el inicio. No discuta en el pasillo: pida por escrito que se le ' +
          'notifique conforme al Estatuto y guarde copia de esa petición.',
  },
  {
    ic: '🗂️', corto: 'Su expediente',
    tit: 'El expediente profesional es suyo y usted puede pedirlo',
    sub: 'Reglamento, artículos 121 a 123',
    txt: 'En cada centro educativo se lleva un expediente completo del docente, y ahí se ' +
         'incluyen los resultados de la evaluación. Si usted permuta de manera definitiva o lo ' +
         'trasladan, el expediente se remite al nuevo centro: lo sigue. Es un documento ' +
         'confidencial y solo pueden consultarlo los miembros de la Comisión de Evaluación, la ' +
         'autoridad inmediata superior, la Secretaría de Educación, los entes contralores del ' +
         'Estado, por orden judicial y <b>el propio docente interesado</b>. Y hay un derecho que ' +
         'casi nadie usa: obtener, por sí mismo o por medio de apoderado, certificaciones o ' +
         'constancias de los documentos que forman su expediente.',
    cita: 'Los docentes tienen derecho a obtener por sí o por medio de sus representantes o ' +
          'apoderados legales, certificaciones o constancias de los documentos que forman su ' +
          'expediente profesional.',
    pasos: [
      'Pida por escrito ver su expediente: usted es de los que pueden consultarlo.',
      'Solicite certificación o constancia de los documentos que le interesen.',
      'Revise que estén sus méritos, no solo las observaciones.',
      'Si va a concursar o a pedir traslado, pida las constancias antes, no el mismo día.',
    ],
    papeles: [
      'Solicitud escrita de consulta o de certificación.',
      'Su identidad, o poder si va un apoderado.',
    ],
    aula: 'El expediente decide concursos y traslados años después, y casi ningún maestro lo ha ' +
          'visto nunca. Pida verlo una vez al año, como quien revisa un estado de cuenta.',
  },
];

let _tram = 0;
/* La lista va en vertical y el trámite se abre DEBAJO del que se tocó: es el
   molde que quedó de la primera misión, donde el riel horizontal dejaba la
   mayoría de las fichas fuera de la pantalla del teléfono. */
function trPinta() {
  const lista = document.getElementById('trLista');
  if (!lista) return;
  lista.innerHTML = TRAMITES.map((t, i) => {
    const abierto = i === _tram;
    return `
    <div class="tr-item ${abierto ? 'on' : ''} ${S.tramites.includes(i) ? 'visto' : ''}" id="trIt${i}">
      <button class="tr-cab" onclick="trVer(${i})" aria-expanded="${abierto}">
        <span class="tr-num" aria-hidden="true">${t.ic}</span>
        <span class="tr-tit">${t.corto}</span>
        ${S.tramites.includes(i) ? '<span class="tr-visto">✓</span>' : ''}
        <span class="tr-flecha" aria-hidden="true">▾</span>
      </button>
      ${abierto ? `
      <div class="tr-det" id="trDet">
        <h3>${t.ic} ${t.tit}</h3>
        <div class="tr-sub">${t.sub}</div>
        <p>${t.txt}</p>
        <div class="tr-cita">📜 <b>Lo dice así:</b> «${t.cita}»</div>
        <ol class="tr-pasos">${t.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="tr-papeles"><b>📎 Qué papeles hay que llevar</b>
          <ul>${t.papeles.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="aula">🎯 <b>Qué le deja a su carrera:</b> ${t.aula}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}
function trVer(i) {
  _tram = i;
  if (!S.tramites.includes(i)) { S.tramites.push(i); xp(3); }
  trPinta();
  // Que el trámite tocado quede a la vista aunque el texto empuje la lista
  const el = document.getElementById('trIt' + i);
  if (el && el.scrollIntoView) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
function trMover(d) { trVer(Math.max(0, Math.min(TRAMITES.length - 1, _tram + d))); }

/* ══════════════════ TARJETAS DE REPASO ══════════════════
   NOMBRES PROPIOS CON MAYÚSCULA, aquí también (normativa de la casa,
   en CLAUDE.md). Se comprueba con node _dev/verifica-nombres-propios.js. */
const FC = [
  ['¿Cuál es la norma que ordena la carrera docente y de qué año es?', 'El Estatuto del Docente Hondureño, Decreto 136-97, de 1997. Su Reglamento General es el Acuerdo 0760-SE-99.'],
  ['¿Qué artículo del Estatuto enumera los derechos del docente?', 'El artículo 13, con veintitrés numerales. Es el artículo que más cae en un concurso.'],
  ['¿Cuántos requisitos pide el artículo 7 para ingresar a la carrera docente?', 'Cinco, y hay que cumplirlos todos: nacionalidad hondureña por nacimiento, goce de derechos civiles, acreditar identidad y requisitos del puesto, colegiación y solvencia, e inscripción en el Escalafón.'],
  ['¿Qué nota mínima exige el concurso docente?', 'El promedio final no puede ser menor del 75 %, sumando todas las pruebas. Lo dice el artículo 77 del Reglamento.'],
  ['¿Cuándo se hacen los concursos generales?', 'Cada año, y el Reglamento fija la fecha: del 20 al 30 de enero. El llamamiento sale con quince días hábiles de antelación.'],
  ['¿Qué diferencia hay entre concurso desierto y concurso fracasado?', 'Desierto es cuando nadie se inscribe o nadie se presenta. Fracasado es cuando los que se presentaron no alcanzan el 75 %.'],
  ['¿Cuánto tiempo de interinato da derecho a la propiedad?', 'Seis meses consecutivos como mínimo, habiendo ingresado legalmente al puesto. Artículo 20 del Estatuto.'],
  ['¿Qué es una permuta y cuánto dura la temporal?', 'El intercambio voluntario de empleos de igual nivel. La temporal va de uno a cuatro años; después se convierte en definitiva.'],
  ['¿Cuántas causas de traslado reconoce el artículo 28?', 'Seis: a petición del docente, por años en el área rural, por fuerza mayor, por situaciones conflictivas, por reajuste de personal y por sanción disciplinaria firme.'],
  ['¿Cuál es el orden de prioridad para un traslado a otro departamento?', 'Seguridad personal, enfermedad, integración familiar, lugar de origen y, por último, caso fortuito, fuerza mayor y calamidad doméstica.'],
  ['¿Cuántos días de permiso especial con goce de sueldo da el Estatuto al año?', 'Hasta treinta días en el curso del año, sumando todas las causas. No son treinta por cada causa.'],
  ['¿Cuánto dura la licencia por maternidad?', 'Seis semanas antes y seis después en el área urbana; cuatro antes y ocho después en el área rural.'],
  ['¿En qué plazo se pide revisión de la evaluación?', 'Dentro de los diez días hábiles posteriores a la notificación, ante el mismo órgano que practicó la evaluación.'],
  ['¿Puede sancionarse a un docente sin audiencia de descargos?', 'No. Para faltas graves y muy graves el procedimiento incluye siempre audiencia de descargo, con dos testigos, y uno lo nombra el propio docente.'],
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
  ['75 %', 'Nota mínima del concurso'],
  ['6 meses', 'Interinato que da la propiedad'],
  ['30 días', 'Tope anual de permisos especiales'],
  ['10 días hábiles', 'Para pedir revisión de la evaluación'],
  ['7 días hábiles', 'Para la audiencia de descargos'],
  ['1 a 4 años', 'Duración de una permuta temporal'],
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
  { q: '¿Qué artículo del Estatuto enumera los derechos del docente?',
    o: ['El artículo 7', 'El artículo 13', 'El artículo 28', 'El artículo 40'],
    c: 1, e: 'El artículo 13, con veintitrés numerales. El 7 son los requisitos de ingreso y el 28 el traslado.' },
  { q: 'Para ingresar a la carrera docente, además del título, se exige…',
    o: ['Solo la tarjeta de identidad', 'Una carta de recomendación del director',
        'Dos años de servicio previo',
        'Estar colegiado y solvente, e inscrito en el Escalafón'],
    c: 3, e: 'Artículo 7: son cinco requisitos y hay que cumplirlos todos, no cuatro.' },
  { q: 'El promedio final para aprobar un concurso docente no puede ser menor de…',
    o: ['75 %', '60 %', '70 %', '80 %'],
    c: 0, e: 'Artículo 77 del Reglamento: se suman todas las pruebas y el promedio no baja del 75 %.' },
  { q: 'Un docente que ingresó legalmente y ocupa el puesto por seis meses consecutivos…',
    o: ['Debe volver a concursar desde el principio', 'Pierde el puesto al llegar el titular',
        'Tiene derecho a que se le nombre en propiedad en un puesto de igual nivel',
        'Solo puede aspirar a un interinato nuevo'],
    c: 2, e: 'Artículo 20 del Estatuto y 52 del Reglamento. La condición es haber ingresado legalmente.' },
  { q: 'Una permuta temporal dura…',
    o: ['Seis meses fijos', 'De uno a cuatro años, y después se vuelve definitiva',
        'Lo que decida el director del centro', 'Un año, sin prórroga posible'],
    c: 1, e: 'Artículo 27 del Estatuto. Si al vencer no se reintegran, la permuta se declara definitiva de oficio.' },
  { q: '¿Cuántas causas de traslado reconoce el artículo 28 del Estatuto?',
    o: ['Tres', 'Cuatro', 'Cinco', 'Seis'],
    c: 3, e: 'Seis, y la sexta es la sanción disciplinaria firme, que traslada a un puesto inferior.' },
  { q: 'En un traslado a otro departamento, la primera prioridad del Reglamento es…',
    o: ['La seguridad personal', 'La antigüedad en el servicio',
        'El lugar de origen', 'El promedio de la evaluación'],
    c: 0, e: 'Artículo 112: seguridad personal, enfermedad, integración familiar, lugar de origen y por último caso fortuito.' },
  { q: 'Los permisos especiales con goce de sueldo del artículo 13…',
    o: ['Son ilimitados si hay justificación', 'Se pierden si no se usan cada mes',
        'No pueden exceder de treinta días en el curso del año', 'Son treinta días por cada causa'],
    c: 2, e: 'Es un tope anual que suma todas las causas. Lleve su propia cuenta.' },
  { q: 'Para faltas graves y muy graves, el procedimiento…',
    o: ['Lo decide el director sin trámite', 'Se resuelve con una llamada de atención verbal',
        'Incluye siempre una audiencia de descargo', 'Solo aplica en centros privados'],
    c: 2, e: 'Artículo 39 del Estatuto. Y sin procedimiento no se tramita ninguna sanción: artículo 154 del Reglamento.' },
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
  { t: 'Entrar y ganar plaza', it: ['Cinco requisitos del artículo 7', 'Promedio final del 75 %', 'Seis meses dan la propiedad'] },
  { t: 'Moverse de centro', it: ['Permuta de mutuo acuerdo', 'Seis causas de traslado', 'Un movimiento por año'] },
  { t: 'Ausentarse con derecho', it: ['Treinta días de permisos al año', 'Licencia por maternidad', 'Una hora diaria de lactancia'] },
  { t: 'Defenderse', it: ['Audiencia de descargos', 'Un testigo lo nombra usted', 'Diez días para pedir revisión'] },
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
    (bien === _clTodas.length ? 'Cada cosa en su trámite. Así se pregunta en el concurso.'
                              : 'Revise las que quedaron fuera de sitio y vuelva a intentarlo.');
  if (bien === _clTodas.length && !S.clasifica) { S.clasifica = 1; xp(6); }
  guardar();
}

/* ══════════════════ COMPLETA LA ORACIÓN ══════════════════ */
const CP = [
  ['El Estatuto del Docente Hondureño es el Decreto ____.', ['136-97', '13697']],
  ['Los derechos del docente están en el artículo ____ del Estatuto.', ['13', 'trece']],
  ['El promedio final del concurso no puede ser menor de ____ por ciento.', ['75', 'setenta y cinco']],
  ['Dan derecho a la propiedad ____ meses consecutivos de interinato.', ['6', 'seis']],
  ['Los permisos especiales no pueden exceder de ____ días al año.', ['30', 'treinta']],
  ['La revisión de la evaluación se pide dentro de ____ días hábiles.', ['10', 'diez']],
  ['La audiencia de descargos se celebra dentro de ____ días hábiles.', ['7', 'siete']],
  /* La primera de la lista es la que se le muestra al maestro cuando falla, así
     que va escrita bien: «0760-SE-99», no «0760-se-99». Comparar no distingue
     mayúsculas (norm), de modo que escribirla bien no le complica nada. */
  ['El Reglamento General del Estatuto es el Acuerdo ____.', ['0760-SE-99', '076SE99', '0760se99', '0760']],
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
    (bien === CP.length ? 'Los plazos los tiene. Son los que hacen ganar o perder un derecho.'
                        : 'Vuelva a los trámites por las que falló: el número se pega cuando se sabe para qué sirve.');
  if (bien === CP.length && !S.completa) { S.completa = 1; xp(6); }
  guardar();
}

/* ══════════════════ RETO CONTRA RELOJ ══════════════════
   Aquí no se ordenan fechas ni artículos, se ordena UN PROCEDIMIENTO:
   el camino de una sanción, del primer papel al último recurso. Es lo
   que hay que tener claro cuando pasa de verdad, que es cuando nadie
   tiene cabeza para buscarlo. */
const RETO = [
  { t: 'La autoridad conoce el hecho que se le imputa', o: 1 },
  { t: 'Le notifican por escrito los hechos imputados', o: 2 },
  { t: 'En la misma notificación lo citan: lugar, fecha y hora', o: 3 },
  { t: 'Se celebra la audiencia, dentro de los siete días hábiles', o: 4 },
  { t: 'Usted comparece con su testigo', o: 5 },
  { t: 'Presenta sus descargos y sus pruebas', o: 6 },
  { t: 'Todo lo actuado se hace constar en acta', o: 7 },
  { t: 'La autoridad resuelve y notifica la resolución', o: 8 },
  { t: 'Agotados los recursos, queda expedita la vía judicial', o: 9 },
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
    ? `<span class="resu-num">¡Listo!</span>Puso el procedimiento en orden con ${_retoSeg} segundos de sobra. El día que pase de verdad, ya lo sabe.`
    : `<span class="resu-num">Casi</span>${motivo || 'Se acabó el tiempo.'} Toque «Reiniciar» y pruebe otra vez.`;
  if (gano && !S.reto) { S.reto = 1; xp(8); }
  guardar();
}

/* ══════════════════ SOPA DE LETRAS ══════════════════
   La cuadrícula se arma al vuelo en las ocho direcciones y se
   comprueba palabra por palabra, así nunca queda una sopa con una
   palabra que no está (el error clásico de las sopas escritas a
   mano). Sin tildes ni eñes: en la cuadrícula estorban. */
const SOPA_PAL = ['PERMUTA', 'TRASLADO', 'DESCARGOS', 'ESCALAFON', 'LICENCIA', 'AUDIENCIA', 'ESTATUTO', 'PROPIEDAD'];
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
  { q: 'El Estatuto del Docente Hondureño corresponde al:',
    o: ['Decreto 262-2011', 'Decreto 136-97', 'Decreto 79 de 1966', 'Acuerdo 0760-SE-99'], c: 1 },
  { q: 'El Reglamento General del Estatuto del Docente Hondureño es el:',
    o: ['Acuerdo 1358-SE-2014', 'Acuerdo 0401-SE-2019', 'Acuerdo 0760-SE-99', 'Decreto 136-97'], c: 2 },
  { q: 'Los derechos del docente están enumerados en el artículo:',
    o: ['13 del Estatuto', '7 del Estatuto', '28 del Estatuto', '77 del Reglamento'], c: 0 },
  { q: 'No es un requisito de ingreso a la carrera docente:',
    o: ['Ser hondureño por nacimiento', 'Estar inscrito en el Escalafón',
        'Estar colegiado y solvente', 'Tener cinco años de experiencia previa'], c: 3 },
  { q: 'El promedio final mínimo para aprobar un concurso docente es:',
    o: ['60 %', '70 %', '75 %', '80 %'], c: 2 },
  { q: 'Los concursos generales, según el Reglamento, se efectúan:',
    o: ['Del 20 al 30 de enero de cada año', 'En junio de cada año',
        'Cuando lo decida cada centro', 'Cada dos años'], c: 0 },
  { q: 'Un concurso se declara FRACASADO cuando:',
    o: ['No se inscribe ningún candidato', 'Los participantes no alcanzan la nota mínima del 75 %',
        'No se presenta ninguno de los inscritos', 'La junta no logra reunirse'], c: 1 },
  { q: 'La lista que resulta del concurso general tiene una validez de:',
    o: ['Seis meses', 'Dos años', 'Cinco años', 'Un año'], c: 3 },
  { q: 'Las Juntas de Selección designan al docente que ocupará vacantes de nivel:',
    o: ['Distrital, departamental o nacional', 'Solo nacional',
        'Solo del centro educativo', 'Municipal y nacional únicamente'], c: 0 },
  { q: 'El tiempo mínimo de interinato que da derecho a nombramiento en propiedad es:',
    o: ['Tres meses', 'Seis meses consecutivos', 'Un año', 'Dos años'], c: 1 },
  { q: 'La permuta se define como:',
    o: ['El ascenso a un puesto superior', 'El intercambio voluntario de empleos de igual nivel',
        'El movimiento a un puesto de menor nivel', 'La sustitución temporal de un docente'], c: 1 },
  { q: 'Una permuta temporal puede autorizarse por períodos de:',
    o: ['Seis meses a un año', 'Dos a seis años', 'Uno a cuatro años', 'Solo un año'], c: 2 },
  { q: 'El traslado se define en el Estatuto como el movimiento a otro empleo de:',
    o: ['Solo igual nivel', 'Igual o menor nivel', 'Igual o mayor nivel', 'Cualquier nivel'], c: 1 },
  { q: 'El número de causas de traslado que reconoce el Estatuto es:',
    o: ['Tres', 'Cuatro', 'Cinco', 'Seis'], c: 3 },
  { q: 'En un traslado solicitado para otro departamento, el primer orden de prioridad es:',
    o: ['Lugar de origen', 'Enfermedad', 'Integración familiar', 'Seguridad personal'], c: 3 },
  { q: 'Una misma persona no puede ser objeto de movimiento laboral antes de:',
    o: ['Un año desde el movimiento anterior', 'Seis meses', 'Dos años', 'Tres años'], c: 0 },
  { q: 'Los permisos especiales con goce de sueldo tienen un tope anual de:',
    o: ['Quince días', 'Veinte días', 'Treinta días', 'Sesenta días'], c: 2 },
  { q: 'La sanción por falta grave, conforme al Estatuto, puede ser:',
    o: ['Destitución inmediata', 'Amonestación oral únicamente',
        'Multa del 5 % al 10 % del sueldo mensual o suspensión de 8 a 30 días',
        'Traslado a otro departamento'], c: 2 },
  { q: 'Para faltas graves y muy graves, el procedimiento incluye siempre:',
    o: ['Una audiencia de descargo con garantías de legítima defensa',
        'Un informe del consejo de docentes', 'La aprobación de la asociación de padres',
        'Una prueba psicométrica'], c: 0 },
  { q: 'El plazo para solicitar revisión de la evaluación del desempeño es de:',
    o: ['Tres días hábiles', 'Cinco días hábiles', 'Quince días hábiles', 'Diez días hábiles'], c: 3 },
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
  ['🗺️ Recorrió los trámites', () => S.tramites.length === TRAMITES.length],
  ['🃏 Repasó las tarjetas', () => S.fcVistas.length === FC.length],
  ['🧠 Memorama completo', () => !!S.memo],
  ['❓ Quiz contestado', () => !!S.quiz],
  ['🗂️ Clasificó sin error', () => !!S.clasifica],
  ['✍️ Completó los plazos', () => !!S.completa],
  ['⏱️ Ordenó el procedimiento', () => !!S.reto],
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
  ['sec-tramites', '🗺️ Trámites'],
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
  S = { xp: 0, tramites: [], fcVistas: [], nombre: '', sonido: son,
        memo: 0, quiz: 0, clasifica: 0, completa: 0, reto: 0, sopa: 0, concurso: 0,
        casos: 0, concursoNota: 0 };
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  const inp = document.getElementById('constNombre');
  if (inp) inp.value = '';
  _tram = 0; _fc = 0; _qzResp = [];
  trPinta(); fcPinta(); memoInit(); qzPinta(); clInit(); cpPinta(); sopaInit(); cnInit();
  guardar();
  sfx('click');
}

/* ══════════════════ ARRANQUE ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  navPinta();
  trPinta();
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
