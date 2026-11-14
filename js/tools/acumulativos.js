/* ════════════════════════════════════════════════════════════════════
   📝 ACUMULATIVOS (Mi aula, antes de 🧮 Notas SACE)
   ────────────────────────────────────────────────────────────────────
   Las notas de una actividad que el maestro calificó en papel, alumno por
   alumno, con la nota final calculada sola. Nació del Himno de 6º-1:
   cinco actividades, cada una sobre 100, la final es el promedio. Con
   cuarenta y tres alumnos son doscientas quince notas y cuarenta y tres
   promedios hechos a mano; un error de suma lo paga el niño.

   · Se guarda en el aula (d.acumulativos), no aparte: son notas de los
     alumnos y viajan entre los equipos del maestro con la misma fusión
     dato por dato que todo lo demás (js/metas-fusion-aula.js). Por eso
     cada acumulativo y cada actividad llevan `id`, y las notas van por
     número de lista: dos equipos que escriben notas distintas no se pisan.
   · Una casilla vacía es «todavía no la califiqué», nunca un cero. La
     nota final se muestra con lo que hay y avisa cuántas faltan; el
     promedio del grupo solo cuenta a los que tienen todas.
   · El redondeo es Math.round, la misma regla de Notas SACE.
   · Las formas de calificar son las de 📏 Herramientas de evaluación
     (js/tools/herramientas-evaluacion.js), y la hoja impresa es la misma,
     ahora con las notas puestas.
   ════════════════════════════════════════════════════════════════════ */

let _acAbierto = null;   /* id del acumulativo abierto, o null en la lista */
let _acNuevo = false;    /* eligiendo de dónde sale uno nuevo */

const AC_PARCIALES = ['I', 'II', 'III', 'IV'];

function acEsc(s) { return (typeof adEsc === 'function') ? adEsc(s) : String(s == null ? '' : s); }
function acId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

function acAlumnos(d) {
  const l = (window.SaceLista && SaceLista.alumnosQueCuentan) ? SaceLista.alumnosQueCuentan(d)
    : (d.lista || []).filter(a => !a.prueba);
  return l.slice().sort((a, b) => (+a.num || 0) - (+b.num || 0));
}

/* ── Las cuentas: un solo sitio, para la pantalla y para el papel ── */
function acRango(ac, c) {
  if (ac.tipo === 'rubrica') return [1, 4];
  if (ac.tipo === 'actividades' && ac.calculo === 'suma') return [0, +c.pts || 0];
  return [0, 100];
}
function acTotal(ac) {
  const n = ac.criterios.length;
  if (ac.tipo === 'rubrica') return n * 4;
  if (ac.tipo === 'cotejo') return n;
  if (ac.calculo === 'suma') return ac.criterios.reduce((s, c) => s + (+c.pts || 0), 0);
  return 100;
}
function acValor(ac, num, cid) {
  const v = ((ac.notas || {})[String(num)] || {})[cid];
  return (v === undefined || v === null || v === '') ? null : v;
}
/* { nota, falta, exacta }: nota redondeada con lo que hay; falta = cuántas
   casillas siguen vacías */
function acFinal(ac, num) {
  let suma = 0, hay = 0;
  ac.criterios.forEach(c => {
    const v = acValor(ac, num, c.id);
    if (v === null) return;
    hay++;
    if (ac.tipo === 'cotejo') suma += (v === 'si') ? 1 : 0;
    else suma += +v;
  });
  const falta = ac.criterios.length - hay;
  if (!hay) return { nota: null, falta, exacta: null };
  const exacta = (ac.tipo === 'actividades' && ac.calculo !== 'suma') ? suma / hay : suma;
  return { nota: Math.round(exacta), falta, exacta };
}
/* Bajo 70 solo tiene sentido en una nota sobre 100 */
function acSobre100(ac) { return ac.tipo === 'actividades' && ac.calculo !== 'suma'; }
function acResumen(ac, al) {
  const completos = al.map(a => acFinal(ac, a.num)).filter(f => f.nota !== null && !f.falta);
  const prom = completos.length ? Math.round(completos.reduce((s, f) => s + f.exacta, 0) / completos.length) : null;
  const bajo = acSobre100(ac) ? al.filter(a => { const f = acFinal(ac, a.num); return f.nota !== null && !f.falta && f.nota < 70; }) : [];
  return { completos: completos.length, prom, bajo };
}

