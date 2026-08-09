/* ═══════════════════════════════════════════════════════════════
   📬 ¿FUNCIONA EL BUZÓN DEL LECTOR?

   Esta pantalla es la única puerta abierta a la calle de todo el
   proyecto: su enlace va IMPRESO en la revista y suelto en grupos
   de WhatsApp de cientos de personas. Aquí se comprueban las cinco
   cosas que, si salen mal, se pagan caras:

   · EL NOMBRE DE LA REVISTA NO APARECE. Se pidió expreso: el enlace
     circula solo y la página no debe nombrarla. Se busca en el
     código fuente y en las cinco pantallas, ya pintadas.

   · NO ENTRA UN ANÓNIMO. Sin nombre, sin teléfono o sin aceptar los
     requisitos, el envío no sale de la pantalla. Es el primero de
     los requisitos de ética, y aquí se hace cumplir de verdad, no
     se pide por favor.

   · CON FOTOS, HACE FALTA EL PERMISO. Si adjuntó fotos y no marca
     que tiene permiso de quien sale en ellas, tampoco sale. Un niño
     publicado sin permiso de su familia no se arregla con una fe de
     erratas.

   · MANDAR DOS VECES CORRIGE, NO DUPLICA. La huella que viaja al
     servidor tiene que ser la misma las dos veces. Sin eso, la
     bandeja de la redacción se llena de gemelas y alguien acaba
     llamando dos veces al mismo lector.

   · LO ESCRITO NO SE PIERDE. Si falla el internet, tiene que quedar
     guardado en el teléfono Y ofrecerse por WhatsApp ya escrito,
     con nombre, teléfono y texto. Un lector que cree que mandó su
     denuncia y no la mandó es una denuncia que nadie va a echar de
     menos, porque nadie sabe que existió.

   Y la fecha, que es la que hace llegar tarde: la revista es
   quincenal y el cierre se enseña en la portada. new Date('2026-08-15')
   se lee en UTC y en Honduras enseña el día ANTERIOR.

   La nube NO se toca: se pone un Supabase de mentira con page.route,
   así corre sin internet y sin ensuciar datos reales.

   Uso:
     node _dev/servidor-estatico.js      (en otra terminal)
     node _dev/verifica-buzon.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const URL_BUZON = BASE + '/buzon.html';
const HOY = new Date(2026, 7, 8, 9, 0, 0);      /* sábado 8 de agosto de 2026 */

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));

/* ── Supabase de mentira ──
   Guarda lo que le mandan para poder revisarlo después: es justo lo
   que hay que comprobar (que la huella no cambie, que las fotos
   viajen achicadas, que se firme la versión de los requisitos).
   `caer` simula el internet caído. */
function nube(estado) {
  return async route => {
    const fn = route.request().url().split('/rpc/')[1].split('?')[0];
    let cuerpo = {};
    try { cuerpo = JSON.parse(route.request().postData() || '{}'); } catch (_) {}
    estado.llamadas.push({ fn, cuerpo });
    if (estado.caer) { await route.abort('failed'); return; }
    let salida = null;
    if (fn === 'faro_buzon_estado') salida = estado.edicion ? [estado.edicion] : [];
    else if (fn === 'faro_buzon_enviar') salida = estado.folio;
    else if (fn === 'faro_buzon_retirar') salida = estado.retirado;
    else if (fn === 'faro_buzon_mio') salida = estado.mio ? [estado.mio] : [];
    else if (fn === 'faro_buzon_editar') salida = estado.editar;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(salida) });
  };
}

