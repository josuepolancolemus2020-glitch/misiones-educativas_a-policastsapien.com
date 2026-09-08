/* ============================================================
   M.E.T.A.S · La estrella se gana
   ------------------------------------------------------------
   Medido abriendo las 74 misiones y SIN TOCAR NADA, antes de
   arreglarlo: **34 daban estrellas de regalo, 125 en total**, con el
   XP en 0. El alumno entraba, no tocaba nada, y ya tenía cuatro
   estrellas —Aprende, Tipos, Errores y La prueba—.

   Y por el otro lado el puntaje se inflaba: el XP se volvía a ganar
   RECARGANDO la página (`xpTracker` no se guardaba, así que las mismas
   14 tarjetas pagaban otra vez), cada toque en «Calificar» regalaba
   +8 XP, y el Reto felicitaba con «¡Bien hecho!» y su logro con **0
   de 8**.

   Un puntaje que se consigue sin aprender no motiva: enseña que el
   puntaje no significa nada. Y esa nota sale en la Constancia que el
   alumno le enseña a su familia.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-estrella-ganada.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Las misiones se cuentan, no se escriben: la 75 entra sola. */
function misiones() {
  const out = [];
  for (const d of fs.readdirSync(path.join(RAIZ, 'misiones')).sort()) {
    const dir = path.join(RAIZ, 'misiones', d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.html') || f.startsWith('juego-')) continue;
      const s = fs.readFileSync(path.join(dir, f), 'utf8');
      if (s.includes('<nav class="nav"')) { out.push({ dir: d, f, s }); break; }
    }
  }
  return out;
}

