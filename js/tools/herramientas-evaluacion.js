/* ════════════════════════════════════════════════════════════════════
   📏 HERRAMIENTAS DE EVALUACIÓN (Zona Docente)
   ────────────────────────────────────────────────────────────────────
   La hoja con que el maestro califica una actividad, con los nombres de
   su grupo ya puestos y las casillas en blanco para la nota a mano.

   Nació de un caso de verdad: «mañana evalúo el Himno en 6º-1, cinco
   actividades, cada una vale 100 % y la final es el promedio; quiero la
   hoja con mis alumnos para poner la nota a mano». Hasta hoy eso era
   copiar cuarenta y tres nombres en una hoja de cuaderno.

   · Los nombres salen de Mi aula (METAS_ADMIN_V1), sin copiarlos: esta
     herramienta SOLO LEE esa llave. Los alumnos de prueba 🧪 y los que se
     fueron no salen (SaceLista.alumnosQueCuentan, la misma regla de los
     cuadros del SACE).
   · Las hojas que el maestro guarda van en su propia llave,
     METAS_INSTRUMENTOS_V1: son sus formatos, no notas de nadie, y meterlos
     en el aula los mandaría a la sincronización sin necesidad.
   · Las plantillas son datos: js/data/instrumentos-evaluacion.js.
   ════════════════════════════════════════════════════════════════════ */

const HE_KEY = 'METAS_INSTRUMENTOS_V1';
/* Más de ocho columnas no caben en carta con el nombre legible. */
const HE_MAX_CRIT = 8;
const HE_TIPOS = {
  actividades: { et: 'Nota por actividad', item: 'actividad' },
  rubrica:     { et: 'Rúbrica de 4 a 1',  item: 'criterio' },
  cotejo:      { et: 'Lista de cotejo (sí o no)', item: 'criterio' }
};

let _he = null;   /* la hoja que se está armando, o null en el menú */

function heEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function heAviso(m) { if (typeof toast === 'function') toast(m); }

function heGuardadas() {
  try {
    const x = JSON.parse(localStorage.getItem(HE_KEY));
    return (x && Array.isArray(x.lista)) ? x.lista : [];
  } catch (_) { return []; }
}
function heGuardarLista(lista) {
  try { localStorage.setItem(HE_KEY, JSON.stringify({ v: 1, lista })); return true; }
  catch (_) { return false; }
}

/* ── El grupo y sus alumnos, leídos de Mi aula ── */
function heGrupos() {
  try { return (typeof adState === 'function') ? (adState().grupos || []) : []; }
  catch (_) { return []; }
}
function heGrupoActivo() {
  try { return (typeof adState === 'function') ? adState().activo : null; } catch (_) { return null; }
}
function heGrupo(gid) {
  const gs = heGrupos();
  return gs.find(g => g.id === gid) || null;
}
function heGrupoNombre(g) {
  if (!g) return '';
  return (typeof adGradoSeccion === 'function')
    ? adGradoSeccion(g.grado, g.seccion) : [g.grado, g.seccion].filter(Boolean).join('-');
}
function heAlumnos(g) {
  if (!g) return [];
  let l;
  if (window.SaceLista && SaceLista.alumnosQueCuentan) l = SaceLista.alumnosQueCuentan(g);
  else l = (g.lista || []).filter(a => !a.prueba);
  return l.slice().sort((a, b) => (+a.num || 0) - (+b.num || 0));
}

/* ── Armar una hoja nueva desde una plantilla o una guardada ── */
function heDesde(p) {
  return {
    id: p.id || ('I' + Date.now().toString(36)),
    base: p.base || p.clave || 'blanco',
    icono: p.icono || '📏',
    tipo: p.tipo || 'actividades',
    calculo: p.calculo || 'promedio',
    titulo: p.titulo || '',
    materia: p.materia || '',
    fecha: p.fecha || '',
    gid: (p.gid && heGrupo(p.gid)) ? p.gid : heGrupoActivo(),
    criterios: (p.criterios || []).map(c => ({
      t: c.t || '',
      pts: (+c.pts > 0) ? +c.pts : 10,
      d: Array.isArray(c.d) ? c.d.slice(0, 4).concat(['', '', '', '']).slice(0, 4) : ['', '', '', '']
    }))
  };
}

