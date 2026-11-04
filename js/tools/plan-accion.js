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
  if (d.analisis.length > 400) d.analisis = d.analisis.slice(-400);
  if (d.analisis.length >= 350) toast('⚠️ Te acercas al límite de análisis guardados. Considera imprimir los más antiguos.');
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
/* Esta tabla es el nombre de las materias en TODA la herramienta: los chips
   del historial, el selector de evaluación y la columna de la boleta. El
   nombre va dos veces a propósito: «corto» para los chips, que van en fila y
   con «Ciencias Naturales» se salen de la pantalla del teléfono; «nom» para
   donde hay sitio y el maestro espera el nombre de la boleta. */
const PA_HIST_MATERIAS = [
  { key: 'español',      emoji: '📖', corto: 'Español',      nom: 'Español' },
  { key: 'matemáticas',  emoji: '🔢', corto: 'Matemáticas',  nom: 'Matemáticas' },
  { key: 'naturales',    emoji: '🌱', corto: 'Naturales',    nom: 'Ciencias Naturales' },
  { key: 'sociales',     emoji: '🌎', corto: 'Sociales',     nom: 'Ciencias Sociales' },
  { key: 'programación', emoji: '💻', corto: 'Programación', nom: 'Programación' },
  { key: 'robótica',     emoji: '🤖', corto: 'Robótica',     nom: 'Robótica' },
  { key: 'inglés',       emoji: '🔤', corto: 'Inglés',       nom: 'Inglés' },
  { key: 'cívica',       emoji: '🇭🇳', corto: 'E. Cívica',    nom: 'Educación Cívica' },
  { key: 'ia',           emoji: '🧠', corto: 'I. Artificial', nom: 'Inteligencia Artificial' },
  { key: 'filosofía',    emoji: '🌳', corto: 'Filosofía',    nom: 'Filosofía' },
];
/* «sin» es el valor de los chips «Sin parcial» / «Sin materia»: '' ya
   significa «no filtrar», así que los análisis sueltos necesitan su propia
   marca para poder encontrarlos. */
const PA_HIST_SIN = 'sin';

const PA_MESES_NOM = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const PA_MESES_CORTO = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
let _paHistBusqueda = '';
const _paHistMesesEstado = new Map(); // ym -> boolean (open/closed)

function paFechaIsoDe(a) {
  const f1 = String((a && a.t) || '').slice(0, 10);
  const f2 = String((a && a.fechaPrueba) || '').slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(f1)) return f1;
  if (/^\d{4}-\d{2}-\d{2}$/.test(f2)) return f2;
  return '';
}
function paMesClaveDe(a) {
  const iso = paFechaIsoDe(a);
  return iso ? iso.slice(0, 7) : '';
}
function paAnioDe(a) {
  const iso = paFechaIsoDe(a);
  return iso ? iso.slice(0, 4) : '';
}
function paMesEtiqueta(ym, corto) {
  if (!ym || ym === PA_HIST_SIN) return 'Sin fecha';
  const m = String(ym).match(/^(\d{4})-(\d{2})$/);
  if (!m) return ym;
  const idx = parseInt(m[2], 10);
  const nom = (corto ? PA_MESES_CORTO[idx] : PA_MESES_NOM[idx]) || m[2];
  return nom + ' ' + m[1];
}

/* Materia del análisis: manda la que quedó guardada; los análisis viejos la
   deducen de la misión del banco a la que se amarraron o del título. */
function paMateriaDe(a) {
  if (a && a.materia) return a.materia;
  if (typeof MISSIONS !== 'undefined' && Array.isArray(MISSIONS) && a) {
    if (a.misionId) {
      const m = MISSIONS.find(x => x.id === a.misionId);
      if (m && m.subject) return m.subject;
    }
    const evBase = String(a.evaluacion || '')
      .replace(/\s*—\s*Forma\s+\S+/i, '')
      .replace(/\s*·\s*Prueba\s+operativa/i, '')
      .trim()
      .toLowerCase();
    if (evBase) {
      const m2 = MISSIONS.find(x => {
        const t = String(x.title || '').trim().toLowerCase();
        return t && (t === evBase || evBase.indexOf(t) === 0 || (evBase.length >= 8 && t.indexOf(evBase) === 0));
      });
      if (m2 && m2.subject) return m2.subject;
    }
  }
  return '';
}
function paMateriaNom(k) {
  const x = PA_HIST_MATERIAS.find(y => y.key === k);
  return x ? x.nom : k;
}
function paMateriaEmoji(k) {
  const x = PA_HIST_MATERIAS.find(y => y.key === k);
  return x ? x.emoji : '📘';
}
function paHistFiltros() {
  const f = paLoadData().histFiltros || {};
  return { parcial: f.parcial || '', materia: f.materia || '', anio: f.anio || '', mes: f.mes || '' };
}
function paHistFiltroSet(campo, valor) {
  const d = paLoadData();
  const f = paHistFiltros();
  f[campo] = (f[campo] === valor) ? '' : valor;   // tocar el mismo chip = quitar el filtro
  if (campo === 'anio' && f.anio && f.mes && f.mes !== PA_HIST_SIN && f.mes.slice(0, 4) !== f.anio) {
    f.mes = '';
  }
  d.histFiltros = f;
  paSaveData(d);
  paRenderHistorial();
}
function paHistPasa(a, f) {
  const p = String(a.parcial || '');
  const k = paMateriaDe(a);
  const y = paAnioDe(a);
  const m = paMesClaveDe(a);
  if (f.parcial === PA_HIST_SIN ? !!p : (f.parcial && p !== f.parcial)) return false;
  if (f.materia === PA_HIST_SIN ? !!k : (f.materia && k !== f.materia)) return false;
  if (f.anio === PA_HIST_SIN ? !!y : (f.anio && y !== f.anio)) return false;
  if (f.mes === PA_HIST_SIN ? !!m : (f.mes && m !== f.mes)) return false;
  if (_paHistBusqueda) {
    const q = _paHistBusqueda.toLowerCase();
    const txt = [a.evaluacion || '', paMateriaNom(k), paGrupoTxt(a.grado, a.seccion), a.parcial ? 'p-' + a.parcial : '', paFechaIsoDe(a)].join(' ').toLowerCase();
    if (txt.indexOf(q) === -1) return false;
  }
  return true;
}

/* Chips de filtro: ofrece parciales, materias, años y meses que DE VERDAD
   hay guardados, con contadores claros para explorar el historial acumulado. */
function paRenderHistFiltros(todos, f) {
  const box = document.getElementById('pa-hist-filtros');
  if (!box) return todos;

  const contar = pred => todos.filter(pred).length;
  const opsP = PA_HIST_PARCIALES
    .map(p => ({ v: p, n: contar(a => String(a.parcial || '') === p) }))
    .filter(x => x.n > 0)
    .map(x => ({ v: x.v, t: `P-${x.v} <span class="pa-hist-chip-n">${x.n}</span>` }));
  const nSinP = contar(a => !a.parcial);
  if (nSinP > 0) opsP.push({ v: PA_HIST_SIN, t: `Sin parcial <span class="pa-hist-chip-n">${nSinP}</span>` });

  const opsM = PA_HIST_MATERIAS
    .map(x => ({ key: x.key, emoji: x.emoji, corto: x.corto, n: contar(a => paMateriaDe(a) === x.key) }))
    .filter(x => x.n > 0)
    .map(x => ({ v: x.key, t: `${x.emoji} ${x.corto} <span class="pa-hist-chip-n">${x.n}</span>` }));
  const nSinM = contar(a => !paMateriaDe(a));
  if (nSinM > 0) opsM.push({ v: PA_HIST_SIN, t: `📋 Sin materia <span class="pa-hist-chip-n">${nSinM}</span>` });

  const aniosMap = new Map();
  todos.forEach(a => {
    const y = paAnioDe(a);
    if (y) aniosMap.set(y, (aniosMap.get(y) || 0) + 1);
  });
  const opsY = Array.from(aniosMap.keys()).sort((a, b) => b.localeCompare(a))
    .map(y => ({ v: y, t: `📆 ${y} <span class="pa-hist-chip-n">${aniosMap.get(y)}</span>` }));

  const mesesMap = new Map();
  todos.forEach(a => {
    if (f.anio && f.anio !== PA_HIST_SIN && paAnioDe(a) !== f.anio) return;
    const ym = paMesClaveDe(a);
    if (ym) mesesMap.set(ym, (mesesMap.get(ym) || 0) + 1);
  });
  const opsMes = Array.from(mesesMap.keys()).sort((a, b) => b.localeCompare(a))
    .map(ym => ({ v: ym, t: `${paEsc(paMesEtiqueta(ym, true))} <span class="pa-hist-chip-n">${mesesMap.get(ym)}</span>` }));

  const vivo = (sel, ops) => (ops.length > 1 && ops.some(o => o.v === sel)) ? sel : '';
  const antes = [f.parcial, f.materia, f.anio, f.mes].join('|');
  f.parcial = vivo(f.parcial, opsP);
  f.materia = vivo(f.materia, opsM);
  f.anio    = vivo(f.anio, opsY);
  f.mes     = vivo(f.mes, opsMes);
  if (antes !== [f.parcial, f.materia, f.anio, f.mes].join('|')) {
    const d = paLoadData();
    d.histFiltros = { parcial: f.parcial, materia: f.materia, anio: f.anio, mes: f.mes };
    paSaveData(d);
  }

  const vistos = todos.filter(a => paHistPasa(a, f));
  const etiquetas = [];
  if (f.anio) etiquetas.push('Año ' + f.anio);
  if (f.mes) etiquetas.push(paMesEtiqueta(f.mes, false));
  if (f.parcial) etiquetas.push(f.parcial === PA_HIST_SIN ? 'sin parcial' : 'Parcial ' + f.parcial);
  if (f.materia) etiquetas.push(f.materia === PA_HIST_SIN ? 'sin materia' : paMateriaNom(f.materia));

  // Calcular promedio global de los análisis visibles
  let sumaProm = 0, contProm = 0;
  vistos.forEach(a => {
    const ns = (a.students || []).filter(s => typeof s.nota === 'number');
    if (ns.length) {
      sumaProm += ns.reduce((acc, s) => acc + s.nota, 0) / ns.length;
      contProm++;
    }
  });
  const promGlobal = contProm ? (sumaProm / contProm).toFixed(1) : '';
  const mesesUnicos = new Set(vistos.map(paMesClaveDe).filter(Boolean)).size;

  const fila = (campo, lbl, todosTxt, ops, sel) => (ops.length < 2 ? '' : `
      <div class="pa-hist-flbl">${lbl}</div>
      <div class="pa-hist-chips">
        <button class="pa-hist-chip${sel ? '' : ' pa-hist-chip-sel'}" data-fcampo="${campo}" data-fvalor="">${todosTxt}</button>
        ${ops.map(o => `<button class="pa-hist-chip${sel === o.v ? ' pa-hist-chip-sel' : ''}" data-fcampo="${campo}" data-fvalor="${paEsc(o.v)}">${o.t}</button>`).join('')}
      </div>`);

  const hayFiltroActivo = !!(f.parcial || f.materia || f.anio || f.mes || _paHistBusqueda);

  box.innerHTML =
    `<div class="pa-hist-search-wrap">
       <input type="search" id="pa-hist-search-inp" class="pa-hist-search-inp" placeholder="🔎 Buscar evaluación, tema, fecha o grado…" value="${paEsc(_paHistBusqueda)}">
       ${hayFiltroActivo ? `<button type="button" class="pa-hist-clear-btn" id="pa-hist-clear-btn">✕ Limpiar filtros</button>` : ''}
     </div>` +
    fila('anio', '📆 Año', 'Todos', opsY, f.anio) +
    fila('mes', '📅 Mes y Año', 'Todos los meses', opsMes, f.mes) +
    fila('parcial', '🗓️ Parcial', 'Todos', opsP, f.parcial) +
    fila('materia', '📚 Materia', 'Todas', opsM, f.materia) +
    `<div class="pa-hist-toolbar">
       <div class="pa-hist-count">
         <span>${vistos.length === todos.length
           ? `${todos.length} análisis guardado${todos.length === 1 ? '' : 's'}`
           : `${vistos.length} de ${todos.length} análisis`}${mesesUnicos > 1 ? ` · ${mesesUnicos} meses` : ''}${etiquetas.length ? ' · ' + paEsc(etiquetas.join(' · ')) : ''}</span>
         ${promGlobal ? `<span class="pa-hist-global-avg">📊 Prom. acumulado: <strong>${promGlobal}%</strong></span>` : ''}
       </div>
       ${mesesUnicos > 1 ? `<div class="pa-hist-fold-btns">
         <button type="button" class="pa-hist-fold-btn" id="pa-hist-expand-all">📂 Expandir meses</button>
         <button type="button" class="pa-hist-fold-btn" id="pa-hist-collapse-all">📁 Contraer meses</button>
       </div>` : ''}
     </div>`;

  box.querySelectorAll('.pa-hist-chip').forEach(b =>
    b.addEventListener('click', () => paHistFiltroSet(b.dataset.fcampo, b.dataset.fvalor)));

  const sInp = document.getElementById('pa-hist-search-inp');
  if (sInp) {
    sInp.addEventListener('input', e => {
      _paHistBusqueda = e.target.value || '';
      const pos = e.target.selectionStart;
      paRenderHistorial();
      const sInp2 = document.getElementById('pa-hist-search-inp');
      if (sInp2) { sInp2.focus(); try { sInp2.setSelectionRange(pos, pos); } catch (_) {} }
    });
  }
  document.getElementById('pa-hist-clear-btn')?.addEventListener('click', () => {
    _paHistBusqueda = '';
    const d = paLoadData();
    d.histFiltros = { parcial: '', materia: '', anio: '', mes: '' };
    paSaveData(d);
    paRenderHistorial();
  });
  return vistos;
}

