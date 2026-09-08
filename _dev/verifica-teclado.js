/* ============================================================
   M.E.T.A.S · Se puede usar sin el dedo, y con la vista cansada
   ------------------------------------------------------------
   Dos cosas que se midieron antes de tocar nada:

   · **El zoom estaba bloqueado** (`user-scalable=no`) en 21 páginas:
     la portada, mision.html, camp-vivo.html y los 18 juegos 3D.
     Android Chrome lo respeta, así que un maestro présbita y un
     alumno con baja visión no tenían salida ninguna.

   · **2 314 elementos que responden al clic y a los que el teclado
     no llegaba**, en las 74 misiones. Clasifica, Identifica,
     Empareja, el memorama, las analogías. Un alumno con discapacidad
     motora podía leer la teoría entera y no hacer una actividad.

   ⚠️ Y el patrón que ya estaba en 18 misiones NO servía: role="button"
   y tabindex="0" en un <div> se enfocan, se ven enfocados y al pulsar
   Enter **no hacen nada**. Copiarlo a las demás habría repartido
   1 141 paradas de tabulador que no llevan a ninguna parte.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-teclado.js
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

/* Los HTML del sitio, contados y no escritos: www/ y android/ fuera,
   que son la copia de Capacitor y van desfasadas a propósito. */
