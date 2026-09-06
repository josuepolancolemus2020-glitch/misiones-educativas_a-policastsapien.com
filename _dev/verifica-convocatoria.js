/* ═══════════════════════════════════════════════════════════════
   📣 ¿FUNCIONA LA CONVOCATORIA?

   Aquí se comprueban las dos cifras que, si salen mal, cuestan
   dinero de verdad:

   · EL DÍA. El padre lee «sábado 15 de agosto» y ese día se para en
     el portón. Si la fecha se corre un día —y se corre sola, porque
     new Date('2026-08-15') se lee en UTC y en Honduras enseña el 14—
     hay familias esperando el día equivocado.

   · LOS BUSES. El maestro contrata según el número que ve. Un bus de
     más es dinero tirado; uno de menos deja niños abajo. Se revisan
     los bordes: 55 personas, 56, 110.

   Y las dos formas de perder una respuesta:

   · CONTAR DOBLE. La madre que contesta dos veces tiene que CORREGIR
     su respuesta, no sumar otra. Se comprueba que la huella que va al
     servidor es la misma las dos veces.
   · PERDERLA. Si el internet falla al mandar, la pantalla tiene que
     ofrecer mandarla por WhatsApp ya escrita, con el nombre, el grado
     y cuántas personas. Sin eso, el padre cree que contestó y no.

   Y las dos cosas que empujan al que lo va dejando para después:

   · EL ARRANQUE. El maestro puede arrancar el conteo con un número
     suyo para que el primero que abra el enlace no se encuentre un
     cero. Lo que se vigila aquí es que ese número NO se le meta en sus
     cuentas: los buses y el dinero se calculan con los que contestaron
     de verdad, o contrata un bus para gente que no existe.
   · EL RELOJ. Baja de verdad, se pone rojo en las últimas horas y al
     llegar a cero cierra la lista — un reloj en cero con el botón de
     contestar debajo promete lo que el servidor va a rechazar.

   Y el BOLETO, que es lo que se llevan los dos: el folio que ve la
   madre en su teléfono tiene que ser el mismo que imprime el maestro.

   La nube NO se toca: se pone un Supabase de mentira con page.route,
   así la prueba corre sin internet y sin ensuciar los datos reales.

   El reloj se fija al sábado 8 de agosto de 2026 (page.clock) para
   que la cuenta regresiva dé siempre lo mismo.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-convocatoria.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const HOY = new Date(2026, 7, 8, 9, 0, 0);      /* sábado 8 de agosto de 2026 */

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

/* El evento de prueba: la excursión del sábado 15, con el martes 11
   como último día para contestar. */
const EVENTO = {
  v: 1, icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
  dirigido: 'Para las familias de toda la escuela',
  lugar: 'Museo Ferroviario de El Progreso',
  fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.',
  punto: 'Portón de la escuela', aporte: 250,
  incluye: ['transporte en bus', 'entrada al museo'],
  gana: ['Aprenden viendo y tocando, no solo leyendo',
         'Vuelven a casa contando lo que vieron', 'Van con su maestro todo el día'],
  cobro: 'El aporte se recibe durante la semana, con el maestro.',
  nota: 'Lleve agua, gorra y su almuerzo.',
  limite: '2026-08-11', maestro: 'Prof. Josué Polanco', wa: '50499998888',
  escuela: 'Escuela John Arnold Cook', cupos: 110, cerrada: '0',
};

/* ── Supabase de mentira ──
   Guarda lo que le mandan para poder revisarlo después: es justo lo
   que hay que comprobar (que la huella no cambie, que las personas
   viajen bien). `caer` simula el internet caído. */
function nube(estado) {
  return async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    const cuerpo = JSON.parse(route.request().postData() || '{}');
    estado.llamadas.push({ fn, cuerpo });
    if (estado.caer) { await route.abort('failed'); return; }
    let salida = null;
    if (fn === 'metas_conv_ver') {
      salida = [{ datos: estado.evento, familias: estado.familias, personas: estado.personas,
                  actualizada_en: HOY.toISOString() }];
    } else if (fn === 'metas_conv_responder') {
      salida = true;
    } else {
      salida = null;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(salida) });
  };
}

async function nuevaPagina(browser, estado) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', nube(estado));
  return page;
}

/* ══════════════ 1) La pantalla del padre ══════════════ */
async function pruebaPadre(browser) {
  console.log('\n── LA PANTALLA DEL PADRE ──');
  const estado = { evento: EVENTO, familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-si');

  const texto = await page.textContent('#app');
  comprueba(texto.includes('Excursión al Museo Ferroviario'), 'la portada trae el título del evento');

  /* EL DÍA: no puede correrse. */
  comprueba(texto.includes('sábado 15 de agosto'),
    'el día sale bien: «sábado 15 de agosto», no el 14');
  comprueba(!texto.includes('viernes 14'), 'no se corrió un día por el uso horario');

  /* La cuenta regresiva empuja sin mentir: del 8 al 11 faltan 3 días. */
  comprueba(/Faltan 3 días/.test(texto), 'la cuenta regresiva dice que faltan 3 días');
  comprueba(texto.includes('L 250'), 'se ve el aporte por persona');
  comprueba(texto.includes('31'), 'se ve la prueba social (31 personas ya confirmadas)');
  comprueba(!texto.includes('99998888') && !/Prof\. Josué Polanco.*teléfono/i.test(texto),
    'el teléfono del maestro no se pinta suelto en la portada');

  /* ── Sí va ── */
  await page.click('#b-si');
  await page.waitForSelector('#f-enviar');

  /* No deja mandar sin nombre: un «sí» sin nombre no sirve para nada */
  await page.click('#f-enviar');
  comprueba(/Escriba el nombre/.test(await page.textContent('#f-err')),
    'sin nombre no deja mandar y lo dice');

  await page.fill('#f-al', 'Ada Sarai Sevilla');
  await page.click('#f-enviar');
  comprueba(/Toque el grado/.test(await page.textContent('#f-err')),
    'sin grado tampoco, y también lo dice');

  await page.click('[data-g="6"]');
  await page.fill('#f-sec', '1');
  /* Van tres: la niña y sus dos papás */
  await page.click('#f-mas');
  await page.click('#f-mas');
  comprueba((await page.textContent('#f-num')).trim() === '3', 'el contador de personas sube a 3');
  comprueba(/L 750/.test(await page.textContent('#f-cuesta')),
    'la pantalla le dice cuánto le tocaría dar: L 750 (3 × 250)');
  await page.fill('#f-tel', '9999-7777');

  await page.click('#f-enviar');
  await page.waitForSelector('#g-volver');

  const envio = estado.llamadas.filter(l => l.fn === 'metas_conv_responder').pop();
  comprueba(!!envio, 'la respuesta salió hacia la nube');
  comprueba(envio.cuerpo.p_va === true, 'va marcado como que SÍ va');
  comprueba(envio.cuerpo.p_personas === 3, 'viajan las 3 personas, no 1');
  comprueba(envio.cuerpo.p_grado === '6' && envio.cuerpo.p_seccion === '1', 'viaja el grado y la sección');
  comprueba(/ada sarai sevilla\|6\|1/.test(envio.cuerpo.p_huella), 'la huella es nombre|grado|sección');

  const gracias = await page.textContent('#app');
  comprueba(/asiento apartado/i.test(gracias), 'la pantalla de gracias confirma el asiento');
  comprueba(gracias.includes('L 750'), 'y le recuerda cuánto tiene que dar');
  comprueba(/sábado 15 de agosto/.test(gracias), 'y en qué día tiene que estar ahí');

  const huella1 = envio.cuerpo.p_huella;
  await page.close();
  return { estado, huella1 };
}

/* ══════════════ 2) Corregirse no cuenta doble ══════════════ */
async function pruebaCorregir(browser, huella1) {
  console.log('\n── LA MADRE QUE CONTESTA DOS VECES ──');
  const estado = { evento: EVENTO, familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  /* El mismo teléfono: la respuesta guardada tiene que reconocerse */
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('METAS_SALIDA_V1', JSON.stringify({
    R4TP: { va: true, alumno: 'Ada Sarai Sevilla', grado: '6', seccion: '1',
            personas: 3, tel: '9999-7777', nota: '', subida: 1 },
  })));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-cambiar');

  const texto = await page.textContent('#app');
  comprueba(/ya contestó/i.test(texto), 'al volver le dice que ya contestó');
  comprueba(texto.includes('6º-1'),
    'el grupo se escribe 6º-1, como manda la normativa (ni «6 1» ni «61»)');
  comprueba(!(await page.$('#b-si')), 'y no le vuelve a ofrecer los dos botones');

  await page.click('#b-cambiar');
  await page.waitForSelector('#f-enviar');
  comprueba((await page.inputValue('#f-al')) === 'Ada Sarai Sevilla', 'el formulario vuelve con sus datos');
  comprueba((await page.textContent('#f-num')).trim() === '3', 'y con las 3 personas que había dicho');

  /* Se corrige: al final solo van dos */
  await page.click('#f-menos');
  await page.click('#f-enviar');
  await page.waitForSelector('#g-volver');

  const envio = estado.llamadas.filter(l => l.fn === 'metas_conv_responder').pop();
  comprueba(envio.cuerpo.p_personas === 2, 'la corrección manda 2 personas');
  comprueba(envio.cuerpo.p_huella === huella1,
    'con LA MISMA huella: el servidor corrige la fila, no añade otra');
  await page.close();
}

/* ══════════════ 3) Si falla el internet, la respuesta no se pierde ══════════════ */
async function pruebaSinInternet(browser) {
  console.log('\n── SIN INTERNET AL MANDAR ──');
  const estado = { evento: EVENTO, familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-si');

  await page.click('#b-si');
  await page.waitForSelector('#f-enviar');
  await page.fill('#f-al', 'Balloteth Camila Espino');
  await page.click('[data-g="4"]');
  await page.fill('#f-sec', '2');
  await page.click('#f-mas');
  estado.caer = true;                 /* se cae la red justo al mandar */
  await page.click('#f-enviar');
  await page.waitForSelector('#g-wa');

  const texto = await page.textContent('#app');
  comprueba(/No se pudo mandar/.test(texto), 'avisa que no se pudo mandar, sin fingir que sí');
  comprueba(!!(await page.$('#g-wa')), 'ofrece mandarla por WhatsApp');
  comprueba(!!(await page.$('#g-reintentar')), 'y volver a probar cuando haya señal');

  /* El texto que saldría por WhatsApp tiene que traer TODO lo que el
     maestro necesita para anotarla a mano. */
  const wa = await page.evaluate(() => textoRespuesta());
  comprueba(/SÍ VAMOS/.test(wa), 'el mensaje de respaldo dice que sí va');
  comprueba(wa.includes('Balloteth Camila Espino'), 'trae el nombre del alumno');
  comprueba(wa.includes('4º-2'), 'trae el grupo bien escrito');
  comprueba(/Van 2 personas/.test(wa), 'trae cuántas personas van');

  /* Y al volver la señal, el reintento sí llega */
  estado.caer = false;
  await page.click('#g-reintentar');
  await page.waitForSelector('#g-compartir');
  comprueba(/asiento apartado/i.test(await page.textContent('#app')),
    'al reintentar con señal, la respuesta entra');
  await page.close();
}

/* ══════════════ 4) Cerrada: ya nadie contesta ══════════════ */
async function pruebaCerrada(browser) {
  console.log('\n── LA LISTA YA CERRADA ──');
  const estado = { evento: Object.assign({}, EVENTO, { cerrada: '1' }),
                   familias: 40, personas: 97, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-compartir');
  const texto = await page.textContent('#app');
  comprueba(/se cerró/i.test(texto), 'dice que la lista se cerró');
  comprueba(!(await page.$('#b-si')), 'y no deja contestar');
  comprueba(!!(await page.$('#b-wa-maestro')), 'pero le deja escribirle al maestro');
  await page.close();
}

/* ══════════════ 5) Las cuentas del maestro ══════════════ */
async function pruebaCuentas(browser) {
  console.log('\n── LAS CUENTAS DE LOS BUSES ──');
  const page = await browser.newPage();
  await page.clock.install({ time: HOY });
  /* La herramienta necesita adLps de registros-admin.js; se carga entera. */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.adRenderConvocatoria === 'function');

  /* La fecha larga: la misma comprobación que del lado del padre, pero
     en el código que arma el mensaje de WhatsApp. */
  const f = await page.evaluate(() => convFechaLarga('2026-08-15'));
  comprueba(f === 'sábado 15 de agosto', 'el mensaje de WhatsApp también dice «sábado 15 de agosto» (dijo «' + f + '»)');

  const casos = await page.evaluate(() => {
    const con = (n, cap) => convTotales({
      capacidad: cap, aporte: 250, costoBus: 3500,
      resp: Array.from({ length: n }, (_, i) => ({ va: true, personas: 1, alumno: 'A' + i, grado: '6' })),
    });
    return {
      cero: con(0, 55), justo: con(55, 55), uno_mas: con(56, 55),
      dos_llenos: con(110, 55), medio: con(80, 55),
      consejo56: convConsejo(con(56, 55), {}),
      consejo110: convConsejo(con(110, 55), {}),
      consejo0: convConsejo(con(0, 55), {}),
    };
  });
  comprueba(casos.cero.buses === 0, 'con 0 personas no hace falta ningún bus');
  comprueba(casos.justo.buses === 1 && casos.justo.sobran === 0,
    '55 personas caben justas en 1 bus de 55');
  comprueba(casos.uno_mas.buses === 2 && casos.uno_mas.ultimo === 1,
    '56 personas ya son 2 buses, y el segundo iría con 1 sola persona');
  comprueba(/Ojo/.test(casos.consejo56),
    'y la pantalla se lo advierte antes de que lo contrate');
  comprueba(casos.dos_llenos.buses === 2 && casos.dos_llenos.sobran === 0,
    '110 personas son 2 buses clavados');
  comprueba(/llenos/.test(casos.consejo110), 'y lo dice: van llenos');
  comprueba(/nadie ha contestado/.test(casos.consejo0), 'con 0 respuestas no inventa un número');
  comprueba(casos.medio.dinero === 80 * 250 && casos.medio.costo === 2 * 3500,
    'el dinero que se recogería y lo que cuestan los buses salen bien');
  await page.close();
}

/* ══════════════ 6) La puerta en 📣 Comunicados ══════════════
   Vive ahí y no en ✅ Controles porque lo que sale de aquí es un
   mensaje a las familias. Y va ANTES del candado de la lista: el enlace
   se manda al grupo de toda la escuela y no necesita la lista del aula
   para nada, así que un maestro que todavía no ha metido a sus alumnos
   tiene que poder usarla igual. */
async function pruebaPuerta(browser) {
  console.log('\n── LA PUERTA EN COMUNICADOS ──');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', route => route.abort('failed'));  /* sin nube */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');

  /* Un aula sin lista de alumnos: la Convocatoria tiene que servir igual */
  await page.evaluate(() => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({
      v: 2, activo: 'G1',
      grupos: [{ id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1',
                 materias: ['Español'], lista: [], colectas: [], asistencia: [], notas: {},
                 controles: [], bitacora: [], lectura: [], convocatorias: [] }],
    }));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    renderAdmin();
    document.querySelector('[data-adtab="com"]').click();
  });
  await page.waitForSelector('#ad-ir-conv');
  ok('sin lista de alumnos, la puerta 📣 Convocatoria sigue estando en Comunicados');

  /* Y ya no está donde estaba: si se quedara en las dos, el maestro
     acabaría con dos convocatorias distintas para la misma salida. */
  const enCtrl = await page.evaluate(() => {
    document.querySelector('[data-adtab="ctrl"]').click();
    return !!document.querySelector('#ad-ir-conv');
  });
  comprueba(!enCtrl, 'y ya NO sale en Controles: hay una sola puerta');
  await page.evaluate(() => document.querySelector('[data-adtab="com"]').click());
  await page.waitForSelector('#ad-ir-conv');

  await page.click('#ad-ir-conv');
  await page.waitForSelector('[data-cvplant="0"]');
  const rot = await page.getAttribute('#admin-back-btn', 'aria-label');
  comprueba(/Volver a Comunicados/.test(rot), 'la flecha de arriba sube a Comunicados (dijo «' + rot + '»)');

  await page.click('[data-cvplant="0"]');       /* 🚌 Excursión o paseo */
  await page.waitForSelector('#cv-titulo');
  const rot2 = await page.getAttribute('#admin-back-btn', 'aria-label');
  comprueba(/mis convocatorias/i.test(rot2), 'y dentro de una, sube a la lista (dijo «' + rot2 + '»)');
  comprueba((await page.inputValue('#cv-gana-0')).length > 10,
    'la plantilla trae escritos los renglones que convencen');

  /* Se llena y se intenta publicar SIN nube: no puede perder los datos */
  await page.fill('#cv-titulo', 'Excursión al Museo Ferroviario de El Progreso');
  await page.fill('#cv-fecha', '2026-08-15');
  await page.fill('#cv-limite', '2026-08-11');
  await page.fill('#cv-aporte', '250');
  await page.click('#cv-publicar');
  await page.waitForSelector('.metas-dlg, .pa-dialog, dialog, [role="dialog"]', { timeout: 4000 }).catch(() => {});
  const guardado = await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    const c = st.grupos[0].convocatorias[0];
    return { titulo: c.titulo, fecha: c.fecha, aporte: c.aporte, codigo: c.codigo };
  });
  comprueba(guardado.titulo === 'Excursión al Museo Ferroviario de El Progreso' &&
            guardado.fecha === '2026-08-15' && guardado.aporte === 250,
    'sin internet, lo escrito NO se pierde: queda guardado en el equipo');
  comprueba(!guardado.codigo, 'y no se inventa un código que no existe en la nube');
  await page.close();
}

