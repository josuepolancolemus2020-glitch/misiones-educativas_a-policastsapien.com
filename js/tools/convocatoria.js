/* ══════════════════════════════════════════════════════════════
   📣 CONVOCATORIA — «¿va o no va?» por WhatsApp

   De dónde sale: el maestro tiene que contratar buses para una salida
   y necesita un número —cuánta gente va— ANTES de pagarlos. Hoy eso se
   hace pasando un cuaderno grado por grado, o contando mensajes
   sueltos en el grupo de WhatsApp. Ninguna de las dos cuadra: se
   contrata de más (se paga aire) o de menos (se queda un niño abajo).

   Cómo funciona, en tres pasos y sin nada que instalar:
     1. El maestro llena los datos del evento aquí (dos minutos).
     2. Toca «Publicar»: nace un código corto y un enlace.
     3. Pega el mensaje ya escrito en el grupo de WhatsApp. Los padres
        tocan, contestan en veinte segundos, y el conteo aparece aquí:
        personas, buses que hacen falta y dinero que se recogería.

   Por qué vive en ✅ Controles: es lo mismo que ya se hace ahí —saber
   quién sí y quién no—, solo que preguntándolo en vez de anotándolo.

   TRES DECISIONES QUE NO SON DE ADORNO:

   · El padre NO necesita clave de familia. El enlace se manda al grupo
     de TODA la escuela, no al del grado; ahí hay padres que no tienen
     clave y no la van a pedir un domingo. Por eso escriben el nombre
     del alumno y tocan su grado. El maestro ve las respuestas
     separadas por grado, que es como va a repartir los buses.

   · Se cuenta por PERSONAS, no por alumnos. En una excursión va el
     niño y va la mamá; el bus no distingue. Un conteo de alumnos deja
     media flota de gente parada en el portón.

   · Publicar no borra nada ni depende de la nube para funcionar. Si no
     hay internet, la convocatoria queda guardada y se publica después;
     y si un padre no logra mandar su respuesta, la pantalla se la
     manda al maestro por WhatsApp ya escrita.

   El SQL de la nube está en SUPABASE-CONVOCATORIA.sql (tablas
   convocatorias y convocatoria_respuestas, RLS cerrada; los nombres y
   los teléfonos NO salen sin el PIN del maestro).
══════════════════════════════════════════════════════════════ */

const CONV_ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   /* sin 0/O/1/I/L: se dictan por teléfono */
const CONV_PAGINA = 'salida.html';
const CONV_CAP_DEF = 55;         /* asientos de un bus escolar corriente */

let _adConvOn = 0;               /* dentro de 📣 Convocatoria (subsección de Controles) */
let _adConvId = null;            /* convocatoria abierta */
let _adConvCargando = 0;
/* Cuál convocatoria ya trajo sola sus respuestas en esta visita. Sin esto
   se arma un bucle: traer → renderAdmin() → volver a traer → … El teléfono
   del maestro se queda dando vueltas y gastando sus datos. */
let _adConvTraido = '';

/* Plantillas. Lo que el maestro NO va a escribir solo son los tres
   renglones de «lo que su hijo se lleva»: son los que convencen a la
   madre que está viendo el mensaje entre otros cuarenta. Vienen
   escritos y él los cambia si quiere. */
const CONV_PLANTILLAS = [
  {
    icono: '🚌', nombre: 'Excursión o paseo',
    tituloPh: 'Excursión al Museo Ferroviario de El Progreso',
    gancho: 'Este sábado sus hijos van a ver de cerca lo que hasta hoy solo han visto en el libro.',
    gana: ['Aprenden viendo y tocando, no solo leyendo',
           'Vuelven a casa contando lo que vieron: eso no se olvida',
           'Van acompañados por su maestro de principio a fin'],
    incluye: 'transporte en bus, entrada al museo',
    cobro: 'El aporte se recibe durante la semana, con el maestro.',
    nota: 'Lleve agua, gorra y su almuerzo.',
  },
  {
    icono: '🎪', nombre: 'Kermés o feria',
    tituloPh: 'Kermés del Día del Niño',
    gancho: 'Un día entero de juegos, comida y música para juntar lo que le hace falta a la escuela.',
    gana: ['Los niños pasan un día distinto en su escuela',
           'Lo que se junta se ve: se compra lo que hace falta',
           'Las familias se conocen entre ellas'],
    incluye: 'entrada y una actividad',
    cobro: 'Se paga en la entrada.',
    nota: '',
  },
  {
    icono: '🤝', nombre: 'Reunión de padres',
    tituloPh: 'Reunión de padres del 3er parcial',
    gancho: 'Media hora suya vale por un mes de recados en el cuaderno.',
    gana: ['Se entera cómo va su hijo, de frente y sin rodeos',
           'Se acuerda lo del parcial que viene',
           'Pregunta lo que quiera, ahí mismo'],
    incluye: '',
    cobro: '',
    nota: 'Si no puede a esa hora, avísele al maestro y se busca otra.',
  },
  {
    icono: '🎓', nombre: 'Acto o clausura',
    tituloPh: 'Acto de clausura del año',
    gancho: 'Su hijo lleva semanas ensayando. Que la vea desde la primera fila.',
    gana: ['Su hijo lo busca entre el público: que lo encuentre',
           'Se entregan los reconocimientos del año',
           'Queda la foto que se guarda'],
    incluye: '',
    cobro: '',
    nota: '',
  },
  {
    icono: '🏆', nombre: 'Campeonato o torneo',
    tituloPh: 'Campeonato interescolar',
    gancho: 'Los muchachos juegan mejor cuando saben que alguien de su casa los está viendo.',
    gana: ['Compiten representando a su escuela',
           'Aprenden a ganar y a perder con respeto',
           'Se les ve el esfuerzo de todo el trimestre'],
    incluye: '',
    cobro: '',
    nota: '',
  },
  {
    icono: '📣', nombre: 'Otra convocatoria',
    tituloPh: '¿De qué se trata?',
    gancho: '',
    gana: ['', '', ''],
    incluye: '',
    cobro: '',
    nota: '',
  },
];

