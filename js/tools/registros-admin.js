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

let _adTab = 'lista';        /* lista | eco | asis | sace | com */
let _adColectaId = null;     /* colecta abierta en Economía */

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
    materias: AD_MATERIAS_DEF.slice(), lista: [], colectas: [], asistencia: [], notas: {} }, props || {});
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
const AD_UNDO_MAX = 4;
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
  if (!await metasConfirm('Se restaurará <strong>todo Mi aula</strong> exactamente a como estaba ' +
    '<strong>antes de: ' + adEsc(f.e) + '</strong> (' + adFechaBonita(f.t.slice(0, 10)) + ' ' +
    f.t.slice(11, 16) + ').\n\n⚠️ Lo que hayas cambiado en Mi aula DESPUÉS de ese momento se pierde. ' +
    'La nube del chatbot se corrige sola al sincronizar. ¿Restaurar?',
    { icono: '🕘', titulo: 'Deshacer accidente', okTxt: 'Sí, restaurar' })) return;
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

function adState() {
  let st = null;
  try { st = JSON.parse(localStorage.getItem(ADMIN_KEY)); } catch (_) {}
  if (st && st.v === 2 && Array.isArray(st.grupos) && st.grupos.length) {
    st.grupos.forEach(adNormGrupo);
    if (!st.grupos.some(g => g.id === st.activo)) st.activo = st.grupos[0].id;
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
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(nuevo)); } catch (_) {}
  return nuevo;
}
function adStateSave(st) {
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(st)); } catch (_) {}
  adSyncProgramar();   /* la nube del chatbot se actualiza sola, con calma */
}

