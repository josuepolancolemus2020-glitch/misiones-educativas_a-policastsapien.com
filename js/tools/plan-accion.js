/* ─────────────────────────────────────────────
   PLAN DE ACCIÓN — ANÁLISIS DE CALIFICACIONES
───────────────────────────────────────────── */

const PA_CATS = [
  { key:'avanzado',       label:'Avanzado',       min:95,  max:100, color:'#16a34a', bg:'#dcfce7' },
  { key:'muyBueno',       label:'Muy Bueno',      min:80,  max:94,  color:'#0891b2', bg:'#cffafe' },
  { key:'satisfactorio',  label:'Satisfactorio',  min:70,  max:79,  color:'#a16207', bg:'#fef9c3' },
  { key:'debeMejorar',    label:'Debe Mejorar',   min:60,  max:69,  color:'#ea580c', bg:'#ffedd5' },
  { key:'insatisfactorio',label:'Insatisfactorio',min:0,   max:59,  color:'#dc2626', bg:'#fee2e2' },
];
const PA_SUGS = {
  avanzado:       'Excelente comprensión. Retarlos con ejercicios de nivel superior y tutorías entre pares.',
  muyBueno:       'Dominan el tema teóricamente. Proporcionarles actividades de aplicación práctica.',
  satisfactorio:  'Comprensión básica. Usar recursos visuales y reglas mnemotécnicas para afianzar.',
  debeMejorar:    'Confunden conceptos. Actividades lúdicas y trabajo con pares más avanzados.',
  insatisfactorio:'ALERTA: Atención inmediata. Regresar a conceptos fundamentales con material simplificado.',
};

let _paInitDone = false;
let _paStudents = [];

/* Grado + sección con la NORMATIVA del proyecto: siempre «6º-1».
   La regla vive en adGradoSeccion (js/tools/registros-admin.js), que se
   carga en la misma página; el respaldo es por si este archivo se usa
   suelto. Nunca se usa para armar claves de familia: eso va con los
   dígitos pelados (paCodigoAlumno). */
function paGrupoTxt(grado, seccion) {
  if (typeof adGradoSeccion === 'function') return adGradoSeccion(grado, seccion);
  const g = String(grado || '').trim().replace(/^(\d{1,2})\s*[ºo°]?$/i, '$1º');
  const s = String(seccion || '').trim();
  if (!g || !s) return g || s;
  return (g.length <= 4 && s.length <= 3) ? g + '-' + s : g + ' ' + s;
}

function paGradeColors(g) {
  if (typeof g !== 'number') return { bg:'#e5e7eb', txt:'#374151' };
  if (g >= 95) return { bg:'#22c55e', txt:'#fff' };
  if (g >= 80) return { bg:'#22d3ee', txt:'#000' };
  if (g >= 70) return { bg:'#fef08a', txt:'#000' };
  if (g >= 60) return { bg:'#f97316', txt:'#fff' };
  return { bg:'#ef4444', txt:'#fff' };
}

/* El Nº de LISTA es EDITABLE: es la identidad del alumno (de él nace la
   clave de familia), así que NUNCA se renumera solo. Al actualizar un
   análisis con huecos (1,2,3,5…) el maestro puede escribir el 4 que falta. */
function paAddRow(num, name = '', grade = '') {
  const list = document.getElementById('pa-students-list');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'pa-student-row';
  row.innerHTML = `
    <input type="text" class="pa-inp-num" inputmode="numeric" maxlength="2" value="${num}" title="Nº de lista (editable)">
    <input type="text" class="pa-inp-field pa-inp-name" placeholder="Nombre…" value="${name}">
    <input type="text" class="pa-inp-grade-cell" placeholder="0-100 / NSP" value="${grade}" maxlength="3">
    <button class="pa-del-row" title="Eliminar"><i class="fa-solid fa-xmark"></i></button>`;
  // Eliminar una fila NO renumera las demás: cada número es del alumno.
  row.querySelector('.pa-del-row').addEventListener('click', () => row.remove());
  list.appendChild(row);
}

/* Números de lista ya escritos en la cuadrícula */
function paNumsUsados() {
  return Array.from(document.querySelectorAll('.pa-student-row .pa-inp-num'))
    .map(inp => parseInt(inp.value, 10)).filter(n => n > 0);
}
/* El número que FALTA más pequeño (para «Agregar estudiante»): si están
   1,2,3,5 sugiere el 4; si está corrido 1..26, sugiere el 27. */
function paSiguienteNum() {
  const usados = new Set(paNumsUsados());
  let n = 1;
  while (usados.has(n)) n++;
  return n;
}

function paCollect() {
  return Array.from(document.querySelectorAll('.pa-student-row')).map((row, i) => {
    const id    = parseInt(row.querySelector('.pa-inp-num')?.value, 10) || (i + 1);
    const name  = row.querySelector('.pa-inp-name')?.value.trim() || `#${id}`;
    const raw   = row.querySelector('.pa-inp-grade-cell')?.value.trim().toUpperCase() || '';
    const grade = raw === 'NSP' ? 'NSP' : (raw === '' ? null : (parseFloat(raw) || 0));
    return { id, name, grade };
  }).filter(s => s.grade !== null)
    .sort((a, b) => a.id - b.id);
}

