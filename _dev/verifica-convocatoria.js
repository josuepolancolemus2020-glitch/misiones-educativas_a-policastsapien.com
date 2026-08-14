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
const { chromium } = require('playwright');

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
  await page.route('**/rest/v1/rpc/**', async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(fn === 'metas_conv_respuestas' ? RESP : true) });
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
    await page.waitForSelector('#cv-av-txt');
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

(async () => {
  const browser = await chromium.launch(
    process.env.METAS_CHROMIUM ? { executablePath: process.env.METAS_CHROMIUM } : {});
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
  } finally {
    await browser.close();
  }
  console.log('\n' + (fallos ? '✖ ' + fallos + ' fallo(s)' : '✔ todo en orden'));
  process.exit(fallos ? 1 : 0);
})();
