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
  if (_adConvId) { _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; _convAbBusca = ''; return true; }
  if (_adConvOn) { _adConvOn = 0; return true; }
  return false;
}
function adConvEntrar() { _adConvOn = 1; _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; _convAbBusca = ''; }
function adConvCerrar() { _adConvOn = 0; _adConvId = null; _adConvTraido = ''; _convAvSalto = {}; _convAbBusca = ''; }
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
  convDelEnlace(c).forEach(x => {
    enNube[convHuella(x.alumno, x.grado, x.seccion)] = 1;
  });
  return (Array.isArray(c.manual) ? c.manual : []).map(x => Object.assign({}, x, {
    aMano: 1,
    repetido: enNube[convHuella(x.alumno, x.grado, x.seccion)] ? 1 : 0,
  }));
}

/* ══════════════ 🗑 QUITAR A ALGUIEN QUE CONTESTÓ EL ENLACE ══════════════
   El enlace anda suelto en un grupo de cientos de personas y por ahí
   entra lo que tiene que entrar y también lo otro: la prueba que hizo
   el propio maestro para ver cómo se veía, el que se equivocó de
   convocatoria, el nombre escrito de broma. Eso cuenta personas, cuenta
   dinero y cuenta ASIENTOS: un bus se contrata por gente que no existe.
   Hasta ahora solo se podía quitar lo apuntado a mano.

   CUATRO REGLAS, Y NINGUNA ES DE ADORNO:

   1. SE GUARDA EN `c.quitados`, NUNCA borrando de `c.resp` a secas.
      Traer las respuestas reemplaza `resp` entero con lo que venga de
      la nube: lo borrado ahí volvería solo en el siguiente «Traer las
      respuestas» y el maestro se enteraría contando gente en el portón.
      Es la misma razón por la que los pagos y lo apuntado a mano viven
      fuera de `resp`.
   2. LA LLAVE ES LA HUELLA DE SIEMPRE (nombre + grado + sección).
   3. SE INTENTA BORRAR TAMBIÉN EN EL SERVIDOR, para que el «ya somos
      37» que ve el padre deje de contarla. Si no hay señal, se esconde
      igual aquí y se reintenta al traer las respuestas: la pantalla del
      maestro no se queda esperando internet.
   4. ⚠️ SI LA FAMILIA VUELVE A CONTESTAR, VUELVE A SALIR. Esto es lo
      que no se puede saltar. Esconder para siempre una huella sería
      perder una respuesta en silencio —la madre cree que apartó su
      asiento y el maestro no la ve—, que es el error más caro de esta
      herramienta. Por eso el escondite guarda la marca de tiempo de la
      fila (`act`) y se suelta sola en cuanto el servidor trae una
      distinta. */
function convQuitados(c) {
  return (c && c.quitados && typeof c.quitados === 'object') ? c.quitados : {};
}
/* Las respuestas del enlace que SIGUEN contando. Todo lo que el maestro
   ve, cuenta, cobra e imprime sale de aquí; el espejo de lo que ve el
   padre no, porque ese tiene que enseñar lo que hay en el servidor. */
function convDelEnlace(c) {
  const q = convQuitados(c);
  return (Array.isArray(c.resp) ? c.resp : [])
    .filter(x => !q[convHuella(x.alumno, x.grado, x.seccion)]);
}
/* Todo el que va, venga de donde venga y sin repetir a nadie. Es lo que
   se lista, lo que se cuenta y lo que se imprime en boletos. */
function convTodas(c) {
  return convDelEnlace(c).concat(convManual(c).filter(x => !x.repetido));
}
window.convTodas = convTodas;
window.convQuitados = convQuitados;

/* Borrar la fila en el servidor. Devuelve `true` solo si el servidor lo
   confirma: con un `false` la respuesta sigue allá y el padre la sigue
   contando, y eso hay que poder decírselo al maestro. */
async function convQuitarNube(c, huella) {
  if (!c.codigo || !c.pin) return false;
  return await convRPC('metas_conv_quitar',
    { p_codigo: c.codigo, p_pin: c.pin, p_huella: huella }) === true;
}

/* Se corre cada vez que se traen las respuestas, y hace dos cosas:

   · ADOPTA la marca de tiempo de las filas que se quitaron antes de
     saberla (una convocatoria vieja, guardada sin ella). Se adopta y se
     queda escondida: si se soltara, volvería a salir sola y el maestro
     tendría que quitarla otra vez cada día.
   · SUELTA la huella cuya fila cambió en el servidor. Eso solo pasa si
     la familia volvió a contestar el enlace, y entonces vuelve a la
     lista: una respuesta escondida es una respuesta perdida. */
function convQuitadosSincronizar(c) {
  const q = convQuitados(c);
  if (!Object.keys(q).length) return q;
  (Array.isArray(c.resp) ? c.resp : []).forEach(x => {
    const h = convHuella(x.alumno, x.grado, x.seccion);
    const t = q[h];
    if (!t) return;
    if (!t.act) { t.act = String(x.act || ''); return; }
    if (x.act && String(x.act) !== String(t.act)) delete q[h];
  });
  c.quitados = q;
  return q;
}

/* ── Quitar a alguien que contestó el enlace ──
   Se guarda la fila ENTERA en el escondite, no solo su huella: es lo
   que permite volver a ponerla si el maestro se equivocó de renglón —y
   se equivoca, con cuarenta nombres y el teléfono en la mano—. Cuando
   el servidor confirma el borrado, allá ya no queda nada que traer. */
async function convQuitarRespuesta(c, x) {
  const h = convHuella(x.alumno, x.grado, x.seccion);
  const enNube = !!c.codigo;
  if (!await metasConfirm('Se quita a **' + adEsc(x.alumno) + '** de tu lista' +
    (x.va ? ' y de tus cuentas: ya no ocupa asiento, ni aporte, ni boleto.' : '.') +
    (enNube ? '\n\nSe borra también del enlace, así que el contador que ven las familias baja.' : '') +
    '\n\n⚠️ Si esa familia vuelve a contestar el enlace, **vuelve a salir**: eso no se puede esconder. ' +
    'Y si te equivocaste, la vuelves a poner desde **🗑 Quitados de la lista**, al final de esta pantalla.',
    { icono: '🗑️', titulo: 'Quitar de la lista', okTxt: 'Sí, quitarla' })) return;
  adUndoGuardar('Quitar una respuesta de la convocatoria');
  const borrada = enNube ? await convQuitarNube(c, h) : false;
  convGuardar(y => {
    y.quitados = convQuitados(y);
    y.quitados[h] = {
      alumno: x.alumno || '', grado: x.grado || '', seccion: x.seccion || '',
      personas: Number(x.personas) || 0, tel: x.tel || '', nota: x.nota || '',
      va: x.va ? 1 : 0, act: String(x.act || ''), nube: borrada ? 1 : 0, fecha: adHoy(),
    };
    /* Confirmado el borrado, la fila sale también de la copia local: así
       el espejo de «lo que ve el padre» baja con el contador de verdad. */
    if (borrada) {
      y.resp = (Array.isArray(y.resp) ? y.resp : [])
        .filter(r => convHuella(r.alumno, r.grado, r.seccion) !== h);
    }
  });
  renderAdmin();
  toast(borrada ? '🗑️ Quitada de tu lista y del enlace'
    : enNube ? '🗑️ Quitada de tu lista · sin señal para el enlace, se reintenta solo'
    : '🗑️ Quitada de tu lista');
}

/* ── Volver a ponerla ──
   Si el servidor ya la borró no hay nada que traer de vuelta, así que
   la fila guardada se reingresa como apuntada a mano: mismo nombre,
   mismo grado y misma huella, o sea el MISMO folio de boleto que la
   familia ya tiene guardado en su teléfono. */
async function convDevolver(c, huella) {
  const t = convQuitados(c)[huella];
  if (!t) return;
  if (!await metasConfirm('**' + adEsc(t.alumno) + '** vuelve a la lista y a las cuentas' +
    (t.nube ? ', apuntada a mano: en el enlace ya se había borrado.' : '.') +
    '\n\n¿La devuelvo?', { icono: '↩️', titulo: 'Volver a ponerla', okTxt: 'Sí, devolverla' })) return;
  convGuardar(y => {
    const q = convQuitados(y);
    const g = q[huella];
    delete q[huella];
    y.quitados = q;
    if (g && g.nube) {
      y.manual = Array.isArray(y.manual) ? y.manual : [];
      if (!y.manual.some(m => convHuella(m.alumno, m.grado, m.seccion) === huella)) {
        y.manual.push({
          id: 'M' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
          va: g.va ? 1 : 0, alumno: g.alumno, grado: g.grado, seccion: g.seccion,
          personas: Math.max(1, Number(g.personas) || 1), tel: g.tel || '',
          nota: g.nota || '', fecha: adHoy(),
        });
      }
    }
  });
  renderAdmin();
  toast('↩️ ' + (adPrimerNombre(t.alumno) || 'La familia') + ' vuelve a la lista');
}

/* ══════════════ 💵 EL CONTROL DE PAGOS ══════════════
   La convocatoria PREGUNTA quién va; esto anota QUIÉN YA PAGÓ. Son dos
   cosas distintas y las dos hacen falta el mismo viernes: con la
   primera se contratan los buses, con la segunda se sabe si el dinero
   alcanza para pagarlos.

   Se venía llevando en un cuaderno aparte, y ahí se pierde de las dos
   maneras, que cuestan lo mismo: el maestro le cobra dos veces a la
   madre que ya pagó —y queda mal delante de ella— o deja subir al bus a
   quien no ha dado nada y pone él la diferencia de su bolsa.

   ⚠️ POR QUÉ NO SE USA LA COLECTA DE 💰 ECONOMÍA. Aquella se lleva por
   NÚMERO DE LISTA, así que solo sabe de los alumnos del grupo propio.
   Aquí contesta la escuela entera —el enlace se manda al grupo grande— y
   buena parte de los que van son de otros grados, que no tienen número
   en ninguna lista suya. El puente a Economía sigue donde estaba, para
   quien quiera llevar allí las cuentas de su propio grupo.

   TRES REGLAS, Y NINGUNA ES DE ADORNO:

   1. SE GUARDA EN `c.pagos`, NUNCA DENTRO DE `c.resp`. Traer las
      respuestas reemplaza `resp` entero con lo que venga de la nube: un
      pago guardado ahí se borraría en el primer «Traer las respuestas»
      y el maestro se enteraría cobrándole otra vez a quien ya le pagó.
      Es la misma razón por la que los apuntados a mano viven aparte.
   2. LA LLAVE ES LA HUELLA DE SIEMPRE (nombre + grado + sección). Así el
      pago sigue pegado a su familia venga del enlace o del cuaderno, y
      no se despega si el maestro corrige después cuántas personas van.
   3. EL PAGO NO VIAJA A LA NUBE. Lo que sale por el enlace es el evento
      y cuántos van en total; quién pagó y cuánto es plata de las
      familias y se queda en el equipo del maestro, igual que los
      teléfonos y los nombres.

   Se guarda el MONTO y no un sí/no porque el ABONO es lo normal en un
   aula: la madre trae L 100 de los L 250 el lunes y el resto el jueves.
   Lo que se le sigue debiendo se calcula, nunca se escribe. */
