/* ═══════════════════════════════════════════════════════════════
   🏫 LA BARRA DE GRUPOS: ¿SE ORDENA CON EL DEDO?

   El maestro que da clases en dos colegios acaba con diez o doce
   grupos en la barra, y los abre en un orden que solo él sabe: el de
   la primera hora, el de la tarde, el que le cubre a un compañero. El
   orden en que se crearon no es el orden en que se usan.

   Aquí se comprueba lo que hace que eso sirva o estorbe:

   · QUE SE MUEVA CON EL DEDO. No con el arrastre del navegador, que en
     un teléfono no existe: manteniendo tocado medio segundo y moviendo.
   · QUE EL DEDO QUE SOLO PASA NO SE LLEVE NADA. Si un deslizamiento
     para bajar la página arrastrara grupos, el maestro se encontraría
     la barra revuelta sin haber pedido nada.
   · QUE UN TOQUE CORTO SIGA CAMBIANDO DE GRUPO. Es lo que se hace
     cuarenta veces al día; ordenar es lo raro, y lo raro no puede
     romper lo de siempre.
   · QUE MOVERLO NO CAMBIE DE GRUPO. Se estaba ordenando, no entrando.
   · QUE EL ORDEN AGUANTE cerrar la aplicación: si se pierde al recargar,
     el maestro lo hace una vez y no vuelve a intentarlo.
   · QUE EL COLEGIO SOLO SALGA CUANDO HAY MÁS DE UNO. Con once grupos de
     la misma escuela, repetir su nombre once veces no distingue nada y
     duplica el alto de la barra: en un teléfono eran seis renglones de
     chips antes de llegar a lo suyo.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-orden-grupos.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
const comprueba = (c, m) => { console.log((c ? '  ✅ ' : '  ❌ ') + m); if (!c) fallos++; };

/* Seis grupos de la misma escuela: el caso del maestro que lleva varias
   secciones en el mismo colegio, que es el que trajo esta pantalla. */
const UNA = [['6', '1'], ['2', '2'], ['3', '1'], ['5', '1'], ['1', '2'], ['4', '1']]
  .map(([g, s]) => [g, s, 'JOHN ARNOLD COOK']);
/* Y el de dos colegios, donde el nombre SÍ hace falta para distinguir */
const DOS = [['6', '1', 'JOHN ARNOLD COOK'], ['2', '2', 'JOHN ARNOLD COOK'],
             ['7', 'A', 'FRANCISCO MORAZÁN'], ['8', 'B', 'FRANCISCO MORAZÁN']];

async function sembrar(page, datos) {
  await page.evaluate(gr => {
    const grupos = gr.map(([g, s, e], i) => ({
      id: 'G' + i, grado: g, seccion: s, escuela: e, materias: ['Español'],
      lista: [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
    }));
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G0', grupos }));
  }, datos);
}
const pintar = page => page.evaluate(() => {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-admin').classList.add('active');
  renderAdmin();
});

(async () => {
  const browser = await abrir();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.route('**/rest/v1/rpc/**', r => r.abort('failed'));   /* la nube no se toca */
  await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await sembrar(page, UNA);
  await pintar(page);
  await page.waitForSelector('.ad-gr-bar');

  const orden = () => page.$$eval('.ad-gr-chip[data-gid] .ad-gr-gs',
    ns => ns.map(n => n.textContent.trim()).join(' '));
  const guardado = () => page.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1'))
    .grupos.map(g => g.grado + 'º-' + g.seccion).join(' '));
  const activo = () => page.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).activo);

  /* Un dedo de verdad: se apoya, espera, mueve y suelta. `espera` es lo
     que decide si esto es agarrar un grupo o bajar la página. */
  const dedo = async (desde, hasta, espera, pasos) => {
    const cajas = await page.$$eval('.ad-gr-chip[data-gid]', ns => ns.map(n => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, l: r.left };
    }));
    const a = cajas[desde], z = cajas[hasta];
    await page.evaluate(([x, y]) => document.elementFromPoint(x, y).dispatchEvent(
      new PointerEvent('pointerdown', { clientX: x, clientY: y, pointerType: 'touch', bubbles: true, button: 0 })),
      [a.x, a.y]);
    await page.waitForTimeout(espera);
    for (let i = 1; i <= pasos; i++) {
      const x = a.x + (z.l + 6 - a.x) * i / pasos, y = a.y + (z.y - a.y) * i / pasos;
      await page.evaluate(([x, y]) => document.dispatchEvent(
        new PointerEvent('pointermove', { clientX: x, clientY: y, pointerType: 'touch', bubbles: true })), [x, y]);
      await page.waitForTimeout(25);
    }
    await page.evaluate(() => document.dispatchEvent(
      new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true })));
    await page.waitForTimeout(350);
  };

  console.log('🏫 LA BARRA DE GRUPOS — con el dedo, que es lo que tiene el maestro');
  console.log('\n── EL DEDO QUE ORDENA ──');
  console.log('  antes:  ' + await orden());
  await dedo(5, 0, 480, 8);
  console.log('  después: ' + await orden());
  comprueba((await orden()).startsWith('4º-1'),
    'manteniendo tocado medio segundo, el grupo se va al sitio nuevo');
  comprueba((await guardado()).startsWith('4º-1'),
    'y el orden queda guardado (quedó: ' + await guardado() + ')');
  comprueba(await activo() === 'G0',
    'moverlo NO cambia de grupo: se estaba ordenando, no entrando');
  comprueba(await page.locator('.ad-gr-tip').count() === 0,
    'y la pista se calla en cuanto lo aprendió');

  console.log('\n── EL DEDO QUE SOLO PASA DESLIZANDO ──');
  const antes = await orden();
  await dedo(1, 4, 40, 8);
  comprueba(await orden() === antes,
    'un dedo que se mueve enseguida no arrastra nada: está bajando la página');

  console.log('\n── EL TOQUE DE SIEMPRE ──');
  await page.locator('.ad-gr-chip[data-gid]').nth(2).tap();
  await page.waitForTimeout(400);
  comprueba(await activo() === await page.$eval('.ad-gr-chip[data-gid]:nth-of-type(3)', n => n.dataset.gid),
    'un toque corto sigue cambiando de grupo, como siempre');

  console.log('\n── AGUANTA CERRAR LA APLICACIÓN ──');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.renderAdmin === 'function');
  await pintar(page);
  await page.waitForSelector('.ad-gr-bar');
  comprueba((await orden()).startsWith('4º-1'),
    'al volver a abrir, los grupos siguen en el orden que les dejó el maestro');

  console.log('\n── EL NOMBRE DEL COLEGIO ──');
  const altoBarra = () => page.$eval('.ad-gr-bar', n => Math.round(n.getBoundingClientRect().height));
  const conEscuelas = () => page.locator('.ad-gr-esc').count();
  comprueba(await conEscuelas() === 0,
    'con un solo colegio no se repite su nombre en cada chip');
  const alto1 = await altoBarra();
  comprueba(alto1 <= 130,
    'y la barra cabe en tres renglones: ' + alto1 + 'px para seis grupos en un teléfono');

  await sembrar(page, DOS);
  await pintar(page);
  await page.waitForSelector('.ad-gr-bar');
  comprueba(await conEscuelas() === 4,
    'con dos colegios sí sale, que es lo único que distingue un 6º del otro');

  await page.close();
  await browser.close();
  errores.forEach(e => comprueba(false, 'error de página: ' + e));
  console.log('\n' + (fallos ? '✘ ' + fallos + ' fallo(s)' : '✔ la barra se ordena y no estorba'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('REVENTÓ:', e && e.message || e); process.exit(2); });