function heRender() {
  const body = document.getElementById('he-body');
  if (!body) return;
  if (_he) { heRenderEditor(body); return; }

  const guardadas = heGuardadas();
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📏 ¿Qué vas a evaluar?</div>
      <p class="pa-optional-hint">Elige una plantilla, cámbiala a tu gusto y sácala <strong>con los nombres
        de tu grupo</strong> y las casillas en blanco para poner la nota a mano. Los nombres salen de
        <strong>Mi aula → 👥 Alumnos</strong>.</p>
      <div class="he-plantillas">
        ${HE_PLANTILLAS.map((p, i) => `
          <button class="he-plant" data-plant="${i}">
            <span class="he-plant-ico" aria-hidden="true">${p.icono}</span>
            <span class="he-plant-txt"><strong>${heEsc(p.nombre)}</strong>
              <small>${heEsc(HE_TIPOS[p.tipo].et)} · ${p.criterios.length} ${heEsc(HE_TIPOS[p.tipo].item)}${p.criterios.length === 1 ? '' : (p.tipo === 'actividades' ? 'es' : 's')}</small></span>
          </button>`).join('')}
      </div>
    </div>
    ${guardadas.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🗂️ Mis hojas guardadas</div>
      ${guardadas.slice().reverse().map(h => {
        const g = heGrupo(h.gid);
        return `
        <div class="he-guard">
          <button class="he-guard-abrir" data-abrir="${heEsc(h.id)}">
            <strong>${heEsc(h.icono || '📏')} ${heEsc(h.titulo || 'Sin título')}</strong>
            <small>${heEsc([g ? heGrupoNombre(g) : '', h.materia, HE_TIPOS[h.tipo] ? HE_TIPOS[h.tipo].et : ''].filter(Boolean).join(' · '))}</small>
          </button>
          <button class="he-ico-btn" data-borrar="${heEsc(h.id)}" aria-label="Borrar esta hoja guardada">🗑️</button>
        </div>`;
      }).join('')}
    </div>` : ''}`;

  body.querySelectorAll('[data-plant]').forEach(b => b.addEventListener('click', () => {
    _he = heDesde(HE_PLANTILLAS[+b.dataset.plant]);
    heRender();
    heArriba();
  }));
  body.querySelectorAll('[data-abrir]').forEach(b => b.addEventListener('click', () => {
    const h = heGuardadas().find(x => x.id === b.dataset.abrir);
    if (h) { _he = heDesde(h); heRender(); heArriba(); }
  }));
  body.querySelectorAll('[data-borrar]').forEach(b => b.addEventListener('click', async () => {
    const lista = heGuardadas();
    const h = lista.find(x => x.id === b.dataset.borrar);
    if (!h) return;
    const msg = '¿Borrar la hoja guardada «' + (h.titulo || 'Sin título') + '»? Solo se borra el formato; ninguna nota de tus alumnos.';
    const ok = (typeof metasConfirm === 'function') ? await metasConfirm(msg) : window.confirm(msg);
    if (!ok) return;
    heGuardarLista(lista.filter(x => x.id !== h.id));
    heRender();
  }));
}

function heArriba() {
  const s = document.querySelector('#view-herr-eval .view-scroll');
  if (s) s.scrollTop = 0;
}

/* Lo que dice la hoja impresa sobre cómo se califica: el mismo texto en
   la pantalla y en el papel, para que el maestro vea antes lo que sale. */
function heComoSeCalifica(h) {
  const n = h.criterios.length;
  if (h.tipo === 'rubrica') return 'Cada criterio se califica de 4 a 1. Total sobre ' + (n * 4) + ' puntos.';
  if (h.tipo === 'cotejo') return 'Marca ✓ si lo logra y ✗ si todavía no. Al final, cuántos logró de ' + n + '.';
  if (h.calculo === 'suma') return 'Cada actividad vale los puntos que dice. Total sobre ' + heSumaPts(h) + ' puntos.';
  return n === 1 ? 'La actividad vale 100 %.'
    : 'Cada actividad vale 100 %. La nota final es el promedio de las ' + n + ' actividades.';
}
function heSumaPts(h) { return h.criterios.reduce((s, c) => s + (+c.pts || 0), 0); }

function heRenderEditor(body) {
  const h = _he;
  const grupos = heGrupos();
  const g = heGrupo(h.gid);
  const al = heAlumnos(g);
  const item = HE_TIPOS[h.tipo].item;

  body.innerHTML = `
    <div class="pa-card">
      <button class="he-volver" id="he-menu">← Otras plantillas</button>
      <div class="pa-card-title">${heEsc(h.icono)} Datos de la hoja</div>
      <div class="he-campo"><label for="he-titulo">Título</label>
        <input id="he-titulo" class="pa-inp-field" value="${heEsc(h.titulo)}" maxlength="90"></div>
      <div class="he-fila2">
        <div class="he-campo"><label for="he-materia">Asignatura</label>
          <input id="he-materia" class="pa-inp-field" value="${heEsc(h.materia)}" maxlength="50" placeholder="ej.: Ciencias Sociales"></div>
        <div class="he-campo"><label for="he-fecha">Fecha</label>
          <input id="he-fecha" type="date" class="pa-inp-field" value="${heEsc(h.fecha)}"></div>
      </div>
      <p class="he-nota">Sin fecha, sale una raya para escribirla a mano.</p>

      <div class="he-sub">Grupo</div>
      ${grupos.length ? `
      <div class="he-chips" role="group" aria-label="Grupo">
        ${grupos.map(x => `<button class="he-chip ${x.id === h.gid ? 'he-chip-on' : ''}" data-gid="${heEsc(x.id)}" aria-pressed="${x.id === h.gid}">
          ${x.id === h.gid ? '✓ ' : ''}${heEsc(heGrupoNombre(x) || 'Grupo sin nombre')}</button>`).join('')}
      </div>
      <p class="he-nota">${al.length
        ? '<strong>' + al.length + ' alumnos</strong> en la hoja, por número de lista. Los de prueba 🧪 y los que se fueron no salen.'
        : 'Este grupo todavía no tiene alumnos: la hoja sale con las filas en blanco.'}</p>`
      : `<p class="he-nota">Todavía no tienes tu lista en Mi aula: la hoja sale con las filas en blanco para escribir los nombres.</p>`}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🧮 Cómo se califica</div>
      <div class="he-chips" role="group" aria-label="Tipo de hoja">
        ${Object.keys(HE_TIPOS).map(t => `<button class="he-chip ${t === h.tipo ? 'he-chip-on' : ''}" data-tipo="${t}" aria-pressed="${t === h.tipo}">
          ${t === h.tipo ? '✓ ' : ''}${heEsc(HE_TIPOS[t].et)}</button>`).join('')}
      </div>
      ${h.tipo === 'actividades' ? `
      <div class="he-chips" role="group" aria-label="Nota final">
        <button class="he-chip ${h.calculo === 'promedio' ? 'he-chip-on' : ''}" data-calc="promedio" aria-pressed="${h.calculo === 'promedio'}">${h.calculo === 'promedio' ? '✓ ' : ''}Promedio (cada una vale 100 %)</button>
        <button class="he-chip ${h.calculo === 'suma' ? 'he-chip-on' : ''}" data-calc="suma" aria-pressed="${h.calculo === 'suma'}">${h.calculo === 'suma' ? '✓ ' : ''}Suma de puntos</button>
      </div>` : ''}
      <p class="he-como" id="he-como">${heEsc(heComoSeCalifica(h))}</p>
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📌 ${h.tipo === 'actividades' ? 'Actividades' : 'Criterios'}</div>
      ${h.criterios.map((c, i) => `
        <div class="he-crit">
          <span class="he-crit-n" aria-hidden="true">${i + 1}</span>
          <div class="he-crit-main">
            <textarea class="pa-inp-field he-crit-t" data-i="${i}" rows="2" maxlength="140"
              aria-label="${heEsc(item)} ${i + 1}">${heEsc(c.t)}</textarea>
            ${h.tipo === 'actividades' && h.calculo === 'suma' ? `
            <label class="he-pts">Vale <input type="number" min="1" max="100" inputmode="numeric"
              class="pa-inp-field" data-pts="${i}" value="${+c.pts || 10}"> puntos</label>` : ''}
            ${h.tipo === 'rubrica' ? `
            <details class="he-desc">
              <summary>Qué se ve en cada nivel</summary>
              ${HE_NIVELES.map((n, k) => `
                <label class="he-desc-n">${n.pts} · ${heEsc(n.nombre)}
                  <input class="pa-inp-field" data-desc="${i}" data-k="${k}" maxlength="90" value="${heEsc(c.d[k])}"
                    placeholder="Déjalo vacío para escribirlo a mano"></label>`).join('')}
            </details>` : ''}
          </div>
          <button class="he-ico-btn" data-quitar="${i}" aria-label="Quitar ${heEsc(item)} ${i + 1}"
            ${h.criterios.length <= 1 ? 'disabled' : ''}>🗑️</button>
        </div>`).join('')}
      ${h.criterios.length < HE_MAX_CRIT
        ? `<button class="ad-btn-sec pa-generate-btn he-agregar" id="he-agregar">＋ Agregar ${heEsc(item)}</button>`
        : `<p class="he-nota">Caben hasta ${HE_MAX_CRIT} en la hoja carta con los nombres legibles.</p>`}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">🖨️ Sacar la hoja</div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="he-imp-lista">🖨️ Hoja con mi lista</button>
        ${h.tipo === 'rubrica' ? `<button class="pa-generate-btn ad-btn-sec" id="he-imp-rub">📄 Una rúbrica por alumno</button>` : ''}
        <button class="pa-generate-btn ad-btn-sec" id="he-guardar">💾 Guardar para otra vez</button>
      </div>
      <p class="he-nota">Sale en hoja carta, lista para fotocopiar o guardar en PDF.</p>
      ${grupos.length && typeof acCrearDesdeHoja === 'function' ? `
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="he-a-acum">📝 Ya califiqué: pasar las notas a Mi aula</button>
      </div>
      <p class="he-nota">Abre <strong>Mi aula → 📝 Acumulativos</strong> con estas mismas actividades, para escribir
        las notas de cada alumno y que la nota final salga sola.</p>` : ''}
    </div>`;

  /* Lo que se escribe se guarda en _he sin repintar: repintar a cada
     letra cerraría el teclado del teléfono. */
  const val = id => document.getElementById(id);
  val('he-titulo').addEventListener('input', e => { h.titulo = e.target.value; });
  val('he-materia').addEventListener('input', e => { h.materia = e.target.value; });
  val('he-fecha').addEventListener('change', e => { h.fecha = e.target.value; });
  body.querySelectorAll('.he-crit-t').forEach(t => t.addEventListener('input', e => {
    h.criterios[+e.target.dataset.i].t = e.target.value;
  }));
  body.querySelectorAll('[data-pts]').forEach(t => t.addEventListener('input', e => {
    h.criterios[+e.target.dataset.pts].pts = Math.max(0, +e.target.value || 0);
    const como = val('he-como'); if (como) como.textContent = heComoSeCalifica(h);
  }));
  body.querySelectorAll('[data-desc]').forEach(t => t.addEventListener('input', e => {
    h.criterios[+e.target.dataset.desc].d[+e.target.dataset.k] = e.target.value;
  }));
  body.querySelectorAll('[data-gid]').forEach(b => b.addEventListener('click', () => { h.gid = b.dataset.gid; heRender(); }));
  body.querySelectorAll('[data-tipo]').forEach(b => b.addEventListener('click', () => { h.tipo = b.dataset.tipo; heRender(); }));
  body.querySelectorAll('[data-calc]').forEach(b => b.addEventListener('click', () => { h.calculo = b.dataset.calc; heRender(); }));
  body.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => {
    if (h.criterios.length <= 1) return;
    h.criterios.splice(+b.dataset.quitar, 1); heRender();
  }));
  const ag = val('he-agregar');
  if (ag) ag.addEventListener('click', () => {
    h.criterios.push({ t: '', pts: 10, d: ['', '', '', ''] });
    heRender();
    const ts = document.querySelectorAll('.he-crit-t');
    if (ts.length) ts[ts.length - 1].focus();
  });
  val('he-menu').addEventListener('click', () => { _he = null; heRender(); heArriba(); });
  val('he-imp-lista').addEventListener('click', () => heImprimirLista(h));
  const rb = val('he-imp-rub'); if (rb) rb.addEventListener('click', () => heImprimirRubricas(h));
  const pa = val('he-a-acum'); if (pa) pa.addEventListener('click', () => acCrearDesdeHoja(h, h.gid));
  val('he-guardar').addEventListener('click', () => {
    const lista = heGuardadas();
    const copia = JSON.parse(JSON.stringify(h));
    copia.guardada = Date.now();
    const i = lista.findIndex(x => x.id === h.id);
    if (i >= 0) lista[i] = copia; else lista.push(copia);
    heAviso(heGuardarLista(lista) ? '💾 Guardada en este teléfono' : 'No se pudo guardar: el teléfono no tiene espacio');
  });
}

