/* =====================================================================
   M.E.T.A.S · Volver visible y el perfil en su pantalla
   ---------------------------------------------------------------------
   Con datos ficticios (CEB John Arnold Cook e Instituto María Consuelo):
   · el botón Volver se ve arriba a 360 px y en escritorio, y sigue
     ahí después de bajar la página;
   · Notas SACE no trae el formulario;
   · al cambiar de centro solo queda el grupo de ese centro;
   · el perfil es otra pantalla, con el nombre del maestro.

   Uso: node _dev/servidor-estatico.js
        node _dev/verifica-volver-mi-aula.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const ARTE = process.env.METAS_ARTE || '/opt/cursor/artifacts';
let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

async function caja(page, sel) {
  return page.locator(sel).first().evaluate(el => {
    const r = el.getBoundingClientRect();
    const medio = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      w: r.width, h: r.height, top: r.top, left: r.left, bottom: r.bottom,
      /* ⚠️ Se redondea a la unidad con que Chromium coloca las cajas (1/64 de px)
         antes de comparar, como en verifica-notas-sace-simple. Lo que mide 44 px de
         verdad (min-height: 44px) a veces vuelve como 43,99998 por la resta en coma
         flotante de getBoundingClientRect, y la sonda salía roja o verde según la
         corrida sin que cambiara un píxel. Lo que no mide 44 (43,98 o menos) sigue
         saliendo rojo. */
      visible: Math.round(r.width * 64) / 64 >= 44 && Math.round(r.height * 64) / 64 >= 44 && r.top >= 0 && r.left >= 0
        && r.bottom <= window.innerHeight && r.right <= window.innerWidth,
      encima: !!(medio && (medio === el || el.contains(medio))),
      texto: (el.innerText || '').trim(),
    };
  });
}

async function sinScrollDeLado(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
}

(async () => {
  fs.mkdirSync(ARTE, { recursive: true });
  const nav = await abrir();
  const page = await nav.newPage({ ...SIN_SW, locale: 'es-HN' });
  const url = BASE + '/_dev/pantalla-perfil-ficticia.html';

  async function entrar(ancho, alto) {
    await page.setViewportSize({ width: ancho, height: alto });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#mi-aula-back-btn');
    await page.waitForSelector('[data-metas="perfil-centro"]');
  }

  await entrar(360, 780);
  let volver = await caja(page, '#mi-aula-back-btn');
  ok(volver.visible && volver.encima && /Volver/.test(volver.texto),
    'a 360 px, Volver se ve arriba y se puede tocar');
  ok(await page.locator('[data-form="centro"]').count() === 0, 'a 360 px, Notas SACE no trae el formulario');
  ok(await page.locator('text=CEB John Arnold Cook').count() > 0, 'se ve el centro activo');
  ok(await page.locator('[data-valor="a6"]').count() === 1 && await page.locator('[data-valor="a8"]').count() === 0,
    'solo se ven los grupos de John Arnold Cook');
  ok(await sinScrollDeLado(page), 'a 360 px no hay scroll de lado');
  await page.screenshot({ path: path.join(ARTE, 'perfil-360-notas-cook.png') });

  await page.locator('.view-scroll').evaluate(el => { el.scrollTop = 600; });
  volver = await caja(page, '#mi-aula-back-btn');
  ok(volver.visible && volver.encima, 'al bajar la página, Volver sigue arriba');
  await page.screenshot({ path: path.join(ARTE, 'perfil-360-scroll-volver.png') });

  await page.locator('[data-valor="consuelo"]').click();
  await page.waitForSelector('[data-valor="a8"]');
  ok(await page.locator('[data-valor="a8"]').count() === 1 && await page.locator('[data-valor="a6"]').count() === 0,
    'en María Consuelo solo se ve su grupo');
  ok((await page.locator('body').innerText()).includes('Inglés') && !(await page.locator('[data-valor="a6"]').count()),
    'las materias que se ven son las de ese grupo');
  ok(await sinScrollDeLado(page), 'al cambiar de centro no aparece scroll de lado');
  await page.screenshot({ path: path.join(ARTE, 'perfil-360-notas-consuelo.png') });

  await page.locator('[data-metas="perfil-institucional"]').click();
  await page.waitForSelector('[data-form="centro"]');
  ok(await page.locator('text=Nombre del maestro(a)').count() > 0, 'el perfil pide el nombre del maestro');
  ok(await page.locator('.ma-secs').count() === 0, 'el perfil no muestra las secciones de Notas SACE');
  ok((await page.locator('[data-centro="docente"]').inputValue()) === 'Ana Sofía Mejía',
    'el nombre del maestro sale en el campo');
  volver = await caja(page, '#mi-aula-back-btn');
  ok(volver.visible && /Volver/.test(volver.texto), 'en el perfil, Volver sigue arriba');
  await page.screenshot({ path: path.join(ARTE, 'perfil-360-perfil.png') });
  await page.locator('#mi-aula-back-btn').click();
  await page.waitForSelector('[data-metas="perfil-desde-notas"]');
  ok(await page.locator('[data-form="centro"]').count() === 0, 'Volver regresa a las notas, sin el formulario');

  await entrar(1100, 800);
  volver = await caja(page, '#mi-aula-back-btn');
  ok(volver.visible && volver.encima, 'en escritorio, Volver se ve arriba');
  ok(await page.locator('[data-form="centro"]').count() === 0, 'en escritorio, las notas no traen el formulario');
  await page.screenshot({ path: path.join(ARTE, 'perfil-escritorio-notas.png') });
  await page.locator('[data-valor="consuelo"]').click();
  await page.waitForSelector('[data-valor="a8"]');
  ok(await page.locator('[data-valor="a6"]').count() === 0, 'en escritorio, el otro centro esconde los grupos del primero');
  await page.screenshot({ path: path.join(ARTE, 'perfil-escritorio-consuelo.png') });
  await page.locator('[data-metas="perfil-institucional"]').click();
  await page.waitForSelector('text=Nombre del maestro(a)');
  await page.screenshot({ path: path.join(ARTE, 'perfil-escritorio-perfil.png') });
  volver = await caja(page, '#mi-aula-back-btn');
  ok(volver.visible, 'en escritorio, el perfil también tiene Volver arriba');

  await nav.close();
  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ Volver y el perfil se ven donde tienen que verse');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
