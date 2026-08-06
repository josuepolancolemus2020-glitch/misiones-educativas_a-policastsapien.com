/* ══════════════════════════════════════════════════════════════
   📖 CONTROL DE LECTURA — pestaña de Mi aula

   El maestro elige al alumno y un texto del grado, arranca el
   cronómetro, escucha la lectura en voz alta y TOCA la última palabra
   leída: la herramienta cuenta las palabras, saca las palabras por
   minuto y las compara con la banda del grado. Después vienen cinco
   preguntas orales de comprensión (el maestro marca ✓/✗) y el
   veredicto integrado de fluidez — velocidad, precisión y comprensión
   juntas, como las mira un especialista en lectura: la velocidad sin
   comprensión no es fluidez.

   Todo queda guardado SOLO en d.lectura (el canal que Estadísticas ya
   dibuja), así que el dato entra al expediente, al informe de una
   carta y al espejo del maestro sin un paso más.

   Los TEXTOS viven en js/data/lectura-textos.js (LECTURA_TEXTOS, 20
   por grado de 2º a 9º, contexto hondureño) y las NORMAS en
   js/data/lectura-normas.js (banda por grado con su fuente nombrada
   y fechada). Las palabras de cada texto SE CUENTAN, nunca se
   escriben a mano.

   ► Fase siguiente (planeada): habilitar la autoprueba dentro de cada
     misión — el alumno se cronometra solo con un texto del tema. Esta
     pestaña ya deja listas las piezas: lecPalabras, lecPartirLineas y
     las normas son datos puros reutilizables desde cualquier página.

   Por qué es una PESTAÑA de Mi aula y no una herramienta suelta: usa
   la lista de alumnos del grupo, escribe en el expediente del grupo y
   alimenta la pestaña 📈 Estadísticas — separarla obligaría al maestro
   a elegir grupo y alumno dos veces.
══════════════════════════════════════════════════════════════ */

/* ── estado de la pestaña (mismo patrón que _adColectaId) ── */
let _lecNum = null;        /* alumno elegido (nº de lista) */
let _lecGrado = null;      /* grado del texto elegido (2..9) */
let _lecTextoId = null;    /* texto elegido */
let _lecFase = 'elegir';   /* elegir | leer | preguntas | resultado */
let _lecModo = 'min1';     /* min1 (minuto exacto) | completa */
let _lecIni = 0;           /* Date.now() del arranque */
let _lecSeg = 0;           /* segundos finales de la toma */
let _lecCongelado = false; /* modo min1: ya sonó el minuto, falta tocar la palabra */
let _lecErrores = 0;
let _lecPalabraIdx = null; /* índice (0-based) de la última palabra leída */
let _lecResp = [];         /* respuestas ✓/✗ de comprensión (true/false/null) */
let _lecTimer = null;      /* intervalo del cronómetro */

function lecPalabras(texto) {
  return String(texto || '').trim().split(/\s+/);
}

/* Corta el texto en líneas de N palabras con el conteo ACUMULADO al
   final de cada línea: en el papel, el maestro marca la última palabra
   y suma con la vista, como en las tomas clásicas de fluidez. */
function lecPartirLineas(texto, porLinea) {
  const ps = lecPalabras(texto);
  const lineas = [];
  for (let i = 0; i < ps.length; i += porLinea) {
    const trozo = ps.slice(i, i + porLinea);
    lineas.push({ palabras: trozo, acumulado: Math.min(i + porLinea, ps.length) });
  }
  return lineas;
}

function lecTextosDe(grado) {
  if (typeof LECTURA_TEXTOS === 'undefined') return [];
  return LECTURA_TEXTOS[grado] || [];
}

function lecTextoActual() {
  return lecTextosDe(_lecGrado).find(t => t.id === _lecTextoId) || null;
}

/* grado del grupo en dígitos (para preseleccionar y para la banda) */
function lecGradoGrupo(d) {
  const g = parseInt(String(d.grado || '').replace(/\D/g, ''), 10);
  return (g >= 2 && g <= 9) ? g : null;
}

function lecDetenerTimer() {
  if (_lecTimer) { clearInterval(_lecTimer); _lecTimer = null; }
}