/* ── La hoja impresa ── */
function heFechaLarga(iso) {
  if (!iso) return '';
  const p = String(iso).split('-').map(Number);
  if (p.length !== 3 || !p[0]) return '';
  const d = new Date(p[0], p[1] - 1, p[2]);
  try {
    return d.toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch (_) { return iso; }
}
function heDocente(g) {
  if (g && g.boleta && g.boleta.docente) return g.boleta.docente;
  try { const d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); return (d && d.nombre) || ''; } catch (_) { return ''; }
}
function heFinalTitulo(h) {
  if (h.tipo === 'rubrica') return 'Total<i>sobre ' + (h.criterios.length * 4) + '</i>';
  if (h.tipo === 'cotejo') return 'Logrados<i>de ' + h.criterios.length + '</i>';
  if (h.calculo === 'suma') return 'Total<i>sobre ' + heSumaPts(h) + '</i>';
  return 'Nota final<i>promedio</i>';
}
function heValorCol(h, c) {
  if (h.tipo === 'rubrica') return '4 a 1';
  if (h.tipo === 'cotejo') return '✓ o ✗';
  if (h.calculo === 'suma') return (+c.pts || 0) + ' pts';
  return '100 %';
}

/* El encabezado de cada hoja: si la hoja 2 se separa de la 1, sola tiene
   que decir de qué grupo y de qué evaluación es. */