/* ── Crear uno desde una hoja de 📏 Herramientas de evaluación ── */
function acDesdeHoja(h) {
  return {
    id: acId('A'),
    titulo: h.titulo || 'Actividad',
    icono: h.icono || '📝',
    materia: h.materia || '',
    parcial: (typeof _adSaceParcial !== 'undefined' && AC_PARCIALES.includes(_adSaceParcial)) ? _adSaceParcial : 'I',
    fecha: h.fecha || '',
    tipo: h.tipo || 'actividades',
    calculo: h.calculo || 'promedio',
    criterios: (h.criterios || []).map((c, i) => ({ id: 'c' + (i + 1), t: c.t || '', pts: +c.pts || 10 })),
    notas: {},
    creado: Date.now()
  };
}
/* Lo llama 📏 Herramientas de evaluación con la hoja que se imprimió:
   las notas se pasan en el grupo de esa hoja. */
function acCrearDesdeHoja(h, gid) {
  if (typeof adState !== 'function') return;
  const st = adState();
  const g = st.grupos.find(x => x.id === gid) || st.grupos.find(x => x.id === st.activo);
  if (!g) { if (typeof toast === 'function') toast('Primero arma tu lista en Mi aula'); return; }
  if (st.activo !== g.id) {
    st.activo = g.id;
    try { localStorage.setItem('METAS_ADMIN_GRUPO_ACTIVO', g.id); } catch (_) {}
    adStateSave(st);
    if (typeof _adGrupoActivoId !== 'undefined') _adGrupoActivoId = g.id;
  }
  const d = adLoad();
  const ac = acDesdeHoja(h);
  d.acumulativos = d.acumulativos || [];
  d.acumulativos.push(ac);
  adSave(d);
  _acAbierto = ac.id; _acNuevo = false;
  _adTab = 'acum';
  switchView('view-admin');
  if (typeof renderAdmin === 'function') renderAdmin(true);
}
window.acCrearDesdeHoja = acCrearDesdeHoja;