/* ══════════════ 7) El mensaje que se pega en WhatsApp ══════════════ */
async function pruebaMensaje(browser) {
  console.log('\n── EL MENSAJE PARA EL GRUPO ──');
  const page = await browser.newPage();
  await page.clock.install({ time: HOY });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.convMensaje === 'function');
  const m = await page.evaluate(() => convMensaje({
    icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
    escuela: 'Escuela John Arnold Cook', fecha: '2026-08-15', limite: '2026-08-11',
    hora: '6:30 a. m.', regreso: '3:00 p. m.', lugar: 'Museo Ferroviario de El Progreso',
    punto: 'Portón de la escuela', aporte: 250, incluye: 'transporte, entrada',
    gancho: 'Este sábado sus hijos van a ver de cerca lo que hasta hoy solo han visto en el libro.',
    gana: ['Aprenden viendo y tocando', 'Vuelven contando lo que vieron', 'Van con su maestro'],
    maestro: 'Prof. Josué Polanco', codigo: 'R4TP',
  }));
  console.log('\n' + m.split('\n').map(l => '    │ ' + l).join('\n') + '\n');
  comprueba(m.includes('sábado 15 de agosto'), 'el mensaje dice el día del evento');
  comprueba(m.includes('martes 11 de agosto'), 'y hasta cuándo se puede contestar');
  comprueba(m.includes('L 250'), 'y el aporte');
  comprueba(/salida\.html\?c=R4TP/.test(m), 'y lleva el enlace con su código');
  comprueba(m.includes('20 segundos'), 'y promete lo que de verdad cuesta contestar');
  comprueba(/\*.+\*/.test(m), 'usa la negrita de WhatsApp para que no pase de largo');

  /* Sin publicar no puede prometer un enlace que no existe */
  const m2 = await page.evaluate(() => convMensaje({ titulo: 'X', fecha: '2026-08-15', codigo: '' }));
  comprueba(/publica la convocatoria/.test(m2), 'sin publicar, avisa que falta el enlace');
  await page.close();
}

/* ══════════════ 8) Ya publicada: el conteo y el bucle ══════════════
   Al abrir una convocatoria publicada, la pantalla trae las respuestas
   sola —el maestro entra justo para ver el número—. Pero traerlas vuelve
   a pintar la pantalla, y sin freno eso se llama a sí mismo para siempre:
   el teléfono dando vueltas y gastando los datos del maestro. Aquí se
   cuenta cuántas veces le pregunta a la nube. */
