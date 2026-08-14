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

   Por qué vive en 📣 Comunicados: lo que sale de aquí es un mensaje a
   las familias, igual que un aviso. La diferencia es que el aviso
   INFORMA y se acabó, y la convocatoria PREGUNTA y espera respuesta.
   Estuvo primero en ✅ Controles —donde se anota quién sí y quién no—,
   pero ahí el maestro la buscaba entre sus listas de fichas y
   meriendas, que es lo contrario de lo que esto hace: un control se
   ANOTA (él ya sabe la respuesta) y una convocatoria se PREGUNTA
   (todavía no la sabe).

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

let _adConvOn = 0;               /* dentro de 📣 Convocatoria (subsección de Comunicados) */
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
   dentro de una convocatoria → la lista; en la lista → Comunicados. */
function adConvNivel() { return _adConvId ? 2 : (_adConvOn ? 1 : 0); }
function adConvAtras() {
  if (_adConvId) { _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; return true; }
  if (_adConvOn) { _adConvOn = 0; return true; }
  return false;
}
function adConvEntrar() { _adConvOn = 1; _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; }
function adConvCerrar() { _adConvOn = 0; _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; }
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
    limite: '', limiteHora: '', dirigido: 'Para las familias de toda la escuela',
    maestro: convMaestroDef(), wa: convWaDef(), escuela: (d && d.escuela) || '',
    capacidad: CONV_CAP_DEF, costoBus: 0, cupos: 0, arranque: 0,
    codigo: '', pin: '', cerrada: 0,
    /* cuántos boletos en blanco se han impreso ya: el lote que sigue
       arranca en el siguiente número para que no se repita un folio */
    blancos: 0,
    /* los que el maestro apunta él, porque su familia no tiene teléfono
       ni internet. Van aparte de `resp` a propósito: traer las respuestas
       reemplaza `resp` entero, y estos no se pueden perder por eso. */
    manual: [],
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
    limiteHora: c.limiteHora || '',
    maestro: c.maestro || '', wa: String(c.wa || '').replace(/\D/g, ''),
    escuela: c.escuela || '', cupos: Number(c.cupos) || 0,
    arranque: Math.max(0, Number(c.arranque) || 0),
    cerrada: c.cerrada ? '1' : '0',
  };
}

function convEnlace(c) {
  const base = location.origin + location.pathname.replace(/[^/]*$/, '');
  return (location.protocol === 'file:' ? 'https://metas.policastsapien.com/' : base) + CONV_PAGINA + '?c=' + c.codigo;
}

/* ── Los que apunta el maestro a mano ──
   Las familias sin teléfono y sin internet no contestan el enlace nunca:
   se lo dicen de palabra en el portón. Si esas se quedaran fuera de las
   cuentas, el maestro contrataría buses cortos para la mitad de su aula,
   que es el fallo contrario al del arranque y cuesta lo mismo.

   ⚠️ ESTO NO ES EL ARRANQUE, aunque se le parezca. El arranque es un
   número de empuje: gente que no existe, puesta para que la lista no
   arranque en cero, y por eso NO entra en estas cuentas. Los apuntados a
   mano son personas de verdad con nombre y apellido, así que SÍ entran:
   suben al bus, comen y pagan.

   Lo que sí se cuida es contarlas una sola vez. Si la madre le dijo al
   maestro que sí y DESPUÉS contestó el enlace, la fila queda por
   duplicado; se detecta con la misma huella que usa el servidor para
   corregir en vez de duplicar (nombre + grado + sección, normalizados).
   La de a mano se marca y se deja de contar, pero NO se borra sola: lo
   que el maestro escribió lo quita él. */
function convManual(c) {
  const enNube = {};
  (Array.isArray(c.resp) ? c.resp : []).forEach(x => {
    enNube[convHuella(x.alumno, x.grado, x.seccion)] = 1;
  });
  return (Array.isArray(c.manual) ? c.manual : []).map(x => Object.assign({}, x, {
    aMano: 1,
    repetido: enNube[convHuella(x.alumno, x.grado, x.seccion)] ? 1 : 0,
  }));
}
/* Todo el que va, venga de donde venga y sin repetir a nadie. Es lo que
   se lista, lo que se cuenta y lo que se imprime en boletos. */
function convTodas(c) {
  return (Array.isArray(c.resp) ? c.resp : []).concat(convManual(c).filter(x => !x.repetido));
}
window.convTodas = convTodas;

/* ── Las cuentas que decide el maestro ──
   ⚠️ Aquí NO entra el arranque (las personas que el maestro añade para
   que la lista no arranque en cero). Estas cifras son las que le hacen
   firmar un contrato de buses y contar dinero: si se les suma un número
   de empuje, contrata un bus para gente que no existe y lo paga de su
   bolsa. El arranque solo toca lo que VE EL PADRE, y en la pantalla del
   maestro se enseña aparte y rotulado.

   Los apuntados a mano SÍ entran: ver convManual. */