function convPagos(c) {
  return (c && c.pagos && typeof c.pagos === 'object') ? c.pagos : {};
}
/* Lo que le toca a esa familia. El aporte es POR PERSONA y no por
   alumno: en una excursión va el niño y va la mamá, y las dos comen y
   ocupan asiento. */
function convToca(c, x) {
  return (Number(c.aporte) || 0) * (Number(x && x.personas) || 0);
}
function convPago(c, x) {
  if (!x) return null;
  const p = convPagos(c)[convHuella(x.alumno, x.grado, x.seccion)];
  if (!p || typeof p !== 'object') return null;
  return { monto: Math.max(0, Number(p.monto) || 0), fecha: String(p.fecha || '') };
}
function convDebe(c, x) {
  const p = convPago(c, x);
  return Math.max(0, convToca(c, x) - (p ? p.monto : 0));
}
window.convPago = convPago;
window.convDebe = convDebe;

/* Por grado, y dentro de cada grado por nombre. Es como se cobra —el
   maestro sale al recreo con lo de 6º y vuelve— y como se busca a
   alguien en una lista. La pantalla y el papel usan ESTA misma
   partición: si cada uno ordenara a su manera, el maestro tendría que ir
   emparejando dos listas distintas con el dinero en la mano. */
function convPorGrado(lista) {
  const m = {};
  lista.forEach(x => {
    const k = adGradoSeccion(x.grado, x.seccion) || String(x.grado || '').trim() || 'Sin grado';
    (m[k] = m[k] || []).push(x);
  });
  return Object.keys(m).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    .map(k => ({
      k,
      filas: m[k].slice().sort((a, b) =>
        String(a.alumno || '').localeCompare(String(b.alumno || ''), 'es')),
    }));
}
function convGradoTotales(c, filas) {
  const t = { fam: filas.length, personas: 0, toca: 0, pagado: 0, debe: 0, pagadas: 0 };
  filas.forEach(x => {
    const p = convPago(c, x), d = convDebe(c, x);
    t.personas += Number(x.personas) || 0;
    t.toca += convToca(c, x);
    t.pagado += p ? p.monto : 0;
    t.debe += d;
    if (p && d <= 0) t.pagadas++;
  });
  return t;
}

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
     enseñar esta cifra y no la de arriba. Su pantalla nunca le miente.
     Por eso aquí se lee `c.resp` PELADO, sin quitar los quitados: mientras
     el borrado no haya entrado en el servidor —sin señal, por ejemplo— el
     padre los sigue contando, y el espejo tiene que decir eso. Cuando el
     servidor confirma el borrado, la fila sale de `c.resp` y el espejo baja
     solo. */
  const nube = (Array.isArray(c.resp) ? c.resp : []).filter(x => x.va);
  const aMano = si.filter(x => x.aMano);
  /* El dinero que YA está en la mano del maestro, y el que le falta por
     cobrar. `falta` se suma familia por familia y NO se resta de lo
     esperado: si una pagó de más —trajo un billete redondo y dijo «para
     la gasolina»—, la resta escondería lo que otra sigue debiendo, que es
     justo a quien hay que ir a buscar. */
  const recogido = si.reduce((a, x) => { const p = convPago(c, x); return a + (p ? p.monto : 0); }, 0);
  const falta = si.reduce((a, x) => a + convDebe(c, x), 0);
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
    recogido, falta,
    pagadas: si.filter(x => convPago(c, x) && convDebe(c, x) <= 0).length,
    abonaron: si.filter(x => convPago(c, x) && convDebe(c, x) > 0).length,
    deudoras: si.filter(x => convDebe(c, x) > 0).length,
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
    b.addEventListener('click', () => { _adConvId = b.dataset.cvid; _convAvSalto = {}; _convAbBusca = ''; renderAdmin(); }));
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

    ${/* El día de la salida, la subida al bus va ANTES que nada: ese día
          el maestro no abre esto para copiar el mensaje de WhatsApp,
          lo abre en el portón con el bus andando. */''}
    ${pub && convAbordoArriba(c) ? convHtmlAbordo(c) : ''}
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
        ${Number(c.aporte) > 0 && (t.recogido || t.pagadas) ? `<div class="ad-cv-cif ad-cv-plata ad-cv-cobrado"><b>${adEsc(adLps(t.recogido))}</b><span>ya recogido</span></div>` : ''}
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

    ${/* El día de la salida la subida al bus sube al principio de la
          pantalla; los demás días vive aquí, debajo del conteo. */''}
    ${convAbordoArriba(c) ? '' : convHtmlAbordo(c)}

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
        avisarle un cambio de hora. Si alguien se apuntó <strong>por error</strong> —una prueba tuya, un
        nombre de broma, el que se equivocó de convocatoria—, quítalo con <strong>🗑</strong>: deja de
        ocupar asiento, aporte y boleto.</p>
      ${si.map(x => `<div class="ad-gasto-row">
        <span><strong>${adEsc(x.alumno)}</strong>${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}${
          x.aMano ? ' <span class="ad-cv-tag">🖊️ a mano</span>' : ''}<br>
          <small>🎟️ ${adEsc(convFolioDe(c, x))} · ${x.personas} persona${x.personas === 1 ? '' : 's'}${Number(c.aporte) > 0
            ? ' · ' + adEsc(adLps(Number(c.aporte) * x.personas)) : ''}</small>${x.aMano ? `
          <span class="ad-cv-mini">
            <button data-cvmper="${adEsc(x.id)}" data-d="-1" aria-label="Una persona menos">−</button>
            <button data-cvmper="${adEsc(x.id)}" data-d="1" aria-label="Una persona más">+</button>
            <button data-cvmdel="${adEsc(x.id)}" aria-label="Quitar de la lista">🗑</button>
          </span>` : `
          <span class="ad-cv-mini">
            <button data-cvdel="${adEsc(convHuella(x.alumno, x.grado, x.seccion))}"
              aria-label="Quitar a ${adEsc(x.alumno)} de la lista">🗑 Quitar</button>
          </span>`}</span>
        <span>${x.tel ? '<button class="ad-al-code" data-cvtel="' + adEsc(x.tel) +
          '" data-cvhuella="' + adEsc(convHuella(x.alumno, x.grado, x.seccion)) + '">📲 ' + adEsc(x.tel) + '</button>' : ''}</span>
      </div>`).join('')}
      ${convHtmlPuentes(c, d)}
    </div>` : ''}

    ${/* En su propio cajón: la subida al bus lo repinta sin tocar el
          resto de la pantalla, para que lo cobrado en el portón se vea
          aquí en el momento. */''}
    <div id="cv-pagos">${convHtmlPagos(c, t)}</div>

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
        <span><small>${adEsc(x.nota || '—')}</small>
          ${/* Aquí también se quita: por el enlace entra el que se
                equivocó de convocatoria y dijo que no a una salida que no
                era la suya. El de a mano se quita por su id, como en su
                propia tarjeta. */''}
          <button class="ad-al-del" ${x.aMano ? 'data-cvmdel="' + adEsc(x.id) + '"'
            : 'data-cvdel="' + adEsc(convHuella(x.alumno, x.grado, x.seccion)) + '"'
          } aria-label="Quitar a ${adEsc(x.alumno)} de la lista">✕</button></span></div>`).join('')}
    </div>` : ''}

    ${convHtmlQuitados(c)}`;
}

/* ── 🗑 Los que se quitaron ──
   La lista no se enseña para presumirla: se enseña porque el maestro
   quita renglones con cuarenta nombres delante y el teléfono en la
   mano, y se equivoca. Sin este cajón, quitar a quien no era se
   arreglaría volviendo a preguntarle a la familia. */
function convHtmlQuitados(c) {
  const q = convQuitados(c);
  const hs = Object.keys(q);
  if (!hs.length) return '';
  return `
    <div class="pa-card">
      <div class="pa-card-title">🗑 Quitados de la lista (${hs.length})</div>
      <p class="pa-optional-hint">No cuentan para nada: ni asiento, ni aporte, ni boleto. Si quitaste a
        quien no era, <strong>devuélvela</strong> y vuelve a su sitio con su mismo folio.</p>
      ${hs.map(h => {
        const x = q[h];
        return `<div class="ad-gasto-row">
        <span>${adEsc(x.alumno)}${x.grado ? ' · ' + adEsc(adGradoSeccion(x.grado, x.seccion)) : ''}<br>
          <small>${x.va ? x.personas + ' persona' + (x.personas === 1 ? '' : 's') : 'había dicho que no'}${
            x.nube ? ' · borrada también del enlace' : ' · sigue contando en el enlace'}</small></span>
        <span><button class="ad-al-code" data-cvdevolver="${adEsc(h)}">↩️ Devolverla</button></span>
      </div>`;
      }).join('')}
      <p class="pa-optional-hint" style="margin-top:8px">⚠️ Si esa familia <strong>vuelve a contestar el
        enlace</strong>, vuelve a salir sola en la lista de arriba. Una respuesta escondida es una
        respuesta perdida, y eso deja gente en el portón.</p>
    </div>`;
}