async function pruebaPublicada(browser) {
  console.log('\n── UNA CONVOCATORIA YA PUBLICADA ──');
  const RESP = [
    { va: true, alumno: 'Ada Sarai Sevilla', grado: '6', seccion: '1', personas: 3, tel: '99991111', nota: '' },
    { va: true, alumno: 'Ashly Belén Miranda', grado: '6', seccion: '1', personas: 2, tel: '99992222', nota: '' },
    { va: true, alumno: 'Carlos Josué Meza', grado: '5', seccion: '2', personas: 2, tel: '99993333', nota: '' },
    { va: false, alumno: 'Hilda Marina Paz', grado: '6', seccion: '1', personas: 0, tel: '', nota: 'Por el aporte' },
  ];
  let veces = 0;
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    if (fn === 'metas_conv_respuestas') veces++;
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(fn === 'metas_conv_respuestas' ? RESP : true) });
  });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
      id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1', materias: ['Español'],
      lista: [{ num: 1, nombre: 'Ada Sarai Sevilla' }, { num: 2, nombre: 'Ashly Belén Miranda' }],
      colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      convocatorias: [{ id: 'V1', icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
        gancho: 'x', gana: ['a', 'b', 'c'], lugar: 'Museo Ferroviario de El Progreso',
        fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.', punto: 'Portón de la escuela',
        aporte: 250, incluye: 'transporte, entrada', cobro: '', nota: '', limite: '2026-08-11',
        dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
        wa: '50499998888', escuela: 'Escuela John Arnold Cook', capacidad: 55, costoBus: 3500,
        cupos: 110, arranque: 30, limiteHora: '16:00',
        codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-08' }],
    }] }));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    renderAdmin();
    document.querySelector('[data-adtab="com"]').click();
  });
  await page.click('#ad-ir-conv');
  await page.waitForSelector('[data-cvid]');
  await page.click('[data-cvid]');
  await page.waitForSelector('.ad-cv-cifras');
  await page.waitForTimeout(1500);          /* si hubiera bucle, aquí ya se vería */

  comprueba(veces <= 2, 'al entrar le pregunta a la nube UNA vez, no en bucle (preguntó ' + veces + ')');

  const cifras = await page.$$eval('.ad-cv-cif', ns =>
    ns.map(n => n.querySelector('b').textContent.trim()));
  const texto = await page.textContent('#ad-tab-body');
  comprueba(cifras[0] === '7', 'suma 7 personas (3 + 2 + 2), no 3 alumnos (dijo «' + cifras[0] + '»)');
  comprueba(cifras[1] === '3', 'y 3 familias');
  comprueba(cifras[2] === '1', 'con 1 bus basta para 7 personas');
  comprueba(texto.includes('L 1,750'), 'y L 1,750 de aporte (7 × 250)');
  comprueba(/6º-1/.test(texto) && /5º-2/.test(texto), 'separa por grado, escrito 6º-1 y 5º-2');
  comprueba(/Por el aporte/.test(texto), 'y dice por qué no va la que no va');
  comprueba(/1 persona\b/.test(texto) === false || !/1 personas/.test(texto),
    'no escribe «1 personas»');

  /* ── El arranque NO puede colarse en las cuentas del maestro ──
     Es la comprobación que de verdad importa de todo el empujón: si las
     30 personas de arranque se sumaran aquí, el maestro contrataría un
     bus para gente que no existe y lo pagaría de su bolsa. Arriba tiene
     que seguir leyendo 7, y el espejo —lo que ve el padre— 37. */
  comprueba(cifras[0] === '7', 'el arranque de 30 NO se suma a las personas del maestro');
  comprueba(cifras[2] === '1', 'ni a los buses: sigue siendo 1, no 1 de más');
  const espejo = await page.textContent('.ad-cv-espejo');
  comprueba(/\b37\b/.test(espejo), 'el espejo dice que el padre ve 37 personas (7 + 30)');
  comprueba(/\b73\b/.test(espejo), 'y que le quedan 73 asientos de 110');
  comprueba(/30 las pusiste tú/.test(espejo) && /7 contestaron/.test(espejo),
    'y le recuerda cuántas puso él y cuántas son de verdad');
  comprueba(/3 días/.test(espejo), 'y qué reloj está viendo el padre (3 días)');

  /* El folio del boleto: el que imprime el maestro tiene que ser el
     mismo que la madre lleva en su teléfono. */
  const folio = await page.evaluate(() =>
    convFolio('R4TP', convHuella('Ada Sarai Sevilla', '6', '1')));
  comprueba(/^R4TP-[A-Z0-9]{4}$/.test(folio), 'el folio se lee y se dicta: ' + folio);
  comprueba(texto.includes(folio), 'y sale junto al nombre en la lista de los que van');

  /* ── Los boletos en blanco, para los que apunta el maestro ──
     Lo que aquí cuesta caro es que se repita un folio: dos familias con
     el mismo papel en el portón es justo lo que el folio existe para
     evitar. El contador tiene que quedar GUARDADO en el equipo, porque
     el maestro imprime hoy diez y el jueves seis más. */
  const impresos = [];
  await page.evaluate(() => {
    window.__blancos = [];
    window.adPrintAbrir = h => { window.__blancos.push(h); return null; };
  });
  await page.fill('#cv-blancos-n', '10');
  comprueba(/2 hojas/.test(await page.textContent('#cv-blancos-hojas')),
    'diez boletos son 2 hojas, y lo dice ANTES de mandarlos a la impresora');
  await page.click('#cv-blancos');
  await page.waitForTimeout(600);
  impresos.push(await page.evaluate(() => window.__blancos[0] || ''));
  const guardado1 = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].blancos);
  comprueba(guardado1 === 10, 'después de imprimir 10, el contador queda en 10 (quedó ' + guardado1 + ')');
  comprueba(/R4TP-M01/.test(impresos[0]) && /R4TP-M10/.test(impresos[0]) && !/R4TP-M11/.test(impresos[0]),
    'y ese lote va del M01 al M10');

  /* La segunda tanda: tiene que arrancar donde acabó la primera */
  await page.evaluate(() => { window.adPrintAbrir = h => { window.__blancos.push(h); return null; }; });
  await page.fill('#cv-blancos-n', '6');
  await page.click('#cv-blancos');
  await page.waitForTimeout(600);
  const seg = await page.evaluate(() => window.__blancos[1] || '');
  comprueba(!/R4TP-M01\b/.test(seg) && /R4TP-M11/.test(seg) && /R4TP-M16/.test(seg),
    'la segunda tanda arranca en el M11 y no repite ninguno de la primera');
  const guardado2 = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].blancos);
  comprueba(guardado2 === 16, 'y el contador va por 16 (quedó ' + guardado2 + ')');
  comprueba(/no están en el conteo de la pantalla/.test(seg) && /Apuntar a mano/.test(seg),
    'el papel avisa que estos NO están contados y adónde hay que pasarlos para que cuenten');

  /* ── 🖊️ Apuntar a mano ──
     Lo que aquí cuesta dinero son las tres formas de que el número esté
     mal: que el apuntado a mano NO cuente (bus corto y niños en el
     portón), que cuente DOS veces si además contesta el enlace (bus de
     más, pagado de su bolsa), y que se pierda al traer las respuestas.
     Y una cuarta que cuesta credibilidad: que se le cuele al padre por
     el espejo, que solo puede enseñar lo que la nube sabe. */
  await page.fill('#cv-am-nom', 'Yeimi Sarahí Cárcamo');
  await page.click('[data-cvamg="6"]');
  await page.fill('#cv-am-sec', '1');
  await page.fill('#cv-am-per', '4');
  await page.click('#cv-am-add');
  await page.waitForTimeout(700);
  const cif2 = await page.$$eval('.ad-cv-cif', ns => ns.map(n => n.querySelector('b').textContent.trim()));
  comprueba(cif2[0] === '11', 'el apuntado a mano SÍ cuenta: 7 + 4 = 11 personas (dijo «' + cif2[0] + '»)');
  comprueba(cif2[1] === '4', 'y 4 familias');
  const txt2 = await page.textContent('#ad-tab-body');
  comprueba(/L 2,750/.test(txt2), 'y su aporte entra en el dinero (11 × 250)');
  comprueba(/Yeimi Sarahí Cárcamo/.test(txt2) && /a mano/.test(txt2),
    'sale en la MISMA lista de los que van, marcado como puesto a mano');

  /* El espejo enseña lo que ve el padre, y el padre no ve esto */
  const esp2 = await page.textContent('.ad-cv-espejo');
  comprueba(/\b37\b/.test(esp2) && !/\b41\b/.test(esp2),
    'el espejo sigue en 37: el padre no ve a los apuntados a mano');

  /* Traerlas otra vez NO puede llevárselos por delante */
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1200);
  const cif3 = await page.$$eval('.ad-cv-cif', ns => ns.map(n => n.querySelector('b').textContent.trim()));
  comprueba(cif3[0] === '11', 'traer las respuestas NO borra a los apuntados a mano (sigue en ' + cif3[0] + ')');

  /* Y si esa misma familia contesta el enlace, no se cuenta dos veces */
  RESP.push({ va: true, alumno: 'Yeimi Sarahí Cárcamo', grado: '6', seccion: '1', personas: 4, tel: '99994444', nota: '' });
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1200);
  const cif4 = await page.$$eval('.ad-cv-cif', ns => ns.map(n => n.querySelector('b').textContent.trim()));
  comprueba(cif4[0] === '11' && cif4[1] === '4',
    'si además contesta el enlace, NO se cuenta dos veces (dijo ' + cif4[0] + ' personas, ' + cif4[1] + ' familias)');
  comprueba(/además contestó el enlace/.test(await page.textContent('#ad-tab-body')),
    'y se lo dice al maestro, para que la quite de su lista a mano');

  /* Apuntar dos veces al mismo tampoco puede sumar: corrige */
  await page.fill('#cv-am-nom', 'Wilmer Alexis Franco');
  await page.click('[data-cvamg="4"]');
  await page.fill('#cv-am-sec', '2');
  await page.fill('#cv-am-per', '2');
  await page.click('#cv-am-add');
  await page.waitForTimeout(700);
  await page.fill('#cv-am-nom', 'Wilmer Alexis Franco');
  await page.click('[data-cvamg="4"]');
  await page.fill('#cv-am-sec', '2');
  await page.fill('#cv-am-per', '3');
  await page.click('#cv-am-add');
  await page.waitForTimeout(700);
  const cif5 = await page.$$eval('.ad-cv-cif', ns => ns.map(n => n.querySelector('b').textContent.trim()));
  comprueba(cif5[0] === '14' && cif5[1] === '5',
    'apuntar dos veces al mismo CORRIGE en vez de sumar (dijo ' + cif5[0] + ' personas, ' + cif5[1] + ' familias)');

  /* Corregir «al final van 4, no 3» tiene que costar un toque */
  await page.locator('[data-cvmper][data-d="1"]').first().click();
  await page.waitForTimeout(500);
  const cif6 = await page.$$eval('.ad-cv-cif', ns => ns.map(n => n.querySelector('b').textContent.trim()));
  comprueba(cif6[0] === '15', 'el + de la fila sube una persona (dijo «' + cif6[0] + '»)');

  /* Y su boleto sale con los demás, con folio de verdad */
  const bol = await page.evaluate(() => {
    let h = ''; const o = window.adPrintAbrir;
    window.adPrintAbrir = x => { h = x; return null; };
    const d = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    window.convImprimirBoletos(d.grupos[0].convocatorias[0]);
    window.adPrintAbrir = o;
    return h;
  });
  comprueba(/Wilmer Alexis Franco/.test(bol) && /Ada Sarai Sevilla/.test(bol),
    'el boleto del apuntado a mano se imprime en el mismo lote que los del enlace');

  /* Traer a mano tampoco puede dispararse solo */
  const antes = veces;
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1200);
  comprueba(veces === antes + 1, 'el botón «Traer las respuestas» pregunta exactamente una vez');
  await page.close();
  return folio;
}

/* ══════════════ 9) El empujón y el reloj, en la pantalla del padre ══════════════
   Las dos cosas que mueven al que lo va dejando para después. Se
   comprueban juntas porque juntas se enseñan, y porque las dos tienen
   la misma trampa: pueden acabar diciéndole al padre algo que el
   servidor no va a respetar. */