function convAzar(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += CONV_ALFA[Math.floor(Math.random() * CONV_ALFA.length)];
  return s;
}
function convSb() {
  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  try {
    url = localStorage.getItem('METAS_SB_URL') || url;
    key = localStorage.getItem('METAS_SB_KEY') || key;
  } catch (_) {}
  return { url, key };
}
async function convRPC(fn, body) {
  if (navigator.onLine === false) return null;
  try {
    const { url, key } = convSb();
    const r = await fetch(url + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch (_) { return null; }
}

/* ── Navegación por NIVELES ──
   La flecha del encabezado sube un escalón, nunca salta al final: es la
   misma regla que ya siguen las colectas y los controles, y viene del
   maestro que se salía del aula sin querer. Aquí hay dos escalones:
   dentro de una convocatoria → la lista; en la lista → Controles. */
function adConvNivel() { return _adConvId ? 2 : (_adConvOn ? 1 : 0); }
function adConvAtras() {
  if (_adConvId) { _adConvId = null; _adConvTraido = ''; return true; }
  if (_adConvOn) { _adConvOn = 0; return true; }
  return false;
}
function adConvEntrar() { _adConvOn = 1; _adConvId = null; _adConvTraido = ''; }
function adConvCerrar() { _adConvOn = 0; _adConvId = null; _adConvTraido = ''; }
window.adConvNivel = adConvNivel;
window.adConvAtras = adConvAtras;
window.adConvEntrar = adConvEntrar;
window.adConvCerrar = adConvCerrar;

function convLista(d) { return Array.isArray(d.convocatorias) ? d.convocatorias : []; }
function convUna(d, id) { return convLista(d).find(c => c.id === id) || null; }

function convNueva(p, d) {
  return {
    id: 'V' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    icono: p.icono, titulo: '', tituloPh: p.tituloPh,
    gancho: p.gancho, gana: (p.gana || []).slice(),
    lugar: '', fecha: '', hora: '', regreso: '', punto: '',
    aporte: 0, incluye: p.incluye || '', cobro: p.cobro || '', nota: p.nota || '',
    limite: '', dirigido: 'Para las familias de toda la escuela',
    maestro: convMaestroDef(), wa: convWaDef(), escuela: (d && d.escuela) || '',
    capacidad: CONV_CAP_DEF, costoBus: 0, cupos: 0,
    codigo: '', pin: '', cerrada: 0,
    resp: [], respFecha: '', creada: adHoy(),
  };
}
function convMaestroDef() {
  try { const o = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); if (o && o.nombre) return o.nombre; } catch (_) {}
  return '';
}
function convWaDef() {
  try { const o = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); if (o && o.tel) return o.tel; } catch (_) {}
  return '';
}

/* Lo que viaja a la nube: solo lo PÚBLICO. El PIN se queda aquí. */
function convDatosPublicos(c) {
  return {
    v: 1, icono: c.icono || '📣', titulo: c.titulo || '', dirigido: c.dirigido || '',
    lugar: c.lugar || '', fecha: c.fecha || '', hora: c.hora || '', regreso: c.regreso || '',
    punto: c.punto || '', aporte: Number(c.aporte) || 0,
    incluye: String(c.incluye || '').split(',').map(s => s.trim()).filter(Boolean),
    gana: (c.gana || []).map(s => String(s || '').trim()).filter(Boolean),
    cobro: c.cobro || '', nota: c.nota || '', limite: c.limite || '',
    maestro: c.maestro || '', wa: String(c.wa || '').replace(/\D/g, ''),
    escuela: c.escuela || '', cupos: Number(c.cupos) || 0,
    cerrada: c.cerrada ? '1' : '0',
  };
}

function convEnlace(c) {
  const base = location.origin + location.pathname.replace(/[^/]*$/, '');
  return (location.protocol === 'file:' ? 'https://metas.policastsapien.com/' : base) + CONV_PAGINA + '?c=' + c.codigo;
}

/* ── Las cuentas que decide el maestro ── */
function convTotales(c) {
  const r = Array.isArray(c.resp) ? c.resp : [];
  const si = r.filter(x => x.va);
  const personas = si.reduce((a, x) => a + (Number(x.personas) || 0), 0);
  const cap = Math.max(5, Number(c.capacidad) || CONV_CAP_DEF);
  const buses = Math.ceil(personas / cap) || 0;
  const asientos = buses * cap;
  return {
    familias: si.length, personas, no: r.filter(x => !x.va).length, total: r.length,
    cap, buses, asientos, sobran: asientos - personas,
    /* cuánta gente va montada en el ÚLTIMO bus: si son cuatro, ese bus
       cuesta completo por cuatro personas y conviene saberlo antes de
       pagarlo */
    ultimo: buses ? personas - (buses - 1) * cap : 0,
    dinero: personas * (Number(c.aporte) || 0),
    costo: buses * (Number(c.costoBus) || 0),
  };
}
function convConsejo(t, c) {
  if (!t.personas) return 'Todavía nadie ha contestado. Vuelve a mandar el mensaje al grupo.';
  if (t.buses === 1 && t.sobran > 0) {
    return 'Con <strong>1 bus de ' + t.cap + '</strong> te alcanza y sobran ' + t.sobran + ' asientos.';
  }
  if (t.sobran === 0) return 'Los <strong>' + t.buses + ' buses van llenos</strong>, clavados. Ni uno más cabe.';
  if (t.buses > 1 && t.ultimo <= 10) {
    return '⚠️ Ojo: el bus n.º ' + t.buses + ' lo llevarías con <strong>' + t.ultimo + ' persona' +
      (t.ultimo === 1 ? '' : 's') + '</strong>. O consigues ' + (t.cap - t.ultimo) +
      ' más, o hablas con esas ' + t.ultimo + ' familias antes de contratarlo.';
  }
  return 'Con <strong>' + t.buses + ' buses de ' + t.cap + '</strong> te alcanza y sobran ' + t.sobran + ' asientos.';
}

