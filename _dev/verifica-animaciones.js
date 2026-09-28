#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La animación que explica el tema, leída del archivo
   ------------------------------------------------------------
   La animación va misión por misión por la ruta de Matemáticas, y
   lo que se multiplica al copiar el bloque de una misión a otra no
   son solo los aciertos. Esta sonda lee del ARCHIVO todas las que
   la montan —abrirlas con Playwright lo hace la otra,
   verifica-animacion-mision— y mira lo que se rompe al copiar:

   1. ⚠️ **Va justo después de la historia**, en la sección por la
      que el alumno entra. Así lo pidió el autor, y no es capricho:
      la historia termina diciendo qué va a ver el alumno, y lo
      tiene que ver ahí, no dos tarjetas más abajo.
   2. **La hoja va DESPUÉS del CSS de la misión**, que es de donde
      saca sus colores. Al revés no da error: da botones sin color.
   3. **El aparato antes que la escena**, y la escena monta el
      bloque que de verdad está en la tarjeta. Copiar el bloque y
      olvidar cambiar el id deja la tarjeta con su frase de reserva
      para siempre, sin un solo error en la consola.
   4. **La tarjeta trae su frase de reserva.** Si el aparato no
      llega, el alumno lee eso y no un hueco.
   5. **La escena no gasta de más ni sale del sitio**: ni un
      setInterval, ni un requestAnimationFrame (entre toque y toque
      el teléfono no tiene que hacer nada), ni una dirección de
      fuera.
   6. **Mirarla no da XP ni marca la sección**: es la regla de los
      videos. La escena no llama a fin(), ni a pts(), ni a ningún
      logro.
   7. **El aparato está en el armazón del service worker**, o sin
      señal la tarjeta se queda con su frase de reserva.

   Como las demás sondas que buscan algo prohibido, quita los
   COMENTARIOS antes de buscar: el sitio donde se explica por qué no
   hay un requestAnimationFrame es justo donde está escrita la
   palabra.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

function sinComentariosJs(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"])\/\/[^\n]*/g, '$1');
}
function sinComentariosHtml(s) { return s.replace(/<!--[\s\S]*?-->/g, ''); }

/* Busca el cierre del <div> que abre en `desde`, contando los <div> de
   dentro. No hace falta un analizador de HTML para esto: las misiones
   no traen <div> dentro de atributos ni de comentarios (se quitan antes). */
function finDelDiv(html, desde) {
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = desde;
  let hondo = 0, m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') { hondo--; if (hondo === 0) return re.lastIndex; }
    else hondo++;
  }
  return -1;
}

/* ── las misiones que la montan ────────────────────────────── */
const misiones = [];
for (const dir of fs.readdirSync(path.join(RAIZ, 'misiones'))) {
  const carpeta = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(carpeta).isDirectory()) continue;
  for (const f of fs.readdirSync(carpeta)) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(carpeta, f), 'utf8');
    if (/data-animacion\b/.test(html)) misiones.push({ dir, archivo: f, carpeta, html });
  }
}

console.log(`\nLa animación que explica el tema: ${misiones.length} misión(es) la montan`);
ok(misiones.length > 0, 'hay por lo menos una (si no, esta sonda no está mirando nada)');

/* ── 7 · el aparato, en el armazón ────────────────────────── */
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const lista = (sw.match(/const STATIC_ASSETS = \[([\s\S]*?)\n\];/) || [])[1] || '';
const listaSinComent = sinComentariosJs(lista);
ok(listaSinComent.includes("'./js/animacion-mision.js'") && listaSinComent.includes("'./css/animacion-mision.css'"),
  'el aparato y su hoja están en STATIC_ASSETS de sw.js (sin señal también se ven)');

/* ── el aparato mismo ─────────────────────────────────────── */
const aparato = sinComentariosJs(fs.readFileSync(path.join(RAIZ, 'js/animacion-mision.js'), 'utf8'));
ok(!/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(aparato),
  'el aparato no deja un bucle de dibujo corriendo (todo el movimiento es de CSS)');
ok(/prefers-reduced-motion/.test(aparato), 'el aparato pregunta por «reducir movimiento»');
ok(/aria-live/.test(aparato), 'la frase de cada paso se anuncia (aria-live)');
const hoja = fs.readFileSync(path.join(RAIZ, 'css/animacion-mision.css'), 'utf8');
ok(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(hoja), 'la hoja apaga el movimiento con «reducir movimiento»');
ok(/min-height:\s*44px/.test(hoja), 'los botones tienen 44 px de blanco de toque');