async function pruebaEmpuje(browser) {
  console.log('\n── EL ARRANQUE Y EL RELOJ ──');
  const estado = { evento: Object.assign({}, EVENTO, { arranque: 30, limiteHora: '16:00' }),
                   familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#reloj-c');

  const prueba = await page.textContent('.prueba');
  comprueba(/\b61\b/.test(prueba), 'el padre ve 61 personas (31 que contestaron + 30 de arranque)');
  comprueba(/Quedan 49 asientos/.test(prueba), 'y que quedan 49 asientos de 110');

  /* Del sábado 8 a las 9:00 hasta el martes 11 a las 4:00 pm van
     3 días, 7 horas y 0 minutos. Si el reloj tomara el límite como las
     00:00 del día 11, aquí saldrían 2 días — y ese es justo el fallo
     que deja fuera a quien iba a contestar el último día. */
  const cajas = await page.$$eval('.reloj-b', ns =>
    ns.map(n => n.querySelector('b').textContent + '|' + n.querySelector('span').textContent));
  comprueba(cajas.join(' ') === '3|DÍAS 07|HORAS 00|MIN 00|SEG',
    'el reloj marca 3 días 07:00:00 (dijo «' + cajas.join(' ') + '»)');
  comprueba(/Se cierra la lista en/.test(await page.textContent('#reloj-t')),
    'y dice para qué es ese reloj');

  /* Y late: no es una foto de la hora a la que se abrió la página. */
  await page.clock.runFor('00:05');
  const seg = await page.$$eval('.reloj-b b', ns => ns[ns.length - 1].textContent);
  comprueba(seg === '55', 'los segundos bajan solos: a los 5 segundos marca 55 (dijo «' + seg + '»)');

  /* Las últimas horas se ven distintas sin leer nada, y los «00 días»
     que no dicen nada desaparecen. Los saltos grandes van con
     fastForward y no con runFor: runFor dispararía el latido un cuarto
     de millón de veces y la prueba no acabaría nunca. */
  await page.clock.fastForward(2 * 86400000 + 22 * 3600000);
  await page.waitForSelector('.reloj.urge');
  const urg = await page.$$eval('.reloj-b b', ns => ns.map(n => n.textContent));
  comprueba(urg.length === 3, 'con menos de un día se quita la caja de los días');
  comprueba(/Últimas horas/.test(await page.textContent('#reloj-t')), 'y lo dice: últimas horas');

  /* Al llegar a cero, la pantalla NO se queda en 00:00:00 con el botón
     de contestar debajo: eso sería prometer algo que el servidor va a
     rechazar. Se cierra la lista. */
  await page.clock.fastForward(9 * 3600000);
  await page.waitForSelector('#b-compartir');
  const fin = await page.textContent('#app');
  comprueba(/se cerró/i.test(fin), 'al llegar a cero la lista se cierra sola');
  comprueba(!(await page.$('#b-si')), 'y ya no ofrece contestar');
  await page.close();
}

/* ══════════════ 10) El boleto del padre ══════════════ */
async function pruebaBoleto(browser, folioMaestro) {
  console.log('\n── EL BOLETO ──');
  const estado = { evento: EVENTO, familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-si');
  await page.click('#b-si');
  await page.waitForSelector('#f-enviar');
  await page.fill('#f-al', 'Ada Sarai Sevilla');
  await page.click('[data-g="6"]');
  await page.fill('#f-sec', '1');
  await page.click('#f-mas');
  await page.click('#f-mas');
  await page.click('#f-enviar');
  await page.waitForSelector('#boleto');

  const bol = await page.textContent('#boleto');
  const cajas = await page.$$eval('#boleto .boleto-caja', ns =>
    ns.map(n => n.querySelector('b').textContent + ' ' + n.querySelector('span').textContent));
  comprueba(bol.includes('Ada Sarai Sevilla'), 'el boleto trae el nombre del alumno');
  comprueba(bol.includes('6º-1'), 'y el grupo bien escrito');
  comprueba(cajas[0] === '3 personas', 'y para cuántas personas vale (dijo «' + cajas[0] + '»)');
  comprueba(bol.includes('L 750'), 'y el aporte que hay que llevar');

  /* LO QUE SOSTIENE TODO: el folio del padre y el del maestro son el
     mismo. Si se separan, el papel que el maestro entrega no es el que
     la madre lleva en la galería, y en el portón no se puede comprobar
     nada. */
  const folio = await page.evaluate(() => miFolio());
  comprueba(folio === folioMaestro,
    'el folio del padre es el mismo que imprime el maestro (' + folio + ' = ' + folioMaestro + ')');
  comprueba(bol.includes(folio), 'y se ve en el boleto');

  /* Y se puede guardar como foto: en pantalla se pierde al cerrar la
     pestaña, y con él se pierde el folio. */
  const png = await page.evaluate(() => dibujaBoleto().toDataURL('image/png').slice(0, 22));
  comprueba(png.indexOf('data:image/png') === 0, 'el boleto se dibuja como imagen para la galería');
  comprueba(!!(await page.$('#g-guardar')), 'y hay botón para guardarlo');

  /* La imagen se MIDE antes de pintarse. Si el alto fuera fijo, un
     título largo empujaría al aviso del final encima del renglón que
     dice para cuántas personas vale — pasó, y en una foto no se ve
     hasta que ya está guardada. Aquí se comprueba que crece. */
  const altos = await page.evaluate(() => {
    const corto = EV.titulo;
    const a = dibujaBoleto().height;
    EV.titulo = 'Excursión al Museo Ferroviario Nacional de la ciudad de El Progreso, departamento de Yoro';
    const b = dibujaBoleto().height;
    EV.titulo = corto;
    return { corto: a, largo: b };
  });
  comprueba(altos.largo > altos.corto,
    'y si el título es largo, la imagen crece en vez de comerse lo de abajo (' +
    altos.corto + 'px → ' + altos.largo + 'px)');

  /* Al volver a la portada tiene que poder volver a verlo: el boleto no
     es una pantalla de paso, es lo que enseña el día de la salida. */
  await page.click('#g-volver');
  await page.waitForSelector('#b-boleto');
  await page.click('#b-boleto');
  await page.waitForSelector('#boleto');
  ok('y al volver, el boleto sigue ahí donde lo va a buscar');
  await page.close();
}

/* ══════════════ 11) Sin internet no se promete un asiento ══════════════
   Un boleto encima de un envío que no salió es un asiento que nadie
   apartó: la madre llega el sábado con un papel que el maestro no
   tiene. Mientras no entre, lo que se le ofrece es WhatsApp. */
async function pruebaBoletoSinInternet(browser) {
  console.log('\n── EL BOLETO SIN INTERNET ──');
  const estado = { evento: EVENTO, familias: 12, personas: 31, llamadas: [], caer: false };
  const page = await nuevaPagina(browser, estado);
  await page.goto(BASE + '/salida.html?c=R4TP', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#b-si');
  await page.click('#b-si');
  await page.waitForSelector('#f-enviar');
  await page.fill('#f-al', 'Carlos Josué Meza');
  await page.click('[data-g="5"]');
  estado.caer = true;
  await page.click('#f-enviar');
  await page.waitForSelector('#g-wa');
  comprueba(!(await page.$('#boleto')), 'sin señal NO se le da boleto: no hay asiento apartado');
  comprueba(!!(await page.$('#g-wa')), 'se le ofrece mandarlo por WhatsApp, que es lo que resuelve');

  estado.caer = false;
  await page.click('#g-reintentar');
  await page.waitForSelector('#boleto');
  ok('y en cuanto entra la respuesta, aparece el boleto');
  await page.close();
}

/* ══════════════ 12) El aviso en lote a las familias ══════════════
   Entre el «sí voy» y el bus hay cinco días y siempre algo que avisar.
   Lo que aquí cuesta caro:

   · MANDARLE EL MENSAJE DE OTRO. Si los marcadores no se cambian por los
     datos de ESA familia, la madre de Ashly recibe el folio de Ada y en
     el portón discuten dos familias con el mismo papel.
   · QUE NO LLEGUE. El padre escribe ocho dígitos; wa.me sin el país
     delante abre WhatsApp sin chat, y el maestro lo descubre en la
     familia número cuarenta.
   · PERDER LA CUENTA. Manda doce, le toca clase, cierra la aplicación.
     Si la cuenta no se guarda, al volver empieza otra vez: unas familias
     reciben el aviso tres veces y otras ninguna.
   · CAMBIAR DE AVISO Y NO ENTERARSE. Del boleto al cambio de hora hay
     otra lista: si la cuenta no volviera a cero, a los que ya recibieron
     el primero no les llegaría nunca el segundo.
   · CREER QUE AVISÓ A TODOS. La familia sin teléfono tiene que salir en
     pantalla y con su nombre, o el maestro cierra tranquilo.           */
async function pruebaAvisos(browser) {
  console.log('\n── EL AVISO EN LOTE ──');
  const RESP = [
    { va: true, alumno: 'Ada Sarai Sevilla', grado: '6', seccion: '1', personas: 3, tel: '9999-1111', nota: '' },
    { va: true, alumno: 'Ashly Belén Miranda', grado: '6', seccion: '1', personas: 2, tel: '99992222', nota: '' },
    { va: true, alumno: 'Carlos Josué Meza', grado: '5', seccion: '2', personas: 2, tel: '50499993333', nota: '' },
    /* La familia sin teléfono: contestó por el enlace desde el aparato de
       una vecina y no dejó número. A esta hay que decírselo en el portón. */
    { va: true, alumno: 'Óscar Danilo Zelaya', grado: '5', seccion: '2', personas: 1, tel: '', nota: '' },
    { va: false, alumno: 'Hilda Marina Paz', grado: '6', seccion: '1', personas: 0, tel: '99995555', nota: 'Por el aporte' },
  ];
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.clock.install({ time: HOY });
  /* Se lleva la cuenta de lo que pasa por aquí porque en GitHub el traer se
     quedaba colgado en «⏳ Trayendo las respuestas…»: la petición salía y no
     volvía nunca. Con esto la sonda puede decir si llegó a la ruta simulada,
     con qué nombre, y si el que reventó fue el propio simulador —una
     excepción dentro del manejador deja la petición esperando para siempre,
     que es exactamente lo que se veía—. */
  /* ⚠️ El navegador de GitHub se cree SIN INTERNET. `convRPC` empieza con
     `if (navigator.onLine === false) return null`, que está bien puesto —sin
     señal no tiene sentido dejar al maestro mirando la rueda—, pero en un
     contenedor sin ruta por defecto esa bandera sale falsa aunque la red
     funcione. Resultado: la petición no salía nunca, la sonda no veía llegar
     nada a su nube simulada y el aviso en lote no se pintaba jamás.

     Aquí la red la pone la sonda con `page.route`, así que lo que el runner
     opine de su tarjeta de red no viene al caso: se le dice que está en línea
     y se prueba lo que se venía a probar. Se apunta además cuántas veces se
     llamó a `fetch`, que es lo que distingue «no salió» de «salió y nadie
     contestó». */
  await page.addInitScript(() => {
    try {
      Object.defineProperty(Navigator.prototype, 'onLine', { get: () => true, configurable: true });
    } catch (_) {}
    window.__fetches = 0;
    const f = window.fetch;
    window.fetch = function (...a) { window.__fetches++; return f.apply(this, a); };
  });
  const rpc = { vistas: [], fallo: '' };
  await page.route('**/rest/v1/rpc/**', async route => {
    try {
      const url = route.request().url();
      const tras = url.split('/rpc/')[1];
      const fn = tras ? tras.split('?')[0] : '(sin nombre)';
      rpc.vistas.push(fn);
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify(fn === 'metas_conv_respuestas' ? RESP : true) });
    } catch (e) {
      rpc.fallo = String(e && e.message || e);
      try { await route.abort(); } catch (_) {}
    }
  });
  /* Y lo que NO pasa por la ruta: si algo se va a la nube de verdad, allí se
     queda esperando y el maestro ve la rueda girar para siempre. */
  page.on('request', r => {
    const u = r.url();
    if (/supabase\.co/.test(u) && !/\/rpc\//.test(u)) rpc.vistas.push('FUERA:' + u.slice(0, 60));
  });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');

  /* Los wa.me que se abren se apuntan en vez de abrirse: así se puede
     revisar QUÉ número y QUÉ texto le habría llegado a cada familia. */
  const sembrar = async () => page.evaluate(() => {
    window.__wa = [];
    window.open = u => { window.__wa.push(String(u)); return null; };
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
      id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1', materias: ['Español'],
      lista: [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      convocatorias: [{ id: 'V1', icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
        gancho: 'x', gana: ['a', 'b', 'c'], lugar: 'Museo Ferroviario de El Progreso',
        fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.', punto: 'Portón de la escuela',
        aporte: 250, incluye: 'transporte, entrada', cobro: '', nota: '', limite: '2026-08-11',
        dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
        wa: '50499998888', escuela: 'Escuela John Arnold Cook', capacidad: 55, costoBus: 3500,
        cupos: 110, arranque: 30, limiteHora: '16:00', manual: [],
        codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-08' }],
    }] }));
  });
  const entrar = async () => {
    await page.evaluate(() => {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-admin').classList.add('active');
      renderAdmin();
      document.querySelector('[data-adtab="com"]').click();
    });
    await page.click('#ad-ir-conv');
    await page.waitForSelector('[data-cvid]');
    await page.click('[data-cvid]');
    await esperarAvisos();
  };

  /* La tarjeta del aviso solo se pinta si YA hay respuestas (`r.length` en
     convHtmlPantalla): sin nadie apuntado no hay a quién avisar. Las trae
     sola `convTraer` al entrar, y esa llamada se hace UNA vez por visita
     —_adConvTraido lo marca—, así que si el traer se cae, no se reintenta
     nunca y `#cv-av-txt` no llega jamás.

     Aquí se pagó: en GitHub la sonda moría con un «Timeout 30000ms» a secas,
     que no dice nada de esto y parece que la pantalla está rota. Ahora se
     reintenta el traer una vez —quitándole la marca— y, si aun así no llega,
     se cuenta QUÉ pasó: si hubo respuestas, qué dice el cartel del refresco y
     si el navegador se creía sin internet. */
  const esperarAvisos = async () => {
    const hay = async () => !!(await page.$('#cv-av-txt'));
    for (let intento = 0; intento < 2; intento++) {
      try { await page.waitForSelector('#cv-av-txt', { timeout: 15000 }); return; }
      catch (_) { /* se reintenta el traer */ }
      await page.evaluate(() => { _adConvTraido = ''; convTraer(false); });
    }
    if (await hay()) return;
    /* Esto solo corre cuando ya falló, así que NUNCA se ejecuta en una pasada
       verde: es código sin probar por definición. Por eso va entero en un
       try/catch y devuelve lo que pueda — un diagnóstico que revienta deja el
       fallo peor que como estaba. La primera versión lo hizo: leía
       `adLoad().grupos`, y `adLoad()` devuelve EL GRUPO ACTIVO, no el
       documento; el «Cannot read properties of undefined» tapó el motivo que
       venía a enseñar. */
    const diag = await page.evaluate(() => {
      const out = {};
      try { out.enLinea = navigator.onLine; } catch (_) {}
      try {
        const r = document.getElementById('cv-refresco');
        out.refresco = r ? r.textContent.trim() : '(no está)';
      } catch (_) {}
      try { out.panel = !!document.querySelector('#cv-pagos'); } catch (_) {}
      try {
        const g = adLoad() || {};
        const c = (g.convocatorias || [])[0] || {};
        out.convocatoria = c.id || '(ninguna)';
        out.respuestas = (c.resp || []).length;
      } catch (e) { out.alLeerElGrupo = String(e && e.message || e); }
      return out;
    }).catch(e => ({ alDiagnosticar: String(e && e.message || e) }));
    diag.rpcVistas = rpc.vistas;
    diag.fetches = await page.evaluate(() => window.__fetches).catch(() => '(no se pudo leer)');
    if (rpc.fallo) diag.rpcFallo = rpc.fallo;
    throw new Error('El bloque del aviso en lote no llegó a pintarse. ' +
      JSON.stringify(diag) + '\n' +
      '  · respuestas 0 significa que convTraer no trajo nada: la tarjeta del\n' +
      '    aviso no se pinta sin gente a quien avisar, así que el fallo está\n' +
      '    en el traer, no en el aviso.');
  };
  await sembrar();
  await entrar();

  /* ── A quién le toca y en qué orden ──
     Se avisa por grado, igual que se reparten los boletos: el maestro
     suele estar haciendo las dos cosas a la vez. */
  const ahora = async () => (await page.textContent('.ad-cv-ahora b')).trim();
  comprueba(await ahora() === 'Carlos Josué Meza', 'la cola arranca por el primer grado (5º), no por el orden en que contestaron');
  const cabeza = await page.textContent('.ad-cv-cola .ad-cv-blancos-t');
  comprueba(/Llevas 0 de 3/.test(cabeza),
    'cuenta 3 con teléfono de los 4 que van: el que no dejó número no entra (dijo «' + cabeza.trim() + '»)');

  /* ── El que no tiene teléfono se ve, con su nombre ── */
  const cuerpo = await page.textContent('#ad-tab-body');
  comprueba(/1 sin teléfono/.test(cuerpo) && /Óscar Danilo Zelaya/.test(cuerpo),
    'la familia sin teléfono sale aparte y con su nombre, para decírselo en el portón');

  /* ── La previa enseña el mensaje de ESA familia, ya armado ── */
  const previa = await page.inputValue('#cv-av-previa');
  comprueba(/Carlos Josué Meza/.test(previa) && !/\{alumno\}/.test(previa),
    'el mensaje que se va a mandar trae el nombre de la familia que toca, no el marcador');
  comprueba(/6:30 a\. m\./.test(previa), 'y la hora de salida puesta');
  comprueba(await page.isEditable('#cv-av-previa'),
    'y se puede escribir encima: es la casilla del mensaje, no una vitrina');

  /* ── Guardar no puede borrarle el teléfono al maestro ──
     Su número es la red de seguridad del padre al que se le cae el
     internet: la pantalla del padre le manda ahí la respuesta ya
     escrita. Estuvo desapareciendo solo, y sin ruido: el botón «Mandarlo
     por WhatsApp» compartía el id con este campo, así que al guardar una
     convocatoria publicada se leía el value vacío de un botón y el
     número se iba del equipo Y de la nube. De ese número sale además el
     prefijo de país con el que se le escribe a las familias. */
  await page.click('#cv-guardar');
  await page.waitForTimeout(900);
  const waMaestro = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].wa);
  comprueba(waMaestro === '50499998888',
    'guardar NO le borra su propio WhatsApp, que es a donde le llega la respuesta del padre sin internet (quedó «' + waMaestro + '»)');
  await page.waitForSelector('.ad-cv-ahora');

  /* ── Mandarle: número con país y texto suyo ── */
  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const wa1 = await page.evaluate(() => window.__wa[0] || '');
  comprueba(/wa\.me\/50499993333|phone=50499993333/.test(wa1),
    'el que ya traía país se manda tal cual, sin doblarlo');
  comprueba(decodeURIComponent(wa1).includes('Carlos Josué Meza'),
    'y el mensaje va con SU nombre dentro');

  comprueba(await ahora() === 'Ada Sarai Sevilla', 'al volver, la cola ya está en la siguiente familia');
  comprueba(/Llevas 1 de 3/.test(await page.textContent('.ad-cv-cola .ad-cv-blancos-t')),
    'y la cuenta subió a 1 de 3');

  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const wa2 = decodeURIComponent(await page.evaluate(() => window.__wa[1] || ''));
  const url2 = await page.evaluate(() => window.__wa[1] || '');
  /* EL FALLO QUE NO SE VE HASTA LA FAMILIA CUARENTA: ocho dígitos sin
     país abren WhatsApp sin chat. El prefijo sale del número del propio
     maestro (504…), así esto mismo sirve en Guatemala sin tocar código. */
  comprueba(/wa\.me\/50499991111|phone=50499991111/.test(url2),
    'los ocho dígitos del padre («9999-1111») salen con el 504 delante');
  comprueba(wa2.includes('Ada Sarai Sevilla') && !wa2.includes('Carlos Josué Meza'),
    'a la segunda familia le llega SU mensaje, no una copia del anterior');

  /* ── El folio y el aporte también son suyos ── */
  await page.fill('#cv-av-txt', 'Boleto {folio} de {alumno} ({grupo}), {personas}, {aporte}.');
  await page.dispatchEvent('#cv-av-txt', 'blur');
  await page.waitForTimeout(300);
  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const wa3 = decodeURIComponent(await page.evaluate(() => window.__wa[2] || ''));
  const folio3 = await page.evaluate(() => convFolio('R4TP', convHuella('Ashly Belén Miranda', '6', '1')));
  comprueba(wa3.includes(folio3), 'el folio del mensaje es el de esa familia (' + folio3 + ')');
  comprueba(wa3.includes('6º-1'), 'y su grupo, escrito 6º-1');
  comprueba(wa3.includes('2 personas') && wa3.includes('L 500'),
    'y lo que le toca pagar a ELLA: 2 personas × L 250 = L 500 (dijo «' + wa3.split('),')[1] + '»)');
  comprueba(!/1 personas|\{/.test(wa3), 'sin plurales rotos y sin marcadores sin cambiar');

  /* ── La cuenta no se pierde al cerrar la aplicación ──
     El texto se aplana antes de mirarlo: los saltos de línea del HTML no
     son lo que se está comprobando. */
  const cola = async () => (await page.textContent('#cv-av-cola')).replace(/\s+/g, ' ');
  comprueba(/Ya les mandaste a las 3 familias/.test(await cola()),
    'con las tres mandadas, la cola se da por terminada');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => { window.__wa = []; window.open = u => { window.__wa.push(String(u)); return null; }; });
  await entrar();
  comprueba(/Ya les mandaste a las 3 familias/.test(await cola()),
    'y después de cerrar y volver a abrir, sigue sabiendo a quién ya le mandó');
  comprueba((await page.inputValue('#cv-av-txt')).includes('{folio}'),
    'el mensaje que escribió el maestro tampoco se perdió');

  /* ── La última no salió: vuelve a la cola ── */
  await page.click('#cv-av-atras');
  await page.waitForTimeout(400);
  comprueba(await ahora() === 'Ashly Belén Miranda',
    'si WhatsApp no llegó a abrirse, «La última no salió» devuelve a esa familia a la cola');

  /* ── RETOCAR EL MENSAJE DE UNA SOLA FAMILIA ──
     Siempre hay una a la que hay que decirle otra cosa: «usted ya me
     trajo el aporte, solo venga por el boleto». Lo que aquí cuesta caro
     es que ese retoque se le pegue a las demás —el maestro creería que le
     escribió a una y le habría dicho a las veintisiete que ya pagaron— y
     lo contrario: que salga el de todos cuando él está viendo el suyo
     escrito en la pantalla y le da a mandar.

     Entra con Ashly a la cabeza de la cola, que es donde la dejó la
     comprobación de arriba. */
  const ultimoWa = async () => decodeURIComponent(
    await page.evaluate(() => window.__wa[window.__wa.length - 1] || ''));
  const oculto = async () => page.getAttribute('#cv-av-retoq', 'hidden');
  comprueba(await oculto() !== null, 'sin tocar nada, no hay etiqueta de mensaje retocado');

  await page.fill('#cv-av-previa', 'Doña, usted ya me trajo el aporte de Ashly. Solo venga por el boleto.');
  await page.waitForTimeout(250);
  comprueba(await oculto() === null,
    'al cambiarlo, la pantalla avisa que ese mensaje es solo de esa familia');

  /* Se manda SIN salir del campo: si hubiera que tocar fuera primero para
     que se guardara, saldría el mensaje de todos y el maestro se
     enteraría por la llamada de la madre. */
  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const waRet = await ultimoWa();
  comprueba(waRet.includes('usted ya me trajo el aporte de Ashly'),
    'y lo que sale por WhatsApp es lo retocado, aunque no se haya salido del campo');
  comprueba(!waRet.includes('Boleto R4TP'), 'no se le manda el de todos por detrás');

  /* Y AQUÍ ESTÁ LO QUE DE VERDAD IMPORTA: a las demás no se les pega */
  await page.click('#cv-av-atras');
  await page.waitForTimeout(300);
  await page.click('#cv-av-atras');
  await page.waitForTimeout(400);
  const otra = await ahora();
  const previaOtra = await page.inputValue('#cv-av-previa');
  comprueba(otra === 'Ada Sarai Sevilla' && !previaOtra.includes('ya me trajo el aporte'),
    'a la familia siguiente (' + otra + ') NO se le pega el retoque de Ashly');
  comprueba(/^Boleto R4TP-\w+ de Ada Sarai Sevilla/.test(previaOtra),
    'a ella le sigue tocando el mensaje de todas, con sus propios datos');
  comprueba(await oculto() !== null, 'y en el suyo no aparece la etiqueta de retocado');

  /* El retoque aguanta cerrar la aplicación: se escribió a las nueve de
     la noche y el teléfono se quedó sin batería. */
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => { window.__wa = []; window.open = u => { window.__wa.push(String(u)); return null; }; });
  await entrar();
  await page.click('#cv-av-salto');
  await page.waitForTimeout(400);
  comprueba(await ahora() === 'Ashly Belén Miranda' &&
    (await page.inputValue('#cv-av-previa')).includes('ya me trajo el aporte'),
    'después de cerrar y volver a abrir, el retoque de Ashly sigue escrito');

  /* Cambiar el mensaje de TODAS no puede pisarle el suyo por detrás */
  await page.fill('#cv-av-txt', 'Recuerde que {alumno} sale el {fecha}.');
  await page.waitForTimeout(300);
  comprueba((await page.inputValue('#cv-av-previa')).includes('ya me trajo el aporte'),
    'cambiar el mensaje de todas NO le borra a Ashly el suyo, que se escribió a propósito');

  /* Y se deshace de un toque */
  await page.click('#cv-av-desretoq');
  await page.waitForTimeout(600);
  comprueba((await page.inputValue('#cv-av-previa'))
      .includes('Recuerde que Ashly Belén Miranda sale el sábado 15 de agosto'),
    '«Volver al de todos» le devuelve el mensaje general, ya personalizado');
  comprueba(await oculto() !== null, 'y la etiqueta de retocado desaparece');

  /* ── Cambiar de plantilla empieza una tanda NUEVA ──
     Es lo que impide que el aviso del cambio de hora se quede sin llegar
     a los que ya recibieron el del boleto. */
  await page.click('[data-cvavp="2"]');
  await page.waitForSelector('#cv-av-txt');
  await page.waitForTimeout(400);
  comprueba(/Llevas 0 de 3/.test(await page.textContent('.ad-cv-cola .ad-cv-blancos-t')),
    'al cambiar de plantilla la cuenta vuelve a cero: el aviso nuevo le llega a TODOS');
  comprueba((await page.inputValue('#cv-av-txt')).includes('ESCRIBA AQUÍ QUÉ CAMBIÓ'),
    'y el texto se cambia por el de la plantilla nueva');

  /* ── Saltar no es borrar ── */
  const primero = await ahora();
  await page.click('#cv-av-salto');
  await page.waitForTimeout(400);
  comprueba(await ahora() !== primero, 'saltar pasa a la siguiente familia');
  await page.click('#cv-av-ir');
  await page.waitForTimeout(400);
  await page.click('#cv-av-ir');
  await page.waitForTimeout(400);
  comprueba(await ahora() === primero,
    'y la saltada vuelve al FINAL de la cola: se saltó porque no era el momento, no para dejarla sin avisar');

  /* ── Los que NO van también se pueden avisar ── */
  await page.click('[data-cvavq="noVan"]');
  await page.waitForSelector('.ad-cv-ahora');
  comprueba(await ahora() === 'Hilda Marina Paz',
    'se le puede avisar a los que dijeron que no (por si baja el aporte y se animan)');

  /* ── Tocar el teléfono de una fila manda el MISMO aviso, ya armado ── */
  await page.click('[data-cvavq="van"]');
  await page.waitForSelector('.ad-cv-ahora');
  await page.evaluate(() => { window.__wa = []; });
  await page.locator('[data-cvtel]').first().click();
  await page.waitForTimeout(400);
  const waFila = decodeURIComponent(await page.evaluate(() => window.__wa[0] || ''));
  comprueba(/504\d{8}/.test(await page.evaluate(() => window.__wa[0] || '')),
    'tocar el teléfono de una fila también manda con el país delante');
  comprueba(waFila.includes('ESCRIBA AQUÍ QUÉ CAMBIÓ') && !/\{alumno\}/.test(waFila),
    'y con el aviso que el maestro tiene escrito, ya personalizado');

  /* ── Los teléfonos para una lista de difusión ── */
  const tels = await page.evaluate(() => {
    let copiado = '';
    navigator.clipboard.writeText = t => { copiado = t; return Promise.resolve(); };
    document.getElementById('cv-av-tels').click();
    return copiado;
  });
  comprueba(/\+50499991111/.test(tels) && /Ada Sarai Sevilla/.test(tels),
    'los teléfonos se copian con país y con nombre, para guardarlos como contactos');
  comprueba(!/Óscar Danilo Zelaya/.test(tels), 'y el que no dejó número no sale en esa lista');
  comprueba(/tu número guardado/.test(await page.textContent('#cv-av-dif')),
    'y se le avisa que la difusión solo le llega a quien tenga su número guardado');

  await page.close();
}

