/* ══════════════════════════════════════════════════════════════
   📈 ESTADÍSTICAS POR ALUMNO — el científico de datos del aula

   Junta en un solo lugar TODO lo que el maestro ya registra en la
   plataforma y lo convierte en gráficos e interpretaciones por alumno:

   · Notas SACE        → METAS_ADMIN_V1 (grupo activo, d.notas)
   · Asistencia        → d.asistencia (pase de lista) + columna
                         «Inasistencias» de Notas SACE (la oficial)
   · Evaluaciones      → METAS_PLANACCION_V1 (análisis del Plan de Acción)
   · Conducta          → rasgos de personalidad de la boleta (d.notas)
   · Controles         → d.controles (tareas, útiles, permisos…)
   · Misiones          → la nube (tabla `resultados` + `progreso`, las
                         mismas RPC de consulta-nube.html), con caché
                         local para verlo sin señal
   · Lectura (PPM)     → d.lectura — YA QUEDA EL CANAL LISTO para la
                         herramienta de palabras por minuto (ver abajo)

   Por qué es una pestaña de Mi aula y no una página aparte: la lista de
   alumnos, las notas y la asistencia YA viven aquí; el maestro no debe
   copiar nada a ningún lado para ver a su alumno completo.

   El informe imprimible cabe en UNA hoja carta por alumno, a propósito:
   es el papel que acompaña la decisión de aprobar o no aprobar el año,
   y un papel de una hoja se lee, se firma y se archiva.

   ── CANAL DE LECTURA (la herramienta futura de PPM) ──
   Cada registro de lectura se guarda DENTRO del grupo (así viaja solo
   con el espejo del maestro, en METAS_ADMIN_V1) con esta forma:

     d.lectura = [ { f: 'YYYY-MM-DD',   fecha de la toma
                     num: 7,            nº de lista del alumno
                     ppm: 82,           palabras leídas por minuto
                     palabras: 96,      (opcional) palabras del texto
                     errores: 3,        (opcional) errores de lectura
                     texto: '' } ]      (opcional) qué texto leyó

   La herramienta que registre lecturas solo tiene que empujar filas ahí
   (y respetar el recorrido de números al insertar alumnos, ya resuelto
   en adInsertarAlumno). Esta pestaña las dibuja sin tocar nada más.

   NORMATIVA de colores: las calificaciones usan SIEMPRE la escala
   oficial de la plataforma (AD_NOTA_CATS, la misma de la boleta y del
   Plan de Acción) y CADA barra lleva su número escrito al lado: el
   color refuerza, nunca es el único mensaje (daltonismo e impresión
   en blanco y negro). En asistencia: 🚫 ausencia roja, 📝 excusa
   turquesa — par verificado para visión con daltonismo.
══════════════════════════════════════════════════════════════ */

/* alumno elegido en la pestaña (mismo patrón que _adColectaId) */
let _estNum = null;

/* ── ✍️ OBSERVACIÓN DEL DOCENTE EN EL INFORME DEL GRADO ──
   Pedida por el maestro (agosto de 2026) con un caso concreto: tres
   alumnos suyos no aparecen registrados en el SACE —inscribirlos le toca
   a la Dirección— pero sí están en su lista y él los atiende todos los
   días. Ningún número del informe puede contar eso, y sin contarlo el
   papel parece decir que el maestro tiene menos alumnos de los que tiene.

   El bloque SOLO se imprime si el maestro escribió algo: un informe con
   un recuadro de observaciones vacío se lee como un descuido.

   El tope no es capricho. Se midió generando el PDF con el grupo lleno
   (43 alumnos, 8 materias, 4 parciales y el año escolar completo de
   faltas): la hoja aguanta hasta unos 1.000 caracteres y a los 1.200 las
   firmas se van a la página 2. Se deja en 500 —de sobra para lo que se
   escribe de verdad— para que quepa aunque el grupo traiga las
   observaciones automáticas más largas. Subirlo sin volver a medir es
   apostar la hoja. */
const EST_OBS_MAX = 500;

/* ── Nube de misiones: caché local por equipo ──
   NO va en el espejo del maestro (metas-docente-sync): es una copia de
   lo que ya vive en Supabase; cada equipo la refresca cuando puede. */
const EST_NUBE_KEY = 'METAS_STATS_NUBE_V1';
/* Los mismos valores públicos de metas-supabase.js / consulta-nube.html
   (clave anon: solo lee lo que las RPC permiten al docente). */
function estSbConf() {
  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  try {
    url = localStorage.getItem('METAS_SB_URL') || url;
    key = localStorage.getItem('METAS_SB_KEY') || key;
  } catch (_) {}
  return { url, key };
}

function estNubeCache() {
  try { const o = JSON.parse(localStorage.getItem(EST_NUBE_KEY)); return (o && typeof o === 'object') ? o : null; }
  catch (_) { return null; }
}

async function estNubeRefrescar() {
  const { url, key } = estSbConf();
  let doc = null;
  try { doc = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); } catch (_) {}
  if (!doc || !doc.codigo || !doc.clave) return { err: 'sincuenta' };
  if (navigator.onLine === false) return { err: 'sinred' };
  const rpc = async (fn) => {
    const r = await fetch(url + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: doc.codigo, p_clave: doc.clave }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  };
  try {
    const resultados = await rpc('metas_consultar_docente');
    let progreso = [];
    try { progreso = await rpc('metas_consultar_progreso_docente'); } catch (_) {}
    const cache = { t: new Date().toISOString(), resultados, progreso };
    try { localStorage.setItem(EST_NUBE_KEY, JSON.stringify(cache)); } catch (_) {}
    return { ok: 1, cache };
  } catch (e) {
    return { err: 'red', detalle: String(e && e.message || e) };
  }
}

/* ══════════════ CAPA DE DATOS ══════════════
   Todo gráfico e interpretación sale de AQUÍ, nunca directo del
   localStorage: una sola normalización, un solo lugar donde corregir. */

const EST_PARCIALES = ['I', 'II', 'III', 'IV'];

function estNum(v) { const n = Number(v); return (v === '' || v == null || isNaN(n)) ? null : n; }

/* Notas SACE del alumno: por materia y parcial, estado vigente (la
   última nota de CADA materia, regla de la boleta) y promedios. */
function estSace(d, num) {
  const mats = (d.materias || []).slice();
  const val = (p, c) => estNum((((d.notas || {})[p] || {})[c] || {})[num]);
  const porMateria = {};
  mats.forEach(c => {
    const fila = {};
    EST_PARCIALES.forEach(p => { fila[p] = val(p, c); });
    porMateria[c] = fila;
  });
  const promMat = {};
  mats.forEach(c => {
    const xs = EST_PARCIALES.map(p => porMateria[c][p]).filter(x => x != null);
    promMat[c] = xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
  });
  const conDatos = mats.filter(c => promMat[c] != null);
  const promGen = conDatos.length
    ? Math.round(conDatos.reduce((s, c) => s + promMat[c], 0) / conDatos.length) : null;
  const promParcial = {};
  EST_PARCIALES.forEach(p => {
    const xs = mats.map(c => porMateria[c][p]).filter(x => x != null);
    promParcial[p] = xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
  });
  /* estado vigente por materia + su parcial anterior (regla de la boleta:
     por materia, para que un parcial a medio llenar no arrastre al resto) */
  const estado = mats.map(c => {
    const s = EST_PARCIALES.map(p => ({ p, v: porMateria[c][p] })).filter(x => x.v != null);
    if (!s.length) return null;
    const u = s[s.length - 1], ant = s.length >= 2 ? s[s.length - 2] : null;
    return { mat: c, val: u.v, p: u.p, prev: ant ? ant.v : null, pPrev: ant ? ant.p : null };
  }).filter(Boolean);
  const inasis = EST_PARCIALES
    .map(p => estNum((((d.notas || {})[p] || {})['Inasistencias'] || {})[num]))
    .filter(x => x != null);
  const parcialesConDatos = EST_PARCIALES.filter(p => mats.some(c => porMateria[c][p] != null));
  const anioCompleto = conDatos.length > 0 &&
    conDatos.every(c => EST_PARCIALES.every(p => porMateria[c][p] != null));
  return {
    mats, porMateria, promMat, promGen, promParcial, estado,
    inasisSace: inasis.length ? inasis.reduce((a, b) => a + b, 0) : null,
    parcialesConDatos, anioCompleto, matsConDatos: conDatos,
  };
}

/* Asistencia del pase de lista, agrupada por mes */
function estAsistencia(d, num) {
  const meses = {};
  let totalA = 0, totalE = 0;
  (d.asistencia || []).forEach(r => {
    const marca = (r.aus || {})[num] || (r.aus || {})[String(num)];
    if (!marca) return;
    const m = String(r.f || '').slice(0, 7);
    if (!m) return;
    const fila = meses[m] || (meses[m] = { mes: m, A: 0, E: 0 });
    if (marca === 'A') { fila.A++; totalA++; } else if (marca === 'E') { fila.E++; totalE++; }
  });
  const lista = Object.values(meses).sort((a, b) => a.mes < b.mes ? -1 : 1);
  return { meses: lista, totalA, totalE, diasConRegistro: (d.asistencia || []).length };
}

/* Evaluaciones del Plan de Acción de ESTE grupo con nota de este alumno */
function estEvaluaciones(d, num) {
  let plan = { analisis: [] };
  try { plan = JSON.parse(localStorage.getItem('METAS_PLANACCION_V1')) || { analisis: [] }; } catch (_) {}
  const filas = [];
  (plan.analisis || []).forEach(a => {
    if (!a || !Array.isArray(a.students)) return;
    if (typeof adSugMismoGrupo === 'function' && !adSugMismoGrupo(a, d)) return;
    const s = a.students.find(x => String(x.num) === String(num));
    if (!s) return;
    filas.push({
      t: a.t || '', fechaPrueba: a.fechaPrueba || '', parcial: a.parcial || '',
      evaluacion: a.evaluacion || 'Evaluación', forma: a.forma || '',
      materia: (typeof adSugMateriaNom === 'function' ? adSugMateriaNom(a) : (a.materia || '')) || '—',
      nota: (typeof s.nota === 'number') ? s.nota : null,
      nsp: s.nota === 'NSP',
    });
  });
  filas.sort((x, y) => String(x.fechaPrueba || x.t).localeCompare(String(y.fechaPrueba || y.t)));
  return filas;
}

/* Conducta: rasgos de personalidad (letras S/MB/B… de la boleta) */
function estConducta(d, num) {
  const val = (p, c) => {
    const v = (((d.notas || {})[p] || {})[c] || {})[num];
    return (v == null || v === '') ? '' : String(v).toUpperCase().trim();
  };
  return AD_PERSONALIDAD.map(c => {
    const porParcial = {};
    EST_PARCIALES.forEach(p => { porParcial[p] = val(p, c); });
    const xs = EST_PARCIALES.map(p => porParcial[p]).filter(Boolean);
    let fin = '—';
    if (xs.length && !xs.some(x => !AD_PERS_NUM[x])) {
      const n = Math.round(xs.reduce((t, x) => t + AD_PERS_NUM[x], 0) / xs.length);
      fin = AD_PERS_DE_NUM[Math.max(1, Math.min(4, n))];
    }
    return { rasgo: c, porParcial, final: fin, valores: xs };
  }).filter(r => r.valores.length);
}

/* Controles del aula: cuántos cumplió de los que tienen alguna marca */
function estControles(d, num) {
  const filas = (d.controles || []).map(c => ({
    nombre: c.nombre, icono: c.icono || '✅', fecha: c.fecha || '',
    conMarcas: Object.keys(c.datos || {}).length > 0,
    marcado: !!((c.datos || {})[num] != null && (c.datos || {})[num] !== ''),
  })).filter(c => c.conMarcas);
  return { hechos: filas.filter(c => c.marcado).length, de: filas.length, filas };
}

/* Lectura (PPM): lo que registra la pestaña 📖 Lectura (Control de
   lectura); comp/compDe traen la comprensión oral de cada toma.
   Cada toma se lleva su POSICIÓN en d.lectura (i): es lo que permite
   quitar una toma suelta desde esta pestaña sin tocar las demás. */
function estLectura(d, num) {
  return (d.lectura || [])
    .map((r, i) => ({ r, i }))
    .filter(o => o.r && String(o.r.num) === String(num) && estNum(o.r.ppm) != null && o.r.f)
    .map(o => ({ i: o.i, f: o.r.f, ppm: Number(o.r.ppm), palabras: estNum(o.r.palabras), errores: estNum(o.r.errores),
                 texto: o.r.titulo || o.r.texto || '', comp: estNum(o.r.comp), compDe: estNum(o.r.compDe) }))
    .sort((a, b) => String(a.f).localeCompare(String(b.f)));
}

/* Quita UNA toma del expediente. Se busca por su posición, pero antes
   se comprueba la firma (alumno, fecha, palabras por minuto): si entre
   el dibujo de la pantalla y el toque del maestro el arreglo cambió
   —otra pestaña abierta, una sincronización—, se busca la toma de
   verdad en vez de cortar la fila equivocada. Borrar la toma que no
   era sería peor que no borrar ninguna. */
function estQuitarToma(d, i, firma) {
  const arr = d.lectura || [];
  const igual = r => r && String(r.num) === String(firma.num) && r.f === firma.f && Number(r.ppm) === Number(firma.ppm);
  const j = igual(arr[i]) ? i : arr.findIndex(igual);
  if (j < 0) return false;
  arr.splice(j, 1);
  return true;
}

/* De lo que el niño escribió a mano —«6», «6º», «6to», «6º-1», «6 2»,
   «6to A», «61»— saca el grado y, SI LA ESCRIBIÓ, la sección.
   El «61» de corrido no es un capricho: es como queda «6º-1» cuando solo se
   miran los dígitos, y es lo que llega de verdad. */