function paGenerate() {
  const students = paCollect();
  if (!students.length) { toast('Agrega al menos un estudiante con nombre'); return; }
  // CANDADO: números de lista repetidos cruzarían las claves de familia.
  const vistos = new Set(), repes = new Set();
  students.forEach(s => { if (vistos.has(s.id)) repes.add(s.id); vistos.add(s.id); });
  if (repes.size) {
    toast('⚠️ Nº de lista repetido: ' + [...repes].join(', ') + ' — corrígelo antes de generar (cada alumno tiene SU número).');
    return;
  }
  _paStudents = students;

  const numeric   = students.filter(s => typeof s.grade === 'number');
  const nsp       = students.filter(s => s.grade === 'NSP');
  const total     = students.length;
  const avg       = numeric.length ? (numeric.reduce((a, s) => a + s.grade, 0) / numeric.length) : 0;
  const passing   = numeric.filter(s => s.grade >= 70).length;
  const pRate     = numeric.length ? Math.round((passing / numeric.length) * 100) : 0;
  const toRecover = numeric.filter(s => s.grade <= 65);

  const cats = {};
  PA_CATS.forEach(c => { cats[c.key] = numeric.filter(s => s.grade >= c.min && s.grade <= c.max).length; });
  const maxCat = Math.max(...Object.values(cats), 1);

  const grado     = document.getElementById('pa-grado')?.value    || '—';
  const seccion   = document.getElementById('pa-seccion')?.value  || '—';
  const docente   = document.getElementById('pa-docente')?.value  || '—';
  const evaluacion= document.getElementById('pa-evaluacion')?.value || 'Evaluación';
  const parcial   = document.getElementById('pa-parcial')?.value  || '';
  const fechaPrueba = document.getElementById('pa-fecha')?.value  || '';

  const avgColor = avg >= 70 ? '#16a34a' : avg >= 60 ? '#d97706' : '#dc2626';

  const dash = document.getElementById('pa-dashboard');
  if (!dash) return;

  // Grade grid — 3 columns of 15 students each
  const ngSlices = [students.slice(0, 15), students.slice(15, 30), students.slice(30, 45)];
  const ngGridHtml = ngSlices.filter(s => s.length > 0).map(slice => {
    const rows = slice.map(s => {
      const c = paGradeColors(s.grade);
      return `<div class="pa-ng-row"><span class="pa-ng-num">#${s.id}</span><span class="pa-ng-chip" style="background:${c.bg};color:${c.txt}">${s.grade}</span></div>`;
    }).join('');
    return `<div class="pa-ng-col">${rows}</div>`;
  }).join('');

  /* El grupo se escribe con la regla del proyecto: «6º-1», no «6 1»
     (adGradoSeccion, en js/tools/registros-admin.js) */
  const grupoTxt = paGrupoTxt(grado === '—' ? '' : grado, seccion === '—' ? '' : seccion);
  /* Sin GRADO no hay clave de familia (paCodigoAlumno) y nada de esto llega
     al asistente. Decirlo aquí, grande, en vez de dejar creer que subió. */
  const sinGrado = !String(grado === '—' ? '' : grado).replace(/\D/g, '');

  dash.innerHTML = `
    <!-- Lo PRIMERO que ve el maestro al generar: qué pasó con estas notas
         (si quedaron guardadas y si subieron al asistente) y cuál es el
         siguiente paso. Antes el análisis aparecía y no se sabía nada. -->
    <div class="pa-listo ${sinGrado ? 'pa-listo-falta' : ''}" id="pa-listo">
      <div class="pa-listo-top">
        <span class="pa-listo-ic">${sinGrado ? '⚠️' : '☁️'}</span>
        <span class="pa-listo-txt">
          <span class="pa-listo-t">${sinGrado
            ? 'Guardado, pero las familias todavía NO lo pueden ver'
            : 'Listo: guardado y camino al asistente de padres'}</span>
          <span class="pa-listo-s">${sinGrado
            ? 'Falta el <strong>Grado</strong> en 📋 Datos de la Evaluación. Sin él no se puede armar ' +
              'la <strong>clave de la familia</strong> (nº de lista + 4 letras) y las notas no salen ' +
              'al asistente. Escríbelo y toca <strong>Generar Análisis</strong> otra vez.'
            : 'Las <strong>' + total + ' nota' + (total !== 1 ? 's' : '') + '</strong>' +
              (grupoTxt.trim() ? ' de <strong>' + paEsc(grupoTxt.trim()) + '</strong>' : '') + ' quedaron en ' +
              '🗂️ <strong>Análisis guardados</strong>, y cada familia ya puede verlas con su ' +
              'clave (nº de lista + 4 letras).'}</span>
          ${sinGrado ? '' : '<span class="pa-listo-estado" id="pa-listo-estado">⏳ Enviando…</span>'}
        </span>
      </div>
      <div class="pa-listo-btns">
        ${sinGrado
          ? '<button class="pa-listo-b pa-listo-b-otra" id="pa-ir-grado">✏️ Escribir el grado</button>'
          : '<button class="pa-listo-b pa-listo-b-otra" id="pa-otra-btn">➕ Analizar otra prueba</button>'}
        <button class="pa-listo-b" id="pa-ver-msg-btn">👨‍👩‍👧 Ver los mensajes para padres</button>
      </div>
    </div>

    <div class="pa-dash-head">
      <div>
        <div class="pa-dash-title">ANÁLISIS Y PLAN DE ACCIÓN</div>
        <div class="pa-dash-sub">📌 ${evaluacion}${parcial ? ' · Parcial ' + parcial : ''}</div>
      </div>
      <div class="pa-dash-meta">
        <span><b>Grado:</b> ${grado}</span>
        <span><b>Sección:</b> ${seccion}</span>
        ${parcial ? `<span><b>Parcial:</b> ${parcial}</span>` : ''}
        ${fechaPrueba ? `<span><b>Fecha de la prueba:</b> ${paFechaBonita(fechaPrueba)}</span>` : ''}
        <span><b>Docente:</b> ${docente}</span>
      </div>
    </div>

    <div class="pa-tabs-out">
      <button class="pa-otab pa-otab-active" data-otab="overview">📊 Dashboard</button>
      <button class="pa-otab" data-otab="planilla">📋 Planilla</button>
      <button class="pa-otab" data-otab="padres">👨‍👩‍👧 Padres</button>
    </div>

    <div id="pa-out-overview">
      <div class="pa-stats-grid">
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#3b82f6">👥</div><div class="pa-stat-info"><div class="pa-stat-lbl">En Lista</div><div class="pa-stat-val">${total}</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#8b5cf6">📈</div><div class="pa-stat-info"><div class="pa-stat-lbl">Promedio</div><div class="pa-stat-val" style="color:${avgColor}">${avg.toFixed(1)}</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#22c55e">🏆</div><div class="pa-stat-info"><div class="pa-stat-lbl">Aprobación</div><div class="pa-stat-val">${pRate}%</div><div class="pa-stat-sub">≥ 70%</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#ef4444">⚠️</div><div class="pa-stat-info"><div class="pa-stat-lbl">Recuperación</div><div class="pa-stat-val">${toRecover.length}</div><div class="pa-stat-sub">nota ≤ 65</div></div></div>
      </div>

      <div class="pa-two-col">
        <div class="pa-card">
          <div class="pa-card-title">📊 Distribución</div>
          ${PA_CATS.map(c => `
            <div class="pa-dist-row">
              <div class="pa-dist-info"><span class="pa-dist-lbl">${c.label}</span><span class="pa-dist-cnt">${cats[c.key]}</span></div>
              <div class="pa-dist-track"><div class="pa-dist-fill" style="width:${Math.round((cats[c.key]/maxCat)*100)}%;background:${c.color}"></div></div>
            </div>`).join('')}
        </div>
        <div class="pa-card">
          <div class="pa-card-title">💡 Sugerencias</div>
          ${PA_CATS.filter(c => cats[c.key] > 0).map(c => `
            <div class="pa-sug-item" style="border-left:4px solid ${c.color};background:${c.bg}">
              <div class="pa-sug-head"><span class="pa-sug-title" style="color:${c.color}">${c.label}</span><span class="pa-sug-cnt">${cats[c.key]}</span></div>
              <p class="pa-sug-text">${PA_SUGS[c.key]}</p>
            </div>`).join('')}
        </div>
      </div>

      <div class="pa-card pa-plan-card">
        <div class="pa-card-title">📅 Plan de Acción — Recuperación y NSP</div>
        <div class="pa-plan-grid">
          <div>
            <div class="pa-plan-sub">⚠️ Lista de Recuperación (${toRecover.length} alumnos)</div>
            <p class="pa-plan-note">Irán a recuperación una semana después de la entrega del primer examen.</p>
            <ul class="pa-recup-list">
              ${toRecover.length ? toRecover.map(s => `
                <li class="pa-recup-item">
                  <span class="pa-recup-name">#${s.id} ${s.name}</span>
                  <span class="pa-grade-chip" style="background:${s.grade<=55?'#ef4444':'#f97316'};color:#fff">${s.grade}</span>
                </li>`).join('') : '<li class="pa-empty-msg">Sin alumnos a recuperación ✅</li>'}
            </ul>
          </div>
          <div>
            <div class="pa-plan-sub">📋 Prueba Pendiente — NSP (${nsp.length})</div>
            <p class="pa-plan-note">Harán la prueba el mismo día que los alumnos en recuperación.</p>
            <ul class="pa-recup-list">
              ${nsp.length ? nsp.map(s => `
                <li class="pa-recup-item">
                  <span class="pa-recup-name">#${s.id} ${s.name}</span>
                  <span class="pa-grade-chip" style="background:#d1d5db;color:#374151">NSP</span>
                </li>`).join('') : '<li class="pa-empty-msg">Sin alumnos NSP ✅</li>'}
            </ul>
          </div>
        </div>
      </div>

      <div class="pa-card pa-ng-card" id="pa-ng-capture">
        <div class="pa-ng-titulo">${evaluacion}</div>
        <div class="pa-card-title">📋 Calificaciones según número de Lista</div>
        <div class="pa-ng-grid">${ngGridHtml}</div>
        <div class="pa-ng-msg">"La excelencia es la consecuencia natural de una sola causa: la disciplina. Disciplina para estudiar cada día, cumplir cada tarea y <strong>usar el teléfono exclusivamente como herramienta de aprendizaje</strong>. Quien lo practique alcanzará la calificación más alta."</div>
        <div class="pa-ng-actions">
          <button onclick="paCaptureGrilla()" class="pa-ng-capture-btn"><i class="fa-solid fa-camera"></i> Capturar / Compartir</button>
        </div>
      </div>
    </div>

    <div id="pa-out-padres" style="display:none;"></div>

    <div id="pa-out-planilla" style="display:none;">
      <div class="pa-card" style="padding:0;overflow:hidden;">
        <table class="pa-table">
          <thead><tr><th>#</th><th>Nombre</th><th>${evaluacion}</th></tr></thead>
          <tbody>
            ${students.map(s => {
              const c = paGradeColors(s.grade);
              return `<tr><td class="pa-td-n">${s.id}</td><td class="pa-td-name">${s.name}</td><td class="pa-td-g" style="background:${c.bg};color:${c.txt}">${s.grade ?? '—'}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <button onclick="paPrint()" class="pa-print-btn">
      <i class="fa-solid fa-print"></i> Imprimir / Guardar PDF
    </button>`;

  // Tab switching
  dash.querySelectorAll('.pa-otab').forEach(tab => {
    tab.addEventListener('click', () => {
      dash.querySelectorAll('.pa-otab').forEach(t => t.classList.remove('pa-otab-active'));
      tab.classList.add('pa-otab-active');
      document.getElementById('pa-out-overview').style.display  = tab.dataset.otab === 'overview'  ? '' : 'none';
      document.getElementById('pa-out-planilla').style.display  = tab.dataset.otab === 'planilla'  ? '' : 'none';
      document.getElementById('pa-out-padres').style.display    = tab.dataset.otab === 'padres'    ? '' : 'none';
    });
  });

  document.getElementById('pa-otra-btn')?.addEventListener('click', paOtraPrueba);
  document.getElementById('pa-ir-grado')?.addEventListener('click', () => {
    const g = document.getElementById('pa-grado');
    if (!g) return;
    g.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => g.focus(), 400);
  });
  document.getElementById('pa-ver-msg-btn')?.addEventListener('click', () => {
    const t = dash.querySelector('.pa-otab[data-otab="padres"]');
    if (t) { t.click(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  // Persistencia local + mensajes a padres + sincronización
  // (misionId/forma/tipoEval amarran la nota a la evaluación exacta del banco)
  const misionId = parseInt(document.getElementById('pa-mision')?.value, 10) || null;
  const formaEv  = document.getElementById('pa-forma')?.value || '';
  const tipoEval = document.getElementById('pa-tipo')?.value || 'conceptual';
  /* La materia queda GUARDADA en el análisis para poder filtrar el historial
     aunque la evaluación se haya escrito a mano y no venga del banco. */
  let materia = document.getElementById('pa-materia')?.value || '';
  if (!materia && misionId && typeof MISSIONS !== 'undefined') {
    const mm = MISSIONS.find(x => x.id === misionId);
    if (mm) materia = mm.subject || '';
  }
  paPersistCurrent(students, { grado, seccion, docente, evaluacion, misionId, materia,
    forma: formaEv, tipoEval, parcial, fechaPrueba, grupoId: paGrupoIdDe(grado, seccion) });
  paRenderPadres();
  paRenderHistorial();
  paSincronizarNube(false); // nube de padres (código de lista)

  dash.style.display = '';
  dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── «¿Y ahora?»: la prueba siguiente del mismo grupo ──
   El error que se cometía: tras generar, los alumnos quedaban en pantalla
   con sus notas y el maestro escribía la evaluación nueva ENCIMA, sin
   saber si lo anterior se había guardado. Ahora se dice qué se conserva
   (los alumnos) y qué se borra (las notas y los datos de la prueba), y el
   análisis anterior queda cerrado en el historial. */
async function paOtraPrueba() {
  const ok = await metasConfirm(
    'Este análisis ya está **guardado** en 🗂️ Análisis guardados y sus notas viajaron al asistente de padres.\n\n' +
    'Para la prueba siguiente **se quedan tus alumnos** (sus nombres y números de lista) y ' +
    'se borran **solo las notas** y los datos de la evaluación.\n\n' +
    'Si necesitas corregir esta prueba, ábrela después en 🗂️ Análisis guardados.',
    { icono: '➕', titulo: 'Analizar otra prueba', okTxt: 'Sí, otra prueba' });
  if (!ok) return;

  _paCurrentId = null;   /* el próximo Generar crea un análisis NUEVO */
  _paStudents = [];
  document.querySelectorAll('.pa-student-row .pa-inp-grade-cell').forEach(i => { i.value = ''; });

  /* Grado, sección y docente se conservan: es el mismo grupo. Cambian la
     evaluación y su fecha. El parcial se queda: suelen ser varias pruebas
     dentro del mismo parcial. */
  ['pa-evaluacion', 'pa-fecha'].forEach(id => {
    const e = document.getElementById(id); if (e) e.value = '';
  });
  const mat = document.getElementById('pa-materia');
  if (mat) { mat.value = ''; paFiltrarMisiones(''); }
  const forma = document.getElementById('pa-forma');
  if (forma) forma.value = '';

  const dash = document.getElementById('pa-dashboard');
  if (dash) { dash.style.display = 'none'; dash.innerHTML = ''; }
  paRenderHistorial();

  document.querySelector('#view-plan-accion .pa-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  toast('✏️ Elige la evaluación nueva y escribe sus notas');
}
window.paOtraPrueba = paOtraPrueba;

function paPrint() {
  const students = _paStudents;
  if (!students || !students.length) { toast('Genera el análisis primero'); return; }

  const numeric    = students.filter(s => typeof s.grade === 'number');
  const nsp        = students.filter(s => s.grade === 'NSP');
  const avg        = numeric.length ? (numeric.reduce((a,s) => a + s.grade, 0) / numeric.length) : 0;
  const passing    = numeric.filter(s => s.grade >= 70).length;
  const pRate      = numeric.length ? Math.round((passing / numeric.length) * 100) : 0;
  const toRecover  = numeric.filter(s => s.grade <= 65);
  const cats       = {};
  PA_CATS.forEach(c => { cats[c.key] = numeric.filter(s => s.grade >= c.min && s.grade <= c.max).length; });
  const maxCatV    = Math.max(...Object.values(cats), 1);

  const grado      = document.getElementById('pa-grado')?.value     || '—';
  const seccion    = document.getElementById('pa-seccion')?.value   || '—';
  const docente    = document.getElementById('pa-docente')?.value   || '—';
  const evaluacion = document.getElementById('pa-evaluacion')?.value || 'Evaluación';
  const parcial    = document.getElementById('pa-parcial')?.value   || '';
  const fechaPrueba= document.getElementById('pa-fecha')?.value     || '';
  const fecha      = new Date().toLocaleDateString('es-HN', { year:'numeric', month:'long', day:'numeric' });

  const avgColor   = avg >= 70 ? '#16a34a' : avg >= 60 ? '#d97706' : '#dc2626';

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Plan de Acción — ${evaluacion}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff;}
.page{max-width:190mm;margin:0 auto;padding:12mm 15mm;}
.head{background:#1e3a7c;color:#fff;padding:14px 18px;border-radius:8px;margin-bottom:14px;}
.head-title{font-size:16px;font-weight:900;letter-spacing:.8px;}
.head-sub{font-size:11px;opacity:.85;margin-top:3px;}
.head-meta{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;font-size:10px;background:rgba(255,255,255,.15);padding:7px 10px;border-radius:6px;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;page-break-inside:avoid;}
.stat{border:1px solid #e2e8f0;border-radius:7px;padding:10px;text-align:center;}
.stat-lbl{font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.stat-val{font-size:22px;font-weight:900;color:#1e3a7c;margin:3px 0;}
.stat-sub{font-size:9px;color:#94a3b8;}
.sec-title{font-size:12px;font-weight:800;color:#1e3a7c;border-bottom:2px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;page-break-inside:avoid;}
.card{border:1px solid #e2e8f0;border-radius:7px;padding:12px;page-break-inside:avoid;}
.dist-row{margin-bottom:7px;}
.dist-info{display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;}
.dist-bar{height:6px;background:#f1f5f9;border-radius:4px;overflow:hidden;}
.dist-fill{height:100%;border-radius:4px;}
.sug-item{border-left:4px solid;padding:7px 9px;border-radius:4px;margin-bottom:7px;page-break-inside:avoid;}
.sug-head{display:flex;justify-content:space-between;margin-bottom:3px;}
.sug-title{font-size:10px;font-weight:800;}
.sug-cnt{font-size:9px;background:rgba(0,0,0,.12);padding:1px 6px;border-radius:6px;}
.sug-text{font-size:10px;color:#374151;line-height:1.4;}
.plan-box{border:1px solid #fecaca;border-left:4px solid #ef4444;border-radius:7px;padding:12px;margin-bottom:14px;}
.plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;}
.plan-sub{font-size:11px;font-weight:800;margin-bottom:5px;}
.plan-note{font-size:9px;color:#64748b;background:#f8fafc;padding:5px 7px;border-radius:5px;margin-bottom:6px;line-height:1.4;}
.rlist{list-style:none;}
.ritem{display:flex;justify-content:space-between;align-items:center;padding:3px 7px;border:1px solid #e2e8f0;border-radius:5px;margin-bottom:3px;font-size:10px;page-break-inside:avoid;}
.chip{font-weight:700;padding:2px 7px;border-radius:5px;font-size:9px;}
table{width:100%;border-collapse:collapse;font-size:11px;}
thead tr{background:#eff6ff;page-break-inside:avoid;}
th{color:#1e3a7c;font-weight:700;padding:7px 10px;text-align:left;border:1px solid #e2e8f0;font-size:9px;text-transform:uppercase;letter-spacing:.4px;}
td{padding:5px 10px;border:1px solid #e2e8f0;}
tr{page-break-inside:avoid;}
tbody tr:nth-child(even){background:#f8fafc;}
.td-n{text-align:center;font-weight:700;color:#94a3b8;width:30px;}
.td-g{text-align:center;font-weight:800;width:80px;}
.footer{font-size:9px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:8px;margin-top:14px;}
.pb{page-break-before:always;}
@media print{body{padding:0;}.page{padding:8mm 12mm;}}
</style></head><body><div class="page">

<div class="head">
  <div class="head-title">ANÁLISIS Y PLAN DE ACCIÓN</div>
  <div class="head-sub">📌 ${evaluacion}${parcial ? ' · Parcial ' + parcial : ''}${fechaPrueba ? ' · Realizada el ' + paFechaBonita(fechaPrueba) : ''}</div>
  <div class="head-meta">
    <span><b>Grado:</b> ${grado}</span><span><b>Sección:</b> ${seccion}</span>
    <span><b>Docente:</b> ${docente}</span><span><b>Fecha:</b> ${fecha}</span>
  </div>
</div>

<div class="stats">
  <div class="stat"><div class="stat-lbl">En Lista</div><div class="stat-val">${students.length}</div></div>
  <div class="stat"><div class="stat-lbl">Promedio</div><div class="stat-val" style="color:${avgColor}">${avg.toFixed(1)}</div></div>
  <div class="stat"><div class="stat-lbl">Aprobación</div><div class="stat-val">${pRate}%</div><div class="stat-sub">≥ 70%</div></div>
  <div class="stat"><div class="stat-lbl">Recuperación</div><div class="stat-val">${toRecover.length}</div><div class="stat-sub">nota ≤ 65</div></div>
</div>

<div class="two-col">
  <div class="card">
    <div class="sec-title">Distribución</div>
    ${PA_CATS.map(c => `<div class="dist-row"><div class="dist-info"><span>${c.label}</span><span>${cats[c.key]} alum.</span></div><div class="dist-bar"><div class="dist-fill" style="width:${Math.round((cats[c.key]/maxCatV)*100)}%;background:${c.color}"></div></div></div>`).join('')}
  </div>
  <div class="card">
    <div class="sec-title">Sugerencias Pedagógicas</div>
    ${PA_CATS.filter(c => cats[c.key] > 0).map(c => `<div class="sug-item" style="border-left-color:${c.color};background:${c.bg}"><div class="sug-head"><span class="sug-title" style="color:${c.color}">${c.label}</span><span class="sug-cnt">${cats[c.key]}</span></div><p class="sug-text">${PA_SUGS[c.key]}</p></div>`).join('')}
  </div>
</div>

<div class="plan-box">
  <div class="sec-title">Plan de Acción — Recuperación y NSP</div>
  <div class="plan-grid">
    <div>
      <div class="plan-sub">⚠️ Lista de Recuperación (${toRecover.length})</div>
      <div class="plan-note">Irán a recuperación una semana después de la entrega del primer examen.</div>
      <ul class="rlist">${toRecover.length ? toRecover.map(s => `<li class="ritem"><span>#${s.id} ${s.name}</span><span class="chip" style="background:${s.grade<=55?'#ef4444':'#f97316'};color:#fff">${s.grade}</span></li>`).join('') : '<li style="font-size:10px;color:#64748b;font-style:italic">Sin alumnos ✅</li>'}</ul>
    </div>
    <div>
      <div class="plan-sub">📋 NSP — Prueba Pendiente (${nsp.length})</div>
      <div class="plan-note">Harán la prueba el mismo día que los alumnos en recuperación.</div>
      <ul class="rlist">${nsp.length ? nsp.map(s => `<li class="ritem"><span>#${s.id} ${s.name}</span><span class="chip" style="background:#d1d5db;color:#374151">NSP</span></li>`).join('') : '<li style="font-size:10px;color:#64748b;font-style:italic">Sin alumnos ✅</li>'}</ul>
    </div>
  </div>
</div>

<div class="pb"></div>
<div class="sec-title" style="margin-bottom:10px;">Planilla de Calificaciones</div>
<table>
  <thead><tr><th class="td-n">#</th><th>Nombre del Estudiante</th><th class="td-g">${evaluacion}</th></tr></thead>
  <tbody>
    ${students.map(s => { const c = paGradeColors(s.grade); return `<tr><td class="td-n">${s.id}</td><td>${s.name}</td><td class="td-g" style="background:${c.bg};color:${c.txt}">${s.grade ?? '—'}</td></tr>`; }).join('')}
  </tbody>
</table>

<div class="footer">Generado con M.E.T.A.S. — Misiones Educativas Tecnológicas Asincrónicas y Sincrónicas · ${fecha}</div>
</div>
</body></html>`;

  /* Con la barra «cerrar y volver» de adPrintAbrir (registros-admin.js,
     misma página); el respaldo es por si este archivo se usa suelto. */
  const printWin = (typeof adPrintAbrir === 'function') ? adPrintAbrir(html) : window.open('', '_blank');
  if (!printWin) {
    if (typeof adPrintAbrir !== 'function') toast('Activa las ventanas emergentes para imprimir');
    return;
  }
  if (typeof adPrintAbrir !== 'function') {
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  }
  printWin.focus();
  setTimeout(() => printWin.print(), 700);
}
window.paPrint = paPrint;

async function paCaptureGrilla() {
  if (typeof html2canvas === 'undefined') { toast('⚠️ Cargando... intenta de nuevo'); return; }
  const card = document.getElementById('pa-ng-capture');
  const btn  = card?.querySelector('.pa-ng-capture-btn');
  const acts = card?.querySelector('.pa-ng-actions');
  if (!card) return;
  if (btn)  { btn.disabled = true; btn.innerHTML = '⏳ Capturando...'; }
  if (acts) acts.style.display = 'none';
  try {
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    if (acts) acts.style.display = '';
    const dataUrl   = canvas.toDataURL('image/png');
    const grado     = document.getElementById('pa-grado')?.value    || 'grado';
    const seccion   = document.getElementById('pa-seccion')?.value  || 'seccion';
    /* El NOMBRE DEL ARCHIVO va sin adornos: el grupo se escribe «6º-1» en
       pantalla, pero la «º» y los acentos dan problemas al guardar y al
       compartir, así que aquí se queda «calificaciones-6-1.png». */
    const limpio    = s => String(s).normalize('NFD').replace(/[^\w-]/g, '') || 'x';
    const fileName  = `calificaciones-${limpio(grado)}-${limpio(seccion)}.png`;
    const cap = window.Capacitor;
    if (cap && cap.isNativePlatform?.() && cap.Plugins?.Filesystem && cap.Plugins?.Share) {
      const result = await cap.Plugins.Filesystem.writeFile({ path: fileName, data: dataUrl.split(',')[1], directory: 'CACHE' });
      await cap.Plugins.Share.share({ url: result.uri, dialogTitle: 'Guardar / Compartir Calificaciones' });
    } else {
      const a = document.createElement('a');
      a.href = dataUrl; a.download = fileName; a.click();
    }
  } catch(e) {
    if (acts) acts.style.display = '';
    if (e.name !== 'AbortError') toast('⚠️ No se pudo capturar la imagen');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-camera"></i> Capturar / Compartir'; }
  }
}
window.paCaptureGrilla = paCaptureGrilla;

/* ─────────────────────────────────────────────
   PERSISTENCIA + MENSAJES A PADRES + SINCRONIZACIÓN
   Los análisis se guardan en METAS_PLANACCION_V1 (local) y se
   sincronizan a la nube de padres de Supabase (metas_guardar_plan,
   por código de lista). Cada alumno lleva un mensaje para su
   padre/madre generado según su categoría, editable, que también
   viaja a la nube — la base que el chatbot de padres consulta.
───────────────────────────────────────────── */

const PA_KEY  = 'METAS_PLANACCION_V1';
const PA_SITE = 'https://metas.policastsapien.com/';
let _paCurrentId = null;
let _paMsgTimer  = null;

function paLoadData() {
  try {
    const o = JSON.parse(localStorage.getItem(PA_KEY));
    return (o && Array.isArray(o.analisis)) ? o : { analisis: [] };
  } catch (_) { return { analisis: [] }; }
}
function paSaveData(d) { try { localStorage.setItem(PA_KEY, JSON.stringify(d)); } catch (_) {} }
function paEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

function paCatKey(grade) {
  if (grade === 'NSP') return 'nsp';
  if (typeof grade !== 'number') return null;
  const c = PA_CATS.find(x => grade >= x.min && grade <= x.max);
  return c ? c.key : null;
}

/* Mensajes para padres por categoría — borradores que el maestro puede editar */
const PA_MSG_PADRES = {
  avanzado: (n, g, t) =>
    `🌟 ¡Excelentes noticias! ${n} obtuvo ${g}/100 en «${t}». Su dedicación está dando frutos: felicítele en casa, ese reconocimiento vale oro. Está en el nivel Avanzado y puede retarse con temas superiores.`,
  muyBueno: (n, g, t) =>
    `💪 ¡Muy buen trabajo! ${n} obtuvo ${g}/100 en «${t}» (nivel Muy Bueno). Domina el tema; con un poco de práctica adicional puede alcanzar la excelencia. Anímele a seguir así.`,
  satisfactorio: (n, g, t) =>
    `📘 ${n} obtuvo ${g}/100 en «${t}» (nivel Satisfactorio). Aprobó, pero conviene afianzar lo aprendido: 15 minutos de repaso al día esta semana harán una gran diferencia. Su apoyo en casa es clave.`,
  debeMejorar: (n, g, t) =>
    `⚠️ ${n} obtuvo ${g}/100 en «${t}» y necesita reforzar el tema esta semana (irá a recuperación). No es motivo de castigo sino de acompañamiento: pregúntele qué aprendió hoy y ayúdele a practicar un poco cada día.`,
  insatisfactorio: (n, g, t) =>
    `🚨 IMPORTANTE: ${n} obtuvo ${g}/100 en «${t}» y necesita apoyo inmediato; irá a recuperación. Le invito a conversar conmigo para acordar juntos un plan de apoyo. Con su ayuda en casa, ${n} puede lograrlo — nadie aprende sin acompañamiento.`,
  nsp: (n, g, t) =>
    `📋 ${n} no se presentó a la evaluación «${t}» (NSP). Podrá hacerla el día programado para pruebas pendientes. Por favor asegúrese de que asista; si hubo una causa de fuerza mayor, comuníquemela.`,
};

function paMsgPadre(name, grade, tema) {
  const k = paCatKey(grade);
  if (!k) return '';
  /* sin nombre: referirse por código de lista (privacidad y claridad) */
  const quien = /^#\d+$/.test(name) ? `Su hijo/a (código ${name})` : name;
  let msg = PA_MSG_PADRES[k](quien, grade, tema || 'la evaluación');
  /* Si el tema coincide con una misión del catálogo, sugerir repaso con enlace */
  if (typeof _findMissionByTitle === 'function' && k !== 'avanzado') {
    const m = _findMissionByTitle(tema || '');
    if (m) msg += `\n📱 Puede repasar gratis en M.E.T.A.S: «${m.title}» → ${PA_SITE}${encodeURI(m.url)}`;
  }
  return msg;
}

/* Guarda (o actualiza) el análisis actual; conserva mensajes editados y estado de envío */
function paPersistCurrent(students, meta) {
  const d = paLoadData();
  let a = _paCurrentId ? d.analisis.find(x => x.id === _paCurrentId) : null;
  if (!a) {
    /* mismo grupo y misma evaluación (incluida la Forma) → actualizar, no duplicar */
    a = d.analisis.find(x =>
      (x.evaluacion || '') === (meta.evaluacion || '') &&
      String(x.forma || '') === String(meta.forma || '') &&
      (x.grado || '') === (meta.grado || '') &&
      (x.seccion || '') === (meta.seccion || ''));
    if (a) _paCurrentId = a.id;
  }
  const prev = a ? (a.students || []) : [];

  const rows = students.map(s => {
    const k    = paCatKey(s.grade);
    const cat  = PA_CATS.find(c => c.key === k);
    const same = prev.find(p => p.num === s.id && String(p.nota) === String(s.grade));
    const msg  = (same && same.msgEdit) ? same.msg : paMsgPadre(s.name, s.grade, meta.evaluacion);
    return {
      num: s.id, nombre: s.name, nota: s.grade,
      categoria: k === 'nsp' ? 'NSP' : (cat ? cat.label : ''),
      sugerencia: (k && k !== 'nsp') ? PA_SUGS[k] : (k === 'nsp' ? 'Programar prueba pendiente.' : ''),
      msg,
      msgEdit: !!(same && same.msgEdit),
      env: (same && same.msg === msg) ? (same.env || 0) : 0,
    };
  });

  if (!a) {
    a = { id: 'A' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: new Date().toISOString() };
    d.analisis.push(a);
    _paCurrentId = a.id;
  }
  Object.assign(a, meta, { students: rows });
  if (d.analisis.length > 40) d.analisis = d.analisis.slice(-40);
  paSaveData(d);
  return a;
}

/* ── Pestaña Padres ── */
function paRenderPadres() {
  const cont = document.getElementById('pa-out-padres');
  if (!cont) return;
  const d = paLoadData();
  const a = d.analisis.find(x => x.id === _paCurrentId);
  if (!a) { cont.innerHTML = ''; return; }

  cont.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">👨‍👩‍👧 Mensajes para padres — ${paEsc(a.evaluacion)}</div>
      <p class="pa-optional-hint">Generados según la categoría de cada alumno. Edite el que quiera (se guarda solo)
        y envíelo por WhatsApp. Todo viaja además a la nube de padres para que la familia lo consulte con su clave.</p>
      ${a.students.map(s => {
        const c = paGradeColors(typeof s.nota === 'number' ? s.nota : undefined);
        return `
        <div class="pa-pad-row">
          <div class="pa-pad-head">
            <span class="pa-pad-num">#${s.num}</span>
            <span class="pa-pad-name">${paEsc(s.nombre)}</span>
            <span class="pa-grade-chip" style="background:${s.nota === 'NSP' ? '#d1d5db' : c.bg};color:${s.nota === 'NSP' ? '#374151' : c.txt}">${paEsc(s.nota)}</span>
            <span class="pa-pad-env" title="Avisado por WhatsApp">${s.env ? '📱✅' : ''}</span>
          </div>
          <textarea class="pa-pad-ta" data-num="${s.num}" rows="4">${paEsc(s.msg)}</textarea>
          <div class="pa-pad-actions">
            <button class="pa-wa-btn" data-num="${s.num}"><i class="fa-brands fa-whatsapp"></i> WhatsApp al padre</button>
            <button class="pa-copy-btn" data-num="${s.num}"><i class="fa-regular fa-copy"></i> Copiar</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  const getStudent = num => {
    const dd = paLoadData();
    const aa = dd.analisis.find(x => x.id === _paCurrentId);
    return { d: dd, a: aa, s: aa && aa.students.find(x => x.num === num) };
  };

  cont.querySelectorAll('.pa-pad-ta').forEach(ta => {
    ta.addEventListener('input', () => {
      clearTimeout(_paMsgTimer);
      _paMsgTimer = setTimeout(() => {
        const { d: dd, s } = getStudent(+ta.dataset.num);
        if (!s) return;
        s.msg = ta.value; s.msgEdit = true; s.env = 0;
        paSaveData(dd);
        paNubeProgramar();   /* el mensaje corregido llega solo al chatbot */
      }, 400);
    });
  });

  cont.querySelectorAll('.pa-wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { a: aa, s } = getStudent(+btn.dataset.num);
      if (!s) return;
      const texto = `👨‍🏫 *Mensaje del docente ${aa.docente || ''}* · ${aa.evaluacion || ''}\n\n${s.msg}\n\n_M.E.T.A.S — Misiones Educativas_`;
      window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
      // Marca «avisado por WhatsApp»: se ve en esta fila (📱✅) y en el
      // resumen del historial. Editar el mensaje la reinicia (hay que
      // volver a avisar si cambió el texto).
      const { d: dd2, s: s2 } = getStudent(+btn.dataset.num);
      if (s2) { s2.env = 1; paSaveData(dd2); }
      const chip = btn.closest('.pa-pad-row') && btn.closest('.pa-pad-row').querySelector('.pa-pad-env');
      if (chip) chip.textContent = '📱✅';
    });
  });

  cont.querySelectorAll('.pa-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { s } = getStudent(+btn.dataset.num);
      if (!s) return;
      try { navigator.clipboard.writeText(s.msg); toast('📋 Mensaje copiado'); } catch (_) {}
    });
  });
}