async function abrirMision(nav, rel) {
  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 }, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', num: '7', grupo: '6-1' })); } catch (e) { }
  });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message.slice(0, 90)));
  await pg.goto(`${BASE}/misiones/${encodeURI(rel)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pg.waitForTimeout(1100);
  return { ctx, pg, errores };
}

const estrellas = pg => pg.evaluate(() => ({
  e: [...document.querySelectorAll('nav.nav .nav-t.done')].map(b => b.dataset.s),
  xp: (typeof xp !== 'undefined') ? xp : null,
}));

(async () => {
  console.log('\n════════ LA ESTRELLA SE GANA ════════\n');
  const MIS = misiones();

  /* ── 1 · El aparato, en TODAS, y en el <head> ────────────────
     Va en el <head> a propósito: así registra su oyente antes que la
     misión y llega a envolver fin() ANTES de que el arranque lo
     llame. Cargado al final del body llegaría tarde y las estrellas
     ya estarían puestas — sin dar un solo error. */
  console.log(`── el aparato, en las ${MIS.length} misiones ──`);
  const sin = MIS.filter(m => !m.s.includes('js/estrella-ganada.js')).map(m => m.dir);
  ok('todas lo cargan', !sin.length, sin.slice(0, 5));
  const tarde = MIS.filter(m => m.s.indexOf('estrella-ganada.js') > m.s.indexOf('<body')).map(m => m.dir);
  ok('y todas en el <head>, no al final del body', !tarde.length, tarde.slice(0, 5));

  /* El Reto no felicita con cero, y su logro se gana. */
  const js = [];
  for (const d of fs.readdirSync(path.join(RAIZ, 'misiones')).sort()) {
    const dir = path.join(RAIZ, 'misiones', d, 'js');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.js')) js.push([d, path.join(dir, f)]);
  }
  const cuerpoReto = p => {
    const s = fs.readFileSync(p, 'utf8');
    const i = s.indexOf('function endReto(');
    if (i < 0) return null;
    const j = s.indexOf('\nfunction ', i + 10);
    return s.slice(i, j > 0 ? j : s.length);
  };
  const felicitanSiempre = js.filter(([d, p]) => {
    const c = cuerpoReto(p);
    return c && /¡Bien hecho!/.test(c) && /,\s*true\s*\)/.test(c);
  }).map(([d]) => d);
  ok('el Reto no dice «¡Bien hecho!» pase lo que pase', !felicitanSiempre.length, felicitanSiempre.slice(0, 5));

  const logroRegalado = js.filter(([d, p]) => {
    const c = cuerpoReto(p);
    if (!c || !c.includes("unlockAchievement('reto_hero')")) return false;
    /* o lo condiciona por porcentaje, o por aciertos: las dos valen */
    return !/pct>=\d+\)\s*unlockAchievement\('reto_hero'\)/.test(c) && !/retoOk>=\d+/.test(c);
  }).map(([d]) => d);
  ok('y su logro no se desbloquea con cero aciertos', !logroRegalado.length, logroRegalado.slice(0, 5));

  /* ── 2 · En la pantalla, que es donde el alumno lo ve ──────── */
  const nav = await abrir({ args: ['--no-sandbox'] });
  const REL = '2ciclo-angulos-basicos/angulos-basicos.html';

  console.log('\n── abre la misión y no toca nada ──');
  {
    const { ctx, pg, errores } = await abrirMision(nav, REL);
    const r = await estrellas(pg);
    ok('no tiene ni una estrella', r.e.length === 0, r);
    ok('y el XP está en cero', r.xp === 0, r);
    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  console.log('\n── generar una prueba no es hacerla ──');
  {
    const { ctx, pg, errores } = await abrirMision(nav, REL);
    await pg.click('[data-s="s-evaluacion"]');
    await pg.waitForTimeout(300);
    await pg.evaluate(() => genEval());
    await pg.waitForTimeout(500);
    ok('generarla NO da la estrella', !(await estrellas(pg)).e.includes('s-evaluacion'));

    await pg.evaluate(() => gradeEval());
    await pg.waitForTimeout(600);
    ok('calificarla SÍ la da', (await estrellas(pg)).e.includes('s-evaluacion'));

    /* Y no paga dos veces por lo mismo. */
    const antes = (await estrellas(pg)).xp;
    await pg.evaluate(() => gradeEval());
    await pg.waitForTimeout(600);
    ok('y calificar otra vez no vuelve a pagar', (await estrellas(pg)).xp === antes, { antes, ahora: (await estrellas(pg)).xp });
    /* ⚠️ Y la sección de tareas TIENE que seguir pudiéndose ganar: no
       tiene calificación —el alumno pide sus ejercicios y los resuelve
       en el cuaderno—, así que deshacer también su marca la dejaba
       imposible de completar para siempre. Se vio tarde. */
    await pg.click('[data-s="s-tareas"]');
    await pg.waitForTimeout(300);
    await pg.evaluate(() => genTask());
    await pg.waitForTimeout(400);
    ok('pero pedir los ejercicios SÍ gana la de tareas', (await estrellas(pg)).e.includes('s-tareas'), await estrellas(pg));

    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  console.log('\n── la sección de leer se gana LEYÉNDOLA ──');
  {
    const { ctx, pg, errores } = await abrirMision(nav, REL);
    const conCentinela = await pg.evaluate(() =>
      [...document.querySelectorAll('.sec')].filter(s => s.querySelector('.eg-fin')).map(s => s.id));
    ok('las secciones de solo leer se reconocen solas', conCentinela.length > 0, conCentinela);
    ok('y la prueba NO está entre ellas —bajar hasta el final le daría la estrella sin contestar—',
      !conCentinela.includes('s-evaluacion') && !conCentinela.includes('s-tareas'), conCentinela);

    await pg.click('[data-s="s-aprende"]');
    await pg.waitForTimeout(400);
    ok('abrirla y no bajar no la gana', !(await estrellas(pg)).e.includes('s-aprende'));

    /* Asomarse al final y salir tampoco: si no, se recogen estrellas
       pasando las pestañas con el dedo. */
    await pg.evaluate(() => document.querySelector('#s-aprende .eg-fin').scrollIntoView());
    await pg.waitForTimeout(700);
    await pg.click('[data-s="s-tipos"]');
    await pg.waitForTimeout(400);
    ok('asomarse al final y salir, tampoco', !(await estrellas(pg)).e.includes('s-aprende'));

    await pg.click('[data-s="s-aprende"]');
    await pg.waitForTimeout(300);
    await pg.evaluate(() => document.querySelector('#s-aprende .eg-fin').scrollIntoView());
    await pg.waitForTimeout(3600);
    ok('llegar al final y quedarse, SÍ', (await estrellas(pg)).e.includes('s-aprende'));
    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  console.log('\n── el XP no se vuelve a ganar recargando ──');
  {
    const { ctx, pg, errores } = await abrirMision(nav, REL);
    await pg.click('[data-s="s-flash"]');
    await pg.waitForTimeout(400);
    const voltear = async n => {
      for (let i = 0; i < n; i++) {
        await pg.evaluate(() => flipCard()); await pg.waitForTimeout(80);
        await pg.evaluate(() => nextFC()); await pg.waitForTimeout(80);
      }
    };
    await voltear(6);
    const gano = (await estrellas(pg)).xp;
    ok('voltear seis tarjetas paga', gano > 0, { xp: gano });

    /* Y una estrella ya ganada tiene que SOBREVIVIR a la recarga: el
       envoltorio no puede quitarle al alumno lo de ayer. */
    await pg.evaluate(() => gradeEval());
    await pg.waitForTimeout(400);
    await pg.reload({ waitUntil: 'domcontentloaded' });
    await pg.waitForTimeout(1200);
    ok('la estrella ganada sobrevive a recargar', (await estrellas(pg)).e.includes('s-evaluacion'), await estrellas(pg));

    await pg.click('[data-s="s-flash"]');
    await pg.waitForTimeout(400);
    await voltear(6);
    ok('pero las mismas tarjetas NO vuelven a pagar', (await estrellas(pg)).xp === gano,
      { antes: gano, ahora: (await estrellas(pg)).xp });
    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + '─'.repeat(48));
  if (fallos) { console.log(`✖ ${fallos} problema(s): el puntaje sigue sin significar nada.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la estrella y el XP se ganan.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