function adRenderAcum(body, d) {
  if (!d.lista.length) { adSinLista(body, 'los acumulativos'); return; }
  d.acumulativos = d.acumulativos || [];
  const ac = _acAbierto && d.acumulativos.find(x => x.id === _acAbierto);
  if (_acAbierto && !ac) _acAbierto = null;
  if (ac) { acRenderUno(body, d, ac); return; }
  if (_acNuevo) { acRenderNuevo(body, d); return; }

  const al = acAlumnos(d);
  const porParcial = AC_PARCIALES.map(p => ({ p, l: d.acumulativos.filter(x => x.parcial === p) })).filter(x => x.l.length);
  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📝 Acumulativos</div>
      <p class="pa-optional-hint">Aquí pasas las notas de una actividad que calificaste en papel:
        escribes la nota de cada alumno y <strong>la nota final sale sola</strong>. Luego la puedes
        imprimir con las notas puestas.</p>
      <button class="pa-generate-btn" id="ac-nuevo">＋ Pasar las notas de una actividad</button>
    </div>
    ${porParcial.map(x => `
    <div class="pa-card">
      <div class="pa-card-title">🗂️ ${x.p} parcial</div>
      ${x.l.slice().reverse().map(a => {
        const r = acResumen(a, al);
        return `<button class="ad-colecta-row ac-fila" data-acid="${acEsc(a.id)}">
          <span class="ad-cr-txt"><strong>${acEsc(a.icono || '📝')} ${acEsc(a.titulo)}</strong><br>
          <small>${acEsc([a.materia, r.completos + ' de ' + al.length + ' con todas sus notas',
            r.prom !== null ? 'promedio del grupo ' + r.prom + (acSobre100(a) ? '' : ' de ' + acTotal(a)) : ''].filter(Boolean).join(' · '))}</small></span>
        </button>`;
      }).join('')}
    </div>`).join('')}`;
  body.querySelector('#ac-nuevo').addEventListener('click', () => { _acNuevo = true; renderAdmin(true); });
  body.querySelectorAll('[data-acid]').forEach(b => b.addEventListener('click', () => {
    _acAbierto = b.dataset.acid; renderAdmin(true); acArriba();
  }));
}

function acArriba() {
  const s = document.querySelector('#view-admin .view-scroll');
  if (s) s.scrollTop = 0;
}

/* ¿De dónde sale? De una hoja guardada en 📏 Herramientas de evaluación
   o de una plantilla. Así lo que se imprimió y lo que se llena son la
   misma cosa, con las mismas actividades en el mismo orden. */
function acRenderNuevo(body, d) {
  const guardadas = (typeof heGuardadas === 'function') ? heGuardadas() : [];
  const plantillas = (typeof HE_PLANTILLAS !== 'undefined') ? HE_PLANTILLAS : [];
  body.innerHTML = `
    <div class="pa-card">
      <button class="he-volver" id="ac-volver">← Mis acumulativos</button>
      <div class="pa-card-title">📝 ¿De qué actividad son las notas?</div>
      ${guardadas.length ? `
      <div class="he-sub">Mis hojas guardadas</div>
      <div class="he-plantillas">
        ${guardadas.slice().reverse().map(h => `<button class="he-plant" data-guard="${acEsc(h.id)}">
          <span class="he-plant-ico" aria-hidden="true">${acEsc(h.icono || '📏')}</span>
          <span class="he-plant-txt"><strong>${acEsc(h.titulo || 'Sin título')}</strong>
          <small>${h.criterios.length} ${h.tipo === 'actividades' ? 'actividades' : 'criterios'}</small></span></button>`).join('')}
      </div>` : ''}
      <div class="he-sub" style="margin-top:12px">Plantillas</div>
      <div class="he-plantillas">
        ${plantillas.map((p, i) => `<button class="he-plant" data-plant="${i}">
          <span class="he-plant-ico" aria-hidden="true">${p.icono}</span>
          <span class="he-plant-txt"><strong>${acEsc(p.nombre)}</strong>
          <small>${p.criterios.length} ${p.tipo === 'actividades' ? 'actividades' : 'criterios'}</small></span></button>`).join('')}
      </div>
      <p class="he-nota">Para cambiar las actividades antes, ármala en <strong>📏 Herramientas de evaluación</strong>
        y guárdala: aparece aquí arriba.</p>
    </div>`;
  const crear = h => {
    const dd = adLoad();
    const ac = acDesdeHoja(h);
    dd.acumulativos = dd.acumulativos || [];
    dd.acumulativos.push(ac);
    adSave(dd);
    _acAbierto = ac.id; _acNuevo = false;
    renderAdmin(true); acArriba();
  };
  body.querySelector('#ac-volver').addEventListener('click', () => { _acNuevo = false; renderAdmin(true); });
  body.querySelectorAll('[data-guard]').forEach(b => b.addEventListener('click', () => {
    const h = guardadas.find(x => x.id === b.dataset.guard); if (h) crear(h);
  }));
  body.querySelectorAll('[data-plant]').forEach(b => b.addEventListener('click', () => {
    const p = plantillas[+b.dataset.plant];
    if (p) crear(Object.assign({}, p, { icono: p.icono }));
  }));
}

/* Lee, cambia y guarda en la copia del aula que está guardada AHORA: la
   pantalla puede llevar minutos abierta y la sincronización pudo traer
   notas de la tablet en medio. adSave fusiona lo demás. */
function acCambiar(id, fn) {
  const dd = adLoad();
  const ac = (dd.acumulativos || []).find(x => x.id === id);
  if (!ac) return null;
  fn(ac);
  adSave(dd);
  return ac;
}

function acCeldaFinal(ac, num) {
  const f = acFinal(ac, num);
  if (f.nota === null) return '<span class="ac-vacia">—</span>';
  const bajo = acSobre100(ac) && !f.falta && f.nota < 70;
  const exacta = String(Math.round(f.exacta * 10) / 10).replace('.', ',');
  return `<strong class="${bajo ? 'ac-bajo' : ''}" title="${exacta}">${f.nota}${bajo ? ' ↓' : ''}</strong>` +
    (f.falta ? ` <small class="ac-falta">faltan ${f.falta}</small>` : '');
}

function acRenderUno(body, d, ac) {
  const al = acAlumnos(d);
  const mats = (d.materias || []).slice();
  if (ac.materia && !mats.includes(ac.materia)) mats.push(ac.materia);
  const r = acResumen(ac, al);
  const cot = ac.tipo === 'cotejo';
  const como = (typeof heComoSeCalifica === 'function') ? heComoSeCalifica(ac) : '';

  body.innerHTML = `
    <div class="pa-card">
      <button class="he-volver" id="ac-volver">← Mis acumulativos</button>
      <div class="pa-card-title">${acEsc(ac.icono || '📝')} ${acEsc(ac.titulo)}</div>
      <div class="he-sub">Parcial</div>
      <div class="he-chips" role="group" aria-label="Parcial">
        ${AC_PARCIALES.map(p => `<button class="he-chip ${p === ac.parcial ? 'he-chip-on' : ''}" data-par="${p}" aria-pressed="${p === ac.parcial}">${p === ac.parcial ? '✓ ' : ''}${p}</button>`).join('')}
      </div>
      <div class="he-sub">Asignatura</div>
      <div class="he-chips" role="group" aria-label="Asignatura">
        ${mats.map(m => `<button class="he-chip ${m === ac.materia ? 'he-chip-on' : ''}" data-mat="${acEsc(m)}" aria-pressed="${m === ac.materia}">${m === ac.materia ? '✓ ' : ''}${acEsc(m)}</button>`).join('')}
      </div>
      <p class="he-como">${acEsc(como)}</p>
      <ol class="ac-leyenda">${ac.criterios.map(c => `<li>${acEsc(c.t)}${ac.tipo === 'actividades' && ac.calculo === 'suma' ? ' <small>(' + (+c.pts || 0) + ' pts)</small>' : ''}</li>`).join('')}</ol>
    </div>

    <div class="pa-card">
      <div class="ac-resumen" id="ac-resumen">${acResumenHtml(ac, al, r)}</div>
      <p class="he-nota">${cot ? 'Toca la casilla: ✓ lo logró, ✗ todavía no, y otra vez para dejarla vacía.'
        : 'Escribe la nota y pasa al siguiente con <strong>Enter</strong> o <strong>Siguiente</strong> del teclado: baja por la misma columna. Una casilla vacía es «todavía no»; nunca cuenta como cero.'}</p>
      <div class="ac-tabla-wrap">
        <table class="ac-tabla">
          <thead><tr><th class="ac-nom">Alumno</th>
            ${ac.criterios.map((c, i) => `<th title="${acEsc(c.t)}">${i + 1}</th>`).join('')}
            <th class="ac-fin">Final</th></tr></thead>
          <tbody>
            ${al.map(a => `<tr data-num="${acEsc(a.num)}">
              <td class="ac-nom"><span class="ac-n">${acEsc(a.num)}</span> ${acEsc(a.nombre || '')}</td>
              ${ac.criterios.map((c, i) => {
                const v = acValor(ac, a.num, c.id);
                if (cot) {
                  return `<td><button class="ac-cot ${v === 'si' ? 'ac-si' : v === 'no' ? 'ac-no' : ''}" data-num="${acEsc(a.num)}" data-cid="${acEsc(c.id)}"
                    aria-label="${acEsc((a.nombre || 'Nº ' + a.num) + ', criterio ' + (i + 1))}">${v === 'si' ? '✓' : v === 'no' ? '✗' : ''}</button></td>`;
                }
                const [mn, mx] = acRango(ac, c);
                return `<td><input class="ac-inp" type="text" inputmode="numeric" enterkeyhint="next" maxlength="3" autocomplete="off"
                  data-num="${acEsc(a.num)}" data-cid="${acEsc(c.id)}" data-col="${i}" data-min="${mn}" data-max="${mx}"
                  value="${v === null ? '' : acEsc(v)}" aria-label="${acEsc((a.nombre || 'Nº ' + a.num) + ', actividad ' + (i + 1))}"></td>`;
              }).join('')}
              <td class="ac-fin" data-fin="${acEsc(a.num)}">${acCeldaFinal(ac, a.num)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="pa-card">
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="ac-imprimir">🖨️ Imprimir con las notas</button>
        <button class="pa-generate-btn ad-btn-sec ad-btn-peligro" id="ac-borrar">🗑️ Borrar este acumulativo</button>
      </div>
    </div>`;

  const repintarFila = num => {
    const fresco = (adLoad().acumulativos || []).find(x => x.id === ac.id) || ac;
    const td = body.querySelector(`[data-fin="${CSS.escape(String(num))}"]`);
    if (td) td.innerHTML = acCeldaFinal(fresco, num);
    const rs = body.querySelector('#ac-resumen');
    if (rs) rs.innerHTML = acResumenHtml(fresco, al, acResumen(fresco, al));
  };

  body.querySelector('#ac-volver').addEventListener('click', () => { _acAbierto = null; renderAdmin(true); acArriba(); });
  body.querySelectorAll('[data-par]').forEach(b => b.addEventListener('click', () => {
    acCambiar(ac.id, x => { x.parcial = b.dataset.par; }); renderAdmin(true);
  }));
  body.querySelectorAll('[data-mat]').forEach(b => b.addEventListener('click', () => {
    acCambiar(ac.id, x => { x.materia = b.dataset.mat; }); renderAdmin(true);
  }));

  body.querySelectorAll('.ac-inp').forEach(inp => {
    inp.addEventListener('input', () => {
      const t = inp.value.replace(/[^\d]/g, '');
      if (t !== inp.value) inp.value = t;
      const mn = +inp.dataset.min, mx = +inp.dataset.max;
      const n = t === '' ? null : +t;
      const malo = n !== null && (n < mn || n > mx);
      inp.classList.toggle('ac-malo', malo);
      inp.title = malo ? 'Va de ' + mn + ' a ' + mx : '';
      /* fuera de rango no se guarda: una nota de 850 por un dedo de más
         movería el promedio de todo el grupo sin que nadie lo vea */
      if (malo) return;
      acCambiar(ac.id, x => {
        x.notas = x.notas || {};
        const k = String(inp.dataset.num);
        x.notas[k] = x.notas[k] || {};
        if (n === null) delete x.notas[k][inp.dataset.cid];
        else x.notas[k][inp.dataset.cid] = n;
      });
      repintarFila(inp.dataset.num);
    });
    inp.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const todos = [...body.querySelectorAll(`.ac-inp[data-col="${inp.dataset.col}"]`)];
      const i = todos.indexOf(inp);
      const sig = todos[i + 1] || body.querySelector(`.ac-inp[data-col="${+inp.dataset.col + 1}"]`);
      if (sig) { sig.focus(); sig.select(); } else inp.blur();
    });
    inp.addEventListener('focus', () => { try { inp.select(); } catch (_) {} });
  });

  body.querySelectorAll('.ac-cot').forEach(b => b.addEventListener('click', () => {
    const ciclo = { '': 'si', si: 'no', no: '' };
    let nuevo = '';
    acCambiar(ac.id, x => {
      x.notas = x.notas || {};
      const k = String(b.dataset.num);
      x.notas[k] = x.notas[k] || {};
      nuevo = ciclo[x.notas[k][b.dataset.cid] || ''];
      if (nuevo) x.notas[k][b.dataset.cid] = nuevo; else delete x.notas[k][b.dataset.cid];
    });
    b.textContent = nuevo === 'si' ? '✓' : nuevo === 'no' ? '✗' : '';
    b.classList.toggle('ac-si', nuevo === 'si');
    b.classList.toggle('ac-no', nuevo === 'no');
    repintarFila(b.dataset.num);
  }));

  body.querySelector('#ac-imprimir').addEventListener('click', () => {
    const fresco = (adLoad().acumulativos || []).find(x => x.id === ac.id) || ac;
    if (typeof heImprimirLista !== 'function') return;
    const hoja = Object.assign({}, fresco, { gid: d.id });
    heImprimirLista(hoja, {
      celda: (a, i) => {
        const v = acValor(fresco, a.num, fresco.criterios[i].id);
        return v === null ? '' : fresco.tipo === 'cotejo' ? (v === 'si' ? '✓' : '✗') : String(v);
      },
      fin: a => {
        const f = acFinal(fresco, a.num);
        return f.nota === null ? '' : String(f.nota) + (f.falta ? ' (faltan ' + f.falta + ')' : '');
      }
    });
  });

  body.querySelector('#ac-borrar').addEventListener('click', async () => {
    const msg = 'Se borran las notas de «' + ac.titulo + '» de todos los alumnos, en este equipo y en los demás donde abras Mi aula. ¿Borrarlo?';
    const ok = (typeof metasConfirm === 'function')
      ? await metasConfirm(msg, { icono: '🗑️', titulo: 'Borrar acumulativo', okTxt: 'Sí, borrar' })
      : window.confirm(msg);
    if (!ok) return;
    const dd = adLoad();
    dd.acumulativos = (dd.acumulativos || []).filter(x => x.id !== ac.id);
    adSave(dd);
    _acAbierto = null;
    renderAdmin(true);
  });
}

function acResumenHtml(ac, al, r) {
  const partes = [`<span><strong>${r.completos}</strong> de ${al.length} con todas sus notas</span>`];
  if (r.prom !== null) partes.push(`<span>Promedio del grupo: <strong>${r.prom}</strong>${acSobre100(ac) ? '' : ' de ' + acTotal(ac)}</span>`);
  if (r.bajo.length) partes.push(`<span class="ac-bajo">↓ ${r.bajo.length} bajo 70: Nº ${r.bajo.map(a => acEsc(a.num)).join(', ')}</span>`);
  return partes.join('');
}
