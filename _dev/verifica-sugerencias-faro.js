/* ═══════════════════════════════════════════════════════════════
   💬 LAS SUGERENCIAS DE LAS MISIONES, ¿LLEGAN A ALGUIEN?

   El botón «💬 Sugerencias» lleva años dentro de cada misión y hasta
   ahora era un cajón cerrado: lo escrito se guardaba en el almacén de
   ESE teléfono y nadie lo leía jamás. Ahora sale hacia la bandeja del
   administrador, en F.A.R.O.

   Lo que esta sonda vigila es exactamente lo que costaría caro:

   · QUE SALGA, Y AL SITIO CORRECTO. Los resultados van al proyecto de
     M.E.T.A.S y las sugerencias al de F.A.R.O. Son dos servidores
     distintos: mandarlas al de siempre las volvería a enterrar, esta
     vez en una tabla donde nadie las busca.

   · QUE VAYA LA MISIÓN Y LA SECCIÓN. Un «la pregunta 3 está mala» sin
     decir de qué misión es un mensaje inservible: hay más de sesenta.

   · QUE NO SE PIERDA SIN INTERNET. Es el caso normal, no el raro: el
     aula está en un pueblo y la señal va y viene. Si falla el envío,
     el mensaje tiene que quedarse en la cola y salir al abrir la
     siguiente misión.

   · QUE UN REINTENTO NO DUPLIQUE. El teléfono no sabe si el primer
     envío entró. Manda el mismo identificador de evento, y ese es el
     que hace que el segundo CORRIJA en vez de dejar gemelos.

   · QUE LO YA ATRAPADO SALGA (el «backfill»). Las sugerencias escritas
     antes de que existiera este camino están en los teléfonos. Si no
     salen, este arreglo no arregla lo que ya pasó.

   · QUE UN «NO» DEFINITIVO NO ATASQUE LA COLA. Al servidor un texto de
     tres letras no le entra nunca. Si el teléfono lo reintentara, se
     quedaría dando vueltas y los mensajes buenos detrás de él.

   La nube NO se toca: se ponen los dos Supabase de mentira con
   page.route, así corre sin internet y sin ensuciar datos reales.

   Uso:
     node _dev/servidor-estatico.js            (en otra terminal)
     node _dev/verifica-sugerencias-faro.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { chromium } = require('playwright');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const MISION = '/misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html';

/* Los dos proyectos. Que sean distintos es el punto de la primera
   comprobación, así que se escriben aquí y no se deducen. */
const SB_FARO  = 'bzrnjvalpwlcnpszvwim.supabase.co';
const SB_METAS = 'uljjgrikyigdrkbikcxo.supabase.co';

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (cond, m) => (cond ? ok(m) : mal(m));
const esperar = ms => new Promise(r => setTimeout(r, ms));

/* ── Los dos Supabase de mentira ──
   Guardan lo que les mandan para poder revisarlo después. `caido`
   simula el internet cortado en el momento del envío. */
function nube(estado) {
  return async route => {
    const url = route.request().url();
    const fn = url.split('/rpc/')[1].split('?')[0];
    const cuerpo = JSON.parse(route.request().postData() || '{}');
    estado.llamadas.push({ url, fn, cuerpo });

    if (fn === 'faro_metas_sugerencia_enviar') {
      if (estado.caido) return route.abort('failed');
      const txt = String(cuerpo.p_texto || '').trim();
      if (txt.length < 5) {
        return route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: false, motivo: 'corto' }) });
      }
      /* El mensaje con el que el servidor se atraganta siempre. Existe
         porque es el que puede taponar la cola entera. */
      if (estado.atragantado && cuerpo.p_evento_id === estado.atragantado) {
        return route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: false, motivo: 'error' }) });
      }
      /* Como el servidor de verdad: la llave es el evento, así que un
         reintento corrige la fila en vez de añadir otra. */
      const ya = estado.filas.findIndex(f => f.p_evento_id === cuerpo.p_evento_id);
      if (ya >= 0) estado.filas[ya] = cuerpo; else estado.filas.push(cuerpo);
      return route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, nuevo: ya < 0 }) });
    }
    // cualquier otra (las de resultados de M.E.T.A.S, el código de aula…)
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  };
}

/* Escribe una sugerencia como lo haría una persona: abre la misión,
   toca el botón, elige el tipo y escribe. */