/* ══════════════ 13) 💵 QUIÉN YA PAGÓ ══════════════

   El control de los aportes es la otra mitad de la convocatoria: con el
   conteo se contratan los buses, con esto se sabe si el dinero alcanza
   para pagarlos. Y aquí hay dinero de familias de por medio, así que lo
   que se vigila es lo que cuesta caro de verdad:

   · QUE EL PAGO NO SE PIERDA AL TRAER LAS RESPUESTAS. Traer reemplaza
     `resp` entero con lo que venga de la nube. Un pago guardado ahí se
     borraría solo, y el maestro se enteraría cobrándole otra vez a la
     madre que ya le pagó — delante de ella y sin poder demostrar nada.
   · QUE UN ABONO CORRIJA Y NO SUME. La madre trae L 100 de los L 250 el
     lunes y el resto el jueves; si el segundo apunte se sumara al
     primero, la hoja diría que pagó de más y el niño subiría al bus con
     el dinero a medias.
   · QUE LO QUE FALTA SEA LO QUE FALTA. La cifra de arriba es la que le
     hace decidir si contrata el bus o lo devuelve.
   · QUE EL COBRO SOLO LE LLEGUE AL QUE DEBE. Mandarle «falta el aporte»
     a la que pagó el lunes es la forma más rápida de que deje de leer
     los mensajes del maestro. Y a la que abonó hay que pedirle lo que
     falta, no el total otra vez.
   · QUE NO VIAJE A LA NUBE. Quién pagó y cuánto es plata de las
     familias; por el enlace solo sale el evento y cuántos van.          */