function convTotales(c) {
  const r = convTodas(c);
  const si = r.filter(x => x.va);
  const personas = si.reduce((a, x) => a + (Number(x.personas) || 0), 0);
  const cap = Math.max(5, Number(c.capacidad) || CONV_CAP_DEF);
  const buses = Math.ceil(personas / cap) || 0;
  const asientos = buses * cap;
  /* Lo que ve el padre sale SOLO del enlace: el servidor no sabe nada de
     los que el maestro apuntó en su cuaderno, así que el espejo tiene que
     enseñar esta cifra y no la de arriba. Su pantalla nunca le miente. */
  const nube = (Array.isArray(c.resp) ? c.resp : []).filter(x => x.va);
  const aMano = si.filter(x => x.aMano);
  return {
    familias: si.length, personas, no: r.filter(x => !x.va).length, total: r.length,
    cap, buses, asientos, sobran: asientos - personas,
    /* cuánta gente va montada en el ÚLTIMO bus: si son cuatro, ese bus
       cuesta completo por cuatro personas y conviene saberlo antes de
       pagarlo */
    ultimo: buses ? personas - (buses - 1) * cap : 0,
    dinero: personas * (Number(c.aporte) || 0),
    costo: buses * (Number(c.costoBus) || 0),
    nubeFamilias: nube.length,
    nubePersonas: nube.reduce((a, x) => a + (Number(x.personas) || 0), 0),
    manoFamilias: aMano.length,
    manoPersonas: aMano.reduce((a, x) => a + (Number(x.personas) || 0), 0),
    repetidos: convManual(c).filter(x => x.repetido).length,
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
  const hh = c.limiteHora ? ' a las ' + convHoraTxt(c.limiteHora) : '';
  const cierre = c.limite
    ? (dias === 0 ? '*HOY*' + (hh ? hh : ' es el último día')
      : dias === 1 ? 'tengo hasta *mañana*' + hh
      : 'tengo hasta el *' + convFechaLarga(c.limite) + hh + '*')
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

/* «16:00» se le enseña al padre como «4:00 p. m.»: el reloj de 24 horas
   se lee en el mismo aparato donde está la hora, pero en el papel y en
   el mensaje de WhatsApp confunde a quien no lo usa nunca. */
function convHoraTxt(hhmm) {
  const m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return '';
  const h = +m[1], ap = h < 12 ? 'a. m.' : 'p. m.';
  return ((h % 12) || 12) + ':' + m[2] + ' ' + ap;
}

/* ── El instante exacto en que se cierra ──
   La fecha sola no basta desde que hay reloj en la pantalla del padre:
   «11 de agosto» ¿es a las 00:00 o al final del día? Si se toma el
   principio, el día 11 el reloj ya está en cero y la madre que iba a
   contestar ese mismo día se encuentra la lista cerrada. Así que sin
   hora se cierra al ACABAR el día, y el maestro puede poner una hora
   suya («a las 4 pm cierro y llamo al del bus»). */
function convCierreMs(c) {
  const f = convFecha(c.limite);
  if (!f) return null;
  const m = String(c.limiteHora || '').match(/^(\d{1,2}):(\d{2})$/);
  if (m) f.setHours(+m[1], +m[2], 0, 0);
  else f.setHours(23, 59, 59, 999);
  return f.getTime();
}
/* «2 días y 4 horas», para el maestro. El del padre tiene segundos y
   late; este no, porque la pantalla del maestro no se repinta sola.
   Se redondea hacia ARRIBA igual que el reloj del padre: si no, esta
   pantalla diría «6 horas» donde la del padre marca 07:00:00, y lo que
   se está enseñando aquí es justo lo que el padre está viendo. */
function convFaltaTxt(ms) {
  if (ms == null) return '';
  if (ms <= 0) return 'ya se cerró';
  const min = Math.ceil(ms / 60000);
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), mi = min % 60;
  if (d) return d + ' día' + (d === 1 ? '' : 's') + ' y ' + h + ' hora' + (h === 1 ? '' : 's');
  if (h) return h + ' hora' + (h === 1 ? '' : 's') + ' y ' + mi + ' minuto' + (mi === 1 ? '' : 's');
  return mi + ' minuto' + (mi === 1 ? '' : 's');
}

/* ── La huella y el folio del boleto ──
   ⚠️ REGLA DE DOS ARCHIVOS: `convNorm` y `convFolio` tienen que dar
   EXACTAMENTE lo mismo que `norm` y `folioDe` de salida.html. El padre
   ve su folio en su teléfono y el maestro imprime el boleto con ese
   mismo folio desde aquí; si las dos cuentas se separan, el papel que
   entrega no es el que la madre lleva en la galería y el niño se queda
   discutiendo en el portón. Si cambia una, cambian las dos.

   El folio NO viaja por la nube: se calcula de lo que ya hay (el código
   de la convocatoria y la huella del alumno). Así sale igual en los dos
   lados y sirve aunque el maestro imprima sin internet. */
function convNorm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function convHuella(alumno, grado, seccion) {
  return (convNorm(alumno) + '|' + convNorm(grado) + '|' + convNorm(seccion)).slice(0, 120);
}
function convFolio(codigo, huella) {
  const s = String(codigo || '') + '|' + String(huella || '');
  let h = 0x811c9dc5;                     /* FNV-1a de 32 bits */
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  let n = h % 923521, out = '';           /* 31⁴: cuatro letras del alfabeto sin 0/O/1/I/L */
  for (let i = 0; i < 4; i++) { out = CONV_ALFA[n % 31] + out; n = Math.floor(n / 31); }
  return String(codigo || '') + '-' + out;
}
function convFolioDe(c, x) { return convFolio(c.codigo, convHuella(x.alumno, x.grado, x.seccion)); }
window.convFolio = convFolio;
window.convHuella = convHuella;

/* ══════════════ PANTALLA: mis convocatorias ══════════════ */
function adRenderConvocatoria(body, d) {
  if (_adConvId) { convRenderUna(body, d); return; }
  const lista = convLista(d).slice().reverse();
  body.innerHTML = `
    <div class="pa-card">
      <nav class="nav-ruta" aria-label="Dónde estás">
        <button class="nav-ruta-link" id="cv-a-ctrl">📣 Comunicados</button>
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
    b.addEventListener('click', () => { _adConvId = b.dataset.cvid; _convAvSalto = {}; renderAdmin(); }));
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
        <button class="pa-generate-btn" id="cv-wa-enviar">📲 Mandarlo por WhatsApp</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-copiar">📋 Copiar el mensaje</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-copiar-link">🔗 Copiar solo el enlace</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-abrir">👁️ Verlo como lo ve un padre</button>
      </div>
    </div>`;
}

/* ── Las dos cosas que empujan al padre que lo va dejando ──
   Un enlace abierto sin nada más que la información no mueve a nadie:
   la madre lo lee, dice «ahorita contesto» y el viernes el maestro
   sigue sin número. Lo que sí mueve son dos: que se vea que otros ya
   dijeron que sí, y que se vea el tiempo bajando.

   Aquí el maestro ve las dos como las ve el padre, y —esto es lo
   importante— con la cifra REAL al lado. Su pantalla nunca le miente:
   la que empuja es la del enlace, la que él usa para contratar es
   esta. */
function convHtmlEmpuje(c, t) {
  const arr = Math.max(0, Number(c.arranque) || 0);
  const ms = convCierreMs(c);
  const falta = ms == null ? null : ms - Date.now();
  const cupos = Number(c.cupos) || 0;
  /* Del ENLACE, no del total: los apuntados a mano no viajaron a la nube,
     así que el padre no los ve y aquí tampoco pueden salir. */
  const ven = t.nubePersonas + arr;
  return `
    <div class="ad-cv-espejo">
      <div class="ad-cv-espejo-t">👀 Lo que ve el padre al abrir el enlace</div>
      <div class="ad-cv-espejo-g">
        <span><b>${ven}</b> persona${ven === 1 ? '' : 's'} confirmada${ven === 1 ? '' : 's'}</span>
        ${cupos ? `<span>${cupos - ven > 0 ? 'quedan <b>' + (cupos - ven) + '</b> de ' + cupos + ' asientos'
          : '<b>lleno</b>: los ' + cupos + ' asientos tomados'}</span>` : ''}
        ${falta == null ? '<span>sin reloj: no le pusiste último día</span>'
          : falta <= 0 ? '<span>⛔ el reloj llegó a cero: ya no puede contestar</span>'
          : `<span>⏳ el reloj le dice que faltan <b>${adEsc(convFaltaTxt(falta))}</b></span>`}
      </div>
      ${arr ? `<p class="pa-optional-hint" style="margin:6px 0 0">De esas ${ven}, <strong>${arr} las pusiste tú</strong>
        como arranque y ${t.nubePersonas} contestaron por el enlace. Tus buses y tu dinero se calculan
        con las que van de verdad, nunca con las ${ven}.</p>` : ''}
      ${t.manoPersonas ? `<p class="pa-optional-hint" style="margin:6px 0 0">Tus <strong>${t.manoPersonas}
        apuntada${t.manoPersonas === 1 ? '' : 's'} a mano</strong> no salen aquí: el enlace no las conoce.
        Arriba sí cuentan, que es donde importa.</p>` : ''}
    </div>`;
}

function convHtmlConteo(c, t, d) {
  /* Enlace y a mano en UNA sola lista: en el portón el maestro no tiene
     dos listas, tiene una, y quien va, va. De dónde salió cada uno se
     enseña con una marca en su renglón. */
  const r = convTodas(c);
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
      ${convHtmlEmpuje(c, t)}
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
        <span><strong>${adEsc(x.alumno)}</strong>${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}${
          x.aMano ? ' <span class="ad-cv-tag">🖊️ a mano</span>' : ''}<br>
          <small>🎟️ ${adEsc(convFolioDe(c, x))} · ${x.personas} persona${x.personas === 1 ? '' : 's'}${Number(c.aporte) > 0
            ? ' · ' + adEsc(adLps(Number(c.aporte) * x.personas)) : ''}</small>${x.aMano ? `
          <span class="ad-cv-mini">
            <button data-cvmper="${adEsc(x.id)}" data-d="-1" aria-label="Una persona menos">−</button>
            <button data-cvmper="${adEsc(x.id)}" data-d="1" aria-label="Una persona más">+</button>
            <button data-cvmdel="${adEsc(x.id)}" aria-label="Quitar de la lista">🗑</button>
          </span>` : ''}</span>
        <span>${x.tel ? '<button class="ad-al-code" data-cvtel="' + adEsc(x.tel) +
          '" data-cvhuella="' + adEsc(convHuella(x.alumno, x.grado, x.seccion)) + '">📲 ' + adEsc(x.tel) + '</button>' : ''}</span>
      </div>`).join('')}
      ${convHtmlPuentes(c, d)}
    </div>` : ''}

    ${r.length ? convHtmlAvisos(c) : ''}

    ${convHtmlAMano(c, t, d)}

    ${convHtmlBoletos(c, si)}

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

/* ══════════════ 🎟️ EL BOLETO ══════════════
   Quien contesta por el enlace se queda con un folio en la pantalla y
   con la promesa de que tiene el asiento apartado. El maestro se queda
   con una lista. Entre las dos cosas falta el papel: el día de la
   salida, en el portón, con cuarenta familias apuradas y un bus
   esperando, «yo contesté» no se puede comprobar y nadie va a ponerse a
   buscar un nombre en un teléfono.

   Por eso el boleto se IMPRIME y se entrega CUANDO SE RECIBE EL APORTE:
   es a la vez el recibo de esos cien lempiras y el pase para subir. El
   folio es el que la madre ya tiene guardado en su galería, así que los
   dos papeles —el suyo y el del maestro— dicen lo mismo.

   Cuatro decisiones:
   · UN boleto por FAMILIA, no por persona. Lleva escrito para cuántos
     vale. Uno por persona triplica el papel y en el portón se cuenta
     igual: la madre enseña el suyo y suben los que dice.
   · Con COLILLA. La parte de la izquierda se recorta y se la queda el
     maestro con la firma de quien pagó: es su respaldo cuando alguien
     diga que ya dio el dinero.
   · TIRA ANCHA de página completa, no cuadro. Salió primero en dos
     columnas y quedaba casi cuadrado, con un hueco en medio que se ve
     en el papel: un boleto no tiene esa forma y no se lee de un
     vistazo. La tira se llena de lado a lado —colilla, quién es, y el
     folio a la derecha—, y de paso se recorta con seis tijeretazos
     rectos de lado a lado en vez de una cuadrícula.
   · SIETE por hoja carta. Con 42 familias son 6 hojas. Cada boleto que
     no cupiera en su hoja son 6 hojas más de tinta y de tiempo, así
     que el alto está medido y se comprueba con
     _dev/verifica-boletos.js, que cuenta las páginas del PDF y vigila
     que la tira siga siendo más ancha que alta.

   ── Y LOS BOLETOS EN BLANCO ──
   El enlace no llega a todo el mundo, y no por descuido: en el aula hay
   familias SIN teléfono y SIN internet. Esas no van a contestar nunca;
   le dicen al maestro «yo mando a la niña» en el portón y él las apunta
   en su cuaderno. Si el boleto solo saliera de las respuestas de la
   nube, esas familias se quedarían sin recibo del dinero que pagaron y
   sin pase para subir — justo las que menos pueden reclamar después.

   Por eso el mismo botón imprime tiras EN BLANCO: con el evento, la
   fecha y el folio ya puestos, y con rayas para escribir a mano el
   nombre, el grupo y para cuántos vale. Se entregan igual que los
   otros, y la colilla firmada vale igual de respaldo.

   ⚠️ EL FOLIO SIGUE SIENDO ÚNICO. Los blancos se numeran corridos
   (M01, M02…) y el contador se guarda en la convocatoria, así que el
   segundo lote arranca donde acabó el primero. Dos boletos con el mismo
   folio en el portón son exactamente el problema que el folio existe
   para evitar. Y no chocan nunca con los de la nube: aquellos son
   cuatro letras de CONV_ALFA, que no tiene ni 0 ni 1. */
function convHtmlBoletos(c, si) {
  const hojas = Math.ceil(si.length / 7);
  const desde = convBlancoDesde(c);
  return `
    <div class="pa-card">
      <div class="pa-card-title">🎟️ Los boletos</div>
      ${si.length ? `
      <p class="pa-optional-hint">Uno por familia, con lo que ya contestaron puesto. Recorta, y entrégale
        el suyo a cada una <strong>cuando recibas el aporte</strong>: el boleto es el recibo y el pase para
        subir al bus. La colilla de la izquierda la firmas y te la quedas tú.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="cv-boletos">🎟️ Imprimir los ${si.length} boletos</button>
      </div>
      <p class="pa-optional-hint">Salen <strong>${hojas} hoja${hojas === 1 ? '' : 's'}</strong> (siete por hoja).</p>`
      : `<p class="pa-optional-hint">Todavía no ha contestado nadie por el enlace, pero los boletos
        <strong>en blanco</strong> ya los puedes imprimir.</p>`}

      <div class="ad-cv-blancos">
        <div class="ad-cv-blancos-t">🖊️ En blanco — para llevar en el bolsillo</div>
        <p class="pa-optional-hint" style="margin:6px 0 0">Para cuando te apuntan y te pagan
          <strong>en el momento</strong>, en el portón o en el recreo, sin la aplicación delante. Salen con
          el evento, la fecha y el <strong>folio ya impresos</strong>, y con rayas para escribir a mano el
          nombre, el grupo y para cuántos vale. Entregas el papel ahí mismo y nadie se queda sin recibo.</p>
        <p class="pa-optional-hint">Si ya tienes el teléfono en la mano, es mejor
          <strong>🖊️ Apuntar a mano</strong> aquí arriba: así cuenta en los buses y le sale su boleto
          lleno con los demás.</p>
        <div class="pa-field" style="margin-top:10px"><label>¿Cuántos necesitas?</label>
          <input id="cv-blancos-n" class="pa-inp-field" type="number" min="1" max="210" step="1"
            value="14" style="max-width:120px" inputmode="numeric"></div>
        <p class="pa-optional-hint" id="cv-blancos-hojas" style="margin:-4px 0 8px"></p>
        <div class="ad-btn-row">
          <button class="pa-generate-btn ad-btn-sec" id="cv-blancos">🖊️ Imprimir boletos en blanco</button>
        </div>
        <p class="pa-optional-hint">El próximo lote empieza en el folio
          <strong>${adEsc(convFolioBlanco(c, desde))}</strong> y sigue corrido: si el jueves imprimes otra
          tanda, no se te repite ninguno.</p>
        <p class="pa-optional-hint">⚠️ Un boleto en blanco <strong>no cuenta solo</strong>: el papel ya lo
          tiene la familia, pero los buses se contratan con lo de arriba. Al volver al aula, pasa esas
          colillas a <strong>🖊️ Apuntar a mano</strong> y listo.</p>
      </div>
    </div>`;
}

/* Del contador guardado sale el primer número del lote que sigue. Se
   guarda en la convocatoria (no en una variable suelta) porque el
   maestro imprime hoy diez y el jueves seis más, cerrando la aplicación
   en medio. */
function convBlancoDesde(c) { return Math.max(0, Number(c.blancos) || 0) + 1; }
/* El folio del boleto en blanco. La «M» es de «a mano», y el número va
   con dos cifras para que se lea de un vistazo entre cuarenta papeles.
   No puede chocar con un folio de la nube: aquellos son CÓDIGO + cuatro
   letras de CONV_ALFA (sin 0/O/1/I/L), y este lleva dígitos. */
function convFolioBlanco(c, n) {
  return String(c.codigo || '') + '-M' + String(n).padStart(2, '0');
}
window.convFolioBlanco = convFolioBlanco;

function convImprimirBoletos(c) {
  /* Enlace y a mano, en el mismo lote: el que apuntó el maestro sube al
     mismo bus y necesita el mismo papel. */
  const si = convTodas(c).filter(x => x.va);
  if (!si.length) { toast('Todavía no hay nadie que vaya'); return; }
  const orden = si.slice().sort((a, b) =>
    String(a.grado || '').localeCompare(String(b.grado || ''), 'es', { numeric: true }) ||
    String(a.alumno || '').localeCompare(String(b.alumno || ''), 'es'));
  const ap = Number(c.aporte) || 0;
  const cuando = convFechaLarga(c.fecha) + (c.hora ? ' · ' + c.hora : '');
  const boleto = x => {
    const total = ap * (Number(x.personas) || 0);
    return `
    <div class="bo">
      <div class="bo-col">
        <div class="bo-col-t">COLILLA · para el maestro</div>
        <div class="bo-col-f">${adEsc(convFolioDe(c, x))}</div>
        <div class="bo-col-n">${adEsc(x.alumno)}</div>
        <div class="bo-col-p">${adEsc(adGradoSeccion(x.grado, x.seccion))} ·
          ${x.personas} persona${x.personas === 1 ? '' : 's'}${ap ? ' · recibí ' + adEsc(adLps(total)) : ''}</div>
        <div class="bo-firma">firma de quien paga</div>
      </div>
      <div class="bo-cuerpo">
        <div class="bo-tit">${adEsc((c.icono || '🎟️') + ' ' + (c.titulo || 'Salida'))}</div>
        <div class="bo-sub">${adEsc(cuando)}${c.punto ? ' · sube en ' + adEsc(c.punto) : ''}</div>
        <div class="bo-nom">${adEsc(x.alumno)}<span class="bo-gr">${adEsc(adGradoSeccion(x.grado, x.seccion))}</span></div>
        <div class="bo-pie">${ap
          ? 'Entregado al recibir el aporte. Presente este boleto para subir.'
          : 'Presente este boleto para subir.'}${c.escuela ? ' · ' + adEsc(c.escuela) : ''}</div>
      </div>
      <div class="bo-cajas">
        <div class="bo-caja-i"><b>${x.personas}</b><span>persona${x.personas === 1 ? '' : 's'}</span></div>
        <div class="bo-caja-i"><b>${ap ? adEsc(adLps(total)) : 'Sin costo'}</b><span>${ap ? 'aporte' : ''}</span></div>
        <div class="bo-caja-i bo-folio"><b>${adEsc(convFolioDe(c, x))}</b><span>folio</span></div>
      </div>
    </div>`;
  };
  convBoletosAbrir(c, orden.map(boleto).join(''),
    `<p>Recorte por la raya —seis tiras rectas por hoja—. Entregue cada boleto
<strong>cuando reciba el aporte</strong>: es el recibo de la familia y su pase para subir al bus.
La colilla de la izquierda la firma quien paga y se la queda usted.</p>`);
}

/* ── Los boletos EN BLANCO ──
   Misma tira, mismo tamaño y misma colilla: en el portón nadie tiene que
   notar que este se llenó a mano. Lo único que cambia es que el nombre,
   el grupo y las personas van en RAYAS para escribir encima, y que el
   folio se imprime corrido en vez de calcularse del nombre.

   Las rayas van con su rótulo DEBAJO y chiquito: encima se escribe, y un
   rótulo grande le come el sitio al lápiz. El maestro escribe lo mismo
   en las dos mitades —la suya y la de la familia— y por eso el folio ya
   viene impreso en las dos: es lo que empareja los dos papeles cuando
   alguien discuta en el portón. */
function convImprimirBlancos(c, cuantos, desde) {
  const n = Math.max(1, Math.min(210, Math.round(Number(cuantos) || 0)));
  const d0 = Math.max(1, Math.round(Number(desde) || 1));
  const ap = Number(c.aporte) || 0;
  const cuando = convFechaLarga(c.fecha) + (c.hora ? ' · ' + c.hora : '');
  const tira = i => {
    const folio = adEsc(convFolioBlanco(c, d0 + i));
    return `
    <div class="bo bo-bl">
      <div class="bo-col">
        <div class="bo-col-t">COLILLA · para el maestro</div>
        <div class="bo-col-f">${folio}</div>
        <div class="bo-lin"></div><span class="bo-rot">alumno</span>
        <div class="bo-lin"></div><span class="bo-rot">grupo · personas · L</span>
        <div class="bo-firma">firma de quien paga</div>
      </div>
      <div class="bo-cuerpo">
        <div class="bo-tit">${adEsc((c.icono || '🎟️') + ' ' + (c.titulo || 'Salida'))}</div>
        <div class="bo-sub">${adEsc(cuando)}${c.punto ? ' · sube en ' + adEsc(c.punto) : ''}</div>
        <div class="bo-nomb">
          <div class="bo-nomb-a"><div class="bo-lin bo-lin-g"></div><span class="bo-rot">nombre del alumno</span></div>
          <div class="bo-nomb-b"><div class="bo-lin bo-lin-g"></div><span class="bo-rot">grupo</span></div>
        </div>
        <div class="bo-pie">${ap
          ? 'Entregado al recibir el aporte. Presente este boleto para subir.'
          : 'Presente este boleto para subir.'}${c.escuela ? ' · ' + adEsc(c.escuela) : ''}</div>
      </div>
      <div class="bo-cajas">
        <div class="bo-caja-i"><b class="bo-hueco"></b><span>personas</span></div>
        <div class="bo-caja-i"><b class="bo-hueco">${ap ? 'L' : ''}</b><span>${ap ? 'aporte' : 'sin costo'}</span></div>
        <div class="bo-caja-i bo-folio"><b>${folio}</b><span>folio</span></div>
      </div>
    </div>`;
  };
  let tiras = '';
  for (let i = 0; i < n; i++) tiras += tira(i);
  convBoletosAbrir(c, tiras,
    `<p>Estos boletos van <strong>sin nombre</strong>: son para apuntar y cobrar en el momento, sin la
aplicación delante. Escriba el nombre y el grupo <strong>en las dos mitades</strong> —el folio ya viene
impreso en las dos—, entregue la parte ancha al recibir el aporte y quédese con la colilla firmada.</p>
<p>⚠️ Estos <strong>no están en el conteo de la pantalla</strong>. Al volver al aula, pase estas colillas
a <strong>🖊️ Apuntar a mano</strong>: ahí sí cuentan para los buses y para el dinero.</p>`);
}

/* La hoja es la misma para los dos: mismo tamaño de tira, mismas siete
   por hoja y mismo recorte recto. Se escribe UNA vez para que no se
   arreglen los milímetros en un sitio y se queden torcidos en el otro. */
function convBoletosAbrir(c, tiras, aviso) {
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Boletos — ${adEsc(c.titulo || 'Salida')}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff;padding:0;}
/* 10 mm de margen deja 196 × 259 mm útiles en carta. Una sola columna de
   tiras de 34 mm: SIETE por hoja (238 mm con sus separaciones) y sobran
   21 mm, así que sigue cabiendo aunque el navegador ignore el @page y
   ponga los suyos. Con 42 familias son 6 hojas.
   La tira es ancha a propósito —196 × 34 mm, casi seis a uno—: es la
   forma de un boleto, se llena de lado a lado sin dejar huecos y se
   recorta con seis tijeretazos rectos de lado a lado. */
@page{size:letter;margin:10mm;}
.grid{display:grid;grid-template-columns:1fr;gap:3mm;}
.bo{display:flex;height:34mm;border:1.6px dashed #444;border-radius:3mm;overflow:hidden;
    page-break-inside:avoid;break-inside:avoid;}
.bo-col{width:34mm;flex:0 0 34mm;border-right:1.6px dashed #888;padding:2.5mm 2.5mm;
    background:#f7f7f7;overflow:hidden;display:flex;flex-direction:column;}
.bo-col-t{font-size:6px;font-weight:bold;color:#555;text-transform:uppercase;letter-spacing:.2px;line-height:1.2;}
.bo-col-f{font-size:11.5px;font-weight:900;font-family:'Courier New',monospace;margin:1mm 0 .8mm;}
.bo-col-n{font-size:7.5px;line-height:1.25;font-weight:bold;}
.bo-col-p{font-size:7px;line-height:1.3;margin-top:.6mm;color:#333;}
.bo-firma{border-top:1px solid #999;margin-top:auto;padding-top:.8mm;font-size:6px;color:#666;text-align:center;}
/* Centrado, no repartido de arriba abajo: el texto son cuatro renglones
   cortos y pegando el pie al borde de abajo queda un hueco en medio que
   en el papel se ve como un boleto a medio hacer. */
.bo-cuerpo{flex:1;padding:2.5mm 4mm;display:flex;flex-direction:column;justify-content:center;min-width:0;}
.bo-tit{font-size:11px;font-weight:900;line-height:1.2;}
.bo-sub{font-size:8px;color:#444;margin-top:.8mm;line-height:1.3;}
/* El nombre es lo que el maestro busca al repartir cuarenta boletos, así
   que va lo más grande que quepa; el grupo se le pega al lado en vez de
   gastar un renglón suyo. */
.bo-nom{font-size:15px;font-weight:900;margin-top:1.6mm;line-height:1.2;}
.bo-gr{font-size:10px;font-weight:bold;color:#c2410c;margin-left:2mm;white-space:nowrap;}
.bo-pie{font-size:6.5px;color:#555;margin-top:1.6mm;line-height:1.3;}
.bo-cajas{width:58mm;flex:0 0 58mm;display:flex;gap:1.5mm;align-items:center;padding:0 3mm 0 1mm;}
.bo-caja-i{flex:1;border:1.2px solid #ddd;border-radius:2mm;padding:1.5mm .5mm;text-align:center;min-width:0;}
.bo-caja-i b{display:block;font-size:12px;font-weight:900;line-height:1.1;}
.bo-caja-i span{font-size:6px;text-transform:uppercase;color:#666;letter-spacing:.2px;}
/* El folio en una sola pieza: partido en dos renglones se lee como dos
   cosas distintas y se dicta mal por teléfono. */
.bo-folio b{font-family:'Courier New',monospace;font-size:10px;white-space:nowrap;}
/* ── Las rayas del boleto en blanco ──
   El alto está medido para que quepa un lápiz encima: por debajo de 4 mm
   el nombre se sale por arriba de la raya y el papel queda sucio. El
   rótulo va debajo, a 5,5 px, porque lo lee el maestro una vez y no
   puede robarle sitio a lo que se escribe. */
.bo-lin{border-bottom:1px solid #999;height:4.6mm;margin-top:.6mm;}
.bo-rot{display:block;font-size:5.5px;line-height:1.3;color:#888;text-transform:uppercase;letter-spacing:.2px;}
/* El nombre se escribe grande: es lo que se lee en el portón con el bus
   andando, igual que en el boleto impreso. */
.bo-lin-g{height:7mm;border-bottom:1.4px solid #666;}
.bo-nomb{display:flex;gap:3mm;margin-top:1mm;}
.bo-nomb-a{flex:1;min-width:0;}
.bo-nomb-b{width:24mm;flex:0 0 24mm;}
.bo-bl .bo-pie{margin-top:1mm;}
/* La cifra tampoco viene puesta: la escribe el maestro al recibir el
   aporte, así que la caja lleva raya en vez de número. */
.bo-hueco{border-bottom:1.2px solid #999;min-height:4.6mm;text-align:left;padding-left:1mm;color:#777;}
.noprint{padding:6mm 6mm 0;}
.noprint button{padding:8px 16px;font-size:14px;font-weight:bold;cursor:pointer;}
.noprint p{font-size:12px;color:#444;margin-top:3mm;max-width:170mm;line-height:1.5;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()">🖨️ Imprimir los boletos</button>
${aviso}</div>
<div class="grid">${tiras}</div>
</body></html>`;
  const w = (typeof adPrintAbrir === 'function') ? adPrintAbrir(html) : window.open('', '_blank');
  if (w && typeof adPrintAbrir !== 'function') { w.document.write(html); w.document.close(); }
}

/* ══════════════ 🖊️ APUNTAR A MANO ══════════════
   La otra mitad del problema de los boletos en blanco. El papel resuelve
   que la familia sin teléfono se lleve su recibo; esto resuelve que
   ADEMÁS entre en las cuentas, que es lo que decide cuántos buses se
   contratan y cuánto dinero se espera recoger. Con el papel solo, el
   maestro tenía que sumar colillas a mano el viernes por la noche.

   Tres decisiones:

   · Se guardan APARTE de `resp` (en `c.manual`). Traer las respuestas
     reemplaza `resp` entero con lo que venga de la nube; si estos
     vivieran ahí, el maestro los perdería la primera vez que tocara
     «Traer las respuestas» —y no se enteraría hasta el portón.
   · La huella es la MISMA que usa el servidor (nombre + grado +
     sección). Así, si la madre acaba contestando el enlace después, la
     fila de a mano se reconoce como la misma persona y deja de contar.
     Sin eso, el que se apunta dos veces paga un bus de más.
   · El grado se toca, no se escribe, y sale ya puesto el del maestro:
     casi todos los que apunta son de su propio grado, y en un teléfono
     cada campo que se escribe es un campo donde se abandona. */
const CONV_GRADOS = ['Prebásica', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Media'];
/* Lo que el maestro dejó puesto la última vez: apuntar a cinco alumnos
   del mismo grado no puede costar cinco toques en la misma pastilla. */
let _convAmG = null;

function convHtmlAMano(c, t, d) {
  const rep = convManual(c).filter(x => x.repetido);
  const g = _convAmG != null ? _convAmG : ((d && d.grado) || '');
  const lista = (d && Array.isArray(d.lista)) ? d.lista.filter(a => a.nombre) : [];
  return `
    <div class="pa-card">
      <div class="pa-card-title">🖊️ Apuntar a mano</div>
      <p class="pa-optional-hint">Para la familia <strong>sin teléfono y sin internet</strong>, que te lo
        dice de palabra. Lo que apuntes aquí <strong>cuenta igual que una respuesta del enlace</strong>:
        entra en las personas, en los buses y en el dinero de arriba, y se le imprime su boleto con los
        demás. ${t.manoFamilias ? 'Llevas <strong>' + t.manoFamilias + ' familia' +
        (t.manoFamilias === 1 ? '' : 's') + '</strong> apuntada' + (t.manoFamilias === 1 ? '' : 's') +
        ' así (' + t.manoPersonas + ' persona' + (t.manoPersonas === 1 ? '' : 's') + ').' : ''}</p>

      <div class="pa-field"><label>Nombre del alumno</label>
        <input id="cv-am-nom" class="pa-inp-field" list="cv-am-lista" autocomplete="off"
          placeholder="Nombre y apellidos">
        ${lista.length ? `<datalist id="cv-am-lista">${lista.map(a =>
          '<option value="' + adEsc(a.nombre) + '">').join('')}</datalist>` : ''}</div>
      <div class="pa-field"><label>Grado</label>
        <div class="ad-meses" style="margin:4px 0 0">${CONV_GRADOS.map(x =>
          `<button type="button" class="ad-mes-btn${x === g ? ' ad-mes-on' : ''}" data-cvamg="${adEsc(x)}"
            >${x === 'Prebásica' || x === 'Media' ? adEsc(x) : adEsc(x) + 'º'}</button>`).join('')}</div></div>
      <div class="pa-row-2">
        <div class="pa-field"><label>Sección</label>
          <input id="cv-am-sec" class="pa-inp-field" value="${adEsc((d && d.seccion) || '')}" placeholder="A, B, 1…"></div>
        <div class="pa-field"><label>¿Cuántas personas van?</label>
          <input id="cv-am-per" class="pa-inp-field" type="number" min="1" max="12" step="1" value="1" inputmode="numeric"></div>
      </div>
      <div class="pa-field"><label>Teléfono del encargado (opcional)</label>
        <input id="cv-am-tel" class="pa-inp-field" placeholder="9999 8888" inputmode="tel">
        <p class="pa-optional-hint">Si lo tienes, ponlo: aunque no use internet, un mensaje le llega.</p></div>
      <button class="pa-generate-btn" id="cv-am-add">➕ Apuntar</button>
      <p class="pa-optional-hint">Se apuntan <strong>personas</strong>, no solo el alumno: si va el niño
        con su mamá, son 2. El bus no distingue.</p>

      ${rep.length ? `
      <div class="ad-cv-repes">
        <div class="ad-cv-blancos-t">⚠️ ${rep.length} apuntado${rep.length === 1 ? '' : 's'} que además contestó el enlace</div>
        <p class="pa-optional-hint" style="margin:6px 0 8px">${rep.length === 1 ? 'Esta familia' : 'Estas familias'}
          contestaron después por su cuenta, así que <strong>ya ${rep.length === 1 ? 'está' : 'están'} en la
          lista de arriba</strong>. No ${rep.length === 1 ? 'se cuenta' : 'se cuentan'} dos veces, pero
          quítal${rep.length === 1 ? 'a' : 'as'} de aquí para no confundirte.</p>
        ${rep.map(x => `<div class="ad-gasto-row">
          <span>${adEsc(x.alumno)}${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}</span>
          <span><button class="ad-al-del" data-cvmdel="${adEsc(x.id)}" aria-label="Quitar de los apuntados a mano">✕</button></span>
        </div>`).join('')}
      </div>` : ''}
    </div>`;
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

/* ══════════════ 📲 AVISARLES A LOS QUE YA CONTESTARON ══════════════

   La convocatoria PREGUNTA y ahí se acaba. Pero entre el «sí voy» y el
   bus pasan cinco días, y en esos cinco días siempre hay algo que
   decirle a las familias: que vengan por su boleto, que la hora cambió,
   que falta el aporte, que llovió y se pasa para el otro sábado.

   Eso se venía haciendo escribiendo el mismo mensaje cuarenta veces,
   copiando a mano el nombre de cada alumno. A la décima el maestro se
   cansa y lo manda al grupo de la escuela, donde la mitad no lo lee y
   la otra mitad no sabe si es para ella. Aquí el aviso se escribe UNA
   vez con marcadores ({alumno}, {grupo}, {folio}…) y la pantalla lo
   personaliza para cada familia y le va abriendo el chat.

   ⚠️ POR QUÉ UNO POR UNO Y NO DE UN GOLPE. WhatsApp no deja mandarle a
   cuarenta números desde una página web —nadie puede, sin pagar su
   servicio de empresa— y prometerlo sería mentirle al maestro. Lo que
   sí se puede quitar es todo lo demás: escribir el texto, buscar el
   contacto, acordarse de por quién iba. Quedan tres toques por familia
   en vez de un minuto largo, y la cuenta la lleva la pantalla.

   CINCO REGLAS, Y NINGUNA ES DE ADORNO:

   1. LA CUENTA NO SE PIERDE. A quién ya se le mandó se guarda en el
      equipo, con la misma huella de siempre. El maestro manda doce,
      cierra la aplicación porque le tocó clase, y vuelve al trece. Sin
      esto, a la segunda interrupción hay familias que reciben el mismo
      aviso tres veces y otras que no reciben ninguno.
   2. EL QUE NO TIENE TELÉFONO SE VE, CON SU NOMBRE. Son las mismas
      familias de los boletos en blanco. Si no salieran en pantalla, el
      maestro cerraría creyendo que avisó a todos.
   3. CAMBIAR DE PLANTILLA EMPIEZA UNA TANDA NUEVA. Del aviso del
      boleto al del cambio de hora hay otra lista de destinatarios: si
      se conservara la cuenta, a los doce que ya recibieron el primero
      no les llegaría nunca el segundo. Retocar el texto a mano NO
      reinicia nada —eso es corregir una errata a media tanda.
   4. EL NÚMERO LLEVA PAÍS. El padre escribe ocho dígitos, que es como
      se marca aquí; wa.me sin el país delante abre WhatsApp sin chat y
      hay que buscar el contacto a mano, cuarenta veces.
   5. SALTAR NO ES BORRAR. La familia que se salta vuelve al FINAL de la
      cola, no desaparece: se saltó porque no era el momento, no porque
      no haya que avisarle.                                            */

/* Lo que el maestro NO va a escribir solo a las once de la noche. El
   primero es el que ya venía escribiendo a mano, palabra por palabra. */
const CONV_AVISOS = [
  {
    icono: '🎟️', nombre: 'Venga por su boleto', quien: 'van',
    texto: 'Buenas, le escribo por «{evento}» de {alumno}. Si no ha venido a traer su boleto, ' +
      'puede pasar por la escuela. Abordamos el bus a partir de {hora}, con el boleto en mano. ' +
      'Muchas gracias por apoyar la escuela.',
  },
  {
    icono: '⏰', nombre: 'Recordatorio del día', quien: 'van',
    texto: 'Buenas, le recuerdo que «{evento}» es el {fecha}. {alumno} tiene que estar en {punto} ' +
      'a las {hora}, con su boleto {folio} en la mano. Van {personas}. Gracias.',
  },
  {
    icono: '🕐', nombre: 'Cambió la hora o el lugar', quien: 'van',
    texto: 'Buenas, le aviso de un cambio en «{evento}» de {alumno}: ESCRIBA AQUÍ QUÉ CAMBIÓ. ' +
      'Todo lo demás queda igual. Disculpe la molestia, y por favor avísele a quien lo va a llevar.',
  },
  {
    icono: '💵', nombre: 'Falta el aporte', quien: 'van',
    texto: 'Buenas, le escribo por «{evento}» de {alumno}. Para apartarle el asiento falta el aporte: ' +
      '{aporte} por {personas}. Puede traerlo a la escuela y ahí mismo le entrego su boleto. ' +
      'Muchas gracias por apoyar la escuela.',
  },
  {
    icono: '⛔', nombre: 'Se suspende o se cambia el día', quien: 'todos',
    texto: 'Buenas, le aviso que «{evento}» NO se va a hacer el {fecha}. Le confirmo el día nuevo en ' +
      'cuanto lo tenga. Si ya dio el aporte, se le devuelve o se le guarda para el día nuevo, como ' +
      'usted prefiera. Disculpe la molestia.',
  },
  {
    icono: '🙏', nombre: 'Gracias, ya pasó', quien: 'van',
    texto: 'Buenas, gracias por dejar ir a {alumno} a «{evento}». Todo salió bien y volvieron ' +
      'contando lo que vieron. Gracias por apoyar la escuela.',
  },
  {
    icono: '📣', nombre: 'Otro aviso', quien: 'todos',
    texto: 'Buenas, le escribo por «{evento}» de {alumno}. ',
  },
];

/* El marcador y lo que se lee al lado. La explicación importa tanto como
   el marcador: «{personas}» pone «3 personas», con su palabra y su
   plural, porque un maestro escribiendo «van {personas} personas» a las
   once de la noche acaba mandando «van 3 personas personas» a cuarenta
   familias y eso ya no se recoge. */
const CONV_MARCAS = [
  ['{alumno}', 'el nombre completo del alumno'],
  ['{nombre}', 'solo su primer nombre'],
  ['{grupo}', 'su grado y sección (6º-1)'],
  ['{personas}', 'cuántas van, con su palabra («3 personas»)'],
  ['{folio}', 'el folio de su boleto'],
  ['{aporte}', 'lo que le toca pagar a esa familia'],
  ['{evento}', 'el título de la convocatoria'],
  ['{fecha}', 'el día del evento'],
  ['{hora}', 'la hora de salida'],
  ['{punto}', 'dónde se sube al bus'],
  ['{lugar}', 'a dónde van'],
  ['{maestro}', 'tu nombre'],
  ['{escuela}', 'la escuela'],
];

/* Los saltados en ESTA visita. No se guardan a propósito: saltar es
   «ahorita no», no «a esta no». Mañana vuelven a salir en su sitio. */
let _convAvSalto = {};

/* ⚠️ DE QUIÉN es el mensaje que hay ahora en la casilla. Se guarda aquí
   —y lo repone la cola cada vez que se repinta— porque la cola cambia de
   familia en cada envío mientras que la parte de arriba de la tarjeta se
   pinta UNA sola vez. Al escribir en el mensaje de todas se rellenaba la
   casilla con los datos de la familia que tocaba al ENTRAR: el maestro
   iba por la tercera y en la casilla le aparecía el folio y el grupo de
   la primera. Se veía como un adorno mal puesto, pero desde que la
   casilla se puede retocar, ese texto es el que se guarda y el que sale
   por WhatsApp: la madre de la tercera recibía el boleto de la primera y
   las dos se presentaban en el portón con el mismo folio. */
let _convAvMuestra = null;

function convAvisoDef(c) {
  const a = (c && c.aviso && typeof c.aviso === 'object') ? c.aviso : {};
  const p = Number(a.plant);
  return {
    plant: (p >= 0 && p < CONV_AVISOS.length) ? p : 0,
    texto: typeof a.texto === 'string' ? a.texto : CONV_AVISOS[0].texto,
    quien: (a.quien === 'noVan' || a.quien === 'todos') ? a.quien : 'van',
    enviados: Array.isArray(a.enviados) ? a.enviados : [],
    retoques: (a.retoques && typeof a.retoques === 'object') ? a.retoques : {},
  };
}

/* ── El número, como lo quiere WhatsApp ──
   El prefijo sale del número del PROPIO maestro: así esto mismo sirve en
   Guatemala o en El Salvador sin tocar una línea de código. Si no lo
   puso, 504. Solo se le antepone a los números cortos (ocho o nueve
   dígitos, que es como se marca en Centroamérica); uno de diez o más ya
   trae lo suyo y tocarlo lo rompería. */
const CONV_PAIS_DEF = '504';
function convPrefijo(c) {
  const w = String((c && c.wa) || '').replace(/\D/g, '');
  return (w.length > 8 && w.length <= 12) ? w.slice(0, w.length - 8) : CONV_PAIS_DEF;
}
function convTelWa(c, tel) {
  const n = String(tel || '').replace(/\D/g, '');
  if (n.length < 7) return '';                 /* no es un teléfono */
  return n.length < 10 ? convPrefijo(c) + n : n;
}
window.convTelWa = convTelWa;

/* Se ordena por grado y nombre, igual que los boletos: el maestro suele
   estar avisando y repartiendo a la vez, y así las dos cosas van al
   mismo paso. */
function convAvisoQuienes(c, quien) {
  const r = convTodas(c).filter(x => quien === 'noVan' ? !x.va : (quien === 'todos' || x.va));
  return r.sort((a, b) =>
    String(a.grado || '').localeCompare(String(b.grado || ''), 'es', { numeric: true }) ||
    String(a.alumno || '').localeCompare(String(b.alumno || ''), 'es'));
}
function convAvisoDestinos(c) {
  return convAvisoQuienes(c, convAvisoDef(c).quien).filter(x => convTelWa(c, x.tel));
}
function convAvisoSinTel(c) {
  return convAvisoQuienes(c, convAvisoDef(c).quien).filter(x => !convTelWa(c, x.tel));
}
/* Los que faltan, con los saltados al final. */
function convAvisoFaltan(c) {
  const hechos = {};
  convAvisoDef(c).enviados.forEach(h => { hechos[h] = 1; });
  const van = [], luego = [];
  convAvisoDestinos(c).forEach(x => {
    const h = convHuella(x.alumno, x.grado, x.seccion);
    if (!hechos[h]) (_convAvSalto[h] ? luego : van).push(x);
  });
  return van.concat(luego);
}

/* Los marcadores se cambian por los datos de ESA familia. Se hace en un
   solo sitio y lo usan los tres: la vista previa, lo que se copia y lo
   que sale por WhatsApp. Lo que promete la pantalla es lo que lee la
   madre. */
function convAvisoRellenar(texto, c, x) {
  const per = Number(x && x.personas) || 0;
  const ap = Number(c.aporte) || 0;
  const val = {
    '{alumno}': String((x && x.alumno) || ''),
    '{nombre}': String((x && x.alumno) || '').trim().split(/\s+/)[0] || '',
    '{grupo}': x ? adGradoSeccion(x.grado, x.seccion) : '',
    '{personas}': per + ' persona' + (per === 1 ? '' : 's'),
    '{folio}': x ? convFolioDe(c, x) : '',
    '{aporte}': adLps(ap * per),
    '{evento}': c.titulo || '',
    '{fecha}': convFechaLarga(c.fecha),
    '{hora}': c.hora || '',
    '{punto}': c.punto || '',
    '{lugar}': c.lugar || '',
    '{maestro}': c.maestro || '',
    '{escuela}': c.escuela || '',
  };
  return String(texto || '').replace(/\{[a-zA-Z]+\}/g, m => (m in val ? val[m] : m));
}
/* ── El retoque: lo que se le cambia a UNA sola familia ──
   La plantilla sirve para las veintisiete, pero siempre hay una a la que
   hay que decirle otra cosa: «usted ya pagó, solo venga por el boleto»,
   «el niño no puede ir sin el permiso firmado», «disculpe, a usted le
   dije mal la hora». Sin esto, el maestro tenía dos malas salidas:
   cambiar la plantilla —y mandársela así a todos los que faltan— o
   mandar el mensaje que no era y ponerse a escribir dentro de WhatsApp,
   que es justo el trabajo que esta pantalla existe para quitar.

   El retoque se guarda por HUELLA, la de siempre, y por eso sobrevive a
   cerrar la aplicación: el maestro retoca el de doña María a las nueve
   de la noche, se le acaba la batería, y al volver sigue ahí.

   ⚠️ MANDA EL RETOQUE SOBRE LA PLANTILLA. Si esa familia tiene uno, se
   le manda el suyo aunque después se cambie el texto de todas. Es lo que
   el maestro escribió a propósito para ella; que un cambio general se lo
   borrara por detrás sería mandarle otra vez el mensaje equivocado. La
   pantalla se lo dice con su etiqueta y se deshace de un toque. */
function convAvisoRetoques(c) {
  const r = convAvisoDef(c).retoques;
  return (r && typeof r === 'object') ? r : {};
}
function convAvisoRetoque(c, x) {
  if (!x) return null;
  const t = convAvisoRetoques(c)[convHuella(x.alumno, x.grado, x.seccion)];
  return typeof t === 'string' ? t : null;
}
function convAvisoTexto(c, x) {
  const r = convAvisoRetoque(c, x);
  return r != null ? r : convAvisoRellenar(convAvisoDef(c).texto, c, x);
}
/* Lo que se le va a mandar a esa familia, contando lo que el maestro
   tenga escrito en la pantalla ahora mismo. Un solo sitio para las tres
   cosas que tienen que decir lo mismo: la casilla de editar, el botón de
   copiar y lo que sale por WhatsApp. */
function convAvisoParaFamilia(c, x, textoVivo) {
  const r = convAvisoRetoque(c, x);
  if (r != null) return r;
  return convAvisoRellenar(textoVivo == null ? convAvisoDef(c).texto : textoVivo, c, x);
}

/* Lo que el maestro tenga escrito AHORA MISMO, aunque todavía no haya
   guardado: la vista previa tiene que ir con lo que está viendo. */
function convAvisoVivo(c) {
  const ta = document.getElementById('cv-av-txt');
  return ta ? String(ta.value) : convAvisoDef(c).texto;
}

/* El botón de mandar va ARRIBA y lo de escribir el aviso, abajo. Es la
   misma forma que ya tiene el mensaje para el grupo —primero lo que se
   hace, después lo que se ajusta— y aquí importa más: el maestro sale a
   WhatsApp y vuelve veintisiete veces, y si al volver tuviera que pasar
   por las plantillas, los marcadores y el mensaje entero para llegar al
   botón, abandona en la quinta familia. El aviso se escribe una vez; el
   botón se toca cuarenta. */
function convHtmlAvisos(c) {
  const av = convAvisoDef(c);
  const n = q => convAvisoQuienes(c, q).length;
  return `
    <div class="pa-card">
      <div class="pa-card-title">📲 Avisarles a todos por WhatsApp</div>
      <p class="pa-optional-hint">Para lo que sale <strong>entre el «sí voy» y el bus</strong>: que vengan
        por el boleto, que cambió la hora, que falta el aporte. Escribes el aviso <strong>una sola
        vez</strong> y la pantalla te va abriendo el chat de cada familia con el mensaje ya puesto y con
        <strong>su</strong> nombre, su grupo y su folio dentro.</p>
      <p class="pa-optional-hint">⚠️ WhatsApp <strong>no deja mandarle a cuarenta números de un solo
        golpe</strong> desde una página: eso no lo puede hacer nadie sin pagar su servicio de empresa. Lo
        que sí se quita es todo lo demás —escribir, buscar el contacto, acordarte de por quién ibas—.
        Quedan <strong>tres toques por familia</strong>, y la cuenta la lleva la pantalla.</p>

      <div id="cv-av-cola">${convHtmlAvisoCola(c)}</div>

      <div class="pa-field" style="margin-top:16px"><label>¿De qué es el aviso?</label>
        <div class="ad-meses" style="margin:4px 0 0">${CONV_AVISOS.map((p, i) =>
          `<button type="button" class="ad-mes-btn${i === av.plant ? ' ad-mes-on' : ''}"
            data-cvavp="${i}">${p.icono} ${adEsc(p.nombre)}</button>`).join('')}</div>
        <p class="pa-optional-hint">Al tocar una, empiezas un aviso <strong>nuevo</strong>: la cuenta de a
          quién ya le mandaste vuelve a cero. Si solo estás corrigiendo el texto, escríbelo abajo y la
          cuenta no se toca.</p></div>

      <div class="pa-field"><label>¿A quiénes?</label>
        <div class="ad-meses" style="margin:4px 0 0">
          <button type="button" class="ad-mes-btn${av.quien === 'van' ? ' ad-mes-on' : ''}"
            data-cvavq="van">✅ Los que van (${n('van')})</button>
          <button type="button" class="ad-mes-btn${av.quien === 'noVan' ? ' ad-mes-on' : ''}"
            data-cvavq="noVan">🚫 Los que no van (${n('noVan')})</button>
          <button type="button" class="ad-mes-btn${av.quien === 'todos' ? ' ad-mes-on' : ''}"
            data-cvavq="todos">👥 Todos (${n('todos')})</button>
        </div></div>

      <div class="pa-field"><label>El mensaje</label>
        <textarea id="cv-av-txt" class="pa-paste-area" rows="6" maxlength="900">${adEsc(av.texto)}</textarea>
        <p class="pa-optional-hint">Toca un marcador para meterlo donde tengas el cursor. Cada uno se
          cambia por el dato de <strong>esa</strong> familia:</p>
        <div class="ad-meses ad-cv-marcas">${CONV_MARCAS.map(([m, q]) =>
          `<button type="button" class="ad-mes-btn" data-cvavm="${adEsc(m)}"
            title="${adEsc(q)}">${adEsc(m)}</button>`).join('')}</div>
        <p class="pa-optional-hint" id="cv-av-quees">${adEsc(CONV_MARCAS[0][0])} es ${adEsc(CONV_MARCAS[0][1])}.</p>
      </div>

      <div id="cv-av-dif">${convHtmlAvisoDifusion(c)}</div>
    </div>`;
}

/* La cola se repinta sola, sin volver a pintar la pantalla entera: el
   maestro está a mitad de una lista de veintisiete y un salto al
   principio de la página en cada envío hace que abandone en el quinto. */
function convHtmlAvisoCola(c) {
  const dest = convAvisoDestinos(c);
  const faltan = convAvisoFaltan(c);
  const sinTel = convAvisoSinTel(c);
  const hechos = dest.length - faltan.length;
  const x = faltan[0] || null;
  const muestra = x || dest[0] || convAvisoQuienes(c, convAvisoDef(c).quien)[0] || null;
  const pct = dest.length ? Math.round(hechos * 100 / dest.length) : 0;
  _convAvMuestra = muestra;
  /* La previa NO es una previa: es la casilla donde se escribe lo que va
     a salir. El maestro lee el mensaje ya armado, ve que a esta familia
     hay que decirle otra cosa, y lo cambia ahí mismo sin tocar el de las
     demás. Estaba de solo lectura y esa era la mitad que faltaba. */
  const retocado = !!x && convAvisoRetoque(c, x) != null;
  return `
    <p class="pa-optional-hint" style="margin-bottom:4px">${!muestra ? 'Así se va a leer:'
      : x ? 'Esto es lo que le va a llegar a <strong>' + adEsc(muestra.alumno) +
        '</strong>. <strong>Puedes cambiarlo aquí mismo</strong>, y se cambia solo el de ' +
        adEsc(adPrimerNombre(muestra.alumno) || 'esta familia') + ':'
      : 'Lo último que mandaste, a <strong>' + adEsc(muestra.alumno) + '</strong>:'}</p>
    <textarea id="cv-av-previa" class="ad-wa-previa ad-wa-edit" rows="5" maxlength="900"
      ${x ? '' : 'disabled'}>${adEsc(convAvisoParaFamilia(c, muestra, convAvisoVivo(c)))}</textarea>
    <div class="ad-cv-retoq" id="cv-av-retoq" ${retocado ? '' : 'hidden'}>
      <span>✏️ Este lo escribiste <strong>solo para ${adEsc(x ? adPrimerNombre(x.alumno) : '')}</strong>.
        A las demás les sigue llegando el mensaje de abajo.</span>
      <button type="button" id="cv-av-desretoq">↩️ Volver al de todos</button>
    </div>

    ${dest.length ? `
    <div class="ad-cv-cola">
      <div class="ad-cv-blancos-t">📲 Llevas ${hechos} de ${dest.length}</div>
      <div class="ad-cv-barra"><i style="width:${pct}%"></i></div>
      ${x ? `
      <div class="ad-cv-ahora">
        <b>${adEsc(x.alumno)}</b>
        <span>${adEsc(adGradoSeccion(x.grado, x.seccion))}${x.va ? ' · ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') : ''} · 📲 ${adEsc(x.tel)}</span>
      </div>
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="cv-av-ir">📲 Abrirle WhatsApp y mandarle</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-av-salto">⏭️ Esta después</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-av-copiar">📋 Copiar su mensaje</button>
      </div>
      <p class="pa-optional-hint">Se abre su chat con el mensaje escrito; tú tocas enviar. Cuando vuelvas
        aquí ya te espera la siguiente: faltan <strong>${faltan.length}</strong>.</p>`
      : `<p class="pa-optional-hint" style="margin:8px 0 0">✅ <strong>Ya les mandaste a
        ${dest.length === 1 ? 'la única familia' : 'las ' + dest.length + ' familias'} con teléfono.</strong>
        Si tienes que volver a avisarles lo mismo, empieza de nuevo aquí abajo.</p>`}
      ${hechos ? `
      <div class="ad-btn-row" style="margin-top:8px">
        <button class="pa-generate-btn ad-btn-sec" id="cv-av-atras">↩️ La última no salió</button>
        <button class="pa-generate-btn ad-btn-sec" id="cv-av-reset">🔁 Empezar el aviso de nuevo</button>
      </div>` : ''}
    </div>`
    : `<p class="pa-optional-hint">Ninguno de los que elegiste dejó teléfono, así que no hay a quién
        mandarle. A esas familias hay que decírselo en el portón.</p>`}

    ${sinTel.length ? `
    <div class="ad-cv-repes">
      <div class="ad-cv-blancos-t">📵 ${sinTel.length} sin teléfono</div>
      <p class="pa-optional-hint" style="margin:6px 0 8px">A ${sinTel.length === 1 ? 'esta familia' : 'estas familias'}
        <strong>no les llega</strong> este aviso: no dejaron número. Díselo en el portón o mándale el
        recado con el alumno; son las mismas de los boletos en blanco.</p>
      ${sinTel.map(y => `<div class="ad-gasto-row">
        <span>${adEsc(y.alumno)}${y.grado ? ' · ' + adEsc(adGradoSeccion(y.grado, y.seccion)) : ''}</span>
        <span>${y.aMano ? '<span class="ad-cv-tag">🖊️ a mano</span>' : ''}</span></div>`).join('')}
    </div>` : ''}`;
}

/* La otra manera de hacerlo, contada entera y con lo que cuesta. Va al
   final de la tarjeta y no en medio: el maestro que ya está mandando no
   tiene por qué leer esto cuarenta veces. Se repinta con la cola porque
   depende de a quiénes esté avisando. */
function convHtmlAvisoDifusion(c) {
  const dest = convAvisoDestinos(c);
  if (dest.length < 2) return '';
  return `
    <div class="ad-cv-blancos">
      <div class="ad-cv-blancos-t">📋 Si prefieres una lista de difusión</div>
      <p class="pa-optional-hint" style="margin:6px 0 8px">WhatsApp tiene «listas de difusión»: escribes
        una vez y sale para todos. Dos cosas antes de casarte con eso: el mensaje va
        <strong>igual para todos</strong> —sin nombre, sin folio y sin lo que le toca pagar a cada quien—,
        y <strong>solo le llega a quien tenga tu número guardado</strong> en su teléfono. Los demás no lo
        reciben, y no se entera ni él ni tú.</p>
      <div class="ad-btn-row">
        <button class="pa-generate-btn ad-btn-sec" id="cv-av-tels">📋 Copiar los ${dest.length} teléfonos</button>
      </div>
      <p class="pa-optional-hint">Salen con el país delante y con el nombre al lado, para que puedas
        guardarlos como contactos: sin eso, la difusión no le llega a nadie.</p>
    </div>`;
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
      <div class="pa-field"><label>¿A qué hora de ese día cierras? (opcional)</label>
        <input id="cv-limitehora" class="pa-inp-field" type="time" value="${adEsc(c.limiteHora)}" style="max-width:170px">
        <p class="pa-optional-hint">El padre ve un <strong>reloj bajando</strong> hasta ese momento, con
          sus horas y sus minutos: es lo que mueve al que lo va dejando para después. Si no pones hora,
          se cierra al <strong>acabar</strong> ese día, para no dejar fuera al que iba a contestar
          ese mismo día.</p></div>
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
      <div class="pa-field"><label>👣 Arranque: personas con las que empieza el conteo</label>
        <input id="cv-arranque" class="pa-inp-field" type="number" min="0" step="1" value="${Number(c.arranque) || 0}" style="max-width:170px">
        <p class="pa-optional-hint">Una lista en <strong>cero no la estrena nadie</strong>: el primero que
          abre el enlace cree que la salida no va a salir y se espera. Este número se le SUMA al que ve el
          padre, para que encuentre la lista arrancada. Úsalo con los que ya te dijeron que sí de palabra
          o por WhatsApp.</p>
        <p class="pa-optional-hint"><strong>No entra en tus cuentas</strong>: los buses, el dinero y la
          lista de arriba se calculan solo con los que contestaron de verdad. Y no te pases: si pones 80 y
          el sábado llegan 20, la familia que te leyó «quedan pocos asientos» se dio cuenta.</p></div>
      <button class="pa-generate-btn" id="cv-guardar">💾 Guardar${pub ? ' y actualizar el enlace' : ''}</button>
    </div>`;
}

/* ── Eventos ── */
function convLeerCampos(c) {
  const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
  c.titulo = String(v('cv-titulo')).trim();
  c.gancho = String(v('cv-gancho')).trim();
  c.gana = [0, 1, 2].map(i => String(v('cv-gana-' + i)).trim());
  c.fecha = v('cv-fecha'); c.limite = v('cv-limite'); c.limiteHora = v('cv-limitehora');
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
  c.arranque = Math.max(0, Number(v('cv-arranque')) || 0);
  /* El aviso solo está en pantalla cuando ya hay a quién avisarle. Se lee
     comprobando que el campo EXISTA: leerlo a ciegas devolvería cadena
     vacía desde cualquier otra pantalla y le borraría al maestro el
     mensaje que tenía escrito a medias. */
  const ta = document.getElementById('cv-av-txt');
  if (ta) {
    const av = convAvisoDef(c);
    av.texto = String(ta.value);
    c.aviso = av;
  }
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
  document.getElementById('cv-volver').addEventListener('click', () => {
    _adConvId = null; _convAvSalto = {}; renderAdmin();
  });

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

  /* ⚠️ El botón se llama «cv-wa-enviar» y NO «cv-wa». Se llamaron igual
     que el campo del teléfono del maestro, y como el botón se pinta
     antes, getElementById devolvía el BOTÓN: al guardar una convocatoria
     ya publicada, `c.wa` se llenaba con el value vacío de un <button> y
     el número del maestro se borraba —del equipo y de la nube—. Ese es
     justo el número al que la pantalla del padre le manda la respuesta
     cuando se le cae el internet, así que se perdía en silencio la red
     de seguridad. Dos elementos no pueden compartir id. */
  const bWa = document.getElementById('cv-wa-enviar');
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

  const bBol = document.getElementById('cv-boletos');
  if (bBol) bBol.addEventListener('click', () => convImprimirBoletos(c));

  /* Los boletos en blanco. El contador se guarda ANTES de que el maestro
     cierre la ventana de impresión: si se guardara al volver, el que
     imprime, reparte y vuelve mañana sacaría otra vez el M01 y tendría
     dos boletos con el mismo folio en la calle. Que se salten números
     (por una ventana emergente bloqueada, por ejemplo) no rompe nada; que
     se repitan, sí. */
  const $n = document.getElementById('cv-blancos-n');
  const $h = document.getElementById('cv-blancos-hojas');
  const cuantosBl = () => Math.max(1, Math.min(210, Math.round(Number($n && $n.value) || 0) || 1));
  const pintaHojas = () => {
    if (!$h) return;
    const n = cuantosBl(), hj = Math.ceil(n / 7);
    $h.innerHTML = 'Salen <strong>' + hj + ' hoja' + (hj === 1 ? '' : 's') + '</strong>, siete por hoja.';
  };
  if ($n) $n.addEventListener('input', pintaHojas);
  pintaHojas();
  const bBla = document.getElementById('cv-blancos');
  if (bBla) bBla.addEventListener('click', () => {
    const n = cuantosBl(), desde = convBlancoDesde(c);
    /* Se imprime lo GUARDADO, no lo que había al pintar: si el maestro
       acaba de corregir la hora de salida en los campos de abajo, el
       papel tiene que salir con la hora nueva. */
    convImprimirBlancos(convGuardar(x => { x.blancos = desde + n - 1; }) || c, n, desde);
    renderAdmin();
  });

  /* ── Apuntar a mano ── */
  body.querySelectorAll('[data-cvamg]').forEach(b =>
    b.addEventListener('click', () => {
      /* Se pinta a mano en vez de re-renderizar: un renderAdmin() aquí
         borraría el nombre que el maestro acaba de escribir arriba. */
      _convAmG = b.dataset.cvamg;
      body.querySelectorAll('[data-cvamg]').forEach(o => o.classList.toggle('ad-mes-on', o === b));
    }));

  const bAm = document.getElementById('cv-am-add');
  if (bAm) bAm.addEventListener('click', async () => {
    const v = id => { const e = document.getElementById(id); return e ? String(e.value).trim() : ''; };
    const alumno = v('cv-am-nom');
    if (alumno.length < 3) {
      await metasAlert('Escribe el nombre del alumno. Sin nombre no se le puede imprimir el boleto ni buscarlo en la lista el día de la salida.',
        { icono: '🖊️', titulo: 'Falta el nombre' });
      return;
    }
    const grado = _convAmG != null ? _convAmG : ((d && d.grado) || '');
    const seccion = v('cv-am-sec');
    const personas = Math.max(1, Math.min(12, Math.round(Number(v('cv-am-per')) || 1)));
    const tel = v('cv-am-tel');
    const cc = convGuardar(x => {
      x.manual = Array.isArray(x.manual) ? x.manual : [];
      /* Apuntar dos veces al mismo CORRIGE, no suma: es la misma regla
         que el servidor aplica a las respuestas del enlace, y por la
         misma razón —el maestro no se acuerda de a quién ya apuntó y una
         fila repetida es un asiento pagado de más. */
      const h = convHuella(alumno, grado, seccion);
      const y = x.manual.find(m => convHuella(m.alumno, m.grado, m.seccion) === h);
      if (y) { y.personas = personas; y.tel = tel || y.tel; y.alumno = alumno; }
      else {
        x.manual.push({
          id: 'M' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
          va: 1, alumno, grado, seccion, personas, tel, nota: '', fecha: adHoy(),
        });
      }
    });
    if (!cc) return;
    renderAdmin();
    toast('🖊️ ' + alumno.split(/\s+/)[0] + ' apuntado · ' + personas + ' persona' + (personas === 1 ? '' : 's'));
  });

  body.querySelectorAll('[data-cvmper]').forEach(b =>
    b.addEventListener('click', () => {
      const id = b.dataset.cvmper, dd = Number(b.dataset.d) || 0;
      convGuardar(x => {
        const y = (x.manual || []).find(m => m.id === id);
        if (y) y.personas = Math.max(1, Math.min(12, (Number(y.personas) || 1) + dd));
      });
      renderAdmin();
    }));

  body.querySelectorAll('[data-cvmdel]').forEach(b =>
    b.addEventListener('click', async () => {
      const id = b.dataset.cvmdel;
      const y = (Array.isArray(c.manual) ? c.manual : []).find(m => m.id === id);
      if (!await metasConfirm('Se quita a **' + adEsc((y && y.alumno) || 'esta familia') +
        '** de tu lista. Si ya le entregaste su boleto, avísale.\n\n¿Quitarla?',
        { icono: '🗑️', titulo: 'Quitar de la lista', okTxt: 'Sí, quitar' })) return;
      convGuardar(x => { x.manual = (x.manual || []).filter(m => m.id !== id); });
      renderAdmin();
    }));

  const bCopLi = document.getElementById('cv-copiar-lista');
  if (bCopLi) bCopLi.addEventListener('click', () => adCopiar(convTextoLista(c, t),
    () => toast('📋 Lista copiada'), () => toast('No se pudo copiar')));

  /* Tocar el teléfono de una fila abre su chat con el MISMO aviso que
     está escrito abajo, ya personalizado. Antes salía un renglón suelto
     («le escribo por la salida») y el maestro tenía que escribir el
     resto ahí mismo, cuarenta veces. Un solo texto, dos caminos. */
  body.querySelectorAll('[data-cvtel]').forEach(b =>
    b.addEventListener('click', () => {
      const cc = convUna(adLoad(), _adConvId) || c;
      const h = String(b.dataset.cvhuella || '');
      const x = convTodas(cc).find(y => convHuella(y.alumno, y.grado, y.seccion) === h);
      if (!x) return;
      convAvisoAbrir(cc, x);
    }));

  convAvisoEnganchar(body, c);

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

/* ── Los botones del aviso ──
   Se parten en dos: los de arriba (plantilla, a quiénes, marcadores) se
   enganchan una vez con la pantalla, y los de la COLA se vuelven a
   enganchar cada vez que la cola se repinta. La cola se repinta sola
   —sin renderAdmin()— porque el maestro está a mitad de una lista de
   veintisiete y un salto al principio de la página en cada envío es lo
   que hace que abandone en el quinto. */
function convAvisoEnganchar(body, c) {
  const $ta = document.getElementById('cv-av-txt');
  if (!$ta) return;

  body.querySelectorAll('[data-cvavp]').forEach(b =>
    b.addEventListener('click', () => {
      const i = +b.dataset.cvavp, p = CONV_AVISOS[i];
      if (!p) return;
      let nueva = false;
      convGuardar(x => {
        const av = convAvisoDef(x);
        nueva = i !== av.plant;
        /* Los retoques se van con la tanda: lo que el maestro le escribió
           a doña María era para el aviso del boleto, y pegárselo al del
           cambio de hora le mandaría a ella un mensaje que no viene a
           cuento —y que él ya no está mirando. */
        x.aviso = { plant: i, texto: p.texto, quien: p.quien,
                    enviados: nueva ? [] : av.enviados,
                    retoques: nueva ? {} : av.retoques };
      });
      if (nueva) _convAvSalto = {};
      renderAdmin();
      toast(nueva ? '🆕 Aviso nuevo: la cuenta empieza otra vez' : '↩️ Mensaje repuesto');
    }));

  /* Cambiar a quiénes NO reinicia la cuenta: la huella es de la persona,
     así que el que ya recibió el aviso lo recibió, y al ensanchar la
     lista se sigue por los que faltan en vez de volver a molestar a los
     mismos. */
  body.querySelectorAll('[data-cvavq]').forEach(b =>
    b.addEventListener('click', () => {
      const q = b.dataset.cvavq;
      convGuardar(x => { const av = convAvisoDef(x); av.quien = q; x.aviso = av; });
      renderAdmin();
    }));

  body.querySelectorAll('[data-cvavm]').forEach(b =>
    b.addEventListener('click', () => {
      const m = b.dataset.cvavm;
      const s = $ta.selectionStart, e = $ta.selectionEnd, v = $ta.value;
      $ta.value = v.slice(0, s) + m + v.slice(e);
      $ta.focus();
      $ta.setSelectionRange(s + m.length, s + m.length);
      const q = (CONV_MARCAS.find(y => y[0] === m) || [])[1];
      const $q = document.getElementById('cv-av-quees');
      if ($q && q) $q.textContent = m + ' es ' + q + '.';
      convGuardar();
      convAvisoRepintar();
    }));

  /* La previa se repinta con cada letra, pero SOLO la previa: guardar en
     cada tecla obliga a escribir todo el almacén del maestro en el
     teléfono y se nota en un aparato de los que hay en el aula. Lo
     escrito se guarda al salir del campo y en cada envío. */
  $ta.addEventListener('input', () => {
    const $p = document.getElementById('cv-av-previa');
    const $b = document.getElementById('cv-av-retoq');
    /* La familia se lee de _convAvMuestra, que la cola repone en cada
       envío: capturarla aquí la dejaría clavada en la que tocaba al
       entrar (ver la nota de _convAvMuestra). */
    if (!$p || !_convAvMuestra) return;
    /* Si a esa familia le escribió algo suyo, cambiar la plantilla NO se
       lo pisa: lo escribió a propósito para ella y se lo estaría
       borrando por detrás, sin que lo viera. */
    if ($b && !$b.hidden) return;
    $p.value = convAvisoRellenar($ta.value, c, _convAvMuestra);
    convAvisoCrecer($p);
  });
  $ta.addEventListener('blur', () => { convGuardar(); });

  convAvisoColaEnganchar(c);
}

function convAvisoRepintar() {
  const cc = convUna(adLoad(), _adConvId);
  const cont = document.getElementById('cv-av-cola');
  if (!cc || !cont) return;
  cont.innerHTML = convHtmlAvisoCola(cc);
  const dif = document.getElementById('cv-av-dif');
  if (dif) dif.innerHTML = convHtmlAvisoDifusion(cc);
  convAvisoColaEnganchar(cc);
}

function convAvisoAbrir(c, x) {
  const tel = convTelWa(c, x.tel);
  const enc = encodeURIComponent(convAvisoTexto(c, x));
  const movil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  window.open(movil
    ? 'https://wa.me/' + tel + '?text=' + enc
    : 'https://web.whatsapp.com/send?phone=' + tel + '&text=' + enc, '_blank');
}

/* La casilla crece con lo que se escribe: un mensaje de seis renglones
   dentro de una casilla de tres se lee por una rendija, y el maestro
   está comprobando justamente que dice lo que tiene que decir. */
function convAvisoCrecer($p) {
  if (!$p) return;
  $p.style.height = 'auto';
  $p.style.height = ($p.scrollHeight + 2) + 'px';
}

/* Guarda —o quita— lo que el maestro tenga escrito para ESTA familia. Si
   lo dejó igual que el mensaje de todas, no se guarda nada: un retoque
   idéntico solo sería una etiqueta de más en la pantalla. */
function convAvisoGuardarRetoque(x) {
  const $p = document.getElementById('cv-av-previa');
  if (!$p || !x) return null;
  const vivo = String($p.value);
  const h = convHuella(x.alumno, x.grado, x.seccion);
  return convGuardar(y => {
    const av = convAvisoDef(y);
    if (vivo === convAvisoRellenar(av.texto, y, x)) delete av.retoques[h];
    else av.retoques[h] = vivo;
    y.aviso = av;
  });
}

function convAvisoColaEnganchar(c) {
  const el = id => document.getElementById(id);
  const x = convAvisoFaltan(c)[0] || null;

  /* ── La casilla donde se retoca el mensaje de esta familia ── */
  const $p = el('cv-av-previa');
  if ($p) convAvisoCrecer($p);
  if ($p && x) {
    const base = () => convAvisoRellenar(convAvisoVivo(c), c, x);
    $p.addEventListener('input', () => {
      convAvisoCrecer($p);
      const $b = el('cv-av-retoq');
      if ($b) $b.hidden = ($p.value === base());
    });
    /* Se guarda al salir de la casilla, no en cada tecla: escribir en el
       almacén del maestro cuarenta veces por renglón se nota en los
       teléfonos que hay en el aula. Antes de mandar y antes de copiar se
       vuelve a guardar, así que no hace falta que salga del campo. */
    $p.addEventListener('blur', () => { convAvisoGuardarRetoque(x); });
  }

  const bDes = el('cv-av-desretoq');
  if (bDes && x) bDes.addEventListener('click', () => {
    convGuardar(y => {
      const av = convAvisoDef(y);
      delete av.retoques[convHuella(x.alumno, x.grado, x.seccion)];
      y.aviso = av;
    });
    convAvisoRepintar();
    toast('↩️ Le vuelve a llegar el mensaje de todos');
  });

  const bIr = el('cv-av-ir');
  if (bIr && x) bIr.addEventListener('click', () => {
    const h = convHuella(x.alumno, x.grado, x.seccion);
    /* Lo que se manda es lo que el maestro está VIENDO en la casilla,
       aunque no haya salido de ella: si tocara mandar con el retoque a
       medio escribir y saliera el de todos, se enteraría por la queja de
       la madre. */
    convAvisoGuardarRetoque(x);
    /* Se apunta ANTES de abrir WhatsApp. En el teléfono, abrir otra
       aplicación puede llevarse esta página por delante; volver y
       encontrarse a la misma familia es mandarle el aviso dos veces, y
       la madre que recibe dos veces «venga por su boleto» viene dos
       veces. Si de verdad no salió, «La última no salió» la devuelve. */
    const cc = convGuardar(y => {
      const av = convAvisoDef(y);
      if (av.enviados.indexOf(h) < 0) av.enviados.push(h);
      y.aviso = av;
    }) || c;
    delete _convAvSalto[h];
    convAvisoAbrir(cc, x);
    convAvisoRepintar();
  });

  const bSal = el('cv-av-salto');
  if (bSal && x) bSal.addEventListener('click', () => {
    _convAvSalto[convHuella(x.alumno, x.grado, x.seccion)] = 1;
    const sig = convAvisoFaltan(c)[0];
    convAvisoRepintar();
    if (sig && sig.alumno === x.alumno) toast('Es la única que falta');
  });

  const bCop = el('cv-av-copiar');
  if (bCop && x) bCop.addEventListener('click', () => {
    const cc = convAvisoGuardarRetoque(x) || convGuardar() || c;
    adCopiar(convAvisoTexto(cc, x),
      () => toast('📋 Copiado: pégalo en su chat'), () => toast('No se pudo copiar'));
  });

  const bAtr = el('cv-av-atras');
  if (bAtr) bAtr.addEventListener('click', () => {
    convGuardar(y => {
      const av = convAvisoDef(y);
      av.enviados = av.enviados.slice(0, -1);
      y.aviso = av;
    });
    convAvisoRepintar();
    toast('↩️ Vuelve a la cola');
  });

  const bRes = el('cv-av-reset');
  if (bRes) bRes.addEventListener('click', async () => {
    if (!await metasConfirm('Se borra la cuenta de **a quién ya le mandaste** este aviso y la cola vuelve a empezar por la primera familia. El mensaje no se toca.\n\n¿Empezar de nuevo?',
      { icono: '🔁', titulo: 'Empezar el aviso de nuevo', okTxt: 'Sí, empezar' })) return;
    convGuardar(y => { const av = convAvisoDef(y); av.enviados = []; y.aviso = av; });
    _convAvSalto = {};
    convAvisoRepintar();
  });

  const bTel = el('cv-av-tels');
  if (bTel) bTel.addEventListener('click', () => {
    const L = convAvisoDestinos(c).map(y => y.alumno +
      (y.grado ? ' (' + adGradoSeccion(y.grado, y.seccion) + ')' : '') + ' +' + convTelWa(c, y.tel));
    adCopiar(L.join('\n'),
      () => toast('📋 ' + L.length + ' teléfono' + (L.length === 1 ? '' : 's') + ' copiado' + (L.length === 1 ? '' : 's')),
      () => toast('No se pudo copiar'));
  });
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
  const r = convTodas(c);
  const si = r.filter(x => x.va), no = r.filter(x => !x.va);
  const L = [];
  L.push((c.icono || '📣') + ' ' + (c.titulo || 'Convocatoria') + (c.fecha ? ' — ' + convFechaLarga(c.fecha) : ''));
  L.push('Personas: ' + t.personas + ' · Familias: ' + t.familias +
         ' · Buses de ' + t.cap + ': ' + t.buses + ' (sobran ' + t.sobran + ' asientos)');
  if (Number(c.aporte) > 0) L.push('Se recogería: ' + adLps(t.dinero));
  /* De dónde salió cada uno: esta lista se pega en el grupo de maestros o
     se le manda al director, y ahí hay que poder explicar por qué el
     número no cuadra con lo que enseña el enlace. */
  if (t.manoFamilias) {
    L.push('De ellos, ' + t.manoFamilias + ' familia' + (t.manoFamilias === 1 ? '' : 's') +
           ' (' + t.manoPersonas + ' persona' + (t.manoPersonas === 1 ? '' : 's') + ') apuntadas a mano.');
  }
  L.push('');
  L.push('VAN (' + si.length + '):');
  si.forEach((x, i) => L.push((i + 1) + '. ' + x.alumno +
    (x.grado ? ' — ' + adGradoSeccion(x.grado, x.seccion) : '') +
    ' — ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') + (x.tel ? ' — ' + x.tel : '') +
    ' — boleto ' + convFolioDe(c, x) + (x.aMano ? ' — a mano' : '')));
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
  const norm = convNorm;
  const si = convTodas(c).filter(x => x.va);
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
window.convImprimirBoletos = convImprimirBoletos;
window.convImprimirBlancos = convImprimirBlancos;