/* ── Historial de análisis ──
   El maestro acumula decenas de análisis (hasta 40) y el listado se vuelve
   larguísimo, así que se filtra por PARCIAL y por MATERIA con un toque.
   Los filtros se recuerdan junto a los datos (PA_KEY.histFiltros). */
const PA_HIST_PARCIALES = ['I', 'II', 'III', 'IV'];
const PA_HIST_MATERIAS = [
  { key: 'español',      chip: '📖 Español',      nom: 'Español' },
  { key: 'matemáticas',  chip: '🔢 Matemáticas',  nom: 'Matemáticas' },
  { key: 'naturales',    chip: '🌱 Naturales',    nom: 'Ciencias Naturales' },
  { key: 'sociales',     chip: '🌎 Sociales',     nom: 'Ciencias Sociales' },
  { key: 'programación', chip: '💻 Programación', nom: 'Programación' },
  { key: 'robótica',     chip: '🤖 Robótica',     nom: 'Robótica' },
  { key: 'inglés',       chip: '🔤 Inglés',       nom: 'Inglés' },
];
/* «sin» es el valor de los chips «Sin parcial» / «Sin materia»: '' ya
   significa «no filtrar», así que los análisis sueltos necesitan su propia
   marca para poder encontrarlos. */
const PA_HIST_SIN = 'sin';