function htmls() {
  const out = [];
  (function anda(d) {
    for (const f of fs.readdirSync(d)) {
      if (f === 'www' || f === 'android' || f === 'node_modules' || f === '.git' || f === '_dev') continue;
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) anda(p);
      else if (f.endsWith('.html')) out.push(p);
    }
  })(RAIZ);
  return out;
}

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
  await pg.goto(`${BASE}/misiones/${rel}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pg.waitForTimeout(800);
  return { ctx, pg, errores };
}

(async () => {
  console.log('\n════════ SE PUEDE USAR SIN EL DEDO Y CON LA VISTA CANSADA ════════\n');

  /* ── 1 · El zoom, en TODO el sitio ───────────────────────────
     Se lee del archivo: son 190 páginas y abrirlas costaría veinte
     minutos para mirar una etiqueta que está en el HTML. */
  console.log('── el zoom no está bloqueado en ninguna página ──');
  const todos = htmls();
  const bloqueadas = todos.filter(p => {
    /* ⚠️ Los comentarios se quitan antes de mirar. camp-vivo.html EXPLICA
       en un comentario por qué se le quitó el `user-scalable=no`, y la
       sonda se lo contaba como si siguiera puesto: una sonda que sale
       roja cuando todo está bien enseña a no mirarla. Es la misma trampa
       que ya cazaron verifica-legal y verifica-barra-secciones. */
    const s = fs.readFileSync(p, 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    return /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(s);
  }).map(p => path.relative(RAIZ, p));
  ok(`ninguna de las ${todos.length} páginas prohíbe agrandar`, !bloqueadas.length, bloqueadas.slice(0, 6));

  /* ── 2 · Las dos piezas compartidas, en TODAS las misiones ─── */
  const MIS = misiones();
  console.log(`\n── las dos piezas, en las ${MIS.length} misiones ──`);
  const sinCss = MIS.filter(m => !m.s.includes('css/teclado-actividades.css')).map(m => m.dir);
  const sinJs = MIS.filter(m => !m.s.includes('js/teclado-actividades.js')).map(m => m.dir);
  ok('todas cargan el CSS del foco visible', !sinCss.length, sinCss.slice(0, 5));
  ok('todas cargan el motor de teclado', !sinJs.length, sinJs.slice(0, 5));

  const nav = await abrir({ args: ['--no-sandbox'] });

  /* ── 3 · Una actividad entera, sin tocar la pantalla ─────────
     Es la prueba de verdad: no que el tabulador llegue, sino que el
     alumno pueda TERMINAR lo que la misión le pide. */
  console.log('\n── clasificar una ficha sin tocar la pantalla ──');
  {
    const { ctx, pg, errores } = await abrirMision(nav, '1ciclo-segundo-grado/numeros-hasta-999.html');
    await pg.evaluate(() => go('s-clasifica'));
    await pg.waitForTimeout(700);

    const antes = await pg.evaluate(() => ({
      banco: document.querySelectorAll('#clsBank .wb-item').length,
      columnas: document.querySelectorAll('#items-left .drop-item, #items-right .drop-item').length,
    }));
    ok('hay fichas que clasificar', antes.banco > 0, antes);

    /* Se tabula DE VERDAD, no se llama a focus(): así se ve si el
       tabulador llega, que es la mitad del problema. */
    let saltos = 0, llego = false;
    for (; saltos < 60 && !llego; saltos++) {
      await pg.keyboard.press('Tab');
      llego = await pg.evaluate(() => {
        const a = document.activeElement;
        return !!(a && a.closest && a.closest('#clsBank .wb-item'));
      });
    }
    ok('el tabulador llega hasta una ficha', llego, { saltos });

    await pg.keyboard.press('Enter');
    await pg.waitForTimeout(250);
    ok('Enter la selecciona, como el clic',
      await pg.evaluate(() => !!document.querySelector('#clsBank .wb-item.wb-sel')));

    /* Y la barra espaciadora, en la columna: es la que además desliza
       la página si no se para, y el alumno pierde de vista lo suyo. */
    const scroll0 = await pg.evaluate(() => window.scrollY);
    await pg.evaluate(() => {
      const c = document.querySelector('#items-left');
      (c.closest('.drop-col') || c).focus();
    });
    await pg.keyboard.press('Space');
    await pg.waitForTimeout(350);
    const despues = await pg.evaluate(() => ({
      banco: document.querySelectorAll('#clsBank .wb-item').length,
      columnas: document.querySelectorAll('#items-left .drop-item, #items-right .drop-item').length,
      scroll: window.scrollY,
    }));
    ok('la barra espaciadora la deja en su columna',
      despues.columnas === antes.columnas + 1 && despues.banco === antes.banco - 1,
      { antes, despues });
    ok('y NO desliza la página por debajo', despues.scroll === scroll0, { antes: scroll0, ahora: despues.scroll });

    /* ⚠️ El anillo se mide DESPUÉS de la transición: las fichas llevan
       `transition: all .2s`, así que preguntar en el instante de
       enfocar devuelve el valor viejo. Me costó dos falsas alarmas. */
    await pg.evaluate(() => { const a = document.querySelector('.ta-tecla'); if (a) a.focus(); });
    await pg.keyboard.press('Tab');
    await pg.waitForTimeout(400);
    const anillo = await pg.evaluate(() => {
      const a = document.activeElement;
      if (!a || !a.classList.contains('ta-tecla')) return null;
      const cs = getComputedStyle(a);
      const pintado = s => s && s !== 'none' && !/^(rgba\(0, 0, 0, 0\)[^,]*)(, rgba\(0, 0, 0, 0\)[^,]*)*$/.test(s);
      return { sombra: cs.boxShadow, contorno: cs.outlineStyle + ' ' + cs.outlineWidth,
               seVe: pintado(cs.boxShadow) || (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) };
    });
    ok('y se VE dónde está el foco', anillo && anillo.seVe, anillo);

    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  /* ── 3-bis · Lo que NO existe hasta que el alumno toca «Empezar» ──
     Es lo que de verdad prueba el vigilante del árbol: las fichas del
     memorama se crean al arrancar el juego, no al abrir la sección. */
  console.log('\n── el memorama se juega con el teclado ──');
  {
    const { ctx, pg } = await abrirMision(nav, '2y3ciclo-eras-geologicas/eras_geologicas.html');
    await pg.evaluate(() => go('s-memoria'));
    await pg.waitForTimeout(600);
    await pg.evaluate(() => {
      const b = [...document.querySelectorAll('.sec.active button')].find(x => /empez|iniciar|jugar|barajar/i.test(x.textContent));
      if (b) b.click();
    });
    await pg.waitForTimeout(700);
    const f = await pg.evaluate(() => ({
      fichas: document.querySelectorAll('.sec.active .memo-card').length,
      marcadas: document.querySelectorAll('.sec.active .memo-card.ta-tecla').length,
    }));
    ok('las 16 fichas quedan alcanzables aunque se creen al arrancar',
      f.fichas > 0 && f.marcadas === f.fichas, f);

    const volteadas = () => pg.evaluate(() =>
      document.querySelectorAll('.sec.active .memo-card.flip, .sec.active .memo-card.flipped, .sec.active .memo-card.abierta').length);
    const antes = await volteadas();
    await pg.evaluate(() => { const c = document.querySelector('.sec.active .memo-card.ta-tecla'); if (c) c.focus(); });
    await pg.keyboard.press('Enter');
    await pg.waitForTimeout(400);
    ok('y Enter voltea una', (await volteadas()) === antes + 1, { antes, ahora: await volteadas() });
    await ctx.close();
  }

  /* ── 4 · Una cuadrícula no se vuelve una trampa ──────────────
     La sopa trae 144 celdas. Tabular 144 veces para cruzar una
     actividad no es accesibilidad. */
  console.log('\n── la sopa de letras NO son 144 paradas de tabulador ──');
  {
    const { ctx, pg } = await abrirMision(nav, 'docente-bienvenida-metas/bienvenida-metas.html');
    await pg.waitForTimeout(600);
    /* Se abre la sección como la abre el alumno. El motor marca SOLO la
       sección abierta —es la única que se ve y la única que se puede
       tabular—, así que forzar todas activas mide otra cosa. */
    await pg.evaluate(() => go('s-sopa'));
    await pg.waitForTimeout(700);
    const r = await pg.evaluate(() => ({
      celdas: document.querySelectorAll('.sopa-c, .sopa-cell').length,
      celdasTabulables: document.querySelectorAll('.sopa-c.ta-tecla, .sopa-cell.ta-tecla').length,
      marcadosEnLaSeccion: document.querySelectorAll('.sec.active .ta-tecla').length,
      marcadosEnTotal: document.querySelectorAll('.ta-tecla').length,
    }));
    ok('la sopa tiene celdas', r.celdas > 40, r);
    ok('y NINGUNA es parada de tabulador', r.celdasTabulables === 0, r);
    ok('pero el resto de la misión sí se puede tabular', r.marcadosEnTotal > 0, r);
    await ctx.close();
  }

  /* ── 5 · Y en las demás actividades ──────────────────────────
     Tres misiones a propósito distintas, para lo que se multiplica. */
  console.log('\n── las actividades quedan alcanzables en más misiones ──');
  for (const rel of ['2y3ciclo-eras-geologicas/eras_geologicas.html',
                     '2y3ciclo-fracciones/fracciones.html',
                     '2ciclo-angulos-basicos/angulos-basicos.html']) {
    const { ctx, pg, errores } = await abrirMision(nav, rel);
    /* Se recorre sección por sección, con go(), que es como lo hace el
       alumno: el motor marca solo la que está abierta. */
    const secciones = await pg.evaluate(() =>
      [...document.querySelectorAll('nav.nav .nav-t')].map(b => b.dataset.s).filter(Boolean));
    let esperados = 0, marcados = 0, enRacimo = 0, flojas = [];
    for (const sec of secciones) {
      await pg.evaluate(id => go(id), sec);
      await pg.waitForTimeout(260);
      const c = await pg.evaluate(() => {
        const raiz = document.querySelector('.sec.active');
        if (!raiz) return { esperados: 0, marcados: 0, enRacimo: 0 };
        const NATIVOS = 'a[href],button,input,select,textarea,summary';
        const clicables = [...raiz.querySelectorAll('*')].filter(e => e.onclick || e.hasAttribute('onclick'));
        const sueltos = clicables.filter(e => !e.matches(NATIVOS) && !e.querySelector(NATIVOS + ',[tabindex]:not([tabindex="-1"])'));
        const grupos = {};
        sueltos.forEach(e => {
          const p = e.parentElement;
          const k = (p ? (p.id || String(p.className)) : '') + '|' + String(e.className);
          (grupos[k] = grupos[k] || []).push(e);
        });
        let esp = 0, rac = 0;
        for (const v of Object.values(grupos)) { if (v.length > 40) rac += v.length; else esp += v.length; }
        return { esperados: esp, marcados: sueltos.filter(e => e.classList.contains('ta-tecla')).length, enRacimo: rac };
      });
      esperados += c.esperados; marcados += c.marcados; enRacimo += c.enRacimo;
      if (c.marcados < c.esperados) flojas.push(sec + ' ' + c.marcados + '/' + c.esperados);
    }
    const r = { esperados, marcados, enRacimo, flojas: flojas.slice(0, 4) };
    ok(`${rel.split('/')[0]}: los controles sueltos quedan alcanzables`,
      r.esperados > 0 && r.marcados >= r.esperados, r);
    ok('  y sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + '─'.repeat(56));
  if (fallos) { console.log(`✖ ${fallos} problema(s): todavía hay quien no puede usar la aplicación.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: se puede agrandar, y las actividades se hacen sin el dedo.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
