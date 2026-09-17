#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   verifica-avisos-flex.js · que las cajas de aviso no se partan en dos columnas

   La caja de aviso de las misiones (`.tip`) es `display:flex`: un icono a la
   izquierda (`<span class="ti">`) y el texto a la derecha, dentro de UN
   elemento. Si el texto va suelto dentro de la caja con un <strong> en medio,
   el navegador hace de cada pedazo un ítem de la fila y el aviso sale en dos
   o tres columnas estrechas, con el texto cortado en vertical.

   Se descubrió el 17 de septiembre de 2026 MIRANDO una captura a 360 px de la
   misión de los escenarios por venir, con la ruta ya reescrita: cinco avisos
   escritos como `<p class="tip">texto <strong>…</strong> texto</p>` llevaban
   publicados desde el estreno de la misión. No daba ningún error: el HTML es
   válido, el CSS es válido y ninguna sonda mira cómo se reparte una caja. Es
   la familia del `.pf-p` naranja sobre naranja y del Escudo marcado en rojo:
   lo que se pinta perfectamente y está mal.

   La regla: dentro de una `.tip` que sea flex, el contenido va en UN hijo de
   bloque (`<div>` o `<p>`), con el icono opcional delante en su `<span
   class="ti">`. Se lee el CSS de cada misión para saber si su `.tip` es flex:
   en las que no lo es, el texto suelto se pinta bien y no se acusa a nadie.

   node _dev/verifica-avisos-flex.js            (está en npm test)
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');

let fallos = 0, misiones = 0, cajas = 0;
const mal = m => { fallos++; console.log('  ❌ ' + m); };

function tipEsFlex(css) {
  const m = css.match(/(^|[}\s])\.tip\s*\{([^}]*)\}/);
  return !!(m && /display\s*:\s*flex/.test(m[2]));
}
function cajasSueltas(html) {
  const re = /<(p|div)([^>]*)class="([^"]*\btip\b[^"]*)"[^>]*>/g;
  const malas = []; let m;
  while ((m = re.exec(html))) {
    const tag = m[1], ini = m.index + m[0].length;
    let fin = -1;
    if (tag === 'p') fin = html.indexOf('</p>', ini);
    else { let prof = 1; const r2 = /<\/?div\b/g; r2.lastIndex = ini; let x; while ((x = r2.exec(html))) { prof += x[0] === '<div' ? 1 : -1; if (!prof) { fin = x.index; break; } } }
    if (fin < 0) continue;
    cajas++;
    const inner = html.slice(ini, fin).trim();
    /* Sano: [icono] + UN hijo de bloque que lo envuelve todo. */
    const soloBloque = /^(?:<span class="ti">[\s\S]*?<\/span>\s*)?<(div|p)\b[^>]*>[\s\S]*<\/\1>$/.test(inner)
      && !/<\/(div|p)>\s*[^\s<][\s\S]*$/.test(inner);
    /* Malo: hay un elemento en línea como hijo directo Y texto suelto al lado. */
    const inl = /<(strong|b|em|i|code|span|a)\b/.test(inner.replace(/^<span class="ti">[\s\S]*?<\/span>/, ''));
    if (inl && !soloBloque) malas.push({ linea: html.slice(0, m.index).split('\n').length, texto: inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').slice(0, 70) });
  }
  return malas;
}

console.log('\n🧱 Que las cajas de aviso no se partan en columnas\n');
fs.readdirSync(path.join(RAIZ, 'misiones')).sort().forEach(dir => {
  const d = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(d).isDirectory()) return;
  const htmls = fs.readdirSync(d).filter(f => /\.html$/.test(f) && !/^juego-/.test(f));
  const cssDir = path.join(d, 'css');
  const css = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter(f => /\.css$/.test(f)).map(f => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n') : '';
  htmls.forEach(h => {
    const html = fs.readFileSync(path.join(d, h), 'utf8');
    const estilo = css + (html.match(/<style[\s\S]*?<\/style>/gi) || []).join('\n');
    if (!tipEsFlex(estilo)) return;
    misiones++;
    cajasSueltas(html).forEach(c => mal(`${dir}/${h}:${c.linea} · el aviso «${c.texto}…» lleva el texto suelto dentro de una caja flex: va dentro de un <div>`));
  });
});
console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : `\n✅ ${cajas} cajas de aviso en ${misiones} misiones con .tip flex, todas en una columna.\n`);
process.exit(fallos ? 1 : 0);