async function pruebaPagos(browser) {
  console.log('\n── 💵 QUIÉN YA PAGÓ ──');
  const RESP = [
    { va: true, alumno: 'Ada Sarai Sevilla', grado: '6', seccion: '1', personas: 3, tel: '99991111', nota: '' },
    { va: true, alumno: 'Ashly Belén Miranda', grado: '6', seccion: '1', personas: 2, tel: '99992222', nota: '' },
    { va: true, alumno: 'Carlos Josué Meza', grado: '5', seccion: '2', personas: 2, tel: '99993333', nota: '' },
    { va: false, alumno: 'Hilda Marina Paz', grado: '6', seccion: '1', personas: 0, tel: '99995555', nota: 'Por el aporte' },
  ];
  const subidas = [];                     /* lo que se le manda a la nube */
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    subidas.push({ fn, cuerpo: route.request().postData() || '' });
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(fn === 'metas_conv_respuestas' ? RESP : true) });
  });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => {
    window.__wa = [];
    window.open = u => { window.__wa.push(String(u)); return null; };
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
      id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1', materias: ['Español'],
      lista: [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      convocatorias: [{ id: 'V1', icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
        gancho: 'x', gana: ['a', 'b', 'c'], lugar: 'Museo Ferroviario de El Progreso',
        fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.', punto: 'Portón de la escuela',
        aporte: 250, incluye: 'transporte, entrada', cobro: '', nota: '', limite: '2026-08-11',
        dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
        wa: '50499998888', escuela: 'Escuela John Arnold Cook', capacidad: 55, costoBus: 3500,
        cupos: 110, arranque: 30, limiteHora: '16:00', manual: [],
        codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-08' }],
    }] }));
  });
  const entrar = async () => {
    await page.evaluate(() => {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-admin').classList.add('active');
      renderAdmin();
      document.querySelector('[data-adtab="com"]').click();
    });
    await page.click('#ad-ir-conv');
    await page.waitForSelector('[data-cvid]');
    await page.click('[data-cvid]');
    await page.waitForSelector('.ad-cv-pg');
    await page.waitForTimeout(900);
  };
  await entrar();

  /* La fila de cada familia, buscada por su nombre: la lista se reordena
     sola cuando entra una respuesta, y un índice fijo acabaría anotándole
     el pago al de al lado. */
  const fila = nom => page.locator('.ad-cv-pg', { hasText: nom }).first();
  /* El texto se aplana: los saltos de línea de la plantilla no son lo
     que se está comprobando. */
  const filaTxt = async nom => (await fila(nom).textContent()).replace(/\s+/g, ' ');
  const cifra = async rot => {
    const n = page.locator('.ad-cv-cif', { hasText: rot }).first();
    return (await n.locator('b').textContent()).trim();
  };
  const pagos = () => page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].pagos || {});

  comprueba(await page.locator('[data-cvpg]').count() === 3,
    'salen los 3 que van, y solo ellos: a quien dijo que no, no se le cobra nada');
  /* Dentro de #cv-pagos: la subida al bus reparte por grado con los
     mismos títulos, y sin acotar se estarían mirando los suyos. */
  const gr = await page.$$eval('#cv-pagos .ad-cv-grado-t span', ns => ns.map(n => n.textContent.trim()));
  comprueba(gr.length === 2 && /5º-2/.test(gr[0]) && /6º-1/.test(gr[1]),
    'repartidos por grado y en orden (5º antes que 6º), que es como se cobra');
  comprueba(/le toca L 750/.test(await filaTxt('Ada Sarai Sevilla')),
    'a la de 3 personas le tocan L 750, no L 250: el aporte es por persona');

  /* ── Un toque = pagó lo que le toca ── */
  await fila('Ada Sarai Sevilla').click();
  await page.waitForTimeout(700);
  comprueba(await cifra('recogido') === 'L 750', 'un toque la deja pagada por sus L 750');
  comprueba(await cifra('falta por cobrar') === 'L 1,000',
    'y lo que falta baja a L 1,000 (los otros dos: 500 + 500)');
  const p1 = await pagos();
  const claves = Object.keys(p1);
  comprueba(claves.length === 1 && claves[0] === 'ada sarai sevilla|6|1',
    'se guarda con la HUELLA de siempre, no con su sitio en la lista (quedó «' + claves[0] + '»)');
  comprueba(p1[claves[0]].monto === 750 && p1[claves[0]].fecha === '2026-08-08',
    'con el monto y el día en que entró el dinero');

  /* ── ⚠️ TRAER LAS RESPUESTAS NO PUEDE BORRAR UN PAGO ──
     Es la comprobación que de verdad importa: si el pago viviera dentro
     de `resp`, aquí se perdería y el maestro le cobraría dos veces a la
     misma madre. */
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1300);
  comprueba(await cifra('recogido') === 'L 750',
    'traer las respuestas NO borra lo ya pagado (sigue en ' + await cifra('recogido') + ')');

  /* ── El abono CORRIGE, no suma ── */
  await fila('Ashly Belén Miranda').click();
  await page.waitForTimeout(600);
  await fila('Ashly Belén Miranda').click();
  await page.waitForSelector('#mdlg-inp');
  comprueba(/Le tocan .*L 500/.test(await page.textContent('.mdlg-body')),
    'al tocarla otra vez recuerda cuánto le tocaba en total');
  await page.fill('#mdlg-inp', '100');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(800);
  comprueba(await cifra('recogido') === 'L 850',
    'el abono CORRIGE y no suma: 750 + 100 = 850, no 750 + 500 + 100 (dijo ' +
    await cifra('recogido') + ')');
  comprueba(/faltan L 400/.test(await filaTxt('Ashly Belén Miranda')),
    'y su renglón dice que le faltan L 400 de los 500');
  comprueba(await cifra('falta por cobrar') === 'L 900',
    'lo que falta por cobrar en total: L 900 (400 de ella + 500 del otro)');

  /* ── LA PLATA DE LAS FAMILIAS NO SALE POR EL ENLACE ──
     Se comprueba ANTES de recargar a propósito: con el service worker
     ya instalado, las llamadas de la página recargada no pasan por la
     nube de mentira y no habría nada que mirar. */
  await page.click('#cv-guardar');
  await page.waitForTimeout(1200);
  const pub = subidas.filter(s => s.fn === 'metas_conv_publicar').map(s => s.cuerpo).join(' ');
  comprueba(pub.length > 0 && !/pagos/.test(pub) && !/"monto"/.test(pub),
    'lo que sube a la nube no lleva quién pagó ni cuánto');
  await page.waitForSelector('.ad-cv-pg');

  /* ── El cobro solo le llega al que debe ── */
  await page.click('#cv-pg-avisar');
  await page.waitForSelector('.ad-cv-ahora');
  await page.waitForTimeout(400);
  const cola = (await page.textContent('#cv-av-cola')).replace(/\s+/g, ' ');
  comprueba(/Llevas 0 de 2/.test(cola),
    'se le cobra a 2, no a las 3: la que ya pagó queda fuera (dijo «' +
    (cola.match(/Llevas \d+ de \d+/) || [''])[0] + '»)');
  comprueba(!/Ada Sarai Sevilla/.test(cola),
    'y a la que pagó entera NO se le pide el aporte otra vez');
  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const wa = decodeURIComponent(await page.evaluate(() => window.__wa[window.__wa.length - 1] || ''));
  comprueba(/Carlos Josué Meza/.test(wa) && /faltan L 500/.test(wa),
    'al que no ha dado nada se le piden sus L 500 completos');
  await page.click('#cv-av-ir');
  await page.waitForTimeout(500);
  const wa2 = decodeURIComponent(await page.evaluate(() => window.__wa[window.__wa.length - 1] || ''));
  comprueba(/Ashly Belén Miranda/.test(wa2) && /faltan L 400/.test(wa2) && !/L 500/.test(wa2),
    'y a la que abonó se le piden los L 400 que faltan, no los 500 otra vez');

  /* ── Aguanta cerrar la aplicación ── */
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => { window.__wa = []; window.open = u => { window.__wa.push(String(u)); return null; }; });
  await entrar();
  comprueba(await cifra('recogido') === 'L 850',
    'después de cerrar y volver a abrir, lo cobrado sigue anotado');

  /* ── Quitar la marca: el 0 la borra ── */
  await fila('Ada Sarai Sevilla').click();
  await page.waitForSelector('#mdlg-inp');
  await page.fill('#mdlg-inp', '0');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(800);
  comprueba(await cifra('recogido') === 'L 100' && Object.keys(await pagos()).length === 1,
    'poner 0 quita la marca y su fila vuelve a estar sin pagar');

  /* ── Lo que se copia para el director lleva las tres cifras ── */
  const txt = await page.evaluate(() => {
    let copiado = '';
    navigator.clipboard.writeText = t => { copiado = t; return Promise.resolve(); };
    document.getElementById('cv-copiar-lista').click();
    return copiado;
  });
  comprueba(/Ya recogido: L 100/.test(txt) && /Falta: L 1,650/.test(txt),
    'la lista que se copia dice lo recogido y lo que falta, no solo quién va');
  comprueba(/SIN PAGAR/.test(txt) && /abonó L 100/.test(txt),
    'y familia por familia: quién no ha dado nada y quién abonó a medias');

  await page.close();
}