async function escribirSugerencia(page, { categoria, texto }) {
  await page.click('#metasBtnSug');
  await page.waitForSelector('#metasSugModal');
  await page.selectOption('#metasSugCat', categoria);
  await page.fill('#metasSugTexto', texto);
  await page.click('#metasSugEnviar');
}

(async () => {
  console.log('\n💬 Sugerencias de las misiones → bandeja de F.A.R.O\n');

  const navegador = await chromium.launch();
  const contexto = await navegador.newContext();
  const estado = { filas: [], llamadas: [], caido: false, atragantado: null };

  /* Se intercepta por la ruta de la función, no por el nombre del
     servidor: es lo que hacen las demás sondas, y así la URL entera
     llega intacta al registro para poder comprobar A CUÁL de los dos
     proyectos se mandó, que es medio punto de todo esto. */
  await contexto.route('**/rest/v1/rpc/**', nube(estado));
  const page = await contexto.newPage();

  /* ── 1. Se escribe una sugerencia y sale ───────────────────── */
  console.log('1. Se escribe una sugerencia dentro de la misión');
  await page.goto(BASE + MISION);
  await page.waitForSelector('#metasBtnSug');
  // Identificarse primero: así se comprueba que el nombre y el grado
  // viajan pegados al mensaje (son opcionales, pero si están, van).
  await page.evaluate(() => {
    localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({
      nombre: 'Ana López', num: '7', escuela: 'Escuela Lempira',
      grado: '6º-1', docente: 'Prof. Josué', codigo_aula: 'K2M9P',
    }));
  });
  await page.reload();
  await page.waitForSelector('#metasBtnSug');

  await escribirSugerencia(page, {
    categoria: 'error_contenido',
    texto: 'En la pregunta 3 de la evaluación la respuesta buena está marcada mal.',
  });
  comprueba(await page.locator('#metasSugModal').count() === 0, 'La ventana se cierra al enviar');

  // El puente espera cuatro segundos antes de mandar, a propósito
  await page.evaluate(() => window.METAS_SUG && window.METAS_SUG.sincronizar());
  await esperar(600);

  const env = estado.filas.find(f => /pregunta 3/.test(f.p_texto || ''));
  comprueba(!!env, 'El mensaje llegó al servidor');

  /* ── 2. …y al servidor CORRECTO ─────────────────────────────── */
  console.log('\n2. Va al proyecto de F.A.R.O, no al de M.E.T.A.S');
  const llamadaSug = estado.llamadas.find(l => l.fn === 'faro_metas_sugerencia_enviar');
  comprueba(!!llamadaSug && llamadaSug.url.includes(SB_FARO),
    'La sugerencia se manda al proyecto de F.A.R.O');
  comprueba(!!llamadaSug && !llamadaSug.url.includes(SB_METAS),
    'NO se manda al proyecto de M.E.T.A.S (ahí nadie la buscaría)');

  /* ── 3. Con la misión, la sección y quién ──────────────────── */
  console.log('\n3. Lleva dónde estaba y quién escribió');
  comprueba(env && env.p_mision === '2y3ciclo-adjetivos', 'Va la misión');
  comprueba(env && /adjetivo/i.test(env.p_mision_titulo || ''), 'Va el título de la misión, legible');
  comprueba(env && /adjetivos-II-IIICiclo\.html$/.test(env.p_url || ''),
    'Va la dirección exacta de la página (sin ella no se puede ir a mirar el error)');
  comprueba(env && env.p_categoria === 'error_contenido', 'Va el tipo de mensaje');
  comprueba(env && env.p_alumno === 'Ana López', 'Va el nombre');
  comprueba(env && env.p_grado === '6º-1', 'Va el grado, escrito como manda la normativa');
  comprueba(env && env.p_escuela === 'Escuela Lempira', 'Va la escuela');
  comprueba(env && /^D-/.test(env.p_dispositivo || ''), 'Va el aparato (es lo que frena al que spamea)');
  comprueba(env && !!env.p_escrito_at, 'Va cuándo se escribió');

  /* ── 4. Un texto de tres letras no atasca la cola ──────────── */
  console.log('\n4. Lo que el servidor nunca va a aceptar no se queda dando vueltas');
  // La propia pantalla lo para antes: es la primera puerta.
  await page.click('#metasBtnSug');
  await page.waitForSelector('#metasSugModal');
  await page.fill('#metasSugTexto', 'aa');
  await page.click('#metasSugEnviar');
  comprueba(await page.locator('#metasSugModal').count() === 1,
    'La pantalla no deja mandar dos letras y se queda abierta para escribir más');
  comprueba((await page.locator('#metasSugAviso').textContent()).trim().length > 0,
    'Y dice por qué, en vez de no hacer nada');
  await page.click('#metasSugCancelar');

  // Y si aun así llegara uno corto a la cola, se tira y no se reintenta.
  await page.evaluate(() => {
    const cola = JSON.parse(localStorage.getItem('METAS_SUG_OUTBOX_V1') || '[]');
    cola.push({ evento_id: 'E-corto01', categoria: 'idea', texto: 'aa', mision: 'x',
      mision_titulo: '', seccion: '', url: '', alumno: '', grado: '', escuela: '',
      docente: '', codigo_aula: '', dispositivo: 'D-TEST', escrito_at: null });
    localStorage.setItem('METAS_SUG_OUTBOX_V1', JSON.stringify(cola));
  });
  await page.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(600);
  const colaTrasCorto = await page.evaluate(() => window.METAS_SUG.cola());
  comprueba(!colaTrasCorto.some(f => f.evento_id === 'E-corto01'),
    'Un «no» definitivo saca el mensaje de la cola en vez de reintentarlo para siempre');

  /* ── 5. Sin internet no se pierde ───────────────────────────── */
  console.log('\n5. Sin internet, el mensaje espera y sale después');
  estado.caido = true;
  await escribirSugerencia(page, {
    categoria: 'error_tecnico',
    texto: 'El cronómetro de la lectura no se detiene cuando termina el minuto.',
  });
  await page.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(600);

  comprueba(!estado.filas.some(f => /cronómetro/.test(f.p_texto || '')),
    'Con el internet caído no llegó (como debe ser)');
  const pend = await page.evaluate(() => window.METAS_SUG.pendientes());
  comprueba(pend >= 1, 'Pero se quedó guardado en el teléfono, no se perdió');

  // Vuelve la señal y se abre otra misión: tiene que salir solo
  estado.caido = false;
  await page.goto(BASE + '/misiones/2y3ciclo-verbos/verbos-II-III-ciclo-basica.html');
  await page.waitForSelector('#metasBtnSug');
  await page.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(800);

  const tardio = estado.filas.find(f => /cronómetro/.test(f.p_texto || ''));
  comprueba(!!tardio, 'Al abrir la siguiente misión con señal, salió solo');
  comprueba(tardio && tardio.p_mision === '2y3ciclo-adjetivos',
    'Y sigue diciendo que era de los adjetivos, no de la misión desde la que salió');
  comprueba(await page.evaluate(() => window.METAS_SUG.pendientes()) === 0,
    'La cola queda vacía');

  /* ── 6. Un reintento corrige, no duplica ───────────────────── */
  console.log('\n6. Reintentar no deja mensajes gemelos en la bandeja');
  const antes = estado.filas.length;
  const idReintentado = await page.evaluate(() =>
    (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1') || '[]'))
      .filter(e => e.tipo === 'sugerencia').pop().id);
  const vecesMandado = () => estado.llamadas.filter(l =>
    l.fn === 'faro_metas_sugerencia_enviar' && l.cuerpo.p_evento_id === idReintentado).length;
  const mandadoAntes = vecesMandado();
  await page.evaluate(() => {
    // El caso real: el envío entró pero la respuesta se perdió por el
    // camino, así que el teléfono lo tiene todavía en la cola.
    const cola = JSON.parse(localStorage.getItem('METAS_SUG_OUTBOX_V1') || '[]');
    const ultimo = (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1') || '[]'))
      .filter(e => e.tipo === 'sugerencia').pop();
    cola.push({
      evento_id: ultimo.id, categoria: ultimo.categoria, texto: ultimo.texto,
      mision: ultimo.mision, mision_titulo: '', seccion: '', url: '',
      alumno: ultimo.alumno || '', grado: '', escuela: '', docente: '',
      codigo_aula: '', dispositivo: ultimo.disp || '', escrito_at: ultimo.t,
    });
    localStorage.setItem('METAS_SUG_OUTBOX_V1', JSON.stringify(cola));
  });
  await page.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(600);
  // Las dos mitades: que el reintento OCURRIÓ de verdad (si no, esta
  // comprobación pasaría sola sin probar nada) y que no dejó gemela.
  comprueba(vecesMandado() > mandadoAntes, 'El teléfono lo volvió a mandar');
  comprueba(estado.filas.length === antes,
    'Y el segundo intento corrigió la fila que ya estaba: sigue habiendo una sola');

  /* ── 6b. Un mensaje atragantado no tapona a los de detrás ──── */
  console.log('\n6b. Un mensaje con el que el servidor se atraganta no bloquea a los demás');
  /* Es la avería peor de todas y la más silenciosa: la cola se manda
     siempre desde el principio, así que un mensaje que nunca sale se
     queda de tapón y NINGUNO de los de detrás llega jamás. El aparato
     seguiría diciendo «va camino al equipo». */
  await page.evaluate(() => {
    const base = { categoria: 'idea', mision: 'm', mision_titulo: '', seccion: '',
      url: '', alumno: '', grado: '', escuela: '', docente: '', codigo_aula: '',
      dispositivo: 'D-TEST', escrito_at: null };
    localStorage.setItem('METAS_SUG_OUTBOX_V1', JSON.stringify([
      Object.assign({ evento_id: 'E-tapon', texto: 'El mensaje con el que el servidor se atraganta.' }, base),
      Object.assign({ evento_id: 'E-detras1', texto: 'Yo venia detras del tapon y tengo algo que decir.' }, base),
      Object.assign({ evento_id: 'E-detras2', texto: 'Y yo tambien venia detras, con otra errata.' }, base),
    ]));
  });
  estado.atragantado = 'E-tapon';
  // Varias tandas, como varias aperturas de misión seguidas
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.METAS_SUG.sincronizar());
    await esperar(400);
  }
  comprueba(estado.filas.some(f => f.p_evento_id === 'E-detras1') &&
            estado.filas.some(f => f.p_evento_id === 'E-detras2'),
    'Los que venían detrás del tapón llegaron igual');

  // Y el atragantado no se reintenta para siempre
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.METAS_SUG.sincronizar());
    await esperar(300);
  }
  comprueba(await page.evaluate(() => window.METAS_SUG.pendientes()) === 0,
    'Y el atragantado se deja de reintentar en vez de quedarse dando vueltas para siempre');
  estado.atragantado = null;

  /* ── 7. Lo ya atrapado en el teléfono también sale ──────────── */
  console.log('\n7. Las sugerencias viejas, las que nadie leyó nunca, salen también');
  const page2 = await contexto.newPage();
  await page2.goto(BASE + MISION);
  await page2.evaluate(() => {
    // Un teléfono de antes de que existiera este camino: tiene una
    // sugerencia guardada y ninguna marca de haberla mandado.
    localStorage.clear();
    localStorage.setItem('METAS_DISPOSITIVO', 'D-VIEJO1');
    localStorage.setItem('METAS_REGISTRO_V1', JSON.stringify([{
      id: 'E-viejo001', t: '2026-03-04T15:20:00.000Z', tipo: 'sugerencia',
      mision: '2y3ciclo-sustantivos', alumno: 'Carlos', grado: '5º-2',
      categoria: 'error_contenido', seccion: 'quiz', disp: 'D-VIEJO1',
      texto: 'En el quiz dice que «Honduras» es sustantivo común y es propio.',
    }]));
  });
  await page2.reload();
  await page2.waitForSelector('#metasBtnSug');
  await page2.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(800);

  const viejo = estado.filas.find(f => f.p_evento_id === 'E-viejo001');
  comprueba(!!viejo, 'La sugerencia que llevaba meses atrapada en el teléfono salió');
  comprueba(viejo && viejo.p_mision === '2y3ciclo-sustantivos', 'Con su misión');
  comprueba(viejo && String(viejo.p_escrito_at || '').startsWith('2026-03-04'),
    'Y con la fecha en la que se escribió de verdad, no la de hoy');

  // Y no se manda dos veces cada vez que se abre una misión
  const cuantasViejo = () => estado.filas.filter(f => f.p_evento_id === 'E-viejo001').length;
  await page2.reload();
  await page2.waitForSelector('#metasBtnSug');
  await page2.evaluate(() => window.METAS_SUG.sincronizar());
  await esperar(600);
  comprueba(cuantasViejo() === 1, 'Y al reabrir la misión no se vuelve a mandar');

  await navegador.close();

  console.log('\n' + (fallos
    ? `❌ ${fallos} fallo${fallos === 1 ? '' : 's'}. El mensaje de alguien se está perdiendo.`
    : '✅ Todo bien: lo que se escribe en una misión llega a la bandeja.') + '\n');
  process.exit(fallos ? 1 : 0);
})();