function estParteGrupo(txt, gDig) {
  const s = String(txt || '').trim();
  const ORD = '(?:[ºo°]|er|do|ro|to|mo|vo|no)?';
  let m = s.match(new RegExp('^\\s*(\\d{1,2})\\s*' + ORD + '\\s*[-–—/ ]\\s*([0-9A-Za-zÁÉÍÓÚÑ]{1,3})\\s*$', 'i'));
  if (m) return { grado: m[1], seccion: m[2].toUpperCase() };
  m = s.match(new RegExp('^\\s*(\\d{1,2})\\s*' + ORD + '\\s*$', 'i'));
  if (m) {
    const dd = m[1];
    if (gDig && dd.length === gDig.length + 1 && dd.indexOf(gDig) === 0) {
      return { grado: gDig, seccion: dd.slice(gDig.length) };
    }
    return { grado: dd, seccion: '' };
  }
  return { grado: String(txt || '').replace(/\D/g, ''), seccion: '' };
}

/* Cuántos grupos tiene el maestro en ESE grado. De esto depende que una fila
   sin sección se pueda asignar o no: con un solo 6º no hay duda; con 6º-1 y
   6º-2, un «6» pelado no dice de quién es. */
function estGruposDelGrado(gDig) {
  try {
    const st = (typeof adState === 'function') ? adState() : null;
    const gs = (st && st.grupos) || [];
    return gs.filter(g => String(g.grado || '').replace(/\D/g, '') === gDig).length;
  } catch (_) { return 0; }
}

/* La MISMA normalización que `metas_norm` del servidor: sin acentos, sin
   espacios ni signos, en mayúsculas. «José Ángel Pérez-Núñez» →
   'JOSEANGELPEREZNUNEZ'. Se usa para que «Ana López» y «ana lopez» dejen de
   ser dos niñas distintas en la pantalla del maestro. */
function estNorm(t) {
  return String(t || '').toUpperCase()
    .replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U').replace(/Ñ/g, 'N')
    .replace(/[^A-Z0-9]/g, '');
}

/* Misiones practicadas: filtra la caché de la nube para este alumno.
   ------------------------------------------------------------------
   ⚠️ Aquí estaba el fallo que se llevaba por delante el informe que FIRMA LA
   FAMILIA. Se emparejaba por número de lista y por los dígitos del grado, y
   NO se miraba la sección nunca: el número 7 de 6º-1 y el número 7 de 6º-2
   eran el mismo alumno, así que la madre firmaba un informe con la práctica
   del hijo de otra. El resto de Mi aula sí distinguía sección; el fallo vivía
   solo en el bloque que viene de la nube.

   La regla, ahora, en tres casos y ninguno inventa nada:

   · el niño escribió su sección y NO es esta  → fuera, sin dudarlo;
   · escribió su sección y es esta             → dentro;
   · no escribió sección                       → depende: si el maestro tiene
     un solo grupo en ese grado no hay duda y entra; si tiene dos, NO SE PUEDE
     SABER de quién es, así que no se cuenta y se le dice cuántas quedaron
     fuera. Contarla sería volver a meterle en el informe el trabajo de otro
     niño, que es justo lo que se está arreglando.

   Se enseña también el nombre que llegó de la nube para que el maestro
   detecte un número mal escrito. */
function estMisiones(d, num) {
  const cache = estNubeCache();
  if (!cache) return null;
  const dig = s => String(s || '').replace(/\D/g, '');
  const gDig = dig(d.grado);
  const secGrupo = String(d.seccion || '').trim().toUpperCase();
  const variosDelGrado = estGruposDelGrado(gDig) > 1;
  let sinSeccion = 0;

  const esDeEsteAlumno = r => {
    const n = String(r.codigo_lista || '').match(/^\d+/);
    if (!n || n[0] !== String(num)) return false;
    const g = estParteGrupo(r.grado, gDig);
    if (gDig && g.grado && g.grado !== gDig) return false;
    if (g.seccion && secGrupo) return g.seccion === secGrupo;
    if (!g.seccion && secGrupo && variosDelGrado) { sinSeccion++; return false; }
    return true;
  };

  const filas = (cache.resultados || []).filter(esDeEsteAlumno);
  const evals = filas.filter(r => (r.tipo === 'evaluacion' || r.tipo === 'prueba_operativa') && typeof r.nota === 'number');
  /* La conceptual y la operativa se guardan APARTE. Estaban fundidas en un
     solo «mejor», y son dos pruebas distintas: una pregunta lo que sabe y la
     otra lo que hace. Un alumno con 90 en definiciones y 40 haciendo cuentas
     salía con un 90 y el maestro no veía el problema, que es justo el dato por
     el que abre esta pantalla. */
  const porMision = {};
  evals.forEach(r => {
    const m = porMision[r.mision] || (porMision[r.mision] = {
      mision: r.mision, intentos: 0, mejor: null, ult: '',
      conceptual: null, operativa: null
    });
    m.intentos++;
    const base = (typeof r.base === 'number' && r.base > 0) ? r.base : 100;
    const pct = Math.round((r.nota / base) * 100);
    if (m.mejor === null || pct > m.mejor) m.mejor = pct;
    const k = r.tipo === 'prueba_operativa' ? 'operativa' : 'conceptual';
    if (m[k] === null || pct > m[k]) m[k] = pct;
    const f = r.fecha || r.creado_en || '';
    if (f > m.ult) m.ult = f;
  });
  /* materia de cada misión, desde el catálogo (se cuenta, no se escribe) */
  const folderDe = m => {
    const seg = String(m.url || '').split('/')[1] || '';
    try { return decodeURIComponent(seg).toLowerCase(); } catch (_) { return seg.toLowerCase(); }
  };
  const subjDe = {}, tituloDe = {};
  if (typeof MISSIONS !== 'undefined') MISSIONS.forEach(m => {
    subjDe[folderDe(m)] = m.subject || '';
    tituloDe[folderDe(m)] = m.title || '';
  });
  const lista = Object.values(porMision).map(m => {
    const k = String(m.mision || '').toLowerCase();
    m.materia = subjDe[k] || '';
    /* Se enseña el TÍTULO, no el nombre de la carpeta: el maestro leía
       «2y3ciclo-fracciones» en el informe que le da a la familia. Si la misión
       ya no está en el catálogo se deja la carpeta, que es mejor que nada. */
    m.titulo = tituloDe[k] || m.mision;
    return m;
  }).sort((a, b) => b.ult < a.ult ? -1 : 1);
  const dominadas = lista.filter(m => m.mejor != null && m.mejor >= 70).length;
  /* «Ana López» y «ana lopez» son la misma niña. Se agrupa por la forma
     normalizada y se enseña la que escribió mejor —la más larga—, que es la
     que el maestro reconoce. */
  const porNorm = {};
  filas.map(r => r.alumno).filter(Boolean).forEach(nm => {
    const k = estNorm(nm);
    if (!k) return;
    if (!porNorm[k] || nm.length > porNorm[k].length) porNorm[k] = nm;
  });
  const nombres = Object.values(porNorm);
  const ultAct = filas.map(r => r.fecha || r.creado_en || '').sort().pop() || '';
  /* El progreso va por la MISMA puerta: dos reglas distintas darían un informe
     donde las misiones son de un niño y los minutos de otro. */
  const prog = (cache.progreso || []).filter(esDeEsteAlumno);
  let minutos = null, secciones = null;
  prog.forEach(p => {
    const r = p.resumen || {};
    if (typeof r.minutos === 'number') minutos = (minutos || 0) + r.minutos;
    if (typeof r.secciones === 'number') secciones = (secciones || 0) + r.secciones;
  });
  return { t: cache.t, filas: lista, intentos: evals.length, dominadas, nombres, ultAct, minutos, secciones, sinSeccion };
}

/* Todo el alumno en un solo objeto: la ÚNICA entrada de gráficos e informes */
function estDatosAlumno(d, al) {
  return {
    al,
    grado: parseInt(String(d.grado || '').replace(/\D/g, ''), 10) || null,
    /* La sección viaja con el resto: la necesita el aviso de los registros que
       llegaron sin ella, para poder decirle al maestro qué tiene que escribir
       el alumno («6º-1»), y no una sección inventada. */
    seccion: String(d.seccion || ''),
    sace: estSace(d, al.num),
    asis: estAsistencia(d, al.num),
    evals: estEvaluaciones(d, al.num),
    conducta: estConducta(d, al.num),
    controles: estControles(d, al.num),
    lectura: estLectura(d, al.num),
    misiones: estMisiones(d, al.num),
  };
}

/* ══════════════ INTERPRETACIÓN ══════════════
   Reglas honestas: cada observación dice DE QUÉ dato sale y habla de
   coincidencias, no de causas. Umbral ±5 para no leer ruido (la misma
   regla de la boleta). */

function estTendencia(sace) {
  const parcs = sace.parcialesConDatos;
  for (let j = parcs.length - 1; j > 0; j--) {
    for (let i = j - 1; i >= 0; i--) {
      const comunes = sace.mats.filter(c => sace.porMateria[c][parcs[i]] != null && sace.porMateria[c][parcs[j]] != null);
      if (comunes.length < 2) continue;
      const prom = p => Math.round(comunes.reduce((s, c) => s + sace.porMateria[c][p], 0) / comunes.length);
      const a = prom(parcs[i]), b = prom(parcs[j]);
      if (b <= a - 5) return { tipo: 'baja', de: a, a: b, pDe: parcs[i], pA: parcs[j] };
      if (b >= a + 5) return { tipo: 'sube', de: a, a: b, pDe: parcs[i], pA: parcs[j] };
      return { tipo: 'plana', de: a, a: b, pDe: parcs[i], pA: parcs[j] };
    }
  }
  return null;
}

function estObservaciones(x) {
  const obs = [];
  const s = x.sace;

  const tend = estTendencia(s);
  if (tend && tend.tipo === 'baja') obs.push({ ic: '📉', nivel: 'alerta', txt: 'El promedio bajó de ' + tend.de + ' (parcial ' + tend.pDe + ') a ' + tend.a + ' (parcial ' + tend.pA + '), comparando las mismas materias.' });
  if (tend && tend.tipo === 'sube') obs.push({ ic: '📈', nivel: 'bien', txt: 'El promedio subió de ' + tend.de + ' (parcial ' + tend.pDe + ') a ' + tend.a + ' (parcial ' + tend.pA + '), comparando las mismas materias.' });

  const bajas = s.estado.filter(e => e.val < 70).sort((a, b) => a.val - b.val);
  if (bajas.length) obs.push({ ic: '🚨', nivel: 'alerta', txt: 'Hoy está por debajo de 70 en ' + bajas.map(e => e.mat + ' (' + e.val + ')').join(', ') + '. Ahí es donde el refuerzo cambia el año.' });

  const caidas = s.estado.filter(e => e.prev != null && e.val - e.prev <= -5).sort((a, b) => (a.val - a.prev) - (b.val - b.prev));
  if (caidas.length) {
    const c = caidas[0];
    obs.push({ ic: '⚠️', nivel: 'ojo', txt: c.mat + ' cayó de ' + c.prev + ' a ' + c.val + ' entre el parcial ' + c.pPrev + ' y el ' + c.p + '. Conviene preguntar qué cambió antes de que se vuelva costumbre.' });
  }

  /* Faltas: el mes con más ausencias sin excusa, y si coincide con caída */
  if (x.asis.totalA > 0) {
    const peor = x.asis.meses.slice().sort((a, b) => b.A - a.A)[0];
    if (peor && peor.A >= 3) {
      let extra = '';
      if (tend && tend.tipo === 'baja') extra = ' Las faltas y la caída de notas suelen ir juntas: vale la pena mirar ese mes.';
      obs.push({ ic: '📋', nivel: 'ojo', txt: 'En ' + adMesLabel(peor.mes) + ' acumuló ' + peor.A + ' ausencia(s) sin excusa (pase de lista).' + extra });
    }
  }

  const nsp = x.evals.filter(e => e.nsp);
  if (nsp.length) obs.push({ ic: '📝', nivel: 'ojo', txt: 'Tiene ' + nsp.length + ' evaluación(es) sin presentar (NSP): ' + nsp.slice(0, 3).map(e => '«' + e.evaluacion + '»').join(', ') + (nsp.length > 3 ? '…' : '') + '. Prográmalas antes del cierre del parcial.' });

  /* Misiones: la práctica junto a la nota oficial de esa materia */
  if (x.misiones && x.misiones.intentos > 0) {
    obs.push({ ic: '🚀', nivel: 'bien', txt: 'Practicó misiones de M.E.T.A.S.: ' + x.misiones.intentos + ' evaluación(es) calificada(s), ' + x.misiones.dominadas + ' misión(es) dominada(s) con 70 o más.' });
    const porMat = {};
    x.misiones.filas.forEach(m => {
      if (!m.materia || m.mejor == null) return;
      const k = m.materia;
      const r = porMat[k] || (porMat[k] = { mejores: [] });
      r.mejores.push(m.mejor);
    });
    Object.keys(porMat).forEach(k => {
      const mejores = porMat[k].mejores;
      const promMis = Math.round(mejores.reduce((a, b) => a + b, 0) / mejores.length);
      const col = (typeof adSugColumna === 'function') ? adSugColumna((typeof adSugMateriaNom === 'function' ? adSugMateriaNom({ materia: k }) : k), s.mats) : '';
      const vig = col ? s.estado.find(e => e.mat === col) : null;
      if (vig && promMis >= 80 && vig.val < 70) {
        obs.push({ ic: '💡', nivel: 'bien', txt: 'En las misiones de ' + col + ' promedia ' + promMis + ', pero su nota oficial está en ' + vig.val + ': la base la tiene; conviene revisar qué pasa en las pruebas del aula.' });
      }
    });
  } else if (x.misiones && x.misiones.intentos === 0) {
    obs.push({ ic: '🚀', nivel: 'ojo', txt: 'No aparece práctica de misiones en la nube. Si tiene acceso a un teléfono, las misiones son refuerzo gratuito en casa.' });
  }

  /* Conducta: rasgos en lo más bajo de la escala (solo si no son todos) */
  const bajosC = x.conducta.filter(r => r.valores.length && AD_PERS_NUM[r.valores[r.valores.length - 1]] === 1);
  if (bajosC.length && bajosC.length < x.conducta.length) {
    obs.push({ ic: '🧭', nivel: 'ojo', txt: 'Rasgos de personalidad marcados en lo más bajo: ' + bajosC.map(r => r.rasgo).join(', ') + '.' });
  }

  if (x.controles.de >= 3 && x.controles.hechos / x.controles.de < 0.5) {
    obs.push({ ic: '✅', nivel: 'ojo', txt: 'Cumplió ' + x.controles.hechos + ' de ' + x.controles.de + ' controles del aula (tareas, útiles…): menos de la mitad.' });
  }

  if (x.lectura.length) {
    const ultimo = x.lectura[x.lectura.length - 1];
    /* con las normas cargadas, el nivel se dice con su banda; sin ellas,
       solo la evolución */
    let nivelTxt = '';
    if (typeof lecNivelVelocidad === 'function' && x.grado) {
      const nv = lecNivelVelocidad(x.grado, ultimo.ppm);
      nivelTxt = ' Para ' + x.grado + 'º es nivel «' + nv.etiqueta + '» (banda ' + nv.banda[0] + '–' + nv.banda[1] + ').';
    }
    let compTxt = '';
    if (ultimo.comp != null && ultimo.compDe) {
      compTxt = ' Comprensión: ' + ultimo.comp + ' de ' + ultimo.compDe + '.';
      if (typeof lecNivelComprension === 'function') {
        const nc = lecNivelComprension(ultimo.comp, ultimo.compDe);
        if (nc && nc.pct < 60 && ultimo.ppm >= 90) compTxt += ' Lee veloz pero comprende poco: pedirle que baje la marcha y lea para contar.';
      }
    }
    if (x.lectura.length >= 2) {
      const primero = x.lectura[0];
      const dd = ultimo.ppm - primero.ppm;
      obs.push({ ic: '📖', nivel: dd >= 0 ? 'bien' : 'ojo', txt: 'Lectura: de ' + primero.ppm + ' a ' + ultimo.ppm + ' palabras por minuto entre ' + adFechaBonita(primero.f) + ' y ' + adFechaBonita(ultimo.f) + (dd >= 0 ? ' (va subiendo).' : ' (bajó: conviene repetir la toma).') + nivelTxt + compTxt });
    } else {
      obs.push({ ic: '📖', nivel: 'bien', txt: 'Lectura: ' + ultimo.ppm + ' palabras por minuto el ' + adFechaBonita(ultimo.f) + '.' + nivelTxt + compTxt });
    }
  }

  if (!obs.length) obs.push({ ic: '🕊️', nivel: 'bien', txt: 'Sin señales de alarma con los datos guardados hasta hoy.' });
  return obs;
}

