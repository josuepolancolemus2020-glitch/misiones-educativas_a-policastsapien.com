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

   Los TEXTOS viven en js/data/lectura-textos.js (LECTURA_TEXTOS, de 2º
   a 9º, contexto hondureño; el número por grado SE CUENTA del dato,
   nunca se escribe) y las NORMAS en
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

/* Tamaño de letra del texto de la ficha impresa, por grado. Es el MÁS
   GRANDE que deja la ficha en una sola hoja carta: se midieron las 400
   fichas (8 grados × 50) con _dev/verifica-fichas-lectura.js. Baja al
   subir de grado porque los textos se alargan — 58 palabras en 2º, hasta
   200 en 9º— y la hoja es la misma. Cambiar un número de aquí obliga a
   volver a medir; si no, hay fichas que se parten en dos páginas. */
const LEC_FICHA_FZ = { 2: 23.5, 3: 21, 4: 19, 5: 16.5, 6: 15.5, 7: 15, 8: 13.5, 9: 12.5 };

/* Cuántas palabras van en cada renglón del texto. Va de la mano del
   tamaño de letra: el renglón tiene que caber ENTERO de un lado a otro
   de la hoja, porque el número del final es el conteo acumulado hasta
   ahí — si el renglón se parte en dos, ese número queda descolgado y la
   ficha deja de servir para tomar la lectura. Más palabras por renglón
   también significa menos renglones, y eso es lo que deja subir la letra
   en los grados altos, donde los textos llegan a 200 palabras. */
const LEC_FICHA_PORLINEA = { 2: 8, 3: 9, 4: 10, 5: 11, 6: 11, 7: 12, 8: 14, 9: 16 };

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
      <div class="pa-card-title">📚 El texto <small class="est-sub">(${textos.length} en este grado, del contexto hondureño)</small></div>
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
   en papel), la tabla de registro y las cinco preguntas de comprensión
   COMO SELECCIÓN MÚLTIPLE (a/b/c en horizontal): esta hoja la contesta
   el alumno, así que NO lleva la respuesta guía ni la fuente de la
   banda — esas se quedan en la pantalla del maestro, que es quien las
   necesita.

   Tampoco lleva el TIPO de cada pregunta («[Literal]», «[Inferencial]»).
   Lo pidió el maestro y tiene razón: al alumno esa etiqueta no le dice
   nada y le adelanta qué clase de respuesta se espera, que es media
   pista. El tipo es información para quien corrige, así que se fue a la
   pauta, donde además sirve para leer el resultado («falla siempre en
   las inferenciales»).

   La PAUTA que va al final es la hoja del maestro: los criterios con
   que se evalúa, qué hacer según lo que salga y las letras correctas.
   Se guarda y no se reparte.

   ⚠️ El tamaño de letra de la ficha NO se sube a ojo: cada ficha tiene
   que caber en UNA hoja carta, y los textos de 9º llegan a 200 palabras.
   Los tamaños de abajo son los más grandes que caben, medidos sobre las
   400 fichas con _dev/verifica-fichas-lectura.js. Si se suben, hay que
   volver a medir. */
