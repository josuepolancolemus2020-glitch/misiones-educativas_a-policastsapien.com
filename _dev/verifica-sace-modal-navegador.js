/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · «Guardar lo marcado» se ve y se toca, en PC y en teléfono
   ──────────────────────────────────────────────────────────────
   La mitad que MIDE de verdad (la rápida es verifica-sace-modal): abre
   Mi aula con el aula de prueba, importa el CSV de 41 alumnos y, en una
   PC de 1366×768, una de 1280×600, un Pixel 5 y un iPhone SE, pide:
   · que el cuerpo de la ventana se desplace;
   · que «Guardar lo marcado» esté dentro de la pantalla arriba Y abajo
     de la lista, sin nada encima (el botón «Instalar app» lo tapaba);
   · que tocarlo guarde.
   La nube no se toca: no hay sesión docente.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-sace-modal-navegador.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { devices } = require('playwright');
const { abrir, SIN_SW } = require('./lib-navegador');
const BASE = 'http://localhost:8123';
const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'sace-prueba', 'aula-prueba.json'), 'utf8'));
const CSV = path.join(__dirname, 'sace-prueba', 'lista-sace-prueba.csv');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '  ✔ ' : '  ✘ ') + t); if (!c) fallos++; };

async function probar(nav, nombre, opciones) {
  console.log('\n' + nombre);
  const ctx = await nav.newContext({ ...SIN_SW, ...opciones });
  const pg = await ctx.newPage();
  const errores = []; pg.on('pageerror', e => errores.push(e.message));
  await pg.addInitScript(g => {
    if (!sessionStorage.getItem('sembrado')) {
      localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: g.id, grupos: [g] }));
      sessionStorage.setItem('sembrado', '1');
    }
  }, fix.grupo);
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof renderAdmin === 'function' && typeof switchView === 'function');
  await pg.evaluate(() => { document.querySelectorAll('.metas-dlg-ov').forEach(x => x.remove()); switchView('view-admin'); _adFichasOn = 1; renderAdmin(true); });
  await pg.setInputFiles('#ad-fi-sace-file', CSV);
  await pg.waitForSelector('.ad-sace-card');
  const vh = pg.viewportSize().height;
  const medir = () => pg.evaluate(() => {
    const b = document.querySelector('#ad-sace-si').getBoundingClientRect();
    const encima = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return { arriba: b.top, abajo: b.bottom, libre: !!(encima && encima.closest('#ad-sace-si')) };
  });
  const c = await pg.evaluate(() => { const x = document.querySelector('.ad-sace-cuerpo'); return { h: x.scrollHeight, v: x.clientHeight, o: getComputedStyle(x).overflowY }; });
  ok(c.o === 'auto' && c.h > c.v, 'el cuerpo se desplaza (' + c.v + ' px de ' + c.h + ')');
  const a = await medir();
  ok(a.arriba >= 0 && a.abajo <= vh && a.libre, '«Guardar lo marcado» visible y sin nada encima al abrir');
  await pg.evaluate(() => { const x = document.querySelector('.ad-sace-cuerpo'); x.scrollTop = x.scrollHeight; });
  const z = await medir();
  ok(z.arriba >= 0 && z.abajo <= vh && z.libre, 'y también al final de la lista');
  await pg.click('#ad-sace-si');
  await pg.waitForTimeout(300);
  const guardadas = await pg.evaluate(() => adLoad().lista.filter(x => x.sace === true).length);
  ok(guardadas === 40, 'tocarlo guarda (' + guardadas + ' en lista oficial)');
  ok(!errores.length, 'sin errores en la página' + (errores.length ? ': ' + errores[0] : ''));
  await ctx.close();
}

(async () => {
  console.log('M.E.T.A.S · La ventana del SACE con el botón de guardar a la vista');
  const nav = await abrir();
  await probar(nav, 'PC 1366×768', { viewport: { width: 1366, height: 768 } });
  await probar(nav, 'PC 1280×600', { viewport: { width: 1280, height: 600 } });
  await probar(nav, 'Pixel 5', devices['Pixel 5']);
  await probar(nav, 'iPhone SE', devices['iPhone SE']);
  await nav.close();
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log('✖ ' + fallos + ' problema(s).'); process.exit(1); }
  console.log('✅ «Guardar lo marcado» se ve y guarda en PC y en teléfono.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