/* ══════════════ 💵 PANTALLA: QUIÉN YA PAGÓ ══════════════
   Se toca la fila y queda pagada por lo que le toca, que es el caso de
   nueve de cada diez; se toca otra vez para escribir un abono o para
   quitar la marca. Es la MISMA forma de anotar que ya tiene la colecta
   de 💰 Economía, y a propósito: el maestro no tiene por qué aprenderse
   dos maneras distintas de marcar que alguien le dio dinero.

   Va repartida POR GRADO, igual que el papel. Una lista corrida de
   cuarenta nombres de toda la escuela no se recorre en un teléfono, y
   además no es como se cobra: se cobra por grado, en el recreo. */
function convHtmlPagos(c, t) {
  const ap = Number(c.aporte) || 0;
  const si = convTodas(c).filter(x => x.va);
  /* Sin aporte no hay nada que cobrar y la tarjeta solo estorbaría: hay
     convocatorias que no piden un centavo (una reunión, un acto). */
  if (!ap || !si.length) return '';
  const grupos = convPorGrado(si);
  const pend = t.deudoras;
  return `
    <div class="pa-card">
      <div class="pa-card-title">💵 Quién ya pagó</div>
      <p class="pa-optional-hint"><strong>Toca una familia</strong> para anotar que dio lo que le toca.
        <strong>Tócala otra vez</strong> para escribir un <strong>abono</strong> —trajo L 100 de los
        ${adEsc(adLps(ap))}— o para quitar la marca. Lo que quede marcado es
        <strong>dinero en tu mano</strong>, y con eso se pagan los buses.</p>
      <div class="ad-cv-cifras">
        <div class="ad-cv-cif ad-cv-plata ad-cv-cobrado"><b>${adEsc(adLps(t.recogido))}</b><span>recogido</span></div>
        <div class="ad-cv-cif ad-cv-plata ad-cv-debe"><b>${adEsc(adLps(t.falta))}</b><span>falta por cobrar</span></div>
        <div class="ad-cv-cif ad-cv-plata"><b>${t.pagadas} de ${t.familias}</b><span>familias al día</span></div>
      </div>
      ${Number(c.costoBus) > 0 ? `<p class="pa-optional-hint" style="margin-top:10px">${t.recogido >= t.costo
        ? '✅ Con lo recogido ya cubres los <strong>' + adEsc(adLps(t.costo)) + '</strong> de los buses.'
        : '⚠️ Los buses cuestan <strong>' + adEsc(adLps(t.costo)) + '</strong> y llevas <strong>' +
          adEsc(adLps(t.recogido)) + '</strong>: te faltan <strong>' + adEsc(adLps(t.costo - t.recogido)) +
          '</strong> por cobrar antes de pagarlos.'}</p>` : ''}
      <div class="ad-btn-row">
        <button class="pa-generate-btn" id="cv-pg-imprimir">🖨️ Imprimir el listado por grado</button>
        ${pend ? '<button class="pa-generate-btn ad-btn-sec" id="cv-pg-avisar">📲 Cobrarles a ' +
          (pend === 1 ? 'la familia que falta' : 'las ' + pend + ' que faltan') + '</button>' : ''}
      </div>
      <p class="pa-optional-hint">El listado sale <strong>compacto</strong> —el resumen y detrás los grados,
        uno tras otro, para gastar las menos hojas posibles— con el nombre, cuántos van, su folio, su
        teléfono, lo que le toca, lo que ya dio y una raya para que firme quien paga. Es lo que te llevas
        al recreo a cobrar y lo que entregas en la Dirección. Si necesitas <strong>repartir</strong> las
        listas, en la ventana de impresión hay un botón para sacar <strong>una hoja por grado</strong>.</p>

      ${grupos.map(g => {
        const tg = convGradoTotales(c, g.filas);
        return `
        <div class="ad-cv-grado">
          <div class="ad-cv-grado-t"><span>🏫 ${adEsc(g.k)}</span>
            <small>${tg.pagadas} de ${tg.fam} · ${adEsc(adLps(tg.pagado))}${tg.debe
              ? ' · faltan ' + adEsc(adLps(tg.debe)) : ' · al día'}</small></div>
          ${g.filas.map(x => {
            const p = convPago(c, x);
            const debe = convDebe(c, x);
            return `
            <button class="ad-cv-pg${!p ? '' : debe > 0 ? ' ad-cv-pg-abono' : ' ad-cv-pg-on'}"
              data-cvpg="${adEsc(convHuella(x.alumno, x.grado, x.seccion))}">
              <span class="ad-cv-pg-mk">${!p ? '⬜' : debe > 0 ? '🟡' : '✅'}</span>
              <span class="ad-cv-pg-n"><strong>${adEsc(x.alumno)}</strong>${x.aMano
                ? ' <span class="ad-cv-tag">🖊️ a mano</span>' : ''}<br>
                <small>${x.personas} persona${x.personas === 1 ? '' : 's'} · le toca
                  ${adEsc(adLps(convToca(c, x)))} · 🎟️ ${adEsc(convFolioDe(c, x))}</small></span>
              <span class="ad-cv-pg-m"><b>${p ? adEsc(adLps(p.monto)) : '—'}</b>
                <span>${!p ? 'sin pagar' : debe > 0 ? 'faltan ' + adEsc(adLps(debe))
                  : 'pagó el ' + adEsc(adFechaBonita(p.fecha))}</span></span>
            </button>`;
          }).join('')}
        </div>`;
      }).join('')}
    </div>`;
}

/* ── Anotar (o corregir) lo que dio una familia ──
   El primer toque anota lo que le toca, entero, con la fecha de hoy: es
   lo que pasa nueve de cada diez veces y no puede costar más de un
   toque con cuarenta familias en fila. El segundo abre la casilla, que
   es donde caben las tres cosas raras y reales: el abono, el hermano
   que paga menos y la marca puesta por error.

   La fecha del primer pago NO se cambia al corregir el monto: el dinero
   entró el día que entró, y esa fecha es la que la madre recuerda si
   algún día hay que discutirlo.

   `enPorton` es para cuando se cobra desde la subida al bus: ahí NO se
   puede repintar la pantalla entera, porque el maestro está a mitad de
   una lista de cuarenta con el bus esperando y un salto al principio de
   la página le hace perder el sitio y el nombre que estaba buscando. */
async function convPagoTocar(c, x, enPorton) {
  const h = convHuella(x.alumno, x.grado, x.seccion);
  const p = convPago(c, x);
  const toca = convToca(c, x);
  const repinta = () => { if (enPorton) convAbordoRepintar(); else renderAdmin(); };
  if (!p) {
    convGuardar(y => {
      y.pagos = convPagos(y);
      y.pagos[h] = { monto: toca, fecha: adHoy() };
    });
    repinta();
    toast('💵 ' + (adPrimerNombre(x.alumno) || 'Anotado') + ' · ' + adLps(toca));
    return;
  }
  const r = await metasPrompt('¿Cuánto ha dado en total la familia de **' + adEsc(x.alumno) +
    '**? Le tocan **' + adLps(toca) + '** por ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') +
    '.\n\nEscribe lo que llevas recibido (un abono de **100**, por ejemplo). El **0** o vacío quita la marca.',
    { icono: '💵', titulo: 'Aporte de la familia', inputmode: 'decimal',
      value: String(p.monto), okTxt: 'Guardar',
      valida: v => {
        const s = String(v).trim();
        if (s === '') return '';
        return isNaN(Number(s.replace(',', '.'))) ? 'Escribe un número (o vacío para quitar la marca).' : '';
      } });
  if (r === null) return;                       /* canceló: no se toca nada */
  const s = String(r).trim();
  const n = s === '' ? 0 : Number(s.replace(',', '.'));
  convGuardar(y => {
    y.pagos = convPagos(y);
    if (!(n > 0)) delete y.pagos[h];
    else y.pagos[h] = { monto: n, fecha: p.fecha || adHoy() };
  });
  repinta();
  toast(n > 0 ? '💵 ' + adLps(n) + ' anotados' : '↩️ Marca quitada');
}

/* ── Los botones del control de pagos ──
   Van aparte porque esta tarjeta se repinta sola cuando se cobra en el
   portón (ver convAbordoRepintar): sus botones son otros después del
   repintado, y sin volver a engancharlos quedarían de adorno.

   Se busca a la familia por su HUELLA y no por su sitio en la lista: la
   lista se reordena sola cuando entra una respuesta nueva, y un índice
   guardado en el botón acabaría anotándole el pago al de al lado. Se lee
   del almacén, no de la `c` que se pintó, porque entre el pintado y el
   toque pudo entrar una respuesta de la nube. */
