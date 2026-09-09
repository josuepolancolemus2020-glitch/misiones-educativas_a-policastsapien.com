/* ═══════════════════════════════════════════════════════════════
   🔠 EL TAMAÑO DE LETRA DE LA APLICACIÓN DEL MAESTRO

   Medido antes de tocar nada, con el aula de 43 alumnos sembrada y un
   teléfono de 390 px: de los **281 textos que el maestro tiene
   delante, 171 estaban por debajo de 14 px** y 41 por debajo de 12; el
   más pequeño, 9. Un maestro présbita no puede pasar lista así.

   Aquí se comprueba lo que hace que el arreglo sirva y no estropee
   nada:

   · QUE A 1 PINTE LO DE SIEMPRE. Son 630 declaraciones convertidas: si
     una sola cambia de tamaño hoy, el arreglo le rompió la pantalla a
     quien no pidió nada.
   · QUE LA VARIABLE ALCANCE A TODO. Se mide cada texto a 1 y a 1,3 y
     tiene que haber crecido **exactamente** lo mismo. Es la
     comprobación que cazó los dos rótulos de los logos, que traían el
     tamaño en el atributo `style` y se quedaban chicos mientras el
     resto crecía.
   · QUE NADA SE SALGA NI SE RECORTE en los pasos que se ofrecen, en
     las ocho pestañas de Mi aula y con el teléfono más estrecho.
   · QUE EL ARRASTRE DE LA BARRA DE GRUPOS SIGA FUNCIONANDO con la
     letra grande. Es la razón por la que se descartó `zoom`: desalinea
     las coordenadas del puntero. Si un día alguien vuelve a intentarlo,
     esta es la que lo caza.
   · QUE EL PAPEL NO CREZCA. 42 alumnos tienen que seguir dando 42
     páginas; una hoja de más son 43 hojas de más en el fotocopiado.
   · QUE NO SE LE CUELE EN LOS DATOS DEL MAESTRO. `METAS_ADMIN_V1`
     viaja a la nube y se fusiona con el otro equipo: una preferencia
     de vista no entra ahí.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-letra-maestro.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';

let fallos = 0;
const ok = (n, c, extra) => {
  console.log((c ? '  ✔ ' : '  ✘ ') + n + (c || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!c) fallos++;
};

/* Los comentarios se quitan antes de buscar: este proyecto explica sus
   reglas escribiendo justo el texto que prohíbe, y ya ha mordido cuatro
   veces a cuatro sondas distintas. */
const sinComentarios = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');

const ALUMNOS = Array.from({ length: 43 }, (_, i) => ({
  num: i + 1, nombre: 'Alumno Apellido ' + (i + 1), sexo: i % 2 ? 'F' : 'M',
}));
const TABS = ['lista', 'eco', 'asis', 'ctrl', 'sace', 'est', 'lec', 'com'];
/* Los grupos de la barra, para el arrastre con la letra grande. */
const GRUPOS = [['6', '1'], ['2', '2'], ['3', '1'], ['5', '1'], ['1', '2'], ['4', '1']];