/* Puntaje de riesgo para ordenar «a quién mirar primero» (no se imprime:
   es una brújula del maestro, no una etiqueta del alumno) */
function estRiesgo(x) {
  let pts = 0; const razones = [];
  const bajas = x.sace.estado.filter(e => e.val < 70);
  if (bajas.length) { pts += bajas.length * 3; razones.push(bajas.length + ' materia(s) bajo 70'); }
  const tend = estTendencia(x.sace);
  if (tend && tend.tipo === 'baja') { pts += 2; razones.push('promedio en caída'); }
  if (x.sace.inasisSace != null && x.sace.inasisSace >= 10) { pts += 2; razones.push(x.sace.inasisSace + ' inasistencias'); }
  else if (x.asis.totalA >= 5) { pts += 1; razones.push(x.asis.totalA + ' ausencias sin excusa'); }
  const nsp = x.evals.filter(e => e.nsp).length;
  if (nsp) { pts += nsp; razones.push(nsp + ' NSP'); }
  return { pts, razones };
}

/* ══════════════ GRÁFICOS (SVG puro, sin librerías) ══════════════
   Marcas finas, rejilla de un pelo, número visible en cada dato: el
   papel y el teléfono sin señal los pintan igual que la pantalla. */

const EST_INK = '#33415c', EST_MUTED = '#7286a8', EST_GRID = '#e3e8f1',
      EST_AZUL = '#1e3a7c', EST_ROJO70 = '#c0392b',
      EST_AUS = '#dc2626', EST_EXC = '#0891b2';

/* Barras horizontales por materia, con la línea del 70 y la marca del
   parcial anterior — el mismo lenguaje del gráfico de la boleta. */
function estGBarras(filas, opts) {
  opts = opts || {};
  if (!filas.length) return '';
  const rowH = opts.compacto ? 17 : 22, gap = 5, padT = 8, padB = 14;
  const labelW = 112, barX = labelW + 6, W = opts.w || 420;
  const barMax = W - barX - 50;
  const H = padT + filas.length * (rowH + gap) - gap + padB;
  const x70 = barX + barMax * 0.7;
  const gridBot = padT + filas.length * (rowH + gap) - gap;
  const bars = filas.map((it, i) => {
    const y = padT + i * (rowH + gap);
    const w = Math.max(2, barMax * (Math.min(100, Math.max(0, it.val)) / 100));
    const color = adNotaCat(it.val).color;
    const lbl = it.mat.length > 18 ? it.mat.slice(0, 17) + '…' : it.mat;
    let marca = '', delta = '';
    if (it.prev != null) {
      const xp = barX + barMax * (Math.min(100, Math.max(0, it.prev)) / 100);
      const dd = it.val - it.prev;
      const dTxt = dd > 0 ? '▲+' + dd : dd < 0 ? '▼' + dd : '· igual';
      const dCol = dd > 0 ? '#16a34a' : dd < 0 ? '#dc2626' : EST_MUTED;
      marca = '<rect x="' + (xp - 0.7).toFixed(1) + '" y="' + (y + 1) + '" width="1.4" height="' + (rowH - 2) + '" fill="#0f2350" opacity="0.55"/>';
      delta = '<text x="' + (barX + barMax + 4).toFixed(1) + '" y="' + (y + rowH - 1.5).toFixed(1) + '" font-size="7.5" font-weight="bold" fill="' + dCol + '">' + dTxt + '</text>';
    }
    return '<g><title>' + adEsc(it.mat) + ': ' + it.val + ' (parcial ' + it.p + (it.prev != null ? '; venía de ' + it.prev + ' en el ' + it.pPrev : '') + ')</title>' +
      '<text x="' + labelW + '" y="' + (y + rowH * 0.68).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + EST_INK + '">' + adEsc(lbl) + '</text>' +
      '<rect x="' + barX + '" y="' + (y + 2) + '" width="' + barMax + '" height="' + (rowH - 4) + '" rx="3" fill="#eef2f7"/>' +
      '<rect x="' + barX + '" y="' + (y + 2) + '" width="' + w.toFixed(1) + '" height="' + (rowH - 4) + '" rx="3" fill="' + color + '"/>' +
      marca +
      '<text x="' + (barX + barMax + 4).toFixed(1) + '" y="' + (y + rowH * 0.55).toFixed(1) + '" font-size="10.5" font-weight="bold" fill="' + EST_INK + '">' + it.val + '</text>' +
      delta + '</g>';
  }).join('');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Notas por materia" style="max-width:' + (opts.maxw || 460) + 'px;font-family:inherit">' +
    '<line x1="' + x70.toFixed(1) + '" y1="' + (padT - 2) + '" x2="' + x70.toFixed(1) + '" y2="' + gridBot + '" stroke="' + EST_ROJO70 + '" stroke-width="0.9" stroke-dasharray="3 2"/>' +
    '<text x="' + x70.toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle" font-size="8" fill="' + EST_ROJO70 + '">70 · aprobación</text>' +
    bars + '</svg>';
}

function estLeyendaNotas() {
  return '<div class="est-leyenda">' + AD_NOTA_CATS.map(c =>
    '<span><i style="background:' + c.color + '"></i>' + (c.min > 0 ? c.min + '+' : '&lt;60') + ' ' + c.label + '</span>').join('') +
    '<span><i style="background:#0f2350"></i>| parcial anterior</span></div>';
}

/* Evolución por parcial: cada materia en gris fino (contexto), el
   promedio en azul grueso — se lee la historia sin enredo de colores. */