function lecImprimirFichas(d, grado, ids) {
  const textos = lecTextosDe(grado).filter(t => ids.indexOf(t.id) >= 0);
  if (!textos.length) { if (typeof toast === 'function') toast('No hay textos que imprimir'); return; }
  /* Solo grado y sección: adGrupoTxt() ya trae el nombre de la escuela
     dentro, y la cabecera lo pone aparte — juntos lo escribían DOS VECES
     en cada una de las 50 fichas, y de paso empujaban la banda a otro
     renglón. */
  const grupo = adGradoSeccion(d.grado, d.seccion);
  const banda = (typeof LECTURA_NORMAS !== 'undefined') ? LECTURA_NORMAS.bandas[grado] : null;
  /* letra y palabras por línea según el grado: más chico el lector,
     más grande la letra y más corta la línea */
  const porLinea = LEC_FICHA_PORLINEA[grado] || 12;
  const fz = LEC_FICHA_FZ[grado] || 13;
  const TIPO_TXT = { literal: 'literal', inferencial: 'inferencial', critica: 'crítica' };
  const TIPO_PL = { literal: 'literales', inferencial: 'inferenciales', critica: 'críticas' };

  const ficha = t => {
    const lineas = lecPartirLineas(t.texto, porLinea);
    const totalP = lecPalabras(t.texto).length;
    return `<section class="hoja">
      <header class="lf-head">
        <div>
          <div class="lf-tit">📖 Control de lectura · ${grado}º grado</div>
          <div class="lf-sub">${adEsc((d.escuela || '').trim() || 'Centro Educativo')}${grupo ? ' · ' + adEsc(grupo) : ''}</div>
        </div>
        <div class="lf-banda">${banda ? 'Banda de ' + grado + 'º: <b>' + banda[0] + '–' + banda[1] + ' ppm</b>' : ''}</div>
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
      <div class="lf-preg-tit">Comprensión — rellena el círculo de la letra de la respuesta correcta</div>
      ${t.preguntas.map((p, i) => `
        <div class="lf-preg">
          <div class="lf-preg-q"><b>${i + 1}.</b> ${adEsc(p.q)}</div>
          ${Array.isArray(p.o) && p.o.length === 3
            ? '<div class="lf-ops">' + p.o.map((op, oi) => '<span class="lf-op"><i></i><b>' + 'abc'[oi] + ')</b> ' + adEsc(op) + '</span>').join('') + '</div>'
            : '<div class="lf-ops"><span class="lf-op lf-cajas">✓ ☐ &nbsp; ✗ ☐ (respuesta oral)</span></div>'}
        </div>`).join('')}
      <footer class="lf-foot">Ficha de M.E.T.A.S. · Control de lectura · texto ${adEsc(t.id)} · La velocidad sin
        comprensión no es fluidez: las dos se toman juntas.</footer>
    </section>`;
  };

  /* ══════════════ PAUTA — la hoja del maestro ══════════════
     Lleva TRES cosas, y en este orden porque así se usa: cómo se toma,
     con qué criterio se juzga lo que salió, y qué hacer con cada
     resultado. Las letras correctas van al final: se consultan rápido y
     de reojo, pero lo que convierte un número en una decisión son los
     criterios, y esos hasta ahora vivían solo en la pantalla.

     Los niveles y las etiquetas NO se escriben aquí: se le PREGUNTAN a
     js/data/lectura-normas.js llamando a sus funciones con casos de
     ejemplo. Si mañana cambia la tabla, esta hoja cambia sola. */
  const etqVel = ppm => (typeof lecNivelVelocidad === 'function') ? lecNivelVelocidad(grado, ppm).etiqueta : '';
  const etqPrec = err => (typeof lecNivelPrecision === 'function') ? lecNivelPrecision(100, err).etiqueta : '';
  const etqComp = n => (typeof lecNivelComprension === 'function') ? lecNivelComprension(n, 5).etiqueta : '';
  const bandaPrev = (banda && typeof LECTURA_NORMAS !== 'undefined')
    ? (LECTURA_NORMAS.bandas[grado - 1] || [Math.max(10, banda[0] - 25), banda[0] - 1]) : null;

  /* «1, 2 y 3 literales · 4 inferencial · 5 crítica», contado de las
     preguntas que se están imprimiendo. En el catálogo el patrón es fijo
     por grado, pero se cuenta igual: el día que entre un texto con otro
     reparto, la pauta lo dirá sola. */
  const listaY = ns => ns.length <= 1 ? String(ns[0]) : ns.slice(0, -1).join(', ') + ' y ' + ns[ns.length - 1];
  const patronDe = t => t.preguntas.map(p => p.tipo).join(',');
  const patronUnico = textos.every(t => patronDe(t) === patronDe(textos[0])) ? textos[0].preguntas.map(p => p.tipo) : null;
  const frasePatron = tipos => {
    const grupos = [];
    tipos.forEach((tp, i) => {
      const g = grupos[grupos.length - 1];
      if (g && g.tipo === tp) g.nums.push(i + 1); else grupos.push({ tipo: tp, nums: [i + 1] });
    });
    return grupos.map(g => '<b>' + listaY(g.nums) + '</b> ' + (g.nums.length > 1 ? TIPO_PL[g.tipo] : TIPO_TXT[g.tipo])).join(' · ');
  };

  const pautaFila = t => {
    const letras = t.preguntas.map((p, i) => (i + 1) + '·' + (Array.isArray(p.o) && p.c >= 0 && p.c <= 2 ? 'abc'[p.c] : '—')).join('&nbsp;&nbsp;');
    const tipos = patronUnico ? '' : '<span class="lf-pa-tip">' + t.preguntas.map(p => TIPO_TXT[p.tipo][0].toUpperCase()).join('') + '</span>';
    return '<div class="lf-pa-fila"><span class="lf-pa-id">' + adEsc(t.id) + '</span><span class="lf-pa-tit">' +
      adEsc(t.titulo) + '</span>' + tipos + '<span class="lf-pa-lets">' + letras + '</span></div>';
  };

  const pauta = `<section class="hoja">
    <header class="lf-head">
      <div>
        <div class="lf-tit">🔑 Pauta de corrección · ${grado}º grado</div>
        <div class="lf-sub">Solo para el maestro: no se reparte con las fichas</div>
      </div>
      <div class="lf-banda">${textos.length} ficha${textos.length === 1 ? '' : 's'}</div>
    </header>

    <div class="lf-pa-h">⏱️ Cómo se toma</div>
    <ol class="lf-pa-lista">
      <li>Entrégale la ficha, arranca el cronómetro y pídele que lea <b>en voz alta</b>.</li>
      <li>Al cumplirse <b>el minuto</b> —o cuando termine, si quieres la lectura completa— marca la
        <b>última palabra que leyó</b> y toma el número del final de esa línea: ese es el conteo acumulado.</li>
      <li>Cuenta un <b>error</b> cada vez que salta, cambia o se traba en una palabra. Autocorregirse no es error.</li>
      <li>Las <b>palabras por minuto</b> salen de dividir las palabras leídas entre los segundos y multiplicar por 60.
        En la pestaña 📖 Lectura de M.E.T.A.S. eso se calcula solo y queda en el expediente del alumno.</li>
      <li>Las cinco preguntas se contestan <b>en la hoja</b>; también valen de viva voz si el niño aún escribe despacio.</li>
    </ol>

    <div class="lf-pa-h">📏 Con qué criterio se juzga</div>
    <table class="lf-pa-tab">
      <tr>
        <th>Velocidad<br><small>palabras por minuto</small></th>
        <td>
          ${banda ? '<b>' + etqVel(banda[1] + 1) + ':</b> más de ' + banda[1] + ' &nbsp;·&nbsp; ' +
            '<b>' + etqVel(banda[0]) + ':</b> ' + banda[0] + '–' + banda[1] + ' &nbsp;·&nbsp; ' +
            (bandaPrev ? '<b>' + etqVel(bandaPrev[0]) + ':</b> ' + bandaPrev[0] + '–' + (banda[0] - 1) + ' &nbsp;·&nbsp; ' : '') +
            '<b>' + etqVel(0) + ':</b> menos de ' + (bandaPrev ? bandaPrev[0] : banda[0]) : '—'}
          <div class="lf-pa-nota">La banda es de <b>fin de grado</b>: en los primeros meses del año es normal ir por debajo.</div>
        </td>
      </tr>
      <tr>
        <th>Precisión<br><small>palabras correctas</small></th>
        <td>
          <b>${etqPrec(1)}:</b> 98 % o más &nbsp;·&nbsp; <b>${etqPrec(4)}:</b> 95 a 97 % &nbsp;·&nbsp;
          <b>${etqPrec(8)}:</b> menos de 95 %
          <div class="lf-pa-nota">Frustración no es mala nota: es que <b>el texto le quedó grande</b>. Repite con uno de
            un grado menor y vuelve a subir cuando lo lea cómodo.</div>
        </td>
      </tr>
      <tr>
        <th>Comprensión<br><small>de 5 preguntas</small></th>
        <td>
          <b>5:</b> ${etqComp(5)} &nbsp;·&nbsp; <b>4:</b> ${etqComp(4)} &nbsp;·&nbsp;
          <b>3:</b> ${etqComp(3)} &nbsp;·&nbsp; <b>2 o menos:</b> ${etqComp(2)}
          ${patronUnico ? '<div class="lf-pa-nota">En ' + grado + 'º las preguntas van así: ' + frasePatron(patronUnico) +
            '. Las <b>literales</b> están en el texto; las <b>inferenciales</b> hay que deducirlas; la <b>crítica</b> pide opinión razonada.</div>' : ''}
        </td>
      </tr>
    </table>

    <div class="lf-pa-h">🩺 Qué hacer con lo que salga</div>
    <ul class="lf-pa-lista lf-pa-sug">
      <li><b>Lee rápido pero comprende poco.</b> Eso es descifrado, no fluidez. Pídele que baje la marcha y que lea
        «para contármelo después»; luego vuelve a preguntar. La velocidad ya la tiene.</li>
      <li><b>Comprende bien pero lee despacio.</b> Va por el camino difícil, que es el bueno. La velocidad sube sola
        con diez minutos diarios en voz alta; no la apures con el cronómetro.</li>
      <li><b>Debajo de la banda.</b> La receta probada: diez minutos diarios en voz alta con un texto de su nivel,
        <b>releyendo el mismo texto dos o tres días</b>. La relectura es lo que más sube la fluidez.</li>
      <li><b>Muchos errores.</b> Un pelín más despacio y con el dedo bajo la línea; casi siempre es prisa, no dificultad.</li>
      <li><b>Arriba de la banda y comprendiendo.</b> Dale textos de un grado mayor y ponlo a leerle a los pequeños:
        leer para otros es el mejor ejercicio de entonación.</li>
      <li><b>Repite la toma cada mes o mes y medio</b>, con textos distintos. Un solo dato no dice nada; tres seguidos
        dicen si sube.</li>
    </ul>

    <div class="lf-pa-h">✅ Respuestas correctas</div>
    <div class="lf-pauta">${textos.map(pautaFila).join('')}</div>
    <p class="lf-pa-nota">En las <b>críticas</b> la letra marca la opinión mejor razonada; si el alumno defiende otra
      con un buen porqué, <b>también vale</b> — se le pone correcta y se le felicita el argumento.</p>
    <footer class="lf-foot">Ficha de M.E.T.A.S. · Control de lectura · pauta de ${grado}º</footer>
  </section>`;

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
  .lf-head > div:first-child { min-width: 0; }
  .lf-tit { font-family: Georgia, serif; font-size: 15px; font-weight: 700; color: #1e3a7c; }
  .lf-sub { font-size: 11px; color: #55637d; margin-top: 2px; }
  /* la banda no se parte: «125–134 ppm» en dos renglones se lee como dos
     datos distintos */
  .lf-banda { text-align: right; font-size: 11px; color: #333; flex: 0 0 auto; white-space: nowrap; }
  .lf-banda small { color: #7286a8; font-size: 9px; }
  .lf-registro { display: flex; gap: 6px; margin: 9px 0; }
  .lf-registro > div { flex: 1; }
  .lf-registro > div:first-child { flex: 2.2; }
  .lf-registro span { display: block; font-size: 8.5px; text-transform: uppercase; letter-spacing: .4px; color: #7286a8; }
  .lf-registro i { display: block; border-bottom: 1.2px solid #55637d; height: 16px; }
  .lf-titulo { font-family: Georgia, serif; font-size: 21px; text-align: center; margin: 8px 0 6px; }
  .lf-texto { line-height: 1.85; }
  .lf-linea { display: flex; align-items: baseline; gap: 8px; }
  .lf-linea span { flex: 1; }
  .lf-linea em { font-style: normal; font-size: 10px; color: #9aa8c0; min-width: 26px; text-align: right; }
  .lf-total { font-size: 10px; color: #7286a8; margin: 6px 0 9px; }
  .lf-preg-tit { font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: #1e3a7c; border-bottom: 1px solid #d4dbe6; padding-bottom: 3px; margin-bottom: 6px; }
  .lf-preg { margin-bottom: 9px; }
  /* La PREGUNTA va en negrita y sin la etiqueta del tipo: así se
     distingue de un vistazo de sus tres opciones, que es lo que el
     alumno necesita para no perderse en una hoja llena de renglones. */
  .lf-preg-q { font-size: 13.5px; line-height: 1.45; font-weight: 700; color: #16305f; }
  .lf-preg-q b { color: #1e3a7c; }
  .lf-cajas { white-space: nowrap; color: #333; }
  /* opciones en horizontal, como la selección múltiple de las misiones:
     tres por fila para aprovechar el ancho; si una opción es larga, el
     flex la deja bajar sin romper la hoja */
  .lf-ops { display: flex; flex-wrap: wrap; gap: 3px 16px; margin: 4px 0 0 18px; }
  .lf-op { font-size: 12px; line-height: 1.4; display: inline-flex; align-items: baseline; gap: 5px; }
  .lf-op i { display: inline-block; width: 11px; height: 11px; border: 1.3px solid #333; border-radius: 50%; flex-shrink: 0; align-self: center; }
  .lf-op b { color: #1e3a7c; }

  /* ── La pauta del maestro ──
     Letra MÁS GRANDE que la de la ficha: esta hoja se consulta de reojo,
     con el alumno leyendo enfrente y sin tiempo de acercarse el papel. */
  .lf-pa-h { font-family: Georgia, serif; font-size: 14.5px; font-weight: 700; color: #1e3a7c;
    border-bottom: 1.5px solid #d4dbe6; padding-bottom: 3px; margin: 11px 0 6px; }
  .lf-pa-lista { font-size: 12.5px; line-height: 1.5; margin: 0 0 0 18px; }
  .lf-pa-lista li { margin-bottom: 3px; }
  .lf-pa-sug { list-style: none; margin-left: 0; }
  .lf-pa-sug li { padding-left: 13px; position: relative; }
  .lf-pa-sug li::before { content: '▸'; position: absolute; left: 0; color: #1e3a7c; }
  /* con 50 fichas la pauta ocupa dos hojas; que el corte caiga ENTRE
     bloques y nunca a media fila de criterios o a media sugerencia */
  .lf-pa-h { break-after: avoid; page-break-after: avoid; }
  .lf-pa-tab tr, .lf-pa-lista li, .lf-pa-sug li { break-inside: avoid; page-break-inside: avoid; }
  .lf-pa-tab { width: 100%; border-collapse: collapse; font-size: 12.5px; line-height: 1.45; }
  .lf-pa-tab th { text-align: left; vertical-align: top; width: 108px; padding: 5px 8px 5px 0;
    color: #1e3a7c; font-size: 12.5px; border-top: 1px solid #e3e8f0; }
  .lf-pa-tab th small { display: block; font-weight: 400; font-size: 10px; color: #7286a8; }
  .lf-pa-tab td { padding: 5px 0; border-top: 1px solid #e3e8f0; }
  .lf-pa-nota { font-size: 11px; line-height: 1.45; color: #55637d; margin-top: 3px; }
  .lf-pauta { margin-top: 4px; column-count: 2; column-gap: 18px; }
  .lf-pa-fila { font-size: 11.5px; display: flex; gap: 6px; align-items: baseline; padding: 2.5px 0; border-bottom: 1px dotted #d4dbe6; break-inside: avoid; }
  .lf-pa-id { font-weight: 700; color: #1e3a7c; min-width: 42px; }
  .lf-pa-tit { flex: 1; color: #55637d; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .lf-pa-tip { color: #7286a8; font-size: 9.5px; letter-spacing: 1px; }
  .lf-pa-lets { font-weight: 700; white-space: nowrap; }
  .lf-foot { margin-top: auto; padding-top: 10px; font-size: 9px; color: #7286a8; text-align: center; }
</style></head><body>
${textos.map(ficha).join('')}
${pauta}
<script>window.onload=function(){setTimeout(function(){window.print();},280);}<\/script>
</body></html>`;
  adPrintAbrir(html);
}