function adLoad() {
  const st = adState();
  return st.grupos.find(g => g.id === st.activo) || st.grupos[0];
}
function adSave(d) {
  const st = adState();
  const i = st.grupos.findIndex(x => x.id === d.id);
  if (i >= 0) st.grupos[i] = d; else st.grupos.push(adNormGrupo(d));
  adStateSave(st);
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
function adGrupoTxt(d) {
  const gs = [(d.grado || '').trim(), (d.seccion || '').trim()].filter(Boolean).join(' ');
  return gs + (d.escuela ? (gs ? ' · ' : '') + String(d.escuela).trim() : '');
}
function adGrupoChipTxt(g) {
  const gs = [(g.grado || '').trim(), (g.seccion || '').trim()].filter(Boolean).join(' ');
  return gs || 'Nuevo grupo';
}

/* ── RENDER PRINCIPAL ── */
function renderAdmin() {
  const cont = document.getElementById('admin-content');
  if (!cont) return;
  /* recordar dónde está el docente para restaurarlo al recargar */
  if (window.metasSaveNav) window.metasSaveNav({ view: 'view-admin', adTab: _adTab, adColecta: _adColectaId });
  const st = adState();
  const d = st.grupos.find(g => g.id === st.activo) || st.grupos[0];
  /* Barra de grupos: el maestro puede tener varios (incluso en dos
     colegios); todo lo de abajo (lista, economía, asistencia, notas)
     es DEL GRUPO ACTIVO. */
  const chips = st.grupos.map(g => `
    <button class="ad-gr-chip ${g.id === st.activo ? 'ad-gr-on' : ''}" data-gid="${g.id}">
      <span class="ad-gr-gs">${adEsc(adGrupoChipTxt(g))}</span>
      ${g.escuela ? `<span class="ad-gr-esc">${adEsc(g.escuela)}</span>` : ''}
    </button>`).join('');
  cont.innerHTML = `
    <div class="ad-gr-bar">
      ${chips}
      <button class="ad-gr-chip ad-gr-add" id="ad-gr-add" title="Agregar otro grado o colegio">➕ Otro grupo</button>
    </div>
    <div class="pa-tabs-out ad-tabs">
      <button class="pa-otab ${_adTab === 'lista' ? 'pa-otab-active' : ''}" data-adtab="lista">👥 Alumnos</button>
      <button class="pa-otab ${_adTab === 'eco'   ? 'pa-otab-active' : ''}" data-adtab="eco">💰 Economía</button>
      <button class="pa-otab ${_adTab === 'asis'  ? 'pa-otab-active' : ''}" data-adtab="asis">📋 Asistencia</button>
      <button class="pa-otab ${_adTab === 'sace'  ? 'pa-otab-active' : ''}" data-adtab="sace">🧮 Notas SACE</button>
      <button class="pa-otab ${_adTab === 'com'   ? 'pa-otab-active' : ''}" data-adtab="com">📣 Comunicados</button>
      <button class="pa-otab" id="ad-nube-chip" title="Nube del chatbot de padres — toca para sincronizar ahora">${(() => {
        const n = adPendientesTotal();
        return n ? '⏳ ' + n + ' por subir' : '☁️ al día';
      })()}</button>
    </div>
    <div id="ad-tab-body"></div>`;
  cont.querySelectorAll('[data-gid]').forEach(b =>
    b.addEventListener('click', () => {
      const s2 = adState(); s2.activo = b.dataset.gid; adStateSave(s2);
      _adColectaId = null; renderAdmin();
    }));
  document.getElementById('ad-gr-add').addEventListener('click', async () => {
    if (!await metasConfirm('Un grupo nuevo tiene su PROPIA lista de alumnos, claves de familia, economía, asistencia y notas.\n\nÚsalo si atiendes **otro grado/sección** o trabajas en **otro colegio**. ¿Crear el grupo?',
      { icono: '🏫', titulo: 'Otro grupo', okTxt: 'Sí, crear' })) return;
    const s2 = adState();
    const g = adGrupoNuevo();
    s2.grupos.push(g); s2.activo = g.id; adStateSave(s2);
    _adTab = 'lista'; renderAdmin();
    toast('🏫 Grupo nuevo: escribe su grado, sección y colegio');
  });
  cont.querySelectorAll('[data-adtab]').forEach(b =>
    b.addEventListener('click', () => { _adTab = b.dataset.adtab; _adColectaId = null; renderAdmin(); }));
  /* chip de nube: visible en TODAS las pestañas (antes solo en Alumnos
     se sabía si lo publicado ya subió); tocarlo sincroniza ya */
  document.getElementById('ad-nube-chip').addEventListener('click', async () => {
    await adSincronizarNube(true);
    const chip = document.getElementById('ad-nube-chip');
    if (chip) { const n = adPendientesTotal(); chip.textContent = n ? '⏳ ' + n + ' por subir' : '☁️ al día'; }
  });
  const body = document.getElementById('ad-tab-body');
  if (_adTab === 'lista') adRenderLista(body, d);
  else if (_adTab === 'eco') adRenderEco(body, d);
  else if (_adTab === 'asis') adRenderAsis(body, d);
  else if (_adTab === 'com') adRenderCom(body, d);
  else adRenderSace(body, d);
}

/* ══════════════ 👥 ALUMNOS (el corazón: alimenta TODO) ══════════════ */
function adRenderLista(body, d) {
  const puedeBorrarGrupo = adState().grupos.length > 1;
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">🏫 Mi grupo</div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Grado</label>
          <input id="ad-grado" class="pa-inp-field" value="${adEsc(d.grado)}" placeholder="ej: 6º"></div>
        <div class="pa-field"><label>Sección</label>
          <input id="ad-seccion" class="pa-inp-field" value="${adEsc(d.seccion)}" placeholder="ej: A"></div>
      </div>
      <div class="pa-field"><label>Colegio / escuela</label>
        <input id="ad-escuela" class="pa-inp-field" value="${adEsc(d.escuela)}"
               placeholder="ej: Esc. Francisco Morazán (útil si trabajas en dos)"></div>
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
      <div id="ad-lista-rows">
        ${d.lista.map(a => {
          const cl = adClaveFamilia(d.id, a.num, false);
          return `
          <div class="ad-al-row" data-num="${a.num}">
            <span class="ad-al-num">#${a.num}</span>
            <input class="pa-inp-field ad-al-nombre" value="${adEsc(a.nombre)}" placeholder="Nombre (opcional)">
            <button class="ad-al-code" data-cnum="${a.num}" title="Clave de familia — tócala para editar o imprimir">
              🔑 ${cl ? adEsc(adClaveBonita(cl, a.num)) : 'crear'}</button>
            <button class="ad-al-del" aria-label="Quitar">✕</button>
          </div>`; }).join('')}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-add-al">➕ Agregar al final</button>
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
    </div>

    <div class="pa-card">
      <div class="pa-card-title">☁️ Nube del chatbot de padres</div>
      <p class="pa-optional-hint">La asistencia, las notas finales y las colaboraciones suben con la
        <strong>clave de familia</strong> de cada alumno para que el asistente les responda a los padres.
        Sube solo lo que cambia; sin internet, espera y reintenta.</p>
      <button class="pa-generate-btn ad-btn-sec" id="ad-sb-sync">☁️ Sincronizar ahora</button>
      <p class="pa-optional-hint" id="ad-sb-status" style="margin-top:8px"></p>
    </div>

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

    ${adUndoLista().length ? `
    <div class="pa-card">
      <div class="pa-card-title">🕘 Deshacer un accidente</div>
      <p class="pa-optional-hint">Antes de cada borrado se guarda una foto de Mi aula. Si quitaste un
        alumno, una colecta o una clave <strong>por error</strong>, restaura aquí (lo cambiado
        después de esa foto se pierde).</p>
      ${adUndoLista().map((f, i) => `
        <div class="ad-gasto-row" style="align-items:center">
          <span style="flex:1"><strong>Antes de: ${adEsc(f.e)}</strong><br>
            <small>${adFechaBonita(String(f.t).slice(0, 10))} · ${String(f.t).slice(11, 16)}</small></span>
          <button class="pa-generate-btn ad-btn-sec ad-undo-btn" data-ui="${i}">↩️ Restaurar</button>
        </div>`).reverse().join('')}
    </div>` : ''}`;

  const persist = () => {
    const dd = adLoad();
    dd.grado = document.getElementById('ad-grado').value;
    dd.seccion = document.getElementById('ad-seccion').value;
    dd.escuela = document.getElementById('ad-escuela').value.trim();
    const mats = document.getElementById('ad-materias').value.split(',').map(s => s.trim()).filter(Boolean);
    if (mats.length) dd.materias = mats;
    dd.lista = [...body.querySelectorAll('.ad-al-row')].map(r => ({
      num: +r.dataset.num,
      nombre: r.querySelector('.ad-al-nombre').value.trim(),
    }));
    adSave(dd);
  };
  ['ad-grado', 'ad-seccion', 'ad-escuela', 'ad-materias'].forEach(id =>
    document.getElementById(id).addEventListener('input', persist));
  /* al salir del campo grado/sección/colegio, refresca la barra de grupos */
  ['ad-grado', 'ad-seccion', 'ad-escuela'].forEach(id =>
    document.getElementById(id).addEventListener('change', () => renderAdmin()));
  body.querySelectorAll('.ad-al-nombre').forEach(i => i.addEventListener('input', persist));
  body.querySelectorAll('.ad-al-code').forEach(b =>
    b.addEventListener('click', () => adEditarClave(+b.dataset.cnum)));
  body.querySelectorAll('.ad-al-del').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Quitar a este alumno de la lista?\nSus pagos, asistencias y notas guardadas no se borran.', { icono: '👥', titulo: 'Lista de alumnos', okTxt: 'Sí, quitar' })) return;
      const fila = b.closest('.ad-al-row');
      adUndoGuardar('Quitar alumno #' + fila.dataset.num);
      fila.remove();
      persist(); renderAdmin();
      toast('👥 Alumno quitado — si fue un error, restaura en 🕘');
    }));
  document.getElementById('ad-add-al').addEventListener('click', () => {
    const dd = adLoad();
    const sig = dd.lista.length ? Math.max(...dd.lista.map(a => a.num)) + 1 : 1;
    dd.lista.push({ num: sig, nombre: '' });
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
  document.getElementById('ad-sb-sync').addEventListener('click', () => adSincronizarNube(true));
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
    dd.lista = ana.students.map(s => ({
      num: +s.num, nombre: String(s.nombre || '').startsWith('#') ? '' : (s.nombre || ''),
    }));
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
    dd.lista.push({ num, nombre: p.nombre });
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
  const w = window.open('', '_blank');
  if (!w) { toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
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
  d.colectas.forEach(c => { c.pagos = adShiftNums(c.pagos, pos); });
  /* 3) la lista misma */
  d.lista.forEach(a => { if (a.num >= pos) a.num++; });
  d.lista.push({ num: pos, nombre: String(nombre).trim() });
  d.lista.sort((a, b) => a.num - b.num);
  adSave(d);
  renderAdmin();
  toast('🧑‍🎓 ' + String(nombre).trim() + ' es el #' + pos);
  /* 4) su tira de clave de familia, lista para entregar */
  if (await metasConfirm('¿Imprimir ahora la **tira con la clave de familia** del alumno nuevo?', { icono: '🔑', titulo: 'Alumno nuevo', okTxt: 'Sí, imprimir' })) {
    adTiraUno(adLoad(), pos);
  }
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
  const w = window.open('', '_blank');
  if (!w) { toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
}

function adSinLista(body, quePara) {
  body.innerHTML = `
    <div class="pa-card">
      <p class="pa-optional-hint" style="margin:0">Primero arma tu <strong>👥 Lista</strong> de alumnos
      (o tráela del Plan de Acción) para usar ${quePara}.</p>
    </div>`;
}

/* ══════════════ 💰 ECONOMÍA — colaboraciones y acuerdos ══════════════ */
function adColecta(d, id) { return d.colectas.find(c => c.id === id); }
function adColectaTotales(c) {
  const rec = Object.values(c.pagos || {}).reduce((s, m) => s + (Number(m) || 0), 0);
  const gas = (c.gastos || []).reduce((s, g) => s + (Number(g.m) || 0), 0);
  return { rec, gas, saldo: rec - gas };
}

function adRenderEco(body, d) {
  if (!d.lista.length) { adSinLista(body, 'el registro económico'); return; }
  if (_adColectaId) { adRenderColecta(body, d); return; }

  body.innerHTML = `
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
      ${d.colectas.slice().reverse().map(c => {
        const t = adColectaTotales(c);
        const pagaron = Object.keys(c.pagos || {}).length;
        return `
        <button class="ad-colecta-row" data-cid="${c.id}">
          <span class="ad-cr-txt"><strong>${adEsc(c.concepto)}</strong><br>
            <small>${adFechaBonita(c.fecha)} · ${pagaron}/${d.lista.length} dieron · saldo ${adLps(t.saldo)}</small></span>
          <span class="ad-cr-arrow">›</span>
        </button>`;
      }).join('')}
    </div>` : ''}`;

  document.getElementById('ad-nueva-colecta').addEventListener('click', async () => {
    const concepto = await metasPrompt('¿Cuál es el acuerdo o colaboración?\n(ej: **Aporte día del niño**, acordado en reunión)', {
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
    dd.colectas.push({
      id: 'C' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      concepto: String(concepto).trim(),
      montoAlumno: Number(String(monto).replace(',', '.')),
      fecha: adHoy(), pagos: {}, gastos: [],
    });
    adSave(dd);
    _adColectaId = dd.colectas[dd.colectas.length - 1].id;
    renderAdmin();
  });
  body.querySelectorAll('.ad-colecta-row').forEach(b =>
    b.addEventListener('click', () => { _adColectaId = b.dataset.cid; renderAdmin(); }));
}

function adRenderColecta(body, d) {
  const c = adColecta(d, _adColectaId);
  if (!c) { _adColectaId = null; renderAdmin(); return; }
  const t = adColectaTotales(c);
  const pagaron = Object.keys(c.pagos || {}).length;

  body.innerHTML = `
    <div class="pa-card">
      <button class="ad-volver" id="ad-eco-volver">← Todas las colectas</button>
      <div class="pa-card-title">💰 ${adEsc(c.concepto)}</div>
      <p class="pa-optional-hint">${adFechaBonita(c.fecha)} · aporte sugerido: <strong>${adLps(c.montoAlumno)}</strong><br>
        <strong>Toca</strong> un alumno para marcar que dio el aporte sugerido.
        <strong>Toca de nuevo</strong> a quien pagó para <strong>cambiar su monto</strong>
        (hermanos, becados, abonos) o quitarlo. Lo marcado = dinero en mano.</p>
      <div class="ad-resumen">
        <span>✅ Dieron: <strong>${pagaron}/${d.lista.length}</strong></span>
        <span>💵 Recaudado: <strong>${adLps(t.rec)}</strong></span>
        <span>🧾 Gastado: <strong>${adLps(t.gas)}</strong></span>
        <span class="${t.saldo >= 0 ? 'ad-ok' : 'ad-mal'}">💼 Saldo: <strong>${adLps(t.saldo)}</strong></span>
      </div>
      <div class="ad-chips">
        ${d.lista.map(a => {
          const pagado = c.pagos && c.pagos[a.num] != null;
          const nom = adPrimerNombre(a.nombre);
          const especial = pagado && Number(c.pagos[a.num]) !== Number(c.montoAlumno);
          return `<button class="ad-chip ${pagado ? 'ad-chip-on' : ''}" data-num="${a.num}"
            title="${adEsc(a.nombre)}">
            <span class="ad-chip-num">#${a.num}${pagado ? ' ✓' : ''}</span>
            ${nom ? `<span class="ad-chip-nom">${adEsc(nom)}</span>` : ''}
            ${pagado ? `<span class="ad-chip-monto${especial ? ' ad-chip-monto-esp' : ''}">${adLps(c.pagos[a.num])}</span>` : ''}</button>`;
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
        if (!(n > 0)) delete cc.pagos[num];
        else cc.pagos[num] = n;
      } else {
        cc.pagos[num] = cc.montoAlumno;   // aporte sugerido (marca rápida)
      }
      adSave(dd); renderAdmin();
    }));

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
.tot{display:flex;gap:8mm;margin:4mm 0;font-size:13px;font-weight:bold;}
.firmas{display:flex;gap:14mm;margin-top:14mm;}
.firma{flex:1;border-top:1.5px solid #333;text-align:center;padding-top:2mm;font-size:11px;}
.noprint{margin-bottom:5mm;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()" style="padding:8px 16px;font-weight:bold;cursor:pointer;">🖨️ Imprimir</button></div>
<h1>💰 Informe económico — ${adEsc(c.concepto)}</h1>
<div class="sub">${grupo ? 'Grupo ' + adEsc(grupo) + ' · ' : ''}Acordado el ${adFechaBonita(c.fecha)} ·
Aporte sugerido: ${adLps(c.montoAlumno)} (cada aporte real se detalla abajo) · Generado con M.E.T.A.S el ${adFechaBonita(adHoy())}</div>
<table>
<thead><tr><th>#</th><th>Alumno/a</th><th>Aportó</th><th>Monto</th></tr></thead>
<tbody>
${d.lista.map(a => {
  const m = c.pagos && c.pagos[a.num];
  return `<tr><td>${a.num}</td><td>${adEsc(a.nombre) || '—'}</td><td>${m != null ? '✔ Sí' : '—'}</td><td>${m != null ? adLps(m) : ''}</td></tr>`;
}).join('')}
</tbody></table>
${(c.gastos || []).length ? `
<table><thead><tr><th>Fecha</th><th>Gasto</th><th>Monto</th></tr></thead><tbody>
${c.gastos.map(g => `<tr><td>${adFechaBonita(g.f)}</td><td>${adEsc(g.d)}</td><td>${adLps(g.m)}</td></tr>`).join('')}
</tbody></table>` : ''}
<div class="tot">
  <span>💵 Recaudado: ${adLps(t.rec)}</span>
  <span>🧾 Gastado: ${adLps(t.gas)}</span>
  <span>💼 Saldo: ${adLps(t.saldo)}</span>
</div>
<div class="firmas">
  <div class="firma">Docente</div>
  <div class="firma">Padre/Madre de familia (testigo)</div>
  <div class="firma">Dirección</div>
</div>
</body></html>`;
  const w = window.open('', '_blank');
  if (!w) { toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
}

/* ══════════════ 📋 ASISTENCIA — solo lo excepcional ══════════════ */
const AD_MESES_ES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
  'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
/* 'YYYY-MM' → 'jul. 2026' */
function adMesLabel(m) {
  const p = String(m || '').split('-');
  return (AD_MESES_ES[(+p[1]) - 1] || m) + ' ' + (p[0] || '');
}

function adRenderAsis(body, d) {
  if (!d.lista.length) { adSinLista(body, 'el pase de lista'); return; }
  const hoy = adHoy();
  const fechaSel = body.dataset.fecha || hoy;
  const reg = d.asistencia.find(r => r.f === fechaSel) || { f: fechaSel, aus: {} };

  /* resumen navegable por meses: los que tienen datos + el mes actual */
  const mesSel = body.dataset.mes || fechaSel.slice(0, 7);
  const mesesDisp = [...new Set(
    d.asistencia.map(r => r.f.slice(0, 7)).concat([hoy.slice(0, 7), mesSel])
  )].filter(Boolean).sort().reverse();
  const delMes = d.asistencia.filter(r => r.f.startsWith(mesSel));
  const resumen = {};
  delMes.forEach(r => Object.keys(r.aus || {}).forEach(n => {
    resumen[n] = resumen[n] || { A: 0, E: 0 };
    resumen[n][r.aus[n]] = (resumen[n][r.aus[n]] || 0) + 1;
  }));

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
      <div class="pa-card-title">📊 Ausencias por mes</div>
      <p class="pa-optional-hint" style="margin-top:-2px">Toca un mes para ver quién faltó. Aparecen los meses con registro y el mes actual.</p>
      <div class="ad-meses">
        ${mesesDisp.map(m => `<button class="ad-mes-btn ${m === mesSel ? 'ad-mes-on' : ''}" data-mes="${m}">${adMesLabel(m)}</button>`).join('')}
      </div>
      ${Object.keys(resumen).length ? `
      <table class="ad-tabla">
        <thead><tr><th>#</th><th>Alumno/a</th><th>🚫 Ausencias</th><th>📝 Excusas</th></tr></thead>
        <tbody>
        ${d.lista.filter(a => resumen[a.num]).map(a => `
          <tr><td>#${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
          <td>${resumen[a.num].A || 0}</td><td>${resumen[a.num].E || 0}</td></tr>`).join('')}
        </tbody>
      </table>
      <button class="pa-generate-btn ad-btn-sec" id="ad-asis-print">🖨️ Imprimir resumen (${adMesLabel(mesSel)})</button>`
      : `<p class="pa-optional-hint">Sin ausencias registradas en <strong>${adMesLabel(mesSel)}</strong>. 🎉</p>`}
    </div>`;

  document.getElementById('ad-asis-fecha').addEventListener('change', e => {
    const f = e.target.value || hoy;
    body.dataset.fecha = f;
    body.dataset.mes = f.slice(0, 7);   // el resumen sigue al mes de la fecha elegida
    adRenderAsis(body, adLoad());
  });

  body.querySelectorAll('.ad-mes-btn').forEach(b => b.addEventListener('click', () => {
    body.dataset.mes = b.dataset.mes;
    adRenderAsis(body, adLoad());
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
  const w = window.open('', '_blank');
  if (!w) { toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
}

/* ══════════════ 🧮 BOLETA DE CALIFICACIONES (SACE) ══════════════ */
function adRenderSace(body, d) {
  if (!d.lista.length) { adSinLista(body, 'la boleta'); return; }
  const parcial = body.dataset.parcial || 'I';
  const vista = body.dataset.vista || 'aprov';   // aprov | pers | inasis
  const esLetra = vista === 'pers';
  const esInasis = vista === 'inasis';
  const cols = esLetra ? AD_PERSONALIDAD.slice() : esInasis ? ['Inasistencias'] : d.materias.slice();
  const valOf = (c, num) => { const v = (((d.notas[parcial] || {})[c]) || {})[num]; return (v == null || v === '') ? '' : v; };
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
                <span style="font-size:11px;font-weight:800;color:#1e3a7c;">Logo del centro</span>
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
                <span style="font-size:11px;font-weight:800;color:#1e3a7c;">Logo de la Secretaría${d.logoSec ? '' : ' <small style="font-weight:600;color:#7286a8;">(oficial, ya incluido)</small>'}</span>
                <label class="pa-generate-btn ad-btn-sec ad-logo-lbl">🏛️ Subir
                  <input type="file" id="ad-logosec-file" accept="image/*" style="display:none;"></label>
                ${d.logoSec ? '<button class="pa-generate-btn ad-btn-sec" id="ad-logosec-quitar">Quitar</button>' : ''}
              </div>
            </div>
          </div>
          <div class="pa-field"><label>Nombre del centro educativo</label>
            <input id="ad-boleta-centro" class="pa-inp-field" value="${adEsc(d.escuela)}"
                   placeholder="Ej: John Arnold Cook"></div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Nombre del director(a)</label>
              <input id="ad-bol-director" class="pa-inp-field" value="${adEsc(d.boleta.director)}" placeholder="Director(a)"></div>
            <div class="pa-field"><label>Docente de grado</label>
              <input id="ad-bol-docente" class="pa-inp-field" value="${adEsc(d.boleta.docente)}" placeholder="Tu nombre"></div>
          </div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Lugar (aldea/colonia)</label>
              <input id="ad-bol-lugar" class="pa-inp-field" value="${adEsc(d.boleta.lugar)}" placeholder="Ej: Col. Colinas de Suiza"></div>
            <div class="pa-field"><label>Municipio</label>
              <input id="ad-bol-municipio" class="pa-inp-field" value="${adEsc(d.boleta.municipio)}" placeholder="Ej: Villanueva"></div>
          </div>
          <div class="pa-row-2">
            <div class="pa-field"><label>Departamento</label>
              <input id="ad-bol-depto" class="pa-inp-field" value="${adEsc(d.boleta.departamento)}" placeholder="Ej: Cortés"></div>
            <div class="pa-field"><label>Año lectivo</label>
              <input id="ad-bol-anio" class="pa-inp-field" inputmode="numeric" maxlength="4" value="${adEsc(d.boleta.anio)}" placeholder="${new Date().getFullYear()}"></div>
          </div>
          <p class="pa-optional-hint">El logo, el nombre y estos datos salen en la boleta impresa (frente y
            <strong>reverso oficial</strong>). Se guardan y sincronizan con tus equipos. El grado y la sección
            se toman de la pestaña <strong>Alumnos</strong>.</p>
        </div>
      </details>

      <p class="pa-optional-hint">Elige el <strong>parcial</strong> y llena cada alumno <strong>a lo ancho</strong>,
        en el orden de la boleta: al escribir una nota, el cursor <strong>salta solo</strong> a la siguiente
        materia y, al terminar la fila, baja al siguiente alumno. Las notas van a <strong>SACE</strong> y a la <strong>boleta</strong>.</p>
      <div class="pa-row-2">
        <div class="pa-field"><label>Parcial</label>
          <select id="ad-sace-parcial" class="pa-inp-field">
            ${['I', 'II', 'III', 'IV'].map(p => `<option value="${p}" ${p === parcial ? 'selected' : ''}>Parcial ${p}</option>`).join('')}
          </select></div>
        <div class="pa-field"><label>Sección a llenar</label>
          <select id="ad-sace-vista" class="pa-inp-field">
            <option value="aprov" ${vista === 'aprov' ? 'selected' : ''}>📚 Aprovechamiento (todas las materias)</option>
            <option value="pers" ${vista === 'pers' ? 'selected' : ''}>🙂 Personalidad (en letra)</option>
            <option value="inasis" ${vista === 'inasis' ? 'selected' : ''}>📅 Inasistencias</option>
          </select></div>
      </div>
      <p class="pa-optional-hint" style="margin-top:2px">
        ${esLetra
          ? 'La conducta es <strong>cualitativa</strong>: <strong>escríbela</strong> (S, MB, B) o toca la celda y luego el <strong>valor</strong> — se llena y avanza solo.'
          : esInasis
            ? 'Escribe el <strong>número de inasistencias</strong>. Enter o «Siguiente» para bajar.'
            : 'Escribe la <strong>nota (1-100)</strong>. Las de 2+ cifras saltan solas; con Enter también. Desliza la tabla → para ver todas las materias.'}</p>

      ${esLetra ? `
      <div class="ad-pers-kp">
        <span class="ad-pers-kp-lbl">Valor:</span>
        ${d.boleta.escalaPers.map(v => `<button class="ad-pers-val" data-v="${adEsc(v)}">${adEsc(v)}</button>`).join('')}
        <button class="ad-pers-val ad-pers-borrar" data-v="">✕</button>
        <button class="ad-pers-edit" id="ad-pers-editescala">✏️ Editar escala</button>
      </div>
      <p class="ad-pers-leyenda">${d.boleta.escalaPers.map(v => AD_PERS_SIGNIF[v]
        ? '<b>' + adEsc(v) + '</b> = ' + adEsc(AD_PERS_SIGNIF[v]) : '<b>' + adEsc(v) + '</b>').join(' · ')}</p>` : ''}

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

      <div class="ad-mx-wrap">
        <table class="ad-mx">
          <thead><tr>
            <th class="ad-mx-sticky ad-mx-corner">Nº · Alumno</th>
            ${cols.map((c, ci) => `<th><div class="ad-mx-h">${adEsc(c)}</div>
              <div class="ad-mx-hbtns">
                ${(!esLetra && !esInasis) ? `<button class="ad-mx-mv" data-col="${ci}" data-dir="-1" title="Mover a la izquierda"${ci === 0 ? ' disabled' : ''}>◀</button>` : ''}
                <button class="ad-mx-copy" data-col="${ci}" title="Copiar «${adEsc(c)}» para SACE">📋</button>
                ${(!esLetra && !esInasis) ? `<button class="ad-mx-mv" data-col="${ci}" data-dir="1" title="Mover a la derecha"${ci === cols.length - 1 ? ' disabled' : ''}>▶</button>` : ''}
              </div></th>`).join('')}
          </tr></thead>
          <tbody>
            ${d.lista.map((a, ri) => `<tr>
              <td class="ad-mx-sticky" title="${adEsc(a.nombre)}"><b>#${a.num}</b> <span class="ad-mx-nom">${adEsc(adPrimerNombre(a.nombre)) || '—'}</span></td>
              ${cols.map((c, ci) => `<td><input class="ad-mx-inp" data-idx="${ri * cols.length + ci}"
                data-num="${a.num}" data-campo="${adEsc(c)}" type="text" inputmode="${esLetra ? 'text' : 'numeric'}"
                maxlength="3" autocapitalize="characters" ${esLetra ? 'style="text-transform:uppercase;"' : ''}
                value="${valOf(c, a.num) !== '' ? adEsc(String(valOf(c, a.num))) : ''}" placeholder="·"></td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${!esLetra && !esInasis ? '<button class="pa-generate-btn ad-btn-sec ad-mx-addmat" id="ad-sace-addmat">➕ Agregar materia</button>' : ''}
      <div class="ad-btn-row" style="margin-top:8px">
        <button class="pa-generate-btn" id="ad-sace-boletas">🧾 Imprimir boletas (todas)</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-csv">⬇ Copiar CSV (todas las materias)</button>
      </div>
      <p class="pa-optional-hint" id="ad-sace-estado" style="margin-top:8px"></p>
    </div>`;

  const setSel = (k, v) => { body.dataset[k] = v; adRenderSace(body, adLoad()); };
  document.getElementById('ad-sace-parcial').addEventListener('change', e => setSel('parcial', e.target.value));
  document.getElementById('ad-sace-vista').addEventListener('change', e => setSel('vista', e.target.value));
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
  const ncols = cols.length;
  const focar = i => {
    if (i >= 0 && i < inputs.length) {
      inputs[i].focus(); inputs[i].select();
      try { inputs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) {}
    }
  };
  const guardar = inp => {
    const dd = adLoad();
    const campo = inp.dataset.campo;
    dd.notas[parcial] = dd.notas[parcial] || {};
    dd.notas[parcial][campo] = dd.notas[parcial][campo] || {};
    let raw = inp.value.trim();
    if (esLetra) {
      raw = raw.toUpperCase().replace(/[^A-ZÑ+]/g, '').slice(0, 3);
      inp.value = raw;
      if (raw === '') delete dd.notas[parcial][campo][inp.dataset.num];
      else dd.notas[parcial][campo][inp.dataset.num] = raw;
    } else {
      raw = raw.replace(/\D/g, '').slice(0, 3);
      inp.value = raw;
      if (raw === '') { delete dd.notas[parcial][campo][inp.dataset.num]; }
      else {
        let v = Math.round(Number(raw));
        v = esInasis ? Math.max(0, Math.min(999, v)) : Math.max(1, Math.min(100, v));
        dd.notas[parcial][campo][inp.dataset.num] = v;
      }
    }
    adSave(dd);
  };
  // Celda activa (para el teclado cualitativo de personalidad)
  let _activoIdx = 0;
  const marcarActivo = i => { inputs.forEach(x => x.classList.remove('ad-mx-activo')); if (inputs[i]) inputs[i].classList.add('ad-mx-activo'); };
  let _letraT = null;
  inputs.forEach(inp => {
    const idx = +inp.dataset.idx;
    inp.addEventListener('focus', () => { _activoIdx = idx; marcarActivo(idx); });
    inp.addEventListener('input', () => {
      guardar(inp);
      const v = inp.value;
      if (esLetra) {
        clearTimeout(_letraT);
        _letraT = setTimeout(() => { if (document.activeElement === inp) focar(idx + 1); }, 550);
      } else if (!esInasis) {
        // nota 1-100: salta cuando ya no puede crecer (3 cifras o 2 cifras > 10)
        if (v.length >= 3 || (v.length === 2 && Number(v) > 10)) focar(idx + 1);
      }
    });
    inp.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === 'ArrowRight') { ev.preventDefault(); focar(idx + 1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); focar(idx - 1); }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); focar(idx + ncols); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); focar(idx - ncols); }
    });
  });

  // ── Teclado cualitativo de PERSONALIDAD ──
  if (esLetra) {
    marcarActivo(0);
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
  }

  document.getElementById('ad-sace-boletas').addEventListener('click', () => adPrintBoletas(adLoad()));

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
      if (c > 0) { dd.notas[parcial]['Inasistencias'][a.num] = c; total += c; conFaltas++; }
      else delete dd.notas[parcial]['Inasistencias'][a.num];
    });
    adSave(dd); adRenderSace(body, adLoad());
    if (typeof toast === 'function') toast('📅 Parcial ' + parcial + ': ' + total + ' faltas (' + conFaltas + ' alumnos)');
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

  // Copiar UNA columna (materia/rasgo) para SACE — botón 📋 en su cabecera
  body.querySelectorAll('.ad-mx-copy').forEach(btn => btn.addEventListener('click', () => {
    const dd = adLoad();
    const c = cols[+btn.dataset.col];
    const ns = ((dd.notas[parcial] || {})[c]) || {};
    const col = dd.lista.map(a => ns[a.num] != null ? ns[a.num] : '').join('\n');
    adCopiar(col,
      () => estado('✅ Columna «' + c + '» copiada (' + dd.lista.length + ' filas, orden de lista). Pégala en SACE.'),
      () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
  }));

  document.getElementById('ad-sace-csv').addEventListener('click', () => {
    const dd = adLoad();
    const cs = esLetra ? AD_PERSONALIDAD.slice() : esInasis ? ['Inasistencias'] : dd.materias.slice();
    const cab = ['numero_lista', 'alumno'].concat(cs.map(c => '"' + c + '"')).join(',');
    const filas = dd.lista.map(a => {
      const base = [a.num, '"' + String(a.nombre || '').replace(/"/g, '""') + '"'];
      const vals = cs.map(c => { const v = (((dd.notas[parcial] || {})[c]) || {})[a.num]; return v != null ? v : ''; });
      return base.concat(vals).join(',');
    });
    adCopiar(cab + '\n' + filas.join('\n'),
      () => estado('✅ CSV del Parcial ' + parcial + ' copiado (todas las columnas). Pégalo en una hoja de cálculo.'),
      () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
  });
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
    partes.push(`Además viene mejorando: pasó de ${c.tendencia.ini.prom} a ${c.tendencia.fin.prom} entre parciales — ese rumbo es el correcto.`);
  }
  if (c.mejoraMax) {
    partes.push(`Su mayor avance de este parcial fue en ${c.mejoraMax.mat}: de ${c.mejoraMax.de} a ${c.mejoraMax.a} (+${c.mejoraMax.d}) — reconózcalo, eso consolida el hábito.`);
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
    causas.push(`la mayor caída fue en ${c.caidaMax.mat} (de ${c.caidaMax.de} a ${c.caidaMax.a}): pregunte al docente qué cambió en esa asignatura`);
  }
  if (c.tendencia && c.tendencia.tipo === 'baja') {
    causas.push(`el promedio general bajó de ${c.tendencia.ini.prom} (parcial ${c.tendencia.ini.p}) a ${c.tendencia.fin.prom} (parcial ${c.tendencia.fin.p}) — conviene retomar la rutina que funcionaba`);
  }
  if (causas.length) {
    partes.push(`Los datos del aula señalan por dónde empezar: ${causas.slice(0, 3).join('; ')}.`);
  } else if (peores.length && (c.inasis || 0) === 0) {
    partes.push(`Sin faltas ni observaciones de conducta, el reto es de práctica: más ejercicios guiados harán la diferencia.`);
  }

  // 3) Acción sobre lo bajo, con la etiqueta oficial de la nota
  if (peores.length) {
    const et = adNotaCat(c.minV).label;
    if (Number(c.minV) < 60) {
      partes.push(`En ${adNombresMats(peores)} (${c.minV} · «${et}») se necesita refuerzo urgente: coordine con el docente un plan de recuperación esta misma semana.`);
    } else {
      partes.push(`En ${adNombresMats(peores)} (${c.minV} · «${et}») acompáñele con 15–20 minutos de repaso diario y consulte al docente cómo apoyar desde casa.`);
    }
  }

  if (!partes.length) partes.push('Mantenga una rutina de estudio en casa y comunicación cercana con el centro educativo.');
  if (partes.join(' ').length < 320) partes.push('Una lectura compartida cada día y el descanso adecuado potencian todo el aprendizaje.');
  return partes.join(' ');
}

/* Gráfico de barras horizontales (SVG: los fill SÍ imprimen, a diferencia de
   los fondos CSS). Verde = materia más alta, ámbar = más baja, azul = resto;
   línea roja punteada en 70 (nota de aprobación). */
function adBoletaGrafico(datos) {
  if (!datos.length) return '';
  const rowH = 18, gap = 4, padT = 6, padB = 12;
  const labelW = 104, barX = labelW + 4, W = 320;
  const barMax = W - barX - 26;
  const H = padT + datos.length * (rowH + gap) - gap + padB;
  const x70 = barX + barMax * 0.7;
  const gridBot = padT + datos.length * (rowH + gap) - gap;
  const bars = datos.map((it, i) => {
    const y = padT + i * (rowH + gap);
    const w = Math.max(2, barMax * (Math.min(100, Math.max(0, it.val)) / 100));
    // Cada barra con el color OFICIAL de su calificación (el mismo del
    // Plan de Acción): verde=Avanzado, cian=Muy Bueno, amarillo=
    // Satisfactorio, naranja=Debe Mejorar, rojo=Insatisfactorio.
    const color = adNotaCat(it.val).color;
    const lbl = it.mat.length > 17 ? it.mat.slice(0, 16) + '…' : it.mat;
    return `<text x="${labelW}" y="${(y + rowH * 0.72).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#334155">${adEsc(lbl)}</text>
      <rect x="${barX}" y="${y + 2}" width="${barMax}" height="${rowH - 4}" rx="2.5" fill="#eef2f7"/>
      <rect x="${barX}" y="${y + 2}" width="${w.toFixed(1)}" height="${rowH - 4}" rx="2.5" fill="${color}"/>
      <text x="${(barX + w + 3).toFixed(1)}" y="${(y + rowH * 0.72).toFixed(1)}" font-size="8.5" font-weight="bold" fill="${color}">${it.val}</text>`;
  }).join('');
  const leyenda = `<div class="bl-leyenda">${AD_NOTA_CATS.map(c =>
    `<span><i style="background:${c.color}"></i>${c.min > 0 ? c.min + '+' : '&lt;60'} ${c.label}</span>`).join('')}</div>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:340px;font-family:Arial,Helvetica,sans-serif">
    <line x1="${x70.toFixed(1)}" y1="${padT - 1}" x2="${x70.toFixed(1)}" y2="${gridBot}" stroke="#c0392b" stroke-width="0.8" stroke-dasharray="3 2"/>
    <text x="${x70.toFixed(1)}" y="${(H - 2).toFixed(1)}" text-anchor="middle" font-size="7" fill="#c0392b">70 · aprobación</text>
    ${bars}
  </svg>${leyenda}`;
}

/* Gráfico de EVOLUCIÓN (2+ parciales): la barra es la nota del ÚLTIMO
   parcial con su color oficial (el estado real de hoy — el promedio del
   año disimula las caídas), la marca | señala dónde estaba el parcial
   anterior, y a la derecha va el delta ▲/▼ por materia. */
function adBoletaGraficoEvo(filas) {
  if (!filas.length) return '';
  const rowH = 18, gap = 4, padT = 6, padB = 12;
  const labelW = 104, barX = labelW + 4, W = 320;
  const barMax = W - barX - 42;
  const H = padT + filas.length * (rowH + gap) - gap + padB;
  const x70 = barX + barMax * 0.7;
  const gridBot = padT + filas.length * (rowH + gap) - gap;
  const bars = filas.map((it, i) => {
    const y = padT + i * (rowH + gap);
    const w = Math.max(2, barMax * (Math.min(100, Math.max(0, it.val)) / 100));
    const xp = barX + barMax * (Math.min(100, Math.max(0, it.prev)) / 100);
    const color = adNotaCat(it.val).color;
    const d = it.val - it.prev;
    const dTxt = d > 0 ? '▲+' + d : (d < 0 ? '▼' + d : '· igual');
    const dCol = d > 0 ? '#16a34a' : (d < 0 ? '#dc2626' : '#7286a8');
    const lbl = it.mat.length > 17 ? it.mat.slice(0, 16) + '…' : it.mat;
    return `<text x="${labelW}" y="${(y + rowH * 0.72).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#334155">${adEsc(lbl)}</text>
      <rect x="${barX}" y="${y + 2}" width="${barMax}" height="${rowH - 4}" rx="2.5" fill="#eef2f7"/>
      <rect x="${barX}" y="${y + 2}" width="${w.toFixed(1)}" height="${rowH - 4}" rx="2.5" fill="${color}"/>
      <rect x="${(xp - 0.7).toFixed(1)}" y="${y + 1}" width="1.4" height="${rowH - 2}" fill="#0f2350" opacity="0.6"/>
      <text x="${(barX + barMax + 3).toFixed(1)}" y="${(y + rowH * 0.52).toFixed(1)}" font-size="8.5" font-weight="bold" fill="${color}">${it.val}</text>
      <text x="${(barX + barMax + 3).toFixed(1)}" y="${(y + rowH * 0.98).toFixed(1)}" font-size="6.3" font-weight="bold" fill="${dCol}">${dTxt}</text>`;
  }).join('');
  const leyenda = `<div class="bl-leyenda">${AD_NOTA_CATS.map(c =>
    `<span><i style="background:${c.color}"></i>${c.min > 0 ? c.min + '+' : '&lt;60'} ${c.label}</span>`).join('')}<span><i style="background:#0f2350"></i>| parcial anterior</span></div>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:340px;font-family:Arial,Helvetica,sans-serif">
    <line x1="${x70.toFixed(1)}" y1="${padT - 1}" x2="${x70.toFixed(1)}" y2="${gridBot}" stroke="#c0392b" stroke-width="0.8" stroke-dasharray="3 2"/>
    <text x="${x70.toFixed(1)}" y="${(H - 2).toFixed(1)}" text-anchor="middle" font-size="7" fill="#c0392b">70 · aprobación</text>
    ${bars}
  </svg>${leyenda}`;
}

/* Imprime una BOLETA elegante por alumno: encabezado con dos logos (centro y
   Secretaría), tabla compacta de personalidad + aprovechamiento, gráfico de
   rendimiento, mensaje formal de motivación y consejo para la familia. */
function adPrintBoletas(d) {
  if (!d.lista || !d.lista.length) { if (typeof toast === 'function') toast('No hay alumnos'); return; }
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
    // Datos del gráfico: promedio anual por materia
    const datos = mats.map(c => ({ mat: c, val: promMat(c, a.num) }))
      .filter(x => x.val !== '' && !isNaN(Number(x.val)))
      .map(x => ({ mat: x.mat, val: Number(x.val) }));
    const promGen = datos.length ? Math.round(datos.reduce((s, x) => s + x.val, 0) / datos.length) : null;
    // EMPATES con honestidad: «la más alta» son TODAS las que comparten la
    // nota máxima; «a reforzar», todas las de la mínima. Si todas las
    // materias tienen la misma nota, no se corona ninguna.
    const maxV = datos.length ? Math.max.apply(null, datos.map(x => x.val)) : null;
    const minV = datos.length ? Math.min.apply(null, datos.map(x => x.val)) : null;
    const todasIguales = datos.length > 0 && maxV === minV;
    const mejores = datos.filter(x => x.val === maxV);
    const peores = todasIguales ? [] : datos.filter(x => x.val === minV);
    const inasis = sumInasis(a.num);

    // ── SEÑALES para el consejo (patrones reales del aula) ──
    // Tendencia: promedio general de cada parcial con datos; si entre el
    // primero y el último hay ±5 puntos, es un patrón que vale contar.
    const promsParc = parciales.map(p => {
      const xs = mats.map(cc => val(p, cc, a.num)).filter(x => x !== '' && !isNaN(Number(x))).map(Number);
      return xs.length ? { p, prom: Math.round(xs.reduce((s, x) => s + x, 0) / xs.length) } : null;
    }).filter(Boolean);
    let tendencia = null;
    if (promsParc.length >= 2) {
      const ini = promsParc[0], fin = promsParc[promsParc.length - 1];
      if (fin.prom <= ini.prom - 5) tendencia = { tipo: 'baja', ini, fin };
      else if (fin.prom >= ini.prom + 5) tendencia = { tipo: 'sube', ini, fin };
    }
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
    // Elogio anclado en las MATERIAS BÁSICAS: la(s) mejor(es) entre
    // Matemáticas/Español/CC.NN./CC.SS. Una no básica solo se suma si el
    // dato lo amerita: llega a 90+ o supera a la mejor básica por 8+.
    const basicas = datos.filter(x => adEsBasica(x.mat));
    const maxB = basicas.length ? Math.max.apply(null, basicas.map(x => x.val)) : null;
    const mejoresBas = basicas.filter(x => x.val === maxB);
    const extraDestacada = datos
      .filter(x => !adEsBasica(x.mat) && (x.val >= 90 || (maxB != null && x.val >= maxB + 8)))
      .sort((x, y) => y.val - x.val)[0] || null;
    // EVOLUCIÓN por materia (2+ parciales): último parcial vs el anterior.
    // Alimenta el gráfico de evolución, los chips y el consejo con la
    // mayor mejora y la mayor caída (umbral ±5 para no leer ruido).
    const valNum = (p, cc) => { const v = val(p, cc, a.num); return (v === '' || isNaN(Number(v))) ? null : Number(v); };
    const parcConDatos = parciales.filter(p => mats.some(cc => valNum(p, cc) != null));
    const pUlt = parcConDatos[parcConDatos.length - 1] || null;
    const pPrev = parcConDatos.length >= 2 ? parcConDatos[parcConDatos.length - 2] : null;
    const filasEvo = pPrev
      ? mats.map(cc => ({ mat: cc, prev: valNum(pPrev, cc), val: valNum(pUlt, cc) }))
          .filter(x => x.val != null && x.prev != null)
      : [];
    const evoOK = filasEvo.length >= 2;
    let mejoraMax = null, caidaMax = null;
    filasEvo.forEach(x => {
      const dd = x.val - x.prev;
      if (dd >= 5 && (!mejoraMax || dd > mejoraMax.d)) mejoraMax = { mat: x.mat, de: x.prev, a: x.val, d: dd };
      if (dd <= -5 && (!caidaMax || dd < caidaMax.d)) caidaMax = { mat: x.mat, de: x.prev, a: x.val, d: dd };
    });

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
        ${pers.map(() => '<td>—</td>').join('')}
        ${mats.map(c => `<td>${promMat(c, a.num)}</td>`).join('')}
        <td>${inasis}</td>
      </tr>`;

    const chip = (lbl, valTxt, cls) => `<div class="chip ${cls || ''}"><span>${lbl}</span><b>${valTxt}</b></div>`;
    const chipAlta = todasIguales
      ? chip('Rendimiento', 'Parejo · ' + maxV + ' en todo', 'good')
      : (mejores.length > 1
        ? chip('Materias más altas', adEsc(adNombresMats(mejores, mejores.length === 2 ? 2 : 1)) + ' · ' + maxV, 'good')
        : (mejores.length ? chip('Materia más alta', adEsc(mejores[0].mat) + ' · ' + maxV, 'good') : ''));
    const chipBaja = peores.length
      ? chip('A reforzar', adEsc(adNombresMats(peores, peores.length === 2 ? 2 : 1)) + ' · ' + minV, 'low')
      : '';
    const resumen = `
      <div class="chips">
        ${chip('Promedio general', promGen != null ? promGen : '—')}
        ${chipAlta}
        ${chipBaja}
        ${mejoraMax ? chip('Mayor avance', adEsc(mejoraMax.mat) + ' ▲ +' + mejoraMax.d, 'good') : ''}
        ${caidaMax ? chip('Mayor caída', adEsc(caidaMax.mat) + ' ▼ ' + caidaMax.d, 'low') : ''}
        ${chip('Inasistencias', inasis !== '' ? inasis : '0')}
      </div>`;

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
          <div class="bl-h">${evoOK
            ? `Evolución por materia <small>(parcial ${pPrev} → ${pUlt})</small>`
            : 'Rendimiento por materia <small>(promedio del año)</small>'}</div>
          ${(evoOK ? adBoletaGraficoEvo(filasEvo) : adBoletaGrafico(datos)) || '<p class="bl-nada">Aún no hay promedios que graficar.</p>'}
          ${resumen}
        </div>
        <div class="bl-msgs">
          <div class="bl-card motiva">
            <div class="bl-h">✦ Mensaje de motivación</div>
            <p>${adEsc(adMsgMotiva(primer(a.nombre), promGen, mejores.length === 1 ? mejores[0].mat : ''))}</p>
          </div>
          <div class="bl-card consejo">
            <div class="bl-h">✿ Consejo para la familia</div>
            <p>${adEsc(adConsejoFamilia(primer(a.nombre), {
              mejores, peores, maxV, minV,
              mejoresBas, maxB, extraDestacada,
              inasis: Number(inasis) || 0,
              tendencia, rasgosBajos,
              mejoraMax, caidaMax,
            }))}</p>
          </div>
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

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Boletas — ${adEsc(grado)}</title>
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
${d.lista.map(a => hoja(a)).join('')}
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  const w = window.open('', '_blank');
  if (!w) { if (typeof toast === 'function') toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
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
  const w = window.open('', '_blank');
  if (!w) { toast('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
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
    '• Se borran de este teléfono la asistencia, notas, colectas y avisos del grupo\n' +
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
  dd.asistencia = []; dd.notas = {}; dd.colectas = [];
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
  if (!d.lista.length) { adSinLista(body, 'los comunicados'); return; }
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
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="noclases">🚫 No hay clases</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="reunion">👨‍👩‍👧 Reunión de padres</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="material">🎒 Traer materiales</button>
        <button class="pa-generate-btn ad-btn-sec av-tpl" data-tpl="aporte">💰 Recordar aporte</button>
        <button class="pa-generate-btn ad-btn-sec" id="av-nuevo">➕ Aviso nuevo</button>
      </div>
      <div id="av-form" style="display:${edit ? 'block' : 'none'};margin-top:10px;border-top:1px dashed #ccc;padding-top:10px">
        <div class="pa-field"><label>Título del aviso</label>
          <input id="av-titulo" class="pa-inp-field" maxlength="120" value="${edit ? adEsc(edit.titulo) : ''}" placeholder="ej: Reunión de padres"></div>
        <div class="pa-field"><label>Detalle (lo que leerá la familia)</label>
          <textarea id="av-texto" class="pa-paste-area" rows="3" maxlength="1200" placeholder="ej: Este viernes 18 a las 3:00 pm en el aula. Traer lápiz.">${edit ? adEsc(edit.texto) : ''}</textarea></div>
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
          <input id="av-alumnos" class="pa-inp-field" inputmode="numeric" value="${edit && edit.alumnos ? edit.alumnos.join(', ') : ''}" placeholder="ej: 3, 15, 22"></div>
        <div class="ad-btn-row">
          <button class="pa-add-btn" id="av-publicar">${edit ? '💾 Guardar cambios' : '📣 Publicar aviso'}</button>
          <button class="pa-generate-btn ad-btn-sec" id="av-cancelar">Cancelar</button>
        </div>
      </div>
      <div style="margin-top:10px">
        ${g.avisos.length ? g.avisos.slice().sort((a, b) => (avVigente(b) - avVigente(a)) || (String(a.hasta) < String(b.hasta) ? -1 : 1)).map(filaAviso).join('')
          : '<p class="pa-optional-hint">Sin avisos todavía. Usa una plantilla de arriba: dos toques y queda publicado.</p>'}
      </div>
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
      await metasAlert('Para un aviso individual, escribe los números de lista (ej: 3, 15).', { icono: '👤', titulo: 'Comunicados' });
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
    const p = await metasPrompt('¿Qué pregunta hacen las familias? (ej: **¿Hay clases de refuerzo?**)', {
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
async function avBuzonCargar(d) {
  const cont = document.getElementById('av-buzon');
  if (!cont) return;
  const hint = t => '<p class="pa-optional-hint">' + t + '</p>';
  const claves = adClavesDelGrupo(d);
  if (!claves.length) { cont.innerHTML = hint('Aún no hay claves de familia en este grupo.'); return; }
  if (navigator.onLine === false) { cont.innerHTML = hint('📴 Sin internet: el buzón se revisa con conexión.'); return; }
  try {
    const { url, key } = _avSbConexion();
    const r = await fetch(url + '/rest/v1/rpc/metas_buzon_docente', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigos: claves }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) { cont.innerHTML = hint('Buzón vacío: sin mensajes de las familias.'); return; }
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
      const mEx = String(m.texto || '').match(/^\[EXCUSA (\d{4}-\d{2}-\d{2})\]\s*([\s\S]*)$/);
      if (mEx && numDe[m.codigo]) {
        const fecha = mEx[1], razon = mEx[2] || 'Sin razón', num = numDe[m.codigo];
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
  } catch (_) {
    cont.innerHTML = hint('⚠️ No se pudo revisar el buzón (¿ya corriste SUPABASE-FASE3.sql?). Toca «🔄 Revisar buzón» para reintentar.');
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

/* Fila de anulación para un evento que ya no existe localmente */
function adFilaAnulada(eventoId, guardado) {
  const b = { evento_id: eventoId, codigo: guardado.c, grado: '', seccion: '', docente: adDocenteTxt() };
  if (eventoId.startsWith('ADA-')) return Object.assign(b, { tipo: 'asistencia', estado: 'presente' });
  if (eventoId.startsWith('ADN-')) return Object.assign(b, { tipo: 'nota_final', nota: '' });
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
    Object.keys(ma).forEach(id => { if (!act1.has(id) && !ma[id].x) n++; });
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
    if (!actuales.has(id) && !mapa[id].x) pendientes.push(adFilaAnulada(id, mapa[id]));
  });

  if (!pendientes.length) {
    if (st) st.textContent = '☁️ Nube del chatbot: al día.';
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
  if (st) st.textContent = '⏳ Subiendo ' + pendientes.length + ' cambio(s)…';
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
    if (st) st.textContent = '✅ Nube del chatbot al día (' + new Date().toLocaleTimeString('es-HN') + ').';
    if (manual) toast('☁️ Registros sincronizados');
  } catch (_) {
    if (st) st.textContent = '⚠️ No se pudo subir ahora; se reintenta solo.';
  }
  _adSyncBusy = false;
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

    /* AUTOMÁTICO: cuentas claras de cada colecta (rendición) */
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

/* Restaurar «Mi aula» tras recargar: re-pide el candado del maestro y
   vuelve a la pestaña/colecta donde estaba. Si no pasa el PIN, va a la
   Zona Docente en vez de exponer el dinero. */
window.adRestoreState = async function (tab, colectaId) {
  if (tab) _adTab = tab;
  _adColectaId = colectaId || null;
  if (typeof paVerificarPin === 'function' &&
      !(await paVerificarPin('Los registros administrativos guardan **dinero y notas finales**:'))) {
    switchView('view-perfil');
    return;
  }
  switchView('view-admin');
  renderAdmin();
};

/* ── Navegación (mismo patrón que las demás herramientas) ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-admin-btn')?.addEventListener('click', async () => {
    /* dinero y notas finales: detrás del candado del maestro */
    if (typeof paVerificarPin === 'function' &&
        !(await paVerificarPin('Los registros administrativos guardan **dinero y notas finales**:'))) return;
    switchView('view-admin');
    renderAdmin();
  });
  document.getElementById('admin-back-btn')?.addEventListener('click', () => switchView('view-perfil'));
});