for (const m of misiones) {
  console.log(`\n${m.dir}/${m.archivo}`);
  const html = sinComentariosHtml(m.html);

  /* 1 · justo después de la historia, en la sección por la que se entra */
  const iSit = html.search(/<div\b[^>]*\bdata-situacion\b[^>]*>/);
  const iAni = html.search(/<div\b[^>]*\bdata-animacion\b[^>]*>/);
  ok(iSit >= 0, 'la misión tiene su historia de arranque (data-situacion)');
  if (iSit >= 0 && iAni >= 0) {
    const finSit = finDelDiv(html, iSit);
    const entre = html.slice(finSit, iAni).trim();
    ok(finSit > 0 && entre === '', 'la animación va JUSTO después de la historia, sin nada en medio', entre.slice(0, 60));
    const antes = html.slice(0, iSit);
    const sec = antes.lastIndexOf('<div class="sec');
    const cab = sec >= 0 ? html.slice(sec, html.indexOf('>', sec) + 1) : '';
    ok(/\bactive\b/.test(cab), 'y las dos están en la sección por la que el alumno entra (la marcada active)', cab);
  }

  /* 4 · la frase de reserva, y 3 · el id que monta la escena */
  const finAni = iAni >= 0 ? finDelDiv(html, iAni) : -1;
  const tarjeta = finAni > 0 ? html.slice(iAni, finAni) : '';
  const idCont = ((tarjeta.match(/<div\b[^>]*\bid="([^"]+)"/) || [])[1]) || '';
  ok(!!idCont, 'la tarjeta tiene el bloque que el aparato llena (un <div id=…>)', idCont);
  const reserva = tarjeta.replace(/<h2[\s\S]*?<\/h2>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  ok(reserva.length >= 40, 'y trae su frase de reserva por si el aparato no llega', reserva.slice(0, 50));

  /* 2 · la hoja, después del CSS de la misión */
  const iCssMision = m.html.search(/<link[^>]*href="css\/[^"]+\.css"/);
  const iCssAnim = m.html.indexOf('href="../../css/animacion-mision.css"');
  ok(iCssAnim > 0, 'enlaza la hoja de la animación');
  ok(iCssMision < 0 || iCssAnim > iCssMision, 'la hoja de la animación va DESPUÉS del CSS de la misión (de ahí saca sus colores)');

  /* 3 · el aparato antes que la escena, y la escena monta ESE bloque */
  const iAparato = m.html.indexOf('src="../../js/animacion-mision.js"');
  const escenas = [...m.html.matchAll(/src="(js\/animacion-[^"?]+\.js)(?:\?[^"]*)?"/g)].map(x => ({ src: x[1], i: x.index }));
  ok(iAparato > 0, 'carga el aparato (js/animacion-mision.js)');
  ok(escenas.length > 0, 'carga su escena (js/animacion-<tema>.js)');
  let montaEse = false;
  for (const e of escenas) {
    ok(e.i > iAparato, `la escena ${e.src} se carga DESPUÉS del aparato`);
    const ruta = path.join(m.carpeta, e.src);
    if (!fs.existsSync(ruta)) { ok(false, `existe ${e.src}`); continue; }
    const fuente = fs.readFileSync(ruta, 'utf8');
    const js = sinComentariosJs(fuente);
    if (js.includes(`AnimacionMision.montar('#${idCont}'`) || js.includes(`AnimacionMision.montar("#${idCont}"`)) montaEse = true;

    /* 5 · no gasta de más ni sale del sitio */
    ok(!/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(js), `${e.src}: sin bucle de dibujo (ni setInterval ni requestAnimationFrame)`);
    ok(!/https?:\/\//.test(js), `${e.src}: no pide nada fuera del sitio`);
    /* 6 · mirarla no da XP */
    const premios = js.match(/\b(fin|pts|unlockAchievement|saveProgress|launchConfetti)\s*\(/g);
    ok(!premios, `${e.src}: mirarla no da XP, ni estrella, ni logro`, premios || undefined);
  }
  ok(montaEse, `la escena monta el bloque que está en la tarjeta (#${idCont})`);
}

console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ la animación está donde va, se ve sin señal y no regala nada'));
process.exit(fallos ? 1 : 0);