/* Materia del análisis: manda la que quedó guardada; los análisis viejos la
   deducen de la misión del banco a la que se amarraron. */
function paMateriaDe(a) {
  if (a && a.materia) return a.materia;
  if (a && a.misionId && typeof MISSIONS !== 'undefined') {
    const m = MISSIONS.find(x => x.id === a.misionId);
    if (m && m.subject) return m.subject;
  }
  return '';
}
function paMateriaNom(k) {
  const x = PA_HIST_MATERIAS.find(y => y.key === k);
  return x ? x.nom : k;
}
function paHistFiltros() {
  const f = paLoadData().histFiltros || {};
  return { parcial: f.parcial || '', materia: f.materia || '' };
}
function paHistFiltroSet(campo, valor) {
  const d = paLoadData();
  const f = paHistFiltros();
  f[campo] = (f[campo] === valor) ? '' : valor;   // tocar el mismo chip = quitar el filtro
  d.histFiltros = f;
  paSaveData(d);
  paRenderHistorial();
}
function paHistPasa(a, f) {
  const p = String(a.parcial || '');
  const k = paMateriaDe(a);
  if (f.parcial === PA_HIST_SIN ? !!p : (f.parcial && p !== f.parcial)) return false;
  if (f.materia === PA_HIST_SIN ? !!k : (f.materia && k !== f.materia)) return false;
  return true;
}

