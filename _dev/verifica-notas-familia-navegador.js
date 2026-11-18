/* ============================================================
   M.E.T.A.S · El portal muestra las notas de esa clave
   ------------------------------------------------------------
   Abre padres.html con una nube de mentira (nada sale al proyecto
   real) y comprueba las tres puertas con datos ficticios:

     a) la clave de Ana muestra sus notas, el recibo y el aviso;
     b) la clave de Beto no muestra nada de Ana, y una respuesta
        que mezcle a los dos no muestra ningún número;
     c) sin clave, o con una clave que no existe, no aparece
        ningún nombre, nota ni dato de más.

   Uso:  node _dev/servidor-estatico.js
         node _dev/verifica-notas-familia-navegador.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const BASE = process.env.BASE || 'http://localhost:8123';
const ANA = 'K7QMX4PA2B';
const BETO = '8HJKM2PQRS';
const NOTAS_ANA = [
  { nombre: 'Ana', asignatura: 'Matemáticas', periodo: 'I', valor: '85.00', identidad: 'CODIGO-AJENO-99' },
  { nombre: 'Ana', asignatura: 'Ciencias Naturales', periodo: 'I', valor: '64.00' },
  { nombre: 'Ana', asignatura: 'Español', periodo: 'II', valor: '91.50' },
];
const NOTAS_BETO = [
  { nombre: 'Beto', asignatura: 'Matemáticas', periodo: 'I', valor: '41.00', identidad: 'CODIGO-AJENO-99' },
];
const PROHIBIDO = ['41', 'Beto', 'CODIGO-AJENO'];

let fallos = 0;
function ok(nombre, cond, extra) {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra == null ? '' : ' → ' + String(extra).slice(0, 180)));
  if (!cond) fallos++;
}
function claveDe(txt) {
  return String(txt || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

(async () => {
  const nav = await abrir({ args: ['--no-sandbox'] });
  let salioAProduccion = false;

  async function portal(ancho, alto) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto }, isMobile: ancho < 700, hasTouch: true });
    await ctx.addInitScript(() => {
      localStorage.clear();
      window.__METAS_NUBE_DE_PRUEBA__ = { url: location.origin + '/__nube', llavePublica: 'llave-de-prueba' };
      localStorage.setItem('METAS_SB_URL', location.origin + '/__nube');
      localStorage.setItem('METAS_SB_KEY', 'llave-de-prueba');
    });
    const llamadas = [];
    let mezclar = false;
    let vinculada = '';
    await ctx.route('**/*', async (route) => {
      const url = route.request().url();
      if (/supabase\.co/.test(url)) { salioAProduccion = true; await route.abort(); return; }
      if (!url.includes('/__nube/')) { await route.continue(); return; }
      const body = route.request().postData() || '';
      llamadas.push(url + ' ' + body);
      const json = (dato) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(dato) });
      if (url.includes('/auth/v1/')) {
        return json({ access_token: 'tok-prueba', refresh_token: 'ref-prueba', expires_at: Math.floor(Date.now() / 1000) + 3600 });
      }
      if (url.includes('familia-vincular')) {
        const clave = claveDe(JSON.parse(body || '{}').clave);
        vinculada = (clave === ANA || clave === BETO) ? clave : '';
        return json(vinculada ? { ok: true } : { ok: false, motivo: 'clave' });
      }
      if (url.includes('/rpc/familia_notas')) {
        const clave = claveDe(JSON.parse(body || '{}').p_clave);
        if (mezclar) return json(NOTAS_ANA.concat(NOTAS_BETO));
        if (clave === ANA) return json(NOTAS_ANA);
        if (clave === BETO) return json(NOTAS_BETO);
        return json([]);
      }
      if (url.includes('vf_hijos')) {
        if (vinculada === ANA) return json([{ nombre: 'Ana', docente: 'Docente Ficticia', grado: 6, seccion: '1' }]);
        if (vinculada === BETO) return json([{ nombre: 'Beto', docente: 'Docente Ficticia', grado: 6, seccion: '1' }]);
        return json([]);
      }
      if (url.includes('vf_pagos')) {
        return json(vinculada === ANA
          ? [{ recibo: 'RC-27-K7QMX-0001', concepto: 'Excursión de prueba', monto: '150.00', corrige_al_recibo: null }]
          : []);
      }
      if (url.includes('vf_avisos')) {
        return json(vinculada === ANA ? [{ titulo: 'Reunión de prueba', texto: 'El viernes a las 8.' }] : []);
      }
      if (url.includes('metas_consultar_')) return json([]);
      return json([]);
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/padres.html', { waitUntil: 'domcontentloaded' });
    return { ctx, page, llamadas, mezclar: (v) => { mezclar = v; } };
  }

  async function entrar(page, escrita) {
    /* El saludo tarda un instante en pintarse. Si se escribe encima, el
       «escribiendo…» de ese saludo se queda pegado. */
    await page.waitForFunction(() => /clave de la familia/.test(document.body.innerText), null, { timeout: 8000 });
    await page.fill('[data-metas="familia-clave"]', escrita);
    await page.click('[data-metas="familia-entrar"]');
  }
  async function texto(page) {
    return page.locator('#chat').innerText();
  }

  console.log('\n— a) la clave de Ana muestra sus notas');
  {
    const { ctx, page, llamadas } = await portal(390, 844);
    await entrar(page, 'K7QMX-4PA2B');
    await page.waitForFunction(() => document.body.innerText.includes('Notas de Ana'), null, { timeout: 8000 });
    const t = await texto(page);
    const notas = await page.locator('[data-metas="familia-notas"]').innerText();
    ok('se ve a Ana', t.includes('Ana') && t.includes('Docente Ficticia'));
    ok('Matemáticas 85, va bien', notas.includes('Matemáticas') && notas.includes('85') && notas.includes('va bien') && notas.includes('✓'));
    ok('Ciencias 64, hay que repasar', notas.includes('64') && notas.includes('hay que repasar') && notas.includes('✗'));
    ok('Español 91.5', notas.includes('Español') && notas.includes('91.5'));
    ok('el recibo y el aviso siguen ahí', t.includes('L 150.00') && t.includes('RC-27-K7QMX-0001') && t.includes('Reunión de prueba'));
    PROHIBIDO.forEach((d) => ok('no se ve «' + d + '»', !t.includes(d)));
    const pedidas = llamadas.filter((l) => l.includes('familia_notas')).map((l) => claveDe(l));
    ok('la pregunta llevó la clave de Ana y ninguna otra', pedidas.length === 1 && pedidas[0].includes(ANA) && !pedidas[0].includes(BETO));
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    ok('en el teléfono no se sale de la pantalla', ancho);
    const dir = '/opt/cursor/artifacts';
    try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
    if (fs.existsSync(dir)) {
      await page.screenshot({ path: path.join(dir, 'portal-notas-familia.png'), fullPage: true });
      ok('quedó la captura', fs.existsSync(path.join(dir, 'portal-notas-familia.png')));
    }
    await ctx.close();
  }

  console.log('\n— a) en una pantalla ancha tampoco se sale');
  {
    const { ctx, page } = await portal(1280, 800);
    await entrar(page, ANA);
    await page.waitForFunction(() => document.body.innerText.includes('Notas de Ana'), null, { timeout: 8000 });
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    ok('en el escritorio no se sale de la pantalla', ancho);
    await page.fill('[data-metas="familia-clave"]', 'qué sacó');
    await page.click('[data-metas="familia-entrar"]');
    await page.waitForFunction(() => (document.body.innerText.match(/Notas de Ana/g) || []).length >= 2, null, { timeout: 8000 });
    ok('preguntar «qué sacó» vuelve a mostrar las mismas notas', (await texto(page)).includes('85') && !(await texto(page)).includes('41'));
    await ctx.close();
  }

  console.log('\n— b) la clave de Beto no ve a Ana');
  {
    const { ctx, page, llamadas } = await portal(390, 844);
    await entrar(page, BETO);
    await page.waitForFunction(() => document.body.innerText.includes('Notas de Beto'), null, { timeout: 8000 });
    const t = await texto(page);
    ok('se ve la nota de Beto', t.includes('41') && t.includes('hay que repasar'));
    ok('no se ve la nota de Ana ni su recibo', !t.includes('85') && !t.includes('91.5') && !t.includes('L 150.00') && !t.includes('Reunión de prueba'));
    ok('no se ve el dato de más', !t.includes('CODIGO-AJENO'));
    const pedidas = llamadas.filter((l) => l.includes('familia_notas'));
    ok('se preguntó con la clave de Beto', pedidas.length === 1 && pedidas[0].includes(BETO) && !pedidas[0].includes(ANA));
    await ctx.close();
  }

  console.log('\n— b) si la respuesta mezcla a dos niños, no se muestra ninguna nota');
  {
    const p = await portal(390, 844);
    p.mezclar(true);
    await entrar(p.page, ANA);
    await p.page.waitForFunction(() => document.body.innerText.includes('No se pueden mostrar las notas'), null, { timeout: 8000 });
    const t = await texto(p.page);
    ok('no sale ningún número ni el otro niño', !t.includes('85') && !t.includes('41') && !t.includes('64') && !t.includes('Beto') && !t.includes('CODIGO-AJENO'));
    await p.ctx.close();
  }

  console.log('\n— c) clave vacía o inválida');
  {
    const { ctx, page, llamadas } = await portal(390, 844);
    await page.click('[data-metas="familia-entrar"]');
    await page.waitForTimeout(600);
    ok('con la caja vacía no se pide nada', !llamadas.some((l) => l.includes('familia_notas') || l.includes('familia-vincular')));
    await entrar(page, 'ZZZZZZZZZZ');
    await page.waitForFunction(() => /Aún no hay notas|no pude consultar|Todavía no hay información/i.test(document.body.innerText), null, { timeout: 8000 });
    const t = await texto(page);
    ['85', '64', '91.5', '41', 'Ana', 'Beto', 'CODIGO-AJENO', 'L 150.00', 'Matemáticas'].forEach((d) => {
      ok('no aparece «' + d + '»', !t.includes(d));
    });
    ok('la clave inválida no llegó a pedir notas', !llamadas.some((l) => l.includes('familia_notas')));
    await ctx.close();
  }

  await nav.close();
  ok('no se habló con el proyecto real', !salioAProduccion);
  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El portal enseña solo las notas de la clave');
  process.exit(fallos ? 1 : 0);
})().catch((e) => {
  console.error('✘ La sonda tropezó:', e && e.stack || e);
  process.exit(1);
});