function estGEvolucion(sace, opts) {
  opts = opts || {};
  const parcs = EST_PARCIALES;
  const W = opts.w || 420, H = opts.h || 170;
  const padL = 30, padR = 46, padT = 12, padB = 22;
  const iw = W - padL - padR, ih = H - padT - padB;
  const X = i => padL + (parcs.length === 1 ? iw / 2 : i * (iw / (parcs.length - 1)));
  const Y = v => padT + ih * (1 - Math.min(100, Math.max(0, v)) / 100);
  const grid = [0, 20, 40, 60, 80, 100].map(v =>
    '<line x1="' + padL + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(v).toFixed(1) + '" stroke="' + EST_GRID + '" stroke-width="1"/>' +
    '<text x="' + (padL - 4) + '" y="' + (Y(v) + 3).toFixed(1) + '" text-anchor="end" font-size="8" fill="' + EST_MUTED + '">' + v + '</text>').join('');
  const linea70 = '<line x1="' + padL + '" y1="' + Y(70).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(70).toFixed(1) + '" stroke="' + EST_ROJO70 + '" stroke-width="0.9" stroke-dasharray="3 2"/>';
  const ejes = parcs.map((p, i) =>
    '<text x="' + X(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="9" fill="' + EST_MUTED + '">' + p + '</text>').join('');
  const path = vals => {
    const pts = vals.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
    if (pts.length < 2) return '';
    return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  };
  const materias = sace.mats.map(c => {
    const vals = parcs.map(p => sace.porMateria[c][p]);
    const dPath = path(vals);
    if (!dPath) return '';
    return '<path d="' + dPath + '" fill="none" stroke="#c7cfdd" stroke-width="1.3" stroke-linejoin="round"><title>' + adEsc(c) + '</title></path>';
  }).join('');
  const proms = parcs.map(p => sace.promParcial[p]);
  const promPath = path(proms);
  const promLinea = promPath ? '<path d="' + promPath + '" fill="none" stroke="' + EST_AZUL + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' : '';
  const puntos = proms.map((v, i) => v == null ? '' :
    '<g><title>Promedio parcial ' + parcs[i] + ': ' + v + '</title>' +
    '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4.5" fill="' + EST_AZUL + '" stroke="#fff" stroke-width="2"/>' +
    '<text x="' + X(i).toFixed(1) + '" y="' + (Y(v) - 8).toFixed(1) + '" text-anchor="middle" font-size="9.5" font-weight="bold" fill="' + EST_INK + '">' + v + '</text></g>').join('');
  const iUlt = (() => { let k = -1; proms.forEach((v, i) => { if (v != null) k = i; }); return k; })();
  /* con los cuatro parciales llenos el último punto queda pegado al borde
     derecho y la palabra se salía del dibujo: ahí la etiqueta va DEBAJO
     del punto, no a su lado */
  const etiqueta = iUlt < 0 ? '' : (iUlt === parcs.length - 1
    ? '<text x="' + X(iUlt).toFixed(1) + '" y="' + (Y(proms[iUlt]) + 14).toFixed(1) + '" text-anchor="end" font-size="8.5" font-weight="bold" fill="' + EST_AZUL + '">Promedio</text>'
    : '<text x="' + (X(iUlt) + 8).toFixed(1) + '" y="' + (Y(proms[iUlt]) + 3.5).toFixed(1) + '" font-size="8.5" font-weight="bold" fill="' + EST_AZUL + '">Promedio</text>');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Evolución del promedio por parcial" style="max-width:' + (opts.maxw || 460) + 'px;font-family:inherit">' +
    grid + linea70 + materias + promLinea + puntos + etiqueta + ejes + '</svg>';
}

/* Asistencia por mes: columnas finas al lado (🚫 roja, 📝 turquesa),
   con el número encima — nunca solo el color. */
function estGAsis(meses, opts) {
  opts = opts || {};
  if (!meses.length) return '';
  const W = opts.w || 420, H = opts.h || 150;
  const padL = 26, padR = 8, padT = 14, padB = 24;
  const iw = W - padL - padR, ih = H - padT - padB;
  const maxV = Math.max(2, ...meses.map(m => Math.max(m.A, m.E)));
  const grupoW = iw / meses.length;
  const barW = Math.min(16, Math.max(7, (grupoW - 10) / 2));
  const Y = v => padT + ih * (1 - v / maxV);
  const ticks = [];
  for (let t = 0; t <= maxV; t += Math.max(1, Math.ceil(maxV / 4))) ticks.push(t);
  const grid = ticks.map(v =>
    '<line x1="' + padL + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(v).toFixed(1) + '" stroke="' + EST_GRID + '" stroke-width="1"/>' +
    '<text x="' + (padL - 4) + '" y="' + (Y(v) + 3).toFixed(1) + '" text-anchor="end" font-size="8" fill="' + EST_MUTED + '">' + v + '</text>').join('');
  const cols = meses.map((m, i) => {
    const cx = padL + i * grupoW + grupoW / 2;
    const mesTxt = adMesLabel(m.mes).split(' ')[0].slice(0, 3);
    const barra = (v, dx, color, nom, ic) => {
      if (!v) return '';
      const h = Math.max(2, ih * v / maxV);
      const y = padT + ih - h;
      return '<g><title>' + ic + ' ' + nom + ' en ' + adEsc(adMesLabel(m.mes)) + ': ' + v + '</title>' +
        '<rect x="' + (cx + dx - barW / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2.5" fill="' + color + '"/>' +
        '<text x="' + (cx + dx).toFixed(1) + '" y="' + (y - 3).toFixed(1) + '" text-anchor="middle" font-size="8.5" font-weight="bold" fill="' + EST_INK + '">' + v + '</text></g>';
    };
    return barra(m.A, -(barW / 2 + 1), EST_AUS, 'ausencias', '🚫') +
      barra(m.E, barW / 2 + 1, EST_EXC, 'con excusa', '📝') +
      '<text x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="8.5" fill="' + EST_MUTED + '">' + mesTxt + '</text>';
  }).join('');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Faltas por mes" style="max-width:' + (opts.maxw || 460) + 'px;font-family:inherit">' +
    grid + cols + '</svg>' +
    '<div class="est-leyenda"><span><i style="background:' + EST_AUS + '"></i>🚫 Ausencias</span>' +
    '<span><i style="background:' + EST_EXC + '"></i>📝 Con excusa</span></div>';
}

/* Línea sobre fechas (lectura PPM hoy; sirve para cualquier medida futura) */
function estGSerieFechas(puntos, opts) {
  opts = opts || {};
  if (puntos.length < 1) return '';
  const W = opts.w || 420, H = opts.h || 150;
  const padL = 32, padR = 14, padT = 14, padB = 24;
  const iw = W - padL - padR, ih = H - padT - padB;
  const vals = puntos.map(p => p.v);
  const maxV = Math.max(...vals) * 1.15, minV = Math.min(0, Math.min(...vals));
  const X = i => padL + (puntos.length === 1 ? iw / 2 : i * (iw / (puntos.length - 1)));
  const Y = v => padT + ih * (1 - (v - minV) / (maxV - minV || 1));
  const ticks = [0, Math.round(maxV / 2), Math.round(maxV)];
  const grid = ticks.map(v =>
    '<line x1="' + padL + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + Y(v).toFixed(1) + '" stroke="' + EST_GRID + '" stroke-width="1"/>' +
    '<text x="' + (padL - 4) + '" y="' + (Y(v) + 3).toFixed(1) + '" text-anchor="end" font-size="8" fill="' + EST_MUTED + '">' + v + '</text>').join('');
  const path = puntos.length >= 2
    ? '<path d="M' + puntos.map((p, i) => X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' L') + '" fill="none" stroke="' + EST_AZUL + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' : '';
  const dots = puntos.map((p, i) =>
    '<g><title>' + adEsc(p.titulo || '') + '</title>' +
    '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="4.5" fill="' + EST_AZUL + '" stroke="#fff" stroke-width="2"/>' +
    ((i === 0 || i === puntos.length - 1 || p.v === Math.max(...vals))
      ? '<text x="' + X(i).toFixed(1) + '" y="' + (Y(p.v) - 8).toFixed(1) + '" text-anchor="middle" font-size="9.5" font-weight="bold" fill="' + EST_INK + '">' + p.v + '</text>' : '') +
    '</g>').join('');
  const fechas = puntos.map((p, i) =>
    (i === 0 || i === puntos.length - 1 || puntos.length <= 4)
      ? '<text x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="8" fill="' + EST_MUTED + '">' + adEsc(p.x) + '</text>' : '').join('');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + adEsc(opts.aria || 'Serie') + '" style="max-width:' + (opts.maxw || 460) + 'px;font-family:inherit">' +
    grid + path + dots + fechas + '</svg>';
}

/* ══════════════ DECISIÓN DEL AÑO ══════════════
   La MISMA normativa de la boleta (Primero y Segundo Ciclo, Honduras):
   se aprueba con nota final de 70 o más en CADA materia; el promedio
   general no salva una materia baja. Con los cuatro parciales llenos es
   veredicto; antes, es una proyección y el texto lo dice. */
function estDecision(sace) {
  if (!sace.matsConDatos.length) return { tipo: 'sindatos' };
  const finales = sace.matsConDatos.map(c => ({ mat: c, val: sace.promMat[c] }));
  const bajas = finales.filter(f => f.val < 70).sort((a, b) => a.val - b.val);
  return {
    tipo: sace.anioCompleto ? 'veredicto' : 'proyeccion',
    aprueba: !bajas.length, bajas, promGen: sace.promGen,
    parciales: sace.parcialesConDatos.length,
  };
}

function estDecisionHtml(dec, compacto) {
  if (dec.tipo === 'sindatos') {
    return '<div class="est-dec neutro">⚖️ Aún no hay notas guardadas en Notas SACE: sin datos no hay lectura del año.</div>';
  }
  const regla = compacto ? '' : '<small>Normativa (Primero y Segundo Ciclo): el año se aprueba con 70 o más en cada materia; el promedio no salva una materia baja.</small>';
  if (dec.tipo === 'veredicto') {
    return dec.aprueba
      ? '<div class="est-dec ok"><b>📜 Año lectivo cerrado: APROBADO.</b> Los cuatro parciales están llenos y todas las materias cierran en 70 o más (promedio general ' + dec.promGen + '). ' + regla + '</div>'
      : '<div class="est-dec rep"><b>📜 Año lectivo cerrado: NO APROBADO.</b> Con los cuatro parciales llenos, queda bajo 70 en ' + dec.bajas.map(b => b.mat + ' (' + b.val + ')').join(', ') + '; promedio general ' + dec.promGen + '. ' + regla + '</div>';
  }
  return dec.aprueba
    ? '<div class="est-dec ok"><b>⚖️ Si el año cerrara hoy: aprobaría.</b> Con ' + dec.parciales + ' de IV parciales guardados, todas las materias promedian 70 o más (promedio ' + dec.promGen + '). Es una proyección, no un veredicto. ' + regla + '</div>'
    : '<div class="est-dec rep"><b>⚖️ Si el año cerrara hoy: en riesgo.</b> Con ' + dec.parciales + ' de IV parciales guardados, promedia bajo 70 en ' + dec.bajas.map(b => b.mat + ' (' + b.val + ')').join(', ') + '. Todavía hay año para levantarlas: ahí va el refuerzo. ' + regla + '</div>';
}

/* ══════════════ PANTALLA (la pestaña en Mi aula) ══════════════ */

function adRenderEstadisticas(body, d) {
  if (!d.lista.length) { adSinLista(body, 'las estadísticas'); return; }

  /* alumno elegido: el guardado, o el primero de la lista */
  if (_estNum == null || !d.lista.some(a => String(a.num) === String(_estNum))) _estNum = d.lista[0].num;
  const al = d.lista.find(a => String(a.num) === String(_estNum));
  const x = estDatosAlumno(d, al);
  const obs = estObservaciones(x);
  const dec = estDecision(x.sace);
  const cache = estNubeCache();

  /* a quién mirar primero: los tres con más señales de riesgo. Los 🧪 de
     prueba no salen: no hay a quién ir a buscar. */
  const reales = (typeof adAlumnosReales === 'function') ? adAlumnosReales(d) : d.lista;
  const enRiesgo = reales.map(a => {
    const r = estRiesgo(estDatosAlumno(d, a));
    return { a, pts: r.pts, razones: r.razones };
  }).filter(r => r.pts > 0).sort((a, b) => b.pts - a.pts).slice(0, 3);
  const esPrueba = typeof adEsPrueba === 'function' && adEsPrueba(al);

  const nom = a => (adEsPrueba(a) ? '🧪 ' : '') + '#' + a.num + (a.nombre ? ' · ' + a.nombre : '');
  const chip = (lbl, valTxt, cls) => '<div class="est-chip ' + (cls || '') + '"><span>' + lbl + '</span><b>' + valTxt + '</b></div>';
  const nivel = x.sace.promGen != null ? adNotaCat(x.sace.promGen) : null;
  const tend = estTendencia(x.sace);

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📈 Estadísticas del alumno</div>
      <p class="pa-optional-hint">Todo lo que registras —notas, asistencia, evaluaciones, controles y
        la práctica de misiones— junto y leído para <strong>decidir con datos</strong>: refuerzos,
        avisos a la familia y, al cierre, la aprobación del año.</p>
      <div class="est-selector">
        <button class="pa-generate-btn ad-btn-sec" id="est-prev" aria-label="Alumno anterior">‹</button>
        <select id="est-alumno" class="pa-inp-field" aria-label="Elegir alumno">
          ${d.lista.map(a => '<option value="' + a.num + '"' + (String(a.num) === String(_estNum) ? ' selected' : '') + '>' + adEsc(nom(a)) + '</option>').join('')}
        </select>
        <button class="pa-generate-btn ad-btn-sec" id="est-next" aria-label="Alumno siguiente">›</button>
      </div>
      <p class="pa-optional-hint est-prueba-linea">
        ${esPrueba
          ? '🧪 <strong>Alumno de prueba.</strong> No entra en el informe del grado ni en los informes de todo el grupo — no infla la matrícula ni las inasistencias que ve la Dirección. Aquí lo sigues viendo entero.'
          : '¿Este es un alumno inventado que solo usas para probar?'}
        <button class="est-prueba-tog" id="est-prueba">${esPrueba ? '👥 Volverlo alumno del grado' : '🧪 Marcarlo como de prueba'}</button>
      </p>
      ${enRiesgo.length ? `
      <p class="pa-optional-hint" style="margin-top:8px"><strong>A quién mirar primero:</strong></p>
      <div class="est-riesgo-row">
        ${enRiesgo.map(r => '<button class="est-riesgo-chip" data-estnum="' + r.a.num + '" title="' + adEsc(r.razones.join(' · ')) + '">⚠️ ' + adEsc(adPrimerNombre(r.a.nombre) || ('#' + r.a.num)) + ' <small>' + adEsc(r.razones[0] || '') + '</small></button>').join('')}
      </div>` : ''}
      <div class="ad-btn-row" style="margin-top:10px">
        <button class="pa-generate-btn" id="est-print-uno">🖨️ Informe de ${adEsc(adPrimerNombre(al.nombre) || ('#' + al.num))} (1 hoja carta)</button>
        <button class="pa-generate-btn ad-btn-sec" id="est-print-todos">🖨️ Informes de todo el grupo</button>
        <button class="pa-generate-btn ad-btn-sec" id="est-print-grado">🏫 Informe del grado (1 hoja, para la Dirección)</button>
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">✍️ Tu observación <small class="est-sub">(va en el informe del grado)</small></div>
      <p class="pa-optional-hint">Los números cuentan lo que está registrado; <strong>lo que ellos no explican
        lo escribes tú</strong>. Sale impreso <strong>encima de las firmas</strong>, así que queda como
        respaldo tuyo ante la Dirección: alumnos que tienes en tu lista pero no aparecen en el SACE, un mes
        con clases suspendidas, un traslado a medio año… Se imprime <strong>seguido, como un párrafo</strong>
        (los renglones sueltos se juntan), para que la hoja siga siendo una.</p>
      <textarea id="est-obs" class="pa-paste-area" rows="4" maxlength="${EST_OBS_MAX}"
        placeholder="Ej.: La alumna Nº 42 y los alumnos Estarlin y Kenny están en mi lista pero no aparecen registrados en el SACE; su inscripción corresponde a la Dirección.">${adEsc(d.obsGrado || '')}</textarea>
      <p class="pa-optional-hint" id="est-obs-pie"></p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📌 Resumen de ${adEsc(al.nombre || ('alumno #' + al.num))}</div>
      <div class="est-chips">
        ${chip('Promedio del año', x.sace.promGen != null ? x.sace.promGen + (nivel ? ' · ' + nivel.label : '') : 'Sin notas', x.sace.promGen == null ? '' : x.sace.promGen >= 70 ? 'good' : 'low')}
        ${chip('Tendencia', !tend ? '—' : tend.tipo === 'sube' ? '▲ Subiendo (' + tend.de + '→' + tend.a + ')' : tend.tipo === 'baja' ? '▼ Bajando (' + tend.de + '→' + tend.a + ')' : '· Estable', !tend ? '' : tend.tipo === 'sube' ? 'good' : tend.tipo === 'baja' ? 'low' : '')}
        ${chip('Inasistencias (SACE)', x.sace.inasisSace != null ? String(x.sace.inasisSace) : 'Sin dato', (x.sace.inasisSace || 0) >= 10 ? 'low' : '')}
        ${chip('Pase de lista', '🚫 ' + x.asis.totalA + ' · 📝 ' + x.asis.totalE, x.asis.totalA >= 5 ? 'low' : '')}
        ${chip('Evaluaciones', x.evals.length ? x.evals.length + (x.evals.some(e => e.nsp) ? ' · ' + x.evals.filter(e => e.nsp).length + ' NSP' : '') : 'Ninguna', x.evals.some(e => e.nsp) ? 'low' : '')}
        ${chip('Misiones', x.misiones == null ? 'Sin consultar' : x.misiones.intentos ? x.misiones.intentos + ' eval. · ' + x.misiones.dominadas + ' dominadas' : 'Sin práctica', x.misiones && x.misiones.intentos ? 'good' : '')}
        ${x.controles.de ? chip('Controles', x.controles.hechos + ' de ' + x.controles.de, (x.controles.hechos / x.controles.de) < 0.5 ? 'low' : '') : ''}
        ${x.lectura.length ? chip('Lectura', x.lectura[x.lectura.length - 1].ppm + ' ppm', '') : ''}
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🧮 Notas por materia <small class="est-sub">(la última nota de cada una, con su parcial anterior)</small></div>
      ${x.sace.estado.length ? estGBarras(x.sace.estado) + estLeyendaNotas()
        : '<p class="pa-optional-hint">Aún no hay notas en Notas SACE para este alumno.</p>'}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📊 Evolución por parcial <small class="est-sub">(azul = promedio; gris = cada materia)</small></div>
      ${x.sace.parcialesConDatos.length ? estGEvolucion(x.sace)
        : '<p class="pa-optional-hint">El gráfico aparece al guardar notas de al menos un parcial.</p>'}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📋 Asistencia <small class="est-sub">(pase de lista por mes)</small></div>
      ${x.asis.meses.length ? estGAsis(x.asis.meses)
        : '<p class="pa-optional-hint">Sin faltas registradas en el pase de lista. 🎉</p>'}
      ${x.sace.inasisSace != null ? '<p class="pa-optional-hint">La cifra oficial del año es la columna «Inasistencias» de Notas SACE: <strong>' + x.sace.inasisSace + '</strong>.</p>' : ''}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🚀 Práctica de misiones <small class="est-sub">(lo que sube a la nube cuando practica con internet)</small></div>
      <div id="est-misiones">${estMisionesHtml(x)}</div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="est-nube-btn">🔄 Consultar la nube ahora</button>
      </div>
      ${cache ? '<p class="pa-optional-hint">Última consulta: ' + adEsc(estFechaHora(cache.t)) + '. Los resultados llegan con el nº de lista que el alumno escribe: revisa que el nombre coincida.</p>' : ''}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📖 Lectura — palabras por minuto</div>
      ${x.lectura.length
        ? estGSerieFechas(x.lectura.map(r => ({ x: adFechaBonita(r.f).slice(0, 5), v: r.ppm, titulo: adFechaBonita(r.f) + ': ' + r.ppm + ' ppm' + (r.errores != null ? ' · ' + r.errores + ' errores' : '') + (r.comp != null && r.compDe ? ' · comprensión ' + r.comp + '/' + r.compDe : '') })), { aria: 'Palabras por minuto' }) +
          (() => {
            const u = x.lectura[x.lectura.length - 1];
            let extra = '';
            if (typeof lecNivelVelocidad === 'function' && x.grado) {
              const nv = lecNivelVelocidad(x.grado, u.ppm);
              extra += ' Nivel para ' + x.grado + 'º: <strong style="color:' + nv.color + '">' + nv.etiqueta + '</strong> (banda ' + nv.banda[0] + '–' + nv.banda[1] + ').';
            }
            if (u.comp != null && u.compDe) extra += ' Comprensión: <strong>' + u.comp + ' de ' + u.compDe + '</strong>.';
            return '<p class="pa-optional-hint">Última toma: <strong>' + u.ppm + ' palabras por minuto</strong> (' + adFechaBonita(u.f) + ').' + extra + '</p>';
          })() + estTomasHtml(x)
        : '<p class="pa-optional-hint">Aún no hay tomas de lectura de ' + adEsc(adPrimerNombre(al.nombre) || 'este alumno') + '. Se toman en la pestaña <strong>📖 Lectura</strong>: cronómetro, conteo de palabras y cinco preguntas de comprensión — y el avance se dibuja aquí solo.</p>'}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🔎 Lectura de los datos</div>
      <ul class="est-obs">
        ${obs.map(o => '<li class="est-obs-' + o.nivel + '"><span>' + o.ic + '</span> ' + o.txt + '</li>').join('')}
      </ul>
      <p class="pa-optional-hint">Observaciones automáticas a partir de lo registrado: señalan coincidencias,
        no causas. La decisión siempre es tuya.</p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">⚖️ Decisión del año</div>
      ${estDecisionHtml(dec)}
    </div>`;

  /* ── eventos ── */
  const sel = document.getElementById('est-alumno');
  sel.addEventListener('change', () => { _estNum = +sel.value; adRenderEstadisticas(body, adLoad()); });
  const mover = paso => {
    const i = d.lista.findIndex(a => String(a.num) === String(_estNum));
    const j = (i + paso + d.lista.length) % d.lista.length;
    _estNum = d.lista[j].num;
    adRenderEstadisticas(body, adLoad());
  };
  document.getElementById('est-prev').addEventListener('click', () => mover(-1));
  document.getElementById('est-next').addEventListener('click', () => mover(1));
  body.querySelectorAll('[data-estnum]').forEach(b => b.addEventListener('click', () => {
    _estNum = +b.dataset.estnum;
    adRenderEstadisticas(body, adLoad());
  }));
  /* quitar una toma de lectura: la que se hizo «solo para probar» no
     puede quedarse contando en el informe de la familia */
  body.querySelectorAll('[data-lecdel]').forEach(b => b.addEventListener('click', async () => {
    const firma = { num: al.num, f: b.dataset.lecf, ppm: Number(b.dataset.lecppm) };
    const quien = adPrimerNombre(al.nombre) || ('#' + al.num);
    if (!await metasConfirm('Se quita del expediente de **' + quien + '** la toma de **' + firma.ppm +
      ' palabras por minuto** del ' + adFechaBonita(firma.f) + '.\n\nDeja de contar en el gráfico, en las ' +
      'observaciones y en el informe.\n\nSi fue un error, la 🕘 papelera de la pestaña 👥 Alumnos la devuelve.',
      { icono: '🗑', titulo: 'Quitar una toma de lectura', okTxt: 'Sí, quitarla' })) return;
    adUndoGuardar('Quitar una toma de lectura de #' + al.num);
    const dd = adLoad();
    if (!estQuitarToma(dd, +b.dataset.lecdel, firma)) { toast('No se encontró esa toma; vuelve a abrir la pestaña.'); return; }
    adSave(dd);
    toast('🗑 Toma quitada — si fue un error, restaura en 🕘 (pestaña Alumnos)');
    adRenderEstadisticas(body, adLoad());
  }));
  /* la observación se guarda mientras se escribe (como el resto de Mi
     aula): el maestro no debe acordarse de pulsar «guardar» antes de
     imprimir. El pie dice cuánto le queda, porque el largo es lo único
     que separa una hoja de dos. */
  const obsTa = document.getElementById('est-obs');
  const obsPie = document.getElementById('est-obs-pie');
  const obsPintaPie = () => {
    const n = obsTa.value.trim().length;
    obsPie.innerHTML = !n
      ? 'Vacío: el informe sale <strong>tal cual</strong>, sin recuadro de observación.'
      : '✍️ Se imprimirá encima de las firmas. Te quedan <strong>' + (EST_OBS_MAX - obsTa.value.length) +
        '</strong> caracteres' + (EST_OBS_MAX - obsTa.value.length <= 40 ? ' — al llenarlos, corta: el informe tiene que caber en una hoja.' : '.');
  };
  obsPintaPie();
  obsTa.addEventListener('input', () => {
    const dd = adLoad();
    const v = obsTa.value.slice(0, EST_OBS_MAX);
    if (v.trim()) dd.obsGrado = v; else delete dd.obsGrado;
    adSave(dd);
    obsPintaPie();
  });
  document.getElementById('est-prueba').addEventListener('click', () => {
    const on = adTogglePrueba(al.num);
    adRenderEstadisticas(body, adLoad());
    toast(on ? '🧪 Fuera del informe del grado — para ti sigue igual'
             : '👥 Vuelve a contar en el informe del grado');
  });
  document.getElementById('est-print-uno').addEventListener('click', () => estImprimirInforme(adLoad(), [al.num]));
  /* los informes «de todo el grupo» son los del GRADO: el 🧪 de prueba
     no gasta una hoja ni se le entrega a nadie */
  document.getElementById('est-print-todos').addEventListener('click', () => {
    const dd = adLoad();
    estImprimirInforme(dd, adAlumnosReales(dd).map(a => a.num));
  });
  document.getElementById('est-print-grado').addEventListener('click', () => estImprimirInformeGrado(adLoad()));
  document.getElementById('est-nube-btn').addEventListener('click', async () => {
    const btn = document.getElementById('est-nube-btn');
    btn.disabled = true; btn.textContent = '⏳ Consultando…';
    const r = await estNubeRefrescar();
    btn.disabled = false; btn.textContent = '🔄 Consultar la nube ahora';
    if (r.err === 'sincuenta') { toast('👩‍🏫 Entra una vez en «Consulta en la nube» con tu correo y contraseña: ahí queda guardado tu acceso.'); return; }
    if (r.err === 'sinred') { toast('📴 Sin conexión: se muestra la última consulta guardada.'); return; }
    if (r.err) { toast('⚠️ No se pudo consultar la nube. Intenta de nuevo con internet.'); return; }
    toast('☁️ Nube consultada: práctica de misiones al día.');
    adRenderEstadisticas(body, adLoad());
  });
}

function estFechaHora(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? m[3] + '/' + m[2] + '/' + m[1] + ' ' + m[4] + ':' + m[5] : String(iso || '');
}

/* ── Las tomas de lectura, una por una, con su 🗑 ──
   Pedido del maestro (agosto de 2026): hay tomas que se hacen «solo
   para probar» la herramienta, y una vez guardadas se quedaban para
   siempre torciendo el gráfico, las observaciones y el informe que
   firma la familia. Se listan de la MÁS NUEVA a la más vieja —la de
   prueba casi siempre es la última— y cada una se puede quitar.
   No se borra en silencio: antes va una foto a la 🕘 papelera. */
function estTomasHtml(x) {
  const fila = r => {
    const meta = [adFechaBonita(r.f), r.texto || 'texto sin título'];
    if (r.comp != null && r.compDe) meta.push('comprensión ' + r.comp + '/' + r.compDe);
    if (r.errores != null) meta.push(r.errores + (r.errores === 1 ? ' error' : ' errores'));
    return `<div class="est-toma">
      <div class="est-toma-ppm"><b>${r.ppm}</b><span>ppm</span></div>
      <div class="est-toma-meta">${adEsc(meta.join(' · '))}</div>
      <button class="est-toma-del" data-lecdel="${r.i}" data-lecf="${adEsc(r.f)}" data-lecppm="${r.ppm}"
        aria-label="Quitar la toma de ${r.ppm} palabras por minuto del ${adEsc(adFechaBonita(r.f))}">🗑</button>
    </div>`;
  };
  return '<div class="est-tomas">' + x.lectura.slice().reverse().map(fila).join('') + '</div>' +
    '<p class="pa-optional-hint">¿Alguna fue solo una prueba? Toca 🗑 y sale del expediente, del gráfico y del ' +
    'informe. Si te arrepientes, la 🕘 papelera de la pestaña 👥 Alumnos la devuelve.</p>';
}

function estMisionesHtml(x) {
  if (x.misiones == null) {
    return '<p class="pa-optional-hint">Aún no se ha consultado la nube en este equipo. Toca «Consultar la nube ahora» (necesita internet una vez; después queda guardado para verlo sin señal).</p>';
  }
  const m = x.misiones;
  /* Las que no se pudieron asignar SE DICEN, y se dicen aunque no haya ninguna
     otra: callarlas sería volver al fallo de antes con otra cara —el maestro
     leyendo «no hay práctica» de un niño que sí practicó—, y además tiene
     arreglo en diez segundos, que es pedirle al alumno que escriba su sección. */
  const sinSec = m.sinSeccion > 0
    ? '<p class="pa-optional-hint">⚠️ Hay <b>' + m.sinSeccion + '</b> registro(s) con este nº de lista y este grado, pero <b>sin sección</b>: ' +
      'como tienes más de un grupo en ' + adEsc(String(x.grado || '')) + 'º, no se puede saber si son de este alumno o del mismo número del otro grupo, ' +
      'y no se cuentan. Pídele que escriba su grado con la sección (por ejemplo <b>' +
      adEsc(adGradoSeccion(x.grado, x.seccion || '1')) + '</b>) la próxima vez que abra una misión.</p>'
    : '';
  if (!m.filas.length) {
    return sinSec + '<p class="pa-optional-hint">No hay práctica registrada de este alumno en la nube todavía. Las misiones suben solas cuando practica con internet; sin señal, quedan en su teléfono y suben después.</p>';
  }
  const aviso = sinSec + (m.nombres.length > 1
    ? '<p class="pa-optional-hint">⚠️ Con este nº de lista llegaron varios nombres (' + m.nombres.map(adEsc).join(', ') + '): puede haber un número mal escrito.</p>' : '');
  return `
    <table class="ad-tabla">
      <thead><tr><th>Misión</th><th>Materia</th><th>Intentos</th><th>Conceptual</th><th>Operativa</th></tr></thead>
      <tbody>
        ${m.filas.slice(0, 8).map(f => {
          const nota = v => {
            if (v == null) return '—';
            const c = adNotaCat(v);
            return '<b style="color:' + c.color + '">' + v + '</b>';
          };
          return '<tr><td>' + adEsc(f.titulo || f.mision) + '</td><td>' + adEsc(f.materia || '—') + '</td><td>' + f.intentos +
            '</td><td>' + nota(f.conceptual) + '</td><td>' + nota(f.operativa) + '</td></tr>';
        }).join('')}
      </tbody>
    </table>
    ${m.filas.length > 8 ? '<p class="pa-optional-hint">…y ' + (m.filas.length - 8) + ' misión(es) más.</p>' : ''}
    ${m.minutos != null ? '<p class="pa-optional-hint">Tiempo de práctica reportado: ~' + m.minutos + ' min · secciones completadas: ' + (m.secciones != null ? m.secciones : '—') + '.</p>' : ''}
    ${aviso}`;
}

/* ══════════════ INFORME IMPRIMIBLE — UNA hoja carta por alumno ══════════════
   Es el papel que acompaña la decisión del año: datos, gráficos y
   observaciones en una sola página que se firma y se archiva. El pie de
   firmas se ancla abajo (mismo truco de la boleta). */
/* ── Cuántas observaciones caben en la hoja ──
   No se cuentan VIÑETAS, se cuenta el ALTO que van a ocupar: cinco
   viñetas cortas caben de sobra y tres largas ya no. Cortar por número
   («las 5 primeras») fue lo que partía siete de cada 42 informes, porque
   una observación de lectura o de NSP ocupa el doble que las demás.

   Los 124 caracteres por renglón NO son a ojo: se midieron sobre el lote
   impreso de 42 informes — las viñetas de un renglón llegaban hasta 124
   caracteres y las de dos empezaban en 178. Si algún día cambia la letra
   o el ancho de la hoja, hay que volver a medirlo.

   Las observaciones vienen ordenadas de más grave a menos, así que lo
   que se cae por el borde es siempre lo menos urgente. */
const EST_OBS_CHARS_LINEA = 124;
function estObsQueCaben(obs, renglones) {
  const out = [];
  let usados = 0;
  for (const o of obs) {
    const n = Math.max(1, Math.ceil(String(o.txt || '').length / EST_OBS_CHARS_LINEA));
    if (out.length && usados + n > renglones) break;
    out.push(o);
    usados += n;
  }
  return out;
}

function estImprimirInforme(d, nums) {
  const alumnos = d.lista.filter(a => nums.some(n => String(n) === String(a.num)));
  if (!alumnos.length) { if (typeof toast === 'function') toast('Ese alumno ya no está en la lista'); return; }
  const grupo = adGrupoTxt(d);
  const bol = d.boleta || {};
  const hoy = adFechaBonita(adHoy());

  const hoja = a => {
    const x = estDatosAlumno(d, a);
    /* 6 renglones de observaciones: es lo que sobra en la hoja después
       de las notas, los gráficos y el pie de firmas. Se midió el lote
       completo de 42 informes; subirlo vuelve a partir hojas. */
    const obs = estObsQueCaben(estObservaciones(x), 6);
    const dec = estDecision(x.sace);
    const nivel = x.sace.promGen != null ? adNotaCat(x.sace.promGen) : null;
    const tend = estTendencia(x.sace);
    const chip = (lbl, valTxt, cls) => '<div class="chip ' + (cls || '') + '"><span>' + lbl + '</span><b>' + valTxt + '</b></div>';
    const filaMat = c => {
      const vals = EST_PARCIALES.map(p => {
        const v = x.sace.porMateria[c][p];
        return '<td>' + (v == null ? '—' : v) + '</td>';
      }).join('');
      const pm = x.sace.promMat[c];
      const cat = pm != null ? adNotaCat(pm) : null;
      return '<tr><td class="mat">' + adEsc(c) + '</td>' + vals +
        '<td class="prom">' + (pm == null ? '—' : pm) + '</td>' +
        '<td class="niv" style="color:' + (cat ? cat.color : '#7286a8') + '">' + (cat ? cat.label : '—') + '</td></tr>';
    };
    const misTxt = x.misiones && x.misiones.intentos
      ? x.misiones.intentos + ' evaluación(es) en misiones · ' + x.misiones.dominadas + ' dominada(s) con 70+' + (x.misiones.minutos != null ? ' · ~' + x.misiones.minutos + ' min de práctica' : '')
      : (x.misiones ? 'Sin práctica registrada en la nube' : 'Nube sin consultar en este equipo');
    const lecTxt = (() => {
      if (!x.lectura.length) return null;
      const u = x.lectura[x.lectura.length - 1];
      let s = 'Última toma: ' + u.ppm + ' palabras por minuto (' + adFechaBonita(u.f) + ')';
      if (typeof lecNivelVelocidad === 'function' && x.grado) {
        const nv = lecNivelVelocidad(x.grado, u.ppm);
        /* la BANDA sí va (el número sin su referencia no dice nada), pero
           NO la fuente: este papel lo lee la familia y la Dirección, y
           «referencia SEP México, 2010» ahí solo abre una discusión que
           no es la del alumno. La fuente vive en la pantalla del maestro
           (📖 Lectura), que es quien tiene que poder defender la cifra. */
        s += ' · nivel ' + nv.etiqueta + ' para ' + x.grado + 'º (banda ' + nv.banda[0] + '–' + nv.banda[1] + ')';
      }
      if (u.comp != null && u.compDe) s += ' · comprensión ' + u.comp + ' de ' + u.compDe;
      if (x.lectura.length >= 2) s += ' · venía de ' + x.lectura[0].ppm + ' el ' + adFechaBonita(x.lectura[0].f);
      return s;
    })();
    return `<section class="hoja">
      <header class="inf-head">
        <div class="inf-logo">${d.logo ? '<img src="' + d.logo + '" alt="">' : ''}</div>
        <div class="inf-tit">
          <div class="inf-centro">${adEsc((d.escuela || 'Centro Educativo').toUpperCase())}</div>
          <div class="inf-doc">INFORME DE RENDIMIENTO DEL ESTUDIANTE</div>
          <div class="inf-sub">Datos del aula para la toma de decisiones · Año lectivo ${adEsc(bol.anio || String(new Date().getFullYear()))}</div>
        </div>
        <div class="inf-fecha">${adEsc(hoy)}</div>
      </header>

      <div class="inf-alumno">
        <div style="flex:3"><span>Estudiante</span><b>${adEsc(a.nombre || '—')}</b></div>
        <div><span>Nº de lista</span><b>${a.num}</b></div>
        <div><span>Grado y sección</span><b>${adEsc(adGradoSeccion(d.grado, d.seccion) || '—')}</b></div>
        <div style="flex:2"><span>Docente</span><b>${adEsc(bol.docente || '—')}</b></div>
      </div>

      <div class="chips">
        ${chip('Promedio del año', x.sace.promGen != null ? x.sace.promGen + (nivel ? ' · ' + nivel.label : '') : 'Sin notas', x.sace.promGen != null && x.sace.promGen < 70 ? 'low' : x.sace.promGen != null ? 'good' : '')}
        ${chip('Tendencia', !tend ? '—' : tend.tipo === 'sube' ? '▲ Subiendo' : tend.tipo === 'baja' ? '▼ Bajando' : '· Estable', !tend ? '' : tend.tipo === 'baja' ? 'low' : tend.tipo === 'sube' ? 'good' : '')}
        ${chip('Inasistencias', x.sace.inasisSace != null ? String(x.sace.inasisSace) : '—', (x.sace.inasisSace || 0) >= 10 ? 'low' : '')}
        ${chip('Pase de lista', '🚫 ' + x.asis.totalA + ' · 📝 ' + x.asis.totalE)}
        ${chip('Evaluaciones', x.evals.length ? String(x.evals.length) + (x.evals.some(e => e.nsp) ? ' (' + x.evals.filter(e => e.nsp).length + ' NSP)' : '') : '0')}
        ${chip('Misiones M.E.T.A.S.', x.misiones && x.misiones.intentos ? x.misiones.intentos + ' eval. · ' + x.misiones.dominadas + ' dom.' : '—')}
      </div>

      <div class="inf-cols">
        <div class="inf-col">
          <div class="inf-h">🧮 Notas por parcial</div>
          <table class="inf-tabla">
            <thead><tr><th>Materia</th><th>I</th><th>II</th><th>III</th><th>IV</th><th>Prom.</th><th>Nivel</th></tr></thead>
            <tbody>${x.sace.matsConDatos.length ? x.sace.matsConDatos.map(filaMat).join('') : '<tr><td colspan="7" class="vacio">Sin notas guardadas</td></tr>'}</tbody>
          </table>
          <div class="inf-h" style="margin-top:8px">📋 Asistencia (pase de lista)</div>
          ${x.asis.meses.length ? estGAsis(x.asis.meses, { w: 340, h: 130, maxw: 420 }) : '<p class="inf-nada">Sin faltas registradas. 🎉</p>'}
        </div>
        <div class="inf-col">
          <div class="inf-h">📊 Estado por materia <small>(última nota · | = parcial anterior)</small></div>
          ${x.sace.estado.length ? estGBarras(x.sace.estado, { w: 340, maxw: 420 }) + estLeyendaNotas() : '<p class="inf-nada">Sin notas todavía.</p>'}
          <div class="inf-h" style="margin-top:8px">🚀 Práctica y lectura</div>
          <p class="inf-txt">${adEsc(misTxt)}.</p>
          ${lecTxt ? '<p class="inf-txt">📖 ' + adEsc(lecTxt) + '.</p>' : ''}
        </div>
      </div>

      <div class="inf-h" style="margin-top:7px">🔎 Lectura de los datos <small>(coincidencias en lo registrado, no causas)</small></div>
      <ul class="inf-obs">
        ${obs.map(o => '<li>' + o.ic + ' ' + o.txt + '</li>').join('')}
      </ul>

      ${estDecisionHtml(dec)}

      <footer class="inf-foot">
        <div class="inf-firmas">
          <div><i></i><b>${adEsc(bol.docente) || '&nbsp;'}</b><span>Docente de grado</span></div>
          <div><i></i><b>${adEsc(bol.director) || '&nbsp;'}</b><span>Director(a)</span></div>
          <div><i></i><b>&nbsp;</b><span>Madre, padre o encargado</span></div>
        </div>
        <p class="inf-fuente">Informe generado por M.E.T.A.S. con los registros del aula (Notas SACE, pase de lista,
          Plan de Acción y práctica de misiones en la nube) al ${adEsc(hoy)}.</p>
      </footer>
    </section>`;
  };

  const titulo = alumnos.length === 1
    ? 'Informe — ' + (String(alumnos[0].nombre || '').trim() || 'N° ' + alumnos[0].num) + (grupo ? ' · ' + grupo : '')
    : 'Informes — ' + grupo;
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc(titulo)}</title>
<style>${estInformeCss()}</style></head><body>
${alumnos.map(a => hoja(a)).join('')}
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}

/* CSS compartido de los informes imprimibles (el del alumno y el del
   grado): una sola hoja de estilos para que un ajuste de márgenes o de
   letra les llegue a los dos papeles a la vez. */
function estInformeCss() {
  return `
  @page { size: letter portrait; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root { --tinta:#0f2350; --azul:#1e3a7c; --oro:#a8791a; --linea:#d4dbe6; --suave:#f4f7fc; }
  body { color: var(--tinta); font-family: Arial, Helvetica, sans-serif; }
  /* ── NORMATIVA: UNA HOJA CARTA POR INFORME, EN CUALQUIER COMPUTADORA ──
     Un lote de 42 informes tiene que salir en 42 páginas. Si una se parte,
     la firma queda huérfana en la hoja siguiente y el maestro descubre el
     estropicio con las 52 hojas ya impresas (pasó de verdad).

     Dos cosas lo garantizan, y las dos importan:

     1. ALTURA CON HOLGURA. En carta con los márgenes de 10 mm de aquí
        arriba caben 259,4 mm (980 px). El «min-height» era de 256 mm:
        dejaba 12 px, y siete de cada 42 informes se pasaban. Ahora son
        248 mm (937 px) y el contenido más largo medido queda por debajo,
        así que sobran ~45 px. Ese colchón NO es de adorno: si el
        navegador ignora el «@page» y pone sus propios márgenes (Firefox
        usa 12,7 mm y deja 960 px), la hoja sigue cabiendo.

     2. NADA SE PARTE POR DENTRO. «break-inside: avoid» en la hoja y en el
        pie: antes que cortar la firma en dos, que la mueva entera.

     Si algún día se le añade un bloque al informe, hay que volver a medir
     el lote completo, no una hoja suelta: el largo cambia de alumno a
     alumno (observaciones, práctica, lectura). */
  .hoja { page-break-after: always; break-inside: avoid; page-break-inside: avoid;
          min-height: 248mm; display: flex; flex-direction: column; }
  .hoja:last-child { page-break-after: auto; }

  /* Letra GRANDE a propósito: el informe se lee en una reunión con la
     familia y con el director, muchas veces con poca luz. La página tiene
     espacio de sobra (se comprobó con datos de un año completo) y se
     prefiere llenarla a dejarla en blanco con letra de hormiga. */
  .inf-head { display: flex; align-items: center; gap: 12px; padding-bottom: 8px; border-bottom: 2.5px solid var(--azul); }
  .inf-logo { width: 72px; min-height: 46px; display: flex; align-items: center; }
  .inf-logo img { max-width: 70px; max-height: 54px; object-fit: contain; }
  .inf-tit { flex: 1; text-align: center; }
  .inf-centro { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 700; letter-spacing: .3px; }
  .inf-doc { font-family: Georgia, serif; font-size: 13.5px; font-weight: 700; color: var(--oro); margin-top: 2px; letter-spacing: .6px; }
  .inf-sub { font-size: 10.5px; color: #55637d; margin-top: 2px; }
  .inf-fecha { width: 72px; text-align: right; font-size: 11px; color: #55637d; }

  .inf-alumno { display: flex; gap: 7px; margin: 6px 0; }
  .inf-alumno > div { flex: 1; background: var(--suave); border: 1px solid var(--linea); border-radius: 6px; padding: 5px 9px; }
  .inf-alumno span { display: block; font-size: 9px; letter-spacing: .5px; text-transform: uppercase; color: #7286a8; }
  .inf-alumno b { font-size: 14px; }

  .chips { display: flex; gap: 6px; margin-bottom: 8px; }
  .chip { flex: 1; border: 1px solid var(--linea); border-radius: 7px; padding: 5px 9px; background: var(--suave); }
  .chip span { display: block; font-size: 8.6px; text-transform: uppercase; letter-spacing: .4px; color: #7286a8; }
  .chip b { font-size: 13px; }
  .chip.good { background: #eef7ee; border-color: #cfe6cf; } .chip.good b { color: #2e7d32; }
  .chip.low { background: #fdf3e5; border-color: #ecdcbf; } .chip.low b { color: #c8730a; }

  .inf-cols { display: flex; gap: 14px; align-items: flex-start; }
  .inf-col { flex: 1; min-width: 0; }
  .inf-h { font-family: Georgia, serif; font-size: 13.5px; font-weight: 700; color: var(--azul); padding-bottom: 4px; border-bottom: 1px solid var(--linea); margin-bottom: 6px; }
  .inf-h small { font-weight: 400; font-style: italic; color: #7286a8; font-size: 10px; }

  .inf-tabla { border-collapse: collapse; width: 100%; }
  .inf-tabla th, .inf-tabla td { border: 1px solid #c7cfdd; text-align: center; font-size: 11px; padding: 3.5px 4px; }
  .inf-tabla th { background: #eaf0fa; font-size: 9.5px; text-transform: uppercase; letter-spacing: .3px; }
  .inf-tabla td.mat { text-align: left; font-weight: 700; padding-left: 5px; white-space: nowrap; max-width: 128px; overflow: hidden; text-overflow: ellipsis; }
  .inf-tabla td.prom { font-weight: 800; background: #fdf6e3; color: #8a5a00; }
  .inf-tabla td.niv { font-weight: 700; font-size: 10px; white-space: nowrap; }
  .inf-tabla td.vacio { color: #7286a8; font-style: italic; padding: 8px; }

  .est-leyenda { display: flex; flex-wrap: wrap; gap: 3px 10px; justify-content: center; margin-top: 4px; font-size: 9px; color: #55637d; }
  .est-leyenda i { display: inline-block; width: 9px; height: 9px; border-radius: 2.5px; margin-right: 3px; vertical-align: -1px; }

  /* Interlineado 1.45 y no 1.55: la letra sigue siendo la misma (se lee en
     una reunión con poca luz, esa decisión no se toca), pero el aire entre
     renglones sí se puede apretar. Son los px que separan una hoja de dos
     cuando el alumno tiene muchas observaciones. */
  .inf-txt { font-size: 12px; line-height: 1.45; color: #223; margin-bottom: 4px; }
  .inf-nada { font-size: 11px; color: #7286a8; font-style: italic; }
  .inf-obs { list-style: none; margin: 0 0 6px; }
  .inf-obs li { font-size: 12px; line-height: 1.45; color: #223; padding: 1.5px 0 1.5px 2px; }

  .est-dec { border-radius: 9px; padding: 7px 12px; border: 1.5px solid; font-size: 12.5px; line-height: 1.45; break-inside: avoid; }
  .est-dec b { font-family: Georgia, serif; font-size: 14.5px; display: block; margin-bottom: 3px; }
  .est-dec small { display: block; margin-top: 4px; color: #55637d; font-size: 10px; }
  .est-dec.ok { background: linear-gradient(180deg, #f0f8f0, #fff); border-color: #9fcc9f; } .est-dec.ok b { color: #2e7d32; }
  .est-dec.rep { background: linear-gradient(180deg, #fdf6ec, #fff); border-color: #dcbf8e; } .est-dec.rep b { color: #8a5a00; }
  .est-dec.neutro { background: var(--suave); border-color: var(--linea); color: #55637d; }

  /* Las firmas cierran el documento; la nota de origen va DEBAJO, como
     letra chica de archivo: primero firma la gente, después habla el papel. */
  .inf-foot { margin-top: auto; padding-top: 5px; break-inside: avoid; page-break-inside: avoid; }
  .inf-firmas { display: flex; justify-content: space-around; gap: 14px; margin-top: 10px; }
  .inf-firmas > div { flex: 1; text-align: center; }
  .inf-firmas i { display: block; border-top: 1px solid #55637d; margin: 0 8px 4px; }
  .inf-firmas b { font-size: 12px; }
  .inf-firmas span { display: block; font-size: 10.5px; color: #55637d; }
  .inf-fuente { font-size: 9px; color: #7286a8; text-align: center; line-height: 1.4; margin-top: 7px; }`;
}

/* ══════════════ INFORME DEL GRADO — una hoja carta para la Dirección ══════════════
   Lo que la Dirección pregunta del grupo («¿cómo van?, ¿cuántos aprueban?,
   ¿dónde hay que reforzar?») contestado con los datos que el maestro ya
   registra, en UNA sola hoja: se entrega, se lee en la reunión y se
   archiva. Ningún número va escrito a mano: todos se cuentan de los
   registros, como manda la normativa del proyecto. */

/* El grado se cuenta SOLO con alumnos reales: los marcados 🧪 de prueba
   quedan fuera de la matrícula, del promedio, de las inasistencias y de
   la decisión del año. Cuántos se dejaron fuera se guarda (`pruebas`)
   porque el informe lo dice: un total que no cuadra con la lista, sin
   explicación, es un papel que la Dirección no puede firmar tranquila. */
function estDatosGrado(d) {
  const reales = (typeof adAlumnosReales === 'function') ? adAlumnosReales(d) : (d.lista || []);
  const xs = reales.map(a => ({ a, x: estDatosAlumno(d, a) }));
  const pruebas = (d.lista || []).length - reales.length;
  const mats = (d.materias || []).slice();
  const media = arr => {
    const v = arr.filter(n => n != null);
    return v.length ? Math.round(v.reduce((s, n) => s + n, 0) / v.length) : null;
  };

  /* promedio del grado por materia y parcial (media de los alumnos con nota) */
  const porMateria = {};
  mats.forEach(c => {
    const fila = {};
    EST_PARCIALES.forEach(p => { fila[p] = media(xs.map(r => (r.x.sace.porMateria[c] || {})[p])); });
    porMateria[c] = fila;
  });
  const promMat = {};
  mats.forEach(c => { promMat[c] = media(xs.map(r => r.x.sace.promMat[c])); });
  const matsConDatos = mats.filter(c => promMat[c] != null);
  const promParcial = {};
  EST_PARCIALES.forEach(p => { promParcial[p] = media(mats.map(c => porMateria[c][p])); });
  const parcialesConDatos = EST_PARCIALES.filter(p => promParcial[p] != null);

  /* estado vigente del grado por materia (misma regla que por alumno:
     la última nota de CADA materia, con su parcial anterior al lado) */
  const estado = mats.map(c => {
    const s = EST_PARCIALES.map(p => ({ p, v: porMateria[c][p] })).filter(t => t.v != null);
    if (!s.length) return null;
    const u = s[s.length - 1], ant = s.length >= 2 ? s[s.length - 2] : null;
    return { mat: c, val: u.v, p: u.p, prev: ant ? ant.v : null, pPrev: ant ? ant.p : null };
  }).filter(Boolean);

  /* cuántos alumnos van bajo 70 HOY en cada materia (estado vigente) */
  const bajo70Mat = {};
  mats.forEach(c => {
    bajo70Mat[c] = xs.filter(r => {
      const e = r.x.sace.estado.find(t => t.mat === c);
      return e && e.val < 70;
    }).length;
  });

  const conNotas = xs.filter(r => r.x.sace.promGen != null);
  const promGen = media(conNotas.map(r => r.x.sace.promGen));
  /* distribución de alumnos por nivel según su promedio del año */
  const porNivel = AD_NOTA_CATS.map(cat => ({
    cat, n: conNotas.filter(r => adNotaCat(r.x.sace.promGen) === cat).length,
  }));

  /* quiénes necesitan refuerzo hoy (alguna materia vigente bajo 70) */
  const refuerzo = xs.map(r => {
    const bajas = r.x.sace.estado.filter(e => e.val < 70).sort((p, q) => p.val - q.val);
    return bajas.length ? { a: r.a, bajas } : null;
  }).filter(Boolean).sort((p, q) => q.bajas.length - p.bajas.length);
  const evaluables = xs.filter(r => r.x.sace.estado.length).length;

  /* asistencia del grupo: pase de lista sumado y meses juntados */
  const mesesMap = {};
  let totalA = 0, totalE = 0;
  xs.forEach(r => {
    totalA += r.x.asis.totalA; totalE += r.x.asis.totalE;
    r.x.asis.meses.forEach(m => {
      const f = mesesMap[m.mes] || (mesesMap[m.mes] = { mes: m.mes, A: 0, E: 0 });
      f.A += m.A; f.E += m.E;
    });
  });
  const meses = Object.values(mesesMap).sort((a, b) => a.mes < b.mes ? -1 : 1);
  const inasisVals = xs.map(r => r.x.sace.inasisSace).filter(v => v != null);

  /* evaluaciones, misiones y lectura, contadas sobre todo el grupo */
  const totalEvals = xs.reduce((s, r) => s + r.x.evals.length, 0);
  const totalNsp = xs.reduce((s, r) => s + r.x.evals.filter(e => e.nsp).length, 0);
  const cache = estNubeCache();
  const practican = cache ? xs.filter(r => r.x.misiones && r.x.misiones.intentos > 0).length : null;
  const intentosMis = cache ? xs.reduce((s, r) => s + ((r.x.misiones && r.x.misiones.intentos) || 0), 0) : null;
  const conLectura = xs.filter(r => r.x.lectura.length);
  const ppmProm = media(conLectura.map(r => r.x.lectura[r.x.lectura.length - 1].ppm));

  /* la decisión del año de cada alumno, con la MISMA normativa de la boleta */
  const decs = xs.map(r => estDecision(r.x.sace)).filter(dc => dc.tipo !== 'sindatos');

  return {
    total: xs.length, pruebas, mats, matsConDatos, porMateria, promMat, promParcial,
    parcialesConDatos, estado, bajo70Mat, conNotas: conNotas.length, promGen,
    porNivel, refuerzo, evaluables, meses, totalA, totalE,
    inasisSace: inasisVals.length ? inasisVals.reduce((a, b) => a + b, 0) : null,
    totalEvals, totalNsp, practican, intentosMis,
    conLectura: conLectura.length, ppmProm, decs,
    /* forma de «sace» para reutilizar tendencia y gráfico de evolución */
    saceG: { mats, porMateria, promParcial, parcialesConDatos },
  };
}

function estObservacionesGrado(g) {
  const obs = [];
  const tend = estTendencia(g.saceG);
  if (tend && tend.tipo === 'baja') obs.push('📉 El promedio del grado bajó de ' + tend.de + ' (parcial ' + tend.pDe + ') a ' + tend.a + ' (parcial ' + tend.pA + '), comparando las mismas materias.');
  if (tend && tend.tipo === 'sube') obs.push('📈 El promedio del grado subió de ' + tend.de + ' (parcial ' + tend.pDe + ') a ' + tend.a + ' (parcial ' + tend.pA + '), comparando las mismas materias.');

  const bajasMat = g.estado.filter(e => e.val < 70).sort((a, b) => a.val - b.val);
  if (bajasMat.length) obs.push('🚨 Como grado, el promedio vigente está bajo 70 en ' + bajasMat.map(e => e.mat + ' (' + e.val + ')').join(', ') + ': ahí conviene un refuerzo colectivo, no caso por caso.');

  const matsCriticas = g.mats.filter(c => g.bajo70Mat[c] > 0).sort((a, b) => g.bajo70Mat[b] - g.bajo70Mat[a]).slice(0, 3);
  if (g.refuerzo.length) obs.push('⚠️ ' + g.refuerzo.length + ' de ' + g.evaluables + ' alumno(s) con notas llevan hoy alguna materia bajo 70' + (matsCriticas.length ? '; donde más se repite: ' + matsCriticas.map(c => c + ' (' + g.bajo70Mat[c] + ')').join(', ') : '') + '.');

  if (g.totalA > 0) {
    const peor = g.meses.slice().sort((a, b) => b.A - a.A)[0];
    if (peor && peor.A >= 5) obs.push('📋 El mes con más ausencias sin excusa fue ' + adMesLabel(peor.mes) + ', con ' + peor.A + ' en total (pase de lista).');
  }

  if (g.totalNsp > 0) obs.push('📝 Quedan ' + g.totalNsp + ' evaluación(es) sin presentar (NSP) en el grupo: conviene programarlas antes del cierre del parcial.');

  if (g.practican != null && g.practican > 0) obs.push('🚀 ' + g.practican + ' de ' + g.total + ' alumno(s) practican misiones de M.E.T.A.S. fuera del aula, con ' + g.intentosMis + ' evaluación(es) calificada(s) en la nube.');

  if (g.conLectura > 0) obs.push('📖 Hay toma de lectura de ' + g.conLectura + ' alumno(s); el grado promedia ' + g.ppmProm + ' palabras por minuto en la última toma de cada uno.');

  if (!obs.length) obs.push('🕊️ Sin señales de alarma a nivel de grado con los datos guardados hasta hoy.');
  return obs;
}

/* Balance de aprobación del grado: se cuenta la decisión de cada alumno
   (la misma de su informe individual) y se dice cuántos van bien y
   cuántos en riesgo — con los parciales llenos, cuántos aprueban. */
function estDecisionGradoHtml(g) {
  if (!g.decs.length) {
    return '<div class="est-dec neutro">⚖️ Aún no hay notas guardadas en Notas SACE: sin datos no hay lectura del grado.</div>';
  }
  const ap = g.decs.filter(dc => dc.aprueba).length;
  const no = g.decs.length - ap;
  const regla = '<small>Normativa (Primero y Segundo Ciclo): cada alumno aprueba el año con 70 o más en cada materia; el promedio no salva una materia baja.</small>';
  if (g.decs.every(dc => dc.tipo === 'veredicto')) {
    return '<div class="est-dec ' + (no ? 'rep' : 'ok') + '"><b>📜 Año lectivo cerrado: ' + ap + ' de ' + g.decs.length + ' alumno(s) con notas aprueban.</b> ' +
      (no ? no + ' alumno(s) no aprueban y pasan a lo que dicte la normativa de recuperación.' : 'Todo el grado con notas cierra el año aprobado.') + ' ' + regla + '</div>';
  }
  return '<div class="est-dec ' + (no ? 'rep' : 'ok') + '"><b>⚖️ Si el año cerrara hoy: ' + ap + ' de ' + g.decs.length + ' alumno(s) con notas aprobarían.</b> ' +
    (no ? no + ' alumno(s) están en riesgo y todavía hay año para levantarlos: ahí va el refuerzo.' : 'Nadie está en riesgo con lo guardado hasta hoy.') +
    ' Van ' + g.parcialesConDatos.length + ' de IV parciales guardados: es una proyección, no un veredicto. ' + regla + '</div>';
}

function estImprimirInformeGrado(d) {
  if (!d.lista.length) { if (typeof toast === 'function') toast('Primero llena la lista de alumnos'); return; }
  const g = estDatosGrado(d);
  if (!g.total) {
    if (typeof toast === 'function') toast('🧪 Todos los alumnos están marcados como de prueba: no hay grado que informar');
    return;
  }
  /* La observación del maestro, si la escribió. Se recorta al tope y se
     escapa antes de meterla en la hoja; los saltos de línea se respetan
     porque casi siempre es una lista de nombres. */
  const obsDocente = (() => {
    /* Se imprime como PÁRRAFO CORRIDO: los saltos de línea del maestro se
       vuelven espacios. No es capricho — ocho renglones cortos ocupan el
       triple que el mismo texto seguido, y la diferencia entre una hoja y
       dos estaba justo ahí. El tope de caracteres solo sirve si el alto
       es predecible, y solo lo es sin saltos de línea. */
    const t = String(d.obsGrado || '').trim().slice(0, EST_OBS_MAX).replace(/\s+/g, ' ');
    return t ? adEsc(t) : '';
  })();

  /* Tope de observaciones automáticas: 5 normalmente; se midió
     imprimiendo que con 6 y la lista de refuerzo llena la hoja se pasa.
     CUANDO EL MAESTRO ESCRIBIÓ LA SUYA bajan a 3, y la lista de refuerzo
     de 12 nombres a 8: su bloque cuesta ~100 px y en la hoja solo
     sobraban 12. Se recorta lo de la máquina, no lo del maestro — sus
     tres primeras observaciones son las más graves (van ordenadas), y lo
     que él escribió no lo sabe nadie más. */
  const obs = estObservacionesGrado(g).slice(0, obsDocente ? 3 : 5);
  const refTope = obsDocente ? 8 : 12;
  const bol = d.boleta || {};
  const hoy = adFechaBonita(adHoy());
  const grupo = adGrupoTxt(d);
  const nivel = g.promGen != null ? adNotaCat(g.promGen) : null;
  const tend = estTendencia(g.saceG);
  const chip = (lbl, valTxt, cls) => '<div class="chip ' + (cls || '') + '"><span>' + lbl + '</span><b>' + valTxt + '</b></div>';

  const filaMat = c => {
    const vals = EST_PARCIALES.map(p => {
      const v = g.porMateria[c][p];
      return '<td>' + (v == null ? '—' : v) + '</td>';
    }).join('');
    const pm = g.promMat[c];
    const cat = pm != null ? adNotaCat(pm) : null;
    const n70 = g.bajo70Mat[c];
    return '<tr><td class="mat">' + adEsc(c) + '</td>' + vals +
      '<td class="prom">' + (pm == null ? '—' : pm) + '</td>' +
      '<td class="niv" style="color:' + (cat ? cat.color : '#7286a8') + '">' + (cat ? cat.label : '—') + '</td>' +
      '<td class="b70' + (n70 ? ' hay' : '') + '">' + (n70 || '—') + '</td></tr>';
  };

  /* distribución de alumnos por nivel: barra proporcional + número */
  const maxNivel = Math.max(1, ...g.porNivel.map(r => r.n));
  const nivelesHtml = g.porNivel.map(r =>
    '<div class="gr-nivel"><span style="color:' + r.cat.color + '">' + r.cat.label + (r.cat.min > 0 ? ' (' + r.cat.min + '+)' : ' (&lt;60)') + '</span>' +
    '<div class="gr-nv-pista"><i style="width:' + Math.round(100 * r.n / maxNivel) + '%;background:' + r.cat.color + '"></i></div>' +
    '<b>' + r.n + '</b></div>').join('');

  /* Días faltados MES A MES (pedido del maestro, agosto de 2026).
     El total del año no sirve para decidir nada: 96 ausencias repartidas
     parejo son un grupo normal, y las mismas 96 metidas en un solo mes
     son un problema con fecha —una feria, un aguacero, un paro— que se
     puede atacar. La Dirección necesita ver en qué mes se cayó.

     DÓNDE va y POR QUÉ, que costó dos intentos: a lo ancho de la hoja,
     debajo de las dos columnas, el bloque empujaba el informe a una
     segunda página (se midió: 12 px de más con el grupo real). Ahora
     vive DENTRO de la columna izquierda, en el hueco que quedaba bajo
     «Alumnos por nivel» —esa columna mide 282 px y la derecha 418—, y
     así no cuesta un solo píxel de alto.

     Y los meses van en COLUMNAS, no en filas: un año escolar son diez
     meses, y diez filas se comerían el hueco entero. Así el año
     completo cabe en tres renglones. */
  /* Matrícula por sexo: se CUENTA de la ficha de cada alumno (nunca se
     escribe a mano). Si a alguno le falta el dato se dice cuántos, para
     que la Dirección vea por qué las dos cifras no suman la matrícula. */
  const sex = (typeof adSexos === 'function') ? adSexos(d) : { f: 0, m: 0, sin: 0, total: 0 };
  const sexTxt = sex.sin === sex.total
    ? '<small style="font-weight:600;color:#7286a8">sin registrar</small>'
    : sex.f + ' ♀ · ' + sex.m + ' ♂' +
      (sex.sin ? ' <small style="font-weight:600;color:#7286a8">+' + sex.sin + ' s/d</small>' : '');

  const mesTxt = m => (AD_MESES_ES[(+String(m).slice(5, 7)) - 1] || m);
  const cel = (v, cls) => '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (v || '—') + '</td>';
  const mesesHtml = g.meses.length
    ? '<table class="inf-tabla gr-meses"><thead><tr><th class="gr-m-esq"></th>' +
      g.meses.map(m => '<th>' + adEsc(mesTxt(m.mes)) + '</th>').join('') + '<th>Año</th></tr></thead><tbody>' +
      '<tr><td class="mat">🚫 Sin excusa</td>' + g.meses.map(m => cel(m.A, m.A ? 'gr-m-a' : '')).join('') +
        '<td class="prom">' + g.totalA + '</td></tr>' +
      '<tr><td class="mat">📝 Con excusa</td>' + g.meses.map(m => cel(m.E)).join('') +
        '<td class="prom">' + g.totalE + '</td></tr>' +
      '<tr class="gr-m-tot"><td class="mat">Total</td>' + g.meses.map(m => cel(m.A + m.E)).join('') +
        '<td class="prom">' + (g.totalA + g.totalE) + '</td></tr></tbody></table>'
    : '<p class="inf-nada">Sin faltas registradas en el pase de lista. 🎉</p>';

  /* refuerzo: nombres cortos con su conteo — la hoja es del grado, el
     detalle de cada quien vive en su informe individual */
  const refTxt = g.refuerzo.length
    ? g.refuerzo.slice(0, refTope).map(r => '#' + r.a.num + ' ' + adEsc(adPrimerNombre(r.a.nombre) || '') + ' (' + r.bajas.length + ')').join(' · ') +
      (g.refuerzo.length > refTope ? ' · …y ' + (g.refuerzo.length - refTope) + ' más' : '')
    : null;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc('Informe del grado — ' + grupo)}</title>
<style>${estInformeCss()}
  /* propios del informe del grado: letra un punto más compacta que el
     informe del alumno, porque esta hoja junta a TODO el grupo y aun
     así tiene que caber en una sola carta (se comprobó imprimiendo) */
  .inf-centro { font-size: 15.5px; } .inf-doc { font-size: 12.5px; }
  .inf-alumno { margin: 7px 0; } .inf-alumno b { font-size: 13px; }
  .chips { margin-bottom: 8px; } .chip b { font-size: 12px; }
  .inf-h { font-size: 12px; margin-bottom: 4px; padding-bottom: 3px; }
  .inf-tabla th, .inf-tabla td { font-size: 10px; padding: 2.5px 3px; }
  .inf-tabla th { font-size: 8.5px; }
  .inf-obs { margin-bottom: 6px; } .inf-obs li { font-size: 11px; padding: 1.5px 0 1.5px 2px; line-height: 1.45; }
  .est-dec { padding: 7px 11px; font-size: 11px; line-height: 1.45; }
  .est-dec b { font-size: 12.5px; } .est-dec small { margin-top: 2px; font-size: 9px; }
  .inf-foot { padding-top: 5px; } .inf-firmas { margin-top: 14px; } .inf-fuente { margin-top: 7px; }
  .inf-tabla td.b70 { color: #b8c0d0; } .inf-tabla td.b70.hay { color: #c0392b; font-weight: 800; }
  .gr-nivel { display: flex; align-items: center; gap: 6px; margin: 3px 0; font-size: 10.5px; }
  .gr-nivel > span { width: 118px; font-weight: 700; text-align: right; }
  .gr-nv-pista { flex: 1; background: #eef2f7; border-radius: 3px; height: 11px; overflow: hidden; }
  .gr-nv-pista i { display: block; height: 100%; border-radius: 3px; }
  .gr-nivel b { width: 20px; font-size: 11.5px; }
  .gr-ref { font-size: 10.5px; line-height: 1.5; color: #223; background: #fdf6ec; border: 1px solid #ecdcbf; border-radius: 7px; padding: 5px 9px; margin-bottom: 6px; }
  /* La observación del maestro: con franja al canto, como una nota al
     margen firmada. Va pegada a las firmas a propósito — lo que se firma
     es el informe CON su observación, no el informe a secas. */
  .gr-obs { font-size: 10px; line-height: 1.35; color: #223; background: #f4f7fc;
    border: 1px solid #d4dbe6; border-left: 3px solid var(--azul); border-radius: 7px;
    padding: 4px 9px; margin-top: 5px; }
  .gr-obs b { color: var(--azul); }
  /* ── Días faltados por mes ──
     Vive DENTRO de la columna izquierda, debajo de «Alumnos por nivel»,
     y no a lo ancho de la hoja: ahí había 136px muertos (la columna
     izquierda mide 282px y la derecha 418px, medido), y a lo ancho el
     bloque empujaba el informe a una segunda hoja. Metido en el hueco
     no cuesta un solo píxel de alto.

     Los meses van en COLUMNAS y no en filas: diez filas —un año escolar
     entero— sí se comerían el hueco. Como el ancho es la mitad de la
     hoja, la letra baja a 8px y la tabla se reparte a lo fijo, para que
     con diez meses tampoco se salga de la columna. */
  .gr-meses-h { margin-top: 8px !important; }
  .gr-meses { margin-bottom: 4px; table-layout: fixed; width: 100%; }
  .gr-meses td, .gr-meses th { text-align: center; padding: 1.5px 1px; font-size: 8px; }
  .gr-meses th { font-size: 7.5px; }
  /* La esquina va VACÍA: el título del bloque ya dice «Faltas por mes»,
     y repetirlo dentro de la tabla solo le robaba ancho a los meses.
     El rótulo de cada fila se parte en dos renglones en vez de cortarse
     con «…» (la tabla de materias sí corta, pero aquí «Sin excusa» a
     medias no dice nada): alto sobra en esta columna, ancho no. */
  .gr-meses td.mat, .gr-meses th.gr-m-esq {
    text-align: left; width: 44px; line-height: 1.2; max-width: none;
    white-space: normal; overflow: visible; text-overflow: clip;
  }
  .gr-meses th.gr-m-esq { background: transparent; border-color: transparent; }
  .gr-meses td.gr-m-a { color: #c0392b; font-weight: 800; }
  .gr-m-tot td { border-top: 1.5px solid #b9c4d8; font-weight: 800; }
</style></head><body>
<section class="hoja">
  <header class="inf-head">
    <div class="inf-logo">${d.logo ? '<img src="' + d.logo + '" alt="">' : ''}</div>
    <div class="inf-tit">
      <div class="inf-centro">${adEsc((d.escuela || 'Centro Educativo').toUpperCase())}</div>
      <div class="inf-doc">INFORME DE RENDIMIENTO ACADÉMICO DEL GRADO</div>
      <div class="inf-sub">Informe estadístico para la Dirección · Año lectivo ${adEsc(bol.anio || String(new Date().getFullYear()))}</div>
    </div>
    <div class="inf-fecha">${adEsc(hoy)}</div>
  </header>

  <div class="inf-alumno">
    <div><span>Grado y sección</span><b>${adEsc(adGradoSeccion(d.grado, d.seccion) || '—')}</b></div>
    <div style="flex:2"><span>Docente</span><b>${adEsc(bol.docente || '—')}</b></div>
    <div><span>Matrícula</span><b>${g.total} alumno(s)</b></div>
    <div><span>Niñas · Varones</span><b>${sexTxt}</b></div>
    <div><span>Parciales</span><b>${g.parcialesConDatos.length} de IV</b></div>
  </div>

  <div class="chips">
    ${chip('Promedio', g.promGen != null ? g.promGen + (nivel ? ' · ' + nivel.label : '') : 'Sin notas', g.promGen == null ? '' : g.promGen >= 70 ? 'good' : 'low')}
    ${chip('Tendencia', !tend ? '—' : tend.tipo === 'sube' ? '▲ Subiendo' : tend.tipo === 'baja' ? '▼ Bajando' : '· Estable', !tend ? '' : tend.tipo === 'baja' ? 'low' : tend.tipo === 'sube' ? 'good' : '')}
    ${chip('Con todo en 70+', g.evaluables ? (g.evaluables - g.refuerzo.length) + ' de ' + g.evaluables : '—', g.evaluables && g.refuerzo.length ? 'low' : g.evaluables ? 'good' : '')}
    ${chip('Inasistencias', g.inasisSace != null ? String(g.inasisSace) : '—')}
    ${chip('Pase de lista', '🚫 ' + g.totalA + ' · 📝 ' + g.totalE)}
    ${chip('Misiones M.E.T.A.S.', g.practican != null ? g.practican + ' de ' + g.total + ' practican' : '—', g.practican ? 'good' : '')}
  </div>

  <div class="inf-cols">
    <div class="inf-col">
      <div class="inf-h">🧮 Promedio por materia <small>(media de los alumnos con nota)</small></div>
      <table class="inf-tabla">
        <thead><tr><th>Materia</th><th>I</th><th>II</th><th>III</th><th>IV</th><th>Prom.</th><th>Nivel</th><th>&lt;70</th></tr></thead>
        <tbody>${g.matsConDatos.length ? g.matsConDatos.map(filaMat).join('') : '<tr><td colspan="8" class="vacio">Sin notas guardadas</td></tr>'}</tbody>
      </table>
      <div class="inf-h" style="margin-top:8px">🧒 Alumnos por nivel <small>(según su promedio del año; con notas: ${g.conNotas} de ${g.total})</small></div>
      ${nivelesHtml}
      <div class="inf-h gr-meses-h">📋 Faltas por mes <small>(pase de lista de todo el grado)</small></div>
      ${mesesHtml}
    </div>
    <div class="inf-col">
      <div class="inf-h">📊 Estado vigente por materia <small>(última nota · | = parcial anterior)</small></div>
      ${g.estado.length ? estGBarras(g.estado, { w: 340, maxw: 420, compacto: true }) + estLeyendaNotas() : '<p class="inf-nada">Sin notas todavía.</p>'}
      <div class="inf-h" style="margin-top:8px">📈 Evolución del promedio por parcial</div>
      ${/* 95px y no 115: las notas viven entre 60 y 100, así que el tercio
           de abajo del gráfico salía siempre en blanco. Esos 20px son los
           que le hacen sitio a la observación del maestro. */''}
      ${g.parcialesConDatos.length ? estGEvolucion(g.saceG, { w: 340, h: 95, maxw: 420 }) : '<p class="inf-nada">Aparece al guardar notas de al menos un parcial.</p>'}
    </div>
  </div>

  <div class="inf-h" style="margin-top:7px">🔎 Lectura de los datos del grado <small>(coincidencias en lo registrado, no causas)</small></div>
  <ul class="inf-obs">
    ${obs.map(o => '<li>' + o + '</li>').join('')}
  </ul>

  ${refTxt ? '<div class="gr-ref"><b>Refuerzo primero (materias bajo 70 hoy):</b> ' + refTxt + '.</div>' : ''}

  ${estDecisionGradoHtml(g)}

  ${obsDocente ? '<div class="gr-obs"><b>✍️ Observación del docente de grado:</b> ' + obsDocente + '</div>' : ''}

  <footer class="inf-foot">
    <div class="inf-firmas">
      <div><i></i><b>${adEsc(bol.docente) || '&nbsp;'}</b><span>Docente de grado</span></div>
      <div><i></i><b>${adEsc(bol.director) || '&nbsp;'}</b><span>Director(a) · Recibido</span></div>
    </div>
    <p class="inf-fuente">Informe del grado ${adEsc(grupo)} generado por M.E.T.A.S. con los registros del aula (Notas SACE, pase de lista,
      Plan de Acción y práctica de misiones en la nube) al ${adEsc(hoy)}. El detalle de cada alumno está en su informe individual.${
      g.pruebas ? ' No se cuenta' + (g.pruebas === 1 ? ' 1 registro de prueba del docente, ajeno' : ' ' + g.pruebas + ' registros de prueba del docente, ajenos') + ' a la matrícula.' : ''}</p>
  </footer>
</section>
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}