/* Chips de filtro: solo se ofrecen los parciales y las materias que DE VERDAD
   hay guardados, para no llenar la tarjeta de botones que no filtran nada. */
function paRenderHistFiltros(todos, f) {
  const box = document.getElementById('pa-hist-filtros');
  if (!box) return todos;

  const opsP = PA_HIST_PARCIALES
    .filter(p => todos.some(a => String(a.parcial || '') === p))
    .map(p => ({ v: p, t: 'P-' + p }));
  if (todos.some(a => !a.parcial)) opsP.push({ v: PA_HIST_SIN, t: 'Sin parcial' });
  const opsM = PA_HIST_MATERIAS
    .filter(x => todos.some(a => paMateriaDe(a) === x.key))
    .map(x => ({ v: x.key, t: x.chip }));
  if (todos.some(a => !paMateriaDe(a))) opsM.push({ v: PA_HIST_SIN, t: '📋 Sin materia' });

  /* Una fila con una sola opción no filtra nada y solo estorba, así que no se
     dibuja. Ningún filtro puede quedar activo sin su fila a la vista: si su
     valor ya no existe (se borró el último análisis) o la fila desaparece, el
     filtro se cae solo y se olvida, para no dejar la lista corta sin salida. */
  const vivo = (sel, ops) => (ops.length > 1 && ops.some(o => o.v === sel)) ? sel : '';
  const antes = f.parcial + '|' + f.materia;
  f.parcial = vivo(f.parcial, opsP);
  f.materia = vivo(f.materia, opsM);
  if (antes !== f.parcial + '|' + f.materia) {
    const d = paLoadData();
    d.histFiltros = { parcial: f.parcial, materia: f.materia };
    paSaveData(d);
  }

  const vistos = todos.filter(a => paHistPasa(a, f));
  const etiquetas = [];
  if (f.parcial) etiquetas.push(f.parcial === PA_HIST_SIN ? 'sin parcial' : 'Parcial ' + f.parcial);
  if (f.materia) etiquetas.push(f.materia === PA_HIST_SIN ? 'sin materia' : paMateriaNom(f.materia));

  const fila = (campo, lbl, todosTxt, ops, sel) => (ops.length < 2 ? '' : `
      <div class="pa-hist-flbl">${lbl}</div>
      <div class="pa-hist-chips">
        <button class="pa-hist-chip${sel ? '' : ' pa-hist-chip-sel'}" data-fcampo="${campo}" data-fvalor="">${todosTxt}</button>
        ${ops.map(o => `<button class="pa-hist-chip${sel === o.v ? ' pa-hist-chip-sel' : ''}" data-fcampo="${campo}" data-fvalor="${paEsc(o.v)}">${o.t}</button>`).join('')}
      </div>`);

  box.innerHTML =
    fila('parcial', '🗓️ Parcial', 'Todos', opsP, f.parcial) +
    fila('materia', '📚 Materia', 'Todas', opsM, f.materia) +
    `<div class="pa-hist-count">${vistos.length === todos.length
        ? `${todos.length} análisis guardado${todos.length === 1 ? '' : 's'}`
        : `${vistos.length} de ${todos.length} análisis${etiquetas.length ? ' · ' + paEsc(etiquetas.join(' · ')) : ''}`}</div>`;

  box.querySelectorAll('.pa-hist-chip').forEach(b =>
    b.addEventListener('click', () => paHistFiltroSet(b.dataset.fcampo, b.dataset.fvalor)));

  return vistos;
}