function lecReset() {
  lecDetenerTimer();
  _lecFase = 'elegir'; _lecIni = 0; _lecSeg = 0; _lecCongelado = false;
  _lecErrores = 0; _lecPalabraIdx = null; _lecResp = [];
}

/* cuántas veces este alumno ya leyó este texto (para variar la ficha) */
function lecVecesLeido(d, num, textoId) {
  return (d.lectura || []).filter(r => String(r.num) === String(num) && r.textoId === textoId).length;
}

/* ══════════════ RENDER PRINCIPAL DE LA PESTAÑA ══════════════ */
function adRenderLectura(body, d) {
  lecDetenerTimer();   /* cualquier re-render mata el intervalo viejo */
  if (!d.lista.length) { adSinLista(body, 'el control de lectura'); return; }
  if (typeof LECTURA_TEXTOS === 'undefined' || typeof lecVeredicto !== 'function') {
    body.innerHTML = '<div class="pa-card"><p class="pa-optional-hint">📖 Los textos de lectura aún no cargaron en este equipo. Recarga la página con internet una vez y quedarán guardados.</p></div>';
    return;
  }
  if (_lecNum == null || !d.lista.some(a => String(a.num) === String(_lecNum))) _lecNum = d.lista[0].num;
  if (_lecGrado == null) _lecGrado = lecGradoGrupo(d) || 4;
  if (_lecFase === 'elegir') lecRenderElegir(body, d);
  else if (_lecFase === 'leer') lecRenderLeer(body, d);
  else if (_lecFase === 'preguntas') lecRenderPreguntas(body, d);
  else lecRenderResultado(body, d);
}

