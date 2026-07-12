/* ══════════════════════════════════════════════════════════════
   REGISTROS ADMINISTRATIVOS — la oficina del maestro (Zona Docente)

   Tres registros que el aula necesita y que hoy viven en cuadernos:
   💰 Economía   — colaboraciones y acuerdos de reunión (quién dio,
                   cuánto se recaudó, en qué se gastó, saldo).
   📋 Asistencia — pase de lista rápido: solo se marca lo excepcional
                   (ausente / con excusa); resumen mensual por alumno.
   🧮 Notas SACE — notas finales por parcial y materia, con columna
                   lista para copiar y pegar en el archivo de SACE.

   Todo es offline-first en METAS_ADMIN_V1 (localStorage). La lista de
   alumnos se comparte entre los tres registros y puede traerse del
   Plan de Acción. Protegido por el candado del maestro (paVerificarPin).
   Sincronización a la nube/chatbot: fase futura.
══════════════════════════════════════════════════════════════ */

const ADMIN_KEY = 'METAS_ADMIN_V1';
const AD_MATERIAS_DEF = ['Español', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales',
                         'Inglés', 'Educación Física'];

let _adTab = 'lista';        /* lista | eco | asis | sace */
let _adColectaId = null;     /* colecta abierta en Economía */

function adLoad() {
  try {
    const o = JSON.parse(localStorage.getItem(ADMIN_KEY));
    if (o && typeof o === 'object') {
      o.lista = Array.isArray(o.lista) ? o.lista : [];
      o.colectas = Array.isArray(o.colectas) ? o.colectas : [];
      o.asistencia = Array.isArray(o.asistencia) ? o.asistencia : [];
      o.materias = Array.isArray(o.materias) && o.materias.length ? o.materias : AD_MATERIAS_DEF.slice();
      o.notas = (o.notas && typeof o.notas === 'object') ? o.notas : {};
      return o;
    }
  } catch (_) {}
  return { grado: '', seccion: '', lista: [], colectas: [], asistencia: [],
           materias: AD_MATERIAS_DEF.slice(), notas: {} };
}
function adSave(d) {
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(d)); } catch (_) {}
  adSyncProgramar();   /* la nube del chatbot se actualiza sola, con calma */
}

function adEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
  return [(d.grado || '').trim(), (d.seccion || '').trim()].filter(Boolean).join(' ');
}

/* ── RENDER PRINCIPAL ── */
function renderAdmin() {
  const cont = document.getElementById('admin-content');
  if (!cont) return;
  const d = adLoad();
  cont.innerHTML = `
    <div class="pa-tabs-out ad-tabs">
      <button class="pa-otab ${_adTab === 'lista' ? 'pa-otab-active' : ''}" data-adtab="lista">👥 Lista</button>
      <button class="pa-otab ${_adTab === 'eco'   ? 'pa-otab-active' : ''}" data-adtab="eco">💰 Economía</button>
      <button class="pa-otab ${_adTab === 'asis'  ? 'pa-otab-active' : ''}" data-adtab="asis">📋 Asistencia</button>
      <button class="pa-otab ${_adTab === 'sace'  ? 'pa-otab-active' : ''}" data-adtab="sace">🧮 Notas SACE</button>
    </div>
    <div id="ad-tab-body"></div>`;
  cont.querySelectorAll('[data-adtab]').forEach(b =>
    b.addEventListener('click', () => { _adTab = b.dataset.adtab; _adColectaId = null; renderAdmin(); }));
  const body = document.getElementById('ad-tab-body');
  if (_adTab === 'lista') adRenderLista(body, d);
  else if (_adTab === 'eco') adRenderEco(body, d);
  else if (_adTab === 'asis') adRenderAsis(body, d);
  else adRenderSace(body, d);
}