function paRenderHistorial() {
  const card = document.getElementById('pa-historial-card');
  const list = document.getElementById('pa-historial-list');
  if (!card || !list) return;
  const d = paLoadData();
  const fbox = document.getElementById('pa-hist-filtros');
  if (!d.analisis.length) {
    card.style.display = 'none';
    if (fbox) fbox.innerHTML = '';
    return;
  }
  card.style.display = '';

  const vistos = paRenderHistFiltros([...d.analisis].reverse(), paHistFiltros());
  if (!vistos.length) {
    list.innerHTML = `<p class="pa-hist-vacio">🔎 Ningún análisis guardado coincide con este filtro.
      Toca <strong>Todos</strong> y <strong>Todas</strong> para ver el listado completo.</p>`;
    return;
  }

  list.innerHTML = vistos.map(a => {
    const nums = a.students.filter(s => typeof s.nota === 'number');
    const avg  = nums.length ? (nums.reduce((x, s) => x + s.nota, 0) / nums.length).toFixed(1) : '—';
    // Estado REAL del asistente de padres: cuenta lo que aún no está en la
    // nube (firma sb desactualizada). La subida es AUTOMÁTICA; aquí solo se
    // muestra con claridad y, si hay pendientes, se ofrece subir al toque.
    const pendNube = a.students.filter(s => {
      const codigo = paCodigoLista(a, s);
      return codigo && s.sb !== paSbFirma(a, s, codigo);
    }).length;
    const waEnv = a.students.filter(s => s.env).length;
    const nube = pendNube
      ? `<span class="pa-hist-nube pend">☁️ ${pendNube} por subir al asistente</span>`
      : `<span class="pa-hist-nube ok">☁️ En el asistente de padres ✅</span>`;
    const wa = waEnv ? ` <span class="pa-hist-wa">📱 ${waEnv}/${a.students.length} avisados por WhatsApp</span>` : '';
    const mat = paMateriaDe(a);
    return `
      <div class="pa-hist-row">
        <div class="pa-hist-info">
          <span class="pa-hist-titulo">${paEsc(a.evaluacion || 'Evaluación')}${a.parcial ? ' · P-' + paEsc(a.parcial) : ''}</span>
          <span class="pa-hist-meta">${(a.t || '').slice(0, 10)} · ${paEsc(paGrupoTxt(a.grado, a.seccion))} · ${a.students.length} alumnos · prom. ${avg}${mat ? ' · ' + paEsc(paMateriaNom(mat)) : ''}</span>
          <span class="pa-hist-meta">${nube}${wa}</span>
        </div>
        ${pendNube ? `<button class="pa-hist-subir" data-id="${a.id}">☁️ Subir ahora</button>` : ''}
        <button class="pa-hist-abrir" data-id="${a.id}">Abrir</button>
        <button class="pa-hist-borrar" data-id="${a.id}" aria-label="Eliminar">🗑</button>
      </div>`;
  }).join('');

  // «Subir ahora»: dispara la misma sincronización automática, a pedido.
  // El análisis QUEDA guardado (subir nunca lo borra: sirve para actualizar).
  list.querySelectorAll('.pa-hist-subir').forEach(b =>
    b.addEventListener('click', async () => {
      b.disabled = true; b.textContent = '⏳ Subiendo…';
      await paSincronizarNube(true);
      paRenderHistorial();
    }));

  list.querySelectorAll('.pa-hist-abrir').forEach(b =>
    b.addEventListener('click', () => paAbrirAnalisis(b.dataset.id)));
  list.querySelectorAll('.pa-hist-borrar').forEach(b =>
    b.addEventListener('click', async () => {
      if (!await metasConfirm('¿Eliminar este análisis guardado?', { icono: '🗑', titulo: 'Plan de Acción', okTxt: 'Sí, eliminar' })) return;
      const d2 = paLoadData();
      d2.analisis = d2.analisis.filter(x => x.id !== b.dataset.id);
      paSaveData(d2);
      if (_paCurrentId === b.dataset.id) _paCurrentId = null;
      paRenderHistorial();
      paSincronizarNube(false);
    }));
}

function paAbrirAnalisis(id) {
  const d = paLoadData();
  const a = d.analisis.find(x => x.id === id);
  if (!a) return;
  _paCurrentId = id;
  const set = (elId, v) => { const el = document.getElementById(elId); if (el) el.value = v || ''; };
  set('pa-grado', a.grado); set('pa-seccion', a.seccion);
  set('pa-docente', a.docente); set('pa-evaluacion', a.evaluacion);
  paPoblarMisiones(); // por si el historial se abre antes de entrar a la vista
  /* la materia del análisis manda el filtro para que su misión aparezca (y
     para que al volver a generarlo no se pierda la materia guardada) */
  const materiaA = paMateriaDe(a);
  set('pa-materia', materiaA);
  paFiltrarMisiones(materiaA, a.misionId || '');
  set('pa-mision', a.misionId || ''); set('pa-forma', a.forma || '');
  set('pa-tipo', a.tipoEval || 'conceptual'); set('pa-parcial', a.parcial || '');
  set('pa-fecha', a.fechaPrueba || '');
  const list = document.getElementById('pa-students-list');
  if (list) {
    list.innerHTML = '';
    a.students.forEach(s => paAddRow(s.num, s.nombre.startsWith('#') ? '' : s.nombre, String(s.nota)));
  }
  paGenerate();
}

/* Carpeta canónica de la misión (la misma que usa el registro) cuando el
   análisis quedó amarrado a una misión del banco */
function paMisionCanon(a) {
  let canon = a.evaluacion || '';
  if (a.misionId && typeof MISSIONS !== 'undefined') {
    const m = MISSIONS.find(x => x.id === a.misionId);
    if (m) { try { canon = decodeURIComponent((m.url || '').split('/')[1] || '') || canon; } catch (_) {} }
  }
  return canon;
}

/* ── Selector estructurado de evaluación (banco M.E.T.A.S) ──
   El maestro elige la misión exacta + Forma impresa (1-30) + tipo;
   el nombre se autollena y el análisis guarda misionId/forma/tipoEval
   para que la vista Padre cruce la nota con la evaluación precisa. */
function paPoblarMisiones() {
  paFiltrarMisiones(document.getElementById('pa-materia')?.value || '');
  const sf = document.getElementById('pa-forma');
  if (sf && sf.options.length <= 1) {
    for (let i = 1; i <= 30; i++) {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = 'Forma ' + i;
      sf.appendChild(o);
    }
  }
}

/* El listado de evaluaciones se filtra por materia: con 28 misiones ya
   era largo y con 200 sería inmanejable. Sin materia elegida solo queda
   «Otra evaluación» (escribir a mano sigue siendo posible siempre). */