function heEncabezado(h, g, extra) {
  const gn = heGrupoNombre(g);
  const fecha = heFechaLarga(h.fecha);
  const doc = heDocente(g);
  return `
    <div class="enc">
      ${g && g.escuela ? `<div class="esc">${heEsc(g.escuela)}</div>` : ''}
      <div class="t">${heEsc(h.titulo || 'Evaluación')}</div>
      <div class="s">
        <span>Grupo: <b>${gn ? heEsc(gn) : '<span class="raya r16"></span>'}</b></span>
        ${h.materia ? `<span>Asignatura: <b>${heEsc(h.materia)}</b></span>` : ''}
        <span>Fecha: ${fecha ? '<b>' + heEsc(fecha) + '</b>' : '<span class="raya r30"></span>'}</span>
        ${doc ? `<span>Docente: <b>${heEsc(doc)}</b></span>` : ''}
        ${extra ? `<span>${extra}</span>` : ''}
      </div>
      <div class="s como">${heEsc(heComoSeCalifica(h))}</div>
    </div>`;
}

/* `llenar` es opcional: con él la hoja sale con las notas ya escritas
   (📝 Acumulativos de Mi aula); sin él, con las casillas en blanco. */
function heTabla(h, filas, llenar) {
  const n = h.criterios.length;
  /* anchos en mm sobre los 196 de la carta con márgenes de 10: el nombre
     se queda con lo suyo y las casillas se reparten lo que sobra */
  const wNum = 8, wFin = 20;
  const wNom = n <= 3 ? 80 : n <= 5 ? 62 : 52;
  const wCol = Math.floor((196 - wNum - wFin - wNom) / n);
  return `
    <table>
      <colgroup><col style="width:${wNum}mm"><col style="width:${wNom}mm">
        ${h.criterios.map(() => `<col style="width:${wCol}mm">`).join('')}<col style="width:${wFin}mm"></colgroup>
      <thead><tr>
        <th class="c">Nº</th><th>Alumno</th>
        ${h.criterios.map((c, i) => `<th class="cr"><b>${i + 1}.</b> ${heEsc(c.t || '')}<i>${heEsc(heValorCol(h, c))}</i></th>`).join('')}
        <th class="c fin">${heFinalTitulo(h)}</th>
      </tr></thead>
      <tbody>
        ${filas.map(a => `<tr><td class="c">${heEsc(a.num || '')}</td><td class="nom">${heEsc(a.nombre || '')}</td>
          ${h.criterios.map((c, i) => '<td class="v">' + (llenar ? heEsc(llenar.celda(a, i)) : '') + '</td>').join('')}<td class="fin v">${llenar ? heEsc(llenar.fin(a)) : ''}</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function heImprimirLista(h, llenar) {
  const g = heGrupo(h.gid);
  let al = heAlumnos(g).map(a => ({ num: a.num, nombre: a.nombre }));
  /* sin lista, filas en blanco: la hoja sirve igual, se escriben a mano */
  if (!al.length) al = Array.from({ length: 35 }, () => ({ num: '', nombre: '' }));

  const pie = `<div class="pie"><span>Firma del docente <span class="raya r50"></span></span>
    <span class="hecho">Hecha con M.E.T.A.S · metas.policastsapien.com</span></div>`;
  /* Una lista sale en una hoja o en dos; las dos formas se arman de una
     vez y el botón solo cambia cuál se ve. */
  const vista = (lista, aviso) => {
    const mitad = Math.ceil(lista.length / 2);
    const partes = [lista.slice(0, mitad), lista.slice(mitad)];
    const una = `<section class="hoja">${heEncabezado(h, g, aviso)}${heTabla(h, lista, llenar)}${pie}</section>`;
    const dos = partes.map((p, i) => `<section class="hoja">${heEncabezado(h, g,
      ['Hoja ' + (i + 1) + ' de 2', aviso].filter(Boolean).join(' · '))}${heTabla(h, p, llenar)}${pie}</section>`).join('');
    return `<div class="v-una">${una}</div><div class="v-dos">${dos}</div>`;
  };
  /* Con las notas puestas, la hoja suele ir de captura al grupo de
     WhatsApp de las familias: ahí sobran los renglones vacíos de quien
     todavía no tiene nada, y un renglón vacío junto a un nombre se lee
     como un cero. Por eso sale sin ellos, y un botón los devuelve para
     el papel que se archiva. */
  const filtra = !!(llenar && llenar.tiene);
  const conNota = filtra ? al.filter(a => llenar.tiene(a)) : al;
  const cuerpo = filtra
    ? `<div class="v-solo">${vista(conNota, 'Alumnos con nota: ' + conNota.length + ' de ' + al.length)}</div><div class="v-todos">${vista(al)}</div>`
    : vista(al);

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heEsc(h.titulo || 'Evaluación')}${g ? ' · ' + heEsc(heGrupoNombre(g)) : ''}</title>
<style>
@page{size:letter;margin:10mm;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
/* Una hoja carta tiene 259 mm útiles con los márgenes de 10; el tope de
   248 deja aire para la impresora que corre el papel. */
.hoja{width:196mm;max-height:248mm;overflow:hidden;margin:0 auto;}
.hoja + .hoja{break-before:page;page-break-before:always;}
@media screen{.hoja{margin:6mm auto;box-shadow:0 0 0 1px #e2e8f0;padding:0;}}
body.dos .v-una, body:not(.dos) .v-dos{display:none;}
body.todos .v-solo, body:not(.todos) .v-todos{display:none;}
.enc{border-bottom:2px solid #1e3a7c;padding-bottom:1.6mm;margin-bottom:2mm;}
.esc{font-size:8.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#334155;}
.t{font-size:14px;font-weight:900;line-height:1.2;color:#0f2350;}
.s{font-size:9px;color:#222;margin-top:.8mm;line-height:1.4;display:flex;flex-wrap:wrap;gap:1mm 5mm;}
.como{font-weight:700;color:#0f2350;}
.raya{display:inline-block;border-bottom:1px solid #333;vertical-align:bottom;height:3mm;}
.r16{width:16mm}.r30{width:38mm}.r50{width:60mm}
table{width:100%;border-collapse:collapse;table-layout:fixed;}
th{background:#eef2f9;border:1px solid #64748b;font-size:7.5px;font-weight:700;color:#0f2350;
  padding:.8mm 1mm;line-height:1.2;text-align:left;vertical-align:bottom;word-wrap:break-word;overflow-wrap:break-word;}
th.c{text-align:center;}
th i,th.fin i{display:block;font-style:normal;font-weight:900;color:#1e3a7c;margin-top:.6mm;}
th.cr i{text-align:center;}
th.fin{background:#fef3c7;}
td{border:1px solid #64748b;font-size:9px;line-height:1.15;padding:0 1mm;vertical-align:middle;
  overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
td.c{text-align:center;font-weight:700;}
td.fin{background:#fffbeb;}
td.v{text-align:center;font-weight:700;}
/* Cebra suave: con cuarenta filas el ojo salta de renglón y la nota de
   uno cae en la casilla del otro. */
tbody tr:nth-child(even) td{background:#f8fafc;}
tbody tr:nth-child(even) td.fin{background:#fef9e7;}
tr{break-inside:avoid;page-break-inside:avoid;}
.pie{display:flex;justify-content:space-between;align-items:flex-end;margin-top:4mm;font-size:8.5px;color:#333;}
.hecho{font-size:7px;color:#888;}
.noprint{max-width:196mm;margin:0 auto;padding:5mm 0 0;font-size:12.5px;line-height:1.5;color:#333;}
.noprint button{padding:10px 16px;min-height:44px;font-size:14px;font-weight:bold;cursor:pointer;margin:0 6px 6px 0;}
.noprint p{margin-top:2mm;}
@media print{.noprint{display:none;}.hoja{box-shadow:none;margin:0 auto;}}
</style></head><body>
<div class="noprint">
  <button onclick="window.print()">🖨️ Imprimir</button>
  <button id="he-modo">📄 Sacarla en dos hojas, renglón más alto</button>
  ${filtra ? `<button id="he-todos">👥 Mostrar también a los que no tienen nota</button>` : ''}
  <p id="he-modo-txt"></p>
  ${filtra ? `<p id="he-todos-txt"></p>` : ''}
</div>
${cuerpo}
<script>
/* El alto del renglón se MIDE, no se adivina: se reparte entre las filas
   todo lo que sobra hasta el tope de 248 mm, para que la nota se escriba
   en el renglón más alto posible. Con muchos alumnos el renglón queda
   bajo; entonces se ofrece la versión en dos hojas. */
(function () {
  var MM = (function () { var d = document.createElement('div'); d.style.cssText = 'position:absolute;height:100mm;visibility:hidden';
    document.body.appendChild(d); var r = d.getBoundingClientRect().height / 100; d.remove(); return r; })();
  var TOPE = 248 * MM, MAX = 11 * MM, CHICO = 5.2;
  function ajustar() {
    document.querySelectorAll('.hoja').forEach(function (hoja) {
      if (!hoja.offsetParent) return;
      var filas = hoja.querySelectorAll('tbody tr');
      if (!filas.length) return;
      filas.forEach(function (f) { f.style.height = ''; });
      hoja.style.maxHeight = 'none';
      var base = hoja.getBoundingClientRect().height;
      var nat = filas[0].getBoundingClientRect().height;
      /* la de solo-con-nota va de captura al teléfono: renglón justo, que
         la imagen no salga larguísima con diez alumnos */
      var tope = hoja.closest('.v-solo') ? 7 * MM : MAX;
      var alto = Math.min(tope, nat + (TOPE - base - 1) / filas.length);
      filas.forEach(function (f) { f.style.height = alto + 'px'; });
      hoja.style.maxHeight = '';
      hoja.dataset.mm = (alto / MM).toFixed(1);
    });
  }
  var b = document.getElementById('he-modo'), t = document.getElementById('he-modo-txt');
  function texto() {
    var dos = document.body.classList.contains('dos');
    var h = [].slice.call(document.querySelectorAll('.hoja')).filter(function (x) { return x.offsetParent; })[0];
    var mm = h ? +h.dataset.mm : 0;
    b.textContent = dos ? '📄 Volver a una sola hoja' : '📄 Sacarla en dos hojas, renglón más alto';
    t.innerHTML = (dos ? 'Sale en <strong>dos hojas</strong>, cada una con su encabezado.'
      : 'Sale en <strong>una sola hoja</strong> carta.') + ' Cada renglón mide <strong>' +
      String(mm).replace('.', ',') + ' mm</strong> de alto' +
      (!dos && mm < CHICO ? ': es bajito para escribir la nota. Si prefieres más espacio, sácala en dos hojas.' : '.');
  }
  b.addEventListener('click', function () { document.body.classList.toggle('dos'); ajustar(); texto(); });
  var bt = document.getElementById('he-todos'), tt = document.getElementById('he-todos-txt');
  function textoTodos() {
    if (!bt) return;
    var todos = document.body.classList.contains('todos');
    bt.textContent = todos ? '🙈 Ocultar a los que no tienen nota' : '👥 Mostrar también a los que no tienen nota';
    tt.innerHTML = todos ? 'Salen <strong>todos</strong> los alumnos, para archivar la hoja.'
      : 'Salen <strong>solo los alumnos con alguna nota</strong>: así la captura para WhatsApp no lleva renglones vacíos.';
  }
  if (bt) bt.addEventListener('click', function () { document.body.classList.toggle('todos'); ajustar(); texto(); textoTodos(); });
  ajustar(); texto(); textoTodos();
})();
<\/script>
</body></html>`;
  heAbrir(html);
}

/* Una rúbrica por alumno, dos por hoja: se corta a la mitad y a cada niño
   le llega la suya, con su nombre, para que vea qué le faltó. */
function heImprimirRubricas(h) {
  const g = heGrupo(h.gid);
  let al = heAlumnos(g);
  if (!al.length) al = [{ num: '', nombre: '' }, { num: '', nombre: '' }];
  const gn = heGrupoNombre(g);
  const fecha = heFechaLarga(h.fecha);
  const una = a => `
    <div class="rub">
      ${g && g.escuela ? `<div class="esc">${heEsc(g.escuela)}</div>` : ''}
      <div class="t">${heEsc(h.titulo || 'Rúbrica')}</div>
      <div class="s">
        <span>Nombre: ${a.nombre ? '<b>' + heEsc(a.nombre) + '</b>' : '<span class="raya r60"></span>'}</span>
        <span>Nº ${a.num ? '<b>' + heEsc(a.num) + '</b>' : '<span class="raya r8"></span>'}</span>
        <span>Grupo: ${gn ? '<b>' + heEsc(gn) + '</b>' : '<span class="raya r12"></span>'}</span>
        ${h.materia ? `<span>${heEsc(h.materia)}</span>` : ''}
        <span>Fecha: ${fecha ? '<b>' + heEsc(fecha) + '</b>' : '<span class="raya r30"></span>'}</span>
      </div>
      <table>
        <colgroup><col style="width:32mm">${HE_NIVELES.map(() => '<col style="width:35mm">').join('')}<col style="width:16mm"></colgroup>
        <thead><tr><th>Criterio</th>${HE_NIVELES.map(n => `<th>${n.pts} · ${heEsc(n.nombre)}</th>`).join('')}<th class="c">Puntos</th></tr></thead>
        <tbody>${h.criterios.map(c => `<tr><td class="cri">${heEsc(c.t)}</td>
          ${HE_NIVELES.map((n, k) => `<td>${heEsc(c.d[k] || '')}</td>`).join('')}<td></td></tr>`).join('')}
          <tr class="tot"><td colspan="5">Total (sobre ${h.criterios.length * 4})</td><td></td></tr></tbody>
      </table>
      <div class="ins">El docente encierra en cada fila lo que se vio.</div>
    </div>`;
  const hojas = [];
  for (let i = 0; i < al.length; i += 2) {
    hojas.push(`<section class="hoja">${una(al[i])}${al[i + 1] ? '<div class="corte">✂ corte aquí</div>' + una(al[i + 1]) : ''}</section>`);
  }
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heEsc(h.titulo || 'Rúbrica')}${gn ? ' · ' + heEsc(gn) : ''}</title>
<style>
@page{size:letter;margin:10mm;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.hoja{width:196mm;max-height:248mm;margin:0 auto;}
.hoja + .hoja{break-before:page;page-break-before:always;}
@media screen{.hoja{margin:6mm auto;box-shadow:0 0 0 1px #e2e8f0;}}
.rub{height:118mm;overflow:hidden;padding-top:1mm;}
.corte{text-align:center;font-size:8px;color:#64748b;border-top:1px dashed #94a3b8;margin:2mm 0 3mm;padding-top:.8mm;}
.esc{font-size:8px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#334155;}
.t{font-size:13px;font-weight:900;color:#0f2350;}
.s{font-size:9px;margin:1mm 0 2mm;display:flex;flex-wrap:wrap;gap:1mm 5mm;line-height:1.5;}
.raya{display:inline-block;border-bottom:1px solid #333;vertical-align:bottom;height:3mm;}
.r8{width:8mm}.r12{width:12mm}.r30{width:30mm}.r60{width:60mm}
table{width:100%;border-collapse:collapse;table-layout:fixed;}
th{background:#eef2f9;border:1px solid #64748b;font-size:8px;padding:1mm;text-align:left;color:#0f2350;}
th.c{text-align:center;}
td{border:1px solid #64748b;font-size:8.5px;line-height:1.25;padding:1mm;vertical-align:top;height:13mm;}
td.cri{font-weight:800;}
tr.tot td{height:7mm;font-weight:800;text-align:right;vertical-align:middle;background:#fef3c7;}
.ins{font-size:8px;color:#444;margin-top:1mm;}
.noprint{max-width:196mm;margin:0 auto;padding:5mm 0 0;font-size:12.5px;line-height:1.5;color:#333;}
.noprint button{padding:10px 16px;min-height:44px;font-size:14px;font-weight:bold;cursor:pointer;}
@media print{.noprint{display:none;}.hoja{box-shadow:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()">🖨️ Imprimir</button>
<p>Dos rúbricas por hoja carta: ${al.length} rúbricas en ${hojas.length} ${hojas.length === 1 ? 'hoja' : 'hojas'}.</p></div>
${hojas.join('')}
</body></html>`;
  heAbrir(html);
}

function heAbrir(html) {
  if (typeof adPrintAbrir === 'function') { adPrintAbrir(html); return; }
  const w = window.open('', '_blank');
  if (!w) { heAviso('Permite las ventanas emergentes para imprimir'); return; }
  w.document.write(html); w.document.close();
}

(function heIniciar() {
  const ir = () => {
    document.getElementById('goto-heval-btn')?.addEventListener('click', () => switchView('view-herr-eval'));
    document.getElementById('heval-back-btn')?.addEventListener('click', () => {
      /* dentro de una hoja, «atrás» vuelve al menú de plantillas */
      if (_he) { _he = null; heRender(); heArriba(); return; }
      switchView('view-perfil');
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ir); else ir();
})();