/* ── El mensaje que se pega en el grupo de WhatsApp ──
   Se arma en UN solo lugar y se usa en dos: la vista previa que ve el
   maestro y lo que sale al tocar el botón. Lo que promete la pantalla
   es exactamente lo que leen las familias. */
function convMensaje(c) {
  const L = [];
  L.push((c.icono || '📣') + ' *' + (c.titulo || 'Convocatoria').toUpperCase() + '*');
  const sub = [c.escuela, convFechaLarga(c.fecha)].filter(Boolean).join(' · ');
  if (sub) L.push('_' + sub + '_');
  L.push('');
  if (c.gancho) { L.push(c.gancho); L.push(''); }
  (c.gana || []).map(g => String(g || '').trim()).filter(Boolean).forEach(g => L.push('✨ ' + g));
  if ((c.gana || []).filter(g => String(g || '').trim()).length) L.push('');
  if (c.fecha) L.push('🗓️ ' + convFechaLarga(c.fecha) + (c.hora ? ' · salimos ' + c.hora : '') +
    (c.regreso ? ' · de vuelta ' + c.regreso : ''));
  if (c.lugar) L.push('📍 ' + c.lugar);
  if (c.punto) L.push('🚌 Se sube en ' + c.punto);
  if (Number(c.aporte) > 0) L.push('💵 ' + adLps(c.aporte) + ' por persona' + (c.incluye ? ' (' + c.incluye + ')' : ''));
  L.push('');
  const dias = convDiasHasta(c.limite);
  const cierre = c.limite
    ? (dias === 0 ? '*HOY* es el último día'
      : dias === 1 ? 'tengo hasta *mañana*'
      : 'tengo hasta el *' + convFechaLarga(c.limite) + '*')
    : 'lo necesito ya';
  L.push('⚠️ Necesito saber *cuántos van* para contratar los buses: ' + cierre +
         '. Un asiento vacío lo terminamos pagando entre todos.');
  L.push('');
  L.push('👉 Conteste aquí, son 20 segundos:');
  L.push(c.codigo ? convEnlace(c) : '(publica la convocatoria para sacar el enlace)');
  L.push('');
  L.push('_No hay que registrarse ni instalar nada._' + (c.maestro ? ' — ' + c.maestro : ''));
  return L.join('\n');
}

const CONV_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const CONV_MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/* Se parte a mano: new Date('2026-08-15') se lee en UTC y en Honduras
   enseña el día ANTERIOR. Un padre que lee el día equivocado no llega. */