function paRenderHistorial() {
  const card = document.getElementById('pa-historial-card');
  const list = document.getElementById('pa-historial-list');
  if (!card || !list) return;
  const d = paLoadData();
  const fbox = document.getElementById('pa-hist-filtros');
  const btnRecHtml = `<div style="margin-top:12px;text-align:right;"><button type="button" class="pa-hist-abrir pa-hist-recuperar" style="font-size:.78rem;padding:6px 12px;opacity:.9;">📥 Recuperar análisis de la nube</button></div>`;
  const bindRec = () => list.querySelectorAll('.pa-hist-recuperar').forEach(b =>
    b.addEventListener('click', () => paRecuperarHistorialNube(b)));

  if (!d.analisis.length) {
    card.style.display = '';
    if (fbox) fbox.innerHTML = '';
    list.innerHTML = `<p class="pa-hist-vacio">Aún no hay análisis guardados en este dispositivo.</p>` + btnRecHtml;
    bindRec();
    return;
  }
  card.style.display = '';

  const ordenados = [...d.analisis].sort((a, b) => {
    const fa = paFechaIsoDe(a) || String(a.t || '');
    const fb = paFechaIsoDe(b) || String(b.t || '');
    return fb.localeCompare(fa);
  });
  const fAct = paHistFiltros();
  const vistos = paRenderHistFiltros(ordenados, fAct);
  if (!vistos.length) {
    list.innerHTML = `<p class="pa-hist-vacio">🔎 Ningún análisis guardado coincide con este filtro.
      Toca <strong>Limpiar filtros</strong> o <strong>Todos</strong> para ver el listado completo.</p>` + btnRecHtml;
    bindRec();
    return;
  }

  // Agrupar análisis por Mes y Año (ej. 2026-11, 2026-10, 2026-09...)
  const porMes = new Map();
  vistos.forEach(a => {
    const ym = paMesClaveDe(a) || PA_HIST_SIN;
    if (!porMes.has(ym)) porMes.set(ym, []);
    porMes.get(ym).push(a);
  });

  // Resumen acumulado por Año cuando hay varios meses
  const porAnio = new Map();
  vistos.forEach(a => {
    const y = paAnioDe(a) || 'Sin año';
    if (!porAnio.has(y)) porAnio.set(y, []);
    porAnio.get(y).push(a);
  });

  const hayFiltro = !!(fAct.parcial || fAct.materia || fAct.anio || fAct.mes || _paHistBusqueda);
  const clavesMes = Array.from(porMes.keys());
  let anioActual = null;

  const renderFila = a => {
    const nums = (a.students || []).filter(s => typeof s.nota === 'number');
    const avgNum = nums.length ? (nums.reduce((x, s) => x + s.nota, 0) / nums.length) : null;
    const avg = avgNum !== null ? avgNum.toFixed(1) : '—';
    const avgCls = avgNum === null ? '' : (avgNum >= 80 ? 'alto' : (avgNum >= 70 ? 'medio' : 'bajo'));
    const pendNube = (a.students || []).filter(s => {
      const codigo = paCodigoLista(a, s);
      return codigo && s.sb !== paSbFirma(a, s, codigo);
    }).length;
    const waEnv = (a.students || []).filter(s => s.env).length;
    const nube = pendNube
      ? `<span class="pa-hist-nube pend">☁️ ${pendNube} por subir</span>`
      : `<span class="pa-hist-nube ok">☁️ En el asistente de padres ✅</span>`;
    const wa = waEnv ? `<span class="pa-hist-wa">📱 ${waEnv}/${a.students.length} WhatsApp</span>` : '';
    const mat = paMateriaDe(a);
    const iso = paFechaIsoDe(a);
    const dia = iso ? iso.slice(8, 10) : '—';
    const mesIdx = iso ? parseInt(iso.slice(5, 7), 10) : 0;
    const mesCorto = (PA_MESES_CORTO[mesIdx] || '').toUpperCase();
    return `
      <div class="pa-hist-row">
        <div class="pa-hist-dia-box" title="${paEsc(iso || 'Sin fecha')}">
          <span class="pa-hist-dia-num">${paEsc(dia)}</span>
          <span class="pa-hist-dia-mes">${paEsc(mesCorto || 'FECHA')}</span>
        </div>
        <div class="pa-hist-info">
          <div class="pa-hist-top-line">
            <span class="pa-hist-titulo">${paEsc(a.evaluacion || 'Evaluación')}</span>
            ${a.parcial ? `<span class="pa-hist-pill-parcial">P-${paEsc(a.parcial)}</span>` : ''}
            ${mat ? `<span class="pa-hist-pill-mat">${paMateriaEmoji(mat)} ${paEsc(paMateriaNom(mat))}</span>` : ''}
          </div>
          <div class="pa-hist-meta-row">
            <span class="pa-hist-meta-item">👥 ${paEsc(paGrupoTxt(a.grado, a.seccion))} · ${(a.students || []).length} alumnos</span>
            <span class="pa-hist-prom-pill ${avgCls}">📊 Prom. ${avg}</span>
            ${nube}${wa}
          </div>
        </div>
        <div class="pa-hist-actions">
          ${pendNube ? `<button class="pa-hist-subir" data-id="${a.id}">☁️ Subir ahora</button>` : ''}
          <button class="pa-hist-abrir" data-id="${a.id}">Abrir</button>
          <button class="pa-hist-borrar" data-id="${a.id}" aria-label="Eliminar">🗑</button>
        </div>
      </div>`;
  };

  const bloquesHtml = clavesMes.map((ym, idxMes) => {
    const items = porMes.get(ym) || [];
    const anio = (ym && ym !== PA_HIST_SIN) ? ym.slice(0, 4) : 'Sin año';
    let bannerAnio = '';
    if (anio !== anioActual && anio !== 'Sin año') {
      anioActual = anio;
      const itemsAnio = porAnio.get(anio) || items;
      let sAnio = 0, cAnio = 0;
      itemsAnio.forEach(a => {
        const ns = (a.students || []).filter(s => typeof s.nota === 'number');
        if (ns.length) { sAnio += ns.reduce((x, s) => x + s.nota, 0) / ns.length; cAnio++; }
      });
      const promAnio = cAnio ? (sAnio / cAnio).toFixed(1) : '—';
      const mesesDelAnio = new Set(itemsAnio.map(paMesClaveDe).filter(Boolean)).size;
      bannerAnio = `
        <div class="pa-hist-anio-banner">
          <div class="pa-hist-anio-left">🎓 <strong>Año ${paEsc(anio)}</strong></div>
          <div class="pa-hist-anio-stats">
            <span>📚 ${itemsAnio.length} evaluación${itemsAnio.length === 1 ? '' : 'es'}</span>
            <span>📅 ${mesesDelAnio} mes${mesesDelAnio === 1 ? '' : 'es'}</span>
            <span>📊 Prom. anual: <strong>${promAnio}</strong></span>
          </div>
        </div>`;
    }

    let sumaM = 0, contM = 0;
    const parcialesMes = new Set();
    items.forEach(a => {
      if (a.parcial) parcialesMes.add('P-' + a.parcial);
      const ns = (a.students || []).filter(s => typeof s.nota === 'number');
      if (ns.length) { sumaM += ns.reduce((x, s) => x + s.nota, 0) / ns.length; contM++; }
    });
    const promMesNum = contM ? (sumaM / contM) : null;
    const promMes = promMesNum !== null ? promMesNum.toFixed(1) : '—';
    const promMesCls = promMesNum === null ? '' : (promMesNum >= 80 ? 'alto' : (promMesNum >= 70 ? 'medio' : 'bajo'));
    const parcTxt = Array.from(parcialesMes).join(' · ');

    // Abierto por defecto: los 2 meses más recientes o cuando hay filtro activo
    const abierto = _paHistMesesEstado.has(ym)
      ? _paHistMesesEstado.get(ym)
      : (hayFiltro || idxMes < 2 || clavesMes.length <= 2);

    return bannerAnio + `
      <details class="pa-hist-mes-group" data-ym="${paEsc(ym)}"${abierto ? ' open' : ''}>
        <summary class="pa-hist-mes-hdr">
          <div class="pa-hist-mes-left">
            <span class="pa-hist-mes-ico">📅</span>
            <span class="pa-hist-mes-tit">${paEsc(paMesEtiqueta(ym, false))}</span>
            ${parcTxt ? `<span class="pa-hist-mes-parc">${paEsc(parcTxt)}</span>` : ''}
          </div>
          <div class="pa-hist-mes-right">
            <span class="pa-hist-mes-count">${items.length} análisis</span>
            <span class="pa-hist-prom-pill ${promMesCls}">Prom. ${promMes}</span>
            <span class="pa-hist-mes-chev">▾</span>
          </div>
        </summary>
        <div class="pa-hist-mes-body">
          ${items.map(renderFila).join('')}
        </div>
      </details>`;
  }).join('');

  const labHtml = _paLabAbierto ? paRenderLaboratorioHtml(vistos, ordenados) : '';
  list.innerHTML = bloquesHtml + btnRecHtml + paRenderLabLauncherHtml() + labHtml;
  bindRec();
  paBindLabLauncher(list);
  if (_paLabAbierto) paBindLaboratorioEvents(list, vistos, ordenados);

  list.querySelectorAll('.pa-hist-mes-group').forEach(det => {
    det.addEventListener('toggle', () => {
      const ym = det.getAttribute('data-ym');
      if (ym) _paHistMesesEstado.set(ym, det.open);
    });
  });

  document.getElementById('pa-hist-expand-all')?.addEventListener('click', () => {
    list.querySelectorAll('.pa-hist-mes-group').forEach(det => {
      det.open = true;
      const ym = det.getAttribute('data-ym');
      if (ym) _paHistMesesEstado.set(ym, true);
    });
  });
  document.getElementById('pa-hist-collapse-all')?.addEventListener('click', () => {
    list.querySelectorAll('.pa-hist-mes-group').forEach(det => {
      det.open = false;
      const ym = det.getAttribute('data-ym');
      if (ym) _paHistMesesEstado.set(ym, false);
    });
  });

  // «Subir ahora»: dispara la misma sincronización automática, a pedido.
  list.querySelectorAll('.pa-hist-subir').forEach(b =>
    b.addEventListener('click', async () => {
      b.disabled = true; b.textContent = '⏳ Subiendo…';
      await paSincronizarNube(true);
      paRenderHistorial();
    }));

  list.querySelectorAll('.pa-hist-abrir').forEach(b => {
    if (b.classList.contains('pa-hist-recuperar')) return;
    b.addEventListener('click', () => paAbrirAnalisis(b.dataset.id));
  });
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

/* ══════════════════════════════════════════════════════════════════════════
   🧠 LABORATORIO DE INTELIGENCIA PEDAGÓGICA, CIENCIA DE DATOS Y TESIS M.E.T.A.S
   Cruza evaluaciones del Plan de Acción + Asistencia/SACE (Mi Aula) +
   Práctica autónoma de Misiones en la nube (METAS_STATS_NUBE_V1) +
   Generador de Casos de Estudio y Consentimiento Informado Longitudinal.
   ══════════════════════════════════════════════════════════════════════════ */
let _paLabAbierto = false;
let _paLabTab = 'descriptivo';
let _paTesisSeleccion = null; // Set de números de lista seleccionados para imprimir

const PA_LAB_TABS = [
  { id: 'descriptivo',   ico: '📊', corto: 'Análisis Descriptivo',           rol: 'Estadística Descriptiva',       tit: 'Análisis Descriptivo y Temas de Mayor Dificultad' },
  { id: 'matriz',        ico: '🔢', corto: 'Matriz Alumno × Tema',           rol: 'Analista de Datos',             tit: 'Matriz de Desempeño, Patrones y Dónde Reforzar por Alumno' },
  { id: 'ausentismo',    ico: '📅', corto: 'Pruebas × Asistencia',           rol: 'Cruce Asistencia / Evidencia',  tit: 'Participación en Pruebas vs. Días Faltados (Pase de Lista y SACE)' },
  { id: 'misiones',      ico: '🎮', corto: 'Cruce con Misiones',             rol: 'Analítica de Práctica',         tit: 'Cruce entre Práctica Autónoma en Misiones y Notas de Evaluación' },
  { id: 'grupos',        ico: '👥', corto: 'Análisis por Grupos',            rol: 'Pedagogo Experto',              tit: 'Agrupación Inteligente por Perfiles (Clústeres de Intervención)' },
  { id: 'hipotesis',     ico: '🧠', corto: 'Hipótesis y Correlaciones',      rol: 'Psicólogo y Científico',        tit: 'Contraste de Hipótesis, Correlaciones Causales y Psicología Educativa' },
  { id: 'filosofia',     ico: '🏛️', corto: 'Teoría y Filosofía',             rol: 'Filósofo de la Educación',      tit: 'Interpretación Teórica y Filosófica (Vygotsky, Bloom, Bandura, Ausubel, Freire)' },
  { id: 'investigacion', ico: '🎓', corto: 'Casos y Consentimiento (Tesis)', rol: 'Investigador Educativo (Tesis)', tit: 'Casos de Estudio por Alumno y Consentimiento Informado Longitudinal (Tesis M.E.T.A.S)', dest: true }
];

function paRenderLabLauncherHtml() {
  return `
    <div class="pa-lab-launcher" id="pa-lab-launcher-box">
      <div class="pa-lab-launcher-head">
        <div class="pa-lab-launcher-info">
          <span class="pa-lab-launcher-kicker">🔬 LABORATORIO DE DATOS, PEDAGOGÍA E INVESTIGACIÓN M.E.T.A.S</span>
          <div class="pa-lab-launcher-title">Explora patrones por alumno, matrices de refuerzo, cruces y casos de estudio para tesis</div>
        </div>
        <div class="pa-lab-launcher-main-actions">
          <button type="button" class="pa-lab-main-btn${_paLabAbierto && _paLabTab === 'descriptivo' ? ' active' : ''}" data-labtab="descriptivo">
            <span>📊</span>
            <span>Análisis Descriptivo y Dónde Reforzar</span>
          </button>
          ${_paLabAbierto ? `<button type="button" class="pa-lab-close-pill" id="pa-lab-close-top">✕ Ocultar panel</button>` : ''}
        </div>
      </div>
      <div class="pa-lab-sug-wrap">
        <span class="pa-lab-sug-label">✨ Análisis especializados sugeridos (toca cualquiera para abrirlo):</span>
        <div class="pa-lab-sug-row">
          ${PA_LAB_TABS.slice(1).map(t => `
            <button type="button" class="pa-lab-sug-btn${t.dest ? ' tesis-btn' : ''}${_paLabAbierto && _paLabTab === t.id ? ' active' : ''}" data-labtab="${t.id}" title="${paEsc(t.rol + ': ' + t.tit)}">
              <span class="pa-lab-sug-ico">${t.ico}</span>
              <span class="pa-lab-sug-txt">
                <strong>${paEsc(t.corto)}</strong>
                <small>${paEsc(t.rol)}</small>
              </span>
            </button>`).join('')}
        </div>
      </div>
    </div>`;
}

function paBindLabLauncher(container) {
  container.querySelectorAll('[data-labtab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-labtab') || 'descriptivo';
      if (_paLabAbierto && _paLabTab === t) {
        _paLabAbierto = false;
      } else {
        _paLabAbierto = true;
        _paLabTab = t;
      }
      paRenderHistorial();
      if (_paLabAbierto) {
        setTimeout(() => {
          document.getElementById('pa-lab-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });
  document.getElementById('pa-lab-close-top')?.addEventListener('click', () => {
    _paLabAbierto = false;
    paRenderHistorial();
  });
}

function paLabMean(arr) {
  if (!arr || !arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function paLabMedian(arr) {
  if (!arr || !arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function paLabStd(arr) {
  if (!arr || arr.length < 2) return 0;
  const m = paLabMean(arr);
  const v = arr.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / arr.length;
  return Math.sqrt(v);
}
function paLabPearson(xs, ys) {
  if (!xs || !ys || xs.length !== ys.length || xs.length < 3) return null;
  const n = xs.length;
  const mx = paLabMean(xs), my = paLabMean(ys);
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  if (dx2 === 0 || dy2 === 0) return 0;
  return num / Math.sqrt(dx2 * dy2);
}

function paConstruirDatosLaboratorio(vistos, todos) {
  // Ordenar cronológicamente de más antiguo a más reciente para calcular tendencias reales
  const cron = [...vistos].sort((a, b) => {
    const fa = paFechaIsoDe(a) || String(a.t || '');
    const fb = paFechaIsoDe(b) || String(b.t || '');
    return fa.localeCompare(fb);
  });

  // 1. Vincular con el grupo de Mi Aula (METAS_ADMIN_V1) para cruzar asistencia, SACE y lista oficial
  let adminSt = null;
  try { adminSt = JSON.parse(localStorage.getItem('METAS_ADMIN_V1') || 'null'); } catch (_) {}
  const gruposAdmin = (adminSt && Array.isArray(adminSt.grupos)) ? adminSt.grupos : [];
  const dig = s => String(s || '').replace(/\D/g, '');
  const secNorm = s => { const m = String(s || '').trim().match(/([a-zA-Z0-9])\s*$/); return m ? m[1].toUpperCase() : ''; };

  let grupoAula = null;
  if (gruposAdmin.length) {
    const muestra = cron[cron.length - 1] || vistos[0];
    if (muestra) {
      const gM = dig(muestra.grado), sM = secNorm(muestra.seccion);
      grupoAula = gruposAdmin.find(g => muestra.grupoId && g.id === muestra.grupoId) ||
                  gruposAdmin.find(g => dig(g.grado) === gM && secNorm(g.seccion) === sM) ||
                  gruposAdmin.find(g => g.id === adminSt.activo) || gruposAdmin[0];
    } else {
      grupoAula = gruposAdmin.find(g => g.id === adminSt.activo) || gruposAdmin[0];
    }
  }

  const diasPaseLista = (grupoAula && Array.isArray(grupoAula.asistencia)) ? grupoAula.asistencia.length : 0;
  const asisPorAlumno = new Map(); // num -> { A, E, sace, totalFaltas, fechasSet }
  if (grupoAula) {
    (grupoAula.asistencia || []).forEach(reg => {
      const f = String(reg.f || '').slice(0, 10);
      const aus = reg.aus || {};
      Object.keys(aus).forEach(k => {
        const n = parseInt(k, 10);
        if (!n) return;
        const marca = aus[k];
        if (marca !== 'A' && marca !== 'E') return;
        if (!asisPorAlumno.has(n)) asisPorAlumno.set(n, { A: 0, E: 0, sace: 0, totalFaltas: 0, fechasSet: new Set() });
        const obj = asisPorAlumno.get(n);
        if (marca === 'A') obj.A++; else if (marca === 'E') obj.E++;
        if (f) obj.fechasSet.add(f);
      });
    });
    const notasSace = grupoAula.notas || {};
    ['I', 'II', 'III', 'IV'].forEach(p => {
      const inasMap = (notasSace[p] && notasSace[p]['Inasistencias']) || {};
      Object.keys(inasMap).forEach(k => {
        const n = parseInt(k, 10);
        const val = Number(inasMap[k]);
        if (!n || isNaN(val) || val <= 0) return;
        if (!asisPorAlumno.has(n)) asisPorAlumno.set(n, { A: 0, E: 0, sace: 0, totalFaltas: 0, fechasSet: new Set() });
        asisPorAlumno.get(n).sace += val;
      });
    });
    asisPorAlumno.forEach(obj => {
      obj.totalFaltas = Math.max(obj.A + obj.E, obj.sace);
    });
  }

  // 2. Vincular con la caché de prácticas en Misiones de la nube (METAS_STATS_NUBE_V1)
  let nubeCache = null;
  try {
    nubeCache = (typeof estNubeCache === 'function') ? estNubeCache() : JSON.parse(localStorage.getItem('METAS_STATS_NUBE_V1') || 'null');
  } catch (_) {}
  const misionesPorAlumno = new Map(); // num -> { intentos, misionesSet, notas:[], minutos, pautas }
  const gDigRef = grupoAula ? dig(grupoAula.grado) : (cron[0] ? dig(cron[0].grado) : '');
  if (nubeCache) {
    const pautasSet = new Set();
    (nubeCache.resultados || []).forEach(r => {
      if (r && r.tipo === 'pauta_vista') {
        pautasSet.add((r.dispositivo || '') + '|' + String(r.mision || '').toLowerCase() + '|' + String(r.fecha || r.creado_en || '').slice(0, 10));
      }
    });
    (nubeCache.resultados || []).forEach(r => {
      if (!r) return;
      const mNum = String(r.codigo_lista || '').match(/^\d+/);
      if (!mNum) return;
      const num = parseInt(mNum[0], 10);
      const rG = dig(r.grado);
      if (gDigRef && rG && rG.slice(0, 1) !== gDigRef.slice(0, 1)) return;
      if (!misionesPorAlumno.has(num)) misionesPorAlumno.set(num, { intentos: 0, misionesSet: new Set(), notas: [], minutos: 0, pautas: 0 });
      const stM = misionesPorAlumno.get(num);
      if (r.tipo === 'evaluacion' || r.tipo === 'prueba_operativa') {
        stM.intentos++;
        if (r.mision) stM.misionesSet.add(String(r.mision).toLowerCase());
        if (typeof r.nota === 'number') {
          const base = (typeof r.base === 'number' && r.base > 0) ? r.base : 100;
          stM.notas.push(Math.round((r.nota / base) * 100));
        }
        const claveP = (r.dispositivo || '') + '|' + String(r.mision || '').toLowerCase() + '|' + String(r.fecha || r.creado_en || '').slice(0, 10);
        if (pautasSet.has(claveP)) stM.pautas++;
      }
    });
    (nubeCache.progreso || []).forEach(p => {
      if (!p) return;
      const mNum = String(p.codigo_lista || '').match(/^\d+/);
      if (!mNum) return;
      const num = parseInt(mNum[0], 10);
      if (!misionesPorAlumno.has(num)) misionesPorAlumno.set(num, { intentos: 0, misionesSet: new Set(), notas: [], minutos: 0, pautas: 0 });
      const res = p.resumen || {};
      if (typeof res.minutos === 'number') misionesPorAlumno.get(num).minutos += res.minutos;
    });
  }

  // 3. Estadísticas por Evaluación / Tema
  const todasNotasGlobal = [];
  let totalNspGlobal = 0;
  const evalsStats = cron.map((a, idx) => {
    const matKey = paMateriaDe(a);
    const matNom = matKey ? paMateriaNom(matKey) : 'Sin materia';
    const matEmoji = matKey ? paMateriaEmoji(matKey) : '📋';
    const tipoEval = (a.tipoEval === 'operativa' || /operativa/i.test(a.evaluacion || '')) ? 'operativa' : 'conceptual';
    const notas = [];
    let nsp = 0, reprobados = 0, aprobados = 0, excelentes = 0;
    (a.students || []).forEach(s => {
      if (typeof s.nota === 'number' && !isNaN(s.nota)) {
        notas.push(s.nota);
        todasNotasGlobal.push(s.nota);
        if (s.nota < 70) reprobados++; else aprobados++;
        if (s.nota >= 90) excelentes++;
      } else {
        nsp++;
        totalNspGlobal++;
      }
    });
    const prom = paLabMean(notas);
    const med  = paLabMedian(notas);
    const std  = paLabStd(notas);
    const pctReprob = notas.length ? (reprobados / notas.length) * 100 : 0;
    const indiceDif = prom !== null ? ((100 - prom) * 0.6 + pctReprob * 0.4) : 0;
    return {
      idx, id: a.id, raw: a,
      titulo: a.evaluacion || 'Evaluación',
      corto: String(a.evaluacion || 'Eval').replace(/\s*—\s*Forma\s+\S+/i, '').slice(0, 26),
      forma: a.forma || '',
      parcial: a.parcial || '',
      fecha: paFechaIsoDe(a),
      matKey, matNom, matEmoji, tipoEval,
      notas, nAlumnos: (a.students || []).length,
      prom, med, std, nsp, reprobados, aprobados, excelentes, pctReprob, indiceDif
    };
  });

  // 4. Estadísticas por Materia
  const porMateriaMap = new Map();
  evalsStats.forEach(ev => {
    const k = ev.matKey || 'sin';
    if (!porMateriaMap.has(k)) {
      porMateriaMap.set(k, { key: k, nom: ev.matNom, emoji: ev.matEmoji, evals: [], notas: [], reprobados: 0, nsp: 0 });
    }
    const m = porMateriaMap.get(k);
    m.evals.push(ev);
    ev.notas.forEach(n => { m.notas.push(n); if (n < 70) m.reprobados++; });
    m.nsp += ev.nsp;
  });
  const materiasStats = Array.from(porMateriaMap.values()).map(m => ({
    ...m,
    prom: paLabMean(m.notas),
    std: paLabStd(m.notas),
    pctAprob: m.notas.length ? ((m.notas.length - m.reprobados) / m.notas.length) * 100 : 0
  })).sort((a, b) => (a.prom ?? 999) - (b.prom ?? 999));

  // 5. Construir Matriz, Patrón Pedagógico Lógico y Caso de Estudio por Alumno
  const alumnosMap = new Map();
  if (grupoAula && Array.isArray(grupoAula.lista)) {
    grupoAula.lista.forEach(al => {
      if (!al || al.retirado) return;
      const n = parseInt(al.num, 10);
      if (n > 0) alumnosMap.set(n, { num: n, nombre: String(al.nombre || ('#' + n)).trim() });
    });
  }
  cron.forEach(a => {
    (a.students || []).forEach(s => {
      const n = parseInt(s.num, 10);
      if (!n) return;
      const prev = alumnosMap.get(n);
      const nomNuevo = String(s.nombre || '').trim();
      if (!prev) {
        alumnosMap.set(n, { num: n, nombre: nomNuevo || ('#' + n) });
      } else if ((!prev.nombre || prev.nombre.startsWith('#')) && nomNuevo && !nomNuevo.startsWith('#')) {
        prev.nombre = nomNuevo;
      }
    });
  });

  const totalEvals = evalsStats.length;
  const gCod = gDigRef || '6';
  const sCod = (grupoAula ? secNorm(grupoAula.seccion) : (cron[0] ? secNorm(cron[0].seccion) : '1')) || '1';

  const alumnosStats = Array.from(alumnosMap.values()).sort((a, b) => a.num - b.num).map(al => {
    const celdas = [];
    const notas = [];
    const notasConc = [], notasOper = [];
    const porMatAlumno = new Map();
    const temasReprobados = [];
    let nspExplicito = 0, noRegistrado = 0, nspConFaltaDia = 0;
    const asis = asisPorAlumno.get(al.num) || { A: 0, E: 0, sace: 0, totalFaltas: 0, fechasSet: new Set() };

    evalsStats.forEach(ev => {
      const reg = (ev.raw.students || []).find(s => parseInt(s.num, 10) === al.num);
      const faltaEseDia = !!(ev.fecha && asis.fechasSet.has(ev.fecha));
      if (!reg) {
        noRegistrado++;
        celdas.push({ evalId: ev.id, estado: 'sin_acta', nota: null, faltaEseDia });
      } else if (reg.nota === 'NSP' || typeof reg.nota !== 'number' || isNaN(reg.nota)) {
        nspExplicito++;
        if (faltaEseDia) nspConFaltaDia++;
        celdas.push({ evalId: ev.id, estado: 'nsp', nota: null, faltaEseDia });
      } else {
        const v = reg.nota;
        notas.push(v);
        if (ev.tipoEval === 'operativa') notasOper.push(v); else notasConc.push(v);
        if (!porMatAlumno.has(ev.matNom)) porMatAlumno.set(ev.matNom, []);
        porMatAlumno.get(ev.matNom).push(v);
        if (v < 70) temasReprobados.push({ titulo: ev.corto, materia: ev.matNom, nota: v, tipo: ev.tipoEval });
        celdas.push({ evalId: ev.id, estado: 'ok', nota: v, faltaEseDia });
      }
    });

    const pruebasHechas = notas.length;
    const totalEnActas = pruebasHechas + nspExplicito;
    const pruebasSinHacer = nspExplicito; // NSP reales marcados en actas donde el alumno figuraba
    const ratioPresencia = totalEvals ? (pruebasHechas / totalEvals) : 1;
    const pctPruebas = totalEvals ? Math.round(ratioPresencia * 100) : 0;
    const prom = paLabMean(notas);
    const med  = paLabMedian(notas);
    const std  = paLabStd(notas);
    const promConc = paLabMean(notasConc);
    const promOper = paLabMean(notasOper);
    const brechaOper = (promConc !== null && promOper !== null) ? (promOper - promConc) : null;

    // Tendencia longitudinal (1ª mitad vs 2ª mitad de sus pruebas presentadas)
    let delta = 0;
    if (notas.length >= 2) {
      const mitad = Math.floor(notas.length / 2);
      const p1 = paLabMean(notas.slice(0, mitad));
      const p2 = paLabMean(notas.slice(mitad));
      if (p1 !== null && p2 !== null) delta = p2 - p1;
    }

    // Materias débiles del alumno
    const matsDebiles = [];
    const matsFuertes = [];
    porMatAlumno.forEach((arrN, mNom) => {
      const pm = paLabMean(arrN);
      if (pm !== null && pm < 75) matsDebiles.push({ materia: mNom, prom: pm });
      if (pm !== null && pm >= 85) matsFuertes.push({ materia: mNom, prom: pm });
    });
    matsDebiles.sort((x, y) => x.prom - y.prom);
    matsFuertes.sort((x, y) => y.prom - x.prom);

    // Práctica en Misiones
    const mis = misionesPorAlumno.get(al.num) || { intentos: 0, misionesSet: new Set(), notas: [], minutos: 0, pautas: 0 };
    const promMis = paLabMean(mis.notas);

    // ── CLASIFICACIÓN LÓGICA Y PEDAGÓGICA DEL PATRÓN DEL ALUMNO ──
    // Nunca etiqueta con "inasistencia" a un alumno que sí se presenta y aprueba.
    let patronTag = '🛡️ Aprobación Básica';
    let patronClase = 'estable';
    let patronDesc = 'Cumple con el umbral aprobatorio; conviene afianzar los temas puntuales menores a 70%.';
    let casoTipo = 'Caso Tipo V — Desempeño Regular en Consolidación';
    let casoDestacado = false;

    if (pruebasHechas === 0) {
      patronTag = '⚪ Sin Evaluaciones';
      patronClase = 'alerta';
      patronDesc = 'Aún no registra calificaciones numéricas en las evaluaciones filtradas.';
      casoTipo = 'Caso sin mediciones registradas';
    } else if (prom >= 88 && std < 14 && delta >= -5) {
      patronTag = '🌟 Excelencia Sostenida';
      patronClase = 'exito';
      patronDesc = `Dominio sobresaliente (${prom.toFixed(1)}%) y baja dispersión (σ=${std.toFixed(1)}); perfil ideal de alumno monitor / tutor par.`;
      casoTipo = 'Caso Tipo I — Alto Dominio, Autorregulación y Mediación Par (ZDP)';
      casoDestacado = true;
    } else if (prom >= 70 && delta >= 7) {
      patronTag = '📈 Superación Sostenida';
      patronClase = 'exito';
      patronDesc = `Evolución longitudinal muy positiva (+${delta.toFixed(1)} pts en la segunda mitad del periodo) alcanzando ${prom.toFixed(1)}% de promedio.`;
      casoTipo = 'Caso Tipo II — Respuesta Positiva a la Intervención (Ascenso Longitudinal)';
      casoDestacado = true;
    } else if (prom >= 80 && delta > -7 && (brechaOper === null || brechaOper > -12)) {
      patronTag = '✅ Logro Satisfactorio';
      patronClase = 'exito';
      patronDesc = `Desempeño sólido y constante (${prom.toFixed(1)}%) en las ${pruebasHechas} evaluaciones realizadas.`;
      casoTipo = 'Caso Tipo I — Dominio Satisfactorio y Estabilidad Académica';
    } else if (prom >= 70 && brechaOper !== null && brechaOper <= -12) {
      patronTag = '🔧 Brecha Práctica';
      patronClase = 'alerta';
      patronDesc = `Comprende la teoría (${promConc.toFixed(0)}%) pero cae al ejecutar pruebas operativas (${promOper.toFixed(0)}%). Requiere modelaje procedimental.`;
      casoTipo = 'Caso Tipo III — Disociación entre Dominio Conceptual y Ejecución Operativa';
      casoDestacado = true;
    } else if (prom >= 70 && delta <= -7) {
      patronTag = '📉 Alerta de Descenso';
      patronClase = 'alerta';
      patronDesc = `Mantiene promedio aprobatorio (${prom.toFixed(1)}%), pero sus evaluaciones recientes bajaron ${Math.abs(delta).toFixed(1)} pts.`;
      casoTipo = 'Caso Tipo IV — Fatiga Evaluativa / Descenso Reciente en Seguimiento';
      casoDestacado = true;
    } else if (prom >= 70 && std >= 16) {
      patronTag = '⚡ Desempeño Variable';
      patronClase = 'alerta';
      patronDesc = `Aprueba el acumulado (${prom.toFixed(1)}%), pero alterna notas altas con caídas abruptas según el tema (σ=${std.toFixed(1)}).`;
      casoTipo = 'Caso Tipo IV — Alta Variabilidad Intra-Sujeto por Contenido';
    } else if (prom >= 70) {
      patronTag = '🛡️ Aprobación en Consolidación';
      patronClase = 'estable';
      patronDesc = `Promedio aprobatorio (${prom.toFixed(1)}%) con ${pruebasHechas} pruebas realizadas; reforzar temas <70% para subir a nivel avanzado.`;
      casoTipo = 'Caso Tipo V — Consolidación en Zona de Aprobación Básica';
    } else {
      // Promedio acumulado < 70%
      if (delta >= 8) {
        patronTag = `🌱 En Recuperación (+${delta.toFixed(0)} pts)`;
        patronClase = 'alerta';
        patronDesc = `Aunque el promedio acumulado es ${prom.toFixed(1)}%, registra un repunte notable de +${delta.toFixed(1)} pts en la segunda mitad.`;
        casoTipo = 'Caso Tipo II — Resiliencia y Recuperación Longitudinal en Curso';
        casoDestacado = true;
      } else if (brechaOper !== null && brechaOper <= -14 && promConc >= 70) {
        patronTag = '🔧 Falla en Práctica Operativa';
        patronClase = 'riesgo';
        patronDesc = `Aprueba la parte conceptual (${promConc.toFixed(0)}%), pero reprueba la resolución operativa (${promOper.toFixed(0)}%).`;
        casoTipo = 'Caso Tipo III — Bloqueo Procedimental en Resolución de Problemas';
        casoDestacado = true;
      } else if ((nspExplicito >= 4 || ratioPresencia < 0.5) && asis.totalFaltas >= 5) {
        patronTag = '📅 Baja Continuidad';
        patronClase = 'riesgo';
        patronDesc = `Solo cuenta con ${pruebasHechas}/${totalEvals} pruebas evaluadas y ${asis.totalFaltas} inasistencias registradas.`;
        casoTipo = 'Caso Tipo VI — Vulnerabilidad por Discontinuidad Escolar';
        casoDestacado = true;
      } else {
        patronTag = '🎯 Refuerzo Prioritario';
        patronClase = 'riesgo';
        patronDesc = `Se presenta a sus evaluaciones (${pruebasHechas} realizadas), pero su media (${prom.toFixed(1)}%) requiere andamiaje focalizado en temas base.`;
        casoTipo = 'Caso Tipo VI — Sujeto Prioritario de Andamiaje y Nivelación Pedagógica';
        casoDestacado = true;
      }
    }

    const codigoTesis = `METAS-${gCod}G-${sCod}-${String(al.num).padStart(2, '0')}`;
    const topTemasDeb = temasReprobados.slice(0, 3).map(t => `${t.titulo} (${t.nota}%)`).join(', ') || 'ninguno crítico';
    const sintesisCaso = `Participante ${codigoTesis} (${al.nombre}, lista #${al.num}). En una serie longitudinal de n = ${pruebasHechas} evaluaciones registradas en M.E.T.A.S, presenta una media aritmética de x̄ = ${prom !== null ? prom.toFixed(1) + '%' : 'S/D'} (mediana Me = ${med !== null ? med.toFixed(1) + '%' : 'S/D'}, desviación estándar σ = ±${std.toFixed(1)} pts) y un diferencial de evolución temporal Δ = ${(delta >= 0 ? '+' : '') + delta.toFixed(1)} pts entre la primera y la segunda mitad del periodo.` +
      (promConc !== null && promOper !== null ? ` El desglose cognitivo muestra ${promConc.toFixed(1)}% en pruebas conceptuales frente a ${promOper.toFixed(1)}% en pruebas operativas.` : '') +
      ` Focos prioritarios de refuerzo: ${topTemasDeb}. Objetivo de seguimiento al siguiente grado: evaluar la retención a largo plazo y el efecto del acompañamiento mediado por M.E.T.A.S.`;

    return {
      num: al.num, nombre: al.nombre, codigoTesis,
      celdas, notas, pruebasHechas, totalEnActas, nspExplicito, noRegistrado, pruebasSinHacer, nspConFaltaDia, pctPruebas,
      prom, med, std, delta, promConc, promOper, brechaOper,
      matsDebiles, matsFuertes, temasReprobados: temasReprobados.sort((x, y) => x.nota - y.nota),
      asis, mis: { intentos: mis.intentos, misionesUnicas: mis.misionesSet.size, promMis, minutos: mis.minutos, pautas: mis.pautas },
      patronTag, patronClase, patronDesc, casoTipo, casoDestacado, sintesisCaso
    };
  });

  // Inicializar selección de tesis por defecto (casos destacados o todos si no se ha tocado)
  if (!_paTesisSeleccion) {
    _paTesisSeleccion = new Set(alumnosStats.filter(a => a.casoDestacado).map(a => a.num));
    if (_paTesisSeleccion.size === 0) alumnosStats.forEach(a => _paTesisSeleccion.add(a.num));
  }

  // 6. Correlaciones de Pearson reales del grupo
  const conProm = alumnosStats.filter(a => a.prom !== null);
  const rFaltasProm = paLabPearson(conProm.map(a => a.asis.totalFaltas), conProm.map(a => a.prom));
  const rFaltasNsp  = paLabPearson(alumnosStats.map(a => a.asis.totalFaltas), alumnosStats.map(a => a.nspExplicito));
  const rNspProm    = paLabPearson(conProm.map(a => a.pruebasHechas), conProm.map(a => a.prom));
  const conMis      = conProm.filter(a => a.mis.intentos > 0 || misionesPorAlumno.size > 0);
  const rMisProm    = misionesPorAlumno.size >= 3 ? paLabPearson(conMis.map(a => a.mis.intentos), conMis.map(a => a.prom)) : null;
  const conAmbas    = conProm.filter(a => a.promConc !== null && a.promOper !== null);
  const rConcOper   = paLabPearson(conAmbas.map(a => a.promConc), conAmbas.map(a => a.promOper));

  return {
    cron, evalsStats, materiasStats, alumnosStats, grupoAula, diasPaseLista, nubeCache,
    misionesHayDatos: misionesPorAlumno.size > 0,
    global: {
      nEvals: evalsStats.length,
      nAlumnos: alumnosStats.length,
      nRegistros: todasNotasGlobal.length,
      prom: paLabMean(todasNotasGlobal),
      med: paLabMedian(todasNotasGlobal),
      std: paLabStd(todasNotasGlobal),
      pctAprob: todasNotasGlobal.length ? (todasNotasGlobal.filter(x => x >= 70).length / todasNotasGlobal.length) * 100 : 0,
      pctExc: todasNotasGlobal.length ? (todasNotasGlobal.filter(x => x >= 90).length / todasNotasGlobal.length) * 100 : 0,
      totalNsp: totalNspGlobal
    },
    correlaciones: { rFaltasProm, rFaltasNsp, rNspProm, rMisProm, rConcOper }
  };
}

function paRenderLaboratorioHtml(vistos, todos) {
  const datos = paConstruirDatosLaboratorio(vistos, todos);
  const tabInfo = PA_LAB_TABS.find(t => t.id === _paLabTab) || PA_LAB_TABS[0];
  let bodyHtml = '';
  if (_paLabTab === 'descriptivo') bodyHtml = paLabVistaDescriptiva(datos);
  else if (_paLabTab === 'matriz') bodyHtml = paLabVistaMatriz(datos);
  else if (_paLabTab === 'ausentismo') bodyHtml = paLabVistaAusentismo(datos);
  else if (_paLabTab === 'misiones') bodyHtml = paLabVistaMisiones(datos);
  else if (_paLabTab === 'grupos') bodyHtml = paLabVistaGrupos(datos);
  else if (_paLabTab === 'hipotesis') bodyHtml = paLabVistaHipotesis(datos);
  else if (_paLabTab === 'filosofia') bodyHtml = paLabVistaFilosofia(datos);
  else if (_paLabTab === 'investigacion') bodyHtml = paLabVistaInvestigacion(datos);

  return `
    <div class="pa-lab-panel" id="pa-lab-panel">
      <div class="pa-lab-hdr">
        <div class="pa-lab-hdr-left">
          <span class="pa-lab-role-badge">${tabInfo.ico} Perspectiva: ${paEsc(tabInfo.rol)}</span>
          <h4 class="pa-lab-title">${paEsc(tabInfo.tit)}</h4>
        </div>
        <div class="pa-lab-hdr-btns">
          <button type="button" class="pa-lab-act-btn sync" id="pa-lab-sync-nube" title="Traer últimos registros de práctica de misiones desde la nube">🔄 Cruzar nube de misiones</button>
          <button type="button" class="pa-lab-act-btn print" id="pa-lab-print-btn">🖨️ Imprimir vista actual</button>
          <button type="button" class="pa-lab-act-btn close" id="pa-lab-close-btn">✕ Cerrar</button>
        </div>
      </div>
      <div class="pa-lab-tabs-bar">
        ${PA_LAB_TABS.map(t => `
          <button type="button" class="pa-lab-tab-btn${t.dest ? ' tesis-tab' : ''}${_paLabTab === t.id ? ' active' : ''}" data-switchlab="${t.id}">
            <span>${t.ico}</span>
            <span>${paEsc(t.corto)}</span>
          </button>`).join('')}
      </div>
      <div class="pa-lab-body" id="pa-lab-body-content">
        ${bodyHtml}
      </div>
    </div>`;
}

/* ── VISTA 1: ANÁLISIS DESCRIPTIVO Y TEMAS DE MAYOR DIFICULTAD ── */
function paLabVistaDescriptiva(datos) {
  const g = datos.global;
  const fmt = v => v !== null && v !== undefined ? v.toFixed(1) : '—';
  const peoresTemas = [...datos.evalsStats].sort((a, b) => b.indiceDif - a.indiceDif).slice(0, 8);
  const evalsConc = datos.evalsStats.filter(e => e.tipoEval === 'conceptual' && e.prom !== null);
  const evalsOper = datos.evalsStats.filter(e => e.tipoEval === 'operativa' && e.prom !== null);
  const promConc = paLabMean(evalsConc.map(e => e.prom));
  const promOper = paLabMean(evalsOper.map(e => e.prom));

  return `
    <div class="pa-lab-kpis">
      <div class="pa-lab-kpi"><span class="k-val">${g.nEvals}</span><span class="k-lbl">Evaluaciones analizadas</span></div>
      <div class="pa-lab-kpi"><span class="k-val">${fmt(g.prom)}%</span><span class="k-lbl">Media aritmética (x̄)</span></div>
      <div class="pa-lab-kpi"><span class="k-val">${fmt(g.med)}%</span><span class="k-lbl">Mediana central (Me)</span></div>
      <div class="pa-lab-kpi"><span class="k-val">±${fmt(g.std)}</span><span class="k-lbl">Desviación estándar (σ)</span></div>
      <div class="pa-lab-kpi ok"><span class="k-val">${fmt(g.pctAprob)}%</span><span class="k-lbl">Tasa de aprobación (≥70%)</span></div>
      <div class="pa-lab-kpi warn"><span class="k-val">${g.totalNsp}</span><span class="k-lbl">NSP marcados en actas</span></div>
    </div>

    ${(promConc !== null && promOper !== null) ? `
      <div class="pa-lab-insight-box">
        <strong>⚖️ Balance Conceptual vs. Operativo:</strong> En pruebas <strong>Conceptuales</strong> (comprensión y teoría, ${evalsConc.length} eval.) el promedio es <strong>${fmt(promConc)}%</strong>, mientras que en pruebas <strong>Operativas</strong> (resolución práctica, ${evalsOper.length} eval.) es <strong>${fmt(promOper)}%</strong>.
        ${promOper + 5 < promConc
          ? `Existe una <strong>caída de ${(promConc - promOper).toFixed(1)} puntos al pasar de la teoría a la práctica</strong>: el grupo comprende los conceptos pero requiere mayor modelaje paso a paso y ejercitación guiada.`
          : `El grupo mantiene coherencia entre la comprensión conceptual y la ejecución práctica.`}
      </div>` : ''}

    <div class="pa-lab-grid-2">
      <div class="pa-lab-subcard">
        <div class="pa-lab-subtit">🎯 ¿Dónde reforzar primero? (Temas que más se dificultan)</div>
        <p class="pa-lab-hint">Ordenados por Índice de Dificultad (combina bajo promedio y porcentaje de alumnos por debajo de 70%).</p>
        <div class="pa-lab-table-wrap">
          <table class="pa-lab-table">
            <thead><tr><th>Tema / Evaluación</th><th>Materia</th><th>Tipo</th><th>Prom.</th><th>&lt;70%</th><th>Acción sugerida</th></tr></thead>
            <tbody>
              ${peoresTemas.map(ev => {
                const urg = ev.prom !== null && ev.prom < 70 ? '🔴 Reenseñar base' : (ev.pctReprob >= 25 ? '🟠 Refuerzo focalizado' : '🟢 Consolidado');
                return `<tr>
                  <td><strong>${paEsc(ev.corto)}</strong>${ev.parcial ? ` <span class="pa-hist-pill-parcial">P-${paEsc(ev.parcial)}</span>` : ''}</td>
                  <td>${ev.matEmoji} ${paEsc(ev.matNom)}</td>
                  <td>${ev.tipoEval === 'operativa' ? '🔧 Operativa' : '📘 Conceptual'}</td>
                  <td><strong>${fmt(ev.prom)}%</strong></td>
                  <td>${ev.reprobados}/${ev.notas.length} (${ev.pctReprob.toFixed(0)}%)</td>
                  <td>${urg}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="pa-lab-subcard">
        <div class="pa-lab-subtit">📚 Diagnóstico Descriptivo por Materia</div>
        <p class="pa-lab-hint">Comparativa acumulada de promedio, dispersión (σ) y tasa de dominio por asignatura.</p>
        <div class="pa-lab-table-wrap">
          <table class="pa-lab-table">
            <thead><tr><th>Materia</th><th>Evals.</th><th>Promedio</th><th>Dispersión σ</th><th>Dominio ≥70%</th><th>NSP</th></tr></thead>
            <tbody>
              ${datos.materiasStats.map(m => `<tr>
                <td><strong>${m.emoji} ${paEsc(m.nom)}</strong></td>
                <td>${m.evals.length}</td>
                <td><span class="pa-hist-prom-pill ${m.prom >= 80 ? 'alto' : (m.prom >= 70 ? 'medio' : 'bajo')}">${fmt(m.prom)}%</span></td>
                <td>±${fmt(m.std)}</td>
                <td>${fmt(m.pctAprob)}%</td>
                <td>${m.nsp}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

/* ── VISTA 2: MATRIZ ALUMNO × EVALUACIÓN Y PATRONES INDIVIDUALES ── */
function paLabVistaMatriz(datos) {
  const evalsVista = datos.evalsStats.slice(-12);
  return `
    <p class="pa-lab-hint">Cada fila sintetiza la trayectoria real del estudiante en las pruebas presentadas, su evolución longitudinal (Δ entre la 1.ª y 2.ª mitad de sus evaluaciones), su patrón pedagógico y exactamente <strong>qué temas/materias debe reforzar</strong>.</p>
    <div class="pa-lab-table-wrap">
      <table class="pa-lab-table pa-lab-matrix">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Alumno</th>
            <th>Prom.</th>
            <th>Tendencia Δ</th>
            <th>Pruebas</th>
            <th>Patrón Pedagógico</th>
            <th>¿Dónde hay que reforzar? (Temas &lt;70%)</th>
            ${evalsVista.map((ev, i) => `<th title="${paEsc(ev.titulo + ' (' + ev.fecha + ')')}">E${i + 1}<br><small>${paEsc(ev.corto.slice(0, 8))}</small></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${datos.alumnosStats.map(al => {
            const promTxt = al.prom !== null ? al.prom.toFixed(1) + '%' : '—';
            const deltaTxt = al.notas.length >= 2 ? ((al.delta >= 0 ? '+' : '') + al.delta.toFixed(1)) : '—';
            const deltaCls = al.delta >= 5 ? 'pos' : (al.delta <= -5 ? 'neg' : '');
            const refTxt = al.temasReprobados.length
              ? al.temasReprobados.slice(0, 3).map(t => `<span class="pa-lab-ref-chip">${paEsc(t.titulo)} <b>${t.nota}%</b></span>`).join(' ') + (al.temasReprobados.length > 3 ? ` <small class="pa-lab-more-chip">+${al.temasReprobados.length - 3} más</small>` : '')
              : (al.matsDebiles.length ? al.matsDebiles.map(m => `<span class="pa-lab-ref-chip warn">${paEsc(m.materia)} ${m.prom.toFixed(0)}%</span>`).join(' ') : '<span class="pa-lab-ok-tag">✅ Sin rezagos críticos</span>');
            const celdasVista = al.celdas.slice(-12);
            return `<tr>
              <td><strong>${al.num}</strong></td>
              <td><strong>${paEsc(al.nombre)}</strong></td>
              <td><span class="pa-hist-prom-pill ${al.prom >= 80 ? 'alto' : (al.prom >= 70 ? 'medio' : 'bajo')}">${promTxt}</span></td>
              <td class="pa-lab-delta ${deltaCls}">${deltaTxt}</td>
              <td><strong>${al.pruebasHechas}</strong>/${datos.evalsStats.length}</td>
              <td><span class="pa-lab-pat-badge ${al.patronClase}" title="${paEsc(al.patronDesc)}">${paEsc(al.patronTag)}</span></td>
              <td>${refTxt}</td>
              ${celdasVista.map(c => {
                if (c.estado === 'sin_acta') return `<td class="hm-cell hm-nsp" title="No incluido en el acta de esa evaluación">—</td>`;
                if (c.estado !== 'ok') return `<td class="hm-cell hm-nsp" title="${c.faltaEseDia ? 'NSP (Faltó a clases ese día)' : 'NSP en acta'}">NSP${c.faltaEseDia ? '📅' : ''}</td>`;
                const cls = c.nota >= 90 ? 'hm-exc' : (c.nota >= 80 ? 'hm-ava' : (c.nota >= 70 ? 'hm-bas' : 'hm-ins'));
                return `<td class="hm-cell ${cls}">${c.nota}</td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── VISTA 3: PARTICIPACIÓN EN PRUEBAS × DÍAS FALTADOS ── */
function paLabVistaAusentismo(datos) {
  const ranking = [...datos.alumnosStats].sort((a, b) => {
    if (a.pruebasHechas !== b.pruebasHechas) return a.pruebasHechas - b.pruebasHechas;
    if (b.nspExplicito !== a.nspExplicito) return b.nspExplicito - a.nspExplicito;
    return b.asis.totalFaltas - a.asis.totalFaltas;
  });
  const rNP = datos.correlaciones.rNspProm;
  const rFP = datos.correlaciones.rFaltasProm;

  return `
    <div class="pa-lab-insight-box">
      <strong>📅 Cruce entre Participación en Pruebas y Registro de Asistencia (${datos.grupoAula ? paEsc(paGrupoTxt(datos.grupoAula.grado, datos.grupoAula.seccion)) : 'Mi Aula'}):</strong><br>
      Se cruzaron <strong>${datos.evalsStats.length} evaluaciones</strong> con <strong>${datos.diasPaseLista} días de pase de lista</strong> y registros SACE.
      ${rNP !== null ? ` Correlación Pruebas Realizadas ↔ Promedio académico: <strong>r = ${rNP.toFixed(2)}</strong>.` : ''}
      ${rFP !== null ? ` Correlación Días Faltados ↔ Promedio: <strong>r = ${rFP.toFixed(2)}</strong>.` : ''}
      Aquí se distingue con precisión entre <strong>NSP marcados en acta</strong> (cuando el alumno estaba en la lista de esa prueba y no tuvo nota) y evaluaciones donde el acta tenía menos alumnos registrados.
    </div>
    <div class="pa-lab-table-wrap">
      <table class="pa-lab-table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Alumno</th>
            <th>Pruebas Realizadas</th>
            <th>NSP en Acta</th>
            <th>Faltas Registradas (Lista / SACE)</th>
            <th>Promedio en Pruebas</th>
            <th>Lectura Pedagógica de Continuidad</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(al => {
            let diag = '<span class="pa-lab-ok-tag">✅ Participación constante y evaluaciones al día.</span>';
            if (al.nspExplicito >= 2 && al.asis.totalFaltas >= 3) {
              diag = `🔴 <strong>NSP asociados a inasistencias:</strong> Registra ${al.nspExplicito} NSP en acta y ${al.asis.totalFaltas} faltas de asistencia. Reprogramar pruebas pendientes.`;
            } else if (al.nspExplicito >= 2 && al.asis.totalFaltas <= 1) {
              diag = `🟠 <strong>NSP estando en aula:</strong> Tiene ${al.nspExplicito} NSP marcados sin registrar ausentismo alto. Revisar entrega de examen o bloqueo.`;
            } else if (al.pctPruebas < 65 && al.prom !== null && al.prom < 70) {
              diag = `🟡 <strong>Menor evidencia evaluativa (${al.pruebasHechas}/${datos.evalsStats.length}):</strong> Aparece en menos actas del periodo y requiere nivelación (<70%).`;
            } else if (al.pctPruebas < 75 && al.prom !== null && al.prom >= 70) {
              diag = `🔵 <strong>Aprueba las pruebas que presenta (${al.prom.toFixed(1)}%):</strong> Rinde bien cuando es evaluado (${al.pruebasHechas} pruebas registradas).`;
            } else if (al.asis.totalFaltas >= 4 && al.prom !== null && al.prom >= 75) {
              diag = `🟢 <strong>Resiliencia académica:</strong> Pese a registrar ${al.asis.totalFaltas} faltas, se puso al día y sostiene buen promedio (${al.prom.toFixed(1)}%).`;
            }
            return `<tr>
              <td><strong>${al.num}</strong></td>
              <td><strong>${paEsc(al.nombre)}</strong></td>
              <td><strong>${al.pruebasHechas}</strong>/${datos.evalsStats.length} <small>(${al.pctPruebas}%)</small></td>
              <td><strong>${al.nspExplicito}</strong>${al.nspConFaltaDia ? ` <small>(${al.nspConFaltaDia} en día de falta)</small>` : ''}</td>
              <td><strong>${al.asis.totalFaltas}</strong> <small>(A:${al.asis.A} · E:${al.asis.E}${al.asis.sace ? ' · SACE:' + al.asis.sace : ''})</small></td>
              <td><span class="pa-hist-prom-pill ${al.prom >= 80 ? 'alto' : (al.prom >= 70 ? 'medio' : 'bajo')}">${al.prom !== null ? al.prom.toFixed(1) + '%' : '—'}</span></td>
              <td>${diag}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── VISTA 4: CRUCE CON PRÁCTICA DE MISIONES EN LA NUBE ── */
function paLabVistaMisiones(datos) {
  if (!datos.misionesHayDatos) {
    return `<div class="pa-lab-insight-box">
      <strong>☁️ Sin caché local de práctica de misiones todavía:</strong> Pulsa el botón superior <strong>«🔄 Cruzar nube de misiones»</strong> para descargar en un segundo los intentos, puntajes y minutos de práctica autónoma de tus alumnos desde Supabase y cruzarlos con las notas del Plan de Acción.
    </div>`;
  }
  const rMP = datos.correlaciones.rMisProm;
  return `
    <div class="pa-lab-insight-box">
      <strong>🎮 Matriz de Transferencia (Práctica Autónoma en Misiones ↔ Examen Oficial):</strong>
      ${rMP !== null ? ` Correlación Intentos de Práctica ↔ Promedio en Plan de Acción: <strong>r = ${rMP.toFixed(2)}</strong>.` : ''}
      Cruza el estudio interactivo en casa/aula con el resultado real en las evaluaciones.
    </div>
    <div class="pa-lab-table-wrap">
      <table class="pa-lab-table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Alumno</th>
            <th>Intentos en Misiones</th>
            <th>Misiones Distintas</th>
            <th>Prom. en Práctica</th>
            <th>Prom. Plan de Acción</th>
            <th>Cuadrante de Transferencia Pedagógica</th>
          </tr>
        </thead>
        <tbody>
          ${datos.alumnosStats.map(al => {
            const m = al.mis;
            let cuad = '⚪ Sin práctica registrada en nube';
            if (m.intentos >= 2 && al.prom !== null && al.prom >= 75) {
              cuad = '🌟 <strong>Transferencia Exitosa:</strong> La práctica autónoma consolida el dominio en la prueba.';
            } else if (m.intentos >= 2 && al.prom !== null && al.prom < 70) {
              cuad = '🆘 <strong>Esfuerzo sin Transferencia:</strong> Practica en la plataforma pero reprueba la evaluación formal (revisar comprensión lectora o dependencia de pistas).' + (m.pautas ? ` ⚠️ Abrió la pauta ${m.pautas} vez/veces.` : '');
            } else if (m.intentos === 0 && al.prom !== null && al.prom >= 80) {
              cuad = '🧩 <strong>Dominio de Aula sin Práctica Digital:</strong> Rinde bien en examen sin usar el simulador (posible falta de dispositivo o conectividad en casa).';
            } else if (m.intentos === 0 && al.prom !== null && al.prom < 70) {
              cuad = '⚠️ <strong>Doble Desconexión:</strong> Bajo rendimiento en aula y cero práctica de refuerzo en misiones.';
            }
            return `<tr>
              <td><strong>${al.num}</strong></td>
              <td><strong>${paEsc(al.nombre)}</strong></td>
              <td><strong>${m.intentos}</strong>${m.minutos ? ` <small>(${m.minutos} min)</small>` : ''}</td>
              <td>${m.misionesUnicas}</td>
              <td>${m.promMis !== null ? m.promMis.toFixed(1) + '%' : '—'}</td>
              <td><span class="pa-hist-prom-pill ${al.prom >= 80 ? 'alto' : (al.prom >= 70 ? 'medio' : 'bajo')}">${al.prom !== null ? al.prom.toFixed(1) + '%' : '—'}</span></td>
              <td>${cuad}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── VISTA 5: ANÁLISIS POR GRUPOS (CLÚSTERES DE INTERVENCIÓN PEDAGÓGICA) ── */
function paLabVistaGrupos(datos) {
  const gRescate   = datos.alumnosStats.filter(a => a.prom !== null && a.prom < 70);
  const gOperativa = datos.alumnosStats.filter(a => a.prom !== null && a.prom >= 70 && a.brechaOper !== null && a.brechaOper <= -12);
  const gAscenso   = datos.alumnosStats.filter(a => a.delta >= 7);
  const gVolatil   = datos.alumnosStats.filter(a => a.prom !== null && a.prom >= 70 && (a.std >= 16 || a.delta <= -7));
  const gTutores   = datos.alumnosStats.filter(a => a.prom !== null && a.prom >= 85 && a.std < 14);

  const renderCluster = (icono, titulo, colorCls, desc, estrategia, lista) => `
    <div class="pa-lab-cluster ${colorCls}">
      <div class="pa-lab-cluster-hdr">
        <span>${icono} <strong>${paEsc(titulo)}</strong></span>
        <span class="pa-lab-cluster-cnt">${lista.length} alumno${lista.length === 1 ? '' : 's'}</span>
      </div>
      <p class="pa-lab-cluster-desc">${desc}</p>
      <div class="pa-lab-cluster-strat"><strong>💡 Intervención pedagógica:</strong> ${estrategia}</div>
      <div class="pa-lab-cluster-list">
        ${lista.length ? lista.map(a => `<span class="pa-lab-al-chip"><strong>#${a.num}</strong> ${paEsc(a.nombre)} <small>(${a.prom !== null ? a.prom.toFixed(0) + '%' : 'S/D'})</small></span>`).join('') : '<em>Ningún alumno en este perfil actualmente.</em>'}
      </div>
    </div>`;

  return `
    <p class="pa-lab-hint">Segmentación automática del salón en <strong>5 clústeres de acción pedagógica</strong> para organizar mesas de refuerzo, nivelación operativa y tutoría entre iguales.</p>
    <div class="pa-lab-clusters-grid">
      ${renderCluster('🔴', 'Grupo 1: Nivelación Prioritaria y Andamiaje Base (Prom. < 70%)', 'c-red',
        'Estudiantes cuyo promedio acumulado requiere refuerzo directo en los conceptos fundamentales.',
        'Trabajar en mesa focalizada con evaluaciones formativas cortas, retroalimentación inmediata y refuerzo en los temas críticos detectados en la pestaña 1.', gRescate)}
      ${renderCluster('🟠', 'Grupo 2: Brecha Procedimental / Operativa (Comprenden la teoría, bajan en la práctica)', 'c-amber',
        'Aprueban los cuestionarios conceptuales pero caen 12 puntos o más en las pruebas operativas.',
        'Modelar la resolución de problemas paso a paso en pizarra y usar guías de ejercicios resueltos antes de la prueba operativa.', gOperativa)}
      ${renderCluster('📈', 'Grupo 3: Respuesta Positiva y Superación Longitudinal (Δ ≥ +7 pts)', 'c-blue',
        'Alumnos que muestran un crecimiento sostenido entre la primera y la segunda mitad del periodo.',
        'Reconocer públicamente su curva de mejora y enviar felicitación a la familia para afianzar su autoeficacia.', gAscenso)}
      ${renderCluster('🟡', 'Grupo 4: Desempeño Variable o con Alerta de Descenso (σ ≥ 16 o Δ ≤ -7)', 'c-yellow',
        'Alumnos con capacidad demostrada (notas altas en varios temas) pero que sufren caídas puntuales.',
        'Revisar hábitos de repaso previo al examen y verificar qué temas específicos les generaron confusión.', gVolatil)}
      ${renderCluster('🟢', 'Grupo 5: Red de Tutores Pares / Monitores de Aprendizaje (Prom. ≥ 85% constante)', 'c-green',
        'Estudiantes con dominio sólido y estabilidad a lo largo de las asignaturas.',
        'Asignarlos como coordinadores o tutores pares (Zona de Desarrollo Próximo de Vygotsky) junto a compañeros de los Grupos 1 y 2.', gTutores)}
    </div>`;
}

/* ── VISTA 6: HIPÓTESIS, CORRELACIONES CAUSALES Y PSICOLOGÍA EDUCATIVA ── */
function paLabVistaHipotesis(datos) {
  const c = datos.correlaciones;
  const interpR = r => {
    if (r === null || isNaN(r)) return 'Datos insuficientes aún';
    const abs = Math.abs(r);
    const dir = r >= 0 ? 'positiva' : 'inversa (negativa)';
    const fza = abs >= 0.6 ? 'fuerte' : (abs >= 0.35 ? 'moderada' : (abs >= 0.15 ? 'débil' : 'casi nula'));
    return `r = ${r.toFixed(2)} (correlación ${dir} ${fza})`;
  };
  const enDescenso = datos.alumnosStats.filter(a => a.delta <= -6);
  const enAscenso  = datos.alumnosStats.filter(a => a.delta >= 6);

  return `
    <div class="pa-lab-grid-2">
      <div class="pa-lab-subcard">
        <div class="pa-lab-subtit">📐 Matriz de Hipótesis y Correlaciones Empíricas del Aula</div>
        <ul class="pa-lab-hyp-list">
          <li>
            <strong>H₁ — Continuidad Evaluativa vs. Rendimiento Académico:</strong><br>
            <span>Cruce Pruebas Realizadas ↔ Promedio: <strong>${interpR(c.rNspProm)}</strong> · Inasistencias ↔ Promedio: <strong>${interpR(c.rFaltasProm)}</strong>.</span>
            <p>${c.rNspProm !== null && c.rNspProm > 0.2
              ? '✅ <em>Hipótesis confirmada en este grupo:</em> La participación continua en las evaluaciones formativas y sumativas se asocia positivamente con un mayor promedio global.'
              : 'ℹ️ <em>Efecto distribuido:</em> Las diferencias de promedio responden principalmente a la complejidad de los temas específicos más que a la cantidad de pruebas presentadas.'}</p>
          </li>
          <li>
            <strong>H₂ — Esfuerzo Autónomo en Misiones M.E.T.A.S vs. Nota de Evaluación:</strong><br>
            <span>Cruce Intentos en Misiones ↔ Promedio: <strong>${interpR(c.rMisProm)}</strong>.</span>
            <p>${c.rMisProm !== null && c.rMisProm > 0.25
              ? '✅ <em>Hipótesis confirmada:</em> Quienes practican activamente las misiones interactivas obtienen mejores calificaciones en las pruebas formales.'
              : 'ℹ️ Pulsa «🔄 Cruzar nube de misiones» o fomenta el uso previo del simulador para fortalecer la transferencia al examen.'}</p>
          </li>
          <li>
            <strong>H₃ — Coherencia Teórico-Práctica (Conceptual ↔ Operativa):</strong><br>
            <span>Correlación intra-alumno Conceptual ↔ Operativa: <strong>${interpR(c.rConcOper)}</strong>.</span>
            <p>${c.rConcOper !== null && c.rConcOper < 0.5
              ? '⚠️ <em>Disociación detectada:</em> Saber la definición no garantiza saber ejecutar el procedimiento; conviene integrar práctica operativa desde el inicio del tema.'
              : '✅ <em>Alta transferencia:</em> El dominio conceptual de los alumnos se traduce de manera consistente en resolución operativa.'}</p>
          </li>
        </ul>
      </div>

      <div class="pa-lab-subcard">
        <div class="pa-lab-subtit">🧠 Lectura desde la Psicología Educativa</div>
        <ul class="pa-lab-hyp-list">
          <li>
            <strong>1. Prevención de la Indefensión Aprendida (Martin Seligman) y Fatiga Evaluativa:</strong>
            <p>Se detectan <strong>${enDescenso.length} alumno(s)</strong> con caída reciente (Δ ≤ -6 pts): ${enDescenso.slice(0, 5).map(a => `<strong>#${a.num} ${paEsc(a.nombre)}</strong> (${a.delta.toFixed(1)})`).join(', ') || 'ninguno'}. Cuando un niño encadena varios resultados bajos seguidos, asume que «no sirve para la materia» y deja de esforzarse. <em>Acción psicológica:</em> dosificar retos graduados donde logren éxito visible en los primeros reactivos.</p>
          </li>
          <li>
            <strong>2. Autoeficacia Percibida y Reconocimiento del Progreso (Albert Bandura):</strong>
            <p>Hay <strong>${enAscenso.length} alumno(s)</strong> en franco ascenso (Δ ≥ +6 pts): ${enAscenso.slice(0, 5).map(a => `<strong>#${a.num} ${paEsc(a.nombre)}</strong> (+${a.delta.toFixed(1)})`).join(', ') || 'en consolidación'}. Visibilizar su curva de mejora ante su familia refuerza más la motivación intrínseca que premiar únicamente al que siempre saca 100.</p>
          </li>
          <li>
            <strong>3. Teoría de la Carga Cognitiva (John Sweller):</strong>
            <p>En los temas con promedio menor a 75%, el bloqueo suele ocurrir por saturación de memoria de trabajo al enfrentar enunciados largos o múltiples pasos simultáneos. Fragmentar la instrucción en micro-pasos reduce la ansiedad frente a la hoja de examen.</p>
          </li>
        </ul>
      </div>
    </div>`;
}

/* ── VISTA 7: TEORÍA PEDAGÓGICA Y FILOSOFÍA DE LA EDUCACIÓN ── */
function paLabVistaFilosofia(datos) {
  const g = datos.global;
  const tutores = datos.alumnosStats.filter(a => a.prom !== null && a.prom >= 85 && a.std < 14);
  const rezago  = datos.alumnosStats.filter(a => a.prom !== null && a.prom < 72);
  const parejas = [];
  for (let i = 0; i < Math.min(tutores.length, rezago.length, 6); i++) {
    parejas.push(`<strong>#${tutores[i].num} ${paEsc(tutores[i].nombre)}</strong> (${tutores[i].prom.toFixed(0)}%) ↔ <strong>#${rezago[i].num} ${paEsc(rezago[i].nombre)}</strong> (${rezago[i].prom.toFixed(0)}%)`);
  }

  return `
    <div class="pa-lab-philo-grid">
      <div class="pa-lab-philo-card">
        <div class="pa-lab-philo-tit">🤝 1. Lev Vygotsky — Zona de Desarrollo Próximo (ZDP) y Mediación Social</div>
        <p>Para Vygotsky, lo que el alumno hoy solo logra con ayuda de un par más capaz, mañana lo logrará con autonomía. Con una desviación estándar grupal de <strong>σ = ±${(g.std || 0).toFixed(1)}</strong>, la heterogeneidad del salón no es un obstáculo sino el motor del andamiaje.</p>
        <p><strong>Parejas Vygotskianas sugeridas hoy en tu aula:</strong> ${parejas.length ? parejas.join(' · ') : 'El grupo presenta homogeneidad alta; rotar liderazgo por materia.'}</p>
      </div>

      <div class="pa-lab-philo-card">
        <div class="pa-lab-philo-tit">🎯 2. Benjamin Bloom — Aprendizaje para el Dominio (Mastery Learning)</div>
        <p>Bloom demostró que la curva normal (donde unos pocos triunfan y otros fracasan) es el resultado de enseñar a todos al mismo ritmo sin pausas correctivas. Actualmente el <strong>${(g.pctAprob || 0).toFixed(1)}%</strong> de las calificaciones alcanza el umbral de dominio (≥70%) y el <strong>${(g.pctExc || 0).toFixed(1)}%</strong> logra excelencia (≥90%). Aplicando micro-enseñanza correctiva en los 3 temas más críticos de la Pestaña 1 antes de cerrar el parcial, la media del grupo (<strong>${(g.prom || 0).toFixed(1)}%</strong>) puede elevarse en hasta 1 desviación estándar.</p>
      </div>

      <div class="pa-lab-philo-card">
        <div class="pa-lab-philo-tit">🌱 3. David Ausubel — Aprendizaje Significativo vs. Aprendizaje Mecánico</div>
        <p>Cuando un estudiante aprueba una evaluación aislada pero cae en temas posteriores de la misma asignatura, hubo retención mecánica a corto plazo sin anclaje en sus organizadores previos. Vincular cada misión nueva con los errores corregidos del mes anterior transforma la calificación puntual en estructura cognitiva duradera.</p>
      </div>

      <div class="pa-lab-philo-card">
        <div class="pa-lab-philo-tit">🏛️ 4. Paulo Freire y la Filosofía del Cuidado Pedagógico</div>
        <p>En la filosofía de la educación, ningún número es neutral: detrás de cada calificación y de cada curva de progreso hay historias familiares, ritmos vitales y condiciones materiales. El verdadero valor de esta analítica en M.E.T.A.S no es etiquetar a los niños, sino darle al maestro ojos clínicos para llegar a tiempo a quien más necesita acompañamiento humano y pedagógico.</p>
      </div>
    </div>`;
}

/* ── VISTA 8: INVESTIGACIÓN, CASOS DE ESTUDIO Y CONSENTIMIENTO INFORMADO (TESIS M.E.T.A.S) ── */
function paTesisLoadCfg(datos) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('METAS_TESIS_CFG_V1') || '{}') || {}; } catch (_) {}
  let docSt = {};
  try { docSt = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1') || '{}') || {}; } catch (_) {}
  const g = datos && datos.grupoAula;
  const gNum = g ? parseInt(String(g.grado || '').replace(/\D/g, ''), 10) : 6;
  const sigGradoDef = gNum ? `${gNum + 1}.° Grado (Siguiente Grado Escolar)` : 'Siguiente Grado Escolar';
  return {
    titulo: saved.titulo || 'Evaluación Longitudinal del Impacto de la Aplicación Educativa M.E.T.A.S (Módulos Alumno y Docente) en el Rendimiento Académico, la Autorregulación y la Intervención Pedagógica Oportuna',
    investigador: saved.investigador || docSt.nombre || (g && g.docente) || 'Docente Investigador',
    centro: saved.centro || (g && g.escuela) || 'Centro de Educación Básica',
    gradoActual: saved.gradoActual || (g ? paGrupoTxt(g.grado, g.seccion) : '6.° Grado'),
    gradoSiguiente: saved.gradoSiguiente || sigGradoDef,
    modo: saved.modo || 'completo' // 'completo' | 'consentimiento' | 'caso'
  };
}

function paTesisSaveCfg(cfg) {
  try { localStorage.setItem('METAS_TESIS_CFG_V1', JSON.stringify(cfg)); } catch (_) {}
}

function paLabVistaInvestigacion(datos) {
  const cfg = paTesisLoadCfg(datos);
  const selCount = _paTesisSeleccion ? _paTesisSeleccion.size : 0;

  return `
    <div class="pa-tesis-hero">
      <div class="pa-tesis-hero-top">
        <div>
          <span class="pa-tesis-badge">🎓 MÓDULO DE INVESTIGACIÓN CIENTÍFICA Y TESIS — PROYECTO M.E.T.A.S</span>
          <h5 class="pa-tesis-h5">Expedientes de Caso de Estudio por Alumno y Consentimiento Informado Longitudinal</h5>
          <p class="pa-tesis-desc">Documenta empíricamente el impacto de <strong>M.E.T.A.S</strong> (tanto en el aprendizaje del alumno como en la toma de decisiones del docente) y genera las actas formales de <strong>Consentimiento Informado</strong> con firma del padre/madre y asentimiento del estudiante para continuar el seguimiento investigativo en el <strong>siguiente grado escolar</strong>.</p>
        </div>
      </div>

      <div class="pa-tesis-cfg-grid">
        <div class="pa-tesis-field full">
          <label>📘 Título del Estudio / Tesis de Investigación</label>
          <input type="text" id="pa-tesis-inp-titulo" value="${paEsc(cfg.titulo)}">
        </div>
        <div class="pa-tesis-field">
          <label>👨‍🏫 Docente Investigador(a)</label>
          <input type="text" id="pa-tesis-inp-inv" value="${paEsc(cfg.investigador)}">
        </div>
        <div class="pa-tesis-field">
          <label>🏫 Centro Educativo</label>
          <input type="text" id="pa-tesis-inp-centro" value="${paEsc(cfg.centro)}">
        </div>
        <div class="pa-tesis-field">
          <label>📍 Grado / Grupo Actual</label>
          <input type="text" id="pa-tesis-inp-gact" value="${paEsc(cfg.gradoActual)}">
        </div>
        <div class="pa-tesis-field">
          <label>🚀 Grado de Seguimiento (Próximo Año)</label>
          <input type="text" id="pa-tesis-inp-gsig" value="${paEsc(cfg.gradoSiguiente)}">
        </div>
        <div class="pa-tesis-field full">
          <label>🖨️ Formato del Documento a Generar e Imprimir</label>
          <select id="pa-tesis-sel-modo">
            <option value="completo"${cfg.modo === 'completo' ? ' selected' : ''}>📄 Ficha Completa: Caso de Estudio Longitudinal + Acta de Consentimiento Informado (Con firmas de Padre y Alumno)</option>
            <option value="consentimiento"${cfg.modo === 'consentimiento' ? ' selected' : ''}>✍️ Solo Acta de Consentimiento Informado Longitudinal (Para enviar a firmar a Padres y Alumnos)</option>
            <option value="caso"${cfg.modo === 'caso' ? ' selected' : ''}>📊 Solo Ficha Técnica de Caso de Estudio (Anexo Empírico para Tesis)</option>
          </select>
        </div>
      </div>

      <div class="pa-tesis-toolbar">
        <div class="pa-tesis-sel-btns">
          <button type="button" class="pa-tesis-sbtn" id="pa-tesis-sel-all">☑️ Seleccionar todos (${datos.alumnosStats.length})</button>
          <button type="button" class="pa-tesis-sbtn" id="pa-tesis-sel-dest">🔬 Seleccionar casos representativos (Muestra de Tesis)</button>
          <button type="button" class="pa-tesis-sbtn" id="pa-tesis-sel-none">⬜ Desmarcar todos</button>
        </div>
        <button type="button" class="pa-tesis-print-main" id="pa-tesis-print-lote">
          🖨️ Generar e Imprimir Seleccionados (<span id="pa-tesis-cnt">${selCount}</span> alumnos)
        </button>
      </div>
    </div>

    <div class="pa-lab-table-wrap">
      <table class="pa-lab-table pa-tesis-table">
        <thead>
          <tr>
            <th style="width:36px;text-align:center;">Elegir</th>
            <th>Nº / Código</th>
            <th>Alumno(a)</th>
            <th>Métricas Longitudinales</th>
            <th>Tipología y Síntesis del Caso de Estudio (M.E.T.A.S)</th>
            <th style="text-align:right;">Impresión Individual</th>
          </tr>
        </thead>
        <tbody>
          ${datos.alumnosStats.map(al => {
            const checked = _paTesisSeleccion && _paTesisSeleccion.has(al.num);
            const promTxt = al.prom !== null ? al.prom.toFixed(1) + '%' : 'S/D';
            const deltaTxt = al.notas.length >= 2 ? ((al.delta >= 0 ? '+' : '') + al.delta.toFixed(1) + ' pts') : '—';
            return `<tr class="${checked ? 'tesis-row-sel' : ''}">
              <td style="text-align:center;">
                <input type="checkbox" class="pa-tesis-chk" data-num="${al.num}" ${checked ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;accent-color:#4338ca;">
              </td>
              <td>
                <strong>#${al.num}</strong><br>
                <span class="pa-tesis-code">${paEsc(al.codigoTesis)}</span>
              </td>
              <td>
                <strong>${paEsc(al.nombre)}</strong><br>
                <span class="pa-lab-pat-badge ${al.patronClase}">${paEsc(al.patronTag)}</span>
              </td>
              <td style="white-space:nowrap;">
                <div>📊 Media: <strong>${promTxt}</strong> <small>(±${al.std.toFixed(1)})</small></div>
                <div>📈 Evolución Δ: <strong>${deltaTxt}</strong></div>
                <div>📝 Evidencia: <strong>${al.pruebasHechas}/${datos.evalsStats.length}</strong> pruebas</div>
              </td>
              <td>
                <div class="pa-tesis-tipo">${paEsc(al.casoTipo)}</div>
                <div class="pa-tesis-sintesis">${paEsc(al.sintesisCaso)}</div>
              </td>
              <td style="text-align:right;white-space:nowrap;">
                <button type="button" class="pa-tesis-row-btn primary" data-print-num="${al.num}" data-print-modo="completo" title="Imprimir Caso de Estudio + Consentimiento Informado">📄 Caso + Firma</button>
                <button type="button" class="pa-tesis-row-btn" data-print-num="${al.num}" data-print-modo="consentimiento" title="Imprimir solo el Consentimiento Informado para firma del padre y alumno">✍️ Solo Firma</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function paImprimirDocumentosTesis(datos, listaAlumnos, modoForzado) {
  if (!listaAlumnos || !listaAlumnos.length) {
    if (typeof toast === 'function') toast('⚠️ Selecciona al menos un alumno para generar el documento');
    return;
  }
  const cfg = paTesisLoadCfg(datos);
  const modo = modoForzado || cfg.modo || 'completo';
  const fechaHoy = new Date().toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });

  const paginasHtml = listaAlumnos.map(al => {
    const promTxt = al.prom !== null ? al.prom.toFixed(1) + '%' : 'S/D';
    const medTxt  = al.med !== null ? al.med.toFixed(1) + '%' : 'S/D';
    const stdTxt  = '±' + al.std.toFixed(1) + '%';
    const deltaTxt = al.notas.length >= 2 ? ((al.delta >= 0 ? '+' : '') + al.delta.toFixed(1) + ' pts') : 'S/D';
    const concTxt = al.promConc !== null ? al.promConc.toFixed(1) + '%' : 'S/D';
    const operTxt = al.promOper !== null ? al.promOper.toFixed(1) + '%' : 'S/D';
    const temasRef = al.temasReprobados.length
      ? al.temasReprobados.slice(0, 5).map(t => `${paEsc(t.titulo)} (${paEsc(t.materia)}: ${t.nota}%)`).join(' · ')
      : 'Dominio satisfactorio en los contenidos evaluados (≥70%).';

    const bloqueCaso = (modo === 'completo' || modo === 'caso') ? `
      <div class="sec-box">
        <div class="sec-title">I. FICHA TÉCNICA DE CASO DE ESTUDIO LONGITUDINAL (SISTEMA M.E.T.A.S)</div>
        <table class="meta-tbl">
          <tr>
            <th>Estudiante</th><td><strong>${paEsc(al.nombre)}</strong> (Lista #${al.num})</td>
            <th>Código Anónimo de Tesis</th><td><strong>${paEsc(al.codigoTesis)}</strong></td>
          </tr>
          <tr>
            <th>Grado Actual</th><td>${paEsc(cfg.gradoActual)}</td>
            <th>Proyección de Seguimiento</th><td>${paEsc(cfg.gradoSiguiente)}</td>
          </tr>
          <tr>
            <th>Tipología Metodológica</th><td colspan="3"><strong>${paEsc(al.casoTipo)}</strong> (${paEsc(al.patronTag)})</td>
          </tr>
        </table>

        <table class="kpi-tbl">
          <thead>
            <tr>
              <th>Pruebas Evaluadas (n)</th>
              <th>Media Aritmética (x̄)</th>
              <th>Mediana (Me)</th>
              <th>Desviación (σ)</th>
              <th>Tendencia Longitudinal (Δ)</th>
              <th>Media Conceptual</th>
              <th>Media Operativa</th>
              <th>Práctica Misiones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${al.pruebasHechas} / ${datos.evalsStats.length}</strong></td>
              <td><strong>${promTxt}</strong></td>
              <td>${medTxt}</td>
              <td>${stdTxt}</td>
              <td><strong>${deltaTxt}</strong></td>
              <td>${concTxt}</td>
              <td>${operTxt}</td>
              <td>${al.mis.intentos} int. (${al.mis.misionesUnicas} mis.)</td>
            </tr>
          </tbody>
        </table>

        <div class="narrativa-box">
          <div><strong>Síntesis Analítica del Caso (Evidencia Empírica):</strong> ${paEsc(al.sintesisCaso)}</div>
          <div style="margin-top:4px;"><strong>Áreas / Contenidos Curriculares por Reforzar en Transición al Siguiente Grado:</strong> ${temasRef}</div>
        </div>
      </div>` : '';

    const bloqueConsentimiento = (modo === 'completo' || modo === 'consentimiento') ? `
      <div class="sec-box">
        <div class="sec-title">${modo === 'completo' ? 'II.' : 'I.'} ACTA DE CONSENTIMIENTO INFORMADO FAMILIAR Y ASENTIMIENTO ESTUDIANTIL</div>
        <p class="legal-p">
          <strong>1. Propósito de la Investigación:</strong> El presente estudio académico (tesis de investigación educativa) evalúa el impacto pedagógico, formativo y analítico de la plataforma interactiva <strong>M.E.T.A.S</strong>, tanto en su dimensión de aprendizaje autónomo para el estudiante como en su dimensión de diagnóstico y Plan de Acción para el docente en el <strong>${paEsc(cfg.centro)}</strong>.
        </p>
        <p class="legal-p">
          <strong>2. Seguimiento Longitudinal en el Siguiente Grado (${paEsc(cfg.gradoSiguiente)}):</strong> Con el fin de analizar la retención del aprendizaje a mediano plazo, la evolución de los patrones de estudio y la efectividad de las estrategias de refuerzo generadas por el sistema, se solicita autorización para dar seguimiento académico y estadístico a los resultados del estudiante <strong>${paEsc(al.nombre)}</strong> durante su paso por el <strong>${paEsc(cfg.gradoSiguiente)}</strong>.
        </p>
        <p class="legal-p">
          <strong>3. Confidencialidad, Ética y Beneficio Pedagógico:</strong> Toda la información recopilada será tratada bajo estrictos estándares de ética de investigación educativa. En los informes de tesis, matrices estadísticas y publicaciones académicas, la identidad del estudiante se protegerá mediante el código anónimo <strong>${paEsc(al.codigoTesis)}</strong>. La participación es totalmente gratuita, voluntaria, no representa ningún riesgo y aporta retroalimentación pedagógica continua para apoyar el progreso escolar del alumno(a).
        </p>
        <div class="auth-check-box">
          <div style="margin-bottom:5px;font-weight:700;">Declaración de Decisión Informada:</div>
          <div class="auth-options">
            <span>☐ <strong>SÍ AUTORIZO</strong> la inclusión del caso de estudio y el seguimiento longitudinal de resultados en el siguiente grado dentro de la investigación del proyecto M.E.T.A.S.</span>
            <span>☐ <strong>NO AUTORIZO</strong> el seguimiento investigativo.</span>
          </div>
        </div>

        <div class="firmas-grid">
          <div class="firma-col">
            <div class="firma-line"></div>
            <div class="firma-rol">FIRMA DEL PADRE, MADRE O ENCARGADO</div>
            <div class="firma-meta">Nombre: ____________________________________</div>
            <div class="firma-meta">N.º Identidad (DNI): __________________________</div>
            <div class="firma-meta">Teléfono: ___________________________________</div>
          </div>
          <div class="firma-col">
            <div class="firma-line"></div>
            <div class="firma-rol">ASENTIMIENTO Y FIRMA DEL ALUMNO(A)</div>
            <div class="firma-meta">Alumno(a): <strong>${paEsc(al.nombre)}</strong></div>
            <div class="firma-meta">Código: <strong>${paEsc(al.codigoTesis)}</strong> · Lista #${al.num}</div>
            <div class="firma-meta">Grado: ${paEsc(cfg.gradoActual)} → ${paEsc(cfg.gradoSiguiente)}</div>
          </div>
          <div class="firma-col">
            <div class="firma-line"></div>
            <div class="firma-rol">FIRMA DEL DOCENTE INVESTIGADOR</div>
            <div class="firma-meta"><strong>${paEsc(cfg.investigador)}</strong></div>
            <div class="firma-meta">Centro: ${paEsc(cfg.centro)}</div>
            <div class="firma-meta">Fecha: ${paEsc(fechaHoy)}</div>
          </div>
        </div>
      </div>` : '';

    return `
      <div class="page-sheet">
        <div class="doc-hdr">
          <div class="doc-hdr-top">
            <span class="doc-kicker">PROYECTO DE INVESTIGACIÓN EDUCATIVA Y TESIS — PLATAFORMA M.E.T.A.S (ALUMNO · DOCENTE)</span>
            <span class="doc-code-pill">Expediente: ${paEsc(al.codigoTesis)}</span>
          </div>
          <h1 class="doc-main-title">${paEsc(cfg.titulo)}</h1>
          <div class="doc-sub-meta">
            <span>🏫 <strong>Centro:</strong> ${paEsc(cfg.centro)}</span>
            <span>👨‍🏫 <strong>Investigador:</strong> ${paEsc(cfg.investigador)}</span>
            <span>📅 <strong>Fecha:</strong> ${paEsc(fechaHoy)}</span>
          </div>
        </div>
        ${bloqueCaso}
        ${bloqueConsentimiento}
      </div>`;
  }).join('');

  const w = window.open('', '_blank');
  if (!w) {
    if (typeof toast === 'function') toast('⚠️ Activa las ventanas emergentes para imprimir los documentos');
    return;
  }
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
    <title>Casos de Estudio y Consentimiento Informado — Tesis M.E.T.A.S</title>
    <style>
      @page { size: letter portrait; margin: 12mm 14mm; }
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 11px; line-height: 1.42; }
      .page-sheet { page-break-after: always; padding: 4px 0; }
      .page-sheet:last-child { page-break-after: auto; }
      .doc-hdr { border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 10px; }
      .doc-hdr-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
      .doc-kicker { font-size: 9.5px; font-weight: 800; color: #1e3a8a; letter-spacing: .5px; text-transform: uppercase; }
      .doc-code-pill { font-size: 10px; font-weight: 800; background: #e0e7ff; color: #1e1b4b; padding: 2px 8px; border-radius: 99px; border: 1px solid #a5b4fc; }
      .doc-main-title { font-size: 13px; font-weight: 900; color: #0f172a; margin: 0 0 5px; line-height: 1.25; }
      .doc-sub-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 10px; color: #334155; }
      .sec-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 9px 11px; margin-bottom: 10px; background: #fff; }
      .sec-title { font-size: 10.5px; font-weight: 900; color: #1e3a8a; background: #f1f5f9; padding: 4px 8px; border-radius: 5px; margin-bottom: 8px; letter-spacing: .3px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10.2px; }
      .meta-tbl th, .meta-tbl td { border: 1px solid #cbd5e1; padding: 4px 7px; text-align: left; }
      .meta-tbl th { background: #f8fafc; width: 20%; color: #334155; font-weight: 800; }
      .kpi-tbl th, .kpi-tbl td { border: 1px solid #cbd5e1; padding: 4px 5px; text-align: center; }
      .kpi-tbl th { background: #f1f5f9; font-size: 9.5px; font-weight: 800; color: #1e293b; }
      .narrativa-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3.5px solid #1e3a8a; border-radius: 6px; padding: 7px 9px; font-size: 10.2px; text-align: justify; }
      .legal-p { margin: 0 0 6px; text-align: justify; font-size: 10.3px; color: #1e293b; }
      .auth-check-box { border: 1px dashed #64748b; border-radius: 6px; padding: 7px 10px; margin: 8px 0 14px; background: #f8fafc; font-size: 10.2px; }
      .auth-options { display: flex; flex-direction: column; gap: 4px; }
      .firmas-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-top: 26px; padding-top: 6px; }
      .firma-col { text-align: center; font-size: 9.8px; }
      .firma-line { border-bottom: 1.5px solid #0f172a; height: 28px; margin-bottom: 5px; }
      .firma-rol { font-weight: 900; color: #1e3a8a; margin-bottom: 4px; font-size: 9.5px; }
      .firma-meta { text-align: left; color: #334155; margin-top: 2px; line-height: 1.35; }
    </style></head><body>
    ${paginasHtml}
    <script>window.onload = function(){ window.print(); };<\/script>
  </body></html>`);
  w.document.close();
}

function paBindLaboratorioEvents(list, vistos, ordenados) {
  list.querySelectorAll('[data-switchlab]').forEach(btn => {
    btn.addEventListener('click', () => {
      _paLabTab = btn.getAttribute('data-switchlab') || 'descriptivo';
      paRenderHistorial();
    });
  });
  document.getElementById('pa-lab-close-btn')?.addEventListener('click', () => {
    _paLabAbierto = false;
    paRenderHistorial();
  });
  document.getElementById('pa-lab-sync-nube')?.addEventListener('click', async e => {
    const b = e.currentTarget;
    b.disabled = true;
    b.textContent = '⏳ Trayendo prácticas de la nube…';
    try {
      if (typeof estNubeRefrescar === 'function') {
        const res = await estNubeRefrescar();
        if (res && res.ok) toast('✅ Prácticas de misiones sincronizadas desde la nube');
        else toast('⚠️ No se pudo refrescar la nube (' + (res && res.err || 'revisa tu sesión docente') + ')');
      }
    } catch (_) {}
    paRenderHistorial();
  });
  document.getElementById('pa-lab-print-btn')?.addEventListener('click', () => {
    const bodyEl = document.getElementById('pa-lab-body-content');
    const tabInfo = PA_LAB_TABS.find(t => t.id === _paLabTab) || PA_LAB_TABS[0];
    if (!bodyEl) return;
    const w = window.open('', '_blank');
    if (!w) { toast('Activa las ventanas emergentes para imprimir'); return; }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${paEsc(tabInfo.tit)}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 20px; font-size: 12px; }
        h2 { margin: 0 0 4px; color: #1e3a8a; } .sub { color: #475569; margin-bottom: 14px; font-weight: 600; }
        .pa-lab-kpis { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .pa-lab-kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; flex: 1; min-width: 100px; text-align: center; }
        .k-val { display: block; font-size: 18px; font-weight: 900; color: #1e3a8a; } .k-lbl { font-size: 10px; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; font-size: 11px; }
        th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; }
        th { background: #f1f5f9; font-weight: 800; }
        .pa-lab-insight-box, .pa-lab-cluster, .pa-lab-philo-card, .pa-lab-subcard { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; break-inside: avoid; }
        .pa-lab-al-chip, .pa-lab-ref-chip { display: inline-block; border: 1px solid #cbd5e1; border-radius: 99px; padding: 2px 7px; margin: 2px; font-size: 10.5px; }
      </style></head><body>
      <h2>${tabInfo.ico} ${paEsc(tabInfo.tit)}</h2>
      <div class="sub">Plataforma M.E.T.A.S · Perspectiva: ${paEsc(tabInfo.rol)} · Fecha: ${new Date().toISOString().slice(0, 10)}</div>
      ${bodyEl.innerHTML}
      <script>window.onload = function(){ window.print(); };<\/script></body></html>`);
    w.document.close();
  });

  // Eventos específicos de la Pestaña 8: Investigación / Tesis / Consentimiento Informado
  if (_paLabTab === 'investigacion') {
    const datos = paConstruirDatosLaboratorio(vistos, ordenados);
    const leerGuardarCfg = () => {
      const cfg = {
        titulo: document.getElementById('pa-tesis-inp-titulo')?.value || '',
        investigador: document.getElementById('pa-tesis-inp-inv')?.value || '',
        centro: document.getElementById('pa-tesis-inp-centro')?.value || '',
        gradoActual: document.getElementById('pa-tesis-inp-gact')?.value || '',
        gradoSiguiente: document.getElementById('pa-tesis-inp-gsig')?.value || '',
        modo: document.getElementById('pa-tesis-sel-modo')?.value || 'completo'
      };
      paTesisSaveCfg(cfg);
      return cfg;
    };
    ['pa-tesis-inp-titulo', 'pa-tesis-inp-inv', 'pa-tesis-inp-centro', 'pa-tesis-inp-gact', 'pa-tesis-inp-gsig', 'pa-tesis-sel-modo'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', leerGuardarCfg);
      document.getElementById(id)?.addEventListener('input', leerGuardarCfg);
    });

    const actContador = () => {
      const el = document.getElementById('pa-tesis-cnt');
      if (el && _paTesisSeleccion) el.textContent = String(_paTesisSeleccion.size);
    };

    list.querySelectorAll('.pa-tesis-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const n = parseInt(chk.getAttribute('data-num'), 10);
        if (!n) return;
        if (!_paTesisSeleccion) _paTesisSeleccion = new Set();
        if (chk.checked) _paTesisSeleccion.add(n); else _paTesisSeleccion.delete(n);
        chk.closest('tr')?.classList.toggle('tesis-row-sel', chk.checked);
        actContador();
      });
    });

    document.getElementById('pa-tesis-sel-all')?.addEventListener('click', () => {
      _paTesisSeleccion = new Set(datos.alumnosStats.map(a => a.num));
      paRenderHistorial();
    });
    document.getElementById('pa-tesis-sel-none')?.addEventListener('click', () => {
      _paTesisSeleccion = new Set();
      paRenderHistorial();
    });
    document.getElementById('pa-tesis-sel-dest')?.addEventListener('click', () => {
      _paTesisSeleccion = new Set(datos.alumnosStats.filter(a => a.casoDestacado).map(a => a.num));
      paRenderHistorial();
    });
    document.getElementById('pa-tesis-print-lote')?.addEventListener('click', () => {
      leerGuardarCfg();
      const elegidos = datos.alumnosStats.filter(a => _paTesisSeleccion && _paTesisSeleccion.has(a.num));
      paImprimirDocumentosTesis(datos, elegidos, null);
    });
    list.querySelectorAll('[data-print-num]').forEach(btn => {
      btn.addEventListener('click', () => {
        leerGuardarCfg();
        const n = parseInt(btn.getAttribute('data-print-num'), 10);
        const modo = btn.getAttribute('data-print-modo') || 'completo';
        const al = datos.alumnosStats.find(a => a.num === n);
        if (al) paImprimirDocumentosTesis(datos, [al], modo);
      });
    });
  }
}

async function paRecuperarHistorialNube(btn) {
  const ok = (typeof metasConfirm === 'function')
    ? await metasConfirm('¿Buscar y forzar la recuperación de todos tus análisis en la nube de padres y respaldos?', { icono: '📥', titulo: 'Recuperar historial', okTxt: 'Sí, recuperar todo' })
    : confirm('¿Recuperar análisis de la nube?');
  if (!ok) return;

  let cred = null;
  try { cred = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1') || 'null'); } catch (_) {}
  const p_prof  = String((cred && (cred.codigo || cred.prof || cred.user)) || '').trim();
  const p_clave = String((cred && (cred.clave  || cred.pass || cred.pin))  || '').trim();

  const txtOrig = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Recuperando…'; }

  try {
    const { url, key } = paSbCfg();
    const headers = {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json'
    };

    const normGrado = g => String(g || '').replace(/\D/g, '') || String(g || '').trim().toLowerCase();
    const normSec = s => {
      const m = String(s || '').trim().match(/([a-zA-Z0-9])\s*$/);
      return m ? m[1].toLowerCase() : String(s || '').trim().toLowerCase();
    };
    const normKey = (ev, pa, gr, se) => [
      String(ev || '').trim().toLowerCase(),
      String(pa || '').trim().toLowerCase(),
      normGrado(gr),
      normSec(se)
    ].join('||');

    const d = paLoadData();
    if (!Array.isArray(d.analisis)) d.analisis = [];
    const porClave = new Map();
    d.analisis.forEach(a => {
      if (a && typeof a === 'object') {
        porClave.set(normKey(a.evaluacion, a.parcial, a.grado, a.seccion), a);
      }
    });

    let agregados = 0;
    let completados = 0;

    const integrarAnalisisObj = aCand => {
      if (!aCand || typeof aCand !== 'object' || !Array.isArray(aCand.students) || !aCand.students.length) return;
      const k = normKey(aCand.evaluacion, aCand.parcial, aCand.grado, aCand.seccion);
      const ex = porClave.get(k);
      if (!ex) {
        const copia = JSON.parse(JSON.stringify(aCand));
        if (!copia.id || d.analisis.some(x => x.id === copia.id)) {
          copia.id = 'A' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        }
        copia.grupoId = copia.grupoId || paGrupoIdDe(copia.grado, copia.seccion);
        (copia.students || []).forEach(s => {
          const cod = paCodigoLista(copia, s);
          if (cod) s.sb = paSbFirma(copia, s, cod);
        });
        d.analisis.push(copia);
        porClave.set(k, copia);
        agregados++;
      } else {
        if (!ex.parcial && aCand.parcial) ex.parcial = aCand.parcial;
        if (!ex.fechaPrueba && aCand.fechaPrueba) ex.fechaPrueba = aCand.fechaPrueba;
        const numsEx = new Set((ex.students || []).map(s => Number(s.num)));
        let sumo = false;
        (aCand.students || []).forEach(s => {
          const n = Number(s.num);
          if (n > 0 && !numsEx.has(n)) {
            const sCopia = JSON.parse(JSON.stringify(s));
            const cod = paCodigoLista(ex, sCopia);
            if (cod) sCopia.sb = paSbFirma(ex, sCopia, cod);
            ex.students.push(sCopia);
            numsEx.add(n);
            sumo = true;
          }
        });
        if (sumo) {
          ex.students.sort((x, y) => Number(x.num) - Number(y.num));
          completados++;
        }
      }
    };

    const parseSafe = raw => {
      if (!raw) return null;
      if (typeof raw === 'object') return raw;
      try { return JSON.parse(raw); } catch (_) { return null; }
    };

    const planesRaw = [];
    const codigosRaw = [paCodesLoad()];
    const adminsRaw = [parseSafe(localStorage.getItem('METAS_ADMIN_V1'))];

    // 1. Revisar respaldos locales (BASE, RESPALDO y UNDO)
    const baseObj = parseSafe(localStorage.getItem('METAS_DOCSYNC_BASE_V1'));
    if (baseObj && typeof baseObj === 'object') {
      if (baseObj.METAS_PLANACCION_V1) planesRaw.push(parseSafe(baseObj.METAS_PLANACCION_V1));
      if (baseObj.METAS_CODIGOS_V1)    codigosRaw.push(parseSafe(baseObj.METAS_CODIGOS_V1));
      if (baseObj.METAS_ADMIN_V1)      adminsRaw.push(parseSafe(baseObj.METAS_ADMIN_V1));
    }
    const respObj = parseSafe(localStorage.getItem('METAS_AULA_RESPALDO_V1'));
    if (respObj && respObj.datos && typeof respObj.datos === 'object') {
      if (respObj.datos.METAS_PLANACCION_V1) planesRaw.push(parseSafe(respObj.datos.METAS_PLANACCION_V1));
      if (respObj.datos.METAS_CODIGOS_V1)    codigosRaw.push(parseSafe(respObj.datos.METAS_CODIGOS_V1));
      if (respObj.datos.METAS_ADMIN_V1)      adminsRaw.push(parseSafe(respObj.datos.METAS_ADMIN_V1));
    }
    const undoArr = parseSafe(localStorage.getItem('METAS_ADMIN_UNDO_V1'));
    if (Array.isArray(undoArr)) {
      undoArr.forEach(u => {
        if (!u || typeof u !== 'object') return;
        if (u.plan)  planesRaw.push(parseSafe(u.plan));
        if (u.codes) codigosRaw.push(parseSafe(u.codes));
        if (u.admin) adminsRaw.push(parseSafe(u.admin));
      });
    }

    // 2. Consultar espejo del estado del docente en Supabase (metas_docente_estado_leer)
    if (p_prof && p_clave) {
      try {
        const rEst = await fetch(url + '/rest/v1/rpc/metas_docente_estado_leer', {
          method: 'POST',
          headers,
          body: JSON.stringify({ p_codigo: p_prof, p_clave: p_clave })
        });
        if (rEst.ok) {
          const rowsEst = await rEst.json();
          if (Array.isArray(rowsEst)) {
            rowsEst.forEach(row => {
              if (!row || !row.valor) return;
              const val = parseSafe(row.valor.raw !== undefined ? row.valor.raw : row.valor);
              if (row.k === 'METAS_PLANACCION_V1' && val) planesRaw.push(val);
              if (row.k === 'METAS_CODIGOS_V1'    && val) codigosRaw.push(val);
              if (row.k === 'METAS_ADMIN_V1'      && val) adminsRaw.push(val);
            });
          }
        }
      } catch (_) {}
    }

    planesRaw.forEach(pl => {
      if (pl && Array.isArray(pl.analisis)) {
        pl.analisis.forEach(integrarAnalisisObj);
      }
    });

    // 3. Intentar RPC directa metas_recuperar_historial (si falla con 400 no detiene nada)
    const filasNube = [];
    if (p_prof && p_clave) {
      try {
        const rHist = await fetch(url + '/rest/v1/rpc/metas_recuperar_historial', {
          method: 'POST',
          headers,
          body: JSON.stringify({ p_prof, p_clave })
        });
        if (rHist.ok) {
          const arrH = await rHist.json();
          if (Array.isArray(arrH)) arrH.forEach(x => filasNube.push(x));
        }
      } catch (_) {}
    }

    // 4. Armar mapa de grupos/alumnos y barrer la nube de padres por cada clave de familia
    //    usando metas_consultar_plan_padre (recupera el 100% de plan_accion aun sin RPC nuevo)
    const gruposInfo = new Map();
    adminsRaw.forEach(st => {
      if (!st || typeof st !== 'object') return;
      const listaGrupos = Array.isArray(st.grupos) ? st.grupos : (Array.isArray(st.lista) ? [st] : []);
      listaGrupos.forEach(g => {
        if (!g || typeof g !== 'object') return;
        const gId = String(g.id || '').trim();
        const grado = String(g.grado || '').trim();
        const seccion = String(g.seccion || '').trim();
        const alumnosPorNum = new Map();
        (Array.isArray(g.lista) ? g.lista : []).forEach((al, idx) => {
          const n = parseInt(al && al.num, 10) || (idx + 1);
          if (al && al.nombre) alumnosPorNum.set(n, String(al.nombre).trim());
        });
        const info = { grupoId: gId, grado, seccion, alumnosPorNum };
        if (gId) gruposInfo.set('G:' + gId, info);
        const gd = normGrado(grado);
        const sc = normSec(seccion).toUpperCase();
        if (gd) gruposInfo.set(gd + '|' + sc, info);
      });
    });

    const codigosMeta = new Map();
    const registrarCodigo = (rawCod, numHint, gkHint) => {
      const cod = String(rawCod || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (!/^\d{1,3}[A-Z0-9]{3,8}$/.test(cod)) return;
      const num = parseInt(numHint, 10) || parseInt((cod.match(/^\d+/) || [])[0], 10) || 0;
      if (!num) return;
      const gInfo = (gkHint && gruposInfo.get(gkHint)) || null;
      let grado = gInfo ? gInfo.grado : '';
      let seccion = gInfo ? gInfo.seccion : '';
      if (!grado && gkHint && gkHint.indexOf('|') >= 0) {
        const pts = gkHint.split('|');
        grado = pts[0] || '';
        seccion = pts[1] || '';
      }
      const nombre = (gInfo && gInfo.alumnosPorNum.get(num)) || '';
      const prev = codigosMeta.get(cod);
      codigosMeta.set(cod, {
        codigo: cod,
        num: num || (prev ? prev.num : 0),
        nombre: nombre || (prev ? prev.nombre : ''),
        grado: grado || (prev ? prev.grado : ''),
        seccion: seccion || (prev ? prev.seccion : ''),
        grupoId: (gInfo && gInfo.grupoId) || (prev ? prev.grupoId : '')
      });
    };

    codigosRaw.forEach(cMap => {
      if (!cMap || typeof cMap !== 'object') return;
      Object.keys(cMap).forEach(gk => {
        const sub = cMap[gk];
        if (!sub || typeof sub !== 'object') return;
        Object.keys(sub).forEach(numKey => registrarCodigo(sub[numKey], numKey, gk));
      });
    });

    [d, ...planesRaw].forEach(pl => {
      if (!pl || !Array.isArray(pl.analisis)) return;
      pl.analisis.forEach(a => {
        if (!a || !Array.isArray(a.students)) return;
        const gk = a.grupoId ? ('G:' + a.grupoId) : (normGrado(a.grado) + '|' + normSec(a.seccion).toUpperCase());
        a.students.forEach(s => {
          if (!s) return;
          if (typeof s.sb === 'string' && s.sb.indexOf('|') >= 0) {
            const pts = s.sb.split('|');
            if (pts[2]) registrarCodigo(pts[2], s.num, gk);
          }
          const cod = paCodigoLista(a, s);
          if (cod) registrarCodigo(cod, s.num, gk);
        });
      });
    });

    gruposInfo.forEach((info, gk) => {
      if (!info.grado) return;
      info.alumnosPorNum.forEach((nom, num) => {
        const cod = paCodigoAlumno(info.grado, info.seccion, num);
        if (cod) registrarCodigo(cod, num, gk);
      });
    });

    const listaMeta = Array.from(codigosMeta.values());
    const LOTE_CONC = 10;
    for (let i = 0; i < listaMeta.length; i += LOTE_CONC) {
      const slice = listaMeta.slice(i, i + LOTE_CONC);
      if (btn) btn.textContent = '⏳ Buscando en nube (' + Math.min(i + slice.length, listaMeta.length) + '/' + listaMeta.length + ')…';
      await Promise.all(slice.map(async meta => {
        try {
          const rPad = await fetch(url + '/rest/v1/rpc/metas_consultar_plan_padre', {
            method: 'POST',
            headers,
            body: JSON.stringify({ p_codigo: meta.codigo })
          });
          if (!rPad.ok) return;
          const rowsP = await rPad.json();
          if (!Array.isArray(rowsP)) return;
          rowsP.forEach(rp => {
            if (!rp || typeof rp !== 'object') return;
            filasNube.push({
              evento_id: rp.evento_id || '',
              codigo: rp.codigo || meta.codigo,
              num: rp.num || meta.num,
              alumno: rp.alumno || meta.nombre || ('#' + meta.num),
              grado: rp.grado || meta.grado || '',
              seccion: rp.seccion || meta.seccion || '',
              docente: rp.docente || (cred && cred.nombre) || '',
              evaluacion: rp.evaluacion || '',
              mision: rp.mision || '',
              forma: rp.forma != null ? rp.forma : '',
              tipo: rp.tipo || 'conceptual',
              parcial: rp.parcial || '',
              fecha_prueba: rp.fecha_prueba || '',
              nota: rp.nota,
              base: rp.base || 100,
              nsp: !!rp.nsp,
              categoria: rp.categoria || '',
              mensaje: rp.mensaje || '',
              fecha_analisis: rp.fecha_analisis || rp.fecha || rp.creado_en || ''
            });
          });
        } catch (_) {}
      }));
    }

    // 5. Agrupar todas las filas recuperadas de la nube por evaluación, parcial, grado y sección
    const grupos = new Map();
    filasNube.forEach(f => {
      if (!f || typeof f !== 'object' || !f.evaluacion) return;
      const k = normKey(f.evaluacion, f.parcial, f.grado, f.seccion);
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k).push(f);
    });

    grupos.forEach(rows => {
      const f0 = rows[0] || {};
      let idRec = '';
      for (const r0 of rows) {
        const m = String(r0.evento_id || '').match(/^PASB-([^-]+)-\d+$/);
        if (m && m[1]) { idRec = m[1]; break; }
      }
      const evTxt = String(f0.evaluacion || '').trim();
      const misionTxt = String(f0.mision || '').trim();
      const mObj = (typeof MISSIONS !== 'undefined' && Array.isArray(MISSIONS))
        ? (MISSIONS.find(m => m.title === misionTxt) || MISSIONS.find(m => evTxt.indexOf(m.title) === 0))
        : null;

      const grado = String((rows.find(x => x.grado) || f0).grado || '').trim();
      const seccion = String((rows.find(x => x.seccion) || f0).seccion || '').trim();
      const gInfo = gruposInfo.get(normGrado(grado) + '|' + normSec(seccion).toUpperCase()) || null;

      const porAlumno = new Map();
      rows.forEach((rFila, idx) => {
        const num = parseInt(rFila.num, 10) || parseInt((String(rFila.codigo || '').match(/^\d+/) || [])[0], 10) || (idx + 1);
        const prev = porAlumno.get(num);
        const tNuevo = String(rFila.fecha_analisis || rFila.fecha || rFila.creado_en || '');
        const tPrev  = prev ? String(prev._t || '') : '';
        if (!prev || tNuevo >= tPrev) {
          const esNsp = !!(rFila.nsp || String(rFila.categoria || '').toUpperCase() === 'NSP');
          let notaVal = 0;
          if (esNsp) {
            notaVal = 'NSP';
          } else if (rFila.nota != null && rFila.nota !== '' && !isNaN(Number(rFila.nota))) {
            const base = (typeof rFila.base === 'number' && rFila.base > 0) ? rFila.base : 100;
            notaVal = Math.round((Number(rFila.nota) / base) * 100);
          }
          const ck = paCatKey(notaVal);
          const catObj = PA_CATS.find(c => c.key === ck);
          const nomAlumno = String(rFila.alumno || '').trim() ||
            (gInfo && gInfo.alumnosPorNum.get(num)) || ('#' + num);
          porAlumno.set(num, {
            _t: tNuevo,
            num,
            nombre: nomAlumno,
            nota: notaVal,
            categoria: String(rFila.categoria || '').trim() || (ck === 'nsp' ? 'NSP' : (catObj ? catObj.label : '')),
            sugerencia: (ck && ck !== 'nsp') ? PA_SUGS[ck] : (ck === 'nsp' ? 'Programar prueba pendiente.' : ''),
            msg: String(rFila.mensaje || ''),
            msgEdit: false,
            env: 0
          });
        }
      });

      let forma = String((rows.find(x => x.forma) || f0).forma || '').trim();
      if (!forma) {
        const mF = evTxt.match(/Forma\s+([A-Za-z0-9]+)/i);
        if (mF) forma = mF[1];
      }
      let tipoEval = String((rows.find(x => x.tipo) || f0).tipo || '').trim();
      if (!tipoEval) {
        tipoEval = /operativa/i.test(evTxt) ? 'operativa' : 'conceptual';
      }

      const fechas = rows.map(x => String(x.fecha_analisis || x.fecha || x.creado_en || '')).filter(Boolean).sort();
      const fechaPrueba = String((rows.find(x => x.fecha_prueba) || f0).fecha_prueba || '').slice(0, 10);

      const aNuevo = {
        id: idRec,
        t: fechas[fechas.length - 1] || new Date().toISOString(),
        grado,
        seccion,
        grupoId: paGrupoIdDe(grado, seccion) || (gInfo ? gInfo.grupoId : ''),
        docente: String((rows.find(x => x.docente) || f0).docente || (cred && cred.nombre) || '').trim(),
        materia: mObj ? (mObj.subject || '') : '',
        misionId: mObj ? mObj.id : null,
        evaluacion: evTxt || 'Evaluación',
        forma,
        tipoEval,
        parcial: String((rows.find(x => x.parcial) || f0).parcial || '').trim(),
        fechaPrueba,
        students: Array.from(porAlumno.values())
          .sort((x, y) => x.num - y.num)
          .map(({ _t, ...st }) => st)
      };

      integrarAnalisisObj(aNuevo);
    });

    if (agregados > 0 || completados > 0) {
      d.analisis.sort((x, y) => String(x.t || '').localeCompare(String(y.t || '')));
      if (d.analisis.length > 400) d.analisis = d.analisis.slice(-400);
      paSaveData(d);
      paRenderHistorial();
      const msgPartes = [];
      if (agregados > 0) msgPartes.push(agregados + ' análisis recuperado(s)');
      if (completados > 0) msgPartes.push(completados + ' análisis completado(s)');
      toast('✅ ' + msgPartes.join(' y ') + ' desde la nube.');
    } else {
      toast('ℹ️ Todos los análisis encontrados en la nube (' + grupos.size + ') ya están en este dispositivo.');
    }
  } catch (_) {
    toast('⚠️ Error al intentar recuperar análisis de la nube.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = txtOrig || '📥 Recuperar análisis de la nube'; }
  }
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
  paPoblarMaterias();
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

/* Las materias del selector se CUENTAN del banco de misiones, no se escriben.
   Estaban escritas a mano en index.html y pasó lo que tenía que pasar: Inglés
   entró al catálogo, al filtro del historial y al Campeonísimo, pero aquí no,
   y el maestro que aplicó «Hello! Saludos y Presentarme» no podía analizar su
   evaluación —ni siquiera escribiendo el nombre a mano, porque sin materia el
   listado de evaluaciones no le ofrecía la misión ni su Forma—. Ahora la
   materia nueva aparece sola el día que entra su primera misión.

   El orden es el de PA_HIST_MATERIAS (el mismo de los chips del historial, para
   que el maestro busque en el mismo sitio de siempre); una materia del catálogo
   que aún no esté en esa tabla se muestra igual, al final, antes que esconderla. */
function paPoblarMaterias() {
  const sel = document.getElementById('pa-materia');
  if (!sel || typeof MISSIONS === 'undefined') return;
  const claves = PA_HIST_MATERIAS
    .map(x => x.key)
    .filter(k => MISSIONS.some(m => m.subject === k));
  MISSIONS.forEach(m => {
    if (m.subject && claves.indexOf(m.subject) < 0) claves.push(m.subject);
  });

  const actual = sel.value;
  sel.innerHTML = '<option value="">Primero elige la materia</option>';
  claves.forEach(k => {
    const x = PA_HIST_MATERIAS.find(y => y.key === k);
    const op = document.createElement('option');
    op.value = k;
    op.textContent = x ? (x.emoji + ' ' + x.nom) : (k.charAt(0).toUpperCase() + k.slice(1));
    sel.appendChild(op);
  });
  if (actual && [...sel.options].some(o => o.value === actual)) sel.value = actual;
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
  const lote = filas.slice(0, 200);
  try {
    const { url, key } = paSbCfg();
    const r = await fetch(url + '/rest/v1/rpc/metas_guardar_plan', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_prof: paCred.prof, p_clave: paCred.clave, filas: lote }),
    });
    if (!r.ok) {
      const httpErr = new Error('HTTP ' + r.status);
      httpErr.status = r.status;
      throw httpErr;
    }
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
  } catch (err) {
    const m = err && err.message ? String(err.message).match(/HTTP\s+(\d+)/) : null;
    const status = (err && typeof err.status === 'number') ? err.status : (m ? parseInt(m[1], 10) : 0);
    if (status >= 400 && status <= 499) {
      try {
        const prev = JSON.parse(localStorage.getItem('METAS_SB_ERRORES') || '[]');
        const errores = Array.isArray(prev) ? prev : [];
        lote.forEach(f => { if (f && f.evento_id) errores.push(f.evento_id); });
        localStorage.setItem('METAS_SB_ERRORES', JSON.stringify(errores));
      } catch (_) {}
      const descartados = new Set(lote.map(f => f.evento_id));
      d.analisis.forEach(a => (a.students || []).forEach(s => {
        const codigo = paCodigoLista(a, s);
        if (descartados.has('PASB-' + a.id + '-' + s.num)) s.sb = paSbFirma(a, s, codigo);
      }));
      paSaveData(d);
      if (filas.length > lote.length) paNubeProgramar();
    }
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

  /* ── Traer las notas de la nube ─────────────────────────────────────
     El circuito estaba cortado justo en el último paso: la aplicación
     califica al alumno, la nota sube a la nube… y el maestro corregía los 43
     exámenes otra vez y las tecleaba a mano. Esto es lo que convierte la
     plataforma en algo que le ahorra trabajo, y es lo primero que pregunta
     quien la va a comprar.

     No hace falta nada nuevo del servidor: la consulta ya existe y es la que
     usa Estadísticas (`estNubeRefrescar` / `estNubeCache`).

     Tres reglas, y ninguna es de adorno:

     1. **No se pisa lo escrito a mano.** El maestro pudo corregir a mano el
        examen en papel de un alumno que no tiene teléfono. Lo que ya tiene
        nota se deja como está y se dice cuántos se respetaron.
     2. **Se trae la nota de ESA misión, ESA forma y ESE tipo.** Mezclar la
        conceptual con la operativa —o dos formas distintas— sería meter en la
        boleta una nota de otra prueba.
     3. **Se dice de dónde salió cada nota y cuál se ignoró por venir con la
        pauta abierta.** Una nota copiada de la clave no puede entrar en la
        boleta sin avisar; es la misma regla que ya se aplicó en Rutas. */
  document.getElementById('pa-nube-btn')?.addEventListener('click', async () => {
    const msg = (t, color) => {
      const el = document.getElementById('pa-nube-msg');
      if (el) { el.innerHTML = t; el.style.color = color || ''; }
    };
    const id = parseInt(document.getElementById('pa-mision')?.value, 10) || null;
    if (!id || typeof MISSIONS === 'undefined') {
      return msg('Primero elige la <strong>misión</strong> de arriba: la nota que se trae es la de esa misión, no la de cualquiera.', '#b45309');
    }
    const m = MISSIONS.find(x => x.id === id);
    if (!m) return msg('No encuentro esa misión en el catálogo.', '#b45309');
    const carpeta = (function () {
      const seg = String(m.url || '').split('/')[1] || '';
      try { return decodeURIComponent(seg).toLowerCase(); } catch (_) { return seg.toLowerCase(); }
    })();
    const forma = document.getElementById('pa-forma')?.value || '';
    const tipo  = document.getElementById('pa-tipo')?.value || 'conceptual';
    const tipoNube = tipo === 'operativa' ? 'prueba_operativa' : 'evaluacion';

    msg('⏳ Trayendo…');
    if (typeof estNubeRefrescar === 'function' && navigator.onLine !== false) {
      try { await estNubeRefrescar(); } catch (_) {}
    }
    const cache = (typeof estNubeCache === 'function') ? estNubeCache() : null;
    if (!cache) {
      return msg('No hay nada traído de la nube todavía. Entra una vez con internet desde 📈 Estadísticas y vuelve; después funciona sin señal.', '#b45309');
    }

    /* La pauta abierta antes, misma misión y mismo día: la misma regla que
       usan el ⚠️ del registro y Rutas. Si las tres se separaran, el maestro
       vería el aviso en un sitio y la nota limpia en otro. */
    const dia = t => String(t || '').slice(0, 10);
    const pautas = (cache.resultados || []).filter(r => r.tipo === 'pauta_vista' &&
      String(r.mision || '').toLowerCase() === carpeta);
    const conPauta = r => {
      const t = r.fecha || r.creado_en || '';
      return pautas.some(p => (p.dispositivo || '') === (r.dispositivo || '') &&
        (p.fecha || p.creado_en || '') < t && dia(p.fecha || p.creado_en) === dia(t));
    };

    const porNum = {};
    let ignoradasPauta = 0;
    (cache.resultados || []).forEach(r => {
      if (String(r.mision || '').toLowerCase() !== carpeta) return;
      if (r.tipo !== tipoNube || typeof r.nota !== 'number') return;
      if (forma && String(r.forma || '') !== String(forma)) return;
      if (conPauta(r)) { ignoradasPauta++; return; }
      const n = String(r.codigo_lista || '').match(/^\d+/);
      if (!n) return;
      const base = (typeof r.base === 'number' && r.base > 0) ? r.base : 100;
      const pct = Math.round((r.nota / base) * 100);
      const t = r.fecha || r.creado_en || '';
      const ya = porNum[n[0]];
      /* La ÚLTIMA, no la mejor: es la que el maestro pondría en la boleta si
         hubiera corregido él, y «la mejor de varios intentos» ya se sabe que
         premia repetir. */
      if (!ya || t > ya.t) porNum[n[0]] = { nota: pct, t: t, alumno: r.alumno || '' };
    });

    let puestas = 0, respetadas = 0, sinDato = 0;
    document.querySelectorAll('.pa-student-row').forEach(row => {
      const num = String(parseInt(row.querySelector('.pa-inp-num').value, 10) || '');
      const cel = row.querySelector('.pa-inp-grade-cell');
      if (!num || !cel) return;
      const dato = porNum[num];
      if (!dato) { sinDato++; return; }
      if (String(cel.value).trim() !== '') { respetadas++; return; }
      cel.value = String(dato.nota);
      /* Con una clase y no con un estilo en línea: así se ve de dónde salió
         cada nota de un vistazo, y el maestro puede cambiarla encima sin que
         se le quede el color mintiéndole. */
      cel.classList.add('pa-de-nube');
      cel.title = 'Traída de la nube · ' + (dato.alumno || 'sin nombre') + ' · ' + dia(dato.t);
      cel.addEventListener('input', function quitar() {
        cel.classList.remove('pa-de-nube');
        cel.title = '';
        cel.removeEventListener('input', quitar);
      });
      puestas++;
    });

    if (!puestas && !respetadas) {
      return msg('No hay notas en la nube de <strong>' + paEsc(m.title) + '</strong>' +
        (forma ? ' (forma ' + paEsc(forma) + ')' : '') + ' para estos números de lista.' +
        (ignoradasPauta ? ' Se ignoraron ' + ignoradasPauta + ' por haberse calificado con la pauta abierta.' : ''), '#b45309');
    }
    msg('✅ <strong>' + puestas + '</strong> nota' + (puestas === 1 ? '' : 's') + ' traída' + (puestas === 1 ? '' : 's') +
        ' de la nube (en azul) · <strong>la última</strong> de cada alumno, no la mejor.' +
        (respetadas ? ' Se respetaron <strong>' + respetadas + '</strong> que ya tenías escritas.' : '') +
        (sinDato ? ' <strong>' + sinDato + '</strong> sin práctica en la nube: esas se escriben a mano.' : '') +
        (ignoradasPauta ? ' Se ignoraron <strong>' + ignoradasPauta + '</strong> por haberse calificado con la pauta abierta.' : ''),
        '#0f766e');
  });

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