(async () => {
  console.log('\n════════ EL TAMAÑO DE LETRA DEL MAESTRO ════════\n');

  /* ── 1 · Del archivo: la regla que se multiplica al escribir CSS ── */
  console.log('── la hoja entera pasa por la variable ──');
  const css = fs.readFileSync(path.join(RAIZ, 'css/app.css'), 'utf8');
  const cssLimpio = sinComentarios(css);
  const todas = cssLimpio.match(/font-size:[^;}]*/g) || [];
  const sueltas = todas.filter(d => !/var\(--metas-fz/.test(d) && !/inherit/.test(d));
  /* ⚠️ La excepción está nombrada aquí, con su motivo, y son DOS: la marca
     de la portada (`.brand-logo` y `.brand-sub`). No escalan porque el
     encabezado mide el sitio que deja —si crece con la letra se muerde la
     cola: medido, a 1,45 sacaba los botones 14 px fuera del teléfono y
     subía el encabezado de 82 a 123 px— y porque son 26 y 8,5 px
     decorativos que nadie lee para trabajar. Una lista escrita a mano
     envejece, así que se cuenta: si aparece una tercera sin explicación,
     esto se pone rojo. */
  const EXCEPCIONES = 2;
  ok(`de las ${todas.length} declaraciones de font-size solo quedan fuera las ${EXCEPCIONES} de la marca`,
    sueltas.length === EXCEPCIONES, sueltas.slice(0, 6));
  ok('la variable está declarada en :root', /--metas-fz:\s*1\s*;/.test(cssLimpio));
  /* El seguro del papel: los informes salen de una ventana aparte que no
     hereda la variable, pero el día que alguien imprima la aplicación
     misma, el ajuste del maestro le movería el papel sin avisar. */
  ok('y el papel la fuerza a 1 (@media print)',
    /@media\s+print\s*\{[^}]*:root\s*\{[^}]*--metas-fz:\s*1/.test(cssLimpio.replace(/\s+/g, ' ')));

  console.log('\n── el aparato, y en el sitio donde funciona ──');
  const idx = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  ok('index.html lo carga', idx.includes('js/letra-maestro.js'));
  /* Regla 4: en el <head>. Al final del body llegaría después del primer
     pintado y el maestro vería el salto. */
  const cabeza = idx.slice(0, idx.indexOf('</head>'));
  ok('y lo carga en el <head>, antes del primer pintado', cabeza.includes('js/letra-maestro.js'));
  const sw = sinComentarios(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8'));
  ok('va en el armazón del service worker (abre sin señal)', sw.includes("'./js/letra-maestro.js'"));

  const nav = await abrir({ args: ['--no-sandbox'] });
  const pg = await nav.newPage({ ...SIN_SW, viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true });
  const errores = [];
  pg.on('pageerror', e => errores.push(String(e.message).slice(0, 90)));
  await pg.route('**/rest/v1/rpc/**', r => r.abort('failed'));

  const sembrar = async grupos => pg.evaluate(([gr, al]) => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G0', grupos: gr.map(([g, s], i) => ({
      id: 'G' + i, grado: g, seccion: s, escuela: 'JOHN ARNOLD COOK', materias: ['Español', 'Matemáticas'],
      lista: i === 0 ? al : [], colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [],
    })) }));
  }, [grupos, ALUMNOS]);
  const aula = () => pg.evaluate(() => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    renderAdmin();
  });
  const escala = e => pg.evaluate(v => {
    if (v === null) document.documentElement.style.removeProperty('--metas-fz');
    else document.documentElement.style.setProperty('--metas-fz', v);
  }, e);
  const leerFz = () => pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--metas-fz').trim());

  await pg.goto(BASE + '/index.html', { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function');
  await sembrar(GRUPOS);
  await aula();
  await pg.waitForTimeout(450);

  /* ── 2 · El botón: que esté, que se vea y que se pueda tocar ── */
  console.log('\n── el botón Aa ──');
  const nBtn = await pg.evaluate(() => document.querySelectorAll('.lm-btn').length);
  const nHdr = await pg.evaluate(() => document.querySelectorAll('.app-header.compact').length);
  ok(`está en los ${nHdr} encabezados del maestro, no solo en uno`, nBtn === nHdr, { nBtn, nHdr });
  /* Y NO en el de la portada: ahí los botones ya acaban en el píxel 361 de
     un teléfono de 360, así que uno más deja la medalla fuera y Actualizar
     sin poder tocarse. Se comprueba que no se cuele. */
  ok('y no se cuela en el de la portada, donde no cabe',
    await pg.evaluate(() => !document.querySelector('.app-header:not(.compact) .lm-btn')));
  ok('arranca en lo de siempre', (await leerFz()) === '1', await leerFz());
  const caja = await pg.evaluate(() => {
    const b = document.querySelector('#view-admin .lm-btn');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const en = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { w: Math.round(r.width), h: Math.round(r.height),
             tapa: (en === b || b.contains(en)) ? '' : (en ? en.tagName + '.' + String(en.className).slice(0, 30) : 'nada') };
  });
  /* 44 px es lo que un dedo acierta sin mirar, la regla de siempre.
     Sus vecinos miden 38 y se quedan como están: hacerlo igual de
     pequeño habría sido copiar el problema. */
  ok('mide 44 px de blanco de toque', caja && caja.w >= 44 && caja.h >= 44, caja);
  ok('y no hay nada encima', caja && !caja.tapa, caja);

  /* ── 3 · Los pasos: que agranden, que topen y que vuelvan ── */
  console.log('\n── los pasos ──');
  const menor = () => pg.evaluate(() => {
    const els = [...document.querySelectorAll('#ad-tab-body *')]
      .filter(e => e.getClientRects().length && (e.textContent || '').trim() && !e.children.length);
    return Math.min(...els.map(e => parseFloat(getComputedStyle(e).fontSize)));
  });
  const chicoAntes = await menor();

  /* Primer toque: sube, se ve puesto y DICE en qué paso quedó. Un botón
     que cambia la pantalla sin decir qué hizo se toca una vez y no se
     vuelve a tocar; se dice con el avisador que ya tiene la aplicación,
     no con uno nuevo. */
  await pg.click('#view-admin .lm-btn');
  await pg.waitForTimeout(300);
  const primero = await pg.evaluate(() => {
    const b = document.querySelector('#view-admin .lm-btn');
    const t = document.getElementById('meta-toast');
    return { fz: getComputedStyle(document.documentElement).getPropertyValue('--metas-fz').trim(),
             paso: b.dataset.paso, fondo: getComputedStyle(b).backgroundColor,
             aviso: t && t.getClientRects().length ? t.textContent : '' };
  });
  ok('un toque agranda', parseFloat(primero.fz) > 1, primero);
  ok('dice en qué paso quedó', /Letra:\s*\S/.test(primero.aviso), primero);
  ok('y el botón se ve puesto', primero.paso !== '0' && primero.fondo !== 'rgba(0, 0, 0, 0)', primero);

  /* La vuelta entera: quedan tres toques para volver a lo de siempre. */
  const pasos = [primero.fz];
  for (let i = 1; i < 4; i++) {
    await pg.click('#view-admin .lm-btn');
    await pg.waitForTimeout(200);
    pasos.push(await leerFz());
  }
  ok('cada toque sube un paso y el último vuelve a lo de siempre',
    pasos.length === 4 && pasos[3] === '1' && pasos.every((v, i) => i === 3 || parseFloat(v) > 1), pasos);

  /* Y se vuelve al tope, que es donde hay que medir lo que de verdad
     importa: cuánto sube el texto más pequeño que el maestro tiene
     delante. */
  for (let i = 0; i < 3; i++) { await pg.click('#view-admin .lm-btn'); await pg.waitForTimeout(140); }
  const tope = parseFloat(await leerFz());
  const chicoDesp = await menor();
  ok(`el texto más pequeño de Mi aula sube de ${chicoAntes} a ${chicoDesp} px`,
    chicoDesp >= 14 && chicoDesp > chicoAntes * 1.35, { chicoAntes, chicoDesp, tope });

  /* ── 4 · Que la variable alcance a TODO ─────────────────────────
     Esta es la que cazó los dos rótulos de los logos: traían el tamaño
     en el atributo `style` y se quedaban chicos mientras el resto
     crecía. Un rótulo de 11 px rodeado de texto de 17 se lee PEOR que
     antes, porque ya no tiene con qué compararse. */
  console.log('\n── la variable alcanza a todo lo que se pinta ──');
  const PRUEBA = 1.3;
  let quietos = [], medidos = 0;
  for (const t of TABS) {
    const hay = await pg.evaluate(tab => {
      const b = document.querySelector('[data-adtab="' + tab + '"]');
      if (!b) return false; b.click(); return true;
    }, t);
    if (!hay) { ok('la pestaña ' + t + ' existe', false); continue; }
    await pg.waitForTimeout(300);
    const leer = () => pg.evaluate(() => {
      const raiz = document.querySelector('.view.active');
      const ruta = el => { const p = []; for (let n = el; n && n !== raiz; n = n.parentElement) {
        const i = n.parentElement ? [...n.parentElement.children].indexOf(n) : 0; p.unshift(n.tagName + i); } return p.join('>'); };
      const o = {};
      raiz.querySelectorAll('*').forEach(el => {
        if (!el.getClientRects().length || el.children.length) return;
        if (!(el.textContent || '').trim()) return;
        o[ruta(el)] = { fz: parseFloat(getComputedStyle(el).fontSize),
                        q: (el.tagName + '.' + String(el.className).slice(0, 24) + ' “' + el.textContent.trim().slice(0, 20) + '”') };
      });
      return o;
    });
    await escala(null); await pg.waitForTimeout(140);
    const a = await leer();
    await escala(PRUEBA); await pg.waitForTimeout(180);
    const b = await leer();
    for (const k of Object.keys(a)) {
      if (!(k in b)) continue;
      medidos++;
      if (Math.abs(b[k].fz - a[k].fz * PRUEBA) > 0.6) quietos.push(t + ': ' + a[k].q + ' ' + a[k].fz + '→' + b[k].fz);
    }
  }
  ok(`los ${medidos} textos de las ocho pestañas crecen todos lo mismo`, !quietos.length, quietos.slice(0, 6));

  /* ── 5 · Que nada se salga ni se recorte en los pasos que se ofrecen ── */
  console.log('\n── con la letra grande no se sale ni se recorta nada ──');
  const mirar = () => pg.evaluate(() => {
    const raiz = document.querySelector('.view.active');
    const W = window.innerWidth;
    const fuera = [], recorta = [], altos = [];
    raiz.querySelectorAll('*').forEach(el => {
      if (!el.getClientRects().length) return;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') return;
      const r = el.getBoundingClientRect();
      const nom = el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.');
      if (r.width > 0 && r.right > W + 1) fuera.push({ nom, right: Math.round(r.right) });
      const hx = cs.overflowX === 'hidden' || cs.overflow === 'hidden';
      const hy = cs.overflowY === 'hidden' || cs.overflow === 'hidden';
      if (hx && el.scrollWidth > el.clientWidth + 1) recorta.push({ nom, sw: el.scrollWidth, cw: el.clientWidth });
      if (hy && el.scrollHeight > el.clientHeight + 1 && el.children.length < 40) altos.push({ nom, sh: el.scrollHeight, ch: el.clientHeight });
    });
    return { doc: document.documentElement.scrollWidth, fuera, recorta, altos };
  });
  /* Los pasos que ofrece el botón, leídos del propio aparato: si mañana
     entra uno más, esto lo mide sin que nadie toque la sonda. */
  const PASOS = await pg.evaluate(async () => {
    const t = await (await fetch('js/letra-maestro.js')).text();
    const m = t.match(/var PASOS = \[([0-9,\s]+)\]/);
    return m ? m[1].split(',').map(s => parseFloat(s.trim()) / 100) : [1];
  });
  ok('los pasos se leen del aparato, no se escriben aquí', PASOS.length >= 2, PASOS);
  for (const e of PASOS) {
    await escala(e === 1 ? null : e);
    let mal = [];
    for (const t of TABS) {
      await pg.evaluate(tab => { const b = document.querySelector('[data-adtab="' + tab + '"]'); if (b) b.click(); }, t);
      await pg.waitForTimeout(280);
      const r = await mirar();
      if (r.doc > 360 + 1) mal.push(t + ': el documento mide ' + r.doc);
      if (r.fuera.length) mal.push(t + ': se sale ' + JSON.stringify(r.fuera[0]));
      if (r.recorta.length) mal.push(t + ': recorta ' + JSON.stringify(r.recorta[0]));
      if (r.altos.length) mal.push(t + ': corta por alto ' + JSON.stringify(r.altos[0]));
    }
    ok('a ' + e + ' × no se sale ni se recorta nada en las ocho pestañas', !mal.length, mal.slice(0, 4));
  }

  /* ── 5-bis · Las pantallas del alumno no empeoran ──────────────
     `css/app.css` viste también la portada y la lista de Misiones, así
     que el ajuste del maestro las alcanza. Aquí no se pide que estén
     perfectas —tienen cosas que ya se salen a propósito, como el halo
     de la tarjeta de asistencia— sino que **no empeoren**: lo que se
     compara es contra el mismo recuento a escala 1, que es la única
     medida honesta. */
  console.log('\n── con la letra grande, las pantallas del alumno no empeoran ──');
  {
    const VISTAS = ['view-inicio', 'view-misiones', 'view-rutas', 'view-perfil', 'view-ajustes'];
    const foto = async () => {
      const o = {};
      for (const vid of VISTAS) {
        await pg.evaluate(id => {
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          const v = document.getElementById(id); if (v) v.classList.add('active');
        }, vid);
        await pg.waitForTimeout(280);
        o[vid] = await pg.evaluate(() => {
          const raiz = document.querySelector('.view.active'); const W = window.innerWidth;
          let fuera = 0, recorta = 0;
          raiz.querySelectorAll('*').forEach(el => {
            if (!el.getClientRects().length) return;
            const cs = getComputedStyle(el); if (cs.position === 'fixed') return;
            const b = el.getBoundingClientRect();
            if (b.width > 0 && b.right > W + 1) fuera++;
            if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 1) recorta++;
          });
          const h = raiz.querySelector('.app-header');
          return { fuera, recorta, doc: document.documentElement.scrollWidth, hdr: h ? Math.round(h.getBoundingClientRect().height) : 0 };
        });
      }
      return o;
    };
    await escala(null);
    const base = await foto();
    await escala(PASOS[PASOS.length - 1]);
    const alto = await foto();
    const peor = [];
    for (const vid of VISTAS) {
      if (alto[vid].fuera > base[vid].fuera) peor.push(vid + ': se sale más (' + base[vid].fuera + '→' + alto[vid].fuera + ')');
      if (alto[vid].recorta > base[vid].recorta) peor.push(vid + ': recorta más (' + base[vid].recorta + '→' + alto[vid].recorta + ')');
      if (alto[vid].doc > base[vid].doc) peor.push(vid + ': el documento se ensancha');
    }
    ok('ninguna se sale ni se recorta más que a escala 1', !peor.length, peor.slice(0, 5));
    /* Y la marca de la portada no crece: si creciera, el encabezado se
       llevaría un sexto de la pantalla del alumno y los botones se irían
       fuera. Es la excepción del CSS, comprobada donde se ve. */
    ok('el encabezado de la portada no crece con A+',
      alto['view-inicio'].hdr === base['view-inicio'].hdr,
      { escala1: base['view-inicio'].hdr, tope: alto['view-inicio'].hdr });
  }

  /* ── 6 · El arrastre de la barra de grupos, con la letra grande ──
     Es la razón por la que se descartó `zoom`: desalinea las
     coordenadas del puntero. Con una variable sobre font-size no se
     toca ni una coordenada, y esto es lo que lo demuestra. */
  console.log('\n── la barra de grupos se sigue ordenando con el dedo ──');
  /* Se vuelve a Mi aula a propósito: la comprobación de antes se quedó en
     Ajustes, y una barra que no está en pantalla no tiene coordenadas —el
     arrastre no fallaría, simplemente no habría dónde arrastrar—. */
  await aula();
  await escala(PASOS[PASOS.length - 1]);
  await pg.waitForTimeout(400);
  const orden = () => pg.$$eval('.ad-gr-chip[data-gid] .ad-gr-gs', ns => ns.map(n => n.textContent.trim()).join(' '));
  const dedo = async (desde, hasta, espera, pasos) => {
    const cajas = await pg.$$eval('.ad-gr-chip[data-gid]', ns => ns.map(n => {
      const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, l: r.left };
    }));
    const a = cajas[desde], z = cajas[hasta];
    await pg.evaluate(([x, y]) => document.elementFromPoint(x, y).dispatchEvent(
      new PointerEvent('pointerdown', { clientX: x, clientY: y, pointerType: 'touch', bubbles: true, button: 0 })), [a.x, a.y]);
    await pg.waitForTimeout(espera);
    for (let i = 1; i <= pasos; i++) {
      const x = a.x + (z.l + 6 - a.x) * i / pasos, y = a.y + (z.y - a.y) * i / pasos;
      await pg.evaluate(([x, y]) => document.dispatchEvent(
        new PointerEvent('pointermove', { clientX: x, clientY: y, pointerType: 'touch', bubbles: true })), [x, y]);
      await pg.waitForTimeout(25);
    }
    await pg.evaluate(() => document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true })));
    await pg.waitForTimeout(350);
  };
  await pg.evaluate(tab => { const b = document.querySelector('[data-adtab="lista"]'); if (b) b.click(); });
  await pg.waitForTimeout(300);
  const antesOrden = await orden();
  await dedo(5, 0, 480, 8);
  const despOrden = await orden();
  ok('con la letra en el tope, el grupo se mueve igual', despOrden !== antesOrden && despOrden.startsWith('4º-1'),
    { antes: antesOrden, despues: despOrden });

  /* ── 7 · El papel no crece ── */
  console.log('\n── el papel no crece con A+ ──');
  await pg.emulateMedia({ media: 'print' });
  await pg.waitForTimeout(200);
  ok('en papel la variable vale 1, con el ajuste puesto', (await leerFz()) === '1', await leerFz());
  await pg.emulateMedia({ media: 'screen' });

  /* ── 8 · Aguanta cerrar la aplicación y no toca los datos ── */
  console.log('\n── aguanta cerrar la aplicación, y no se cuela en los datos ──');
  await escala(null);
  await pg.evaluate(() => { document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active'); });
  await pg.click('#view-admin .lm-btn'); await pg.waitForTimeout(150);
  await pg.click('#view-admin .lm-btn'); await pg.waitForTimeout(250);
  const antesRec = await leerFz();
  const admiAntes = await pg.evaluate(() => localStorage.getItem('METAS_ADMIN_V1'));
  await pg.reload({ waitUntil: 'load' });
  await pg.waitForFunction(() => typeof window.renderAdmin === 'function');
  await pg.waitForTimeout(400);
  ok('al volver a abrir sigue puesto', (await leerFz()) === antesRec, { antes: antesRec, ahora: await leerFz() });
  ok('se guarda en su propia llave', await pg.evaluate(() => localStorage.getItem('METAS_LETRA_V1') !== null));
  /* METAS_ADMIN_V1 viaja a la nube y se fusiona dato por dato con el otro
     equipo del maestro: una preferencia de vista no entra ahí. */
  ok('y NO toca los datos del maestro', await pg.evaluate(a => localStorage.getItem('METAS_ADMIN_V1') === a, admiAntes));

  ok('sin errores de JavaScript', errores.length === 0, errores.slice(0, 4));

  await nav.close();
  console.log('\n────────────────────────────────────────────────────────');
  console.log(fallos === 0
    ? '✅ TODO EN VERDE: el maestro puede agrandar la letra sin romper nada.'
    : '✖ ' + fallos + ' problema(s).');
  process.exit(fallos ? 1 : 0);
})();
