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

  /* ── 2-bis · Toda sopa tiene con qué rematar la palabra ──────
     Se lee del archivo, que es lo que se multiplica al copiar una
     misión: abrir las 73 con Playwright cuesta siete minutos y una
     comprobación así no la corre nadie.

     El teclado de la sopa remata de dos formas y le basta una: la
     celda responde al clic (las 8 del maestro) o la misión deja a
     mano getSopaPath + checkSopaSelection (las 65 del alumno). Una
     sopa nueva sin ninguna de las dos NO recibe parada de tabulador
     —es la lección de centena.js: prometer y no cumplir es peor—,
     así que se avisa aquí y no en el teléfono de un niño. */
  {
    const conSopa = [], sinRemate = [];
    for (const m of MIS) {
      const dirJs = path.join(RAIZ, 'misiones', m.dir, 'js');
      const js = fs.existsSync(dirJs)
        ? fs.readdirSync(dirJs).filter(f => f.endsWith('.js'))
            .map(f => fs.readFileSync(path.join(dirJs, f), 'utf8')).join('\n')
        : '';
      const todo = m.s + '\n' + js;
      if (!/sopaGrid/.test(todo)) continue;
      conSopa.push(m.dir);
      const clic = /class="sopa-c[ "]/.test(todo) && /onclick="sopaToca/.test(todo);
      const ruta = /function getSopaPath/.test(todo) && /function checkSopaSelection/.test(todo);
      if (!clic && !ruta) sinRemate.push(m.dir);
    }
    console.log(`\n── las ${conSopa.length} sopas tienen con qué rematar la palabra ──`);
    ok('hay sopas que comprobar', conSopa.length > 40, { conSopa: conSopa.length });
    ok('ninguna se quedaría sin teclado', !sinRemate.length, sinRemate.slice(0, 6));
  }

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

  /* ── 4 · La sopa: UNA parada, y se puede jugar ───────────────
     La sopa trae 144 celdas. Tabular 144 veces para cruzar una
     actividad no es accesibilidad, es una trampa —y esa mitad ya
     estaba—. La otra mitad faltaba: que el alumno que no puede
     arrastrar **encuentre una palabra**. Se comprueban las dos
     variantes, que no juegan igual por dentro: la del alumno arma la
     palabra con getSopaPath/checkSopaSelection y la del maestro con
     un onclick por celda.

     ⚠️ La sección se busca por dónde vive la cuadrícula, no por su
     nombre: las 65 del alumno la llaman `s-sopa` y las 8 del maestro
     `sec-sopa`. Escrito a mano, `go('s-sopa')` en una del maestro no
     abre nada —y como `go` apaga todas las secciones, deja la página
     en blanco y la comprobación pasa igual, midiendo otra cosa. */
  console.log('\n── la sopa de letras se juega sin el dedo, y sigue siendo UNA parada ──');
  for (const [quien, rel] of [['alumno', '2ciclo-angulos-basicos/angulos-basicos.html'],
                              ['maestro', 'docente-bienvenida-metas/bienvenida-metas.html']]) {
    const { ctx, pg, errores } = await abrirMision(nav, rel);
    await pg.waitForTimeout(600);
    const secId = await pg.evaluate(() => {
      const g = document.getElementById('sopaGrid');
      const s = g && g.closest('.sec');
      return s ? s.id : null;
    });
    ok(quien + ': la sopa vive en una sección', !!secId, { secId });
    if (!secId) { await ctx.close(); continue; }
    await pg.evaluate(id => go(id), secId);
    await pg.waitForTimeout(700);

    const r = await pg.evaluate(() => ({
      celdas: document.querySelectorAll('#sopaGrid .sopa-c, #sopaGrid .sopa-cell').length,
      conTaTecla: document.querySelectorAll('#sopaGrid .ta-tecla').length,
      paradas: document.querySelectorAll('#sopaGrid [tabindex]:not([tabindex="-1"])').length,
      resto: document.querySelectorAll('.sec.active .ta-tecla').length,
      ayuda: !!document.getElementById('sopa-ayuda-teclas'),
      ayudaEscondida: !!document.getElementById('sopa-ayuda-teclas') &&
        getComputedStyle(document.getElementById('sopa-ayuda-teclas')).display === 'none',
    }));
    ok(quien + ': la sopa tiene celdas', r.celdas > 40, r);
    ok(quien + ': ninguna celda entra en el marcado general', r.conTaTecla === 0, r);
    ok(quien + ': la ayuda de teclas está, y escondida sin foco', r.ayuda && r.ayudaEscondida, r);

    /* Se cruza la página con el TABULADOR de verdad, no llamando a
       focus(): lo que se cuenta es cuántas veces se para dentro de la
       cuadrícula. Tiene que ser UNA. */
    /* ⚠️ Se apunta desde DENTRO de la página, con un oyente, y se
       pregunta cada veinte tabulaciones. Preguntando después de cada
       una son 440 idas y vueltas al navegador por misión y la sonda
       pasa de segundos a minutos —y una sonda lenta es una sonda que
       nadie corre, que es como dos de esta casa se quedaron rojas
       meses—. */
    await pg.evaluate(() => {
      if (document.activeElement) document.activeElement.blur();
      window.__sk = { dentro: 0, entro: false, salio: false };
      document.addEventListener('focusin', function (e) {
        var g = document.getElementById('sopaGrid');
        if (g && g.contains(e.target)) { window.__sk.dentro++; window.__sk.entro = true; }
        else if (window.__sk.entro) window.__sk.salio = true;
      });
    });
    let paso = null;
    for (let i = 0; i < 240; i++) {
      await pg.keyboard.press('Tab');
      if (i % 20 === 19) {
        paso = await pg.evaluate(() => window.__sk);
        if (paso.salio) break;
      }
    }
    paso = await pg.evaluate(() => window.__sk);
    ok(quien + ': se entra con el tabulador y cuesta UNA parada, no ' + r.celdas,
      paso.entro && paso.dentro === 1, paso);

    /* La cuenta de arriba sigue tabulando hasta salir por el otro
       lado, así que ahora hay que volver a entrar —también con el
       tabulador— para jugar. */
    await pg.evaluate(() => { if (document.activeElement) document.activeElement.blur(); window.__sk.dentro = 0; window.__sk.entro = false; window.__sk.salio = false; });
    for (let i = 0; i < 240; i++) {
      await pg.keyboard.press('Tab');
      if (i % 10 === 9 && (await pg.evaluate(() => window.__sk.entro))) break;
    }
    await pg.evaluate(() => {
      /* Se para en la celda: si el tabulador siguió más allá dentro de
         la tanda de diez, se vuelve a ella. */
      var c = document.querySelector('#sopaGrid [tabindex="0"]');
      var g = document.getElementById('sopaGrid');
      if (c && (!document.activeElement || !g.contains(document.activeElement))) c.focus();
    });

    ok(quien + ': la ayuda se ve con el foco dentro',
      await pg.evaluate(() => getComputedStyle(document.getElementById('sopa-ayuda-teclas')).display !== 'none'));

    /* La palabra se saca del propio juego, no se escribe: cada misión
       trae la suya y el catálogo cambia. */
    const pal = await pg.evaluate(() => {
      if (typeof sopaSets !== 'undefined') {
        const w = sopaSets[currentSopaSetIdx].words[0];
        return { w: w.w, ini: w.cells[0], fin: w.cells[w.cells.length - 1] };
      }
      const p = SOPA_PAL[0], c = _sopaUbic[p];
      return { w: p, ini: c[0], fin: c[c.length - 1] };
    });

    const donde = () => pg.evaluate(() => {
      const el = document.querySelector('#sopaGrid [tabindex="0"]');
      if (!el) return null;
      if (el.dataset.row !== undefined) return [+el.dataset.row, +el.dataset.col];
      const m = /^sc(\d+)-(\d+)$/.exec(el.id || '');
      return m ? [+m[1], +m[2]] : null;
    });
    async function irA(f, c) {
      for (let i = 0; i < 60; i++) {
        const k = await donde();
        if (!k) return false;
        if (k[0] === f && k[1] === c) return true;
        await pg.keyboard.press(k[0] < f ? 'ArrowDown' : k[0] > f ? 'ArrowUp' : k[1] < c ? 'ArrowRight' : 'ArrowLeft');
        await pg.waitForTimeout(20);
      }
      return false;
    }

    /* Regla 2: la flecha la consume la sopa. Sin esto, además de mover
       el cursor desliza la página y el alumno pierde de vista lo que
       estaba mirando —lo mismo que ya se arregló con la barra
       espaciadora—. */
    await pg.evaluate(() => {
      window.__consumida = null;
      document.addEventListener('keydown', e => { if (e.key.indexOf('Arrow') === 0) window.__consumida = e.defaultPrevented; });
    });
    await pg.keyboard.press('ArrowRight');
    await pg.waitForTimeout(60);
    ok(quien + ': la flecha mueve el cursor y NO desliza la página',
      await pg.evaluate(() => window.__consumida === true));

    ok(quien + ': las flechas llegan al principio de «' + pal.w + '»', await irA(pal.ini[0], pal.ini[1]));
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(150);
    ok(quien + ': Enter marca el principio',
      await pg.evaluate(() => !!document.querySelector('#sopaGrid .sopa-start, #sopaGrid .sopa-c.sel')));

    /* Soltar tiene que soltarlo también en la misión: si aquí se borra
       la marca y allá se queda puesta, la palabra siguiente ya no se
       encuentra nunca. */
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
    ok(quien + ': Esc suelta el principio',
      await pg.evaluate(() => !document.querySelector('#sopaGrid .sopa-start, #sopaGrid .sopa-c.sel')));

    await pg.keyboard.press('Enter'); await pg.waitForTimeout(150);
    ok(quien + ': las flechas llegan al final', await irA(pal.fin[0], pal.fin[1]));
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(500);

    const f = await pg.evaluate(() => ({
      halladas: document.querySelectorAll('#sopaGrid .sopa-found, #sopaGrid .sopa-c.hallada').length,
      foco: (() => { const g = document.getElementById('sopaGrid'); return !!(g && g.contains(document.activeElement)); })(),
      paradas: document.querySelectorAll('#sopaGrid [tabindex]:not([tabindex="-1"])').length,
    }));
    ok(quien + ': la palabra queda encontrada sin tocar la pantalla', f.halladas >= pal.w.length, { pal: pal.w, ...f });
    /* Las dos variantes rehacen la cuadrícula entera al encontrar una
       palabra —la del maestro, en CADA toque—. Sin devolver el cursor,
       el foco se cae al <body> y el alumno se queda fuera de la sopa
       sin saber por qué. */
    ok(quien + ': el cursor sobrevive al repintado', f.foco && f.paradas === 1, f);
    ok(quien + ': y sin errores de JavaScript', errores.length === 0, errores);
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
