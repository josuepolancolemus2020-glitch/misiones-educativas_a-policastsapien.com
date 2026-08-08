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

/* ══════════════ 6) La puerta en ✅ Controles ══════════════ */
async function pruebaPuerta(browser) {
  console.log('\n── LA PUERTA EN CONTROLES ──');
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
    document.querySelector('[data-adtab="ctrl"]').click();
  });
  await page.waitForSelector('#ad-ir-conv');
  ok('sin lista de alumnos, la puerta 📣 Convocatoria sigue estando');

  await page.click('#ad-ir-conv');
  await page.waitForSelector('[data-cvplant="0"]');
  const rot = await page.getAttribute('#admin-back-btn', 'aria-label');
  comprueba(/Volver a Controles/.test(rot), 'la flecha de arriba sube a Controles (dijo «' + rot + '»)');

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
        cupos: 110, codigo: 'R4TP', pin: 'K7M2QP', cerrada: 0, resp: [], respFecha: '', creada: '2026-08-08' }],
    }] }));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    renderAdmin();
    document.querySelector('[data-adtab="ctrl"]').click();
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

  /* Traer a mano tampoco puede dispararse solo */
  const antes = veces;
  await page.click('#cv-refrescar');
  await page.waitForTimeout(1200);
  comprueba(veces === antes + 1, 'el botón «Traer las respuestas» pregunta exactamente una vez');
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
    await pruebaPublicada(browser);
  } finally {
    await browser.close();
  }
  console.log('\n' + (fallos ? '✖ ' + fallos + ' fallo(s)' : '✔ todo en orden'));
  process.exit(fallos ? 1 : 0);
})();