async function nuevaPagina(browser, estado) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.clock.install({ time: HOY });
  await page.route('**/rest/v1/rpc/**', nube(estado));
  page.on('dialog', d => d.accept());
  return page;
}
function nuevoEstado(extra) {
  return Object.assign({
    llamadas: [], caer: false, folio: 'B-7K3M', retirado: true, editar: 'ok',
    edicion: { numero: 3, cierre: '2026-08-15' },
    mio: {
      clase: 'denuncia', titulo: 'El muro del patio',
      texto: 'Se cayó el muro del patio y los niños pasan por ahí todos los días.',
      nombre: 'Ana López', tel: '9988-7766', correo: '', lugar: 'Comayagua',
      escuela: '', cargo: 'madre', evento_fecha: null, evento_hora: '', evento_lugar: '',
      fotos: 2, estado: 'leido', se_puede: true,
      creado_at: '2026-08-07T10:00:00Z', editado_at: null,
    },
  }, extra || {});
}

/* Rellena el formulario. Devuelve la página en la pantalla de ética. */
async function llenaFormulario(page, datos) {
  const d = Object.assign({
    clase: 'nota', titulo: 'Se cayó el muro del patio',
    texto: 'El muro del patio se cayó el lunes y los niños pasan por ahí todos los días para llegar a los baños.',
    nombre: 'Ana López', tel: '9988-7766', lugar: 'Comayagua', cargo: 'madre',
  }, datos || {});
  await page.click(`.puerta[data-clase="${d.clase}"]`);
  await page.fill('#f-tit', d.titulo);
  await page.fill('#f-txt', d.texto);
  await page.fill('#f-nom', d.nombre);
  await page.fill('#f-tel', d.tel);
  if (await page.locator('#f-lug').count()) await page.fill('#f-lug', d.lugar);
  if (await page.locator('#f-car').count()) await page.fill('#f-car', d.cargo);
  return d;
}

/* Una foto de verdad y bien grande, hecha en el propio navegador: así
   la prueba no depende de ningún archivo suelto en el repositorio y
   mide lo que de verdad importa, que es que la pantalla ACHIQUE lo
   que sale de la cámara de un teléfono moderno. */