/* ══════════════ 👥 LISTA (la comparten los 3 registros) ══════════════ */
function adRenderLista(body, d) {
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">👥 Mi lista de alumnos</div>
      <p class="pa-optional-hint">Esta lista alimenta Economía, Asistencia y Notas SACE.
        El número es el <strong>nº de lista oficial</strong> (el mismo de SACE y del Plan de Acción).</p>
      <div class="pa-row-2">
        <div class="pa-field"><label>Grado</label>
          <input id="ad-grado" class="pa-inp-field" value="${adEsc(d.grado)}" placeholder="ej: 6º"></div>
        <div class="pa-field"><label>Sección</label>
          <input id="ad-seccion" class="pa-inp-field" value="${adEsc(d.seccion)}" placeholder="ej: A"></div>
      </div>
      <div id="ad-lista-rows">
        ${d.lista.map(a => `
          <div class="ad-al-row" data-num="${a.num}">
            <span class="ad-al-num">#${a.num}</span>
            <input class="pa-inp-field ad-al-nombre" value="${adEsc(a.nombre)}" placeholder="Nombre (opcional)">
            <button class="ad-al-del" aria-label="Quitar">✕</button>
          </div>`).join('')}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="ad-add-al">➕ Agregar alumno</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-traer-pa">📥 Traer del Plan de Acción</button>
      </div>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">☁️ Nube del chatbot de padres</div>
      <p class="pa-optional-hint">La asistencia, las notas finales y las colaboraciones suben con la
        <strong>clave de familia</strong> de cada alumno (la misma del Plan de Acción) para que el chatbot
        les responda a los padres. Sube solo lo que cambia; sin internet, espera y reintenta.
        Necesita el <strong>Grado</strong> escrito arriba.</p>
      <button class="pa-generate-btn ad-btn-sec" id="ad-sb-sync">☁️ Sincronizar ahora</button>
      <p class="pa-optional-hint" id="ad-sb-status" style="margin-top:8px"></p>
    </div>`;

  const persist = () => {
    const dd = adLoad();
    dd.grado = document.getElementById('ad-grado').value;
    dd.seccion = document.getElementById('ad-seccion').value;
    dd.lista = [...body.querySelectorAll('.ad-al-row')].map(r => ({
      num: +r.dataset.num,
      nombre: r.querySelector('.ad-al-nombre').value.trim(),
    }));
    adSave(dd);
  };
  ['ad-grado', 'ad-seccion'].forEach(id =>
    document.getElementById(id).addEventListener('input', persist));
  body.querySelectorAll('.ad-al-nombre').forEach(i => i.addEventListener('input', persist));
  body.querySelectorAll('.ad-al-del').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Quitar a este alumno de la lista?\nSus pagos, asistencias y notas guardadas no se borran.', { icono: '👥', titulo: 'Lista de alumnos', okTxt: 'Sí, quitar' })) return;
      b.closest('.ad-al-row').remove();
      persist(); renderAdmin();
    }));
  document.getElementById('ad-add-al').addEventListener('click', () => {
    const dd = adLoad();
    const sig = dd.lista.length ? Math.max(...dd.lista.map(a => a.num)) + 1 : 1;
    dd.lista.push({ num: sig, nombre: '' });
    adSave(dd); renderAdmin();
  });
  document.getElementById('ad-sb-sync').addEventListener('click', () => adSincronizarNube(true));
  adSincronizarNube(false);   /* refresca el estado al entrar */
  document.getElementById('ad-traer-pa').addEventListener('click', async () => {
    let pa = null;
    try { pa = JSON.parse(localStorage.getItem('METAS_PLANACCION_V1')); } catch (_) {}
    const ana = pa && Array.isArray(pa.analisis) && pa.analisis.length ? pa.analisis[pa.analisis.length - 1] : null;
    if (!ana || !Array.isArray(ana.students) || !ana.students.length) {
      await metasAlert('No encontré análisis guardados en el Plan de Acción de este teléfono. Agrega la lista a mano con «➕ Agregar alumno».', { icono: '📥', titulo: 'Lista de alumnos' });
      return;
    }
    if (!await metasConfirm('Se traerá la lista del análisis más reciente (**' + (ana.evaluacion || 'Evaluación') + '**, ' + ana.students.length + ' alumnos). ¿Reemplazar la lista actual?', { icono: '📥', titulo: 'Lista de alumnos', okTxt: 'Sí, traer' })) return;
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
    const monto = await metasPrompt('¿Cuánto aporta cada alumno? (en Lempiras; puede ajustarse por alumno al marcar)', {
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
      <p class="pa-optional-hint">${adFechaBonita(c.fecha)} · aporte por alumno: <strong>${adLps(c.montoAlumno)}</strong>
        · toca un alumno para marcar que dio (vuelve a tocar para quitar; mantén la idea simple: lo marcado = dinero en mano).</p>
      <div class="ad-resumen">
        <span>✅ Dieron: <strong>${pagaron}/${d.lista.length}</strong></span>
        <span>💵 Recaudado: <strong>${adLps(t.rec)}</strong></span>
        <span>🧾 Gastado: <strong>${adLps(t.gas)}</strong></span>
        <span class="${t.saldo >= 0 ? 'ad-ok' : 'ad-mal'}">💼 Saldo: <strong>${adLps(t.saldo)}</strong></span>
      </div>
      <div class="ad-chips">
        ${d.lista.map(a => {
          const pagado = c.pagos && c.pagos[a.num] != null;
          return `<button class="ad-chip ${pagado ? 'ad-chip-on' : ''}" data-num="${a.num}"
            title="${adEsc(a.nombre)}">#${a.num}${pagado ? ' ✓' : ''}</button>`;
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
      if (cc.pagos[num] != null) { delete cc.pagos[num]; }
      else {
        /* aporte distinto al acordado: mantener tocado el chip 1 segundo abre monto — versión simple: monto acordado; editar con toque largo sería frágil en aula. Para casos especiales: */
        cc.pagos[num] = cc.montoAlumno;
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
      cc.gastos.splice(+b.dataset.gi, 1);
      adSave(dd); renderAdmin();
    }));

  document.getElementById('ad-borrar-colecta').addEventListener('click', async () => {
    if (!await metasConfirm('¿Eliminar la colecta **' + c.concepto + '** con todos sus pagos y gastos?\nEsta acción no se puede deshacer.', { icono: '🗑', titulo: 'Economía', okTxt: 'Sí, eliminar' })) return;
    const dd = adLoad();
    dd.colectas = dd.colectas.filter(x => x.id !== _adColectaId);
    adSave(dd); _adColectaId = null; renderAdmin();
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
Aporte por alumno: ${adLps(c.montoAlumno)} · Generado con M.E.T.A.S el ${adFechaBonita(adHoy())}</div>
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
function adRenderAsis(body, d) {
  if (!d.lista.length) { adSinLista(body, 'el pase de lista'); return; }
  const hoy = adHoy();
  const fechaSel = body.dataset.fecha || hoy;
  const reg = d.asistencia.find(r => r.f === fechaSel) || { f: fechaSel, aus: {} };

  /* resumen del mes de la fecha seleccionada */
  const mes = fechaSel.slice(0, 7);
  const delMes = d.asistencia.filter(r => r.f.startsWith(mes));
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
          return `<button class="ad-chip ${cls}" data-num="${a.num}" title="${adEsc(a.nombre)}">#${a.num}${ico}</button>`;
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
      <div class="pa-card-title">📊 Resumen del mes (${mes.split('-').reverse().join('/')})</div>
      ${Object.keys(resumen).length ? `
      <table class="ad-tabla">
        <thead><tr><th>#</th><th>Alumno/a</th><th>🚫 Ausencias</th><th>📝 Excusas</th></tr></thead>
        <tbody>
        ${d.lista.filter(a => resumen[a.num]).map(a => `
          <tr><td>#${a.num}</td><td>${adEsc(a.nombre) || '—'}</td>
          <td>${resumen[a.num].A || 0}</td><td>${resumen[a.num].E || 0}</td></tr>`).join('')}
        </tbody>
      </table>
      <button class="pa-generate-btn ad-btn-sec" id="ad-asis-print">🖨️ Imprimir resumen del mes</button>`
      : '<p class="pa-optional-hint">Sin ausencias registradas este mes. 🎉</p>'}
    </div>`;

  document.getElementById('ad-asis-fecha').addEventListener('change', e => {
    body.dataset.fecha = e.target.value || hoy;
    adRenderAsis(body, adLoad());
  });

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
  if (pr) pr.addEventListener('click', () => adPrintAsis(adLoad(), mes));
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

/* ══════════════ 🧮 NOTAS FINALES POR PARCIAL (SACE) ══════════════ */
function adRenderSace(body, d) {
  if (!d.lista.length) { adSinLista(body, 'las notas finales'); return; }
  const parcial = body.dataset.parcial || 'I';
  const materia = body.dataset.materia || d.materias[0];
  const notas = ((d.notas[parcial] || {})[materia]) || {};

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">🧮 Notas finales por parcial</div>
      <p class="pa-optional-hint">La nota final que va a <strong>SACE</strong>, por parcial y materia.
        La columna copiada sigue el <strong>orden del nº de lista</strong> — igual que el archivo de SACE:
        pega directo en la columna de calificaciones.</p>
      <div class="pa-row-2">
        <div class="pa-field"><label>Parcial</label>
          <select id="ad-sace-parcial" class="pa-inp-field">
            ${['I', 'II', 'III', 'IV'].map(p => `<option value="${p}" ${p === parcial ? 'selected' : ''}>Parcial ${p}</option>`).join('')}
          </select></div>
        <div class="pa-field"><label>Materia</label>
          <select id="ad-sace-materia" class="pa-inp-field">
            ${d.materias.map(m => `<option ${m === materia ? 'selected' : ''}>${adEsc(m)}</option>`).join('')}
            <option value="__otra__">➕ Otra materia…</option>
          </select></div>
      </div>
      <div class="ad-notas-grid">
        ${d.lista.map(a => `
          <div class="ad-nota-row">
            <span class="ad-al-num">#${a.num}</span>
            <span class="ad-nota-nombre">${adEsc(a.nombre) || '—'}</span>
            <input class="pa-inp-field ad-nota-inp" data-num="${a.num}" type="number" min="1" max="100"
              inputmode="numeric" value="${notas[a.num] != null ? notas[a.num] : ''}" placeholder="—">
          </div>`).join('')}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="ad-sace-copiar">📋 Copiar columna para SACE</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-csv">⬇ Copiar CSV completo</button>
        <button class="pa-generate-btn ad-btn-sec" id="ad-sace-print">🖨️ Imprimir planilla</button>
      </div>
      <p class="pa-optional-hint" id="ad-sace-estado" style="margin-top:8px"></p>
    </div>`;

  const setSel = (k, v) => { body.dataset[k] = v; adRenderSace(body, adLoad()); };
  document.getElementById('ad-sace-parcial').addEventListener('change', e => setSel('parcial', e.target.value));
  document.getElementById('ad-sace-materia').addEventListener('change', async e => {
    if (e.target.value !== '__otra__') { setSel('materia', e.target.value); return; }
    const nueva = await metasPrompt('Nombre de la materia nueva:', {
      icono: '📚', titulo: 'Materias', okTxt: 'Agregar',
      valida: v => String(v).trim().length >= 3 ? '' : 'Escribe el nombre completo.',
    });
    if (nueva === null) { adRenderSace(body, adLoad()); return; }
    const dd = adLoad();
    const nom = String(nueva).trim();
    if (!dd.materias.includes(nom)) dd.materias.push(nom);
    adSave(dd);
    setSel('materia', nom);
  });

  body.querySelectorAll('.ad-nota-inp').forEach(inp =>
    inp.addEventListener('input', () => {
      const dd = adLoad();
      dd.notas[parcial] = dd.notas[parcial] || {};
      dd.notas[parcial][materia] = dd.notas[parcial][materia] || {};
      const v = inp.value === '' ? null : Math.max(1, Math.min(100, Math.round(Number(inp.value))));
      if (v === null) delete dd.notas[parcial][materia][inp.dataset.num];
      else dd.notas[parcial][materia][inp.dataset.num] = v;
      adSave(dd);
    }));

  const estado = txt => { const e = document.getElementById('ad-sace-estado'); if (e) e.textContent = txt; };

  document.getElementById('ad-sace-copiar').addEventListener('click', () => {
    const dd = adLoad();
    const ns = ((dd.notas[parcial] || {})[materia]) || {};
    const col = dd.lista.map(a => ns[a.num] != null ? ns[a.num] : '').join('\n');
    adCopiar(col,
      () => estado('✅ Columna copiada (' + dd.lista.length + ' filas, orden de lista). Pega en la columna de ' + materia + ' del archivo de SACE.'),
      () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
  });

  document.getElementById('ad-sace-csv').addEventListener('click', () => {
    const dd = adLoad();
    const ns = ((dd.notas[parcial] || {})[materia]) || {};
    const csv = 'numero_lista,alumno,materia,parcial,nota\n' + dd.lista.map(a =>
      [a.num, '"' + String(a.nombre || '').replace(/"/g, '""') + '"', '"' + materia + '"', parcial,
       ns[a.num] != null ? ns[a.num] : ''].join(',')).join('\n');
    adCopiar(csv,
      () => estado('✅ CSV copiado: pégalo en un archivo .csv o en una hoja de cálculo.'),
      () => estado('⚠️ No se pudo copiar automáticamente en este navegador.'));
  });

  document.getElementById('ad-sace-print').addEventListener('click', () => adPrintSace(adLoad(), parcial, materia));
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
function adMateriaSlug(m) {
  return String(m || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
}

/* Filas actuales que deberían existir en la nube.
   El evento_id lleva la CLAVE DE FAMILIA (única entre maestros gracias
   a sus 4 letras aleatorias) — nunca grado+número, que se repetiría
   entre las aulas «6A #15» de mil maestros suscritos y pisaría datos. */
function adFilasNube(d) {
  if (typeof paCodigoAlumno !== 'function') return [];
  const doc = adDocenteTxt();
  const base = { grado: d.grado || '', seccion: d.seccion || '', docente: doc };
  const cod = {};
  d.lista.forEach(a => { cod[a.num] = paCodigoAlumno(d.grado, d.seccion, a.num); });
  const filas = [];

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
        filas.push(Object.assign({
          evento_id: 'ADN-' + parcial + '-' + adMateriaSlug(materia) + '-' + cod[num],
          codigo: cod[num], tipo: 'nota_final',
          parcial, materia, nota: d.notas[parcial][materia][num],
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

async function adSincronizarNube(manual) {
  if (_adSyncBusy) return;
  const st = document.getElementById('ad-sb-status');
  const d = adLoad();
  const filas = adFilasNube(d);
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
        body: JSON.stringify({ filas: lote }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const n = await r.json();
      if (typeof n !== 'number') throw new Error('respuesta inesperada');
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
