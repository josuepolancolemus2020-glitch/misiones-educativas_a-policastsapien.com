/* ─────────────────────────────────────────────
   PARTE MENSUAL · LÓGICA SEDUC HONDURAS
   Fórmulas:
   Asistencia Media = Matrícula Actual − (Total Inasistencias ÷ Días Trabajados)
   Tanto por Ciento = (Asistencia Media ÷ Matrícula Actual) × 100
───────────────────────────────────────────── */

let _pmSeccion = 'A';

/* Arriba de «Datos del grupo»: logo a la izquierda y nombre al lado.
   Sin perfil no se inserta nada, y el HTML de la tarjeta queda igual. */
function pmEsc(t) {
  return String(t == null ? '' : t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function pmMarcaHtml() {
  if (!window.MetasCentro || typeof MetasCentro.marca !== 'function') return '';
  const m = MetasCentro.marca();
  if (!m || (!m.logo && !m.nombre)) return '';
  const img = m.logo
    ? '<img data-metas-logo alt="" src="' + String(m.logo).replace(/["'<>]/g, '') + '" style="width:46px;height:46px;object-fit:contain;flex:0 0 46px;display:block">'
    : '';
  const nom = m.nombre
    ? '<span data-metas="nombre-centro" style="font-weight:800;font-size:14px;line-height:1.2;">' + pmEsc(m.nombre) + '</span>'
    : '';
  return '<div data-metas="marca-centro" style="display:flex;align-items:center;gap:8px;margin:0 0 8px;">' + img + nom + '</div>';
}
function pmPonerMarca() {
  const card = document.querySelector('#view-parte-mensual .parte-card');
  if (!card) return;
  const vieja = card.querySelector('[data-metas="marca-centro"]');
  if (vieja) vieja.remove();
  const html = pmMarcaHtml();
  if (!html) return;
  const titulo = card.querySelector('.parte-section-title');
  if (titulo) titulo.insertAdjacentHTML('beforebegin', html);
}
window.pmMarcaHtml = pmMarcaHtml;
window.pmPonerMarca = pmPonerMarca;

function pmN(id) { return parseInt(document.getElementById(id)?.value) || 0; }
function pmSet(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function pmActualizar() {
  // Matrícula Actual = Anterior + Ingresos − Desertores ± Traslados (por género)
  const antH = pmN('pm-ant-h'), antM = pmN('pm-ant-m');
  const ingH = pmN('pm-ing-h'), ingM = pmN('pm-ing-m');
  const desH = pmN('pm-des-h'), desM = pmN('pm-des-m');
  const traH = pmN('pm-tra-h'), traM = pmN('pm-tra-m');

  const actH = antH + ingH - desH + traH;
  const actM = antM + ingM - desM + traM;
  const actTot = actH + actM;

  pmSet('pm-ant-tot', antH + antM);
  pmSet('pm-ing-tot', ingH + ingM);
  pmSet('pm-des-tot', desH + desM);
  pmSet('pm-tra-tot', traH + traM);
  pmSet('pm-act-h',   Math.max(0, actH));
  pmSet('pm-act-m',   Math.max(0, actM));
  pmSet('pm-act-tot', Math.max(0, actTot));

  // Inasistencias
  const inasH = pmN('pm-inas-h'), inasM = pmN('pm-inas-m');
  pmSet('pm-inas-tot', inasH + inasM);
  const inasTot = inasH + inasM;

  const dias = pmN('pm-dias');
  const matricula = Math.max(0, actTot);

  // Calcular resultados
  const mediaEl = document.getElementById('pm-asist-media');
  const pctEl   = document.getElementById('pm-pct-asist');
  const barEl   = document.getElementById('pm-bar-fill');
  const semaEl  = document.getElementById('pm-semaforo');

  if (!matricula || !dias) {
    if (mediaEl) mediaEl.textContent = 's/d';
    if (pctEl)   pctEl.textContent   = 's/d';
    if (barEl)   barEl.style.width   = '0%';
    if (semaEl)  semaEl.innerHTML    = '';
    return;
  }

  const media = matricula - (inasTot / dias);
  const pct   = (media / matricula) * 100;

  if (mediaEl) mediaEl.textContent = media.toFixed(2);
  if (pctEl) {
    pctEl.textContent = pct.toFixed(1) + '%';
    pctEl.style.color = pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626';
  }
  if (barEl) {
    barEl.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
    barEl.style.background = pct >= 90
      ? 'linear-gradient(90deg,#22c55e,#16a34a)'
      : pct >= 75 ? 'linear-gradient(90deg,#f59e0b,#d97706)'
      : 'linear-gradient(90deg,#ef4444,#dc2626)';
  }
  if (semaEl) {
    const icon = pct >= 90 ? '✅' : pct >= 75 ? '⚠️' : '🔴';
    const msg  = pct >= 90 ? 'Asistencia satisfactoria'
               : pct >= 75 ? 'Asistencia regular: requiere seguimiento'
               : 'Asistencia crítica: acción inmediata';
    semaEl.innerHTML = `<span class="pm-semaforo-text">${icon} ${msg}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  pmPonerMarca();

  // Navegación
  document.getElementById('goto-parte-btn')?.addEventListener('click', () => switchView('view-parte-mensual'));
  document.getElementById('parte-back-btn')?.addEventListener('click', () => switchView('view-perfil'));

  // Sección
  document.querySelectorAll('.pm-sec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pm-sec-btn').forEach(b => b.classList.remove('pm-sec-active'));
      btn.classList.add('pm-sec-active');
      _pmSeccion = btn.dataset.sec;
    });
  });

  // Recalcular en cualquier cambio
  const pmIds = [
    'pm-ant-h','pm-ant-m','pm-ing-h','pm-ing-m',
    'pm-des-h','pm-des-m','pm-tra-h','pm-tra-m',
    'pm-inas-h','pm-inas-m','pm-dias'
  ];
  pmIds.forEach(id => document.getElementById(id)?.addEventListener('input', pmActualizar));

});