/* ══════════════ 🗑 QUITAR A ALGUIEN QUE SE APUNTÓ POR ERROR ══════════════
   Por el enlace, que anda suelto en un grupo de cientos de personas,
   entra también lo que no tiene que entrar: la prueba que hizo el
   propio maestro para ver cómo se veía, el que se equivocó de
   convocatoria, el nombre de broma. Eso cuenta personas, cuenta dinero
   y cuenta ASIENTOS.

   Lo que se vigila aquí es lo que cuesta caro:

   · QUE DEJE DE CONTAR. Personas, familias, buses y dinero.
   · QUE NO VUELVA SOLA en el siguiente «Traer las respuestas». Si el
     escondite viviera dentro de `resp`, volvería en el primer refresco
     y el maestro se enteraría contando gente en el portón.
   · QUE SÍ VUELVA SI LA FAMILIA CONTESTA OTRA VEZ. Es la otra mitad, y
     la que de verdad importa: una respuesta escondida para siempre es
     una madre que cree que apartó su asiento y un niño que se queda en
     el portón.
   · QUE SE BORRE TAMBIÉN EN EL SERVIDOR, para que el «ya somos 37» que
     ve el padre deje de contarla.
   · QUE SE PUEDA DEVOLVER, porque el maestro quita renglones con
     cuarenta nombres delante y el teléfono en la mano.
   · QUE EL ESCONDITE NO VIAJE A LA NUBE. */
async function pruebaQuitar(browser) {
  console.log('\n── 🗑 QUITAR A QUIEN SE APUNTÓ POR ERROR ──');
  /* `act` es la marca de tiempo que manda el servidor: con ella se
     distingue «esta es la misma fila que se quitó» de «esta familia
     volvió a contestar». */
  const FILA = (alumno, grado, personas, act) => ({
    va: true, alumno, grado, seccion: '1', personas, tel: '9999' + personas + '111',
    nota: '', actualizado_en: act,
  });
  const estado = {
    resp: [
      FILA('Alumno Prueba', '1', 4, '2026-08-08T10:00:00Z'),
      FILA('Ada Sarai Sevilla', '6', 3, '2026-08-08T11:00:00Z'),
      FILA('Carlos Josué Meza', '5', 2, '2026-08-08T12:00:00Z'),
    ],
    llamadas: [], quitarOk: true,
  };
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    const cuerpo = JSON.parse(route.request().postData() || '{}');
    estado.llamadas.push({ fn, cuerpo });
    let salida = true;
    if (fn === 'metas_conv_respuestas') salida = estado.resp;
    else if (fn === 'metas_conv_quitar') {
      salida = estado.quitarOk;
      /* El servidor de verdad borra la fila: si no, el siguiente refresco
         la traería otra vez y no se estaría probando nada. */
      if (estado.quitarOk) estado.resp = estado.resp.filter(r =>
        !(r.alumno.toLowerCase().replace(/\s+/g, ' ') + '|' + r.grado + '|' + r.seccion)
          .startsWith(String(cuerpo.p_huella || '@').slice(0, 12)));
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(salida) });
  });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await page.evaluate(() => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
      id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1', materias: ['Español'],
      lista: [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      convocatorias: [{ id: 'V1', icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
        gancho: 'x', gana: ['a', 'b', 'c'], lugar: 'Museo Ferroviario de El Progreso',
        fecha: '2026-08-15', hora: '6:30 a. m.', regreso: '3:00 p. m.', punto: 'Portón de la escuela',
        aporte: 250, incluye: 'transporte, entrada', cobro: '', nota: '', limite: '2026-08-11',
        dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
        wa: '50499998888', escuela: 'Escuela John Arnold Cook', capacidad: 55, costoBus: 3500,
        cupos: 110, arranque: 30, limiteHora: '16:00', manual: [],
        codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-08' }],
    }] }));
  });
  const entrar = async () => {
    await page.evaluate(() => {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-admin').classList.add('active');
      renderAdmin();
      document.querySelector('[data-adtab="com"]').click();
    });
    await page.click('#ad-ir-conv');
    await page.waitForSelector('[data-cvid]');
    await page.click('[data-cvid]');
    await page.waitForSelector('#cv-refrescar');
    await page.waitForTimeout(900);
  };
  await entrar();

  const cifra = async rot => {
    const n = page.locator('.ad-cv-cif', { hasText: rot }).first();
    return (await n.locator('b').textContent()).trim();
  };
  const guardado = () => page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0]);
  const enPantalla = async () => (await page.textContent('#view-admin')).replace(/\s+/g, ' ');

  comprueba(await cifra('personas') === '9', 'antes de quitar nada van 9 personas (4 + 3 + 2)');
  comprueba(await page.locator('[data-cvdel]').count() === 3,
    'cada respuesta del enlace trae su 🗑 para quitarla');

  /* ── Se quita la prueba del propio maestro ── */
  await page.locator('.ad-gasto-row', { hasText: 'Alumno Prueba' })
    .locator('[data-cvdel]').first().click();
  await page.waitForSelector('#mdlg-ok');
  comprueba(/vuelve a salir/i.test(await page.textContent('.mdlg-body')),
    'el aviso dice que si la familia vuelve a contestar, vuelve a salir');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(900);

  comprueba(await cifra('personas') === '5', 'deja de contar: quedan 5 personas (9 − 4)');
  comprueba(await cifra('familias') === '2', 'y 2 familias');
  comprueba(await page.locator('[data-cvdel]').count() === 2,
    'y desaparece de la lista de los que van: quedan 2 renglones');
  comprueba(await page.locator('[data-cvdevolver]').count() === 1,
    'y sale en el cajón de los quitados, para devolverla si te equivocaste de renglón');
  const quitar = estado.llamadas.filter(l => l.fn === 'metas_conv_quitar').pop();
  comprueba(!!quitar && /alumno prueba\|1\|1/.test(quitar.cuerpo.p_huella || ''),
    'se le pide al servidor que la borre, con la huella de siempre');
  comprueba(!!quitar && quitar.cuerpo.p_pin === 'K7M2QP',
    'y con el PIN, que es lo que impide que un extraño borre respuestas ajenas');
  const g1 = await guardado();
  comprueba(!!g1.quitados && !!g1.quitados['alumno prueba|1|1'],
    'el escondite se guarda FUERA de resp, en `quitados`');
  comprueba(!(g1.resp || []).some(r => r.alumno === 'Alumno Prueba'),
    'y como el servidor confirmó el borrado, la fila sale también de la copia local');

  /* ── ⚠️ NO VUELVE SOLA AL TRAER LAS RESPUESTAS ──
     El servidor vuelve a mandarla (como si el borrado no hubiera
     entrado): tiene que seguir escondida y reintentarse el borrado. */
  estado.quitarOk = false;
  estado.resp = [FILA('Alumno Prueba', '1', 4, '2026-08-08T10:00:00Z'),
                 FILA('Ada Sarai Sevilla', '6', 3, '2026-08-08T11:00:00Z'),
                 FILA('Carlos Josué Meza', '5', 2, '2026-08-08T12:00:00Z')];
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1400);
  comprueba(await cifra('personas') === '5',
    'traer las respuestas NO la devuelve a las cuentas (dijo ' + await cifra('personas') + ')');
  comprueba(await page.locator('[data-cvdel]').count() === 2, 'ni a la lista');
  const reintentos = estado.llamadas.filter(l => l.fn === 'metas_conv_quitar').length;
  comprueba(reintentos >= 2, 'y el borrado que no entró se reintenta solo al traer las respuestas');

  /* ── ⚠️ PERO SÍ VUELVE SI LA FAMILIA CONTESTA OTRA VEZ ──
     Otra marca de tiempo = respuesta nueva. Esconderla sería perderla, y
     una respuesta perdida es un niño esperando en el portón. */
  estado.resp = [FILA('Alumno Prueba', '1', 2, '2026-08-09T08:30:00Z'),
                 FILA('Ada Sarai Sevilla', '6', 3, '2026-08-08T11:00:00Z'),
                 FILA('Carlos Josué Meza', '5', 2, '2026-08-08T12:00:00Z')];
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1400);
  comprueba(await page.locator('[data-cvdel]').count() === 3 &&
    /Alumno Prueba/.test(await enPantalla()),
    'si esa familia vuelve a contestar el enlace, VUELVE a salir en la lista');
  comprueba(await cifra('personas') === '7', 'y vuelve a contar (5 + las 2 que dijo ahora)');
  const g2 = await guardado();
  comprueba(!g2.quitados || !g2.quitados['alumno prueba|1|1'],
    'el escondite se suelta solo: no se queda esperando a taparla otra vez');

  /* ── Se quita otra vez, ahora sin señal para el servidor ── */
  await page.locator('.ad-gasto-row', { hasText: 'Alumno Prueba' })
    .locator('[data-cvdel]').first().click();
  await page.waitForSelector('#mdlg-ok');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(900);
  comprueba(await cifra('personas') === '5', 'sin señal se quita igual de las cuentas del maestro');
  const g3 = await guardado();
  comprueba((g3.resp || []).some(r => r.alumno === 'Alumno Prueba'),
    'pero la fila sigue en la copia local: el padre la sigue contando y su espejo no puede mentir');

  /* ── Devolverla: el maestro se equivocó de renglón ── */
  await page.locator('[data-cvdevolver]').first().click();
  await page.waitForSelector('#mdlg-ok');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(900);
  comprueba(await cifra('personas') === '7', 'devolverla la vuelve a poner en las cuentas');
  comprueba(/Alumno Prueba/.test(await enPantalla()), 'y en la lista de los que van');

  /* ── El escondite no viaja a la nube ── */
  await page.locator('.ad-gasto-row', { hasText: 'Alumno Prueba' })
    .locator('[data-cvdel]').first().click();
  await page.waitForSelector('#mdlg-ok');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(900);
  await page.click('#cv-guardar');
  await page.waitForTimeout(1200);
  const pub = estado.llamadas.filter(l => l.fn === 'metas_conv_publicar')
    .map(l => JSON.stringify(l.cuerpo)).join(' ');
  comprueba(pub.length > 0 && !/quitados/.test(pub) && !/Alumno Prueba/.test(pub),
    'lo que sube a la nube no lleva a quién quitó el maestro ni por qué');

  await page.close();
}

