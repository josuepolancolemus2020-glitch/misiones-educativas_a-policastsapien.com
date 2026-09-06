/*
  M.E.T.A.S — _dev/verifica-autopuntaje.js

  Vigila una sola cosa, y es la que acaba en el expediente del alumno:
  QUE EL NÚMERO QUE LE LLEGA AL MAESTRO NO LO ESCRIBA EL ALUMNO.

  Siete misiones de Programación y Robótica cierran su prueba operativa con
  producción abierta (escribir el condicional, el pseudocódigo, la corrección
  del bug) que el alumno se puntúa contra la pauta. Eso enseña a compararse y
  se queda; lo que no puede pasar es que ese número entre en el «Resultado»,
  porque js/metas-registro.js lo lee de ahí y lo registra como nota de la
  prueba operativa. Sin contestar nada y poniéndose el máximo, la pantalla
  llegó a decir «Resultado: 30/100» y el maestro lo recibía como si lo hubiera
  corregido el programa.

  La sonda hace justo eso —no contesta nada y se pone el máximo— y exige que
  el resultado sea CERO sobre la base automática.
*/
const { abrir } = require('./lib-navegador');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:8123';

// misión → página, y cuánto vale la parte automática y la que califica el maestro
const MISIONES = [
  { dir: '2y3ciclo-bucles-repetir',           pag: 'bucles-repetir.html',           auto: 70, manual: 30 },
  { dir: '2y3ciclo-detective-bugs',           pag: 'detective-bugs.html',           auto: 60, manual: 40 },
  { dir: '2y3ciclo-mi-primer-programa',       pag: 'mi-primer-programa.html',       auto: 70, manual: 30 },
  { dir: '2y3ciclo-pensamiento-computacional', pag: 'pensamiento-computacional.html', auto: 70, manual: 30, en: true },
  { dir: '2y3ciclo-robot-decide',             pag: 'robot-decide.html',             auto: 70, manual: 30, en: true },
  { dir: '2y3ciclo-robot-mensajero',          pag: 'robot-mensajero.html',          auto: 70, manual: 30 },
  { dir: '2y3ciclo-variables-cajitas',        pag: 'variables-cajitas.html',        auto: 70, manual: 30 },
];

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

(async () => {
  const nav = await abrir({ args: ['--no-sandbox'] });

  for (const m of MISIONES) {
    console.log('\n' + m.dir);
    const ctx = await nav.newContext({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
    // la nube no se toca: se corta toda llamada a Supabase
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    const pag = await ctx.newPage();
    const errores = [];
    pag.on('pageerror', e => errores.push(e.message));

    await pag.goto(`${BASE}/misiones/${m.dir}/${m.pag}`, { waitUntil: 'domcontentloaded' });
    await pag.waitForFunction(() => typeof window.genEvalOp === 'function', { timeout: 15000 });

    // se identifica como alumno, que es lo que hace que el registro anote
    await pag.evaluate(() => {
      localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({
        alumno: 'Sonda Autopuntaje', num: '7', grado: '6', seccion: '1',
        docente: 'Sonda', codigo_aula: '', escuela: 'Sonda',
      }));
    });

    // genera la prueba operativa y NO contesta nada
    await pag.evaluate(() => window.genEvalOp());
    // la sección vive oculta hasta que se navega a ella; basta con que exista
    await pag.waitForFunction(() => document.querySelectorAll('#evalOpOut .eval-item').length > 0, { timeout: 10000 });

    // el alumno se pone el máximo en TODAS las casillas de autopuntaje
    const puestos = await pag.evaluate(() => {
      const inps = [...document.querySelectorAll('#evalOpOut input[type="number"]')];
      inps.forEach(i => { i.value = i.max || '10'; });
      return inps.length;
    });
    ok(puestos > 0, `hay casillas de autopuntaje que rellenar (${puestos})`);

    await pag.evaluate(() => window.gradeEvalOp());
    await pag.waitForTimeout(150);

    const r = await pag.evaluate(() => {
      const el = document.getElementById('evalOpAutoResult');
      const txt = el ? (el.textContent || '') : '';
      // la MISMA lectura que hace js/metas-registro.js para anotar la nota
      const mm = txt.match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
      const dens = [...txt.matchAll(/\/(\d+)(?:\s|$|·)/g)];
      let ev = null;
      try {
        const evs = JSON.parse(localStorage.getItem('METAS_REGISTRO_V1') || '[]');
        ev = evs.filter(e => e.tipo === 'prueba_operativa').pop() || null;
      } catch (e) {}
      const desg = (document.querySelector('#evalOpAutoResult span') || {}).textContent || '';
      const suma = [...desg.matchAll(/\/(\d+)/g)].reduce((a, x) => a + (+x[1]), 0);
      return { txt, nota: mm ? +mm[1] : null, base: mm ? +mm[2] : null, ev, suma };
    });

    ok(r.nota === 0, 'sin contestar nada, la nota que se lee del panel es 0', { nota: r.nota, base: r.base });
    ok(r.base === m.auto, `la base es la automática (${m.auto}), no 100`, r.base);
    ok(/Falta calificar/.test(r.txt), 'el panel dice qué falta por calificar');
    ok(new RegExp('no cuenta para esta nota').test(r.txt), 'y dice que la autoevaluación no cuenta');
    ok(!!r.ev && r.ev.nota === 0 && r.ev.base === m.auto,
       'al maestro le llega 0 sobre la base automática',
       r.ev ? { nota: r.ev.nota, base: r.ev.base } : null);
    // el desglose tiene que sumar exactamente la base: si una sección se queda
    // fuera de la cuenta, el alumno ve un total que no cuadra con sus partes
    ok(r.suma === m.auto, `las secciones del desglose suman la base (${m.auto})`, r.suma);

    // en las bilingües, el panel nuevo no puede quedarse en español a medias
    if (m.en) {
      await pag.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find(x => /🌐/.test(x.textContent || ''));
        if (b) b.click();
      });
      await pag.waitForTimeout(400);
      const enTxt = await pag.evaluate(() => (document.getElementById('evalOpAutoResult') || {}).textContent || '');
      const sobras = ['Resultado automático', 'Falta calificar', 'no cuenta para esta nota', 'Vida real']
        .filter(t => enTxt.indexOf(t) >= 0);
      ok(sobras.length === 0, 'con 🌐 EN el panel queda entero en inglés', sobras);
    }

    ok(errores.length === 0, 'sin errores de JavaScript', errores.slice(0, 2));

    await ctx.close();
  }

  await nav.close();
  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ las siete misiones registran solo lo que califica la máquina'));
  process.exit(fallos ? 1 : 0);
})();
