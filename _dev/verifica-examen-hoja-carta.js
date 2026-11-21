/* =====================================================================
   M.E.T.A.S · El examen impreso se ajusta a la carta, no a la ventana
   ---------------------------------------------------------------------
   El ajuste de tamaño que trae cada hoja de examen (`fit`) medía con el
   ancho de la ventana donde se abría y contra una meta de alto pensada
   para márgenes de 5 mm. El 21 de noviembre de 2026 eso eran 27 hojas en
   tres páginas medidas al ancho de la carta y 56 impresas desde una
   computadora. El motor (js/motor-misiones.js, `_aLaCarta`) ahora le
   dice a cada hoja con qué carta se mide: la suya, con sus márgenes.

   Aquí, sin navegador y con hojas de mentira:

   · una hoja que no fija su ancho se dispone, en la pantalla, al ancho
     útil de su carta (215,9 mm menos los márgenes de su @page);
   · una que ya lo fija no se toca a lo ancho;
   · la meta de cada bloque no pasa del alto útil de su carta, menos el
     relleno de arriba (el primero) y menos el pie; una meta que ya cabe
     sale con el mismo número que escribió la misión;
   · lo que la hoja guarda al fondo es el alto del pie;
   · la letra se mide como se imprime, en el teléfono y en la computadora;
   · una hoja que no se reconoce (sin @page, apaisada, otro papel) sale
     como la escribió la misión;
   · con el centro y sin él, y sin repetirse si la hoja pasa dos veces;
   · sin sesión la hoja sale como la escribió la misión, y lo único que
     se le pone es la medida de la carta.

   Y con las hojas de verdad: TODAS las plantillas de examen de las
   misiones (y la de js/motor-mision.js) se reconocen, y ninguna queda
   con una meta más alta que su página.

   En el navegador, con las páginas contadas:
   _dev/verifica-examen-dos-paginas.js.

   Uso: node _dev/verifica-examen-hoja-carta.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t, extra) => { console.log((c ? '✓ ' : '✘ ') + t + (c || extra === undefined ? '' : '  → ' + extra)); if (!c) fallos++; };

/* ── el motor, en una página de mentira ── */
const sandbox = {
  console, URL, setTimeout, clearTimeout,
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  location: { href: 'http://127.0.0.1:8080/misiones/x/x.html', search: '' },
  document: {
    addEventListener() {}, removeEventListener() {},
    getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
    createElement() { return { style: {} }; },
    readyState: 'complete',
  },
  navigator: {},
  addEventListener() {}, removeEventListener() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/motor-misiones.js'), 'utf8'), sandbox, { filename: 'js/motor-misiones.js' });
const hoja = sandbox.MotorMisiones.centro.hoja;

const CENTRO = { id: 'c-a', nombre: 'Centro Ficticio Las Flores', logo: 'data:image/jpeg;base64,QUJD', direccion: 'Colonia Ficticia', municipio: 'Villanueva', departamento: 'Cortés', docente: 'Docente Ficticia' };
const PIE = 6.2;

/* Una hoja como las que escriben las misiones. */
function hojaDe({ pagina, cuerpo, metas }) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Evaluación · Forma 1</title><style>*{margin:0;padding:0;box-sizing:border-box;}'
    + 'body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;' + cuerpo + '}'
    + (pagina === null ? '' : '@media print{@page{' + pagina + '}body{padding-bottom:9mm;}}') + '</style></head><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · Tema · Educación Básica · Ciencias Naturales</h2>'
    + '<div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>'
    + '<div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span></div></div><p>1.</p></div>'
    + '<div class="pauta-wrap" id="pautaPage"><p>Pauta</p></div><div class="print-foot"><span class="forma-tag">Forma 1</span></div>'
    + (metas ? '<script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);}fit("evalPage",' + metas[0] + ',0.55,1.45);fit("pautaPage",' + metas[1] + ',0.55,1.3);})();</script>' : '')
    + '</body></html>';
}
const marca = h => (h.match(/<style data-metas-carta="([0-9.]+) ([0-9.]+)">/) || []).slice(1).map(Number);
const metasDe = h => { const o = []; h.replace(/fit\("([A-Za-z]+)",([0-9.]+),/g, (m, id, mm) => { o.push(+mm); return m; }); return o; };
const cerca = (a, b) => Math.abs(a - b) < 0.051;

console.log('── hojas de mentira ──');
/* 1 · La de pensamiento crítico: márgenes de 12,7 mm, sin ancho fijo. */
let h = hoja(hojaDe({ pagina: 'size:letter portrait;margin:12.7mm;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] }), null);
ok(/@media screen\{html\{width:190\.5mm;margin:0 auto;\}\}/.test(h), 'márgenes de 12,7 mm y sin ancho fijo: en la pantalla la hoja mide 190,5 mm de ancho, el útil de su carta');
ok(cerca(marca(h)[0], 190.5) && cerca(marca(h)[1], 254), 'la hoja lleva escrito con qué carta se mide: 190,5 × 254 mm', marca(h).join(' × '));
ok(cerca(metasDe(h)[0], 254 - 1 - PIE) && cerca(metasDe(h)[1], 254 - PIE), 'las metas de 250 mm bajan a lo que cabe: 246,8 el examen y 247,8 la pauta', metasDe(h).join(' y '));
ok(/@media print\{body\{padding-bottom:6\.2mm;\}\}<\/style><\/head>/.test(h) && h.indexOf('padding-bottom:6.2mm') > h.indexOf('padding-bottom:9mm'),
  'al fondo se guarda el alto del pie (6,2 mm), y la regla va después de la de la misión');
ok(/html\{-webkit-text-size-adjust:100%;text-size-adjust:100%;text-rendering:geometricPrecision;\}/.test(h), 'la letra se mide como se imprime: sin el agrandado del teléfono ni el redondeo de la pantalla');
ok(!/@media screen\{[^}]*\{[^}]*(font-size|zoom)/.test(h), 'no se toca el tamaño de la letra');

/* 2 · La más común: márgenes de 5 y 7 mm, ancho fijo de 201,9 mm. */
h = hoja(hojaDe({ pagina: 'size:letter portrait;margin:5mm 7mm;', cuerpo: 'padding:1mm 5mm;width:201.9mm;margin:0 auto;', metas: [252, 252] }), null);
ok(!/html\{width/.test(h), 'una hoja que ya fija su ancho no se toca a lo ancho');
ok(metasDe(h).join() === '252,252', 'sus metas de 252 mm caben en 269,4: salen como las escribió la misión', metasDe(h).join());
ok(cerca(marca(h)[0], 201.9) && cerca(marca(h)[1], 269.4), 'se mide con 201,9 × 269,4 mm', marca(h).join(' × '));

/* 3 · Ancho fijo mayor que el útil: el navegador la reduce al imprimir. */
h = hoja(hojaDe({ pagina: 'size:letter portrait;margin:8mm 10mm;', cuerpo: 'padding:4mm 6mm;width:201.9mm;margin:0 auto;', metas: [252, 252] }), null);
ok(cerca(marca(h)[1], 263.4 * 201.9 / 195.9) && metasDe(h).join() === '252,252',
  'una hoja de 201,9 mm en una carta de 195,9 útiles se reduce al imprimir y le cabe más: 271,5 mm, y sus metas no cambian', marca(h).join(' × ') + ' · ' + metasDe(h).join());

/* 4 · Márgenes de 10 mm, sin ancho fijo, con «size:letter» a secas. */
h = hoja(hojaDe({ pagina: 'size:letter;margin:10mm;', cuerpo: 'padding:4mm 6mm;', metas: [250, 250] }), null);
ok(/html\{width:195\.9mm/.test(h) && cerca(metasDe(h)[0], 259.4 - 4 - PIE) && metasDe(h)[1] === 250,
  'márgenes de 10 mm: 195,9 mm de ancho; el examen baja a 249,2 y la pauta, que cabe, sigue en 250', metasDe(h).join(' y '));

/* 5 · Sin ajuste propio (Fin de grado): se dispone a la carta igual. */
h = hoja(hojaDe({ pagina: 'size:letter portrait;margin:8mm 10mm;', cuerpo: 'padding:4mm 6mm;', metas: null }), null);
ok(/html\{width:195\.9mm/.test(h) && cerca(marca(h)[1], 263.4), 'una hoja sin ajuste propio también se dispone al ancho de su carta');

/* 6 · Lo que no se reconoce sale como lo escribió la misión. */
const sinCarta = [
  ['sin @page', hojaDe({ pagina: null, cuerpo: 'padding:1mm 5mm;', metas: [250, 250] })],
  ['apaisada', hojaDe({ pagina: 'size:letter landscape;margin:11mm 12mm;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] })],
  ['en otro papel', hojaDe({ pagina: 'size:A4 portrait;margin:10mm;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] })],
  ['con márgenes en porcentaje', hojaDe({ pagina: 'size:letter portrait;margin:5%;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] })],
];
sinCarta.forEach(([cual, cruda]) => {
  const r = hoja(cruda, null);
  ok(!marca(r).length && metasDe(r).join() === '250,250' && !/html\{/.test(r), 'una hoja ' + cual + ' no se toca');
});

/* 7 · Con el centro: lo mismo, y el ajuste del encabezado lee las metas nuevas. */
h = hoja(hojaDe({ pagina: 'size:letter portrait;margin:12.7mm;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] }), CENTRO, 'Docente Ficticia', { grado: '6º-1', parcial: 'III', fecha: '30 de septiembre de 2026' }, 'P');
ok(/data-metas-encabezado="centro"/.test(h) && cerca(marca(h)[0], 190.5) && cerca(metasDe(h)[0], 246.8), 'con el centro en el encabezado, la hoja también se mide con su carta');
ok(/var T=\{"evalPage":246\.8,"pautaPage":247\.8\}/.test(h), 'el ajuste del encabezado con centro trabaja con las metas que caben', (h.match(/var T=\{[^}]*\}/) || [''])[0]);
ok((h.match(/data-metas-carta/g) || []).length === 1 && hoja(h, CENTRO, 'Docente Ficticia') === h, 'una hoja que pasa dos veces por el motor no se cambia dos veces');

/* 8 · Sin sesión: la hoja de la misión, con la medida de la carta y nada más. */
console.log('── sin sesión ──');
const sinSesion = sandbox.MotorMisiones.centro.sinSesion;
const cruda = hojaDe({ pagina: 'size:letter portrait;margin:12.7mm;', cuerpo: 'padding:1mm 5mm;', metas: [250, 250] });
h = sinSesion(cruda);
ok(cerca(marca(h)[0], 190.5) && cerca(metasDe(h)[0], 246.8) && cerca(metasDe(h)[1], 247.8), 'sin sesión la hoja también se mide con su carta');
const sinMedida = h.replace(/<style data-metas-carta[\s\S]*?<\/style>/, '').replace('fit("evalPage",246.8,', 'fit("evalPage",250,').replace('fit("pautaPage",247.8,', 'fit("pautaPage",250,');
ok(sinMedida === cruda, 'y es lo ÚNICO que cambia: ni centro, ni título nuevo, ni firma en el pie');
ok(sinSesion('<html><head></head><body>otra cosa</body></html>') === '<html><head></head><body>otra cosa</body></html>', 'lo que no es una hoja de examen no se toca');
/* Y por la impresión envuelta, que es por donde pasa de verdad. */
const escrito = [];
sandbox.open = () => ({ document: { write(t) { escrito.push(String(t)); }, close() {} }, close() {}, focus() {}, print() {} });
sandbox._evalPrintData = { listo: true };
sandbox.printEval = function () { const w = sandbox.open('', '_blank', ''); w.document.write(cruda); w.document.close(); };
sandbox.MotorMisiones.centro.envolver();
sandbox.printEval();
ok(escrito.join('') === h, 'al imprimir sin sesión, lo que llega a la ventana es esa hoja');

/* ══════════ Las plantillas de verdad ══════════ */
console.log('── las hojas de las misiones ──');
function archivosJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosJs(p));
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
/* Los márgenes y el cuerpo de una plantilla, leídos aquí por separado:
   la sonda no le pregunta al motor qué midió, lo calcula ella. */
function esperado(plantilla) {
  const pag = (plantilla.match(/@page\s*\{([^}]*)\}/) || [])[1] || '';
  const mar = ((pag.match(/margin\s*:\s*([^;}]+)/) || [])[1] || '').trim().split(/\s+/).map(parseFloat);
  const [a, d = a, b = a, i = d] = mar;
  const cuerpo = (plantilla.match(/body\s*\{([^}]*)\}/) || [])[1] || '';
  const fijo = parseFloat((cuerpo.match(/(?:^|;)\s*width\s*:\s*([0-9.]+)mm/) || [])[1]) || 0;
  const relleno = parseFloat((cuerpo.match(/(?:^|;)\s*padding\s*:\s*([0-9.]+)mm/) || [])[1]) || 0;
  const util = 215.9 - d - i;
  return { util, fijo, relleno, alto: (279.4 - a - b) * (fijo > util ? fijo / util : 1) };
}
const fuentes = archivosJs(path.join(RAIZ, 'misiones')).concat([path.join(RAIZ, 'js/motor-mision.js')]);
let plantillas = 0, libres = 0, bajadas = 0;
const sinMarca = [], anchoMalo = [], metaAlta = [], sinAnchoEnPantalla = [];
const porMargen = {};
for (const f of fuentes) {
  const s = fs.readFileSync(f, 'utf8');
  let i = 0;
  while ((i = s.indexOf('<div class="ph">', i)) >= 0) {
    /* La plantilla va del <!DOCTYPE de antes al </html> de después. */
    const ini = s.lastIndexOf('<!DOCTYPE html>', i);
    const fin = s.indexOf('</html>', i);
    i++;
    if (ini < 0 || fin < 0) continue;
    const plantilla = s.slice(ini, fin + 7).replace(/<\\\/script>/g, '</script>').replace(/<\/` \+ `script>/g, '</script>');
    plantillas++;
    const rel = path.relative(RAIZ, f);
    const r = hoja(plantilla, null);
    const m = marca(r), e = esperado(plantilla);
    if (!m.length) { sinMarca.push(rel); continue; }
    const margen = (plantilla.match(/@page\s*\{[^}]*margin\s*:\s*([^;}]+)/) || [])[1].trim();
    porMargen[margen] = (porMargen[margen] || 0) + 1;
    if (!cerca(m[0], e.fijo || e.util) || !cerca(m[1], e.alto)) anchoMalo.push(rel + ' (' + m.join(' × ') + ', esperado ' + (e.fijo || e.util).toFixed(1) + ' × ' + e.alto.toFixed(1) + ')');
    if (!e.fijo) { libres++; if (!new RegExp('@media screen\\{html\\{width:' + e.util.toFixed(1).replace('.', '\\.') + 'mm').test(r)) sinAnchoEnPantalla.push(rel); }
    const antes = metasDe(plantilla), despues = metasDe(r);
    despues.forEach((mm, k) => {
      const tope = e.alto - (k === 0 ? e.relleno : 0) - PIE;
      if (mm > tope + 0.051 || mm > antes[k]) metaAlta.push(rel + ' · bloque ' + (k + 1) + ': ' + mm + ' mm de ' + tope.toFixed(1));
      if (mm < antes[k]) bajadas++;
    });
  }
}
ok(plantillas >= 160, 'se revisan las plantillas de examen de todas las misiones (' + plantillas + ')');
ok(!sinMarca.length, 'todas se reconocen: ninguna queda midiéndose con la ventana', sinMarca.join(', '));
ok(!anchoMalo.length, 'cada una se mide con el ancho y el alto útiles de SU carta', anchoMalo.slice(0, 5).join(' | '));
ok(!sinAnchoEnPantalla.length && libres > 0, 'las ' + libres + ' plantillas que no fijaban su ancho ahora se disponen al ancho de su carta', sinAnchoEnPantalla.slice(0, 5).join(', '));
ok(!metaAlta.length, 'ninguna meta del ajuste pasa de lo que cabe en su página, y ninguna sube', metaAlta.slice(0, 5).join(' | '));
console.log('   márgenes: ' + Object.entries(porMargen).map(([k, v]) => k + ' → ' + v).join(' · ') + ' · metas que bajaron: ' + bajadas);

console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ Todo en orden');
process.exit(fallos ? 1 : 0);