/* ══════════════ 🚌 LA SUBIDA AL BUS ══════════════
   El día de la salida: dos maestros, cuarenta familias, un bus con el
   motor andando y gente que llega a pagar en ese momento. Lo que se
   vigila aquí es lo que cuesta caro en el portón:

   · QUE CUENTE PERSONAS Y NO FAMILIAS. Los asientos son de personas: en
     el bus va el niño y va la mamá.
   · QUE SUBIR CUESTE UN TOQUE. Con cuarenta en fila, cada toque de más
     es un minuto de portón.
   · QUE AL QUE DEBE NO SE LE SUBA EN SILENCIO, y que pagando en el
     portón suba de una vez —y que ese pago SE VEA en el control de
     pagos, o el maestro se lo cobraría otra vez el lunes.
   · ⚠️ QUE TRAER LAS RESPUESTAS NO BORRE LO SUBIDO. Si viviera dentro
     de `resp` se perdería en el primer refresco, y el maestro se
     enteraría contando cabezas con el bus andando.
   · QUE NO VIAJE A LA NUBE: por el enlace sale cuántos van, nunca quién
     se montó.
   · QUE EL BUSCADOR ENCUENTRE POR FOLIO, que es lo que la familia
     enseña en el portón, y que buscar no borre lo ya marcado. */
async function pruebaAbordo(browser) {
  console.log('\n── 🚌 LA SUBIDA AL BUS ──');
  const RESP = [
    { va: true, alumno: 'Ada Sarai Sevilla', grado: '6', seccion: '1', personas: 3, tel: '99991111', nota: '' },
    { va: true, alumno: 'Ashly Belén Miranda', grado: '6', seccion: '1', personas: 2, tel: '99992222', nota: '' },
    { va: true, alumno: 'Carlos Josué Meza', grado: '5', seccion: '2', personas: 2, tel: '99993333', nota: '' },
    { va: false, alumno: 'Hilda Marina Paz', grado: '6', seccion: '1', personas: 0, tel: '99995555', nota: 'Por el aporte' },
  ];
  const subidas = [];
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    subidas.push({ fn, cuerpo: route.request().postData() || '' });
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(fn === 'metas_conv_respuestas' ? RESP : true) });
  });
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  /* La salida es HOY: es el día en que se usa esto. */
  await page.evaluate(() => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
      id: 'G1', escuela: 'Escuela John Arnold Cook', grado: '6', seccion: '1', materias: ['Español'],
      lista: [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
      convocatorias: [{ id: 'V1', icono: '🚌', titulo: 'Excursión al Museo Ferroviario de El Progreso',
        gancho: 'x', gana: ['a', 'b', 'c'], lugar: 'Museo Ferroviario de El Progreso',
        fecha: '2026-08-08', hora: '6:30 a. m.', regreso: '3:00 p. m.', punto: 'Portón de la escuela',
        aporte: 250, incluye: 'transporte, entrada', cobro: '', nota: '', limite: '2026-08-07',
        dirigido: 'Para las familias de toda la escuela', maestro: 'Prof. Josué Polanco',
        wa: '50499998888', escuela: 'Escuela John Arnold Cook', capacidad: 55, costoBus: 3500,
        cupos: 110, arranque: 30, limiteHora: '16:00', manual: [],
        codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-01' }],
    }] }));
  });
  const entrar = async () => {
    await page.evaluate(() => {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-admin').classList.add('active');
      renderAdmin();
      document.querySelector('[data-adtab="com"]').click();
    });
    await page.click('#ad-ir-conv');
    await page.waitForSelector('[data-cvid]');
    await page.click('[data-cvid]');
    await page.waitForSelector('.ad-cv-ab');
    await page.waitForTimeout(900);
  };
  await entrar();

  const chip = nom => page.locator('.ad-cv-ab', { hasText: nom }).first();
  const cifra = async rot => {
    const n = page.locator('.ad-cv-cif', { hasText: rot }).first();
    return (await n.locator('b').textContent()).trim();
  };
  const abordo = () => page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].abordo || {});
  const pagos = () => page.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].convocatorias[0].pagos || {});

  /* ── El día de la salida, lo primero de la pantalla ── */
  const orden = await page.evaluate(() => {
    const t = Array.from(document.querySelectorAll('#ad-tab-body .pa-card-title')).map(n => n.textContent.trim());
    return t;
  });
  comprueba(/Subida al bus/.test(orden[1] || ''),
    'el día de la salida la subida al bus va arriba del todo, antes del mensaje de WhatsApp');
  comprueba(await page.locator('[data-cvab]').count() === 3,
    'sale una familia por chip, y solo las que van (la que dijo que no, no sube)');
  comprueba(await cifra('ya subieron') === '0' && await cifra('faltan por subir') === '7',
    'arranca en 0 y faltan 7 PERSONAS (3+2+2), no 3 familias');
  comprueba(await cifra('por cobrar aquí') === 'L 1,750',
    'y dice cuánto dinero tiene que cobrar en el portón: L 1,750');

  /* ── Al que debe no se le sube en silencio ── */
  await chip('Ada Sarai').click();
  await page.waitForSelector('.mdlg-body');
  const av = (await page.textContent('.mdlg-body')).replace(/\s+/g, ' ');
  comprueba(/Le faltan L 750/.test(av),
    'antes de subir a la que debe, la pantalla dice cuánto le falta (L 750, por sus 3 personas)');
  await page.click('#mdlg-cancel');
  await page.waitForTimeout(500);
  comprueba(await cifra('ya subieron') === '0' && Object.keys(await abordo()).length === 0,
    '«Todavía no» NO la sube: se queda en la fila de cobro');
  comprueba(/Ada Sarai Sevilla/.test(await page.textContent('#cv-abordo')),
    'y sale en la fila de los que cobran fuera del bus');

  /* ── La que ya pagó sube de UN toque, sin preguntar nada ── */
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('METAS_ADMIN_V1'));
    d.grupos[0].convocatorias[0].pagos = { 'ashly belen miranda|6|1': { monto: 500, fecha: '2026-08-05' } };
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(d));
  });
  await entrar();
  await chip('Ashly Belén').click();
  await page.waitForTimeout(600);
  comprueba(await page.locator('.mdlg-body').count() === 0,
    'a la que está al día no se le pregunta nada: un toque y arriba');
  comprueba(await cifra('ya subieron') === '2' && await cifra('faltan por subir') === '5',
    'sube con sus 2 personas y la cuenta baja sola (quedan 5 por subir)');
  const ab1 = await abordo();
  comprueba(Object.keys(ab1).length === 1 && ab1['ashly belen miranda|6|1'] &&
    ab1['ashly belen miranda|6|1'].personas === 2,
    'se guarda con la HUELLA de siempre y con cuántas personas se montaron');
  comprueba(/^\d\d:\d\d$/.test(String(ab1['ashly belen miranda|6|1'].hora || '')),
    'con la hora a la que subió, que es lo que contesta el reclamo del lunes');

  /* ── ⚠️ TRAER LAS RESPUESTAS NO PUEDE BORRAR LO SUBIDO ── */
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1300);
  comprueba(await cifra('ya subieron') === '2',
    'traer las respuestas NO borra lo que ya subió (sigue en ' + await cifra('ya subieron') + ')');

  /* ── Paga en el portón: un toque anota el dinero Y la sube ── */
  await page.click('[data-cvabcobra]');
  await page.waitForTimeout(700);
  comprueba(await cifra('ya subieron') === '4',
    'el botón de «Pagó» la sube en el mismo toque (van 4 personas)');
  const pg1 = await pagos();
  comprueba(pg1['carlos josue meza|5|2'] && pg1['carlos josue meza|5|2'].monto === 500,
    'y le anota sus L 500 completos, no una marca a medias');
  comprueba(await cifra('por cobrar aquí') === 'L 750',
    'lo que queda por cobrar en el portón baja a L 750 (solo el de las 3 personas)');
  /* Que el pago se VEA en el control de pagos, o el lunes se le cobra
     otra vez a quien pagó delante del bus. */
  const enPagos = (await page.textContent('#cv-pagos')).replace(/\s+/g, ' ');
  comprueba(/Carlos Josué Meza/.test(enPagos) && /L 1,000/.test(enPagos),
    'lo cobrado en el portón se ve en el momento en 💵 Quién ya pagó (L 1,000 recogidos)');

  /* ── El buscador: por folio, que es lo que enseña la familia ── */
  const folio = await page.evaluate(() => window.convFolio('R4TP', 'ada sarai sevilla|6|1'));
  await page.fill('#cv-ab-buscar', folio.split('-')[1]);
  await page.waitForTimeout(300);
  /* Los CHIPS, que es lo que se filtra: el mismo `data-cvab` lo lleva el
     botón «Ya subió» de la lista de los que faltan. */
  const visibles = await page.locator('.ad-cv-ab:not([hidden])').count();
  comprueba(visibles === 1, 'buscando por el folio del boleto queda una sola familia (quedaron ' + visibles + ')');
  comprueba(await chip('Ada Sarai').isVisible(), 'y es la del folio que se buscó');

  /* ── Buscar no repinta la pantalla: lo marcado sigue marcado ── */
  comprueba(await cifra('ya subieron') === '4', 'buscar no borra lo ya subido');

  /* ── Segundo toque: vinieron menos de los que dijo ── */
  await page.fill('#cv-ab-buscar', 'Ashly');
  await page.waitForTimeout(250);
  await chip('Ashly Belén').click();
  await page.waitForSelector('#mdlg-inp');
  await page.fill('#mdlg-inp', '1');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(700);
  comprueba(await cifra('ya subieron') === '3',
    'si vinieron menos, el segundo toque corrige: 2 → 1, y a bordo van 3');
  comprueba(await page.inputValue('#cv-ab-buscar') === 'Ashly',
    'y al subir a alguien NO se repinta la pantalla entera: lo escrito en el buscador sigue ahí');

  /* ── El 0 la baja del bus ── */
  await chip('Ashly Belén').click();
  await page.waitForSelector('#mdlg-inp');
  await page.fill('#mdlg-inp', '0');
  await page.click('#mdlg-ok');
  await page.waitForTimeout(700);
  comprueba(await cifra('ya subieron') === '2' && !(await abordo())['ashly belen miranda|6|1'],
    'el 0 la baja del bus (quedan las 2 del que pagó en el portón)');

  /* ── LO SUBIDO NO VIAJA A LA NUBE ──
     Se comprueba ANTES de recargar: con el service worker instalado, las
     llamadas de la página recargada no pasan por la nube de mentira. */
  await page.fill('#cv-ab-buscar', '');
  await page.click('#cv-guardar');
  await page.waitForTimeout(1200);
  /* Ojo: `hora` SÍ viaja, pero es la de salida del evento —lo que lee el
     padre—. Lo que no puede salir es el cajón `abordo` ni el nombre de
     quien se montó. */
  const pub = subidas.filter(s => s.fn === 'metas_conv_publicar').map(s => s.cuerpo).join(' ');
  comprueba(pub.length > 0 && !/abordo/.test(pub) && !/Carlos Josué Meza/.test(pub),
    'lo que sube a la nube no lleva quién se montó ni a qué hora');

  /* ── Aguanta cerrar la aplicación ── */
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await entrar();
  comprueba(await cifra('ya subieron') === '2',
    'después de cerrar y volver a abrir, lo subido sigue anotado');
  const falta = (await page.textContent('#cv-abordo')).replace(/\s+/g, ' ');
  comprueba(/Todavía no han subido/.test(falta) && /Ada Sarai Sevilla/.test(falta),
    'y con el bus a punto de salir dice quién falta, con su teléfono para llamarla');

  await page.close();
}

(async () => {
  const browser = await abrir();
  try {
    const { huella1 } = await pruebaPadre(browser);
    await pruebaCorregir(browser, huella1);
    await pruebaSinInternet(browser);
    await pruebaCerrada(browser);
    await pruebaCuentas(browser);
    await pruebaPuerta(browser);
    await pruebaMensaje(browser);
    const folio = await pruebaPublicada(browser);
    await pruebaEmpuje(browser);
    await pruebaBoleto(browser, folio);
    await pruebaBoletoSinInternet(browser);
    await pruebaAvisos(browser);
    await pruebaPagos(browser);
    await pruebaAbordo(browser);
    await pruebaQuitar(browser);
  } finally {
    await browser.close();
  }
  console.log('\n' + (fallos ? '✖ ' + fallos + ' fallo(s)' : '✔ todo en orden'));
  process.exit(fallos ? 1 : 0);
})();
