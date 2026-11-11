/* ══════════════════════════════════════════════════════════════
   REGISTROS ADMINISTRATIVOS — la oficina del maestro (Zona Docente)

   Tres registros que el aula necesita y que hoy viven en cuadernos:
   💰 Economía   — colaboraciones y acuerdos de reunión (quién dio,
                   cuánto se recaudó, en qué se gastó, saldo).
   📋 Asistencia — pase de lista rápido: solo se marca lo excepcional
                   (ausente / con excusa); resumen mensual por alumno.
   🧮 Notas SACE — notas finales por parcial y materia, con columna
                   lista para copiar y pegar en el archivo de SACE.

   Todo es offline-first en METAS_ADMIN_V1 (localStorage, estado v2 con
   GRUPOS: un maestro puede atender varios grados/secciones, incluso en
   dos colegios). La lista de alumnos del grupo activo alimenta los tres
   registros Y el Plan de Acción; las claves de familia nacen aquí
   (llave 'G:<id>' en METAS_CODIGOS_V1). Se sincroniza entre equipos con
   el espejo del maestro (metas-docente-sync) y a la nube del chatbot.
══════════════════════════════════════════════════════════════ */

const ADMIN_KEY = 'METAS_ADMIN_V1';
const AD_MATERIAS_DEF = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas',
                         'Ciencias Sociales', 'Ciencias Naturales', 'Educación Física', 'Educación Cívica'];
/* Rasgos de PERSONALIDAD de la boleta (nota cualitativa en letra). Van por
   parcial igual que las materias. Escala estándar Honduras: S, MB, B. */
const AD_PERSONALIDAD = ['Puntualidad', 'Espíritu de trabajo', 'Orden y presentación',
                         'Sociabilidad', 'Moralidad'];
const AD_PERS_ESCALA_DEF = ['S', 'MB', 'B'];
const AD_PERS_SIGNIF = { S: 'Sobresaliente', MB: 'Muy Bueno', B: 'Bueno',
                         E: 'Excelente', R: 'Regular', D: 'Deficiente',
                         NS: 'No Satisfactorio', PS: 'Poco Satisfactorio' };
/* Equivalencia numérica OFICIAL del SACE para la valoración final de un
   rasgo de personalidad: se promedian los parciales y el redondeo vuelve
   a letra (MB, S, B, MB → 12/4 = 3 → MB). Solo estas letras tienen
   número; a una escala propia del docente no se le inventa equivalencia. */
const AD_PERS_NUM = { S: 4, MB: 3, B: 2, NS: 1 };
const AD_PERS_DE_NUM = { 4: 'S', 3: 'MB', 2: 'B', 1: 'NS' };

/* Convierte un valor cualitativo de personalidad a su número oficial SACE:
   4: Sobresaliente (S), 3: Muy Bueno (MB), 2: Bueno (B), 1: Insuficiente / No Satisfactorio (NS / I). */
function adPersANumero(val, escala) {
  if (val == null || val === '') return '';
  const k = String(val).trim().toUpperCase();
  if (!k) return '';
  if (AD_PERS_NUM[k] != null) return String(AD_PERS_NUM[k]);
  if (k === '4' || k === '3' || k === '2' || k === '1') return k;
  if (k === 'SOBRESALIENTE' || k === 'E' || k === 'EXCELENTE') return '4';
  if (k === 'MUY BUENO' || k === 'MUYBUENO') return '3';
  if (k === 'BUENO') return '2';
  if (k === 'I' || k === 'INSUFICIENTE' || k === 'PS' || k === 'R' || k === 'D' || k === 'NO SATISFACTORIO') return '1';
  if (Array.isArray(escala)) {
    const idx = escala.map(x => String(x).trim().toUpperCase()).indexOf(k);
    if (idx >= 0 && idx < 4) return String(4 - idx);
  }
  return k;
}

let _adTab = 'lista';        /* lista | eco | asis | eq | ctrl | sace | est | lec | com */
let _adColectaId = null;     /* colecta abierta en Economía */
let _adGastosOn = 0;         /* dentro de «Gastos de mi bolsillo» */
let _adInvOn = 0;            /* dentro de «Inventario del aula» */
let _adFichasOn = 0;         /* dentro de «Identidad y contactos» */
let _adControlId = null;     /* control abierto en Controles */
let _adSaceParcial = 'I';    /* Parcial activo en Notas SACE: I | II | III | IV */
let _adSaceVista = 'aprov';   /* Sección a llenar: aprov | pers | inasis */
let _adPersCopyModo = 'preguntar'; /* Cómo copiar Personalidad con 📋: preguntar | num | letra */
let _adGrupoActivoId = null; /* Grupo/sección activo en el aula */
try {
  const _sp = localStorage.getItem('METAS_SACE_PARCIAL');
  if (['I', 'II', 'III', 'IV'].includes(_sp)) _adSaceParcial = _sp;
  const _sv = localStorage.getItem('METAS_SACE_VISTA');
  if (['aprov', 'pers', 'inasis'].includes(_sv)) _adSaceVista = _sv;
  const _pm = localStorage.getItem('METAS_PERS_COPY_MODO');
  if (['preguntar', 'num', 'letra'].includes(_pm)) _adPersCopyModo = _pm;
  const _sg = localStorage.getItem('METAS_ADMIN_GRUPO_ACTIVO');
  if (_sg) _adGrupoActivoId = _sg;
} catch (_) {}

/* ── Estado v2: GRUPOS (multi-aula) ──
   Un maestro puede atender varios grupos, incluso en DOS colegios.
   { v:2, activo:'GXXXXX', grupos:[{ id, escuela, grado, seccion,
     materias, lista, colectas, asistencia, notas }] }
   adLoad()/adSave() conservan su contrato de siempre pero operan sobre
   el GRUPO ACTIVO: Economía/Asistencia/SACE no necesitan cambios.
   El id del grupo es la llave de las claves de familia
   (METAS_CODIGOS_V1, llave 'G:<id>'): dos colegios con «6º 1» ya no
   chocan entre sí. */
const AD_ID_ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/* Datos oficiales del REVERSO de la boleta (portada SEDUC Honduras).
   El docente se prellena con el nombre de la cuenta del maestro si existe. */
function adBoletaDef() {
  let doc = '';
  try { const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); if (d && d.nombre) doc = d.nombre; } catch (_) {}
  return { director: '', docente: doc, lugar: '', municipio: '', departamento: '',
    anio: String(new Date().getFullYear()), escalaPers: AD_PERS_ESCALA_DEF.slice(), parcialFechas: {} };
}

function adGrupoNuevo(props) {
  let id = 'G';
  for (let i = 0; i < 5; i++) id += AD_ID_ALFA[Math.floor(Math.random() * AD_ID_ALFA.length)];
  return Object.assign({ id, escuela: '', grado: '', seccion: '', logo: '', logoSec: '', boleta: adBoletaDef(),
    materias: AD_MATERIAS_DEF.slice(), lista: [], colectas: [], asistencia: [], notas: {}, controles: [],
    bitacora: [], lectura: [], convocatorias: [] }, props || {});
}

function adNormGrupo(g) {
  g.id = g.id || adGrupoNuevo().id;
  g.escuela = g.escuela || '';
  g.grado = g.grado || '';
  g.seccion = g.seccion || '';
  g.logo = typeof g.logo === 'string' ? g.logo : '';
  g.logoSec = typeof g.logoSec === 'string' ? g.logoSec : '';
  g.boleta = Object.assign(adBoletaDef(), (g.boleta && typeof g.boleta === 'object') ? g.boleta : {});
  if (!Array.isArray(g.boleta.escalaPers) || !g.boleta.escalaPers.length) g.boleta.escalaPers = AD_PERS_ESCALA_DEF.slice();
  if (!g.boleta.parcialFechas || typeof g.boleta.parcialFechas !== 'object') g.boleta.parcialFechas = {};
  g.lista = Array.isArray(g.lista) ? g.lista : [];
  g.colectas = Array.isArray(g.colectas) ? g.colectas : [];
  g.asistencia = Array.isArray(g.asistencia) ? g.asistencia : [];
  g.controles = Array.isArray(g.controles) ? g.controles : [];
  g.convocatorias = Array.isArray(g.convocatorias) ? g.convocatorias : [];  /* 📣 «¿va o no va?» */
  g.bitacora = Array.isArray(g.bitacora) ? g.bitacora : [];   /* novedades de la clase */
  /* tomas de lectura (palabras por minuto): el canal ya queda listo para
     la herramienta de lectura; su forma está descrita en
     js/tools/estadisticas-alumno.js, que es quien las dibuja */
  g.lectura = Array.isArray(g.lectura) ? g.lectura : [];
  g.materias = Array.isArray(g.materias) && g.materias.length ? g.materias : AD_MATERIAS_DEF.slice();
  g.notas = (g.notas && typeof g.notas === 'object') ? g.notas : {};
  return g;
}

/* Al migrar de v1, las claves de familia ya emitidas (llave 'grado|sec')
   se mueven a la llave del grupo nuevo: las tiras entregadas siguen valiendo. */
function adMigrarCodigos(g) {
  try {
    const codes = JSON.parse(localStorage.getItem('METAS_CODIGOS_V1')) || {};
    const gg = String(g.grado || '').replace(/\D/g, '');
    const mSec = String(g.seccion || '').trim().match(/([a-zA-Z0-9])\s*$/);
    const vieja = gg + '|' + (mSec ? mSec[1].toUpperCase() : '');
    if (codes[vieja] && !codes['G:' + g.id]) {
      codes['G:' + g.id] = codes[vieja];
      delete codes[vieja];
      localStorage.setItem('METAS_CODIGOS_V1', JSON.stringify(codes));
    }
  } catch (_) {}
}

/* ── 🕘 PAPELERA DE ACCIDENTES ──
   Antes de CADA acción que borra o reemplaza datos se guarda una foto
   (admin + claves + comunicados + plan). «Restaurar» vuelve exacto a
   ese momento y la nube se corrige sola con el sync diferencial. */
const AD_UNDO_KEY = 'METAS_ADMIN_UNDO_V1';
const AD_UNDO_MAX = 14;
const AD_UNDO_PRESUPUESTO = 1500000;   /* caracteres; deja sitio al aula y a la base de la nube */

/* Suelta la mitad más vieja de las fotos de «Deshacer» para hacer sitio.
   Devuelve true si liberó algo. La usa también la sincronización antes de
   quedarse sin base (js/metas-docente-sync.js). */
function adLiberarEspacio() {
  const arr = adUndoLista();
  if (!arr.length) return false;
  const quedan = arr.slice(Math.ceil(arr.length / 2));
  try {
    if (quedan.length) localStorage.setItem(AD_UNDO_KEY, JSON.stringify(quedan));
    else localStorage.removeItem(AD_UNDO_KEY);
  } catch (_) { try { localStorage.removeItem(AD_UNDO_KEY); } catch (__) {} }
  return true;
}
window.metasLiberarEspacio = adLiberarEspacio;
function adUndoLista() {
  try { const a = JSON.parse(localStorage.getItem(AD_UNDO_KEY)); return Array.isArray(a) ? a : []; }
  catch (_) { return []; }
}
function adUndoGuardar(etiqueta) {
  try {
    const foto = {
      t: new Date().toISOString(), e: String(etiqueta || 'Cambio'),
      admin: localStorage.getItem(ADMIN_KEY),
      codes: localStorage.getItem('METAS_CODIGOS_V1'),
      avisos: localStorage.getItem('METAS_AVISOS_V1'),
      plan: localStorage.getItem('METAS_PLANACCION_V1'),
    };
    let arr = adUndoLista();
    arr.push(foto);
    arr = arr.slice(-AD_UNDO_MAX);
    /* Tope de espacio: 14 fotos de un aula llena pasaban de los 5 MB del
       navegador, y cuando el almacén se llenaba el siguiente guardado de
       Mi aula fallaba EN SILENCIO (la importación del SACE «no guardaba»).
       Las fotos se quedan con un presupuesto y siempre queda la última. */
    while (arr.length > 1 && JSON.stringify(arr).length > AD_UNDO_PRESUPUESTO) arr.shift();
    /* si no cabe (fotos muy grandes), se sueltan las más viejas */
    while (arr.length) {
      try { localStorage.setItem(AD_UNDO_KEY, JSON.stringify(arr)); return; }
      catch (_) { arr.shift(); }
    }
  } catch (_) {}
}
async function adUndoRestaurar(i) {
  const arr = adUndoLista();
  const f = arr[i];
  if (!f) return;
  if (!await metasConfirm('Se restaurará **todo Mi aula** exactamente a como estaba ' +
    '**antes de: ' + f.e + '** (' + adFechaBonita(String(f.t).slice(0, 10)) + ' ' +
    String(f.t).slice(11, 16) + ').\n\n⚠️ Lo que hayas cambiado en Mi aula DESPUÉS de ese momento se pierde. ' +
    'La nube del chatbot se corrige sola al sincronizar. ¿Restaurar?',
    { icono: '🕘', titulo: 'Deshacer / Restaurar', okTxt: 'Sí, restaurar' })) return;
  try {
    const pares = [[ADMIN_KEY, f.admin], ['METAS_CODIGOS_V1', f.codes],
                   ['METAS_AVISOS_V1', f.avisos], ['METAS_PLANACCION_V1', f.plan]];
    pares.forEach(([k, v]) => {
      if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    });
    /* esta foto y las posteriores ya no aplican */
    localStorage.setItem(AD_UNDO_KEY, JSON.stringify(arr.slice(0, i)));
  } catch (_) {}
  adSyncProgramar();
  renderAdmin();
  toast('🕘 Restaurado: ' + f.e);
}
function adUndoTarjetaHtml() {
  const lista = adUndoLista();
  if (!lista.length) return '';
  return `
    <div class="pa-card ad-undo-card">
      <div class="pa-card-title">🕘 Deshacer o restaurar cambios</div>
      <p class="pa-optional-hint">Antes de borrar una fila o cambiar el orden se guarda una copia automática. Si borraste u ordenaste una fila <strong>por error</strong>, restáurala aquí:</p>
      ${lista.map((f, i) => `
        <div class="ad-gasto-row" style="align-items:center">
          <span style="flex:1"><strong>Antes de: ${adEsc(f.e)}</strong><br>
            <small>${adFechaBonita(String(f.t).slice(0, 10))} · ${String(f.t).slice(11, 16)}</small></span>
          <button type="button" class="pa-generate-btn ad-btn-sec ad-undo-btn" data-ui="${i}">↩️ Restaurar</button>
        </div>`).reverse().join('')}
    </div>`;
}
function adUndoEnganchar(body) {
  if (!body) return;
  body.querySelectorAll('.ad-undo-btn').forEach(b => {
    if (b.dataset.undoBound) return;
    b.dataset.undoBound = '1';
    b.addEventListener('click', () => adUndoRestaurar(+b.dataset.ui));
  });
}

/* ══════════════ 🪦 FICHAS BORRADAS QUE NO VUELVEN ══════════════
   Borrar una fila renumera la lista (1..n). Cuando un equipo sin «base»
   fusiona con la nube, la fusión une las dos copias y la fila que sobraba
   en la copia vieja reaparece al final (la #43 «Alumno» que volvía).

   Por eso cada borrado deja una marca en el grupo, d.borrados =
   [{ t, n, nombre, idn }]: cuándo, cuántas filas quedaron y qué ficha
   era. Al leer el aula se quita toda ficha que aparezca DESPUÉS de la
   fila n, que no se haya creado después del borrado (`alta`) y que sea la
   borrada o un duplicado de una que ya está; y la borrada con nombre o
   identidad se quita esté donde esté (una copia vieja la trae en su
   número viejo). Lo que se añade a propósito
   lleva `alta` y nunca se toca; «Deshacer» devuelve la foto de antes del
   borrado, sin la marca, y la ficha vuelve porque así se quiso.
   Solo se quita la FICHA; las notas no se miran. */
const AD_BORRADOS_MAX = 20;
function adFirmaFicha(a) {
  return String((a && a.nombre) || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/\s+/g, ' ').trim() + '|' + String((a && a.idn) || '').replace(/\D/g, '');
}
function adPurgarRevividas(g) {
  const tumbas = (Array.isArray(g.borrados) ? g.borrados : []).filter(b => b && +b.t > 0 && +b.n >= 0);
  if (!tumbas.length || !Array.isArray(g.lista)) return 0;
  const lista = g.lista.slice().sort((a, b) => (+a.num || 0) - (+b.num || 0));
  const fuera = new Set();
  const viejaPara = (a, b) => !((+a.alta || 0) > +b.t);
  tumbas.forEach(b => {
    const fb = adFirmaFicha(b);
    /* 1 · La ficha borrada, esté donde esté: de las que se le parecen
       (mismo nombre e identidad) se dejan las que quedaban al borrar
       (`quedan`, casi siempre 0) y se quita el resto. Con nombre o
       identidad, la firma es la ficha; vacía no dice quién es. */
    if (fb !== '|') {
      const iguales = lista.filter(a => !fuera.has(a) && viejaPara(a, b) && adFirmaFicha(a) === fb);
      iguales.slice(Math.max(0, +b.quedan || 0)).forEach(a => fuera.add(a));
    }
    /* 2 · Lo que sobra DESPUÉS de la última fila que quedó: la borrada
       si era vacía, o el duplicado que deja una lista renumerada */
    lista.forEach(a => {
      if (fuera.has(a) || +a.num <= +b.n || !viejaPara(a, b)) return;
      const f = adFirmaFicha(a);
      if (f === fb || lista.some(x => x !== a && !fuera.has(x) && +x.num <= +b.n && adFirmaFicha(x) === f)) fuera.add(a);
    });
  });
  if (!fuera.size) return 0;
  g.lista = g.lista.filter(a => !fuera.has(a));
  return fuera.size;
}
function adMarcarBorrado(g, al) {
  const ahora = Date.now();
  const firma = adFirmaFicha(al);
  g.borrados = (Array.isArray(g.borrados) ? g.borrados : [])
    .filter(b => b && ahora - (+b.t || 0) < 400 * 864e5)
    .concat([{ t: ahora, n: g.lista.length, nombre: String(al.nombre || ''), idn: String(al.idn || ''),
      quedan: g.lista.filter(a => adFirmaFicha(a) === firma).length }])
    .slice(-AD_BORRADOS_MAX);
}

function adState() {
  let st = null;
  try { st = JSON.parse(localStorage.getItem(ADMIN_KEY)); } catch (_) {}
  if (st && st.v === 2 && Array.isArray(st.grupos) && st.grupos.length) {
    st.grupos.forEach(adNormGrupo);
    let revividas = 0;
    st.grupos.forEach(g => { revividas += adPurgarRevividas(g); });
    if (revividas) { try { localStorage.setItem(ADMIN_KEY, JSON.stringify(st)); } catch (_) {} }
    if (_adGrupoActivoId && st.grupos.some(g => g.id === _adGrupoActivoId)) {
      st.activo = _adGrupoActivoId;
    } else if (st.grupos.some(g => g.id === st.activo)) {
      _adGrupoActivoId = st.activo;
    } else {
      st.activo = st.grupos[0].id;
      _adGrupoActivoId = st.activo;
    }
    return st;
  }
  /* migración desde v1 (objeto plano) o inicio en blanco */
  const g = adGrupoNuevo();
  if (st && typeof st === 'object' && !st.v) {
    g.grado = st.grado || ''; g.seccion = st.seccion || '';
    g.lista = Array.isArray(st.lista) ? st.lista : [];
    g.colectas = Array.isArray(st.colectas) ? st.colectas : [];
    g.asistencia = Array.isArray(st.asistencia) ? st.asistencia : [];
    g.materias = Array.isArray(st.materias) && st.materias.length ? st.materias : AD_MATERIAS_DEF.slice();
    g.notas = (st.notas && typeof st.notas === 'object') ? st.notas : {};
    adMigrarCodigos(g);
  }
  const nuevo = { v: 2, activo: g.id, grupos: [adNormGrupo(g)] };
  _adGrupoActivoId = g.id;
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(nuevo)); } catch (_) {}
  return nuevo;
}
function adStateSave(st) {
  if (_adGrupoActivoId && st && st.grupos && st.grupos.some(g => g.id === _adGrupoActivoId)) {
    st.activo = _adGrupoActivoId;
  }
  const txt = JSON.stringify(st);
  let ok = false;
  try { localStorage.setItem(ADMIN_KEY, txt); ok = true; } catch (_) {}
  /* Si no cupo, se hace sitio soltando fotos viejas de «Deshacer» y se
     reintenta. Un guardado de Mi aula NUNCA puede fallar callado: el
     maestro cree que guardó y al recargar no hay nada. */
  while (!ok && adLiberarEspacio()) {
    try { localStorage.setItem(ADMIN_KEY, txt); ok = true; } catch (_) {}
  }
  if (!ok) adAvisarSinEspacio();
  adSyncProgramar();   /* la nube del chatbot se actualiza sola, con calma */
  return ok;
}
let _adAvisoEspacio = 0;
function adAvisarSinEspacio() {
  if (Date.now() - _adAvisoEspacio < 60000) return;
  _adAvisoEspacio = Date.now();
  const txt = 'No se pudo guardar el último cambio: el almacenamiento de este navegador está lleno. ' +
    'Tus datos anteriores siguen a salvo. Libera espacio (borra datos de otras páginas en este navegador) y vuelve a intentarlo.';
  if (typeof metasAlert === 'function') metasAlert(txt, { icono: '⚠️', titulo: 'No se guardó' });
  else if (typeof toast === 'function') toast('⚠️ ' + txt);
}

function adLoad() {
  const st = adState();
  return st.grupos.find(g => g.id === st.activo) || st.grupos[0];
}
function adSave(d) {
  const st = adState();
  const i = st.grupos.findIndex(x => x.id === d.id);
  if (i >= 0) st.grupos[i] = d; else st.grupos.push(adNormGrupo(d));
  return adStateSave(st);
}

/* ── Claves de familia por GRUPO ──
   La clave (ej. 15-K7QM) es la IDENTIDAD del niño ante la nube y el
   chatbot de padres. Vive en METAS_CODIGOS_V1 bajo la llave del grupo
   ('G:<id>'), se genera sola la primera vez y NO cambia aunque el
   maestro corrija grado/sección/colegio. */
/* El sufijo EMPIEZA con letra: así «5-6YF7» nunca se confunde con
   «56-YF7» en la tira ni en el chatbot (el nº de lista queda claro). */
const AD_ID_LETRAS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
function adSufijoClave() {
  let suf = AD_ID_LETRAS[Math.floor(Math.random() * AD_ID_LETRAS.length)];
  for (let i = 0; i < 3; i++) suf += AD_ID_ALFA[Math.floor(Math.random() * AD_ID_ALFA.length)];
  return suf;
}
/* Bonita con el nº de lista conocido: 5 + 6YF7 → «5-6YF7» (el replace
   ciego de dígitos mostraría «56-YF7», que confunde a la familia) */
function adClaveBonita(clave, num) {
  const c = String(clave || ''), n = String(num || '');
  if (n && c.indexOf(n) === 0) return n + '-' + c.slice(n.length);
  return c.replace(/^(\d+)/, '$1-');
}
function adClaveFamilia(grupoId, num, crear) {
  const n = String(num || '').replace(/\D/g, '');
  if (!grupoId || !n || typeof paCodesLoad !== 'function') return '';
  const codes = paCodesLoad();
  const key = 'G:' + grupoId;
  const cg = codes[key] || (codes[key] = {});
  if (!cg[n]) {
    if (crear === false) return '';
    cg[n] = n + adSufijoClave();
    paCodesSave(codes);
  }
  return cg[n];
}
function adClaveFamiliaSet(grupoId, num, clave) {
  const n = String(num || '').replace(/\D/g, '');
  if (!grupoId || !n || typeof paCodesLoad !== 'function') return '';
  const codes = paCodesLoad();
  const key = 'G:' + grupoId;
  const cg = codes[key] || (codes[key] = {});
  cg[n] = clave;
  paCodesSave(codes);
  return clave;
}
window.adClaveFamilia = adClaveFamilia;

function adEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
/* Primer nombre del alumno (para las fichas de pago/asistencia) */
function adPrimerNombre(nombre) {
  return String(nombre || '').trim().split(/\s+/)[0] || '';
}

/* ══════════════ 🧪 ALUMNO DE PRUEBA ══════════════
   Casi todo maestro deja uno o dos «alumnos» inventados al final de la
   lista para probar la plataforma —una toma de lectura, una nota, una
   clave— sin tocar el expediente de un niño de verdad. El problema no
   es que existan: es que se colaban en el INFORME DEL GRADO que recibe
   la Dirección. Ahí un alumno inventado infla la matrícula («43» cuando
   son 42), baja el promedio del grado y suma inasistencias que nadie
   faltó. Un papel firmado por el director no puede llevar eso.

   Marcado con `prueba: true`, el alumno sigue entero donde el maestro
   trabaja —lista, asistencia, notas, lectura, su informe individual—
   pero queda FUERA de todo lo que cuenta al grupo. El informe del grado
   dice cuántos dejó fuera: callarlo sería peor que contarlos.

   Se marca por alumno y NUNCA por su número: el nº de lista sigue
   siendo el oficial del SACE y la clave de familia no se toca. */
function adEsPrueba(a) { return !!(a && a.prueba); }
function adAlumnosReales(d) { return (d.lista || []).filter(a => !adEsPrueba(a)); }
function adCuentaPruebas(d) { return (d.lista || []).filter(adEsPrueba).length; }

/* ══════════════ NIÑAS Y VARONES ══════════════
   La matrícula por sexo la pide la Dirección y la pide el Parte Mensual
   del SEDUC, que hoy obliga al maestro a contarlos a mano cada mes. Se
   guarda por alumno (`sexo`: 'F' o 'M') y se CUENTA, nunca se escribe:
   así el número no envejece cuando entra o se va un niño.

   Los 🧪 de prueba no cuentan, igual que en el resto del informe. Los
   que aún no tienen el dato se cuentan aparte y se dicen: un «22 y 20»
   que no suma la matrícula es un número que la Dirección no puede usar. */
function adSexos(d) {
  /* con la lista del SACE importada cuenta la matrícula final (la oficial);
     sin ella, todos menos los trasladados y desertores */
  const reales = window.SaceLista ? SaceLista.alumnosQueCuentan(d) : adAlumnosReales(d);
  let f = 0, m = 0;
  reales.forEach(a => { if (a.sexo === 'F') f++; else if (a.sexo === 'M') m++; });
  return { f, m, sin: reales.length - f - m, total: reales.length };
}
/* «22 ♀ · 20 ♂» y, si falta alguno, cuántos faltan */
function adSexosTxt(d) {
  const s = adSexos(d);
  if (!s.total) return 'sin alumnos';
  if (s.sin === s.total) return 'sexo sin registrar';
  return s.f + ' ♀ · ' + s.m + ' ♂' + (s.sin ? ' · faltan ' + s.sin : '');
}
window.adSexos = adSexos;

/* Marca o desmarca al alumno. Devuelve cómo quedó (true = de prueba). */
function adTogglePrueba(num) {
  const dd = adLoad();
  const a = (dd.lista || []).find(x => String(x.num) === String(num));
  if (!a) return false;
  if (a.prueba) delete a.prueba; else a.prueba = true;
  adSave(dd);
  return !!a.prueba;
}
window.adEsPrueba = adEsPrueba;
window.adAlumnosReales = adAlumnosReales;

function adHoy() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
         String(d.getDate()).padStart(2, '0');
}
function adFechaBonita(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] + '/' + m[2] + '/' + m[1] : String(iso || '');
}
function adLps(n) {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  return 'L ' + v.toLocaleString('es-HN');
}
/* ══════════════ NORMATIVA · CÓMO SE ESCRIBE UN GRUPO ══════════════
   Un grupo SIEMPRE se lee «6º-1»: el grado con su MARCA DE ORDINAL,
   guion, y la sección. Nada de inventar el formato en cada pantalla.

   Por qué, y en este orden se fueron corrigiendo:
     «61»   → parecía el número sesenta y uno.
     «6-1»  → ya separaba, pero el 6 seguía leyéndose como cantidad.
     «6º-1» → dice lo que es: SEXTO grado, sección 1.

   El maestro escribe el grado como le sale —«6», «6º», «6°», «6o»— y
   aquí se muestra siempre igual. Si escribe una palabra («Bachillerato»,
   «Kinder») se respeta tal cual: el ordinal solo aplica a números.

   ► TODA pantalla, documento impreso o mensaje que junte grado y
     sección pasa por adGradoSeccion(). Si algún día hay que cambiar el
     formato otra vez, se cambia AQUÍ y en ningún otro lugar.
   ► NO la usa la lógica interna: las claves de familia
     (paCodigoAlumno/adClaveFamilia), las llaves de guardado y los
     nombres de archivo trabajan con los DÍGITOS pelados. Meterles la
     «º» invalidaría claves ya entregadas a las familias.
   ► Las páginas que no cargan este archivo (padres.html) llevan su
     propia copia de la regla, marcada con esta misma nota. */
/* Abre un documento en su ventana de impresión CON salida a la vista: en el
   teléfono la pestaña del documento tapa la app y más de un maestro se quedó
   ahí, sin saber que había que cerrarla para volver. La barra de abajo lo
   dice y da el botón; en el papel no sale (@media print). Todas las
   impresiones de la app pasan por aquí. */
function adPrintAbrir(html) {
  const w = window.open('', '_blank');
  if (!w) { if (typeof toast === 'function') toast('Permite las ventanas emergentes para imprimir'); return null; }
  const barra = `<style>
    .ad-volver-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; background: #0f2350;
      color: #fff; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;
      padding: 9px 12px; font-family: Arial, Helvetica, sans-serif; font-size: 12.5px;
      box-shadow: 0 -2px 10px rgba(0,0,0,.3); }
    .ad-volver-bar button, #ad-volver-lista .ad-vl-btn { border: none; border-radius: 999px; padding: 10px 18px;
      font-size: 14px; font-weight: 800; background: #ffd34d; color: #0f2350; cursor: pointer; }
    #ad-volver-lista { display: none; position: fixed; inset: 0; z-index: 10000;
      background: rgba(15, 35, 80, .55); align-items: center; justify-content: center;
      font-family: Arial, Helvetica, sans-serif; }
    #ad-volver-lista .ad-vl-card { background: #fff; border-radius: 14px; padding: 20px 24px;
      max-width: 340px; margin: 16px; text-align: center; box-shadow: 0 10px 34px rgba(0,0,0,.35); }
    #ad-volver-lista .ad-vl-ico { font-size: 36px; }
    #ad-volver-lista .ad-vl-t { font-size: 14.5px; color: #0f2350; font-weight: 800; margin: 8px 0 4px; }
    #ad-volver-lista .ad-vl-s { font-size: 12px; color: #55637d; margin-bottom: 14px; line-height: 1.45; }
    #ad-volver-lista .ad-vl-seguir { display: inline-block; margin-top: 10px; border: none; background: none;
      color: #55637d; font-size: 12px; text-decoration: underline; cursor: pointer; }
    body { padding-bottom: 62px; }
    @media print { .ad-volver-bar, #ad-volver-lista { display: none !important; } body { padding-bottom: 0 !important; } }
  </style>
  <div class="ad-volver-bar"><span>Cuando termines de imprimir o guardar el PDF…</span>
    <button onclick="window.close()">✅ Cerrar y volver a M.E.T.A.S.</button></div>
  <div id="ad-volver-lista">
    <div class="ad-vl-card">
      <div class="ad-vl-ico">✅</div>
      <div class="ad-vl-t">¿Terminaste con este documento?</div>
      <div class="ad-vl-s">Cierra esta ventana para volver a M.E.T.A.S. — mientras siga abierta, la aplicación queda esperándote.</div>
      <button class="ad-vl-btn" onclick="window.close()">Cerrar y volver a M.E.T.A.S.</button><br>
      <button class="ad-vl-seguir" onclick="document.getElementById('ad-volver-lista').style.display='none'">Seguir viendo el documento</button>
    </div>
  </div>
  <script>
    /* Al salir del diálogo de imprimir (imprimió o canceló), ofrecer la
       salida en grande: en la app instalada esta ventana tapa todo y no es
       obvio que hay que cerrarla para volver. */
    window.addEventListener('afterprint', function () {
      var o = document.getElementById('ad-volver-lista');
      if (o) o.style.display = 'flex';
    });
  <\/script>`;
  w.document.write(html.indexOf('</body>') >= 0 ? html.replace('</body>', barra + '</body>') : html + barra);
  w.document.close();
  try { w.focus(); } catch (_) {}
  /* la app de origen también lo dice: si la ventana nueva tapa todo, al
     menos se supo a dónde se fue y cómo se vuelve */
  if (typeof toast === 'function') toast('🖨️ Documento abierto en otra ventana. Al terminar, ciérrala con su botón amarillo para volver.');
  return w;
}

function adGradoOrdinal(grado) {
  const g = String(grado || '').trim();
  if (!g) return '';
  const m = g.match(/^(\d{1,2})\s*[ºo°]?$/i);
  return m ? m[1] + 'º' : g;
}
/* El guion solo entra cuando las dos partes son cortas, que es como las
   escribe el maestro (6º-1, 9º-2, 7º-A); con «Bachillerato» y «A» un
   guion quedaría raro y se usa el espacio de siempre. */
function adGradoSeccion(grado, seccion) {
  const g = adGradoOrdinal(grado);
  const s = String(seccion || '').trim();
  if (!g || !s) return g || s;
  return (g.length <= 4 && s.length <= 3) ? g + '-' + s : g + ' ' + s;
}
window.adGradoSeccion = adGradoSeccion;
/* Para lectores de pantalla y para el «title» del chip: sin abreviar.
   Aquí la palabra «Grado» ya dice lo que es, así que el número va pelado
   («Grado 6», no «Grado 6º»), aunque el maestro lo haya escrito con º. */
function adGrupoTitulo(g) {
  const grado = String(g.grado || '').trim().replace(/\s*[ºo°]\s*$/i, '');
  const sec = String(g.seccion || '').trim();
  const partes = [];
  if (grado) partes.push('Grado ' + grado);
  if (sec) partes.push('Sección ' + sec);
  if (g.escuela) partes.push(String(g.escuela).trim());
  return partes.join(' · ') || 'Grupo sin nombre';
}
function adGrupoTxt(d) {
  const gs = adGradoSeccion(d.grado, d.seccion);
  return gs + (d.escuela ? (gs ? ' · ' : '') + String(d.escuela).trim() : '');
}
function adGrupoChipTxt(g) {
  return adGradoSeccion(g.grado, g.seccion) || 'Nuevo grupo';
}

/* ══════════════ ORDENAR LOS GRUPOS ARRASTRÁNDOLOS ══════════════
   El maestro que da clases en dos colegios acaba con diez o doce grupos
   en la barra, y los abre en un orden que solo él sabe: el de la primera
   hora, el de la tarde, el que lleva las notas de otro compañero. El
   orden en que se crearon no es el orden en que se usan, y a partir del
   quinto grupo hay que ir leyendo chip por chip para encontrar el suyo.

   Se mueven con el dedo, y eso obliga a tres decisiones:

   1. NO SE USA EL ARRASTRE DEL NAVEGADOR (draggable). En un teléfono no
      existe: es de ratón. Aquí se hace con eventos de puntero, que son
      los mismos para el dedo y para el ratón.
   2. SE AGARRA MANTENIENDO TOCADO (medio segundo), no al primer roce.
      Un toque corto SIGUE SIENDO cambiar de grupo —que es lo que se hace
      cuarenta veces al día— y un dedo que baja para hacer scroll no
      puede llevarse un grupo por delante. Con el ratón basta con
      arrastrar, que ahí no hay scroll que estorbe.
   3. EL HUECO ENSEÑA DÓNDE VA A CAER. Se suelta viendo el sitio, no
      adivinándolo.

   Al soltar, el orden se lee del DOM —que es exactamente lo que el
   maestro acaba de ver— y se guarda en sus grupos. */
function adGruposArrastrar(bar) {
  if (!bar || bar.querySelectorAll('.ad-gr-chip[data-gid]').length < 2) return;
  const LARGO = 380;      /* lo que hay que mantener tocado, en ms */
  let mov = null;         /* el arrastre en curso */
  let espera = null, chip0 = null, ini = null;

  const olvidar = () => { clearTimeout(espera); espera = null; chip0 = null; ini = null; };
  /* Mientras se mueve un grupo, el dedo NO desliza la página: si no, la
     barra se va hacia arriba y el chip se suelta donde nadie quería. */
  const frenaScroll = e => { if (mov) e.preventDefault(); };

  const levantar = (chip, x, y) => {
    olvidar();
    const r = chip.getBoundingClientRect();
    const f = chip.cloneNode(true);
    f.classList.add('ad-gr-fantasma');
    f.style.width = r.width + 'px'; f.style.height = r.height + 'px';
    document.body.appendChild(f);
    chip.classList.add('ad-gr-hueco');
    document.body.classList.add('ad-gr-moviendo');
    mov = { chip, f, dx: x - r.left, dy: y - r.top, movido: false };
    document.addEventListener('touchmove', frenaScroll, { passive: false });
    /* Un tironcito avisa de que ya lo tiene agarrado: sin eso el maestro
       no sabe si se enganchó y suelta antes de tiempo. */
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (_) {} }
    arrastrar(x, y);
  };

  const arrastrar = (x, y) => {
    if (!mov) return;
    mov.f.style.left = (x - mov.dx) + 'px';
    mov.f.style.top = (y - mov.dy) + 'px';
    /* El fantasma no estorba la búsqueda: lleva pointer-events:none */
    const bajo = document.elementFromPoint(x, y);
    const dest = bajo && bajo.closest ? bajo.closest('.ad-gr-chip[data-gid]') : null;
    if (!dest || dest === mov.chip || dest.parentNode !== bar) return;
    const r = dest.getBoundingClientRect();
    bar.insertBefore(mov.chip, x > r.left + r.width / 2 ? dest.nextSibling : dest);
    mov.movido = true;
  };

  const soltar = () => {
    olvidar();
    if (!mov) return;
    const { chip, f, movido } = mov;
    mov = null;
    document.removeEventListener('touchmove', frenaScroll, { passive: false });
    f.remove();
    chip.classList.remove('ad-gr-hueco');
    document.body.classList.remove('ad-gr-moviendo');
    /* El toque que suelta no puede además cambiar de grupo: el maestro
       estaba ordenando, no entrando. */
    const tragar = ev => { ev.stopPropagation(); ev.preventDefault(); };
    bar.addEventListener('click', tragar, true);
    setTimeout(() => bar.removeEventListener('click', tragar, true), 400);
    if (!movido) return;
    const orden = [...bar.querySelectorAll('.ad-gr-chip[data-gid]')].map(n => n.dataset.gid);
    const sitio = id => { const i = orden.indexOf(id); return i < 0 ? 999 : i; };
    const st = adState();
    st.grupos.sort((a, b) => sitio(a.id) - sitio(b.id));
    st.grOrden = 1;               /* ya lo descubrió: la pista se calla */
    adStateSave(st);
    /* NO se vuelve a pintar la pantalla: la barra ya está en el orden
       nuevo, y repintarla justo al soltar arranca de debajo del dedo el
       elemento que iba a recibir el toque. Solo se retira la pista. */
    const pista = document.querySelector('.ad-gr-tip');
    if (pista) pista.remove();
    toast('✅ Grupos en tu orden');
  };

  bar.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const chip = e.target.closest ? e.target.closest('.ad-gr-chip[data-gid]') : null;
    if (!chip) return;
    chip0 = chip; ini = { x: e.clientX, y: e.clientY };
    document.addEventListener('pointermove', enMover);
    document.addEventListener('pointerup', enSoltar);
    document.addEventListener('pointercancel', enSoltar);
    if (e.pointerType !== 'mouse') espera = setTimeout(() => levantar(chip, ini.x, ini.y), LARGO);
  });

  function enMover(e) {
    if (mov) { arrastrar(e.clientX, e.clientY); return; }
    if (!chip0) return;
    const d = Math.abs(e.clientX - ini.x) + Math.abs(e.clientY - ini.y);
    /* Con ratón se arrastra directo; con el dedo, moverse antes de tiempo
       es que está deslizando la página, y entonces esto no va con él. */
    if (e.pointerType === 'mouse') { if (d > 6) levantar(chip0, e.clientX, e.clientY); }
    else if (d > 12) olvidar();
  }
  function enSoltar() {
    soltar();
    document.removeEventListener('pointermove', enMover);
    document.removeEventListener('pointerup', enSoltar);
    document.removeEventListener('pointercancel', enSoltar);
  }
}

/* ── CAPTURA Y RESTAURACIÓN DE ESTADO (foco, cursor, parcial y vista) ── */
let _adCapturedState = null;
let _adRenderDiferido = false;
let _adDiferidoTimer = null;

function adActualizarChipNube() {
  const chip = document.getElementById('ad-nube-chip');
  if (chip) {
    const n = typeof adPendientesTotal === 'function' ? adPendientesTotal() : 0;
    chip.textContent = n ? '⏳ ' + n + ' por subir' : '☁️ al día';
  }
}

function adSaceTieneFocoActivo() {
  if (_adTab !== 'sace') return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = (el.tagName || '').toUpperCase();
  if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') return false;
  const body = document.getElementById('ad-tab-body');
  if (!body) return false;
  return body.contains(el);
}

function adCaptureState() {
  const st = typeof adState === 'function' ? adState() : { activo: _adGrupoActivoId, grupos: [] };
  const state = {
    tab: _adTab,
    grupo: (st && st.activo) || _adGrupoActivoId,
    colectaId: _adColectaId,
    controlId: _adControlId,
    saceParcial: _adSaceParcial,
    saceVista: _adSaceVista,
    activeInput: null
  };

  const el = document.activeElement;
  if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) {
    const saceBody = document.getElementById('ad-tab-body');
    if (_adTab === 'sace' && saceBody && saceBody.contains(el)) {
      let selStart = null, selEnd = null;
      try {
        if (typeof el.selectionStart === 'number') {
          selStart = el.selectionStart;
          selEnd = el.selectionEnd;
        }
      } catch (_) {}

      let uniqueSelector = '';
      if (el.id) {
        uniqueSelector = '#' + el.id;
      } else if (el.classList.contains('ad-mx-inp')) {
        const al = el.dataset.alumno || el.dataset.num;
        const mat = el.dataset.materia || el.dataset.campo;
        const p = el.dataset.parcial;
        if (al && mat && p) {
          uniqueSelector = `.ad-mx-inp[data-parcial="${p}"][data-num="${al}"][data-campo="${mat}"]`;
        }
      }

      state.activeInput = {
        isSace: true,
        tagName: el.tagName,
        id: el.id || '',
        num: el.dataset.num || el.dataset.alumno || '',
        alumno: el.dataset.alumno || el.dataset.num || '',
        campo: el.dataset.campo || el.dataset.materia || '',
        materia: el.dataset.materia || el.dataset.campo || '',
        parcial: el.dataset.parcial || '',
        idx: el.dataset.idx != null ? el.dataset.idx : '',
        selector: uniqueSelector,
        selStart: selStart,
        selEnd: selEnd,
        value: el.value
      };
    }
  }

  _adCapturedState = state;
  return state;
}

function adRestoreFocus(inpInfo) {
  if (!inpInfo) return false;
  let target = null;

  // 1. Si tenía ID único
  if (inpInfo.id) {
    target = document.getElementById(inpInfo.id);
  }

  // 2. Si tenía selector único
  if (!target && inpInfo.selector) {
    try {
      target = document.querySelector(inpInfo.selector);
    } catch (_) {}
  }

  // 3. Si era celda de Notas SACE por alumno, materia/campo y parcial
  if (!target && (inpInfo.alumno || inpInfo.num) && (inpInfo.materia || inpInfo.campo)) {
    const al = String(inpInfo.alumno || inpInfo.num);
    const mat = String(inpInfo.materia || inpInfo.campo);
    const p = inpInfo.parcial ? String(inpInfo.parcial) : '';
    const allInps = document.querySelectorAll('#ad-tab-body .ad-mx-inp');
    for (let i = 0; i < allInps.length; i++) {
      const inp = allInps[i];
      const matchAl = (String(inp.dataset.alumno || inp.dataset.num) === al);
      const matchMat = (String(inp.dataset.materia || inp.dataset.campo) === mat);
      const matchP = (!p || String(inp.dataset.parcial) === p);
      if (matchAl && matchMat && matchP) {
        target = inp;
        break;
      }
    }
  }

  // 4. Fallback por data-idx
  if (!target && inpInfo.idx !== '' && inpInfo.idx != null) {
    target = document.querySelector(`#ad-tab-body .ad-mx-inp[data-idx="${inpInfo.idx}"]`);
  }

  if (target) {
    try {
      target.focus({ preventScroll: true });
      if (inpInfo.selStart != null && inpInfo.selEnd != null && typeof target.setSelectionRange === 'function') {
        target.setSelectionRange(inpInfo.selStart, inpInfo.selEnd);
      }
      return true;
    } catch (_) {}
  }
  return false;
}

async function adRestoreState(stateOrTab, colectaId, controlId) {
  let saved = null;
  let tab = stateOrTab;
  if (typeof stateOrTab === 'object' && stateOrTab !== null) {
    saved = stateOrTab;
    tab = saved.tab;
    colectaId = saved.colectaId;
    controlId = saved.controlId;
  } else if (!stateOrTab && _adCapturedState) {
    saved = _adCapturedState;
    tab = saved.tab;
    colectaId = saved.colectaId;
    controlId = saved.controlId;
  }
  if (tab) _adTab = tab;
  _adColectaId = colectaId || null;
  _adControlId = controlId || null;
  if (saved) {
    if (saved.saceParcial) _adSaceParcial = saved.saceParcial;
    if (saved.saceVista) _adSaceVista = saved.saceVista;
    if (saved.grupo) _adGrupoActivoId = saved.grupo;
  }
  try {
    const nav = window.metasLoadNav ? window.metasLoadNav() : {};
    if (!saved?.saceParcial && ['I', 'II', 'III', 'IV'].includes(nav.adSaceParcial)) _adSaceParcial = nav.adSaceParcial;
    if (!saved?.saceVista && ['aprov', 'pers', 'inasis'].includes(nav.adSaceVista)) _adSaceVista = nav.adSaceVista;
    if (!saved?.grupo && nav.adGrupo) _adGrupoActivoId = nav.adGrupo;
  } catch (_) {}
  const inAdmin = document.getElementById('view-admin')?.classList.contains('active');
  if (!inAdmin && typeof paVerificarPin === 'function' &&
      !(await paVerificarPin('Los registros administrativos guardan **dinero y notas finales**:'))) {
    if (typeof switchView === 'function') switchView('view-perfil');
    return;
  }
  if (typeof switchView === 'function') switchView('view-admin');
  renderAdmin(true);
  if (saved && saved.activeInput) {
    adRestoreFocus(saved.activeInput);
  }
}

window.adCaptureState = adCaptureState;
window.adRestoreState = adRestoreState;

// Si el render se difirió porque el usuario estaba digitando, repintar al soltar el foco
document.addEventListener('focusout', () => {
  if (!_adRenderDiferido) return;
  if (_adTab !== 'sace') return;
  clearTimeout(_adDiferidoTimer);
  _adDiferidoTimer = setTimeout(() => {
    if (_adRenderDiferido && !adSaceTieneFocoActivo()) {
      _adRenderDiferido = false;
      renderAdmin(true);
    }
  }, 250);
});

/* ── RENDER PRINCIPAL ── */
function renderAdmin(forzar = false) {
  const cont = document.getElementById('admin-content');
  if (!cont) return;

  /* Si el refresco viene de una sincronización en segundo plano mientras el
     usuario tiene el foco activo en un input de Notas SACE, evitar destruir el DOM
     de la tabla y actualizar únicamente el indicador del botón de pendientes. */
  if (!forzar && _adTab === 'sace' && adSaceTieneFocoActivo()) {
    _adRenderDiferido = true;
    adActualizarChipNube();
    return;
  }
  _adRenderDiferido = false;

  const savedState = adCaptureState();
  const st = adState();
  let d = st.grupos.find(g => g.id === st.activo) || st.grupos[0];
  /* recordar dónde está el docente para restaurarlo al recargar */
  if (window.metasSaveNav) window.metasSaveNav({
    view: 'view-admin',
    adTab: _adTab,
    adColecta: _adColectaId,
    adControl: _adControlId,
    adSaceParcial: _adSaceParcial,
    adSaceVista: _adSaceVista,
    adGrupo: st.activo
  });
  /* la flecha del encabezado dice a dónde lleva AHORA, que cambia según se
     esté dentro de una colecta o de un control */
  const _atras = document.getElementById('admin-back-btn');
  if (_atras) {
    const nivelConv = typeof adConvNivel === 'function' ? adConvNivel() : 0;
    const rotulo = _adFichasOn ? 'Volver a Alumnos'
      : (_adGastosOn || _adInvOn) ? 'Volver a Economía'
      : nivelConv === 2 ? 'Volver a mis convocatorias'
      : nivelConv === 1 ? 'Volver a Comunicados'
      : _adColectaId ? 'Volver a mis colectas'
      : _adControlId ? 'Volver a mis controles' : 'Volver a la Zona Docente';
    _atras.setAttribute('aria-label', rotulo);
    _atras.setAttribute('title', rotulo);
  }
  /* Barra de grupos: el maestro puede tener varios (incluso en dos
     colegios); todo lo de abajo (lista, economía, asistencia, notas)
     es DEL GRUPO ACTIVO. */
  /* El colegio solo se pinta si el maestro trabaja en MÁS DE UNO. Con
     once grupos de la misma escuela, repetir «JOHN ARNOLD COOK» once
     veces no distingue nada y sí duplica el alto de la barra: en un
     teléfono eran seis renglones de chips antes de llegar a lo suyo. El
     nombre sigue en el título del chip y en la ficha del grupo. */
  const escuelas = new Set(st.grupos.map(g => String(g.escuela || '').trim().toLowerCase()));
  const verEsc = escuelas.size > 1;
  const chips = st.grupos.map(g => `
    <button class="ad-gr-chip ${g.id === st.activo ? 'ad-gr-on' : ''}" data-gid="${g.id}"
            title="${adEsc(adGrupoTitulo(g))}" aria-label="${adEsc(adGrupoTitulo(g))}">
      <span class="ad-gr-gs">${adEsc(adGrupoChipTxt(g))}</span>
      ${verEsc && g.escuela ? `<span class="ad-gr-esc">${adEsc(g.escuela)}</span>` : ''}
    </button>`).join('');
  cont.innerHTML = `
    <div class="ad-gr-bar" id="ad-gr-bar">
      ${chips}
      <button class="ad-gr-chip ad-gr-add" id="ad-gr-add" title="Agregar otro grado o colegio">➕ Otro grupo</button>
    </div>
    ${st.grupos.length > 1 && !st.grOrden ? `<p class="ad-gr-tip">✋ <strong>Mantén tocado un grupo</strong>
      y muévelo: quedan en el orden que tú quieras, con el de la primera hora adelante.</p>` : ''}
    <div class="pa-tabs-out ad-tabs">
      <button class="pa-otab ${_adTab === 'lista' ? 'pa-otab-active' : ''}" data-adtab="lista">👥 Alumnos</button>
      <button class="pa-otab ${_adTab === 'eco'   ? 'pa-otab-active' : ''}" data-adtab="eco">💰 Economía</button>
      <button class="pa-otab ${_adTab === 'asis'  ? 'pa-otab-active' : ''}" data-adtab="asis">📋 Asistencia</button>
      <button class="pa-otab ${_adTab === 'eq'    ? 'pa-otab-active' : ''}" data-adtab="eq">🤝 Equipos</button>
      <button class="pa-otab ${_adTab === 'ctrl'  ? 'pa-otab-active' : ''}" data-adtab="ctrl">✅ Controles</button>
      <button class="pa-otab ${_adTab === 'sace'  ? 'pa-otab-active' : ''}" data-adtab="sace">🧮 Notas SACE</button>
      <button class="pa-otab ${_adTab === 'est'   ? 'pa-otab-active' : ''}" data-adtab="est">📈 Estadísticas</button>
      <button class="pa-otab ${_adTab === 'lec'   ? 'pa-otab-active' : ''}" data-adtab="lec">📖 Lectura</button>
      <button class="pa-otab ${_adTab === 'com'   ? 'pa-otab-active' : ''}" data-adtab="com">📣 Comunicados</button>
      <button class="pa-otab" id="ad-nube-chip" title="Nube del chatbot de padres: toca para sincronizar ahora">${(() => {
        const n = adPendientesTotal();
        return n ? '⏳ ' + n + ' por subir' : '☁️ al día';
      })()}</button>
    </div>
    <div id="ad-tab-body"></div>`;
  cont.querySelectorAll('[data-gid]').forEach(b =>
    b.addEventListener('click', () => {
      _adGrupoActivoId = b.dataset.gid;
      try { localStorage.setItem('METAS_ADMIN_GRUPO_ACTIVO', _adGrupoActivoId); } catch (_) {}
      const s2 = adState(); s2.activo = _adGrupoActivoId; adStateSave(s2);
      _adColectaId = null; _adControlId = null; _adGastosOn = 0; _adInvOn = 0; _adFichasOn = 0;
      if (typeof adConvCerrar === 'function') adConvCerrar();
      renderAdmin();
    }));
  adGruposArrastrar(document.getElementById('ad-gr-bar'));
  document.getElementById('ad-gr-add').addEventListener('click', async () => {
    if (!await metasConfirm('Un grupo nuevo tiene su PROPIA lista de alumnos, claves de familia, economía, asistencia y notas.\n\nÚsalo si atiendes **otro grado/sección** o trabajas en **otro colegio**. ¿Crear el grupo?',
      { icono: '🏫', titulo: 'Otro grupo', okTxt: 'Sí, crear' })) return;
    const s2 = adState();
    const g = adGrupoNuevo();
    s2.grupos.push(g); s2.activo = g.id;
    _adGrupoActivoId = g.id;
    try { localStorage.setItem('METAS_ADMIN_GRUPO_ACTIVO', _adGrupoActivoId); } catch (_) {}
    adStateSave(s2);
    _adTab = 'lista'; renderAdmin();
    toast('🏫 Grupo nuevo: escribe su grado, sección y colegio');
  });
  cont.querySelectorAll('[data-adtab]').forEach(b =>
    b.addEventListener('click', () => {
      _adTab = b.dataset.adtab; _adColectaId = null; _adControlId = null;
      _adGastosOn = 0; _adInvOn = 0; _adFichasOn = 0;
      if (typeof adConvCerrar === 'function') adConvCerrar();
      renderAdmin();
    }));
  /* chip de nube: visible en TODAS las pestañas (antes solo en Alumnos
     se sabía si lo publicado ya subió); tocarlo sincroniza ya */
  document.getElementById('ad-nube-chip').addEventListener('click', async () => {
    await adSincronizarNube(true);
    adActualizarChipNube();
  });
  const body = document.getElementById('ad-tab-body');
  if (body) {
    body.dataset.parcial = _adSaceParcial;
    body.dataset.vista = _adSaceVista;
  }
  if (_adTab === 'lista') adRenderLista(body, d);
  else if (_adTab === 'eco') adRenderEco(body, d);
  else if (_adTab === 'asis') adRenderAsis(body, d);
  else if (_adTab === 'ctrl') adRenderControles(body, d);
  else if (_adTab === 'com') adRenderCom(body, d);
  else if (_adTab === 'est' && typeof adRenderEstadisticas === 'function') adRenderEstadisticas(body, d);
  else if (_adTab === 'lec' && typeof adRenderLectura === 'function') adRenderLectura(body, d);
  /* 🤝 Equipos va al lado de Asistencia a propósito: se pasa lista y se
     arman los equipos con los que vinieron (js/tools/equipos.js) */
  else if (_adTab === 'eq' && typeof adRenderEquipos === 'function') adRenderEquipos(body, d);
  else adRenderSace(body, d);

  if (savedState && savedState.activeInput) {
    adRestoreFocus(savedState.activeInput);
  }
}

/* ══════════════ 👥 ALUMNOS (el corazón: alimenta TODO) ══════════════ */
function adRenderLista(body, d) {
  if (_adFichasOn) { adRenderFichas(body, d); return; }
  const puedeBorrarGrupo = adState().grupos.length > 1;
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">🏫 Mi grupo</div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Grado</label>
          <input id="ad-grado" class="pa-inp-field" value="${adEsc(d.grado)}" placeholder="ej.: 6º"></div>
        <div class="pa-field"><label>Sección</label>
          <input id="ad-seccion" class="pa-inp-field" value="${adEsc(d.seccion)}" placeholder="ej.: A"></div>
      </div>
      <div class="pa-field"><label>Colegio / escuela</label>
        <input id="ad-escuela" class="pa-inp-field" value="${adEsc(d.escuela)}"
               placeholder="ej.: Esc. Francisco Morazán (útil si trabajas en dos)"></div>
      <div class="pa-field"><label>Clases que le das a este grupo</label>
        <input id="ad-materias" class="pa-inp-field" value="${adEsc(d.materias.join(', '))}"
               placeholder="Separadas por coma"></div>
      <p class="pa-optional-hint">Las clases se usan en <strong>Notas SACE</strong>. Si cambias el
        nombre de una clase, las notas ya guardadas quedan bajo el nombre anterior.</p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">👥 Mis alumnos</div>
      <p class="pa-optional-hint">Esta lista alimenta <strong>todo</strong>: Economía, Asistencia,
        Notas SACE y el Plan de Acción. El número es el <strong>nº de lista oficial</strong> (SACE).
        Cada alumno recibe su <strong>🔑 clave de familia</strong>: con ella el padre o la madre
        consulta al asistente desde su casa. Tócala para cambiarla o imprimirla.</p>
      <button class="ad-puerta ad-puerta-ficha" id="ad-ir-fichas">
        <span class="ad-puerta-ic">🗂️</span>
        <span class="ad-puerta-txt">
          <span class="ad-puerta-t">Identidad y contactos</span>
          <span class="ad-puerta-s">${(() => {
            const c = (d.lista || []).filter(a => AD_FICHA_CAMPOS.every(x => String(a[x.k] || '').trim())).length;
            return d.lista.length
              ? (c === d.lista.length
                  ? 'Las ' + c + ' fichas están completas'
                  : c + ' de ' + d.lista.length + ' fichas completas — identidad, teléfonos y encargado')
              : 'Identidad, teléfonos y encargado de cada alumno';
          })()}</span>
        </span>
        <span class="ad-puerta-go">›</span>
      </button>
      <div id="ad-lista-rows">
        ${d.lista.map((a, ri) => {
          const cl = adClaveFamilia(d.id, a.num, false);
          const pr = adEsPrueba(a);
          return `
          <div class="ad-al-row${pr ? ' ad-al-prueba' : ''}" data-num="${a.num}">
            <span class="ad-mx-rbtns ad-al-rbtns">
              <button type="button" class="ad-mx-rmv ad-al-rmv" data-rdir="-1" data-rnum="${a.num}" title="Subir una posición (con sus notas)" aria-label="Subir"${ri === 0 ? ' disabled' : ''}>▲</button>
              <button type="button" class="ad-mx-rmv ad-al-rmv" data-rdir="1" data-rnum="${a.num}" title="Bajar una posición (con sus notas)" aria-label="Bajar"${ri === d.lista.length - 1 ? ' disabled' : ''}>▼</button>
            </span>
            <button type="button" class="ad-al-num" data-irnum="${a.num}" title="Toca para elegir el número de posición al que quieres mover este alumno con sus notas">#${a.num}</button>
            <input class="pa-inp-field ad-al-nombre" value="${adEsc(a.nombre)}" placeholder="Nombre (opcional)">
            <button class="ad-al-code" data-cnum="${a.num}" title="Clave de familia — tócala para editar o imprimir">
              🔑 ${cl ? adEsc(adClaveBonita(cl, a.num)) : 'crear'}</button>
            ${pr ? `<button class="ad-al-test" data-pnum="${a.num}"
              title="Alumno de prueba: no cuenta en el informe del grado. Tócalo para volverlo a contar."
              aria-label="Quitar la marca de alumno de prueba">🧪 de prueba</button>` : ''}
            <button class="ad-al-del" data-delnum="${a.num}" title="Borrar esta fila (puedes restaurarla en 🕘 Deshacer)" aria-label="Borrar fila">✕</button>
          </div>`; }).join('')}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-add-al">➕ Agregar al final</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-ordenar-gen">♀♂ Ordenar Niñas y luego Varones (A–Z)</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-ordenar-az">🔤 Ordenar todos A–Z</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-pegar">📋 Pegar lista</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-insertar-al">🧑‍🎓 Alumno nuevo en su lugar</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-traer-pa">📥 Traer del Plan de Acción</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-tiras-todas">🖨️ Tiras de claves (todas)</button>
      </div>
      <div id="ad-pegar-box" style="display:none;margin-top:10px;">
        <p class="pa-paste-hint">Pega la lista, <strong>un alumno por línea</strong>. Si la línea empieza
          con su número de lista (ej. <em>7 Ada Sarai</em> o <em>7. Ada Sarai</em>), se respeta ese número;
          si no, se numeran en orden. Se agregan al final de la lista actual.</p>
        <textarea id="ad-paste-area" class="pa-paste-area" placeholder="Ada Sarai Sevilla&#10;Ashly Belén Miranda&#10;Brianna Monserrath López&#10;..."></textarea>
        <button class="pa-add-btn" id="ad-import-btn"><i class="fa-solid fa-file-import"></i> Importar a la lista</button>
      </div>
      <p class="pa-optional-hint" style="margin-top:8px">🧑‍🎓 Si llega un alumno a mitad de año y toma un
        lugar del orden alfabético, usa «Alumno nuevo en su lugar»: los números se recorren, pero la
        <strong>clave de familia viaja con cada niño</strong> — las tiras ya entregadas siguen valiendo
        y solo imprimes la del nuevo.</p>
      <p class="pa-optional-hint">🧪 ¿Tienes un alumno inventado para hacer pruebas? Búscalo en
        <strong>📈 Estadísticas</strong> y márcalo de prueba: queda fuera del <strong>informe del
        grado</strong>, de los informes de todo el grupo y de los <strong>🤝 Equipos</strong>, así deja de inflar la matrícula, el promedio y
        las inasistencias que ve la Dirección. Para ti sigue igual — puedes ponerle notas, asistencia y
        tomas de lectura.${adCuentaPruebas(d)
          ? ' Hoy hay <strong>' + adCuentaPruebas(d) + '</strong> marcado(s) así, señalado(s) aquí abajo; toca su 🧪 para volverlo(s) a contar.'
          : ''}</p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">☁️ Nube del chatbot de padres y recuperación</div>
      <p class="pa-optional-hint">La asistencia, las notas finales y las colaboraciones suben con la
        <strong>clave de familia</strong> de cada alumno para que el asistente les responda a los padres.
        Si cambiaste de equipo y te faltan notas que ya habías escrito, «Copiar notas de mis respaldos» te enseña cuáles encontró antes de copiar nada.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-sb-sync" type="button">☁️ Sincronizar ahora</button>
        <button class="pa-generate-btn ad-rec-btn-main" id="ad-lista-recuperar" type="button">📥 Copiar notas de mis respaldos</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-lista-versiones" type="button">🕓 Verificar historial de versiones</button>
        ${adVersionTieneAutocompletado(d) ? '<button class="pa-generate-btn ad-btn-sec" id="ad-lista-revisar-solas" type="button">🔎 Revisar notas que la aplicación puso sola</button>' : ''}
      </div>
      <p class="pa-optional-hint" id="ad-sb-status" style="margin-top:8px"></p>
    </div>

    <button class="ad-puerta ad-puerta-exp" id="ad-expediente">
      <span class="ad-puerta-ic">📄</span>
      <span class="ad-puerta-txt">
        <span class="ad-puerta-t">Expediente del aula en PDF</span>
        <span class="ad-puerta-s">Todo en un solo documento: lista, asistencia, colectas, gastos,
          controles, novedades, notas y comunicados. Para imprimir o guardar en tu portafolio.</span>
      </span>
      <span class="ad-puerta-go">›</span>
    </button>

    <div class="pa-card">
      <div class="pa-card-title">🎓 Fin del año escolar</div>
      <p class="pa-optional-hint">Cuando el año esté <strong>entregado</strong> (boletas impresas), cierra el
        ciclo: se limpian registros y avisos, la nube del chatbot se borra y las
        <strong>claves de familia se regeneran</strong> — así la tira del año pasado no le muestra a
        nadie los datos del niño nuevo que tome ese número de lista. La ficha del aula se conserva.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-cerrar-anio">🎓 Cerrar el año escolar</button>
        ${puedeBorrarGrupo ? `<button class="ad-grupo-del" id="ad-grupo-del">🗑 Eliminar este grupo</button>` : ''}
      </div>
    </div>

    ${adUndoTarjetaHtml()}`;

  const persist = () => {
    const dd = adLoad();
    dd.grado = document.getElementById('ad-grado').value;
    dd.seccion = document.getElementById('ad-seccion').value;
    dd.escuela = document.getElementById('ad-escuela').value.trim();
    const mats = document.getElementById('ad-materias').value.split(',').map(s => s.trim()).filter(Boolean);
    if (mats.length) dd.materias = mats;
    /* La lista se reconstruye desde la pantalla, así que hay que CONSERVAR lo que
       no se edita aquí (identidad, teléfonos, encargado). Sin este merge, tocar
       un nombre borraba la ficha completa del alumno. */
    const antes = {};
    (dd.lista || []).forEach(a => { antes[a.num] = a; });
    dd.lista = [...body.querySelectorAll('.ad-al-row')].map(r => {
      const num = +r.dataset.num;
      return Object.assign({}, antes[num], {
        num, nombre: r.querySelector('.ad-al-nombre').value.trim(),
      });
    });
    adSave(dd);
  };
  ['ad-grado', 'ad-seccion', 'ad-escuela', 'ad-materias'].forEach(id =>
    document.getElementById(id).addEventListener('input', persist));
  /* al salir del campo grado/sección/colegio, refresca la barra de grupos */
  ['ad-grado', 'ad-seccion', 'ad-escuela'].forEach(id =>
    document.getElementById(id).addEventListener('change', () => renderAdmin()));
  body.querySelectorAll('.ad-al-nombre').forEach(i => i.addEventListener('input', persist));
  adListaFilasArrastrar(document.getElementById('ad-lista-rows'));
  document.getElementById('ad-ordenar-gen')?.addEventListener('click', () => {
    persist();
    adOrdenarPorGeneroModal(() => renderAdmin());
  });
  document.getElementById('ad-ordenar-az')?.addEventListener('click', () => {
    persist();
    adOrdenarAlumnosAZ(() => renderAdmin());
  });
  body.querySelectorAll('.ad-al-code').forEach(b =>
    b.addEventListener('click', () => adEditarClave(+b.dataset.cnum)));
  /* 🧪 marcar/desmarcar alumno de prueba. Se guarda ANTES de tocar la
     lista para no pisar un nombre a medio escribir en otra fila. */
  body.querySelectorAll('[data-pnum]').forEach(b =>
    b.addEventListener('click', () => {
      persist();
      const on = adTogglePrueba(+b.dataset.pnum);
      renderAdmin();
      toast(on ? '🧪 Alumno de prueba: ya no cuenta en el informe del grado'
               : '👥 Vuelve a contar como alumno del grado');
    }));
  body.querySelectorAll('.ad-al-del').forEach(b =>
    b.addEventListener('click', () => {
      persist();
      const fila = b.closest('.ad-al-row');
      const num = +(b.dataset.delnum || (fila && fila.dataset.num));
      adEliminarAlumnoFila(num, () => renderAdmin());
    }));
  document.getElementById('ad-add-al').addEventListener('click', () => {
    const dd = adLoad();
    const sig = dd.lista.length ? Math.max(...dd.lista.map(a => a.num)) + 1 : 1;
    dd.lista.push({ num: sig, nombre: '', alta: Date.now() });
    adClaveFamilia(dd.id, sig);          /* su clave de familia nace con él */
    adSave(dd); renderAdmin();
  });
  /* Pegar lista: muestra/oculta el panel de pegado */
  document.getElementById('ad-pegar').addEventListener('click', () => {
    const box = document.getElementById('ad-pegar-box');
    const abrir = box.style.display === 'none';
    box.style.display = abrir ? 'block' : 'none';
    if (abrir) document.getElementById('ad-paste-area').focus();
  });
  document.getElementById('ad-import-btn').addEventListener('click', adImportarPegado);
  document.getElementById('ad-insertar-al').addEventListener('click', adInsertarAlumno);
  document.getElementById('ad-tiras-todas').addEventListener('click', () => adTirasTodas(adLoad()));
  document.getElementById('ad-ir-fichas').addEventListener('click', () => { _adFichasOn = 1; renderAdmin(); });
  /* el expediente lee el estado COMPLETO: los gastos de bolsillo viven en la
     cuenta, no en el grupo, y también van en el legajo */
  document.getElementById('ad-expediente').addEventListener('click', () => adPrintExpediente(adState()));
  document.getElementById('ad-sb-sync').addEventListener('click', () => adSincronizarNube(true));
  document.getElementById('ad-lista-recuperar')?.addEventListener('click', e => adRecuperarNotasNube(e.currentTarget, () => renderAdmin()));
  document.getElementById('ad-lista-revisar-solas')?.addEventListener('click', e => adRevisarNotasPuestasSolas(e.currentTarget, () => renderAdmin()));
  document.getElementById('ad-lista-versiones')?.addEventListener('click', () => adAbrirHistorialVersionesModal(() => renderAdmin()));
  document.getElementById('ad-cerrar-anio').addEventListener('click', adCerrarAnio);
  body.querySelectorAll('.ad-undo-btn').forEach(b =>
    b.addEventListener('click', () => adUndoRestaurar(+b.dataset.ui)));
  adSincronizarNube(false);   /* refresca el estado al entrar */
  document.getElementById('ad-grupo-del')?.addEventListener('click', async () => {
    const dd = adLoad();
    if (!await metasConfirm('Se eliminará el grupo **' + (adGrupoTxt(dd) || 'sin nombre') + '** con su lista, economía, asistencia y notas de este equipo. Las claves de familia entregadas dejan de usarse.\n\n¿Eliminar?',
      { icono: '🗑', titulo: 'Eliminar grupo', okTxt: 'Sí, eliminar' })) return;
    if (!await adPedirContrasena('Eliminar grupo')) return;
    adUndoGuardar('Eliminar grupo «' + (adGrupoTxt(dd) || 'sin nombre') + '»');
    const s2 = adState();
    s2.grupos = s2.grupos.filter(g => g.id !== dd.id);
    s2.activo = s2.grupos[0].id;
    adStateSave(s2); renderAdmin();
    toast('🗑 Grupo eliminado');
  });
  document.getElementById('ad-traer-pa').addEventListener('click', async () => {
    let pa = null;
    try { pa = JSON.parse(localStorage.getItem('METAS_PLANACCION_V1')); } catch (_) {}
    const ana = pa && Array.isArray(pa.analisis) && pa.analisis.length ? pa.analisis[pa.analisis.length - 1] : null;
    if (!ana || !Array.isArray(ana.students) || !ana.students.length) {
      await metasAlert('No encontré análisis guardados en el Plan de Acción de este teléfono. Agrega la lista a mano con «➕ Agregar al final».', { icono: '📥', titulo: 'Lista de alumnos' });
      return;
    }
    if (!await metasConfirm('Se traerá la lista del análisis más reciente (**' + (ana.evaluacion || 'Evaluación') + '**, ' + ana.students.length + ' alumnos). ¿Reemplazar la lista actual?', { icono: '📥', titulo: 'Lista de alumnos', okTxt: 'Sí, traer' })) return;
    adUndoGuardar('Traer lista del Plan de Acción');
    const dd = adLoad();
    const alta = Date.now();
    dd.lista = ana.students.map(s => ({
      num: +s.num, nombre: String(s.nombre || '').startsWith('#') ? '' : (s.nombre || ''), alta,
    }));
    /* lista nueva entera: las marcas de borrado de la anterior ya no aplican */
    dd.borrados = [];
    if (!dd.grado) dd.grado = ana.grado || '';
    if (!dd.seccion) dd.seccion = ana.seccion || '';
    adSave(dd); renderAdmin();
    toast('👥 Lista traída del Plan de Acción');
  });
}

/* ── Pegar lista: importa muchos alumnos de una sola vez ──
   Un alumno por línea. Si la línea empieza con un número (7, 7., 7), 7-),
   se toma como su nº de lista oficial; si no, se numeran en orden. Tolera
   listas de calificaciones: quita una nota final tipo «, 100» o «, NSP». */
async function adImportarPegado() {
  const ta = document.getElementById('ad-paste-area');
  const text = (ta ? ta.value : '').trim();
  if (!text) { toast('Pega la lista primero'); return; }
  const parsed = text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const m = line.match(/^(\d{1,3})\s*[.)\-–:]?\s+(.+)$/);
    let num = null, nombre = line;
    if (m && m[2]) { num = +m[1]; nombre = m[2].trim(); }
    nombre = nombre.replace(/\s*,\s*(\d{1,3}|nsp?|ns)\s*$/i, '').trim();  // quita nota si la pegaron
    return { num, nombre };
  }).filter(p => p.nombre);
  if (!parsed.length) { toast('No encontré nombres para importar'); return; }

  const dd = adLoad();
  const conNombre = dd.lista.filter(a => (a.nombre || '').trim()).length;
  if (conNombre) {
    if (!await metasConfirm('Se agregarán **' + parsed.length + '** alumno(s) al final de la lista actual (que ya tiene ' + conNombre + '). ¿Continuar?',
        { icono: '📋', titulo: 'Pegar lista', okTxt: 'Sí, agregar' })) return;
  }
  adUndoGuardar('Pegar lista (' + parsed.length + ' alumnos)');
  const usados = new Set(dd.lista.map(a => a.num));
  let maxNum = dd.lista.length ? Math.max(...dd.lista.map(a => a.num)) : 0;
  parsed.forEach(p => {
    let num = p.num;
    if (!num || usados.has(num)) { do { num = ++maxNum; } while (usados.has(num)); }
    else { maxNum = Math.max(maxNum, num); }
    usados.add(num);
    dd.lista.push({ num, nombre: p.nombre, alta: Date.now() });
    adClaveFamilia(dd.id, num);          /* cada alumno recibe su clave de familia */
  });
  dd.lista.sort((a, b) => a.num - b.num);
  adSave(dd); renderAdmin();
  toast('👥 ' + parsed.length + ' alumno(s) importado(s)');
}

/* ── Editar / regenerar / imprimir la clave de familia de UN alumno ── */
async function adEditarClave(num) {
  const d = adLoad();
  const a = d.lista.find(x => x.num === num) || { nombre: '' };
  const quien = (a.nombre ? a.nombre : 'alumno/a') + ' (#' + num + ')';
  const actual = adClaveFamilia(d.id, num);          /* crea si no existía */
  const bonito = adClaveBonita(actual, num);
  const v = await metasPrompt('Clave de familia de **' + quien + '**:\n\n' +
    '• Déjala igual y toca «Imprimir tira», o\n' +
    '• Escribe una clave nueva (número + 4 a 6 letras/números, ej. ' + num + '-K7QM), o\n' +
    '• Escribe **nueva** para generar otra al azar.\n\n' +
    '🔒 Si la clave se **filtró** (alguien más la conoce), escribe **nueva**: ' +
    'al sincronizar, la vieja deja de funcionar y solo imprimes la tira nueva para esa familia.\n\n' +
    '⚠️ Si la cambias, la tira entregada antes deja de valer.', {
    icono: '🔑', titulo: 'Clave de familia', value: bonito, okTxt: 'Guardar',
    valida: t => {
      const s = String(t).trim().toUpperCase();
      if (s === 'NUEVA') return '';
      const limpio = s.replace(/[^A-Z0-9]/g, '');
      return new RegExp('^' + num + '[A-Z0-9]{4,6}$').test(limpio)
        ? '' : 'Debe empezar con ' + num + ' y seguir con 4 a 6 letras o números (ej. ' + num + '-K7QM).';
    },
  });
  if (v === null) return;
  const s = String(v).trim().toUpperCase();
  let clave = actual;
  if (s === 'NUEVA' || s.replace(/[^A-Z0-9]/g, '') !== actual) adUndoGuardar('Cambiar clave de #' + num);
  if (s === 'NUEVA') {
    clave = adClaveFamiliaSet(d.id, num, String(num) + adSufijoClave());
  } else {
    const limpio = s.replace(/[^A-Z0-9]/g, '');
    if (limpio !== actual) clave = adClaveFamiliaSet(d.id, num, limpio);
  }
  if (clave !== actual) {
    toast('🔑 Clave nueva: ' + adClaveBonita(clave, num));
    renderAdmin();
  }
  if (await metasConfirm('¿Imprimir la **tira** con esta clave para entregarla a la familia?',
    { icono: '🖨️', titulo: 'Clave de familia', okTxt: 'Sí, imprimir' })) {
    adTiraUno(adLoad(), num);
  }
}

/* Tiras de TODO el grupo, listas para recortar y entregar en reunión */
/* QR de las tiras: la URL es la misma para todas las familias, así que
   basta UN PNG estático del repo (img/qr-padres.png → …/padres.html).
   Se resuelve contra la página actual para que funcione también
   impreso desde la app instalada. */
function adQrSrc() {
  try { return new URL('img/qr-padres.png', location.href).href; } catch (_) { return 'img/qr-padres.png'; }
}

function adTirasTodas(d) {
  if (!d.lista.length) { toast('Agrega alumnos primero'); return; }
  const grupoTxt = adGrupoTxt(d);
  const sitio = (typeof PA_SITE !== 'undefined') ? PA_SITE : 'https://metas.policastsapien.com/';
  const filas = d.lista.slice().sort((a, b) => a.num - b.num)
    .map(a => ({ num: a.num, nombre: a.nombre || '', codigo: adClaveFamilia(d.id, a.num) }))
    .filter(f => f.codigo);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Claves de familia — ${adEsc(grupoTxt)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:10mm;}
h1{font-size:15px;margin-bottom:2mm;}
p.intro{font-size:11px;color:#444;margin-bottom:5mm;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm;}
.tira{border:1.5px dashed #888;border-radius:6px;padding:4mm;page-break-inside:avoid;position:relative;padding-right:25mm;}
.t1{font-size:10px;font-weight:bold;color:#1e3a7c;}
.t2{font-size:11px;margin-top:1.5mm;}
.cod{font-size:20px;font-weight:900;letter-spacing:2px;margin:2mm 0;font-family:'Courier New',monospace;}
.t3{font-size:9px;color:#333;line-height:1.45;}
.qr{position:absolute;top:4mm;right:3mm;width:20mm;height:20mm;}
.qrtxt{position:absolute;top:24.5mm;right:3mm;width:20mm;font-size:7px;text-align:center;color:#333;line-height:1.2;}
.noprint{margin-bottom:6mm;}
.noprint button{padding:8px 16px;font-size:14px;font-weight:bold;cursor:pointer;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()">🖨️ Imprimir tiras</button></div>
<h1>🔑 Claves de familia — ${adEsc(grupoTxt)}</h1>
<p class="intro">Recorte cada tira y entréguela EN PRIVADO a la familia de cada estudiante (reunión de padres o cuaderno).
La clave es secreta: con ella el padre ve las notas de su hijo/a desde cualquier teléfono con internet.</p>
<div class="grid">
${filas.map(f => `
  <div class="tira">
    <img class="qr" src="${adQrSrc()}" alt="QR">
    <div class="qrtxt">📷 Apunte la cámara a este cuadro</div>
    <div class="t1">🔑 M.E.T.A.S — Clave de la familia</div>
    <div class="t2">Alumno/a <strong>#${f.num}</strong>${grupoTxt ? ' · ' + adEsc(grupoTxt) : ''}${f.nombre ? ' · ' + adEsc(f.nombre) : ''}</div>
    <div class="cod">${adEsc(adClaveBonita(f.codigo, f.num))}</div>
    <div class="t3">📱 Apunte la cámara del teléfono al cuadro, o entre a:<br><strong>${sitio}padres.html</strong><br>
    El 🤖 asistente le pedirá esta clave y le contará cómo va su hijo/a: notas, asistencia, mensajes del maestro
    y cómo apoyar en casa. Guárdela como una llave: es solo para su familia.</div>
  </div>`).join('')}
</div>
</body></html>`;
  adPrintAbrir(html);
}

/* ── Alumno nuevo a mitad de año ──
   El número de lista es el ORDEN (examen, SACE); la clave de familia
   es la IDENTIDAD del niño. Al insertar, los números >= posición se
   recorren +1 y el mapa de claves (METAS_CODIGOS_V1) se recorre igual:
   cada clave sigue a su niño. Las tiras impresas no cambian; la nube
   tampoco (los evento_id van por clave, no por número). */
function adShiftNums(obj, pos) {
  const out = {};
  Object.keys(obj || {}).forEach(n => { out[+n >= pos ? +n + 1 : +n] = obj[n]; });
  return out;
}
function adRemapCodigos(d, pos) {
  try {
    const codes = JSON.parse(localStorage.getItem('METAS_CODIGOS_V1')) || {};
    const key = 'G:' + d.id;      /* la llave del grupo (multi-colegio) */
    if (!codes[key]) return;
    const nuevo = {};
    Object.keys(codes[key]).forEach(n => { nuevo[+n >= pos ? +n + 1 : +n] = codes[key][n]; });
    codes[key] = nuevo;
    localStorage.setItem('METAS_CODIGOS_V1', JSON.stringify(codes));
  } catch (_) {}
}
async function adInsertarAlumno() {
  const d = adLoad();
  const nombre = await metasPrompt('Nombre del alumno nuevo:', {
    icono: '🧑‍🎓', titulo: 'Alumno nuevo', okTxt: 'Siguiente',
    valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el nombre.',
  });
  if (nombre === null) return;
  const max = d.lista.length ? Math.max(...d.lista.map(a => a.num)) : 0;
  const posTxt = await metasPrompt('¿Qué **número de lista** le corresponde por orden alfabético? (1 a ' + (max + 1) + ')', {
    icono: '🧑‍🎓', titulo: 'Alumno nuevo', inputmode: 'numeric', okTxt: 'Siguiente',
    valida: v => { const n = +String(v).trim(); return (n >= 1 && n <= max + 1) ? '' : 'Debe ser un número entre 1 y ' + (max + 1) + '.'; },
  });
  if (posTxt === null) return;
  const pos = +String(posTxt).trim();
  const afectados = d.lista.filter(a => a.num >= pos).length;
  if (!await metasConfirm('**' + String(nombre).trim() + '** será el **#' + pos + '**.\n\n' +
    (afectados ? afectados + ' alumno(s) se recorren un número (del #' + pos + ' al #' + (max) + ' pasan a ser #' + (pos + 1) + '–#' + (max + 1) + ').\n\n' : '') +
    'Las claves de familia viajan con cada niño: las tiras ya entregadas SIGUEN VALIENDO. ' +
    'Solo imprime la tira del nuevo. ¿Continuar?', { icono: '🧑‍🎓', titulo: 'Alumno nuevo', okTxt: 'Sí, insertar' })) return;

  adUndoGuardar('Insertar alumno «' + String(nombre).trim() + '» como #' + pos);
  /* 1) claves de familia siguen a su niño */
  adRemapCodigos(d, pos);
  /* 2) registros locales se recorren con sus niños */
  d.asistencia.forEach(r => { r.aus = adShiftNums(r.aus, pos); });
  Object.keys(d.notas || {}).forEach(p =>
    Object.keys(d.notas[p] || {}).forEach(m => { d.notas[p][m] = adShiftNums(d.notas[p][m], pos); }));
  d.colectas.forEach(c => {
    c.pagos = adShiftNums(c.pagos, pos);
    c.pagosF = adShiftNums(c.pagosF, pos);   /* la fecha viaja con su pago */
  });
  (d.lectura || []).forEach(r => { if (+r.num >= pos) r.num = +r.num + 1; });   /* las tomas de lectura también */
  /* los controles se recorren igual: sus marcas son del niño, no del número
     (antes se quedaban con el número viejo y el control mentía) */
  (d.controles || []).forEach(c => { c.datos = adShiftNums(c.datos || {}, pos); });
  /* y los equipos guardados, que también van por nº de lista */
  if (typeof eqRecorrer === 'function') eqRecorrer(d, pos);
  /* 3) la lista misma */
  d.lista.forEach(a => { if (a.num >= pos) a.num++; });
  d.lista.push({ num: pos, nombre: String(nombre).trim(), alta: Date.now() });
  /* la lista crece una fila: las marcas de borrado también, para que la
     última fila recorrida no parezca una ficha revivida */
  (d.borrados || []).forEach(b => { if (b && +b.n >= pos - 1) b.n = +b.n + 1; });
  d.lista.sort((a, b) => a.num - b.num);
  adSave(d);
  renderAdmin();
  toast('🧑‍🎓 ' + String(nombre).trim() + ' es el #' + pos);
  /* 4) su tira de clave de familia, lista para entregar */
  if (await metasConfirm('¿Imprimir ahora la **tira con la clave de familia** del alumno nuevo?', { icono: '🔑', titulo: 'Alumno nuevo', okTxt: 'Sí, imprimir' })) {
    adTiraUno(adLoad(), pos);
  }
}

/* ── Reordenar filas de alumnos a gusto del docente ──
   Mueve al alumno con TODAS sus notas ( los 4 parciales, materias,
   personalidad e inasistencias), asistencias, pagos de colectas, controles,
   tomas de lectura, equipos, comunicados/conducta, evaluaciones del Plan
   de Acción y su clave de familia (METAS_CODIGOS_V1).
   Los números de lista se renumeran en el nuevo orden (1, 2, …, N) para que
   la boleta, SACE y toda Mi aula conserven el orden elegido por el maestro. */
function adReordenarAlumnos(ordenNums, etiquetaUndo) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || d.lista.length < 2) return null;
  const porNum = {};
  d.lista.forEach(a => { porNum[a.num] = a; });
  const vistos = new Set();
  const nuevaLista = [];
  (ordenNums || []).forEach(n => {
    const k = +n;
    if (porNum[k] && !vistos.has(k)) { vistos.add(k); nuevaLista.push(porNum[k]); }
  });
  d.lista.forEach(a => {
    if (!vistos.has(a.num)) { vistos.add(a.num); nuevaLista.push(a); }
  });
  const numsDestino = d.lista.map(a => a.num).slice().sort((a, b) => a - b);
  let cambio = false;
  for (let i = 0; i < nuevaLista.length; i++) {
    if (nuevaLista[i].num !== d.lista[i].num) { cambio = true; break; }
  }
  if (!cambio) {
    if (etiquetaUndo === false) {
      const mId = {};
      d.lista.forEach(a => { mId[a.num] = a.num; });
      return mId;
    }
    return null;
  }

  if (etiquetaUndo !== false) {
    adUndoGuardar(typeof etiquetaUndo === 'string' && etiquetaUndo ? etiquetaUndo : 'Ordenar filas de alumnos');
  }

  /* Mapa: número anterior → nuevo número de lista según la nueva posición */
  const mapa = {};
  nuevaLista.forEach((al, i) => { mapa[al.num] = numsDestino[i]; });
  const remapearObj = obj => {
    const out = {};
    Object.keys(obj || {}).forEach(k => {
      const nk = mapa[+k] != null ? mapa[+k] : +k;
      out[nk] = obj[k];
    });
    return out;
  };

  /* 1) Claves de familia siguen a cada alumno (tiras impresas y nube siguen valiendo) */
  try {
    const codes = JSON.parse(localStorage.getItem('METAS_CODIGOS_V1')) || {};
    const key = 'G:' + d.id;
    if (codes[key]) {
      codes[key] = remapearObj(codes[key]);
      localStorage.setItem('METAS_CODIGOS_V1', JSON.stringify(codes));
    }
  } catch (_) {}

  /* 2) Notas SACE (todos los parciales, todas las materias, personalidad e inasistencias) */
  Object.keys(d.notas || {}).forEach(p => {
    Object.keys(d.notas[p] || {}).forEach(m => {
      d.notas[p][m] = remapearObj(d.notas[p][m]);
    });
  });

  /* 3) Asistencia, colectas, controles, lectura y equipos */
  (d.asistencia || []).forEach(r => { if (r && r.aus) r.aus = remapearObj(r.aus); });
  (d.colectas || []).forEach(c => {
    if (c && c.pagos) c.pagos = remapearObj(c.pagos);
    if (c && c.pagosF) c.pagosF = remapearObj(c.pagosF);
  });
  (d.controles || []).forEach(c => {
    if (c && c.datos) c.datos = remapearObj(c.datos);
  });
  (d.lectura || []).forEach(r => {
    if (r && mapa[+r.num] != null) r.num = mapa[+r.num];
  });
  const eq = d.equipos;
  if (eq) {
    const mArr = a => (a || []).map(n => mapa[+n] != null ? mapa[+n] : +n);
    ['reparto', 'antes'].forEach(k => { if (Array.isArray(eq[k])) eq[k] = eq[k].map(mArr); });
    if (Array.isArray(eq.coord)) eq.coord = mArr(eq.coord);
    if (Array.isArray(eq.separar)) eq.separar = eq.separar.map(mArr);
    if (eq.fuera && Array.isArray(eq.fuera.nums)) eq.fuera.nums = mArr(eq.fuera.nums);
  }

  /* 4) Comunicados individuales y reportes de conducta del grupo */
  try {
    if (typeof avLoad === 'function' && typeof avSaveAll === 'function') {
      const oAv = avLoad();
      const gAv = oAv.grupos && oAv.grupos[d.id];
      if (gAv) {
        (gAv.avisos || []).forEach(av => {
          if (av && Array.isArray(av.alumnos)) {
            av.alumnos = av.alumnos.map(n => mapa[+n] != null ? mapa[+n] : +n);
          }
        });
        (gAv.conducta || []).forEach(c => {
          if (c && mapa[+c.num] != null) c.num = mapa[+c.num];
        });
        avSaveAll(oAv);
      }
    }
  } catch (_) {}

  /* 5) Evaluaciones del Plan de Acción que pertenecen a este grupo */
  try {
    const rawPa = localStorage.getItem('METAS_PLANACCION_V1');
    if (rawPa && typeof adSugMismoGrupo === 'function') {
      const pa = JSON.parse(rawPa);
      let modPa = false;
      ((pa && pa.analisis) || []).forEach(ana => {
        if (!ana || !Array.isArray(ana.students) || !adSugMismoGrupo(ana, d)) return;
        ana.students.forEach(s => {
          if (s && mapa[+s.num] != null && +s.num !== mapa[+s.num]) {
            s.num = mapa[+s.num];
            modPa = true;
          }
        });
        ana.students.sort((a, b) => (+a.num || 0) - (+b.num || 0));
      });
      if (modPa) localStorage.setItem('METAS_PLANACCION_V1', JSON.stringify(pa));
    }
  } catch (_) {}

  /* 6) Actualizar la lista en el nuevo orden con sus números renumerados */
  d.lista = nuevaLista.map((al, i) => Object.assign({}, al, { num: numsDestino[i] }));
  adSave(d);
  return mapa;
}

/* Elimina la fila de un alumno renumerando a los demás con sus propias notas y guardando respaldo en Deshacer */
async function adEliminarAlumnoFila(numActual, alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista)) return;
  if (d.lista.length <= 1) {
    await metasAlert('Debe quedar al menos 1 fila en la lista. Si deseas cambiar el alumno, edita su nombre.', {
      icono: '👥',
      titulo: 'Borrar fila',
    });
    return;
  }
  const idx = d.lista.findIndex(a => +a.num === +numActual);
  if (idx < 0) return;
  const al = d.lista[idx];
  const quien = (al.nombre ? al.nombre : 'Sin nombre') + ' (#' + al.num + ')';
  if (!await metasConfirm(
    '¿Borrar la fila de **' + quien + '**?\n\n' +
    'Se quitará de la lista y los demás alumnos conservarán sus propias notas, asistencias, pagos y claves de familia.\n\n' +
    '💡 Si necesitas recuperarla después, podrás restaurarla en **«🕘 Deshacer o restaurar cambios»**.',
    { icono: '🗑️', titulo: 'Borrar fila de alumno', okTxt: 'Sí, borrar fila' }
  )) return;

  adUndoGuardar('Borrar fila · ' + quien);

  const d2 = adLoad();
  const restantes = d2.lista.filter(a => +a.num !== +numActual);
  const mapa = {};
  restantes.forEach((a, i) => { mapa[a.num] = i + 1; });

  const remapearSinBorrado = obj => {
    const out = {};
    Object.keys(obj || {}).forEach(k => {
      const nk = +k;
      if (nk === +numActual) return;
      if (mapa[nk] != null) out[mapa[nk]] = obj[k];
    });
    return out;
  };

  /* 1) Claves de familia */
  try {
    const codes = JSON.parse(localStorage.getItem('METAS_CODIGOS_V1')) || {};
    const key = 'G:' + d2.id;
    if (codes[key]) {
      codes[key] = remapearSinBorrado(codes[key]);
      localStorage.setItem('METAS_CODIGOS_V1', JSON.stringify(codes));
    }
  } catch (_) {}

  /* 2) Notas SACE */
  Object.keys(d2.notas || {}).forEach(p => {
    Object.keys(d2.notas[p] || {}).forEach(m => {
      d2.notas[p][m] = remapearSinBorrado(d2.notas[p][m]);
    });
  });

  /* 3) Asistencia, colectas, controles, lectura y equipos */
  (d2.asistencia || []).forEach(r => { if (r && r.aus) r.aus = remapearSinBorrado(r.aus); });
  (d2.colectas || []).forEach(c => {
    if (c && c.pagos) c.pagos = remapearSinBorrado(c.pagos);
    if (c && c.pagosF) c.pagosF = remapearSinBorrado(c.pagosF);
  });
  (d2.controles || []).forEach(c => {
    if (c && c.datos) c.datos = remapearSinBorrado(c.datos);
  });
  d2.lectura = (d2.lectura || []).filter(r => r && +r.num !== +numActual);
  d2.lectura.forEach(r => {
    if (r && mapa[+r.num] != null) r.num = mapa[+r.num];
  });
  const eq = d2.equipos;
  if (eq) {
    const mArr = a => (a || []).filter(n => +n !== +numActual).map(n => mapa[+n] != null ? mapa[+n] : +n);
    ['reparto', 'antes'].forEach(k => { if (Array.isArray(eq[k])) eq[k] = eq[k].map(mArr); });
    if (Array.isArray(eq.coord)) eq.coord = mArr(eq.coord);
    if (Array.isArray(eq.separar)) eq.separar = eq.separar.map(mArr).filter(par => par.length >= 2);
    if (eq.fuera && Array.isArray(eq.fuera.nums)) eq.fuera.nums = mArr(eq.fuera.nums);
  }

  /* 4) Comunicados y conducta */
  try {
    if (typeof avLoad === 'function' && typeof avSaveAll === 'function') {
      const oAv = avLoad();
      const gAv = oAv.grupos && oAv.grupos[d2.id];
      if (gAv) {
        (gAv.avisos || []).forEach(av => {
          if (av && Array.isArray(av.alumnos)) {
            av.alumnos = av.alumnos.filter(n => +n !== +numActual).map(n => mapa[+n] != null ? mapa[+n] : +n);
          }
        });
        gAv.conducta = (gAv.conducta || []).filter(c => c && +c.num !== +numActual);
        gAv.conducta.forEach(c => {
          if (c && mapa[+c.num] != null) c.num = mapa[+c.num];
        });
        avSaveAll(oAv);
      }
    }
  } catch (_) {}

  /* 5) Plan de Acción */
  try {
    const rawPa = localStorage.getItem('METAS_PLANACCION_V1');
    if (rawPa && typeof adSugMismoGrupo === 'function') {
      const pa = JSON.parse(rawPa);
      let modPa = false;
      ((pa && pa.analisis) || []).forEach(ana => {
        if (!ana || !Array.isArray(ana.students) || !adSugMismoGrupo(ana, d2)) return;
        const antes = ana.students.length;
        ana.students = ana.students.filter(s => s && +s.num !== +numActual);
        if (ana.students.length !== antes) modPa = true;
        ana.students.forEach(s => {
          if (s && mapa[+s.num] != null && +s.num !== mapa[+s.num]) {
            s.num = mapa[+s.num];
            modPa = true;
          }
        });
        ana.students.sort((a, b) => (+a.num || 0) - (+b.num || 0));
      });
      if (modPa) localStorage.setItem('METAS_PLANACCION_V1', JSON.stringify(pa));
    }
  } catch (_) {}

  /* 6) Guardar lista renumerada, con la marca del borrado para que una
     copia vieja de otro equipo o de la nube no la devuelva */
  d2.lista = restantes.map((a, i) => Object.assign({}, a, { num: i + 1 }));
  adMarcarBorrado(d2, al);
  if (!adSave(d2)) return;
  if (typeof alTerminar === 'function') alTerminar();
  if (typeof toast === 'function') {
    toast('🗑️ Fila borrada (' + (adPrimerNombre(al.nombre) || '#' + numActual) + ') · Puedes restaurarla en «🕘 Deshacer»');
  }
}

/* Heurística opcional para sugerir si un primer nombre suele ser femenino en español */
function adEsNombreFemeninoSugerido(nombreCompleto) {
  const p = adPrimerNombre(nombreCompleto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!p) return false;
  const mascEnA = new Set(['josua', 'joshua', 'luca', 'lukas', 'nicola', 'elias', 'matias', 'tobias', 'isaias', 'jeremias', 'abdias', 'ezequias', 'nehemias', 'zacarias', 'urias', 'jonas', 'tomas', 'lucas', 'sebas', 'borja', 'mustafa']);
  if (mascEnA.has(p)) return false;
  const femComunes = new Set(['abigail', 'adamaris', 'alison', 'allison', 'amparo', 'anabel', 'angie', 'aracely', 'arely', 'ashley', 'ashly', 'astrid', 'avril', 'beatriz', 'belen', 'berenice', 'betzy', 'brigitte', 'brittany', 'carmen', 'carol', 'celeste', 'cherlim', 'chloe', 'claire', 'consuelo', 'coral', 'cristal', 'cristy', 'dailyn', 'daisy', 'damaris', 'dayrin', 'debora', 'deborah', 'delmy', 'denisse', 'deybi', 'dolores', 'doris', 'dulce', 'edith', 'elizabeth', 'elsy', 'emily', 'emperatriz', 'esther', 'estrella', 'evelyn', 'fanny', 'flor', 'genesis', 'giselle', 'gladys', 'grace', 'grisel', 'guadalupe', 'haidee', 'hazel', 'heidi', 'helen', 'hilary', 'ines', 'ingrid', 'irene', 'iris', 'isabel', 'iveth', 'ivonne', 'jacqueline', 'jade', 'janeth', 'jasmin', 'jazmin', 'jennifer', 'jenny', 'jessica', 'jimena', 'joselyn', 'judith', 'julieth', 'karen', 'karin', 'karol', 'katherine', 'katy', 'keily', 'keiry', 'kelly', 'kendy', 'kenia', 'keren', 'keyla', 'keylin', 'kimberly', 'kristel', 'lady', 'lauren', 'leidy', 'lesly', 'leslie', 'leticia', 'liliana', 'lilian', 'liliam', 'lizbeth', 'lizeth', 'lourdes', 'lucero', 'luz', 'mabel', 'madelyn', 'magaly', 'maite', 'marbely', 'margaret', 'maribel', 'maricruz', 'mariel', 'marisol', 'marlen', 'marleny', 'mary', 'maybelline', 'maylin', 'mayra', 'megan', 'melanie', 'melany', 'melissa', 'mercedes', 'merary', 'merlin', 'michelle', 'milagro', 'milagros', 'mildred', 'miriam', 'mirian', 'monserrath', 'monserrat', 'nadia', 'nancy', 'naomi', 'nataly', 'nathaly', 'nayeli', 'nelly', 'nicole', 'nohemi', 'noemi', 'nohelia', 'norma', 'nuria', 'odalis', 'olga', 'orquidea', 'paola', 'patricia', 'paz', 'perla', 'pilar', 'rachel', 'raquel', 'rebeca', 'rocio', 'rosario', 'rosibel', 'roxana', 'ruby', 'ruth', 'sadith', 'samanta', 'samantha', 'sara', 'sarahi', 'sarai', 'scarleth', 'scarlet', 'selene', 'sharon', 'sheila', 'sherlyn', 'shirley', 'silvia', 'sindel', 'sindy', 'socorro', 'sofia', 'sol', 'soledad', 'sonia', 'stephanie', 'stephany', 'suany', 'suyen', 'tania', 'tatiana', 'teresa', 'tiffany', 'valeria', 'valery', 'vanessa', 'wendy', 'ximena', 'xiomara', 'yamileth', 'yaneth', 'ocirema', 'yaquelin', 'yareli', 'yasmin', 'yazmin', 'yesenia', 'yessica', 'yohana', 'yolanda', 'yoselin', 'yulissa', 'zoe', 'zulema']);
  if (femComunes.has(p)) return true;
  if (p.endsWith('a') || p.endsWith('eth') || p.endsWith('elly') || p.endsWith('ely') || p.endsWith('lyn')) return true;
  return false;
}

/* Modal para elegir/confirmar quiénes son ♀ Niñas y ordenar Niñas (A–Z) arriba y ♂ Varones (A–Z) debajo */
function adOrdenarPorGeneroModal(alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || d.lista.length < 2) {
    if (typeof toast === 'function') toast('Agrega al menos 2 alumnos para ordenar');
    return;
  }
  const ninasSet = new Set();
  const algunoRegistrado = d.lista.some(a => a.sexo === 'F' || a.sexo === 'M');
  d.lista.forEach(a => {
    if (a.sexo === 'F') ninasSet.add(a.num);
    else if (!algunoRegistrado && adEsNombreFemeninoSugerido(a.nombre)) ninasSet.add(a.num);
  });

  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov';
  ov.innerHTML = `
    <div class="ad-gen-card" role="dialog" aria-modal="true" aria-labelledby="ad-gen-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-gen-tit">♀♂ Ordenar Niñas y luego Varones (A–Z)</div>
        <button type="button" class="ad-gen-close" id="ad-gen-x" aria-label="Cerrar">✕</button>
      </div>
      <p class="ad-gen-hint">
        Toca en la lista para marcar o desmarcar a las <strong>♀ Niñas</strong>. Los demás quedarán como <strong>♂ Varones</strong>.<br>
        Al confirmar, se ordenarán primero las <strong>♀ Niñas (A–Z)</strong> y debajo los <strong>♂ Varones (A–Z)</strong>, moviendo cada fila con todas sus notas.
      </p>
      <div class="ad-gen-bar">
        <span class="ad-gen-count" id="ad-gen-cnt"></span>
        <div class="ad-gen-qbtns">
          <button type="button" class="ad-gen-qbtn" id="ad-gen-auto">✨ Sugerir por nombre</button>
          <button type="button" class="ad-gen-qbtn" id="ad-gen-todas">♀ Todas</button>
          <button type="button" class="ad-gen-qbtn" id="ad-gen-ninguna">♂ Ninguna</button>
        </div>
      </div>
      <div class="ad-gen-grid" id="ad-gen-grid">
        ${d.lista.map(a => {
          const esF = ninasSet.has(a.num);
          return `<button type="button" class="ad-gen-item ${esF ? 'ad-gen-f' : 'ad-gen-m'}" data-gnum="${a.num}">
            <span class="ad-gen-badge">${esF ? '♀ Niña' : '♂ Varón'}</span>
            <span class="ad-gen-num">#${a.num}</span>
            <span class="ad-gen-nom">${adEsc(a.nombre || 'Sin nombre')}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="ad-gen-foot">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-gen-cancel">Cancelar</button>
        <button type="button" class="pa-generate-btn" id="ad-gen-ok">✅ Ordenar Niñas (A–Z) y debajo Varones (A–Z)</button>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const actualizarVista = () => {
    const fCount = ninasSet.size;
    const mCount = d.lista.length - fCount;
    const cnt = ov.querySelector('#ad-gen-cnt');
    if (cnt) cnt.innerHTML = `<b class="ad-gen-cf">♀ ${fCount} niña${fCount === 1 ? '' : 's'}</b> · <b class="ad-gen-cm">♂ ${mCount} var${mCount === 1 ? 'ón' : 'ones'}</b>`;
    ov.querySelectorAll('.ad-gen-item').forEach(btn => {
      const num = +btn.dataset.gnum;
      const esF = ninasSet.has(num);
      btn.classList.toggle('ad-gen-f', esF);
      btn.classList.toggle('ad-gen-m', !esF);
      const b = btn.querySelector('.ad-gen-badge');
      if (b) b.textContent = esF ? '♀ Niña' : '♂ Varón';
    });
  };
  actualizarVista();

  ov.querySelectorAll('.ad-gen-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = +btn.dataset.gnum;
      if (ninasSet.has(num)) ninasSet.delete(num);
      else ninasSet.add(num);
      actualizarVista();
    });
  });

  ov.querySelector('#ad-gen-auto')?.addEventListener('click', () => {
    ninasSet.clear();
    d.lista.forEach(a => {
      if (adEsNombreFemeninoSugerido(a.nombre)) ninasSet.add(a.num);
    });
    actualizarVista();
  });
  ov.querySelector('#ad-gen-todas')?.addEventListener('click', () => {
    d.lista.forEach(a => ninasSet.add(a.num));
    actualizarVista();
  });
  ov.querySelector('#ad-gen-ninguna')?.addEventListener('click', () => {
    ninasSet.clear();
    actualizarVista();
  });

  const cerrar = () => { ov.remove(); };
  ov.querySelector('#ad-gen-x')?.addEventListener('click', cerrar);
  ov.querySelector('#ad-gen-cancel')?.addEventListener('click', cerrar);
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });

  ov.querySelector('#ad-gen-ok')?.addEventListener('click', () => {
    adUndoGuardar('Ordenar Niñas A–Z y Varones A–Z');
    const dd = adLoad();
    dd.lista.forEach(a => {
      a.sexo = ninasSet.has(a.num) ? 'F' : 'M';
    });
    adSave(dd);

    const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    const cmpNombre = (a, b) => {
      const na = String(a.nombre || '').trim();
      const nb = String(b.nombre || '').trim();
      if (!na && !nb) return a.num - b.num;
      if (!na) return 1;
      if (!nb) return -1;
      return collator.compare(na, nb) || (a.num - b.num);
    };
    const ninas = dd.lista.filter(a => ninasSet.has(a.num)).sort(cmpNombre);
    const varones = dd.lista.filter(a => !ninasSet.has(a.num)).sort(cmpNombre);
    const ordenNums = ninas.concat(varones).map(a => a.num);

    adReordenarAlumnos(ordenNums, false);
    cerrar();
    if (typeof alTerminar === 'function') alTerminar();
    if (typeof toast === 'function') {
      toast('♀♂ Ordenado: ' + ninas.length + ' niñas (A–Z) arriba y ' + varones.length + ' varones (A–Z) debajo');
    }
  });
}

/* Modal para elegir qué alumno(s) NO deben copiarse cuando se toca el botón 📋 de una columna en Notas SACE */
function adElegirNoCopiarModal(alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || !d.lista.length) {
    if (typeof toast === 'function') toast('Agrega alumnos a la lista primero');
    return;
  }
  const noSet = new Set();
  d.lista.forEach(a => {
    if (a.noCopiarSace) noSet.add(a.num);
  });
  const hayPrueba = d.lista.some(a => a.prueba);

  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov';
  ov.innerHTML = `
    <div class="ad-gen-card" role="dialog" aria-modal="true" aria-labelledby="ad-nc-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-nc-tit">🙈 Elegir quién NO copiar en 📋</div>
        <button type="button" class="ad-gen-close" id="ad-nc-x" aria-label="Cerrar">✕</button>
      </div>
      <p class="ad-gen-hint">
        Toca el nombre de cualquier alumno que <strong>NO deba copiarse</strong> al presionar <strong>📋</strong> en la columna de una materia (por ejemplo, si aún no está en SACE o es oyente).<br>
        Sus notas siguen guardadas en su fila y en su boleta, pero <strong>se saltan al copiar la columna</strong> para que tus filas cuadren exacto con SACE.
      </p>
      <div class="ad-gen-bar">
        <span class="ad-gen-count" id="ad-nc-cnt"></span>
        <div class="ad-gen-qbtns">
          <button type="button" class="ad-gen-qbtn" id="ad-nc-todos">✅ Copiar a todos</button>
          ${hayPrueba ? '<button type="button" class="ad-gen-qbtn" id="ad-nc-prueba">🧪 Omitir de prueba</button>' : ''}
        </div>
      </div>
      <div class="ad-gen-grid" id="ad-nc-grid">
        ${d.lista.map(a => {
          const omitir = noSet.has(a.num);
          return `<button type="button" class="ad-gen-item ${omitir ? 'ad-nc-no' : 'ad-nc-si'}" data-ncnum="${a.num}">
            <span class="ad-gen-badge">${omitir ? '🙈 No copiar' : '✅ Sí copiar'}</span>
            <span class="ad-gen-num">#${a.num}</span>
            <span class="ad-gen-nom">${adEsc(a.nombre || 'Sin nombre')}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="ad-gen-foot">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-nc-cancel">Cancelar</button>
        <button type="button" class="pa-generate-btn" id="ad-nc-ok">✅ Guardar selección</button>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const actualizarVista = () => {
    const noCount = noSet.size;
    const siCount = d.lista.length - noCount;
    const cnt = ov.querySelector('#ad-nc-cnt');
    if (cnt) {
      cnt.innerHTML = `<b class="ad-nc-csi">✅ ${siCount} se copia${siCount === 1 ? '' : 'n'}</b> · <b class="ad-nc-cno">🙈 ${noCount} omitido${noCount === 1 ? '' : 's'}</b>`;
    }
    ov.querySelectorAll('.ad-gen-item').forEach(btn => {
      const num = +btn.dataset.ncnum;
      const omitir = noSet.has(num);
      btn.classList.toggle('ad-nc-no', omitir);
      btn.classList.toggle('ad-nc-si', !omitir);
      const b = btn.querySelector('.ad-gen-badge');
      if (b) b.textContent = omitir ? '🙈 No copiar' : '✅ Sí copiar';
    });
  };
  actualizarVista();

  ov.querySelectorAll('.ad-gen-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = +btn.dataset.ncnum;
      if (noSet.has(num)) noSet.delete(num);
      else noSet.add(num);
      actualizarVista();
    });
  });

  ov.querySelector('#ad-nc-todos')?.addEventListener('click', () => {
    noSet.clear();
    actualizarVista();
  });
  ov.querySelector('#ad-nc-prueba')?.addEventListener('click', () => {
    d.lista.forEach(a => { if (a.prueba) noSet.add(a.num); });
    actualizarVista();
  });

  const cerrar = () => { ov.remove(); };
  ov.querySelector('#ad-nc-x')?.addEventListener('click', cerrar);
  ov.querySelector('#ad-nc-cancel')?.addEventListener('click', cerrar);
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });

  ov.querySelector('#ad-nc-ok')?.addEventListener('click', () => {
    const dd = adLoad();
    dd.lista.forEach(a => {
      if (noSet.has(a.num)) a.noCopiarSace = 1;
      else delete a.noCopiarSace;
    });
    adSave(dd);
    cerrar();
    if (typeof alTerminar === 'function') alTerminar();
    if (typeof toast === 'function') {
      if (noSet.size) {
        const noms = dd.lista.filter(a => a.noCopiarSace).map(a => adPrimerNombre(a.nombre) || ('#' + a.num)).join(', ');
        toast('🙈 Al copiar con 📋 no se copiará a: ' + noms);
      } else {
        toast('✅ Se copiarán todos los alumnos al tocar 📋');
      }
    }
  });
}

/* Modal para elegir si copiar la columna de Personalidad en NÚMERO (4, 3, 2 según escala azul de SACE)
   o en LETRA (S, MB, B) al momento de presionar 📋. */
function adElegirFormatoCopiaPersModal(campo, parcial, incluidos, ns, escala, alElegir) {
  const muestras = (incluidos || []).filter(a => ns && ns[a.num] != null && ns[a.num] !== '').slice(0, 4);
  const ejNum = muestras.map(a => {
    const v = String(ns[a.num]).trim();
    const n = adPersANumero(v, escala);
    return '#' + a.num + ' ' + (adPrimerNombre(a.nombre) || '') + ': ' + v + ' → ' + n;
  }).join(' · ');

  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov';
  ov.innerHTML = `
    <div class="ad-gen-card ad-pers-copy-modal" role="dialog" aria-modal="true" aria-labelledby="ad-pcp-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-pcp-tit">📋 Copiar «${adEsc(campo)} · Parcial ${adEsc(parcial)}»</div>
        <button type="button" class="ad-gen-close" id="ad-pcp-x" aria-label="Cerrar">✕</button>
      </div>
      <div class="ad-pers-copy-body">
        <div class="ad-pers-blue-scale">
          <div class="ad-pers-blue-title">Por favor llene las celdas de personalidad de los alumnos siguiendo la Escala:</div>
          <div class="ad-pers-blue-item"><b>4:Sobresaliente</b> <span class="ad-pers-blue-eq">(S → 4)</span></div>
          <div class="ad-pers-blue-item"><b>3:Muy Bueno</b> <span class="ad-pers-blue-eq">(MB → 3)</span></div>
          <div class="ad-pers-blue-item"><b>2:Bueno</b> <span class="ad-pers-blue-eq">(B → 2)</span></div>
        </div>
        ${ejNum ? `<div class="ad-pers-copy-prev">Vista previa (${incluidos.length} filas): <strong>${adEsc(ejNum)}</strong></div>` : ''}
        <div class="ad-pers-copy-actions">
          <button type="button" class="pa-generate-btn ad-pers-btn-num" id="ad-pcp-num">
            🔢 Copiar en número (4, 3, 2) según escala SACE
          </button>
          <button type="button" class="pa-generate-btn ad-btn-sec ad-pers-btn-letra" id="ad-pcp-letra">
            🔤 Copiar en letra (S, MB, B)
          </button>
        </div>
        <label class="ad-pers-copy-rem">
          <input type="checkbox" id="ad-pcp-recordar">
          <span>Copiar directo las siguientes columnas con esta misma opción (puedes cambiarlo arriba de la tabla)</span>
        </label>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const cerrar = () => { ov.remove(); };
  ov.querySelector('#ad-pcp-x')?.addEventListener('click', cerrar);
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });

  const elegir = formato => {
    const rec = !!(ov.querySelector('#ad-pcp-recordar') && ov.querySelector('#ad-pcp-recordar').checked);
    cerrar();
    if (typeof alElegir === 'function') alElegir(formato, rec);
  };
  ov.querySelector('#ad-pcp-num')?.addEventListener('click', () => elegir('num'));
  ov.querySelector('#ad-pcp-letra')?.addEventListener('click', () => elegir('letra'));
}

/* Mueve a un alumno un paso arriba (-1) o abajo (+1) con todas sus notas */
function adMoverAlumnoPaso(numActual, paso, alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || d.lista.length < 2) return;
  const idx = d.lista.findIndex(a => +a.num === +numActual);
  if (idx < 0) return;
  const dest = idx + paso;
  if (dest < 0 || dest >= d.lista.length) return;
  const al = d.lista[idx];
  const orden = d.lista.map(a => a.num);
  const tmp = orden[idx];
  orden[idx] = orden[dest];
  orden[dest] = tmp;
  const mapa = adReordenarAlumnos(orden, 'Mover fila · ' + (adPrimerNombre(al.nombre) || ('#' + al.num)));
  if (mapa && typeof alTerminar === 'function') {
    alTerminar(mapa[+numActual], false);
  }
}

/* Mueve a un alumno directamente al número de posición elegido (ej. del #25 al #8) */
async function adMoverAlumnoAPosicion(numActual, alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || d.lista.length < 2) return;
  const idx = d.lista.findIndex(a => +a.num === +numActual);
  if (idx < 0) return;
  const al = d.lista[idx];
  const total = d.lista.length;
  const posActual = idx + 1;
  const quien = (al.nombre ? al.nombre : 'Alumno/a') + ' (#' + al.num + ')';
  const resp = await metasPrompt(
    'Escribe el **número de posición (1 a ' + total + ')** al que quieres mover a **' + quien + '**:\n\n' +
    'Toda su fila —con sus notas de todos los parciales, asistencias, pagos y clave de familia— se moverá junto con él/ella.',
    {
      icono: '↕️',
      titulo: 'Mover fila con sus notas',
      value: String(posActual),
      inputmode: 'numeric',
      okTxt: 'Mover fila',
      valida: v => {
        const n = parseInt(String(v).trim(), 10);
        return (n >= 1 && n <= total) ? '' : 'Escribe un número entre 1 y ' + total + '.';
      },
    }
  );
  if (resp === null) return;
  const posDest = parseInt(String(resp).trim(), 10);
  if (!posDest || posDest === posActual || posDest < 1 || posDest > total) return;
  const d2 = adLoad();
  const idx2 = d2.lista.findIndex(a => +a.num === +numActual);
  if (idx2 < 0) return;
  const orden = d2.lista.map(a => a.num);
  const [movido] = orden.splice(idx2, 1);
  orden.splice(posDest - 1, 0, movido);
  const mapa = adReordenarAlumnos(orden, 'Mover a #' + posDest + ' · ' + (adPrimerNombre(al.nombre) || ('#' + al.num)));
  if (mapa) {
    const nuevoNum = mapa[+numActual];
    if (typeof alTerminar === 'function') alTerminar(nuevoNum, true);
    if (typeof toast === 'function') {
      toast('↕️ ' + (adPrimerNombre(al.nombre) || 'Alumno') + ' movido(a) a la posición #' + nuevoNum + ' con todas sus notas');
    }
  }
}

/* Ordena toda la lista alfabéticamente (A–Z) llevando consigo las notas de cada alumno */
async function adOrdenarAlumnosAZ(alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || d.lista.length < 2) {
    if (typeof toast === 'function') toast('Agrega al menos 2 alumnos para ordenar');
    return;
  }
  const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
  const ordenada = d.lista.slice().sort((a, b) => {
    const na = String(a.nombre || '').trim();
    const nb = String(b.nombre || '').trim();
    if (!na && !nb) return a.num - b.num;
    if (!na) return 1;
    if (!nb) return -1;
    return collator.compare(na, nb) || (a.num - b.num);
  });
  const yaOrdenada = ordenada.every((a, i) => a.num === d.lista[i].num);
  if (yaOrdenada) {
    if (typeof toast === 'function') toast('✅ La lista ya está en orden alfabético (A–Z)');
    return;
  }
  if (!await metasConfirm(
    '¿Ordenar todas las filas **alfabéticamente (A–Z)**?\n\n' +
    'Cada alumno se moverá a su lugar alfabético **con todas sus notas**, asistencias, pagos y clave de familia.',
    { icono: '🔤', titulo: 'Ordenar A–Z con sus notas', okTxt: 'Sí, ordenar A–Z' }
  )) return;
  const mapa = adReordenarAlumnos(ordenada.map(a => a.num), 'Ordenar lista A–Z');
  if (mapa) {
    if (typeof alTerminar === 'function') alTerminar(null, false);
    if (typeof toast === 'function') toast('🔤 Filas ordenadas A–Z con todas sus notas');
  }
}

/* ── Controles de fila (▲, ▼, #posición y ✕ borrar fila) en tablas .ad-mx ── */
function adTablaFilasArrastrar(tabla, alCambiar) {
  if (!tabla) return;
  const tbody = tabla.querySelector('tbody');
  if (!tbody) return;
  const wrap = tabla.closest('.ad-mx-wrap');

  const refrescarConservandoVista = (nuevoNum, centrarFila) => {
    const st = wrap ? wrap.scrollTop : 0;
    const sl = wrap ? wrap.scrollLeft : 0;
    const wy = window.scrollY;
    if (typeof alCambiar === 'function') alCambiar(nuevoNum);
    const w2 = document.querySelector('.ad-mx-wrap');
    if (w2) { w2.scrollTop = st; w2.scrollLeft = sl; }
    window.scrollTo(0, wy);
    if (nuevoNum != null) {
      const destTr = document.querySelector('tr[data-rnum="' + nuevoNum + '"]');
      if (destTr) {
        if (centrarFila) {
          try { destTr.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {}
        } else {
          try { destTr.scrollIntoView({ block: 'nearest' }); } catch (_) {}
        }
        destTr.classList.add('ad-mx-tr-movida');
        setTimeout(() => destTr.classList.remove('ad-mx-tr-movida'), 1000);
      }
    }
  };

  /* 1) Botones ▲ / ▼ para subir o bajar la fila con sus notas */
  tbody.querySelectorAll('.ad-mx-rmv').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const num = +btn.dataset.rnum;
      const dir = +btn.dataset.rdir;
      adMoverAlumnoPaso(num, dir, (nuevoNum) => {
        refrescarConservandoVista(nuevoNum, false);
      });
    });
  });

  /* 2) Tocar #N para escribir directamente la posición destino (ej. mover a #8) */
  tbody.querySelectorAll('[data-irnum]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const num = +btn.dataset.irnum;
      adMoverAlumnoAPosicion(num, (nuevoNum, centrar) => {
        refrescarConservandoVista(nuevoNum, centrar);
      });
    });
  });

  /* 3) Botón ✕ para borrar la fila (con respaldo en Deshacer) */
  tbody.querySelectorAll('[data-delnum]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const num = +btn.dataset.delnum;
      adEliminarAlumnoFila(num, () => {
        refrescarConservandoVista(null, false);
      });
    });
  });
}

/* ── Controles de fila (▲, ▼ y #posición) en 👥 Alumnos (#ad-lista-rows) ── */
function adListaFilasArrastrar(cont) {
  if (!cont) return;

  const guardarNombresActuales = () => {
    const dd = adLoad();
    const porNum = {};
    cont.querySelectorAll('.ad-al-row').forEach(r => {
      const inp = r.querySelector('.ad-al-nombre');
      if (inp) porNum[+r.dataset.num] = inp.value.trim();
    });
    (dd.lista || []).forEach(a => {
      if (porNum[a.num] !== undefined) a.nombre = porNum[a.num];
    });
    adSave(dd);
  };

  /* 1) Botones ▲ / ▼ */
  cont.querySelectorAll('.ad-al-rmv').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      guardarNombresActuales();
      const wy = window.scrollY;
      adMoverAlumnoPaso(+btn.dataset.rnum, +btn.dataset.rdir, () => {
        renderAdmin();
        window.scrollTo(0, wy);
      });
    });
  });

  /* 2) Tocar #N para mover directo a una posición (ej. #8) */
  cont.querySelectorAll('[data-irnum]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      guardarNombresActuales();
      adMoverAlumnoAPosicion(+btn.dataset.irnum, (nuevoNum) => {
        renderAdmin();
        if (nuevoNum != null) {
          const filaDest = document.querySelector('.ad-al-row[data-num="' + nuevoNum + '"]');
          if (filaDest) {
            try { filaDest.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {}
          }
        }
      });
    });
  });
}

function adTiraUno(d, num) {
  const codigo = adClaveFamilia(d.id, num);
  if (!codigo) { toast('No se pudo generar la clave'); return; }
  const a = d.lista.find(x => x.num === num) || { nombre: '' };
  const bonito = adClaveBonita(codigo, num);
  const grupo = adGrupoTxt(d);
  const sitio = (typeof PA_SITE !== 'undefined') ? PA_SITE
    : 'https://metas.policastsapien.com/';
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Clave de familia — #${num}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;color:#111;background:#fff;padding:10mm;}
.tira{border:1.5px dashed #888;border-radius:6px;padding:4mm;max-width:95mm;position:relative;padding-right:25mm;}
.t1{font-size:10px;font-weight:bold;color:#1e3a7c;}
.t2{font-size:11px;margin-top:1.5mm;}
.cod{font-size:20px;font-weight:900;letter-spacing:2px;margin:2mm 0;font-family:'Courier New',monospace;}
.t3{font-size:9px;color:#333;line-height:1.45;}
.qr{position:absolute;top:4mm;right:3mm;width:20mm;height:20mm;}
.qrtxt{position:absolute;top:24.5mm;right:3mm;width:20mm;font-size:7px;text-align:center;color:#333;line-height:1.2;}
.noprint{margin-bottom:6mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir tira</button></div>
<div class="tira">
  <img class="qr" src="${adQrSrc()}" alt="QR">
  <div class="qrtxt">📷 Apunte la cámara a este cuadro</div>
  <div class="t1">🔑 M.E.T.A.S — Clave de la familia</div>
  <div class="t2">Alumno/a <strong>#${num}</strong>${grupo ? ' · ' + adEsc(grupo) : ''}${a.nombre ? ' · ' + adEsc(a.nombre) : ''}</div>
  <div class="cod">${bonito}</div>
  <div class="t3">📱 Apunte la cámara del teléfono al cuadro, o entre a:<br><strong>${sitio}padres.html</strong><br>
  El 🤖 asistente le pedirá esta clave y le contará cómo va su hijo/a: notas, asistencia, mensajes del maestro
  y cómo apoyar en casa. Guárdela como una llave: es solo para su familia.</div>
</div>
</body></html>`;
  adPrintAbrir(html);
}

function adSinLista(body, quePara) {
  body.innerHTML = `
    <div class="pa-card">
      <p class="pa-optional-hint" style="margin:0">Primero arma tu <strong>👥 Lista</strong> de alumnos
      (o tráela del Plan de Acción) para usar ${quePara}.</p>
    </div>`;
}

/* ══════════════ 🗂️ FICHA DEL ALUMNO — identidad y contactos ══════════════
   Datos que el expediente necesita y que hoy el maestro carga en una hoja
   aparte: identidad del alumno, su teléfono, y el encargado con su identidad y
   teléfono. Se guardan DENTRO de cada alumno de la lista (a.idn, a.tel, a.enc,
   a.encId, a.encTel), no en otro almacén, para que viajen con el alumno cuando
   se inserta, se renumera o se sincroniza entre equipos.

   No se meten en la fila de la lista: cinco campos más por alumno la volverían
   inusable en un teléfono. Van en su propia pantalla, con la MISMA matriz de
   auto-avance de Notas SACE (el maestro ya sabe usarla) y con pegado desde
   Excel, porque teclear 43 × 5 datos a mano en un celular no es realista. */
const AD_FICHA_CAMPOS = [
  { k: 'idn',    et: 'Nº de identidad',         im: 'numeric', max: 20, w: 108 },
  { k: 'tel',    et: 'Tel. del alumno',         im: 'tel',     max: 20, w: 96 },
  { k: 'enc',    et: 'Padre o encargado',       im: 'text',    max: 70, w: 160 },
  { k: 'encId',  et: 'Identidad del encargado', im: 'numeric', max: 20, w: 108 },
  { k: 'encTel', et: 'Tel. del encargado',      im: 'tel',     max: 20, w: 96 },
];
function adFichaLlenos(d, k) {
  return (d.lista || []).filter(a => String(a[k] || '').trim()).length;
}

function adRenderFichas(body, d) {
  const total = d.lista.length;
  const completos = (d.lista || []).filter(a =>
    AD_FICHA_CAMPOS.every(c => String(a[c.k] || '').trim())).length;
  const SL = window.SaceLista;
  const hoy = adHoy();
  const oficial = SL && SL.hayImportacion(d);
  const idnMal = (d.lista || []).filter(a => String(a.idn || '').trim() && !SL.idnValida(a.idn)).length;
  /* lo que la ficha dice del alumno frente a la lista oficial: con ✓/⚠ y
     texto, nunca solo con color */
  const marcaOficial = a => {
    const t = [];
    if (oficial && !a.prueba) t.push(a.sace === true
      ? '<span class="ad-fi-badge ad-fi-b-ok" title="En la lista oficial del SACE">✓ SACE</span>'
      : '<span class="ad-fi-badge ad-fi-b-fuera" title="No está en la lista oficial del SACE: no entra en ningún cuadro">⚠ Fuera de la lista oficial</span>');
    if (SL.seFue(a)) t.push('<span class="ad-fi-badge ad-fi-b-ido">' + (a.estado === 'trasladado' ? '↪ Trasladado' : '✗ Desertor') + '</span>');
    return t.join('');
  };

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="ad-fi-volver">👥 Alumnos</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">🗂️ Identidad y contactos</div>
      <p class="pa-optional-hint">Estos datos salen en el <strong>expediente del aula</strong>, en la hoja
        de alumnos. Escribe y <strong>Enter</strong> (o Tab) salta a la casilla siguiente; se guarda solo.
        <strong>No se comparten con nadie</strong>: no viajan al asistente de padres, solo a tus equipos.</p>
      <p class="pa-optional-hint">📥 <strong>Importar lista del SACE</strong> trae identidad, nombre, sexo y
        fecha de nacimiento oficiales. Antes de guardar te enseña qué cambia y tú confirmas cada grupo;
        nunca borra fichas ni notas. La <strong>estadística</strong> cuenta solo a los alumnos de la lista
        oficial que siguen activos.</p>
      <p class="pa-optional-hint">↔ <strong>Estado · Fecha de movimiento</strong>: marca <strong>Ingreso</strong> a quien llegó
        ya empezado el año, <strong>Traslado</strong> o <strong>Desertor</strong> a quien se fue, con la fecha. Nadie se borra:
        con esto sale solo el <strong>📋 Resumen final de resultados por grado</strong>.</p>
      <p class="pa-optional-hint">♀♂ La columna <strong>Sexo</strong> se llena <strong>tocando</strong>,
        sin teclado: cada toque pasa de niña a varón y a vacío. Con ella, el
        <strong>informe del grado</strong> dice cuántas niñas y cuántos varones tienes sin que los
        cuentes a mano.</p>
      <div class="ad-fi-marcador">
        <span class="ad-fi-m-val">${completos}<span class="ad-fi-m-de">/${total}</span></span>
        <span class="ad-fi-m-lbl">fichas completas</span>
        ${oficial ? `<span class="ad-fi-m-sub">📥 Matrícula final (lista oficial del SACE): <b>${SL.matriculaFinal(d).length}</b> de ${adAlumnosReales(d).length} fichas</span>` : ''}
        ${idnMal ? `<span class="ad-fi-m-sub">⚠ ${idnMal} identidad(es) sin 13 dígitos</span>` : ''}
        <span class="ad-fi-m-sub"><b id="ad-fi-sx-cuenta">${adSexosTxt(d)}</b> · ${AD_FICHA_CAMPOS.map(c =>
          adFichaLlenos(d, c.k) + ' ' + c.et.toLowerCase().replace('nº de ', '').replace('tel. del ', 'tel. ')).join(' · ')}</span>
      </div>

      <div class="ad-mx-wrap">
        <table class="ad-mx ad-fi-mx">
          <thead><tr>
            <th class="ad-mx-sticky ad-mx-corner">Nº · Alumno</th>
            <th><div class="ad-mx-h" style="min-width:96px">Lista oficial</div></th>
            <th><div class="ad-mx-h" style="min-width:52px">Sexo</div></th>
            <th><div class="ad-mx-h" style="min-width:128px">Fecha de nacimiento</div></th>
            <th><div class="ad-mx-h" style="min-width:112px">Edad</div></th>
            <th><div class="ad-mx-h" style="min-width:150px">Estado · Fecha de movimiento</div></th>
            ${AD_FICHA_CAMPOS.map(c => `<th><div class="ad-mx-h" style="min-width:${c.w}px">${adEsc(c.et)}</div></th>`).join('')}
          </tr></thead>
          <tbody>
            ${d.lista.map((a, ri) => `<tr data-rnum="${a.num}"${SL.seFue(a) ? ' class="ad-fi-ido"' : ''}>
              <td class="ad-mx-sticky" title="${adEsc(a.nombre || ('#' + a.num))}">
                <div class="ad-mx-sbox">
                  <span class="ad-mx-rbtns">
                    <button type="button" class="ad-mx-rmv" data-rdir="-1" data-rnum="${a.num}" title="Subir una posición" aria-label="Subir"${ri === 0 ? ' disabled' : ''}>▲</button>
                    <button type="button" class="ad-mx-rmv" data-rdir="1" data-rnum="${a.num}" title="Bajar una posición" aria-label="Bajar"${ri === d.lista.length - 1 ? ' disabled' : ''}>▼</button>
                  </span>
                  <button type="button" class="ad-mx-num" data-irnum="${a.num}" title="Toca para escribir a qué posición (#) quieres mover esta fila">#${a.num}</button>
                  <span class="ad-mx-nom">${adEsc(adPrimerNombre(a.nombre)) || '—'}</span>
                  <button type="button" class="ad-mx-del" data-delnum="${a.num}" title="Borrar esta fila (con opción de restaurar)" aria-label="Borrar fila">✕</button>
                </div></td>
              <td class="ad-fi-marca">${marcaOficial(a) || '·'}</td>
              <td><button class="ad-fi-sexo ad-fi-sx-${a.sexo === 'F' ? 'f' : a.sexo === 'M' ? 'm' : 'no'}"
                data-sxnum="${a.num}" aria-label="Sexo de ${adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))}: ${a.sexo === 'F' ? 'niña' : a.sexo === 'M' ? 'varón' : 'sin registrar'}. Tocar para cambiar."
                >${a.sexo === 'F' ? '♀ Niña' : a.sexo === 'M' ? '♂ Varón' : '·'}</button></td>
              <td><input class="ad-mx-inp ad-fi-fnac" type="date" data-fnnum="${a.num}" max="${hoy}"
                value="${adEsc(SL.fechaValida(a.fnac) ? a.fnac : '')}"
                aria-label="Fecha de nacimiento de ${adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))}"></td>
              <td class="ad-fi-edad" data-ednum="${a.num}">${SL.edadTxt(a.fnac, hoy) || '·'}</td>
              <td class="ad-fi-est-td"><select class="ad-fi-estado" data-esnum="${a.num}"
                  aria-label="Estado de ${adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))}">
                  ${Object.keys(SL.ESTADOS).map(k => `<option value="${k}"${(a.estado || 'activo') === k ? ' selected' : ''}>${SL.ESTADOS[k]}</option>`).join('')}
                </select>
                <input class="ad-mx-inp ad-fi-estf" type="date" data-efnum="${a.num}" value="${adEsc(a.estadoF || '')}"
                  ${(a.estado || 'activo') === 'activo' ? 'hidden' : ''}
                  aria-label="Fecha de movimiento de ${adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))}"></td>
              ${AD_FICHA_CAMPOS.map((c, ci) => {
                const mal = c.k === 'idn' && String(a.idn || '').trim() && !SL.idnValida(a.idn);
                return `<td${mal ? ' class="ad-fi-idn-mal" title="⚠ No tiene 13 dígitos"' : ''}><input class="ad-mx-inp ad-fi-inp"
                data-idx="${ri * AD_FICHA_CAMPOS.length + ci}" data-num="${a.num}" data-k="${c.k}"
                type="text" inputmode="${c.im}" maxlength="${c.max}" style="min-width:${c.w}px"
                value="${adEsc(String(a[c.k] || ''))}" placeholder="·"${mal ? ' aria-invalid="true"' : ''}></td>`;
              }).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-orden-az" type="button">🔤 Ordenar A–Z</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-orden-gen" type="button">♀♂ Ordenar Niñas y luego Varones (A–Z)</button>
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-pegar">📋 Pegar desde Excel</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-faltan">🔎 ¿A quién le falta?</button>
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="ad-fi-sace" type="button">📥 Importar lista del SACE</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-cuadro" type="button">📊 Matrícula final por edades y género</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-fi-resumen" type="button">📋 Resumen final de resultados por grado</button>
        <input type="file" id="ad-fi-sace-file" accept=".csv,text/csv,text/plain" hidden>
      </div>
      <div id="ad-fi-pegar-box" style="display:none;margin-top:10px;">
        <p class="pa-paste-hint">Pega desde tu hoja de Excel, <strong>un alumno por línea</strong>, en este
          orden y separado por <strong>tabulaciones</strong> (así sale al copiar de Excel) o por punto y coma:<br>
          <strong>Nº de lista · identidad del alumno · teléfono del alumno · encargado · identidad del encargado · teléfono del encargado</strong><br>
          Se busca por el <strong>número de lista</strong>, así que el orden de las filas no importa y las
          columnas que dejes vacías no borran lo que ya hay.</p>
        <textarea id="ad-fi-pegar-ta" class="pa-paste-area" rows="5"
          placeholder="1&#9;0801-2013-01234&#9;9988-7766&#9;María Sevilla&#9;0801-1985-04567&#9;9911-2233"></textarea>
        <button class="pa-generate-btn" id="ad-fi-pegar-ok">✅ Importar estos datos</button>
      </div>
      <p class="pa-optional-hint" id="ad-fi-estado" style="margin-top:8px"></p>
    </div>
    ${adUndoTarjetaHtml()}`;

  document.getElementById('ad-fi-volver').addEventListener('click', () => { _adFichasOn = 0; renderAdmin(); });
  const estado = t => { const e = document.getElementById('ad-fi-estado'); if (e) e.textContent = t; };

  /* auto-avance a lo ancho, igual que Notas SACE */
  const inputs = [...body.querySelectorAll('.ad-fi-inp')];
  const focar = i => {
    if (i >= 0 && i < inputs.length) {
      inputs[i].focus(); inputs[i].select();
      try { inputs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) {}
    }
  };
  inputs.forEach(inp => {
    const idx = +inp.dataset.idx;
    inp.addEventListener('input', () => {
      const dd = adLoad();
      const al = dd.lista.find(x => String(x.num) === String(inp.dataset.num));
      if (!al) return;
      al[inp.dataset.k] = inp.value.trim().slice(0, 70);
      adSave(dd);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); focar(idx + 1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); focar(idx + AD_FICHA_CAMPOS.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focar(idx - AD_FICHA_CAMPOS.length); }
    });
  });

  /* ♀/♂ de un toque, sin teclado: es como se llena esto en el teléfono,
     con 43 alumnos y una mano. Cicla vacío → niña → varón → vacío, y se
     repinta SOLO la casilla tocada: volver a dibujar la tabla entera
     perdería el desplazamiento y dejaría al maestro buscando dónde iba. */
  body.querySelectorAll('[data-sxnum]').forEach(b => b.addEventListener('click', () => {
    const dd = adLoad();
    const al = dd.lista.find(x => String(x.num) === String(b.dataset.sxnum));
    if (!al) return;
    const sig = al.sexo === 'F' ? 'M' : al.sexo === 'M' ? '' : 'F';
    if (sig) al.sexo = sig; else delete al.sexo;
    adSave(dd);
    b.className = 'ad-fi-sexo ad-fi-sx-' + (sig === 'F' ? 'f' : sig === 'M' ? 'm' : 'no');
    b.textContent = sig === 'F' ? '♀ Niña' : sig === 'M' ? '♂ Varón' : '·';
    b.setAttribute('aria-label', 'Sexo de ' + (adPrimerNombre(al.nombre) || ('#' + al.num)) + ': ' +
      (sig === 'F' ? 'niña' : sig === 'M' ? 'varón' : 'sin registrar') + '. Tocar para cambiar.');
    const cuenta = document.getElementById('ad-fi-sx-cuenta');
    if (cuenta) cuenta.textContent = adSexosTxt(adLoad());
  }));

  /* fecha de nacimiento: la edad se recalcula sola en su casilla */
  body.querySelectorAll('.ad-fi-fnac').forEach(inp => inp.addEventListener('change', () => {
    const dd = adLoad();
    const al = dd.lista.find(x => String(x.num) === String(inp.dataset.fnnum));
    if (!al) return;
    if (SL.fechaValida(inp.value)) al.fnac = inp.value; else delete al.fnac;
    adSave(dd);
    const ed = body.querySelector('[data-ednum="' + al.num + '"]');
    if (ed) ed.textContent = SL.edadTxt(al.fnac, adHoy()) || '·';
  }));
  /* estado: activo, ingreso, trasladado o desertor, con su fecha. Quien se
     va NO se borra: queda en la lista con sus notas, marcado y fuera de
     la matrícula final. */
  body.querySelectorAll('.ad-fi-estado').forEach(sel => sel.addEventListener('change', () => {
    const dd = adLoad();
    const al = dd.lista.find(x => String(x.num) === String(sel.dataset.esnum));
    if (!al) return;
    if (sel.value === 'activo') { delete al.estado; delete al.estadoF; }
    else { al.estado = sel.value; if (!al.estadoF) al.estadoF = adHoy(); }
    adSave(dd);
    renderAdmin();
  }));
  body.querySelectorAll('.ad-fi-estf').forEach(inp => inp.addEventListener('change', () => {
    const dd = adLoad();
    const al = dd.lista.find(x => String(x.num) === String(inp.dataset.efnum));
    if (!al) return;
    if (SL.fechaValida(inp.value)) al.estadoF = inp.value; else delete al.estadoF;
    adSave(dd);
  }));
  document.getElementById('ad-fi-sace').addEventListener('click', () => document.getElementById('ad-fi-sace-file').click());
  document.getElementById('ad-fi-sace-file').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    /* se lee aquí, en el teléfono: el CSV del SACE no viaja a ningún lado */
    const fr = new FileReader();
    fr.onload = () => adSaceImportarTexto(String(fr.result || ''));
    fr.onerror = () => toast('⚠️ No se pudo leer el archivo');
    fr.readAsText(file, 'utf-8');
  });
  document.getElementById('ad-fi-cuadro').addEventListener('click', () => adCuadroEdadesModal());
  document.getElementById('ad-fi-resumen').addEventListener('click', () => adResumenFinalModal());

  document.getElementById('ad-fi-pegar').addEventListener('click', () => {
    const box = document.getElementById('ad-fi-pegar-box');
    box.style.display = box.style.display === 'none' ? '' : 'none';
    if (box.style.display === '') document.getElementById('ad-fi-pegar-ta').focus();
  });
  document.getElementById('ad-fi-pegar-ok').addEventListener('click', () => {
    const txt = String(document.getElementById('ad-fi-pegar-ta').value || '');
    const dd = adLoad();
    let ok = 0, sinNum = 0;
    txt.split(/\r?\n/).forEach(linea => {
      if (!linea.trim()) return;
      const p = linea.split(/\t|;/).map(x => x.trim());
      const num = parseInt(String(p[0]).replace(/\D/g, ''), 10);
      const al = dd.lista.find(x => x.num === num);
      if (!num || !al) { sinNum++; return; }
      /* vacío NO borra: el maestro puede pegar solo la columna que le faltaba */
      AD_FICHA_CAMPOS.forEach((c, i) => { if (p[i + 1]) al[c.k] = p[i + 1].slice(0, 70); });
      ok++;
    });
    if (!ok) { estado('⚠️ No se pudo leer ninguna línea. Revisa que cada una empiece con el número de lista.'); return; }
    adSave(dd);
    renderAdmin();
    toast('🗂️ ' + ok + ' alumno(s) actualizados' + (sinNum ? ' · ' + sinNum + ' línea(s) sin número válido' : ''));
  });
  document.getElementById('ad-fi-faltan').addEventListener('click', () => {
    const faltan = AD_FICHA_CAMPOS.map(c => {
      const nums = (d.lista || []).filter(a => !String(a[c.k] || '').trim()).map(a => '#' + a.num);
      return nums.length ? c.et + ': ' + nums.join(', ') : '';
    }).filter(Boolean);
    const sinFn = (d.lista || []).filter(a => !SL.fechaValida(a.fnac)).map(a => '#' + a.num);
    if (sinFn.length) faltan.push('Fecha de nacimiento: ' + sinFn.join(', '));
    const malas = (d.lista || []).filter(a => String(a.idn || '').trim() && !SL.idnValida(a.idn)).map(a => '#' + a.num);
    if (malas.length) faltan.push('⚠ Identidad sin 13 dígitos: ' + malas.join(', '));
    estado(faltan.length ? '🔎 ' + faltan.join(' · ') : '✅ Todas las fichas están completas.');
  });
  document.getElementById('ad-fi-orden-az')?.addEventListener('click', () => {
    adOrdenarAlumnosAZ(() => renderAdmin());
  });
  document.getElementById('ad-fi-orden-gen')?.addEventListener('click', () => {
    adOrdenarPorGeneroModal(() => renderAdmin());
  });
  adTablaFilasArrastrar(body.querySelector('.ad-fi-mx'), () => renderAdmin());
  adUndoEnganchar(body);
}

/* ══════════════ 📥 IMPORTAR LISTA DEL SACE ══════════════
   El SACE manda en la estadística; Mi aula manda en el trabajo diario.
   Por eso importar NO reemplaza la lista: empareja cada fila del SACE con
   su ficha (por identidad y, si no, por nombre parecido), enseña TODO lo
   que cambiaría y guarda solo los grupos que el maestro deja marcados.
   Ninguna ficha se borra, ningún `num` cambia y d.notas ni se mira: la
   lógica vive en js/tools/sace-lista.js y la sonda
   _dev/verifica-sace-notas.js lo comprueba. */
const AD_SACE_CAMPO_ET = { idn: 'Identidad', nombre: 'Nombre', sexo: 'Sexo', fnac: 'Fecha de nacimiento' };
function adSaceValorTxt(campo, v) {
  if (!v) return '(vacío)';
  if (campo === 'sexo') return v === 'F' ? '♀ Niña' : v === 'M' ? '♂ Varón' : v;
  if (campo === 'fnac') return adFechaBonita(v);
  return v;
}

function adSaceImportarTexto(texto) {
  const SL = window.SaceLista;
  const leido = SL.parseCsv(texto);
  if (!leido.filas.length) {
    metasAlert('No encontré alumnos en el archivo. Debe ser un CSV con las columnas ' +
      '**num, identidad, nombre, sexo, fecha_nacimiento, edad_sace**.' +
      (leido.errores.length ? '\n\n' + leido.errores.join('\n') : ''), { icono: '📥', titulo: 'Lista del SACE' });
    return;
  }
  const d = adLoad();
  const plan = SL.emparejar(d.lista, leido.filas);
  const porNum = {}; d.lista.forEach(a => { porNum[a.num] = a; });
  const nombreDe = num => adEsc((porNum[num] || {}).nombre || ('#' + num));
  const idnMal = f => f.idn && !f.idnOk
    ? `<div class="ad-sace-aviso">⚠ Identidad del SACE sin 13 dígitos: <b>${adEsc(f.idn)}</b>. No se copia; revísala en el SACE.</div>` : '';
  const fnMal = f => f.fnacRaw && !f.fnacOk
    ? `<div class="ad-sace-aviso">⚠ Fecha de nacimiento que no se entiende: <b>${adEsc(f.fnacRaw)}</b>.</div>` : '';
  const conCambios = plan.pares.filter(p => p.cambios.length).length;
  const cuenta = c => plan.pares.filter(p => p.cambios.some(x => x.campo === c)).length;
  const reales = adAlumnosReales(d).length;

  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov ad-ver-ov';
  ov.innerHTML = `
    <div class="ad-gen-card ad-ver-card ad-sace-card" role="dialog" aria-modal="true" aria-labelledby="ad-sace-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-sace-tit">📥 Lista del SACE: revisa antes de guardar</div>
        <button type="button" class="ad-gen-close" id="ad-sace-x" aria-label="Cerrar">✕</button>
      </div>
      <div class="ad-sace-cuerpo">
      <div class="ad-gen-hint">El SACE trae <b>${leido.filas.length}</b> alumno(s); en Mi aula tienes <b>${reales}</b> ficha(s).
        Todavía <b>no se ha guardado nada</b>. Revisa cada grupo, deja marcado lo que quieres y toca
        <b>Guardar lo marcado</b>. No se borra ninguna ficha ni ninguna nota.
        ${leido.errores.length ? '<br>⚠ ' + leido.errores.map(adEsc).join('<br>⚠ ') : ''}</div>

      <section class="ad-sace-grupo">
        <label class="ad-sace-gchk"><input type="checkbox" id="ad-sace-g1" checked>
          <span><b>✓ Fichas que se emparejan con el SACE (${plan.pares.length})</b><br>
          Se marcan «En lista oficial SACE». ${conCambios} traen datos distintos.</span></label>
        <div class="ad-sace-campos" id="ad-sace-campos">
          <span>Copiar del SACE:</span>
          <label><input type="checkbox" data-campo="fnac" checked> Fecha de nacimiento (${cuenta('fnac')})</label>
          <label><input type="checkbox" data-campo="sexo" checked> Sexo (${cuenta('sexo')})</label>
          <label><input type="checkbox" data-campo="idn" checked> Identidad (${cuenta('idn')})</label>
          <label><input type="checkbox" data-campo="nombre"> Nombre (${cuenta('nombre')})</label>
        </div>
        <p class="ad-sace-nota">La fecha de nacimiento y el sexo oficiales son los del SACE: si la ficha decía otra cosa, gana el SACE.
          El nombre viene sin marcar porque el SACE lo escribe a su manera; márcalo si quieres el nombre oficial en la ficha.</p>
        ${plan.pares.length ? `<div class="ad-ver-prev-tbl"><table class="ad-mx ad-ver-mx ad-sace-tbl">
          <thead><tr><th>Es la misma</th><th style="text-align:left">Ficha</th><th style="text-align:left">En el SACE</th><th style="text-align:left">Qué cambia</th></tr></thead>
          <tbody>${plan.pares.map((p, i) => `<tr>
            <td><label class="ad-sace-rchk"><input type="checkbox" data-par="${i}" checked aria-label="Confirmar que la ficha #${p.num} es ${adEsc(p.f.nombre)}"></label></td>
            <td style="text-align:left">#${p.num} ${nombreDe(p.num)}</td>
            <td style="text-align:left">${p.f.num ? 'Nº ' + p.f.num + ' · ' : ''}${adEsc(p.f.nombre)}<br><small>${p.por === 'identidad' ? '✓ por identidad'
              : p.por === 'nombre' ? '≈ por nombre parecido (' + Math.round(p.parecido * 100) + ' %): revisa que sea la misma persona'
              : p.por === 'identidad parecida' ? '≈ identidad casi igual y una palabra del nombre: revisa que sea la misma persona'
              : p.por === 'fecha y nombre' ? '≈ misma fecha de nacimiento y una palabra del nombre: revisa'
              : '≈ solo coincide parte del nombre y es la única ficha posible: revisa'}</small></td>
            <td style="text-align:left">${p.cambios.length ? p.cambios.map(c =>
              `<div data-cc="${c.campo}">${AD_SACE_CAMPO_ET[c.campo]}: ${adEsc(adSaceValorTxt(c.campo, c.antes))} → <b>${adEsc(adSaceValorTxt(c.campo, c.despues))}</b></div>`).join('') : 'Nada: ya coincide'}
              ${idnMal(p.f)}${fnMal(p.f)}</td>
          </tr>`).join('')}</tbody></table></div>` : ''}
      </section>

      <section class="ad-sace-grupo">
        <label class="ad-sace-gchk"><input type="checkbox" id="ad-sace-g2"${plan.sinFicha.length ? '' : ' disabled'}>
          <span><b>➕ Alumnos del SACE sin ficha en Mi aula (${plan.sinFicha.length})</b><br>
          Si ya tiene ficha pero con otro nombre o identidad, elígela en <b>«Es la ficha»</b>: queda en la
          lista oficial con sus notas. Si lo marcas, los que no elijas se agregan al final con su número
          nuevo y su clave de familia.</span></label>
        ${plan.sinFicha.length ? `<div class="ad-ver-prev-tbl"><table class="ad-mx ad-ver-mx ad-sace-tbl">
          <thead><tr><th>Agregar</th><th style="text-align:left">En el SACE</th><th style="text-align:left">Datos</th><th>Es la ficha</th></tr></thead>
          <tbody>${plan.sinFicha.map((f, i) => `<tr>
            <td><label class="ad-sace-rchk"><input type="checkbox" data-nuevo="${i}" checked aria-label="Agregar a ${adEsc(f.nombre)}"></label></td>
            <td style="text-align:left">${f.num ? 'Nº ' + f.num + ' · ' : ''}${adEsc(f.nombre)}</td>
            <td style="text-align:left">${adEsc(f.idn || 'sin identidad')} · ${adEsc(adSaceValorTxt('sexo', f.sexo))} · ${adEsc(adSaceValorTxt('fnac', f.fnac))}
              ${idnMal(f)}${fnMal(f)}</td>
            <td><select class="ad-fi-estado" data-mano="${i}" aria-label="¿${adEsc(f.nombre)} ya tiene ficha?">
              <option value="">No tiene ficha</option>
              ${plan.sinSace.map(num => `<option value="${num}">#${num} ${nombreDe(num)}</option>`).join('')}
            </select></td>
          </tr>`).join('')}</tbody></table></div>` : ''}
      </section>

      <section class="ad-sace-grupo">
        <label class="ad-sace-gchk"><input type="checkbox" id="ad-sace-g3"${plan.sinSace.length ? ' checked' : ' disabled'}>
          <span><b>⚠ Fichas sin alumno en el SACE (${plan.sinSace.length})</b><br>
          Posibles trasladados o desertores. Se marcan «Fuera de la lista oficial»: siguen en Mi aula con sus notas,
          pero no entran en ningún cuadro.</span></label>
        ${plan.sinSace.length ? `<div class="ad-ver-prev-tbl"><table class="ad-mx ad-ver-mx ad-sace-tbl">
          <thead><tr><th style="text-align:left">Ficha</th><th>Estado</th></tr></thead>
          <tbody>${plan.sinSace.map(num => `<tr>
            <td style="text-align:left">#${num} ${nombreDe(num)}</td>
            <td><select class="ad-fi-estado" data-fuera="${num}" aria-label="Estado de la ficha #${num}">
              <option value="">Sin cambiar estado</option>
              <option value="trasladado"${porNum[num].estado === 'trasladado' ? ' selected' : ''}>Trasladado</option>
              <option value="desertor"${porNum[num].estado === 'desertor' ? ' selected' : ''}>Desertor</option>
            </select></td>
          </tr>`).join('')}</tbody></table></div>` : ''}
      </section>
      </div>

      <div class="ad-gen-foot ad-sace-pie">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-sace-no">Cancelar</button>
        <button type="button" class="pa-generate-btn" id="ad-sace-si">✅ Guardar lo marcado</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const cerrar = () => ov.remove();
  ov.querySelector('#ad-sace-x').addEventListener('click', cerrar);
  ov.querySelector('#ad-sace-no').addEventListener('click', cerrar);

  /* el casillero del grupo manda sobre sus filas: desmarcado, el grupo
     entero se queda como estaba */
  const grupo = (gid, sel) => {
    const g = ov.querySelector(gid);
    const sync = () => ov.querySelectorAll(sel).forEach(x => { x.disabled = !g.checked; });
    g.addEventListener('change', sync); sync();
  };
  grupo('#ad-sace-g1', '[data-par], [data-campo]');
  grupo('#ad-sace-g2', '[data-nuevo]');
  grupo('#ad-sace-g3', '[data-fuera]');

  ov.querySelector('#ad-sace-si').addEventListener('click', () => {
    const g1 = ov.querySelector('#ad-sace-g1').checked;
    const g2 = ov.querySelector('#ad-sace-g2').checked;
    const g3 = ov.querySelector('#ad-sace-g3').checked;
    const campos = {};
    if (g1) ov.querySelectorAll('[data-campo]').forEach(x => { campos[x.dataset.campo] = x.checked; });
    const estados = {};
    ov.querySelectorAll('[data-fuera]').forEach(x => { if (x.value) estados[x.dataset.fuera] = x.value; });
    /* emparejados a mano: una ficha no puede ser de dos alumnos */
    const manuales = [...ov.querySelectorAll('[data-mano]')].filter(x => x.value)
      .map(x => ({ i: +x.dataset.mano, num: +x.value }));
    if (new Set(manuales.map(m => m.num)).size !== manuales.length) {
      toast('⚠️ Elegiste la misma ficha para dos alumnos del SACE. Corrígelo antes de guardar.'); return;
    }
    const conf = {
      manuales,
      pares: g1 ? [...ov.querySelectorAll('[data-par]')].filter(x => x.checked).map(x => +x.dataset.par) : [],
      campos,
      nuevos: g2 ? [...ov.querySelectorAll('[data-nuevo]')].filter(x => x.checked).map(x => +x.dataset.nuevo) : [],
      fuera: g3 ? plan.sinSace.slice() : [],
      estados,
      fecha: adHoy()
    };
    if (!conf.pares.length && !conf.nuevos.length && !conf.fuera.length && !conf.manuales.length) { toast('No hay nada marcado para guardar'); return; }
    adUndoGuardar('Importar lista del SACE');
    const dd = adLoad();
    /* el plan se rehace sobre lo guardado AHORA: si otro equipo sincronizó
       mientras el maestro revisaba, los índices tienen que seguir valiendo */
    const plan2 = SL.emparejar(dd.lista, leido.filas);
    if (JSON.stringify(plan2.pares.map(p => [p.f.i, p.num])) !== JSON.stringify(plan.pares.map(p => [p.f.i, p.num]))) {
      cerrar(); toast('⚠️ La lista cambió mientras revisabas. Vuelve a importar el archivo.'); return;
    }
    const res = SL.aplicar(dd, plan2, conf);
    const alta = Date.now();
    res.nuevas.forEach(num => {
      adClaveFamilia(dd.id, num);
      const n = dd.lista.find(a => a.num === num); if (n) n.alta = alta;
    });
    if (!adSave(dd)) { cerrar(); return; }   /* adSave ya avisó que no cupo */
    cerrar();
    renderAdmin();
    toast('📥 SACE: ' + res.marcadas + ' en lista oficial' + (res.actualizadas ? ' · ' + res.actualizadas + ' actualizadas' : '') +
      (res.nuevas.length ? ' · ' + res.nuevas.length + ' nuevas' : '') + (res.fuera ? ' · ' + res.fuera + ' fuera de la lista oficial' : ''));
  });
}

/* ══════════════ 📊 MATRÍCULA FINAL POR EDADES Y GÉNERO ══════════════
   El cuadro que pide la estadística de fin de año. Cuenta SOLO la
   matrícula final: alumnos de la lista oficial del SACE que no se
   trasladaron ni desertaron. La edad es la cumplida a la FECHA DE CORTE;
   por defecto, la fecha del informe (hoy). Si el distrito pide otra, el
   maestro la escribe y se guarda en el grupo (d.edadCorte). */
function adCuadroEdadesHtml(c) {
  return `<table class="ad-mx ad-cuadro-ed">
    <thead><tr><th>Edad</th><th>Niñas</th><th>Varones</th><th>Total</th></tr></thead>
    <tbody>${c.filas.length ? c.filas.map(r => `<tr><td>${r.edad} años</td><td>${r.F}</td><td>${r.M}</td><td><b>${r.total}</b></td></tr>`).join('')
      : '<tr><td colspan="4">Sin datos todavía</td></tr>'}</tbody>
    <tfoot><tr><td><b>Total</b></td><td><b>${c.total.F}</b></td><td><b>${c.total.M}</b></td><td><b>${c.total.total}</b></td></tr></tfoot>
  </table>`;
}
function adCuadroNotas(c, d) {
  const n = [];
  const nom = num => { const a = (d.lista || []).find(x => x.num === num); return '#' + num + (a ? ' ' + adPrimerNombre(a.nombre) : ''); };
  if (c.sinFecha.length) n.push('⚠ Sin fecha de nacimiento (no entran en el cuadro): ' + c.sinFecha.map(nom).join(', ') + '.');
  if (c.sinSexo.length) n.push('⚠ Sin sexo registrado (no entran en el cuadro): ' + c.sinSexo.map(nom).join(', ') + '.');
  if (c.fueraOficial) n.push(c.fueraOficial + ' ficha(s) de Mi aula fuera de la lista oficial del SACE: no se cuentan.');
  if (c.trasladados.length) n.push('Trasladados (no se cuentan): ' + c.trasladados.map(a => nom(a.num) + (a.estadoF ? ' (' + adFechaBonita(a.estadoF) + ')' : '')).join(', ') + '.');
  if (c.desertores.length) n.push('Desertores (no se cuentan): ' + c.desertores.map(a => nom(a.num) + (a.estadoF ? ' (' + adFechaBonita(a.estadoF) + ')' : '')).join(', ') + '.');
  if (c.ingresos.length) n.push('Ingresos durante el año (sí se cuentan si están en el SACE): ' + c.ingresos.map(a => nom(a.num) + (a.estadoF ? ' (' + adFechaBonita(a.estadoF) + ')' : '')).join(', ') + '.');
  return n;
}

function adCuadroEdadesModal() {
  const SL = window.SaceLista;
  const d = adLoad();
  const corte = () => (SL.fechaValida(adLoad().edadCorte) ? adLoad().edadCorte : adHoy());
  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov ad-ver-ov';
  ov.innerHTML = `
    <div class="ad-gen-card ad-ver-card" role="dialog" aria-modal="true" aria-labelledby="ad-ced-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-ced-tit">📊 Matrícula final por edades y género</div>
        <button type="button" class="ad-gen-close" id="ad-ced-x" aria-label="Cerrar">✕</button>
      </div>
      ${SL.hayImportacion(d) ? '' : `<div class="ad-sace-aviso">⚠ Aún no has importado la lista del SACE. La estadística cuenta
        solo a los alumnos de la lista oficial: toca <b>📥 Importar lista del SACE</b> primero.</div>`}
      <label class="ad-ced-corte">Edad cumplida al
        <input type="date" id="ad-ced-fecha" value="${corte()}"></label>
      <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-ced-hoy">Usar la fecha del informe (hoy)</button>
      <div id="ad-ced-cuerpo"></div>
      <div class="ad-gen-foot">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-ced-no">Cerrar</button>
        <button type="button" class="pa-generate-btn" id="ad-ced-print">🖨️ Imprimir</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const pintar = () => {
    const dd = adLoad();
    const c = SL.cuadroEdades(dd, corte());
    ov.querySelector('#ad-ced-cuerpo').innerHTML =
      `<p class="ad-gen-hint">Matrícula final: <b>${c.matricula}</b> alumno(s) de la lista oficial del SACE,
        edad al <b>${adFechaBonita(c.corte)}</b>.</p>` + adCuadroEdadesHtml(c) +
      adCuadroNotas(c, dd).map(t => '<p class="ad-sace-nota">' + adEsc(t) + '</p>').join('');
  };
  pintar();
  const fin = () => ov.remove();
  ov.querySelector('#ad-ced-x').addEventListener('click', fin);
  ov.querySelector('#ad-ced-no').addEventListener('click', fin);
  ov.querySelector('#ad-ced-fecha').addEventListener('change', e => {
    const dd = adLoad();
    if (SL.fechaValida(e.target.value) && e.target.value !== adHoy()) dd.edadCorte = e.target.value; else delete dd.edadCorte;
    adSave(dd); pintar();
  });
  ov.querySelector('#ad-ced-hoy').addEventListener('click', () => {
    const dd = adLoad(); delete dd.edadCorte; adSave(dd);
    ov.querySelector('#ad-ced-fecha').value = adHoy(); pintar();
  });
  ov.querySelector('#ad-ced-print').addEventListener('click', () => adPrintCuadroEdades(adLoad(), corte()));
}

/* Una hoja carta: encabezado, el cuadro y las notas de quién no entra. */
function adPrintCuadroEdades(d, corte) {
  const SL = window.SaceLista;
  const c = SL.cuadroEdades(d, corte);
  const bol = d.boleta || {};
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc('Matrícula final por edades y género · ' + adGradoSeccion(d.grado, d.seccion))}</title>
<style>
  @page { size: letter portrait; margin: 14mm; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 13px; margin: 0; }
  .hoja { max-height: 248mm; overflow: hidden; }
  h1 { font-size: 16px; text-align: center; margin: 0 0 2px; }
  h2 { font-size: 14px; text-align: center; margin: 0 0 10px; font-weight: 700; }
  .datos { display: flex; flex-wrap: wrap; gap: 4px 18px; margin-bottom: 10px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #555; padding: 5px 8px; text-align: center; }
  th { background: #e8edf5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tfoot td { font-weight: 800; border-top: 2px solid #111; }
  p.nota { margin: 4px 0; font-size: 12px; }
  .firmas { display: flex; gap: 40px; margin-top: 40px; }
  .firmas div { flex: 1; text-align: center; border-top: 1px solid #111; padding-top: 4px; }
</style></head><body><section class="hoja">
  <h1>${adEsc((d.escuela || 'Centro Educativo').toUpperCase())}</h1>
  <h2>MATRÍCULA FINAL POR EDADES Y GÉNERO</h2>
  <div class="datos">
    <span><b>Grado y sección:</b> ${adEsc(adGradoSeccion(d.grado, d.seccion) || '—')}</span>
    <span><b>Docente:</b> ${adEsc(bol.docente || '—')}</span>
    <span><b>Año lectivo:</b> ${adEsc(bol.anio || String(new Date().getFullYear()))}</span>
    <span><b>Edad cumplida al:</b> ${adEsc(adFechaBonita(c.corte))}</span>
  </div>
  ${adCuadroEdadesHtml(c)}
  <p class="nota">Cuenta los ${c.matricula} alumno(s) de la matrícula final según la lista oficial del SACE${
    d.saceImport && d.saceImport.f ? ' importada el ' + adEsc(adFechaBonita(d.saceImport.f)) : ''}.</p>
  ${adCuadroNotas(c, d).map(t => '<p class="nota">' + adEsc(t) + '</p>').join('')}
  <div class="firmas"><div>${adEsc(bol.docente || '')}<br>Docente de grado</div><div>${adEsc(bol.director || '')}<br>Director(a)</div></div>
</section><script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script></body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ 📋 RESUMEN FINAL DE RESULTADOS POR GRADO ══════════════
   El formulario de fin de año con sus cinco cuadros, contado solo. Las
   cuentas viven en js/tools/cuadros-sace.js (ResumenSace) y aquí solo se
   pintan, se imprimen y se bajan a Excel. Es SOLO LECTURA: lo único que
   se guarda es el texto del Período, y solo si el maestro lo cambia.
   Cuenta únicamente a quien está «En lista oficial SACE». */
function adResumenCorte(d) {
  const SL = window.SaceLista;
  return SL.fechaValida(d.edadCorte) ? d.edadCorte : adHoy();
}
function adResumenPeriodo(d) {
  const bol = d.boleta || {};
  return String(d.resumenPeriodo || '').trim() || ('Año lectivo ' + (bol.anio || new Date().getFullYear()));
}
function adResumenDatos(d) {
  const r = ResumenSace.calcular(d, { corte: adResumenCorte(d), SL: window.SaceLista });
  const cs = ResumenSace.cuadros(r, adGradoSeccion(d.grado, d.seccion) || 'Grupo');
  return { r, cs };
}
/* Avisos en palabras de maestro. `grave` = algo que cambia los números
   y que conviene arreglar antes de entregar. */
function adResumenAvisos(r, d) {
  const SL = window.SaceLista;
  const nom = a => '#' + a.num + ' ' + (String(a.nombre || '').trim() || 'Sin nombre');
  const fecha = a => a.estadoF ? ' (' + adFechaBonita(a.estadoF) + ')' : '';
  const av = [];
  const A = r.avisos;
  if (!SL.hayImportacion(d)) av.push({ grave: true, t: 'Aún no has importado la lista del SACE: los cuadros cuentan solo a los alumnos «En lista oficial SACE». Toca 📥 Importar lista del SACE en Identidad y contactos.' });
  if (!r.cuadra) {
    av.push({ grave: true, t: 'La matrícula final no cuadra: inicial ' + r.mov.inicial.T + ' + ingresos ' + r.mov.ingresos.T +
      ' − traslados ' + r.mov.traslados.T + ' − desertores ' + r.mov.desertores.T + ' = ' + r.formula.T +
      ', pero el conteo de activos e ingresos da ' + r.mov.final.T + '.' +
      (A.raros.length ? ' Revisa el Estado de: ' + A.raros.map(nom).join(', ') + '.' : '') });
  }
  if (A.sinNota.length) {
    av.push({ grave: true, t: 'Sin nota completa (' + A.sinNota.length + '): no entran en Evaluados, ni en la escala, ni en Aprobados o Reprobados; ' +
      'en cada asignatura cuentan solo donde sí tienen nota final. ' +
      A.sinNota.map(x => nom(x.a) + ': ' + (x.faltan.length
        ? x.faltan.map(f => f.asig + ' (falta' + (f.parciales.length > 1 ? 'n' : '') + ' ' + f.parciales.join(', ') + ')').join(', ')
        : 'no hay asignaturas con notas')).join(' · ') + '.' });
  }
  if (A.sinSexo.length) av.push({ grave: true, t: 'Sin sexo registrado (cuentan en T, no en N ni en V): ' + A.sinSexo.map(nom).join(', ') + '.' });
  if (A.sinFecha.length) av.push({ grave: true, t: 'Sin fecha de nacimiento (no entran en el cuadro de edades): ' + A.sinFecha.map(nom).join(', ') + '.' });
  if (A.menores.length) av.push({ grave: true, t: 'Menores de 6 años a la fecha de corte (no entran en el cuadro de edades): ' + A.menores.map(nom).join(', ') + '.' });
  if (A.fueraSace.length) av.push({ t: A.fueraSace.length + ' ficha(s) fuera de la lista oficial del SACE, no se cuentan: ' + A.fueraSace.map(nom).join(', ') + '.' });
  if (A.ingresos.length) av.push({ t: 'Ingresos: ' + A.ingresos.map(a => nom(a) + fecha(a)).join(', ') + '.' });
  if (A.traslados.length) av.push({ t: 'Traslados: ' + A.traslados.map(a => nom(a) + fecha(a)).join(', ') + '.' });
  if (A.desertores.length) av.push({ t: 'Desertores: ' + A.desertores.map(a => nom(a) + fecha(a)).join(', ') + '.' });
  if (A.sinColumna.length) av.push({ t: 'Sin columna en Notas SACE (va con «·»): ' + A.sinColumna.map(x => x.et).join(', ') + '.' });
  if (A.vacias.length) av.push({ t: 'Columna sin ninguna nota en el año, se toma como no impartida (va con «·»): ' + A.vacias.map(x => x.et).join(', ') + '.' });
  if (A.sobran.length) av.push({ t: 'Columnas de Notas SACE que no están en el formulario (no se cuentan): ' + A.sobran.join(', ') + '.' });
  return av;
}
function adResumenEncabezado(d, r) {
  const bol = d.boleta || {};
  return [
    ['Grado y sección', adGradoSeccion(d.grado, d.seccion) || '·'],
    ['Docente', bol.docente || '·'],
    ['Centro', String(d.escuela || '').trim() || '·'],
    ['Período', adResumenPeriodo(d)],
    ['Total según SACE', r.totalSace + ' alumno' + (r.totalSace === 1 ? '' : 's')]
  ];
}

function adResumenFinalModal() {
  if (!window.ResumenSace || !window.SaceLista) { toast('⚠️ Cargando… intenta de nuevo'); return; }
  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov ad-ver-ov';
  ov.innerHTML = `
    <div class="ad-gen-card ad-ver-card rf-card" role="dialog" aria-modal="true" aria-labelledby="ad-rf-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-rf-tit">📋 Resumen final de resultados por grado</div>
        <button type="button" class="ad-gen-close" id="ad-rf-x" aria-label="Cerrar">✕</button>
      </div>
      <div class="ad-ver-body">
        <label class="ad-ced-corte">Período
          <input type="text" id="ad-rf-periodo" class="pa-inp-field" maxlength="60" value="${adEsc(adResumenPeriodo(adLoad()))}"></label>
        <div id="ad-rf-cuerpo"></div>
      </div>
      <div class="ad-gen-foot">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-rf-no">Cerrar</button>
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-rf-xlsx">📥 Descargar Excel</button>
        <button type="button" class="pa-generate-btn" id="ad-rf-print">🖨️ Imprimir / PDF</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const pintar = () => {
    const d = adLoad();
    const { r, cs } = adResumenDatos(d);
    const enc = adResumenEncabezado(d, r);
    const av = adResumenAvisos(r, d);
    ov.querySelector('#ad-rf-cuerpo').innerHTML =
      `<dl class="rf-enc">${enc.map(x => `<div><dt>${adEsc(x[0])}:</dt> <dd>${adEsc(x[1])}</dd></div>`).join('')}</dl>
      <p class="ad-sace-nota">Matrícula final: <b>${r.mov.final.T}</b> · Evaluados: <b>${r.evaluados.T}</b> ·
        Edad cumplida al <b>${adEsc(adFechaBonita(r.corte))}</b> (la del cuadro de edades).
        Escala: Inicial hasta 69 · Básico 70–79 · Avanzado 80–90 · Excelente 91–100. A = aprobado (70 o más), NA = no aprobado.</p>
      ${av.map(x => `<p class="${x.grave ? 'ad-sace-aviso' : 'ad-sace-nota'}">${x.grave ? '⚠ ' : 'ℹ '}${adEsc(x.t)}</p>`).join('')}
      ${cs.map(c => `<h3 class="rf-titulo">${adEsc(c.titulo)}</h3><div class="rf-scroll">${ResumenSace.tablaHtml(c)}</div>`).join('')}
      <h3 class="rf-titulo">📈 Gráficos y estadística descriptiva</h3>
      <style>${ResumenSace.GRAF_CSS}</style>
      <div class="rf-papel">${ResumenSace.graficosHtml(r)}</div>`;
  };
  pintar();
  const fin = () => ov.remove();
  ov.querySelector('#ad-rf-x').addEventListener('click', fin);
  ov.querySelector('#ad-rf-no').addEventListener('click', fin);
  ov.querySelector('#ad-rf-periodo').addEventListener('change', e => {
    const dd = adLoad();
    const v = String(e.target.value || '').trim();
    const def = 'Año lectivo ' + ((dd.boleta || {}).anio || new Date().getFullYear());
    if (v && v !== def) dd.resumenPeriodo = v.slice(0, 60); else delete dd.resumenPeriodo;
    adSave(dd); pintar();
  });
  ov.querySelector('#ad-rf-print').addEventListener('click', () => adPrintResumenFinal(adLoad()));
  ov.querySelector('#ad-rf-xlsx').addEventListener('click', () => adResumenFinalExcel(adLoad()));
}

/* Dos hojas carta HORIZONTALES (los cuadros llevan hasta 37 columnas; en
   vertical serían ilegibles):
   1. El formulario oficial, con la misma cara que las boletas: los dos
      logos, el nombre del centro en letra de libro, encabezados azules y
      la fila TOTAL en dorado. Solo el formulario y las firmas: cabe entero.
   2. Gráficos y estadística descriptiva, sacados del MISMO cálculo, más
      los avisos para quien revisa (quién no entró y por qué). */
function adPrintResumenFinal(d) {
  const { r, cs } = adResumenDatos(d);
  const enc = adResumenEncabezado(d, r);
  const av = adResumenAvisos(r, d);
  const bol = d.boleta || {};
  const centro = String(d.escuela || '').trim() || 'Centro Educativo';
  const gs = adGradoSeccion(d.grado, d.seccion) || '';
  let logoSec = d.logoSec || '';
  if (!logoSec) {
    try { logoSec = new URL('img/logo-secretaria.png', location.href).href; } catch (_) { logoSec = 'img/logo-secretaria.png'; }
  }
  const cabeza = sub => `<header class="rf-head">
      <div class="rf-logo">${d.logo ? `<img src="${d.logo}" alt="">` : ''}</div>
      <div class="rf-mid">
        <div class="rf-centro">${adEsc(centro.toUpperCase())}</div>
        <div class="rf-doc">${adEsc(sub)}</div>
        <div class="rf-anio">${adEsc(adResumenPeriodo(d))}</div>
      </div>
      <div class="rf-logo der"><img src="${logoSec}" alt="Secretaría de Educación"></div>
    </header>`;
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc('Resumen final de resultados · ' + gs)}</title>
<style>
  @page { size: letter landscape; margin: 8mm 9mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root { --tinta:#0f2350; --azul:#1e3a7c; --oro:#a8791a; --linea:#d4dbe6; --suave:#f4f7fc; }
  body { font-family: Arial, Helvetica, sans-serif; color: var(--tinta); font-size: 10px; }
  .hoja { height: 198mm; display: flex; flex-direction: column; overflow: hidden; page-break-after: always; break-after: page; }
  .hoja:last-child { page-break-after: auto; break-after: auto; }
  .rf-head { display: flex; align-items: center; gap: 12px; padding-bottom: 5px; border-bottom: 2.5px solid var(--azul); }
  .rf-logo { flex: 0 0 150px; height: 40px; display: flex; align-items: center; }
  .rf-logo.der { justify-content: flex-end; }
  .rf-logo img { max-width: 150px; max-height: 40px; object-fit: contain; }
  .rf-mid { flex: 1; text-align: center; }
  .rf-centro { font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: 700; letter-spacing: .3px; }
  .rf-doc { font-family: Georgia, serif; font-size: 12px; font-weight: 700; color: var(--oro); letter-spacing: .8px; margin-top: 1px; }
  .rf-anio { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: var(--azul); margin-top: 2px; }
  .enc { display: flex; gap: 6px; margin: 5px 0 2px; }
  .enc > div { flex: 1; background: var(--suave); border: 1px solid var(--linea); border-radius: 6px; padding: 2px 7px; }
  .enc > div:nth-child(2), .enc > div:nth-child(3) { flex: 1.6; }
  .enc span { display: block; font-size: 7px; letter-spacing: .5px; text-transform: uppercase; color: #7286a8; }
  .enc b { font-size: 10.5px; }
  h3 { font-family: Georgia, serif; font-size: 10.5px; font-weight: 700; color: var(--azul); margin: 8px 0 3px; letter-spacing: .2px; }
  h3 i { display: inline-block; width: 15px; height: 15px; line-height: 15px; border-radius: 50%; background: var(--azul); color: #fff;
    font-style: normal; font-family: Arial, sans-serif; font-size: 9px; text-align: center; margin-right: 5px; }
  table.rf-tabla { border-collapse: collapse; width: 100%; table-layout: fixed; }
  .rf-tabla th, .rf-tabla td { border: 1px solid #c7cfdd; text-align: center; padding: 3.2px 1px; font-size: 10px; line-height: 1.15; }
  .rf-tabla thead tr:first-child th { background: var(--azul); color: #fff; font-size: 7.6px; font-weight: 700; letter-spacing: .2px; padding: 2.5px 1px; }
  .rf-tabla thead tr:first-child th small { font-size: 7px; font-weight: 400; color: #d8e2f4; }
  .rf-tabla thead th.rf-sub { background: #eaf0fa; color: var(--tinta); font-size: 8px; font-weight: 800; }
  .rf-tabla th.rf-primera { width: 21mm; background: var(--tinta) !important; }
  .rf-tabla tbody th { background: #eaf0fa; font-weight: 800; text-align: left; padding-left: 5px; }
  .rf-tabla tbody td { font-weight: 600; }
  .rf-tabla .rf-ini { border-left: 1.8px solid var(--azul); }
  .rf-tabla tr.rf-total th, .rf-tabla tr.rf-total td { background: #fdf6e3; color: #8a5a00; font-weight: 800; border-top: 1.6px solid #c9a24a; }
  .rf-tabla tr.rf-total th { background: #f7edc9; }
  .pie { margin-top: auto; }
  p.nota { font-size: 8px; color: #55637d; margin-top: 4px; line-height: 1.3; }
  .firmas { display: flex; gap: 60px; margin: 18px 40px 0; font-size: 9.5px; }
  .firmas div { flex: 1; text-align: center; border-top: 1px solid var(--tinta); padding-top: 3px; }
  .firmas small { color: #55637d; }
  ${ResumenSace.GRAF_CSS}
  .hoja .rf2 { margin-top: 6px; }
</style></head><body>
<section class="hoja">
  ${cabeza('RESUMEN FINAL DE RESULTADOS POR GRADO')}
  <div class="enc">${enc.map(x => `<div><span>${adEsc(x[0])}</span><b>${adEsc(x[1])}</b></div>`).join('')}</div>
  ${cs.map((c, i) => `<h3><i>${i + 1}</i>${adEsc(c.titulo)}</h3>${ResumenSace.tablaHtml(c)}`).join('')}
  <div class="pie">
    <p class="nota">N = niñas · V = varones · T = total · A = aprobado (70 o más) · NA = no aprobado · Escala: I = Inicial (hasta 69),
      B = Básico (70–79), A = Avanzado (80–90), E = Excelente (91–100) · «·» = no se imparte. Cuenta solo a los alumnos en la lista
      oficial del SACE${d.saceImport && d.saceImport.f ? ' (importada el ' + adEsc(adFechaBonita(d.saceImport.f)) + ')' : ''}.
      Nota final = promedio de los cuatro parciales, redondeado. Edad cumplida al ${adEsc(adFechaBonita(r.corte))}.</p>
    <div class="firmas"><div>${adEsc(bol.docente || '')}<br><small>Docente de grado</small></div><div>${adEsc(bol.director || '')}<br><small>Director(a)</small></div></div>
  </div>
</section>
<section class="hoja">
  ${cabeza('GRÁFICOS Y ESTADÍSTICA DESCRIPTIVA · ' + gs)}
  ${ResumenSace.graficosHtml(r, av)}
</section>
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script></body></html>`;
  adPrintAbrir(html);
}

/* El mismo formulario en .xlsx, para pegarlo en el consolidado del
   centro. Se arma en el teléfono; no viaja a ningún lado. */
async function adResumenFinalExcel(d) {
  try {
    const { r, cs } = adResumenDatos(d);
    const enc = adResumenEncabezado(d, r);
    const notas = adResumenAvisos(r, d).map(x => (x.grave ? '⚠ ' : '') + x.t);
    const bytes = ResumenSace.xlsx(cs, { titulo: 'RESUMEN FINAL DE RESULTADOS POR GRADO', datos: enc, notas });
    /* nombre sin «º» ni tildes: dan problemas al guardar y compartir */
    const limpio = s => String(s || '').normalize('NFD').replace(/[^\w-]/g, '') || 'x';
    const nombre = 'resumen-final-' + limpio(d.grado) + '-' + limpio(d.seccion) + '.xlsx';
    const tipo = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const cap = window.Capacitor;
    if (cap && cap.isNativePlatform?.() && cap.Plugins?.Filesystem && cap.Plugins?.Share) {
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      const res = await cap.Plugins.Filesystem.writeFile({ path: nombre, data: btoa(bin), directory: 'CACHE' });
      await cap.Plugins.Share.share({ url: res.uri, dialogTitle: 'Guardar / Compartir el resumen final' });
    } else {
      const url = URL.createObjectURL(new Blob([bytes], { type: tipo }));
      const a = document.createElement('a');
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    toast('📥 Excel listo: ' + nombre);
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    toast('⚠️ No se pudo armar el Excel');
  }
}

/* ══════════════ 📄 EXPEDIENTE DEL AULA ══════════════
   UN botón que arma TODO lo del grupo en un solo documento: lista, asistencia,
   colectas con sus cuentas, gastos de bolsillo, controles, novedades, notas de
   cada parcial y comunicados. El maestro le da a Imprimir y lo guarda como PDF
   para su portafolio o lo lleva impreso a dirección.

   No se usa librería de PDF: el navegador ya sabe hacer PDF desde una hoja
   imprimible, y meter 500 KB de librería a una app que tiene que abrir sin
   señal en teléfonos modestos no se paga. Cada sección arranca en página nueva
   y los encabezados de tabla se repiten al cortar.

   Las CLAVES DE FAMILIA no van: son para entregarlas una por una y un legajo
   que se enseña en dirección no es lugar para ellas. Para eso está
   «🖨️ Tiras de claves». */
/* Este documento se imprime CADA MES y es lo que queda al cerrar el año, así que
   la impresión no es un detalle:
   · HORIZONTAL (apaisado): la hoja de alumnos lleva 7 columnas y la de notas
     hasta 13; en vertical se aplastan y se vuelven ilegibles.
   · table-layout fijo con anchos por columna: la tabla se ve IGUAL en todas las
     páginas, no baila según el contenido de cada bloque.
   · Ninguna fila se parte a la mitad, ningún título queda solo al pie de una
     página, y los encabezados se repiten al cortar llevando además el rótulo de
     qué tabla es y de qué grupo: cada hoja suelta se identifica sola.
   · Filas alternas en gris clarito (forzado en impresión) para seguir la línea
     con el dedo en una tabla de 43 alumnos. */
const AD_EXP_CSS = `
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#111;background:#fff;padding:8mm 10mm;}
h1{font-size:22px;color:#1e3a7c;margin-bottom:3mm;}
h2{font-size:15px;color:#1e3a7c;border-bottom:2.5px solid #1e3a7c;padding-bottom:1.5mm;margin-bottom:3.5mm;
   page-break-after:avoid;break-after:avoid;}
h3{font-size:12px;color:#1e3a7c;margin:4.5mm 0 1.5mm;page-break-after:avoid;break-after:avoid;}
.sub{font-size:11.5px;color:#333;line-height:1.65;}
.sec{page-break-before:always;break-before:page;}
.bloque{page-break-inside:avoid;break-inside:avoid;}
table{width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:4.5mm;}
th,td{border:0.6px solid #8d99ae;padding:2.4px 5px;text-align:left;vertical-align:top;
      word-wrap:break-word;overflow-wrap:anywhere;}
th{background:#e3eaf7;font-size:9.5px;font-weight:bold;line-height:1.2;}
thead{display:table-header-group;}
tr{page-break-inside:avoid;break-inside:avoid;}
tbody tr:nth-child(even) td{background:#f5f8fd;}
th.rot{background:#1e3a7c;color:#fff;font-size:10.5px;letter-spacing:.4px;text-align:center;padding:2.6px 5px;}
td.n{text-align:right;white-space:nowrap;}
td.c{text-align:center;}
.tot{font-size:12px;font-weight:bold;margin:2mm 0 4.5mm;color:#14213d;}
.vacio{font-size:11px;color:#555;font-style:italic;margin-bottom:4.5mm;
       border:0.6px dashed #a9b4c6;border-radius:2mm;padding:3mm 4mm;}
.indice{border:1.2px solid #1e3a7c;border-radius:3mm;padding:4mm 6mm;margin-top:6mm;}
.indice div{padding:1.2mm 0;font-size:11.5px;border-bottom:0.5px dotted #c3ccdb;}
.indice div:last-child{border-bottom:none;}
.nota{margin-top:6mm;font-size:10px;color:#444;line-height:1.55;border-left:3px solid #1e3a7c;padding-left:3.5mm;}
.firmas{display:flex;gap:14mm;margin-top:16mm;page-break-inside:avoid;}
.firma{flex:1;border-top:1.2px solid #333;text-align:center;padding-top:2mm;font-size:10.5px;}
.noprint{margin-bottom:6mm;padding:4mm;background:#eef4ff;border:1px solid #c3d4f0;border-radius:3mm;}
@media print{.noprint{display:none;} body{padding:0;}}
@page{size:letter landscape;margin:11mm 12mm;}`;

/* rotulo: fila de título que se REPITE en cada página al cortar la tabla.
   anchos: porcentajes por columna, para que la tabla no cambie de forma. */
function adExpTabla(cabs, filas, vacioTxt, rotulo, anchos) {
  if (!filas.length) return '<p class="vacio">' + (vacioTxt || 'Sin datos en esta sección.') + '</p>';
  const cols = anchos ? '<colgroup>' + anchos.map(w => '<col style="width:' + w + '%">').join('') + '</colgroup>' : '';
  const rot = rotulo ? '<tr><th class="rot" colspan="' + cabs.length + '">' + rotulo + '</th></tr>' : '';
  return '<table>' + cols + '<thead>' + rot + '<tr>' + cabs.map(c => '<th>' + c + '</th>').join('') +
    '</tr></thead><tbody>' + filas.join('') + '</tbody></table>';
}

function adPrintExpediente(st) {
  const d = st.grupos.find(g => g.id === st.activo) || st.grupos[0];
  const anio = adAnioDe(d);
  const nom = n => { const a = d.lista.find(x => String(x.num) === String(n)); return (a && a.nombre) || ''; };
  const secs = [];
  const indice = [];
  const apunta = (et, dato) => indice.push('<div>' + et + ' — <strong>' + dato + '</strong></div>');

  /* 1 · alumnos, con identidad y contactos (el orden lo pide el expediente:
     el nombre va DESPUÉS de la identidad, como en los listados oficiales) */
  const rotulo = 'EXPEDIENTE ' + adEsc(adGradoSeccion(d.grado, d.seccion) || 'del aula') +
    (d.escuela ? ' · ' + adEsc(String(d.escuela).trim()) : '') + ' · ' + anio;
  const dato = v => { const x = String(v || '').trim(); return x ? adEsc(x) : '—'; };
  const conFicha = d.lista.filter(a => AD_FICHA_CAMPOS.every(c => String(a[c.k] || '').trim())).length;
  apunta('👥 Alumnos', d.lista.length + ' en la lista · ' + conFicha + ' con ficha completa');
  secs.push('<div class="sec"><h2>👥 Alumnos, identidad y contactos</h2>' +
    adExpTabla(['Nº lista', 'Nº de identidad', 'Alumno/a', 'Teléfono del alumno',
                'Padre, madre o encargado', 'Identidad del encargado', 'Teléfono'],
      d.lista.map(a =>
        '<tr><td class="c">' + a.num + '</td><td>' + dato(a.idn) + '</td><td>' +
        (adEsc(a.nombre) || '—') + '</td><td>' + dato(a.tel) + '</td><td>' + dato(a.enc) +
        '</td><td>' + dato(a.encId) + '</td><td>' + dato(a.encTel) + '</td></tr>'),
      'La lista está vacía.',
      rotulo + ' · ALUMNOS', [5, 13.5, 24.5, 10.5, 23, 13.5, 10]) +
    (conFicha < d.lista.length
      ? '<p class="nota">Faltan datos en ' + (d.lista.length - conFicha) + ' ficha(s). Se completan en ' +
        'Mi aula → Alumnos → «🗂️ Identidad y contactos», y se pueden pegar desde Excel.</p>'
      : '') +
    '<p class="nota">Las claves de familia no se incluyen a propósito: se entregan una por una. ' +
    'Para imprimirlas está «🖨️ Tiras de claves» en la pestaña Alumnos.</p></div>');

  /* 2 · asistencia */
  const dias = (d.asistencia || []).slice().sort((a, b) => String(a.f).localeCompare(String(b.f)));
  const res = {};
  dias.forEach(r => Object.keys(r.aus || {}).forEach(n => {
    res[n] = res[n] || { A: 0, E: 0 };
    res[n][r.aus[n]] = (res[n][r.aus[n]] || 0) + 1;
  }));
  apunta('📋 Asistencia', dias.length + ' día(s) con pase de lista');
  secs.push('<div class="sec"><h2>📋 Asistencia</h2>' +
    '<p class="sub">Días con pase de lista tomado: <strong>' + dias.length + '</strong>' +
    (dias.length ? ' · del ' + adFechaBonita(dias[0].f) + ' al ' + adFechaBonita(dias[dias.length - 1].f) : '') + '</p>' +
    '<h3>Resumen por alumno</h3>' +
    adExpTabla(['Nº', 'Alumno/a', 'Ausencias', 'Excusas', 'Días presente'],
      d.lista.map(a => {
        const r = res[a.num] || { A: 0, E: 0 };
        return '<tr><td class="c">' + a.num + '</td><td>' + (adEsc(a.nombre) || '—') + '</td><td class="c">' +
          (r.A || 0) + '</td><td class="c">' + (r.E || 0) + '</td><td class="c">' +
          Math.max(0, dias.length - (r.A || 0) - (r.E || 0)) + '</td></tr>';
      }), 'Todavía no se ha tomado el pase de lista.', rotulo + ' · ASISTENCIA', [6, 46, 16, 16, 16]) +
    (dias.length ? '<h3>Día por día</h3>' + adExpTabla(['Fecha', 'Ausentes', 'Con excusa'],
      dias.map(r => {
        const A = Object.keys(r.aus || {}).filter(n => r.aus[n] === 'A');
        const E = Object.keys(r.aus || {}).filter(n => r.aus[n] === 'E');
        const et = ns => ns.length ? ns.map(n => '#' + n + (adPrimerNombre(nom(n)) ? ' ' + adEsc(adPrimerNombre(nom(n))) : '')).join(', ') : '—';
        return '<tr><td>' + adFechaBonita(r.f) + '</td><td>' + et(A) + '</td><td>' + et(E) + '</td></tr>';
      }), '', rotulo + ' · ASISTENCIA DÍA POR DÍA', [14, 43, 43]) : '') + '</div>');

  /* 3 · colectas */
  apunta('💰 Colectas', (d.colectas || []).length + ' colecta(s)');
  secs.push('<div class="sec"><h2>💰 Colaboraciones y acuerdos</h2>' +
    ((d.colectas || []).length ? d.colectas.slice().reverse().map(c => {
      const t = adColectaTotales(c);
      return '<div class="bloque"><h3>' + adEsc(c.concepto) + ' — acordado el ' + adFechaBonita(c.fecha) +
        ' · sugerido ' + adLps(c.montoAlumno) + '</h3>' +
        adExpTabla(['Nº', 'Alumno/a', 'Aportó', 'Fecha', 'Monto', 'Recibo'],
          d.lista.map(a => {
            const m = c.pagos && c.pagos[a.num];
            return '<tr><td class="c">' + a.num + '</td><td>' + (adEsc(a.nombre) || '—') + '</td><td class="c">' +
              (m != null ? 'Sí' : '—') + '</td><td>' + (m != null ? adFechaBonita((c.pagosF && c.pagosF[a.num]) || c.fecha) : '') +
              '</td><td class="n">' + (m != null ? adLps(m) : '') + '</td><td>' + (m != null ? adReciboFolio(c, a.num) : '') + '</td></tr>';
          }), '', rotulo + ' · ' + adEsc(c.concepto), [6, 40, 10, 14, 14, 16]) +
        ((c.gastos || []).length ? adExpTabla(['Fecha', 'Gasto de esta colecta', 'Monto'],
          c.gastos.map(g => '<tr><td>' + adFechaBonita(g.f) + '</td><td>' + adEsc(g.d) + '</td><td class="n">' + adLps(g.m) + '</td></tr>')) : '') +
        '<p class="tot">Recaudado: ' + adLps(t.rec) + ' · Gastado: ' + adLps(t.gas) + ' · Saldo: ' + adLps(t.saldo) + '</p></div>';
    }).join('') : '<p class="vacio">No hay colectas registradas.</p>') + '</div>');

  /* 4 · gastos de mi bolsillo (son de la cuenta, no del grupo) */
  const gs = adGastosLoad(); const gt = adGastosTotales(gs);
  apunta('🧾 Gastos de mi bolsillo', gt.pend.length + ' por cobrar (' + adLps(gt.mPend) + ')');
  secs.push('<div class="sec"><h2>🧾 Gastos de mi bolsillo</h2>' +
    '<p class="sub">Lo que el docente pagó de lo suyo para el centro. Va por cuenta del docente, no por grupo.</p>' +
    adExpTabla(['Fecha', 'Tipo', 'Concepto', 'Recibo', 'Se cobra a', 'Estado', 'Monto'],
      gs.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))).map(g =>
        '<tr><td>' + adFechaBonita(g.fecha) + '</td><td>' + adEsc(adGastoCatEt(g.cat)) + '</td><td>' +
        adEsc(g.concepto) + '</td><td class="c">' + (g.factura ? 'Sí' : 'No') + '</td><td>' +
        adEsc(g.cobrarA || 'Dirección') + '</td><td>' + (g.estado === 'cobrado'
          ? 'Pagado el ' + adFechaBonita(g.fechaCobro || g.fecha) : 'Por cobrar') +
        '</td><td class="n">' + adLps(g.monto) + '</td></tr>'),
      'No hay gastos anotados.', rotulo + ' · GASTOS DE MI BOLSILLO', [10, 17, 30, 8, 13, 14, 8]) +
    (gs.length ? '<p class="tot">Por cobrar: ' + adLps(gt.mPend) + ' · Ya recuperado: ' + adLps(gt.mCobr) + '</p>' : '') + '</div>');

  /* 5 · controles */
  apunta('✅ Controles', (d.controles || []).length + ' control(es)');
  secs.push('<div class="sec"><h2>✅ Controles del aula</h2>' +
    ((d.controles || []).length ? d.controles.slice().reverse().map(c => {
      const faltan = adCtrlFaltan(d, c);
      const m = adCtrlMision(c);
      return '<h3>' + (c.icono || '✅') + ' ' + adEsc(c.nombre) + ' — ' + adFechaBonita(c.fecha) +
        ' · ' + adCtrlHechos(c) + ' de ' + d.lista.length + ' anotados</h3>' +
        '<p class="sub">' + (c.fam ? '📔 Se cuenta a la familia en la Bitácora' : '🔒 Solo para el docente') +
        (c.acum ? ' · avisa evaluación acumulativa' : '') + (m ? ' · misión: ' + adEsc(m.title) : '') + '</p>' +
        adExpTabla(['Nº', 'Alumno/a', 'Dato'],
          d.lista.map(a => '<tr><td class="c">' + a.num + '</td><td>' + (adEsc(a.nombre) || '—') +
            '</td><td class="c">' + (adEsc(adCtrlValorTxt(c, a.num)) || '—') + '</td></tr>'),
          '', rotulo + ' · ' + adEsc(c.nombre), [7, 63, 30]) +
        (faltan.length ? '<p class="tot">Faltan por anotar (' + faltan.length + '): ' +
          faltan.map(a => '#' + a.num).join(', ') + '</p>' : '<p class="tot">Grupo completo.</p>');
    }).join('') : '<p class="vacio">No hay controles registrados.</p>') + '</div>');

  /* 6 · novedades de la clase */
  apunta('📔 Novedades de la clase', (d.bitacora || []).length + ' anotación(es)');
  secs.push('<div class="sec"><h2>📔 Novedades de la clase</h2>' +
    adExpTabla(['Fecha', 'Novedad'],
      (d.bitacora || []).slice().reverse().map(n =>
        '<tr><td>' + adFechaBonita(n.fecha) + '</td><td>' + adEsc(n.texto) + '</td></tr>'),
      'No hay novedades anotadas.', rotulo + ' · NOVEDADES DE LA CLASE', [12, 88]) + '</div>');

  /* 7 · notas por parcial (materias y personalidad) */
  const parciales = Object.keys(d.notas || {}).sort();
  apunta('🧮 Notas SACE', parciales.length ? 'parcial(es) ' + parciales.join(', ') : 'sin notas');
  secs.push('<div class="sec"><h2>🧮 Notas por parcial</h2>' +
    (parciales.length ? parciales.map(p => {
      const cols = (d.materias || []).concat(AD_PERSONALIDAD);
      const usadas = cols.filter(c => Object.keys((d.notas[p] || {})[c] || {}).length);
      if (!usadas.length) return '<h3>Parcial ' + adEsc(p) + '</h3><p class="vacio">Sin notas en este parcial.</p>';
      const pf = ((d.boleta || {}).parcialFechas || {})[p];
      return '<h3>Parcial ' + adEsc(p) + (pf && pf.desde ? ' · evaluaciones del ' + adFechaBonita(pf.desde) +
        ' al ' + adFechaBonita(pf.hasta) : '') + '</h3>' +
        adExpTabla(['Nº', 'Alumno/a'].concat(usadas.map(adEsc)),
          d.lista.map(a => '<tr><td class="c">' + a.num + '</td><td>' + (adEsc(a.nombre) || '—') + '</td>' +
            usadas.map(c => { const v = ((d.notas[p] || {})[c] || {})[a.num]; return '<td class="c">' + (v != null && v !== '' ? adEsc(String(v)) : '—') + '</td>'; }).join('') + '</tr>'),
          '', rotulo + ' · NOTAS DEL PARCIAL ' + adEsc(p),
          [5, 27].concat(usadas.map(() => 68 / usadas.length)));
    }).join('') : '<p class="vacio">Todavía no hay notas guardadas.</p>') + '</div>');

  /* 8 · comunicados y conducta */
  const gg = (avLoad().grupos || {})[d.id] || { avisos: [], faqs: [], conducta: [] };
  apunta('📣 Comunicados', (gg.avisos || []).length + ' aviso(s) · ' + (gg.conducta || []).length + ' de conducta');
  secs.push('<div class="sec"><h2>📣 Comunicados y conducta</h2>' +
    '<h3>Avisos publicados a las familias</h3>' +
    adExpTabla(['Publicado', 'Título', 'Texto', 'Vigente hasta'],
      (gg.avisos || []).slice().reverse().map(a =>
        '<tr><td>' + adFechaBonita(String(a.mod || '').slice(0, 10)) + '</td><td>' + adEsc(a.titulo) +
        '</td><td>' + adEsc(a.texto) + '</td><td>' + adFechaBonita(a.hasta) + '</td></tr>'),
      'No hay avisos publicados.', rotulo + ' · AVISOS A LAS FAMILIAS', [12, 24, 52, 12]) +
    '<h3>Reportes de conducta</h3>' +
    adExpTabla(['Fecha', 'Nº', 'Alumno/a', 'Tipo', 'Detalle'],
      (gg.conducta || []).slice().reverse().map(c =>
        '<tr><td>' + adFechaBonita(c.fecha) + '</td><td class="c">' + c.num + '</td><td>' +
        (adEsc(nom(c.num)) || '—') + '</td><td>' + adEsc(AV_CONDUCTA_TIPOS[c.tipo] || '📋 Reporte') + '</td><td>' +
        adEsc(c.texto) + '</td></tr>'),
      'No hay reportes de conducta.', rotulo + ' · CONDUCTA', [11, 6, 26, 17, 40]) +
    ((gg.faqs || []).length ? '<h3>Ficha del aula (respuestas para las familias)</h3>' +
      adExpTabla(['Pregunta', 'Respuesta'], gg.faqs.map(f =>
        '<tr><td>' + adEsc(f.pregunta) + '</td><td>' + adEsc(f.respuesta) + '</td></tr>')) : '') +
    '<div class="firmas"><div class="firma">Docente</div><div class="firma">Dirección</div></div></div>');

  const html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
    '<title>Expediente del aula ' + adEsc(adGradoSeccion(d.grado, d.seccion)) + ' ' + anio + '</title>' +
    '<style>' + AD_EXP_CSS + '</style></head><body>' +
    '<div class="noprint"><button onclick="window.print()" style="padding:10px 18px;font-weight:bold;font-size:14px;cursor:pointer;">' +
    '🖨️ Imprimir o guardar como PDF</button><br><span style="font-size:12px;color:#444;line-height:1.6">' +
    'Sale <strong>horizontal (apaisado)</strong> a propósito: así las 7 columnas de alumnos y las notas ' +
    'de todas las materias caben enteras y nada queda aplastado.<br>' +
    'En el teléfono: <strong>Imprimir → destino «Guardar como PDF»</strong>. ' +
    'En la computadora, deja activada la opción de <strong>gráficos de fondo</strong> para que se vean ' +
    'las filas alternas.</span></div>' +
    '<h1>📄 Expediente del aula</h1>' +
    '<p class="sub">' +
    (d.escuela ? '<strong>' + adEsc(String(d.escuela).trim()) + '</strong><br>' : '') +
    (adGradoSeccion(d.grado, d.seccion) ? 'Grupo ' + adEsc(adGradoSeccion(d.grado, d.seccion)) + ' · ' : '') +
    'Año lectivo ' + anio + '<br>' +
    (adDocenteNombre() ? 'Docente: ' + adEsc(adDocenteNombre()) + '<br>' : '') +
    'Generado con M.E.T.A.S el ' + adFechaBonita(adHoy()) + '</p>' +
    '<div class="indice"><strong>Lo que contiene este expediente</strong>' + indice.join('') + '</div>' +
    '<p class="nota">Documento de respaldo del trabajo del aula. Contiene datos de menores: ' +
    'manéjelo con el mismo cuidado que el libro de registro.</p>' +
    secs.join('') + '</body></html>';

  adPrintAbrir(html);
}

/* ══════════════ 🧾 GASTOS DE MI BOLSILLO ══════════════
   Lo que el maestro paga de lo suyo para el centro y le tienen que devolver:
   copias, un flete en su propio carro, cartulinas, una reparación. NO es una
   colecta (esa es plata de los padres) ni un gasto de colecta (ese sale del
   dinero ya recaudado): es una DEUDA DEL CENTRO CON EL MAESTRO.

   Vive en el nivel de la CUENTA, no del grupo: el bolsillo del maestro es uno
   solo aunque atienda dos colegios, así que la deuda no se parte por grado.
   Cada gasto se queda con el nombre del colegio al que se le cobra.

   NUNCA viaja al asistente de padres: esto es entre el maestro y su dirección.
   Sale del teléfono solo cuando él toca «enviar», y va a quien él decida. */
const AD_GASTO_CATS = [
  { k: 'copias',     et: '🖨️ Copias e impresiones' },
  { k: 'transporte', et: '🚚 Transporte o flete' },
  { k: 'materiales', et: '🧰 Materiales' },
  { k: 'refrigerio', et: '🍽️ Refrigerio' },
  { k: 'servicio',   et: '🔧 Servicio o reparación' },
  { k: 'otro',       et: '📦 Otro gasto' },
];
const AD_GASTO_COBRAR = ['Dirección', 'Tesorería', 'Sociedad de Padres', 'Otro'];
function adGastoCatEt(k) {
  const x = AD_GASTO_CATS.find(c => c.k === k);
  return x ? x.et : '📦 Otro gasto';
}
function adGastosLoad() {
  const st = adState();
  return Array.isArray(st.gastos) ? st.gastos : [];
}
function adGastosSave(arr) {
  const st = adState();
  st.gastos = arr;
  adStateSave(st);
}
function adGastosTotales(lista) {
  const pend = lista.filter(g => g.estado !== 'cobrado');
  const cobr = lista.filter(g => g.estado === 'cobrado');
  const suma = a => a.reduce((s, g) => s + (Number(g.monto) || 0), 0);
  return { pend, cobr, mPend: suma(pend), mCobr: suma(cobr) };
}

/* ══════════════ 💰 ECONOMÍA — colaboraciones y acuerdos ══════════════ */
function adColecta(d, id) { return d.colectas.find(c => c.id === id); }
/* Folio del recibo: FIJO para ese alumno en esa colecta (corregir el monto no
   lo cambia) y distinto entre colectas, porque sale del id de la colecta, que
   ya es único. La familia lo cita si quiere una aclaración. */
function adReciboFolio(c, num) {
  const base = String(c.id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return 'RC-' + (base.slice(-4) || '0000') + '-' + num;
}
function adColectaTotales(c) {
  const rec = Object.values(c.pagos || {}).reduce((s, m) => s + (Number(m) || 0), 0);
  const gas = (c.gastos || []).reduce((s, g) => s + (Number(g.m) || 0), 0);
  return { rec, gas, saldo: rec - gas };
}
/* Cuántos alumnos se ESPERA que den. Casi siempre es la lista entera, pero no
   siempre: hay alumnos de prueba, un retirado que sigue en la lista, un becado
   al que no se le pide. Con «22/44» el maestro dice en la reunión que faltan
   22 cuando faltan 20, y la madre que cuenta le lleva la contraria.
   Se dice QUIÉNES no cuentan (c.noCuentan, sus números de lista), no solo
   cuántos: con el número suelto el total salía bien pero el informe impreso
   seguía listando a los de prueba, porque no había forma de saber cuáles eran.
   Se guarda EN LA COLECTA, no en la lista: quitar a alguien de la lista le
   borraría su número y con él la clave de familia.
   c.esperados es la versión anterior (solo la cifra) y se respeta mientras el
   maestro no escriba los números. */
function adColectaFuera(c, d) {
  const hay = new Set(d.lista.map(a => String(a.num)));
  return new Set((Array.isArray(c && c.noCuentan) ? c.noCuentan : [])
    .map(String).filter(n => hay.has(n)));
}
function adColectaEsperados(c, d) {
  if (Array.isArray(c && c.noCuentan)) return d.lista.length - adColectaFuera(c, d).size;
  const n = Number(c && c.esperados);
  return n >= 1 ? Math.floor(n) : d.lista.length;
}
/* Los que dieron, SIN los que no cuentan: si un alumno de prueba quedó marcado
   por error, «23 de 42» no puede pasar del total. Su dinero sí sigue en lo
   recaudado, porque el dinero está en la mano y se rinde. */
function adColectaDieron(c, d) {
  const fuera = adColectaFuera(c, d);
  return Object.keys(c.pagos || {}).filter(n => !fuera.has(String(n))).length;
}
/* Dinero que falta por recaudar: a cada alumno que cuenta se le pide el aporte
   SUGERIDO, y se suma lo que le falta para llegar a él. Así el abono entra
   —quien dio L 10 de L 25 debe L 15, no L 25— y quien dio de más no tapa lo
   que debe otro: ese dinero de más no se sabe a quién cubre (puede ser un
   hermano, puede ser una propina), y restarlo daría una deuda que no existe. */
function adColectaPorRecaudar(c, d) {
  const fuera = adColectaFuera(c, d);
  const sug = Number(c.montoAlumno) || 0;
  return d.lista.filter(a => !fuera.has(String(a.num))).reduce((s, a) => {
    const dio = Number(c.pagos && c.pagos[a.num]) || 0;
    return s + Math.max(0, sug - dio);
  }, 0);
}
/* Total esperado: el aporte sugerido por cada alumno que cuenta. Un solo
   cálculo para la pantalla, el WhatsApp y el papel, que tienen que decir lo
   mismo: la madre compara el mensaje con el informe. */
function adColectaMeta(c, d) {
  return adColectaEsperados(c, d) * (Number(c.montoAlumno) || 0);
}
/* Participación del grupo: los que dieron sobre el total que CUENTA (sin los
   de prueba ni los retirados). Por eso se corrige el total: con la lista cruda,
   22 de 44 es un 50 % y el grupo real va en 52 %, y esa es la cifra que el
   padre lee. Se redondea al entero: «52,4 %» en un grupo de WhatsApp no le
   dice más a nadie. */
function adColectaPct(c, d) {
  const esp = adColectaEsperados(c, d);
  return esp ? Math.round(adColectaDieron(c, d) * 100 / esp) : 0;
}
/* Barra de participación: la MISMA en la pantalla y en el papel, para que el
   maestro vea lo que va a imprimir. Es SVG porque el navegador imprime «sin
   gráficos de fondo» de fábrica: una barra con background saldría en blanco en
   el papel, y el relleno de un SVG se imprime siempre. */
function adColectaBarraSvg(c, d, alto) {
  const pct = Math.min(100, adColectaPct(c, d));
  return `<svg viewBox="0 0 100 8" preserveAspectRatio="none" width="100%" height="${alto}" role="img" aria-label="Participación ${pct} %" style="display:block">
    <rect x="0" y="0" width="100" height="8" fill="#fff" stroke="#1e3a7c" stroke-width="1" vector-effect="non-scaling-stroke"/>
    <rect x="0" y="0" width="${pct}" height="8" fill="#1e3a7c"/>
    ${[25, 50, 75].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="8" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>`).join('')}
  </svg>`;
}
/* La misma barra en el WhatsApp, que solo lleva texto: diez cuadros de 10 %
   cada uno. Lleno y vacío se distinguen por la FORMA (🟦 contra ⬜), no solo por
   el color, así la lee también quien no distingue colores. Se redondea al
   cuadro más cercano; el número exacto va en la línea de arriba. */
function adColectaBarraTxt(c, d) {
  const llenos = Math.max(0, Math.min(10, Math.round(adColectaPct(c, d) / 10)));
  return '🟦'.repeat(llenos) + '⬜'.repeat(10 - llenos);
}
/* Una colecta está COMPLETA cuando dio todo el que cuenta: la misma regla de
   la barra llena, con el total corregido (sin los de prueba). Se cuenta por
   alumnos y no por dinero, igual que la participación: un abono no la cierra. */
function adColectaCompleta(c, d) {
  const esp = adColectaEsperados(c, d);
  return esp > 0 && adColectaDieron(c, d) >= esp;
}
/* «1 de 3 completas»: la misma frase en la pantalla, el WhatsApp y el papel.
   Con una sola colecta devuelve '' porque «1 de 1» no dice nada. */
function adColectasCompletasTxt(d) {
  const cs = d.colectas || [];
  if (cs.length < 2) return '';
  return cs.filter(x => adColectaCompleta(x, d)).length + ' de ' + cs.length;
}
/* Resumen para WhatsApp: SOLO cifras. Ni un nombre ni un número de lista,
   porque va al grupo de padres y ahí «#14 no ha dado» es señalar a un niño
   delante de todos. Quién pagó se sabe por el recibo de cada familia. */
/* conGrupo: añade al final las demás colectas del grupo con sus barras. Es
   OPCIONAL y va apagado por defecto: el mensaje de la excursión no tiene por
   qué contarle al grupo cómo va la rifa, y eso lo decide el maestro. */
function adColectaTxtResumen(c, d, conGrupo) {
  const t = adColectaTotales(c);
  const pagaron = adColectaDieron(c, d);
  const esp = adColectaEsperados(c, d);
  const grupo = adGrupoTxt(d);
  const gastos = c.gastos || [];
  return '💰 *' + c.concepto + '*\n' +
    (grupo ? 'Grupo ' + grupo + '\n' : '') +
    'Acordado el ' + adFechaBonita(c.fecha) + ' · aporte sugerido: ' + adLps(c.montoAlumno) + '\n\n' +
    '✅ Han dado: *' + pagaron + ' de ' + esp + '*\n' +
    '📊 Participación del grupo: *' + adColectaPct(c, d) + ' %*\n' +
    adColectaBarraTxt(c, d) + '\n' +
    (esp > pagaron ? '⏳ Faltan: *' + (esp - pagaron) + '*\n' : '') +
    '🎯 Total esperado: *' + adLps(adColectaMeta(c, d)) + '* (' + esp + ' × ' + adLps(c.montoAlumno) + ')\n' +
    '💵 Recaudado: *' + adLps(t.rec) + '*\n' +
    (adColectaPorRecaudar(c, d) > 0 ? '📥 Falta por recaudar: *' + adLps(adColectaPorRecaudar(c, d)) + '*\n' : '') +
    '🧾 Gastado: *' + adLps(t.gas) + '*\n' +
    (gastos.length ? gastos.map(g => '   • ' + g.d + ': ' + adLps(g.m)).join('\n') + '\n' : '') +
    '💼 Saldo: *' + adLps(t.saldo) + '*\n\n' +
    /* con una sola colecta «1 de 1» no dice nada: solo sale si hay más */
    (conGrupo && adColectasCompletasTxt(d)
      ? '🗂️ Colectas del grupo: *' + adColectasCompletasTxt(d) + '* completas\n' +
        /* la barra de cada una, con cuadritos como la de arriba. Van nombres de
           COLECTAS, nunca de alumnos; y la % exacta al lado, porque diez
           cuadros no distinguen un 52 de un 56 */
        d.colectas.map(x => '• ' + x.concepto + (x.id === c.id ? ' (esta)' : '') + '\n   ' +
          adColectaBarraTxt(x, d) + ' ' + adColectaPct(x, d) + ' %' + (adColectaCompleta(x, d) ? ' ✔' : '')).join('\n') +
        '\n\n'
      : '') +
    'Cortado al ' + adFechaBonita(adHoy()) + '.\n_Anotado con M.E.T.A.S_';
}

function adRenderEco(body, d) {
  if (_adGastosOn) { adRenderGastos(body, d); return; }
  if (_adInvOn) { adRenderInventario(body, d); return; }
  if (!d.lista.length) { adSinLista(body, 'el registro económico'); return; }
  if (_adColectaId) { adRenderColecta(body, d); return; }

  const gT = adGastosTotales(adGastosLoad());
  const iT = adInvTotales(adInvLoad());
  body.innerHTML = `
    <button class="ad-puerta ad-puerta-deuda" id="ad-ir-gastos">
      <span class="ad-puerta-ic">🧾</span>
      <span class="ad-puerta-txt">
        <span class="ad-puerta-t">Gastos de mi bolsillo</span>
        <span class="ad-puerta-s">${gT.pend.length
          ? 'La escuela te debe <strong>' + adLps(gT.mPend) + '</strong> en ' + gT.pend.length + ' gasto(s)'
          : 'Copias, un flete, materiales… anótalo y cóbralo sin pelear de memoria'}</span>
      </span>
      <span class="ad-puerta-go">›</span>
    </button>
    <button class="ad-puerta ad-puerta-inv" id="ad-ir-inv">
      <span class="ad-puerta-ic">📦</span>
      <span class="ad-puerta-txt">
        <span class="ad-puerta-t">Inventario del aula</span>
        <span class="ad-puerta-s">${iT.mio.length
          ? 'Tienes <strong>' + iT.mio.length + '</strong> cosa(s) tuyas en el aula por ' +
            adLps(iT.vMio) + (adInvVence() ? ' · ⚠️ toca firmar el acta' : '')
          : 'Lo que es TUYO y lo que es de la escuela, separado y con acta firmada'}</span>
      </span>
      <span class="ad-puerta-go">›</span>
    </button>
    <div class="pa-card">
      <div class="pa-card-title">💰 Colaboraciones y acuerdos</div>
      <p class="pa-optional-hint">Cada acuerdo de reunión (colaboración, rifa, eventualidad) es una
        <strong>colecta</strong>: se marca quién dio, se anotan los gastos y el saldo queda claro
        para rendir cuentas a los padres.</p>
      <button class="pa-generate-btn" id="ad-nueva-colecta">➕ Nueva colecta o acuerdo</button>
    </div>
    ${d.colectas.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🗂️ Mis colectas</div>
      ${adColectasCompletasTxt(d) ? `<p class="ad-col-completas">✅ <strong>${adColectasCompletasTxt(d)}</strong> completas</p>` : ''}
      ${d.colectas.slice().reverse().map(c => {
        const t = adColectaTotales(c);
        const pagaron = adColectaDieron(c, d);
        return `
        <button class="ad-colecta-row" data-cid="${c.id}">
          <span class="ad-cr-txt"><strong>${adEsc(c.concepto)}</strong><br>
            <small>${adFechaBonita(c.fecha)} · ${pagaron}/${adColectaEsperados(c, d)} dieron (${adColectaPct(c, d)} %) · saldo ${adLps(t.saldo)}</small>
            <span class="ad-cr-barra">${adColectaBarraSvg(c, d, 10)}</span></span>
          <span class="ad-cr-arrow">›</span>
        </button>`;
      }).join('')}
    </div>` : ''}`;

  document.getElementById('ad-nueva-colecta').addEventListener('click', async () => {
    const concepto = await metasPrompt('¿Cuál es el acuerdo o colaboración?\n(ej.: **Aporte día del niño**, acordado en reunión)', {
      icono: '💰', titulo: 'Nueva colecta', okTxt: 'Siguiente',
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el concepto (mínimo 3 letras).',
    });
    if (concepto === null) return;
    const monto = await metasPrompt('¿Cuál es el aporte **sugerido** por alumno? (en Lempiras)\nEs solo el valor por defecto: al marcar puedes ponerle otro monto a quien pague distinto (hermanos, becados, abonos).', {
      icono: '💰', titulo: 'Nueva colecta', inputmode: 'decimal', okTxt: 'Crear',
      valida: v => (Number(String(v).replace(',', '.')) > 0) ? '' : 'Escribe un monto mayor que cero.',
    });
    if (monto === null) return;
    const dd = adLoad();
    /* el total corregido se hereda de la colecta anterior: los alumnos de
       prueba siguen en la lista, y corregirlo en cada colecta se olvida */
    const prev = dd.colectas.slice().reverse().find(x => Array.isArray(x.noCuentan) || Number(x.esperados) >= 1);
    dd.colectas.push({
      id: 'C' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      concepto: String(concepto).trim(),
      montoAlumno: Number(String(monto).replace(',', '.')),
      fecha: adHoy(), pagos: {}, pagosF: {}, gastos: [],
    });
    if (prev) {
      const nueva = dd.colectas[dd.colectas.length - 1];
      if (Array.isArray(prev.noCuentan)) nueva.noCuentan = [...adColectaFuera(prev, dd)].map(Number);
      else if (Number(prev.esperados) <= dd.lista.length) nueva.esperados = prev.esperados;
    }
    adSave(dd);
    _adColectaId = dd.colectas[dd.colectas.length - 1].id;
    renderAdmin();
  });
  body.querySelectorAll('.ad-colecta-row').forEach(b =>
    b.addEventListener('click', () => { _adColectaId = b.dataset.cid; renderAdmin(); }));
  document.getElementById('ad-ir-gastos').addEventListener('click', () => { _adGastosOn = 1; renderAdmin(); });
  document.getElementById('ad-ir-inv').addEventListener('click', () => { _adInvOn = 1; renderAdmin(); });
}

/* ── Gastos de mi bolsillo: anotar, cobrar y cerrar ──
   Todo en UNA pantalla: el formulario arriba (categoría y a quién se le cobra en
   chips, para no escribir de más), y debajo lo pendiente con su total gordo, que
   es el dato con el que el maestro va a hablar con la tesorera. */
function adRenderGastos(body, d) {
  const lista = adGastosLoad();
  const t = adGastosTotales(lista);
  const escuela = String(d.escuela || '').trim();
  const fila = g => `
    <div class="ad-gsto ${g.estado === 'cobrado' ? 'ad-gsto-ok' : ''}">
      <div class="ad-gsto-top">
        <span class="ad-gsto-cat">${adEsc(adGastoCatEt(g.cat))}</span>
        <span class="ad-gsto-monto">${adLps(g.monto)}</span>
      </div>
      <div class="ad-gsto-con">${adEsc(g.concepto)}</div>
      <div class="ad-gsto-meta">${adFechaBonita(g.fecha)} · cobrar a <strong>${adEsc(g.cobrarA || 'Dirección')}</strong>${
        g.escuela ? ' · ' + adEsc(g.escuela) : ''} · ${g.factura ? '📎 con recibo' : '⚠️ sin recibo'}${
        g.estado === 'cobrado' ? ' · ✅ me lo pagaron el ' + adFechaBonita(g.fechaCobro || g.fecha) : ''}</div>
      <div class="ad-gsto-btns">
        <button class="ad-gsto-b ad-gsto-wa" data-wa="${g.id}">📲 Enviar este</button>
        ${g.estado === 'cobrado'
          ? `<button class="ad-gsto-b" data-reabrir="${g.id}">↩️ Sigue pendiente</button>`
          : `<button class="ad-gsto-b ad-gsto-ok-b" data-cobrado="${g.id}">✅ Ya me lo pagaron</button>`}
        <button class="ad-gsto-b ad-gsto-del" data-del="${g.id}" aria-label="Eliminar">🗑</button>
      </div>
    </div>`;

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="ad-gsto-volver">💰 Economía</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">🧾 Gastos de mi bolsillo</div>
      <p class="pa-optional-hint">Lo que <strong>pagaste de lo tuyo</strong> para el centro y te tienen
        que devolver: copias, un flete en tu carro, cartulinas, una reparación. No se mezcla con las
        colectas, porque esa es plata de los padres.
        <strong>Nada de esto llega al asistente de padres</strong>: sale de aquí solo cuando tú lo envías.</p>

      <div class="ad-gsto-marcador">
        <span class="ad-gsto-m-lbl">La escuela me debe</span>
        <span class="ad-gsto-m-val">${adLps(t.mPend)}</span>
        <span class="ad-gsto-m-sub">${t.pend.length} gasto(s) por cobrar${
          t.cobr.length ? ' · ' + adLps(t.mCobr) + ' ya recuperados' : ''}</span>
      </div>

      <div class="ad-gsto-lbl">🗂️ ¿De qué fue el gasto?</div>
      <div class="ad-gchips" id="ad-gsto-cats">
        ${AD_GASTO_CATS.map((c, i) =>
          `<button class="ad-gchip${i === 0 ? ' ad-gchip-sel' : ''}" data-cat="${c.k}">${c.et}</button>`).join('')}
      </div>
      <div class="ad-gsto-lbl">✍️ ¿En qué exactamente?</div>
      <input id="ad-gsto-con" class="pa-inp-field" maxlength="120" autocomplete="off"
             placeholder="Ej.: 43 juegos de la ficha de Español">
      <div class="ad-gsto-fila2">
        <div>
          <div class="ad-gsto-lbl">💵 ¿Cuánto pagaste?</div>
          <input id="ad-gsto-monto" class="pa-inp-field" inputmode="decimal" placeholder="120">
        </div>
        <div>
          <div class="ad-gsto-lbl">🗓 ¿Qué día?</div>
          <input id="ad-gsto-fecha" class="pa-inp-field" type="date" value="${adHoy()}">
        </div>
      </div>
      <div class="ad-gsto-lbl">🙋 ¿A quién se le cobra?</div>
      <div class="ad-gchips" id="ad-gsto-cobrar">
        ${AD_GASTO_COBRAR.map((c, i) =>
          `<button class="ad-gchip${i === 1 ? ' ad-gchip-sel' : ''}" data-cobrar="${adEsc(c)}">${adEsc(c)}</button>`).join('')}
      </div>
      <label class="ad-bit-sw" style="margin-top:10px">
        <input type="checkbox" id="ad-gsto-fac" checked>
        <span>Guardé el <strong>recibo o factura</strong> (súbelo con esto y no te lo discuten)</span>
      </label>
      <button class="pa-generate-btn" id="ad-gsto-add">➕ Anotar este gasto</button>
    </div>

    ${t.pend.length ? `
    <div class="pa-card">
      <div class="pa-card-title">⏳ Por cobrar (${t.pend.length})</div>
      ${t.pend.slice().reverse().map(fila).join('')}
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="ad-gsto-wa-todo">📲 Enviar el resumen por WhatsApp</button>
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-gsto-copiar">📋 Copiar el resumen</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-gsto-print">🖨️ Imprimir la solicitud</button>
      </div>
      <p class="pa-optional-hint">💡 El resumen sirve igual para el grupo de WhatsApp de maestros,
        para la tesorera o para dirección: va con fecha, concepto, monto y total.</p>
    </div>` : `
    <div class="pa-card">
      <p class="pa-optional-hint">🎉 No tienes gastos por cobrar. Cuando saques copias o prestes el
        carro para un flete, anótalo arriba <strong>el mismo día</strong>: es cuando te acordás del monto.</p>
    </div>`}

    ${t.cobr.length ? `
    <div class="pa-card">
      <div class="pa-card-title">✅ Ya recuperados (${t.cobr.length})</div>
      ${t.cobr.slice().reverse().map(fila).join('')}
    </div>` : ''}`;

  document.getElementById('ad-gsto-volver').addEventListener('click', () => { _adGastosOn = 0; renderAdmin(); });

  /* chips: se seleccionan SIN repintar la pantalla, para no borrar lo escrito */
  const chipUnico = (cont) => body.querySelectorAll('#' + cont + ' .ad-gchip').forEach(b =>
    b.addEventListener('click', () => {
      body.querySelectorAll('#' + cont + ' .ad-gchip').forEach(x => x.classList.remove('ad-gchip-sel'));
      b.classList.add('ad-gchip-sel');
    }));
  chipUnico('ad-gsto-cats'); chipUnico('ad-gsto-cobrar');

  document.getElementById('ad-gsto-add').addEventListener('click', () => {
    const con = String(document.getElementById('ad-gsto-con').value || '').trim();
    const mRaw = String(document.getElementById('ad-gsto-monto').value || '').replace(',', '.').trim();
    const monto = Number(mRaw);
    if (con.length < 3) { toast('✍️ Escribe en qué fue el gasto'); document.getElementById('ad-gsto-con').focus(); return; }
    if (!(monto > 0)) { toast('💵 Escribe cuánto pagaste'); document.getElementById('ad-gsto-monto').focus(); return; }
    const cat = (body.querySelector('#ad-gsto-cats .ad-gchip-sel') || {}).dataset;
    const cob = (body.querySelector('#ad-gsto-cobrar .ad-gchip-sel') || {}).dataset;
    const arr = adGastosLoad();
    arr.push({
      id: 'X' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      fecha: String(document.getElementById('ad-gsto-fecha').value || adHoy()),
      cat: (cat && cat.cat) || 'otro', concepto: con, monto,
      cobrarA: (cob && cob.cobrar) || 'Tesorería',
      factura: document.getElementById('ad-gsto-fac').checked ? 1 : 0,
      escuela, estado: 'pendiente',
    });
    adGastosSave(arr); renderAdmin();
    toast('🧾 Anotado: ya no depende de tu memoria');
  });

  body.querySelectorAll('[data-cobrado]').forEach(b =>
    b.addEventListener('click', () => {
      const arr = adGastosLoad();
      const g = arr.find(x => x.id === b.dataset.cobrado); if (!g) return;
      g.estado = 'cobrado'; g.fechaCobro = adHoy();
      adGastosSave(arr); renderAdmin();
      toast('✅ Cobrado: sale de lo pendiente');
    }));
  body.querySelectorAll('[data-reabrir]').forEach(b =>
    b.addEventListener('click', () => {
      const arr = adGastosLoad();
      const g = arr.find(x => x.id === b.dataset.reabrir); if (!g) return;
      g.estado = 'pendiente'; delete g.fechaCobro;
      adGastosSave(arr); renderAdmin();
    }));
  body.querySelectorAll('[data-del]').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Eliminar este gasto de tu registro?',
        { icono: '🗑', titulo: 'Gastos de mi bolsillo', okTxt: 'Sí, eliminar' })) return;
      adUndoGuardar('Eliminar un gasto de mi bolsillo');
      adGastosSave(adGastosLoad().filter(x => x.id !== b.dataset.del));
      renderAdmin();
    }));
  body.querySelectorAll('[data-wa]').forEach(b =>
    b.addEventListener('click', () => {
      const g = adGastosLoad().find(x => x.id === b.dataset.wa); if (!g) return;
      adGastoEnviar(adGastoTxtUno(g, d));
    }));

  const wt = document.getElementById('ad-gsto-wa-todo');
  if (wt) wt.addEventListener('click', () => adGastoEnviar(adGastoTxtResumen(t.pend, d)));
  const cp = document.getElementById('ad-gsto-copiar');
  if (cp) cp.addEventListener('click', () => adCopiar(adGastoTxtResumen(t.pend, d),
    () => toast('📋 Copiado: pégalo donde lo necesites'),
    () => toast('⚠️ No se pudo copiar en este navegador')));
  const pr = document.getElementById('ad-gsto-print');
  if (pr) pr.addEventListener('click', () => adPrintGastos(t.pend, d));
}

/* WhatsApp sin número: abre el selector del teléfono para que el maestro elija
   dirección, la tesorera o el grupo de maestros, sin guardar contactos aquí. */
function adGastoEnviar(txt) {
  window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}
function adGastoTxtUno(g, d) {
  return '🧾 *Gasto por reembolsar*\n' +
    (adDocenteNombre() ? adDocenteNombre() + '\n' : '') +
    (g.escuela || d.escuela ? (g.escuela || d.escuela) + '\n' : '') + '\n' +
    adFechaBonita(g.fecha) + ' · ' + adGastoCatEt(g.cat) + '\n' +
    g.concepto + '\n' +
    '*' + adLps(g.monto) + '*' + (g.factura ? ' (tengo el recibo)' : ' (sin recibo)') + '\n' +
    'A cobrar a: ' + (g.cobrarA || 'Dirección') + '\n\n' +
    'Agradezco la gestión del reembolso.\n_Anotado con M.E.T.A.S_';
}
function adGastoTxtResumen(pend, d) {
  const total = pend.reduce((s, g) => s + (Number(g.monto) || 0), 0);
  const aQuien = [...new Set(pend.map(g => g.cobrarA || 'Dirección'))].join(' y ');
  return '🧾 *SOLICITUD DE REEMBOLSO*\n' +
    (adDocenteNombre() ? adDocenteNombre() + '\n' : '') +
    (d.escuela ? String(d.escuela).trim() + '\n' : '') +
    'Al ' + adFechaBonita(adHoy()) + '\n\n' +
    'Gastos que hice de mi bolsillo para el centro:\n' +
    pend.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))).map((g, i) =>
      (i + 1) + '. ' + adFechaBonita(g.fecha) + ' · ' + adGastoCatEt(g.cat) + ' · ' + g.concepto +
      ' — *' + adLps(g.monto) + '*' + (g.factura ? ' (con recibo)' : ' (sin recibo)')).join('\n') +
    '\n\n*TOTAL POR REEMBOLSAR: ' + adLps(total) + '*\n' +
    'A cobrar a: ' + aQuien + '\n\n' +
    'Quedo a la orden para entregar los recibos.\n_Anotado con M.E.T.A.S_';
}

/* Solicitud imprimible: la que se firma y queda archivada en dirección */
function adPrintGastos(pend, d) {
  const total = pend.reduce((s, g) => s + (Number(g.monto) || 0), 0);
  const orden = pend.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Solicitud de reembolso</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;margin-bottom:5mm;}
th,td{border:1px solid #999;padding:3px 6px;text-align:left;}
th{background:#e8eef9;font-size:11px;}
td.n{text-align:right;white-space:nowrap;}
.tot{margin:4mm 0;font-size:14px;font-weight:bold;}
.firmas{display:flex;gap:14mm;margin-top:16mm;}
.firma{flex:1;border-top:1.5px solid #333;text-align:center;padding-top:2mm;font-size:11px;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>🧾 Solicitud de reembolso</h1>
<div class="sub">${adDocenteNombre() ? adEsc(adDocenteNombre()) + ' · ' : ''}${d.escuela ? adEsc(String(d.escuela).trim()) + ' · ' : ''}${
  adGradoSeccion(d.grado, d.seccion) ? 'Grupo ' + adEsc(adGradoSeccion(d.grado, d.seccion)) + ' · ' : ''}Generado con M.E.T.A.S el ${adFechaBonita(adHoy())}</div>
<table>
<thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Recibo</th><th>Se cobra a</th><th>Monto</th></tr></thead>
<tbody>
${orden.map(g => `<tr><td>${adFechaBonita(g.fecha)}</td><td>${adEsc(adGastoCatEt(g.cat))}</td><td>${adEsc(g.concepto)}</td><td>${g.factura ? 'Sí' : 'No'}</td><td>${adEsc(g.cobrarA || 'Dirección')}</td><td class="n">${adLps(g.monto)}</td></tr>`).join('')}
</tbody></table>
<div class="tot">TOTAL POR REEMBOLSAR: ${adLps(total)}</div>
<div class="firmas">
  <div class="firma">Docente solicitante</div>
  <div class="firma">Tesorería</div>
  <div class="firma">Dirección</div>
</div>
</body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ 📦 INVENTARIO DEL AULA ══════════════
   El aula está llena de cosas y NO todas son de la escuela. El maestro
   compra un parlante, una engrapadora, un abanico… y muchas veces nadie
   se lo paga. Cuando lo trasladan, esa discusión se pierde de memoria.

   Aquí cada cosa dice DE QUIÉN ES, con una regla simple y verificable:

   🧑‍🏫 MÍO   — lo compré con mi dinero y NO me lo han reembolsado.
                Es propiedad personal del docente y puede retirarlo.
                El día que la escuela se lo pague, deja de ser suyo:
                el botón «✅ Ya me lo pagaron» lo pasa a la escuela y
                queda escrito quién pagó y cuándo.
   🏫 DE LA ESCUELA — bien del centro bajo custodia del docente: lo usa,
                lo cuida y lo entrega al final del año.
   🎁 DONADO — lo regalaron los padres o un tercero AL AULA: pertenece
                al centro, pero se guarda el nombre de quien lo donó.

   El ACTA imprimible es lo que le da valor legal: la firman el docente,
   la dirección y la directiva de padres cada cierto tiempo (por defecto
   cada 3 meses; el aviso sale solo cuando se vence).

   Vive en el nivel de la CUENTA (st.inventario / st.invActas), como los
   gastos: el patrimonio del maestro es uno solo aunque atienda dos
   grupos. NUNCA viaja al asistente de padres. */
const AD_INV_CATS = [
  { k: 'tecnologia', et: '💻 Tecnología' },
  { k: 'mobiliario', et: '🪑 Mobiliario' },
  { k: 'didactico',  et: '🧩 Material didáctico' },
  { k: 'libros',     et: '📚 Libros y textos' },
  { k: 'aseo',       et: '🧹 Aseo y mantenimiento' },
  { k: 'deporte',    et: '⚽ Deporte y arte' },
  { k: 'otro',       et: '📦 Otro' },
];
const AD_INV_DUENOS = [
  { k: 'mio',     et: '🧑‍🏫 Mío',           largo: 'Propiedad del docente' },
  { k: 'escuela', et: '🏫 De la escuela',  largo: 'Propiedad del centro educativo' },
  { k: 'donado',  et: '🎁 Donado al aula', largo: 'Donación al centro educativo' },
];
const AD_INV_MESES_ACTA = 3;   /* cada trimestre toca volver a firmar */

function adInvCatEt(k) {
  const x = AD_INV_CATS.find(c => c.k === k);
  return x ? x.et : '📦 Otro';
}
function adInvDuenoEt(k) {
  const x = AD_INV_DUENOS.find(c => c.k === k);
  return x ? x.et : '🏫 De la escuela';
}
function adInvDuenoLargo(k) {
  const x = AD_INV_DUENOS.find(c => c.k === k);
  return x ? x.largo : 'Propiedad del centro educativo';
}
function adInvLoad() {
  const st = adState();
  return Array.isArray(st.inventario) ? st.inventario : [];
}
function adInvSave(arr) {
  const st = adState();
  st.inventario = arr;
  adStateSave(st);
}
function adInvActas() {
  const st = adState();
  return Array.isArray(st.invActas) ? st.invActas : [];
}
function adInvActasSave(arr) {
  const st = adState();
  st.invActas = arr;
  adStateSave(st);
}
function adInvTotales(lista) {
  const val = a => a.reduce((s, x) => s + (Number(x.valor) || 0) * (Number(x.cant) || 1), 0);
  const mio = lista.filter(x => x.dueno === 'mio');
  const esc = lista.filter(x => x.dueno === 'escuela');
  const don = lista.filter(x => x.dueno === 'donado');
  return { mio, esc, don, vMio: val(mio), vEsc: val(esc), vDon: val(don) };
}
/* ¿Toca firmar? Sin acta nunca, o con la última de hace más de un
   trimestre. Solo pesa si hay algo que declarar. */
function adInvVence() {
  if (!adInvLoad().length) return false;
  const actas = adInvActas();
  if (!actas.length) return true;
  const ult = actas[actas.length - 1];
  const t = Date.parse(ult.fecha || ult.t || '');
  if (!t) return true;
  return (Date.now() - t) > AD_INV_MESES_ACTA * 30 * 86400000;
}
function adInvUltimaActa() {
  const actas = adInvActas();
  return actas.length ? actas[actas.length - 1] : null;
}

function adRenderInventario(body, d) {
  const lista = adInvLoad();
  const t = adInvTotales(lista);
  const ult = adInvUltimaActa();
  const escuela = String(d.escuela || '').trim();

  const fila = x => `
    <div class="ad-inv ad-inv-${adEsc(x.dueno)}">
      <div class="ad-inv-top">
        <span class="ad-inv-nom">${x.cant > 1 ? adEsc(x.cant) + ' × ' : ''}${adEsc(x.nombre)}</span>
        <span class="ad-inv-val">${x.valor ? adLps((Number(x.valor) || 0) * (Number(x.cant) || 1)) : '—'}</span>
      </div>
      <div class="ad-inv-meta">${adEsc(adInvCatEt(x.cat))} · ${adFechaBonita(x.fecha)}${
        x.dueno === 'mio' ? ' · <strong>lo pagué yo y no me lo han devuelto</strong>' : ''}${
        x.dueno === 'donado' && x.donante ? ' · donó ' + adEsc(x.donante) : ''}${
        x.dueno === 'escuela' && x.pagadoPor ? ' · me lo pagó ' + adEsc(x.pagadoPor) + ' el ' + adFechaBonita(x.fechaPago) : ''}${
        x.factura ? ' · 📎 con recibo' : ''}${x.nota ? ' · ' + adEsc(x.nota) : ''}</div>
      <div class="ad-inv-btns">
        ${x.dueno === 'mio'
          ? `<button class="ad-gsto-b ad-gsto-ok-b" data-invpago="${x.id}">✅ Ya me lo pagaron</button>`
          : ''}
        ${x.dueno === 'escuela' && x.pagadoPor
          ? `<button class="ad-gsto-b" data-invmio="${x.id}">↩️ Sigue siendo mío</button>`
          : ''}
        <button class="ad-gsto-b ad-gsto-del" data-invdel="${x.id}" aria-label="Eliminar">🗑</button>
      </div>
    </div>`;

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="ad-inv-volver">💰 Economía</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">📦 Inventario del aula</div>
      <p class="pa-optional-hint">Todo lo que hay en tu aula, diciendo <strong>de quién es</strong>.
        Lo que compraste con tu dinero y <strong>nadie te ha pagado es TUYO</strong>: si te trasladan,
        te lo llevas. Lo de la escuela es de la escuela y tú solo lo custodias. Se firma con
        dirección y la directiva de padres para que nunca sea la palabra de uno contra la del otro.
        <strong>Nada de esto llega al asistente de padres.</strong></p>

      <div class="ad-inv-marcadores">
        <div class="ad-inv-mk ad-inv-mk-mio">
          <span class="ad-inv-mk-lbl">🧑‍🏫 Mío</span>
          <span class="ad-inv-mk-val">${adLps(t.vMio)}</span>
          <span class="ad-inv-mk-sub">${t.mio.length} cosa(s) sin pagarme</span>
        </div>
        <div class="ad-inv-mk">
          <span class="ad-inv-mk-lbl">🏫 De la escuela</span>
          <span class="ad-inv-mk-val">${t.esc.length + t.don.length}</span>
          <span class="ad-inv-mk-sub">bajo mi custodia</span>
        </div>
      </div>

      <div class="ad-gsto-lbl">📦 ¿Qué cosa es?</div>
      <input id="ad-inv-nom" class="pa-inp-field" maxlength="120" autocomplete="off"
             placeholder="Ej.: Parlante bluetooth, abanico de pared, 20 sillas">
      <div class="ad-gsto-lbl">🏷️ ¿De quién es?</div>
      <div class="ad-gchips" id="ad-inv-duenos">
        ${AD_INV_DUENOS.map((c, i) =>
          `<button class="ad-gchip${i === 0 ? ' ad-gchip-sel' : ''}" data-dueno="${c.k}">${c.et}</button>`).join('')}
      </div>
      <p class="pa-optional-hint ad-inv-regla" id="ad-inv-regla"></p>
      <div class="ad-gsto-lbl">🗂️ ¿De qué tipo?</div>
      <div class="ad-gchips" id="ad-inv-cats">
        ${AD_INV_CATS.map((c, i) =>
          `<button class="ad-gchip${i === 0 ? ' ad-gchip-sel' : ''}" data-cat="${c.k}">${c.et}</button>`).join('')}
      </div>
      <div class="ad-inv-fila3">
        <div>
          <div class="ad-gsto-lbl">🔢 Cantidad</div>
          <input id="ad-inv-cant" class="pa-inp-field" inputmode="numeric" value="1">
        </div>
        <div>
          <div class="ad-gsto-lbl">💵 Valor c/u</div>
          <input id="ad-inv-valor" class="pa-inp-field" inputmode="decimal" placeholder="0">
        </div>
        <div>
          <div class="ad-gsto-lbl">🗓 ¿Desde cuándo está en el aula?</div>
          <input id="ad-inv-fecha" class="pa-inp-field" type="date" value="${adHoy()}">
        </div>
      </div>
      <div class="ad-gsto-lbl" id="ad-inv-extra-lbl">✍️ Detalle (opcional)</div>
      <input id="ad-inv-nota" class="pa-inp-field" maxlength="120" autocomplete="off"
             placeholder="Marca, color, estado, número de serie…">
      <label class="ad-bit-sw" style="margin-top:10px">
        <input type="checkbox" id="ad-inv-fac">
        <span>Guardé el <strong>recibo o factura</strong> (es la prueba de que lo compraste tú)</span>
      </label>
      <button class="pa-generate-btn" id="ad-inv-add">➕ Anotar en el inventario</button>
    </div>

    ${t.mio.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🧑‍🏫 Mío — propiedad del docente (${t.mio.length})</div>
      <p class="pa-optional-hint">Comprado con tu dinero y <strong>sin reembolso</strong>. Es tuyo:
        puedes retirarlo cuando dejes el aula. Si algún día te lo pagan, tócalo en
        «✅ Ya me lo pagaron» y pasa a ser de la escuela, con la fecha escrita.</p>
      ${t.mio.slice().reverse().map(fila).join('')}
    </div>` : ''}

    ${t.esc.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🏫 De la escuela — bajo mi custodia (${t.esc.length})</div>
      <p class="pa-optional-hint">Herramientas y materiales del centro que usas en el aula. No son
        tuyos: se entregan al final del año o cuando la dirección los pida.</p>
      ${t.esc.slice().reverse().map(fila).join('')}
    </div>` : ''}

    ${t.don.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🎁 Donado al aula (${t.don.length})</div>
      <p class="pa-optional-hint">Lo que los padres o un tercero regalaron al aula: pertenece al
        centro, y queda escrito quién lo donó.</p>
      ${t.don.slice().reverse().map(fila).join('')}
    </div>` : ''}

    ${lista.length ? `
    <div class="pa-card ${adInvVence() ? 'ad-inv-acta-vence' : ''}">
      <div class="pa-card-title">🖊️ Acta de inventario</div>
      <p class="pa-optional-hint">El acta separa en dos cuadros lo <strong>tuyo</strong> y lo de la
        <strong>escuela</strong>, y la firman contigo la <strong>dirección</strong> y la
        <strong>directiva de padres</strong>. Imprime dos: una para dirección y otra para ti.
        Se recomienda repetirlo cada ${AD_INV_MESES_ACTA} meses y al cerrar el año.</p>
      <p class="pa-optional-hint ${adInvVence() ? 'ad-inv-aviso' : ''}">${ult
        ? (adInvVence()
            ? '⚠️ La última acta se firmó el <strong>' + adFechaBonita(ult.fecha) + '</strong> (' +
              adEsc(ult.quien || 'sin registrar') + '). Ya pasó el trimestre: toca firmar de nuevo.'
            : '✅ Última acta firmada el <strong>' + adFechaBonita(ult.fecha) + '</strong> — ' +
              adEsc(ult.quien || '') + '.')
        : '⚠️ Todavía no has hecho firmar ninguna acta. Hazlo en la próxima reunión: es lo que te respalda.'}</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="ad-inv-print">🖨️ Imprimir el acta para firmar</button>
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-inv-firmada">✅ Ya me la firmaron</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-inv-wa">📲 Enviar el resumen</button>
      </div>
      ${adInvActas().length ? `
      <div class="ad-inv-actas">
        <div class="ad-gsto-lbl">📚 Actas firmadas</div>
        ${adInvActas().slice().reverse().map(a => `
          <div class="ad-inv-acta">
            <span>🖊️ ${adFechaBonita(a.fecha)} · ${adEsc(a.quien || '')}</span>
            <span class="ad-inv-acta-n">${a.nMio || 0} mías · ${a.nEsc || 0} del centro</span>
          </div>`).join('')}
      </div>` : ''}
    </div>` : `
    <div class="pa-card">
      <p class="pa-optional-hint">📦 Tu inventario está vacío. Empieza por lo que compraste tú:
        ese parlante, el abanico, la engrapadora. <strong>Anotarlo hoy es lo que te lo devuelve
        mañana</strong>, si te trasladan o cambia la dirección.</p>
    </div>`}`;

  document.getElementById('ad-inv-volver').addEventListener('click', () => { _adInvOn = 0; renderAdmin(); });

  /* La regla de propiedad se explica según lo que el maestro acaba de elegir:
     el campo extra también cambia (donante vs. detalle). */
  const regla = document.getElementById('ad-inv-regla');
  const extraLbl = document.getElementById('ad-inv-extra-lbl');
  const extraInp = document.getElementById('ad-inv-nota');
  const pintarRegla = k => {
    if (k === 'mio') {
      regla.innerHTML = '🧑‍🏫 <strong>Es tuyo.</strong> Lo compraste con tu dinero y no te lo han ' +
        'reembolsado: figura como propiedad del docente y puedes retirarlo.';
      extraLbl.textContent = '✍️ Detalle (opcional)';
      extraInp.placeholder = 'Marca, color, estado, número de serie…';
    } else if (k === 'donado') {
      regla.innerHTML = '🎁 <strong>Es del centro.</strong> Lo donaron al aula; queda escrito quién ' +
        'lo dio para que se le pueda agradecer y nadie lo reclame después.';
      extraLbl.textContent = '🙋 ¿Quién lo donó?';
      extraInp.placeholder = 'Ej.: Familia Sevilla · Sociedad de Padres';
    } else {
      regla.innerHTML = '🏫 <strong>Es del centro.</strong> Está bajo tu custodia: lo usas, lo cuidas ' +
        'y lo entregas al final del año o cuando dirección lo pida.';
      extraLbl.textContent = '✍️ Detalle (opcional)';
      extraInp.placeholder = 'Marca, color, estado, número de serie…';
    }
  };
  pintarRegla('mio');

  const chipUnico = (cont, cb) => body.querySelectorAll('#' + cont + ' .ad-gchip').forEach(b =>
    b.addEventListener('click', () => {
      body.querySelectorAll('#' + cont + ' .ad-gchip').forEach(x => x.classList.remove('ad-gchip-sel'));
      b.classList.add('ad-gchip-sel');
      if (cb) cb(b);
    }));
  chipUnico('ad-inv-duenos', b => pintarRegla(b.dataset.dueno));
  chipUnico('ad-inv-cats');

  document.getElementById('ad-inv-add').addEventListener('click', () => {
    const nom = String(document.getElementById('ad-inv-nom').value || '').trim();
    if (nom.length < 3) { toast('📦 Escribe qué cosa es'); document.getElementById('ad-inv-nom').focus(); return; }
    const dueno = (body.querySelector('#ad-inv-duenos .ad-gchip-sel') || {}).dataset;
    const cat = (body.querySelector('#ad-inv-cats .ad-gchip-sel') || {}).dataset;
    const k = (dueno && dueno.dueno) || 'mio';
    const extra = String(document.getElementById('ad-inv-nota').value || '').trim();
    const arr = adInvLoad();
    arr.push({
      id: 'I' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      fecha: String(document.getElementById('ad-inv-fecha').value || adHoy()),
      nombre: nom, dueno: k, cat: (cat && cat.cat) || 'otro',
      cant: Math.max(1, parseInt(document.getElementById('ad-inv-cant').value, 10) || 1),
      valor: Number(String(document.getElementById('ad-inv-valor').value || '').replace(',', '.')) || 0,
      nota: k === 'donado' ? '' : extra,
      donante: k === 'donado' ? extra : '',
      factura: document.getElementById('ad-inv-fac').checked ? 1 : 0,
      escuela,
    });
    adInvSave(arr); renderAdmin();
    toast(k === 'mio' ? '🧑‍🏫 Anotado como TUYO: ya no es tu palabra contra la de nadie'
                      : '🏫 Anotado como del centro, bajo tu custodia');
  });

  body.querySelectorAll('[data-invpago]').forEach(b =>
    b.addEventListener('click', async () => {
      const quien = await metasPrompt('¿Quién te lo pagó? Queda escrito en el acta junto con la fecha de hoy.\n\nDesde este momento la cosa deja de ser tuya y pasa a ser **del centro**.', {
        icono: '✅', titulo: 'Ya me lo pagaron', okTxt: 'Sí, me lo pagaron',
        valida: v => String(v).trim().length >= 3 ? '' : 'Escribe quién te lo pagó (dirección, tesorería…).',
      });
      if (quien === null) return;
      const arr = adInvLoad();
      const x = arr.find(y => y.id === b.dataset.invpago); if (!x) return;
      x.dueno = 'escuela'; x.pagadoPor = String(quien).trim(); x.fechaPago = adHoy();
      adInvSave(arr); renderAdmin();
      toast('🏫 Pasa a la escuela: te lo pagaron y así queda en el acta');
    }));
  body.querySelectorAll('[data-invmio]').forEach(b =>
    b.addEventListener('click', () => {
      const arr = adInvLoad();
      const x = arr.find(y => y.id === b.dataset.invmio); if (!x) return;
      x.dueno = 'mio'; delete x.pagadoPor; delete x.fechaPago;
      adInvSave(arr); renderAdmin();
      toast('🧑‍🏫 Vuelve a figurar como tuyo');
    }));
  body.querySelectorAll('[data-invdel]').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Quitar esta cosa del inventario?\n\nLas actas ya firmadas no cambian: siguen valiendo tal como se imprimieron.',
        { icono: '🗑', titulo: 'Inventario del aula', okTxt: 'Sí, quitar' })) return;
      adUndoGuardar('Quitar algo del inventario del aula');
      adInvSave(adInvLoad().filter(y => y.id !== b.dataset.invdel));
      renderAdmin();
    }));

  const pr = document.getElementById('ad-inv-print');
  if (pr) pr.addEventListener('click', () => adPrintInventario(lista, d));
  const wa = document.getElementById('ad-inv-wa');
  if (wa) wa.addEventListener('click', () => adGastoEnviar(adInvTxtResumen(lista, d)));
  const fi = document.getElementById('ad-inv-firmada');
  if (fi) fi.addEventListener('click', async () => {
    const quien = await metasPrompt('¿Quién firmó el acta? (dirección, directiva de padres, ambos)\n\nSe guarda la fecha de hoy y cuántas cosas declaraste, para saber cuándo toca la siguiente.', {
      icono: '🖊️', titulo: 'Acta firmada', okTxt: 'Guardar',
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe quién la firmó.',
    });
    if (quien === null) return;
    const tt = adInvTotales(adInvLoad());
    const actas = adInvActas();
    actas.push({
      t: new Date().toISOString(), fecha: adHoy(), quien: String(quien).trim(),
      nMio: tt.mio.length, nEsc: tt.esc.length + tt.don.length, vMio: tt.vMio,
    });
    adInvActasSave(actas.slice(-12));
    renderAdmin();
    toast('🖊️ Acta registrada: quedas respaldado hasta la siguiente');
  });
}

function adInvTxtResumen(lista, d) {
  const t = adInvTotales(lista);
  const linea = (x, i) => (i + 1) + '. ' + (x.cant > 1 ? x.cant + ' × ' : '') + x.nombre +
    (x.valor ? ' — ' + adLps((Number(x.valor) || 0) * (Number(x.cant) || 1)) : '') +
    (x.factura ? ' (con recibo)' : '');
  return '📦 *INVENTARIO DEL AULA*\n' +
    (adDocenteNombre() ? adDocenteNombre() + '\n' : '') +
    (d.escuela ? String(d.escuela).trim() + '\n' : '') +
    (adGradoSeccion(d.grado, d.seccion) ? 'Grupo ' + adGradoSeccion(d.grado, d.seccion) + '\n' : '') +
    'Al ' + adFechaBonita(adHoy()) + '\n\n' +
    '*A) DE MI PROPIEDAD* (comprado por mí, sin reembolso):\n' +
    (t.mio.length ? t.mio.map(linea).join('\n') + '\n*Valor: ' + adLps(t.vMio) + '*' : 'Ninguno') + '\n\n' +
    '*B) DEL CENTRO, BAJO MI CUSTODIA:*\n' +
    (t.esc.length || t.don.length
      ? t.esc.concat(t.don).map(linea).join('\n')
      : 'Ninguno') + '\n\n' +
    'Solicito revisar y firmar el acta correspondiente.\n_Anotado con M.E.T.A.S_';
}

/* Acta imprimible: dos cuadros separados y tres firmas. Es el documento que
   se archiva en dirección y el que el maestro guarda en su portafolio. */
function adPrintInventario(lista, d) {
  const t = adInvTotales(lista);
  const ult = adInvUltimaActa();
  const fila = (x, i) => `<tr><td>${i + 1}</td><td>${adFechaBonita(x.fecha)}</td><td class="n">${adEsc(x.cant || 1)}</td>` +
    `<td>${adEsc(x.nombre)}${x.nota ? ' <em>(' + adEsc(x.nota) + ')</em>' : ''}${
      x.donante ? ' <em>— donó ' + adEsc(x.donante) + '</em>' : ''}${
      x.pagadoPor ? ' <em>— pagado por ' + adEsc(x.pagadoPor) + ' el ' + adFechaBonita(x.fechaPago) + '</em>' : ''}</td>` +
    `<td>${adEsc(adInvCatEt(x.cat))}</td><td>${x.factura ? 'Sí' : 'No'}</td>` +
    `<td class="n">${x.valor ? adLps((Number(x.valor) || 0) * (Number(x.cant) || 1)) : '—'}</td></tr>`;
  const cuadro = (arr, vacio) => arr.length
    ? `<table>
<thead><tr><th>#</th><th>Desde</th><th>Cant.</th><th>Descripción</th><th>Tipo</th><th>Recibo</th><th>Valor</th></tr></thead>
<tbody>${arr.map(fila).join('')}</tbody></table>`
    : `<p class="vacio">${vacio}</p>`;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Acta de inventario del aula</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:11.5px;color:#111;background:#fff;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
h2{font-size:12.5px;color:#1e3a7c;margin:5mm 0 2mm;border-bottom:1.5px solid #1e3a7c;padding-bottom:1mm;}
.sub{font-size:11px;color:#444;margin-bottom:4mm;}
table{width:100%;border-collapse:collapse;margin-bottom:3mm;}
th,td{border:1px solid #999;padding:3px 5px;text-align:left;vertical-align:top;}
th{background:#e8eef9;font-size:10.5px;}
td.n{text-align:right;white-space:nowrap;}
td em{color:#555;font-size:10.5px;}
.tot{margin:2mm 0 4mm;font-size:12.5px;font-weight:bold;}
.vacio{font-size:11px;color:#666;font-style:italic;margin-bottom:3mm;}
.declara{border:1.5px solid #1e3a7c;border-radius:4px;padding:3mm 4mm;margin:4mm 0;font-size:11px;line-height:1.6;background:#f7f9fe;}
.firmas{display:flex;gap:8mm;margin-top:18mm;}
.firma{flex:1;border-top:1.5px solid #333;text-align:center;padding-top:2mm;font-size:10.5px;line-height:1.4;}
.pie{margin-top:6mm;font-size:10px;color:#666;text-align:center;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}body{padding:8mm;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>📦 Acta de inventario del aula</h1>
<div class="sub">${adDocenteNombre() ? adEsc(adDocenteNombre()) + ' · ' : ''}${
  d.escuela ? adEsc(String(d.escuela).trim()) + ' · ' : ''}${
  adGradoSeccion(d.grado, d.seccion) ? 'Grupo ' + adEsc(adGradoSeccion(d.grado, d.seccion)) + ' · ' : ''}Levantada el ${adFechaBonita(adHoy())}${
  ult ? ' · Acta anterior: ' + adFechaBonita(ult.fecha) : ' · Primera acta'}</div>

<h2>Cuadro A — Bienes propiedad del docente</h2>
${cuadro(t.mio, 'El docente no declara bienes propios en esta aula.')}
${t.mio.length ? `<div class="tot">Valor declarado: ${adLps(t.vMio)}</div>` : ''}

<h2>Cuadro B — Bienes del centro educativo bajo custodia del docente</h2>
${cuadro(t.esc, 'No hay bienes del centro asignados a esta aula.')}

${t.don.length ? `<h2>Cuadro C — Bienes donados al aula (propiedad del centro)</h2>
${cuadro(t.don, '')}` : ''}

<div class="declara">
  <strong>Se hace constar que:</strong><br>
  1. Los bienes del <strong>Cuadro A</strong> fueron adquiridos por el docente
  <strong>con recursos propios</strong> y <strong>no le han sido reembolsados</strong> por el centro
  educativo ni por la sociedad de padres de familia. En consecuencia son de su
  <strong>propiedad personal</strong>, permanecen en el aula por su voluntad para beneficio de los
  estudiantes, y podrá retirarlos al terminar su labor en este grupo o centro.<br>
  2. Los bienes de los <strong>Cuadros B y C</strong> son <strong>propiedad del centro educativo</strong>.
  El docente los recibe <strong>bajo custodia</strong>, se compromete a cuidarlos y darles uso
  pedagógico, y a entregarlos al finalizar el año escolar o cuando la dirección lo requiera.<br>
  3. Si el centro reembolsa al docente el valor de algún bien del Cuadro A, ese bien pasa a ser
  propiedad del centro desde la fecha del pago, y se hará constar en el acta siguiente.<br>
  4. Las partes revisaron físicamente los bienes aquí listados y firman en señal de conformidad.
  Este inventario se actualiza cada ${AD_INV_MESES_ACTA} meses y al cierre del año escolar.
</div>

<div class="firmas">
  <div class="firma">Docente<br>${adDocenteNombre() ? adEsc(adDocenteNombre()) : '_______________'}</div>
  <div class="firma">Dirección del centro<br>Nombre y sello</div>
  <div class="firma">Directiva de padres de familia<br>Presidente/a</div>
</div>
<div class="pie">Imprima dos ejemplares: uno para la dirección y otro para el docente. · Generado con M.E.T.A.S</div>
</body></html>`;
  adPrintAbrir(html);
}

function adRenderColecta(body, d) {
  const c = adColecta(d, _adColectaId);
  if (!c) { _adColectaId = null; renderAdmin(); return; }
  const t = adColectaTotales(c);
  const pagaron = adColectaDieron(c, d);
  const esp = adColectaEsperados(c, d);
  const fuera = adColectaFuera(c, d);

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="ad-eco-volver">🗂️ Mis colectas</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">💰 ${adEsc(c.concepto)}</div>
      <p class="pa-optional-hint">${adFechaBonita(c.fecha)} · aporte sugerido: <strong>${adLps(c.montoAlumno)}</strong><br>
        <strong>Toca</strong> un alumno para marcar que dio el aporte sugerido.
        <strong>Toca de nuevo</strong> a quien pagó para <strong>cambiar su monto</strong>
        (hermanos, becados, abonos) o quitarlo. Lo marcado = dinero en mano.</p>
      <div class="ad-recibo-hint">🧾 Al marcar, la familia de ese alumno recibe solo su
        <strong>recibo</strong> en el asistente de padres, con el nombre completo del alumno, el monto,
        la fecha y quién recibió. Si corriges el monto, el recibo se reemite; si quitas la marca, se anula.<br>
        <strong>Si un padre pregunta por el «N.º de recibo»:</strong> es el número de ese comprobante,
        como el de una factura. No es una clave y no tiene que memorizarlo ni escribirlo en ninguna parte;
        sirve para que usted y él hablen de la misma entrega. Tú lo ves aquí manteniendo pulsado al alumno,
        y sale en el informe imprimible.</div>
      <div class="ad-resumen">
        <button class="ad-resumen-edit" id="ad-col-total" title="Decir qué alumnos no cuentan (de prueba, retirados)">✅ Dieron: <strong>${pagaron}/${esp}</strong> <span aria-hidden="true">✏️</span></button>
        <span>📊 Participación: <strong>${adColectaPct(c, d)} %</strong></span>
        <span>🎯 Total esperado: <strong>${adLps(adColectaMeta(c, d))}</strong></span>
        <span>💵 Recaudado: <strong>${adLps(t.rec)}</strong></span>
        <span>📥 Falta por recaudar: <strong>${adLps(adColectaPorRecaudar(c, d))}</strong></span>
        <span>🧾 Gastado: <strong>${adLps(t.gas)}</strong></span>
        <span class="${t.saldo >= 0 ? 'ad-ok' : 'ad-mal'}">💼 Saldo: <strong>${adLps(t.saldo)}</strong></span>
      </div>
      <div class="ad-barra">
        <div class="ad-barra-rot">📊 Participación del grupo: <strong>${adColectaPct(c, d)} %</strong> · ${pagaron} de ${esp}</div>
        ${adColectaBarraSvg(c, d, 18)}
        <div class="ad-barra-esc" aria-hidden="true"><span>0 %</span><span>25 %</span><span>50 %</span><span>75 %</span><span>100 %</span></div>
        ${adColectasCompletasTxt(d) ? `<p class="ad-col-completas">🗂️ Colectas del grupo: <strong>${adColectasCompletasTxt(d)}</strong> completas</p>` : ''}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-col-wa">📲 ${adColectasCompletasTxt(d) ? 'Enviar solo esta colecta' : 'Enviar resumen por WhatsApp'}</button>
        ${adColectasCompletasTxt(d) ? '<button class="pa-generate-btn ad-btn-sec" id="ad-col-wa-todas">📲 Enviar con todas las colectas del grupo</button>' : ''}
      </div>
      <p class="pa-optional-hint">El resumen lleva solo cifras: ningún nombre ni número de lista.</p>
      ${(() => {
        /* Quiénes faltan: SOLO en esta pantalla. No tiene botón de enviar ni
           de copiar a propósito: es para que el maestro le recuerde a cada
           familia en privado, no para señalar a un niño en el grupo. */
        const faltan = d.lista.filter(a => !(c.pagos && c.pagos[a.num] != null) && !fuera.has(String(a.num)));
        if (!faltan.length) return esp ? '<p class="ad-faltan-ok">🎉 Ya dieron todos.</p>' : '';
        return `<details class="ad-faltan">
          <summary>⏳ Faltan por dar: <strong>${faltan.length}</strong> · ver quiénes</summary>
          <p class="ad-faltan-priv">🔒 Solo lo ves tú: esta lista no sale en el mensaje de WhatsApp.</p>
          <ol class="ad-faltan-lista">${faltan.map(a =>
            `<li><strong>#${a.num}</strong> ${adEsc(a.nombre) || '—'}</li>`).join('')}</ol>
        </details>`;
      })()}
      <div class="ad-chips">
        ${d.lista.map(a => {
          const pagado = c.pagos && c.pagos[a.num] != null;
          const nom = adPrimerNombre(a.nombre);
          const especial = pagado && Number(c.pagos[a.num]) !== Number(c.montoAlumno);
          const noCuenta = fuera.has(String(a.num));
          /* el title lleva el folio: si un padre reclama, el maestro lo lee aquí */
          const rot = pagado
            ? adEsc(a.nombre) + ' · recibo ' + adReciboFolio(c, a.num) +
              ' del ' + adFechaBonita((c.pagosF && c.pagosF[a.num]) || c.fecha)
            : adEsc(a.nombre);
          return `<button class="ad-chip ${pagado ? 'ad-chip-on' : ''}${noCuenta ? ' ad-chip-fuera' : ''}" data-num="${a.num}"
            title="${rot}${noCuenta ? ' · no cuenta en esta colecta' : ''}">
            <span class="ad-chip-num">#${a.num}${pagado ? ' ✓' : ''}</span>
            ${nom ? `<span class="ad-chip-nom">${adEsc(nom)}</span>` : ''}
            ${pagado ? `<span class="ad-chip-monto${especial ? ' ad-chip-monto-esp' : ''}">${adLps(c.pagos[a.num])}</span>` : ''}
            ${noCuenta && !pagado ? '<span class="ad-chip-monto">no cuenta</span>' : ''}</button>`;
        }).join('')}
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🧾 Gastos de esta colecta</div>
      ${(c.gastos || []).length ? c.gastos.map((g, i) => `
        <div class="ad-gasto-row">
          <span>${adFechaBonita(g.f)} · ${adEsc(g.d)}</span>
          <span><strong>${adLps(g.m)}</strong> <button class="ad-al-del ad-gasto-del" data-gi="${i}" aria-label="Borrar gasto">✕</button></span>
        </div>`).join('') : '<p class="pa-optional-hint">Sin gastos todavía.</p>'}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-add-gasto">➕ Anotar gasto</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-informe">🖨️ Informe para padres</button>
        <button class="pa-generate-btn ad-btn-sec ad-btn-peligro" id="ad-borrar-colecta">🗑 Eliminar colecta</button>
      </div>
    </div>`;

  document.getElementById('ad-eco-volver').addEventListener('click', () => { _adColectaId = null; renderAdmin(); });

  body.querySelectorAll('.ad-chip').forEach(ch =>
    ch.addEventListener('click', async () => {
      const num = ch.dataset.num;
      const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
      cc.pagos = cc.pagos || {};
      cc.pagosF = cc.pagosF || {};   /* fecha del movimiento, para el recibo */
      if (cc.pagos[num] != null) {
        /* ya pagó → editar su monto (hermanos/becados/abonos) o quitar */
        const al = dd.lista.find(a => String(a.num) === String(num)) || {};
        const quien = '#' + num + (al.nombre ? ' ' + adPrimerNombre(al.nombre) : '');
        const r = await metasPrompt('¿Cuánto aportó **' + quien + '**? (Lempiras)\nEscribe la cantidad real (ej. **500**). El **0** o vacío quita la marca.', {
          icono: '💰', titulo: 'Aporte del alumno', inputmode: 'decimal',
          value: String(cc.pagos[num]), okTxt: 'Guardar',
          valida: v => {
            const s = String(v).trim();
            if (s === '') return '';
            return isNaN(Number(s.replace(',', '.'))) ? 'Escribe un número (o vacío para quitar).' : '';
          },
        });
        if (r === null) return;   // canceló: no cambia nada
        const s = String(r).trim();
        const n = s === '' ? 0 : Number(s.replace(',', '.'));
        if (!(n > 0)) { delete cc.pagos[num]; delete cc.pagosF[num]; }
        else {
          cc.pagos[num] = n;
          /* corregir el monto NO cambia el día en que entró el dinero: el
             recibo se reemite con la cifra buena y la fecha original */
          if (!cc.pagosF[num]) cc.pagosF[num] = adHoy();
        }
      } else {
        cc.pagos[num] = cc.montoAlumno;   // aporte sugerido (marca rápida)
        cc.pagosF[num] = adHoy();
      }
      adSave(dd); renderAdmin();
    }));

  document.getElementById('ad-col-wa').addEventListener('click', () => {
    const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
    adGastoEnviar(adColectaTxtResumen(cc, dd, false));
  });
  const waTodas = document.getElementById('ad-col-wa-todas');
  if (waTodas) waTodas.addEventListener('click', () => {
    const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
    adGastoEnviar(adColectaTxtResumen(cc, dd, true));
  });

  document.getElementById('ad-col-total').addEventListener('click', async () => {
    const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
    const nums = dd.lista.map(a => String(a.num));
    const ahora = [...adColectaFuera(cc, dd)].join(', ');
    const r = await metasPrompt('¿Qué alumnos **NO cuentan** en esta colecta?\nEscribe sus **números de lista**, separados por coma (ej. **' +
      nums.slice(-2).join(', ') + '** para dos alumnos de prueba). No entran en el total ni en el informe impreso.\nVacío: cuentan los ' + nums.length + '.', {
      icono: '✅', titulo: 'Alumnos que no cuentan', inputmode: 'text',
      value: ahora, okTxt: 'Guardar',
      valida: v => {
        const partes = String(v).split(/[\s,;y]+/).filter(Boolean);
        const malos = partes.filter(p => !nums.includes(String(Number(p))));
        if (malos.length) return 'No hay nadie con el número ' + malos[0] + ' en la lista.';
        return new Set(partes.map(Number)).size >= nums.length ? 'Tiene que contar al menos un alumno.' : '';
      },
    });
    if (r === null) return;
    const lista = [...new Set(String(r).split(/[\s,;y]+/).filter(Boolean).map(Number))].sort((x, y) => x - y);
    delete cc.esperados;
    if (lista.length) cc.noCuentan = lista; else delete cc.noCuentan;
    adSave(dd); renderAdmin();
  });

  document.getElementById('ad-add-gasto').addEventListener('click', async () => {
    const desc = await metasPrompt('¿En qué se gastó?', {
      icono: '🧾', titulo: 'Anotar gasto', okTxt: 'Siguiente',
      valida: v => String(v).trim().length >= 3 ? '' : 'Describe el gasto (mínimo 3 letras).',
    });
    if (desc === null) return;
    const monto = await metasPrompt('¿Cuánto costó? (Lempiras)', {
      icono: '🧾', titulo: 'Anotar gasto', inputmode: 'decimal', okTxt: 'Guardar',
      valida: v => (Number(String(v).replace(',', '.')) > 0) ? '' : 'Escribe un monto mayor que cero.',
    });
    if (monto === null) return;
    const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
    cc.gastos = cc.gastos || [];
    cc.gastos.push({ d: String(desc).trim(), m: Number(String(monto).replace(',', '.')), f: adHoy() });
    adSave(dd); renderAdmin();
  });

  body.querySelectorAll('.ad-gasto-del').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Borrar este gasto?', { icono: '🧾', titulo: 'Gastos', okTxt: 'Sí, borrar' })) return;
      const dd = adLoad(); const cc = adColecta(dd, _adColectaId); if (!cc) return;
      adUndoGuardar('Borrar gasto de «' + cc.concepto + '»');
      cc.gastos.splice(+b.dataset.gi, 1);
      adSave(dd); renderAdmin();
    }));

  document.getElementById('ad-borrar-colecta').addEventListener('click', async () => {
    if (!await metasConfirm('¿Eliminar la colecta **' + c.concepto + '** con todos sus pagos y gastos?', { icono: '🗑', titulo: 'Economía', okTxt: 'Sí, eliminar' })) return;
    const dd = adLoad();
    adUndoGuardar('Eliminar colecta «' + c.concepto + '»');
    dd.colectas = dd.colectas.filter(x => x.id !== _adColectaId);
    adSave(dd); _adColectaId = null; renderAdmin();
    toast('🗑 Colecta eliminada — si fue un error, restaura en 🕘 (pestaña Alumnos)');
  });

  document.getElementById('ad-informe').addEventListener('click', () => adInformeColecta(d, c));
}

/* Informe imprimible: transparencia con los padres (acta de cuentas) */
function adInformeColecta(d, c) {
  const t = adColectaTotales(c);
  /* los que no cuentan (de prueba, retirados) no salen en el papel que se
     reparte; salvo que tengan dinero marcado: ese se rinde, esté donde esté */
  const fuera = adColectaFuera(c, d);
  const grupo = adGrupoTxt(d);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Informe económico — ${adEsc(c.concepto)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;margin-bottom:5mm;}
th,td{border:1px solid #999;padding:3px 6px;text-align:left;}
th{background:#e8eef9;font-size:11px;}
.tot{display:flex;flex-wrap:wrap;gap:2mm 8mm;margin:4mm 0;font-size:13px;font-weight:bold;}
.barra{margin:2mm 0 4mm;break-inside:avoid;}
.barra svg{display:block;}
.barra-rot{font-size:12px;margin-bottom:1.5mm;}
.barra-esc{display:flex;justify-content:space-between;font-size:9.5px;color:#555;margin-top:1mm;}
/* las barras de TODAS las colectas del grupo: el informe es de una, pero la
   familia pregunta «¿y la rifa cómo va?», y la respuesta cabe en unas filas */
table.cols{margin:1mm 0 0;break-inside:avoid;}
table.cols td{border:none;border-bottom:1px solid #ddd;padding:2px 6px;vertical-align:middle;font-size:11px;}
table.cols td.cn{width:38%;}
table.cols td.cn small{color:#555;font-size:9.5px;}
table.cols td.cd,table.cols td.cp{white-space:nowrap;width:1%;}
table.cols tr.esta td{font-weight:bold;}
.firmas{display:flex;gap:14mm;margin-top:14mm;}
.firma{flex:1;border-top:1.5px solid #333;text-align:center;padding-top:2mm;font-size:11px;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>💰 Informe económico — ${adEsc(c.concepto)}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}Acordado el ${adFechaBonita(c.fecha)} ·
Aporte sugerido: ${adLps(c.montoAlumno)} (cada aporte real se detalla abajo; lo que falta por recaudar se cuenta con el sugerido) · Generado con M.E.T.A.S el ${adFechaBonita(adHoy())}</div>
<table>
<thead><tr><th>#</th><th>Alumno/a</th><th>Aportó</th><th>Fecha</th><th>Monto</th><th>Recibo</th></tr></thead>
<tbody>
${d.lista.filter(a => !fuera.has(String(a.num)) || (c.pagos && c.pagos[a.num] != null)).map(a => {
  const m = c.pagos && c.pagos[a.num];
  /* el mismo folio que ya tiene la familia en el asistente: el papel y la nube
     hablan del mismo movimiento */
  const f = m != null ? adFechaBonita((c.pagosF && c.pagosF[a.num]) || c.fecha) : '';
  return `<tr><td>${a.num}</td><td>${adEsc(a.nombre) || '—'}</td><td>${m != null ? '✔ Sí' : '—'}</td><td>${f}</td><td>${m != null ? adLps(m) : ''}</td><td>${m != null ? adReciboFolio(c, a.num) : ''}</td></tr>`;
}).join('')}
</tbody></table>
${(c.gastos || []).length ? `
<table><thead><tr><th>Fecha</th><th>Gasto</th><th>Monto</th></tr></thead><tbody>
${c.gastos.map(g => `<tr><td>${adFechaBonita(g.f)}</td><td>${adEsc(g.d)}</td><td>${adLps(g.m)}</td></tr>`).join('')}
</tbody></table>` : ''}
<div class="tot">
  <span>✅ Dieron: ${adColectaDieron(c, d)} de ${adColectaEsperados(c, d)}</span>
  <span>📊 Participación: ${adColectaPct(c, d)} %</span>
  <span>⏳ Faltan: ${Math.max(0, adColectaEsperados(c, d) - adColectaDieron(c, d))}</span>
  <span>🎯 Total esperado: ${adLps(adColectaMeta(c, d))} (${adColectaEsperados(c, d)} × ${adLps(c.montoAlumno)})</span>
  <span>💵 Recaudado: ${adLps(t.rec)}</span>
  <span>📥 Falta por recaudar: ${adLps(adColectaPorRecaudar(c, d))}</span>
  <span>🧾 Gastado: ${adLps(t.gas)}</span>
  <span>💼 Saldo: ${adLps(t.saldo)}</span>
</div>
${(() => {
  /* La barra va en SVG y no con fondos de CSS: el navegador imprime «sin
     gráficos de fondo» de fábrica, y una barra hecha con background saldría
     en blanco en el papel. El relleno de un SVG se imprime siempre, y en la
     fotocopiadora en blanco y negro se sigue viendo la parte llena. */
  return `<div class="barra">
  <div class="barra-rot">📊 Participación del grupo: <strong>${adColectaPct(c, d)} %</strong> · ${adColectaDieron(c, d)} de ${adColectaEsperados(c, d)} alumnos</div>
  ${adColectaBarraSvg(c, d, 22)}
  <div class="barra-esc"><span>0 %</span><span>25 %</span><span>50 %</span><span>75 %</span><span>100 %</span></div>
  ${adColectasCompletasTxt(d)
    ? `<div class="barra-rot" style="margin-top:3mm">🗂️ Colectas del grupo: <strong>${adColectasCompletasTxt(d)}</strong> completas</div>
  <table class="cols">
  <tbody>${d.colectas.map(x => `<tr${x.id === c.id ? ' class="esta"' : ''}>
    <td class="cn">${adEsc(x.concepto)}${x.id === c.id ? ' <em>(este informe)</em>' : ''}<br><small>${adFechaBonita(x.fecha)}</small></td>
    <td class="cd">${adColectaDieron(x, d)} de ${adColectaEsperados(x, d)}</td>
    <td class="cp">${adColectaPct(x, d)} %${adColectaCompleta(x, d) ? ' ✔' : ''}</td>
    <td class="cb">${adColectaBarraSvg(x, d, 10)}</td></tr>`).join('')}</tbody></table>`
    : ''}
</div>`;
})()}
<div class="firmas">
  <div class="firma">Docente</div>
  <div class="firma">Padre/Madre de familia (testigo)</div>
  <div class="firma">Dirección</div>
</div>
</body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ 📋 ASISTENCIA — solo lo excepcional ══════════════ */
const AD_MESES_ES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
  'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
/* 'YYYY-MM' → 'jul. 2026' */
function adMesLabel(m) {
  const p = String(m || '').split('-');
  return (AD_MESES_ES[(+p[1]) - 1] || m) + ' ' + (p[0] || '');
}

/* 'YYYY-MM-DD' → 'mié. 29' (encabezado corto del día por día) */
const AD_DIAS_ES = ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'];
function adDiaLabel(f) {
  const p = String(f || '').split('-');
  if (p.length !== 3) return f;
  const dt = new Date(+p[0], (+p[1]) - 1, +p[2]);
  return AD_DIAS_ES[dt.getDay()] + ' ' + (+p[2]);
}

function adRenderAsis(body, d) {
  if (!d.lista.length) { adSinLista(body, 'el pase de lista'); return; }
  const hoy = adHoy();
  const fechaSel = body.dataset.fecha || hoy;
  const reg = d.asistencia.find(r => r.f === fechaSel) || { f: fechaSel, aus: {} };

  /* resumen navegable por meses: los que tienen datos + el mes actual */
  const mesSel = body.dataset.mes || fechaSel.slice(0, 7);
  /* dos maneras de mirar el mismo mes: 'dia' = qué pasó cada día ·
     'mes' = cuánto acumula cada alumno (lo de siempre) */
  const vista = body.dataset.vista || 'dia';
  const mesesDisp = [...new Set(
    d.asistencia.map(r => r.f.slice(0, 7)).concat([hoy.slice(0, 7), mesSel])
  )].filter(Boolean).sort().reverse();
  const delMes = d.asistencia.filter(r => r.f.startsWith(mesSel));
  const resumen = {};
  delMes.forEach(r => Object.keys(r.aus || {}).forEach(n => {
    resumen[n] = resumen[n] || { A: 0, E: 0 };
    resumen[n][r.aus[n]] = (resumen[n][r.aus[n]] || 0) + 1;
  }));
  /* días con registro, el más reciente arriba (así el maestro ve primero
     lo de hoy y lo de ayer, que es lo que corrige a diario) */
  const dias = delMes.filter(r => Object.keys(r.aus || {}).length)
    .sort((a, b) => a.f < b.f ? 1 : -1);
  const nomDe = num => {
    const a = d.lista.find(x => String(x.num) === String(num));
    return a ? adPrimerNombre(a.nombre) : '';
  };
  const totalMes = { A: 0, E: 0 };
  Object.keys(resumen).forEach(n => { totalMes.A += resumen[n].A || 0; totalMes.E += resumen[n].E || 0; });

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📋 Pase de lista</div>
      <p class="pa-optional-hint">Toca solo a los que <strong>faltaron</strong>: un toque =
        🚫 ausente (NSP) · dos toques = 📝 con excusa · tres toques = presente otra vez.
        Los demás cuentan como presentes sin tocar nada.</p>
      <div class="pa-field"><label>Fecha</label>
        <input type="date" id="ad-asis-fecha" class="pa-inp-field" value="${fechaSel}" max="${hoy}"></div>
      <div class="ad-chips">
        ${d.lista.map(a => {
          const st = reg.aus[a.num] || '';
          const cls = st === 'A' ? 'ad-chip-aus' : st === 'E' ? 'ad-chip-exc' : '';
          const ico = st === 'A' ? ' 🚫' : st === 'E' ? ' 📝' : '';
          const nom = adPrimerNombre(a.nombre);
          return `<button class="ad-chip ${cls}" data-num="${a.num}" title="${adEsc(a.nombre)}">
            <span class="ad-chip-num">#${a.num}${ico}</span>
            ${nom ? `<span class="ad-chip-nom">${adEsc(nom)}</span>` : ''}</button>`;
        }).join('')}
      </div>
      <p class="pa-optional-hint" style="margin-top:8px">
        ${Object.keys(reg.aus).length
          ? '🚫 ' + Object.entries(reg.aus).filter(([, v]) => v === 'A').length + ' ausentes · 📝 ' +
            Object.entries(reg.aus).filter(([, v]) => v === 'E').length + ' con excusa'
          : '✅ Todos presentes este día.'}
      </p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📨 Excusas de las familias</div>
      <p class="pa-optional-hint" style="margin-top:-2px">Lo que los padres avisaron por el asistente.
        <strong>Apruébala aquí</strong> y el día queda marcado 📝 con excusa en el pase de lista.</p>
      <div id="ad-asis-exc"><p class="pa-optional-hint">⏳ Revisando el buzón…</p></div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-exc-refresh">🔄 Revisar buzón</button>
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📊 Ausencias</div>
      <p class="pa-optional-hint" style="margin-top:-2px">Elige el mes y mira las faltas
        <strong>día por día</strong> (qué pasó cada día) o el <strong>resumen del mes</strong>
        (cuánto acumula cada alumno).</p>
      <div class="ad-meses">
        ${mesesDisp.map(m => `<button class="ad-mes-btn ${m === mesSel ? 'ad-mes-on' : ''}" data-mes="${m}">${adMesLabel(m)}</button>`).join('')}
      </div>
      <div class="ad-meses" role="group" aria-label="Cómo ver las ausencias">
        <button class="ad-mes-btn ${vista === 'dia' ? 'ad-mes-on' : ''}" data-vista="dia">🗓 Día por día</button>
        <button class="ad-mes-btn ${vista === 'mes' ? 'ad-mes-on' : ''}" data-vista="mes">📊 Resumen del mes</button>
      </div>
      ${!Object.keys(resumen).length
        ? `<p class="pa-optional-hint">Sin ausencias registradas en <strong>${adMesLabel(mesSel)}</strong>. 🎉</p>`
        : vista === 'dia' ? `
      <div class="ad-resumen">
        <span>🗓 Días con faltas: <strong>${dias.length}</strong></span>
        <span>🚫 Ausencias: <strong>${totalMes.A}</strong></span>
        <span>📝 Excusas: <strong>${totalMes.E}</strong></span>
      </div>
      ${dias.map(r => {
        const nums = Object.keys(r.aus);
        const aus = nums.filter(n => r.aus[n] === 'A');
        const exc = nums.filter(n => r.aus[n] === 'E');
        const quien = arr => arr.map(n => '#' + n + (nomDe(n) ? ' ' + adEsc(nomDe(n)) : '')).join(' · ');
        return `
        <button class="ad-colecta-row ad-dia-row" data-dia="${r.f}"
                title="Abrir el pase de lista de ese día">
          <span class="ad-cr-txt">
            <strong>${adDiaLabel(r.f)} · ${adFechaBonita(r.f)}</strong>
            ${r.f === hoy ? ' <span class="ad-dia-hoy">hoy</span>' : ''}<br>
            ${aus.length ? `<small>🚫 ${quien(aus)}</small><br>` : ''}
            ${exc.length ? `<small>📝 ${quien(exc)}</small>` : ''}
          </span>
          <span class="ad-cr-arrow">›</span>
        </button>`;
      }).join('')}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-asis-print-dias">🖨️ Imprimir día por día (${adMesLabel(mesSel)})</button>
      </div>` : `
      <table class="ad-tabla">
        <thead><tr><th>#</th><th>Alumno/a</th><th>🚫 Ausencias</th><th>📝 Excusas</th></tr></thead>
        <tbody>
        ${d.lista.filter(a => resumen[a.num]).map(a => `
          <tr><td>#${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
          <td>${resumen[a.num].A || 0}</td><td>${resumen[a.num].E || 0}</td></tr>`).join('')}
        </tbody>
      </table>
      <button class="pa-generate-btn ad-btn-sec" id="ad-asis-print">🖨️ Imprimir resumen (${adMesLabel(mesSel)})</button>`}
    </div>`;

  document.getElementById('ad-asis-fecha').addEventListener('change', e => {
    const f = e.target.value || hoy;
    body.dataset.fecha = f;
    body.dataset.mes = f.slice(0, 7);   // el resumen sigue al mes de la fecha elegida
    adRenderAsis(body, adLoad());
  });

  body.querySelectorAll('[data-mes]').forEach(b => b.addEventListener('click', () => {
    body.dataset.mes = b.dataset.mes;
    adRenderAsis(body, adLoad());
  }));

  body.querySelectorAll('[data-vista]').forEach(b => b.addEventListener('click', () => {
    body.dataset.vista = b.dataset.vista;
    adRenderAsis(body, adLoad());
  }));

  /* tocar un día lo sube al pase de lista de arriba: corregir la falta de
     ayer no obliga a buscar la fecha en el calendario */
  body.querySelectorAll('.ad-dia-row').forEach(b => b.addEventListener('click', () => {
    body.dataset.fecha = b.dataset.dia;
    adRenderAsis(body, adLoad());
    try { document.getElementById('ad-asis-fecha').scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
    toast('🗓 Pase de lista del ' + adFechaBonita(b.dataset.dia));
  }));

  body.querySelectorAll('.ad-chip').forEach(ch =>
    ch.addEventListener('click', () => {
      const num = ch.dataset.num;
      const dd = adLoad();
      let r = dd.asistencia.find(x => x.f === fechaSel);
      if (!r) { r = { f: fechaSel, aus: {} }; dd.asistencia.push(r); }
      const st = r.aus[num] || '';
      if (st === '') r.aus[num] = 'A';
      else if (st === 'A') r.aus[num] = 'E';
      else delete r.aus[num];
      /* días sin excepciones no ocupan espacio */
      if (!Object.keys(r.aus).length) dd.asistencia = dd.asistencia.filter(x => x !== r);
      dd.asistencia.sort((a, b) => a.f < b.f ? -1 : 1);
      adSave(dd);
      body.dataset.fecha = fechaSel;
      adRenderAsis(body, adLoad());
    }));

  const pr = document.getElementById('ad-asis-print');
  if (pr) pr.addEventListener('click', () => adPrintAsis(adLoad(), mesSel));
  const prd = document.getElementById('ad-asis-print-dias');
  if (prd) prd.addEventListener('click', () => adPrintAsisDias(adLoad(), mesSel));
  document.getElementById('ad-exc-refresh').addEventListener('click', () => adAsisExcusas(body, adLoad(), true));
  adAsisExcusas(body, d, false);
}

/* ── 📨 Excusas del buzón, dentro del pase de lista ──
   El padre avisa la falta por el asistente; aquí el maestro la APRUEBA
   de un toque y el día queda 📝 con excusa (y sube solo a la nube, así
   la familia ve que se le tomó en cuenta). */
async function adAsisExcusas(body, d, forzar) {
  const cont = document.getElementById('ad-asis-exc');
  if (!cont) return;
  const hint = t => '<p class="pa-optional-hint">' + t + '</p>';
  const r = await avBuzonFilas(d, forzar);
  if (r.err === 'sinclaves') { cont.innerHTML = hint('Aún no hay claves de familia en este grupo: entrégalas en 👥 Alumnos y las familias podrán avisar sus faltas.'); return; }
  if (r.err === 'offline') { cont.innerHTML = hint('📴 Sin internet: las excusas se revisan con conexión. El pase de lista funciona igual.'); return; }
  if (r.err === 'red') { cont.innerHTML = hint('⚠️ No se pudo revisar el buzón. Toca «🔄 Revisar buzón» para reintentar.'); return; }

  const numDe = {};
  d.lista.forEach(a => {
    const c = adClaveFamilia(d.id, a.num, false);
    if (c) numDe[c] = a.num;
  });
  /* solo las excusas estructuradas del asistente, más recientes primero */
  const excusas = [];
  (r.rows || []).forEach(m => {
    const ex = avParseExcusa(m.texto);
    if (!ex || !numDe[m.codigo]) return;
    excusas.push({ num: numDe[m.codigo], fecha: ex.fecha, razon: ex.razon, creado: m.creado_en });
  });
  if (!excusas.length) { cont.innerHTML = hint('Sin excusas de las familias por ahora.'); return; }
  excusas.sort((a, b) => a.fecha < b.fecha ? 1 : -1);

  const estadoDe = (fecha, num) => {
    const reg = (adLoad().asistencia || []).find(x => x.f === fecha);
    return (reg && reg.aus && reg.aus[num]) || '';
  };
  const nomDe = num => {
    const a = d.lista.find(x => String(x.num) === String(num));
    return a ? adPrimerNombre(a.nombre) : '';
  };
  const pendientes = excusas.filter(e => estadoDe(e.fecha, e.num) !== 'E');

  cont.innerHTML = `
    ${pendientes.length ? `<p class="pa-optional-hint" style="margin-top:0">
      🔔 <strong>${pendientes.length}</strong> excusa(s) esperando tu aprobación.</p>` : ''}
    ${excusas.slice(0, 25).map(e => {
      const st = estadoDe(e.fecha, e.num);
      const quien = '#' + e.num + (nomDe(e.num) ? ' ' + adEsc(nomDe(e.num)) : '');
      const sello = st === 'E'
        ? '<small style="color:#15803d">✅ Aprobada: ese día quedó 📝 con excusa.</small>'
        : st === 'A'
          ? `<small style="color:#b45309">🚫 Ese día está como ausente sin excusa.</small><br>
             <button class="pa-generate-btn ad-btn-sec ad-exc-ok" data-num="${e.num}" data-fecha="${e.fecha}"
                     style="margin-top:6px">✔ Aprobar excusa</button>`
          : `<button class="pa-generate-btn ad-btn-sec ad-exc-ok" data-num="${e.num}" data-fecha="${e.fecha}"
                     style="margin-top:6px">✔ Aprobar y marcar 📝</button>`;
      return `<div class="ad-gasto-row ${st === 'E' ? 'ad-exc-lista' : 'ad-exc-nueva'}" style="align-items:flex-start">
        <span style="flex:1">🤒 <strong>${quien}</strong> — faltó el
          <strong>${adFechaBonita(e.fecha)}</strong> (${adDiaLabel(e.fecha)})<br>
          <small>«${adEsc(e.razon)}»</small><br>${sello}</span>
      </div>`;
    }).join('')}
    ${pendientes.length > 1 ? `<div class="ad-btn-row">
      <button class="pa-generate-btn" id="ad-exc-todas">✔ Aprobar las ${pendientes.length} pendientes</button>
    </div>` : ''}`;

  const marcar = (num, fecha) => {
    const dd = adLoad();
    let reg = dd.asistencia.find(x => x.f === fecha);
    if (!reg) { reg = { f: fecha, aus: {} }; dd.asistencia.push(reg); }
    reg.aus = reg.aus || {};
    reg.aus[num] = 'E';
    dd.asistencia.sort((a, b) => a.f < b.f ? -1 : 1);
    adSave(dd);
  };

  cont.querySelectorAll('.ad-exc-ok').forEach(b => b.addEventListener('click', () => {
    marcar(+b.dataset.num, b.dataset.fecha);
    toast('📝 #' + b.dataset.num + ' con excusa el ' + adFechaBonita(b.dataset.fecha));
    adRenderAsis(body, adLoad());
  }));

  const todas = document.getElementById('ad-exc-todas');
  if (todas) todas.addEventListener('click', async () => {
    if (!await metasConfirm('Se marcarán con 📝 <strong>excusa</strong> las <strong>' + pendientes.length +
      '</strong> faltas que las familias avisaron.\n\nPuedes cambiar cualquiera después tocando al alumno en el pase de lista.',
      { icono: '📨', titulo: 'Aprobar excusas', okTxt: 'Sí, aprobar todas' })) return;
    pendientes.forEach(e => marcar(e.num, e.fecha));
    toast('✅ ' + pendientes.length + ' excusa(s) aprobadas');
    adRenderAsis(body, adLoad());
  });
}

function adPrintAsis(d, mes) {
  const delMes = d.asistencia.filter(r => r.f.startsWith(mes)).sort((a, b) => a.f < b.f ? -1 : 1);
  const resumen = {};
  delMes.forEach(r => Object.keys(r.aus || {}).forEach(n => {
    resumen[n] = resumen[n] || { A: 0, E: 0, dias: [] };
    resumen[n][r.aus[n]]++;
    resumen[n].dias.push(adFechaBonita(r.f).slice(0, 5) + (r.aus[n] === 'E' ? '(exc)' : ''));
  }));
  const grupo = adGrupoTxt(d);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Asistencia ${mes}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #999;padding:3px 6px;text-align:left;}
th{background:#e8eef9;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>📋 Resumen de asistencia — ${mes.split('-').reverse().join('/')}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}Solo alumnos con ausencias; el resto asistió todos los días. Generado con M.E.T.A.S.</div>
<table>
<thead><tr><th>#</th><th>Alumno/a</th><th>🚫 Ausencias</th><th>📝 Excusas</th><th>Días</th></tr></thead>
<tbody>
${d.lista.filter(a => resumen[a.num]).map(a => `
  <tr><td>${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
  <td>${resumen[a.num].A}</td><td>${resumen[a.num].E}</td>
  <td>${resumen[a.num].dias.join(', ')}</td></tr>`).join('')}
</tbody></table>
</body></html>`;
  adPrintAbrir(html);
}

/* Día por día del mes: el acta que piden en dirección cuando hay que
   justificar una falta concreta (fecha, quién y si traía excusa). */
function adPrintAsisDias(d, mes) {
  const dias = d.asistencia.filter(r => r.f.startsWith(mes) && Object.keys(r.aus || {}).length)
    .sort((a, b) => a.f < b.f ? -1 : 1);
  const nomDe = num => {
    const a = d.lista.find(x => String(x.num) === String(num));
    return a ? (a.nombre || '') : '';
  };
  const quien = (r, tipo) => Object.keys(r.aus).filter(n => r.aus[n] === tipo)
    .sort((x, y) => (+x) - (+y))
    .map(n => '#' + n + (nomDe(n) ? ' ' + adEsc(nomDe(n)) : '')).join(', ');
  const grupo = adGrupoTxt(d);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Asistencia día por día ${mes}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #999;padding:4px 6px;text-align:left;vertical-align:top;}
th{background:#e8eef9;}
td.f{white-space:nowrap;font-weight:bold;}
.tot{margin-top:4mm;font-size:11px;color:#444;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>🗓 Asistencia día por día — ${adMesLabel(mes)}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}Solo aparecen los días con faltas; en los demás asistió todo el grupo. Generado con M.E.T.A.S.</div>
<table>
<thead><tr><th>Fecha</th><th>🚫 Ausentes (NSP)</th><th>📝 Con excusa</th></tr></thead>
<tbody>
${dias.map(r => `
  <tr><td class="f">${adDiaLabel(r.f)}<br>${adFechaBonita(r.f)}</td>
  <td>${quien(r, 'A') || '—'}</td><td>${quien(r, 'E') || '—'}</td></tr>`).join('')}
</tbody></table>
<p class="tot">Días con faltas: <strong>${dias.length}</strong> ·
  total de ausencias: <strong>${dias.reduce((s, r) => s + Object.values(r.aus).filter(v => v === 'A').length, 0)}</strong> ·
  total con excusa: <strong>${dias.reduce((s, r) => s + Object.values(r.aus).filter(v => v === 'E').length, 0)}</strong></p>
</body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ ✅ CONTROLES DEL AULA ══════════════
   Todo lo que el maestro anota a diario y NO es dinero ni nota: quién
   recibió la ficha, la merienda o el libro, quién se apuntó al desfile,
   quién trajo el material, la talla del uniforme… Antes eso vivía en
   hojitas sueltas; aquí cada cosa es un CONTROL con nombre propio, se
   marca con un toque sobre la misma lista de siempre y se ve al
   instante QUIÉNES FALTAN (que es el dato que de verdad se necesita).
   Todo local y sin internet; viaja solo entre los equipos del maestro
   con el espejo de la Zona Docente. */
/* fam: nace contándose a la familia en la Bitácora · acum: además avisa que
   habrá evaluación para nota acumulativa. Los controles delicados (salud, talla,
   merienda) nacen APAGADOS: un dato de salud no se publica por descuido. */
const AD_CTRL_PLANTILLAS = [
  { icono: '📄', nombre: 'Entrega de ficha', tipo: 'marca', fam: 1, acum: 1, verbo: 'recibio' },
  { icono: '📗', nombre: 'Entrega de libro', tipo: 'marca', fam: 1, verbo: 'recibio' },
  { icono: '🍎', nombre: 'Merienda escolar', tipo: 'marca', verbo: 'recibio' },
  { icono: '🧰', nombre: 'Material solicitado', tipo: 'marca', fam: 1, acum: 1, verbo: 'recibio' },
  { icono: '🎟️', nombre: 'Inscritos al evento', tipo: 'marca', fam: 1, verbo: 'inscrito' },
  { icono: '✍️', nombre: 'Firma del padre', tipo: 'marca', fam: 1, verbo: 'entrego' },
  { icono: '🧾', nombre: 'Documento entregado', tipo: 'marca', fam: 1, verbo: 'entrego' },
  { icono: '💊', nombre: 'Control de salud', tipo: 'marca' },
  { icono: '📖', nombre: 'Libro devuelto', tipo: 'marca', fam: 1, verbo: 'devolvio' },
  { icono: '👕', nombre: 'Talla de uniforme', tipo: 'texto' },
  { icono: '🔢', nombre: 'Cantidad recibida', tipo: 'numero' },
  { icono: '📝', nombre: 'Otro control (sí o no)', tipo: 'marca' },
  { icono: '✏️', nombre: 'Otro control (dato corto)', tipo: 'texto' },
  { icono: '#️⃣', nombre: 'Otro control (cantidad)', tipo: 'numero' },
];
/* Qué HIZO el alumno, en la Bitácora que lee la familia. Un verbo solo no sirve
   para todo: «recibió Libro devuelto» o «recibió Firma del padre» dirían lo
   contrario de lo que pasó, así que cada control lleva el suyo y el maestro lo
   puede cambiar viendo la vista previa. */
const AD_CTRL_VERBOS = {
  recibio:  { et: '📥 recibió',            fr: (q, c) => q + ' recibió «' + c + '»' },
  entrego:  { et: '📤 entregó',            fr: (q, c) => q + ' entregó «' + c + '»' },
  devolvio: { et: '↩️ devolvió',            fr: (q, c) => q + ' devolvió «' + c + '»' },
  inscrito: { et: '🎟️ quedó inscrito en',  fr: (q, c) => q + ' quedó inscrito en «' + c + '»' },
  anotado:  { et: '✔ quedó anotado en',    fr: (q, c) => q + ' quedó anotado en «' + c + '»' },
};
const AD_CTRL_TIPOS = {
  marca: { et: '✔ sí o no', ayuda: 'Toca al alumno para marcarlo ✔; tócalo otra vez para quitarle la marca.' },
  texto: { et: '✏️ dato corto', ayuda: 'Toca al alumno y escribe su dato (talla, color, nº de recibo…). Vacío lo borra.' },
  numero: { et: '🔢 cantidad', ayuda: 'Toca al alumno y escribe la cantidad (cuadernos, libros, unidades…). Vacío o 0 lo borra.' },
};

function adControl(d, id) { return (d.controles || []).find(c => c.id === id); }
function adCtrlTipo(c) { return AD_CTRL_TIPOS[c.tipo] ? c.tipo : 'marca'; }
/* Cuántos tienen dato y quiénes faltan (el corazón del control) */
function adCtrlHechos(c) { return Object.keys(c.datos || {}).length; }
function adCtrlFaltan(d, c) {
  return d.lista.filter(a => (c.datos || {})[a.num] == null);
}
/* ── BITÁCORA: lo que la familia lee de un control ──
   El texto se arma en UN solo lugar y se usa en dos: la vista previa que ve el
   maestro y la fila que viaja al asistente de padres. Así lo que promete la
   pantalla es exactamente lo que le llega al padre, sin sorpresas. */
function adCtrlMision(c) {
  if (!c || !c.misionId || typeof MISSIONS === 'undefined') return null;
  return MISSIONS.find(m => m.id === c.misionId) || null;
}
/* Verbo del control. Los creados antes de que esto existiera lo deducen de su
   nombre una sola vez, para que su bitácora no diga una cosa por otra. */
function adCtrlVerbo(c) {
  if (c && AD_CTRL_VERBOS[c.verbo]) return c.verbo;
  const n = String((c && c.nombre) || '').toLowerCase();
  if (/devolv|devuelt/.test(n)) return 'devolvio';
  if (/inscri|apunt/.test(n)) return 'inscrito';
  if (/ficha|libro|merienda|material|cuadern/.test(n)) return 'recibio';
  if (/firma|documento|constancia|partida|entreg/.test(n)) return 'entrego';
  return 'anotado';
}
/* Cómo se nombra la COSA en la frase. El maestro bautiza sus controles como le
   sirve para buscarlos («Entrega de ficha de Español», «Libro devuelto de
   Sociales»), y al pegarles el verbo salían frases que se repiten: «recibió
   «Entrega de ficha…»», «devolvió «Libro devuelto…»». Se le quita al nombre solo
   lo que el verbo YA dice; el control conserva su nombre intacto. */
function adCtrlCosa(c) {
  const orig = String((c && c.nombre) || '').trim();
  let s = orig
    .replace(/^entrega\s+(de\s+l?[ao]s?\s+|del\s+|de\s+)?/i, '')
    .replace(/^inscri(tos|pción|pcion)\s+(a\s+l?[ao]s?\s+|al\s+|a\s+)?/i, '');
  const v = adCtrlVerbo(c);
  if (v === 'devolvio') s = s.replace(/\s*\bdevuelt[oa]s?\b/i, '');
  if (v === 'entrego')  s = s.replace(/\s*\bentregad[oa]s?\b/i, '');
  s = s.replace(/\s{2,}/g, ' ').trim();
  if (!s) s = orig;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function adCtrlBitacoraTxt(c, d, num) {
  const al = (d.lista || []).find(a => String(a.num) === String(num)) || {};
  const nom = String(al.nombre || '').trim();
  const quien = (nom || 'su hijo/a') + ' (n.º ' + num + ' de la lista)';
  const v = (c.datos || {})[num];
  let p = adCtrlTipo(c) === 'marca'
    ? 'El ' + adFechaBonita(c.fecha) + ', ' +
      AD_CTRL_VERBOS[adCtrlVerbo(c)].fr(quien, adCtrlCosa(c)) + '.'
    : 'El ' + adFechaBonita(c.fecha) + ', en «' + c.nombre + '», se anotó de ' + quien + ': ' + String(v) + '.';
  if (c.acum) {
    p += ' Sobre este material se le aplicará una evaluación que cuenta para la NOTA ACUMULATIVA,' +
         ' así que apóyele a estudiarlo en casa estos días.';
  }
  const m = adCtrlMision(c);
  if (m) p += ' El tema lo puede repasar y practicar en la misión «' + m.title + '», con el botón de abajo.';
  return p;
}
/* Enlace de la misión para la fila de la nube: viaja en `claves` (columna libre
   del mismo canal) como «url|título», y el asistente lo pinta como botón. */
function adCtrlMisionClaves(c) {
  const m = adCtrlMision(c);
  return m ? (m.url || '') + '|' + m.title : '';
}
/* Selector de misiones agrupado por materia, para amarrar la ficha a su tema */
function adMisionOptions(sel) {
  if (typeof MISSIONS === 'undefined') return '';
  const porMat = {};
  MISSIONS.forEach(m => { (porMat[m.subject] = porMat[m.subject] || []).push(m); });
  return Object.keys(porMat).map(s =>
    '<optgroup label="' + adEsc((typeof SUBJECT_LABELS !== 'undefined' && SUBJECT_LABELS[s]) || s) + '">' +
    porMat[s].slice().sort((a, b) => a.title.localeCompare(b.title, 'es')).map(m =>
      '<option value="' + m.id + '"' + (String(m.id) === String(sel) ? ' selected' : '') + '>' +
      adEsc(m.icon + ' ' + m.title) + '</option>').join('') + '</optgroup>').join('');
}

/* Lo que se pinta dentro del chip y en la hoja impresa */
function adCtrlValorTxt(c, num) {
  const v = (c.datos || {})[num];
  if (v == null) return '';
  if (adCtrlTipo(c) === 'marca') return '✔';
  return String(v);
}

/* La puerta a 📣 Convocatoria. Se pinta en un solo sitio porque sale en
   dos: en Comunicados con lista y en Comunicados sin lista.

   Vive en 📣 Comunicados y no en ✅ Controles porque lo que sale de
   aquí es un mensaje a las familias, como un aviso. La diferencia con
   el aviso —y por eso lleva franja naranja y la palabra
   «pregúntales»— es que el aviso INFORMA y se acabó, y la convocatoria
   PREGUNTA y se queda esperando la respuesta. */
function adConvPuertaHtml(d) {
  if (typeof adRenderConvocatoria !== 'function') return '';
  const abiertas = (d.convocatorias || []).filter(c => c.codigo && !c.cerrada);
  let sub = 'Pregúntales por WhatsApp quién va a la excursión, a la reunión o a la kermés — y cuántos buses hacen falta';
  if (abiertas.length) {
    const c = abiertas[abiertas.length - 1];
    const r = (c.resp || []).filter(x => x.va);
    const per = r.reduce((a, x) => a + (Number(x.personas) || 0), 0);
    sub = c.icono + ' ' + (c.titulo || 'Convocatoria') + ' — ' +
      (per ? per + ' personas confirmadas hasta ahora' : 'publicada, esperando respuestas');
  }
  return `
    <button class="ad-puerta ad-puerta-conv" id="ad-ir-conv">
      <span class="ad-puerta-ic">📣</span>
      <span class="ad-puerta-txt">
        <span class="ad-puerta-t">Convocatoria por WhatsApp</span>
        <span class="ad-puerta-s">${adEsc(sub)}</span>
      </span>
      <span class="ad-puerta-go">›</span>
    </button>`;
}
function adConvPuertaEnganchar(body) {
  const b = body.querySelector('#ad-ir-conv');
  if (b) b.addEventListener('click', () => { adConvEntrar(); renderAdmin(); });
}

function adRenderControles(body, d) {
  if (!d.lista.length) { adSinLista(body, 'los controles del aula'); return; }
  if (_adControlId) { adRenderControl(body, d); return; }

  const lista = (d.controles || []).slice().reverse();
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">✅ Controles del aula</div>
      <p class="pa-optional-hint">Para todo lo que se anota a diario y no es dinero ni nota:
        <strong>quién recibió la ficha</strong>, la merienda o el libro, <strong>quién se apuntó</strong>
        a un evento, quién trajo el material… Elige de qué se trata y marca sobre tu misma lista.
        Lo importante lo tienes de un vistazo: <strong>quiénes faltan</strong>.</p>
      <p class="pa-optional-hint" style="margin-top:-2px"><strong>Toca una etiqueta</strong> para crear el control de hoy:</p>
      <div class="ad-meses ad-ctrl-plantillas">
        ${AD_CTRL_PLANTILLAS.map((p, i) =>
          `<button class="ad-mes-btn" data-plant="${i}" title="Dato: ${adEsc(AD_CTRL_TIPOS[p.tipo].et)}">${p.icono} ${adEsc(p.nombre)}</button>`).join('')}
      </div>
      <p class="pa-optional-hint">Aquí se ANOTA lo que ya sabes. Si lo que necesitas es
        <strong>preguntárselo a las familias</strong> —quién va a la excursión, cuántos llegan a la
        reunión—, eso es una convocatoria y está en <strong>📣 Comunicados</strong>.</p>
    </div>
    ${lista.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🗂️ Mis controles</div>
      ${lista.map(c => {
        const hechos = adCtrlHechos(c), total = d.lista.length;
        const faltan = total - hechos;
        return `
        <button class="ad-colecta-row" data-ctid="${c.id}">
          <span class="ad-cr-txt"><strong>${c.icono || '✅'} ${adEsc(c.nombre)}</strong><br>
            <small>${adFechaBonita(c.fecha)} · ${hechos}/${total} anotados${faltan ? ' · faltan ' + faltan : ' · ¡completo! 🎉'}${c.fam ? ' · 📔 en la Bitácora' : ''}</small></span>
          <span class="ad-cr-arrow">›</span>
        </button>`;
      }).join('')}
    </div>` : `
    <div class="pa-card">
      <p class="pa-optional-hint">Todavía no hay controles. El primero te tomará
        <strong>menos de un minuto</strong>: toca una etiqueta de arriba.</p>
    </div>`}
    <div class="pa-card">
      <div class="pa-card-title">📔 Novedades de la clase</div>
      <p class="pa-optional-hint">Algo importante que se dijo o se hizo hoy y que la casa debe saber.
        Lo leen <strong>todas las familias</strong> en la Bitácora del asistente, tal como lo escribas.
        No es para regañar a un alumno: eso va en 📣 Comunicados, que sí llega a una sola familia.</p>
      <textarea id="ad-bit-nueva" class="pa-paste-area ad-bit-ta" rows="3" maxlength="500"
        placeholder="Ej.: Hoy empezamos las fracciones con la pizza. Pregúntele qué es el denominador."></textarea>
      <button class="pa-generate-btn" id="ad-bit-add">➕ Anotar la novedad</button>
      ${(d.bitacora || []).length ? (d.bitacora || []).slice().reverse().map(n => `
        <div class="ad-gasto-row ad-bit-row">
          <span><strong>${adFechaBonita(n.fecha)}</strong> · ${adEsc(n.texto)}</span>
          <span><button class="ad-al-del ad-bit-del" data-bid="${n.id}" aria-label="Borrar novedad">✕</button></span>
        </div>`).join('')
        : '<p class="pa-optional-hint">Sin novedades anotadas todavía.</p>'}
    </div>`;

  const bitTa = document.getElementById('ad-bit-nueva');
  document.getElementById('ad-bit-add').addEventListener('click', () => {
    const txt = String(bitTa.value || '').trim();
    if (txt.length < 4) { toast('✍️ Escribe la novedad (mínimo 4 letras)'); bitTa.focus(); return; }
    const dd = adLoad();
    dd.bitacora = dd.bitacora || [];
    dd.bitacora.push({
      id: 'N' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      fecha: adHoy(), texto: txt.slice(0, 500),
    });
    /* el asistente solo muestra lo vigente y la nube tiene tope por familia:
       se guardan las últimas 40, que es más de un parcial de novedades */
    if (dd.bitacora.length > 40) dd.bitacora = dd.bitacora.slice(-40);
    adSave(dd); renderAdmin();
    toast('📔 Anotada: las familias la verán en su Bitácora');
  });
  body.querySelectorAll('.ad-bit-del').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Borrar esta novedad? Dejará de verse en la Bitácora de las familias.',
        { icono: '📔', titulo: 'Novedades de la clase', okTxt: 'Sí, borrar' })) return;
      const dd = adLoad();
      adUndoGuardar('Borrar una novedad de la clase');
      dd.bitacora = (dd.bitacora || []).filter(x => x.id !== b.dataset.bid);
      adSave(dd); renderAdmin();
    }));

  body.querySelectorAll('[data-plant]').forEach(b =>
    b.addEventListener('click', async () => {
      const p = AD_CTRL_PLANTILLAS[+b.dataset.plant];
      const nombre = await metasPrompt('¿Cómo se llama este control?\nPonle el nombre con el que TÚ lo buscarías después (ej. **Ficha de Español 3er parcial**).', {
        icono: p.icono, titulo: 'Nuevo control', okTxt: 'Crear',
        value: p.nombre.startsWith('Otro control') ? '' : p.nombre,
        placeholder: p.nombre,
        valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el nombre (mínimo 3 letras).',
      });
      if (nombre === null) return;
      const dd = adLoad();
      dd.controles = dd.controles || [];
      dd.controles.push({
        id: 'K' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        icono: p.icono, nombre: String(nombre).trim(), tipo: p.tipo,
        fecha: adHoy(), datos: {},
        fam: p.fam ? 1 : 0, acum: p.acum ? 1 : 0, misionId: null, verbo: p.verbo || 'anotado',
      });
      adSave(dd);
      _adControlId = dd.controles[dd.controles.length - 1].id;
      renderAdmin();
    }));

  body.querySelectorAll('[data-ctid]').forEach(b =>
    b.addEventListener('click', () => { _adControlId = b.dataset.ctid; renderAdmin(); }));
}

function adRenderControl(body, d) {
  const c = adControl(d, _adControlId);
  if (!c) { _adControlId = null; renderAdmin(); return; }
  const tipo = adCtrlTipo(c);
  const hechos = adCtrlHechos(c), total = d.lista.length;
  const faltan = adCtrlFaltan(d, c);

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="ad-ctrl-volver">🗂️ Mis controles</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">${c.icono || '✅'} ${adEsc(c.nombre)}</div>
      <p class="pa-optional-hint">${adFechaBonita(c.fecha)} · dato: <strong>${AD_CTRL_TIPOS[tipo].et}</strong><br>
        ${AD_CTRL_TIPOS[tipo].ayuda}</p>
      <div class="ad-resumen">
        <span>✅ Anotados: <strong>${hechos}/${total}</strong></span>
        <span class="${faltan.length ? 'ad-mal' : 'ad-ok'}">⏳ Faltan: <strong>${faltan.length}</strong></span>
      </div>
      <div class="ad-chips">
        ${d.lista.map(a => {
          const val = adCtrlValorTxt(c, a.num);
          const nom = adPrimerNombre(a.nombre);
          return `<button class="ad-chip ${val ? 'ad-chip-on' : ''}" data-num="${a.num}" title="${adEsc(a.nombre)}">
            <span class="ad-chip-num">#${a.num}</span>
            ${nom ? `<span class="ad-chip-nom">${adEsc(nom)}</span>` : ''}
            ${val ? `<span class="ad-chip-monto">${adEsc(val)}</span>` : ''}</button>`;
        }).join('')}
      </div>
      ${tipo === 'marca' ? `
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-todos">✅ Marcar a todos</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-limpiar">🧹 Quitar todas las marcas</button>
      </div>
      <p class="pa-optional-hint">💡 Si casi todos cumplieron, marca a todos y quita solo a los que faltaron:
        se anota en segundos, igual que el pase de lista.</p>` : ''}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📔 Lo que verá la familia</div>
      <p class="pa-optional-hint">La <strong>Bitácora</strong> del asistente de padres cuenta esto
        <strong>solo a la familia del alumno anotado</strong>, nunca al grupo entero.</p>
      <label class="ad-bit-sw">
        <input type="checkbox" id="ad-ctrl-fam" ${c.fam ? 'checked' : ''}>
        <span>Contarlo a la familia en la Bitácora</span>
      </label>
      <label class="ad-bit-sw">
        <input type="checkbox" id="ad-ctrl-acum" ${c.acum ? 'checked' : ''} ${c.fam ? '' : 'disabled'}>
        <span>Avisar que se le aplicará <strong>evaluación para nota acumulativa</strong></span>
      </label>
      ${tipo === 'marca' ? `
      <label class="ad-bit-lbl" for="ad-ctrl-verbo">✍️ Qué hizo el alumno (así se lee en la Bitácora)</label>
      <select id="ad-ctrl-verbo" class="pa-inp-field" ${c.fam ? '' : 'disabled'}>
        ${Object.keys(AD_CTRL_VERBOS).map(k =>
          `<option value="${k}"${k === adCtrlVerbo(c) ? ' selected' : ''}>${AD_CTRL_VERBOS[k].et} «${adEsc(adCtrlCosa(c))}»</option>`).join('')}
      </select>` : ''}
      <label class="ad-bit-lbl" for="ad-ctrl-mision">📚 Misión para que estudie el tema en casa</label>
      <select id="ad-ctrl-mision" class="pa-inp-field" ${c.fam ? '' : 'disabled'}>
        <option value="">Sin misión enlazada</option>
        ${adMisionOptions(c.misionId)}
      </select>
      ${c.fam ? `
      <div class="ad-bit-prev">
        <strong>Así lo leerá la familia:</strong><br>
        ${adEsc(adCtrlBitacoraTxt(c, d, (Object.keys(c.datos || {})[0]) || (d.lista[0] && d.lista[0].num) || 1))}
        ${adCtrlMision(c) ? `<br><span class="ad-bit-btn-prev">📚 Estudiar «${adEsc(adCtrlMision(c).title)}»</span>` : ''}
      </div>` : `
      <p class="pa-optional-hint">🔒 Apagado: este control queda solo para ti. Nada de él llega al
        asistente de padres.</p>`}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">⏳ Todavía faltan (${faltan.length})</div>
      ${faltan.length ? `
      <p class="pa-optional-hint" style="margin-top:-2px">${faltan.map(a =>
        '#' + a.num + (adPrimerNombre(a.nombre) ? ' ' + adEsc(adPrimerNombre(a.nombre)) : '')).join(' · ')}</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-copiar">📋 Copiar los que faltan</button>
      </div>`
      : '<p class="pa-optional-hint">🎉 ¡Todo el grupo está anotado en este control!</p>'}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-print">🖨️ Imprimir hoja de control</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-repetir">📄 Repetir este control</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-ctrl-renombrar">✏️ Cambiar nombre o fecha</button>
        <button class="pa-generate-btn ad-btn-sec ad-btn-peligro" id="ad-ctrl-borrar">🗑 Eliminar control</button>
      </div>
    </div>`;

  document.getElementById('ad-ctrl-volver').addEventListener('click', () => { _adControlId = null; renderAdmin(); });

  /* ajustes de la Bitácora: cada cambio se guarda al toque y se repinta, para
     que la vista previa diga siempre la verdad de lo que va a leer el padre */
  /* apagar «contarlo a la familia» NO borra la misión ni el aviso de acumulativa:
     quedan guardados y vuelven al encenderlo. Mientras está apagado no sale ni
     una fila del teléfono, que es lo único que importa. */
  const bitSet = (campo, valor) => {
    const dd = adLoad(); const cc = adControl(dd, _adControlId); if (!cc) return;
    cc[campo] = valor;
    adSave(dd); renderAdmin();
  };
  document.getElementById('ad-ctrl-fam').addEventListener('change', e => bitSet('fam', e.target.checked ? 1 : 0));
  document.getElementById('ad-ctrl-acum').addEventListener('change', e => bitSet('acum', e.target.checked ? 1 : 0));
  document.getElementById('ad-ctrl-mision').addEventListener('change', e =>
    bitSet('misionId', parseInt(e.target.value, 10) || null));
  const selVerbo = document.getElementById('ad-ctrl-verbo');
  if (selVerbo) selVerbo.addEventListener('change', e => bitSet('verbo', e.target.value));

  body.querySelectorAll('.ad-chip').forEach(ch =>
    ch.addEventListener('click', async () => {
      const num = ch.dataset.num;
      const dd = adLoad(); const cc = adControl(dd, _adControlId); if (!cc) return;
      cc.datos = cc.datos || {};
      const t = adCtrlTipo(cc);
      if (t === 'marca') {
        if (cc.datos[num] != null) delete cc.datos[num]; else cc.datos[num] = 1;
      } else {
        const al = dd.lista.find(a => String(a.num) === String(num)) || {};
        const quien = '#' + num + (al.nombre ? ' ' + adPrimerNombre(al.nombre) : '');
        const esNum = t === 'numero';
        const r = await metasPrompt('¿Qué anoto de **' + quien + '**?\n' +
          (esNum ? 'Escribe la cantidad. El **0** o vacío quita la anotación.'
                 : 'Escribe el dato corto. Vacío quita la anotación.'), {
          icono: cc.icono || '✅', titulo: adEsc(cc.nombre), okTxt: 'Guardar',
          inputmode: esNum ? 'decimal' : 'text',
          value: cc.datos[num] != null ? String(cc.datos[num]) : '',
          maxlength: esNum ? 8 : 24,
          valida: v => {
            const s = String(v).trim();
            if (s === '' || !esNum) return '';
            return isNaN(Number(s.replace(',', '.'))) ? 'Escribe un número (o vacío para quitar).' : '';
          },
        });
        if (r === null) return;
        const s = String(r).trim();
        if (s === '') delete cc.datos[num];
        else if (esNum) {
          const n = Number(s.replace(',', '.'));
          if (!(n > 0)) delete cc.datos[num]; else cc.datos[num] = n;
        } else cc.datos[num] = s;
      }
      adSave(dd); renderAdmin();
    }));

  const todos = document.getElementById('ad-ctrl-todos');
  if (todos) todos.addEventListener('click', () => {
    const dd = adLoad(); const cc = adControl(dd, _adControlId); if (!cc) return;
    cc.datos = cc.datos || {};
    dd.lista.forEach(a => { cc.datos[a.num] = 1; });
    adSave(dd); renderAdmin();
    toast('✅ Marcados los ' + dd.lista.length);
  });
  const limpiar = document.getElementById('ad-ctrl-limpiar');
  if (limpiar) limpiar.addEventListener('click', async () => {
    if (!await metasConfirm('¿Quitar TODAS las marcas de **' + c.nombre + '**?\nLa lista queda en blanco para volver a empezar.',
      { icono: '🧹', titulo: 'Controles', okTxt: 'Sí, quitar' })) return;
    const dd = adLoad(); const cc = adControl(dd, _adControlId); if (!cc) return;
    adUndoGuardar('Limpiar el control «' + cc.nombre + '»');
    cc.datos = {};
    adSave(dd); renderAdmin();
  });

  const cop = document.getElementById('ad-ctrl-copiar');
  if (cop) cop.addEventListener('click', () => {
    const txt = c.icono + ' ' + c.nombre + ' — todavía faltan (' + faltan.length + '):\n' +
      faltan.map(a => '#' + a.num + (a.nombre ? ' ' + a.nombre : '')).join('\n');
    adCopiar(txt,
      () => toast('📋 Copiado: pégalo en WhatsApp o en tu cuaderno'),
      () => toast('⚠️ No se pudo copiar en este navegador'));
  });

  document.getElementById('ad-ctrl-print').addEventListener('click', () => adPrintControl(adLoad(), c));

  document.getElementById('ad-ctrl-repetir').addEventListener('click', async () => {
    if (!await metasConfirm('Se crea un control NUEVO con el mismo nombre y la fecha de hoy, ' +
      'con la lista en blanco.\n\nSirve para lo que se repite: la merienda de cada semana, ' +
      'la ficha de cada parcial…', { icono: '📄', titulo: 'Repetir control', okTxt: 'Sí, repetir' })) return;
    const dd = adLoad();
    dd.controles.push({
      id: 'K' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      icono: c.icono, nombre: c.nombre, tipo: c.tipo, fecha: adHoy(), datos: {},
      /* lo que la familia ve viaja con la copia: la ficha de cada parcial se
         repite igual, con su misma misión y su mismo aviso de acumulativa */
      fam: c.fam ? 1 : 0, acum: c.acum ? 1 : 0, misionId: c.misionId || null, verbo: adCtrlVerbo(c),
    });
    adSave(dd);
    _adControlId = dd.controles[dd.controles.length - 1].id;
    renderAdmin();
    toast('📄 Control repetido con fecha de hoy');
  });

  document.getElementById('ad-ctrl-renombrar').addEventListener('click', async () => {
    const nombre = await metasPrompt('Nombre del control:', {
      icono: c.icono || '✅', titulo: 'Cambiar nombre', okTxt: 'Siguiente', value: c.nombre,
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el nombre (mínimo 3 letras).',
    });
    if (nombre === null) return;
    const fecha = await metasPrompt('Fecha del control (AAAA-MM-DD):', {
      icono: '🗓', titulo: 'Cambiar fecha', okTxt: 'Guardar', value: c.fecha,
      valida: v => /^\d{4}-\d{2}-\d{2}$/.test(String(v).trim()) ? '' : 'Escribe la fecha así: 2026-07-29',
    });
    if (fecha === null) return;
    const dd = adLoad(); const cc = adControl(dd, _adControlId); if (!cc) return;
    cc.nombre = String(nombre).trim();
    cc.fecha = String(fecha).trim();
    adSave(dd); renderAdmin();
  });

  document.getElementById('ad-ctrl-borrar').addEventListener('click', async () => {
    if (!await metasConfirm('¿Eliminar el control **' + c.nombre + '** con todo lo anotado?',
      { icono: '🗑', titulo: 'Controles', okTxt: 'Sí, eliminar' })) return;
    const dd = adLoad();
    adUndoGuardar('Eliminar el control «' + c.nombre + '»');
    dd.controles = dd.controles.filter(x => x.id !== _adControlId);
    adSave(dd); _adControlId = null; renderAdmin();
    toast('🗑 Control eliminado — si fue un error, restaura en 🕘 (pestaña Alumnos)');
  });
}

/* Hoja de control imprimible: la que se firma, se entrega en dirección
   o se lleva al aula cuando toca anotar a mano. */
function adPrintControl(d, c) {
  const cc = adControl(d, c.id) || c;
  const tipo = adCtrlTipo(cc);
  const grupo = adGrupoTxt(d);
  const hechos = adCtrlHechos(cc);
  const colDato = tipo === 'marca' ? '✔' : tipo === 'numero' ? 'Cantidad' : 'Dato';
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc(cc.nombre)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #999;padding:4px 6px;text-align:left;}
th{background:#e8eef9;}
td.n{width:12mm;text-align:center;font-weight:bold;}
td.v{width:26mm;text-align:center;font-weight:bold;}
td.o{width:52mm;}
.pie{margin-top:6mm;font-size:11px;color:#444;}
.firma{margin-top:14mm;font-size:11px;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>${adEsc(cc.icono || '✅')} ${adEsc(cc.nombre)}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}${adFechaBonita(cc.fecha)} ·
  ${hechos} de ${d.lista.length} anotados. Generado con M.E.T.A.S.</div>
<table>
<thead><tr><th class="n">#</th><th>Alumno/a</th><th class="v">${colDato}</th><th class="o">Observación</th></tr></thead>
<tbody>
${d.lista.map(a => `
  <tr><td class="n">${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
  <td class="v">${adEsc(adCtrlValorTxt(cc, a.num))}</td><td class="o"></td></tr>`).join('')}
</tbody></table>
<p class="pie">Faltan por anotar: <strong>${d.lista.length - hechos}</strong>.</p>
<div class="firma">F. _______________________________ &nbsp;&nbsp; Docente</div>
</body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ 🧮 BOLETA DE CALIFICACIONES (SACE) ══════════════ */

/* ── ✨ SUGERIR NOTAS: el Plan de acción llena la boleta ──
   El maestro ya calificó las pruebas del parcial en 📊 Plan de acción (cada
   análisis guarda parcial, materia y la nota de cada nº de lista). Pasarlas
   a la boleta era volver a buscarlas una por una entre decenas de análisis.
   Aquí se promedian y se escriben de un toque, con estas reglas de justicia:
   · solo análisis de ESTE grupo (grado por dígitos y sección por su letra o
     número final, igual que adMigrarCodigos): un maestro con dos aulas no
     mezcla notas ajenas;
   · solo los del parcial elegido — o sin parcial pero con fecha de prueba
     dentro del rango que el maestro marcó para ese parcial en Inasistencias;
   · todas las evaluaciones pesan IGUAL (promedio simple): no hay dato
     objetivo para decir que una prueba vale más que otra;
   · NSP no promedia: no presentarse no es un cero — ya tiene su proceso de
     prueba pendiente en el Plan de acción;
   · solo se llenan celdas VACÍAS: lo que el maestro escribió, manda. */

/* Mismo grupo que el análisis. Los análisis nuevos traen el id del grupo
   (paGrupoIdDe, en el Plan de acción) y con eso no hay duda: el maestro de
   jornada doble con «6º-1» en dos colegios no mezcla notas ajenas. Los
   viejos no lo tienen y se comparan como siempre — dígitos del grado y
   último carácter de la sección, porque en el Plan se escriben a mano
   («6º» / «6») y en Alumnos pueden ir distinto. */
function adSugMismoGrupo(a, d) {
  if (a && a.grupoId) return a.grupoId === d.id;
  const dig = s => String(s || '').replace(/\D/g, '');
  const sec = s => { const m = String(s || '').trim().match(/([a-zA-Z0-9])\s*$/); return m ? m[1].toUpperCase() : ''; };
  return !!dig(a.grado) && dig(a.grado) === dig(d.grado) && sec(a.seccion) === sec(d.seccion);
}

/* Otros grupos que se escriben igual que este («6º-1» en dos colegios). Si
   los hay, los análisis viejos —los que no llevan sello de grupo— pueden
   venir de cualquiera de los dos, y eso hay que advertirlo. */
function adSugGemelos(d) {
  try {
    return adState().grupos.filter(g => g.id !== d.id &&
      adSugMismoGrupo({ grado: g.grado, seccion: g.seccion }, d)).length;
  } catch (_) { return 0; }
}

/* La materia del Plan se busca en la boleta sin reparar en mayúsculas ni
   acentos, y devuelve el nombre de la columna TAL COMO la escribió el
   maestro: quien puso «Ciencias naturales» no merece una columna repetida
   por una tilde. */
function adSugColumna(mat, materias) {
  const llano = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const k = llano(mat);
  return (materias || []).find(c => llano(c) === k) || '';
}

/* Materia del análisis → nombre de columna de la boleta. La regla real vive
   en el Plan de acción (paMateriaDe + PA_HIST_MATERIAS, que se cargan antes
   en esta misma página); el mapa de respaldo es por si este archivo se usa
   suelto. */
function adSugMateriaNom(a) {
  let k = (a && a.materia) || '';
  if (!k && typeof paMateriaDe === 'function') k = paMateriaDe(a) || '';
  if (!k && a && a.misionId && typeof MISSIONS !== 'undefined') {
    const m = MISSIONS.find(x => x.id === a.misionId);
    if (m) k = m.subject || '';
  }
  if (!k && a && a.evaluacion && typeof MISSIONS !== 'undefined' && Array.isArray(MISSIONS)) {
    const normT = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/\s*·\s*prueba operativa.*$/i, '').replace(/\s*[—\-–]\s*forma\s+\S+/i, '').trim();
    const evB = normT(a.evaluacion);
    if (evB) {
      const m2 = MISSIONS.find(x => {
        const t = normT(x.title);
        return t && (t === evB || evB.indexOf(t) === 0 || (evB.length >= 8 && t.indexOf(evB) === 0));
      });
      if (m2) k = m2.subject || '';
    }
  }
  if (!k) return '';
  if (typeof PA_HIST_MATERIAS !== 'undefined') {
    const x = PA_HIST_MATERIAS.find(y => y.key === k);
    if (x) return x.nom;
  }
  const nom = { 'español': 'Español', 'matemáticas': 'Matemáticas', 'naturales': 'Ciencias Naturales',
    'sociales': 'Ciencias Sociales', 'inglés': 'Inglés', 'arte': 'Educación Artística',
    'programación': 'Programación', 'robótica': 'Robótica',
    'cívica': 'Educación Cívica',
    'ia': 'Inteligencia Artificial',
    'filosofía': 'Filosofía' }[k];
  return nom || (k.charAt(0).toUpperCase() + k.slice(1));
}

function adNormNombreAlumno(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(\s*n\.?[º°o]?\s*\d+[^)]*\)/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Construye el mapa de identidad de los alumnos del grupo actual para que,
   aunque el maestro haya reordenado las filas (ej. Niñas A–Z y Varones A–Z o
   mover a un alumno de posición), cada calificación recuperada de la nube,
   del Plan de Acción o de una versión anterior caiga en el #num ACTUAL del alumno. */
function adConstruirMapaAlumnos(dActual, listaOrigen, codesOrigenPorNum) {
  const deCod = {};
  const deNom = {};
  const deNomCorto = {};
  const conteoCorto = {};
  const numsActuales = new Set();

  (dActual.lista || []).forEach(al => {
    const n = +al.num;
    if (!n) return;
    numsActuales.add(n);
    const cod = String(adClaveFamilia(dActual.id, n, false) || '').trim().toUpperCase();
    if (cod) deCod[cod] = n;
    const nom = adNormNombreAlumno(al.nombre);
    if (nom) {
      deNom[nom] = n;
      const partes = nom.split(' ');
      const c2 = partes.slice(0, 2).join(' ');
      if (c2) {
        conteoCorto[c2] = (conteoCorto[c2] || 0) + 1;
        deNomCorto[c2] = n;
      }
      const c1 = partes[0];
      if (c1) {
        conteoCorto[c1] = (conteoCorto[c1] || 0) + 1;
        deNomCorto[c1] = n;
      }
    }
  });

  const resolverPorNombre = nombreRaw => {
    const nom = adNormNombreAlumno(nombreRaw);
    if (!nom || /^#?\d+$/.test(nom)) return null;
    if (deNom[nom]) return deNom[nom];
    const partes = nom.split(' ');
    const c2 = partes.slice(0, 2).join(' ');
    if (c2 && conteoCorto[c2] === 1 && deNomCorto[c2]) return deNomCorto[c2];
    for (const k of Object.keys(deNom)) {
      if (k.length >= 6 && nom.length >= 6 && (k.indexOf(nom) === 0 || nom.indexOf(k) === 0)) {
        return deNom[k];
      }
    }
    const c1 = partes[0];
    if (c1 && conteoCorto[c1] === 1 && deNomCorto[c1]) return deNomCorto[c1];
    return null;
  };

  const deNum = {};
  if (Array.isArray(listaOrigen) && listaOrigen.length) {
    listaOrigen.forEach(alOrig => {
      if (!alOrig) return;
      const oldN = +alOrig.num;
      if (!oldN) return;
      const codOrig = codesOrigenPorNum && codesOrigenPorNum[oldN]
        ? String(codesOrigenPorNum[oldN]).trim().toUpperCase() : '';
      if (codOrig && deCod[codOrig]) {
        deNum[oldN] = deCod[codOrig];
        return;
      }
      const porNom = resolverPorNombre(alOrig.nombre);
      if (porNom) {
        deNum[oldN] = porNom;
        return;
      }
      if (numsActuales.has(oldN)) {
        deNum[oldN] = oldN;
      }
    });
  }
  if (codesOrigenPorNum && typeof codesOrigenPorNum === 'object') {
    Object.keys(codesOrigenPorNum).forEach(k => {
      const oldN = +k;
      const codOrig = String(codesOrigenPorNum[k] || '').trim().toUpperCase();
      if (oldN && !deNum[oldN] && codOrig && deCod[codOrig]) {
        deNum[oldN] = deCod[codOrig];
      }
    });
  }

  return {
    deCod,
    deNom,
    deNum,
    resolverPorNombre,
    resolverAlumno(numRaw, codRaw, nombreRaw) {
      const cod = String(codRaw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (cod && deCod[cod]) return deCod[cod];
      const porNom = resolverPorNombre(nombreRaw);
      if (porNom) return porNom;
      const n = +numRaw;
      if (n && deNum[n]) return deNum[n];
      if (n && numsActuales.has(n)) return n;
      return null;
    }
  };
}

/* Junta, por materia de la boleta, las notas de cada alumno en las
   evaluaciones del parcial. También cuenta lo que NO entró y por qué,
   para decírselo al maestro en vez de callarlo. */
function adSugFuentes(d, parcial) {
  let plan = { analisis: [] };
  try {
    plan = (typeof paLoadData === 'function') ? paLoadData()
      : (JSON.parse(localStorage.getItem('METAS_PLANACCION_V1')) || { analisis: [] });
  } catch (_) {}
  const mapaAl = adConstruirMapaAlumnos(d, null, null);
  const rango = ((d.boleta || {}).parcialFechas || {})[parcial] || null;
  const porFecha = a => !a.parcial && a.fechaPrueba && rango && rango.desde && rango.hasta &&
    a.fechaPrueba >= rango.desde && a.fechaPrueba <= rango.hasta;
  const delParcial = a => String(a.parcial || '') === parcial || porFecha(a);
  const res = { porMat: {}, evals: 0, porFecha: 0, sinSello: 0,
                sinMateria: 0, matSinCol: {}, otroGrupo: 0, otroGrupoTxt: [] };
  (plan.analisis || []).forEach(a => {
    if (!a || !Array.isArray(a.students) || !delParcial(a)) return;
    /* De otra aula: no es un error del maestro, pero si NADA entra hay que
       poder decirle que sus evaluaciones están anotadas con otro grado. */
    if (!adSugMismoGrupo(a, d)) {
      res.otroGrupo++;
      const txt = adGradoSeccion(a.grado, a.seccion) || 'sin grado';
      if (res.otroGrupoTxt.indexOf(txt) < 0) res.otroGrupoTxt.push(txt);
      return;
    }
    const mat = adSugMateriaNom(a);
    if (!mat) { res.sinMateria++; return; }
    const col = adSugColumna(mat, d.materias);
    if (!col) { res.matSinCol[mat] = (res.matSinCol[mat] || 0) + 1; return; }
    res.evals++;
    if (porFecha(a)) res.porFecha++;
    if (!a.grupoId) res.sinSello++;
    const m = res.porMat[col] = res.porMat[col] || { evals: 0, notas: {} };
    m.evals++;
    a.students.forEach(s => {
      if (s && typeof s.nota === 'number' && isFinite(s.nota)) {
        const codSb = String(s.sb || '').split('|')[0];
        const numDest = mapaAl.resolverAlumno(s.num, codSb, s.nombre) || s.num;
        (m.notas[numDest] = m.notas[numDest] || []).push(s.nota);
      }
    });
  });
  return res;
}

/* Las celdas vacías que se pueden llenar, con su promedio ya calculado.
   Se recalcula sobre datos recién cargados justo antes de aplicar, para no
   pisar nada que haya cambiado mientras el diálogo estaba abierto. */
function adSugCambios(d, parcial, fuentes) {
  const cambios = [];
  Object.keys(fuentes.porMat).forEach(mat => {
    const m = fuentes.porMat[mat];
    d.lista.forEach(al => {
      const ya = (((d.notas[parcial] || {})[mat]) || {})[al.num];
      if (ya != null && ya !== '') return;
      const xs = m.notas[al.num];
      if (!xs || !xs.length) return;
      const prom = Math.max(1, Math.min(100, Math.round(xs.reduce((t, x) => t + x, 0) / xs.length)));
      cambios.push({ mat, num: al.num, v: prom, de: xs.slice() });
    });
  });
  return cambios;
}

/* ══════════════════════════════════════════════════════════════════════════
   📥 RECUPERACIÓN MULTICAPA DE NOTAS, PERSONALIDAD Y DÍAS PERDIDOS (I–III)
      + 🕓 VERIFICADOR DE HISTORIAL DE VERSIONES
   ══════════════════════════════════════════════════════════════════════════ */

function adResolverCampoDesdeSlug(slugOMateria, materiasGrupo) {
  const raw = String(slugOMateria || '').trim();
  if (!raw) return null;
  const slug = adMateriaSlug(raw);
  if (!slug) return null;

  for (const p of AD_PERSONALIDAD) {
    if (p.toLowerCase() === raw.toLowerCase() || adMateriaSlug(p) === slug) {
      return { tipo: 'pers', campo: p };
    }
  }
  if (slug === 'inasistencias' || slug === 'inasistencia' || slug === 'dias-perdidos') {
    return { tipo: 'inasis', campo: 'Inasistencias' };
  }
  const mats = Array.isArray(materiasGrupo) && materiasGrupo.length ? materiasGrupo : AD_MATERIAS_DEF;
  for (const m of mats) {
    if (m.toLowerCase() === raw.toLowerCase() || adMateriaSlug(m) === slug) {
      return { tipo: 'aprov', campo: m };
    }
  }
  for (const m of AD_MATERIAS_DEF) {
    if (adMateriaSlug(m) === slug) {
      const col = adSugColumna(m, mats) || m;
      return { tipo: 'aprov', campo: col };
    }
  }
  const mapaCorto = {
    'espanol': 'Español',
    'ingles': 'Inglés',
    'arte': 'Educación Artística',
    'educacion-artistica': 'Educación Artística',
    'matematicas': 'Matemáticas',
    'sociales': 'Ciencias Sociales',
    'ciencias-sociales': 'Ciencias Sociales',
    'naturales': 'Ciencias Naturales',
    'ciencias-naturales': 'Ciencias Naturales',
    'fisica': 'Educación Física',
    'educacion-fisica': 'Educación Física',
    'civica': 'Educación Cívica',
    'educacion-civica': 'Educación Cívica'
  };
  if (mapaCorto[slug]) {
    const col = adSugColumna(mapaCorto[slug], mats) || mapaCorto[slug];
    return { tipo: 'aprov', campo: col };
  }
  return null;
}

function adParseJsonSeguro(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

function adExtraerGrupoDeAdminRaw(adminRaw, codesRaw, dActual) {
  const st = adParseJsonSeguro(adminRaw);
  if (!st || typeof st !== 'object') return null;
  const codesObj = adParseJsonSeguro(codesRaw) || {};
  let grp = null;
  if (Array.isArray(st.grupos)) {
    grp = st.grupos.find(g => g && g.id === dActual.id) ||
          st.grupos.find(g => g && adSugMismoGrupo({ grado: g.grado, seccion: g.seccion }, dActual)) ||
          (st.grupos.length === 1 ? st.grupos[0] : null);
  } else if (Array.isArray(st.lista) || st.notas) {
    grp = st;
  }
  if (!grp) return null;
  const copia = JSON.parse(JSON.stringify(grp));
  adNormGrupo(copia);
  const keyCod = 'G:' + (copia.id || dActual.id);
  const codesGrupo = codesObj[keyCod] || codesObj['G:' + dActual.id] || {};
  return { grupo: copia, codesGrupo, adminFull: st, codesFull: codesObj };
}

function adResumenVersionGrupo(g) {
  const res = {
    alumnos: Array.isArray(g && g.lista) ? g.lista.length : 0,
    pI: 0, pII: 0, pIII: 0, pIV: 0,
    persI: 0, persII: 0, persIII: 0, persIV: 0,
    inasisI: 0, inasisII: 0, inasisIII: 0, inasisIV: 0,
    totalNotas: 0,
    totalPers: 0,
    totalInasis: 0,
    diasAsis: Array.isArray(g && g.asistencia) ? g.asistencia.length : 0
  };
  if (!g || !g.notas) return res;
  const mats = Array.isArray(g.materias) && g.materias.length ? g.materias : AD_MATERIAS_DEF;
  ['I', 'II', 'III', 'IV'].forEach(p => {
    const np = g.notas[p] || {};
    mats.forEach(m => {
      const obj = np[m] || {};
      const cnt = Object.keys(obj).filter(k => obj[k] !== '' && obj[k] != null).length;
      res['p' + p] += cnt;
      res.totalNotas += cnt;
    });
    AD_PERSONALIDAD.forEach(r => {
      const obj = np[r] || {};
      const cnt = Object.keys(obj).filter(k => obj[k] !== '' && obj[k] != null).length;
      res['pers' + p] += cnt;
      res.totalPers += cnt;
    });
    const objIn = np['Inasistencias'] || {};
    const cntIn = Object.keys(objIn).filter(k => objIn[k] !== '' && objIn[k] != null).length;
    res['inasis' + p] += cntIn;
    res.totalInasis += cntIn;
  });
  res.puntajeI_III = (res.pI + res.pII + res.pIII * 2) + (res.persI + res.persII + res.persIII) + (res.inasisI + res.inasisII + res.inasisIII);
  return res;
}

function adRangosParcialesDefecto(d) {
  const anio = adAnioDe(d);
  const pf = (d.boleta && d.boleta.parcialFechas) || {};
  return {
    I:   (pf.I   && pf.I.desde   && pf.I.hasta)   ? pf.I   : { desde: anio + '-02-01', hasta: anio + '-04-30' },
    II:  (pf.II  && pf.II.desde  && pf.II.hasta)  ? pf.II  : { desde: anio + '-05-01', hasta: anio + '-06-30' },
    III: (pf.III && pf.III.desde && pf.III.hasta) ? pf.III : { desde: anio + '-07-01', hasta: anio + '-09-30' },
    IV:  (pf.IV  && pf.IV.desde  && pf.IV.hasta)  ? pf.IV  : { desde: anio + '-10-01', hasta: anio + '-11-30' }
  };
}

function adMismoGrupoFlexible(a, d) {
  if (!a || !d) return false;
  if (a.grupoId && d.id && a.grupoId === d.id) return true;
  const dig = s => String(s || '').replace(/\D/g, '');
  const sec = s => { const m = String(s || '').trim().match(/([a-zA-Z0-9])\s*$/); return m ? m[1].toUpperCase() : ''; };
  return !!dig(a.grado) && dig(a.grado) === dig(d.grado) && sec(a.seccion) === sec(d.seccion);
}

function adParcialDeEvalFlexible(a, rangos) {
  if (!a) return '';
  const p = String(a.parcial || '').trim().toUpperCase();
  if (['I', 'II', 'III', 'IV'].includes(p)) return p;
  const f = String(a.fechaPrueba || a.t || '').slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(f) && rangos) {
    for (const k of ['I', 'II', 'III', 'IV']) {
      if (rangos[k] && f >= rangos[k].desde && f <= rangos[k].hasta) return k;
    }
  }
  return '';
}

/* Recolecta de forma síncrona todas las versiones disponibles localmente en este equipo */
function adRecolectarVersionesLocales(dActual) {
  const versiones = [];
  const firmasVistas = new Set();

  const agregarVersion = (id, origen, titulo, fechaIso, adminRaw, codesRaw, esReconstruccion) => {
    const ext = adExtraerGrupoDeAdminRaw(adminRaw, codesRaw, dActual);
    if (!ext || !ext.grupo) return;
    const stats = adResumenVersionGrupo(ext.grupo);
    const huella = JSON.stringify({
      l: (ext.grupo.lista || []).map(a => a.num + ':' + (a.nombre || '')),
      n: ext.grupo.notas || {},
      a: (ext.grupo.asistencia || []).length
    });
    if (!esReconstruccion && firmasVistas.has(huella)) return;
    firmasVistas.add(huella);
    versiones.push({
      id,
      origen,
      titulo,
      fecha: fechaIso || '',
      grupo: ext.grupo,
      codesGrupo: ext.codesGrupo,
      adminFull: ext.adminFull,
      codesFull: ext.codesFull,
      stats,
      esReconstruccion: !!esReconstruccion
    });
  };

  /* 1. Copias locales en METAS_ADMIN_UNDO_V1 */
  try {
    const undoArr = adUndoLista();
    undoArr.slice().reverse().forEach((u, idx) => {
      if (u && u.admin) {
        agregarVersion(
          'undo-' + idx,
          '🕘 Papelera local',
          'Antes de: ' + (u.e || 'Cambio local'),
          u.t || '',
          u.admin,
          u.codes
        );
      }
    });
  } catch (_) {}

  /* 2. Respaldo automático pre-sincronización (METAS_AULA_RESPALDO_V1) */
  try {
    const resp = adParseJsonSeguro(localStorage.getItem('METAS_AULA_RESPALDO_V1'));
    if (resp && resp.datos && resp.datos[ADMIN_KEY]) {
      agregarVersion(
        'respaldo-aula',
        '🛡️ Respaldo pre-sincronización',
        'Copia automática antes de sincronizar (' + (resp.motivo || 'respaldo') + ')',
        resp.en || '',
        resp.datos[ADMIN_KEY],
        resp.datos['METAS_CODIGOS_V1']
      );
    }
  } catch (_) {}

  /* 3. Base de sincronización entre equipos (METAS_DOCSYNC_BASE_V1) */
  try {
    const base = adParseJsonSeguro(localStorage.getItem('METAS_DOCSYNC_BASE_V1'));
    if (base && base[ADMIN_KEY]) {
      agregarVersion(
        'docsync-base',
        '⚓ Base de sincronización',
        'Última base común sincronizada en este dispositivo',
        '',
        base[ADMIN_KEY],
        base['METAS_CODIGOS_V1']
      );
    }
  } catch (_) {}

  return { versiones, agregarVersion };
}

/* Recolecta todas las versiones disponibles localmente y en la nube docente */
async function adRecolectarVersionesHistorial(dActual) {
  const { versiones, agregarVersion } = adRecolectarVersionesLocales(dActual);

  /* 4. Consultar nube docente (metas_docente_historial_listar + metas_docente_estado_leer) */
  const cred = adDocenteCreds();
  if (cred && navigator.onLine !== false) {
    let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
    let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
    try {
      url = localStorage.getItem('METAS_SB_URL') || url;
      key = localStorage.getItem('METAS_SB_KEY') || key;
    } catch (_) {}
    const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

    try {
      const [rHistAdmin, rHistCodes, rEstado] = await Promise.all([
        fetch(url + '/rest/v1/rpc/metas_docente_historial_listar', {
          method: 'POST', headers,
          body: JSON.stringify({ p_codigo: cred.prof, p_clave: cred.clave, p_k: ADMIN_KEY })
        }).catch(() => null),
        fetch(url + '/rest/v1/rpc/metas_docente_historial_listar', {
          method: 'POST', headers,
          body: JSON.stringify({ p_codigo: cred.prof, p_clave: cred.clave, p_k: 'METAS_CODIGOS_V1' })
        }).catch(() => null),
        fetch(url + '/rest/v1/rpc/metas_docente_estado_leer', {
          method: 'POST', headers,
          body: JSON.stringify({ p_codigo: cred.prof, p_clave: cred.clave })
        }).catch(() => null)
      ]);

      let codesNube = localStorage.getItem('METAS_CODIGOS_V1');
      if (rHistCodes && rHistCodes.ok) {
        const jCodes = await rHistCodes.json();
        if (jCodes && jCodes.ok && Array.isArray(jCodes.versiones) && jCodes.versiones.length) {
          codesNube = jCodes.versiones[0].v || codesNube;
        }
      }

      if (rHistAdmin && rHistAdmin.ok) {
        const jHist = await rHistAdmin.json();
        if (jHist && jHist.ok && Array.isArray(jHist.versiones)) {
          jHist.versiones.forEach((v, i) => {
            if (!v || !v.v) return;
            const et = v.fuente === 'actual' ? '☁️ Estado actual en la nube docente'
              : v.fuente === 'papelera' ? '🗑️ Papelera de sincronización en la nube'
              : '📜 Historial en la nube (versión #' + (v.id || (i + 1)) + ')';
            agregarVersion(
              'nube-hist-' + i,
              et,
              v.motivo ? ('Versión nube · ' + v.motivo) : et,
              v.guardado_en || '',
              v.v,
              codesNube
            );
          });
        }
      }

      if (rEstado && rEstado.ok) {
        const jEst = await rEstado.json();
        if (jEst && jEst.ok && jEst.datos && jEst.datos[ADMIN_KEY]) {
          agregarVersion(
            'nube-estado',
            '☁️ Espejo docente en la nube',
            'Copia guardada en docente_estado',
            jEst.actualizado_en || '',
            jEst.datos[ADMIN_KEY],
            (jEst.datos && jEst.datos['METAS_CODIGOS_V1']) || codesNube
          );
        }
      }
    } catch (_) {}
  }

  return versiones;
}

/* ⚠️ Lo que fue el «autocompletado de los Parciales I–III» (v479, publicado
   el 10 de noviembre de 2026 a la 1:39 de Honduras):

   corría SOLO cada vez que se abría Mi aula o la boleta, y donde no
   encontraba nota la INVENTABA (84 de base, nunca menos de 72, la letra
   S/MB/B en Personalidad, «reparaba» las notas bajas del III Parcial) y la
   subía a la nube de las familias. Una nota que el maestro no puso no puede
   aparecer en una boleta.

   Lo que queda es un botón que el maestro pulsa, con vista previa y
   confirmación, que SOLO copia notas que ya existían en otro respaldo de
   este mismo grupo y SOLO en celdas vacías. Nunca escribe un valor que no
   haya escrito antes el maestro. La sonda _dev/verifica-notas-sin-pedir.js
   falla si algo vuelve a escribir notas al pintar Mi aula.

   Los grupos que pasaron por el autocompletado quedaron con la marca
   d.boleta.autoRecI_III_v479 = 1; adRevisarNotasPuestasSolas() los compara
   con la copia de antes y deja que el maestro decida qué borrar. */
const AD_V479_DESDE = '2026-11-10T07:39:00Z';   // 1:39 en Honduras (UTC−6)

/* ¿Esta copia ya traía notas inventadas? Si la marca está, sus notas no
   sirven de fuente: se copiaría lo inventado como si fuera del maestro. */
function adVersionTieneAutocompletado(g) {
  return !!(g && g.boleta && g.boleta.autoRecI_III_v479);
}

/* Copia SOLO a celdas vacías las notas, la personalidad, las inasistencias
   y los días de asistencia que ya existían en otros respaldos del grupo
   (copias de deshacer, respaldo antes de sincronizar, base común entre
   equipos, historial de la nube, filas que ven las familias). No inventa,
   no promedia, no «repara»: si ninguna copia tiene el dato, la celda se
   queda vacía. Devuelve la lista de cambios para que el maestro la vea
   antes de aceptar; no guarda nada. */
function adReconstruirParcialesI_IIISincrono(dActual, opcionesNube) {
  const opts = opcionesNube || {};
  const todas = Array.isArray(opts.versiones)
    ? opts.versiones
    : adRecolectarVersionesLocales(dActual).versiones;
  const filasAdminNube = Array.isArray(opts.filasAdminNube) ? opts.filasAdminNube : [];
  const nombresPorCodigoNube = opts.nombresPorCodigoNube || {};

  const omitidas = { versiones: 0, filasNube: 0 };
  const versiones = todas.filter(v => {
    if (!v || !v.grupo || v.esReconstruccion) return false;
    if (adVersionTieneAutocompletado(v.grupo)) { omitidas.versiones++; return false; }
    return true;
  });

  const dRec = JSON.parse(JSON.stringify(dActual));
  adNormGrupo(dRec);
  const mats = Array.isArray(dRec.materias) && dRec.materias.length ? dRec.materias : AD_MATERIAS_DEF.slice();

  /* Claves de familia de ESTE grupo únicamente */
  const codesPorNumHistorico = {};
  const agregarMapaCodigosGrupo = objCodes => {
    const parsed = adParseJsonSeguro(objCodes);
    if (!parsed || typeof parsed !== 'object') return;
    const sub = parsed['G:' + dRec.id];
    if (sub && typeof sub === 'object') {
      Object.keys(sub).forEach(num => {
        const c = String(sub[num] || '').trim().toUpperCase();
        if (c && !codesPorNumHistorico[+num]) codesPorNumHistorico[+num] = c;
      });
    }
  };
  agregarMapaCodigosGrupo(localStorage.getItem('METAS_CODIGOS_V1'));
  versiones.forEach(v => {
    if (v.codesFull) agregarMapaCodigosGrupo(v.codesFull);
    if (v.codesGrupo) {
      Object.keys(v.codesGrupo).forEach(n => {
        const c = String(v.codesGrupo[n] || '').trim().toUpperCase();
        if (c && !codesPorNumHistorico[+n]) codesPorNumHistorico[+n] = c;
      });
    }
  });

  /* Mapa de identidad hacia los números actuales de la lista */
  const mapaBase = adConstruirMapaAlumnos(dRec, null, codesPorNumHistorico);
  Object.keys(nombresPorCodigoNube).forEach(cod => {
    if (!mapaBase.deCod[cod]) {
      const nDest = mapaBase.resolverPorNombre(nombresPorCodigoNube[cod]);
      if (nDest) mapaBase.deCod[cod] = nDest;
    }
  });

  const contadores = { notasRecuperadas: 0, persRecuperadas: 0, inasisRecuperadas: 0, diasAsisRecuperados: 0 };
  const cambios = [];
  const nombreDe = num => {
    const al = (dRec.lista || []).find(x => +x.num === +num);
    return al ? (al.nombre || '') : '';
  };

  /* Solo celdas VACÍAS: lo que el maestro ya escribió no se toca nunca. */
  const ponerValorCelda = (parcial, campo, num, valor, fuente) => {
    if (!['I', 'II', 'III', 'IV'].includes(parcial) || !campo || !num) return false;
    if (valor === '' || valor == null) return false;
    dRec.notas[parcial] = dRec.notas[parcial] || {};
    dRec.notas[parcial][campo] = dRec.notas[parcial][campo] || {};
    const actual = dRec.notas[parcial][campo][num];
    if (actual !== '' && actual != null) return false;
    dRec.notas[parcial][campo][num] = valor;
    if (AD_PERSONALIDAD.includes(campo)) contadores.persRecuperadas++;
    else if (campo === 'Inasistencias') contadores.inasisRecuperadas++;
    else contadores.notasRecuperadas++;
    cambios.push({ parcial, campo, num: +num, nombre: nombreDe(num), valor, fuente });
    return true;
  };

  /* Un día de asistencia solo se copia si aquí no existe: si el día ya
     está, el maestro ya pasó lista y lo que dice manda. */
  const ponerDiaAsistencia = (fecha, aus, fuente) => {
    if (!fecha || !aus || !Object.keys(aus).length) return;
    if (dRec.asistencia.some(x => x && x.f === fecha)) return;
    dRec.asistencia.push({ f: fecha, aus });
    contadores.diasAsisRecuperados++;
    cambios.push({ parcial: '', campo: 'Asistencia', num: 0, nombre: '', valor: fecha + ' · ' + Object.keys(aus).length + ' ausente(s)', fuente });
  };

  /* 1) Respaldos, del más completo al menos completo */
  const versionesOrdenadas = versiones.slice().sort((a, b) => b.stats.puntajeI_III - a.stats.puntajeI_III);
  versionesOrdenadas.forEach(ver => {
    const g = ver.grupo;
    const mVer = adConstruirMapaAlumnos(dRec, g.lista, ver.codesGrupo);
    const fuente = ver.origen + (ver.fecha ? ' · ' + String(ver.fecha).slice(0, 10) : '');

    (g.asistencia || []).forEach(r => {
      if (!r || !r.f || !r.aus) return;
      const aus = {};
      Object.keys(r.aus).forEach(oldN => {
        const nDest = mVer.resolverAlumno(oldN, ver.codesGrupo && ver.codesGrupo[oldN], '');
        if (nDest) aus[nDest] = r.aus[oldN];
      });
      ponerDiaAsistencia(r.f, aus, fuente);
    });

    ['I', 'II', 'III', 'IV'].forEach(p => {
      const np = (g.notas && g.notas[p]) || {};
      Object.keys(np).forEach(campoOrig => {
        const infoCampo = adResolverCampoDesdeSlug(campoOrig, mats);
        const campo = infoCampo ? infoCampo.campo : campoOrig;
        const obj = np[campoOrig] || {};
        Object.keys(obj).forEach(oldN => {
          const val = obj[oldN];
          if (val === '' || val == null) return;
          const alOrig = (g.lista || []).find(x => +x.num === +oldN);
          const nDest = mVer.resolverAlumno(oldN, ver.codesGrupo && ver.codesGrupo[oldN], alOrig && alOrig.nombre);
          if (nDest) ponerValorCelda(p, campo, nDest, val, fuente);
        });
      });
    });
  });

  /* 2) Filas que ven las familias. Las que subieron desde el 10 de
     noviembre pueden ser del autocompletado: no sirven de fuente. */
  const diasNube = {};
  filasAdminNube.forEach(f => {
    if (!f || typeof f !== 'object') return;
    if (!adMismoGrupoFlexible(f, dRec) && f.grado && dRec.grado) return;
    if (f.tipo === 'nota_final' && String(f.actualizado_en || '') >= AD_V479_DESDE) { omitidas.filasNube++; return; }
    const cod = String(f.codigo || '').trim().toUpperCase();
    const numPref = (cod.match(/^(\d+)/) || [])[1];
    const nDest = mapaBase.resolverAlumno(numPref, cod, nombresPorCodigoNube[cod] || '');
    if (!nDest) return;
    const fuente = f._esHistorial ? '☁️ Historial de la nube de familias' : '☁️ Nube de familias';

    if (f.tipo === 'asistencia' && f.fecha && (f.estado === 'ausente' || f.estado === 'excusa')) {
      const fIso = String(f.fecha).slice(0, 10);
      diasNube[fIso] = diasNube[fIso] || {};
      if (!diasNube[fIso][nDest]) diasNube[fIso][nDest] = f.estado === 'excusa' ? 'E' : 'A';
      return;
    }

    if (f.tipo === 'nota_final') {
      let p = String(f.parcial || '').trim();
      let matRaw = String(f.materia || '').trim();
      if ((!p || !matRaw) && f.evento_id) {
        const mEv = String(f.evento_id).match(/^ADN-\d{4}-(I{1,3}|IV)-([a-z0-9-]+)-[A-Z0-9]+$/);
        if (mEv) {
          if (!p) p = mEv[1];
          if (!matRaw) matRaw = mEv[2];
        }
      }
      if (!['I', 'II', 'III', 'IV'].includes(p) || !matRaw) return;
      const infoCampo = adResolverCampoDesdeSlug(matRaw, mats);
      if (!infoCampo) return;
      if (infoCampo.tipo === 'pers') {
        const letra = String(f.estado || '').trim().toUpperCase();
        if (letra) ponerValorCelda(p, infoCampo.campo, nDest, letra, fuente);
      } else if (infoCampo.tipo === 'inasis') {
        if (f.nota != null && f.nota !== '' && !isNaN(Number(f.nota))) {
          ponerValorCelda(p, 'Inasistencias', nDest, Math.max(0, Math.round(Number(f.nota))), fuente);
        }
      } else if (f.nota != null && f.nota !== '' && !isNaN(Number(f.nota))) {
        const vNum = Math.round(Number(f.nota));
        if (vNum >= 1 && vNum <= 100) ponerValorCelda(p, infoCampo.campo, nDest, vNum, fuente);
      }
    }
  });
  Object.keys(diasNube).forEach(fIso => ponerDiaAsistencia(fIso, diasNube[fIso], '☁️ Nube de familias'));

  dRec.asistencia.sort((a, b) => String(a.f || '').localeCompare(String(b.f || '')));

  return { grupoRecuperado: dRec, contadores, cambios, omitidas, versiones };
}

/* Igual que la anterior, pero buscando también en la nube del maestro */
async function adReconstruirDesdeNubeYRespaldos(dActual, onProgreso) {
  const prog = txt => { if (typeof onProgreso === 'function') onProgreso(txt); };
  prog('⏳ Buscando en tus copias de este equipo y en la nube…');

  const versiones = await adRecolectarVersionesHistorial(dActual);
  const filasAdminNube = [];
  const cred = adDocenteCreds();

  if (navigator.onLine !== false && cred) {
    let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
    let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
    try {
      url = localStorage.getItem('METAS_SB_URL') || url;
      key = localStorage.getItem('METAS_SB_KEY') || key;
    } catch (_) {}
    const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

    prog('⏳ Consultando lo que ven las familias…');
    try {
      const rGlobal = await fetch(url + '/rest/v1/rpc/metas_recuperar_admin_docente', {
        method: 'POST', headers,
        body: JSON.stringify({ p_prof: cred.prof, p_clave: cred.clave })
      });
      if (rGlobal.ok) {
        const jGlobal = await rGlobal.json();
        if (jGlobal && jGlobal.ok) {
          (jGlobal.actuales || []).forEach(r => filasAdminNube.push(r));
          (jGlobal.historial || []).forEach(r => filasAdminNube.push(Object.assign({}, r, { _esHistorial: true })));
        }
      }
    } catch (_) {}
  }

  return adReconstruirParcialesI_IIISincrono(dActual, { versiones, filasAdminNube });
}

/* Ventana con una tabla de cambios. Con `marcables`, cada fila lleva su
   casilla y se devuelve la lista de las que quedaron marcadas; sin ella,
   true o false. Nada se aplica aquí: quien llama decide. */
function adModalCambios(o) {
  return new Promise(resolve => {
    const filas = o.filas || [];
    const ov = document.createElement('div');
    ov.className = 'ad-gen-ov ad-ver-ov';
    ov.innerHTML = `
      <div class="ad-gen-card ad-ver-card" role="dialog" aria-modal="true" aria-labelledby="ad-cam-tit">
        <div class="ad-gen-head">
          <div class="ad-gen-title" id="ad-cam-tit">${adEsc(o.titulo)}</div>
          <button type="button" class="ad-gen-close" id="ad-cam-x" aria-label="Cerrar">✕</button>
        </div>
        <div class="ad-gen-hint">${o.introHtml || ''}</div>
        ${filas.length ? `
        ${o.marcables ? `<div class="ad-btn-row" style="margin:4px 0">
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-cam-todas">☑️ Marcar todas</button>
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-cam-ninguna">⬜ Desmarcar todas</button>
        </div>` : ''}
        <div class="ad-ver-prev-tbl ad-cam-tbl">
          <table class="ad-mx ad-ver-mx">
            <thead><tr>
              ${o.marcables ? '<th>Borrar</th>' : ''}
              <th>Parcial</th><th>Qué</th><th style="text-align:left">Alumno</th><th>${adEsc(o.colValor || 'Valor')}</th><th style="text-align:left">${adEsc(o.colFuente || 'De dónde sale')}</th>
            </tr></thead>
            <tbody>
              ${filas.map((c, i) => `<tr>
                ${o.marcables ? `<td><label class="ad-cam-chk"><input type="checkbox" data-i="${i}" ${c.marcada === false ? '' : 'checked'} aria-label="Borrar esta"></label></td>` : ''}
                <td>${adEsc(c.parcial || '·')}</td>
                <td>${adEsc(c.campo)}</td>
                <td style="text-align:left">${c.num ? '#' + c.num + ' ' + adEsc(c.nombre || '') : '·'}</td>
                <td><b>${adEsc(String(c.valor))}</b></td>
                <td style="text-align:left">${adEsc(c.fuente || '')}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}
        <div class="ad-gen-foot">
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-cam-no">${adEsc(o.noTxt || 'Cancelar')}</button>
          ${filas.length && o.okTxt ? `<button type="button" class="pa-generate-btn" id="ad-cam-si">${adEsc(o.okTxt)}</button>` : ''}
        </div>
      </div>`;
    document.body.appendChild(ov);
    const fin = v => { ov.remove(); resolve(v); };
    ov.querySelector('#ad-cam-x').addEventListener('click', () => fin(o.marcables ? null : false));
    ov.querySelector('#ad-cam-no').addEventListener('click', () => fin(o.marcables ? null : false));
    ov.addEventListener('click', e => { if (e.target === ov) fin(o.marcables ? null : false); });
    const marcar = v => ov.querySelectorAll('.ad-cam-chk input').forEach(x => { x.checked = v; });
    ov.querySelector('#ad-cam-todas')?.addEventListener('click', () => marcar(true));
    ov.querySelector('#ad-cam-ninguna')?.addEventListener('click', () => marcar(false));
    ov.querySelector('#ad-cam-si')?.addEventListener('click', () => {
      if (!o.marcables) { fin(true); return; }
      fin([...ov.querySelectorAll('.ad-cam-chk input')].filter(x => x.checked).map(x => filas[+x.dataset.i]));
    });
  });
}

/* El botón «Copiar notas de mis respaldos». Busca, enseña lo que copiaría
   y solo guarda si el maestro acepta. */
async function adRecuperarNotasNube(btn, alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || !d.lista.length) {
    if (typeof toast === 'function') toast('Primero agrega tu lista de alumnos');
    return;
  }

  const txtOrig = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Buscando en tus respaldos…'; }

  try {
    const res = await adReconstruirDesdeNubeYRespaldos(d, msg => { if (btn) btn.textContent = msg; });
    const c = res.contadores;
    const n = res.cambios.length;
    const avisoOmitidas = (res.omitidas.versiones || res.omitidas.filasNube)
      ? `<p>No se usaron ${res.omitidas.versiones ? res.omitidas.versiones + ' copia(s)' : ''}${res.omitidas.versiones && res.omitidas.filasNube ? ' ni ' : ''}${res.omitidas.filasNube ? res.omitidas.filasNube + ' nota(s) de la nube' : ''} porque son del 10 de noviembre en adelante y pueden traer notas que la aplicación puso sola.</p>`
      : '';
    const intro = n
      ? `<p>Encontré <strong>${n}</strong> dato(s) que ya habías escrito en otra copia y que hoy están <strong>vacíos</strong> aquí:
          ${c.notasRecuperadas} nota(s), ${c.persRecuperadas} de personalidad, ${c.inasisRecuperadas} de inasistencias y ${c.diasAsisRecuperados} día(s) de asistencia.</p>
         <p>Solo se llenan celdas vacías. Lo que ya tienes escrito no cambia, y no se inventa ningún valor. Antes de copiar se guarda una copia en «🕘 Deshacer».</p>${avisoOmitidas}`
      : `<p>No encontré ninguna nota en tus respaldos que falte aquí. No se cambió nada.</p>${avisoOmitidas}`;

    const ok = await adModalCambios({
      titulo: '📥 Copiar notas de mis respaldos',
      introHtml: intro,
      filas: res.cambios,
      okTxt: n ? 'Sí, copiar estos ' + n : '',
      noTxt: n ? 'No copiar' : 'Cerrar'
    });
    if (!ok || !n) return;

    adUndoGuardar('Copiar notas de mis respaldos (' + n + ' dato(s))');
    adSave(res.grupoRecuperado);
    adSyncProgramar();
    if (typeof alTerminar === 'function') alTerminar();
    else renderAdmin(true);
    if (typeof toast === 'function') toast('✅ Copiados ' + n + ' dato(s) de tus respaldos');
  } catch (err) {
    if (typeof toast === 'function') toast('⚠️ No se pudo buscar en tus respaldos: ' + (err && err.message ? err.message : 'intenta de nuevo'));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = txtOrig || '📥 Copiar notas de mis respaldos'; }
  }
}

/* «Revisar notas que la aplicación puso sola». Compara el grupo de hoy con
   la copia de JUSTO ANTES del autocompletado (la de «🕘 Deshacer» que él
   mismo guardó, o una del historial de la nube anterior al 10 de noviembre)
   y lista las celdas que estaban vacías y hoy tienen algo, o que cambiaron.
   El maestro marca cuáles borrar; nada se borra sin su «Sí». */
async function adRevisarNotasPuestasSolas(btn, alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || !d.lista.length) {
    if (typeof toast === 'function') toast('Primero agrega tu lista de alumnos');
    return;
  }
  const txtOrig = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Buscando la copia de antes…'; }
  try {
    const versiones = await adRecolectarVersionesHistorial(d);
    /* La copia de referencia: la más reciente que NO trae la marca y que es
       de antes del autocompletado (o es la que él mismo guardó al entrar). */
    const candidatas = versiones.filter(v => v && v.grupo && !adVersionTieneAutocompletado(v.grupo) &&
      (/Autocompletar Parciales I/.test(v.titulo || '') || (v.fecha && String(v.fecha) < AD_V479_DESDE)));
    candidatas.sort((a, b) => {
      const pa = /Autocompletar Parciales I/.test(a.titulo || '') ? 1 : 0;
      const pb = /Autocompletar Parciales I/.test(b.titulo || '') ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return String(b.fecha || '').localeCompare(String(a.fecha || ''));
    });
    const ref = candidatas[0];
    const marcado = adVersionTieneAutocompletado(d);

    if (!ref) {
      await adModalCambios({
        titulo: '🔎 Notas que la aplicación puso sola',
        introHtml: marcado
          ? '<p>Este grupo pasó por el autocompletado del 10 de noviembre, pero no encontré en este equipo ni en tu nube una copia de antes para comparar. Revisa a mano las notas de los Parciales I, II y III, o abre esta herramienta desde el equipo donde trabajas más seguido.</p>'
          : '<p>Este grupo no tiene la marca del autocompletado y no encontré una copia de antes. No hay nada que revisar.</p>',
        filas: [], noTxt: 'Cerrar'
      });
      return;
    }

    const g = ref.grupo;
    const mVer = adConstruirMapaAlumnos(d, g.lista, ref.codesGrupo);
    const antes = {};   // 'p|campo|numActual' → valor de antes
    ['I', 'II', 'III'].forEach(p => {
      const np = (g.notas && g.notas[p]) || {};
      Object.keys(np).forEach(campo => {
        Object.keys(np[campo] || {}).forEach(oldN => {
          const val = np[campo][oldN];
          if (val === '' || val == null) return;
          const alOrig = (g.lista || []).find(x => +x.num === +oldN);
          const nDest = mVer.resolverAlumno(oldN, ref.codesGrupo && ref.codesGrupo[oldN], alOrig && alOrig.nombre);
          if (nDest) antes[p + '|' + campo + '|' + nDest] = val;
        });
      });
    });

    const filas = [];
    const nombreDe = num => { const al = d.lista.find(x => +x.num === +num); return al ? al.nombre || '' : ''; };
    ['I', 'II', 'III'].forEach(p => {
      const np = (d.notas && d.notas[p]) || {};
      Object.keys(np).forEach(campo => {
        Object.keys(np[campo] || {}).forEach(num => {
          const hoy = np[campo][num];
          if (hoy === '' || hoy == null) return;
          const era = antes[p + '|' + campo + '|' + num];
          if (era != null && String(era) === String(hoy)) return;
          filas.push({
            parcial: p, campo, num: +num, nombre: nombreDe(num),
            valor: String(hoy), era: era == null ? '' : era,
            fuente: era == null ? 'antes estaba vacía' : 'antes decía ' + era,
            /* Una celda que antes tenía otra nota se devuelve a esa nota,
               no se deja vacía. Inasistencias en 0 no se marca de entrada:
               casi siempre es verdad. */
            marcada: !(campo === 'Inasistencias' && Number(hoy) === 0)
          });
        });
      });
    });

    const fechaRef = ref.fecha ? adFechaBonita(String(ref.fecha).slice(0, 10)) + (String(ref.fecha).slice(11, 16) ? ' ' + String(ref.fecha).slice(11, 16) : '') : '';
    const elegidas = await adModalCambios({
      titulo: '🔎 Notas que la aplicación puso sola',
      introHtml: `<p>Comparo tus notas de hoy con la copia <strong>${adEsc(ref.titulo)}</strong>${fechaRef ? ' (' + adEsc(fechaRef) + ')' : ''}.
        Estas <strong>${filas.length}</strong> celda(s) de los Parciales I, II y III estaban vacías o decían otra cosa en esa copia.</p>
        <p>Algunas las pudiste escribir tú después: desmarca las que sean tuyas. Las marcadas que antes estaban vacías se vacían; las que decían otra nota vuelven a esa nota. Antes se guarda una copia en «🕘 Deshacer», y la nube de las familias se corrige al sincronizar.</p>`,
      filas, marcables: true, colValor: 'Hoy dice', colFuente: 'En la copia de antes',
      okTxt: 'Borrar las marcadas…', noTxt: 'Cerrar sin borrar'
    });
    if (!elegidas || !elegidas.length) return;

    if (!await metasConfirm('¿Borrar **' + elegidas.length + '** dato(s) de los Parciales I, II y III de **' +
      (adGrupoTxt(d) || 'este grupo') + '**?\n\nSe guarda antes una copia en «🕘 Deshacer» para volver atrás si te equivocas.',
      { icono: '🗑️', titulo: 'Borrar notas puestas solas', okTxt: 'Sí, borrar' })) return;

    adUndoGuardar('Antes de borrar ' + elegidas.length + ' nota(s) puestas por el autocompletado');
    const dd = adLoad();
    elegidas.forEach(c => {
      const obj = ((dd.notas[c.parcial] || {})[c.campo]) || null;
      if (!obj) return;
      if (c.era !== '' && c.era != null) obj[c.num] = c.era;
      else obj[c.num] = '';   // vacía, no se quita: así sube como «nota borrada» y la familia deja de verla
    });
    /* La marca se queda solo si el maestro dejó celdas sin revisar */
    if (dd.boleta && elegidas.length === filas.length) delete dd.boleta.autoRecI_III_v479;
    adSave(dd);
    adSyncProgramar();
    if (typeof alTerminar === 'function') alTerminar();
    else renderAdmin(true);
    if (typeof toast === 'function') toast('🗑️ Borradas ' + elegidas.length + ' nota(s); puedes deshacerlo en «🕘 Deshacer»');
  } catch (err) {
    if (typeof toast === 'function') toast('⚠️ No se pudo revisar: ' + (err && err.message ? err.message : 'intenta de nuevo'));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = txtOrig || '🔎 Revisar notas que la aplicación puso sola'; }
  }
}

/* Modal interactivo para verificar el historial de versiones (locales + nube + reconstrucción) */
async function adAbrirHistorialVersionesModal(alTerminar) {
  const d = adLoad();
  if (!d || !Array.isArray(d.lista) || !d.lista.length) {
    if (typeof toast === 'function') toast('Primero agrega tu lista de alumnos');
    return;
  }

  const ov = document.createElement('div');
  ov.className = 'ad-gen-ov ad-ver-ov';
  ov.innerHTML = `
    <div class="ad-gen-card ad-ver-card" role="dialog" aria-modal="true" aria-labelledby="ad-ver-tit">
      <div class="ad-gen-head">
        <div class="ad-gen-title" id="ad-ver-tit">🕓 Historial de versiones y respaldos · ${adEsc(adGrupoTxt(d) || 'Mi grupo')}</div>
        <button type="button" class="ad-gen-close" id="ad-ver-x" aria-label="Cerrar">✕</button>
      </div>
      <p class="ad-gen-hint">
        Verifica las versiones guardadas en este dispositivo y en la nube. Puedes <strong>👁️ previsualizar las notas</strong> de cualquier versión,
        <strong>📥 fusionar sus Parciales I–III</strong> (conservando el orden actual de tus filas) o <strong>↩️ restaurar la versión completa</strong>.
      </p>
      <div id="ad-ver-body" class="ad-ver-body">
        <div class="ad-ver-loading">⏳ Consultando versiones locales, papelera, espejo docente y nube de padres…</div>
      </div>
      <div id="ad-ver-preview" class="ad-ver-preview" style="display:none;"></div>
      <div class="ad-gen-foot">
        <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-ver-close">Cerrar</button>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const cerrar = () => { ov.remove(); };
  ov.querySelector('#ad-ver-x')?.addEventListener('click', cerrar);
  ov.querySelector('#ad-ver-close')?.addEventListener('click', cerrar);
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });

  const bodyEl = ov.querySelector('#ad-ver-body');
  const prevEl = ov.querySelector('#ad-ver-preview');

  try {
    const rec = await adReconstruirDesdeNubeYRespaldos(d, txt => {
      if (bodyEl) bodyEl.innerHTML = `<div class="ad-ver-loading">${adEsc(txt)}</div>`;
    });

    const todasVersiones = [
      {
        id: 'reconstruccion-nube-i-iii',
        origen: '📥 Lo de hoy + lo que falta y está en tus respaldos',
        titulo: 'Tus notas de hoy, más las celdas vacías que otra copia sí tenía (' + (rec.cambios || []).length + ' dato(s)). No inventa ninguna nota.',
        fecha: new Date().toISOString(),
        grupo: rec.grupoRecuperado,
        codesGrupo: {},
        stats: adResumenVersionGrupo(rec.grupoRecuperado),
        esReconstruccion: true
      }
    ].concat(rec.versiones || []);

    const fmtFecha = iso => {
      if (!iso) return 'Fecha local';
      const f = String(iso).slice(0, 10);
      const h = String(iso).slice(11, 16);
      return adFechaBonita(f) + (h ? ' · ' + h : '');
    };

    bodyEl.innerHTML = todasVersiones.map((v, idx) => {
      const s = v.stats;
      return `
        <div class="ad-ver-item${v.esReconstruccion ? ' ad-ver-item-dest' : ''}" data-vidx="${idx}">
          <div class="ad-ver-item-top">
            <div>
              <span class="ad-ver-badge">${adEsc(v.origen)}</span>${!v.esReconstruccion && adVersionTieneAutocompletado(v.grupo) ? ' <span class="ad-ver-badge ad-ver-badge-alerta">⚠️ Trae notas que la aplicación puso sola (10 nov.)</span>' : ''}
              <div class="ad-ver-item-tit">${adEsc(v.titulo)}</div>
            </div>
            <span class="ad-ver-date">${adEsc(fmtFecha(v.fecha))}</span>
          </div>
          <div class="ad-ver-kpis">
            <span class="ad-ver-kpi">👥 <b>${s.alumnos}</b> alumnos</span>
            <span class="ad-ver-kpi">📗 P-I: <b>${s.pI}</b> notas</span>
            <span class="ad-ver-kpi">📘 P-II: <b>${s.pII}</b> notas</span>
            <span class="ad-ver-kpi">📙 P-III: <b>${s.pIII}</b> notas</span>
            <span class="ad-ver-kpi">📕 P-IV: <b>${s.pIV}</b> notas</span>
            <span class="ad-ver-kpi">🙂 Personalidad: <b>${s.totalPers}</b></span>
            <span class="ad-ver-kpi">📅 Días perdidos: <b>${s.totalInasis}</b> (${s.diasAsis} días lista)</span>
          </div>
          <div class="ad-ver-actions">
            <button type="button" class="pa-generate-btn ad-btn-sec ad-ver-btn" data-vact="ver" data-vidx="${idx}">👁️ Previsualizar notas</button>
            <button type="button" class="pa-generate-btn ad-ver-btn ad-ver-btn-pri" data-vact="fusionar" data-vidx="${idx}">📥 Recuperar I–III (mantener orden actual)</button>
            ${!v.esReconstruccion ? `<button type="button" class="pa-generate-btn ad-btn-sec ad-ver-btn" data-vact="restaurar" data-vidx="${idx}">↩️ Restaurar versión completa</button>` : ''}
          </div>
        </div>`;
    }).join('');

    const mostrarPreview = v => {
      const g = v.grupo;
      const mats = Array.isArray(g.materias) && g.materias.length ? g.materias : AD_MATERIAS_DEF;
      prevEl.style.display = 'block';
      prevEl.innerHTML = `
        <div class="ad-ver-prev-head">
          <strong>👁️ Vista previa: ${adEsc(v.titulo)}</strong>
          <div class="ad-ver-prev-tabs">
            ${['I', 'II', 'III', 'IV'].map(p => `<button type="button" class="ad-gen-qbtn ad-ver-ptab${p === 'III' ? ' active' : ''}" data-vp="${p}">Parcial ${p}</button>`).join('')}
          </div>
        </div>
        <div id="ad-ver-prev-tbl" class="ad-ver-prev-tbl"></div>`;

      const pintarTablaP = p => {
        prevEl.querySelectorAll('.ad-ver-ptab').forEach(b => b.classList.toggle('active', b.dataset.vp === p));
        const np = (g.notas && g.notas[p]) || {};
        const tblBox = prevEl.querySelector('#ad-ver-prev-tbl');
        tblBox.innerHTML = `
          <table class="ad-mx ad-ver-mx">
            <thead>
              <tr>
                <th># · Alumno</th>
                ${mats.map(m => `<th>${adEsc(m)}</th>`).join('')}
                <th>🙂 Conducta</th>
                <th>📅 Faltas</th>
              </tr>
            </thead>
            <tbody>
              ${(g.lista || []).map(al => {
                const persVals = AD_PERSONALIDAD.map(r => (np[r] || {})[al.num] || '').filter(Boolean);
                const persTxt = persVals.length ? persVals.join('/') : '—';
                const inas = (np['Inasistencias'] || {})[al.num];
                return `<tr>
                  <td style="text-align:left;font-weight:700;white-space:nowrap;">#${al.num} ${adEsc(adPrimerNombre(al.nombre) || al.nombre || '')}</td>
                  ${mats.map(m => {
                    const vNota = (np[m] || {})[al.num];
                    return `<td>${vNota != null && vNota !== '' ? adEsc(String(vNota)) : '·'}</td>`;
                  }).join('')}
                  <td>${adEsc(persTxt)}</td>
                  <td>${inas != null && inas !== '' ? adEsc(String(inas)) : '0'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>`;
      };
      pintarTablaP('III');
      prevEl.querySelectorAll('.ad-ver-ptab').forEach(b => {
        b.addEventListener('click', () => pintarTablaP(b.dataset.vp));
      });
      try { prevEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (_) {}
    };

    bodyEl.querySelectorAll('[data-vact]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = +btn.dataset.vidx;
        const act = btn.dataset.vact;
        const v = todasVersiones[idx];
        if (!v) return;

        if (act === 'ver') {
          mostrarPreview(v);
          return;
        }

        if (act === 'fusionar') {
          if (!await metasConfirm(
            '¿Recuperar las notas de **Parcial I, II y III**, **Personalidad** y **Días perdidos** desde **«' + v.titulo + '»**?\n\n' +
            'Se conservará el **orden actual de tu lista de alumnos**. Donde esa versión tiene un dato escrito, **reemplaza** al de hoy. Antes se guarda una copia en «🕘 Deshacer».' +
            (!v.esReconstruccion && adVersionTieneAutocompletado(v.grupo) ? '\n\n⚠️ Esta versión es del autocompletado del 10 de noviembre: trae notas que tú no pusiste.' : ''),
            { icono: '📥', titulo: 'Recuperar de esta versión', okTxt: 'Sí, recuperar I–III' }
          )) return;
          adUndoGuardar('Antes de fusionar versión: ' + v.titulo);
          const dd = adLoad();
          const mVer = adConstruirMapaAlumnos(dd, v.grupo.lista, v.codesGrupo);
          ['I', 'II', 'III'].forEach(p => {
            const np = (v.grupo.notas && v.grupo.notas[p]) || {};
            dd.notas[p] = dd.notas[p] || {};
            Object.keys(np).forEach(campo => {
              dd.notas[p][campo] = dd.notas[p][campo] || {};
              Object.keys(np[campo] || {}).forEach(oldN => {
                const val = np[campo][oldN];
                if (val === '' || val == null) return;
                const alOrig = (v.grupo.lista || []).find(x => +x.num === +oldN);
                const nDest = mVer.resolverAlumno(oldN, v.codesGrupo && v.codesGrupo[oldN], alOrig && alOrig.nombre);
                if (nDest) dd.notas[p][campo][nDest] = val;
              });
            });
          });
          /* Fusionar asistencia */
          (v.grupo.asistencia || []).forEach(r => {
            if (!r || !r.f || !r.aus) return;
            let reg = dd.asistencia.find(x => x && x.f === r.f);
            if (!reg) { reg = { f: r.f, aus: {} }; dd.asistencia.push(reg); }
            Object.keys(r.aus).forEach(oldN => {
              const alOrig = (v.grupo.lista || []).find(x => +x.num === +oldN);
              const nDest = mVer.resolverAlumno(oldN, v.codesGrupo && v.codesGrupo[oldN], alOrig && alOrig.nombre);
              if (nDest && !reg.aus[nDest]) reg.aus[nDest] = r.aus[oldN];
            });
          });
          dd.asistencia.sort((a, b) => String(a.f || '').localeCompare(String(b.f || '')));
          adSave(dd);
          adSyncProgramar();
          cerrar();
          if (typeof alTerminar === 'function') alTerminar();
          else renderAdmin(true);
          if (typeof toast === 'function') toast('✅ Parciales I–III recuperados desde la versión seleccionada');
          return;
        }

        if (act === 'restaurar') {
          if (!await metasConfirm(
            '¿Restaurar **por completo** la versión **«' + v.titulo + '»**?\n\n' +
            'El grupo volverá exactamente a como estaba en esa versión (incluyendo el orden de la lista en ese momento). Se guardará antes una copia en «🕘 Deshacer».',
            { icono: '↩️', titulo: 'Restaurar versión completa', okTxt: 'Sí, restaurar' }
          )) return;
          adUndoGuardar('Antes de restaurar versión: ' + v.titulo);
          if (v.codesGrupo && Object.keys(v.codesGrupo).length) {
            try {
              const cActual = JSON.parse(localStorage.getItem('METAS_CODIGOS_V1')) || {};
              cActual['G:' + d.id] = JSON.parse(JSON.stringify(v.codesGrupo));
              localStorage.setItem('METAS_CODIGOS_V1', JSON.stringify(cActual));
            } catch (_) {}
          }
          const copiaGrupo = JSON.parse(JSON.stringify(v.grupo));
          copiaGrupo.id = d.id;
          adSave(copiaGrupo);
          adSyncProgramar();
          cerrar();
          if (typeof alTerminar === 'function') alTerminar();
          else renderAdmin(true);
          if (typeof toast === 'function') toast('↩️ Versión restaurada por completo');
        }
      });
    });
  } catch (err) {
    if (bodyEl) {
      bodyEl.innerHTML = `<div class="ad-ver-loading">⚠️ No se pudo cargar el historial: ${adEsc(err && err.message ? err.message : 'error')}</div>`;
    }
  }
}

/* Autorización expresa del docente para habilitar «✨ Sugerir notas» en el Parcial IV */
async function adAutorizarSugerirParcialIV(alTerminar) {
  const d = adLoad();
  const ok = await metasConfirm(
    '🔒 **«✨ Sugerir notas»** está restringido exclusivamente al **Parcial IV** para proteger las calificaciones definitivas de los Parciales I, II y III.\n\n' +
    '¿Deseas **autorizar** el cálculo de sugerencias automáticas en el **Parcial IV** para este grupo?',
    { icono: '🛡️', titulo: 'Autorizar Sugerir notas en Parcial IV', okTxt: 'Continuar para autorizar' }
  );
  if (!ok) return;

  let doc = {};
  try { doc = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')) || {}; } catch (_) {}
  if (doc && doc.codigo) {
    const verif = await adPedirContrasena('Autorizar Sugerir notas · Parcial IV');
    if (!verif) return;
  } else {
    const confTxt = await metasPrompt(
      'Escribe **AUTORIZAR** para habilitar «✨ Sugerir notas» en el **Parcial IV**:',
      {
        icono: '🛡️',
        titulo: 'Autorización del docente',
        okTxt: 'Autorizar Parcial IV',
        valida: v => String(v || '').trim().toUpperCase() === 'AUTORIZAR' ? '' : 'Escribe la palabra AUTORIZAR para confirmar.'
      }
    );
    if (confTxt === null) return;
  }

  const dd = adLoad();
  dd.boleta = dd.boleta || adBoletaDef();
  dd.boleta.sugerirIVAuth = new Date().toISOString();
  adSave(dd);
  if (typeof alTerminar === 'function') alTerminar();
  if (typeof toast === 'function') toast('🛡️ Autorizado «Sugerir notas» para el Parcial IV');
}

function adRenderSace(body, d) {
  if (!d.lista.length) { adSinLista(body, 'la boleta'); return; }
  /* Asegurar que se use y sincronice el parcial y vista activos */
  if (body.dataset.parcial && ['I', 'II', 'III', 'IV'].includes(body.dataset.parcial)) {
    _adSaceParcial = body.dataset.parcial;
  } else {
    body.dataset.parcial = _adSaceParcial;
  }
  if (body.dataset.vista && ['aprov', 'pers', 'inasis'].includes(body.dataset.vista)) {
    _adSaceVista = body.dataset.vista;
  } else {
    body.dataset.vista = _adSaceVista;
  }
  const parcial = _adSaceParcial;
  const vista = _adSaceVista;

  /* Capturar la celda activa para restaurar foco y cursor tras sincronización o re-render */
  let activeInpInfo = null;
  const prevActiveEl = document.activeElement;
  if (prevActiveEl && prevActiveEl.classList && prevActiveEl.classList.contains('ad-mx-inp')) {
    activeInpInfo = {
      num: prevActiveEl.dataset.num,
      alumno: prevActiveEl.dataset.alumno || prevActiveEl.dataset.num,
      campo: prevActiveEl.dataset.campo,
      materia: prevActiveEl.dataset.materia || prevActiveEl.dataset.campo,
      parcial: prevActiveEl.dataset.parcial,
      selStart: prevActiveEl.selectionStart,
      selEnd: prevActiveEl.selectionEnd
    };
  } else if (_adCapturedState && _adCapturedState.activeInput) {
    activeInpInfo = _adCapturedState.activeInput;
  }

  const esLetra = vista === 'pers';
  const esInasis = vista === 'inasis';
  const cols = esLetra ? AD_PERSONALIDAD.slice() : esInasis ? ['Inasistencias'] : d.materias.slice();
  const valOfP = (p, c, num) => { const v = (((d.notas[p] || {})[c]) || {})[num]; return (v == null || v === '') ? '' : v; };
  const valOf = (c, num) => valOfP(parcial, c, num);
  /* En PERSONALIDAD los CUATRO parciales van a la vista de una vez (cada
     rasgo con sus columnas I–IV): la conducta se llena de corrido, sin ir
     parcial por parcial. En aprovechamiento no cabe (8+ materias × 4) y las
     notas nacen parcial a parcial, así que ahí sigue el selector. */
  const parcialesTodos = ['I', 'II', 'III', 'IV'];
  const colDefs = esLetra
    ? AD_PERSONALIDAD.reduce((arr, t) => arr.concat(parcialesTodos.map((p, i) =>
        ({ campo: t, parcial: p, ini: i === 0 }))), [])
    : cols.map(c => ({ campo: c, parcial }));
  // rango de fechas para traer faltas del pase de lista (por parcial)
  const _fAsis = (d.asistencia || []).map(r => r.f).filter(Boolean).sort();
  const _rango = (d.boleta.parcialFechas && d.boleta.parcialFechas[parcial]) || {};
  const desdeDef = _rango.desde || _fAsis[0] || '';
  const hastaDef = _rango.hasta || _fAsis[_fAsis.length - 1] || '';

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">🧾 Boleta de calificaciones</div>
      <details class="ad-boleta-cfg">
        <summary>🏫 Encabezado (logos y datos oficiales)</summary>
        <div class="ad-boleta-cfg-body">
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div class="ad-logo-fila" style="flex:1;min-width:180px;">
              <div class="ad-logo-prev" id="ad-logo-prev">${d.logo
                ? `<img src="${d.logo}" alt="logo">`
                : '<span>Sin logo</span>'}</div>
              <div class="ad-logo-btns">
                <span class="ad-logo-rot">Logo del centro</span>
                <label class="pa-generate-btn ad-btn-sec ad-logo-lbl">📷 Subir
                  <input type="file" id="ad-logo-file" accept="image/*" style="display:none;"></label>
                ${d.logo ? '<button class="pa-generate-btn ad-btn-sec" id="ad-logo-quitar">Quitar</button>' : ''}
              </div>
            </div>
            <div class="ad-logo-fila" style="flex:1;min-width:180px;">
              <div class="ad-logo-prev" id="ad-logosec-prev">${d.logoSec
                ? `<img src="${d.logoSec}" alt="logo Secretaría">`
                : '<img src="img/logo-secretaria.png" alt="logo oficial (por defecto)">'}</div>
              <div class="ad-logo-btns">
                <span class="ad-logo-rot">Logo de la Secretaría${d.logoSec ? '' : ' <small class="ad-logo-nota">(oficial, ya incluido)</small>'}</span>
                <label class="pa-generate-btn ad-btn-sec ad-logo-lbl">🏛️ Subir
                  <input type="file" id="ad-logosec-file" accept="image/*" style="display:none;"></label>
                ${d.logoSec ? '<button class="pa-generate-btn ad-btn-sec" id="ad-logosec-quitar">Quitar</button>' : ''}
              </div>
            </div>
          </div>
          <div class="pa-field"><label>Nombre del centro educativo</label>
            <input id="ad-boleta-centro" class="pa-inp-field" value="${adEsc(d.escuela)}"
                   placeholder="Ej.: John Arnold Cook"></div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Nombre del director(a)</label>
              <input id="ad-bol-director" class="pa-inp-field" value="${adEsc(d.boleta.director)}" placeholder="Director(a)"></div>
            <div class="pa-field"><label>Docente de grado</label>
              <input id="ad-bol-docente" class="pa-inp-field" value="${adEsc(d.boleta.docente)}" placeholder="Tu nombre"></div>
          </div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Lugar (aldea/colonia)</label>
              <input id="ad-bol-lugar" class="pa-inp-field" value="${adEsc(d.boleta.lugar)}" placeholder="Ej.: Col. Colinas de Suiza"></div>
            <div class="pa-field"><label>Municipio</label>
              <input id="ad-bol-municipio" class="pa-inp-field" value="${adEsc(d.boleta.municipio)}" placeholder="Ej.: Villanueva"></div>
          </div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Departamento</label>
              <input id="ad-bol-depto" class="pa-inp-field" value="${adEsc(d.boleta.departamento)}" placeholder="Ej.: Cortés"></div>
            <div class="pa-field"><label>Año lectivo</label>
              <input id="ad-bol-anio" class="pa-inp-field" inputmode="numeric" maxlength="4" value="${adEsc(d.boleta.anio)}" placeholder="${new Date().getFullYear()}"></div>
          </div>
          <p class="pa-optional-hint">El logo, el nombre y estos datos salen en la boleta impresa (frente y
            <strong>reverso oficial</strong>). Se guardan y sincronizan con tus equipos. El grado y la sección
            se toman de la pestaña <strong>Alumnos</strong>.</p>
        </div>
      </details>

      <p class="pa-optional-hint">${esLetra
        ? 'La <strong>Personalidad</strong> se llena con los <strong>cuatro parciales a la vista</strong>: cada rasgo trae sus columnas I–IV, sin andar cambiando de parcial. Todo va a <strong>SACE</strong> y a la <strong>boleta</strong>.'
        : `Elige el <strong>parcial</strong> y llena cada alumno <strong>a lo ancho</strong>,
        en el orden de la boleta: avanza con <strong>Enter</strong> o <strong>Tab</strong> a la siguiente
        materia y, al terminar la fila, baja al siguiente alumno. Las notas van a <strong>SACE</strong> y a la <strong>boleta</strong>.`}</p>
      <div class="pa-row-2">
        ${esLetra ? '' : `
        <div class="pa-field"><label>Parcial</label>
          <select id="ad-sace-parcial" class="pa-inp-field">
            ${['I', 'II', 'III', 'IV'].map(p => `<option value="${p}" ${p === parcial ? 'selected' : ''}>Parcial ${p}</option>`).join('')}
          </select></div>`}
        <div class="pa-field"><label>Sección a llenar</label>
          <select id="ad-sace-vista" class="pa-inp-field">
            <option value="aprov" ${vista === 'aprov' ? 'selected' : ''}>📚 Aprovechamiento (todas las materias)</option>
            <option value="pers" ${vista === 'pers' ? 'selected' : ''}>🙂 Personalidad (en letra)</option>
            <option value="inasis" ${vista === 'inasis' ? 'selected' : ''}>📅 Inasistencias</option>
          </select></div>
      </div>
      <p class="pa-optional-hint" style="margin-top:2px">
        ${esLetra
          ? 'La conducta es <strong>cualitativa</strong>: <strong>escríbela</strong> (S, MB, B) o toca la celda y luego el <strong>valor</strong> — el cursor recorre los parciales I→IV de cada rasgo y sigue solo. Para ordenar filas con todas sus notas: usa <strong>▲ ▼</strong>, toca el número <strong>#</strong> para enviarlo directo a una posición (ej. al #8), o usa los botones de <strong>🔤 Ordenar A–Z</strong> y <strong>♀♂ por género</strong>.'
          : esInasis
            ? 'Escribe el <strong>número de inasistencias</strong>. Enter o «Siguiente» para bajar. Usa <strong>▲ ▼</strong> o toca el <strong>#número</strong> de un alumno para mover su fila a otra posición.'
            : 'Escribe la <strong>nota (1-100)</strong>. Avanza con <strong>Enter</strong>, <strong>Tab</strong> o las flechas. Para mover un alumno con todas sus notas: usa las flechas <strong>▲ ▼</strong>, toca su número <strong>#</strong> para mandarlo directo a otra posición (ej. #8), o usa <strong>🔤 Ordenar A–Z</strong> / <strong>♀♂ Niñas y Varones A–Z</strong>.'}</p>

      ${esLetra ? `
      <div class="ad-pers-kp">
        <span class="ad-pers-kp-lbl">Valor:</span>
        ${d.boleta.escalaPers.map(v => `<button class="ad-pers-val" data-v="${adEsc(v)}">${adEsc(v)}</button>`).join('')}
        <button class="ad-pers-val ad-pers-borrar" data-v="">✕</button>
        <button class="ad-pers-edit" id="ad-pers-editescala">✏️ Editar escala</button>
        <span class="ad-pers-ctx" id="ad-pers-ctx"></span>
      </div>
      <p class="ad-pers-leyenda">${d.boleta.escalaPers.map(v => {
        const num = adPersANumero(v, d.boleta.escalaPers);
        const sig = AD_PERS_SIGNIF[v];
        return '<b>' + adEsc(v) + (num && num !== v ? ' (' + adEsc(num) + ')' : '') + '</b>' + (sig ? ' = ' + adEsc(sig) : '');
      }).join(' · ')}</p>
      <div class="ad-pers-sace-box">
        <div class="ad-pers-sace-info">
          <div class="ad-pers-sace-tit">Por favor llene las celdas de personalidad de los alumnos siguiendo la Escala:</div>
          <div class="ad-pers-sace-escala">
            <span><b>4:Sobresaliente</b> (S)</span>
            <span><b>3:Muy Bueno</b> (MB)</span>
            <span><b>2:Bueno</b> (B)</span>
          </div>
        </div>
        <div class="ad-pers-sace-ctrl">
          <span class="ad-pers-sace-lbl">Al copiar en 📋:</span>
          <div class="ad-pers-sace-btns" role="group" aria-label="Formato al copiar personalidad">
            <button type="button" class="ad-pers-modo-btn${_adPersCopyModo === 'preguntar' ? ' active' : ''}" data-pers-modo="preguntar" title="Preguntar al tocar 📋 si deseas copiar en número (4, 3, 2) o en letra (S, MB, B)">💬 Elegir al copiar</button>
            <button type="button" class="ad-pers-modo-btn${_adPersCopyModo === 'num' ? ' active' : ''}" data-pers-modo="num" title="Copiar directamente en número (4:Sobresaliente, 3:Muy Bueno, 2:Bueno) al tocar 📋">🔢 Copiar en número (4, 3, 2)</button>
            <button type="button" class="ad-pers-modo-btn${_adPersCopyModo === 'letra' ? ' active' : ''}" data-pers-modo="letra" title="Copiar directamente en letra (S, MB, B) al tocar 📋">🔤 Copiar en letra (S, MB, B)</button>
          </div>
        </div>
      </div>` : ''}

      ${esInasis ? `
      <div class="ad-inasis-bar">
        <div class="pa-row-2">
          <div class="pa-field"><label>Desde</label><input type="date" id="ad-inasis-desde" class="pa-inp-field" value="${desdeDef}"></div>
          <div class="pa-field"><label>Hasta</label><input type="date" id="ad-inasis-hasta" class="pa-inp-field" value="${hastaDef}"></div>
        </div>
        <button class="pa-generate-btn ad-btn-sec" id="ad-inasis-traer">📅 Traer faltas del pase de lista</button>
        <p class="pa-optional-hint">Cuenta las faltas (ausentes y con excusa) registradas en <strong>Asistencia</strong>
          dentro de ese rango y las pone en el <strong>Parcial ${parcial}</strong>. Puedes ajustar a mano después.</p>
      </div>` : ''}

      <div class="ad-rec-bar">
        <div class="ad-rec-bar-btns">
          <button type="button" class="pa-generate-btn ad-rec-btn-main" id="ad-sace-recuperar">📥 Copiar notas de mis respaldos</button>
          <button type="button" class="pa-generate-btn ad-btn-sec ad-rec-btn-hist" id="ad-sace-versiones">🕓 Verificar historial de versiones</button>
          ${adVersionTieneAutocompletado(d) ? '<button type="button" class="pa-generate-btn ad-btn-sec" id="ad-sace-revisar-solas">🔎 Revisar notas que la aplicación puso sola</button>' : ''}
        </div>
        <p class="pa-optional-hint" style="margin:4px 0 0">Busca en tus copias y en la nube las notas, la personalidad y las inasistencias que <strong>ya habías escrito</strong> y hoy faltan aquí. Te enseña la lista antes de copiar, solo llena celdas vacías y nunca inventa una nota.</p>
      </div>

      ${(!esLetra && !esInasis) ? (parcial === 'IV' ? (d.boleta && d.boleta.sugerirIVAuth ? `
      <div class="ad-sug-bar">
        <div class="ad-btn-row" style="margin-top:0">
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-sace-sugerir">✨ Sugerir notas del Parcial IV</button>
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-sace-bloquear-iv" title="Volver a poner candado a Sugerir notas en el Parcial IV">🔒 Bloquear sugerencia</button>
        </div>
        <p class="pa-optional-hint">🛡️ <strong>Autorizado en Parcial IV:</strong> toma las evaluaciones guardadas en el <strong>📊 Plan de acción</strong> del Parcial IV, promedia las de cada alumno por materia (NSP no cuenta como cero) y llena únicamente las celdas <strong>vacías</strong>.</p>
      </div>` : `
      <div class="ad-sug-bar ad-sug-bar-locked">
        <div class="ad-btn-row" style="margin-top:0;align-items:center">
          <span class="ad-sug-lock-pill">🔒 «Sugerir notas» en Parcial IV requiere tu autorización</span>
          <button type="button" class="pa-generate-btn ad-btn-sec" id="ad-sace-autorizar-iv">🛡️ Autorizar «Sugerir notas» en Parcial IV</button>
        </div>
        <p class="pa-optional-hint">Por seguridad de tus registros, el cálculo automático de sugerencias solo se activa en el <strong>Parcial IV</strong> después de que lo autorices expresamente.</p>
      </div>`) : `
      <div class="ad-sug-bar ad-sug-bar-locked">
        <p class="pa-optional-hint" style="margin:0">🔒 <strong>Parcial ${parcial} protegido:</strong> la opción «✨ Sugerir notas» solo funciona en el <strong>Parcial IV</strong> (previa autorización) para no alterar las notas definitivas de los Parciales I, II y III.</p>
      </div>`) : ''}

      <div class="ad-mx-wrap">
        <table class="ad-mx${esLetra ? ' ad-mx-pers' : ''}">
          <thead>${esLetra ? `
          <tr>
            <th class="ad-mx-sticky ad-mx-corner" rowspan="2">Nº · Alumno</th>
            ${cols.map(c => `<th colspan="4" class="ad-mx-ini"><div class="ad-mx-h">${adEsc(c)}</div></th>`).join('')}
          </tr>
          <tr>
            ${colDefs.map(cd => `<th class="ad-mx-sub${cd.ini ? ' ad-mx-ini' : ''}"><span>${cd.parcial}</span>
              <button class="ad-mx-copy" data-campo="${adEsc(cd.campo)}" data-parcial="${cd.parcial}"
                title="Copiar «${adEsc(cd.campo)} · Parcial ${cd.parcial}» para SACE">📋</button></th>`).join('')}
          </tr>` : `
          <tr>
            <th class="ad-mx-sticky ad-mx-corner">Nº · Alumno</th>
            ${cols.map((c, ci) => `<th><div class="ad-mx-h">${adEsc(c)}</div>
              <div class="ad-mx-hbtns">
                ${!esInasis ? `<button class="ad-mx-mv" data-col="${ci}" data-dir="-1" title="Mover a la izquierda"${ci === 0 ? ' disabled' : ''}>◀</button>` : ''}
                <button class="ad-mx-copy" data-col="${ci}" title="Copiar «${adEsc(c)}» para SACE">📋</button>
                ${!esInasis ? `<button class="ad-mx-mv" data-col="${ci}" data-dir="1" title="Mover a la derecha"${ci === cols.length - 1 ? ' disabled' : ''}>▶</button>` : ''}
              </div></th>`).join('')}
          </tr>`}
          </thead>
          <tbody>
            ${d.lista.map((a, ri) => `<tr data-rnum="${a.num}"${a.noCopiarSace ? ' class="ad-mx-tr-nocopy"' : ''}>
              <td class="ad-mx-sticky" title="${adEsc((a.nombre || ('#' + a.num)) + (a.noCopiarSace ? ' · No se copia en 📋' : ''))}">
                <div class="ad-mx-sbox">
                  <span class="ad-mx-rbtns">
                    <button type="button" class="ad-mx-rmv" data-rdir="-1" data-rnum="${a.num}" title="Subir una posición con sus notas" aria-label="Subir"${ri === 0 ? ' disabled' : ''}>▲</button>
                    <button type="button" class="ad-mx-rmv" data-rdir="1" data-rnum="${a.num}" title="Bajar una posición con sus notas" aria-label="Bajar"${ri === d.lista.length - 1 ? ' disabled' : ''}>▼</button>
                  </span>
                  <button type="button" class="ad-mx-num" data-irnum="${a.num}" title="Toca para elegir a qué posición (#) mover a ${adEsc(a.nombre || ('#' + a.num))} con todas sus notas">#${a.num}</button>
                  <span class="ad-mx-nom">${adEsc(adPrimerNombre(a.nombre)) || '—'}</span>
                  ${a.noCopiarSace ? `<button type="button" class="ad-mx-nocopy-tag" data-nc-quitar="${a.num}" title="Omitido al copiar columna (📋). Toca para volver a incluirlo">🙈</button>` : ''}
                  <button type="button" class="ad-mx-del" data-delnum="${a.num}" title="Borrar fila de ${adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))} (se puede restaurar)" aria-label="Borrar fila">✕</button>
                </div></td>
              ${colDefs.map((cd, ci) => `<td${cd.ini ? ' class="ad-mx-ini"' : ''}><input class="ad-mx-inp" data-idx="${ri * colDefs.length + ci}"
                data-num="${a.num}" data-alumno="${a.num}" data-campo="${adEsc(cd.campo)}" data-materia="${adEsc(cd.campo)}" data-parcial="${cd.parcial}" type="text" inputmode="${esLetra ? 'text' : 'numeric'}"
                maxlength="3" autocapitalize="characters" ${esLetra ? 'style="text-transform:uppercase;"' : ''}
                value="${valOfP(cd.parcial, cd.campo, a.num) !== '' ? adEsc(String(valOfP(cd.parcial, cd.campo, a.num))) : ''}" placeholder="·"></td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="ad-btn-row" style="margin-top:8px">
        ${!esLetra && !esInasis ? '<button class="pa-generate-btn ad-btn-sec ad-mx-addmat" id="ad-sace-addmat" style="margin-top:0">➕ Agregar materia</button>' : ''}
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-orden-az" type="button">🔤 Ordenar A–Z (con sus notas)</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-orden-gen" type="button">♀♂ Ordenar Niñas y luego Varones (A–Z)</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-nocopy" type="button">🙈 ${
          d.lista.some(a => a.noCopiarSace)
            ? 'No copiar en 📋 (' + d.lista.filter(a => a.noCopiarSace).map(a => adEsc(adPrimerNombre(a.nombre) || ('#' + a.num))).join(', ') + ')'
            : 'Elegir quién NO copiar en 📋'
        }</button>
      </div>
      <div class="pa-field ad-bol-quien">
        <label>Boleta de</label>
        <select id="ad-sace-bol-quien" class="pa-inp-field">
          <option value="">👥 Todo el grupo (${d.lista.length} alumno${d.lista.length === 1 ? '' : 's'})</option>
          ${d.lista.map(a => `<option value="${a.num}">🧑‍🎓 #${a.num} · ${adEsc(a.nombre) || 'Sin nombre'}</option>`).join('')}
        </select>
        <p class="pa-optional-hint">Elige un alumno cuando solo necesites <strong>su</strong> boleta: la mamá que
          viene por la de su hijo, o la nota que corregiste y hay que reimprimir. Sale la misma hoja completa, con
          los cuatro parciales.</p>
      </div>
      <div class="ad-btn-row" style="margin-top:8px">
        <button class="pa-generate-btn" id="ad-sace-boletas">🧾 Imprimir boletas (todas)</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-resumen" type="button">📋 Resumen final de resultados por grado</button>
        ${esLetra ? '<button class="pa-generate-btn ad-btn-sec" id="ad-sace-csv-num" type="button">🔢 Copiar CSV en número (4, 3, 2)</button>' : ''}
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-csv">${esLetra ? '🔤 Copiar CSV en letra (S, MB, B)' : '⬇ Copiar CSV (todas las materias)'}</button>
      </div>
      <p class="pa-optional-hint" id="ad-sace-estado" style="margin-top:8px"></p>
    </div>
    ${adUndoTarjetaHtml()}`;

  const setSel = (k, v) => {
    if (k === 'parcial' && ['I', 'II', 'III', 'IV'].includes(v)) {
      _adSaceParcial = v;
      try { localStorage.setItem('METAS_SACE_PARCIAL', v); } catch (_) {}
      if (window.metasSaveNav) window.metasSaveNav({ adSaceParcial: v });
    }
    if (k === 'vista' && ['aprov', 'pers', 'inasis'].includes(v)) {
      _adSaceVista = v;
      try { localStorage.setItem('METAS_SACE_VISTA', v); } catch (_) {}
      if (window.metasSaveNav) window.metasSaveNav({ adSaceVista: v });
    }
    body.dataset[k] = v;
    adRenderSace(body, adLoad());
  };
  document.getElementById('ad-sace-parcial')?.addEventListener('change', e => setSel('parcial', e.target.value));
  document.getElementById('ad-sace-vista').addEventListener('change', e => setSel('vista', e.target.value));
  document.getElementById('ad-sace-orden-az')?.addEventListener('click', () => {
    adOrdenarAlumnosAZ(() => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-orden-gen')?.addEventListener('click', () => {
    adOrdenarPorGeneroModal(() => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-nocopy')?.addEventListener('click', () => {
    adElegirNoCopiarModal(() => adRenderSace(body, adLoad()));
  });
  body.querySelectorAll('[data-nc-quitar]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const num = +btn.dataset.ncQuitar;
      const dd = adLoad();
      const al = dd.lista.find(a => +a.num === num);
      if (al) {
        delete al.noCopiarSace;
        adSave(dd);
        adRenderSace(body, adLoad());
        if (typeof toast === 'function') {
          toast('✅ ' + (adPrimerNombre(al.nombre) || ('#' + num)) + ' vuelve a incluirse al copiar con 📋');
        }
      }
    });
  });
  document.getElementById('ad-sace-addmat')?.addEventListener('click', async () => {
    const nueva = await metasPrompt('Nombre de la materia nueva:', {
      icono: '📚', titulo: 'Materias', okTxt: 'Agregar',
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el nombre completo.',
    });
    if (nueva === null) return;
    const dd = adLoad();
    const nom = String(nueva).trim();
    if (!dd.materias.includes(nom)) dd.materias.push(nom);
    adSave(dd);
    adRenderSace(body, adLoad());
  });

  // Encabezado del centro: logo + nombre + datos oficiales del reverso
  document.getElementById('ad-boleta-centro').addEventListener('input', e => {
    const dd = adLoad(); dd.escuela = e.target.value.trim(); adSave(dd);
  });
  const bolCampos = { 'ad-bol-director': 'director', 'ad-bol-docente': 'docente',
    'ad-bol-lugar': 'lugar', 'ad-bol-municipio': 'municipio',
    'ad-bol-depto': 'departamento', 'ad-bol-anio': 'anio' };
  Object.keys(bolCampos).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const dd = adLoad(); dd.boleta = dd.boleta || adBoletaDef();
      dd.boleta[bolCampos[id]] = el.value.trim(); adSave(dd);
    });
  });
  document.getElementById('ad-logo-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (f) adSubirLogo(f, () => { const dd = adLoad(); adRenderSace(body, dd); }, 'logo');
  });
  document.getElementById('ad-logo-quitar')?.addEventListener('click', () => {
    const dd = adLoad(); dd.logo = ''; adSave(dd); adRenderSace(body, dd);
  });
  document.getElementById('ad-logosec-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (f) adSubirLogo(f, () => { const dd = adLoad(); adRenderSace(body, dd); }, 'logoSec');
  });
  document.getElementById('ad-logosec-quitar')?.addEventListener('click', () => {
    const dd = adLoad(); dd.logoSec = ''; adSave(dd); adRenderSace(body, dd);
  });

  const estado = txt => { const e = document.getElementById('ad-sace-estado'); if (e) e.textContent = txt; };

  // ── Entrada con AUTO-AVANCE (a lo ancho, en el orden de la boleta) ──
  const inputs = [...body.querySelectorAll('.ad-mx-inp')];
  const ncols = colDefs.length;
  const focar = i => {
    if (i >= 0 && i < inputs.length) {
      inputs[i].focus(); inputs[i].select();
      try { inputs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) {}
    }
  };
  const guardar = inp => {
    const dd = adLoad();
    const campo = inp.dataset.campo;
    /* cada celda sabe su parcial (en Personalidad conviven los cuatro) */
    const pDest = inp.dataset.parcial || _adSaceParcial || parcial || 'I';
    dd.notas[pDest] = dd.notas[pDest] || {};
    dd.notas[pDest][campo] = dd.notas[pDest][campo] || {};
    let raw = inp.value.trim();
    if (esLetra) {
      raw = raw.toUpperCase().replace(/[^A-ZÑ+1-4]/g, '').slice(0, 3);
      if (AD_PERS_DE_NUM[raw]) raw = AD_PERS_DE_NUM[raw];
      inp.value = raw;
      if (raw === '') delete dd.notas[pDest][campo][inp.dataset.num];
      else dd.notas[pDest][campo][inp.dataset.num] = raw;
    } else {
      raw = raw.replace(/\D/g, '').slice(0, 3);
      inp.value = raw;
      if (raw === '') { delete dd.notas[pDest][campo][inp.dataset.num]; }
      else {
        let v = Math.round(Number(raw));
        v = esInasis ? Math.max(0, Math.min(999, v)) : Math.max(1, Math.min(100, v));
        dd.notas[pDest][campo][inp.dataset.num] = v;
      }
    }
    adSave(dd);
  };
  // Celda activa (para el teclado cualitativo de personalidad)
  let _activoIdx = 0;
  const marcarActivo = i => { inputs.forEach(x => x.classList.remove('ad-mx-activo')); if (inputs[i]) inputs[i].classList.add('ad-mx-activo'); };
  /* Letrero del teclado de personalidad: en la fila 43 la cabecera queda
     lejos, así que la celda activa se anuncia con nombre, rasgo y parcial */
  const persCtx = i => {
    if (!esLetra) return;
    const el = document.getElementById('ad-pers-ctx');
    const cd = colDefs[i % ncols], al = d.lista[Math.floor(i / ncols)];
    if (!el || !cd || !al) return;
    const nom = adPrimerNombre(al.nombre);
    el.textContent = '✍️ #' + al.num + (nom ? ' ' + nom : '') + ' · ' + cd.campo + ' · P-' + cd.parcial;
  };
  /* Valores que el auto-salto reconoce: la escala del grupo más las letras
     oficiales (por si el maestro escribe NS u otra a mano). */
  const persValores = esLetra
    ? Array.from(new Set((d.boleta.escalaPers || AD_PERS_ESCALA_DEF)
        .map(x => String(x).toUpperCase()).concat(Object.keys(AD_PERS_SIGNIF))))
    : [];
  let _letraT = null;
  inputs.forEach(inp => {
    const idx = +inp.dataset.idx;
    inp.addEventListener('focus', () => {
      _activoIdx = idx;
      marcarActivo(idx);
      persCtx(idx);
      adCaptureState();
    });
    inp.addEventListener('input', () => {
      guardar(inp);
      adCaptureState();
      const v = inp.value;
      if (esLetra) {
        clearTimeout(_letraT);
        /* «M» quiere ser «MB»: solo se salta de una vez cuando lo escrito ya
           no puede crecer a un valor más largo de la escala. Si es prefijo
           (M → MB) se le da tiempo a la segunda letra, y si lo escrito no es
           ningún valor conocido, el cursor se queda para corregirlo. */
        const esValor = persValores.indexOf(v) >= 0;
        const esPrefijo = persValores.some(x => x !== v && x.indexOf(v) === 0);
        if (v && esValor && !esPrefijo) focar(idx + 1);
        else if (v && esPrefijo) _letraT = setTimeout(() => {
          if (document.activeElement === inp && persValores.indexOf(inp.value) >= 0) focar(idx + 1);
        }, 1200);
      }
    });
    inp.addEventListener('keydown', ev => {
      if (ev.altKey && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) {
        ev.preventDefault();
        const tr = inp.closest('tr[data-rnum]');
        const tb = tr && tr.parentElement;
        if (!tr || !tb) return;
        const vec = ev.key === 'ArrowUp' ? tr.previousElementSibling : tr.nextElementSibling;
        if (!vec) return;
        if (ev.key === 'ArrowUp') tb.insertBefore(tr, vec); else vec.after(tr);
        const orden = [...tb.querySelectorAll('tr[data-rnum]')].map(r => +r.dataset.rnum);
        const numOrig = +inp.dataset.num;
        const campoOrig = inp.dataset.campo;
        const parcialOrig = inp.dataset.parcial;
        const wrap = tb.closest('.ad-mx-wrap');
        const st = wrap ? wrap.scrollTop : 0, sl = wrap ? wrap.scrollLeft : 0, wy = window.scrollY;
        const mapa = adReordenarAlumnos(orden);
        if (mapa) {
          const nuevoNum = mapa[numOrig];
          _adCapturedState = { activeInput: { num: String(nuevoNum), alumno: String(nuevoNum), campo: campoOrig, materia: campoOrig, parcial: parcialOrig } };
          adRenderSace(body, adLoad());
          const w2 = body.querySelector('.ad-mx-wrap');
          if (w2) { w2.scrollTop = st; w2.scrollLeft = sl; }
          window.scrollTo(0, wy);
        }
        return;
      }
      if (ev.key === 'Tab') {
        ev.preventDefault();
        focar(ev.shiftKey ? idx - 1 : idx + 1);
      } else if (ev.key === 'Enter' || ev.key === 'ArrowRight') {
        ev.preventDefault();
        focar(idx + 1);
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        focar(idx - 1);
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        focar(idx + ncols);
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        focar(idx - ncols);
      }
    });
  });

  // ── Teclado cualitativo de PERSONALIDAD ──
  if (esLetra) {
    marcarActivo(0);
    persCtx(0);
    /* la fila I–IV se pega justo debajo de la fila de rasgos: su altura se
       mide en vivo porque los nombres largos parten en dos líneas. OJO: se
       mide un th de RASGO (colspan), no el esquinero — ese abarca las DOS
       filas y con su altura la subcabecera caía encima de la primera fila */
    const th1 = body.querySelector('.ad-mx thead tr:first-child th[colspan]');
    if (th1) {
      const h1 = th1.offsetHeight;
      body.querySelectorAll('.ad-mx thead tr:nth-child(2) th').forEach(th => { th.style.top = h1 + 'px'; });
    }
    body.querySelectorAll('.ad-pers-val').forEach(btn => {
      btn.addEventListener('mousedown', e => e.preventDefault());   // no robar el foco/selección
      btn.addEventListener('click', () => {
        const inp = inputs[_activoIdx];
        if (!inp) return;
        inp.value = btn.dataset.v || '';
        guardar(inp);
        // destello de recompensa en la celda recién llenada
        inp.classList.remove('ad-mx-hit'); void inp.offsetWidth; inp.classList.add('ad-mx-hit');
        _activoIdx = Math.min(_activoIdx + 1, inputs.length - 1);
        focar(_activoIdx); marcarActivo(_activoIdx);
      });
    });
    document.getElementById('ad-pers-editescala')?.addEventListener('click', async () => {
      const dd = adLoad();
      const actual = (dd.boleta.escalaPers || AD_PERS_ESCALA_DEF).join(', ');
      const nueva = await metasPrompt('Valores de la escala de personalidad, separados por coma.\nEstándar Honduras: S, MB, B (Sobresaliente, Muy Bueno, Bueno).', {
        icono: '🙂', titulo: 'Escala de personalidad', value: actual, okTxt: 'Guardar',
        valida: v => String(v).trim() ? '' : 'Escribe al menos un valor.',
      });
      if (nueva === null) return;
      dd.boleta = dd.boleta || adBoletaDef();
      dd.boleta.escalaPers = String(nueva).split(',').map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 8);
      if (!dd.boleta.escalaPers.length) dd.boleta.escalaPers = AD_PERS_ESCALA_DEF.slice();
      adSave(dd); adRenderSace(body, adLoad());
    });
    body.querySelectorAll('.ad-pers-modo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.persModo;
        if (!['preguntar', 'num', 'letra'].includes(m)) return;
        _adPersCopyModo = m;
        try { localStorage.setItem('METAS_PERS_COPY_MODO', m); } catch (_) {}
        body.querySelectorAll('.ad-pers-modo-btn').forEach(b => b.classList.toggle('active', b.dataset.persModo === m));
        const desc = m === 'num'
          ? '🔢 Al tocar 📋 se copiará directo en NÚMERO (4:Sobresaliente, 3:Muy Bueno, 2:Bueno)'
          : m === 'letra'
            ? '🔤 Al tocar 📋 se copiará directo en LETRA (S, MB, B)'
            : '💬 Al tocar 📋 podrás elegir entre copiar en número (4, 3, 2) o en letra (S, MB, B)';
        estado(desc);
        if (typeof toast === 'function') toast(desc);
      });
    });
  }

  /* Imprimir boletas: del grupo entero o la de un solo alumno. El botón dice
     SIEMPRE a quién va a imprimir, porque con 43 alumnos una impresión de
     más son 43 hojas de papel que el maestro paga de su bolsillo. */
  const bolQuien = document.getElementById('ad-sace-bol-quien');
  const bolBtn = document.getElementById('ad-sace-boletas');
  const bolRotulo = () => {
    const num = bolQuien.value;
    if (!num) { bolBtn.textContent = '🧾 Imprimir boletas (todas)'; return; }
    const al = d.lista.find(x => String(x.num) === String(num));
    const nom = adPrimerNombre((al && al.nombre) || '');
    bolBtn.textContent = '🧾 Imprimir la boleta de ' + (nom || '#' + num);
  };
  bolQuien.addEventListener('change', bolRotulo);
  bolRotulo();
  bolBtn.addEventListener('click', () => {
    const num = bolQuien.value;
    adPrintBoletas(adLoad(), num ? [num] : null);
  });
  document.getElementById('ad-sace-resumen')?.addEventListener('click', () => adResumenFinalModal());

  // Traer faltas del pase de lista → Inasistencias del parcial
  document.getElementById('ad-inasis-traer')?.addEventListener('click', () => {
    const desde = document.getElementById('ad-inasis-desde').value;
    const hasta = document.getElementById('ad-inasis-hasta').value;
    if (!desde || !hasta) { estado('⚠️ Elige las fechas «Desde» y «Hasta».'); return; }
    if (desde > hasta) { estado('⚠️ «Desde» no puede ser después de «Hasta».'); return; }
    const dd = adLoad();
    dd.boleta = dd.boleta || adBoletaDef();
    dd.boleta.parcialFechas = dd.boleta.parcialFechas || {};
    dd.boleta.parcialFechas[parcial] = { desde, hasta };
    const cuenta = {};
    (dd.asistencia || []).forEach(r => {
      if (r && r.f >= desde && r.f <= hasta && r.aus) {
        Object.keys(r.aus).forEach(num => { cuenta[num] = (cuenta[num] || 0) + 1; });
      }
    });
    dd.notas[parcial] = dd.notas[parcial] || {};
    dd.notas[parcial]['Inasistencias'] = dd.notas[parcial]['Inasistencias'] || {};
    let total = 0, conFaltas = 0;
    dd.lista.forEach(a => {
      const c = cuenta[a.num] || 0;
      dd.notas[parcial]['Inasistencias'][a.num] = c;
      if (c > 0) { total += c; conFaltas++; }
    });
    adSave(dd); adRenderSace(body, adLoad());
    if (typeof toast === 'function') toast('📅 Parcial ' + parcial + ': ' + total + ' faltas (' + conFaltas + ' alumnos)');
  });

  // 📥 Copiar notas de mis respaldos + 🔎 revisar lo del autocompletado + 🕓 Historial
  document.getElementById('ad-sace-recuperar')?.addEventListener('click', e => {
    adRecuperarNotasNube(e.currentTarget, () => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-revisar-solas')?.addEventListener('click', e => {
    adRevisarNotasPuestasSolas(e.currentTarget, () => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-versiones')?.addEventListener('click', () => {
    adAbrirHistorialVersionesModal(() => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-autorizar-iv')?.addEventListener('click', () => {
    adAutorizarSugerirParcialIV(() => adRenderSace(body, adLoad()));
  });
  document.getElementById('ad-sace-bloquear-iv')?.addEventListener('click', () => {
    const dd = adLoad();
    if (dd.boleta) delete dd.boleta.sugerirIVAuth;
    adSave(dd);
    adRenderSace(body, adLoad());
    if (typeof toast === 'function') toast('🔒 «Sugerir notas» bloqueado nuevamente en el Parcial IV');
  });

  // ✨ Sugerir notas del parcial desde el Plan de acción (SOLO Parcial IV y tras autorización)
  document.getElementById('ad-sace-sugerir')?.addEventListener('click', async () => {
    const dd = adLoad();
    if (parcial !== 'IV' || !(dd.boleta && dd.boleta.sugerirIVAuth)) {
      if (typeof toast === 'function') toast('🔒 «Sugerir notas» solo funciona en el Parcial IV después de autorizarlo.');
      return;
    }
    const f = adSugFuentes(dd, parcial);
    const mats = Object.keys(f.porMat);
    const digGrado = String(dd.grado || '').replace(/\D/g, '');
    const evTxt = n => n === 1 ? '1 evaluación' : n + ' evaluaciones';
    /* Cuando no entra nada, el maestro tiene derecho a saber POR QUÉ: casi
       siempre es un dato que le falta al análisis (materia sin elegir) o un
       grado escrito distinto, y con el motivo lo arregla en un minuto. */
    if (!mats.length) {
      const colgadas = Object.keys(f.matSinCol);
      const porques = [];
      if (colgadas.length) porques.push('Hay ' + evTxt(colgadas.reduce((t, k) => t + f.matSinCol[k], 0)) +
        ' de ' + colgadas.join(', ') + ', pero la boleta no tiene esa materia: agrégala con «➕ Agregar materia».');
      if (f.sinMateria) porques.push('Hay ' + evTxt(f.sinMateria) + ' sin materia elegida en el Plan de acción: ' +
        'ábrela allá, elige su materia y vuelve — sin materia no se sabe en qué columna va.');
      if (f.otroGrupo) porques.push('Hay ' + evTxt(f.otroGrupo) + ' anotada' + (f.otroGrupo === 1 ? '' : 's') +
        ' como ' + f.otroGrupoTxt.join(' y ') + ', y este grupo es ' + (adGrupoTxt(dd) || 'otro') +
        ': si son de esta aula, corrige el grado o la sección.');
      estado(!digGrado
        ? '⚠️ Ponle el grado y la sección al grupo (pestaña Alumnos): sin ellos no se sabe qué análisis del Plan de acción son de esta aula.'
        : porques.length
          ? '🔎 Nada que sugerir todavía. ' + porques.join(' ')
          : '🔎 No hay evaluaciones del Parcial ' + parcial + ' de este grupo en el 📊 Plan de acción. Genera allá el análisis de cada prueba (con su parcial y su materia) y vuelve: de ahí salen las sugerencias.');
      return;
    }
    const cambios = adSugCambios(dd, parcial, f);
    if (!cambios.length) {
      estado('✅ Nada que llenar: las celdas con evaluaciones del Plan de acción ya tienen su nota. Borra una celda y vuelve a tocar el botón si quieres recalcularla.');
      return;
    }
    const lista = mats.map(mat => '· ' + mat + ': ' + evTxt(f.porMat[mat].evals)).join('\n');
    /* Las que entran por fecha no llevan parcial escrito: decirlo, porque el
       maestro está a punto de aceptarlas como «del Parcial II». */
    const notaFecha = f.porFecha
      ? '\n\n_(' + evTxt(f.porFecha) + ' no tiene parcial marcado y entra por su **fecha**, dentro del rango que ' +
        'pusiste en Inasistencias.)_' : '';
    /* Dos aulas que se escriben igual: los análisis viejos no dicen de cuál
       son, y el maestro merece saberlo ANTES de aceptar. */
    const notaGemelos = (f.sinSello && adSugGemelos(dd))
      ? '\n\n⚠️ Tienes **otro grupo** que también se escribe ' + (adGrupoTxt(dd) || 'igual') + '. De estas, ' +
        evTxt(f.sinSello) + ' viene de antes y no dice de cuál aula es: revisa esas notas con cuidado.' : '';
    const ok = await metasConfirm(
      'Del 📊 Plan de acción de este grupo hay **' + evTxt(f.evals) +
      '** del **Parcial ' + parcial + '**:\n' + lista + notaFecha +
      '\n\nSe llenarán **' + cambios.length + ' celdas vacías** con el promedio de las evaluaciones de cada alumno ' +
      '(todas pesan igual; NSP no cuenta como cero).\n\nLo que ya escribiste **no se toca**, y después puedes ' +
      'corregir cualquier nota: la última palabra es tuya.' + notaGemelos,
      { icono: '✨', titulo: 'Sugerir notas', okTxt: 'Sí, llenar' });
    if (!ok) return;
    /* se recarga y recalcula: si algo cambió con el diálogo abierto, las
       celdas que dejaron de estar vacías se respetan */
    const dd2 = adLoad();
    const f2 = adSugFuentes(dd2, parcial);
    const cambios2 = adSugCambios(dd2, parcial, f2);
    if (!cambios2.length) {
      estado('✅ Nada que llenar: esas celdas ya tienen su nota (quizá se llenaron desde tu otro equipo).');
      return;
    }
    /* la foto de la papelera se guarda AQUÍ, cuando ya se sabe que algo va a
       cambiar: solo caben 4 y no se gasta una en una acción que no hizo nada */
    adUndoGuardar('Sugerir notas · Parcial ' + parcial);
    dd2.notas[parcial] = dd2.notas[parcial] || {};
    cambios2.forEach(c => {
      dd2.notas[parcial][c.mat] = dd2.notas[parcial][c.mat] || {};
      dd2.notas[parcial][c.mat][c.num] = c.v;
    });
    adSave(dd2); adRenderSace(body, adLoad());
    /* transparencia: la celda sugerida queda teñida hasta el próximo redibujo.
       El desglose se cuenta al TOCARLA (los tooltips no existen en un
       teléfono): «Ada · Matemáticas: 86 — promedio de 80 y 91». */
    const porCelda = {};
    cambios2.forEach(c => { porCelda[c.mat + '|' + c.num] = c; });
    const deTxt = c => c.de.length === 1
      ? 'de una sola evaluación (' + c.de[0] + ')'
      : 'promedio de ' + c.de.slice(0, -1).join(', ') + ' y ' + c.de[c.de.length - 1];
    body.querySelectorAll('.ad-mx-inp').forEach(inp => {
      const c = porCelda[inp.dataset.campo + '|' + inp.dataset.num];
      if (!c) return;
      inp.classList.add('ad-mx-sug');
      inp.title = 'Sugerida: ' + deTxt(c);
      const al = dd2.lista.find(x => String(x.num) === String(inp.dataset.num));
      inp.addEventListener('focus', () => estado('✨ ' + (adPrimerNombre((al && al.nombre) || '') || '#' + inp.dataset.num) +
        ' · ' + c.mat + ': ' + c.v + ' — ' + deTxt(c) + '. Puedes escribir otra nota encima.'));
    });
    const sinDatos = dd2.lista.filter(al =>
      mats.some(mat => {
        const m = f2.porMat[mat] || { notas: {} };
        const v = (((dd2.notas[parcial] || {})[mat]) || {})[al.num];
        return (v == null || v === '') && !(m.notas[al.num] || []).length;
      })).length;
    const colgadas = Object.keys(f2.matSinCol);
    estado('✨ ' + cambios2.length + ' nota' + (cambios2.length === 1 ? '' : 's') + ' sugerida' +
      (cambios2.length === 1 ? '' : 's') + ' en ' + mats.join(', ') + '.' +
      (sinDatos ? ' ' + sinDatos + ' alumno' + (sinDatos === 1 ? ' quedó' : 's quedaron') +
        ' con celdas vacías por no tener evaluaciones.' : '') +
      (colgadas.length ? ' Ojo: hay evaluaciones de ' + colgadas.join(', ') +
        ' pero la boleta no tiene esa materia (➕ Agregar materia).' : '') +
      (f2.sinMateria ? ' Otras ' + f2.sinMateria + ' quedaron fuera por no tener materia elegida en el Plan de acción.' : '') +
      ' Toca una celda verde para ver de qué notas salió: la última palabra es tuya.');
    if (typeof toast === 'function') toast('✨ Parcial ' + parcial + ': ' + cambios2.length + ' notas sugeridas');
  });

  // Mover una materia de posición (◀ ▶) — reordena d.materias (afecta tabla,
  // boleta y CSV; NO afecta las notas del chatbot, que van por nombre).
  body.querySelectorAll('.ad-mx-mv').forEach(btn => btn.addEventListener('click', () => {
    const dd = adLoad();
    const i = +btn.dataset.col, j = i + (+btn.dataset.dir);
    if (j < 0 || j >= dd.materias.length) return;
    const t = dd.materias[i]; dd.materias[i] = dd.materias[j]; dd.materias[j] = t;
    adSave(dd); adRenderSace(body, adLoad());
  }));

  // Copiar UNA columna (materia/rasgo) para SACE — botón 📋 en su cabecera.
  // En Personalidad cada botón trae su rasgo Y su parcial (hay 4 a la vista).
  body.querySelectorAll('.ad-mx-copy').forEach(btn => btn.addEventListener('click', () => {
    const dd = adLoad();
    const c = btn.dataset.campo || cols[+btn.dataset.col];
    const p = btn.dataset.parcial || parcial;
    const ns = ((dd.notas[p] || {})[c]) || {};
    const incluidos = dd.lista.filter(a => !a.noCopiarSace);
    const omitidos = dd.lista.filter(a => a.noCopiarSace);
    const sinTxt = omitidos.length
      ? ' · sin ' + omitidos.map(a => adPrimerNombre(a.nombre) || ('#' + a.num)).join(', ')
      : '';
    const escala = (dd.boleta && dd.boleta.escalaPers) || AD_PERS_ESCALA_DEF;

    const ejecutarCopia = formato => {
      const enNum = esLetra && formato === 'num';
      const col = incluidos.map(a => {
        const raw = ns[a.num];
        if (raw == null || raw === '') return '';
        return enNum ? adPersANumero(raw, escala) : String(raw);
      }).join('\n');
      const fmtEtiqueta = esLetra
        ? (enNum ? ' en NÚMERO (4:Sobresaliente, 3:Muy Bueno, 2:Bueno)' : ' en LETRA (S, MB, B)')
        : '';
      const fmtCorto = esLetra ? (enNum ? ' · en número (4,3,2)' : ' · en letra') : '';
      adCopiar(col,
        () => {
          estado('✅ Columna «' + c + (btn.dataset.parcial ? ' · Parcial ' + p : '') + '» copiada' + fmtEtiqueta + ' (' +
            incluidos.length + (omitidos.length ? ' de ' + dd.lista.length : '') + ' filas' + sinTxt + '). Pégala en SACE.');
          if (typeof toast === 'function') {
            toast('📋 «' + c + (btn.dataset.parcial ? ' · P-' + p : '') + '» copiada' + fmtCorto + ' (' + incluidos.length + ' filas' + sinTxt + ')');
          }
        },
        () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
    };

    if (esLetra) {
      if (_adPersCopyModo === 'num' || _adPersCopyModo === 'letra') {
        ejecutarCopia(_adPersCopyModo);
      } else {
        adElegirFormatoCopiaPersModal(c, p, incluidos, ns, escala, (formato, recordar) => {
          if (recordar && (formato === 'num' || formato === 'letra')) {
            _adPersCopyModo = formato;
            try { localStorage.setItem('METAS_PERS_COPY_MODO', formato); } catch (_) {}
            body.querySelectorAll('.ad-pers-modo-btn').forEach(b => b.classList.toggle('active', b.dataset.persModo === formato));
          }
          ejecutarCopia(formato);
        });
      }
      return;
    }

    ejecutarCopia('raw');
  }));

  const copiarCsvSace = enNumeroPers => {
    const dd = adLoad();
    const escala = (dd.boleta && dd.boleta.escalaPers) || AD_PERS_ESCALA_DEF;
    /* En Personalidad el CSV lleva los 4 parciales de cada rasgo (como la
       tabla); en las otras vistas, las columnas del parcial elegido. */
    const defs = esLetra ? colDefs
      : (esInasis ? ['Inasistencias'] : dd.materias.slice()).map(c => ({ campo: c, parcial }));
    const cab = ['numero_lista', 'alumno']
      .concat(defs.map(x => '"' + x.campo + (esLetra ? ' P-' + x.parcial : '') + '"')).join(',');
    const incluidos = dd.lista.filter(a => !a.noCopiarSace);
    const omitidos = dd.lista.filter(a => a.noCopiarSace);
    const sinTxt = omitidos.length
      ? ' (sin ' + omitidos.map(a => adPrimerNombre(a.nombre) || ('#' + a.num)).join(', ') + ')'
      : '';
    const filas = incluidos.map(a => {
      const base = [a.num, '"' + String(a.nombre || '').replace(/"/g, '""') + '"'];
      const vals = defs.map(x => {
        const v = (((dd.notas[x.parcial] || {})[x.campo]) || {})[a.num];
        if (v == null || v === '') return '';
        return (esLetra && enNumeroPers) ? adPersANumero(v, escala) : v;
      });
      return base.concat(vals).join(',');
    });
    adCopiar(cab + '\n' + filas.join('\n'),
      () => estado((esLetra
        ? '✅ CSV de Personalidad copiado en ' + (enNumeroPers ? 'NÚMERO (4, 3, 2)' : 'LETRA (S, MB, B)') + ' (los 4 parciales)'
        : '✅ CSV del Parcial ' + parcial + ' copiado (todas las columnas)') + sinTxt + '. Pégalo en una hoja de cálculo.'),
      () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
  };
  document.getElementById('ad-sace-csv').addEventListener('click', () => copiarCsvSace(false));
  document.getElementById('ad-sace-csv-num')?.addEventListener('click', () => copiarCsvSace(true));

  adTablaFilasArrastrar(body.querySelector('.ad-mx'), () => adRenderSace(body, adLoad()));
  adUndoEnganchar(body);

  /* Restaurar foco y posición del cursor si una celda estaba activa antes del render */
  if (activeInpInfo) {
    adRestoreFocus(activeInpInfo);
  }
}

/* Redimensiona un logo a máx 260px y lo guarda como dataURL en el grupo.
   `cual` = 'logo' (centro, por defecto) | 'logoSec' (Secretaría de Educación). */
function adSubirLogo(file, listo, cual) {
  const clave = (cual === 'logoSec') ? 'logoSec' : 'logo';
  const rd = new FileReader();
  rd.onload = e => {
    const img = new Image();
    img.onload = () => {
      const max = 260;
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
      else if (h > max) { w = Math.round(w * max / h); h = max; }
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      let url;
      try { url = cv.toDataURL('image/jpeg', 0.72); } catch (_) { url = e.target.result; }
      const dd = adLoad(); dd[clave] = url; adSave(dd);
      if (typeof toast === 'function') toast(clave === 'logoSec' ? '🏛️ Logo de la Secretaría guardado' : '🏫 Logo guardado');
      if (typeof listo === 'function') listo();
    };
    img.onerror = () => { if (typeof toast === 'function') toast('No se pudo leer la imagen'); };
    img.src = e.target.result;
  };
  rd.readAsDataURL(file);
}

/* Mensaje FORMAL de motivación derivado del promedio general (sin juicios
   subjetivos del maestro: sale de las notas). */
function adMsgMotiva(nombre, prom, mejor) {
  const n = nombre || 'Estimado(a) estudiante';
  if (prom == null || isNaN(prom)) {
    return `${n}, cada parcial es una nueva oportunidad para crecer. Con dedicación constante y el acompañamiento de tu familia, alcanzarás tus metas.`;
  }
  const p = Math.round(prom);
  if (p >= 90) return `¡Felicitaciones, ${n}! Tu desempeño académico es sobresaliente y refleja esfuerzo, responsabilidad y amor por el aprendizaje. Sigue cultivando esa excelencia: eres ejemplo para tus compañeros.`;
  if (p >= 80) return `¡Muy bien, ${n}! Has demostrado un desempeño destacado${mejor ? `, en especial en ${mejor}` : ''}. Con la misma constancia y un poco más de práctica, la excelencia está a tu alcance.`;
  if (p >= 70) return `${n}, has alcanzado los aprendizajes esperados de este período. Confía en tus capacidades: con estudio diario y buenos hábitos darás el siguiente paso. ¡Vamos, tú puedes lograrlo!`;
  return `${n}, todo gran logro comienza con pequeños pasos. Con acompañamiento en casa, esfuerzo diario y una actitud positiva mejorarás parcial a parcial. ¡Confiamos en ti!`;
}

/* ── Código de colores OFICIAL de calificaciones — el MISMO del Plan
   de Acción (PA_CATS en plan-accion.js): la boleta y el plan hablan
   el mismo idioma de colores y etiquetas. ── */
const AD_NOTA_CATS = [
  { min: 95, label: 'Avanzado',        color: '#16a34a' },
  { min: 80, label: 'Muy Bueno',       color: '#0891b2' },
  { min: 70, label: 'Satisfactorio',   color: '#a16207' },
  { min: 60, label: 'Debe Mejorar',    color: '#ea580c' },
  { min: 0,  label: 'Insatisfactorio', color: '#dc2626' },
];
function adNotaCat(v) {
  const n = Number(v);
  return AD_NOTA_CATS.find(c => n >= c.min) || AD_NOTA_CATS[AD_NOTA_CATS.length - 1];
}

/* MATERIAS BÁSICAS: donde más pruebas se hacen — el elogio del consejo
   se ancla en ellas; las demás solo se mencionan si un DATO lo amerita
   (sobresalen de verdad). Comparación sin acentos ni mayúsculas. */
const AD_MATS_BASICAS = ['matematicas', 'espanol', 'ciencias naturales', 'ciencias sociales'];
function adEsBasica(mat) {
  const n = String(mat || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  return AD_MATS_BASICAS.indexOf(n) !== -1;
}

/* Consejo concreto por rasgo de personalidad bajo (observación del docente) */
const AD_RASGO_TIP = {
  'Puntualidad': 'ayude a que llegue a tiempo cada día',
  'Espíritu de trabajo': 'anímele a terminar sus tareas y trabajos en clase',
  'Orden y presentación': 'revisen juntos los cuadernos y la presentación de los trabajos',
  'Sociabilidad': 'refuerce la convivencia y el trabajo en equipo',
  'Moralidad': 'conversen en casa sobre el respeto a las normas del aula',
};

function adNombresMats(arr, max) {
  const ns = (arr || []).map(x => x.mat);
  const m = max || 2;
  if (ns.length <= m) return ns.join(' y ');
  return ns.slice(0, m).join(', ') + ' y ' + (ns.length - m) + ' más';
}

/* Consejo para la FAMILIA basado en los DATOS del aula, no en plantilla:
   celebra lo mejor (con empates honestos), diagnostica CAUSAS visibles
   (inasistencias, rasgos de personalidad bajos, tendencia entre
   parciales) y da la acción con la etiqueta oficial de la nota. */
function adConsejoFamilia(nombre, ctx) {
  const n = nombre || 'su hijo(a)';
  const c = ctx || {};
  const mejores = c.mejores || [], peores = c.peores || [];
  const partes = [];

  // 1) Celebrar lo real — anclado en las MATERIAS BÁSICAS (Matemáticas,
  //    Español, CC.NN. y CC.SS.), donde más pruebas alimenta el aula.
  //    Una materia no básica solo se menciona si el dato lo amerita.
  const elogBas = c.mejoresBas || [];
  const extra = c.extraDestacada
    ? `; también sobresale en ${c.extraDestacada.mat} (${c.extraDestacada.val})` : '';
  if (mejores.length && !peores.length) {
    partes.push(`El rendimiento de ${n} es parejo (${c.maxV}) en todas las materias: celebre esa constancia, que es la base de todo progreso.`);
  } else if (elogBas.length > 1) {
    partes.push(`Celebre que ${n} logra su mejor nota de las materias básicas (${c.maxB}) en ${adNombresMats(elogBas)}${extra}: el elogio sincero motiva.`);
  } else if (elogBas.length) {
    partes.push(`Celebre el logro de ${n} en ${elogBas[0].mat} (${c.maxB}), su mejor materia básica${extra}: el elogio sincero motiva.`);
  } else if (mejores.length > 1) {
    partes.push(`Celebre que ${n} logra su mejor nota (${c.maxV}) en ${adNombresMats(mejores)}: el elogio sincero motiva.`);
  } else if (mejores.length) {
    partes.push(`Celebre el logro de ${n} en ${mejores[0].mat} (${c.maxV}): el elogio sincero motiva.`);
  }
  if (c.tendencia && c.tendencia.tipo === 'sube') {
    partes.push(`Además viene mejorando: pasó de ${c.tendencia.ini.prom} a ${c.tendencia.fin.prom} del parcial ${c.tendencia.ini.p} al ${c.tendencia.fin.p} — ese rumbo es el correcto.`);
  }
  if (c.mejoraMax) {
    partes.push(`Su mayor avance fue en ${c.mejoraMax.mat}: de ${c.mejoraMax.de} (parcial ${c.mejoraMax.pDe}) a ${c.mejoraMax.a} (parcial ${c.mejoraMax.pA}) — reconózcalo, eso consolida el hábito.`);
  }

  // 2) Diagnóstico: qué DICEN los datos sobre el porqué (máx. 3 causas
  //    para que el consejo quepa y se entienda — primero lo más accionable)
  const causas = [];
  if ((c.inasis || 0) >= 3) {
    causas.push(`las ${c.inasis} inasistencias pesan en el resultado (cada día recuperado se nota)`);
  }
  if (c.rasgosBajos && c.rasgosBajos.length) {
    const tip = AD_RASGO_TIP[c.rasgosBajos[0]] || 'refuércenlo juntos en casa';
    causas.push(`el docente observa margen en ${c.rasgosBajos.slice(0, 2).join(' y ')} — ${tip}`);
  }
  if (c.caidaMax) {
    causas.push(`la mayor caída fue en ${c.caidaMax.mat} (de ${c.caidaMax.de} en el parcial ${c.caidaMax.pDe} a ${c.caidaMax.a} en el ${c.caidaMax.pA}): pregunte al docente qué cambió en esa asignatura`);
  }
  if (c.tendencia && c.tendencia.tipo === 'baja') {
    causas.push(`el promedio de sus materias bajó de ${c.tendencia.ini.prom} (parcial ${c.tendencia.ini.p}) a ${c.tendencia.fin.prom} (parcial ${c.tendencia.fin.p}) — conviene retomar la rutina que funcionaba`);
  }
  const hayBajo = (c.basicasBajas && c.basicasBajas.length) || (peores.length && Number(c.minV) < 70);
  if (causas.length) {
    partes.push(`Los datos del aula señalan por dónde empezar: ${causas.slice(0, 3).join('; ')}.`);
  } else if (hayBajo && (c.inasis || 0) === 0) {
    partes.push(`Sin faltas ni observaciones de conducta, el reto es de práctica: más ejercicios guiados harán la diferencia.`);
  }

  // 3) Acción sobre lo bajo — las MATERIAS BÁSICAS van primero: sostienen
  //    todo lo demás y son donde el refuerzo en casa rinde más. Y si las
  //    cuatro están aprobadas, también se dice: esa tranquilidad informa
  //    tanto como una alerta.
  const bajas = c.basicasBajas || [];
  if (bajas.length) {
    const bTxt = bajas.slice(0, 3).map(x => `${x.mat} (${x.val} · «${adNotaCat(x.val).label}»)`).join(', ');
    partes.push(bajas[0].val < 60
      ? `El refuerzo empieza por lo básico: ${bTxt}. Coordine con el docente un plan de recuperación esta misma semana.`
      : `El refuerzo empieza por lo básico: ${bTxt}. Acompáñele con 15–20 minutos de repaso diario y consulte al docente cómo apoyar desde casa.`);
    if (peores.length && !adEsBasica(peores[0].mat) && Number(c.minV) < 70) {
      partes.push(`También conviene un empujón en ${adNombresMats(peores)} (${c.minV}).`);
    }
  } else if (peores.length && Number(c.minV) < 70) {
    const et = adNotaCat(c.minV).label;
    if (Number(c.minV) < 60) {
      partes.push(`En ${adNombresMats(peores)} (${c.minV} · «${et}») se necesita refuerzo urgente: coordine con el docente un plan de recuperación esta misma semana.`);
    } else {
      partes.push(`En ${adNombresMats(peores)} (${c.minV} · «${et}») acompáñele con 15–20 minutos de repaso diario y consulte al docente cómo apoyar desde casa.`);
    }
  } else if (c.basicasTot) {
    partes.push(`Las ${c.basicasTot === 4 ? 'cuatro ' : ''}materias básicas están aprobadas${c.basicasMin
      ? ` (la más baja hoy: ${c.basicasMin.mat} con ${c.basicasMin.val})` : ''}: manténgalas con un repaso breve y constante.`);
  }

  if (!partes.length) partes.push('Mantenga una rutina de estudio en casa y comunicación cercana con el centro educativo.');
  if (partes.join(' ').length < 320) partes.push('Una lectura compartida cada día y el descanso adecuado potencian todo el aprendizaje.');
  return partes.join(' ');
}

/* ── NORMATIVA DEL GRÁFICO DE LA BOLETA: cómo se leen los parciales I–IV ──
   Nació de una boleta real: el III parcial traía solo Matemáticas (85) y el
   gráfico, que exigía un «último parcial» común a todas las materias, se
   caía al promedio del año y pintaba 77 — el 85 no aparecía por ningún lado.
   Las reglas, para que con I, II, III y IV el análisis sea siempre el mismo:
   1. La nota VIGENTE de una materia es la de SU último parcial con nota.
      El promedio del año vive en la fila PROM. de la tabla; el gráfico y
      los chips hablan del HOY, porque el promedio disimula las caídas y
      llega tarde a las mejoras.
   2. Solo se compara lo comparable. La marca | y el ▲/▼ de cada materia son
      contra su propio parcial anterior; la tendencia general del consejo
      compara dos parciales solo por las materias que AMBOS tienen (nunca
      el promedio de 8 materias contra el de 1).
   3. Si las materias vienen de parciales distintos (boleta a medio llenar),
      cada barra dice de cuál parcial es su nota (P-I…P-IV).
   Con los cuatro parciales llenos queda: barra = IV, marca | = III, y la
   tendencia compara III → IV con todas las materias.
   (SVG porque los fill SÍ imprimen; los fondos CSS no siempre.) */
function adBoletaGraficoEstado(filas, mixto) {
  if (!filas.length) return '';
  const rowH = 18, gap = 4, padT = 6, padB = 12;
  const labelW = 104, barX = labelW + 4, W = 320;
  const barMax = W - barX - 42;
  const H = padT + filas.length * (rowH + gap) - gap + padB;
  const x70 = barX + barMax * 0.7;
  const gridBot = padT + filas.length * (rowH + gap) - gap;
  const hayPrev = filas.some(it => it.prev != null);
  const bars = filas.map((it, i) => {
    const y = padT + i * (rowH + gap);
    const w = Math.max(2, barMax * (Math.min(100, Math.max(0, it.val)) / 100));
    // Color OFICIAL de la calificación (el mismo del Plan de Acción)
    const color = adNotaCat(it.val).color;
    const lbl = it.mat.length > 17 ? it.mat.slice(0, 16) + '…' : it.mat;
    let marca = '', linea2 = '';
    if (it.prev != null) {
      const xp = barX + barMax * (Math.min(100, Math.max(0, it.prev)) / 100);
      const dd = it.val - it.prev;
      const dTxt = (dd > 0 ? '▲+' + dd : (dd < 0 ? '▼' + dd : '· igual')) + (mixto ? ' · P-' + it.p : '');
      const dCol = dd > 0 ? '#16a34a' : (dd < 0 ? '#dc2626' : '#7286a8');
      marca = `<rect x="${(xp - 0.7).toFixed(1)}" y="${y + 1}" width="1.4" height="${rowH - 2}" fill="#0f2350" opacity="0.6"/>`;
      linea2 = `<text x="${(barX + barMax + 3).toFixed(1)}" y="${(y + rowH * 0.98).toFixed(1)}" font-size="6.3" font-weight="bold" fill="${dCol}">${dTxt}</text>`;
    } else if (mixto) {
      // materia con una sola nota entre varios parciales: decir de cuál es
      linea2 = `<text x="${(barX + barMax + 3).toFixed(1)}" y="${(y + rowH * 0.98).toFixed(1)}" font-size="6.3" font-weight="bold" fill="#7286a8">P-${it.p}</text>`;
    }
    return `<text x="${labelW}" y="${(y + rowH * 0.72).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#334155">${adEsc(lbl)}</text>
      <rect x="${barX}" y="${y + 2}" width="${barMax}" height="${rowH - 4}" rx="2.5" fill="#eef2f7"/>
      <rect x="${barX}" y="${y + 2}" width="${w.toFixed(1)}" height="${rowH - 4}" rx="2.5" fill="${color}"/>
      ${marca}
      <text x="${(barX + barMax + 3).toFixed(1)}" y="${(y + rowH * 0.52).toFixed(1)}" font-size="8.5" font-weight="bold" fill="${color}">${it.val}</text>
      ${linea2}`;
  }).join('');
  const leyenda = `<div class="bl-leyenda">${AD_NOTA_CATS.map(c =>
    `<span><i style="background:${c.color}"></i>${c.min > 0 ? c.min + '+' : '&lt;60'} ${c.label}</span>`).join('')}${hayPrev ? '<span><i style="background:#0f2350"></i>| parcial anterior</span>' : ''}</div>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:340px;font-family:Arial,Helvetica,sans-serif">
    <line x1="${x70.toFixed(1)}" y1="${padT - 1}" x2="${x70.toFixed(1)}" y2="${gridBot}" stroke="#c0392b" stroke-width="0.8" stroke-dasharray="3 2"/>
    <text x="${x70.toFixed(1)}" y="${(H - 2).toFixed(1)}" text-anchor="middle" font-size="7" fill="#c0392b">70 · aprobación</text>
    ${bars}
  </svg>${leyenda}`;
}

/* Imprime una BOLETA elegante por alumno: encabezado con dos logos (centro y
   Secretaría), tabla compacta de personalidad + aprovechamiento, gráfico de
   rendimiento, mensaje formal de motivación y consejo para la familia.

   `nums` (opcional) son los números de lista que se quieren imprimir. Sin él
   sale el grupo entero. Con UN alumno se resuelve lo de todos los días: la
   madre que llega por la boleta de su hijo y la nota que se corrigió y hay
   que reimprimir — antes tocaba mandar las 43 hojas para rescatar una. */
function adPrintBoletas(d, nums) {
  if (!d.lista || !d.lista.length) { if (typeof toast === 'function') toast('No hay alumnos'); return; }
  const quiere = Array.isArray(nums) ? nums.map(String) : null;
  const hojas = quiere && quiere.length ? d.lista.filter(a => quiere.includes(String(a.num))) : d.lista;
  if (!hojas.length) { if (typeof toast === 'function') toast('Ese alumno ya no está en la lista'); return; }
  const centro = (d.escuela || '').trim() || 'Centro Educativo';
  const grado = adGrupoTxt(d) || '';
  const pers = AD_PERSONALIDAD.slice();
  const mats = d.materias.slice();
  const parciales = ['I', 'II', 'III', 'IV'];
  const bol = d.boleta || {};
  const val = (p, c, num) => {
    const v = (((d.notas[p] || {})[c]) || {})[num];
    return (v == null || v === '') ? '' : v;
  };
  const promMat = (c, num) => {
    const xs = parciales.map(p => val(p, c, num)).filter(x => x !== '' && !isNaN(Number(x))).map(Number);
    return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : '';
  };
  const sumInasis = num => {
    const xs = parciales.map(p => val(p, 'Inasistencias', num)).filter(x => x !== '' && !isNaN(Number(x))).map(Number);
    return xs.length ? xs.reduce((a, b) => a + b, 0) : '';
  };
  /* Valoración FINAL de un rasgo de personalidad (normativa SACE, en
     AD_PERS_NUM): promedio de los parciales con valoración, redondeado y
     de vuelta a su letra. Con letras fuera de la tabla oficial queda «—»
     y la valoración final la decide el docente. */
  const promPers = (c, num) => {
    const xs = parciales.map(p => String(val(p, c, num)).toUpperCase().trim()).filter(Boolean);
    if (!xs.length || xs.some(x => !AD_PERS_NUM[x])) return '—';
    const n = Math.round(xs.reduce((t, x) => t + AD_PERS_NUM[x], 0) / xs.length);
    return AD_PERS_DE_NUM[Math.max(1, Math.min(4, n))];
  };
  const thV = t => `<th class="v"><span>${adEsc(t)}</span></th>`;
  const primer = nom => String(nom || '').trim().split(/\s+/)[0] || '';

  // Logo oficial de la Secretaría: SIEMPRE aparece. Si el maestro sube el
  // suyo (d.logoSec) se usa ese; si no, el que viene con la plataforma.
  // URL absoluta porque la boleta se imprime en una ventana about:blank.
  let logoSecSrc = d.logoSec || '';
  if (!logoSecSrc) {
    try { logoSecSrc = new URL('img/logo-secretaria.png', location.href).href; }
    catch (_) { logoSecSrc = 'img/logo-secretaria.png'; }
  }

  // Cita de valores (perseverancia, disciplina, esfuerzo): cada alumno
  // recibe una según su número de lista — estable entre impresiones.
  const CITAS = [
    { t: 'La disciplina es el puente entre las metas y los logros.', a: 'Jim Rohn' },
    { t: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', a: 'Robert Collier' },
    { t: 'Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos.', a: 'Confucio' },
    { t: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.', a: 'Nelson Mandela' },
    { t: 'El genio se hace con un 1% de talento y un 99% de trabajo.', a: 'Albert Einstein' },
    { t: 'No cuentes los días, haz que los días cuenten.', a: 'Muhammad Ali' },
    { t: 'La constancia es la virtud por la cual todas las demás dan su fruto.', a: 'Arturo Graf' },
    { t: 'Siembra un hábito y cosecharás un carácter; siembra un carácter y cosecharás un destino.', a: 'Proverbio' },
    { t: 'El respeto por nosotros mismos guía nuestra moral; el respeto por los demás guía nuestros modales.', a: 'Laurence Sterne' },
    { t: 'Cae siete veces, levántate ocho.', a: 'Proverbio japonés' },
    { t: 'La paciencia, la persistencia y el sudor hacen una combinación invencible para el éxito.', a: 'Napoleon Hill' },
    { t: 'Los sueños no funcionan a menos que tú trabajes por ellos.', a: 'John C. Maxwell' },
    { t: 'La honestidad es el primer capítulo del libro de la sabiduría.', a: 'Thomas Jefferson' },
    { t: 'Nunca es demasiado tarde para ser lo que podrías haber sido.', a: 'George Eliot' },
  ];

  const hoja = a => {
    // Promedio del año por materia: el dato OFICIAL acumulado. Vive en la
    // fila PROM. y en su chip; el gráfico y los demás chips hablan del HOY
    // (normativa del gráfico, en adBoletaGraficoEstado).
    const datos = mats.map(c => ({ mat: c, val: promMat(c, a.num) }))
      .filter(x => x.val !== '' && !isNaN(Number(x.val)))
      .map(x => ({ mat: x.mat, val: Number(x.val) }));
    const promGen = datos.length ? Math.round(datos.reduce((s, x) => s + x.val, 0) / datos.length) : null;
    const inasis = sumInasis(a.num);

    // ── ESTADO VIGENTE por materia (regla 1): la última nota de CADA
    //    materia con su parcial, y la de su parcial anterior si existe.
    //    Por materia, no global: un III parcial con solo Matemáticas no
    //    puede esconder el 85 ni arrastrar al resto.
    const valNum = (p, cc) => { const v = val(p, cc, a.num); return (v === '' || isNaN(Number(v))) ? null : Number(v); };
    const estado = mats.map(cc => {
      const s = parciales.map(p => ({ p, v: valNum(p, cc) })).filter(x => x.v != null);
      if (!s.length) return null;
      const u = s[s.length - 1], ant = s.length >= 2 ? s[s.length - 2] : null;
      return { mat: cc, val: u.v, p: u.p, prev: ant ? ant.v : null, pPrev: ant ? ant.p : null };
    }).filter(Boolean);

    // EMPATES con honestidad sobre el HOY: «la más alta» son TODAS las que
    // comparten la nota máxima; «a reforzar», las de la mínima. Si todas
    // están iguales, no se corona ninguna.
    const maxV = estado.length ? Math.max.apply(null, estado.map(x => x.val)) : null;
    const minV = estado.length ? Math.min.apply(null, estado.map(x => x.val)) : null;
    const todasIguales = estado.length > 0 && maxV === minV;
    const mejores = estado.filter(x => x.val === maxV);
    const peores = todasIguales ? [] : estado.filter(x => x.val === minV);

    // ── SEÑALES para el consejo (patrones reales del aula) ──
    // Tendencia general (regla 2): el par de parciales MÁS RECIENTE que
    // comparta 2+ materias, comparado SOLO por esas materias. Antes se
    // comparaba el promedio de cada parcial con lo que tuviera, y un III
    // con una sola materia daba «mejorías» fantasma (69 → 85 comparando
    // 8 materias contra 1). Elegir otro par sería escoger el dato que
    // conviene; ±5 para no leer ruido.
    const parcConDatos = parciales.filter(p => mats.some(cc => valNum(p, cc) != null));
    let tendencia = null;
    for (let j = parcConDatos.length - 1; j > 0 && !tendencia; j--) {
      for (let i = j - 1; i >= 0 && !tendencia; i--) {
        const comunes = mats.filter(cc => valNum(parcConDatos[i], cc) != null && valNum(parcConDatos[j], cc) != null);
        if (comunes.length < 2) continue;
        const prom = p => Math.round(comunes.reduce((s, cc) => s + valNum(p, cc), 0) / comunes.length);
        const ini = { p: parcConDatos[i], prom: prom(parcConDatos[i]) };
        const fin = { p: parcConDatos[j], prom: prom(parcConDatos[j]) };
        tendencia = fin.prom <= ini.prom - 5 ? { tipo: 'baja', ini, fin }
          : fin.prom >= ini.prom + 5 ? { tipo: 'sube', ini, fin }
          : { tipo: 'plana' };
      }
    }
    if (tendencia && tendencia.tipo === 'plana') tendencia = null;
    // Personalidad: rasgos marcados con lo MÁS BAJO de la escala del centro
    // (último valor de escalaPers). Solo si NO todos están abajo — si todos,
    // es el criterio general del docente, no un patrón del alumno.
    const escalaP = ((bol.escalaPers && bol.escalaPers.length) ? bol.escalaPers : AD_PERS_ESCALA_DEF)
      .map(s => String(s).toUpperCase());
    const bajoP = escalaP[escalaP.length - 1];
    const rasgoUlt = cc => {
      for (let i = parciales.length - 1; i >= 0; i--) {
        const v = val(parciales[i], cc, a.num);
        if (v !== '') return String(v).toUpperCase();
      }
      return '';
    };
    const persVals = pers.map(cc => ({ c: cc, v: rasgoUlt(cc) })).filter(x => x.v);
    const rasgosBajosTodos = persVals.filter(x => x.v === bajoP).map(x => x.c);
    const rasgosBajos = (persVals.length && rasgosBajosTodos.length === persVals.length) ? [] : rasgosBajosTodos;
    // MATERIAS BÁSICAS (Matemáticas/Español/CC.NN./CC.SS.), sobre el HOY:
    // el elogio se ancla en la mejor de ellas, y el refuerzo del consejo
    // empieza SIEMPRE por las básicas que estén debajo de 70 — son las que
    // sostienen todo lo demás. Una no básica solo se suma al elogio si el
    // dato lo amerita: llega a 90+ o supera a la mejor básica por 8+.
    const basicas = estado.filter(x => adEsBasica(x.mat));
    const maxB = basicas.length ? Math.max.apply(null, basicas.map(x => x.val)) : null;
    const mejoresBas = basicas.filter(x => x.val === maxB);
    const basicasBajas = basicas.filter(x => x.val < 70).sort((x, y) => x.val - y.val);
    const basicasMin = basicas.length ? basicas.reduce((m, x) => (x.val < m.val ? x : m)) : null;
    const extraDestacada = estado
      .filter(x => !adEsBasica(x.mat) && (x.val >= 90 || (maxB != null && x.val >= maxB + 8)))
      .sort((x, y) => y.val - x.val)[0] || null;

    // Mayor avance y mayor caída POR MATERIA (regla 2): su última nota
    // contra la de su propio parcial anterior, umbral ±5. En empate manda
    // el parcial más reciente: es la noticia de hoy, no la de hace meses.
    let mejoraMax = null, caidaMax = null;
    const masNuevo = (x, actual) => parciales.indexOf(x.p) > parciales.indexOf(actual.pA);
    estado.forEach(x => {
      if (x.prev == null) return;
      const dd = x.val - x.prev;
      const fila = { mat: x.mat, de: x.prev, a: x.val, d: dd, pDe: x.pPrev, pA: x.p };
      if (dd >= 5 && (!mejoraMax || dd > mejoraMax.d || (dd === mejoraMax.d && masNuevo(x, mejoraMax)))) mejoraMax = fila;
      if (dd <= -5 && (!caidaMax || dd < caidaMax.d || (dd === caidaMax.d && masNuevo(x, caidaMax)))) caidaMax = fila;
    });

    // Título del gráfico según lo que haya (regla 3): un solo parcial dice
    // cuál es; parciales mezclados lo advierten; parejo dice de dónde a dónde.
    const parcsVig = estado.map(x => x.p).filter((v, i, arr) => arr.indexOf(v) === i);
    const gMixto = parcsVig.length > 1;
    const prevsU = estado.filter(x => x.prev != null).map(x => x.pPrev).filter((v, i, arr) => arr.indexOf(v) === i);
    const gTitulo = !estado.length ? 'Rendimiento por materia'
      : parcConDatos.length === 1 ? `Notas del Parcial ${parcConDatos[0]}`
      : gMixto ? 'Estado por materia <small>(cada una, su último parcial con nota)</small>'
      : `Evolución por materia <small>(${prevsU.length === 1 ? 'parcial ' + prevsU[0] + ' → ' + parcsVig[0] : 'al parcial ' + parcsVig[0]})</small>`;

    const filas = parciales.map(p => `
      <tr>
        <td class="pa">${p}</td>
        ${pers.map(c => `<td>${adEsc(String(val(p, c, a.num)))}</td>`).join('')}
        ${mats.map(c => `<td>${adEsc(String(val(p, c, a.num)))}</td>`).join('')}
        <td>${adEsc(String(val(p, 'Inasistencias', a.num)))}</td>
      </tr>`).join('');
    const promRow = `
      <tr class="prom">
        <td class="pa">PROM.</td>
        ${pers.map(c => `<td>${promPers(c, a.num)}</td>`).join('')}
        ${mats.map(c => `<td>${promMat(c, a.num)}</td>`).join('')}
        <td>${inasis}</td>
      </tr>`;

    // Chips: el promedio es del AÑO (la fila PROM.); lo demás habla del HOY
    // (estado vigente por materia) y lo dice en su etiqueta. «A reforzar»
    // solo cuando de verdad está bajo 70: con todo aprobado no hay alarma.
    const chip = (lbl, valTxt, cls) => `<div class="chip ${cls || ''}"><span>${lbl}</span><b>${valTxt}</b></div>`;
    const chipAlta = todasIguales
      ? chip('Rendimiento hoy', 'Parejo · ' + maxV + ' en todo', 'good')
      : (mejores.length > 1
        ? chip('Materias más altas (hoy)', adEsc(adNombresMats(mejores, mejores.length === 2 ? 2 : 1)) + ' · ' + maxV, 'good')
        : (mejores.length ? chip('Materia más alta (hoy)', adEsc(mejores[0].mat) + ' · ' + maxV, 'good') : ''));
    const chipBaja = !peores.length ? ''
      : Number(minV) < 70
        ? chip('A reforzar (hoy)', adEsc(adNombresMats(peores, peores.length === 2 ? 2 : 1)) + ' · ' + minV, 'low')
        : chip('Más baja (hoy)', adEsc(adNombresMats(peores, peores.length === 2 ? 2 : 1)) + ' · ' + minV);
    const resumen = `
      <div class="chips">
        ${chip('Promedio del año', promGen != null ? promGen : '—')}
        ${chipAlta}
        ${chipBaja}
        ${mejoraMax ? chip('Mayor avance', adEsc(mejoraMax.mat) + ' ▲ +' + mejoraMax.d, 'good') : ''}
        ${caidaMax ? chip('Mayor caída', adEsc(caidaMax.mat) + ' ▼ ' + caidaMax.d, 'low') : ''}
        ${chip('Inasistencias', inasis !== '' ? inasis : '0')}
      </div>`;

    /* ── RESULTADO FINAL DEL AÑO — solo con los CUATRO parciales llenos ──
       Normativa de Honduras (Primero y Segundo Ciclo): se aprueba el año
       con nota final de 70 o más en CADA materia. El promedio general NO
       salva una materia baja: con 75 de promedio y una materia en 65 se
       reprueba igual. El veredicto usa el MISMO promedio redondeado de la
       fila PROM., para que el papel nunca se contradiga a sí mismo.
       Materias sin ninguna nota en el año no cuentan (no se impartieron);
       si alguna materia con notas aún no tiene sus cuatro parciales, el
       año no está cerrado y no se dicta veredicto.
       El veredicto SUSTITUYE a la motivación y al consejo en su columna:
       con el año dictado, «¡vamos, tú puedes!» ya no tiene sentido junto a
       un «no aprobado» — y así la boleta se queda en UNA página carta. */
    const matsConDatos = mats.filter(cc => parciales.some(p => valNum(p, cc) != null));
    const anioCompleto = matsConDatos.length > 0 &&
      matsConDatos.every(cc => parciales.every(p => valNum(p, cc) != null));
    let finalHtml = '';
    if (anioCompleto) {
      const finales = matsConDatos.map(cc => ({ mat: cc, val: Number(promMat(cc, a.num)) }));
      const bajas = finales.filter(x => x.val < 70).sort((x, y) => x.val - y.val);
      const nom = primer(a.nombre) || 'su hijo(a)';
      if (!bajas.length) {
        finalHtml = `<div class="bl-final ok">
          <div class="bl-final-t">📜 Resultado final del año lectivo: APROBADO</div>
          <p>Estimada familia: al cierre de los cuatro parciales, ${adEsc(nom)} alcanzó un promedio general
          de ${promGen}. Nos complace comunicarle formalmente que ha <b>aprobado el año lectivo</b>.
          Felicítenle en casa: este logro es fruto de su esfuerzo sostenido y del acompañamiento de
          ustedes. Será un honor seguir acompañando su formación el próximo año escolar.</p></div>`;
      } else {
        const det = bajas.map(x => x.mat + ' (' + x.val + ')').join(', ');
        finalHtml = `<div class="bl-final rep">
          <div class="bl-final-t">📜 Resultado final del año lectivo</div>
          <p>Estimada familia: al cierre de los cuatro parciales, ${adEsc(nom)} alcanzó un promedio general
          de ${promGen}, reflejo de un esfuerzo que valoramos y reconocemos sinceramente. La normativa
          educativa establece que, en el Primero y Segundo Ciclo, el año se aprueba con una nota final de
          70 o más en <b>cada materia</b>; en ${adEsc(det)} la nota final quedó por debajo de ese mínimo y,
          por ello, el año lectivo <b>no queda aprobado</b>. Este resultado no define a ${adEsc(nom)}: es una
          etapa que, con el proceso de recuperación, su acompañamiento en casa y el apoyo del centro
          educativo, se puede superar. Le invitamos con todo respeto a conversar con el docente para acordar
          juntos los pasos a seguir. Cuente con nosotros.</p></div>`;
      }
    }

    const cita = CITAS[(Number(a.num) || String(a.nombre || '').length || 0) % CITAS.length];

    return `<section class="hoja">
      <header class="bl-head">
        <div class="bl-col">
          <div class="bl-logo">${d.logo ? `<img src="${d.logo}" alt="">` : ''}</div>
          <div class="bl-centro">${adEsc(centro.toUpperCase())}</div>
          <div class="bl-doc">BOLETA DE CALIFICACIONES</div>
          <div class="bl-lugar">${adEsc(bol.municipio)}${bol.municipio && bol.departamento ? ' ' : ''}${adEsc(bol.departamento)}</div>
          ${bol.lugar ? `<div class="bl-lugar">${adEsc(bol.lugar)}</div>` : ''}
          <div class="bl-anio">Año lectivo ${adEsc(bol.anio) || new Date().getFullYear()}</div>
        </div>
        <div class="bl-col der">
          <div class="bl-logo-sec"><img src="${logoSecSrc}" alt="Secretaría de Educación"></div>
          <div class="bl-oficial-t">
            <b>Secretaría de Educación</b>
            <span>Subsecretaría de Asuntos Técnicos Pedagógicos</span>
            <span>Dirección General de Evaluación de la Calidad de la Educación</span>
            <span>Dirección Departamental de Educación de ${adEsc(bol.departamento) || '—'}</span>
          </div>
        </div>
      </header>

      <div class="bl-alumno">
        <div><span>Alumno(a)</span><b>${adEsc(a.nombre) || '—'}</b></div>
        <div><span>N°</span><b>${a.num}</b></div>
        <div><span>Grado</span><b>${adEsc(d.grado) || adEsc(grado) || '—'}</b></div>
        <div><span>Sección</span><b>${adEsc(d.seccion) || '—'}</b></div>
      </div>

      <div class="bl-cuerpo">
        <aside class="bl-firmapadre">
          <div class="fp-t">Firma del padre de familia</div>
          ${parciales.map(p => `<div class="fp-slot"><i></i><span>${p}-Parcial</span></div>`).join('')}
        </aside>
        <table class="bl-notas">
          <thead>
            <tr>
              <th rowspan="2" class="pa">Parcial</th>
              <th colspan="${pers.length}" class="grp">Personalidad</th>
              <th colspan="${mats.length}" class="grp">Aprovechamiento académico</th>
              <th rowspan="2" class="v"><span>Inasistencias</span></th>
            </tr>
            <tr>${pers.map(thV).join('')}${mats.map(thV).join('')}</tr>
          </thead>
          <tbody>${filas}${promRow}</tbody>
        </table>
      </div>

      <div class="bl-grid2">
        <div class="bl-card">
          <div class="bl-h">${gTitulo}</div>
          ${adBoletaGraficoEstado(estado, gMixto) || '<p class="bl-nada">Aún no hay notas que graficar.</p>'}
          ${resumen}
        </div>
        <div class="bl-msgs">
          ${anioCompleto ? finalHtml : `
          <div class="bl-card motiva">
            <div class="bl-h">✦ Mensaje de motivación</div>
            <p>${adEsc(adMsgMotiva(primer(a.nombre), promGen,
              mejoresBas.length === 1 ? mejoresBas[0].mat : (mejores.length === 1 ? mejores[0].mat : '')))}</p>
          </div>
          <div class="bl-card consejo">
            <div class="bl-h">✿ Consejo para la familia</div>
            <p>${adEsc(adConsejoFamilia(primer(a.nombre), {
              mejores, peores, maxV, minV,
              mejoresBas, maxB, extraDestacada,
              basicasBajas, basicasMin, basicasTot: basicas.length,
              inasis: Number(inasis) || 0,
              tendencia, rasgosBajos,
              mejoraMax, caidaMax,
            }))}</p>
          </div>`}
        </div>
      </div>

      <div class="bl-cita">
        <p>&ldquo;${adEsc(cita.t)}&rdquo;</p>
        <span>— ${adEsc(cita.a)}</span>
      </div>

      <footer class="bl-foot">
        <div class="bl-firmas">
          <div><i></i><b>${adEsc(bol.docente) || '&nbsp;'}</b><span>Profesor(a) de Grado</span></div>
          <div><i></i><b>${adEsc(bol.director) || '&nbsp;'}</b><span>Director(a)</span></div>
        </div>
      </footer>
    </section>`;
  };

  /* El título es el nombre con que el teléfono guarda el PDF: con un solo
     alumno dice de quién es, para no acabar con diez «Boletas 6º-1.pdf». */
  const titulo = hojas.length === 1
    ? 'Boleta — ' + (String(hojas[0].nombre || '').trim() || 'N° ' + hojas[0].num) + (grado ? ' · ' + grado : '')
    : 'Boletas — ' + grado;
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc(titulo)}</title>
<style>
  @page { size: letter portrait; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root { --tinta:#0f2350; --azul:#1e3a7c; --oro:#a8791a; --linea:#d4dbe6; --suave:#f4f7fc; }
  body { color: var(--tinta); font-family: Arial, Helvetica, sans-serif; }
  /* La hoja ocupa TODA la página carta: el pie de firmas se ancla abajo
     (margin-top:auto) y no queda un vacío grande al final. */
  .hoja { page-break-after: always; min-height: 256mm; display: flex; flex-direction: column; }
  .hoja:last-child { page-break-after: auto; }

  .bl-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding-bottom: 8px; border-bottom: 2.5px solid var(--azul); }
  .bl-col { flex: 1; text-align: center; }
  .bl-col.der { flex: 1.15; }
  .bl-head .bl-logo { height: 58px; display: flex; align-items: center; justify-content: center; margin-bottom: 3px; }
  .bl-head .bl-logo img { max-width: 120px; max-height: 58px; object-fit: contain; }
  .bl-logo-sec { height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
  .bl-logo-sec img { max-width: 230px; max-height: 44px; object-fit: contain; }
  .bl-centro { font-family: Georgia, 'Times New Roman', serif; font-size: 13.5px; font-weight: 700; color: var(--tinta); letter-spacing: .3px; line-height: 1.15; }
  .bl-doc { font-family: Georgia, serif; font-size: 11px; font-weight: 700; color: var(--oro); margin-top: 2px; letter-spacing: .6px; }
  .bl-lugar { font-size: 9.5px; color: #55637d; margin-top: 1px; }
  .bl-anio { font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--azul); margin-top: 3px; }
  .bl-oficial-t { line-height: 1.35; }
  .bl-oficial-t b { display: block; font-family: Georgia, serif; font-size: 11px; color: var(--tinta); }
  .bl-oficial-t span { display: block; font-size: 9px; color: #33415c; }

  .bl-cuerpo { display: flex; gap: 8px; align-items: stretch; }
  .bl-firmapadre { flex: 0 0 132px; border: 1px solid var(--linea); border-radius: 8px; padding: 6px 6px; background: var(--suave); display: flex; flex-direction: column; }
  .fp-t { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: var(--azul); text-align: center; line-height: 1.25; margin-bottom: 2px; }
  .fp-slot { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 2px; }
  .fp-slot i { display: block; border-top: 1px solid #55637d; margin: 0 1px 2px; }
  .fp-slot span { font-size: 7.5px; color: #55637d; text-align: center; }
  .bl-cuerpo .bl-notas { flex: 1; }

  /* Veredicto del año (solo con los 4 parciales): verde sereno si aprueba;
     ámbar —nunca rojo— si no, que la noticia ya pesa suficiente. Vive en la
     columna de mensajes EN LUGAR de motivación y consejo: la boleta cabe
     en una sola página carta. */
  .bl-final { border-radius: 9px; padding: 12px 16px; break-inside: avoid; border: 1.5px solid; }
  .bl-msgs .bl-final { flex: 1; }
  .bl-final-t { font-family: Georgia, serif; font-size: 14px; font-weight: 700; letter-spacing: .4px; margin-bottom: 7px; }
  .bl-final p { font-size: 12.5px; line-height: 1.6; text-align: justify; color: #223; }
  .bl-final.ok { background: linear-gradient(180deg, #f0f8f0, #fff); border-color: #9fcc9f; }
  .bl-final.ok .bl-final-t { color: #2e7d32; }
  .bl-final.rep { background: linear-gradient(180deg, #fdf6ec, #fff); border-color: #dcbf8e; }
  .bl-final.rep .bl-final-t { color: #8a5a00; }

  .bl-cita { margin-top: 11px; text-align: center; padding: 8px 26px; border-top: 1px solid var(--linea); border-bottom: 1px solid var(--linea); break-inside: avoid; }
  .bl-cita p { font-family: Georgia, 'Times New Roman', serif; font-size: 12.5px; font-style: italic; color: var(--tinta); line-height: 1.45; }
  .bl-cita span { display: inline-block; margin-top: 3px; font-size: 9.5px; letter-spacing: 1px; color: var(--oro); font-weight: 700; }

  .bl-alumno { display: flex; gap: 8px; margin: 9px 0; }
  .bl-alumno > div { flex: 1; background: var(--suave); border: 1px solid var(--linea); border-radius: 6px; padding: 4px 8px; }
  .bl-alumno > div:first-child { flex: 3; }
  .bl-alumno span { display: block; font-size: 7.5px; letter-spacing: .5px; text-transform: uppercase; color: #7286a8; }
  .bl-alumno b { font-size: 11.5px; color: var(--tinta); }

  .bl-notas { border-collapse: collapse; margin: 0 auto; table-layout: auto; }
  .bl-notas th, .bl-notas td { border: 1px solid #c7cfdd; text-align: center; font-size: 10px; padding: 2px 2px; }
  .bl-notas thead .grp { background: var(--azul); color: #fff; font-size: 8.5px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; padding: 3px 4px; }
  .bl-notas th.v { background: #eaf0fa; height: 74px; vertical-align: bottom; padding: 0 0 4px; }
  .bl-notas th.v span { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; font-size: 8.5px; font-weight: 700; color: var(--tinta); display: inline-block; }
  .bl-notas td.pa, .bl-notas th.pa { font-weight: 700; background: #eaf0fa; color: var(--tinta); font-size: 9px; white-space: nowrap; }
  .bl-notas tbody td { font-weight: 600; }
  .bl-notas tr.prom td { font-weight: 800; background: #fdf6e3; color: #8a5a00; }
  .bl-notas tr.prom td.pa { background: #f7edc9; }

  .bl-grid2 { display: flex; gap: 10px; margin-top: 11px; align-items: stretch; }
  .bl-grid2 > .bl-card { flex: 1; }
  .bl-msgs { flex: 1.02; display: flex; flex-direction: column; gap: 10px; }
  .bl-card { border: 1px solid var(--linea); border-radius: 9px; padding: 9px 11px; break-inside: avoid; }
  .bl-h { font-family: Georgia, serif; font-size: 11px; font-weight: 700; color: var(--azul); margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid var(--linea); }
  .bl-h small { font-weight: 400; font-style: italic; color: #7286a8; font-size: 9px; }
  .bl-card p { font-size: 10.5px; line-height: 1.5; color: #223; text-align: justify; }
  .bl-card.motiva { background: linear-gradient(180deg, #f2f8f2, #fff); border-color: #cfe6cf; }
  .bl-card.motiva .bl-h { color: #2e7d32; border-color: #cfe6cf; }
  .bl-card.consejo { background: linear-gradient(180deg, #fdf7ee, #fff); border-color: #ecdcbf; }
  .bl-card.consejo .bl-h { color: var(--oro); border-color: #ecdcbf; }
  .bl-nada { font-size: 10px; color: #7286a8; font-style: italic; }
  .bl-leyenda { display: flex; flex-wrap: wrap; gap: 2px 9px; justify-content: center; margin-top: 4px; font-size: 6.8px; color: #55637d; }
  .bl-leyenda i { display: inline-block; width: 7px; height: 7px; border-radius: 2px; margin-right: 3px; vertical-align: -1px; }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .chip { flex: 1 1 44%; border: 1px solid var(--linea); border-radius: 7px; padding: 4px 8px; background: var(--suave); }
  .chip span { display: block; font-size: 7.5px; text-transform: uppercase; letter-spacing: .4px; color: #7286a8; }
  .chip b { font-size: 11px; color: var(--tinta); }
  .chip.good { background: #eef7ee; border-color: #cfe6cf; } .chip.good b { color: #2e7d32; }
  .chip.low { background: #fdf3e5; border-color: #ecdcbf; } .chip.low b { color: #c8730a; }

  .bl-foot { margin-top: auto; padding-top: 14px; padding-bottom: 4mm; }
  .bl-oficial { text-align: center; line-height: 1.35; }
  .bl-oficial b { font-size: 9.5px; letter-spacing: .3px; color: var(--tinta); display: block; }
  .bl-oficial span { display: block; font-size: 9px; color: #55637d; }
  .bl-firmas { display: flex; justify-content: space-around; gap: 12px; margin-top: 30px; }
  .bl-firmas > div { flex: 1; text-align: center; }
  .bl-firmas i { display: block; border-top: 1px solid #55637d; margin: 0 8px 3px; }
  .bl-firmas b { font-size: 10px; color: var(--tinta); font-weight: 700; }
  .bl-firmas span { display: block; font-size: 8.5px; color: #55637d; }
</style></head><body>
${hojas.map(a => hoja(a)).join('')}
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}

function adCopiar(txt, ok, mal) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(ok, () => adCopiarFallback(txt, ok, mal));
  } else {
    adCopiarFallback(txt, ok, mal);
  }
}
function adCopiarFallback(txt, ok, mal) {
  try {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const fue = document.execCommand('copy');
    ta.remove();
    fue ? ok() : mal();
  } catch (_) { mal(); }
}

function adPrintSace(d, parcial, materia) {
  const ns = ((d.notas[parcial] || {})[materia]) || {};
  const grupo = adGrupoTxt(d);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Notas ${adEsc(materia)} — Parcial ${parcial}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:12mm;}
h1{font-size:16px;color:#1e3a7c;margin-bottom:2mm;}
.sub{font-size:11px;color:#444;margin-bottom:5mm;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #999;padding:3px 6px;text-align:left;}
th{background:#e8eef9;}
td.n{text-align:center;font-weight:bold;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>🧮 ${adEsc(materia)} — Notas finales · Parcial ${parcial}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}Planilla de apoyo para SACE · Generada con M.E.T.A.S el ${adFechaBonita(adHoy())}</div>
<table>
<thead><tr><th>#</th><th>Alumno/a</th><th>Nota final</th></tr></thead>
<tbody>
${d.lista.map(a => `<tr><td>${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
  <td class="n">${ns[a.num] != null ? ns[a.num] : ''}</td></tr>`).join('')}
</tbody></table>
</body></html>`;
  adPrintAbrir(html);
}

/* ══════════════ 🎓 CERRAR EL AÑO ESCOLAR ══════════════
   El peligro del año nuevo: la clave del niño #15 del año pasado
   mostraría los datos del niño #15 nuevo. Cerrar el año lo evita:
   1) borra DE VERDAD la nube de las claves viejas (metas_cerrar_familias),
   2) limpia registros/avisos locales del grupo (la ficha FAQ se queda),
   3) REGENERA las claves de familia (las tiras viejas mueren),
   4) archiva los análisis del Plan de Acción de este grado/sección
      (si siguieran, se re-publicarían con las claves nuevas y una
      familia nueva vería mensajes del niño anterior),
   5) sube el año de la boleta. */
function adClavesDelGrupo(d) {
  const out = [];
  (d.lista || []).forEach(a => {
    const c = adClaveFamilia(d.id, a.num, false);
    if (c) out.push(c);
  });
  return out;
}

/* Acciones destructivas: no basta la sesión abierta — se pide la
   CONTRASEÑA de la cuenta de maestro (un alumno con el teléfono en la
   mano no la sabe). Se compara con la guardada; si este equipo no la
   tiene, se verifica contra el login de la nube (que ya trae freno
   anti fuerza bruta: 5 fallos → 10 minutos). */
async function adPedirContrasena(titulo) {
  let doc = {};
  try { doc = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')) || {}; } catch (_) {}
  if (!doc.codigo) {
    await metasAlert('Entra primero con tu cuenta de maestro en la Zona Docente.', { icono: '🔒', titulo });
    return false;
  }
  const pw = await metasPrompt('Confirma que eres tú: escribe la **contraseña de tu cuenta de maestro**' +
    (doc.correo ? '\n(' + doc.correo + ')' : '') + ':', {
    icono: '🔒', titulo, type: 'password', okTxt: 'Verificar',
    valida: v => String(v).trim() ? '' : 'Escribe tu contraseña.',
  });
  if (pw === null) return false;
  const intento = String(pw).trim();
  let ok = false;
  if (doc.clave) {
    ok = intento === String(doc.clave).trim();
  } else if (doc.correo && navigator.onLine !== false) {
    try {
      const { url, key } = _avSbConexion();
      const r = await fetch(url + '/rest/v1/rpc/metas_entrar_docente_v2', {
        method: 'POST',
        headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_correo: doc.correo, p_clave: intento }),
      });
      const j = r.ok ? await r.json() : null;
      ok = !!(j && j.ok);
    } catch (_) {}
  }
  if (!ok) {
    await metasAlert('❌ Contraseña incorrecta. Por seguridad, no se hace nada.', { icono: '🔒', titulo });
    return false;
  }
  return intento;   // contraseña verificada (para reautenticar en el servidor)
}
async function adCerrarAnio() {
  const d = adLoad();
  const anio = adAnioDe(d);
  const nombre = adGrupoTxt(d) || 'este grupo';
  if (navigator.onLine === false) {
    await metasAlert('Para cerrar el año se necesita internet (hay que limpiar la nube del chatbot). Inténtalo con conexión.', { icono: '🎓', titulo: 'Cerrar el año' });
    return;
  }
  if (!await metasConfirm('Vas a cerrar el año **' + anio + '** de **' + nombre + '**:\n\n' +
    '• Se borran de este teléfono la asistencia, notas, colectas, controles y avisos del grupo\n' +
    '• La nube del chatbot se limpia (los padres dejan de ver datos del año viejo)\n' +
    '• Las **claves de familia se regeneran**: las tiras entregadas DEJAN de valer\n' +
    '• Los análisis del Plan de Acción de este grado se archivan\n' +
    '• La ficha del aula (horario, uniforme…) se conserva\n\n' +
    'Hazlo solo cuando el año esté ENTREGADO (boletas impresas). ¿Continuar?',
    { icono: '🎓', titulo: 'Cerrar el año', okTxt: 'Sí, continuar' })) return;
  /* identidad real, no solo la sesión abierta */
  const claveMaestro = await adPedirContrasena('Cerrar el año');
  if (!claveMaestro) return;
  let profCod = '';
  try { profCod = (JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')) || {}).codigo || ''; } catch (_) {}
  const conf = await metasPrompt('Esta acción no se puede deshacer. Para confirmar, escribe **CERRAR**:', {
    icono: '🎓', titulo: 'Cerrar el año', okTxt: 'Confirmar',
    valida: v => String(v).trim().toUpperCase() === 'CERRAR' ? '' : 'Escribe CERRAR (o cancela).',
  });
  if (conf === null) return;
  const conservarLista = await metasConfirm('¿Conservar la **lista de alumnos**?\n\nElige «Sí» si el año nuevo sigues con los MISMOS niños (solo cambian de grado contigo). Si te llega un grupo nuevo, elige cancelar y la lista se vacía.',
    { icono: '👥', titulo: 'Cerrar el año', okTxt: 'Sí, conservar' });

  const clavesViejas = adClavesDelGrupo(d);
  adUndoGuardar('Cerrar el año ' + anio + ' de «' + nombre + '»');

  /* 1) limpiar la nube de verdad (registros, avisos, plan, buzón, vistos) */
  let nubeOk = false;
  try {
    let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
    let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
    try {
      url = localStorage.getItem('METAS_SB_URL') || url;
      key = localStorage.getItem('METAS_SB_KEY') || key;
    } catch (_) {}
    const r = await fetch(url + '/rest/v1/rpc/metas_cerrar_familias', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_prof: profCod, p_clave: claveMaestro, p_codigos: clavesViejas }),
    });
    nubeOk = r.ok && (await r.json()) >= 0;   // -1 = el servidor rechazó la cuenta docente
  } catch (_) {}
  if (!nubeOk) {
    if (!await metasConfirm('⚠️ No pude limpiar la nube en este momento (¿corriste ya SUPABASE-FASE3.sql?).\n\n¿Cerrar el año de todos modos? (Las claves se regeneran igual, así que nadie nuevo verá datos viejos, pero quedarán filas muertas en la nube.)',
      { icono: '🎓', titulo: 'Cerrar el año', okTxt: 'Cerrar igual' })) return;
  }

  const dd = adLoad();
  /* 2) limpiar lo local del grupo (la ficha del aula se conserva) */
  dd.asistencia = []; dd.notas = {}; dd.colectas = []; dd.controles = [];
  dd.boleta = dd.boleta || adBoletaDef();
  dd.boleta.parcialFechas = {};
  const gg = avGrupo(dd.id); gg.avisos = []; avGrupoSave(dd.id, gg);
  /* 3) regenerar claves de familia */
  try {
    const codes = paCodesLoad();
    const key = 'G:' + dd.id;
    if (conservarLista) {
      const cg = codes[key] || {};
      Object.keys(cg).forEach(n => { cg[n] = n + adSufijoClave(); });
      codes[key] = cg;
    } else {
      delete codes[key];
      dd.lista = [];
    }
    paCodesSave(codes);
  } catch (_) {}
  /* 4) archivar análisis del Plan de Acción de este grado/sección */
  try {
    const pa = JSON.parse(localStorage.getItem('METAS_PLANACCION_V1'));
    if (pa && Array.isArray(pa.analisis)) {
      const gNum = String(dd.grado || '').replace(/\D/g, '');
      const mS = String(dd.seccion || '').trim().match(/([a-zA-Z0-9])\s*$/);
      const gSec = mS ? mS[1].toUpperCase() : '';
      pa.analisis = pa.analisis.filter(a => {
        const aNum = String(a.grado || '').replace(/\D/g, '');
        const mA = String(a.seccion || '').trim().match(/([a-zA-Z0-9])\s*$/);
        return !(aNum === gNum && (mA ? mA[1].toUpperCase() : '') === gSec);
      });
      localStorage.setItem('METAS_PLANACCION_V1', JSON.stringify(pa));
    }
  } catch (_) {}
  /* 5) año nuevo en la boleta + olvidar las firmas de sync de ESTE grupo
        (nada que anular: la nube ya quedó limpia; los otros grupos del
        maestro no se tocan) */
  dd.boleta.anio = String((+anio || new Date().getFullYear()) + 1);
  const viejas = new Set(clavesViejas);
  const ma = adSbMapLoad();
  Object.keys(ma).forEach(id => { if (viejas.has(ma[id].c)) delete ma[id]; });
  adSbMapSave(ma);
  const mv = avSbMapLoad();
  Object.keys(mv).forEach(id => { if (viejas.has(mv[id].c)) delete mv[id]; });
  avSbMapSave(mv);
  adSave(dd);
  renderAdmin();
  await metasAlert('🎓 Año **' + anio + '** cerrado' + (nubeOk ? ' y nube limpia' : ' (nube pendiente)') + '.\n\n' +
    'Boleta lista para el **' + dd.boleta.anio + '**. ' +
    (conservarLista ? 'Imprime las **tiras nuevas** de claves para entregarlas a las familias.' :
      'Cuando tengas la lista nueva de alumnos, cada niño nacerá con su clave — imprime las tiras y entrégalas.'),
    { icono: '🎓', titulo: 'Cerrar el año' });
}

/* ══════════════ 📣 COMUNICADOS — la ventana del maestro ══════════════
   Lo que se publica aquí llega al chatbot de padres: avisos, eventos
   con fecha (reunión, acto cívico), materiales y la FICHA DEL AULA
   (respuestas fijas: horario, uniforme, útiles, matrícula, NSP…).
   Gobernanza: todo aviso VENCE (14 días por defecto) y hay tope de
   10 activos — un canal saturado deja de leerse. Sube a la nube con
   el mismo motor diferencial de Mi aula (SUPABASE-AVISOS.sql). */
const AVISOS_KEY = 'METAS_AVISOS_V1';
const AV_MAX_ACTIVOS = 10;
const AV_TIPOS = { aviso: '📣 Aviso', evento: '🗓 Evento con fecha',
                   material: '🎒 Materiales', individual: '👤 Solo algunas familias' };
/* Ficha del aula: preguntas que TODA familia hace tarde o temprano.
   El maestro las responde UNA vez y el bot las contesta mil veces. */
const AV_FAQ_BASE = [
  { id: 'horario',  pregunta: '¿A qué hora entra y a qué hora sale?', claves: 'horario entrada salida hora clases' },
  { id: 'uniforme', pregunta: '¿Cómo es el uniforme?', claves: 'uniforme camisa falda zapatos vestir' },
  { id: 'utiles',   pregunta: '¿Cuáles son los útiles del año?', claves: 'utiles lista cuadernos materiales año' },
  { id: 'matricula', pregunta: '¿Cómo se hace la matrícula o un traslado?', claves: 'matricula matricular traslado inscribir requisitos papeles' },
  { id: 'atencion', pregunta: '¿Cuándo atiende el maestro a los padres?', claves: 'atencion cita hablar consulta visitar' },
  { id: 'nsp',      pregunta: '¿Cómo se repone una evaluación NSP?', claves: 'nsp reponer reposicion no se presento recuperar' },
];

function avLoad() {
  try {
    const o = JSON.parse(localStorage.getItem(AVISOS_KEY));
    if (o && o.v === 1 && o.grupos && typeof o.grupos === 'object') return o;
  } catch (_) {}
  return { v: 1, grupos: {} };
}
function avSaveAll(o) {
  try { localStorage.setItem(AVISOS_KEY, JSON.stringify(o)); } catch (_) {}
  adSyncProgramar();   /* hereda el auto-publish de 4 s de Mi aula */
}
function avGrupo(gid) {
  const g = avLoad().grupos[gid];
  return { avisos: (g && Array.isArray(g.avisos)) ? g.avisos : [],
           faqs: (g && Array.isArray(g.faqs)) ? g.faqs : [],
           conducta: (g && Array.isArray(g.conducta)) ? g.conducta : [] };
}
/* Reportes de conducta por alumno: solo los ve SU familia (van con la
   clave de ese niño). También sirven para felicitar. */
const AV_CONDUCTA_TIPOS = {
  llamado: '⚠️ Llamado de atención',
  leve: '📋 Falta leve',
  felicitacion: '⭐ Felicitación',
};
/* Cierre del recibo de aporte: el cuerpo es formal (folio, monto, fecha, quién
   recibió) y esta última línea agradece y sostiene la colaboración. Se elige
   por número de lista, NO al azar: el texto tiene que ser siempre el mismo para
   esa familia, o la firma cambiaría y el recibo se resubiría sin parar. */
const AV_RECIBO_CIERRE = [
  'Gracias por cumplir con lo acordado en reunión: cada aporte se convierte en algo que su hijo/a usa en el aula.',
  'Gracias por su colaboración: cuando las familias responden a tiempo, el grupo alcanza lo que se propuso sin quedarse a medias.',
  'Gracias por apoyar el acuerdo del grupo: su aporte ya está trabajando por los niños de esta sección.',
  'Gracias por confiar: cada lempira queda anotado, rendido y a la vista de todas las familias.',
];
function avGrupoSave(gid, g) {
  const o = avLoad(); o.grupos[gid] = g; avSaveAll(o);
}
function avFechaMas(iso, dias) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();
  d.setDate(d.getDate() + (dias || 0));
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
         String(d.getDate()).padStart(2, '0');
}
function avVigente(a) { return String(a.hasta || '') >= adHoy(); }
/* FAQs del grupo = base (siempre visibles) + las propias del maestro */
function avFaqsDe(gid) {
  const propias = avGrupo(gid).faqs;
  const porId = {};
  propias.forEach(f => { porId[f.id] = f; });
  const base = AV_FAQ_BASE.map(b => porId[b.id] ||
    { id: b.id, pregunta: b.pregunta, claves: b.claves, respuesta: '', activa: false });
  return base.concat(propias.filter(f => !AV_FAQ_BASE.some(b => b.id === f.id)));
}

let _avEditId = null;   /* aviso en edición en el formulario */

function adRenderCom(body, d) {
  /* 📣 La Convocatoria va ANTES del candado de la lista: el enlace se
     manda al grupo de WhatsApp de TODA la escuela y no necesita la lista
     del aula para nada. Un maestro que todavía no ha metido a sus
     alumnos igual tiene que contratar los buses del sábado. */
  if (typeof adConvNivel === 'function' && adConvNivel() &&
      typeof adRenderConvocatoria === 'function') { adRenderConvocatoria(body, d); return; }
  if (!d.lista.length) {
    adSinLista(body, 'los comunicados');
    body.insertAdjacentHTML('beforeend', adConvPuertaHtml(d));
    adConvPuertaEnganchar(body);
    return;
  }
  const g = avGrupo(d.id);
  const vigentes = g.avisos.filter(avVigente);
  const faqs = avFaqsDe(d.id);
  const conFechas = Object.keys((d.boleta || {}).parcialFechas || {}).length;
  const edit = _avEditId ? g.avisos.find(a => a.id === _avEditId) : null;

  const filaAviso = a => {
    const vive = avVigente(a);
    return `
    <div class="ad-gasto-row" style="align-items:flex-start${vive ? '' : ';opacity:.55'}">
      <span style="flex:1">${a.prioridad === 'urgente' ? '🔴 ' : ''}${AV_TIPOS[a.tipo] ? AV_TIPOS[a.tipo].split(' ')[0] : '📣'}
        <strong>${adEsc(a.titulo)}</strong><br>
        <small>${adEsc(a.texto)}</small><br>
        <small style="color:#666">${a.fechaEvento ? '📅 ' + adFechaBonita(a.fechaEvento) + ' · ' : ''}${vive ? 'se muestra hasta el ' + adFechaBonita(a.hasta) : 'VENCIDO (ya no se muestra)'}${a.tipo === 'individual' && a.alumnos ? ' · solo #' + a.alumnos.join(', #') : ''}
      <span data-vistos="AVI-${a.id}" style="color:#1e8e3e"></span></small></span>
      <span style="white-space:nowrap">
        <button class="ad-al-del av-edit" data-avid="${a.id}" aria-label="Editar" style="color:#1e3a7c">✏️</button>
        <button class="ad-al-del av-del" data-avid="${a.id}" aria-label="Borrar">✕</button></span>
    </div>`;
  };
  const filaFaq = f => `
    <div class="ad-gasto-row" style="align-items:flex-start">
      <span style="flex:1">${f.respuesta ? (f.activa !== false ? '✅' : '⏸') : '⚪'} <strong>${adEsc(f.pregunta)}</strong><br>
        <small>${f.respuesta ? adEsc(f.respuesta) : 'Sin respuesta todavía — tócala para responderla'}</small></span>
      <button class="ad-al-del av-faq-edit" data-fid="${f.id}" aria-label="Responder" style="color:#1e3a7c">✏️</button>
    </div>`;

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📣 Avisos para las familias</div>
      <p class="pa-optional-hint">Lo que publiques aquí lo responde el <strong>asistente de padres</strong>
        («¿cuándo es la reunión?», «¿qué lleva mañana?»). Cada aviso <strong>vence solo</strong> para
        que el canal no se sature (máximo ${AV_MAX_ACTIVOS} activos).</p>
      <p class="pa-optional-hint" style="margin-top:-2px">Un aviso <strong>informa</strong> y se acabó.
        Si lo que necesitas es que te <strong>contesten</strong> —quién va a la excursión, cuántos llegan
        a la reunión—, eso es una convocatoria: la puerta naranja de abajo.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="noclases">🚫 No hay clases</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="reunion">👨‍👩‍👧 Reunión de padres</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="material">🎒 Traer materiales</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="aporte">💰 Recordar aporte</button>
        <button class="pa-generate-btn ad-btn-sec" id="av-nuevo">➕ Aviso nuevo</button>
      </div>
      <div id="av-form" style="display:${edit ? 'block' : 'none'};margin-top:10px;border-top:1px dashed #ccc;padding-top:10px">
        <div class="pa-field"><label>Título del aviso</label>
          <input id="av-titulo" class="pa-inp-field" maxlength="120" value="${edit ? adEsc(edit.titulo) : ''}" placeholder="ej.: Reunión de padres"></div>
        <div class="pa-field"><label>Detalle (lo que leerá la familia)</label>
          <textarea id="av-texto" class="pa-paste-area" rows="3" maxlength="1200" placeholder="ej.: Este viernes 18 a las 3:00 pm en el aula. Traer lápiz.">${edit ? adEsc(edit.texto) : ''}</textarea></div>
        <div class="pa-row-2">
          <div class="pa-field"><label>Tipo</label>
            <select id="av-tipo" class="pa-inp-field">
              ${Object.keys(AV_TIPOS).map(t => `<option value="${t}" ${edit && edit.tipo === t ? 'selected' : ''}>${AV_TIPOS[t]}</option>`).join('')}
            </select></div>
          <div class="pa-field"><label>Fecha del evento (si aplica)</label>
            <input id="av-fecha" type="date" class="pa-inp-field" value="${edit && edit.fechaEvento ? adEsc(edit.fechaEvento) : ''}"></div>
        </div>
        <div class="pa-row-2">
          <div class="pa-field"><label>Se muestra hasta</label>
            <input id="av-hasta" type="date" class="pa-inp-field" value="${edit ? adEsc(edit.hasta) : avFechaMas(adHoy(), 14)}"></div>
          <div class="pa-field"><label>&nbsp;</label>
            <label style="display:flex;align-items:center;gap:6px;font-weight:600">
              <input id="av-urgente" type="checkbox" ${edit && edit.prioridad === 'urgente' ? 'checked' : ''}> 🔴 Urgente (va de primero)</label></div>
        </div>
        <div class="pa-field" id="av-alumnos-box" style="display:${edit && edit.tipo === 'individual' ? 'block' : 'none'}">
          <label>Números de lista (separados por coma)</label>
          <input id="av-alumnos" class="pa-inp-field" inputmode="numeric" value="${edit && edit.alumnos ? edit.alumnos.join(', ') : ''}" placeholder="ej.: 3, 15, 22"></div>
        <div class="ad-btn-row">
          <button class="pa-add-btn" id="av-publicar">${edit ? '💾 Guardar cambios' : '📣 Publicar aviso'}</button>
          <button class="pa-generate-btn ad-btn-sec" id="av-cancelar">Cancelar</button>
        </div>
      </div>
      <div style="margin-top:10px">
        ${g.avisos.length ? g.avisos.slice().sort((a, b) => (avVigente(b) - avVigente(a)) || (String(a.hasta) < String(b.hasta) ? -1 : 1)).map(filaAviso).join('')
          : '<p class="pa-optional-hint">Sin avisos todavía. Usa una plantilla de arriba: dos toques y queda publicado.</p>'}
      </div>
      ${adConvPuertaHtml(d)}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🙂 Reportes de conducta</div>
      <p class="pa-optional-hint">Llamados de atención, faltas leves o <strong>felicitaciones</strong> de un
        alumno: solo los ve <strong>su familia</strong> cuando pregunta por la conducta en el asistente.
        Cada reporte deja de mostrarse a los 45 días.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec av-cond-add" data-ctipo="llamado">⚠️ Llamado de atención</button>
        <button class="pa-generate-btn ad-btn-sec av-cond-add" data-ctipo="leve">📋 Falta leve</button>
        <button class="pa-generate-btn ad-btn-sec av-cond-add" data-ctipo="felicitacion">⭐ Felicitación</button>
      </div>
      <div style="margin-top:10px">
        ${g.conducta.length ? g.conducta.slice().reverse().map(c => {
          const al = d.lista.find(a => a.num === c.num) || {};
          const vive = avVigente(c);
          return `<div class="ad-gasto-row" style="align-items:flex-start${vive ? '' : ';opacity:.55'}">
            <span style="flex:1">${(AV_CONDUCTA_TIPOS[c.tipo] || '📋').split(' ')[0]}
              <strong>#${c.num}${al.nombre ? ' ' + adEsc(adPrimerNombre(al.nombre)) : ''}</strong>
              · <small>${adFechaBonita(c.fecha)}</small><br>
              <small>${adEsc(c.texto)}</small><br>
              <small style="color:#666">${vive ? 'la familia lo ve hasta el ' + adFechaBonita(c.hasta) : 'VENCIDO (ya no se muestra)'}</small></span>
            <button class="ad-al-del av-cond-del" data-cid="${c.id}" aria-label="Borrar">✕</button>
          </div>`;
        }).join('') : '<p class="pa-optional-hint">Sin reportes. Toca un botón de arriba: alumno + descripción y listo.</p>'}
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📨 Buzón de las familias</div>
      <p class="pa-optional-hint">Excusas y recados que los padres dejan en el asistente
        (máximo 5 al día por familia). Para responder a una familia, usa un
        <strong>aviso individual</strong> con su número de lista.</p>
      <div id="av-buzon"><p class="pa-optional-hint">⏳ Revisando el buzón…</p></div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="av-buzon-ver">🔄 Revisar buzón</button>
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📖 Ficha del aula (preguntas de siempre)</div>
      <p class="pa-optional-hint">Respóndelas <strong>una sola vez</strong> y el asistente se las contesta
        a todas las familias, todo el año: horario, uniforme, útiles, matrícula, NSP…
        Toca ✏️ para responder o corregir; deja vacía la respuesta para apagarla.</p>
      ${faqs.map(filaFaq).join('')}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="av-faq-add">➕ Otra pregunta del aula</button>
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🤖 Se publican solos</div>
      <p class="pa-optional-hint">Al sincronizar, el asistente también recibe —sin que escribas nada—:<br>
        📅 las <strong>fechas de los parciales</strong> que marcas en Notas SACE
        (${conFechas ? conFechas + ' parcial(es) con fechas' : 'aún sin fechas marcadas'}) y<br>
        💰 las <strong>cuentas claras de cada colecta</strong>: recaudado, gastado y saldo
        (${d.colectas.length ? d.colectas.length + ' colecta(s)' : 'aún sin colectas'}).</p>
      <p class="pa-optional-hint" id="av-sb-status"></p>
    </div>`;

  const form = document.getElementById('av-form');
  const abrirForm = (prefill) => {
    _avEditId = null;
    form.style.display = 'block';
    if (prefill) {
      document.getElementById('av-titulo').value = prefill.titulo || '';
      document.getElementById('av-texto').value = prefill.texto || '';
      document.getElementById('av-tipo').value = prefill.tipo || 'aviso';
      document.getElementById('av-fecha').value = prefill.fechaEvento || '';
      document.getElementById('av-hasta').value = prefill.hasta || avFechaMas(adHoy(), 14);
      document.getElementById('av-urgente').checked = prefill.prioridad === 'urgente';
    }
    document.getElementById('av-alumnos-box').style.display =
      document.getElementById('av-tipo').value === 'individual' ? 'block' : 'none';
    document.getElementById('av-titulo').focus();
  };

  adConvPuertaEnganchar(body);
  document.getElementById('av-nuevo').addEventListener('click', () => abrirForm({}));
  document.getElementById('av-cancelar').addEventListener('click', () => { _avEditId = null; renderAdmin(); });
  document.getElementById('av-tipo').addEventListener('change', e => {
    document.getElementById('av-alumnos-box').style.display = e.target.value === 'individual' ? 'block' : 'none';
  });

  /* Plantillas de 1 toque: prellenan el formulario; solo falta «Publicar» */
  body.querySelectorAll('.av-tpl').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.tpl;
    if (t === 'noclases') abrirForm({ titulo: 'Mañana no hay clases', prioridad: 'urgente',
      texto: 'Mañana ' + adFechaBonita(avFechaMas(adHoy(), 1)) + ' no habrá clases. Nos vemos el siguiente día hábil.',
      hasta: avFechaMas(adHoy(), 2) });
    else if (t === 'reunion') abrirForm({ tipo: 'evento', titulo: 'Reunión de padres',
      texto: 'Reunión de padres y madres en el aula. Día: ____. Hora: ____. Su asistencia es muy importante.',
      fechaEvento: avFechaMas(adHoy(), 3) });
    else if (t === 'material') abrirForm({ tipo: 'material', titulo: 'Traer materiales',
      texto: 'Para la clase se necesita traer: ____.', hasta: avFechaMas(adHoy(), 7) });
    else if (t === 'aporte') {
      const c = d.colectas.length ? d.colectas[d.colectas.length - 1] : null;
      abrirForm({ titulo: 'Recordatorio de aporte',
        texto: c ? 'Recuerde el aporte «' + c.concepto + '» (' + adLps(c.montoAlumno) + ' sugerido por alumno). Se entrega al maestro en el aula.'
                 : 'Recuerde el aporte acordado en reunión. Se entrega al maestro en el aula.' });
    }
  }));

  document.getElementById('av-publicar').addEventListener('click', async () => {
    const titulo = document.getElementById('av-titulo').value.trim();
    const texto = document.getElementById('av-texto').value.trim();
    const tipo = document.getElementById('av-tipo').value;
    const fechaEvento = document.getElementById('av-fecha').value || '';
    const hasta = document.getElementById('av-hasta').value || avFechaMas(adHoy(), 14);
    const urgente = document.getElementById('av-urgente').checked;
    const nums = document.getElementById('av-alumnos').value.split(',').map(s => +s.trim()).filter(n => n > 0);
    if (titulo.length < 3 || texto.length < 3) {
      await metasAlert('Escribe el título y el detalle del aviso (la familia leerá ambos).', { icono: '📣', titulo: 'Comunicados' });
      return;
    }
    if (texto.indexOf('____') >= 0) {
      await metasAlert('El texto todavía tiene espacios «____» sin llenar. Complétalos antes de publicar.', { icono: '📣', titulo: 'Comunicados' });
      return;
    }
    if (tipo === 'individual' && !nums.length) {
      await metasAlert('Para un aviso individual, escribe los números de lista (ej.: 3, 15).', { icono: '👤', titulo: 'Comunicados' });
      return;
    }
    const gg = avGrupo(d.id);
    const activos = gg.avisos.filter(a => avVigente(a) && a.id !== _avEditId).length;
    if (activos >= AV_MAX_ACTIVOS) {
      await metasAlert('Ya hay ' + AV_MAX_ACTIVOS + ' avisos activos. Borra o deja vencer alguno: si el canal se satura, los padres dejan de leerlo.', { icono: '📣', titulo: 'Comunicados' });
      return;
    }
    const nuevo = { id: _avEditId || ('AV' + Date.now().toString(36)), tipo,
      prioridad: urgente ? 'urgente' : 'normal', titulo, texto,
      fechaEvento: tipo === 'evento' ? fechaEvento : (fechaEvento || null),
      hasta: (tipo === 'evento' && fechaEvento && fechaEvento > hasta) ? avFechaMas(fechaEvento, 1) : hasta,
      alumnos: tipo === 'individual' ? nums : null, mod: new Date().toISOString() };
    if (!nuevo.fechaEvento) nuevo.fechaEvento = null;
    const i = gg.avisos.findIndex(a => a.id === nuevo.id);
    if (i >= 0) gg.avisos[i] = nuevo; else gg.avisos.push(nuevo);
    avGrupoSave(d.id, gg);
    _avEditId = null;
    renderAdmin();
    toast('📣 Aviso publicado: llega al asistente en unos segundos');
  });

  body.querySelectorAll('.av-edit').forEach(b => b.addEventListener('click', () => {
    _avEditId = b.dataset.avid; renderAdmin();
  }));
  body.querySelectorAll('.av-del').forEach(b => b.addEventListener('click', async () => {
    if (!await metasConfirm('¿Borrar este aviso? Dejará de mostrarse a las familias.', { icono: '📣', titulo: 'Comunicados', okTxt: 'Sí, borrar' })) return;
    const gg = avGrupo(d.id);
    const av = gg.avisos.find(a => a.id === b.dataset.avid);
    adUndoGuardar('Borrar aviso «' + ((av && av.titulo) || 'sin título') + '»');
    gg.avisos = gg.avisos.filter(a => a.id !== b.dataset.avid);
    avGrupoSave(d.id, gg); renderAdmin();
  }));

  /* Ficha del aula: responder/corregir una pregunta */
  body.querySelectorAll('.av-faq-edit').forEach(b => b.addEventListener('click', async () => {
    const fid = b.dataset.fid;
    const f = avFaqsDe(d.id).find(x => x.id === fid);
    if (!f) return;
    const r = await metasPrompt('**' + f.pregunta + '**\n\nEscribe la respuesta que el asistente dará a las familias (vacía = apagar la pregunta):', {
      icono: '📖', titulo: 'Ficha del aula', value: f.respuesta || '', okTxt: 'Guardar' });
    if (r === null) return;
    const gg = avGrupo(d.id);
    const nueva = { id: f.id, pregunta: f.pregunta, claves: f.claves || '',
      respuesta: String(r).trim(), activa: !!String(r).trim() };
    const i = gg.faqs.findIndex(x => x.id === fid);
    if (i >= 0) gg.faqs[i] = nueva; else gg.faqs.push(nueva);
    avGrupoSave(d.id, gg); renderAdmin();
    toast(nueva.activa ? '📖 Respuesta guardada' : '📖 Pregunta apagada');
  }));
  document.getElementById('av-faq-add').addEventListener('click', async () => {
    const p = await metasPrompt('¿Qué pregunta hacen las familias? (ej.: **¿Hay clases de refuerzo?**)', {
      icono: '📖', titulo: 'Ficha del aula', okTxt: 'Siguiente',
      valida: v => String(v).trim().length >= 5 ? '' : 'Escribe la pregunta completa.' });
    if (p === null) return;
    const r = await metasPrompt('¿Y qué debe responder el asistente?', {
      icono: '📖', titulo: 'Ficha del aula', okTxt: 'Guardar',
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe la respuesta.' });
    if (r === null) return;
    const gg = avGrupo(d.id);
    gg.faqs.push({ id: 'F' + Date.now().toString(36), pregunta: String(p).trim(),
      claves: '', respuesta: String(r).trim(), activa: true });
    avGrupoSave(d.id, gg); renderAdmin();
    toast('📖 Pregunta agregada a la ficha');
  });

  /* reportes de conducta: alumno + descripción, dos toques */
  body.querySelectorAll('.av-cond-add').forEach(b => b.addEventListener('click', async () => {
    const tipo = b.dataset.ctipo;
    const numTxt = await metasPrompt('**' + AV_CONDUCTA_TIPOS[tipo] + '**\n\n¿Número de lista del alumno/a?', {
      icono: '🙂', titulo: 'Reporte de conducta', inputmode: 'numeric', okTxt: 'Siguiente',
      valida: v => d.lista.some(a => a.num === +String(v).trim()) ? '' : 'No hay alumno con ese número en la lista.',
    });
    if (numTxt === null) return;
    const num = +String(numTxt).trim();
    const al = d.lista.find(a => a.num === num) || {};
    const texto = await metasPrompt('Describe brevemente lo sucedido con **#' + num +
      (al.nombre ? ' ' + adPrimerNombre(al.nombre) : '') + '** (lo leerá su familia en el asistente):', {
      icono: AV_CONDUCTA_TIPOS[tipo].split(' ')[0], titulo: 'Reporte de conducta', okTxt: 'Publicar',
      valida: v => String(v).trim().length >= 5 ? '' : 'Describe qué pasó (mínimo 5 letras).',
    });
    if (texto === null) return;
    const gg = avGrupo(d.id);
    gg.conducta.push({ id: 'CD' + Date.now().toString(36), num, tipo,
      texto: String(texto).trim().slice(0, 500), fecha: adHoy(), hasta: avFechaMas(adHoy(), 45) });
    avGrupoSave(d.id, gg);
    renderAdmin();
    toast('🙂 Reporte publicado: lo verá la familia de #' + num);
  }));
  body.querySelectorAll('.av-cond-del').forEach(b => b.addEventListener('click', async () => {
    if (!await metasConfirm('¿Borrar este reporte? La familia dejará de verlo.', { icono: '🙂', titulo: 'Reporte de conducta', okTxt: 'Sí, borrar' })) return;
    const gg = avGrupo(d.id);
    const rc = gg.conducta.find(c => c.id === b.dataset.cid);
    adUndoGuardar('Borrar reporte de conducta de #' + ((rc && rc.num) || '?'));
    gg.conducta = gg.conducta.filter(c => c.id !== b.dataset.cid);
    avGrupoSave(d.id, gg); renderAdmin();
  }));
  document.getElementById('av-buzon-ver').addEventListener('click', () => avBuzonCargar(adLoad()));
  avSincronizarNube(false);   /* refresca el estado al entrar */
  avBuzonCargar(d);           /* bandeja padre→maestro */
  avVistosCargar(d, g);       /* «visto por N de M familias» por aviso */
}

/* ── Buzón de las familias (mensajes_padre, SUPABASE-FASE3.sql) ── */
const BUZON_VISTO_KEY = 'METAS_BUZON_VISTO_V1';
function _avSbConexion() {
  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  try {
    url = localStorage.getItem('METAS_SB_URL') || url;
    key = localStorage.getItem('METAS_SB_KEY') || key;
  } catch (_) {}
  return { url, key };
}
/* Excusa estructurada que deja el asistente de padres: «[EXCUSA YYYY-MM-DD] razón» */
function avParseExcusa(texto) {
  const m = String(texto || '').match(/^\[EXCUSA (\d{4}-\d{2}-\d{2})\]\s*([\s\S]*)$/);
  return m ? { fecha: m[1], razon: (m[2] || '').trim() || 'Sin razón' } : null;
}

/* Una sola consulta al buzón para las DOS pantallas que lo usan
   (Comunicados y el pase de lista): se guarda un minuto en memoria para
   no gastar datos del maestro al ir y venir entre pestañas. */
let _avBuzonCache = null;
async function avBuzonFilas(d, forzar) {
  const claves = adClavesDelGrupo(d);
  if (!claves.length) return { err: 'sinclaves', rows: [] };
  if (navigator.onLine === false) return { err: 'offline', rows: [] };
  if (!forzar && _avBuzonCache && _avBuzonCache.gid === d.id &&
      Date.now() - _avBuzonCache.t < 60000) {
    return { err: '', rows: _avBuzonCache.rows };
  }
  try {
    const { url, key } = _avSbConexion();
    const r = await fetch(url + '/rest/v1/rpc/metas_buzon_docente', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigos: claves }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    if (!Array.isArray(rows)) throw new Error('respuesta inesperada');
    _avBuzonCache = { t: Date.now(), gid: d.id, rows };
    return { err: '', rows };
  } catch (_) {
    return { err: 'red', rows: [] };
  }
}

async function avBuzonCargar(d) {
  const cont = document.getElementById('av-buzon');
  if (!cont) return;
  const hint = t => '<p class="pa-optional-hint">' + t + '</p>';
  const res = await avBuzonFilas(d, true);
  if (res.err === 'sinclaves') { cont.innerHTML = hint('Aún no hay claves de familia en este grupo.'); return; }
  if (res.err === 'offline') { cont.innerHTML = hint('📴 Sin internet: el buzón se revisa con conexión.'); return; }
  if (res.err === 'red') {
    cont.innerHTML = hint('⚠️ No se pudo revisar el buzón (¿ya corriste SUPABASE-FASE3.sql?). Toca «🔄 Revisar buzón» para reintentar.');
    return;
  }
  {
    const rows = res.rows;
    if (!rows.length) { cont.innerHTML = hint('Buzón vacío: sin mensajes de las familias.'); return; }
    const quien = {}, numDe = {};
    d.lista.forEach(a => {
      const c = adClaveFamilia(d.id, a.num, false);
      if (c) { quien[c] = '#' + a.num + (a.nombre ? ' ' + adPrimerNombre(a.nombre) : ''); numDe[c] = a.num; }
    });
    let vistos = [];
    try { vistos = JSON.parse(localStorage.getItem(BUZON_VISTO_KEY)) || []; } catch (_) {}
    const vSet = new Set(vistos);
    /* ¿ya está marcada esa fecha en el pase de lista? */
    const yaMarcada = (fecha, num) => {
      const r = (adLoad().asistencia || []).find(x => x.f === fecha);
      return !!(r && r.aus && r.aus[num]);
    };
    cont.innerHTML = rows.map(m => {
      const id = m.codigo + '|' + m.creado_en;
      const nuevo = !vSet.has(id);
      /* excusa estructurada del asistente: [EXCUSA YYYY-MM-DD] razón */
      const mEx = avParseExcusa(m.texto);
      if (mEx && numDe[m.codigo]) {
        const fecha = mEx.fecha, razon = mEx.razon, num = numDe[m.codigo];
        const marcada = yaMarcada(fecha, num);
        return `<div class="ad-gasto-row" style="align-items:flex-start${nuevo ? '' : ';opacity:.75'}">
          <span style="flex:1">${nuevo ? '🔵 ' : ''}🤒 <strong>${adEsc(quien[m.codigo])}</strong> — excusa para el
            <strong>${adFechaBonita(fecha)}</strong><br><small>${adEsc(razon)}</small><br>
            ${marcada ? '<small style="color:#1e8e3e">📝 Ya está en el pase de lista de ese día.</small>'
              : `<button class="pa-generate-btn ad-btn-sec av-excusa-ok" data-num="${num}" data-fecha="${fecha}"
                   style="margin-top:6px">✔ Marcar con excusa en asistencia</button>`}
          </span>
        </div>`;
      }
      return `<div class="ad-gasto-row" style="align-items:flex-start${nuevo ? '' : ';opacity:.6'}">
        <span style="flex:1">${nuevo ? '🔵 ' : ''}<strong>${adEsc(quien[m.codigo] || m.codigo)}</strong>
          <small>· ${adFechaBonita(String(m.creado_en).slice(0, 10))}</small><br>
          <small>${adEsc(m.texto)}</small></span>
      </div>`;
    }).join('');
    /* un toque: la excusa queda 'E' en el pase de lista de ese día y
       sube sola a la nube — el padre la ve como «con excusa» */
    cont.querySelectorAll('.av-excusa-ok').forEach(b => b.addEventListener('click', () => {
      const num = +b.dataset.num, fecha = b.dataset.fecha;
      const dd = adLoad();
      let reg = dd.asistencia.find(r => r.f === fecha);
      if (!reg) { reg = { f: fecha, aus: {} }; dd.asistencia.push(reg); }
      reg.aus = reg.aus || {};
      reg.aus[num] = 'E';
      adSave(dd);
      toast('📝 #' + num + ' con excusa el ' + adFechaBonita(fecha));
      avBuzonCargar(adLoad());
    }));
    /* lo mostrado queda marcado como visto (el 🔵 sale solo una vez) */
    try {
      const todos = Array.from(new Set(vistos.concat(rows.map(m => m.codigo + '|' + m.creado_en))));
      localStorage.setItem(BUZON_VISTO_KEY, JSON.stringify(todos.slice(-400)));
    } catch (_) {}
  }
}

/* «Visto por N de M familias»: cuántas familias abrieron cada aviso */
async function avVistosCargar(d, g) {
  const bases = (g.avisos || []).filter(avVigente).map(a => 'AVI-' + a.id);
  if (!bases.length || navigator.onLine === false) return;
  try {
    const { url, key } = _avSbConexion();
    const r = await fetch(url + '/rest/v1/rpc/metas_avisos_vistos', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_bases: bases }),
    });
    if (!r.ok) return;
    const rows = await r.json();
    const total = adClavesDelGrupo(d).length;
    (Array.isArray(rows) ? rows : []).forEach(v => {
      const el = document.querySelector('[data-vistos="' + v.base + '"]');
      if (el) el.textContent = ' · 👁 visto por ' + v.n + ' de ' + total + ' familias';
    });
  } catch (_) {}
}

/* ══════════════ ☁️ NUBE DEL CHATBOT (Supabase) ══════════════
   Cada dato administrativo sube por CLAVE DE FAMILIA (la misma
   15-K7QM del Plan de Acción, vía paCodigoAlumno) para que el
   chatbot de padres responda asistencia, notas finales y
   colaboraciones. Sincronización DIFERENCIAL: firma por fila en
   METAS_ADMIN_SB_V1 — solo sube lo que cambió; lo borrado se
   anula en la nube (presente / nota null / eliminada).
   Offline-first: sin internet no pasa nada; reintenta al volver. */
const ADMIN_SB_KEY = 'METAS_ADMIN_SB_V1';
let _adSyncT = null;
let _adSyncBusy = false;

function adSbMapLoad() {
  try { const o = JSON.parse(localStorage.getItem(ADMIN_SB_KEY)); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}
function adSbMapSave(m) { try { localStorage.setItem(ADMIN_SB_KEY, JSON.stringify(m)); } catch (_) {} }

function adDocenteTxt() {
  try {
    const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1'));
    if (d && (d.nombre || d.codigo)) return [d.nombre, d.codigo].filter(Boolean).join(' · ');
  } catch (_) {}
  return '';
}
/* Solo el NOMBRE, sin el código PROF: en un recibo el padre lee «Recibió
   Josué Polanco Lemus», no un código de sistema. */
function adDocenteNombre() {
  try {
    const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1'));
    if (d && d.nombre) return String(d.nombre).trim();
  } catch (_) {}
  return '';
}
/* Credenciales del maestro (PROF + contraseña) para reautenticar las
   escrituras a la nube del chatbot. Sin cuenta docente no se publica. */
function adDocenteCreds() {
  try {
    const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1'));
    if (d && d.codigo && d.clave) return { prof: d.codigo, clave: d.clave };
  } catch (_) {}
  return null;
}
function adMateriaSlug(m) {
  return String(m || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
}

/* Filas actuales que deberían existir en la nube — de TODOS los grupos
   (el maestro puede tener dos colegios; el chatbot atiende a todos).
   El evento_id lleva la CLAVE DE FAMILIA (única entre maestros gracias
   a sus letras aleatorias y a la llave por grupo) — nunca grado+número,
   que se repetiría entre las aulas «6A #15» de mil maestros suscritos. */
/* Año lectivo del grupo (la boleta ya lo guarda). Va en cada fila y
   DENTRO del evento_id de las notas: las de 2027 no pisan las de 2026. */
function adAnioDe(d) {
  return String((d.boleta && d.boleta.anio) || new Date().getFullYear());
}

function adFilasNube(st) {
  const doc = adDocenteTxt();
  const filas = [];
  (st.grupos || []).forEach(d => {
    const anio = adAnioDe(d);
    const base = { grado: d.grado || '', seccion: d.seccion || '', docente: doc, anio_lectivo: anio };
    const cod = {};
    d.lista.forEach(a => { cod[a.num] = adClaveFamilia(d.id, a.num); });

    d.asistencia.forEach(r => Object.keys(r.aus || {}).forEach(num => {
      if (!cod[num]) return;
      filas.push(Object.assign({
        evento_id: 'ADA-' + r.f + '-' + cod[num], codigo: cod[num],
        tipo: 'asistencia', fecha: r.f,
        estado: r.aus[num] === 'A' ? 'ausente' : 'excusa',
      }, base));
    }));

    Object.keys(d.notas || {}).forEach(parcial =>
      Object.keys(d.notas[parcial] || {}).forEach(materia =>
        Object.keys(d.notas[parcial][materia] || {}).forEach(num => {
          if (!cod[num]) return;
          const valor = d.notas[parcial][materia][num];
          // La nube guarda `nota` como NÚMERO. Lo cualitativo (personalidad:
          // S, MB, B…) viaja como texto en `estado` para no romper el envío;
          // así el asistente de padres también recibe la conducta.
          const esNum = valor !== '' && valor != null && !isNaN(Number(valor));
          filas.push(Object.assign({
            evento_id: 'ADN-' + anio + '-' + parcial + '-' + adMateriaSlug(materia) + '-' + cod[num],
            codigo: cod[num], tipo: 'nota_final', parcial, materia,
            nota: esNum ? Number(valor) : null,
            estado: esNum ? '' : String(valor),
          }, base));
        })));

    d.colectas.forEach(c => d.lista.forEach(a => {
      if (!cod[a.num]) return;
      const pagado = c.pagos && c.pagos[a.num] != null;
      filas.push(Object.assign({
        evento_id: 'ADE-' + c.id + '-' + cod[a.num], codigo: cod[a.num],
        tipo: 'economia', fecha: c.fecha, concepto: c.concepto,
        monto: pagado ? c.pagos[a.num] : c.montoAlumno,
        estado: pagado ? 'pago' : 'pendiente',
      }, base));
    }));
  });
  return filas;
}

function adFirma(f) {
  return [f.codigo, f.fecha || '', f.estado || '', f.parcial || '', f.materia || '',
          f.nota != null ? f.nota : '', f.concepto || '', f.monto != null ? f.monto : ''].join('|');
}

/* Fila de anulación para un evento que ya no existe localmente.
   IMPORTANTE: Las notas finales, personalidad y días perdidos (ADN-) NUNCA se
   anulan en automático por ausencia temporal en un dispositivo para proteger
   las calificaciones subidas de cualquier pérdida accidental. */
function adFilaAnulada(eventoId, guardado) {
  const b = { evento_id: eventoId, codigo: guardado.c, grado: '', seccion: '', docente: adDocenteTxt() };
  if (eventoId.startsWith('ADA-')) return Object.assign(b, { tipo: 'asistencia', estado: 'presente' });
  if (eventoId.startsWith('ADN-')) {
    const m = eventoId.match(/^ADN-(\d{4})-(I{1,3}|IV)-([a-z0-9-]+)-([A-Z0-9]+)$/);
    return Object.assign(b, {
      tipo: 'nota_final',
      anio_lectivo: m ? m[1] : '',
      parcial: m ? m[2] : '',
      nota: '',
      borrar: true
    });
  }
  return Object.assign(b, { tipo: 'economia', estado: 'eliminada' });
}

function adSyncProgramar() {
  clearTimeout(_adSyncT);
  _adSyncT = setTimeout(() => adSincronizarNube(false), 4000);
}

/* Cambios que aún no llegan a la nube (registros + comunicados) — para
   el chip de estado visible junto a las pestañas de Mi aula */
function adPendientesTotal() {
  try {
    const st = adState();
    let n = 0;
    const fa = adFilasNube(st), ma = adSbMapLoad();
    n += fa.filter(f => !ma[f.evento_id] || ma[f.evento_id].f !== adFirma(f)).length;
    const act1 = new Set(fa.map(f => f.evento_id));
    Object.keys(ma).forEach(id => { if (!id.startsWith('ADN-') && !act1.has(id) && !ma[id].x) n++; });
    const fv = avFilasNube(st), mv = avSbMapLoad();
    n += fv.filter(f => !mv[f.evento_id] || mv[f.evento_id].f !== avFirma(f)).length;
    const act2 = new Set(fv.map(f => f.evento_id));
    Object.keys(mv).forEach(id => { if (!act2.has(id) && !mv[id].x) n++; });
    return n;
  } catch (_) { return 0; }
}

async function adSincronizarNube(manual) {
  avSincronizarNube(manual);   /* los comunicados viajan con el mismo tren */
  if (_adSyncBusy) return;
  const st = document.getElementById('ad-sb-status');
  const filas = adFilasNube(adState());   /* TODOS los grupos */
  const mapa = adSbMapLoad();
  const actuales = new Set(filas.map(f => f.evento_id));

  const pendientes = filas.filter(f => !mapa[f.evento_id] || mapa[f.evento_id].f !== adFirma(f));
  Object.keys(mapa).forEach(id => {
    if (!id.startsWith('ADN-') && !actuales.has(id) && !mapa[id].x) pendientes.push(adFilaAnulada(id, mapa[id]));
  });

  if (!pendientes.length) {
    if (st) st.textContent = '☁️ Nube del chatbot: al día.';
    adActualizarChipNube();
    return;
  }
  if (navigator.onLine === false) {
    if (st) st.textContent = '📴 ' + pendientes.length + ' cambio(s) esperando internet.';
    return;
  }
  const cred = adDocenteCreds();
  if (!cred) {
    if (st) st.textContent = '🔒 Entra a tu cuenta docente para publicar en la nube del chatbot.';
    return;
  }
  _adSyncBusy = true;
  adActualizarChipNube();
  if (st) st.textContent = '⏳ Subiendo ' + pendientes.length + ' cambio(s)…';
  /* Qué NOTAS van en este viaje, por parcial: al terminar se avisa con un
     toast «Parcial II subido». El maestro que acaba de llenar la boleta
     necesita oírlo sin ir a buscar el chip de la nube; lo demás
     (asistencia, economía) sigue subiendo en silencio, como siempre. */
  const notasParcial = {};
  pendientes.forEach(f => {
    if (f.tipo === 'nota_final' && f.parcial && actuales.has(f.evento_id)) {
      notasParcial[f.parcial] = (notasParcial[f.parcial] || 0) + 1;
    }
  });
  try {
    let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
    let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
    try {
      url = localStorage.getItem('METAS_SB_URL') || url;
      key = localStorage.getItem('METAS_SB_KEY') || key;
    } catch (_) {}
    for (let i = 0; i < pendientes.length; i += 250) {
      const lote = pendientes.slice(i, i + 250);
      const r = await fetch(url + '/rest/v1/rpc/metas_guardar_admin', {
        method: 'POST',
        headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_prof: cred.prof, p_clave: cred.clave, filas: lote }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const n = await r.json();
      if (typeof n !== 'number') throw new Error('respuesta inesperada');
      if (n < 0) throw new Error('cuenta docente rechazada');
      /* marcar el lote como sincronizado */
      lote.forEach(f => {
        if (actuales.has(f.evento_id)) mapa[f.evento_id] = { f: adFirma(f), c: f.codigo };
        else mapa[f.evento_id] = { f: 'x', c: f.codigo, x: 1 };   /* anulada: no reenviar */
      });
      adSbMapSave(mapa);
    }
    adActualizarChipNube();
    if (st) st.textContent = '✅ Nube del chatbot al día (' + new Date().toLocaleTimeString('es-HN') + ').';
    if (manual) toast('☁️ Registros sincronizados');
    else if (typeof toast === 'function') {
      const orden = ['I', 'II', 'III', 'IV'];
      const ps = Object.keys(notasParcial).sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
      const nTxt = p => notasParcial[p] === 1 ? '1 nota' : notasParcial[p] + ' notas';
      if (ps.length === 1) toast('☁️ Parcial ' + ps[0] + ' subido a la nube (' + nTxt(ps[0]) + '). Las familias ya pueden verlo.');
      else if (ps.length) toast('☁️ Notas subidas a la nube — ' + ps.map(p => 'Parcial ' + p + ': ' + nTxt(p)).join(' · '));
    }
  } catch (_) {
    if (st) st.textContent = '⚠️ No se pudo subir ahora; se reintenta solo.';
  }
  _adSyncBusy = false;
  adActualizarChipNube();
}
window.addEventListener('online', () => adSyncProgramar());

/* ── Nube de COMUNICADOS (mensajes_docente, SUPABASE-AVISOS.sql) ──
   Mismo patrón diferencial que los registros: firma por fila en
   METAS_AVISOS_SB_V1, fan-out por clave de familia, y lo que ya no
   existe localmente se anula reenviándolo vencido (vigente_hasta
   2000-01-01: el bot solo muestra lo vigente). Además de los avisos
   del maestro, se emiten AUTOMÁTICOS: fechas de parciales (Notas
   SACE) y cuentas claras de cada colecta (Economía). */
const AVISOS_SB_KEY = 'METAS_AVISOS_SB_V1';
let _avSyncBusy = false;

function avSbMapLoad() {
  try { const o = JSON.parse(localStorage.getItem(AVISOS_SB_KEY)); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}
function avSbMapSave(m) { try { localStorage.setItem(AVISOS_SB_KEY, JSON.stringify(m)); } catch (_) {} }

function avFilasNube(st) {
  const doc = adDocenteTxt();
  const filas = [];
  const av = avLoad();
  (st.grupos || []).forEach(d => {
    const anio = adAnioDe(d);
    const base = { grado: d.grado || '', seccion: d.seccion || '', docente: doc, anio_lectivo: anio };
    const claves = (d.lista || []).map(a => ({ num: a.num, cod: adClaveFamilia(d.id, a.num, false) }))
      .filter(x => x.cod);
    if (!claves.length) return;
    const g = av.grupos[d.id] || { avisos: [], faqs: [] };

    /* avisos del maestro (los vencidos no viajan: el vencimiento ya
       pasó en la nube o la anulación de abajo los apaga) */
    (g.avisos || []).filter(avVigente).forEach(a => {
      const destino = (a.tipo === 'individual' && Array.isArray(a.alumnos) && a.alumnos.length)
        ? claves.filter(x => a.alumnos.indexOf(x.num) >= 0) : claves;
      destino.forEach(x => filas.push(Object.assign({
        evento_id: 'AVI-' + a.id + '-' + x.cod, codigo: x.cod,
        subtipo: a.tipo, prioridad: a.prioridad || 'normal',
        titulo: a.titulo, texto: a.texto,
        fecha_evento: a.fechaEvento || '', vigente_hasta: a.hasta,
      }, base)));
    });

    /* reportes de conducta: SOLO a la clave del alumno reportado */
    (g.conducta || []).filter(avVigente).forEach(c => {
      const x = claves.find(k => k.num === c.num);
      if (!x) return;
      filas.push(Object.assign({
        evento_id: 'AVD-' + c.id + '-' + x.cod, codigo: x.cod,
        subtipo: 'conducta', prioridad: 'normal',
        titulo: AV_CONDUCTA_TIPOS[c.tipo] || '📋 Reporte',
        texto: c.texto, fecha_evento: c.fecha, vigente_hasta: c.hasta,
      }, base));
    });

    /* ficha del aula (vigente todo el año lectivo) */
    (g.faqs || []).filter(f => f.activa !== false && f.respuesta).forEach(f =>
      claves.forEach(x => filas.push(Object.assign({
        evento_id: 'AVF-' + f.id + '-' + x.cod, codigo: x.cod,
        subtipo: 'faq', pregunta: f.pregunta, claves: f.claves || '',
        texto: f.respuesta, vigente_hasta: anio + '-12-31',
      }, base))));

    /* AUTOMÁTICO: fechas de parciales marcadas en Notas SACE */
    const pf = (d.boleta || {}).parcialFechas || {};
    Object.keys(pf).forEach(p => {
      const r = pf[p];
      if (!r || !r.desde || !r.hasta) return;
      claves.forEach(x => filas.push(Object.assign({
        evento_id: 'AVP-' + p + '-' + x.cod, codigo: x.cod,
        subtipo: 'evento', titulo: 'Parcial ' + p,
        texto: 'Evaluaciones del Parcial ' + p + ': del ' + adFechaBonita(r.desde) +
               ' al ' + adFechaBonita(r.hasta) + '. Apoye el repaso en casa esos días.',
        fecha_evento: r.desde, vigente_hasta: avFechaMas(r.hasta, 7),
      }, base)));
    });

    /* AUTOMÁTICO: BITÁCORA de los controles marcados «contarlo a la familia».
       Cada anotación va SOLO a la clave de ese alumno. Los controles apagados
       (salud, talla, merienda) no producen ni una fila: no salen del teléfono.
       Vencen a los 60 días: la Bitácora cuenta lo reciente, y así no se llena
       el tope de filas por familia con el diario de todo el año. */
    (d.controles || []).forEach(c => {
      if (!c.fam) return;
      const misEnlace = adCtrlMisionClaves(c);
      Object.keys(c.datos || {}).forEach(num => {
        const x = claves.find(k => String(k.num) === String(num));
        if (!x) return;
        filas.push(Object.assign({
          evento_id: 'AVB-' + c.id + '-' + x.cod, codigo: x.cod,
          subtipo: 'individual', prioridad: 'normal',
          titulo: '📔 Bitácora · ' + (c.icono || '✅') + ' ' + c.nombre,
          texto: adCtrlBitacoraTxt(c, d, num),
          claves: misEnlace,
          fecha_evento: c.fecha, vigente_hasta: avFechaMas(c.fecha, 60),
        }, base));
      });
    });

    /* AUTOMÁTICO: novedades de la clase, escritas por el maestro. Estas SÍ van a
       todas las familias: es lo que pasó en el aula, no el dato de un alumno. */
    (d.bitacora || []).forEach(n => {
      claves.forEach(x => filas.push(Object.assign({
        evento_id: 'AVN-' + n.id + '-' + x.cod, codigo: x.cod,
        subtipo: 'aviso', prioridad: 'normal',
        titulo: '📔 Bitácora · Novedad de la clase',
        texto: n.texto,
        fecha_evento: n.fecha, vigente_hasta: avFechaMas(n.fecha, 60),
      }, base)));
    });

    /* AUTOMÁTICO: cuentas claras de cada colecta (rendición) */
    const grupoTxt = adGrupoTxt(d);
    (d.colectas || []).forEach(c => {
      const t = adColectaTotales(c);
      const gastos = (c.gastos || []).map(gx => gx.d + ' ' + adLps(gx.m)).join(', ');
      claves.forEach(x => filas.push(Object.assign({
        evento_id: 'AVC-' + c.id + '-' + x.cod, codigo: x.cod,
        subtipo: 'cuentas', titulo: 'Cuentas claras — ' + c.concepto,
        texto: 'Recaudado: ' + adLps(t.rec) + ' · Gastado: ' + adLps(t.gas) +
               (gastos ? ' (' + gastos + ')' : '') + ' · Saldo: ' + adLps(t.saldo) + '.',
        vigente_hasta: avFechaMas(c.fecha, 200),
      }, base)));

      /* AUTOMÁTICO: RECIBO de cada aporte marcado. Sale solo al marcar al
         alumno y viaja ÚNICAMENTE a la clave de ESA familia: respalda su
         movimiento con folio, monto, fecha y quién recibió el dinero. Si el
         maestro corrige el monto, el mismo folio se reemite con la cifra
         buena; si quita la marca, la anulación lo apaga sola.
         Dura todo el año lectivo: es un comprobante, no un aviso del día. */
      Object.keys(c.pagos || {}).forEach(num => {
        const x = claves.find(k => String(k.num) === String(num));
        if (!x) return;
        const monto = Number(c.pagos[num]) || 0;
        if (!(monto > 0)) return;
        const al = (d.lista || []).find(a => String(a.num) === String(num)) || {};
        /* NOMBRE COMPLETO, no solo el primero: el recibo va detrás de la clave
           de esa familia, así que el dato es privado y un comprobante con el
           nombre entero es el que sirve de respaldo de verdad. */
        const nom = String(al.nombre || '').trim();
        const quien = nom ? nom + ' (n.º ' + num + ' de la lista)' : 'su hijo/a (n.º ' + num + ' de la lista)';
        const fecha = (c.pagosF && c.pagosF[num]) || c.fecha;
        const folio = adReciboFolio(c, num);
        filas.push(Object.assign({
          evento_id: 'AVR-' + c.id + '-' + x.cod, codigo: x.cod,
          subtipo: 'cuentas', titulo: '🧾 Recibo ' + folio + ' — ' + c.concepto,
          /* el número del recibo NO se le pide al padre dentro del texto: ya
             está a la vista en la tarjeta. Nada de «conserve el folio»: la
             familia está harta de códigos que le toca cuidar. */
          texto: 'Recibido de ' + quien + ': ' + adLps(monto) +
                 ' por concepto de «' + c.concepto + '», el ' + adFechaBonita(fecha) + '.' +
                 (grupoTxt ? ' Grupo ' + grupoTxt + '.' : '') +
                 ' Recibió ' + (adDocenteNombre() || 'el docente') + '.' +
                 ' Este comprobante respalda su entrega, y las cuentas completas de la colecta' +
                 ' (recaudado, gastado y saldo) las puede consultar aquí mismo. ' +
                 AV_RECIBO_CIERRE[(Number(num) || 0) % AV_RECIBO_CIERRE.length],
          fecha_evento: fecha, vigente_hasta: anio + '-12-31',
        }, base));
      });
    });
  });
  return filas;
}

function avFirma(f) {
  return [f.codigo, f.subtipo, f.prioridad || '', f.titulo || '', f.texto || '',
          f.pregunta || '', f.claves || '', f.fecha_evento || '', f.vigente_hasta || ''].join('|');
}

async function avSincronizarNube(manual) {
  if (_avSyncBusy) return;
  const st = document.getElementById('av-sb-status');
  const filas = avFilasNube(adState());
  const mapa = avSbMapLoad();
  const actuales = new Set(filas.map(f => f.evento_id));

  const pendientes = filas.filter(f => !mapa[f.evento_id] || mapa[f.evento_id].f !== avFirma(f));
  Object.keys(mapa).forEach(id => {
    if (!actuales.has(id) && !mapa[id].x) pendientes.push({
      evento_id: id, codigo: mapa[id].c, subtipo: 'aviso',
      titulo: '', texto: '', vigente_hasta: '2000-01-01',
      grado: '', seccion: '', docente: adDocenteTxt(),
    });
  });

  if (!pendientes.length) {
    if (st) st.textContent = '☁️ Comunicados: al día.';
    return;
  }
  if (navigator.onLine === false) {
    if (st) st.textContent = '📴 ' + pendientes.length + ' comunicado(s) esperando internet.';
    return;
  }
  const cred = adDocenteCreds();
  if (!cred) {
    if (st) st.textContent = '🔒 Entra a tu cuenta docente para publicar comunicados.';
    return;
  }
  _avSyncBusy = true;
  if (st) st.textContent = '⏳ Publicando ' + pendientes.length + ' comunicado(s)…';
  try {
    let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
    let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
    try {
      url = localStorage.getItem('METAS_SB_URL') || url;
      key = localStorage.getItem('METAS_SB_KEY') || key;
    } catch (_) {}
    for (let i = 0; i < pendientes.length; i += 250) {
      const lote = pendientes.slice(i, i + 250);
      const r = await fetch(url + '/rest/v1/rpc/metas_guardar_avisos', {
        method: 'POST',
        headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_prof: cred.prof, p_clave: cred.clave, filas: lote }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const n = await r.json();
      if (typeof n !== 'number') throw new Error('respuesta inesperada');
      if (n < 0) throw new Error('cuenta docente rechazada');
      lote.forEach(f => {
        if (actuales.has(f.evento_id)) mapa[f.evento_id] = { f: avFirma(f), c: f.codigo };
        else mapa[f.evento_id] = { f: 'x', c: f.codigo, x: 1 };   /* anulado: no reenviar */
      });
      avSbMapSave(mapa);
    }
    if (st) st.textContent = '✅ Comunicados al día (' + new Date().toLocaleTimeString('es-HN') + ').';
    if (manual) toast('📣 Comunicados publicados');
  } catch (_) {
    if (st) st.textContent = '⚠️ No se pudieron publicar ahora; se reintenta solo.';
  }
  _avSyncBusy = false;
}

/* Restaurar «Mi aula» tras recargar / sincronizar: implementado en adRestoreState arriba */

/* ── Navegación (mismo patrón que las demás herramientas) ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-admin-btn')?.addEventListener('click', async () => {
    /* dinero y notas finales: detrás del candado del maestro */
    if (typeof paVerificarPin === 'function' &&
        !(await paVerificarPin('Los registros administrativos guardan **dinero y notas finales**:'))) return;
    switchView('view-admin');
    renderAdmin();
  });
  /* La flecha de arriba sube UN nivel, no salta al final. Dentro de una
     colecta, «atrás» es la lista de colectas: el maestro confundía la flecha
     del encabezado con el enlace de la colecta y se salía del aula sin
     querer. Fuera de una colecta sí sale a la Zona Docente. */
  document.getElementById('admin-back-btn')?.addEventListener('click', () => {
    if (_adFichasOn) { _adFichasOn = 0; renderAdmin(); return; }
    if (_adGastosOn) { _adGastosOn = 0; renderAdmin(); return; }
    if (_adInvOn) { _adInvOn = 0; renderAdmin(); return; }
    if (typeof adConvAtras === 'function' && adConvAtras()) { renderAdmin(); return; }
    if (_adColectaId) { _adColectaId = null; renderAdmin(); return; }
    if (_adControlId) { _adControlId = null; renderAdmin(); return; }
    switchView('view-perfil');
  });
});