function paFiltrarMisiones(materia, valorMantener) {
  const sel = document.getElementById('pa-mision');
  if (!sel || typeof MISSIONS === 'undefined') return;
  const actual = valorMantener != null ? String(valorMantener) : sel.value;
  sel.innerHTML = '<option value="">✏️ Otra evaluación (escribir el nombre abajo)</option>';
  if (materia) {
    MISSIONS.filter(m => m.subject === materia).forEach(m => {
      const op = document.createElement('option');
      op.value = m.id;
      op.textContent = m.title;
      sel.appendChild(op);
    });
  }
  /* conservar la selección si sigue disponible en el filtro nuevo */
  if (actual && [...sel.options].some(o => String(o.value) === actual)) sel.value = actual;
}

function paAutoNombre() {
  const id = parseInt(document.getElementById('pa-mision')?.value, 10);
  const m  = (id && typeof MISSIONS !== 'undefined') ? MISSIONS.find(x => x.id === id) : null;
  if (!m) return; // «Otra evaluación»: se respeta lo escrito a mano
  const forma = document.getElementById('pa-forma')?.value || '';
  const tipo  = document.getElementById('pa-tipo')?.value || 'conceptual';
  const inp = document.getElementById('pa-evaluacion');
  if (inp) inp.value = m.title +
    (tipo === 'operativa' ? ' · Prueba operativa' : '') +
    (forma ? ' — Forma ' + forma : '');
}

/* ── Nube M.E.T.A.S (Supabase): consulta de padres por código de lista ──
   Cada fila del análisis sube con su código (grado+sección+número, ej. 6A12).
   Firma nota|mensaje: si el maestro corrige, la fila se reenvía y la nube
   se ACTUALIZA (upsert por evento_id en metas_guardar_plan). Offline-first:
   sin internet no se bloquea nada; se reintenta al volver la conexión. */
function paSbCfg() {
  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  try {
    url = localStorage.getItem('METAS_SB_URL') || url;
    key = localStorage.getItem('METAS_SB_KEY') || key;
  } catch (_) {}
  return { url, key };
}

/* ── Claves de familia (códigos secretos por alumno) ──
   Un código tipo «6A15» es adivinable (el compañero prueba 6A16).
   Por eso cada alumno recibe: número de lista + 4 letras ALEATORIAS
   (ej. 15K7QM). Se generan solas en el teléfono del maestro, quedan
   guardadas en METAS_CODIGOS_V1 (mismo alumno = mismo código siempre)
   y se entregan a cada familia con tiras imprimibles. Alfabeto sin
   caracteres confusos (sin 0/O ni 1/I/L). */
const PA_CODES_KEY = 'METAS_CODIGOS_V1';
const PA_COD_ALFA  = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function paCodesLoad() {
  try { const o = JSON.parse(localStorage.getItem(PA_CODES_KEY)); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}
function paCodesSave(c) { try { localStorage.setItem(PA_CODES_KEY, JSON.stringify(c)); } catch (_) {} }

function paCodigoAlumno(grado, seccion, num) {
  const g = String(grado || '').replace(/\D/g, '');
  const mSec = String(seccion || '').trim().match(/([a-zA-Z0-9])\s*$/);
  const sec = mSec ? mSec[1].toUpperCase() : '';
  const n = String(num || '').replace(/\D/g, '');
  if (!g || !n) return '';
  /* Si «Mi aula» tiene un grupo con este grado y sección, la clave vive
     con ESE grupo (llave 'G:<id>'): así el maestro que trabaja en dos
     colegios nunca mezcla claves. Se prefiere el grupo activo. */
  try {
    const st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    if (st && st.v === 2 && Array.isArray(st.grupos) && typeof adClaveFamilia === 'function') {
      const calza = gr => String(gr.grado || '').replace(/\D/g, '') === g &&
        (((String(gr.seccion || '').trim().match(/([a-zA-Z0-9])\s*$/) || [])[1] || '').toUpperCase() === sec);
      const gr = st.grupos.find(x => x.id === st.activo && calza(x)) || st.grupos.find(calza);
      if (gr) return adClaveFamilia(gr.id, n);
    }
  } catch (_) {}
  /* sin grupo en Mi aula: comportamiento clásico (llave 'grado|sección') */
  const codes = paCodesLoad();
  const key = g + '|' + sec;
  const grupo = codes[key] || (codes[key] = {});
  if (!grupo[n]) {
    let suf = '';
    for (let i = 0; i < 4; i++) suf += PA_COD_ALFA[Math.floor(Math.random() * PA_COD_ALFA.length)];
    grupo[n] = n + suf;
    paCodesSave(codes);
  }
  return grupo[n];
}

/* 2026-07-11 → 11/07/2026 (la fecha que el alumno escribió en su prueba) */
function paFechaBonita(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] + '/' + m[2] + '/' + m[1] : String(iso || '');
}

function paCodigoLista(a, s) {
  return paCodigoAlumno(a.grado, a.seccion, s.num);
}

/* SELLO DEL AULA en cada análisis nuevo. El grado y la sección se escriben a
   mano aquí, y el maestro de jornada doble tiene «6º-1» en dos colegios: sin
   sello, Mi aula no puede saber de cuál de las dos es la prueba y las notas
   sugeridas para la boleta se mezclarían. Se resuelve igual que las claves de
   familia (paCodigoAlumno): manda el grupo activo si calza. Los análisis
   viejos no lo llevan y se siguen comparando por grado y sección. */
function paGrupoIdDe(grado, seccion) {
  try {
    const g = String(grado || '').replace(/\D/g, '');
    const mSec = String(seccion || '').trim().match(/([a-zA-Z0-9])\s*$/);
    const sec = mSec ? mSec[1].toUpperCase() : '';
    if (!g) return '';
    const st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    if (!st || st.v !== 2 || !Array.isArray(st.grupos)) return '';
    const calza = gr => String(gr.grado || '').replace(/\D/g, '') === g &&
      (((String(gr.seccion || '').trim().match(/([a-zA-Z0-9])\s*$/) || [])[1] || '').toUpperCase() === sec);
    const gr = st.grupos.find(x => x.id === st.activo && calza(x)) || st.grupos.find(calza);
    return gr ? gr.id : '';
  } catch (_) { return ''; }
}

/* Las TIRAS IMPRIMIBLES de las claves de familia vivían también aquí y
   confundían: la misma clave se imprimía desde dos pantallas distintas.
   Ahora hay UN solo lugar — Mi aula → 👥 Alumnos → 🖨️ Tiras de claves
   (adTirasTodas, en js/tools/registros-admin.js), que es donde nace la
   lista y donde el maestro edita clave por clave. */

/* La firma incluye el CÓDIGO: si el maestro regenera la clave de una
   familia (tira filtrada, cierre de año), la fila se re-publica con la
   clave nueva y la vieja deja de ver los mensajes. Incluye también el
   parcial y la fecha de la prueba: si el maestro los corrige (o si la
   nube los perdió, como pasó con el blindaje del 14 jul), la fila se
   re-publica sola en la siguiente sincronización. */
function paSbFirma(a, s, codigo) {
  return String(s.nota) + '|' + (s.msg || '') + '|' + (codigo || '') + '|' +
         (a.parcial || '') + '|' + (a.fechaPrueba || '');
}

/* Devuelve lo que falta subir y, aparte, cuántas notas NO se pueden subir
   porque su análisis se guardó sin Grado: sin grado no hay clave de familia
   (paCodigoAlumno) y esa nota jamás llegaría al asistente. Hay que decirlo,
   no dejar creer que está publicada. */
function paSbPendientes(d) {
  const filas = [];
  filas.sinCodigo = 0;
  d.analisis.forEach(a => (a.students || []).forEach(s => {
    const codigo = paCodigoLista(a, s);
    if (!codigo) { filas.sinCodigo++; return; }
    if (s.sb === paSbFirma(a, s, codigo)) return; // ya está en la nube tal cual
    filas.push({
      evento_id: 'PASB-' + a.id + '-' + s.num,
      codigo,
      num: String(s.num || ''), alumno: s.nombre || '',
      grado: a.grado || '', seccion: a.seccion || '', docente: a.docente || '',
      evaluacion: a.evaluacion || '', mision: paMisionCanon(a),
      forma: String(a.forma || ''), tipo: a.tipoEval || '', parcial: a.parcial || '',
      fecha_prueba: a.fechaPrueba || '',
      nota: (typeof s.nota === 'number') ? s.nota : '', base: 100,
      nsp: s.nota === 'NSP',
      categoria: s.categoria || '', mensaje: s.msg || '',
      fecha_analisis: a.t || '',
    });
  }));
  return filas;
}

/* El estado de la nube se dice en DOS lugares: la tarjeta 🔑 Nube de padres
   (al pie) y el aviso que sale encima del análisis recién generado, que es
   donde el maestro está mirando en ese momento. */
function paNubeEstado(txt, corto) {
  const st = document.getElementById('pa-sb-status');
  if (st) st.textContent = txt;
  const li = document.getElementById('pa-listo-estado');
  if (li) li.textContent = corto || txt;
}

let _paSbBusy = false;
/* Editar un mensaje ya publicado también debe llegar a la nube: mismo
   auto-publish con calma (4 s) que usa Mi aula (adSyncProgramar) */