/* ── FASE 1: elegir alumno y texto ── */
function lecRenderElegir(body, d) {
  const al = d.lista.find(a => String(a.num) === String(_lecNum));
  const gradoGrupo = lecGradoGrupo(d);
  const textos = lecTextosDe(_lecGrado);
  if (!textos.some(t => t.id === _lecTextoId)) _lecTextoId = textos.length ? textos[0].id : null;
  const nom = a => '#' + a.num + (a.nombre ? ' · ' + a.nombre : '');
  const banda = (typeof LECTURA_NORMAS !== 'undefined' && gradoGrupo) ? LECTURA_NORMAS.bandas[gradoGrupo] : null;

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📖 Control de lectura</div>
      <p class="pa-optional-hint">Elige al alumno y un texto, arranca el cronómetro y escucha su lectura
        en voz alta. Al terminar, <strong>toca la última palabra que leyó</strong>: la herramienta cuenta
        las palabras, saca su velocidad y te guía con cinco preguntas de comprensión. Todo queda en su
        expediente y en 📈 Estadísticas.</p>
      <div class="est-selector">
        <button class="pa-generate-btn ad-btn-sec" id="lec-prev" aria-label="Alumno anterior">‹</button>
        <select id="lec-alumno" class="pa-inp-field" aria-label="Elegir alumno">
          ${d.lista.map(a => '<option value="' + a.num + '"' + (String(a.num) === String(_lecNum) ? ' selected' : '') + '>' + adEsc(nom(a)) + '</option>').join('')}
        </select>
        <button class="pa-generate-btn ad-btn-sec" id="lec-next" aria-label="Alumno siguiente">›</button>
      </div>
      ${banda ? '<p class="pa-optional-hint" style="margin-top:8px">La banda de ' + gradoGrupo + 'º al terminar el año es de <strong>' + banda[0] + ' a ' + banda[1] + ' palabras por minuto</strong> (' + adEsc(LECTURA_NORMAS.fuenteCorta) + ').</p>' : ''}
    </div>

    <div class="pa-card">
      <div class="pa-card-title">📚 El texto <small class="est-sub">(20 por grado, del contexto hondureño)</small></div>
      <div class="ad-meses">
        ${[2, 3, 4, 5, 6, 7, 8, 9].map(g => '<button class="ad-mes-btn ' + (g === _lecGrado ? 'ad-mes-on' : '') + '" data-lecgrado="' + g + '">' + g + 'º' + (gradoGrupo === g ? ' ⭐' : '') + '</button>').join('')}
      </div>
      ${_lecGrado !== gradoGrupo && gradoGrupo ? '<p class="pa-optional-hint">Estás usando textos de ' + _lecGrado + 'º con un grupo de ' + gradoGrupo + 'º: vale para nivelar (más fácil) o retar (más difícil); el nivel se juzga siempre contra la banda de ' + gradoGrupo + 'º.</p>' : ''}
      <div class="lec-lista">
        ${textos.map(t => {
          const ps = lecPalabras(t.texto).length;
          const veces = lecVecesLeido(d, _lecNum, t.id);
          return `<button class="lec-texto-row ${t.id === _lecTextoId ? 'lec-texto-on' : ''}" data-lectexto="${t.id}">
            <span class="lec-tr-tit">${adEsc(t.titulo)}</span>
            <span class="lec-tr-meta">${t.genero ? adEsc(t.genero) + ' · ' : ''}${ps} palabras${veces ? ' · 🔁 ya lo leyó ' + veces + (veces === 1 ? ' vez' : ' veces') : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="lec-empezar" ${_lecTextoId ? '' : 'disabled'}>⏱️ Empezar la toma</button>
        <button class="pa-generate-btn ad-btn-sec" id="lec-print-uno" ${_lecTextoId ? '' : 'disabled'}>🖨️ Imprimir esta ficha</button>
        <button class="pa-generate-btn ad-btn-sec" id="lec-print-pack">🖨️ Las ${textos.length} fichas de ${_lecGrado}º</button>
      </div>
    </div>`;

  const sel = document.getElementById('lec-alumno');
  sel.addEventListener('change', () => { _lecNum = +sel.value; adRenderLectura(body, adLoad()); });
  const mover = paso => {
    const i = d.lista.findIndex(a => String(a.num) === String(_lecNum));
    _lecNum = d.lista[(i + paso + d.lista.length) % d.lista.length].num;
    adRenderLectura(body, adLoad());
  };
  document.getElementById('lec-prev').addEventListener('click', () => mover(-1));
  document.getElementById('lec-next').addEventListener('click', () => mover(1));
  body.querySelectorAll('[data-lecgrado]').forEach(b => b.addEventListener('click', () => {
    _lecGrado = +b.dataset.lecgrado; _lecTextoId = null;
    adRenderLectura(body, adLoad());
  }));
  body.querySelectorAll('[data-lectexto]').forEach(b => b.addEventListener('click', () => {
    _lecTextoId = b.dataset.lectexto;
    adRenderLectura(body, adLoad());
  }));
  document.getElementById('lec-empezar').addEventListener('click', () => {
    if (!lecTextoActual()) return;
    _lecFase = 'leer'; _lecIni = 0; _lecSeg = 0; _lecCongelado = false;
    _lecErrores = 0; _lecPalabraIdx = null; _lecResp = [];
    adRenderLectura(body, adLoad());
  });
  document.getElementById('lec-print-uno').addEventListener('click', () => lecImprimirFichas(adLoad(), _lecGrado, [_lecTextoId]));
  document.getElementById('lec-print-pack').addEventListener('click', () => lecImprimirFichas(adLoad(), _lecGrado, lecTextosDe(_lecGrado).map(t => t.id)));
}

/* ── FASE 2: la lectura con cronómetro ── */
function lecRenderLeer(body, d) {
  const t = lecTextoActual();
  if (!t) { lecReset(); adRenderLectura(body, d); return; }
  const al = d.lista.find(a => String(a.num) === String(_lecNum)) || {};
  const ps = lecPalabras(t.texto);

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">⏱️ ${adEsc(t.titulo)} <small class="est-sub">· lee ${adEsc(adPrimerNombre(al.nombre) || ('#' + _lecNum))}</small></div>
      <div class="lec-modos">
        <button class="ad-mes-btn ${_lecModo === 'min1' ? 'ad-mes-on' : ''}" data-lecmodo="min1" title="La toma clásica: al cumplirse el minuto, tocas la última palabra leída">⏱️ Minuto exacto</button>
        <button class="ad-mes-btn ${_lecModo === 'completa' ? 'ad-mes-on' : ''}" data-lecmodo="completa" title="El alumno lee todo el texto; tocas la última palabra al terminar">📖 Lectura completa</button>
      </div>
      <div class="lec-crono-caja">
        <div class="lec-crono" id="lec-crono">0:00</div>
        <div class="lec-crono-sub" id="lec-crono-sub">${_lecModo === 'min1' ? 'Al cumplirse el minuto te aviso' : 'Corre hasta que toques la última palabra'}</div>
      </div>
      <div class="ad-btn-row" style="justify-content:center">
        <button class="pa-generate-btn lec-btn-grande" id="lec-arrancar">▶️ Arrancar</button>
        <button class="pa-generate-btn ad-btn-sec" id="lec-cancelar">Cancelar</button>
      </div>
      <div class="lec-err-caja" id="lec-err-caja" style="display:none">
        <span>Errores de lectura <small>(se salta, cambia o traba una palabra)</small></span>
        <div class="lec-err-btns">
          <button class="pa-generate-btn ad-btn-sec" id="lec-err-menos" aria-label="Quitar un error">➖</button>
          <b id="lec-err-n">0</b>
          <button class="pa-generate-btn ad-btn-sec" id="lec-err-mas" aria-label="Anotar un error">➕</button>
        </div>
      </div>
      <p class="pa-optional-hint" id="lec-aviso" style="display:none"></p>
      <div class="lec-texto" id="lec-texto" aria-label="Texto de lectura">
        ${ps.map((p, i) => '<span class="lec-p" data-i="' + i + '">' + adEsc(p) + '</span>').join(' ')}
      </div>
      <p class="pa-optional-hint">El alumno lee de aquí o de la ficha impresa. Cuando termine (o cuando el
        minuto se cumpla), <strong>toca la última palabra que leyó</strong> y el cronómetro se detiene solo.</p>
    </div>`;

  const crono = document.getElementById('lec-crono');
  const aviso = document.getElementById('lec-aviso');
  const errCaja = document.getElementById('lec-err-caja');
  const pintaCrono = ms => {
    const s = ms / 1000;
    crono.textContent = Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  };

  body.querySelectorAll('[data-lecmodo]').forEach(b => b.addEventListener('click', () => {
    if (_lecIni) return;   /* con el cronómetro andando no se cambia el modo */
    _lecModo = b.dataset.lecmodo;
    adRenderLectura(body, adLoad());
  }));

  document.getElementById('lec-cancelar').addEventListener('click', () => { lecReset(); adRenderLectura(body, adLoad()); });

  document.getElementById('lec-arrancar').addEventListener('click', function () {
    if (_lecIni) return;
    _lecIni = Date.now();
    this.style.display = 'none';
    errCaja.style.display = '';
    document.getElementById('lec-texto').classList.add('lec-andando');
    _lecTimer = setInterval(() => {
      const ms = Date.now() - _lecIni;
      if (_lecModo === 'min1' && ms >= 60000) {
        pintaCrono(60000);
        if (!_lecCongelado) {
          _lecCongelado = true;
          aviso.style.display = '';
          aviso.innerHTML = '⏰ <strong>¡Minuto cumplido!</strong> Toca la última palabra que alcanzó a leer.';
          crono.classList.add('lec-crono-fin');
          try { if (navigator.vibrate) navigator.vibrate([180, 90, 180]); } catch (_) {}
        }
        return;
      }
      pintaCrono(ms);
    }, 100);
  });

  document.getElementById('lec-err-mas').addEventListener('click', () => {
    _lecErrores++;
    document.getElementById('lec-err-n').textContent = _lecErrores;
  });
  document.getElementById('lec-err-menos').addEventListener('click', () => {
    _lecErrores = Math.max(0, _lecErrores - 1);
    document.getElementById('lec-err-n').textContent = _lecErrores;
  });

  document.getElementById('lec-texto').addEventListener('click', e => {
    const span = e.target.closest('.lec-p');
    if (!span || !_lecIni) return;
    const ms = _lecCongelado ? 60000 : (Date.now() - _lecIni);
    if (ms < 3000) { toast('⏱️ Muy pronto: deja correr la lectura'); return; }
    lecDetenerTimer();
    _lecSeg = Math.round(ms / 100) / 10;
    _lecPalabraIdx = +span.dataset.i;
    _lecResp = lecTextoActual().preguntas.map(() => null);
    _lecFase = 'preguntas';
    adRenderLectura(body, adLoad());
  });
}

/* ── FASE 3: comprensión oral ── */
function lecRenderPreguntas(body, d) {
  const t = lecTextoActual();
  if (!t) { lecReset(); adRenderLectura(body, d); return; }
  const al = d.lista.find(a => String(a.num) === String(_lecNum)) || {};
  const leidas = _lecPalabraIdx + 1;
  const ppm = _lecSeg > 0 ? Math.round((leidas / _lecSeg) * 60) : 0;
  const TIPO_TXT = { literal: 'literal', inferencial: 'inferencial', critica: 'crítica' };
  const contestadas = _lecResp.filter(r => r !== null).length;

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">❓ Comprensión oral <small class="est-sub">· ${adEsc(t.titulo)}</small></div>
      <p class="pa-optional-hint">⏱️ ${_lecSeg}s · ${leidas} palabras leídas · <strong>${ppm} palabras por minuto</strong>
        · ${_lecErrores} error(es). Ahora pregunta EN VOZ ALTA, escucha a ${adEsc(adPrimerNombre(al.nombre) || 'tu alumno')}
        y marca ✓ o ✗. La respuesta guía es para ti.</p>
      ${t.preguntas.map((p, i) => `
        <div class="lec-preg">
          <div class="lec-preg-q"><span class="lec-preg-tipo lec-tipo-${p.tipo}">${TIPO_TXT[p.tipo] || p.tipo}</span> ${adEsc(p.q)}</div>
          <div class="lec-preg-r">Guía: ${adEsc(p.r)}</div>
          <div class="lec-preg-btns">
            <button class="lec-vbtn ${_lecResp[i] === true ? 'lec-vbtn-si' : ''}" data-lecresp="${i}" data-val="1">✓ Respondió bien</button>
            <button class="lec-vbtn ${_lecResp[i] === false ? 'lec-vbtn-no' : ''}" data-lecresp="${i}" data-val="0">✗ No respondió</button>
          </div>
        </div>`).join('')}
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="lec-terminar" ${contestadas === t.preguntas.length ? '' : 'disabled'}>
          ${contestadas === t.preguntas.length ? '📊 Ver el resultado' : '📊 Marca las ' + t.preguntas.length + ' preguntas (' + contestadas + '/' + t.preguntas.length + ')'}</button>
        <button class="pa-generate-btn ad-btn-sec" id="lec-volver-leer">↩️ Repetir la lectura</button>
      </div>
    </div>`;

  body.querySelectorAll('[data-lecresp]').forEach(b => b.addEventListener('click', () => {
    _lecResp[+b.dataset.lecresp] = b.dataset.val === '1';
    adRenderLectura(body, adLoad());
  }));
  document.getElementById('lec-volver-leer').addEventListener('click', () => {
    _lecFase = 'leer'; _lecIni = 0; _lecSeg = 0; _lecCongelado = false; _lecErrores = 0; _lecPalabraIdx = null;
    adRenderLectura(body, adLoad());
  });
  const fin = document.getElementById('lec-terminar');
  if (fin) fin.addEventListener('click', () => {
    if (_lecResp.some(r => r === null)) return;
    _lecFase = 'resultado';
    adRenderLectura(body, adLoad());
  });
}

/* ── FASE 4: resultado y guardado ── */
function lecRenderResultado(body, d) {
  const t = lecTextoActual();
  if (!t) { lecReset(); adRenderLectura(body, d); return; }
  const al = d.lista.find(a => String(a.num) === String(_lecNum)) || {};
  const leidas = _lecPalabraIdx + 1;
  const ppm = _lecSeg > 0 ? Math.round((leidas / _lecSeg) * 60) : 0;
  const comp = _lecResp.filter(Boolean).length;
  const gradoAlumno = lecGradoGrupo(d) || _lecGrado;
  const v = lecVeredicto(gradoAlumno, ppm, leidas, _lecErrores, comp, t.preguntas.length);
  const chip = (lbl, valTxt, color) => `<div class="est-chip"><span>${lbl}</span><b style="color:${color || 'inherit'}">${valTxt}</b></div>`;

  body.innerHTML = `
    <div class="pa-card">
      <div class="pa-card-title">📊 Resultado de ${adEsc(al.nombre || ('#' + _lecNum))}</div>
      <div class="lec-ppm-hero"><b>${ppm}</b><span>palabras por minuto</span></div>
      <div class="est-chips">
        ${chip('Velocidad (' + gradoAlumno + 'º: ' + v.velocidad.banda[0] + '–' + v.velocidad.banda[1] + ')', v.velocidad.etiqueta, v.velocidad.color)}
        ${v.precision ? chip('Precisión (' + _lecErrores + ' error' + (_lecErrores === 1 ? '' : 'es') + ')', v.precision.etiqueta + ' · ' + v.precision.pct + '%', v.precision.color) : ''}
        ${v.comprension ? chip('Comprensión (' + comp + ' de ' + t.preguntas.length + ')', v.comprension.etiqueta, v.comprension.color) : ''}
        ${chip('Tiempo y palabras', _lecSeg + 's · ' + leidas + ' de ' + lecPalabras(t.texto).length)}
      </div>
      <div class="est-dec neutro lec-veredicto">🩺 ${v.texto}</div>
      <p class="pa-optional-hint">Banda por grado: ${adEsc((typeof LECTURA_NORMAS !== 'undefined' && LECTURA_NORMAS.fuenteCorta) || 'referencia')}.
        ${_lecGrado !== gradoAlumno ? 'El texto es de ' + _lecGrado + 'º y el nivel se juzga contra la banda de ' + gradoAlumno + 'º.' : ''}</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="lec-guardar">💾 Guardar en su expediente</button>
        <button class="pa-generate-btn ad-btn-sec" id="lec-otra">↩️ Otra toma</button>
      </div>
    </div>`;

  document.getElementById('lec-guardar').addEventListener('click', () => {
    const dd = adLoad();
    dd.lectura = dd.lectura || [];
    dd.lectura.push({
      f: adHoy(), num: +_lecNum, textoId: t.id, gradoTexto: _lecGrado,
      titulo: t.titulo, seg: _lecSeg, palabras: leidas, total: lecPalabras(t.texto).length,
      errores: _lecErrores, ppm, comp, compDe: t.preguntas.length,
    });
    adSave(dd);
    toast('💾 Guardado: ya aparece en 📈 Estadísticas y en su informe');
    lecReset();
    adRenderLectura(body, adLoad());
  });
  document.getElementById('lec-otra').addEventListener('click', () => { lecReset(); adRenderLectura(body, adLoad()); });
}

/* ══════════════ FICHAS IMPRIMIBLES — una carta por texto ══════════════
   La ficha trae el texto en letra del tamaño del grado, con el conteo
   acumulado de palabras al final de cada línea (para tomar la lectura
   en papel), la tabla de registro y las cinco preguntas con ✓/✗ y su
   respuesta guía. La banda del grado va nombrada y fechada. */
function lecImprimirFichas(d, grado, ids) {
  const textos = lecTextosDe(grado).filter(t => ids.indexOf(t.id) >= 0);
  if (!textos.length) { if (typeof toast === 'function') toast('No hay textos que imprimir'); return; }
  const grupo = adGrupoTxt(d);
  const banda = (typeof LECTURA_NORMAS !== 'undefined') ? LECTURA_NORMAS.bandas[grado] : null;
  const fuente = (typeof LECTURA_NORMAS !== 'undefined') ? LECTURA_NORMAS.fuenteCorta : '';
  /* letra y palabras por línea según el grado: más chico el lector,
     más grande la letra y más corta la línea */
  const porLinea = grado <= 3 ? 8 : grado <= 6 ? 10 : 12;
  const fz = grado <= 2 ? 17 : grado === 3 ? 16 : grado <= 5 ? 14.5 : grado === 6 ? 14 : 12.5;
  const TIPO_TXT = { literal: 'Literal', inferencial: 'Inferencial', critica: 'Crítica' };

  const ficha = t => {
    const lineas = lecPartirLineas(t.texto, porLinea);
    const totalP = lecPalabras(t.texto).length;
    return `<section class="hoja">
      <header class="lf-head">
        <div>
          <div class="lf-tit">📖 Control de lectura · ${grado}º grado</div>
          <div class="lf-sub">${adEsc((d.escuela || '').trim() || 'Centro Educativo')}${grupo ? ' · ' + adEsc(grupo) : ''}</div>
        </div>
        <div class="lf-banda">${banda ? 'Banda de ' + grado + 'º: <b>' + banda[0] + '–' + banda[1] + ' ppm</b><br><small>' + adEsc(fuente) + '</small>' : ''}</div>
      </header>
      <div class="lf-registro">
        <div><span>Alumno/a</span><i></i></div>
        <div><span>Fecha</span><i></i></div>
        <div><span>Tiempo</span><i></i></div>
        <div><span>Palabras leídas</span><i></i></div>
        <div><span>Errores</span><i></i></div>
        <div><span>PPM</span><i></i></div>
      </div>
      <h2 class="lf-titulo">${adEsc(t.titulo)}</h2>
      <div class="lf-texto" style="font-size:${fz}px">
        ${lineas.map(l => '<div class="lf-linea"><span>' + l.palabras.map(adEsc).join(' ') + '</span><em>' + l.acumulado + '</em></div>').join('')}
      </div>
      <p class="lf-total">${totalP} palabras en total · el número al final de cada línea es el conteo acumulado:
        marca la última palabra leída y toma el número de su línea.</p>
      <div class="lf-preg-tit">Comprensión oral — pregunta y marca</div>
      ${t.preguntas.map((p, i) => `
        <div class="lf-preg">
          <div class="lf-preg-q">${i + 1}. <b>[${TIPO_TXT[p.tipo] || p.tipo}]</b> ${adEsc(p.q)} <span class="lf-cajas">✓ ☐ &nbsp; ✗ ☐</span></div>
          <div class="lf-preg-r">Guía: ${adEsc(p.r)}</div>
        </div>`).join('')}
      <footer class="lf-foot">Ficha de M.E.T.A.S. · Control de lectura · texto ${adEsc(t.id)} · La velocidad sin
        comprensión no es fluidez: las dos se toman juntas.</footer>
    </section>`;
  };

  const titulo = textos.length === 1
    ? 'Lectura — ' + textos[0].titulo + ' (' + grado + 'º)'
    : 'Lecturas de ' + grado + 'º — ' + textos.length + ' fichas';
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${adEsc(titulo)}</title>
<style>
  @page { size: letter portrait; margin: 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { color: #0f2350; font-family: Arial, Helvetica, sans-serif; }
  .hoja { page-break-after: always; min-height: 252mm; display: flex; flex-direction: column; }
  .hoja:last-child { page-break-after: auto; }
  .lf-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; border-bottom: 2.5px solid #1e3a7c; padding-bottom: 6px; }
  .lf-tit { font-family: Georgia, serif; font-size: 15px; font-weight: 700; color: #1e3a7c; }
  .lf-sub { font-size: 11px; color: #55637d; margin-top: 2px; }
  .lf-banda { text-align: right; font-size: 11px; color: #333; }
  .lf-banda small { color: #7286a8; font-size: 9px; }
  .lf-registro { display: flex; gap: 6px; margin: 9px 0; }
  .lf-registro > div { flex: 1; }
  .lf-registro > div:first-child { flex: 2.2; }
  .lf-registro span { display: block; font-size: 8.5px; text-transform: uppercase; letter-spacing: .4px; color: #7286a8; }
  .lf-registro i { display: block; border-bottom: 1.2px solid #55637d; height: 16px; }
  .lf-titulo { font-family: Georgia, serif; font-size: 19px; text-align: center; margin: 8px 0 6px; }
  .lf-texto { line-height: 1.9; }
  .lf-linea { display: flex; align-items: baseline; gap: 8px; }
  .lf-linea span { flex: 1; }
  .lf-linea em { font-style: normal; font-size: 9.5px; color: #9aa8c0; min-width: 24px; text-align: right; }
  .lf-total { font-size: 9.5px; color: #7286a8; margin: 6px 0 10px; }
  .lf-preg-tit { font-family: Georgia, serif; font-size: 13px; font-weight: 700; color: #1e3a7c; border-bottom: 1px solid #d4dbe6; padding-bottom: 3px; margin-bottom: 6px; }
  .lf-preg { margin-bottom: 7px; }
  .lf-preg-q { font-size: 12px; line-height: 1.5; }
  .lf-preg-q b { color: #1e3a7c; font-size: 10px; }
  .lf-cajas { white-space: nowrap; color: #333; }
  .lf-preg-r { font-size: 10px; color: #7286a8; font-style: italic; margin-top: 1px; }
  .lf-foot { margin-top: auto; padding-top: 10px; font-size: 9px; color: #7286a8; text-align: center; }
</style></head><body>
${textos.map(ficha).join('')}
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}