async function adjuntaFoto(page) {
  return page.evaluate(() => new Promise(res => {
    const c = document.createElement('canvas');
    c.width = 3000; c.height = 2000;
    const ctx = c.getContext('2d');
    // Ruido, no un color plano: un JPEG de color plano se comprime a
    // nada y no probaría el recorte de tamaño.
    const img = ctx.createImageData(c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = (i * 7) % 255; img.data[i + 1] = (i * 13) % 255;
      img.data[i + 2] = (i * 29) % 255; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    c.toBlob(b => {
      const dt = new DataTransfer();
      dt.items.add(new File([b], 'foto.jpg', { type: 'image/jpeg' }));
      const inp = document.getElementById('f-file');
      inp.files = dt.files;
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      res(b.size);
    }, 'image/jpeg', 0.95);
  }));
}

(async () => {
  const browser = await chromium.launch();
  console.log('\n═══ 📬 EL BUZÓN DEL LECTOR ═══');

  /* ── 1. El nombre de la revista no aparece ─────────────────── */
  console.log('\n🔒 La página no nombra a la revista');
  {
    const fuente = fs.readFileSync(path.join(__dirname, '..', 'buzon.html'), 'utf8');
    // Se buscan las formas en que se escribe, incluida la de los
    // puntos, que es la que se cuela cuando alguien copia y pega.
    const prohibidas = [/\bF\.?A\.?R\.?O\b/i, /\bfaro\b/i];
    const enFuente = prohibidas.filter(r => {
      // Las direcciones internas del servidor (faro_buzon_enviar, el
      // nombre del proyecto en la nube) no las ve nadie: no cuentan.
      const limpia = fuente.replace(/faro_buzon_\w+/g, '').replace(/bzrnjvalpwlcnpszvwim/g, '');
      return r.test(limpia);
    });
    comprueba(enFuente.length === 0,
      'el código fuente no dice el nombre de la revista' + (enFuente.length ? ` (aparece ${enFuente})` : ''));

    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    const pantallas = [];
    pantallas.push(await page.textContent('#app'));
    await llenaFormulario(page);
    pantallas.push(await page.textContent('#app'));
    await page.click('#f-seguir');
    await page.waitForSelector('#e-ok');
    pantallas.push(await page.textContent('#app'));
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');
    pantallas.push(await page.textContent('#app'));
    await page.click('#g-retirar');
    await page.waitForSelector('#r-fol');
    pantallas.push(await page.textContent('#app'));

    const sucias = pantallas.filter(t => /\bfaro\b/i.test(t || ''));
    comprueba(sucias.length === 0, 'ninguna de las cinco pantallas lo dice tampoco');
    await page.close();
  }

  /* ── 2. La fecha de cierre ─────────────────────────────────── */
  console.log('\n🗓️ Cuándo cierra la próxima revista');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.hero-cuenta');
    const txt = await page.textContent('.hero-cuenta');
    // El cierre es el sábado 15 y hoy es sábado 8: faltan 7 días.
    comprueba(/15 de agosto/.test(txt) && /sábado/.test(txt),
      `la portada enseña el día exacto del cierre («${txt.trim()}»)`);
    comprueba(!/14 de agosto/.test(txt),
      'la fecha NO se corre un día (el fallo de leerla en UTC)');
    await page.close();
  }
  {
    // Sin servidor, la quincena se calcula sola. Hoy es 8 de agosto,
    // así que la quincena en curso cierra el 15.
    const estado = nuevoEstado({ edicion: null });
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.hero-cuenta');
    const txt = await page.textContent('.hero-cuenta');
    comprueba(/15 de agosto/.test(txt),
      'si el servidor no contesta, la quincena se calcula en el teléfono y el buzón abre igual');
    await page.close();
  }
  {
    // Y si la respuesta viene vacía o rota, tampoco se cae.
    const estado = nuevoEstado({ caer: true });
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta', { timeout: 5000 }).catch(() => {});
    comprueba(await page.locator('.puerta').count() === 6,
      'sin internet, el buzón abre y enseña sus seis puertas');
    await page.close();
  }

  /* ── 3. No entra un anónimo ────────────────────────────────── */
  console.log('\n🪪 Sin nombre y sin teléfono no se publica nada');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');

    await page.click('.puerta[data-clase="nota"]');
    await page.fill('#f-txt', 'muy corto');
    await page.click('#f-seguir');
    comprueba(/letras/.test(await page.textContent('#f-err')),
      'un texto de nueve letras no pasa: pide contar más');

    await page.fill('#f-txt', 'El muro del patio se cayó el lunes y los niños pasan por ahí a diario.');
    await page.click('#f-seguir');
    comprueba(/nombre/i.test(await page.textContent('#f-err')), 'sin nombre no pasa');

    await page.fill('#f-nom', 'Ana López');
    await page.click('#f-seguir');
    comprueba(/tel[ée]fono/i.test(await page.textContent('#f-err')), 'sin teléfono no pasa');

    await page.fill('#f-tel', '99887766');
    await page.click('#f-seguir');
    await page.waitForSelector('#e-ok');
    ok('con nombre y teléfono sí pasa, y lo siguiente son los requisitos');

    await page.click('#e-enviar');
    comprueba(/condiciones/i.test(await page.textContent('#e-err')),
      'sin marcar que acepta los requisitos, no se manda');
    comprueba(estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').length === 0,
      'y al servidor no le llegó nada mientras faltaba algo');
    await page.close();
  }

  /* ── 4. Con fotos, el permiso ──────────────────────────────── */
  console.log('\n🧒 Con fotos hace falta declarar el permiso');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    await llenaFormulario(page);

    const bytesOriginal = await adjuntaFoto(page);
    await page.waitForSelector('.foto img');
    ok(`la foto de ${Math.round(bytesOriginal / 1024)} KB entró en la pantalla`);

    const b64 = await page.evaluate(() => document.querySelector('.foto img').src.length);
    comprueba(b64 <= 1400000,
      `se achica antes de mandarla: queda en ${Math.round(b64 / 1024)} KB (el tope son 1367)`);

    // Segunda foto: hasta dos, y a la tercera ya no hay botón.
    await adjuntaFoto(page);
    await page.waitForFunction(() => document.querySelectorAll('.foto img').length === 2);
    comprueba(await page.locator('#f-add').count() === 0,
      'con dos fotos ya no se puede añadir una tercera');

    await page.click('#f-seguir');
    await page.waitForSelector('#e-fotos');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    comprueba(/fotos/i.test(await page.textContent('#e-err')),
      'con fotos y sin declarar el permiso, no se manda');

    await page.check('#e-fotos');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');
    const env = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop();
    comprueba(env.cuerpo.p_permiso_fotos === true && env.cuerpo.p_fotos.length === 2,
      'con el permiso marcado sí se manda, y viajan las dos fotos');
    comprueba(String(env.cuerpo.p_fotos[0]).startsWith('data:image/jpeg'),
      'las fotos viajan como imagen, no como texto raro');
    await page.close();
  }

  /* ── 5. Mandar dos veces corrige, no duplica ───────────────── */
  console.log('\n♻️ Mandar dos veces CORRIGE, no duplica');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    await llenaFormulario(page);
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');
    const primera = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop().cuerpo;

    // El mismo lector, lo mismo, pero escrito con acentos y mayúsculas
    // distintas y el teléfono con guion: sigue siendo el mismo envío.
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    await llenaFormulario(page, { nombre: 'ANA LOPEZ', tel: '99887766' });
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');
    const segunda = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop().cuerpo;

    comprueba(primera.p_huella === segunda.p_huella,
      `la huella no cambia con las tildes ni con el guion del teléfono («${primera.p_huella.slice(0, 40)}…»)`);
    comprueba(primera.p_etica_version && primera.p_etica_version === segunda.p_etica_version,
      `queda firmada la versión de los requisitos que aceptó (${primera.p_etica_version})`);
    await page.close();
  }

  /* ── 6. Lo escrito no se pierde ────────────────────────────── */
  console.log('\n📡 Si falla el internet, lo escrito no se pierde');
  {
    const estado = nuevoEstado({ caer: true });
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    const d = await llenaFormulario(page);
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('#x-wa');
    ok('avisa de que no se pudo mandar y ofrece la salida por WhatsApp');

    const guardado = await page.evaluate(() => localStorage.getItem('BUZON_PENDIENTE_V1'));
    comprueba(guardado && JSON.parse(guardado).texto === d.texto,
      'el texto queda guardado ENTERO en el teléfono');

    // El mensaje de WhatsApp lleva lo que hace falta para anotarlo a mano
    const wa = await page.evaluate(() => {
      let capturada = '';
      window.open = (u) => { capturada = u; return null; };
      document.getElementById('x-wa').click();
      return decodeURIComponent(capturada);
    });
    comprueba(wa.includes(d.nombre) && wa.includes(d.tel) && wa.includes(d.texto.slice(0, 30)),
      'el mensaje de WhatsApp va con el nombre, el teléfono y el texto ya escritos');

    // Y al volver a abrir el buzón, se lo recuerda y se manda con un toque
    estado.caer = false;
    await page.goto(URL_BUZON);
    await page.waitForSelector('#p-reintentar');
    ok('al volver a abrir el buzón, se lo recuerda');
    await page.click('#p-reintentar');
    await page.waitForSelector('.folio-n');
    const reenviado = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop().cuerpo;
    comprueba(reenviado.p_texto === d.texto && reenviado.p_nombre === d.nombre,
      'y se manda entero, sin volver a escribirlo');
    comprueba(await page.evaluate(() => localStorage.getItem('BUZON_PENDIENTE_V1')) === null,
      'una vez mandado, deja de estar pendiente (no se manda dos veces)');
    await page.close();
  }

  /* ── 7. La puerta de Aulas en acción ───────────────────────── */
  console.log('\n🏫 Pedir que cubran un evento de la escuela');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    await page.click('.puerta[data-clase="aulas"]');
    comprueba(await page.locator('#f-evf').count() === 1 && await page.locator('#f-esc').count() === 1,
      'pide el día del evento y el nombre del centro, que es lo que decide si da tiempo');
    comprueba(/quince d[ií]as/i.test(await page.textContent('#app')),
      'y le recuerda al lector que la revista sale cada quince días');

    await page.fill('#f-txt', 'El viernes sembramos 120 árboles con los alumnos de sexto en el predio de atrás.');
    await page.fill('#f-esc', 'Escuela Lempira');
    await page.fill('#f-evf', '2026-08-21');
    await page.fill('#f-evh', '9:00 a. m.');
    await page.fill('#f-evl', 'El predio de atrás');
    await page.fill('#f-nom', 'Prof. Josué Polanco');
    await page.fill('#f-tel', '9988-7766');
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');
    const env = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop().cuerpo;
    comprueba(env.p_clase === 'aulas' && env.p_evento_fecha === '2026-08-21' &&
              env.p_escuela === 'Escuela Lempira',
      'el envío llega marcado como Aulas en acción, con su fecha y su centro');
    comprueba(/B-7K3M/.test(await page.textContent('.folio-n')),
      'y el lector se queda con su folio a la vista');
    await page.close();
  }

  /* ── 7-bis. La puerta de M.E.T.A.S ─────────────────────────── */
  console.log('\n🎓 Quien quiere saber más de M.E.T.A.S');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    comprueba(await page.locator('.puerta').count() === 6,
      'la puerta está en la portada, con las demás');

    /* Que se sepa ANTES de tocar la puerta. En la pantalla de
       condiciones ya sería tarde: para entonces ya escribió todo, y
       quien cree que su pregunta va a salir impresa no la hace. */
    const puerta = await page.textContent('.puerta[data-clase="metas"]');
    comprueba(/no se publica/i.test(puerta),
      'la propia puerta avisa de que esto NO se publica en la revista');

    await page.click('.puerta[data-clase="metas"]');
    await page.waitForSelector('#f-txt');
    comprueba(/no sale en la revista/i.test(await page.textContent('#app')),
      'y se lo repite mientras escribe, por si tocó sin leer');
    comprueba(await page.locator('#f-tit').count() === 0,
      'no le pide un título: no va a salir publicado, no hace falta titularlo');

    await page.fill('#f-txt', 'Soy maestro de sexto y quiero usar la plataforma con mis alumnos. ¿Por dónde empiezo?');
    await page.fill('#f-nom', 'Carlos Mejía');
    await page.fill('#f-tel', '3333-4444');
    await page.click('#f-seguir');
    await page.waitForSelector('#e-ok');

    /* La pantalla de condiciones es OTRA. Enseñarle a quien pide ayuda
       las cinco reglas de lo que se publica —«sin insultos», «cuidado
       con los niños»— sería asustarlo con normas que no le tocan. */
    const condiciones = await page.textContent('#app');
    comprueba(!/insultos/i.test(condiciones) && !/denuncia/i.test(condiciones),
      'no le enseña las condiciones de lo que se publica, que no van con él');
    comprueba(/no se publican/i.test(condiciones) && /contacten/i.test(condiciones),
      'le pide lo único que aquí importa: permiso para contactarle');

    await page.click('#e-enviar');
    comprueba(/contactarle/i.test(await page.textContent('#e-err')),
      'y sin ese permiso tampoco se manda');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');

    const env = estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').pop().cuerpo;
    comprueba(env.p_clase === 'metas',
      'el envío llega marcado como «metas», no revuelto con lo de la revista');
    comprueba(env.p_etica_ok === true && env.p_etica_version === '2026-08',
      'y con su consentimiento firmado igual que los demás');

    const gracias = await page.textContent('#app');
    comprueba(!/revista cierra/i.test(gracias),
      'al final no le hablan del cierre de la revista, que no le importa');
    comprueba(/Entrar a M\.E\.T\.A\.S/i.test(gracias),
      'y sí le dan la puerta para entrar a mirarla ya mismo');
    await page.close();
  }

  /* ── 8. El folio, guardado en la galería ───────────────────── */
  console.log('\n📷 El folio se puede guardar como imagen');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON);
    await page.waitForSelector('.puerta');
    await llenaFormulario(page);
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');

    comprueba(await page.locator('#g-guardar').count() === 1,
      'el botón de guardarlo está donde se acaba de leer el folio');
    await page.click('#g-guardar');
    await page.waitForSelector('#g-tarjeta[style*="block"]');
    const src = await page.getAttribute('#g-tarjeta-img', 'src');
    comprueba(/^data:image\/png/.test(src) && src.length > 20000,
      'se pinta una imagen de verdad, y se enseña para poder guardarla con el dedo');

    // La tarjeta lleva DENTRO el folio: dos folios distintos no pueden
    // dar la misma imagen.
    const distintas = await page.evaluate(() => {
      const a = dibujaTarjeta('B-7K3M', '9988-7766', 'nota', '2026-08-08').toDataURL();
      const b = dibujaTarjeta('B-9WQ2', '9988-7766', 'nota', '2026-08-08').toDataURL();
      return a !== b;
    });
    comprueba(distintas, 'y cada folio da su propia imagen');

    /* Que el aviso del final no se salga de su caja y se coma el pie.
       Pasó: el recuadro amarillo se dibujaba con una altura a ojo y con
       un teléfono largo el texto se iba por debajo, encima de la fecha.
       Se mira el color del recuadro en la franja de abajo: si aparece
       ahí, es que creció más de la cuenta. */
    const invade = await page.evaluate(() => {
      const c = dibujaTarjeta('B-7K3M', '+504 9550-9428 ext. 12', 'aulas', '2026-08-08');
      const x = c.getContext('2d');
      const franja = x.getImageData(0, c.height - 90, c.width, 90).data;
      for (let i = 0; i < franja.length; i += 4) {
        // #fef3c7, el amarillo del aviso
        if (franja[i] === 254 && franja[i + 1] === 243 && franja[i + 2] === 199) return true;
      }
      return false;
    });
    comprueba(!invade, 'el aviso de abajo cabe en su caja y no pisa el pie de la tarjeta');
    await page.close();
  }

  /* ── 9. Corregir lo que ya mandó ───────────────────────────── */
  console.log('\n✏️ El lector corrige lo que mandó');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON + '?mio=1');
    await page.waitForSelector('#r-fol');
    await page.fill('#r-fol', 'B-7K3M');
    await page.fill('#r-tel', '9988-7766');
    await page.click('#r-go');
    await page.waitForSelector('#m-editar');
    const pedido = estado.llamadas.filter(l => l.fn === 'faro_buzon_mio').pop().cuerpo;
    comprueba(pedido.p_folio === 'B-7K3M' && pedido.p_tel === '9988-7766',
      'para recuperarlo pide folio y teléfono, las dos cosas');
    comprueba((await page.textContent('#app')).includes('El muro del patio'),
      'le enseña lo que había escrito antes de dejarle tocar nada');

    await page.click('#m-editar');
    await page.waitForSelector('#f-txt');
    comprueba(await page.inputValue('#f-txt') === estado.mio.texto,
      'lo suyo vuelve al mismo formulario, ya escrito');
    comprueba((await page.textContent('#app')).includes('Corrigiendo'),
      'y la pantalla deja claro que está corrigiendo, no mandando otro');
    comprueba(/2 fotos/.test(await page.textContent('#app')) && await page.locator('#f-file').count() === 0,
      'las fotos que ya mandó se quedan sin volver a bajarlas ni subirlas');

    await page.fill('#f-txt', 'Se cayó el muro del patio. Corrijo: fue el martes, no el lunes, y son dos tramos.');
    await page.click('#f-seguir');
    await page.check('#e-ok');
    await page.click('#e-enviar');
    await page.waitForSelector('.folio-n');

    comprueba(estado.llamadas.filter(l => l.fn === 'faro_buzon_enviar').length === 0,
      'NO se manda un envío nuevo: eso dejaría dos casi iguales en la bandeja');
    const ed = estado.llamadas.filter(l => l.fn === 'faro_buzon_editar').pop().cuerpo;
    comprueba(ed.p_folio === 'B-7K3M' && /son dos tramos/.test(ed.p_texto),
      'se corrige la fila que ya estaba, por su folio');
    comprueba(ed.p_fotos_cambiar === false,
      'y sin tocar las fotos, porque no pidió cambiarlas');
    comprueba((await page.textContent('.folio-n')) === 'B-7K3M',
      'el folio sigue siendo el mismo: el lector no tiene que apuntar otro');
    comprueba(/Corregido/i.test(await page.textContent('#app')),
      'y se lo dice con esa palabra, no con «recibido»');
    await page.close();
  }
  {
    // Lo que ya está en la revista no se cambia, y hay que decir por qué
    const estado = nuevoEstado({ editar: 'atendido' });
    estado.mio = Object.assign({}, estado.mio, { estado: 'atendido', se_puede: false });
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON + '?mio=1');
    await page.fill('#r-fol', 'B-7K3M');
    await page.fill('#r-tel', '9988-7766');
    await page.click('#r-go');
    await page.waitForSelector('#m-retirar');
    comprueba(await page.locator('#m-editar').count() === 0,
      'un envío ya atendido no enseña el botón de corregir');
    const txt = await page.textContent('#app');
    comprueba(/comprob/i.test(txt) && /llam/i.test(txt),
      'y le explica por qué y qué hacer: hablar con quien le llamó');
    comprueba(await page.locator('#m-retirar').count() === 1,
      'retirarlo sí lo puede seguir haciendo');
    await page.close();
  }

  /* ── 10. Retirar lo mandado ────────────────────────────────── */
  console.log('\n🗑️ El lector puede retirar lo que mandó');
  {
    const estado = nuevoEstado();
    const page = await nuevaPagina(browser, estado);
    await page.goto(URL_BUZON + '?retirar=1');
    await page.waitForSelector('#r-fol');
    ok('se puede llegar directo, sin pasar por el formulario');

    await page.fill('#r-fol', 'B-7K3M');
    await page.fill('#r-tel', '99887766');
    await page.click('#r-go');
    await page.waitForSelector('#m-retirar');
    await page.click('#m-retirar');
    await page.waitForSelector('#rr-volver');
    const ret = estado.llamadas.filter(l => l.fn === 'faro_buzon_retirar').pop().cuerpo;
    comprueba(ret.p_folio === 'B-7K3M' && ret.p_tel === '99887766',
      'pide las dos cosas que solo tiene quien lo mandó: folio y teléfono');

    estado.mio = null;
    await page.goto(URL_BUZON + '?retirar=1');
    await page.fill('#r-fol', 'B-0000');
    await page.fill('#r-tel', '99887766');
    await page.click('#r-go');
    // Entre medias se ve un «Buscándolo…» que no tiene el hueco del
    // error: si se da por hecho que está, la prueba revienta sola.
    await page.waitForFunction(() => {
      const e = document.getElementById('r-err');
      return e && /No encontr/.test(e.textContent);
    });
    ok('con un folio que no es suyo, no encuentra nada y lo dice');
    await page.close();
  }

  await browser.close();
  console.log(`\n${fallos ? '❌ ' + fallos + ' fallos' : '✅ todo en orden'}\n`);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