let _paNubeT = null;
function paNubeProgramar() {
  clearTimeout(_paNubeT);
  _paNubeT = setTimeout(() => paSincronizarNube(false), 4000);
}
async function paSincronizarNube(manual) {
  if (_paSbBusy) return;
  const d = paLoadData();
  const filas = paSbPendientes(d);
  if (!filas.length) {
    if (filas.sinCodigo) {
      paNubeEstado('🔑 Nube de padres: ⚠️ ' + filas.sinCodigo + ' nota(s) sin Grado: no se les puede ' +
        'crear la clave de familia, así que no llegan al asistente. Ábrelas en 🗂️ Análisis guardados, ' +
        'escribe el grado y vuelve a generar.',
        '⚠️ Falta el Grado: sin él no hay clave de familia y esto no llega al asistente.');
      return;
    }
    paNubeEstado('🔑 Nube de padres: al día.', '✅ Ya está en el asistente: las familias pueden consultarlo.');
    return;
  }
  if (navigator.onLine === false) {
    paNubeEstado('🔑 Nube de padres: 📴 sin conexión, se enviará al haber internet (' + filas.length + ' pendientes).',
      '📴 Sin internet: se sube solo en cuanto tengas señal.');
    return;
  }
  let paCred = null;
  try {
    const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1'));
    if (d && d.codigo && d.clave) paCred = { prof: d.codigo, clave: d.clave };
  } catch (_) {}
  if (!paCred) {
    paNubeEstado('🔒 Entra a tu cuenta docente para publicar las notas en la nube de padres.',
      '🔒 Entra a tu cuenta docente para que las familias lo vean.');
    return;
  }
  _paSbBusy = true;
  paNubeEstado('🔑 Nube de padres: ⏳ enviando ' + Math.min(filas.length, 200) + '…', '⏳ Enviando al asistente…');
  try {
    const lote = filas.slice(0, 200);
    const { url, key } = paSbCfg();
    const r = await fetch(url + '/rest/v1/rpc/metas_guardar_plan', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_prof: paCred.prof, p_clave: paCred.clave, filas: lote }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const _n = await r.clone().json().catch(() => 0);
    if (typeof _n === 'number' && _n < 0) throw new Error('cuenta docente rechazada');
    const enviados = new Set(lote.map(f => f.evento_id));
    d.analisis.forEach(a => (a.students || []).forEach(s => {
      if (enviados.has('PASB-' + a.id + '-' + s.num)) s.sb = paSbFirma(a, s, paCodigoLista(a, s));
    }));
    paSaveData(d);
    paNubeEstado('🔑 Nube de padres: ✅ ' + lote.length + ' nota' + (lote.length !== 1 ? 's' : '') + ' disponibles por código de lista.',
      '✅ Subido: cada familia ya lo ve con su clave.');
    if (manual) toast('✅ Notas enviadas a la nube de padres');
    /* quedaron más de 200 pendientes (re-publicación masiva): siguiente lote solo */
    if (filas.length > lote.length) paNubeProgramar();
  } catch (_) {
    paNubeEstado('🔑 Nube de padres: ⚠️ no se pudo enviar; se reintentará.',
      '⚠️ No se pudo enviar todavía; se reintenta solo.');
  }
  _paSbBusy = false;
}

function paInit() {
  paPoblarMisiones();
  if (_paInitDone) {
    paRenderHistorial();
    paSincronizarNube(false);
    return;
  }
  _paInitDone = true;
  for (let i = 1; i <= 20; i++) paAddRow(i);
  paRenderHistorial();
  paSincronizarNube(false);
}

/* ── Acceso a las herramientas del maestro ──
   El candado numérico «clave del maestro» se ELIMINÓ (jul 2026): pedía
   la clave a cada rato y era horrible para el maestro. Ahora la Zona
   Docente y sus herramientas se protegen SOLO con la CUENTA DE MAESTRO
   (el alumno no tiene la contraseña, y sin sesión las herramientas ni
   se muestran). */
function _paLogged() {
  try { const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); return !!(d && d.codigo); }
  catch (_) { return false; }
}

async function paAbrirPlan() {
  if (!_paLogged()) { toast('Entra con tu cuenta de maestro en la Zona Docente para usar el Plan de Acción'); return; }
  switchView('view-plan-accion'); paInit();
}

/* Barrera reutilizable (se conserva por compatibilidad con los llamados
   existentes): antes pedía la clave del candado; ahora solo confirma que
   hay sesión de maestro. Sin clave numérica que memorizar. */
async function paVerificarPin(motivo) {
  if (_paLogged()) return true;
  toast('Entra con tu cuenta de maestro en la Zona Docente');
  return false;
}
window.paVerificarPin = paVerificarPin;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-plan-btn')?.addEventListener('click', paAbrirPlan);
  document.getElementById('plan-back-btn')?.addEventListener('click', () => switchView('view-perfil'));

  document.getElementById('pa-add-student-btn')?.addEventListener('click', () => {
    // Sugiere el número que FALTA (rellena huecos: 1,2,3,5 → propone el 4);
    // con la lista corrida propone el siguiente. Siempre editable.
    paAddRow(paSiguienteNum());
  });

  /* La lista maestra vive en «Mi aula»: aquí solo se trae con un toque */
  document.getElementById('pa-traer-aula')?.addEventListener('click', async () => {
    let st = null;
    try { st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1')); } catch (_) {}
    const g = (st && st.v === 2 && Array.isArray(st.grupos))
      ? (st.grupos.find(x => x.id === st.activo) || st.grupos[0]) : null;
    if (!g || !g.lista.length) {
      await metasAlert('Primero registra tus alumnos en **Mi aula** (Zona Docente → Mi aula): ahí armas la lista UNA vez y todas las herramientas la usan.',
        { icono: '👥', titulo: 'Traer mi lista' });
      return;
    }
    /* Solo se pregunta si hay algo ESCRITO: la cuadrícula arranca con 20
       filas en blanco, y avisar de que «se reemplazarán» unas filas vacías
       asustaba al maestro en el primer paso de la pantalla. */
    const hayFilas = Array.from(document.querySelectorAll('.pa-student-row')).some(r =>
      (r.querySelector('.pa-inp-name')?.value || '').trim() ||
      (r.querySelector('.pa-inp-grade-cell')?.value || '').trim());
    if (hayFilas && !await metasConfirm('Se reemplazarán las filas actuales con la lista de **' +
      paGrupoTxt(g.grado, g.seccion) + (g.escuela ? ' · ' + g.escuela : '') +
      '** (' + g.lista.length + ' alumnos). ¿Continuar?',
      { icono: '👥', titulo: 'Traer mi lista', okTxt: 'Sí, traer' })) return;
    const gradoInp = document.getElementById('pa-grado');
    const secInp = document.getElementById('pa-seccion');
    if (gradoInp) gradoInp.value = g.grado || '';
    if (secInp) secInp.value = g.seccion || '';
    const list = document.getElementById('pa-students-list');
    if (list) list.innerHTML = '';
    const orden = g.lista.slice().sort((a, b) => a.num - b.num);
    orden.forEach((a, i) => {
      paAddRow(i + 1);
      const rows = document.querySelectorAll('.pa-student-row');
      const inp = rows[rows.length - 1]?.querySelector('.pa-inp-name');
      if (inp) inp.value = a.nombre || '';
    });
    toast('👥 ' + orden.length + ' alumno(s) traídos de Mi aula');
  });

  document.getElementById('pa-generate-btn')?.addEventListener('click', () => { _paCurrentId = null; paGenerate(); });

  // Selector de evaluación del banco: autollenar el nombre al cambiar
  ['pa-mision', 'pa-forma', 'pa-tipo'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', paAutoNombre);
  });
  // Filtro por materia: repobla el listado de evaluaciones
  document.getElementById('pa-materia')?.addEventListener('change', e => {
    paFiltrarMisiones(e.target.value);
    paAutoNombre();
  });

  // Nube de padres (Supabase): reintenta al volver la conexión
  window.addEventListener('online', () => paSincronizarNube(false));

  // Entry tab switching
  document.querySelectorAll('.pa-etab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pa-etab').forEach(t => t.classList.remove('pa-etab-active'));
      tab.classList.add('pa-etab-active');
      document.getElementById('pa-entry-manual').style.display = tab.dataset.etab === 'manual' ? '' : 'none';
      document.getElementById('pa-entry-pegar').style.display  = tab.dataset.etab === 'pegar'  ? '' : 'none';
    });
  });

  // Import from paste
  document.getElementById('pa-import-btn')?.addEventListener('click', () => {
    const text = document.getElementById('pa-paste-area')?.value.trim();
    if (!text) return;
    const lines = text.split('\n').filter(l => l.trim());
    const list = document.getElementById('pa-students-list');
    if (list) list.innerHTML = '';
    lines.forEach((line, i) => {
      const parts = line.split(',');
      const name  = (parts[0] || '').trim();
      const grade = (parts[1] || '').trim();
      if (name) paAddRow(i + 1, name, grade);
    });
    // switch to manual tab to show
    document.querySelectorAll('.pa-etab').forEach(t => t.classList.remove('pa-etab-active'));
    document.querySelector('.pa-etab[data-etab="manual"]')?.classList.add('pa-etab-active');
    document.getElementById('pa-entry-manual').style.display = '';
    document.getElementById('pa-entry-pegar').style.display  = 'none';
    toast(`✅ ${lines.length} estudiantes importados`);
  });
});