function convFecha(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
function convFechaLarga(iso) {
  const f = convFecha(iso);
  return f ? CONV_DIAS[f.getDay()] + ' ' + f.getDate() + ' de ' + CONV_MESES[f.getMonth()] : String(iso || '');
}
function convDiasHasta(iso) {
  const f = convFecha(iso);
  if (!f) return null;
  const h = new Date(); h.setHours(0, 0, 0, 0);
  return Math.round((f - h) / 86400000);
}

/* ══════════════ PANTALLA: mis convocatorias ══════════════ */
function adRenderConvocatoria(body, d) {
  if (_adConvId) { convRenderUna(body, d); return; }
  const lista = convLista(d).slice().reverse();
  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="cv-a-ctrl">✅ Controles</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">📣 Convocatoria por WhatsApp</div>
      <p class="pa-optional-hint">Para cuando necesitas un número <strong>antes</strong> de comprometerte:
        cuántos van a la excursión, cuántos llegan a la reunión, cuántos entran a la kermés.
        Llenas los datos, tocas <strong>Publicar</strong> y pegas el mensaje en el grupo de WhatsApp.
        Los padres contestan en veinte segundos —<strong>sin clave y sin instalar nada</strong>— y
        aquí ves el total: personas, <strong>buses que hacen falta</strong> y dinero que se recogería.</p>
      <p class="pa-optional-hint" style="margin-top:-2px"><strong>Toca una etiqueta</strong> para crear la convocatoria:</p>
      <div class="ad-meses ad-ctrl-plantillas">
        ${CONV_PLANTILLAS.map((p, i) =>
          `<button class="ad-mes-btn" data-cvplant="${i}">${p.icono} ${adEsc(p.nombre)}</button>`).join('')}
      </div>
    </div>
    ${lista.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🗂️ Mis convocatorias</div>
      ${lista.map(c => {
        const t = convTotales(c);
        const est = !c.codigo ? 'sin publicar'
          : c.cerrada ? 'cerrada'
          : t.total ? t.familias + ' familias · ' + t.personas + ' personas · ' + t.buses + ' bus' + (t.buses === 1 ? '' : 'es')
          : 'publicada · nadie ha contestado todavía';
        return `
        <button class="ad-colecta-row" data-cvid="${c.id}">
          <span class="ad-cr-txt"><strong>${c.icono || '📣'} ${adEsc(c.titulo || 'Sin título')}</strong><br>
            <small>${c.fecha ? adEsc(convFechaLarga(c.fecha)) + ' · ' : ''}${adEsc(est)}${c.codigo ? ' · código ' + adEsc(c.codigo) : ''}</small></span>
          <span class="ad-cr-arrow">›</span>
        </button>`;
      }).join('')}
    </div>` : ''}
    <div class="pa-card">
      <p class="pa-optional-hint">🔒 Lo que la nube guarda de cada respuesta es el nombre del alumno,
        su grado, cuántos van y el teléfono del encargado. <strong>Esos datos solo salen con tu
        código y tu PIN</strong>, que se quedan en este equipo. Quien tenga el enlace ve el evento y
        cuántos van en total, nunca quiénes.</p>
    </div>`;

  document.getElementById('cv-a-ctrl').addEventListener('click', () => { adConvCerrar(); renderAdmin(); });
  body.querySelectorAll('[data-cvplant]').forEach(b =>
    b.addEventListener('click', () => {
      const p = CONV_PLANTILLAS[+b.dataset.cvplant];
      const dd = adLoad();
      dd.convocatorias = convLista(dd);
      const c = convNueva(p, dd);
      dd.convocatorias.push(c);
      adSave(dd);
      _adConvId = c.id;
      renderAdmin();
    }));
  body.querySelectorAll('[data-cvid]').forEach(b =>
    b.addEventListener('click', () => { _adConvId = b.dataset.cvid; renderAdmin(); }));
}

/* ══════════════ PANTALLA: una convocatoria ══════════════ */
function convRenderUna(body, d) {
  const c = convUna(d, _adConvId);
  if (!c) { _adConvId = null; renderAdmin(); return; }
  const t = convTotales(c);
  const pub = !!c.codigo;

  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="cv-volver">🗂️ Mis convocatorias</button>
        <span class="nav-ruta-sep" aria-hidden="true">›</span>
        <span class="nav-ruta-actual" aria-current="page">estás aquí</span>
      </nav>
      <div class="pa-card-title">${c.icono || '📣'} ${adEsc(c.titulo || 'Convocatoria sin título')}</div>
      <p class="pa-optional-hint">${pub
        ? 'Publicada con el código <strong>' + adEsc(c.codigo) + '</strong>' +
          (c.cerrada ? ' · <strong>cerrada</strong>: ya nadie puede contestar.' : ' · abierta.')
        : 'Todavía <strong>no está publicada</strong>: llena los datos de abajo y toca «Publicar».'}</p>
    </div>

    ${pub ? convHtmlMensaje(c) + convHtmlConteo(c, t, d) : ''}
    ${convHtmlDatos(c, pub)}
    ${pub ? '' : `
    <div class="pa-card">
      <button class="pa-generate-btn" id="cv-publicar">🚀 Publicar y sacar el enlace</button>
      <p class="pa-optional-hint" style="margin-top:8px">Necesita internet <strong>una sola vez</strong>.
        Después el enlace sirve solo.</p>
    </div>`}

    <div class="pa-card">
      <button class="pa-generate-btn ad-btn-sec" id="cv-borrar">🗑️ Borrar esta convocatoria</button>
    </div>`;

  convEnganchar(body, c, d, t, pub);
}

function convHtmlMensaje(c) {
  return `
    <div class="pa-card">
      <div class="pa-card-title">📲 El mensaje, listo para pegar</div>
      <p class="pa-optional-hint">Este es el texto que van a leer las familias. Mándalo al grupo de la
        escuela y <strong>vuélvelo a mandar el día antes de que cierre</strong>: en un grupo grande, el
        mensaje de hoy está enterrado mañana.</p>
      <div class="ad-wa-previa">${adEsc(convMensaje(c)).replace(/\n/g, '<br>')}</div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="cv-wa">📲 Mandarlo por WhatsApp</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-copiar">📋 Copiar el mensaje</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-copiar-link">🔗 Copiar solo el enlace</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-abrir">👁️ Verlo como lo ve un padre</button>
      </div>
    </div>`;
}

function convHtmlConteo(c, t, d) {
  const r = (Array.isArray(c.resp) ? c.resp : []).slice();
  const si = r.filter(x => x.va);
  const no = r.filter(x => !x.va);
  /* Por grado, que es como se reparten los buses */
  const porG = {};
  si.forEach(x => {
    const k = adGradoSeccion(x.grado, x.seccion) || (x.grado || '—');
    porG[k] = porG[k] || { fam: 0, per: 0 };
    porG[k].fam++; porG[k].per += Number(x.personas) || 0;
  });
  const gk = Object.keys(porG).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  /* Motivos de los que no van: si la mitad dice «por el aporte», eso se
     puede arreglar; por eso se cuentan y no solo se listan. */
  const motivos = {};
  no.forEach(x => { const m = String(x.nota || '').trim(); if (m) motivos[m] = (motivos[m] || 0) + 1; });

  return `
    <div class="pa-card">
      <div class="pa-card-title">📊 Quién va</div>
      <div class="ad-cv-cifras">
        <div class="ad-cv-cif"><b>${t.personas}</b><span>personas</span></div>
        <div class="ad-cv-cif"><b>${t.familias}</b><span>familias</span></div>
        <div class="ad-cv-cif ad-cv-buses"><b>${t.buses}</b><span>bus${t.buses === 1 ? '' : 'es'} de ${t.cap}</span></div>
        ${Number(c.aporte) > 0 ? `<div class="ad-cv-cif ad-cv-plata"><b>${adEsc(adLps(t.dinero))}</b><span>se recogería</span></div>` : ''}
        ${t.no ? `<div class="ad-cv-cif ad-cv-no"><b>${t.no}</b><span>no van</span></div>` : ''}
      </div>
      <p class="pa-optional-hint" style="margin-top:10px">${convConsejo(t, c)}</p>
      ${Number(c.costoBus) > 0 ? `
      <p class="pa-optional-hint"><strong>${t.buses} × ${adEsc(adLps(c.costoBus))} = ${adEsc(adLps(t.costo))}</strong>
        de buses; se recogerían <strong>${adEsc(adLps(t.dinero))}</strong>.
        ${t.dinero >= t.costo
          ? 'Te sobran ' + adEsc(adLps(t.dinero - t.costo)) + '.'
          : '⚠️ Te faltarían <strong>' + adEsc(adLps(t.costo - t.dinero)) + '</strong>.'}</p>` : ''}
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="cv-refrescar">🔄 Traer las respuestas</button>
        ${r.length ? '<button class="pa-generate-btn ad-btn-sec" id="cv-copiar-lista">📋 Copiar la lista</button>' : ''}
        <button class="pa-generate-btn ad-btn-sec" id="cv-cerrar-conv">${c.cerrada ? '🔓 Volver a abrirla' : '🔒 Cerrar la lista'}</button>
      </div>
      <p class="pa-optional-hint" id="cv-refresco">${c.respFecha
        ? 'Última vez que se trajeron: ' + adEsc(c.respFecha)
        : 'Todavía no has traído las respuestas. Toca «Traer las respuestas».'}</p>
    </div>

    ${gk.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🏫 Por grado</div>
      <p class="pa-optional-hint">Así es como vas a repartir los asientos y a buscar acompañantes.</p>
      ${gk.map(k => `<div class="ad-gasto-row">
        <span><strong>${adEsc(k)}</strong> · ${porG[k].fam} familia${porG[k].fam === 1 ? '' : 's'}</span>
        <span><strong>${porG[k].per}</strong> persona${porG[k].per === 1 ? '' : 's'}</span></div>`).join('')}
    </div>` : ''}

    ${si.length ? `
    <div class="pa-card">
      <div class="pa-card-title">✅ Los que van (${si.length})</div>
      <p class="pa-optional-hint">Toca un teléfono para escribirle por WhatsApp —para el aporte o para
        avisarle un cambio de hora.</p>
      ${si.map(x => `<div class="ad-gasto-row">
        <span><strong>${adEsc(x.alumno)}</strong>${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}<br>
          <small>${x.personas} persona${x.personas === 1 ? '' : 's'}${Number(c.aporte) > 0
            ? ' · ' + adEsc(adLps(Number(c.aporte) * x.personas)) : ''}</small></span>
        <span>${x.tel ? '<button class="ad-al-code" data-cvtel="' + adEsc(x.tel) + '" data-cvnom="' + adEsc(x.alumno) + '">📲 ' + adEsc(x.tel) + '</button>' : ''}</span>
      </div>`).join('')}
      ${convHtmlPuentes(c, d)}
    </div>` : ''}

    ${no.length ? `
    <div class="pa-card">
      <div class="pa-card-title">🚫 Los que no van (${no.length})</div>
      ${Object.keys(motivos).length ? `<p class="pa-optional-hint">Por qué:
        ${Object.keys(motivos).map(m => '<strong>' + adEsc(m) + '</strong> (' + motivos[m] + ')').join(' · ')}.
        ${motivos['Por el aporte'] ? 'Si el dinero es lo que frena a varios, todavía estás a tiempo de bajarlo o de buscar ayuda.' : ''}</p>` : ''}
      ${no.map(x => `<div class="ad-gasto-row">
        <span>${adEsc(x.alumno)}${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}</span>
        <span><small>${adEsc(x.nota || '—')}</small></span></div>`).join('')}
    </div>` : ''}`;
}

/* Los dos puentes a lo que el maestro YA tiene aquí: el dinero se cobra
   en 💰 Economía y la lista de los que van se anota en ✅ Controles. */
function convHtmlPuentes(c, d) {
  return `
    <div class="ad-btn-row" style="margin-top:12px">
      ${Number(c.aporte) > 0 ? '<button class="pa-generate-btn ad-btn-sec" id="cv-a-eco">💰 Abrir la colecta del aporte</button>' : ''}
      <button class="pa-generate-btn ad-btn-sec" id="cv-a-control">✅ Anotar en un control los de mi grupo</button>
    </div>
    <p class="pa-optional-hint">La colecta nace en <strong>Economía</strong> con el aporte ya puesto, y el
      control marca a los alumnos <strong>de tu lista</strong> que dijeron que sí (a los de otros grados
      no los conoce nadie más que su maestro).</p>`;
}

function convHtmlDatos(c, pub) {
  const g = (c.gana || []).concat(['', '', '']).slice(0, 3);
  return `
    <div class="pa-card">
      <div class="pa-card-title">✏️ Los datos</div>
      <p class="pa-optional-hint">Lo que dice el mensaje y lo que ve el padre al abrir el enlace.
        ${pub ? 'Si cambias algo, toca <strong>Guardar</strong>: el enlace es el mismo y se actualiza solo.' : ''}</p>
      <div class="pa-field"><label>¿De qué se trata?</label>
        <input id="cv-titulo" class="pa-inp-field" value="${adEsc(c.titulo)}" placeholder="${adEsc(c.tituloPh || '')}"></div>
      <div class="pa-field"><label>El gancho — la razón por la que vale la pena ir</label>
        <textarea id="cv-gancho" class="pa-paste-area" rows="2" maxlength="220"
          placeholder="Este sábado sus hijos van a ver de cerca lo que hasta hoy solo han visto en el libro.">${adEsc(c.gancho)}</textarea></div>
      <div class="pa-field"><label>Lo que su hijo se lleva (tres renglones)</label>
        ${g.map((x, i) => `<input id="cv-gana-${i}" class="pa-inp-field" style="margin-bottom:6px"
          value="${adEsc(x)}" placeholder="Renglón ${i + 1}">`).join('')}</div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Día del evento</label>
          <input id="cv-fecha" class="pa-inp-field" type="date" value="${adEsc(c.fecha)}"></div>
        <div class="pa-field"><label>Último día para contestar</label>
          <input id="cv-limite" class="pa-inp-field" type="date" value="${adEsc(c.limite)}"></div>
      </div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Hora de salida</label>
          <input id="cv-hora" class="pa-inp-field" value="${adEsc(c.hora)}" placeholder="6:30 a. m."></div>
        <div class="pa-field"><label>Hora de regreso</label>
          <input id="cv-regreso" class="pa-inp-field" value="${adEsc(c.regreso)}" placeholder="3:00 p. m."></div>
      </div>
      <div class="pa-field"><label>¿A dónde van?</label>
        <input id="cv-lugar" class="pa-inp-field" value="${adEsc(c.lugar)}" placeholder="Museo Ferroviario de El Progreso"></div>
      <div class="pa-field"><label>¿Dónde se sube la gente?</label>
        <input id="cv-punto" class="pa-inp-field" value="${adEsc(c.punto)}" placeholder="Portón de la escuela"></div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Aporte por persona (L)</label>
          <input id="cv-aporte" class="pa-inp-field" type="number" min="0" step="1" value="${Number(c.aporte) || 0}"></div>
        <div class="pa-field"><label>¿Qué cubre ese aporte?</label>
          <input id="cv-incluye" class="pa-inp-field" value="${adEsc(c.incluye)}" placeholder="transporte, entrada"></div>
      </div>
      <div class="pa-field"><label>Cómo y cuándo se recibe el dinero</label>
        <input id="cv-cobro" class="pa-inp-field" value="${adEsc(c.cobro)}" placeholder="El aporte se recibe durante la semana, con el maestro."></div>
      <div class="pa-field"><label>Una advertencia o recordatorio (opcional)</label>
        <input id="cv-nota" class="pa-inp-field" value="${adEsc(c.nota)}" placeholder="Lleve agua, gorra y su almuerzo."></div>
      <div class="pa-row-2">
        <div class="pa-field"><label>¿A quién va dirigida?</label>
          <input id="cv-dirigido" class="pa-inp-field" value="${adEsc(c.dirigido)}" placeholder="Para las familias de toda la escuela"></div>
        <div class="pa-field"><label>Escuela</label>
          <input id="cv-escuela" class="pa-inp-field" value="${adEsc(c.escuela)}" placeholder="Nombre del centro"></div>
      </div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Tu nombre (lo ve el padre)</label>
          <input id="cv-maestro" class="pa-inp-field" value="${adEsc(c.maestro)}" placeholder="Prof. …"></div>
        <div class="pa-field"><label>Tu WhatsApp (con 504)</label>
          <input id="cv-wa" class="pa-inp-field" value="${adEsc(c.wa)}" placeholder="504 9999 8888" inputmode="tel"></div>
      </div>
      <p class="pa-optional-hint">Tu WhatsApp es la <strong>red de seguridad</strong>: si a un padre le
        falla el internet al contestar, la pantalla le manda su respuesta a ese número, ya escrita.</p>
      <div class="pa-row-2">
        <div class="pa-field"><label>Asientos de cada bus</label>
          <input id="cv-capacidad" class="pa-inp-field" type="number" min="5" step="1" value="${Number(c.capacidad) || CONV_CAP_DEF}"></div>
        <div class="pa-field"><label>Costo de cada bus (L, opcional)</label>
          <input id="cv-costobus" class="pa-inp-field" type="number" min="0" step="1" value="${Number(c.costoBus) || 0}"></div>
      </div>
      <div class="pa-field"><label>Tope de asientos que puedes ofrecer (opcional)</label>
        <input id="cv-cupos" class="pa-inp-field" type="number" min="0" step="1" value="${Number(c.cupos) || 0}">
        <p class="pa-optional-hint">Si lo pones, el padre ve <strong>cuántos asientos quedan</strong>. Eso
          mueve a los que dejan todo para el final; déjalo en 0 si no quieres enseñarlo.</p></div>
      <button class="pa-generate-btn" id="cv-guardar">💾 Guardar${pub ? ' y actualizar el enlace' : ''}</button>
    </div>`;
}

/* ── Eventos ── */
function convLeerCampos(c) {
  const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
  c.titulo = String(v('cv-titulo')).trim();
  c.gancho = String(v('cv-gancho')).trim();
  c.gana = [0, 1, 2].map(i => String(v('cv-gana-' + i)).trim());
  c.fecha = v('cv-fecha'); c.limite = v('cv-limite');
  c.hora = String(v('cv-hora')).trim(); c.regreso = String(v('cv-regreso')).trim();
  c.lugar = String(v('cv-lugar')).trim(); c.punto = String(v('cv-punto')).trim();
  c.aporte = Math.max(0, Number(v('cv-aporte')) || 0);
  c.incluye = String(v('cv-incluye')).trim(); c.cobro = String(v('cv-cobro')).trim();
  c.nota = String(v('cv-nota')).trim(); c.dirigido = String(v('cv-dirigido')).trim();
  c.escuela = String(v('cv-escuela')).trim(); c.maestro = String(v('cv-maestro')).trim();
  c.wa = String(v('cv-wa')).trim();
  c.capacidad = Math.max(5, Number(v('cv-capacidad')) || CONV_CAP_DEF);
  c.costoBus = Math.max(0, Number(v('cv-costobus')) || 0);
  c.cupos = Math.max(0, Number(v('cv-cupos')) || 0);
  return c;
}
function convGuardar(mut) {
  const dd = adLoad();
  dd.convocatorias = convLista(dd);
  const i = dd.convocatorias.findIndex(x => x.id === _adConvId);
  if (i < 0) return null;
  const c = dd.convocatorias[i];
  convLeerCampos(c);
  if (typeof mut === 'function') mut(c);
  adSave(dd);
  return c;
}

function convEnganchar(body, c, d, t, pub) {
  document.getElementById('cv-volver').addEventListener('click', () => { _adConvId = null; renderAdmin(); });

  document.getElementById('cv-guardar').addEventListener('click', async () => {
    const cc = convGuardar();
    if (!cc) return;
    if (cc.codigo) {
      const ok = await convRPC('metas_conv_publicar',
        { p_codigo: cc.codigo, p_pin: cc.pin, p_datos: convDatosPublicos(cc) });
      toast(ok === true ? '💾 Guardado y actualizado para los padres' : '💾 Guardado aquí · sin internet, súbelo luego');
    } else {
      toast('💾 Guardado');
    }
    renderAdmin();
  });

  const bPub = document.getElementById('cv-publicar');
  if (bPub) bPub.addEventListener('click', async () => {
    const cc = convGuardar();
    if (!cc) return;
    if (!cc.titulo) { await metasAlert('Escribe de qué se trata: es el título que leen las familias.', { icono: '📣', titulo: 'Falta el título' }); return; }
    if (!cc.fecha) { await metasAlert('Pon el día del evento. Sin fecha, el padre no sabe para cuándo se compromete.', { icono: '🗓️', titulo: 'Falta el día' }); return; }
    bPub.disabled = true; bPub.textContent = '⏳ Publicando…';
    let hecho = false;
    for (let i = 0; i < 3 && !hecho; i++) {
      const codigo = convAzar(4), pin = convAzar(6);
      const ok = await convRPC('metas_conv_crear',
        { p_codigo: codigo, p_pin: pin, p_datos: convDatosPublicos(cc) });
      if (ok === true) { convGuardar(x => { x.codigo = codigo; x.pin = pin; }); hecho = true; }
    }
    if (!hecho) {
      bPub.disabled = false; bPub.textContent = '🚀 Publicar y sacar el enlace';
      await metasAlert('No pude publicarla. Puede ser que no haya internet, o que todavía no hayas corrido **SUPABASE-CONVOCATORIA.sql** en tu proyecto de Supabase.\n\nLos datos ya están guardados aquí: cuando tengas señal, vuelve y toca «Publicar».',
        { icono: '☁️', titulo: 'No se pudo publicar' });
      return;
    }
    renderAdmin();
    toast('🚀 Publicada: ya puedes mandar el mensaje');
  });

  const bWa = document.getElementById('cv-wa');
  if (bWa) bWa.addEventListener('click', () => {
    const enc = encodeURIComponent(convMensaje(c));
    const movil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.open(movil ? 'https://wa.me/?text=' + enc : 'https://web.whatsapp.com/send?text=' + enc, '_blank');
  });
  const bCop = document.getElementById('cv-copiar');
  if (bCop) bCop.addEventListener('click', () => adCopiar(convMensaje(c),
    () => toast('📋 Mensaje copiado: pégalo en el grupo'), () => toast('No se pudo copiar')));
  const bCopL = document.getElementById('cv-copiar-link');
  if (bCopL) bCopL.addEventListener('click', () => adCopiar(convEnlace(c),
    () => toast('🔗 Enlace copiado'), () => toast('No se pudo copiar')));
  const bAbrir = document.getElementById('cv-abrir');
  if (bAbrir) bAbrir.addEventListener('click', () => window.open(convEnlace(c), '_blank'));

  const bRef = document.getElementById('cv-refrescar');
  if (bRef) bRef.addEventListener('click', () => convTraer(true));

  const bCer = document.getElementById('cv-cerrar-conv');
  if (bCer) bCer.addEventListener('click', async () => {
    const abrir = !!c.cerrada;
    if (!abrir && !await metasConfirm('Al cerrarla, quien abra el enlace verá que **ya no se puede contestar** y se le dirá que hable contigo.\n\nCiérrala cuando ya tengas tu número y hayas contratado los buses.',
      { icono: '🔒', titulo: 'Cerrar la lista', okTxt: 'Sí, cerrar' })) return;
    const cc = convGuardar(x => { x.cerrada = abrir ? 0 : 1; });
    const ok = await convRPC('metas_conv_publicar',
      { p_codigo: cc.codigo, p_pin: cc.pin, p_datos: convDatosPublicos(cc) });
    renderAdmin();
    toast(ok === true ? (abrir ? '🔓 Abierta otra vez' : '🔒 Cerrada') : '⚠️ Sin internet: se aplicará cuando haya señal');
  });

  const bCopLi = document.getElementById('cv-copiar-lista');
  if (bCopLi) bCopLi.addEventListener('click', () => adCopiar(convTextoLista(c, t),
    () => toast('📋 Lista copiada'), () => toast('No se pudo copiar')));

  body.querySelectorAll('[data-cvtel]').forEach(b =>
    b.addEventListener('click', () => {
      const tel = String(b.dataset.cvtel || '').replace(/\D/g, '');
      const txt = 'Buenas, le escribo por «' + (c.titulo || 'la salida') + '» de ' + b.dataset.cvnom + '.';
      const movil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      window.open(movil
        ? 'https://wa.me/' + tel + '?text=' + encodeURIComponent(txt)
        : 'https://web.whatsapp.com/send?phone=' + tel + '&text=' + encodeURIComponent(txt), '_blank');
    }));

  const bEco = document.getElementById('cv-a-eco');
  if (bEco) bEco.addEventListener('click', () => convAEconomia(c));
  const bCtrl = document.getElementById('cv-a-control');
  if (bCtrl) bCtrl.addEventListener('click', () => convAControl(c));

  document.getElementById('cv-borrar').addEventListener('click', async () => {
    if (!await metasConfirm('Se borra la convocatoria **de este equipo**. Las respuestas que ya dieron los padres se quedan en la nube hasta que caduquen solas.\n\n¿Borrarla?',
      { icono: '🗑️', titulo: 'Borrar convocatoria', okTxt: 'Sí, borrar' })) return;
    const dd = adLoad();
    adUndoGuardar('Borrar una convocatoria');
    dd.convocatorias = convLista(dd).filter(x => x.id !== _adConvId);
    adSave(dd);
    _adConvId = null;
    renderAdmin();
  });

  /* Al entrar, se traen las respuestas solas: el maestro abre esto justo
     para ver el número, no para tocar otro botón. UNA vez por visita —el
     traer vuelve a pintar la pantalla, y sin la marca se llamaría a sí
     mismo para siempre. */
  if (pub && !_adConvCargando && _adConvTraido !== c.id) {
    _adConvTraido = c.id;
    convTraer(false);
  }
}

async function convTraer(avisar) {
  const d0 = adLoad();
  const c0 = convUna(d0, _adConvId);
  if (!c0 || !c0.codigo) return;
  _adConvCargando = 1;
  const $r = document.getElementById('cv-refresco');
  if ($r) $r.textContent = '⏳ Trayendo las respuestas…';
  const filas = await convRPC('metas_conv_respuestas', { p_codigo: c0.codigo, p_pin: c0.pin });
  _adConvCargando = 0;
  if (!Array.isArray(filas)) {
    if ($r) $r.textContent = '⚠️ No se pudieron traer (sin internet). Se enseña lo último que se trajo.';
    if (avisar) toast('⚠️ Sin internet: no pude traer las respuestas');
    return;
  }
  const dd = adLoad();
  const cc = convUna(dd, _adConvId);
  if (!cc) return;
  cc.resp = filas.map(f => ({
    va: !!f.va, alumno: f.alumno || '', grado: f.grado || '', seccion: f.seccion || '',
    personas: Number(f.personas) || 0, tel: f.tel || '', nota: f.nota || '',
  }));
  const n = new Date();
  cc.respFecha = adFechaBonita(adHoy()) + ' a las ' +
    String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
  adSave(dd);
  renderAdmin();
  if (avisar) toast('🔄 ' + cc.resp.length + ' respuesta' + (cc.resp.length === 1 ? '' : 's'));
}

function convTextoLista(c, t) {
  const r = Array.isArray(c.resp) ? c.resp : [];
  const si = r.filter(x => x.va), no = r.filter(x => !x.va);
  const L = [];
  L.push((c.icono || '📣') + ' ' + (c.titulo || 'Convocatoria') + (c.fecha ? ' — ' + convFechaLarga(c.fecha) : ''));
  L.push('Personas: ' + t.personas + ' · Familias: ' + t.familias +
         ' · Buses de ' + t.cap + ': ' + t.buses + ' (sobran ' + t.sobran + ' asientos)');
  if (Number(c.aporte) > 0) L.push('Se recogería: ' + adLps(t.dinero));
  L.push('');
  L.push('VAN (' + si.length + '):');
  si.forEach((x, i) => L.push((i + 1) + '. ' + x.alumno +
    (x.grado ? ' — ' + adGradoSeccion(x.grado, x.seccion) : '') +
    ' — ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') + (x.tel ? ' — ' + x.tel : '')));
  if (no.length) {
    L.push('');
    L.push('NO VAN (' + no.length + '):');
    no.forEach((x, i) => L.push((i + 1) + '. ' + x.alumno +
      (x.grado ? ' — ' + adGradoSeccion(x.grado, x.seccion) : '') + (x.nota ? ' — ' + x.nota : '')));
  }
  return L.join('\n');
}

/* ── Puente 1: la colecta del aporte, en 💰 Economía ── */
async function convAEconomia(c) {
  if (!await metasConfirm('Se crea la colecta **«' + (c.titulo || 'Convocatoria') + '»** en 💰 Economía con ' +
    adLps(c.aporte) + ' por alumno. Ahí marcas quién ya dio, sale el saldo y se le avisa a la familia.\n\n¿La creo?',
    { icono: '💰', titulo: 'Colecta del aporte', okTxt: 'Sí, crearla' })) return;
  const dd = adLoad();
  dd.colectas = Array.isArray(dd.colectas) ? dd.colectas : [];
  dd.colectas.push({
    id: 'C' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    concepto: (c.titulo || 'Convocatoria').slice(0, 80),
    montoAlumno: Number(c.aporte) || 0,
    fecha: adHoy(), pagos: {}, pagosF: {}, gastos: [],
  });
  adSave(dd);
  toast('💰 Colecta creada en Economía');
}

/* ── Puente 2: los de MI grupo que van, anotados en ✅ Controles ──
   Solo los de la lista propia: a los alumnos de otros grados no los
   conoce nadie más que su maestro, y anotarlos aquí sería inventar
   gente en el registro del aula. */
async function convAControl(c) {
  const d = adLoad();
  const norm = s => String(s || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const si = (Array.isArray(c.resp) ? c.resp : []).filter(x => x.va);
  const datos = {};
  let hallados = 0;
  (d.lista || []).forEach(a => {
    const na = norm(a.nombre);
    if (!na) return;
    const m = si.find(x => {
      const nx = norm(x.alumno);
      return nx && (nx === na || nx.indexOf(na) === 0 || na.indexOf(nx) === 0);
    });
    if (m) { datos[a.num] = 1; hallados++; }
  });
  if (!hallados) {
    await metasAlert('Ninguno de los que contestaron coincide con un nombre de **tu lista**. Puede que hayan escrito el nombre distinto, o que los que van sean de otros grados.',
      { icono: '✅', titulo: 'Nadie de tu grupo' });
    return;
  }
  if (!await metasConfirm('Se crea el control **«' + (c.titulo || 'Convocatoria') + '»** con **' + hallados +
    '** alumno(s) de tu lista ya marcados. Los que no coincidan los marcas tú a mano.\n\n¿Lo creo?',
    { icono: '🎟️', titulo: 'Anotar en un control', okTxt: 'Sí, crearlo' })) return;
  const dd = adLoad();
  dd.controles = Array.isArray(dd.controles) ? dd.controles : [];
  dd.controles.push({
    id: 'K' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    icono: '🎟️', nombre: (c.titulo || 'Convocatoria').slice(0, 80), tipo: 'marca',
    fecha: adHoy(), datos, fam: 1, acum: 0, misionId: null, verbo: 'inscrito',
  });
  adSave(dd);
  toast('✅ Control creado con ' + hallados + ' marcados');
}

window.adRenderConvocatoria = adRenderConvocatoria;