function convPagosEnganchar(scope, c) {
  scope.querySelectorAll('[data-cvpg]').forEach(b =>
    b.addEventListener('click', () => {
      const cc = convUna(adLoad(), _adConvId) || c;
      const h = String(b.dataset.cvpg || '');
      const x = convTodas(cc).find(y => convHuella(y.alumno, y.grado, y.seccion) === h);
      if (x) convPagoTocar(cc, x);
    }));

  const bPgI = scope.querySelector('#cv-pg-imprimir');
  if (bPgI) bPgI.addEventListener('click', () => {
    /* Se imprime lo GUARDADO, igual que los boletos: si el maestro acaba
       de corregir el aporte en los campos de abajo, el papel tiene que
       salir con la cifra nueva y no con la que había al pintar. */
    convImprimirListado(convGuardar() || c);
  });

  /* Cobrarles a los que faltan: es el aviso de siempre, pero apuntado a
     los que deben. Empieza tanda nueva a propósito —la lista de a
     quiénes va es otra— y lleva al maestro hasta la cola, que si no se
     queda mirando la pantalla sin saber que ya cambió más abajo. */
  const bPgA = scope.querySelector('#cv-pg-avisar');
  if (bPgA) bPgA.addEventListener('click', () => {
    convGuardar(y => {
      y.aviso = { plant: CONV_AVISO_COBRO, texto: CONV_AVISOS[CONV_AVISO_COBRO].texto,
                  quien: 'deben', enviados: [], retoques: {} };
    });
    _convAvSalto = {};
    renderAdmin();
    setTimeout(() => {
      const el = document.getElementById('cv-av-cola');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 90);
  });
}

/* ══════════════ 🚌 LA SUBIDA AL BUS ══════════════
   El día de la salida se acaban las listas y empieza el portón: dos
   maestros, cuarenta familias, un bus con el motor andando y gente que
   llega a pagar en ese momento porque siempre hay quien paga a última
   hora. Ahí no se abre un cuaderno ni se busca un nombre en una lista
   de la escuela entera: se necesita ver de un golpe QUIÉN PUEDE SUBIR y
   QUIÉN TIENE QUE PAGAR PRIMERO.

   Es el 📋 pase de lista del bus, y a propósito se ve igual: chips que
   se tocan, uno por familia. El maestro ya sabe usarlo, y el día de la
   excursión no es día de aprender una pantalla nueva.

   CUATRO REGLAS, Y NINGUNA ES DE ADORNO:

   1. SE GUARDA EN `c.abordo`, NUNCA DENTRO DE `c.resp`. Es la misma
      razón de siempre: traer las respuestas reemplaza `resp` entero, y
      lo apuntado ahí se borraría solo. Aquí eso significaría perder la
      cuenta de quién está DENTRO del bus, con el bus a punto de salir.
      Y tampoco viaja a la nube (`convDatosPublicos` es lista cerrada):
      por el enlace sale el evento y cuántos van, nunca quién subió.
   2. UN TOQUE SUBE A LA FAMILIA ENTERA. Con cuarenta familias en fila y
      el bus esperando, cada toque de más es un minuto de portón. El
      SEGUNDO toque abre la casilla, que es donde caben las dos cosas
      raras y reales: que vinieran menos de los que dijo, y que el
      maestro se equivocara de chip.
   3. AL QUE DEBE NO SE LE SUBE EN SILENCIO. Se pinta en ámbar con lo
      que falta, y al tocarlo la pantalla pregunta si ya lo dio. Cobrar
      en el portón es justo lo que esta herramienta existe para no
      olvidar: al que sube sin pagar no se le vuelve a ver el pelo hasta
      la semana siguiente, y la diferencia la pone el maestro.
   4. SE CUENTAN PERSONAS, NO FAMILIAS. En el bus va el niño y va la
      mamá, y los asientos son de personas. Lo que se cuenta al subir es
      lo que de verdad se montó, no lo que se había apuntado.

   ⚠️ Y NO SE REPINTA LA PANTALLA ENTERA (`convAbordoRepintar`, sin
   `renderAdmin`). Es la misma regla que la cola de avisos y la barra de
   grupos: el maestro está a mitad de una lista larga, con un nombre
   escrito en el buscador, y un salto al principio de la página en cada
   familia que sube es lo que hace que cierre la aplicación y siga en un
   papel. Se repinta también el control de pagos, porque lo cobrado en
   el portón tiene que verse ahí mismo: si no, el maestro creería que no
   se guardó y se lo cobraría dos veces a la misma madre. */
function convAbordo(c) {
  return (c && c.abordo && typeof c.abordo === 'object') ? c.abordo : {};
}
function convSubio(c, x) {
  if (!x) return null;
  const s = convAbordo(c)[convHuella(x.alumno, x.grado, x.seccion)];
  if (!s || typeof s !== 'object') return null;
  return { personas: Math.max(0, Number(s.personas) || 0),
           hora: String(s.hora || ''), fecha: String(s.fecha || '') };
}
window.convSubio = convSubio;

/* La hora a la que subió. Sirve para el reclamo del lunes («mi hijo sí
   llegó»): el registro dice a qué hora se montó y con cuántos. */
function convHoraAhora() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/* Lo que el maestro mira en el portón. `debe` es SOLO lo de los que aún
   no han subido: es el dinero que tiene delante, en la fila, no el
   total pendiente de la semana —ese ya está en el control de pagos—. */
function convAbordoTotales(c) {
  const si = convTodas(c).filter(x => x.va);
  const t = { fam: si.length, personas: 0, subFam: 0, subPersonas: 0, faltaFam: 0,
              faltaPersonas: 0, debenFam: 0, debe: 0, debiendoFam: 0, debiendo: 0 };
  si.forEach(x => {
    const per = Math.max(0, Number(x.personas) || 0);
    const s = convSubio(c, x), d = convDebe(c, x);
    t.personas += per;
    if (s) {
      t.subFam++; t.subPersonas += s.personas;
      if (d > 0) { t.debiendoFam++; t.debiendo += d; }
    } else {
      t.faltaFam++; t.faltaPersonas += per;
      if (d > 0) { t.debenFam++; t.debe += d; }
    }
  });
  return t;
}

/* La subida se pone ARRIBA DEL TODO el día de la salida, y se queda
   arriba en cuanto empieza a subir gente. Ese día el maestro no abre
   esto para copiar el mensaje de WhatsApp ni para mirar cuántos buses
   necesita: lo abre en el portón, con el bus andando. Los otros días
   vuelve a su sitio, debajo del conteo. */
function convAbordoArriba(c) {
  return (c.fecha && c.fecha === adHoy()) || Object.keys(convAbordo(c)).length > 0;
}

/* Dos palabras del nombre: es lo que cabe en un chip sin cortar, y es
   como se llama a una familia en el portón. El nombre entero va en el
   `title`, en la fila de cobro y en todas las ventanas. */
function convNombreCorto(n) {
  return String(n || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join(' ');
}

/* Lo que se escribe en el buscador se compara contra esto: nombre,
   grupo y folio, todo normalizado. El folio importa porque la familia
   llega enseñando su boleto, no diciendo su nombre completo. */
function convAbordoBuscable(c, x) {
  return convNorm(String(x.alumno || '') + ' ' + adGradoSeccion(x.grado, x.seccion) + ' ' +
                  convFolioDe(c, x));
}

let _convAbBusca = '';                  /* lo escrito en el buscador del portón */

function convHtmlAbordo(c) {
  return '<div id="cv-abordo">' + convHtmlAbordoDentro(c) + '</div>';
}

function convHtmlAbordoDentro(c) {
  const si = convTodas(c).filter(x => x.va);
  if (!si.length) return '';
  const ap = Number(c.aporte) || 0;
  const a = convAbordoTotales(c);
  const t = convTotales(c);
  const grupos = convPorGrado(si);
  /* Ordenadas por grado y nombre, igual que todo lo demás: el maestro
     está mirando los chips y la fila de cobro a la vez. */
  const orden = l => l.slice().sort((p, q) =>
    String(p.grado || '').localeCompare(String(q.grado || ''), 'es', { numeric: true }) ||
    String(p.alumno || '').localeCompare(String(q.alumno || ''), 'es'));
  const cola = orden(si.filter(x => !convSubio(c, x) && convDebe(c, x) > 0));
  const faltan = orden(si.filter(x => !convSubio(c, x)));

  const consejo = !a.subFam
    ? 'Nadie ha subido todavía. Toca a la familia <strong>en el momento en que se monta</strong>: la cuenta se lleva sola y no hay que acordarse de nada.'
    : !a.faltaFam
      ? '✅ <strong>Ya subieron todos</strong>: ' + a.subPersonas + ' persona' +
        (a.subPersonas === 1 ? '' : 's') + '. Puedes arrancar.'
      : 'Faltan por subir <strong>' + a.faltaPersonas + ' persona' +
        (a.faltaPersonas === 1 ? '' : 's') + '</strong> de ' + a.faltaFam +
        ' familia' + (a.faltaFam === 1 ? '' : 's') + '.' +
        (a.debenFam ? ' De esas, <strong>' + a.debenFam + '</strong> tiene' + (a.debenFam === 1 ? '' : 'n') +
          ' que pagar antes: <strong>' + adLps(a.debe) + '</strong>.' : '');

  return `
    <div class="pa-card">
      <div class="pa-card-title">🚌 Subida al bus</div>
      <p class="pa-optional-hint">Es el pase de lista del bus. <strong>Toca a la familia cuando
        suba</strong>: el chip se pone verde y la cuenta baja sola. ${ap ? `La que todavía debe sale en
        <strong>ámbar con lo que falta</strong>, y antes de subirla te pregunta si ya te lo dio.` : ''}
        <strong>Tócala otra vez</strong> si vinieron menos de los que dijo o si te equivocaste de chip.</p>
      <div class="ad-cv-cifras">
        <div class="ad-cv-cif ad-cv-ab-si"><b>${a.subPersonas}</b><span>ya subieron</span></div>
        <div class="ad-cv-cif"><b>${a.faltaPersonas}</b><span>faltan por subir</span></div>
        ${ap ? `<div class="ad-cv-cif ad-cv-plata ad-cv-debe"><b>${adEsc(adLps(a.debe))}</b><span>por cobrar aquí</span></div>` : ''}
      </div>
      <p class="pa-optional-hint" style="margin-top:10px">${consejo}</p>
      ${a.subPersonas > t.asientos ? `<p class="pa-optional-hint">⚠️ Ya van <strong>${a.subPersonas}</strong>
        y los ${t.buses} bus${t.buses === 1 ? '' : 'es'} tienen <strong>${t.asientos} asientos</strong>.
        Cuenta antes de arrancar: nadie viaja de pie en carretera.</p>` : ''}
      ${a.debiendoFam ? `<p class="pa-optional-hint">⚠️ <strong>${a.debiendoFam}</strong>
        familia${a.debiendoFam === 1 ? '' : 's'} subió debiendo <strong>${adEsc(adLps(a.debiendo))}</strong>.
        Cóbralo en el regreso, ahí las tienes a todas juntas: el lunes ya no.</p>` : ''}
      <div class="pa-field"><label for="cv-ab-buscar">Buscar a una familia</label>
        <input type="search" id="cv-ab-buscar" class="pa-inp-field" value="${adEsc(_convAbBusca)}"
          placeholder="Su nombre, o las 4 letras del folio" autocomplete="off"></div>
      ${grupos.map(g => {
        const sub = g.filas.filter(x => convSubio(c, x)).length;
        return `
        <div class="ad-cv-grado" data-cvabg>
          <div class="ad-cv-grado-t"><span>🏫 ${adEsc(g.k)}</span>
            <small>${sub} de ${g.filas.length} subida${g.filas.length === 1 ? '' : 's'}</small></div>
          <div class="ad-chips">
            ${g.filas.map(x => {
              const s = convSubio(c, x);
              const debe = convDebe(c, x);
              const per = Math.max(0, Number(x.personas) || 0);
              const cls = s ? (debe > 0 ? 'ad-chip-on ad-cv-ab-deb' : 'ad-chip-on')
                : debe > 0 ? 'ad-chip-exc' : '';
              const ico = s ? (debe > 0 ? '🚌💵' : '🚌') : debe > 0 ? '💵' : '⬜';
              return `<button class="ad-chip ad-cv-ab ${cls}"
                data-cvab="${adEsc(convHuella(x.alumno, x.grado, x.seccion))}"
                data-cvabtxt="${adEsc(convAbordoBuscable(c, x))}"
                title="${adEsc(x.alumno)} · ${adEsc(convFolioDe(c, x))}">
                <span class="ad-chip-num">${ico} ${s ? s.personas : per}</span>
                <span class="ad-chip-nom">${adEsc(convNombreCorto(x.alumno))}</span>
                ${/* En ámbar SOLO lo que falta por cobrar: en verde lo que
                      ya está resuelto, esté arriba o esperando. */''}
                <span class="ad-chip-monto${!s && debe > 0 ? ' ad-chip-monto-esp' : ''}">${s
                  ? (s.hora ? 'subió ' + adEsc(s.hora) : 'a bordo')
                  : debe > 0 ? 'debe ' + adEsc(adLps(debe)) : '✅ al día'}</span>
              </button>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
      <p class="pa-optional-hint" id="cv-ab-nada" hidden>No hay nadie con eso. Prueba con el
        <strong>primer nombre</strong> o con las cuatro letras del folio.</p>
    </div>

    ${cola.length ? `
    <div class="pa-card">
      <div class="pa-card-title">💵 Cobran aquí, fuera del bus (${cola.length})</div>
      <p class="pa-optional-hint">Estas no han pagado y todavía no han subido. Atiéndelas
        <strong>fuera del bus</strong> —una fila aparte, en la acera— mientras el otro maestro va
        subiendo a las que están al día: así la puerta no se tapa y en diez minutos están todos
        arriba. <strong>💵 Pagó</strong> anota el dinero y la sube de una vez.</p>
      ${cola.map(x => {
        const debe = convDebe(c, x);
        const p = convPago(c, x);
        const h = adEsc(convHuella(x.alumno, x.grado, x.seccion));
        return `<div class="ad-cv-ab-fila" data-cvabtxt="${adEsc(convAbordoBuscable(c, x))}">
          <span class="ad-cv-ab-quien"><strong>${adEsc(x.alumno)}</strong> · ${adEsc(adGradoSeccion(x.grado, x.seccion))}<br>
            <small>${x.personas} persona${x.personas === 1 ? '' : 's'} · 🎟️ ${adEsc(convFolioDe(c, x))}${
              p ? ' · abonó ' + adEsc(adLps(p.monto)) + ' de ' + adEsc(adLps(convToca(c, x))) : ''}</small></span>
          <span class="ad-cv-ab-btns">
            <button class="ad-cv-ab-cobra" data-cvabcobra="${h}">💵 Pagó ${adEsc(adLps(debe))} · sube</button>
            <button class="ad-al-code" data-cvabpago="${h}" aria-label="Anotarle otro monto a ${adEsc(x.alumno)}">✏️ Otro monto</button>
            <button class="ad-al-code" data-cvabsube="${h}" aria-label="Que suba sin pagar ${adEsc(x.alumno)}">🚌 Sube sin pagar</button>
          </span>
        </div>`;
      }).join('')}
      <p class="pa-optional-hint" style="margin-top:8px">Si el otro maestro no lleva el teléfono,
        imprímele el <strong>listado por grado</strong> de 💵 Quién ya pagó: va con el folio, cuántos
        van y lo que debe cada familia, y al volver al aula se pasa a la pantalla.</p>
    </div>` : ''}

    ${a.subFam && faltan.length ? `
    <div class="pa-card">
      <div class="pa-card-title">⏳ Todavía no han subido (${faltan.length})</div>
      <p class="pa-optional-hint">Antes de arrancar, estos son los que faltan. <strong>📞 Llamar</strong>
        marca el número de la familia: cinco minutos de espera cuestan menos que dejar a un niño en el
        portón —o que salir a buscarlo a media carretera.</p>
      ${faltan.map(x => {
        const tel = String(x.tel || '').replace(/\D/g, '');
        const h = adEsc(convHuella(x.alumno, x.grado, x.seccion));
        return `<div class="ad-cv-ab-fila" data-cvabtxt="${adEsc(convAbordoBuscable(c, x))}">
          <span class="ad-cv-ab-quien"><strong>${adEsc(x.alumno)}</strong> · ${adEsc(adGradoSeccion(x.grado, x.seccion))}<br>
            <small>${x.personas} persona${x.personas === 1 ? '' : 's'} · 🎟️ ${adEsc(convFolioDe(c, x))}${
              convDebe(c, x) > 0 ? ' · debe ' + adEsc(adLps(convDebe(c, x))) : ' · ✅ al día'}</small></span>
          <span class="ad-cv-ab-btns">
            ${/* Va por el mismo camino que el chip (`data-cvab`) y no por
                  el de «sube sin pagar»: desde aquí también hay que
                  preguntarle por el aporte al que debe. */''}
            <button class="ad-cv-ab-cobra" data-cvab="${h}">🚌 Ya subió</button>
            ${tel ? `<a class="ad-al-code" href="tel:${adEsc(tel)}">📞 Llamar</a>`
              : '<span class="ad-cv-tag">sin teléfono</span>'}
          </span>
        </div>`;
      }).join('')}
    </div>` : ''}`;
}

/* Buscar en el portón. Se esconde con el DOM y NO repintando: el
   maestro está escribiendo, y repintar le quitaría el teclado y la
   letra a medias. El grado entero se esconde si no le queda nadie, que
   si no la pantalla se llena de títulos vacíos. */
function convAbordoFiltrar() {
  const cont = document.getElementById('cv-abordo');
  if (!cont) return;
  const q = convNorm(_convAbBusca);
  cont.querySelectorAll('[data-cvabtxt]').forEach(el => {
    el.hidden = !!q && String(el.dataset.cvabtxt || '').indexOf(q) < 0;
  });
  cont.querySelectorAll('[data-cvabg]').forEach(g => {
    g.hidden = !!q && !g.querySelector('[data-cvabtxt]:not([hidden])');
  });
  const nada = document.getElementById('cv-ab-nada');
  if (nada) nada.hidden = !q || !!cont.querySelector('[data-cvabtxt]:not([hidden])');
}

function convAbordoRepintar() {
  const cc = convUna(adLoad(), _adConvId);
  const cont = document.getElementById('cv-abordo');
  if (!cc || !cont) { renderAdmin(); return; }
  cont.innerHTML = convHtmlAbordoDentro(cc);
  convAbordoEnganchar(cont, cc);
  convAbordoFiltrar();
  /* Lo cobrado en el portón tiene que verse también en el control de
     pagos: si ahí siguiera diciendo «sin pagar», el maestro le cobraría
     otra vez a quien acaba de pagarle delante de él. */
  const pg = document.getElementById('cv-pagos');
  if (pg) {
    pg.innerHTML = convHtmlPagos(cc, convTotales(cc));
    convPagosEnganchar(pg, cc);
  }
}

/* Se busca a la familia por su HUELLA y se lee del almacén, igual que
   en los pagos: entre el pintado y el toque pudo entrar una respuesta
   de la nube y recolocar la lista entera. */
function convAbordoQuien(h) {
  const cc = convUna(adLoad(), _adConvId);
  if (!cc) return null;
  const x = convTodas(cc).find(y => convHuella(y.alumno, y.grado, y.seccion) === h);
  return x ? { c: cc, x } : null;
}

function convAbordoEnganchar(scope, c) {
  const $b = scope.querySelector('#cv-ab-buscar');
  if ($b) $b.addEventListener('input', () => { _convAbBusca = $b.value; convAbordoFiltrar(); });

  scope.querySelectorAll('[data-cvab]').forEach(b =>
    b.addEventListener('click', () => {
      const q = convAbordoQuien(String(b.dataset.cvab || ''));
      if (q) convAbordoTocar(q.c, q.x);
    }));

  scope.querySelectorAll('[data-cvabcobra]').forEach(b =>
    b.addEventListener('click', () => {
      const q = convAbordoQuien(String(b.dataset.cvabcobra || ''));
      if (q) convAbordoSubir(q.c, q.x, 1);
    }));

  scope.querySelectorAll('[data-cvabsube]').forEach(b =>
    b.addEventListener('click', () => {
      const q = convAbordoQuien(String(b.dataset.cvabsube || ''));
      if (q) convAbordoSubir(q.c, q.x, 0);
    }));

  /* Otro monto: es la casilla de siempre del control de pagos, para el
     abono del portón («traigo 100 y el resto el lunes»). No sube a
     nadie: el que abona sigue en la fila hasta que se monta. */
  scope.querySelectorAll('[data-cvabpago]').forEach(b =>
    b.addEventListener('click', () => {
      const q = convAbordoQuien(String(b.dataset.cvabpago || ''));
      if (q) convPagoTocar(q.c, q.x, true);
    }));
}

/* Subir a una familia. `cobra` anota de una vez lo que le faltaba: es
   el caso del portón —la madre paga y se monta en el mismo movimiento—
   y tiene que costar UN toque. La fecha del pago no se pisa si ya había
   abonado antes: el dinero entró el día que entró. */
function convAbordoSubir(c, x, cobra) {
  const h = convHuella(x.alumno, x.grado, x.seccion);
  const per = Math.max(0, Number(x.personas) || 0);
  const debe = convDebe(c, x);
  const p = convPago(c, x);
  convGuardar(y => {
    if (cobra && debe > 0) {
      y.pagos = convPagos(y);
      y.pagos[h] = { monto: convToca(c, x), fecha: (p && p.fecha) || adHoy() };
    }
    y.abordo = convAbordo(y);
    y.abordo[h] = { personas: per, hora: convHoraAhora(), fecha: adHoy() };
  });
  convAbordoRepintar();
  const nom = adPrimerNombre(x.alumno) || 'La familia';
  toast((cobra && debe > 0 ? '💵 ' + adLps(debe) + ' · ' : '🚌 ') + nom + ' sube con ' + per +
    ' persona' + (per === 1 ? '' : 's') + (!cobra && debe > 0 ? ' · queda debiendo ' + adLps(debe) : ''));
}

async function convAbordoTocar(c, x) {
  const h = convHuella(x.alumno, x.grado, x.seccion);
  const s = convSubio(c, x);
  const grupo = adGradoSeccion(x.grado, x.seccion);

  /* Ya está arriba: la casilla para las dos cosas reales —vinieron
     menos, o me equivoqué de chip—. Se enseña el nombre ENTERO: el chip
     lleva dos palabras y en un grado hay dos Génesis. */
  if (s) {
    const r = await metasPrompt('**' + adEsc(x.alumno) + '**' + (grupo ? ' · ' + adEsc(grupo) : '') +
      ' subió con **' + s.personas + ' persona' + (s.personas === 1 ? '' : 's') + '**' +
      (s.hora ? ' a las ' + adEsc(s.hora) : '') +
      '.\n\nSi vinieron menos de los que decía, escribe **cuántas subieron de verdad**. El **0** la baja del bus.',
      { icono: '🚌', titulo: 'Corregir la subida', inputmode: 'numeric',
        value: String(s.personas), okTxt: 'Guardar',
        valida: v => {
          const t = String(v).trim();
          if (t === '') return '';
          const n = Number(t.replace(',', '.'));
          return (isNaN(n) || n < 0) ? 'Escribe cuántas personas subieron (0 la baja del bus).' : '';
        } });
    if (r === null) return;
    const t = String(r).trim();
    const n = t === '' ? 0 : Math.max(0, Math.round(Number(t.replace(',', '.')) || 0));
    convGuardar(y => {
      y.abordo = convAbordo(y);
      if (!n) delete y.abordo[h];
      else y.abordo[h] = { personas: n, hora: s.hora || convHoraAhora(), fecha: s.fecha || adHoy() };
    });
    convAbordoRepintar();
    const nom = adPrimerNombre(x.alumno) || 'La familia';
    toast(n ? '🚌 ' + nom + ' · ' + n + ' a bordo' : '↩️ ' + nom + ' baja del bus');
    return;
  }

  /* Le falta el aporte: no se sube en silencio. Es la última vez que el
     maestro tiene delante a esa madre con el dinero en la cartera. */
  const debe = convDebe(c, x);
  if (debe > 0) {
    const ok = await metasConfirm('**' + adEsc(x.alumno) + '**' + (grupo ? ' · ' + adEsc(grupo) : '') +
      ' · ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') +
      '\n\nLe faltan **' + adLps(debe) + '**.\n\n¿Ya te los dio? Lo anoto y sube.',
      { icono: '💵', titulo: 'Falta el aporte', okTxt: '✅ Pagó · que suba', cancelTxt: 'Todavía no' });
    if (!ok) {
      toast('💵 ' + (adPrimerNombre(x.alumno) || 'Esa familia') + ' debe ' + adLps(debe) +
        ' · atiéndela fuera del bus');
      return;
    }
    convAbordoSubir(c, x, 1);
    return;
  }
  convAbordoSubir(c, x, 0);
}

/* ══════════════ 🖨️ EL LISTADO POR GRADO, EN PAPEL ══════════════
   Lo que el maestro se lleva al recreo a cobrar y lo que entrega en la
   Dirección cuando le piden cuentas. En la pantalla el control sirve
   para anotar; en el papel sirve para COBRAR, que es otra cosa: se
   cobra de pie, en el portón, sin la aplicación delante y con el lápiz
   en la mano.

   Cuatro decisiones, y ninguna es de adorno:

   · LA PRIMERA HOJA ES EL RESUMEN. Cuánto se esperaba, cuánto hay y
     cuánto falta, grado por grado, con las rayas de firma. Es la que se
     entrega y la que se firma; sin ella habría que ir sumando seis
     hojas a mano delante del director.
   · SALE COMPACTO: LOS GRADOS VAN SEGUIDOS. Empezó saliendo una hoja
     por grado siempre, y en una escuela que contesta entera eso son
     doce grupos de tres o cuatro familias: doce hojas con dos dedos de
     tinta y el resto en blanco. En un aula sin fotocopiadora propia,
     cada hoja se paga. Ahora los grupos se encadenan y solo saltan de
     hoja cuando no caben enteros — de trece hojas a dos.
   · PERO SE PUEDE VOLVER A UNA HOJA POR GRADO, con su botón en la
     ventana de impresión (`body.reparto`). Esa forma no se tira: es la
     que sirve para REPARTIR, la de 6º al maestro de 6º, y con los
     grados corridos habría que fotocopiar la hoja para dársela a dos
     personas. Lo que cambia entre las dos formas es dónde parte la
     hoja, nunca lo que dice el papel.
   · AL QUE NO HA PAGADO SE LE DEJA LA CASILLA EN BLANCO, con su raya.
     Esta hoja se usa cobrando: lo que ya entró va impreso con su fecha,
     y lo que falta es un hueco donde se escribe. Al volver al aula, eso
     escrito a lápiz se pasa a la pantalla.
   · EL ENCABEZADO SE REPITE EN CADA PÁGINA (va en el <thead>). Un grado
     de cuarenta familias pasa a la segunda hoja, y una hoja suelta sin
     el nombre del grado ni las columnas no se puede ni leer ni archivar.

   El ancho está medido: en carta con los márgenes de 10 mm del @page
   quedan 196 mm útiles, y las nueve columnas suman exactamente eso.
   Se comprueba con _dev/verifica-listado-pagos.js, que cuenta las
   páginas del PDF y mira que ninguna fila se salga del papel. */
function convImprimirListado(c) {
  const si = convTodas(c).filter(x => x.va);
  if (!si.length) { toast('Todavía no hay nadie que vaya'); return; }
  const ap = Number(c.aporte) || 0;
  const grupos = convPorGrado(si);
  const tot = convGradoTotales(c, si);
  const tc = convTotales(c);
  const hoy = adFechaBonita(adHoy());
  const cuando = convFechaLarga(c.fecha) + (c.hora ? ' · sale ' + c.hora : '');

  /* El encabezado se pinta una vez arriba. La copia que lleva cada grupo
     solo se ve cuando se imprime para repartir: entonces su hoja viaja
     sola al maestro de 6º y sin el título no dice ni de qué evento es.
     Repetirlo en lo compacto son quince milímetros por grupo, que en
     doce grupos es casi una hoja entera de nada. */
  const enc = solo => `
    <div class="enc${solo ? ' ' + solo : ''}">
      <div class="enc-t">${adEsc((c.icono || '📣') + ' ' + (c.titulo || 'Convocatoria'))}</div>
      <div class="enc-s">${adEsc([c.escuela, cuando, c.lugar].filter(Boolean).join(' · '))}</div>
      <div class="enc-s">Aporte: <b>${adEsc(adLps(ap))} por persona</b>${c.incluye
        ? ' (' + adEsc(c.incluye) + ')' : ''} · Listado al <b>${adEsc(hoy)}</b>${c.maestro
        ? ' · ' + adEsc(c.maestro) : ''}</div>
    </div>`;

  /* Repartiendo, las rayas de firma van al pie de CADA hoja: la del
     grado se archiva sola y sin firma no respalda a nadie. Compacto es
     un solo documento y van una vez, al final — una firma cada cuatro
     centímetros no respalda más, solo gasta papel. */
  const firmas = (quien, solo) => `
    <div class="firmas${solo ? ' ' + solo : ''}">
      <div><span class="raya"></span>${adEsc(quien)}</div>
      <div><span class="raya"></span>Recibido en Dirección</div>
    </div>`;

  const fila = (x, i) => {
    const p = convPago(c, x);
    const debe = convDebe(c, x);
    return `
      <tr class="${debe > 0 ? 'debe' : 'ok'}">
        <td class="c">${i + 1}</td>
        <td>${adEsc(x.alumno)}${x.aMano ? ' <i>(a mano)</i>' : ''}</td>
        <td class="c">${x.personas}</td>
        <td class="c fo">${adEsc(convFolioDe(c, x))}</td>
        <td class="c">${adEsc(x.tel || '—')}</td>
        <td class="n">${adEsc(adLps(convToca(c, x)))}</td>
        <td class="n">${p ? adEsc(adLps(p.monto)) + '<i>' + adEsc(adFechaBonita(p.fecha)) + '</i>' : ''}${
          /* La raya para escribir se le pone a TODO el que deba algo, no
             solo al que no ha dado nada: el que abonó L 100 va a traer
             los otros 150 y el maestro tiene que apuntarlos en el mismo
             renglón, con la hoja apoyada en la pared del portón. */
          debe > 0 ? '<span class="hueco"></span>' : ''}</td>
        <td class="n">${debe > 0 ? '<b>' + adEsc(adLps(debe)) + '</b>' : '—'}</td>
        <td></td>
      </tr>`;
  };

  const hojaGrado = g => {
    const tg = convGradoTotales(c, g.filas);
    return `
    <div class="hoja grupo">
      ${enc('solo-reparto')}
      <table>
        <colgroup><col style="width:8mm"><col style="width:45mm"><col style="width:12mm">
          <col style="width:25mm"><col style="width:22mm"><col style="width:18mm">
          <col style="width:19mm"><col style="width:17mm"><col style="width:29mm"></colgroup>
        <thead>
          <tr class="band"><th colspan="9">🏫 ${adEsc(g.k)} · ${tg.fam} familia${tg.fam === 1 ? '' : 's'}
            · ${tg.personas} persona${tg.personas === 1 ? '' : 's'} · le toca ${adEsc(adLps(tg.toca))}
            · recogido ${adEsc(adLps(tg.pagado))} · ${tg.debe
              ? 'FALTA ' + adEsc(adLps(tg.debe)) : 'AL DÍA'}</th></tr>
          <tr class="cols">
            <th class="c">Nº</th><th>Alumno</th><th class="c">Pers.</th><th class="c">Boleto</th>
            <th class="c">Teléfono</th><th class="n">Le toca</th><th class="n">Pagó</th>
            <th class="n">Falta</th><th>Firma de quien paga</th>
          </tr>
        </thead>
        <tbody>
          ${g.filas.map(fila).join('')}
          ${/* El renglón de totales solo hace falta repartiendo, que es
                cuando la hoja del grado viaja sola y hay que cuadrar las
                columnas de dinero al pie. Compacto ya lo dice la franja
                de arriba —le toca, recogido y lo que falta—, y repetirlo
                doce veces es medio dedo de hoja en blanco. */''}
          <tr class="suma solo-reparto">
            <td colspan="5">TOTAL ${adEsc(g.k)} — ${tg.pagadas} de ${tg.fam} al día</td>
            <td class="n">${adEsc(adLps(tg.toca))}</td>
            <td class="n">${adEsc(adLps(tg.pagado))}</td>
            <td class="n">${adEsc(adLps(tg.debe))}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p class="nota solo-reparto">Lo que se cobre en el portón se escribe aquí a lápiz y después se pasa a
        💵 <b>Quién ya pagó</b>, que es donde salen las cuentas.</p>
      ${firmas(c.maestro || 'Maestro responsable', 'solo-reparto')}
    </div>`;
  };

  const resumen = `
    <div class="hoja resumen">
      ${enc('')}
      <table>
        <colgroup><col style="width:45mm"><col style="width:22mm"><col style="width:22mm">
          <col style="width:36mm"><col style="width:36mm"><col style="width:34mm"></colgroup>
        <thead>
          <tr class="band"><th colspan="6">💵 Resumen del aporte, grado por grado</th></tr>
          <tr class="cols"><th>Grado</th><th class="c">Familias</th><th class="c">Personas</th>
            <th class="n">Le toca</th><th class="n">Recogido</th><th class="n">Falta</th></tr>
        </thead>
        <tbody>
          ${grupos.map(g => {
            const tg = convGradoTotales(c, g.filas);
            return `<tr class="${tg.debe > 0 ? 'debe' : 'ok'}">
              <td>${adEsc(g.k)}</td><td class="c">${tg.fam}</td><td class="c">${tg.personas}</td>
              <td class="n">${adEsc(adLps(tg.toca))}</td><td class="n">${adEsc(adLps(tg.pagado))}</td>
              <td class="n">${tg.debe > 0 ? '<b>' + adEsc(adLps(tg.debe)) + '</b>' : '—'}</td></tr>`;
          }).join('')}
          <tr class="suma"><td>TOTAL</td><td class="c">${tot.fam}</td><td class="c">${tot.personas}</td>
            <td class="n">${adEsc(adLps(tot.toca))}</td><td class="n">${adEsc(adLps(tot.pagado))}</td>
            <td class="n">${adEsc(adLps(tot.debe))}</td></tr>
        </tbody>
      </table>
      ${Number(c.costoBus) > 0 ? `<p class="nota"><b>Los buses:</b> ${tc.buses} ×
        ${adEsc(adLps(c.costoBus))} = <b>${adEsc(adLps(tc.costo))}</b>. Recogido hasta hoy:
        <b>${adEsc(adLps(tot.pagado))}</b>${tot.pagado < tc.costo
          ? ' — faltan <b>' + adEsc(adLps(tc.costo - tot.pagado)) + '</b> por cobrar antes de pagarlos'
          : ''}.</p>` : ''}
      <p class="nota solo-compacta">Abajo va grado por grado, en el mismo orden, con el nombre de cada
        familia y una raya para que firme quien paga. Lo que se cobre en el portón se escribe ahí a lápiz
        y al volver al aula se pasa a 💵 <b>Quién ya pagó</b>, que es donde salen las cuentas.</p>
      <p class="nota solo-reparto">Las hojas que siguen son una por grado, para repartirlas y cobrar con ellas.</p>
      ${firmas(c.maestro || 'Maestro responsable', 'solo-reparto')}
    </div>`;

  /* La firma de lo compacto: una sola, al final del documento entero. */
  const cierre = `
    <div class="hoja cierre solo-compacta">
      ${firmas(c.maestro || 'Maestro responsable', '')}
    </div>`;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Aportes — ${adEsc(c.titulo || 'Convocatoria')}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff;font-size:9px;}
/* 10 mm de margen dejan 196 mm útiles en carta, y las nueve columnas de
   abajo suman 195: el milímetro que sobra NO es de adorno, porque con
   border-collapse el borde de fuera cuenta medio píxel a cada lado y a
   196 clavados la tabla se pasaba del papel. Si alguna columna crece,
   otra tiene que encoger: una tabla más ancha que la hoja se corta por
   la derecha, y lo que se pierde es la firma —lo único de esta hoja que
   no se puede volver a poner después—. */
@page{size:letter;margin:10mm;}
/* ── COMPACTO (lo normal) vs UNA HOJA POR GRADO (para repartir) ──
   Lo que cambia entre los dos es DÓNDE PARTE LA HOJA, nunca lo que
   dice el papel. Compacto los grupos van seguidos y solo saltan cuando
   no caben enteros; repartiendo, cada grupo empieza hoja y se lleva su
   encabezado y su firma, porque esa hoja viaja sola al maestro de 6º.
   Doce grupos de tres familias eran doce hojas casi en blanco, y en un
   aula sin fotocopiadora propia cada hoja se paga. */
.hoja{page-break-after:auto;}
body.reparto .hoja{page-break-after:always;}
body.reparto .hoja:last-child{page-break-after:auto;}
/* Los grupos NO llevan «break-inside: avoid». Se probó y sale más
   caro: un grupo que no cabe entero en lo que queda de hoja se va
   completo a la siguiente y deja media página en blanco —justo lo que
   se estaba quitando—. Con 43 familias de un mismo grado eso era una
   hoja de más. Se dejan correr y lo que se cuida es que la franja del
   grado no se quede sola al pie (el <thead> de abajo). */
body:not(.reparto) .grupo{margin-top:2.5mm;}
body:not(.reparto) .solo-reparto{display:none;}
body.reparto .solo-compacta{display:none;}
.enc{border-bottom:2px solid #ea580c;padding-bottom:2mm;margin-bottom:3mm;}
.enc-t{font-size:13px;font-weight:900;line-height:1.2;}
.enc-s{font-size:8.5px;color:#333;margin-top:.8mm;line-height:1.35;}
table{width:100%;border-collapse:collapse;table-layout:fixed;}
/* El encabezado va en <thead> para que el navegador lo REPITA en cada
   página: un grado de cuarenta familias pasa a la segunda hoja, y una
   hoja suelta sin el nombre del grado no se puede ni leer ni archivar.
   Y no se queda solo al pie de una página: una franja de grado con la
   fila de rótulos y nada debajo no es el principio de nada. */
thead{break-inside:avoid;break-after:avoid;}
.band th{background:#fff7ed;border:1px solid #fdba74;color:#9a3412;font-size:10px;
  font-weight:900;text-align:left;padding:1.2mm 2mm;line-height:1.25;}
.cols th{background:#f1f5f9;border:1px solid #cbd5e1;font-size:7.5px;font-weight:900;
  text-transform:uppercase;letter-spacing:.2px;color:#334155;padding:.9mm 1mm;text-align:left;}
/* El relleno se aprieta; el TAMAÑO DE LETRA del cuerpo no se toca. Esta
   hoja se lee de pie en el portón y a veces con mala luz: lo que se
   recorta para que quepa es aire, nunca lo que hay que leer. */
td{border:1px solid #cbd5e1;padding:1mm;font-size:8.5px;line-height:1.2;
  vertical-align:middle;word-wrap:break-word;overflow-wrap:break-word;}
.c{text-align:center;}
.n{text-align:right;white-space:nowrap;}
.fo{font-family:'Courier New',monospace;font-size:7.5px;}
td i{display:block;font-style:normal;font-size:6.5px;color:#666;}
/* Ninguna fila se parte entre dos hojas: media fila arriba y media
   abajo deja el nombre en una página y su firma en la otra. */
tr{page-break-inside:avoid;break-inside:avoid;}
.debe td{background:#fffbeb;}
.suma td{background:#f1f5f9;font-weight:900;font-size:9px;}
/* El hueco donde se escribe a lápiz lo que se cobre en el portón. Alto
   medido: por debajo de 3,5 mm la cifra se sale por arriba de la raya. */
.hueco{display:block;border-bottom:1px solid #94a3b8;height:3.6mm;}
.nota{font-size:8px;color:#444;margin-top:2.5mm;line-height:1.4;}
.firmas{display:flex;gap:12mm;margin-top:9mm;break-inside:avoid;}
.firmas div{flex:1;text-align:center;font-size:8px;color:#444;}
.raya{display:block;border-top:1px solid #333;margin-bottom:1.2mm;}
.cierre{margin-top:6mm;}
/* Los anchos van en un <colgroup> y NO en la fila de los rótulos. Con
   table-layout fijo el navegador mira la PRIMERA fila de la tabla, y esa
   es la franja del grado, que es una sola celda con colspan: los anchos
   escritos en la fila de abajo se ignoran y las nueve columnas salen
   todas iguales —el nombre partido en cuatro renglones y la firma sin
   sitio—. El colgroup manda sobre las dos. */
.noprint{padding:6mm 6mm 0;}
.noprint button{padding:8px 16px;font-size:14px;font-weight:bold;cursor:pointer;margin:0 6px 6px 0;}
.noprint p{font-size:12px;color:#444;margin-top:3mm;max-width:170mm;line-height:1.5;}
@media print{.noprint{display:none;}}
</style></head><body>
<div class="noprint"><button onclick="window.print()">🖨️ Imprimir el listado</button>
<button id="cv-modo">🗂️ Sacarlo en una hoja por grado</button>
<p id="cv-modo-txt">Sale <strong>compacto</strong>: el resumen arriba y los grados uno detrás de otro, para
gastar las menos hojas posibles. Al que todavía no ha pagado se le deja la casilla en blanco a propósito:
se escribe ahí lo que dé, y al volver al aula se pasa a <strong>💵 Quién ya pagó</strong>, que es donde
salen las cuentas.</p>
<p>Si necesitas <strong>repartir</strong> las listas —la de 6º-1 al maestro de 6º-1— toca el botón de
arriba y cada grado sale en su propia hoja, con su encabezado y su firma.</p></div>
${resumen}
${grupos.map(hojaGrado).join('')}
${cierre}
<script>
/* El maestro elige en la misma ventana de impresión y ve el cambio antes
   de gastar papel: volver atrás a la aplicación para cambiar de forma es
   justo donde se abandona y se imprime lo que salga. */
(function () {
  var b = document.getElementById('cv-modo');
  var t = document.getElementById('cv-modo-txt');
  b.addEventListener('click', function () {
    var rep = document.body.classList.toggle('reparto');
    b.textContent = rep ? '📄 Volver a lo compacto (menos hojas)' : '🗂️ Sacarlo en una hoja por grado';
    t.innerHTML = rep
      ? 'Sale <strong>una hoja por grado</strong>, cada una con su encabezado y su firma, para repartirlas.'
      : 'Sale <strong>compacto</strong>: el resumen arriba y los grados uno detrás de otro, para gastar las menos hojas posibles.';
  });
})();
<\/script>
</body></html>`;
  const w = (typeof adPrintAbrir === 'function') ? adPrintAbrir(html) : window.open('', '_blank');
  if (w && typeof adPrintAbrir !== 'function') { w.document.write(html); w.document.close(); }
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
  const t = convTotales(c);
  return `
    <div class="pa-card">
      <div class="pa-card-title">🎟️ Los boletos</div>
      ${si.length ? `
      <p class="pa-optional-hint">Uno por familia, con lo que ya contestaron puesto. Recorta, y entrégale
        el suyo a cada una <strong>cuando recibas el aporte</strong>: el boleto es el recibo y el pase para
        subir al bus. La colilla de la izquierda la firmas y te la quedas tú.</p>
      ${Number(c.aporte) > 0 ? `<p class="pa-optional-hint">Llevas <strong>${t.pagadas} de ${t.familias}</strong>
        familias al día. Quién ha pagado y quién no lo anotas en <strong>💵 Quién ya pagó</strong>, aquí
        arriba: los boletos se imprimen todos, pero solo se entregan contra el dinero.</p>` : ''}
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
  /* Este va a los que DEBEN, no a todos: mandarle «falta el aporte» a la
     madre que ya pagó el lunes es la forma más rápida de que deje de
     leer los mensajes del maestro. El marcador es {falta} —lo que le
     queda debiendo— y no {aporte}, que es lo que le tocaba en total: a
     quien abonó L 100 de L 250 hay que pedirle 150, no 250 otra vez. */
  {
    icono: '💵', nombre: 'Falta el aporte', quien: 'deben',
    texto: 'Buenas, le escribo por «{evento}» de {alumno}. Para apartarle el asiento faltan {falta} ' +
      'del aporte. Puede traerlo a la escuela y ahí mismo le entrego su boleto {folio}. ' +
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
  ['{pagado}', 'lo que ya te ha dado'],
  ['{falta}', 'lo que le queda debiendo'],
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

/* Cuál de las plantillas es la del cobro. Se guarda en una constante en
   vez de escribir el 3 a mano: el día que se meta un aviso nuevo en
   medio, el botón «Cobrarles a los que faltan» abriría el que no era. */
const CONV_AVISO_COBRO = 3;

function convAvisoDef(c) {
  const a = (c && c.aviso && typeof c.aviso === 'object') ? c.aviso : {};
  const p = Number(a.plant);
  return {
    plant: (p >= 0 && p < CONV_AVISOS.length) ? p : 0,
    texto: typeof a.texto === 'string' ? a.texto : CONV_AVISOS[0].texto,
    quien: (a.quien === 'noVan' || a.quien === 'todos' || a.quien === 'deben') ? a.quien : 'van',
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
  const r = convTodas(c).filter(x => quien === 'noVan' ? !x.va
    : quien === 'deben' ? (x.va && convDebe(c, x) > 0)
    : (quien === 'todos' || x.va));
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
    '{pagado}': adLps(x ? ((convPago(c, x) || {}).monto || 0) : 0),
    '{falta}': adLps(x ? convDebe(c, x) : 0),
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
          ${Number(c.aporte) > 0 ? `<button type="button" class="ad-mes-btn${av.quien === 'deben' ? ' ad-mes-on' : ''}"
            data-cvavq="deben">💵 Los que deben (${n('deben')})</button>` : ''}
          <button type="button" class="ad-mes-btn${av.quien === 'noVan' ? ' ad-mes-on' : ''}"
            data-cvavq="noVan">🚫 Los que no van (${n('noVan')})</button>
          <button type="button" class="ad-mes-btn${av.quien === 'todos' ? ' ad-mes-on' : ''}"
            data-cvavq="todos">👥 Todos (${n('todos')})</button>
        </div>
        ${av.quien === 'deben' ? `<p class="pa-optional-hint">Solo a las familias que todavía deben
          algo${Number(c.aporte) > 0 ? ' del aporte' : ''}. A la que ya pagó <strong>no le llega</strong>:
          pedirle dos veces el mismo dinero es la forma más rápida de que deje de leer tus mensajes.</p>` : ''}</div>

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
    : convAvisoQuienes(c, convAvisoDef(c).quien).length
      ? `<p class="pa-optional-hint">Ninguno de los que elegiste dejó teléfono, así que no hay a quién
        mandarle. A esas familias hay que decírselo en el portón.</p>`
      /* Que no haya NADIE en el grupo elegido no es lo mismo que que
         nadie tenga teléfono, y con el cobro pasa a diario: es la buena
         noticia de que ya pagaron todos. Decirle «ninguno dejó teléfono»
         le haría buscar un problema que no existe. */
      : `<p class="pa-optional-hint">${convAvisoDef(c).quien === 'deben'
        ? '✅ <strong>No hay a quién cobrarle:</strong> todas las familias están al día.'
        : 'No hay nadie en ese grupo todavía.'}</p>`}

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
    _adConvId = null; _convAvSalto = {}; _convAbBusca = ''; renderAdmin();
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

  convPagosEnganchar(body, c);
  convAbordoEnganchar(body, c);
  convAbordoFiltrar();

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

  /* ── 🗑 Quitar a alguien que contestó el enlace, y devolverlo ──
     Igual que los pagos: se busca por HUELLA y se lee del almacén, no de
     la `c` que se pintó. Entre el pintado y el toque pudo entrar una
     respuesta de la nube y recolocar la lista entera. */
  body.querySelectorAll('[data-cvdel]').forEach(b =>
    b.addEventListener('click', () => {
      const cc = convUna(adLoad(), _adConvId) || c;
      const h = String(b.dataset.cvdel || '');
      const x = convDelEnlace(cc).find(y => convHuella(y.alumno, y.grado, y.seccion) === h);
      if (x) convQuitarRespuesta(cc, x);
    }));

  body.querySelectorAll('[data-cvdevolver]').forEach(b =>
    b.addEventListener('click', () => {
      const cc = convUna(adLoad(), _adConvId) || c;
      convDevolver(cc, String(b.dataset.cvdevolver || ''));
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
  /* La marca de tiempo del servidor viaja con la fila: es lo que después
     distingue «esta es la misma respuesta que el maestro quitó» de «esta
     familia volvió a contestar», y de eso depende que una respuesta
     nueva no se quede escondida para siempre. */
  cc.resp = filas.map(f => ({
    va: !!f.va, alumno: f.alumno || '', grado: f.grado || '', seccion: f.seccion || '',
    personas: Number(f.personas) || 0, tel: f.tel || '', nota: f.nota || '',
    act: String(f.actualizado_en || ''),
  }));
  convQuitadosSincronizar(cc);
  /* Los borrados que se quedaron sin señal se reintentan aquí, que es
     donde el maestro ya está mirando la lista. Mientras no entren, el
     padre los sigue contando y el espejo lo dice.

     Se reintenta con TODO lo que el servidor siga mandando, incluso lo
     que ya dijo haber borrado: si la fila vuelve a venir es que allá
     sigue estando, y creerle a la confirmación de ayer dejaría al padre
     contando para siempre a alguien que no va. Borrar dos veces no
     rompe nada; lo caro es no borrar. */
  const pend = Object.keys(convQuitados(cc));
  for (const h of pend) {
    if (!cc.resp.some(r => convHuella(r.alumno, r.grado, r.seccion) === h)) continue;
    if (await convQuitarNube(cc, h)) {
      cc.quitados[h].nube = 1;
      cc.resp = cc.resp.filter(r => convHuella(r.alumno, r.grado, r.seccion) !== h);
    }
  }
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
  if (Number(c.aporte) > 0) {
    L.push('Se recogería: ' + adLps(t.dinero) +
           ' · Ya recogido: ' + adLps(t.recogido) + ' · Falta: ' + adLps(t.falta));
  }
  /* De dónde salió cada uno: esta lista se pega en el grupo de maestros o
     se le manda al director, y ahí hay que poder explicar por qué el
     número no cuadra con lo que enseña el enlace. */
  if (t.manoFamilias) {
    L.push('De ellos, ' + t.manoFamilias + ' familia' + (t.manoFamilias === 1 ? '' : 's') +
           ' (' + t.manoPersonas + ' persona' + (t.manoPersonas === 1 ? '' : 's') + ') apuntadas a mano.');
  }
  L.push('');
  L.push('VAN (' + si.length + '):');
  si.forEach((x, i) => {
    /* Si hay aporte, el estado del pago va en el MISMO renglón: esta
       lista se le pega al director o al maestro de otro grado, y una
       lista de quién va sin decir quién pagó obliga a mandar dos. */
    const p = Number(c.aporte) > 0 ? convPago(c, x) : null;
    const debe = Number(c.aporte) > 0 ? convDebe(c, x) : 0;
    const plata = Number(c.aporte) <= 0 ? ''
      : !p ? ' — SIN PAGAR (' + adLps(convToca(c, x)) + ')'
      : debe > 0 ? ' — abonó ' + adLps(p.monto) + ', debe ' + adLps(debe)
      : ' — pagó ' + adLps(p.monto);
    L.push((i + 1) + '. ' + x.alumno +
      (x.grado ? ' — ' + adGradoSeccion(x.grado, x.seccion) : '') +
      ' — ' + x.personas + ' persona' + (x.personas === 1 ? '' : 's') + (x.tel ? ' — ' + x.tel : '') +
      ' — boleto ' + convFolioDe(c, x) + (x.aMano ? ' — a mano' : '') + plata);
  });
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
window.convImprimirListado = convImprimirListado;
window.convTotales = convTotales;
window.convPorGrado = convPorGrado;
window.convGradoTotales = convGradoTotales;
